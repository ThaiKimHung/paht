! function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).Supercluster = e()
}(this, function () {
    "use strict";
    // console.log("gia tri this ------------ ", this)
    function t(o, n, r, i, s, a) {
        console.log("-------------- o,n,r,i,s,a", o, n, r, i, s, a)
        if (!(s - i <= r)) {
            var p = i + s >> 1;
            ! function t(o, n, r, i, s, a) {
                for (; s > i;) {
                    if (s - i > 600) {
                        var p = s - i + 1,
                            u = r - i + 1,
                            h = Math.log(p),
                            f = .5 * Math.exp(2 * h / 3),
                            d = .5 * Math.sqrt(h * f * (p - f) / p) * (u - p / 2 < 0 ? -1 : 1),
                            l = Math.max(i, Math.floor(r - u * f / p + d)),
                            c = Math.min(s, Math.floor(r + (p - u) * f / p + d));

                        console.log("--------------- p,u,h,f,d,l,c", p, u, h, f, d, l, c)
                        t(o, n, r, l, c, a)
                    }
                    var m = n[2 * r + a],
                        v = i,
                        g = s;
                    for (e(o, n, i, r), n[2 * s + a] > m && e(o, n, i, s); v < g;) {
                        for (e(o, n, v, g), v++ , g--; n[2 * v + a] < m;) v++;
                        for (; n[2 * g + a] > m;) g--
                    }
                    n[2 * i + a] === m ? e(o, n, i, g) : e(o, n, ++g, s), g <= r && (i = g + 1), r <= g && (s = g - 1)
                }
            }(o, n, p, i, s, a % 2), t(o, n, r, i, p - 1, a + 1), t(o, n, r, p + 1, s, a + 1)
        }
    }

    function e(t, e, n, r) {
        o(t, n, r), o(e, 2 * n, 2 * r), o(e, 2 * n + 1, 2 * r + 1)
    }

    function o(t, e, o) {
        var n = t[e];
        t[e] = t[o], t[o] = n
    }

    function n(t, e, o, n) {
        var r = t - o,
            i = e - n;
        return r * r + i * i
    }
    var r = function (t) {
        return t[0]
    },
        i = function (t) {
            return t[1]
        },
        s = function (e, o, n, s, a) {

            void 0 === o && (o = r), void 0 === n && (n = i), void 0 === s && (s = 64), void 0 === a && (a = Float64Array), this.nodeSize = s, this.points = e;
            for (var p = e.length < 65536 ? Uint16Array : Uint32Array,
                u = this.ids = new p(e.length),
                h = this.coords = new a(2 * e.length),
                f = 0; f < e.length;
                f++) u[f] = f,
                    h[2 * f] = o(e[f]),
                    h[2 * f + 1] = n(e[f]);
            t(u, h, s, 0, u.length - 1, 0)
        };
    s.prototype.range = function (t, e, o, n) {
        return function (t, e, o, n, r, i, s) {
            for (var a, p, u = [0, t.length - 1, 0], h = []; u.length;) {
                var f = u.pop(),
                    d = u.pop(),
                    l = u.pop();
                if (d - l <= s)
                    for (var c = l; c <= d; c++) a = e[2 * c], p = e[2 * c + 1], a >= o && a <= r && p >= n && p <= i && h.push(t[c]);
                else {
                    var m = Math.floor((l + d) / 2);
                    a = e[2 * m], p = e[2 * m + 1], a >= o && a <= r && p >= n && p <= i && h.push(t[m]);
                    var v = (f + 1) % 2;
                    (0 === f ? o <= a : n <= p) && (u.push(l), u.push(m - 1), u.push(v)), (0 === f ? r >= a : i >= p) && (u.push(m + 1), u.push(d), u.push(v))
                }
            }
            return h
        }(this.ids, this.coords, t, e, o, n, this.nodeSize)
    }, s.prototype.within = function (t, e, o) {
        //c??ng th???c t??nh d, t,e,o t=h.x,e =h.y o = a
        return function (t, e, o, r, i, s) {
            console.log("gia tri t -----------------11", t)
            for (var a = [0, t.length - 1, 0], p = [], u = i * i; a.length;) {
                console.log("mang a", a)
                var h = a.pop(),//a [0]
                    f = a.pop(),//a[t.Length
                    d = a.pop();//a[1]
                if (f - d <= s) {
                    console.log("vao s --------f-d<=s", a, h, f, d)
                    for (var l = d; l <= f; l++) n(e[2 * l], e[2 * l + 1], o, r) <= u && p.push(t[l]);


                }
                else {
                    console.log("vao else --------f-d<=s")
                    var c = Math.floor((d + f) / 2),
                        m = e[2 * c],
                        v = e[2 * c + 1];
                    n(m, v, o, r) <= u && p.push(t[c]);
                    var g = (h + 1) % 2;
                    (0 === h ? o - i <= m : r - i <= v) && (a.push(d), a.push(c - 1), a.push(g)), (0 === h ? o + i >= m : r + i >= v) && (a.push(c + 1), a.push(f), a.push(g))
                }
            }

            return p
        }(this.ids, this.coords, t, e, o, this.nodeSize)
    };
    var a = {
        minZoom: 0,
        maxZoom: 16,
        radius: 40,
        extent: 512,
        nodeSize: 64,
        log: !1,
        reduce: null,
        map: function (t) {
            return t
        }
    },
        p = function (t) {
            this.options = m(Object.create(a), t), this.trees = new Array(this.options.maxZoom + 1);
            console.log("gia tri ------------", t, this.options, this.trees)
        };

    function u(t, e, o, n, r) {
        return {
            x: t,
            y: e,
            zoom: 1 / 0,
            id: o,
            parentId: -1,
            numPoints: n,
            properties: r
        }
    }

    function h(t, e) {
        var o = t.geometry.coordinates,
            n = o[0],
            r = o[1];
        return {
            x: l(n),
            y: c(r),
            zoom: 1 / 0,
            index: e,
            parentId: -1
        }
    }

    function f(t) {
        return {
            type: "Feature",
            id: t.id,
            properties: d(t),
            geometry:
            {
                type: "Point",
                coordinates: [(n = t.x, 360 * (n - .5)), (e = t.y, o = (180 - 360 * e) * Math.PI / 180, 360 * Math.atan(Math.exp(o)) / Math.PI - 90)]
            }
        };
        var e, o, n
    }

    function d(t) {
        var e = t.numPoints,
            o = e >= 1e4 ? Math.round(e / 1e3) + "k" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : e;
        return m(m(
            {}, t.properties),
            {
                cluster: !0,
                cluster_id: t.id,
                point_count: e,
                point_count_abbreviated: o
            })
    }

    function l(t) {
        return t / 360 + .5
    }

    function c(t) {
        var e = Math.sin(t * Math.PI / 180),
            o = .5 - .25 * Math.log((1 + e) / (1 - e)) / Math.PI;
        return o < 0 ? 0 : o > 1 ? 1 : o
    }

    function m(t, e) {
        for (var o in e) {
            // console.log("gia tri e -------", e)
            // console.log("gia tri e -------", e[o])
            t[o] = e[o];
        }
        return t
    }

    function v(t) {
        return t.x
    }

    function g(t) {
        return t.y
    }
    return p.prototype.load = function (t) {
        // console.log("gia tri data truy???n vao", t, this.options)
        var e = this.options,
            o = e.log,
            n = e.minZoom,
            r = e.maxZoom,
            i = e.nodeSize;
        o && console.time("total time");
        var a = "prepare " + t.length + " points";
        o && console.time(a), this.points = t;
        for (var p = [], u = 0; u < t.length; u++) t[u].geometry && p.push(h(t[u], u));
        // console.log("gia tri ---------p", p);
        this.trees[r + 1] = new s(p, v, g, i, Float32Array), o && console.timeEnd(a);
        for (var f = r; f >= n; f--) {
            console.log("gia tri f", f)
            //duy???t theo d??? zoom t??? cao ?????n th???p 20->1
            var d = +Date.now();
            p = this._cluster(p, f), this.trees[f] = new s(p, v, g, i, Float32Array), o && console.log("z%d: %d clusters in %dms", f, p.length, +Date.now() - d);
            console.log("gia tri ---------p", p, this.trees[f]);
        }
        // console.log("gia tri ---------trees", this.trees, this);
        return o && console.timeEnd("total time"), this

    }, p.prototype.getClusters = function (t, e) {
        var o = ((t[0] + 180) % 360 + 360) % 360 - 180,
            n = Math.max(-90, Math.min(90, t[1])),
            r = 180 === t[2] ? 180 : ((t[2] + 180) % 360 + 360) % 360 - 180,
            i = Math.max(-90, Math.min(90, t[3]));
        if (t[2] - t[0] >= 360) o = -180, r = 180;
        else if (o > r) {
            var s = this.getClusters([o, n, 180, i], e),
                a = this.getClusters([-180, n, r, i], e);
            return s.concat(a)
        }
        for (var p = this.trees[this._limitZoom(e)], u = [], h = 0, d = p.range(l(o), c(i), l(r), c(n)); h < d.length; h += 1) {
            var m = d[h],
                v = p.points[m];
            u.push(v.numPoints ? f(v) : this.points[v.index])
        }
        return u
    }, p.prototype.getChildren = function (t) {
        var e = t >> 5,
            o = t % 32,
            n = "No cluster with the specified id.",
            r = this.trees[o];
        if (!r) throw new Error(n);
        var i = r.points[e];
        if (!i) throw new Error(n);
        for (var s = this.options.radius / (this.options.extent * Math.pow(2, o - 1)), a = [], p = 0, u = r.within(i.x, i.y, s); p < u.length; p += 1) {
            var h = u[p],
                d = r.points[h];
            d.parentId === t && a.push(d.numPoints ? f(d) : this.points[d.index])
        }
        if (0 === a.length) throw new Error(n);
        return a
    }, p.prototype.getLeaves = function (t, e, o) {
        e = e || 10, o = o || 0;
        var n = [];
        return this._appendLeaves(n, t, e, o, 0), n
    }, p.prototype.getTile = function (t, e, o) {
        var n = this.trees[this._limitZoom(t)],
            r = Math.pow(2, t),
            i = this.options,
            s = i.extent,
            a = i.radius / s,
            p = (o - a) / r,
            u = (o + 1 + a) / r,
            h = {
                features: []
            };
        return this._addTileFeatures(n.range((e - a) / r, p, (e + 1 + a) / r, u), n.points, e, o, r, h), 0 === e && this._addTileFeatures(n.range(1 - a / r, p, 1, u), n.points, r, o, r, h), e === r - 1 && this._addTileFeatures(n.range(0, p, a / r, u), n.points, -1, o, r, h), h.features.length ? h : null
    }, p.prototype.getClusterExpansionZoom = function (t) {
        for (var e = t % 32 - 1; e <= this.options.maxZoom;) {
            var o = this.getChildren(t);
            if (e++ , 1 !== o.length) break;
            t = o[0].properties.cluster_id
        }
        return e
    }, p.prototype._appendLeaves = function (t, e, o, n, r) {
        for (var i = 0, s = this.getChildren(e); i < s.length; i += 1) {
            var a = s[i],
                p = a.properties;
            if (p && p.cluster ? r + p.point_count <= n ? r += p.point_count : r = this._appendLeaves(t, p.cluster_id, o, n, r) : r < n ? r++ : t.push(a), t.length === o) break
        }
        return r
    }, p.prototype._addTileFeatures = function (t, e, o, n, r, i) {
        for (var s = 0, a = t; s < a.length; s += 1) {
            var p = e[a[s]],
                u = {
                    type: 1,
                    geometry: [
                        [Math.round(this.options.extent * (p.x * r - o)), Math.round(this.options.extent * (p.y * r - n))]
                    ],
                    tags: p.numPoints ? d(p) : this.points[p.index].properties
                },
                h = p.numPoints ? p.id : this.points[p.index].id;
            void 0 !== h && (u.id = h), i.features.push(u)
        }
    }, p.prototype._limitZoom = function (t) {
        return Math.max(this.options.minZoom, Math.min(t, this.options.maxZoom + 1))
    }, p.prototype._cluster = function (t, e) {
        //t l?? m???ng data truy???n v??o quy ?????i d???ng r???i 
        //e l?? c???p zoom 1-20
        for (var o = [], n = this.options, r = n.radius, i = n.extent, s = n.reduce, a = r / (i * Math.pow(2, e)), p = 0;
            p < t.length;
            p++) {
            //duy???t m???ng t data
            var h = t[p];
            console.log('gia tri ban dau h=====', h)
            //g??n gi?? tr??? h b???ng tvij tr?? p c???a data t
            if (!(h.zoom <= e)) {
                console.log("vao ---------wwwwwwwweee", e, (h.zoom <= e))
                h.zoom = e;
                for (var f = this.trees[e + 1], d = f.within(h.x, h.y, a), l = h.numPoints || 1, c = h.x * l, m = h.y * l, v = s && l > 1 ? this._map(h, !0) : null, g = (p << 5) + (e + 1), y = 0, x = d; y < x.length; y += 1) {
                    console.log("gia tri d ,f-1", d, f)
                    var M = x[y],
                        _ = f.points[M];
                    if (!(_.zoom <= e)) {
                        _.zoom = e;
                        var w = _.numPoints || 1;
                        c += _.x * w, m += _.y * w, l += w, _.parentId = g, s && (v || (v = this._map(h, !0)), s(v, this._map(_)))
                    }
                }
                1 === l ? o.push(h) : (h.parentId = g, o.push(u(c / l, m / l, g, l, v)))
            }
        }
        return o
    }, p.prototype._map = function (t, e) {
        if (t.numPoints) return e ? m(
            {}, t.properties) : t.properties;
        var o = this.points[t.index].properties,
            n = this.options.map(o);
        return e && n === o ? m(
            {}, n) : n
    }, p
});