import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/async-mutex/lib/Semaphore.js
var require_Semaphore = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$2 = __require("tslib");
	exports.default = function() {
		function Semaphore(_maxConcurrency) {
			this._maxConcurrency = _maxConcurrency;
			this._queue = [];
			if (_maxConcurrency <= 0) throw new Error("semaphore must be initialized to a positive value");
			this._value = _maxConcurrency;
		}
		Semaphore.prototype.acquire = function() {
			var _this = this;
			var locked = this.isLocked();
			var ticket = new Promise(function(r) {
				return _this._queue.push(r);
			});
			if (!locked) this._dispatch();
			return ticket;
		};
		Semaphore.prototype.runExclusive = function(callback) {
			return tslib_1$2.__awaiter(this, void 0, void 0, function() {
				var _a, value, release;
				return tslib_1$2.__generator(this, function(_b) {
					switch (_b.label) {
						case 0: return [4, this.acquire()];
						case 1:
							_a = _b.sent(), value = _a[0], release = _a[1];
							_b.label = 2;
						case 2:
							_b.trys.push([
								2,
								,
								4,
								5
							]);
							return [4, callback(value)];
						case 3: return [2, _b.sent()];
						case 4:
							release();
							return [7];
						case 5: return [2];
					}
				});
			});
		};
		Semaphore.prototype.isLocked = function() {
			return this._value <= 0;
		};
		Semaphore.prototype.release = function() {
			if (this._maxConcurrency > 1) throw new Error("this method is unavailabel on semaphores with concurrency > 1; use the scoped release returned by acquire instead");
			if (this._currentReleaser) {
				var releaser = this._currentReleaser;
				this._currentReleaser = void 0;
				releaser();
			}
		};
		Semaphore.prototype._dispatch = function() {
			var _this = this;
			var nextConsumer = this._queue.shift();
			if (!nextConsumer) return;
			var released = false;
			this._currentReleaser = function() {
				if (released) return;
				released = true;
				_this._value++;
				_this._dispatch();
			};
			nextConsumer([this._value--, this._currentReleaser]);
		};
		return Semaphore;
	}();
}));
//#endregion
//#region node_modules/async-mutex/lib/Mutex.js
var require_Mutex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$1 = __require("tslib");
	var Semaphore_1 = require_Semaphore();
	exports.default = function() {
		function Mutex() {
			this._semaphore = new Semaphore_1.default(1);
		}
		Mutex.prototype.acquire = function() {
			return tslib_1$1.__awaiter(this, void 0, void 0, function() {
				var _a, releaser;
				return tslib_1$1.__generator(this, function(_b) {
					switch (_b.label) {
						case 0: return [4, this._semaphore.acquire()];
						case 1:
							_a = _b.sent(), releaser = _a[1];
							return [2, releaser];
					}
				});
			});
		};
		Mutex.prototype.runExclusive = function(callback) {
			return this._semaphore.runExclusive(function() {
				return callback();
			});
		};
		Mutex.prototype.isLocked = function() {
			return this._semaphore.isLocked();
		};
		Mutex.prototype.release = function() {
			this._semaphore.release();
		};
		return Mutex;
	}();
}));
//#endregion
//#region node_modules/async-mutex/lib/withTimeout.js
var require_withTimeout = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.withTimeout = void 0;
	var tslib_1 = __require("tslib");
	function withTimeout(sync, timeout, timeoutError) {
		var _this = this;
		if (timeoutError === void 0) timeoutError = /* @__PURE__ */ new Error("timeout");
		return {
			acquire: function() {
				return new Promise(function(resolve, reject) {
					return tslib_1.__awaiter(_this, void 0, void 0, function() {
						var isTimeout, ticket, release;
						return tslib_1.__generator(this, function(_a) {
							switch (_a.label) {
								case 0:
									isTimeout = false;
									setTimeout(function() {
										isTimeout = true;
										reject(timeoutError);
									}, timeout);
									return [4, sync.acquire()];
								case 1:
									ticket = _a.sent();
									if (isTimeout) {
										release = Array.isArray(ticket) ? ticket[1] : ticket;
										release();
									} else resolve(ticket);
									return [2];
							}
						});
					});
				});
			},
			runExclusive: function(callback) {
				return tslib_1.__awaiter(this, void 0, void 0, function() {
					var release, ticket;
					return tslib_1.__generator(this, function(_a) {
						switch (_a.label) {
							case 0:
								release = function() {};
								_a.label = 1;
							case 1:
								_a.trys.push([
									1,
									,
									7,
									8
								]);
								return [4, this.acquire()];
							case 2:
								ticket = _a.sent();
								if (!Array.isArray(ticket)) return [3, 4];
								release = ticket[1];
								return [4, callback(ticket[0])];
							case 3: return [2, _a.sent()];
							case 4:
								release = ticket;
								return [4, callback()];
							case 5: return [2, _a.sent()];
							case 6: return [3, 8];
							case 7:
								release();
								return [7];
							case 8: return [2];
						}
					});
				});
			},
			release: function() {
				sync.release();
			},
			isLocked: function() {
				return sync.isLocked();
			}
		};
	}
	exports.withTimeout = withTimeout;
}));
//#endregion
//#region node_modules/async-mutex/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.withTimeout = exports.Semaphore = exports.Mutex = void 0;
	var Mutex_1 = require_Mutex();
	Object.defineProperty(exports, "Mutex", {
		enumerable: true,
		get: function() {
			return Mutex_1.default;
		}
	});
	var Semaphore_1 = require_Semaphore();
	Object.defineProperty(exports, "Semaphore", {
		enumerable: true,
		get: function() {
			return Semaphore_1.default;
		}
	});
	var withTimeout_1 = require_withTimeout();
	Object.defineProperty(exports, "withTimeout", {
		enumerable: true,
		get: function() {
			return withTimeout_1.withTimeout;
		}
	});
}));
//#endregion
export { require_lib as t };
