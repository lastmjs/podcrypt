import { g as global$1 } from '../common/_polyfill-node:global-acbc543a.js';
import { _ as _polyfillNode_buffer } from '../common/_polyfill-node:buffer-b13b85fc.js';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var byteLength_1 = byteLength;
var toByteArray_1 = toByteArray;
var fromByteArray_1 = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens (b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4);

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen;

  var i;
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xFF;
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    );
  }

  return parts.join('')
}

var base64Js = {
	byteLength: byteLength_1,
	toByteArray: toByteArray_1,
	fromByteArray: fromByteArray_1
};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = (nBytes * 8) - mLen - 1;
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
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
};

var write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = (nBytes * 8) - mLen - 1;
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
      m = ((value * c) - 1) * Math.pow(2, mLen);
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
};

var ieee754 = {
	read: read,
	write: write
};

var buffer = createCommonjsModule(function (module, exports) {



var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null;

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

var K_MAX_LENGTH = 0x7fffffff;
exports.kMaxLength = K_MAX_LENGTH;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  );
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1);
    var proto = { foo: function () { return 42 } };
    Object.setPrototypeOf(proto, Uint8Array.prototype);
    Object.setPrototypeOf(arr, proto);
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
});

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
});

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer.prototype);
  return buf
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
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf();
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value);
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
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
  return from(value, encodingOrOffset, length)
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
};

function allocUnsafe (size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
};

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0;
  var buf = createBuffer(length);

  var actual = buf.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  var buf = createBuffer(length);
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView);
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf;
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array);
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype);

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    var buf = createBuffer(len);

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len);
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
};

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
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
  if (!Array.isArray(list)) {
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
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        );
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos);
    }
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length;
  var mustMatch = (arguments.length > 2 && arguments[2] === true);
  if (!mustMatch && len === 0) return 0

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
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
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

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
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

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
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
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.toLocaleString = Buffer.prototype.toString;

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
  if (this.length > max) str += ' ... ';
  return '<Buffer ' + str + '>'
};
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength);
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
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
  byteOffset = +byteOffset; // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
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
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
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

  var strLen = string.length;

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (numberIsNaN(parsed)) return i
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
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
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
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

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
    return base64Js.fromByteArray(buf)
  } else {
    return base64Js.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
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
    out += hexSliceLookupTable[buf[i]];
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
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

  var newBuf = this.subarray(start, end);
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype);

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
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

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
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
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
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
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
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

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength = byteLength >>> 0;
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

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  return offset + 2
};

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  this[offset] = (value >>> 8);
  this[offset + 1] = (value & 0xff);
  return offset + 2
};

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset + 3] = (value >>> 24);
  this[offset + 2] = (value >>> 16);
  this[offset + 1] = (value >>> 8);
  this[offset] = (value & 0xff);
  return offset + 4
};

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  this[offset] = (value >>> 24);
  this[offset + 1] = (value >>> 16);
  this[offset + 2] = (value >>> 8);
  this[offset + 3] = (value & 0xff);
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1);

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
  offset = offset >>> 0;
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1);

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
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  this[offset] = (value >>> 8);
  this[offset + 1] = (value & 0xff);
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  this[offset] = (value & 0xff);
  this[offset + 1] = (value >>> 8);
  this[offset + 2] = (value >>> 16);
  this[offset + 3] = (value >>> 24);
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  this[offset] = (value >>> 24);
  this[offset + 1] = (value >>> 16);
  this[offset + 2] = (value >>> 8);
  this[offset + 3] = (value & 0xff);
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
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
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
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
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
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
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code;
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } else if (typeof val === 'boolean') {
    val = Number(val);
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
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding);
    var len = bytes.length;
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0];
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
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
  return base64Js.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef';
  var table = new Array(256);
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16;
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }
  return table
})();
});

/**
 * Codes used by the replica for rejecting a message.
 * See {@link https://sdk.dfinity.org/docs/interface-spec/#reject-codes | the interface spec}.
 */
var ReplicaRejectCode;
(function (ReplicaRejectCode) {
    ReplicaRejectCode[ReplicaRejectCode["SysFatal"] = 1] = "SysFatal";
    ReplicaRejectCode[ReplicaRejectCode["SysTransient"] = 2] = "SysTransient";
    ReplicaRejectCode[ReplicaRejectCode["DestinationInvalid"] = 3] = "DestinationInvalid";
    ReplicaRejectCode[ReplicaRejectCode["CanisterReject"] = 4] = "CanisterReject";
    ReplicaRejectCode[ReplicaRejectCode["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));

// tslint:disable:no-bitwise
const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
// Build a lookup table for decoding.
const lookupTable = Object.create(null);
for (let i = 0; i < alphabet.length; i++) {
    lookupTable[alphabet[i]] = i;
}
// Add aliases for rfc4648.
lookupTable['0'] = lookupTable.o;
lookupTable['1'] = lookupTable.i;
/**
 * @param input The input array to encode.
 * @returns A Base32 string encoding the input.
 */
function encode(input) {
    // How many bits will we skip from the first byte.
    let skip = 0;
    // 5 high bits, carry from one byte to the next.
    let bits = 0;
    // The output string in base32.
    let output = '';
    function encodeByte(byte) {
        if (skip < 0) {
            // we have a carry from the previous byte
            bits |= byte >> -skip;
        }
        else {
            // no carry
            bits = (byte << skip) & 248;
        }
        if (skip > 3) {
            // Not enough data to produce a character, get us another one
            skip -= 8;
            return 1;
        }
        if (skip < 4) {
            // produce a character
            output += alphabet[bits >> 3];
            skip += 5;
        }
        return 0;
    }
    for (let i = 0; i < input.length;) {
        i += encodeByte(input[i]);
    }
    return output + (skip < 0 ? alphabet[bits >> 3] : '');
}
/**
 * @param input The base32 encoded string to decode.
 */
function decode(input) {
    // how many bits we have from the previous character.
    let skip = 0;
    // current byte we're producing.
    let byte = 0;
    const output = new Uint8Array(((input.length * 4) / 3) | 0);
    let o = 0;
    function decodeChar(char) {
        // Consume a character from the stream, store
        // the output in this.output. As before, better
        // to use update().
        let val = lookupTable[char.toLowerCase()];
        if (val === undefined) {
            throw new Error(`Invalid character: ${JSON.stringify(char)}`);
        }
        // move to the high bits
        val <<= 3;
        byte |= val >>> skip;
        skip += 5;
        if (skip >= 8) {
            // We have enough bytes to produce an output
            output[o++] = byte;
            skip -= 8;
            if (skip > 0) {
                byte = (val << (5 - skip)) & 255;
            }
            else {
                byte = 0;
            }
        }
    }
    for (const c of input) {
        decodeChar(c);
    }
    return output.slice(0, o);
}

// tslint:disable:no-bitwise
// This file is translated to JavaScript from
// https://lxp32.github.io/docs/a-simple-example-crc32-calculation/
const lookUpTable = new Uint32Array([
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
    0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
    0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
    0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
    0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
    0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
    0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
    0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
    0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
    0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
    0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
    0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
    0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
    0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
    0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
    0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
    0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
    0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
    0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
    0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
    0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
    0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d,
]);
/**
 * Calculate the CRC32 of an ArrayBufferLike.
 * @param buf The BufferLike to calculate the CRC32 of.
 */
function getCrc32(buf) {
    const b = new Uint8Array(buf);
    let crc = -1;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < b.length; i++) {
        const byte = b[i];
        const t = (byte ^ crc) & 0xff;
        crc = lookUpTable[t] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
}

/* SNOWPACK PROCESS POLYFILL (based on https://github.com/calvinmetcalf/node-process-es6) */
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== 'undefined') {
    globalContext = window;
} else if (typeof self !== 'undefined') {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = globalContext.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: {"NODE_ENV":"production"},
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var sha256 = createCommonjsModule(function (module) {
/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = commonjsGlobal;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && 'object' === 'object' && module.exports;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
  }
})();
});

/**
 * Returns the SHA224 hash of the buffer.
 * @param data Arraybuffer to encode
 */
function sha224(data) {
    const shaObj = sha256.sha224.create();
    shaObj.update(data);
    return new Uint8Array(shaObj.array());
}

const SELF_AUTHENTICATING_SUFFIX = 2;
const ANONYMOUS_SUFFIX = 4;
const fromHexString = (hexString) => { var _a; return new Uint8Array(((_a = hexString.match(/.{1,2}/g)) !== null && _a !== void 0 ? _a : []).map(byte => parseInt(byte, 16))); };
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
class Principal {
    constructor(_arr) {
        this._arr = _arr;
        this._isPrincipal = true;
    }
    static anonymous() {
        return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
    }
    static selfAuthenticating(publicKey) {
        const sha = sha224(publicKey);
        return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
    }
    static from(other) {
        if (typeof other === 'string') {
            return Principal.fromText(other);
        }
        else if (typeof other === 'object' &&
            other !== null &&
            other._isPrincipal === true) {
            return new Principal(other._arr);
        }
        throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
    }
    static fromHex(hex) {
        return new this(fromHexString(hex));
    }
    static fromText(text) {
        const canisterIdNoDash = text.toLowerCase().replace(/-/g, '');
        let arr = decode(canisterIdNoDash);
        arr = arr.slice(4, arr.length);
        const principal = new this(arr);
        if (principal.toText() !== text) {
            throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${text}" may not be a valid Principal ID).`);
        }
        return principal;
    }
    static fromUint8Array(arr) {
        return new this(arr);
    }
    isAnonymous() {
        return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
    }
    toUint8Array() {
        return this._arr;
    }
    toHex() {
        return toHexString(this._arr).toUpperCase();
    }
    toText() {
        const checksumArrayBuf = new ArrayBuffer(4);
        const view = new DataView(checksumArrayBuf);
        view.setUint32(0, getCrc32(this._arr));
        const checksum = new Uint8Array(checksumArrayBuf);
        const bytes = Uint8Array.from(this._arr);
        const array = new Uint8Array([...checksum, ...bytes]);
        const result = encode(array);
        const matches = result.match(/.{1,5}/g);
        if (!matches) {
            // This should only happen if there's no character, which is unreachable.
            throw new Error();
        }
        return matches.join('-');
    }
    toString() {
        return this.toText();
    }
}

/**
 * An error that happens in the Agent. This is the root of all errors and should be used
 * everywhere in the Agent code (this package).
 *
 * @todo https://github.com/dfinity/agent-js/issues/420
 */
class AgentError extends Error {
}

/**
 * Concatenate multiple array buffers.
 * @param buffers The buffers to concatenate.
 */
function concat(...buffers) {
    const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
    let index = 0;
    for (const b of buffers) {
        result.set(new Uint8Array(b), index);
        index += b.byteLength;
    }
    return result;
}
/**
 * A class that abstracts a pipe-like ArrayBuffer.
 */
class PipeArrayBuffer {
    /**
     * Creates a new instance of a pipe
     * @param buffer an optional buffer to start with
     * @param length an optional amount of bytes to use for the length.
     */
    constructor(buffer, length = (buffer === null || buffer === void 0 ? void 0 : buffer.byteLength) || 0) {
        this._buffer = buffer || new ArrayBuffer(0);
        this._view = new Uint8Array(this._buffer, 0, length);
    }
    get buffer() {
        // Return a copy of the buffer.
        return this._view.slice();
    }
    get byteLength() {
        return this._view.byteLength;
    }
    /**
     * Read `num` number of bytes from the front of the pipe.
     * @param num The number of bytes to read.
     */
    read(num) {
        const result = this._view.subarray(0, num);
        this._view = this._view.subarray(num);
        return result.slice().buffer;
    }
    readUint8() {
        const result = this._view[0];
        this._view = this._view.subarray(1);
        return result;
    }
    /**
     * Write a buffer to the end of the pipe.
     * @param buf The bytes to write.
     */
    write(buf) {
        const b = new Uint8Array(buf);
        const offset = this._view.byteLength;
        if (this._view.byteOffset + this._view.byteLength + b.byteLength >= this._buffer.byteLength) {
            // Alloc grow the view to include the new bytes.
            this.alloc(b.byteLength);
        }
        else {
            // Update the view to include the new bytes.
            this._view = new Uint8Array(this._buffer, this._view.byteOffset, this._view.byteLength + b.byteLength);
        }
        this._view.set(b, offset);
    }
    /**
     * Whether or not there is more data to read from the buffer
     */
    get end() {
        return this._view.byteLength === 0;
    }
    /**
     * Allocate a fixed amount of memory in the buffer. This does not affect the view.
     * @param amount A number of bytes to add to the buffer.
     */
    alloc(amount) {
        // Add a little bit of exponential growth.
        // tslint:disable-next-line:no-bitwise
        const b = new ArrayBuffer(((this._buffer.byteLength + amount) * 1.2) | 0);
        const v = new Uint8Array(b, 0, this._view.byteLength + amount);
        v.set(this._view);
        this._buffer = b;
        this._view = v;
    }
}

/**
 * Hashes a string to a number. Algorithm can be found here:
 * https://caml.inria.fr/pub/papers/garrigue-polymorphic_variants-ml98.pdf
 * @param s
 */
function idlHash(s) {
    const utf8encoder = new TextEncoder();
    const array = utf8encoder.encode(s);
    let h = 0;
    for (const c of array) {
        h = (h * 223 + c) % 2 ** 32;
    }
    return h;
}
/**
 *
 * @param label string
 * @returns number representing hashed label
 */
function idlLabelToId(label) {
    if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
        const num = +label.slice(1, -1);
        if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) {
            return num;
        }
    }
    return idlHash(label);
}

/* eslint-disable no-constant-condition */
function eob() {
    throw new Error('unexpected end of buffer');
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param num number
 * @returns Buffer
 */
function safeRead(pipe, num) {
    if (pipe.byteLength < num) {
        eob();
    }
    return pipe.read(num);
}
/**
 * @param pipe
 */
function safeReadUint8(pipe) {
    const byte = pipe.readUint8();
    if (byte === undefined) {
        eob();
    }
    return byte;
}
/**
 * Encode a positive number (or bigint) into a Buffer. The number will be floored to the
 * nearest integer.
 * @param value The number to encode.
 */
function lebEncode(value) {
    if (typeof value === 'number') {
        value = BigInt(value);
    }
    if (value < BigInt(0)) {
        throw new Error('Cannot leb encode negative values.');
    }
    const byteLength = (value === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value)))) + 1;
    const pipe = new PipeArrayBuffer(new ArrayBuffer(byteLength), 0);
    while (true) {
        const i = Number(value & BigInt(0x7f));
        value /= BigInt(0x80);
        if (value === BigInt(0)) {
            pipe.write(new Uint8Array([i]));
            break;
        }
        else {
            pipe.write(new Uint8Array([i | 0x80]));
        }
    }
    return pipe.buffer;
}
/**
 * Decode a leb encoded buffer into a bigint. The number will always be positive (does not
 * support signed leb encoding).
 * @param pipe A Buffer containing the leb encoded bits.
 */
function lebDecode(pipe) {
    let weight = BigInt(1);
    let value = BigInt(0);
    let byte;
    do {
        byte = safeReadUint8(pipe);
        value += BigInt(byte & 0x7f).valueOf() * weight;
        weight *= BigInt(128);
    } while (byte >= 0x80);
    return value;
}
/**
 * Encode a number (or bigint) into a Buffer, with support for negative numbers. The number
 * will be floored to the nearest integer.
 * @param value The number to encode.
 */
function slebEncode(value) {
    if (typeof value === 'number') {
        value = BigInt(value);
    }
    const isNeg = value < BigInt(0);
    if (isNeg) {
        value = -value - BigInt(1);
    }
    const byteLength = (value === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value)))) + 1;
    const pipe = new PipeArrayBuffer(new ArrayBuffer(byteLength), 0);
    while (true) {
        const i = getLowerBytes(value);
        value /= BigInt(0x80);
        // prettier-ignore
        if ((isNeg && value === BigInt(0) && (i & 0x40) !== 0)
            || (!isNeg && value === BigInt(0) && (i & 0x40) === 0)) {
            pipe.write(new Uint8Array([i]));
            break;
        }
        else {
            pipe.write(new Uint8Array([i | 0x80]));
        }
    }
    function getLowerBytes(num) {
        const bytes = num % BigInt(0x80);
        if (isNeg) {
            // We swap the bits here again, and remove 1 to do two's complement.
            return Number(BigInt(0x80) - bytes - BigInt(1));
        }
        else {
            return Number(bytes);
        }
    }
    return pipe.buffer;
}
/**
 * Decode a leb encoded buffer into a bigint. The number is decoded with support for negative
 * signed-leb encoding.
 * @param pipe A Buffer containing the signed leb encoded bits.
 */
function slebDecode(pipe) {
    // Get the size of the buffer, then cut a buffer of that size.
    const pipeView = new Uint8Array(pipe.buffer);
    let len = 0;
    for (; len < pipeView.byteLength; len++) {
        if (pipeView[len] < 0x80) {
            // If it's a positive number, we reuse lebDecode.
            if ((pipeView[len] & 0x40) === 0) {
                return lebDecode(pipe);
            }
            break;
        }
    }
    const bytes = new Uint8Array(safeRead(pipe, len + 1));
    let value = BigInt(0);
    for (let i = bytes.byteLength - 1; i >= 0; i--) {
        value = value * BigInt(0x80) + BigInt(0x80 - (bytes[i] & 0x7f) - 1);
    }
    return -value - BigInt(1);
}
/**
 *
 * @param value bigint or number
 * @param byteLength number
 * @returns Buffer
 */
function writeUIntLE(value, byteLength) {
    if (BigInt(value) < BigInt(0)) {
        throw new Error('Cannot write negative values.');
    }
    return writeIntLE(value, byteLength);
}
/**
 *
 * @param value
 * @param byteLength
 */
