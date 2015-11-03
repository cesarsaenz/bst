window.$BV || (function(f, l, c) {
    var j = {},
        p, s = {},
        n = {},
        i = {},
        q = {},
        t = {},
        e = [],
        m = 0;
    j.Date = {
        now: (function() {
            var w = Date;
            var v = w.now;
            if (typeof v === "function") {
                return function() {
                    return v.call(w)
                }
            } else {
                return function() {
                    return new w().getTime()
                }
            }
        }())
    };
    j.performance = {};
    j.performance.now = (function() {
        var x = f.performance;
        var v = x && x.now;
        if (typeof v === "function") {
            return function() {
                return v.call(x)
            }
        }
        var w = j.Date.now();
        if (x && x.timing && typeof x.timing.navigationStart === "number") {
            w = x.timing.navigationStart
        }
        return function() {
            return j.Date.now() - w
        }
    }());
    j.performance.mark = (function() {
        var z = f.performance;
        var v = z && z.mark;
        if (typeof v === "function") {
            return function(A) {
                v.call(z, A)
            }
        }
        var w = j.performance._marks = {};
        var x = j.performance._timeline = [];
        var y = {
            navigationStart: 1,
            unloadEventStart: 1,
            unloadEventEnd: 1,
            redirectStart: 1,
            redirectEnd: 1,
            fetchStart: 1,
            domainLookupStart: 1,
            domainLookupEnd: 1,
            connectStart: 1,
            connectEnd: 1,
            secureConnectionStart: 1,
            requestStart: 1,
            responseStart: 1,
            responseEnd: 1,
            domLoading: 1,
            domInteractive: 1,
            domContentLoadedEventStart: 1,
            domContentLoadedEventEnd: 1,
            domComplete: 1,
            loadEventStart: 1,
            loadEventEnd: 1
        };
        return function(B) {
            if (arguments.length < 1) {
                throw new SyntaxError("Cannot set mark without name")
            }
            if (B in y) {
                throw new SyntaxError('Cannot set mark with reserved name "' + B + '"')
            }
            var A = {
                entryType: "mark",
                name: B,
                startTime: j.performance.now(),
                duration: 0
            };
            w[B] = w[B] || [];
            w[B].push(A.startTime);
            x.push(A)
        }
    }());

    function d(v) {
        var w = [].join.call(arguments, " ");
        if (f.console && console.log) {
            if (l.all) {
                console.log(w)
            } else {
                console.log.apply(console, arguments)
            }
        } else {
            if (f.Debug && Debug.writeln) {
                Debug.writeln(w)
            } else {
                if (f.opera && opera.postError) {
                    opera.postError(w)
                }
            }
        }
    }
    j.log = d;

    function a(x, y) {
        var v, w;
        if (x.length !== c) {
            for (w = 0; w < x.length; w++) {
                y(w, x[w])
            }
        } else {
            for (v in x) {
                y(v, x[v])
            }
        }
    }

    function r(z) {
        var y, w, x, v;
        for (v = 1; v < arguments.length; v++) {
            if ((y = arguments[v]) != null) {
                for (w in y) {
                    if ((x = y[w]) !== c) {
                        z[w] = x
                    }
                }
            }
        }
        return z
    }

    function b(v) {
        m += v;
        $bv("body").toggleClass("BVDIAjaxWait", m > 0)
    }

    function g() {}
    j.Internal = r(g, {
        each: a,
        extend: r,
        exposeGlobals: function(v) {
            a(v, function(w, x) {
                if (/^(bv|BV)/.test(w)) {
                    f[w] = x
                }
            })
        },
        create: function(v) {
            function w() {}
            w.prototype = v;
            return new w()
        },
        newLatch: function(v) {
            var w = [];
            return {
                increment: function() {
                    v++
                },
                release: function() {
                    v--;
                    while (v <= 0 && w.length) {
                        (w.shift())()
                    }
                },
                queue: function(x) {
                    if (v <= 0) {
                        x()
                    } else {
                        w.push(x)
                    }
                }
            }
        }
    });

    function o(w, v) {
        return function() {
            return w.apply(null, v.concat([].slice.call(arguments, 0)))
        }
    }

    function h(v) {
        var x = [],
            w = g._require.s.contexts._.specified;
        a(v, function(B, A) {
            if (!w[A]) {
                var z = q[A],
                    y = i[z || A];
                if (z) {
                    x.push(z)
                }
                if (y) {
                    a(y, function(D, C) {
                        w[C] = true
                    })
                }
            }
        });
        if (x.length) {
            g._require(x)
        }
        return v
    }

    function k(v, w) {
        return function() {
            try {
                return w && w.apply(null, arguments)
            } catch (x) {
                d("Exception in " + v, x)
            }
        }
    }

    function u() {
        if ($bv().jquery) {
            $bv.ready()
        } else {
            p = true
        }
    }
    p = (l.readyState === "complete");
    if (l.addEventListener) {
        l.addEventListener("DOMContentLoaded", u, false);
        f.addEventListener("load", u, false)
    }
    j.docReady = u;
    r(g, {
        require: function(v, w) {
            return g._require(h(v), w && k("<unknown>", w))
        },
        define: function(v, w, x, y) {
            g._require.def(v, h(x), k(v, o(y, w)))
        },
        modify: function(x, v, w, y, z) {
            g._require.modify(x, v, h(y), z && k(v, o(z, w)))
        },
        callAjax: function(x, w) {
            var v = [].slice.call(arguments, 0);
            b(1);
            g._require([x], k(x, function(y) {
                b(-1);
                if (y) {
                    y.apply(null, v)
                } else {
                    d("Bazaarvoice: error fetching url: " + x)
                }
            }), "bvajax")
        },
        ajaxCallback: function(v) {
            e.push(v)
        },
        onModuleLoaded: function(w, x) {
            if (x === "bvajax") {
                var v = e.shift();
                g._require.def(w, [], function() {
                    return v
                }, x)
            }
        },
        defineJQuery: function(v) {
            g.define("jquery.core", [v.noConflict(true)], [], function(w) {
                f.$bv = w;
                if (p) {
                    u()
                }
                return w
            })
        },
        getAlternateUrl: function(v) {
            return t[v]
        },
        configureLoader: function(w, x, y, v, z) {
            if (g._baseUrl) {
                delete w.baseUrl
            } else {
                g._baseUrl = w.baseUrl
            }
            g._require(w);
            g._require(w, null, null, "bvajax");
            r(t, x);
            r(s, y);
            r(n, v);
            r(g, z)
        },
        configureAppLoader: function(z, v, y) {
            var w = v ? "-mobile" : "";
            a(["global", z], function(B, C) {
                var A = s[C + w] ? C + w : C;
                if (s[A]) {
                    a(s[A], function(E, D) {
                        i[E] = D;
                        for (var F = 0; F < D.length; F++) {
                            if (!q[D[F]]) {
                                q[D[F]] = E
                            }
                        }
                    });
                    delete s[A]
                }
            });

            function x(B, C) {
                var A = {};
                A[C] = q[B] || B;
                g._require.modify(A)
            }
            a(["global", z], function(A, B) {
                if (n[B]) {
                    a(n[B], x);
                    delete n[B]
                }
            });
            if (y) {
                a(y, x)
            }
        },
        configureFromWindow: function(v) {
            if (f != v && v.$BV && v.$BV.Internal._baseUrl) {
                g._baseUrl = null;
                g.configureLoader({
                    baseUrl: v.$BV.Internal._baseUrl
                })
            }
        }
    });
    f.$bv = function(v) {
        var x, y, w = [];
        if (v && (x = /^\s*#([^, ]+)\s*$/.exec(v)) && (y = l.getElementById(x[1]))) {
            w.push(y)
        } else {
            if (v === "body") {
                w.push(y = l.body)
            }
        }
        w.text = function() {
            return y && (y.textContent || y.innerText)
        };
        w.attr = function(z, A) {
            if (A === c) {
                return y && y.getAttribute(z)
            } else {
                y && y.setAttribute(z, "" + A);
                return w
            }
        };
        w.toggleClass = function(z, B) {
            if (y) {
                var A = " " + (y.className || "") + " ";
                if (B) {
                    if (A.indexOf(" " + z + " ") < 0) {
                        A += " " + z;
                        y.className = A.replace(/^\s+|\s+$/g, "")
                    }
                } else {
                    y.className = A.replace(" " + z, "").replace(/^\s+|\s+$/g, "")
                }
            }
        };
        return w
    };
    f.$BV = j
}(window, document));
/*
 * @license RequireJS Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
 * Available via the MIT, GPL or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
(function(n) {
    var h = "0.12.0",
        o = {},
        r, v, g = "_",
        u = [],
        f, y, x, k, t, j, q, e = /^(complete|loaded)$/,
        p = !!(typeof window !== "undefined" && navigator && document),
        l = !p && typeof importScripts !== "undefined",
        w = Object.prototype.toString,
        d, c, a;

    function b(i) {
        return w.call(i) === "[object Function]"
    }
    if (typeof n !== "undefined") {
        if (b(n)) {
            return
        } else {
            j = n
        }
    }
    n = function(m, s, i) {
        if (typeof m === "string" && !b(s)) {
            return n.get(m, s)
        }
        return n.def.apply(n, arguments)
    };
    c = n;
    n.def = function(O, G, B, M) {
        var N = null,
            m, z, E, K, I, s, C, H, A, F, J, D, L;
        if (typeof O === "string") {
            if (!n.isArray(G)) {
                M = B;
                B = G;
                G = []
            }
            M = M || r.ctxName;
            m = r.contexts[M];
            if (m && (m.defined[O] || m.waiting[O])) {
                return n
            }
        } else {
            if (n.isArray(O)) {
                M = B;
                B = G;
                G = O;
                O = null
            } else {
                if (n.isFunction(O)) {
                    B = O;
                    M = G;
                    O = null;
                    G = []
                } else {
                    N = O;
                    O = null;
                    if (n.isFunction(G)) {
                        M = B;
                        B = G;
                        G = []
                    }
                    M = M || N.context
                }
            }
        }
        M = M || r.ctxName;
        m = r.contexts[M];
        if (!m) {
            z = {
                contextName: M,
                config: {
                    waitSeconds: 7,
                    baseUrl: r.baseUrl || "./",
                    paths: {}
                },
                waiting: [],
                specified: {
                    require: true,
                    exports: true,
                    module: true
                },
                loaded: {
                    require: true
                },
                urlFetched: {},
                defined: {},
                modifiers: {}
            };
            z.defined.require = n;
            m = r.contexts[M] = z
        }
        if (N) {
            if (N.baseUrl) {
                if (N.baseUrl.charAt(N.baseUrl.length - 1) !== "/") {
                    N.baseUrl += "/"
                }
            }
            J = m.config.paths;
            n.mixin(m.config, N, true);
            if (N.paths) {
                for (s in N.paths) {
                    if (!(s in o)) {
                        J[s] = N.paths[s]
                    }
                }
                m.config.paths = J
            }
            if (N.priority) {
                c(N.priority);
                m.config.priorityWait = N.priority
            }
            if (N.deps || N.callback) {
                c(N.deps || [], N.callback)
            }
            if (!G) {
                return n
            }
        }
        if (G) {
            H = G;
            G = [];
            for (L = 0; L < H.length; L++) {
                G[L] = n.splitPrefix(H[L], O)
            }
        }
        C = m.waiting.push({
            name: O,
            deps: G,
            callback: B
        });
        if (O) {
            m.waiting[O] = C - 1;
            m.specified[O] = true;
            A = m.modifiers[O];
            if (A) {
                c(A, M)
            }
        }
        if (O && B && !n.isFunction(B)) {
            m.defined[O] = B
        }
        if (r.paused || m.config.priorityWait) {
            (r.paused || (r.paused = [])).push([F, O, G, m])
        } else {
            n.checkDeps(F, O, G, m);
            n.checkLoaded(M)
        }
        if (O) {
            m.loaded[O] = true
        }
        return n
    };
    n.mixin = function(s, m, i) {
        for (var z in m) {
            if (!(z in o) && (!(z in s) || i)) {
                s[z] = m[z]
            }
        }
        return n
    };
    n.version = h;
    r = n.s = {
        ctxName: g,
        contexts: {},
        skipAsync: {},
        isBrowser: p,
        isPageLoaded: !p,
        readyCalls: [],
        doc: p ? document : null
    };
    n.isBrowser = r.isBrowser;
    if (p) {
        r.head = document.getElementsByTagName("head")[0];
        a = document.getElementsByTagName("base")[0];
        if (a) {
            r.head = a.parentNode
        }
    }
    n.pause = function() {
        if (!r.paused) {
            r.paused = []
        }
    };
    n.resume = function() {
        var z, m, s;
        if (r.contexts[r.ctxName].config.priorityWait) {
            return
        }
        if (r.paused) {
            s = r.paused;
            delete r.paused;
            for (z = 0;
                (m = s[z]); z++) {
                n.checkDeps.apply(n, m)
            }
        }
        n.checkLoaded(r.ctxName)
    };
    n.checkDeps = function(m, s, C, A) {
        var z, B;
        if (m) {} else {
            for (z = 0;
                (B = C[z]); z++) {
                if (!A.specified[B.fullName]) {
                    A.specified[B.fullName] = true;
                    if (B.prefix) {} else {
                        n.load(B.name, A.contextName)
                    }
                }
            }
        }
    };
    n.modify = function(B, m, G, F, A) {
        var i, z, C, D = (typeof B === "string" ? A : m) || r.ctxName,
            s = r.contexts[D],
            E = s.modifiers;
        if (typeof B === "string") {
            C = E[B] || (E[B] = []);
            if (!C[m]) {
                C.push(m);
                C[m] = true
            }
            n.def(m, G, F, A)
        } else {
            for (i in B) {
                if (!(i in o)) {
                    z = B[i];
                    C = s.modifiers[i] || (s.modifiers[i] = []);
                    if (!C[z]) {
                        C.push(z);
                        C[z] = true;
                        if (s.specified[i]) {
                            c([z], D)
                        }
                    }
                }
            }
        }
    };
    n.isArray = function(i) {
        return w.call(i) === "[object Array]"
    };
    n.isFunction = b;
    n.get = function(m, s) {
        if (m === "exports" || m === "module") {
            throw new Error("require of " + m + " is not allowed.")
        }
        s = s || r.ctxName;
        var i = r.contexts[s].defined[m];
        if (i === undefined) {
            throw new Error("require: module name '" + m + "' has not been loaded yet for context: " + s)
        }
        return i
    };
    n.load = function(s, B) {
        var z = r.contexts[B],
            A = z.urlFetched,
            m = z.loaded,
            i;
        r.isDone = false;
        if (!m[s]) {
            m[s] = false
        }
        i = n.nameToUrl(s, null, B);
        if (!A[i]) {
            z.startTime = (new Date()).getTime();
            n.attach(i, B, s);
            A[i] = true
        }
        z.startTime = (new Date()).getTime()
    };
    n.jsExtRegExp = /\.js$/;
    n.normalizeName = function(m, s) {
        var i;
        if (m.charAt(0) === ".") {
            s = s.split("/");
            s = s.slice(0, s.length - 1);
            m = s.concat(m.split("/"));
            for (v = 0;
                (i = m[v]); v++) {
                if (i === ".") {
                    m.splice(v, 1);
                    v -= 1
                } else {
                    if (i === "..") {
                        m.splice(v - 1, 2);
                        v -= 2
                    }
                }
            }
            m = m.join("/")
        }
        return m
    };
    n.splitPrefix = function(i, m) {
        var s = null;
        if (m) {
            i = n.normalizeName(i, m)
        }
        return {
            prefix: s,
            name: i,
            fullName: s ? s + "!" + i : i
        }
    };
    n.nameToUrl = function(m, z, B) {
        var F, C, D, E, s, A = r.contexts[B].config;
        if (m.indexOf(":") !== -1 || m.charAt(0) === "/" || n.jsExtRegExp.test(m)) {
            return m
        } else {
            if (m.charAt(0) === ".") {
                throw new Error("require.nameToUrl does not handle relative module names (ones that start with '.' or '..')")
            } else {
                F = A.paths;
                C = m.split("/");
                for (D = C.length; D > 0; D--) {
                    E = C.slice(0, D).join("/");
                    if (F[E]) {
                        C.splice(0, D, F[E]);
                        break
                    }
                }
                s = C.join("/") + (z || ".js");
                return ((s.charAt(0) === "/" || s.match(/^\w+:/)) ? "" : A.baseUrl) + s
            }
        }
    };
    n.checkLoaded = function(R) {
        var D = r.contexts[R || r.ctxName],
            G = D.config.waitSeconds * 1000,
            I = G && (D.startTime + G) < new Date().getTime(),
            P, B = D.defined,
            m = D.modifiers,
            z, O = "",
            M = false,
            A = false,
            E, J, N, Q, C, L, K, F, H, s = {};
        if (D.isCheckLoaded) {
            return
        }
        if (D.config.priorityWait) {
            J = true;
            for (Q = 0;
                (N = D.config.priorityWait[Q]); Q++) {
                if (!D.loaded[N]) {
                    J = false;
                    break
                }
            }
            if (J) {
                delete D.config.priorityWait;
                n.resume()
            } else {
                return
            }
        }
        D.isCheckLoaded = true;
        z = D.waiting;
        P = D.loaded;
        for (E in P) {
            if (!(E in o)) {
                M = true;
                if (!P[E]) {
                    if (I) {
                        O += E + " "
                    } else {
                        A = true;
                        break
                    }
                }
            }
        }
        if (!M && !z.length) {
            D.isCheckLoaded = false;
            return
        }
        if (I && O) {
            H = new Error("RequireJS load timeout for modules: " + O);
            H.requireType = "timeout";
            H.requireModules = O
        }
        if (A) {
            D.isCheckLoaded = false;
            if (p || l) {
                setTimeout(function() {
                    n.checkLoaded(R)
                }, 50)
            }
            return
        }
        D.waiting = [];
        D.loaded = {};
        for (E in m) {
            if (!(E in o)) {
                if (B[E]) {
                    n.execModifiers(E, s, z, D)
                }
            }
        }
        for (Q = 0;
            (C = z[Q]); Q++) {
            n.exec(C, s, z, D)
        }
        D.isCheckLoaded = false;
        if (D.waiting.length) {
            n.checkLoaded(R)
        } else {
            if (u.length) {} else {
                r.ctxName = g;
                r.isDone = true;
                if (n.callReady) {
                    n.callReady()
                }
            }
        }
    };
    n.exec = function(s, C, K, m) {
        if (!s) {
            return undefined
        }
        var i = s.name,
            A = s.callback,
            J = s.deps,
            D, H, B = m.defined,
            E, F = [],
            z, G = false,
            I;
        if (i) {
            if (C[i] || i in B) {
                return B[i]
            }
            C[i] = true
        }
        if (J) {
            for (D = 0;
                (H = J[D]); D++) {
                I = H.name;
                if (I === "exports") {
                    z = B[i] = {};
                    G = true
                } else {
                    if (I === "module") {
                        z = {
                            id: i,
                            uri: i ? n.nameToUrl(i, null, m.contextName) : undefined
                        }
                    } else {
                        z = I in B ? B[I] : (C[I] ? undefined : n.exec(K[K[I]], C, K, m))
                    }
                }
                F.push(z)
            }
        }
        A = s.callback;
        if (A && n.isFunction(A)) {
            E = n.execCb(i, A, F);
            if (i) {
                if (G) {
                    E = B[i]
                } else {
                    if (i in B) {
                        throw new Error(i + " has already been defined")
                    } else {
                        B[i] = E
                    }
                }
            }
        }
        n.execModifiers(i, C, K, m);
        return E
    };
    n.execCb = function(s, i, m) {
        return i.apply(null, m)
    };
    n.execModifiers = function(D, C, E, A) {
        var m = A.modifiers,
            B = m[D],
            z, s;
        if (B) {
            for (s = 0; s < B.length; s++) {
                z = B[s];
                if (z in E) {
                    n.exec(E[E[z]], C, E, A)
                }
            }
            delete m[D]
        }
    };
    n.onScriptLoad = function(i) {
        var s = i.currentTarget || i.srcElement,
            z, m;
        if (i.type === "load" || i.type === "error" || e.test(s.readyState)) {
            z = s.getAttribute("data-requirecontext");
            m = s.getAttribute("data-requiremodule");
            $BV.Internal.onModuleLoaded(m, z);
            r.contexts[z].loaded[m] = true;
            n.checkLoaded(z);
            if (s.removeEventListener) {
                s.removeEventListener("load", n.onScriptLoad, false);
                s.removeEventListener("error", n.onScriptLoad, false)
            } else {
                s.detachEvent("onreadystatechange", n.onScriptLoad)
            }
        }
    };
    n.attach = function(s, B, m, C, z) {
        var A, i;
        if (p) {
            C = C || n.onScriptLoad;
            A = document.createElement("script");
            A.type = z || "text/javascript";
            A.charset = "utf-8";
            if (!r.skipAsync[s]) {
                A.setAttribute("async", "async")
            }
            A.setAttribute("data-requirecontext", B);
            A.setAttribute("data-requiremodule", m);
            if (A.addEventListener) {
                A.addEventListener("load", C, false);
                A.addEventListener("error", C, false)
            } else {
                A.attachEvent("onreadystatechange", C)
            }
            A.src = s;
            return a ? r.head.insertBefore(A, a) : r.head.appendChild(A)
        } else {
            if (l) {
                i = r.contexts[B].loaded;
                i[m] = false;
                importScripts(s);
                $BV.Internal.onModuleLoaded(m, B);
                i[m] = true
            }
        }
        return null
    };
    r.baseUrl = j && j.baseUrl;
    if (p && (!r.baseUrl || !r.head)) {
        f = document.getElementsByTagName("script");
        if (j && j.baseUrlMatch) {
            x = j.baseUrlMatch
        } else {
            x = /(allplugins-|transportD-)?require\.js(\W|$)/i
        }
        for (v = f.length - 1; v > -1 && (y = f[v]); v--) {
            if (!r.head) {
                r.head = y.parentNode
            }
            k = y.src;
            if (k) {
                t = k.match(x);
                if (t) {
                    r.baseUrl = k.substring(0, t.index);
                    break
                }
            }
        }
    }
    if (j) {
        c(j)
    }
    $BV.Internal._require = n
}($BV.Internal._require));
(function(f, g, a) {
    var b = a._require,
        h = b.attach;
    b.attach = function(k, m, j) {
        var l = a.getAlternateUrl(j);
        if (l && m === "_" && !c(j)) {
            i(l, k, m, j)
        } else {
            h.apply(null, arguments)
        }
    };

    function i(l, n, m, j) {
        var k = f.jQuery;
        h(l, m, j, function(r) {
            var q = r.currentTarget || r.srcElement,
                p = r.type === "error",
                s = f.jQuery,
                o = "1.6.3";
            if (!q.readyState || q.readyState === "loaded" || q.readyState === "complete") {
                if (!p && j === "jquery.core" && s && s !== k && s.fn && s.fn.jquery === o) {
                    s.noConflict(true);
                    if (!e(f.jQuery, s)) {
                        a.defineJQuery(s)
                    }
                }
                if (d(j, m)) {
                    b.onScriptLoad(r)
                } else {
                    h(n, m, j)
                }
            }
        })
    }

    function c(j) {
        return j === "jquery.core" && (g.all || (f.Prototype && /^1\.[0-5]\b/.test(Prototype.Version)) || !g.querySelectorAll)
    }

    function e(n, j) {
        try {
            if (!(n && n.fn && n.fn.jquery && n.data)) {
                return false
            } else {
                if (n.expando) {
                    return n.expando === j.expando
                } else {
                    var m = g.createElement("div");
                    n.data(m, "bv", "bv");
                    var k = m[j.expando] != null;
                    n.removeData(m, "bv");
                    return k
                }
            }
        } catch (l) {
            return true
        }
    }

    function d(j, l) {
        var k = b.s.contexts[l || b.s.ctxName];
        return !!(k.defined[j] || k.waiting[j])
    }
})(window, document, $BV.Internal);
$BV.Internal.configureLoader({
    "baseUrl": "//boost.ugc.bazaarvoice.com/module/8149-en_us/",
    "waitSeconds": 20
}, {
    "jquery.core": "//ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js"
}, {
    "global": {
        "cmn/8149b-en_us/display.pkg": ["alignments", "analyticsAutoTagHooks", "analyticsHooks", "analyticsVersioning", "animationOptions", "animationQueueing", "apiCore", "browserVersion", "conditionalBehavior", "contentDispatcher", "contentDisplay", "cookies", "crossDomain", "domUtils", "dotnet", "dropdown", "facebookConnect", "forms", "formula", "framedContent", "hostedAuthentication", "iframeSupport", "injection", "injection.shared", "injection.shared.replacements", "injectionRPC", "jquery.effects.core", "json2", "lightbox", "magpie", "magpieTracking", "overlay", "parseUri", "requester", "rpcSupport", "socialConnect", "socialConnectFacebook", "socialInsightsWorkbench", "swfobject", "tooltip", "underscore", "urlEnvironmentManagementService", "urlEnvironmentStatus", "userTiming", "wrapperDivs"]
    },
    "rr": {
        "rr/8149b-en_us/display.pkg": ["commentDisplay", "contentFocusingSupport", "facebookOpenGraph", "feedback", "filtering", "profileSnapshot", "rr/analyticsHooksRR", "rr/analyticsInternalLegacyHooksRR", "rr/contentDisplayRR", "rr/contentFocusingSupportRR", "rr/injection.rr", "rr/injection.rr.replacements", "tagDisplay", "trustMark"],
        "rr/8149b-en_us/submit.pkg": ["additionalContentPaging", "contentSubmit", "deviceFingerprint", "fieldPicker", "fieldTextPrompt", "jquery.rating", "jquery.ui.core", "jquery.ui.mouse", "jquery.ui.slider", "jquery.ui.widget", "ratingControls", "rr/reviewSubmissionRR", "submitFrame", "submitInjection", "tagSubmission", "textCounter"]
    },
    "rr-mobile": {
        "rr/8149b-en_us/mobiledisplay.pkg": ["commentDisplay", "contentFocusingSupport", "facebookOpenGraph", "feedback", "rr/analyticsHooksRR", "rr/analyticsInternalLegacyHooksRR", "rr/contentDisplayRR", "rr/contentFocusingSupportRR", "rr/injection.rr", "rr/injection.rr.replacements", "trustMark"],
        "rr/8149b-en_us/mobilesubmit.pkg": ["additionalContentPaging", "contentSubmit", "fieldPicker", "jquery.rating", "jquery.ui.core", "jquery.ui.mouse", "jquery.ui.slider", "jquery.ui.widget", "ratingControls", "rr/reviewSubmissionRR", "submitFrame", "tagSubmission", "textCounter"]
    },
    "cp": {
        "cp/8149b-en_us/display.pkg": ["cp/analyticsHooksCP", "cp/photoDisplayCP", "cp/tabbingCP", "cp/videoDisplayCP", "photoDisplay", "popupDisplay", "qa/photoDisplayQA", "qa/videoDisplayQA", "rr/photoDisplayRR", "rr/videoDisplayRR", "sy/photoDisplaySY", "sy/videoDisplaySY", "videoDisplay"],
        "cp/8149b-en_us/submit.pkg": ["contentSubmit", "cp/avatarSelectionCP", "jquery.rating", "jquery.ui.core", "jquery.ui.mouse", "jquery.ui.slider", "jquery.ui.widget", "ratingControls", "submitFrame", "submitInjection"]
    },
    "cp-mobile": {
        "cp/8149b-en_us/mobiledisplay.pkg": ["cp/analyticsHooksCP", "cp/tabbingCP"]
    }
}, {
    "global": {
        "analyticsAutoTagHooks": "analyticsHooks"
    }
}, {
    "_magpieSettings": {
        "anonymousHostname": "network-a.bazaarvoice.com",
        "trackerHostname": "network.bazaarvoice.com",
        "autoTagEnabled": true,
        "prrEnv": "prod",
        "vendorName": "magpie",
        "anonymous": false,
        "brandDomain": "boostmobile.com",
        "defaultClassesOnly": false
    }
});

$BV.Internal.define("apiCore", [window, document, $BV, $BV.Internal, encodeURIComponent], ["exports"], function(i, r, o, n, a, u) {
    var j = {
            global: {}
        },
        g = {
            global: {}
        },
        k = "bvJsonpCbk",
        l = {},
        b, f = [];
    n.extend(o, {
        configure: function(y, x) {
            if (typeof y === "object") {
                n.each(y, o.configure)
            } else {
                if (!(y in j)) {
                    o.log("Unknown Bazaarvoice configuration scope: " + y)
                } else {
                    n.extend(j[y], x)
                }
            }
        },
        getConfiguration: function(y, x) {
            return n.extend({}, j.global, j[y], x, {
                scope: y
            })
        },
        ui: function(y, z, x) {
            if (o.performance && o.performance.mark) {
                o.performance.mark("bv-render-start")
            }
            if (y === "submission_container") {
                x = z;
                z = y;
                y = h(x, "bvappcode", true)
            }
            x = n.extend(o.getConfiguration(y, x), {
                method: z
            });
            u.exec(y, z, x)
        }
    });

    function t(x, y) {
        throw "Bazaarvoice: Unknown API method for " + x + ": " + y
    }

    function s(x) {
        throw "Bazaarvoice: Missing required configuration setting: " + x
    }

    function v(x, y) {
        throw "Bazaarvoice: Value not allowed for parameter " + x + ": " + y + " " + Object.prototype.toString.call(y)
    }

    function w(x) {
        return /string|number|boolean/.test(typeof x)
    }

    function m(x) {
        return Object.prototype.toString.call(x) === "[object Array]"
    }

    function h(z, y, A) {
        var x = new RegExp("[?&]" + y + "=([^&]+)", "i").exec((z && z.submissionContainerBvParameters) || i.location.search);
        if (!x && A) {
            throw "Bazaarvoice: Missing required query parameter: " + y
        }
        return x && decodeURIComponent(x[1])
    }

    function q(z, y, x, A) {
        return z.replace(new RegExp("^([^?#]*\\?(?:[^#]*&)?" + y + "=)" + x + "([&#]|$)", "i"), "$1" + A + "$2")
    }

    function c(z, x, y) {
        if (y.userToken) {
            z = z.replace(/__USERID__|__ALLOWANONYMOUS__/g, y.userToken);
            if (x) {
                z = q(z, "bvauthenticateuser", "true", "false")
            }
        }
        if (y.authType) {
            z = z.replace(/__AUTHTYPE__/g, y.authType)
        }
        return z
    }

    function p(z, y, A, x) {
        if (y != null) {
            if (typeof y === "object") {
                n.each(y, function(B, C) {
                    e(z + "_" + B, C, A, x)
                })
            } else {
                v(z, y)
            }
        }
    }

    function e(z, y, A, x) {
        if (y != null) {
            if (w(y)) {
                x(z, y)
            } else {
                if (m(y)) {
                    if (A) {
                        n.each(y, function(B, C) {
                            if (!w(C)) {
                                v(z, C)
                            }
                        });
                        x(z, y.join(","))
                    } else {
                        n.each(y, function(B, C) {
                            x(z, C)
                        })
                    }
                } else {
                    v(z, y)
                }
            }
        }
    }
    i[k] = function(x) {
        n.ajaxCallback(function(z, y, A) {
            if (A) {
                A(x, y)
            }
        })
    };

    function d(z, A) {
        var x = i.location,
            y = /#bvapi_disable=([\w\.\-\*]+)$/.exec(x.hash);
        y = y || /[?&]bvapi_disable=([\w\.\-\*]+)(?:&|$)/.exec(x.search);
        y = y || /(?:^|; *)bvapi_disable=([\w\.\-\*]+)(?:;|$)/.exec(r.cookie);
        return y && new RegExp("(^|-)(" + z + "|\\*)\\.(" + A + "|\\*)(-|$)").test(y[1])
    }
    n.extend(u, {
        registerScope: function(x) {
            if (!j[x]) {
                j[x] = {}
            }
        },
        register: function(y, z, x) {
            (g[y] = g[y] || {})[z] = x
        },
        exec: function(y, z) {
            if (d(y, z)) {
                o.log("Bazaarvoice: Ignoring disabled method " + y + "." + z);
                return
            }
            var x = (g[y] || {})[z] || g.global[z];
            if (!x) {
                t(y, z)
            }
            x.apply(null, arguments)
        },
        newLinkHandler: function(x) {
            return function(A, B, z) {
                var y = u.getUrl(x, z, true);
                if (!z.target) {
                    i.location = y
                } else {
                    if (z.windowFeatures == null) {
                        i.open(y, z.target)
                    } else {
                        i.open(y, z.target, z.windowFeatures)
                    }
                }
            }
        },
        newJsonHandler: function(x) {
            return u.newAjaxHandler(n.extend({
                query: "callback=" + k
            }, x))
        },
        newAjaxHandler: function(x) {
            return function(I, y, A, H) {
                n.configureAppLoader(I, A.displayType === "mobile");
                var C, G, z, E = A;
                A = n.extend({}, A);
                C = A.injectionLatch = n.newLatch(0);
                if (A.allowSamePageSubmission !== false && !b && h(A, "bvappcode") === I && h(A, "bvpage")) {
                    C.increment();
                    u.inframeSubmission(I, y, E, C.release);
                    A.suppressScroll = true
                }
                var D = true;
                var F = function() {
                    if (!D) {
                        D = true;
                        C.release()
                    }
                };
                if (x.cssUrl) {
                    C.increment();
                    D = false
                }
                var B = u.getUrl(x, A);
                f.push({
                    url: B,
                    config: A
                });
                n.callAjax(B, A, H);
                if (x.cssUrl) {
                    z = u.loadCss(x.cssUrl, A, F)
                }
                u.prefetchDependencies(A);
                G = n.newLatch(0);
                if (x.crossDomainUrl) {
                    G.increment();
                    n.require(["crossDomain"], function(J) {
                        var K = A.urlBase + u.expandPattern(x.crossDomainUrl, true, A);
                        J.ensureFrame(K, A.urlPathPrefix).await(G.release)
                    })
                }
                if (!D) {
                    n.require(["requester"], function(J) {
                        G.queue(function() {
                            if (!D) {
                                J.waitForCss(z, F)
                            }
                        })
                    })
                }
            }
        },
        getAjaxUiMethodsExecuted: function() {
            return f
        },
        newDispatchHandler: function(z, x, y) {
            return function(B, D, A) {
                var C = A[z];
                if (C == null) {
                    C = x
                }
                if (C == null) {
                    s(z)
                }
                if (!y[C]) {
                    v(z, C)
                }
                y[C].apply(null, arguments)
            }
        },
        submissionParams: "campaignId,userToken:user,submissionContainerUrl:submissionUrl,submissionContainerUrlParameters:submissionParams,submissionType,productAttributes:productAttribute,submissionSessionParameters:sessionParams",
        submissionParamAdapters: [function(y, x) {
            x("return", String(y.submissionReturnUrl || i.location));
            if (y.onSubmissionReturn) {
                x("innerreturncbk", true)
            }
            if (y.internalQueryParams) {
                n.each(y.internalQueryParams, function(z, A) {
                    x(z, A)
                })
            }
        }, function(y, x) {
            p("productAttribute", y.productAttributes, false, x)
        }],
        startSubmission: function(A, B, D, C, x, z, y) {
            u.login(C, x, A, function(E) {
                var F = E.allowSamePageSubmission || !A;
                if (D && F) {
                    n.callAjax(c(D, false, E), E)
                } else {
                    if (B && F) {
                        u.embedFrame(c(B, false, E), E)
                    } else {
                        y(c(A, true, E))
                    }
                }
            }, A, z, y)
        },
        inframeSubmission: function(B, D, A, C) {
            var y, x;

            function z() {
                if (!y) {
                    C();
                    y = true
                }
            }
            x = true;
            u.submissionContainerHandler(B, D, A, function() {
                x = false
            }, z);
            if (x) {
                setTimeout(z, 250)
            }
        },
        submissionContainerHandler: function(B, E, z, x, D) {
            if (B === "api") {
                t(B, E)
            }
            n.configureAppLoader(B, z.displayType === "mobile");
            b = true;
            var A = h(z, "bvpage", true),
                C = h(z, "bvauthenticateuser", true);
            n.extend(z, {
                displayCode: h(z, "bvdisplaycode", true),
                contentType: h(z, "bvcontenttype", true),
                productId: h(z, "bvproductid"),
                categoryId: h(z, "bvcategoryid")
            });
            if (z.canSetPageTitle == null) {
                z.canSetPageTitle = true
            }
            var y = function(F) {
                i.location = F
            };
            u.login(C === "true" && !z.userToken, null, null, function(F) {
                if (x) {
                    x()
                }
                u.embedFrame(c(A, false, F), F, D)
            }, i.location.href, z, y)
        },
        configureSubmitFrame: function(x, y) {
            l[x] = y
        },
        embedFrame: function(z, y, B) {
            var A = y.displayType === "mobile" ? (z.indexOf("mobileembedded") > 0 ? "mobileembedded" : "embedded") : "embedded",
                x;
            if (y.useRPCInjectedSubmission) {
                x = y.displayType === "mobile" ? "mobileembeddedrpc" : "embeddedrpc"
            } else {
                x = y.displayType === "mobile" ? "mobileembeddedframe" : "embeddedframe"
            }
            z = q(z, "format", A, x);
            if (y.useRPCInjectedSubmission) {
                n.require(["submitInjection"], function(C) {
                    C.embed(z, y, B)
                })
            } else {
                n.require(["submitFrame"], function(C) {
                    C.embed(z, y, B)
                })
            }
            u.prefetchDependencies(y, true);
            u.loadSubmitContainerCss(y)
        },
        login: function(D, y, C, x, B, A, z) {
            if (!D) {
                x(A)
            } else {
                if (y) {
                    n.require(["hostedAuthentication"], function(E) {
                        E.openHostedAuthenticationSubmissionFrame(y, A, function(G, F) {
                            if (G) {
                                x(n.extend({}, A, {
                                    userToken: G,
                                    authType: F
                                }))
                            } else {
                                throw "Bazaarvoice: Hosted authentication didn't pass a userToken"
                            }
                        })
                    })
                } else {
                    if (A.doLogin) {
                        A.doLogin(function(F, E) {
                            if (!F) {
                                throw "Bazaarvoice: Empty authentication credentials"
                            }
                            x(n.extend({}, A, E, {
                                userToken: F
                            }))
                        }, q(B, "bvauthenticateuser", "true", "false"), A)
                    } else {
                        if (C) {
                            z(C)
                        } else {
                            throw "Bazaarvoice: User is not authenticated and configuration setting is missing: doLogin"
                        }
                    }
                }
            }
        },
        loadSubmitContainerCss: function(y) {
            var x = y.displayCode,
                z;
            if (y.useRPCInjectedSubmission) {
                z = y.displayType === "mobile" ? l[y.scope].mobileSubmissionCssUrl : l[y.scope].submissionCssUrl
            } else {
                z = y.displayType === "mobile" ? l[y.scope].mobileCssUrl : l[y.scope].cssUrl
            }
            if (typeof y.submitContainerDisplayCode !== "undefined") {
                if (/0000.*/.test(y.submitContainerDisplayCode)) {
                    x = y.submitContainerDisplayCode + "." + y.version
                }
            }
            u.loadCss(z, n.extend({}, y, {
                displayCode: x
            }))
        },
        loadSubmissionCss: function(z, x) {
            var y = x.displayType === "mobile" ? l[z].mobileSubmissionCssUrl : l[z].submissionCssUrl;
            u.loadCss(y, x)
        },
        loadCss: function(G, z, C) {
            var A, D, B = z.urlBase + u.expandPattern(G, true, z),
                F = r.getElementsByTagName("link");
            for (A = 0; A < F.length; A++) {
                D = F[A];
                if (D.rel == "stylesheet" && D.href && D.href === B) {
                    if (C) {
                        C()
                    }
                    return D
                }
            }
            D = r.createElement("link");
            D.rel = "stylesheet";
            D.type = "text/css";
            D.href = B;
            if (C) {
                D.onload = C;
                if (!i.opera && i.navigator.appName != "Microsoft Internet Explorer") {
                    var y = "bvCss" + (z.displayCode || "dc"),
                        x = 0,
                        E = function() {
                            var H = r.getElementById(y);
                            if (H && H.sheet) {
                                C()
                            } else {
                                if (x++ < 10) {
                                    i.setTimeout(E, 50)
                                }
                            }
                        };
                    D.id = y;
                    i.setTimeout(E, 50)
                }
            }
            r.getElementsByTagName("head")[0].appendChild(D);
            return D
        },
        prefetchDependencies: function(x, y) {
            n.require((x.displayType === "mobile" ? x.prefetchMobileDependencies : x.prefetchDependencies) || []);
            if (y) {
                n.require((x.displayType === "mobile" ? x.prefetchSubmitMobileDependencies : x.prefetchSubmitDependencies) || [])
            }
        },
        getUrl: function(B, z, y) {
            var x = u.expandPattern(B.url, true, z),
                A = u.getUrlQuery(B, z);
            return (y && z.standaloneUrlBase || z.urlBase) + x + (A.length ? (/\?/.test(x) ? "&" : "?") + A : "")
        },
        getUrlQuery: function(A, y) {
            var z = [];

            function x(C, D, B) {
                if (D != null) {
                    if (!w(D)) {
                        if (B) {
                            return
                        } else {
                            v(C, D)
                        }
                    }
                    z.push(a(C) + "=" + a(D))
                }
            }
            if (A.params) {
                n.each(A.params.split(","), function(C, B) {
                    var D = B.split(":");
                    x(D[1] || D[0], y[D[0]], true)
                })
            }
            if (A.paramAdapters) {
                n.each(A.paramAdapters, function(C, B) {
                    B(y, x)
                })
            }
            z.sort();
            if (A.query) {
                z.push(A.query)
            }
            return z.join("&")
        },
        expandPattern: function(z, y, x) {
            return z.replace(/\{([^}]+)}/g, function(A, B) {
                if (x[B] == null) {
                    s(B)
                }
                return y ? a(x[B]) : x[B]
            })
        },
        paramRegexAdapter: function(x) {
            return function(z, y) {
                n.each(z, function(A, B) {
                    if (x.test(A)) {
                        y(A, B)
                    }
                })
            }
        },
        paramSetAdapter: function(x, z, y) {
            return function(B, A) {
                e(z, B[x], y, A)
            }
        },
        paramMultiMapAdapter: function(x, z, y) {
            return function(B, A) {
                p(z, B[x], y, A)
            }
        }
    });
    u.register("global", "submission_container", u.submissionContainerHandler)
});
$BV.Internal.define("uiMethodsRR", [window, $BV.Internal], ["apiCore"], function(i, j, q) {
    q.registerScope("rr");
    var b = q.register,
        h = q.newLinkHandler,
        s = q.newAjaxHandler,
        p = q.newDispatchHandler,
        d = "/{displayCode}",
        m = "?format=embedded",
        f = "?format=embeddedhtml",
        r = "?format=bulkembeddedhtml",
        e = "?format=mobileembedded",
        k = "?format=mobileembeddedhtml",
        g = "?format=mobilestandalone";

    function c(t) {
        return s(j.extend({
            cssUrl: "/static/{displayCode}/bazaarvoiceMobile.css",
            crossDomainUrl: d + "/crossdomain.htm" + e
        }, t))
    }

    function a(t) {
        return s(j.extend({
            cssUrl: "/static/{displayCode}/bazaarvoice.css",
            crossDomainUrl: d + "/crossdomain.htm" + m
        }, t))
    }

    function n(t) {
        return s(j.extend({
            params: q.submissionParams,
            paramAdapters: q.submissionParamAdapters
        }, t))
    }
    q.configureSubmitFrame("rr", {
        cssUrl: "/static/{displayCode}/bvSubmitContainer.css",
        mobileCssUrl: "/static/{displayCode}/bvMobileSubmitContainer.css",
        submissionCssUrl: "/static/{displayCode}/bazaarvoiceSubmitRR.css",
        mobileSubmissionCssUrl: "/static/{displayCode}/bazaarvoiceMobileSubmitRR.css"
    });
    var l = "expandContextDataDimensionFilter,expandBadgeGroupFilter,expandTagDimensionFilter,expandOverallRatingFilter,expandRatingDimensionFilter,expandContentSourceFilter",
        o = [q.paramMultiMapAdapter("contextDataValues", "contextdatavalue"), q.paramMultiMapAdapter("badges", "badge"), q.paramMultiMapAdapter("tags", "tag"), q.paramSetAdapter("rating", "rating", true), q.paramMultiMapAdapter("ratings", "rating", true), q.paramSetAdapter("contentSource", "contentsource"), q.paramMultiMapAdapter("productAttributes", "productattribute"), q.referralAdapter ? q.referralAdapter() : q.paramSetAdapter("keywords", "keywords", true)];
    b("rr", "show_summary", p("displayType", "", {
        "": a({
            url: d + "/{productId}/ratings.djs" + f,
            paramAdapters: [q.paramMultiMapAdapter("productAttributes", "productattribute")]
        }),
        mobile: c({
            url: d + "/{productId}/ratings.djs" + k,
            paramAdapters: [q.paramMultiMapAdapter("productAttributes", "productattribute")]
        })
    }));
    b("rr", "show_reviews", p("displayType", "", {
        "": a({
            url: d + "/{productId}/reviews.djs" + f,
            params: "reviewId,page,num,sort,dir,sourceName,scrollToTop,suppressScroll," + l + ",commentId,showComments,hideComments,commentPage,commentNum,ugcPageContainerUrl",
            paramAdapters: o
        }),
        bulk: a({
            url: d + "/{productId}/reviews.djs" + r,
            params: "reviewId,page,num,sort,dir,sourceName,scrollToTop,suppressScroll," + l + ",commentId,showComments,hideComments,commentPage,commentNum,ugcPageContainerUrl",
            paramAdapters: o
        }),
        mobile: c({
            url: d + "/{productId}/reviews.djs" + k,
            params: "reviewId,page,num,sort,dir,sourceName,scrollToTop,suppressScroll," + l + ",commentId,showComments,hideComments,commentPage,commentNum",
            paramAdapters: o
        })
    }));
    b("rr", "show_widgets", a({
        url: d + "/{productId}/widgets.djs" + f,
        paramAdapters: [q.paramMultiMapAdapter("productAttributes", "productattribute")]
    }));
    b("rr", "show_memory", a({
        url: d + "/homepage.djs" + f + "&s=memory",
        params: "productId"
    }));
    b("rr", "show_product_list", a({
        url: d + "/homepage.djs" + f + "&s=productlist",
        params: "categoryId,productId"
    }));
    b("rr", "submit_review", p("displayType", "", {
        "": p("chooseProduct", false, {
            "true": n({
                url: d + "/writereview.djs" + f
            }),
            "false": n({
                url: d + "/{productId}/writereview.djs" + f
            })
        }),
        mobile: p("chooseProduct", false, {
            "true": n({
                url: d + "/writereview.djs" + k
            }),
            "false": n({
                url: d + "/{productId}/writereview.djs" + k
            })
        })
    }));
    b("rr", "submit_comment", n({
        url: d + "/{productId}/review/{reviewId}/writecomment.djs" + f
    }));
    b("rr", "goto_home", p("displayType", "", {
        "": p("subjectType", "all", {
            all: h({
                url: d + "/allreviews.htm"
            }),
            category: h({
                url: d + "/{categoryId}/category.htm"
            })
        }),
        mobile: p("subjectType", "all", {
            all: h({
                url: d + "/allreviews.htm" + g
            }),
            category: h({
                url: d + "/{categoryId}/category.htm" + g
            })
        })
    }));
    b("rr", "goto_reviews", p("displayType", "", {
        "": h({
            url: d + "/{productId}/reviews.htm",
            params: "page,num,sort,dir"
        }),
        mobile: h({
            url: d + "/{productId}/reviews.htm" + g,
            params: "page,num,sort,dir"
        })
    }));
    b("rr", "goto_syndicated_reviews", h({
        url: d + "/{productId}/syndicatedreviews.htm",
        params: "page,num,sort,dir"
    }));
    b("rr", "goto_reviews_showcase", h({
        url: d + "/{productId}/reviews.htm?format=brandvoice",
        params: "page,num,sort,dir"
    }))
});
$BV.Internal.define("uiMethodsCP", [window, $BV.Internal], ["apiCore"], function(f, c, b) {
    b.registerScope("cp");
    var l = b.register,
        d = b.newLinkHandler,
        m = b.newAjaxHandler,
        h = b.newDispatchHandler,
        g = "/profiles/{displayCode}",
        i = "?format=embedded",
        n = "?format=embeddedhtml",
        k = "?format=mobilestandalone";

    function j(o) {
        return m(c.extend({
            cssUrl: g + "/static/bazaarvoiceCP.css",
            crossDomainUrl: g + "/crossdomain.htm" + i
        }, o))
    }

    function a(o) {
        return m(c.extend({
            params: b.submissionParams,
            paramAdapters: b.submissionParamAdapters
        }, o))
    }
    b.configureSubmitFrame("cp", {
        cssUrl: g + "/static/bvSubmitContainer.css",
        mobileCssUrl: g + "/static/bvMobileSubmitContainer.css",
        submissionCssUrl: g + "/static/bazaarvoiceSubmitCP.css",
        mobileSubmissionCssUrl: g + "/static/bazaarvoiceMobileSubmitCP.css"
    });
    var e = [b.paramMultiMapAdapter("productAttributes", "productattribute")];
    l("cp", "show_profile", j({
        url: g + "/{profileId}/profile.djs" + n,
        paramAdapters: e
    }));
    l("cp", "submit_profile", a({
        url: g + "/editprofile.djs" + n
    }));
    l("cp", "goto_profile", h("displayType", "", {
        "": d({
            url: g + "/{profileId}/profile.htm"
        }),
        mobile: d({
            url: g + "/{profileId}/profile.htm" + k
        })
    }))
});
(function(e, a, b) {
    var d, c;
    b.extend($BV, {
        SI: {
            trackProductPageView: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    g.trackProductPageView(f)
                })
            },
            trackGenericPageView: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    g.trackGenericPageView(f)
                })
            },
            trackTransactionPageView: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    g.trackTransactionPageView(f)
                })
            },
            trackConversion: function(g, f, h) {
                b.require(["socialInsightsWorkbench"], function(i) {
                    i.trackConversion(g, f, h)
                })
            },
            disable: function() {
                b.require(["socialInsightsWorkbench"], function(f) {
                    f.disable()
                })
            },
            enable: function() {
                b.require(["socialInsightsWorkbench"], function(f) {
                    f.enable()
                })
            },
            setDebugEnabled: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    g.setDebugEnabled(f)
                })
            }
        },
        DSI: {
            trackBVPageView: function() {
                b.require(["socialInsightsWorkbench"], function(f) {
                    $bv(e).load(function() {
                        if (typeof d !== "undefined") {
                            f.trackProductPageView(d)
                        } else {
                            if (typeof c !== "undefined") {
                                f.trackTransactionPageView(c)
                            } else {
                                f.trackGenericPageView()
                            }
                        }
                    })
                })
            },
            trackProduct: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    d = f
                })
            },
            trackTransaction: function(f) {
                b.require(["socialInsightsWorkbench"], function(g) {
                    c = f
                })
            }
        }
    })
})(window, document, $BV.Internal);
$BV.configure({
    "global": {
        "version": "5.6",
        "displayCode": "8149-en_us",
        "clientName": "Boost",
        "urlBase": "//boost.ugc.bazaarvoice.com",
        "urlPathPrefix": "",
        "allowedDomains": [".boost.ugc.bazaarvoice.com", ".boostmobile.com", ".display-c6.bazaarvoice.com"],
        "siwCrossDomainUrl": "//boost.si.bazaarvoice.com/content/8149-en_us/socialInsightsWorkbench.htm",
        "submissionUI": "STANDALONE",
        "submissionLightboxCloseLinkAlt": "Close",
        "submissionLightboxCloseLinkText": "Close"
    },
    "rr": {
        "prefetchDependencies": ["jquery.core", "cmn/8149b-en_us/display.pkg", "rr/8149b-en_us/display.pkg"],
        "prefetchMobileDependencies": ["jquery.core", "cmn/8149b-en_us/display.pkg", "rr/8149b-en_us/mobiledisplay.pkg"],
        "prefetchSubmitDependencies": ["rr/8149b-en_us/submit.pkg"],
        "prefetchSubmitMobileDependencies": ["rr/8149b-en_us/mobilesubmit.pkg"],
        "standaloneUrlBase": "//reviews.boostmobile.com",
        "useRPCInjectedSubmission": true
    },
    "cp": {
        "prefetchDependencies": ["jquery.core", "cmn/8149b-en_us/display.pkg", "cp/8149b-en_us/display.pkg"],
        "prefetchMobileDependencies": ["jquery.core", "cmn/8149b-en_us/display.pkg", "cp/8149b-en_us/mobiledisplay.pkg"],
        "prefetchSubmitDependencies": ["cp/8149b-en_us/submit.pkg"],
        "standaloneUrlBase": "//reviews.boostmobile.com",
        "useRPCInjectedSubmission": true
    }
});