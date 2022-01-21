import { p as prand, u as uniformIntDistribution, a as uniformBigIntDistribution, s as skipN } from './common/pure-rand-default-ca59a611.js';
import { g as global } from './common/_polyfill-node:global-acbc543a.js';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PreconditionFailure = (function (_super) {
    __extends(PreconditionFailure, _super);
    function PreconditionFailure() {
        var _this = _super.call(this) || this;
        _this.footprint = PreconditionFailure.SharedFootPrint;
        return _this;
    }
    PreconditionFailure.isFailure = function (err) {
        return err != null && err.footprint === PreconditionFailure.SharedFootPrint;
    };
    PreconditionFailure.SharedFootPrint = Symbol["for"]('fast-check/PreconditionFailure');
    return PreconditionFailure;
}(Error));

var pre = function (expectTruthy) {
    if (!expectTruthy) {
        throw new PreconditionFailure();
    }
};

var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var Nil = (function () {
    function Nil() {
    }
    Nil.prototype[Symbol.iterator] = function () {
        return this;
    };
    Nil.prototype.next = function (value) {
        return { value: value, done: true };
    };
    Nil.nil = new Nil();
    return Nil;
}());
function nilHelper() {
    return Nil.nil;
}
function mapHelper(g, f) {
    var e_1, _a, g_1, g_1_1, v, e_1_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_1 = __values(g), g_1_1 = g_1.next();
                _b.label = 1;
            case 1:
                if (!!g_1_1.done) return [3, 4];
                v = g_1_1.value;
                return [4, f(v)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_1_1 = g_1.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_1_1 && !g_1_1.done && (_a = g_1["return"])) _a.call(g_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function flatMapHelper(g, f) {
    var e_2, _a, g_2, g_2_1, v, e_2_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_2 = __values(g), g_2_1 = g_2.next();
                _b.label = 1;
            case 1:
                if (!!g_2_1.done) return [3, 4];
                v = g_2_1.value;
                return [5, __values(f(v))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_2_1 = g_2.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_2_1 && !g_2_1.done && (_a = g_2["return"])) _a.call(g_2);
                }
                finally { if (e_2) throw e_2.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function filterHelper(g, f) {
    var e_3, _a, g_3, g_3_1, v, e_3_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, 6, 7]);
                g_3 = __values(g), g_3_1 = g_3.next();
                _b.label = 1;
            case 1:
                if (!!g_3_1.done) return [3, 4];
                v = g_3_1.value;
                if (!f(v)) return [3, 3];
                return [4, v];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                g_3_1 = g_3.next();
                return [3, 1];
            case 4: return [3, 7];
            case 5:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3, 7];
            case 6:
                try {
                    if (g_3_1 && !g_3_1.done && (_a = g_3["return"])) _a.call(g_3);
                }
                finally { if (e_3) throw e_3.error; }
                return [7];
            case 7: return [2];
        }
    });
}
function takeWhileHelper(g, f) {
    var cur;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cur = g.next();
                _a.label = 1;
            case 1:
                if (!(!cur.done && f(cur.value))) return [3, 3];
                return [4, cur.value];
            case 2:
                _a.sent();
                cur = g.next();
                return [3, 1];
            case 3: return [2];
        }
    });
}
function joinHelper(g, others) {
    var e_4, _a, cur, others_1, others_1_1, s, cur, e_4_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cur = g.next();
                _b.label = 1;
            case 1:
                if (!!cur.done) return [3, 4];
                return [4, cur.value];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                cur = g.next();
                return [3, 1];
            case 4:
                _b.trys.push([4, 11, 12, 13]);
                others_1 = __values(others), others_1_1 = others_1.next();
                _b.label = 5;
            case 5:
                if (!!others_1_1.done) return [3, 10];
                s = others_1_1.value;
                cur = s.next();
                _b.label = 6;
            case 6:
                if (!!cur.done) return [3, 9];
                return [4, cur.value];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                cur = s.next();
                return [3, 6];
            case 9:
                others_1_1 = others_1.next();
                return [3, 5];
            case 10: return [3, 13];
            case 11:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3, 13];
            case 12:
                try {
                    if (others_1_1 && !others_1_1.done && (_a = others_1["return"])) _a.call(others_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7];
            case 13: return [2];
        }
    });
}

var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values$1 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var Stream = (function () {
    function Stream(g) {
        this.g = g;
    }
    Stream.nil = function () {
        return new Stream(nilHelper());
    };
    Stream.prototype.next = function () {
        return this.g.next();
    };
    Stream.prototype[Symbol.iterator] = function () {
        return this.g;
    };
    Stream.prototype.map = function (f) {
        return new Stream(mapHelper(this.g, f));
    };
    Stream.prototype.flatMap = function (f) {
        return new Stream(flatMapHelper(this.g, f));
    };
    Stream.prototype.dropWhile = function (f) {
        var foundEligible = false;
        function helper(v) {
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(foundEligible || !f(v))) return [3, 2];
                        foundEligible = true;
                        return [4, v];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }
        return this.flatMap(helper);
    };
    Stream.prototype.drop = function (n) {
        var idx = 0;
        function helper(v) {
            return idx++ < n;
        }
        return this.dropWhile(helper);
    };
    Stream.prototype.takeWhile = function (f) {
        return new Stream(takeWhileHelper(this.g, f));
    };
    Stream.prototype.take = function (n) {
        var idx = 0;
        function helper(v) {
            return idx++ < n;
        }
        return this.takeWhile(helper);
    };
    Stream.prototype.filter = function (f) {
        return new Stream(filterHelper(this.g, f));
    };
    Stream.prototype.every = function (f) {
        var e_1, _a;
        try {
            for (var _b = __values$1(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (!f(v)) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    Stream.prototype.has = function (f) {
        var e_2, _a;
        try {
            for (var _b = __values$1(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (f(v)) {
                    return [true, v];
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return [false, null];
    };
    Stream.prototype.join = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        return new Stream(joinHelper(this.g, others));
    };
    Stream.prototype.getNthOrLast = function (nth) {
        var e_3, _a;
        var remaining = nth;
        var last = null;
        try {
            for (var _b = __values$1(this.g), _c = _b.next(); !_c.done; _c = _b.next()) {
                var v = _c.value;
                if (remaining-- === 0)
                    return v;
                last = v;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return last;
    };
    return Stream;
}());
function stream(g) {
    return new Stream(g);
}

var cloneMethod = Symbol["for"]('fast-check/cloneMethod');
var hasCloneMethod = function (instance) {
    return instance instanceof Object && typeof instance[cloneMethod] === 'function';
};

var Shrinkable = (function () {
    function Shrinkable(value_, shrink) {
        if (shrink === void 0) { shrink = function () { return Stream.nil(); }; }
        this.value_ = value_;
        this.shrink = shrink;
        this.hasToBeCloned = hasCloneMethod(value_);
        this.readOnce = false;
        Object.defineProperty(this, 'value', { get: this.getValue });
    }
    Shrinkable.prototype.getValue = function () {
        if (this.hasToBeCloned) {
            if (!this.readOnce) {
                this.readOnce = true;
                return this.value_;
            }
            return this.value_[cloneMethod]();
        }
        return this.value_;
    };
    Shrinkable.prototype.applyMapper = function (mapper) {
        var _this = this;
        if (this.hasToBeCloned) {
            var out = mapper(this.value);
            if (out instanceof Object) {
                out[cloneMethod] = function () { return mapper(_this.value); };
            }
            return out;
        }
        return mapper(this.value);
    };
    Shrinkable.prototype.map = function (mapper) {
        var _this = this;
        return new Shrinkable(this.applyMapper(mapper), function () { return _this.shrink().map(function (v) { return v.map(mapper); }); });
    };
    Shrinkable.prototype.filter = function (predicate) {
        var _this = this;
        return new Shrinkable(this.value, function () {
            return _this.shrink()
                .filter(function (v) { return predicate(v.value); })
                .map(function (v) { return v.filter(predicate); });
        });
    };
    return Shrinkable;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Arbitrary = (function () {
    function Arbitrary() {
    }
    Arbitrary.prototype.filter = function (predicate) {
        var arb = this;
        return new (function (_super) {
            __extends$1(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.generate = function (mrng) {
                var g = arb.generate(mrng);
                while (!predicate(g.value)) {
                    g = arb.generate(mrng);
                }
                return g.filter(predicate);
            };
            class_1.prototype.withBias = function (freq) {
                return arb.withBias(freq).filter(predicate);
            };
            return class_1;
        }(Arbitrary))();
    };
    Arbitrary.prototype.map = function (mapper) {
        var arb = this;
        return new (function (_super) {
            __extends$1(class_2, _super);
            function class_2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_2.prototype.generate = function (mrng) {
                return arb.generate(mrng).map(mapper);
            };
            class_2.prototype.withBias = function (freq) {
                return arb.withBias(freq).map(mapper);
            };
            return class_2;
        }(Arbitrary))();
    };
    Arbitrary.shrinkChain = function (mrng, src, dst, fmapper) {
        return new Shrinkable(dst.value, function () {
            return src
                .shrink()
                .map(function (v) {
                return Arbitrary.shrinkChain(mrng.clone(), v, fmapper(v.value).generate(mrng.clone()), fmapper);
            })
                .join(dst.shrink());
        });
    };
    Arbitrary.prototype.chain = function (fmapper) {
        var arb = this;
        return new (function (_super) {
            __extends$1(class_3, _super);
            function class_3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_3.prototype.generate = function (mrng) {
                var clonedMrng = mrng.clone();
                var src = arb.generate(mrng);
                var dst = fmapper(src.value).generate(mrng);
                return Arbitrary.shrinkChain(clonedMrng, src, dst, fmapper);
            };
            class_3.prototype.withBias = function (freq) {
                return arb.withBias(freq).chain(function (t) { return fmapper(t).withBias(freq); });
            };
            return class_3;
        }(Arbitrary))();
    };
    Arbitrary.prototype.noShrink = function () {
        var arb = this;
        return new (function (_super) {
            __extends$1(class_4, _super);
            function class_4() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_4.prototype.generate = function (mrng) {
                return new Shrinkable(arb.generate(mrng).value);
            };
            class_4.prototype.withBias = function (freq) {
                return arb.withBias(freq).noShrink();
            };
            return class_4;
        }(Arbitrary))();
    };
    Arbitrary.prototype.withBias = function (freq) {
        return this;
    };
    Arbitrary.prototype.noBias = function () {
        var arb = this;
        return new (function (_super) {
            __extends$1(class_5, _super);
            function class_5() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_5.prototype.generate = function (mrng) {
                return arb.generate(mrng);
            };
            return class_5;
        }(Arbitrary))();
    };
    return Arbitrary;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GenericTupleArbitrary = (function (_super) {
    __extends$2(GenericTupleArbitrary, _super);
    function GenericTupleArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        for (var idx = 0; idx !== arbs.length; ++idx) {
            var arb = arbs[idx];
            if (arb == null || arb.generate == null)
                throw new Error("Invalid parameter encountered at index " + idx + ": expecting an Arbitrary");
        }
        return _this;
    }
    GenericTupleArbitrary.makeItCloneable = function (vs, shrinkables) {
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            GenericTupleArbitrary.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    GenericTupleArbitrary.wrapper = function (shrinkables) {
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== shrinkables.length; ++idx) {
            var s = shrinkables[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            GenericTupleArbitrary.makeItCloneable(vs, shrinkables);
        }
        return new Shrinkable(vs, function () { return GenericTupleArbitrary.shrinkImpl(shrinkables).map(GenericTupleArbitrary.wrapper); });
    };
    GenericTupleArbitrary.prototype.generate = function (mrng) {
        return GenericTupleArbitrary.wrapper(this.arbs.map(function (a) { return a.generate(mrng); }));
    };
    GenericTupleArbitrary.shrinkImpl = function (value) {
        var s = Stream.nil();
        var _loop_1 = function (idx) {
            s = s.join(value[idx].shrink().map(function (v) {
                return value
                    .slice(0, idx)
                    .concat([v])
                    .concat(value.slice(idx + 1));
            }));
        };
        for (var idx = 0; idx !== value.length; ++idx) {
            _loop_1(idx);
        }
        return s;
    };
    GenericTupleArbitrary.prototype.withBias = function (freq) {
        return new GenericTupleArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return GenericTupleArbitrary;
}(Arbitrary));
function genericTuple(arbs) {
    return new GenericTupleArbitrary(arbs);
}

function tuple() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    return new GenericTupleArbitrary(arbs);
}

var runIdToFrequency = function (runId) { return 2 + Math.floor(Math.log(runId + 1) / Math.log(10)); };

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = undefined;
var AsyncProperty = (function () {
    function AsyncProperty(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = AsyncProperty.dummyHook;
        this.afterEachHook = AsyncProperty.dummyHook;
        this.isAsync = function () { return true; };
    }
    AsyncProperty.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    AsyncProperty.prototype.run = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            var output, err_1;
            return __generator$2(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.beforeEachHook()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 7]);
                        return [4, this.predicate(v)];
                    case 3:
                        output = _a.sent();
                        return [2, output == null || output === true ? null : 'Property failed by returning false'];
                    case 4:
                        err_1 = _a.sent();
                        if (PreconditionFailure.isFailure(err_1))
                            return [2, err_1];
                        if (err_1 instanceof Error && err_1.stack)
                            return [2, err_1 + "\n\nStack trace: " + err_1.stack];
                        return [2, "" + err_1];
                    case 5: return [4, this.afterEachHook()];
                    case 6:
                        _a.sent();
                        return [7];
                    case 7: return [2];
                }
            });
        });
    };
    AsyncProperty.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    AsyncProperty.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    AsyncProperty.dummyHook = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator$2(this, function (_a) {
            return [2];
        });
    }); };
    return AsyncProperty;
}());

var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
function asyncProperty() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('asyncProperty expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new AsyncProperty(genericTuple(arbs), function (t) { return p.apply(void 0, __spread(t)); });
}

var Property = (function () {
    function Property(arb, predicate) {
        this.arb = arb;
        this.predicate = predicate;
        this.beforeEachHook = Property.dummyHook;
        this.afterEachHook = Property.dummyHook;
        this.isAsync = function () { return false; };
    }
    Property.prototype.generate = function (mrng, runId) {
        return runId != null ? this.arb.withBias(runIdToFrequency(runId)).generate(mrng) : this.arb.generate(mrng);
    };
    Property.prototype.run = function (v) {
        this.beforeEachHook();
        try {
            var output = this.predicate(v);
            return output == null || output === true ? null : 'Property failed by returning false';
        }
        catch (err) {
            if (PreconditionFailure.isFailure(err))
                return err;
            if (err instanceof Error && err.stack)
                return err + "\n\nStack trace: " + err.stack;
            return "" + err;
        }
        finally {
            this.afterEachHook();
        }
    };
    Property.prototype.beforeEach = function (hookFunction) {
        this.beforeEachHook = hookFunction;
        return this;
    };
    Property.prototype.afterEach = function (hookFunction) {
        this.afterEachHook = hookFunction;
        return this;
    };
    Property.dummyHook = function () {
        return;
    };
    return Property;
}());

var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$1 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$1(arguments[i]));
    return ar;
};
function property() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2)
        throw new Error('property expects at least two parameters');
    var arbs = args.slice(0, args.length - 1);
    var p = args[args.length - 1];
    return new Property(genericTuple(arbs), function (t) { return p.apply(void 0, __spread$1(t)); });
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this$1 = undefined;
var timeoutAfter = function (timeMs) { return __awaiter$1(_this$1, void 0, void 0, function () {
    return __generator$3(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                return setTimeout(function () {
                    resolve("Property timeout: exceeded limit of " + timeMs + " milliseconds");
                }, timeMs);
            })];
    });
}); };
var TimeoutProperty = (function () {
    function TimeoutProperty(property, timeMs) {
        this.property = property;
        this.timeMs = timeMs;
        this.isAsync = function () { return true; };
    }
    TimeoutProperty.prototype.generate = function (mrng, runId) {
        return this.property.generate(mrng, runId);
    };
    TimeoutProperty.prototype.run = function (v) {
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator$3(this, function (_a) {
                return [2, Promise.race([this.property.run(v), timeoutAfter(this.timeMs)])];
            });
        });
    };
    return TimeoutProperty;
}());

