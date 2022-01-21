function generateN(rng, num) {
    var cur = rng;
    var out = [];
    for (var idx = 0; idx != num; ++idx) {
        var nextOut = cur.next();
        out.push(nextOut[0]);
        cur = nextOut[1];
    }
    return [out, cur];
}
function skipN(rng, num) {
    return generateN(rng, num)[1];
}

var MULTIPLIER = 0x000343fd;
var INCREMENT = 0x00269ec3;
var MASK = 0xffffffff;
var MASK_2 = (1 << 31) - 1;
var computeNextSeed = function (seed) {
    return (seed * MULTIPLIER + INCREMENT) & MASK;
};
var computeValueFromNextSeed = function (nextseed) {
    return (nextseed & MASK_2) >> 16;
};
var LinearCongruential = (function () {
    function LinearCongruential(seed) {
        this.seed = seed;
    }
    LinearCongruential.prototype.min = function () {
        return LinearCongruential.min;
    };
    LinearCongruential.prototype.max = function () {
        return LinearCongruential.max;
    };
    LinearCongruential.prototype.next = function () {
        var nextseed = computeNextSeed(this.seed);
        return [computeValueFromNextSeed(nextseed), new LinearCongruential(nextseed)];
    };
    LinearCongruential.min = 0;
    LinearCongruential.max = Math.pow(2, 15) - 1;
    return LinearCongruential;
}());
var LinearCongruential32 = (function () {
    function LinearCongruential32(seed) {
        this.seed = seed;
    }
    LinearCongruential32.prototype.min = function () {
        return LinearCongruential32.min;
    };
    LinearCongruential32.prototype.max = function () {
        return LinearCongruential32.max;
    };
    LinearCongruential32.prototype.next = function () {
        var s1 = computeNextSeed(this.seed);
        var v1 = computeValueFromNextSeed(s1);
        var s2 = computeNextSeed(s1);
        var v2 = computeValueFromNextSeed(s2);
        var s3 = computeNextSeed(s2);
        var v3 = computeValueFromNextSeed(s3);
        var vnext = v3 + ((v2 + (v1 << 15)) << 15);
        return [((vnext + 0x80000000) | 0) + 0x80000000, new LinearCongruential32(s3)];
    };
    LinearCongruential32.min = 0;
    LinearCongruential32.max = 0xffffffff;
    return LinearCongruential32;
}());
var congruential = function (seed) {
    return new LinearCongruential(seed);
};
var congruential32 = function (seed) {
    return new LinearCongruential32(seed);
};

function toUint32(num) {
    return (num | 0) >= 0 ? num | 0 : (num | 0) + 4294967296;
}
function product32bits(a, b) {
    var alo = a & 0xffff;
    var ahi = (a >>> 16) & 0xffff;
    var blo = b & 0xffff;
    var bhi = (b >>> 16) & 0xffff;
    return alo * blo + ((alo * bhi + ahi * blo) << 16);
}
var MersenneTwister = (function () {
    function MersenneTwister(states, index) {
        if (index >= MersenneTwister.N) {
            this.states = MersenneTwister.twist(states);
            this.index = 0;
        }
        else {
            this.states = states;
            this.index = index;
        }
    }
    MersenneTwister.twist = function (prev) {
        var mt = prev.slice();
        for (var idx = 0; idx !== MersenneTwister.N; ++idx) {
            var x = (mt[idx] & MersenneTwister.MASK_UPPER) + (mt[(idx + 1) % MersenneTwister.N] & MersenneTwister.MASK_LOWER);
            var xA = x >>> 1;
            if (x & 1) {
                xA ^= MersenneTwister.A;
            }
            mt[idx] = mt[(idx + MersenneTwister.M) % MersenneTwister.N] ^ xA;
        }
        return mt;
    };
    MersenneTwister.seeded = function (seed) {
        var out = Array(MersenneTwister.N);
        out[0] = seed;
        for (var idx = 1; idx !== MersenneTwister.N; ++idx) {
            var xored = out[idx - 1] ^ (out[idx - 1] >>> 30);
            out[idx] = (product32bits(MersenneTwister.F, xored) + idx) | 0;
        }
        return out;
    };
    MersenneTwister.from = function (seed) {
        return new MersenneTwister(MersenneTwister.seeded(seed), MersenneTwister.N);
    };
    MersenneTwister.prototype.min = function () {
        return MersenneTwister.min;
    };
    MersenneTwister.prototype.max = function () {
        return MersenneTwister.max;
    };
    MersenneTwister.prototype.next = function () {
        var y = this.states[this.index];
        y ^= this.states[this.index] >>> MersenneTwister.U;
        y ^= (y << MersenneTwister.S) & MersenneTwister.B;
        y ^= (y << MersenneTwister.T) & MersenneTwister.C;
        y ^= y >>> MersenneTwister.L;
        return [toUint32(y), new MersenneTwister(this.states, this.index + 1)];
    };
    MersenneTwister.min = 0;
    MersenneTwister.max = 0xffffffff;
    MersenneTwister.N = 624;
    MersenneTwister.M = 397;
    MersenneTwister.R = 31;
    MersenneTwister.A = 0x9908b0df;
    MersenneTwister.F = 1812433253;
    MersenneTwister.U = 11;
    MersenneTwister.S = 7;
    MersenneTwister.B = 0x9d2c5680;
    MersenneTwister.T = 15;
    MersenneTwister.C = 0xefc60000;
    MersenneTwister.L = 18;
    MersenneTwister.MASK_LOWER = Math.pow(2, MersenneTwister.R) - 1;
    MersenneTwister.MASK_UPPER = Math.pow(2, MersenneTwister.R);
    return MersenneTwister;
}());
function MersenneTwister$1 (seed) {
    return MersenneTwister.from(seed);
}

