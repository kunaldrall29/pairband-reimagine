import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, t as useMutation } from "./react+tanstack__react-query.mjs";
import { _ as getChains, a as watchChains, b as getAccount, d as watchConnections, f as watchChainId, g as getConnections, h as getConnectors, i as connectMutationOptions, l as watchPublicClient, m as getPublicClient, n as switchChainMutationOptions, o as hydrate, p as watchAccount, r as disconnectMutationOptions, t as writeContractMutationOptions, u as watchConnectors, v as deepEqual, y as getChainId } from "./@wagmi/core+[...].mjs";
import { l as BaseError$1 } from "./@wagmi/connectors+[...].mjs";
import { t as require_with_selector } from "./use-sync-external-store.mjs";
//#region node_modules/wagmi/dist/esm/hydrate.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function Hydrate(parameters) {
	const { children, config, initialState, reconnectOnMount = true } = parameters;
	const { onMount } = hydrate(config, {
		initialState,
		reconnectOnMount
	});
	if (!config._internal.ssr) onMount();
	const active = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (!active.current) return;
		if (!config._internal.ssr) return;
		onMount();
		return () => {
			active.current = false;
		};
	}, []);
	return children;
}
//#endregion
//#region node_modules/wagmi/dist/esm/context.js
var WagmiContext = (0, import_react.createContext)(void 0);
function WagmiProvider(parameters) {
	const { children, config } = parameters;
	const props = { value: config };
	return (0, import_react.createElement)(Hydrate, parameters, (0, import_react.createElement)(WagmiContext.Provider, props, children));
}
//#endregion
//#region node_modules/wagmi/dist/esm/version.js
var version = "2.14.16";
//#endregion
//#region node_modules/wagmi/dist/esm/utils/getVersion.js
var getVersion = () => `wagmi@${version}`;
//#endregion
//#region node_modules/wagmi/dist/esm/errors/base.js
var BaseError = class extends BaseError$1 {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "WagmiError"
		});
	}
	get docsBaseUrl() {
		return "https://wagmi.sh/react";
	}
	get version() {
		return getVersion();
	}
};
//#endregion
//#region node_modules/wagmi/dist/esm/errors/context.js
var WagmiProviderNotFoundError = class extends BaseError {
	constructor() {
		super("`useConfig` must be used within `WagmiProvider`.", { docsPath: "/api/WagmiProvider" });
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "WagmiProviderNotFoundError"
		});
	}
};
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConfig.js
/** https://wagmi.sh/react/api/hooks/useConfig */
function useConfig(parameters = {}) {
	const config = parameters.config ?? (0, import_react.useContext)(WagmiContext);
	if (!config) throw new WagmiProviderNotFoundError();
	return config;
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSyncExternalStoreWithTracked.js
var import_with_selector = require_with_selector();
var isPlainObject = (obj) => typeof obj === "object" && !Array.isArray(obj);
function useSyncExternalStoreWithTracked(subscribe, getSnapshot, getServerSnapshot = getSnapshot, isEqual = deepEqual) {
	const trackedKeys = (0, import_react.useRef)([]);
	const result = (0, import_with_selector.useSyncExternalStoreWithSelector)(subscribe, getSnapshot, getServerSnapshot, (x) => x, (a, b) => {
		if (isPlainObject(a) && isPlainObject(b) && trackedKeys.current.length) {
			for (const key of trackedKeys.current) if (!isEqual(a[key], b[key])) return false;
			return true;
		}
		return isEqual(a, b);
	});
	return (0, import_react.useMemo)(() => {
		if (isPlainObject(result)) {
			const trackedResult = { ...result };
			let properties = {};
			for (const [key, value] of Object.entries(trackedResult)) properties = {
				...properties,
				[key]: {
					configurable: false,
					enumerable: true,
					get: () => {
						if (!trackedKeys.current.includes(key)) trackedKeys.current.push(key);
						return value;
					}
				}
			};
			Object.defineProperties(trackedResult, properties);
			return trackedResult;
		}
		return result;
	}, [result]);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useAccount.js
/** https://wagmi.sh/react/api/hooks/useAccount */
function useAccount(parameters = {}) {
	const config = useConfig(parameters);
	return useSyncExternalStoreWithTracked((onChange) => watchAccount(config, { onChange }), () => getAccount(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useChainId.js
/** https://wagmi.sh/react/api/hooks/useChainId */
function useChainId(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchChainId(config, { onChange }), () => getChainId(config), () => getChainId(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useChains.js
/** https://wagmi.sh/react/api/hooks/useChains */
function useChains(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchChains(config, { onChange }), () => getChains(config), () => getChains(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnectors.js
/** https://wagmi.sh/react/api/hooks/useConnectors */
function useConnectors(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchConnectors(config, { onChange }), () => getConnectors(config), () => getConnectors(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnect.js
/** https://wagmi.sh/react/api/hooks/useConnect */
function useConnect(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = connectMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	(0, import_react.useEffect)(() => {
		return config.subscribe(({ status }) => status, (status, previousStatus) => {
			if (previousStatus === "connected" && status === "disconnected") result.reset();
		});
	}, [config, result.reset]);
	return {
		...result,
		connect: mutate,
		connectAsync: mutateAsync,
		connectors: useConnectors({ config })
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useConnections.js
/** https://wagmi.sh/react/api/hooks/useConnections */
function useConnections(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_react.useSyncExternalStore)((onChange) => watchConnections(config, { onChange }), () => getConnections(config), () => getConnections(config));
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useDisconnect.js
/** https://wagmi.sh/react/api/hooks/useDisconnect */
function useDisconnect(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = disconnectMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		connectors: useConnections({ config }).map((connection) => connection.connector),
		disconnect: mutate,
		disconnectAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/usePublicClient.js
/** https://wagmi.sh/react/api/hooks/usePublicClient */
function usePublicClient(parameters = {}) {
	const config = useConfig(parameters);
	return (0, import_with_selector.useSyncExternalStoreWithSelector)((onChange) => watchPublicClient(config, { onChange }), () => getPublicClient(config, parameters), () => getPublicClient(config, parameters), (x) => x, (a, b) => a?.uid === b?.uid);
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useSwitchChain.js
/** https://wagmi.sh/react/api/hooks/useSwitchChain */
function useSwitchChain(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = switchChainMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		chains: useChains({ config }),
		switchChain: mutate,
		switchChainAsync: mutateAsync
	};
}
//#endregion
//#region node_modules/wagmi/dist/esm/hooks/useWriteContract.js
/** https://wagmi.sh/react/api/hooks/useWriteContract */
function useWriteContract(parameters = {}) {
	const { mutation } = parameters;
	const config = useConfig(parameters);
	const mutationOptions = writeContractMutationOptions(config);
	const { mutate, mutateAsync, ...result } = useMutation({
		...mutation,
		...mutationOptions
	});
	return {
		...result,
		writeContract: mutate,
		writeContractAsync: mutateAsync
	};
}
//#endregion
export { useConnect as a, WagmiProvider as c, useDisconnect as i, useSwitchChain as n, useChainId as o, usePublicClient as r, useAccount as s, useWriteContract as t };