var UnbiasedProperty = (function () {
    function UnbiasedProperty(property) {
        var _this = this;
        this.property = property;
        this.isAsync = function () { return _this.property.isAsync(); };
        this.generate = function (mrng, runId) { return _this.property.generate(mrng); };
        this.run = function (v) { return _this.property.run(v); };
    }
    return UnbiasedProperty;
}());

var VerbosityLevel;
(function (VerbosityLevel) {
    VerbosityLevel[VerbosityLevel["None"] = 0] = "None";
    VerbosityLevel[VerbosityLevel["Verbose"] = 1] = "Verbose";
    VerbosityLevel[VerbosityLevel["VeryVerbose"] = 2] = "VeryVerbose";
})(VerbosityLevel || (VerbosityLevel = {}));

var QualifiedParameters = (function () {
    function QualifiedParameters() {
    }
    QualifiedParameters.read = function (p) {
        return {
            seed: QualifiedParameters.readSeed(p),
            randomType: QualifiedParameters.readRandomType(p),
            numRuns: QualifiedParameters.readNumRuns(p),
            maxSkipsPerRun: QualifiedParameters.readMaxSkipsPerRun(p),
            timeout: QualifiedParameters.readTimeout(p),
            logger: QualifiedParameters.readLogger(p),
            path: QualifiedParameters.readPath(p),
            unbiased: QualifiedParameters.readUnbiased(p),
            verbose: QualifiedParameters.readVerbose(p),
            examples: QualifiedParameters.readExamples(p),
            endOnFailure: QualifiedParameters.readEndOnFailure(p)
        };
    };
    QualifiedParameters.readOrNumRuns = function (p) {
        if (p == null)
            return QualifiedParameters.read();
        if (typeof p === 'number')
            return QualifiedParameters.read({ numRuns: p });
        return QualifiedParameters.read(p);
    };
    QualifiedParameters.readSeed = function (p) {
        if (p == null || p.seed == null)
            return Date.now() ^ (Math.random() * 0x100000000);
        var seed32 = p.seed | 0;
        if (p.seed === seed32)
            return seed32;
        var gap = p.seed - seed32;
        return seed32 ^ (gap * 0x100000000);
    };
    QualifiedParameters.readRandomType = function (p) {
        if (p == null || p.randomType == null)
            return prand.xorshift128plus;
        if (typeof p.randomType === 'string') {
            switch (p.randomType) {
                case 'mersenne':
                    return prand.mersenne;
                case 'congruential':
                    return prand.congruential;
                case 'congruential32':
                    return prand.congruential32;
                case 'xorshift128plus':
                    return prand.xorshift128plus;
                default:
                    throw new Error("Invalid random specified: '" + p.randomType + "'");
            }
        }
        return p.randomType;
    };
    QualifiedParameters.readEndOnFailure = function (p) { return p != null && p.endOnFailure === true; };
    QualifiedParameters.readNumRuns = function (p) {
        var defaultValue = 100;
        if (p == null)
            return defaultValue;
        if (p.numRuns != null)
            return p.numRuns;
        if (p.num_runs != null)
            return p.num_runs;
        return defaultValue;
    };
    QualifiedParameters.readMaxSkipsPerRun = function (p) {
        return p != null && p.maxSkipsPerRun != null ? p.maxSkipsPerRun : 100;
    };
    QualifiedParameters.readTimeout = function (p) {
        return p != null && p.timeout != null ? p.timeout : null;
    };
    QualifiedParameters.readPath = function (p) { return (p != null && p.path != null ? p.path : ''); };
    QualifiedParameters.readUnbiased = function (p) { return p != null && p.unbiased === true; };
    QualifiedParameters.readVerbose = function (p) {
        if (p == null || p.verbose == null)
            return VerbosityLevel.None;
        if (typeof p.verbose === 'boolean') {
            return p.verbose === true ? VerbosityLevel.Verbose : VerbosityLevel.None;
        }
        if (p.verbose <= VerbosityLevel.None) {
            return VerbosityLevel.None;
        }
        if (p.verbose >= VerbosityLevel.VeryVerbose) {
            return VerbosityLevel.VeryVerbose;
        }
        return p.verbose | 0;
    };
    QualifiedParameters.readLogger = function (p) {
        if (p != null && p.logger != null)
            return p.logger;
        return function (v) {
            console.log(v);
        };
    };
    QualifiedParameters.readExamples = function (p) { return (p != null && p.examples != null ? p.examples : []); };
    return QualifiedParameters;
}());

var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus[ExecutionStatus["Success"] = 0] = "Success";
    ExecutionStatus[ExecutionStatus["Skipped"] = -1] = "Skipped";
    ExecutionStatus[ExecutionStatus["Failure"] = 1] = "Failure";
})(ExecutionStatus || (ExecutionStatus = {}));

var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$2 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$2(arguments[i]));
    return ar;
};
var RunExecution = (function () {
    function RunExecution(verbosity) {
        var _this = this;
        this.verbosity = verbosity;
        this.isSuccess = function () { return _this.pathToFailure == null; };
        this.firstFailure = function () { return (_this.pathToFailure ? +_this.pathToFailure.split(':')[0] : -1); };
        this.numShrinks = function () { return (_this.pathToFailure ? _this.pathToFailure.split(':').length - 1 : 0); };
        this.rootExecutionTrees = [];
        this.currentLevelExecutionTrees = this.rootExecutionTrees;
        this.numSkips = 0;
        this.numSuccesses = 0;
    }
    RunExecution.prototype.appendExecutionTree = function (status, value) {
        var currentTree = { status: status, value: value, children: [] };
        this.currentLevelExecutionTrees.push(currentTree);
        return currentTree;
    };
    RunExecution.prototype.fail = function (value, id, message) {
        if (this.verbosity >= VerbosityLevel.Verbose) {
            var currentTree = this.appendExecutionTree(ExecutionStatus.Failure, value);
            this.currentLevelExecutionTrees = currentTree.children;
        }
        if (this.pathToFailure == null)
            this.pathToFailure = "" + id;
        else
            this.pathToFailure += ":" + id;
        this.value = value;
        this.failure = message;
    };
    RunExecution.prototype.skip = function (value) {
        if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Skipped, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSkips;
        }
    };
    RunExecution.prototype.success = function (value) {
        if (this.verbosity >= VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus.Success, value);
        }
        if (this.pathToFailure == null) {
            ++this.numSuccesses;
        }
    };
    RunExecution.prototype.extractFailures = function () {
        if (this.isSuccess()) {
            return [];
        }
        var failures = [];
        var cursor = this.rootExecutionTrees;
        while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus.Failure) {
            var failureTree = cursor[cursor.length - 1];
            failures.push(failureTree.value);
            cursor = failureTree.children;
        }
        return failures;
    };
    RunExecution.prototype.toRunDetails = function (seed, basePath, numRuns, maxSkips) {
        if (!this.isSuccess()) {
            return {
                failed: true,
                numRuns: this.firstFailure() + 1 - this.numSkips,
                numSkips: this.numSkips,
                numShrinks: this.numShrinks(),
                seed: seed,
                counterexample: this.value,
                counterexamplePath: RunExecution.mergePaths(basePath, this.pathToFailure),
                error: this.failure,
                failures: this.extractFailures(),
                executionSummary: this.rootExecutionTrees,
                verbose: this.verbosity
            };
        }
        if (this.numSkips > maxSkips) {
            return {
                failed: true,
                numRuns: this.numSuccesses,
                numSkips: this.numSkips,
                numShrinks: 0,
                seed: seed,
                counterexample: null,
                counterexamplePath: null,
                error: null,
                failures: [],
                executionSummary: this.rootExecutionTrees,
                verbose: this.verbosity
            };
        }
        return {
            failed: false,
            numRuns: numRuns,
            numSkips: this.numSkips,
            numShrinks: 0,
            seed: seed,
            counterexample: null,
            counterexamplePath: null,
            error: null,
            failures: [],
            executionSummary: this.rootExecutionTrees,
            verbose: this.verbosity
        };
    };
    RunExecution.mergePaths = function (offsetPath, path) {
        if (offsetPath.length === 0)
            return path;
        var offsetItems = offsetPath.split(':');
        var remainingItems = path.split(':');
        var middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
        return __spread$2(offsetItems.slice(0, offsetItems.length - 1), ["" + middle], remainingItems.slice(1)).join(':');
    };
    return RunExecution;
}());

var RunnerIterator = (function () {
    function RunnerIterator(sourceValues, verbose) {
        this.sourceValues = sourceValues;
        this.runExecution = new RunExecution(verbose);
        this.currentIdx = -1;
        this.nextValues = sourceValues;
    }
    RunnerIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    RunnerIterator.prototype.next = function (value) {
        var nextValue = this.nextValues.next();
        if (nextValue.done) {
            return { done: true, value: value };
        }
        this.currentShrinkable = nextValue.value;
        ++this.currentIdx;
        return { done: false, value: nextValue.value.value_ };
    };
    RunnerIterator.prototype.handleResult = function (result) {
        if (result != null && typeof result === 'string') {
            this.runExecution.fail(this.currentShrinkable.value_, this.currentIdx, result);
            this.currentIdx = -1;
            this.nextValues = this.currentShrinkable.shrink();
        }
        else if (result != null) {
            this.runExecution.skip(this.currentShrinkable.value_);
            this.sourceValues.skippedOne();
        }
        else {
            this.runExecution.success(this.currentShrinkable.value_);
        }
    };
    return RunnerIterator;
}());

