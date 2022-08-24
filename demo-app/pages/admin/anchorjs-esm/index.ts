 // @ts-nocheck
/*! For license information please see index.js.LICENSE.txt */
import * as __WEBPACK_EXTERNAL_MODULE__solana_web3_js_fd5ac512__ from "@solana/web3.js";
import * as __WEBPACK_EXTERNAL_MODULE_bn_js_34e549a7__ from "bn.js";
import * as __WEBPACK_EXTERNAL_MODULE_buffer__ from "buffer";
import * as __WEBPACK_EXTERNAL_MODULE_assert__ from "assert";
var __webpack_modules__ = {
    593: function (t, e, r) {
      var n =
        (this && this.__importDefault) ||
        function (t) {
          return t && t.__esModule ? t : { default: t };
        };
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.map =
          e.array =
          e.rustEnum =
          e.str =
          e.vecU8 =
          e.tagged =
          e.vec =
          e.bool =
          e.option =
          e.publicKey =
          e.i128 =
          e.u128 =
          e.i64 =
          e.u64 =
          e.struct =
          e.f64 =
          e.f32 =
          e.i32 =
          e.u32 =
          e.i16 =
          e.u16 =
          e.i8 =
          e.u8 =
            void 0);
      const i = r(698),
        o = r(329),
        s = n(r(908));
      var a = r(698);
      Object.defineProperty(e, "u8", {
        enumerable: !0,
        get: function () {
          return a.u8;
        },
      }),
        Object.defineProperty(e, "i8", {
          enumerable: !0,
          get: function () {
            return a.s8;
          },
        }),
        Object.defineProperty(e, "u16", {
          enumerable: !0,
          get: function () {
            return a.u16;
          },
        }),
        Object.defineProperty(e, "i16", {
          enumerable: !0,
          get: function () {
            return a.s16;
          },
        }),
        Object.defineProperty(e, "u32", {
          enumerable: !0,
          get: function () {
            return a.u32;
          },
        }),
        Object.defineProperty(e, "i32", {
          enumerable: !0,
          get: function () {
            return a.s32;
          },
        }),
        Object.defineProperty(e, "f32", {
          enumerable: !0,
          get: function () {
            return a.f32;
          },
        }),
        Object.defineProperty(e, "f64", {
          enumerable: !0,
          get: function () {
            return a.f64;
          },
        }),
        Object.defineProperty(e, "struct", {
          enumerable: !0,
          get: function () {
            return a.struct;
          },
        });
      class c extends i.Layout {
        constructor(t, e, r) {
          super(t, r), (this.blob = i.blob(t)), (this.signed = e);
        }
        decode(t, e = 0) {
          const r = new s.default(this.blob.decode(t, e), 10, "le");
          return this.signed ? r.fromTwos(8 * this.span).clone() : r;
        }
        encode(t, e, r = 0) {
          return (
            this.signed && (t = t.toTwos(8 * this.span)),
            this.blob.encode(t.toArrayLike(Buffer, "le", this.span), e, r)
          );
        }
      }
      function u(t) {
        return new c(8, !1, t);
      }
      (e.u64 = u),
        (e.i64 = function (t) {
          return new c(8, !0, t);
        }),
        (e.u128 = function (t) {
          return new c(16, !1, t);
        }),
        (e.i128 = function (t) {
          return new c(16, !0, t);
        });
      class l extends i.Layout {
        constructor(t, e, r, n) {
          super(t.span, n),
            (this.layout = t),
            (this.decoder = e),
            (this.encoder = r);
        }
        decode(t, e) {
          return this.decoder(this.layout.decode(t, e));
        }
        encode(t, e, r) {
          return this.layout.encode(this.encoder(t), e, r);
        }
        getSpan(t, e) {
          return this.layout.getSpan(t, e);
        }
      }
      e.publicKey = function (t) {
        return new l(
          i.blob(32),
          (t) => new o.PublicKey(t),
          (t) => t.toBuffer(),
          t
        );
      };
      class h extends i.Layout {
        constructor(t, e) {
          super(-1, e), (this.layout = t), (this.discriminator = i.u8());
        }
        encode(t, e, r = 0) {
          return null == t
            ? this.discriminator.encode(0, e, r)
            : (this.discriminator.encode(1, e, r),
              this.layout.encode(t, e, r + 1) + 1);
        }
        decode(t, e = 0) {
          const r = this.discriminator.decode(t, e);
          if (0 === r) return null;
          if (1 === r) return this.layout.decode(t, e + 1);
          throw new Error("Invalid option " + this.property);
        }
        getSpan(t, e = 0) {
          const r = this.discriminator.decode(t, e);
          if (0 === r) return 1;
          if (1 === r) return this.layout.getSpan(t, e + 1) + 1;
          throw new Error("Invalid option " + this.property);
        }
      }
      function d(t) {
        if (0 === t) return !1;
        if (1 === t) return !0;
        throw new Error("Invalid bool: " + t);
      }
      function f(t) {
        return t ? 1 : 0;
      }
      function p(t) {
        const e = i.u32("length"),
          r = i.struct([e, i.blob(i.offset(e, -e.span), "data")]);
        return new l(
          r,
          ({ data: t }) => t,
          (t) => ({ data: t }),
          t
        );
      }
      (e.option = function (t, e) {
        return new h(t, e);
      }),
        (e.bool = function (t) {
          return new l(i.u8(), d, f, t);
        }),
        (e.vec = function (t, e) {
          const r = i.u32("length"),
            n = i.struct([r, i.seq(t, i.offset(r, -r.span), "values")]);
          return new l(
            n,
            ({ values: t }) => t,
            (t) => ({ values: t }),
            e
          );
        }),
        (e.tagged = function (t, e, r) {
          const n = i.struct([u("tag"), e.replicate("data")]);
          return new l(
            n,
            function ({ tag: e, data: r }) {
              if (!e.eq(t))
                throw new Error(
                  "Invalid tag, expected: " +
                    t.toString("hex") +
                    ", got: " +
                    e.toString("hex")
                );
              return r;
            },
            (e) => ({ tag: t, data: e }),
            r
          );
        }),
        (e.vecU8 = p),
        (e.str = function (t) {
          return new l(
            p(),
            (t) => t.toString("utf-8"),
            (t) => Buffer.from(t, "utf-8"),
            t
          );
        }),
        (e.rustEnum = function (t, e, r) {
          const n = i.union(null != r ? r : i.u8(), e);
          return t.forEach((t, e) => n.addVariant(e, t, t.property)), n;
        }),
        (e.array = function (t, e, r) {
          const n = i.struct([i.seq(t, e, "values")]);
          return new l(
            n,
            ({ values: t }) => t,
            (t) => ({ values: t }),
            r
          );
        });
      class _ extends i.Layout {
        constructor(t, e, r) {
          super(t.span + e.span, r),
            (this.keyLayout = t),
            (this.valueLayout = e);
        }
        decode(t, e) {
          return (
            (e = e || 0),
            [
              this.keyLayout.decode(t, e),
              this.valueLayout.decode(t, e + this.keyLayout.getSpan(t, e)),
            ]
          );
        }
        encode(t, e, r) {
          r = r || 0;
          const n = this.keyLayout.encode(t[0], e, r);
          return n + this.valueLayout.encode(t[1], e, r + n);
        }
        getSpan(t, e) {
          return this.keyLayout.getSpan(t, e) + this.valueLayout.getSpan(t, e);
        }
      }
      e.map = function (t, e, r) {
        const n = i.u32("length"),
          o = i.struct([n, i.seq(new _(t, e), i.offset(n, -n.span), "values")]);
        return new l(
          o,
          ({ values: t }) => new Map(t),
          (t) => ({ values: Array.from(t.entries()) }),
          r
        );
      };
    },
    162: (t, e, r) => {
      var n = r(509).Buffer;
      t.exports = function (t) {
        if (t.length >= 255) throw new TypeError("Alphabet too long");
        for (var e = new Uint8Array(256), r = 0; r < e.length; r++) e[r] = 255;
        for (var i = 0; i < t.length; i++) {
          var o = t.charAt(i),
            s = o.charCodeAt(0);
          if (255 !== e[s]) throw new TypeError(o + " is ambiguous");
          e[s] = i;
        }
        var a = t.length,
          c = t.charAt(0),
          u = Math.log(a) / Math.log(256),
          l = Math.log(256) / Math.log(a);
        function h(t) {
          if ("string" != typeof t) throw new TypeError("Expected String");
          if (0 === t.length) return n.alloc(0);
          for (var r = 0, i = 0, o = 0; t[r] === c; ) i++, r++;
          for (
            var s = ((t.length - r) * u + 1) >>> 0, l = new Uint8Array(s);
            t[r];

          ) {
            var h = e[t.charCodeAt(r)];
            if (255 === h) return;
            for (var d = 0, f = s - 1; (0 !== h || d < o) && -1 !== f; f--, d++)
              (h += (a * l[f]) >>> 0),
                (l[f] = h % 256 >>> 0),
                (h = (h / 256) >>> 0);
            if (0 !== h) throw new Error("Non-zero carry");
            (o = d), r++;
          }
          for (var p = s - o; p !== s && 0 === l[p]; ) p++;
          var _ = n.allocUnsafe(i + (s - p));
          _.fill(0, 0, i);
          for (var m = i; p !== s; ) _[m++] = l[p++];
          return _;
        }
        return {
          encode: function (e) {
            if (
              ((Array.isArray(e) || e instanceof Uint8Array) && (e = n.from(e)),
              !n.isBuffer(e))
            )
              throw new TypeError("Expected Buffer");
            if (0 === e.length) return "";
            for (var r = 0, i = 0, o = 0, s = e.length; o !== s && 0 === e[o]; )
              o++, r++;
            for (
              var u = ((s - o) * l + 1) >>> 0, h = new Uint8Array(u);
              o !== s;

            ) {
              for (
                var d = e[o], f = 0, p = u - 1;
                (0 !== d || f < i) && -1 !== p;
                p--, f++
              )
                (d += (256 * h[p]) >>> 0),
                  (h[p] = d % a >>> 0),
                  (d = (d / a) >>> 0);
              if (0 !== d) throw new Error("Non-zero carry");
              (i = f), o++;
            }
            for (var _ = u - i; _ !== u && 0 === h[_]; ) _++;
            for (var m = c.repeat(r); _ < u; ++_) m += t.charAt(h[_]);
            return m;
          },
          decodeUnsafe: h,
          decode: function (t) {
            var e = h(t);
            if (e) return e;
            throw new Error("Non-base" + a + " character");
          },
        };
      };
    },
    742: (t, e) => {
      (e.b$ = function (t) {
        var e,
          r,
          o = (function (t) {
            var e = t.length;
            if (e % 4 > 0)
              throw new Error("Invalid string. Length must be a multiple of 4");
            var r = t.indexOf("=");
            return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)];
          })(t),
          s = o[0],
          a = o[1],
          c = new i(
            (function (t, e, r) {
              return (3 * (e + r)) / 4 - r;
            })(0, s, a)
          ),
          u = 0,
          l = a > 0 ? s - 4 : s;
        for (r = 0; r < l; r += 4)
          (e =
            (n[t.charCodeAt(r)] << 18) |
            (n[t.charCodeAt(r + 1)] << 12) |
            (n[t.charCodeAt(r + 2)] << 6) |
            n[t.charCodeAt(r + 3)]),
            (c[u++] = (e >> 16) & 255),
            (c[u++] = (e >> 8) & 255),
            (c[u++] = 255 & e);
        return (
          2 === a &&
            ((e = (n[t.charCodeAt(r)] << 2) | (n[t.charCodeAt(r + 1)] >> 4)),
            (c[u++] = 255 & e)),
          1 === a &&
            ((e =
              (n[t.charCodeAt(r)] << 10) |
              (n[t.charCodeAt(r + 1)] << 4) |
              (n[t.charCodeAt(r + 2)] >> 2)),
            (c[u++] = (e >> 8) & 255),
            (c[u++] = 255 & e)),
          c
        );
      }),
        (e.JQ = function (t) {
          for (
            var e, n = t.length, i = n % 3, o = [], s = 16383, a = 0, u = n - i;
            a < u;
            a += s
          )
            o.push(c(t, a, a + s > u ? u : a + s));
          return (
            1 === i
              ? ((e = t[n - 1]), o.push(r[e >> 2] + r[(e << 4) & 63] + "=="))
              : 2 === i &&
                ((e = (t[n - 2] << 8) + t[n - 1]),
                o.push(r[e >> 10] + r[(e >> 4) & 63] + r[(e << 2) & 63] + "=")),
            o.join("")
          );
        });
      for (
        var r = [],
          n = [],
          i = "undefined" != typeof Uint8Array ? Uint8Array : Array,
          o =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          s = 0,
          a = o.length;
        s < a;
        ++s
      )
        (r[s] = o[s]), (n[o.charCodeAt(s)] = s);
      function c(t, e, n) {
        for (var i, o, s = [], a = e; a < n; a += 3)
          (i =
            ((t[a] << 16) & 16711680) +
            ((t[a + 1] << 8) & 65280) +
            (255 & t[a + 2])),
            s.push(
              r[((o = i) >> 18) & 63] +
                r[(o >> 12) & 63] +
                r[(o >> 6) & 63] +
                r[63 & o]
            );
        return s.join("");
      }
      (n["-".charCodeAt(0)] = 62), (n["_".charCodeAt(0)] = 63);
    },
    191: (t, e, r) => {
      var n = r(162);
      t.exports = n(
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
      );
    },
    698: (t, e) => {
      class r {
        constructor(t, e) {
          if (!Number.isInteger(t))
            throw new TypeError("span must be an integer");
          (this.span = t), (this.property = e);
        }
        makeDestinationObject() {
          return {};
        }
        decode(t, e) {
          throw new Error("Layout is abstract");
        }
        encode(t, e, r) {
          throw new Error("Layout is abstract");
        }
        getSpan(t, e) {
          if (0 > this.span) throw new RangeError("indeterminate span");
          return this.span;
        }
        replicate(t) {
          const e = Object.create(this.constructor.prototype);
          return Object.assign(e, this), (e.property = t), e;
        }
        fromArray(t) {}
      }
      function n(t, e) {
        return e.property ? t + "[" + e.property + "]" : t;
      }
      (e.Layout = r),
        (e.nameWithProperty = n),
        (e.bindConstructorLayout = function (t, e) {
          if ("function" != typeof t)
            throw new TypeError("Class must be constructor");
          if (t.hasOwnProperty("layout_"))
            throw new Error("Class is already bound to a layout");
          if (!(e && e instanceof r))
            throw new TypeError("layout must be a Layout");
          if (e.hasOwnProperty("boundConstructor_"))
            throw new Error("layout is already bound to a constructor");
          (t.layout_ = e),
            (e.boundConstructor_ = t),
            (e.makeDestinationObject = () => new t()),
            Object.defineProperty(t.prototype, "encode", {
              value: function (t, r) {
                return e.encode(this, t, r);
              },
              writable: !0,
            }),
            Object.defineProperty(t, "decode", {
              value: function (t, r) {
                return e.decode(t, r);
              },
              writable: !0,
            });
        });
      class i extends r {
        isCount() {
          throw new Error("ExternalLayout is abstract");
        }
      }
      class o extends i {
        constructor(t, e) {
          if ((void 0 === t && (t = 1), !Number.isInteger(t) || 0 >= t))
            throw new TypeError("elementSpan must be a (positive) integer");
          super(-1, e), (this.elementSpan = t);
        }
        isCount() {
          return !0;
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          const r = t.length - e;
          return Math.floor(r / this.elementSpan);
        }
        encode(t, e, r) {
          return 0;
        }
      }
      class s extends i {
        constructor(t, e, n) {
          if (!(t instanceof r)) throw new TypeError("layout must be a Layout");
          if (void 0 === e) e = 0;
          else if (!Number.isInteger(e))
            throw new TypeError("offset must be integer or undefined");
          super(t.span, n || t.property), (this.layout = t), (this.offset = e);
        }
        isCount() {
          return this.layout instanceof a || this.layout instanceof c;
        }
        decode(t, e) {
          return (
            void 0 === e && (e = 0), this.layout.decode(t, e + this.offset)
          );
        }
        encode(t, e, r) {
          return (
            void 0 === r && (r = 0), this.layout.encode(t, e, r + this.offset)
          );
        }
      }
      class a extends r {
        constructor(t, e) {
          if ((super(t, e), 6 < this.span))
            throw new RangeError("span must not exceed 6 bytes");
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readUIntLE(e, this.span);
        }
        encode(t, e, r) {
          return (
            void 0 === r && (r = 0), e.writeUIntLE(t, r, this.span), this.span
          );
        }
      }
      class c extends r {
        constructor(t, e) {
          if ((super(t, e), 6 < this.span))
            throw new RangeError("span must not exceed 6 bytes");
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readUIntBE(e, this.span);
        }
        encode(t, e, r) {
          return (
            void 0 === r && (r = 0), e.writeUIntBE(t, r, this.span), this.span
          );
        }
      }
      class u extends r {
        constructor(t, e) {
          if ((super(t, e), 6 < this.span))
            throw new RangeError("span must not exceed 6 bytes");
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readIntLE(e, this.span);
        }
        encode(t, e, r) {
          return (
            void 0 === r && (r = 0), e.writeIntLE(t, r, this.span), this.span
          );
        }
      }
      class l extends r {
        constructor(t, e) {
          if ((super(t, e), 6 < this.span))
            throw new RangeError("span must not exceed 6 bytes");
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readIntBE(e, this.span);
        }
        encode(t, e, r) {
          return (
            void 0 === r && (r = 0), e.writeIntBE(t, r, this.span), this.span
          );
        }
      }
      const h = Math.pow(2, 32);
      function d(t) {
        const e = Math.floor(t / h);
        return { hi32: e, lo32: t - e * h };
      }
      function f(t, e) {
        return t * h + e;
      }
      class p extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          const r = t.readUInt32LE(e);
          return f(t.readUInt32LE(e + 4), r);
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = d(t);
          return e.writeUInt32LE(n.lo32, r), e.writeUInt32LE(n.hi32, r + 4), 8;
        }
      }
      class _ extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          return (
            void 0 === e && (e = 0), f(t.readUInt32BE(e), t.readUInt32BE(e + 4))
          );
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = d(t);
          return e.writeUInt32BE(n.hi32, r), e.writeUInt32BE(n.lo32, r + 4), 8;
        }
      }
      class m extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          const r = t.readUInt32LE(e);
          return f(t.readInt32LE(e + 4), r);
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = d(t);
          return e.writeUInt32LE(n.lo32, r), e.writeInt32LE(n.hi32, r + 4), 8;
        }
      }
      class w extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          return (
            void 0 === e && (e = 0), f(t.readInt32BE(e), t.readUInt32BE(e + 4))
          );
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = d(t);
          return e.writeInt32BE(n.hi32, r), e.writeUInt32BE(n.lo32, r + 4), 8;
        }
      }
      class y extends r {
        constructor(t) {
          super(4, t);
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readFloatLE(e);
        }
        encode(t, e, r) {
          return void 0 === r && (r = 0), e.writeFloatLE(t, r), 4;
        }
      }
      class g extends r {
        constructor(t) {
          super(4, t);
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readFloatBE(e);
        }
        encode(t, e, r) {
          return void 0 === r && (r = 0), e.writeFloatBE(t, r), 4;
        }
      }
      class b extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readDoubleLE(e);
        }
        encode(t, e, r) {
          return void 0 === r && (r = 0), e.writeDoubleLE(t, r), 8;
        }
      }
      class v extends r {
        constructor(t) {
          super(8, t);
        }
        decode(t, e) {
          return void 0 === e && (e = 0), t.readDoubleBE(e);
        }
        encode(t, e, r) {
          return void 0 === r && (r = 0), e.writeDoubleBE(t, r), 8;
        }
      }
      class E extends r {
        constructor(t, e, n) {
          if (!(t instanceof r))
            throw new TypeError("elementLayout must be a Layout");
          if (
            !(
              (e instanceof i && e.isCount()) ||
              (Number.isInteger(e) && 0 <= e)
            )
          )
            throw new TypeError(
              "count must be non-negative integer or an unsigned integer ExternalLayout"
            );
          let o = -1;
          !(e instanceof i) && 0 < t.span && (o = e * t.span),
            super(o, n),
            (this.elementLayout = t),
            (this.count = e);
        }
        getSpan(t, e) {
          if (0 <= this.span) return this.span;
          void 0 === e && (e = 0);
          let r = 0,
            n = this.count;
          if (
            (n instanceof i && (n = n.decode(t, e)),
            0 < this.elementLayout.span)
          )
            r = n * this.elementLayout.span;
          else {
            let i = 0;
            for (; i < n; ) (r += this.elementLayout.getSpan(t, e + r)), ++i;
          }
          return r;
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          const r = [];
          let n = 0,
            o = this.count;
          for (o instanceof i && (o = o.decode(t, e)); n < o; )
            r.push(this.elementLayout.decode(t, e)),
              (e += this.elementLayout.getSpan(t, e)),
              (n += 1);
          return r;
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = this.elementLayout,
            o = t.reduce((t, i) => t + n.encode(i, e, r + t), 0);
          return (
            this.count instanceof i && this.count.encode(t.length, e, r), o
          );
        }
      }
      class k extends r {
        constructor(t, e, n) {
          if (!Array.isArray(t) || !t.reduce((t, e) => t && e instanceof r, !0))
            throw new TypeError("fields must be array of Layout instances");
          "boolean" == typeof e && void 0 === n && ((n = e), (e = void 0));
          for (const e of t)
            if (0 > e.span && void 0 === e.property)
              throw new Error(
                "fields cannot contain unnamed variable-length layout"
              );
          let i = -1;
          try {
            i = t.reduce((t, e) => t + e.getSpan(), 0);
          } catch (t) {}
          super(i, e), (this.fields = t), (this.decodePrefixes = !!n);
        }
        getSpan(t, e) {
          if (0 <= this.span) return this.span;
          void 0 === e && (e = 0);
          let r = 0;
          try {
            r = this.fields.reduce((r, n) => {
              const i = n.getSpan(t, e);
              return (e += i), r + i;
            }, 0);
          } catch (t) {
            throw new RangeError("indeterminate span");
          }
          return r;
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          const r = this.makeDestinationObject();
          for (const n of this.fields)
            if (
              (void 0 !== n.property && (r[n.property] = n.decode(t, e)),
              (e += n.getSpan(t, e)),
              this.decodePrefixes && t.length === e)
            )
              break;
          return r;
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = r;
          let i = 0,
            o = 0;
          for (const n of this.fields) {
            let s = n.span;
            if (((o = 0 < s ? s : 0), void 0 !== n.property)) {
              const i = t[n.property];
              void 0 !== i &&
                ((o = n.encode(i, e, r)), 0 > s && (s = n.getSpan(e, r)));
            }
            (i = r), (r += s);
          }
          return i + o - n;
        }
        fromArray(t) {
          const e = this.makeDestinationObject();
          for (const r of this.fields)
            void 0 !== r.property &&
              0 < t.length &&
              (e[r.property] = t.shift());
          return e;
        }
        layoutFor(t) {
          if ("string" != typeof t)
            throw new TypeError("property must be string");
          for (const e of this.fields) if (e.property === t) return e;
        }
        offsetOf(t) {
          if ("string" != typeof t)
            throw new TypeError("property must be string");
          let e = 0;
          for (const r of this.fields) {
            if (r.property === t) return e;
            0 > r.span ? (e = -1) : 0 <= e && (e += r.span);
          }
        }
      }
      class A {
        constructor(t) {
          this.property = t;
        }
        decode() {
          throw new Error("UnionDiscriminator is abstract");
        }
        encode() {
          throw new Error("UnionDiscriminator is abstract");
        }
      }
      class x extends A {
        constructor(t, e) {
          if (!(t instanceof i && t.isCount()))
            throw new TypeError(
              "layout must be an unsigned integer ExternalLayout"
            );
          super(e || t.property || "variant"), (this.layout = t);
        }
        decode(t, e) {
          return this.layout.decode(t, e);
        }
        encode(t, e, r) {
          return this.layout.encode(t, e, r);
        }
      }
      class S extends r {
        constructor(t, e, n) {
          const o = t instanceof a || t instanceof c;
          if (o) t = new x(new s(t));
          else if (t instanceof i && t.isCount()) t = new x(t);
          else if (!(t instanceof A))
            throw new TypeError(
              "discr must be a UnionDiscriminator or an unsigned integer layout"
            );
          if ((void 0 === e && (e = null), !(null === e || e instanceof r)))
            throw new TypeError("defaultLayout must be null or a Layout");
          if (null !== e) {
            if (0 > e.span)
              throw new Error("defaultLayout must have constant span");
            void 0 === e.property && (e = e.replicate("content"));
          }
          let u = -1;
          e && ((u = e.span), 0 <= u && o && (u += t.layout.span)),
            super(u, n),
            (this.discriminator = t),
            (this.usesPrefixDiscriminator = o),
            (this.defaultLayout = e),
            (this.registry = {});
          let l = this.defaultGetSourceVariant.bind(this);
          (this.getSourceVariant = function (t) {
            return l(t);
          }),
            (this.configGetSourceVariant = function (t) {
              l = t.bind(this);
            });
        }
        getSpan(t, e) {
          if (0 <= this.span) return this.span;
          void 0 === e && (e = 0);
          const r = this.getVariant(t, e);
          if (!r)
            throw new Error(
              "unable to determine span for unrecognized variant"
            );
          return r.getSpan(t, e);
        }
        defaultGetSourceVariant(t) {
          if (t.hasOwnProperty(this.discriminator.property)) {
            if (
              this.defaultLayout &&
              t.hasOwnProperty(this.defaultLayout.property)
            )
              return;
            const e = this.registry[t[this.discriminator.property]];
            if (e && (!e.layout || t.hasOwnProperty(e.property))) return e;
          } else
            for (const e in this.registry) {
              const r = this.registry[e];
              if (t.hasOwnProperty(r.property)) return r;
            }
          throw new Error("unable to infer src variant");
        }
        decode(t, e) {
          let r;
          void 0 === e && (e = 0);
          const n = this.discriminator,
            i = n.decode(t, e);
          let o = this.registry[i];
          if (void 0 === o) {
            let s = 0;
            (o = this.defaultLayout),
              this.usesPrefixDiscriminator && (s = n.layout.span),
              (r = this.makeDestinationObject()),
              (r[n.property] = i),
              (r[o.property] = this.defaultLayout.decode(t, e + s));
          } else r = o.decode(t, e);
          return r;
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = this.getSourceVariant(t);
          if (void 0 === n) {
            const n = this.discriminator,
              i = this.defaultLayout;
            let o = 0;
            return (
              this.usesPrefixDiscriminator && (o = n.layout.span),
              n.encode(t[n.property], e, r),
              o + i.encode(t[i.property], e, r + o)
            );
          }
          return n.encode(t, e, r);
        }
        addVariant(t, e, r) {
          const n = new I(this, t, e, r);
          return (this.registry[t] = n), n;
        }
        getVariant(t, e) {
          let r = t;
          return (
            Buffer.isBuffer(t) &&
              (void 0 === e && (e = 0), (r = this.discriminator.decode(t, e))),
            this.registry[r]
          );
        }
      }
      class I extends r {
        constructor(t, e, n, i) {
          if (!(t instanceof S)) throw new TypeError("union must be a Union");
          if (!Number.isInteger(e) || 0 > e)
            throw new TypeError("variant must be a (non-negative) integer");
          if (
            ("string" == typeof n && void 0 === i && ((i = n), (n = null)), n)
          ) {
            if (!(n instanceof r))
              throw new TypeError("layout must be a Layout");
            if (
              null !== t.defaultLayout &&
              0 <= n.span &&
              n.span > t.defaultLayout.span
            )
              throw new Error("variant span exceeds span of containing union");
            if ("string" != typeof i)
              throw new TypeError("variant must have a String property");
          }
          let o = t.span;
          0 > t.span &&
            ((o = n ? n.span : 0),
            0 <= o &&
              t.usesPrefixDiscriminator &&
              (o += t.discriminator.layout.span)),
            super(o, i),
            (this.union = t),
            (this.variant = e),
            (this.layout = n || null);
        }
        getSpan(t, e) {
          if (0 <= this.span) return this.span;
          void 0 === e && (e = 0);
          let r = 0;
          return (
            this.union.usesPrefixDiscriminator &&
              (r = this.union.discriminator.layout.span),
            r + this.layout.getSpan(t, e + r)
          );
        }
        decode(t, e) {
          const r = this.makeDestinationObject();
          if ((void 0 === e && (e = 0), this !== this.union.getVariant(t, e)))
            throw new Error("variant mismatch");
          let n = 0;
          return (
            this.union.usesPrefixDiscriminator &&
              (n = this.union.discriminator.layout.span),
            this.layout
              ? (r[this.property] = this.layout.decode(t, e + n))
              : this.property
              ? (r[this.property] = !0)
              : this.union.usesPrefixDiscriminator &&
                (r[this.union.discriminator.property] = this.variant),
            r
          );
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          let n = 0;
          if (
            (this.union.usesPrefixDiscriminator &&
              (n = this.union.discriminator.layout.span),
            this.layout && !t.hasOwnProperty(this.property))
          )
            throw new TypeError("variant lacks property " + this.property);
          this.union.discriminator.encode(this.variant, e, r);
          let i = n;
          if (
            this.layout &&
            (this.layout.encode(t[this.property], e, r + n),
            (i += this.layout.getSpan(e, r + n)),
            0 <= this.union.span && i > this.union.span)
          )
            throw new Error("encoded variant overruns containing union");
          return i;
        }
        fromArray(t) {
          if (this.layout) return this.layout.fromArray(t);
        }
      }
      function C(t) {
        return 0 > t && (t += 4294967296), t;
      }
      class R extends r {
        constructor(t, e, r) {
          if (!(t instanceof a || t instanceof c))
            throw new TypeError("word must be a UInt or UIntBE layout");
          if (
            ("string" == typeof e && void 0 === r && ((r = e), (e = void 0)),
            4 < t.span)
          )
            throw new RangeError("word cannot exceed 32 bits");
          super(t.span, r),
            (this.word = t),
            (this.msb = !!e),
            (this.fields = []);
          let n = 0;
          (this._packedSetValue = function (t) {
            return (n = C(t)), this;
          }),
            (this._packedGetValue = function () {
              return n;
            });
        }
        decode(t, e) {
          const r = this.makeDestinationObject();
          void 0 === e && (e = 0);
          const n = this.word.decode(t, e);
          this._packedSetValue(n);
          for (const t of this.fields)
            void 0 !== t.property && (r[t.property] = t.decode(n));
          return r;
        }
        encode(t, e, r) {
          void 0 === r && (r = 0);
          const n = this.word.decode(e, r);
          this._packedSetValue(n);
          for (const e of this.fields)
            if (void 0 !== e.property) {
              const r = t[e.property];
              void 0 !== r && e.encode(r);
            }
          return this.word.encode(this._packedGetValue(), e, r);
        }
        addField(t, e) {
          const r = new B(this, t, e);
          return this.fields.push(r), r;
        }
        addBoolean(t) {
          const e = new T(this, t);
          return this.fields.push(e), e;
        }
        fieldFor(t) {
          if ("string" != typeof t)
            throw new TypeError("property must be string");
          for (const e of this.fields) if (e.property === t) return e;
        }
      }
      class B {
        constructor(t, e, r) {
          if (!(t instanceof R))
            throw new TypeError("container must be a BitStructure");
          if (!Number.isInteger(e) || 0 >= e)
            throw new TypeError("bits must be positive integer");
          const n = 8 * t.span,
            i = t.fields.reduce((t, e) => t + e.bits, 0);
          if (e + i > n)
            throw new Error(
              "bits too long for span remainder (" +
                (n - i) +
                " of " +
                n +
                " remain)"
            );
          (this.container = t),
            (this.bits = e),
            (this.valueMask = (1 << e) - 1),
            32 === e && (this.valueMask = 4294967295),
            (this.start = i),
            this.container.msb && (this.start = n - i - e),
            (this.wordMask = C(this.valueMask << this.start)),
            (this.property = r);
        }
        decode() {
          return (
            C(this.container._packedGetValue() & this.wordMask) >>> this.start
          );
        }
        encode(t) {
          if (!Number.isInteger(t) || t !== C(t & this.valueMask))
            throw new TypeError(
              n("BitField.encode", this) +
                " value must be integer not exceeding " +
                this.valueMask
            );
          const e = this.container._packedGetValue(),
            r = C(t << this.start);
          this.container._packedSetValue(C(e & ~this.wordMask) | r);
        }
      }
      class T extends B {
        constructor(t, e) {
          super(t, 1, e);
        }
        decode(t, e) {
          return !!B.prototype.decode.call(this, t, e);
        }
        encode(t) {
          return (
            "boolean" == typeof t && (t = +t), B.prototype.encode.call(this, t)
          );
        }
      }
      class L extends r {
        constructor(t, e) {
          if (
            !(
              (t instanceof i && t.isCount()) ||
              (Number.isInteger(t) && 0 <= t)
            )
          )
            throw new TypeError(
              "length must be positive integer or an unsigned integer ExternalLayout"
            );
          let r = -1;
          t instanceof i || (r = t), super(r, e), (this.length = t);
        }
        getSpan(t, e) {
          let r = this.span;
          return 0 > r && (r = this.length.decode(t, e)), r;
        }
        decode(t, e) {
          void 0 === e && (e = 0);
          let r = this.span;
          return 0 > r && (r = this.length.decode(t, e)), t.slice(e, e + r);
        }
        encode(t, e, r) {
          let o = this.length;
          if (
            (this.length instanceof i && (o = t.length),
            !Buffer.isBuffer(t) || o !== t.length)
          )
            throw new TypeError(
              n("Blob.encode", this) +
                " requires (length " +
                o +
                ") Buffer as src"
            );
          if (r + o > e.length)
            throw new RangeError("encoding overruns Buffer");
          return (
            e.write(t.toString("hex"), r, o, "hex"),
            this.length instanceof i && this.length.encode(o, e, r),
            o
          );
        }
      }
      class O extends r {
        constructor(t) {
          super(-1, t);
        }
        getSpan(t, e) {
          if (!Buffer.isBuffer(t)) throw new TypeError("b must be a Buffer");
          void 0 === e && (e = 0);
          let r = e;
          for (; r < t.length && 0 !== t[r]; ) r += 1;
          return 1 + r - e;
        }
        decode(t, e, r) {
          void 0 === e && (e = 0);
          let n = this.getSpan(t, e);
          return t.slice(e, e + n - 1).toString("utf-8");
        }
        encode(t, e, r) {
          void 0 === r && (r = 0), "string" != typeof t && (t = t.toString());
          const n = new Buffer(t, "utf8"),
            i = n.length;
          if (r + i > e.length)
            throw new RangeError("encoding overruns Buffer");
          return n.copy(e, r), (e[r + i] = 0), i + 1;
        }
      }
      class P extends r {
        constructor(t, e) {
          if (
            ("string" == typeof t && void 0 === e && ((e = t), (t = void 0)),
            void 0 === t)
          )
            t = -1;
          else if (!Number.isInteger(t))
            throw new TypeError("maxSpan must be an integer");
          super(-1, e), (this.maxSpan = t);
        }
        getSpan(t, e) {
          if (!Buffer.isBuffer(t)) throw new TypeError("b must be a Buffer");
          return void 0 === e && (e = 0), t.length - e;
        }
        decode(t, e, r) {
          void 0 === e && (e = 0);
          let n = this.getSpan(t, e);
          if (0 <= this.maxSpan && this.maxSpan < n)
            throw new RangeError("text length exceeds maxSpan");
          return t.slice(e, e + n).toString("utf-8");
        }
        encode(t, e, r) {
          void 0 === r && (r = 0), "string" != typeof t && (t = t.toString());
          const n = new Buffer(t, "utf8"),
            i = n.length;
          if (0 <= this.maxSpan && this.maxSpan < i)
            throw new RangeError("text length exceeds maxSpan");
          if (r + i > e.length)
            throw new RangeError("encoding overruns Buffer");
          return n.copy(e, r), i;
        }
      }
      class z extends r {
        constructor(t, e) {
          super(0, e), (this.value = t);
        }
        decode(t, e, r) {
          return this.value;
        }
        encode(t, e, r) {
          return 0;
        }
      }
      (e.ExternalLayout = i),
        (e.GreedyCount = o),
        (e.OffsetLayout = s),
        (e.UInt = a),
        (e.UIntBE = c),
        (e.Int = u),
        (e.IntBE = l),
        (e.Float = y),
        (e.FloatBE = g),
        (e.Double = b),
        (e.DoubleBE = v),
        (e.Sequence = E),
        (e.Structure = k),
        (e.UnionDiscriminator = A),
        (e.UnionLayoutDiscriminator = x),
        (e.Union = S),
        (e.VariantLayout = I),
        (e.BitStructure = R),
        (e.BitField = B),
        (e.Boolean = T),
        (e.Blob = L),
        (e.CString = O),
        (e.UTF8 = P),
        (e.Constant = z),
        (e.greedy = (t, e) => new o(t, e)),
        (e.offset = (t, e, r) => new s(t, e, r)),
        (e.u8 = (t) => new a(1, t)),
        (e.u16 = (t) => new a(2, t)),
        (e.u24 = (t) => new a(3, t)),
        (e.u32 = (t) => new a(4, t)),
        (e.u40 = (t) => new a(5, t)),
        (e.u48 = (t) => new a(6, t)),
        (e.nu64 = (t) => new p(t)),
        (e.u16be = (t) => new c(2, t)),
        (e.u24be = (t) => new c(3, t)),
        (e.u32be = (t) => new c(4, t)),
        (e.u40be = (t) => new c(5, t)),
        (e.u48be = (t) => new c(6, t)),
        (e.nu64be = (t) => new _(t)),
        (e.s8 = (t) => new u(1, t)),
        (e.s16 = (t) => new u(2, t)),
        (e.s24 = (t) => new u(3, t)),
        (e.s32 = (t) => new u(4, t)),
        (e.s40 = (t) => new u(5, t)),
        (e.s48 = (t) => new u(6, t)),
        (e.ns64 = (t) => new m(t)),
        (e.s16be = (t) => new l(2, t)),
        (e.s24be = (t) => new l(3, t)),
        (e.s32be = (t) => new l(4, t)),
        (e.s40be = (t) => new l(5, t)),
        (e.s48be = (t) => new l(6, t)),
        (e.ns64be = (t) => new w(t)),
        (e.f32 = (t) => new y(t)),
        (e.f32be = (t) => new g(t)),
        (e.f64 = (t) => new b(t)),
        (e.f64be = (t) => new v(t)),
        (e.struct = (t, e, r) => new k(t, e, r)),
        (e.bits = (t, e, r) => new R(t, e, r)),
        (e.seq = (t, e, r) => new E(t, e, r)),
        (e.union = (t, e, r) => new S(t, e, r)),
        (e.unionLayoutDiscriminator = (t, e) => new x(t, e)),
        (e.blob = (t, e) => new L(t, e)),
        (e.cstr = (t) => new O(t)),
        (e.utf8 = (t, e) => new P(t, e)),
        (e.const = (t, e) => new z(t, e));
    },
    204: (t) => {
      const e = (t, e) => {
        if ("string" != typeof t && !Array.isArray(t))
          throw new TypeError("Expected the input to be `string | string[]`");
        return (
          (e = Object.assign({ pascalCase: !1 }, e)),
          (t = Array.isArray(t)
            ? t
                .map((t) => t.trim())
                .filter((t) => t.length)
                .join("-")
            : t.trim()),
          0 === t.length
            ? ""
            : 1 === t.length
            ? e.pascalCase
              ? t.toUpperCase()
              : t.toLowerCase()
            : (t !== t.toLowerCase() &&
                (t = ((t) => {
                  let e = !1,
                    r = !1,
                    n = !1;
                  for (let i = 0; i < t.length; i++) {
                    const o = t[i];
                    e && /[a-zA-Z]/.test(o) && o.toUpperCase() === o
                      ? ((t = t.slice(0, i) + "-" + t.slice(i)),
                        (e = !1),
                        (n = r),
                        (r = !0),
                        i++)
                      : r && n && /[a-zA-Z]/.test(o) && o.toLowerCase() === o
                      ? ((t = t.slice(0, i - 1) + "-" + t.slice(i - 1)),
                        (n = r),
                        (r = !1),
                        (e = !0))
                      : ((e = o.toLowerCase() === o && o.toUpperCase() !== o),
                        (n = r),
                        (r = o.toUpperCase() === o && o.toLowerCase() !== o));
                  }
                  return t;
                })(t)),
              (r = t =
                t
                  .replace(/^[_.\- ]+/, "")
                  .toLowerCase()
                  .replace(/[_.\- ]+(\w|$)/g, (t, e) => e.toUpperCase())
                  .replace(/\d+(\w|$)/g, (t) => t.toUpperCase())),
              e.pascalCase ? r.charAt(0).toUpperCase() + r.slice(1) : r)
        );
        var r;
      };
      (t.exports = e), (t.exports.default = e);
    },
    729: (t) => {
      var e = Object.prototype.hasOwnProperty,
        r = "~";
      function n() {}
      function i(t, e, r) {
        (this.fn = t), (this.context = e), (this.once = r || !1);
      }
      function o(t, e, n, o, s) {
        if ("function" != typeof n)
          throw new TypeError("The listener must be a function");
        var a = new i(n, o || t, s),
          c = r ? r + e : e;
        return (
          t._events[c]
            ? t._events[c].fn
              ? (t._events[c] = [t._events[c], a])
              : t._events[c].push(a)
            : ((t._events[c] = a), t._eventsCount++),
          t
        );
      }
      function s(t, e) {
        0 == --t._eventsCount ? (t._events = new n()) : delete t._events[e];
      }
      function a() {
        (this._events = new n()), (this._eventsCount = 0);
      }
      Object.create &&
        ((n.prototype = Object.create(null)), new n().__proto__ || (r = !1)),
        (a.prototype.eventNames = function () {
          var t,
            n,
            i = [];
          if (0 === this._eventsCount) return i;
          for (n in (t = this._events))
            e.call(t, n) && i.push(r ? n.slice(1) : n);
          return Object.getOwnPropertySymbols
            ? i.concat(Object.getOwnPropertySymbols(t))
            : i;
        }),
        (a.prototype.listeners = function (t) {
          var e = r ? r + t : t,
            n = this._events[e];
          if (!n) return [];
          if (n.fn) return [n.fn];
          for (var i = 0, o = n.length, s = new Array(o); i < o; i++)
            s[i] = n[i].fn;
          return s;
        }),
        (a.prototype.listenerCount = function (t) {
          var e = r ? r + t : t,
            n = this._events[e];
          return n ? (n.fn ? 1 : n.length) : 0;
        }),
        (a.prototype.emit = function (t, e, n, i, o, s) {
          var a = r ? r + t : t;
          if (!this._events[a]) return !1;
          var c,
            u,
            l = this._events[a],
            h = arguments.length;
          if (l.fn) {
            switch ((l.once && this.removeListener(t, l.fn, void 0, !0), h)) {
              case 1:
                return l.fn.call(l.context), !0;
              case 2:
                return l.fn.call(l.context, e), !0;
              case 3:
                return l.fn.call(l.context, e, n), !0;
              case 4:
                return l.fn.call(l.context, e, n, i), !0;
              case 5:
                return l.fn.call(l.context, e, n, i, o), !0;
              case 6:
                return l.fn.call(l.context, e, n, i, o, s), !0;
            }
            for (u = 1, c = new Array(h - 1); u < h; u++)
              c[u - 1] = arguments[u];
            l.fn.apply(l.context, c);
          } else {
            var d,
              f = l.length;
            for (u = 0; u < f; u++)
              switch (
                (l[u].once && this.removeListener(t, l[u].fn, void 0, !0), h)
              ) {
                case 1:
                  l[u].fn.call(l[u].context);
                  break;
                case 2:
                  l[u].fn.call(l[u].context, e);
                  break;
                case 3:
                  l[u].fn.call(l[u].context, e, n);
                  break;
                case 4:
                  l[u].fn.call(l[u].context, e, n, i);
                  break;
                default:
                  if (!c)
                    for (d = 1, c = new Array(h - 1); d < h; d++)
                      c[d - 1] = arguments[d];
                  l[u].fn.apply(l[u].context, c);
              }
          }
          return !0;
        }),
        (a.prototype.on = function (t, e, r) {
          return o(this, t, e, r, !1);
        }),
        (a.prototype.once = function (t, e, r) {
          return o(this, t, e, r, !0);
        }),
        (a.prototype.removeListener = function (t, e, n, i) {
          var o = r ? r + t : t;
          if (!this._events[o]) return this;
          if (!e) return s(this, o), this;
          var a = this._events[o];
          if (a.fn)
            a.fn !== e ||
              (i && !a.once) ||
              (n && a.context !== n) ||
              s(this, o);
          else {
            for (var c = 0, u = [], l = a.length; c < l; c++)
              (a[c].fn !== e ||
                (i && !a[c].once) ||
                (n && a[c].context !== n)) &&
                u.push(a[c]);
            u.length
              ? (this._events[o] = 1 === u.length ? u[0] : u)
              : s(this, o);
          }
          return this;
        }),
        (a.prototype.removeAllListeners = function (t) {
          var e;
          return (
            t
              ? ((e = r ? r + t : t), this._events[e] && s(this, e))
              : ((this._events = new n()), (this._eventsCount = 0)),
            this
          );
        }),
        (a.prototype.off = a.prototype.removeListener),
        (a.prototype.addListener = a.prototype.on),
        (a.prefixed = r),
        (a.EventEmitter = a),
        (t.exports = a);
    },
    23: (module, exports, __webpack_require__) => {
      var __WEBPACK_AMD_DEFINE_RESULT__;
      (function () {
        var ERROR = "input is invalid type",
          WINDOW = "object" == typeof window,
          root = WINDOW ? window : {};
        root.JS_SHA256_NO_WINDOW && (WINDOW = !1);
        var WEB_WORKER = !WINDOW && "object" == typeof self,
          NODE_JS =
            !root.JS_SHA256_NO_NODE_JS &&
            "object" == typeof process &&
            process.versions &&
            process.versions.node;
        NODE_JS ? (root = __webpack_require__.g) : WEB_WORKER && (root = self);
        var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && module.exports,
          AMD = __webpack_require__.amdO,
          ARRAY_BUFFER =
            !root.JS_SHA256_NO_ARRAY_BUFFER &&
            "undefined" != typeof ArrayBuffer,
          HEX_CHARS = "0123456789abcdef".split(""),
          EXTRA = [-2147483648, 8388608, 32768, 128],
          SHIFT = [24, 16, 8, 0],
          K = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
          ],
          OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"],
          blocks = [];
        (!root.JS_SHA256_NO_NODE_JS && Array.isArray) ||
          (Array.isArray = function (t) {
            return "[object Array]" === Object.prototype.toString.call(t);
          }),
          !ARRAY_BUFFER ||
            (!root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
            (ArrayBuffer.isView = function (t) {
              return (
                "object" == typeof t &&
                t.buffer &&
                t.buffer.constructor === ArrayBuffer
              );
            });
        var createOutputMethod = function (t, e) {
            return function (r) {
              return new Sha256(e, !0).update(r)[t]();
            };
          },
          createMethod = function (t) {
            var e = createOutputMethod("hex", t);
            NODE_JS && (e = nodeWrap(e, t)),
              (e.create = function () {
                return new Sha256(t);
              }),
              (e.update = function (t) {
                return e.create().update(t);
              });
            for (var r = 0; r < OUTPUT_TYPES.length; ++r) {
              var n = OUTPUT_TYPES[r];
              e[n] = createOutputMethod(n, t);
            }
            return e;
          },
          nodeWrap = function (method, is224) {
            var crypto = eval("require('crypto')"),
              Buffer = eval("require('buffer').Buffer"),
              algorithm = is224 ? "sha224" : "sha256",
              nodeMethod = function (t) {
                if ("string" == typeof t)
                  return crypto
                    .createHash(algorithm)
                    .update(t, "utf8")
                    .digest("hex");
                if (null == t) throw new Error(ERROR);
                return (
                  t.constructor === ArrayBuffer && (t = new Uint8Array(t)),
                  Array.isArray(t) ||
                  ArrayBuffer.isView(t) ||
                  t.constructor === Buffer
                    ? crypto
                        .createHash(algorithm)
                        .update(new Buffer(t))
                        .digest("hex")
                    : method(t)
                );
              };
            return nodeMethod;
          },
          createHmacOutputMethod = function (t, e) {
            return function (r, n) {
              return new HmacSha256(r, e, !0).update(n)[t]();
            };
          },
          createHmacMethod = function (t) {
            var e = createHmacOutputMethod("hex", t);
            (e.create = function (e) {
              return new HmacSha256(e, t);
            }),
              (e.update = function (t, r) {
                return e.create(t).update(r);
              });
            for (var r = 0; r < OUTPUT_TYPES.length; ++r) {
              var n = OUTPUT_TYPES[r];
              e[n] = createHmacOutputMethod(n, t);
            }
            return e;
          };
        function Sha256(t, e) {
          e
            ? ((blocks[0] =
                blocks[16] =
                blocks[1] =
                blocks[2] =
                blocks[3] =
                blocks[4] =
                blocks[5] =
                blocks[6] =
                blocks[7] =
                blocks[8] =
                blocks[9] =
                blocks[10] =
                blocks[11] =
                blocks[12] =
                blocks[13] =
                blocks[14] =
                blocks[15] =
                  0),
              (this.blocks = blocks))
            : (this.blocks = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ]),
            t
              ? ((this.h0 = 3238371032),
                (this.h1 = 914150663),
                (this.h2 = 812702999),
                (this.h3 = 4144912697),
                (this.h4 = 4290775857),
                (this.h5 = 1750603025),
                (this.h6 = 1694076839),
                (this.h7 = 3204075428))
              : ((this.h0 = 1779033703),
                (this.h1 = 3144134277),
                (this.h2 = 1013904242),
                (this.h3 = 2773480762),
                (this.h4 = 1359893119),
                (this.h5 = 2600822924),
                (this.h6 = 528734635),
                (this.h7 = 1541459225)),
            (this.block = this.start = this.bytes = this.hBytes = 0),
            (this.finalized = this.hashed = !1),
            (this.first = !0),
            (this.is224 = t);
        }
        function HmacSha256(t, e, r) {
          var n,
            i = typeof t;
          if ("string" === i) {
            var o,
              s = [],
              a = t.length,
              c = 0;
            for (n = 0; n < a; ++n)
              (o = t.charCodeAt(n)) < 128
                ? (s[c++] = o)
                : o < 2048
                ? ((s[c++] = 192 | (o >> 6)), (s[c++] = 128 | (63 & o)))
                : o < 55296 || o >= 57344
                ? ((s[c++] = 224 | (o >> 12)),
                  (s[c++] = 128 | ((o >> 6) & 63)),
                  (s[c++] = 128 | (63 & o)))
                : ((o =
                    65536 + (((1023 & o) << 10) | (1023 & t.charCodeAt(++n)))),
                  (s[c++] = 240 | (o >> 18)),
                  (s[c++] = 128 | ((o >> 12) & 63)),
                  (s[c++] = 128 | ((o >> 6) & 63)),
                  (s[c++] = 128 | (63 & o)));
            t = s;
          } else {
            if ("object" !== i) throw new Error(ERROR);
            if (null === t) throw new Error(ERROR);
            if (ARRAY_BUFFER && t.constructor === ArrayBuffer)
              t = new Uint8Array(t);
            else if (
              !(Array.isArray(t) || (ARRAY_BUFFER && ArrayBuffer.isView(t)))
            )
              throw new Error(ERROR);
          }
          t.length > 64 && (t = new Sha256(e, !0).update(t).array());
          var u = [],
            l = [];
          for (n = 0; n < 64; ++n) {
            var h = t[n] || 0;
            (u[n] = 92 ^ h), (l[n] = 54 ^ h);
          }
          Sha256.call(this, e, r),
            this.update(l),
            (this.oKeyPad = u),
            (this.inner = !0),
            (this.sharedMemory = r);
        }
        (Sha256.prototype.update = function (t) {
          if (!this.finalized) {
            var e,
              r = typeof t;
            if ("string" !== r) {
              if ("object" !== r) throw new Error(ERROR);
              if (null === t) throw new Error(ERROR);
              if (ARRAY_BUFFER && t.constructor === ArrayBuffer)
                t = new Uint8Array(t);
              else if (
                !(Array.isArray(t) || (ARRAY_BUFFER && ArrayBuffer.isView(t)))
              )
                throw new Error(ERROR);
              e = !0;
            }
            for (var n, i, o = 0, s = t.length, a = this.blocks; o < s; ) {
              if (
                (this.hashed &&
                  ((this.hashed = !1),
                  (a[0] = this.block),
                  (a[16] =
                    a[1] =
                    a[2] =
                    a[3] =
                    a[4] =
                    a[5] =
                    a[6] =
                    a[7] =
                    a[8] =
                    a[9] =
                    a[10] =
                    a[11] =
                    a[12] =
                    a[13] =
                    a[14] =
                    a[15] =
                      0)),
                e)
              )
                for (i = this.start; o < s && i < 64; ++o)
                  a[i >> 2] |= t[o] << SHIFT[3 & i++];
              else
                for (i = this.start; o < s && i < 64; ++o)
                  (n = t.charCodeAt(o)) < 128
                    ? (a[i >> 2] |= n << SHIFT[3 & i++])
                    : n < 2048
                    ? ((a[i >> 2] |= (192 | (n >> 6)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | (63 & n)) << SHIFT[3 & i++]))
                    : n < 55296 || n >= 57344
                    ? ((a[i >> 2] |= (224 | (n >> 12)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | ((n >> 6) & 63)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | (63 & n)) << SHIFT[3 & i++]))
                    : ((n =
                        65536 +
                        (((1023 & n) << 10) | (1023 & t.charCodeAt(++o)))),
                      (a[i >> 2] |= (240 | (n >> 18)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | ((n >> 12) & 63)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | ((n >> 6) & 63)) << SHIFT[3 & i++]),
                      (a[i >> 2] |= (128 | (63 & n)) << SHIFT[3 & i++]));
              (this.lastByteIndex = i),
                (this.bytes += i - this.start),
                i >= 64
                  ? ((this.block = a[16]),
                    (this.start = i - 64),
                    this.hash(),
                    (this.hashed = !0))
                  : (this.start = i);
            }
            return (
              this.bytes > 4294967295 &&
                ((this.hBytes += (this.bytes / 4294967296) << 0),
                (this.bytes = this.bytes % 4294967296)),
              this
            );
          }
        }),
          (Sha256.prototype.finalize = function () {
            if (!this.finalized) {
              this.finalized = !0;
              var t = this.blocks,
                e = this.lastByteIndex;
              (t[16] = this.block),
                (t[e >> 2] |= EXTRA[3 & e]),
                (this.block = t[16]),
                e >= 56 &&
                  (this.hashed || this.hash(),
                  (t[0] = this.block),
                  (t[16] =
                    t[1] =
                    t[2] =
                    t[3] =
                    t[4] =
                    t[5] =
                    t[6] =
                    t[7] =
                    t[8] =
                    t[9] =
                    t[10] =
                    t[11] =
                    t[12] =
                    t[13] =
                    t[14] =
                    t[15] =
                      0)),
                (t[14] = (this.hBytes << 3) | (this.bytes >>> 29)),
                (t[15] = this.bytes << 3),
                this.hash();
            }
          }),
          (Sha256.prototype.hash = function () {
            var t,
              e,
              r,
              n,
              i,
              o,
              s,
              a,
              c,
              u = this.h0,
              l = this.h1,
              h = this.h2,
              d = this.h3,
              f = this.h4,
              p = this.h5,
              _ = this.h6,
              m = this.h7,
              w = this.blocks;
            for (t = 16; t < 64; ++t)
              (e =
                (((i = w[t - 15]) >>> 7) | (i << 25)) ^
                ((i >>> 18) | (i << 14)) ^
                (i >>> 3)),
                (r =
                  (((i = w[t - 2]) >>> 17) | (i << 15)) ^
                  ((i >>> 19) | (i << 13)) ^
                  (i >>> 10)),
                (w[t] = (w[t - 16] + e + w[t - 7] + r) << 0);
            for (c = l & h, t = 0; t < 64; t += 4)
              this.first
                ? (this.is224
                    ? ((o = 300032),
                      (m = ((i = w[0] - 1413257819) - 150054599) << 0),
                      (d = (i + 24177077) << 0))
                    : ((o = 704751109),
                      (m = ((i = w[0] - 210244248) - 1521486534) << 0),
                      (d = (i + 143694565) << 0)),
                  (this.first = !1))
                : ((e =
                    ((u >>> 2) | (u << 30)) ^
                    ((u >>> 13) | (u << 19)) ^
                    ((u >>> 22) | (u << 10))),
                  (n = (o = u & l) ^ (u & h) ^ c),
                  (m =
                    (d +
                      (i =
                        m +
                        (r =
                          ((f >>> 6) | (f << 26)) ^
                          ((f >>> 11) | (f << 21)) ^
                          ((f >>> 25) | (f << 7))) +
                        ((f & p) ^ (~f & _)) +
                        K[t] +
                        w[t])) <<
                    0),
                  (d = (i + (e + n)) << 0)),
                (e =
                  ((d >>> 2) | (d << 30)) ^
                  ((d >>> 13) | (d << 19)) ^
                  ((d >>> 22) | (d << 10))),
                (n = (s = d & u) ^ (d & l) ^ o),
                (_ =
                  (h +
                    (i =
                      _ +
                      (r =
                        ((m >>> 6) | (m << 26)) ^
                        ((m >>> 11) | (m << 21)) ^
                        ((m >>> 25) | (m << 7))) +
                      ((m & f) ^ (~m & p)) +
                      K[t + 1] +
                      w[t + 1])) <<
                  0),
                (e =
                  (((h = (i + (e + n)) << 0) >>> 2) | (h << 30)) ^
                  ((h >>> 13) | (h << 19)) ^
                  ((h >>> 22) | (h << 10))),
                (n = (a = h & d) ^ (h & u) ^ s),
                (p =
                  (l +
                    (i =
                      p +
                      (r =
                        ((_ >>> 6) | (_ << 26)) ^
                        ((_ >>> 11) | (_ << 21)) ^
                        ((_ >>> 25) | (_ << 7))) +
                      ((_ & m) ^ (~_ & f)) +
                      K[t + 2] +
                      w[t + 2])) <<
                  0),
                (e =
                  (((l = (i + (e + n)) << 0) >>> 2) | (l << 30)) ^
                  ((l >>> 13) | (l << 19)) ^
                  ((l >>> 22) | (l << 10))),
                (n = (c = l & h) ^ (l & d) ^ a),
                (f =
                  (u +
                    (i =
                      f +
                      (r =
                        ((p >>> 6) | (p << 26)) ^
                        ((p >>> 11) | (p << 21)) ^
                        ((p >>> 25) | (p << 7))) +
                      ((p & _) ^ (~p & m)) +
                      K[t + 3] +
                      w[t + 3])) <<
                  0),
                (u = (i + (e + n)) << 0);
            (this.h0 = (this.h0 + u) << 0),
              (this.h1 = (this.h1 + l) << 0),
              (this.h2 = (this.h2 + h) << 0),
              (this.h3 = (this.h3 + d) << 0),
              (this.h4 = (this.h4 + f) << 0),
              (this.h5 = (this.h5 + p) << 0),
              (this.h6 = (this.h6 + _) << 0),
              (this.h7 = (this.h7 + m) << 0);
          }),
          (Sha256.prototype.hex = function () {
            this.finalize();
            var t = this.h0,
              e = this.h1,
              r = this.h2,
              n = this.h3,
              i = this.h4,
              o = this.h5,
              s = this.h6,
              a = this.h7,
              c =
                HEX_CHARS[(t >> 28) & 15] +
                HEX_CHARS[(t >> 24) & 15] +
                HEX_CHARS[(t >> 20) & 15] +
                HEX_CHARS[(t >> 16) & 15] +
                HEX_CHARS[(t >> 12) & 15] +
                HEX_CHARS[(t >> 8) & 15] +
                HEX_CHARS[(t >> 4) & 15] +
                HEX_CHARS[15 & t] +
                HEX_CHARS[(e >> 28) & 15] +
                HEX_CHARS[(e >> 24) & 15] +
                HEX_CHARS[(e >> 20) & 15] +
                HEX_CHARS[(e >> 16) & 15] +
                HEX_CHARS[(e >> 12) & 15] +
                HEX_CHARS[(e >> 8) & 15] +
                HEX_CHARS[(e >> 4) & 15] +
                HEX_CHARS[15 & e] +
                HEX_CHARS[(r >> 28) & 15] +
                HEX_CHARS[(r >> 24) & 15] +
                HEX_CHARS[(r >> 20) & 15] +
                HEX_CHARS[(r >> 16) & 15] +
                HEX_CHARS[(r >> 12) & 15] +
                HEX_CHARS[(r >> 8) & 15] +
                HEX_CHARS[(r >> 4) & 15] +
                HEX_CHARS[15 & r] +
                HEX_CHARS[(n >> 28) & 15] +
                HEX_CHARS[(n >> 24) & 15] +
                HEX_CHARS[(n >> 20) & 15] +
                HEX_CHARS[(n >> 16) & 15] +
                HEX_CHARS[(n >> 12) & 15] +
                HEX_CHARS[(n >> 8) & 15] +
                HEX_CHARS[(n >> 4) & 15] +
                HEX_CHARS[15 & n] +
                HEX_CHARS[(i >> 28) & 15] +
                HEX_CHARS[(i >> 24) & 15] +
                HEX_CHARS[(i >> 20) & 15] +
                HEX_CHARS[(i >> 16) & 15] +
                HEX_CHARS[(i >> 12) & 15] +
                HEX_CHARS[(i >> 8) & 15] +
                HEX_CHARS[(i >> 4) & 15] +
                HEX_CHARS[15 & i] +
                HEX_CHARS[(o >> 28) & 15] +
                HEX_CHARS[(o >> 24) & 15] +
                HEX_CHARS[(o >> 20) & 15] +
                HEX_CHARS[(o >> 16) & 15] +
                HEX_CHARS[(o >> 12) & 15] +
                HEX_CHARS[(o >> 8) & 15] +
                HEX_CHARS[(o >> 4) & 15] +
                HEX_CHARS[15 & o] +
                HEX_CHARS[(s >> 28) & 15] +
                HEX_CHARS[(s >> 24) & 15] +
                HEX_CHARS[(s >> 20) & 15] +
                HEX_CHARS[(s >> 16) & 15] +
                HEX_CHARS[(s >> 12) & 15] +
                HEX_CHARS[(s >> 8) & 15] +
                HEX_CHARS[(s >> 4) & 15] +
                HEX_CHARS[15 & s];
            return (
              this.is224 ||
                (c +=
                  HEX_CHARS[(a >> 28) & 15] +
                  HEX_CHARS[(a >> 24) & 15] +
                  HEX_CHARS[(a >> 20) & 15] +
                  HEX_CHARS[(a >> 16) & 15] +
                  HEX_CHARS[(a >> 12) & 15] +
                  HEX_CHARS[(a >> 8) & 15] +
                  HEX_CHARS[(a >> 4) & 15] +
                  HEX_CHARS[15 & a]),
              c
            );
          }),
          (Sha256.prototype.toString = Sha256.prototype.hex),
          (Sha256.prototype.digest = function () {
            this.finalize();
            var t = this.h0,
              e = this.h1,
              r = this.h2,
              n = this.h3,
              i = this.h4,
              o = this.h5,
              s = this.h6,
              a = this.h7,
              c = [
                (t >> 24) & 255,
                (t >> 16) & 255,
                (t >> 8) & 255,
                255 & t,
                (e >> 24) & 255,
                (e >> 16) & 255,
                (e >> 8) & 255,
                255 & e,
                (r >> 24) & 255,
                (r >> 16) & 255,
                (r >> 8) & 255,
                255 & r,
                (n >> 24) & 255,
                (n >> 16) & 255,
                (n >> 8) & 255,
                255 & n,
                (i >> 24) & 255,
                (i >> 16) & 255,
                (i >> 8) & 255,
                255 & i,
                (o >> 24) & 255,
                (o >> 16) & 255,
                (o >> 8) & 255,
                255 & o,
                (s >> 24) & 255,
                (s >> 16) & 255,
                (s >> 8) & 255,
                255 & s,
              ];
            return (
              this.is224 ||
                c.push(
                  (a >> 24) & 255,
                  (a >> 16) & 255,
                  (a >> 8) & 255,
                  255 & a
                ),
              c
            );
          }),
          (Sha256.prototype.array = Sha256.prototype.digest),
          (Sha256.prototype.arrayBuffer = function () {
            this.finalize();
            var t = new ArrayBuffer(this.is224 ? 28 : 32),
              e = new DataView(t);
            return (
              e.setUint32(0, this.h0),
              e.setUint32(4, this.h1),
              e.setUint32(8, this.h2),
              e.setUint32(12, this.h3),
              e.setUint32(16, this.h4),
              e.setUint32(20, this.h5),
              e.setUint32(24, this.h6),
              this.is224 || e.setUint32(28, this.h7),
              t
            );
          }),
          (HmacSha256.prototype = new Sha256()),
          (HmacSha256.prototype.finalize = function () {
            if ((Sha256.prototype.finalize.call(this), this.inner)) {
              this.inner = !1;
              var t = this.array();
              Sha256.call(this, this.is224, this.sharedMemory),
                this.update(this.oKeyPad),
                this.update(t),
                Sha256.prototype.finalize.call(this);
            }
          });
        var exports = createMethod();
        (exports.sha256 = exports),
          (exports.sha224 = createMethod(!0)),
          (exports.sha256.hmac = createHmacMethod()),
          (exports.sha224.hmac = createHmacMethod(!0)),
          COMMON_JS
            ? (module.exports = exports)
            : ((root.sha256 = exports.sha256),
              (root.sha224 = exports.sha224),
              AMD &&
                ((__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                  return exports;
                }.call(exports, __webpack_require__, exports, module)),
                void 0 === __WEBPACK_AMD_DEFINE_RESULT__ ||
                  (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
      })();
    },
    509: (t, e, r) => {
      var n = r(368),
        i = n.Buffer;
      function o(t, e) {
        for (var r in t) e[r] = t[r];
      }
      function s(t, e, r) {
        return i(t, e, r);
      }
      i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow
        ? (t.exports = n)
        : (o(n, e), (e.Buffer = s)),
        (s.prototype = Object.create(i.prototype)),
        o(i, s),
        (s.from = function (t, e, r) {
          if ("number" == typeof t)
            throw new TypeError("Argument must not be a number");
          return i(t, e, r);
        }),
        (s.alloc = function (t, e, r) {
          if ("number" != typeof t)
            throw new TypeError("Argument must be a number");
          var n = i(t);
          return (
            void 0 !== e
              ? "string" == typeof r
                ? n.fill(e, r)
                : n.fill(e)
              : n.fill(0),
            n
          );
        }),
        (s.allocUnsafe = function (t) {
          if ("number" != typeof t)
            throw new TypeError("Argument must be a number");
          return i(t);
        }),
        (s.allocUnsafeSlow = function (t) {
          if ("number" != typeof t)
            throw new TypeError("Argument must be a number");
          return n.SlowBuffer(t);
        });
    },
    329: (t) => {
      t.exports = __WEBPACK_EXTERNAL_MODULE__solana_web3_js_fd5ac512__;
    },
    908: (t) => {
      t.exports = __WEBPACK_EXTERNAL_MODULE_bn_js_34e549a7__;
    },
    368: (t) => {
      t.exports = __WEBPACK_EXTERNAL_MODULE_buffer__;
    },
  },
  __webpack_module_cache__ = {};