function writeIntLE(value, byteLength) {
    value = BigInt(value);
    const pipe = new PipeArrayBuffer(new ArrayBuffer(Math.min(1, byteLength)), 0);
    let i = 0;
    let mul = BigInt(256);
    let sub = BigInt(0);
    let byte = Number(value % mul);
    pipe.write(new Uint8Array([byte]));
    while (++i < byteLength) {
        if (value < 0 && sub === BigInt(0) && byte !== 0) {
            sub = BigInt(1);
        }
        byte = Number((value / mul - sub) % BigInt(256));
        pipe.write(new Uint8Array([byte]));
        mul *= BigInt(256);
    }
    return pipe.buffer;
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param byteLength number
 * @returns bigint
 */
function readUIntLE(pipe, byteLength) {
    let val = BigInt(safeReadUint8(pipe));
    let mul = BigInt(1);
    let i = 0;
    while (++i < byteLength) {
        mul *= BigInt(256);
        const byte = BigInt(safeReadUint8(pipe));
        val = val + mul * byte;
    }
    return val;
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param byteLength number
 * @returns bigint
 */
function readIntLE(pipe, byteLength) {
    let val = readUIntLE(pipe, byteLength);
    const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
    if (val >= mul) {
        val -= mul * BigInt(2);
    }
    return val;
}

// tslint:disable:max-classes-per-file
const magicNumber = 'DIDL';
function zipWith(xs, ys, f) {
    return xs.map((x, i) => f(x, ys[i]));
}
/**
 * An IDL Type Table, which precedes the data in the stream.
 */
class TypeTable {
    constructor() {
        // List of types. Needs to be an array as the index needs to be stable.
        this._typs = [];
        this._idx = new Map();
    }
    has(obj) {
        return this._idx.has(obj.name);
    }
    add(type, buf) {
        const idx = this._typs.length;
        this._idx.set(type.name, idx);
        this._typs.push(buf);
    }
    merge(obj, knot) {
        const idx = this._idx.get(obj.name);
        const knotIdx = this._idx.get(knot);
        if (idx === undefined) {
            throw new Error('Missing type index for ' + obj);
        }
        if (knotIdx === undefined) {
            throw new Error('Missing type index for ' + knot);
        }
        this._typs[idx] = this._typs[knotIdx];
        // Delete the type.
        this._typs.splice(knotIdx, 1);
        this._idx.delete(knot);
    }
    encode() {
        const len = lebEncode(this._typs.length);
        const buf = concat(...this._typs);
        return concat(len, buf);
    }
    indexOf(typeName) {
        if (!this._idx.has(typeName)) {
            throw new Error('Missing type index for ' + typeName);
        }
        return slebEncode(this._idx.get(typeName) || 0);
    }
}
class Visitor {
    visitType(t, data) {
        throw new Error('Not implemented');
    }
    visitPrimitive(t, data) {
        return this.visitType(t, data);
    }
    visitEmpty(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitBool(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitNull(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitReserved(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitText(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitNumber(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitInt(t, data) {
        return this.visitNumber(t, data);
    }
    visitNat(t, data) {
        return this.visitNumber(t, data);
    }
    visitFloat(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitFixedInt(t, data) {
        return this.visitNumber(t, data);
    }
    visitFixedNat(t, data) {
        return this.visitNumber(t, data);
    }
    visitPrincipal(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitConstruct(t, data) {
        return this.visitType(t, data);
    }
    visitVec(t, ty, data) {
        return this.visitConstruct(t, data);
    }
    visitOpt(t, ty, data) {
        return this.visitConstruct(t, data);
    }
    visitRecord(t, fields, data) {
        return this.visitConstruct(t, data);
    }
    visitTuple(t, components, data) {
        const fields = components.map((ty, i) => [`_${i}_`, ty]);
        return this.visitRecord(t, fields, data);
    }
    visitVariant(t, fields, data) {
        return this.visitConstruct(t, data);
    }
    visitRec(t, ty, data) {
        return this.visitConstruct(ty, data);
    }
    visitFunc(t, data) {
        return this.visitConstruct(t, data);
    }
    visitService(t, data) {
        return this.visitConstruct(t, data);
    }
}
/**
 * Represents an IDL type.
 */
class Type {
    /* Display type name */
    display() {
        return this.name;
    }
    valueToString(x) {
        return toReadableString(x);
    }
    /* Implement `T` in the IDL spec, only needed for non-primitive types */
    buildTypeTable(typeTable) {
        if (!typeTable.has(this)) {
            this._buildTypeTableImpl(typeTable);
        }
    }
}
class PrimitiveType extends Type {
    checkType(t) {
        if (this.name !== t.name) {
            throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
        }
        return t;
    }
    _buildTypeTableImpl(typeTable) {
        // No type table encoding for Primitive types.
        return;
    }
}
class ConstructType extends Type {
    checkType(t) {
        if (t instanceof RecClass) {
            const ty = t.getType();
            if (typeof ty === 'undefined') {
                throw new Error('type mismatch with uninitialized type');
            }
            return ty;
        }
        throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
    }
    encodeType(typeTable) {
        return typeTable.indexOf(this.name);
    }
}
/**
 * Represents an IDL Empty, a type which has no inhabitants.
 * Since no values exist for this type, it cannot be serialised or deserialised.
 * Result types like `Result<Text, Empty>` should always succeed.
 */
class EmptyClass extends PrimitiveType {
    accept(v, d) {
        return v.visitEmpty(this, d);
    }
    covariant(x) {
        return false;
    }
    encodeValue() {
        throw new Error('Empty cannot appear as a function argument');
    }
    valueToString() {
        throw new Error('Empty cannot appear as a value');
    }
    encodeType() {
        return slebEncode(-17 /* Empty */);
    }
    decodeValue() {
        throw new Error('Empty cannot appear as an output');
    }
    get name() {
        return 'empty';
    }
}
/**
 * Represents an IDL Bool
 */
class BoolClass extends PrimitiveType {
    accept(v, d) {
        return v.visitBool(this, d);
    }
    covariant(x) {
        return typeof x === 'boolean';
    }
    encodeValue(x) {
        return new Uint8Array([x ? 1 : 0]);
    }
    encodeType() {
        return slebEncode(-2 /* Bool */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        switch (safeReadUint8(b)) {
            case 0:
                return false;
            case 1:
                return true;
            default:
                throw new Error('Boolean value out of range');
        }
    }
    get name() {
        return 'bool';
    }
}
/**
 * Represents an IDL Null
 */
class NullClass extends PrimitiveType {
    accept(v, d) {
        return v.visitNull(this, d);
    }
    covariant(x) {
        return x === null;
    }
    encodeValue() {
        return new ArrayBuffer(0);
    }
    encodeType() {
        return slebEncode(-1 /* Null */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return null;
    }
    get name() {
        return 'null';
    }
}
/**
 * Represents an IDL Reserved
 */
class ReservedClass extends PrimitiveType {
    accept(v, d) {
        return v.visitReserved(this, d);
    }
    covariant(x) {
        return true;
    }
    encodeValue() {
        return new ArrayBuffer(0);
    }
    encodeType() {
        return slebEncode(-16 /* Reserved */);
    }
    decodeValue(b, t) {
        if (t.name !== this.name) {
            t.decodeValue(b, t);
        }
        return null;
    }
    get name() {
        return 'reserved';
    }
}
/**
 * Represents an IDL Text
 */
class TextClass extends PrimitiveType {
    accept(v, d) {
        return v.visitText(this, d);
    }
    covariant(x) {
        return typeof x === 'string';
    }
    encodeValue(x) {
        const buf = new TextEncoder().encode(x);
        const len = lebEncode(buf.byteLength);
        return concat(len, buf);
    }
    encodeType() {
        return slebEncode(-15 /* Text */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const len = lebDecode(b);
        const buf = safeRead(b, Number(len));
        const decoder = new TextDecoder('utf8', { fatal: true });
        return decoder.decode(buf);
    }
    get name() {
        return 'text';
    }
    valueToString(x) {
        return '"' + x + '"';
    }
}
/**
 * Represents an IDL Int
 */
class IntClass extends PrimitiveType {
    accept(v, d) {
        return v.visitInt(this, d);
    }
    covariant(x) {
        // We allow encoding of JavaScript plain numbers.
        // But we will always decode to bigint.
        return typeof x === 'bigint' || Number.isInteger(x);
    }
    encodeValue(x) {
        return slebEncode(x);
    }
    encodeType() {
        return slebEncode(-4 /* Int */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return slebDecode(b);
    }
    get name() {
        return 'int';
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Nat
 */
class NatClass extends PrimitiveType {
    accept(v, d) {
        return v.visitNat(this, d);
    }
    covariant(x) {
        // We allow encoding of JavaScript plain numbers.
        // But we will always decode to bigint.
        return (typeof x === 'bigint' && x >= BigInt(0)) || (Number.isInteger(x) && x >= 0);
    }
    encodeValue(x) {
        return lebEncode(x);
    }
    encodeType() {
        return slebEncode(-3 /* Nat */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return lebDecode(b);
    }
    get name() {
        return 'nat';
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Float
 */
class FloatClass extends PrimitiveType {
    constructor(_bits) {
        super();
        this._bits = _bits;
        if (_bits !== 32 && _bits !== 64) {
            throw new Error('not a valid float type');
        }
    }
    accept(v, d) {
        return v.visitFloat(this, d);
    }
    covariant(x) {
        return typeof x === 'number' || x instanceof Number;
    }
    encodeValue(x) {
        const buf = new ArrayBuffer(this._bits / 8);
        const view = new DataView(buf);
        if (this._bits === 32) {
            view.setFloat32(0, x, true);
        }
        else {
            view.setFloat64(0, x, true);
        }
        return buf;
    }
    encodeType() {
        const opcode = this._bits === 32 ? -13 /* Float32 */ : -14 /* Float64 */;
        return slebEncode(opcode);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const bytes = safeRead(b, this._bits / 8);
        const view = new DataView(bytes);
        if (this._bits === 32) {
            return view.getFloat32(0, true);
        }
        else {
            return view.getFloat64(0, true);
        }
    }
    get name() {
        return 'float' + this._bits;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL fixed-width Int(n)
 */
class FixedIntClass extends PrimitiveType {
    constructor(_bits) {
        super();
        this._bits = _bits;
    }
    accept(v, d) {
        return v.visitFixedInt(this, d);
    }
    covariant(x) {
        const min = BigInt(2) ** BigInt(this._bits - 1) * BigInt(-1);
        const max = BigInt(2) ** BigInt(this._bits - 1) - BigInt(1);
        if (typeof x === 'bigint') {
            return x >= min && x <= max;
        }
        else if (Number.isInteger(x)) {
            const v = BigInt(x);
            return v >= min && v <= max;
        }
        else {
            return false;
        }
    }
    encodeValue(x) {
        return writeIntLE(x, this._bits / 8);
    }
    encodeType() {
        const offset = Math.log2(this._bits) - 3;
        return slebEncode(-9 - offset);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const num = readIntLE(b, this._bits / 8);
        if (this._bits <= 32) {
            return Number(num);
        }
        else {
            return num;
        }
    }
    get name() {
        return `int${this._bits}`;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL fixed-width Nat(n)
 */
class FixedNatClass extends PrimitiveType {
    constructor(bits) {
        super();
        this.bits = bits;
    }
    accept(v, d) {
        return v.visitFixedNat(this, d);
    }
    covariant(x) {
        const max = BigInt(2) ** BigInt(this.bits);
        if (typeof x === 'bigint' && x >= BigInt(0)) {
            return x < max;
        }
        else if (Number.isInteger(x) && x >= 0) {
            const v = BigInt(x);
            return v < max;
        }
        else {
            return false;
        }
    }
    encodeValue(x) {
        return writeUIntLE(x, this.bits / 8);
    }
    encodeType() {
        const offset = Math.log2(this.bits) - 3;
        return slebEncode(-5 - offset);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const num = readUIntLE(b, this.bits / 8);
        if (this.bits <= 32) {
            return Number(num);
        }
        else {
            return num;
        }
    }
    get name() {
        return `nat${this.bits}`;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Array
 * @param {Type} t
 */
class VecClass extends ConstructType {
    constructor(_type) {
        super();
        this._type = _type;
        // If true, this vector is really a blob and we can just use memcpy.
        this._blobOptimization = false;
        if (_type instanceof FixedNatClass && _type.bits === 8) {
            this._blobOptimization = true;
        }
    }
    accept(v, d) {
        return v.visitVec(this, this._type, d);
    }
    covariant(x) {
        return Array.isArray(x) && x.every(v => this._type.covariant(v));
    }
    encodeValue(x) {
        const len = lebEncode(x.length);
        if (this._blobOptimization) {
            return concat(len, new Uint8Array(x));
        }
        return concat(len, ...x.map(d => this._type.encodeValue(d)));
    }
    _buildTypeTableImpl(typeTable) {
        this._type.buildTypeTable(typeTable);
        const opCode = slebEncode(-19 /* Vector */);
        const buffer = this._type.encodeType(typeTable);
        typeTable.add(this, concat(opCode, buffer));
    }
    decodeValue(b, t) {
        const vec = this.checkType(t);
        if (!(vec instanceof VecClass)) {
            throw new Error('Not a vector type');
        }
        const len = Number(lebDecode(b));
        if (this._blobOptimization) {
            return [...new Uint8Array(b.read(len))];
        }
        const rets = [];
        for (let i = 0; i < len; i++) {
            rets.push(this._type.decodeValue(b, vec._type));
        }
        return rets;
    }
    get name() {
        return `vec ${this._type.name}`;
    }
    display() {
        return `vec ${this._type.display()}`;
    }
    valueToString(x) {
        const elements = x.map(e => this._type.valueToString(e));
        return 'vec {' + elements.join('; ') + '}';
    }
}
/**
 * Represents an IDL Option
 * @param {Type} t
 */
class OptClass extends ConstructType {
    constructor(_type) {
        super();
        this._type = _type;
    }
    accept(v, d) {
        return v.visitOpt(this, this._type, d);
    }
    covariant(x) {
        return Array.isArray(x) && (x.length === 0 || (x.length === 1 && this._type.covariant(x[0])));
    }
    encodeValue(x) {
        if (x.length === 0) {
            return new Uint8Array([0]);
        }
        else {
            return concat(new Uint8Array([1]), this._type.encodeValue(x[0]));
        }
    }
    _buildTypeTableImpl(typeTable) {
        this._type.buildTypeTable(typeTable);
        const opCode = slebEncode(-18 /* Opt */);
        const buffer = this._type.encodeType(typeTable);
        typeTable.add(this, concat(opCode, buffer));
    }
    decodeValue(b, t) {
        const opt = this.checkType(t);
        if (!(opt instanceof OptClass)) {
            throw new Error('Not an option type');
        }
        switch (safeReadUint8(b)) {
            case 0:
                return [];
            case 1:
                return [this._type.decodeValue(b, opt._type)];
            default:
                throw new Error('Not an option value');
        }
    }
    get name() {
        return `opt ${this._type.name}`;
    }
    display() {
        return `opt ${this._type.display()}`;
    }
    valueToString(x) {
        if (x.length === 0) {
            return 'null';
        }
        else {
            return `opt ${this._type.valueToString(x[0])}`;
        }
    }
}
/**
 * Represents an IDL Record
 * @param {Object} [fields] - mapping of function name to Type
 */
class RecordClass extends ConstructType {
    constructor(fields = {}) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
    }
    accept(v, d) {
        return v.visitRecord(this, this._fields, d);
    }
    tryAsTuple() {
        const res = [];
        for (let i = 0; i < this._fields.length; i++) {
            const [key, type] = this._fields[i];
            if (key !== `_${i}_`) {
                return null;
            }
            res.push(type);
        }
        return res;
    }
    covariant(x) {
        return (typeof x === 'object' &&
            this._fields.every(([k, t]) => {
                // eslint-disable-next-line
                if (!x.hasOwnProperty(k)) {
                    throw new Error(`Record is missing key "${k}".`);
                }
                return t.covariant(x[k]);
            }));
    }
    encodeValue(x) {
        const values = this._fields.map(([key]) => x[key]);
        const bufs = zipWith(this._fields, values, ([, c], d) => c.encodeValue(d));
        return concat(...bufs);
    }
    _buildTypeTableImpl(T) {
        this._fields.forEach(([_, value]) => value.buildTypeTable(T));
        const opCode = slebEncode(-20 /* Record */);
        const len = lebEncode(this._fields.length);
        const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(T)));
        T.add(this, concat(opCode, len, concat(...fields)));
    }
    decodeValue(b, t) {
        const record = this.checkType(t);
        if (!(record instanceof RecordClass)) {
            throw new Error('Not a record type');
        }
        const x = {};
        let idx = 0;
        for (const [hash, type] of record._fields) {
            if (idx >= this._fields.length || idlLabelToId(this._fields[idx][0]) !== idlLabelToId(hash)) {
                // skip field
                type.decodeValue(b, type);
                continue;
            }
            const [expectKey, expectType] = this._fields[idx];
            x[expectKey] = expectType.decodeValue(b, type);
            idx++;
        }
        if (idx < this._fields.length) {
            throw new Error('Cannot find field ' + this._fields[idx][0]);
        }
        return x;
    }
    get name() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.name);
        return `record {${fields.join('; ')}}`;
    }
    display() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.display());
        return `record {${fields.join('; ')}}`;
    }
    valueToString(x) {
        const values = this._fields.map(([key]) => x[key]);
        const fields = zipWith(this._fields, values, ([k, c], d) => k + '=' + c.valueToString(d));
        return `record {${fields.join('; ')}}`;
    }
}
/**
 * Represents Tuple, a syntactic sugar for Record.
 * @param {Type} components
 */
class TupleClass extends RecordClass {
    constructor(_components) {
        const x = {};
        _components.forEach((e, i) => (x['_' + i + '_'] = e));
        super(x);
        this._components = _components;
    }
    accept(v, d) {
        return v.visitTuple(this, this._components, d);
    }
    covariant(x) {
        // `>=` because tuples can be covariant when encoded.
        return (Array.isArray(x) &&
            x.length >= this._fields.length &&
            this._components.every((t, i) => t.covariant(x[i])));
    }
    encodeValue(x) {
        const bufs = zipWith(this._components, x, (c, d) => c.encodeValue(d));
        return concat(...bufs);
    }
    decodeValue(b, t) {
        const tuple = this.checkType(t);
        if (!(tuple instanceof TupleClass)) {
            throw new Error('not a tuple type');
        }
        if (tuple._components.length < this._components.length) {
            throw new Error('tuple mismatch');
        }
        const res = [];
        for (const [i, wireType] of tuple._components.entries()) {
            if (i >= this._components.length) {
                // skip value
                wireType.decodeValue(b, wireType);
            }
            else {
                res.push(this._components[i].decodeValue(b, wireType));
            }
        }
        return res;
    }
    display() {
        const fields = this._components.map(value => value.display());
        return `record {${fields.join('; ')}}`;
    }
    valueToString(values) {
        const fields = zipWith(this._components, values, (c, d) => c.valueToString(d));
        return `record {${fields.join('; ')}}`;
    }
}
/**
 * Represents an IDL Variant
 * @param {Object} [fields] - mapping of function name to Type
 */
class VariantClass extends ConstructType {
    constructor(fields = {}) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
    }
    accept(v, d) {
        return v.visitVariant(this, this._fields, d);
    }
    covariant(x) {
        return (typeof x === 'object' &&
            Object.entries(x).length === 1 &&
            this._fields.every(([k, v]) => {
                // eslint-disable-next-line
                return !x.hasOwnProperty(k) || v.covariant(x[k]);
            }));
    }
    encodeValue(x) {
        for (let i = 0; i < this._fields.length; i++) {
            const [name, type] = this._fields[i];
            // eslint-disable-next-line
            if (x.hasOwnProperty(name)) {
                const idx = lebEncode(i);
                const buf = type.encodeValue(x[name]);
                return concat(idx, buf);
            }
        }
        throw Error('Variant has no data: ' + x);
    }
    _buildTypeTableImpl(typeTable) {
        this._fields.forEach(([, type]) => {
            type.buildTypeTable(typeTable);
        });
        const opCode = slebEncode(-21 /* Variant */);
        const len = lebEncode(this._fields.length);
        const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(typeTable)));
        typeTable.add(this, concat(opCode, len, ...fields));
    }
    decodeValue(b, t) {
        const variant = this.checkType(t);
        if (!(variant instanceof VariantClass)) {
            throw new Error('Not a variant type');
        }
        const idx = Number(lebDecode(b));
        if (idx >= variant._fields.length) {
            throw Error('Invalid variant index: ' + idx);
        }
        const [wireHash, wireType] = variant._fields[idx];
        for (const [key, expectType] of this._fields) {
            if (idlLabelToId(wireHash) === idlLabelToId(key)) {
                const value = expectType.decodeValue(b, wireType);
                return { [key]: value };
            }
        }
        throw new Error('Cannot find field hash ' + wireHash);
    }
    get name() {
        const fields = this._fields.map(([key, type]) => key + ':' + type.name);
        return `variant {${fields.join('; ')}}`;
    }
    display() {
        const fields = this._fields.map(([key, type]) => key + (type.name === 'null' ? '' : `:${type.display()}`));
        return `variant {${fields.join('; ')}}`;
    }
    valueToString(x) {
        for (const [name, type] of this._fields) {
            // eslint-disable-next-line
            if (x.hasOwnProperty(name)) {
                const value = type.valueToString(x[name]);
                if (value === 'null') {
                    return `variant {${name}}`;
                }
                else {
                    return `variant {${name}=${value}}`;
                }
            }
        }
        throw new Error('Variant has no data: ' + x);
    }
}
/**
 * Represents a reference to an IDL type, used for defining recursive data
 * types.
 */
class RecClass extends ConstructType {
    constructor() {
        super(...arguments);
        this._id = RecClass._counter++;
        this._type = undefined;
    }
    accept(v, d) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return v.visitRec(this, this._type, d);
    }
    fill(t) {
        this._type = t;
    }
    getType() {
        return this._type;
    }
    covariant(x) {
        return this._type ? this._type.covariant(x) : false;
    }
    encodeValue(x) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.encodeValue(x);
    }
    _buildTypeTableImpl(typeTable) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        typeTable.add(this, new Uint8Array([]));
        this._type.buildTypeTable(typeTable);
        typeTable.merge(this, this._type.name);
    }
    decodeValue(b, t) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.decodeValue(b, t);
    }
    get name() {
        return `rec_${this._id}`;
    }
    display() {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return `μ${this.name}.${this._type.name}`;
    }
    valueToString(x) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.valueToString(x);
    }
}
RecClass._counter = 0;
function decodePrincipalId(b) {
    const x = safeReadUint8(b);
    if (x !== 1) {
        throw new Error('Cannot decode principal');
    }
    const len = Number(lebDecode(b));
    return Principal.fromUint8Array(new Uint8Array(safeRead(b, len)));
}
/**
 * Represents an IDL principal reference
 */
class PrincipalClass extends PrimitiveType {
    accept(v, d) {
        return v.visitPrincipal(this, d);
    }
    covariant(x) {
        return x && x._isPrincipal;
    }
    encodeValue(x) {
        const buf = x.toUint8Array();
        const len = lebEncode(buf.byteLength);
        return concat(new Uint8Array([1]), len, buf);
    }
    encodeType() {
        return slebEncode(-24 /* Principal */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return decodePrincipalId(b);
    }
    get name() {
        return 'principal';
    }
    valueToString(x) {
        return `${this.name} "${x.toText()}"`;
    }
}
/**
 * Represents an IDL function reference.
 * @param argTypes Argument types.
 * @param retTypes Return types.
 * @param annotations Function annotations.
 */
class FuncClass extends ConstructType {
    constructor(argTypes, retTypes, annotations = []) {
        super();
        this.argTypes = argTypes;
        this.retTypes = retTypes;
        this.annotations = annotations;
    }
    static argsToString(types, v) {
        if (types.length !== v.length) {
            throw new Error('arity mismatch');
        }
        return '(' + types.map((t, i) => t.valueToString(v[i])).join(', ') + ')';
    }
    accept(v, d) {
        return v.visitFunc(this, d);
    }
    covariant(x) {
        return (Array.isArray(x) && x.length === 2 && x[0] && x[0]._isPrincipal && typeof x[1] === 'string');
    }
    encodeValue([principal, methodName]) {
        const buf = principal.toUint8Array();
        const len = lebEncode(buf.byteLength);
        const canister = concat(new Uint8Array([1]), len, buf);
        const method = new TextEncoder().encode(methodName);
        const methodLen = lebEncode(method.byteLength);
        return concat(new Uint8Array([1]), canister, methodLen, method);
    }
    _buildTypeTableImpl(T) {
        this.argTypes.forEach(arg => arg.buildTypeTable(T));
        this.retTypes.forEach(arg => arg.buildTypeTable(T));
        const opCode = slebEncode(-22 /* Func */);
        const argLen = lebEncode(this.argTypes.length);
        const args = concat(...this.argTypes.map(arg => arg.encodeType(T)));
        const retLen = lebEncode(this.retTypes.length);
        const rets = concat(...this.retTypes.map(arg => arg.encodeType(T)));
        const annLen = lebEncode(this.annotations.length);
        const anns = concat(...this.annotations.map(a => this.encodeAnnotation(a)));
        T.add(this, concat(opCode, argLen, args, retLen, rets, annLen, anns));
    }
    decodeValue(b) {
        const x = safeReadUint8(b);
        if (x !== 1) {
            throw new Error('Cannot decode function reference');
        }
        const canister = decodePrincipalId(b);
        const mLen = Number(lebDecode(b));
        const buf = safeRead(b, mLen);
        const decoder = new TextDecoder('utf8', { fatal: true });
        const method = decoder.decode(buf);
        return [canister, method];
    }
    get name() {
        const args = this.argTypes.map(arg => arg.name).join(', ');
        const rets = this.retTypes.map(arg => arg.name).join(', ');
        const annon = ' ' + this.annotations.join(' ');
        return `(${args}) -> (${rets})${annon}`;
    }
    valueToString([principal, str]) {
        return `func "${principal.toText()}".${str}`;
    }
    display() {
        const args = this.argTypes.map(arg => arg.display()).join(', ');
        const rets = this.retTypes.map(arg => arg.display()).join(', ');
        const annon = ' ' + this.annotations.join(' ');
        return `(${args}) → (${rets})${annon}`;
    }
    encodeAnnotation(ann) {
        if (ann === 'query') {
            return new Uint8Array([1]);
        }
        else if (ann === 'oneway') {
            return new Uint8Array([2]);
        }
        else {
            throw new Error('Illeagal function annotation');
        }
    }
}
class ServiceClass extends ConstructType {
    constructor(fields) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
    }
    accept(v, d) {
        return v.visitService(this, d);
    }
    covariant(x) {
        return x && x._isPrincipal;
    }
    encodeValue(x) {
        const buf = x.toUint8Array();
        const len = lebEncode(buf.length);
        return concat(new Uint8Array([1]), len, buf);
    }
    _buildTypeTableImpl(T) {
        this._fields.forEach(([_, func]) => func.buildTypeTable(T));
        const opCode = slebEncode(-23 /* Service */);
        const len = lebEncode(this._fields.length);
        const meths = this._fields.map(([label, func]) => {
            const labelBuf = new TextEncoder().encode(label);
            const labelLen = lebEncode(labelBuf.length);
            return concat(labelLen, labelBuf, func.encodeType(T));
        });
        T.add(this, concat(opCode, len, ...meths));
    }
    decodeValue(b) {
        return decodePrincipalId(b);
    }
    get name() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.name);
        return `service {${fields.join('; ')}}`;
    }
    valueToString(x) {
        return `service "${x.toText()}"`;
    }
}
/**
 *
 * @param x
 * @returns {string}
 */
function toReadableString(x) {
    return JSON.stringify(x, (_key, value) => typeof value === 'bigint' ? `BigInt(${value})` : value);
}
/**
 * Encode a array of values
 * @param argTypes
 * @param args
 * @returns {Buffer} serialised value
 */
function encode$1(argTypes, args) {
    if (args.length < argTypes.length) {
        throw Error('Wrong number of message arguments');
    }
    const typeTable = new TypeTable();
    argTypes.forEach(t => t.buildTypeTable(typeTable));
    const magic = new TextEncoder().encode(magicNumber);
    const table = typeTable.encode();
    const len = lebEncode(args.length);
    const typs = concat(...argTypes.map(t => t.encodeType(typeTable)));
    const vals = concat(...zipWith(argTypes, args, (t, x) => {
        if (!t.covariant(x)) {
            throw new Error(`Invalid ${t.display()} argument: ${toReadableString(x)}`);
        }
        return t.encodeValue(x);
    }));
    return concat(magic, table, len, typs, vals);
}
/**
 * Decode a binary value
 * @param retTypes - Types expected in the buffer.
 * @param bytes - hex-encoded string, or buffer.
 * @returns Value deserialised to JS type
 */
function decode$1(retTypes, bytes) {
    const b = new PipeArrayBuffer(bytes);
    if (bytes.byteLength < magicNumber.length) {
        throw new Error('Message length smaller than magic number');
    }
    const magicBuffer = safeRead(b, magicNumber.length);
    const magic = new TextDecoder().decode(magicBuffer);
    if (magic !== magicNumber) {
        throw new Error('Wrong magic number: ' + JSON.stringify(magic));
    }
    function readTypeTable(pipe) {
        const typeTable = [];
        const len = Number(lebDecode(pipe));
        for (let i = 0; i < len; i++) {
            const ty = Number(slebDecode(pipe));
            switch (ty) {
                case -18 /* Opt */:
                case -19 /* Vector */: {
                    const t = Number(slebDecode(pipe));
                    typeTable.push([ty, t]);
                    break;
                }
                case -20 /* Record */:
                case -21 /* Variant */: {
                    const fields = [];
                    let objectLength = Number(lebDecode(pipe));
                    let prevHash;
                    while (objectLength--) {
                        const hash = Number(lebDecode(pipe));
                        if (hash >= Math.pow(2, 32)) {
                            throw new Error('field id out of 32-bit range');
                        }
                        if (typeof prevHash === 'number' && prevHash >= hash) {
                            throw new Error('field id collision or not sorted');
                        }
                        prevHash = hash;
                        const t = Number(slebDecode(pipe));
                        fields.push([hash, t]);
                    }
                    typeTable.push([ty, fields]);
                    break;
                }
                case -22 /* Func */: {
                    for (let k = 0; k < 2; k++) {
                        let funcLength = Number(lebDecode(pipe));
                        while (funcLength--) {
                            slebDecode(pipe);
                        }
                    }
                    const annLen = Number(lebDecode(pipe));
                    safeRead(pipe, annLen);
                    typeTable.push([ty, undefined]);
                    break;
                }
                case -23 /* Service */: {
                    let servLength = Number(lebDecode(pipe));
                    while (servLength--) {
                        const l = Number(lebDecode(pipe));
                        safeRead(pipe, l);
                        slebDecode(pipe);
                    }
                    typeTable.push([ty, undefined]);
                    break;
                }
                default:
                    throw new Error('Illegal op_code: ' + ty);
            }
        }
        const rawList = [];
        const length = Number(lebDecode(pipe));
        for (let i = 0; i < length; i++) {
            rawList.push(Number(slebDecode(pipe)));
        }
        return [typeTable, rawList];
    }
    const [rawTable, rawTypes] = readTypeTable(b);
    if (rawTypes.length < retTypes.length) {
        throw new Error('Wrong number of return values');
    }
    const table = rawTable.map(_ => Rec());
    function getType(t) {
        if (t < -24) {
            throw new Error('future value not supported');
        }
        if (t < 0) {
            switch (t) {
                case -1:
                    return Null;
                case -2:
                    return Bool;
                case -3:
                    return Nat;
                case -4:
                    return Int;
                case -5:
                    return Nat8;
                case -6:
                    return Nat16;
                case -7:
                    return Nat32;
                case -8:
                    return Nat64;
                case -9:
                    return Int8;
                case -10:
                    return Int16;
                case -11:
                    return Int32;
                case -12:
                    return Int64;
                case -13:
                    return Float32;
                case -14:
                    return Float64;
                case -15:
                    return Text;
                case -16:
                    return Reserved;
                case -17:
                    return Empty;
                case -24:
                    return Principal$1;
                default:
                    throw new Error('Illegal op_code: ' + t);
            }
        }
        if (t >= rawTable.length) {
            throw new Error('type index out of range');
        }
        return table[t];
    }
    function buildType(entry) {
        switch (entry[0]) {
            case -19 /* Vector */: {
                const ty = getType(entry[1]);
                return Vec(ty);
            }
            case -18 /* Opt */: {
                const ty = getType(entry[1]);
                return Opt(ty);
            }
            case -20 /* Record */: {
                const fields = {};
                for (const [hash, ty] of entry[1]) {
                    const name = `_${hash}_`;
                    fields[name] = getType(ty);
                }
                const record = Record(fields);
                const tuple = record.tryAsTuple();
                if (Array.isArray(tuple)) {
                    return Tuple(...tuple);
                }
                else {
                    return record;
                }
            }
            case -21 /* Variant */: {
                const fields = {};
                for (const [hash, ty] of entry[1]) {
                    const name = `_${hash}_`;
                    fields[name] = getType(ty);
                }
                return Variant(fields);
            }
            case -22 /* Func */: {
                return Func([], [], []);
            }
            case -23 /* Service */: {
                return Service({});
            }
            default:
                throw new Error('Illegal op_code: ' + entry[0]);
        }
    }
    rawTable.forEach((entry, i) => {
        const t = buildType(entry);
        table[i].fill(t);
    });
    const types = rawTypes.map(t => getType(t));
    const output = retTypes.map((t, i) => {
        return t.decodeValue(b, types[i]);
    });
    // skip unused values
    for (let ind = retTypes.length; ind < types.length; ind++) {
        types[ind].decodeValue(b, types[ind]);
    }
    if (b.byteLength > 0) {
        throw new Error('decode: Left-over bytes');
    }
    return output;
}
// Export Types instances.
const Empty = new EmptyClass();
const Reserved = new ReservedClass();
const Bool = new BoolClass();
const Null = new NullClass();
const Text = new TextClass();
const Int = new IntClass();
const Nat = new NatClass();
const Float32 = new FloatClass(32);
const Float64 = new FloatClass(64);
const Int8 = new FixedIntClass(8);
const Int16 = new FixedIntClass(16);
const Int32 = new FixedIntClass(32);
const Int64 = new FixedIntClass(64);
const Nat8 = new FixedNatClass(8);
const Nat16 = new FixedNatClass(16);
const Nat32 = new FixedNatClass(32);
const Nat64 = new FixedNatClass(64);
const Principal$1 = new PrincipalClass();
/**
 *
 * @param types array of any types
 * @returns TupleClass from those types
 */
function Tuple(...types) {
    return new TupleClass(types);
}
/**
 *
 * @param t IDL Type
 * @returns VecClass from that type
 */
function Vec(t) {
    return new VecClass(t);
}
/**
 *
 * @param t IDL Type
 * @returns OptClass of Type
 */
function Opt(t) {
    return new OptClass(t);
}
/**
 *
 * @param t Record of string and IDL Type
 * @returns RecordClass of string and Type
 */
function Record(t) {
    return new RecordClass(t);
}
/**
 *
 * @param fields Record of string and IDL Type
 * @returns VariantClass
 */
function Variant(fields) {
    return new VariantClass(fields);
}
/**
 *
 * @returns new RecClass
 */
function Rec() {
    return new RecClass();
}
/**
 *
 * @param args array of IDL Types
 * @param ret array of IDL Types
 * @param annotations array of strings, [] by default
 * @returns new FuncClass
 */
function Func(args, ret, annotations = []) {
    return new FuncClass(args, ret, annotations);
}
/**
 *
 * @param t Record of string and FuncClass
 * @returns ServiceClass
 */
function Service(t) {
    return new ServiceClass(t);
}

var IDL = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Visitor: Visitor,
	Type: Type,
	PrimitiveType: PrimitiveType,
	ConstructType: ConstructType,
	EmptyClass: EmptyClass,
	BoolClass: BoolClass,
	NullClass: NullClass,
	ReservedClass: ReservedClass,
	TextClass: TextClass,
	IntClass: IntClass,
	NatClass: NatClass,
	FloatClass: FloatClass,
	FixedIntClass: FixedIntClass,
	FixedNatClass: FixedNatClass,
	VecClass: VecClass,
	OptClass: OptClass,
	RecordClass: RecordClass,
	TupleClass: TupleClass,
	VariantClass: VariantClass,
	RecClass: RecClass,
	PrincipalClass: PrincipalClass,
	FuncClass: FuncClass,
	ServiceClass: ServiceClass,
	encode: encode$1,
	decode: decode$1,
	Empty: Empty,
	Reserved: Reserved,
	Bool: Bool,
	Null: Null,
	Text: Text,
	Int: Int,
	Nat: Nat,
	Float32: Float32,
	Float64: Float64,
	Int8: Int8,
	Int16: Int16,
	Int32: Int32,
	Int64: Int64,
	Nat8: Nat8,
	Nat16: Nat16,
	Nat32: Nat32,
	Nat64: Nat64,
	Principal: Principal$1,
	Tuple: Tuple,
	Vec: Vec,
	Opt: Opt,
	Record: Record,
	Variant: Variant,
	Rec: Rec,
	Func: Func,
	Service: Service
});

var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 1e14, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], SQRT_BASE = 1e7, MAX = 1e9;
function clone(configObject) {
  var div, convertBase, parseNumeric, P = BigNumber2.prototype = {constructor: BigNumber2, toString: null, valueOf: null}, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: " ",
    suffix: ""
  }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
  function BigNumber2(v, b) {
    var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
    if (!(x instanceof BigNumber2))
      return new BigNumber2(v, b);
    if (b == null) {
      if (v && v._isBigNumber === true) {
        x.s = v.s;
        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }
        return;
      }
      if ((isNum = typeof v == "number") && v * 0 == 0) {
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++)
            ;
          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }
          return;
        }
        str = String(v);
      } else {
        if (!isNumeric.test(str = String(v)))
          return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }
      if ((e = str.indexOf(".")) > -1)
        str = str.replace(".", "");
      if ((i = str.search(/e/i)) > 0) {
        if (e < 0)
          e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {
        e = str.length;
      }
    } else {
      intCheck(b, 2, ALPHABET.length, "Base");
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber2(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }
      str = String(v);
      if (isNum = typeof v == "number") {
        if (v * 0 != 0)
          return parseNumeric(x, str, isNum, b);
        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
        if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
          throw Error(tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }
      alphabet = ALPHABET.slice(0, b);
      e = i = 0;
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == ".") {
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {
            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }
          return parseNumeric(x, String(v), isNum, b);
        }
      }
      isNum = false;
      str = convertBase(str, b, 10, x.s);
      if ((e = str.indexOf(".")) > -1)
        str = str.replace(".", "");
      else
        e = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++)
      ;
    for (len = str.length; str.charCodeAt(--len) === 48; )
      ;
    if (str = str.slice(i, ++len)) {
      len -= i;
      if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
        throw Error(tooManyDigits + x.s * v);
      }
      if ((e = e - i - 1) > MAX_EXP) {
        x.c = x.e = null;
      } else if (e < MIN_EXP) {
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];
        i = (e + 1) % LOG_BASE;
        if (e < 0)
          i += LOG_BASE;
        if (i < len) {
          if (i)
            x.c.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len; ) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }
          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }
        for (; i--; str += "0")
          ;
        x.c.push(+str);
      }
    } else {
      x.c = [x.e = 0];
    }
  }
  BigNumber2.clone = clone;
  BigNumber2.ROUND_UP = 0;
  BigNumber2.ROUND_DOWN = 1;
  BigNumber2.ROUND_CEIL = 2;
  BigNumber2.ROUND_FLOOR = 3;
  BigNumber2.ROUND_HALF_UP = 4;
  BigNumber2.ROUND_HALF_DOWN = 5;
  BigNumber2.ROUND_HALF_EVEN = 6;
  BigNumber2.ROUND_HALF_CEIL = 7;
  BigNumber2.ROUND_HALF_FLOOR = 8;
  BigNumber2.EUCLID = 9;
  BigNumber2.config = BigNumber2.set = function(obj) {
    var p, v;
    if (obj != null) {
      if (typeof obj == "object") {
        if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }
        if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }
        if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }
        if (obj.hasOwnProperty(p = "RANGE")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error(bignumberError + p + " cannot be zero: " + v);
            }
          }
        }
        if (obj.hasOwnProperty(p = "CRYPTO")) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error(bignumberError + "crypto unavailable");
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error(bignumberError + p + " not true or false: " + v);
          }
        }
        if (obj.hasOwnProperty(p = "MODULO_MODE")) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }
        if (obj.hasOwnProperty(p = "POW_PRECISION")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }
        if (obj.hasOwnProperty(p = "FORMAT")) {
          v = obj[p];
          if (typeof v == "object")
            FORMAT = v;
          else
            throw Error(bignumberError + p + " not an object: " + v);
        }
        if (obj.hasOwnProperty(p = "ALPHABET")) {
          v = obj[p];
          if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
            ALPHABET = v;
          } else {
            throw Error(bignumberError + p + " invalid: " + v);
          }
        }
      } else {
        throw Error(bignumberError + "Object expected: " + obj);
      }
    }
    return {
      DECIMAL_PLACES,
      ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO,
      MODULO_MODE,
      POW_PRECISION,
      FORMAT,
      ALPHABET
    };
  };
  BigNumber2.isBigNumber = function(v) {
    if (!v || v._isBigNumber !== true)
      return false;
    if (!BigNumber2.DEBUG)
      return true;
    var i, n, c = v.c, e = v.e, s = v.s;
    out:
      if ({}.toString.call(c) == "[object Array]") {
        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
          if (c[0] === 0) {
            if (e === 0 && c.length === 1)
              return true;
            break out;
          }
          i = (e + 1) % LOG_BASE;
          if (i < 1)
            i += LOG_BASE;
          if (String(c[0]).length == i) {
            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n))
                break out;
            }
            if (n !== 0)
              return true;
          }
        }
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }
    throw Error(bignumberError + "Invalid BigNumber: " + v);
  };
  BigNumber2.maximum = BigNumber2.max = function() {
    return maxOrMin(arguments, P.lt);
  };
  BigNumber2.minimum = BigNumber2.min = function() {
    return maxOrMin(arguments, P.gt);
  };
  BigNumber2.random = function() {
    var pow2_53 = 9007199254740992;
    var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
      return mathfloor(Math.random() * pow2_53);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(dp) {
      var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
      if (dp == null)
        dp = DECIMAL_PLACES;
      else
        intCheck(dp, 0, MAX);
      k = mathceil(dp / LOG_BASE);
      if (CRYPTO) {
        if (crypto.getRandomValues) {
          a = crypto.getRandomValues(new Uint32Array(k *= 2));
          for (; i < k; ) {
            v = a[i] * 131072 + (a[i + 1] >>> 11);
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;
        } else if (crypto.randomBytes) {
          a = crypto.randomBytes(k *= 7);
          for (; i < k; ) {
            v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error(bignumberError + "crypto unavailable");
        }
      }
      if (!CRYPTO) {
        for (; i < k; ) {
          v = random53bitInt();
          if (v < 9e15)
            c[i++] = v % 1e14;
        }
      }
      k = c[--i];
      dp %= LOG_BASE;
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }
      for (; c[i] === 0; c.pop(), i--)
        ;
      if (i < 0) {
        c = [e = 0];
      } else {
        for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE)
          ;
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++)
          ;
        if (i < LOG_BASE)
          e -= LOG_BASE - i;
      }
      rand.e = e;
      rand.c = c;
      return rand;
    };
  }();
  BigNumber2.sum = function() {
    var i = 1, args = arguments, sum = new BigNumber2(args[0]);
    for (; i < args.length; )
      sum = sum.plus(args[i++]);
    return sum;
  };
  convertBase = function() {
    var decimal = "0123456789";
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j, arr = [0], arrL, i = 0, len = str.length;
      for (; i < len; ) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn)
          ;
        arr[0] += alphabet.indexOf(str.charAt(i++));
        for (j = 0; j < arr.length; j++) {
          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null)
              arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }
      return arr.reverse();
    }
    return function(str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
      if (i >= 0) {
        k = POW_PRECISION;
        POW_PRECISION = 0;
        str = str.replace(".", "");
        y = new BigNumber2(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;
        y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, "0"), 10, baseOut, decimal);
        y.e = y.c.length;
      }
      xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
      e = k = xc.length;
      for (; xc[--k] == 0; xc.pop())
        ;
      if (!xc[0])
        return alphabet.charAt(0);
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }
      d = e + dp + 1;
      i = xc[d];
      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;
      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
      if (d < 1 || !xc[0]) {
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {
        xc.length = d;
        if (r) {
          for (--baseOut; ++xc[--d] > baseOut; ) {
            xc[d] = 0;
            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }
        for (k = xc.length; !xc[--k]; )
          ;
        for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++]))
          ;
        str = toFixedPoint(str, e, alphabet.charAt(0));
      }
      return str;
    };
  }();
  div = function() {
    function multiply(x, k, base) {
      var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
      for (x = x.slice(); i--; ) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }
      if (carry)
        x = [carry].concat(x);
      return x;
    }
    function compare2(a, b, aL, bL) {
      var i, cmp;
      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {
        for (i = cmp = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return cmp;
    }
    function subtract(a, b, aL, base) {
      var i = 0;
      for (; aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; a.splice(0, 1))
        ;
    }
    return function(x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
      if (!xc || !xc[0] || !yc || !yc[0]) {
        return new BigNumber2(!x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
      }
      q = new BigNumber2(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;
      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }
      for (i = 0; yc[i] == (xc[i] || 0); i++)
        ;
      if (yc[i] > (xc[i] || 0))
        e--;
      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;
        n = mathfloor(base / (yc[0] + 1));
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }
        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; rem[remL++] = 0)
          ;
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2)
          yc0++;
        do {
          n = 0;
          cmp = compare2(yc, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL)
              rem0 = rem0 * base + (rem[1] || 0);
            n = mathfloor(rem0 / yc0);
            if (n > 1) {
              if (n >= base)
                n = base - 1;
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;
              while (compare2(prod, rem, prodL, remL) == 1) {
                n--;
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {
              if (n == 0) {
                cmp = n = 1;
              }
              prod = yc.slice();
              prodL = prod.length;
            }
            if (prodL < remL)
              prod = [0].concat(prod);
            subtract(rem, prod, remL, base);
            remL = rem.length;
            if (cmp == -1) {
              while (compare2(yc, rem, yL, remL) < 1) {
                n++;
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          }
          qc[i++] = n;
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);
        more = rem[0] != null;
        if (!qc[0])
          qc.splice(0, 1);
      }
      if (base == BASE) {
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++)
          ;
        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
      } else {
        q.e = e;
        q.r = +more;
      }
      return q;
    };
  }();
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;
    if (rm == null)
      rm = ROUNDING_MODE;
    else
      intCheck(rm, 0, 8);
    if (!n.c)
      return n.toString();
    c0 = n.c[0];
    ne = n.e;
    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
    } else {
      n = round(new BigNumber2(n), i, rm);
      e = n.e;
      str = coeffToString(n.c);
      len = str.length;
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
        for (; len < i; str += "0", len++)
          ;
        str = toExponential(str, e);
      } else {
        i -= ne;
        str = toFixedPoint(str, e, "0");
        if (e + 1 > len) {
          if (--i > 0)
            for (str += "."; i--; str += "0")
              ;
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len)
              str += ".";
            for (; i--; str += "0")
              ;
          }
        }
      }
    }
    return n.s < 0 && c0 ? "-" + str : str;
  }
  function maxOrMin(args, method) {
    var n, i = 1, m = new BigNumber2(args[0]);
    for (; i < args.length; i++) {
      n = new BigNumber2(args[i]);
      if (!n.s) {
        m = n;
        break;
      } else if (method.call(m, n)) {
        m = n;
      }
    }
    return m;
  }
  function normalise(n, c, e) {
    var i = 1, j = c.length;
    for (; !c[--j]; c.pop())
      ;
    for (j = c[0]; j >= 10; j /= 10, i++)
      ;
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
      n.c = n.e = null;
    } else if (e < MIN_EXP) {
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }
    return n;
  }
  parseNumeric = function() {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(x, str, isNum, b) {
      var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {
          s = s.replace(basePrefix, function(m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;
            s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
          }
          if (str != s)
            return new BigNumber2(s, base);
        }
        if (BigNumber2.DEBUG) {
          throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
        }
        x.s = null;
      }
      x.c = x.e = null;
    };
  }();
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
    if (xc) {
      out: {
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++)
          ;
        i = sd - d;
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];
          rd = n / pows10[d - j - 1] % 10 | 0;
        } else {
          ni = mathceil((i + 1) / LOG_BASE);
          if (ni >= xc.length) {
            if (r) {
              for (; xc.length <= ni; xc.push(0))
                ;
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];
            for (d = 1; k >= 10; k /= 10, d++)
              ;
            i %= LOG_BASE;
            j = i - LOG_BASE + d;
            rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
          }
        }
        r = r || sd < 0 || xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
        r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xc[0]) {
          xc.length = 0;
          if (r) {
            sd -= x.e + 1;
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {
            xc[0] = x.e = 0;
          }
          return x;
        }
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }
        if (r) {
          for (; ; ) {
            if (ni == 0) {
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++)
                ;
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++)
                ;
              if (i != k) {
                x.e++;
                if (xc[0] == BASE)
                  xc[0] = 1;
              }
              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE)
                break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }
        for (i = xc.length; xc[--i] === 0; xc.pop())
          ;
      }
      if (x.e > MAX_EXP) {
        x.c = x.e = null;
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }
    return x;
  }
  function valueOf(n) {
    var str, e = n.e;
    if (e === null)
      return n.toString();
    str = coeffToString(n.c);
    str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
    return n.s < 0 ? "-" + str : str;
  }
  P.absoluteValue = P.abs = function() {
    var x = new BigNumber2(this);
    if (x.s < 0)
      x.s = 1;
    return x;
  };
  P.comparedTo = function(y, b) {
    return compare(this, new BigNumber2(y, b));
  };
  P.decimalPlaces = P.dp = function(dp, rm) {
    var c, n, v, x = this;
    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      return round(new BigNumber2(x), dp + x.e + 1, rm);
    }
    if (!(c = x.c))
      return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
    if (v = c[v])
      for (; v % 10 == 0; v /= 10, n--)
        ;
    if (n < 0)
      n = 0;
    return n;
  };
  P.dividedBy = P.div = function(y, b) {
    return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };
  P.dividedToIntegerBy = P.idiv = function(y, b) {
    return div(this, new BigNumber2(y, b), 0, 1);
  };
  P.exponentiatedBy = P.pow = function(n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
    n = new BigNumber2(n);
    if (n.c && !n.isInteger()) {
      throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
    }
    if (m != null)
      m = new BigNumber2(m);
    nIsBig = n.e > 14;
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
      y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? 2 - isOdd(n) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }
    nIsNeg = n.s < 0;
    if (m) {
      if (m.c ? !m.c[0] : !m.s)
        return new BigNumber2(NaN);
      isModExp = !nIsNeg && x.isInteger() && m.isInteger();
      if (isModExp)
        x = x.mod(m);
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
      k = x.s < 0 && isOdd(n) ? -0 : 0;
      if (x.e > -1)
        k = 1 / k;
      return new BigNumber2(nIsNeg ? 1 / k : k);
    } else if (POW_PRECISION) {
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }
    if (nIsBig) {
      half = new BigNumber2(0.5);
      if (nIsNeg)
        n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }
    y = new BigNumber2(ONE);
    for (; ; ) {
      if (nIsOdd) {
        y = y.times(x);
        if (!y.c)
          break;
        if (k) {
          if (y.c.length > k)
            y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);
        }
      }
      if (i) {
        i = mathfloor(i / 2);
        if (i === 0)
          break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);
        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0)
            break;
          nIsOdd = i % 2;
        }
      }
      x = x.times(x);
      if (k) {
        if (x.c && x.c.length > k)
          x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);
      }
    }
    if (isModExp)
      return y;
    if (nIsNeg)
      y = ONE.div(y);
    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };
  P.integerValue = function(rm) {
    var n = new BigNumber2(this);
    if (rm == null)
      rm = ROUNDING_MODE;
    else
      intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };
  P.isEqualTo = P.eq = function(y, b) {
    return compare(this, new BigNumber2(y, b)) === 0;
  };
  P.isFinite = function() {
    return !!this.c;
  };
  P.isGreaterThan = P.gt = function(y, b) {
    return compare(this, new BigNumber2(y, b)) > 0;
  };
  P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
    return (b = compare(this, new BigNumber2(y, b))) === 1 || b === 0;
  };
  P.isInteger = function() {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };
  P.isLessThan = P.lt = function(y, b) {
    return compare(this, new BigNumber2(y, b)) < 0;
  };
  P.isLessThanOrEqualTo = P.lte = function(y, b) {
    return (b = compare(this, new BigNumber2(y, b))) === -1 || b === 0;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = function() {
    return this.s < 0;
  };
  P.isPositive = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.c && this.c[0] == 0;
  };
  P.minus = function(y, b) {
    var i, j, t, xLTy, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b)
      return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc)
        return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
      if (!xc[0] || !yc[0]) {
        return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : ROUNDING_MODE == 3 ? -0 : 0);
      }
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }
      t.reverse();
      for (b = a; b--; t.push(0))
        ;
      t.reverse();
    } else {
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }
    if (xLTy)
      t = xc, xc = yc, yc = t, y.s = -y.s;
    b = (j = yc.length) - (i = xc.length);
    if (b > 0)
      for (; b--; xc[i++] = 0)
        ;
    b = BASE - 1;
    for (; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b)
          ;
        --xc[i];
        xc[j] += BASE;
      }
      xc[j] -= yc[j];
    }
    for (; xc[0] == 0; xc.splice(0, 1), --ye)
      ;
    if (!xc[0]) {
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }
    return normalise(y, xc, ye);
  };
  P.modulo = P.mod = function(y, b) {
    var q, s, x = this;
    y = new BigNumber2(y, b);
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber2(NaN);
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber2(x);
    }
    if (MODULO_MODE == 9) {
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }
    y = x.minus(q.times(y));
    if (!y.c[0] && MODULO_MODE == 1)
      y.s = x.s;
    return y;
  };
  P.multipliedBy = P.times = function(y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
    if (!xc || !yc || !xc[0] || !yc[0]) {
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;
        if (!xc || !yc) {
          y.c = y.e = null;
        } else {
          y.c = [0];
          y.e = 0;
        }
      }
      return y;
    }
    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;
    if (xcL < ycL)
      zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;
    for (i = xcL + ycL, zc = []; i--; zc.push(0))
      ;
    base = BASE;
    sqrtBase = SQRT_BASE;
    for (i = ycL; --i >= 0; ) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;
      for (k = xcL, j = i + k; j > i; ) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }
      zc[j] = c;
    }
    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }
    return normalise(y, zc, e);
  };
  P.negated = function() {
    var x = new BigNumber2(this);
    x.s = -x.s || null;
    return x;
  };
  P.plus = function(y, b) {
    var t, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b)
      return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc)
        return new BigNumber2(a / 0);
      if (!xc[0] || !yc[0])
        return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }
      t.reverse();
      for (; a--; t.push(0))
        ;
      t.reverse();
    }
    a = xc.length;
    b = yc.length;
    if (a - b < 0)
      t = yc, yc = xc, xc = t, b = a;
    for (a = 0; b; ) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }
    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }
    return normalise(y, xc, ye);
  };
  P.precision = P.sd = function(sd, rm) {
    var c, n, v, x = this;
    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null)
        rm = ROUNDING_MODE;
      else
        intCheck(rm, 0, 8);
      return round(new BigNumber2(x), sd, rm);
    }
    if (!(c = x.c))
      return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;
    if (v = c[v]) {
      for (; v % 10 == 0; v /= 10, n--)
        ;
      for (v = c[0]; v >= 10; v /= 10, n++)
        ;
    }
    if (sd && x.e + 1 > n)
      n = x.e + 1;
    return n;
  };
  P.shiftedBy = function(k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times("1e" + k);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }
    s = Math.sqrt(+valueOf(x));
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0)
        n += "0";
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n = "5e" + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e;
      }
      r = new BigNumber2(n);
    } else {
      r = new BigNumber2(s + "");
    }
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3)
        s = 0;
      for (; ; ) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));
        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
          if (r.e < e)
            --s;
          n = n.slice(s - 3, s + 1);
          if (n == "9999" || !rep && n == "4999") {
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);
              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }
            dp += 4;
            s += 4;
            rep = 1;
          } else {
            if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }
            break;
          }
        }
      }
    }
    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };
  P.toExponential = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };
  P.toFixed = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };
  P.toFormat = function(dp, rm, format2) {
    var str, x = this;
    if (format2 == null) {
      if (dp != null && rm && typeof rm == "object") {
        format2 = rm;
        rm = null;
      } else if (dp && typeof dp == "object") {
        format2 = dp;
        dp = rm = null;
      } else {
        format2 = FORMAT;
      }
    } else if (typeof format2 != "object") {
      throw Error(bignumberError + "Argument not an object: " + format2);
    }
    str = x.toFixed(dp, rm);
    if (x.c) {
      var i, arr = str.split("."), g1 = +format2.groupSize, g2 = +format2.secondaryGroupSize, groupSeparator = format2.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
      if (g2)
        i = g1, g1 = g2, g2 = i, len -= i;
      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1)
          intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0)
          intPart += groupSeparator + intDigits.slice(i);
        if (isNeg)
          intPart = "-" + intPart;
      }
      str = fractionPart ? intPart + (format2.decimalSeparator || "") + ((g2 = +format2.fractionGroupSize) ? fractionPart.replace(new RegExp("\\d{" + g2 + "}\\B", "g"), "$&" + (format2.fractionGroupSeparator || "")) : fractionPart) : intPart;
    }
    return (format2.prefix || "") + str + (format2.suffix || "");
  };
  P.toFraction = function(md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
    if (md != null) {
      n = new BigNumber2(md);
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
      }
    }
    if (!xc)
      return new BigNumber2(x);
    d = new BigNumber2(ONE);
    n1 = d0 = new BigNumber2(ONE);
    d1 = n0 = new BigNumber2(ONE);
    s = coeffToString(xc);
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber2(s);
    n0.c[0] = 0;
    for (; ; ) {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1)
        break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }
    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
    MAX_EXP = exp;
    return r;
  };
  P.toNumber = function() {
    return +valueOf(this);
  };
  P.toPrecision = function(sd, rm) {
    if (sd != null)
      intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };
  P.toString = function(b) {
    var str, n = this, s = n.s, e = n.e;
    if (e === null) {
      if (s) {
        str = "Infinity";
        if (s < 0)
          str = "-" + str;
      } else {
        str = "NaN";
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, "0");
      } else {
        intCheck(b, 2, ALPHABET.length, "Base");
        str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
      }
      if (s < 0 && n.c[0])
        str = "-" + str;
    }
    return str;
  };
  P.valueOf = P.toJSON = function() {
    return valueOf(this);
  };
  P._isBigNumber = true;
  P[Symbol.toStringTag] = "BigNumber";
  P[Symbol.for("nodejs.util.inspect.custom")] = P.valueOf;
  if (configObject != null)
    BigNumber2.set(configObject);
  return BigNumber2;
}
function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}
function coeffToString(a) {
  var s, z, i = 1, j = a.length, r = a[0] + "";
  for (; i < j; ) {
    s = a[i++] + "";
    z = LOG_BASE - s.length;
    for (; z--; s = "0" + s)
      ;
    r += s;
  }
  for (j = r.length; r.charCodeAt(--j) === 48; )
    ;
  return r.slice(0, j + 1 || 1);
}
function compare(x, y) {
  var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!i || !j)
    return null;
  a = xc && !xc[0];
  b = yc && !yc[0];
  if (a || b)
    return a ? b ? 0 : -j : i;
  if (i != j)
    return i;
  a = i < 0;
  b = k == l;
  if (!xc || !yc)
    return b ? 0 : !xc ^ a ? 1 : -1;
  if (!b)
    return k > l ^ a ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = 0; i < j; i++)
    if (xc[i] != yc[i])
      return xc[i] > yc[i] ^ a ? 1 : -1;
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
  }
}
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
}
function toFixedPoint(str, e, z) {
  var len, zs;
  if (e < 0) {
    for (zs = z + "."; ++e; zs += z)
      ;
    str = zs + str;
  } else {
    len = str.length;
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z)
        ;
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + "." + str.slice(e);
    }
  }
  return str;
}
var BigNumber = clone();