var SourceValuesIterator = (function () {
    function SourceValuesIterator(initialValues, maxInitialIterations, remainingSkips) {
        this.initialValues = initialValues;
        this.maxInitialIterations = maxInitialIterations;
        this.remainingSkips = remainingSkips;
    }
    SourceValuesIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    SourceValuesIterator.prototype.next = function (value) {
        if (--this.maxInitialIterations !== -1 && this.remainingSkips >= 0) {
            var n = this.initialValues.next();
            if (!n.done)
                return { value: n.value(), done: false };
        }
        return { value: value, done: true };
    };
    SourceValuesIterator.prototype.skippedOne = function () {
        --this.remainingSkips;
        ++this.maxInitialIterations;
    };
    return SourceValuesIterator;
}());

var Random = (function () {
    function Random(internalRng) {
        this.internalRng = internalRng;
    }
    Random.prototype.clone = function () {
        return new Random(this.internalRng);
    };
    Random.prototype.uniformIn = function (rangeMin, rangeMax) {
        var g = uniformIntDistribution(rangeMin, rangeMax, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.next = function (bits) {
        return this.uniformIn(0, (1 << bits) - 1);
    };
    Random.prototype.nextBoolean = function () {
        return this.uniformIn(0, 1) === 1;
    };
    Random.prototype.nextInt = function (min, max) {
        return this.uniformIn(min == null ? Random.MIN_INT : min, max == null ? Random.MAX_INT : max);
    };
    Random.prototype.nextBigInt = function (min, max) {
        var g = uniformBigIntDistribution(min, max, this.internalRng);
        this.internalRng = g[1];
        return g[0];
    };
    Random.prototype.nextDouble = function () {
        var a = this.next(26);
        var b = this.next(27);
        return (a * Random.DBL_FACTOR + b) * Random.DBL_DIVISOR;
    };
    Random.MIN_INT = 0x80000000 | 0;
    Random.MAX_INT = 0x7fffffff | 0;
    Random.DBL_FACTOR = Math.pow(2, 27);
    Random.DBL_DIVISOR = Math.pow(2, -53);
    return Random;
}());

var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values$2 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function lazyGenerate(generator, rng, idx) {
    return function () { return generator.generate(new Random(rng), idx); };
}
function toss(generator, seed, random, examples) {
    var idx, rng;
    return __generator$4(this, function (_a) {
        switch (_a.label) {
            case 0: return [5, __values$2(examples.map(function (e) { return function () { return new Shrinkable(e); }; }))];
            case 1:
                _a.sent();
                idx = 0;
                rng = random(seed);
                _a.label = 2;
            case 2:
                rng = skipN(rng, 42);
                return [4, lazyGenerate(generator, rng, idx++)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3, 2];
            case 5: return [2];
        }
    });
}

var __values$3 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function pathWalk(path, initialValues) {
    var e_1, _a;
    var values = stream(initialValues);
    var segments = path.split(':').map(function (text) { return +text; });
    if (segments.length === 0)
        return values;
    if (!segments.every(function (v) { return !Number.isNaN(v); })) {
        throw new Error("Unable to replay, got invalid path=" + path);
    }
    values = values.drop(segments[0]);
    try {
        for (var _b = __values$3(segments.slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var s = _c.value;
            var valueToShrink = values.getNthOrLast(0);
            if (valueToShrink == null) {
                throw new Error("Unable to replay, got wrong path=" + path);
            }
            values = valueToShrink.shrink().drop(s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return values;
}

function stringifyNumber(numValue) {
    switch (numValue) {
        case 0:
            return 1 / numValue === Number.NEGATIVE_INFINITY ? '-0' : '0';
        case Number.NEGATIVE_INFINITY:
            return 'Number.NEGATIVE_INFINITY';
        case Number.POSITIVE_INFINITY:
            return 'Number.POSITIVE_INFINITY';
        default:
            return numValue === numValue ? String(numValue) : 'Number.NaN';
    }
}
function stringifyInternal(value, previousValues) {
    var currentValues = previousValues.concat([value]);
    if (typeof value === 'object') {
        if (previousValues.indexOf(value) !== -1)
            return '[cyclic]';
    }
    switch (Object.prototype.toString.call(value)) {
        case '[object Array]':
            return "[" + value.map(function (v) { return stringifyInternal(v, currentValues); }).join(',') + "]";
        case '[object BigInt]':
            return value + "n";
        case '[object Boolean]':
            return typeof value === 'boolean' ? JSON.stringify(value) : "new Boolean(" + JSON.stringify(value) + ")";
        case '[object Map]':
            return "new Map(" + stringifyInternal(Array.from(value), currentValues) + ")";
        case '[object Null]':
            return "null";
        case '[object Number]':
            return typeof value === 'number' ? stringifyNumber(value) : "new Number(" + stringifyNumber(Number(value)) + ")";
        case '[object Object]':
            try {
                var defaultRepr = value.toString();
                if (defaultRepr !== '[object Object]')
                    return defaultRepr;
                return ('{' +
                    Object.keys(value)
                        .map(function (k) { return JSON.stringify(k) + ":" + stringifyInternal(value[k], currentValues); })
                        .join(',') +
                    '}');
            }
            catch (err) {
                return '[object Object]';
            }
        case '[object Set]':
            return "new Set(" + stringifyInternal(Array.from(value), currentValues) + ")";
        case '[object String]':
            return typeof value === 'string' ? JSON.stringify(value) : "new String(" + JSON.stringify(value) + ")";
        case '[object Undefined]':
            return "undefined";
        default:
            try {
                return value.toString();
            }
            catch (_a) {
                return Object.prototype.toString.call(value);
            }
    }
}
function stringify(value) {
    return stringifyInternal(value, []);
}

var __values$4 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function formatHints(hints) {
    if (hints.length === 1) {
        return "Hint: " + hints[0];
    }
    return hints.map(function (h, idx) { return "Hint (" + (idx + 1) + "): " + h; }).join('\n');
}
function formatFailures(failures) {
    return "Encountered failures were:\n- " + failures.map(stringify).join('\n- ');
}
function formatExecutionSummary(executionTrees) {
    var e_1, _a, e_2, _b;
    var summaryLines = [];
    var remainingTreesAndDepth = [];
    try {
        for (var _c = __values$4(executionTrees.reverse()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var tree = _d.value;
            remainingTreesAndDepth.push({ depth: 1, tree: tree });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    while (remainingTreesAndDepth.length !== 0) {
        var currentTreeAndDepth = remainingTreesAndDepth.pop();
        var currentTree = currentTreeAndDepth.tree;
        var currentDepth = currentTreeAndDepth.depth;
        var statusIcon = currentTree.status === ExecutionStatus.Success
            ? '\x1b[32m\u221A\x1b[0m'
            : currentTree.status === ExecutionStatus.Failure
                ? '\x1b[31m\xD7\x1b[0m'
                : '\x1b[33m!\x1b[0m';
        var leftPadding = Array(currentDepth).join('. ');
        summaryLines.push("" + leftPadding + statusIcon + " " + stringify(currentTree.value));
        try {
            for (var _e = __values$4(currentTree.children.reverse()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var tree = _f.value;
                remainingTreesAndDepth.push({ depth: currentDepth + 1, tree: tree });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return "Execution summary:\n" + summaryLines.join('\n');
}
function preFormatTooManySkipped(out) {
    var message = "Failed to run property, too many pre-condition failures encountered\n\nRan " + out.numRuns + " time(s)\nSkipped " + out.numSkips + " time(s)";
    var details = null;
    var hints = [
        'Try to reduce the number of rejected values by combining map, flatMap and built-in arbitraries',
        'Increase failure tolerance by setting maxSkipsPerRun to an higher value'
    ];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
        details = formatExecutionSummary(out.executionSummary);
    }
    else {
        hints.push('Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status');
    }
    return { message: message, details: details, hints: hints };
}
function preFormatFailure(out) {
    var message = "Property failed after " + out.numRuns + " tests\n{ seed: " + out.seed + ", path: \"" + out.counterexamplePath + "\", endOnFailure: true }\nCounterexample: " + stringify(out.counterexample) + "\nShrunk " + out.numShrinks + " time(s)\nGot error: " + out.error;
    var details = null;
    var hints = [];
    if (out.verbose >= VerbosityLevel.VeryVerbose) {
        details = formatExecutionSummary(out.executionSummary);
    }
    else if (out.verbose === VerbosityLevel.Verbose) {
        details = formatFailures(out.failures);
    }
    else {
        hints.push('Enable verbose mode in order to have the list of all failing values encountered during the run');
    }
    return { message: message, details: details, hints: hints };
}
function throwIfFailed(out) {
    if (!out.failed)
        return;
    var _a = out.counterexample == null ? preFormatTooManySkipped(out) : preFormatFailure(out), message = _a.message, details = _a.details, hints = _a.hints;
    var errorMessage = message;
    if (details != null)
        errorMessage += "\n\n" + details;
    if (hints.length > 0)
        errorMessage += "\n\n" + formatHints(hints);
    throw new Error(errorMessage);
}

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values$5 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read$3 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$3 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$3(arguments[i]));
    return ar;
};
function runIt(property, sourceValues, verbose) {
    var e_1, _a;
    var runner = new RunnerIterator(sourceValues, verbose);
    try {
        for (var runner_1 = __values$5(runner), runner_1_1 = runner_1.next(); !runner_1_1.done; runner_1_1 = runner_1.next()) {
            var v = runner_1_1.value;
            var out = property.run(v);
            runner.handleResult(out);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (runner_1_1 && !runner_1_1.done && (_a = runner_1["return"])) _a.call(runner_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return runner.runExecution;
}
function asyncRunIt(property, sourceValues, verbose) {
    return __awaiter$2(this, void 0, void 0, function () {
        var e_2, _a, runner, runner_2, runner_2_1, v, out, e_2_1;
        return __generator$5(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runner = new RunnerIterator(sourceValues, verbose);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    runner_2 = __values$5(runner), runner_2_1 = runner_2.next();
                    _b.label = 2;
                case 2:
                    if (!!runner_2_1.done) return [3, 5];
                    v = runner_2_1.value;
                    return [4, property.run(v)];
                case 3:
                    out = _b.sent();
                    runner.handleResult(out);
                    _b.label = 4;
                case 4:
                    runner_2_1 = runner_2.next();
                    return [3, 2];
                case 5: return [3, 8];
                case 6:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 8];
                case 7:
                    try {
                        if (runner_2_1 && !runner_2_1.done && (_a = runner_2["return"])) _a.call(runner_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7];
                case 8: return [2, runner.runExecution];
            }
        });
    });
}
function decorateProperty(rawProperty, qParams) {
    var propA = rawProperty.isAsync() && qParams.timeout != null ? new TimeoutProperty(rawProperty, qParams.timeout) : rawProperty;
    return qParams.unbiased === true ? new UnbiasedProperty(propA) : propA;
}
function runnerPathWalker(valueProducers, path) {
    var pathPoints = path.split(':');
    var pathStream = stream(valueProducers)
        .drop(pathPoints.length > 0 ? +pathPoints[0] : 0)
        .map(function (producer) { return producer(); });
    var adaptedPath = __spread$3(['0'], pathPoints.slice(1)).join(':');
    return stream(pathWalk(adaptedPath, pathStream)).map(function (v) { return function () { return v; }; });
}
function buildInitialValues(valueProducers, qParams) {
    var rawValues = qParams.path.length === 0 ? stream(valueProducers) : runnerPathWalker(valueProducers, qParams.path);
    if (!qParams.endOnFailure)
        return rawValues;
    return rawValues.map(function (shrinkableGen) {
        return function () {
            var s = shrinkableGen();
            return new Shrinkable(s.value_);
        };
    });
}
function check(rawProperty, params) {
    if (rawProperty == null || rawProperty.generate == null)
        throw new Error('Invalid property encountered, please use a valid property');
    if (rawProperty.run == null)
        throw new Error('Invalid property encountered, please use a valid property not an arbitrary');
    var qParams = QualifiedParameters.read(params);
    var property = decorateProperty(rawProperty, qParams);
    var generator = toss(property, qParams.seed, qParams.randomType, qParams.examples);
    var maxInitialIterations = qParams.path.length === 0 ? qParams.numRuns : -1;
    var maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
    var initialValues = buildInitialValues(generator, qParams);
    var sourceValues = new SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
    return property.isAsync()
        ? asyncRunIt(property, sourceValues, qParams.verbose).then(function (e) {
            return e.toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
        })
        : runIt(property, sourceValues, qParams.verbose).toRunDetails(qParams.seed, qParams.path, qParams.numRuns, maxSkips);
}
function assert(property, params) {
    var out = check(property, params);
    if (property.isAsync())
        return out.then(throwIfFailed);
    else
        throwIfFailed(out);
}

var ObjectEntriesImpl = function (obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
};
var ObjectEntries = Object.entries ? Object.entries : ObjectEntriesImpl;
var repeatUpToLength = function (src, targetLength) {
    for (; targetLength > src.length; src += src)
        ;
    return src;
};
var StringPadEndImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return String(src) + padString.slice(0, targetLength);
};
var StringPadStartImpl = function (src, targetLength, padString) {
    targetLength = targetLength >> 0;
    if (padString === '' || src.length > targetLength)
        return String(src);
    targetLength = targetLength - src.length;
    padString = repeatUpToLength(typeof padString !== 'undefined' ? String(padString) : ' ', targetLength);
    return padString.slice(0, targetLength) + String(src);
};
var wrapStringPad = function (method) {
    return (method &&
        (function (src, targetLength, padString) { return method.call(src, targetLength, padString); }));
};
var StringPadEnd = wrapStringPad(String.prototype.padEnd) || StringPadEndImpl;
var StringPadStart = wrapStringPad(String.prototype.padStart) || StringPadStartImpl;
var StringFromCodePointLimitedImpl = function (codePoint) {
    if (codePoint < 0x10000)
        return String.fromCharCode(codePoint);
    codePoint -= 0x10000;
    return String.fromCharCode((codePoint >> 10) + 0xd800) + String.fromCharCode((codePoint % 0x400) + 0xdc00);
};
var StringFromCodePointLimited = String.fromCodePoint ? String.fromCodePoint : StringFromCodePointLimitedImpl;

var __read$4 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$4 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$4(arguments[i]));
    return ar;
};
var __values$6 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function toProperty(generator, qParams) {
    var prop = !generator.hasOwnProperty('isAsync')
        ? new Property(generator, function () { return true; })
        : generator;
    return qParams.unbiased === true ? new UnbiasedProperty(prop) : prop;
}
function streamSample(generator, params) {
    var qParams = QualifiedParameters.readOrNumRuns(params);
    var tossedValues = stream(toss(toProperty(generator, qParams), qParams.seed, qParams.randomType, qParams.examples));
    if (qParams.path.length === 0) {
        return tossedValues.take(qParams.numRuns).map(function (s) { return s().value_; });
    }
    return stream(pathWalk(qParams.path, tossedValues.map(function (s) { return s(); })))
        .take(qParams.numRuns)
        .map(function (s) { return s.value_; });
}
function sample(generator, params) {
    return __spread$4(streamSample(generator, params));
}
function statistics(generator, classify, params) {
    var e_1, _a, e_2, _b, e_3, _c;
    var qParams = QualifiedParameters.readOrNumRuns(params);
    var recorded = {};
    try {
        for (var _d = __values$6(streamSample(generator, params)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var g = _e.value;
            var out = classify(g);
            var categories = Array.isArray(out) ? out : [out];
            try {
                for (var categories_1 = __values$6(categories), categories_1_1 = categories_1.next(); !categories_1_1.done; categories_1_1 = categories_1.next()) {
                    var c = categories_1_1.value;
                    recorded[c] = (recorded[c] || 0) + 1;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (categories_1_1 && !categories_1_1.done && (_b = categories_1["return"])) _b.call(categories_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var data = ObjectEntries(recorded)
        .sort(function (a, b) { return b[1] - a[1]; })
        .map(function (i) { return [i[0], ((i[1] * 100.0) / qParams.numRuns).toFixed(2) + "%"]; });
    var longestName = data.map(function (i) { return i[0].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    var longestPercent = data.map(function (i) { return i[1].length; }).reduce(function (p, c) { return Math.max(p, c); }, 0);
    try {
        for (var data_1 = __values$6(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var item = data_1_1.value;
            qParams.logger(StringPadEnd(item[0], longestName, '.') + ".." + StringPadStart(item[1], longestPercent, '.'));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_c = data_1["return"])) _c.call(data_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BiasedArbitraryWrapper = (function (_super) {
    __extends$3(BiasedArbitraryWrapper, _super);
    function BiasedArbitraryWrapper(freq, arb, biasedArbBuilder) {
        var _this = _super.call(this) || this;
        _this.freq = freq;
        _this.arb = arb;
        _this.biasedArbBuilder = biasedArbBuilder;
        return _this;
    }
    BiasedArbitraryWrapper.prototype.generate = function (mrng) {
        return mrng.nextInt(1, this.freq) === 1 ? this.biasedArbBuilder(this.arb).generate(mrng) : this.arb.generate(mrng);
    };
    return BiasedArbitraryWrapper;
}(Arbitrary));
function biasWrapper(freq, arb, biasedArbBuilder) {
    return new BiasedArbitraryWrapper(freq, arb, biasedArbBuilder);
}

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ArbitraryWithShrink = (function (_super) {
    __extends$4(ArbitraryWithShrink, _super);
    function ArbitraryWithShrink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArbitraryWithShrink.prototype.shrinkableFor = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce === true).map(function (v) { return _this.shrinkableFor(v, true); }); });
    };
    return ArbitraryWithShrink;
}(Arbitrary));

function biasNumeric(min, max, Ctor, logLike) {
    if (min === max) {
        return new Ctor(min, max);
    }
    if (min < 0) {
        return max > 0
            ? new Ctor(-logLike(-min), logLike(max))
            : new Ctor((max - logLike((max - min))), max);
    }
    return new Ctor(min, min + logLike((max - min)));
}

var __generator$6 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function shrinkNumericInternal(current, target, shrunkOnce, halvePos, halveNeg) {
    var realGap = (current - target);
    function shrink_decr() {
        var gap, toremove;
        return __generator$6(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gap = shrunkOnce ? halvePos(realGap) : realGap;
                    toremove = gap;
                    _a.label = 1;
                case 1:
                    if (!(toremove > 0)) return [3, 4];
                    return [4, (current - toremove)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    toremove = halvePos(toremove);
                    return [3, 1];
                case 4: return [2];
            }
        });
    }
    function shrink_incr() {
        var gap, toremove;
        return __generator$6(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gap = shrunkOnce ? halveNeg(realGap) : realGap;
                    toremove = gap;
                    _a.label = 1;
                case 1:
                    if (!(toremove < 0)) return [3, 4];
                    return [4, (current - toremove)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    toremove = halveNeg(toremove);
                    return [3, 1];
                case 4: return [2];
            }
        });
    }
    return realGap > 0 ? stream(shrink_decr()) : stream(shrink_incr());
}
function halveBigInt(n) {
    return n / BigInt(2);
}
function halvePosNumber(n) {
    return Math.floor(n / 2);
}
function halveNegNumber(n) {
    return Math.ceil(n / 2);
}
function shrinkNumeric(zero, min, max, current, shrunkOnce, halvePos, halveNeg) {
    if (min <= zero && max >= zero) {
        return shrinkNumericInternal(current, zero, shrunkOnce, halvePos, halveNeg);
    }
    return current < zero
        ? shrinkNumericInternal(current, max, shrunkOnce, halvePos, halveNeg)
        : shrinkNumericInternal(current, min, shrunkOnce, halvePos, halveNeg);
}
function shrinkNumber(min, max, current, shrunkOnce) {
    return shrinkNumeric(0, min, max, current, shrunkOnce, halvePosNumber, halveNegNumber);
}
function shrinkBigInt(min, max, current, shrunkOnce) {
    return shrinkNumeric(BigInt(0), min, max, current, shrunkOnce, halveBigInt, halveBigInt);
}

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IntegerArbitrary = (function (_super) {
    __extends$5(IntegerArbitrary, _super);
    function IntegerArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.biasedIntegerArbitrary = null;
        _this.min = min === undefined ? IntegerArbitrary.MIN_INT : min;
        _this.max = max === undefined ? IntegerArbitrary.MAX_INT : max;
        return _this;
    }
    IntegerArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    IntegerArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextInt(this.min, this.max), false);
    };
    IntegerArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkNumber(this.min, this.max, value, shrunkOnce === true);
    };
    IntegerArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedIntegerArbitrary != null) {
            return this.biasedIntegerArbitrary;
        }
        var log2 = function (v) { return Math.floor(Math.log(v) / Math.log(2)); };
        this.biasedIntegerArbitrary = biasNumeric(this.min, this.max, IntegerArbitrary, log2);
        return this.biasedIntegerArbitrary;
    };
    IntegerArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    IntegerArbitrary.MIN_INT = 0x80000000 | 0;
    IntegerArbitrary.MAX_INT = 0x7fffffff | 0;
    return IntegerArbitrary;
}(ArbitraryWithShrink));
function integer(a, b) {
    return b === undefined ? new IntegerArbitrary(undefined, a) : new IntegerArbitrary(a, b);
}
function maxSafeInteger() {
    return integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}
function nat(a) {
    return new IntegerArbitrary(0, a);
}
function maxSafeNat() {
    return nat(Number.MAX_SAFE_INTEGER);
}

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ArrayArbitrary = (function (_super) {
    __extends$6(ArrayArbitrary, _super);
    function ArrayArbitrary(arb, minLength, maxLength, preFilter) {
        if (preFilter === void 0) { preFilter = function (tab) { return tab; }; }
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        _this.preFilter = preFilter;
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    ArrayArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    ArrayArbitrary.prototype.wrapper = function (itemsRaw, shrunkOnce) {
        var _this = this;
        var items = this.preFilter(itemsRaw);
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            ArrayArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable(vs, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    ArrayArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = [];
        for (var idx = 0; idx !== size.value; ++idx) {
            items.push(this.arb.generate(mrng));
        }
        return this.wrapper(items, false);
    };
    ArrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items[0].shrink().map(function (v) { return [v].concat(items.slice(1)); }))
            .join(items.length > this.minLength
            ? this.shrinkImpl(items.slice(1), false)
                .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                .map(function (vs) { return [items[0]].concat(vs); })
            : Stream.nil());
    };
    ArrayArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) {
            var lowBiased = new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            var highBiasedArbBuilder = function () {
                return originalArbitrary.minLength !== originalArbitrary.maxLength
                    ? new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.minLength +
                        Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)), originalArbitrary.preFilter)
                    : new ArrayArbitrary(originalArbitrary.arb.withBias(freq), originalArbitrary.minLength, originalArbitrary.maxLength, originalArbitrary.preFilter);
            };
            return biasWrapper(freq, lowBiased, highBiasedArbBuilder);
        });
    };
    return ArrayArbitrary;
}(Arbitrary));
function array(arb, aLength, bLength) {
    if (bLength == null)
        return new ArrayArbitrary(arb, 0, aLength == null ? 10 : aLength);
    return new ArrayArbitrary(arb, aLength || 0, bLength);
}

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BigIntArbitrary = (function (_super) {
    __extends$7(BigIntArbitrary, _super);
    function BigIntArbitrary(min, max) {
        var _this = _super.call(this) || this;
        _this.min = min;
        _this.max = max;
        _this.biasedBigIntArbitrary = null;
        return _this;
    }
    BigIntArbitrary.prototype.wrapper = function (value, shrunkOnce) {
        var _this = this;
        return new Shrinkable(value, function () { return _this.shrink(value, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    BigIntArbitrary.prototype.generate = function (mrng) {
        return this.wrapper(mrng.nextBigInt(this.min, this.max), false);
    };
    BigIntArbitrary.prototype.shrink = function (value, shrunkOnce) {
        return shrinkBigInt(this.min, this.max, value, shrunkOnce === true);
    };
    BigIntArbitrary.prototype.pureBiasedArbitrary = function () {
        if (this.biasedBigIntArbitrary != null) {
            return this.biasedBigIntArbitrary;
        }
        var logLike = function (v) {
            if (v === BigInt(0))
                return BigInt(0);
            return BigInt(v.toString().length);
        };
        this.biasedBigIntArbitrary = biasNumeric(this.min, this.max, BigIntArbitrary, logLike);
        return this.biasedBigIntArbitrary;
    };
    BigIntArbitrary.prototype.withBias = function (freq) {
        return biasWrapper(freq, this, function (originalArbitrary) { return originalArbitrary.pureBiasedArbitrary(); });
    };
    return BigIntArbitrary;
}(ArbitraryWithShrink));
function bigIntN(n) {
    return new BigIntArbitrary(BigInt(-1) << BigInt(n - 1), (BigInt(1) << BigInt(n - 1)) - BigInt(1));
}
function bigUintN(n) {
    return new BigIntArbitrary(BigInt(0), (BigInt(1) << BigInt(n)) - BigInt(1));
}
function bigInt(min, max) {
    return max === undefined ? bigIntN(256) : new BigIntArbitrary(min, max);
}
function bigUint(max) {
    return max === undefined ? bigUintN(256) : new BigIntArbitrary(BigInt(0), max);
}

function boolean() {
    return integer(0, 1)
        .map(function (v) { return v === 1; })
        .noBias();
}

function CharacterArbitrary(min, max, mapToCode) {
    return integer(min, max).map(function (n) { return StringFromCodePointLimited(mapToCode(n)); });
}
var preferPrintableMapper = function (v) {
    if (v < 95)
        return v + 0x20;
    if (v <= 0x7e)
        return v - 95;
    return v;
};
function char() {
    return CharacterArbitrary(0x20, 0x7e, function (v) { return v; });
}
function hexa() {
    function mapper(v) {
        return v < 10
            ? v + 48
            : v + 97 - 10;
    }
    return CharacterArbitrary(0, 15, mapper);
}
function base64() {
    function mapper(v) {
        if (v < 26)
            return v + 65;
        if (v < 52)
            return v + 97 - 26;
        if (v < 62)
            return v + 48 - 52;
        return v === 62 ? 43 : 47;
    }
    return CharacterArbitrary(0, 63, mapper);
}
function ascii() {
    return CharacterArbitrary(0x00, 0x7f, preferPrintableMapper);
}
function char16bits() {
    return CharacterArbitrary(0x0000, 0xffff, preferPrintableMapper);
}
function unicode() {
    var gapSize = 0xdfff + 1 - 0xd800;
    function mapping(v) {
        if (v < 0xd800)
            return preferPrintableMapper(v);
        return v + gapSize;
    }
    return CharacterArbitrary(0x0000, 0xffff - gapSize, mapping);
}
function fullUnicode() {
    var gapSize = 0xdfff + 1 - 0xd800;
    function mapping(v) {
        if (v < 0xd800)
            return preferPrintableMapper(v);
        return v + gapSize;
    }
    return CharacterArbitrary(0x0000, 0x10ffff - gapSize, mapping);
}

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator$7 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read$5 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$5 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$5(arguments[i]));
    return ar;
};
var ConstantArbitrary = (function (_super) {
    __extends$8(ConstantArbitrary, _super);
    function ConstantArbitrary(values) {
        var _this = _super.call(this) || this;
        _this.values = values;
        return _this;
    }
    ConstantArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        if (this.values.length === 1)
            return new Shrinkable(this.values[0]);
        var id = mrng.nextInt(0, this.values.length - 1);
        if (id === 0)
            return new Shrinkable(this.values[0]);
        function g(v) {
            return __generator$7(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable(v)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable(this.values[id], function () { return stream(g(_this.values[0])); });
    };
    return ConstantArbitrary;
}(Arbitrary));
function constant(value) {
    if (hasCloneMethod(value)) {
        throw new Error('fc.constant does not accept cloneable values, use fc.clonedConstant instead');
    }
    return new ConstantArbitrary([value]);
}
function clonedConstant(value) {
    if (hasCloneMethod(value)) {
        var producer = function () { return value[cloneMethod](); };
        return new ConstantArbitrary([producer]).map(function (c) { return c(); });
    }
    return new ConstantArbitrary([value]);
}
function constantFrom() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (values.length === 0) {
        throw new Error('fc.constantFrom expects at least one parameter');
    }
    if (values.find(function (v) { return hasCloneMethod(v); }) != null) {
        throw new Error('fc.constantFrom does not accept cloneable values, not supported for the moment');
    }
    return new ConstantArbitrary(__spread$5(values));
}

var ContextImplem = (function () {
    function ContextImplem() {
        this.receivedLogs = [];
    }
    ContextImplem.prototype.log = function (data) {
        this.receivedLogs.push(data);
    };
    ContextImplem.prototype.size = function () {
        return this.receivedLogs.length;
    };
    ContextImplem.prototype.toString = function () {
        return JSON.stringify({ logs: this.receivedLogs });
    };
    ContextImplem.prototype[cloneMethod] = function () {
        return new ContextImplem();
    };
    return ContextImplem;
}());
var context = function () { return clonedConstant(new ContextImplem()); };

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator$8 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DedupArbitrary = (function (_super) {
    __extends$9(DedupArbitrary, _super);
    function DedupArbitrary(arb, numValues) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.numValues = numValues;
        return _this;
    }
    DedupArbitrary.prototype.generate = function (mrng) {
        var items = [];
        if (this.numValues <= 0) {
            return this.wrapper(items);
        }
        for (var idx = 0; idx !== this.numValues - 1; ++idx) {
            items.push(this.arb.generate(mrng.clone()));
        }
        items.push(this.arb.generate(mrng));
        return this.wrapper(items);
    };
    DedupArbitrary.makeItCloneable = function (vs, shrinkables) {
        var _this = this;
        vs[cloneMethod] = function () {
            var cloned = [];
            for (var idx = 0; idx !== shrinkables.length; ++idx) {
                cloned.push(shrinkables[idx].value);
            }
            _this.makeItCloneable(cloned, shrinkables);
            return cloned;
        };
        return vs;
    };
    DedupArbitrary.prototype.wrapper = function (items) {
        var _this = this;
        var cloneable = false;
        var vs = [];
        for (var idx = 0; idx !== items.length; ++idx) {
            var s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            vs.push(s.value);
        }
        if (cloneable) {
            DedupArbitrary.makeItCloneable(vs, items);
        }
        return new Shrinkable(vs, function () { return stream(_this.shrinkImpl(items)).map(function (v) { return _this.wrapper(v); }); });
    };
    DedupArbitrary.prototype.shrinkImpl = function (items) {
        var its, cur;
        return __generator$8(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (items.length === 0) {
                        return [2];
                    }
                    its = items.map(function (s) { return s.shrink()[Symbol.iterator](); });
                    cur = its.map(function (it) { return it.next(); });
                    _a.label = 1;
                case 1:
                    if (!!cur[0].done) return [3, 3];
                    return [4, cur.map(function (c) { return c.value; })];
                case 2:
                    _a.sent();
                    cur = its.map(function (it) { return it.next(); });
                    return [3, 1];
                case 3: return [2];
            }
        });
    };
    return DedupArbitrary;
}(Arbitrary));
function dedup(arb, numValues) {
    return new DedupArbitrary(arb, numValues);
}

