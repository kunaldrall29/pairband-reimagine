// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {PairbandLaunchpad} from "./PairbandLaunchpad.sol";
import {PairbandToken} from "./PairbandToken.sol";

interface IERC20S {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

interface ITokenMessengerV2 {
    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken,
        bytes32 destinationCaller,
        uint256 maxFee,
        uint32 minFinalityThreshold
    ) external returns (uint64);
}

/// @title PairbandSettler
/// @notice Arc inbox. CCTP mints USDC here (domain 26). settleBuy routes into the
///         launchpad/book. bridgeOut burns Arc USDC back to any allowed domain.
/// @dev    No proxy. Replay-protected (sourceDomain, nonce). Messenger-only ingest.
contract PairbandSettler {
    error Locked();
    error NotMessenger();
    error UnknownDomain();
    error AlreadySpent();
    error NotOwner();
    error ZeroAmount();
    error TransferFailed();
    error SameDomain();

    uint256 private unlocked = 1;
    modifier lock() {
        if (unlocked != 1) revert Locked();
        unlocked = 0;
        _;
        unlocked = 1;
    }

    uint32 public constant ARC_DOMAIN = 26;

    IERC20S public immutable usdc;
    PairbandLaunchpad public immutable pad;
    address public immutable messenger;
    ITokenMessengerV2 public immutable cctp;

    mapping(uint32 => bool) public allowed;
    mapping(bytes32 => Credit) public credits;

    struct Credit {
        address account;
        uint128 amount;
        uint32 sourceDomain;
        bool spent;
    }

    event Ingested(bytes32 indexed id, address indexed account, uint32 sourceDomain, uint256 amount);
    event Settled(bytes32 indexed id, uint256 indexed launchId, address indexed account, uint256 usdcIn, uint256 tokensOut);
    event BridgedOut(address indexed account, uint32 destDomain, uint256 amount, bytes32 mintRecipient);

    constructor(address usdc_, address pad_, address messenger_, address cctp_) {
        require(usdc_ != address(0) && pad_ != address(0), "zero");
        usdc = IERC20S(usdc_);
        pad = PairbandLaunchpad(pad_);
        messenger = messenger_;
        cctp = ITokenMessengerV2(cctp_);
        allowed[0] = true; // Ethereum
        allowed[2] = true; // OP
        allowed[3] = true; // Arbitrum
        allowed[5] = true; // Solana
        allowed[6] = true; // Base
        allowed[10] = true; // Unichain
        allowed[26] = true; // Arc
    }

    function creditId(uint32 sourceDomain, uint64 nonce) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(sourceDomain, nonce));
    }

    /// @notice Called after CCTP mints USDC to this contract. Messenger (or tests via mock) only.
    function ingest(address account, uint256 amount, uint32 sourceDomain, uint64 nonce) external lock {
        if (msg.sender != messenger) revert NotMessenger();
        if (!allowed[sourceDomain] || sourceDomain == ARC_DOMAIN) revert UnknownDomain();
        if (amount == 0 || account == address(0)) revert ZeroAmount();
        bytes32 id = creditId(sourceDomain, nonce);
        if (credits[id].account != address(0)) revert AlreadySpent();
        credits[id] = Credit(account, uint128(amount), sourceDomain, false);
        emit Ingested(id, account, sourceDomain, amount);
    }

    /// @notice Spend a CCTP credit: buy on the Arc launchpad/book, tokens to the user.
    function settleBuy(bytes32 id, uint256 launchId, uint256 minOut) external lock returns (uint256 tokensOut) {
        Credit storage c = credits[id];
        if (c.account != msg.sender) revert NotOwner();
        if (c.spent) revert AlreadySpent();
        c.spent = true;
        uint256 amount = c.amount;
        if (!usdc.approve(address(pad), amount)) revert TransferFailed();
        tokensOut = pad.buy(launchId, amount, minOut);
        address token = pad.getLaunch(launchId).token;
        if (!PairbandToken(token).transfer(msg.sender, tokensOut)) revert TransferFailed();
        emit Settled(id, launchId, msg.sender, amount, tokensOut);
    }

    /// @notice Burn Arc USDC via CCTP to mint on destDomain. Tokens stay on Arc.
    function bridgeOut(uint32 destDomain, uint256 amount, bytes32 mintRecipient) external lock {
        if (amount == 0) revert ZeroAmount();
        if (!allowed[destDomain] || destDomain == ARC_DOMAIN) revert SameDomain();
        if (!usdc.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        if (!usdc.approve(address(cctp), amount)) revert TransferFailed();
        cctp.depositForBurn(amount, destDomain, mintRecipient, address(usdc), bytes32(0), 0, 0);
        emit BridgedOut(msg.sender, destDomain, amount, mintRecipient);
    }

    function toBytes32(address a) external pure returns (bytes32) {
        return bytes32(uint256(uint160(a)));
    }
}