var bignumber = /*#__PURE__*/Object.freeze({
	__proto__: null,
	BigNumber: BigNumber,
	'default': BigNumber
});

/* eslint-disable */

var decoder_asm = function decodeAsm (stdlib, foreign, buffer) {
  'use asm';

  // -- Imports

  var heap = new stdlib.Uint8Array(buffer);
  // var log = foreign.log
  var pushInt = foreign.pushInt;
  var pushInt32 = foreign.pushInt32;
  var pushInt32Neg = foreign.pushInt32Neg;
  var pushInt64 = foreign.pushInt64;
  var pushInt64Neg = foreign.pushInt64Neg;
  var pushFloat = foreign.pushFloat;
  var pushFloatSingle = foreign.pushFloatSingle;
  var pushFloatDouble = foreign.pushFloatDouble;
  var pushTrue = foreign.pushTrue;
  var pushFalse = foreign.pushFalse;
  var pushUndefined = foreign.pushUndefined;
  var pushNull = foreign.pushNull;
  var pushInfinity = foreign.pushInfinity;
  var pushInfinityNeg = foreign.pushInfinityNeg;
  var pushNaN = foreign.pushNaN;
  var pushNaNNeg = foreign.pushNaNNeg;

  var pushArrayStart = foreign.pushArrayStart;
  var pushArrayStartFixed = foreign.pushArrayStartFixed;
  var pushArrayStartFixed32 = foreign.pushArrayStartFixed32;
  var pushArrayStartFixed64 = foreign.pushArrayStartFixed64;
  var pushObjectStart = foreign.pushObjectStart;
  var pushObjectStartFixed = foreign.pushObjectStartFixed;
  var pushObjectStartFixed32 = foreign.pushObjectStartFixed32;
  var pushObjectStartFixed64 = foreign.pushObjectStartFixed64;

  var pushByteString = foreign.pushByteString;
  var pushByteStringStart = foreign.pushByteStringStart;
  var pushUtf8String = foreign.pushUtf8String;
  var pushUtf8StringStart = foreign.pushUtf8StringStart;

  var pushSimpleUnassigned = foreign.pushSimpleUnassigned;

  var pushTagStart = foreign.pushTagStart;
  var pushTagStart4 = foreign.pushTagStart4;
  var pushTagStart8 = foreign.pushTagStart8;
  var pushTagUnassigned = foreign.pushTagUnassigned;

  var pushBreak = foreign.pushBreak;

  var pow = stdlib.Math.pow;

  // -- Constants


  // -- Mutable Variables

  var offset = 0;
  var inputLength = 0;
  var code = 0;

  // Decode a cbor string represented as Uint8Array
  // which is allocated on the heap from 0 to inputLength
  //
  // input - Int
  //
  // Returns Code - Int,
  // Success = 0
  // Error > 0
  function parse (input) {
    input = input | 0;

    offset = 0;
    inputLength = input;

    while ((offset | 0) < (inputLength | 0)) {
      code = jumpTable[heap[offset] & 255](heap[offset] | 0) | 0;

      if ((code | 0) > 0) {
        break
      }
    }

    return code | 0
  }

  // -- Helper Function

  function checkOffset (n) {
    n = n | 0;

    if ((((offset | 0) + (n | 0)) | 0) < (inputLength | 0)) {
      return 0
    }

    return 1
  }

  function readUInt16 (n) {
    n = n | 0;

    return (
      (heap[n | 0] << 8) | heap[(n + 1) | 0]
    ) | 0
  }

  function readUInt32 (n) {
    n = n | 0;

    return (
      (heap[n | 0] << 24) | (heap[(n + 1) | 0] << 16) | (heap[(n + 2) | 0] << 8) | heap[(n + 3) | 0]
    ) | 0
  }

  // -- Initial Byte Handlers

  function INT_P (octet) {
    octet = octet | 0;

    pushInt(octet | 0);

    offset = (offset + 1) | 0;

    return 0
  }

  function UINT_P_8 (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushInt(heap[(offset + 1) | 0] | 0);

    offset = (offset + 2) | 0;

    return 0
  }

  function UINT_P_16 (octet) {
    octet = octet | 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    pushInt(
      readUInt16((offset + 1) | 0) | 0
    );

    offset = (offset + 3) | 0;

    return 0
  }

  function UINT_P_32 (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushInt32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    );

    offset = (offset + 5) | 0;

    return 0
  }

  function UINT_P_64 (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushInt64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    );

    offset = (offset + 9) | 0;

    return 0
  }

  function INT_N (octet) {
    octet = octet | 0;

    pushInt((-1 - ((octet - 32) | 0)) | 0);

    offset = (offset + 1) | 0;

    return 0
  }

  function UINT_N_8 (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushInt(
      (-1 - (heap[(offset + 1) | 0] | 0)) | 0
    );

    offset = (offset + 2) | 0;

    return 0
  }

  function UINT_N_16 (octet) {
    octet = octet | 0;

    var val = 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    val = readUInt16((offset + 1) | 0) | 0;
    pushInt((-1 - (val | 0)) | 0);

    offset = (offset + 3) | 0;

    return 0
  }

  function UINT_N_32 (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushInt32Neg(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    );

    offset = (offset + 5) | 0;

    return 0
  }

  function UINT_N_64 (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushInt64Neg(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    );

    offset = (offset + 9) | 0;

    return 0
  }

  function BYTE_STRING (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var step = 0;

    step = (octet - 64) | 0;
    if (checkOffset(step | 0) | 0) {
      return 1
    }

    start = (offset + 1) | 0;
    end = (((offset + 1) | 0) + (step | 0)) | 0;

    pushByteString(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function BYTE_STRING_8 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    length = heap[(offset + 1) | 0] | 0;
    start = (offset + 2) | 0;
    end = (((offset + 2) | 0) + (length | 0)) | 0;

    if (checkOffset((length + 1) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function BYTE_STRING_16 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    length = readUInt16((offset + 1) | 0) | 0;
    start = (offset + 3) | 0;
    end = (((offset + 3) | 0) + (length | 0)) | 0;


    if (checkOffset((length + 2) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function BYTE_STRING_32 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    length = readUInt32((offset + 1) | 0) | 0;
    start = (offset + 5) | 0;
    end = (((offset + 5) | 0) + (length | 0)) | 0;


    if (checkOffset((length + 4) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function BYTE_STRING_64 (octet) {
    // NOT IMPLEMENTED
    octet = octet | 0;

    return 1
  }

  function BYTE_STRING_BREAK (octet) {
    octet = octet | 0;

    pushByteStringStart();

    offset = (offset + 1) | 0;

    return 0
  }

  function UTF8_STRING (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var step = 0;

    step = (octet - 96) | 0;

    if (checkOffset(step | 0) | 0) {
      return 1
    }

    start = (offset + 1) | 0;
    end = (((offset + 1) | 0) + (step | 0)) | 0;

    pushUtf8String(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function UTF8_STRING_8 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    length = heap[(offset + 1) | 0] | 0;
    start = (offset + 2) | 0;
    end = (((offset + 2) | 0) + (length | 0)) | 0;

    if (checkOffset((length + 1) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function UTF8_STRING_16 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    length = readUInt16((offset + 1) | 0) | 0;
    start = (offset + 3) | 0;
    end = (((offset + 3) | 0) + (length | 0)) | 0;

    if (checkOffset((length + 2) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function UTF8_STRING_32 (octet) {
    octet = octet | 0;

    var start = 0;
    var end = 0;
    var length = 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    length = readUInt32((offset + 1) | 0) | 0;
    start = (offset + 5) | 0;
    end = (((offset + 5) | 0) + (length | 0)) | 0;

    if (checkOffset((length + 4) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0);

    offset = end | 0;

    return 0
  }

  function UTF8_STRING_64 (octet) {
    // NOT IMPLEMENTED
    octet = octet | 0;

    return 1
  }

  function UTF8_STRING_BREAK (octet) {
    octet = octet | 0;

    pushUtf8StringStart();

    offset = (offset + 1) | 0;

    return 0
  }

  function ARRAY (octet) {
    octet = octet | 0;

    pushArrayStartFixed((octet - 128) | 0);

    offset = (offset + 1) | 0;

    return 0
  }

  function ARRAY_8 (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushArrayStartFixed(heap[(offset + 1) | 0] | 0);

    offset = (offset + 2) | 0;

    return 0
  }

  function ARRAY_16 (octet) {
    octet = octet | 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    pushArrayStartFixed(
      readUInt16((offset + 1) | 0) | 0
    );

    offset = (offset + 3) | 0;

    return 0
  }

  function ARRAY_32 (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushArrayStartFixed32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    );

    offset = (offset + 5) | 0;

    return 0
  }

  function ARRAY_64 (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushArrayStartFixed64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    );

    offset = (offset + 9) | 0;

    return 0
  }

  function ARRAY_BREAK (octet) {
    octet = octet | 0;

    pushArrayStart();

    offset = (offset + 1) | 0;

    return 0
  }

  function MAP (octet) {
    octet = octet | 0;

    var step = 0;

    step = (octet - 160) | 0;

    if (checkOffset(step | 0) | 0) {
      return 1
    }

    pushObjectStartFixed(step | 0);

    offset = (offset + 1) | 0;

    return 0
  }

  function MAP_8 (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushObjectStartFixed(heap[(offset + 1) | 0] | 0);

    offset = (offset + 2) | 0;

    return 0
  }

  function MAP_16 (octet) {
    octet = octet | 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    pushObjectStartFixed(
      readUInt16((offset + 1) | 0) | 0
    );

    offset = (offset + 3) | 0;

    return 0
  }

  function MAP_32 (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushObjectStartFixed32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    );

    offset = (offset + 5) | 0;

    return 0
  }

  function MAP_64 (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushObjectStartFixed64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    );

    offset = (offset + 9) | 0;

    return 0
  }

  function MAP_BREAK (octet) {
    octet = octet | 0;

    pushObjectStart();

    offset = (offset + 1) | 0;

    return 0
  }

  function TAG_KNOWN (octet) {
    octet = octet | 0;

    pushTagStart((octet - 192| 0) | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BIGNUM_POS (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BIGNUM_NEG (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_FRAC (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BIGNUM_FLOAT (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_UNASSIGNED (octet) {
    octet = octet | 0;

    pushTagStart((octet - 192| 0) | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BASE64_URL (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BASE64 (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_BASE16 (octet) {
    octet = octet | 0;

    pushTagStart(octet | 0);

    offset = (offset + 1 | 0);

    return 0
  }

  function TAG_MORE_1 (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushTagStart(heap[(offset + 1) | 0] | 0);

    offset = (offset + 2 | 0);

    return 0
  }

  function TAG_MORE_2 (octet) {
    octet = octet | 0;

    if (checkOffset(2) | 0) {
      return 1
    }

    pushTagStart(
      readUInt16((offset + 1) | 0) | 0
    );

    offset = (offset + 3 | 0);

    return 0
  }

  function TAG_MORE_4 (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushTagStart4(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    );

    offset = (offset + 5 | 0);

    return 0
  }

  function TAG_MORE_8 (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushTagStart8(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    );

    offset = (offset + 9 | 0);

    return 0
  }

  function SIMPLE_UNASSIGNED (octet) {
    octet = octet | 0;

    pushSimpleUnassigned(((octet | 0) - 224) | 0);

    offset = (offset + 1) | 0;

    return 0
  }

  function SIMPLE_FALSE (octet) {
    octet = octet | 0;

    pushFalse();

    offset = (offset + 1) | 0;

    return 0
  }

  function SIMPLE_TRUE (octet) {
    octet = octet | 0;

    pushTrue();

    offset = (offset + 1) | 0;

    return 0
  }

  function SIMPLE_NULL (octet) {
    octet = octet | 0;

    pushNull();

    offset = (offset + 1) | 0;

    return 0
  }

  function SIMPLE_UNDEFINED (octet) {
    octet = octet | 0;

    pushUndefined();

    offset = (offset + 1) | 0;

    return 0
  }

  function SIMPLE_BYTE (octet) {
    octet = octet | 0;

    if (checkOffset(1) | 0) {
      return 1
    }

    pushSimpleUnassigned(heap[(offset + 1) | 0] | 0);

    offset = (offset + 2)  | 0;

    return 0
  }

  function SIMPLE_FLOAT_HALF (octet) {
    octet = octet | 0;

    var f = 0;
    var g = 0;
    var sign = 1.0;
    var exp = 0.0;
    var mant = 0.0;
    var r = 0.0;
    if (checkOffset(2) | 0) {
      return 1
    }

    f = heap[(offset + 1) | 0] | 0;
    g = heap[(offset + 2) | 0] | 0;

    if ((f | 0) & 0x80) {
      sign = -1.0;
    }

    exp = +(((f | 0) & 0x7C) >> 2);
    mant = +((((f | 0) & 0x03) << 8) | g);

    if (+exp == 0.0) {
      pushFloat(+(
        (+sign) * +5.9604644775390625e-8 * (+mant)
      ));
    } else if (+exp == 31.0) {
      if (+sign == 1.0) {
        if (+mant > 0.0) {
          pushNaN();
        } else {
          pushInfinity();
        }
      } else {
        if (+mant > 0.0) {
          pushNaNNeg();
        } else {
          pushInfinityNeg();
        }
      }
    } else {
      pushFloat(+(
        +sign * pow(+2, +(+exp - 25.0)) * +(1024.0 + mant)
      ));
    }

    offset = (offset + 3) | 0;

    return 0
  }

  function SIMPLE_FLOAT_SINGLE (octet) {
    octet = octet | 0;

    if (checkOffset(4) | 0) {
      return 1
    }

    pushFloatSingle(
      heap[(offset + 1) | 0] | 0,
      heap[(offset + 2) | 0] | 0,
      heap[(offset + 3) | 0] | 0,
      heap[(offset + 4) | 0] | 0
    );

    offset = (offset + 5) | 0;

    return 0
  }

  function SIMPLE_FLOAT_DOUBLE (octet) {
    octet = octet | 0;

    if (checkOffset(8) | 0) {
      return 1
    }

    pushFloatDouble(
      heap[(offset + 1) | 0] | 0,
      heap[(offset + 2) | 0] | 0,
      heap[(offset + 3) | 0] | 0,
      heap[(offset + 4) | 0] | 0,
      heap[(offset + 5) | 0] | 0,
      heap[(offset + 6) | 0] | 0,
      heap[(offset + 7) | 0] | 0,
      heap[(offset + 8) | 0] | 0
    );

    offset = (offset + 9) | 0;

    return 0
  }

  function ERROR (octet) {
    octet = octet | 0;

    return 1
  }

  function BREAK (octet) {
    octet = octet | 0;

    pushBreak();

    offset = (offset + 1) | 0;

    return 0
  }

  // -- Jump Table

  var jumpTable = [
    // Integer 0x00..0x17 (0..23)
    INT_P, // 0x00
    INT_P, // 0x01
    INT_P, // 0x02
    INT_P, // 0x03
    INT_P, // 0x04
    INT_P, // 0x05
    INT_P, // 0x06
    INT_P, // 0x07
    INT_P, // 0x08
    INT_P, // 0x09
    INT_P, // 0x0A
    INT_P, // 0x0B
    INT_P, // 0x0C
    INT_P, // 0x0D
    INT_P, // 0x0E
    INT_P, // 0x0F
    INT_P, // 0x10
    INT_P, // 0x11
    INT_P, // 0x12
    INT_P, // 0x13
    INT_P, // 0x14
    INT_P, // 0x15
    INT_P, // 0x16
    INT_P, // 0x17
    // Unsigned integer (one-byte uint8_t follows)
    UINT_P_8, // 0x18
    // Unsigned integer (two-byte uint16_t follows)
    UINT_P_16, // 0x19
    // Unsigned integer (four-byte uint32_t follows)
    UINT_P_32, // 0x1a
    // Unsigned integer (eight-byte uint64_t follows)
    UINT_P_64, // 0x1b
    ERROR, // 0x1c
    ERROR, // 0x1d
    ERROR, // 0x1e
    ERROR, // 0x1f
    // Negative integer -1-0x00..-1-0x17 (-1..-24)
    INT_N, // 0x20
    INT_N, // 0x21
    INT_N, // 0x22
    INT_N, // 0x23
    INT_N, // 0x24
    INT_N, // 0x25
    INT_N, // 0x26
    INT_N, // 0x27
    INT_N, // 0x28
    INT_N, // 0x29
    INT_N, // 0x2A
    INT_N, // 0x2B
    INT_N, // 0x2C
    INT_N, // 0x2D
    INT_N, // 0x2E
    INT_N, // 0x2F
    INT_N, // 0x30
    INT_N, // 0x31
    INT_N, // 0x32
    INT_N, // 0x33
    INT_N, // 0x34
    INT_N, // 0x35
    INT_N, // 0x36
    INT_N, // 0x37
    // Negative integer -1-n (one-byte uint8_t for n follows)
    UINT_N_8, // 0x38
    // Negative integer -1-n (two-byte uint16_t for n follows)
    UINT_N_16, // 0x39
    // Negative integer -1-n (four-byte uint32_t for nfollows)
    UINT_N_32, // 0x3a
    // Negative integer -1-n (eight-byte uint64_t for n follows)
    UINT_N_64, // 0x3b
    ERROR, // 0x3c
    ERROR, // 0x3d
    ERROR, // 0x3e
    ERROR, // 0x3f
    // byte string (0x00..0x17 bytes follow)
    BYTE_STRING, // 0x40
    BYTE_STRING, // 0x41
    BYTE_STRING, // 0x42
    BYTE_STRING, // 0x43
    BYTE_STRING, // 0x44
    BYTE_STRING, // 0x45
    BYTE_STRING, // 0x46
    BYTE_STRING, // 0x47
    BYTE_STRING, // 0x48
    BYTE_STRING, // 0x49
    BYTE_STRING, // 0x4A
    BYTE_STRING, // 0x4B
    BYTE_STRING, // 0x4C
    BYTE_STRING, // 0x4D
    BYTE_STRING, // 0x4E
    BYTE_STRING, // 0x4F
    BYTE_STRING, // 0x50
    BYTE_STRING, // 0x51
    BYTE_STRING, // 0x52
    BYTE_STRING, // 0x53
    BYTE_STRING, // 0x54
    BYTE_STRING, // 0x55
    BYTE_STRING, // 0x56
    BYTE_STRING, // 0x57
    // byte string (one-byte uint8_t for n, and then n bytes follow)
    BYTE_STRING_8, // 0x58
    // byte string (two-byte uint16_t for n, and then n bytes follow)
    BYTE_STRING_16, // 0x59
    // byte string (four-byte uint32_t for n, and then n bytes follow)
    BYTE_STRING_32, // 0x5a
    // byte string (eight-byte uint64_t for n, and then n bytes follow)
    BYTE_STRING_64, // 0x5b
    ERROR, // 0x5c
    ERROR, // 0x5d
    ERROR, // 0x5e
    // byte string, byte strings follow, terminated by "break"
    BYTE_STRING_BREAK, // 0x5f
    // UTF-8 string (0x00..0x17 bytes follow)
    UTF8_STRING, // 0x60
    UTF8_STRING, // 0x61
    UTF8_STRING, // 0x62
    UTF8_STRING, // 0x63
    UTF8_STRING, // 0x64
    UTF8_STRING, // 0x65
    UTF8_STRING, // 0x66
    UTF8_STRING, // 0x67
    UTF8_STRING, // 0x68
    UTF8_STRING, // 0x69
    UTF8_STRING, // 0x6A
    UTF8_STRING, // 0x6B
    UTF8_STRING, // 0x6C
    UTF8_STRING, // 0x6D
    UTF8_STRING, // 0x6E
    UTF8_STRING, // 0x6F
    UTF8_STRING, // 0x70
    UTF8_STRING, // 0x71
    UTF8_STRING, // 0x72
    UTF8_STRING, // 0x73
    UTF8_STRING, // 0x74
    UTF8_STRING, // 0x75
    UTF8_STRING, // 0x76
    UTF8_STRING, // 0x77
    // UTF-8 string (one-byte uint8_t for n, and then n bytes follow)
    UTF8_STRING_8, // 0x78
    // UTF-8 string (two-byte uint16_t for n, and then n bytes follow)
    UTF8_STRING_16, // 0x79
    // UTF-8 string (four-byte uint32_t for n, and then n bytes follow)
    UTF8_STRING_32, // 0x7a
    // UTF-8 string (eight-byte uint64_t for n, and then n bytes follow)
    UTF8_STRING_64, // 0x7b
    // UTF-8 string, UTF-8 strings follow, terminated by "break"
    ERROR, // 0x7c
    ERROR, // 0x7d
    ERROR, // 0x7e
    UTF8_STRING_BREAK, // 0x7f
    // array (0x00..0x17 data items follow)
    ARRAY, // 0x80
    ARRAY, // 0x81
    ARRAY, // 0x82
    ARRAY, // 0x83
    ARRAY, // 0x84
    ARRAY, // 0x85
    ARRAY, // 0x86
    ARRAY, // 0x87
    ARRAY, // 0x88
    ARRAY, // 0x89
    ARRAY, // 0x8A
    ARRAY, // 0x8B
    ARRAY, // 0x8C
    ARRAY, // 0x8D
    ARRAY, // 0x8E
    ARRAY, // 0x8F
    ARRAY, // 0x90
    ARRAY, // 0x91
    ARRAY, // 0x92
    ARRAY, // 0x93
    ARRAY, // 0x94
    ARRAY, // 0x95
    ARRAY, // 0x96
    ARRAY, // 0x97
    // array (one-byte uint8_t fo, and then n data items follow)
    ARRAY_8, // 0x98
    // array (two-byte uint16_t for n, and then n data items follow)
    ARRAY_16, // 0x99
    // array (four-byte uint32_t for n, and then n data items follow)
    ARRAY_32, // 0x9a
    // array (eight-byte uint64_t for n, and then n data items follow)
    ARRAY_64, // 0x9b
    // array, data items follow, terminated by "break"
    ERROR, // 0x9c
    ERROR, // 0x9d
    ERROR, // 0x9e
    ARRAY_BREAK, // 0x9f
    // map (0x00..0x17 pairs of data items follow)
    MAP, // 0xa0
    MAP, // 0xa1
    MAP, // 0xa2
    MAP, // 0xa3
    MAP, // 0xa4
    MAP, // 0xa5
    MAP, // 0xa6
    MAP, // 0xa7
    MAP, // 0xa8
    MAP, // 0xa9
    MAP, // 0xaA
    MAP, // 0xaB
    MAP, // 0xaC
    MAP, // 0xaD
    MAP, // 0xaE
    MAP, // 0xaF
    MAP, // 0xb0
    MAP, // 0xb1
    MAP, // 0xb2
    MAP, // 0xb3
    MAP, // 0xb4
    MAP, // 0xb5
    MAP, // 0xb6
    MAP, // 0xb7
    // map (one-byte uint8_t for n, and then n pairs of data items follow)
    MAP_8, // 0xb8
    // map (two-byte uint16_t for n, and then n pairs of data items follow)
    MAP_16, // 0xb9
    // map (four-byte uint32_t for n, and then n pairs of data items follow)
    MAP_32, // 0xba
    // map (eight-byte uint64_t for n, and then n pairs of data items follow)
    MAP_64, // 0xbb
    ERROR, // 0xbc
    ERROR, // 0xbd
    ERROR, // 0xbe
    // map, pairs of data items follow, terminated by "break"
    MAP_BREAK, // 0xbf
    // Text-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN, // 0xc0
    // Epoch-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN, // 0xc1
    // Positive bignum (data item "byte string" follows)
    TAG_KNOWN, // 0xc2
    // Negative bignum (data item "byte string" follows)
    TAG_KNOWN, // 0xc3
    // Decimal Fraction (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN, // 0xc4
    // Bigfloat (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN, // 0xc5
    // (tagged item)
    TAG_UNASSIGNED, // 0xc6
    TAG_UNASSIGNED, // 0xc7
    TAG_UNASSIGNED, // 0xc8
    TAG_UNASSIGNED, // 0xc9
    TAG_UNASSIGNED, // 0xca
    TAG_UNASSIGNED, // 0xcb
    TAG_UNASSIGNED, // 0xcc
    TAG_UNASSIGNED, // 0xcd
    TAG_UNASSIGNED, // 0xce
    TAG_UNASSIGNED, // 0xcf
    TAG_UNASSIGNED, // 0xd0
    TAG_UNASSIGNED, // 0xd1
    TAG_UNASSIGNED, // 0xd2
    TAG_UNASSIGNED, // 0xd3
    TAG_UNASSIGNED, // 0xd4
    // Expected Conversion (data item follows; see Section 2.4.4.2)
    TAG_UNASSIGNED, // 0xd5
    TAG_UNASSIGNED, // 0xd6
    TAG_UNASSIGNED, // 0xd7
    // (more tagged items, 1/2/4/8 bytes and then a data item follow)
    TAG_MORE_1, // 0xd8
    TAG_MORE_2, // 0xd9
    TAG_MORE_4, // 0xda
    TAG_MORE_8, // 0xdb
    ERROR, // 0xdc
    ERROR, // 0xdd
    ERROR, // 0xde
    ERROR, // 0xdf
    // (simple value)
    SIMPLE_UNASSIGNED, // 0xe0
    SIMPLE_UNASSIGNED, // 0xe1
    SIMPLE_UNASSIGNED, // 0xe2
    SIMPLE_UNASSIGNED, // 0xe3
    SIMPLE_UNASSIGNED, // 0xe4
    SIMPLE_UNASSIGNED, // 0xe5
    SIMPLE_UNASSIGNED, // 0xe6
    SIMPLE_UNASSIGNED, // 0xe7
    SIMPLE_UNASSIGNED, // 0xe8
    SIMPLE_UNASSIGNED, // 0xe9
    SIMPLE_UNASSIGNED, // 0xea
    SIMPLE_UNASSIGNED, // 0xeb
    SIMPLE_UNASSIGNED, // 0xec
    SIMPLE_UNASSIGNED, // 0xed
    SIMPLE_UNASSIGNED, // 0xee
    SIMPLE_UNASSIGNED, // 0xef
    SIMPLE_UNASSIGNED, // 0xf0
    SIMPLE_UNASSIGNED, // 0xf1
    SIMPLE_UNASSIGNED, // 0xf2
    SIMPLE_UNASSIGNED, // 0xf3
    // False
    SIMPLE_FALSE, // 0xf4
    // True
    SIMPLE_TRUE, // 0xf5
    // Null
    SIMPLE_NULL, // 0xf6
    // Undefined
    SIMPLE_UNDEFINED, // 0xf7
    // (simple value, one byte follows)
    SIMPLE_BYTE, // 0xf8
    // Half-Precision Float (two-byte IEEE 754)
    SIMPLE_FLOAT_HALF, // 0xf9
    // Single-Precision Float (four-byte IEEE 754)
    SIMPLE_FLOAT_SINGLE, // 0xfa
    // Double-Precision Float (eight-byte IEEE 754)
    SIMPLE_FLOAT_DOUBLE, // 0xfb
    ERROR, // 0xfc
    ERROR, // 0xfd
    ERROR, // 0xfe
    // "break" stop code
    BREAK // 0xff
  ];

  // --

  return {
    parse: parse
  }
};

var require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(bignumber);

const Bignumber = require$$2.BigNumber;

var MT = {
  POS_INT: 0,
  NEG_INT: 1,
  BYTE_STRING: 2,
  UTF8_STRING: 3,
  ARRAY: 4,
  MAP: 5,
  TAG: 6,
  SIMPLE_FLOAT: 7
};

var TAG = {
  DATE_STRING: 0,
  DATE_EPOCH: 1,
  POS_BIGINT: 2,
  NEG_BIGINT: 3,
  DECIMAL_FRAC: 4,
  BIGFLOAT: 5,
  BASE64URL_EXPECTED: 21,
  BASE64_EXPECTED: 22,
  BASE16_EXPECTED: 23,
  CBOR: 24,
  URI: 32,
  BASE64URL: 33,
  BASE64: 34,
  REGEXP: 35,
  MIME: 36
};

var NUMBYTES = {
  ZERO: 0,
  ONE: 24,
  TWO: 25,
  FOUR: 26,
  EIGHT: 27,
  INDEFINITE: 31
};

var SIMPLE = {
  FALSE: 20,
  TRUE: 21,
  NULL: 22,
  UNDEFINED: 23
};

var SYMS = {
  NULL: Symbol('null'),
  UNDEFINED: Symbol('undef'),
  PARENT: Symbol('parent'),
  BREAK: Symbol('break'),
  STREAM: Symbol('stream')
};

var SHIFT32 = Math.pow(2, 32);
var SHIFT16 = Math.pow(2, 16);

var MAX_SAFE_HIGH = 0x1fffff;
var NEG_ONE = new Bignumber(-1);
var TEN = new Bignumber(10);
var TWO = new Bignumber(2);

var PARENT = {
  ARRAY: 0,
  OBJECT: 1,
  MAP: 2,
  TAG: 3,
  BYTE_STRING: 4,
  UTF8_STRING: 5
};

var constants = {
	MT: MT,
	TAG: TAG,
	NUMBYTES: NUMBYTES,
	SIMPLE: SIMPLE,
	SYMS: SYMS,
	SHIFT32: SHIFT32,
	SHIFT16: SHIFT16,
	MAX_SAFE_HIGH: MAX_SAFE_HIGH,
	NEG_ONE: NEG_ONE,
	TEN: TEN,
	TWO: TWO,
	PARENT: PARENT
};

var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(_polyfillNode_buffer);

var utils = createCommonjsModule(function (module, exports) {

const { Buffer } = require$$0;
const Bignumber = require$$2.BigNumber;


const SHIFT32 = constants.SHIFT32;
const SHIFT16 = constants.SHIFT16;
const MAX_SAFE_HIGH = 0x1fffff;

exports.parseHalf = function parseHalf (buf) {
  var exp, mant, sign;
  sign = buf[0] & 0x80 ? -1 : 1;
  exp = (buf[0] & 0x7C) >> 2;
  mant = ((buf[0] & 0x03) << 8) | buf[1];
  if (!exp) {
    return sign * 5.9604644775390625e-8 * mant
  } else if (exp === 0x1f) {
    return sign * (mant ? 0 / 0 : 2e308)
  } else {
    return sign * Math.pow(2, exp - 25) * (1024 + mant)
  }
};

function toHex (n) {
  if (n < 16) {
    return '0' + n.toString(16)
  }

  return n.toString(16)
}

exports.arrayBufferToBignumber = function (buf) {
  const len = buf.byteLength;
  let res = '';
  for (let i = 0; i < len; i++) {
    res += toHex(buf[i]);
  }

  return new Bignumber(res, 16)
};

// convert an Object into a Map
exports.buildMap = (obj) => {
  const res = new Map();
  const keys = Object.keys(obj);
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    res.set(keys[i], obj[keys[i]]);
  }
  return res
};

exports.buildInt32 = (f, g) => {
  return f * SHIFT16 + g
};

exports.buildInt64 = (f1, f2, g1, g2) => {
  const f = exports.buildInt32(f1, f2);
  const g = exports.buildInt32(g1, g2);

  if (f > MAX_SAFE_HIGH) {
    return new Bignumber(f).times(SHIFT32).plus(g)
  } else {
    return (f * SHIFT32) + g
  }
};

exports.writeHalf = function writeHalf (buf, half) {
  // assume 0, -0, NaN, Infinity, and -Infinity have already been caught

  // HACK: everyone settle in.  This isn't going to be pretty.
  // Translate cn-cbor's C code (from Carsten Borman):

  // uint32_t be32;
  // uint16_t be16, u16;
  // union {
  //   float f;
  //   uint32_t u;
  // } u32;
  // u32.f = float_val;

  const u32 = Buffer.allocUnsafe(4);
  u32.writeFloatBE(half, 0);
  const u = u32.readUInt32BE(0);

  // if ((u32.u & 0x1FFF) == 0) { /* worth trying half */

  // hildjj: If the lower 13 bits are 0, we won't lose anything in the conversion
  if ((u & 0x1FFF) !== 0) {
    return false
  }

  //   int s16 = (u32.u >> 16) & 0x8000;
  //   int exp = (u32.u >> 23) & 0xff;
  //   int mant = u32.u & 0x7fffff;

  var s16 = (u >> 16) & 0x8000; // top bit is sign
  const exp = (u >> 23) & 0xff; // then 5 bits of exponent
  const mant = u & 0x7fffff;

  //   if (exp == 0 && mant == 0)
  //     ;              /* 0.0, -0.0 */

  // hildjj: zeros already handled.  Assert if you don't believe me.

  //   else if (exp >= 113 && exp <= 142) /* normalized */
  //     s16 += ((exp - 112) << 10) + (mant >> 13);
  if ((exp >= 113) && (exp <= 142)) {
    s16 += ((exp - 112) << 10) + (mant >> 13);

  //   else if (exp >= 103 && exp < 113) { /* denorm, exp16 = 0 */
  //     if (mant & ((1 << (126 - exp)) - 1))
  //       goto float32;         /* loss of precision */
  //     s16 += ((mant + 0x800000) >> (126 - exp));
  } else if ((exp >= 103) && (exp < 113)) {
    if (mant & ((1 << (126 - exp)) - 1)) {
      return false
    }
    s16 += ((mant + 0x800000) >> (126 - exp));

    //   } else if (exp == 255 && mant == 0) { /* Inf */
    //     s16 += 0x7c00;

    // hildjj: Infinity already handled

  //   } else
  //     goto float32;           /* loss of range */
  } else {
    return false
  }

  //   ensure_writable(3);
  //   u16 = s16;
  //   be16 = hton16p((const uint8_t*)&u16);
  buf.writeUInt16BE(s16, 0);
  return true
};

exports.keySorter = function (a, b) {
  var lenA = a[0].byteLength;
  var lenB = b[0].byteLength;

  if (lenA > lenB) {
    return 1
  }

  if (lenB > lenA) {
    return -1
  }

  return a[0].compare(b[0])
};

// Adapted from http://www.2ality.com/2012/03/signedzero.html
exports.isNegativeZero = (x) => {
  return x === 0 && (1 / x < 0)
};

exports.nextPowerOf2 = (n) => {
  let count = 0;
  // First n in the below condition is for
  // the case where n is 0
  if (n && !(n & (n - 1))) {
    return n
  }

  while (n !== 0) {
    n >>= 1;
    count += 1;
  }

  return 1 << count
};
});

const MT$1 = constants.MT;
const SIMPLE$1 = constants.SIMPLE;
const SYMS$1 = constants.SYMS;

/**
 * A CBOR Simple Value that does not map onto a known constant.
 */
class Simple {
  /**
   * Creates an instance of Simple.
   *
   * @param {integer} value - the simple value's integer value
   */
  constructor (value) {
    if (typeof value !== 'number') {
      throw new Error('Invalid Simple type: ' + (typeof value))
    }
    if ((value < 0) || (value > 255) || ((value | 0) !== value)) {
      throw new Error('value must be a small positive integer: ' + value)
    }
    this.value = value;
  }

  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  toString () {
    return 'simple(' + this.value + ')'
  }

  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  inspect () {
    return 'simple(' + this.value + ')'
  }

  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR (gen) {
    return gen._pushInt(this.value, MT$1.SIMPLE_FLOAT)
  }

  /**
   * Is the given object a Simple?
   *
   * @param {any} obj - object to test
   * @returns {bool} - is it Simple?
   */
  static isSimple (obj) {
    return obj instanceof Simple
  }

  /**
   * Decode from the CBOR additional information into a JavaScript value.
   * If the CBOR item has no parent, return a "safe" symbol instead of
   * `null` or `undefined`, so that the value can be passed through a
   * stream in object mode.
   *
   * @param {Number} val - the CBOR additional info to convert
   * @param {bool} hasParent - Does the CBOR item have a parent?
   * @returns {(null|undefined|Boolean|Symbol)} - the decoded value
   */
  static decode (val, hasParent) {
    if (hasParent == null) {
      hasParent = true;
    }
    switch (val) {
      case SIMPLE$1.FALSE:
        return false
      case SIMPLE$1.TRUE:
        return true
      case SIMPLE$1.NULL:
        if (hasParent) {
          return null
        } else {
          return SYMS$1.NULL
        }
      case SIMPLE$1.UNDEFINED:
        if (hasParent) {
          return undefined
        } else {
          return SYMS$1.UNDEFINED
        }
      case -1:
        if (!hasParent) {
          throw new Error('Invalid BREAK')
        }
        return SYMS$1.BREAK
      default:
        return new Simple(val)
    }
  }
}

var simple = Simple;

/**
 * A CBOR tagged item, where the tag does not have semantics specified at the
 * moment, or those semantics threw an error during parsing. Typically this will
 * be an extension point you're not yet expecting.
 */
class Tagged {
  /**
   * Creates an instance of Tagged.
   *
   * @param {Number} tag - the number of the tag
   * @param {any} value - the value inside the tag
   * @param {Error} err - the error that was thrown parsing the tag, or null
   */
  constructor (tag, value, err) {
    this.tag = tag;
    this.value = value;
    this.err = err;
    if (typeof this.tag !== 'number') {
      throw new Error('Invalid tag type (' + (typeof this.tag) + ')')
    }
    if ((this.tag < 0) || ((this.tag | 0) !== this.tag)) {
      throw new Error('Tag must be a positive integer: ' + this.tag)
    }
  }

  /**
   * Convert to a String
   *
   * @returns {String} string of the form '1(2)'
   */
  toString () {
    return `${this.tag}(${JSON.stringify(this.value)})`
  }

  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR (gen) {
    gen._pushTag(this.tag);
    return gen.pushAny(this.value)
  }

  /**
   * If we have a converter for this type, do the conversion.  Some converters
   * are built-in.  Additional ones can be passed in.  If you want to remove
   * a built-in converter, pass a converter in whose value is 'null' instead
   * of a function.
   *
   * @param {Object} converters - keys in the object are a tag number, the value
   *   is a function that takes the decoded CBOR and returns a JavaScript value
   *   of the appropriate type.  Throw an exception in the function on errors.
   * @returns {any} - the converted item
   */
  convert (converters) {
    var er, f;
    f = converters != null ? converters[this.tag] : undefined;
    if (typeof f !== 'function') {
      f = Tagged['_tag' + this.tag];
      if (typeof f !== 'function') {
        return this
      }
    }
    try {
      return f.call(Tagged, this.value)
    } catch (error) {
      er = error;
      this.err = er;
      return this
    }
  }
}

var tagged = Tagged;

const defaultBase = self.location ?
    self.location.protocol + '//' + self.location.host :
    '';
const URL$1 = self.URL;

class URLWithLegacySupport {
    constructor(url = '', base = defaultBase) {
        this.super = new URL$1(url, base);
        this.path = this.pathname + this.search;
        this.auth =
            this.username && this.password ?
                this.username + ':' + this.password :
                null;

        this.query =
            this.search && this.search.startsWith('?') ?
                this.search.slice(1) :
                null;
    }

    get hash() {
        return this.super.hash;
    }
    get host() {
        return this.super.host;
    }
    get hostname() {
        return this.super.hostname;
    }
    get href() {
        return this.super.href;
    }
    get origin() {
        return this.super.origin;
    }
    get password() {
        return this.super.password;
    }
    get pathname() {
        return this.super.pathname;
    }
    get port() {
        return this.super.port;
    }
    get protocol() {
        return this.super.protocol;
    }
    get search() {
        return this.super.search;
    }
    get searchParams() {
        return this.super.searchParams;
    }
    get username() {
        return this.super.username;
    }

    set hash(hash) {
        this.super.hash = hash;
    }
    set host(host) {
        this.super.host = host;
    }
    set hostname(hostname) {
        this.super.hostname = hostname;
    }
    set href(href) {
        this.super.href = href;
    }
    set origin(origin) {
        this.super.origin = origin;
    }
    set password(password) {
        this.super.password = password;
    }
    set pathname(pathname) {
        this.super.pathname = pathname;
    }
    set port(port) {
        this.super.port = port;
    }
    set protocol(protocol) {
        this.super.protocol = protocol;
    }
    set search(search) {
        this.super.search = search;
    }
    set searchParams(searchParams) {
        this.super.searchParams = searchParams;
    }
    set username(username) {
        this.super.username = username;
    }

    createObjectURL(o) {
        return this.super.createObjectURL(o);
    }
    revokeObjectURL(o) {
        this.super.revokeObjectURL(o);
    }
    toJSON() {
        return this.super.toJSON();
    }
    toString() {
        return this.super.toString();
    }
    format() {
        return this.toString();
    }
}

function format(obj) {
    if (typeof obj === 'string') {
        const url = new URL$1(obj);

        return url.toString();
    }

    if (!(obj instanceof URL$1)) {
        const userPass =
            obj.username && obj.password ?
                `${obj.username}:${obj.password}@` :
                '';
        const auth = obj.auth ? obj.auth + '@' : '';
        const port = obj.port ? ':' + obj.port : '';
        const protocol = obj.protocol ? obj.protocol + '//' : '';
        const host = obj.host || '';
        const hostname = obj.hostname || '';
        const search = obj.search || (obj.query ? '?' + obj.query : '');
        const hash = obj.hash || '';
        const pathname = obj.pathname || '';
        const path = obj.path || pathname + search;

        return `${protocol}${userPass || auth}${host ||
            hostname + port}${path}${hash}`;
    }
}

var urlBrowser = {
    URLWithLegacySupport,
    URLSearchParams: self.URLSearchParams,
    defaultBase,
    format
};

const { URLWithLegacySupport: URLWithLegacySupport$1, format: format$1 } = urlBrowser;

var relative = (url, location = {}, protocolMap = {}, defaultProtocol) => {
    let protocol = location.protocol ?
        location.protocol.replace(':', '') :
        'http';

    // Check protocol map
    protocol = (protocolMap[protocol] || defaultProtocol || protocol) + ':';
    let urlParsed;

    try {
        urlParsed = new URLWithLegacySupport$1(url);
    } catch (err) {
        urlParsed = {};
    }

    const base = Object.assign({}, location, {
        protocol: protocol || urlParsed.protocol,
        host: location.host || urlParsed.host
    });

    return new URLWithLegacySupport$1(url, format$1(base)).toString();
};

const {
    URLWithLegacySupport: URLWithLegacySupport$2,
    format: format$2,
    URLSearchParams,
    defaultBase: defaultBase$1
} = urlBrowser;


var isoUrl = {
    URL: URLWithLegacySupport$2,
    URLSearchParams,
    format: format$2,
    relative,
    defaultBase: defaultBase$1
};

const { Buffer } = require$$0;

const Bignumber$1 = require$$2.BigNumber;






const { URL: URL$2 } = isoUrl;

/**
 * Transform binary cbor data into JavaScript objects.
 */
class Decoder {
  /**
   * @param {Object} [opts={}]
   * @param {number} [opts.size=65536] - Size of the allocated heap.
   */
  constructor (opts) {
    opts = opts || {};

    if (!opts.size || opts.size < 0x10000) {
      opts.size = 0x10000;
    } else {
      // Ensure the size is a power of 2
      opts.size = utils.nextPowerOf2(opts.size);
    }

    // Heap use to share the input with the parser
    this._heap = new ArrayBuffer(opts.size);
    this._heap8 = new Uint8Array(this._heap);
    this._buffer = Buffer.from(this._heap);

    this._reset();

    // Known tags
    this._knownTags = Object.assign({
      0: (val) => new Date(val),
      1: (val) => new Date(val * 1000),
      2: (val) => utils.arrayBufferToBignumber(val),
      3: (val) => constants.NEG_ONE.minus(utils.arrayBufferToBignumber(val)),
      4: (v) => {
        // const v = new Uint8Array(val)
        return constants.TEN.pow(v[0]).times(v[1])
      },
      5: (v) => {
        // const v = new Uint8Array(val)
        return constants.TWO.pow(v[0]).times(v[1])
      },
      32: (val) => new URL$2(val),
      35: (val) => new RegExp(val)
    }, opts.tags);

    // Initialize asm based parser
    this.parser = decoder_asm(commonjsGlobal, {
      // eslint-disable-next-line no-console
      log: console.log.bind(console),
      pushInt: this.pushInt.bind(this),
      pushInt32: this.pushInt32.bind(this),
      pushInt32Neg: this.pushInt32Neg.bind(this),
      pushInt64: this.pushInt64.bind(this),
      pushInt64Neg: this.pushInt64Neg.bind(this),
      pushFloat: this.pushFloat.bind(this),
      pushFloatSingle: this.pushFloatSingle.bind(this),
      pushFloatDouble: this.pushFloatDouble.bind(this),
      pushTrue: this.pushTrue.bind(this),
      pushFalse: this.pushFalse.bind(this),
      pushUndefined: this.pushUndefined.bind(this),
      pushNull: this.pushNull.bind(this),
      pushInfinity: this.pushInfinity.bind(this),
      pushInfinityNeg: this.pushInfinityNeg.bind(this),
      pushNaN: this.pushNaN.bind(this),
      pushNaNNeg: this.pushNaNNeg.bind(this),
      pushArrayStart: this.pushArrayStart.bind(this),
      pushArrayStartFixed: this.pushArrayStartFixed.bind(this),
      pushArrayStartFixed32: this.pushArrayStartFixed32.bind(this),
      pushArrayStartFixed64: this.pushArrayStartFixed64.bind(this),
      pushObjectStart: this.pushObjectStart.bind(this),
      pushObjectStartFixed: this.pushObjectStartFixed.bind(this),
      pushObjectStartFixed32: this.pushObjectStartFixed32.bind(this),
      pushObjectStartFixed64: this.pushObjectStartFixed64.bind(this),
      pushByteString: this.pushByteString.bind(this),
      pushByteStringStart: this.pushByteStringStart.bind(this),
      pushUtf8String: this.pushUtf8String.bind(this),
      pushUtf8StringStart: this.pushUtf8StringStart.bind(this),
      pushSimpleUnassigned: this.pushSimpleUnassigned.bind(this),
      pushTagUnassigned: this.pushTagUnassigned.bind(this),
      pushTagStart: this.pushTagStart.bind(this),
      pushTagStart4: this.pushTagStart4.bind(this),
      pushTagStart8: this.pushTagStart8.bind(this),
      pushBreak: this.pushBreak.bind(this)
    }, this._heap);
  }

  get _depth () {
    return this._parents.length
  }

  get _currentParent () {
    return this._parents[this._depth - 1]
  }

  get _ref () {
    return this._currentParent.ref
  }

  // Finish the current parent
  _closeParent () {
    var p = this._parents.pop();

    if (p.length > 0) {
      throw new Error(`Missing ${p.length} elements`)
    }

    switch (p.type) {
      case constants.PARENT.TAG:
        this._push(
          this.createTag(p.ref[0], p.ref[1])
        );
        break
      case constants.PARENT.BYTE_STRING:
        this._push(this.createByteString(p.ref, p.length));
        break
      case constants.PARENT.UTF8_STRING:
        this._push(this.createUtf8String(p.ref, p.length));
        break
      case constants.PARENT.MAP:
        if (p.values % 2 > 0) {
          throw new Error('Odd number of elements in the map')
        }
        this._push(this.createMap(p.ref, p.length));
        break
      case constants.PARENT.OBJECT:
        if (p.values % 2 > 0) {
          throw new Error('Odd number of elements in the map')
        }
        this._push(this.createObject(p.ref, p.length));
        break
      case constants.PARENT.ARRAY:
        this._push(this.createArray(p.ref, p.length));
        break
    }

    if (this._currentParent && this._currentParent.type === constants.PARENT.TAG) {
      this._dec();
    }
  }

  // Reduce the expected length of the current parent by one
  _dec () {
    const p = this._currentParent;
    // The current parent does not know the epxected child length

    if (p.length < 0) {
      return
    }

    p.length--;

    // All children were seen, we can close the current parent
    if (p.length === 0) {
      this._closeParent();
    }
  }

  // Push any value to the current parent
  _push (val, hasChildren) {
    const p = this._currentParent;
    p.values++;

    switch (p.type) {
      case constants.PARENT.ARRAY:
      case constants.PARENT.BYTE_STRING:
      case constants.PARENT.UTF8_STRING:
        if (p.length > -1) {
          this._ref[this._ref.length - p.length] = val;
        } else {
          this._ref.push(val);
        }
        this._dec();
        break
      case constants.PARENT.OBJECT:
        if (p.tmpKey != null) {
          this._ref[p.tmpKey] = val;
          p.tmpKey = null;
          this._dec();
        } else {
          p.tmpKey = val;

          if (typeof p.tmpKey !== 'string') {
            // too bad, convert to a Map
            p.type = constants.PARENT.MAP;
            p.ref = utils.buildMap(p.ref);
          }
        }
        break
      case constants.PARENT.MAP:
        if (p.tmpKey != null) {
          this._ref.set(p.tmpKey, val);
          p.tmpKey = null;
          this._dec();
        } else {
          p.tmpKey = val;
        }
        break
      case constants.PARENT.TAG:
        this._ref.push(val);
        if (!hasChildren) {
          this._dec();
        }
        break
      default:
        throw new Error('Unknown parent type')
    }
  }

  // Create a new parent in the parents list
  _createParent (obj, type, len) {
    this._parents[this._depth] = {
      type: type,
      length: len,
      ref: obj,
      values: 0,
      tmpKey: null
    };
  }

  // Reset all state back to the beginning, also used for initiatlization
  _reset () {
    this._res = [];
    this._parents = [{
      type: constants.PARENT.ARRAY,
      length: -1,
      ref: this._res,
      values: 0,
      tmpKey: null
    }];
  }

  // -- Interface to customize deoding behaviour
  createTag (tagNumber, value) {
    const typ = this._knownTags[tagNumber];

    if (!typ) {
      return new tagged(tagNumber, value)
    }

    return typ(value)
  }

  createMap (obj, len) {
    return obj
  }

  createObject (obj, len) {
    return obj
  }

  createArray (arr, len) {
    return arr
  }

  createByteString (raw, len) {
    return Buffer.concat(raw)
  }

  createByteStringFromHeap (start, end) {
    if (start === end) {
      return Buffer.alloc(0)
    }

    return Buffer.from(this._heap.slice(start, end))
  }

  createInt (val) {
    return val
  }

  createInt32 (f, g) {
    return utils.buildInt32(f, g)
  }

  createInt64 (f1, f2, g1, g2) {
    return utils.buildInt64(f1, f2, g1, g2)
  }

  createFloat (val) {
    return val
  }

  createFloatSingle (a, b, c, d) {
    return ieee754.read([a, b, c, d], 0, false, 23, 4)
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    return ieee754.read([a, b, c, d, e, f, g, h], 0, false, 52, 8)
  }

  createInt32Neg (f, g) {
    return -1 - utils.buildInt32(f, g)
  }

  createInt64Neg (f1, f2, g1, g2) {
    const f = utils.buildInt32(f1, f2);
    const g = utils.buildInt32(g1, g2);

    if (f > constants.MAX_SAFE_HIGH) {
      return constants.NEG_ONE.minus(new Bignumber$1(f).times(constants.SHIFT32).plus(g))
    }

    return -1 - ((f * constants.SHIFT32) + g)
  }

  createTrue () {
    return true
  }

  createFalse () {
    return false
  }

  createNull () {
    return null
  }

  createUndefined () {
    return undefined
  }

  createInfinity () {
    return Infinity
  }

  createInfinityNeg () {
    return -Infinity
  }

  createNaN () {
    return NaN
  }

  createNaNNeg () {
    return -NaN
  }

  createUtf8String (raw, len) {
    return raw.join('')
  }

  createUtf8StringFromHeap (start, end) {
    if (start === end) {
      return ''
    }

    return this._buffer.toString('utf8', start, end)
  }

  createSimpleUnassigned (val) {
    return new simple(val)
  }

  // -- Interface for decoder.asm.js

  pushInt (val) {
    this._push(this.createInt(val));
  }

  pushInt32 (f, g) {
    this._push(this.createInt32(f, g));
  }

  pushInt64 (f1, f2, g1, g2) {
    this._push(this.createInt64(f1, f2, g1, g2));
  }

  pushFloat (val) {
    this._push(this.createFloat(val));
  }

  pushFloatSingle (a, b, c, d) {
    this._push(this.createFloatSingle(a, b, c, d));
  }

  pushFloatDouble (a, b, c, d, e, f, g, h) {
    this._push(this.createFloatDouble(a, b, c, d, e, f, g, h));
  }

  pushInt32Neg (f, g) {
    this._push(this.createInt32Neg(f, g));
  }

  pushInt64Neg (f1, f2, g1, g2) {
    this._push(this.createInt64Neg(f1, f2, g1, g2));
  }

  pushTrue () {
    this._push(this.createTrue());
  }

  pushFalse () {
    this._push(this.createFalse());
  }

  pushNull () {
    this._push(this.createNull());
  }

  pushUndefined () {
    this._push(this.createUndefined());
  }

  pushInfinity () {
    this._push(this.createInfinity());
  }

  pushInfinityNeg () {
    this._push(this.createInfinityNeg());
  }

  pushNaN () {
    this._push(this.createNaN());
  }

  pushNaNNeg () {
    this._push(this.createNaNNeg());
  }

  pushArrayStart () {
    this._createParent([], constants.PARENT.ARRAY, -1);
  }

  pushArrayStartFixed (len) {
    this._createArrayStartFixed(len);
  }

  pushArrayStartFixed32 (len1, len2) {
    const len = utils.buildInt32(len1, len2);
    this._createArrayStartFixed(len);
  }

  pushArrayStartFixed64 (len1, len2, len3, len4) {
    const len = utils.buildInt64(len1, len2, len3, len4);
    this._createArrayStartFixed(len);
  }

  pushObjectStart () {
    this._createObjectStartFixed(-1);
  }

  pushObjectStartFixed (len) {
    this._createObjectStartFixed(len);
  }

  pushObjectStartFixed32 (len1, len2) {
    const len = utils.buildInt32(len1, len2);
    this._createObjectStartFixed(len);
  }

  pushObjectStartFixed64 (len1, len2, len3, len4) {
    const len = utils.buildInt64(len1, len2, len3, len4);
    this._createObjectStartFixed(len);
  }

  pushByteStringStart () {
    this._parents[this._depth] = {
      type: constants.PARENT.BYTE_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    };
  }

  pushByteString (start, end) {
    this._push(this.createByteStringFromHeap(start, end));
  }

  pushUtf8StringStart () {
    this._parents[this._depth] = {
      type: constants.PARENT.UTF8_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    };
  }

  pushUtf8String (start, end) {
    this._push(this.createUtf8StringFromHeap(start, end));
  }

  pushSimpleUnassigned (val) {
    this._push(this.createSimpleUnassigned(val));
  }

  pushTagStart (tag) {
    this._parents[this._depth] = {
      type: constants.PARENT.TAG,
      length: 1,
      ref: [tag]
    };
  }

  pushTagStart4 (f, g) {
    this.pushTagStart(utils.buildInt32(f, g));
  }

  pushTagStart8 (f1, f2, g1, g2) {
    this.pushTagStart(utils.buildInt64(f1, f2, g1, g2));
  }

  pushTagUnassigned (tagNumber) {
    this._push(this.createTag(tagNumber));
  }

  pushBreak () {
    if (this._currentParent.length > -1) {
      throw new Error('Unexpected break')
    }

    this._closeParent();
  }

  _createObjectStartFixed (len) {
    if (len === 0) {
      this._push(this.createObject({}));
      return
    }

    this._createParent({}, constants.PARENT.OBJECT, len);
  }

  _createArrayStartFixed (len) {
    if (len === 0) {
      this._push(this.createArray([]));
      return
    }

    this._createParent(new Array(len), constants.PARENT.ARRAY, len);
  }

  _decode (input) {
    if (input.byteLength === 0) {
      throw new Error('Input too short')
    }

    this._reset();
    this._heap8.set(input);
    const code = this.parser.parse(input.byteLength);

    if (this._depth > 1) {
      while (this._currentParent.length === 0) {
        this._closeParent();
      }
      if (this._depth > 1) {
        throw new Error('Undeterminated nesting')
      }
    }

    if (code > 0) {
      throw new Error('Failed to parse')
    }

    if (this._res.length === 0) {
      throw new Error('No valid result')
    }
  }

  // -- Public Interface

  decodeFirst (input) {
    this._decode(input);

    return this._res[0]
  }

  decodeAll (input) {
    this._decode(input);

    return this._res
  }

  /**
   * Decode the first cbor object.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {*}
   */
  static decode (input, enc) {
    if (typeof input === 'string') {
      input = Buffer.from(input, enc || 'hex');
    }

    const dec = new Decoder({ size: input.length });
    return dec.decodeFirst(input)
  }

  /**
   * Decode all cbor objects.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {Array<*>}
   */
  static decodeAll (input, enc) {
    if (typeof input === 'string') {
      input = Buffer.from(input, enc || 'hex');
    }

    const dec = new Decoder({ size: input.length });
    return dec.decodeAll(input)
  }
}

Decoder.decodeFirst = Decoder.decode;

var decoder = Decoder;

const { Buffer: Buffer$1 } = require$$0;



/**
 * Output the diagnostic format from a stream of CBOR bytes.
 *
 */
class Diagnose extends decoder {
  createTag (tagNumber, value) {
    return `${tagNumber}(${value})`
  }

  createInt (val) {
    return super.createInt(val).toString()
  }

  createInt32 (f, g) {
    return super.createInt32(f, g).toString()
  }

  createInt64 (f1, f2, g1, g2) {
    return super.createInt64(f1, f2, g1, g2).toString()
  }

  createInt32Neg (f, g) {
    return super.createInt32Neg(f, g).toString()
  }

  createInt64Neg (f1, f2, g1, g2) {
    return super.createInt64Neg(f1, f2, g1, g2).toString()
  }

  createTrue () {
    return 'true'
  }

  createFalse () {
    return 'false'
  }

  createFloat (val) {
    const fl = super.createFloat(val);
    if (utils.isNegativeZero(val)) {
      return '-0_1'
    }

    return `${fl}_1`
  }

  createFloatSingle (a, b, c, d) {
    const fl = super.createFloatSingle(a, b, c, d);
    return `${fl}_2`
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    const fl = super.createFloatDouble(a, b, c, d, e, f, g, h);
    return `${fl}_3`
  }

  createByteString (raw, len) {
    const val = raw.join(', ');

    if (len === -1) {
      return `(_ ${val})`
    }
    return `h'${val}`
  }

  createByteStringFromHeap (start, end) {
    const val = (Buffer$1.from(
      super.createByteStringFromHeap(start, end)
    )).toString('hex');

    return `h'${val}'`
  }

  createInfinity () {
    return 'Infinity_1'
  }

  createInfinityNeg () {
    return '-Infinity_1'
  }

  createNaN () {
    return 'NaN_1'
  }

  createNaNNeg () {
    return '-NaN_1'
  }

  createNull () {
    return 'null'
  }

  createUndefined () {
    return 'undefined'
  }

  createSimpleUnassigned (val) {
    return `simple(${val})`
  }

  createArray (arr, len) {
    const val = super.createArray(arr, len);

    if (len === -1) {
      // indefinite
      return `[_ ${val.join(', ')}]`
    }

    return `[${val.join(', ')}]`
  }

  createMap (map, len) {
    const val = super.createMap(map);
    const list = Array.from(val.keys())
      .reduce(collectObject(val), '');

    if (len === -1) {
      return `{_ ${list}}`
    }

    return `{${list}}`
  }

  createObject (obj, len) {
    const val = super.createObject(obj);
    const map = Object.keys(val)
      .reduce(collectObject(val), '');

    if (len === -1) {
      return `{_ ${map}}`
    }

    return `{${map}}`
  }

  createUtf8String (raw, len) {
    const val = raw.join(', ');

    if (len === -1) {
      return `(_ ${val})`
    }

    return `"${val}"`
  }

  createUtf8StringFromHeap (start, end) {
    const val = (Buffer$1.from(
      super.createUtf8StringFromHeap(start, end)
    )).toString('utf8');

    return `"${val}"`
  }

  static diagnose (input, enc) {
    if (typeof input === 'string') {
      input = Buffer$1.from(input, enc || 'hex');
    }

    const dec = new Diagnose();
    return dec.decodeFirst(input)
  }
}

var diagnose = Diagnose;

function collectObject (val) {
  return (acc, key) => {
    if (acc) {
      return `${acc}, ${key}: ${val[key]}`
    }
    return `${key}: ${val[key]}`
  }
}

const { Buffer: Buffer$2 } = require$$0;
const { URL: URL$3 } = isoUrl;
const Bignumber$2 = require$$2.BigNumber;



const MT$2 = constants.MT;
const NUMBYTES$1 = constants.NUMBYTES;
const SHIFT32$1 = constants.SHIFT32;
const SYMS$2 = constants.SYMS;
const TAG$1 = constants.TAG;
const HALF = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.TWO;
const FLOAT = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.FOUR;
const DOUBLE = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.EIGHT;
const TRUE = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.TRUE;
const FALSE = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.FALSE;
const UNDEFINED = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.UNDEFINED;
const NULL = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.NULL;

const MAXINT_BN = new Bignumber$2('0x20000000000000');
const BUF_NAN = Buffer$2.from('f97e00', 'hex');
const BUF_INF_NEG = Buffer$2.from('f9fc00', 'hex');
const BUF_INF_POS = Buffer$2.from('f97c00', 'hex');

function toType (obj) {
  // [object Type]
  // --------8---1
  return ({}).toString.call(obj).slice(8, -1)
}

/**
 * Transform JavaScript values into CBOR bytes
 *
 */
class Encoder {
  /**
   * @param {Object} [options={}]
   * @param {function(Buffer)} options.stream
   */
  constructor (options) {
    options = options || {};

    this.streaming = typeof options.stream === 'function';
    this.onData = options.stream;

    this.semanticTypes = [
      [URL$3, this._pushUrl],
      [Bignumber$2, this._pushBigNumber]
    ];

    const addTypes = options.genTypes || [];
    const len = addTypes.length;
    for (let i = 0; i < len; i++) {
      this.addSemanticType(
        addTypes[i][0],
        addTypes[i][1]
      );
    }

    this._reset();
  }

  addSemanticType (type, fun) {
    const len = this.semanticTypes.length;
    for (let i = 0; i < len; i++) {
      const typ = this.semanticTypes[i][0];
      if (typ === type) {
        const old = this.semanticTypes[i][1];
        this.semanticTypes[i][1] = fun;
        return old
      }
    }
    this.semanticTypes.push([type, fun]);
    return null
  }

  push (val) {
    if (!val) {
      return true
    }

    this.result[this.offset] = val;
    this.resultMethod[this.offset] = 0;
    this.resultLength[this.offset] = val.length;
    this.offset++;

    if (this.streaming) {
      this.onData(this.finalize());
    }

    return true
  }

  pushWrite (val, method, len) {
    this.result[this.offset] = val;
    this.resultMethod[this.offset] = method;
    this.resultLength[this.offset] = len;
    this.offset++;

    if (this.streaming) {
      this.onData(this.finalize());
    }

    return true
  }

  _pushUInt8 (val) {
    return this.pushWrite(val, 1, 1)
  }

  _pushUInt16BE (val) {
    return this.pushWrite(val, 2, 2)
  }

  _pushUInt32BE (val) {
    return this.pushWrite(val, 3, 4)
  }

  _pushDoubleBE (val) {
    return this.pushWrite(val, 4, 8)
  }

  _pushNaN () {
    return this.push(BUF_NAN)
  }

  _pushInfinity (obj) {
    const half = (obj < 0) ? BUF_INF_NEG : BUF_INF_POS;
    return this.push(half)
  }

  _pushFloat (obj) {
    const b2 = Buffer$2.allocUnsafe(2);

    if (utils.writeHalf(b2, obj)) {
      if (utils.parseHalf(b2) === obj) {
        return this._pushUInt8(HALF) && this.push(b2)
      }
    }

    const b4 = Buffer$2.allocUnsafe(4);
    b4.writeFloatBE(obj, 0);
    if (b4.readFloatBE(0) === obj) {
      return this._pushUInt8(FLOAT) && this.push(b4)
    }

    return this._pushUInt8(DOUBLE) && this._pushDoubleBE(obj)
  }

  _pushInt (obj, mt, orig) {
    const m = mt << 5;
    if (obj < 24) {
      return this._pushUInt8(m | obj)
    }

    if (obj <= 0xff) {
      return this._pushUInt8(m | NUMBYTES$1.ONE) && this._pushUInt8(obj)
    }

    if (obj <= 0xffff) {
      return this._pushUInt8(m | NUMBYTES$1.TWO) && this._pushUInt16BE(obj)
    }

    if (obj <= 0xffffffff) {
      return this._pushUInt8(m | NUMBYTES$1.FOUR) && this._pushUInt32BE(obj)
    }

    if (obj <= Number.MAX_SAFE_INTEGER) {
      return this._pushUInt8(m | NUMBYTES$1.EIGHT) &&
        this._pushUInt32BE(Math.floor(obj / SHIFT32$1)) &&
        this._pushUInt32BE(obj % SHIFT32$1)
    }

    if (mt === MT$2.NEG_INT) {
      return this._pushFloat(orig)
    }

    return this._pushFloat(obj)
  }

  _pushIntNum (obj) {
    if (obj < 0) {
      return this._pushInt(-obj - 1, MT$2.NEG_INT, obj)
    } else {
      return this._pushInt(obj, MT$2.POS_INT)
    }
  }

  _pushNumber (obj) {
    switch (false) {
      case (obj === obj): // eslint-disable-line
        return this._pushNaN(obj)
      case isFinite(obj):
        return this._pushInfinity(obj)
      case ((obj % 1) !== 0):
        return this._pushIntNum(obj)
      default:
        return this._pushFloat(obj)
    }
  }

  _pushString (obj) {
    const len = Buffer$2.byteLength(obj, 'utf8');
    return this._pushInt(len, MT$2.UTF8_STRING) && this.pushWrite(obj, 5, len)
  }

  _pushBoolean (obj) {
    return this._pushUInt8(obj ? TRUE : FALSE)
  }

  _pushUndefined (obj) {
    return this._pushUInt8(UNDEFINED)
  }

  _pushArray (gen, obj) {
    const len = obj.length;
    if (!gen._pushInt(len, MT$2.ARRAY)) {
      return false
    }
    for (let j = 0; j < len; j++) {
      if (!gen.pushAny(obj[j])) {
        return false
      }
    }
    return true
  }

  _pushTag (tag) {
    return this._pushInt(tag, MT$2.TAG)
  }

  _pushDate (gen, obj) {
    // Round date, to get seconds since 1970-01-01 00:00:00 as defined in
    // Sec. 2.4.1 and get a possibly more compact encoding. Note that it is
    // still allowed to encode fractions of seconds which can be achieved by
    // changing overwriting the encode function for Date objects.
    return gen._pushTag(TAG$1.DATE_EPOCH) && gen.pushAny(Math.round(obj / 1000))
  }

  _pushBuffer (gen, obj) {
    return gen._pushInt(obj.length, MT$2.BYTE_STRING) && gen.push(obj)
  }

  _pushNoFilter (gen, obj) {
    return gen._pushBuffer(gen, obj.slice())
  }

  _pushRegexp (gen, obj) {
    return gen._pushTag(TAG$1.REGEXP) && gen.pushAny(obj.source)
  }

  _pushSet (gen, obj) {
    if (!gen._pushInt(obj.size, MT$2.ARRAY)) {
      return false
    }
    for (const x of obj) {
      if (!gen.pushAny(x)) {
        return false
      }
    }
    return true
  }

  _pushUrl (gen, obj) {
    return gen._pushTag(TAG$1.URI) && gen.pushAny(obj.format())
  }

  _pushBigint (obj) {
    let tag = TAG$1.POS_BIGINT;
    if (obj.isNegative()) {
      obj = obj.negated().minus(1);
      tag = TAG$1.NEG_BIGINT;
    }
    let str = obj.toString(16);
    if (str.length % 2) {
      str = '0' + str;
    }
    const buf = Buffer$2.from(str, 'hex');
    return this._pushTag(tag) && this._pushBuffer(this, buf)
  }

  _pushBigNumber (gen, obj) {
    if (obj.isNaN()) {
      return gen._pushNaN()
    }
    if (!obj.isFinite()) {
      return gen._pushInfinity(obj.isNegative() ? -Infinity : Infinity)
    }
    if (obj.isInteger()) {
      return gen._pushBigint(obj)
    }
    if (!(gen._pushTag(TAG$1.DECIMAL_FRAC) &&
      gen._pushInt(2, MT$2.ARRAY))) {
      return false
    }

    const dec = obj.decimalPlaces();
    const slide = obj.multipliedBy(new Bignumber$2(10).pow(dec));
    if (!gen._pushIntNum(-dec)) {
      return false
    }
    if (slide.abs().isLessThan(MAXINT_BN)) {
      return gen._pushIntNum(slide.toNumber())
    } else {
      return gen._pushBigint(slide)
    }
  }

  _pushMap (gen, obj) {
    if (!gen._pushInt(obj.size, MT$2.MAP)) {
      return false
    }

    return this._pushRawMap(
      obj.size,
      Array.from(obj)
    )
  }

  _pushObject (obj) {
    if (!obj) {
      return this._pushUInt8(NULL)
    }

    var len = this.semanticTypes.length;
    for (var i = 0; i < len; i++) {
      if (obj instanceof this.semanticTypes[i][0]) {
        return this.semanticTypes[i][1].call(obj, this, obj)
      }
    }

    var f = obj.encodeCBOR;
    if (typeof f === 'function') {
      return f.call(obj, this)
    }

    var keys = Object.keys(obj);
    var keyLength = keys.length;
    if (!this._pushInt(keyLength, MT$2.MAP)) {
      return false
    }

    return this._pushRawMap(
      keyLength,
      keys.map((k) => [k, obj[k]])
    )
  }

  _pushRawMap (len, map) {
    // Sort keys for canoncialization
    // 1. encode key
    // 2. shorter key comes before longer key
    // 3. same length keys are sorted with lower
    //    byte value before higher

    map = map.map(function (a) {
      a[0] = Encoder.encode(a[0]);
      return a
    }).sort(utils.keySorter);

    for (var j = 0; j < len; j++) {
      if (!this.push(map[j][0])) {
        return false
      }

      if (!this.pushAny(map[j][1])) {
        return false
      }
    }

    return true
  }

  /**
   * Alias for `.pushAny`
   *
   * @param {*} obj
   * @returns {boolean} true on success
   */
  write (obj) {
    return this.pushAny(obj)
  }

  /**
   * Push any supported type onto the encoded stream
   *
   * @param {any} obj
   * @returns {boolean} true on success
   */
  pushAny (obj) {
    var typ = toType(obj);

    switch (typ) {
      case 'Number':
        return this._pushNumber(obj)
      case 'String':
        return this._pushString(obj)
      case 'Boolean':
        return this._pushBoolean(obj)
      case 'Object':
        return this._pushObject(obj)
      case 'Array':
        return this._pushArray(this, obj)
      case 'Uint8Array':
        return this._pushBuffer(this, Buffer$2.isBuffer(obj) ? obj : Buffer$2.from(obj))
      case 'Null':
        return this._pushUInt8(NULL)
      case 'Undefined':
        return this._pushUndefined(obj)
      case 'Map':
        return this._pushMap(this, obj)
      case 'Set':
        return this._pushSet(this, obj)
      case 'URL':
        return this._pushUrl(this, obj)
      case 'BigNumber':
        return this._pushBigNumber(this, obj)
      case 'Date':
        return this._pushDate(this, obj)
      case 'RegExp':
        return this._pushRegexp(this, obj)
      case 'Symbol':
        switch (obj) {
          case SYMS$2.NULL:
            return this._pushObject(null)
          case SYMS$2.UNDEFINED:
            return this._pushUndefined(undefined)
          // TODO: Add pluggable support for other symbols
          default:
            throw new Error('Unknown symbol: ' + obj.toString())
        }
      default:
        throw new Error('Unknown type: ' + typeof obj + ', ' + (obj ? obj.toString() : ''))
    }
  }

  finalize () {
    if (this.offset === 0) {
      return null
    }

    var result = this.result;
    var resultLength = this.resultLength;
    var resultMethod = this.resultMethod;
    var offset = this.offset;

    // Determine the size of the buffer
    var size = 0;
    var i = 0;

    for (; i < offset; i++) {
      size += resultLength[i];
    }

    var res = Buffer$2.allocUnsafe(size);
    var index = 0;
    var length = 0;

    // Write the content into the result buffer
    for (i = 0; i < offset; i++) {
      length = resultLength[i];

      switch (resultMethod[i]) {
        case 0:
          result[i].copy(res, index);
          break
        case 1:
          res.writeUInt8(result[i], index, true);
          break
        case 2:
          res.writeUInt16BE(result[i], index, true);
          break
        case 3:
          res.writeUInt32BE(result[i], index, true);
          break
        case 4:
          res.writeDoubleBE(result[i], index, true);
          break
        case 5:
          res.write(result[i], index, length, 'utf8');
          break
        default:
          throw new Error('unkown method')
      }

      index += length;
    }

    var tmp = res;

    this._reset();

    return tmp
  }

  _reset () {
    this.result = [];
    this.resultMethod = [];
    this.resultLength = [];
    this.offset = 0;
  }

  /**
   * Encode the given value
   * @param {*} o
   * @returns {Buffer}
   */
  static encode (o) {
    const enc = new Encoder();
    const ret = enc.pushAny(o);
    if (!ret) {
      throw new Error('Failed to encode input')
    }

    return enc.finalize()
  }
}

var encoder = Encoder;

var src = createCommonjsModule(function (module, exports) {

// exports.Commented = require('./commented')
exports.Diagnose = diagnose;
exports.Decoder = decoder;
exports.Encoder = encoder;
exports.Simple = simple;
exports.Tagged = tagged;

// exports.comment = exports.Commented.comment
exports.decodeAll = exports.Decoder.decodeAll;
exports.decodeFirst = exports.Decoder.decodeFirst;
exports.diagnose = exports.Diagnose.diagnose;
exports.encode = exports.Encoder.encode;
exports.decode = exports.Decoder.decode;

exports.leveldb = {
  decode: exports.Decoder.decodeAll,
  encode: exports.Encoder.encode,
  buffer: true,
  name: 'cbor'
};
});

/**
 * Concatenate multiple array buffers.
 * @param buffers The buffers to concatenate.
 */
function concat$1(...buffers) {
    const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
    let index = 0;
    for (const b of buffers) {
        result.set(new Uint8Array(b), index);
        index += b.byteLength;
    }
    return result.buffer;
}
/**
 * Transforms a buffer to an hexadecimal string. This will use the buffer as an Uint8Array.
 * @param buffer The buffer to return the hexadecimal string of.
 */
function toHex(buffer) {
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const hexRe = /^([0-9A-F]{2})*$/i.compile();
/**
 * Transforms a hexadecimal string into an array buffer.
 * @param hex The hexadecimal string to use.
 */
function fromHex(hex) {
    if (!hexRe.test(hex)) {
        throw new Error('Invalid hexadecimal string.');
    }
    const buffer = [...hex]
        .reduce((acc, curr, i) => {
        // tslint:disable-next-line:no-bitwise
        acc[(i / 2) | 0] = (acc[(i / 2) | 0] || '') + curr;
        return acc;
    }, [])
        .map(x => Number.parseInt(x, 16));
    return new Uint8Array(buffer).buffer;
}
function compare$1(b1, b2) {
    if (b1.byteLength !== b2.byteLength) {
        return b1.byteLength - b2.byteLength;
    }
    const u1 = new Uint8Array(b1);
    const u2 = new Uint8Array(b2);
    for (let i = 0; i < u1.length; i++) {
        if (u1[i] !== u2[i]) {
            return u1[i] - u2[i];
        }
    }
    return 0;
}

/**
 * sha256 hash the provided Buffer
 * @param data - input to hash function
 */
function hash(data) {
    return sha256.sha256.create().update(new Uint8Array(data)).arrayBuffer();
}
/**
 *
 * @param value unknown value
 * @returns ArrayBuffer
 */
function hashValue(value) {
    if (value instanceof src.Tagged) {
        return hashValue(value.value);
    }
    else if (typeof value === 'string') {
        return hashString(value);
    }
    else if (typeof value === 'number') {
        return hash(lebEncode(value));
    }
    else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
        return hash(value);
    }
    else if (Array.isArray(value)) {
        const vals = value.map(hashValue);
        return hash(concat$1(...vals));
    }
    else if (value && typeof value === 'object' && value._isPrincipal) {
        return hash(value.toUint8Array());
    }
    else if (typeof value === 'object' &&
        value !== null &&
        typeof value.toHash === 'function') {
        return hashValue(value.toHash());
        // TODO This should be move to a specific async method as the webauthn flow required
        // the flow to be synchronous to ensure Safari touch id works.
        // } else if (value instanceof Promise) {
        //   return value.then(x => hashValue(x));
    }
    else if (typeof value === 'bigint') {
        // Do this check much later than the other bigint check because this one is much less
        // type-safe.
        // So we want to try all the high-assurance type guards before this 'probable' one.
        return hash(lebEncode(value));
    }
    throw Object.assign(new Error(`Attempt to hash a value of unsupported type: ${value}`), {
        // include so logs/callers can understand the confusing value.
        // (when stringified in error message, prototype info is lost)
        value,
    });
}
const hashString = (value) => {
    const encoded = new TextEncoder().encode(value);
    return hash(encoded);
};
/**
 * Get the RequestId of the provided ic-ref request.
 * RequestId is the result of the representation-independent-hash function.
 * https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
 * @param request - ic-ref request to hash into RequestId
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function requestIdOf(request) {
    const hashed = Object.entries(request)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
        const hashedKey = hashString(key);
        const hashedValue = hashValue(value);
        return [hashedKey, hashedValue];
    });
    const traversed = hashed;
    const sorted = traversed.sort(([k1], [k2]) => {
        return compare$1(k1, k2);
    });
    const concatenated = concat$1(...sorted.map(x => concat$1(...x)));
    const requestId = hash(concatenated);
    return requestId;
}

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const domainSeparator = new TextEncoder().encode('\x0Aic-request');
class AnonymousIdentity {
    getPrincipal() {
        return Principal.anonymous();
    }
    async transformRequest(request) {
        return Object.assign(Object.assign({}, request), { body: { content: request.body } });
    }
}

var value = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_U64_NUMBER = 0x20000000000000;
function _concat(a, ...args) {
    const newBuffer = new Uint8Array(a.byteLength + args.reduce((acc, b) => acc + b.byteLength, 0));
    newBuffer.set(new Uint8Array(a), 0);
    let i = a.byteLength;
    for (const b of args) {
        newBuffer.set(new Uint8Array(b), i);
        i += b.byteLength;
    }
    return newBuffer.buffer;
}
function _serializeValue(major, minor, value) {
    // Remove everything that's not an hexadecimal character. These are not
    // considered errors since the value was already validated and they might
    // be number decimals or sign.
    value = value.replace(/[^0-9a-fA-F]/g, "");
    // Create the buffer from the value with left padding with 0.
    const length = 2 ** (minor - 24 /* Int8 */);
    value = value.slice(-length * 2).padStart(length * 2, "0");
    const bytes = [(major << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
    return new Uint8Array(bytes).buffer;
}
function _serializeNumber(major, value) {
    if (value < 24) {
        return new Uint8Array([(major << 5) + value]).buffer;
    }
    else {
        const minor = value <= 0xff
            ? 24 /* Int8 */
            : value <= 0xffff
                ? 25 /* Int16 */
                : value <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        return _serializeValue(major, minor, value.toString(16));
    }
}
function _serializeString(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
            utf8.push(charcode);
        }
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        else {
            // Surrogate pair
            i++;
            charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return _concat(new Uint8Array(_serializeNumber(3 /* TextString */, str.length)), new Uint8Array(utf8));
}
/**
 * Tag a value.
 */
function tagged(tag, value) {
    if (tag == 0xd9d9f7) {
        return _concat(new Uint8Array([0xd9, 0xd9, 0xf7]), value);
    }
    if (tag < 24) {
        return _concat(new Uint8Array([(6 /* Tag */ << 5) + tag]), value);
    }
    else {
        const minor = tag <= 0xff
            ? 24 /* Int8 */
            : tag <= 0xffff
                ? 25 /* Int16 */
                : tag <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        const length = 2 ** (minor - 24 /* Int8 */);
        const value = tag
            .toString(16)
            .slice(-length * 2)
            .padStart(length * 2, "0");
        const bytes = [(6 /* Tag */ << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
        return new Uint8Array(bytes).buffer;
    }
}
exports.tagged = tagged;
/**
 * Set the raw bytes contained by this value. This should only be used with another
 * CborValue, or if you are implementing extensions to CBOR.
 * @param bytes A buffer containing the value.
 */
function raw(bytes) {
    return new Uint8Array(bytes).buffer;
}
exports.raw = raw;
/**
 * Encode a number that is between [0, 23].
 * @param n
 */
function uSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    n = Math.min(Math.max(0, n), 23); // Clamp it.
    const bytes = [(0 /* UnsignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.uSmall = uSmall;
function u8(u8, radix) {
    // Force u8 into a number, and validate it.
    u8 = parseInt("" + u8, radix);
    if (isNaN(u8)) {
        throw new RangeError("Invalid number.");
    }
    u8 = Math.min(Math.max(0, u8), 0xff); // Clamp it.
    u8 = u8.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 24 /* Int8 */, u8);
}
exports.u8 = u8;
function u16(u16, radix) {
    // Force u16 into a number, and validate it.
    u16 = parseInt("" + u16, radix);
    if (isNaN(u16)) {
        throw new RangeError("Invalid number.");
    }
    u16 = Math.min(Math.max(0, u16), 0xffff); // Clamp it.
    u16 = u16.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 25 /* Int16 */, u16);
}
exports.u16 = u16;
function u32(u32, radix) {
    // Force u32 into a number, and validate it.
    u32 = parseInt("" + u32, radix);
    if (isNaN(u32)) {
        throw new RangeError("Invalid number.");
    }
    u32 = Math.min(Math.max(0, u32), 0xffffffff); // Clamp it.
    u32 = u32.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 26 /* Int32 */, u32);
}
exports.u32 = u32;
function u64(u64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof u64 == "string" && radix == 16) {
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (u64.match(/[^0-9a-fA-F]/)) {
            throw new RangeError("Invalid number.");
        }
        return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
    }
    // Force u64 into a number, and validate it.
    u64 = parseInt("" + u64, radix);
    if (isNaN(u64)) {
        throw new RangeError("Invalid number.");
    }
    u64 = Math.min(Math.max(0, u64), MAX_U64_NUMBER); // Clamp it to actual limit.
    u64 = u64.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
}
exports.u64 = u64;
/**
 * Encode a negative number that is between [-24, -1].
 */
function iSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    if (n === 0) {
        return uSmall(0);
    }
    // Negative n, clamped to [1, 24], minus 1 (there's no negative 0).
    n = Math.min(Math.max(0, -n), 24) - 1;
    const bytes = [(1 /* SignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.iSmall = iSmall;
function i8(i8, radix) {
    // Force i8 into a number, and validate it.
    i8 = parseInt("" + i8, radix);
    if (isNaN(i8)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i8 = Math.min(Math.max(0, -i8 - 1), 0xff);
    i8 = i8.toString(16);
    return _serializeValue(1 /* SignedInteger */, 24 /* Int8 */, i8);
}
exports.i8 = i8;
function i16(i16, radix) {
    // Force i16 into a number, and validate it.
    i16 = parseInt("" + i16, radix);
    if (isNaN(i16)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i16 = Math.min(Math.max(0, -i16 - 1), 0xffff);
    i16 = i16.toString(16);
    return _serializeValue(1 /* SignedInteger */, 25 /* Int16 */, i16);
}
exports.i16 = i16;
function i32(i32, radix) {
    // Force i32 into a number, and validate it.
    i32 = parseInt("" + i32, radix);
    if (isNaN(i32)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i32 = Math.min(Math.max(0, -i32 - 1), 0xffffffff);
    i32 = i32.toString(16);
    return _serializeValue(1 /* SignedInteger */, 26 /* Int32 */, i32);
}
exports.i32 = i32;
function i64(i64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof i64 == "string" && radix == 16) {
        if (i64.startsWith("-")) {
            i64 = i64.slice(1);
        }
        else {
            // Clamp it.
            i64 = "0";
        }
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (i64.match(/[^0-9a-fA-F]/) || i64.length > 16) {
            throw new RangeError("Invalid number.");
        }
        // We need to do -1 to the number.
        let done = false;
        let newI64 = i64.split("").reduceRight((acc, x) => {
            if (done) {
                return x + acc;
            }
            let n = parseInt(x, 16) - 1;
            if (n >= 0) {
                done = true;
                return n.toString(16) + acc;
            }
            else {
                return "f" + acc;
            }
        }, "");
        if (!done) {
            // This number was 0.
            return u64(0);
        }
        return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, newI64);
    }
    // Force i64 into a number, and validate it.
    i64 = parseInt("" + i64, radix);
    if (isNaN(i64)) {
        throw new RangeError("Invalid number.");
    }
    i64 = Math.min(Math.max(0, -i64 - 1), 0x20000000000000); // Clamp it to actual.
    i64 = i64.toString(16);
    return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, i64);
}
exports.i64 = i64;
/**
 * Encode a number using the smallest amount of bytes, by calling the methods
 * above. e.g. If the number fits in a u8, it will use that.
 */
function number(n) {
    if (n >= 0) {
        if (n < 24) {
            return uSmall(n);
        }
        else if (n <= 0xff) {
            return u8(n);
        }
        else if (n <= 0xffff) {
            return u16(n);
        }
        else if (n <= 0xffffffff) {
            return u32(n);
        }
        else {
            return u64(n);
        }
    }
    else {
        if (n >= -24) {
            return iSmall(n);
        }
        else if (n >= -0xff) {
            return i8(n);
        }
        else if (n >= -0xffff) {
            return i16(n);
        }
        else if (n >= -0xffffffff) {
            return i32(n);
        }
        else {
            return i64(n);
        }
    }
}
exports.number = number;
/**
 * Encode a byte array. This is different than the `raw()` method.
 */
function bytes(bytes) {
    return _concat(_serializeNumber(2 /* ByteString */, bytes.byteLength), bytes);
}
exports.bytes = bytes;
/**
 * Encode a JavaScript string.
 */
function string(str) {
    return _serializeString(str);
}
exports.string = string;
/**
 * Encode an array of cbor values.
 */
function array(items) {
    return _concat(_serializeNumber(4 /* Array */, items.length), ...items);
}
exports.array = array;
/**
 * Encode a map of key-value pairs. The keys are string, and the values are CBOR
 * encoded.
 */
function map(items, stable = false) {
    if (!(items instanceof Map)) {
        items = new Map(Object.entries(items));
    }
    let entries = Array.from(items.entries());
    if (stable) {
        entries = entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    }
    return _concat(_serializeNumber(5 /* Map */, items.size), ...entries.map(([k, v]) => _concat(_serializeString(k), v)));
}
exports.map = map;
/**
 * Encode a single (32 bits) precision floating point number.
 */
function singleFloat(f) {
    const single = new Float32Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 26]), new Uint8Array(single.buffer));
}
exports.singleFloat = singleFloat;
/**
 * Encode a double (64 bits) precision floating point number.
 */
function doubleFloat(f) {
    const single = new Float64Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 27]), new Uint8Array(single.buffer));
}
exports.doubleFloat = doubleFloat;
function bool(v) {
    return v ? true_() : false_();
}
exports.bool = bool;
/**
 * Encode the boolean true.
 */
function true_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 21]));
}
exports.true_ = true_;
/**
 * Encode the boolean false.
 */
function false_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 20]));
}
exports.false_ = false_;
/**
 * Encode the constant null.
 */
function null_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 22]));
}
exports.null_ = null_;
/**
 * Encode the constant undefined.
 */