function subArrayContains(tab, upperBound, includeValue) {
    for (var idx = 0; idx < upperBound; ++idx) {
        if (includeValue(tab[idx]))
            return true;
    }
    return false;
}
function swap(tab, idx1, idx2) {
    var temp = tab[idx1];
    tab[idx1] = tab[idx2];
    tab[idx2] = temp;
}
function buildCompareFilter(compare) {
    return function (tab) {
        var finalLength = tab.length;
        var _loop_1 = function (idx) {
            if (subArrayContains(tab, idx, function (t) { return compare(t.value_, tab[idx].value_); })) {
                --finalLength;
                swap(tab, idx, finalLength);
            }
        };
        for (var idx = tab.length - 1; idx !== -1; --idx) {
            _loop_1(idx);
        }
        return tab.slice(0, finalLength);
    };
}
function set(arb, aLength, bLength, compareFn) {
    var minLength = bLength == null || typeof bLength !== 'number' ? 0 : aLength;
    var maxLength = aLength == null || typeof aLength !== 'number' ? 10 : typeof bLength === 'number' ? bLength : aLength;
    var compare = compareFn != null
        ? compareFn
        : typeof bLength === 'function'
            ? bLength
            : typeof aLength === 'function'
                ? aLength
                : function (a, b) { return a === b; };
    var arrayArb = new ArrayArbitrary(arb, minLength, maxLength, buildCompareFilter(compare));
    if (minLength === 0)
        return arrayArb;
    return arrayArb.filter(function (tab) { return tab.length >= minLength; });
}

