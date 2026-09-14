import { o as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { $ as hexToNumber, A as HttpRequestError, B as InvalidAddressError$1, C as ResourceUnavailableRpcError, D as UnknownRpcError, E as UnauthorizedProviderError, F as stringify$1, G as boolToHex, H as hexToBytes, I as isAddress, J as stringToHex, K as bytesToHex, L as checksumAddress, N as getContractAddress, O as UnsupportedProviderMethodError, Q as hexToBool, R as getAddress, S as ResourceNotFoundRpcError, T as TransactionRejectedRpcError, U as stringToBytes, V as keccak256$1, W as toBytes, X as assertSize$2, Y as toHex, Z as hexToBigInt, _ as LimitExceededRpcError, a as ConnectorAlreadyConnectedError, at as SliceOffsetOutOfBoundsError$2, b as ParseRpcError, c as ConnectorUnavailableReconnectingError, ct as isHex, d as ChainDisconnectedError, et as trim, f as InternalRpcError, g as JsonRpcVersionUnsupportedError, h as InvalidRequestRpcError, i as ConnectorAccountNotFoundError, it as InvalidBytesLengthError, j as RpcRequestError, k as UserRejectedRequestError, l as BaseError$4, m as InvalidParamsRpcError, n as createConnector, nt as InvalidBytesBooleanError$1, o as ConnectorChainMismatchError, ot as BaseError$3, p as InvalidInputRpcError, q as numberToHex, r as ChainNotConfiguredError, rt as padHex, s as ConnectorNotConnectedError, st as size$4, tt as IntegerOutOfRangeError$1, u as version$3, v as MethodNotFoundRpcError, w as SwitchChainError, x as ProviderDisconnectedError, y as MethodNotSupportedRpcError, z as LruMap$1 } from "./connectors+[...].mjs";
import { n as sha256$1, t as keccak_256 } from "../noble__hashes.mjs";
import { n as secp256k1, t as init_secp256k1 } from "../noble__curves+noble__hashes.mjs";
//#region node_modules/viem/node_modules/abitype/dist/esm/version.js
var version$2 = "1.0.8";
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/errors.js
var BaseError$2 = class BaseError$2 extends Error {
	constructor(shortMessage, args = {}) {
		const details = args.cause instanceof BaseError$2 ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
		const docsPath = args.cause instanceof BaseError$2 ? args.cause.docsPath || args.docsPath : args.docsPath;
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
			...details ? [`Details: ${details}`] : [],
			`Version: abitype@${version$2}`
		].join("\n");
		super(message);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiTypeError"
		});
		if (args.cause) this.cause = args.cause;
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.shortMessage = shortMessage;
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/regex.js
function execTyped$1(regex, string) {
	return regex.exec(string)?.groups;
}
var bytesRegex$3 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex$3 = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var isTupleRegex$1 = /^\(.+?\).*?$/;
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
var tupleRegex$1 = /^tuple(?<array>(\[(\d*)\])*)$/;
/**
* Formats {@link AbiParameter} to human-readable ABI parameter.
*
* @param abiParameter - ABI parameter
* @returns Human-readable ABI parameter
*
* @example
* const result = formatAbiParameter({ type: 'address', name: 'from' })
* //    ^? const result: 'address from'
*/
function formatAbiParameter$1(abiParameter) {
	let type = abiParameter.type;
	if (tupleRegex$1.test(abiParameter.type) && "components" in abiParameter) {
		type = "(";
		const length = abiParameter.components.length;
		for (let i = 0; i < length; i++) {
			const component = abiParameter.components[i];
			type += formatAbiParameter$1(component);
			if (i < length - 1) type += ", ";
		}
		const result = execTyped$1(tupleRegex$1, abiParameter.type);
		type += `)${result?.array ?? ""}`;
		return formatAbiParameter$1({
			...abiParameter,
			type
		});
	}
	if ("indexed" in abiParameter && abiParameter.indexed) type = `${type} indexed`;
	if (abiParameter.name) return `${type} ${abiParameter.name}`;
	return type;
}
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
/**
* Formats {@link AbiParameter}s to human-readable ABI parameters.
*
* @param abiParameters - ABI parameters
* @returns Human-readable ABI parameters
*
* @example
* const result = formatAbiParameters([
*   //  ^? const result: 'address from, uint256 tokenId'
*   { type: 'address', name: 'from' },
*   { type: 'uint256', name: 'tokenId' },
* ])
*/
function formatAbiParameters$1(abiParameters) {
	let params = "";
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		params += formatAbiParameter$1(abiParameter);
		if (i !== length - 1) params += ", ";
	}
	return params;
}
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
/**
* Formats ABI item (e.g. error, event, function) into human-readable ABI item
*
* @param abiItem - ABI item
* @returns Human-readable ABI item
*/
function formatAbiItem$2(abiItem) {
	if (abiItem.type === "function") return `function ${abiItem.name}(${formatAbiParameters$1(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters$1(abiItem.outputs)})` : ""}`;
	if (abiItem.type === "event") return `event ${abiItem.name}(${formatAbiParameters$1(abiItem.inputs)})`;
	if (abiItem.type === "error") return `error ${abiItem.name}(${formatAbiParameters$1(abiItem.inputs)})`;
	if (abiItem.type === "constructor") return `constructor(${formatAbiParameters$1(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	if (abiItem.type === "fallback") return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	return "receive() external payable";
}
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
var errorSignatureRegex$1 = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isErrorSignature$1(signature) {
	return errorSignatureRegex$1.test(signature);
}
function execErrorSignature$1(signature) {
	return execTyped$1(errorSignatureRegex$1, signature);
}
var eventSignatureRegex$1 = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isEventSignature$1(signature) {
	return eventSignatureRegex$1.test(signature);
}
function execEventSignature$1(signature) {
	return execTyped$1(eventSignatureRegex$1, signature);
}
var functionSignatureRegex$1 = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function isFunctionSignature$1(signature) {
	return functionSignatureRegex$1.test(signature);
}
function execFunctionSignature$1(signature) {
	return execTyped$1(functionSignatureRegex$1, signature);
}
var structSignatureRegex$1 = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function isStructSignature$1(signature) {
	return structSignatureRegex$1.test(signature);
}
function execStructSignature$1(signature) {
	return execTyped$1(structSignatureRegex$1, signature);
}
var constructorSignatureRegex$1 = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function isConstructorSignature$1(signature) {
	return constructorSignatureRegex$1.test(signature);
}
function execConstructorSignature$1(signature) {
	return execTyped$1(constructorSignatureRegex$1, signature);
}
var fallbackSignatureRegex$1 = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function isFallbackSignature$1(signature) {
	return fallbackSignatureRegex$1.test(signature);
}
function execFallbackSignature$1(signature) {
	return execTyped$1(fallbackSignatureRegex$1, signature);
}
var receiveSignatureRegex$1 = /^receive\(\) external payable$/;
function isReceiveSignature$1(signature) {
	return receiveSignatureRegex$1.test(signature);
}
var eventModifiers$1 = /* @__PURE__ */ new Set(["indexed"]);
var functionModifiers$1 = /* @__PURE__ */ new Set([
	"calldata",
	"memory",
	"storage"
]);
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError$1 = class extends BaseError$2 {
	constructor({ type }) {
		super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownTypeError"
		});
	}
};
var UnknownSolidityTypeError$1 = class extends BaseError$2 {
	constructor({ type }) {
		super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownSolidityTypeError"
		});
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError$1 = class extends BaseError$2 {
	constructor({ param }) {
		super("Invalid ABI parameter.", { details: param });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidParameterError"
		});
	}
};
var SolidityProtectedKeywordError$1 = class extends BaseError$2 {
	constructor({ param, name }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "SolidityProtectedKeywordError"
		});
	}
};
var InvalidModifierError$1 = class extends BaseError$2 {
	constructor({ param, type, modifier }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidModifierError"
		});
	}
};
var InvalidFunctionModifierError$1 = class extends BaseError$2 {
	constructor({ param, type, modifier }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`, `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidFunctionModifierError"
		});
	}
};
var InvalidAbiTypeParameterError$1 = class extends BaseError$2 {
	constructor({ abiParameter }) {
		super("Invalid ABI parameter.", {
			details: JSON.stringify(abiParameter, null, 2),
			metaMessages: ["ABI parameter type is invalid."]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidAbiTypeParameterError"
		});
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError$1 = class extends BaseError$2 {
	constructor({ signature, type }) {
		super(`Invalid ${type} signature.`, { details: signature });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidSignatureError"
		});
	}
};
var UnknownSignatureError$1 = class extends BaseError$2 {
	constructor({ signature }) {
		super("Unknown signature.", { details: signature });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownSignatureError"
		});
	}
};
var InvalidStructSignatureError$1 = class extends BaseError$2 {
	constructor({ signature }) {
		super("Invalid struct signature.", {
			details: signature,
			metaMessages: ["No properties exist."]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidStructSignatureError"
		});
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError$1 = class extends BaseError$2 {
	constructor({ type }) {
		super("Circular reference detected.", { metaMessages: [`Struct "${type}" is a circular reference.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "CircularReferenceError"
		});
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError$1 = class extends BaseError$2 {
	constructor({ current, depth }) {
		super("Unbalanced parentheses.", {
			metaMessages: [`"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`],
			details: `Depth "${depth}"`
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidParenthesisError"
		});
	}
};
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/runtime/cache.js
/**
* Gets {@link parameterCache} cache key namespaced by {@link type}. This prevents parameters from being accessible to types that don't allow them (e.g. `string indexed foo` not allowed outside of `type: 'event'`).
* @param param ABI parameter string
* @param type ABI parameter type
* @returns Cache key for {@link parameterCache}
*/
function getParameterCacheKey$1(param, type, structs) {
	let structKey = "";
	if (structs) for (const struct of Object.entries(structs)) {
		if (!struct) continue;
		let propertyKey = "";
		for (const property of struct[1]) propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
		structKey += `(${struct[0]}{${propertyKey}})`;
	}
	if (type) return `${type}:${param}${structKey}`;
	return param;
}
/**
* Basic cache seeded with common ABI parameter strings.
*
* **Note: When seeding more parameters, make sure you benchmark performance. The current number is the ideal balance between performance and having an already existing cache.**
*/
var parameterCache$1 = /* @__PURE__ */ new Map([
	["address", { type: "address" }],
	["bool", { type: "bool" }],
	["bytes", { type: "bytes" }],
	["bytes32", { type: "bytes32" }],
	["int", { type: "int256" }],
	["int256", { type: "int256" }],
	["string", { type: "string" }],
	["uint", { type: "uint256" }],
	["uint8", { type: "uint8" }],
	["uint16", { type: "uint16" }],
	["uint24", { type: "uint24" }],
	["uint32", { type: "uint32" }],
	["uint64", { type: "uint64" }],
	["uint96", { type: "uint96" }],
	["uint112", { type: "uint112" }],
	["uint160", { type: "uint160" }],
	["uint192", { type: "uint192" }],
	["uint256", { type: "uint256" }],
	["address owner", {
		type: "address",
		name: "owner"
	}],
	["address to", {
		type: "address",
		name: "to"
	}],
	["bool approved", {
		type: "bool",
		name: "approved"
	}],
	["bytes _data", {
		type: "bytes",
		name: "_data"
	}],
	["bytes data", {
		type: "bytes",
		name: "data"
	}],
	["bytes signature", {
		type: "bytes",
		name: "signature"
	}],
	["bytes32 hash", {
		type: "bytes32",
		name: "hash"
	}],
	["bytes32 r", {
		type: "bytes32",
		name: "r"
	}],
	["bytes32 root", {
		type: "bytes32",
		name: "root"
	}],
	["bytes32 s", {
		type: "bytes32",
		name: "s"
	}],
	["string name", {
		type: "string",
		name: "name"
	}],
	["string symbol", {
		type: "string",
		name: "symbol"
	}],
	["string tokenURI", {
		type: "string",
		name: "tokenURI"
	}],
	["uint tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint8 v", {
		type: "uint8",
		name: "v"
	}],
	["uint256 balance", {
		type: "uint256",
		name: "balance"
	}],
	["uint256 tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint256 value", {
		type: "uint256",
		name: "value"
	}],
	["event:address indexed from", {
		type: "address",
		name: "from",
		indexed: true
	}],
	["event:address indexed to", {
		type: "address",
		name: "to",
		indexed: true
	}],
	["event:uint indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: true
	}],
	["event:uint256 indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: true
	}]
]);
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature$1(signature, structs = {}) {
	if (isFunctionSignature$1(signature)) return parseFunctionSignature$1(signature, structs);
	if (isEventSignature$1(signature)) return parseEventSignature$1(signature, structs);
	if (isErrorSignature$1(signature)) return parseErrorSignature$1(signature, structs);
	if (isConstructorSignature$1(signature)) return parseConstructorSignature$1(signature, structs);
	if (isFallbackSignature$1(signature)) return parseFallbackSignature$1(signature);
	if (isReceiveSignature$1(signature)) return {
		type: "receive",
		stateMutability: "payable"
	};
	throw new UnknownSignatureError$1({ signature });
}
function parseFunctionSignature$1(signature, structs = {}) {
	const match = execFunctionSignature$1(signature);
	if (!match) throw new InvalidSignatureError$1({
		signature,
		type: "function"
	});
	const inputParams = splitParameters$1(match.parameters);
	const inputs = [];
	const inputLength = inputParams.length;
	for (let i = 0; i < inputLength; i++) inputs.push(parseAbiParameter$1(inputParams[i], {
		modifiers: functionModifiers$1,
		structs,
		type: "function"
	}));
	const outputs = [];
	if (match.returns) {
		const outputParams = splitParameters$1(match.returns);
		const outputLength = outputParams.length;
		for (let i = 0; i < outputLength; i++) outputs.push(parseAbiParameter$1(outputParams[i], {
			modifiers: functionModifiers$1,
			structs,
			type: "function"
		}));
	}
	return {
		name: match.name,
		type: "function",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs,
		outputs
	};
}
function parseEventSignature$1(signature, structs = {}) {
	const match = execEventSignature$1(signature);
	if (!match) throw new InvalidSignatureError$1({
		signature,
		type: "event"
	});
	const params = splitParameters$1(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter$1(params[i], {
		modifiers: eventModifiers$1,
		structs,
		type: "event"
	}));
	return {
		name: match.name,
		type: "event",
		inputs: abiParameters
	};
}
function parseErrorSignature$1(signature, structs = {}) {
	const match = execErrorSignature$1(signature);
	if (!match) throw new InvalidSignatureError$1({
		signature,
		type: "error"
	});
	const params = splitParameters$1(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter$1(params[i], {
		structs,
		type: "error"
	}));
	return {
		name: match.name,
		type: "error",
		inputs: abiParameters
	};
}
function parseConstructorSignature$1(signature, structs = {}) {
	const match = execConstructorSignature$1(signature);
	if (!match) throw new InvalidSignatureError$1({
		signature,
		type: "constructor"
	});
	const params = splitParameters$1(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter$1(params[i], {
		structs,
		type: "constructor"
	}));
	return {
		type: "constructor",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs: abiParameters
	};
}
function parseFallbackSignature$1(signature) {
	const match = execFallbackSignature$1(signature);
	if (!match) throw new InvalidSignatureError$1({
		signature,
		type: "fallback"
	});
	return {
		type: "fallback",
		stateMutability: match.stateMutability ?? "nonpayable"
	};
}
var abiParameterWithoutTupleRegex$1 = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var abiParameterWithTupleRegex$1 = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var dynamicIntegerRegex$1 = /^u?int$/;
function parseAbiParameter$1(param, options) {
	const parameterCacheKey = getParameterCacheKey$1(param, options?.type, options?.structs);
	if (parameterCache$1.has(parameterCacheKey)) return parameterCache$1.get(parameterCacheKey);
	const isTuple = isTupleRegex$1.test(param);
	const match = execTyped$1(isTuple ? abiParameterWithTupleRegex$1 : abiParameterWithoutTupleRegex$1, param);
	if (!match) throw new InvalidParameterError$1({ param });
	if (match.name && isSolidityKeyword$1(match.name)) throw new SolidityProtectedKeywordError$1({
		param,
		name: match.name
	});
	const name = match.name ? { name: match.name } : {};
	const indexed = match.modifier === "indexed" ? { indexed: true } : {};
	const structs = options?.structs ?? {};
	let type;
	let components = {};
	if (isTuple) {
		type = "tuple";
		const params = splitParameters$1(match.type);
		const components_ = [];
		const length = params.length;
		for (let i = 0; i < length; i++) components_.push(parseAbiParameter$1(params[i], { structs }));
		components = { components: components_ };
	} else if (match.type in structs) {
		type = "tuple";
		components = { components: structs[match.type] };
	} else if (dynamicIntegerRegex$1.test(match.type)) type = `${match.type}256`;
	else {
		type = match.type;
		if (!(options?.type === "struct") && !isSolidityType$1(type)) throw new UnknownSolidityTypeError$1({ type });
	}
	if (match.modifier) {
		if (!options?.modifiers?.has?.(match.modifier)) throw new InvalidModifierError$1({
			param,
			type: options?.type,
			modifier: match.modifier
		});
		if (functionModifiers$1.has(match.modifier) && !isValidDataLocation$1(type, !!match.array)) throw new InvalidFunctionModifierError$1({
			param,
			type: options?.type,
			modifier: match.modifier
		});
	}
	const abiParameter = {
		type: `${type}${match.array ?? ""}`,
		...name,
		...indexed,
		...components
	};
	parameterCache$1.set(parameterCacheKey, abiParameter);
	return abiParameter;
}
function splitParameters$1(params, result = [], current = "", depth = 0) {
	const length = params.trim().length;
	for (let i = 0; i < length; i++) {
		const char = params[i];
		const tail = params.slice(i + 1);
		switch (char) {
			case ",": return depth === 0 ? splitParameters$1(tail, [...result, current.trim()]) : splitParameters$1(tail, result, `${current}${char}`, depth);
			case "(": return splitParameters$1(tail, result, `${current}${char}`, depth + 1);
			case ")": return splitParameters$1(tail, result, `${current}${char}`, depth - 1);
			default: return splitParameters$1(tail, result, `${current}${char}`, depth);
		}
	}
	if (current === "") return result;
	if (depth !== 0) throw new InvalidParenthesisError$1({
		current,
		depth
	});
	result.push(current.trim());
	return result;
}
function isSolidityType$1(type) {
	return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex$3.test(type) || integerRegex$3.test(type);
}
var protectedKeywordsRegex$1 = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
/** @internal */
function isSolidityKeyword$1(name) {
	return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex$3.test(name) || integerRegex$3.test(name) || protectedKeywordsRegex$1.test(name);
}
/** @internal */
function isValidDataLocation$1(type, isArray) {
	return isArray || type === "bytes" || type === "string" || type === "tuple";
}
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs$1(signatures) {
	const shallowStructs = {};
	const signaturesLength = signatures.length;
	for (let i = 0; i < signaturesLength; i++) {
		const signature = signatures[i];
		if (!isStructSignature$1(signature)) continue;
		const match = execStructSignature$1(signature);
		if (!match) throw new InvalidSignatureError$1({
			signature,
			type: "struct"
		});
		const properties = match.properties.split(";");
		const components = [];
		const propertiesLength = properties.length;
		for (let k = 0; k < propertiesLength; k++) {
			const trimmed = properties[k].trim();
			if (!trimmed) continue;
			const abiParameter = parseAbiParameter$1(trimmed, { type: "struct" });
			components.push(abiParameter);
		}
		if (!components.length) throw new InvalidStructSignatureError$1({ signature });
		shallowStructs[match.name] = components;
	}
	const resolvedStructs = {};
	const entries = Object.entries(shallowStructs);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i++) {
		const [name, parameters] = entries[i];
		resolvedStructs[name] = resolveStructs$1(parameters, shallowStructs);
	}
	return resolvedStructs;
}
var typeWithoutTupleRegex$1 = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function resolveStructs$1(abiParameters, structs, ancestors = /* @__PURE__ */ new Set()) {
	const components = [];
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		if (isTupleRegex$1.test(abiParameter.type)) components.push(abiParameter);
		else {
			const match = execTyped$1(typeWithoutTupleRegex$1, abiParameter.type);
			if (!match?.type) throw new InvalidAbiTypeParameterError$1({ abiParameter });
			const { array, type } = match;
			if (type in structs) {
				if (ancestors.has(type)) throw new CircularReferenceError$1({ type });
				components.push({
					...abiParameter,
					type: `tuple${array ?? ""}`,
					components: resolveStructs$1(structs[type] ?? [], structs, /* @__PURE__ */ new Set([...ancestors, type]))
				});
			} else if (isSolidityType$1(type)) components.push(abiParameter);
			else throw new UnknownTypeError$1({ type });
		}
	}
	return components;
}
//#endregion
//#region node_modules/viem/node_modules/abitype/dist/esm/human-readable/parseAbi.js
/**
* Parses human-readable ABI into JSON {@link Abi}
*
* @param signatures - Human-Readable ABI
* @returns Parsed {@link Abi}
*
* @example
* const abi = parseAbi([
*   //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
*   'function balanceOf(address owner) view returns (uint256)',
*   'event Transfer(address indexed from, address indexed to, uint256 amount)',
* ])
*/
function parseAbi(signatures) {
	const structs = parseStructs$1(signatures);
	const abi = [];
	const length = signatures.length;
	for (let i = 0; i < length; i++) {
		const signature = signatures[i];
		if (isStructSignature$1(signature)) continue;
		abi.push(parseSignature$1(signature, structs));
	}
	return abi;
}
//#endregion
//#region node_modules/viem/_esm/utils/getAction.js
/**
* Retrieves and returns an action from the client (if exists), and falls
* back to the tree-shakable action.
*
* Useful for extracting overridden actions from a client (ie. if a consumer
* wants to override the `sendTransaction` implementation).
*/
function getAction$1(client, actionFn, name) {
	const action_implicit = client[actionFn.name];
	if (typeof action_implicit === "function") return action_implicit;
	const action_explicit = client[name];
	if (typeof action_explicit === "function") return action_explicit;
	return (params) => actionFn(client, params);
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem$1(abiItem, { includeName = false } = {}) {
	if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error") throw new InvalidDefinitionTypeError(abiItem.type);
	return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
	if (!params) return "";
	return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
	if (param.type.startsWith("tuple")) return `(${formatAbiParams(param.components, { includeName })})${param.type.slice(5)}`;
	return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
//#endregion
//#region node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError = class extends BaseError$3 {
	constructor({ docsPath }) {
		super(["A constructor was not found on the ABI.", "Make sure you are using the correct ABI and that the constructor exists on it."].join("\n"), {
			docsPath,
			name: "AbiConstructorNotFoundError"
		});
	}
};
var AbiConstructorParamsNotFoundError = class extends BaseError$3 {
	constructor({ docsPath }) {
		super(["Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.", "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."].join("\n"), {
			docsPath,
			name: "AbiConstructorParamsNotFoundError"
		});
	}
};
var AbiDecodingDataSizeTooSmallError = class extends BaseError$3 {
	constructor({ data, params, size }) {
		super([`Data size of ${size} bytes is too small for given parameters.`].join("\n"), {
			metaMessages: [`Params: (${formatAbiParams(params, { includeName: true })})`, `Data:   ${data} (${size} bytes)`],
			name: "AbiDecodingDataSizeTooSmallError"
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "params", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "size", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = data;
		this.params = params;
		this.size = size;
	}
};
var AbiDecodingZeroDataError = class extends BaseError$3 {
	constructor() {
		super("Cannot decode zero data (\"0x\") with ABI parameters.", { name: "AbiDecodingZeroDataError" });
	}
};
var AbiEncodingArrayLengthMismatchError = class extends BaseError$3 {
	constructor({ expectedLength, givenLength, type }) {
		super([
			`ABI encoding array length mismatch for type ${type}.`,
			`Expected length: ${expectedLength}`,
			`Given length: ${givenLength}`
		].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
	}
};
var AbiEncodingBytesSizeMismatchError = class extends BaseError$3 {
	constructor({ expectedSize, value }) {
		super(`Size of bytes "${value}" (bytes${size$4(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
	}
};
var AbiEncodingLengthMismatchError = class extends BaseError$3 {
	constructor({ expectedLength, givenLength }) {
		super([
			"ABI encoding params/values length mismatch.",
			`Expected length (params): ${expectedLength}`,
			`Given length (values): ${givenLength}`
		].join("\n"), { name: "AbiEncodingLengthMismatchError" });
	}
};
var AbiErrorSignatureNotFoundError = class extends BaseError$3 {
	constructor(signature, { docsPath }) {
		super([
			`Encoded error signature "${signature}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the error exists on it.",
			`You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
		].join("\n"), {
			docsPath,
			name: "AbiErrorSignatureNotFoundError"
		});
		Object.defineProperty(this, "signature", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.signature = signature;
	}
};
var AbiEventSignatureEmptyTopicsError = class extends BaseError$3 {
	constructor({ docsPath }) {
		super("Cannot extract event signature from empty topics.", {
			docsPath,
			name: "AbiEventSignatureEmptyTopicsError"
		});
	}
};
var AbiEventSignatureNotFoundError = class extends BaseError$3 {
	constructor(signature, { docsPath }) {
		super([
			`Encoded event signature "${signature}" not found on ABI.`,
			"Make sure you are using the correct ABI and that the event exists on it.",
			`You can look up the signature here: https://openchain.xyz/signatures?query=${signature}.`
		].join("\n"), {
			docsPath,
			name: "AbiEventSignatureNotFoundError"
		});
	}
};
var AbiEventNotFoundError = class extends BaseError$3 {
	constructor(eventName, { docsPath } = {}) {
		super([`Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the event exists on it."].join("\n"), {
			docsPath,
			name: "AbiEventNotFoundError"
		});
	}
};
var AbiFunctionNotFoundError = class extends BaseError$3 {
	constructor(functionName, { docsPath } = {}) {
		super([`Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`, "Make sure you are using the correct ABI and that the function exists on it."].join("\n"), {
			docsPath,
			name: "AbiFunctionNotFoundError"
		});
	}
};
var AbiFunctionOutputsNotFoundError = class extends BaseError$3 {
	constructor(functionName, { docsPath }) {
		super([
			`Function "${functionName}" does not contain any \`outputs\` on ABI.`,
			"Cannot decode function result without knowing what the parameter types are.",
			"Make sure you are using the correct ABI and that the function exists on it."
		].join("\n"), {
			docsPath,
			name: "AbiFunctionOutputsNotFoundError"
		});
	}
};
var AbiItemAmbiguityError = class extends BaseError$3 {
	constructor(x, y) {
		super("Found ambiguous types in overloaded ABI items.", {
			metaMessages: [
				`\`${x.type}\` in \`${formatAbiItem$1(x.abiItem)}\`, and`,
				`\`${y.type}\` in \`${formatAbiItem$1(y.abiItem)}\``,
				"",
				"These types encode differently and cannot be distinguished at runtime.",
				"Remove one of the ambiguous items in the ABI."
			],
			name: "AbiItemAmbiguityError"
		});
	}
};
var BytesSizeMismatchError$1 = class extends BaseError$3 {
	constructor({ expectedSize, givenSize }) {
		super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, { name: "BytesSizeMismatchError" });
	}
};
var DecodeLogDataMismatch = class extends BaseError$3 {
	constructor({ abiItem, data, params, size }) {
		super([`Data size of ${size} bytes is too small for non-indexed event parameters.`].join("\n"), {
			metaMessages: [`Params: (${formatAbiParams(params, { includeName: true })})`, `Data:   ${data} (${size} bytes)`],
			name: "DecodeLogDataMismatch"
		});
		Object.defineProperty(this, "abiItem", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "params", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "size", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.abiItem = abiItem;
		this.data = data;
		this.params = params;
		this.size = size;
	}
};
var DecodeLogTopicsMismatch = class extends BaseError$3 {
	constructor({ abiItem, param }) {
		super([`Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem$1(abiItem, { includeName: true })}".`].join("\n"), { name: "DecodeLogTopicsMismatch" });
		Object.defineProperty(this, "abiItem", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.abiItem = abiItem;
	}
};
var InvalidAbiEncodingTypeError = class extends BaseError$3 {
	constructor(type, { docsPath }) {
		super([`Type "${type}" is not a valid encoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath,
			name: "InvalidAbiEncodingType"
		});
	}
};
var InvalidAbiDecodingTypeError = class extends BaseError$3 {
	constructor(type, { docsPath }) {
		super([`Type "${type}" is not a valid decoding type.`, "Please provide a valid ABI type."].join("\n"), {
			docsPath,
			name: "InvalidAbiDecodingType"
		});
	}
};
var InvalidArrayError$1 = class extends BaseError$3 {
	constructor(value) {
		super([`Value "${value}" is not a valid array.`].join("\n"), { name: "InvalidArrayError" });
	}
};
var InvalidDefinitionTypeError = class extends BaseError$3 {
	constructor(type) {
		super([`"${type}" is not a valid definition type.`, "Valid types: \"function\", \"event\", \"error\""].join("\n"), { name: "InvalidDefinitionTypeError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/log.js
var FilterTypeNotSupportedError = class extends BaseError$3 {
	constructor(type) {
		super(`Filter type "${type}" is not supported.`, { name: "FilterTypeNotSupportedError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/hash/hashSignature.js
var hash = (value) => keccak256$1(toBytes(value));
function hashSignature(sig) {
	return hash(sig);
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature$1(signature) {
	let active = true;
	let current = "";
	let level = 0;
	let result = "";
	let valid = false;
	for (let i = 0; i < signature.length; i++) {
		const char = signature[i];
		if ([
			"(",
			")",
			","
		].includes(char)) active = true;
		if (char === "(") level++;
		if (char === ")") level--;
		if (!active) continue;
		if (level === 0) {
			if (char === " " && [
				"event",
				"function",
				""
			].includes(result)) result = "";
			else {
				result += char;
				if (char === ")") {
					valid = true;
					break;
				}
			}
			continue;
		}
		if (char === " ") {
			if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
				current = "";
				active = false;
			}
			continue;
		}
		result += char;
		current += char;
	}
	if (!valid) throw new BaseError$3("Unable to normalize signature.");
	return result;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toSignature.js
/**
* Returns the signature for a given function or event definition.
*
* @example
* const signature = toSignature('function ownerOf(uint256 tokenId)')
* // 'ownerOf(uint256)'
*
* @example
* const signature_3 = toSignature({
*   name: 'ownerOf',
*   type: 'function',
*   inputs: [{ name: 'tokenId', type: 'uint256' }],
*   outputs: [],
*   stateMutability: 'view',
* })
* // 'ownerOf(uint256)'
*/
var toSignature = (def) => {
	return normalizeSignature$1((() => {
		if (typeof def === "string") return def;
		return formatAbiItem$2(def);
	})());
};
//#endregion
//#region node_modules/viem/_esm/utils/hash/toSignatureHash.js
/**
* Returns the hash (of the function/event signature) for a given event or function definition.
*/
function toSignatureHash(fn) {
	return hashSignature(toSignature(fn));
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toEventSelector.js
/**
* Returns the event selector for a given event definition.
*
* @example
* const selector = toEventSelector('Transfer(address indexed from, address indexed to, uint256 amount)')
* // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
*/
var toEventSelector = toSignatureHash;
//#endregion
//#region node_modules/viem/_esm/utils/data/concat.js
function concat$1(values) {
	if (typeof values[0] === "string") return concatHex(values);
	return concatBytes(values);
}
function concatBytes(values) {
	let length = 0;
	for (const arr of values) length += arr.length;
	const result = new Uint8Array(length);
	let offset = 0;
	for (const arr of values) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}
function concatHex(values) {
	return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
//#endregion
//#region node_modules/viem/_esm/utils/data/slice.js
/**
* @description Returns a section of the hex or byte array given a start/end bytes offset.
*
* @param value The hex or byte array to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function slice$1(value, start, end, { strict } = {}) {
	if (isHex(value, { strict: false })) return sliceHex(value, start, end, { strict });
	return sliceBytes(value, start, end, { strict });
}
function assertStartOffset$1(value, start) {
	if (typeof start === "number" && start > 0 && start > size$4(value) - 1) throw new SliceOffsetOutOfBoundsError$2({
		offset: start,
		position: "start",
		size: size$4(value)
	});
}
function assertEndOffset$1(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size$4(value) !== end - start) throw new SliceOffsetOutOfBoundsError$2({
		offset: end,
		position: "end",
		size: size$4(value)
	});
}
/**
* @description Returns a section of the byte array given a start/end bytes offset.
*
* @param value The byte array to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function sliceBytes(value_, start, end, { strict } = {}) {
	assertStartOffset$1(value_, start);
	const value = value_.slice(start, end);
	if (strict) assertEndOffset$1(value, start, end);
	return value;
}
/**
* @description Returns a section of the hex value given a start/end bytes offset.
*
* @param value The hex value to slice.
* @param start The start offset (in bytes).
* @param end The end offset (in bytes).
*/
function sliceHex(value_, start, end, { strict } = {}) {
	assertStartOffset$1(value_, start);
	const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
	if (strict) assertEndOffset$1(value, start, end);
	return value;
}
//#endregion
//#region node_modules/viem/_esm/utils/regex.js
var bytesRegex$2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex$2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
/**
* @description Encodes a list of primitive values into an ABI-encoded hex value.
*
* - Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters
*
*   Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.
*
* @param params - a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.
* @param values - a set of values (values) that correspond to the given params.
* @example
* ```typescript
* import { encodeAbiParameters } from 'viem'
*
* const encodedData = encodeAbiParameters(
*   [
*     { name: 'x', type: 'string' },
*     { name: 'y', type: 'uint' },
*     { name: 'z', type: 'bool' }
*   ],
*   ['wagmi', 420n, true]
* )
* ```
*
* You can also pass in Human Readable parameters with the parseAbiParameters utility.
*
* @example
* ```typescript
* import { encodeAbiParameters, parseAbiParameters } from 'viem'
*
* const encodedData = encodeAbiParameters(
*   parseAbiParameters('string x, uint y, bool z'),
*   ['wagmi', 420n, true]
* )
* ```
*/
function encodeAbiParameters(params, values) {
	if (params.length !== values.length) throw new AbiEncodingLengthMismatchError({
		expectedLength: params.length,
		givenLength: values.length
	});
	const data = encodeParams(prepareParams({
		params,
		values
	}));
	if (data.length === 0) return "0x";
	return data;
}
function prepareParams({ params, values }) {
	const preparedParams = [];
	for (let i = 0; i < params.length; i++) preparedParams.push(prepareParam({
		param: params[i],
		value: values[i]
	}));
	return preparedParams;
}
function prepareParam({ param, value }) {
	const arrayComponents = getArrayComponents$1(param.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return encodeArray$1(value, {
			length,
			param: {
				...param,
				type
			}
		});
	}
	if (param.type === "tuple") return encodeTuple$1(value, { param });
	if (param.type === "address") return encodeAddress$1(value);
	if (param.type === "bool") return encodeBool(value);
	if (param.type.startsWith("uint") || param.type.startsWith("int")) {
		const signed = param.type.startsWith("int");
		const [, , size = "256"] = integerRegex$2.exec(param.type) ?? [];
		return encodeNumber$1(value, {
			signed,
			size: Number(size)
		});
	}
	if (param.type.startsWith("bytes")) return encodeBytes$1(value, { param });
	if (param.type === "string") return encodeString$1(value);
	throw new InvalidAbiEncodingTypeError(param.type, { docsPath: "/docs/contract/encodeAbiParameters" });
}
function encodeParams(preparedParams) {
	let staticSize = 0;
	for (let i = 0; i < preparedParams.length; i++) {
		const { dynamic, encoded } = preparedParams[i];
		if (dynamic) staticSize += 32;
		else staticSize += size$4(encoded);
	}
	const staticParams = [];
	const dynamicParams = [];
	let dynamicSize = 0;
	for (let i = 0; i < preparedParams.length; i++) {
		const { dynamic, encoded } = preparedParams[i];
		if (dynamic) {
			staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
			dynamicParams.push(encoded);
			dynamicSize += size$4(encoded);
		} else staticParams.push(encoded);
	}
	return concat$1([...staticParams, ...dynamicParams]);
}
function encodeAddress$1(value) {
	if (!isAddress(value)) throw new InvalidAddressError$1({ address: value });
	return {
		dynamic: false,
		encoded: padHex(value.toLowerCase())
	};
}
function encodeArray$1(value, { length, param }) {
	const dynamic = length === null;
	if (!Array.isArray(value)) throw new InvalidArrayError$1(value);
	if (!dynamic && value.length !== length) throw new AbiEncodingArrayLengthMismatchError({
		expectedLength: length,
		givenLength: value.length,
		type: `${param.type}[${length}]`
	});
	let dynamicChild = false;
	const preparedParams = [];
	for (let i = 0; i < value.length; i++) {
		const preparedParam = prepareParam({
			param,
			value: value[i]
		});
		if (preparedParam.dynamic) dynamicChild = true;
		preparedParams.push(preparedParam);
	}
	if (dynamic || dynamicChild) {
		const data = encodeParams(preparedParams);
		if (dynamic) {
			const length = numberToHex(preparedParams.length, { size: 32 });
			return {
				dynamic: true,
				encoded: preparedParams.length > 0 ? concat$1([length, data]) : length
			};
		}
		if (dynamicChild) return {
			dynamic: true,
			encoded: data
		};
	}
	return {
		dynamic: false,
		encoded: concat$1(preparedParams.map(({ encoded }) => encoded))
	};
}
function encodeBytes$1(value, { param }) {
	const [, paramSize] = param.type.split("bytes");
	const bytesSize = size$4(value);
	if (!paramSize) {
		let value_ = value;
		if (bytesSize % 32 !== 0) value_ = padHex(value_, {
			dir: "right",
			size: Math.ceil((value.length - 2) / 2 / 32) * 32
		});
		return {
			dynamic: true,
			encoded: concat$1([padHex(numberToHex(bytesSize, { size: 32 })), value_])
		};
	}
	if (bytesSize !== Number.parseInt(paramSize)) throw new AbiEncodingBytesSizeMismatchError({
		expectedSize: Number.parseInt(paramSize),
		value
	});
	return {
		dynamic: false,
		encoded: padHex(value, { dir: "right" })
	};
}
function encodeBool(value) {
	if (typeof value !== "boolean") throw new BaseError$3(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: false,
		encoded: padHex(boolToHex(value))
	};
}
function encodeNumber$1(value, { signed, size = 256 }) {
	if (typeof size === "number") {
		const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
		const min = signed ? -max - 1n : 0n;
		if (value > max || value < min) throw new IntegerOutOfRangeError$1({
			max: max.toString(),
			min: min.toString(),
			signed,
			size: size / 8,
			value: value.toString()
		});
	}
	return {
		dynamic: false,
		encoded: numberToHex(value, {
			size: 32,
			signed
		})
	};
}
function encodeString$1(value) {
	const hexValue = stringToHex(value);
	const partsLength = Math.ceil(size$4(hexValue) / 32);
	const parts = [];
	for (let i = 0; i < partsLength; i++) parts.push(padHex(slice$1(hexValue, i * 32, (i + 1) * 32), { dir: "right" }));
	return {
		dynamic: true,
		encoded: concat$1([padHex(numberToHex(size$4(hexValue), { size: 32 })), ...parts])
	};
}
function encodeTuple$1(value, { param }) {
	let dynamic = false;
	const preparedParams = [];
	for (let i = 0; i < param.components.length; i++) {
		const param_ = param.components[i];
		const preparedParam = prepareParam({
			param: param_,
			value: value[Array.isArray(value) ? i : param_.name]
		});
		preparedParams.push(preparedParam);
		if (preparedParam.dynamic) dynamic = true;
	}
	return {
		dynamic,
		encoded: dynamic ? encodeParams(preparedParams) : concat$1(preparedParams.map(({ encoded }) => encoded))
	};
}
function getArrayComponents$1(type) {
	const matches = type.match(/^(.*)\[(\d+)?\]$/);
	return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/toFunctionSelector.js
/**
* Returns the function selector for a given function definition.
*
* @example
* const selector = toFunctionSelector('function ownerOf(uint256 tokenId)')
* // 0x6352211e
*/
var toFunctionSelector = (fn) => slice$1(toSignatureHash(fn), 0, 4);
//#endregion
//#region node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
	const { abi, args = [], name } = parameters;
	const isSelector = isHex(name, { strict: false });
	const abiItems = abi.filter((abiItem) => {
		if (isSelector) {
			if (abiItem.type === "function") return toFunctionSelector(abiItem) === name;
			if (abiItem.type === "event") return toEventSelector(abiItem) === name;
			return false;
		}
		return "name" in abiItem && abiItem.name === name;
	});
	if (abiItems.length === 0) return void 0;
	if (abiItems.length === 1) return abiItems[0];
	let matchedAbiItem = void 0;
	for (const abiItem of abiItems) {
		if (!("inputs" in abiItem)) continue;
		if (!args || args.length === 0) {
			if (!abiItem.inputs || abiItem.inputs.length === 0) return abiItem;
			continue;
		}
		if (!abiItem.inputs) continue;
		if (abiItem.inputs.length === 0) continue;
		if (abiItem.inputs.length !== args.length) continue;
		if (args.every((arg, index) => {
			const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
			if (!abiParameter) return false;
			return isArgOfType$1(arg, abiParameter);
		})) {
			if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
				const ambiguousTypes = getAmbiguousTypes$1(abiItem.inputs, matchedAbiItem.inputs, args);
				if (ambiguousTypes) throw new AbiItemAmbiguityError({
					abiItem,
					type: ambiguousTypes[0]
				}, {
					abiItem: matchedAbiItem,
					type: ambiguousTypes[1]
				});
			}
			matchedAbiItem = abiItem;
		}
	}
	if (matchedAbiItem) return matchedAbiItem;
	return abiItems[0];
}
/** @internal */
function isArgOfType$1(arg, abiParameter) {
	const argType = typeof arg;
	const abiParameterType = abiParameter.type;
	switch (abiParameterType) {
		case "address": return isAddress(arg, { strict: false });
		case "bool": return argType === "boolean";
		case "function": return argType === "string";
		case "string": return argType === "string";
		default:
			if (abiParameterType === "tuple" && "components" in abiParameter) return Object.values(abiParameter.components).every((component, index) => {
				return isArgOfType$1(Object.values(arg)[index], component);
			});
			if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType)) return argType === "number" || argType === "bigint";
			if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType)) return argType === "string" || arg instanceof Uint8Array;
			if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) return Array.isArray(arg) && arg.every((x) => isArgOfType$1(x, {
				...abiParameter,
				type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
			}));
			return false;
	}
}
/** @internal */
function getAmbiguousTypes$1(sourceParameters, targetParameters, args) {
	for (const parameterIndex in sourceParameters) {
		const sourceParameter = sourceParameters[parameterIndex];
		const targetParameter = targetParameters[parameterIndex];
		if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter) return getAmbiguousTypes$1(sourceParameter.components, targetParameter.components, args[parameterIndex]);
		const types = [sourceParameter.type, targetParameter.type];
		if ((() => {
			if (types.includes("address") && types.includes("bytes20")) return true;
			if (types.includes("address") && types.includes("string")) return isAddress(args[parameterIndex], { strict: false });
			if (types.includes("address") && types.includes("bytes")) return isAddress(args[parameterIndex], { strict: false });
			return false;
		})()) return types;
	}
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeEventTopics.js
var docsPath$4 = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
	const { abi, eventName, args } = parameters;
	let abiItem = abi[0];
	if (eventName) {
		const item = getAbiItem({
			abi,
			name: eventName
		});
		if (!item) throw new AbiEventNotFoundError(eventName, { docsPath: docsPath$4 });
		abiItem = item;
	}
	if (abiItem.type !== "event") throw new AbiEventNotFoundError(void 0, { docsPath: docsPath$4 });
	const signature = toEventSelector(formatAbiItem$1(abiItem));
	let topics = [];
	if (args && "inputs" in abiItem) {
		const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
		const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
		if (args_.length > 0) topics = indexedInputs?.map((param, i) => {
			if (Array.isArray(args_[i])) return args_[i].map((_, j) => encodeArg({
				param,
				value: args_[i][j]
			}));
			return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({
				param,
				value: args_[i]
			}) : null;
		}) ?? [];
	}
	return [signature, ...topics];
}
function encodeArg({ param, value }) {
	if (param.type === "string" || param.type === "bytes") return keccak256$1(toBytes(value));
	if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/)) throw new FilterTypeNotSupportedError(param.type);
	return encodeAbiParameters([param], [value]);
}
//#endregion
//#region node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
/**
* Scopes `request` to the filter ID. If the client is a fallback, it will
* listen for responses and scope the child transport `request` function
* to the successful filter ID.
*/
function createFilterRequestScope(client, { method }) {
	const requestMap = {};
	if (client.transport.type === "fallback") client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
		if (status === "success" && method === method_) requestMap[id] = transport.request;
	});
	return ((id) => requestMap[id] || client.request);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/createContractEventFilter.js
/**
* Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).
*
* - Docs: https://viem.sh/docs/contract/createContractEventFilter
*
* @param client - Client to use
* @param parameters - {@link CreateContractEventFilterParameters}
* @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateContractEventFilterReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createContractEventFilter } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createContractEventFilter(client, {
*   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
* })
*/
async function createContractEventFilter(client, parameters) {
	const { address, abi, args, eventName, fromBlock, strict, toBlock } = parameters;
	const getRequest = createFilterRequestScope(client, { method: "eth_newFilter" });
	const topics = eventName ? encodeEventTopics({
		abi,
		args,
		eventName
	}) : void 0;
	const id = await client.request({
		method: "eth_newFilter",
		params: [{
			address,
			fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
			toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
			topics
		}]
	});
	return {
		abi,
		args,
		eventName,
		id,
		request: getRequest(id),
		strict: Boolean(strict),
		type: "event"
	};
}
//#endregion
//#region node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
	if (typeof account === "string") return {
		address: account,
		type: "json-rpc"
	};
	return account;
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
var docsPath$3 = "/docs/contract/encodeFunctionData";
function prepareEncodeFunctionData(parameters) {
	const { abi, args, functionName } = parameters;
	let abiItem = abi[0];
	if (functionName) {
		const item = getAbiItem({
			abi,
			args,
			name: functionName
		});
		if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$3 });
		abiItem = item;
	}
	if (abiItem.type !== "function") throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$3 });
	return {
		abi: [abiItem],
		functionName: toFunctionSelector(formatAbiItem$1(abiItem))
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
	const { args } = parameters;
	const { abi, functionName } = (() => {
		if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x")) return parameters;
		return prepareEncodeFunctionData(parameters);
	})();
	const abiItem = abi[0];
	return concatHex([functionName, ("inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0) ?? "0x"]);
}
//#endregion
//#region node_modules/viem/_esm/constants/solidity.js
var panicReasons = {
	1: "An `assert` condition failed.",
	17: "Arithmetic operation resulted in underflow or overflow.",
	18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
	33: "Attempted to convert to an invalid type.",
	34: "Attempted to access a storage byte array that is incorrectly encoded.",
	49: "Performed `.pop()` on an empty array",
	50: "Array index is out of bounds.",
	65: "Allocated too much memory or created an array which is too large.",
	81: "Attempted to call a zero-initialized variable of internal function type."
};
var solidityError = {
	inputs: [{
		name: "message",
		type: "string"
	}],
	name: "Error",
	type: "error"
};
var solidityPanic = {
	inputs: [{
		name: "reason",
		type: "uint256"
	}],
	name: "Panic",
	type: "error"
};
//#endregion
//#region node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError = class extends BaseError$3 {
	constructor({ offset }) {
		super(`Offset \`${offset}\` cannot be negative.`, { name: "NegativeOffsetError" });
	}
};
var PositionOutOfBoundsError = class extends BaseError$3 {
	constructor({ length, position }) {
		super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
	}
};
var RecursiveReadLimitExceededError = class extends BaseError$3 {
	constructor({ count, limit }) {
		super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/cursor.js
var staticCursor = {
	bytes: /* @__PURE__ */ new Uint8Array(),
	dataView: /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0)),
	position: 0,
	positionReadCount: /* @__PURE__ */ new Map(),
	recursiveReadCount: 0,
	recursiveReadLimit: Number.POSITIVE_INFINITY,
	assertReadLimit() {
		if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
			count: this.recursiveReadCount + 1,
			limit: this.recursiveReadLimit
		});
	},
	assertPosition(position) {
		if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
			length: this.bytes.length,
			position
		});
	},
	decrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position - offset;
		this.assertPosition(position);
		this.position = position;
	},
	getReadCount(position) {
		return this.positionReadCount.get(position || this.position) || 0;
	},
	incrementPosition(offset) {
		if (offset < 0) throw new NegativeOffsetError({ offset });
		const position = this.position + offset;
		this.assertPosition(position);
		this.position = position;
	},
	inspectByte(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectBytes(length, position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + length - 1);
		return this.bytes.subarray(position, position + length);
	},
	inspectUint8(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position);
		return this.bytes[position];
	},
	inspectUint16(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 1);
		return this.dataView.getUint16(position);
	},
	inspectUint24(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 2);
		return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
	},
	inspectUint32(position_) {
		const position = position_ ?? this.position;
		this.assertPosition(position + 3);
		return this.dataView.getUint32(position);
	},
	pushByte(byte) {
		this.assertPosition(this.position);
		this.bytes[this.position] = byte;
		this.position++;
	},
	pushBytes(bytes) {
		this.assertPosition(this.position + bytes.length - 1);
		this.bytes.set(bytes, this.position);
		this.position += bytes.length;
	},
	pushUint8(value) {
		this.assertPosition(this.position);
		this.bytes[this.position] = value;
		this.position++;
	},
	pushUint16(value) {
		this.assertPosition(this.position + 1);
		this.dataView.setUint16(this.position, value);
		this.position += 2;
	},
	pushUint24(value) {
		this.assertPosition(this.position + 2);
		this.dataView.setUint16(this.position, value >> 8);
		this.dataView.setUint8(this.position + 2, value & 255);
		this.position += 3;
	},
	pushUint32(value) {
		this.assertPosition(this.position + 3);
		this.dataView.setUint32(this.position, value);
		this.position += 4;
	},
	readByte() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectByte();
		this.position++;
		return value;
	},
	readBytes(length, size) {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectBytes(length);
		this.position += size ?? length;
		return value;
	},
	readUint8() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint8();
		this.position += 1;
		return value;
	},
	readUint16() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint16();
		this.position += 2;
		return value;
	},
	readUint24() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint24();
		this.position += 3;
		return value;
	},
	readUint32() {
		this.assertReadLimit();
		this._touch();
		const value = this.inspectUint32();
		this.position += 4;
		return value;
	},
	get remaining() {
		return this.bytes.length - this.position;
	},
	setPosition(position) {
		const oldPosition = this.position;
		this.assertPosition(position);
		this.position = position;
		return () => this.position = oldPosition;
	},
	_touch() {
		if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
		const count = this.getReadCount();
		this.positionReadCount.set(this.position, count + 1);
		if (count > 0) this.recursiveReadCount++;
	}
};
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
	const cursor = Object.create(staticCursor);
	cursor.bytes = bytes;
	cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	cursor.positionReadCount = /* @__PURE__ */ new Map();
	cursor.recursiveReadLimit = recursiveReadLimit;
	return cursor;
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/fromBytes.js
/**
* Decodes a byte array into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { bytesToBigInt } from 'viem'
* const data = bytesToBigInt(new Uint8Array([1, 164]))
* // 420n
*/
function bytesToBigInt(bytes, opts = {}) {
	if (typeof opts.size !== "undefined") assertSize$2(bytes, { size: opts.size });
	const hex = bytesToHex(bytes, opts);
	return hexToBigInt(hex, opts);
}
/**
* Decodes a byte array into a boolean.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns Boolean value.
*
* @example
* import { bytesToBool } from 'viem'
* const data = bytesToBool(new Uint8Array([1]))
* // true
*/
function bytesToBool(bytes_, opts = {}) {
	let bytes = bytes_;
	if (typeof opts.size !== "undefined") {
		assertSize$2(bytes, { size: opts.size });
		bytes = trim(bytes);
	}
	if (bytes.length > 1 || bytes[0] > 1) throw new InvalidBytesBooleanError$1(bytes);
	return Boolean(bytes[0]);
}
/**
* Decodes a byte array into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { bytesToNumber } from 'viem'
* const data = bytesToNumber(new Uint8Array([1, 164]))
* // 420
*/
function bytesToNumber(bytes, opts = {}) {
	if (typeof opts.size !== "undefined") assertSize$2(bytes, { size: opts.size });
	const hex = bytesToHex(bytes, opts);
	return hexToNumber(hex, opts);
}
/**
* Decodes a byte array into a UTF-8 string.
*
* - Docs: https://viem.sh/docs/utilities/fromBytes#bytestostring
*
* @param bytes Byte array to decode.
* @param opts Options.
* @returns String value.
*
* @example
* import { bytesToString } from 'viem'
* const data = bytesToString(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // 'Hello world'
*/
function bytesToString(bytes_, opts = {}) {
	let bytes = bytes_;
	if (typeof opts.size !== "undefined") {
		assertSize$2(bytes, { size: opts.size });
		bytes = trim(bytes, { dir: "right" });
	}
	return new TextDecoder().decode(bytes);
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
	const bytes = typeof data === "string" ? hexToBytes(data) : data;
	const cursor = createCursor(bytes);
	if (size$4(bytes) === 0 && params.length > 0) throw new AbiDecodingZeroDataError();
	if (size$4(data) && size$4(data) < 32) throw new AbiDecodingDataSizeTooSmallError({
		data: typeof data === "string" ? data : bytesToHex(data),
		params,
		size: size$4(data)
	});
	let consumed = 0;
	const values = [];
	for (let i = 0; i < params.length; ++i) {
		const param = params[i];
		cursor.setPosition(consumed);
		const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: 0 });
		consumed += consumed_;
		values.push(data);
	}
	return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
	const arrayComponents = getArrayComponents$1(param.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return decodeArray(cursor, {
			...param,
			type
		}, {
			length,
			staticPosition
		});
	}
	if (param.type === "tuple") return decodeTuple(cursor, param, { staticPosition });
	if (param.type === "address") return decodeAddress(cursor);
	if (param.type === "bool") return decodeBool(cursor);
	if (param.type.startsWith("bytes")) return decodeBytes(cursor, param, { staticPosition });
	if (param.type.startsWith("uint") || param.type.startsWith("int")) return decodeNumber(cursor, param);
	if (param.type === "string") return decodeString(cursor, { staticPosition });
	throw new InvalidAbiDecodingTypeError(param.type, { docsPath: "/docs/contract/decodeAbiParameters" });
}
var sizeOfLength = 32;
var sizeOfOffset = 32;
function decodeAddress(cursor) {
	const value = cursor.readBytes(32);
	return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
	if (!length) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		const startOfData = start + sizeOfLength;
		cursor.setPosition(start);
		const length = bytesToNumber(cursor.readBytes(sizeOfLength));
		const dynamicChild = hasDynamicChild(param);
		let consumed = 0;
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed));
			const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: startOfData });
			consumed += consumed_;
			value.push(data);
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	if (hasDynamicChild(param)) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		const value = [];
		for (let i = 0; i < length; ++i) {
			cursor.setPosition(start + i * 32);
			const [data] = decodeParameter(cursor, param, { staticPosition: start });
			value.push(data);
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	let consumed = 0;
	const value = [];
	for (let i = 0; i < length; ++i) {
		const [data, consumed_] = decodeParameter(cursor, param, { staticPosition: staticPosition + consumed });
		consumed += consumed_;
		value.push(data);
	}
	return [value, consumed];
}
function decodeBool(cursor) {
	return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
	const [_, size] = param.type.split("bytes");
	if (!size) {
		const offset = bytesToNumber(cursor.readBytes(32));
		cursor.setPosition(staticPosition + offset);
		const length = bytesToNumber(cursor.readBytes(32));
		if (length === 0) {
			cursor.setPosition(staticPosition + 32);
			return ["0x", 32];
		}
		const data = cursor.readBytes(length);
		cursor.setPosition(staticPosition + 32);
		return [bytesToHex(data), 32];
	}
	return [bytesToHex(cursor.readBytes(Number.parseInt(size), 32)), 32];
}
function decodeNumber(cursor, param) {
	const signed = param.type.startsWith("int");
	const size = Number.parseInt(param.type.split("int")[1] || "256");
	const value = cursor.readBytes(32);
	return [size > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }), 32];
}
function decodeTuple(cursor, param, { staticPosition }) {
	const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
	const value = hasUnnamedChild ? [] : {};
	let consumed = 0;
	if (hasDynamicChild(param)) {
		const start = staticPosition + bytesToNumber(cursor.readBytes(sizeOfOffset));
		for (let i = 0; i < param.components.length; ++i) {
			const component = param.components[i];
			cursor.setPosition(start + consumed);
			const [data, consumed_] = decodeParameter(cursor, component, { staticPosition: start });
			consumed += consumed_;
			value[hasUnnamedChild ? i : component?.name] = data;
		}
		cursor.setPosition(staticPosition + 32);
		return [value, 32];
	}
	for (let i = 0; i < param.components.length; ++i) {
		const component = param.components[i];
		const [data, consumed_] = decodeParameter(cursor, component, { staticPosition });
		value[hasUnnamedChild ? i : component?.name] = data;
		consumed += consumed_;
	}
	return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
	const start = staticPosition + bytesToNumber(cursor.readBytes(32));
	cursor.setPosition(start);
	const length = bytesToNumber(cursor.readBytes(32));
	if (length === 0) {
		cursor.setPosition(staticPosition + 32);
		return ["", 32];
	}
	const data = cursor.readBytes(length, 32);
	const value = bytesToString(trim(data));
	cursor.setPosition(staticPosition + 32);
	return [value, 32];
}
function hasDynamicChild(param) {
	const { type } = param;
	if (type === "string") return true;
	if (type === "bytes") return true;
	if (type.endsWith("[]")) return true;
	if (type === "tuple") return param.components?.some(hasDynamicChild);
	const arrayComponents = getArrayComponents$1(param.type);
	if (arrayComponents && hasDynamicChild({
		...param,
		type: arrayComponents[1]
	})) return true;
	return false;
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
	const { abi, data } = parameters;
	const signature = slice$1(data, 0, 4);
	if (signature === "0x") throw new AbiDecodingZeroDataError();
	const abiItem = [
		...abi || [],
		solidityError,
		solidityPanic
	].find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem$1(x)));
	if (!abiItem) throw new AbiErrorSignatureNotFoundError(signature, { docsPath: "/docs/contract/decodeErrorResult" });
	return {
		abiItem,
		args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice$1(data, 4)) : void 0,
		errorName: abiItem.name
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
	if (!("name" in abiItem)) return;
	if (!("inputs" in abiItem)) return;
	if (!abiItem.inputs) return;
	return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify$1(args[i]) : args[i]}`).join(", ")})`;
}
//#endregion
//#region node_modules/viem/_esm/constants/unit.js
var etherUnits = {
	gwei: 9,
	wei: 18
};
var gweiUnits = {
	ether: -9,
	wei: 9
};
//#endregion
//#region node_modules/viem/_esm/utils/unit/formatUnits.js
/**
*  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
*
* - Docs: https://viem.sh/docs/utilities/formatUnits
*
* @example
* import { formatUnits } from 'viem'
*
* formatUnits(420000000000n, 9)
* // '420'
*/
function formatUnits(value, decimals) {
	let display = value.toString();
	const negative = display.startsWith("-");
	if (negative) display = display.slice(1);
	display = display.padStart(decimals, "0");
	let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
	fraction = fraction.replace(/(0+)$/, "");
	return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
//#endregion
//#region node_modules/viem/_esm/utils/unit/formatEther.js
/**
* Converts numerical wei to a string representation of ether.
*
* - Docs: https://viem.sh/docs/utilities/formatEther
*
* @example
* import { formatEther } from 'viem'
*
* formatEther(1000000000000000000n)
* // '1'
*/
function formatEther(wei, unit = "wei") {
	return formatUnits(wei, etherUnits[unit]);
}
//#endregion
//#region node_modules/viem/_esm/utils/unit/formatGwei.js
/**
* Converts numerical wei to a string representation of gwei.
*
* - Docs: https://viem.sh/docs/utilities/formatGwei
*
* @example
* import { formatGwei } from 'viem'
*
* formatGwei(1000000000n)
* // '1'
*/
function formatGwei(wei, unit = "wei") {
	return formatUnits(wei, gweiUnits[unit]);
}
//#endregion
//#region node_modules/viem/_esm/errors/stateOverride.js
var AccountStateConflictError = class extends BaseError$3 {
	constructor({ address }) {
		super(`State for account "${address}" is set multiple times.`, { name: "AccountStateConflictError" });
	}
};
var StateAssignmentConflictError = class extends BaseError$3 {
	constructor() {
		super("state and stateDiff are set on the same account.", { name: "StateAssignmentConflictError" });
	}
};
/** @internal */
function prettyStateMapping(stateMapping) {
	return stateMapping.reduce((pretty, { slot, value }) => {
		return `${pretty}        ${slot}: ${value}\n`;
	}, "");
}
function prettyStateOverride(stateOverride) {
	return stateOverride.reduce((pretty, { address, ...state }) => {
		let val = `${pretty}    ${address}:\n`;
		if (state.nonce) val += `      nonce: ${state.nonce}\n`;
		if (state.balance) val += `      balance: ${state.balance}\n`;
		if (state.code) val += `      code: ${state.code}\n`;
		if (state.state) {
			val += "      state:\n";
			val += prettyStateMapping(state.state);
		}
		if (state.stateDiff) {
			val += "      stateDiff:\n";
			val += prettyStateMapping(state.stateDiff);
		}
		return val;
	}, "  State Override:\n").slice(0, -1);
}
//#endregion
//#region node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
	const entries = Object.entries(args).map(([key, value]) => {
		if (value === void 0 || value === false) return null;
		return [key, value];
	}).filter(Boolean);
	const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
	return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
var FeeConflictError = class extends BaseError$3 {
	constructor() {
		super(["Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.", "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."].join("\n"), { name: "FeeConflictError" });
	}
};
var InvalidSerializableTransactionError = class extends BaseError$3 {
	constructor({ transaction }) {
		super("Cannot infer a transaction type from provided transaction.", {
			metaMessages: [
				"Provided Transaction:",
				"{",
				prettyPrint(transaction),
				"}",
				"",
				"To infer the type, either provide:",
				"- a `type` to the Transaction, or",
				"- an EIP-1559 Transaction with `maxFeePerGas`, or",
				"- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
				"- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
				"- an EIP-7702 Transaction with `authorizationList`, or",
				"- a Legacy Transaction with `gasPrice`"
			],
			name: "InvalidSerializableTransactionError"
		});
	}
};
var TransactionExecutionError = class extends BaseError$3 {
	constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
		const prettyArgs = prettyPrint({
			chain: chain && `${chain?.name} (id: ${chain?.id})`,
			from: account?.address,
			to,
			value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
			data,
			gas,
			gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
			maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
			maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
			nonce
		});
		super(cause.shortMessage, {
			cause,
			docsPath,
			metaMessages: [
				...cause.metaMessages ? [...cause.metaMessages, " "] : [],
				"Request Arguments:",
				prettyArgs
			].filter(Boolean),
			name: "TransactionExecutionError"
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.cause = cause;
	}
};
var TransactionNotFoundError = class extends BaseError$3 {
	constructor({ blockHash, blockNumber, blockTag, hash, index }) {
		let identifier = "Transaction";
		if (blockTag && index !== void 0) identifier = `Transaction at block time "${blockTag}" at index "${index}"`;
		if (blockHash && index !== void 0) identifier = `Transaction at block hash "${blockHash}" at index "${index}"`;
		if (blockNumber && index !== void 0) identifier = `Transaction at block number "${blockNumber}" at index "${index}"`;
		if (hash) identifier = `Transaction with hash "${hash}"`;
		super(`${identifier} could not be found.`, { name: "TransactionNotFoundError" });
	}
};
var TransactionReceiptNotFoundError = class extends BaseError$3 {
	constructor({ hash }) {
		super(`Transaction receipt with hash "${hash}" could not be found. The Transaction may not be processed on a block yet.`, { name: "TransactionReceiptNotFoundError" });
	}
};
var WaitForTransactionReceiptTimeoutError = class extends BaseError$3 {
	constructor({ hash }) {
		super(`Timed out while waiting for transaction with hash "${hash}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/contract.js
var CallExecutionError = class extends BaseError$3 {
	constructor(cause, { account: account_, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
		let prettyArgs = prettyPrint({
			from: (account_ ? parseAccount(account_) : void 0)?.address,
			to,
			value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
			data,
			gas,
			gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
			maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
			maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
			nonce
		});
		if (stateOverride) prettyArgs += `\n${prettyStateOverride(stateOverride)}`;
		super(cause.shortMessage, {
			cause,
			docsPath,
			metaMessages: [
				...cause.metaMessages ? [...cause.metaMessages, " "] : [],
				"Raw Call Arguments:",
				prettyArgs
			].filter(Boolean),
			name: "CallExecutionError"
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.cause = cause;
	}
};
var ContractFunctionExecutionError = class extends BaseError$3 {
	constructor(cause, { abi, args, contractAddress, docsPath, functionName, sender }) {
		const abiItem = getAbiItem({
			abi,
			args,
			name: functionName
		});
		const formattedArgs = abiItem ? formatAbiItemWithArgs({
			abiItem,
			args,
			includeFunctionName: false,
			includeName: false
		}) : void 0;
		const functionWithParams = abiItem ? formatAbiItem$1(abiItem, { includeName: true }) : void 0;
		const prettyArgs = prettyPrint({
			address: contractAddress && getContractAddress(contractAddress),
			function: functionWithParams,
			args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
			sender
		});
		super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
			cause,
			docsPath,
			metaMessages: [
				...cause.metaMessages ? [...cause.metaMessages, " "] : [],
				prettyArgs && "Contract Call:",
				prettyArgs
			].filter(Boolean),
			name: "ContractFunctionExecutionError"
		});
		Object.defineProperty(this, "abi", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "args", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "contractAddress", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "formattedArgs", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "functionName", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "sender", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.abi = abi;
		this.args = args;
		this.cause = cause;
		this.contractAddress = contractAddress;
		this.functionName = functionName;
		this.sender = sender;
	}
};
var ContractFunctionRevertedError = class extends BaseError$3 {
	constructor({ abi, data, functionName, message }) {
		let cause;
		let decodedData = void 0;
		let metaMessages;
		let reason;
		if (data && data !== "0x") try {
			decodedData = decodeErrorResult({
				abi,
				data
			});
			const { abiItem, errorName, args: errorArgs } = decodedData;
			if (errorName === "Error") reason = errorArgs[0];
			else if (errorName === "Panic") {
				const [firstArg] = errorArgs;
				reason = panicReasons[firstArg];
			} else {
				const errorWithParams = abiItem ? formatAbiItem$1(abiItem, { includeName: true }) : void 0;
				const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
					abiItem,
					args: errorArgs,
					includeFunctionName: false,
					includeName: false
				}) : void 0;
				metaMessages = [errorWithParams ? `Error: ${errorWithParams}` : "", formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""];
			}
		} catch (err) {
			cause = err;
		}
		else if (message) reason = message;
		let signature;
		if (cause instanceof AbiErrorSignatureNotFoundError) {
			signature = cause.signature;
			metaMessages = [
				`Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
				"Make sure you are using the correct ABI and that the error exists on it.",
				`You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`
			];
		}
		super(reason && reason !== "execution reverted" || signature ? [`The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`, reason || signature].join("\n") : `The contract function "${functionName}" reverted.`, {
			cause,
			metaMessages,
			name: "ContractFunctionRevertedError"
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "raw", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "reason", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "signature", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = decodedData;
		this.raw = data;
		this.reason = reason;
		this.signature = signature;
	}
};
var ContractFunctionZeroDataError = class extends BaseError$3 {
	constructor({ functionName }) {
		super(`The contract function "${functionName}" returned no data ("0x").`, {
			metaMessages: [
				"This could be due to any of the following:",
				`  - The contract does not have the function "${functionName}",`,
				"  - The parameters passed to the contract function may be invalid, or",
				"  - The address is not a contract."
			],
			name: "ContractFunctionZeroDataError"
		});
	}
};
var CounterfactualDeploymentFailedError = class extends BaseError$3 {
	constructor({ factory }) {
		super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
			metaMessages: [
				"Please ensure:",
				"- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
				"- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
			],
			name: "CounterfactualDeploymentFailedError"
		});
	}
};
var RawContractError = class extends BaseError$3 {
	constructor({ data, message }) {
		super(message || "", { name: "RawContractError" });
		Object.defineProperty(this, "code", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 3
		});
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = data;
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/errors/getContractError.js
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi, address, args, docsPath, functionName, sender }) {
	const error = err instanceof RawContractError ? err : err instanceof BaseError$3 ? err.walk((err) => "data" in err) || err.walk() : {};
	const { code, data, details, message, shortMessage } = error;
	return new ContractFunctionExecutionError((() => {
		if (err instanceof AbiDecodingZeroDataError) return new ContractFunctionZeroDataError({ functionName });
		if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage)) return new ContractFunctionRevertedError({
			abi,
			data: typeof data === "object" ? data.data : data,
			functionName,
			message: error instanceof RpcRequestError ? details : shortMessage ?? message
		});
		return err;
	})(), {
		abi,
		args,
		contractAddress: address,
		docsPath,
		functionName,
		sender
	});
}
//#endregion
//#region node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
/**
* @description Converts an ECDSA public key to an address.
*
* @param publicKey The public key to convert.
*
* @returns The address.
*/
function publicKeyToAddress(publicKey) {
	const address = keccak256$1(`0x${publicKey.substring(4)}`).substring(26);
	return checksumAddress(`0x${address}`);
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey({ hash, signature }) {
	const hashHex = isHex(hash) ? hash : toHex(hash);
	const { secp256k1 } = await import("../noble__curves+noble__hashes.mjs").then((n) => (n.t(), n.r));
	return `0x${(() => {
		if (typeof signature === "object" && "r" in signature && "s" in signature) {
			const { r, s, v, yParity } = signature;
			const recoveryBit = toRecoveryBit(Number(yParity ?? v));
			return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
		}
		const signatureHex = isHex(signature) ? signature : toHex(signature);
		const recoveryBit = toRecoveryBit(hexToNumber(`0x${signatureHex.slice(130)}`));
		return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
	})().recoverPublicKey(hashHex.substring(2)).toHex(false)}`;
}
function toRecoveryBit(yParityOrV) {
	if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
	if (yParityOrV === 27) return 0;
	if (yParityOrV === 28) return 1;
	throw new Error("Invalid yParityOrV value");
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash, signature }) {
	return publicKeyToAddress(await recoverPublicKey({
		hash,
		signature
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toRlp.js
function toRlp(bytes, to = "hex") {
	const encodable = getEncodable(bytes);
	const cursor = createCursor(new Uint8Array(encodable.length));
	encodable.encode(cursor);
	if (to === "hex") return bytesToHex(cursor.bytes);
	return cursor.bytes;
}
function getEncodable(bytes) {
	if (Array.isArray(bytes)) return getEncodableList(bytes.map((x) => getEncodable(x)));
	return getEncodableBytes(bytes);
}
function getEncodableList(list) {
	const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
	const sizeOfBodyLength = getSizeOfLength(bodyLength);
	return {
		length: (() => {
			if (bodyLength <= 55) return 1 + bodyLength;
			return 1 + sizeOfBodyLength + bodyLength;
		})(),
		encode(cursor) {
			if (bodyLength <= 55) cursor.pushByte(192 + bodyLength);
			else {
				cursor.pushByte(247 + sizeOfBodyLength);
				if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);
				else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);
				else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);
				else cursor.pushUint32(bodyLength);
			}
			for (const { encode } of list) encode(cursor);
		}
	};
}
function getEncodableBytes(bytesOrHex) {
	const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
	const sizeOfBytesLength = getSizeOfLength(bytes.length);
	return {
		length: (() => {
			if (bytes.length === 1 && bytes[0] < 128) return 1;
			if (bytes.length <= 55) return 1 + bytes.length;
			return 1 + sizeOfBytesLength + bytes.length;
		})(),
		encode(cursor) {
			if (bytes.length === 1 && bytes[0] < 128) cursor.pushBytes(bytes);
			else if (bytes.length <= 55) {
				cursor.pushByte(128 + bytes.length);
				cursor.pushBytes(bytes);
			} else {
				cursor.pushByte(183 + sizeOfBytesLength);
				if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);
				else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);
				else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);
				else cursor.pushUint32(bytes.length);
				cursor.pushBytes(bytes);
			}
		}
	};
}
function getSizeOfLength(length) {
	if (length < 256) return 1;
	if (length < 2 ** 16) return 2;
	if (length < 2 ** 24) return 3;
	if (length < 2 ** 32) return 4;
	throw new BaseError$3("Length is too large.");
}
//#endregion
//#region node_modules/viem/_esm/experimental/eip7702/utils/hashAuthorization.js
/**
* Computes an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
*/
function hashAuthorization(parameters) {
	const { chainId, contractAddress, nonce, to } = parameters;
	const hash = keccak256$1(concatHex(["0x05", toRlp([
		chainId ? numberToHex(chainId) : "0x",
		contractAddress,
		nonce ? numberToHex(nonce) : "0x"
	])]));
	if (to === "bytes") return hexToBytes(hash);
	return hash;
}
//#endregion
//#region node_modules/viem/_esm/experimental/eip7702/utils/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
	const { authorization, signature } = parameters;
	return recoverAddress({
		hash: hashAuthorization(authorization),
		signature: signature ?? authorization
	});
}
//#endregion
//#region node_modules/viem/_esm/errors/estimateGas.js
var EstimateGasExecutionError = class extends BaseError$3 {
	constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
		const prettyArgs = prettyPrint({
			from: account?.address,
			to,
			value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
			data,
			gas,
			gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
			maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
			maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
			nonce
		});
		super(cause.shortMessage, {
			cause,
			docsPath,
			metaMessages: [
				...cause.metaMessages ? [...cause.metaMessages, " "] : [],
				"Estimate Gas Arguments:",
				prettyArgs
			].filter(Boolean),
			name: "EstimateGasExecutionError"
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError = class extends BaseError$3 {
	constructor({ cause, message } = {}) {
		const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
		super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
			cause,
			name: "ExecutionRevertedError"
		});
	}
};
Object.defineProperty(ExecutionRevertedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 3
});
Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /execution reverted/
});
var FeeCapTooHighError = class extends BaseError$3 {
	constructor({ cause, maxFeePerGas } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
			cause,
			name: "FeeCapTooHighError"
		});
	}
};
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
var FeeCapTooLowError = class extends BaseError$3 {
	constructor({ cause, maxFeePerGas } = {}) {
		super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
			cause,
			name: "FeeCapTooLowError"
		});
	}
};
Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
var NonceTooHighError = class extends BaseError$3 {
	constructor({ cause, nonce } = {}) {
		super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, {
			cause,
			name: "NonceTooHighError"
		});
	}
};
Object.defineProperty(NonceTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too high/
});
var NonceTooLowError = class extends BaseError$3 {
	constructor({ cause, nonce } = {}) {
		super([`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`, "Try increasing the nonce or find the latest nonce with `getTransactionCount`."].join("\n"), {
			cause,
			name: "NonceTooLowError"
		});
	}
};
Object.defineProperty(NonceTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too low|transaction already imported|already known/
});
var NonceMaxValueError = class extends BaseError$3 {
	constructor({ cause, nonce } = {}) {
		super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, {
			cause,
			name: "NonceMaxValueError"
		});
	}
};
Object.defineProperty(NonceMaxValueError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce has max value/
});
var InsufficientFundsError = class extends BaseError$3 {
	constructor({ cause } = {}) {
		super(["The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."].join("\n"), {
			cause,
			metaMessages: [
				"This error could arise when the account does not have enough funds to:",
				" - pay for the total gas fee,",
				" - pay for the value to send.",
				" ",
				"The cost of the transaction is calculated as `gas * gas fee + value`, where:",
				" - `gas` is the amount of gas needed for transaction to execute,",
				" - `gas fee` is the gas fee,",
				" - `value` is the amount of ether to send to the recipient."
			],
			name: "InsufficientFundsError"
		});
	}
};
Object.defineProperty(InsufficientFundsError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /insufficient funds|exceeds transaction sender account balance/
});
var IntrinsicGasTooHighError = class extends BaseError$3 {
	constructor({ cause, gas } = {}) {
		super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
			cause,
			name: "IntrinsicGasTooHighError"
		});
	}
};
Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too high|gas limit reached/
});
var IntrinsicGasTooLowError = class extends BaseError$3 {
	constructor({ cause, gas } = {}) {
		super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
			cause,
			name: "IntrinsicGasTooLowError"
		});
	}
};
Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too low/
});
var TransactionTypeNotSupportedError = class extends BaseError$3 {
	constructor({ cause }) {
		super("The transaction type is not supported for this chain.", {
			cause,
			name: "TransactionTypeNotSupportedError"
		});
	}
};
Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /transaction type not valid/
});
var TipAboveFeeCapError = class extends BaseError$3 {
	constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
		super([`The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`].join("\n"), {
			cause,
			name: "TipAboveFeeCapError"
		});
	}
};
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
var UnknownNodeError = class extends BaseError$3 {
	constructor({ cause }) {
		super(`An error occurred while executing: ${cause?.shortMessage}`, {
			cause,
			name: "UnknownNodeError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
	const message = (err.details || "").toLowerCase();
	const executionRevertedError = err instanceof BaseError$3 ? err.walk((e) => e?.code === ExecutionRevertedError.code) : err;
	if (executionRevertedError instanceof BaseError$3) return new ExecutionRevertedError({
		cause: err,
		message: executionRevertedError.details
	});
	if (ExecutionRevertedError.nodeMessage.test(message)) return new ExecutionRevertedError({
		cause: err,
		message: err.details
	});
	if (FeeCapTooHighError.nodeMessage.test(message)) return new FeeCapTooHighError({
		cause: err,
		maxFeePerGas: args?.maxFeePerGas
	});
	if (FeeCapTooLowError.nodeMessage.test(message)) return new FeeCapTooLowError({
		cause: err,
		maxFeePerGas: args?.maxFeePerGas
	});
	if (NonceTooHighError.nodeMessage.test(message)) return new NonceTooHighError({
		cause: err,
		nonce: args?.nonce
	});
	if (NonceTooLowError.nodeMessage.test(message)) return new NonceTooLowError({
		cause: err,
		nonce: args?.nonce
	});
	if (NonceMaxValueError.nodeMessage.test(message)) return new NonceMaxValueError({
		cause: err,
		nonce: args?.nonce
	});
	if (InsufficientFundsError.nodeMessage.test(message)) return new InsufficientFundsError({ cause: err });
	if (IntrinsicGasTooHighError.nodeMessage.test(message)) return new IntrinsicGasTooHighError({
		cause: err,
		gas: args?.gas
	});
	if (IntrinsicGasTooLowError.nodeMessage.test(message)) return new IntrinsicGasTooLowError({
		cause: err,
		gas: args?.gas
	});
	if (TransactionTypeNotSupportedError.nodeMessage.test(message)) return new TransactionTypeNotSupportedError({ cause: err });
	if (TipAboveFeeCapError.nodeMessage.test(message)) return new TipAboveFeeCapError({
		cause: err,
		maxFeePerGas: args?.maxFeePerGas,
		maxPriorityFeePerGas: args?.maxPriorityFeePerGas
	});
	return new UnknownNodeError({ cause: err });
}
//#endregion
//#region node_modules/viem/_esm/utils/errors/getEstimateGasError.js
function getEstimateGasError(err, { docsPath, ...args }) {
	return new EstimateGasExecutionError((() => {
		const cause = getNodeError(err, args);
		if (cause instanceof UnknownNodeError) return err;
		return cause;
	})(), {
		docsPath,
		...args
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/extract.js
/**
* @description Picks out the keys from `value` that exist in the formatter..
*/
function extract(value_, { format }) {
	if (!format) return {};
	const value = {};
	function extract_(formatted) {
		const keys = Object.keys(formatted);
		for (const key of keys) {
			if (key in value_) value[key] = value_[key];
			if (formatted[key] && typeof formatted[key] === "object" && !Array.isArray(formatted[key])) extract_(formatted[key]);
		}
	}
	extract_(format(value_ || {}));
	return value;
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/transactionRequest.js
var rpcTransactionType = {
	legacy: "0x0",
	eip2930: "0x1",
	eip1559: "0x2",
	eip4844: "0x3",
	eip7702: "0x4"
};
function formatTransactionRequest(request) {
	const rpcRequest = {};
	if (typeof request.authorizationList !== "undefined") rpcRequest.authorizationList = formatAuthorizationList$1(request.authorizationList);
	if (typeof request.accessList !== "undefined") rpcRequest.accessList = request.accessList;
	if (typeof request.blobVersionedHashes !== "undefined") rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
	if (typeof request.blobs !== "undefined") {
		if (typeof request.blobs[0] !== "string") rpcRequest.blobs = request.blobs.map((x) => bytesToHex(x));
		else rpcRequest.blobs = request.blobs;
	}
	if (typeof request.data !== "undefined") rpcRequest.data = request.data;
	if (typeof request.from !== "undefined") rpcRequest.from = request.from;
	if (typeof request.gas !== "undefined") rpcRequest.gas = numberToHex(request.gas);
	if (typeof request.gasPrice !== "undefined") rpcRequest.gasPrice = numberToHex(request.gasPrice);
	if (typeof request.maxFeePerBlobGas !== "undefined") rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
	if (typeof request.maxFeePerGas !== "undefined") rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
	if (typeof request.maxPriorityFeePerGas !== "undefined") rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
	if (typeof request.nonce !== "undefined") rpcRequest.nonce = numberToHex(request.nonce);
	if (typeof request.to !== "undefined") rpcRequest.to = request.to;
	if (typeof request.type !== "undefined") rpcRequest.type = rpcTransactionType[request.type];
	if (typeof request.value !== "undefined") rpcRequest.value = numberToHex(request.value);
	return rpcRequest;
}
function formatAuthorizationList$1(authorizationList) {
	return authorizationList.map((authorization) => ({
		address: authorization.contractAddress,
		r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
		s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
		chainId: numberToHex(authorization.chainId),
		nonce: numberToHex(authorization.nonce),
		...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
		...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/stateOverride.js
/** @internal */
function serializeStateMapping(stateMapping) {
	if (!stateMapping || stateMapping.length === 0) return void 0;
	return stateMapping.reduce((acc, { slot, value }) => {
		if (slot.length !== 66) throw new InvalidBytesLengthError({
			size: slot.length,
			targetSize: 66,
			type: "hex"
		});
		if (value.length !== 66) throw new InvalidBytesLengthError({
			size: value.length,
			targetSize: 66,
			type: "hex"
		});
		acc[slot] = value;
		return acc;
	}, {});
}
/** @internal */
function serializeAccountStateOverride(parameters) {
	const { balance, nonce, state, stateDiff, code } = parameters;
	const rpcAccountStateOverride = {};
	if (code !== void 0) rpcAccountStateOverride.code = code;
	if (balance !== void 0) rpcAccountStateOverride.balance = numberToHex(balance);
	if (nonce !== void 0) rpcAccountStateOverride.nonce = numberToHex(nonce);
	if (state !== void 0) rpcAccountStateOverride.state = serializeStateMapping(state);
	if (stateDiff !== void 0) {
		if (rpcAccountStateOverride.state) throw new StateAssignmentConflictError();
		rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
	}
	return rpcAccountStateOverride;
}
/** @internal */
function serializeStateOverride(parameters) {
	if (!parameters) return void 0;
	const rpcStateOverride = {};
	for (const { address, ...accountState } of parameters) {
		if (!isAddress(address, { strict: false })) throw new InvalidAddressError$1({ address });
		if (rpcStateOverride[address]) throw new AccountStateConflictError({ address });
		rpcStateOverride[address] = serializeAccountStateOverride(accountState);
	}
	return rpcStateOverride;
}
2n ** (8n - 1n) - 1n;
2n ** (16n - 1n) - 1n;
2n ** (24n - 1n) - 1n;
2n ** (32n - 1n) - 1n;
2n ** (40n - 1n) - 1n;
2n ** (48n - 1n) - 1n;
2n ** (56n - 1n) - 1n;
2n ** (64n - 1n) - 1n;
2n ** (72n - 1n) - 1n;
2n ** (80n - 1n) - 1n;
2n ** (88n - 1n) - 1n;
2n ** (96n - 1n) - 1n;
2n ** (104n - 1n) - 1n;
2n ** (112n - 1n) - 1n;
2n ** (120n - 1n) - 1n;
2n ** (128n - 1n) - 1n;
2n ** (136n - 1n) - 1n;
2n ** (144n - 1n) - 1n;
2n ** (152n - 1n) - 1n;
2n ** (160n - 1n) - 1n;
2n ** (168n - 1n) - 1n;
2n ** (176n - 1n) - 1n;
2n ** (184n - 1n) - 1n;
2n ** (192n - 1n) - 1n;
2n ** (200n - 1n) - 1n;
2n ** (208n - 1n) - 1n;
2n ** (216n - 1n) - 1n;
2n ** (224n - 1n) - 1n;
2n ** (232n - 1n) - 1n;
2n ** (240n - 1n) - 1n;
2n ** (248n - 1n) - 1n;
2n ** (256n - 1n) - 1n;
-(2n ** (8n - 1n));
-(2n ** (16n - 1n));
-(2n ** (24n - 1n));
-(2n ** (32n - 1n));
-(2n ** (40n - 1n));
-(2n ** (48n - 1n));
-(2n ** (56n - 1n));
-(2n ** (64n - 1n));
-(2n ** (72n - 1n));
-(2n ** (80n - 1n));
-(2n ** (88n - 1n));
-(2n ** (96n - 1n));
-(2n ** (104n - 1n));
-(2n ** (112n - 1n));
-(2n ** (120n - 1n));
-(2n ** (128n - 1n));
-(2n ** (136n - 1n));
-(2n ** (144n - 1n));
-(2n ** (152n - 1n));
-(2n ** (160n - 1n));
-(2n ** (168n - 1n));
-(2n ** (176n - 1n));
-(2n ** (184n - 1n));
-(2n ** (192n - 1n));
-(2n ** (200n - 1n));
-(2n ** (208n - 1n));
-(2n ** (216n - 1n));
-(2n ** (224n - 1n));
-(2n ** (232n - 1n));
-(2n ** (240n - 1n));
-(2n ** (248n - 1n));
-(2n ** (256n - 1n));
var maxUint256 = 2n ** 256n - 1n;
//#endregion
//#region node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
	const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to } = args;
	const account = account_ ? parseAccount(account_) : void 0;
	if (account && !isAddress(account.address)) throw new InvalidAddressError$1({ address: account.address });
	if (to && !isAddress(to)) throw new InvalidAddressError$1({ address: to });
	if (typeof gasPrice !== "undefined" && (typeof maxFeePerGas !== "undefined" || typeof maxPriorityFeePerGas !== "undefined")) throw new FeeConflictError();
	if (maxFeePerGas && maxFeePerGas > maxUint256) throw new FeeCapTooHighError({ maxFeePerGas });
	if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas) throw new TipAboveFeeCapError({
		maxFeePerGas,
		maxPriorityFeePerGas
	});
}
//#endregion
//#region node_modules/viem/_esm/errors/fee.js
var BaseFeeScalarError = class extends BaseError$3 {
	constructor() {
		super("`baseFeeMultiplier` must be greater than 1.", { name: "BaseFeeScalarError" });
	}
};
var Eip1559FeesNotSupportedError = class extends BaseError$3 {
	constructor() {
		super("Chain does not support EIP-1559 fees.", { name: "Eip1559FeesNotSupportedError" });
	}
};
var MaxFeePerGasTooLowError = class extends BaseError$3 {
	constructor({ maxPriorityFeePerGas }) {
		super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/block.js
var BlockNotFoundError = class extends BaseError$3 {
	constructor({ blockHash, blockNumber }) {
		let identifier = "Block";
		if (blockHash) identifier = `Block at hash "${blockHash}"`;
		if (blockNumber) identifier = `Block at number "${blockNumber}"`;
		super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/formatters/transaction.js
var transactionType = {
	"0x0": "legacy",
	"0x1": "eip2930",
	"0x2": "eip1559",
	"0x3": "eip4844",
	"0x4": "eip7702"
};
function formatTransaction(transaction) {
	const transaction_ = {
		...transaction,
		blockHash: transaction.blockHash ? transaction.blockHash : null,
		blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
		chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
		gas: transaction.gas ? BigInt(transaction.gas) : void 0,
		gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
		maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
		maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
		maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
		nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
		to: transaction.to ? transaction.to : null,
		transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
		type: transaction.type ? transactionType[transaction.type] : void 0,
		typeHex: transaction.type ? transaction.type : void 0,
		value: transaction.value ? BigInt(transaction.value) : void 0,
		v: transaction.v ? BigInt(transaction.v) : void 0
	};
	if (transaction.authorizationList) transaction_.authorizationList = formatAuthorizationList(transaction.authorizationList);
	transaction_.yParity = (() => {
		if (transaction.yParity) return Number(transaction.yParity);
		if (typeof transaction_.v === "bigint") {
			if (transaction_.v === 0n || transaction_.v === 27n) return 0;
			if (transaction_.v === 1n || transaction_.v === 28n) return 1;
			if (transaction_.v >= 35n) return transaction_.v % 2n === 0n ? 1 : 0;
		}
	})();
	if (transaction_.type === "legacy") {
		delete transaction_.accessList;
		delete transaction_.maxFeePerBlobGas;
		delete transaction_.maxFeePerGas;
		delete transaction_.maxPriorityFeePerGas;
		delete transaction_.yParity;
	}
	if (transaction_.type === "eip2930") {
		delete transaction_.maxFeePerBlobGas;
		delete transaction_.maxFeePerGas;
		delete transaction_.maxPriorityFeePerGas;
	}
	if (transaction_.type === "eip1559") delete transaction_.maxFeePerBlobGas;
	return transaction_;
}
function formatAuthorizationList(authorizationList) {
	return authorizationList.map((authorization) => ({
		contractAddress: authorization.address,
		chainId: Number(authorization.chainId),
		nonce: Number(authorization.nonce),
		r: authorization.r,
		s: authorization.s,
		yParity: Number(authorization.yParity)
	}));
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block) {
	const transactions = (block.transactions ?? []).map((transaction) => {
		if (typeof transaction === "string") return transaction;
		return formatTransaction(transaction);
	});
	return {
		...block,
		baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
		blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
		difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
		excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
		gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
		gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
		hash: block.hash ? block.hash : null,
		logsBloom: block.logsBloom ? block.logsBloom : null,
		nonce: block.nonce ? block.nonce : null,
		number: block.number ? BigInt(block.number) : null,
		size: block.size ? BigInt(block.size) : void 0,
		timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
		transactions,
		totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getBlock.js
/**
* Returns information about a block at a block number, hash, or tag.
*
* - Docs: https://viem.sh/docs/actions/public/getBlock
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
* - JSON-RPC Methods:
*   - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
*   - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.
*
* @param client - Client to use
* @param parameters - {@link GetBlockParameters}
* @returns Information about the block. {@link GetBlockReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBlock } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const block = await getBlock(client)
*/
async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_ } = {}) {
	const blockTag = blockTag_ ?? "latest";
	const includeTransactions = includeTransactions_ ?? false;
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	let block = null;
	if (blockHash) block = await client.request({
		method: "eth_getBlockByHash",
		params: [blockHash, includeTransactions]
	}, { dedupe: true });
	else block = await client.request({
		method: "eth_getBlockByNumber",
		params: [blockNumberHex || blockTag, includeTransactions]
	}, { dedupe: Boolean(blockNumberHex) });
	if (!block) throw new BlockNotFoundError({
		blockHash,
		blockNumber
	});
	return (client.chain?.formatters?.block?.format || formatBlock)(block);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getGasPrice.js
/**
* Returns the current price of gas (in wei).
*
* - Docs: https://viem.sh/docs/actions/public/getGasPrice
* - JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
*
* @param client - Client to use
* @returns The gas price (in wei). {@link GetGasPriceReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getGasPrice } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const gasPrice = await getGasPrice(client)
*/
async function getGasPrice(client) {
	const gasPrice = await client.request({ method: "eth_gasPrice" });
	return BigInt(gasPrice);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
/**
* Returns an estimate for the max priority fee per gas (in wei) for a
* transaction to be likely included in the next block.
* Defaults to [`chain.fees.defaultPriorityFee`](/docs/clients/chains#fees-defaultpriorityfee) if set.
*
* - Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas
*
* @param client - Client to use
* @returns An estimate (in wei) for the max priority fee per gas. {@link EstimateMaxPriorityFeePerGasReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateMaxPriorityFeePerGas } from 'viem/actions'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const maxPriorityFeePerGas = await estimateMaxPriorityFeePerGas(client)
* // 10000000n
*/
async function estimateMaxPriorityFeePerGas(client, args) {
	return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
	const { block: block_, chain = client.chain, request } = args || {};
	try {
		const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
		if (typeof maxPriorityFeePerGas === "function") {
			const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
				block: block_ || await getAction$1(client, getBlock, "getBlock")({}),
				client,
				request
			});
			if (maxPriorityFeePerGas_ === null) throw new Error();
			return maxPriorityFeePerGas_;
		}
		if (typeof maxPriorityFeePerGas !== "undefined") return maxPriorityFeePerGas;
		const maxPriorityFeePerGasHex = await client.request({ method: "eth_maxPriorityFeePerGas" });
		return hexToBigInt(maxPriorityFeePerGasHex);
	} catch {
		const [block, gasPrice] = await Promise.all([block_ ? Promise.resolve(block_) : getAction$1(client, getBlock, "getBlock")({}), getAction$1(client, getGasPrice, "getGasPrice")({})]);
		if (typeof block.baseFeePerGas !== "bigint") throw new Eip1559FeesNotSupportedError();
		const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
		if (maxPriorityFeePerGas < 0n) return 0n;
		return maxPriorityFeePerGas;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
/**
* Returns an estimate for the fees per gas (in wei) for a
* transaction to be likely included in the next block.
* Defaults to [`chain.fees.estimateFeesPerGas`](/docs/clients/chains#fees-estimatefeespergas) if set.
*
* - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas
*
* @param client - Client to use
* @param parameters - {@link EstimateFeesPerGasParameters}
* @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateFeesPerGas } from 'viem/actions'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const maxPriorityFeePerGas = await estimateFeesPerGas(client)
* // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
*/
async function estimateFeesPerGas(client, args) {
	return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
	const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
	const baseFeeMultiplier = await (async () => {
		if (typeof chain?.fees?.baseFeeMultiplier === "function") return chain.fees.baseFeeMultiplier({
			block: block_,
			client,
			request
		});
		return chain?.fees?.baseFeeMultiplier ?? 1.2;
	})();
	if (baseFeeMultiplier < 1) throw new BaseFeeScalarError();
	const denominator = 10 ** (baseFeeMultiplier.toString().split(".")[1]?.length ?? 0);
	const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
	const block = block_ ? block_ : await getAction$1(client, getBlock, "getBlock")({});
	if (typeof chain?.fees?.estimateFeesPerGas === "function") {
		const fees = await chain.fees.estimateFeesPerGas({
			block: block_,
			client,
			multiply,
			request,
			type
		});
		if (fees !== null) return fees;
	}
	if (type === "eip1559") {
		if (typeof block.baseFeePerGas !== "bigint") throw new Eip1559FeesNotSupportedError();
		const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
			block,
			chain,
			request
		});
		const baseFeePerGas = multiply(block.baseFeePerGas);
		return {
			maxFeePerGas: request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas,
			maxPriorityFeePerGas
		};
	}
	return { gasPrice: request?.gasPrice ?? multiply(await getAction$1(client, getGasPrice, "getGasPrice")({})) };
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getTransactionCount.js
/**
* Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has sent.
*
* - Docs: https://viem.sh/docs/actions/public/getTransactionCount
* - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
*
* @param client - Client to use
* @param parameters - {@link GetTransactionCountParameters}
* @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getTransactionCount } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const transactionCount = await getTransactionCount(client, {
*   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
* })
*/
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
	const count = await client.request({
		method: "eth_getTransactionCount",
		params: [address, blockNumber ? numberToHex(blockNumber) : blockTag]
	}, { dedupe: Boolean(blockNumber) });
	return hexToNumber(count);
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/blobsToCommitments.js
/**
* Compute commitments from a list of blobs.
*
* @example
* ```ts
* import { blobsToCommitments, toBlobs } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* ```
*/
function blobsToCommitments(parameters) {
	const { kzg } = parameters;
	const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
	const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
	const commitments = [];
	for (const blob of blobs) commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
	return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/blobsToProofs.js
/**
* Compute the proofs for a list of blobs and their commitments.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* const proofs = blobsToProofs({ blobs, commitments, kzg })
* ```
*/
function blobsToProofs(parameters) {
	const { kzg } = parameters;
	const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
	const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
	const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
	const proofs = [];
	for (let i = 0; i < blobs.length; i++) {
		const blob = blobs[i];
		const commitment = commitments[i];
		proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
	}
	return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/sha256.js
function sha256(value, to_) {
	const to = to_ || "hex";
	const bytes = sha256$1(isHex(value, { strict: false }) ? toBytes(value) : value);
	if (to === "bytes") return bytes;
	return toHex(bytes);
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
/**
* Transform a commitment to it's versioned hash.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   commitmentToVersionedHash,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const [commitment] = blobsToCommitments({ blobs, kzg })
* const versionedHash = commitmentToVersionedHash({ commitment })
* ```
*/
function commitmentToVersionedHash(parameters) {
	const { commitment, version = 1 } = parameters;
	const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
	const versionedHash = sha256(commitment, "bytes");
	versionedHash.set([version], 0);
	return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
/**
* Transform a list of commitments to their versioned hashes.
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   commitmentsToVersionedHashes,
*   toBlobs
* } from 'viem'
* import { kzg } from './kzg'
*
* const blobs = toBlobs({ data: '0x1234' })
* const commitments = blobsToCommitments({ blobs, kzg })
* const versionedHashes = commitmentsToVersionedHashes({ commitments })
* ```
*/
function commitmentsToVersionedHashes(parameters) {
	const { commitments, version } = parameters;
	const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
	const hashes = [];
	for (const commitment of commitments) hashes.push(commitmentToVersionedHash({
		commitment,
		to,
		version
	}));
	return hashes;
}
//#endregion
//#region node_modules/viem/_esm/constants/blob.js
/** Blob limit per transaction. */
var blobsPerTransaction = 6;
/** The number of field elements in a blob. */
var fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
var bytesPerBlob = 32 * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - 1 - 1 * fieldElementsPerBlob * blobsPerTransaction;
//#endregion
//#region node_modules/viem/_esm/errors/blob.js
var BlobSizeTooLargeError = class extends BaseError$3 {
	constructor({ maxSize, size }) {
		super("Blob size is too large.", {
			metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
			name: "BlobSizeTooLargeError"
		});
	}
};
var EmptyBlobError = class extends BaseError$3 {
	constructor() {
		super("Blob data must not be empty.", { name: "EmptyBlobError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/blob/toBlobs.js
/**
* Transforms arbitrary data to blobs.
*
* @example
* ```ts
* import { toBlobs, stringToHex } from 'viem'
*
* const blobs = toBlobs({ data: stringToHex('hello world') })
* ```
*/
function toBlobs(parameters) {
	const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
	const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
	const size_ = size$4(data);
	if (!size_) throw new EmptyBlobError();
	if (size_ > 761855) throw new BlobSizeTooLargeError({
		maxSize: maxBytesPerTransaction,
		size: size_
	});
	const blobs = [];
	let active = true;
	let position = 0;
	while (active) {
		const blob = createCursor(new Uint8Array(bytesPerBlob));
		let size = 0;
		while (size < fieldElementsPerBlob) {
			const bytes = data.slice(position, position + 31);
			blob.pushByte(0);
			blob.pushBytes(bytes);
			if (bytes.length < 31) {
				blob.pushByte(128);
				active = false;
				break;
			}
			size++;
			position += 31;
		}
		blobs.push(blob);
	}
	return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}
//#endregion
//#region node_modules/viem/_esm/utils/blob/toBlobSidecars.js
/**
* Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
*
* @example
* ```ts
* import { toBlobSidecars, stringToHex } from 'viem'
*
* const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
* ```
*
* @example
* ```ts
* import {
*   blobsToCommitments,
*   toBlobs,
*   blobsToProofs,
*   toBlobSidecars,
*   stringToHex
* } from 'viem'
*
* const blobs = toBlobs({ data: stringToHex('hello world') })
* const commitments = blobsToCommitments({ blobs, kzg })
* const proofs = blobsToProofs({ blobs, commitments, kzg })
*
* const sidecars = toBlobSidecars({ blobs, commitments, proofs })
* ```
*/
function toBlobSidecars(parameters) {
	const { data, kzg, to } = parameters;
	const blobs = parameters.blobs ?? toBlobs({
		data,
		to
	});
	const commitments = parameters.commitments ?? blobsToCommitments({
		blobs,
		kzg,
		to
	});
	const proofs = parameters.proofs ?? blobsToProofs({
		blobs,
		commitments,
		kzg,
		to
	});
	const sidecars = [];
	for (let i = 0; i < blobs.length; i++) sidecars.push({
		blob: blobs[i],
		commitment: commitments[i],
		proof: proofs[i]
	});
	return sidecars;
}
//#endregion
//#region node_modules/viem/_esm/utils/transaction/getTransactionType.js
function getTransactionType(transaction) {
	if (transaction.type) return transaction.type;
	if (typeof transaction.authorizationList !== "undefined") return "eip7702";
	if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined") return "eip4844";
	if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") return "eip1559";
	if (typeof transaction.gasPrice !== "undefined") {
		if (typeof transaction.accessList !== "undefined") return "eip2930";
		return "legacy";
	}
	throw new InvalidSerializableTransactionError({ transaction });
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getChainId.js
/**
* Returns the chain ID associated with the current network.
*
* - Docs: https://viem.sh/docs/actions/public/getChainId
* - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)
*
* @param client - Client to use
* @returns The current chain ID. {@link GetChainIdReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getChainId } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const chainId = await getChainId(client)
* // 1
*/
async function getChainId$1(client) {
	const chainIdHex = await client.request({ method: "eth_chainId" }, { dedupe: true });
	return hexToNumber(chainIdHex);
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
	"blobVersionedHashes",
	"chainId",
	"fees",
	"gas",
	"nonce",
	"type"
];
/** @internal */
var eip1559NetworkCache = /*#__PURE__*/ new Map();
/**
* Prepares a transaction request for signing.
*
* - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
*
* @param args - {@link PrepareTransactionRequestParameters}
* @returns The transaction request. {@link PrepareTransactionRequestReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { prepareTransactionRequest } from 'viem/actions'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const request = await prepareTransactionRequest(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x0000000000000000000000000000000000000000',
*   value: 1n,
* })
*
* @example
* // Account Hoisting
* import { createWalletClient, http } from 'viem'
* import { privateKeyToAccount } from 'viem/accounts'
* import { mainnet } from 'viem/chains'
* import { prepareTransactionRequest } from 'viem/actions'
*
* const client = createWalletClient({
*   account: privateKeyToAccount('0x…'),
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const request = await prepareTransactionRequest(client, {
*   to: '0x0000000000000000000000000000000000000000',
*   value: 1n,
* })
*/
async function prepareTransactionRequest(client, args) {
	const { account: account_ = client.account, blobs, chain, gas, kzg, nonce, nonceManager, parameters = defaultParameters, type } = args;
	const account = account_ ? parseAccount(account_) : account_;
	const request = {
		...args,
		...account ? { from: account?.address } : {}
	};
	let block;
	async function getBlock$1() {
		if (block) return block;
		block = await getAction$1(client, getBlock, "getBlock")({ blockTag: "latest" });
		return block;
	}
	let chainId;
	async function getChainId() {
		if (chainId) return chainId;
		if (chain) return chain.id;
		if (typeof args.chainId !== "undefined") return args.chainId;
		chainId = await getAction$1(client, getChainId$1, "getChainId")({});
		return chainId;
	}
	if (parameters.includes("nonce") && typeof nonce === "undefined" && account) {
		if (nonceManager) {
			const chainId = await getChainId();
			request.nonce = await nonceManager.consume({
				address: account.address,
				chainId,
				client
			});
		} else request.nonce = await getAction$1(client, getTransactionCount, "getTransactionCount")({
			address: account.address,
			blockTag: "pending"
		});
	}
	if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
		const commitments = blobsToCommitments({
			blobs,
			kzg
		});
		if (parameters.includes("blobVersionedHashes")) request.blobVersionedHashes = commitmentsToVersionedHashes({
			commitments,
			to: "hex"
		});
		if (parameters.includes("sidecars")) request.sidecars = toBlobSidecars({
			blobs,
			commitments,
			proofs: blobsToProofs({
				blobs,
				commitments,
				kzg
			}),
			to: "hex"
		});
	}
	if (parameters.includes("chainId")) request.chainId = await getChainId();
	if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") try {
		request.type = getTransactionType(request);
	} catch {
		let isEip1559Network = eip1559NetworkCache.get(client.uid);
		if (typeof isEip1559Network === "undefined") {
			isEip1559Network = typeof (await getBlock$1())?.baseFeePerGas === "bigint";
			eip1559NetworkCache.set(client.uid, isEip1559Network);
		}
		request.type = isEip1559Network ? "eip1559" : "legacy";
	}
	if (parameters.includes("fees")) {
		if (request.type !== "legacy" && request.type !== "eip2930") {
			if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
				const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
					block: await getBlock$1(),
					chain,
					request
				});
				if (typeof args.maxPriorityFeePerGas === "undefined" && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas) throw new MaxFeePerGasTooLowError({ maxPriorityFeePerGas });
				request.maxPriorityFeePerGas = maxPriorityFeePerGas;
				request.maxFeePerGas = maxFeePerGas;
			}
		} else {
			if (typeof args.maxFeePerGas !== "undefined" || typeof args.maxPriorityFeePerGas !== "undefined") throw new Eip1559FeesNotSupportedError();
			if (typeof args.gasPrice === "undefined") {
				const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
					block: await getBlock$1(),
					chain,
					request,
					type: "legacy"
				});
				request.gasPrice = gasPrice_;
			}
		}
	}
	if (parameters.includes("gas") && typeof gas === "undefined") request.gas = await getAction$1(client, estimateGas, "estimateGas")({
		...request,
		account: account ? {
			address: account.address,
			type: "json-rpc"
		} : account
	});
	assertRequest(request);
	delete request.parameters;
	return request;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getBalance.js
/**
* Returns the balance of an address in wei.
*
* - Docs: https://viem.sh/docs/actions/public/getBalance
* - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)
*
* You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
*
* ```ts
* const balance = await getBalance(client, {
*   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   blockTag: 'safe'
* })
* const balanceAsEther = formatEther(balance)
* // "6.942"
* ```
*
* @param client - Client to use
* @param parameters - {@link GetBalanceParameters}
* @returns The balance of the address in wei. {@link GetBalanceReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBalance } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const balance = await getBalance(client, {
*   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
* })
* // 10000000000000000000000n (wei)
*/
async function getBalance(client, { address, blockNumber, blockTag = "latest" }) {
	const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
	const balance = await client.request({
		method: "eth_getBalance",
		params: [address, blockNumberHex || blockTag]
	});
	return BigInt(balance);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateGas.js
/**
* Estimates the gas necessary to complete a transaction without submitting it to the network.
*
* - Docs: https://viem.sh/docs/actions/public/estimateGas
* - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)
*
* @param client - Client to use
* @param parameters - {@link EstimateGasParameters}
* @returns The gas estimate (in wei). {@link EstimateGasReturnType}
*
* @example
* import { createPublicClient, http, parseEther } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateGas } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const gasEstimate = await estimateGas(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: parseEther('1'),
* })
*/
async function estimateGas(client, args) {
	const { account: account_ = client.account } = args;
	const account = account_ ? parseAccount(account_) : void 0;
	try {
		const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = await prepareTransactionRequest(client, {
			...args,
			parameters: account?.type === "local" ? void 0 : ["blobVersionedHashes"]
		});
		const block = (blockNumber ? numberToHex(blockNumber) : void 0) || blockTag;
		const rpcStateOverride = serializeStateOverride(stateOverride);
		const to = await (async () => {
			if (rest.to) return rest.to;
			if (authorizationList && authorizationList.length > 0) return await recoverAuthorizationAddress({ authorization: authorizationList[0] }).catch(() => {
				throw new BaseError$3("`to` is required. Could not infer from `authorizationList`");
			});
		})();
		assertRequest(args);
		const chainFormat = client.chain?.formatters?.transactionRequest?.format;
		const request = (chainFormat || formatTransactionRequest)({
			...extract(rest, { format: chainFormat }),
			from: account?.address,
			accessList,
			authorizationList,
			blobs,
			blobVersionedHashes,
			data,
			gas,
			gasPrice,
			maxFeePerBlobGas,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value
		});
		function estimateGas_rpc(parameters) {
			const { block, request, rpcStateOverride } = parameters;
			return client.request({
				method: "eth_estimateGas",
				params: rpcStateOverride ? [
					request,
					block ?? "latest",
					rpcStateOverride
				] : block ? [request, block] : [request]
			});
		}
		let estimate = BigInt(await estimateGas_rpc({
			block,
			request,
			rpcStateOverride
		}));
		if (authorizationList) {
			const value = await getBalance(client, { address: request.from });
			const estimates = await Promise.all(authorizationList.map(async (authorization) => {
				const { contractAddress } = authorization;
				const estimate = await estimateGas_rpc({
					block,
					request: {
						authorizationList: void 0,
						data,
						from: account?.address,
						to: contractAddress,
						value: numberToHex(value)
					},
					rpcStateOverride
				}).catch(() => 100000n);
				return 2n * BigInt(estimate);
			}));
			estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
		}
		return estimate;
	} catch (err) {
		throw getEstimateGasError(err, {
			...args,
			account,
			chain: client.chain
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/estimateContractGas.js
/**
* Estimates the gas required to successfully execute a contract write function call.
*
* - Docs: https://viem.sh/docs/contract/estimateContractGas
*
* Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
*
* @param client - Client to use
* @param parameters - {@link EstimateContractGasParameters}
* @returns The gas estimate (in wei). {@link EstimateContractGasReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { estimateContractGas } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const gas = await estimateContractGas(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function mint() public']),
*   functionName: 'mint',
*   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
* })
*/
async function estimateContractGas(client, parameters) {
	const { abi, address, args, functionName, dataSuffix, ...request } = parameters;
	const data = encodeFunctionData({
		abi,
		args,
		functionName
	});
	try {
		return await getAction$1(client, estimateGas, "estimateGas")({
			data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
			to: address,
			...request
		});
	} catch (error) {
		throw getContractError(error, {
			abi,
			address,
			args,
			docsPath: "/docs/contract/estimateContractGas",
			functionName,
			sender: (request.account ? parseAccount(request.account) : void 0)?.address
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
	if (!isAddress(a, { strict: false })) throw new InvalidAddressError$1({ address: a });
	if (!isAddress(b, { strict: false })) throw new InvalidAddressError$1({ address: b });
	return a.toLowerCase() === b.toLowerCase();
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeEventLog.js
var docsPath$2 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
	const { abi, data, strict: strict_, topics } = parameters;
	const strict = strict_ ?? true;
	const [signature, ...argTopics] = topics;
	if (!signature) throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath$2 });
	const abiItem = (() => {
		if (abi.length === 1) return abi[0];
		return abi.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem$1(x)));
	})();
	if (!(abiItem && "name" in abiItem) || abiItem.type !== "event") throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath$2 });
	const { name, inputs } = abiItem;
	const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
	let args = isUnnamed ? [] : {};
	const indexedInputs = inputs.filter((x) => "indexed" in x && x.indexed);
	for (let i = 0; i < indexedInputs.length; i++) {
		const param = indexedInputs[i];
		const topic = argTopics[i];
		if (!topic) throw new DecodeLogTopicsMismatch({
			abiItem,
			param
		});
		args[isUnnamed ? i : param.name || i] = decodeTopic({
			param,
			value: topic
		});
	}
	const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
	if (nonIndexedInputs.length > 0) {
		if (data && data !== "0x") try {
			const decodedData = decodeAbiParameters(nonIndexedInputs, data);
			if (decodedData) {
				if (isUnnamed) args = [...args, ...decodedData];
				else for (let i = 0; i < nonIndexedInputs.length; i++) args[nonIndexedInputs[i].name] = decodedData[i];
			}
		} catch (err) {
			if (strict) {
				if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError) throw new DecodeLogDataMismatch({
					abiItem,
					data,
					params: nonIndexedInputs,
					size: size$4(data)
				});
				throw err;
			}
		}
		else if (strict) throw new DecodeLogDataMismatch({
			abiItem,
			data: "0x",
			params: nonIndexedInputs,
			size: 0
		});
	}
	return {
		eventName: name,
		args: Object.values(args).length > 0 ? args : void 0
	};
}
function decodeTopic({ param, value }) {
	if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/)) return value;
	return (decodeAbiParameters([param], value) || [])[0];
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/parseEventLogs.js
/**
* Extracts & decodes logs matching the provided signature(s) (`abi` + optional `eventName`)
* from a set of opaque logs.
*
* @param parameters - {@link ParseEventLogsParameters}
* @returns The logs. {@link ParseEventLogsReturnType}
*
* @example
* import { createClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { parseEventLogs } from 'viem/op-stack'
*
* const client = createClient({
*   chain: mainnet,
*   transport: http(),
* })
*
* const receipt = await getTransactionReceipt(client, {
*   hash: '0xec23b2ba4bc59ba61554507c1b1bc91649e6586eb2dd00c728e8ed0db8bb37ea',
* })
*
* const logs = parseEventLogs({ logs: receipt.logs })
* // [{ args: { ... }, eventName: 'TransactionDeposited', ... }, ...]
*/
function parseEventLogs(parameters) {
	const { abi, args, logs, strict = true } = parameters;
	const eventName = (() => {
		if (!parameters.eventName) return void 0;
		if (Array.isArray(parameters.eventName)) return parameters.eventName;
		return [parameters.eventName];
	})();
	return logs.map((log) => {
		try {
			const abiItem = abi.find((abiItem) => abiItem.type === "event" && log.topics[0] === toEventSelector(abiItem));
			if (!abiItem) return null;
			const event = decodeEventLog({
				...log,
				abi: [abiItem],
				strict
			});
			if (eventName && !eventName.includes(event.eventName)) return null;
			if (!includesArgs({
				args: event.args,
				inputs: abiItem.inputs,
				matchArgs: args
			})) return null;
			return {
				...event,
				...log
			};
		} catch (err) {
			let eventName;
			let isUnnamed;
			if (err instanceof AbiEventSignatureNotFoundError) return null;
			if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
				if (strict) return null;
				eventName = err.abiItem.name;
				isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
			}
			return {
				...log,
				args: isUnnamed ? [] : {},
				eventName
			};
		}
	}).filter(Boolean);
}
function includesArgs(parameters) {
	const { args, inputs, matchArgs } = parameters;
	if (!matchArgs) return true;
	if (!args) return false;
	function isEqual(input, value, arg) {
		try {
			if (input.type === "address") return isAddressEqual(value, arg);
			if (input.type === "string" || input.type === "bytes") return keccak256$1(toBytes(value)) === arg;
			return value === arg;
		} catch {
			return false;
		}
	}
	if (Array.isArray(args) && Array.isArray(matchArgs)) return matchArgs.every((value, index) => {
		if (value === null || value === void 0) return true;
		const input = inputs[index];
		if (!input) return false;
		return (Array.isArray(value) ? value : [value]).some((value) => isEqual(input, value, args[index]));
	});
	if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs)) return Object.entries(matchArgs).every(([key, value]) => {
		if (value === null || value === void 0) return true;
		const input = inputs.find((input) => input.name === key);
		if (!input) return false;
		return (Array.isArray(value) ? value : [value]).some((value) => isEqual(input, value, args[key]));
	});
	return false;
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log, { args, eventName } = {}) {
	return {
		...log,
		blockHash: log.blockHash ? log.blockHash : null,
		blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
		logIndex: log.logIndex ? Number(log.logIndex) : null,
		transactionHash: log.transactionHash ? log.transactionHash : null,
		transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
		...eventName ? {
			args,
			eventName
		} : {}
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getLogs.js
/**
* Returns a list of event logs matching the provided parameters.
*
* - Docs: https://viem.sh/docs/actions/public/getLogs
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
* - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
*
* @param client - Client to use
* @param parameters - {@link GetLogsParameters}
* @returns A list of event logs. {@link GetLogsReturnType}
*
* @example
* import { createPublicClient, http, parseAbiItem } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getLogs } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const logs = await getLogs(client)
*/
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
	const strict = strict_ ?? false;
	const events = events_ ?? (event ? [event] : void 0);
	let topics = [];
	if (events) {
		topics = [events.flatMap((event) => encodeEventTopics({
			abi: [event],
			eventName: event.name,
			args: events_ ? void 0 : args
		}))];
		if (event) topics = topics[0];
	}
	let logs;
	if (blockHash) logs = await client.request({
		method: "eth_getLogs",
		params: [{
			address,
			topics,
			blockHash
		}]
	});
	else logs = await client.request({
		method: "eth_getLogs",
		params: [{
			address,
			topics,
			fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
			toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
		}]
	});
	const formattedLogs = logs.map((log) => formatLog(log));
	if (!events) return formattedLogs;
	return parseEventLogs({
		abi: events,
		args,
		logs: formattedLogs,
		strict
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getContractEvents.js
/**
* Returns a list of event logs emitted by a contract.
*
* - Docs: https://viem.sh/docs/contract/getContractEvents#getcontractevents
* - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
*
* @param client - Client to use
* @param parameters - {@link GetContractEventsParameters}
* @returns A list of event logs. {@link GetContractEventsReturnType}
*
* @example
* import { createClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getContractEvents } from 'viem/public'
* import { wagmiAbi } from './abi'
*
* const client = createClient({
*   chain: mainnet,
*   transport: http(),
* })
* const logs = await getContractEvents(client, {
*  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*  abi: wagmiAbi,
*  eventName: 'Transfer'
* })
*/
async function getContractEvents(client, parameters) {
	const { abi, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
	const event = eventName ? getAbiItem({
		abi,
		name: eventName
	}) : void 0;
	const events = !event ? abi.filter((x) => x.type === "event") : void 0;
	return getAction$1(client, getLogs, "getLogs")({
		address,
		args,
		blockHash,
		event,
		events,
		fromBlock,
		toBlock,
		strict
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
var docsPath$1 = "/docs/contract/decodeFunctionResult";
function decodeFunctionResult(parameters) {
	const { abi, args, functionName, data } = parameters;
	let abiItem = abi[0];
	if (functionName) {
		const item = getAbiItem({
			abi,
			args,
			name: functionName
		});
		if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath$1 });
		abiItem = item;
	}
	if (abiItem.type !== "function") throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath$1 });
	if (!abiItem.outputs) throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath$1 });
	const values = decodeAbiParameters(abiItem.outputs, data);
	if (values && values.length > 1) return values;
	if (values && values.length === 1) return values[0];
}
//#endregion
//#region node_modules/viem/_esm/constants/abis.js
var multicall3Abi = [{
	inputs: [{
		components: [
			{
				name: "target",
				type: "address"
			},
			{
				name: "allowFailure",
				type: "bool"
			},
			{
				name: "callData",
				type: "bytes"
			}
		],
		name: "calls",
		type: "tuple[]"
	}],
	name: "aggregate3",
	outputs: [{
		components: [{
			name: "success",
			type: "bool"
		}, {
			name: "returnData",
			type: "bytes"
		}],
		name: "returnData",
		type: "tuple[]"
	}],
	stateMutability: "view",
	type: "function"
}];
var universalResolverErrors = [
	{
		inputs: [],
		name: "ResolverNotFound",
		type: "error"
	},
	{
		inputs: [],
		name: "ResolverWildcardNotSupported",
		type: "error"
	},
	{
		inputs: [],
		name: "ResolverNotContract",
		type: "error"
	},
	{
		inputs: [{
			name: "returnData",
			type: "bytes"
		}],
		name: "ResolverError",
		type: "error"
	},
	{
		inputs: [{
			components: [{
				name: "status",
				type: "uint16"
			}, {
				name: "message",
				type: "string"
			}],
			name: "errors",
			type: "tuple[]"
		}],
		name: "HttpError",
		type: "error"
	}
];
var universalResolverResolveAbi = [
	...universalResolverErrors,
	{
		name: "resolve",
		type: "function",
		stateMutability: "view",
		inputs: [{
			name: "name",
			type: "bytes"
		}, {
			name: "data",
			type: "bytes"
		}],
		outputs: [{
			name: "",
			type: "bytes"
		}, {
			name: "address",
			type: "address"
		}]
	},
	{
		name: "resolve",
		type: "function",
		stateMutability: "view",
		inputs: [
			{
				name: "name",
				type: "bytes"
			},
			{
				name: "data",
				type: "bytes"
			},
			{
				name: "gateways",
				type: "string[]"
			}
		],
		outputs: [{
			name: "",
			type: "bytes"
		}, {
			name: "address",
			type: "address"
		}]
	}
];
var universalResolverReverseAbi = [
	...universalResolverErrors,
	{
		name: "reverse",
		type: "function",
		stateMutability: "view",
		inputs: [{
			type: "bytes",
			name: "reverseName"
		}],
		outputs: [
			{
				type: "string",
				name: "resolvedName"
			},
			{
				type: "address",
				name: "resolvedAddress"
			},
			{
				type: "address",
				name: "reverseResolver"
			},
			{
				type: "address",
				name: "resolver"
			}
		]
	},
	{
		name: "reverse",
		type: "function",
		stateMutability: "view",
		inputs: [{
			type: "bytes",
			name: "reverseName"
		}, {
			type: "string[]",
			name: "gateways"
		}],
		outputs: [
			{
				type: "string",
				name: "resolvedName"
			},
			{
				type: "address",
				name: "resolvedAddress"
			},
			{
				type: "address",
				name: "reverseResolver"
			},
			{
				type: "address",
				name: "resolver"
			}
		]
	}
];
var textResolverAbi = [{
	name: "text",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}, {
		name: "key",
		type: "string"
	}],
	outputs: [{
		name: "",
		type: "string"
	}]
}];
var addressResolverAbi = [{
	name: "addr",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}],
	outputs: [{
		name: "",
		type: "address"
	}]
}, {
	name: "addr",
	type: "function",
	stateMutability: "view",
	inputs: [{
		name: "name",
		type: "bytes32"
	}, {
		name: "coinType",
		type: "uint256"
	}],
	outputs: [{
		name: "",
		type: "bytes"
	}]
}];
var universalSignatureValidatorAbi = [{
	inputs: [
		{
			name: "_signer",
			type: "address"
		},
		{
			name: "_hash",
			type: "bytes32"
		},
		{
			name: "_signature",
			type: "bytes"
		}
	],
	stateMutability: "nonpayable",
	type: "constructor"
}, {
	inputs: [
		{
			name: "_signer",
			type: "address"
		},
		{
			name: "_hash",
			type: "bytes32"
		},
		{
			name: "_signature",
			type: "bytes"
		}
	],
	outputs: [{ type: "bool" }],
	stateMutability: "nonpayable",
	type: "function",
	name: "isValidSig"
}];
//#endregion
//#region node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
var deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
var universalSignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
//#endregion
//#region node_modules/viem/_esm/errors/chain.js
var ChainDoesNotSupportContract = class extends BaseError$3 {
	constructor({ blockNumber, chain, contract }) {
		super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
			metaMessages: ["This could be due to any of the following:", ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [`- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`] : [`- The chain does not have the contract "${contract.name}" configured.`]],
			name: "ChainDoesNotSupportContract"
		});
	}
};
var ChainMismatchError = class extends BaseError$3 {
	constructor({ chain, currentChainId }) {
		super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`, {
			metaMessages: [`Current Chain ID:  ${currentChainId}`, `Expected Chain ID: ${chain.id} – ${chain.name}`],
			name: "ChainMismatchError"
		});
	}
};
var ChainNotFoundError = class extends BaseError$3 {
	constructor() {
		super(["No chain was provided to the request.", "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."].join("\n"), { name: "ChainNotFoundError" });
	}
};
var ClientChainNotConfiguredError = class extends BaseError$3 {
	constructor() {
		super("No chain was provided to the Client.", { name: "ClientChainNotConfiguredError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/abi/encodeDeployData.js
var docsPath = "/docs/contract/encodeDeployData";
function encodeDeployData(parameters) {
	const { abi, args, bytecode } = parameters;
	if (!args || args.length === 0) return bytecode;
	const description = abi.find((x) => "type" in x && x.type === "constructor");
	if (!description) throw new AbiConstructorNotFoundError({ docsPath });
	if (!("inputs" in description)) throw new AbiConstructorParamsNotFoundError({ docsPath });
	if (!description.inputs || description.inputs.length === 0) throw new AbiConstructorParamsNotFoundError({ docsPath });
	return concatHex([bytecode, encodeAbiParameters(description.inputs, args)]);
}
//#endregion
//#region node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function getChainContractAddress({ blockNumber, chain, contract: name }) {
	const contract = chain?.contracts?.[name];
	if (!contract) throw new ChainDoesNotSupportContract({
		chain,
		contract: { name }
	});
	if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber) throw new ChainDoesNotSupportContract({
		blockNumber,
		chain,
		contract: {
			name,
			blockCreated: contract.blockCreated
		}
	});
	return contract.address;
}
//#endregion
//#region node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath, ...args }) {
	return new CallExecutionError((() => {
		const cause = getNodeError(err, args);
		if (cause instanceof UnknownNodeError) return err;
		return cause;
	})(), {
		docsPath,
		...args
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withResolvers.js
/** @internal */
function withResolvers() {
	let resolve = () => void 0;
	let reject = () => void 0;
	return {
		promise: new Promise((resolve_, reject_) => {
			resolve = resolve_;
			reject = reject_;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/createBatchScheduler.js
var schedulerCache = /*#__PURE__*/ new Map();
/** @internal */
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
	const exec = async () => {
		const scheduler = getScheduler();
		flush();
		const args = scheduler.map(({ args }) => args);
		if (args.length === 0) return;
		fn(args).then((data) => {
			if (sort && Array.isArray(data)) data.sort(sort);
			for (let i = 0; i < scheduler.length; i++) {
				const { resolve } = scheduler[i];
				resolve?.([data[i], data]);
			}
		}).catch((err) => {
			for (let i = 0; i < scheduler.length; i++) {
				const { reject } = scheduler[i];
				reject?.(err);
			}
		});
	};
	const flush = () => schedulerCache.delete(id);
	const getBatchedArgs = () => getScheduler().map(({ args }) => args);
	const getScheduler = () => schedulerCache.get(id) || [];
	const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
	return {
		flush,
		async schedule(args) {
			const { promise, resolve, reject } = withResolvers();
			if (shouldSplitBatch?.([...getBatchedArgs(), args])) exec();
			if (getScheduler().length > 0) {
				setScheduler({
					args,
					resolve,
					reject
				});
				return promise;
			}
			setScheduler({
				args,
				resolve,
				reject
			});
			setTimeout(exec, wait);
			return promise;
		}
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/call.js
/**
* Executes a new message call immediately without submitting a transaction to the network.
*
* - Docs: https://viem.sh/docs/actions/public/call
* - JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)
*
* @param client - Client to use
* @param parameters - {@link CallParameters}
* @returns The call data. {@link CallReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { call } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const data = await call(client, {
*   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
*   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
* })
*/
async function call(client, args) {
	const { account: account_ = client.account, batch = Boolean(client.batch?.multicall), blockNumber, blockTag = "latest", accessList, blobs, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride, ...rest } = args;
	const account = account_ ? parseAccount(account_) : void 0;
	if (code && (factory || factoryData)) throw new BaseError$3("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
	if (code && to) throw new BaseError$3("Cannot provide both `code` & `to` as parameters.");
	const deploylessCallViaBytecode = code && data_;
	const deploylessCallViaFactory = factory && factoryData && to && data_;
	const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
	const data = (() => {
		if (deploylessCallViaBytecode) return toDeploylessCallViaBytecodeData({
			code,
			data: data_
		});
		if (deploylessCallViaFactory) return toDeploylessCallViaFactoryData({
			data: data_,
			factory,
			factoryData,
			to
		});
		return data_;
	})();
	try {
		assertRequest(args);
		const block = (blockNumber ? numberToHex(blockNumber) : void 0) || blockTag;
		const rpcStateOverride = serializeStateOverride(stateOverride);
		const chainFormat = client.chain?.formatters?.transactionRequest?.format;
		const request = (chainFormat || formatTransactionRequest)({
			...extract(rest, { format: chainFormat }),
			from: account?.address,
			accessList,
			blobs,
			data,
			gas,
			gasPrice,
			maxFeePerBlobGas,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to: deploylessCall ? void 0 : to,
			value
		});
		if (batch && shouldPerformMulticall({ request }) && !rpcStateOverride) try {
			return await scheduleMulticall(client, {
				...request,
				blockNumber,
				blockTag
			});
		} catch (err) {
			if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract)) throw err;
		}
		const response = await client.request({
			method: "eth_call",
			params: rpcStateOverride ? [
				request,
				block,
				rpcStateOverride
			] : [request, block]
		});
		if (response === "0x") return { data: void 0 };
		return { data: response };
	} catch (err) {
		const data = getRevertErrorData(err);
		const { offchainLookup, offchainLookupSignature } = await import("../viem.mjs").then((n) => n.r);
		if (client.ccipRead !== false && data?.slice(0, 10) === offchainLookupSignature && to) return { data: await offchainLookup(client, {
			data,
			to
		}) };
		if (deploylessCall && data?.slice(0, 10) === "0x101bb98d") throw new CounterfactualDeploymentFailedError({ factory });
		throw getCallError(err, {
			...args,
			account,
			chain: client.chain
		});
	}
}
function shouldPerformMulticall({ request }) {
	const { data, to, ...request_ } = request;
	if (!data) return false;
	if (data.startsWith("0x82ad56cb")) return false;
	if (!to) return false;
	if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0) return false;
	return true;
}
async function scheduleMulticall(client, args) {
	const { batchSize = 1024, wait = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
	const { blockNumber, blockTag = "latest", data, multicallAddress: multicallAddress_, to } = args;
	let multicallAddress = multicallAddress_;
	if (!multicallAddress) {
		if (!client.chain) throw new ClientChainNotConfiguredError();
		multicallAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "multicall3"
		});
	}
	const block = (blockNumber ? numberToHex(blockNumber) : void 0) || blockTag;
	const { schedule } = createBatchScheduler({
		id: `${client.uid}.${block}`,
		wait,
		shouldSplitBatch(args) {
			return args.reduce((size, { data }) => size + (data.length - 2), 0) > batchSize * 2;
		},
		fn: async (requests) => {
			const calls = requests.map((request) => ({
				allowFailure: true,
				callData: request.data,
				target: request.to
			}));
			const calldata = encodeFunctionData({
				abi: multicall3Abi,
				args: [calls],
				functionName: "aggregate3"
			});
			const data = await client.request({
				method: "eth_call",
				params: [{
					data: calldata,
					to: multicallAddress
				}, block]
			});
			return decodeFunctionResult({
				abi: multicall3Abi,
				args: [calls],
				functionName: "aggregate3",
				data: data || "0x"
			});
		}
	});
	const [{ returnData, success }] = await schedule({
		data,
		to
	});
	if (!success) throw new RawContractError({ data: returnData });
	if (returnData === "0x") return { data: void 0 };
	return { data: returnData };
}
function toDeploylessCallViaBytecodeData(parameters) {
	const { code, data } = parameters;
	return encodeDeployData({
		abi: parseAbi(["constructor(bytes, bytes)"]),
		bytecode: deploylessCallViaBytecodeBytecode,
		args: [code, data]
	});
}
function toDeploylessCallViaFactoryData(parameters) {
	const { data, factory, factoryData, to } = parameters;
	return encodeDeployData({
		abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
		bytecode: deploylessCallViaFactoryBytecode,
		args: [
			to,
			data,
			factory,
			factoryData
		]
	});
}
/** @internal */
function getRevertErrorData(err) {
	if (!(err instanceof BaseError$3)) return void 0;
	const error = err.walk();
	return typeof error?.data === "object" ? error.data?.data : error.data;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/readContract.js
/**
* Calls a read-only function on a contract, and returns the response.
*
* - Docs: https://viem.sh/docs/contract/readContract
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_reading-contracts
*
* A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.
*
* Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
*
* @param client - Client to use
* @param parameters - {@link ReadContractParameters}
* @returns The response from the contract. Type is inferred. {@link ReadContractReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { readContract } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const result = await readContract(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
*   functionName: 'balanceOf',
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // 424122n
*/
async function readContract(client, parameters) {
	const { abi, address, args, functionName, ...rest } = parameters;
	const calldata = encodeFunctionData({
		abi,
		args,
		functionName
	});
	try {
		const { data } = await getAction$1(client, call, "call")({
			...rest,
			data: calldata,
			to: address
		});
		return decodeFunctionResult({
			abi,
			args,
			functionName,
			data: data || "0x"
		});
	} catch (error) {
		throw getContractError(error, {
			abi,
			address,
			args,
			docsPath: "/docs/contract/readContract",
			functionName
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/simulateContract.js
/**
* Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.
*
* - Docs: https://viem.sh/docs/contract/simulateContract
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
*
* This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.
*
* Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
*
* @param client - Client to use
* @param parameters - {@link SimulateContractParameters}
* @returns The simulation result and write request. {@link SimulateContractReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { simulateContract } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const result = await simulateContract(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function mint(uint32) view returns (uint32)']),
*   functionName: 'mint',
*   args: ['69420'],
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
* })
*/
async function simulateContract(client, parameters) {
	const { abi, address, args, dataSuffix, functionName, ...callRequest } = parameters;
	const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
	const calldata = encodeFunctionData({
		abi,
		args,
		functionName
	});
	try {
		const { data } = await getAction$1(client, call, "call")({
			batch: false,
			data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
			to: address,
			...callRequest,
			account
		});
		return {
			result: decodeFunctionResult({
				abi,
				args,
				functionName,
				data: data || "0x"
			}),
			request: {
				abi: abi.filter((abiItem) => "name" in abiItem && abiItem.name === parameters.functionName),
				address,
				args,
				dataSuffix,
				functionName,
				...callRequest,
				account
			}
		};
	} catch (error) {
		throw getContractError(error, {
			abi,
			address,
			args,
			docsPath: "/docs/contract/simulateContract",
			functionName,
			sender: account?.address
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/utils/observe.js
/** @internal */
var listenersCache = /*#__PURE__*/ new Map();
/** @internal */
var cleanupCache = /*#__PURE__*/ new Map();
var callbackCount = 0;
/**
* @description Sets up an observer for a given function. If another function
* is set up under the same observer id, the function will only be called once
* for both instances of the observer.
*/
function observe(observerId, callbacks, fn) {
	const callbackId = ++callbackCount;
	const getListeners = () => listenersCache.get(observerId) || [];
	const unsubscribe = () => {
		const listeners = getListeners();
		listenersCache.set(observerId, listeners.filter((cb) => cb.id !== callbackId));
	};
	const unwatch = () => {
		const listeners = getListeners();
		if (!listeners.some((cb) => cb.id === callbackId)) return;
		const cleanup = cleanupCache.get(observerId);
		if (listeners.length === 1 && cleanup) cleanup();
		unsubscribe();
	};
	const listeners = getListeners();
	listenersCache.set(observerId, [...listeners, {
		id: callbackId,
		fns: callbacks
	}]);
	if (listeners && listeners.length > 0) return unwatch;
	const emit = {};
	for (const key in callbacks) emit[key] = ((...args) => {
		const listeners = getListeners();
		if (listeners.length === 0) return;
		for (const listener of listeners) listener.fns[key]?.(...args);
	});
	const cleanup = fn(emit);
	if (typeof cleanup === "function") cleanupCache.set(observerId, cleanup);
	return unwatch;
}
//#endregion
//#region node_modules/viem/_esm/utils/wait.js
async function wait(time) {
	return new Promise((res) => setTimeout(res, time));
}
//#endregion
//#region node_modules/viem/_esm/utils/poll.js
/**
* @description Polls a function at a specified interval.
*/
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
	let active = true;
	const unwatch = () => active = false;
	const watch = async () => {
		let data = void 0;
		if (emitOnBegin) data = await fn({ unpoll: unwatch });
		await wait(await initialWaitTime?.(data) ?? interval);
		const poll = async () => {
			if (!active) return;
			await fn({ unpoll: unwatch });
			await wait(interval);
			poll();
		};
		poll();
	};
	watch();
	return unwatch;
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withCache.js
/** @internal */
var promiseCache$1 = /*#__PURE__*/ new Map();
/** @internal */
var responseCache = /*#__PURE__*/ new Map();
function getCache(cacheKey) {
	const buildCache = (cacheKey, cache) => ({
		clear: () => cache.delete(cacheKey),
		get: () => cache.get(cacheKey),
		set: (data) => cache.set(cacheKey, data)
	});
	const promise = buildCache(cacheKey, promiseCache$1);
	const response = buildCache(cacheKey, responseCache);
	return {
		clear: () => {
			promise.clear();
			response.clear();
		},
		promise,
		response
	};
}
/**
* @description Returns the result of a given promise, and caches the result for
* subsequent invocations against a provided cache key.
*/
async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
	const cache = getCache(cacheKey);
	const response = cache.response.get();
	if (response && cacheTime > 0) {
		if ((/* @__PURE__ */ new Date()).getTime() - response.created.getTime() < cacheTime) return response.data;
	}
	let promise = cache.promise.get();
	if (!promise) {
		promise = fn();
		cache.promise.set(promise);
	}
	try {
		const data = await promise;
		cache.response.set({
			created: /* @__PURE__ */ new Date(),
			data
		});
		return data;
	} finally {
		cache.promise.clear();
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = (id) => `blockNumber.${id}`;
/**
* Returns the number of the most recent block seen.
*
* - Docs: https://viem.sh/docs/actions/public/getBlockNumber
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
* - JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)
*
* @param client - Client to use
* @param parameters - {@link GetBlockNumberParameters}
* @returns The number of the block. {@link GetBlockNumberReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBlockNumber } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const blockNumber = await getBlockNumber(client)
* // 69420n
*/
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
	const blockNumberHex = await withCache(() => client.request({ method: "eth_blockNumber" }), {
		cacheKey: cacheKey(client.uid),
		cacheTime
	});
	return BigInt(blockNumberHex);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getFilterChanges.js
/**
* Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.
*
* - Docs: https://viem.sh/docs/actions/public/getFilterChanges
* - JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)
*
* A Filter can be created from the following actions:
*
* - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
* - [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
* - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
* - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
*
* Depending on the type of filter, the return value will be different:
*
* - If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
* - If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
* - If the filter was created with `createBlockFilter`, it returns a list of block hashes.
*
* @param client - Client to use
* @param parameters - {@link GetFilterChangesParameters}
* @returns Logs or hashes. {@link GetFilterChangesReturnType}
*
* @example
* // Blocks
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createBlockFilter, getFilterChanges } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createBlockFilter(client)
* const hashes = await getFilterChanges(client, { filter })
*
* @example
* // Contract Events
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createContractEventFilter, getFilterChanges } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createContractEventFilter(client, {
*   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
*   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
*   eventName: 'Transfer',
* })
* const logs = await getFilterChanges(client, { filter })
*
* @example
* // Raw Events
* import { createPublicClient, http, parseAbiItem } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createEventFilter, getFilterChanges } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createEventFilter(client, {
*   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
*   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
* })
* const logs = await getFilterChanges(client, { filter })
*
* @example
* // Transactions
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createPendingTransactionFilter, getFilterChanges } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createPendingTransactionFilter(client)
* const hashes = await getFilterChanges(client, { filter })
*/
async function getFilterChanges(_client, { filter }) {
	const strict = "strict" in filter && filter.strict;
	const logs = await filter.request({
		method: "eth_getFilterChanges",
		params: [filter.id]
	});
	if (typeof logs[0] === "string") return logs;
	const formattedLogs = logs.map((log) => formatLog(log));
	if (!("abi" in filter) || !filter.abi) return formattedLogs;
	return parseEventLogs({
		abi: filter.abi,
		logs: formattedLogs,
		strict
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/uninstallFilter.js
/**
* Destroys a [`Filter`](https://viem.sh/docs/glossary/types#filter).
*
* - Docs: https://viem.sh/docs/actions/public/uninstallFilter
* - JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)
*
* Destroys a Filter that was created from one of the following Actions:
* - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
* - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
* - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
*
* @param client - Client to use
* @param parameters - {@link UninstallFilterParameters}
* @returns A boolean indicating if the Filter was successfully uninstalled. {@link UninstallFilterReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'
*
* const filter = await createPendingTransactionFilter(client)
* const uninstalled = await uninstallFilter(client, { filter })
* // true
*/
async function uninstallFilter(_client, { filter }) {
	return filter.request({
		method: "eth_uninstallFilter",
		params: [filter.id]
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/watchContractEvent.js
/**
* Watches and returns emitted contract event logs.
*
* - Docs: https://viem.sh/docs/contract/watchContractEvent
*
* This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).
*
* `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
*
* @param client - Client to use
* @param parameters - {@link WatchContractEventParameters}
* @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { watchContractEvent } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const unwatch = watchContractEvent(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
*   eventName: 'Transfer',
*   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
*   onLogs: (logs) => console.log(logs),
* })
*/
function watchContractEvent(client, parameters) {
	const { abi, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
	const enablePolling = (() => {
		if (typeof poll_ !== "undefined") return poll_;
		if (typeof fromBlock === "bigint") return true;
		if (client.transport.type === "webSocket") return false;
		if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket") return false;
		return true;
	})();
	const pollContractEvent = () => {
		const strict = strict_ ?? false;
		return observe(stringify$1([
			"watchContractEvent",
			address,
			args,
			batch,
			client.uid,
			eventName,
			pollingInterval,
			strict,
			fromBlock
		]), {
			onLogs,
			onError
		}, (emit) => {
			let previousBlockNumber;
			if (fromBlock !== void 0) previousBlockNumber = fromBlock - 1n;
			let filter;
			let initialized = false;
			const unwatch = poll(async () => {
				if (!initialized) {
					try {
						filter = await getAction$1(client, createContractEventFilter, "createContractEventFilter")({
							abi,
							address,
							args,
							eventName,
							strict,
							fromBlock
						});
					} catch {}
					initialized = true;
					return;
				}
				try {
					let logs;
					if (filter) logs = await getAction$1(client, getFilterChanges, "getFilterChanges")({ filter });
					else {
						const blockNumber = await getAction$1(client, getBlockNumber, "getBlockNumber")({});
						if (previousBlockNumber && previousBlockNumber < blockNumber) logs = await getAction$1(client, getContractEvents, "getContractEvents")({
							abi,
							address,
							args,
							eventName,
							fromBlock: previousBlockNumber + 1n,
							toBlock: blockNumber,
							strict
						});
						else logs = [];
						previousBlockNumber = blockNumber;
					}
					if (logs.length === 0) return;
					if (batch) emit.onLogs(logs);
					else for (const log of logs) emit.onLogs([log]);
				} catch (err) {
					if (filter && err instanceof InvalidInputRpcError) initialized = false;
					emit.onError?.(err);
				}
			}, {
				emitOnBegin: true,
				interval: pollingInterval
			});
			return async () => {
				if (filter) await getAction$1(client, uninstallFilter, "uninstallFilter")({ filter });
				unwatch();
			};
		});
	};
	const subscribeContractEvent = () => {
		const strict = strict_ ?? false;
		const observerId = stringify$1([
			"watchContractEvent",
			address,
			args,
			batch,
			client.uid,
			eventName,
			pollingInterval,
			strict
		]);
		let active = true;
		let unsubscribe = () => active = false;
		return observe(observerId, {
			onLogs,
			onError
		}, (emit) => {
			(async () => {
				try {
					const transport = (() => {
						if (client.transport.type === "fallback") {
							const transport = client.transport.transports.find((transport) => transport.config.type === "webSocket");
							if (!transport) return client.transport;
							return transport.value;
						}
						return client.transport;
					})();
					const topics = eventName ? encodeEventTopics({
						abi,
						eventName,
						args
					}) : [];
					const { unsubscribe: unsubscribe_ } = await transport.subscribe({
						params: ["logs", {
							address,
							topics
						}],
						onData(data) {
							if (!active) return;
							const log = data.result;
							try {
								const { eventName, args } = decodeEventLog({
									abi,
									data: log.data,
									topics: log.topics,
									strict: strict_
								});
								const formatted = formatLog(log, {
									args,
									eventName
								});
								emit.onLogs([formatted]);
							} catch (err) {
								let eventName;
								let isUnnamed;
								if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
									if (strict_) return;
									eventName = err.abiItem.name;
									isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
								}
								const formatted = formatLog(log, {
									args: isUnnamed ? [] : {},
									eventName
								});
								emit.onLogs([formatted]);
							}
						},
						onError(error) {
							emit.onError?.(error);
						}
					});
					unsubscribe = unsubscribe_;
					if (!active) unsubscribe();
				} catch (err) {
					onError?.(err);
				}
			})();
			return () => unsubscribe();
		});
	};
	return enablePolling ? pollContractEvent() : subscribeContractEvent();
}
//#endregion
//#region node_modules/viem/_esm/errors/account.js
var AccountNotFoundError = class extends BaseError$3 {
	constructor({ docsPath } = {}) {
		super(["Could not find an Account to execute with this Action.", "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."].join("\n"), {
			docsPath,
			docsSlug: "account",
			name: "AccountNotFoundError"
		});
	}
};
var AccountTypeNotSupportedError = class extends BaseError$3 {
	constructor({ docsPath, metaMessages, type }) {
		super(`Account type "${type}" is not supported.`, {
			docsPath,
			metaMessages,
			name: "AccountTypeNotSupportedError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/chain/assertCurrentChain.js
function assertCurrentChain({ chain, currentChainId }) {
	if (!chain) throw new ChainNotFoundError();
	if (currentChainId !== chain.id) throw new ChainMismatchError({
		chain,
		currentChainId
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/errors/getTransactionError.js
function getTransactionError(err, { docsPath, ...args }) {
	return new TransactionExecutionError((() => {
		const cause = getNodeError(err, args);
		if (cause instanceof UnknownNodeError) return err;
		return cause;
	})(), {
		docsPath,
		...args
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
/**
* Sends a **signed** transaction to the network
*
* - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
* - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
*
* @param client - Client to use
* @param parameters - {@link SendRawTransactionParameters}
* @returns The transaction hash. {@link SendRawTransactionReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { sendRawTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
*
* const hash = await sendRawTransaction(client, {
*   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
* })
*/
async function sendRawTransaction(client, { serializedTransaction }) {
	return client.request({
		method: "eth_sendRawTransaction",
		params: [serializedTransaction]
	}, { retryCount: 0 });
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/sendTransaction.js
var supportsWalletNamespace = new LruMap$1(128);
/**
* Creates, signs, and sends a new transaction to the network.
*
* - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
* - JSON-RPC Methods:
*   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
*   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
*
* @param client - Client to use
* @param parameters - {@link SendTransactionParameters}
* @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
*
* @example
* import { createWalletClient, custom } from 'viem'
* import { mainnet } from 'viem/chains'
* import { sendTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const hash = await sendTransaction(client, {
*   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: 1000000000000000000n,
* })
*
* @example
* // Account Hoisting
* import { createWalletClient, http } from 'viem'
* import { privateKeyToAccount } from 'viem/accounts'
* import { mainnet } from 'viem/chains'
* import { sendTransaction } from 'viem/wallet'
*
* const client = createWalletClient({
*   account: privateKeyToAccount('0x…'),
*   chain: mainnet,
*   transport: http(),
* })
* const hash = await sendTransaction(client, {
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*   value: 1000000000000000000n,
* })
*/
async function sendTransaction(client, parameters) {
	const { account: account_ = client.account, chain = client.chain, accessList, authorizationList, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, ...rest } = parameters;
	if (typeof account_ === "undefined") throw new AccountNotFoundError({ docsPath: "/docs/actions/wallet/sendTransaction" });
	const account = account_ ? parseAccount(account_) : null;
	try {
		assertRequest(parameters);
		const to = await (async () => {
			if (parameters.to) return parameters.to;
			if (parameters.to === null) return void 0;
			if (authorizationList && authorizationList.length > 0) return await recoverAuthorizationAddress({ authorization: authorizationList[0] }).catch(() => {
				throw new BaseError$3("`to` is required. Could not infer from `authorizationList`.");
			});
		})();
		if (account?.type === "json-rpc" || account === null) {
			let chainId;
			if (chain !== null) {
				chainId = await getAction$1(client, getChainId$1, "getChainId")({});
				assertCurrentChain({
					currentChainId: chainId,
					chain
				});
			}
			const chainFormat = client.chain?.formatters?.transactionRequest?.format;
			const request = (chainFormat || formatTransactionRequest)({
				...extract(rest, { format: chainFormat }),
				accessList,
				authorizationList,
				blobs,
				chainId,
				data,
				from: account?.address,
				gas,
				gasPrice,
				maxFeePerBlobGas,
				maxFeePerGas,
				maxPriorityFeePerGas,
				nonce,
				to,
				value
			});
			const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
			const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
			try {
				return await client.request({
					method,
					params: [request]
				}, { retryCount: 0 });
			} catch (e) {
				if (isWalletNamespaceSupported === false) throw e;
				const error = e;
				if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") return await client.request({
					method: "wallet_sendTransaction",
					params: [request]
				}, { retryCount: 0 }).then((hash) => {
					supportsWalletNamespace.set(client.uid, true);
					return hash;
				}).catch((e) => {
					const walletNamespaceError = e;
					if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
						supportsWalletNamespace.set(client.uid, false);
						throw error;
					}
					throw walletNamespaceError;
				});
				throw error;
			}
		}
		if (account?.type === "local") {
			const request = await getAction$1(client, prepareTransactionRequest, "prepareTransactionRequest")({
				account,
				accessList,
				authorizationList,
				blobs,
				chain,
				data,
				gas,
				gasPrice,
				maxFeePerBlobGas,
				maxFeePerGas,
				maxPriorityFeePerGas,
				nonce,
				nonceManager: account.nonceManager,
				parameters: [...defaultParameters, "sidecars"],
				value,
				...rest,
				to
			});
			const serializer = chain?.serializers?.transaction;
			const serializedTransaction = await account.signTransaction(request, { serializer });
			return await getAction$1(client, sendRawTransaction, "sendRawTransaction")({ serializedTransaction });
		}
		if (account?.type === "smart") throw new AccountTypeNotSupportedError({
			metaMessages: ["Consider using the `sendUserOperation` Action instead."],
			docsPath: "/docs/actions/bundler/sendUserOperation",
			type: "smart"
		});
		throw new AccountTypeNotSupportedError({
			docsPath: "/docs/actions/wallet/sendTransaction",
			type: account?.type
		});
	} catch (err) {
		if (err instanceof AccountTypeNotSupportedError) throw err;
		throw getTransactionError(err, {
			...parameters,
			account,
			chain: parameters.chain || void 0
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/wallet/writeContract.js
/**
* Executes a write function on a contract.
*
* - Docs: https://viem.sh/docs/contract/writeContract
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
*
* A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
*
* Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
*
* __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
*
* @param client - Client to use
* @param parameters - {@link WriteContractParameters}
* @returns A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). {@link WriteContractReturnType}
*
* @example
* import { createWalletClient, custom, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { writeContract } from 'viem/contract'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: custom(window.ethereum),
* })
* const hash = await writeContract(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
*   functionName: 'mint',
*   args: [69420],
* })
*
* @example
* // With Validation
* import { createWalletClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { simulateContract, writeContract } from 'viem/contract'
*
* const client = createWalletClient({
*   chain: mainnet,
*   transport: http(),
* })
* const { request } = await simulateContract(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
*   functionName: 'mint',
*   args: [69420],
* }
* const hash = await writeContract(client, request)
*/
async function writeContract$1(client, parameters) {
	const { abi, account: account_ = client.account, address, args, dataSuffix, functionName, ...request } = parameters;
	if (typeof account_ === "undefined") throw new AccountNotFoundError({ docsPath: "/docs/contract/writeContract" });
	const account = account_ ? parseAccount(account_) : null;
	const data = encodeFunctionData({
		abi,
		args,
		functionName
	});
	try {
		return await getAction$1(client, sendTransaction, "sendTransaction")({
			data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
			to: address,
			account,
			...request
		});
	} catch (error) {
		throw getContractError(error, {
			abi,
			address,
			args,
			docsPath: "/docs/contract/writeContract",
			functionName,
			sender: account?.address
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/errors/eip712.js
var Eip712DomainNotFoundError = class extends BaseError$3 {
	constructor({ address }) {
		super(`No EIP-712 domain found on contract "${address}".`, {
			metaMessages: [
				"Ensure that:",
				`- The contract is deployed at the address "${address}".`,
				"- `eip712Domain()` function exists on the contract.",
				"- `eip712Domain()` function matches signature to ERC-5267 specification."
			],
			name: "Eip712DomainNotFoundError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/actions/public/getEip712Domain.js
/**
* Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.
*
* @param client - A {@link Client} instance.
* @param parameters - The parameters of the action. {@link GetEip712DomainParameters}
* @returns The EIP-712 domain, fields, and extensions. {@link GetEip712DomainReturnType}
*
* @example
* ```ts
* import { createPublicClient, http, getEip712Domain } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
*
* const domain = await getEip712Domain(client, {
*   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
* })
* // {
* //   domain: {
* //     name: 'ExampleContract',
* //     version: '1',
* //     chainId: 1,
* //     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
* //   },
* //   fields: '0x0f',
* //   extensions: [],
* // }
* ```
*/
async function getEip712Domain(client, parameters) {
	const { address, factory, factoryData } = parameters;
	try {
		const [fields, name, version, chainId, verifyingContract, salt, extensions] = await getAction$1(client, readContract, "readContract")({
			abi,
			address,
			functionName: "eip712Domain",
			factory,
			factoryData
		});
		return {
			domain: {
				name,
				version,
				chainId: Number(chainId),
				verifyingContract,
				salt
			},
			extensions,
			fields
		};
	} catch (e) {
		const error = e;
		if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") throw new Eip712DomainNotFoundError({ address });
		throw error;
	}
}
var abi = [{
	inputs: [],
	name: "eip712Domain",
	outputs: [
		{
			name: "fields",
			type: "bytes1"
		},
		{
			name: "name",
			type: "string"
		},
		{
			name: "version",
			type: "string"
		},
		{
			name: "chainId",
			type: "uint256"
		},
		{
			name: "verifyingContract",
			type: "address"
		},
		{
			name: "salt",
			type: "bytes32"
		},
		{
			name: "extensions",
			type: "uint256[]"
		}
	],
	stateMutability: "view",
	type: "function"
}];
//#endregion
//#region node_modules/viem/_esm/utils/uid.js
var size$3 = 256;
var index$1 = size$3;
var buffer$1;
function uid$1(length = 11) {
	if (!buffer$1 || index$1 + length > size$3 * 2) {
		buffer$1 = "";
		index$1 = 0;
		for (let i = 0; i < size$3; i++) buffer$1 += (256 + Math.random() * 256 | 0).toString(16).substring(1);
	}
	return buffer$1.substring(index$1, index$1++ + length);
}
//#endregion
//#region node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
	const { batch, cacheTime = parameters.pollingInterval ?? 4e3, ccipRead, key = "base", name = "Base Client", pollingInterval = 4e3, type = "base" } = parameters;
	const chain = parameters.chain;
	const account = parameters.account ? parseAccount(parameters.account) : void 0;
	const { config, request, value } = parameters.transport({
		chain,
		pollingInterval
	});
	const client = {
		account,
		batch,
		cacheTime,
		ccipRead,
		chain,
		key,
		name,
		pollingInterval,
		request,
		transport: {
			...config,
			...value
		},
		type,
		uid: uid$1()
	};
	function extend(base) {
		return (extendFn) => {
			const extended = extendFn(base);
			for (const key in client) delete extended[key];
			const combined = {
				...base,
				...extended
			};
			return Object.assign(combined, { extend: extend(combined) });
		};
	}
	return Object.assign(client, { extend: extend(client) });
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withDedupe.js
/** @internal */
var promiseCache = /*#__PURE__*/ new LruMap$1(8192);
/** Deduplicates in-flight promises. */
function withDedupe(fn, { enabled = true, id }) {
	if (!enabled || !id) return fn();
	if (promiseCache.get(id)) return promiseCache.get(id);
	const promise = fn().finally(() => promiseCache.delete(id));
	promiseCache.set(id, promise);
	return promise;
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true } = {}) {
	return new Promise((resolve, reject) => {
		const attemptRetry = async ({ count = 0 } = {}) => {
			const retry = async ({ error }) => {
				const delay = typeof delay_ === "function" ? delay_({
					count,
					error
				}) : delay_;
				if (delay) await wait(delay);
				attemptRetry({ count: count + 1 });
			};
			try {
				resolve(await fn());
			} catch (err) {
				if (count < retryCount && await shouldRetry({
					count,
					error: err
				})) return retry({ error: err });
				reject(err);
			}
		};
		attemptRetry();
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/buildRequest.js
function buildRequest(request, options = {}) {
	return async (args, overrideOptions = {}) => {
		const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid } = {
			...options,
			...overrideOptions
		};
		const { method } = args;
		if (methods?.exclude?.includes(method)) throw new MethodNotSupportedRpcError(/* @__PURE__ */ new Error("method not supported"), { method });
		if (methods?.include && !methods.include.includes(method)) throw new MethodNotSupportedRpcError(/* @__PURE__ */ new Error("method not supported"), { method });
		return withDedupe(() => withRetry(async () => {
			try {
				return await request(args);
			} catch (err_) {
				const err = err_;
				switch (err.code) {
					case ParseRpcError.code: throw new ParseRpcError(err);
					case InvalidRequestRpcError.code: throw new InvalidRequestRpcError(err);
					case MethodNotFoundRpcError.code: throw new MethodNotFoundRpcError(err, { method: args.method });
					case InvalidParamsRpcError.code: throw new InvalidParamsRpcError(err);
					case InternalRpcError.code: throw new InternalRpcError(err);
					case InvalidInputRpcError.code: throw new InvalidInputRpcError(err);
					case ResourceNotFoundRpcError.code: throw new ResourceNotFoundRpcError(err);
					case ResourceUnavailableRpcError.code: throw new ResourceUnavailableRpcError(err);
					case TransactionRejectedRpcError.code: throw new TransactionRejectedRpcError(err);
					case MethodNotSupportedRpcError.code: throw new MethodNotSupportedRpcError(err, { method: args.method });
					case LimitExceededRpcError.code: throw new LimitExceededRpcError(err);
					case JsonRpcVersionUnsupportedError.code: throw new JsonRpcVersionUnsupportedError(err);
					case UserRejectedRequestError.code: throw new UserRejectedRequestError(err);
					case UnauthorizedProviderError.code: throw new UnauthorizedProviderError(err);
					case UnsupportedProviderMethodError.code: throw new UnsupportedProviderMethodError(err);
					case ProviderDisconnectedError.code: throw new ProviderDisconnectedError(err);
					case ChainDisconnectedError.code: throw new ChainDisconnectedError(err);
					case SwitchChainError.code: throw new SwitchChainError(err);
					case 5e3: throw new UserRejectedRequestError(err);
					default:
						if (err_ instanceof BaseError$3) throw err_;
						throw new UnknownRpcError(err);
				}
			}
		}, {
			delay: ({ count, error }) => {
				if (error && error instanceof HttpRequestError) {
					const retryAfter = error?.headers?.get("Retry-After");
					if (retryAfter?.match(/\d/)) return Number.parseInt(retryAfter) * 1e3;
				}
				return ~~(1 << count) * retryDelay;
			},
			retryCount,
			shouldRetry: ({ error }) => shouldRetry(error)
		}), {
			enabled: dedupe,
			id: dedupe ? stringToHex(`${uid}.${stringify$1(args)}`) : void 0
		});
	};
}
/** @internal */
function shouldRetry(error) {
	if ("code" in error && typeof error.code === "number") {
		if (error.code === -1) return true;
		if (error.code === LimitExceededRpcError.code) return true;
		if (error.code === InternalRpcError.code) return true;
		return false;
	}
	if (error instanceof HttpRequestError && error.status) {
		if (error.status === 403) return true;
		if (error.status === 408) return true;
		if (error.status === 413) return true;
		if (error.status === 429) return true;
		if (error.status === 500) return true;
		if (error.status === 502) return true;
		if (error.status === 503) return true;
		if (error.status === 504) return true;
		return false;
	}
	return true;
}
//#endregion
//#region node_modules/viem/_esm/clients/transports/createTransport.js
/**
* @description Creates an transport intended to be used with a client.
*/
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
	const uid = uid$1();
	return {
		config: {
			key,
			methods,
			name,
			request,
			retryCount,
			retryDelay,
			timeout,
			type
		},
		request: buildRequest(request, {
			methods,
			retryCount,
			retryDelay,
			uid
		}),
		value
	};
}
//#endregion
//#region node_modules/viem/_esm/clients/transports/custom.js
/**
* @description Creates a custom transport given an EIP-1193 compliant `request` attribute.
*/
function custom(provider, config = {}) {
	const { key = "custom", methods, name = "Custom Provider", retryDelay } = config;
	return ({ retryCount: defaultRetryCount }) => createTransport({
		key,
		methods,
		name,
		request: provider.request.bind(provider),
		retryCount: config.retryCount ?? defaultRetryCount,
		retryDelay,
		type: "custom"
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/promise/withTimeout.js
function withTimeout(fn, { errorInstance = /* @__PURE__ */ new Error("timed out"), timeout, signal }) {
	return new Promise((resolve, reject) => {
		(async () => {
			let timeoutId;
			try {
				const controller = new AbortController();
				if (timeout > 0) timeoutId = setTimeout(() => {
					if (signal) controller.abort();
					else reject(errorInstance);
				}, timeout);
				resolve(await fn({ signal: controller?.signal || null }));
			} catch (err) {
				if (err?.name === "AbortError") reject(errorInstance);
				reject(err);
			} finally {
				clearTimeout(timeoutId);
			}
		})();
	});
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/errors.js
function isNullUniversalResolverError(err, callType) {
	if (!(err instanceof BaseError$3)) return false;
	const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
	if (!(cause instanceof ContractFunctionRevertedError)) return false;
	if (cause.data?.errorName === "ResolverNotFound") return true;
	if (cause.data?.errorName === "ResolverWildcardNotSupported") return true;
	if (cause.data?.errorName === "ResolverNotContract") return true;
	if (cause.data?.errorName === "ResolverError") return true;
	if (cause.data?.errorName === "HttpError") return true;
	if (cause.reason?.includes("Wildcard on non-extended resolvers is not supported")) return true;
	if (callType === "reverse" && cause.reason === panicReasons[50]) return true;
	return false;
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
function encodedLabelToLabelhash(label) {
	if (label.length !== 66) return null;
	if (label.indexOf("[") !== 0) return null;
	if (label.indexOf("]") !== 65) return null;
	const hash = `0x${label.slice(1, 65)}`;
	if (!isHex(hash)) return null;
	return hash;
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/namehash.js
/**
* @description Hashes ENS name
*
* - Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `namehash`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @example
* namehash('wevm.eth')
* '0xf246651c1b9a6b141d19c2604e9a58f567973833990f830d882534a747801359'
*
* @link https://eips.ethereum.org/EIPS/eip-137
*/
function namehash(name) {
	let result = (/* @__PURE__ */ new Uint8Array(32)).fill(0);
	if (!name) return bytesToHex(result);
	const labels = name.split(".");
	for (let i = labels.length - 1; i >= 0; i -= 1) {
		const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
		const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256$1(stringToBytes(labels[i]), "bytes");
		result = keccak256$1(concat$1([result, hashed]), "bytes");
	}
	return bytesToHex(result);
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/encodeLabelhash.js
function encodeLabelhash(hash) {
	return `[${hash.slice(2)}]`;
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/labelhash.js
/**
* @description Hashes ENS label
*
* - Since ENS labels prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS labels](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `labelhash`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @example
* labelhash('eth')
* '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'
*/
function labelhash(label) {
	const result = (/* @__PURE__ */ new Uint8Array(32)).fill(0);
	if (!label) return bytesToHex(result);
	return encodedLabelToLabelhash(label) || keccak256$1(stringToBytes(label));
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
	const value = packet.replace(/^\.|\.$/gm, "");
	if (value.length === 0) return /* @__PURE__ */ new Uint8Array(1);
	const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
	let offset = 0;
	const list = value.split(".");
	for (let i = 0; i < list.length; i++) {
		let encoded = stringToBytes(list[i]);
		if (encoded.byteLength > 255) encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
		bytes[offset] = encoded.length;
		bytes.set(encoded, offset + 1);
		offset += encoded.length + 1;
	}
	if (bytes.byteLength !== offset + 1) return bytes.slice(0, offset + 1);
	return bytes;
}
//#endregion
//#region node_modules/viem/_esm/actions/ens/getEnsAddress.js
/**
* Gets address for ENS name.
*
* - Docs: https://viem.sh/docs/ens/actions/getEnsAddress
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
*
* Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
*
* Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @param client - Client to use
* @param parameters - {@link GetEnsAddressParameters}
* @returns Address for ENS name or `null` if not found. {@link GetEnsAddressReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getEnsAddress, normalize } from 'viem/ens'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const ensAddress = await getEnsAddress(client, {
*   name: normalize('wevm.eth'),
* })
* // '0xd2135CfB216b74109775236E36d4b433F1DF507B'
*/
async function getEnsAddress(client, { blockNumber, blockTag, coinType, name, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
	let universalResolverAddress = universalResolverAddress_;
	if (!universalResolverAddress) {
		if (!client.chain) throw new Error("client chain not configured. universalResolverAddress is required.");
		universalResolverAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "ensUniversalResolver"
		});
	}
	try {
		const functionData = encodeFunctionData({
			abi: addressResolverAbi,
			functionName: "addr",
			...coinType != null ? { args: [namehash(name), BigInt(coinType)] } : { args: [namehash(name)] }
		});
		const readContractParameters = {
			address: universalResolverAddress,
			abi: universalResolverResolveAbi,
			functionName: "resolve",
			args: [toHex(packetToBytes(name)), functionData],
			blockNumber,
			blockTag
		};
		const readContractAction = getAction$1(client, readContract, "readContract");
		const res = gatewayUrls ? await readContractAction({
			...readContractParameters,
			args: [...readContractParameters.args, gatewayUrls]
		}) : await readContractAction(readContractParameters);
		if (res[0] === "0x") return null;
		const address = decodeFunctionResult({
			abi: addressResolverAbi,
			args: coinType != null ? [namehash(name), BigInt(coinType)] : void 0,
			functionName: "addr",
			data: res[0]
		});
		if (address === "0x") return null;
		if (trim(address) === "0x00") return null;
		return address;
	} catch (err) {
		if (strict) throw err;
		if (isNullUniversalResolverError(err, "resolve")) return null;
		throw err;
	}
}
//#endregion
//#region node_modules/viem/_esm/errors/ens.js
var EnsAvatarInvalidMetadataError = class extends BaseError$3 {
	constructor({ data }) {
		super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
			metaMessages: [
				"- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
				"",
				`Provided data: ${JSON.stringify(data)}`
			],
			name: "EnsAvatarInvalidMetadataError"
		});
	}
};
var EnsAvatarInvalidNftUriError = class extends BaseError$3 {
	constructor({ reason }) {
		super(`ENS NFT avatar URI is invalid. ${reason}`, { name: "EnsAvatarInvalidNftUriError" });
	}
};
var EnsAvatarUriResolutionError = class extends BaseError$3 {
	constructor({ uri }) {
		super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
	}
};
var EnsAvatarUnsupportedNamespaceError = class extends BaseError$3 {
	constructor({ namespace }) {
		super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/ens/avatar/utils.js
var networkRegex = /(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
/** @internal */
async function isImageUri(uri) {
	try {
		const res = await fetch(uri, { method: "HEAD" });
		if (res.status === 200) return res.headers.get("content-type")?.startsWith("image/");
		return false;
	} catch (error) {
		if (typeof error === "object" && typeof error.response !== "undefined") return false;
		if (!globalThis.hasOwnProperty("Image")) return false;
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				resolve(true);
			};
			img.onerror = () => {
				resolve(false);
			};
			img.src = uri;
		});
	}
}
/** @internal */
function getGateway(custom, defaultGateway) {
	if (!custom) return defaultGateway;
	if (custom.endsWith("/")) return custom.slice(0, -1);
	return custom;
}
function resolveAvatarUri({ uri, gatewayUrls }) {
	const isEncoded = base64Regex.test(uri);
	if (isEncoded) return {
		uri,
		isOnChain: true,
		isEncoded
	};
	const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
	const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
	const { protocol, subpath, target, subtarget = "" } = uri.match(networkRegex)?.groups || {};
	const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
	const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
	if (uri.startsWith("http") && !isIPNS && !isIPFS) {
		let replacedUri = uri;
		if (gatewayUrls?.arweave) replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
		return {
			uri: replacedUri,
			isOnChain: false,
			isEncoded: false
		};
	}
	if ((isIPNS || isIPFS) && target) return {
		uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
		isOnChain: false,
		isEncoded: false
	};
	if (protocol === "ar:/" && target) return {
		uri: `${arweaveGateway}/${target}${subtarget || ""}`,
		isOnChain: false,
		isEncoded: false
	};
	let parsedUri = uri.replace(dataURIRegex, "");
	if (parsedUri.startsWith("<svg")) parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
	if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) return {
		uri: parsedUri,
		isOnChain: true,
		isEncoded: false
	};
	throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data) {
	if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) throw new EnsAvatarInvalidMetadataError({ data });
	return data.image || data.image_url || data.image_data;
}
async function getMetadataAvatarUri({ gatewayUrls, uri }) {
	try {
		return await parseAvatarUri({
			gatewayUrls,
			uri: getJsonImage(await fetch(uri).then((res) => res.json()))
		});
	} catch {
		throw new EnsAvatarUriResolutionError({ uri });
	}
}
async function parseAvatarUri({ gatewayUrls, uri }) {
	const { uri: resolvedURI, isOnChain } = resolveAvatarUri({
		uri,
		gatewayUrls
	});
	if (isOnChain) return resolvedURI;
	if (await isImageUri(resolvedURI)) return resolvedURI;
	throw new EnsAvatarUriResolutionError({ uri });
}
function parseNftUri(uri_) {
	let uri = uri_;
	if (uri.startsWith("did:nft:")) uri = uri.replace("did:nft:", "").replace(/_/g, "/");
	const [reference, asset_namespace, tokenID] = uri.split("/");
	const [eip_namespace, chainID] = reference.split(":");
	const [erc_namespace, contractAddress] = asset_namespace.split(":");
	if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155") throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
	if (!chainID) throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
	if (!contractAddress) throw new EnsAvatarInvalidNftUriError({ reason: "Contract address not found" });
	if (!tokenID) throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
	if (!erc_namespace) throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
	return {
		chainID: Number.parseInt(chainID),
		namespace: erc_namespace.toLowerCase(),
		contractAddress,
		tokenID
	};
}
async function getNftTokenUri(client, { nft }) {
	if (nft.namespace === "erc721") return readContract(client, {
		address: nft.contractAddress,
		abi: [{
			name: "tokenURI",
			type: "function",
			stateMutability: "view",
			inputs: [{
				name: "tokenId",
				type: "uint256"
			}],
			outputs: [{
				name: "",
				type: "string"
			}]
		}],
		functionName: "tokenURI",
		args: [BigInt(nft.tokenID)]
	});
	if (nft.namespace === "erc1155") return readContract(client, {
		address: nft.contractAddress,
		abi: [{
			name: "uri",
			type: "function",
			stateMutability: "view",
			inputs: [{
				name: "_id",
				type: "uint256"
			}],
			outputs: [{
				name: "",
				type: "string"
			}]
		}],
		functionName: "uri",
		args: [BigInt(nft.tokenID)]
	});
	throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}
//#endregion
//#region node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
	if (/eip155:/i.test(record)) return parseNftAvatarUri(client, {
		gatewayUrls,
		record
	});
	return parseAvatarUri({
		uri: record,
		gatewayUrls
	});
}
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
	const nft = parseNftUri(record);
	const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({
		uri: await getNftTokenUri(client, { nft }),
		gatewayUrls
	});
	if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
		const encodedJson = isEncoded ? atob(resolvedNftUri.replace("data:application/json;base64,", "")) : resolvedNftUri;
		return parseAvatarUri({
			uri: getJsonImage(JSON.parse(encodedJson)),
			gatewayUrls
		});
	}
	let uriTokenId = nft.tokenID;
	if (nft.namespace === "erc1155") uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
	return getMetadataAvatarUri({
		gatewayUrls,
		uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/ens/getEnsText.js
/**
* Gets a text record for specified ENS name.
*
* - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
*
* Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
*
* Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @param client - Client to use
* @param parameters - {@link GetEnsTextParameters}
* @returns Address for ENS resolver. {@link GetEnsTextReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getEnsText, normalize } from 'viem/ens'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const twitterRecord = await getEnsText(client, {
*   name: normalize('wevm.eth'),
*   key: 'com.twitter',
* })
* // 'wevm_dev'
*/
async function getEnsText(client, { blockNumber, blockTag, name, key, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
	let universalResolverAddress = universalResolverAddress_;
	if (!universalResolverAddress) {
		if (!client.chain) throw new Error("client chain not configured. universalResolverAddress is required.");
		universalResolverAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "ensUniversalResolver"
		});
	}
	try {
		const readContractParameters = {
			address: universalResolverAddress,
			abi: universalResolverResolveAbi,
			functionName: "resolve",
			args: [toHex(packetToBytes(name)), encodeFunctionData({
				abi: textResolverAbi,
				functionName: "text",
				args: [namehash(name), key]
			})],
			blockNumber,
			blockTag
		};
		const readContractAction = getAction$1(client, readContract, "readContract");
		const res = gatewayUrls ? await readContractAction({
			...readContractParameters,
			args: [...readContractParameters.args, gatewayUrls]
		}) : await readContractAction(readContractParameters);
		if (res[0] === "0x") return null;
		const record = decodeFunctionResult({
			abi: textResolverAbi,
			functionName: "text",
			data: res[0]
		});
		return record === "" ? null : record;
	} catch (err) {
		if (strict) throw err;
		if (isNullUniversalResolverError(err, "resolve")) return null;
		throw err;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/ens/getEnsAvatar.js
/**
* Gets the avatar of an ENS name.
*
* - Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
*
* Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.
*
* Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @param client - Client to use
* @param parameters - {@link GetEnsAvatarParameters}
* @returns Avatar URI or `null` if not found. {@link GetEnsAvatarReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getEnsAvatar, normalize } from 'viem/ens'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const ensAvatar = await getEnsAvatar(client, {
*   name: normalize('wevm.eth'),
* })
* // 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
*/
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
	const record = await getAction$1(client, getEnsText, "getEnsText")({
		blockNumber,
		blockTag,
		key: "avatar",
		name,
		universalResolverAddress,
		gatewayUrls,
		strict
	});
	if (!record) return null;
	try {
		return await parseAvatarRecord(client, {
			record,
			gatewayUrls: assetGatewayUrls
		});
	} catch {
		return null;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/ens/getEnsName.js
/**
* Gets primary name for specified address.
*
* - Docs: https://viem.sh/docs/ens/actions/getEnsName
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
*
* Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.
*
* @param client - Client to use
* @param parameters - {@link GetEnsNameParameters}
* @returns Name or `null` if not found. {@link GetEnsNameReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getEnsName } from 'viem/ens'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const ensName = await getEnsName(client, {
*   address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
* })
* // 'wevm.eth'
*/
async function getEnsName(client, { address, blockNumber, blockTag, gatewayUrls, strict, universalResolverAddress: universalResolverAddress_ }) {
	let universalResolverAddress = universalResolverAddress_;
	if (!universalResolverAddress) {
		if (!client.chain) throw new Error("client chain not configured. universalResolverAddress is required.");
		universalResolverAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "ensUniversalResolver"
		});
	}
	const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
	try {
		const readContractParameters = {
			address: universalResolverAddress,
			abi: universalResolverReverseAbi,
			functionName: "reverse",
			args: [toHex(packetToBytes(reverseNode))],
			blockNumber,
			blockTag
		};
		const readContractAction = getAction$1(client, readContract, "readContract");
		const [name, resolvedAddress] = gatewayUrls ? await readContractAction({
			...readContractParameters,
			args: [...readContractParameters.args, gatewayUrls]
		}) : await readContractAction(readContractParameters);
		if (address.toLowerCase() !== resolvedAddress.toLowerCase()) return null;
		return name;
	} catch (err) {
		if (strict) throw err;
		if (isNullUniversalResolverError(err, "reverse")) return null;
		throw err;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/ens/getEnsResolver.js
/**
* Gets resolver for ENS name.
*
* - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
*
* Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.
*
* Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
*
* @param client - Client to use
* @param parameters - {@link GetEnsResolverParameters}
* @returns Address for ENS resolver. {@link GetEnsResolverReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getEnsResolver, normalize } from 'viem/ens'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const resolverAddress = await getEnsResolver(client, {
*   name: normalize('wevm.eth'),
* })
* // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
*/
async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_ }) {
	let universalResolverAddress = universalResolverAddress_;
	if (!universalResolverAddress) {
		if (!client.chain) throw new Error("client chain not configured. universalResolverAddress is required.");
		universalResolverAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "ensUniversalResolver"
		});
	}
	const [resolverAddress] = await getAction$1(client, readContract, "readContract")({
		address: universalResolverAddress,
		abi: [{
			inputs: [{ type: "bytes" }],
			name: "findResolver",
			outputs: [{ type: "address" }, { type: "bytes32" }],
			stateMutability: "view",
			type: "function"
		}],
		functionName: "findResolver",
		args: [toHex(packetToBytes(name))],
		blockNumber,
		blockTag
	});
	return resolverAddress;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/createAccessList.js
/**
* Creates an EIP-2930 access list.
*
* - Docs: https://viem.sh/docs/actions/public/createAccessList
* - JSON-RPC Methods: `eth_createAccessList`
*
* @param client - Client to use
* @param parameters - {@link CreateAccessListParameters}
* @returns The access list. {@link CreateAccessListReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createAccessList } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const data = await createAccessList(client, {
*   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
*   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
*   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
* })
*/
async function createAccessList(client, args) {
	const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
	const account = account_ ? parseAccount(account_) : void 0;
	try {
		assertRequest(args);
		const block = (blockNumber ? numberToHex(blockNumber) : void 0) || blockTag;
		const chainFormat = client.chain?.formatters?.transactionRequest?.format;
		const request = (chainFormat || formatTransactionRequest)({
			...extract(rest, { format: chainFormat }),
			from: account?.address,
			blobs,
			data,
			gas,
			gasPrice,
			maxFeePerBlobGas,
			maxFeePerGas,
			maxPriorityFeePerGas,
			to,
			value
		});
		const response = await client.request({
			method: "eth_createAccessList",
			params: [request, block]
		});
		return {
			accessList: response.accessList,
			gasUsed: BigInt(response.gasUsed)
		};
	} catch (err) {
		throw getCallError(err, {
			...args,
			account,
			chain: client.chain
		});
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/createBlockFilter.js
/**
* Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
*
* - Docs: https://viem.sh/docs/actions/public/createBlockFilter
* - JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)
*
* @param client - Client to use
* @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createBlockFilter } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createBlockFilter(client)
* // { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
*/
async function createBlockFilter(client) {
	const getRequest = createFilterRequestScope(client, { method: "eth_newBlockFilter" });
	const id = await client.request({ method: "eth_newBlockFilter" });
	return {
		id,
		request: getRequest(id),
		type: "block"
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/createEventFilter.js
/**
* Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
*
* - Docs: https://viem.sh/docs/actions/public/createEventFilter
* - JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)
*
* @param client - Client to use
* @param parameters - {@link CreateEventFilterParameters}
* @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateEventFilterReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createEventFilter } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createEventFilter(client, {
*   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
* })
*/
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
	const events = events_ ?? (event ? [event] : void 0);
	const getRequest = createFilterRequestScope(client, { method: "eth_newFilter" });
	let topics = [];
	if (events) {
		topics = [events.flatMap((event) => encodeEventTopics({
			abi: [event],
			eventName: event.name,
			args
		}))];
		if (event) topics = topics[0];
	}
	const id = await client.request({
		method: "eth_newFilter",
		params: [{
			address,
			fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
			toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
			...topics.length ? { topics } : {}
		}]
	});
	return {
		abi: events,
		args,
		eventName: event ? event.name : void 0,
		fromBlock,
		id,
		request: getRequest(id),
		strict: Boolean(strict),
		toBlock,
		type: "event"
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
/**
* Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
*
* - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
* - JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)
*
* @param client - Client to use
* @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createPendingTransactionFilter } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createPendingTransactionFilter(client)
* // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
*/
async function createPendingTransactionFilter(client) {
	const getRequest = createFilterRequestScope(client, { method: "eth_newPendingTransactionFilter" });
	const id = await client.request({ method: "eth_newPendingTransactionFilter" });
	return {
		id,
		request: getRequest(id),
		type: "transaction"
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getBlobBaseFee.js
/**
* Returns the base fee per blob gas in wei.
*
* - Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
* - JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)
*
* @param client - Client to use
* @returns The blob base fee (in wei). {@link GetBlobBaseFeeReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBlobBaseFee } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const blobBaseFee = await getBlobBaseFee(client)
*/
async function getBlobBaseFee(client) {
	const baseFee = await client.request({ method: "eth_blobBaseFee" });
	return BigInt(baseFee);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
/**
* Returns the number of Transactions at a block number, hash, or tag.
*
* - Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
* - JSON-RPC Methods:
*   - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
*   - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.
*
* @param client - Client to use
* @param parameters - {@link GetBlockTransactionCountParameters}
* @returns The block transaction count. {@link GetBlockTransactionCountReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getBlockTransactionCount } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const count = await getBlockTransactionCount(client)
*/
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	let count;
	if (blockHash) count = await client.request({
		method: "eth_getBlockTransactionCountByHash",
		params: [blockHash]
	}, { dedupe: true });
	else count = await client.request({
		method: "eth_getBlockTransactionCountByNumber",
		params: [blockNumberHex || blockTag]
	}, { dedupe: Boolean(blockNumberHex) });
	return hexToNumber(count);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getCode.js
/**
* Retrieves the bytecode at an address.
*
* - Docs: https://viem.sh/docs/contract/getCode
* - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)
*
* @param client - Client to use
* @param parameters - {@link GetCodeParameters}
* @returns The contract's bytecode. {@link GetCodeReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getCode } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const code = await getCode(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
* })
*/
async function getCode(client, { address, blockNumber, blockTag = "latest" }) {
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	const hex = await client.request({
		method: "eth_getCode",
		params: [address, blockNumberHex || blockTag]
	}, { dedupe: Boolean(blockNumberHex) });
	if (hex === "0x") return void 0;
	return hex;
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/feeHistory.js
function formatFeeHistory(feeHistory) {
	return {
		baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
		gasUsedRatio: feeHistory.gasUsedRatio,
		oldestBlock: BigInt(feeHistory.oldestBlock),
		reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getFeeHistory.js
/**
* Returns a collection of historical gas information.
*
* - Docs: https://viem.sh/docs/actions/public/getFeeHistory
* - JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)
*
* @param client - Client to use
* @param parameters - {@link GetFeeHistoryParameters}
* @returns The gas estimate (in wei). {@link GetFeeHistoryReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getFeeHistory } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const feeHistory = await getFeeHistory(client, {
*   blockCount: 4,
*   rewardPercentiles: [25, 75],
* })
*/
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
	const blockNumberHex = blockNumber ? numberToHex(blockNumber) : void 0;
	return formatFeeHistory(await client.request({
		method: "eth_feeHistory",
		params: [
			numberToHex(blockCount),
			blockNumberHex || blockTag,
			rewardPercentiles
		]
	}, { dedupe: Boolean(blockNumberHex) }));
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getFilterLogs.js
/**
* Returns a list of event logs since the filter was created.
*
* - Docs: https://viem.sh/docs/actions/public/getFilterLogs
* - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)
*
* `getFilterLogs` is only compatible with **event filters**.
*
* @param client - Client to use
* @param parameters - {@link GetFilterLogsParameters}
* @returns A list of event logs. {@link GetFilterLogsReturnType}
*
* @example
* import { createPublicClient, http, parseAbiItem } from 'viem'
* import { mainnet } from 'viem/chains'
* import { createEventFilter, getFilterLogs } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const filter = await createEventFilter(client, {
*   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
*   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
* })
* const logs = await getFilterLogs(client, { filter })
*/
async function getFilterLogs(_client, { filter }) {
	const strict = filter.strict ?? false;
	const formattedLogs = (await filter.request({
		method: "eth_getFilterLogs",
		params: [filter.id]
	})).map((log) => formatLog(log));
	if (!filter.abi) return formattedLogs;
	return parseEventLogs({
		abi: filter.abi,
		logs: formattedLogs,
		strict
	});
}
//#endregion
//#region node_modules/viem/_esm/errors/typedData.js
var InvalidDomainError = class extends BaseError$3 {
	constructor({ domain }) {
		super(`Invalid domain "${stringify$1(domain)}".`, { metaMessages: ["Must be a valid EIP-712 domain."] });
	}
};
var InvalidPrimaryTypeError = class extends BaseError$3 {
	constructor({ primaryType, types }) {
		super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
			docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
			metaMessages: ["Check that the primary type is a key in `types`."]
		});
	}
};
var InvalidStructTypeError = class extends BaseError$3 {
	constructor({ type }) {
		super(`Struct type "${type}" is invalid.`, {
			metaMessages: ["Struct type must not be a Solidity type."],
			name: "InvalidStructTypeError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData(parameters) {
	const { domain = {}, message, primaryType } = parameters;
	const types = {
		EIP712Domain: getTypesForEIP712Domain({ domain }),
		...parameters.types
	};
	validateTypedData({
		domain,
		message,
		primaryType,
		types
	});
	const parts = ["0x1901"];
	if (domain) parts.push(hashDomain({
		domain,
		types
	}));
	if (primaryType !== "EIP712Domain") parts.push(hashStruct({
		data: message,
		primaryType,
		types
	}));
	return keccak256$1(concat$1(parts));
}
function hashDomain({ domain, types }) {
	return hashStruct({
		data: domain,
		primaryType: "EIP712Domain",
		types
	});
}
function hashStruct({ data, primaryType, types }) {
	const encoded = encodeData$1({
		data,
		primaryType,
		types
	});
	return keccak256$1(encoded);
}
function encodeData$1({ data, primaryType, types }) {
	const encodedTypes = [{ type: "bytes32" }];
	const encodedValues = [hashType({
		primaryType,
		types
	})];
	for (const field of types[primaryType]) {
		const [type, value] = encodeField({
			types,
			name: field.name,
			type: field.type,
			value: data[field.name]
		});
		encodedTypes.push(type);
		encodedValues.push(value);
	}
	return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
	const encodedHashType = toHex(encodeType({
		primaryType,
		types
	}));
	return keccak256$1(encodedHashType);
}
function encodeType({ primaryType, types }) {
	let result = "";
	const unsortedDeps = findTypeDependencies({
		primaryType,
		types
	});
	unsortedDeps.delete(primaryType);
	const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
	for (const type of deps) result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
	return result;
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
	const primaryType = primaryType_.match(/^\w*/u)?.[0];
	if (results.has(primaryType) || types[primaryType] === void 0) return results;
	results.add(primaryType);
	for (const field of types[primaryType]) findTypeDependencies({
		primaryType: field.type,
		types
	}, results);
	return results;
}
function encodeField({ types, name, type, value }) {
	if (types[type] !== void 0) return [{ type: "bytes32" }, keccak256$1(encodeData$1({
		data: value,
		primaryType: type,
		types
	}))];
	if (type === "bytes") {
		value = `0x${(value.length % 2 ? "0" : "") + value.slice(2)}`;
		return [{ type: "bytes32" }, keccak256$1(value)];
	}
	if (type === "string") return [{ type: "bytes32" }, keccak256$1(toHex(value))];
	if (type.lastIndexOf("]") === type.length - 1) {
		const parsedType = type.slice(0, type.lastIndexOf("["));
		const typeValuePairs = value.map((item) => encodeField({
			name,
			type: parsedType,
			types,
			value: item
		}));
		return [{ type: "bytes32" }, keccak256$1(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))];
	}
	return [{ type }, value];
}
//#endregion
//#region node_modules/viem/_esm/utils/typedData.js
function validateTypedData(parameters) {
	const { domain, message, primaryType, types } = parameters;
	const validateData = (struct, data) => {
		for (const param of struct) {
			const { name, type } = param;
			const value = data[name];
			const integerMatch = type.match(integerRegex$2);
			if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
				const [_type, base, size_] = integerMatch;
				numberToHex(value, {
					signed: base === "int",
					size: Number.parseInt(size_) / 8
				});
			}
			if (type === "address" && typeof value === "string" && !isAddress(value)) throw new InvalidAddressError$1({ address: value });
			const bytesMatch = type.match(bytesRegex$2);
			if (bytesMatch) {
				const [_type, size_] = bytesMatch;
				if (size_ && size$4(value) !== Number.parseInt(size_)) throw new BytesSizeMismatchError$1({
					expectedSize: Number.parseInt(size_),
					givenSize: size$4(value)
				});
			}
			const struct = types[type];
			if (struct) {
				validateReference(type);
				validateData(struct, value);
			}
		}
	};
	if (types.EIP712Domain && domain) {
		if (typeof domain !== "object") throw new InvalidDomainError({ domain });
		validateData(types.EIP712Domain, domain);
	}
	if (primaryType !== "EIP712Domain") {
		if (types[primaryType]) validateData(types[primaryType], message);
		else throw new InvalidPrimaryTypeError({
			primaryType,
			types
		});
	}
}
function getTypesForEIP712Domain({ domain }) {
	return [
		typeof domain?.name === "string" && {
			name: "name",
			type: "string"
		},
		domain?.version && {
			name: "version",
			type: "string"
		},
		(typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
			name: "chainId",
			type: "uint256"
		},
		domain?.verifyingContract && {
			name: "verifyingContract",
			type: "address"
		},
		domain?.salt && {
			name: "salt",
			type: "bytes32"
		}
	].filter(Boolean);
}
/** @internal */
function validateReference(type) {
	if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int")) throw new InvalidStructTypeError({ type });
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/transactionReceipt.js
var receiptStatuses = {
	"0x0": "reverted",
	"0x1": "success"
};
function formatTransactionReceipt(transactionReceipt) {
	const receipt = {
		...transactionReceipt,
		blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
		contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
		cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
		effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
		gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
		logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
		to: transactionReceipt.to ? transactionReceipt.to : null,
		transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
		status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
		type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
	};
	if (transactionReceipt.blobGasPrice) receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
	if (transactionReceipt.blobGasUsed) receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
	return receipt;
}
//#endregion
//#region node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = "Ethereum Signed Message:\n";
//#endregion
//#region node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
function toPrefixedMessage(message_) {
	const message = (() => {
		if (typeof message_ === "string") return stringToHex(message_);
		if (typeof message_.raw === "string") return message_.raw;
		return bytesToHex(message_.raw);
	})();
	return concat$1([stringToHex(`${presignMessagePrefix}${size$4(message)}`), message]);
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
	return keccak256$1(toPrefixedMessage(message), to_);
}
//#endregion
//#region node_modules/viem/_esm/constants/bytes.js
var erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
//#endregion
//#region node_modules/viem/_esm/utils/signature/isErc6492Signature.js
/** Whether or not the signature is an ERC-6492 formatted signature. */
function isErc6492Signature(signature) {
	return sliceHex(signature, -32) === erc6492MagicBytes;
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/serializeErc6492Signature.js
/**
* @description Serializes a ERC-6492 flavoured signature into hex format.
*
* @param signature ERC-6492 signature in object format.
* @returns ERC-6492 signature in hex format.
*
* @example
* serializeSignature({ address: '0x...', data: '0x...', signature: '0x...' })
* // '0x000000000000000000000000cafebabecafebabecafebabecafebabecafebabe000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000004deadbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041a461f509887bd19e312c0c58467ce8ff8e300d3c1a90b608a760c5b80318eaf15fe57c96f9175d6cd4daad4663763baa7e78836e067d0163e9a2ccf2ff753f5b1b000000000000000000000000000000000000000000000000000000000000006492649264926492649264926492649264926492649264926492649264926492'
*/
function serializeErc6492Signature(parameters) {
	const { address, data, signature, to = "hex" } = parameters;
	const signature_ = concatHex([encodeAbiParameters([
		{ type: "address" },
		{ type: "bytes" },
		{ type: "bytes" }
	], [
		address,
		data,
		signature
	]), erc6492MagicBytes]);
	if (to === "hex") return signature_;
	return hexToBytes(signature_);
}
//#endregion
//#region node_modules/viem/_esm/utils/formatters/proof.js
function formatStorageProof(storageProof) {
	return storageProof.map((proof) => ({
		...proof,
		value: BigInt(proof.value)
	}));
}
function formatProof(proof) {
	return {
		...proof,
		balance: proof.balance ? BigInt(proof.balance) : void 0,
		nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
		storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getProof.js
/**
* Returns the account and storage values of the specified account including the Merkle-proof.
*
* - Docs: https://viem.sh/docs/actions/public/getProof
* - JSON-RPC Methods:
*   - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)
*
* @param client - Client to use
* @param parameters - {@link GetProofParameters}
* @returns Proof data. {@link GetProofReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getProof } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const block = await getProof(client, {
*  address: '0x...',
*  storageKeys: ['0x...'],
* })
*/
async function getProof(client, { address, blockNumber, blockTag: blockTag_, storageKeys }) {
	const blockTag = blockTag_ ?? "latest";
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	return formatProof(await client.request({
		method: "eth_getProof",
		params: [
			address,
			storageKeys,
			blockNumberHex || blockTag
		]
	}));
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getStorageAt.js
/**
* Returns the value from a storage slot at a given address.
*
* - Docs: https://viem.sh/docs/contract/getStorageAt
* - JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)
*
* @param client - Client to use
* @param parameters - {@link GetStorageAtParameters}
* @returns The value of the storage slot. {@link GetStorageAtReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getStorageAt } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const code = await getStorageAt(client, {
*   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*   slot: toHex(0),
* })
*/
async function getStorageAt(client, { address, blockNumber, blockTag = "latest", slot }) {
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	return await client.request({
		method: "eth_getStorageAt",
		params: [
			address,
			slot,
			blockNumberHex || blockTag
		]
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getTransaction.js
/**
* Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.
*
* - Docs: https://viem.sh/docs/actions/public/getTransaction
* - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
* - JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)
*
* @param client - Client to use
* @param parameters - {@link GetTransactionParameters}
* @returns The transaction information. {@link GetTransactionReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getTransaction } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const transaction = await getTransaction(client, {
*   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
* })
*/
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash, index }) {
	const blockTag = blockTag_ || "latest";
	const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
	let transaction = null;
	if (hash) transaction = await client.request({
		method: "eth_getTransactionByHash",
		params: [hash]
	}, { dedupe: true });
	else if (blockHash) transaction = await client.request({
		method: "eth_getTransactionByBlockHashAndIndex",
		params: [blockHash, numberToHex(index)]
	}, { dedupe: true });
	else if (blockNumberHex || blockTag) transaction = await client.request({
		method: "eth_getTransactionByBlockNumberAndIndex",
		params: [blockNumberHex || blockTag, numberToHex(index)]
	}, { dedupe: Boolean(blockNumberHex) });
	if (!transaction) throw new TransactionNotFoundError({
		blockHash,
		blockNumber,
		blockTag,
		hash,
		index
	});
	return (client.chain?.formatters?.transaction?.format || formatTransaction)(transaction);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
/**
* Returns the number of blocks passed (confirmations) since the transaction was processed on a block.
*
* - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
* - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
* - JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)
*
* @param client - Client to use
* @param parameters - {@link GetTransactionConfirmationsParameters}
* @returns The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. {@link GetTransactionConfirmationsReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getTransactionConfirmations } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const confirmations = await getTransactionConfirmations(client, {
*   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
* })
*/
async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
	const [blockNumber, transaction] = await Promise.all([getAction$1(client, getBlockNumber, "getBlockNumber")({}), hash ? getAction$1(client, getTransaction, "getTransaction")({ hash }) : void 0]);
	const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
	if (!transactionBlockNumber) return 0n;
	return blockNumber - transactionBlockNumber + 1n;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/getTransactionReceipt.js
/**
* Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.
*
* - Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
* - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
* - JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionreceipt)
*
* @param client - Client to use
* @param parameters - {@link GetTransactionReceiptParameters}
* @returns The transaction receipt. {@link GetTransactionReceiptReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { getTransactionReceipt } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const transactionReceipt = await getTransactionReceipt(client, {
*   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
* })
*/
async function getTransactionReceipt(client, { hash }) {
	const receipt = await client.request({
		method: "eth_getTransactionReceipt",
		params: [hash]
	}, { dedupe: true });
	if (!receipt) throw new TransactionReceiptNotFoundError({ hash });
	return (client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt)(receipt);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/multicall.js
/**
* Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).
*
* - Docs: https://viem.sh/docs/contract/multicall
*
* @param client - Client to use
* @param parameters - {@link MulticallParameters}
* @returns An array of results with accompanying status. {@link MulticallReturnType}
*
* @example
* import { createPublicClient, http, parseAbi } from 'viem'
* import { mainnet } from 'viem/chains'
* import { multicall } from 'viem/contract'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const abi = parseAbi([
*   'function balanceOf(address) view returns (uint256)',
*   'function totalSupply() view returns (uint256)',
* ])
* const results = await multicall(client, {
*   contracts: [
*     {
*       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*       abi,
*       functionName: 'balanceOf',
*       args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
*     },
*     {
*       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
*       abi,
*       functionName: 'totalSupply',
*     },
*   ],
* })
* // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
*/
async function multicall(client, parameters) {
	const { allowFailure = true, batchSize: batchSize_, blockNumber, blockTag, multicallAddress: multicallAddress_, stateOverride } = parameters;
	const contracts = parameters.contracts;
	const batchSize = batchSize_ ?? (typeof client.batch?.multicall === "object" && client.batch.multicall.batchSize || 1024);
	let multicallAddress = multicallAddress_;
	if (!multicallAddress) {
		if (!client.chain) throw new Error("client chain not configured. multicallAddress is required.");
		multicallAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: "multicall3"
		});
	}
	const chunkedCalls = [[]];
	let currentChunk = 0;
	let currentChunkSize = 0;
	for (let i = 0; i < contracts.length; i++) {
		const { abi, address, args, functionName } = contracts[i];
		try {
			const callData = encodeFunctionData({
				abi,
				args,
				functionName
			});
			currentChunkSize += (callData.length - 2) / 2;
			if (batchSize > 0 && currentChunkSize > batchSize && chunkedCalls[currentChunk].length > 0) {
				currentChunk++;
				currentChunkSize = (callData.length - 2) / 2;
				chunkedCalls[currentChunk] = [];
			}
			chunkedCalls[currentChunk] = [...chunkedCalls[currentChunk], {
				allowFailure: true,
				callData,
				target: address
			}];
		} catch (err) {
			const error = getContractError(err, {
				abi,
				address,
				args,
				docsPath: "/docs/contract/multicall",
				functionName
			});
			if (!allowFailure) throw error;
			chunkedCalls[currentChunk] = [...chunkedCalls[currentChunk], {
				allowFailure: true,
				callData: "0x",
				target: address
			}];
		}
	}
	const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction$1(client, readContract, "readContract")({
		abi: multicall3Abi,
		address: multicallAddress,
		args: [calls],
		blockNumber,
		blockTag,
		functionName: "aggregate3",
		stateOverride
	})));
	const results = [];
	for (let i = 0; i < aggregate3Results.length; i++) {
		const result = aggregate3Results[i];
		if (result.status === "rejected") {
			if (!allowFailure) throw result.reason;
			for (let j = 0; j < chunkedCalls[i].length; j++) results.push({
				status: "failure",
				error: result.reason,
				result: void 0
			});
			continue;
		}
		const aggregate3Result = result.value;
		for (let j = 0; j < aggregate3Result.length; j++) {
			const { returnData, success } = aggregate3Result[j];
			const { callData } = chunkedCalls[i][j];
			const { abi, address, functionName, args } = contracts[results.length];
			try {
				if (callData === "0x") throw new AbiDecodingZeroDataError();
				if (!success) throw new RawContractError({ data: returnData });
				const result = decodeFunctionResult({
					abi,
					args,
					data: returnData,
					functionName
				});
				results.push(allowFailure ? {
					result,
					status: "success"
				} : result);
			} catch (err) {
				const error = getContractError(err, {
					abi,
					address,
					args,
					docsPath: "/docs/contract/multicall",
					functionName
				});
				if (!allowFailure) throw error;
				results.push({
					error,
					result: void 0,
					status: "failure"
				});
			}
		}
	}
	if (results.length !== contracts.length) throw new BaseError$3("multicall results mismatch");
	return results;
}
//#endregion
//#region node_modules/ox/_esm/core/version.js
/** @internal */
var version$1 = "0.1.1";
//#endregion
//#region node_modules/ox/_esm/core/internal/errors.js
/** @internal */
function getVersion() {
	return version$1;
}
//#endregion
//#region node_modules/ox/_esm/core/Errors.js
/**
* Base error class inherited by all errors thrown by ox.
*
* @example
* ```ts
* import { Errors } from 'ox'
* throw new Errors.BaseError('An error occurred')
* ```
*/
var BaseError$1 = class BaseError$1 extends Error {
	constructor(shortMessage, options = {}) {
		const details = (() => {
			if (options.cause instanceof BaseError$1) {
				if (options.cause.details) return options.cause.details;
				if (options.cause.shortMessage) return options.cause.shortMessage;
			}
			if (options.cause?.message) return options.cause.message;
			return options.details;
		})();
		const docsPath = (() => {
			if (options.cause instanceof BaseError$1) return options.cause.docsPath || options.docsPath;
			return options.docsPath;
		})();
		const docs = `https://oxlib.sh${docsPath ?? ""}`;
		const message = [
			shortMessage || "An error occurred.",
			...options.metaMessages ? ["", ...options.metaMessages] : [],
			...details || docsPath ? [
				"",
				details ? `Details: ${details}` : void 0,
				docsPath ? `See: ${docs}` : void 0
			] : []
		].filter((x) => typeof x === "string").join("\n");
		super(message, options.cause ? { cause: options.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docs", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "cause", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: `ox@${getVersion()}`
		});
		this.cause = options.cause;
		this.details = details;
		this.docs = docs;
		this.docsPath = docsPath;
		this.shortMessage = shortMessage;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
/** @internal */
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause) return walk(err.cause, fn);
	return fn ? null : err;
}
//#endregion
//#region node_modules/ox/_esm/core/Json.js
var bigIntSuffix = "#__bigint";
/**
* Stringifies a value to its JSON representation, with support for `bigint`.
*
* @example
* ```ts twoslash
* import { Json } from 'ox'
*
* const json = Json.stringify({
*   foo: 'bar',
*   baz: 69420694206942069420694206942069420694206942069420n,
* })
* // @log: '{"foo":"bar","baz":"69420694206942069420694206942069420694206942069420#__bigint"}'
* ```
*
* @param value - The value to stringify.
* @param replacer - A function that transforms the results. It is passed the key and value of the property, and must return the value to be used in the JSON string. If this function returns `undefined`, the property is not included in the resulting JSON string.
* @param space - A string or number that determines the indentation of the JSON string. If it is a number, it indicates the number of spaces to use as indentation; if it is a string (e.g. `'\t'`), it uses the string as the indentation character.
* @returns The JSON string.
*/
function stringify(value, replacer, space) {
	return JSON.stringify(value, (key, value) => {
		if (typeof replacer === "function") return replacer(key, value);
		if (typeof value === "bigint") return value.toString() + bigIntSuffix;
		return value;
	}, space);
}
//#endregion
//#region node_modules/ox/_esm/core/internal/bytes.js
/** @internal */
function assertSize$1(bytes, size_) {
	if (size$2(bytes) > size_) throw new SizeOverflowError$1({
		givenSize: size$2(bytes),
		maxSize: size_
	});
}
/** @internal */
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
/** @internal */
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/** @internal */
function pad$1(bytes, options = {}) {
	const { dir, size = 32 } = options;
	if (size === 0) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError$1({
		size: bytes.length,
		targetSize: size,
		type: "Bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
//#endregion
//#region node_modules/ox/_esm/core/internal/hex.js
/** @internal */
function assertSize(hex, size_) {
	if (size$1(hex) > size_) throw new SizeOverflowError({
		givenSize: size$1(hex),
		maxSize: size_
	});
}
/** @internal */
function assertStartOffset(value, start) {
	if (typeof start === "number" && start > 0 && start > size$1(value) - 1) throw new SliceOffsetOutOfBoundsError({
		offset: start,
		position: "start",
		size: size$1(value)
	});
}
/** @internal */
function assertEndOffset(value, start, end) {
	if (typeof start === "number" && typeof end === "number" && size$1(value) !== end - start) throw new SliceOffsetOutOfBoundsError({
		offset: end,
		position: "end",
		size: size$1(value)
	});
}
/** @internal */
function pad(hex_, options = {}) {
	const { dir, size = 32 } = options;
	if (size === 0) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "Hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
//#endregion
//#region node_modules/ox/_esm/core/Bytes.js
var encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
* Instantiates a {@link ox#Bytes.Bytes} value from a `Uint8Array`, a hex string, or an array of unsigned 8-bit integers.
*
* :::tip
*
* To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
*
* - `Bytes.fromBoolean`
*
* - `Bytes.fromString`
*
* - `Bytes.fromNumber`
*
* :::
*
* @example
* ```ts twoslash
* // @noErrors
* import { Bytes } from 'ox'
*
* const data = Bytes.from([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
*
* const data = Bytes.from('0xdeadbeef')
* // @log: Uint8Array([222, 173, 190, 239])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function from$3(value) {
	if (value instanceof Uint8Array) return value;
	if (typeof value === "string") return fromHex(value);
	return fromArray(value);
}
/**
* Converts an array of unsigned 8-bit integers into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromArray([255, 124, 5, 4])
* // @log: Uint8Array([255, 124, 5, 4])
* ```
*
* @param value - Value to convert.
* @returns A {@link ox#Bytes.Bytes} instance.
*/
function fromArray(value) {
	return value instanceof Uint8Array ? value : new Uint8Array(value);
}
/**
* Encodes a {@link ox#Hex.Hex} value into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromHex('0x48656c6c6f20776f726c6421', { size: 32 })
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
* ```
*
* @param value - {@link ox#Hex.Hex} value to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromHex(value, options = {}) {
	const { size } = options;
	let hex = value;
	if (size) {
		assertSize(value, size);
		hex = padRight(value, size);
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index = 0, j = 0; index < length; index++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError$1(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
		bytes[index] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
/**
* Encodes a string into {@link ox#Bytes.Bytes}.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromString('Hello world!')
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
* ```
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* const data = Bytes.fromString('Hello world!', { size: 32 })
* // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
* ```
*
* @param value - String to encode.
* @param options - Encoding options.
* @returns Encoded {@link ox#Bytes.Bytes}.
*/
function fromString$1(value, options = {}) {
	const { size } = options;
	const bytes = encoder$1.encode(value);
	if (typeof size === "number") {
		assertSize$1(bytes, size);
		return padRight$1(bytes, size);
	}
	return bytes;
}
/**
* Pads a {@link ox#Bytes.Bytes} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.padRight(Bytes.from([1]), 4)
* // @log: Uint8Array([1, 0, 0, 0])
* ```
*
* @param value - {@link ox#Bytes.Bytes} value to pad.
* @param size - Size to pad the {@link ox#Bytes.Bytes} value to.
* @returns Padded {@link ox#Bytes.Bytes} value.
*/
function padRight$1(value, size) {
	return pad$1(value, {
		dir: "right",
		size
	});
}
/**
* Retrieves the size of a {@link ox#Bytes.Bytes} value.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.size(Bytes.from([1, 2, 3, 4]))
* // @log: 4
* ```
*
* @param value - {@link ox#Bytes.Bytes} value.
* @returns Size of the {@link ox#Bytes.Bytes} value.
*/
function size$2(value) {
	return value.length;
}
/**
* Thrown when a size exceeds the maximum allowed size.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.fromString('Hello World!', { size: 8 })
* // @error: Bytes.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError$1 = class extends BaseError$1 {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SizeOverflowError"
		});
	}
};
/**
* Thrown when a the padding size exceeds the maximum allowed size.
*
* @example
* ```ts twoslash
* import { Bytes } from 'ox'
*
* Bytes.padLeft(Bytes.fromString('Hello World!'), 8)
* // @error: [Bytes.SizeExceedsPaddingSizeError: Bytes size (`12`) exceeds padding size (`8`).
* ```
*/
var SizeExceedsPaddingSizeError$1 = class extends BaseError$1 {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Bytes.SizeExceedsPaddingSizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Hex.js
var encoder = /*#__PURE__*/ new TextEncoder();
var hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Asserts if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('abc')
* // @error: InvalidHexValueTypeError:
* // @error: Value `"abc"` of type `string` is an invalid hex type.
* // @error: Hex types must be represented as `"0x\${string}"`.
* ```
*
* @param value - The value to assert.
* @param options - Options.
*/
function assert$1(value, options = {}) {
	const { strict = false } = options;
	if (!value) throw new InvalidHexTypeError(value);
	if (typeof value !== "string") throw new InvalidHexTypeError(value);
	if (strict) {
		if (!/^0x[0-9a-fA-F]*$/.test(value)) throw new InvalidHexValueError(value);
	}
	if (!value.startsWith("0x")) throw new InvalidHexValueError(value);
}
/**
* Concatenates two or more {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.concat('0x123', '0x456')
* // @log: '0x123456'
* ```
*
* @param values - The {@link ox#Hex.Hex} values to concatenate.
* @returns The concatenated {@link ox#Hex.Hex} value.
*/
function concat(...values) {
	return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
/**
* Encodes a boolean into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromBoolean(true)
* // @log: '0x1'
*
* Hex.fromBoolean(false)
* // @log: '0x0'
*
* Hex.fromBoolean(true, { size: 32 })
* // @log: '0x0000000000000000000000000000000000000000000000000000000000000001'
* ```
*
* @param value - The boolean value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromBoolean(value, options = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof options.size === "number") {
		assertSize(hex, options.size);
		return padLeft(hex, options.size);
	}
	return hex;
}
/**
* Encodes a {@link ox#Bytes.Bytes} value into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.fromBytes(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
* // @log: '0x48656c6c6f20576f726c6421'
* ```
*
* @param value - The {@link ox#Bytes.Bytes} value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromBytes(value, options = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof options.size === "number") {
		assertSize(hex, options.size);
		return padRight(hex, options.size);
	}
	return hex;
}
/**
* Encodes a number or bigint into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420)
* // @log: '0x1a4'
*
* Hex.fromNumber(420, { size: 32 })
* // @log: '0x00000000000000000000000000000000000000000000000000000000000001a4'
* ```
*
* @param value - The number or bigint value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromNumber(value, options = {}) {
	const { signed, size } = options;
	const value_ = BigInt(value);
	let maxValue;
	if (size) {
		if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
		else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	} else if (typeof value === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value_ > maxValue || value_ < minValue) {
		const suffix = typeof value === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value}${suffix}`
		});
	}
	const hex = `0x${(signed && value_ < 0 ? (1n << BigInt(size * 8)) + BigInt(value_) : value_).toString(16)}`;
	if (size) return padLeft(hex, size);
	return hex;
}
/**
* Encodes a string into a {@link ox#Hex.Hex} value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
* Hex.fromString('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* Hex.fromString('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
* ```
*
* @param value - The string value to encode.
* @param options - Options.
* @returns The encoded {@link ox#Hex.Hex} value.
*/
function fromString(value, options = {}) {
	return fromBytes(encoder.encode(value), options);
}
/**
* Pads a {@link ox#Hex.Hex} value to the left with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1234', 4)
* // @log: '0x00001234'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padLeft(value, size) {
	return pad(value, {
		dir: "left",
		size
	});
}
/**
* Pads a {@link ox#Hex.Hex} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
*
* @example
* ```ts
* import { Hex } from 'ox'
*
* Hex.padRight('0x1234', 4)
* // @log: '0x12340000'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to pad.
* @param size - The size (in bytes) of the output hex value.
* @returns The padded {@link ox#Hex.Hex} value.
*/
function padRight(value, size) {
	return pad(value, {
		dir: "right",
		size
	});
}
/**
* Returns a section of a {@link ox#Bytes.Bytes} value given a start/end bytes offset.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 1, 4)
* // @log: '0x234567'
* ```
*
* @param value - The {@link ox#Hex.Hex} value to slice.
* @param start - The start offset (in bytes).
* @param end - The end offset (in bytes).
* @param options - Options.
* @returns The sliced {@link ox#Hex.Hex} value.
*/
function slice(value, start, end, options = {}) {
	const { strict } = options;
	assertStartOffset(value, start);
	const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
	if (strict) assertEndOffset(value_, start, end);
	return value_;
}
/**
* Retrieves the size of a {@link ox#Hex.Hex} value (in bytes).
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.size('0xdeadbeef')
* // @log: 4
* ```
*
* @param value - The {@link ox#Hex.Hex} value to get the size of.
* @returns The size of the {@link ox#Hex.Hex} value (in bytes).
*/
function size$1(value) {
	return Math.ceil((value.length - 2) / 2);
}
/**
* Checks if the given value is {@link ox#Hex.Hex}.
*
* @example
* ```ts twoslash
* import { Bytes, Hex } from 'ox'
*
* Hex.validate('0xdeadbeef')
* // @log: true
*
* Hex.validate(Bytes.from([1, 2, 3]))
* // @log: false
* ```
*
* @param value - The value to check.
* @param options - Options.
* @returns `true` if the value is a {@link ox#Hex.Hex}, `false` otherwise.
*/
function validate$1(value, options = {}) {
	const { strict = false } = options;
	try {
		assert$1(value, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when the provided integer is out of range, and cannot be represented as a hex value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromNumber(420182738912731283712937129)
* // @error: Hex.IntegerOutOfRangeError: Number \`4.2018273891273126e+26\` is not in safe unsigned integer range (`0` to `9007199254740991`)
* ```
*/
var IntegerOutOfRangeError = class extends BaseError$1 {
	constructor({ max, min, signed, size, value }) {
		super(`Number \`${value}\` is not in safe${size ? ` ${size * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.IntegerOutOfRangeError"
		});
	}
};
/**
* Thrown when the provided value is not a valid hex type.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert(1)
* // @error: Hex.InvalidHexTypeError: Value `1` of type `number` is an invalid hex type.
* ```
*/
var InvalidHexTypeError = class extends BaseError$1 {
	constructor(value) {
		super(`Value \`${typeof value === "object" ? stringify(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, { metaMessages: ["Hex types must be represented as `\"0x${string}\"`."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexTypeError"
		});
	}
};
/**
* Thrown when the provided hex value is invalid.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.assert('0x0123456789abcdefg')
* // @error: Hex.InvalidHexValueError: Value `0x0123456789abcdefg` is an invalid hex value.
* // @error: Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).
* ```
*/
var InvalidHexValueError = class extends BaseError$1 {
	constructor(value) {
		super(`Value \`${value}\` is an invalid hex value.`, { metaMessages: ["Hex values must start with `\"0x\"` and contain only hexadecimal characters (0-9, a-f, A-F)."] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.InvalidHexValueError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the expected max size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.fromString('Hello World!', { size: 8 })
* // @error: Hex.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
* ```
*/
var SizeOverflowError = class extends BaseError$1 {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeOverflowError"
		});
	}
};
/**
* Thrown when the slice offset exceeds the bounds of the value.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.slice('0x0123456789', 6)
* // @error: Hex.SliceOffsetOutOfBoundsError: Slice starting at offset `6` is out-of-bounds (size: `5`).
* ```
*/
var SliceOffsetOutOfBoundsError = class extends BaseError$1 {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SliceOffsetOutOfBoundsError"
		});
	}
};
/**
* Thrown when the size of the value exceeds the pad size.
*
* @example
* ```ts twoslash
* import { Hex } from 'ox'
*
* Hex.padLeft('0x1a4e12a45a21323123aaa87a897a897a898a6567a578a867a98778a667a85a875a87a6a787a65a675a6a9', 32)
* // @error: Hex.SizeExceedsPaddingSizeError: Hex size (`43`) exceeds padding size (`32`).
* ```
*/
var SizeExceedsPaddingSizeError = class extends BaseError$1 {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Hex.SizeExceedsPaddingSizeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Withdrawal.js
/**
* Converts a {@link ox#Withdrawal.Withdrawal} to an {@link ox#Withdrawal.Rpc}.
*
* @example
* ```ts twoslash
* import { Withdrawal } from 'ox'
*
* const withdrawal = Withdrawal.toRpc({
*   address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
*   amount: 6423331n,
*   index: 0,
*   validatorIndex: 1,
* })
* // @log: {
* // @log:   address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
* // @log:   amount: '0x620323',
* // @log:   index: '0x0',
* // @log:   validatorIndex: '0x1',
* // @log: }
* ```
*
* @param withdrawal - The Withdrawal to convert.
* @returns An RPC Withdrawal.
*/
function toRpc$1(withdrawal) {
	return {
		address: withdrawal.address,
		amount: fromNumber(withdrawal.amount),
		index: fromNumber(withdrawal.index),
		validatorIndex: fromNumber(withdrawal.validatorIndex)
	};
}
//#endregion
//#region node_modules/ox/_esm/core/BlockOverrides.js
/**
* Converts an {@link ox#BlockOverrides.BlockOverrides} to an {@link ox#BlockOverrides.Rpc}.
*
* @example
* ```ts twoslash
* import { BlockOverrides } from 'ox'
*
* const blockOverrides = BlockOverrides.toRpc({
*   baseFeePerGas: 1n,
*   blobBaseFee: 2n,
*   feeRecipient: '0x0000000000000000000000000000000000000000',
*   gasLimit: 4n,
*   number: 5n,
*   prevRandao: 6n,
*   time: 78187493520n,
*   withdrawals: [
*     {
*       address: '0x0000000000000000000000000000000000000000',
*       amount: 1n,
*       index: 0,
*       validatorIndex: 1,
*     },
*   ],
* })
* ```
*
* @param blockOverrides - The block overrides to convert.
* @returns An instantiated {@link ox#BlockOverrides.Rpc}.
*/
function toRpc(blockOverrides) {
	return {
		...typeof blockOverrides.baseFeePerGas === "bigint" && { baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas) },
		...typeof blockOverrides.blobBaseFee === "bigint" && { blobBaseFee: fromNumber(blockOverrides.blobBaseFee) },
		...typeof blockOverrides.feeRecipient === "string" && { feeRecipient: blockOverrides.feeRecipient },
		...typeof blockOverrides.gasLimit === "bigint" && { gasLimit: fromNumber(blockOverrides.gasLimit) },
		...typeof blockOverrides.number === "bigint" && { number: fromNumber(blockOverrides.number) },
		...typeof blockOverrides.prevRandao === "bigint" && { prevRandao: fromNumber(blockOverrides.prevRandao) },
		...typeof blockOverrides.time === "bigint" && { time: fromNumber(blockOverrides.time) },
		...blockOverrides.withdrawals && { withdrawals: blockOverrides.withdrawals.map(toRpc$1) }
	};
}
//#endregion
//#region node_modules/viem/_esm/actions/public/simulateBlocks.js
/**
* Simulates a set of calls on block(s) with optional block and state overrides.
*
* @example
* ```ts
* import { createClient, http, parseEther } from 'viem'
* import { simulate } from 'viem/actions'
* import { mainnet } from 'viem/chains'
*
* const client = createClient({
*   chain: mainnet,
*   transport: http(),
* })
*
* const result = await simulate(client, {
*   blocks: [{
*     blockOverrides: {
*       number: 69420n,
*     },
*     calls: [{
*       {
*         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
*         data: '0xdeadbeef',
*         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*       },
*       {
*         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
*         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*         value: parseEther('1'),
*       },
*     }],
*     stateOverrides: [{
*       address: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
*       balance: parseEther('10'),
*     }],
*   }]
* })
* ```
*
* @param client - Client to use.
* @param parameters - {@link SimulateBlocksParameters}
* @returns Simulated blocks. {@link SimulateBlocksReturnType}
*/
async function simulateBlocks(client, parameters) {
	const { blockNumber, blockTag = "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
	try {
		const blockStateCalls = [];
		for (const block of blocks) {
			const blockOverrides = block.blockOverrides ? toRpc(block.blockOverrides) : void 0;
			const calls = block.calls.map((call_) => {
				const call = call_;
				const account = call.account ? parseAccount(call.account) : void 0;
				const request = {
					...call,
					data: call.abi ? encodeFunctionData(call) : call.data,
					from: call.from ?? account?.address
				};
				assertRequest(request);
				return formatTransactionRequest(request);
			});
			const stateOverrides = block.stateOverrides ? serializeStateOverride(block.stateOverrides) : void 0;
			blockStateCalls.push({
				blockOverrides,
				calls,
				stateOverrides
			});
		}
		const block = (blockNumber ? numberToHex(blockNumber) : void 0) || blockTag;
		return (await client.request({
			method: "eth_simulateV1",
			params: [{
				blockStateCalls,
				returnFullTransactions,
				traceTransfers,
				validation
			}, block]
		})).map((block, i) => ({
			...formatBlock(block),
			calls: block.calls.map((call, j) => {
				const { abi, args, functionName, to } = blocks[i].calls[j];
				const data = call.error?.data ?? call.returnData;
				const gasUsed = BigInt(call.gasUsed);
				const logs = call.logs?.map((log) => formatLog(log));
				const status = call.status === "0x1" ? "success" : "failure";
				const result = abi && status === "success" && data !== "0x" ? decodeFunctionResult({
					abi,
					data,
					functionName
				}) : null;
				const error = (() => {
					if (status === "success") return void 0;
					let error = void 0;
					if (call.error?.data === "0x") error = new AbiDecodingZeroDataError();
					else if (call.error) error = new RawContractError(call.error);
					if (!error) return void 0;
					return getContractError(error, {
						abi: abi ?? [],
						address: to,
						args,
						functionName: functionName ?? "<unknown>"
					});
				})();
				return {
					data,
					gasUsed,
					logs,
					status,
					...status === "success" ? { result } : { error }
				};
			})
		}));
	} catch (e) {
		const cause = e;
		const error = getNodeError(cause, {});
		if (error instanceof UnknownNodeError) throw cause;
		throw error;
	}
}
//#endregion
//#region node_modules/abitype/dist/esm/version.js
var version = "1.3.0";
//#endregion
//#region node_modules/abitype/dist/esm/errors.js
var BaseError = class BaseError extends Error {
	constructor(shortMessage, args = {}) {
		const details = args.cause instanceof BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
		const docsPath = args.cause instanceof BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
			...details ? [`Details: ${details}`] : [],
			`Version: abitype@${version}`
		].join("\n");
		super(message);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiTypeError"
		});
		if (args.cause) this.cause = args.cause;
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.shortMessage = shortMessage;
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
	return regex.exec(string)?.groups;
}
var bytesRegex$1 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex$1 = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var isTupleRegex = /^\(.+?\).*?$/;
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
var tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
/**
* Formats {@link AbiParameter} to human-readable ABI parameter.
*
* @param abiParameter - ABI parameter
* @returns Human-readable ABI parameter
*
* @deprecated Human-readable ABI utilities are moving to Ox.
* Install [`ox`](https://oxlib.sh) and use [`AbiParameter.format`](https://oxlib.sh/api/AbiParameter/format) instead:
* `import { AbiParameter } from 'ox'`.
*
* @example
* const result = formatAbiParameter({ type: 'address', name: 'from' })
* //    ^? const result: 'address from'
*/
function formatAbiParameter(abiParameter) {
	let type = abiParameter.type;
	if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
		type = "(";
		const length = abiParameter.components.length;
		for (let i = 0; i < length; i++) {
			const component = abiParameter.components[i];
			type += formatAbiParameter(component);
			if (i < length - 1) type += ", ";
		}
		const result = execTyped(tupleRegex, abiParameter.type);
		type += `)${result?.array || ""}`;
		return formatAbiParameter({
			...abiParameter,
			type
		});
	}
	if ("indexed" in abiParameter && abiParameter.indexed) type = `${type} indexed`;
	if (abiParameter.name) return `${type} ${abiParameter.name}`;
	return type;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
/**
* Formats {@link AbiParameter}s to human-readable ABI parameters.
*
* @param abiParameters - ABI parameters
* @returns Human-readable ABI parameters
*
* @deprecated Human-readable ABI utilities are moving to Ox.
* Install [`ox`](https://oxlib.sh) and use [`AbiParameters.format`](https://oxlib.sh/api/AbiParameters/format) instead:
* `import { AbiParameters } from 'ox'`.
*
* @example
* const result = formatAbiParameters([
*   //  ^? const result: 'address from, uint256 tokenId'
*   { type: 'address', name: 'from' },
*   { type: 'uint256', name: 'tokenId' },
* ])
*/
function formatAbiParameters(abiParameters) {
	let params = "";
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		params += formatAbiParameter(abiParameter);
		if (i !== length - 1) params += ", ";
	}
	return params;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
/**
* Formats ABI item (e.g. error, event, function) into human-readable ABI item
*
* @param abiItem - ABI item
* @returns Human-readable ABI item
*
* @deprecated Human-readable ABI utilities are moving to Ox.
* Install [`ox`](https://oxlib.sh) and use [`AbiItem.format`](https://oxlib.sh/api/AbiItem/format) instead:
* `import { AbiItem } from 'ox'`.
*/
function formatAbiItem(abiItem) {
	if (abiItem.type === "function") return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
	if (abiItem.type === "event") return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "error") return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
	if (abiItem.type === "constructor") return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	if (abiItem.type === "fallback") return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
	return "receive() external payable";
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
var errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isErrorSignature(signature) {
	return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
	return execTyped(errorSignatureRegex, signature);
}
var eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
function isEventSignature(signature) {
	return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
	return execTyped(eventSignatureRegex, signature);
}
var functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
function isFunctionSignature(signature) {
	return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
	return execTyped(functionSignatureRegex, signature);
}
var structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
function isStructSignature(signature) {
	return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
	return execTyped(structSignatureRegex, signature);
}
var constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
function isConstructorSignature(signature) {
	return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
	return execTyped(constructorSignatureRegex, signature);
}
var fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
function isFallbackSignature(signature) {
	return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
	return execTyped(fallbackSignatureRegex, signature);
}
var receiveSignatureRegex = /^receive\(\) external payable$/;
function isReceiveSignature(signature) {
	return receiveSignatureRegex.test(signature);
}
var eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
var functionModifiers = /* @__PURE__ */ new Set([
	"calldata",
	"memory",
	"storage"
]);
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var InvalidAbiItemError = class extends BaseError {
	constructor({ signature }) {
		super("Failed to parse ABI item.", {
			details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
			docsPath: "/api/human#parseabiitem-1"
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidAbiItemError"
		});
	}
};
var UnknownTypeError = class extends BaseError {
	constructor({ type }) {
		super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownTypeError"
		});
	}
};
var UnknownSolidityTypeError = class extends BaseError {
	constructor({ type }) {
		super("Unknown type.", { metaMessages: [`Type "${type}" is not a valid ABI type.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownSolidityTypeError"
		});
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError = class extends BaseError {
	constructor({ param }) {
		super("Invalid ABI parameter.", { details: param });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidParameterError"
		});
	}
};
var SolidityProtectedKeywordError = class extends BaseError {
	constructor({ param, name }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "SolidityProtectedKeywordError"
		});
	}
};
var InvalidModifierError = class extends BaseError {
	constructor({ param, type, modifier }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidModifierError"
		});
	}
};
var InvalidFunctionModifierError = class extends BaseError {
	constructor({ param, type, modifier }) {
		super("Invalid ABI parameter.", {
			details: param,
			metaMessages: [`Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`, `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidFunctionModifierError"
		});
	}
};
var InvalidAbiTypeParameterError = class extends BaseError {
	constructor({ abiParameter }) {
		super("Invalid ABI parameter.", {
			details: JSON.stringify(abiParameter, null, 2),
			metaMessages: ["ABI parameter type is invalid."]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidAbiTypeParameterError"
		});
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError = class extends BaseError {
	constructor({ signature, type }) {
		super(`Invalid ${type} signature.`, { details: signature });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidSignatureError"
		});
	}
};
var UnknownSignatureError = class extends BaseError {
	constructor({ signature }) {
		super("Unknown signature.", { details: signature });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "UnknownSignatureError"
		});
	}
};
var InvalidStructSignatureError = class extends BaseError {
	constructor({ signature }) {
		super("Invalid struct signature.", {
			details: signature,
			metaMessages: ["No properties exist."]
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidStructSignatureError"
		});
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError = class extends BaseError {
	constructor({ type }) {
		super("Circular reference detected.", { metaMessages: [`Struct "${type}" is a circular reference.`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "CircularReferenceError"
		});
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError = class extends BaseError {
	constructor({ current, depth }) {
		super("Unbalanced parentheses.", {
			metaMessages: [`"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`],
			details: `Depth "${depth}"`
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "InvalidParenthesisError"
		});
	}
};
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/cache.js
/**
* Gets {@link parameterCache} cache key namespaced by {@link type} and {@link structs}. This prevents parameters from being accessible to types that don't allow them (e.g. `string indexed foo` not allowed outside of `type: 'event'`) and ensures different struct definitions with the same name are cached separately.
* @param param ABI parameter string
* @param type ABI parameter type
* @param structs Struct definitions to include in cache key
* @returns Cache key for {@link parameterCache}
*/
function getParameterCacheKey(param, type, structs) {
	let structKey = "";
	if (structs) for (const struct of Object.entries(structs)) {
		if (!struct) continue;
		let propertyKey = "";
		for (const property of struct[1]) propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
		structKey += `(${struct[0]}{${propertyKey}})`;
	}
	if (type) return `${type}:${param}${structKey}`;
	return `${param}${structKey}`;
}
/**
* Basic cache seeded with common ABI parameter strings.
*
* **Note: When seeding more parameters, make sure you benchmark performance. The current number is the ideal balance between performance and having an already existing cache.**
*/
var parameterCache = /* @__PURE__ */ new Map([
	["address", { type: "address" }],
	["bool", { type: "bool" }],
	["bytes", { type: "bytes" }],
	["bytes32", { type: "bytes32" }],
	["int", { type: "int256" }],
	["int256", { type: "int256" }],
	["string", { type: "string" }],
	["uint", { type: "uint256" }],
	["uint8", { type: "uint8" }],
	["uint16", { type: "uint16" }],
	["uint24", { type: "uint24" }],
	["uint32", { type: "uint32" }],
	["uint64", { type: "uint64" }],
	["uint96", { type: "uint96" }],
	["uint112", { type: "uint112" }],
	["uint160", { type: "uint160" }],
	["uint192", { type: "uint192" }],
	["uint256", { type: "uint256" }],
	["address owner", {
		type: "address",
		name: "owner"
	}],
	["address to", {
		type: "address",
		name: "to"
	}],
	["bool approved", {
		type: "bool",
		name: "approved"
	}],
	["bytes _data", {
		type: "bytes",
		name: "_data"
	}],
	["bytes data", {
		type: "bytes",
		name: "data"
	}],
	["bytes signature", {
		type: "bytes",
		name: "signature"
	}],
	["bytes32 hash", {
		type: "bytes32",
		name: "hash"
	}],
	["bytes32 r", {
		type: "bytes32",
		name: "r"
	}],
	["bytes32 root", {
		type: "bytes32",
		name: "root"
	}],
	["bytes32 s", {
		type: "bytes32",
		name: "s"
	}],
	["string name", {
		type: "string",
		name: "name"
	}],
	["string symbol", {
		type: "string",
		name: "symbol"
	}],
	["string tokenURI", {
		type: "string",
		name: "tokenURI"
	}],
	["uint tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint8 v", {
		type: "uint8",
		name: "v"
	}],
	["uint256 balance", {
		type: "uint256",
		name: "balance"
	}],
	["uint256 tokenId", {
		type: "uint256",
		name: "tokenId"
	}],
	["uint256 value", {
		type: "uint256",
		name: "value"
	}],
	["event:address indexed from", {
		type: "address",
		name: "from",
		indexed: true
	}],
	["event:address indexed to", {
		type: "address",
		name: "to",
		indexed: true
	}],
	["event:uint indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: true
	}],
	["event:uint256 indexed tokenId", {
		type: "uint256",
		name: "tokenId",
		indexed: true
	}]
]);
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
	if (isFunctionSignature(signature)) return parseFunctionSignature(signature, structs);
	if (isEventSignature(signature)) return parseEventSignature(signature, structs);
	if (isErrorSignature(signature)) return parseErrorSignature(signature, structs);
	if (isConstructorSignature(signature)) return parseConstructorSignature(signature, structs);
	if (isFallbackSignature(signature)) return parseFallbackSignature(signature);
	if (isReceiveSignature(signature)) return {
		type: "receive",
		stateMutability: "payable"
	};
	throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
	const match = execFunctionSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "function"
	});
	const inputParams = splitParameters(match.parameters);
	const inputs = [];
	const inputLength = inputParams.length;
	for (let i = 0; i < inputLength; i++) inputs.push(parseAbiParameter(inputParams[i], {
		modifiers: functionModifiers,
		structs,
		type: "function"
	}));
	const outputs = [];
	if (match.returns) {
		const outputParams = splitParameters(match.returns);
		const outputLength = outputParams.length;
		for (let i = 0; i < outputLength; i++) outputs.push(parseAbiParameter(outputParams[i], {
			modifiers: functionModifiers,
			structs,
			type: "function"
		}));
	}
	return {
		name: match.name,
		type: "function",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs,
		outputs
	};
}
function parseEventSignature(signature, structs = {}) {
	const match = execEventSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "event"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		modifiers: eventModifiers,
		structs,
		type: "event"
	}));
	return {
		name: match.name,
		type: "event",
		inputs: abiParameters
	};
}
function parseErrorSignature(signature, structs = {}) {
	const match = execErrorSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "error"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		structs,
		type: "error"
	}));
	return {
		name: match.name,
		type: "error",
		inputs: abiParameters
	};
}
function parseConstructorSignature(signature, structs = {}) {
	const match = execConstructorSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "constructor"
	});
	const params = splitParameters(match.parameters);
	const abiParameters = [];
	const length = params.length;
	for (let i = 0; i < length; i++) abiParameters.push(parseAbiParameter(params[i], {
		structs,
		type: "constructor"
	}));
	return {
		type: "constructor",
		stateMutability: match.stateMutability ?? "nonpayable",
		inputs: abiParameters
	};
}
function parseFallbackSignature(signature) {
	const match = execFallbackSignature(signature);
	if (!match) throw new InvalidSignatureError({
		signature,
		type: "fallback"
	});
	return {
		type: "fallback",
		stateMutability: match.stateMutability ?? "nonpayable"
	};
}
var abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
var dynamicIntegerRegex = /^u?int$/;
function parseAbiParameter(param, options) {
	const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
	if (parameterCache.has(parameterCacheKey)) return parameterCache.get(parameterCacheKey);
	const isTuple = isTupleRegex.test(param);
	const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
	if (!match) throw new InvalidParameterError({ param });
	if (match.name && isSolidityKeyword(match.name)) throw new SolidityProtectedKeywordError({
		param,
		name: match.name
	});
	const name = match.name ? { name: match.name } : {};
	const indexed = match.modifier === "indexed" ? { indexed: true } : {};
	const structs = options?.structs ?? {};
	let type;
	let components = {};
	if (isTuple) {
		type = "tuple";
		const params = splitParameters(match.type);
		const components_ = [];
		const length = params.length;
		for (let i = 0; i < length; i++) components_.push(parseAbiParameter(params[i], { structs }));
		components = { components: components_ };
	} else if (match.type in structs) {
		type = "tuple";
		components = { components: structs[match.type] };
	} else if (dynamicIntegerRegex.test(match.type)) type = `${match.type}256`;
	else if (match.type === "address payable") type = "address";
	else {
		type = match.type;
		if (!(options?.type === "struct") && !isSolidityType(type)) throw new UnknownSolidityTypeError({ type });
	}
	if (match.modifier) {
		if (!options?.modifiers?.has?.(match.modifier)) throw new InvalidModifierError({
			param,
			type: options?.type,
			modifier: match.modifier
		});
		if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array)) throw new InvalidFunctionModifierError({
			param,
			type: options?.type,
			modifier: match.modifier
		});
	}
	const abiParameter = {
		type: `${type}${match.array ?? ""}`,
		...name,
		...indexed,
		...components
	};
	parameterCache.set(parameterCacheKey, abiParameter);
	return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
	const length = params.trim().length;
	for (let i = 0; i < length; i++) {
		const char = params[i];
		const tail = params.slice(i + 1);
		switch (char) {
			case ",": return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
			case "(": return splitParameters(tail, result, `${current}${char}`, depth + 1);
			case ")": return splitParameters(tail, result, `${current}${char}`, depth - 1);
			default: return splitParameters(tail, result, `${current}${char}`, depth);
		}
	}
	if (current === "") return result;
	if (depth !== 0) throw new InvalidParenthesisError({
		current,
		depth
	});
	result.push(current.trim());
	return result;
}
function isSolidityType(type) {
	return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex$1.test(type) || integerRegex$1.test(type);
}
var protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
/** @internal */
function isSolidityKeyword(name) {
	return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex$1.test(name) || integerRegex$1.test(name) || protectedKeywordsRegex.test(name);
}
/** @internal */
function isValidDataLocation(type, isArray) {
	return isArray || type === "bytes" || type === "string" || type === "tuple";
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
	const shallowStructs = {};
	const signaturesLength = signatures.length;
	for (let i = 0; i < signaturesLength; i++) {
		const signature = signatures[i];
		if (!isStructSignature(signature)) continue;
		const match = execStructSignature(signature);
		if (!match) throw new InvalidSignatureError({
			signature,
			type: "struct"
		});
		const properties = match.properties.split(";");
		const components = [];
		const propertiesLength = properties.length;
		for (let k = 0; k < propertiesLength; k++) {
			const trimmed = properties[k].trim();
			if (!trimmed) continue;
			const abiParameter = parseAbiParameter(trimmed, { type: "struct" });
			components.push(abiParameter);
		}
		if (!components.length) throw new InvalidStructSignatureError({ signature });
		shallowStructs[match.name] = components;
	}
	const resolvedStructs = {};
	const entries = Object.entries(shallowStructs);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i++) {
		const [name, parameters] = entries[i];
		resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
	}
	return resolvedStructs;
}
var typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
function resolveStructs(abiParameters = [], structs = {}, ancestors = /* @__PURE__ */ new Set()) {
	const components = [];
	const length = abiParameters.length;
	for (let i = 0; i < length; i++) {
		const abiParameter = abiParameters[i];
		if (isTupleRegex.test(abiParameter.type)) components.push(abiParameter);
		else {
			const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
			if (!match?.type) throw new InvalidAbiTypeParameterError({ abiParameter });
			const { array, type } = match;
			if (type in structs) {
				if (ancestors.has(type)) throw new CircularReferenceError({ type });
				components.push({
					...abiParameter,
					type: `tuple${array ?? ""}`,
					components: resolveStructs(structs[type], structs, /* @__PURE__ */ new Set([...ancestors, type]))
				});
			} else if (isSolidityType(type)) components.push(abiParameter);
			else throw new UnknownTypeError({ type });
		}
	}
	return components;
}
//#endregion
//#region node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
/**
* Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
*
* @param signature - Human-readable ABI item
* @returns Parsed {@link Abi} item
*
* @deprecated Human-readable ABI utilities are moving to Ox.
* Install [`ox`](https://oxlib.sh) and use [`AbiItem.from`](https://oxlib.sh/api/AbiItem/from) instead:
* `import { AbiItem } from 'ox'`.
*
* @example
* const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
* //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
*
* @example
* const abiItem = parseAbiItem([
*   //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
*   'function foo(Baz bar) view returns (string)',
*   'struct Baz { string name; }',
* ])
*/
function parseAbiItem(signature) {
	let abiItem;
	if (typeof signature === "string") abiItem = parseSignature(signature);
	else {
		const structs = parseStructs(signature);
		const length = signature.length;
		for (let i = 0; i < length; i++) {
			const signature_ = signature[i];
			if (isStructSignature(signature_)) continue;
			abiItem = parseSignature(signature_, structs);
			break;
		}
	}
	if (!abiItem) throw new InvalidAbiItemError({ signature });
	return abiItem;
}
//#endregion
//#region node_modules/ox/_esm/core/Hash.js
/**
* Calculates the [Keccak256](https://en.wikipedia.org/wiki/SHA-3) hash of a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
*
* This function is a re-export of `keccak_256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), an audited & minimal JS hashing library.
*
* @example
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef')
* // @log: '0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1'
* ```
*
* @example
* ### Calculate Hash of a String
*
* ```ts twoslash
* import { Hash, Hex } from 'ox'
*
* Hash.keccak256(Hex.fromString('hello world'))
* // @log: '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
* ```
*
* @example
* ### Configure Return Type
*
* ```ts twoslash
* import { Hash } from 'ox'
*
* Hash.keccak256('0xdeadbeef', { as: 'Bytes' })
* // @log: Uint8Array [...]
* ```
*
* @param value - {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
* @param options - Options.
* @returns Keccak256 hash.
*/
function keccak256(value, options = {}) {
	const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
	const bytes = keccak_256(from$3(value));
	if (as === "Bytes") return bytes;
	return fromBytes(bytes);
}
//#endregion
//#region node_modules/ox/_esm/core/internal/lru.js
/**
* @internal
*
* Map with a LRU (Least recently used) policy.
* @see https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
*/
var LruMap = class extends Map {
	constructor(size) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key) && value !== void 0) {
			this.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = this.keys().next().value;
			if (firstKey) this.delete(firstKey);
		}
		return this;
	}
};
var checksum$1 = { checksum: /*#__PURE__*/ new LruMap(8192) }.checksum;
//#endregion
//#region node_modules/ox/_esm/core/Address.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
/**
* Asserts that the given value is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.assert('0xdeadbeef')
* // @error: InvalidAddressError: Address "0xdeadbeef" is invalid.
* ```
*
* @param value - Value to assert if it is a valid address.
* @param options - Assertion options.
*/
function assert(value, options = {}) {
	const { strict = true } = options;
	if (!addressRegex.test(value)) throw new InvalidAddressError({
		address: value,
		cause: new InvalidInputError()
	});
	if (strict) {
		if (value.toLowerCase() === value) return;
		if (checksum(value) !== value) throw new InvalidAddressError({
			address: value,
			cause: new InvalidChecksumError()
		});
	}
}
/**
* Computes the checksum address for the given {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.checksum('0xa0cf798816d4b9b9866b5330eea46a18382f251e')
* // @log: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
* ```
*
* @param address - The address to compute the checksum for.
* @returns The checksummed address.
*/
function checksum(address) {
	if (checksum$1.has(address)) return checksum$1.get(address);
	assert(address, { strict: false });
	const hexAddress = address.substring(2).toLowerCase();
	const hash = keccak256(fromString$1(hexAddress), { as: "Bytes" });
	const characters = hexAddress.split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && characters[i]) characters[i] = characters[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && characters[i + 1]) characters[i + 1] = characters[i + 1].toUpperCase();
	}
	const result = `0x${characters.join("")}`;
	checksum$1.set(address, result);
	return result;
}
/**
* Checks if the given address is a valid {@link ox#Address.Address}.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
* // @log: true
* ```
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.validate('0xdeadbeef')
* // @log: false
* ```
*
* @param address - Value to check if it is a valid address.
* @param options - Check options.
* @returns Whether the address is a valid address.
*/
function validate(address, options = {}) {
	const { strict = true } = options ?? {};
	try {
		assert(address, { strict });
		return true;
	} catch {
		return false;
	}
}
/**
* Thrown when an address is invalid.
*
* @example
* ```ts twoslash
* import { Address } from 'ox'
*
* Address.from('0x123')
* // @error: Address.InvalidAddressError: Address `0x123` is invalid.
* ```
*/
var InvalidAddressError = class extends BaseError$1 {
	constructor({ address, cause }) {
		super(`Address "${address}" is invalid.`, { cause });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidAddressError"
		});
	}
};
/** Thrown when an address is not a 20 byte (40 hexadecimal character) value. */
var InvalidInputError = class extends BaseError$1 {
	constructor() {
		super("Address is not a 20 byte (40 hexadecimal character) value.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidInputError"
		});
	}
};
/** Thrown when an address does not match its checksum counterpart. */
var InvalidChecksumError = class extends BaseError$1 {
	constructor() {
		super("Address does not match its checksum counterpart.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "Address.InvalidChecksumError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/internal/abiItem.js
/** @internal */
function normalizeSignature(signature) {
	let active = true;
	let current = "";
	let level = 0;
	let result = "";
	let valid = false;
	for (let i = 0; i < signature.length; i++) {
		const char = signature[i];
		if ([
			"(",
			")",
			","
		].includes(char)) active = true;
		if (char === "(") level++;
		if (char === ")") level--;
		if (!active) continue;
		if (level === 0) {
			if (char === " " && [
				"event",
				"function",
				"error",
				""
			].includes(result)) result = "";
			else {
				result += char;
				if (char === ")") {
					valid = true;
					break;
				}
			}
			continue;
		}
		if (char === " ") {
			if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
				current = "";
				active = false;
			}
			continue;
		}
		result += char;
		current += char;
	}
	if (!valid) throw new BaseError$1("Unable to normalize signature.");
	return result;
}
/** @internal */
function isArgOfType(arg, abiParameter) {
	const argType = typeof arg;
	const abiParameterType = abiParameter.type;
	switch (abiParameterType) {
		case "address": return validate(arg, { strict: false });
		case "bool": return argType === "boolean";
		case "function": return argType === "string";
		case "string": return argType === "string";
		default:
			if (abiParameterType === "tuple" && "components" in abiParameter) return Object.values(abiParameter.components).every((component, index) => {
				return isArgOfType(Object.values(arg)[index], component);
			});
			if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType)) return argType === "number" || argType === "bigint";
			if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType)) return argType === "string" || arg instanceof Uint8Array;
			if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
				...abiParameter,
				type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
			}));
			return false;
	}
}
/** @internal */
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
	for (const parameterIndex in sourceParameters) {
		const sourceParameter = sourceParameters[parameterIndex];
		const targetParameter = targetParameters[parameterIndex];
		if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter) return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
		const types = [sourceParameter.type, targetParameter.type];
		if ((() => {
			if (types.includes("address") && types.includes("bytes20")) return true;
			if (types.includes("address") && types.includes("string")) return validate(args[parameterIndex], { strict: false });
			if (types.includes("address") && types.includes("bytes")) return validate(args[parameterIndex], { strict: false });
			return false;
		})()) return types;
	}
}
//#endregion
//#region node_modules/ox/_esm/core/AbiItem.js
/**
* Parses an arbitrary **JSON ABI Item** or **Human Readable ABI Item** into a typed {@link ox#AbiItem.AbiItem}.
*
* @example
* ### JSON ABIs
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from({
*   type: 'function',
*   name: 'approve',
*   stateMutability: 'nonpayable',
*   inputs: [
*     {
*       name: 'spender',
*       type: 'address',
*     },
*     {
*       name: 'amount',
*       type: 'uint256',
*     },
*   ],
*   outputs: [{ type: 'bool' }],
* })
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* ### Human Readable ABIs
*
* A Human Readable ABI can be parsed into a typed ABI object:
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from(
*   'function approve(address spender, uint256 amount) returns (bool)' // [!code hl]
* )
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* It is possible to specify `struct`s along with your definitions:
*
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const abiItem = AbiItem.from([
*   'struct Foo { address spender; uint256 amount; }', // [!code hl]
*   'function approve(Foo foo) returns (bool)',
* ])
*
* abiItem
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
*
*
* @param abiItem - The ABI Item to parse.
* @returns The typed ABI Item.
*/
function from$2(abiItem, options = {}) {
	const { prepare = true } = options;
	const item = (() => {
		if (Array.isArray(abiItem)) return parseAbiItem(abiItem);
		if (typeof abiItem === "string") return parseAbiItem(abiItem);
		return abiItem;
	})();
	return {
		...item,
		...prepare ? { hash: getSignatureHash(item) } : {}
	};
}
/**
* Extracts an {@link ox#AbiItem.AbiItem} from an {@link ox#Abi.Abi} given a name and optional arguments.
*
* @example
* ABI Items can be extracted by their name using the `name` option:
*
* ```ts twoslash
* import { Abi, AbiItem } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
*
* const item = AbiItem.fromAbi(abi, 'Transfer') // [!code focus]
* //    ^?
*
*
*
*
*
*
* ```
*
* @example
* ### Extracting by Selector
*
* ABI Items can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
*
* ```ts twoslash
* import { Abi, AbiItem } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
* const item = AbiItem.fromAbi(abi, '0x095ea7b3') // [!code focus]
* //    ^?
*
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* :::note
*
* Extracting via a hex selector is useful when extracting an ABI Item from an `eth_call` RPC response,
* a Transaction `input`, or from Event Log `topics`.
*
* :::
*
* @param abi - The ABI to extract from.
* @param name - The name (or selector) of the ABI item to extract.
* @param options - Extraction options.
* @returns The ABI item.
*/
function fromAbi$1(abi, name, options) {
	const { args = [], prepare = true } = options ?? {};
	const isSelector = validate$1(name, { strict: false });
	const abiItems = abi.filter((abiItem) => {
		if (isSelector) {
			if (abiItem.type === "function" || abiItem.type === "error") return getSelector$1(abiItem) === slice(name, 0, 4);
			if (abiItem.type === "event") return getSignatureHash(abiItem) === name;
			return false;
		}
		return "name" in abiItem && abiItem.name === name;
	});
	if (abiItems.length === 0) throw new NotFoundError({ name });
	if (abiItems.length === 1) return {
		...abiItems[0],
		...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
	};
	let matchedAbiItem = void 0;
	for (const abiItem of abiItems) {
		if (!("inputs" in abiItem)) continue;
		if (!args || args.length === 0) {
			if (!abiItem.inputs || abiItem.inputs.length === 0) return {
				...abiItem,
				...prepare ? { hash: getSignatureHash(abiItem) } : {}
			};
			continue;
		}
		if (!abiItem.inputs) continue;
		if (abiItem.inputs.length === 0) continue;
		if (abiItem.inputs.length !== args.length) continue;
		if (args.every((arg, index) => {
			const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
			if (!abiParameter) return false;
			return isArgOfType(arg, abiParameter);
		})) {
			if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
				const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
				if (ambiguousTypes) throw new AmbiguityError({
					abiItem,
					type: ambiguousTypes[0]
				}, {
					abiItem: matchedAbiItem,
					type: ambiguousTypes[1]
				});
			}
			matchedAbiItem = abiItem;
		}
	}
	const abiItem = (() => {
		if (matchedAbiItem) return matchedAbiItem;
		const [abiItem, ...overloads] = abiItems;
		return {
			...abiItem,
			overloads
		};
	})();
	if (!abiItem) throw new NotFoundError({ name });
	return {
		...abiItem,
		...prepare ? { hash: getSignatureHash(abiItem) } : {}
	};
}
/**
* Computes the [4-byte selector](https://solidity-by-example.org/function-selector/) for an {@link ox#AbiItem.AbiItem}.
*
* Useful for computing function selectors for calldata.
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const selector = AbiItem.getSelector('function ownerOf(uint256 tokenId)')
* // @log: '0x6352211e'
* ```
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const selector = AbiItem.getSelector({
*   inputs: [{ type: 'uint256' }],
*   name: 'ownerOf',
*   outputs: [],
*   stateMutability: 'view',
*   type: 'function'
* })
* // @log: '0x6352211e'
* ```
*
* @param abiItem - The ABI item to compute the selector for. Can be a signature or an ABI item for an error, event, function, etc.
* @returns The first 4 bytes of the {@link ox#Hash.(keccak256:function)} hash of the function signature.
*/
function getSelector$1(abiItem) {
	return slice(getSignatureHash(abiItem), 0, 4);
}
/**
* Computes the stringified signature for a given {@link ox#AbiItem.AbiItem}.
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const signature = AbiItem.getSignature('function ownerOf(uint256 tokenId)')
* // @log: 'ownerOf(uint256)'
* ```
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const signature = AbiItem.getSignature({
*   name: 'ownerOf',
*   type: 'function',
*   inputs: [{ name: 'tokenId', type: 'uint256' }],
*   outputs: [],
*   stateMutability: 'view',
* })
* // @log: 'ownerOf(uint256)'
* ```
*
* @param abiItem - The ABI Item to compute the signature for.
* @returns The stringified signature of the ABI Item.
*/
function getSignature(abiItem) {
	return normalizeSignature((() => {
		if (typeof abiItem === "string") return abiItem;
		return formatAbiItem(abiItem);
	})());
}
/**
* Computes the signature hash for an {@link ox#AbiItem.AbiItem}.
*
* Useful for computing Event Topic values.
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const hash = AbiItem.getSignatureHash('event Transfer(address indexed from, address indexed to, uint256 amount)')
* // @log: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
* ```
*
* @example
* ```ts twoslash
* import { AbiItem } from 'ox'
*
* const hash = AbiItem.getSignatureHash({
*   name: 'Transfer',
*   type: 'event',
*   inputs: [
*     { name: 'from', type: 'address', indexed: true },
*     { name: 'to', type: 'address', indexed: true },
*     { name: 'amount', type: 'uint256', indexed: false },
*   ],
* })
* // @log: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
* ```
*
* @param abiItem - The ABI Item to compute the signature hash for.
* @returns The {@link ox#Hash.(keccak256:function)} hash of the ABI item's signature.
*/
function getSignatureHash(abiItem) {
	if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash) return abiItem.hash;
	return keccak256(fromString(getSignature(abiItem)));
}
/**
* Throws when ambiguous types are found on overloaded ABI items.
*
* @example
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from(['function foo(address)', 'function foo(bytes20)'])
* AbiFunction.fromAbi(foo, 'foo', {
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
* // @error: `bytes20` in `foo(bytes20)`, and
* // @error: `address` in `foo(address)`
* // @error: These types encode differently and cannot be distinguished at runtime.
* // @error: Remove one of the ambiguous items in the ABI.
* ```
*
* ### Solution
*
* Remove one of the ambiguous types from the ABI.
*
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function foo(bytes20)' // [!code --]
* ])
* AbiFunction.fromAbi(foo, 'foo', {
*   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
* })
* // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
* // @error: `bytes20` in `foo(bytes20)`, and
* // @error: `address` in `foo(address)`
* // @error: These types encode differently and cannot be distinguished at runtime.
* // @error: Remove one of the ambiguous items in the ABI.
* ```
*/
var AmbiguityError = class extends BaseError$1 {
	constructor(x, y) {
		super("Found ambiguous types in overloaded ABI Items.", { metaMessages: [
			`\`${x.type}\` in \`${normalizeSignature(formatAbiItem(x.abiItem))}\`, and`,
			`\`${y.type}\` in \`${normalizeSignature(formatAbiItem(y.abiItem))}\``,
			"",
			"These types encode differently and cannot be distinguished at runtime.",
			"Remove one of the ambiguous items in the ABI."
		] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiItem.AmbiguityError"
		});
	}
};
/**
* Throws when an ABI item is not found in the ABI.
*
* @example
* ```ts twoslash
* // @noErrors
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function bar(uint)'
* ])
* AbiFunction.fromAbi(foo, 'baz')
* // @error: AbiItem.NotFoundError: ABI function with name "baz" not found.
* ```
*
* ### Solution
*
* Ensure the ABI item exists on the ABI.
*
* ```ts twoslash
* // @noErrors
* import { Abi, AbiFunction } from 'ox'
*
* const foo = Abi.from([
*   'function foo(address)',
*   'function bar(uint)',
*   'function baz(bool)' // [!code ++]
* ])
* AbiFunction.fromAbi(foo, 'baz')
* ```
*/
var NotFoundError = class extends BaseError$1 {
	constructor({ name, data, type = "item" }) {
		const selector = (() => {
			if (name) return ` with name "${name}"`;
			if (data) return ` with data "${data}"`;
			return "";
		})();
		super(`ABI ${type}${selector} not found.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiItem.NotFoundError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/Solidity.js
var arrayRegex = /^(.*)\[([0-9]*)\]$/;
var bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
2n ** (8n - 1n) - 1n;
2n ** (16n - 1n) - 1n;
2n ** (24n - 1n) - 1n;
2n ** (32n - 1n) - 1n;
2n ** (40n - 1n) - 1n;
2n ** (48n - 1n) - 1n;
2n ** (56n - 1n) - 1n;
2n ** (64n - 1n) - 1n;
2n ** (72n - 1n) - 1n;
2n ** (80n - 1n) - 1n;
2n ** (88n - 1n) - 1n;
2n ** (96n - 1n) - 1n;
2n ** (104n - 1n) - 1n;
2n ** (112n - 1n) - 1n;
2n ** (120n - 1n) - 1n;
2n ** (128n - 1n) - 1n;
2n ** (136n - 1n) - 1n;
2n ** (144n - 1n) - 1n;
2n ** (152n - 1n) - 1n;
2n ** (160n - 1n) - 1n;
2n ** (168n - 1n) - 1n;
2n ** (176n - 1n) - 1n;
2n ** (184n - 1n) - 1n;
2n ** (192n - 1n) - 1n;
2n ** (200n - 1n) - 1n;
2n ** (208n - 1n) - 1n;
2n ** (216n - 1n) - 1n;
2n ** (224n - 1n) - 1n;
2n ** (232n - 1n) - 1n;
2n ** (240n - 1n) - 1n;
2n ** (248n - 1n) - 1n;
2n ** (256n - 1n) - 1n;
-(2n ** (8n - 1n));
-(2n ** (16n - 1n));
-(2n ** (24n - 1n));
-(2n ** (32n - 1n));
-(2n ** (40n - 1n));
-(2n ** (48n - 1n));
-(2n ** (56n - 1n));
-(2n ** (64n - 1n));
-(2n ** (72n - 1n));
-(2n ** (80n - 1n));
-(2n ** (88n - 1n));
-(2n ** (96n - 1n));
-(2n ** (104n - 1n));
-(2n ** (112n - 1n));
-(2n ** (120n - 1n));
-(2n ** (128n - 1n));
-(2n ** (136n - 1n));
-(2n ** (144n - 1n));
-(2n ** (152n - 1n));
-(2n ** (160n - 1n));
-(2n ** (168n - 1n));
-(2n ** (176n - 1n));
-(2n ** (184n - 1n));
-(2n ** (192n - 1n));
-(2n ** (200n - 1n));
-(2n ** (208n - 1n));
-(2n ** (216n - 1n));
-(2n ** (224n - 1n));
-(2n ** (232n - 1n));
-(2n ** (240n - 1n));
-(2n ** (248n - 1n));
-(2n ** (256n - 1n));
//#endregion
//#region node_modules/ox/_esm/core/internal/abiParameters.js
/** @internal */
function prepareParameters({ checksumAddress, parameters, values }) {
	const preparedParameters = [];
	for (let i = 0; i < parameters.length; i++) preparedParameters.push(prepareParameter({
		checksumAddress,
		parameter: parameters[i],
		value: values[i]
	}));
	return preparedParameters;
}
/** @internal */
function prepareParameter({ checksumAddress = false, parameter: parameter_, value }) {
	const parameter = parameter_;
	const arrayComponents = getArrayComponents(parameter.type);
	if (arrayComponents) {
		const [length, type] = arrayComponents;
		return encodeArray(value, {
			checksumAddress,
			length,
			parameter: {
				...parameter,
				type
			}
		});
	}
	if (parameter.type === "tuple") return encodeTuple(value, {
		checksumAddress,
		parameter
	});
	if (parameter.type === "address") return encodeAddress(value, { checksum: checksumAddress });
	if (parameter.type === "bool") return encodeBoolean(value);
	if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
		const signed = parameter.type.startsWith("int");
		const [, , size = "256"] = integerRegex.exec(parameter.type) ?? [];
		return encodeNumber(value, {
			signed,
			size: Number(size)
		});
	}
	if (parameter.type.startsWith("bytes")) return encodeBytes(value, { type: parameter.type });
	if (parameter.type === "string") return encodeString(value);
	throw new InvalidTypeError(parameter.type);
}
/** @internal */
function encode$2(preparedParameters) {
	let staticSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) staticSize += 32;
		else staticSize += size$1(encoded);
	}
	const staticParameters = [];
	const dynamicParameters = [];
	let dynamicSize = 0;
	for (let i = 0; i < preparedParameters.length; i++) {
		const { dynamic, encoded } = preparedParameters[i];
		if (dynamic) {
			staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
			dynamicParameters.push(encoded);
			dynamicSize += size$1(encoded);
		} else staticParameters.push(encoded);
	}
	return concat(...staticParameters, ...dynamicParameters);
}
/** @internal */
function encodeAddress(value, options) {
	const { checksum = false } = options;
	assert(value, { strict: checksum });
	return {
		dynamic: false,
		encoded: padLeft(value.toLowerCase())
	};
}
/** @internal */
function encodeArray(value, options) {
	const { checksumAddress, length, parameter } = options;
	const dynamic = length === null;
	if (!Array.isArray(value)) throw new InvalidArrayError(value);
	if (!dynamic && value.length !== length) throw new ArrayLengthMismatchError({
		expectedLength: length,
		givenLength: value.length,
		type: `${parameter.type}[${length}]`
	});
	let dynamicChild = false;
	const preparedParameters = [];
	for (let i = 0; i < value.length; i++) {
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter,
			value: value[i]
		});
		if (preparedParam.dynamic) dynamicChild = true;
		preparedParameters.push(preparedParam);
	}
	if (dynamic || dynamicChild) {
		const data = encode$2(preparedParameters);
		if (dynamic) {
			const length = fromNumber(preparedParameters.length, { size: 32 });
			return {
				dynamic: true,
				encoded: preparedParameters.length > 0 ? concat(length, data) : length
			};
		}
		if (dynamicChild) return {
			dynamic: true,
			encoded: data
		};
	}
	return {
		dynamic: false,
		encoded: concat(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function encodeBytes(value, { type }) {
	const [, parametersize] = type.split("bytes");
	const bytesSize = size$1(value);
	if (!parametersize) {
		let value_ = value;
		if (bytesSize % 32 !== 0) value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
		return {
			dynamic: true,
			encoded: concat(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
		};
	}
	if (bytesSize !== Number.parseInt(parametersize)) throw new BytesSizeMismatchError({
		expectedSize: Number.parseInt(parametersize),
		value
	});
	return {
		dynamic: false,
		encoded: padRight(value)
	};
}
/** @internal */
function encodeBoolean(value) {
	if (typeof value !== "boolean") throw new BaseError$1(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
	return {
		dynamic: false,
		encoded: padLeft(fromBoolean(value))
	};
}
/** @internal */
function encodeNumber(value, { signed, size }) {
	if (typeof size === "number") {
		const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
		const min = signed ? -max - 1n : 0n;
		if (value > max || value < min) throw new IntegerOutOfRangeError({
			max: max.toString(),
			min: min.toString(),
			signed,
			size: size / 8,
			value: value.toString()
		});
	}
	return {
		dynamic: false,
		encoded: fromNumber(value, {
			size: 32,
			signed
		})
	};
}
/** @internal */
function encodeString(value) {
	const hexValue = fromString(value);
	const partsLength = Math.ceil(size$1(hexValue) / 32);
	const parts = [];
	for (let i = 0; i < partsLength; i++) parts.push(padRight(slice(hexValue, i * 32, (i + 1) * 32)));
	return {
		dynamic: true,
		encoded: concat(padRight(fromNumber(size$1(hexValue), { size: 32 })), ...parts)
	};
}
/** @internal */
function encodeTuple(value, options) {
	const { checksumAddress, parameter } = options;
	let dynamic = false;
	const preparedParameters = [];
	for (let i = 0; i < parameter.components.length; i++) {
		const param_ = parameter.components[i];
		const preparedParam = prepareParameter({
			checksumAddress,
			parameter: param_,
			value: value[Array.isArray(value) ? i : param_.name]
		});
		preparedParameters.push(preparedParam);
		if (preparedParam.dynamic) dynamic = true;
	}
	return {
		dynamic,
		encoded: dynamic ? encode$2(preparedParameters) : concat(...preparedParameters.map(({ encoded }) => encoded))
	};
}
/** @internal */
function getArrayComponents(type) {
	const matches = type.match(/^(.*)\[(\d+)?\]$/);
	return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : void 0;
}
//#endregion
//#region node_modules/ox/_esm/core/AbiParameters.js
/**
* Encodes primitive values into ABI encoded data as per the [Application Binary Interface (ABI) Specification](https://docs.soliditylang.org/en/latest/abi-spec).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   AbiParameters.from(['string', 'uint', 'bool']),
*   ['wagmi', 420n, true],
* )
* ```
*
* @example
* ### JSON Parameters
*
* Specify **JSON ABI** Parameters as schema:
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const data = AbiParameters.encode(
*   [
*     { type: 'string', name: 'name' },
*     { type: 'uint', name: 'age' },
*     { type: 'bool', name: 'isOwner' },
*   ],
*   ['wagmi', 420n, true],
* )
* ```
*
* @param parameters - The set of ABI parameters to encode, in the shape of the `inputs` or `outputs` attribute of an ABI Item. These parameters must include valid [ABI types](https://docs.soliditylang.org/en/latest/types.html).
* @param values - The set of primitive values that correspond to the ABI types defined in `parameters`.
* @returns ABI encoded data.
*/
function encode$1(parameters, values, options) {
	const { checksumAddress = false } = options ?? {};
	if (parameters.length !== values.length) throw new LengthMismatchError({
		expectedLength: parameters.length,
		givenLength: values.length
	});
	const data = encode$2(prepareParameters({
		checksumAddress,
		parameters,
		values
	}));
	if (data.length === 0) return "0x";
	return data;
}
/**
* Encodes an array of primitive values to a [packed ABI encoding](https://docs.soliditylang.org/en/latest/abi-spec.html#non-standard-packed-mode).
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* const encoded = AbiParameters.encodePacked(
*   ['address', 'string'],
*   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'hello world'],
* )
* // @log: '0xd8da6bf26964af9d7eed9e03e53415d37aa9604568656c6c6f20776f726c64'
* ```
*
* @param types - Set of ABI types to pack encode.
* @param values - The set of primitive values that correspond to the ABI types defined in `types`.
* @returns The encoded packed data.
*/
function encodePacked(types, values) {
	if (types.length !== values.length) throw new LengthMismatchError({
		expectedLength: types.length,
		givenLength: values.length
	});
	const data = [];
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		const value = values[i];
		data.push(encodePacked.encode(type, value));
	}
	return concat(...data);
}
(function(encodePacked) {
	function encode(type, value, isArray = false) {
		if (type === "address") {
			const address = value;
			assert(address);
			return padLeft(address.toLowerCase(), isArray ? 32 : 0);
		}
		if (type === "string") return fromString(value);
		if (type === "bytes") return value;
		if (type === "bool") return padLeft(fromBoolean(value), isArray ? 32 : 1);
		const intMatch = type.match(integerRegex);
		if (intMatch) {
			const [_type, baseType, bits = "256"] = intMatch;
			const size = Number.parseInt(bits) / 8;
			return fromNumber(value, {
				size: isArray ? 32 : size,
				signed: baseType === "int"
			});
		}
		const bytesMatch = type.match(bytesRegex);
		if (bytesMatch) {
			const [_type, size] = bytesMatch;
			if (Number.parseInt(size) !== (value.length - 2) / 2) throw new BytesSizeMismatchError({
				expectedSize: Number.parseInt(size),
				value
			});
			return padRight(value, isArray ? 32 : 0);
		}
		const arrayMatch = type.match(arrayRegex);
		if (arrayMatch && Array.isArray(value)) {
			const [_type, childType] = arrayMatch;
			const data = [];
			for (let i = 0; i < value.length; i++) data.push(encode(childType, value[i], true));
			if (data.length === 0) return "0x";
			return concat(...data);
		}
		throw new InvalidTypeError(type);
	}
	encodePacked.encode = encode;
})(encodePacked || (encodePacked = {}));
/**
* The length of the array value does not match the length specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('uint256[3]'), [[69n, 420n]])
* //                                               ↑ expected: 3  ↑ ❌ length: 2
* // @error: AbiParameters.ArrayLengthMismatchError: ABI encoding array length mismatch
* // @error: for type `uint256[3]`. Expected: `3`. Given: `2`.
* ```
*
* ### Solution
*
* Pass an array of the correct length.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [[69n, 420n, 69n]])
* //                                                         ↑ ✅ length: 3
* ```
*/
var ArrayLengthMismatchError = class extends BaseError$1 {
	constructor({ expectedLength, givenLength, type }) {
		super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.ArrayLengthMismatchError"
		});
	}
};
/**
* The size of the bytes value does not match the size specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from('bytes8'), [['0xdeadbeefdeadbeefdeadbeef']])
* //                                            ↑ expected: 8 bytes  ↑ ❌ size: 12 bytes
* // @error: BytesSizeMismatchError: Size of bytes "0xdeadbeefdeadbeefdeadbeef"
* // @error: (bytes12) does not match expected size (bytes8).
* ```
*
* ### Solution
*
* Pass a bytes value of the correct size.
*
* ```ts twoslash
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['bytes8']), ['0xdeadbeefdeadbeef'])
* //                                                       ↑ ✅ size: 8 bytes
* ```
*/
var BytesSizeMismatchError = class extends BaseError$1 {
	constructor({ expectedSize, value }) {
		super(`Size of bytes "${value}" (bytes${size$1(value)}) does not match expected size (bytes${expectedSize}).`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.BytesSizeMismatchError"
		});
	}
};
/**
* The length of the values to encode does not match the length of the ABI parameters.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['string', 'uint256']), ['hello'])
* // @error: LengthMismatchError: ABI encoding params/values length mismatch.
* // @error: Expected length (params): 2
* // @error: Given length (values): 1
* ```
*
* ### Solution
*
* Pass the correct number of values to encode.
*
* ### Solution
*
* Pass a [valid ABI type](https://docs.soliditylang.org/en/develop/abi-spec.html#types).
*/
var LengthMismatchError = class extends BaseError$1 {
	constructor({ expectedLength, givenLength }) {
		super([
			"ABI encoding parameters/values length mismatch.",
			`Expected length (parameters): ${expectedLength}`,
			`Given length (values): ${givenLength}`
		].join("\n"));
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.LengthMismatchError"
		});
	}
};
/**
* The value provided is not a valid array as specified in the corresponding ABI parameter.
*
* ### Example
*
* ```ts twoslash
* // @noErrors
* import { AbiParameters } from 'ox'
* // ---cut---
* AbiParameters.encode(AbiParameters.from(['uint256[3]']), [69])
* ```
*
* ### Solution
*
* Pass an array value.
*/
var InvalidArrayError = class extends BaseError$1 {
	constructor(value) {
		super(`Value \`${value}\` is not a valid array.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidArrayError"
		});
	}
};
/**
* Throws when the ABI parameter type is invalid.
*
* @example
* ```ts twoslash
* import { AbiParameters } from 'ox'
*
* AbiParameters.decode([{ type: 'lol' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
* //                             ↑ ❌ invalid type
* // @error: AbiParameters.InvalidTypeError: Type `lol` is not a valid ABI Type.
* ```
*/
var InvalidTypeError = class extends BaseError$1 {
	constructor(type) {
		super(`Type \`${type}\` is not a valid ABI Type.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "AbiParameters.InvalidTypeError"
		});
	}
};
//#endregion
//#region node_modules/ox/_esm/core/AbiConstructor.js
/**
* ABI-encodes the provided constructor input (`inputs`).
*
* @example
* ```ts twoslash
* import { AbiConstructor } from 'ox'
*
* const constructor = AbiConstructor.from('constructor(address, uint256)')
*
* const data = AbiConstructor.encode(constructor, {
*   bytecode: '0x...',
*   args: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 123n],
* })
* ```
*
* @example
* ### End-to-end
*
* Below is an end-to-end example of using `AbiConstructor.encode` to encode the constructor of a contract and deploy it.
*
* ```ts twoslash
* import 'ox/window'
* import { AbiConstructor, Hex } from 'ox'
*
* // 1. Instantiate the ABI Constructor.
* const constructor = AbiConstructor.from(
*   'constructor(address owner, uint256 amount)',
* )
*
* // 2. Encode the ABI Constructor.
* const data = AbiConstructor.encode(constructor, {
*   bytecode: '0x...',
*   args: ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 123n],
* })
*
* // 3. Deploy the contract.
* const hash = await window.ethereum!.request({
*   method: 'eth_sendTransaction',
*   params: [{ data }],
* })
* ```
*
* :::note
*
* For simplicity, the above example uses `window.ethereum.request`, but you can use any
* type of JSON-RPC interface.
*
* :::
*
* @param abiConstructor - The ABI Constructor to encode.
* @param options - Encoding options.
* @returns The encoded constructor.
*/
function encode(abiConstructor, options) {
	const { bytecode, args } = options;
	return concat(bytecode, abiConstructor.inputs?.length && args?.length ? encode$1(abiConstructor.inputs, args) : "0x");
}
/** @internal */
function from$1(abiConstructor) {
	return from$2(abiConstructor);
}
//#endregion
//#region node_modules/ox/_esm/core/AbiFunction.js
/**
* ABI-encodes function arguments (`inputs`), prefixed with the 4 byte function selector.
*
* :::tip
*
* This function is typically used to encode a contract function and its arguments for contract calls (e.g. `data` parameter of an `eth_call` or `eth_sendTransaction`).
*
* See the [End-to-end Example](#end-to-end).
*
* :::
*
* @example
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const approve = AbiFunction.from('function approve(address, uint256)')
*
* const data = AbiFunction.encodeData( // [!code focus]
*   approve, // [!code focus]
*   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 69420n] // [!code focus]
* ) // [!code focus]
* // @log: '0x095ea7b3000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000000000000010f2c'
* ```
*
* @example
* You can extract an ABI Function from a JSON ABI with {@link ox#AbiFunction.(fromAbi:function)}:
*
* ```ts twoslash
* // @noErrors
* import { Abi, AbiFunction } from 'ox'
*
* const erc20Abi = Abi.from([...]) // [!code hl]
* const approve = AbiFunction.fromAbi(erc20Abi, 'approve') // [!code hl]
*
* const data = AbiFunction.encodeData(
*   approve,
*   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 69420n]
* )
* // @log: '0x095ea7b3000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000000000000010f2c'
* ```
*
* @example
* ### End-to-end
*
* Below is an end-to-end example of using `AbiFunction.encodeData` to encode the input of a `balanceOf` contract call on the [Wagmi Mint Example contract](https://etherscan.io/address/0xfba3912ca04dd458c843e2ee08967fc04f3579c2).
*
* ```ts twoslash
* import 'ox/window'
* import { Abi, AbiFunction } from 'ox'
*
* // 1. Extract the Function from the Contract's ABI.
* const abi = Abi.from([
*   // ...
*   {
*     name: 'balanceOf',
*     type: 'function',
*     inputs: [{ name: 'account', type: 'address' }],
*     outputs: [{ name: 'balance', type: 'uint256' }],
*     stateMutability: 'view',
*   },
*   // ...
* ])
* const balanceOf = AbiFunction.fromAbi(abi, 'balanceOf')
*
* // 2. Encode the Function Input. // [!code focus]
* const data = AbiFunction.encodeData( // [!code focus]
*   balanceOf, // [!code focus]
*   ['0xd2135CfB216b74109775236E36d4b433F1DF507B'] // [!code focus]
* ) // [!code focus]
*
* // 3. Perform the Contract Call.
* const response = await window.ethereum!.request({
*   method: 'eth_call',
*   params: [
*     {
*       data,
*       to: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
*     },
*   ],
* })
*
* // 4. Decode the Function Output.
* const balance = AbiFunction.decodeResult(balanceOf, response)
* ```
*
* :::note
*
* For simplicity, the above example uses `window.ethereum.request`, but you can use any
* type of JSON-RPC interface.
*
* :::
*
* @param abiFunction - ABI Function to encode
* @param args - Function arguments
* @returns ABI-encoded function name and arguments
*/
function encodeData(abiFunction, ...args) {
	const { overloads } = abiFunction;
	const item = overloads ? fromAbi([abiFunction, ...overloads], abiFunction.name, { args: args[0] }) : abiFunction;
	const selector = getSelector(item);
	const data = args.length > 0 ? encode$1(item.inputs, args[0]) : void 0;
	return data ? concat(selector, data) : selector;
}
/**
* Parses an arbitrary **JSON ABI Function** or **Human Readable ABI Function** into a typed {@link ox#AbiFunction.AbiFunction}.
*
* @example
* ### JSON ABIs
*
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const approve = AbiFunction.from({
*   type: 'function',
*   name: 'approve',
*   stateMutability: 'nonpayable',
*   inputs: [
*     {
*       name: 'spender',
*       type: 'address',
*     },
*     {
*       name: 'amount',
*       type: 'uint256',
*     },
*   ],
*   outputs: [{ type: 'bool' }],
* })
*
* approve
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* ### Human Readable ABIs
*
* A Human Readable ABI can be parsed into a typed ABI object:
*
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const approve = AbiFunction.from(
*   'function approve(address spender, uint256 amount) returns (bool)' // [!code hl]
* )
*
* approve
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
* @example
* It is possible to specify `struct`s along with your definitions:
*
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const approve = AbiFunction.from([
*   'struct Foo { address spender; uint256 amount; }', // [!code hl]
*   'function approve(Foo foo) returns (bool)',
* ])
*
* approve
* //^?
*
*
*
*
*
*
*
*
*
*
*
*
* ```
*
*
*
* @param abiFunction - The ABI Function to parse.
* @returns Typed ABI Function.
*/
function from(abiFunction, options = {}) {
	return from$2(abiFunction, options);
}
/**
* Extracts an {@link ox#AbiFunction.AbiFunction} from an {@link ox#Abi.Abi} given a name and optional arguments.
*
* @example
* ### Extracting by Name
*
* ABI Functions can be extracted by their name using the `name` option:
*
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
*
* const item = AbiFunction.fromAbi(abi, 'foo') // [!code focus]
* //    ^?
*
*
*
*
*
*
* ```
*
* @example
* ### Extracting by Selector
*
* ABI Functions can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
*
* ```ts twoslash
* import { Abi, AbiFunction } from 'ox'
*
* const abi = Abi.from([
*   'function foo()',
*   'event Transfer(address owner, address to, uint256 tokenId)',
*   'function bar(string a) returns (uint256 x)',
* ])
* const item = AbiFunction.fromAbi(abi, '0x095ea7b3') // [!code focus]
* //    ^?
*
*
*
*
*
*
*
*
*
* ```
*
* :::note
*
* Extracting via a hex selector is useful when extracting an ABI Function from an `eth_call` RPC response or
* from a Transaction `input`.
*
* :::
*
* @param abi - The ABI to extract from.
* @param name - The name (or selector) of the ABI item to extract.
* @param options - Extraction options.
* @returns The ABI item.
*/
function fromAbi(abi, name, options) {
	const item = fromAbi$1(abi, name, options);
	if (item.type !== "function") throw new NotFoundError({
		name,
		type: "function"
	});
	return item;
}
/**
* Computes the [4-byte selector](https://solidity-by-example.org/function-selector/) for an {@link ox#AbiFunction.AbiFunction}.
*
* Useful for computing function selectors for calldata.
*
* @example
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const selector = AbiFunction.getSelector('function ownerOf(uint256 tokenId)')
* // @log: '0x6352211e'
* ```
*
* @example
* ```ts twoslash
* import { AbiFunction } from 'ox'
*
* const selector = AbiFunction.getSelector({
*   inputs: [{ type: 'uint256' }],
*   name: 'ownerOf',
*   outputs: [],
*   stateMutability: 'view',
*   type: 'function'
* })
* // @log: '0x6352211e'
* ```
*
* @param abiItem - The ABI item to compute the selector for.
* @returns The first 4 bytes of the {@link ox#Hash.(keccak256:function)} hash of the function signature.
*/
function getSelector(abiItem) {
	return getSelector$1(abiItem);
}
//#endregion
//#region node_modules/viem/_esm/constants/address.js
var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var zeroAddress = "0x0000000000000000000000000000000000000000";
//#endregion
//#region node_modules/viem/_esm/actions/public/simulateCalls.js
var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
/**
* Simulates execution of a batch of calls.
*
* @param client - Client to use
* @param parameters - {@link SimulateCallsParameters}
* @returns Results. {@link SimulateCallsReturnType}
*
* @example
* ```ts
* import { createPublicClient, http, parseEther } from 'viem'
* import { mainnet } from 'viem/chains'
* import { simulateCalls } from 'viem/actions'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
*
* const result = await simulateCalls(client, {
*   account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
*   calls: [{
*     {
*       data: '0xdeadbeef',
*       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*     },
*     {
*       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
*       value: parseEther('1'),
*     },
*   ]
* })
* ```
*/
async function simulateCalls(client, parameters) {
	const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation } = parameters;
	const account = parameters.account ? parseAccount(parameters.account) : void 0;
	if (traceAssetChanges && !account) throw new BaseError$3("`account` is required when `traceAssetChanges` is true");
	const getBalanceData = account ? encode(from$1("constructor(bytes, bytes)"), {
		bytecode: deploylessCallViaBytecodeBytecode,
		args: [getBalanceCode, encodeData(from("function getBalance(address)"), [account.address])]
	}) : void 0;
	const assetAddresses = traceAssetChanges ? await Promise.all(parameters.calls.map(async (call) => {
		if (!call.data && !call.abi) return;
		const { accessList } = await createAccessList(client, {
			account: account.address,
			...call,
			data: call.abi ? encodeFunctionData(call) : call.data
		});
		return accessList.map(({ address, storageKeys }) => storageKeys.length > 0 ? address : null);
	})).then((x) => x.flat().filter(Boolean)) : [];
	const resultsStateOverrides = stateOverrides?.map((override) => {
		if (override.address === account?.address) return {
			...override,
			nonce: 0
		};
		return override;
	});
	const blocks = await simulateBlocks(client, {
		blockNumber,
		blockTag,
		blocks: [
			...traceAssetChanges ? [{
				calls: [{ data: getBalanceData }],
				stateOverrides
			}, {
				calls: assetAddresses.map((address, i) => ({
					abi: [from("function balanceOf(address) returns (uint256)")],
					functionName: "balanceOf",
					args: [account.address],
					to: address,
					from: zeroAddress,
					nonce: i
				})),
				stateOverrides: [{
					address: zeroAddress,
					nonce: 0
				}]
			}] : [],
			{
				calls: [...calls, {}].map((call, index) => ({
					...call,
					from: account?.address,
					nonce: index
				})),
				stateOverrides: resultsStateOverrides
			},
			...traceAssetChanges ? [
				{ calls: [{ data: getBalanceData }] },
				{
					calls: assetAddresses.map((address, i) => ({
						abi: [from("function balanceOf(address) returns (uint256)")],
						functionName: "balanceOf",
						args: [account.address],
						to: address,
						from: zeroAddress,
						nonce: i
					})),
					stateOverrides: [{
						address: zeroAddress,
						nonce: 0
					}]
				},
				{
					calls: assetAddresses.map((address, i) => ({
						to: address,
						abi: [from("function decimals() returns (uint256)")],
						functionName: "decimals",
						from: zeroAddress,
						nonce: i
					})),
					stateOverrides: [{
						address: zeroAddress,
						nonce: 0
					}]
				},
				{
					calls: assetAddresses.map((address, i) => ({
						to: address,
						abi: [from("function tokenURI(uint256) returns (string)")],
						functionName: "tokenURI",
						args: [0n],
						from: zeroAddress,
						nonce: i
					})),
					stateOverrides: [{
						address: zeroAddress,
						nonce: 0
					}]
				},
				{
					calls: assetAddresses.map((address, i) => ({
						to: address,
						abi: [from("function symbol() returns (string)")],
						functionName: "symbol",
						from: zeroAddress,
						nonce: i
					})),
					stateOverrides: [{
						address: zeroAddress,
						nonce: 0
					}]
				}
			] : []
		],
		traceTransfers,
		validation
	});
	const block_results = traceAssetChanges ? blocks[2] : blocks[0];
	const [block_ethPre, block_assetsPre, , block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols] = traceAssetChanges ? blocks : [];
	const { calls: block_calls, ...block } = block_results;
	const results = block_calls.slice(0, -1) ?? [];
	const ethPre = block_ethPre?.calls ?? [];
	const assetsPre = block_assetsPre?.calls ?? [];
	const balancesPre = [...ethPre, ...assetsPre].map((call) => call.status === "success" ? hexToBigInt(call.data) : null);
	const ethPost = block_ethPost?.calls ?? [];
	const assetsPost = block_assetsPost?.calls ?? [];
	const balancesPost = [...ethPost, ...assetsPost].map((call) => call.status === "success" ? hexToBigInt(call.data) : null);
	const decimals = (block_decimals?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
	const symbols = (block_symbols?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
	const tokenURI = (block_tokenURI?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
	const changes = [];
	for (const [i, balancePost] of balancesPost.entries()) {
		const balancePre = balancesPre[i];
		if (typeof balancePost !== "bigint") continue;
		if (typeof balancePre !== "bigint") continue;
		const decimals_ = decimals[i - 1];
		const symbol_ = symbols[i - 1];
		const tokenURI_ = tokenURI[i - 1];
		const token = (() => {
			if (i === 0) return {
				address: ethAddress,
				decimals: 18,
				symbol: "ETH"
			};
			return {
				address: assetAddresses[i - 1],
				decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : void 0,
				symbol: symbol_ ?? void 0
			};
		})();
		if (changes.some((change) => change.token.address === token.address)) continue;
		changes.push({
			token,
			value: {
				pre: balancePre,
				post: balancePost,
				diff: balancePost - balancePre
			}
		});
	}
	return {
		assetChanges: changes,
		block,
		results
	};
}
//#endregion
//#region node_modules/viem/_esm/utils/signature/serializeSignature.js
init_secp256k1();
/**
* @description Converts a signature into hex format.
*
* @param signature The signature to convert.
* @returns The signature in hex format.
*
* @example
* serializeSignature({
*   r: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
*   s: '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8',
*   yParity: 1
* })
* // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
*/
function serializeSignature({ r, s, to = "hex", v, yParity }) {
	const yParity_ = (() => {
		if (yParity === 0 || yParity === 1) return yParity;
		if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0;
		throw new Error("Invalid `v` or `yParity` value");
	})();
	const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
	if (to === "hex") return signature;
	return hexToBytes(signature);
}
//#endregion
//#region node_modules/viem/_esm/actions/public/verifyHash.js
/**
* Verifies a message hash onchain using ERC-6492.
*
* @param client - Client to use.
* @param parameters - {@link VerifyHashParameters}
* @returns Whether or not the signature is valid. {@link VerifyHashReturnType}
*/
async function verifyHash(client, parameters) {
	const { address, factory, factoryData, hash, signature, universalSignatureVerifierAddress = client.chain?.contracts?.universalSignatureVerifier?.address, ...rest } = parameters;
	const signatureHex = (() => {
		if (isHex(signature)) return signature;
		if (typeof signature === "object" && "r" in signature && "s" in signature) return serializeSignature(signature);
		return bytesToHex(signature);
	})();
	const wrappedSignature = await (async () => {
		if (!factory && !factoryData) return signatureHex;
		if (isErc6492Signature(signatureHex)) return signatureHex;
		return serializeErc6492Signature({
			address: factory,
			data: factoryData,
			signature: signatureHex
		});
	})();
	try {
		const args = universalSignatureVerifierAddress ? {
			to: universalSignatureVerifierAddress,
			data: encodeFunctionData({
				abi: universalSignatureValidatorAbi,
				functionName: "isValidSig",
				args: [
					address,
					hash,
					wrappedSignature
				]
			}),
			...rest
		} : {
			data: encodeDeployData({
				abi: universalSignatureValidatorAbi,
				args: [
					address,
					hash,
					wrappedSignature
				],
				bytecode: universalSignatureValidatorByteCode
			}),
			...rest
		};
		const { data } = await getAction$1(client, call, "call")(args);
		return hexToBool(data ?? "0x0");
	} catch (error) {
		try {
			if (isAddressEqual(getAddress(address), await recoverAddress({
				hash,
				signature
			}))) return true;
		} catch {}
		if (error instanceof CallExecutionError) return false;
		throw error;
	}
}
//#endregion
//#region node_modules/viem/_esm/actions/public/verifyMessage.js
/**
* Verify that a message was signed by the provided address.
*
* Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
*
* - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
*
* @param client - Client to use.
* @param parameters - {@link VerifyMessageParameters}
* @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
*/
async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
	return verifyHash(client, {
		address,
		factory,
		factoryData,
		hash: hashMessage(message),
		signature,
		...callRequest
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/verifyTypedData.js
/**
* Verify that typed data was signed by the provided address.
*
* - Docs {@link https://viem.sh/docs/actions/public/verifyTypedData}
*
* @param client - Client to use.
* @param parameters - {@link VerifyTypedDataParameters}
* @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
*/
async function verifyTypedData(client, parameters) {
	const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
	return verifyHash(client, {
		address,
		factory,
		factoryData,
		hash: hashTypedData({
			message,
			primaryType,
			types,
			domain
		}),
		signature,
		...callRequest
	});
}
//#endregion
//#region node_modules/viem/_esm/actions/public/watchBlockNumber.js
/**
* Watches and returns incoming block numbers.
*
* - Docs: https://viem.sh/docs/actions/public/watchBlockNumber
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
* - JSON-RPC Methods:
*   - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
*   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
*
* @param client - Client to use
* @param parameters - {@link WatchBlockNumberParameters}
* @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
*
* @example
* import { createPublicClient, watchBlockNumber, http } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const unwatch = watchBlockNumber(client, {
*   onBlockNumber: (blockNumber) => console.log(blockNumber),
* })
*/
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
	const enablePolling = (() => {
		if (typeof poll_ !== "undefined") return poll_;
		if (client.transport.type === "webSocket") return false;
		if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket") return false;
		return true;
	})();
	let prevBlockNumber;
	const pollBlockNumber = () => {
		return observe(stringify$1([
			"watchBlockNumber",
			client.uid,
			emitOnBegin,
			emitMissed,
			pollingInterval
		]), {
			onBlockNumber,
			onError
		}, (emit) => poll(async () => {
			try {
				const blockNumber = await getAction$1(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
				if (prevBlockNumber) {
					if (blockNumber === prevBlockNumber) return;
					if (blockNumber - prevBlockNumber > 1 && emitMissed) for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
						emit.onBlockNumber(i, prevBlockNumber);
						prevBlockNumber = i;
					}
				}
				if (!prevBlockNumber || blockNumber > prevBlockNumber) {
					emit.onBlockNumber(blockNumber, prevBlockNumber);
					prevBlockNumber = blockNumber;
				}
			} catch (err) {
				emit.onError?.(err);
			}
		}, {
			emitOnBegin,
			interval: pollingInterval
		}));
	};
	const subscribeBlockNumber = () => {
		return observe(stringify$1([
			"watchBlockNumber",
			client.uid,
			emitOnBegin,
			emitMissed
		]), {
			onBlockNumber,
			onError
		}, (emit) => {
			let active = true;
			let unsubscribe = () => active = false;
			(async () => {
				try {
					const { unsubscribe: unsubscribe_ } = await (() => {
						if (client.transport.type === "fallback") {
							const transport = client.transport.transports.find((transport) => transport.config.type === "webSocket");
							if (!transport) return client.transport;
							return transport.value;
						}
						return client.transport;
					})().subscribe({
						params: ["newHeads"],
						onData(data) {
							if (!active) return;
							const blockNumber = hexToBigInt(data.result?.number);
							emit.onBlockNumber(blockNumber, prevBlockNumber);
							prevBlockNumber = blockNumber;
						},
						onError(error) {
							emit.onError?.(error);
						}
					});
					unsubscribe = unsubscribe_;
					if (!active) unsubscribe();
				} catch (err) {
					onError?.(err);
				}
			})();
			return () => unsubscribe();
		});
	};
	return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}
//#endregion
//#region node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
/**
* Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt).
*
* - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
* - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
* - JSON-RPC Methods:
*   - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
*   - If a Transaction has been replaced:
*     - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
*     - Checks if one of the Transactions is a replacement
*     - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).
*
* The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).
*
* Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.
*
* There are 3 types of Transaction Replacement reasons:
*
* - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
* - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
* - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)
*
* @param client - Client to use
* @param parameters - {@link WaitForTransactionReceiptParameters}
* @returns The transaction receipt. {@link WaitForTransactionReceiptReturnType}
*
* @example
* import { createPublicClient, waitForTransactionReceipt, http } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const transactionReceipt = await waitForTransactionReceipt(client, {
*   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
* })
*/
async function waitForTransactionReceipt(client, { confirmations = 1, hash, onReplaced, pollingInterval = client.pollingInterval, retryCount = 6, retryDelay = ({ count }) => ~~(1 << count) * 200, timeout = 18e4 }) {
	const observerId = stringify$1([
		"waitForTransactionReceipt",
		client.uid,
		hash
	]);
	let transaction;
	let replacedTransaction;
	let receipt;
	let retrying = false;
	const { promise, resolve, reject } = withResolvers();
	const timer = timeout ? setTimeout(() => reject(new WaitForTransactionReceiptTimeoutError({ hash })), timeout) : void 0;
	const _unobserve = observe(observerId, {
		onReplaced,
		resolve,
		reject
	}, (emit) => {
		const _unwatch = getAction$1(client, watchBlockNumber, "watchBlockNumber")({
			emitMissed: true,
			emitOnBegin: true,
			poll: true,
			pollingInterval,
			async onBlockNumber(blockNumber_) {
				const done = (fn) => {
					clearTimeout(timer);
					_unwatch();
					fn();
					_unobserve();
				};
				let blockNumber = blockNumber_;
				if (retrying) return;
				try {
					if (receipt) {
						if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations)) return;
						done(() => emit.resolve(receipt));
						return;
					}
					if (!transaction) {
						retrying = true;
						await withRetry(async () => {
							transaction = await getAction$1(client, getTransaction, "getTransaction")({ hash });
							if (transaction.blockNumber) blockNumber = transaction.blockNumber;
						}, {
							delay: retryDelay,
							retryCount
						});
						retrying = false;
					}
					receipt = await getAction$1(client, getTransactionReceipt, "getTransactionReceipt")({ hash });
					if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations)) return;
					done(() => emit.resolve(receipt));
				} catch (err) {
					if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
						if (!transaction) {
							retrying = false;
							return;
						}
						try {
							replacedTransaction = transaction;
							retrying = true;
							const block = await withRetry(() => getAction$1(client, getBlock, "getBlock")({
								blockNumber,
								includeTransactions: true
							}), {
								delay: retryDelay,
								retryCount,
								shouldRetry: ({ error }) => error instanceof BlockNotFoundError
							});
							retrying = false;
							const replacementTransaction = block.transactions.find(({ from, nonce }) => from === replacedTransaction.from && nonce === replacedTransaction.nonce);
							if (!replacementTransaction) return;
							receipt = await getAction$1(client, getTransactionReceipt, "getTransactionReceipt")({ hash: replacementTransaction.hash });
							if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations)) return;
							let reason = "replaced";
							if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) reason = "repriced";
							else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) reason = "cancelled";
							done(() => {
								emit.onReplaced?.({
									reason,
									replacedTransaction,
									transaction: replacementTransaction,
									transactionReceipt: receipt
								});
								emit.resolve(receipt);
							});
						} catch (err_) {
							done(() => emit.reject(err_));
						}
					} else done(() => emit.reject(err));
				}
			}
		});
	});
	return promise;
}
//#endregion
//#region node_modules/viem/_esm/actions/public/watchBlocks.js
/**
* Watches and returns information for incoming blocks.
*
* - Docs: https://viem.sh/docs/actions/public/watchBlocks
* - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
* - JSON-RPC Methods:
*   - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
*   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
*
* @param client - Client to use
* @param parameters - {@link WatchBlocksParameters}
* @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
*
* @example
* import { createPublicClient, watchBlocks, http } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const unwatch = watchBlocks(client, {
*   onBlock: (block) => console.log(block),
* })
*/
function watchBlocks(client, { blockTag = "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
	const enablePolling = (() => {
		if (typeof poll_ !== "undefined") return poll_;
		if (client.transport.type === "webSocket") return false;
		if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket") return false;
		return true;
	})();
	const includeTransactions = includeTransactions_ ?? false;
	let prevBlock;
	const pollBlocks = () => {
		return observe(stringify$1([
			"watchBlocks",
			client.uid,
			blockTag,
			emitMissed,
			emitOnBegin,
			includeTransactions,
			pollingInterval
		]), {
			onBlock,
			onError
		}, (emit) => poll(async () => {
			try {
				const block = await getAction$1(client, getBlock, "getBlock")({
					blockTag,
					includeTransactions
				});
				if (block.number && prevBlock?.number) {
					if (block.number === prevBlock.number) return;
					if (block.number - prevBlock.number > 1 && emitMissed) for (let i = prevBlock?.number + 1n; i < block.number; i++) {
						const block = await getAction$1(client, getBlock, "getBlock")({
							blockNumber: i,
							includeTransactions
						});
						emit.onBlock(block, prevBlock);
						prevBlock = block;
					}
				}
				if (!prevBlock?.number || blockTag === "pending" && !block?.number || block.number && block.number > prevBlock.number) {
					emit.onBlock(block, prevBlock);
					prevBlock = block;
				}
			} catch (err) {
				emit.onError?.(err);
			}
		}, {
			emitOnBegin,
			interval: pollingInterval
		}));
	};
	const subscribeBlocks = () => {
		let active = true;
		let emitFetched = true;
		let unsubscribe = () => active = false;
		(async () => {
			try {
				if (emitOnBegin) getAction$1(client, getBlock, "getBlock")({
					blockTag,
					includeTransactions
				}).then((block) => {
					if (!active) return;
					if (!emitFetched) return;
					onBlock(block, void 0);
					emitFetched = false;
				});
				const { unsubscribe: unsubscribe_ } = await (() => {
					if (client.transport.type === "fallback") {
						const transport = client.transport.transports.find((transport) => transport.config.type === "webSocket");
						if (!transport) return client.transport;
						return transport.value;
					}
					return client.transport;
				})().subscribe({
					params: ["newHeads"],
					async onData(data) {
						if (!active) return;
						const block = await getAction$1(client, getBlock, "getBlock")({
							blockNumber: data.blockNumber,
							includeTransactions
						}).catch(() => {});
						if (!active) return;
						onBlock(block, prevBlock);
						emitFetched = false;
						prevBlock = block;
					},
					onError(error) {
						onError?.(error);
					}
				});
				unsubscribe = unsubscribe_;
				if (!active) unsubscribe();
			} catch (err) {
				onError?.(err);
			}
		})();
		return () => unsubscribe();
	};
	return enablePolling ? pollBlocks() : subscribeBlocks();
}
//#endregion
//#region node_modules/viem/_esm/actions/public/watchEvent.js
/**
* Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).
*
* - Docs: https://viem.sh/docs/actions/public/watchEvent
* - JSON-RPC Methods:
*   - **RPC Provider supports `eth_newFilter`:**
*     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
*     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
*   - **RPC Provider does not support `eth_newFilter`:**
*     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
*
* This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).
*
* `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
*
* @param client - Client to use
* @param parameters - {@link WatchEventParameters}
* @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { watchEvent } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const unwatch = watchEvent(client, {
*   onLogs: (logs) => console.log(logs),
* })
*/
function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
	const enablePolling = (() => {
		if (typeof poll_ !== "undefined") return poll_;
		if (typeof fromBlock === "bigint") return true;
		if (client.transport.type === "webSocket") return false;
		if (client.transport.type === "fallback" && client.transport.transports[0].config.type === "webSocket") return false;
		return true;
	})();
	const strict = strict_ ?? false;
	const pollEvent = () => {
		return observe(stringify$1([
			"watchEvent",
			address,
			args,
			batch,
			client.uid,
			event,
			pollingInterval,
			fromBlock
		]), {
			onLogs,
			onError
		}, (emit) => {
			let previousBlockNumber;
			if (fromBlock !== void 0) previousBlockNumber = fromBlock - 1n;
			let filter;
			let initialized = false;
			const unwatch = poll(async () => {
				if (!initialized) {
					try {
						filter = await getAction$1(client, createEventFilter, "createEventFilter")({
							address,
							args,
							event,
							events,
							strict,
							fromBlock
						});
					} catch {}
					initialized = true;
					return;
				}
				try {
					let logs;
					if (filter) logs = await getAction$1(client, getFilterChanges, "getFilterChanges")({ filter });
					else {
						const blockNumber = await getAction$1(client, getBlockNumber, "getBlockNumber")({});
						if (previousBlockNumber && previousBlockNumber !== blockNumber) logs = await getAction$1(client, getLogs, "getLogs")({
							address,
							args,
							event,
							events,
							fromBlock: previousBlockNumber + 1n,
							toBlock: blockNumber
						});
						else logs = [];
						previousBlockNumber = blockNumber;
					}
					if (logs.length === 0) return;
					if (batch) emit.onLogs(logs);
					else for (const log of logs) emit.onLogs([log]);
				} catch (err) {
					if (filter && err instanceof InvalidInputRpcError) initialized = false;
					emit.onError?.(err);
				}
			}, {
				emitOnBegin: true,
				interval: pollingInterval
			});
			return async () => {
				if (filter) await getAction$1(client, uninstallFilter, "uninstallFilter")({ filter });
				unwatch();
			};
		});
	};
	const subscribeEvent = () => {
		let active = true;
		let unsubscribe = () => active = false;
		(async () => {
			try {
				const transport = (() => {
					if (client.transport.type === "fallback") {
						const transport = client.transport.transports.find((transport) => transport.config.type === "webSocket");
						if (!transport) return client.transport;
						return transport.value;
					}
					return client.transport;
				})();
				const events_ = events ?? (event ? [event] : void 0);
				let topics = [];
				if (events_) {
					topics = [events_.flatMap((event) => encodeEventTopics({
						abi: [event],
						eventName: event.name,
						args
					}))];
					if (event) topics = topics[0];
				}
				const { unsubscribe: unsubscribe_ } = await transport.subscribe({
					params: ["logs", {
						address,
						topics
					}],
					onData(data) {
						if (!active) return;
						const log = data.result;
						try {
							const { eventName, args } = decodeEventLog({
								abi: events_ ?? [],
								data: log.data,
								topics: log.topics,
								strict
							});
							onLogs([formatLog(log, {
								args,
								eventName
							})]);
						} catch (err) {
							let eventName;
							let isUnnamed;
							if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
								if (strict_) return;
								eventName = err.abiItem.name;
								isUnnamed = err.abiItem.inputs?.some((x) => !("name" in x && x.name));
							}
							onLogs([formatLog(log, {
								args: isUnnamed ? [] : {},
								eventName
							})]);
						}
					},
					onError(error) {
						onError?.(error);
					}
				});
				unsubscribe = unsubscribe_;
				if (!active) unsubscribe();
			} catch (err) {
				onError?.(err);
			}
		})();
		return () => unsubscribe();
	};
	return enablePolling ? pollEvent() : subscribeEvent();
}
//#endregion
//#region node_modules/viem/_esm/actions/public/watchPendingTransactions.js
/**
* Watches and returns pending transaction hashes.
*
* - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
* - JSON-RPC Methods:
*   - When `poll: true`
*     - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
*     - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
*   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.
*
* This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).
*
* @param client - Client to use
* @param parameters - {@link WatchPendingTransactionsParameters}
* @returns A function that can be invoked to stop watching for new pending transaction hashes. {@link WatchPendingTransactionsReturnType}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
* import { watchPendingTransactions } from 'viem/public'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
* const unwatch = await watchPendingTransactions(client, {
*   onTransactions: (hashes) => console.log(hashes),
* })
*/
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
	const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket";
	const pollPendingTransactions = () => {
		return observe(stringify$1([
			"watchPendingTransactions",
			client.uid,
			batch,
			pollingInterval
		]), {
			onTransactions,
			onError
		}, (emit) => {
			let filter;
			const unwatch = poll(async () => {
				try {
					if (!filter) try {
						filter = await getAction$1(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
						return;
					} catch (err) {
						unwatch();
						throw err;
					}
					const hashes = await getAction$1(client, getFilterChanges, "getFilterChanges")({ filter });
					if (hashes.length === 0) return;
					if (batch) emit.onTransactions(hashes);
					else for (const hash of hashes) emit.onTransactions([hash]);
				} catch (err) {
					emit.onError?.(err);
				}
			}, {
				emitOnBegin: true,
				interval: pollingInterval
			});
			return async () => {
				if (filter) await getAction$1(client, uninstallFilter, "uninstallFilter")({ filter });
				unwatch();
			};
		});
	};
	const subscribePendingTransactions = () => {
		let active = true;
		let unsubscribe = () => active = false;
		(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ["newPendingTransactions"],
					onData(data) {
						if (!active) return;
						const transaction = data.result;
						onTransactions([transaction]);
					},
					onError(error) {
						onError?.(error);
					}
				});
				unsubscribe = unsubscribe_;
				if (!active) unsubscribe();
			} catch (err) {
				onError?.(err);
			}
		})();
		return () => unsubscribe();
	};
	return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
}
//#endregion
//#region node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
/**
* @description Parses EIP-4361 formatted message into message fields object.
*
* @see https://eips.ethereum.org/EIPS/eip-4361
*
* @returns EIP-4361 fields object
*/
function parseSiweMessage(message) {
	const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
	const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
	const resources = message.split("Resources:")[1]?.split("\n- ").slice(1);
	return {
		...prefix,
		...suffix,
		...chainId ? { chainId: Number(chainId) } : {},
		...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
		...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
		...notBefore ? { notBefore: new Date(notBefore) } : {},
		...requestId ? { requestId } : {},
		...resources ? { resources } : {},
		...scheme ? { scheme } : {},
		...statement ? { statement } : {}
	};
}
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;
//#endregion
//#region node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
/**
* @description Validates EIP-4361 message.
*
* @see https://eips.ethereum.org/EIPS/eip-4361
*/
function validateSiweMessage(parameters) {
	const { address, domain, message, nonce, scheme, time = /* @__PURE__ */ new Date() } = parameters;
	if (domain && message.domain !== domain) return false;
	if (nonce && message.nonce !== nonce) return false;
	if (scheme && message.scheme !== scheme) return false;
	if (message.expirationTime && time >= message.expirationTime) return false;
	if (message.notBefore && time < message.notBefore) return false;
	try {
		if (!message.address) return false;
		if (address && !isAddressEqual(message.address, address)) return false;
	} catch {
		return false;
	}
	return true;
}
//#endregion
//#region node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
/**
* Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.
*
* Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
*
* - Docs {@link https://viem.sh/docs/siwe/actions/verifySiweMessage}
*
* @param client - Client to use.
* @param parameters - {@link VerifySiweMessageParameters}
* @returns Whether or not the signature is valid. {@link VerifySiweMessageReturnType}
*/
async function verifySiweMessage(client, parameters) {
	const { address, domain, message, nonce, scheme, signature, time = /* @__PURE__ */ new Date(), ...callRequest } = parameters;
	const parsed = parseSiweMessage(message);
	if (!parsed.address) return false;
	if (!validateSiweMessage({
		address,
		domain,
		message: parsed,
		nonce,
		scheme,
		time
	})) return false;
	const hash = hashMessage(message);
	return verifyHash(client, {
		address: parsed.address,
		hash,
		signature,
		...callRequest
	});
}
//#endregion
//#region node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
	return {
		call: (args) => call(client, args),
		createAccessList: (args) => createAccessList(client, args),
		createBlockFilter: () => createBlockFilter(client),
		createContractEventFilter: (args) => createContractEventFilter(client, args),
		createEventFilter: (args) => createEventFilter(client, args),
		createPendingTransactionFilter: () => createPendingTransactionFilter(client),
		estimateContractGas: (args) => estimateContractGas(client, args),
		estimateGas: (args) => estimateGas(client, args),
		getBalance: (args) => getBalance(client, args),
		getBlobBaseFee: () => getBlobBaseFee(client),
		getBlock: (args) => getBlock(client, args),
		getBlockNumber: (args) => getBlockNumber(client, args),
		getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
		getBytecode: (args) => getCode(client, args),
		getChainId: () => getChainId$1(client),
		getCode: (args) => getCode(client, args),
		getContractEvents: (args) => getContractEvents(client, args),
		getEip712Domain: (args) => getEip712Domain(client, args),
		getEnsAddress: (args) => getEnsAddress(client, args),
		getEnsAvatar: (args) => getEnsAvatar(client, args),
		getEnsName: (args) => getEnsName(client, args),
		getEnsResolver: (args) => getEnsResolver(client, args),
		getEnsText: (args) => getEnsText(client, args),
		getFeeHistory: (args) => getFeeHistory(client, args),
		estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
		getFilterChanges: (args) => getFilterChanges(client, args),
		getFilterLogs: (args) => getFilterLogs(client, args),
		getGasPrice: () => getGasPrice(client),
		getLogs: (args) => getLogs(client, args),
		getProof: (args) => getProof(client, args),
		estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
		getStorageAt: (args) => getStorageAt(client, args),
		getTransaction: (args) => getTransaction(client, args),
		getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
		getTransactionCount: (args) => getTransactionCount(client, args),
		getTransactionReceipt: (args) => getTransactionReceipt(client, args),
		multicall: (args) => multicall(client, args),
		prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
		readContract: (args) => readContract(client, args),
		sendRawTransaction: (args) => sendRawTransaction(client, args),
		simulate: (args) => simulateBlocks(client, args),
		simulateBlocks: (args) => simulateBlocks(client, args),
		simulateCalls: (args) => simulateCalls(client, args),
		simulateContract: (args) => simulateContract(client, args),
		verifyMessage: (args) => verifyMessage(client, args),
		verifySiweMessage: (args) => verifySiweMessage(client, args),
		verifyTypedData: (args) => verifyTypedData(client, args),
		uninstallFilter: (args) => uninstallFilter(client, args),
		waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
		watchBlocks: (args) => watchBlocks(client, args),
		watchBlockNumber: (args) => watchBlockNumber(client, args),
		watchContractEvent: (args) => watchContractEvent(client, args),
		watchEvent: (args) => watchEvent(client, args),
		watchPendingTransactions: (args) => watchPendingTransactions(client, args)
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/getAction.js
/**
* Retrieves and returns an action from the client (if exists), and falls
* back to the tree-shakable action.
*
* Useful for extracting overridden actions from a client (ie. if a consumer
* wants to override the `sendTransaction` implementation).
*/
function getAction(client, actionFn, name) {
	const action_implicit = client[actionFn.name];
	if (typeof action_implicit === "function") return action_implicit;
	const action_explicit = client[name];
	if (typeof action_explicit === "function") return action_explicit;
	return (params) => actionFn(client, params);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/connect.js
/** https://wagmi.sh/core/api/actions/connect */
async function connect(config, parameters) {
	let connector;
	if (typeof parameters.connector === "function") connector = config._internal.connectors.setup(parameters.connector);
	else connector = parameters.connector;
	if (connector.uid === config.state.current) throw new ConnectorAlreadyConnectedError();
	try {
		config.setState((x) => ({
			...x,
			status: "connecting"
		}));
		connector.emitter.emit("message", { type: "connecting" });
		const { connector: _, ...rest } = parameters;
		const data = await connector.connect(rest);
		const accounts = data.accounts;
		connector.emitter.off("connect", config._internal.events.connect);
		connector.emitter.on("change", config._internal.events.change);
		connector.emitter.on("disconnect", config._internal.events.disconnect);
		await config.storage?.setItem("recentConnectorId", connector.id);
		config.setState((x) => ({
			...x,
			connections: new Map(x.connections).set(connector.uid, {
				accounts,
				chainId: data.chainId,
				connector
			}),
			current: connector.uid,
			status: "connected"
		}));
		return {
			accounts,
			chainId: data.chainId
		};
	} catch (error) {
		config.setState((x) => ({
			...x,
			status: x.current ? "connected" : "disconnected"
		}));
		throw error;
	}
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getConnectorClient.js
/** https://wagmi.sh/core/api/actions/getConnectorClient */
async function getConnectorClient(config, parameters = {}) {
	let connection;
	if (parameters.connector) {
		const { connector } = parameters;
		if (config.state.status === "reconnecting" && !connector.getAccounts && !connector.getChainId) throw new ConnectorUnavailableReconnectingError({ connector });
		const [accounts, chainId] = await Promise.all([connector.getAccounts().catch((e) => {
			if (parameters.account === null) return [];
			throw e;
		}), connector.getChainId()]);
		connection = {
			accounts,
			chainId,
			connector
		};
	} else connection = config.state.connections.get(config.state.current);
	if (!connection) throw new ConnectorNotConnectedError();
	const chainId = parameters.chainId ?? connection.chainId;
	const connectorChainId = await connection.connector.getChainId();
	if (connectorChainId !== connection.chainId) throw new ConnectorChainMismatchError({
		connectionChainId: connection.chainId,
		connectorChainId
	});
	const connector = connection.connector;
	if (connector.getClient) return connector.getClient({ chainId });
	const account = parseAccount(parameters.account ?? connection.accounts[0]);
	if (account) account.address = getAddress(account.address);
	if (parameters.account && !connection.accounts.some((x) => x.toLowerCase() === account.address.toLowerCase())) throw new ConnectorAccountNotFoundError({
		address: account.address,
		connector
	});
	const chain = config.chains.find((chain) => chain.id === chainId);
	const provider = await connection.connector.getProvider({ chainId });
	return createClient({
		account,
		chain,
		name: "Connector Client",
		transport: (opts) => custom(provider)({
			...opts,
			retryCount: 0
		})
	});
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/disconnect.js
/** https://wagmi.sh/core/api/actions/disconnect */
async function disconnect(config, parameters = {}) {
	let connector;
	if (parameters.connector) connector = parameters.connector;
	else {
		const { connections, current } = config.state;
		connector = connections.get(current)?.connector;
	}
	const connections = config.state.connections;
	if (connector) {
		await connector.disconnect();
		connector.emitter.off("change", config._internal.events.change);
		connector.emitter.off("disconnect", config._internal.events.disconnect);
		connector.emitter.on("connect", config._internal.events.connect);
		connections.delete(connector.uid);
	}
	config.setState((x) => {
		if (connections.size === 0) return {
			...x,
			connections: /* @__PURE__ */ new Map(),
			current: null,
			status: "disconnected"
		};
		const nextConnection = connections.values().next().value;
		return {
			...x,
			connections: new Map(connections),
			current: nextConnection.connector.uid
		};
	});
	{
		const current = config.state.current;
		if (!current) return;
		const connector = config.state.connections.get(current)?.connector;
		if (!connector) return;
		await config.storage?.setItem("recentConnectorId", connector.id);
	}
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getAccount.js
/** https://wagmi.sh/core/api/actions/getAccount */
function getAccount(config) {
	const uid = config.state.current;
	const connection = config.state.connections.get(uid);
	const addresses = connection?.accounts;
	const address = addresses?.[0];
	const chain = config.chains.find((chain) => chain.id === connection?.chainId);
	const status = config.state.status;
	switch (status) {
		case "connected": return {
			address,
			addresses,
			chain,
			chainId: connection?.chainId,
			connector: connection?.connector,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status
		};
		case "reconnecting": return {
			address,
			addresses,
			chain,
			chainId: connection?.chainId,
			connector: connection?.connector,
			isConnected: !!address,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: true,
			status
		};
		case "connecting": return {
			address,
			addresses,
			chain,
			chainId: connection?.chainId,
			connector: connection?.connector,
			isConnected: false,
			isConnecting: true,
			isDisconnected: false,
			isReconnecting: false,
			status
		};
		case "disconnected": return {
			address: void 0,
			addresses: void 0,
			chain: void 0,
			chainId: void 0,
			connector: void 0,
			isConnected: false,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			status
		};
	}
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getChainId.js
/** https://wagmi.sh/core/api/actions/getChainId */
function getChainId(config) {
	return config.state.chainId;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/deepEqual.js
/** Forked from https://github.com/epoberezkin/fast-deep-equal */
function deepEqual(a, b) {
	if (a === b) return true;
	if (a && b && typeof a === "object" && typeof b === "object") {
		if (a.constructor !== b.constructor) return false;
		let length;
		let i;
		if (Array.isArray(a) && Array.isArray(b)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
		if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
		const keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key && !deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getChains.js
var previousChains = [];
/** https://wagmi.sh/core/api/actions/getChains */
function getChains(config) {
	const chains = config.chains;
	if (deepEqual(previousChains, chains)) return previousChains;
	previousChains = chains;
	return chains;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getClient.js
function getClient(config, parameters = {}) {
	let client = void 0;
	try {
		client = config.getClient(parameters);
	} catch {}
	return client;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getConnections.js
var previousConnections = [];
/** https://wagmi.sh/core/api/actions/getConnections */
function getConnections(config) {
	const connections = [...config.state.connections.values()];
	if (config.state.status === "reconnecting") return previousConnections;
	if (deepEqual(previousConnections, connections)) return previousConnections;
	previousConnections = connections;
	return connections;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getConnectors.js
var previousConnectors = [];
/** https://wagmi.sh/core/api/actions/getConnectors */
function getConnectors(config) {
	const connectors = config.connectors;
	if (deepEqual(previousConnectors, connectors)) return previousConnectors;
	previousConnectors = connectors;
	return connectors;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/getPublicClient.js
function getPublicClient(config, parameters = {}) {
	return getClient(config, parameters)?.extend(publicActions);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/reconnect.js
var isReconnecting = false;
/** https://wagmi.sh/core/api/actions/reconnect */
async function reconnect(config, parameters = {}) {
	if (isReconnecting) return [];
	isReconnecting = true;
	config.setState((x) => ({
		...x,
		status: x.current ? "reconnecting" : "connecting"
	}));
	const connectors = [];
	if (parameters.connectors?.length) for (const connector_ of parameters.connectors) {
		let connector;
		if (typeof connector_ === "function") connector = config._internal.connectors.setup(connector_);
		else connector = connector_;
		connectors.push(connector);
	}
	else connectors.push(...config.connectors);
	let recentConnectorId;
	try {
		recentConnectorId = await config.storage?.getItem("recentConnectorId");
	} catch {}
	const scores = {};
	for (const [, connection] of config.state.connections) scores[connection.connector.id] = 1;
	if (recentConnectorId) scores[recentConnectorId] = 0;
	const sorted = Object.keys(scores).length > 0 ? [...connectors].sort((a, b) => (scores[a.id] ?? 10) - (scores[b.id] ?? 10)) : connectors;
	let connected = false;
	const connections = [];
	const providers = [];
	for (const connector of sorted) {
		const provider = await connector.getProvider().catch(() => void 0);
		if (!provider) continue;
		if (providers.some((x) => x === provider)) continue;
		if (!await connector.isAuthorized()) continue;
		const data = await connector.connect({ isReconnecting: true }).catch(() => null);
		if (!data) continue;
		connector.emitter.off("connect", config._internal.events.connect);
		connector.emitter.on("change", config._internal.events.change);
		connector.emitter.on("disconnect", config._internal.events.disconnect);
		config.setState((x) => {
			const connections = new Map(connected ? x.connections : /* @__PURE__ */ new Map()).set(connector.uid, {
				accounts: data.accounts,
				chainId: data.chainId,
				connector
			});
			return {
				...x,
				current: connected ? x.current : connector.uid,
				connections
			};
		});
		connections.push({
			accounts: data.accounts,
			chainId: data.chainId,
			connector
		});
		providers.push(provider);
		connected = true;
	}
	if (config.state.status === "reconnecting" || config.state.status === "connecting") {
		if (!connected) config.setState((x) => ({
			...x,
			connections: /* @__PURE__ */ new Map(),
			current: null,
			status: "disconnected"
		}));
		else config.setState((x) => ({
			...x,
			status: "connected"
		}));
	}
	isReconnecting = false;
	return connections;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/errors/connector.js
var ProviderNotFoundError = class extends BaseError$4 {
	constructor() {
		super("Provider not found.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ProviderNotFoundError"
		});
	}
};
var SwitchChainNotSupportedError = class extends BaseError$4 {
	constructor({ connector }) {
		super(`"${connector.name}" does not support programmatic chain switching.`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "SwitchChainNotSupportedError"
		});
	}
};
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/switchChain.js
/** https://wagmi.sh/core/api/actions/switchChain */
async function switchChain(config, parameters) {
	const { addEthereumChainParameter, chainId } = parameters;
	const connection = config.state.connections.get(parameters.connector?.uid ?? config.state.current);
	if (connection) {
		const connector = connection.connector;
		if (!connector.switchChain) throw new SwitchChainNotSupportedError({ connector });
		return await connector.switchChain({
			addEthereumChainParameter,
			chainId
		});
	}
	const chain = config.chains.find((x) => x.id === chainId);
	if (!chain) throw new ChainNotConfiguredError();
	config.setState((x) => ({
		...x,
		chainId
	}));
	return chain;
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchAccount.js
/** https://wagmi.sh/core/api/actions/watchAccount */
function watchAccount(config, parameters) {
	const { onChange } = parameters;
	return config.subscribe(() => getAccount(config), onChange, { equalityFn(a, b) {
		const { connector: aConnector, ...aRest } = a;
		const { connector: bConnector, ...bRest } = b;
		return deepEqual(aRest, bRest) && aConnector?.id === bConnector?.id && aConnector?.uid === bConnector?.uid;
	} });
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchChainId.js
/** https://wagmi.sh/core/api/actions/watchChainId */
function watchChainId(config, parameters) {
	const { onChange } = parameters;
	return config.subscribe((state) => state.chainId, onChange);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchConnections.js
/** https://wagmi.sh/core/api/actions/watchConnections */
function watchConnections(config, parameters) {
	const { onChange } = parameters;
	return config.subscribe(() => getConnections(config), onChange, { equalityFn: deepEqual });
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchConnectors.js
/** https://wagmi.sh/core/api/actions/watchConnectors */
function watchConnectors(config, parameters) {
	const { onChange } = parameters;
	return config._internal.connectors.subscribe((connectors, prevConnectors) => {
		onChange(Object.values(connectors), prevConnectors);
	});
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchPublicClient.js
/** https://wagmi.sh/core/api/actions/watchPublicClient */
function watchPublicClient(config, parameters) {
	const { onChange } = parameters;
	return config.subscribe(() => getPublicClient(config), onChange, { equalityFn(a, b) {
		return a?.uid === b?.uid;
	} });
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/writeContract.js
/** https://wagmi.sh/core/api/actions/writeContract */
async function writeContract(config, parameters) {
	const { account, chainId, connector, ...request } = parameters;
	let client;
	if (typeof account === "object" && account?.type === "local") client = config.getClient({ chainId });
	else client = await getConnectorClient(config, {
		account: account ?? void 0,
		chainId,
		connector
	});
	return await getAction(client, writeContract$1, "writeContract")({
		...request,
		...account ? { account } : {},
		chain: chainId ? { id: chainId } : null
	});
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/connectors/injected.js
injected.type = "injected";
function injected(parameters = {}) {
	const { shimDisconnect = true, unstable_shimAsyncInject } = parameters;
	function getTarget() {
		const target = parameters.target;
		if (typeof target === "function") {
			const result = target();
			if (result) return result;
		}
		if (typeof target === "object") return target;
		if (typeof target === "string") return { ...targetMap[target] ?? {
			id: target,
			name: `${target[0].toUpperCase()}${target.slice(1)}`,
			provider: `is${target[0].toUpperCase()}${target.slice(1)}`
		} };
		return {
			id: "injected",
			name: "Injected",
			provider(window) {
				return window?.ethereum;
			}
		};
	}
	let accountsChanged;
	let chainChanged;
	let connect;
	let disconnect;
	return createConnector((config) => ({
		get icon() {
			return getTarget().icon;
		},
		get id() {
			return getTarget().id;
		},
		get name() {
			return getTarget().name;
		},
		/** @deprecated */
		get supportsSimulation() {
			return true;
		},
		type: injected.type,
		async setup() {
			const provider = await this.getProvider();
			if (provider?.on && parameters.target) {
				if (!connect) {
					connect = this.onConnect.bind(this);
					provider.on("connect", connect);
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
			}
		},
		async connect({ chainId, isReconnecting } = {}) {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			let accounts = [];
			if (isReconnecting) accounts = await this.getAccounts().catch(() => []);
			else if (shimDisconnect) try {
				accounts = (await provider.request({
					method: "wallet_requestPermissions",
					params: [{ eth_accounts: {} }]
				}))[0]?.caveats?.[0]?.value?.map((x) => getAddress(x));
				if (accounts.length > 0) accounts = await this.getAccounts();
			} catch (err) {
				const error = err;
				if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
				if (error.code === ResourceUnavailableRpcError.code) throw error;
			}
			try {
				if (!accounts?.length && !isReconnecting) accounts = (await provider.request({ method: "eth_requestAccounts" })).map((x) => getAddress(x));
				if (connect) {
					provider.removeListener("connect", connect);
					connect = void 0;
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
				let currentChainId = await this.getChainId();
				if (chainId && currentChainId !== chainId) currentChainId = (await this.switchChain({ chainId }).catch((error) => {
					if (error.code === UserRejectedRequestError.code) throw error;
					return { id: currentChainId };
				}))?.id ?? currentChainId;
				if (shimDisconnect) await config.storage?.removeItem(`${this.id}.disconnected`);
				if (!parameters.target) await config.storage?.setItem("injected.connected", true);
				return {
					accounts,
					chainId: currentChainId
				};
			} catch (err) {
				const error = err;
				if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
				if (error.code === ResourceUnavailableRpcError.code) throw new ResourceUnavailableRpcError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			if (!connect) {
				connect = this.onConnect.bind(this);
				provider.on("connect", connect);
			}
			try {
				await withTimeout(() => provider.request({
					method: "wallet_revokePermissions",
					params: [{ eth_accounts: {} }]
				}), { timeout: 100 });
			} catch {}
			if (shimDisconnect) await config.storage?.setItem(`${this.id}.disconnected`, true);
			if (!parameters.target) await config.storage?.removeItem("injected.connected");
		},
		async getAccounts() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			return (await provider.request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			const hexChainId = await provider.request({ method: "eth_chainId" });
			return Number(hexChainId);
		},
		async getProvider() {
			if (typeof window === "undefined") return void 0;
			let provider;
			const target = getTarget();
			if (typeof target.provider === "function") provider = target.provider(window);
			else if (typeof target.provider === "string") provider = findProvider(window, target.provider);
			else provider = target.provider;
			if (provider && !provider.removeListener) {
				if ("off" in provider && typeof provider.off === "function") provider.removeListener = provider.off;
				else provider.removeListener = () => {};
			}
			return provider;
		},
		async isAuthorized() {
			try {
				if (shimDisconnect && await config.storage?.getItem(`${this.id}.disconnected`)) return false;
				if (!parameters.target) {
					if (!await config.storage?.getItem("injected.connected")) return false;
				}
				if (!await this.getProvider()) {
					if (unstable_shimAsyncInject !== void 0 && unstable_shimAsyncInject !== false) {
						const handleEthereum = async () => {
							if (typeof window !== "undefined") window.removeEventListener("ethereum#initialized", handleEthereum);
							return !!await this.getProvider();
						};
						const timeout = typeof unstable_shimAsyncInject === "number" ? unstable_shimAsyncInject : 1e3;
						if (await Promise.race([...typeof window !== "undefined" ? [new Promise((resolve) => window.addEventListener("ethereum#initialized", () => resolve(handleEthereum()), { once: true }))] : [], new Promise((resolve) => setTimeout(() => resolve(handleEthereum()), timeout))])) return true;
					}
					throw new ProviderNotFoundError();
				}
				return !!(await withRetry(() => this.getAccounts())).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const provider = await this.getProvider();
			if (!provider) throw new ProviderNotFoundError();
			const chain = config.chains.find((x) => x.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const promise = new Promise((resolve) => {
				const listener = ((data) => {
					if ("chainId" in data && data.chainId === chainId) {
						config.emitter.off("change", listener);
						resolve();
					}
				});
				config.emitter.on("change", listener);
			});
			try {
				await Promise.all([provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chainId) }]
				}).then(async () => {
					if (await this.getChainId() === chainId) config.emitter.emit("change", { chainId });
				}), promise]);
				return chain;
			} catch (err) {
				const error = err;
				if (error.code === 4902 || error?.data?.originalError?.code === 4902) try {
					const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else if (blockExplorer) blockExplorerUrls = [blockExplorer.url, ...Object.values(blockExplorers).map((x) => x.url)];
					let rpcUrls;
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [chain.rpcUrls.default?.http[0] ?? ""];
					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					};
					await Promise.all([provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					}).then(async () => {
						if (await this.getChainId() === chainId) config.emitter.emit("change", { chainId });
						else throw new UserRejectedRequestError(/* @__PURE__ */ new Error("User rejected switch after adding network."));
					}), promise]);
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
				throw new SwitchChainError(error);
			}
		},
		async onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else if (config.emitter.listenerCount("connect")) {
				const chainId = (await this.getChainId()).toString();
				this.onConnect({ chainId });
				if (shimDisconnect) await config.storage?.removeItem(`${this.id}.disconnected`);
			} else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onConnect(connectInfo) {
			const accounts = await this.getAccounts();
			if (accounts.length === 0) return;
			const chainId = Number(connectInfo.chainId);
			config.emitter.emit("connect", {
				accounts,
				chainId
			});
			const provider = await this.getProvider();
			if (provider) {
				if (connect) {
					provider.removeListener("connect", connect);
					connect = void 0;
				}
				if (!accountsChanged) {
					accountsChanged = this.onAccountsChanged.bind(this);
					provider.on("accountsChanged", accountsChanged);
				}
				if (!chainChanged) {
					chainChanged = this.onChainChanged.bind(this);
					provider.on("chainChanged", chainChanged);
				}
				if (!disconnect) {
					disconnect = this.onDisconnect.bind(this);
					provider.on("disconnect", disconnect);
				}
			}
		},
		async onDisconnect(error) {
			const provider = await this.getProvider();
			if (error && error.code === 1013) {
				if (provider && !!(await this.getAccounts()).length) return;
			}
			config.emitter.emit("disconnect");
			if (provider) {
				if (chainChanged) {
					provider.removeListener("chainChanged", chainChanged);
					chainChanged = void 0;
				}
				if (disconnect) {
					provider.removeListener("disconnect", disconnect);
					disconnect = void 0;
				}
				if (!connect) {
					connect = this.onConnect.bind(this);
					provider.on("connect", connect);
				}
			}
		}
	}));
}
var targetMap = {
	coinbaseWallet: {
		id: "coinbaseWallet",
		name: "Coinbase Wallet",
		provider(window) {
			if (window?.coinbaseWalletExtension) return window.coinbaseWalletExtension;
			return findProvider(window, "isCoinbaseWallet");
		}
	},
	metaMask: {
		id: "metaMask",
		name: "MetaMask",
		provider(window) {
			return findProvider(window, (provider) => {
				if (!provider.isMetaMask) return false;
				if (provider.isBraveWallet && !provider._events && !provider._state) return false;
				for (const flag of [
					"isApexWallet",
					"isAvalanche",
					"isBitKeep",
					"isBlockWallet",
					"isKuCoinWallet",
					"isMathWallet",
					"isOkxWallet",
					"isOKExWallet",
					"isOneInchIOSWallet",
					"isOneInchAndroidWallet",
					"isOpera",
					"isPhantom",
					"isPortal",
					"isRabby",
					"isTokenPocket",
					"isTokenary",
					"isUniswapWallet",
					"isZerion"
				]) if (provider[flag]) return false;
				return true;
			});
		}
	},
	phantom: {
		id: "phantom",
		name: "Phantom",
		provider(window) {
			if (window?.phantom?.ethereum) return window.phantom?.ethereum;
			return findProvider(window, "isPhantom");
		}
	}
};
function findProvider(window, select) {
	function isProvider(provider) {
		if (typeof select === "function") return select(provider);
		if (typeof select === "string") return provider[select];
		return true;
	}
	const ethereum = window.ethereum;
	if (ethereum?.providers) return ethereum.providers.find((provider) => isProvider(provider));
	if (ethereum && isProvider(ethereum)) return ethereum;
}
//#endregion
//#region node_modules/mipd/dist/esm/utils.js
/**
* Watches for EIP-1193 Providers to be announced.
*/
function requestProviders(listener) {
	if (typeof window === "undefined") return;
	const handler = (event) => listener(event.detail);
	window.addEventListener("eip6963:announceProvider", handler);
	window.dispatchEvent(new CustomEvent("eip6963:requestProvider"));
	return () => window.removeEventListener("eip6963:announceProvider", handler);
}
//#endregion
//#region node_modules/mipd/dist/esm/store.js
function createStore$1() {
	const listeners = /* @__PURE__ */ new Set();
	let providerDetails = [];
	const request = () => requestProviders((providerDetail) => {
		if (providerDetails.some(({ info }) => info.uuid === providerDetail.info.uuid)) return;
		providerDetails = [...providerDetails, providerDetail];
		listeners.forEach((listener) => listener(providerDetails, { added: [providerDetail] }));
	});
	let unwatch = request();
	return {
		_listeners() {
			return listeners;
		},
		clear() {
			listeners.forEach((listener) => listener([], { removed: [...providerDetails] }));
			providerDetails = [];
		},
		destroy() {
			this.clear();
			listeners.clear();
			unwatch?.();
		},
		findProvider({ rdns }) {
			return providerDetails.find((providerDetail) => providerDetail.info.rdns === rdns);
		},
		getProviders() {
			return providerDetails;
		},
		reset() {
			this.clear();
			unwatch?.();
			unwatch = request();
		},
		subscribe(listener, { emitImmediately } = {}) {
			listeners.add(listener);
			if (emitImmediately) listener(providerDetails, { added: providerDetails });
			return () => listeners.delete(listener);
		}
	};
}
//#endregion
//#region node_modules/@wagmi/core/node_modules/zustand/esm/middleware.mjs
var subscribeWithSelectorImpl = (fn) => (set, get, api) => {
	const origSubscribe = api.subscribe;
	api.subscribe = (selector, optListener, options) => {
		let listener = selector;
		if (optListener) {
			const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
			let currentSlice = selector(api.getState());
			listener = (state) => {
				const nextSlice = selector(state);
				if (!equalityFn(currentSlice, nextSlice)) {
					const previousSlice = currentSlice;
					optListener(currentSlice = nextSlice, previousSlice);
				}
			};
			if (options == null ? void 0 : options.fireImmediately) optListener(currentSlice, currentSlice);
		}
		return origSubscribe(listener);
	};
	return fn(set, get, api);
};
var subscribeWithSelector = subscribeWithSelectorImpl;
function createJSONStorage(getStorage, options) {
	let storage;
	try {
		storage = getStorage();
	} catch (e) {
		return;
	}
	return {
		getItem: (name) => {
			var _a;
			const parse = (str2) => {
				if (str2 === null) return null;
				return JSON.parse(str2, options == null ? void 0 : options.reviver);
			};
			const str = (_a = storage.getItem(name)) != null ? _a : null;
			if (str instanceof Promise) return str.then(parse);
			return parse(str);
		},
		setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
		removeItem: (name) => storage.removeItem(name)
	};
}
var toThenable = (fn) => (input) => {
	try {
		const result = fn(input);
		if (result instanceof Promise) return result;
		return {
			then(onFulfilled) {
				return toThenable(onFulfilled)(result);
			},
			catch(_onRejected) {
				return this;
			}
		};
	} catch (e) {
		return {
			then(_onFulfilled) {
				return this;
			},
			catch(onRejected) {
				return toThenable(onRejected)(e);
			}
		};
	}
};
var persistImpl = (config, baseOptions) => (set, get, api) => {
	let options = {
		storage: createJSONStorage(() => localStorage),
		partialize: (state) => state,
		version: 0,
		merge: (persistedState, currentState) => ({
			...currentState,
			...persistedState
		}),
		...baseOptions
	};
	let hasHydrated = false;
	const hydrationListeners = /* @__PURE__ */ new Set();
	const finishHydrationListeners = /* @__PURE__ */ new Set();
	let storage = options.storage;
	if (!storage) return config((...args) => {
		console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
		set(...args);
	}, get, api);
	const setItem = () => {
		const state = options.partialize({ ...get() });
		return storage.setItem(options.name, {
			state,
			version: options.version
		});
	};
	const savedSetState = api.setState;
	api.setState = (state, replace) => {
		savedSetState(state, replace);
		setItem();
	};
	const configResult = config((...args) => {
		set(...args);
		setItem();
	}, get, api);
	api.getInitialState = () => configResult;
	let stateFromStorage;
	const hydrate = () => {
		var _a, _b;
		if (!storage) return;
		hasHydrated = false;
		hydrationListeners.forEach((cb) => {
			var _a2;
			return cb((_a2 = get()) != null ? _a2 : configResult);
		});
		const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
		return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
			if (deserializedStorageValue) {
				if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
					if (options.migrate) return [true, options.migrate(deserializedStorageValue.state, deserializedStorageValue.version)];
					console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
				} else return [false, deserializedStorageValue.state];
			}
			return [false, void 0];
		}).then((migrationResult) => {
			var _a2;
			const [migrated, migratedState] = migrationResult;
			stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
			set(stateFromStorage, true);
			if (migrated) return setItem();
		}).then(() => {
			postRehydrationCallback?.(stateFromStorage, void 0);
			stateFromStorage = get();
			hasHydrated = true;
			finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
		}).catch((e) => {
			postRehydrationCallback?.(void 0, e);
		});
	};
	api.persist = {
		setOptions: (newOptions) => {
			options = {
				...options,
				...newOptions
			};
			if (newOptions.storage) storage = newOptions.storage;
		},
		clearStorage: () => {
			storage?.removeItem(options.name);
		},
		getOptions: () => options,
		rehydrate: () => hydrate(),
		hasHydrated: () => hasHydrated,
		onHydrate: (cb) => {
			hydrationListeners.add(cb);
			return () => {
				hydrationListeners.delete(cb);
			};
		},
		onFinishHydration: (cb) => {
			finishHydrationListeners.add(cb);
			return () => {
				finishHydrationListeners.delete(cb);
			};
		}
	};
	if (!options.skipHydration) hydrate();
	return stateFromStorage || configResult;
};
var persist = persistImpl;
//#endregion
//#region node_modules/@wagmi/core/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
//#endregion
//#region node_modules/@wagmi/core/node_modules/eventemitter3/index.mjs
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
//#region node_modules/@wagmi/core/dist/esm/createEmitter.js
var Emitter = class {
	constructor(uid) {
		Object.defineProperty(this, "uid", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: uid
		});
		Object.defineProperty(this, "_emitter", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: new import_eventemitter3.default()
		});
	}
	on(eventName, fn) {
		this._emitter.on(eventName, fn);
	}
	once(eventName, fn) {
		this._emitter.once(eventName, fn);
	}
	off(eventName, fn) {
		this._emitter.off(eventName, fn);
	}
	emit(eventName, ...params) {
		const data = params[0];
		this._emitter.emit(eventName, {
			uid: this.uid,
			...data
		});
	}
	listenerCount(eventName) {
		return this._emitter.listenerCount(eventName);
	}
};
function createEmitter(uid) {
	return new Emitter(uid);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/deserialize.js
function deserialize(value, reviver) {
	return JSON.parse(value, (key, value_) => {
		let value = value_;
		if (value?.__type === "bigint") value = BigInt(value.value);
		if (value?.__type === "Map") value = new Map(value.value);
		return reviver?.(key, value) ?? value;
	});
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/serialize.js
/**
* Get the reference key for the circular value
*
* @param keys the keys to build the reference key from
* @param cutoff the maximum number of keys to include
* @returns the reference key
*/
function getReferenceKey(keys, cutoff) {
	return keys.slice(0, cutoff).join(".") || ".";
}
/**
* Faster `Array.prototype.indexOf` implementation build for slicing / splicing
*
* @param array the array to match the value in
* @param value the value to match
* @returns the matching index, or -1
*/
function getCutoff(array, value) {
	const { length } = array;
	for (let index = 0; index < length; ++index) if (array[index] === value) return index + 1;
	return 0;
}
/**
* Create a replacer method that handles circular values
*
* @param [replacer] a custom replacer to use for non-circular values
* @param [circularReplacer] a custom replacer to use for circular methods
* @returns the value to stringify
*/
function createReplacer(replacer, circularReplacer) {
	const hasReplacer = typeof replacer === "function";
	const hasCircularReplacer = typeof circularReplacer === "function";
	const cache = [];
	const keys = [];
	return function replace(key, value) {
		if (typeof value === "object") {
			if (cache.length) {
				const thisCutoff = getCutoff(cache, this);
				if (thisCutoff === 0) cache[cache.length] = this;
				else {
					cache.splice(thisCutoff);
					keys.splice(thisCutoff);
				}
				keys[keys.length] = key;
				const valueCutoff = getCutoff(cache, value);
				if (valueCutoff !== 0) return hasCircularReplacer ? circularReplacer.call(this, key, value, getReferenceKey(keys, valueCutoff)) : `[ref=${getReferenceKey(keys, valueCutoff)}]`;
			} else {
				cache[0] = value;
				keys[0] = key;
			}
		}
		return hasReplacer ? replacer.call(this, key, value) : value;
	};
}
/**
* Stringifier that handles circular values
*
* Forked from https://github.com/planttheidea/fast-stringify
*
* @param value to stringify
* @param [replacer] a custom replacer function for handling standard values
* @param [indent] the number of spaces to indent the output by
* @param [circularReplacer] a custom replacer function for handling circular values
* @returns the stringified output
*/
function serialize(value, replacer, indent, circularReplacer) {
	return JSON.stringify(value, createReplacer((key, value_) => {
		let value = value_;
		if (typeof value === "bigint") value = {
			__type: "bigint",
			value: value_.toString()
		};
		if (value instanceof Map) value = {
			__type: "Map",
			value: Array.from(value_.entries())
		};
		return replacer?.(key, value) ?? value;
	}, circularReplacer), indent ?? void 0);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/createStorage.js
function createStorage(parameters) {
	const { deserialize: deserialize$1 = deserialize, key: prefix = "wagmi", serialize: serialize$1 = serialize, storage = noopStorage } = parameters;
	function unwrap(value) {
		if (value instanceof Promise) return value.then((x) => x).catch(() => null);
		return value;
	}
	return {
		...storage,
		key: prefix,
		async getItem(key, defaultValue) {
			const unwrapped = await unwrap(storage.getItem(`${prefix}.${key}`));
			if (unwrapped) return deserialize$1(unwrapped) ?? null;
			return defaultValue ?? null;
		},
		async setItem(key, value) {
			const storageKey = `${prefix}.${key}`;
			if (value === null) await unwrap(storage.removeItem(storageKey));
			else await unwrap(storage.setItem(storageKey, serialize$1(value)));
		},
		async removeItem(key) {
			await unwrap(storage.removeItem(`${prefix}.${key}`));
		}
	};
}
var noopStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
function getDefaultStorage() {
	const storage = (() => {
		if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
		return noopStorage;
	})();
	return {
		getItem(key) {
			return storage.getItem(key);
		},
		removeItem(key) {
			storage.removeItem(key);
		},
		setItem(key, value) {
			try {
				storage.setItem(key, value);
			} catch {}
		}
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/uid.js
var size = 256;
var index = size;
var buffer;
function uid(length = 11) {
	if (!buffer || index + length > size * 2) {
		buffer = "";
		index = 0;
		for (let i = 0; i < size; i++) buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
	}
	return buffer.substring(index, index++ + length);
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/createConfig.js
function createConfig(parameters) {
	const { multiInjectedProviderDiscovery = true, storage = createStorage({ storage: getDefaultStorage() }), syncConnectedChain = true, ssr = false, ...rest } = parameters;
	const mipd = typeof window !== "undefined" && multiInjectedProviderDiscovery ? createStore$1() : void 0;
	const chains = createStore(() => rest.chains);
	const connectors = createStore(() => {
		const collection = [];
		const rdnsSet = /* @__PURE__ */ new Set();
		for (const connectorFns of rest.connectors ?? []) {
			const connector = setup(connectorFns);
			collection.push(connector);
			if (!ssr && connector.rdns) {
				const rdnsValues = typeof connector.rdns === "string" ? [connector.rdns] : connector.rdns;
				for (const rdns of rdnsValues) rdnsSet.add(rdns);
			}
		}
		if (!ssr && mipd) {
			const providers = mipd.getProviders();
			for (const provider of providers) {
				if (rdnsSet.has(provider.info.rdns)) continue;
				collection.push(setup(providerDetailToConnector(provider)));
			}
		}
		return collection;
	});
	function setup(connectorFn) {
		const emitter = createEmitter(uid());
		const connector = {
			...connectorFn({
				emitter,
				chains: chains.getState(),
				storage,
				transports: rest.transports
			}),
			emitter,
			uid: emitter.uid
		};
		emitter.on("connect", connect);
		connector.setup?.();
		return connector;
	}
	function providerDetailToConnector(providerDetail) {
		const { info } = providerDetail;
		const provider = providerDetail.provider;
		return injected({ target: {
			...info,
			id: info.rdns,
			provider
		} });
	}
	const clients = /* @__PURE__ */ new Map();
	function getClient(config = {}) {
		const chainId = config.chainId ?? store.getState().chainId;
		const chain = chains.getState().find((x) => x.id === chainId);
		if (config.chainId && !chain) throw new ChainNotConfiguredError();
		{
			const client = clients.get(store.getState().chainId);
			if (client && !chain) return client;
			if (!chain) throw new ChainNotConfiguredError();
		}
		{
			const client = clients.get(chainId);
			if (client) return client;
		}
		let client;
		if (rest.client) client = rest.client({ chain });
		else {
			const chainId = chain.id;
			const chainIds = chains.getState().map((x) => x.id);
			const properties = {};
			const entries = Object.entries(rest);
			for (const [key, value] of entries) {
				if (key === "chains" || key === "client" || key === "connectors" || key === "transports") continue;
				if (typeof value === "object") {
					if (chainId in value) properties[key] = value[chainId];
					else {
						if (chainIds.some((x) => x in value)) continue;
						properties[key] = value;
					}
				} else properties[key] = value;
			}
			client = createClient({
				...properties,
				chain,
				batch: properties.batch ?? { multicall: true },
				transport: (parameters) => rest.transports[chainId]({
					...parameters,
					connectors
				})
			});
		}
		clients.set(chainId, client);
		return client;
	}
	function getInitialState() {
		return {
			chainId: chains.getState()[0].id,
			connections: /* @__PURE__ */ new Map(),
			current: null,
			status: "disconnected"
		};
	}
	let currentVersion;
	const prefix = "0.0.0-canary-";
	if ("2.16.7".startsWith(prefix)) currentVersion = Number.parseInt(version$3.replace(prefix, ""));
	else currentVersion = Number.parseInt("2.16.7".split(".")[0] ?? "0");
	const store = createStore(subscribeWithSelector(storage ? persist(getInitialState, {
		migrate(persistedState, version) {
			if (version === currentVersion) return persistedState;
			const initialState = getInitialState();
			const chainId = validatePersistedChainId(persistedState, initialState.chainId);
			return {
				...initialState,
				chainId
			};
		},
		name: "store",
		partialize(state) {
			return {
				connections: {
					__type: "Map",
					value: Array.from(state.connections.entries()).map(([key, connection]) => {
						const { id, name, type, uid } = connection.connector;
						const connector = {
							id,
							name,
							type,
							uid
						};
						return [key, {
							...connection,
							connector
						}];
					})
				},
				chainId: state.chainId,
				current: state.current
			};
		},
		merge(persistedState, currentState) {
			if (typeof persistedState === "object" && persistedState && "status" in persistedState) delete persistedState.status;
			const chainId = validatePersistedChainId(persistedState, currentState.chainId);
			return {
				...currentState,
				...persistedState,
				chainId
			};
		},
		skipHydration: ssr,
		storage,
		version: currentVersion
	}) : getInitialState));
	store.setState(getInitialState());
	function validatePersistedChainId(persistedState, defaultChainId) {
		return persistedState && typeof persistedState === "object" && "chainId" in persistedState && typeof persistedState.chainId === "number" && chains.getState().some((x) => x.id === persistedState.chainId) ? persistedState.chainId : defaultChainId;
	}
	if (syncConnectedChain) store.subscribe(({ connections, current }) => current ? connections.get(current)?.chainId : void 0, (chainId) => {
		if (!chains.getState().some((x) => x.id === chainId)) return;
		return store.setState((x) => ({
			...x,
			chainId: chainId ?? x.chainId
		}));
	});
	mipd?.subscribe((providerDetails) => {
		const connectorIdSet = /* @__PURE__ */ new Set();
		const connectorRdnsSet = /* @__PURE__ */ new Set();
		for (const connector of connectors.getState()) {
			connectorIdSet.add(connector.id);
			if (connector.rdns) {
				const rdnsValues = typeof connector.rdns === "string" ? [connector.rdns] : connector.rdns;
				for (const rdns of rdnsValues) connectorRdnsSet.add(rdns);
			}
		}
		const newConnectors = [];
		for (const providerDetail of providerDetails) {
			if (connectorRdnsSet.has(providerDetail.info.rdns)) continue;
			const connector = setup(providerDetailToConnector(providerDetail));
			if (connectorIdSet.has(connector.id)) continue;
			newConnectors.push(connector);
		}
		if (storage && !store.persist.hasHydrated()) return;
		connectors.setState((x) => [...x, ...newConnectors], true);
	});
	function change(data) {
		store.setState((x) => {
			const connection = x.connections.get(data.uid);
			if (!connection) return x;
			return {
				...x,
				connections: new Map(x.connections).set(data.uid, {
					accounts: data.accounts ?? connection.accounts,
					chainId: data.chainId ?? connection.chainId,
					connector: connection.connector
				})
			};
		});
	}
	function connect(data) {
		if (store.getState().status === "connecting" || store.getState().status === "reconnecting") return;
		store.setState((x) => {
			const connector = connectors.getState().find((x) => x.uid === data.uid);
			if (!connector) return x;
			if (connector.emitter.listenerCount("connect")) connector.emitter.off("connect", change);
			if (!connector.emitter.listenerCount("change")) connector.emitter.on("change", change);
			if (!connector.emitter.listenerCount("disconnect")) connector.emitter.on("disconnect", disconnect);
			return {
				...x,
				connections: new Map(x.connections).set(data.uid, {
					accounts: data.accounts,
					chainId: data.chainId,
					connector
				}),
				current: data.uid,
				status: "connected"
			};
		});
	}
	function disconnect(data) {
		store.setState((x) => {
			const connection = x.connections.get(data.uid);
			if (connection) {
				const connector = connection.connector;
				if (connector.emitter.listenerCount("change")) connection.connector.emitter.off("change", change);
				if (connector.emitter.listenerCount("disconnect")) connection.connector.emitter.off("disconnect", disconnect);
				if (!connector.emitter.listenerCount("connect")) connection.connector.emitter.on("connect", connect);
			}
			x.connections.delete(data.uid);
			if (x.connections.size === 0) return {
				...x,
				connections: /* @__PURE__ */ new Map(),
				current: null,
				status: "disconnected"
			};
			const nextConnection = x.connections.values().next().value;
			return {
				...x,
				connections: new Map(x.connections),
				current: nextConnection.connector.uid
			};
		});
	}
	return {
		get chains() {
			return chains.getState();
		},
		get connectors() {
			return connectors.getState();
		},
		storage,
		getClient,
		get state() {
			return store.getState();
		},
		setState(value) {
			let newState;
			if (typeof value === "function") newState = value(store.getState());
			else newState = value;
			const initialState = getInitialState();
			if (typeof newState !== "object") newState = initialState;
			if (Object.keys(initialState).some((x) => !(x in newState))) newState = initialState;
			store.setState(newState, true);
		},
		subscribe(selector, listener, options) {
			return store.subscribe(selector, listener, options ? {
				...options,
				fireImmediately: options.emitImmediately
			} : void 0);
		},
		_internal: {
			mipd,
			store,
			ssr: Boolean(ssr),
			syncConnectedChain,
			transports: rest.transports,
			chains: {
				setState(value) {
					const nextChains = typeof value === "function" ? value(chains.getState()) : value;
					if (nextChains.length === 0) return;
					return chains.setState(nextChains, true);
				},
				subscribe(listener) {
					return chains.subscribe(listener);
				}
			},
			connectors: {
				providerDetailToConnector,
				setup,
				setState(value) {
					return connectors.setState(typeof value === "function" ? value(connectors.getState()) : value, true);
				},
				subscribe(listener) {
					return connectors.subscribe(listener);
				}
			},
			events: {
				change,
				connect,
				disconnect
			}
		}
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/hydrate.js
function hydrate(config, parameters) {
	const { initialState, reconnectOnMount } = parameters;
	if (initialState && !config._internal.store.persist.hasHydrated()) config.setState({
		...initialState,
		chainId: config.chains.some((x) => x.id === initialState.chainId) ? initialState.chainId : config.chains[0].id,
		connections: reconnectOnMount ? initialState.connections : /* @__PURE__ */ new Map(),
		status: reconnectOnMount ? "reconnecting" : "disconnected"
	});
	return { async onMount() {
		if (config._internal.ssr) {
			await config._internal.store.persist.rehydrate();
			if (config._internal.mipd) config._internal.connectors.setState((connectors) => {
				const rdnsSet = /* @__PURE__ */ new Set();
				for (const connector of connectors ?? []) if (connector.rdns) {
					const rdnsValues = Array.isArray(connector.rdns) ? connector.rdns : [connector.rdns];
					for (const rdns of rdnsValues) rdnsSet.add(rdns);
				}
				const mipdConnectors = [];
				const providers = config._internal.mipd?.getProviders() ?? [];
				for (const provider of providers) {
					if (rdnsSet.has(provider.info.rdns)) continue;
					const connectorFn = config._internal.connectors.providerDetailToConnector(provider);
					const connector = config._internal.connectors.setup(connectorFn);
					mipdConnectors.push(connector);
				}
				return [...connectors, ...mipdConnectors];
			});
		}
		if (reconnectOnMount) reconnect(config);
		else if (config.storage) config.setState((x) => ({
			...x,
			connections: /* @__PURE__ */ new Map()
		}));
	} };
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/actions/watchChains.js
/**
* @internal
* We don't expose this because as far as consumers know, you can't chainge (lol) `config.chains` at runtime.
* Setting `config.chains` via `config._internal.chains.setState(...)` is an extremely advanced use case that's not worth documenting or supporting in the public API at this time.
*/
function watchChains(config, parameters) {
	const { onChange } = parameters;
	return config._internal.chains.subscribe((chains, prevChains) => {
		onChange(chains, prevChains);
	});
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/connect.js
function connectMutationOptions(config) {
	return {
		mutationFn(variables) {
			return connect(config, variables);
		},
		mutationKey: ["connect"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/disconnect.js
function disconnectMutationOptions(config) {
	return {
		mutationFn(variables) {
			return disconnect(config, variables);
		},
		mutationKey: ["disconnect"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/switchChain.js
function switchChainMutationOptions(config) {
	return {
		mutationFn(variables) {
			return switchChain(config, variables);
		},
		mutationKey: ["switchChain"]
	};
}
//#endregion
//#region node_modules/@wagmi/core/dist/esm/query/writeContract.js
function writeContractMutationOptions(config) {
	return {
		mutationFn(variables) {
			return writeContract(config, variables);
		},
		mutationKey: ["writeContract"]
	};
}
//#endregion
export { decodeErrorResult as A, createTransport as C, decodeEventLog as D, createBatchScheduler as E, concat$1 as M, isAddressEqual as O, withTimeout as S, call as T, getChains as _, watchChains as a, getAccount as b, injected as c, watchConnections as d, watchChainId as f, getConnections as g, getConnectors as h, connectMutationOptions as i, encodeAbiParameters as j, maxUint256 as k, watchPublicClient as l, getPublicClient as m, switchChainMutationOptions as n, hydrate as o, watchAccount as p, disconnectMutationOptions as r, createConfig as s, writeContractMutationOptions as t, watchConnectors as u, deepEqual as v, createClient as w, publicActions as x, getChainId as y };
