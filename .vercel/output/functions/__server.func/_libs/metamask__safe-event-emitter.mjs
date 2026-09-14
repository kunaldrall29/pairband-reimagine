import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/@metamask/safe-event-emitter/dist/index.cjs
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var events_1$1 = __require("events");
	function safeApply(handler, context, args) {
		try {
			Reflect.apply(handler, context, args);
		} catch (err) {
			setTimeout(() => {
				throw err;
			});
		}
	}
	function arrayClone(arr) {
		const n = arr.length;
		const copy = new Array(n);
		for (let i = 0; i < n; i += 1) copy[i] = arr[i];
		return copy;
	}
	var SafeEventEmitter = class extends events_1$1.EventEmitter {
		emit(type, ...args) {
			let doError = type === "error";
			const events = this._events;
			if (events !== void 0) doError = doError && events.error === void 0;
			else if (!doError) return false;
			if (doError) {
				let er;
				if (args.length > 0) [er] = args;
				if (er instanceof Error) throw er;
				const err = /* @__PURE__ */ new Error(`Unhandled error.${er ? ` (${er.message})` : ""}`);
				err.context = er;
				throw err;
			}
			const handler = events[type];
			if (handler === void 0) return false;
			if (typeof handler === "function") safeApply(handler, this, args);
			else {
				const len = handler.length;
				const listeners = arrayClone(handler);
				for (let i = 0; i < len; i += 1) safeApply(listeners[i], this, args);
			}
			return true;
		}
	};
	exports.default = SafeEventEmitter;
}));
//#endregion
//#region node_modules/json-rpc-engine/node_modules/@metamask/safe-event-emitter/index.js
var require_safe_event_emitter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var events_1 = __require("events");
	function safeApply(handler, context, args) {
		try {
			Reflect.apply(handler, context, args);
		} catch (err) {
			setTimeout(() => {
				throw err;
			});
		}
	}
	function arrayClone(arr) {
		const n = arr.length;
		const copy = new Array(n);
		for (let i = 0; i < n; i += 1) copy[i] = arr[i];
		return copy;
	}
	var SafeEventEmitter = class extends events_1.EventEmitter {
		emit(type, ...args) {
			let doError = type === "error";
			const events = this._events;
			if (events !== void 0) doError = doError && events.error === void 0;
			else if (!doError) return false;
			if (doError) {
				let er;
				if (args.length > 0) [er] = args;
				if (er instanceof Error) throw er;
				const err = /* @__PURE__ */ new Error(`Unhandled error.${er ? ` (${er.message})` : ""}`);
				err.context = er;
				throw err;
			}
			const handler = events[type];
			if (handler === void 0) return false;
			if (typeof handler === "function") safeApply(handler, this, args);
			else {
				const len = handler.length;
				const listeners = arrayClone(handler);
				for (let i = 0; i < len; i += 1) safeApply(listeners[i], this, args);
			}
			return true;
		}
	};
	exports.default = SafeEventEmitter;
}));
//#endregion
export { require_dist as n, require_safe_event_emitter as t };