var __values$7 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function toObject(items) {
    var e_1, _a;
    var obj = {};
    try {
        for (var items_1 = __values$7(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var keyValue = items_1_1.value;
            obj[keyValue[0]] = keyValue[1];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1["return"])) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
function dictionary(keyArb, valueArb) {
    return set(tuple(keyArb, valueArb), function (t1, t2) { return t1[0] === t2[0]; }).map(toObject);
}

function next(n) {
    return integer(0, (1 << n) - 1);
}
var floatInternal = function () {
    return next(24).map(function (v) { return v / (1 << 24); });
};
function float(a, b) {
    if (a === undefined)
        return floatInternal();
    if (b === undefined)
        return floatInternal().map(function (v) { return v * a; });
    return floatInternal().map(function (v) { return a + v * (b - a); });
}
var doubleFactor = Math.pow(2, 27);
var doubleDivisor = Math.pow(2, -53);
var doubleInternal = function () {
    return tuple(next(26), next(27)).map(function (v) { return (v[0] * doubleFactor + v[1]) * doubleDivisor; });
};
function double(a, b) {
    if (a === undefined)
        return doubleInternal();
    if (b === undefined)
        return doubleInternal().map(function (v) { return v * a; });
    return doubleInternal().map(function (v) { return a + v * (b - a); });
}

var __extends$a = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$6 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$6 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$6(arguments[i]));
    return ar;
};
var FrequencyArbitrary = (function (_super) {
    __extends$a(FrequencyArbitrary, _super);
    function FrequencyArbitrary(warbs) {
        var _this = _super.call(this) || this;
        _this.warbs = warbs;
        var currentWeight = 0;
        _this.summedWarbs = [];
        for (var idx = 0; idx !== warbs.length; ++idx) {
            currentWeight += warbs[idx].weight;
            _this.summedWarbs.push({ weight: currentWeight, arbitrary: warbs[idx].arbitrary });
        }
        _this.totalWeight = currentWeight;
        return _this;
    }
    FrequencyArbitrary.prototype.generate = function (mrng) {
        var selected = mrng.nextInt(0, this.totalWeight - 1);
        for (var idx = 0; idx !== this.summedWarbs.length; ++idx) {
            if (selected < this.summedWarbs[idx].weight)
                return this.summedWarbs[idx].arbitrary.generate(mrng);
        }
        throw new Error("Unable to generate from fc.frequency");
    };
    FrequencyArbitrary.prototype.withBias = function (freq) {
        return new FrequencyArbitrary(this.warbs.map(function (v) { return ({ weight: v.weight, arbitrary: v.arbitrary.withBias(freq) }); }));
    };
    return FrequencyArbitrary;
}(Arbitrary));
function frequency() {
    var warbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        warbs[_i] = arguments[_i];
    }
    if (warbs.length === 0) {
        throw new Error('fc.frequency expects at least one parameter');
    }
    return new FrequencyArbitrary(__spread$6(warbs));
}

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap$1 (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap$1(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap$1(this, i, i + 3);
    swap$1(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap$1(this, i, i + 7);
    swap$1(this, i + 1, i + 6);
    swap$1(this, i + 2, i + 5);
    swap$1(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var crc32Table = [
    0x00000000,
    0x77073096,
    0xee0e612c,
    0x990951ba,
    0x076dc419,
    0x706af48f,
    0xe963a535,
    0x9e6495a3,
    0x0edb8832,
    0x79dcb8a4,
    0xe0d5e91e,
    0x97d2d988,
    0x09b64c2b,
    0x7eb17cbd,
    0xe7b82d07,
    0x90bf1d91,
    0x1db71064,
    0x6ab020f2,
    0xf3b97148,
    0x84be41de,
    0x1adad47d,
    0x6ddde4eb,
    0xf4d4b551,
    0x83d385c7,
    0x136c9856,
    0x646ba8c0,
    0xfd62f97a,
    0x8a65c9ec,
    0x14015c4f,
    0x63066cd9,
    0xfa0f3d63,
    0x8d080df5,
    0x3b6e20c8,
    0x4c69105e,
    0xd56041e4,
    0xa2677172,
    0x3c03e4d1,
    0x4b04d447,
    0xd20d85fd,
    0xa50ab56b,
    0x35b5a8fa,
    0x42b2986c,
    0xdbbbc9d6,
    0xacbcf940,
    0x32d86ce3,
    0x45df5c75,
    0xdcd60dcf,
    0xabd13d59,
    0x26d930ac,
    0x51de003a,
    0xc8d75180,
    0xbfd06116,
    0x21b4f4b5,
    0x56b3c423,
    0xcfba9599,
    0xb8bda50f,
    0x2802b89e,
    0x5f058808,
    0xc60cd9b2,
    0xb10be924,
    0x2f6f7c87,
    0x58684c11,
    0xc1611dab,
    0xb6662d3d,
    0x76dc4190,
    0x01db7106,
    0x98d220bc,
    0xefd5102a,
    0x71b18589,
    0x06b6b51f,
    0x9fbfe4a5,
    0xe8b8d433,
    0x7807c9a2,
    0x0f00f934,
    0x9609a88e,
    0xe10e9818,
    0x7f6a0dbb,
    0x086d3d2d,
    0x91646c97,
    0xe6635c01,
    0x6b6b51f4,
    0x1c6c6162,
    0x856530d8,
    0xf262004e,
    0x6c0695ed,
    0x1b01a57b,
    0x8208f4c1,
    0xf50fc457,
    0x65b0d9c6,
    0x12b7e950,
    0x8bbeb8ea,
    0xfcb9887c,
    0x62dd1ddf,
    0x15da2d49,
    0x8cd37cf3,
    0xfbd44c65,
    0x4db26158,
    0x3ab551ce,
    0xa3bc0074,
    0xd4bb30e2,
    0x4adfa541,
    0x3dd895d7,
    0xa4d1c46d,
    0xd3d6f4fb,
    0x4369e96a,
    0x346ed9fc,
    0xad678846,
    0xda60b8d0,
    0x44042d73,
    0x33031de5,
    0xaa0a4c5f,
    0xdd0d7cc9,
    0x5005713c,
    0x270241aa,
    0xbe0b1010,
    0xc90c2086,
    0x5768b525,
    0x206f85b3,
    0xb966d409,
    0xce61e49f,
    0x5edef90e,
    0x29d9c998,
    0xb0d09822,
    0xc7d7a8b4,
    0x59b33d17,
    0x2eb40d81,
    0xb7bd5c3b,
    0xc0ba6cad,
    0xedb88320,
    0x9abfb3b6,
    0x03b6e20c,
    0x74b1d29a,
    0xead54739,
    0x9dd277af,
    0x04db2615,
    0x73dc1683,
    0xe3630b12,
    0x94643b84,
    0x0d6d6a3e,
    0x7a6a5aa8,
    0xe40ecf0b,
    0x9309ff9d,
    0x0a00ae27,
    0x7d079eb1,
    0xf00f9344,
    0x8708a3d2,
    0x1e01f268,
    0x6906c2fe,
    0xf762575d,
    0x806567cb,
    0x196c3671,
    0x6e6b06e7,
    0xfed41b76,
    0x89d32be0,
    0x10da7a5a,
    0x67dd4acc,
    0xf9b9df6f,
    0x8ebeeff9,
    0x17b7be43,
    0x60b08ed5,
    0xd6d6a3e8,
    0xa1d1937e,
    0x38d8c2c4,
    0x4fdff252,
    0xd1bb67f1,
    0xa6bc5767,
    0x3fb506dd,
    0x48b2364b,
    0xd80d2bda,
    0xaf0a1b4c,
    0x36034af6,
    0x41047a60,
    0xdf60efc3,
    0xa867df55,
    0x316e8eef,
    0x4669be79,
    0xcb61b38c,
    0xbc66831a,
    0x256fd2a0,
    0x5268e236,
    0xcc0c7795,
    0xbb0b4703,
    0x220216b9,
    0x5505262f,
    0xc5ba3bbe,
    0xb2bd0b28,
    0x2bb45a92,
    0x5cb36a04,
    0xc2d7ffa7,
    0xb5d0cf31,
    0x2cd99e8b,
    0x5bdeae1d,
    0x9b64c2b0,
    0xec63f226,
    0x756aa39c,
    0x026d930a,
    0x9c0906a9,
    0xeb0e363f,
    0x72076785,
    0x05005713,
    0x95bf4a82,
    0xe2b87a14,
    0x7bb12bae,
    0x0cb61b38,
    0x92d28e9b,
    0xe5d5be0d,
    0x7cdcefb7,
    0x0bdbdf21,
    0x86d3d2d4,
    0xf1d4e242,
    0x68ddb3f8,
    0x1fda836e,
    0x81be16cd,
    0xf6b9265b,
    0x6fb077e1,
    0x18b74777,
    0x88085ae6,
    0xff0f6a70,
    0x66063bca,
    0x11010b5c,
    0x8f659eff,
    0xf862ae69,
    0x616bffd3,
    0x166ccf45,
    0xa00ae278,
    0xd70dd2ee,
    0x4e048354,
    0x3903b3c2,
    0xa7672661,
    0xd06016f7,
    0x4969474d,
    0x3e6e77db,
    0xaed16a4a,
    0xd9d65adc,
    0x40df0b66,
    0x37d83bf0,
    0xa9bcae53,
    0xdebb9ec5,
    0x47b2cf7f,
    0x30b5ffe9,
    0xbdbdf21c,
    0xcabac28a,
    0x53b39330,
    0x24b4a3a6,
    0xbad03605,
    0xcdd70693,
    0x54de5729,
    0x23d967bf,
    0xb3667a2e,
    0xc4614ab8,
    0x5d681b02,
    0x2a6f2b94,
    0xb40bbe37,
    0xc30c8ea1,
    0x5a05df1b,
    0x2d02ef8d
];
function hash(repr) {
    var buf = Buffer.from(repr);
    var crc = 0xffffffff;
    for (var idx = 0; idx !== buf.length; ++idx) {
        crc = crc32Table[(crc & 0xff) ^ buf[idx]] ^ (crc >> 8);
    }
    return (crc | 0) + 0x80000000;
}

var __read$7 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
function func(arb) {
    return tuple(array(arb, 1, 10), integer().noShrink()).map(function (_a) {
        var _b = __read$7(_a, 2), outs = _b[0], seed = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var repr = stringify(args);
                var val = outs[hash("" + seed + repr) % outs.length];
                recorded[repr] = val;
                return hasCloneMethod(val) ? val[cloneMethod]() : val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + stringify(recorded[k]); })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFuncImplem(cmp) {
    return tuple(integer().noShrink(), integer(1, 0xffffffff).noShrink()).map(function (_a) {
        var _b = __read$7(_a, 2), seed = _b[0], hashEnvSize = _b[1];
        var producer = function () {
            var _a;
            var recorded = {};
            var f = function (a, b) {
                var reprA = stringify(a);
                var reprB = stringify(b);
                var hA = hash("" + seed + reprA) % hashEnvSize;
                var hB = hash("" + seed + reprB) % hashEnvSize;
                var val = cmp(hA, hB);
                recorded["[" + reprA + "," + reprB + "]"] = val;
                return val;
            };
            return Object.assign(f, (_a = {
                    toString: function () {
                        return '<function :: ' +
                            Object.keys(recorded)
                                .sort()
                                .map(function (k) { return k + " => " + recorded[k]; })
                                .join(', ') +
                            '>';
                    }
                },
                _a[cloneMethod] = producer,
                _a));
        };
        return producer();
    });
}
function compareFunc() {
    return compareFuncImplem(function (hA, hB) { return hA - hB; });
}
function compareBooleanFunc() {
    return compareFuncImplem(function (hA, hB) { return hA < hB; });
}

var h = function (v, w) {
    return { arbitrary: constant(v), weight: w };
};
var loremWord = function () {
    return frequency(h('non', 6), h('adipiscing', 5), h('ligula', 5), h('enim', 5), h('pellentesque', 5), h('in', 5), h('augue', 5), h('et', 5), h('nulla', 5), h('lorem', 4), h('sit', 4), h('sed', 4), h('diam', 4), h('fermentum', 4), h('ut', 4), h('eu', 4), h('aliquam', 4), h('mauris', 4), h('vitae', 4), h('felis', 4), h('ipsum', 3), h('dolor', 3), h('amet,', 3), h('elit', 3), h('euismod', 3), h('mi', 3), h('orci', 3), h('erat', 3), h('praesent', 3), h('egestas', 3), h('leo', 3), h('vel', 3), h('sapien', 3), h('integer', 3), h('curabitur', 3), h('convallis', 3), h('purus', 3), h('risus', 2), h('suspendisse', 2), h('lectus', 2), h('nec,', 2), h('ultricies', 2), h('sed,', 2), h('cras', 2), h('elementum', 2), h('ultrices', 2), h('maecenas', 2), h('massa,', 2), h('varius', 2), h('a,', 2), h('semper', 2), h('proin', 2), h('nec', 2), h('nisl', 2), h('amet', 2), h('duis', 2), h('congue', 2), h('libero', 2), h('vestibulum', 2), h('pede', 2), h('blandit', 2), h('sodales', 2), h('ante', 2), h('nibh', 2), h('ac', 2), h('aenean', 2), h('massa', 2), h('suscipit', 2), h('sollicitudin', 2), h('fusce', 2), h('tempus', 2), h('aliquam,', 2), h('nunc', 2), h('ullamcorper', 2), h('rhoncus', 2), h('metus', 2), h('faucibus,', 2), h('justo', 2), h('magna', 2), h('at', 2), h('tincidunt', 2), h('consectetur', 1), h('tortor,', 1), h('dignissim', 1), h('congue,', 1), h('non,', 1), h('porttitor,', 1), h('nonummy', 1), h('molestie,', 1), h('est', 1), h('eleifend', 1), h('mi,', 1), h('arcu', 1), h('scelerisque', 1), h('vitae,', 1), h('consequat', 1), h('in,', 1), h('pretium', 1), h('volutpat', 1), h('pharetra', 1), h('tempor', 1), h('bibendum', 1), h('odio', 1), h('dui', 1), h('primis', 1), h('faucibus', 1), h('luctus', 1), h('posuere', 1), h('cubilia', 1), h('curae,', 1), h('hendrerit', 1), h('velit', 1), h('mauris,', 1), h('gravida', 1), h('ornare', 1), h('ut,', 1), h('pulvinar', 1), h('varius,', 1), h('turpis', 1), h('nibh,', 1), h('eros', 1), h('id', 1), h('aliquet', 1), h('quis', 1), h('lobortis', 1), h('consectetuer', 1), h('morbi', 1), h('vehicula', 1), h('tortor', 1), h('tellus,', 1), h('id,', 1), h('eu,', 1), h('quam', 1), h('feugiat,', 1), h('posuere,', 1), h('iaculis', 1), h('lectus,', 1), h('tristique', 1), h('mollis,', 1), h('nisl,', 1), h('vulputate', 1), h('sem', 1), h('vivamus', 1), h('placerat', 1), h('imperdiet', 1), h('cursus', 1), h('rutrum', 1), h('iaculis,', 1), h('augue,', 1), h('lacus', 1));
};
function lorem(maxWordsCount, sentencesMode) {
    var maxCount = maxWordsCount || 5;
    if (maxCount < 1)
        throw new Error("lorem has to produce at least one word/sentence");
    if (sentencesMode) {
        var sentence = array(loremWord(), 1, 10)
            .map(function (words) { return words.join(' '); })
            .map(function (s) { return (s[s.length - 1] === ',' ? s.substr(0, s.length - 1) : s); })
            .map(function (s) { return s[0].toUpperCase() + s.substring(1) + '.'; });
        return array(sentence, 1, maxCount).map(function (sentences) { return sentences.join(' '); });
    }
    else {
        return array(loremWord(), 1, maxCount).map(function (words) {
            return words.map(function (w) { return (w[w.length - 1] === ',' ? w.substr(0, w.length - 1) : w); }).join(' ');
        });
    }
}

var __extends$b = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$8 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$7 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$8(arguments[i]));
    return ar;
};
var OneOfArbitrary = (function (_super) {
    __extends$b(OneOfArbitrary, _super);
    function OneOfArbitrary(arbs) {
        var _this = _super.call(this) || this;
        _this.arbs = arbs;
        return _this;
    }
    OneOfArbitrary.prototype.generate = function (mrng) {
        var id = mrng.nextInt(0, this.arbs.length - 1);
        return this.arbs[id].generate(mrng);
    };
    OneOfArbitrary.prototype.withBias = function (freq) {
        return new OneOfArbitrary(this.arbs.map(function (a) { return a.withBias(freq); }));
    };
    return OneOfArbitrary;
}(Arbitrary));
function oneof() {
    var arbs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arbs[_i] = arguments[_i];
    }
    if (arbs.length === 0) {
        throw new Error('fc.oneof expects at least one parameter');
    }
    return new OneOfArbitrary(__spread$7(arbs));
}

function StringArbitrary(charArb, aLength, bLength) {
    var arrayArb = aLength != null ? (bLength != null ? array(charArb, aLength, bLength) : array(charArb, aLength)) : array(charArb);
    return arrayArb.map(function (tab) { return tab.join(''); });
}
function Base64StringArbitrary(minLength, maxLength) {
    if (minLength > maxLength)
        throw new Error('Minimal length should be inferior or equal to maximal length');
    if (minLength % 4 !== 0)
        throw new Error('Minimal length of base64 strings must be a multiple of 4');
    if (maxLength % 4 !== 0)
        throw new Error('Maximal length of base64 strings must be a multiple of 4');
    return StringArbitrary(base64(), minLength, maxLength).map(function (s) {
        switch (s.length % 4) {
            case 0:
                return s;
            case 3:
                return s + "=";
            case 2:
                return s + "==";
            default:
                return s.slice(1);
        }
    });
}
function stringOf(charArb, aLength, bLength) {
    return StringArbitrary(charArb, aLength, bLength);
}
function string(aLength, bLength) {
    return StringArbitrary(char(), aLength, bLength);
}
function asciiString(aLength, bLength) {
    return StringArbitrary(ascii(), aLength, bLength);
}
function string16bits(aLength, bLength) {
    return StringArbitrary(char16bits(), aLength, bLength);
}
function unicodeString(aLength, bLength) {
    return StringArbitrary(unicode(), aLength, bLength);
}
function fullUnicodeString(aLength, bLength) {
    return StringArbitrary(fullUnicode(), aLength, bLength);
}
function hexaString(aLength, bLength) {
    return StringArbitrary(hexa(), aLength, bLength);
}
function base64String(aLength, bLength) {
    var minLength = aLength != null && bLength != null ? aLength : 0;
    var maxLength = bLength == null ? (aLength == null ? 16 : aLength) : bLength;
    return Base64StringArbitrary(minLength + 3 - ((minLength + 3) % 4), maxLength - (maxLength % 4));
}

var __read$9 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$8 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$9(arguments[i]));
    return ar;
};
var ObjectConstraints = (function () {
    function ObjectConstraints(key, values, maxDepth, maxKeys, withSet, withMap) {
        this.key = key;
        this.values = values;
        this.maxDepth = maxDepth;
        this.maxKeys = maxKeys;
        this.withSet = withSet;
        this.withMap = withMap;
    }
    ObjectConstraints.prototype.next = function () {
        return new ObjectConstraints(this.key, this.values, this.maxDepth - 1, this.maxKeys, this.withSet, this.withMap);
    };
    ObjectConstraints.defaultValues = function () {
        return [
            boolean(),
            integer(),
            double(),
            string(),
            oneof(string(), constant(null), constant(undefined)),
            oneof(double(), constant(-0), constant(0), constant(Number.NaN), constant(Number.POSITIVE_INFINITY), constant(Number.NEGATIVE_INFINITY), constant(Number.EPSILON), constant(Number.MIN_VALUE), constant(Number.MAX_VALUE), constant(Number.MIN_SAFE_INTEGER), constant(Number.MAX_SAFE_INTEGER))
        ];
    };
    ObjectConstraints.boxArbitraries = function (arbs) {
        return arbs.map(function (arb) {
            return arb.map(function (v) {
                switch (typeof v) {
                    case 'boolean':
                        return new Boolean(v);
                    case 'number':
                        return new Number(v);
                    case 'string':
                        return new String(v);
                    default:
                        return v;
                }
            });
        });
    };
    ObjectConstraints.boxArbitrariesIfNeeded = function (arbs, boxEnabled) {
        return boxEnabled ? this.boxArbitraries(arbs).concat(arbs) : arbs;
    };
    ObjectConstraints.from = function (settings) {
        function getOr(access, value) {
            return settings != null && access() != null ? access() : value;
        }
        return new ObjectConstraints(getOr(function () { return settings.key; }, string()), this.boxArbitrariesIfNeeded(getOr(function () { return settings.values; }, ObjectConstraints.defaultValues()), getOr(function () { return settings.withBoxedValues; }, false)), getOr(function () { return settings.maxDepth; }, 2), getOr(function () { return settings.maxKeys; }, 5), getOr(function () { return settings.withSet; }, false), getOr(function () { return settings.withMap; }, false));
    };
    return ObjectConstraints;
}());
var arrayOfAnything = function (arbKeys, arbitrariesForBase, arbAny, maxKeys) {
    return oneof(oneof.apply(void 0, __spread$8(arbitrariesForBase.map(function (arb) { return array(arb, 0, maxKeys); }))), array(arbAny, 0, maxKeys));
};
var setOfAnything = function (arbKeys, arbitrariesForBase, arbAny, maxKeys) {
    return oneof(oneof.apply(void 0, __spread$8(arbitrariesForBase.map(function (arb) { return set(arb, 0, maxKeys).map(function (v) { return new Set(v); }); }))), set(arbAny, 0, maxKeys).map(function (v) { return new Set(v); }));
};
var objectOfAnything = function (arbKeys, arbitrariesForBase, arbAny, maxKeys) {
    var dictOf = function (keyArb, valueArb) {
        return set(tuple(keyArb, valueArb), 0, maxKeys, function (t1, t2) { return t1[0] === t2[0]; }).map(function (v) { return toObject(v); });
    };
    return oneof(oneof.apply(void 0, __spread$8(arbitrariesForBase.map(function (arb) { return dictOf(arbKeys, arb); }))), dictOf(arbKeys, arbAny));
};
var mapOfAnything = function (arbKeys, arbitrariesForBase, arbAny, maxKeys) {
    var mapOf = function (keyArb, valueArb) {
        return set(tuple(keyArb, valueArb), 0, maxKeys, function (t1, t2) { return t1[0] === t2[0]; }).map(function (v) { return new Map(v); });
    };
    return oneof(oneof.apply(void 0, __spread$8(arbitrariesForBase.map(function (arb) { return mapOf(arbKeys, arb); }))), oneof(mapOf(arbKeys, arbAny), mapOf(arbAny, arbAny)));
};
var anythingInternal = function (constraints) {
    var arbKeys = constraints.key;
    var arbitrariesForBase = constraints.values;
    var eligibleArbitraries = [];
    eligibleArbitraries.push(oneof.apply(void 0, __spread$8(arbitrariesForBase)));
    if (constraints.maxDepth > 0) {
        var subArbAny = anythingInternal(constraints.next());
        eligibleArbitraries.push(arrayOfAnything(arbKeys, arbitrariesForBase, subArbAny, constraints.maxKeys));
        eligibleArbitraries.push(objectOfAnything(arbKeys, arbitrariesForBase, subArbAny, constraints.maxKeys));
        if (constraints.withMap) {
            eligibleArbitraries.push(mapOfAnything(arbKeys, arbitrariesForBase, subArbAny, constraints.maxKeys));
        }
        if (constraints.withSet) {
            eligibleArbitraries.push(setOfAnything(arbKeys, arbitrariesForBase, subArbAny, constraints.maxKeys));
        }
    }
    return oneof.apply(void 0, __spread$8(eligibleArbitraries));
};
var objectInternal = function (constraints) {
    return dictionary(constraints.key, anythingInternal(constraints));
};
function anything(settings) {
    return anythingInternal(ObjectConstraints.from(settings));
}
function object(settings) {
    return objectInternal(ObjectConstraints.from(settings));
}
function jsonSettings(stringArbitrary, maxDepth) {
    var key = stringArbitrary;
    var values = [boolean(), integer(), double(), stringArbitrary, constant(null)];
    return maxDepth != null ? { key: key, values: values, maxDepth: maxDepth } : { key: key, values: values };
}
function jsonObject(maxDepth) {
    return anything(jsonSettings(string(), maxDepth));
}
function unicodeJsonObject(maxDepth) {
    return anything(jsonSettings(unicodeString(), maxDepth));
}
function json(maxDepth) {
    var arb = maxDepth != null ? jsonObject(maxDepth) : jsonObject();
    return arb.map(JSON.stringify);
}
function unicodeJson(maxDepth) {
    var arb = maxDepth != null ? unicodeJsonObject(maxDepth) : unicodeJsonObject();
    return arb.map(JSON.stringify);
}

