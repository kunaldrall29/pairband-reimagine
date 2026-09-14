import { i as __require, o as __toESM, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/@coinbase/wallet-sdk/dist/core/storage/ScopedLocalStorage.js
var ScopedLocalStorage = class ScopedLocalStorage {
	constructor(scope, module) {
		this.scope = scope;
		this.module = module;
	}
	storeObject(key, item) {
		this.setItem(key, JSON.stringify(item));
	}
	loadObject(key) {
		const item = this.getItem(key);
		return item ? JSON.parse(item) : void 0;
	}
	setItem(key, value) {
		localStorage.setItem(this.scopedKey(key), value);
	}
	getItem(key) {
		return localStorage.getItem(this.scopedKey(key));
	}
	removeItem(key) {
		localStorage.removeItem(this.scopedKey(key));
	}
	clear() {
		const prefix = this.scopedKey("");
		const keysToRemove = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (typeof key === "string" && key.startsWith(prefix)) keysToRemove.push(key);
		}
		keysToRemove.forEach((key) => localStorage.removeItem(key));
	}
	scopedKey(key) {
		return `-${this.scope}${this.module ? `:${this.module}` : ""}:${key}`;
	}
	static clearAll() {
		new ScopedLocalStorage("CBWSDK").clear();
		new ScopedLocalStorage("walletlink").clear();
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/constants.js
var standardErrorCodes = {
	rpc: {
		invalidInput: -32e3,
		resourceNotFound: -32001,
		resourceUnavailable: -32002,
		transactionRejected: -32003,
		methodNotSupported: -32004,
		limitExceeded: -32005,
		parse: -32700,
		invalidRequest: -32600,
		methodNotFound: -32601,
		invalidParams: -32602,
		internal: -32603
	},
	provider: {
		userRejectedRequest: 4001,
		unauthorized: 4100,
		unsupportedMethod: 4200,
		disconnected: 4900,
		chainDisconnected: 4901,
		unsupportedChain: 4902
	}
};
var errorValues = {
	"-32700": {
		standard: "JSON RPC 2.0",
		message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
	},
	"-32600": {
		standard: "JSON RPC 2.0",
		message: "The JSON sent is not a valid Request object."
	},
	"-32601": {
		standard: "JSON RPC 2.0",
		message: "The method does not exist / is not available."
	},
	"-32602": {
		standard: "JSON RPC 2.0",
		message: "Invalid method parameter(s)."
	},
	"-32603": {
		standard: "JSON RPC 2.0",
		message: "Internal JSON-RPC error."
	},
	"-32000": {
		standard: "EIP-1474",
		message: "Invalid input."
	},
	"-32001": {
		standard: "EIP-1474",
		message: "Resource not found."
	},
	"-32002": {
		standard: "EIP-1474",
		message: "Resource unavailable."
	},
	"-32003": {
		standard: "EIP-1474",
		message: "Transaction rejected."
	},
	"-32004": {
		standard: "EIP-1474",
		message: "Method not supported."
	},
	"-32005": {
		standard: "EIP-1474",
		message: "Request limit exceeded."
	},
	"4001": {
		standard: "EIP-1193",
		message: "User rejected the request."
	},
	"4100": {
		standard: "EIP-1193",
		message: "The requested account and/or method has not been authorized by the user."
	},
	"4200": {
		standard: "EIP-1193",
		message: "The requested method is not supported by this Ethereum provider."
	},
	"4900": {
		standard: "EIP-1193",
		message: "The provider is disconnected from all chains."
	},
	"4901": {
		standard: "EIP-1193",
		message: "The provider is disconnected from the specified chain."
	},
	"4902": {
		standard: "EIP-3085",
		message: "Unrecognized chain ID."
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/utils.js
var FALLBACK_MESSAGE = "Unspecified error message.";
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
/**
* Gets the message for a given code, or a fallback message if the code has
* no corresponding message.
*/
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
	if (code && Number.isInteger(code)) {
		const codeString = code.toString();
		if (hasKey(errorValues, codeString)) return errorValues[codeString].message;
		if (isJsonRpcServerError(code)) return JSON_RPC_SERVER_ERROR_MESSAGE;
	}
	return fallbackMessage;
}
/**
* Returns whether the given code is valid.
* A code is only valid if it has a message.
*/
function isValidCode(code) {
	if (!Number.isInteger(code)) return false;
	if (errorValues[code.toString()]) return true;
	if (isJsonRpcServerError(code)) return true;
	return false;
}
function serialize(error, { shouldIncludeStack = false } = {}) {
	const serialized = {};
	if (error && typeof error === "object" && !Array.isArray(error) && hasKey(error, "code") && isValidCode(error.code)) {
		const _error = error;
		serialized.code = _error.code;
		if (_error.message && typeof _error.message === "string") {
			serialized.message = _error.message;
			if (hasKey(_error, "data")) serialized.data = _error.data;
		} else {
			serialized.message = getMessageFromCode(serialized.code);
			serialized.data = { originalError: assignOriginalError(error) };
		}
	} else {
		serialized.code = standardErrorCodes.rpc.internal;
		serialized.message = hasStringProperty(error, "message") ? error.message : FALLBACK_MESSAGE;
		serialized.data = { originalError: assignOriginalError(error) };
	}
	if (shouldIncludeStack) serialized.stack = hasStringProperty(error, "stack") ? error.stack : void 0;
	return serialized;
}
function isJsonRpcServerError(code) {
	return code >= -32099 && code <= -32e3;
}
function assignOriginalError(error) {
	if (error && typeof error === "object" && !Array.isArray(error)) return Object.assign({}, error);
	return error;
}
function hasKey(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function hasStringProperty(obj, prop) {
	return typeof obj === "object" && obj !== null && prop in obj && typeof obj[prop] === "string";
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/errors.js
var standardErrors = {
	rpc: {
		parse: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.parse, arg),
		invalidRequest: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidRequest, arg),
		invalidParams: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidParams, arg),
		methodNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotFound, arg),
		internal: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.internal, arg),
		server: (opts) => {
			if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum RPC Server errors must provide single object argument.");
			const { code } = opts;
			if (!Number.isInteger(code) || code > -32005 || code < -32099) throw new Error("\"code\" must be an integer such that: -32099 <= code <= -32005");
			return getEthJsonRpcError(code, opts);
		},
		invalidInput: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.invalidInput, arg),
		resourceNotFound: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceNotFound, arg),
		resourceUnavailable: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.resourceUnavailable, arg),
		transactionRejected: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.transactionRejected, arg),
		methodNotSupported: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.methodNotSupported, arg),
		limitExceeded: (arg) => getEthJsonRpcError(standardErrorCodes.rpc.limitExceeded, arg)
	},
	provider: {
		userRejectedRequest: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.userRejectedRequest, arg);
		},
		unauthorized: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unauthorized, arg);
		},
		unsupportedMethod: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unsupportedMethod, arg);
		},
		disconnected: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.disconnected, arg);
		},
		chainDisconnected: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.chainDisconnected, arg);
		},
		unsupportedChain: (arg) => {
			return getEthProviderError(standardErrorCodes.provider.unsupportedChain, arg);
		},
		custom: (opts) => {
			if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum Provider custom errors must provide single object argument.");
			const { code, message, data } = opts;
			if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string");
			return new EthereumProviderError(code, message, data);
		}
	}
};
function getEthJsonRpcError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumRpcError(code, message || getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumProviderError(code, message || getMessageFromCode(code), data);
}
function parseOpts(arg) {
	if (arg) {
		if (typeof arg === "string") return [arg];
		else if (typeof arg === "object" && !Array.isArray(arg)) {
			const { message, data } = arg;
			if (message && typeof message !== "string") throw new Error("Must specify string message.");
			return [message || void 0, data];
		}
	}
	return [];
}
var EthereumRpcError = class extends Error {
	constructor(code, message, data) {
		if (!Number.isInteger(code)) throw new Error("\"code\" must be an integer.");
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string.");
		super(message);
		this.code = code;
		if (data !== void 0) this.data = data;
	}
};
var EthereumProviderError = class extends EthereumRpcError {
	/**
	* Create an Ethereum Provider JSON-RPC error.
	* `code` must be an integer in the 1000 <= 4999 range.
	*/
	constructor(code, message, data) {
		if (!isValidEthProviderCode(code)) throw new Error("\"code\" must be an integer such that: 1000 <= code <= 4999");
		super(code, message, data);
	}
};
function isValidEthProviderCode(code) {
	return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/type/index.js
function OpaqueType() {
	return (value) => value;
}
var HexString = OpaqueType();
var AddressString = OpaqueType();
var BigIntString = OpaqueType();
function IntNumber(num) {
	return Math.floor(num);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/type/util.js
var INT_STRING_REGEX = /^[0-9]*$/;
var HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
/**
* @param length number of bytes
*/
function randomBytesHex(length) {
	return uint8ArrayToHex(crypto.getRandomValues(new Uint8Array(length)));
}
function uint8ArrayToHex(value) {
	return [...value].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexStringToUint8Array(hexString) {
	return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)));
}
function hexStringFromBuffer(buf, includePrefix = false) {
	const hex = buf.toString("hex");
	return HexString(includePrefix ? `0x${hex}` : hex);
}
function encodeToHexString(str) {
	return hexStringFromBuffer(ensureBuffer(str), true);
}
function bigIntStringFromBigInt(bi) {
	return BigIntString(bi.toString(10));
}
function hexStringFromNumber(num) {
	return HexString(`0x${BigInt(num).toString(16)}`);
}
function has0xPrefix(str) {
	return str.startsWith("0x") || str.startsWith("0X");
}
function strip0x(hex) {
	if (has0xPrefix(hex)) return hex.slice(2);
	return hex;
}
function prepend0x(hex) {
	if (has0xPrefix(hex)) return `0x${hex.slice(2)}`;
	return `0x${hex}`;
}
function isHexString(hex) {
	if (typeof hex !== "string") return false;
	const s = strip0x(hex).toLowerCase();
	return HEXADECIMAL_STRING_REGEX.test(s);
}
function ensureHexString(hex, includePrefix = false) {
	if (typeof hex === "string") {
		const s = strip0x(hex).toLowerCase();
		if (HEXADECIMAL_STRING_REGEX.test(s)) return HexString(includePrefix ? `0x${s}` : s);
	}
	throw standardErrors.rpc.invalidParams(`"${String(hex)}" is not a hexadecimal string`);
}
function ensureEvenLengthHexString(hex, includePrefix = false) {
	let h = ensureHexString(hex, false);
	if (h.length % 2 === 1) h = HexString(`0${h}`);
	return includePrefix ? HexString(`0x${h}`) : h;
}
function ensureAddressString(str) {
	if (typeof str === "string") {
		const s = strip0x(str).toLowerCase();
		if (isHexString(s) && s.length === 40) return AddressString(prepend0x(s));
	}
	throw standardErrors.rpc.invalidParams(`Invalid Ethereum address: ${String(str)}`);
}
function ensureBuffer(str) {
	if (Buffer.isBuffer(str)) return str;
	if (typeof str === "string") {
		if (isHexString(str)) {
			const s = ensureEvenLengthHexString(str, false);
			return Buffer.from(s, "hex");
		}
		return Buffer.from(str, "utf8");
	}
	throw standardErrors.rpc.invalidParams(`Not binary data: ${String(str)}`);
}
function ensureIntNumber(num) {
	if (typeof num === "number" && Number.isInteger(num)) return IntNumber(num);
	if (typeof num === "string") {
		if (INT_STRING_REGEX.test(num)) return IntNumber(Number(num));
		if (isHexString(num)) return IntNumber(Number(BigInt(ensureEvenLengthHexString(num, true))));
	}
	throw standardErrors.rpc.invalidParams(`Not an integer: ${String(num)}`);
}
function ensureBigInt(val) {
	if (val !== null && (typeof val === "bigint" || isBigNumber(val))) return BigInt(val.toString(10));
	if (typeof val === "number") return BigInt(ensureIntNumber(val));
	if (typeof val === "string") {
		if (INT_STRING_REGEX.test(val)) return BigInt(val);
		if (isHexString(val)) return BigInt(ensureEvenLengthHexString(val, true));
	}
	throw standardErrors.rpc.invalidParams(`Not an integer: ${String(val)}`);
}
function ensureParsedJSONObject(val) {
	if (typeof val === "string") return JSON.parse(val);
	if (typeof val === "object") return val;
	throw standardErrors.rpc.invalidParams(`Not a JSON string or an object: ${String(val)}`);
}
function isBigNumber(val) {
	if (val == null || typeof val.constructor !== "function") return false;
	const { constructor } = val;
	return typeof constructor.config === "function" && typeof constructor.EUCLID === "number";
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/cipher.js
async function generateKeyPair() {
	return crypto.subtle.generateKey({
		name: "ECDH",
		namedCurve: "P-256"
	}, true, ["deriveKey"]);
}
async function deriveSharedSecret(ownPrivateKey, peerPublicKey) {
	return crypto.subtle.deriveKey({
		name: "ECDH",
		public: peerPublicKey
	}, ownPrivateKey, {
		name: "AES-GCM",
		length: 256
	}, false, ["encrypt", "decrypt"]);
}
async function encrypt(sharedSecret, plainText) {
	const iv = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
	return {
		iv,
		cipherText: await crypto.subtle.encrypt({
			name: "AES-GCM",
			iv
		}, sharedSecret, new TextEncoder().encode(plainText))
	};
}
async function decrypt(sharedSecret, { iv, cipherText }) {
	const plainText = await crypto.subtle.decrypt({
		name: "AES-GCM",
		iv
	}, sharedSecret, cipherText);
	return new TextDecoder().decode(plainText);
}
function getFormat(keyType) {
	switch (keyType) {
		case "public": return "spki";
		case "private": return "pkcs8";
	}
}
async function exportKeyToHexString(type, key) {
	const format = getFormat(type);
	const exported = await crypto.subtle.exportKey(format, key);
	return uint8ArrayToHex(new Uint8Array(exported));
}
async function importKeyFromHexString(type, hexString) {
	const format = getFormat(type);
	const arrayBuffer = hexStringToUint8Array(hexString).buffer;
	return await crypto.subtle.importKey(format, new Uint8Array(arrayBuffer), {
		name: "ECDH",
		namedCurve: "P-256"
	}, true, type === "private" ? ["deriveKey"] : []);
}
async function encryptContent(content, sharedSecret) {
	return encrypt(sharedSecret, JSON.stringify(content, (_, value) => {
		if (!(value instanceof Error)) return value;
		const error = value;
		return Object.assign(Object.assign({}, error.code ? { code: error.code } : {}), { message: error.message });
	}));
}
async function decryptContent(encryptedData, sharedSecret) {
	return JSON.parse(await decrypt(sharedSecret, encryptedData));
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWKeyManager.js
var OWN_PRIVATE_KEY = {
	storageKey: "ownPrivateKey",
	keyType: "private"
};
var OWN_PUBLIC_KEY = {
	storageKey: "ownPublicKey",
	keyType: "public"
};
var PEER_PUBLIC_KEY = {
	storageKey: "peerPublicKey",
	keyType: "public"
};
var SCWKeyManager = class {
	constructor() {
		this.storage = new ScopedLocalStorage("CBWSDK", "SCWKeyManager");
		this.ownPrivateKey = null;
		this.ownPublicKey = null;
		this.peerPublicKey = null;
		this.sharedSecret = null;
	}
	async getOwnPublicKey() {
		await this.loadKeysIfNeeded();
		return this.ownPublicKey;
	}
	async getSharedSecret() {
		await this.loadKeysIfNeeded();
		return this.sharedSecret;
	}
	async setPeerPublicKey(key) {
		this.sharedSecret = null;
		this.peerPublicKey = key;
		await this.storeKey(PEER_PUBLIC_KEY, key);
		await this.loadKeysIfNeeded();
	}
	async clear() {
		this.ownPrivateKey = null;
		this.ownPublicKey = null;
		this.peerPublicKey = null;
		this.sharedSecret = null;
		this.storage.removeItem(OWN_PUBLIC_KEY.storageKey);
		this.storage.removeItem(OWN_PRIVATE_KEY.storageKey);
		this.storage.removeItem(PEER_PUBLIC_KEY.storageKey);
	}
	async generateKeyPair() {
		const newKeyPair = await generateKeyPair();
		this.ownPrivateKey = newKeyPair.privateKey;
		this.ownPublicKey = newKeyPair.publicKey;
		await this.storeKey(OWN_PRIVATE_KEY, newKeyPair.privateKey);
		await this.storeKey(OWN_PUBLIC_KEY, newKeyPair.publicKey);
	}
	async loadKeysIfNeeded() {
		if (this.ownPrivateKey === null) this.ownPrivateKey = await this.loadKey(OWN_PRIVATE_KEY);
		if (this.ownPublicKey === null) this.ownPublicKey = await this.loadKey(OWN_PUBLIC_KEY);
		if (this.ownPrivateKey === null || this.ownPublicKey === null) await this.generateKeyPair();
		if (this.peerPublicKey === null) this.peerPublicKey = await this.loadKey(PEER_PUBLIC_KEY);
		if (this.sharedSecret === null) {
			if (this.ownPrivateKey === null || this.peerPublicKey === null) return;
			this.sharedSecret = await deriveSharedSecret(this.ownPrivateKey, this.peerPublicKey);
		}
	}
	async loadKey(item) {
		const key = this.storage.getItem(item.storageKey);
		if (!key) return null;
		return importKeyFromHexString(item.keyType, key);
	}
	async storeKey(item, key) {
		const hexString = await exportKeyToHexString(item.keyType, key);
		this.storage.setItem(item.storageKey, hexString);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sdk-info.js
var VERSION = "4.3.0";
var NAME = "@coinbase/wallet-sdk";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/provider.js
async function fetchRPCRequest(request, rpcUrl) {
	const requestBody = Object.assign(Object.assign({}, request), {
		jsonrpc: "2.0",
		id: crypto.randomUUID()
	});
	const { result, error } = await (await window.fetch(rpcUrl, {
		method: "POST",
		body: JSON.stringify(requestBody),
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			"X-Cbw-Sdk-Version": VERSION,
			"X-Cbw-Sdk-Platform": NAME
		}
	})).json();
	if (error) throw error;
	return result;
}
function getCoinbaseInjectedLegacyProvider() {
	return globalThis.coinbaseWalletExtension;
}
function getInjectedEthereum() {
	var _a, _b;
	try {
		const window = globalThis;
		return (_a = window.ethereum) !== null && _a !== void 0 ? _a : (_b = window.top) === null || _b === void 0 ? void 0 : _b.ethereum;
	} catch (_c) {
		return;
	}
}
function getCoinbaseInjectedProvider({ metadata, preference }) {
	var _a, _b;
	const { appName, appLogoUrl, appChainIds } = metadata;
	if (preference.options !== "smartWalletOnly") {
		const extension = getCoinbaseInjectedLegacyProvider();
		if (extension) {
			(_a = extension.setAppInfo) === null || _a === void 0 || _a.call(extension, appName, appLogoUrl, appChainIds, preference);
			return extension;
		}
	}
	const ethereum = getInjectedEthereum();
	if (ethereum === null || ethereum === void 0 ? void 0 : ethereum.isCoinbaseBrowser) {
		(_b = ethereum.setAppInfo) === null || _b === void 0 || _b.call(ethereum, appName, appLogoUrl, appChainIds, preference);
		return ethereum;
	}
}
/**
* Validates the arguments for an invalid request and returns an error if any validation fails.
* Valid request args are defined here: https://eips.ethereum.org/EIPS/eip-1193#request
* @param args The request arguments to validate.
* @returns An error object if the arguments are invalid, otherwise undefined.
*/
function checkErrorForInvalidRequestArgs(args) {
	if (!args || typeof args !== "object" || Array.isArray(args)) throw standardErrors.rpc.invalidParams({
		message: "Expected a single, non-array, object argument.",
		data: args
	});
	const { method, params } = args;
	if (typeof method !== "string" || method.length === 0) throw standardErrors.rpc.invalidParams({
		message: "'args.method' must be a non-empty string.",
		data: args
	});
	if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) throw standardErrors.rpc.invalidParams({
		message: "'args.params' must be an object or array if provided.",
		data: args
	});
	switch (method) {
		case "eth_sign":
		case "eth_signTypedData_v2":
		case "eth_subscribe":
		case "eth_unsubscribe": throw standardErrors.provider.unsupportedMethod();
	}
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/scw/SCWSigner.js
var ACCOUNTS_KEY = "accounts";
var ACTIVE_CHAIN_STORAGE_KEY = "activeChain";
var AVAILABLE_CHAINS_STORAGE_KEY = "availableChains";
var WALLET_CAPABILITIES_STORAGE_KEY = "walletCapabilities";
var SCWSigner = class {
	constructor(params) {
		var _a, _b, _c;
		this.metadata = params.metadata;
		this.communicator = params.communicator;
		this.callback = params.callback;
		this.keyManager = new SCWKeyManager();
		this.storage = new ScopedLocalStorage("CBWSDK", "SCWStateManager");
		this.accounts = (_a = this.storage.loadObject(ACCOUNTS_KEY)) !== null && _a !== void 0 ? _a : [];
		this.chain = this.storage.loadObject(ACTIVE_CHAIN_STORAGE_KEY) || { id: (_c = (_b = params.metadata.appChainIds) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : 1 };
		this.handshake = this.handshake.bind(this);
		this.request = this.request.bind(this);
		this.createRequestMessage = this.createRequestMessage.bind(this);
		this.decryptResponseMessage = this.decryptResponseMessage.bind(this);
	}
	async handshake(args) {
		var _a, _b, _c, _d;
		await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
		const handshakeMessage = await this.createRequestMessage({ handshake: {
			method: args.method,
			params: Object.assign({}, this.metadata, (_c = args.params) !== null && _c !== void 0 ? _c : {})
		} });
		const response = await this.communicator.postRequestAndWaitForResponse(handshakeMessage);
		if ("failure" in response.content) throw response.content.failure;
		const peerPublicKey = await importKeyFromHexString("public", response.sender);
		await this.keyManager.setPeerPublicKey(peerPublicKey);
		const result = (await this.decryptResponseMessage(response)).result;
		if ("error" in result) throw result.error;
		switch (args.method) {
			case "eth_requestAccounts": {
				const accounts = result.value;
				this.accounts = accounts;
				this.storage.storeObject(ACCOUNTS_KEY, accounts);
				(_d = this.callback) === null || _d === void 0 || _d.call(this, "accountsChanged", accounts);
				break;
			}
		}
	}
	async request(request) {
		var _a;
		if (this.accounts.length === 0) switch (request.method) {
			case "wallet_sendCalls": return this.sendRequestToPopup(request);
			default: throw standardErrors.provider.unauthorized();
		}
		switch (request.method) {
			case "eth_requestAccounts":
				(_a = this.callback) === null || _a === void 0 || _a.call(this, "connect", { chainId: hexStringFromNumber(this.chain.id) });
				return this.accounts;
			case "eth_accounts": return this.accounts;
			case "eth_coinbase": return this.accounts[0];
			case "net_version": return this.chain.id;
			case "eth_chainId": return hexStringFromNumber(this.chain.id);
			case "wallet_getCapabilities": return this.storage.loadObject(WALLET_CAPABILITIES_STORAGE_KEY);
			case "wallet_switchEthereumChain": return this.handleSwitchChainRequest(request);
			case "eth_ecRecover":
			case "personal_sign":
			case "wallet_sign":
			case "personal_ecRecover":
			case "eth_signTransaction":
			case "eth_sendTransaction":
			case "eth_signTypedData_v1":
			case "eth_signTypedData_v3":
			case "eth_signTypedData_v4":
			case "eth_signTypedData":
			case "wallet_addEthereumChain":
			case "wallet_watchAsset":
			case "wallet_sendCalls":
			case "wallet_showCallsStatus":
			case "wallet_grantPermissions": return this.sendRequestToPopup(request);
			default:
				if (!this.chain.rpcUrl) throw standardErrors.rpc.internal("No RPC URL set for chain");
				return fetchRPCRequest(request, this.chain.rpcUrl);
		}
	}
	async sendRequestToPopup(request) {
		var _a, _b;
		await ((_b = (_a = this.communicator).waitForPopupLoaded) === null || _b === void 0 ? void 0 : _b.call(_a));
		const response = await this.sendEncryptedRequest(request);
		const result = (await this.decryptResponseMessage(response)).result;
		if ("error" in result) throw result.error;
		return result.value;
	}
	async cleanup() {
		var _a, _b;
		this.storage.clear();
		await this.keyManager.clear();
		this.accounts = [];
		this.chain = { id: (_b = (_a = this.metadata.appChainIds) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 1 };
	}
	/**
	* @returns `null` if the request was successful.
	* https://eips.ethereum.org/EIPS/eip-3326#wallet_switchethereumchain
	*/
	async handleSwitchChainRequest(request) {
		var _a;
		const params = request.params;
		if (!params || !((_a = params[0]) === null || _a === void 0 ? void 0 : _a.chainId)) throw standardErrors.rpc.invalidParams();
		const chainId = ensureIntNumber(params[0].chainId);
		if (this.updateChain(chainId)) return null;
		const popupResult = await this.sendRequestToPopup(request);
		if (popupResult === null) this.updateChain(chainId);
		return popupResult;
	}
	async sendEncryptedRequest(request) {
		const sharedSecret = await this.keyManager.getSharedSecret();
		if (!sharedSecret) throw standardErrors.provider.unauthorized("No valid session found, try requestAccounts before other methods");
		const encrypted = await encryptContent({
			action: request,
			chainId: this.chain.id
		}, sharedSecret);
		const message = await this.createRequestMessage({ encrypted });
		return this.communicator.postRequestAndWaitForResponse(message);
	}
	async createRequestMessage(content) {
		const publicKey = await exportKeyToHexString("public", await this.keyManager.getOwnPublicKey());
		return {
			id: crypto.randomUUID(),
			sender: publicKey,
			content,
			timestamp: /* @__PURE__ */ new Date()
		};
	}
	async decryptResponseMessage(message) {
		var _a, _b;
		const content = message.content;
		if ("failure" in content) throw content.failure;
		const sharedSecret = await this.keyManager.getSharedSecret();
		if (!sharedSecret) throw standardErrors.provider.unauthorized("Invalid session");
		const response = await decryptContent(content.encrypted, sharedSecret);
		const availableChains = (_a = response.data) === null || _a === void 0 ? void 0 : _a.chains;
		if (availableChains) {
			const chains = Object.entries(availableChains).map(([id, rpcUrl]) => ({
				id: Number(id),
				rpcUrl
			}));
			this.storage.storeObject(AVAILABLE_CHAINS_STORAGE_KEY, chains);
			this.updateChain(this.chain.id, chains);
		}
		const walletCapabilities = (_b = response.data) === null || _b === void 0 ? void 0 : _b.capabilities;
		if (walletCapabilities) this.storage.storeObject(WALLET_CAPABILITIES_STORAGE_KEY, walletCapabilities);
		return response;
	}
	updateChain(chainId, newAvailableChains) {
		var _a;
		const chains = newAvailableChains !== null && newAvailableChains !== void 0 ? newAvailableChains : this.storage.loadObject(AVAILABLE_CHAINS_STORAGE_KEY);
		const chain = chains === null || chains === void 0 ? void 0 : chains.find((chain) => chain.id === chainId);
		if (!chain) return false;
		if (chain !== this.chain) {
			this.chain = chain;
			this.storage.storeObject(ACTIVE_CHAIN_STORAGE_KEY, chain);
			(_a = this.callback) === null || _a === void 0 || _a.call(this, "chainChanged", hexStringFromNumber(chain.id));
		}
		return true;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/_u64.js
var require__u64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toBig = exports.shrSL = exports.shrSH = exports.rotrSL = exports.rotrSH = exports.rotrBL = exports.rotrBH = exports.rotr32L = exports.rotr32H = exports.rotlSL = exports.rotlSH = exports.rotlBL = exports.rotlBH = exports.add5L = exports.add5H = exports.add4L = exports.add4H = exports.add3L = exports.add3H = void 0;
	exports.add = add;
	exports.fromBig = fromBig;
	exports.split = split;
	/**
	* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
	* @todo re-check https://issues.chromium.org/issues/42212588
	* @module
	*/
	var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
	var _32n = /* @__PURE__ */ BigInt(32);
	function fromBig(n, le = false) {
		if (le) return {
			h: Number(n & U32_MASK64),
			l: Number(n >> _32n & U32_MASK64)
		};
		return {
			h: Number(n >> _32n & U32_MASK64) | 0,
			l: Number(n & U32_MASK64) | 0
		};
	}
	function split(lst, le = false) {
		const len = lst.length;
		let Ah = new Uint32Array(len);
		let Al = new Uint32Array(len);
		for (let i = 0; i < len; i++) {
			const { h, l } = fromBig(lst[i], le);
			[Ah[i], Al[i]] = [h, l];
		}
		return [Ah, Al];
	}
	var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
	exports.toBig = toBig;
	var shrSH = (h, _l, s) => h >>> s;
	exports.shrSH = shrSH;
	var shrSL = (h, l, s) => h << 32 - s | l >>> s;
	exports.shrSL = shrSL;
	var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
	exports.rotrSH = rotrSH;
	var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
	exports.rotrSL = rotrSL;
	var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
	exports.rotrBH = rotrBH;
	var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
	exports.rotrBL = rotrBL;
	var rotr32H = (_h, l) => l;
	exports.rotr32H = rotr32H;
	var rotr32L = (h, _l) => h;
	exports.rotr32L = rotr32L;
	var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
	exports.rotlSH = rotlSH;
	var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
	exports.rotlSL = rotlSL;
	var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
	exports.rotlBH = rotlBH;
	var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
	exports.rotlBL = rotlBL;
	function add(Ah, Al, Bh, Bl) {
		const l = (Al >>> 0) + (Bl >>> 0);
		return {
			h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
			l: l | 0
		};
	}
	var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
	exports.add3L = add3L;
	var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
	exports.add3H = add3H;
	var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
	exports.add4L = add4L;
	var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
	exports.add4H = add4H;
	var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
	exports.add5L = add5L;
	var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
	exports.add5H = add5H;
	exports.default = {
		fromBig,
		split,
		toBig,
		shrSH,
		shrSL,
		rotrSH,
		rotrSL,
		rotrBH,
		rotrBL,
		rotr32H,
		rotr32L,
		rotlSH,
		rotlSL,
		rotlBH,
		rotlBL,
		add,
		add3L,
		add3H,
		add4L,
		add4H,
		add5H,
		add5L
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/cryptoNode.js
var require_cryptoNode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.crypto = void 0;
	/**
	* Internal webcrypto alias.
	* We prefer WebCrypto aka globalThis.crypto, which exists in node.js 16+.
	* Falls back to Node.js built-in crypto for Node.js <=v14.
	* See utils.ts for details.
	* @module
	*/
	var nc = __require("node:crypto");
	exports.crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Utilities for hex, bytes, CSPRNG.
	* @module
	*/
	/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.wrapXOFConstructorWithOpts = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.Hash = exports.nextTick = exports.swap32IfBE = exports.byteSwapIfBE = exports.swap8IfBE = exports.isLE = void 0;
	exports.isBytes = isBytes;
	exports.anumber = anumber;
	exports.abytes = abytes;
	exports.ahash = ahash;
	exports.aexists = aexists;
	exports.aoutput = aoutput;
	exports.u8 = u8;
	exports.u32 = u32;
	exports.clean = clean;
	exports.createView = createView;
	exports.rotr = rotr;
	exports.rotl = rotl;
	exports.byteSwap = byteSwap;
	exports.byteSwap32 = byteSwap32;
	exports.bytesToHex = bytesToHex;
	exports.hexToBytes = hexToBytes;
	exports.asyncLoop = asyncLoop;
	exports.utf8ToBytes = utf8ToBytes;
	exports.bytesToUtf8 = bytesToUtf8;
	exports.toBytes = toBytes;
	exports.kdfInputToBytes = kdfInputToBytes;
	exports.concatBytes = concatBytes;
	exports.checkOpts = checkOpts;
	exports.createHasher = createHasher;
	exports.createOptHasher = createOptHasher;
	exports.createXOFer = createXOFer;
	exports.randomBytes = randomBytes;
	var crypto_1 = require_cryptoNode();
	/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
	function isBytes(a) {
		return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
	}
	/** Asserts something is positive integer. */
	function anumber(n) {
		if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
	}
	/** Asserts something is Uint8Array. */
	function abytes(b, ...lengths) {
		if (!isBytes(b)) throw new Error("Uint8Array expected");
		if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
	}
	/** Asserts something is hash */
	function ahash(h) {
		if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.createHasher");
		anumber(h.outputLen);
		anumber(h.blockLen);
	}
	/** Asserts a hash instance has not been destroyed / finished */
	function aexists(instance, checkFinished = true) {
		if (instance.destroyed) throw new Error("Hash instance has been destroyed");
		if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
	}
	/** Asserts output is properly-sized byte array */
	function aoutput(out, instance) {
		abytes(out);
		const min = instance.outputLen;
		if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
	}
	/** Cast u8 / u16 / u32 to u8. */
	function u8(arr) {
		return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
	}
	/** Cast u8 / u16 / u32 to u32. */
	function u32(arr) {
		return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
	}
	/** Zeroize a byte array. Warning: JS provides no guarantees. */
	function clean(...arrays) {
		for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
	}
	/** Create DataView of an array for easy byte-level manipulation. */
	function createView(arr) {
		return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	}
	/** The rotate right (circular right shift) operation for uint32 */
	function rotr(word, shift) {
		return word << 32 - shift | word >>> shift;
	}
	/** The rotate left (circular left shift) operation for uint32 */
	function rotl(word, shift) {
		return word << shift | word >>> 32 - shift >>> 0;
	}
	/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
	exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
	/** The byte swap operation for uint32 */
	function byteSwap(word) {
		return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
	}
	/** Conditionally byte swap if on a big-endian platform */
	exports.swap8IfBE = exports.isLE ? (n) => n : (n) => byteSwap(n);
	/** @deprecated */
	exports.byteSwapIfBE = exports.swap8IfBE;
	/** In place byte swap for Uint32Array */
	function byteSwap32(arr) {
		for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
		return arr;
	}
	exports.swap32IfBE = exports.isLE ? (u) => u : byteSwap32;
	var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
	var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
	/**
	* Convert byte array to hex string. Uses built-in function, when available.
	* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	*/
	function bytesToHex(bytes) {
		abytes(bytes);
		if (hasHexBuiltin) return bytes.toHex();
		let hex = "";
		for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
		return hex;
	}
	var asciis = {
		_0: 48,
		_9: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
	function asciiToBase16(ch) {
		if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
		if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
		if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
	}
	/**
	* Convert hex string to byte array. Uses built-in function, when available.
	* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	*/
	function hexToBytes(hex) {
		if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
		if (hasHexBuiltin) return Uint8Array.fromHex(hex);
		const hl = hex.length;
		const al = hl / 2;
		if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
		const array = new Uint8Array(al);
		for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
			const n1 = asciiToBase16(hex.charCodeAt(hi));
			const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
			if (n1 === void 0 || n2 === void 0) {
				const char = hex[hi] + hex[hi + 1];
				throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
			}
			array[ai] = n1 * 16 + n2;
		}
		return array;
	}
	/**
	* There is no setImmediate in browser and setTimeout is slow.
	* Call of async fn will return Promise, which will be fullfiled only on
	* next scheduler queue processing step and this is exactly what we need.
	*/
	var nextTick = async () => {};
	exports.nextTick = nextTick;
	/** Returns control to thread each 'tick' ms to avoid blocking. */
	async function asyncLoop(iters, tick, cb) {
		let ts = Date.now();
		for (let i = 0; i < iters; i++) {
			cb(i);
			const diff = Date.now() - ts;
			if (diff >= 0 && diff < tick) continue;
			await (0, exports.nextTick)();
			ts += diff;
		}
	}
	/**
	* Converts string to bytes using UTF8 encoding.
	* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
	*/
	function utf8ToBytes(str) {
		if (typeof str !== "string") throw new Error("string expected");
		return new Uint8Array(new TextEncoder().encode(str));
	}
	/**
	* Converts bytes to string using UTF8 encoding.
	* @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
	*/
	function bytesToUtf8(bytes) {
		return new TextDecoder().decode(bytes);
	}
	/**
	* Normalizes (non-hex) string or Uint8Array to Uint8Array.
	* Warning: when Uint8Array is passed, it would NOT get copied.
	* Keep in mind for future mutable operations.
	*/
	function toBytes(data) {
		if (typeof data === "string") data = utf8ToBytes(data);
		abytes(data);
		return data;
	}
	/**
	* Helper for KDFs: consumes uint8array or string.
	* When string is passed, does utf8 decoding, using TextDecoder.
	*/
	function kdfInputToBytes(data) {
		if (typeof data === "string") data = utf8ToBytes(data);
		abytes(data);
		return data;
	}
	/** Copies several Uint8Arrays into one. */
	function concatBytes(...arrays) {
		let sum = 0;
		for (let i = 0; i < arrays.length; i++) {
			const a = arrays[i];
			abytes(a);
			sum += a.length;
		}
		const res = new Uint8Array(sum);
		for (let i = 0, pad = 0; i < arrays.length; i++) {
			const a = arrays[i];
			res.set(a, pad);
			pad += a.length;
		}
		return res;
	}
	function checkOpts(defaults, opts) {
		if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]") throw new Error("options should be object or undefined");
		return Object.assign(defaults, opts);
	}
	/** For runtime check if class implements interface */
	var Hash = class {};
	exports.Hash = Hash;
	/** Wraps hash function, creating an interface on top of it */
	function createHasher(hashCons) {
		const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
		const tmp = hashCons();
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = () => hashCons();
		return hashC;
	}
	function createOptHasher(hashCons) {
		const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
		const tmp = hashCons({});
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = (opts) => hashCons(opts);
		return hashC;
	}
	function createXOFer(hashCons) {
		const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
		const tmp = hashCons({});
		hashC.outputLen = tmp.outputLen;
		hashC.blockLen = tmp.blockLen;
		hashC.create = (opts) => hashCons(opts);
		return hashC;
	}
	exports.wrapConstructor = createHasher;
	exports.wrapConstructorWithOpts = createOptHasher;
	exports.wrapXOFConstructorWithOpts = createXOFer;
	/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
	function randomBytes(bytesLength = 32) {
		if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
		if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") return Uint8Array.from(crypto_1.crypto.randomBytes(bytesLength));
		throw new Error("crypto.getRandomValues must be defined");
	}
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/sha3.js
var require_sha3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shake256 = exports.shake128 = exports.keccak_512 = exports.keccak_384 = exports.keccak_256 = exports.keccak_224 = exports.sha3_512 = exports.sha3_384 = exports.sha3_256 = exports.sha3_224 = exports.Keccak = void 0;
	exports.keccakP = keccakP;
	/**
	* SHA3 (keccak) hash function, based on a new "Sponge function" design.
	* Different from older hashes, the internal state is bigger than output size.
	*
	* Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
	* [Website](https://keccak.team/keccak.html),
	* [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
	*
	* Check out `sha3-addons` module for cSHAKE, k12, and others.
	* @module
	*/
	var _u64_ts_1 = require__u64();
	var utils_ts_1 = require_utils();
	var _0n = BigInt(0);
	var _1n = BigInt(1);
	var _2n = BigInt(2);
	var _7n = BigInt(7);
	var _256n = BigInt(256);
	var _0x71n = BigInt(113);
	var SHA3_PI = [];
	var SHA3_ROTL = [];
	var _SHA3_IOTA = [];
	for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
		[x, y] = [y, (2 * x + 3 * y) % 5];
		SHA3_PI.push(2 * (5 * y + x));
		SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
		let t = _0n;
		for (let j = 0; j < 7; j++) {
			R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
			if (R & _2n) t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
		}
		_SHA3_IOTA.push(t);
	}
	var IOTAS = (0, _u64_ts_1.split)(_SHA3_IOTA, true);
	var SHA3_IOTA_H = IOTAS[0];
	var SHA3_IOTA_L = IOTAS[1];
	var rotlH = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBH)(h, l, s) : (0, _u64_ts_1.rotlSH)(h, l, s);
	var rotlL = (h, l, s) => s > 32 ? (0, _u64_ts_1.rotlBL)(h, l, s) : (0, _u64_ts_1.rotlSL)(h, l, s);
	/** `keccakf1600` internal function, additionally allows to adjust round count. */
	function keccakP(s, rounds = 24) {
		const B = /* @__PURE__ */ new Uint32Array(10);
		for (let round = 24 - rounds; round < 24; round++) {
			for (let x = 0; x < 10; x++) B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
			for (let x = 0; x < 10; x += 2) {
				const idx1 = (x + 8) % 10;
				const idx0 = (x + 2) % 10;
				const B0 = B[idx0];
				const B1 = B[idx0 + 1];
				const Th = rotlH(B0, B1, 1) ^ B[idx1];
				const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
				for (let y = 0; y < 50; y += 10) {
					s[x + y] ^= Th;
					s[x + y + 1] ^= Tl;
				}
			}
			let curH = s[2];
			let curL = s[3];
			for (let t = 0; t < 24; t++) {
				const shift = SHA3_ROTL[t];
				const Th = rotlH(curH, curL, shift);
				const Tl = rotlL(curH, curL, shift);
				const PI = SHA3_PI[t];
				curH = s[PI];
				curL = s[PI + 1];
				s[PI] = Th;
				s[PI + 1] = Tl;
			}
			for (let y = 0; y < 50; y += 10) {
				for (let x = 0; x < 10; x++) B[x] = s[y + x];
				for (let x = 0; x < 10; x++) s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
			}
			s[0] ^= SHA3_IOTA_H[round];
			s[1] ^= SHA3_IOTA_L[round];
		}
		(0, utils_ts_1.clean)(B);
	}
	/** Keccak sponge function. */
	var Keccak = class Keccak extends utils_ts_1.Hash {
		constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
			super();
			this.pos = 0;
			this.posOut = 0;
			this.finished = false;
			this.destroyed = false;
			this.enableXOF = false;
			this.blockLen = blockLen;
			this.suffix = suffix;
			this.outputLen = outputLen;
			this.enableXOF = enableXOF;
			this.rounds = rounds;
			(0, utils_ts_1.anumber)(outputLen);
			if (!(0 < blockLen && blockLen < 200)) throw new Error("only keccak-f1600 function is supported");
			this.state = /* @__PURE__ */ new Uint8Array(200);
			this.state32 = (0, utils_ts_1.u32)(this.state);
		}
		clone() {
			return this._cloneInto();
		}
		keccak() {
			(0, utils_ts_1.swap32IfBE)(this.state32);
			keccakP(this.state32, this.rounds);
			(0, utils_ts_1.swap32IfBE)(this.state32);
			this.posOut = 0;
			this.pos = 0;
		}
		update(data) {
			(0, utils_ts_1.aexists)(this);
			data = (0, utils_ts_1.toBytes)(data);
			(0, utils_ts_1.abytes)(data);
			const { blockLen, state } = this;
			const len = data.length;
			for (let pos = 0; pos < len;) {
				const take = Math.min(blockLen - this.pos, len - pos);
				for (let i = 0; i < take; i++) state[this.pos++] ^= data[pos++];
				if (this.pos === blockLen) this.keccak();
			}
			return this;
		}
		finish() {
			if (this.finished) return;
			this.finished = true;
			const { state, suffix, pos, blockLen } = this;
			state[pos] ^= suffix;
			if ((suffix & 128) !== 0 && pos === blockLen - 1) this.keccak();
			state[blockLen - 1] ^= 128;
			this.keccak();
		}
		writeInto(out) {
			(0, utils_ts_1.aexists)(this, false);
			(0, utils_ts_1.abytes)(out);
			this.finish();
			const bufferOut = this.state;
			const { blockLen } = this;
			for (let pos = 0, len = out.length; pos < len;) {
				if (this.posOut >= blockLen) this.keccak();
				const take = Math.min(blockLen - this.posOut, len - pos);
				out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
				this.posOut += take;
				pos += take;
			}
			return out;
		}
		xofInto(out) {
			if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
			return this.writeInto(out);
		}
		xof(bytes) {
			(0, utils_ts_1.anumber)(bytes);
			return this.xofInto(new Uint8Array(bytes));
		}
		digestInto(out) {
			(0, utils_ts_1.aoutput)(out, this);
			if (this.finished) throw new Error("digest() was already called");
			this.writeInto(out);
			this.destroy();
			return out;
		}
		digest() {
			return this.digestInto(new Uint8Array(this.outputLen));
		}
		destroy() {
			this.destroyed = true;
			(0, utils_ts_1.clean)(this.state);
		}
		_cloneInto(to) {
			const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
			to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
			to.state32.set(this.state32);
			to.pos = this.pos;
			to.posOut = this.posOut;
			to.finished = this.finished;
			to.rounds = rounds;
			to.suffix = suffix;
			to.outputLen = outputLen;
			to.enableXOF = enableXOF;
			to.destroyed = this.destroyed;
			return to;
		}
	};
	exports.Keccak = Keccak;
	var gen = (suffix, blockLen, outputLen) => (0, utils_ts_1.createHasher)(() => new Keccak(blockLen, suffix, outputLen));
	/** SHA3-224 hash function. */
	exports.sha3_224 = (() => gen(6, 144, 28))();
	/** SHA3-256 hash function. Different from keccak-256. */
	exports.sha3_256 = (() => gen(6, 136, 32))();
	/** SHA3-384 hash function. */
	exports.sha3_384 = (() => gen(6, 104, 48))();
	/** SHA3-512 hash function. */
	exports.sha3_512 = (() => gen(6, 72, 64))();
	/** keccak-224 hash function. */
	exports.keccak_224 = (() => gen(1, 144, 28))();
	/** keccak-256 hash function. Different from SHA3-256. */
	exports.keccak_256 = (() => gen(1, 136, 32))();
	/** keccak-384 hash function. */
	exports.keccak_384 = (() => gen(1, 104, 48))();
	/** keccak-512 hash function. */
	exports.keccak_512 = (() => gen(1, 72, 64))();
	var genShake = (suffix, blockLen, outputLen) => (0, utils_ts_1.createXOFer)((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
	/** SHAKE128 XOF with 128-bit security. */
	exports.shake128 = (() => genShake(31, 168, 16))();
	/** SHAKE256 XOF with 256-bit security. */
	exports.shake256 = (() => genShake(31, 136, 32))();
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/util.cjs
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { keccak_256 } = require_sha3();
	/**
	* Returns a buffer filled with 0s
	* @method zeros
	* @param {Number} bytes  the number of bytes the buffer should be
	* @return {Buffer}
	*/
	function zeros(bytes) {
		return Buffer.allocUnsafe(bytes).fill(0);
	}
	function bitLengthFromBigInt(num) {
		return num.toString(2).length;
	}
	function bufferBEFromBigInt(num, length) {
		let hex = num.toString(16);
		if (hex.length % 2 !== 0) hex = "0" + hex;
		const byteArray = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
		while (byteArray.length < length) byteArray.unshift(0);
		return Buffer.from(byteArray);
	}
	function twosFromBigInt(value, width) {
		const isNegative = value < 0n;
		let result;
		if (isNegative) {
			const mask = (1n << BigInt(width)) - 1n;
			result = (~value & mask) + 1n;
		} else result = value;
		result &= (1n << BigInt(width)) - 1n;
		return result;
	}
	/**
	* Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
	* Or it truncates the beginning if it exceeds.
	* @method setLength
	* @param {Buffer|Array} msg the value to pad
	* @param {Number} length the number of bytes the output should be
	* @param {Boolean} [right=false] whether to start padding form the left or right
	* @return {Buffer|Array}
	*/
	function setLength(msg, length, right) {
		const buf = zeros(length);
		msg = toBuffer(msg);
		if (right) {
			if (msg.length < length) {
				msg.copy(buf);
				return buf;
			}
			return msg.slice(0, length);
		} else {
			if (msg.length < length) {
				msg.copy(buf, length - msg.length);
				return buf;
			}
			return msg.slice(-length);
		}
	}
	/**
	* Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
	* Or it truncates the beginning if it exceeds.
	* @param {Buffer|Array} msg the value to pad
	* @param {Number} length the number of bytes the output should be
	* @return {Buffer|Array}
	*/
	function setLengthRight(msg, length) {
		return setLength(msg, length, true);
	}
	/**
	* Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BIgInt` and other objects with a `toArray()` method.
	* @param {*} v the value
	*/
	function toBuffer(v) {
		if (!Buffer.isBuffer(v)) {
			if (Array.isArray(v)) v = Buffer.from(v);
			else if (typeof v === "string") {
				if (isHexString(v)) v = Buffer.from(padToEven(stripHexPrefix(v)), "hex");
				else v = Buffer.from(v);
			} else if (typeof v === "number") v = intToBuffer(v);
			else if (v === null || v === void 0) v = Buffer.allocUnsafe(0);
			else if (typeof v === "bigint") v = bufferBEFromBigInt(v);
			else if (v.toArray) v = Buffer.from(v.toArray());
			else throw new Error("invalid type");
		}
		return v;
	}
	/**
	* Converts a `Buffer` into a hex `String`
	* @param {Buffer} buf
	* @return {String}
	*/
	function bufferToHex(buf) {
		buf = toBuffer(buf);
		return "0x" + buf.toString("hex");
	}
	/**
	* Creates Keccak hash of the input
	* @param {Buffer|Array|String|Number} a the input data
	* @param {Number} [bits=256] the Keccak width
	* @return {Buffer}
	*/
	function keccak(a, bits) {
		a = toBuffer(a);
		if (!bits) bits = 256;
		if (bits !== 256) throw new Error("unsupported");
		return Buffer.from(keccak_256(new Uint8Array(a)));
	}
	function padToEven(str) {
		return str.length % 2 ? "0" + str : str;
	}
	function isHexString(str) {
		return typeof str === "string" && str.match(/^0x[0-9A-Fa-f]*$/);
	}
	function stripHexPrefix(str) {
		if (typeof str === "string" && str.startsWith("0x")) return str.slice(2);
		return str;
	}
	module.exports = {
		zeros,
		setLength,
		setLengthRight,
		isHexString,
		stripHexPrefix,
		toBuffer,
		bufferToHex,
		keccak,
		bitLengthFromBigInt,
		bufferBEFromBigInt,
		twosFromBigInt
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/vendor-js/eth-eip712-util/abi.cjs
var require_abi = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function elementaryName(name) {
		if (name.startsWith("int[")) return "int256" + name.slice(3);
		else if (name === "int") return "int256";
		else if (name.startsWith("uint[")) return "uint256" + name.slice(4);
		else if (name === "uint") return "uint256";
		else if (name.startsWith("fixed[")) return "fixed128x128" + name.slice(5);
		else if (name === "fixed") return "fixed128x128";
		else if (name.startsWith("ufixed[")) return "ufixed128x128" + name.slice(6);
		else if (name === "ufixed") return "ufixed128x128";
		return name;
	}
	function parseTypeN(type) {
		return Number.parseInt(/^\D+(\d+)$/.exec(type)[1], 10);
	}
	function parseTypeNxM(type) {
		var tmp = /^\D+(\d+)x(\d+)$/.exec(type);
		return [Number.parseInt(tmp[1], 10), Number.parseInt(tmp[2], 10)];
	}
	function parseTypeArray(type) {
		var tmp = type.match(/(.*)\[(.*?)\]$/);
		if (tmp) return tmp[2] === "" ? "dynamic" : Number.parseInt(tmp[2], 10);
		return null;
	}
	function parseNumber(arg) {
		var type = typeof arg;
		if (type === "string" || type === "number") return BigInt(arg);
		else if (type === "bigint") return arg;
		else throw new Error("Argument is not a number");
	}
	function encodeSingle(type, arg) {
		var size, num, ret, i;
		if (type === "address") return encodeSingle("uint160", parseNumber(arg));
		else if (type === "bool") return encodeSingle("uint8", arg ? 1 : 0);
		else if (type === "string") return encodeSingle("bytes", new Buffer(arg, "utf8"));
		else if (isArray(type)) {
			if (typeof arg.length === "undefined") throw new Error("Not an array?");
			size = parseTypeArray(type);
			if (size !== "dynamic" && size !== 0 && arg.length > size) throw new Error("Elements exceed array size: " + size);
			ret = [];
			type = type.slice(0, type.lastIndexOf("["));
			if (typeof arg === "string") arg = JSON.parse(arg);
			for (i in arg) ret.push(encodeSingle(type, arg[i]));
			if (size === "dynamic") {
				var length = encodeSingle("uint256", arg.length);
				ret.unshift(length);
			}
			return Buffer.concat(ret);
		} else if (type === "bytes") {
			arg = new Buffer(arg);
			ret = Buffer.concat([encodeSingle("uint256", arg.length), arg]);
			if (arg.length % 32 !== 0) ret = Buffer.concat([ret, util.zeros(32 - arg.length % 32)]);
			return ret;
		} else if (type.startsWith("bytes")) {
			size = parseTypeN(type);
			if (size < 1 || size > 32) throw new Error("Invalid bytes<N> width: " + size);
			return util.setLengthRight(arg, 32);
		} else if (type.startsWith("uint")) {
			size = parseTypeN(type);
			if (size % 8 || size < 8 || size > 256) throw new Error("Invalid uint<N> width: " + size);
			num = parseNumber(arg);
			const bitLength = util.bitLengthFromBigInt(num);
			if (bitLength > size) throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
			if (num < 0) throw new Error("Supplied uint is negative");
			return util.bufferBEFromBigInt(num, 32);
		} else if (type.startsWith("int")) {
			size = parseTypeN(type);
			if (size % 8 || size < 8 || size > 256) throw new Error("Invalid int<N> width: " + size);
			num = parseNumber(arg);
			const bitLength = util.bitLengthFromBigInt(num);
			if (bitLength > size) throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
			const twos = util.twosFromBigInt(num, 256);
			return util.bufferBEFromBigInt(twos, 32);
		} else if (type.startsWith("ufixed")) {
			size = parseTypeNxM(type);
			num = parseNumber(arg);
			if (num < 0) throw new Error("Supplied ufixed is negative");
			return encodeSingle("uint256", num * BigInt(2) ** BigInt(size[1]));
		} else if (type.startsWith("fixed")) {
			size = parseTypeNxM(type);
			return encodeSingle("int256", parseNumber(arg) * BigInt(2) ** BigInt(size[1]));
		}
		throw new Error("Unsupported or invalid type: " + type);
	}
	function isDynamic(type) {
		return type === "string" || type === "bytes" || parseTypeArray(type) === "dynamic";
	}
	function isArray(type) {
		return type.lastIndexOf("]") === type.length - 1;
	}
	function rawEncode(types, values) {
		var output = [];
		var data = [];
		var headLength = 32 * types.length;
		for (var i in types) {
			var type = elementaryName(types[i]);
			var value = values[i];
			var cur = encodeSingle(type, value);
			if (isDynamic(type)) {
				output.push(encodeSingle("uint256", headLength));
				data.push(cur);
				headLength += cur.length;
			} else output.push(cur);
		}
		return Buffer.concat(output.concat(data));
	}
	function solidityPack(types, values) {
		if (types.length !== values.length) throw new Error("Number of types are not matching the values");
		var size, num;
		var ret = [];
		for (var i = 0; i < types.length; i++) {
			var type = elementaryName(types[i]);
			var value = values[i];
			if (type === "bytes") ret.push(value);
			else if (type === "string") ret.push(new Buffer(value, "utf8"));
			else if (type === "bool") ret.push(new Buffer(value ? "01" : "00", "hex"));
			else if (type === "address") ret.push(util.setLength(value, 20));
			else if (type.startsWith("bytes")) {
				size = parseTypeN(type);
				if (size < 1 || size > 32) throw new Error("Invalid bytes<N> width: " + size);
				ret.push(util.setLengthRight(value, size));
			} else if (type.startsWith("uint")) {
				size = parseTypeN(type);
				if (size % 8 || size < 8 || size > 256) throw new Error("Invalid uint<N> width: " + size);
				num = parseNumber(value);
				const bitLength = util.bitLengthFromBigInt(num);
				if (bitLength > size) throw new Error("Supplied uint exceeds width: " + size + " vs " + bitLength);
				ret.push(util.bufferBEFromBigInt(num, size / 8));
			} else if (type.startsWith("int")) {
				size = parseTypeN(type);
				if (size % 8 || size < 8 || size > 256) throw new Error("Invalid int<N> width: " + size);
				num = parseNumber(value);
				const bitLength = util.bitLengthFromBigInt(num);
				if (bitLength > size) throw new Error("Supplied int exceeds width: " + size + " vs " + bitLength);
				const twos = util.twosFromBigInt(num, size);
				ret.push(util.bufferBEFromBigInt(twos, size / 8));
			} else throw new Error("Unsupported or invalid type: " + type);
		}
		return Buffer.concat(ret);
	}
	function soliditySHA3(types, values) {
		return util.keccak(solidityPack(types, values));
	}
	module.exports = {
		rawEncode,
		solidityPack,
		soliditySHA3
	};
}));
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/constants.js
var import_eth_eip712_util = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	var abi = require_abi();
	var TYPED_MESSAGE_SCHEMA = {
		type: "object",
		properties: {
			types: {
				type: "object",
				additionalProperties: {
					type: "array",
					items: {
						type: "object",
						properties: {
							name: { type: "string" },
							type: { type: "string" }
						},
						required: ["name", "type"]
					}
				}
			},
			primaryType: { type: "string" },
			domain: { type: "object" },
			message: { type: "object" }
		},
		required: [
			"types",
			"primaryType",
			"domain",
			"message"
		]
	};
	/**
	* A collection of utility functions used for signing typed data
	*/
	var TypedDataUtils = {
		/**
		* Encodes an object by encoding and concatenating each of its members
		*
		* @param {string} primaryType - Root type
		* @param {Object} data - Object to encode
		* @param {Object} types - Type definitions
		* @returns {string} - Encoded representation of an object
		*/
		encodeData(primaryType, data, types, useV4 = true) {
			const encodedTypes = ["bytes32"];
			const encodedValues = [this.hashType(primaryType, types)];
			if (useV4) {
				const encodeField = (name, type, value) => {
					if (types[type] !== void 0) return ["bytes32", value == null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : util.keccak(this.encodeData(type, value, types, useV4))];
					if (value === void 0) throw new Error(`missing value for field ${name} of type ${type}`);
					if (type === "bytes") return ["bytes32", util.keccak(value)];
					if (type === "string") {
						if (typeof value === "string") value = Buffer.from(value, "utf8");
						return ["bytes32", util.keccak(value)];
					}
					if (type.lastIndexOf("]") === type.length - 1) {
						const parsedType = type.slice(0, type.lastIndexOf("["));
						const typeValuePairs = value.map((item) => encodeField(name, parsedType, item));
						return ["bytes32", util.keccak(abi.rawEncode(typeValuePairs.map(([type]) => type), typeValuePairs.map(([, value]) => value)))];
					}
					return [type, value];
				};
				for (const field of types[primaryType]) {
					const [type, value] = encodeField(field.name, field.type, data[field.name]);
					encodedTypes.push(type);
					encodedValues.push(value);
				}
			} else for (const field of types[primaryType]) {
				let value = data[field.name];
				if (value !== void 0) {
					if (field.type === "bytes") {
						encodedTypes.push("bytes32");
						value = util.keccak(value);
						encodedValues.push(value);
					} else if (field.type === "string") {
						encodedTypes.push("bytes32");
						if (typeof value === "string") value = Buffer.from(value, "utf8");
						value = util.keccak(value);
						encodedValues.push(value);
					} else if (types[field.type] !== void 0) {
						encodedTypes.push("bytes32");
						value = util.keccak(this.encodeData(field.type, value, types, useV4));
						encodedValues.push(value);
					} else if (field.type.lastIndexOf("]") === field.type.length - 1) throw new Error("Arrays currently unimplemented in encodeData");
					else {
						encodedTypes.push(field.type);
						encodedValues.push(value);
					}
				}
			}
			return abi.rawEncode(encodedTypes, encodedValues);
		},
		/**
		* Encodes the type of an object by encoding a comma delimited list of its members
		*
		* @param {string} primaryType - Root type to encode
		* @param {Object} types - Type definitions
		* @returns {string} - Encoded representation of the type of an object
		*/
		encodeType(primaryType, types) {
			let result = "";
			let deps = this.findTypeDependencies(primaryType, types).filter((dep) => dep !== primaryType);
			deps = [primaryType].concat(deps.sort());
			for (const type of deps) {
				if (!types[type]) throw new Error("No type definition specified: " + type);
				result += type + "(" + types[type].map(({ name, type }) => type + " " + name).join(",") + ")";
			}
			return result;
		},
		/**
		* Finds all types within a type definition object
		*
		* @param {string} primaryType - Root type
		* @param {Object} types - Type definitions
		* @param {Array} results - current set of accumulated types
		* @returns {Array} - Set of all types found in the type definition
		*/
		findTypeDependencies(primaryType, types, results = []) {
			primaryType = primaryType.match(/^\w*/)[0];
			if (results.includes(primaryType) || types[primaryType] === void 0) return results;
			results.push(primaryType);
			for (const field of types[primaryType]) for (const dep of this.findTypeDependencies(field.type, types, results)) !results.includes(dep) && results.push(dep);
			return results;
		},
		/**
		* Hashes an object
		*
		* @param {string} primaryType - Root type
		* @param {Object} data - Object to hash
		* @param {Object} types - Type definitions
		* @returns {Buffer} - Hash of an object
		*/
		hashStruct(primaryType, data, types, useV4 = true) {
			return util.keccak(this.encodeData(primaryType, data, types, useV4));
		},
		/**
		* Hashes the type of an object
		*
		* @param {string} primaryType - Root type to hash
		* @param {Object} types - Type definitions
		* @returns {string} - Hash of an object
		*/
		hashType(primaryType, types) {
			return util.keccak(this.encodeType(primaryType, types));
		},
		/**
		* Removes properties from a message object that are not defined per EIP-712
		*
		* @param {Object} data - typed message object
		* @returns {Object} - typed message object with only allowed fields
		*/
		sanitizeData(data) {
			const sanitizedData = {};
			for (const key in TYPED_MESSAGE_SCHEMA.properties) data[key] && (sanitizedData[key] = data[key]);
			if (sanitizedData.types) sanitizedData.types = Object.assign({ EIP712Domain: [] }, sanitizedData.types);
			return sanitizedData;
		},
		/**
		* Returns the hash of a typed message as per EIP-712 for signing
		*
		* @param {Object} typedData - Types message data to sign
		* @returns {string} - sha3 hash for signing
		*/
		hash(typedData, useV4 = true) {
			const sanitizedData = this.sanitizeData(typedData);
			const parts = [Buffer.from("1901", "hex")];
			parts.push(this.hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, useV4));
			if (sanitizedData.primaryType !== "EIP712Domain") parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4));
			return util.keccak(Buffer.concat(parts));
		}
	};
	module.exports = {
		TYPED_MESSAGE_SCHEMA,
		TypedDataUtils,
		hashForSignTypedDataLegacy: function(msgParams) {
			return typedSignatureHashLegacy(msgParams.data);
		},
		hashForSignTypedData_v3: function(msgParams) {
			return TypedDataUtils.hash(msgParams.data, false);
		},
		hashForSignTypedData_v4: function(msgParams) {
			return TypedDataUtils.hash(msgParams.data);
		}
	};
	/**
	* @param typedData - Array of data along with types, as per EIP712.
	* @returns Buffer
	*/
	function typedSignatureHashLegacy(typedData) {
		const error = /* @__PURE__ */ new Error("Expect argument to be non-empty array");
		if (typeof typedData !== "object" || !typedData.length) throw error;
		const data = typedData.map(function(e) {
			return e.type === "bytes" ? util.toBuffer(e.value) : e.value;
		});
		const types = typedData.map(function(e) {
			return e.type;
		});
		const schema = typedData.map(function(e) {
			if (!e.name) throw error;
			return e.type + " " + e.name;
		});
		return abi.soliditySHA3(["bytes32", "bytes32"], [abi.soliditySHA3(new Array(typedData.length).fill("string"), schema), abi.soliditySHA3(types, data)]);
	}
})))(), 1);
var WALLET_USER_NAME_KEY = "walletUsername";
var LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
var APP_VERSION_KEY = "AppVersion";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/Web3Response.js
function isErrorResponse(response) {
	return response.errorMessage !== void 0;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkCipher.js
var WalletLinkCipher = class {
	constructor(secret) {
		this.secret = secret;
	}
	/**
	*
	* @param plainText string to be encrypted
	* returns hex string representation of bytes in the order: initialization vector (iv),
	* auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes. Remaining bytes are the
	* encrypted plainText.
	*/
	async encrypt(plainText) {
		const secret = this.secret;
		if (secret.length !== 64) throw Error(`secret must be 256 bits`);
		const ivBytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12));
		const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
		const enc = new TextEncoder();
		const encryptedResult = await window.crypto.subtle.encrypt({
			name: "AES-GCM",
			iv: ivBytes
		}, secretKey, enc.encode(plainText));
		const tagLength = 16;
		const authTag = encryptedResult.slice(encryptedResult.byteLength - tagLength);
		const encryptedPlaintext = encryptedResult.slice(0, encryptedResult.byteLength - tagLength);
		const authTagBytes = new Uint8Array(authTag);
		const encryptedPlaintextBytes = new Uint8Array(encryptedPlaintext);
		return uint8ArrayToHex(new Uint8Array([
			...ivBytes,
			...authTagBytes,
			...encryptedPlaintextBytes
		]));
	}
	/**
	*
	* @param cipherText hex string representation of bytes in the order: initialization vector (iv),
	* auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes.
	*/
	async decrypt(cipherText) {
		const secret = this.secret;
		if (secret.length !== 64) throw Error(`secret must be 256 bits`);
		return new Promise((resolve, reject) => {
			(async function() {
				const secretKey = await crypto.subtle.importKey("raw", hexStringToUint8Array(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
				const encrypted = hexStringToUint8Array(cipherText);
				const ivBytes = encrypted.slice(0, 12);
				const authTagBytes = encrypted.slice(12, 28);
				const encryptedPlaintextBytes = encrypted.slice(28);
				const concattedBytes = new Uint8Array([...encryptedPlaintextBytes, ...authTagBytes]);
				const algo = {
					name: "AES-GCM",
					iv: new Uint8Array(ivBytes)
				};
				try {
					const decrypted = await window.crypto.subtle.decrypt(algo, secretKey, concattedBytes);
					resolve(new TextDecoder().decode(decrypted));
				} catch (err) {
					reject(err);
				}
			})();
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkHTTP.js
var WalletLinkHTTP = class {
	constructor(linkAPIUrl, sessionId, sessionKey) {
		this.linkAPIUrl = linkAPIUrl;
		this.sessionId = sessionId;
		const credentials = `${sessionId}:${sessionKey}`;
		this.auth = `Basic ${btoa(credentials)}`;
	}
	async markUnseenEventsAsSeen(events) {
		return Promise.all(events.map((e) => fetch(`${this.linkAPIUrl}/events/${e.eventId}/seen`, {
			method: "POST",
			headers: { Authorization: this.auth }
		}))).catch((error) => console.error("Unabled to mark event as failed:", error));
	}
	async fetchUnseenEvents() {
		var _a;
		const response = await fetch(`${this.linkAPIUrl}/events?unseen=true`, { headers: { Authorization: this.auth } });
		if (response.ok) {
			const { events, error } = await response.json();
			if (error) throw new Error(`Check unseen events failed: ${error}`);
			const responseEvents = (_a = events === null || events === void 0 ? void 0 : events.filter((e) => e.event === "Web3Response").map((e) => ({
				type: "Event",
				sessionId: this.sessionId,
				eventId: e.id,
				event: e.event,
				data: e.data
			}))) !== null && _a !== void 0 ? _a : [];
			this.markUnseenEventsAsSeen(responseEvents);
			return responseEvents;
		}
		throw new Error(`Check unseen events failed: ${response.status}`);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkWebSocket.js
var ConnectionState;
(function(ConnectionState) {
	ConnectionState[ConnectionState["DISCONNECTED"] = 0] = "DISCONNECTED";
	ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
	ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
})(ConnectionState || (ConnectionState = {}));
var WalletLinkWebSocket = class {
	setConnectionStateListener(listener) {
		this.connectionStateListener = listener;
	}
	setIncomingDataListener(listener) {
		this.incomingDataListener = listener;
	}
	/**
	* Constructor
	* @param url WebSocket server URL
	* @param [WebSocketClass] Custom WebSocket implementation
	*/
	constructor(url, WebSocketClass = WebSocket) {
		this.WebSocketClass = WebSocketClass;
		this.webSocket = null;
		this.pendingData = [];
		this.url = url.replace(/^http/, "ws");
	}
	/**
	* Make a websocket connection
	* @returns a Promise that resolves when connected
	*/
	async connect() {
		if (this.webSocket) throw new Error("webSocket object is not null");
		return new Promise((resolve, reject) => {
			var _a;
			let webSocket;
			try {
				this.webSocket = webSocket = new this.WebSocketClass(this.url);
			} catch (err) {
				reject(err);
				return;
			}
			(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.CONNECTING);
			webSocket.onclose = (evt) => {
				var _a;
				this.clearWebSocket();
				reject(/* @__PURE__ */ new Error(`websocket error ${evt.code}: ${evt.reason}`));
				(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.DISCONNECTED);
			};
			webSocket.onopen = (_) => {
				var _a;
				resolve();
				(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.CONNECTED);
				if (this.pendingData.length > 0) {
					[...this.pendingData].forEach((data) => this.sendData(data));
					this.pendingData = [];
				}
			};
			webSocket.onmessage = (evt) => {
				var _a, _b;
				if (evt.data === "h") (_a = this.incomingDataListener) === null || _a === void 0 || _a.call(this, { type: "Heartbeat" });
				else try {
					const message = JSON.parse(evt.data);
					(_b = this.incomingDataListener) === null || _b === void 0 || _b.call(this, message);
				} catch (_c) {}
			};
		});
	}
	/**
	* Disconnect from server
	*/
	disconnect() {
		var _a;
		const { webSocket } = this;
		if (!webSocket) return;
		this.clearWebSocket();
		(_a = this.connectionStateListener) === null || _a === void 0 || _a.call(this, ConnectionState.DISCONNECTED);
		this.connectionStateListener = void 0;
		this.incomingDataListener = void 0;
		try {
			webSocket.close();
		} catch (_b) {}
	}
	/**
	* Send data to server
	* @param data text to send
	*/
	sendData(data) {
		const { webSocket } = this;
		if (!webSocket) {
			this.pendingData.push(data);
			this.connect();
			return;
		}
		webSocket.send(data);
	}
	clearWebSocket() {
		const { webSocket } = this;
		if (!webSocket) return;
		this.webSocket = null;
		webSocket.onclose = null;
		webSocket.onerror = null;
		webSocket.onmessage = null;
		webSocket.onopen = null;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/connection/WalletLinkConnection.js
var HEARTBEAT_INTERVAL = 1e4;
var REQUEST_TIMEOUT = 6e4;
/**
* Coinbase Wallet Connection
*/
var WalletLinkConnection = class {
	/**
	* Constructor
	* @param session Session
	* @param linkAPIUrl Coinbase Wallet link server URL
	* @param listener WalletLinkConnectionUpdateListener
	* @param [WebSocketClass] Custom WebSocket implementation
	*/
	constructor({ session, linkAPIUrl, listener }) {
		this.destroyed = false;
		this.lastHeartbeatResponse = 0;
		this.nextReqId = IntNumber(1);
		/**
		* true if connected and authenticated, else false
		* runs listener when connected status changes
		*/
		this._connected = false;
		/**
		* true if linked (a guest has joined before)
		* runs listener when linked status changes
		*/
		this._linked = false;
		this.shouldFetchUnseenEventsOnConnect = false;
		this.requestResolutions = /* @__PURE__ */ new Map();
		this.handleSessionMetadataUpdated = (metadata) => {
			if (!metadata) return;
			(/* @__PURE__ */ new Map([
				["__destroyed", this.handleDestroyed],
				["EthereumAddress", this.handleAccountUpdated],
				["WalletUsername", this.handleWalletUsernameUpdated],
				["AppVersion", this.handleAppVersionUpdated],
				["ChainId", (v) => metadata.JsonRpcUrl && this.handleChainUpdated(v, metadata.JsonRpcUrl)]
			])).forEach((handler, key) => {
				const value = metadata[key];
				if (value === void 0) return;
				handler(value);
			});
		};
		this.handleDestroyed = (__destroyed) => {
			var _a;
			if (__destroyed !== "1") return;
			(_a = this.listener) === null || _a === void 0 || _a.resetAndReload();
		};
		this.handleAccountUpdated = async (encryptedEthereumAddress) => {
			var _a;
			const address = await this.cipher.decrypt(encryptedEthereumAddress);
			(_a = this.listener) === null || _a === void 0 || _a.accountUpdated(address);
		};
		this.handleMetadataUpdated = async (key, encryptedMetadataValue) => {
			var _a;
			const decryptedValue = await this.cipher.decrypt(encryptedMetadataValue);
			(_a = this.listener) === null || _a === void 0 || _a.metadataUpdated(key, decryptedValue);
		};
		this.handleWalletUsernameUpdated = async (walletUsername) => {
			this.handleMetadataUpdated(WALLET_USER_NAME_KEY, walletUsername);
		};
		this.handleAppVersionUpdated = async (appVersion) => {
			this.handleMetadataUpdated(APP_VERSION_KEY, appVersion);
		};
		this.handleChainUpdated = async (encryptedChainId, encryptedJsonRpcUrl) => {
			var _a;
			const chainId = await this.cipher.decrypt(encryptedChainId);
			const jsonRpcUrl = await this.cipher.decrypt(encryptedJsonRpcUrl);
			(_a = this.listener) === null || _a === void 0 || _a.chainUpdated(chainId, jsonRpcUrl);
		};
		this.session = session;
		this.cipher = new WalletLinkCipher(session.secret);
		this.listener = listener;
		const ws = new WalletLinkWebSocket(`${linkAPIUrl}/rpc`, WebSocket);
		ws.setConnectionStateListener(async (state) => {
			let connected = false;
			switch (state) {
				case ConnectionState.DISCONNECTED:
					if (!this.destroyed) {
						const connect = async () => {
							await new Promise((resolve) => setTimeout(resolve, 5e3));
							if (!this.destroyed) ws.connect().catch(() => {
								connect();
							});
						};
						connect();
					}
					break;
				case ConnectionState.CONNECTED:
					connected = await this.handleConnected();
					this.updateLastHeartbeat();
					setInterval(() => {
						this.heartbeat();
					}, HEARTBEAT_INTERVAL);
					if (this.shouldFetchUnseenEventsOnConnect) this.fetchUnseenEventsAPI();
					break;
				case ConnectionState.CONNECTING:
			}
			if (this.connected !== connected) this.connected = connected;
		});
		ws.setIncomingDataListener((m) => {
			var _a;
			switch (m.type) {
				case "Heartbeat":
					this.updateLastHeartbeat();
					return;
				case "IsLinkedOK":
				case "Linked": {
					const linked = m.type === "IsLinkedOK" ? m.linked : void 0;
					this.linked = linked || m.onlineGuests > 0;
					break;
				}
				case "GetSessionConfigOK":
				case "SessionConfigUpdated":
					this.handleSessionMetadataUpdated(m.metadata);
					break;
				case "Event": this.handleIncomingEvent(m);
			}
			if (m.id !== void 0) (_a = this.requestResolutions.get(m.id)) === null || _a === void 0 || _a(m);
		});
		this.ws = ws;
		this.http = new WalletLinkHTTP(linkAPIUrl, session.id, session.key);
	}
	/**
	* Make a connection to the server
	*/
	connect() {
		if (this.destroyed) throw new Error("instance is destroyed");
		this.ws.connect();
	}
	/**
	* Terminate connection, and mark as destroyed. To reconnect, create a new
	* instance of WalletSDKConnection
	*/
	async destroy() {
		if (this.destroyed) return;
		await this.makeRequest({
			type: "SetSessionConfig",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			metadata: { __destroyed: "1" }
		}, { timeout: 1e3 });
		this.destroyed = true;
		this.ws.disconnect();
		this.listener = void 0;
	}
	get connected() {
		return this._connected;
	}
	set connected(connected) {
		this._connected = connected;
	}
	get linked() {
		return this._linked;
	}
	set linked(linked) {
		var _a, _b;
		this._linked = linked;
		if (linked) (_a = this.onceLinked) === null || _a === void 0 || _a.call(this);
		(_b = this.listener) === null || _b === void 0 || _b.linkedUpdated(linked);
	}
	setOnceLinked(callback) {
		return new Promise((resolve) => {
			if (this.linked) callback().then(resolve);
			else this.onceLinked = () => {
				callback().then(resolve);
				this.onceLinked = void 0;
			};
		});
	}
	async handleIncomingEvent(m) {
		var _a;
		if (m.type !== "Event" || m.event !== "Web3Response") return;
		const decryptedData = await this.cipher.decrypt(m.data);
		const message = JSON.parse(decryptedData);
		if (message.type !== "WEB3_RESPONSE") return;
		const { id, response } = message;
		(_a = this.listener) === null || _a === void 0 || _a.handleWeb3ResponseMessage(id, response);
	}
	async checkUnseenEvents() {
		if (!this.connected) {
			this.shouldFetchUnseenEventsOnConnect = true;
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
		try {
			await this.fetchUnseenEventsAPI();
		} catch (e) {
			console.error("Unable to check for unseen events", e);
		}
	}
	async fetchUnseenEventsAPI() {
		this.shouldFetchUnseenEventsOnConnect = false;
		(await this.http.fetchUnseenEvents()).forEach((e) => this.handleIncomingEvent(e));
	}
	/**
	* Publish an event and emit event ID when successful
	* @param event event name
	* @param unencryptedData unencrypted event data
	* @param callWebhook whether the webhook should be invoked
	* @returns a Promise that emits event ID when successful
	*/
	async publishEvent(event, unencryptedData, callWebhook = false) {
		const data = await this.cipher.encrypt(JSON.stringify(Object.assign(Object.assign({}, unencryptedData), {
			origin: location.origin,
			location: location.href,
			relaySource: "coinbaseWalletExtension" in window && window.coinbaseWalletExtension ? "injected_sdk" : "sdk"
		})));
		const message = {
			type: "PublishEvent",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			event,
			data,
			callWebhook
		};
		return this.setOnceLinked(async () => {
			const res = await this.makeRequest(message);
			if (res.type === "Fail") throw new Error(res.error || "failed to publish event");
			return res.eventId;
		});
	}
	sendData(message) {
		this.ws.sendData(JSON.stringify(message));
	}
	updateLastHeartbeat() {
		this.lastHeartbeatResponse = Date.now();
	}
	heartbeat() {
		if (Date.now() - this.lastHeartbeatResponse > HEARTBEAT_INTERVAL * 2) {
			this.ws.disconnect();
			return;
		}
		try {
			this.ws.sendData("h");
		} catch (_a) {}
	}
	async makeRequest(message, options = { timeout: REQUEST_TIMEOUT }) {
		const reqId = message.id;
		this.sendData(message);
		let timeoutId;
		return Promise.race([new Promise((_, reject) => {
			timeoutId = window.setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`request ${reqId} timed out`));
			}, options.timeout);
		}), new Promise((resolve) => {
			this.requestResolutions.set(reqId, (m) => {
				clearTimeout(timeoutId);
				resolve(m);
				this.requestResolutions.delete(reqId);
			});
		})]);
	}
	async handleConnected() {
		if ((await this.makeRequest({
			type: "HostSession",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id,
			sessionKey: this.session.key
		})).type === "Fail") return false;
		this.sendData({
			type: "IsLinked",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id
		});
		this.sendData({
			type: "GetSessionConfig",
			id: IntNumber(this.nextReqId++),
			sessionId: this.session.id
		});
		return true;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/RelayEventManager.js
var RelayEventManager = class {
	constructor() {
		this._nextRequestId = 0;
		this.callbacks = /* @__PURE__ */ new Map();
	}
	makeRequestId() {
		this._nextRequestId = (this._nextRequestId + 1) % 2147483647;
		const id = this._nextRequestId;
		const idStr = prepend0x(id.toString(16));
		if (this.callbacks.get(idStr)) this.callbacks.delete(idStr);
		return id;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/utils.js
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes(data) {
	if (typeof data === "string") data = utf8ToBytes(data);
	abytes(data);
	return data;
}
/** For runtime check if class implements interface */
var Hash = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
	if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
	const _32n = BigInt(32);
	const _u32_max = BigInt(4294967295);
	const wh = Number(value >> _32n & _u32_max);
	const wl = Number(value & _u32_max);
	const h = isLE ? 4 : 0;
	const l = isLE ? 0 : 4;
	view.setUint32(byteOffset + h, wh, isLE);
	view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		data = toBytes(data);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to || (to = new this.constructor());
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
* [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
*/
/**
* Round constants:
* First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV[0] | 0;
		this.B = SHA256_IV[1] | 0;
		this.C = SHA256_IV[2] | 0;
		this.D = SHA256_IV[3] | 0;
		this.E = SHA256_IV[4] | 0;
		this.F = SHA256_IV[5] | 0;
		this.G = SHA256_IV[6] | 0;
		this.H = SHA256_IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/@noble/hashes/esm/sha256.js
/**
* SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
*
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*
* Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
* @deprecated
*/
/** @deprecated Use import from `noble/hashes/sha2` module */
var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/type/WalletLinkSession.js
var STORAGE_KEY_SESSION_ID = "session:id";
var STORAGE_KEY_SESSION_SECRET = "session:secret";
var STORAGE_KEY_SESSION_LINKED = "session:linked";
var WalletLinkSession = class WalletLinkSession {
	constructor(storage, id, secret, linked = false) {
		this.storage = storage;
		this.id = id;
		this.secret = secret;
		this.key = bytesToHex(sha256(`${id}, ${secret} WalletLink`));
		this._linked = !!linked;
	}
	static create(storage) {
		const id = randomBytesHex(16);
		const secret = randomBytesHex(32);
		return new WalletLinkSession(storage, id, secret).save();
	}
	static load(storage) {
		const id = storage.getItem(STORAGE_KEY_SESSION_ID);
		const linked = storage.getItem(STORAGE_KEY_SESSION_LINKED);
		const secret = storage.getItem(STORAGE_KEY_SESSION_SECRET);
		if (id && secret) return new WalletLinkSession(storage, id, secret, linked === "1");
		return null;
	}
	get linked() {
		return this._linked;
	}
	set linked(val) {
		this._linked = val;
		this.persistLinked();
	}
	save() {
		this.storage.setItem(STORAGE_KEY_SESSION_ID, this.id);
		this.storage.setItem(STORAGE_KEY_SESSION_SECRET, this.secret);
		this.persistLinked();
		return this;
	}
	persistLinked() {
		this.storage.setItem(STORAGE_KEY_SESSION_LINKED, this._linked ? "1" : "0");
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/util.js
function isInIFrame() {
	try {
		return window.frameElement !== null;
	} catch (e) {
		return false;
	}
}
function getLocation() {
	try {
		if (isInIFrame() && window.top) return window.top.location;
		return window.location;
	} catch (e) {
		return window.location;
	}
}
function isMobileWeb() {
	var _a;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent);
}
function isDarkMode() {
	var _a, _b;
	return (_b = (_a = window === null || window === void 0 ? void 0 : window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) !== null && _b !== void 0 ? _b : false;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset-css.js
var cssReset_css_default = (() => `@namespace svg "http://www.w3.org/2000/svg";.-cbwsdk-css-reset,.-cbwsdk-css-reset *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:rgba(0,0,0,0);background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;box-shadow:none;box-sizing:border-box;caption-side:top;clear:none;clip:auto;color:inherit;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;counter-increment:none;counter-reset:none;direction:ltr;empty-cells:show;float:none;font:normal;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;height:auto;hyphens:none;letter-spacing:normal;line-height:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;margin:0;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;padding:0;padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;pointer-events:auto;position:static;quotes:"\\201C" "\\201D" "\\2018" "\\2019";tab-size:8;table-layout:auto;text-align:inherit;text-align-last:auto;text-decoration:none;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;word-spacing:normal;z-index:auto}.-cbwsdk-css-reset strong{font-weight:bold}.-cbwsdk-css-reset *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;line-height:1}.-cbwsdk-css-reset [class*=container]{margin:0;padding:0}.-cbwsdk-css-reset style{display:none}`)();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/cssReset/cssReset.js
function injectCssReset() {
	const styleEl = document.createElement("style");
	styleEl.type = "text/css";
	styleEl.appendChild(document.createTextNode(cssReset_css_default));
	document.documentElement.appendChild(styleEl);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/clsx/dist/clsx.m.js
function r$2(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r$2(e[t])) && (n && (n += " "), n += f);
	else for (t in e) e[t] && (n && (n += " "), n += t);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = ""; f < arguments.length;) (e = arguments[f++]) && (t = r$2(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/preact/dist/preact.mjs
var n;
var l$1;
var u$1;
var i$1;
var r$1;
var o$1;
var e$1;
var f$1;
var c$1;
var a$1;
var s$1;
var h$1;
var p$1;
var v$1;
var d$1 = {};
var w$1 = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m$1(n, l) {
	for (var u in l) n[u] = l[u];
	return n;
}
function b(n) {
	n && n.parentNode && n.parentNode.removeChild(n);
}
function k$1(l, u, t) {
	var i, r, o, e = {};
	for (o in u) "key" == o ? i = u[o] : "ref" == o ? r = u[o] : e[o] = u[o];
	if (arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for (o in l.defaultProps) void 0 === e[o] && (e[o] = l.defaultProps[o]);
	return x(l, e, i, r, null);
}
function x(n, t, i, r, o) {
	var e = {
		type: n,
		props: t,
		key: i,
		ref: r,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: null == o ? ++u$1 : o,
		__i: -1,
		__u: 0
	};
	return null == o && null != l$1.vnode && l$1.vnode(e), e;
}
function S(n) {
	return n.children;
}
function C$1(n, l) {
	this.props = n, this.context = l;
}
function $(n, l) {
	if (null == l) return n.__ ? $(n.__, n.__i + 1) : null;
	for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
	return "function" == typeof n.type ? $(n) : null;
}
function I(n) {
	if (n.__P && n.__d) {
		var u = n.__v, t = u.__e, i = [], r = [], o = m$1({}, u);
		o.__v = u.__v + 1, l$1.vnode && l$1.vnode(o), q(n.__P, o, u, n.__n, n.__P.namespaceURI, 32 & u.__u ? [t] : null, i, null == t ? $(u) : t, !!(32 & u.__u), r), o.__v = u.__v, o.__.__k[o.__i] = o, D$1(i, o, r), u.__e = u.__ = null, o.__e != t && P(o);
	}
}
function P(n) {
	if (null != (n = n.__) && null != n.__c) return n.__e = n.__c.base = null, n.__k.some(function(l) {
		if (null != l && null != l.__e) return n.__e = n.__c.base = l.__e;
	}), P(n);
}
function A(n) {
	(!n.__d && (n.__d = !0) && i$1.push(n) && !H.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)(H);
}
function H() {
	try {
		for (var n, l = 1; i$1.length;) i$1.length > l && i$1.sort(e$1), n = i$1.shift(), l = i$1.length, I(n);
	} finally {
		i$1.length = H.__r = 0;
	}
}
function L(n, l, u, t, i, r, o, e, f, c, a) {
	var s, h, p, v, y, _, g = t && t.__k || w$1, m = l.length;
	for (f = T(u, l, g, f, m), s = 0; s < m; s++) null != (p = u.__k[s]) && (h = -1 != p.__i && g[p.__i] || d$1, p.__i = s, _ = q(n, p, h, i, r, o, e, f, c, a), v = p.__e, p.ref && h.ref != p.ref && (h.ref && J(h.ref, null, p), a.push(p.ref, p.__c || v, p)), null == y && null != v && (y = v), 4 & p.__u ? (f = j$1(p, f, n), h.__e && (h.__e = null)) : "function" == typeof p.type && void 0 !== _ ? f = _ : v && (f = v.nextSibling), p.__u &= -7);
	return u.__e = y, f;
}
function T(n, l, u, t, i) {
	var r, o, e, f, c, a = u.length, s = a, h = 0;
	for (n.__k = new Array(i), r = 0; r < i; r++) null != (o = l[r]) && "boolean" != typeof o && "function" != typeof o ? ("string" == typeof o || "number" == typeof o || "bigint" == typeof o || o.constructor == String ? o = n.__k[r] = x(null, o, null, null, null) : g(o) ? o = n.__k[r] = x(S, { children: o }, null, null, null) : void 0 === o.constructor && o.__b > 0 ? o = n.__k[r] = x(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : n.__k[r] = o, f = r + h, o.__ = n, o.__b = n.__b + 1, e = null, -1 != (c = o.__i = O(o, u, f, s)) && (s--, (e = u[c]) && (e.__u |= 2)), null == e || null == e.__v ? (-1 == c && (i > a ? h-- : i < a && h++), "function" != typeof o.type && (o.__u |= 4)) : c != f && (c == f - 1 ? h-- : c == f + 1 ? h++ : (c > f ? h-- : h++, o.__u |= 4))) : n.__k[r] = null;
	if (s) for (r = 0; r < a; r++) null != (e = u[r]) && 0 == (2 & e.__u) && (e.__e == t && (t = $(e)), K(e, e));
	return t;
}
function j$1(n, l, u) {
	var t, i;
	if ("function" == typeof n.type) {
		for (t = n.__k, i = 0; t && i < t.length; i++) t[i] && (t[i].__ = n, l = j$1(t[i], l, u));
		return l;
	}
	n.__e != l && (l && n.type && !l.parentNode && (l = $(n)), l = u.insertBefore(n.__e, l || null));
	do
		l = l && l.nextSibling;
	while (null != l && 8 == l.nodeType);
	return l;
}
function O(n, l, u, t) {
	var i, r, o, e = n.key, f = n.type, c = l[u], a = null != c && 0 == (2 & c.__u);
	if (null === c && null == e || a && e == c.key && f == c.type) return u;
	if (t > (a ? 1 : 0)) {
		for (i = u - 1, r = u + 1; i >= 0 || r < l.length;) if (null != (c = l[o = i >= 0 ? i-- : r++]) && 0 == (2 & c.__u) && e == c.key && f == c.type) return o;
	}
	return -1;
}
function z$1(n, l, u) {
	"-" == l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || _.test(l) ? u : u + "px";
}
function N(n, l, u, t, i) {
	var r, o;
	n: if ("style" == l) if ("string" == typeof u) n.style.cssText = u;
	else {
		if ("string" == typeof t && (n.style.cssText = t = ""), t) for (l in t) u && l in u || z$1(n.style, l, "");
		if (u) for (l in u) t && u[l] == t[l] || z$1(n.style, l, u[l]);
	}
	else if ("o" == l[0] && "n" == l[1]) r = l != (l = l.replace(s$1, "$1")), o = l.toLowerCase(), l = o in n || "onFocusOut" == l || "onFocusIn" == l ? o.slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + r] = u, u ? t ? u[a$1] = t[a$1] : (u[a$1] = h$1, n.addEventListener(l, r ? v$1 : p$1, r)) : n.removeEventListener(l, r ? v$1 : p$1, r);
	else {
		if ("http://www.w3.org/2000/svg" == i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
		else if ("width" != l && "height" != l && "href" != l && "list" != l && "form" != l && "tabIndex" != l && "download" != l && "rowSpan" != l && "colSpan" != l && "role" != l && "popover" != l && l in n) try {
			n[l] = null == u ? "" : u;
			break n;
		} catch (n) {}
		"function" == typeof u || (null == u || !1 === u && "-" != l[4] ? n.removeAttribute(l) : n.setAttribute(l, "popover" == l && 1 == u ? "" : u));
	}
}
function V(n) {
	return function(u) {
		if (this.l) {
			var t = this.l[u.type + n];
			if (null == u[c$1]) u[c$1] = h$1++;
			else if (u[c$1] < t[a$1]) return;
			return t(l$1.event ? l$1.event(u) : u);
		}
	};
}
function q(n, u, t, i, r, o, e, f, c, a) {
	var s, h, p, v, y, d, _, k, x, M, I, P, A, H, T, j, F = u.type;
	if (void 0 !== u.constructor) return null;
	128 & t.__u && (c = !!(32 & t.__u), o = [f = u.__e = t.__e]), (s = l$1.__b) && s(u);
	n: if ("function" == typeof F) {
		h = e.length;
		try {
			if (x = u.props, M = F.prototype && F.prototype.render, I = (s = F.contextType) && i[s.__c], P = s ? I ? I.props.value : s.__ : i, t.__c ? k = (p = u.__c = t.__c).__ = p.__E : (M ? u.__c = p = new F(x, P) : (u.__c = p = new C$1(x, P), p.constructor = F, p.render = Q), I && I.sub(p), p.state || (p.state = {}), p.__n = i, v = p.__d = !0, p.__h = [], p._sb = []), M && null == p.__s && (p.__s = p.state), M && null != F.getDerivedStateFromProps && (p.__s == p.state && (p.__s = m$1({}, p.__s)), m$1(p.__s, F.getDerivedStateFromProps(x, p.__s))), y = p.props, d = p.state, p.__v = u, v) M && null == F.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), M && null != p.componentDidMount && p.__h.push(p.componentDidMount);
			else {
				if (M && null == F.getDerivedStateFromProps && x !== y && null != p.componentWillReceiveProps && p.componentWillReceiveProps(x, P), u.__v == t.__v || !p.__e && null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(x, p.__s, P)) {
					u.__v != t.__v && (p.props = x, p.state = p.__s, p.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.some(function(n) {
						n && (n.__ = u);
					}), w$1.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && e.push(p), f = $(t);
					break n;
				}
				null != p.componentWillUpdate && p.componentWillUpdate(x, p.__s, P), M && null != p.componentDidUpdate && p.__h.push(function() {
					p.componentDidUpdate(y, d, _);
				});
			}
			if (p.context = P, p.props = x, p.__P = n, p.__e = !1, A = l$1.__r, H = 0, M) p.state = p.__s, p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), w$1.push.apply(p.__h, p._sb), p._sb = [];
			else do
				p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), p.state = p.__s;
			while (p.__d && ++H < 25);
			p.state = p.__s, null != p.getChildContext && (i = m$1(m$1({}, i), p.getChildContext())), M && !v && null != p.getSnapshotBeforeUpdate && (_ = p.getSnapshotBeforeUpdate(y, d)), T = null != s && s.type === S && null == s.key ? E(s.props.children) : s, f = L(n, g(T) ? T : [T], u, t, i, r, o, e, f, c, a), p.base = u.__e, u.__u &= -161, p.__h.length && e.push(p), k && (p.__E = p.__ = null);
		} catch (n) {
			if (e.length = h, u.__v = null, c || null != o) {
				if (n.then) {
					for (u.__u |= c ? 160 : 128; f && 8 == f.nodeType && f.nextSibling;) f = f.nextSibling;
					null != o && (o[o.indexOf(f)] = null), u.__e = f;
				} else if (null != o) for (j = o.length; j--;) b(o[j]);
			} else u.__e = t.__e;
			u.__k ??= t.__k || [], n.then || B$1(u), l$1.__e(n, u, t);
		}
	} else null == o && u.__v == t.__v ? (u.__k = t.__k, u.__e = t.__e) : f = u.__e = G(t.__e, u, t, i, r, o, e, c, a);
	return (s = l$1.diffed) && s(u), 128 & u.__u ? void 0 : f;
}
function B$1(n) {
	n && (n.__c && (n.__c.__e = !0), n.__k && n.__k.some(B$1));
}
function D$1(n, u, t) {
	for (var i = 0; i < t.length; i++) J(t[i], t[++i], t[++i]);
	l$1.__c && l$1.__c(u, n), n.some(function(u) {
		try {
			n = u.__h, u.__h = [], n.some(function(n) {
				n.call(u);
			});
		} catch (n) {
			l$1.__e(n, u.__v);
		}
	});
}
function E(n) {
	return "object" != typeof n || null == n || n.__b > 0 ? n : g(n) ? n.map(E) : void 0 !== n.constructor ? null : m$1({}, n);
}
function G(u, t, i, r, o, e, f, c, a) {
	var s, h, p, v, y, w, _, m = i.props || d$1, k = t.props, x = t.type;
	if ("svg" == x ? o = "http://www.w3.org/2000/svg" : "math" == x ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), null != e) {
		for (s = 0; s < e.length; s++) if ((y = e[s]) && "setAttribute" in y == !!x && (x ? y.localName == x : 3 == y.nodeType)) {
			u = y, e[s] = null;
			break;
		}
	}
	if (null == u) {
		if (null == x) return document.createTextNode(k);
		u = document.createElementNS(o, x, k.is && k), c && (l$1.__m && l$1.__m(t, e), c = !1), e = null;
	}
	if (null == x) m === k || c && u.data == k || (u.data = k);
	else {
		if (e = "textarea" == x && null != k.defaultValue ? null : e && n.call(u.childNodes), !c && null != e) for (m = {}, s = 0; s < u.attributes.length; s++) m[(y = u.attributes[s]).name] = y.value;
		for (s in m) y = m[s], "dangerouslySetInnerHTML" == s ? p = y : "children" == s || s in k || "value" == s && "defaultValue" in k || "checked" == s && "defaultChecked" in k || N(u, s, null, y, o);
		for (s in k) y = k[s], "children" == s ? v = y : "dangerouslySetInnerHTML" == s ? h = y : "value" == s ? w = y : "checked" == s ? _ = y : c && "function" != typeof y || m[s] === y || N(u, s, y, m[s], o);
		if (h) c || p && (h.__html == p.__html || h.__html == u.innerHTML) || (u.innerHTML = h.__html), t.__k = [];
		else if (p && (u.innerHTML = ""), L("template" == t.type ? u.content : u, g(v) ? v : [v], t, i, r, "foreignObject" == x ? "http://www.w3.org/1999/xhtml" : o, e, f, e ? e[0] : i.__k && $(i, 0), c, a), null != e) for (s = e.length; s--;) b(e[s]);
		c && "textarea" != x || (s = "value", "progress" == x && null == w ? u.removeAttribute("value") : null != w && (w !== u[s] || "progress" == x && !w || "option" == x && w != m[s]) && N(u, s, w, m[s], o), s = "checked", null != _ && _ != u[s] && N(u, s, _, m[s], o));
	}
	return u;
}
function J(n, u, t) {
	try {
		if ("function" == typeof n) {
			var i = "function" == typeof n.__u;
			i && n.__u(), i && null == u || (n.__u = n(u));
		} else n.current = u;
	} catch (n) {
		l$1.__e(n, t);
	}
}
function K(n, u, t) {
	var i, r;
	if (l$1.unmount && l$1.unmount(n), (i = n.ref) && (i.current && i.current != n.__e || J(i, null, u)), null != (i = n.__c)) {
		if (i.componentWillUnmount) try {
			i.componentWillUnmount();
		} catch (n) {
			l$1.__e(n, u);
		}
		i.base = i.__P = i.__n = null;
	}
	if (i = n.__k) for (r = 0; r < i.length; r++) i[r] && K(i[r], u, t || "function" != typeof n.type);
	t || b(n.__e), n.__c = n.__ = n.__e = void 0;
}
function Q(n, l, u) {
	return this.constructor(n, u);
}
function R(u, t, i) {
	var r, o, e, f;
	t == document && (t = document.documentElement), l$1.__ && l$1.__(u, t), o = (r = "function" == typeof i) ? null : i && i.__k || t.__k, e = [], f = [], q(t, u = (!r && i || t).__k = k$1(S, null, [u]), o || d$1, d$1, t.namespaceURI, !r && i ? [i] : o ? null : t.firstChild ? n.call(t.childNodes) : null, e, !r && i ? i : o ? o.__e : t.firstChild, r, f), D$1(e, u, f), u.props.children = null;
}
n = w$1.slice, l$1 = { __e: function(n, l, u, t) {
	for (var i, r, o; l = l.__;) if ((i = l.__c) && !i.__) try {
		if ((r = i.constructor) && null != r.getDerivedStateFromError && (i.setState(r.getDerivedStateFromError(n)), o = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), o = i.__d), o) return i.__E = i;
	} catch (l) {
		n = l;
	}
	throw n;
} }, u$1 = 0, C$1.prototype.setState = function(n, l) {
	var u = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$1({}, this.state);
	"function" == typeof n && (n = n(m$1({}, u), this.props)), n && m$1(u, n), null != n && this.__v && (l && this._sb.push(l), A(this));
}, C$1.prototype.forceUpdate = function(n) {
	this.__v && (this.__e = !0, n && this.__h.push(n), A(this));
}, C$1.prototype.render = S, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n, l) {
	return n.__v.__b - l.__v.__b;
}, H.__r = 0, f$1 = Math.random().toString(8), c$1 = "__d" + f$1, a$1 = "__a" + f$1, s$1 = /(PointerCapture)$|Capture$/i, h$1 = 0, p$1 = V(!1), v$1 = V(!0);
//#endregion
//#region node_modules/preact/hooks/dist/hooks.mjs
var t;
var r;
var u;
var i;
var o = 0;
var f = [];
var c = l$1;
var e = c.__b;
var a = c.__r;
var v = c.diffed;
var l = c.__c;
var m = c.unmount;
var p = c.__;
function s(n, t) {
	c.__h && c.__h(r, n, o || t), o = 0;
	var u = r.__H || (r.__H = {
		__: [],
		__h: []
	});
	return n >= u.__.length && u.__.push({}), u.__[n];
}
function d(n) {
	return o = 1, y(D, n);
}
function y(n, u, i) {
	var o = s(t++, 2);
	if (o.t = n, !o.__c && (o.__ = [i ? i(u) : D(void 0, u), function(n) {
		var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
		t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
	}], o.__c = r, !r.__f)) {
		var f = function(n, t, r) {
			if (!o.__c.__H) return !0;
			var u = !1, i = o.__c.props !== n;
			if (o.__c.__H.__.some(function(n) {
				if (n.__N) {
					u = !0;
					var t = n.__[0];
					n.__ = n.__N, n.__N = void 0, t !== n.__[0] && (i = !0);
				}
			}), c) {
				var f = c.call(this, n, t, r);
				return u ? f || i : f;
			}
			return !u || i;
		};
		r.__f = !0;
		var c = r.shouldComponentUpdate, e = r.componentWillUpdate;
		r.componentWillUpdate = function(n, t, r) {
			if (this.__e) {
				var u = c;
				c = void 0, f(n, t, r), c = u;
			}
			e && e.call(this, n, t, r);
		}, r.shouldComponentUpdate = f;
	}
	return o.__N || o.__;
}
function h(n, u) {
	var i = s(t++, 3);
	!c.__s && C(i.__H, u) && (i.__ = n, i.u = u, r.__H.__h.push(i));
}
function j() {
	for (var n; n = f.shift();) {
		var t = n.__H;
		if (n.__P && t) try {
			t.__h.some(z), t.__h.some(B), t.__h = [];
		} catch (r) {
			t.__h = [], c.__e(r, n.__v);
		}
	}
}
c.__b = function(n) {
	r = null, e && e(n);
}, c.__ = function(n, t) {
	n && t.__k && t.__k.__m && (n.__m = t.__k.__m), p && p(n, t);
}, c.__r = function(n) {
	a && a(n), t = 0;
	var i = (r = n.__c).__H;
	i && (u === r ? (i.__h = [], r.__h = [], i.__.some(function(n) {
		n.__N && (n.__ = n.__N), n.u = n.__N = void 0;
	})) : (i.__h.some(z), i.__h.some(B), i.__h = [], t = 0)), u = r;
}, c.diffed = function(n) {
	v && v(n);
	var t = n.__c;
	t && t.__H && (t.__H.__h.length && (1 !== f.push(t) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t.__H.__.some(function(n) {
		n.u && (n.__H = n.u, n.u = void 0);
	})), u = r = null;
}, c.__c = function(n, t) {
	t.some(function(n) {
		try {
			n.__h.some(z), n.__h = n.__h.filter(function(n) {
				return !n.__ || B(n);
			});
		} catch (r) {
			t.some(function(n) {
				n.__h && (n.__h = []);
			}), t = [], c.__e(r, n.__v);
		}
	}), l && l(n, t);
}, c.unmount = function(n) {
	m && m(n);
	var t, r = n.__c;
	r && r.__H && (r.__H.__.some(function(n) {
		try {
			z(n);
		} catch (n) {
			t = n;
		}
	}), r.__H = void 0, t && c.__e(t, r.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w(n) {
	var t, r = function() {
		clearTimeout(u), k && cancelAnimationFrame(t), setTimeout(n);
	}, u = setTimeout(r, 35);
	k && (t = requestAnimationFrame(r));
}
function z(n) {
	var t = r, u = n.__c;
	"function" == typeof u && (n.__c = void 0, u()), r = t;
}
function B(n) {
	var t = r;
	n.__c = n.__(), r = t;
}
function C(n, t) {
	return !n || n.length !== t.length || t.some(function(t, r) {
		return t !== n[r];
	});
}
function D(n, t) {
	return "function" == typeof t ? t(n) : t;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar-css.js
var Snackbar_css_default = (() => `.-cbwsdk-css-reset .-gear-container{margin-left:16px !important;margin-right:9px !important;display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:opacity .25s}.-cbwsdk-css-reset .-gear-container *{user-select:none}.-cbwsdk-css-reset .-gear-container svg{opacity:0;position:absolute}.-cbwsdk-css-reset .-gear-icon{height:12px;width:12px;z-index:10000}.-cbwsdk-css-reset .-cbwsdk-snackbar{align-items:flex-end;display:flex;flex-direction:column;position:fixed;right:0;top:0;z-index:2147483647}.-cbwsdk-css-reset .-cbwsdk-snackbar *{user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance{display:flex;flex-direction:column;margin:8px 16px 0 16px;overflow:visible;text-align:left;transform:translateX(0);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header:hover .-gear-container svg{opacity:1}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header{display:flex;align-items:center;background:#fff;overflow:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-cblogo{margin:8px 8px 8px 8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-message{color:#000;font-size:13px;line-height:1.5;user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu{background:#fff;transition:opacity .25s ease-in-out,transform .25s linear,visibility 0s;visibility:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;opacity:0;flex-direction:column;padding-left:8px;padding-right:8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:last-child{margin-bottom:8px !important}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover{background:#f5f7f8;border-radius:6px;transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover span{color:#050f19;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover svg path{fill:#000;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item{visibility:inherit;height:35px;margin-top:8px;margin-bottom:0;display:flex;flex-direction:row;align-items:center;padding:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item *{visibility:inherit;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover{background:rgba(223,95,103,.2);transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover svg path{fill:#df5f67;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover span{color:#df5f67;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-info{color:#aaa;font-size:13px;margin:0 8px 0 32px;position:absolute}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-hidden{opacity:0;text-align:left;transform:translateX(25%);transition:opacity .5s linear}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-expanded .-cbwsdk-snackbar-instance-menu{opacity:1;display:flex;transform:translateY(8px);visibility:visible}`)();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar.js
var cblogo = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuNDkyIDEwLjQxOWE4LjkzIDguOTMgMCAwMTguOTMtOC45M2gxMS4xNjNhOC45MyA4LjkzIDAgMDE4LjkzIDguOTN2MTEuMTYzYTguOTMgOC45MyAwIDAxLTguOTMgOC45M0gxMC40MjJhOC45MyA4LjkzIDAgMDEtOC45My04LjkzVjEwLjQxOXoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjQxOSAwSDIxLjU4QzI3LjMzNSAwIDMyIDQuNjY1IDMyIDEwLjQxOVYyMS41OEMzMiAyNy4zMzUgMjcuMzM1IDMyIDIxLjU4MSAzMkgxMC40MkM0LjY2NSAzMiAwIDI3LjMzNSAwIDIxLjU4MVYxMC40MkMwIDQuNjY1IDQuNjY1IDAgMTAuNDE5IDB6bTAgMS40ODhhOC45MyA4LjkzIDAgMDAtOC45MyA4LjkzdjExLjE2M2E4LjkzIDguOTMgMCAwMDguOTMgOC45M0gyMS41OGE4LjkzIDguOTMgMCAwMDguOTMtOC45M1YxMC40MmE4LjkzIDguOTMgMCAwMC04LjkzLTguOTNIMTAuNDJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45OTggMjYuMDQ5Yy01LjU0OSAwLTEwLjA0Ny00LjQ5OC0xMC4wNDctMTAuMDQ3IDAtNS41NDggNC40OTgtMTAuMDQ2IDEwLjA0Ny0xMC4wNDYgNS41NDggMCAxMC4wNDYgNC40OTggMTAuMDQ2IDEwLjA0NiAwIDUuNTQ5LTQuNDk4IDEwLjA0Ny0xMC4wNDYgMTAuMDQ3eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMi43NjIgMTQuMjU0YzAtLjgyMi42NjctMS40ODkgMS40ODktMS40ODloMy40OTdjLjgyMiAwIDEuNDg4LjY2NiAxLjQ4OCAxLjQ4OXYzLjQ5N2MwIC44MjItLjY2NiAxLjQ4OC0xLjQ4OCAxLjQ4OGgtMy40OTdhMS40ODggMS40ODggMCAwMS0xLjQ4OS0xLjQ4OHYtMy40OTh6IiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+`;
var gearIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDYuNzV2LTEuNWwtMS43Mi0uNTdjLS4wOC0uMjctLjE5LS41Mi0uMzItLjc3bC44MS0xLjYyLTEuMDYtMS4wNi0xLjYyLjgxYy0uMjQtLjEzLS41LS4yNC0uNzctLjMyTDYuNzUgMGgtMS41bC0uNTcgMS43MmMtLjI3LjA4LS41My4xOS0uNzcuMzJsLTEuNjItLjgxLTEuMDYgMS4wNi44MSAxLjYyYy0uMTMuMjQtLjI0LjUtLjMyLjc3TDAgNS4yNXYxLjVsMS43Mi41N2MuMDguMjcuMTkuNTMuMzIuNzdsLS44MSAxLjYyIDEuMDYgMS4wNiAxLjYyLS44MWMuMjQuMTMuNS4yMy43Ny4zMkw1LjI1IDEyaDEuNWwuNTctMS43MmMuMjctLjA4LjUyLS4xOS43Ny0uMzJsMS42Mi44MSAxLjA2LTEuMDYtLjgxLTEuNjJjLjEzLS4yNC4yMy0uNS4zMi0uNzdMMTIgNi43NXpNNiA4LjVhMi41IDIuNSAwIDAxMC01IDIuNSAyLjUgMCAwMTAgNXoiIGZpbGw9IiMwNTBGMTkiLz48L3N2Zz4=`;
var Snackbar = class {
	constructor() {
		this.items = /* @__PURE__ */ new Map();
		this.nextItemKey = 0;
		this.root = null;
		this.darkMode = isDarkMode();
	}
	attach(el) {
		this.root = document.createElement("div");
		this.root.className = "-cbwsdk-snackbar-root";
		el.appendChild(this.root);
		this.render();
	}
	presentItem(itemProps) {
		const key = this.nextItemKey++;
		this.items.set(key, itemProps);
		this.render();
		return () => {
			this.items.delete(key);
			this.render();
		};
	}
	clear() {
		this.items.clear();
		this.render();
	}
	render() {
		if (!this.root) return;
		R(k$1("div", null, k$1(SnackbarContainer, { darkMode: this.darkMode }, Array.from(this.items.entries()).map(([key, itemProps]) => k$1(SnackbarInstance, Object.assign({}, itemProps, { key }))))), this.root);
	}
};
var SnackbarContainer = (props) => k$1("div", { class: clsx("-cbwsdk-snackbar-container") }, k$1("style", null, Snackbar_css_default), k$1("div", { class: "-cbwsdk-snackbar" }, props.children));
var SnackbarInstance = ({ autoExpand, message, menuItems }) => {
	const [hidden, setHidden] = d(true);
	const [expanded, setExpanded] = d(autoExpand !== null && autoExpand !== void 0 ? autoExpand : false);
	h(() => {
		const timers = [window.setTimeout(() => {
			setHidden(false);
		}, 1), window.setTimeout(() => {
			setExpanded(true);
		}, 1e4)];
		return () => {
			timers.forEach(window.clearTimeout);
		};
	});
	const toggleExpanded = () => {
		setExpanded(!expanded);
	};
	return k$1("div", { class: clsx("-cbwsdk-snackbar-instance", hidden && "-cbwsdk-snackbar-instance-hidden", expanded && "-cbwsdk-snackbar-instance-expanded") }, k$1("div", {
		class: "-cbwsdk-snackbar-instance-header",
		onClick: toggleExpanded
	}, k$1("img", {
		src: cblogo,
		class: "-cbwsdk-snackbar-instance-header-cblogo"
	}), " ", k$1("div", { class: "-cbwsdk-snackbar-instance-header-message" }, message), k$1("div", { class: "-gear-container" }, !expanded && k$1("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	}, k$1("circle", {
		cx: "12",
		cy: "12",
		r: "12",
		fill: "#F5F7F8"
	})), k$1("img", {
		src: gearIcon,
		class: "-gear-icon",
		title: "Expand"
	}))), menuItems && menuItems.length > 0 && k$1("div", { class: "-cbwsdk-snackbar-instance-menu" }, menuItems.map((action, i) => k$1("div", {
		class: clsx("-cbwsdk-snackbar-instance-menu-item", action.isRed && "-cbwsdk-snackbar-instance-menu-item-is-red"),
		onClick: action.onClick,
		key: i
	}, k$1("svg", {
		width: action.svgWidth,
		height: action.svgHeight,
		viewBox: "0 0 10 11",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	}, k$1("path", {
		"fill-rule": action.defaultFillRule,
		"clip-rule": action.defaultClipRule,
		d: action.path,
		fill: "#AAAAAA"
	})), k$1("span", { class: clsx("-cbwsdk-snackbar-instance-menu-item-info", action.isRed && "-cbwsdk-snackbar-instance-menu-item-info-is-red") }, action.info)))));
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WalletLinkRelayUI.js
var WalletLinkRelayUI = class {
	constructor() {
		this.attached = false;
		this.snackbar = new Snackbar();
	}
	attach() {
		if (this.attached) throw new Error("Coinbase Wallet SDK UI is already attached");
		const el = document.documentElement;
		const container = document.createElement("div");
		container.className = "-cbwsdk-css-reset";
		el.appendChild(container);
		this.snackbar.attach(container);
		this.attached = true;
		injectCssReset();
	}
	showConnecting(options) {
		let snackbarProps;
		if (options.isUnlinkedErrorState) snackbarProps = {
			autoExpand: true,
			message: "Connection lost",
			menuItems: [{
				isRed: false,
				info: "Reset connection",
				svgWidth: "10",
				svgHeight: "11",
				path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: options.onResetConnection
			}]
		};
		else snackbarProps = {
			message: "Confirm on phone",
			menuItems: [{
				isRed: true,
				info: "Cancel transaction",
				svgWidth: "11",
				svgHeight: "11",
				path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
				defaultFillRule: "inherit",
				defaultClipRule: "inherit",
				onClick: options.onCancel
			}, {
				isRed: false,
				info: "Reset connection",
				svgWidth: "10",
				svgHeight: "11",
				path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
				defaultFillRule: "evenodd",
				defaultClipRule: "evenodd",
				onClick: options.onResetConnection
			}]
		};
		return this.snackbar.presentItem(snackbarProps);
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog-css.js
var RedirectDialog_css_default = (() => `.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;transition:opacity .25s;background-color:rgba(10,11,13,.5)}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-backdrop-hidden{opacity:0}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box{display:block;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:20px;border-radius:8px;background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box p{display:block;font-weight:400;font-size:14px;line-height:20px;padding-bottom:12px;color:#5b636e}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box button{appearance:none;border:none;background:none;color:#0052ff;padding:0;text-decoration:none;display:block;font-weight:600;font-size:16px;line-height:24px}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark{background-color:#0a0b0d;color:#fff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.dark button{color:#0052ff}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light{background-color:#fff;color:#0a0b0d}.-cbwsdk-css-reset .-cbwsdk-redirect-dialog-box.light button{color:#0052ff}`)();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/RedirectDialog/RedirectDialog.js
var RedirectDialog = class {
	constructor() {
		this.root = null;
		this.darkMode = isDarkMode();
	}
	attach() {
		const el = document.documentElement;
		this.root = document.createElement("div");
		this.root.className = "-cbwsdk-css-reset";
		el.appendChild(this.root);
		injectCssReset();
	}
	present(props) {
		this.render(props);
	}
	clear() {
		this.render(null);
	}
	render(props) {
		if (!this.root) return;
		R(null, this.root);
		if (!props) return;
		R(k$1(RedirectDialogContent, Object.assign({}, props, {
			onDismiss: () => {
				this.clear();
			},
			darkMode: this.darkMode
		})), this.root);
	}
};
var RedirectDialogContent = ({ title, buttonText, darkMode, onButtonClick, onDismiss }) => {
	const theme = darkMode ? "dark" : "light";
	return k$1(SnackbarContainer, { darkMode }, k$1("div", { class: "-cbwsdk-redirect-dialog" }, k$1("style", null, RedirectDialog_css_default), k$1("div", {
		class: "-cbwsdk-redirect-dialog-backdrop",
		onClick: onDismiss
	}), k$1("div", { class: clsx("-cbwsdk-redirect-dialog-box", theme) }, k$1("p", null, title), k$1("button", { onClick: onButtonClick }, buttonText))));
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/constants.js
var CB_KEYS_URL = "https://keys.coinbase.com/connect";
var CB_WALLET_RPC_URL = "http://rpc.wallet.coinbase.com";
var WALLETLINK_URL = "https://www.walletlink.org";
var CBW_MOBILE_DEEPLINK_URL = "https://go.cb-w.com/walletlink";
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/WLMobileRelayUI.js
var WLMobileRelayUI = class {
	constructor() {
		this.attached = false;
		this.redirectDialog = new RedirectDialog();
	}
	attach() {
		if (this.attached) throw new Error("Coinbase Wallet SDK UI is already attached");
		this.redirectDialog.attach();
		this.attached = true;
	}
	redirectToCoinbaseWallet(walletLinkUrl) {
		const url = new URL(CBW_MOBILE_DEEPLINK_URL);
		url.searchParams.append("redirect_url", getLocation().href);
		if (walletLinkUrl) url.searchParams.append("wl_url", walletLinkUrl);
		const anchorTag = document.createElement("a");
		anchorTag.target = "cbw-opener";
		anchorTag.href = url.href;
		anchorTag.rel = "noreferrer noopener";
		anchorTag.click();
	}
	openCoinbaseWalletDeeplink(walletLinkUrl) {
		this.redirectDialog.present({
			title: "Redirecting to Coinbase Wallet...",
			buttonText: "Open",
			onButtonClick: () => {
				this.redirectToCoinbaseWallet(walletLinkUrl);
			}
		});
		setTimeout(() => {
			this.redirectToCoinbaseWallet(walletLinkUrl);
		}, 99);
	}
	showConnecting(_options) {
		return () => {
			this.redirectDialog.clear();
		};
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/relay/WalletLinkRelay.js
var WalletLinkRelay = class WalletLinkRelay {
	constructor(options) {
		this.chainCallbackParams = {
			chainId: "",
			jsonRpcUrl: ""
		};
		this.isMobileWeb = isMobileWeb();
		this.linkedUpdated = (linked) => {
			this.isLinked = linked;
			const cachedAddresses = this.storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
			if (linked) this._session.linked = linked;
			this.isUnlinkedErrorState = false;
			if (cachedAddresses) {
				const addresses = cachedAddresses.split(" ");
				const wasConnectedViaStandalone = this.storage.getItem("IsStandaloneSigning") === "true";
				if (addresses[0] !== "" && !linked && this._session.linked && !wasConnectedViaStandalone) this.isUnlinkedErrorState = true;
			}
		};
		this.metadataUpdated = (key, value) => {
			this.storage.setItem(key, value);
		};
		this.chainUpdated = (chainId, jsonRpcUrl) => {
			if (this.chainCallbackParams.chainId === chainId && this.chainCallbackParams.jsonRpcUrl === jsonRpcUrl) return;
			this.chainCallbackParams = {
				chainId,
				jsonRpcUrl
			};
			if (this.chainCallback) this.chainCallback(jsonRpcUrl, Number.parseInt(chainId, 10));
		};
		this.accountUpdated = (selectedAddress) => {
			if (this.accountsCallback) this.accountsCallback([selectedAddress]);
			if (WalletLinkRelay.accountRequestCallbackIds.size > 0) {
				Array.from(WalletLinkRelay.accountRequestCallbackIds.values()).forEach((id) => {
					this.invokeCallback(id, {
						method: "requestEthereumAccounts",
						result: [selectedAddress]
					});
				});
				WalletLinkRelay.accountRequestCallbackIds.clear();
			}
		};
		this.resetAndReload = this.resetAndReload.bind(this);
		this.linkAPIUrl = options.linkAPIUrl;
		this.storage = options.storage;
		this.metadata = options.metadata;
		this.accountsCallback = options.accountsCallback;
		this.chainCallback = options.chainCallback;
		const { session, ui, connection } = this.subscribe();
		this._session = session;
		this.connection = connection;
		this.relayEventManager = new RelayEventManager();
		this.ui = ui;
		this.ui.attach();
	}
	subscribe() {
		const session = WalletLinkSession.load(this.storage) || WalletLinkSession.create(this.storage);
		const { linkAPIUrl } = this;
		const connection = new WalletLinkConnection({
			session,
			linkAPIUrl,
			listener: this
		});
		const ui = this.isMobileWeb ? new WLMobileRelayUI() : new WalletLinkRelayUI();
		connection.connect();
		return {
			session,
			ui,
			connection
		};
	}
	resetAndReload() {
		this.connection.destroy().then(() => {
			/**
			* Only clear storage if the session id we have in memory matches the one on disk
			* Otherwise, in the case where we have 2 tabs, another tab might have cleared
			* storage already.  In that case if we clear storage again, the user will be in
			* a state where the first tab allows the user to connect but the session that
			* was used isn't persisted.  This leaves the user in a state where they aren't
			* connected to the mobile app.
			*/
			const storedSession = WalletLinkSession.load(this.storage);
			if ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) === this._session.id) ScopedLocalStorage.clearAll();
			document.location.reload();
		}).catch((_) => {});
	}
	signEthereumTransaction(params) {
		return this.sendRequest({
			method: "signEthereumTransaction",
			params: {
				fromAddress: params.fromAddress,
				toAddress: params.toAddress,
				weiValue: bigIntStringFromBigInt(params.weiValue),
				data: hexStringFromBuffer(params.data, true),
				nonce: params.nonce,
				gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxPriorityFeePerGas: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
				chainId: params.chainId,
				shouldSubmit: false
			}
		});
	}
	signAndSubmitEthereumTransaction(params) {
		return this.sendRequest({
			method: "signEthereumTransaction",
			params: {
				fromAddress: params.fromAddress,
				toAddress: params.toAddress,
				weiValue: bigIntStringFromBigInt(params.weiValue),
				data: hexStringFromBuffer(params.data, true),
				nonce: params.nonce,
				gasPriceInWei: params.gasPriceInWei ? bigIntStringFromBigInt(params.gasPriceInWei) : null,
				maxFeePerGas: params.maxFeePerGas ? bigIntStringFromBigInt(params.maxFeePerGas) : null,
				maxPriorityFeePerGas: params.maxPriorityFeePerGas ? bigIntStringFromBigInt(params.maxPriorityFeePerGas) : null,
				gasLimit: params.gasLimit ? bigIntStringFromBigInt(params.gasLimit) : null,
				chainId: params.chainId,
				shouldSubmit: true
			}
		});
	}
	submitEthereumTransaction(signedTransaction, chainId) {
		return this.sendRequest({
			method: "submitEthereumTransaction",
			params: {
				signedTransaction: hexStringFromBuffer(signedTransaction, true),
				chainId
			}
		});
	}
	getWalletLinkSession() {
		return this._session;
	}
	sendRequest(request) {
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		return new Promise((resolve, reject) => {
			hideSnackbarItem = this.ui.showConnecting({
				isUnlinkedErrorState: this.isUnlinkedErrorState,
				onCancel: cancel,
				onResetConnection: this.resetAndReload
			});
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	publishWeb3RequestEvent(id, request) {
		const message = {
			type: "WEB3_REQUEST",
			id,
			request
		};
		this.publishEvent("Web3Request", message, true).then((_) => {}).catch((err) => {
			this.handleWeb3ResponseMessage(message.id, {
				method: request.method,
				errorMessage: err.message
			});
		});
		if (this.isMobileWeb) this.openCoinbaseWalletDeeplink(request.method);
	}
	openCoinbaseWalletDeeplink(method) {
		if (!(this.ui instanceof WLMobileRelayUI)) return;
		switch (method) {
			case "requestEthereumAccounts":
			case "switchEthereumChain": return;
			default:
				window.addEventListener("blur", () => {
					window.addEventListener("focus", () => {
						this.connection.checkUnseenEvents();
					}, { once: true });
				}, { once: true });
				this.ui.openCoinbaseWalletDeeplink();
		}
	}
	publishWeb3RequestCanceledEvent(id) {
		const message = {
			type: "WEB3_REQUEST_CANCELED",
			id
		};
		this.publishEvent("Web3RequestCanceled", message, false).then();
	}
	publishEvent(event, message, callWebhook) {
		return this.connection.publishEvent(event, message, callWebhook);
	}
	handleWeb3ResponseMessage(id, response) {
		if (response.method === "requestEthereumAccounts") {
			WalletLinkRelay.accountRequestCallbackIds.forEach((id) => this.invokeCallback(id, response));
			WalletLinkRelay.accountRequestCallbackIds.clear();
			return;
		}
		this.invokeCallback(id, response);
	}
	handleErrorResponse(id, method, error) {
		var _a;
		const errorMessage = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Unspecified error message.";
		this.handleWeb3ResponseMessage(id, {
			method,
			errorMessage
		});
	}
	invokeCallback(id, response) {
		const callback = this.relayEventManager.callbacks.get(id);
		if (callback) {
			callback(response);
			this.relayEventManager.callbacks.delete(id);
		}
	}
	requestEthereumAccounts() {
		const { appName, appLogoUrl } = this.metadata;
		const request = {
			method: "requestEthereumAccounts",
			params: {
				appName,
				appLogoUrl
			}
		};
		const id = randomBytesHex(8);
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			WalletLinkRelay.accountRequestCallbackIds.add(id);
			this.publishWeb3RequestEvent(id, request);
		});
	}
	watchAsset(type, address, symbol, decimals, image, chainId) {
		const request = {
			method: "watchAsset",
			params: {
				type,
				options: {
					address,
					symbol,
					decimals,
					image
				},
				chainId
			}
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	addEthereumChain(chainId, rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency) {
		const request = {
			method: "addEthereumChain",
			params: {
				chainId,
				rpcUrls,
				blockExplorerUrls,
				chainName,
				iconUrls,
				nativeCurrency
			}
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
	switchEthereumChain(chainId, address) {
		const request = {
			method: "switchEthereumChain",
			params: Object.assign({ chainId }, { address })
		};
		let hideSnackbarItem = null;
		const id = randomBytesHex(8);
		const cancel = (error) => {
			this.publishWeb3RequestCanceledEvent(id);
			this.handleErrorResponse(id, request.method, error);
			hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
		};
		hideSnackbarItem = this.ui.showConnecting({
			isUnlinkedErrorState: this.isUnlinkedErrorState,
			onCancel: cancel,
			onResetConnection: this.resetAndReload
		});
		return new Promise((resolve, reject) => {
			this.relayEventManager.callbacks.set(id, (response) => {
				hideSnackbarItem === null || hideSnackbarItem === void 0 || hideSnackbarItem();
				if (isErrorResponse(response) && response.errorCode) return reject(standardErrors.provider.custom({
					code: response.errorCode,
					message: `Unrecognized chain ID. Try adding the chain using addEthereumChain first.`
				}));
				else if (isErrorResponse(response)) return reject(new Error(response.errorMessage));
				resolve(response);
			});
			this.publishWeb3RequestEvent(id, request);
		});
	}
};
WalletLinkRelay.accountRequestCallbackIds = /* @__PURE__ */ new Set();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/walletlink/WalletLinkSigner.js
var DEFAULT_CHAIN_ID_KEY = "DefaultChainId";
var DEFAULT_JSON_RPC_URL = "DefaultJsonRpcUrl";
var WalletLinkSigner = class {
	constructor(options) {
		this._relay = null;
		this._addresses = [];
		this.metadata = options.metadata;
		this._storage = new ScopedLocalStorage("walletlink", WALLETLINK_URL);
		this.callback = options.callback || null;
		const cachedAddresses = this._storage.getItem(LOCAL_STORAGE_ADDRESSES_KEY);
		if (cachedAddresses) {
			const addresses = cachedAddresses.split(" ");
			if (addresses[0] !== "") this._addresses = addresses.map((address) => ensureAddressString(address));
		}
		this.initializeRelay();
	}
	getSession() {
		const { id, secret } = this.initializeRelay().getWalletLinkSession();
		return {
			id,
			secret
		};
	}
	async handshake() {
		await this._eth_requestAccounts();
	}
	get selectedAddress() {
		return this._addresses[0] || void 0;
	}
	get jsonRpcUrl() {
		var _a;
		return (_a = this._storage.getItem(DEFAULT_JSON_RPC_URL)) !== null && _a !== void 0 ? _a : void 0;
	}
	set jsonRpcUrl(value) {
		this._storage.setItem(DEFAULT_JSON_RPC_URL, value);
	}
	updateProviderInfo(jsonRpcUrl, chainId) {
		var _a;
		this.jsonRpcUrl = jsonRpcUrl;
		const originalChainId = this.getChainId();
		this._storage.setItem(DEFAULT_CHAIN_ID_KEY, chainId.toString(10));
		if (ensureIntNumber(chainId) !== originalChainId) (_a = this.callback) === null || _a === void 0 || _a.call(this, "chainChanged", hexStringFromNumber(chainId));
	}
	async watchAsset(params) {
		const request = Array.isArray(params) ? params[0] : params;
		if (!request.type) throw standardErrors.rpc.invalidParams("Type is required");
		if ((request === null || request === void 0 ? void 0 : request.type) !== "ERC20") throw standardErrors.rpc.invalidParams(`Asset of type '${request.type}' is not supported`);
		if (!(request === null || request === void 0 ? void 0 : request.options)) throw standardErrors.rpc.invalidParams("Options are required");
		if (!(request === null || request === void 0 ? void 0 : request.options.address)) throw standardErrors.rpc.invalidParams("Address is required");
		const chainId = this.getChainId();
		const { address, symbol, image, decimals } = request.options;
		const result = await this.initializeRelay().watchAsset(request.type, address, symbol, decimals, image, chainId === null || chainId === void 0 ? void 0 : chainId.toString());
		if (isErrorResponse(result)) return false;
		return !!result.result;
	}
	async addEthereumChain(params) {
		var _a, _b;
		const request = params[0];
		if (((_a = request.rpcUrls) === null || _a === void 0 ? void 0 : _a.length) === 0) throw standardErrors.rpc.invalidParams("please pass in at least 1 rpcUrl");
		if (!request.chainName || request.chainName.trim() === "") throw standardErrors.rpc.invalidParams("chainName is a required field");
		if (!request.nativeCurrency) throw standardErrors.rpc.invalidParams("nativeCurrency is a required field");
		const chainIdNumber = Number.parseInt(request.chainId, 16);
		if (chainIdNumber === this.getChainId()) return false;
		const relay = this.initializeRelay();
		const { rpcUrls = [], blockExplorerUrls = [], chainName, iconUrls = [], nativeCurrency } = request;
		const res = await relay.addEthereumChain(chainIdNumber.toString(), rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency);
		if (isErrorResponse(res)) return false;
		if (((_b = res.result) === null || _b === void 0 ? void 0 : _b.isApproved) === true) {
			this.updateProviderInfo(rpcUrls[0], chainIdNumber);
			return null;
		}
		throw standardErrors.rpc.internal("unable to add ethereum chain");
	}
	async switchEthereumChain(params) {
		const request = params[0];
		const chainId = Number.parseInt(request.chainId, 16);
		const res = await this.initializeRelay().switchEthereumChain(chainId.toString(10), this.selectedAddress || void 0);
		if (isErrorResponse(res)) throw res;
		const switchResponse = res.result;
		if (switchResponse.isApproved && switchResponse.rpcUrl.length > 0) this.updateProviderInfo(switchResponse.rpcUrl, chainId);
		return null;
	}
	async cleanup() {
		this.callback = null;
		if (this._relay) this._relay.resetAndReload();
		this._storage.clear();
	}
	_setAddresses(addresses, _) {
		var _a;
		if (!Array.isArray(addresses)) throw new Error("addresses is not an array");
		const newAddresses = addresses.map((address) => ensureAddressString(address));
		if (JSON.stringify(newAddresses) === JSON.stringify(this._addresses)) return;
		this._addresses = newAddresses;
		(_a = this.callback) === null || _a === void 0 || _a.call(this, "accountsChanged", newAddresses);
		this._storage.setItem(LOCAL_STORAGE_ADDRESSES_KEY, newAddresses.join(" "));
	}
	async request(request) {
		const params = request.params || [];
		switch (request.method) {
			case "eth_accounts": return [...this._addresses];
			case "eth_coinbase": return this.selectedAddress || null;
			case "net_version": return this.getChainId().toString(10);
			case "eth_chainId": return hexStringFromNumber(this.getChainId());
			case "eth_requestAccounts": return this._eth_requestAccounts();
			case "eth_ecRecover":
			case "personal_ecRecover": return this.ecRecover(request);
			case "personal_sign": return this.personalSign(request);
			case "eth_signTransaction": return this._eth_signTransaction(params);
			case "eth_sendRawTransaction": return this._eth_sendRawTransaction(params);
			case "eth_sendTransaction": return this._eth_sendTransaction(params);
			case "eth_signTypedData_v1":
			case "eth_signTypedData_v3":
			case "eth_signTypedData_v4":
			case "eth_signTypedData": return this.signTypedData(request);
			case "wallet_addEthereumChain": return this.addEthereumChain(params);
			case "wallet_switchEthereumChain": return this.switchEthereumChain(params);
			case "wallet_watchAsset": return this.watchAsset(params);
			default:
				if (!this.jsonRpcUrl) throw standardErrors.rpc.internal("No RPC URL set for chain");
				return fetchRPCRequest(request, this.jsonRpcUrl);
		}
	}
	_ensureKnownAddress(addressString) {
		const addressStr = ensureAddressString(addressString);
		if (!this._addresses.map((address) => ensureAddressString(address)).includes(addressStr)) throw new Error("Unknown Ethereum address");
	}
	_prepareTransactionParams(tx) {
		const fromAddress = tx.from ? ensureAddressString(tx.from) : this.selectedAddress;
		if (!fromAddress) throw new Error("Ethereum address is unavailable");
		this._ensureKnownAddress(fromAddress);
		return {
			fromAddress,
			toAddress: tx.to ? ensureAddressString(tx.to) : null,
			weiValue: tx.value != null ? ensureBigInt(tx.value) : BigInt(0),
			data: tx.data ? ensureBuffer(tx.data) : Buffer.alloc(0),
			nonce: tx.nonce != null ? ensureIntNumber(tx.nonce) : null,
			gasPriceInWei: tx.gasPrice != null ? ensureBigInt(tx.gasPrice) : null,
			maxFeePerGas: tx.maxFeePerGas != null ? ensureBigInt(tx.maxFeePerGas) : null,
			maxPriorityFeePerGas: tx.maxPriorityFeePerGas != null ? ensureBigInt(tx.maxPriorityFeePerGas) : null,
			gasLimit: tx.gas != null ? ensureBigInt(tx.gas) : null,
			chainId: tx.chainId ? ensureIntNumber(tx.chainId) : this.getChainId()
		};
	}
	async ecRecover(request) {
		const { method, params } = request;
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const res = await this.initializeRelay().sendRequest({
			method: "ethereumAddressFromSignedMessage",
			params: {
				message: encodeToHexString(params[0]),
				signature: encodeToHexString(params[1]),
				addPrefix: method === "personal_ecRecover"
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	getChainId() {
		var _a;
		return Number.parseInt((_a = this._storage.getItem(DEFAULT_CHAIN_ID_KEY)) !== null && _a !== void 0 ? _a : "1", 10);
	}
	async _eth_requestAccounts() {
		var _a, _b;
		if (this._addresses.length > 0) {
			(_a = this.callback) === null || _a === void 0 || _a.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
			return this._addresses;
		}
		const res = await this.initializeRelay().requestEthereumAccounts();
		if (isErrorResponse(res)) throw res;
		if (!res.result) throw new Error("accounts received is empty");
		this._setAddresses(res.result);
		(_b = this.callback) === null || _b === void 0 || _b.call(this, "connect", { chainId: hexStringFromNumber(this.getChainId()) });
		return this._addresses;
	}
	async personalSign({ params }) {
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const address = params[1];
		const rawData = params[0];
		this._ensureKnownAddress(address);
		const res = await this.initializeRelay().sendRequest({
			method: "signEthereumMessage",
			params: {
				address: ensureAddressString(address),
				message: encodeToHexString(rawData),
				addPrefix: true,
				typedDataJson: null
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_signTransaction(params) {
		const tx = this._prepareTransactionParams(params[0] || {});
		const res = await this.initializeRelay().signEthereumTransaction(tx);
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_sendRawTransaction(params) {
		const signedTransaction = ensureBuffer(params[0]);
		const res = await this.initializeRelay().submitEthereumTransaction(signedTransaction, this.getChainId());
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async _eth_sendTransaction(params) {
		const tx = this._prepareTransactionParams(params[0] || {});
		const res = await this.initializeRelay().signAndSubmitEthereumTransaction(tx);
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	async signTypedData(request) {
		const { method, params } = request;
		if (!Array.isArray(params)) throw standardErrors.rpc.invalidParams();
		const encode = (input) => {
			return hexStringFromBuffer({
				eth_signTypedData_v1: import_eth_eip712_util.default.hashForSignTypedDataLegacy,
				eth_signTypedData_v3: import_eth_eip712_util.default.hashForSignTypedData_v3,
				eth_signTypedData_v4: import_eth_eip712_util.default.hashForSignTypedData_v4,
				eth_signTypedData: import_eth_eip712_util.default.hashForSignTypedData_v4
			}[method]({ data: ensureParsedJSONObject(input) }), true);
		};
		const address = params[method === "eth_signTypedData_v1" ? 1 : 0];
		const rawData = params[method === "eth_signTypedData_v1" ? 0 : 1];
		this._ensureKnownAddress(address);
		const res = await this.initializeRelay().sendRequest({
			method: "signEthereumMessage",
			params: {
				address: ensureAddressString(address),
				message: encode(rawData),
				typedDataJson: JSON.stringify(rawData, null, 2),
				addPrefix: false
			}
		});
		if (isErrorResponse(res)) throw res;
		return res.result;
	}
	initializeRelay() {
		if (!this._relay) this._relay = new WalletLinkRelay({
			linkAPIUrl: WALLETLINK_URL,
			storage: this._storage,
			metadata: this.metadata,
			accountsCallback: this._setAddresses.bind(this),
			chainCallback: this.updateProviderInfo.bind(this)
		});
		return this._relay;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/sign/util.js
var SIGNER_TYPE_KEY = "SignerType";
var storage = new ScopedLocalStorage("CBWSDK", "SignerConfigurator");
function loadSignerType() {
	return storage.getItem(SIGNER_TYPE_KEY);
}
function storeSignerType(signerType) {
	storage.setItem(SIGNER_TYPE_KEY, signerType);
}
async function fetchSignerType(params) {
	const { communicator, metadata, handshakeRequest, callback } = params;
	listenForWalletLinkSessionRequest(communicator, metadata, callback).catch(() => {});
	const request = {
		id: crypto.randomUUID(),
		event: "selectSignerType",
		data: Object.assign(Object.assign({}, params.preference), { handshakeRequest })
	};
	const { data } = await communicator.postRequestAndWaitForResponse(request);
	return data;
}
function createSigner(params) {
	const { signerType, metadata, communicator, callback } = params;
	switch (signerType) {
		case "scw": return new SCWSigner({
			metadata,
			callback,
			communicator
		});
		case "walletlink": return new WalletLinkSigner({
			metadata,
			callback
		});
	}
}
async function listenForWalletLinkSessionRequest(communicator, metadata, callback) {
	await communicator.onMessage(({ event }) => event === "WalletLinkSessionRequest");
	const walletlink = new WalletLinkSigner({
		metadata,
		callback
	});
	communicator.postMessage({
		event: "WalletLinkUpdate",
		data: { session: walletlink.getSession() }
	});
	await walletlink.handshake();
	communicator.postMessage({
		event: "WalletLinkUpdate",
		data: { connected: true }
	});
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/checkCrossOriginOpenerPolicy.js
var COOP_ERROR_MESSAGE = `Coinbase Wallet SDK requires the Cross-Origin-Opener-Policy header to not be set to 'same-origin'. This is to ensure that the SDK can communicate with the Coinbase Smart Wallet app.

Please see https://www.smartwallet.dev/guides/tips/popup-tips#cross-origin-opener-policy for more information.`;
/**
* Creates a checker for the Cross-Origin-Opener-Policy (COOP).
*
* @returns An object with methods to get and check the Cross-Origin-Opener-Policy.
*
* @method getCrossOriginOpenerPolicy
* Retrieves current Cross-Origin-Opener-Policy.
* @throws Will throw an error if the policy has not been checked yet.
*
* @method checkCrossOriginOpenerPolicy
* Checks the Cross-Origin-Opener-Policy of the current environment.
* If in a non-browser environment, sets the policy to 'non-browser-env'.
* If in a browser environment, fetches the policy from the current origin.
* Logs an error if the policy is 'same-origin'.
*/
var createCoopChecker = () => {
	let crossOriginOpenerPolicy;
	return {
		getCrossOriginOpenerPolicy: () => {
			if (crossOriginOpenerPolicy === void 0) return "undefined";
			return crossOriginOpenerPolicy;
		},
		checkCrossOriginOpenerPolicy: async () => {
			if (typeof window === "undefined") {
				crossOriginOpenerPolicy = "non-browser-env";
				return;
			}
			try {
				const url = `${window.location.origin}${window.location.pathname}`;
				const response = await fetch(url, { method: "HEAD" });
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const result = response.headers.get("Cross-Origin-Opener-Policy");
				crossOriginOpenerPolicy = result !== null && result !== void 0 ? result : "null";
				if (crossOriginOpenerPolicy === "same-origin") console.error(COOP_ERROR_MESSAGE);
			} catch (error) {
				console.error("Error checking Cross-Origin-Opener-Policy:", error.message);
				crossOriginOpenerPolicy = "error";
			}
		}
	};
};
var { checkCrossOriginOpenerPolicy, getCrossOriginOpenerPolicy } = createCoopChecker();
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/web.js
var POPUP_WIDTH = 420;
var POPUP_HEIGHT = 540;
function openPopup(url) {
	const left = (window.innerWidth - POPUP_WIDTH) / 2 + window.screenX;
	const top = (window.innerHeight - POPUP_HEIGHT) / 2 + window.screenY;
	appendAppInfoQueryParams(url);
	const popupId = `wallet_${crypto.randomUUID()}`;
	const popup = window.open(url, popupId, `width=${POPUP_WIDTH}, height=${POPUP_HEIGHT}, left=${left}, top=${top}`);
	popup === null || popup === void 0 || popup.focus();
	if (!popup) throw standardErrors.rpc.internal("Pop up window failed to open");
	return popup;
}
function closePopup(popup) {
	if (popup && !popup.closed) popup.close();
}
function appendAppInfoQueryParams(url) {
	const params = {
		sdkName: NAME,
		sdkVersion: VERSION,
		origin: window.location.origin,
		coop: getCrossOriginOpenerPolicy()
	};
	for (const [key, value] of Object.entries(params)) url.searchParams.append(key, value.toString());
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/communicator/Communicator.js
/**
* Communicates with a popup window for Coinbase keys.coinbase.com (or another url)
* to send and receive messages.
*
* This class is responsible for opening a popup window, posting messages to it,
* and listening for responses.
*
* It also handles cleanup of event listeners and the popup window itself when necessary.
*/
var Communicator = class {
	constructor({ url = CB_KEYS_URL, metadata, preference }) {
		this.popup = null;
		this.listeners = /* @__PURE__ */ new Map();
		/**
		* Posts a message to the popup window
		*/
		this.postMessage = async (message) => {
			(await this.waitForPopupLoaded()).postMessage(message, this.url.origin);
		};
		/**
		* Posts a request to the popup window and waits for a response
		*/
		this.postRequestAndWaitForResponse = async (request) => {
			const responsePromise = this.onMessage(({ requestId }) => requestId === request.id);
			this.postMessage(request);
			return await responsePromise;
		};
		/**
		* Listens for messages from the popup window that match a given predicate.
		*/
		this.onMessage = async (predicate) => {
			return new Promise((resolve, reject) => {
				const listener = (event) => {
					if (event.origin !== this.url.origin) return;
					const message = event.data;
					if (predicate(message)) {
						resolve(message);
						window.removeEventListener("message", listener);
						this.listeners.delete(listener);
					}
				};
				window.addEventListener("message", listener);
				this.listeners.set(listener, { reject });
			});
		};
		/**
		* Closes the popup, rejects all requests and clears the listeners
		*/
		this.disconnect = () => {
			closePopup(this.popup);
			this.popup = null;
			this.listeners.forEach(({ reject }, listener) => {
				reject(standardErrors.provider.userRejectedRequest("Request rejected"));
				window.removeEventListener("message", listener);
			});
			this.listeners.clear();
		};
		/**
		* Waits for the popup window to fully load and then sends a version message.
		*/
		this.waitForPopupLoaded = async () => {
			if (this.popup && !this.popup.closed) {
				this.popup.focus();
				return this.popup;
			}
			this.popup = openPopup(this.url);
			this.onMessage(({ event }) => event === "PopupUnload").then(this.disconnect).catch(() => {});
			return this.onMessage(({ event }) => event === "PopupLoaded").then((message) => {
				this.postMessage({
					requestId: message.id,
					data: {
						version: VERSION,
						metadata: this.metadata,
						preference: this.preference,
						location: window.location.toString()
					}
				});
			}).then(() => {
				if (!this.popup) throw standardErrors.rpc.internal();
				return this.popup;
			});
		};
		this.url = new URL(url);
		this.metadata = metadata;
		this.preference = preference;
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/error/serialize.js
/**
* Serializes an error to a format that is compatible with the Ethereum JSON RPC error format.
* See https://docs.cloud.coinbase.com/wallet-sdk/docs/errors
* for more information.
*/
function serializeError(error) {
	const serialized = serialize(getErrorObject(error), { shouldIncludeStack: true });
	const docUrl = new URL("https://docs.cloud.coinbase.com/wallet-sdk/docs/errors");
	docUrl.searchParams.set("version", VERSION);
	docUrl.searchParams.set("code", serialized.code.toString());
	docUrl.searchParams.set("message", serialized.message);
	return Object.assign(Object.assign({}, serialized), { docUrl: docUrl.href });
}
/**
* Converts an error to a serializable object.
*/
function getErrorObject(error) {
	var _a;
	if (typeof error === "string") return {
		message: error,
		code: standardErrorCodes.rpc.internal
	};
	else if (isErrorResponse(error)) {
		const message = error.errorMessage;
		const code = (_a = error.errorCode) !== null && _a !== void 0 ? _a : message.match(/(denied|rejected)/i) ? standardErrorCodes.provider.userRejectedRequest : void 0;
		return Object.assign(Object.assign({}, error), {
			message,
			code,
			data: { method: error.method }
		});
	}
	return error;
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty;
	var prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
})))(), 1);
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/core/provider/interface.js
var ProviderEventEmitter = class extends import_eventemitter3.default {};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/CoinbaseWalletProvider.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var CoinbaseWalletProvider = class extends ProviderEventEmitter {
	constructor(_a) {
		var { metadata } = _a, _b = _a.preference, { keysUrl } = _b, preference = __rest(_b, ["keysUrl"]);
		super();
		this.signer = null;
		this.isCoinbaseWallet = true;
		this.metadata = metadata;
		this.preference = preference;
		this.communicator = new Communicator({
			url: keysUrl,
			metadata,
			preference
		});
		const signerType = loadSignerType();
		if (signerType) this.signer = this.initSigner(signerType);
	}
	async request(args) {
		try {
			checkErrorForInvalidRequestArgs(args);
			if (!this.signer) switch (args.method) {
				case "eth_requestAccounts": {
					const signerType = await this.requestSignerSelection(args);
					const signer = this.initSigner(signerType);
					await signer.handshake(args);
					this.signer = signer;
					storeSignerType(signerType);
					break;
				}
				case "wallet_sendCalls": {
					const ephemeralSigner = this.initSigner("scw");
					await ephemeralSigner.handshake({ method: "handshake" });
					const result = await ephemeralSigner.request(args);
					await ephemeralSigner.cleanup();
					return result;
				}
				case "wallet_getCallsStatus": return fetchRPCRequest(args, CB_WALLET_RPC_URL);
				case "net_version": return 1;
				case "eth_chainId": return hexStringFromNumber(1);
				default: throw standardErrors.provider.unauthorized("Must call 'eth_requestAccounts' before other methods");
			}
			return await this.signer.request(args);
		} catch (error) {
			const { code } = error;
			if (code === standardErrorCodes.provider.unauthorized) this.disconnect();
			return Promise.reject(serializeError(error));
		}
	}
	/** @deprecated Use `.request({ method: 'eth_requestAccounts' })` instead. */
	async enable() {
		console.warn(`.enable() has been deprecated. Please use .request({ method: "eth_requestAccounts" }) instead.`);
		return await this.request({ method: "eth_requestAccounts" });
	}
	async disconnect() {
		var _a;
		await ((_a = this.signer) === null || _a === void 0 ? void 0 : _a.cleanup());
		this.signer = null;
		ScopedLocalStorage.clearAll();
		this.emit("disconnect", standardErrors.provider.disconnected("User initiated disconnection"));
	}
	requestSignerSelection(handshakeRequest) {
		return fetchSignerType({
			communicator: this.communicator,
			preference: this.preference,
			metadata: this.metadata,
			handshakeRequest,
			callback: this.emit.bind(this)
		});
	}
	initSigner(signerType) {
		return createSigner({
			signerType,
			metadata: this.metadata,
			communicator: this.communicator,
			callback: this.emit.bind(this)
		});
	}
};
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/util/validatePreferences.js
/**
* Validates user supplied preferences. Throws if keys are not valid.
* @param preference
*/
function validatePreferences(preference) {
	if (!preference) return;
	if (![
		"all",
		"smartWalletOnly",
		"eoaOnly"
	].includes(preference.options)) throw new Error(`Invalid options: ${preference.options}`);
	if (preference.attribution) {
		if (preference.attribution.auto !== void 0 && preference.attribution.dataSuffix !== void 0) throw new Error(`Attribution cannot contain both auto and dataSuffix properties`);
	}
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletProvider.js
function createCoinbaseWalletProvider(options) {
	var _a;
	const params = {
		metadata: options.metadata,
		preference: options.preference
	};
	return (_a = getCoinbaseInjectedProvider(params)) !== null && _a !== void 0 ? _a : new CoinbaseWalletProvider(params);
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/createCoinbaseWalletSDK.js
var DEFAULT_PREFERENCE = { options: "all" };
/**
* Create a Coinbase Wallet SDK instance.
* @param params - Options to create a Coinbase Wallet SDK instance.
* @returns A Coinbase Wallet SDK object.
*/
function createCoinbaseWalletSDK(params) {
	var _a;
	new ScopedLocalStorage("CBWSDK").setItem("VERSION", VERSION);
	checkCrossOriginOpenerPolicy();
	const options = {
		metadata: {
			appName: params.appName || "Dapp",
			appLogoUrl: params.appLogoUrl || "",
			appChainIds: params.appChainIds || []
		},
		preference: Object.assign(DEFAULT_PREFERENCE, (_a = params.preference) !== null && _a !== void 0 ? _a : {})
	};
	/**
	* Validate user supplied preferences. Throws if key/values are not valid.
	*/
	validatePreferences(options.preference);
	let provider = null;
	return { getProvider: () => {
		if (!provider) provider = createCoinbaseWalletProvider(options);
		return provider;
	} };
}
//#endregion
//#region node_modules/@coinbase/wallet-sdk/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ createCoinbaseWalletSDK: () => createCoinbaseWalletSDK });
//#endregion
export { dist_exports as t };