function undefined_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 23]));
}
exports.undefined_ = undefined_;

});

var serializer = createCommonjsModule(function (module, exports) {
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cbor = __importStar(value);
const BufferClasses = [
    ArrayBuffer,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
];
class JsonDefaultCborEncoder {
    // @param _serializer The CBOR Serializer to use.
    // @param _stable Whether or not keys from objects should be sorted (stable). This is
    //     particularly useful when testing encodings between JSON objects.
    constructor(_serializer, _stable = false) {
        this._serializer = _serializer;
        this._stable = _stable;
        this.name = "jsonDefault";
        this.priority = -100;
    }
    match(value) {
        return ["undefined", "boolean", "number", "string", "object"].indexOf(typeof value) != -1;
    }
    encode(value) {
        switch (typeof value) {
            case "undefined":
                return cbor.undefined_();
            case "boolean":
                return cbor.bool(value);
            case "number":
                if (Math.floor(value) === value) {
                    return cbor.number(value);
                }
                else {
                    return cbor.doubleFloat(value);
                }
            case "string":
                return cbor.string(value);
            case "object":
                if (value === null) {
                    return cbor.null_();
                }
                else if (Array.isArray(value)) {
                    return cbor.array(value.map((x) => this._serializer.serializeValue(x)));
                }
                else if (BufferClasses.find((x) => value instanceof x)) {
                    return cbor.bytes(value.buffer);
                }
                else if (Object.getOwnPropertyNames(value).indexOf("toJSON") !== -1) {
                    return this.encode(value.toJSON());
                }
                else if (value instanceof Map) {
                    const m = new Map();
                    for (const [key, item] of value.entries()) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
                else {
                    const m = new Map();
                    for (const [key, item] of Object.entries(value)) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
            default:
                throw new Error("Invalid value.");
        }
    }
}
exports.JsonDefaultCborEncoder = JsonDefaultCborEncoder;
class ToCborEncoder {
    constructor() {
        this.name = "cborEncoder";
        this.priority = -90;
    }
    match(value) {
        return typeof value == "object" && typeof value["toCBOR"] == "function";
    }
    encode(value) {
        return value.toCBOR();
    }
}
exports.ToCborEncoder = ToCborEncoder;
class CborSerializer {
    constructor() {
        this._encoders = new Set();
    }
    static withDefaultEncoders(stable = false) {
        const s = new this();
        s.addEncoder(new JsonDefaultCborEncoder(s, stable));
        s.addEncoder(new ToCborEncoder());
        return s;
    }
    removeEncoder(name) {
        // Has to make an extra call to values() to ensure it doesn't break on iteration.
        for (const encoder of this._encoders.values()) {
            if (encoder.name == name) {
                this._encoders.delete(encoder);
            }
        }
    }
    addEncoder(encoder) {
        this._encoders.add(encoder);
    }
    getEncoderFor(value) {
        let chosenEncoder = null;
        for (const encoder of this._encoders) {
            if (!chosenEncoder || encoder.priority > chosenEncoder.priority) {
                if (encoder.match(value)) {
                    chosenEncoder = encoder;
                }
            }
        }
        if (chosenEncoder === null) {
            throw new Error("Could not find an encoder for value.");
        }
        return chosenEncoder;
    }
    serializeValue(value) {
        return this.getEncoderFor(value).encode(value);
    }
    serialize(value) {
        return this.serializeValue(value);
    }
}
exports.CborSerializer = CborSerializer;
class SelfDescribeCborSerializer extends CborSerializer {
    serialize(value) {
        return cbor.raw(new Uint8Array([
            // Self describe CBOR.
            ...new Uint8Array([0xd9, 0xd9, 0xf7]),
            ...new Uint8Array(super.serializeValue(value)),
        ]));
    }
}
exports.SelfDescribeCborSerializer = SelfDescribeCborSerializer;

});

var src$1 = createCommonjsModule(function (module, exports) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
__export(serializer);
const value$1 = __importStar(value);
exports.value = value$1;

});

// tslint:disable:max-classes-per-file
// We are using hansl/simple-cbor for CBOR serialization, to avoid issues with
// encoding the uint64 values that the HTTP handler of the client expects for
// canister IDs. However, simple-cbor does not yet provide deserialization so
// we are using `Uint8Array` so that we can use the dignifiedquire/borc CBOR
// decoder.
class PrincipalEncoder {
    get name() {
        return 'Principal';
    }
    get priority() {
        return 0;
    }
    match(value) {
        return value && value._isPrincipal === true;
    }
    encode(v) {
        return src$1.value.bytes(v.toUint8Array());
    }
}
class BufferEncoder {
    get name() {
        return 'Buffer';
    }
    get priority() {
        return 1;
    }
    match(value) {
        return value instanceof ArrayBuffer || ArrayBuffer.isView(value);
    }
    encode(v) {
        return src$1.value.bytes(new Uint8Array(v));
    }
}
class BigIntEncoder {
    get name() {
        return 'BigInt';
    }
    get priority() {
        return 1;
    }
    match(value) {
        return typeof value === `bigint`;
    }
    encode(v) {
        // Always use a bigint encoding.
        if (v > BigInt(0)) {
            return src$1.value.tagged(2, src$1.value.bytes(fromHex(v.toString(16))));
        }
        else {
            return src$1.value.tagged(3, src$1.value.bytes(fromHex((BigInt('-1') * v).toString(16))));
        }
    }
}
const serializer$1 = src$1.SelfDescribeCborSerializer.withDefaultEncoders(true);
serializer$1.addEncoder(new PrincipalEncoder());
serializer$1.addEncoder(new BufferEncoder());
serializer$1.addEncoder(new BigIntEncoder());
var CborTag;
(function (CborTag) {
    CborTag[CborTag["Uint64LittleEndian"] = 71] = "Uint64LittleEndian";
    CborTag[CborTag["Semantic"] = 55799] = "Semantic";
})(CborTag || (CborTag = {}));
/**
 * Encode a JavaScript value into CBOR.
 */
function encode$2(value) {
    return serializer$1.serialize(value);
}
function decodePositiveBigInt(buf) {
    const len = buf.byteLength;
    let res = BigInt(0);
    for (let i = 0; i < len; i++) {
        // tslint:disable-next-line:no-bitwise
        res = res * BigInt(0x100) + BigInt(buf[i]);
    }
    return res;
}
// A BORC subclass that decodes byte strings to ArrayBuffer instead of the Buffer class.
class Uint8ArrayDecoder extends src.Decoder {
    createByteString(raw) {
        return concat$1(...raw);
    }
    createByteStringFromHeap(start, end) {
        if (start === end) {
            return new ArrayBuffer(0);
        }
        return new Uint8Array(this._heap.slice(start, end));
    }
}
function decode$2(input) {
    const buffer = new Uint8Array(input);
    const decoder = new Uint8ArrayDecoder({
        size: buffer.byteLength,
        tags: {
            // Override tags 2 and 3 for BigInt support (borc supports only BigNumber).
            2: val => decodePositiveBigInt(val),
            3: val => -decodePositiveBigInt(val),
            [CborTag.Semantic]: (value) => value,
        },
    });
    return decoder.decodeFirst(buffer);
}

// tslint:enable:camel-case
// The types of values allowed in the `request_type` field for submit requests.
var SubmitRequestType;
(function (SubmitRequestType) {
    SubmitRequestType["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));

const NANOSECONDS_PER_MILLISECONDS = BigInt(1000000);
const REPLICA_PERMITTED_DRIFT_MILLISECONDS = BigInt(60 * 1000);
class Expiry {
    constructor(deltaInMSec) {
        // Use bigint because it can overflow the maximum number allowed in a double float.
        this._value =
            (BigInt(Date.now()) + BigInt(deltaInMSec) - REPLICA_PERMITTED_DRIFT_MILLISECONDS) *
                NANOSECONDS_PER_MILLISECONDS;
    }
    toCBOR() {
        // TODO: change this to take the minimum amount of space (it always takes 8 bytes now).
        return src$1.value.u64(this._value.toString(16), 16);
    }
    toHash() {
        return lebEncode(this._value);
    }
}

var RequestStatusResponseStatus;
(function (RequestStatusResponseStatus) {
    RequestStatusResponseStatus["Received"] = "received";
    RequestStatusResponseStatus["Processing"] = "processing";
    RequestStatusResponseStatus["Replied"] = "replied";
    RequestStatusResponseStatus["Rejected"] = "rejected";
    RequestStatusResponseStatus["Unknown"] = "unknown";
    RequestStatusResponseStatus["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
// Default delta for ingress expiry is 5 minutes.
const DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1000;
// Root public key for the IC, encoded as hex
const IC_ROOT_KEY = '308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814' +
    'c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d968' +
    '5f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484' +
    'b01291091c5f87b98883463f98091a0baaae';
// IC0 domain info
const IC0_DOMAIN = 'ic0.app';
const IC0_SUB_DOMAIN = '.ic0.app';
class HttpDefaultFetchError extends AgentError {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
function getDefaultFetch() {
    let defaultFetch;
    if (typeof window !== 'undefined') {
        // Browser context
        if (window.fetch) {
            defaultFetch = window.fetch.bind(window);
        }
        else {
            throw new HttpDefaultFetchError('Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present.');
        }
    }
    else if (typeof global$1 !== 'undefined') {
        // Node context
        if (global$1.fetch) {
            defaultFetch = global$1.fetch;
        }
        else {
            throw new HttpDefaultFetchError('Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available.');
        }
    }
    else if (typeof self !== 'undefined') {
        if (self.fetch) {
            defaultFetch = self.fetch;
        }
    }
    if (defaultFetch) {
        return defaultFetch;
    }
    throw new HttpDefaultFetchError('Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context.');
}
// A HTTP agent allows users to interact with a client of the internet computer
// using the available methods. It exposes an API that closely follows the
// public view of the internet computer, and is not intended to be exposed
// directly to the majority of users due to its low-level interface.
//
// There is a pipeline to apply transformations to the request before sending
// it to the client. This is to decouple signature, nonce generation and
// other computations so that this class can stay as simple as possible while
// allowing extensions.
class HttpAgent {
    constructor(options = {}) {
        this.rootKey = fromHex(IC_ROOT_KEY);
        this._pipeline = [];
        this._rootKeyFetched = false;
        if (options.source) {
            if (!(options.source instanceof HttpAgent)) {
                throw new Error("An Agent's source can only be another HttpAgent");
            }
            this._pipeline = [...options.source._pipeline];
            this._identity = options.source._identity;
            this._fetch = options.source._fetch;
            this._host = options.source._host;
            this._credentials = options.source._credentials;
        }
        else {
            this._fetch = options.fetch || getDefaultFetch() || fetch.bind(global$1);
        }
        if (options.host !== undefined) {
            if (!options.host.match(/^[a-z]+:/) && typeof window !== 'undefined') {
                this._host = new URL(window.location.protocol + '//' + options.host);
            }
            else {
                this._host = new URL(options.host);
            }
        }
        else if (options.source !== undefined) {
            // Safe to ignore here.
            this._host = options.source._host;
        }
        else {
            const location = typeof window !== 'undefined' ? window.location : undefined;
            if (!location) {
                throw new Error('Must specify a host to connect to.');
            }
            this._host = new URL(location + '');
        }
        // Rewrite to avoid redirects
        if (this._host.hostname.endsWith(IC0_SUB_DOMAIN)) {
            this._host.hostname = IC0_DOMAIN;
        }
        if (options.credentials) {
            const { name, password } = options.credentials;
            this._credentials = `${name}${password ? ':' + password : ''}`;
        }
        this._identity = Promise.resolve(options.identity || new AnonymousIdentity());
    }
    addTransform(fn, priority = fn.priority || 0) {
        // Keep the pipeline sorted at all time, by priority.
        const i = this._pipeline.findIndex(x => (x.priority || 0) < priority);
        this._pipeline.splice(i >= 0 ? i : this._pipeline.length, 0, Object.assign(fn, { priority }));
    }
    async getPrincipal() {
        return (await this._identity).getPrincipal();
    }
    async call(canisterId, options, identity) {
        const id = (await (identity !== undefined ? await identity : await this._identity));
        const canister = Principal.from(canisterId);
        const ecid = options.effectiveCanisterId
            ? Principal.from(options.effectiveCanisterId)
            : canister;
        const sender = id.getPrincipal() || Principal.anonymous();
        const submit = {
            request_type: SubmitRequestType.Call,
            canister_id: canister,
            method_name: options.methodName,
            arg: options.arg,
            sender,
            ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let transformedRequest = (await this._transform({
            request: {
                body: null,
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (this._credentials ? { Authorization: 'Basic ' + btoa(this._credentials) } : {})),
            },
            endpoint: "call" /* Call */,
            body: submit,
        }));
        // Apply transform for identity.
        transformedRequest = await id.transformRequest(transformedRequest);
        const body = encode$2(transformedRequest.body);
        // Run both in parallel. The fetch is quite expensive, so we have plenty of time to
        // calculate the requestId locally.
        const [response, requestId] = await Promise.all([
            this._fetch('' + new URL(`/api/v2/canister/${ecid.toText()}/call`, this._host), Object.assign(Object.assign({}, transformedRequest.request), { body })),
            requestIdOf(submit),
        ]);
        if (!response.ok) {
            throw new Error(`Server returned an error:\n` +
                `  Code: ${response.status} (${response.statusText})\n` +
                `  Body: ${await response.text()}\n`);
        }
        return {
            requestId,
            response: {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
            },
        };
    }
    async query(canisterId, fields, identity) {
        const id = await (identity !== undefined ? await identity : await this._identity);
        const canister = typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId;
        const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || Principal.anonymous();
        const request = {
            request_type: "query" /* Query */,
            canister_id: canister,
            method_name: fields.methodName,
            arg: fields.arg,
            sender,
            ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
        };
        // TODO: remove this any. This can be a Signed or UnSigned request.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let transformedRequest = await this._transform({
            request: {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (this._credentials ? { Authorization: 'Basic ' + btoa(this._credentials) } : {})),
            },
            endpoint: "read" /* Query */,
            body: request,
        });
        // Apply transform for identity.
        transformedRequest = await id.transformRequest(transformedRequest);
        const body = encode$2(transformedRequest.body);
        const response = await this._fetch('' + new URL(`/api/v2/canister/${canister.toText()}/query`, this._host), Object.assign(Object.assign({}, transformedRequest.request), { body }));
        if (!response.ok) {
            throw new Error(`Server returned an error:\n` +
                `  Code: ${response.status} (${response.statusText})\n` +
                `  Body: ${await response.text()}\n`);
        }
        return decode$2(await response.arrayBuffer());
    }
    async readState(canisterId, fields, identity) {
        const canister = typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId;
        const id = await (identity !== undefined ? await identity : await this._identity);
        const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || Principal.anonymous();
        // TODO: remove this any. This can be a Signed or UnSigned request.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let transformedRequest = await this._transform({
            request: {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (this._credentials ? { Authorization: 'Basic ' + btoa(this._credentials) } : {})),
            },
            endpoint: "read_state" /* ReadState */,
            body: {
                request_type: "read_state" /* ReadState */,
                paths: fields.paths,
                sender,
                ingress_expiry: new Expiry(DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS),
            },
        });
        // Apply transform for identity.
        transformedRequest = await id.transformRequest(transformedRequest);
        const body = encode$2(transformedRequest.body);
        const response = await this._fetch('' + new URL(`/api/v2/canister/${canister}/read_state`, this._host), Object.assign(Object.assign({}, transformedRequest.request), { body }));
        if (!response.ok) {
            throw new Error(`Server returned an error:\n` +
                `  Code: ${response.status} (${response.statusText})\n` +
                `  Body: ${await response.text()}\n`);
        }
        return decode$2(await response.arrayBuffer());
    }
    async status() {
        const headers = this._credentials
            ? {
                Authorization: 'Basic ' + btoa(this._credentials),
            }
            : {};
        const response = await this._fetch('' + new URL(`/api/v2/status`, this._host), { headers });
        if (!response.ok) {
            throw new Error(`Server returned an error:\n` +
                `  Code: ${response.status} (${response.statusText})\n` +
                `  Body: ${await response.text()}\n`);
        }
        return decode$2(await response.arrayBuffer());
    }
    async fetchRootKey() {
        if (!this._rootKeyFetched) {
            // Hex-encoded version of the replica root key
            this.rootKey = (await this.status()).root_key;
            this._rootKeyFetched = true;
        }
        return this.rootKey;
    }
    _transform(request) {
        let p = Promise.resolve(request);
        for (const fn of this._pipeline) {
            p = p.then(r => fn(r).then(r2 => r2 || r));
        }
        return p;
    }
}

var ProxyMessageKind;
(function (ProxyMessageKind) {
    ProxyMessageKind["Error"] = "err";
    ProxyMessageKind["GetPrincipal"] = "gp";
    ProxyMessageKind["GetPrincipalResponse"] = "gpr";
    ProxyMessageKind["Query"] = "q";
    ProxyMessageKind["QueryResponse"] = "qr";
    ProxyMessageKind["Call"] = "c";
    ProxyMessageKind["CallResponse"] = "cr";
    ProxyMessageKind["ReadState"] = "rs";
    ProxyMessageKind["ReadStateResponse"] = "rsr";
    ProxyMessageKind["Status"] = "s";
    ProxyMessageKind["StatusResponse"] = "sr";
})(ProxyMessageKind || (ProxyMessageKind = {}));

function getDefaultAgent() {
    const agent = typeof window === 'undefined'
        ? typeof global$1 === 'undefined'
            ? typeof self === 'undefined'
                ? undefined
                : self.ic.agent
            : global$1.ic.agent
        : window.ic.agent;
    if (!agent) {
        throw new Error('No Agent could be found.');
    }
    return agent;
}

/**
 * This file is generated from the candid for asset management.
 */
/* tslint:disable */
// @ts-ignore
var managementCanisterIdl = ({ IDL }) => {
    const canister_id = IDL.Principal;
    const wasm_module = IDL.Vec(IDL.Nat8);
    const CanisterSettings = IDL.Record({
        compute_allocation: IDL.Opt(IDL.Nat),
        memory_allocation: IDL.Opt(IDL.Nat),
    });
    return IDL.Service({
        provisional_create_canister_with_cycles: IDL.Func([IDL.Record({ amount: IDL.Opt(IDL.Nat), settings: IDL.Opt(CanisterSettings) })], [IDL.Record({ canister_id: canister_id })], []),
        create_canister: IDL.Func([], [IDL.Record({ canister_id: canister_id })], []),
        install_code: IDL.Func([
            IDL.Record({
                mode: IDL.Variant({ install: IDL.Null, reinstall: IDL.Null, upgrade: IDL.Null }),
                canister_id: canister_id,
                wasm_module: wasm_module,
                arg: IDL.Vec(IDL.Nat8),
            }),
        ], [], []),
        set_controller: IDL.Func([IDL.Record({ canister_id: canister_id, new_controller: IDL.Principal })], [], []),
    });
};

/* tslint:enable */
/**
 * Create a management canister actor.
 * @param config
 */
function getManagementCanister(config) {
    function transform(methodName, args, callConfig) {
        const first = args[0];
        let effectiveCanisterId = Principal.fromHex('');
        if (first && typeof first === 'object' && first.canister_id) {
            effectiveCanisterId = Principal.from(first.canister_id);
        }
        return { effectiveCanisterId };
    }
    return Actor.createActor(managementCanisterIdl, Object.assign(Object.assign(Object.assign({}, config), { canisterId: Principal.fromHex('') }), {
        callTransform: transform,
        queryTransform: transform,
    }));
}

var base64Arraybuffer = createCommonjsModule(function (module, exports) {
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();
});

/* tslint:disable */
/* eslint-disable */
let wasm;
// This WASM is generated from the BLS Rust code of the Agent RS (see
// http://github.com/dfinity/agent-rs/)
// Once the WASM is compiled, simply base64 encode it and include it in this string.
const wasmBytesBase64 = `
    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
    g8AAEF8CQAJAIAZB6AFqEFoNACAGQShqEIQBDQAgBkGIPWoQS0EAIQcgBkGIwwBqQTgQchogBkG4IWpBOBByGiAGQYjA
    AGoQSyAGQcjEAGoQSyAGQcjJAGoQSyAGQcjMAGoQSyAGQagGahBLIAZBsAxqEEsgBkHIzwBqEEsgBkHQ1QBqEEsgBkHY
    2wBqEEsgBkG4FWoQSyAGQZgjaiAGQcjJAGpBwAEQZxogBkHYJGogBkHIzABqQcABEGcaIAZBmCZqIAZBqAZqQcABEGca
    IAZB2CdqIAZBsAxqQcABEGcaIAZBmClqIAZByM8AakHAARBnGiAGQdgqaiAGQdDVAGpBwAEQZxogBkGYLGogBkHY2wBq
    QcABEGcaIAZB2C1qIAZBuBVqQcABEGcaIAZBuBVqQecAEHIaIAZBiMAAaiAGQShqEH8gBkGIwABqEBggBkGYI2ogBkEo
    ahB/A0AgB0HACkYEQCAGQbghaiAGQegBahBrIAYpA7ghIRcgBkG4IWpBARCdASAGQbghahBEIAYpA7ghIRYgBkGIwwBq
    IAZBuCFqEGsgBkGIwwBqQQEQnQEgBkGIwwBqEEQgBkG4IWogBkGIwwBqIBdCAoGnEE8gBkGIwABqIAZBKGogFkICgacQ
    bSAGQcjEAGogBkGIwABqEH8gBkG4IWoQKUEDaiIJQQJ2IgdBAWohAkEAIQgCQAJAAkADQAJAIAZBuCFqQQUQjAEhAyAC
    IAhGBEAgCUGYA0kNASACQecAQbCEwAAQPAALIAhB5wBGDQIgBkG4FWogCGogA0FwaiIDOgAAIAZBuCFqIANBGHRBGHUQ
    ngEgBkG4IWoQRCAGQbghakEEEDsgCEEBaiEIDAELCyAGQbgVaiACaiADOgAAIANBGHRBGHVBf2oiA0EBdiECIANBD0sN
    ASAGQYg9aiAGQZgjaiACQcABbGoQfwNAIAdBf0YEQCAGQYg9aiAGQcjEAGoQcyAGQZgjaiAGQYg9akHAARBnGgwICyAH
    QeYASw0DIAZBiMAAaiAGQZgjaiAGQbgVaiAHaiwAABAfIAdBf2ohByAGQYg9ahAYIAZBiD1qEBggBkGIPWoQGCAGQYg9
    ahAYIAZBiD1qIAZBiMAAahAMDAALAAtB5wBB5wBBoITAABA8AAsgAkEIQcCEwAAQPAALIAdB5wBB0ITAABA8AAUgBkHI
    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
    UtcEAKAIAIgFBASACdCICcQRAIAAoAggMAQtB1LXBACABIAJyNgIAIAALIQEgACAENgIIIAEgBDYCDCAEIAA2AgwgBCAB
    NgIIC0EAIQVB6LjBACgCACIAIAZNDQBB6LjBACAAIAZrIgI2AgBB8LjBAEHwuMEAKAIAIgEgBmoiADYCACAAIAJBAXI2A
    gQgASAGQQNyNgIEIAFBCGoPCyAFDwsgASAHNgIYIAMoAhAiAARAIAEgADYCECAAIAE2AhgLIANBFGooAgAiAEUNACABQR
    RqIAA2AgAgACABNgIYCwJAIAVBEE8EQCADIAZBA3I2AgQgAyAGaiIEIAVBAXI2AgQgBCAFaiAFNgIAQeS4wQAoAgAiAAR
    AIABBA3YiAkEDdEHctcEAaiEAQey4wQAoAgAhBwJ/QdS1wQAoAgAiAUEBIAJBH3F0IgJxBEAgACgCCAwBC0HUtcEAIAEg
    AnI2AgAgAAshAiAAIAc2AgggAiAHNgIMIAcgADYCDCAHIAI2AggLQey4wQAgBDYCAEHkuMEAIAU2AgAMAQsgAyAFIAZqI
    gBBA3I2AgQgACADaiIAIAAoAgRBAXI2AgQLIANBCGoLtA8BA38jAEGAC2siAiQAIAJBCGoQSyACQcgBakE4EHIaIAJBAT
    YCgAIgAkGIAmpBOBByGiACQQE2AsACIAJByAJqQTgQchogAkEBNgKAAyACQYgDakE4EHIaIAJBATYCwAMgAkHIA2pBOBB
    yGiACQQE2AoAEIAJBiARqQQEQigEgAkHIBGpBOBByGiACQQE2AoAFIAJBiAVqQTgQchogAkEBNgLABSACQcgFaiABEIUB
    IAJBiAZqQTgQchogAkEBNgLABiACQcgGakE4EHIaIAJBATYCgAcgAkGIB2pBOBByGiACQQE2AsAHIAJByAdqQTgQchogA
    kEBNgKACCACQcgFahBYIQMgAkHICWpB4ITAABBfIAJBiApqIAJByAlqEIsBIAJByAFqIAJBiApqEKUBIAJByAlqQZiFwA
    AQXyACQYgKaiACQcgJahCLASACQYgCaiACQYgKahClASACQcgFahADIAJByAVqQQsQUiACQYgGaiACQcgFahClASACQYg
    GaiACQYgEahB4IAJBiAZqEEQgAkGIBmogAkHIBWoQSCACQYgFaiACQcgBahClASACQYgFaiACQYgGahBIIAJBiAZqIAJB
    iARqEHggAkGIBmoQRCACQYgGaiACQYgCahBIIAJBiAZqEEEgAkGIBmoQRCACQYgDaiACQYgGahClASACQcgDaiACQcgFa
    hClASACQcgDaiACQYgDahBIIAJByAdqIAJBiANqEKUBIAJByAdqEAMgAkHIBmogAkGIBWoQpQEgAkHIBmoQAyACQYgGai
    ACQcgBahClASACQYgGaiACQcgGahBIIAJByAdqIAJBiAZqEHggAkHIB2oQRCACQcgHaiACQYgDahBIIAJByAZqIAJBiAV
    qEEggAkGIBmogAkGIAmoQpQEgAkGIBmogAkHIBmoQSCACQcgHaiACQYgGahB4IAJByAdqEEQgAkGIBmogAkHIB2oQpQEg
    AkGIBmogAkGIBWoQSCACQYgGaiACQYgHahBcIQQgAkGIBWogAkGIBmoQpQEgAkGIBWogAkGIB2oQNCACQYgFaiACQcgHa
    hBIIAJBiANqIAJBiAVqEEggAkHIA2ogAkGIBWoQSCACQcgFaiABEEggAkHIBmogAkGIBWoQpQEgAkHIBmoQAyACQYgFai
    ACQcgGahClASACQYgFaiACQcgFahBIIAJByAVqIAJBiAZqEKUBIAJByAVqQQsQUiACQcgJakHQhcAAEF8gAkGICmogAkH
    ICWoQiwEgAkHIAmogAkGICmoQpQEgAkHIAmogAkGIB2oQSCACQYgDaiACQcgDakEBIARrIgEQeSACQcgGaiACQYgFaiAB
    EHkgAkGIBmogAkHIBWogARB5IAJBiAdqIAJByAJqIAEQeSACQYgKaiACQYgGaiACQYgHahAjIAJByARqIAJBiApqEKUBI
    AJByARqIAJByAZqEEggAkHIBGoQWCEBIAJBiAZqIAJByARqEKUBIAJBiAZqEEEgAkGIBmoQRCACQcgEaiACQYgGaiABIA
    NzEHkgAkGICmpBiIbAABBfIAJBiAhqIAJBiApqEIsBQTghAQNAIAFBoAVGRQRAIAJBiAhqIAJBiANqEEggAkHICWogAUG
    IhsAAahBfIAFBOGohASACQYgKaiACQcgJahCLASACQYgGaiACQYgKahClASACQYgIaiACQYgGahB4IAJBiAhqEEQMAQsL
    IAJByAhqIAJBiANqEIUBIAJByAlqQaiLwAAQXyACQYgKaiACQcgJahCLASACQYgGaiACQYgKahClASACQcgIaiACQYgGa
    hB4IAJByAhqEERBACEBA0AgAUH4A0ZFBEAgAkHICGogAkGIA2oQSCACQcgJaiABQeCLwABqEF8gAUE4aiEBIAJBiApqIA
    JByAlqEIsBIAJBiAZqIAJBiApqEKUBIAJByAhqIAJBiAZqEHggAkHICGoQRAwBCwsgAkGICmpB2I/AABBfIAJBiAlqIAJ
    BiApqEIsBQQAhAQNAIAFByAZGBEACQCACQcgJaiACQYgDahCFASACQcgKakHYlsAAEF8gAkGICmogAkHICmoQiwEgAkGI
    BmogAkGICmoQpQEgAkHICWogAkGIBmoQeCACQcgJahBEQQAhAQNAIAFBkAZGDQEgAkHICWogAkGIA2oQSCACQcgKaiABQ
    ZCXwABqEF8gAUE4aiEBIAJBiApqIAJByApqEIsBIAJBiAZqIAJBiApqEKUBIAJByAlqIAJBiAZqEHggAkHICWoQRAwACw
    ALBSACQYgJaiACQYgDahBIIAJByAlqIAFBkJDAAGoQXyABQThqIQEgAkGICmogAkHICWoQiwEgAkGIBmogAkGICmoQpQE
    gAkGICWogAkGIBmoQeCACQYgJahBEDAELCyACQYgJaiACQcgEahBIIAJBiAZqIAJBiAhqEKUBIAJBiAZqIAJByAlqEEgg
    AkEIaiACQYgGahClASACQYgGaiACQYgJahClASACQYgGaiACQcgIahBIIAJByABqIAJBiAZqEKUBIAJBiAZqIAJByAhqE
    KUBIAJBiAZqIAJByAlqEEggAkGIAWogAkGIBmoQpQEgACACQQhqQcABEGcaIAJBgAtqJAALzQ0CE38IfiMAQYADayIBJA
    AgADQCOCIUIBR+QoCAgBBaBEAgABASCyABQeABakHoABByGiABQcgBaiAAKQMAIhggGEI/hyIZIBggGRAxIAEgASkDyAE
    iFEL//////////wODNwPYASABQdABaikDACIXQgaGIBRCOoiEIRUgF0I6iCEaIABBCGoiCyEFIAAhBkEBIQcDQCAHQQZP
    BEAgAEEYaiEMIABBKGohCyAAQRBqIQcgACkDMCEYQQQhBkEAIQkgAUGgAWohDUEDIQpBAiEIQQchBQJAAkADQCAFQQpLD
    QIgBiAIIAYgCEsbIQ4gBiAKIAYgCksbQQN0QWhqIQ8gAUGYAWogBUEDdCIQIABqQVBqKQMAIhQgFEI/hyAYIBhCP4ciGR
    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
    OBByGiACQQE2AvgMIAJBgA1qQTgQchogAkG4DWpBATYCACACQYAIakE4EHIaIAJBATYCuAggAkHACGpBOBByGiACQfgIa
    kEBNgIAIAJBgApqIABBgANqIgMQXiACQYAIaiACQYAKahCQASACQYAKaiABQYADaiIFEF4gAkGACGogAkGACmoQDyACQc
    AMahCpASAERQRAIAJBgApqIAMQXiACQcAMaiACQYAKahCQASACQYAKaiABQYACahBeIAJBwAxqIAJBgApqEA8LIAAoAoA
    GQQRHBEAgAkGACmogAEGAAmoQXiACQcAMaiACQYAKahCQASACQYAKaiAFEF4gAkHADGogAkGACmoQDwsgAkGABGogAkHA
    DGogAkGACGoQoQEgAkGABGoQZgsgAkGACGogABCOASACQYAKaiABEI4BIAJBgAhqIABBgAJqIgQQlgEgAkGACGoQrAEgA
    kGACmogAUGAAmoiBRCWASACQYAKahCsASACQYACaiACQYAIahCSASACQYACaiACQYAKahAZIAJBgAhqIAQQkgEgAkGACG
    ogAEGABGoiAxCWASACQYAIahCsASACQYAKaiAFEJIBIAJBgApqIAFBgARqIgUQlgEgAkGACmoQrAEgAkGABmogAkGACGo
    QkgEgAkGABmogAkGACmoQGSACQYAIaiACEJIBIAJBgAhqECsgAkGACmogAkGABGoQkgEgAkGACmoQKyACQYACaiACQYAI
    ahCWASAEIAJBgAJqEJIBIAQgAkGACmoQlgEgAkGABmogAkGACmoQlgEgAkGABGogAkGACGoQlgEgAkGACGogABCSASACQ
    YAIaiADEJYBIAJBgAhqEKwBIAJBgApqIAEQkgEgAkGACmogBRCWASACQYAKahCsASACQYAIaiACQYAKahAZIAJBgARqIA
    JBgAhqEJYBIAJBgAhqIAMQkgEgAkGACGogBRAZIAJBgApqIAJBgAhqEJIBIAJBgApqECsgAyACQYAEahCSASADIAJBgAp
    qEJYBIAJBgAZqIAJBgApqEJYBIAJBgAhqEGYgBCACQYAIahCWAQwDCyAAIAEQBgwECyACQcAMaiABQYAFahBeIAJBgAxq
    IAJBwAxqQcAAEGcaIAJBgAZqIAJBgAxqEKMBCyACQYAGahBmIAJBgAhqIAIQkgEgAkGACGoQKyACQYACaiACQYAIahCWA
    SAFIAJBgAJqEJIBIAJBgARqIAJBgAhqEJIBIAJBgAhqIAAQkgEgAkGACGogAxCWASACQYAIahCsASACQYAKaiABEJIBIA
    JBgApqIAFBgARqEJYBIAJBgApqEKwBIAJBgAhqIAJBgApqEBkgAkGABGogAkGACGoQlgEgAkGACGogAxCSAQJAIARBAkc
    EQCACQcAMaiABQYAFahBeIAJBgAhqIAJBwAxqEKIBDAELIAJBwAxqIAFBgAVqEF4gAkGADGogAkHADGpBwAAQZxogAkGA
    CGogAkGADGoQowELIAJBgAhqEGYgAkGACmogAkGACGoQkgEgAkGACmoQKyADIAJBgARqEJIBIAMgAkGACmoQlgEgAkGAB
    mogAkGACmoQlgEgAkGACGoQZiAFIAJBgAhqEJYBCyACQYAGahCsASACQYAGahBmIAAgAhCSASAAIAJBgAZqEJYBIABBBT
    YCgAYgABCZAQwBCyAAIAEQbAsgAkHADWokAAuaCQIPfwt+IwBBwAJrIgIkACACQeAAakGgp8AAEF8gAEE4EHIhDCACQZg
    BakHwABByGiACQZACakEwEHIaIAwQdCACIAEpAwAiFEL9//P/z///+QF+Qv//////////A4MiETcDiAIgAkHQAGogEUIA
    IAIpA2AiGCAYQj+HIhoQMSAUIAIpA1AiEXwiFiARVK0gAkHYAGopAwAgFEI/h3x8IhRCOocgASkDCCIRQj+HfCARIBRCB
    oYgFkI6iIQiEXwiEiARVK18IRNBASEDAkADQAJAIANBB0YEQCACQZACaiEJIAJB6ABqIQpBByEEIAJB4ABqIQ0gAkGIAm
    ohDkEGIQ8MAQsgA0EBdiIAQQFqIQUgCiAAayEGIAkgAEEDdCIHayEAIAdBCGohCCACQUBrIANBA3QiBCACQeAAamopAwA
    iFiAWQj+HIhQgAikDiAIiESARQj+HEDEgAkHIAGopAwAgEiAVfCIRIBJUrSATIBd8fHwgESACKQNAfCITIBFUrXwhEiAD
    QQFqIQcDQCADIAVNBEAgAkGIAmogBGogE0L9//P/z///+QF+Qv//////////A4MiETcDACACQTBqIBFCACAYIBoQMSACQ
    SBqIBFCACAWIBQQMSACQZgBaiADQQR0aiIAIAJBKGopAwAiGzcDCCAAIAIpAyAiGTcDACACKQMwIhEgE3wiFiARVK0gAk
    E4aikDACASfHwiFEI6hyABIAdBA3RqKQMAIhFCP4d8IBEgFEIGhiAWQjqIhCIRfCISIBFUrXwhEyAVIBl8IhUgGVStIBc
    gG3x8IRcgCUEIaiEJIApBAWohCiAHIQMMAwsgBkEGSw0DIAJBEGogAkHgAGogCGopAwAgAkHgAGogAGopAwB9IhEgEUI/
    hyACQYgCaiAAaikDACACQYgCaiAIaikDAH0iESARQj+HEDEgAikDECIRIBN8IhMgEVStIAJBGGopAwAgEnx8IRIgBUEBa
    iEFIABBeGohACAGQX9qIQYgCEEIaiEIDAALAAsLA0ACQCAEQQ1HBEAgDyAEQQF2IgBrIQUgDiAAQQN0IgtrIRAgDSALay
    EIIBMgF3wgEiAVfCITIBJUrXwhEiAEQQFqIQdBMCEAIAkhBiAKIQMDQCAAIAtGDQIgBUEGTQRAIAIgAyALaikDACAAIAh
    qKQMAfSIRIBFCP4cgACAQaikDACAGIAtqKQMAfSIRIBFCP4cQMSACKQMAIhEgE3wiEyARVK0gAkEIaikDACASfHwhEiAF
    QX9qIQUgBkEIaiEGIANBCGohAyAAQXhqIQAMAQsLIAVBB0HknsAAEDwACyAMIBJC//////////8DgzcDMCACQcACaiQAD
    wsgBEEDdCAMakFIaiATQv//////////A4M3AwAgEkI6hyABIAdBA3RqKQMAIhFCP4d8IBEgEkIGhiATQjqIhCIRfCISIB
    FUrXwhEyAXIARBBHQgAmpBOGoiAEEIaikDAH0gFSAAKQMAIhFUrX0hFyAOQQhqIQ4gDUEIaiENIA9BAWohDyAVIBF9IRU
    gByEEDAALAAsgBkEHQdSewAAQPAAL+QkBBH8jAEGACWsiAiQAIAJBgAhqIAAQXiACIAJBgAhqEF4gAkGACGogAEGAAWoi
    BBBeIAJBgAFqIAJBgAhqEF4gAkGACGogARBeIAIgAkGACGoQDyACQYAIaiABQYABaiIFEF4gAkGAAWogAkGACGoQDyAAK
    AKABiEDAkACQCABKAKABkECRwRAIANBAkYNASACQYAIaiAAQYAFahBeIAJBgAJqIAJBgAhqEF4gAkGACGogAUGABWoQXi
    ACQYACaiACQYAIahAPDAILIANBAkYEQCACQYAIaiAAQYAFahBeIAJBgAdqIAJBgAhqQcAAEGcaIAJBgAZqIAJBgAdqEIU
    BIAJBgAhqIAFBgAVqEF4gAkGAB2ogAkGACGpBwAAQZxogAkGABmogAkGAB2oQSCACQYAIakE4EHIaIAJBATYCuAggAkHA
    CGpBOBByIAJB+AhqQQE2AgAgAkGACGogAkGABmoQpQEQsgEgAkGAAmogAkGACGpBgAEQZxoMAgsgAkGACGogAEGABWoQX
    iACQYACaiACQYAIahBeIAJBgAhqIAFBgAVqEF4gAkGAB2ogAkGACGpBwAAQZxogAkGAAmogAkGAB2oQoAEMAQsgAkGACG
    ogAUGABWoQXiACQYACaiACQYAIahBeIAJBgAhqIABBgAVqEF4gAkGAB2ogAkGACGpBwAAQZxogAkGAAmogAkGAB2oQoAE
    LIAJBgAhqIAAQXiACQYADaiACQYAIahBeIAJBgAhqIAEQXiACQYAEaiACQYAIahBeIAJBgAhqIAQQXiACQYADaiACQYAI
    ahCVASACQYADahCoASACQYAIaiAFEF4gAkGABGogAkGACGoQlQEgAkGABGoQqAEgAkGABWogAkGAA2oQXiACQYAFaiACQ
    YAEahAPIAJBgAZqIAIQXiACQYAGaiACQYABahCVASACQYAGahA6IAJBgAVqIAJBgAZqEJUBIAJBgAhqIAAQXiACQYADai
    ACQYAIahCQASACQYAIaiAAQYAFaiIDEF4gAkGAA2ogAkGACGoQlQEgAkGAA2oQqAEgAkGACGogARBeIAJBgARqIAJBgAh
    qEJABIAJBgAhqIAFBgAVqIgEQXiACQYAEaiACQYAIahCVASACQYAEahCoASACQYAHaiACQYADahBeIAJBgAdqIAJBgARq
    EA8gAkGABmogAhCQASACQYAGaiACQYACahCVASACQYAGahA6IAJBgAdqIAJBgAZqEJUBIAJBgAhqIAQQXiACQYADaiACQ
    YAIahCQASACQYAIaiADEF4gAkGAA2ogAkGACGoQlQEgAkGAA2oQqAEgAkGACGogBRBeIAJBgARqIAJBgAhqEJABIAJBgA
    hqIAEQXiACQYAEaiACQYAIahCVASACQYAEahCoASACQYAIaiACQYADahBeIAJBgAhqIAJBgARqEA8gAkGABmogAkGAAWo
    QkAEgAkGABmogAkGAAmoQlQEgAkGABmoQOiACQYAIaiACQYAGahCVASACQYABahBVIAIgAkGAAWoQlQEgACACIAJBgAVq
    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
    GogAkGABWoQfSACQYAEahCoASACQYAFaiAAEJABIAJBgAVqIAQQlQEgAkGABWoQqAEgAkGABmogARBeIAJBgAZqIAYQlQ
    EgAkGABmoQqAEgAkGABWogAkGABmoQDyACQYAGaiACEJABIAJBgAZqIAJBgAJqEJUBIAJBgAZqIAJBgAVqELUBIAJBgAZ
    qEKgBIAJBgAVqIAIQkAEgAkGABWogAhCVASACIAJBgAVqEJUBIAIQqAEgAkGAAmpBDBCfASACQYACahBVIAJBgAJqEKgB
    IAJBgAdqIAJBgAFqEF4gAkGAB2ogAkGAAmoQlQEgAkGAB2oQqAEgAkGAAWogAkGAAmoQfSACQYABahCoASACQYAGakEME
    J8BIAJBgAZqEFUgAkGABmoQqAEgAkGABWogAkGABmoQkAEgAkGABWogAkGABGoQDyACQYACaiACQYADahCQASACQYACai
    ACQYABahAPIAJBgAVqIAJBgAJqELUBIAJBgAZqIAIQDyACQYABaiACQYAHahAPIAJBgAZqIAJBgAFqEJUBIAIgAkGAA2o
    QDyACQYAHaiACQYAEahAPIAJBgAdqIAIQlQEgACACQYAFahCQASAAEKgBIAMgAkGABmoQkAEgAxCoASAEIAJBgAdqEJAB
    IAQQqAEgAkGACGokAAv2BQEFfyMAQYAEayICJAAgAiAAEIUBIAIgARBIIAJBQGsgAEFAayIDEIUBIAJBQGsgAUFAayIFE
    EggAkGAAWogAEGAAWoiBBCFASACQYABaiABQYABaiIGEEggAkHAAWogABCFASACQcABaiADEHggAkHAAWoQRCACQYACai
    ABEIUBIAJBgAJqIAUQeCACQYACahBEIAJBwAFqIAJBgAJqEEggAkGAAmogAhClASACQYACaiACQUBrEHggAkHAAWogAkG
    AAmoQgAEgAkHAAWoQRCACQYACaiADEKUBIAJBgAJqIAQQeCACQYACahBEIAJBwAJqIAUQhQEgAkHAAmogBhB4IAJBwAJq
    EEQgAkGAAmogAkHAAmoQSCACQcACaiACQUBrEKUBIAJBwAJqIAJBgAFqEHggAkGAAmogAkHAAmoQgAEgAkGAAmoQRCACQ
    cACaiAAEKUBIAJBwAJqIAQQeCACQcACahBEIAJBgANqIAEQhQEgAkGAA2ogBhB4IAJBgANqEEQgAkHAAmogAkGAA2oQSC
    ACQYADaiACEKUBIAJBgANqIAJBgAFqEHggAkGAA2ogAkHAAmoQswEgAkGAA2oQRCACQcACaiACEKUBIAJBwAJqIAIQeCA
    CIAJBwAJqEHggAhBEIAJBgAFqQQwQUiACQcADaiACQUBrEIUBIAJBwANqIAJBgAFqEHggAkHAA2oQRCACQUBrIAJBgAFq
    EIABIAJBQGsQRCACQYADakEMEFIgAkHAAmogAkGAA2oQpQEgAkHAAmogAkGAAmoQSCACQYABaiACQcABahClASACQYABa
    iACQUBrEEggAkHAAmogAkGAAWoQswEgAkGAA2ogAhBIIAJBQGsgAkHAA2oQSCACQYADaiACQUBrEHggAiACQcABahBIIA
    JBwANqIAJBgAJqEEggAkHAA2ogAhB4IAAgAkHAAmoQpQEgABBEIAMgAkGAA2oQpQEgAxBEIAQgAkHAA2oQpQEgBBBEIAJ
    BgARqJAALxQUBBH8jAEHwEmsiACQAIAAQOEF/IQEgABCIAUUEQCAAQYADakE4EHIaIABBuANqQTgQchogAEG4A2ogAEGA
    A2oQVCAAQfAKakG4gMAAEF8gAEHwDWpB8IDAABBfIABB8ANqIABB8ApqIABB8A1qEEkgAEHwBGpBOBByGiAAQQE2AqgFI
    ABBsAVqQTgQchogAEHoBWpBATYCACAAQfAFakE4EHIaIABBATYCqAYgAEGwBmpBOBByGiAAQegGakEBNgIAIABB8AZqQT
    gQchogAEEBNgKoByAAQbAHakE4EHIaIABB6AdqQQE2AgBBf2ohAyAAQfAHahAqIABB8AdqIAAQfiAAQfAKahAqIABB8Ap
    qIABB8AdqEH4gAEHwDWoQKiAAQfANaiAAQfAHahB+IABB8A1qEJwBAkACQAJAA0AgAiEBIANBAkkNAyAAQfAKaiAAQfAE
    aiAAQfAFaiAAQfAGahAlIAFBxABNBEAgAEHwEGogAEHwBGogAEHwBWogAEHwBmoQRiABQQh0QdCrwABqIABB8BBqEJIBI
    AFBAWohAgJAAkAgAEG4A2ogA0F/aiIDEFcgAEGAA2ogAxBXa0EBag4DAQMAAwsgAEHwCmogAEHwB2ogAEHwBGogAEHwBW
    ogAEHwBmoQHiABQcMASw0DIABB8BBqIABB8ARqIABB8AVqIABB8AZqEEYgAkEIdEHQq8AAaiAAQfAQahCSASABQQJqIQI
    MAgsgAEHwCmogAEHwDWogAEHwBGogAEHwBWogAEHwBmoQHiABQcMASw0DIABB8BBqIABB8ARqIABB8AVqIABB8AZqEEYg
    AkEIdEHQq8AAaiAAQfAQahCSASABQQJqIQIMAQsLIAFBxQBBvIHAABA8AAtBxQBBxQBBzIHAABA8AAtBxQBBxQBB3IHAA
    BA8AAtBACEBCyAAQfASaiQAIAEL8gQBBH8jAEGADGsiAiQAIAIgABCOASACQYACahAvIAJBgARqIABBgAJqIgMQjgEgAk
    GABmoQLyACQYAIaiAAEI4BIAJBgApqIAEQjgEgAiABEBkgAkGABGogAUGAAmoiBBAZIAJBgAhqIAMQlgEgAkGACmogBBC
    WASACQYAIahCsASACQYAKahCsASACQYACaiACQYAIahCSASACQYACaiACQYAKahAZIAJBgAhqIAMQkgEgAkGACGogAEGA
    BGoiBRCWASACQYAKaiAEEJIBIAJBgApqIAFBgARqIgQQlgEgAkGACGoQrAEgAkGACmoQrAEgAkGABmogAkGACGoQkgEgA
    kGABmogAkGACmoQGSACQYAIaiACEJIBIAJBgAhqECsgAkGACmogAkGABGoQkgEgAkGACmoQKyACQYACaiACQYAIahCWAS
    ADIAJBgAJqEJIBIAMgAkGACmoQlgEgAkGABmogAkGACmoQlgEgAkGABGogAkGACGoQlgEgAkGACGogABCSASACQYAIaiA
    FEJYBIAJBgAhqEKwBIAJBgApqIAEQkgEgAkGACmogBBCWASACQYAKahCsASACQYAIaiACQYAKahAZIAJBgARqIAJBgAhq
    EJYBIAJBgAhqIAUQkgEgAkGACGogBBAZIAJBgApqIAJBgAhqEJIBIAJBgApqECsgBSACQYAEahCSASAFIAJBgApqEJYBI
    AJBgAZqIAJBgApqEJYBIAJBgAhqEGYgAyACQYAIahCWASACQYAGahCsASACQYAGahBmIAAgAhCSASAAIAJBgAZqEJYBIA
    BBBTYCgAYgABCZASACQYAMaiQAC68EAQV/IwBBkAZrIgIkACAAQUBrIQQCQCABQfgAaigCACABKAI4aqwgAEH4AGooAgA
    iAyAAKAI4IgVqrH5CgICAEFMNACAFQQJOBH8gABASIAAoAngFIAMLQQJIDQAgBBASCyACQaCnwAAQX0EAIQMgAkE4akHw
    ABByGiABQUBrIQUDQCADQThGBEAgAkHwAGohBkEAIQMDQCADQThGRQRAIAMgBmogAiADaikDADcDACADQQhqIQMMAQsLI
    AJBqAFqIAAQXyACQeABaiABEF8gAkGYAmogACABEAggAkGIA2ogBCAFEAggAkGoAWogBBBhIAJBqAFqEEQgAkHgAWogBR
    BhIAJB4AFqEEQgAkH4A2ogAkGoAWogAkHgAWoQCEEAIQMgAkHoBGpB8AAQchoDQCADQfAARkUEQCACQegEaiADaiACQZg
    CaiADaikDADcDACADQQhqIQMMAQsLIAJB6ARqIAJBiANqEGVBACEDA0AgA0HwAEZFBEAgAkGIA2ogA2oiASACQThqIANq
    KQMAIAEpAwB9NwMAIANBCGohAwwBCwsgAkGYAmogAkGIA2oQZSACQZgCahBFIAJB+ANqIAJB6ARqEGQgAkH4A2oQRSACQ
    dgFaiACQZgCahAFIAAgAkHYBWoQayAAQQM2AjggAkHYBWogAkH4A2oQBSAEIAJB2AVqEGsgAEECNgJ4IAJBkAZqJAAFIA
    JBOGogA2pCADcDACADQQhqIQMMAQsLC5QEAQF/IwBB0CJrIgMkACADQcAWakG4gMAAEF8gA0HIHGpB8IDAABBfIANBCGo
    gA0HAFmogA0HIHGoQSSADQYgBakE4EHIaIANBwAFqQTgQchogA0H4AWoQKgJAIAIQhAFFBEAgA0H4BGoQKiADQfgEaiAB
    EH4gA0H4BGoQSiADQfgHahBLIANB+AdqIAIQfyADQfgHahBHIANByBxqIANB+AdqEIUBIANBuAlqIANByBxqEIUBIANBy
    BxqIANBuAhqEIUBIANB+AlqIANByBxqEIUBIANBuApqECogA0G4DWoQYCADQbgKaiADQfgEahB+IANBwBNqECogA0HAE2
    ogA0H4BGoQfiADQcATahCcASADQcABaiADQYgBahBUQX9qIQIDQCACQQFNBEAgA0G4DWoQkwEgACADQbgNakGIBhBnGgw
    DBSADQbgNahAbIANBwBZqIANBuApqIANBuAlqIANB+AlqEBcCQAJAAkAgA0HAAWogAkF/aiICEFcgA0GIAWogAhBXa0EB
    ag4DAQIAAgsgA0HIHGogA0G4CmogA0H4BGogA0G4CWogA0H4CWoQFiADQcAWaiADQcgcahAGDAELIANByBxqIANBuApqI
    ANBwBNqIANBuAlqIANB+AlqEBYgA0HAFmogA0HIHGoQBgsgA0G4DWogA0HAFmoQBAwBCwALAAsgABBgCyADQdAiaiQAC8
    MDARV/A0AgAUHAAUYEQAJAIABBKGohCyAAQRRqKAIAIgwhCCAAQRBqKAIAIg0hAyAAQQxqKAIAIg4hAiAAKAIIIg8hASA
    AQRhqKAIAIhAhCiAAQRxqKAIAIhEhBCAAQSBqKAIAIhIhByAAQSRqKAIAIhMhBgNAIAchCSAEIQcgCiEEIAVBgAJGDQEg
    AiADcSEUIAIgA3MhFSAFIAtqKAIAIAVB9J7AAGooAgAgBEEadyAEQRV3cyAEQQd3cyAGaiAJIARBf3NxIAQgB3FyampqI
    gYgCGohCiAFQQRqIQUgAyEIIAIhAyABIQIgAUEedyABQRN3cyABQQp3cyAUIAEgFXFzaiAGaiEBIAkhBgwACwALBSAAIA
    FqIgNB6ABqIANBzABqKAIAIANBKGooAgAgA0EsaigCACICQRl3IAJBDndzIAJBA3ZzIANB4ABqKAIAIgJBD3cgAkENd3M
    gAkEKdnNqamo2AgAgAUEEaiEBDAELCyAAIAYgE2o2AiQgACAJIBJqNgIgIAAgByARajYCHCAAIAQgEGo2AhggACAIIAxq
    NgIUIAAgAyANajYCECAAIAIgDmo2AgwgACABIA9qNgIIC9YDAgZ/An4jAEHwAGsiASQAIAFBoKfAABBfIAFBOGogARBfI
    AAQRAJAAkACQCABAn8gACgCOCICQRBMBEAgAkF/ahA5DAELIAEpAzAiCEIBfCIHIAhUDQEgACkDMCIIQoCAgICAgICAgH
    9RQQAgB0J/URsNAiABQThqIAggB3+nECghByABIAEpA2ggB0I6hnw3A2ggACABQThqEGIgABBEQQILIgMQLSAAQQhqIQQ
    DQCADRQ0DIAEgASkDCEI5hkKAgICAgICAgAKDIAEpAwBCAYeEIgc3AwAgASAAKQMAIAd9IgdC//////////8DgzcDOEEA
    IQIDQCAHQjqHIQcgAkEoRkUEQCABIAJqIgVBCGoiBiAFQRBqKQMAQjmGQoCAgICAgICAAoMgBikDAEIBh4QiCDcDACABI
    AJqQUBrIAIgBGopAwAgCH0gB3wiB0L//////////wODNwMAIAJBCGohAgwBCwsgASABKQMwQgGHIgg3AzAgASAAKQMwIA
    h9IAd8Igc3A2ggACABQThqIAdCP4enQQFqEE8gA0F/aiEDDAALAAtBoKLAAEEZQbyiwAAQWwALQdCiwABBH0G8osAAEFs
    ACyAAQQE2AjggAUHwAGokAAuhAwEBfyMAQZADayIGJAAgBkEIakHAABByGiAGQcgAakGoAhByGiAGQcgAahBDA0AgAQRA
    IAZByABqQQAQPiABQX9qIQEMAQUCQCACBEAgBkHIAGogAiADEHoLIAQEQCAGQcgAaiAEIAUQegsgBkGIA2pCADcDACAGQ
    YADakIANwMAIAZB+AJqQgA3AwAgBkIANwPwAiAGKAJIIQEgBigCTCECIAZByABqQYABED4DQCAGKAJIQf8DcUHAA0ZFBE
    AgBkHIAGpBABA+DAELCyAGQawBaiABNgIAIAZBqAFqIAI2AgAgBkHIAGoQEUEAIQJBACEBA0AgAUEgRkUEQCAGQfACaiA
    BaiABQXxxIAZqQdAAaigCACACQX9zQRhxdjoAACACQQhqIQIgAUEBaiEBDAELCyAGQcgAahBDQQAhAQNAIAFBIEZFBEAg
    BkEIaiABaiAGQfACaiABai0AADoAACABQQFqIQEMAQsLQQAhAQNAIAFBIEYNASAAIAFqIAZBCGogAWotAAA6AAAgAUEBa
    iEBDAALAAsLCyAGQZADaiQAC6EDAQN/IwBBgAZrIgEkACABIABBgAFqIgMQXiABQYABaiADEF4gAUGAAWoQMiABQYACai
    ABEF4gAUGAAmogAEGAAmoiAhAPIAFBgANqIAIQXiABQYADahAyIAIgAUGAAWoQkAEgAiABQYABahCVASACEKgBIAIQpwE
    gAhCnASACEKgBIAFBgANqQQwQnwEgAUGAA2oQVSABQYADahCoASABQYAEaiABQYADahBeIAFBgARqIAIQDyABQYAFaiAB
    QYABahBeIAFBgAVqIAFBgANqEJUBIAFBgAVqEKgBIAIgAUGAAmoQDyABQYACaiABQYADahCQASABQYACaiABQYADahCVA
    SABQYADaiABQYACahCVASABQYADahCoASABQYABaiABQYADahB9IAFBgAFqEKgBIAFBgAVqIAFBgAFqEA8gAUGABWogAU
    GABGoQlQEgAUGAAmogABCQASABQYACaiABEA8gACABQYABahCQASAAEKgBIAAgAUGAAmoQDyAAEKcBIAAQqAEgAyABQYA
    FahCQASADEKgBIAFBgAZqJAALhQMBBH8CQAJAIAFBgAJPBEAgAEEYaigCACEEAkACQCAAIAAoAgwiAkYEQCAAQRRBECAA
    QRRqIgIoAgAiAxtqKAIAIgENAUEAIQIMAgsgACgCCCIBIAI2AgwgAiABNgIIDAELIAIgAEEQaiADGyEDA0AgAyEFIAEiA
    kEUaiIDKAIAIgFFBEAgAkEQaiEDIAIoAhAhAQsgAQ0ACyAFQQA2AgALIARFDQIgACAAQRxqKAIAQQJ0QeS3wQBqIgEoAg
    BHBEAgBEEQQRQgBCgCECAARhtqIAI2AgAgAkUNAwwCCyABIAI2AgAgAg0BQdi1wQBB2LXBACgCAEF+IAAoAhx3cTYCAA8
    LIABBDGooAgAiAiAAQQhqKAIAIgBHBEAgACACNgIMIAIgADYCCA8LQdS1wQBB1LXBACgCAEF+IAFBA3Z3cTYCAAwBCyAC
    IAQ2AhggACgCECIBBEAgAiABNgIQIAEgAjYCGAsgAEEUaigCACIARQ0AIAJBFGogADYCACAAIAI2AhgLC7MCAQF/IwBBg
    AtrIgUkACAFEC8gBUGAAmoQLyAFQYAEahAvIAVBgAZqQTgQchogBUEBNgK4BiAFQcAGakE4EHIaIAVB+AZqQQE2AgAgBU
    GAB2pBOBByGiAFQQE2ArgHIAVBwAdqQTgQchogBUH4B2pBATYCACAFQYAIakE4EHIaIAVBATYCuAggBUHACGpBOBByGiA
    FQfgIakEBNgIAIAEgAiAFQYAGaiAFQYAHaiAFQYAIahAeIAVBgAhqIAMQoAEgBUGABmogBBCgASAFQYAJaiAFQYAGaiAF
    QYAHahCRASAFIAVBgAlqEJIBIAVBgAlqIAVBgAhqEJsBIAVBgARqIAVBgAlqEJIBIAVBgARqEGYgACAFIAVBgAJqIAVBg
    ARqEHYgAEEDNgKABiAFQYALaiQAC7ECAQF/IwBBgAtrIgQkACAEEC8gBEGAAmoQLyAEQYAEahAvIARBgAZqQTgQchogBE
    EBNgK4BiAEQcAGakE4EHIaIARB+AZqQQE2AgAgBEGAB2pBOBByGiAEQQE2ArgHIARBwAdqQTgQchogBEH4B2pBATYCACA
    EQYAIakE4EHIaIARBATYCuAggBEHACGpBOBByGiAEQfgIakEBNgIAIAEgBEGABmogBEGAB2ogBEGACGoQJSAEQYAIaiAC
    EKABIARBgAZqIAMQoAEgBEGACWogBEGABmogBEGAB2oQkQEgBCAEQYAJahCSASAEQYAJaiAEQYAIahCbASAEQYAEaiAEQ
    YAJahCSASAEQYAEahBmIAAgBCAEQYACaiAEQYAEahB2IABBAzYCgAYgBEGAC2okAAvJAgEDfyMAQcACayIBJAAgASAAQU
    BrIgMQhQEgARADIAFBQGsgAxCFASABQUBrIABBgAFqIgIQSCABQYABaiACEIUBIAFBgAFqEAMgAiABEKUBIAIgARB4IAI
    QRCACEE4gAhBOIAIQRCABQYABakEMEFIgAUHAAWogAUGAAWoQhQEgAUHAAWogAhBIIAFBgAJqIAEQhQEgAUGAAmogAUGA
    AWoQeCABQYACahBEIAIgAUFAaxBIIAFBQGsgAUGAAWoQpQEgAUFAayABQYABahB4IAFBgAFqIAFBQGsQeCABIAFBgAFqE
    IABIAEQRCABQYACaiABEEggAUGAAmogAUHAAWoQeCABQUBrIAAQpQEgAUFAayADEEggACABEKUBIAAQRCAAIAFBQGsQSC
    AAEE4gABBEIAMgAUGAAmoQpQEgAxBEIAFBwAJqJAALrQIBA38jAEGABGsiAiQAIAIgABBeIAJBgAFqIABBgAFqIgMQXiA
    CQYACakE4EHIaIAJBATYCuAIgAkHAAmpBOBByGiACQfgCakEBNgIAIAJBgANqIAMQXiACIAEQDyACQYABaiABQYABaiIE
    EA8gAkGAAmogBBCQASACQYACaiABEJUBIAJBgANqIAAQlQEgAkGAAmoQqAEgAkGAA2oQqAEgAkGAA2ogAkGAAmoQDyACQ
    YACaiACEJABIAJBgAJqEDogAkGAA2ogAkGAAmoQlQEgAkGAA2oQqAEgAkGAAmogAkGAAWoQkAEgAkGAAmoQOiADIAJBgA
    NqEJABIAMgAkGAAmoQlQEgAkGAAWoQVSAAIAJBgAFqEJABIAAgAhCVASAAEKwBIAJBgARqJAALvQIBA38jAEGACGsiASQ
    AIAEgABCOASABQYACaiAAQYAEaiICEI4BIAFBgARqIABBgAJqIgMQjgEgAUGABmoQLyAAECIgAUGABmogABCSASABQYAG
    aiAAEJYBIAAgAUGABmoQlgEgABCsASABELYBIAEQrwEgACABEJYBIAFBgAJqECIgAUGAAmoQZiABQYAGaiABQYACahCSA
    SABQYAGaiABQYACahCWASABQYACaiABQYAGahCWASABQYACahCsASABQYAEahAiIAFBgAZqIAFBgARqEJIBIAFBgAZqIA
    FBgARqEJYBIAFBgARqIAFBgAZqEJYBIAFBgARqEKwBIAMQrgEgAxCvASACELYBIAIQrwEgAyABQYACahCWASACIAFBgAR
    qEJYBIABBBTYCgAYgABCaASABQYAIaiQAC7ICAQN/IwBBgAhrIgEkACAAKAKABkEBRwRAIAEgABCOASABQYACaiAAQYAC
    aiIDEI4BIAFBgARqIABBgARqIgIQjgEgAUGABmogABCOASABECIgAUGAAmogAhAZIAFBgAJqEK8BIAFBgAJqEKwBIAFBg
    ARqECIgAUGABmogAxAZIAFBgAZqEK8BIAIgABCWASACIAMQlgEgAhCsASACECIgACABEJIBIAEgAUGAAmoQlgEgARCsAS
    ABIAFBgARqEJYBIAEgAUGABmoQlgEgARCsASABECsgAUGAAmoQZiABQYAEahBmIAAgAUGAAmoQlgEgAyABQYAEahCSASA
    DIAFBgAZqEJYBIAIgARCWASAAQQRBBSAAKAKABkF+cUECRhs2AoAGIAAQmQELIAFBgAhqJAALigIBAn8jAEHgAWsiAiQA
    IAAQRCACQQhqQTAQchogAkIBNwMAIAJBOGogABBfIAJB8ABqIAEQXyACQagBakE4EHIaIAAQdANAIAJBOGogAkHwAGoQN
    UF/TARAA0ACQCADQQBMDQAgAkHwAGpBARA7IAJBARA7IAJBqAFqIAJBOGoQayACQagBaiACQfAAahBiIAJBqAFqEEQgAk
    E4aiACQagBaiACKQPYAUI/h6dBAWoiARBPIAJBqAFqIAAQayACQagBaiACEGEgAkGoAWoQRCAAIAJBqAFqIAEQTyADQX9
    qIQMMAQsLBSACQQEQLSACQfAAakEBEC0gA0EBaiEDDAELCyACQeABaiQAC54CAQF/IwBBgA1rIgMkACADIAEQaiADEJkB
    IANBiAZqIAIQXyADQYgGahBEIANBwAZqIANBiAZqEF8gA0HABmpBAxAoGiADQcAGahBEIANB+AZqIAMQagJAIANBwAZqE
    FpFBEAgA0HABmoQKUF/aiECA0AgAkEBTQRAIANB+AZqEJoBDAMLIANB+AZqEBoCQAJAIANBwAZqIAJBf2oiAhBXIANBiA
    ZqIAIQV2tBAWoOAwECAAILIANB+AZqIAMQDgwBCyADEJMBIANB+AZqIAMQDiADEJMBDAALAAsgA0H4BmoQsAEgA0H4B2o
    QqQEgA0H4CGoQrQEgA0H4CmoQrQEgA0EBNgL4DAsgACADQfgGakGIBhBnGiADQYANaiQAC5ACAQJ/IwBBgAJrIgUkACAF
    QYABaiAAEF4gAiAFQYABahCQASAFQYABaiAAQYABahBeIAQgBUGAAWoQkAEgBUGAAWogAEGAAmoiBhBeIAUgBUGAAWoQX
    iAFQYABaiAGEF4gAyAFQYABahCQASAFQYABaiABQYABaiIGEF4gBSAFQYABahAPIAVBgAFqIAEQXiADIAVBgAFqEA8gAi
    ADEH0gAhCoASAEIAUQfSAEEKgBIAUgAhCQASACEFUgAhCoASAFQYABaiAGEF4gBSAFQYABahAPIAMgBBCQASAFQYABaiA
    BEF4gAyAFQYABahAPIAMgBRB9IAMQqAEgBBA6IAQQqAEgACABEAsgBUGAAmokAAvkAQECfyMAQcABayIDJAAgAxBLIAAg
    ASACQR91IgQgAnMgBEF/c2pBAm0iAkF/akEfdhBtIAAgAUHAAWogAkEBc0F/akEfdhBtIAAgAUGAA2ogAkECc0F/akEfd
    hBtIAAgAUHABGogAkEDc0F/akEfdhBtIAAgAUGABmogAkEEc0F/akEfdhBtIAAgAUHAB2ogAkEFc0F/akEfdhBtIAAgAU
    GACWogAkEGc0F/akEfdhBtIAAgAUHACmogAkEHc0F/akEfdhBtIAMgABB/IAMQpgEgACADIARBAXEQbSADQcABaiQAC+Q
    BAQJ/IwBBgANrIgMkACADECogACABIAJBH3UiBCACcyAEQX9zakECbSICQX9qQR92EG8gACABQYADaiACQQFzQX9qQR92
    EG8gACABQYAGaiACQQJzQX9qQR92EG8gACABQYAJaiACQQNzQX9qQR92EG8gACABQYAMaiACQQRzQX9qQR92EG8gACABQ
    YAPaiACQQVzQX9qQR92EG8gACABQYASaiACQQZzQX9qQR92EG8gACABQYAVaiACQQdzQX9qQR92EG8gAyAAEH4gAxCcAS
    AAIAMgBEEBcRBvIANBgANqJAALvAEBAn8jAEGwAWsiAiQAIAJBMBByIQIDQCADQTBGBEACQCABQTBqIQEgAkEwaiACEHV
    BACEDA0AgA0EwRg0BIAIgA2ogASADai0AADoAACADQQFqIQMMAAsACwUgAiADaiABIANqLQAAOgAAIANBAWohAwwBCwsg
    AkHwAGogAhB1IABBOBByIgBBATYCOCAAQUBrQTgQciAAQfgAakEBNgIAIAAgAkHwAGoQpQEgAkEwahClASACQbABaiQAC
    9QBAQJ/IwBBgANrIgEkACABIAAQXiABQYABaiAAQYABaiICEF4gAUGAAmogABBeIAFBgAJqIAIQDyABIAIQlQEgAUGAAW
    oQVSABQYABaiAAEJUBIAEQqAEgAUGAAWoQqAEgACABEJABIAAgAUGAAWoQDyABQYABaiABQYACahCQASABQYABahBVIAF
    BgAFqIAFBgAJqEJUBIAFBgAFqEKgBIAFBgAFqEDogACABQYABahCVASABQYACahCnASACIAFBgAJqEJABIAAQrAEgAUGA
    A2okAAvEAQEBfyMAQYADayIDJAAgA0EIaiABEIUBAkAgAkUEQCADQQhqEAcMAQsgA0EIaiACEKUBCyADQcgAakHYo8AAE
    F8gA0GAAWogA0HIAGoQiwEgA0HAAWogA0EIahCFASADQcABahADIANBwAFqIAEQSCAAIAEQhQEgACADQQhqEEggA0GAAm
    ogA0HAAWoQhQEgABBYIQEgA0HAAmogABCFASADQcACahBBIANBwAJqEEQgACADQcACaiABEHkgA0GAA2okAAufAQEBfyM
    AQfAAayICJAAgAiABEF9BACEBIAJBOGpBOBByGiAAEEQCQCAAIAIQNUEASA0AA0AgAkEBEC0gAUEBaiEBIAAgAhA1QX9K
    DQALA0AgAUEATA0BIAJBARA7IAJBOGogABBrIAJBOGogAhBiIAJBOGoQRCAAIAJBOGogAikDaEI/h6dBAWoQTyABQX9qI
    QEMAAsACyACQfAAaiQAC7IBAQF/IwBBgAJrIgQkACAEQYABaiAAEF4gAyAEQYABahCQASAEQYABaiAAQYABahBeIAQgBE
    GAAWoQXiAEQYABaiAAQYACahBeIAIgBEGAAWoQkAEgASAEEJABIAEgAhAPIAMQMiAEEDIgAhAyIAEQpwEgARA6IAEQqAE
    gARBVIAEQqAEgAkEMEJ8BIANBAxCfASACEFUgAhCoASACIAQQfSACEKgBIAAQFCAEQYACaiQAC58BAQJ/IwBBgAJrIgIk
    ACAAIAEQXiAAEDIgAkGIAWpB2KTAABBfIAJBCGpBOBByGiACQQE2AkAgAkHIAGpBOBByIAJBgAFqQQE2AgAgAkHAAWogA
    kGIAWoQiwEgAkEIaiACQcABahClARCyASACQQhqEKgBIAJBCGoQVSACQQhqEKgBIAAgARAPIAAgAkEIahCVASAAEKsBIA
    JBgAJqJAALowEBAX8jAEEwayIGJAAgBkEQaiAAIAEQsQEgBiAGKAIUIgA2AhwgBiAGKAIQIgE2AhggBkEIaiACIAMQsQE
    gBiAGKAIMIgI2AiQgBiAGKAIIIgM2AiAgBiAEIAUQsQEgBiAGKAIEIgQ2AiwgBiAGKAIAIgU2AiggASAAIAMgAiAFIAQQ
    ACAGQShqEKQBIAZBIGoQpAEgBkEYahCkASAGQTBqJAALiAECA38DfiMAQRBrIgIkAAN+IANBOEYEfiACQRBqJAAgBgUgA
    iAAIANqIgQpAwAiBSAFQj+HIAGsIgUgBUI/hxAxIAQgAikDACIHIAZ8IgVC//////////8DgzcDACAFIAdUrSACQQhqKQ
    MAIAZCP4d8fEIGhiAFQjqIhCEGIANBCGohAwwBCwsLhAECA38BfiMAQUBqIgEkACABQQhqIAAQXyABQQhqEEQgAUE4aiE
    CQQYhA0HcAiEAAn8DQEEAIANBAEgNARogAikDACIEUARAIAJBeGohAiAAQUZqIQAgA0F/aiEDDAELCwN/IARQBH8gAAUg
    AEEBaiEAIARCAn8hBAwBCwsLIAFBQGskAAuHAQEBfyMAQcABayIBJAAgAEE4EHIiAEEBNgI4IABBQGtBOBByGiAAQfgAa
    kEBNgIAIAEQUCABQYgBakE4EHIaIABBgAFqIAFBgAEQZxogAEGAAmpBOBByGiAAQbgCakEBNgIAIABBvAJqIAFBhAFqQT
    wQZxogAEH4AmpBATYCACABQcABaiQAC48BAQJ/IwBBgAJrIgEkACAAEKwBIAEgABBeIAFBgAFqQTgQchogAUEBNgK4ASA
    BQcABakE4EHIaIAFB+AFqQQE2AgAgASAAQYABaiICEJUBIAEQOiABQYABaiABEJABIAFBgAFqIAIQlQEgAiABEJABIAIg
    ABCVASAAIAFBgAFqEJABIAAQrAEgAUGAAmokAAt9AgF/An4jAEGAAWsiASQAIAFBCGogABCFASABQQhqEBIgAUHIAGogA
    UEIahCDAUEIIQADQCAAQThGRQRAIAFByABqIABqKQMAIAKEIQIgAEEIaiEADAELCyABKQNIIQMgAUGAAWokACACQn98IA
    NCAYVCf3yDQjqIp0EBcQuJAQIBfwJ+IAAgACkDMCABQT9xrSIDhiAAKQMoQTogAWtBP3GtIgSHhDcDMCAAQShqIQFBBiE
    CA0AgAkEBTQRAIAAgACkDACADhkL//////////wODNwMABSABIAEpAwAgA4ZC//////////8DgyABQXhqIgEpAwAgBIeE
    NwMAIAJBf2ohAgwBCwsLiQECAX8CfiAAIAApA2BBOiABQTpwIgFrrSIEhyAAKQNoIAGtIgOGhDcDaCAAQeAAaiEBQQ0hA
    gNAIAJBAU0EQCAAIAApAwAgA4ZC//////////8DgzcDAAUgASABKQMAIAOGQv//////////A4MgAUF4aiIBKQMAIASHhD
    cDACACQX9qIQIMAQsLC3EBAX8jAEFAaiIBJAAgAEE4EHIiAEEBNgI4IABBQGtBOBByGiAAQfgAakEBNgIAIAFBCGpBOBB
    yGiAAQYABakE4EHIaIABBuAFqQQE2AgAgAEG8AWogAUEEakE8EGcaIABB+AFqQQE2AgAgAUFAayQAC4EBAgF/AX4gAEHw
    ABByIQADQCACQThGBEACQCAAIAEpAzAiA0I6hzcDOCAAIANC//////////8DgzcDMCAAQUBrIQBBACECA0AgAkEwRg0BI
    AAgAmpCADcDACACQQhqIQIMAAsACwUgACACaiABIAJqKQMANwMAIAJBCGohAgwBCwsLdQECfiAAIANCIIgiBSABQiCIIg
    Z+IAIgA358IAEgBH58IANC/////w+DIgIgAUL/////D4MiAX4iA0IgiCACIAZ+fCICQiCIfCABIAV+IAJC/////w+DfCI
    BQiCIfDcDCCAAIANC/////w+DIAFCIIaENwMAC3YBAn8jAEHAAWsiASQAIAEgABCFASABQUBrIAAQhQEgAUGAAWogAEFA
    ayICEIUBIAEgAhB4IAFBQGsgABB4IAFBQGsQRCACIAFBQGsQSCABQYABahBBIAAgAUGAAWoQeCABEEQgABBEIAAgARBII
    AFBwAFqJAALkwEBAn9B0LXBAEHQtcEAKAIAQQFqNgIAAkACQEGYucEAKAIAQQFGBEBBnLnBAEGcucEAKAIAQQFqIgA2Ag
    AgAEECSw0CQaC5wQAoAgAiAUF/Sg0BDAILQZi5wQBCgYCAgBA3AwBBoLnBACgCACIAQQBIDQFBoLnBACAANgIAAAtBoLn
    BACABNgIAIABBAUsNAAALAAtnAQJ/IwBBQGoiAiQAIAAQRCACIAAQhQECQCABRQRAIAAQBwwBCyAAIAEQpQELQQAhAQNA
    IAFBAUsgA3JFBEAgABADIAFBAEchAyABIAFFaiEBDAELCyAAIAIQSCAAEBIgAkFAayQAC18CAX8EfkIBIQNBMCECA38gA
    kF4RgR/IARCAYYgA3ynQX9qBSABIAJqKQMAIgUgACACaikDACIGfUI6hyADgyAEhCEEIAJBeGohAiAFIAaFQn98QjqHIA
    ODIQMMAQsLC2ACAX8EfkIBIQNB6AAhAgN/IAJBeEYEfyAEQgGGIAN8p0F/agUgASACaikDACIFIAAgAmopAwAiBn1COoc
    gA4MgBIQhBCACQXhqIQIgBSAGhUJ/fEI6hyADgyEDDAELCwt3AQN/IwBBgAJrIgIkACACIAEQXiACQYABaiABEF4gAhAy
    IAJBgAFqIAIQDyAAIAJBgAFqEJcBIABBgAJqIgMgAkGAAWoQlwEgAEGABGoiBCACQYABahCXASADIAEQogEgBCACEKIBI
    ABBBTYCgAYgAkGAAmokAAt6AQF/IwBB4ANrIgEkACABQYABakHApcAAEF8gAUG4AWpB+KXAABBfIAEgAUGAAWogAUG4AW
    oQSSABQfACakGwpsAAEF8gAUGoA2pB6KbAABBfIAFB8AFqIAFB8AJqIAFBqANqEEkgACABIAFB8AFqED8gAUHgA2okAAt
    nACAAQQF2IAByIgBBAnYgAHIiAEEEdiAAciIAQQh2IAByIgBBEHYgAHIiACAAQQF2QdWq1aoFcWsiAEECdkGz5syZA3Eg
    AEGz5syZA3FqIgBBBHYgAGpBj568+ABxQYGChAhsQRh2C2cBAn8jAEGAAWsiASQAIAEgABCFASABQUBrQTgQchogAUEBN
    gJ4IAEgAEFAayICEHggARBBIAFBQGsgARClASABQUBrIAIQeCACIAEQpQEgAiAAEHggACABQUBrEKUBIAFBgAFqJAALaA
    IBfwJ+IAFBP3GtIQNBOiABa0E/ca0hBEEAIQEDQCABQTBGBEAgACAAKQMwIAOHNwMwBSAAIAFqIgIgAkEIaikDACAEhkL
    //////////wODIAIpAwAgA4eENwMAIAFBCGohAQwBCwsLbAEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYC
    ACADQSxqQQI2AgAgA0ICNwIMIANBlKjAADYCCCADQQI2AiQgAyADQSBqNgIYIAMgAzYCKCADIANBBGo2AiAgA0EIaiACE
    HAAC2wBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakECNgIAIANCAjcCDCADQbCqwAA2AgggA0
    ECNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhBwAAtlAQJ/IAAgACgCACICQQhqIgM2AgAgACACQQN
    2QTxxakEoaiICIAFB/wFxIAIoAgBBCHRyNgIAAkACQCADRQRAIABBADYCACAAIAAoAgRBAWo2AgQMAQsgA0H/A3ENAQsg
    ABARCwtnAQF/IwBBgAJrIgMkACAAECogACABEJABIABBgAFqIgEgAhCQASAAQYACahCwASAAEKgBIAMgABAmIANBgAFqI
    AEQXiADQYABahAyIANBgAFqIAMQe0UEQCAAEJgBCyADQYACaiQAC18BAn8jAEGAAWsiASQAIAAQqAEgASAAEIUBIAFBQG
    sgAEFAayICEIUBIAEQAyABQUBrEAMgASABQUBrEHggAUEAEDQgACABEEggARBBIAEQRCACIAEQSCABQYABaiQAC10BAn8
    jAEFAaiIBJAAgAUEIakGgp8AAEF8gAUEIaiAAKAI4QX9qEDkiAhAtIAAgAUEIahBjIABBASACQQFqQR9xdCICNgI4IAJB
    gICAEE4EQCAAEBILIAFBQGskAAtfAgF/AX4jAEHwAGsiASQAIAFBoKfAABBfIAApAwAhAiABQThqIAAQXyAAQQEQOyABQ
    ThqIAEQYSABQThqEEQgAUE4akEBEDsgACABQThqIAJCAoGnEE8gAUHwAGokAAt7AQJ/IABBKGohAgNAIAFBgAJGBEAgAE
    LnzKfQ1tDrs7t/NwIIIABCADcCACAAQSBqQquzj/yRo7Pw2wA3AgAgAEEYakL/pLmIxZHagpt/NwIAIABBEGpC8ua746O
    n/aelfzcCAAUgASACakEANgIAIAFBBGohAQwBCwsLaQICfwF+IAAgACkDACIDQv//////////A4M3AwBBCCEBA0AgA0I6
    hyEDIAFBMEYEQCAAIAApAzAgA3w3AzAFIAAgAWoiAiACKQMAIAN8IgNC//////////8DgzcDACABQQhqIQEMAQsLC2oCA
    n8BfiAAIAApAwAiA0L//////////wODNwMAQQghAQNAIANCOochAyABQegARgRAIAAgACkDaCADfDcDaAUgACABaiICIA
    IpAwAgA3wiA0L//////////wODNwMAIAFBCGohAQwBCwsLWQEBfyMAQYADayIEJAAgBCADEF4gBBBAIARBgAFqIAEQXiA
    EQYACaiACEF4gBEGAAWogBBAPIARBgAJqIAQQDyAAIARBgAFqIARBgAJqEJEBIARBgANqJAALWQECfyMAQUBqIgEkAAJA
    IAAQhAENACABQQEQigEgAEGAAWoiAiABEFkNACACQQAQNCAAIAIQSCAAEBIgAEFAayIAIAIQSCAAEBIgAiABEKUBCyABQ
    UBrJAALVwEBfyMAQbABayICJAAgATQCOCAANAI4fkKAgIAQWQRAIAAQEgsgAkEIaiAAIAEQCCACQfgAaiACQQhqEAUgAC
    ACQfgAahBrIABBAjYCOCACQbABaiQAC08BAn8jAEFAaiIDJAAgAEE4EHIiAEEBNgI4IABBQGtBOBByIABB+ABqQQE2AgA
    gAyABEIsBIAAgAxClASADIAIQiwEgAxClASADQUBrJAALWQECfyMAQYABayIBJAACQCAAEIgBDQAgARBQIABBgAJqIgIg
    ARB7DQAgAhBAIAAgAhAPIAAQqwEgAEGAAWoiACACEA8gABCrASACIAEQkAELIAFBgAFqJAALSwEBfyMAQUBqIgEkACAAQ
    TgQciIAQQE2AjggAUEBEIoBIABBQGsgAUHAABBnGiAAQYABakE4EHIaIABBuAFqQQE2AgAgAUFAayQAC0sBAn8jAEHwAG
    siASQAIAAQd0UEQCABQaCnwAAQXyABQThqIAAQgwEgASABQThqEGIgARBEIAFBOGogARA1IQILIAFB8ABqJAAgAgtPAQF
    /IwBBgAFrIgIkACAAIAEQhQEgABADIAJByABqQdikwAAQXyACQQhqIAJByABqEIsBIAAgARBIIAAgAkEIahB4IAAQEiAC
    QYABaiQAC0kBAn8DQCABQThGRQRAIAAgAWoiAiACKQMAQgGGNwMAIAFBCGohAQwBCwsgACAAKAI4QQF0IgE2AjggAUGAg
    IAQTgRAIAAQEgsLQgIBfwJ+QQAgAmusIQQDQCADQThHBEAgACADaiICIAIpAwAiBSABIANqKQMAhSAEgyAFhTcDACADQQ
    hqIQMMAQsLC0YBAn8jAEFAaiIBJAAgAEE4EHIiAEEBNgI4IABBQGtBOBByIABB+ABqQQE2AgAgAUEBEIoBIAAgARClARC
    yASABQUBrJAALTgEBfyMAQYAEayIBJAAgABAvIAEQLyABQYACahAvIABBgAJqIAFBgAIQZxogAEGABGogAUGAAmpBgAIQ
    ZxogAEEANgKABiABQYAEaiQAC0sBAX8jAEFAaiICJAACQCAAKAI4IAFsQYCAgBBOBEAgAiABEIoBIAAgAhBIDAELIAAgA
    RAoGiAAIAAoAjggAWw2AjgLIAJBQGskAAtKAAJ/IAFBgIDEAEcEQEEBIAAoAhggASAAQRxqKAIAKAIQEQMADQEaCyACRQ
    RAQQAPCyAAKAIYIAJBACAAQRxqKAIAKAIMEQUACwtCAQF/IwBBQGoiAiQAIAJBCGpBgIDAABBfIAEgAkEIahBrIAEQRCA
    AIAEQayAAQQMQKBogABBEIAAQKSACQUBrJAALSQECfyMAQcABayIBJAAgASAAEF4gAUGAAWogABCFASAAIABBQGsiAhCl
    ASAAEEEgAiABQYABahClASAAIAEQlQEgAUHAAWokAAtIAQF/IwBB4AFrIgEkACABQeihwAAQXyABQThqIAAgARAIIAFBq
    AFqIAFBOGoQBSAAIAFBqAFqEGsgAEECNgI4IAFB4AFqJAALPgEBfyABQTpuIQIgAUGVA00EQCAAIAJBA3RqKQMAQgEgAU
    H//wNxQTpwrYaDQgBVDwsgAkEHQdSdwAAQPAALQAIBfwF+IwBBgAFrIgEkACABQQhqIAAQhQEgAUEIahASIAFByABqIAF
    BCGoQgwEgASkDSCABQYABaiQAQgKBpws8AQF/IwBBgAFrIgIkACACIAAQhQEgAkFAayABEIUBIAIQEiACQUBrEBIgAiAC
    QUBrEDUgAkGAAWokAEULPAIBfwF+A38gAUE4RgR/IAJCf3xCgICAgICAgIAEg0I6iKcFIAAgAWopAwAgAoQhAiABQQhqI
    QEMAQsLC0cBAX8jAEEgayIDJAAgA0EUakEANgIAIANB9KrAADYCECADQgE3AgQgAyABNgIcIAMgADYCGCADIANBGGo2Ag
    AgAyACEHAACzkBAX8jAEFAaiICJAAgAiAAEIUBIAIQByABBEAgASACEKUBCyACEAMgAiAAEEggAhAsIAJBQGskAAs6AQF
    /IABBOBByIQADQCACQTBGRQRAIABBCBAtIAAgACkDACABIAJqMQAAfDcDACACQQFqIQIMAQsLCzQBAX8gAEE4EHIiAEEB
    NgI4IABBQGtBOBByIABB+ABqQQE2AgAgACABEKUBIAFBQGsQpQELMAEBfyAAQTgQciEAA0AgAkE4RwRAIAAgAmogASACa
    ikDADcDACACQQhqIQIMAQsLCz8BAX8jAEGAAmsiASQAIAAQUSABEG4gACABEJIBIABBgAJqEK0BIABBgARqEK0BIABBAT
    YCgAYgAUGAAmokAAswAQJ/A0AgAkE4RwRAIAAgAmoiAyADKQMAIAEgAmopAwB8NwMAIAJBCGohAgwBCwsLMAECfwNAIAJ
    BOEcEQCAAIAJqIgMgAykDACABIAJqKQMAfTcDACACQQhqIQIMAQsLCzABAn8DQCACQThHBEAgACACaiIDIAEgAmopAwAg
    AykDAH03AwAgAkEIaiECDAELCwsxAQJ/A0AgAkHwAEcEQCAAIAJqIgMgAykDACABIAJqKQMAfTcDACACQQhqIQIMAQsLC
    zEBAn8DQCACQfAARwRAIAAgAmoiAyADKQMAIAEgAmopAwB8NwMAIAJBCGohAgwBCwsLOQECfyMAQYABayIBJAAgASAAQY
    ABaiICEF4gAiAAEJABIAEQVSAAIAEQkAEgABCsASABQYABaiQACzMBAX8gAgRAIAAhAwNAIAMgAS0AADoAACABQQFqIQE
    gA0EBaiEDIAJBf2oiAg0ACwsgAAtIAQN/IwBBEGsiASQAIAAoAgwhAyAAKAIIIgJFBEBB9KrAAEErQaCrwAAQWwALIAEg
    AzYCCCABIAA2AgQgASACNgIAIAEQcQALMgEBfyAAQgE3AwBBCCEBA0AgAUE4RkUEQCAAIAFqQgA3AwAgAUEIaiEBDAELC
    yAAEFYLNwAgABBRIAAgARCSASAAQYACaiABQYACahCSASAAQYAEaiABQYAEahCSASAAIAEoAoAGNgKABgsoAQF/A0AgAk
    E4RwRAIAAgAmogASACaikDADcDACACQQhqIQIMAQsLCzMAIAAgARCSASAAQYACaiABQYACahCSASAAQYAEaiABQYAEahC
    SASAAIAEoAoAGNgKABgsoACAAIAEgAhB5IABBQGsgAUFAayACEHkgAEGAAWogAUGAAWogAhB5Cy4BAX8jAEGAAWsiASQA
    IAAQLyABEFAgACABEJABIABBgAFqEKkBIAFBgAFqJAALLQAgACABIAIQjwEgAEGAAWogAUGAAWogAhCPASAAQYACaiABQ
    YACaiACEI8BCzQBAX8jAEEQayICJAAgAiABNgIMIAIgADYCCCACQaSowAA2AgQgAkH0qsAANgIAIAIQaAALPgEBfyMAQR
    BrIgEkACABQQhqIABBCGooAgA2AgAgASAAKQIANwMAIAEoAgAiAEEUaigCABogACgCBBoQMwALKQEBfyABBEAgACECA0A
    gAkEAOgAAIAJBAWohAiABQX9qIgENAAsLIAALKwEBfyMAQcABayICJAAgAhBLIAIgARB/IAIQpgEgACACEAwgAkHAAWok
    AAsiAQF/A0AgAUE4RwRAIAAgAWpCADcDACABQQhqIQEMAQsLCycBAX8jAEFAaiICJAAgAkEIaiABEF0gACACQQhqEIsBI
    AJBQGskAAsrACAAEFEgACABEJIBIABBgAJqIAIQkgEgAEGABGogAxCSASAAQQU2AoAGCyMBAX8jAEFAaiIBJAAgASAAEI
    UBIAEQEiABEFogAUFAayQACykAIAAgARBhIAAgACgCOCABKAI4aiIBNgI4IAFBgICAEE4EQCAAEBILCyUAIAAgASACEE8
    gAEEAIAJrIAAoAjgiACABKAI4c3EgAHM2AjgLIwADQCACBEAgACABLQAAED4gAkF/aiECIAFBAWohAQwBCwsLIgACQCAA
    IAEQWUUNACAAQUBrIAFBQGsQWUUNAEEBDwtBAAskAAJAIABBfE0EQCAARQRAQQQhAAwCCyAAEAEiAA0BCwALIAALJwEBf
    yMAQYABayICJAAgAiABEF4gAhA6IAAgAhCVASACQYABaiQACycAIAAgARCQASAAQYABaiABQYABahCQASAAQYACaiABQY
    ACahCQAQslACAAIAEQpQEgAEFAayABQUBrEKUBIABBgAFqIAFBgAFqEKUBCyUBAX8jAEFAaiICJAAgAiABEIUBIAIQQSA
    AIAIQeCACQUBrJAALKAEBfyMAQYACayICJAAgAiABEI4BIAIQKyAAIAIQlgEgAkGAAmokAAsjAEGEAiACSQRAIAJBhAIg
    AxA9AAsgACACNgIEIAAgATYCAAsiAQF/IwBB8ABrIgIkACACIAEQMCAAIAIQBSACQfAAaiQACxwAAkAgABB3RQ0AIABBg
    AFqEHdFDQBBAQ8LQQALHwAgAEE4EHIiAEEBNgI4IAAgARBrIAAgASgCODYCOAseAAJAIAAQhwFFDQAgAEGAAWoQhwFFDQ
    BBAQ8LQQALGwACQCAAEHdFDQAgAEFAaxB3RQ0AQQEPC0EACx4AAkAgABCHAUUNACAAQYACahCHAUUNAEEBDwtBAAsaAQF
    /IAAQWCIBIABBQGsQWCABcyAAEHdxcwsaACAAQTgQciIAQQE2AjggACABEJ0BIAAQVgsZACAAQTgQciIAQQE2AjggACAB
    EGsgABBWCxcAIAAQRCAAKAIAQX8gAUEfcXRBf3NxCxoAIAAgARBfIAAgAhAkIAAgAhBjIAAgAhAkCxwAIAAQLyAAIAEQk
    AEgAEGAAWogAUGAAWoQkAELGAAgACABIAIQeSAAQUBrIAFBQGsgAhB5CxYAIAAgARClASAAQUBrIAFBQGsQpQELGAAgAB
    AvIAAgARCQASAAQYABaiACEJABCxgAIAAgARCQASAAQYABaiABQYABahCQAQsZACAAEK4BIABBgAJqELYBIABBgARqEK4
    BCxcAIAAQsgEgAEFAaxBpIABBgAFqELIBCxQAIAAgARB4IABBQGsgAUFAaxB4CxgAIAAgARCVASAAQYABaiABQYABahCV
    AQsYACAAEKYBIABBgAFqIgAQpgEgACABEA8LGQAgABCpASAAQYABahCwASAAQYACahCpAQsZACAAEKwBIABBgAJqEKwBI
    ABBgARqEKwBCxkAIAAQqgEgAEGAAmoQqgEgAEGABGoQqgELFgAgABAvIAAgARCQASAAQYABahCpAQsWACAAQYABaiIAEK
    gBIAAQOiAAEKgBCxQAIAAQRCAAIAApAwAgAax8NwMACxQAIAAQRCAAIAApAwAgAax9NwMACxEAIAAgARBSIABBQGsgARB
    SCxEAIAAgARBIIABBQGsgARBICxQAIAAgARCQASAAQYABaiACEJABCxIAIAAgARAPIABBgAFqIAEQDwsUACAAIAEQoAEg
    AEGAAWogARCgAQsRACAAKAIEBEAgACgCABAJCwsSACAAIAEQayAAIAEoAjg2AjgLDwAgAEFAayIAEEEgABBECw0AIAAQT
    iAAQUBrEE4LDQAgABBEIABBQGsQRAsPACAAELIBIABBQGsQsgELEAAgABCrASAAQYABahCrAQsNACAAEBIgAEFAaxASCx
    AAIAAQqAEgAEGAAWoQqAELEAAgABCpASAAQYABahCpAQsPACAAQYABahA6IAAQrAELEAAgABCnASAAQYABahCnAQsOACA
    AEGkgAEFAaxCyAQsQACAAIAI2AgQgACABNgIACw0AIAAQdCAAQQE2AjgLDAAgABBBIAAgARB4CwwAIAAgARBrIAAQVgsN
    ACAAEDogACABEJUBCwsAIAAQOiAAEKwBCwwAQunQotvMouq7RgsDAAELAwABCwv+PZoCAEGCgMAACwcBAAAAAQI0AEG4g
    MAAC9sBuF8jku11BwFjT+D5WE+pA2dPnKtLeD0Akew9ffXy9AMD1g8fDSwgAK1vjPCZwa4A8DtNkAEAAADzStxtEor3AI
    uwH1tTsFYDgvLFYx+X7AAysL/NHtseAkehVLifHyMCQHo6ogw4sQGz4sMPAAAAAHNyYy9ibHMxMjM4MS9wYWlyLnJzqAA
    QABQAAAAHAQAACQAAAKgAEAAUAAAADAEAAA0AAACoABAAFAAAABEBAAANAAAAAAAAAAEAAAD///8Dv/+W/78AaQM7VYAd
    moCAAefMIPV1pkwBp+1zAEGogsAACyz+//7///8BAosAgILYBPYB4Y1oiW++kwLOdqvfPagdAMZpulHOdt8Dy1nGFwBB4
    ILAAAuRAZABEAATAAAA0AEAABgAAACQARAAEwAAANQBAAARAAAAkAEQABMAAADWAQAAHAAAAHNyYy9ibHMxMjM4MS9lY3
    AucnMAkAEQABMAAAAZBQAADQAAAJABEAATAAAAGwUAAAkAAACQARAAEwAAABwFAAARAAAAkAEQABMAAAAfBQAAHAAAAAA
    AAAABAAEAAAABAjQAQaCEwAALuSCQARAAEwAAAGcEAAARAAAAkAEQABMAAABsBAAADQAAAJABEAATAAAAbgQAABUAAACQ
    ARAAEwAAAHAEAAAgAAAAHUxYLQgo9ADXXz44aOPbAInJGoj9roEBomOjmrkPTgGY6rCCSW3JAoBOWs9QOu4AimlEAQAAA
    ADgKxeO6UjMAXSpOluMVsgAolXvNe/8FADngsIBPcnDA8EWIDvuPnUAusRiAAwgWgDRCCkuAQAAALgh6L1iEMUA3/4Vlz
    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
    GZYzb76G2KA7ycH+3PFk8AK2qmngEAAABhdHRlbXB0IHRvIGRpdmlkZSBieSB6ZXJvAAAAbxEQABIAAAB8AQAAFAAAAAA
    AAABhdHRlbXB0IHRvIGRpdmlkZSB3aXRoIG92ZXJmbG93c3JjL2JsczEyMzgxL2ZwLnJzAAAAbxEQABIAAAASAgAADQAA
    AG8REAASAAAAHgIAACYAAABvERAAEgAAAB4CAAAjAAAAbxEQABIAAAAkAgAAFwAAAG8REAASAAAAJAIAABQAAAAAAAAAq
    qr//////gHu//9UrP//AupBYg9rDyoBw5z9ShTOEwJLd2TXrEtDAu3pxpKm+V8Cox4RoAEAAABAEhAAFAAAABUBAAATAA
    AAQBIQABQAAAAeAQAAGAAAAEASEAAUAAAAJAEAABwAAABzcmMvYmxzMTIzODEvZWNwMi5ycwAAAAAEAEGQpcAAC7wGQBI
    QABQAAADmAgAACQAAAEASEAAUAAAA7gIAAA0AAABAEhAAFAAAAP4CAAAhAAAAuL0hwchWgAD1+24BqskAA7pwFz2uR7YA
    RNEK7ADpUwN65MZREMUtA0kBgkmkwiMALyuqJAAAAAB+KwRdBX2sAflVF+WERDwDNJME9ce9GwJp12rYgmRCA9BrWWVPJ
    4gA6DRrH9hnnAAFtgI+AQAAAAEouAiGVJMBeKIo6w5zsgIjyRINFpWmAQq1nU73MqoCm/2tGjUu2gJxczJjhFufAHdSXc
    4AAAAAvnlf8F8HqQJqaAc710nDAfOzmulytSoB0pm8jp0W+gEoPsuZi8IrAKw0qwwzzakDAkpsYAAAAACrqv/////+Ae7
    //1Ss//8C6kFiD2sPKgHDnP1KFM4TAkt3ZNesS0MC7enGkqb5XwKjHhGgAQAAAAgUEAALAAAAjwEAAA8AAAAIFBAACwAA
    AKcBAAATAAAACBQQAAsAAACqAQAADQAAAHNyYy9obWFjLnJzADQUEAAgAAAAVBQQABIAAAADAAAAAAAAAAEAAAAEAAAAa
    W5kZXggb3V0IG9mIGJvdW5kczogdGhlIGxlbiBpcyAgYnV0IHRoZSBpbmRleCBpcyAwMDAxMDIwMzA0MDUwNjA3MDgwOT
    EwMTExMjEzMTQxNTE2MTcxODE5MjAyMTIyMjMyNDI1MjYyNzI4MjkzMDMxMzIzMzM0MzUzNjM3MzgzOTQwNDE0MjQzNDQ
    0NTQ2NDc0ODQ5NTA1MTUyNTM1NDU1NTY1NzU4NTk2MDYxNjI2MzY0NjU2NjY3Njg2OTcwNzE3MjczNzQ3NTc2Nzc3ODc5
    ODA4MTgyODM4NDg1ODY4Nzg4ODk5MDkxOTI5Mzk0OTU5Njk3OTg5OQAAQBUQABAAAABQFRAAIgAAAHJhbmdlIGVuZCBpb
    mRleCAgb3V0IG9mIHJhbmdlIGZvciBzbGljZSBvZiBsZW5ndGggAABjYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIG
    EgYE5vbmVgIHZhbHVlALAVEAAcAAAA7gEAAB4AAABsaWJyYXJ5L3N0ZC9zcmMvcGFuaWNraW5nLnJzAEGIrMAACwEBAEH
    IrMAACwEBAEGIrcAACwEBAEHIrcAACwEBAEGIrsAACwEBAEHIrsAACwEBAEGIr8AACwEBAEHIr8AACwEBAEGIsMAACwEB
    AEHIsMAACwEBAEGIscAACwEBAEHIscAACwEBAEGIssAACwEBAEHIssAACwEBAEGIs8AACwEBAEHIs8AACwEBAEGItMAAC
    wEBAEHItMAACwEBAEGItcAACwEBAEHItcAACwEBAEGItsAACwEBAEHItsAACwEBAEGIt8AACwEBAEHIt8AACwEBAEGIuM
    AACwEBAEHIuMAACwEBAEGIucAACwEBAEHIucAACwEBAEGIusAACwEBAEHIusAACwEBAEGIu8AACwEBAEHIu8AACwEBAEG
    IvMAACwEBAEHIvMAACwEBAEGIvcAACwEBAEHIvcAACwEBAEGIvsAACwEBAEHIvsAACwEBAEGIv8AACwEBAEHIv8AACwEB
    AEGIwMAACwEBAEHIwMAACwEBAEGIwcAACwEBAEHIwcAACwEBAEGIwsAACwEBAEHIwsAACwEBAEGIw8AACwEBAEHIw8AAC
    wEBAEGIxMAACwEBAEHIxMAACwEBAEGIxcAACwEBAEHIxcAACwEBAEGIxsAACwEBAEHIxsAACwEBAEGIx8AACwEBAEHIx8
    AACwEBAEGIyMAACwEBAEHIyMAACwEBAEGIycAACwEBAEHIycAACwEBAEGIysAACwEBAEHIysAACwEBAEGIy8AACwEBAEH
    Iy8AACwEBAEGIzMAACwEBAEHIzMAACwEBAEGIzcAACwEBAEHIzcAACwEBAEGIzsAACwEBAEHIzsAACwEBAEGIz8AACwEB
    AEHIz8AACwEBAEGI0MAACwEBAEHI0MAACwEBAEGI0cAACwEBAEHI0cAACwEBAEGI0sAACwEBAEHI0sAACwEBAEGI08AAC
    wEBAEHI08AACwEBAEGI1MAACwEBAEHI1MAACwEBAEGI1cAACwEBAEHI1cAACwEBAEGI1sAACwEBAEHI1sAACwEBAEGI18
    AACwEBAEHI18AACwEBAEGI2MAACwEBAEHI2MAACwEBAEGI2cAACwEBAEHI2cAACwEBAEGI2sAACwEBAEHI2sAACwEBAEG
    I28AACwEBAEHI28AACwEBAEGI3MAACwEBAEHI3MAACwEBAEGI3cAACwEBAEHI3cAACwEBAEGI3sAACwEBAEHI3sAACwEB
    AEGI38AACwEBAEHI38AACwEBAEGI4MAACwEBAEHI4MAACwEBAEGI4cAACwEBAEHI4cAACwEBAEGI4sAACwEBAEHI4sAAC
    wEBAEGI48AACwEBAEHI48AACwEBAEGI5MAACwEBAEHI5MAACwEBAEGI5cAACwEBAEHI5cAACwEBAEGI5sAACwEBAEHI5s
    AACwEBAEGI58AACwEBAEHI58AACwEBAEGI6MAACwEBAEHI6MAACwEBAEGI6cAACwEBAEHI6cAACwEBAEGI6sAACwEBAEH
    I6sAACwEBAEGI68AACwEBAEHI68AACwEBAEGI7MAACwEBAEHI7MAACwEBAEGI7cAACwEBAEHI7cAACwEBAEGI7sAACwEB
    AEHI7sAACwEBAEGI78AACwEBAEHI78AACwEBAEGI8MAACwEBAEHI8MAACwEBAEGI8cAACwEBAEHI8cAACwEBAEGI8sAAC
    wEBAEHI8sAACwEBAEGI88AACwEBAEHI88AACwEBAEGI9MAACwEBAEHI9MAACwEBAEGI9cAACwEBAEHI9cAACwEBAEGI9s
    AACwEBAEHI9sAACwEBAEGI98AACwEBAEHI98AACwEBAEGI+MAACwEBAEHI+MAACwEBAEGI+cAACwEBAEHI+cAACwEBAEG
    I+sAACwEBAEHI+sAACwEBAEGI+8AACwEBAEHI+8AACwEBAEGI/MAACwEBAEHI/MAACwEBAEGI/cAACwEBAEHI/cAACwEB
    AEGI/sAACwEBAEHI/sAACwEBAEGI/8AACwEBAEHI/8AACwEBAEGIgMEACwEBAEHIgMEACwEBAEGIgcEACwEBAEHIgcEAC
    wEBAEGIgsEACwEBAEHIgsEACwEBAEGIg8EACwEBAEHIg8EACwEBAEGIhMEACwEBAEHIhMEACwEBAEGIhcEACwEBAEHIhc
    EACwEBAEGIhsEACwEBAEHIhsEACwEBAEGIh8EACwEBAEHIh8EACwEBAEGIiMEACwEBAEHIiMEACwEBAEGIicEACwEBAEH
    IicEACwEBAEGIisEACwEBAEHIisEACwEBAEGIi8EACwEBAEHIi8EACwEBAEGIjMEACwEBAEHIjMEACwEBAEGIjcEACwEB
    AEHIjcEACwEBAEGIjsEACwEBAEHIjsEACwEBAEGIj8EACwEBAEHIj8EACwEBAEGIkMEACwEBAEHIkMEACwEBAEGIkcEAC
    wEBAEHIkcEACwEBAEGIksEACwEBAEHIksEACwEBAEGIk8EACwEBAEHIk8EACwEBAEGIlMEACwEBAEHIlMEACwEBAEGIlc
    EACwEBAEHIlcEACwEBAEGIlsEACwEBAEHIlsEACwEBAEGIl8EACwEBAEHIl8EACwEBAEGImMEACwEBAEHImMEACwEBAEG
    ImcEACwEBAEHImcEACwEBAEGImsEACwEBAEHImsEACwEBAEGIm8EACwEBAEHIm8EACwEBAEGInMEACwEBAEHInMEACwEB
    AEGIncEACwEBAEHIncEACwEBAEGInsEACwEBAEHInsEACwEBAEGIn8EACwEBAEHIn8EACwEBAEGIoMEACwEBAEHIoMEAC
    wEBAEGIocEACwEBAEHIocEACwEBAEGIosEACwEBAEHIosEACwEBAEGIo8EACwEBAEHIo8EACwEBAEGIpMEACwEBAEHIpM
    EACwEBAEGIpcEACwEBAEHIpcEACwEBAEGIpsEACwEBAEHIpsEACwEBAEGIp8EACwEBAEHIp8EACwEBAEGIqMEACwEBAEH
    IqMEACwEBAEGIqcEACwEBAEHIqcEACwEBAEGIqsEACwEBAEHIqsEACwEBAEGIq8EACwEBAEHIq8EACwEBAEGIrMEACwEB
    AEHIrMEACwEBAEGIrcEACwEBAEHIrcEACwEBAEGIrsEACwEBAEHIrsEACwEBAEGIr8EACwEBAEHIr8EACwEBAEGIsMEAC
    wEBAEHIsMEACwEBAEGIscEACwEBAEHIscEACwEBAEGIssEACwEBAEHIssEACwEBAEGIs8EACwEBAEHIs8EACwEBAEGItM
    EACwEBAEHItMEACwEBAEGItcEACwEBAEHItcEACwEBAHsJcHJvZHVjZXJzAghsYW5ndWFnZQEEUnVzdAAMcHJvY2Vzc2V
    kLWJ5AwVydXN0Yx0xLjQ5LjAgKGUxODg0YThlMyAyMDIwLTEyLTI5KQZ3YWxydXMGMC4xOC4wDHdhc20tYmluZGdlbhIw
    LjIuNzAgKGI2MzU1YzI3MCk=
`.replace(/[^0-9a-zA-Z/+]/g, '');
const wasmBytes = base64Arraybuffer.decode(wasmBytesBase64);
/**
 * @returns {number}
 */
function bls_init() {
    let ret = wasm.bls_init();
    return ret;
}
let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}
function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    return [ptr, arg.length];
}
/**
 * @param {Uint8Array} sig
 * @param {Uint8Array} m
 * @param {Uint8Array} w
 * @returns {number}
 */