var __extends$c = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator$9 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var OptionArbitrary = (function (_super) {
    __extends$c(OptionArbitrary, _super);
    function OptionArbitrary(arb, frequency) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        _this.frequency = frequency;
        _this.isOptionArb = nat(frequency);
        return _this;
    }
    OptionArbitrary.extendedShrinkable = function (s) {
        function g() {
            return __generator$9(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Shrinkable(null)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }
        return new Shrinkable(s.value_, function () {
            return s
                .shrink()
                .map(OptionArbitrary.extendedShrinkable)
                .join(g());
        });
    };
    OptionArbitrary.prototype.generate = function (mrng) {
        return this.isOptionArb.generate(mrng).value === 0
            ? new Shrinkable(null)
            : OptionArbitrary.extendedShrinkable(this.arb.generate(mrng));
    };
    OptionArbitrary.prototype.withBias = function (freq) {
        return new OptionArbitrary(this.arb.withBias(freq), this.frequency);
    };
    return OptionArbitrary;
}(Arbitrary));
function option(arb, freq) {
    return new OptionArbitrary(arb, freq == null ? 5 : freq);
}

var __values$8 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function rawRecord(recordModel) {
    var keys = Object.keys(recordModel);
    var arbs = keys.map(function (v) { return recordModel[v]; });
    return genericTuple(arbs).map(function (gs) {
        var obj = {};
        for (var idx = 0; idx !== keys.length; ++idx)
            obj[keys[idx]] = gs[idx];
        return obj;
    });
}
function record(recordModel, constraints) {
    var e_1, _a;
    if (constraints == null || (constraints.withDeletedKeys !== true && constraints.with_deleted_keys !== true))
        return rawRecord(recordModel);
    var updatedRecordModel = {};
    try {
        for (var _b = __values$8(Object.keys(recordModel)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var k = _c.value;
            updatedRecordModel[k] = option(recordModel[k].map(function (v) { return ({ value: v }); }));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rawRecord(updatedRecordModel).map(function (obj) {
        var e_2, _a;
        var nobj = {};
        try {
            for (var _b = __values$8(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (obj[k] != null)
                    nobj[k] = obj[k].value;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return nobj;
    });
}

var __extends$d = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator$a = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read$a = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$9 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$a(arguments[i]));
    return ar;
};
var StreamArbitrary = (function (_super) {
    __extends$d(StreamArbitrary, _super);
    function StreamArbitrary(arb) {
        var _this = _super.call(this) || this;
        _this.arb = arb;
        return _this;
    }
    StreamArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var g = function (arb, clonedMrng) {
            return __generator$a(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4, arb.generate(clonedMrng).value_];
                    case 1:
                        _a.sent();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        };
        var producer = function () { return new Stream(g(_this.arb, mrng.clone())); };
        var toString = function () {
            return "Stream(" + __spread$9(producer()
                .take(10)
                .map(stringify)).join(',') + "...)";
        };
        var enrichedProducer = function () {
            var _a;
            return Object.assign(producer(), (_a = { toString: toString }, _a[cloneMethod] = enrichedProducer, _a));
        };
        return new Shrinkable(enrichedProducer());
    };
    StreamArbitrary.prototype.withBias = function (freq) {
        var _this = this;
        return biasWrapper(freq, this, function () { return new StreamArbitrary(_this.arb.withBias(freq)); });
    };
    return StreamArbitrary;
}(Arbitrary));
function infiniteStream(arb) {
    return new StreamArbitrary(arb);
}

var __extends$e = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SubarrayArbitrary = (function (_super) {
    __extends$e(SubarrayArbitrary, _super);
    function SubarrayArbitrary(originalArray, isOrdered, minLength, maxLength) {
        var _this = _super.call(this) || this;
        _this.originalArray = originalArray;
        _this.isOrdered = isOrdered;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        if (minLength < 0 || minLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be between 0 and the size of the original array');
        if (maxLength < 0 || maxLength > originalArray.length)
            throw new Error('fc.*{s|S}ubarrayOf expects the maximal length to be between 0 and the size of the original array');
        if (minLength > maxLength)
            throw new Error('fc.*{s|S}ubarrayOf expects the minimal length to be inferior or equal to the maximal length');
        _this.lengthArb = integer(minLength, maxLength);
        return _this;
    }
    SubarrayArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable(items, function () { return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); }); });
    };
    SubarrayArbitrary.prototype.generate = function (mrng) {
        var _this = this;
        var remainingElements = this.originalArray.map(function (v, idx) { return idx; });
        var size = this.lengthArb.generate(mrng).value;
        var ids = [];
        for (var idx = 0; idx !== size; ++idx) {
            var selectedIdIndex = mrng.nextInt(0, remainingElements.length - 1);
            ids.push(remainingElements[selectedIdIndex]);
            remainingElements.splice(selectedIdIndex, 1);
        }
        if (this.isOrdered)
            ids.sort(function (a, b) { return a - b; });
        return this.wrapper(ids.map(function (i) { return _this.originalArray[i]; }), false);
    };
    SubarrayArbitrary.prototype.shrinkImpl = function (items, shrunkOnce) {
        var _this = this;
        if (items.length === 0) {
            return Stream.nil();
        }
        var size = this.lengthArb.shrinkableFor(items.length, shrunkOnce);
        return size
            .shrink()
            .map(function (l) { return items.slice(items.length - l.value); })
            .join(items.length > this.minLength
            ? this.shrinkImpl(items.slice(1), false)
                .filter(function (vs) { return _this.minLength <= vs.length + 1; })
                .map(function (vs) { return [items[0]].concat(vs); })
            : Stream.nil());
    };
    SubarrayArbitrary.prototype.withBias = function (freq) {
        return this.minLength !== this.maxLength
            ? biasWrapper(freq, this, function (originalArbitrary) {
                return new SubarrayArbitrary(originalArbitrary.originalArray, originalArbitrary.isOrdered, originalArbitrary.minLength, originalArbitrary.minLength +
                    Math.floor(Math.log(originalArbitrary.maxLength - originalArbitrary.minLength) / Math.log(2)));
            })
            : this;
    };
    return SubarrayArbitrary;
}(Arbitrary));
function subarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, true, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, true, 0, originalArray.length);
}
function shuffledSubarray(originalArray, minLength, maxLength) {
    if (minLength != null && maxLength != null)
        return new SubarrayArbitrary(originalArray, false, minLength, maxLength);
    return new SubarrayArbitrary(originalArray, false, 0, originalArray.length);
}