function __webpack_require__(t) {
  var e = __webpack_module_cache__[t];
  if (void 0 !== e) return e.exports;
  var r = (__webpack_module_cache__[t] = { exports: {} });
  return (
    __webpack_modules__[t].call(r.exports, r, r.exports, __webpack_require__),
    r.exports
  );
}
(__webpack_require__.amdO = {}),
  (__webpack_require__.n = (t) => {
    var e = t && t.__esModule ? () => t.default : () => t;
    return __webpack_require__.d(e, { a: e }), e;
  }),
  (__webpack_require__.d = (t, e) => {
    for (var r in e)
      __webpack_require__.o(e, r) &&
        !__webpack_require__.o(t, r) &&
        Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
  }),
  (__webpack_require__.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  })()),
  (__webpack_require__.o = (t, e) =>
    Object.prototype.hasOwnProperty.call(t, e));
var __webpack_exports__ = {};
(() => {
  __webpack_require__.d(__webpack_exports__, {
    hi: () => Fn,
    TO: () => eo,
    DG: () => xn,
    Y7: () => dn,
    BN: () => r.default,
    Wr: () => jn,
    lc: () => Xn,
    xX: () => Vn,
    aU: () => Mn,
    Dk: () => qn,
    Qz: () => oo,
    jf: () => so,
    p5: () => kn,
    hW: () => Cn,
    gH: () => Rn,
    he: () => _o,
    $r: () => wo,
    cM: () => Sn,
    Iv: () => An,
    RG: () => yo,
    ae: () => Bi,
    Z_: () => Qi,
    Yf: () => Kn,
    VH: () => wn,
    Ny: () => Lr,
    fc: () => mn,
    $k: () => Wi,
    I_: () => Zn,
    Ur: () => Or,
    VC: () => zr,
    R4: () => In,
    P6: () => Xi,
    QB: () => Pr,
    rV: () => e,
  });
  var t = __webpack_require__(368),
    e = __webpack_require__(329),
    r = __webpack_require__(908),
    n = __webpack_require__(191),
    i = __webpack_require__.n(n),
    o = __webpack_require__(742),
    s = __webpack_require__(204),
    a = __webpack_require__.n(s),
    c = __webpack_require__(23),
    u = __webpack_require__(593);
  function l(t) {
    let e = t.length;
    for (; --e >= 0; ) t[e] = 0;
  }
  const h = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0,
    ]),
    d = new Uint8Array([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13,
    ]),
    f = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7,
    ]),
    p = new Uint8Array([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]),
    _ = new Array(576);
  l(_);
  const m = new Array(60);
  l(m);
  const w = new Array(512);
  l(w);
  const y = new Array(256);
  l(y);
  const g = new Array(29);
  l(g);
  const b = new Array(30);
  function v(t, e, r, n, i) {
    (this.static_tree = t),
      (this.extra_bits = e),
      (this.extra_base = r),
      (this.elems = n),
      (this.max_length = i),
      (this.has_stree = t && t.length);
  }
  let E, k, A;
  function x(t, e) {
    (this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e);
  }
  l(b);
  const S = (t) => (t < 256 ? w[t] : w[256 + (t >>> 7)]),
    I = (t, e) => {
      (t.pending_buf[t.pending++] = 255 & e),
        (t.pending_buf[t.pending++] = (e >>> 8) & 255);
    },
    C = (t, e, r) => {
      t.bi_valid > 16 - r
        ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
          I(t, t.bi_buf),
          (t.bi_buf = e >> (16 - t.bi_valid)),
          (t.bi_valid += r - 16))
        : ((t.bi_buf |= (e << t.bi_valid) & 65535), (t.bi_valid += r));
    },
    R = (t, e, r) => {
      C(t, r[2 * e], r[2 * e + 1]);
    },
    B = (t, e) => {
      let r = 0;
      do {
        (r |= 1 & t), (t >>>= 1), (r <<= 1);
      } while (--e > 0);
      return r >>> 1;
    },
    T = (t, e, r) => {
      const n = new Array(16);
      let i,
        o,
        s = 0;
      for (i = 1; i <= 15; i++) n[i] = s = (s + r[i - 1]) << 1;
      for (o = 0; o <= e; o++) {
        let e = t[2 * o + 1];
        0 !== e && (t[2 * o] = B(n[e]++, e));
      }
    },
    L = (t) => {
      let e;
      for (e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
      for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
      for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
      (t.dyn_ltree[512] = 1),
        (t.opt_len = t.static_len = 0),
        (t.last_lit = t.matches = 0);
    },
    O = (t) => {
      t.bi_valid > 8
        ? I(t, t.bi_buf)
        : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf),
        (t.bi_buf = 0),
        (t.bi_valid = 0);
    },
    P = (t, e, r, n) => {
      const i = 2 * e,
        o = 2 * r;
      return t[i] < t[o] || (t[i] === t[o] && n[e] <= n[r]);
    },
    z = (t, e, r) => {
      const n = t.heap[r];
      let i = r << 1;
      for (
        ;
        i <= t.heap_len &&
        (i < t.heap_len && P(e, t.heap[i + 1], t.heap[i], t.depth) && i++,
        !P(e, n, t.heap[i], t.depth));

      )
        (t.heap[r] = t.heap[i]), (r = i), (i <<= 1);
      t.heap[r] = n;
    },
    M = (t, e, r) => {
      let n,
        i,
        o,
        s,
        a = 0;
      if (0 !== t.last_lit)
        do {
          (n =
            (t.pending_buf[t.d_buf + 2 * a] << 8) |
            t.pending_buf[t.d_buf + 2 * a + 1]),
            (i = t.pending_buf[t.l_buf + a]),
            a++,
            0 === n
              ? R(t, i, e)
              : ((o = y[i]),
                R(t, o + 256 + 1, e),
                (s = h[o]),
                0 !== s && ((i -= g[o]), C(t, i, s)),
                n--,
                (o = S(n)),
                R(t, o, r),
                (s = d[o]),
                0 !== s && ((n -= b[o]), C(t, n, s)));
        } while (a < t.last_lit);
      R(t, 256, e);
    },
    U = (t, e) => {
      const r = e.dyn_tree,
        n = e.stat_desc.static_tree,
        i = e.stat_desc.has_stree,
        o = e.stat_desc.elems;
      let s,
        a,
        c,
        u = -1;
      for (t.heap_len = 0, t.heap_max = 573, s = 0; s < o; s++)
        0 !== r[2 * s]
          ? ((t.heap[++t.heap_len] = u = s), (t.depth[s] = 0))
          : (r[2 * s + 1] = 0);
      for (; t.heap_len < 2; )
        (c = t.heap[++t.heap_len] = u < 2 ? ++u : 0),
          (r[2 * c] = 1),
          (t.depth[c] = 0),
          t.opt_len--,
          i && (t.static_len -= n[2 * c + 1]);
      for (e.max_code = u, s = t.heap_len >> 1; s >= 1; s--) z(t, r, s);
      c = o;
      do {
        (s = t.heap[1]),
          (t.heap[1] = t.heap[t.heap_len--]),
          z(t, r, 1),
          (a = t.heap[1]),
          (t.heap[--t.heap_max] = s),
          (t.heap[--t.heap_max] = a),
          (r[2 * c] = r[2 * s] + r[2 * a]),
          (t.depth[c] =
            (t.depth[s] >= t.depth[a] ? t.depth[s] : t.depth[a]) + 1),
          (r[2 * s + 1] = r[2 * a + 1] = c),
          (t.heap[1] = c++),
          z(t, r, 1);
      } while (t.heap_len >= 2);
      (t.heap[--t.heap_max] = t.heap[1]),
        ((t, e) => {
          const r = e.dyn_tree,
            n = e.max_code,
            i = e.stat_desc.static_tree,
            o = e.stat_desc.has_stree,
            s = e.stat_desc.extra_bits,
            a = e.stat_desc.extra_base,
            c = e.stat_desc.max_length;
          let u,
            l,
            h,
            d,
            f,
            p,
            _ = 0;
          for (d = 0; d <= 15; d++) t.bl_count[d] = 0;
          for (
            r[2 * t.heap[t.heap_max] + 1] = 0, u = t.heap_max + 1;
            u < 573;
            u++
          )
            (l = t.heap[u]),
              (d = r[2 * r[2 * l + 1] + 1] + 1),
              d > c && ((d = c), _++),
              (r[2 * l + 1] = d),
              l > n ||
                (t.bl_count[d]++,
                (f = 0),
                l >= a && (f = s[l - a]),
                (p = r[2 * l]),
                (t.opt_len += p * (d + f)),
                o && (t.static_len += p * (i[2 * l + 1] + f)));
          if (0 !== _) {
            do {
              for (d = c - 1; 0 === t.bl_count[d]; ) d--;
              t.bl_count[d]--,
                (t.bl_count[d + 1] += 2),
                t.bl_count[c]--,
                (_ -= 2);
            } while (_ > 0);
            for (d = c; 0 !== d; d--)
              for (l = t.bl_count[d]; 0 !== l; )
                (h = t.heap[--u]),
                  h > n ||
                    (r[2 * h + 1] !== d &&
                      ((t.opt_len += (d - r[2 * h + 1]) * r[2 * h]),
                      (r[2 * h + 1] = d)),
                    l--);
          }
        })(t, e),
        T(r, u, t.bl_count);
    },
    D = (t, e, r) => {
      let n,
        i,
        o = -1,
        s = e[1],
        a = 0,
        c = 7,
        u = 4;
      for (
        0 === s && ((c = 138), (u = 3)), e[2 * (r + 1) + 1] = 65535, n = 0;
        n <= r;
        n++
      )
        (i = s),
          (s = e[2 * (n + 1) + 1]),
          (++a < c && i === s) ||
            (a < u
              ? (t.bl_tree[2 * i] += a)
              : 0 !== i
              ? (i !== o && t.bl_tree[2 * i]++, t.bl_tree[32]++)
              : a <= 10
              ? t.bl_tree[34]++
              : t.bl_tree[36]++,
            (a = 0),
            (o = i),
            0 === s
              ? ((c = 138), (u = 3))
              : i === s
              ? ((c = 6), (u = 3))
              : ((c = 7), (u = 4)));
    },
    H = (t, e, r) => {
      let n,
        i,
        o = -1,
        s = e[1],
        a = 0,
        c = 7,
        u = 4;
      for (0 === s && ((c = 138), (u = 3)), n = 0; n <= r; n++)
        if (((i = s), (s = e[2 * (n + 1) + 1]), !(++a < c && i === s))) {
          if (a < u)
            do {
              R(t, i, t.bl_tree);
            } while (0 != --a);
          else
            0 !== i
              ? (i !== o && (R(t, i, t.bl_tree), a--),
                R(t, 16, t.bl_tree),
                C(t, a - 3, 2))
              : a <= 10
              ? (R(t, 17, t.bl_tree), C(t, a - 3, 3))
              : (R(t, 18, t.bl_tree), C(t, a - 11, 7));
          (a = 0),
            (o = i),
            0 === s
              ? ((c = 138), (u = 3))
              : i === s
              ? ((c = 6), (u = 3))
              : ((c = 7), (u = 4));
        }
    };
  let N = !1;
  const F = (t, e, r, n) => {
    C(t, 0 + (n ? 1 : 0), 3),
      ((t, e, r, n) => {
        O(t),
          I(t, r),
          I(t, ~r),
          t.pending_buf.set(t.window.subarray(e, e + r), t.pending),
          (t.pending += r);
      })(t, e, r);
  };
  var j = {
      _tr_init: (t) => {
        N ||
          ((() => {
            let t, e, r, n, i;
            const o = new Array(16);
            for (r = 0, n = 0; n < 28; n++)
              for (g[n] = r, t = 0; t < 1 << h[n]; t++) y[r++] = n;
            for (y[r - 1] = n, i = 0, n = 0; n < 16; n++)
              for (b[n] = i, t = 0; t < 1 << d[n]; t++) w[i++] = n;
            for (i >>= 7; n < 30; n++)
              for (b[n] = i << 7, t = 0; t < 1 << (d[n] - 7); t++)
                w[256 + i++] = n;
            for (e = 0; e <= 15; e++) o[e] = 0;
            for (t = 0; t <= 143; ) (_[2 * t + 1] = 8), t++, o[8]++;
            for (; t <= 255; ) (_[2 * t + 1] = 9), t++, o[9]++;
            for (; t <= 279; ) (_[2 * t + 1] = 7), t++, o[7]++;
            for (; t <= 287; ) (_[2 * t + 1] = 8), t++, o[8]++;
            for (T(_, 287, o), t = 0; t < 30; t++)
              (m[2 * t + 1] = 5), (m[2 * t] = B(t, 5));
            (E = new v(_, h, 257, 286, 15)),
              (k = new v(m, d, 0, 30, 15)),
              (A = new v(new Array(0), f, 0, 19, 7));
          })(),
          (N = !0)),
          (t.l_desc = new x(t.dyn_ltree, E)),
          (t.d_desc = new x(t.dyn_dtree, k)),
          (t.bl_desc = new x(t.bl_tree, A)),
          (t.bi_buf = 0),
          (t.bi_valid = 0),
          L(t);
      },
      _tr_stored_block: F,
      _tr_flush_block: (t, e, r, n) => {
        let i,
          o,
          s = 0;
        t.level > 0
          ? (2 === t.strm.data_type &&
              (t.strm.data_type = ((t) => {
                let e,
                  r = 4093624447;
                for (e = 0; e <= 31; e++, r >>>= 1)
                  if (1 & r && 0 !== t.dyn_ltree[2 * e]) return 0;
                if (
                  0 !== t.dyn_ltree[18] ||
                  0 !== t.dyn_ltree[20] ||
                  0 !== t.dyn_ltree[26]
                )
                  return 1;
                for (e = 32; e < 256; e++)
                  if (0 !== t.dyn_ltree[2 * e]) return 1;
                return 0;
              })(t)),
            U(t, t.l_desc),
            U(t, t.d_desc),
            (s = ((t) => {
              let e;
              for (
                D(t, t.dyn_ltree, t.l_desc.max_code),
                  D(t, t.dyn_dtree, t.d_desc.max_code),
                  U(t, t.bl_desc),
                  e = 18;
                e >= 3 && 0 === t.bl_tree[2 * p[e] + 1];
                e--
              );
              return (t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e;
            })(t)),
            (i = (t.opt_len + 3 + 7) >>> 3),
            (o = (t.static_len + 3 + 7) >>> 3),
            o <= i && (i = o))
          : (i = o = r + 5),
          r + 4 <= i && -1 !== e
            ? F(t, e, r, n)
            : 4 === t.strategy || o === i
            ? (C(t, 2 + (n ? 1 : 0), 3), M(t, _, m))
            : (C(t, 4 + (n ? 1 : 0), 3),
              ((t, e, r, n) => {
                let i;
                for (
                  C(t, e - 257, 5), C(t, r - 1, 5), C(t, n - 4, 4), i = 0;
                  i < n;
                  i++
                )
                  C(t, t.bl_tree[2 * p[i] + 1], 3);
                H(t, t.dyn_ltree, e - 1), H(t, t.dyn_dtree, r - 1);
              })(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1),
              M(t, t.dyn_ltree, t.dyn_dtree)),
          L(t),
          n && O(t);
      },
      _tr_tally: (t, e, r) => (
        (t.pending_buf[t.d_buf + 2 * t.last_lit] = (e >>> 8) & 255),
        (t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e),
        (t.pending_buf[t.l_buf + t.last_lit] = 255 & r),
        t.last_lit++,
        0 === e
          ? t.dyn_ltree[2 * r]++
          : (t.matches++,
            e--,
            t.dyn_ltree[2 * (y[r] + 256 + 1)]++,
            t.dyn_dtree[2 * S(e)]++),
        t.last_lit === t.lit_bufsize - 1
      ),
      _tr_align: (t) => {
        C(t, 2, 3),
          R(t, 256, _),
          ((t) => {
            16 === t.bi_valid
              ? (I(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
              : t.bi_valid >= 8 &&
                ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
                (t.bi_buf >>= 8),
                (t.bi_valid -= 8));
          })(t);
      },
    },
    V = (t, e, r, n) => {
      let i = (65535 & t) | 0,
        o = ((t >>> 16) & 65535) | 0,
        s = 0;
      for (; 0 !== r; ) {
        (s = r > 2e3 ? 2e3 : r), (r -= s);
        do {
          (i = (i + e[n++]) | 0), (o = (o + i) | 0);
        } while (--s);
        (i %= 65521), (o %= 65521);
      }
      return i | (o << 16) | 0;
    };
  const K = new Uint32Array(
    (() => {
      let t,
        e = [];
      for (var r = 0; r < 256; r++) {
        t = r;
        for (var n = 0; n < 8; n++)
          t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
        e[r] = t;
      }
      return e;
    })()
  );
  var q = (t, e, r, n) => {
      const i = K,
        o = n + r;
      t ^= -1;
      for (let r = n; r < o; r++) t = (t >>> 8) ^ i[255 & (t ^ e[r])];
      return -1 ^ t;
    },
    Z = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version",
    },
    X = {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      Z_BINARY: 0,
      Z_TEXT: 1,
      Z_UNKNOWN: 2,
      Z_DEFLATED: 8,
    };
  const {
      _tr_init: $,
      _tr_stored_block: W,
      _tr_flush_block: G,
      _tr_tally: J,
      _tr_align: Y,
    } = j,
    {
      Z_NO_FLUSH: Q,
      Z_PARTIAL_FLUSH: tt,
      Z_FULL_FLUSH: et,
      Z_FINISH: rt,
      Z_BLOCK: nt,
      Z_OK: it,
      Z_STREAM_END: ot,
      Z_STREAM_ERROR: st,
      Z_DATA_ERROR: at,
      Z_BUF_ERROR: ct,
      Z_DEFAULT_COMPRESSION: ut,
      Z_FILTERED: lt,
      Z_HUFFMAN_ONLY: ht,
      Z_RLE: dt,
      Z_FIXED: ft,
      Z_DEFAULT_STRATEGY: pt,
      Z_UNKNOWN: _t,
      Z_DEFLATED: mt,
    } = X,
    wt = 258,
    yt = 262,
    gt = 103,
    bt = 113,
    vt = 666,
    Et = (t, e) => ((t.msg = Z[e]), e),
    kt = (t) => (t << 1) - (t > 4 ? 9 : 0),
    At = (t) => {
      let e = t.length;
      for (; --e >= 0; ) t[e] = 0;
    };
  let xt = (t, e, r) => ((e << t.hash_shift) ^ r) & t.hash_mask;
  const St = (t) => {
      const e = t.state;
      let r = e.pending;
      r > t.avail_out && (r = t.avail_out),
        0 !== r &&
          (t.output.set(
            e.pending_buf.subarray(e.pending_out, e.pending_out + r),
            t.next_out
          ),
          (t.next_out += r),
          (e.pending_out += r),
          (t.total_out += r),
          (t.avail_out -= r),
          (e.pending -= r),
          0 === e.pending && (e.pending_out = 0));
    },
    It = (t, e) => {
      G(
        t,
        t.block_start >= 0 ? t.block_start : -1,
        t.strstart - t.block_start,
        e
      ),
        (t.block_start = t.strstart),
        St(t.strm);
    },
    Ct = (t, e) => {
      t.pending_buf[t.pending++] = e;
    },
    Rt = (t, e) => {
      (t.pending_buf[t.pending++] = (e >>> 8) & 255),
        (t.pending_buf[t.pending++] = 255 & e);
    },
    Bt = (t, e, r, n) => {
      let i = t.avail_in;
      return (
        i > n && (i = n),
        0 === i
          ? 0
          : ((t.avail_in -= i),
            e.set(t.input.subarray(t.next_in, t.next_in + i), r),
            1 === t.state.wrap
              ? (t.adler = V(t.adler, e, i, r))
              : 2 === t.state.wrap && (t.adler = q(t.adler, e, i, r)),
            (t.next_in += i),
            (t.total_in += i),
            i)
      );
    },
    Tt = (t, e) => {
      let r,
        n,
        i = t.max_chain_length,
        o = t.strstart,
        s = t.prev_length,
        a = t.nice_match;
      const c = t.strstart > t.w_size - yt ? t.strstart - (t.w_size - yt) : 0,
        u = t.window,
        l = t.w_mask,
        h = t.prev,
        d = t.strstart + wt;
      let f = u[o + s - 1],
        p = u[o + s];
      t.prev_length >= t.good_match && (i >>= 2),
        a > t.lookahead && (a = t.lookahead);
      do {
        if (
          ((r = e),
          u[r + s] === p &&
            u[r + s - 1] === f &&
            u[r] === u[o] &&
            u[++r] === u[o + 1])
        ) {
          (o += 2), r++;
          do {} while (
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            u[++o] === u[++r] &&
            o < d
          );
          if (((n = wt - (d - o)), (o = d - wt), n > s)) {
            if (((t.match_start = e), (s = n), n >= a)) break;
            (f = u[o + s - 1]), (p = u[o + s]);
          }
        }
      } while ((e = h[e & l]) > c && 0 != --i);
      return s <= t.lookahead ? s : t.lookahead;
    },
    Lt = (t) => {
      const e = t.w_size;
      let r, n, i, o, s;
      do {
        if (
          ((o = t.window_size - t.lookahead - t.strstart),
          t.strstart >= e + (e - yt))
        ) {
          t.window.set(t.window.subarray(e, e + e), 0),
            (t.match_start -= e),
            (t.strstart -= e),
            (t.block_start -= e),
            (n = t.hash_size),
            (r = n);
          do {
            (i = t.head[--r]), (t.head[r] = i >= e ? i - e : 0);
          } while (--n);
          (n = e), (r = n);
          do {
            (i = t.prev[--r]), (t.prev[r] = i >= e ? i - e : 0);
          } while (--n);
          o += e;
        }
        if (0 === t.strm.avail_in) break;
        if (
          ((n = Bt(t.strm, t.window, t.strstart + t.lookahead, o)),
          (t.lookahead += n),
          t.lookahead + t.insert >= 3)
        )
          for (
            s = t.strstart - t.insert,
              t.ins_h = t.window[s],
              t.ins_h = xt(t, t.ins_h, t.window[s + 1]);
            t.insert &&
            ((t.ins_h = xt(t, t.ins_h, t.window[s + 3 - 1])),
            (t.prev[s & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = s),
            s++,
            t.insert--,
            !(t.lookahead + t.insert < 3));

          );
      } while (t.lookahead < yt && 0 !== t.strm.avail_in);
    },
    Ot = (t, e) => {
      let r, n;
      for (;;) {
        if (t.lookahead < yt) {
          if ((Lt(t), t.lookahead < yt && e === Q)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((r = 0),
          t.lookahead >= 3 &&
            ((t.ins_h = xt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          0 !== r &&
            t.strstart - r <= t.w_size - yt &&
            (t.match_length = Tt(t, r)),
          t.match_length >= 3)
        )
          if (
            ((n = J(t, t.strstart - t.match_start, t.match_length - 3)),
            (t.lookahead -= t.match_length),
            t.match_length <= t.max_lazy_match && t.lookahead >= 3)
          ) {
            t.match_length--;
            do {
              t.strstart++,
                (t.ins_h = xt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
                (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                (t.head[t.ins_h] = t.strstart);
            } while (0 != --t.match_length);
            t.strstart++;
          } else
            (t.strstart += t.match_length),
              (t.match_length = 0),
              (t.ins_h = t.window[t.strstart]),
              (t.ins_h = xt(t, t.ins_h, t.window[t.strstart + 1]));
        else (n = J(t, 0, t.window[t.strstart])), t.lookahead--, t.strstart++;
        if (n && (It(t, !1), 0 === t.strm.avail_out)) return 1;
      }
      return (
        (t.insert = t.strstart < 2 ? t.strstart : 2),
        e === rt
          ? (It(t, !0), 0 === t.strm.avail_out ? 3 : 4)
          : t.last_lit && (It(t, !1), 0 === t.strm.avail_out)
          ? 1
          : 2
      );
    },
    Pt = (t, e) => {
      let r, n, i;
      for (;;) {
        if (t.lookahead < yt) {
          if ((Lt(t), t.lookahead < yt && e === Q)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((r = 0),
          t.lookahead >= 3 &&
            ((t.ins_h = xt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          (t.prev_length = t.match_length),
          (t.prev_match = t.match_start),
          (t.match_length = 2),
          0 !== r &&
            t.prev_length < t.max_lazy_match &&
            t.strstart - r <= t.w_size - yt &&
            ((t.match_length = Tt(t, r)),
            t.match_length <= 5 &&
              (t.strategy === lt ||
                (3 === t.match_length && t.strstart - t.match_start > 4096)) &&
              (t.match_length = 2)),
          t.prev_length >= 3 && t.match_length <= t.prev_length)
        ) {
          (i = t.strstart + t.lookahead - 3),
            (n = J(t, t.strstart - 1 - t.prev_match, t.prev_length - 3)),
            (t.lookahead -= t.prev_length - 1),
            (t.prev_length -= 2);
          do {
            ++t.strstart <= i &&
              ((t.ins_h = xt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
              (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
              (t.head[t.ins_h] = t.strstart));
          } while (0 != --t.prev_length);
          if (
            ((t.match_available = 0),
            (t.match_length = 2),
            t.strstart++,
            n && (It(t, !1), 0 === t.strm.avail_out))
          )
            return 1;
        } else if (t.match_available) {
          if (
            ((n = J(t, 0, t.window[t.strstart - 1])),
            n && It(t, !1),
            t.strstart++,
            t.lookahead--,
            0 === t.strm.avail_out)
          )
            return 1;
        } else (t.match_available = 1), t.strstart++, t.lookahead--;
      }
      return (
        t.match_available &&
          ((n = J(t, 0, t.window[t.strstart - 1])), (t.match_available = 0)),
        (t.insert = t.strstart < 2 ? t.strstart : 2),
        e === rt
          ? (It(t, !0), 0 === t.strm.avail_out ? 3 : 4)
          : t.last_lit && (It(t, !1), 0 === t.strm.avail_out)
          ? 1
          : 2
      );
    };
  function zt(t, e, r, n, i) {
    (this.good_length = t),
      (this.max_lazy = e),
      (this.nice_length = r),
      (this.max_chain = n),
      (this.func = i);
  }
  const Mt = [
    new zt(0, 0, 0, 0, (t, e) => {
      let r = 65535;
      for (r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5); ; ) {
        if (t.lookahead <= 1) {
          if ((Lt(t), 0 === t.lookahead && e === Q)) return 1;
          if (0 === t.lookahead) break;
        }
        (t.strstart += t.lookahead), (t.lookahead = 0);
        const n = t.block_start + r;
        if (
          (0 === t.strstart || t.strstart >= n) &&
          ((t.lookahead = t.strstart - n),
          (t.strstart = n),
          It(t, !1),
          0 === t.strm.avail_out)
        )
          return 1;
        if (
          t.strstart - t.block_start >= t.w_size - yt &&
          (It(t, !1), 0 === t.strm.avail_out)
        )
          return 1;
      }
      return (
        (t.insert = 0),
        e === rt
          ? (It(t, !0), 0 === t.strm.avail_out ? 3 : 4)
          : (t.strstart > t.block_start && (It(t, !1), t.strm.avail_out), 1)
      );
    }),
    new zt(4, 4, 8, 4, Ot),
    new zt(4, 5, 16, 8, Ot),
    new zt(4, 6, 32, 32, Ot),
    new zt(4, 4, 16, 16, Pt),
    new zt(8, 16, 32, 32, Pt),
    new zt(8, 16, 128, 128, Pt),
    new zt(8, 32, 128, 256, Pt),
    new zt(32, 128, 258, 1024, Pt),
    new zt(32, 258, 258, 4096, Pt),
  ];
  function Ut() {
    (this.strm = null),
      (this.status = 0),
      (this.pending_buf = null),
      (this.pending_buf_size = 0),
      (this.pending_out = 0),
      (this.pending = 0),
      (this.wrap = 0),
      (this.gzhead = null),
      (this.gzindex = 0),
      (this.method = mt),
      (this.last_flush = -1),
      (this.w_size = 0),
      (this.w_bits = 0),
      (this.w_mask = 0),
      (this.window = null),
      (this.window_size = 0),
      (this.prev = null),
      (this.head = null),
      (this.ins_h = 0),
      (this.hash_size = 0),
      (this.hash_bits = 0),
      (this.hash_mask = 0),
      (this.hash_shift = 0),
      (this.block_start = 0),
      (this.match_length = 0),
      (this.prev_match = 0),
      (this.match_available = 0),
      (this.strstart = 0),
      (this.match_start = 0),
      (this.lookahead = 0),
      (this.prev_length = 0),
      (this.max_chain_length = 0),
      (this.max_lazy_match = 0),
      (this.level = 0),
      (this.strategy = 0),
      (this.good_match = 0),
      (this.nice_match = 0),
      (this.dyn_ltree = new Uint16Array(1146)),
      (this.dyn_dtree = new Uint16Array(122)),
      (this.bl_tree = new Uint16Array(78)),
      At(this.dyn_ltree),
      At(this.dyn_dtree),
      At(this.bl_tree),
      (this.l_desc = null),
      (this.d_desc = null),
      (this.bl_desc = null),
      (this.bl_count = new Uint16Array(16)),
      (this.heap = new Uint16Array(573)),
      At(this.heap),
      (this.heap_len = 0),
      (this.heap_max = 0),
      (this.depth = new Uint16Array(573)),
      At(this.depth),
      (this.l_buf = 0),
      (this.lit_bufsize = 0),
      (this.last_lit = 0),
      (this.d_buf = 0),
      (this.opt_len = 0),
      (this.static_len = 0),
      (this.matches = 0),
      (this.insert = 0),
      (this.bi_buf = 0),
      (this.bi_valid = 0);
  }
  const Dt = (t) => {
      if (!t || !t.state) return Et(t, st);
      (t.total_in = t.total_out = 0), (t.data_type = _t);
      const e = t.state;
      return (
        (e.pending = 0),
        (e.pending_out = 0),
        e.wrap < 0 && (e.wrap = -e.wrap),
        (e.status = e.wrap ? 42 : bt),
        (t.adler = 2 === e.wrap ? 0 : 1),
        (e.last_flush = Q),
        $(e),
        it
      );
    },
    Ht = (t) => {
      const e = Dt(t);
      var r;
      return (
        e === it &&
          (((r = t.state).window_size = 2 * r.w_size),
          At(r.head),
          (r.max_lazy_match = Mt[r.level].max_lazy),
          (r.good_match = Mt[r.level].good_length),
          (r.nice_match = Mt[r.level].nice_length),
          (r.max_chain_length = Mt[r.level].max_chain),
          (r.strstart = 0),
          (r.block_start = 0),
          (r.lookahead = 0),
          (r.insert = 0),
          (r.match_length = r.prev_length = 2),
          (r.match_available = 0),
          (r.ins_h = 0)),
        e
      );
    },
    Nt = (t, e, r, n, i, o) => {
      if (!t) return st;
      let s = 1;
      if (
        (e === ut && (e = 6),
        n < 0 ? ((s = 0), (n = -n)) : n > 15 && ((s = 2), (n -= 16)),
        i < 1 ||
          i > 9 ||
          r !== mt ||
          n < 8 ||
          n > 15 ||
          e < 0 ||
          e > 9 ||
          o < 0 ||
          o > ft)
      )
        return Et(t, st);
      8 === n && (n = 9);
      const a = new Ut();
      return (
        (t.state = a),
        (a.strm = t),
        (a.wrap = s),
        (a.gzhead = null),
        (a.w_bits = n),
        (a.w_size = 1 << a.w_bits),
        (a.w_mask = a.w_size - 1),
        (a.hash_bits = i + 7),
        (a.hash_size = 1 << a.hash_bits),
        (a.hash_mask = a.hash_size - 1),
        (a.hash_shift = ~~((a.hash_bits + 3 - 1) / 3)),
        (a.window = new Uint8Array(2 * a.w_size)),
        (a.head = new Uint16Array(a.hash_size)),
        (a.prev = new Uint16Array(a.w_size)),
        (a.lit_bufsize = 1 << (i + 6)),
        (a.pending_buf_size = 4 * a.lit_bufsize),
        (a.pending_buf = new Uint8Array(a.pending_buf_size)),
        (a.d_buf = 1 * a.lit_bufsize),
        (a.l_buf = 3 * a.lit_bufsize),
        (a.level = e),
        (a.strategy = o),
        (a.method = r),
        Ht(t)
      );
    };
  var Ft = Nt,
    jt = (t, e) =>
      t && t.state
        ? 2 !== t.state.wrap
          ? st
          : ((t.state.gzhead = e), it)
        : st,
    Vt = (t, e) => {
      let r, n;
      if (!t || !t.state || e > nt || e < 0) return t ? Et(t, st) : st;
      const i = t.state;
      if (
        !t.output ||
        (!t.input && 0 !== t.avail_in) ||
        (i.status === vt && e !== rt)
      )
        return Et(t, 0 === t.avail_out ? ct : st);
      i.strm = t;
      const o = i.last_flush;
      if (((i.last_flush = e), 42 === i.status))
        if (2 === i.wrap)
          (t.adler = 0),
            Ct(i, 31),
            Ct(i, 139),
            Ct(i, 8),
            i.gzhead
              ? (Ct(
                  i,
                  (i.gzhead.text ? 1 : 0) +
                    (i.gzhead.hcrc ? 2 : 0) +
                    (i.gzhead.extra ? 4 : 0) +
                    (i.gzhead.name ? 8 : 0) +
                    (i.gzhead.comment ? 16 : 0)
                ),
                Ct(i, 255 & i.gzhead.time),
                Ct(i, (i.gzhead.time >> 8) & 255),
                Ct(i, (i.gzhead.time >> 16) & 255),
                Ct(i, (i.gzhead.time >> 24) & 255),
                Ct(
                  i,
                  9 === i.level ? 2 : i.strategy >= ht || i.level < 2 ? 4 : 0
                ),
                Ct(i, 255 & i.gzhead.os),
                i.gzhead.extra &&
                  i.gzhead.extra.length &&
                  (Ct(i, 255 & i.gzhead.extra.length),
                  Ct(i, (i.gzhead.extra.length >> 8) & 255)),
                i.gzhead.hcrc &&
                  (t.adler = q(t.adler, i.pending_buf, i.pending, 0)),
                (i.gzindex = 0),
                (i.status = 69))
              : (Ct(i, 0),
                Ct(i, 0),
                Ct(i, 0),
                Ct(i, 0),
                Ct(i, 0),
                Ct(
                  i,
                  9 === i.level ? 2 : i.strategy >= ht || i.level < 2 ? 4 : 0
                ),
                Ct(i, 3),
                (i.status = bt));
        else {
          let e = (mt + ((i.w_bits - 8) << 4)) << 8,
            r = -1;
          (r =
            i.strategy >= ht || i.level < 2
              ? 0
              : i.level < 6
              ? 1
              : 6 === i.level
              ? 2
              : 3),
            (e |= r << 6),
            0 !== i.strstart && (e |= 32),
            (e += 31 - (e % 31)),
            (i.status = bt),
            Rt(i, e),
            0 !== i.strstart && (Rt(i, t.adler >>> 16), Rt(i, 65535 & t.adler)),
            (t.adler = 1);
        }
      if (69 === i.status)
        if (i.gzhead.extra) {
          for (
            r = i.pending;
            i.gzindex < (65535 & i.gzhead.extra.length) &&
            (i.pending !== i.pending_buf_size ||
              (i.gzhead.hcrc &&
                i.pending > r &&
                (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
              St(t),
              (r = i.pending),
              i.pending !== i.pending_buf_size));

          )
            Ct(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
          i.gzhead.hcrc &&
            i.pending > r &&
            (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
            i.gzindex === i.gzhead.extra.length &&
              ((i.gzindex = 0), (i.status = 73));
        } else i.status = 73;
      if (73 === i.status)
        if (i.gzhead.name) {
          r = i.pending;
          do {
            if (
              i.pending === i.pending_buf_size &&
              (i.gzhead.hcrc &&
                i.pending > r &&
                (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
              St(t),
              (r = i.pending),
              i.pending === i.pending_buf_size)
            ) {
              n = 1;
              break;
            }
            (n =
              i.gzindex < i.gzhead.name.length
                ? 255 & i.gzhead.name.charCodeAt(i.gzindex++)
                : 0),
              Ct(i, n);
          } while (0 !== n);
          i.gzhead.hcrc &&
            i.pending > r &&
            (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
            0 === n && ((i.gzindex = 0), (i.status = 91));
        } else i.status = 91;
      if (91 === i.status)
        if (i.gzhead.comment) {
          r = i.pending;
          do {
            if (
              i.pending === i.pending_buf_size &&
              (i.gzhead.hcrc &&
                i.pending > r &&
                (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
              St(t),
              (r = i.pending),
              i.pending === i.pending_buf_size)
            ) {
              n = 1;
              break;
            }
            (n =
              i.gzindex < i.gzhead.comment.length
                ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++)
                : 0),
              Ct(i, n);
          } while (0 !== n);
          i.gzhead.hcrc &&
            i.pending > r &&
            (t.adler = q(t.adler, i.pending_buf, i.pending - r, r)),
            0 === n && (i.status = gt);
        } else i.status = gt;
      if (
        (i.status === gt &&
          (i.gzhead.hcrc
            ? (i.pending + 2 > i.pending_buf_size && St(t),
              i.pending + 2 <= i.pending_buf_size &&
                (Ct(i, 255 & t.adler),
                Ct(i, (t.adler >> 8) & 255),
                (t.adler = 0),
                (i.status = bt)))
            : (i.status = bt)),
        0 !== i.pending)
      ) {
        if ((St(t), 0 === t.avail_out)) return (i.last_flush = -1), it;
      } else if (0 === t.avail_in && kt(e) <= kt(o) && e !== rt)
        return Et(t, ct);
      if (i.status === vt && 0 !== t.avail_in) return Et(t, ct);
      if (
        0 !== t.avail_in ||
        0 !== i.lookahead ||
        (e !== Q && i.status !== vt)
      ) {
        let r =
          i.strategy === ht
            ? ((t, e) => {
                let r;
                for (;;) {
                  if (0 === t.lookahead && (Lt(t), 0 === t.lookahead)) {
                    if (e === Q) return 1;
                    break;
                  }
                  if (
                    ((t.match_length = 0),
                    (r = J(t, 0, t.window[t.strstart])),
                    t.lookahead--,
                    t.strstart++,
                    r && (It(t, !1), 0 === t.strm.avail_out))
                  )
                    return 1;
                }
                return (
                  (t.insert = 0),
                  e === rt
                    ? (It(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (It(t, !1), 0 === t.strm.avail_out)
                    ? 1
                    : 2
                );
              })(i, e)
            : i.strategy === dt
            ? ((t, e) => {
                let r, n, i, o;
                const s = t.window;
                for (;;) {
                  if (t.lookahead <= wt) {
                    if ((Lt(t), t.lookahead <= wt && e === Q)) return 1;
                    if (0 === t.lookahead) break;
                  }
                  if (
                    ((t.match_length = 0),
                    t.lookahead >= 3 &&
                      t.strstart > 0 &&
                      ((i = t.strstart - 1),
                      (n = s[i]),
                      n === s[++i] && n === s[++i] && n === s[++i]))
                  ) {
                    o = t.strstart + wt;
                    do {} while (
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      n === s[++i] &&
                      i < o
                    );
                    (t.match_length = wt - (o - i)),
                      t.match_length > t.lookahead &&
                        (t.match_length = t.lookahead);
                  }
                  if (
                    (t.match_length >= 3
                      ? ((r = J(t, 1, t.match_length - 3)),
                        (t.lookahead -= t.match_length),
                        (t.strstart += t.match_length),
                        (t.match_length = 0))
                      : ((r = J(t, 0, t.window[t.strstart])),
                        t.lookahead--,
                        t.strstart++),
                    r && (It(t, !1), 0 === t.strm.avail_out))
                  )
                    return 1;
                }
                return (
                  (t.insert = 0),
                  e === rt
                    ? (It(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (It(t, !1), 0 === t.strm.avail_out)
                    ? 1
                    : 2
                );
              })(i, e)
            : Mt[i.level].func(i, e);
        if (((3 !== r && 4 !== r) || (i.status = vt), 1 === r || 3 === r))
          return 0 === t.avail_out && (i.last_flush = -1), it;
        if (
          2 === r &&
          (e === tt
            ? Y(i)
            : e !== nt &&
              (W(i, 0, 0, !1),
              e === et &&
                (At(i.head),
                0 === i.lookahead &&
                  ((i.strstart = 0), (i.block_start = 0), (i.insert = 0)))),
          St(t),
          0 === t.avail_out)
        )
          return (i.last_flush = -1), it;
      }
      return e !== rt
        ? it
        : i.wrap <= 0
        ? ot
        : (2 === i.wrap
            ? (Ct(i, 255 & t.adler),
              Ct(i, (t.adler >> 8) & 255),
              Ct(i, (t.adler >> 16) & 255),
              Ct(i, (t.adler >> 24) & 255),
              Ct(i, 255 & t.total_in),
              Ct(i, (t.total_in >> 8) & 255),
              Ct(i, (t.total_in >> 16) & 255),
              Ct(i, (t.total_in >> 24) & 255))
            : (Rt(i, t.adler >>> 16), Rt(i, 65535 & t.adler)),
          St(t),
          i.wrap > 0 && (i.wrap = -i.wrap),
          0 !== i.pending ? it : ot);
    },
    Kt = (t) => {
      if (!t || !t.state) return st;
      const e = t.state.status;
      return 42 !== e &&
        69 !== e &&
        73 !== e &&
        91 !== e &&
        e !== gt &&
        e !== bt &&
        e !== vt
        ? Et(t, st)
        : ((t.state = null), e === bt ? Et(t, at) : it);
    },
    qt = (t, e) => {
      let r = e.length;
      if (!t || !t.state) return st;
      const n = t.state,
        i = n.wrap;
      if (2 === i || (1 === i && 42 !== n.status) || n.lookahead) return st;
      if (
        (1 === i && (t.adler = V(t.adler, e, r, 0)),
        (n.wrap = 0),
        r >= n.w_size)
      ) {
        0 === i &&
          (At(n.head), (n.strstart = 0), (n.block_start = 0), (n.insert = 0));
        let t = new Uint8Array(n.w_size);
        t.set(e.subarray(r - n.w_size, r), 0), (e = t), (r = n.w_size);
      }
      const o = t.avail_in,
        s = t.next_in,
        a = t.input;
      for (
        t.avail_in = r, t.next_in = 0, t.input = e, Lt(n);
        n.lookahead >= 3;

      ) {
        let t = n.strstart,
          e = n.lookahead - 2;
        do {
          (n.ins_h = xt(n, n.ins_h, n.window[t + 3 - 1])),
            (n.prev[t & n.w_mask] = n.head[n.ins_h]),
            (n.head[n.ins_h] = t),
            t++;
        } while (--e);
        (n.strstart = t), (n.lookahead = 2), Lt(n);
      }
      return (
        (n.strstart += n.lookahead),
        (n.block_start = n.strstart),
        (n.insert = n.lookahead),
        (n.lookahead = 0),
        (n.match_length = n.prev_length = 2),
        (n.match_available = 0),
        (t.next_in = s),
        (t.input = a),
        (t.avail_in = o),
        (n.wrap = i),
        it
      );
    };
  const Zt = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
  var Xt = function (t) {
      const e = Array.prototype.slice.call(arguments, 1);
      for (; e.length; ) {
        const r = e.shift();
        if (r) {
          if ("object" != typeof r)
            throw new TypeError(r + "must be non-object");
          for (const e in r) Zt(r, e) && (t[e] = r[e]);
        }
      }
      return t;
    },
    $t = (t) => {
      let e = 0;
      for (let r = 0, n = t.length; r < n; r++) e += t[r].length;
      const r = new Uint8Array(e);
      for (let e = 0, n = 0, i = t.length; e < i; e++) {
        let i = t[e];
        r.set(i, n), (n += i.length);
      }
      return r;
    };
  let Wt = !0;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (t) {
    Wt = !1;
  }
  const Gt = new Uint8Array(256);
  for (let t = 0; t < 256; t++)
    Gt[t] =
      t >= 252
        ? 6
        : t >= 248
        ? 5
        : t >= 240
        ? 4
        : t >= 224
        ? 3
        : t >= 192
        ? 2
        : 1;
  Gt[254] = Gt[254] = 1;
  var Jt = (t) => {
      if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
        return new TextEncoder().encode(t);
      let e,
        r,
        n,
        i,
        o,
        s = t.length,
        a = 0;
      for (i = 0; i < s; i++)
        (r = t.charCodeAt(i)),
          55296 == (64512 & r) &&
            i + 1 < s &&
            ((n = t.charCodeAt(i + 1)),
            56320 == (64512 & n) &&
              ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++)),
          (a += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
      for (e = new Uint8Array(a), o = 0, i = 0; o < a; i++)
        (r = t.charCodeAt(i)),
          55296 == (64512 & r) &&
            i + 1 < s &&
            ((n = t.charCodeAt(i + 1)),
            56320 == (64512 & n) &&
              ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), i++)),
          r < 128
            ? (e[o++] = r)
            : r < 2048
            ? ((e[o++] = 192 | (r >>> 6)), (e[o++] = 128 | (63 & r)))
            : r < 65536
            ? ((e[o++] = 224 | (r >>> 12)),
              (e[o++] = 128 | ((r >>> 6) & 63)),
              (e[o++] = 128 | (63 & r)))
            : ((e[o++] = 240 | (r >>> 18)),
              (e[o++] = 128 | ((r >>> 12) & 63)),
              (e[o++] = 128 | ((r >>> 6) & 63)),
              (e[o++] = 128 | (63 & r)));
      return e;
    },
    Yt = (t, e) => {
      const r = e || t.length;
      if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
        return new TextDecoder().decode(t.subarray(0, e));
      let n, i;
      const o = new Array(2 * r);
      for (i = 0, n = 0; n < r; ) {
        let e = t[n++];
        if (e < 128) {
          o[i++] = e;
          continue;
        }
        let s = Gt[e];
        if (s > 4) (o[i++] = 65533), (n += s - 1);
        else {
          for (e &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && n < r; )
            (e = (e << 6) | (63 & t[n++])), s--;
          s > 1
            ? (o[i++] = 65533)
            : e < 65536
            ? (o[i++] = e)
            : ((e -= 65536),
              (o[i++] = 55296 | ((e >> 10) & 1023)),
              (o[i++] = 56320 | (1023 & e)));
        }
      }
      return ((t, e) => {
        if (e < 65534 && t.subarray && Wt)
          return String.fromCharCode.apply(
            null,
            t.length === e ? t : t.subarray(0, e)
          );
        let r = "";
        for (let n = 0; n < e; n++) r += String.fromCharCode(t[n]);
        return r;
      })(o, i);
    },
    Qt = (t, e) => {
      (e = e || t.length) > t.length && (e = t.length);
      let r = e - 1;
      for (; r >= 0 && 128 == (192 & t[r]); ) r--;
      return r < 0 || 0 === r ? e : r + Gt[t[r]] > e ? r : e;
    },
    te = function () {
      (this.input = null),
        (this.next_in = 0),
        (this.avail_in = 0),
        (this.total_in = 0),
        (this.output = null),
        (this.next_out = 0),
        (this.avail_out = 0),
        (this.total_out = 0),
        (this.msg = ""),
        (this.state = null),
        (this.data_type = 2),
        (this.adler = 0);
    };
  const ee = Object.prototype.toString,
    {
      Z_NO_FLUSH: re,
      Z_SYNC_FLUSH: ne,
      Z_FULL_FLUSH: ie,
      Z_FINISH: oe,
      Z_OK: se,
      Z_STREAM_END: ae,
      Z_DEFAULT_COMPRESSION: ce,
      Z_DEFAULT_STRATEGY: ue,
      Z_DEFLATED: le,
    } = X;
  function he(t) {
    this.options = Xt(
      {
        level: ce,
        method: le,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: ue,
      },
      t || {}
    );
    let e = this.options;
    e.raw && e.windowBits > 0
      ? (e.windowBits = -e.windowBits)
      : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new te()),
      (this.strm.avail_out = 0);
    let r = Ft(
      this.strm,
      e.level,
      e.method,
      e.windowBits,
      e.memLevel,
      e.strategy
    );
    if (r !== se) throw new Error(Z[r]);
    if ((e.header && jt(this.strm, e.header), e.dictionary)) {
      let t;
      if (
        ((t =
          "string" == typeof e.dictionary
            ? Jt(e.dictionary)
            : "[object ArrayBuffer]" === ee.call(e.dictionary)
            ? new Uint8Array(e.dictionary)
            : e.dictionary),
        (r = qt(this.strm, t)),
        r !== se)
      )
        throw new Error(Z[r]);
      this._dict_set = !0;
    }
  }
  function de(t, e) {
    const r = new he(e);
    if ((r.push(t, !0), r.err)) throw r.msg || Z[r.err];
    return r.result;
  }
  (he.prototype.push = function (t, e) {
    const r = this.strm,
      n = this.options.chunkSize;
    let i, o;
    if (this.ended) return !1;
    for (
      o = e === ~~e ? e : !0 === e ? oe : re,
        "string" == typeof t
          ? (r.input = Jt(t))
          : "[object ArrayBuffer]" === ee.call(t)
          ? (r.input = new Uint8Array(t))
          : (r.input = t),
        r.next_in = 0,
        r.avail_in = r.input.length;
      ;

    )
      if (
        (0 === r.avail_out &&
          ((r.output = new Uint8Array(n)), (r.next_out = 0), (r.avail_out = n)),
        (o === ne || o === ie) && r.avail_out <= 6)
      )
        this.onData(r.output.subarray(0, r.next_out)), (r.avail_out = 0);
      else {
        if (((i = Vt(r, o)), i === ae))
          return (
            r.next_out > 0 && this.onData(r.output.subarray(0, r.next_out)),
            (i = Kt(this.strm)),
            this.onEnd(i),
            (this.ended = !0),
            i === se
          );
        if (0 !== r.avail_out) {
          if (o > 0 && r.next_out > 0)
            this.onData(r.output.subarray(0, r.next_out)), (r.avail_out = 0);
          else if (0 === r.avail_in) break;
        } else this.onData(r.output);
      }
    return !0;
  }),
    (he.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (he.prototype.onEnd = function (t) {
      t === se && (this.result = $t(this.chunks)),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg);
    });
  var fe = {
      Deflate: he,
      deflate: de,
      deflateRaw: function (t, e) {
        return ((e = e || {}).raw = !0), de(t, e);
      },
      gzip: function (t, e) {
        return ((e = e || {}).gzip = !0), de(t, e);
      },
      constants: X,
    },
    pe = function (t, e) {
      let r,
        n,
        i,
        o,
        s,
        a,
        c,
        u,
        l,
        h,
        d,
        f,
        p,
        _,
        m,
        w,
        y,
        g,
        b,
        v,
        E,
        k,
        A,
        x;
      const S = t.state;
      (r = t.next_in),
        (A = t.input),
        (n = r + (t.avail_in - 5)),
        (i = t.next_out),
        (x = t.output),
        (o = i - (e - t.avail_out)),
        (s = i + (t.avail_out - 257)),
        (a = S.dmax),
        (c = S.wsize),
        (u = S.whave),
        (l = S.wnext),
        (h = S.window),
        (d = S.hold),
        (f = S.bits),
        (p = S.lencode),
        (_ = S.distcode),
        (m = (1 << S.lenbits) - 1),
        (w = (1 << S.distbits) - 1);
      t: do {
        f < 15 && ((d += A[r++] << f), (f += 8), (d += A[r++] << f), (f += 8)),
          (y = p[d & m]);
        e: for (;;) {
          if (
            ((g = y >>> 24),
            (d >>>= g),
            (f -= g),
            (g = (y >>> 16) & 255),
            0 === g)
          )
            x[i++] = 65535 & y;
          else {
            if (!(16 & g)) {
              if (0 == (64 & g)) {
                y = p[(65535 & y) + (d & ((1 << g) - 1))];
                continue e;
              }
              if (32 & g) {
                S.mode = 12;
                break t;
              }
              (t.msg = "invalid literal/length code"), (S.mode = 30);
              break t;
            }
            (b = 65535 & y),
              (g &= 15),
              g &&
                (f < g && ((d += A[r++] << f), (f += 8)),
                (b += d & ((1 << g) - 1)),
                (d >>>= g),
                (f -= g)),
              f < 15 &&
                ((d += A[r++] << f), (f += 8), (d += A[r++] << f), (f += 8)),
              (y = _[d & w]);
            r: for (;;) {
              if (
                ((g = y >>> 24),
                (d >>>= g),
                (f -= g),
                (g = (y >>> 16) & 255),
                !(16 & g))
              ) {
                if (0 == (64 & g)) {
                  y = _[(65535 & y) + (d & ((1 << g) - 1))];
                  continue r;
                }
                (t.msg = "invalid distance code"), (S.mode = 30);
                break t;
              }
              if (
                ((v = 65535 & y),
                (g &= 15),
                f < g &&
                  ((d += A[r++] << f),
                  (f += 8),
                  f < g && ((d += A[r++] << f), (f += 8))),
                (v += d & ((1 << g) - 1)),
                v > a)
              ) {
                (t.msg = "invalid distance too far back"), (S.mode = 30);
                break t;
              }
              if (((d >>>= g), (f -= g), (g = i - o), v > g)) {
                if (((g = v - g), g > u && S.sane)) {
                  (t.msg = "invalid distance too far back"), (S.mode = 30);
                  break t;
                }
                if (((E = 0), (k = h), 0 === l)) {
                  if (((E += c - g), g < b)) {
                    b -= g;
                    do {
                      x[i++] = h[E++];
                    } while (--g);
                    (E = i - v), (k = x);
                  }
                } else if (l < g) {
                  if (((E += c + l - g), (g -= l), g < b)) {
                    b -= g;
                    do {
                      x[i++] = h[E++];
                    } while (--g);
                    if (((E = 0), l < b)) {
                      (g = l), (b -= g);
                      do {
                        x[i++] = h[E++];
                      } while (--g);
                      (E = i - v), (k = x);
                    }
                  }
                } else if (((E += l - g), g < b)) {
                  b -= g;
                  do {
                    x[i++] = h[E++];
                  } while (--g);
                  (E = i - v), (k = x);
                }
                for (; b > 2; )
                  (x[i++] = k[E++]),
                    (x[i++] = k[E++]),
                    (x[i++] = k[E++]),
                    (b -= 3);
                b && ((x[i++] = k[E++]), b > 1 && (x[i++] = k[E++]));
              } else {
                E = i - v;
                do {
                  (x[i++] = x[E++]),
                    (x[i++] = x[E++]),
                    (x[i++] = x[E++]),
                    (b -= 3);
                } while (b > 2);
                b && ((x[i++] = x[E++]), b > 1 && (x[i++] = x[E++]));
              }
              break;
            }
          }
          break;
        }
      } while (r < n && i < s);
      (b = f >> 3),
        (r -= b),
        (f -= b << 3),
        (d &= (1 << f) - 1),
        (t.next_in = r),
        (t.next_out = i),
        (t.avail_in = r < n ? n - r + 5 : 5 - (r - n)),
        (t.avail_out = i < s ? s - i + 257 : 257 - (i - s)),
        (S.hold = d),
        (S.bits = f);
    };
  const _e = new Uint16Array([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
      67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
    ]),
    me = new Uint8Array([
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19,
      19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
    ]),
    we = new Uint16Array([
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513,
      769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
    ]),
    ye = new Uint8Array([
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23,
      24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
    ]);
  var ge = (t, e, r, n, i, o, s, a) => {
    const c = a.bits;
    let u,
      l,
      h,
      d,
      f,
      p,
      _ = 0,
      m = 0,
      w = 0,
      y = 0,
      g = 0,
      b = 0,
      v = 0,
      E = 0,
      k = 0,
      A = 0,
      x = null,
      S = 0;
    const I = new Uint16Array(16),
      C = new Uint16Array(16);
    let R,
      B,
      T,
      L = null,
      O = 0;
    for (_ = 0; _ <= 15; _++) I[_] = 0;
    for (m = 0; m < n; m++) I[e[r + m]]++;
    for (g = c, y = 15; y >= 1 && 0 === I[y]; y--);
    if ((g > y && (g = y), 0 === y))
      return (i[o++] = 20971520), (i[o++] = 20971520), (a.bits = 1), 0;
    for (w = 1; w < y && 0 === I[w]; w++);
    for (g < w && (g = w), E = 1, _ = 1; _ <= 15; _++)
      if (((E <<= 1), (E -= I[_]), E < 0)) return -1;
    if (E > 0 && (0 === t || 1 !== y)) return -1;
    for (C[1] = 0, _ = 1; _ < 15; _++) C[_ + 1] = C[_] + I[_];
    for (m = 0; m < n; m++) 0 !== e[r + m] && (s[C[e[r + m]]++] = m);
    if (
      (0 === t
        ? ((x = L = s), (p = 19))
        : 1 === t
        ? ((x = _e), (S -= 257), (L = me), (O -= 257), (p = 256))
        : ((x = we), (L = ye), (p = -1)),
      (A = 0),
      (m = 0),
      (_ = w),
      (f = o),
      (b = g),
      (v = 0),
      (h = -1),
      (k = 1 << g),
      (d = k - 1),
      (1 === t && k > 852) || (2 === t && k > 592))
    )
      return 1;
    for (;;) {
      (R = _ - v),
        s[m] < p
          ? ((B = 0), (T = s[m]))
          : s[m] > p
          ? ((B = L[O + s[m]]), (T = x[S + s[m]]))
          : ((B = 96), (T = 0)),
        (u = 1 << (_ - v)),
        (l = 1 << b),
        (w = l);
      do {
        (l -= u), (i[f + (A >> v) + l] = (R << 24) | (B << 16) | T | 0);
      } while (0 !== l);
      for (u = 1 << (_ - 1); A & u; ) u >>= 1;
      if ((0 !== u ? ((A &= u - 1), (A += u)) : (A = 0), m++, 0 == --I[_])) {
        if (_ === y) break;
        _ = e[r + s[m]];
      }
      if (_ > g && (A & d) !== h) {
        for (
          0 === v && (v = g), f += w, b = _ - v, E = 1 << b;
          b + v < y && ((E -= I[b + v]), !(E <= 0));

        )
          b++, (E <<= 1);
        if (((k += 1 << b), (1 === t && k > 852) || (2 === t && k > 592)))
          return 1;
        (h = A & d), (i[h] = (g << 24) | (b << 16) | (f - o) | 0);
      }
    }
    return (
      0 !== A && (i[f + A] = ((_ - v) << 24) | (64 << 16) | 0), (a.bits = g), 0
    );
  };
  const {
      Z_FINISH: be,
      Z_BLOCK: ve,
      Z_TREES: Ee,
      Z_OK: ke,
      Z_STREAM_END: Ae,
      Z_NEED_DICT: xe,
      Z_STREAM_ERROR: Se,
      Z_DATA_ERROR: Ie,
      Z_MEM_ERROR: Ce,
      Z_BUF_ERROR: Re,
      Z_DEFLATED: Be,
    } = X,
    Te = 12,
    Le = 30,
    Oe = (t) =>
      ((t >>> 24) & 255) +
      ((t >>> 8) & 65280) +
      ((65280 & t) << 8) +
      ((255 & t) << 24);
  function Pe() {
    (this.mode = 0),
      (this.last = !1),
      (this.wrap = 0),
      (this.havedict = !1),
      (this.flags = 0),
      (this.dmax = 0),
      (this.check = 0),
      (this.total = 0),
      (this.head = null),
      (this.wbits = 0),
      (this.wsize = 0),
      (this.whave = 0),
      (this.wnext = 0),
      (this.window = null),
      (this.hold = 0),
      (this.bits = 0),
      (this.length = 0),
      (this.offset = 0),
      (this.extra = 0),
      (this.lencode = null),
      (this.distcode = null),
      (this.lenbits = 0),
      (this.distbits = 0),
      (this.ncode = 0),
      (this.nlen = 0),
      (this.ndist = 0),
      (this.have = 0),
      (this.next = null),
      (this.lens = new Uint16Array(320)),
      (this.work = new Uint16Array(288)),
      (this.lendyn = null),
      (this.distdyn = null),
      (this.sane = 0),
      (this.back = 0),
      (this.was = 0);
  }
  const ze = (t) => {
      if (!t || !t.state) return Se;
      const e = t.state;
      return (
        (t.total_in = t.total_out = e.total = 0),
        (t.msg = ""),
        e.wrap && (t.adler = 1 & e.wrap),
        (e.mode = 1),
        (e.last = 0),
        (e.havedict = 0),
        (e.dmax = 32768),
        (e.head = null),
        (e.hold = 0),
        (e.bits = 0),
        (e.lencode = e.lendyn = new Int32Array(852)),
        (e.distcode = e.distdyn = new Int32Array(592)),
        (e.sane = 1),
        (e.back = -1),
        ke
      );
    },
    Me = (t) => {
      if (!t || !t.state) return Se;
      const e = t.state;
      return (e.wsize = 0), (e.whave = 0), (e.wnext = 0), ze(t);
    },
    Ue = (t, e) => {
      let r;
      if (!t || !t.state) return Se;
      const n = t.state;
      return (
        e < 0 ? ((r = 0), (e = -e)) : ((r = 1 + (e >> 4)), e < 48 && (e &= 15)),
        e && (e < 8 || e > 15)
          ? Se
          : (null !== n.window && n.wbits !== e && (n.window = null),
            (n.wrap = r),
            (n.wbits = e),
            Me(t))
      );
    },
    De = (t, e) => {
      if (!t) return Se;
      const r = new Pe();
      (t.state = r), (r.window = null);
      const n = Ue(t, e);
      return n !== ke && (t.state = null), n;
    };
  let He,
    Ne,
    Fe = !0;
  const je = (t) => {
      if (Fe) {
        (He = new Int32Array(512)), (Ne = new Int32Array(32));
        let e = 0;
        for (; e < 144; ) t.lens[e++] = 8;
        for (; e < 256; ) t.lens[e++] = 9;
        for (; e < 280; ) t.lens[e++] = 7;
        for (; e < 288; ) t.lens[e++] = 8;
        for (ge(1, t.lens, 0, 288, He, 0, t.work, { bits: 9 }), e = 0; e < 32; )
          t.lens[e++] = 5;
        ge(2, t.lens, 0, 32, Ne, 0, t.work, { bits: 5 }), (Fe = !1);
      }
      (t.lencode = He), (t.lenbits = 9), (t.distcode = Ne), (t.distbits = 5);
    },
    Ve = (t, e, r, n) => {
      let i;
      const o = t.state;
      return (
        null === o.window &&
          ((o.wsize = 1 << o.wbits),
          (o.wnext = 0),
          (o.whave = 0),
          (o.window = new Uint8Array(o.wsize))),
        n >= o.wsize
          ? (o.window.set(e.subarray(r - o.wsize, r), 0),
            (o.wnext = 0),
            (o.whave = o.wsize))
          : ((i = o.wsize - o.wnext),
            i > n && (i = n),
            o.window.set(e.subarray(r - n, r - n + i), o.wnext),
            (n -= i)
              ? (o.window.set(e.subarray(r - n, r), 0),
                (o.wnext = n),
                (o.whave = o.wsize))
              : ((o.wnext += i),
                o.wnext === o.wsize && (o.wnext = 0),
                o.whave < o.wsize && (o.whave += i))),
        0
      );
    };
  var Ke = Me,
    qe = De,
    Ze = (t, e) => {
      let r,
        n,
        i,
        o,
        s,
        a,
        c,
        u,
        l,
        h,
        d,
        f,
        p,
        _,
        m,
        w,
        y,
        g,
        b,
        v,
        E,
        k,
        A = 0;
      const x = new Uint8Array(4);
      let S, I;
      const C = new Uint8Array([
        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
      ]);
      if (!t || !t.state || !t.output || (!t.input && 0 !== t.avail_in))
        return Se;
      (r = t.state),
        r.mode === Te && (r.mode = 13),
        (s = t.next_out),
        (i = t.output),
        (c = t.avail_out),
        (o = t.next_in),
        (n = t.input),
        (a = t.avail_in),
        (u = r.hold),
        (l = r.bits),
        (h = a),
        (d = c),
        (k = ke);
      t: for (;;)
        switch (r.mode) {
          case 1:
            if (0 === r.wrap) {
              r.mode = 13;
              break;
            }
            for (; l < 16; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if (2 & r.wrap && 35615 === u) {
              (r.check = 0),
                (x[0] = 255 & u),
                (x[1] = (u >>> 8) & 255),
                (r.check = q(r.check, x, 2, 0)),
                (u = 0),
                (l = 0),
                (r.mode = 2);
              break;
            }
            if (
              ((r.flags = 0),
              r.head && (r.head.done = !1),
              !(1 & r.wrap) || (((255 & u) << 8) + (u >> 8)) % 31)
            ) {
              (t.msg = "incorrect header check"), (r.mode = Le);
              break;
            }
            if ((15 & u) !== Be) {
              (t.msg = "unknown compression method"), (r.mode = Le);
              break;
            }
            if (((u >>>= 4), (l -= 4), (E = 8 + (15 & u)), 0 === r.wbits))
              r.wbits = E;
            else if (E > r.wbits) {
              (t.msg = "invalid window size"), (r.mode = Le);
              break;
            }
            (r.dmax = 1 << r.wbits),
              (t.adler = r.check = 1),
              (r.mode = 512 & u ? 10 : Te),
              (u = 0),
              (l = 0);
            break;
          case 2:
            for (; l < 16; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if (((r.flags = u), (255 & r.flags) !== Be)) {
              (t.msg = "unknown compression method"), (r.mode = Le);
              break;
            }
            if (57344 & r.flags) {
              (t.msg = "unknown header flags set"), (r.mode = Le);
              break;
            }
            r.head && (r.head.text = (u >> 8) & 1),
              512 & r.flags &&
                ((x[0] = 255 & u),
                (x[1] = (u >>> 8) & 255),
                (r.check = q(r.check, x, 2, 0))),
              (u = 0),
              (l = 0),
              (r.mode = 3);
          case 3:
            for (; l < 32; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            r.head && (r.head.time = u),
              512 & r.flags &&
                ((x[0] = 255 & u),
                (x[1] = (u >>> 8) & 255),
                (x[2] = (u >>> 16) & 255),
                (x[3] = (u >>> 24) & 255),
                (r.check = q(r.check, x, 4, 0))),
              (u = 0),
              (l = 0),
              (r.mode = 4);
          case 4:
            for (; l < 16; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            r.head && ((r.head.xflags = 255 & u), (r.head.os = u >> 8)),
              512 & r.flags &&
                ((x[0] = 255 & u),
                (x[1] = (u >>> 8) & 255),
                (r.check = q(r.check, x, 2, 0))),
              (u = 0),
              (l = 0),
              (r.mode = 5);
          case 5:
            if (1024 & r.flags) {
              for (; l < 16; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (r.length = u),
                r.head && (r.head.extra_len = u),
                512 & r.flags &&
                  ((x[0] = 255 & u),
                  (x[1] = (u >>> 8) & 255),
                  (r.check = q(r.check, x, 2, 0))),
                (u = 0),
                (l = 0);
            } else r.head && (r.head.extra = null);
            r.mode = 6;
          case 6:
            if (
              1024 & r.flags &&
              ((f = r.length),
              f > a && (f = a),
              f &&
                (r.head &&
                  ((E = r.head.extra_len - r.length),
                  r.head.extra ||
                    (r.head.extra = new Uint8Array(r.head.extra_len)),
                  r.head.extra.set(n.subarray(o, o + f), E)),
                512 & r.flags && (r.check = q(r.check, n, f, o)),
                (a -= f),
                (o += f),
                (r.length -= f)),
              r.length)
            )
              break t;
            (r.length = 0), (r.mode = 7);
          case 7:
            if (2048 & r.flags) {
              if (0 === a) break t;
              f = 0;
              do {
                (E = n[o + f++]),
                  r.head &&
                    E &&
                    r.length < 65536 &&
                    (r.head.name += String.fromCharCode(E));
              } while (E && f < a);
              if (
                (512 & r.flags && (r.check = q(r.check, n, f, o)),
                (a -= f),
                (o += f),
                E)
              )
                break t;
            } else r.head && (r.head.name = null);
            (r.length = 0), (r.mode = 8);
          case 8:
            if (4096 & r.flags) {
              if (0 === a) break t;
              f = 0;
              do {
                (E = n[o + f++]),
                  r.head &&
                    E &&
                    r.length < 65536 &&
                    (r.head.comment += String.fromCharCode(E));
              } while (E && f < a);
              if (
                (512 & r.flags && (r.check = q(r.check, n, f, o)),
                (a -= f),
                (o += f),
                E)
              )
                break t;
            } else r.head && (r.head.comment = null);
            r.mode = 9;
          case 9:
            if (512 & r.flags) {
              for (; l < 16; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              if (u !== (65535 & r.check)) {
                (t.msg = "header crc mismatch"), (r.mode = Le);
                break;
              }
              (u = 0), (l = 0);
            }
            r.head && ((r.head.hcrc = (r.flags >> 9) & 1), (r.head.done = !0)),
              (t.adler = r.check = 0),
              (r.mode = Te);
            break;
          case 10:
            for (; l < 32; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            (t.adler = r.check = Oe(u)), (u = 0), (l = 0), (r.mode = 11);
          case 11:
            if (0 === r.havedict)
              return (
                (t.next_out = s),
                (t.avail_out = c),
                (t.next_in = o),
                (t.avail_in = a),
                (r.hold = u),
                (r.bits = l),
                xe
              );
            (t.adler = r.check = 1), (r.mode = Te);
          case Te:
            if (e === ve || e === Ee) break t;
          case 13:
            if (r.last) {
              (u >>>= 7 & l), (l -= 7 & l), (r.mode = 27);
              break;
            }
            for (; l < 3; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            switch (((r.last = 1 & u), (u >>>= 1), (l -= 1), 3 & u)) {
              case 0:
                r.mode = 14;
                break;
              case 1:
                if ((je(r), (r.mode = 20), e === Ee)) {
                  (u >>>= 2), (l -= 2);
                  break t;
                }
                break;
              case 2:
                r.mode = 17;
                break;
              case 3:
                (t.msg = "invalid block type"), (r.mode = Le);
            }
            (u >>>= 2), (l -= 2);
            break;
          case 14:
            for (u >>>= 7 & l, l -= 7 & l; l < 32; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if ((65535 & u) != ((u >>> 16) ^ 65535)) {
              (t.msg = "invalid stored block lengths"), (r.mode = Le);
              break;
            }
            if (
              ((r.length = 65535 & u),
              (u = 0),
              (l = 0),
              (r.mode = 15),
              e === Ee)
            )
              break t;
          case 15:
            r.mode = 16;
          case 16:
            if (((f = r.length), f)) {
              if ((f > a && (f = a), f > c && (f = c), 0 === f)) break t;
              i.set(n.subarray(o, o + f), s),
                (a -= f),
                (o += f),
                (c -= f),
                (s += f),
                (r.length -= f);
              break;
            }
            r.mode = Te;
            break;
          case 17:
            for (; l < 14; ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if (
              ((r.nlen = 257 + (31 & u)),
              (u >>>= 5),
              (l -= 5),
              (r.ndist = 1 + (31 & u)),
              (u >>>= 5),
              (l -= 5),
              (r.ncode = 4 + (15 & u)),
              (u >>>= 4),
              (l -= 4),
              r.nlen > 286 || r.ndist > 30)
            ) {
              (t.msg = "too many length or distance symbols"), (r.mode = Le);
              break;
            }
            (r.have = 0), (r.mode = 18);
          case 18:
            for (; r.have < r.ncode; ) {
              for (; l < 3; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (r.lens[C[r.have++]] = 7 & u), (u >>>= 3), (l -= 3);
            }
            for (; r.have < 19; ) r.lens[C[r.have++]] = 0;
            if (
              ((r.lencode = r.lendyn),
              (r.lenbits = 7),
              (S = { bits: r.lenbits }),
              (k = ge(0, r.lens, 0, 19, r.lencode, 0, r.work, S)),
              (r.lenbits = S.bits),
              k)
            ) {
              (t.msg = "invalid code lengths set"), (r.mode = Le);
              break;
            }
            (r.have = 0), (r.mode = 19);
          case 19:
            for (; r.have < r.nlen + r.ndist; ) {
              for (
                ;
                (A = r.lencode[u & ((1 << r.lenbits) - 1)]),
                  (m = A >>> 24),
                  (w = (A >>> 16) & 255),
                  (y = 65535 & A),
                  !(m <= l);

              ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              if (y < 16) (u >>>= m), (l -= m), (r.lens[r.have++] = y);
              else {
                if (16 === y) {
                  for (I = m + 2; l < I; ) {
                    if (0 === a) break t;
                    a--, (u += n[o++] << l), (l += 8);
                  }
                  if (((u >>>= m), (l -= m), 0 === r.have)) {
                    (t.msg = "invalid bit length repeat"), (r.mode = Le);
                    break;
                  }
                  (E = r.lens[r.have - 1]),
                    (f = 3 + (3 & u)),
                    (u >>>= 2),
                    (l -= 2);
                } else if (17 === y) {
                  for (I = m + 3; l < I; ) {
                    if (0 === a) break t;
                    a--, (u += n[o++] << l), (l += 8);
                  }
                  (u >>>= m),
                    (l -= m),
                    (E = 0),
                    (f = 3 + (7 & u)),
                    (u >>>= 3),
                    (l -= 3);
                } else {
                  for (I = m + 7; l < I; ) {
                    if (0 === a) break t;
                    a--, (u += n[o++] << l), (l += 8);
                  }
                  (u >>>= m),
                    (l -= m),
                    (E = 0),
                    (f = 11 + (127 & u)),
                    (u >>>= 7),
                    (l -= 7);
                }
                if (r.have + f > r.nlen + r.ndist) {
                  (t.msg = "invalid bit length repeat"), (r.mode = Le);
                  break;
                }
                for (; f--; ) r.lens[r.have++] = E;
              }
            }
            if (r.mode === Le) break;
            if (0 === r.lens[256]) {
              (t.msg = "invalid code -- missing end-of-block"), (r.mode = Le);
              break;
            }
            if (
              ((r.lenbits = 9),
              (S = { bits: r.lenbits }),
              (k = ge(1, r.lens, 0, r.nlen, r.lencode, 0, r.work, S)),
              (r.lenbits = S.bits),
              k)
            ) {
              (t.msg = "invalid literal/lengths set"), (r.mode = Le);
              break;
            }
            if (
              ((r.distbits = 6),
              (r.distcode = r.distdyn),
              (S = { bits: r.distbits }),
              (k = ge(2, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S)),
              (r.distbits = S.bits),
              k)
            ) {
              (t.msg = "invalid distances set"), (r.mode = Le);
              break;
            }
            if (((r.mode = 20), e === Ee)) break t;
          case 20:
            r.mode = 21;
          case 21:
            if (a >= 6 && c >= 258) {
              (t.next_out = s),
                (t.avail_out = c),
                (t.next_in = o),
                (t.avail_in = a),
                (r.hold = u),
                (r.bits = l),
                pe(t, d),
                (s = t.next_out),
                (i = t.output),
                (c = t.avail_out),
                (o = t.next_in),
                (n = t.input),
                (a = t.avail_in),
                (u = r.hold),
                (l = r.bits),
                r.mode === Te && (r.back = -1);
              break;
            }
            for (
              r.back = 0;
              (A = r.lencode[u & ((1 << r.lenbits) - 1)]),
                (m = A >>> 24),
                (w = (A >>> 16) & 255),
                (y = 65535 & A),
                !(m <= l);

            ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if (w && 0 == (240 & w)) {
              for (
                g = m, b = w, v = y;
                (A = r.lencode[v + ((u & ((1 << (g + b)) - 1)) >> g)]),
                  (m = A >>> 24),
                  (w = (A >>> 16) & 255),
                  (y = 65535 & A),
                  !(g + m <= l);

              ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (u >>>= g), (l -= g), (r.back += g);
            }
            if (
              ((u >>>= m), (l -= m), (r.back += m), (r.length = y), 0 === w)
            ) {
              r.mode = 26;
              break;
            }
            if (32 & w) {
              (r.back = -1), (r.mode = Te);
              break;
            }
            if (64 & w) {
              (t.msg = "invalid literal/length code"), (r.mode = Le);
              break;
            }
            (r.extra = 15 & w), (r.mode = 22);
          case 22:
            if (r.extra) {
              for (I = r.extra; l < I; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (r.length += u & ((1 << r.extra) - 1)),
                (u >>>= r.extra),
                (l -= r.extra),
                (r.back += r.extra);
            }
            (r.was = r.length), (r.mode = 23);
          case 23:
            for (
              ;
              (A = r.distcode[u & ((1 << r.distbits) - 1)]),
                (m = A >>> 24),
                (w = (A >>> 16) & 255),
                (y = 65535 & A),
                !(m <= l);

            ) {
              if (0 === a) break t;
              a--, (u += n[o++] << l), (l += 8);
            }
            if (0 == (240 & w)) {
              for (
                g = m, b = w, v = y;
                (A = r.distcode[v + ((u & ((1 << (g + b)) - 1)) >> g)]),
                  (m = A >>> 24),
                  (w = (A >>> 16) & 255),
                  (y = 65535 & A),
                  !(g + m <= l);

              ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (u >>>= g), (l -= g), (r.back += g);
            }
            if (((u >>>= m), (l -= m), (r.back += m), 64 & w)) {
              (t.msg = "invalid distance code"), (r.mode = Le);
              break;
            }
            (r.offset = y), (r.extra = 15 & w), (r.mode = 24);
          case 24:
            if (r.extra) {
              for (I = r.extra; l < I; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              (r.offset += u & ((1 << r.extra) - 1)),
                (u >>>= r.extra),
                (l -= r.extra),
                (r.back += r.extra);
            }
            if (r.offset > r.dmax) {
              (t.msg = "invalid distance too far back"), (r.mode = Le);
              break;
            }
            r.mode = 25;
          case 25:
            if (0 === c) break t;
            if (((f = d - c), r.offset > f)) {
              if (((f = r.offset - f), f > r.whave && r.sane)) {
                (t.msg = "invalid distance too far back"), (r.mode = Le);
                break;
              }
              f > r.wnext
                ? ((f -= r.wnext), (p = r.wsize - f))
                : (p = r.wnext - f),
                f > r.length && (f = r.length),
                (_ = r.window);
            } else (_ = i), (p = s - r.offset), (f = r.length);
            f > c && (f = c), (c -= f), (r.length -= f);
            do {
              i[s++] = _[p++];
            } while (--f);
            0 === r.length && (r.mode = 21);
            break;
          case 26:
            if (0 === c) break t;
            (i[s++] = r.length), c--, (r.mode = 21);
            break;
          case 27:
            if (r.wrap) {
              for (; l < 32; ) {
                if (0 === a) break t;
                a--, (u |= n[o++] << l), (l += 8);
              }
              if (
                ((d -= c),
                (t.total_out += d),
                (r.total += d),
                d &&
                  (t.adler = r.check =
                    r.flags
                      ? q(r.check, i, d, s - d)
                      : V(r.check, i, d, s - d)),
                (d = c),
                (r.flags ? u : Oe(u)) !== r.check)
              ) {
                (t.msg = "incorrect data check"), (r.mode = Le);
                break;
              }
              (u = 0), (l = 0);
            }
            r.mode = 28;
          case 28:
            if (r.wrap && r.flags) {
              for (; l < 32; ) {
                if (0 === a) break t;
                a--, (u += n[o++] << l), (l += 8);
              }
              if (u !== (4294967295 & r.total)) {
                (t.msg = "incorrect length check"), (r.mode = Le);
                break;
              }
              (u = 0), (l = 0);
            }
            r.mode = 29;
          case 29:
            k = Ae;
            break t;
          case Le:
            k = Ie;
            break t;
          case 31:
            return Ce;
          default:
            return Se;
        }
      return (
        (t.next_out = s),
        (t.avail_out = c),
        (t.next_in = o),
        (t.avail_in = a),
        (r.hold = u),
        (r.bits = l),
        (r.wsize ||
          (d !== t.avail_out && r.mode < Le && (r.mode < 27 || e !== be))) &&
          Ve(t, t.output, t.next_out, d - t.avail_out),
        (h -= t.avail_in),
        (d -= t.avail_out),
        (t.total_in += h),
        (t.total_out += d),
        (r.total += d),
        r.wrap &&
          d &&
          (t.adler = r.check =
            r.flags
              ? q(r.check, i, d, t.next_out - d)
              : V(r.check, i, d, t.next_out - d)),
        (t.data_type =
          r.bits +
          (r.last ? 64 : 0) +
          (r.mode === Te ? 128 : 0) +
          (20 === r.mode || 15 === r.mode ? 256 : 0)),
        ((0 === h && 0 === d) || e === be) && k === ke && (k = Re),
        k
      );
    },
    Xe = (t) => {
      if (!t || !t.state) return Se;
      let e = t.state;
      return e.window && (e.window = null), (t.state = null), ke;
    },
    $e = (t, e) => {
      if (!t || !t.state) return Se;
      const r = t.state;
      return 0 == (2 & r.wrap) ? Se : ((r.head = e), (e.done = !1), ke);
    },
    We = (t, e) => {
      const r = e.length;
      let n, i, o;
      return t && t.state
        ? ((n = t.state),
          0 !== n.wrap && 11 !== n.mode
            ? Se
            : 11 === n.mode && ((i = 1), (i = V(i, e, r, 0)), i !== n.check)
            ? Ie
            : ((o = Ve(t, e, r, r)),
              o ? ((n.mode = 31), Ce) : ((n.havedict = 1), ke)))
        : Se;
    },
    Ge = function () {
      (this.text = 0),
        (this.time = 0),
        (this.xflags = 0),
        (this.os = 0),
        (this.extra = null),
        (this.extra_len = 0),
        (this.name = ""),
        (this.comment = ""),
        (this.hcrc = 0),
        (this.done = !1);
    };
  const Je = Object.prototype.toString,
    {
      Z_NO_FLUSH: Ye,
      Z_FINISH: Qe,
      Z_OK: tr,
      Z_STREAM_END: er,
      Z_NEED_DICT: rr,
      Z_STREAM_ERROR: nr,
      Z_DATA_ERROR: ir,
      Z_MEM_ERROR: or,
    } = X;
  function sr(t) {
    this.options = Xt({ chunkSize: 65536, windowBits: 15, to: "" }, t || {});
    const e = this.options;
    e.raw &&
      e.windowBits >= 0 &&
      e.windowBits < 16 &&
      ((e.windowBits = -e.windowBits),
      0 === e.windowBits && (e.windowBits = -15)),
      !(e.windowBits >= 0 && e.windowBits < 16) ||
        (t && t.windowBits) ||
        (e.windowBits += 32),
      e.windowBits > 15 &&
        e.windowBits < 48 &&
        0 == (15 & e.windowBits) &&
        (e.windowBits |= 15),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new te()),
      (this.strm.avail_out = 0);
    let r = qe(this.strm, e.windowBits);
    if (r !== tr) throw new Error(Z[r]);
    if (
      ((this.header = new Ge()),
      $e(this.strm, this.header),
      e.dictionary &&
        ("string" == typeof e.dictionary
          ? (e.dictionary = Jt(e.dictionary))
          : "[object ArrayBuffer]" === Je.call(e.dictionary) &&
            (e.dictionary = new Uint8Array(e.dictionary)),
        e.raw && ((r = We(this.strm, e.dictionary)), r !== tr)))
    )
      throw new Error(Z[r]);
  }
  function ar(t, e) {
    const r = new sr(e);
    if ((r.push(t), r.err)) throw r.msg || Z[r.err];
    return r.result;
  }
  (sr.prototype.push = function (t, e) {
    const r = this.strm,
      n = this.options.chunkSize,
      i = this.options.dictionary;
    let o, s, a;
    if (this.ended) return !1;
    for (
      s = e === ~~e ? e : !0 === e ? Qe : Ye,
        "[object ArrayBuffer]" === Je.call(t)
          ? (r.input = new Uint8Array(t))
          : (r.input = t),
        r.next_in = 0,
        r.avail_in = r.input.length;
      ;

    ) {
      for (
        0 === r.avail_out &&
          ((r.output = new Uint8Array(n)), (r.next_out = 0), (r.avail_out = n)),
          o = Ze(r, s),
          o === rr &&
            i &&
            ((o = We(r, i)), o === tr ? (o = Ze(r, s)) : o === ir && (o = rr));
        r.avail_in > 0 && o === er && r.state.wrap > 0 && 0 !== t[r.next_in];

      )
        Ke(r), (o = Ze(r, s));
      switch (o) {
        case nr:
        case ir:
        case rr:
        case or:
          return this.onEnd(o), (this.ended = !0), !1;
      }
      if (((a = r.avail_out), r.next_out && (0 === r.avail_out || o === er)))
        if ("string" === this.options.to) {
          let t = Qt(r.output, r.next_out),
            e = r.next_out - t,
            i = Yt(r.output, t);
          (r.next_out = e),
            (r.avail_out = n - e),
            e && r.output.set(r.output.subarray(t, t + e), 0),
            this.onData(i);
        } else
          this.onData(
            r.output.length === r.next_out
              ? r.output
              : r.output.subarray(0, r.next_out)
          );
      if (o !== tr || 0 !== a) {
        if (o === er)
          return (o = Xe(this.strm)), this.onEnd(o), (this.ended = !0), !0;
        if (0 === r.avail_in) break;
      }
    }
    return !0;
  }),
    (sr.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (sr.prototype.onEnd = function (t) {
      t === tr &&
        ("string" === this.options.to
          ? (this.result = this.chunks.join(""))
          : (this.result = $t(this.chunks))),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg);
    });
  var cr = {
    Inflate: sr,
    inflate: ar,
    inflateRaw: function (t, e) {
      return ((e = e || {}).raw = !0), ar(t, e);
    },
    ungzip: ar,
    constants: X,
  };
  const { Deflate: ur, deflate: lr, deflateRaw: hr, gzip: dr } = fe,
    { Inflate: fr, inflate: pr, inflateRaw: _r, ungzip: mr } = cr;
  var wr = pr,
    yr = __webpack_require__(729),
    gr = __webpack_require__.n(yr);
  const br =
    ((vr = { ok: () => __WEBPACK_EXTERNAL_MODULE_assert__.ok }),
    (Er = {}),
    __webpack_require__.d(Er, vr),
    Er);
  var vr,
    Er,
    kr = Object.freeze({
      __proto__: null,
      encode: function (t) {
        return t.reduce((t, e) => t + e.toString(16).padStart(2, "0"), "0x");
      },
      decode: function (e) {
        0 === e.indexOf("0x") && (e = e.substr(2)),
          e.length % 2 == 1 && (e = "0" + e);
        let r = e.match(/.{2}/g);
        return null === r
          ? t.Buffer.from([])
          : t.Buffer.from(r.map((t) => parseInt(t, 16)));
      },
    });
  function Ar(t) {
    return new TextDecoder("utf-8").decode(t);
  }
  function xr(t) {
    return new TextEncoder().encode(t);
  }
  var Sr = Object.freeze({ __proto__: null, decode: Ar, encode: xr });
  function Ir(t) {
    return i().encode(t);
  }
  var Cr = Object.freeze({
    __proto__: null,
    encode: Ir,
    decode: function (t) {
      return i().decode(t);
    },
  });
  function Rr(e) {
    return t.Buffer.from(o.b$(e));
  }
  var Br = Object.freeze({
      __proto__: null,
      encode: function (t) {
        return o.JQ(t);
      },
      decode: Rr,
    }),
    Tr = Object.freeze({
      __proto__: null,
      hex: kr,
      utf8: Sr,
      bs58: Cr,
      base64: Br,
    });
  function Lr(t) {
    const e = new Map();
    return (
      t.errors &&
        t.errors.forEach((t) => {
          var r;
          let n = null !== (r = t.msg) && void 0 !== r ? r : t.name;
          e.set(t.code, n);
        }),
      e
    );
  }
  function Or(t, ...e) {
    if (t.args.length != e.length) throw new Error("Invalid argument length");
    const r = {};
    let n = 0;
    return (
      t.args.forEach((t) => {
        (r[t.name] = e[n]), (n += 1);
      }),
      r
    );
  }
  function Pr(t, e = {}) {
    t.forEach((t) => {
      if ("accounts" in t) Pr(t.accounts, e[t.name]);
      else if (void 0 === e[t.name])
        throw new Error(`Invalid arguments: ${t.name} not provided.`);
    });
  }
  function zr(t) {
    return t instanceof e.PublicKey ? t : new e.PublicKey(t);
  }
  class Mr extends TypeError {
    constructor(t, e) {
      let r;
      const { message: n, ...i } = t,
        { path: o } = t;
      super(0 === o.length ? n : "At path: " + o.join(".") + " -- " + n),
        Object.assign(this, i),
        (this.name = this.constructor.name),
        (this.failures = () => {
          var n;
          return null != (n = r) ? n : (r = [t, ...e()]);
        });
    }
  }
  function Ur(t) {
    return "object" == typeof t && null != t;
  }
  function Dr(t) {
    return "string" == typeof t ? JSON.stringify(t) : "" + t;
  }
  function Hr(t, e, r, n) {
    if (!0 === t) return;
    !1 === t ? (t = {}) : "string" == typeof t && (t = { message: t });
    const { path: i, branch: o } = e,
      { type: s } = r,
      {
        refinement: a,
        message: c = "Expected a value of type `" +
          s +
          "`" +
          (a ? " with refinement `" + a + "`" : "") +
          ", but received: `" +
          Dr(n) +
          "`",
      } = t;
    return {
      value: n,
      type: s,
      refinement: a,
      key: i[i.length - 1],
      path: i,
      branch: o,
      ...t,
      message: c,
    };
  }
  function* Nr(t, e, r, n) {
    var i;
    (Ur((i = t)) && "function" == typeof i[Symbol.iterator]) || (t = [t]);
    for (const i of t) {
      const t = Hr(i, e, r, n);
      t && (yield t);
    }
  }
  function* Fr(t, e, r = {}) {
    const { path: n = [], branch: i = [t], coerce: o = !1, mask: s = !1 } = r,
      a = { path: n, branch: i };
    if (
      o &&
      ((t = e.coercer(t, a)),
      s && "type" !== e.type && Ur(e.schema) && Ur(t) && !Array.isArray(t))
    )
      for (const r in t) void 0 === e.schema[r] && delete t[r];
    let c = !0;
    for (const r of e.validator(t, a)) (c = !1), yield [r, void 0];
    for (let [r, u, l] of e.entries(t, a)) {
      const e = Fr(u, l, {
        path: void 0 === r ? n : [...n, r],
        branch: void 0 === r ? i : [...i, u],
        coerce: o,
        mask: s,
      });
      for (const n of e)
        n[0]
          ? ((c = !1), yield [n[0], void 0])
          : o &&
            ((u = n[1]),
            void 0 === r
              ? (t = u)
              : t instanceof Map
              ? t.set(r, u)
              : t instanceof Set
              ? t.add(u)
              : Ur(t) && (t[r] = u));
    }
    if (c) for (const r of e.refiner(t, a)) (c = !1), yield [r, void 0];
    c && (yield [void 0, t]);
  }
  class jr {
    constructor(t) {
      const {
        type: e,
        schema: r,
        validator: n,
        refiner: i,
        coercer: o = (t) => t,
        entries: s = function* () {},
      } = t;
      (this.type = e),
        (this.schema = r),
        (this.entries = s),
        (this.coercer = o),
        (this.validator = n ? (t, e) => Nr(n(t, e), e, this, t) : () => []),
        (this.refiner = i ? (t, e) => Nr(i(t, e), e, this, t) : () => []);
    }
    assert(t) {
      return (function (t, e) {
        const r = qr(t, e);
        if (r[0]) throw r[0];
      })(t, this);
    }
    create(t) {
      return Vr(t, this);
    }
    is(t) {
      return Kr(t, this);
    }
    mask(t) {
      return (function (t, e) {
        const r = qr(t, e, { coerce: !0, mask: !0 });
        if (r[0]) throw r[0];
        return r[1];
      })(t, this);
    }
    validate(t, e = {}) {
      return qr(t, this, e);
    }
  }
  function Vr(t, e) {
    const r = qr(t, e, { coerce: !0 });
    if (r[0]) throw r[0];
    return r[1];
  }
  function Kr(t, e) {
    return !qr(t, e)[0];
  }
  function qr(t, e, r = {}) {
    const n = Fr(t, e, r),
      i = (function (t) {
        const { done: e, value: r } = t.next();
        return e ? void 0 : r;
      })(n);
    return i[0]
      ? [
          new Mr(i[0], function* () {
            for (const t of n) t[0] && (yield t[0]);
          }),
          void 0,
        ]
      : [void 0, i[1]];
  }
  function Zr(t, e) {
    return new jr({ type: t, schema: null, validator: e });
  }
  function Xr(t) {
    return new jr({
      type: "array",
      schema: t,
      *entries(e) {
        if (t && Array.isArray(e))
          for (const [r, n] of e.entries()) yield [r, n, t];
      },
      coercer: (t) => (Array.isArray(t) ? t.slice() : t),
      validator: (t) =>
        Array.isArray(t) || "Expected an array value, but received: " + Dr(t),
    });
  }
  function $r(t) {
    const e = Dr(t),
      r = typeof t;
    return new jr({
      type: "literal",
      schema: "string" === r || "number" === r || "boolean" === r ? t : null,
      validator: (r) =>
        r === t || "Expected the literal `" + e + "`, but received: " + Dr(r),
    });
  }
  function Wr(t) {
    return new jr({
      ...t,
      validator: (e, r) => null === e || t.validator(e, r),
      refiner: (e, r) => null === e || t.refiner(e, r),
    });
  }
  function Gr() {
    return Zr(
      "number",
      (t) =>
        ("number" == typeof t && !isNaN(t)) ||
        "Expected a number, but received: " + Dr(t)
    );
  }
  function Jr(t) {
    return new jr({
      ...t,
      validator: (e, r) => void 0 === e || t.validator(e, r),
      refiner: (e, r) => void 0 === e || t.refiner(e, r),
    });
  }
  function Yr() {
    return Zr(
      "string",
      (t) => "string" == typeof t || "Expected a string, but received: " + Dr(t)
    );
  }
  function Qr(t) {
    const e = Object.keys(t);
    return new jr({
      type: "type",
      schema: t,
      *entries(r) {
        if (Ur(r)) for (const n of e) yield [n, r[n], t[n]];
      },
      validator: (t) => Ur(t) || "Expected an object, but received: " + Dr(t),
    });
  }
  function tn(t) {
    const e = t.map((t) => t.type).join(" | ");
    return new jr({
      type: "union",
      schema: null,
      validator(r, n) {
        const i = [];
        for (const e of t) {
          const [...t] = Fr(r, e, n),
            [o] = t;
          if (!o[0]) return [];
          for (const [e] of t) e && i.push(e);
        }
        return [
          "Expected the value to satisfy a union of `" +
            e +
            "`, but received: " +
            Dr(r),
          ...i,
        ];
      },
    });
  }
  function en() {
    return Zr("unknown", () => !0);
  }
  async function rn(t, e, r) {
    if (e.length <= 99) return await nn(t, e, r);
    {
      const n = (function (t, e) {
        return Array.apply(0, new Array(Math.ceil(t.length / 99))).map((e, r) =>
          t.slice(99 * r, 99 * (r + 1))
        );
      })(e);
      return (await Promise.all(n.map((e) => nn(t, e, r)))).flat();
    }
  }
  async function nn(t, e, r) {
    const n = null != r ? r : t.commitment;
    return (await t.getMultipleAccountsInfo(e, n)).map((t, r) =>
      null === t ? null : { publicKey: e[r], account: t }
    );
  }
  async function on(t, r, n, i, o) {
    n && n.length > 0 && r.sign(...n);
    const s = r._compile(),
      a = s.serialize(),
      c = r._serialize(a).toString("base64"),
      u = { encoding: "base64", commitment: null != i ? i : t.commitment };
    if (o) {
      const t = (Array.isArray(o) ? o : s.nonProgramIds()).map((t) =>
        t.toBase58()
      );
      u.accounts = { encoding: "base64", addresses: t };
    }
    n && (u.sigVerify = !0);
    const l = [c, u],
      h = Vr(await t._rpcRequest("simulateTransaction", l), cn);
    if ("error" in h) {
      let t;
      if (
        "data" in h.error &&
        ((t = h.error.data.logs), t && Array.isArray(t))
      ) {
        const e = "\n    ",
          r = e + t.join(e);
        console.error(h.error.message, r);
      }
      throw new e.SendTransactionError(
        "failed to simulate transaction: " + h.error.message,
        t
      );
    }
    return h.result;
  }
  const sn = an(en());
  function an(t) {
    return tn([
      Qr({ jsonrpc: $r("2.0"), id: Yr(), result: t }),
      Qr({
        jsonrpc: $r("2.0"),
        id: Yr(),
        error: Qr({ code: en(), message: Yr(), data: Jr(Zr("any", () => !0)) }),
      }),
    ]);
  }
  const cn =
    ((ln = Qr({
      err: Wr(tn([Qr({}), Yr()])),
      logs: Wr(Xr(Yr())),
      accounts: Jr(
        Wr(
          Xr(
            Wr(
              Qr({
                executable: Zr("boolean", (t) => "boolean" == typeof t),
                owner: Yr(),
                lamports: Gr(),
                data: Xr(Yr()),
                rentEpoch: Jr(Gr()),
              })
            )
          )
        )
      ),
      unitsConsumed: Jr(Gr()),
    })),
    (function (t, e, r) {
      return new jr({
        ...t,
        coercer: (n, i) => (Kr(n, e) ? t.coercer(r(n), i) : t.coercer(n, i)),
      });
    })(an((un = Qr({ context: Qr({ slot: Gr() }), value: ln }))), sn, (t) =>
      "error" in t ? t : { ...t, result: Vr(t.result, un) }
    ));
  var un,
    ln,
    hn = Object.freeze({
      __proto__: null,
      invoke: async function (t, r, n, i) {
        (t = zr(t)), i || (i = wn());
        const o = new e.Transaction();
        if (
          (o.add(
            new e.TransactionInstruction({
              programId: t,
              keys: null != r ? r : [],
              data: n,
            })
          ),
          void 0 === i.sendAndConfirm)
        )
          throw new Error(
            "This function requires 'Provider.sendAndConfirm' to be implemented."
          );
        return await i.sendAndConfirm(o, []);
      },
      getMultipleAccounts: rn,
      simulateTransaction: on,
    });
  class dn {
    constructor(t, e, r) {
      (this.connection = t), (this.wallet = e), (this.opts = r);
    }
    static defaultOptions() {
      return { preflightCommitment: "processed", commitment: "processed" };
    }
    static local(t, e) {
      throw new Error("Provider local is not available on browser.");
    }
    static env() {
      throw new Error("Provider env is not available on browser.");
    }
    async sendAndConfirm(t, r, n) {
      var i;
      void 0 === n && (n = this.opts),
        (t.feePayer = this.wallet.publicKey),
        (t.recentBlockhash = (
          await this.connection.getRecentBlockhash(n.preflightCommitment)
        ).blockhash),
        (t = await this.wallet.signTransaction(t)),
        (null != r ? r : []).forEach((e) => {
          t.partialSign(e);
        });
      const o = t.serialize();
      try {
        return await pn(this.connection, o, n);
      } catch (r) {
        if (r instanceof _n) {
          const n = await this.connection.getTransaction(Ir(t.signature), {
            commitment: "confirmed",
          });
          if (n) {
            const t =
              null === (i = n.meta) || void 0 === i ? void 0 : i.logMessages;
            throw t ? new e.SendTransactionError(r.message, t) : r;
          }
          throw r;
        }
        throw r;
      }
    }
    async sendAll(t, e) {
      void 0 === e && (e = this.opts);
      const r = await this.connection.getRecentBlockhash(e.preflightCommitment);
      let n = t.map((t) => {
        var e;
        let n = t.tx,
          i = null !== (e = t.signers) && void 0 !== e ? e : [];
        return (
          (n.feePayer = this.wallet.publicKey),
          (n.recentBlockhash = r.blockhash),
          i.forEach((t) => {
            n.partialSign(t);
          }),
          n
        );
      });
      const i = await this.wallet.signAllTransactions(n),
        o = [];
      for (let t = 0; t < n.length; t += 1) {
        const r = i[t].serialize();
        o.push(await pn(this.connection, r, e));
      }
      return o;
    }
    async simulate(t, e, r, n) {
      (t.feePayer = this.wallet.publicKey),
        (t.recentBlockhash = (
          await this.connection.getLatestBlockhash(
            null != r ? r : this.connection.commitment
          )
        ).blockhash),
        (t = await this.wallet.signTransaction(t));
      const i = await on(this.connection, t, e, r, n);
      if (i.value.err) throw new fn(i.value);
      return i.value;
    }
  }
  class fn extends Error {
    constructor(t, e) {
      super(e), (this.simulationResponse = t);
    }
  }
  async function pn(t, e, r) {
    const n = r && {
        skipPreflight: r.skipPreflight,
        preflightCommitment: r.preflightCommitment || r.commitment,
      },
      i = await t.sendRawTransaction(e, n),
      o = (await t.confirmTransaction(i, r && r.commitment)).value;
    if (o.err)
      throw new _n(`Raw transaction ${i} failed (${JSON.stringify(o)})`);
    return i;
  }
  class _n extends Error {
    constructor(t) {
      super(t);
    }
  }
  function mn(t) {
    yn = t;
  }
  function wn() {
    return null === yn ? dn.local() : yn;
  }
  let yn = null;
  const gn = new Set(["anchor-deprecated-state", "debug-logs"]),
    bn = new Map();
  function vn(t) {
    return void 0 !== bn.get(t);
  }
  var En = Object.freeze({
    __proto__: null,
    set: function (t) {
      if (!gn.has(t)) throw new Error("Invalid feature");
      bn.set(t, !0);
    },
    isSet: vn,
  });
  class kn extends Error {
    constructor(t) {
      super(t), (this.name = "IdlError");
    }
  }
  class An {
    constructor(t) {
      this.stack = t;
    }
    static parse(t) {
      var r;
      const n = /^Program (\w*) invoke/,
        i = /^Program \w* success/,
        o = [];
      for (let s = 0; s < t.length; s++) {
        if (i.exec(t[s])) {
          o.pop();
          continue;
        }
        const a = null === (r = n.exec(t[s])) || void 0 === r ? void 0 : r[1];
        a && o.push(new e.PublicKey(a));
      }
      return new An(o);
    }
  }
  class xn extends Error {
    constructor(t, e, r, n, i, o) {
      super(r.join("\n").replace("Program log: ", "")),
        (this.errorLogs = r),
        (this.logs = n),
        (this.error = {
          errorCode: t,
          errorMessage: e,
          comparedValues: o,
          origin: i,
        }),
        (this._programErrorStack = An.parse(n));
    }
    static parse(t) {
      if (!t) return null;
      const r = t.findIndex((t) => t.startsWith("Program log: AnchorError"));
      if (-1 === r) return null;
      const n = t[r],
        i = [n];
      let o;
      if (r + 1 < t.length)
        if ("Program log: Left:" === t[r + 1]) {
          const n = /^Program log: (.*)$/,
            s = n.exec(t[r + 2])[1],
            a = n.exec(t[r + 4])[1];
          (o = [new e.PublicKey(s), new e.PublicKey(a)]),
            i.push(...t.slice(r + 1, r + 5));
        } else if (t[r + 1].startsWith("Program log: Left:")) {
          const e = /^Program log: (Left|Right): (.*)$/,
            n = e.exec(t[r + 1])[2],
            s = e.exec(t[r + 2])[2];
          i.push(...t.slice(r + 1, r + 3)), (o = [n, s]);
        }
      const s =
          /^Program log: AnchorError occurred\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n
          ),
        a =
          /^Program log: AnchorError thrown in (.*):(\d*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n
          ),
        c =
          /^Program log: AnchorError caused by account: (.*)\. Error Code: (.*)\. Error Number: (\d*)\. Error Message: (.*)\./.exec(
            n
          );
      if (s) {
        const [e, r, n] = s.slice(1, 4),
          a = { code: e, number: parseInt(r) };
        return new xn(a, n, i, t, void 0, o);
      }
      if (a) {
        const [e, r, n, s, c] = a.slice(1, 6),
          u = { code: n, number: parseInt(s) },
          l = { file: e, line: parseInt(r) };
        return new xn(u, c, i, t, l, o);
      }
      if (c) {
        const [e, r, n, s] = c.slice(1, 5),
          a = e,
          u = { code: r, number: parseInt(n) };
        return new xn(u, s, i, t, a, o);
      }
      return null;
    }
    get program() {
      return this._programErrorStack.stack[
        this._programErrorStack.stack.length - 1
      ];
    }
    get programErrorStack() {
      return this._programErrorStack.stack;
    }
    toString() {
      return this.message;
    }
  }
  class Sn extends Error {
    constructor(t, e, r) {
      super(),
        (this.code = t),
        (this.msg = e),
        (this.logs = r),
        r && (this._programErrorStack = An.parse(r));
    }
    static parse(t, e) {
      const r = t.toString();
      let n, i;
      if (r.includes("custom program error:")) {
        let t = r.split("custom program error: ");
        if (2 !== t.length) return null;
        n = t[1];
      } else {
        const t = r.match(/"Custom":([0-9]+)}/g);
        if (!t || t.length > 1) return null;
        n = t[0].match(/([0-9]+)/g)[0];
      }
      try {
        i = parseInt(n);
      } catch (t) {
        return null;
      }
      let o = e.get(i);
      return void 0 !== o
        ? new Sn(i, o, t.logs)
        : ((o = Rn.get(i)), void 0 !== o ? new Sn(i, o, t.logs) : null);
    }
    get program() {
      var t;
      return null === (t = this._programErrorStack) || void 0 === t
        ? void 0
        : t.stack[this._programErrorStack.stack.length - 1];
    }
    get programErrorStack() {
      var t;
      return null === (t = this._programErrorStack) || void 0 === t
        ? void 0
        : t.stack;
    }
    toString() {
      return this.msg;
    }
  }
  function In(t, e) {
    vn("debug-logs") && console.log("Translating error:", t);
    const r = xn.parse(t.logs);
    if (r) return r;
    const n = Sn.parse(t, e);
    if (n) return n;
    if (t.logs) {
      const e = {
        get: function (e, r) {
          return "programErrorStack" === r
            ? e.programErrorStack.stack
            : "program" === r
            ? e.programErrorStack.stack[t.programErrorStack.stack.length - 1]
            : Reflect.get(...arguments);
        },
      };
      return (t.programErrorStack = An.parse(t.logs)), new Proxy(t, e);
    }
    return t;
  }
  const Cn = {
      InstructionMissing: 100,
      InstructionFallbackNotFound: 101,
      InstructionDidNotDeserialize: 102,
      InstructionDidNotSerialize: 103,
      IdlInstructionStub: 1e3,
      IdlInstructionInvalidProgram: 1001,
      ConstraintMut: 2e3,
      ConstraintHasOne: 2001,
      ConstraintSigner: 2002,
      ConstraintRaw: 2003,
      ConstraintOwner: 2004,
      ConstraintRentExempt: 2005,
      ConstraintSeeds: 2006,
      ConstraintExecutable: 2007,
      ConstraintState: 2008,
      ConstraintAssociated: 2009,
      ConstraintAssociatedInit: 2010,
      ConstraintClose: 2011,
      ConstraintAddress: 2012,
      ConstraintZero: 2013,
      ConstraintTokenMint: 2014,
      ConstraintTokenOwner: 2015,
      ConstraintMintMintAuthority: 2016,
      ConstraintMintFreezeAuthority: 2017,
      ConstraintMintDecimals: 2018,
      ConstraintSpace: 2019,
      RequireViolated: 2500,
      RequireEqViolated: 2501,
      RequireKeysEqViolated: 2502,
      RequireNeqViolated: 2503,
      RequireKeysNeqViolated: 2504,
      RequireGtViolated: 2505,
      RequireGteViolated: 2506,
      AccountDiscriminatorAlreadySet: 3e3,
      AccountDiscriminatorNotFound: 3001,
      AccountDiscriminatorMismatch: 3002,
      AccountDidNotDeserialize: 3003,
      AccountDidNotSerialize: 3004,
      AccountNotEnoughKeys: 3005,
      AccountNotMutable: 3006,
      AccountOwnedByWrongProgram: 3007,
      InvalidProgramId: 3008,
      InvalidProgramExecutable: 3009,
      AccountNotSigner: 3010,
      AccountNotSystemOwned: 3011,
      AccountNotInitialized: 3012,
      AccountNotProgramData: 3013,
      AccountNotAssociatedTokenAccount: 3014,
      AccountSysvarMismatch: 3015,
      StateInvalidAddress: 4e3,
      DeclaredProgramIdMismatch: 4100,
      Deprecated: 5e3,
    },
    Rn = new Map([
      [Cn.InstructionMissing, "8 byte instruction identifier not provided"],
      [Cn.InstructionFallbackNotFound, "Fallback functions are not supported"],
      [
        Cn.InstructionDidNotDeserialize,
        "The program could not deserialize the given instruction",
      ],
      [
        Cn.InstructionDidNotSerialize,
        "The program could not serialize the given instruction",
      ],
      [
        Cn.IdlInstructionStub,
        "The program was compiled without idl instructions",
      ],
      [
        Cn.IdlInstructionInvalidProgram,
        "The transaction was given an invalid program for the IDL instruction",
      ],
      [Cn.ConstraintMut, "A mut constraint was violated"],
      [Cn.ConstraintHasOne, "A has_one constraint was violated"],
      [Cn.ConstraintSigner, "A signer constraint was violated"],
      [Cn.ConstraintRaw, "A raw constraint was violated"],
      [Cn.ConstraintOwner, "An owner constraint was violated"],
      [Cn.ConstraintRentExempt, "A rent exemption constraint was violated"],
      [Cn.ConstraintSeeds, "A seeds constraint was violated"],
      [Cn.ConstraintExecutable, "An executable constraint was violated"],
      [Cn.ConstraintState, "A state constraint was violated"],
      [Cn.ConstraintAssociated, "An associated constraint was violated"],
      [
        Cn.ConstraintAssociatedInit,
        "An associated init constraint was violated",
      ],
      [Cn.ConstraintClose, "A close constraint was violated"],
      [Cn.ConstraintAddress, "An address constraint was violated"],
      [Cn.ConstraintZero, "Expected zero account discriminant"],
      [Cn.ConstraintTokenMint, "A token mint constraint was violated"],
      [Cn.ConstraintTokenOwner, "A token owner constraint was violated"],
      [
        Cn.ConstraintMintMintAuthority,
        "A mint mint authority constraint was violated",
      ],
      [
        Cn.ConstraintMintFreezeAuthority,
        "A mint freeze authority constraint was violated",
      ],
      [Cn.ConstraintMintDecimals, "A mint decimals constraint was violated"],
      [Cn.ConstraintSpace, "A space constraint was violated"],
      [Cn.RequireViolated, "A require expression was violated"],
      [Cn.RequireEqViolated, "A require_eq expression was violated"],
      [Cn.RequireKeysEqViolated, "A require_keys_eq expression was violated"],
      [Cn.RequireNeqViolated, "A require_neq expression was violated"],
      [Cn.RequireKeysNeqViolated, "A require_keys_neq expression was violated"],
      [Cn.RequireGtViolated, "A require_gt expression was violated"],
      [Cn.RequireGteViolated, "A require_gte expression was violated"],
      [
        Cn.AccountDiscriminatorAlreadySet,
        "The account discriminator was already set on this account",
      ],
      [
        Cn.AccountDiscriminatorNotFound,
        "No 8 byte discriminator was found on the account",
      ],
      [
        Cn.AccountDiscriminatorMismatch,
        "8 byte discriminator did not match what was expected",
      ],
      [Cn.AccountDidNotDeserialize, "Failed to deserialize the account"],
      [Cn.AccountDidNotSerialize, "Failed to serialize the account"],
      [
        Cn.AccountNotEnoughKeys,
        "Not enough account keys given to the instruction",
      ],
      [Cn.AccountNotMutable, "The given account is not mutable"],
      [
        Cn.AccountOwnedByWrongProgram,
        "The given account is owned by a different program than expected",
      ],
      [Cn.InvalidProgramId, "Program ID was not as expected"],
      [Cn.InvalidProgramExecutable, "Program account is not executable"],
      [Cn.AccountNotSigner, "The given account did not sign"],
      [
        Cn.AccountNotSystemOwned,
        "The given account is not owned by the system program",
      ],
      [
        Cn.AccountNotInitialized,
        "The program expected this account to be already initialized",
      ],
      [
        Cn.AccountNotProgramData,
        "The given account is not a program data account",
      ],
      [
        Cn.AccountNotAssociatedTokenAccount,
        "The given account is not the associated token account",
      ],
      [
        Cn.AccountSysvarMismatch,
        "The given public key does not match the required sysvar",
      ],
      [
        Cn.StateInvalidAddress,
        "The given state account does not have the correct address",
      ],
      [
        Cn.DeclaredProgramIdMismatch,
        "The declared program id does not match the actual program id",
      ],
      [
        Cn.Deprecated,
        "The API being used is deprecated and should no longer be used",
      ],
    ]);
  var Bn = function () {
    return (
      (Bn =
        Object.assign ||
        function (t) {
          for (var e, r = 1, n = arguments.length; r < n; r++)
            for (var i in (e = arguments[r]))
              Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
          return t;
        }),
      Bn.apply(this, arguments)
    );
  };
  function Tn(t) {
    return t.toLowerCase();
  }
  var Ln = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g],
    On = /[^A-Z0-9]+/gi;
  function Pn(t, e, r) {
    return e instanceof RegExp
      ? t.replace(e, r)
      : e.reduce(function (t, e) {
          return t.replace(e, r);
        }, t);
  }
  class zn {
    static fieldLayout(t, e) {
      const r = void 0 !== t.name ? a()(t.name) : void 0;
      switch (t.type) {
        case "bool":
          return u.bool(r);
        case "u8":
          return u.u8(r);
        case "i8":
          return u.i8(r);
        case "u16":
          return u.u16(r);
        case "i16":
          return u.i16(r);
        case "u32":
          return u.u32(r);
        case "i32":
          return u.i32(r);
        case "f32":
          return u.f32(r);
        case "u64":
          return u.u64(r);
        case "i64":
          return u.i64(r);
        case "f64":
          return u.f64(r);
        case "u128":
          return u.u128(r);
        case "i128":
          return u.i128(r);
        case "bytes":
          return u.vecU8(r);
        case "string":
          return u.str(r);
        case "publicKey":
          return u.publicKey(r);
        default:
          if ("vec" in t.type)
            return u.vec(
              zn.fieldLayout({ name: void 0, type: t.type.vec }, e),
              r
            );
          if ("option" in t.type)
            return u.option(
              zn.fieldLayout({ name: void 0, type: t.type.option }, e),
              r
            );
          if ("defined" in t.type) {
            const n = t.type.defined;
            if (void 0 === e) throw new kn("User defined types not provided");
            const i = e.filter((t) => t.name === n);
            if (1 !== i.length)
              throw new kn(`Type not found: ${JSON.stringify(t)}`);
            return zn.typeDefLayout(i[0], e, r);
          }
          if ("array" in t.type) {
            let n = t.type.array[0],
              i = t.type.array[1],
              o = zn.fieldLayout({ name: void 0, type: n }, e);
            return u.array(o, i, r);
          }
          throw new Error(`Not yet implemented: ${t}`);
      }
    }
    static typeDefLayout(t, e = [], r) {
      if ("struct" === t.type.kind) {
        const n = t.type.fields.map((t) => zn.fieldLayout(t, e));
        return u.struct(n, r);
      }
      if ("enum" === t.type.kind) {
        let n = t.type.variants.map((t) => {
          const r = a()(t.name);
          if (void 0 === t.fields) return u.struct([], r);
          const n = t.fields.map((t) => {
            if (!t.hasOwnProperty("name"))
              throw new Error("Tuple enum variants not yet implemented.");
            return zn.fieldLayout(t, e);
          });
          return u.struct(n, r);
        });
        return void 0 !== r ? u.rustEnum(n).replicate(r) : u.rustEnum(n, r);
      }
      throw new Error(`Unknown type kint: ${t}`);
    }
  }
  class Mn {
    constructor(t) {
      (this.idl = t), (this.ixLayout = Mn.parseIxLayout(t));
      const e = new Map();
      t.instructions.forEach((t) => {
        const r = Dn("global", t.name);
        e.set(i().encode(r), {
          layout: this.ixLayout.get(t.name),
          name: t.name,
        });
      }),
        t.state &&
          t.state.methods.map((t) => {
            const r = Dn("state", t.name);
            e.set(i().encode(r), {
              layout: this.ixLayout.get(t.name),
              name: t.name,
            });
          }),
        (this.sighashLayouts = e);
    }
    encode(t, e) {
      return this._encode("global", t, e);
    }
    encodeState(t, e) {
      return this._encode("state", t, e);
    }
    _encode(e, r, n) {
      const i = t.Buffer.alloc(1e3),
        o = a()(r),
        s = this.ixLayout.get(o);
      if (!s) throw new Error(`Unknown method: ${o}`);
      const c = s.encode(n, i),
        u = i.slice(0, c);
      return t.Buffer.concat([Dn(e, r), u]);
    }
    static parseIxLayout(t) {
      const e = (t.state ? t.state.methods : [])
        .map((e) => {
          let r = e.args.map((e) => {
            var r, n;
            return zn.fieldLayout(
              e,
              Array.from([
                ...(null !== (r = t.accounts) && void 0 !== r ? r : []),
                ...(null !== (n = t.types) && void 0 !== n ? n : []),
              ])
            );
          });
          const n = a()(e.name);
          return [n, u.struct(r, n)];
        })
        .concat(
          t.instructions.map((e) => {
            let r = e.args.map((e) => {
              var r, n;
              return zn.fieldLayout(
                e,
                Array.from([
                  ...(null !== (r = t.accounts) && void 0 !== r ? r : []),
                  ...(null !== (n = t.types) && void 0 !== n ? n : []),
                ])
              );
            });
            const n = a()(e.name);
            return [n, u.struct(r, n)];
          })
        );
      return new Map(e);
    }
    decode(e, r = "hex") {
      "string" == typeof e &&
        (e = "hex" === r ? t.Buffer.from(e, "hex") : i().decode(e));
      let n = i().encode(e.slice(0, 8)),
        o = e.slice(8);
      const s = this.sighashLayouts.get(n);
      return s ? { data: s.layout.decode(o), name: s.name } : null;
    }
    format(t, e) {
      return Un.format(t, e, this.idl);
    }
  }
  class Un {
    static format(t, e, r) {
      const n = r.instructions.filter((e) => t.name === e.name)[0];
      if (void 0 === n) return console.error("Invalid instruction given"), null;
      const i = n.args.map((e) => ({
          name: e.name,
          type: Un.formatIdlType(e.type),
          data: Un.formatIdlData(e, t.data[e.name], r.types),
        })),
        o = Un.flattenIdlAccounts(n.accounts);
      return {
        args: i,
        accounts: e.map((t, e) =>
          e < o.length ? { name: o[e].name, ...t } : { name: void 0, ...t }
        ),
      };
    }
    static formatIdlType(t) {
      if ("string" == typeof t) return t;
      if ("vec" in t) return `Vec<${this.formatIdlType(t.vec)}>`;
      if ("option" in t) return `Option<${this.formatIdlType(t.option)}>`;
      if ("defined" in t) return t.defined;
      if ("array" in t) return `Array<${t.array[0]}; ${t.array[1]}>`;
      throw new Error(`Unknown IDL type: ${t}`);
    }
    static formatIdlData(t, e, r) {
      if ("string" == typeof t.type) return e.toString();
      if (t.type.hasOwnProperty("vec"))
        return (
          "[" +
          e
            .map((e) => this.formatIdlData({ name: "", type: t.type.vec }, e))
            .join(", ") +
          "]"
        );
      if (t.type.hasOwnProperty("option"))
        return null === e
          ? "null"
          : this.formatIdlData({ name: "", type: t.type.option }, e, r);
      if (t.type.hasOwnProperty("defined")) {
        if (void 0 === r) throw new Error("User defined types not provided");
        const n = r.filter((e) => e.name === t.type.defined);
        if (1 !== n.length)
          throw new Error(`Type not found: ${t.type.defined}`);
        return Un.formatIdlDataDefined(n[0], e, r);
      }
      return "unknown";
    }
    static formatIdlDataDefined(t, e, r) {
      if ("struct" === t.type.kind) {
        const n = t.type;
        return (
          "{ " +
          Object.keys(e)
            .map((t) => {
              const i = n.fields.filter((e) => e.name === t)[0];
              if (void 0 === i) throw new Error("Unable to find type");
              return t + ": " + Un.formatIdlData(i, e[t], r);
            })
            .join(", ") +
          " }"
        );
      }
      if (0 === t.type.variants.length) return "{}";
      if (t.type.variants[0].name) {
        const n = t.type.variants,
          i = Object.keys(e)[0],
          o = e[i],
          s = Object.keys(o)
            .map((t) => {
              var e;
              const s = o[t],
                a =
                  null === (e = n[i]) || void 0 === e
                    ? void 0
                    : e.filter((e) => e.name === t)[0];
              if (void 0 === a) throw new Error("Unable to find variant");
              return t + ": " + Un.formatIdlData(a, s, r);
            })
            .join(", "),
          c = a()(i, { pascalCase: !0 });
        return 0 === s.length ? c : `${c} { ${s} }`;
      }
      return "Tuple formatting not yet implemented";
    }
    static flattenIdlAccounts(t, e) {
      return t
        .map((t) => {
          const r = (function (t) {
            const e = t.replace(/([A-Z])/g, " $1");
            return e.charAt(0).toUpperCase() + e.slice(1);
          })(t.name);
          if (t.hasOwnProperty("accounts")) {
            const n = e ? `${e} > ${r}` : r;
            return Un.flattenIdlAccounts(t.accounts, n);
          }
          return { ...t, name: e ? `${e} > ${r}` : r };
        })
        .flat();
    }
  }
  function Dn(e, r) {
    var n;
    let i = `${e}:${
      (void 0 === n && (n = {}),
      (function (t, e) {
        return (
          void 0 === e && (e = {}),
          (function (t, e) {
            void 0 === e && (e = {});
            for (
              var r = e.splitRegexp,
                n = void 0 === r ? Ln : r,
                i = e.stripRegexp,
                o = void 0 === i ? On : i,
                s = e.transform,
                a = void 0 === s ? Tn : s,
                c = e.delimiter,
                u = void 0 === c ? " " : c,
                l = Pn(Pn(t, n, "$1\0$2"), o, "\0"),
                h = 0,
                d = l.length;
              "\0" === l.charAt(h);

            )
              h++;
            for (; "\0" === l.charAt(d - 1); ) d--;
            return l.slice(h, d).split("\0").map(a).join(u);
          })(t, Bn({ delimiter: "." }, e))
        );
      })(r, Bn({ delimiter: "_" }, n)))
    }`;
    return t.Buffer.from(c.sha256.digest(i)).slice(0, 8);
  }
  function Hn(t, e) {
    if ("enum" === e.type.kind) {
      let r = e.type.variants.map((e) =>
        void 0 === e.fields
          ? 0
          : e.fields
              .map((e) => {
                if ("object" != typeof e || !("name" in e))
                  throw new Error("Tuple enum variants not yet implemented.");
                return Nn(t, e.type);
              })
              .reduce((t, e) => t + e)
      );
      return Math.max(...r) + 1;
    }
    return void 0 === e.type.fields
      ? 0
      : e.type.fields.map((e) => Nn(t, e.type)).reduce((t, e) => t + e, 0);
  }
  function Nn(t, e) {
    var r, n;
    switch (e) {
      case "bool":
      case "u8":
      case "i8":
      case "bytes":
      case "string":
        return 1;
      case "i16":
      case "u16":
        return 2;
      case "u32":
      case "i32":
      case "f32":
        return 4;
      case "u64":
      case "i64":
      case "f64":
        return 8;
      case "u128":
      case "i128":
        return 16;
      case "publicKey":
        return 32;
      default:
        if ("vec" in e) return 1;
        if ("option" in e) return 1 + Nn(t, e.option);
        if ("coption" in e) return 4 + Nn(t, e.coption);
        if ("defined" in e) {
          const i =
            null !==
              (n =
                null === (r = t.types) || void 0 === r
                  ? void 0
                  : r.filter((t) => t.name === e.defined)) && void 0 !== n
              ? n
              : [];
          if (1 !== i.length)
            throw new kn(`Type not found: ${JSON.stringify(e)}`);
          return Hn(t, i[0]);
        }
        if ("array" in e) {
          let r = e.array[0],
            n = e.array[1];
          return Nn(t, r) * n;
        }
        throw new Error(`Invalid type ${JSON.stringify(e)}`);
    }
  }
  const Fn = 8;
  class jn {
    constructor(t) {
      if (void 0 === t.accounts) return void (this.accountLayouts = new Map());
      const e = t.accounts.map((e) => [e.name, zn.typeDefLayout(e, t.types)]);
      (this.accountLayouts = new Map(e)), (this.idl = t);
    }
    async encode(e, r) {
      const n = t.Buffer.alloc(1e3),
        i = this.accountLayouts.get(e);
      if (!i) throw new Error(`Unknown account: ${e}`);
      const o = i.encode(r, n);
      let s = n.slice(0, o),
        a = jn.accountDiscriminator(e);
      return t.Buffer.concat([a, s]);
    }
    decode(t, e) {
      if (jn.accountDiscriminator(t).compare(e.slice(0, 8)))
        throw new Error("Invalid account discriminator");
      return this.decodeUnchecked(t, e);
    }
    decodeUnchecked(t, e) {
      const r = e.slice(8),
        n = this.accountLayouts.get(t);
      if (!n) throw new Error(`Unknown account: ${t}`);
      return n.decode(r);
    }
    memcmp(e, r) {
      const n = jn.accountDiscriminator(e);
      return { offset: 0, bytes: i().encode(r ? t.Buffer.concat([n, r]) : n) };
    }
    size(t) {
      var e;
      return 8 + (null !== (e = Hn(this.idl, t)) && void 0 !== e ? e : 0);
    }
    static accountDiscriminator(e) {
      return t.Buffer.from(
        c.sha256.digest(`account:${a()(e, { pascalCase: !0 })}`)
      ).slice(0, 8);
    }
  }
  class Vn {
    constructor(t) {
      if (void 0 === t.events) return void (this.layouts = new Map());
      const e = t.events.map((e) => {
        let r = {
          name: e.name,
          type: {
            kind: "struct",
            fields: e.fields.map((t) => ({ name: t.name, type: t.type })),
          },
        };
        return [e.name, zn.typeDefLayout(r, t.types)];
      });
      (this.layouts = new Map(e)),
        (this.discriminators = new Map(
          void 0 === t.events
            ? []
            : t.events.map((t) => [o.JQ(Kn(t.name)), t.name])
        ));
    }
    decode(e) {
      let r;
      try {
        r = t.Buffer.from(o.b$(e));
      } catch (t) {
        return null;
      }
      const n = o.JQ(r.slice(0, 8)),
        i = this.discriminators.get(n);
      if (void 0 === i) return null;
      const s = this.layouts.get(i);
      if (!s) throw new Error(`Unknown event: ${i}`);
      return { data: s.decode(r.slice(8)), name: i };
    }
  }
  function Kn(e) {
    return t.Buffer.from(c.sha256.digest(`event:${e}`)).slice(0, 8);
  }
  class qn {
    constructor(t) {
      if (void 0 === t.state) throw new Error("Idl state not defined.");
      this.layout = zn.typeDefLayout(t.state.struct, t.types);
    }
    async encode(e, r) {
      const n = t.Buffer.alloc(1e3),
        i = this.layout.encode(r, n),
        o = await Zn(e),
        s = n.slice(0, i);
      return t.Buffer.concat([o, s]);
    }
    decode(t) {
      const e = t.slice(8);
      return this.layout.decode(e);
    }
  }
  async function Zn(e) {
    let r = vn("anchor-deprecated-state") ? "account" : "state";
    return t.Buffer.from(c.sha256.digest(`${r}:${e}`)).slice(0, 8);
  }
  class Xn {
    constructor(t) {
      (this.instruction = new Mn(t)),
        (this.accounts = new jn(t)),
        (this.events = new Vn(t)),
        t.state && (this.state = new qn(t));
    }
  }
  var $n =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
      ? window
      : void 0 !== __webpack_require__.g
      ? __webpack_require__.g
      : "undefined" != typeof self
      ? self
      : {};
  class Wn {
    constructor(t, e) {
      if (!Number.isInteger(t)) throw new TypeError("span must be an integer");
      (this.span = t), (this.property = e);
    }
    makeDestinationObject() {
      return {};
    }
    decode(t, e) {
      throw new Error("Layout is abstract");
    }
    encode(t, e, r) {
      throw new Error("Layout is abstract");
    }
    getSpan(t, e) {
      if (0 > this.span) throw new RangeError("indeterminate span");
      return this.span;
    }
    replicate(t) {
      const e = Object.create(this.constructor.prototype);
      return Object.assign(e, this), (e.property = t), e;
    }
    fromArray(t) {}
  }
  var Gn = Wn;
  class Jn extends Wn {
    isCount() {
      throw new Error("ExternalLayout is abstract");
    }
  }
  class Yn extends Jn {
    constructor(t, e, r) {
      if (!(t instanceof Wn)) throw new TypeError("layout must be a Layout");
      if (void 0 === e) e = 0;
      else if (!Number.isInteger(e))
        throw new TypeError("offset must be integer or undefined");
      super(t.span, r || t.property), (this.layout = t), (this.offset = e);
    }
    isCount() {
      return this.layout instanceof Qn || this.layout instanceof ti;
    }
    decode(t, e) {
      return void 0 === e && (e = 0), this.layout.decode(t, e + this.offset);
    }
    encode(t, e, r) {
      return void 0 === r && (r = 0), this.layout.encode(t, e, r + this.offset);
    }
  }
  class Qn extends Wn {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw new RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return void 0 === e && (e = 0), t.readUIntLE(e, this.span);
    }
    encode(t, e, r) {
      return void 0 === r && (r = 0), e.writeUIntLE(t, r, this.span), this.span;
    }
  }
  class ti extends Wn {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw new RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return void 0 === e && (e = 0), t.readUIntBE(e, this.span);
    }
    encode(t, e, r) {
      return void 0 === r && (r = 0), e.writeUIntBE(t, r, this.span), this.span;
    }
  }
  const ei = Math.pow(2, 32);
  class ri extends Wn {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      const r = t.readUInt32LE(e);
      return (function (t, e) {
        return t * ei + e;
      })(t.readUInt32LE(e + 4), r);
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      const n = (function (t) {
        const e = Math.floor(t / ei);
        return { hi32: e, lo32: t - e * ei };
      })(t);
      return e.writeUInt32LE(n.lo32, r), e.writeUInt32LE(n.hi32, r + 4), 8;
    }
  }
  class ni extends Wn {
    constructor(t, e, r) {
      if (!Array.isArray(t) || !t.reduce((t, e) => t && e instanceof Wn, !0))
        throw new TypeError("fields must be array of Layout instances");
      "boolean" == typeof e && void 0 === r && ((r = e), (e = void 0));
      for (const e of t)
        if (0 > e.span && void 0 === e.property)
          throw new Error(
            "fields cannot contain unnamed variable-length layout"
          );
      let n = -1;
      try {
        n = t.reduce((t, e) => t + e.getSpan(), 0);
      } catch (t) {}
      super(n, e), (this.fields = t), (this.decodePrefixes = !!r);
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      try {
        r = this.fields.reduce((r, n) => {
          const i = n.getSpan(t, e);
          return (e += i), r + i;
        }, 0);
      } catch (t) {
        throw new RangeError("indeterminate span");
      }
      return r;
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      const r = this.makeDestinationObject();
      for (const n of this.fields)
        if (
          (void 0 !== n.property && (r[n.property] = n.decode(t, e)),
          (e += n.getSpan(t, e)),
          this.decodePrefixes && t.length === e)
        )
          break;
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      const n = r;
      let i = 0,
        o = 0;
      for (const n of this.fields) {
        let s = n.span;
        if (((o = 0 < s ? s : 0), void 0 !== n.property)) {
          const i = t[n.property];
          void 0 !== i &&
            ((o = n.encode(i, e, r)), 0 > s && (s = n.getSpan(e, r)));
        }
        (i = r), (r += s);
      }
      return i + o - n;
    }
    fromArray(t) {
      const e = this.makeDestinationObject();
      for (const r of this.fields)
        void 0 !== r.property && 0 < t.length && (e[r.property] = t.shift());
      return e;
    }
    layoutFor(t) {
      if ("string" != typeof t) throw new TypeError("property must be string");
      for (const e of this.fields) if (e.property === t) return e;
    }
    offsetOf(t) {
      if ("string" != typeof t) throw new TypeError("property must be string");
      let e = 0;
      for (const r of this.fields) {
        if (r.property === t) return e;
        0 > r.span ? (e = -1) : 0 <= e && (e += r.span);
      }
    }
  }
  class ii {
    constructor(t) {
      this.property = t;
    }
    decode() {
      throw new Error("UnionDiscriminator is abstract");
    }
    encode() {
      throw new Error("UnionDiscriminator is abstract");
    }
  }
  class oi extends ii {
    constructor(t, e) {
      if (!(t instanceof Jn && t.isCount()))
        throw new TypeError(
          "layout must be an unsigned integer ExternalLayout"
        );
      super(e || t.property || "variant"), (this.layout = t);
    }
    decode(t, e) {
      return this.layout.decode(t, e);
    }
    encode(t, e, r) {
      return this.layout.encode(t, e, r);
    }
  }
  class si extends Wn {
    constructor(t, e, r) {
      const n = t instanceof Qn || t instanceof ti;
      if (n) t = new oi(new Yn(t));
      else if (t instanceof Jn && t.isCount()) t = new oi(t);
      else if (!(t instanceof ii))
        throw new TypeError(
          "discr must be a UnionDiscriminator or an unsigned integer layout"
        );
      if ((void 0 === e && (e = null), !(null === e || e instanceof Wn)))
        throw new TypeError("defaultLayout must be null or a Layout");
      if (null !== e) {
        if (0 > e.span)
          throw new Error("defaultLayout must have constant span");
        void 0 === e.property && (e = e.replicate("content"));
      }
      let i = -1;
      e && ((i = e.span), 0 <= i && n && (i += t.layout.span)),
        super(i, r),
        (this.discriminator = t),
        (this.usesPrefixDiscriminator = n),
        (this.defaultLayout = e),
        (this.registry = {});
      let o = this.defaultGetSourceVariant.bind(this);
      (this.getSourceVariant = function (t) {
        return o(t);
      }),
        (this.configGetSourceVariant = function (t) {
          o = t.bind(this);
        });
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      const r = this.getVariant(t, e);
      if (!r)
        throw new Error("unable to determine span for unrecognized variant");
      return r.getSpan(t, e);
    }
    defaultGetSourceVariant(t) {
      if (t.hasOwnProperty(this.discriminator.property)) {
        if (this.defaultLayout && t.hasOwnProperty(this.defaultLayout.property))
          return;
        const e = this.registry[t[this.discriminator.property]];
        if (e && (!e.layout || t.hasOwnProperty(e.property))) return e;
      } else
        for (const e in this.registry) {
          const r = this.registry[e];
          if (t.hasOwnProperty(r.property)) return r;
        }
      throw new Error("unable to infer src variant");
    }
    decode(t, e) {
      let r;
      void 0 === e && (e = 0);
      const n = this.discriminator,
        i = n.decode(t, e);
      let o = this.registry[i];
      if (void 0 === o) {
        let s = 0;
        (o = this.defaultLayout),
          this.usesPrefixDiscriminator && (s = n.layout.span),
          (r = this.makeDestinationObject()),
          (r[n.property] = i),
          (r[o.property] = this.defaultLayout.decode(t, e + s));
      } else r = o.decode(t, e);
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      const n = this.getSourceVariant(t);
      if (void 0 === n) {
        const n = this.discriminator,
          i = this.defaultLayout;
        let o = 0;
        return (
          this.usesPrefixDiscriminator && (o = n.layout.span),
          n.encode(t[n.property], e, r),
          o + i.encode(t[i.property], e, r + o)
        );
      }
      return n.encode(t, e, r);
    }
    addVariant(t, e, r) {
      const n = new ai(this, t, e, r);
      return (this.registry[t] = n), n;
    }
    getVariant(t, e) {
      let r = t;
      return (
        Buffer.isBuffer(t) &&
          (void 0 === e && (e = 0), (r = this.discriminator.decode(t, e))),
        this.registry[r]
      );
    }
  }
  class ai extends Wn {
    constructor(t, e, r, n) {
      if (!(t instanceof si)) throw new TypeError("union must be a Union");
      if (!Number.isInteger(e) || 0 > e)
        throw new TypeError("variant must be a (non-negative) integer");
      if (("string" == typeof r && void 0 === n && ((n = r), (r = null)), r)) {
        if (!(r instanceof Wn)) throw new TypeError("layout must be a Layout");
        if (
          null !== t.defaultLayout &&
          0 <= r.span &&
          r.span > t.defaultLayout.span
        )
          throw new Error("variant span exceeds span of containing union");
        if ("string" != typeof n)
          throw new TypeError("variant must have a String property");
      }
      let i = t.span;
      0 > t.span &&
        ((i = r ? r.span : 0),
        0 <= i &&
          t.usesPrefixDiscriminator &&
          (i += t.discriminator.layout.span)),
        super(i, n),
        (this.union = t),
        (this.variant = e),
        (this.layout = r || null);
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (r = this.union.discriminator.layout.span),
        r + this.layout.getSpan(t, e + r)
      );
    }
    decode(t, e) {
      const r = this.makeDestinationObject();
      if ((void 0 === e && (e = 0), this !== this.union.getVariant(t, e)))
        throw new Error("variant mismatch");
      let n = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout
          ? (r[this.property] = this.layout.decode(t, e + n))
          : this.property
          ? (r[this.property] = !0)
          : this.union.usesPrefixDiscriminator &&
            (r[this.union.discriminator.property] = this.variant),
        r
      );
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = 0;
      if (
        (this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout && !t.hasOwnProperty(this.property))
      )
        throw new TypeError("variant lacks property " + this.property);
      this.union.discriminator.encode(this.variant, e, r);
      let i = n;
      if (
        this.layout &&
        (this.layout.encode(t[this.property], e, r + n),
        (i += this.layout.getSpan(e, r + n)),
        0 <= this.union.span && i > this.union.span)
      )
        throw new Error("encoded variant overruns containing union");
      return i;
    }
    fromArray(t) {
      if (this.layout) return this.layout.fromArray(t);
    }
  }
  class ci extends Wn {
    constructor(t, e) {
      if (
        !((t instanceof Jn && t.isCount()) || (Number.isInteger(t) && 0 <= t))
      )
        throw new TypeError(
          "length must be positive integer or an unsigned integer ExternalLayout"
        );
      let r = -1;
      t instanceof Jn || (r = t), super(r, e), (this.length = t);
    }
    getSpan(t, e) {
      let r = this.span;
      return 0 > r && (r = this.length.decode(t, e)), r;
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = this.span;
      return 0 > r && (r = this.length.decode(t, e)), t.slice(e, e + r);
    }
    encode(t, e, r) {
      let n = this.length;
      if (
        (this.length instanceof Jn && (n = t.length),
        !Buffer.isBuffer(t) || n !== t.length)
      )
        throw new TypeError(
          ((i = "Blob.encode"),
          (this.property ? i + "[" + this.property + "]" : i) +
            " requires (length " +
            n +
            ") Buffer as src")
        );
      var i;
      if (r + n > e.length) throw new RangeError("encoding overruns Buffer");
      return (
        e.write(t.toString("hex"), r, n, "hex"),
        this.length instanceof Jn && this.length.encode(n, e, r),
        n
      );
    }
  }
  var ui = (t) => new Qn(1, t),
    li = (t) => new ri(t),
    hi = (t, e, r) => new ni(t, e, r),
    di = (t, e) => new ci(t, e);
  class fi {
    constructor(t) {}
    encode(t, r) {
      switch (a()(t)) {
        case "initializeMint":
          return (function ({
            decimals: t,
            mintAuthority: r,
            freezeAuthority: n,
          }) {
            return wi({
              initializeMint: {
                decimals: t,
                mintAuthority: r.toBuffer(),
                freezeAuthorityOption: !!n,
                freezeAuthority: (n || e.PublicKey.default).toBuffer(),
              },
            });
          })(r);
        case "initializeAccount":
          return wi({ initializeAccount: {} });
        case "initializeMultisig":
          return (function ({ m: t }) {
            return wi({ initializeMultisig: { m: t } });
          })(r);
        case "transfer":
          return (function ({ amount: t }) {
            return wi({ transfer: { amount: t } });
          })(r);
        case "approve":
          return (function ({ amount: t }) {
            return wi({ approve: { amount: t } });
          })(r);
        case "revoke":
          return wi({ revoke: {} });
        case "setAuthority":
          return (function ({ authorityType: t, newAuthority: e }) {
            return wi({ setAuthority: { authorityType: t, newAuthority: e } });
          })(r);
        case "mintTo":
          return (function ({ amount: t }) {
            return wi({ mintTo: { amount: t } });
          })(r);
        case "burn":
          return (function ({ amount: t }) {
            return wi({ burn: { amount: t } });
          })(r);
        case "closeAccount":
          return wi({ closeAccount: {} });
        case "freezeAccount":
          return wi({ freezeAccount: {} });
        case "thawAccount":
          return wi({ thawAccount: {} });
        case "transferChecked":
          return (function ({ amount: t, decimals: e }) {
            return wi({ transferChecked: { amount: t, decimals: e } });
          })(r);
        case "approvedChecked":
          return (function ({ amount: t, decimals: e }) {
            return wi({ approveChecked: { amount: t, decimals: e } });
          })(r);
        case "mintToChecked":
          return (function ({ amount: t, decimals: e }) {
            return wi({ mintToChecked: { amount: t, decimals: e } });
          })(r);
        case "burnChecked":
          return (function ({ amount: t, decimals: e }) {
            return wi({ burnChecked: { amount: t, decimals: e } });
          })(r);
        case "intializeAccount2":
          return (function ({ authority: t }) {
            return wi({ initilaizeAccount2: { authority: t } });
          })(r);
        case "syncNative":
          return wi({ syncNative: {} });
        case "initializeAccount3":
          return (function ({ authority: t }) {
            return wi({ initializeAccount3: { authority: t } });
          })(r);
        case "initializeMultisig2":
          return (function ({ m: t }) {
            return wi({ initializeMultisig2: { m: t } });
          })(r);
        case "initializeMint2":
          return (function ({
            decimals: t,
            mintAuthority: e,
            freezeAuthority: r,
          }) {
            return wi({
              encodeInitializeMint2: {
                decimals: t,
                mintAuthority: e,
                freezeAuthority: r,
              },
            });
          })(r);
        default:
          throw new Error(`Invalid instruction: ${t}`);
      }
    }
    encodeState(t, e) {
      throw new Error("SPL token does not have state");
    }
  }
  const pi = ((_i = ui("instruction")), new si(_i, void 0, void 0));
  var _i;
  function mi(t) {
    return di(32, t);
  }
  function wi(t) {
    let e = Buffer.alloc(yi),
      r = pi.encode(t, e);
    return e.slice(0, r);
  }
  pi.addVariant(
    0,
    hi([
      ui("decimals"),
      di(32, "mintAuthority"),
      ui("freezeAuthorityOption"),
      mi("freezeAuthority"),
    ]),
    "initializeMint"
  ),
    pi.addVariant(1, hi([]), "initializeAccount"),
    pi.addVariant(2, hi([ui("m")]), "initializeMultisig"),
    pi.addVariant(3, hi([li("amount")]), "transfer"),
    pi.addVariant(4, hi([li("amount")]), "approve"),
    pi.addVariant(5, hi([]), "revoke"),
    pi.addVariant(
      6,
      hi([ui("authorityType"), ui("newAuthorityOption"), mi("newAuthority")]),
      "setAuthority"
    ),
    pi.addVariant(7, hi([li("amount")]), "mintTo"),
    pi.addVariant(8, hi([li("amount")]), "burn"),
    pi.addVariant(9, hi([]), "closeAccount"),
    pi.addVariant(10, hi([]), "freezeAccount"),
    pi.addVariant(11, hi([]), "thawAccount"),
    pi.addVariant(12, hi([li("amount"), ui("decimals")]), "transferChecked"),
    pi.addVariant(13, hi([li("amount"), ui("decimals")]), "approvedChecked"),
    pi.addVariant(14, hi([li("amount"), ui("decimals")]), "mintToChecked"),
    pi.addVariant(15, hi([li("amount"), ui("decimals")]), "burnedChecked"),
    pi.addVariant(16, hi([mi("authority")]), "InitializeAccount2"),
    pi.addVariant(17, hi([]), "syncNative"),
    pi.addVariant(18, hi([mi("authority")]), "initializeAccount3"),
    pi.addVariant(19, hi([ui("m")]), "initializeMultisig2"),
    pi.addVariant(
      20,
      hi([
        ui("decimals"),
        mi("mintAuthority"),
        ui("freezeAuthorityOption"),
        mi("freezeAuthority"),
      ]),
      "initializeMint2"
    );
  const yi = Math.max(...Object.values(pi.registry).map((t) => t.span));
  class gi {
    constructor(t) {}
    encode(t, e) {
      throw new Error("SPL token does not have state");
    }
    decode(t) {
      throw new Error("SPL token does not have state");
    }
  }
  function bi(t) {
    return new ki(
      di(8),
      (t) => xi.fromBuffer(t),
      (t) => t.toBuffer(),
      t
    );
  }
  function vi(t) {
    return new ki(
      di(32),
      (t) => new e.PublicKey(t),
      (t) => t.toBuffer(),
      t
    );
  }
  function Ei(t, e) {
    return new Ai(t, e);
  }
  class ki extends Gn {
    constructor(t, e, r, n) {
      super(t.span, n),
        (this.layout = t),
        (this.decoder = e),
        (this.encoder = r);
    }
    decode(t, e) {
      return this.decoder(this.layout.decode(t, e));
    }
    encode(t, e, r) {
      return this.layout.encode(this.encoder(t), e, r);
    }
    getSpan(t, e) {
      return this.layout.getSpan(t, e);
    }
  }
  class Ai extends Gn {
    constructor(t, e) {
      super(-1, e), (this.layout = t), (this.discriminator = new Qn(4, void 0));
    }
    encode(t, e, r = 0) {
      return null == t
        ? this.layout.span + this.discriminator.encode(0, e, r)
        : (this.discriminator.encode(1, e, r),
          this.layout.encode(t, e, r + 4) + 4);
    }
    decode(t, e = 0) {
      const r = this.discriminator.decode(t, e);
      if (0 === r) return null;
      if (1 === r) return this.layout.decode(t, e + 4);
      throw new Error("Invalid coption " + this.layout.property);
    }
    getSpan(t, e = 0) {
      return this.layout.getSpan(t, e + 4) + 4;
    }
  }
  class xi extends r.default {
    toBuffer() {
      const t = super.toArray().reverse(),
        e = Buffer.from(t);
      if (8 === e.length) return e;
      if (e.length >= 8) throw new Error("u64 too large");
      const r = Buffer.alloc(8);
      return e.copy(r), r;
    }
    static fromBuffer(t) {
      if (8 !== t.length) throw new Error(`Invalid buffer length: ${t.length}`);
      return new xi(
        [...t]
          .reverse()
          .map((t) => `00${t.toString(16)}`.slice(-2))
          .join(""),
        16
      );
    }
  }
  class Si {
    constructor(t) {
      this.idl = t;
    }
    async encode(t, e) {
      switch (t) {
        case "token": {
          const t = Buffer.alloc(165),
            r = Ci.encode(e, t);
          return t.slice(0, r);
        }
        case "mint": {
          const t = Buffer.alloc(82),
            r = Ii.encode(e, t);
          return t.slice(0, r);
        }
        default:
          throw new Error(`Invalid account name: ${t}`);
      }
    }
    decode(t, e) {
      return this.decodeUnchecked(t, e);
    }
    decodeUnchecked(t, e) {
      switch (t) {
        case "token":
          return (function (t) {
            return Ci.decode(t);
          })(e);
        case "mint":
          return (function (t) {
            return Ii.decode(t);
          })(e);
        default:
          throw new Error(`Invalid account name: ${t}`);
      }
    }
    memcmp(t, e) {
      switch (t) {
        case "token":
          return { dataSize: 165 };
        case "mint":
          return { dataSize: 82 };
        default:
          throw new Error(`Invalid account name: ${t}`);
      }
    }
    size(t) {
      var e;
      return null !== (e = Hn(this.idl, t)) && void 0 !== e ? e : 0;
    }
  }
  const Ii = hi([
      Ei(vi(), "mintAuthority"),
      bi("supply"),
      ui("decimals"),
      new ki(
        ui(),
        function (t) {
          if (0 === t) return !1;
          if (1 === t) return !0;
          throw new Error("Invalid bool: " + t);
        },
        function (t) {
          return t ? 1 : 0;
        },
        "isInitialized"
      ),
      Ei(vi(), "freezeAuthority"),
    ]),
    Ci = hi([
      vi("mint"),
      vi("authority"),
      bi("amount"),
      Ei(vi(), "delegate"),
      ui("state"),
      Ei(bi(), "isNative"),
      bi("delegatedAmount"),
      Ei(vi(), "closeAuthority"),
    ]);
  class Ri {
    constructor(t) {}
    decode(t) {
      throw new Error("SPL token program does not have events");
    }
  }
  class Bi {
    constructor(t) {
      (this.instruction = new fi(t)),
        (this.accounts = new Si(t)),
        (this.events = new Ri(t)),
        (this.state = new gi(t));
    }
  }
  var Ti = Object.freeze({
    __proto__: null,
    hash: function (t) {
      return (0, c.sha256)(t);
    },
  });
  function Li(r, n, i) {
    const o = t.Buffer.concat([r.toBuffer(), t.Buffer.from(n), i.toBuffer()]),
      s = c.sha256.digest(o);
    return new e.PublicKey(t.Buffer.from(s));
  }
  function Oi(n, i) {
    let o = t.Buffer.alloc(0);
    n.forEach(function (e) {
      if (e.length > 32) throw new TypeError("Max seed length exceeded");
      o = t.Buffer.concat([o, zi(e)]);
    }),
      (o = t.Buffer.concat([
        o,
        i.toBuffer(),
        t.Buffer.from("ProgramDerivedAddress"),
      ]));
    let s = (0, c.sha256)(new Uint8Array(o)),
      a = new r.default(s, 16).toArray(void 0, 32);
    if (e.PublicKey.isOnCurve(new Uint8Array(a)))
      throw new Error("Invalid seeds, address must fall off the curve");
    return new e.PublicKey(a);
  }
  function Pi(e, r) {
    let n,
      i = 255;
    for (; 0 != i; ) {
      try {
        n = Oi(e.concat(t.Buffer.from([i])), r);
      } catch (t) {
        if (t instanceof TypeError) throw t;
        i--;
        continue;
      }
      return [n, i];
    }
    throw new Error("Unable to find a viable program address nonce");
  }
  const zi = (e) =>
    e instanceof t.Buffer
      ? e
      : e instanceof Uint8Array
      ? t.Buffer.from(e.buffer, e.byteOffset, e.byteLength)
      : t.Buffer.from(e);
  async function Mi(r, ...n) {
    let i = [t.Buffer.from([97, 110, 99, 104, 111, 114])];
    n.forEach((e) => {
      i.push(e instanceof t.Buffer ? e : zr(e).toBuffer());
    });
    const [o] = await e.PublicKey.findProgramAddress(i, zr(r));
    return o;
  }
  var Ui = Object.freeze({
    __proto__: null,
    createWithSeedSync: Li,
    createProgramAddressSync: Oi,
    findProgramAddressSync: Pi,
    associated: Mi,
  });
  const Di = new e.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    Hi = new e.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
  var Ni = Object.freeze({
      __proto__: null,
      TOKEN_PROGRAM_ID: Di,
      ASSOCIATED_PROGRAM_ID: Hi,
      associatedAddress: async function ({ mint: t, owner: r }) {
        return (
          await e.PublicKey.findProgramAddress(
            [r.toBuffer(), Di.toBuffer(), t.toBuffer()],
            Hi
          )
        )[0];
      },
    }),
    Fi = { exports: {} };
  !(function (t, e) {
    var r = "undefined" != typeof self ? self : $n,
      n = (function () {
        function t() {
          (this.fetch = !1), (this.DOMException = r.DOMException);
        }
        return (t.prototype = r), new t();
      })();
    !(function (t) {
      !(function (e) {
        var r = "URLSearchParams" in t,
          n = "Symbol" in t && "iterator" in Symbol,
          i =
            "FileReader" in t &&
            "Blob" in t &&
            (function () {
              try {
                return new Blob(), !0;
              } catch (t) {
                return !1;
              }
            })(),
          o = "FormData" in t,
          s = "ArrayBuffer" in t;
        if (s)
          var a = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]",
            ],
            c =
              ArrayBuffer.isView ||
              function (t) {
                return t && a.indexOf(Object.prototype.toString.call(t)) > -1;
              };
        function u(t) {
          if (
            ("string" != typeof t && (t = String(t)),
            /[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))
          )
            throw new TypeError("Invalid character in header field name");
          return t.toLowerCase();
        }
        function l(t) {
          return "string" != typeof t && (t = String(t)), t;
        }
        function h(t) {
          var e = {
            next: function () {
              var e = t.shift();
              return { done: void 0 === e, value: e };
            },
          };
          return (
            n &&
              (e[Symbol.iterator] = function () {
                return e;
              }),
            e
          );
        }
        function d(t) {
          (this.map = {}),
            t instanceof d
              ? t.forEach(function (t, e) {
                  this.append(e, t);
                }, this)
              : Array.isArray(t)
              ? t.forEach(function (t) {
                  this.append(t[0], t[1]);
                }, this)
              : t &&
                Object.getOwnPropertyNames(t).forEach(function (e) {
                  this.append(e, t[e]);
                }, this);
        }
        function f(t) {
          if (t.bodyUsed) return Promise.reject(new TypeError("Already read"));
          t.bodyUsed = !0;
        }
        function p(t) {
          return new Promise(function (e, r) {
            (t.onload = function () {
              e(t.result);
            }),
              (t.onerror = function () {
                r(t.error);
              });
          });
        }
        function _(t) {
          var e = new FileReader(),
            r = p(e);
          return e.readAsArrayBuffer(t), r;
        }
        function m(t) {
          if (t.slice) return t.slice(0);
          var e = new Uint8Array(t.byteLength);
          return e.set(new Uint8Array(t)), e.buffer;
        }
        function w() {
          return (
            (this.bodyUsed = !1),
            (this._initBody = function (t) {
              var e;
              (this._bodyInit = t),
                t
                  ? "string" == typeof t
                    ? (this._bodyText = t)
                    : i && Blob.prototype.isPrototypeOf(t)
                    ? (this._bodyBlob = t)
                    : o && FormData.prototype.isPrototypeOf(t)
                    ? (this._bodyFormData = t)
                    : r && URLSearchParams.prototype.isPrototypeOf(t)
                    ? (this._bodyText = t.toString())
                    : s && i && (e = t) && DataView.prototype.isPrototypeOf(e)
                    ? ((this._bodyArrayBuffer = m(t.buffer)),
                      (this._bodyInit = new Blob([this._bodyArrayBuffer])))
                    : s && (ArrayBuffer.prototype.isPrototypeOf(t) || c(t))
                    ? (this._bodyArrayBuffer = m(t))
                    : (this._bodyText = t = Object.prototype.toString.call(t))
                  : (this._bodyText = ""),
                this.headers.get("content-type") ||
                  ("string" == typeof t
                    ? this.headers.set(
                        "content-type",
                        "text/plain;charset=UTF-8"
                      )
                    : this._bodyBlob && this._bodyBlob.type
                    ? this.headers.set("content-type", this._bodyBlob.type)
                    : r &&
                      URLSearchParams.prototype.isPrototypeOf(t) &&
                      this.headers.set(
                        "content-type",
                        "application/x-www-form-urlencoded;charset=UTF-8"
                      ));
            }),
            i &&
              ((this.blob = function () {
                var t = f(this);
                if (t) return t;
                if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
                if (this._bodyArrayBuffer)
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                if (this._bodyFormData)
                  throw new Error("could not read FormData body as blob");
                return Promise.resolve(new Blob([this._bodyText]));
              }),
              (this.arrayBuffer = function () {
                return this._bodyArrayBuffer
                  ? f(this) || Promise.resolve(this._bodyArrayBuffer)
                  : this.blob().then(_);
              })),
            (this.text = function () {
              var t = f(this);
              if (t) return t;
              if (this._bodyBlob)
                return (function (t) {
                  var e = new FileReader(),
                    r = p(e);
                  return e.readAsText(t), r;
                })(this._bodyBlob);
              if (this._bodyArrayBuffer)
                return Promise.resolve(
                  (function (t) {
                    for (
                      var e = new Uint8Array(t), r = new Array(e.length), n = 0;
                      n < e.length;
                      n++
                    )
                      r[n] = String.fromCharCode(e[n]);
                    return r.join("");
                  })(this._bodyArrayBuffer)
                );
              if (this._bodyFormData)
                throw new Error("could not read FormData body as text");
              return Promise.resolve(this._bodyText);
            }),
            o &&
              (this.formData = function () {
                return this.text().then(b);
              }),
            (this.json = function () {
              return this.text().then(JSON.parse);
            }),
            this
          );
        }
        (d.prototype.append = function (t, e) {
          (t = u(t)), (e = l(e));
          var r = this.map[t];
          this.map[t] = r ? r + ", " + e : e;
        }),
          (d.prototype.delete = function (t) {
            delete this.map[u(t)];
          }),
          (d.prototype.get = function (t) {
            return (t = u(t)), this.has(t) ? this.map[t] : null;
          }),
          (d.prototype.has = function (t) {
            return this.map.hasOwnProperty(u(t));
          }),
          (d.prototype.set = function (t, e) {
            this.map[u(t)] = l(e);
          }),
          (d.prototype.forEach = function (t, e) {
            for (var r in this.map)
              this.map.hasOwnProperty(r) && t.call(e, this.map[r], r, this);
          }),
          (d.prototype.keys = function () {
            var t = [];
            return (
              this.forEach(function (e, r) {
                t.push(r);
              }),
              h(t)
            );
          }),
          (d.prototype.values = function () {
            var t = [];
            return (
              this.forEach(function (e) {
                t.push(e);
              }),
              h(t)
            );
          }),
          (d.prototype.entries = function () {
            var t = [];
            return (
              this.forEach(function (e, r) {
                t.push([r, e]);
              }),
              h(t)
            );
          }),
          n && (d.prototype[Symbol.iterator] = d.prototype.entries);
        var y = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function g(t, e) {
          var r,
            n,
            i = (e = e || {}).body;
          if (t instanceof g) {
            if (t.bodyUsed) throw new TypeError("Already read");
            (this.url = t.url),
              (this.credentials = t.credentials),
              e.headers || (this.headers = new d(t.headers)),
              (this.method = t.method),
              (this.mode = t.mode),
              (this.signal = t.signal),
              i ||
                null == t._bodyInit ||
                ((i = t._bodyInit), (t.bodyUsed = !0));
          } else this.url = String(t);
          if (
            ((this.credentials =
              e.credentials || this.credentials || "same-origin"),
            (!e.headers && this.headers) || (this.headers = new d(e.headers)),
            (this.method =
              ((n = (r = e.method || this.method || "GET").toUpperCase()),
              y.indexOf(n) > -1 ? n : r)),
            (this.mode = e.mode || this.mode || null),
            (this.signal = e.signal || this.signal),
            (this.referrer = null),
            ("GET" === this.method || "HEAD" === this.method) && i)
          )
            throw new TypeError("Body not allowed for GET or HEAD requests");
          this._initBody(i);
        }
        function b(t) {
          var e = new FormData();
          return (
            t
              .trim()
              .split("&")
              .forEach(function (t) {
                if (t) {
                  var r = t.split("="),
                    n = r.shift().replace(/\+/g, " "),
                    i = r.join("=").replace(/\+/g, " ");
                  e.append(decodeURIComponent(n), decodeURIComponent(i));
                }
              }),
            e
          );
        }
        function v(t, e) {
          e || (e = {}),
            (this.type = "default"),
            (this.status = void 0 === e.status ? 200 : e.status),
            (this.ok = this.status >= 200 && this.status < 300),
            (this.statusText = "statusText" in e ? e.statusText : "OK"),
            (this.headers = new d(e.headers)),
            (this.url = e.url || ""),
            this._initBody(t);
        }
        (g.prototype.clone = function () {
          return new g(this, { body: this._bodyInit });
        }),
          w.call(g.prototype),
          w.call(v.prototype),
          (v.prototype.clone = function () {
            return new v(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new d(this.headers),
              url: this.url,
            });
          }),
          (v.error = function () {
            var t = new v(null, { status: 0, statusText: "" });
            return (t.type = "error"), t;
          });
        var E = [301, 302, 303, 307, 308];
        (v.redirect = function (t, e) {
          if (-1 === E.indexOf(e)) throw new RangeError("Invalid status code");
          return new v(null, { status: e, headers: { location: t } });
        }),
          (e.DOMException = t.DOMException);
        try {
          new e.DOMException();
        } catch (t) {
          (e.DOMException = function (t, e) {
            (this.message = t), (this.name = e);
            var r = Error(t);
            this.stack = r.stack;
          }),
            (e.DOMException.prototype = Object.create(Error.prototype)),
            (e.DOMException.prototype.constructor = e.DOMException);
        }
        function k(t, r) {
          return new Promise(function (n, o) {
            var s = new g(t, r);
            if (s.signal && s.signal.aborted)
              return o(new e.DOMException("Aborted", "AbortError"));
            var a = new XMLHttpRequest();
            function c() {
              a.abort();
            }
            (a.onload = function () {
              var t,
                e,
                r = {
                  status: a.status,
                  statusText: a.statusText,
                  headers:
                    ((t = a.getAllResponseHeaders() || ""),
                    (e = new d()),
                    t
                      .replace(/\r?\n[\t ]+/g, " ")
                      .split(/\r?\n/)
                      .forEach(function (t) {
                        var r = t.split(":"),
                          n = r.shift().trim();
                        if (n) {
                          var i = r.join(":").trim();
                          e.append(n, i);
                        }
                      }),
                    e),
                };
              r.url =
                "responseURL" in a
                  ? a.responseURL
                  : r.headers.get("X-Request-URL");
              var i = "response" in a ? a.response : a.responseText;
              n(new v(i, r));
            }),
              (a.onerror = function () {
                o(new TypeError("Network request failed"));
              }),
              (a.ontimeout = function () {
                o(new TypeError("Network request failed"));
              }),
              (a.onabort = function () {
                o(new e.DOMException("Aborted", "AbortError"));
              }),
              a.open(s.method, s.url, !0),
              "include" === s.credentials
                ? (a.withCredentials = !0)
                : "omit" === s.credentials && (a.withCredentials = !1),
              "responseType" in a && i && (a.responseType = "blob"),
              s.headers.forEach(function (t, e) {
                a.setRequestHeader(e, t);
              }),
              s.signal &&
                (s.signal.addEventListener("abort", c),
                (a.onreadystatechange = function () {
                  4 === a.readyState &&
                    s.signal.removeEventListener("abort", c);
                })),
              a.send(void 0 === s._bodyInit ? null : s._bodyInit);
          });
        }
        (k.polyfill = !0),
          t.fetch ||
            ((t.fetch = k), (t.Headers = d), (t.Request = g), (t.Response = v)),
          (e.Headers = d),
          (e.Request = g),
          (e.Response = v),
          (e.fetch = k),
          Object.defineProperty(e, "__esModule", { value: !0 });
      })({});
    })(n),
      (n.fetch.ponyfill = !0),
      delete n.fetch.polyfill;
    var i = n;
    ((e = i.fetch).default = i.fetch),
      (e.fetch = i.fetch),
      (e.Headers = i.Headers),
      (e.Request = i.Request),
      (e.Response = i.Response),
      (t.exports = e);
  })(Fi, Fi.exports);
  var ji = (function (t) {
    return t &&
      t.__esModule &&
      Object.prototype.hasOwnProperty.call(t, "default")
      ? t.default
      : t;
  })(Fi.exports);
  async function Vi(t, e) {
    const r = await t.getAccountInfo(e);
    if (null === r) throw new Error("program account not found");
    const { program: n } = qi(r.data),
      i = await t.getAccountInfo(n.programdataAddress);
    if (null === i) throw new Error("program data account not found");
    const { programData: o } = qi(i.data);
    return o;
  }
  const Ki = u.rustEnum(
    [
      u.struct([], "uninitialized"),
      u.struct([u.option(u.publicKey(), "authorityAddress")], "buffer"),
      u.struct([u.publicKey("programdataAddress")], "program"),
      u.struct(
        [u.u64("slot"), u.option(u.publicKey(), "upgradeAuthorityAddress")],
        "programData"
      ),
    ],
    void 0,
    u.u32()
  );
  function qi(t) {
    return Ki.decode(t);
  }
  var Zi = Object.freeze({
      __proto__: null,
      verifiedBuild: async function (t, e, r = 5) {
        const n = `https://anchor.projectserum.com/api/v0/program/${e.toString()}/latest?limit=${r}`,
          [i, o] = await Promise.all([Vi(t, e), ji(n)]),
          s = (await o.json()).filter(
            (t) =>
              !t.aborted && "Built" === t.state && "Verified" === t.verified
          );
        if (0 === s.length) return null;
        const a = s[0];
        return i.slot.toNumber() !== a.verified_slot ? null : a;
      },
      fetchData: Vi,
      decodeUpgradeableLoaderState: qi,
    }),
    Xi = Object.freeze({
      __proto__: null,
      sha256: Ti,
      rpc: hn,
      publicKey: Ui,
      bytes: Tr,
      token: Ni,
      features: En,
      registry: Zi,
    });
  const $i = u.struct([u.publicKey("authority"), u.vecU8("data")]);
  function Wi(t, e) {
    var r, n;
    let i = {};
    const o = t.args ? t.args.length : 0;
    if (e.length > o) {
      if (e.length !== o + 1)
        throw new Error(
          `provided too many arguments ${e} to instruction ${
            null == t ? void 0 : t.name
          } expecting: ${
            null !==
              (n =
                null === (r = t.args) || void 0 === r
                  ? void 0
                  : r.map((t) => t.name)) && void 0 !== n
              ? n
              : []
          }`
        );
      i = e.pop();
    }
    return [e, i];
  }
  class Gi {
    static build(t, r, n) {
      if ("_inner" === t.name) throw new kn("the _inner name is reserved");
      const i = (...o) => {
        const [s, a] = Wi(t, [...o]);
        Pr(t.accounts, a.accounts);
        const c = i.accounts(a.accounts);
        return (
          void 0 !== a.remainingAccounts && c.push(...a.remainingAccounts),
          vn("debug-logs") && console.log("Outgoing account metas:", c),
          new e.TransactionInstruction({
            keys: c,
            programId: n,
            data: r(t.name, Or(t, ...s)),
          })
        );
      };
      return (i.accounts = (e) => Gi.accountsArray(e, t.accounts, t.name)), i;
    }
    static accountsArray(t, e, r) {
      return t
        ? e
            .map((e) => {
              if (void 0 !== ("accounts" in e ? e.accounts : void 0)) {
                const n = t[e.name];
                return Gi.accountsArray(n, e.accounts, r).flat();
              }
              {
                const n = e;
                let i;
                try {
                  i = zr(t[e.name]);
                } catch (t) {
                  throw new Error(
                    `Wrong input type for account "${
                      e.name
                    }" in the instruction accounts object${
                      void 0 !== r ? ' for instruction "' + r + '"' : ""
                    }. Expected PublicKey or string.`
                  );
                }
                return { pubkey: i, isWritable: n.isMut, isSigner: n.isSigner };
              }
            })
            .flat()
        : [];
    }
  }
  class Ji {
    static build(t, e, r, n) {
      return async (...i) => {
        var o;
        const s = e(...i),
          [, a] = Wi(t, [...i]);
        if (void 0 === n.sendAndConfirm)
          throw new Error(
            "This function requires 'Provider.sendAndConfirm' to be implemented."
          );
        try {
          return await n.sendAndConfirm(
            s,
            null !== (o = a.signers) && void 0 !== o ? o : [],
            a.options
          );
        } catch (t) {
          throw In(t, r);
        }
      };
    }
  }
  class Yi {
    static build(t, r) {
      return (...n) => {
        var i, o, s;
        const [, a] = Wi(t, [...n]),
          c = new e.Transaction();
        if (a.preInstructions && a.instructions)
          throw new Error("instructions is deprecated, use preInstructions");
        return (
          null === (i = a.preInstructions) ||
            void 0 === i ||
            i.forEach((t) => c.add(t)),
          null === (o = a.instructions) ||
            void 0 === o ||
            o.forEach((t) => c.add(t)),
          c.add(r(...n)),
          null === (s = a.postInstructions) ||
            void 0 === s ||
            s.forEach((t) => c.add(t)),
          c
        );
      };
    }
  }
  class Qi {
    constructor(t, r, n = wn(), i = new Xn(t)) {
      (this.provider = n),
        (this.coder = i),
        (this._idl = t),
        (this._programId = r),
        (this._address = to(r)),
        (this._sub = null);
      const [o, s, c] = (() => {
        var o;
        let s = {},
          c = {},
          u = {};
        return (
          null === (o = t.state) ||
            void 0 === o ||
            o.methods.forEach((o) => {
              const l = Gi.build(
                o,
                (t, e) => i.instruction.encodeState(t, e),
                r
              );
              l.accounts = (t) => {
                const i = (function (t, r, n, i) {
                  if ("new" === n.name) {
                    const [n] = Pi([], t);
                    if (void 0 === r.wallet)
                      throw new Error(
                        "This function requires the Provider interface implementor to have a 'wallet' field."
                      );
                    return [
                      {
                        pubkey: r.wallet.publicKey,
                        isWritable: !1,
                        isSigner: !0,
                      },
                      { pubkey: to(t), isWritable: !0, isSigner: !1 },
                      { pubkey: n, isWritable: !1, isSigner: !1 },
                      {
                        pubkey: e.SystemProgram.programId,
                        isWritable: !1,
                        isSigner: !1,
                      },
                      { pubkey: t, isWritable: !1, isSigner: !1 },
                    ];
                  }
                  return (
                    Pr(n.accounts, i),
                    [{ pubkey: to(t), isWritable: !0, isSigner: !1 }]
                  );
                })(r, n, o, t);
                return i.concat(Gi.accountsArray(t, o.accounts, o.name));
              };
              const h = Yi.build(o, l),
                d = Ji.build(o, h, Lr(t), n),
                f = a()(o.name);
              (s[f] = l), (c[f] = h), (u[f] = d);
            }),
          [s, c, u]
        );
      })();
      (this.instruction = o), (this.transaction = s), (this.rpc = c);
    }
    get programId() {
      return this._programId;
    }
    async fetch() {
      const t = this.address(),
        e = await this.provider.connection.getAccountInfo(t);
      if (null === e) throw new Error(`Account does not exist ${t.toString()}`);
      const r = this._idl.state;
      if (!r) throw new Error("State is not specified in IDL.");
      if ((await Zn(r.struct.name)).compare(e.data.slice(0, 8)))
        throw new Error("Invalid account discriminator");
      return this.coder.state.decode(e.data);
    }
    address() {
      return this._address;
    }
    subscribe(t) {
      if (null !== this._sub) return this._sub.ee;
      const e = new (gr())(),
        r = this.provider.connection.onAccountChange(
          this.address(),
          (t) => {
            const r = this.coder.state.decode(t.data);
            e.emit("change", r);
          },
          t
        );
      return (this._sub = { ee: e, listener: r }), e;
    }
    unsubscribe() {
      null !== this._sub &&
        this.provider.connection
          .removeAccountChangeListener(this._sub.listener)
          .then(async () => {
            this._sub = null;
          })
          .catch(console.error);
    }
  }
  function to(t) {
    let [e] = Pi([], t);
    return Li(e, "unversioned", t);
  }
  class eo {
    constructor(t, e, r, n, i) {
      (this._idlAccount = e),
        (this._programId = r),
        (this._provider = null != n ? n : wn()),
        (this._coder = null != i ? i : new Xn(t)),
        (this._size = this._coder.accounts.size(e));
    }
    get size() {
      return this._size;
    }
    get programId() {
      return this._programId;
    }
    get provider() {
      return this._provider;
    }
    get coder() {
      return this._coder;
    }
    async fetchNullable(t, e) {
      const r = await this.getAccountInfo(t, e);
      return null === r
        ? null
        : this._coder.accounts.decode(this._idlAccount.name, r.data);
    }
    async fetch(t, e) {
      const r = await this.fetchNullable(t, e);
      if (null === r) throw new Error(`Account does not exist ${t.toString()}`);
      return r;
    }
    async fetchMultiple(t, e) {
      return (
        await rn(
          this._provider.connection,
          t.map((t) => zr(t)),
          e
        )
      ).map((t) =>
        null == t
          ? null
          : this._coder.accounts.decode(
              this._idlAccount.name,
              null == t ? void 0 : t.account.data
            )
      );
    }
    async all(t) {
      return (
        await this._provider.connection.getProgramAccounts(this._programId, {
          commitment: this._provider.connection.commitment,
          filters: [
            {
              memcmp: this.coder.accounts.memcmp(
                this._idlAccount.name,
                t instanceof Buffer ? t : void 0
              ),
            },
            ...(Array.isArray(t) ? t : []),
          ],
        })
      ).map(({ pubkey: t, account: e }) => ({
        publicKey: t,
        account: this._coder.accounts.decode(this._idlAccount.name, e.data),
      }));
    }
    subscribe(t, e) {
      const r = ro.get(t.toString());
      if (r) return r.ee;
      const n = new (gr())();
      t = zr(t);
      const i = this._provider.connection.onAccountChange(
        t,
        (t) => {
          const e = this._coder.accounts.decode(this._idlAccount.name, t.data);
          n.emit("change", e);
        },
        e
      );
      return ro.set(t.toString(), { ee: n, listener: i }), n;
    }
    async unsubscribe(t) {
      let e = ro.get(t.toString());
      e
        ? ro &&
          (await this._provider.connection
            .removeAccountChangeListener(e.listener)
            .then(() => {
              ro.delete(t.toString());
            })
            .catch(console.error))
        : console.warn("Address is not subscribed");
    }
    async createInstruction(t, r) {
      const n = this.size;
      if (void 0 === this._provider.wallet)
        throw new Error(
          "This function requires the Provider interface implementor to have a 'wallet' field."
        );
      return e.SystemProgram.createAccount({
        fromPubkey: this._provider.wallet.publicKey,
        newAccountPubkey: t.publicKey,
        space: null != r ? r : n,
        lamports:
          await this._provider.connection.getMinimumBalanceForRentExemption(
            null != r ? r : n
          ),
        programId: this._programId,
      });
    }
    async associated(...t) {
      const e = await this.associatedAddress(...t);
      return await this.fetch(e);
    }
    async associatedAddress(...t) {
      return await Mi(this._programId, ...t);
    }
    async getAccountInfo(t, e) {
      return await this._provider.connection.getAccountInfo(zr(t), e);
    }
  }
  const ro = new Map(),
    no = "Program log: ".length,
    io = "Program data: ".length;
  class oo {
    constructor(t, e, r) {
      (this._programId = t),
        (this._provider = e),
        (this._eventParser = new so(t, r)),
        (this._eventCallbacks = new Map()),
        (this._eventListeners = new Map()),
        (this._listenerIdCount = 0);
    }
    addEventListener(t, e) {
      var r;
      let n = this._listenerIdCount;
      return (
        (this._listenerIdCount += 1),
        t in this._eventCallbacks || this._eventListeners.set(t, []),
        this._eventListeners.set(
          t,
          (null !== (r = this._eventListeners.get(t)) && void 0 !== r
            ? r
            : []
          ).concat(n)
        ),
        this._eventCallbacks.set(n, [t, e]),
        void 0 !== this._onLogsSubscriptionId ||
          (this._onLogsSubscriptionId = this._provider.connection.onLogs(
            this._programId,
            (t, e) => {
              t.err ||
                this._eventParser.parseLogs(t.logs, (t) => {
                  const r = this._eventListeners.get(t.name);
                  r &&
                    r.forEach((r) => {
                      const n = this._eventCallbacks.get(r);
                      if (n) {
                        const [, r] = n;
                        r(t.data, e.slot);
                      }
                    });
                });
            }
          )),
        n
      );
    }
    async removeEventListener(t) {
      const e = this._eventCallbacks.get(t);
      if (!e) throw new Error(`Event listener ${t} doesn't exist!`);
      const [r] = e;
      let n = this._eventListeners.get(r);
      if (!n) throw new Error(`Event listeners don't exist for ${r}!`);
      this._eventCallbacks.delete(t),
        (n = n.filter((e) => e !== t)),
        0 === n.length && this._eventListeners.delete(r),
        0 == this._eventCallbacks.size &&
          (br.ok(0 === this._eventListeners.size),
          void 0 !== this._onLogsSubscriptionId &&
            (await this._provider.connection.removeOnLogsListener(
              this._onLogsSubscriptionId
            ),
            (this._onLogsSubscriptionId = void 0)));
    }
  }
  class so {
    constructor(t, e) {
      (this.coder = e), (this.programId = t);
    }
    parseLogs(t, e) {
      const r = new co(t),
        n = new ao();
      let i = r.next();
      for (; null !== i; ) {
        let [t, o, s] = this.handleLog(n, i);
        t && e(t), o && n.push(o), s && n.pop(), (i = r.next());
      }
    }
    handleLog(t, e) {
      return t.stack.length > 0 && t.program() === this.programId.toString()
        ? this.handleProgramLog(e)
        : [null, ...this.handleSystemLog(e)];
    }
    handleProgramLog(t) {
      if (t.startsWith("Program log: ") || t.startsWith("Program data: ")) {
        const e = t.startsWith("Program log: ") ? t.slice(no) : t.slice(io);
        return [this.coder.events.decode(e), null, !1];
      }
      return [null, ...this.handleSystemLog(t)];
    }
    handleSystemLog(t) {
      const e = t.split(":")[0];
      return null !== e.match(/^Program (.*) success/g)
        ? [null, !0]
        : e.startsWith(`Program ${this.programId.toString()} invoke`)
        ? [this.programId.toString(), !1]
        : e.includes("invoke")
        ? ["cpi", !1]
        : [null, !1];
    }
  }
  class ao {
    constructor() {
      this.stack = [];
    }
    program() {
      return br.ok(this.stack.length > 0), this.stack[this.stack.length - 1];
    }
    push(t) {
      this.stack.push(t);
    }
    pop() {
      br.ok(this.stack.length > 0), this.stack.pop();
    }
  }
  class co {
    constructor(t) {
      this.logs = t;
    }
    next() {
      if (0 === this.logs.length) return null;
      let t = this.logs[0];
      return (this.logs = this.logs.slice(1)), t;
    }
  }
  const uo = new e.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  function lo() {
    return new Bi(ho);
  }
  const ho = {
    version: "0.1.0",
    name: "spl_token",
    instructions: [
      {
        name: "initializeMint",
        accounts: [
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "rent", isMut: !1, isSigner: !1 },
        ],
        args: [
          { name: "decimals", type: "u8" },
          { name: "mintAuthority", type: "publicKey" },
          { name: "freezeAuthority", type: { coption: "publicKey" } },
        ],
      },
      {
        name: "initializeAccount",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !1 },
          { name: "rent", isMut: !1, isSigner: !1 },
        ],
        args: [],
      },
      {
        name: "initializeMultisig",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "rent", isMut: !1, isSigner: !1 },
        ],
        args: [{ name: "m", type: "u8" }],
      },
      {
        name: "transfer",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "destination", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [{ name: "amount", type: "u64" }],
      },
      {
        name: "approve",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "delegate", isMut: !1, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [{ name: "amount", type: "u64" }],
      },
      {
        name: "revoke",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [],
      },
      {
        name: "setAuthority",
        accounts: [
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [
          { name: "authorityType", type: "u8" },
          { name: "newAuthority", type: { coption: "publicKey" } },
        ],
      },
      {
        name: "mintTo",
        accounts: [
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "to", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [{ name: "amount", type: "u64" }],
      },
      {
        name: "burn",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [{ name: "amount", type: "u64" }],
      },
      {
        name: "closeAccount",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "destination", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !1 },
        ],
        args: [],
      },
      {
        name: "freezeAccount",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [],
      },
      {
        name: "thawAccount",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [],
      },
      {
        name: "transferChecked",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "destination", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [
          { name: "amount", type: "u64" },
          { name: "decimals", type: "u8" },
        ],
      },
      {
        name: "approveChecked",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "delegate", isMut: !1, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [
          { name: "amount", type: "u64" },
          { name: "decimals", type: "u8" },
        ],
      },
      {
        name: "mintToChecked",
        accounts: [
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "to", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [
          { name: "amount", type: "u64" },
          { name: "decimals", type: "u8" },
        ],
      },
      {
        name: "burnChecked",
        accounts: [
          { name: "source", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !0, isSigner: !1 },
          { name: "authority", isMut: !1, isSigner: !0 },
        ],
        args: [
          { name: "amount", type: "u64" },
          { name: "decimals", type: "u8" },
        ],
      },
      {
        name: "initializeAccount2",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
          { name: "rent", isMut: !1, isSigner: !1 },
        ],
        args: [{ name: "authority", type: "publicKey" }],
      },
      {
        name: "syncNative",
        accounts: [{ name: "account", isMut: !0, isSigner: !1 }],
        args: [],
      },
      {
        name: "initializeAccount3",
        accounts: [
          { name: "account", isMut: !0, isSigner: !1 },
          { name: "mint", isMut: !1, isSigner: !1 },
        ],
        args: [{ name: "authority", type: "publicKey" }],
      },
      {
        name: "initializeMultisig2",
        accounts: [{ name: "account", isMut: !0, isSigner: !1 }],
        args: [{ name: "m", type: "u8" }],
      },
      {
        name: "initializeMint2",
        accounts: [{ name: "mint", isMut: !0, isSigner: !1 }],
        args: [
          { name: "decimals", type: "u8" },
          { name: "mintAuthority", type: "publicKey" },
          { name: "freezeAuthority", type: { coption: "publicKey" } },
        ],
      },
    ],
    accounts: [
      {
        name: "mint",
        type: {
          kind: "struct",
          fields: [
            { name: "mintAuthority", type: { coption: "publicKey" } },
            { name: "supply", type: "u64" },
            { name: "decimals", type: "u8" },
            { name: "isInitialized", type: "bool" },
            { name: "freezeAuthority", type: { coption: "publicKey" } },
          ],
        },
      },
      {
        name: "token",
        type: {
          kind: "struct",
          fields: [
            { name: "mint", type: "publicKey" },
            { name: "authority", type: "publicKey" },
            { name: "amount", type: "u64" },
            { name: "delegate", type: { coption: "publicKey" } },
            { name: "state", type: "u8" },
            { name: "isNative", type: { coption: "u64" } },
            { name: "delegatedAmount", type: "u64" },
            { name: "closeAuthority", type: { coption: "publicKey" } },
          ],
        },
      },
    ],
  };
  class fo {
    constructor(t, e, r, n, i, o) {
      (this._args = t),
        (this._accounts = e),
        (this._provider = r),
        (this._programId = n),
        (this._idlIx = i),
        (this._accountStore = new po(r, o));
    }
    async resolve() {
      for (let t = 0; t < this._idlIx.accounts.length; t += 1) {
        const e = this._idlIx.accounts[t],
          r = a()(e.name);
        if (e.pda && e.pda.seeds.length > 0 && !this._accounts[r])
          await this.autoPopulatePda(e);
        else if (!e.isSigner || this._accounts[r])
          Reflect.has(fo.CONST_ACCOUNTS, r) &&
            !this._accounts[r] &&
            (this._accounts[r] = fo.CONST_ACCOUNTS[r]);
        else {
          if (void 0 === this._provider.wallet)
            throw new Error(
              "This function requires the Provider interface implementor to have a 'wallet' field."
            );
          this._accounts[r] = this._provider.wallet.publicKey;
        }
      }
    }
    async autoPopulatePda(t) {
      if (!t.pda || !t.pda.seeds) throw new Error("Must have seeds");
      const r = await Promise.all(t.pda.seeds.map((t) => this.toBuffer(t))),
        n = await this.parseProgramId(t),
        [i] = await e.PublicKey.findProgramAddress(r, n);
      this._accounts[a()(t.name)] = i;
    }
    async parseProgramId(t) {
      var r;
      if (!(null === (r = t.pda) || void 0 === r ? void 0 : r.programId))
        return this._programId;
      switch (t.pda.programId.kind) {
        case "const":
          return new e.PublicKey(this.toBufferConst(t.pda.programId.value));
        case "arg":
          return this.argValue(t.pda.programId);
        case "account":
          return await this.accountValue(t.pda.programId);
        default:
          throw new Error(
            `Unexpected program seed kind: ${t.pda.programId.kind}`
          );
      }
    }
    async toBuffer(t) {
      switch (t.kind) {
        case "const":
          return this.toBufferConst(t);
        case "arg":
          return await this.toBufferArg(t);
        case "account":
          return await this.toBufferAccount(t);
        default:
          throw new Error(`Unexpected seed kind: ${t.kind}`);
      }
    }
    toBufferConst(t) {
      return this.toBufferValue(t.type, t.value);
    }
    async toBufferArg(t) {
      const e = this.argValue(t);
      return this.toBufferValue(t.type, e);
    }
    argValue(t) {
      const e = a()(t.path.split(".")[0]),
        r = this._idlIx.args.findIndex((t) => t.name === e);
      if (-1 === r) throw new Error(`Unable to find argument for seed: ${e}`);
      return this._args[r];
    }
    async toBufferAccount(t) {
      const e = await this.accountValue(t);
      return this.toBufferValue(t.type, e);
    }
    async accountValue(t) {
      const e = t.path.split("."),
        r = e[0],
        n = this._accounts[a()(r)];
      if (1 === e.length) return n;
      const i = await this._accountStore.fetchAccount(t.account, n);
      return this.parseAccountValue(i, e.slice(1));
    }
    parseAccountValue(t, e) {
      let r;
      for (; e.length > 0; ) (r = t[a()(e[0])]), (e = e.slice(1));
      return r;
    }
    toBufferValue(t, e) {
      switch (t) {
        case "u8":
          return Buffer.from([e]);
        case "u16":
          let r = Buffer.alloc(2);
          return r.writeUInt16LE(e), r;
        case "u32":
          let n = Buffer.alloc(4);
          return n.writeUInt32LE(e), n;
        case "u64":
          let i = Buffer.alloc(8);
          return i.writeBigUInt64LE(BigInt(e)), i;
        case "string":
          return Buffer.from(xr(e));
        case "publicKey":
          return e.toBuffer();
        default:
          if (t.array) return Buffer.from(e);
          throw new Error(`Unexpected seed type: ${t}`);
      }
    }
  }
  fo.CONST_ACCOUNTS = {
    systemProgram: e.SystemProgram.programId,
    tokenProgram: Di,
    associatedTokenProgram: Hi,
    rent: e.SYSVAR_RENT_PUBKEY,
  };
  class po {
    constructor(t, e) {
      (this._provider = t), (this._accounts = e), (this._cache = new Map());
    }
    async fetchAccount(t, e) {
      const r = e.toString();
      if (!this._cache.has(r))
        if ("TokenAccount" === t) {
          const t = await this._provider.connection.getAccountInfo(e);
          if (null === t) throw new Error(`invalid account info for ${r}`);
          const n = lo().accounts.decode("token", t.data);
          this._cache.set(r, n);
        } else {
          const n = this._accounts[a()(t)].fetch(e);
          this._cache.set(r, n);
        }
      return this._cache.get(r);
    }
  }
  class _o {
    static build(t, e, r, n, i, o, s, a, c) {
      return (...u) => new mo(u, n, i, o, s, a, t, e, r, c);
    }
  }
  class mo {
    constructor(t, e, r, n, i, o, s, a, c, u) {
      (this._args = t),
        (this._ixFn = e),
        (this._txFn = r),
        (this._rpcFn = n),
        (this._simulateFn = i),
        (this._viewFn = o),
        (this._accounts = {}),
        (this._remainingAccounts = []),
        (this._signers = []),
        (this._preInstructions = []),
        (this._postInstructions = []),
        (this._accountsResolver = new fo(t, this._accounts, s, a, c, u));
    }
    async pubkeys() {
      return await this._accountsResolver.resolve(), this._accounts;
    }
    accounts(t) {
      return Object.assign(this._accounts, t), this;
    }
    signers(t) {
      return (this._signers = this._signers.concat(t)), this;
    }
    remainingAccounts(t) {
      return (
        (this._remainingAccounts = this._remainingAccounts.concat(t)), this
      );
    }
    preInstructions(t) {
      return (this._preInstructions = this._preInstructions.concat(t)), this;
    }
    postInstructions(t) {
      return (this._postInstructions = this._postInstructions.concat(t)), this;
    }
    async rpc(t) {
      return (
        await this._accountsResolver.resolve(),
        this._rpcFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
          options: t,
        })
      );
    }
    async view(t) {
      if ((await this._accountsResolver.resolve(), !this._viewFn))
        throw new Error("Method does not support views");
      return this._viewFn(...this._args, {
        accounts: this._accounts,
        signers: this._signers,
        remainingAccounts: this._remainingAccounts,
        preInstructions: this._preInstructions,
        postInstructions: this._postInstructions,
        options: t,
      });
    }
    async simulate(t) {
      return (
        await this._accountsResolver.resolve(),
        this._simulateFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
          options: t,
        })
      );
    }
    async instruction() {
      return (
        await this._accountsResolver.resolve(),
        this._ixFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
        })
      );
    }
    async transaction() {
      return (
        await this._accountsResolver.resolve(),
        this._txFn(...this._args, {
          accounts: this._accounts,
          signers: this._signers,
          remainingAccounts: this._remainingAccounts,
          preInstructions: this._preInstructions,
          postInstructions: this._postInstructions,
        })
      );
    }
  }
  class wo {
    constructor(t, e, r, n) {
      (e = zr(e)),
        r || (r = wn()),
        (this._idl = t),
        (this._provider = r),
        (this._programId = e),
        (this._coder = null != n ? n : new Xn(t)),
        (this._events = new oo(this._programId, r, this._coder));
      const [i, o, s, c, u, l, h, d] = class {
        static build(t, e, r, n) {
          const i = {},
            o = {},
            s = {},
            c = {},
            u = {},
            l = {},
            h = Lr(t),
            d = t.accounts
              ? class {
                  static build(t, e, r, n) {
                    var i;
                    const o = {};
                    return (
                      null === (i = t.accounts) ||
                        void 0 === i ||
                        i.forEach((i) => {
                          const s = a()(i.name);
                          o[s] = new eo(t, i, r, n, e);
                        }),
                      o
                    );
                  }
                }.build(t, e, r, n)
              : {},
            f = class {
              static build(t, e, r, n) {
                if (void 0 !== t.state) return new Qi(t, r, n, e);
              }
            }.build(t, e, r, n);
          return (
            t.instructions.forEach((f) => {
              const p = Gi.build(f, (t, r) => e.instruction.encode(t, r), r),
                _ = Yi.build(f, p),
                m = Ji.build(f, _, h, n),
                w = class {
                  static build(t, e, r, n, i, o, s) {
                    return async (...a) => {
                      var c;
                      const u = e(...a),
                        [, l] = Wi(t, [...a]);
                      let h;
                      if (void 0 === n.simulate)
                        throw new Error(
                          "This function requires 'Provider.simulate' to be implemented."
                        );
                      try {
                        h = await n.simulate(
                          u,
                          l.signers,
                          null === (c = l.options) || void 0 === c
                            ? void 0
                            : c.commitment
                        );
                      } catch (t) {
                        throw In(t, r);
                      }
                      if (void 0 === h)
                        throw new Error("Unable to simulate transaction");
                      const d = h.logs;
                      if (!d) throw new Error("Simulated logs not found");
                      const f = [];
                      return (
                        s.events &&
                          new so(o, i).parseLogs(d, (t) => {
                            f.push(t);
                          }),
                        { events: f, raw: d }
                      );
                    };
                  }
                }.build(f, _, h, n, e, r, t),
                y = class {
                  static build(t, e, r, n) {
                    const i = e.accounts.find((t) => t.isMut),
                      o = !!e.returns;
                    if (!i && o)
                      return async (...i) => {
                        var o, s;
                        let a = await r(...i);
                        const c = `Program return: ${t} `;
                        let u = a.raw.find((t) => t.startsWith(c));
                        if (!u) throw new Error("View expected return log");
                        let l = Rr(u.slice(c.length)),
                          h = e.returns;
                        if (!h) throw new Error("View expected return type");
                        return zn
                          .fieldLayout(
                            { type: h },
                            Array.from([
                              ...(null !== (o = n.accounts) && void 0 !== o
                                ? o
                                : []),
                              ...(null !== (s = n.types) && void 0 !== s
                                ? s
                                : []),
                            ])
                          )
                          .decode(l);
                      };
                  }
                }.build(r, f, w, t),
                g = _o.build(n, r, f, p, _, m, w, y, d),
                b = a()(f.name);
              (o[b] = p),
                (s[b] = _),
                (i[b] = m),
                (c[b] = w),
                (u[b] = g),
                y && (l[b] = y);
            }),
            [i, o, s, d, c, u, f, l]
          );
        }
      }.build(t, this._coder, e, r);
      (this.rpc = i),
        (this.instruction = o),
        (this.transaction = s),
        (this.account = c),
        (this.simulate = u),
        (this.methods = l),
        (this.state = h),
        (this.views = d);
    }
    get programId() {
      return this._programId;
    }
    get idl() {
      return this._idl;
    }
    get coder() {
      return this._coder;
    }
    get provider() {
      return this._provider;
    }
    static async at(t, e) {
      const r = zr(t),
        n = await wo.fetchIdl(r, e);
      if (!n) throw new Error(`IDL not found for program: ${t.toString()}`);
      return new wo(n, r, e);
    }
    static async fetchIdl(t, r) {
      r = null != r ? r : wn();
      const n = zr(t),
        i = await (async function (t) {
          const r = (await e.PublicKey.findProgramAddress([], t))[0];
          return await e.PublicKey.createWithSeed(r, "anchor:idl", t);
        })(n),
        o = await r.connection.getAccountInfo(i);
      if (!o) return null;
      let s = ((a = o.data.slice(8)), $i.decode(a));
      var a;
      const c = wr(s.data);
      return JSON.parse(Ar(c));
    }
    addEventListener(t, e) {
      return this._events.addEventListener(t, e);
    }
    async removeEventListener(t) {
      return await this._events.removeEventListener(t);
    }
  }
  class yo {
    static token(t) {
      return (function (t) {
        return new wo(ho, uo, t, lo());
      })(t);
    }
  }
})();
var __webpack_exports__ACCOUNT_DISCRIMINATOR_SIZE = __webpack_exports__.hi,
  __webpack_exports__AccountClient = __webpack_exports__.TO,
  __webpack_exports__AnchorError = __webpack_exports__.DG,
  __webpack_exports__AnchorProvider = __webpack_exports__.Y7,
  __webpack_exports__BN = __webpack_exports__.BN,
  __webpack_exports__BorshAccountsCoder = __webpack_exports__.Wr,
  __webpack_exports__BorshCoder = __webpack_exports__.lc,
  __webpack_exports__BorshEventCoder = __webpack_exports__.xX,
  __webpack_exports__BorshInstructionCoder = __webpack_exports__.aU,
  __webpack_exports__BorshStateCoder = __webpack_exports__.Dk,
  __webpack_exports__EventManager = __webpack_exports__.Qz,
  __webpack_exports__EventParser = __webpack_exports__.jf,
  __webpack_exports__IdlError = __webpack_exports__.p5,
  __webpack_exports__LangErrorCode = __webpack_exports__.hW,
  __webpack_exports__LangErrorMessage = __webpack_exports__.gH,
  __webpack_exports__MethodsBuilderFactory = __webpack_exports__.he,
  __webpack_exports__Program = __webpack_exports__.$r,
  __webpack_exports__ProgramError = __webpack_exports__.cM,
  __webpack_exports__ProgramErrorStack = __webpack_exports__.Iv,
  __webpack_exports__Spl = __webpack_exports__.RG,
  __webpack_exports__SplTokenCoder = __webpack_exports__.ae,
  __webpack_exports__StateClient = __webpack_exports__.Z_,
  __webpack_exports__eventDiscriminator = __webpack_exports__.Yf,
  __webpack_exports__getProvider = __webpack_exports__.VH,
  __webpack_exports__parseIdlErrors = __webpack_exports__.Ny,
  __webpack_exports__setProvider = __webpack_exports__.fc,
  __webpack_exports__splitArgsAndCtx = __webpack_exports__.$k,
  __webpack_exports__stateDiscriminator = __webpack_exports__.I_,
  __webpack_exports__toInstruction = __webpack_exports__.Ur,
  __webpack_exports__translateAddress = __webpack_exports__.VC,
  __webpack_exports__translateError = __webpack_exports__.R4,
  __webpack_exports__utils = __webpack_exports__.P6,
  __webpack_exports__validateAccounts = __webpack_exports__.QB,
  __webpack_exports__web3 = __webpack_exports__.rV;
export {
  __webpack_exports__ACCOUNT_DISCRIMINATOR_SIZE as ACCOUNT_DISCRIMINATOR_SIZE,
  __webpack_exports__AccountClient as AccountClient,
  __webpack_exports__AnchorError as AnchorError,
  __webpack_exports__AnchorProvider as AnchorProvider,
  __webpack_exports__BN as BN,
  __webpack_exports__BorshAccountsCoder as BorshAccountsCoder,
  __webpack_exports__BorshCoder as BorshCoder,
  __webpack_exports__BorshEventCoder as BorshEventCoder,
  __webpack_exports__BorshInstructionCoder as BorshInstructionCoder,
  __webpack_exports__BorshStateCoder as BorshStateCoder,
  __webpack_exports__EventManager as EventManager,
  __webpack_exports__EventParser as EventParser,
  __webpack_exports__IdlError as IdlError,
  __webpack_exports__LangErrorCode as LangErrorCode,
  __webpack_exports__LangErrorMessage as LangErrorMessage,
  __webpack_exports__MethodsBuilderFactory as MethodsBuilderFactory,
  __webpack_exports__Program as Program,
  __webpack_exports__ProgramError as ProgramError,
  __webpack_exports__ProgramErrorStack as ProgramErrorStack,
  __webpack_exports__Spl as Spl,
  __webpack_exports__SplTokenCoder as SplTokenCoder,
  __webpack_exports__StateClient as StateClient,
  __webpack_exports__eventDiscriminator as eventDiscriminator,
  __webpack_exports__getProvider as getProvider,
  __webpack_exports__parseIdlErrors as parseIdlErrors,
  __webpack_exports__setProvider as setProvider,
  __webpack_exports__splitArgsAndCtx as splitArgsAndCtx,
  __webpack_exports__stateDiscriminator as stateDiscriminator,
  __webpack_exports__toInstruction as toInstruction,
  __webpack_exports__translateAddress as translateAddress,
  __webpack_exports__translateError as translateError,
  __webpack_exports__utils as utils,
  __webpack_exports__validateAccounts as validateAccounts,
  __webpack_exports__web3 as web3,
};