function bls_verify(sig, m, w) {
    const [ptr0, len0] = passArray8ToWasm0(sig, wasm.__wbindgen_malloc);
    const [ptr1, len1] = passArray8ToWasm0(m, wasm.__wbindgen_malloc);
    const [ptr2, len2] = passArray8ToWasm0(w, wasm.__wbindgen_malloc);
    const ret = wasm.bls_verify(ptr0, len0, ptr1, len1, ptr2, len2);
    return ret;
}
async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    }
    else {
        const instance = await WebAssembly.instantiate(module, imports);
        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        }
        else {
            return instance;
        }
    }
}
async function init() {
    const imports = {};
    const { instance, module } = await load(wasmBytes, imports);
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    return wasm;
}

let verify;
/**
 *
 * @param pk primary key: Uint8Array
 * @param sig signature: Uint8Array
 * @param msg message: Uint8Array
 * @returns Promise resolving a boolean
 */
async function blsVerify(pk, sig, msg) {
    if (!verify) {
        await init();
        if (bls_init() !== 0) {
            throw new Error('Cannot initialize BLS');
        }
        verify = (pk1, sig1, msg1) => {
            // Reorder things from what the WASM expects (sig, m, w).
            return bls_verify(sig1, msg1, pk1) === 0;
        };
    }
    return verify(pk, sig, msg);
}