var __read$b = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var ReplayPath = (function () {
    function ReplayPath() {
    }
    ReplayPath.parse = function (replayPathStr) {
        var _a = __read$b(replayPathStr.split(':'), 2), serializedCount = _a[0], serializedChanges = _a[1];
        var counts = this.parseCounts(serializedCount);
        var changes = this.parseChanges(serializedChanges);
        return this.parseOccurences(counts, changes);
    };
    ReplayPath.stringify = function (replayPath) {
        var occurences = this.countOccurences(replayPath);
        var serializedCount = this.stringifyCounts(occurences);
        var serializedChanges = this.stringifyChanges(occurences);
        return serializedCount + ":" + serializedChanges;
    };
    ReplayPath.intToB64 = function (n) {
        if (n < 26)
            return String.fromCharCode(n + 65);
        if (n < 52)
            return String.fromCharCode(n + 97 - 26);
        if (n < 62)
            return String.fromCharCode(n + 48 - 52);
        return String.fromCharCode(n === 62 ? 43 : 47);
    };
    ReplayPath.b64ToInt = function (c) {
        if (c >= 'a')
            return c.charCodeAt(0) - 97 + 26;
        if (c >= 'A')
            return c.charCodeAt(0) - 65;
        if (c >= '0')
            return c.charCodeAt(0) - 48 + 52;
        return c === '+' ? 62 : 63;
    };
    ReplayPath.countOccurences = function (replayPath) {
        return replayPath.reduce(function (counts, cur) {
            if (counts.length === 0 || counts[counts.length - 1].count === 64 || counts[counts.length - 1].value !== cur)
                counts.push({ value: cur, count: 1 });
            else
                counts[counts.length - 1].count += 1;
            return counts;
        }, []);
    };
    ReplayPath.parseOccurences = function (counts, changes) {
        var replayPath = [];
        for (var idx = 0; idx !== counts.length; ++idx) {
            var count = counts[idx];
            var value = changes[idx];
            for (var num = 0; num !== count; ++num)
                replayPath.push(value);
        }
        return replayPath;
    };
    ReplayPath.stringifyChanges = function (occurences) {
        var serializedChanges = '';
        for (var idx = 0; idx < occurences.length; idx += 6) {
            var changesInt = occurences
                .slice(idx, idx + 6)
                .reduceRight(function (prev, cur) { return prev * 2 + (cur.value ? 1 : 0); }, 0);
            serializedChanges += this.intToB64(changesInt);
        }
        return serializedChanges;
    };
    ReplayPath.parseChanges = function (serializedChanges) {
        var _this = this;
        var changesInt = serializedChanges.split('').map(function (c) { return _this.b64ToInt(c); });
        var changes = [];
        for (var idx = 0; idx !== changesInt.length; ++idx) {
            var current = changesInt[idx];
            for (var n = 0; n !== 6; ++n, current >>= 1) {
                changes.push(current % 2 === 1);
            }
        }
        return changes;
    };
    ReplayPath.stringifyCounts = function (occurences) {
        var _this = this;
        return occurences.map(function (_a) {
            var count = _a.count;
            return _this.intToB64(count - 1);
        }).join('');
    };
    ReplayPath.parseCounts = function (serializedCount) {
        var _this = this;
        return serializedCount.split('').map(function (c) { return _this.b64ToInt(c) + 1; });
    };
    return ReplayPath;
}());

