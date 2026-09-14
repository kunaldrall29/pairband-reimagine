import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
				if (template[templateIndex] === "*") {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++;
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("os");
	var tty$1 = __require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var forceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) forceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) forceColor = 1;
	if ("FORCE_COLOR" in env) {
		if (env.FORCE_COLOR === "true") forceColor = 1;
		else if (env.FORCE_COLOR === "false") forceColor = 0;
		else forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) return 0;
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream) {
		return translateLevel(supportsColor(stream, stream && stream.isTTY));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty$1.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty$1.isatty(2)))
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = __require("tty");
	var util = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region node_modules/superstruct/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	Struct: () => Struct,
	StructError: () => StructError,
	any: () => any,
	array: () => array,
	assert: () => assert,
	assign: () => assign,
	bigint: () => bigint,
	boolean: () => boolean,
	coerce: () => coerce,
	create: () => create,
	date: () => date,
	defaulted: () => defaulted,
	define: () => define,
	deprecated: () => deprecated,
	dynamic: () => dynamic,
	empty: () => empty,
	enums: () => enums,
	func: () => func,
	instance: () => instance,
	integer: () => integer,
	intersection: () => intersection,
	is: () => is,
	lazy: () => lazy,
	literal: () => literal,
	map: () => map,
	mask: () => mask,
	max: () => max,
	min: () => min,
	never: () => never,
	nonempty: () => nonempty,
	nullable: () => nullable,
	number: () => number,
	object: () => object,
	omit: () => omit,
	optional: () => optional,
	partial: () => partial,
	pattern: () => pattern,
	pick: () => pick,
	record: () => record,
	refine: () => refine,
	regexp: () => regexp,
	set: () => set,
	size: () => size,
	string: () => string,
	struct: () => struct,
	trimmed: () => trimmed,
	tuple: () => tuple,
	type: () => type,
	union: () => union,
	unknown: () => unknown,
	validate: () => validate
});
/**
* Check if a value is an iterator.
*/
function isIterable(x) {
	return isObject(x) && typeof x[Symbol.iterator] === "function";
}
/**
* Check if a value is a plain object.
*/
function isObject(x) {
	return typeof x === "object" && x != null;
}
/**
* Check if a value is a plain object.
*/
function isPlainObject(x) {
	if (Object.prototype.toString.call(x) !== "[object Object]") return false;
	const prototype = Object.getPrototypeOf(x);
	return prototype === null || prototype === Object.prototype;
}
/**
* Return a value as a printable string.
*/
function print(value) {
	if (typeof value === "symbol") return value.toString();
	return typeof value === "string" ? JSON.stringify(value) : `${value}`;
}
/**
* Shifts (removes and returns) the first value from the `input` iterator.
* Like `Array.prototype.shift()` but for an `Iterator`.
*/
function shiftIterator(input) {
	const { done, value } = input.next();
	return done ? void 0 : value;
}
/**
* Convert a single validation result to a failure.
*/
function toFailure(result, context, struct, value) {
	if (result === true) return;
	else if (result === false) result = {};
	else if (typeof result === "string") result = { message: result };
	const { path, branch } = context;
	const { type } = struct;
	const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ""}, but received: \`${print(value)}\`` } = result;
	return {
		value,
		type,
		refinement,
		key: path[path.length - 1],
		path,
		branch,
		...result,
		message
	};
}
/**
* Convert a validation result to an iterable of failures.
*/
function* toFailures(result, context, struct, value) {
	if (!isIterable(result)) result = [result];
	for (const r of result) {
		const failure = toFailure(r, context, struct, value);
		if (failure) yield failure;
	}
}
/**
* Check a value against a struct, traversing deeply into nested values, and
* returning an iterator of failures or success.
*/
function* run(value, struct, options = {}) {
	const { path = [], branch = [value], coerce = false, mask = false } = options;
	const ctx = {
		path,
		branch
	};
	if (coerce) {
		value = struct.coercer(value, ctx);
		if (mask && struct.type !== "type" && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
			for (const key in value) if (struct.schema[key] === void 0) delete value[key];
		}
	}
	let status = "valid";
	for (const failure of struct.validator(value, ctx)) {
		failure.explanation = options.message;
		status = "not_valid";
		yield [failure, void 0];
	}
	for (let [k, v, s] of struct.entries(value, ctx)) {
		const ts = run(v, s, {
			path: k === void 0 ? path : [...path, k],
			branch: k === void 0 ? branch : [...branch, v],
			coerce,
			mask,
			message: options.message
		});
		for (const t of ts) if (t[0]) {
			status = t[0].refinement != null ? "not_refined" : "not_valid";
			yield [t[0], void 0];
		} else if (coerce) {
			v = t[1];
			if (k === void 0) value = v;
			else if (value instanceof Map) value.set(k, v);
			else if (value instanceof Set) value.add(v);
			else if (isObject(value)) {
				if (v !== void 0 || k in value) value[k] = v;
			}
		}
	}
	if (status !== "not_valid") for (const failure of struct.refiner(value, ctx)) {
		failure.explanation = options.message;
		status = "not_refined";
		yield [failure, void 0];
	}
	if (status === "valid") yield [void 0, value];
}
/**
* Assert that a value passes a struct, throwing if it doesn't.
*/
function assert(value, struct, message) {
	const result = validate(value, struct, { message });
	if (result[0]) throw result[0];
}
/**
* Create a value with the coercion logic of struct and validate it.
*/
function create(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Mask a value, returning only the subset of properties defined by a struct.
*/
function mask(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		mask: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Check if a value passes a struct.
*/
function is(value, struct) {
	return !validate(value, struct)[0];
}
/**
* Validate a value against a struct, returning an error if invalid, or the
* value (with potential coercion) if valid.
*/
function validate(value, struct, options = {}) {
	const tuples = run(value, struct, options);
	const tuple = shiftIterator(tuples);
	if (tuple[0]) return [new StructError(tuple[0], function* () {
		for (const t of tuples) if (t[0]) yield t[0];
	}), void 0];
	else return [void 0, tuple[1]];
}
function assign(...Structs) {
	const isType = Structs[0].type === "type";
	const schemas = Structs.map((s) => s.schema);
	const schema = Object.assign({}, ...schemas);
	return isType ? type(schema) : object(schema);
}
/**
* Define a new struct type with a custom validation function.
*/
function define(name, validator) {
	return new Struct({
		type: name,
		schema: null,
		validator
	});
}
/**
* Create a new struct based on an existing struct, but the value is allowed to
* be `undefined`. `log` will be called if the value is not `undefined`.
*/
function deprecated(struct, log) {
	return new Struct({
		...struct,
		refiner: (value, ctx) => value === void 0 || struct.refiner(value, ctx),
		validator(value, ctx) {
			if (value === void 0) return true;
			else {
				log(value, ctx);
				return struct.validator(value, ctx);
			}
		}
	});
}
/**
* Create a struct with dynamic validation logic.
*
* The callback will receive the value currently being validated, and must
* return a struct object to validate it with. This can be useful to model
* validation logic that changes based on its input.
*/
function dynamic(fn) {
	return new Struct({
		type: "dynamic",
		schema: null,
		*entries(value, ctx) {
			yield* fn(value, ctx).entries(value, ctx);
		},
		validator(value, ctx) {
			return fn(value, ctx).validator(value, ctx);
		},
		coercer(value, ctx) {
			return fn(value, ctx).coercer(value, ctx);
		},
		refiner(value, ctx) {
			return fn(value, ctx).refiner(value, ctx);
		}
	});
}
/**
* Create a struct with lazily evaluated validation logic.
*
* The first time validation is run with the struct, the callback will be called
* and must return a struct object to use. This is useful for cases where you
* want to have self-referential structs for nested data structures to avoid a
* circular definition problem.
*/
function lazy(fn) {
	let struct;
	return new Struct({
		type: "lazy",
		schema: null,
		*entries(value, ctx) {
			struct ?? (struct = fn());
			yield* struct.entries(value, ctx);
		},
		validator(value, ctx) {
			struct ?? (struct = fn());
			return struct.validator(value, ctx);
		},
		coercer(value, ctx) {
			struct ?? (struct = fn());
			return struct.coercer(value, ctx);
		},
		refiner(value, ctx) {
			struct ?? (struct = fn());
			return struct.refiner(value, ctx);
		}
	});
}
/**
* Create a new struct based on an existing object struct, but excluding
* specific properties.
*
* Like TypeScript's `Omit` utility.
*/
function omit(struct, keys) {
	const { schema } = struct;
	const subschema = { ...schema };
	for (const key of keys) delete subschema[key];
	switch (struct.type) {
		case "type": return type(subschema);
		default: return object(subschema);
	}
}
/**
* Create a new struct based on an existing object struct, but with all of its
* properties allowed to be `undefined`.
*
* Like TypeScript's `Partial` utility.
*/
function partial(struct) {
	const isStruct = struct instanceof Struct;
	const schema = isStruct ? { ...struct.schema } : { ...struct };
	for (const key in schema) schema[key] = optional(schema[key]);
	if (isStruct && struct.type === "type") return type(schema);
	return object(schema);
}
/**
* Create a new struct based on an existing object struct, but only including
* specific properties.
*
* Like TypeScript's `Pick` utility.
*/
function pick(struct, keys) {
	const { schema } = struct;
	const subschema = {};
	for (const key of keys) subschema[key] = schema[key];
	switch (struct.type) {
		case "type": return type(subschema);
		default: return object(subschema);
	}
}
/**
* Define a new struct type with a custom validation function.
*
* @deprecated This function has been renamed to `define`.
*/
function struct(name, validator) {
	console.warn("superstruct@0.11 - The `struct` helper has been renamed to `define`.");
	return define(name, validator);
}
/**
* Ensure that any value passes validation.
*/
function any() {
	return define("any", () => true);
}
function array(Element) {
	return new Struct({
		type: "array",
		schema: Element,
		*entries(value) {
			if (Element && Array.isArray(value)) for (const [i, v] of value.entries()) yield [
				i,
				v,
				Element
			];
		},
		coercer(value) {
			return Array.isArray(value) ? value.slice() : value;
		},
		validator(value) {
			return Array.isArray(value) || `Expected an array value, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a bigint.
*/
function bigint() {
	return define("bigint", (value) => {
		return typeof value === "bigint";
	});
}
/**
* Ensure that a value is a boolean.
*/
function boolean() {
	return define("boolean", (value) => {
		return typeof value === "boolean";
	});
}
/**
* Ensure that a value is a valid `Date`.
*
* Note: this also ensures that the value is *not* an invalid `Date` object,
* which can occur when parsing a date fails but still returns a `Date`.
*/
function date() {
	return define("date", (value) => {
		return value instanceof Date && !isNaN(value.getTime()) || `Expected a valid \`Date\` object, but received: ${print(value)}`;
	});
}
function enums(values) {
	const schema = {};
	const description = values.map((v) => print(v)).join();
	for (const key of values) schema[key] = key;
	return new Struct({
		type: "enums",
		schema,
		validator(value) {
			return values.includes(value) || `Expected one of \`${description}\`, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a function.
*/
function func() {
	return define("func", (value) => {
		return typeof value === "function" || `Expected a function, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an instance of a specific class.
*/
function instance(Class) {
	return define("instance", (value) => {
		return value instanceof Class || `Expected a \`${Class.name}\` instance, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an integer.
*/
function integer() {
	return define("integer", (value) => {
		return typeof value === "number" && !isNaN(value) && Number.isInteger(value) || `Expected an integer, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value matches all of a set of types.
*/
function intersection(Structs) {
	return new Struct({
		type: "intersection",
		schema: null,
		*entries(value, ctx) {
			for (const S of Structs) yield* S.entries(value, ctx);
		},
		*validator(value, ctx) {
			for (const S of Structs) yield* S.validator(value, ctx);
		},
		*refiner(value, ctx) {
			for (const S of Structs) yield* S.refiner(value, ctx);
		}
	});
}
function literal(constant) {
	const description = print(constant);
	const t = typeof constant;
	return new Struct({
		type: "literal",
		schema: t === "string" || t === "number" || t === "boolean" ? constant : null,
		validator(value) {
			return value === constant || `Expected the literal \`${description}\`, but received: ${print(value)}`;
		}
	});
}
function map(Key, Value) {
	return new Struct({
		type: "map",
		schema: null,
		*entries(value) {
			if (Key && Value && value instanceof Map) for (const [k, v] of value.entries()) {
				yield [
					k,
					k,
					Key
				];
				yield [
					k,
					v,
					Value
				];
			}
		},
		coercer(value) {
			return value instanceof Map ? new Map(value) : value;
		},
		validator(value) {
			return value instanceof Map || `Expected a \`Map\` object, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that no value ever passes validation.
*/
function never() {
	return define("never", () => false);
}
/**
* Augment an existing struct to allow `null` values.
*/
function nullable(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === null || struct.validator(value, ctx),
		refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is a number.
*/
function number() {
	return define("number", (value) => {
		return typeof value === "number" && !isNaN(value) || `Expected a number, but received: ${print(value)}`;
	});
}
function object(schema) {
	const knowns = schema ? Object.keys(schema) : [];
	const Never = never();
	return new Struct({
		type: "object",
		schema: schema ? schema : null,
		*entries(value) {
			if (schema && isObject(value)) {
				const unknowns = new Set(Object.keys(value));
				for (const key of knowns) {
					unknowns.delete(key);
					yield [
						key,
						value[key],
						schema[key]
					];
				}
				for (const key of unknowns) yield [
					key,
					value[key],
					Never
				];
			}
		},
		validator(value) {
			return isObject(value) || `Expected an object, but received: ${print(value)}`;
		},
		coercer(value) {
			return isObject(value) ? { ...value } : value;
		}
	});
}
/**
* Augment a struct to allow `undefined` values.
*/
function optional(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === void 0 || struct.validator(value, ctx),
		refiner: (value, ctx) => value === void 0 || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is an object with keys and values of specific types, but
* without ensuring any specific shape of properties.
*
* Like TypeScript's `Record` utility.
*/
function record(Key, Value) {
	return new Struct({
		type: "record",
		schema: null,
		*entries(value) {
			if (isObject(value)) for (const k in value) {
				const v = value[k];
				yield [
					k,
					k,
					Key
				];
				yield [
					k,
					v,
					Value
				];
			}
		},
		validator(value) {
			return isObject(value) || `Expected an object, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a `RegExp`.
*
* Note: this does not test the value against the regular expression! For that
* you need to use the `pattern()` refinement.
*/
function regexp() {
	return define("regexp", (value) => {
		return value instanceof RegExp;
	});
}
function set(Element) {
	return new Struct({
		type: "set",
		schema: null,
		*entries(value) {
			if (Element && value instanceof Set) for (const v of value) yield [
				v,
				v,
				Element
			];
		},
		coercer(value) {
			return value instanceof Set ? new Set(value) : value;
		},
		validator(value) {
			return value instanceof Set || `Expected a \`Set\` object, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a string.
*/
function string() {
	return define("string", (value) => {
		return typeof value === "string" || `Expected a string, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is a tuple of a specific length, and that each of its
* elements is of a specific type.
*/
function tuple(Structs) {
	const Never = never();
	return new Struct({
		type: "tuple",
		schema: null,
		*entries(value) {
			if (Array.isArray(value)) {
				const length = Math.max(Structs.length, value.length);
				for (let i = 0; i < length; i++) yield [
					i,
					value[i],
					Structs[i] || Never
				];
			}
		},
		validator(value) {
			return Array.isArray(value) || `Expected an array, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value has a set of known properties of specific types.
*
* Note: Unrecognized properties are allowed and untouched. This is similar to
* how TypeScript's structural typing works.
*/
function type(schema) {
	const keys = Object.keys(schema);
	return new Struct({
		type: "type",
		schema,
		*entries(value) {
			if (isObject(value)) for (const k of keys) yield [
				k,
				value[k],
				schema[k]
			];
		},
		validator(value) {
			return isObject(value) || `Expected an object, but received: ${print(value)}`;
		},
		coercer(value) {
			return isObject(value) ? { ...value } : value;
		}
	});
}
/**
* Ensure that a value matches one of a set of types.
*/
function union(Structs) {
	const description = Structs.map((s) => s.type).join(" | ");
	return new Struct({
		type: "union",
		schema: null,
		coercer(value) {
			for (const S of Structs) {
				const [error, coerced] = S.validate(value, { coerce: true });
				if (!error) return coerced;
			}
			return value;
		},
		validator(value, ctx) {
			const failures = [];
			for (const S of Structs) {
				const [ ...tuples] = run(value, S, ctx);
				const [first] = tuples;
				if (!first[0]) return [];
				else for (const [failure] of tuples) if (failure) failures.push(failure);
			}
			return [`Expected the value to satisfy a union of \`${description}\`, but received: ${print(value)}`, ...failures];
		}
	});
}
/**
* Ensure that any value passes validation, without widening its type to `any`.
*/
function unknown() {
	return define("unknown", () => true);
}
/**
* Augment a `Struct` to add an additional coercion step to its input.
*
* This allows you to transform input data before validating it, to increase the
* likelihood that it passes validation—for example for default values, parsing
* different formats, etc.
*
* Note: You must use `create(value, Struct)` on the value to have the coercion
* take effect! Using simply `assert()` or `is()` will not use coercion.
*/
function coerce(struct, condition, coercer) {
	return new Struct({
		...struct,
		coercer: (value, ctx) => {
			return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
		}
	});
}
/**
* Augment a struct to replace `undefined` values with a default.
*
* Note: You must use `create(value, Struct)` on the value to have the coercion
* take effect! Using simply `assert()` or `is()` will not use coercion.
*/
function defaulted(struct, fallback, options = {}) {
	return coerce(struct, unknown(), (x) => {
		const f = typeof fallback === "function" ? fallback() : fallback;
		if (x === void 0) return f;
		if (!options.strict && isPlainObject(x) && isPlainObject(f)) {
			const ret = { ...x };
			let changed = false;
			for (const key in f) if (ret[key] === void 0) {
				ret[key] = f[key];
				changed = true;
			}
			if (changed) return ret;
		}
		return x;
	});
}
/**
* Augment a struct to trim string inputs.
*
* Note: You must use `create(value, Struct)` on the value to have the coercion
* take effect! Using simply `assert()` or `is()` will not use coercion.
*/
function trimmed(struct) {
	return coerce(struct, string(), (x) => x.trim());
}
/**
* Ensure that a string, array, map, or set is empty.
*/
function empty(struct) {
	return refine(struct, "empty", (value) => {
		const size = getSize(value);
		return size === 0 || `Expected an empty ${struct.type} but received one with a size of \`${size}\``;
	});
}
function getSize(value) {
	if (value instanceof Map || value instanceof Set) return value.size;
	else return value.length;
}
/**
* Ensure that a number or date is below a threshold.
*/
function max(struct, threshold, options = {}) {
	const { exclusive } = options;
	return refine(struct, "max", (value) => {
		return exclusive ? value < threshold : value <= threshold || `Expected a ${struct.type} less than ${exclusive ? "" : "or equal to "}${threshold} but received \`${value}\``;
	});
}
/**
* Ensure that a number or date is above a threshold.
*/
function min(struct, threshold, options = {}) {
	const { exclusive } = options;
	return refine(struct, "min", (value) => {
		return exclusive ? value > threshold : value >= threshold || `Expected a ${struct.type} greater than ${exclusive ? "" : "or equal to "}${threshold} but received \`${value}\``;
	});
}
/**
* Ensure that a string, array, map or set is not empty.
*/
function nonempty(struct) {
	return refine(struct, "nonempty", (value) => {
		return getSize(value) > 0 || `Expected a nonempty ${struct.type} but received an empty one`;
	});
}
/**
* Ensure that a string matches a regular expression.
*/
function pattern(struct, regexp) {
	return refine(struct, "pattern", (value) => {
		return regexp.test(value) || `Expected a ${struct.type} matching \`/${regexp.source}/\` but received "${value}"`;
	});
}
/**
* Ensure that a string, array, number, date, map, or set has a size (or length, or time) between `min` and `max`.
*/
function size(struct, min, max = min) {
	const expected = `Expected a ${struct.type}`;
	const of = min === max ? `of \`${min}\`` : `between \`${min}\` and \`${max}\``;
	return refine(struct, "size", (value) => {
		if (typeof value === "number" || value instanceof Date) return min <= value && value <= max || `${expected} ${of} but received \`${value}\``;
		else if (value instanceof Map || value instanceof Set) {
			const { size } = value;
			return min <= size && size <= max || `${expected} with a size ${of} but received one with a size of \`${size}\``;
		} else {
			const { length } = value;
			return min <= length && length <= max || `${expected} with a length ${of} but received one with a length of \`${length}\``;
		}
	});
}
/**
* Augment a `Struct` to add an additional refinement to the validation.
*
* The refiner function is guaranteed to receive a value of the struct's type,
* because the struct's existing validation will already have passed. This
* allows you to layer additional validation on top of existing structs.
*/
function refine(struct, name, refiner) {
	return new Struct({
		...struct,
		*refiner(value, ctx) {
			yield* struct.refiner(value, ctx);
			const failures = toFailures(refiner(value, ctx), ctx, struct, value);
			for (const failure of failures) yield {
				...failure,
				refinement: name
			};
		}
	});
}
var StructError, Struct;
var init_dist = __esmMin((() => {
	StructError = class extends TypeError {
		constructor(failure, failures) {
			let cached;
			const { message, explanation, ...rest } = failure;
			const { path } = failure;
			const msg = path.length === 0 ? message : `At path: ${path.join(".")} -- ${message}`;
			super(explanation ?? msg);
			if (explanation != null) this.cause = msg;
			Object.assign(this, rest);
			this.name = this.constructor.name;
			this.failures = () => {
				return cached ?? (cached = [failure, ...failures()]);
			};
		}
	};
	Struct = class {
		constructor(props) {
			const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {} } = props;
			this.type = type;
			this.schema = schema;
			this.entries = entries;
			this.coercer = coercer;
			if (validator) this.validator = (value, context) => {
				return toFailures(validator(value, context), context, this, value);
			};
			else this.validator = () => [];
			if (refiner) this.refiner = (value, context) => {
				return toFailures(refiner(value, context), context, this, value);
			};
			else this.refiner = () => [];
		}
		/**
		* Assert that a value passes the struct's validation, throwing if it doesn't.
		*/
		assert(value, message) {
			return assert(value, this, message);
		}
		/**
		* Create a value with the struct's coercion logic, then validate it.
		*/
		create(value, message) {
			return create(value, this, message);
		}
		/**
		* Check if a value passes the struct's validation.
		*/
		is(value) {
			return is(value, this);
		}
		/**
		* Mask a value, coercing and validating it, but returning only the subset of
		* properties defined by the struct's schema.
		*/
		mask(value, message) {
			return mask(value, this, message);
		}
		/**
		* Validate a value with the struct's validation logic, returning a tuple
		* representing the result.
		*
		* You may optionally pass `true` for the `withCoercion` argument to coerce
		* the value before attempting to validate it. If you do, the result will
		* contain the coerced result when successful.
		*/
		validate(value, options = {}) {
			return validate(value, this, options);
		}
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/assert.js
var require_assert = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assertExhaustive = exports.assertStruct = exports.assert = exports.AssertionError = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	/**
	* Type guard for determining whether the given value is an error object with a
	* `message` property, such as an instance of Error.
	*
	* @param error - The object to check.
	* @returns True or false, depending on the result.
	*/
	function isErrorWithMessage(error) {
		return typeof error === "object" && error !== null && "message" in error;
	}
	/**
	* Check if a value is a constructor, i.e., a function that can be called with
	* the `new` keyword.
	*
	* @param fn - The value to check.
	* @returns `true` if the value is a constructor, or `false` otherwise.
	*/
	function isConstructable(fn) {
		var _a, _b;
		/* istanbul ignore next */
		return Boolean(typeof ((_b = (_a = fn === null || fn === void 0 ? void 0 : fn.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) === "string");
	}
	/**
	* Get the error message from an unknown error object. If the error object has
	* a `message` property, that property is returned. Otherwise, the stringified
	* error object is returned.
	*
	* @param error - The error object to get the message from.
	* @returns The error message.
	*/
	function getErrorMessage(error) {
		const message = isErrorWithMessage(error) ? error.message : String(error);
		if (message.endsWith(".")) return message.slice(0, -1);
		return message;
	}
	/**
	* Initialise an {@link AssertionErrorConstructor} error.
	*
	* @param ErrorWrapper - The error class to use.
	* @param message - The error message.
	* @returns The error object.
	*/
	function getError(ErrorWrapper, message) {
		if (isConstructable(ErrorWrapper)) return new ErrorWrapper({ message });
		return ErrorWrapper({ message });
	}
	/**
	* The default error class that is thrown if an assertion fails.
	*/
	var AssertionError = class extends Error {
		constructor(options) {
			super(options.message);
			this.code = "ERR_ASSERTION";
		}
	};
	exports.AssertionError = AssertionError;
	/**
	* Same as Node.js assert.
	* If the value is falsy, throws an error, does nothing otherwise.
	*
	* @throws {@link AssertionError} If value is falsy.
	* @param value - The test that should be truthy to pass.
	* @param message - Message to be passed to {@link AssertionError} or an
	* {@link Error} instance to throw.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}. If a custom error class is provided for
	* the `message` argument, this argument is ignored.
	*/
	function assert(value, message = "Assertion failed.", ErrorWrapper = AssertionError) {
		if (!value) {
			if (message instanceof Error) throw message;
			throw getError(ErrorWrapper, message);
		}
	}
	exports.assert = assert;
	/**
	* Assert a value against a Superstruct struct.
	*
	* @param value - The value to validate.
	* @param struct - The struct to validate against.
	* @param errorPrefix - A prefix to add to the error message. Defaults to
	* "Assertion failed".
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the value is not valid.
	*/
	function assertStruct(value, struct, errorPrefix = "Assertion failed", ErrorWrapper = AssertionError) {
		try {
			(0, superstruct_1.assert)(value, struct);
		} catch (error) {
			throw getError(ErrorWrapper, `${errorPrefix}: ${getErrorMessage(error)}.`);
		}
	}
	exports.assertStruct = assertStruct;
	/**
	* Use in the default case of a switch that you want to be fully exhaustive.
	* Using this function forces the compiler to enforce exhaustivity during
	* compile-time.
	*
	* @example
	* ```
	* const number = 1;
	* switch (number) {
	*   case 0:
	*     ...
	*   case 1:
	*     ...
	*   default:
	*     assertExhaustive(snapPrefix);
	* }
	* ```
	* @param _object - The object on which the switch is being operated.
	*/
	function assertExhaustive(_object) {
		throw new Error("Invalid branch reached. Should be detected during compilation.");
	}
	exports.assertExhaustive = assertExhaustive;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.base64 = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var assert_1 = require_assert();
	/**
	* Ensure that a provided string-based struct is valid base64.
	*
	* @param struct - The string based struct.
	* @param options - Optional options to specialize base64 validation. See {@link Base64Options} documentation.
	* @returns A superstruct validating base64.
	*/
	var base64 = (struct, options = {}) => {
		var _a, _b;
		const paddingRequired = (_a = options.paddingRequired) !== null && _a !== void 0 ? _a : false;
		const characterSet = (_b = options.characterSet) !== null && _b !== void 0 ? _b : "base64";
		let letters;
		if (characterSet === "base64") letters = String.raw`[A-Za-z0-9+\/]`;
		else {
			(0, assert_1.assert)(characterSet === "base64url");
			letters = String.raw`[-_A-Za-z0-9]`;
		}
		let re;
		if (paddingRequired) re = new RegExp(`^(?:${letters}{4})*(?:${letters}{3}=|${letters}{2}==)?$`, "u");
		else re = new RegExp(`^(?:${letters}{4})*(?:${letters}{2,3}|${letters}{3}=|${letters}{2}==)?$`, "u");
		return (0, superstruct_1.pattern)(struct, re);
	};
	exports.base64 = base64;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/hex.js
var require_hex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.remove0x = exports.add0x = exports.assertIsStrictHexString = exports.assertIsHexString = exports.isStrictHexString = exports.isHexString = exports.StrictHexStruct = exports.HexStruct = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var assert_1 = require_assert();
	exports.HexStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^(?:0x)?[0-9a-f]+$/iu);
	exports.StrictHexStruct = (0, superstruct_1.pattern)((0, superstruct_1.string)(), /^0x[0-9a-f]+$/iu);
	/**
	* Check if a string is a valid hex string.
	*
	* @param value - The value to check.
	* @returns Whether the value is a valid hex string.
	*/
	function isHexString(value) {
		return (0, superstruct_1.is)(value, exports.HexStruct);
	}
	exports.isHexString = isHexString;
	/**
	* Strictly check if a string is a valid hex string. A valid hex string must
	* start with the "0x"-prefix.
	*
	* @param value - The value to check.
	* @returns Whether the value is a valid hex string.
	*/
	function isStrictHexString(value) {
		return (0, superstruct_1.is)(value, exports.StrictHexStruct);
	}
	exports.isStrictHexString = isStrictHexString;
	/**
	* Assert that a value is a valid hex string.
	*
	* @param value - The value to check.
	* @throws If the value is not a valid hex string.
	*/
	function assertIsHexString(value) {
		(0, assert_1.assert)(isHexString(value), "Value must be a hexadecimal string.");
	}
	exports.assertIsHexString = assertIsHexString;
	/**
	* Assert that a value is a valid hex string. A valid hex string must start with
	* the "0x"-prefix.
	*
	* @param value - The value to check.
	* @throws If the value is not a valid hex string.
	*/
	function assertIsStrictHexString(value) {
		(0, assert_1.assert)(isStrictHexString(value), "Value must be a hexadecimal string, starting with \"0x\".");
	}
	exports.assertIsStrictHexString = assertIsStrictHexString;
	/**
	* Add the `0x`-prefix to a hexadecimal string. If the string already has the
	* prefix, it is returned as-is.
	*
	* @param hexadecimal - The hexadecimal string to add the prefix to.
	* @returns The prefixed hexadecimal string.
	*/
	function add0x(hexadecimal) {
		if (hexadecimal.startsWith("0x")) return hexadecimal;
		if (hexadecimal.startsWith("0X")) return `0x${hexadecimal.substring(2)}`;
		return `0x${hexadecimal}`;
	}
	exports.add0x = add0x;
	/**
	* Remove the `0x`-prefix from a hexadecimal string. If the string doesn't have
	* the prefix, it is returned as-is.
	*
	* @param hexadecimal - The hexadecimal string to remove the prefix from.
	* @returns The un-prefixed hexadecimal string.
	*/
	function remove0x(hexadecimal) {
		if (hexadecimal.startsWith("0x") || hexadecimal.startsWith("0X")) return hexadecimal.substring(2);
		return hexadecimal;
	}
	exports.remove0x = remove0x;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/bytes.js
var require_bytes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDataView = exports.concatBytes = exports.valueToBytes = exports.stringToBytes = exports.numberToBytes = exports.signedBigIntToBytes = exports.bigIntToBytes = exports.hexToBytes = exports.bytesToString = exports.bytesToNumber = exports.bytesToSignedBigInt = exports.bytesToBigInt = exports.bytesToHex = exports.assertIsBytes = exports.isBytes = void 0;
	var assert_1 = require_assert();
	var hex_1 = require_hex();
	var HEX_MINIMUM_NUMBER_CHARACTER = 48;
	var HEX_MAXIMUM_NUMBER_CHARACTER = 58;
	var HEX_CHARACTER_OFFSET = 87;
	/**
	* Memoized function that returns an array to be used as a lookup table for
	* converting bytes to hexadecimal values.
	*
	* The array is created lazily and then cached for future use. The benefit of
	* this approach is that the performance of converting bytes to hex is much
	* better than if we were to call `toString(16)` on each byte.
	*
	* The downside is that the array is created once and then never garbage
	* collected. This is not a problem in practice because the array is only 256
	* elements long.
	*
	* @returns A function that returns the lookup table.
	*/
	function getPrecomputedHexValuesBuilder() {
		const lookupTable = [];
		return () => {
			if (lookupTable.length === 0) for (let i = 0; i < 256; i++) lookupTable.push(i.toString(16).padStart(2, "0"));
			return lookupTable;
		};
	}
	/**
	* Function implementation of the {@link getPrecomputedHexValuesBuilder}
	* function.
	*/
	var getPrecomputedHexValues = getPrecomputedHexValuesBuilder();
	/**
	* Check if a value is a `Uint8Array`.
	*
	* @param value - The value to check.
	* @returns Whether the value is a `Uint8Array`.
	*/
	function isBytes(value) {
		return value instanceof Uint8Array;
	}
	exports.isBytes = isBytes;
	/**
	* Assert that a value is a `Uint8Array`.
	*
	* @param value - The value to check.
	* @throws If the value is not a `Uint8Array`.
	*/
	function assertIsBytes(value) {
		(0, assert_1.assert)(isBytes(value), "Value must be a Uint8Array.");
	}
	exports.assertIsBytes = assertIsBytes;
	/**
	* Convert a `Uint8Array` to a hexadecimal string.
	*
	* @param bytes - The bytes to convert to a hexadecimal string.
	* @returns The hexadecimal string.
	*/
	function bytesToHex(bytes) {
		assertIsBytes(bytes);
		if (bytes.length === 0) return "0x";
		const lookupTable = getPrecomputedHexValues();
		const hexadecimal = new Array(bytes.length);
		for (let i = 0; i < bytes.length; i++) hexadecimal[i] = lookupTable[bytes[i]];
		return (0, hex_1.add0x)(hexadecimal.join(""));
	}
	exports.bytesToHex = bytesToHex;
	/**
	* Convert a `Uint8Array` to a `bigint`.
	*
	* To convert a `Uint8Array` to a `number` instead, use {@link bytesToNumber}.
	* To convert a two's complement encoded `Uint8Array` to a `bigint`, use
	* {@link bytesToSignedBigInt}.
	*
	* @param bytes - The bytes to convert to a `bigint`.
	* @returns The `bigint`.
	*/
	function bytesToBigInt(bytes) {
		assertIsBytes(bytes);
		const hexadecimal = bytesToHex(bytes);
		return BigInt(hexadecimal);
	}
	exports.bytesToBigInt = bytesToBigInt;
	/**
	* Convert a `Uint8Array` to a signed `bigint`. This assumes that the bytes are
	* encoded in two's complement.
	*
	* To convert a `Uint8Array` to an unsigned `bigint` instead, use
	* {@link bytesToBigInt}.
	*
	* @see https://en.wikipedia.org/wiki/Two%27s_complement
	* @param bytes - The bytes to convert to a signed `bigint`.
	* @returns The signed `bigint`.
	*/
	function bytesToSignedBigInt(bytes) {
		assertIsBytes(bytes);
		let value = BigInt(0);
		for (const byte of bytes) value = (value << BigInt(8)) + BigInt(byte);
		return BigInt.asIntN(bytes.length * 8, value);
	}
	exports.bytesToSignedBigInt = bytesToSignedBigInt;
	/**
	* Convert a `Uint8Array` to a `number`.
	*
	* To convert a `Uint8Array` to a `bigint` instead, use {@link bytesToBigInt}.
	*
	* @param bytes - The bytes to convert to a number.
	* @returns The number.
	* @throws If the resulting number is not a safe integer.
	*/
	function bytesToNumber(bytes) {
		assertIsBytes(bytes);
		const bigint = bytesToBigInt(bytes);
		(0, assert_1.assert)(bigint <= BigInt(Number.MAX_SAFE_INTEGER), "Number is not a safe integer. Use `bytesToBigInt` instead.");
		return Number(bigint);
	}
	exports.bytesToNumber = bytesToNumber;
	/**
	* Convert a UTF-8 encoded `Uint8Array` to a `string`.
	*
	* @param bytes - The bytes to convert to a string.
	* @returns The string.
	*/
	function bytesToString(bytes) {
		assertIsBytes(bytes);
		return new TextDecoder().decode(bytes);
	}
	exports.bytesToString = bytesToString;
	/**
	* Convert a hexadecimal string to a `Uint8Array`. The string can optionally be
	* prefixed with `0x`. It accepts even and odd length strings.
	*
	* If the value is "0x", an empty `Uint8Array` is returned.
	*
	* @param value - The hexadecimal string to convert to bytes.
	* @returns The bytes as `Uint8Array`.
	*/
	function hexToBytes(value) {
		var _a;
		if (((_a = value === null || value === void 0 ? void 0 : value.toLowerCase) === null || _a === void 0 ? void 0 : _a.call(value)) === "0x") return /* @__PURE__ */ new Uint8Array();
		(0, hex_1.assertIsHexString)(value);
		const strippedValue = (0, hex_1.remove0x)(value).toLowerCase();
		const normalizedValue = strippedValue.length % 2 === 0 ? strippedValue : `0${strippedValue}`;
		const bytes = new Uint8Array(normalizedValue.length / 2);
		for (let i = 0; i < bytes.length; i++) {
			const c1 = normalizedValue.charCodeAt(i * 2);
			const c2 = normalizedValue.charCodeAt(i * 2 + 1);
			const n1 = c1 - (c1 < HEX_MAXIMUM_NUMBER_CHARACTER ? HEX_MINIMUM_NUMBER_CHARACTER : HEX_CHARACTER_OFFSET);
			const n2 = c2 - (c2 < HEX_MAXIMUM_NUMBER_CHARACTER ? HEX_MINIMUM_NUMBER_CHARACTER : HEX_CHARACTER_OFFSET);
			bytes[i] = n1 * 16 + n2;
		}
		return bytes;
	}
	exports.hexToBytes = hexToBytes;
	/**
	* Convert a `bigint` to a `Uint8Array`.
	*
	* This assumes that the `bigint` is an unsigned integer. To convert a signed
	* `bigint` instead, use {@link signedBigIntToBytes}.
	*
	* @param value - The bigint to convert to bytes.
	* @returns The bytes as `Uint8Array`.
	*/
	function bigIntToBytes(value) {
		(0, assert_1.assert)(typeof value === "bigint", "Value must be a bigint.");
		(0, assert_1.assert)(value >= BigInt(0), "Value must be a non-negative bigint.");
		return hexToBytes(value.toString(16));
	}
	exports.bigIntToBytes = bigIntToBytes;
	/**
	* Check if a `bigint` fits in a certain number of bytes.
	*
	* @param value - The `bigint` to check.
	* @param bytes - The number of bytes.
	* @returns Whether the `bigint` fits in the number of bytes.
	*/
	function bigIntFits(value, bytes) {
		(0, assert_1.assert)(bytes > 0);
		const mask = value >> BigInt(31);
		return !((~value & mask) + (value & ~mask) >> BigInt(bytes * 8 + -1));
	}
	/**
	* Convert a signed `bigint` to a `Uint8Array`. This uses two's complement
	* encoding to represent negative numbers.
	*
	* To convert an unsigned `bigint` to a `Uint8Array` instead, use
	* {@link bigIntToBytes}.
	*
	* @see https://en.wikipedia.org/wiki/Two%27s_complement
	* @param value - The number to convert to bytes.
	* @param byteLength - The length of the resulting `Uint8Array`. If the number
	* is larger than the maximum value that can be represented by the given length,
	* an error is thrown.
	* @returns The bytes as `Uint8Array`.
	*/
	function signedBigIntToBytes(value, byteLength) {
		(0, assert_1.assert)(typeof value === "bigint", "Value must be a bigint.");
		(0, assert_1.assert)(typeof byteLength === "number", "Byte length must be a number.");
		(0, assert_1.assert)(byteLength > 0, "Byte length must be greater than 0.");
		(0, assert_1.assert)(bigIntFits(value, byteLength), "Byte length is too small to represent the given value.");
		let numberValue = value;
		const bytes = new Uint8Array(byteLength);
		for (let i = 0; i < bytes.length; i++) {
			bytes[i] = Number(BigInt.asUintN(8, numberValue));
			numberValue >>= BigInt(8);
		}
		return bytes.reverse();
	}
	exports.signedBigIntToBytes = signedBigIntToBytes;
	/**
	* Convert a `number` to a `Uint8Array`.
	*
	* @param value - The number to convert to bytes.
	* @returns The bytes as `Uint8Array`.
	* @throws If the number is not a safe integer.
	*/
	function numberToBytes(value) {
		(0, assert_1.assert)(typeof value === "number", "Value must be a number.");
		(0, assert_1.assert)(value >= 0, "Value must be a non-negative number.");
		(0, assert_1.assert)(Number.isSafeInteger(value), "Value is not a safe integer. Use `bigIntToBytes` instead.");
		return hexToBytes(value.toString(16));
	}
	exports.numberToBytes = numberToBytes;
	/**
	* Convert a `string` to a UTF-8 encoded `Uint8Array`.
	*
	* @param value - The string to convert to bytes.
	* @returns The bytes as `Uint8Array`.
	*/
	function stringToBytes(value) {
		(0, assert_1.assert)(typeof value === "string", "Value must be a string.");
		return new TextEncoder().encode(value);
	}
	exports.stringToBytes = stringToBytes;
	/**
	* Convert a byte-like value to a `Uint8Array`. The value can be a `Uint8Array`,
	* a `bigint`, a `number`, or a `string`.
	*
	* This will attempt to guess the type of the value based on its type and
	* contents. For more control over the conversion, use the more specific
	* conversion functions, such as {@link hexToBytes} or {@link stringToBytes}.
	*
	* If the value is a `string`, and it is prefixed with `0x`, it will be
	* interpreted as a hexadecimal string. Otherwise, it will be interpreted as a
	* UTF-8 string. To convert a hexadecimal string to bytes without interpreting
	* it as a UTF-8 string, use {@link hexToBytes} instead.
	*
	* If the value is a `bigint`, it is assumed to be unsigned. To convert a signed
	* `bigint` to bytes, use {@link signedBigIntToBytes} instead.
	*
	* If the value is a `Uint8Array`, it will be returned as-is.
	*
	* @param value - The value to convert to bytes.
	* @returns The bytes as `Uint8Array`.
	*/
	function valueToBytes(value) {
		if (typeof value === "bigint") return bigIntToBytes(value);
		if (typeof value === "number") return numberToBytes(value);
		if (typeof value === "string") {
			if (value.startsWith("0x")) return hexToBytes(value);
			return stringToBytes(value);
		}
		if (isBytes(value)) return value;
		throw new TypeError(`Unsupported value type: "${typeof value}".`);
	}
	exports.valueToBytes = valueToBytes;
	/**
	* Concatenate multiple byte-like values into a single `Uint8Array`. The values
	* can be `Uint8Array`, `bigint`, `number`, or `string`. This uses
	* {@link valueToBytes} under the hood to convert each value to bytes. Refer to
	* the documentation of that function for more information.
	*
	* @param values - The values to concatenate.
	* @returns The concatenated bytes as `Uint8Array`.
	*/
	function concatBytes(values) {
		const normalizedValues = new Array(values.length);
		let byteLength = 0;
		for (let i = 0; i < values.length; i++) {
			const value = valueToBytes(values[i]);
			normalizedValues[i] = value;
			byteLength += value.length;
		}
		const bytes = new Uint8Array(byteLength);
		for (let i = 0, offset = 0; i < normalizedValues.length; i++) {
			bytes.set(normalizedValues[i], offset);
			offset += normalizedValues[i].length;
		}
		return bytes;
	}
	exports.concatBytes = concatBytes;
	/**
	* Create a {@link DataView} from a {@link Uint8Array}. This is a convenience
	* function that avoids having to create a {@link DataView} manually, which
	* requires passing the `byteOffset` and `byteLength` parameters every time.
	*
	* Not passing the `byteOffset` and `byteLength` parameters can result in
	* unexpected behavior when the {@link Uint8Array} is a view of a larger
	* {@link ArrayBuffer}, e.g., when using {@link Uint8Array.subarray}.
	*
	* This function also supports Node.js {@link Buffer}s.
	*
	* @example
	* ```typescript
	* const bytes = new Uint8Array([1, 2, 3]);
	*
	* // This is equivalent to:
	* // const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	* const dataView = createDataView(bytes);
	* ```
	* @param bytes - The bytes to create the {@link DataView} from.
	* @returns The {@link DataView}.
	*/
	function createDataView(bytes) {
		if (typeof Buffer !== "undefined" && bytes instanceof Buffer) {
			const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
			return new DataView(buffer);
		}
		return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	}
	exports.createDataView = createDataView;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/checksum.js
var require_checksum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ChecksumStruct = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var base64_1 = require_base64();
	exports.ChecksumStruct = (0, superstruct_1.size)((0, base64_1.base64)((0, superstruct_1.string)(), { paddingRequired: true }), 44, 44);
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/coercers.js
var require_coercers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createHex = exports.createBytes = exports.createBigInt = exports.createNumber = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var assert_1 = require_assert();
	var bytes_1 = require_bytes();
	var hex_1 = require_hex();
	var NumberLikeStruct = (0, superstruct_1.union)([
		(0, superstruct_1.number)(),
		(0, superstruct_1.bigint)(),
		(0, superstruct_1.string)(),
		hex_1.StrictHexStruct
	]);
	var NumberCoercer = (0, superstruct_1.coerce)((0, superstruct_1.number)(), NumberLikeStruct, Number);
	var BigIntCoercer = (0, superstruct_1.coerce)((0, superstruct_1.bigint)(), NumberLikeStruct, BigInt);
	(0, superstruct_1.union)([hex_1.StrictHexStruct, (0, superstruct_1.instance)(Uint8Array)]);
	var BytesCoercer = (0, superstruct_1.coerce)((0, superstruct_1.instance)(Uint8Array), (0, superstruct_1.union)([hex_1.StrictHexStruct]), bytes_1.hexToBytes);
	var HexCoercer = (0, superstruct_1.coerce)(hex_1.StrictHexStruct, (0, superstruct_1.instance)(Uint8Array), bytes_1.bytesToHex);
	/**
	* Create a number from a number-like value.
	*
	* - If the value is a number, it is returned as-is.
	* - If the value is a `bigint`, it is converted to a number.
	* - If the value is a string, it is interpreted as a decimal number.
	* - If the value is a hex string (i.e., it starts with "0x"), it is
	* interpreted as a hexadecimal number.
	*
	* This validates that the value is a number-like value, and that the resulting
	* number is not `NaN` or `Infinity`.
	*
	* @example
	* ```typescript
	* const value = createNumber('0x010203');
	* console.log(value); // 66051
	*
	* const otherValue = createNumber(123n);
	* console.log(otherValue); // 123
	* ```
	* @param value - The value to create the number from.
	* @returns The created number.
	* @throws If the value is not a number-like value, or if the resulting number
	* is `NaN` or `Infinity`.
	*/
	function createNumber(value) {
		try {
			const result = (0, superstruct_1.create)(value, NumberCoercer);
			(0, assert_1.assert)(Number.isFinite(result), `Expected a number-like value, got "${value}".`);
			return result;
		} catch (error) {
			if (error instanceof superstruct_1.StructError) throw new Error(`Expected a number-like value, got "${value}".`);
			/* istanbul ignore next */
			throw error;
		}
	}
	exports.createNumber = createNumber;
	/**
	* Create a `bigint` from a number-like value.
	*
	* - If the value is a number, it is converted to a `bigint`.
	* - If the value is a `bigint`, it is returned as-is.
	* - If the value is a string, it is interpreted as a decimal number and
	* converted to a `bigint`.
	* - If the value is a hex string (i.e., it starts with "0x"), it is
	* interpreted as a hexadecimal number and converted to a `bigint`.
	*
	* @example
	* ```typescript
	* const value = createBigInt('0x010203');
	* console.log(value); // 16909060n
	*
	* const otherValue = createBigInt(123);
	* console.log(otherValue); // 123n
	* ```
	* @param value - The value to create the bigint from.
	* @returns The created bigint.
	* @throws If the value is not a number-like value.
	*/
	function createBigInt(value) {
		try {
			return (0, superstruct_1.create)(value, BigIntCoercer);
		} catch (error) {
			if (error instanceof superstruct_1.StructError) throw new Error(`Expected a number-like value, got "${String(error.value)}".`);
			/* istanbul ignore next */
			throw error;
		}
	}
	exports.createBigInt = createBigInt;
	/**
	* Create a byte array from a bytes-like value.
	*
	* - If the value is a byte array, it is returned as-is.
	* - If the value is a hex string (i.e., it starts with "0x"), it is interpreted
	* as a hexadecimal number and converted to a byte array.
	*
	* @example
	* ```typescript
	* const value = createBytes('0x010203');
	* console.log(value); // Uint8Array [ 1, 2, 3 ]
	*
	* const otherValue = createBytes('0x010203');
	* console.log(otherValue); // Uint8Array [ 1, 2, 3 ]
	* ```
	* @param value - The value to create the byte array from.
	* @returns The created byte array.
	* @throws If the value is not a bytes-like value.
	*/
	function createBytes(value) {
		if (typeof value === "string" && value.toLowerCase() === "0x") return /* @__PURE__ */ new Uint8Array();
		try {
			return (0, superstruct_1.create)(value, BytesCoercer);
		} catch (error) {
			if (error instanceof superstruct_1.StructError) throw new Error(`Expected a bytes-like value, got "${String(error.value)}".`);
			/* istanbul ignore next */
			throw error;
		}
	}
	exports.createBytes = createBytes;
	/**
	* Create a hexadecimal string from a bytes-like value.
	*
	* - If the value is a hex string (i.e., it starts with "0x"), it is returned
	* as-is.
	* - If the value is a `Uint8Array`, it is converted to a hex string.
	*
	* @example
	* ```typescript
	* const value = createHex(new Uint8Array([1, 2, 3]));
	* console.log(value); // '0x010203'
	*
	* const otherValue = createHex('0x010203');
	* console.log(otherValue); // '0x010203'
	* ```
	* @param value - The value to create the hex string from.
	* @returns The created hex string.
	* @throws If the value is not a bytes-like value.
	*/
	function createHex(value) {
		if (value instanceof Uint8Array && value.length === 0 || typeof value === "string" && value.toLowerCase() === "0x") return "0x";
		try {
			return (0, superstruct_1.create)(value, HexCoercer);
		} catch (error) {
			if (error instanceof superstruct_1.StructError) throw new Error(`Expected a bytes-like value, got "${String(error.value)}".`);
			/* istanbul ignore next */
			throw error;
		}
	}
	exports.createHex = createHex;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/collections.js
var require_collections = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	};
	var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	};
	var _FrozenMap_map;
	var _FrozenSet_set;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FrozenSet = exports.FrozenMap = void 0;
	/**
	* A {@link ReadonlyMap} that cannot be modified after instantiation.
	* The implementation uses an inner map hidden via a private field, and the
	* immutability guarantee relies on it being impossible to get a reference
	* to this map.
	*/
	var FrozenMap = class {
		constructor(entries) {
			_FrozenMap_map.set(this, void 0);
			__classPrivateFieldSet(this, _FrozenMap_map, new Map(entries), "f");
			Object.freeze(this);
		}
		get size() {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").size;
		}
		[(_FrozenMap_map = /* @__PURE__ */ new WeakMap(), Symbol.iterator)]() {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f")[Symbol.iterator]();
		}
		entries() {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").entries();
		}
		forEach(callbackfn, thisArg) {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").forEach((value, key, _map) => callbackfn.call(thisArg, value, key, this));
		}
		get(key) {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").get(key);
		}
		has(key) {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").has(key);
		}
		keys() {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").keys();
		}
		values() {
			return __classPrivateFieldGet(this, _FrozenMap_map, "f").values();
		}
		toString() {
			return `FrozenMap(${this.size}) {${this.size > 0 ? ` ${[...this.entries()].map(([key, value]) => `${String(key)} => ${String(value)}`).join(", ")} ` : ""}}`;
		}
	};
	exports.FrozenMap = FrozenMap;
	/**
	* A {@link ReadonlySet} that cannot be modified after instantiation.
	* The implementation uses an inner set hidden via a private field, and the
	* immutability guarantee relies on it being impossible to get a reference
	* to this set.
	*/
	var FrozenSet = class {
		constructor(values) {
			_FrozenSet_set.set(this, void 0);
			__classPrivateFieldSet(this, _FrozenSet_set, new Set(values), "f");
			Object.freeze(this);
		}
		get size() {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").size;
		}
		[(_FrozenSet_set = /* @__PURE__ */ new WeakMap(), Symbol.iterator)]() {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f")[Symbol.iterator]();
		}
		entries() {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").entries();
		}
		forEach(callbackfn, thisArg) {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").forEach((value, value2, _set) => callbackfn.call(thisArg, value, value2, this));
		}
		has(value) {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").has(value);
		}
		keys() {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").keys();
		}
		values() {
			return __classPrivateFieldGet(this, _FrozenSet_set, "f").values();
		}
		toString() {
			return `FrozenSet(${this.size}) {${this.size > 0 ? ` ${[...this.values()].map((member) => String(member)).join(", ")} ` : ""}}`;
		}
	};
	exports.FrozenSet = FrozenSet;
	Object.freeze(FrozenMap);
	Object.freeze(FrozenMap.prototype);
	Object.freeze(FrozenSet);
	Object.freeze(FrozenSet.prototype);
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/encryption-types.js
var require_encryption_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/json.js
var require_json = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getJsonRpcIdValidator = exports.assertIsJsonRpcError = exports.isJsonRpcError = exports.assertIsJsonRpcFailure = exports.isJsonRpcFailure = exports.assertIsJsonRpcSuccess = exports.isJsonRpcSuccess = exports.assertIsJsonRpcResponse = exports.isJsonRpcResponse = exports.assertIsPendingJsonRpcResponse = exports.isPendingJsonRpcResponse = exports.JsonRpcResponseStruct = exports.JsonRpcFailureStruct = exports.JsonRpcSuccessStruct = exports.PendingJsonRpcResponseStruct = exports.assertIsJsonRpcRequest = exports.isJsonRpcRequest = exports.assertIsJsonRpcNotification = exports.isJsonRpcNotification = exports.JsonRpcNotificationStruct = exports.JsonRpcRequestStruct = exports.JsonRpcParamsStruct = exports.JsonRpcErrorStruct = exports.JsonRpcIdStruct = exports.JsonRpcVersionStruct = exports.jsonrpc2 = exports.getJsonSize = exports.isValidJson = exports.JsonStruct = exports.UnsafeJsonStruct = void 0;
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var assert_1 = require_assert();
	/**
	* A struct to check if the given value is finite number. Superstruct's
	* `number()` struct does not check if the value is finite.
	*
	* @returns A struct to check if the given value is finite number.
	*/
	var finiteNumber = () => (0, superstruct_1.define)("finite number", (value) => {
		return (0, superstruct_1.is)(value, (0, superstruct_1.number)()) && Number.isFinite(value);
	});
	/**
	* A struct to check if the given value is a valid JSON-serializable value.
	*
	* Note that this struct is unsafe. For safe validation, use {@link JsonStruct}.
	*/
	exports.UnsafeJsonStruct = (0, superstruct_1.union)([
		(0, superstruct_1.literal)(null),
		(0, superstruct_1.boolean)(),
		finiteNumber(),
		(0, superstruct_1.string)(),
		(0, superstruct_1.array)((0, superstruct_1.lazy)(() => exports.UnsafeJsonStruct)),
		(0, superstruct_1.record)((0, superstruct_1.string)(), (0, superstruct_1.lazy)(() => exports.UnsafeJsonStruct))
	]);
	/**
	* A struct to check if the given value is a valid JSON-serializable value.
	*
	* This struct sanitizes the value before validating it, so that it is safe to
	* use with untrusted input.
	*/
	exports.JsonStruct = (0, superstruct_1.define)("Json", (value, context) => {
		/**
		* Helper function that runs the given struct validator and returns the
		* validation errors, if any. If the value is valid, it returns `true`.
		*
		* @param innerValue - The value to validate.
		* @param struct - The struct to use for validation.
		* @returns The validation errors, or `true` if the value is valid.
		*/
		function checkStruct(innerValue, struct) {
			const errors = [...struct.validator(innerValue, context)];
			if (errors.length > 0) return errors;
			return true;
		}
		try {
			const unsafeResult = checkStruct(value, exports.UnsafeJsonStruct);
			if (unsafeResult !== true) return unsafeResult;
			return checkStruct(JSON.parse(JSON.stringify(value)), exports.UnsafeJsonStruct);
		} catch (error) {
			if (error instanceof RangeError) return "Circular reference detected";
			return false;
		}
	});
	/**
	* Check if the given value is a valid {@link Json} value, i.e., a value that is
	* serializable to JSON.
	*
	* @param value - The value to check.
	* @returns Whether the value is a valid {@link Json} value.
	*/
	function isValidJson(value) {
		return (0, superstruct_1.is)(value, exports.JsonStruct);
	}
	exports.isValidJson = isValidJson;
	/**
	* Get the size of a JSON value in bytes. This also validates the value.
	*
	* @param value - The JSON value to get the size of.
	* @returns The size of the JSON value in bytes.
	*/
	function getJsonSize(value) {
		(0, assert_1.assertStruct)(value, exports.JsonStruct, "Invalid JSON value");
		const json = JSON.stringify(value);
		return new TextEncoder().encode(json).byteLength;
	}
	exports.getJsonSize = getJsonSize;
	/**
	* The string '2.0'.
	*/
	exports.jsonrpc2 = "2.0";
	exports.JsonRpcVersionStruct = (0, superstruct_1.literal)(exports.jsonrpc2);
	exports.JsonRpcIdStruct = (0, superstruct_1.nullable)((0, superstruct_1.union)([(0, superstruct_1.number)(), (0, superstruct_1.string)()]));
	exports.JsonRpcErrorStruct = (0, superstruct_1.object)({
		code: (0, superstruct_1.integer)(),
		message: (0, superstruct_1.string)(),
		data: (0, superstruct_1.optional)(exports.JsonStruct),
		stack: (0, superstruct_1.optional)((0, superstruct_1.string)())
	});
	exports.JsonRpcParamsStruct = (0, superstruct_1.optional)((0, superstruct_1.union)([(0, superstruct_1.record)((0, superstruct_1.string)(), exports.JsonStruct), (0, superstruct_1.array)(exports.JsonStruct)]));
	exports.JsonRpcRequestStruct = (0, superstruct_1.object)({
		id: exports.JsonRpcIdStruct,
		jsonrpc: exports.JsonRpcVersionStruct,
		method: (0, superstruct_1.string)(),
		params: exports.JsonRpcParamsStruct
	});
	exports.JsonRpcNotificationStruct = (0, superstruct_1.omit)(exports.JsonRpcRequestStruct, ["id"]);
	/**
	* Check if the given value is a valid {@link JsonRpcNotification} object.
	*
	* @param value - The value to check.
	* @returns Whether the given value is a valid {@link JsonRpcNotification}
	* object.
	*/
	function isJsonRpcNotification(value) {
		return (0, superstruct_1.is)(value, exports.JsonRpcNotificationStruct);
	}
	exports.isJsonRpcNotification = isJsonRpcNotification;
	/**
	* Assert that the given value is a valid {@link JsonRpcNotification} object.
	*
	* @param value - The value to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcNotification} object.
	*/
	function assertIsJsonRpcNotification(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcNotificationStruct, "Invalid JSON-RPC notification", ErrorWrapper);
	}
	exports.assertIsJsonRpcNotification = assertIsJsonRpcNotification;
	/**
	* Check if the given value is a valid {@link JsonRpcRequest} object.
	*
	* @param value - The value to check.
	* @returns Whether the given value is a valid {@link JsonRpcRequest} object.
	*/
	function isJsonRpcRequest(value) {
		return (0, superstruct_1.is)(value, exports.JsonRpcRequestStruct);
	}
	exports.isJsonRpcRequest = isJsonRpcRequest;
	/**
	* Assert that the given value is a valid {@link JsonRpcRequest} object.
	*
	* @param value - The JSON-RPC request or notification to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcRequest} object.
	*/
	function assertIsJsonRpcRequest(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcRequestStruct, "Invalid JSON-RPC request", ErrorWrapper);
	}
	exports.assertIsJsonRpcRequest = assertIsJsonRpcRequest;
	exports.PendingJsonRpcResponseStruct = (0, superstruct_1.object)({
		id: exports.JsonRpcIdStruct,
		jsonrpc: exports.JsonRpcVersionStruct,
		result: (0, superstruct_1.optional)((0, superstruct_1.unknown)()),
		error: (0, superstruct_1.optional)(exports.JsonRpcErrorStruct)
	});
	exports.JsonRpcSuccessStruct = (0, superstruct_1.object)({
		id: exports.JsonRpcIdStruct,
		jsonrpc: exports.JsonRpcVersionStruct,
		result: exports.JsonStruct
	});
	exports.JsonRpcFailureStruct = (0, superstruct_1.object)({
		id: exports.JsonRpcIdStruct,
		jsonrpc: exports.JsonRpcVersionStruct,
		error: exports.JsonRpcErrorStruct
	});
	exports.JsonRpcResponseStruct = (0, superstruct_1.union)([exports.JsonRpcSuccessStruct, exports.JsonRpcFailureStruct]);
	/**
	* Type guard to check whether specified JSON-RPC response is a
	* {@link PendingJsonRpcResponse}.
	*
	* @param response - The JSON-RPC response to check.
	* @returns Whether the specified JSON-RPC response is pending.
	*/
	function isPendingJsonRpcResponse(response) {
		return (0, superstruct_1.is)(response, exports.PendingJsonRpcResponseStruct);
	}
	exports.isPendingJsonRpcResponse = isPendingJsonRpcResponse;
	/**
	* Assert that the given value is a valid {@link PendingJsonRpcResponse} object.
	*
	* @param response - The JSON-RPC response to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link PendingJsonRpcResponse}
	* object.
	*/
	function assertIsPendingJsonRpcResponse(response, ErrorWrapper) {
		(0, assert_1.assertStruct)(response, exports.PendingJsonRpcResponseStruct, "Invalid pending JSON-RPC response", ErrorWrapper);
	}
	exports.assertIsPendingJsonRpcResponse = assertIsPendingJsonRpcResponse;
	/**
	* Type guard to check if a value is a {@link JsonRpcResponse}.
	*
	* @param response - The object to check.
	* @returns Whether the object is a JsonRpcResponse.
	*/
	function isJsonRpcResponse(response) {
		return (0, superstruct_1.is)(response, exports.JsonRpcResponseStruct);
	}
	exports.isJsonRpcResponse = isJsonRpcResponse;
	/**
	* Assert that the given value is a valid {@link JsonRpcResponse} object.
	*
	* @param value - The value to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcResponse} object.
	*/
	function assertIsJsonRpcResponse(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcResponseStruct, "Invalid JSON-RPC response", ErrorWrapper);
	}
	exports.assertIsJsonRpcResponse = assertIsJsonRpcResponse;
	/**
	* Check if the given value is a valid {@link JsonRpcSuccess} object.
	*
	* @param value - The value to check.
	* @returns Whether the given value is a valid {@link JsonRpcSuccess} object.
	*/
	function isJsonRpcSuccess(value) {
		return (0, superstruct_1.is)(value, exports.JsonRpcSuccessStruct);
	}
	exports.isJsonRpcSuccess = isJsonRpcSuccess;
	/**
	* Assert that the given value is a valid {@link JsonRpcSuccess} object.
	*
	* @param value - The value to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcSuccess} object.
	*/
	function assertIsJsonRpcSuccess(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcSuccessStruct, "Invalid JSON-RPC success response", ErrorWrapper);
	}
	exports.assertIsJsonRpcSuccess = assertIsJsonRpcSuccess;
	/**
	* Check if the given value is a valid {@link JsonRpcFailure} object.
	*
	* @param value - The value to check.
	* @returns Whether the given value is a valid {@link JsonRpcFailure} object.
	*/
	function isJsonRpcFailure(value) {
		return (0, superstruct_1.is)(value, exports.JsonRpcFailureStruct);
	}
	exports.isJsonRpcFailure = isJsonRpcFailure;
	/**
	* Assert that the given value is a valid {@link JsonRpcFailure} object.
	*
	* @param value - The value to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcFailure} object.
	*/
	function assertIsJsonRpcFailure(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcFailureStruct, "Invalid JSON-RPC failure response", ErrorWrapper);
	}
	exports.assertIsJsonRpcFailure = assertIsJsonRpcFailure;
	/**
	* Check if the given value is a valid {@link JsonRpcError} object.
	*
	* @param value - The value to check.
	* @returns Whether the given value is a valid {@link JsonRpcError} object.
	*/
	function isJsonRpcError(value) {
		return (0, superstruct_1.is)(value, exports.JsonRpcErrorStruct);
	}
	exports.isJsonRpcError = isJsonRpcError;
	/**
	* Assert that the given value is a valid {@link JsonRpcError} object.
	*
	* @param value - The value to check.
	* @param ErrorWrapper - The error class to throw if the assertion fails.
	* Defaults to {@link AssertionError}.
	* @throws If the given value is not a valid {@link JsonRpcError} object.
	*/
	function assertIsJsonRpcError(value, ErrorWrapper) {
		(0, assert_1.assertStruct)(value, exports.JsonRpcErrorStruct, "Invalid JSON-RPC error", ErrorWrapper);
	}
	exports.assertIsJsonRpcError = assertIsJsonRpcError;
	/**
	* Gets a function for validating JSON-RPC request / response `id` values.
	*
	* By manipulating the options of this factory, you can control the behavior
	* of the resulting validator for some edge cases. This is useful because e.g.
	* `null` should sometimes but not always be permitted.
	*
	* Note that the empty string (`''`) is always permitted by the JSON-RPC
	* specification, but that kind of sucks and you may want to forbid it in some
	* instances anyway.
	*
	* For more details, see the
	* [JSON-RPC Specification](https://www.jsonrpc.org/specification).
	*
	* @param options - An options object.
	* @param options.permitEmptyString - Whether the empty string (i.e. `''`)
	* should be treated as a valid ID. Default: `true`
	* @param options.permitFractions - Whether fractional numbers (e.g. `1.2`)
	* should be treated as valid IDs. Default: `false`
	* @param options.permitNull - Whether `null` should be treated as a valid ID.
	* Default: `true`
	* @returns The JSON-RPC ID validator function.
	*/
	function getJsonRpcIdValidator(options) {
		const { permitEmptyString, permitFractions, permitNull } = Object.assign({
			permitEmptyString: true,
			permitFractions: false,
			permitNull: true
		}, options);
		/**
		* Type guard for {@link JsonRpcId}.
		*
		* @param id - The JSON-RPC ID value to check.
		* @returns Whether the given ID is valid per the options given to the
		* factory.
		*/
		const isValidJsonRpcId = (id) => {
			return Boolean(typeof id === "number" && (permitFractions || Number.isInteger(id)) || typeof id === "string" && (permitEmptyString || id.length > 0) || permitNull && id === null);
		};
		return isValidJsonRpcId;
	}
	exports.getJsonRpcIdValidator = getJsonRpcIdValidator;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/keyring.js
var require_keyring = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/logging.js
var require_logging = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createModuleLogger = exports.createProjectLogger = void 0;
	var globalLogger = (0, __importDefault(require_src()).default)("metamask");
	/**
	* Creates a logger via the `debug` library whose log messages will be tagged
	* using the name of your project. By default, such messages will be
	* suppressed, but you can reveal them by setting the `DEBUG` environment
	* variable to `metamask:<projectName>`. You can also set this variable to
	* `metamask:*` if you want to see log messages from all MetaMask projects that
	* are also using this function to create their loggers.
	*
	* @param projectName - The name of your project. This should be the name of
	* your NPM package if you're developing one.
	* @returns An instance of `debug`.
	*/
	function createProjectLogger(projectName) {
		return globalLogger.extend(projectName);
	}
	exports.createProjectLogger = createProjectLogger;
	/**
	* Creates a logger via the `debug` library which is derived from the logger for
	* the whole project whose log messages will be tagged using the name of your
	* module. By default, such messages will be suppressed, but you can reveal them
	* by setting the `DEBUG` environment variable to
	* `metamask:<projectName>:<moduleName>`. You can also set this variable to
	* `metamask:<projectName>:*` if you want to see log messages from the project,
	* or `metamask:*` if you want to see log messages from all MetaMask projects.
	*
	* @param projectLogger - The logger created via {@link createProjectLogger}.
	* @param moduleName - The name of your module. You could use the name of the
	* file where you're using this logger or some other name.
	* @returns An instance of `debug`.
	*/
	function createModuleLogger(projectLogger, moduleName) {
		return projectLogger.extend(moduleName);
	}
	exports.createModuleLogger = createModuleLogger;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/misc.js
var require_misc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.calculateNumberSize = exports.calculateStringSize = exports.isASCII = exports.isPlainObject = exports.ESCAPE_CHARACTERS_REGEXP = exports.JsonSize = exports.hasProperty = exports.isObject = exports.isNullOrUndefined = exports.isNonEmptyArray = void 0;
	/**
	* A {@link NonEmptyArray} type guard.
	*
	* @template Element - The non-empty array member type.
	* @param value - The value to check.
	* @returns Whether the value is a non-empty array.
	*/
	function isNonEmptyArray(value) {
		return Array.isArray(value) && value.length > 0;
	}
	exports.isNonEmptyArray = isNonEmptyArray;
	/**
	* Type guard for "nullishness".
	*
	* @param value - Any value.
	* @returns `true` if the value is null or undefined, `false` otherwise.
	*/
	function isNullOrUndefined(value) {
		return value === null || value === void 0;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	/**
	* A type guard for {@link RuntimeObject}.
	*
	* @param value - The value to check.
	* @returns Whether the specified value has a runtime type of `object` and is
	* neither `null` nor an `Array`.
	*/
	function isObject(value) {
		return Boolean(value) && typeof value === "object" && !Array.isArray(value);
	}
	exports.isObject = isObject;
	/**
	* A type guard for ensuring an object has a property.
	*
	* @param objectToCheck - The object to check.
	* @param name - The property name to check for.
	* @returns Whether the specified object has an own property with the specified
	* name, regardless of whether it is enumerable or not.
	*/
	var hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
	exports.hasProperty = hasProperty;
	(function(JsonSize) {
		JsonSize[JsonSize["Null"] = 4] = "Null";
		JsonSize[JsonSize["Comma"] = 1] = "Comma";
		JsonSize[JsonSize["Wrapper"] = 1] = "Wrapper";
		JsonSize[JsonSize["True"] = 4] = "True";
		JsonSize[JsonSize["False"] = 5] = "False";
		JsonSize[JsonSize["Quote"] = 1] = "Quote";
		JsonSize[JsonSize["Colon"] = 1] = "Colon";
		JsonSize[JsonSize["Date"] = 24] = "Date";
	})(exports.JsonSize || (exports.JsonSize = {}));
	/**
	* Regular expression with pattern matching for (special) escaped characters.
	*/
	exports.ESCAPE_CHARACTERS_REGEXP = /"|\\|\n|\r|\t/gu;
	/**
	* Check if the value is plain object.
	*
	* @param value - Value to be checked.
	* @returns True if an object is the plain JavaScript object,
	* false if the object is not plain (e.g. function).
	*/
	function isPlainObject(value) {
		if (typeof value !== "object" || value === null) return false;
		try {
			let proto = value;
			while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
			return Object.getPrototypeOf(value) === proto;
		} catch (_) {
			return false;
		}
	}
	exports.isPlainObject = isPlainObject;
	/**
	* Check if character is ASCII.
	*
	* @param character - Character.
	* @returns True if a character code is ASCII, false if not.
	*/
	function isASCII(character) {
		return character.charCodeAt(0) <= 127;
	}
	exports.isASCII = isASCII;
	/**
	* Calculate string size.
	*
	* @param value - String value to calculate size.
	* @returns Number of bytes used to store whole string value.
	*/
	function calculateStringSize(value) {
		var _a;
		return value.split("").reduce((total, character) => {
			if (isASCII(character)) return total + 1;
			return total + 2;
		}, 0) + ((_a = value.match(exports.ESCAPE_CHARACTERS_REGEXP)) !== null && _a !== void 0 ? _a : []).length;
	}
	exports.calculateStringSize = calculateStringSize;
	/**
	* Calculate size of a number ofter JSON serialization.
	*
	* @param value - Number value to calculate size.
	* @returns Number of bytes used to store whole number in JSON.
	*/
	function calculateNumberSize(value) {
		return value.toString().length;
	}
	exports.calculateNumberSize = calculateNumberSize;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/number.js
var require_number = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hexToBigInt = exports.hexToNumber = exports.bigIntToHex = exports.numberToHex = void 0;
	var assert_1 = require_assert();
	var hex_1 = require_hex();
	/**
	* Convert a number to a hexadecimal string. This verifies that the number is a
	* non-negative safe integer.
	*
	* To convert a `bigint` to a hexadecimal string instead, use
	* {@link bigIntToHex}.
	*
	* @example
	* ```typescript
	* numberToHex(0); // '0x0'
	* numberToHex(1); // '0x1'
	* numberToHex(16); // '0x10'
	* ```
	* @param value - The number to convert to a hexadecimal string.
	* @returns The hexadecimal string, with the "0x"-prefix.
	* @throws If the number is not a non-negative safe integer.
	*/
	var numberToHex = (value) => {
		(0, assert_1.assert)(typeof value === "number", "Value must be a number.");
		(0, assert_1.assert)(value >= 0, "Value must be a non-negative number.");
		(0, assert_1.assert)(Number.isSafeInteger(value), "Value is not a safe integer. Use `bigIntToHex` instead.");
		return (0, hex_1.add0x)(value.toString(16));
	};
	exports.numberToHex = numberToHex;
	/**
	* Convert a `bigint` to a hexadecimal string. This verifies that the `bigint`
	* is a non-negative integer.
	*
	* To convert a number to a hexadecimal string instead, use {@link numberToHex}.
	*
	* @example
	* ```typescript
	* bigIntToHex(0n); // '0x0'
	* bigIntToHex(1n); // '0x1'
	* bigIntToHex(16n); // '0x10'
	* ```
	* @param value - The `bigint` to convert to a hexadecimal string.
	* @returns The hexadecimal string, with the "0x"-prefix.
	* @throws If the `bigint` is not a non-negative integer.
	*/
	var bigIntToHex = (value) => {
		(0, assert_1.assert)(typeof value === "bigint", "Value must be a bigint.");
		(0, assert_1.assert)(value >= 0, "Value must be a non-negative bigint.");
		return (0, hex_1.add0x)(value.toString(16));
	};
	exports.bigIntToHex = bigIntToHex;
	/**
	* Convert a hexadecimal string to a number. This verifies that the string is a
	* valid hex string, and that the resulting number is a safe integer. Both
	* "0x"-prefixed and unprefixed strings are supported.
	*
	* To convert a hexadecimal string to a `bigint` instead, use
	* {@link hexToBigInt}.
	*
	* @example
	* ```typescript
	* hexToNumber('0x0'); // 0
	* hexToNumber('0x1'); // 1
	* hexToNumber('0x10'); // 16
	* ```
	* @param value - The hexadecimal string to convert to a number.
	* @returns The number.
	* @throws If the value is not a valid hexadecimal string, or if the resulting
	* number is not a safe integer.
	*/
	var hexToNumber = (value) => {
		(0, hex_1.assertIsHexString)(value);
		const numberValue = parseInt(value, 16);
		(0, assert_1.assert)(Number.isSafeInteger(numberValue), "Value is not a safe integer. Use `hexToBigInt` instead.");
		return numberValue;
	};
	exports.hexToNumber = hexToNumber;
	/**
	* Convert a hexadecimal string to a `bigint`. This verifies that the string is
	* a valid hex string. Both "0x"-prefixed and unprefixed strings are supported.
	*
	* To convert a hexadecimal string to a number instead, use {@link hexToNumber}.
	*
	* @example
	* ```typescript
	* hexToBigInt('0x0'); // 0n
	* hexToBigInt('0x1'); // 1n
	* hexToBigInt('0x10'); // 16n
	* ```
	* @param value - The hexadecimal string to convert to a `bigint`.
	* @returns The `bigint`.
	* @throws If the value is not a valid hexadecimal string.
	*/
	var hexToBigInt = (value) => {
		(0, hex_1.assertIsHexString)(value);
		return BigInt((0, hex_1.add0x)(value));
	};
	exports.hexToBigInt = hexToBigInt;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/opaque.js
var require_opaque = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/time.js
var require_time = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timeSince = exports.inMilliseconds = exports.Duration = void 0;
	(function(Duration) {
		/**
		* A millisecond.
		*/
		Duration[Duration["Millisecond"] = 1] = "Millisecond";
		/**
		* A second, in milliseconds.
		*/
		Duration[Duration["Second"] = 1e3] = "Second";
		/**
		* A minute, in milliseconds.
		*/
		Duration[Duration["Minute"] = 6e4] = "Minute";
		/**
		* An hour, in milliseconds.
		*/
		Duration[Duration["Hour"] = 36e5] = "Hour";
		/**
		* A day, in milliseconds.
		*/
		Duration[Duration["Day"] = 864e5] = "Day";
		/**
		* A week, in milliseconds.
		*/
		Duration[Duration["Week"] = 6048e5] = "Week";
		/**
		* A year, in milliseconds.
		*/
		Duration[Duration["Year"] = 31536e6] = "Year";
	})(exports.Duration || (exports.Duration = {}));
	var isNonNegativeInteger = (number) => Number.isInteger(number) && number >= 0;
	var assertIsNonNegativeInteger = (number, name) => {
		if (!isNonNegativeInteger(number)) throw new Error(`"${name}" must be a non-negative integer. Received: "${number}".`);
	};
	/**
	* Calculates the millisecond value of the specified number of units of time.
	*
	* @param count - The number of units of time.
	* @param duration - The unit of time to count.
	* @returns The count multiplied by the specified duration.
	*/
	function inMilliseconds(count, duration) {
		assertIsNonNegativeInteger(count, "count");
		return count * duration;
	}
	exports.inMilliseconds = inMilliseconds;
	/**
	* Gets the milliseconds since a particular Unix epoch timestamp.
	*
	* @param timestamp - A Unix millisecond timestamp.
	* @returns The number of milliseconds elapsed since the specified timestamp.
	*/
	function timeSince(timestamp) {
		assertIsNonNegativeInteger(timestamp, "timestamp");
		return Date.now() - timestamp;
	}
	exports.timeSince = timeSince;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/transaction-types.js
var require_transaction_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 
		/* istanbul ignore next */ 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	var debug = require_debug();
	exports = module.exports = {};
	var re = exports.re = [];
	var safeRe = exports.safeRe = [];
	var src = exports.src = [];
	var safeSrc = exports.safeSrc = [];
	var t = exports.t = {};
	var R = 0;
	var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	var safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	var makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	var createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var looseOption = Object.freeze({ loose: true });
	var emptyOpts = Object.freeze({});
	var parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var numeric = /^[0-9]+$/;
	var compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var debug = require_debug();
	var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	var { safeRe: re, t } = require_re();
	var parseOptions = require_parse_options();
	var { compareIdentifiers } = require_identifiers();
	var isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) {
				if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
				else version = version.version;
			} else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parse = require_parse();
	var valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parse = require_parse();
	var clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parse = require_parse();
	var diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parse = require_parse();
	var prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compareBuild = require_compare_build();
	var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compareBuild = require_compare_build();
	var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compare = require_compare();
	var lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var eq = require_eq();
	var neq = require_neq();
	var gt = require_gt();
	var gte = require_gte();
	var lt = require_lt();
	var lte = require_lte();
	var cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var parse = require_parse();
	var { safeRe: re, t } = require_re();
	var coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		return parse(`${major}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/truncate.js
var require_truncate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var parse = require_parse();
	var constants = require_constants();
	var SemVer = require_semver$1();
	var truncate = (version, truncation, options) => {
		if (!constants.RELEASE_TYPES.includes(truncation)) return null;
		const clonedVersion = cloneInputVersion(version, options);
		return clonedVersion && doTruncation(clonedVersion, truncation);
	};
	var cloneInputVersion = (version, options) => {
		return parse(version instanceof SemVer ? version.version : version, options);
	};
	var doTruncation = (version, truncation) => {
		if (isPrerelease(truncation)) return version.version;
		version.prerelease = [];
		switch (truncation) {
			case "major":
				version.minor = 0;
				version.patch = 0;
				break;
			case "minor": version.patch = 0;
		}
		return version.format();
	};
	var isPrerelease = (type) => {
		return type.startsWith("pre");
	};
	module.exports = truncate;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) {
				if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
				else return new Range(range.raw, options);
			}
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	var cache = new (require_lrucache())();
	var parseOptions = require_parse_options();
	var Comparator = require_comparator();
	var debug = require_debug();
	var SemVer = require_semver$1();
	var { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	var isNullSet = (c) => c.value === "<0.0.0-0";
	var isAny = (c) => c.value === "";
	var isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	var parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	var replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	var replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	var replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	var replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) {
				if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			} else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	var replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	var replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) {
				if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
				else ret = "*";
			} else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	var replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	var replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	var testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) {
				if (comp.loose === !!options.loose) return comp;
				else comp = comp.value;
			}
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	var parseOptions = require_parse_options();
	var { safeRe: re, t } = require_re();
	var cmp = require_cmp();
	var debug = require_debug();
	var SemVer = require_semver$1();
	var Range = require_range();
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Range = require_range();
	var satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Range = require_range();
	var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var Range = require_range();
	var maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var Range = require_range();
	var minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var Range = require_range();
	var gt = require_gt();
	var minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Range = require_range();
	var validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SemVer = require_semver$1();
	var Comparator = require_comparator();
	var { ANY } = Comparator;
	var Range = require_range();
	var satisfies = require_satisfies();
	var gt = require_gt();
	var lt = require_lt();
	var lte = require_lte();
	var gte = require_gte();
	var outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var outside = require_outside();
	var gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var outside = require_outside();
	var ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Range = require_range();
	var intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var satisfies = require_satisfies();
	var compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Range = require_range();
	var Comparator = require_comparator();
	var { ANY } = Comparator;
	var satisfies = require_satisfies();
	var compare = require_compare();
	var subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	var minimumVersion = [new Comparator(">=0.0.0")];
	var simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) {
			if (dom.length === 1 && dom[0].semver === ANY) return true;
			else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
			else sub = minimumVersion;
		}
		if (dom.length === 1 && dom[0].semver === ANY) {
			if (options.includePrerelease) return true;
			else dom = minimumVersion;
		}
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !c.test(gt.semver)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !c.test(lt.semver)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	var higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	var lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var internalRe = require_re();
	var constants = require_constants();
	var SemVer = require_semver$1();
	var identifiers = require_identifiers();
	module.exports = {
		parse: require_parse(),
		valid: require_valid$1(),
		clean: require_clean(),
		inc: require_inc(),
		diff: require_diff(),
		major: require_major(),
		minor: require_minor(),
		patch: require_patch(),
		prerelease: require_prerelease(),
		compare: require_compare(),
		rcompare: require_rcompare(),
		compareLoose: require_compare_loose(),
		compareBuild: require_compare_build(),
		sort: require_sort(),
		rsort: require_rsort(),
		gt: require_gt(),
		lt: require_lt(),
		eq: require_eq(),
		neq: require_neq(),
		gte: require_gte(),
		lte: require_lte(),
		cmp: require_cmp(),
		coerce: require_coerce(),
		truncate: require_truncate(),
		Comparator: require_comparator(),
		Range: require_range(),
		satisfies: require_satisfies(),
		toComparators: require_to_comparators(),
		maxSatisfying: require_max_satisfying(),
		minSatisfying: require_min_satisfying(),
		minVersion: require_min_version(),
		validRange: require_valid(),
		outside: require_outside(),
		gtr: require_gtr(),
		ltr: require_ltr(),
		intersects: require_intersects(),
		simplifyRange: require_simplify(),
		subset: require_subset(),
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/versions.js
var require_versions = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.satisfiesVersionRange = exports.gtRange = exports.gtVersion = exports.assertIsSemVerRange = exports.assertIsSemVerVersion = exports.isValidSemVerRange = exports.isValidSemVerVersion = exports.VersionRangeStruct = exports.VersionStruct = void 0;
	var semver_1 = require_semver();
	var superstruct_1 = (init_dist(), __toCommonJS(dist_exports));
	var assert_1 = require_assert();
	/**
	* A struct for validating a version string.
	*/
	exports.VersionStruct = (0, superstruct_1.refine)((0, superstruct_1.string)(), "Version", (value) => {
		if ((0, semver_1.valid)(value) === null) return `Expected SemVer version, got "${value}"`;
		return true;
	});
	exports.VersionRangeStruct = (0, superstruct_1.refine)((0, superstruct_1.string)(), "Version range", (value) => {
		if ((0, semver_1.validRange)(value) === null) return `Expected SemVer range, got "${value}"`;
		return true;
	});
	/**
	* Checks whether a SemVer version is valid.
	*
	* @param version - A potential version.
	* @returns `true` if the version is valid, and `false` otherwise.
	*/
	function isValidSemVerVersion(version) {
		return (0, superstruct_1.is)(version, exports.VersionStruct);
	}
	exports.isValidSemVerVersion = isValidSemVerVersion;
	/**
	* Checks whether a SemVer version range is valid.
	*
	* @param versionRange - A potential version range.
	* @returns `true` if the version range is valid, and `false` otherwise.
	*/
	function isValidSemVerRange(versionRange) {
		return (0, superstruct_1.is)(versionRange, exports.VersionRangeStruct);
	}
	exports.isValidSemVerRange = isValidSemVerRange;
	/**
	* Asserts that a value is a valid concrete SemVer version.
	*
	* @param version - A potential SemVer concrete version.
	*/
	function assertIsSemVerVersion(version) {
		(0, assert_1.assertStruct)(version, exports.VersionStruct);
	}
	exports.assertIsSemVerVersion = assertIsSemVerVersion;
	/**
	* Asserts that a value is a valid SemVer range.
	*
	* @param range - A potential SemVer range.
	*/
	function assertIsSemVerRange(range) {
		(0, assert_1.assertStruct)(range, exports.VersionRangeStruct);
	}
	exports.assertIsSemVerRange = assertIsSemVerRange;
	/**
	* Checks whether a SemVer version is greater than another.
	*
	* @param version1 - The left-hand version.
	* @param version2 - The right-hand version.
	* @returns `version1 > version2`.
	*/
	function gtVersion(version1, version2) {
		return (0, semver_1.gt)(version1, version2);
	}
	exports.gtVersion = gtVersion;
	/**
	* Checks whether a SemVer version is greater than all possibilities in a range.
	*
	* @param version - A SemvVer version.
	* @param range - The range to check against.
	* @returns `version > range`.
	*/
	function gtRange(version, range) {
		return (0, semver_1.gtr)(version, range);
	}
	exports.gtRange = gtRange;
	/**
	* Returns whether a SemVer version satisfies a SemVer range.
	*
	* @param version - The SemVer version to check.
	* @param versionRange - The SemVer version range to check against.
	* @returns Whether the version satisfied the version range.
	*/
	function satisfiesVersionRange(version, versionRange) {
		return (0, semver_1.satisfies)(version, versionRange, { includePrerelease: true });
	}
	exports.satisfiesVersionRange = satisfiesVersionRange;
}));
//#endregion
//#region node_modules/eth-block-tracker/node_modules/@metamask/utils/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_assert(), exports);
	__exportStar(require_base64(), exports);
	__exportStar(require_bytes(), exports);
	__exportStar(require_checksum(), exports);
	__exportStar(require_coercers(), exports);
	__exportStar(require_collections(), exports);
	__exportStar(require_encryption_types(), exports);
	__exportStar(require_hex(), exports);
	__exportStar(require_json(), exports);
	__exportStar(require_keyring(), exports);
	__exportStar(require_logging(), exports);
	__exportStar(require_misc(), exports);
	__exportStar(require_number(), exports);
	__exportStar(require_opaque(), exports);
	__exportStar(require_time(), exports);
	__exportStar(require_transaction_types(), exports);
	__exportStar(require_versions(), exports);
}));
//#endregion
export { require_dist as t };