/**
 * A certificate needs to be verified (using {@link Certificate.prototype.verify})
 * before it can be used.
 */
class UnverifiedCertificateError extends AgentError {
    constructor() {
        super(`Cannot lookup unverified certificate. Call 'verify()' first.`);
    }
}
function isBufferEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    const a8 = new Uint8Array(a);
    const b8 = new Uint8Array(b);
    for (let i = 0; i < a8.length; i++) {
        if (a8[i] !== b8[i]) {
            return false;
        }
    }
    return true;
}
class Certificate {
    constructor(response, _agent = getDefaultAgent()) {
        this._agent = _agent;
        this.verified = false;
        this._rootKey = null;
        this.cert = decode$2(new Uint8Array(response.certificate));
    }
    lookup(path) {
        this.checkState();
        return lookup_path(path, this.cert.tree);
    }
    async verify() {
        const rootHash = await reconstruct(this.cert.tree);
        const derKey = await this._checkDelegation(this.cert.delegation);
        const sig = this.cert.signature;
        const key = extractDER(derKey);
        const msg = concat$1(domain_sep('ic-state-root'), rootHash);
        const res = await blsVerify(new Uint8Array(key), new Uint8Array(sig), new Uint8Array(msg));
        this.verified = res;
        return res;
    }
    checkState() {
        if (!this.verified) {
            throw new UnverifiedCertificateError();
        }
    }
    async _checkDelegation(d) {
        if (!d) {
            if (!this._rootKey) {
                if (this._agent.rootKey) {
                    this._rootKey = this._agent.rootKey;
                    return this._rootKey;
                }
                throw new Error(`Agent does not have a rootKey. Do you need to call 'fetchRootKey'?`);
            }
            return this._rootKey;
        }
        const cert = new Certificate(d, this._agent);
        if (!(await cert.verify())) {
            throw new Error('fail to verify delegation certificate');
        }
        const lookup = cert.lookup(['subnet', d.subnet_id, 'public_key']);
        if (!lookup) {
            throw new Error(`Could not find subnet key for subnet 0x${toHex(d.subnet_id)}`);
        }
        return lookup;
    }
}
const DER_PREFIX = fromHex('308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100');
const KEY_LENGTH = 96;
function extractDER(buf) {
    const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
    if (buf.byteLength !== expectedLength) {
        throw new TypeError(`BLS DER-encoded public key must be ${expectedLength} bytes long`);
    }
    const prefix = buf.slice(0, DER_PREFIX.byteLength);
    if (!isBufferEqual(prefix, DER_PREFIX)) {
        throw new TypeError(`BLS DER-encoded public key is invalid. Expect the following prefix: ${DER_PREFIX}, but get ${prefix}`);
    }
    return buf.slice(DER_PREFIX.byteLength);
}
/**
 * @param t
 */