var XorShift128Plus = (function () {
    function XorShift128Plus(s01, s00, s11, s10) {
        this.s01 = s01;
        this.s00 = s00;
        this.s11 = s11;
        this.s10 = s10;
    }
    XorShift128Plus.prototype.min = function () {
        return -0x80000000;
    };
    XorShift128Plus.prototype.max = function () {
        return 0x7fffffff;
    };
    XorShift128Plus.prototype.next = function () {
        var a0 = this.s00 ^ (this.s00 << 23);
        var a1 = this.s01 ^ ((this.s01 << 23) | (this.s00 >>> 9));
        var b0 = a0 ^ this.s10 ^ ((a0 >>> 17) | (a1 << 15)) ^ ((this.s10 >>> 26) | (this.s11 << 6));
        var b1 = a1 ^ this.s11 ^ (a1 >>> 17) ^ (this.s11 >>> 26);
        return [(b0 + this.s10) | 0, new XorShift128Plus(this.s11, this.s10, b1, b0)];
    };
    return XorShift128Plus;
}());
var xorshift128plus = function (seed) {
    return new XorShift128Plus(-1, ~seed, 0, seed | 0);
};

function uniformBigIntInternal(from, diff, rng) {
    var MinRng = BigInt(rng.min());
    var NumValues = BigInt(rng.max() - rng.min() + 1);
    var FinalNumValues = NumValues;
    var NumIterations = BigInt(1);
    while (FinalNumValues < diff) {
        FinalNumValues *= NumValues;
        ++NumIterations;
    }
    var MaxAcceptedRandom = FinalNumValues - (FinalNumValues % diff);
    var nrng = rng;
    while (true) {
        var value = BigInt(0);
        for (var num = BigInt(0); num !== NumIterations; ++num) {
            var out = nrng.next();
            value = NumValues * value + (BigInt(out[0]) - MinRng);
            nrng = out[1];
        }
        if (value < MaxAcceptedRandom) {
            var inDiff = value - diff * (value / diff);
            return [inDiff + from, nrng];
        }
    }
}
function uniformBigIntDistribution(from, to, rng) {
    var diff = to - from + BigInt(1);
    if (rng != null) {
        return uniformBigIntInternal(from, diff, rng);
    }
    return function (rng) {
        return uniformBigIntInternal(from, diff, rng);
    };
}

function uniformIntInternal(from, diff, rng) {
    var MinRng = rng.min();
    var NumValues = rng.max() - rng.min() + 1;
    if (diff <= NumValues) {
        var nrng_1 = rng;
        var MaxAllowed = NumValues - (NumValues % diff);
        while (true) {
            var out = nrng_1.next();
            var deltaV = out[0] - MinRng;
            nrng_1 = out[1];
            if (deltaV < MaxAllowed) {
                return [(deltaV % diff) + from, nrng_1];
            }
        }
    }
    var FinalNumValues = 1;
    var NumIterations = 0;
    while (FinalNumValues < diff) {
        FinalNumValues *= NumValues;
        ++NumIterations;
    }
    var MaxAcceptedRandom = diff * Math.floor((1 * FinalNumValues) / diff);
    var nrng = rng;
    while (true) {
        var value = 0;
        for (var num = 0; num !== NumIterations; ++num) {
            var out = nrng.next();
            value = NumValues * value + (out[0] - MinRng);
            nrng = out[1];
        }
        if (value < MaxAcceptedRandom) {
            var inDiff = value - diff * Math.floor((1 * value) / diff);
            return [inDiff + from, nrng];
        }
    }
}
function uniformIntDistribution(from, to, rng) {
    var diff = to - from + 1;
    if (rng != null) {
        return uniformIntInternal(from, diff, rng);
    }
    return function (rng) {
        return uniformIntInternal(from, diff, rng);
    };
}

var prand = /*#__PURE__*/Object.freeze({
    __proto__: null,
    generateN: generateN,
    skipN: skipN,
    congruential: congruential,
    congruential32: congruential32,
    mersenne: MersenneTwister$1,
    xorshift128plus: xorshift128plus,
    uniformBigIntDistribution: uniformBigIntDistribution,
    uniformIntDistribution: uniformIntDistribution
});

export { uniformBigIntDistribution as a, prand as p, skipN as s, uniformIntDistribution as u };
