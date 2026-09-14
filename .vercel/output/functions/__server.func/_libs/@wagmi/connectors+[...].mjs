import { o as __toESM } from "../../_runtime.mjs";
import { r as keccak_256 } from "../noble__hashes.mjs";
//#region node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
//#endregion
//#region node_modules/viem/_esm/utils/data/size.js
/**
* @description Retrieves the size of the value (in bytes).
*
* @param value The value (hex or byte array) to retrieve the size of.
* @returns The size of the value (in bytes).
*/
function size(value) {
	if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
//#endregion
//#region node_modules/viem/_esm/errors/version.js
var version$1 = "2.23.15";
//#endregion
//#region node_modules/viem/_esm/errors/base.js
var errorConfig = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version$1}`
};
var BaseError$1 = class BaseError$1 extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError$1) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError$1) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
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
		Object.defineProperty(this, "version", {
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
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version$1;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk(err.cause, fn);
	return fn ? null : err;
}
//#endregion
//#region node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError = class extends BaseError$1 {
	constructor({ offset, position, size }) {
		super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size}).`, { name: "SliceOffsetOutOfBoundsError" });
	}
};
var SizeExceedsPaddingSizeError = class extends BaseError$1 {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
var InvalidBytesLengthError = class extends BaseError$1 {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size} ${type} long.`, { name: "InvalidBytesLengthError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex(hexOrBytes, {
		dir,
		size
	});
	return padBytes(hexOrBytes, {
		dir,
		size
	});
}
function padHex(hex_, { dir, size = 32 } = {}) {
	if (size === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
	if (size === null) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
//#endregion
//#region node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError = class extends BaseError$1 {
	constructor({ max, min, signed, size, value }) {
		super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
	}
};
var InvalidBytesBooleanError = class extends BaseError$1 {
	constructor(bytes) {
		super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, { name: "InvalidBytesBooleanError" });
	}
};
var InvalidHexBooleanError = class extends BaseError$1 {
	constructor(hex) {
		super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
	}
};
var SizeOverflowError = class extends BaseError$1 {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
	let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
	let sliceLength = 0;
	for (let i = 0; i < data.length - 1; i++) if (data[dir === "left" ? i : data.length - i - 1].toString() === "0") sliceLength++;
	else break;
	data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
	if (typeof hexOrBytes === "string") {
		if (data.length === 1 && dir === "right") data = `${data}0`;
		return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
	}
	return data;
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size$1 }) {
	if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
		givenSize: size(hexOrBytes),
		maxSize: size$1
	});
}
/**
* Decodes a hex value into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x1a4', { signed: true })
* // 420n
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420n
*/
function hexToBigInt(hex, opts = {}) {
	const { signed } = opts;
	if (opts.size) assertSize(hex, { size: opts.size });
	const value = BigInt(hex);
	if (!signed) return value;
	const size = (hex.length - 2) / 2;
	if (value <= (1n << BigInt(size) * 8n - 1n) - 1n) return value;
	return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
}
/**
* Decodes a hex value into a boolean.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextobool
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns Boolean value.
*
* @example
* import { hexToBool } from 'viem'
* const data = hexToBool('0x01')
* // true
*
* @example
* import { hexToBool } from 'viem'
* const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
* // true
*/
function hexToBool(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize(hex, { size: opts.size });
		hex = trim(hex);
	}
	if (trim(hex) === "0x00") return false;
	if (trim(hex) === "0x01") return true;
	throw new InvalidHexBooleanError(hex);
}
/**
* Decodes a hex string into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToNumber('0x1a4')
* // 420
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420
*/
function hexToNumber(hex, opts = {}) {
	return Number(hexToBigInt(hex, opts));
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toHex.js
var hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Encodes a string, number, bigint, or ByteArray into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex
* - Example: https://viem.sh/docs/utilities/toHex#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world')
* // '0x48656c6c6f20776f726c6421'
*
* @example
* import { toHex } from 'viem'
* const data = toHex(420)
* // '0x1a4'
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world', { size: 32 })
* // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
*/
function toHex(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex(value, opts);
	if (typeof value === "string") return stringToHex(value, opts);
	if (typeof value === "boolean") return boolToHex(value, opts);
	return bytesToHex(value, opts);
}
/**
* Encodes a boolean into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#booltohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true)
* // '0x1'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(false)
* // '0x0'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true, { size: 32 })
* // '0x0000000000000000000000000000000000000000000000000000000000000001'
*/
function boolToHex(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, { size: opts.size });
	}
	return hex;
}
/**
* Encodes a bytes array into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function bytesToHex(value, opts = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
/**
* Encodes a number or bigint into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420)
* // '0x1a4'
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420, { size: 32 })
* // '0x00000000000000000000000000000000000000000000000000000000000001a4'
*/
function numberToHex(value_, opts = {}) {
	const { signed, size } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size) {
		if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
		else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	} else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
	if (size) return pad(hex, { size });
	return hex;
}
var encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function stringToHex(value_, opts = {}) {
	return bytesToHex(encoder$1.encode(value_), opts);
}
//#endregion
//#region node_modules/viem/_esm/utils/encoding/toBytes.js
var encoder = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes
* - Example: https://viem.sh/docs/utilities/toBytes#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes('Hello world')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function toBytes(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToBytes(value, opts);
	if (typeof value === "boolean") return boolToBytes(value, opts);
	if (isHex(value)) return hexToBytes(value, opts);
	return stringToBytes(value, opts);
}
/**
* Encodes a boolean into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
*
* @param value Boolean value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true)
* // Uint8Array([1])
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true, { size: 32 })
* // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
*/
function boolToBytes(value, opts = {}) {
	const bytes = /* @__PURE__ */ new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, { size: opts.size });
	}
	return bytes;
}
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/**
* Encodes a hex string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
*
* @param hex Hex string to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function hexToBytes(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize(hex, { size: opts.size });
		hex = pad(hex, {
			dir: "right",
			size: opts.size
		});
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
* Encodes a number into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
*
* @param value Number to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function numberToBytes(value, opts) {
	return hexToBytes(numberToHex(value, opts));
}
/**
* Encodes a UTF-8 string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
*
* @param value String to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!')
* // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function stringToBytes(value, opts = {}) {
	const bytes = encoder.encode(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, {
			dir: "right",
			size: opts.size
		});
	}
	return bytes;
}
//#endregion
//#region node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
	const to = to_ || "hex";
	const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
	if (to === "bytes") return bytes;
	return toHex(bytes);
}
//#endregion
//#region node_modules/viem/_esm/errors/address.js
var InvalidAddressError = class extends BaseError$1 {
	constructor({ address }) {
		super(`Address "${address}" is invalid.`, {
			metaMessages: ["- Address must be a hex value of 20 bytes (40 hex characters).", "- Address must match its checksum counterpart."],
			name: "InvalidAddressError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/lru.js
/**
* Map with a LRU (Least recently used) policy.
*
* @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
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
//#endregion
//#region node_modules/viem/_esm/utils/address/getAddress.js
var checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
function checksumAddress(address_, chainId) {
	if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
	const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
	const hash = keccak256(stringToBytes(hexAddress), "bytes");
	const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && address[i]) address[i] = address[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) address[i + 1] = address[i + 1].toUpperCase();
	}
	const result = `0x${address.join("")}`;
	checksumAddressCache.set(`${address_}.${chainId}`, result);
	return result;
}
function getAddress(address, chainId) {
	if (!isAddress(address, { strict: false })) throw new InvalidAddressError({ address });
	return checksumAddress(address, chainId);
}
//#endregion
//#region node_modules/viem/_esm/utils/address/isAddress.js
var addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
var isAddressCache = /*#__PURE__*/ new LruMap(8192);
function isAddress(address, options) {
	const { strict = true } = options ?? {};
	const cacheKey = `${address}.${strict}`;
	if (isAddressCache.has(cacheKey)) return isAddressCache.get(cacheKey);
	const result = (() => {
		if (!addressRegex.test(address)) return false;
		if (address.toLowerCase() === address) return true;
		if (strict) return checksumAddress(address) === address;
		return true;
	})();
	isAddressCache.set(cacheKey, result);
	return result;
}
//#endregion
//#region node_modules/viem/_esm/utils/stringify.js
var stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
	const value = typeof value_ === "bigint" ? value_.toString() : value_;
	return typeof replacer === "function" ? replacer(key, value) : value;
}, space);
//#endregion
//#region node_modules/viem/_esm/errors/utils.js
var getContractAddress = (address) => address;
var getUrl = (url) => url;
//#endregion
//#region node_modules/viem/_esm/errors/request.js
var HttpRequestError = class extends BaseError$1 {
	constructor({ body, cause, details, headers, status, url }) {
		super("HTTP request failed.", {
			cause,
			details,
			metaMessages: [
				status && `Status: ${status}`,
				`URL: ${getUrl(url)}`,
				body && `Request body: ${stringify(body)}`
			].filter(Boolean),
			name: "HttpRequestError"
		});
		Object.defineProperty(this, "body", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "headers", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "status", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "url", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.body = body;
		this.headers = headers;
		this.status = status;
		this.url = url;
	}
};
var RpcRequestError = class extends BaseError$1 {
	constructor({ body, error, url }) {
		super("RPC Request failed.", {
			cause: error,
			details: error.message,
			metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
			name: "RpcRequestError"
		});
		Object.defineProperty(this, "code", {
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
		this.code = error.code;
		this.data = error.data;
	}
};
var TimeoutError = class extends BaseError$1 {
	constructor({ body, url }) {
		super("The request took too long to respond.", {
			details: "The request timed out.",
			metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
			name: "TimeoutError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode = -1;
var RpcError = class extends BaseError$1 {
	constructor(cause, { code, docsPath, metaMessages, name, shortMessage }) {
		super(shortMessage, {
			cause,
			docsPath,
			metaMessages: metaMessages || cause?.metaMessages,
			name: name || "RpcError"
		});
		Object.defineProperty(this, "code", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.name = name || cause.name;
		this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
	}
};
var ProviderRpcError = class extends RpcError {
	constructor(cause, options) {
		super(cause, options);
		Object.defineProperty(this, "data", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.data = options.data;
	}
};
var ParseRpcError = class ParseRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ParseRpcError.code,
			name: "ParseRpcError",
			shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
		});
	}
};
Object.defineProperty(ParseRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32700
});
var InvalidRequestRpcError = class InvalidRequestRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidRequestRpcError.code,
			name: "InvalidRequestRpcError",
			shortMessage: "JSON is not a valid request object."
		});
	}
};
Object.defineProperty(InvalidRequestRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32600
});
var MethodNotFoundRpcError = class MethodNotFoundRpcError extends RpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: MethodNotFoundRpcError.code,
			name: "MethodNotFoundRpcError",
			shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
		});
	}
};
Object.defineProperty(MethodNotFoundRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32601
});
var InvalidParamsRpcError = class InvalidParamsRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidParamsRpcError.code,
			name: "InvalidParamsRpcError",
			shortMessage: ["Invalid parameters were provided to the RPC method.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(InvalidParamsRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32602
});
var InternalRpcError = class InternalRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InternalRpcError.code,
			name: "InternalRpcError",
			shortMessage: "An internal error was received."
		});
	}
};
Object.defineProperty(InternalRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32603
});
var InvalidInputRpcError = class InvalidInputRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidInputRpcError.code,
			name: "InvalidInputRpcError",
			shortMessage: ["Missing or invalid parameters.", "Double check you have provided the correct parameters."].join("\n")
		});
	}
};
Object.defineProperty(InvalidInputRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32e3
});
var ResourceNotFoundRpcError = class ResourceNotFoundRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceNotFoundRpcError.code,
			name: "ResourceNotFoundRpcError",
			shortMessage: "Requested resource not found."
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ResourceNotFoundRpcError"
		});
	}
};
Object.defineProperty(ResourceNotFoundRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32001
});
var ResourceUnavailableRpcError = class ResourceUnavailableRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceUnavailableRpcError.code,
			name: "ResourceUnavailableRpcError",
			shortMessage: "Requested resource not available."
		});
	}
};
Object.defineProperty(ResourceUnavailableRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32002
});
var TransactionRejectedRpcError = class TransactionRejectedRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: TransactionRejectedRpcError.code,
			name: "TransactionRejectedRpcError",
			shortMessage: "Transaction creation failed."
		});
	}
};
Object.defineProperty(TransactionRejectedRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32003
});
var MethodNotSupportedRpcError = class MethodNotSupportedRpcError extends RpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: MethodNotSupportedRpcError.code,
			name: "MethodNotSupportedRpcError",
			shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
		});
	}
};
Object.defineProperty(MethodNotSupportedRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32004
});
var LimitExceededRpcError = class LimitExceededRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: LimitExceededRpcError.code,
			name: "LimitExceededRpcError",
			shortMessage: "Request exceeds defined limit."
		});
	}
};
Object.defineProperty(LimitExceededRpcError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32005
});
var JsonRpcVersionUnsupportedError = class JsonRpcVersionUnsupportedError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: JsonRpcVersionUnsupportedError.code,
			name: "JsonRpcVersionUnsupportedError",
			shortMessage: "Version of JSON-RPC protocol is not supported."
		});
	}
};
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32006
});
var UserRejectedRequestError = class UserRejectedRequestError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UserRejectedRequestError.code,
			name: "UserRejectedRequestError",
			shortMessage: "User rejected the request."
		});
	}
};
Object.defineProperty(UserRejectedRequestError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4001
});
var UnauthorizedProviderError = class UnauthorizedProviderError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnauthorizedProviderError.code,
			name: "UnauthorizedProviderError",
			shortMessage: "The requested method and/or account has not been authorized by the user."
		});
	}
};
Object.defineProperty(UnauthorizedProviderError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4100
});
var UnsupportedProviderMethodError = class UnsupportedProviderMethodError extends ProviderRpcError {
	constructor(cause, { method } = {}) {
		super(cause, {
			code: UnsupportedProviderMethodError.code,
			name: "UnsupportedProviderMethodError",
			shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
		});
	}
};
Object.defineProperty(UnsupportedProviderMethodError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4200
});
var ProviderDisconnectedError = class ProviderDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ProviderDisconnectedError.code,
			name: "ProviderDisconnectedError",
			shortMessage: "The Provider is disconnected from all chains."
		});
	}
};
Object.defineProperty(ProviderDisconnectedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4900
});
var ChainDisconnectedError = class ChainDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ChainDisconnectedError.code,
			name: "ChainDisconnectedError",
			shortMessage: "The Provider is not connected to the requested chain."
		});
	}
};
Object.defineProperty(ChainDisconnectedError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4901
});
var SwitchChainError = class SwitchChainError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: SwitchChainError.code,
			name: "SwitchChainError",
			shortMessage: "An error occurred when attempting to switch chain."
		});
	}
};
Object.defineProperty(SwitchChainError, "code", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4902
});
var UnknownRpcError = class extends RpcError {
	constructor(cause) {
		super(cause, {
			name: "UnknownRpcError",
			shortMessage: "An unknown RPC error occurred."
		});
	}
};
//#endregion
//#region node_modules/@wagmi/core/dist/esm/version.js
var version = "2.16.7";
//#endregion
//#region node_modules/@wagmi/core/dist/esm/utils/getVersion.js
var getVersion = () => `@wagmi/core@${version}`;
//#endregion
//#region node_modules/@wagmi/core/dist/esm/errors/base.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseError_instances;
var _BaseError_walk;
var BaseError = class BaseError extends Error {
	get docsBaseUrl() {
		return "https://wagmi.sh/core";
	}
	get version() {
		return getVersion();
	}
	constructor(shortMessage, options = {}) {
		super();
		_BaseError_instances.add(this);
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
			value: "WagmiCoreError"
		});
		const details = options.cause instanceof BaseError ? options.cause.details : options.cause?.message ? options.cause.message : options.details;
		const docsPath = options.cause instanceof BaseError ? options.cause.docsPath || options.docsPath : options.docsPath;
		this.message = [
			shortMessage || "An error occurred.",
			"",
			...options.metaMessages ? [...options.metaMessages, ""] : [],
			...docsPath ? [`Docs: ${this.docsBaseUrl}${docsPath}.html${options.docsSlug ? `#${options.docsSlug}` : ""}`] : [],
			...details ? [`Details: ${details}`] : [],
			`Version: ${this.version}`
		].join("\n");
		if (options.cause) this.cause = options.cause;
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = options.metaMessages;
		this.shortMessage = shortMessage;
	}
	walk(fn) {
		return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, this, fn);
	}
};
_BaseError_instances = /* @__PURE__ */ new WeakSet(), _BaseError_walk = function _BaseError_walk(err, fn) {
	if (fn?.(err)) return err;
	if (err.cause) return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, err.cause, fn);
	return err;
};
//#endregion
//#region node_modules/@wagmi/core/dist/esm/errors/config.js
var ChainNotConfiguredError = class extends BaseError {
	constructor() {
		super("Chain not configured.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ChainNotConfiguredError"
		});
	}
};
var ConnectorAlreadyConnectedError = class extends BaseError {
	constructor() {
		super("Connector already connected.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ConnectorAlreadyConnectedError"
		});
	}
};
var ConnectorNotConnectedError = class extends BaseError {
	constructor() {
		super("Connector not connected.");
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ConnectorNotConnectedError"
		});
	}
};
var ConnectorAccountNotFoundError = class extends BaseError {
	constructor({ address, connector }) {
		super(`Account "${address}" not found for connector "${connector.name}".`);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ConnectorAccountNotFoundError"
		});
	}
};
var ConnectorChainMismatchError = class extends BaseError {
	constructor({ connectionChainId, connectorChainId }) {
		super(`The current chain of the connector (id: ${connectorChainId}) does not match the connection's chain (id: ${connectionChainId}).`, { metaMessages: [`Current Chain ID:  ${connectorChainId}`, `Expected Chain ID: ${connectionChainId}`] });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ConnectorChainMismatchError"
		});
	}
};
var ConnectorUnavailableReconnectingError = class extends BaseError {
	constructor({ connector }) {
		super(`Connector "${connector.name}" unavailable while reconnecting.`, { details: [
			"During the reconnection step, the only connector methods guaranteed to be available are: `id`, `name`, `type`, `uid`.",
			"All other methods are not guaranteed to be available until reconnection completes and connectors are fully restored.",
			"This error commonly occurs for connectors that asynchronously inject after reconnection has already started."
		].join(" ") });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "ConnectorUnavailableReconnectingError"
		});
	}
};
//#endregion
//#region node_modules/@wagmi/core/dist/esm/connectors/createConnector.js
function createConnector(createConnectorFn) {
	return createConnectorFn;
}
//#endregion
//#region node_modules/@wagmi/connectors/dist/esm/coinbaseWallet.js
coinbaseWallet.type = "coinbaseWallet";
function coinbaseWallet(parameters = {}) {
	if (parameters.version === "3" || parameters.headlessMode) return version3(parameters);
	return version4(parameters);
}
function version4(parameters) {
	let walletProvider;
	let accountsChanged;
	let chainChanged;
	let disconnect;
	return createConnector((config) => ({
		id: "coinbaseWalletSDK",
		name: "Coinbase Wallet",
		rdns: "com.coinbase.wallet",
		type: coinbaseWallet.type,
		async connect({ chainId, ...rest } = {}) {
			try {
				const provider = await this.getProvider();
				const accounts = (await provider.request({
					method: "eth_requestAccounts",
					params: "instantOnboarding" in rest && rest.instantOnboarding ? [{ onboarding: "instant" }] : []
				})).map((x) => getAddress(x));
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
				return {
					accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			provider.disconnect();
			provider.close?.();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) {
				const preference = (() => {
					if (typeof parameters.preference === "string") return { options: parameters.preference };
					return {
						...parameters.preference,
						options: parameters.preference?.options ?? "all"
					};
				})();
				const { createCoinbaseWalletSDK } = await import("../@coinbase/wallet-sdk+[...].mjs").then((n) => n.t);
				walletProvider = createCoinbaseWalletSDK({
					...parameters,
					appChainIds: config.chains.map((x) => x.id),
					preference
				}).getProvider();
			}
			return walletProvider;
		},
		async isAuthorized() {
			try {
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chain.id) }]
				});
				return chain;
			} catch (error) {
				if (error.code === 4902) try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
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
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect(_error) {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
		}
	}));
}
function version3(parameters) {
	const reloadOnDisconnect = false;
	let sdk;
	let walletProvider;
	let accountsChanged;
	let chainChanged;
	let disconnect;
	return createConnector((config) => ({
		id: "coinbaseWalletSDK",
		name: "Coinbase Wallet",
		type: coinbaseWallet.type,
		async connect({ chainId } = {}) {
			try {
				const provider = await this.getProvider();
				const accounts = (await provider.request({ method: "eth_requestAccounts" })).map((x) => getAddress(x));
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
				return {
					accounts,
					chainId: currentChainId
				};
			} catch (error) {
				if (/(user closed modal|accounts received is empty|user denied account)/i.test(error.message)) throw new UserRejectedRequestError(error);
				throw error;
			}
		},
		async disconnect() {
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
			provider.disconnect();
			provider.close();
		},
		async getAccounts() {
			return (await (await this.getProvider()).request({ method: "eth_accounts" })).map((x) => getAddress(x));
		},
		async getChainId() {
			const chainId = await (await this.getProvider()).request({ method: "eth_chainId" });
			return Number(chainId);
		},
		async getProvider() {
			if (!walletProvider) {
				sdk = new (await ((async () => {
					const { default: SDK } = await import("../cbw-sdk+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
					if (typeof SDK !== "function" && typeof SDK.default === "function") return SDK.default;
					return SDK;
				})()))({
					...parameters,
					reloadOnDisconnect
				});
				const walletExtensionChainId = sdk.walletExtension?.getChainId();
				const chain = config.chains.find((chain) => parameters.chainId ? chain.id === parameters.chainId : chain.id === walletExtensionChainId) || config.chains[0];
				const chainId = parameters.chainId || chain?.id;
				const jsonRpcUrl = parameters.jsonRpcUrl || chain?.rpcUrls.default.http[0];
				walletProvider = sdk.makeWeb3Provider(jsonRpcUrl, chainId);
			}
			return walletProvider;
		},
		async isAuthorized() {
			try {
				return !!(await this.getAccounts()).length;
			} catch {
				return false;
			}
		},
		async switchChain({ addEthereumChainParameter, chainId }) {
			const chain = config.chains.find((chain) => chain.id === chainId);
			if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());
			const provider = await this.getProvider();
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: numberToHex(chain.id) }]
				});
				return chain;
			} catch (error) {
				if (error.code === 4902) try {
					let blockExplorerUrls;
					if (addEthereumChainParameter?.blockExplorerUrls) blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else blockExplorerUrls = chain.blockExplorers?.default.url ? [chain.blockExplorers?.default.url] : [];
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
					await provider.request({
						method: "wallet_addEthereumChain",
						params: [addEthereumChain]
					});
					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error);
				}
				throw new SwitchChainError(error);
			}
		},
		onAccountsChanged(accounts) {
			if (accounts.length === 0) this.onDisconnect();
			else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
		},
		onChainChanged(chain) {
			const chainId = Number(chain);
			config.emitter.emit("change", { chainId });
		},
		async onDisconnect(_error) {
			config.emitter.emit("disconnect");
			const provider = await this.getProvider();
			if (accountsChanged) {
				provider.removeListener("accountsChanged", accountsChanged);
				accountsChanged = void 0;
			}
			if (chainChanged) {
				provider.removeListener("chainChanged", chainChanged);
				chainChanged = void 0;
			}
			if (disconnect) {
				provider.removeListener("disconnect", disconnect);
				disconnect = void 0;
			}
		}
	}));
}
//#endregion
export { hexToNumber as $, HttpRequestError as A, InvalidAddressError as B, ResourceUnavailableRpcError as C, UnknownRpcError as D, UnauthorizedProviderError as E, stringify as F, boolToHex as G, hexToBytes as H, isAddress as I, stringToHex as J, bytesToHex as K, checksumAddress as L, TimeoutError as M, getContractAddress as N, UnsupportedProviderMethodError as O, getUrl as P, hexToBool as Q, getAddress as R, ResourceNotFoundRpcError as S, TransactionRejectedRpcError as T, stringToBytes as U, keccak256 as V, toBytes as W, assertSize as X, toHex as Y, hexToBigInt as Z, LimitExceededRpcError as _, ConnectorAlreadyConnectedError as a, SliceOffsetOutOfBoundsError as at, ParseRpcError as b, ConnectorUnavailableReconnectingError as c, isHex as ct, ChainDisconnectedError as d, trim as et, InternalRpcError as f, JsonRpcVersionUnsupportedError as g, InvalidRequestRpcError as h, ConnectorAccountNotFoundError as i, InvalidBytesLengthError as it, RpcRequestError as j, UserRejectedRequestError as k, BaseError as l, InvalidParamsRpcError as m, createConnector as n, InvalidBytesBooleanError as nt, ConnectorChainMismatchError as o, BaseError$1 as ot, InvalidInputRpcError as p, numberToHex as q, ChainNotConfiguredError as r, padHex as rt, ConnectorNotConnectedError as s, size as st, coinbaseWallet as t, IntegerOutOfRangeError as tt, version as u, MethodNotFoundRpcError as v, SwitchChainError as w, ProviderDisconnectedError as x, MethodNotSupportedRpcError as y, LruMap as z };