async function reconstruct(t) {
    switch (t[0]) {
        case 0 /* Empty */:
            return hash(domain_sep('ic-hashtree-empty'));
        case 4 /* Pruned */:
            return t[1];
        case 3 /* Leaf */:
            return hash(concat$1(domain_sep('ic-hashtree-leaf'), t[1]));
        case 2 /* Labeled */:
            return hash(concat$1(domain_sep('ic-hashtree-labeled'), t[1], await reconstruct(t[2])));
        case 1 /* Fork */:
            return hash(concat$1(domain_sep('ic-hashtree-fork'), await reconstruct(t[1]), await reconstruct(t[2])));
        default:
            throw new Error('unreachable');
    }
}
function domain_sep(s) {
    const len = new Uint8Array([s.length]);
    const str = new TextEncoder().encode(s);
    return concat$1(len, str);
}
/**
 * @param path
 * @param tree
 */
function lookup_path(path, tree) {
    if (path.length === 0) {
        switch (tree[0]) {
            case 3 /* Leaf */: {
                return new Uint8Array(tree[1]).buffer;
            }
            default: {
                return undefined;
            }
        }
    }
    const label = typeof path[0] === 'string' ? new TextEncoder().encode(path[0]) : path[0];
    const t = find_label(label, flatten_forks(tree));
    if (t) {
        return lookup_path(path.slice(1), t);
    }
}
function flatten_forks(t) {
    switch (t[0]) {
        case 0 /* Empty */:
            return [];
        case 1 /* Fork */:
            return flatten_forks(t[1]).concat(flatten_forks(t[2]));
        default:
            return [t];
    }
}
function find_label(l, trees) {
    if (trees.length === 0) {
        return undefined;
    }
    for (const t of trees) {
        if (t[0] === 2 /* Labeled */) {
            const p = t[1];
            if (isBufferEqual(l, p)) {
                return t[2];
            }
        }
    }
}

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
/**
 * A best practices polling strategy: wait 2 seconds before the first poll, then 1 second
 * with an exponential backoff factor of 1.2. Timeout after 5 minutes.
 */