var CommandsIterable = (function () {
    function CommandsIterable(commands, metadataForReplay) {
        this.commands = commands;
        this.metadataForReplay = metadataForReplay;
    }
    CommandsIterable.prototype[Symbol.iterator] = function () {
        return this.commands[Symbol.iterator]();
    };
    CommandsIterable.prototype[cloneMethod] = function () {
        return new CommandsIterable(this.commands.map(function (c) { return c.clone(); }), this.metadataForReplay);
    };
    CommandsIterable.prototype.toString = function () {
        var serializedCommands = this.commands
            .filter(function (c) { return c.hasRan; })
            .map(function (c) { return c.toString(); })
            .join(',');
        var metadata = this.metadataForReplay();
        return metadata.length !== 0 ? serializedCommands + " /*" + metadata + "*/" : serializedCommands;
    };
    return CommandsIterable;
}());

var CommandWrapper = (function () {
    function CommandWrapper(cmd) {
        this.cmd = cmd;
        this.hasRan = false;
    }
    CommandWrapper.prototype.check = function (m) {
        return this.cmd.check(m);
    };
    CommandWrapper.prototype.run = function (m, r) {
        this.hasRan = true;
        return this.cmd.run(m, r);
    };
    CommandWrapper.prototype.clone = function () {
        return new CommandWrapper(this.cmd);
    };
    CommandWrapper.prototype.toString = function () {
        return this.cmd.toString();
    };
    return CommandWrapper;
}());

var __extends$f = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$c = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$a = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$c(arguments[i]));
    return ar;
};
var __values$9 = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var CommandsArbitrary = (function (_super) {
    __extends$f(CommandsArbitrary, _super);
    function CommandsArbitrary(commandArbs, maxCommands, sourceReplayPath, disableReplayLog) {
        var _this = _super.call(this) || this;
        _this.sourceReplayPath = sourceReplayPath;
        _this.disableReplayLog = disableReplayLog;
        _this.oneCommandArb = oneof.apply(void 0, __spread$a(commandArbs)).map(function (c) { return new CommandWrapper(c); });
        _this.lengthArb = nat(maxCommands);
        _this.replayPath = [];
        _this.replayPathPosition = 0;
        return _this;
    }
    CommandsArbitrary.prototype.metadataForReplay = function () {
        return this.disableReplayLog ? '' : "replayPath=" + JSON.stringify(ReplayPath.stringify(this.replayPath));
    };
    CommandsArbitrary.prototype.wrapper = function (items, shrunkOnce) {
        var _this = this;
        return new Shrinkable(new CommandsIterable(items.map(function (s) { return s.value_; }), function () { return _this.metadataForReplay(); }), function () {
            return _this.shrinkImpl(items, shrunkOnce).map(function (v) { return _this.wrapper(v, true); });
        });
    };
    CommandsArbitrary.prototype.generate = function (mrng) {
        var size = this.lengthArb.generate(mrng);
        var items = Array(size.value_);
        for (var idx = 0; idx !== size.value_; ++idx) {
            var item = this.oneCommandArb.generate(mrng);
            items[idx] = item;
        }
        this.replayPathPosition = 0;
        return this.wrapper(items, false);
    };
    CommandsArbitrary.prototype.filterOnExecution = function (itemsRaw) {
        var e_1, _a;
        var items = [];
        try {
            for (var itemsRaw_1 = __values$9(itemsRaw), itemsRaw_1_1 = itemsRaw_1.next(); !itemsRaw_1_1.done; itemsRaw_1_1 = itemsRaw_1.next()) {
                var c = itemsRaw_1_1.value;
                if (c.value_.hasRan) {
                    this.replayPath.push(true);
                    items.push(c);
                }
                else
                    this.replayPath.push(false);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (itemsRaw_1_1 && !itemsRaw_1_1.done && (_a = itemsRaw_1["return"])) _a.call(itemsRaw_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    };
    CommandsArbitrary.prototype.filterOnReplay = function (itemsRaw) {
        var _this = this;
        return itemsRaw.filter(function (c, idx) {
            var state = _this.replayPath[_this.replayPathPosition + idx];
            if (state === undefined)
                throw new Error("Too short replayPath");
            if (!state && c.value_.hasRan)
                throw new Error("Mismatch between replayPath and real execution");
            return state;
        });
    };
    CommandsArbitrary.prototype.filterForShrinkImpl = function (itemsRaw) {
        if (this.replayPathPosition === 0) {
            this.replayPath = this.sourceReplayPath !== null ? ReplayPath.parse(this.sourceReplayPath) : [];
        }
        var items = this.replayPathPosition < this.replayPath.length
            ? this.filterOnReplay(itemsRaw)
            : this.filterOnExecution(itemsRaw);
        this.replayPathPosition += itemsRaw.length;
        return items;
    };
    CommandsArbitrary.prototype.shrinkImpl = function (itemsRaw, shrunkOnce) {
        var items = this.filterForShrinkImpl(itemsRaw);
        if (items.length === 0) {
            return Stream.nil();
        }
        var allShrinks = shrunkOnce
            ? Stream.nil()
            : new Stream([[]][Symbol.iterator]());
        var _loop_1 = function (numToKeep) {
            var size = this_1.lengthArb.shrinkableFor(items.length - 1 - numToKeep, false);
            var fixedStart = items.slice(0, numToKeep);
            allShrinks = allShrinks.join(size.shrink().map(function (l) { return fixedStart.concat(items.slice(items.length - (l.value + 1))); }));
        };
        var this_1 = this;
        for (var numToKeep = 0; numToKeep !== items.length; ++numToKeep) {
            _loop_1(numToKeep);
        }
        var _loop_2 = function (itemAt) {
            allShrinks = allShrinks.join(items[itemAt].shrink().map(function (v) { return items.slice(0, itemAt).concat([v], items.slice(itemAt + 1)); }));
        };
        for (var itemAt = 0; itemAt !== items.length; ++itemAt) {
            _loop_2(itemAt);
        }
        return allShrinks.map(function (shrinkables) {
            return shrinkables.map(function (c) {
                return new Shrinkable(c.value_.clone(), c.shrink);
            });
        });
    };
    return CommandsArbitrary;
}(Arbitrary));
function commands(commandArbs, settings) {
    var config = settings == null ? {} : typeof settings === 'number' ? { maxCommands: settings } : settings;
    return new CommandsArbitrary(commandArbs, config.maxCommands != null ? config.maxCommands : 10, config.replayPath != null ? config.replayPath : null, !!config.disableReplayLog);
}

var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$b = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values$a = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var _this$2 = undefined;
var genericModelRun = function (s, cmds, initialValue, runCmd, then) {
    return s.then(function (o) {
        var e_1, _a;
        var model = o.model, real = o.real;
        var state = initialValue;
        var _loop_1 = function (c) {
            state = then(state, function () {
                return runCmd(c, model, real);
            });
        };
        try {
            for (var cmds_1 = __values$a(cmds), cmds_1_1 = cmds_1.next(); !cmds_1_1.done; cmds_1_1 = cmds_1.next()) {
                var c = cmds_1_1.value;
                _loop_1(c);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cmds_1_1 && !cmds_1_1.done && (_a = cmds_1["return"])) _a.call(cmds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return state;
    });
};
var internalModelRun = function (s, cmds) {
    var then = function (p, c) { return c(); };
    var setupProducer = { then: function (fun) { return fun(s()); } };
    var runSync = function (cmd, m, r) {
        if (cmd.check(m))
            cmd.run(m, r);
    };
    return genericModelRun(setupProducer, cmds, undefined, runSync, then);
};
var isAsyncSetup = function (s) {
    return typeof s.then === 'function';
};
var internalAsyncModelRun = function (s, cmds) { return __awaiter$3(_this$2, void 0, void 0, function () {
    var then, setupProducer, runAsync;
    var _this = this;
    return __generator$b(this, function (_a) {
        switch (_a.label) {
            case 0:
                then = function (p, c) { return p.then(c); };
                setupProducer = {
                    then: function (fun) {
                        var out = s();
                        if (isAsyncSetup(out))
                            return out.then(fun);
                        else
                            return fun(out);
                    }
                };
                runAsync = function (cmd, m, r) { return __awaiter$3(_this, void 0, void 0, function () {
                    return __generator$b(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, cmd.check(m)];
                            case 1:
                                if (!_a.sent()) return [3, 3];
                                return [4, cmd.run(m, r)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2];
                        }
                    });
                }); };
                return [4, genericModelRun(setupProducer, cmds, Promise.resolve(), runAsync, then)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
var modelRun = function (s, cmds) {
    internalModelRun(s, cmds);
};
var asyncModelRun = function (s, cmds) { return __awaiter$3(_this$2, void 0, void 0, function () {
    return __generator$b(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, internalAsyncModelRun(s, cmds)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };

export { Arbitrary, ExecutionStatus, ObjectConstraints, Random, Shrinkable, Stream, VerbosityLevel, anything, array, ascii, asciiString, assert, asyncModelRun, asyncProperty, base64, base64String, bigInt, bigIntN, bigUint, bigUintN, boolean, char, char16bits, check, cloneMethod, clonedConstant, commands, compareBooleanFunc, compareFunc, constant, constantFrom, context, dedup, dictionary, double, float, frequency, fullUnicode, fullUnicodeString, func, genericTuple, hexa, hexaString, infiniteStream, integer, json, jsonObject, lorem, maxSafeInteger, maxSafeNat, modelRun, nat, object, oneof, option, pre, property, record, sample, set, shuffledSubarray, statistics, stream, string, string16bits, stringOf, subarray, tuple, unicode, unicodeJson, unicodeJsonObject, unicodeString };
