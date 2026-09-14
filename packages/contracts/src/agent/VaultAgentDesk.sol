// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20Usdc {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

/// @title VaultAgentDesk
/// @notice On-chain desk for Pairband vault agents on Arc.
///         Agents propose band rebalances; curators execute after a delay.
///         Each agent proposal pays AGENT_FEE USDC to the treasury.
/// @dev No Uniswap v4 dependency — stores band intents that the Pairband app +
///      off-chain (or future v4) vault executor honor. Same bytecode test → main.
contract VaultAgentDesk {
    error NotCurator();
    error NotAgent();
    error ZeroAddress();
    error InvalidBand();
    error NoProposal();
    error DelayPending();
    error AlreadyActive();
    error TransferFailed();
    error Locked();

    uint256 private unlocked = 1;
    modifier nonReentrant() {
        if (unlocked != 1) revert Locked();
        unlocked = 0;
        _;
        unlocked = 1;
    }

    /// @notice $0.25 USDC (6 decimals) per agent proposal.
    uint256 public constant AGENT_FEE = 250_000;
    uint32 public constant DEFAULT_DELAY = 15; // seconds

    IERC20Usdc public immutable usdc;
    address public treasury;
    address public owner;

    struct Vault {
        address curator;
        address agent; // address(0) = open proposals
        int24 tickLower;
        int24 tickUpper;
        uint32 proposalDelay;
        bool exists;
    }

    struct Proposal {
        int24 tickLower;
        int24 tickUpper;
        address proposer;
        uint48 postedAt;
        bool active;
    }

    uint256 public vaultCount;
    mapping(uint256 => Vault) public vaults;
    mapping(uint256 => Proposal) public proposals;

    event VaultRegistered(uint256 indexed id, address curator, address agent, int24 tickLower, int24 tickUpper);
    event AgentUpdated(uint256 indexed id, address agent);
    event Proposed(uint256 indexed id, address proposer, int24 tickLower, int24 tickUpper, uint256 feePaid);
    event Rejected(uint256 indexed id, address curator);
    event Executed(uint256 indexed id, address curator, int24 tickLower, int24 tickUpper);
    event TreasuryUpdated(address treasury);

    constructor(address usdc_, address treasury_) {
        if (usdc_ == address(0) || treasury_ == address(0)) revert ZeroAddress();
        usdc = IERC20Usdc(usdc_);
        treasury = treasury_;
        owner = msg.sender;
    }

    function setTreasury(address t) external {
        if (msg.sender != owner) revert NotCurator();
        if (t == address(0)) revert ZeroAddress();
        treasury = t;
        emit TreasuryUpdated(t);
    }

    /// @notice Register a vault desk. Caller becomes curator.
    function registerVault(address agent, int24 tickLower, int24 tickUpper, uint32 proposalDelay)
        external
        returns (uint256 id)
    {
        if (tickLower >= tickUpper) revert InvalidBand();
        id = vaultCount++;
        vaults[id] = Vault({
            curator: msg.sender,
            agent: agent,
            tickLower: tickLower,
            tickUpper: tickUpper,
            proposalDelay: proposalDelay == 0 ? DEFAULT_DELAY : proposalDelay,
            exists: true
        });
        emit VaultRegistered(id, msg.sender, agent, tickLower, tickUpper);
    }

    function setAgent(uint256 id, address agent) external {
        Vault storage v = vaults[id];
        if (!v.exists) revert NoProposal();
        if (msg.sender != v.curator) revert NotCurator();
        v.agent = agent;
        emit AgentUpdated(id, agent);
    }

    /// @notice Propose a new band. Agent pays AGENT_FEE; curator proposes free.
    function propose(uint256 id, int24 tickLower, int24 tickUpper) external nonReentrant {
        Vault storage v = vaults[id];
        if (!v.exists) revert NoProposal();
        if (tickLower >= tickUpper) revert InvalidBand();

        bool isAgent = v.agent != address(0) && msg.sender == v.agent;
        bool isCurator = msg.sender == v.curator;
        if (v.agent != address(0)) {
            if (!isAgent && !isCurator) revert NotAgent();
        }

        Proposal storage p = proposals[id];
        if (p.active) revert AlreadyActive();

        uint256 feePaid = 0;
        if (isAgent) {
            feePaid = AGENT_FEE;
            if (!usdc.transferFrom(msg.sender, treasury, AGENT_FEE)) revert TransferFailed();
        }

        p.tickLower = tickLower;
        p.tickUpper = tickUpper;
        p.proposer = msg.sender;
        p.postedAt = uint48(block.timestamp);
        p.active = true;

        emit Proposed(id, msg.sender, tickLower, tickUpper, feePaid);
    }

    function reject(uint256 id) external {
        Vault storage v = vaults[id];
        if (!v.exists) revert NoProposal();
        if (msg.sender != v.curator) revert NotCurator();
        Proposal storage p = proposals[id];
        if (!p.active) revert NoProposal();
        p.active = false;
        emit Rejected(id, msg.sender);
    }

    /// @notice Curator executes after proposalDelay. Updates the live band.
    function execute(uint256 id) external {
        Vault storage v = vaults[id];
        if (!v.exists) revert NoProposal();
        if (msg.sender != v.curator) revert NotCurator();
        Proposal storage p = proposals[id];
        if (!p.active) revert NoProposal();
        if (block.timestamp < uint256(p.postedAt) + v.proposalDelay) revert DelayPending();

        v.tickLower = p.tickLower;
        v.tickUpper = p.tickUpper;
        p.active = false;

        emit Executed(id, msg.sender, v.tickLower, v.tickUpper);
    }

    function getVault(uint256 id)
        external
        view
        returns (
            address curator,
            address agent,
            int24 tickLower,
            int24 tickUpper,
            uint32 proposalDelay,
            bool exists
        )
    {
        Vault storage v = vaults[id];
        return (v.curator, v.agent, v.tickLower, v.tickUpper, v.proposalDelay, v.exists);
    }

    function getProposal(uint256 id)
        external
        view
        returns (int24 tickLower, int24 tickUpper, address proposer, uint48 postedAt, bool active)
    {
        Proposal storage p = proposals[id];
        return (p.tickLower, p.tickUpper, p.proposer, p.postedAt, p.active);
    }
}
