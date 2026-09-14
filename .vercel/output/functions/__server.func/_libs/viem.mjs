import { r as __exportAll } from "../_runtime.mjs";
import { A as decodeErrorResult, C as createTransport, E as createBatchScheduler, M as concat, O as isAddressEqual, S as withTimeout, T as call, j as encodeAbiParameters, w as createClient, x as publicActions } from "./@wagmi/core+[...].mjs";
import { A as HttpRequestError, F as stringify, M as TimeoutError, P as getUrl, ct as isHex, j as RpcRequestError, ot as BaseError } from "./@wagmi/connectors+[...].mjs";
//#region node_modules/viem/_esm/errors/transport.js
var UrlRequiredError = class extends BaseError {
	constructor() {
		super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
			docsPath: "/docs/clients/intro",
			name: "UrlRequiredError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/rpc/id.js
function createIdStore() {
	return {
		current: 0,
		take() {
			return this.current++;
		},
		reset() {
			this.current = 0;
		}
	};
}
var idCache = /*#__PURE__*/ createIdStore();
//#endregion
//#region node_modules/viem/_esm/utils/rpc/http.js
function getHttpRpcClient(url, options = {}) {
	return { async request(params) {
		const { body, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
		const fetchOptions = {
			...options.fetchOptions ?? {},
			...params.fetchOptions ?? {}
		};
		const { headers, method, signal: signal_ } = fetchOptions;
		try {
			const response = await withTimeout(async ({ signal }) => {
				const init = {
					...fetchOptions,
					body: Array.isArray(body) ? stringify(body.map((body) => ({
						jsonrpc: "2.0",
						id: body.id ?? idCache.take(),
						...body
					}))) : stringify({
						jsonrpc: "2.0",
						id: body.id ?? idCache.take(),
						...body
					}),
					headers: {
						"Content-Type": "application/json",
						...headers
					},
					method: method || "POST",
					signal: signal_ || (timeout > 0 ? signal : null)
				};
				const request = new Request(url, init);
				const args = await onRequest?.(request, init) ?? {
					...init,
					url
				};
				return await fetch(args.url ?? url, args);
			}, {
				errorInstance: new TimeoutError({
					body,
					url
				}),
				timeout,
				signal: true
			});
			if (onResponse) await onResponse(response);
			let data;
			if (response.headers.get("Content-Type")?.startsWith("application/json")) data = await response.json();
			else {
				data = await response.text();
				try {
					data = JSON.parse(data || "{}");
				} catch (err) {
					if (response.ok) throw err;
					data = { error: data };
				}
			}
			if (!response.ok) throw new HttpRequestError({
				body,
				details: stringify(data.error) || response.statusText,
				headers: response.headers,
				status: response.status,
				url
			});
			return data;
		} catch (err) {
			if (err instanceof HttpRequestError) throw err;
			if (err instanceof TimeoutError) throw err;
			throw new HttpRequestError({
				body,
				cause: err,
				url
			});
		}
	} };
}
//#endregion
//#region node_modules/viem/_esm/clients/transports/http.js
/**
* @description Creates a HTTP transport that connects to a JSON-RPC API.
*/
function http(url, config = {}) {
	const { batch, fetchOptions, key = "http", methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
	return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
		const { batchSize = 1e3, wait = 0 } = typeof batch === "object" ? batch : {};
		const retryCount = config.retryCount ?? retryCount_;
		const timeout = timeout_ ?? config.timeout ?? 1e4;
		const url_ = url || chain?.rpcUrls.default.http[0];
		if (!url_) throw new UrlRequiredError();
		const rpcClient = getHttpRpcClient(url_, {
			fetchOptions,
			onRequest: onFetchRequest,
			onResponse: onFetchResponse,
			timeout
		});
		return createTransport({
			key,
			methods,
			name,
			async request({ method, params }) {
				const body = {
					method,
					params
				};
				const { schedule } = createBatchScheduler({
					id: url_,
					wait,
					shouldSplitBatch(requests) {
						return requests.length > batchSize;
					},
					fn: (body) => rpcClient.request({ body }),
					sort: (a, b) => a.id - b.id
				});
				const fn = async (body) => batch ? schedule(body) : [await rpcClient.request({ body })];
				const [{ error, result }] = await fn(body);
				if (raw) return {
					error,
					result
				};
				if (error) throw new RpcRequestError({
					body,
					error,
					url: url_
				});
				return result;
			},
			retryCount,
			retryDelay,
			timeout,
			type: "http"
		}, {
			fetchOptions,
			url: url_
		});
	};
}
//#endregion
//#region node_modules/viem/_esm/errors/ccip.js
var OffchainLookupError = class extends BaseError {
	constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
		super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
			cause,
			metaMessages: [
				...cause.metaMessages || [],
				cause.metaMessages?.length ? "" : [],
				"Offchain Gateway Call:",
				urls && ["  Gateway URL(s):", ...urls.map((url) => `    ${getUrl(url)}`)],
				`  Sender: ${sender}`,
				`  Data: ${data}`,
				`  Callback selector: ${callbackSelector}`,
				`  Extra data: ${extraData}`
			].flat(),
			name: "OffchainLookupError"
		});
	}
};
var OffchainLookupResponseMalformedError = class extends BaseError {
	constructor({ result, url }) {
		super("Offchain gateway response is malformed. Response data must be a hex value.", {
			metaMessages: [`Gateway URL: ${getUrl(url)}`, `Response: ${stringify(result)}`],
			name: "OffchainLookupResponseMalformedError"
		});
	}
};
var OffchainLookupSenderMismatchError = class extends BaseError {
	constructor({ sender, to }) {
		super("Reverted sender address does not match target contract address (`to`).", {
			metaMessages: [`Contract address: ${to}`, `OffchainLookup sender address: ${sender}`],
			name: "OffchainLookupSenderMismatchError"
		});
	}
};
//#endregion
//#region node_modules/viem/_esm/utils/ccip.js
var ccip_exports = /* @__PURE__ */ __exportAll({
	ccipRequest: () => ccipRequest,
	offchainLookup: () => offchainLookup,
	offchainLookupAbiItem: () => offchainLookupAbiItem,
	offchainLookupSignature: () => offchainLookupSignature
});
var offchainLookupSignature = "0x556f1830";
var offchainLookupAbiItem = {
	name: "OffchainLookup",
	type: "error",
	inputs: [
		{
			name: "sender",
			type: "address"
		},
		{
			name: "urls",
			type: "string[]"
		},
		{
			name: "callData",
			type: "bytes"
		},
		{
			name: "callbackFunction",
			type: "bytes4"
		},
		{
			name: "extraData",
			type: "bytes"
		}
	]
};
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
	const { args } = decodeErrorResult({
		data,
		abi: [offchainLookupAbiItem]
	});
	const [sender, urls, callData, callbackSelector, extraData] = args;
	const { ccipRead } = client;
	const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
	try {
		if (!isAddressEqual(to, sender)) throw new OffchainLookupSenderMismatchError({
			sender,
			to
		});
		const result = await ccipRequest_({
			data: callData,
			sender,
			urls
		});
		const { data: data_ } = await call(client, {
			blockNumber,
			blockTag,
			data: concat([callbackSelector, encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])]),
			to
		});
		return data_;
	} catch (err) {
		throw new OffchainLookupError({
			callbackSelector,
			cause: err,
			data,
			extraData,
			sender,
			urls
		});
	}
}
async function ccipRequest({ data, sender, urls }) {
	let error = /* @__PURE__ */ new Error("An unknown error occurred.");
	for (let i = 0; i < urls.length; i++) {
		const url = urls[i];
		const method = url.includes("{data}") ? "GET" : "POST";
		const body = method === "POST" ? {
			data,
			sender
		} : void 0;
		const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
		try {
			const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
				body: JSON.stringify(body),
				headers,
				method
			});
			let result;
			if (response.headers.get("Content-Type")?.startsWith("application/json")) result = (await response.json()).data;
			else result = await response.text();
			if (!response.ok) {
				error = new HttpRequestError({
					body,
					details: result?.error ? stringify(result.error) : response.statusText,
					headers: response.headers,
					status: response.status,
					url
				});
				continue;
			}
			if (!isHex(result)) {
				error = new OffchainLookupResponseMalformedError({
					result,
					url
				});
				continue;
			}
			return result;
		} catch (err) {
			error = new HttpRequestError({
				body,
				details: err.message,
				url
			});
		}
	}
	throw error;
}
//#endregion
//#region node_modules/viem/_esm/utils/chain/defineChain.js
function defineChain(chain) {
	return {
		formatters: void 0,
		fees: void 0,
		serializers: void 0,
		...chain
	};
}
//#endregion
//#region node_modules/viem/_esm/clients/createPublicClient.js
/**
* Creates a Public Client with a given [Transport](https://viem.sh/docs/clients/intro) configured for a [Chain](https://viem.sh/docs/clients/chains).
*
* - Docs: https://viem.sh/docs/clients/public
*
* A Public Client is an interface to "public" [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods such as retrieving block numbers, transactions, reading from smart contracts, etc through [Public Actions](/docs/actions/public/introduction).
*
* @param config - {@link PublicClientConfig}
* @returns A Public Client. {@link PublicClient}
*
* @example
* import { createPublicClient, http } from 'viem'
* import { mainnet } from 'viem/chains'
*
* const client = createPublicClient({
*   chain: mainnet,
*   transport: http(),
* })
*/
function createPublicClient(parameters) {
	const { key = "public", name = "Public Client" } = parameters;
	return createClient({
		...parameters,
		key,
		name,
		type: "publicClient"
	}).extend(publicActions);
}
//#endregion
export { http as i, defineChain as n, ccip_exports as r, createPublicClient as t };