function defaultStrategy() {
    return chain(conditionalDelay(once$1(), 1000), backoff(1000, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
/**
 * Predicate that returns true once.
 */
function once$1() {
    let first = true;
    return async () => {
        if (first) {
            first = false;
            return true;
        }
        return false;
    };
}
/**
 * Delay the polling once.
 * @param condition A predicate that indicates when to delay.
 * @param timeInMsec The amount of time to delay.
 */
function conditionalDelay(condition, timeInMsec) {
    return async (canisterId, requestId, status) => {
        if (await condition(canisterId, requestId, status)) {
            return new Promise(resolve => setTimeout(resolve, timeInMsec));
        }
    };
}
/**
 * Reject a call after a certain amount of time.
 * @param timeInMsec Time in milliseconds before the polling should be rejected.
 */
function timeout(timeInMsec) {
    const end = Date.now() + timeInMsec;
    return async (canisterId, requestId, status) => {
        if (Date.now() > end) {
            throw new Error(`Request timed out after ${timeInMsec} msec:\n` +
                `  Request ID: ${toHex(requestId)}\n` +
                `  Request status: ${status}\n`);
        }
    };
}
/**
 * A strategy that throttle, but using an exponential backoff strategy.
 * @param startingThrottleInMsec The throttle in milliseconds to start with.
 * @param backoffFactor The factor to multiple the throttle time between every poll. For
 *   example if using 2, the throttle will double between every run.
 */
function backoff(startingThrottleInMsec, backoffFactor) {
    let currentThrottling = startingThrottleInMsec;
    return () => new Promise(resolve => setTimeout(() => {
        currentThrottling *= backoffFactor;
        resolve();
    }, currentThrottling));
}
/**
 * Chain multiple polling strategy. This _chains_ the strategies, so if you pass in,
 * say, two throttling strategy of 1 second, it will result in a throttle of 2 seconds.
 * @param strategies A strategy list to chain.
 */
function chain(...strategies) {
    return async (canisterId, requestId, status) => {
        for (const a of strategies) {
            await a(canisterId, requestId, status);
        }
    };
}

/**
 * Polls the IC to check the status of the given request then
 * returns the response bytes once the request has been processed.
 * @param agent The agent to use to poll read_state.
 * @param canisterId The effective canister ID.
 * @param requestId The Request ID to poll status for.
 * @param strategy A polling strategy.
 */
async function pollForResponse(agent, canisterId, requestId, strategy) {
    const path = [new TextEncoder().encode('request_status'), requestId];
    const state = await agent.readState(canisterId, { paths: [path] });
    const cert = new Certificate(state, agent);
    const verified = await cert.verify();
    if (!verified) {
        throw new Error('Fail to verify certificate');
    }
    const maybeBuf = cert.lookup([...path, new TextEncoder().encode('status')]);
    let status;
    if (typeof maybeBuf === 'undefined') {
        // Missing requestId means we need to wait
        status = RequestStatusResponseStatus.Unknown;
    }
    else {
        status = new TextDecoder().decode(maybeBuf);
    }
    switch (status) {
        case RequestStatusResponseStatus.Replied: {
            return cert.lookup([...path, 'reply']);
        }
        case RequestStatusResponseStatus.Received:
        case RequestStatusResponseStatus.Unknown:
        case RequestStatusResponseStatus.Processing:
            // Execute the polling strategy, then retry.
            await strategy(canisterId, requestId, status);
            return pollForResponse(agent, canisterId, requestId, strategy);
        case RequestStatusResponseStatus.Rejected: {
            const rejectCode = new Uint8Array(cert.lookup([...path, 'reject_code']))[0];
            const rejectMessage = new TextDecoder().decode(cert.lookup([...path, 'reject_message']));
            throw new Error(`Call was rejected:\n` +
                `  Request ID: ${toHex(requestId)}\n` +
                `  Reject code: ${rejectCode}\n` +
                `  Reject text: ${rejectMessage}\n`);
        }
        case RequestStatusResponseStatus.Done:
            // This is _technically_ not an error, but we still didn't see the `Replied` status so
            // we don't know the result and cannot decode it.
            throw new Error(`Call was marked as done but we never saw the reply:\n` +
                `  Request ID: ${toHex(requestId)}\n`);
    }
    throw new Error('unreachable');
}

class ActorCallError extends AgentError {
    constructor(canisterId, methodName, type, props) {
        super([
            `Call failed:`,
            `  Canister: ${canisterId.toText()}`,
            `  Method: ${methodName} (${type})`,
            ...Object.getOwnPropertyNames(props).map(n => `  "${n}": ${JSON.stringify(props[n])}`),
        ].join('\n'));
        this.canisterId = canisterId;
        this.methodName = methodName;
        this.type = type;
        this.props = props;
    }
}
class QueryCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, result) {
        var _a;
        super(canisterId, methodName, 'query', {
            Status: result.status,
            Code: (_a = ReplicaRejectCode[result.reject_code]) !== null && _a !== void 0 ? _a : `Unknown Code "${result.reject_code}"`,
            Message: result.reject_message,
        });
        this.result = result;
    }
}
class UpdateCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, requestId, response) {
        super(canisterId, methodName, 'update', {
            'Request ID': toHex(requestId),
            'HTTP status code': response.status.toString(),
            'HTTP status text': response.statusText,
        });
        this.requestId = requestId;
        this.response = response;
    }
}
/**
 * The mode used when installing a canister.
 */
var CanisterInstallMode;
(function (CanisterInstallMode) {
    CanisterInstallMode["Install"] = "install";
    CanisterInstallMode["Reinstall"] = "reinstall";
    CanisterInstallMode["Upgrade"] = "upgrade";
})(CanisterInstallMode || (CanisterInstallMode = {}));
const metadataSymbol = Symbol.for('ic-agent-metadata');
/**
 * An actor base class. An actor is an object containing only functions that will
 * return a promise. These functions are derived from the IDL definition.
 */
class Actor {
    constructor(metadata) {
        this[metadataSymbol] = Object.freeze(metadata);
    }
    /**
     * Get the Agent class this Actor would call, or undefined if the Actor would use
     * the default agent (global.ic.agent).
     * @param actor The actor to get the agent of.
     */
    static agentOf(actor) {
        return actor[metadataSymbol].config.agent;
    }
    /**
     * Get the interface of an actor, in the form of an instance of a Service.
     * @param actor The actor to get the interface of.
     */
    static interfaceOf(actor) {
        return actor[metadataSymbol].service;
    }
    static canisterIdOf(actor) {
        return Principal.from(actor[metadataSymbol].config.canisterId);
    }
    static async install(fields, config) {
        const mode = fields.mode === undefined ? CanisterInstallMode.Install : fields.mode;
        // Need to transform the arg into a number array.
        const arg = fields.arg ? [...new Uint8Array(fields.arg)] : [];
        // Same for module.
        const wasmModule = [...new Uint8Array(fields.module)];
        const canisterId = typeof config.canisterId === 'string'
            ? Principal.fromText(config.canisterId)
            : config.canisterId;
        await getManagementCanister(config).install_code({
            mode: { [mode]: null },
            arg,
            wasm_module: wasmModule,
            canister_id: canisterId,
        });
    }
    static async createCanister(config) {
        const { canister_id: canisterId } = await getManagementCanister(config || {}).provisional_create_canister_with_cycles({ amount: [], settings: [] });
        return canisterId;
    }
    static async createAndInstallCanister(interfaceFactory, fields, config) {
        const canisterId = await this.createCanister(config);
        await this.install(Object.assign({}, fields), Object.assign(Object.assign({}, config), { canisterId }));
        return this.createActor(interfaceFactory, Object.assign(Object.assign({}, config), { canisterId }));
    }
    static createActorClass(interfaceFactory) {
        const service = interfaceFactory({ IDL });
        class CanisterActor extends Actor {
            constructor(config) {
                const canisterId = typeof config.canisterId === 'string'
                    ? Principal.fromText(config.canisterId)
                    : config.canisterId;
                super({
                    config: Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), config), { canisterId }),
                    service,
                });
                for (const [methodName, func] of service._fields) {
                    this[methodName] = _createActorMethod(this, methodName, func);
                }
            }
        }
        return CanisterActor;
    }
    static createActor(interfaceFactory, configuration) {
        return new (this.createActorClass(interfaceFactory))(configuration);
    }
}
// IDL functions can have multiple return values, so decoding always
// produces an array. Ensure that functions with single or zero return
// values behave as expected.
function decodeReturnValue(types, msg) {
    const returnValues = decode$1(types, buffer.Buffer.from(msg));
    switch (returnValues.length) {
        case 0:
            return undefined;
        case 1:
            return returnValues[0];
        default:
            return returnValues;
    }
}
const DEFAULT_ACTOR_CONFIG = {
    pollingStrategyFactory: defaultStrategy,
};
function _createActorMethod(actor, methodName, func) {
    let caller;
    if (func.annotations.includes('query')) {
        caller = async (options, ...args) => {
            var _a, _b;
            // First, if there's a config transformation, call it.
            options = Object.assign(Object.assign({}, options), (_b = (_a = actor[metadataSymbol].config).queryTransform) === null || _b === void 0 ? void 0 : _b.call(_a, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
            const agent = options.agent || actor[metadataSymbol].config.agent || getDefaultAgent();
            const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
            const arg = encode$1(func.argTypes, args);
            const result = await agent.query(cid, { methodName, arg });
            switch (result.status) {
                case "rejected" /* Rejected */:
                    throw new QueryCallRejectedError(cid, methodName, result);
                case "replied" /* Replied */:
                    return decodeReturnValue(func.retTypes, result.reply.arg);
            }
        };
    }
    else {
        caller = async (options, ...args) => {
            var _a, _b;
            // First, if there's a config transformation, call it.
            options = Object.assign(Object.assign({}, options), (_b = (_a = actor[metadataSymbol].config).callTransform) === null || _b === void 0 ? void 0 : _b.call(_a, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
            const agent = options.agent || actor[metadataSymbol].config.agent || getDefaultAgent();
            const { canisterId, effectiveCanisterId, pollingStrategyFactory } = Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), actor[metadataSymbol].config), options);
            const cid = Principal.from(canisterId);
            const ecid = effectiveCanisterId !== undefined ? Principal.from(effectiveCanisterId) : cid;
            const arg = encode$1(func.argTypes, args);
            const { requestId, response } = await agent.call(cid, {
                methodName,
                arg,
                effectiveCanisterId: ecid,
            });
            if (!response.ok) {
                throw new UpdateCallRejectedError(cid, methodName, requestId, response);
            }
            const pollStrategy = pollingStrategyFactory();
            const responseBytes = await pollForResponse(agent, ecid, requestId, pollStrategy);
            if (responseBytes !== undefined) {
                return decodeReturnValue(func.retTypes, responseBytes);
            }
            else if (func.retTypes.length === 0) {
                return undefined;
            }
            else {
                throw new Error(`Call was returned undefined, but type [${func.retTypes.join(',')}].`);
            }
        };
    }
    const handler = (...args) => caller({}, ...args);
    handler.withOptions =
        (options) => (...args) => caller(options, ...args);
    return handler;
}

export { Actor, HttpAgent };
