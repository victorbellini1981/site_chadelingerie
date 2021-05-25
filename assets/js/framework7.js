/**
 * Framework7 3.5.2
 * Full featured mobile HTML framework for building iOS & Android apps
 * http://framework7.io/
 *
 * Copyright 2014-2018 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: November 12, 2018
 */
! function(e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Framework7 = t() }(this, function() {
    "use strict";
    var t7ctx;
    t7ctx = "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0;
    var Template7Context = t7ctx,
        Template7Utils = {
            quoteSingleRexExp: new RegExp("'", "g"),
            quoteDoubleRexExp: new RegExp('"', "g"),
            isFunction: function(e) { return "function" == typeof e },
            escape: function(e) { return void 0 !== Template7Context && Template7Context.escape ? Template7Context.escape(e) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") },
            helperToSlices: function(e) {
                var t, a, n, r = Template7Utils.quoteDoubleRexExp,
                    i = Template7Utils.quoteSingleRexExp,
                    o = e.replace(/[{}#}]/g, "").trim().split(" "),
                    s = [];
                for (a = 0; a < o.length; a += 1) {
                    var l = o[a],
                        p = void 0,
                        c = void 0;
                    if (0 === a) s.push(l);
                    else if (0 === l.indexOf('"') || 0 === l.indexOf("'"))
                        if (p = 0 === l.indexOf('"') ? r : i, c = 0 === l.indexOf('"') ? '"' : "'", 2 === l.match(p).length) s.push(l);
                        else {
                            for (t = 0, n = a + 1; n < o.length; n += 1)
                                if (l += " " + o[n], 0 <= o[n].indexOf(c)) { t = n, s.push(l); break }
                            t && (a = t)
                        }
                    else if (0 < l.indexOf("=")) {
                        var d = l.split("="),
                            u = d[0],
                            h = d[1];
                        if (p || (p = 0 === h.indexOf('"') ? r : i, c = 0 === h.indexOf('"') ? '"' : "'"), 2 !== h.match(p).length) {
                            for (t = 0, n = a + 1; n < o.length; n += 1)
                                if (h += " " + o[n], 0 <= o[n].indexOf(c)) { t = n; break }
                            t && (a = t)
                        }
                        var f = [u, h.replace(p, "")];
                        s.push(f)
                    } else s.push(l)
                }
                return s
            },
            stringToBlocks: function(e) {
                var t, a, n = [];
                if (!e) return [];
                var r = e.split(/({{[^{^}]*}})/);
                for (t = 0; t < r.length; t += 1) {
                    var i = r[t];
                    if ("" !== i)
                        if (i.indexOf("{{") < 0) n.push({ type: "plain", content: i });
                        else {
                            if (0 <= i.indexOf("{/")) continue;
                            if ((i = i.replace(/{{([#/])*([ ])*/, "{{$1").replace(/([ ])*}}/, "}}")).indexOf("{#") < 0 && i.indexOf(" ") < 0 && i.indexOf("else") < 0) { n.push({ type: "variable", contextName: i.replace(/[{}]/g, "") }); continue }
                            var o = Template7Utils.helperToSlices(i),
                                s = o[0],
                                l = ">" === s,
                                p = [],
                                c = {};
                            for (a = 1; a < o.length; a += 1) {
                                var d = o[a];
                                Array.isArray(d) ? c[d[0]] = "false" !== d[1] && d[1] : p.push(d)
                            }
                            if (0 <= i.indexOf("{#")) {
                                var u = "",
                                    h = "",
                                    f = 0,
                                    m = void 0,
                                    v = !1,
                                    g = !1,
                                    b = 0;
                                for (a = t + 1; a < r.length; a += 1)
                                    if (0 <= r[a].indexOf("{{#") && (b += 1), 0 <= r[a].indexOf("{{/") && (b -= 1), 0 <= r[a].indexOf("{{#" + s)) u += r[a], g && (h += r[a]), f += 1;
                                    else if (0 <= r[a].indexOf("{{/" + s)) {
                                    if (!(0 < f)) { m = a, v = !0; break }
                                    f -= 1, u += r[a], g && (h += r[a])
                                } else 0 <= r[a].indexOf("else") && 0 === b ? g = !0 : (g || (u += r[a]), g && (h += r[a]));
                                v && (m && (t = m), "raw" === s ? n.push({ type: "plain", content: u }) : n.push({ type: "helper", helperName: s, contextName: p, content: u, inverseContent: h, hash: c }))
                            } else 0 < i.indexOf(" ") && (l && (s = "_partial", p[0] && (0 === p[0].indexOf("[") ? p[0] = p[0].replace(/[[\]]/g, "") : p[0] = '"' + p[0].replace(/"|'/g, "") + '"')), n.push({ type: "helper", helperName: s, contextName: p, hash: c }))
                        }
                }
                return n
            },
            parseJsVariable: function(e, a, n) { return e.split(/([+ \-*/^])/g).map(function(e) { if (e.indexOf(a) < 0) return e; if (!n) return JSON.stringify(""); var t = n; return 0 <= e.indexOf(a + ".") && e.split(a + ".")[1].split(".").forEach(function(e) { t = e in t ? t[e] : void 0 }), "string" == typeof t && (t = JSON.stringify(t)), void 0 === t && (t = "undefined"), t }).join("") },
            parseJsParents: function(e, n) {
                return e.split(/([+ \-*^])/g).map(function(e) {
                    if (e.indexOf("../") < 0) return e;
                    if (!n || 0 === n.length) return JSON.stringify("");
                    var t = e.split("../").length - 1,
                        a = t > n.length ? n[n.length - 1] : n[t - 1];
                    return e.replace(/..\//g, "").split(".").forEach(function(e) { a = a[e] ? a[e] : "undefined" }), JSON.stringify(a)
                }).join("")
            },
            getCompileVar: function(e, t, a) {
                void 0 === a && (a = "data_1");
                var n, r, i = t,
                    o = 0;
                n = 0 === e.indexOf("../") ? (o = e.split("../").length - 1, i = "ctx_" + (1 <= (r = i.split("_")[1] - o) ? r : 1), e.split("../")[o].split(".")) : 0 === e.indexOf("@global") ? (i = "Template7.global", e.split("@global.")[1].split(".")) : 0 === e.indexOf("@root") ? (i = "root", e.split("@root.")[1].split(".")) : e.split(".");
                for (var s = 0; s < n.length; s += 1) {
                    var l = n[s];
                    if (0 === l.indexOf("@")) {
                        var p = a.split("_")[1];
                        0 < o && (p = r), 0 < s ? i += "[(data_" + p + " && data_" + p + "." + l.replace("@", "") + ")]" : i = "(data_" + p + " && data_" + p + "." + l.replace("@", "") + ")"
                    } else(Number.isFinite ? Number.isFinite(l) : Template7Context.isFinite(l)) ? i += "[" + l + "]" : "this" === l || 0 <= l.indexOf("this.") || 0 <= l.indexOf("this[") || 0 <= l.indexOf("this(") ? i = l.replace("this", t) : i += "." + l
                }
                return i
            },
            getCompiledArguments: function(e, t, a) { for (var n = [], r = 0; r < e.length; r += 1) /^['"]/.test(e[r]) ? n.push(e[r]) : /^(true|false|\d+)$/.test(e[r]) ? n.push(e[r]) : n.push(Template7Utils.getCompileVar(e[r], t, a)); return n.join(", ") }
        },
        Template7Helpers = {
            _partial: function(e, t) {
                var a = this,
                    n = Template7Class.partials[e];
                return !n || n && !n.template ? "" : (n.compiled || (n.compiled = new Template7Class(n.template).compile()), Object.keys(t.hash).forEach(function(e) { a[e] = t.hash[e] }), n.compiled(a, t.data, t.root))
            },
            escape: function(e) { if ("string" != typeof e) throw new Error('Template7: Passed context to "escape" helper should be a string'); return Template7Utils.escape(e) },
            if: function(e, t) { var a = e; return Template7Utils.isFunction(a) && (a = a.call(this)), a ? t.fn(this, t.data) : t.inverse(this, t.data) },
            unless: function(e, t) { var a = e; return Template7Utils.isFunction(a) && (a = a.call(this)), a ? t.inverse(this, t.data) : t.fn(this, t.data) },
            each: function(e, t) {
                var a = e,
                    n = "",
                    r = 0;
                if (Template7Utils.isFunction(a) && (a = a.call(this)), Array.isArray(a)) {
                    for (t.hash.reverse && (a = a.reverse()), r = 0; r < a.length; r += 1) n += t.fn(a[r], { first: 0 === r, last: r === a.length - 1, index: r });
                    t.hash.reverse && (a = a.reverse())
                } else
                    for (var i in a) r += 1, n += t.fn(a[i], { key: i });
                return 0 < r ? n : t.inverse(this)
            },
            with: function(e, t) { var a = e; return Template7Utils.isFunction(a) && (a = e.call(this)), t.fn(a) },
            join: function(e, t) { var a = e; return Template7Utils.isFunction(a) && (a = a.call(this)), a.join(t.hash.delimiter || t.hash.delimeter) },
            js: function js(expression, options) {
                var data = options.data,
                    func, execute = expression;
                return "index first last key".split(" ").forEach(function(e) {
                    if (void 0 !== data[e]) {
                        var t = new RegExp("this.@" + e, "g"),
                            a = new RegExp("@" + e, "g");
                        execute = execute.replace(t, JSON.stringify(data[e])).replace(a, JSON.stringify(data[e]))
                    }
                }), options.root && 0 <= execute.indexOf("@root") && (execute = Template7Utils.parseJsVariable(execute, "@root", options.root)), 0 <= execute.indexOf("@global") && (execute = Template7Utils.parseJsVariable(execute, "@global", Template7Context.Template7.global)), 0 <= execute.indexOf("../") && (execute = Template7Utils.parseJsParents(execute, options.parents)), func = 0 <= execute.indexOf("return") ? "(function(){" + execute + "})" : "(function(){return (" + execute + ")})", eval(func).call(this)
            },
            js_if: function js_if(expression, options) {
                var data = options.data,
                    func, execute = expression;
                "index first last key".split(" ").forEach(function(e) {
                    if (void 0 !== data[e]) {
                        var t = new RegExp("this.@" + e, "g"),
                            a = new RegExp("@" + e, "g");
                        execute = execute.replace(t, JSON.stringify(data[e])).replace(a, JSON.stringify(data[e]))
                    }
                }), options.root && 0 <= execute.indexOf("@root") && (execute = Template7Utils.parseJsVariable(execute, "@root", options.root)), 0 <= execute.indexOf("@global") && (execute = Template7Utils.parseJsVariable(execute, "@global", Template7Context.Template7.global)), 0 <= execute.indexOf("../") && (execute = Template7Utils.parseJsParents(execute, options.parents)), func = 0 <= execute.indexOf("return") ? "(function(){" + execute + "})" : "(function(){return (" + execute + ")})";
                var condition = eval(func).call(this);
                return condition ? options.fn(this, options.data) : options.inverse(this, options.data)
            }
        };
    Template7Helpers.js_compare = Template7Helpers.js_if;
    var Template7Options = {},
        Template7Partials = {},
        Template7Class = function(e) { this.template = e },
        staticAccessors = { options: { configurable: !0 }, partials: { configurable: !0 }, helpers: { configurable: !0 } };

    function Template7() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var a = e[0],
            n = e[1];
        if (2 !== e.length) return new Template7Class(a);
        var r = new Template7Class(a),
            i = r.compile()(n);
        return r = null, i
    }
    Template7Class.prototype.compile = function compile(template, depth) {
        void 0 === template && (template = this.template), void 0 === depth && (depth = 1);
        var t = this;
        if (t.compiled) return t.compiled;
        if ("string" != typeof template) throw new Error("Template7: Template must be a string");
        var stringToBlocks = Template7Utils.stringToBlocks,
            getCompileVar = Template7Utils.getCompileVar,
            getCompiledArguments = Template7Utils.getCompiledArguments,
            blocks = stringToBlocks(template),
            ctx = "ctx_" + depth,
            data = "data_" + depth;
        if (0 === blocks.length) return function() { return "" };

        function getCompileFn(e, a) { return e.content ? t.compile(e.content, a) : function() { return "" } }

        function getCompileInverse(e, a) { return e.inverseContent ? t.compile(e.inverseContent, a) : function() { return "" } }
        var resultString = "",
            i;
        for (resultString += 1 === depth ? "(function (" + ctx + ", " + data + ", root) {\n" : "(function (" + ctx + ", " + data + ") {\n", 1 === depth && (resultString += "function isArray(arr){return Array.isArray(arr);}\n", resultString += "function isFunction(func){return (typeof func === 'function');}\n", resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n', resultString += "root = root || ctx_1 || {};\n"), resultString += "var r = '';\n", i = 0; i < blocks.length; i += 1) {
            var block = blocks[i];
            if ("plain" !== block.type) {
                var variable = void 0,
                    compiledArguments = void 0;
                if ("variable" === block.type && (variable = getCompileVar(block.contextName, ctx, data), resultString += "r += c(" + variable + ", " + ctx + ");"), "helper" === block.type) {
                    var parents = void 0;
                    if ("ctx_1" !== ctx) {
                        for (var level = ctx.split("_")[1], parentsString = "ctx_" + (level - 1), j = level - 2; 1 <= j; j -= 1) parentsString += ", ctx_" + j;
                        parents = "[" + parentsString + "]"
                    } else parents = "[" + ctx + "]";
                    var dynamicHelper = void 0;
                    if (0 === block.helperName.indexOf("[") && (block.helperName = getCompileVar(block.helperName.replace(/[[\]]/g, ""), ctx, data), dynamicHelper = !0), dynamicHelper || block.helperName in Template7Helpers) compiledArguments = getCompiledArguments(block.contextName, ctx, data), resultString += "r += (Template7Helpers" + (dynamicHelper ? "[" + block.helperName + "]" : "." + block.helperName) + ").call(" + ctx + ", " + (compiledArguments && compiledArguments + ", ") + "{hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});";
                    else {
                        if (0 < block.contextName.length) throw new Error('Template7: Missing helper: "' + block.helperName + '"');
                        variable = getCompileVar(block.helperName, ctx, data), resultString += "if (" + variable + ") {", resultString += "if (isArray(" + variable + ")) {", resultString += "r += (Template7Helpers.each).call(" + ctx + ", " + variable + ", {hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});", resultString += "}else {", resultString += "r += (Template7Helpers.with).call(" + ctx + ", " + variable + ", {hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});", resultString += "}}"
                    }
                }
            } else resultString += "r +='" + block.content.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/'/g, "\\'") + "';"
        }
        return resultString += "\nreturn r;})", 1 === depth ? (t.compiled = eval(resultString), t.compiled) : resultString
    }, staticAccessors.options.get = function() { return Template7Options }, staticAccessors.partials.get = function() { return Template7Partials }, staticAccessors.helpers.get = function() { return Template7Helpers }, Object.defineProperties(Template7Class, staticAccessors), Template7.registerHelper = function(e, t) { Template7Class.helpers[e] = t }, Template7.unregisterHelper = function(e) { Template7Class.helpers[e] = void 0, delete Template7Class.helpers[e] }, Template7.registerPartial = function(e, t) { Template7Class.partials[e] = { template: t } }, Template7.unregisterPartial = function(e) { Template7Class.partials[e] && (Template7Class.partials[e] = void 0, delete Template7Class.partials[e]) }, Template7.compile = function(e, t) { return new Template7Class(e, t).compile() }, Template7.options = Template7Class.options, Template7.helpers = Template7Class.helpers, Template7.partials = Template7Class.partials;
    var doc = "undefined" == typeof document ? { body: {}, addEventListener: function() {}, removeEventListener: function() {}, activeElement: { blur: function() {}, nodeName: "" }, querySelector: function() { return null }, querySelectorAll: function() { return [] }, getElementById: function() { return null }, createEvent: function() { return { initEvent: function() {} } }, createElement: function() { return { children: [], childNodes: [], style: {}, setAttribute: function() {}, getElementsByTagName: function() { return [] } } }, location: { hash: "" } } : document,
        win = "undefined" == typeof window ? { document: doc, navigator: { userAgent: "" }, location: {}, history: {}, CustomEvent: function() { return this }, addEventListener: function() {}, removeEventListener: function() {}, getComputedStyle: function() { return { getPropertyValue: function() { return "" } } }, Image: function() {}, Date: function() {}, screen: {}, setTimeout: function() {}, clearTimeout: function() {} } : window,
        Dom7 = function(e) { for (var t = 0; t < e.length; t += 1) this[t] = e[t]; return this.length = e.length, this };

    function $(e, t) {
        var a = [],
            n = 0;
        if (e && !t && e instanceof Dom7) return e;
        if (e)
            if ("string" == typeof e) {
                var r, i, o = e.trim();
                if (0 <= o.indexOf("<") && 0 <= o.indexOf(">")) { var s = "div"; for (0 === o.indexOf("<li") && (s = "ul"), 0 === o.indexOf("<tr") && (s = "tbody"), 0 !== o.indexOf("<td") && 0 !== o.indexOf("<th") || (s = "tr"), 0 === o.indexOf("<tbody") && (s = "table"), 0 === o.indexOf("<option") && (s = "select"), (i = doc.createElement(s)).innerHTML = o, n = 0; n < i.childNodes.length; n += 1) a.push(i.childNodes[n]) } else
                    for (r = t || "#" !== e[0] || e.match(/[ .<>:~]/) ? (t || doc).querySelectorAll(e.trim()) : [doc.getElementById(e.trim().split("#")[1])], n = 0; n < r.length; n += 1) r[n] && a.push(r[n])
            } else if (e.nodeType || e === win || e === doc) a.push(e);
        else if (0 < e.length && e[0].nodeType)
            for (n = 0; n < e.length; n += 1) a.push(e[n]);
        return new Dom7(a)
    }

    function unique(e) { for (var t = [], a = 0; a < e.length; a += 1) - 1 === t.indexOf(e[a]) && t.push(e[a]); return t }

    function toCamelCase(e) { return e.toLowerCase().replace(/-(.)/g, function(e, t) { return t.toUpperCase() }) }

    function requestAnimationFrame(e) { return win.requestAnimationFrame ? win.requestAnimationFrame(e) : win.webkitRequestAnimationFrame ? win.webkitRequestAnimationFrame(e) : win.setTimeout(e, 1e3 / 60) }

    function cancelAnimationFrame(e) { return win.cancelAnimationFrame ? win.cancelAnimationFrame(e) : win.webkitCancelAnimationFrame ? win.webkitCancelAnimationFrame(e) : win.clearTimeout(e) }

    function addClass(e) {
        if (void 0 === e) return this;
        for (var t = e.split(" "), a = 0; a < t.length; a += 1)
            for (var n = 0; n < this.length; n += 1) void 0 !== this[n] && void 0 !== this[n].classList && this[n].classList.add(t[a]);
        return this
    }

    function removeClass(e) {
        for (var t = e.split(" "), a = 0; a < t.length; a += 1)
            for (var n = 0; n < this.length; n += 1) void 0 !== this[n] && void 0 !== this[n].classList && this[n].classList.remove(t[a]);
        return this
    }

    function hasClass(e) { return !!this[0] && this[0].classList.contains(e) }

    function toggleClass(e) {
        for (var t = e.split(" "), a = 0; a < t.length; a += 1)
            for (var n = 0; n < this.length; n += 1) void 0 !== this[n] && void 0 !== this[n].classList && this[n].classList.toggle(t[a]);
        return this
    }

    function attr(e, t) {
        var a = arguments;
        if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
        for (var n = 0; n < this.length; n += 1)
            if (2 === a.length) this[n].setAttribute(e, t);
            else
                for (var r in e) this[n][r] = e[r], this[n].setAttribute(r, e[r]);
        return this
    }

    function removeAttr(e) { for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e); return this }

    function prop(e, t) {
        var a = arguments;
        if (1 !== arguments.length || "string" != typeof e) {
            for (var n = 0; n < this.length; n += 1)
                if (2 === a.length) this[n][e] = t;
                else
                    for (var r in e) this[n][r] = e[r];
            return this
        }
        if (this[0]) return this[0][e]
    }

    function data(e, t) { var a; if (void 0 !== t) { for (var n = 0; n < this.length; n += 1)(a = this[n]).dom7ElementDataStorage || (a.dom7ElementDataStorage = {}), a.dom7ElementDataStorage[e] = t; return this } if (a = this[0]) { if (a.dom7ElementDataStorage && e in a.dom7ElementDataStorage) return a.dom7ElementDataStorage[e]; var r = a.getAttribute("data-" + e); return r || void 0 } }

    function removeData(e) {
        for (var t = 0; t < this.length; t += 1) {
            var a = this[t];
            a.dom7ElementDataStorage && a.dom7ElementDataStorage[e] && (a.dom7ElementDataStorage[e] = null, delete a.dom7ElementDataStorage[e])
        }
    }

    function dataset() {
        var e = this[0];
        if (e) {
            var t = {};
            if (e.dataset)
                for (var a in e.dataset) t[a] = e.dataset[a];
            else
                for (var n = 0; n < e.attributes.length; n += 1) {
                    var r = e.attributes[n];
                    0 <= r.name.indexOf("data-") && (t[toCamelCase(r.name.split("data-")[1])] = r.value)
                }
            for (var i in t) "false" === t[i] ? t[i] = !1 : "true" === t[i] ? t[i] = !0 : parseFloat(t[i]) === 1 * t[i] && (t[i] *= 1);
            return t
        }
    }

    function val(e) {
        var t = this;
        if (void 0 !== e) {
            for (var a = 0; a < t.length; a += 1) {
                var n = t[a];
                if (Array.isArray(e) && n.multiple && "select" === n.nodeName.toLowerCase())
                    for (var r = 0; r < n.options.length; r += 1) n.options[r].selected = 0 <= e.indexOf(n.options[r].value);
                else n.value = e
            }
            return t
        }
        if (t[0]) { if (t[0].multiple && "select" === t[0].nodeName.toLowerCase()) { for (var i = [], o = 0; o < t[0].selectedOptions.length; o += 1) i.push(t[0].selectedOptions[o].value); return i } return t[0].value }
    }

    function transform(e) {
        for (var t = 0; t < this.length; t += 1) {
            var a = this[t].style;
            a.webkitTransform = e, a.transform = e
        }
        return this
    }

    function transition(e) {
        "string" != typeof e && (e += "ms");
        for (var t = 0; t < this.length; t += 1) {
            var a = this[t].style;
            a.webkitTransitionDuration = e, a.transitionDuration = e
        }
        return this
    }

    function on() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = t[0],
            i = t[1],
            o = t[2],
            r = t[3];

        function s(e) {
            var t = e.target;
            if (t) {
                var a = e.target.dom7EventData || [];
                if (a.indexOf(e) < 0 && a.unshift(e), $(t).is(i)) o.apply(t, a);
                else
                    for (var n = $(t).parents(), r = 0; r < n.length; r += 1) $(n[r]).is(i) && o.apply(n[r], a)
            }
        }

        function l(e) {
            var t = e && e.target && e.target.dom7EventData || [];
            t.indexOf(e) < 0 && t.unshift(e), o.apply(this, t)
        }
        "function" == typeof t[1] && (n = (e = t)[0], o = e[1], r = e[2], i = void 0), r || (r = !1);
        for (var p, c = n.split(" "), d = 0; d < this.length; d += 1) {
            var u = this[d];
            if (i)
                for (p = 0; p < c.length; p += 1) {
                    var h = c[p];
                    u.dom7LiveListeners || (u.dom7LiveListeners = {}), u.dom7LiveListeners[h] || (u.dom7LiveListeners[h] = []), u.dom7LiveListeners[h].push({ listener: o, proxyListener: s }), u.addEventListener(h, s, r)
                } else
                    for (p = 0; p < c.length; p += 1) {
                        var f = c[p];
                        u.dom7Listeners || (u.dom7Listeners = {}), u.dom7Listeners[f] || (u.dom7Listeners[f] = []), u.dom7Listeners[f].push({ listener: o, proxyListener: l }), u.addEventListener(f, l, r)
                    }
        }
        return this
    }

    function off() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = t[0],
            r = t[1],
            i = t[2],
            o = t[3];
        "function" == typeof t[1] && (n = (e = t)[0], i = e[1], o = e[2], r = void 0), o || (o = !1);
        for (var s = n.split(" "), l = 0; l < s.length; l += 1)
            for (var p = s[l], c = 0; c < this.length; c += 1) {
                var d = this[c],
                    u = void 0;
                if (!r && d.dom7Listeners ? u = d.dom7Listeners[p] : r && d.dom7LiveListeners && (u = d.dom7LiveListeners[p]), u && u.length)
                    for (var h = u.length - 1; 0 <= h; h -= 1) {
                        var f = u[h];
                        i && f.listener === i ? (d.removeEventListener(p, f.proxyListener, o), u.splice(h, 1)) : i || (d.removeEventListener(p, f.proxyListener, o), u.splice(h, 1))
                    }
            }
        return this
    }

    function once() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = this,
            r = t[0],
            i = t[1],
            o = t[2],
            s = t[3];
        return "function" == typeof t[1] && (r = (e = t)[0], o = e[1], s = e[2], i = void 0), n.on(r, i, function e() {
            for (var t = [], a = arguments.length; a--;) t[a] = arguments[a];
            o.apply(this, t), n.off(r, i, e, s)
        }, s)
    }

    function trigger() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        for (var a = e[0].split(" "), n = e[1], r = 0; r < a.length; r += 1)
            for (var i = a[r], o = 0; o < this.length; o += 1) {
                var s = this[o],
                    l = void 0;
                try { l = new win.CustomEvent(i, { detail: n, bubbles: !0, cancelable: !0 }) } catch (e) {
                    (l = doc.createEvent("Event")).initEvent(i, !0, !0), l.detail = n
                }
                s.dom7EventData = e.filter(function(e, t) { return 0 < t }), s.dispatchEvent(l), s.dom7EventData = [], delete s.dom7EventData
            }
        return this
    }

    function transitionEnd(t) {
        var a, n = ["webkitTransitionEnd", "transitionend"],
            r = this;

        function i(e) {
            if (e.target === this)
                for (t.call(this, e), a = 0; a < n.length; a += 1) r.off(n[a], i)
        }
        if (t)
            for (a = 0; a < n.length; a += 1) r.on(n[a], i);
        return this
    }

    function animationEnd(t) {
        var a, n = ["webkitAnimationEnd", "animationend"],
            r = this;

        function i(e) {
            if (e.target === this)
                for (t.call(this, e), a = 0; a < n.length; a += 1) r.off(n[a], i)
        }
        if (t)
            for (a = 0; a < n.length; a += 1) r.on(n[a], i);
        return this
    }

    function width() { return this[0] === win ? win.innerWidth : 0 < this.length ? parseFloat(this.css("width")) : null }

    function outerWidth(e) { if (0 < this.length) { if (e) { var t = this.styles(); return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue("margin-left")) } return this[0].offsetWidth } return null }

    function height() { return this[0] === win ? win.innerHeight : 0 < this.length ? parseFloat(this.css("height")) : null }

    function outerHeight(e) { if (0 < this.length) { if (e) { var t = this.styles(); return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue("margin-bottom")) } return this[0].offsetHeight } return null }

    function offset() {
        if (0 < this.length) {
            var e = this[0],
                t = e.getBoundingClientRect(),
                a = doc.body,
                n = e.clientTop || a.clientTop || 0,
                r = e.clientLeft || a.clientLeft || 0,
                i = e === win ? win.scrollY : e.scrollTop,
                o = e === win ? win.scrollX : e.scrollLeft;
            return { top: t.top + i - n, left: t.left + o - r }
        }
        return null
    }

    function hide() { for (var e = 0; e < this.length; e += 1) this[e].style.display = "none"; return this }

    function show() { for (var e = 0; e < this.length; e += 1) { var t = this[e]; "none" === t.style.display && (t.style.display = ""), "none" === win.getComputedStyle(t, null).getPropertyValue("display") && (t.style.display = "block") } return this }

    function styles() { return this[0] ? win.getComputedStyle(this[0], null) : {} }

    function css(e, t) {
        var a;
        if (1 === arguments.length) {
            if ("string" != typeof e) {
                for (a = 0; a < this.length; a += 1)
                    for (var n in e) this[a].style[n] = e[n];
                return this
            }
            if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(e)
        }
        if (2 !== arguments.length || "string" != typeof e) return this;
        for (a = 0; a < this.length; a += 1) this[a].style[e] = t;
        return this
    }

    function toArray() { for (var e = [], t = 0; t < this.length; t += 1) e.push(this[t]); return e }

    function each(e) {
        if (!e) return this;
        for (var t = 0; t < this.length; t += 1)
            if (!1 === e.call(this[t], t, this[t])) return this;
        return this
    }

    function forEach(e) {
        if (!e) return this;
        for (var t = 0; t < this.length; t += 1)
            if (!1 === e.call(this[t], this[t], t)) return this;
        return this
    }

    function filter(e) { for (var t = [], a = 0; a < this.length; a += 1) e.call(this[a], a, this[a]) && t.push(this[a]); return new Dom7(t) }

    function map(e) { for (var t = [], a = 0; a < this.length; a += 1) t.push(e.call(this[a], a, this[a])); return new Dom7(t) }

    function html(e) { if (void 0 === e) return this[0] ? this[0].innerHTML : void 0; for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e; return this }

    function text(e) { if (void 0 === e) return this[0] ? this[0].textContent.trim() : null; for (var t = 0; t < this.length; t += 1) this[t].textContent = e; return this }

    function is(e) {
        var t, a, n = this[0];
        if (!n || void 0 === e) return !1;
        if ("string" == typeof e) {
            if (n.matches) return n.matches(e);
            if (n.webkitMatchesSelector) return n.webkitMatchesSelector(e);
            if (n.msMatchesSelector) return n.msMatchesSelector(e);
            for (t = $(e), a = 0; a < t.length; a += 1)
                if (t[a] === n) return !0;
            return !1
        }
        if (e === doc) return n === doc;
        if (e === win) return n === win;
        if (e.nodeType || e instanceof Dom7) {
            for (t = e.nodeType ? [e] : e, a = 0; a < t.length; a += 1)
                if (t[a] === n) return !0;
            return !1
        }
        return !1
    }

    function indexOf(e) {
        for (var t = 0; t < this.length; t += 1)
            if (this[t] === e) return t;
        return -1
    }

    function index() { var e, t = this[0]; if (t) { for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1); return e } }

    function eq(e) { if (void 0 === e) return this; var t, a = this.length; return new Dom7(a - 1 < e ? [] : e < 0 ? (t = a + e) < 0 ? [] : [this[t]] : [this[e]]) }

    function append() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        for (var n = 0; n < t.length; n += 1) {
            e = t[n];
            for (var r = 0; r < this.length; r += 1)
                if ("string" == typeof e) { var i = doc.createElement("div"); for (i.innerHTML = e; i.firstChild;) this[r].appendChild(i.firstChild) } else if (e instanceof Dom7)
                for (var o = 0; o < e.length; o += 1) this[r].appendChild(e[o]);
            else this[r].appendChild(e)
        }
        return this
    }

    function appendTo(e) { return $(e).append(this), this }

    function prepend(e) {
        var t, a;
        for (t = 0; t < this.length; t += 1)
            if ("string" == typeof e) { var n = doc.createElement("div"); for (n.innerHTML = e, a = n.childNodes.length - 1; 0 <= a; a -= 1) this[t].insertBefore(n.childNodes[a], this[t].childNodes[0]) } else if (e instanceof Dom7)
            for (a = 0; a < e.length; a += 1) this[t].insertBefore(e[a], this[t].childNodes[0]);
        else this[t].insertBefore(e, this[t].childNodes[0]);
        return this
    }

    function prependTo(e) { return $(e).prepend(this), this }

    function insertBefore(e) {
        for (var t = $(e), a = 0; a < this.length; a += 1)
            if (1 === t.length) t[0].parentNode.insertBefore(this[a], t[0]);
            else if (1 < t.length)
            for (var n = 0; n < t.length; n += 1) t[n].parentNode.insertBefore(this[a].cloneNode(!0), t[n])
    }

    function insertAfter(e) {
        for (var t = $(e), a = 0; a < this.length; a += 1)
            if (1 === t.length) t[0].parentNode.insertBefore(this[a], t[0].nextSibling);
            else if (1 < t.length)
            for (var n = 0; n < t.length; n += 1) t[n].parentNode.insertBefore(this[a].cloneNode(!0), t[n].nextSibling)
    }

    function next(e) { return 0 < this.length ? e ? this[0].nextElementSibling && $(this[0].nextElementSibling).is(e) ? new Dom7([this[0].nextElementSibling]) : new Dom7([]) : this[0].nextElementSibling ? new Dom7([this[0].nextElementSibling]) : new Dom7([]) : new Dom7([]) }

    function nextAll(e) {
        var t = [],
            a = this[0];
        if (!a) return new Dom7([]);
        for (; a.nextElementSibling;) {
            var n = a.nextElementSibling;
            e ? $(n).is(e) && t.push(n) : t.push(n), a = n
        }
        return new Dom7(t)
    }

    function prev(e) { if (0 < this.length) { var t = this[0]; return e ? t.previousElementSibling && $(t.previousElementSibling).is(e) ? new Dom7([t.previousElementSibling]) : new Dom7([]) : t.previousElementSibling ? new Dom7([t.previousElementSibling]) : new Dom7([]) } return new Dom7([]) }

    function prevAll(e) {
        var t = [],
            a = this[0];
        if (!a) return new Dom7([]);
        for (; a.previousElementSibling;) {
            var n = a.previousElementSibling;
            e ? $(n).is(e) && t.push(n) : t.push(n), a = n
        }
        return new Dom7(t)
    }

    function siblings(e) { return this.nextAll(e).add(this.prevAll(e)) }

    function parent(e) { for (var t = [], a = 0; a < this.length; a += 1) null !== this[a].parentNode && (e ? $(this[a].parentNode).is(e) && t.push(this[a].parentNode) : t.push(this[a].parentNode)); return $(unique(t)) }

    function parents(e) {
        for (var t = [], a = 0; a < this.length; a += 1)
            for (var n = this[a].parentNode; n;) e ? $(n).is(e) && t.push(n) : t.push(n), n = n.parentNode;
        return $(unique(t))
    }

    function closest(e) { var t = this; return void 0 === e ? new Dom7([]) : (t.is(e) || (t = t.parents(e).eq(0)), t) }

    function find(e) {
        for (var t = [], a = 0; a < this.length; a += 1)
            for (var n = this[a].querySelectorAll(e), r = 0; r < n.length; r += 1) t.push(n[r]);
        return new Dom7(t)
    }

    function children(e) {
        for (var t = [], a = 0; a < this.length; a += 1)
            for (var n = this[a].childNodes, r = 0; r < n.length; r += 1) e ? 1 === n[r].nodeType && $(n[r]).is(e) && t.push(n[r]) : 1 === n[r].nodeType && t.push(n[r]);
        return new Dom7(unique(t))
    }

    function remove() { for (var e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]); return this }

    function detach() { return this.remove() }

    function add() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; var a, n; for (a = 0; a < e.length; a += 1) { var r = $(e[a]); for (n = 0; n < r.length; n += 1) this[this.length] = r[n], this.length += 1 } return this }

    function empty() {
        for (var e = 0; e < this.length; e += 1) {
            var t = this[e];
            if (1 === t.nodeType) {
                for (var a = 0; a < t.childNodes.length; a += 1) t.childNodes[a].parentNode && t.childNodes[a].parentNode.removeChild(t.childNodes[a]);
                t.textContent = ""
            }
        }
        return this
    }
    $.fn = Dom7.prototype, $.Class = Dom7, $.Dom7 = Dom7;
    var Methods = Object.freeze({ addClass: addClass, removeClass: removeClass, hasClass: hasClass, toggleClass: toggleClass, attr: attr, removeAttr: removeAttr, prop: prop, data: data, removeData: removeData, dataset: dataset, val: val, transform: transform, transition: transition, on: on, off: off, once: once, trigger: trigger, transitionEnd: transitionEnd, animationEnd: animationEnd, width: width, outerWidth: outerWidth, height: height, outerHeight: outerHeight, offset: offset, hide: hide, show: show, styles: styles, css: css, toArray: toArray, each: each, forEach: forEach, filter: filter, map: map, html: html, text: text, is: is, indexOf: indexOf, index: index, eq: eq, append: append, appendTo: appendTo, prepend: prepend, prependTo: prependTo, insertBefore: insertBefore, insertAfter: insertAfter, next: next, nextAll: nextAll, prev: prev, prevAll: prevAll, siblings: siblings, parent: parent, parents: parents, closest: closest, find: find, children: children, remove: remove, detach: detach, add: add, empty: empty });

    function scrollTo() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = t[0],
            r = t[1],
            m = t[2],
            v = t[3],
            g = t[4];
        return 4 === t.length && "function" == typeof v && (g = v, n = (e = t)[0], r = e[1], m = e[2], g = e[3], v = e[4]), void 0 === v && (v = "swing"), this.each(function() {
            var i, o, e, t, s, l, p, c, d = this,
                u = 0 < r || 0 === r,
                h = 0 < n || 0 === n;
            if (void 0 === v && (v = "swing"), u && (i = d.scrollTop, m || (d.scrollTop = r)), h && (o = d.scrollLeft, m || (d.scrollLeft = n)), m) {
                u && (e = d.scrollHeight - d.offsetHeight, s = Math.max(Math.min(r, e), 0)), h && (t = d.scrollWidth - d.offsetWidth, l = Math.max(Math.min(n, t), 0));
                var f = null;
                u && s === i && (u = !1), h && l === o && (h = !1), requestAnimationFrame(function e(t) {
                    void 0 === t && (t = (new Date).getTime()), null === f && (f = t);
                    var a, n = Math.max(Math.min((t - f) / m, 1), 0),
                        r = "linear" === v ? n : .5 - Math.cos(n * Math.PI) / 2;
                    u && (p = i + r * (s - i)), h && (c = o + r * (l - o)), u && i < s && s <= p && (d.scrollTop = s, a = !0), u && s < i && p <= s && (d.scrollTop = s, a = !0), h && o < l && l <= c && (d.scrollLeft = l, a = !0), h && l < o && c <= l && (d.scrollLeft = l, a = !0), a ? g && g() : (u && (d.scrollTop = p), h && (d.scrollLeft = c), requestAnimationFrame(e))
                })
            }
        })
    }

    function scrollTop() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = t[0],
            r = t[1],
            i = t[2],
            o = t[3];
        3 === t.length && "function" == typeof i && (n = (e = t)[0], r = e[1], o = e[2], i = e[3]);
        return void 0 === n ? 0 < this.length ? this[0].scrollTop : null : this.scrollTo(void 0, n, r, i, o)
    }

    function scrollLeft() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n = t[0],
            r = t[1],
            i = t[2],
            o = t[3];
        3 === t.length && "function" == typeof i && (n = (e = t)[0], r = e[1], o = e[2], i = e[3]);
        return void 0 === n ? 0 < this.length ? this[0].scrollLeft : null : this.scrollTo(n, void 0, r, i, o)
    }
    var Scroll = Object.freeze({ scrollTo: scrollTo, scrollTop: scrollTop, scrollLeft: scrollLeft });

    function animate(e, t) {
        var a, n = this,
            g = {
                props: Object.assign({}, e),
                params: Object.assign({ duration: 300, easing: "swing" }, t),
                elements: n,
                animating: !1,
                que: [],
                easingProgress: function(e, t) { return "swing" === e ? .5 - Math.cos(t * Math.PI) / 2 : "function" == typeof e ? e(t) : t },
                stop: function() { g.frameId && cancelAnimationFrame(g.frameId), g.animating = !1, g.elements.each(function(e, t) { delete t.dom7AnimateInstance }), g.que = [] },
                done: function(e) {
                    if (g.animating = !1, g.elements.each(function(e, t) { delete t.dom7AnimateInstance }), e && e(n), 0 < g.que.length) {
                        var t = g.que.shift();
                        g.animate(t[0], t[1])
                    }
                },
                animate: function(p, c) {
                    if (g.animating) return g.que.push([p, c]), g;
                    var d = [];
                    g.elements.each(function(t, a) {
                        var n, r, i, o, s;
                        a.dom7AnimateInstance || (g.elements[t].dom7AnimateInstance = g), d[t] = { container: a }, Object.keys(p).forEach(function(e) { n = win.getComputedStyle(a, null).getPropertyValue(e).replace(",", "."), r = parseFloat(n), i = n.replace(r, ""), o = parseFloat(p[e]), s = p[e] + i, d[t][e] = { initialFullValue: n, initialValue: r, unit: i, finalValue: o, finalFullValue: s, currentValue: r } })
                    });
                    var u, h, f = null,
                        m = 0,
                        v = 0,
                        t = !1;
                    return g.animating = !0, g.frameId = requestAnimationFrame(function e() {
                        var s, l;
                        u = (new Date).getTime(), t || (t = !0, c.begin && c.begin(n)), null === f && (f = u), c.progress && c.progress(n, Math.max(Math.min((u - f) / c.duration, 1), 0), f + c.duration - u < 0 ? 0 : f + c.duration - u, f), d.forEach(function(e) {
                            var o = e;
                            h || o.done || Object.keys(p).forEach(function(e) {
                                if (!h && !o.done) {
                                    s = Math.max(Math.min((u - f) / c.duration, 1), 0), l = g.easingProgress(c.easing, s);
                                    var t = o[e],
                                        a = t.initialValue,
                                        n = t.finalValue,
                                        r = t.unit;
                                    o[e].currentValue = a + l * (n - a);
                                    var i = o[e].currentValue;
                                    (a < n && n <= i || n < a && i <= n) && (o.container.style[e] = n + r, (v += 1) === Object.keys(p).length && (o.done = !0, m += 1), m === d.length && (h = !0)), h ? g.done(c.complete) : o.container.style[e] = i + r
                                }
                            })
                        }), h || (g.frameId = requestAnimationFrame(e))
                    }), g
                }
            };
        if (0 === g.elements.length) return n;
        for (var r = 0; r < g.elements.length; r += 1) g.elements[r].dom7AnimateInstance ? a = g.elements[r].dom7AnimateInstance : g.elements[r].dom7AnimateInstance = g;
        return a || (a = g), "stop" === e ? a.stop() : a.animate(g.props, g.params), n
    }

    function stop() { for (var e = 0; e < this.length; e += 1) this[e].dom7AnimateInstance && this[e].dom7AnimateInstance.stop() }
    var Animate = Object.freeze({ animate: animate, stop: stop }),
        noTrigger = "resize scroll".split(" ");

    function eventShortcut(e) { for (var t, a = [], n = arguments.length - 1; 0 < n--;) a[n] = arguments[n + 1]; if (void 0 !== a[0]) return (t = this).on.apply(t, [e].concat(a)); for (var r = 0; r < this.length; r += 1) noTrigger.indexOf(e) < 0 && (e in this[r] ? this[r][e]() : $(this[r]).trigger(e)); return this }

    function click() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["click"].concat(e)) }

    function blur() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["blur"].concat(e)) }

    function focus() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["focus"].concat(e)) }

    function focusin() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["focusin"].concat(e)) }

    function focusout() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["focusout"].concat(e)) }

    function keyup() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["keyup"].concat(e)) }

    function keydown() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["keydown"].concat(e)) }

    function keypress() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["keypress"].concat(e)) }

    function submit() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["submit"].concat(e)) }

    function change() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["change"].concat(e)) }

    function mousedown() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mousedown"].concat(e)) }

    function mousemove() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mousemove"].concat(e)) }

    function mouseup() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mouseup"].concat(e)) }

    function mouseenter() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mouseenter"].concat(e)) }

    function mouseleave() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mouseleave"].concat(e)) }

    function mouseout() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mouseout"].concat(e)) }

    function mouseover() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["mouseover"].concat(e)) }

    function touchstart() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["touchstart"].concat(e)) }

    function touchend() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["touchend"].concat(e)) }

    function touchmove() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["touchmove"].concat(e)) }

    function resize() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["resize"].concat(e)) }

    function scroll() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return eventShortcut.bind(this).apply(void 0, ["scroll"].concat(e)) }
    var eventShortcuts = Object.freeze({ click: click, blur: blur, focus: focus, focusin: focusin, focusout: focusout, keyup: keyup, keydown: keydown, keypress: keypress, submit: submit, change: change, mousedown: mousedown, mousemove: mousemove, mouseup: mouseup, mouseenter: mouseenter, mouseleave: mouseleave, mouseout: mouseout, mouseover: mouseover, touchstart: touchstart, touchend: touchend, touchmove: touchmove, resize: resize, scroll: scroll });
    [Methods, Scroll, Animate, eventShortcuts].forEach(function(t) { Object.keys(t).forEach(function(e) { $.fn[e] = t[e] }) });
    var NEWTON_ITERATIONS = 4,
        NEWTON_MIN_SLOPE = .001,
        SUBDIVISION_PRECISION = 1e-7,
        SUBDIVISION_MAX_ITERATIONS = 10,
        kSplineTableSize = 11,
        kSampleStepSize = 1 / (kSplineTableSize - 1),
        float32ArraySupported = "function" == typeof Float32Array;

    function A(e, t) { return 1 - 3 * t + 3 * e }

    function B(e, t) { return 3 * t - 6 * e }

    function C(e) { return 3 * e }

    function calcBezier(e, t, a) { return ((A(t, a) * e + B(t, a)) * e + C(t)) * e }

    function getSlope(e, t, a) { return 3 * A(t, a) * e * e + 2 * B(t, a) * e + C(t) }

    function binarySubdivide(e, t, a, n, r) { for (var i, o, s = 0; 0 < (i = calcBezier(o = t + (a - t) / 2, n, r) - e) ? a = o : t = o, Math.abs(i) > SUBDIVISION_PRECISION && ++s < SUBDIVISION_MAX_ITERATIONS;); return o }

    function newtonRaphsonIterate(e, t, a, n) {
        for (var r = 0; r < NEWTON_ITERATIONS; ++r) {
            var i = getSlope(t, a, n);
            if (0 === i) return t;
            t -= (calcBezier(t, a, n) - e) / i
        }
        return t
    }

    function bezier(o, t, s, a) {
        if (!(0 <= o && o <= 1 && 0 <= s && s <= 1)) throw new Error("bezier x values must be in [0, 1] range");
        var l = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        if (o !== t || s !== a)
            for (var e = 0; e < kSplineTableSize; ++e) l[e] = calcBezier(e * kSampleStepSize, o, s);
        return function(e) {
            return o === t && s === a ? e : 0 === e ? 0 : 1 === e ? 1 : calcBezier(function(e) {
                for (var t = 0, a = 1, n = kSplineTableSize - 1; a !== n && l[a] <= e; ++a) t += kSampleStepSize;
                var r = t + (e - l[--a]) / (l[a + 1] - l[a]) * kSampleStepSize,
                    i = getSlope(r, o, s);
                return NEWTON_MIN_SLOPE <= i ? newtonRaphsonIterate(e, r, o, s) : 0 === i ? r : binarySubdivide(e, t, t + kSampleStepSize, o, s)
            }(e), t, a)
        }
    }
    for (var defaultDiacriticsRemovalap = [{ base: "A", letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ" }, { base: "AA", letters: "Ꜳ" }, { base: "AE", letters: "ÆǼǢ" }, { base: "AO", letters: "Ꜵ" }, { base: "AU", letters: "Ꜷ" }, { base: "AV", letters: "ꜸꜺ" }, { base: "AY", letters: "Ꜽ" }, { base: "B", letters: "BⒷＢḂḄḆɃƂƁ" }, { base: "C", letters: "CⒸＣĆĈĊČÇḈƇȻꜾ" }, { base: "D", letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ" }, { base: "DZ", letters: "ǱǄ" }, { base: "Dz", letters: "ǲǅ" }, { base: "E", letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ" }, { base: "F", letters: "FⒻＦḞƑꝻ" }, { base: "G", letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ" }, { base: "H", letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ" }, { base: "I", letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ" }, { base: "J", letters: "JⒿＪĴɈ" }, { base: "K", letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ" }, { base: "L", letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ" }, { base: "LJ", letters: "Ǉ" }, { base: "Lj", letters: "ǈ" }, { base: "M", letters: "MⓂＭḾṀṂⱮƜ" }, { base: "N", letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ" }, { base: "NJ", letters: "Ǌ" }, { base: "Nj", letters: "ǋ" }, { base: "O", letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ" }, { base: "OI", letters: "Ƣ" }, { base: "OO", letters: "Ꝏ" }, { base: "OU", letters: "Ȣ" }, { base: "OE", letters: "Œ" }, { base: "oe", letters: "œ" }, { base: "P", letters: "PⓅＰṔṖƤⱣꝐꝒꝔ" }, { base: "Q", letters: "QⓆＱꝖꝘɊ" }, { base: "R", letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ" }, { base: "S", letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ" }, { base: "T", letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ" }, { base: "TZ", letters: "Ꜩ" }, { base: "U", letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ" }, { base: "V", letters: "VⓋＶṼṾƲꝞɅ" }, { base: "VY", letters: "Ꝡ" }, { base: "W", letters: "WⓌＷẀẂŴẆẄẈⱲ" }, { base: "X", letters: "XⓍＸẊẌ" }, { base: "Y", letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ" }, { base: "Z", letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ" }, { base: "a", letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ" }, { base: "aa", letters: "ꜳ" }, { base: "ae", letters: "æǽǣ" }, { base: "ao", letters: "ꜵ" }, { base: "au", letters: "ꜷ" }, { base: "av", letters: "ꜹꜻ" }, { base: "ay", letters: "ꜽ" }, { base: "b", letters: "bⓑｂḃḅḇƀƃɓ" }, { base: "c", letters: "cⓒｃćĉċčçḉƈȼꜿↄ" }, { base: "d", letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ" }, { base: "dz", letters: "ǳǆ" }, { base: "e", letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ" }, { base: "f", letters: "fⓕｆḟƒꝼ" }, { base: "g", letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ" }, { base: "h", letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ" }, { base: "hv", letters: "ƕ" }, { base: "i", letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı" }, { base: "j", letters: "jⓙｊĵǰɉ" }, { base: "k", letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ" }, { base: "l", letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ" }, { base: "lj", letters: "ǉ" }, { base: "m", letters: "mⓜｍḿṁṃɱɯ" }, { base: "n", letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ" }, { base: "nj", letters: "ǌ" }, { base: "o", letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ" }, { base: "oi", letters: "ƣ" }, { base: "ou", letters: "ȣ" }, { base: "oo", letters: "ꝏ" }, { base: "p", letters: "pⓟｐṕṗƥᵽꝑꝓꝕ" }, { base: "q", letters: "qⓠｑɋꝗꝙ" }, { base: "r", letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ" }, { base: "s", letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ" }, { base: "t", letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ" }, { base: "tz", letters: "ꜩ" }, { base: "u", letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ" }, { base: "v", letters: "vⓥｖṽṿʋꝟʌ" }, { base: "vy", letters: "ꝡ" }, { base: "w", letters: "wⓦｗẁẃŵẇẅẘẉⱳ" }, { base: "x", letters: "xⓧｘẋẍ" }, { base: "y", letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ" }, { base: "z", letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ" }], diacriticsMap = {}, i = 0; i < defaultDiacriticsRemovalap.length; i += 1)
        for (var letters = defaultDiacriticsRemovalap[i].letters, j = 0; j < letters.length; j += 1) diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
    var createPromise = function(e) {
            var a, n, r = !1,
                i = !1,
                o = { then: void 0, catch: void 0 },
                t = { then: function(e) { return r ? e.apply(void 0, a) : o.then = e, t }, catch: function(e) { return i ? e.apply(void 0, n) : o.catch = e, t } };
            return e(function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                r = !0, o.then ? o.then.apply(o, e) : a = e
            }, function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                i = !0, o.catch ? o.catch.apply(o, e) : n = e
            }), t
        },
        uniqueNumber = 1,
        Utils = {
            uniqueNumber: function() { return uniqueNumber += 1 },
            id: function(e, t) { void 0 === e && (e = "xxxxxxxxxx"), void 0 === t && (t = "0123456789abcdef"); var a = t.length; return e.replace(/x/g, function() { return t[Math.floor(Math.random() * a)] }) },
            mdPreloaderContent: '\n    <span class="preloader-inner">\n      <span class="preloader-inner-gap"></span>\n      <span class="preloader-inner-left">\n          <span class="preloader-inner-half-circle"></span>\n      </span>\n      <span class="preloader-inner-right">\n          <span class="preloader-inner-half-circle"></span>\n      </span>\n    </span>\n  '.trim(),
            eventNameToColonCase: function(e) { var a; return e.split("").map(function(e, t) { return e.match(/[A-Z]/) && 0 !== t && !a ? (a = !0, ":" + e.toLowerCase()) : e.toLowerCase() }).join("") },
            deleteProps: function(e) {
                var t = e;
                Object.keys(t).forEach(function(e) { try { t[e] = null } catch (e) {} try { delete t[e] } catch (e) {} })
            },
            bezier: function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return bezier.apply(void 0, e) },
            nextTick: function(e, t) { return void 0 === t && (t = 0), setTimeout(e, t) },
            nextFrame: function(e) { return Utils.requestAnimationFrame(function() { Utils.requestAnimationFrame(e) }) },
            now: function() { return Date.now() },
            promise: function(e) { return win.Promise ? new Promise(e) : createPromise(e) },
            requestAnimationFrame: function(e) { return win.requestAnimationFrame ? win.requestAnimationFrame(e) : win.webkitRequestAnimationFrame ? win.webkitRequestAnimationFrame(e) : win.setTimeout(e, 1e3 / 60) },
            cancelAnimationFrame: function(e) { return win.cancelAnimationFrame ? win.cancelAnimationFrame(e) : win.webkitCancelAnimationFrame ? win.webkitCancelAnimationFrame(e) : win.clearTimeout(e) },
            removeDiacritics: function(e) { return e.replace(/[^\u0000-\u007E]/g, function(e) { return diacriticsMap[e] || e }) },
            parseUrlQuery: function(e) {
                var t, a, n, r, i = {},
                    o = e || win.location.href;
                if ("string" == typeof o && o.length)
                    for (r = (a = (o = -1 < o.indexOf("?") ? o.replace(/\S*\?/, "") : "").split("&").filter(function(e) { return "" !== e })).length, t = 0; t < r; t += 1) n = a[t].replace(/#\S+/g, "").split("="), i[decodeURIComponent(n[0])] = void 0 === n[1] ? void 0 : decodeURIComponent(n.slice(1).join("=")) || "";
                return i
            },
            getTranslate: function(e, t) {
                var a, n, r;
                void 0 === t && (t = "x");
                var i = win.getComputedStyle(e, null);
                return win.WebKitCSSMatrix ? (6 < (n = i.transform || i.webkitTransform).split(",").length && (n = n.split(", ").map(function(e) { return e.replace(",", ".") }).join(", ")), r = new win.WebKitCSSMatrix("none" === n ? "" : n)) : a = (r = i.MozTransform || i.OTransform || i.MsTransform || i.msTransform || i.transform || i.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","), "x" === t && (n = win.WebKitCSSMatrix ? r.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])), "y" === t && (n = win.WebKitCSSMatrix ? r.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])), n || 0
            },
            serializeObject: function(n, r) {
                if (void 0 === r && (r = []), "string" == typeof n) return n;
                var i, o = [];

                function s(e) { if (0 < r.length) { for (var t = "", a = 0; a < r.length; a += 1) t += 0 === a ? r[a] : "[" + encodeURIComponent(r[a]) + "]"; return t + "[" + encodeURIComponent(e) + "]" } return encodeURIComponent(e) }

                function l(e) { return encodeURIComponent(e) }
                return Object.keys(n).forEach(function(e) {
                    var t;
                    if (Array.isArray(n[e])) {
                        t = [];
                        for (var a = 0; a < n[e].length; a += 1) Array.isArray(n[e][a]) || "object" != typeof n[e][a] ? t.push(s(e) + "[]=" + l(n[e][a])) : ((i = r.slice()).push(e), i.push(String(a)), t.push(Utils.serializeObject(n[e][a], i)));
                        0 < t.length && o.push(t.join("&"))
                    } else null === n[e] || "" === n[e] ? o.push(s(e) + "=") : "object" == typeof n[e] ? ((i = r.slice()).push(e), "" !== (t = Utils.serializeObject(n[e], i)) && o.push(t)) : void 0 !== n[e] && "" !== n[e] ? o.push(s(e) + "=" + l(n[e])) : "" === n[e] && o.push(s(e))
                }), o.join("&")
            },
            isObject: function(e) { return "object" == typeof e && null !== e && e.constructor && e.constructor === Object },
            merge: function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                var a = e[0];
                e.splice(0, 1);
                for (var n = e, r = 0; r < n.length; r += 1) {
                    var i = e[r];
                    if (null != i)
                        for (var o = Object.keys(Object(i)), s = 0, l = o.length; s < l; s += 1) {
                            var p = o[s],
                                c = Object.getOwnPropertyDescriptor(i, p);
                            void 0 !== c && c.enumerable && (a[p] = i[p])
                        }
                }
                return a
            },
            extend: function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                var a, n, r = !0;
                n = ("boolean" == typeof e[0] ? (r = e[0], a = e[1], e.splice(0, 2)) : (a = e[0], e.splice(0, 1)), e);
                for (var i = 0; i < n.length; i += 1) {
                    var o = e[i];
                    if (null != o)
                        for (var s = Object.keys(Object(o)), l = 0, p = s.length; l < p; l += 1) {
                            var c = s[l],
                                d = Object.getOwnPropertyDescriptor(o, c);
                            void 0 !== d && d.enumerable && (r ? Utils.isObject(a[c]) && Utils.isObject(o[c]) ? Utils.extend(a[c], o[c]) : !Utils.isObject(a[c]) && Utils.isObject(o[c]) ? (a[c] = {}, Utils.extend(a[c], o[c])) : a[c] = o[c] : a[c] = o[c])
                        }
                }
                return a
            }
        },
        Device = function() {
            var e = win.navigator.platform,
                t = win.navigator.userAgent,
                a = { ios: !1, android: !1, androidChrome: !1, desktop: !1, windowsPhone: !1, iphone: !1, iphoneX: !1, ipod: !1, ipad: !1, edge: !1, ie: !1, firefox: !1, macos: !1, windows: !1, cordova: !(!win.cordova && !win.phonegap), phonegap: !(!win.cordova && !win.phonegap) },
                n = win.screen.width,
                r = win.screen.height,
                i = t.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),
                o = t.match(/(Android);?[\s\/]+([\d.]+)?/),
                s = t.match(/(iPad).*OS\s([\d_]+)/),
                l = t.match(/(iPod)(.*OS\s([\d_]+))?/),
                p = !s && t.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                c = p && (375 === n && 812 === r || 414 === n && 896 === r),
                d = 0 <= t.indexOf("MSIE ") || 0 <= t.indexOf("Trident/"),
                u = 0 <= t.indexOf("Edge/"),
                h = 0 <= t.indexOf("Gecko/") && 0 <= t.indexOf("Firefox/"),
                f = "MacIntel" === e,
                m = "Win32" === e;
            if (a.ie = d, a.edge = u, a.firefox = h, i && (a.os = "windows", a.osVersion = m[2], a.windowsPhone = !0), o && !m && (a.os = "android", a.osVersion = o[2], a.android = !0, a.androidChrome = 0 <= t.toLowerCase().indexOf("chrome")), (s || p || l) && (a.os = "ios", a.ios = !0), p && !l && (a.osVersion = p[2].replace(/_/g, "."), a.iphone = !0, a.iphoneX = c), s && (a.osVersion = s[2].replace(/_/g, "."), a.ipad = !0), l && (a.osVersion = l[3] ? l[3].replace(/_/g, ".") : null, a.iphone = !0), a.ios && a.osVersion && 0 <= t.indexOf("Version/") && "10" === a.osVersion.split(".")[0] && (a.osVersion = t.toLowerCase().split("version/")[1].split(" ")[0]), a.webView = !(!(p || s || l) || !t.match(/.*AppleWebKit(?!.*Safari)/i) && !win.navigator.standalone) || win.matchMedia && win.matchMedia("(display-mode: standalone)").matches, a.webview = a.webView, a.standalone = a.webView, a.desktop = !(a.os || a.android || a.webView), a.desktop && (a.macos = f, a.windows = m), a.os && "ios" === a.os) {
                var v = a.osVersion.split("."),
                    g = doc.querySelector('meta[name="viewport"]');
                a.minimalUi = !a.webView && (l || p) && (1 * v[0] == 7 ? 1 <= 1 * v[1] : 7 < 1 * v[0]) && g && 0 <= g.getAttribute("content").indexOf("minimal-ui")
            }
            return a.needsStatusbarOverlay = function() { return !(!(a.webView || a.android && a.cordova) || win.innerWidth * win.innerHeight != win.screen.width * win.screen.height) && (!a.iphoneX || 90 !== win.orientation && -90 !== win.orientation) }, a.statusbar = a.needsStatusbarOverlay(), a.pixelRatio = win.devicePixelRatio || 1, a
        }(),
        Framework7Class = function(e, t) {
            void 0 === e && (e = {}), void 0 === t && (t = []);
            var a = this;
            a.params = e, a.eventsParents = t, a.eventsListeners = {}, a.params && a.params.on && Object.keys(a.params.on).forEach(function(e) { a.on(e, a.params.on[e]) })
        },
        staticAccessors$1 = { components: { configurable: !0 } };

    function ConstructorMethods(e) {
        void 0 === e && (e = {});
        var i = e.defaultSelector,
            a = e.constructor,
            n = e.domProp,
            r = e.app,
            t = e.addMethods,
            o = { create: function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return r ? new(Function.prototype.bind.apply(a, [null].concat([r], e))) : new(Function.prototype.bind.apply(a, [null].concat(e))) }, get: function(e) { if (void 0 === e && (e = i), e instanceof a) return e; var t = $(e); return 0 !== t.length ? t[0][n] : void 0 }, destroy: function(e) { var t = o.get(e); if (t && t.destroy) return t.destroy() } };
        return t && Array.isArray(t) && t.forEach(function(r) { o[r] = function(e) { void 0 === e && (e = i); for (var t = [], a = arguments.length - 1; 0 < a--;) t[a] = arguments[a + 1]; var n = o.get(e); if (n && n[r]) return n[r].apply(n, t) } }), o
    }

    function ModalMethods(e) {
        void 0 === e && (e = {});
        var r = e.defaultSelector,
            i = e.constructor,
            o = e.app;
        return Utils.extend(ConstructorMethods({ defaultSelector: r, constructor: i, app: o, domProp: "f7Modal" }), {
            open: function(e, t) {
                var a = $(e),
                    n = a[0].f7Modal;
                return n || (n = new i(o, { el: a })), n.open(t)
            },
            close: function(e, t) { void 0 === e && (e = r); var a = $(e); if (0 !== a.length) { var n = a[0].f7Modal; return n || (n = new i(o, { el: a })), n.close(t) } }
        })
    }
    Framework7Class.prototype.on = function(e, t, a) { var n = this; if ("function" != typeof t) return n; var r = a ? "unshift" : "push"; return e.split(" ").forEach(function(e) { n.eventsListeners[e] || (n.eventsListeners[e] = []), n.eventsListeners[e][r](t) }), n }, Framework7Class.prototype.once = function(n, r, e) {
        var i = this;
        if ("function" != typeof r) return i;
        return i.on(n, function e() {
            for (var t = [], a = arguments.length; a--;) t[a] = arguments[a];
            r.apply(i, t), i.off(n, e)
        }, e)
    }, Framework7Class.prototype.off = function(e, n) { var r = this; return r.eventsListeners && e.split(" ").forEach(function(a) { void 0 === n ? r.eventsListeners[a] = [] : r.eventsListeners[a] && r.eventsListeners[a].forEach(function(e, t) { e === n && r.eventsListeners[a].splice(t, 1) }) }), r }, Framework7Class.prototype.emit = function() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var a, n, r, i, o = this;
        if (!o.eventsListeners) return o;
        i = "string" == typeof e[0] || Array.isArray(e[0]) ? (a = e[0], n = e.slice(1, e.length), (r = o).eventsParents) : (a = e[0].events, n = e[0].data, r = e[0].context || o, e[0].local ? [] : e[0].parents || o.eventsParents);
        var s = Array.isArray(a) ? a : a.split(" "),
            l = s.map(function(e) { return e.replace("local::", "") }),
            p = s.filter(function(e) { return e.indexOf("local::") < 0 });
        return l.forEach(function(e) {
            if (o.eventsListeners && o.eventsListeners[e]) {
                var t = [];
                o.eventsListeners[e].forEach(function(e) { t.push(e) }), t.forEach(function(e) { e.apply(r, n) })
            }
        }), i && 0 < i.length && i.forEach(function(e) { e.emit.apply(e, [p].concat(n)) }), o
    }, Framework7Class.prototype.useModuleParams = function(e, t) {
        if (e.params) {
            var a = {};
            Object.keys(e.params).forEach(function(e) { void 0 !== t[e] && (a[e] = Utils.extend({}, t[e])) }), Utils.extend(t, e.params), Object.keys(a).forEach(function(e) { Utils.extend(t[e], a[e]) })
        }
    }, Framework7Class.prototype.useModulesParams = function(a) {
        var n = this;
        n.modules && Object.keys(n.modules).forEach(function(e) {
            var t = n.modules[e];
            t.params && Utils.extend(a, t.params)
        })
    }, Framework7Class.prototype.useModule = function(e, t) {
        void 0 === e && (e = ""), void 0 === t && (t = {});
        var n = this;
        if (n.modules) {
            var r = "string" == typeof e ? n.modules[e] : e;
            r && (r.instance && Object.keys(r.instance).forEach(function(e) {
                var t = r.instance[e];
                n[e] = "function" == typeof t ? t.bind(n) : t
            }), r.on && n.on && Object.keys(r.on).forEach(function(e) { n.on(e, r.on[e]) }), r.vnode && (n.vnodeHooks || (n.vnodeHooks = {}), Object.keys(r.vnode).forEach(function(a) {
                Object.keys(r.vnode[a]).forEach(function(e) {
                    var t = r.vnode[a][e];
                    n.vnodeHooks[e] || (n.vnodeHooks[e] = {}), n.vnodeHooks[e][a] || (n.vnodeHooks[e][a] = []), n.vnodeHooks[e][a].push(t.bind(n))
                })
            })), r.create && r.create.bind(n)(t))
        }
    }, Framework7Class.prototype.useModules = function(a) {
        void 0 === a && (a = {});
        var n = this;
        n.modules && Object.keys(n.modules).forEach(function(e) {
            var t = a[e] || {};
            n.useModule(e, t)
        })
    }, staticAccessors$1.components.set = function(e) { this.use && this.use(e) }, Framework7Class.installModule = function(t) {
        for (var e = [], a = arguments.length - 1; 0 < a--;) e[a] = arguments[a + 1];
        var n = this;
        n.prototype.modules || (n.prototype.modules = {});
        var r = t.name || Object.keys(n.prototype.modules).length + "_" + Utils.now();
        return (n.prototype.modules[r] = t).proto && Object.keys(t.proto).forEach(function(e) { n.prototype[e] = t.proto[e] }), t.static && Object.keys(t.static).forEach(function(e) { n[e] = t.static[e] }), t.install && t.install.apply(n, e), n
    }, Framework7Class.use = function(e) { for (var t = [], a = arguments.length - 1; 0 < a--;) t[a] = arguments[a + 1]; var n = this; return Array.isArray(e) ? (e.forEach(function(e) { return n.installModule(e) }), n) : n.installModule.apply(n, [e].concat(t)) }, Object.defineProperties(Framework7Class, staticAccessors$1);
    var fetchedModules = [];

    function loadModule(u) {
        var h = this;
        return new Promise(function(e, t) {
            var s, a, n, r = h.instance;
            if (u) {
                if ("string" == typeof u) {
                    var i = u.match(/([a-z0-9-]*)/i);
                    if (u.indexOf(".") < 0 && i && i[0].length === u.length) {
                        if (!r || r && !r.params.lazyModulesPath) return void t(new Error('Framework7: "lazyModulesPath" app parameter must be specified to fetch module by name'));
                        s = r.params.lazyModulesPath + "/" + u + ".js"
                    } else s = u
                } else "function" == typeof u ? n = u : a = u;
                if (n) {
                    var o = n(h, !1);
                    if (!o) return void t(new Error("Framework7: Can't find Framework7 component in specified component function"));
                    if (h.prototype.modules && h.prototype.modules[o.name]) return void e();
                    d(o), e()
                }
                if (a) {
                    var l = a;
                    if (!l) return void t(new Error("Framework7: Can't find Framework7 component in specified component"));
                    if (h.prototype.modules && h.prototype.modules[l.name]) return void e();
                    d(l), e()
                }
                if (s) {
                    if (0 <= fetchedModules.indexOf(s)) return void e();
                    fetchedModules.push(s);
                    var p = new Promise(function(i, o) {
                            h.request.get(s, function(e) {
                                var t = "f7_component_loader_callback_" + Utils.id(),
                                    a = document.createElement("script");
                                a.innerHTML = "window." + t + " = function (Framework7, Framework7AutoInstallComponent) {return " + e.trim() + "}", $("head").append(a);
                                var n = window[t];
                                delete window[t], $(a).remove();
                                var r = n(h, !1);
                                r ? (h.prototype.modules && h.prototype.modules[r.name] || d(r), i()) : o(new Error("Framework7: Can't find Framework7 component in " + s + " file"))
                            }, function(e, t) { o(e, t) })
                        }),
                        c = new Promise(function(a) {
                            h.request.get(s.replace(".js", r.rtl ? ".rtl.css" : ".css"), function(e) {
                                var t = document.createElement("style");
                                t.innerHTML = e, $("head").append(t), a()
                            }, function() { a() })
                        });
                    Promise.all([p, c]).then(function() { e() }).catch(function(e) { t(e) })
                }
            } else t(new Error("Framework7: Lazy module must be specified"));

            function d(e) { h.use(e), r && (r.useModuleParams(e, r.params), r.useModule(e)) }
        })
    }
    var Framework7 = function(i) {
        function o(e) {
            i.call(this, e);
            var t = Utils.extend({}, e),
                a = this;
            o.instance = a;
            var n = { version: "1.0.0", id: "io.framework7.testapp", root: "body", theme: "auto", language: win.navigator.language, routes: [], name: "Framework7", lazyModulesPath: null, initOnDeviceReady: !0, init: !0 };
            a.useModulesParams(n), a.params = Utils.extend(n, e);
            var r = $(a.params.root);
            return Utils.extend(a, { id: a.params.id, name: a.params.name, version: a.params.version, routes: a.params.routes, language: a.params.language, root: r, rtl: "rtl" === r.css("direction"), theme: "auto" === a.params.theme ? Device.ios ? "ios" : "md" : a.params.theme, passedParams: t }), a.root && a.root[0] && (a.root[0].f7 = a), a.useModules(), a.params.init && (Device.cordova && a.params.initOnDeviceReady ? $(doc).on("deviceready", function() { a.init() }) : a.init()), a
        }
        i && (o.__proto__ = i);
        var e = { $: { configurable: !0 }, t7: { configurable: !0 } },
            t = { Dom7: { configurable: !0 }, $: { configurable: !0 }, Template7: { configurable: !0 }, Class: { configurable: !0 } };
        return ((o.prototype = Object.create(i && i.prototype)).constructor = o).prototype.init = function() { var t = this; return t.initialized || (t.root.addClass("framework7-initializing"), t.rtl && $("html").attr("dir", "rtl"), t.root.addClass("framework7-root"), $("html").removeClass("ios md").addClass(t.theme), t.data = {}, t.params.data && "function" == typeof t.params.data ? Utils.extend(t.data, t.params.data.bind(t)()) : t.params.data && Utils.extend(t.data, t.params.data), t.methods = {}, t.params.methods && Object.keys(t.params.methods).forEach(function(e) { "function" == typeof t.params.methods[e] ? t.methods[e] = t.params.methods[e].bind(t) : t.methods[e] = t.params.methods[e] }), Utils.nextFrame(function() { t.root.removeClass("framework7-initializing") }), t.initialized = !0, t.emit("init")), t }, o.prototype.loadModule = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return o.loadModule.apply(o, e) }, o.prototype.loadModules = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return o.loadModules.apply(o, e) }, o.prototype.getVnodeHooks = function(e, t) { return this.vnodeHooks && this.vnodeHooks[e] && this.vnodeHooks[e][t] || [] }, e.$.get = function() { return $ }, e.t7.get = function() { return Template7 }, t.Dom7.get = function() { return $ }, t.$.get = function() { return $ }, t.Template7.get = function() { return Template7 }, t.Class.get = function() { return i }, Object.defineProperties(o.prototype, e), Object.defineProperties(o, t), o
    }(Framework7Class);
    Framework7.ModalMethods = ModalMethods, Framework7.ConstructorMethods = ConstructorMethods, Framework7.loadModule = loadModule, Framework7.loadModules = function(e) { return Promise.all(e.map(function(e) { return Framework7.loadModule(e) })) };
    var DeviceModule = {
            name: "device",
            proto: { device: Device },
            static: { device: Device },
            on: {
                init: function() {
                    var e = [],
                        t = doc.querySelector("html");
                    if (t) {
                        if (e.push("device-pixel-ratio-" + Math.floor(Device.pixelRatio)), 2 <= Device.pixelRatio && e.push("device-retina"), Device.os) {
                            if (e.push("device-" + Device.os, "device-" + Device.os + "-" + Device.osVersion.split(".")[0], "device-" + Device.os + "-" + Device.osVersion.replace(/\./g, "-")), "ios" === Device.os) {
                                for (var a = parseInt(Device.osVersion.split(".")[0], 10) - 1; 6 <= a; a -= 1) e.push("device-ios-gt-" + a);
                                Device.iphoneX && e.push("device-iphone-x")
                            }
                        } else Device.desktop && (e.push("device-desktop"), Device.macos ? e.push("device-macos") : Device.windows && e.push("device-windows"));
                        (Device.cordova || Device.phonegap) && e.push("device-cordova"), e.forEach(function(e) { t.classList.add(e) })
                    }
                }
            }
        },
        Support = (qq = !1, rq = doc.createElement("div"), "sticky -webkit-sticky -moz-sticky".split(" ").forEach(function(e) { qq || (rq.style.position = e, rq.style.position === e && (qq = !0)) }), nq = qq, oq = doc.createElement("div"), {
            positionSticky: nq,
            touch: !!("ontouchstart" in win || win.DocumentTouch && doc instanceof win.DocumentTouch),
            pointerEvents: !!(win.navigator.pointerEnabled || win.PointerEvent || "maxTouchPoints" in win.navigator),
            prefixedPointerEvents: !!win.navigator.msPointerEnabled,
            transition: (vq = oq.style, "transition" in vq || "webkitTransition" in vq || "MozTransition" in vq),
            transforms3d: win.Modernizr && !0 === win.Modernizr.csstransforms3d || (xq = oq.style, "webkitPerspective" in xq || "MozPerspective" in xq || "OPerspective" in xq || "MsPerspective" in xq || "perspective" in xq),
            flexbox: function() {
                for (var e = doc.createElement("div").style, t = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), a = 0; a < t.length; a += 1)
                    if (t[a] in e) return !0;
                return !1
            }(),
            observer: "MutationObserver" in win || "WebkitMutationObserver" in win,
            passiveListener: function() {
                var e = !1;
                try {
                    var t = Object.defineProperty({}, "passive", { get: function() { e = !0 } });
                    win.addEventListener("testPassiveListener", null, t)
                } catch (e) {}
                return e
            }(),
            gestures: "ongesturestart" in win
        }),
        qq, rq, xq, vq, nq, oq, SupportModule = {
            name: "support",
            proto: { support: Support },
            static: { support: Support },
            on: {
                init: function() {
                    var t = doc.querySelector("html");
                    if (t) {
                        var e = [];
                        Support.positionSticky && e.push("support-position-sticky"), e.forEach(function(e) { t.classList.add(e) })
                    }
                }
            }
        },
        UtilsModule = { name: "utils", proto: { utils: Utils }, static: { utils: Utils } },
        ResizeModule = {
            name: "resize",
            instance: {
                getSize: function() {
                    var e = this;
                    if (!e.root[0]) return { width: 0, height: 0, left: 0, top: 0 };
                    var t = e.root.offset(),
                        a = [e.root[0].offsetWidth, e.root[0].offsetHeight, t.left, t.top],
                        n = a[0],
                        r = a[1],
                        i = a[2],
                        o = a[3];
                    return { width: e.width = n, height: e.height = r, left: e.left = i, top: e.top = o }
                }
            },
            on: {
                init: function() {
                    var e = this;
                    e.getSize(), win.addEventListener("resize", function() { e.emit("resize") }, !1), win.addEventListener("orientationchange", function() { e.emit("orientationchange") })
                },
                orientationchange: function() { this.device && this.device.minimalUi && (90 !== win.orientation && -90 !== win.orientation || (doc.body.scrollTop = 0)), this.device.ipad && (doc.body.scrollLeft = 0, setTimeout(function() { doc.body.scrollLeft = 0 }, 0)) },
                resize: function() { this.getSize() }
            }
        },
        globals = {},
        jsonpRequests = 0;

    function Request(e) {
        var t = Utils.extend({}, globals);
        "beforeCreate beforeOpen beforeSend error complete success statusCode".split(" ").forEach(function(e) { delete t[e] });
        var a = Utils.extend({ url: win.location.toString(), method: "GET", data: !1, async: !0, cache: !0, user: "", password: "", headers: {}, xhrFields: {}, statusCode: {}, processData: !0, dataType: "text", contentType: "application/x-www-form-urlencoded", timeout: 0 }, t),
            i = Utils.extend({}, a, e);

        function n(e) { for (var t, a, n = [], r = arguments.length - 1; 0 < r--;) n[r] = arguments[r + 1]; return globals[e] && (t = globals[e].apply(globals, n)), i[e] && (a = i[e].apply(i, n)), "boolean" != typeof t && (t = !0), "boolean" != typeof a && (a = !0), t && a }
        if (!1 !== n("beforeCreate", i)) {
            i.type && (i.method = i.type);
            var r, o = 0 <= i.url.indexOf("?") ? "&" : "?",
                s = i.method.toUpperCase();
            if (("GET" === s || "HEAD" === s || "OPTIONS" === s || "DELETE" === s) && i.data)(r = "string" == typeof i.data ? 0 <= i.data.indexOf("?") ? i.data.split("?")[1] : i.data : Utils.serializeObject(i.data)).length && (i.url += o + r, "?" === o && (o = "&"));
            if ("json" === i.dataType && 0 <= i.url.indexOf("callback=")) {
                var l, p = "f7jsonp_" + (Date.now() + (jsonpRequests += 1)),
                    c = i.url.split("callback="),
                    d = c[0] + "callback=" + p;
                if (0 <= c[1].indexOf("&")) {
                    var u = c[1].split("&").filter(function(e) { return 0 < e.indexOf("=") }).join("&");
                    0 < u.length && (d += "&" + u)
                }
                var h = doc.createElement("script");
                return h.type = "text/javascript", h.onerror = function() { clearTimeout(l), n("error", null, "scripterror"), n("complete", null, "scripterror") }, h.src = d, win[p] = function(e) { clearTimeout(l), n("success", e), h.parentNode.removeChild(h), h = null, delete win[p] }, doc.querySelector("head").appendChild(h), void(0 < i.timeout && (l = setTimeout(function() { h.parentNode.removeChild(h), n("error", h = null, "timeout") }, i.timeout)))
            }
            "GET" !== s && "HEAD" !== s && "OPTIONS" !== s && "DELETE" !== s || !1 === i.cache && (i.url += o + "_nocache" + Date.now());
            var f = new XMLHttpRequest;
            if (f.requestUrl = i.url, f.requestParameters = i, !1 === n("beforeOpen", f, i)) return f;
            f.open(s, i.url, i.async, i.user, i.password);
            var m, v = null;
            if (("POST" === s || "PUT" === s || "PATCH" === s) && i.data)
                if (i.processData)
                    if (0 <= [ArrayBuffer, Blob, Document, FormData].indexOf(i.data.constructor)) v = i.data;
                    else {
                        var g = "---------------------------" + Date.now().toString(16);
                        "multipart/form-data" === i.contentType ? f.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + g) : f.setRequestHeader("Content-Type", i.contentType), v = "";
                        var b = Utils.serializeObject(i.data);
                        if ("multipart/form-data" === i.contentType) {
                            b = b.split("&");
                            for (var y = [], w = 0; w < b.length; w += 1) y.push('Content-Disposition: form-data; name="' + b[w].split("=")[0] + '"\r\n\r\n' + b[w].split("=")[1] + "\r\n");
                            v = "--" + g + "\r\n" + y.join("--" + g + "\r\n") + "--" + g + "--\r\n"
                        } else v = "application/json" === i.contentType ? JSON.stringify(i.data) : b
                    }
            else v = i.data, f.setRequestHeader("Content-Type", i.contentType);
            return i.headers && Object.keys(i.headers).forEach(function(e) { f.setRequestHeader(e, i.headers[e]) }), void 0 === i.crossDomain && (i.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(i.url) && RegExp.$2 !== win.location.host), i.crossDomain || f.setRequestHeader("X-Requested-With", "XMLHttpRequest"), i.xhrFields && Utils.extend(f, i.xhrFields), f.onload = function() {
                var e;
                if (m && clearTimeout(m), 200 <= f.status && f.status < 300 || 0 === f.status)
                    if ("json" === i.dataType) {
                        var t;
                        try { e = JSON.parse(f.responseText) } catch (e) { t = !0 }
                        t ? n("error", f, "parseerror") : n("success", e, f.status, f)
                    } else n("success", e = "text" === f.responseType || "" === f.responseType ? f.responseText : f.response, f.status, f);
                else n("error", f, f.status);
                i.statusCode && (globals.statusCode && globals.statusCode[f.status] && globals.statusCode[f.status](f), i.statusCode[f.status] && i.statusCode[f.status](f)), n("complete", f, f.status)
            }, f.onerror = function() { m && clearTimeout(m), n("error", f, f.status), n("complete", f, "error") }, 0 < i.timeout && (f.onabort = function() { m && clearTimeout(m) }, m = setTimeout(function() { f.abort(), n("error", f, "timeout"), n("complete", f, "timeout") }, i.timeout)), !1 === n("beforeSend", f, i) ? f : (f.send(v), f)
        }
    }

    function RequestShortcut(e) {
        for (var t, a, n = [], r = arguments.length - 1; 0 < r--;) n[r] = arguments[r + 1];
        var i = [],
            o = i[0],
            s = i[1],
            l = i[2],
            p = i[3],
            c = i[4];
        c = "function" == typeof n[1] ? (o = (t = n)[0], l = t[1], p = t[2], t[3]) : (o = (a = n)[0], s = a[1], l = a[2], p = a[3], a[4]), [l, p].forEach(function(e) { "string" == typeof e && ((c = e) === l ? l = void 0 : p = void 0) });
        var d = { url: o, method: "post" === e || "postJSON" === e ? "POST" : "GET", data: s, success: l, error: p, dataType: c = c || ("json" === e || "postJSON" === e ? "json" : void 0) };
        return "postJSON" === e && Utils.extend(d, { contentType: "application/json", processData: !1, crossDomain: !0, data: "string" == typeof s ? s : JSON.stringify(s) }), Request(d)
    }
    Request.get = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return RequestShortcut.apply(void 0, ["get"].concat(e)) }, Request.post = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return RequestShortcut.apply(void 0, ["post"].concat(e)) }, Request.json = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return RequestShortcut.apply(void 0, ["json"].concat(e)) }, Request.getJSON = Request.json, Request.postJSON = function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return RequestShortcut.apply(void 0, ["postJSON"].concat(e)) }, Request.setup = function(e) { e.type && !e.method && Utils.extend(e, { method: e.type }), Utils.extend(globals, e) };
    var RequestModule = { name: "request", proto: { request: Request }, static: { request: Request } };

    function initTouch() {
        var s, l, p, c, d, u, h, f, m, v, g, b, y, w, C, n, t, a, o = this,
            x = o.params.touch,
            E = "md" === o.theme && x.materialRipple;

        function k(e) {
            var t, a = $(e),
                n = a.parents(x.activeStateElements);
            return a.is(x.activeStateElements) && (t = a), 0 < n.length && (t = t ? t.add(n) : n), t || a
        }

        function S(e) { var t = e.parents(".page-content, .panel"); return 0 !== t.length && ("yes" !== t.prop("scrollHandlerSet") && (t.on("scroll", function() { clearTimeout(y), clearTimeout(a) }), t.prop("scrollHandlerSet", "yes")), !0) }

        function T() { b && b.addClass("active-state") }

        function M() { b && (b.removeClass("active-state"), b = null) }

        function r(e, t, a) { e && (n = o.touchRipple.create(e, t, a)) }

        function e() { n && (n.remove(), t = n = void 0) }

        function P(e) {
            (t = function(e) {
                var t = x.materialRippleElements,
                    a = $(e);
                if (a.is(t)) return !a.hasClass("no-ripple") && a;
                if (0 < a.parents(t).length) { var n = a.parents(t).eq(0); return !n.hasClass("no-ripple") && n }
                return !1
            }(e)) && 0 !== t.length ? S(t) ? a = setTimeout(function() { r(t, s, l) }, 80) : r(t, s, l) : t = void 0
        }

        function i() { clearTimeout(a), e() }

        function O() { n ? e() : t && !m ? (clearTimeout(a), r(t, s, l), setTimeout(e, 0)) : e() }

        function D(e, t) { o.emit({ events: e, data: [t] }) }

        function I(e) { D("touchstart touchstart:active", e) }

        function A(e) { D("touchmove touchmove:active", e) }

        function B(e) { D("touchend touchend:active", e) }

        function L(e) { D("touchstart:passive", e) }

        function R(e) { D("touchmove:passive", e) }

        function z(e) { D("touchend:passive", e) }
        Device.ios && Device.webView && win.addEventListener("touchstart", function() {});
        var H = !!Support.passiveListener && { passive: !0 },
            U = !!Support.passiveListener && { passive: !1 };
        doc.addEventListener("click", function(e) { D("click", e) }, !0), Support.passiveListener ? (doc.addEventListener(o.touchEvents.start, I, U), doc.addEventListener(o.touchEvents.move, A, U), doc.addEventListener(o.touchEvents.end, B, U), doc.addEventListener(o.touchEvents.start, L, H), doc.addEventListener(o.touchEvents.move, R, H), doc.addEventListener(o.touchEvents.end, z, H)) : (doc.addEventListener(o.touchEvents.start, function(e) { I(e), L(e) }, !1), doc.addEventListener(o.touchEvents.move, function(e) { A(e), R(e) }, !1), doc.addEventListener(o.touchEvents.end, function(e) { B(e), z(e) }, !1)), Support.touch ? (o.on("click", function(e) { var t, a, n, r, i = !1; return d ? (c = null, !(d = !1)) : "submit" === e.target.type && 0 === e.detail || "file" === e.target.type || (c || (t = e.target, a = "input select textarea label".split(" "), t.nodeName && 0 <= a.indexOf(t.nodeName.toLowerCase()) || (i = !0)), w || (i = !0), doc.activeElement === c && (i = !0), e.forwardedTouchEvent && (i = !0), e.cancelable || (i = !0), x.tapHold && x.tapHoldPreventClicks && v && (i = !1), i || (e.stopImmediatePropagation(), e.stopPropagation(), c ? (n = $(c), r = !0, (n.is("label") || 0 < n.parents("label").length) && (r = !Device.android && !(!Device.ios || !n.is("input"))), (r || m) && e.preventDefault()) : e.preventDefault(), c = null), C = setTimeout(function() { w = !1 }, Device.ios || Device.androidChrome ? 100 : 400), x.tapHold && (g = setTimeout(function() { v = !1 }, Device.ios || Device.androidChrome ? 100 : 400)), i) }), o.on("touchstart", function(e) {
            var t, a, n, r, i = this;
            if (v = m = !1, 1 < e.targetTouches.length) return b && M(), !0;
            if (1 < e.touches.length && b && M(), x.tapHold && (g && clearTimeout(g), g = setTimeout(function() { e && e.touches && 1 < e.touches.length || (v = !0, e.preventDefault(), $(e.target).trigger("taphold")) }, x.tapHoldDelay)), C && clearTimeout(C), t = e.target, a = $(t), !(w = !("input" === t.nodeName.toLowerCase() && ("file" === t.type || "range" === t.type) || "select" === t.nodeName.toLowerCase() && Device.android || a.hasClass("no-fastclick") || 0 < a.parents(".no-fastclick").length || x.fastClicksExclude && 0 < a.closest(x.fastClicksExclude).length))) return !(d = !1);
            if (Device.ios || Device.android && "getSelection" in win) {
                var o = win.getSelection();
                if (o.rangeCount && o.focusNode !== doc.body && (!o.isCollapsed || doc.activeElement === o.focusNode)) return u = !0;
                u = !1
            }
            return Device.android && (n = e.target, r = "button input textarea select".split(" "), !doc.activeElement || n === doc.activeElement || doc.activeElement === doc.body || 0 <= r.indexOf(n.nodeName.toLowerCase()) || doc.activeElement.blur()), d = !0, c = e.target, p = (new Date).getTime(), s = e.targetTouches[0].pageX, l = e.targetTouches[0].pageY, Device.ios && (h = void 0, $(c).parents().each(function() {
                var e = i;
                e.scrollHeight > e.offsetHeight && !h && ((h = e).f7ScrollTop = h.scrollTop)
            })), p - f < x.fastClicksDelayBetweenClicks && e.preventDefault(), x.activeState && (S(b = k(c)) ? y = setTimeout(T, 80) : T()), E && P(c), !0
        }), o.on("touchmove", function(e) {
            if (d) {
                var t = x.fastClicksDistanceThreshold;
                if (t) {
                    var a = e.targetTouches[0].pageX,
                        n = e.targetTouches[0].pageY;
                    (Math.abs(a - s) > t || Math.abs(n - l) > t) && (m = !0)
                } else m = !0;
                m && (d = !1, m = !(c = null), x.tapHold && clearTimeout(g), x.activeState && (clearTimeout(y), M()), E && i())
            }
        }), o.on("touchend", function(e) {
            clearTimeout(y), clearTimeout(g);
            var t, a, n, r, i = (new Date).getTime();
            if (!d) return !u && w && (Device.android && !e.cancelable || !e.cancelable || e.preventDefault()), !0;
            if (doc.activeElement === e.target) return x.activeState && M(), E && O(), !0;
            if (u || e.preventDefault(), i - f < x.fastClicksDelayBetweenClicks) return setTimeout(M, 0), !0;
            if (f = i, d = !1, Device.ios && h && h.scrollTop !== h.f7ScrollTop) return !1;
            if (x.activeState && (T(), setTimeout(M, 0)), E && O(), function(e) {
                    if (doc.activeElement === e) return !1;
                    var t = e.nodeName.toLowerCase(),
                        a = "button checkbox file image radio submit".split(" ");
                    return !e.disabled && !e.readOnly && ("textarea" === t || ("select" === t ? !Device.android : "input" === t && a.indexOf(e.type) < 0))
                }(c)) {
                if (Device.ios && Device.webView) return c.focus(), !1;
                c.focus()
            }
            return doc.activeElement && c !== doc.activeElement && doc.activeElement !== doc.body && "label" !== c.nodeName.toLowerCase() && doc.activeElement.blur(), e.preventDefault(), x.tapHoldPreventClicks && v || (a = (t = e).changedTouches[0], n = doc.createEvent("MouseEvents"), r = "click", Device.android && "select" === c.nodeName.toLowerCase() && (r = "mousedown"), n.initMouseEvent(r, !0, !0, win, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, o.device.ios && win.navigator.standalone ? setTimeout(function() {
                (c = doc.elementFromPoint(t.changedTouches[0].clientX, t.changedTouches[0].clientY)).dispatchEvent(n)
            }, 10) : c.dispatchEvent(n)), !1
        }), doc.addEventListener("touchcancel", function() { d = !1, c = null, clearTimeout(y), clearTimeout(g), x.activeState && M(), E && O() }, { passive: !0 })) : x.activeState && (o.on("touchstart", function(e) { k(e.target).addClass("active-state"), "which" in e && 3 === e.which && setTimeout(function() { $(".active-state").removeClass("active-state") }, 0), E && (s = e.pageX, l = e.pageY, P(e.target, e.pageX, e.pageY)) }), o.on("touchmove", function() { $(".active-state").removeClass("active-state"), E && i() }), o.on("touchend", function() { $(".active-state").removeClass("active-state"), E && O() })), doc.addEventListener("contextmenu", function(e) { x.disableContextMenu && (Device.ios || Device.android || Device.cordova) && e.preventDefault(), E && (b && M(), O()) })
    }
    var TouchModule = { name: "touch", params: { touch: { fastClicks: !0, fastClicksDistanceThreshold: 10, fastClicksDelayBetweenClicks: 50, fastClicksExclude: "", disableContextMenu: !0, tapHold: !1, tapHoldDelay: 750, tapHoldPreventClicks: !0, activeState: !0, activeStateElements: "a, button, label, span, .actions-button, .stepper-button, .stepper-button-plus, .stepper-button-minus", materialRipple: !0, materialRippleElements: ".ripple, .link, .item-link, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell:not(.input-cell), .notification-close-button, .stepper-button, .stepper-button-minus, .stepper-button-plus" } }, instance: { touchEvents: { start: Support.touch ? "touchstart" : "mousedown", move: Support.touch ? "touchmove" : "mousemove", end: Support.touch ? "touchend" : "mouseup" } }, on: { init: initTouch } },
        pathToRegexp_1 = pathToRegexp,
        parse_1 = parse,
        compile_1 = compile,
        tokensToFunction_1 = tokensToFunction,
        tokensToRegExp_1 = tokensToRegExp,
        DEFAULT_DELIMITER = "/",
        DEFAULT_DELIMITERS = "./",
        PATH_REGEXP = new RegExp(["(\\\\.)", "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"), "g");

    function parse(e, t) {
        for (var a, n = [], r = 0, i = 0, o = "", s = t && t.delimiter || DEFAULT_DELIMITER, l = t && t.delimiters || DEFAULT_DELIMITERS, p = !1; null !== (a = PATH_REGEXP.exec(e));) {
            var c = a[0],
                d = a[1],
                u = a.index;
            if (o += e.slice(i, u), i = u + c.length, d) o += d[1], p = !0;
            else {
                var h = "",
                    f = e[i],
                    m = a[2],
                    v = a[3],
                    g = a[4],
                    b = a[5];
                if (!p && o.length) { var y = o.length - 1; - 1 < l.indexOf(o[y]) && (h = o[y], o = o.slice(0, y)) }
                o && (n.push(o), o = "", p = !1);
                var w = "" !== h && void 0 !== f && f !== h,
                    C = "+" === b || "*" === b,
                    x = "?" === b || "*" === b,
                    $ = h || s,
                    E = v || g;
                n.push({ name: m || r++, prefix: h, delimiter: $, optional: x, repeat: C, partial: w, pattern: E ? escapeGroup(E) : "[^" + escapeString($) + "]+?" })
            }
        }
        return (o || i < e.length) && n.push(o + e.substr(i)), n
    }

    function compile(e, t) { return tokensToFunction(parse(e, t)) }

    function tokensToFunction(p) {
        for (var c = new Array(p.length), e = 0; e < p.length; e++) "object" == typeof p[e] && (c[e] = new RegExp("^(?:" + p[e].pattern + ")$"));
        return function(e, t) {
            for (var a = "", n = t && t.encode || encodeURIComponent, r = 0; r < p.length; r++) {
                var i = p[r];
                if ("string" != typeof i) {
                    var o, s = e ? e[i.name] : void 0;
                    if (Array.isArray(s)) {
                        if (!i.repeat) throw new TypeError('Expected "' + i.name + '" to not repeat, but got array');
                        if (0 === s.length) { if (i.optional) continue; throw new TypeError('Expected "' + i.name + '" to not be empty') }
                        for (var l = 0; l < s.length; l++) {
                            if (o = n(s[l], i), !c[r].test(o)) throw new TypeError('Expected all "' + i.name + '" to match "' + i.pattern + '"');
                            a += (0 === l ? i.prefix : i.delimiter) + o
                        }
                    } else if ("string" != typeof s && "number" != typeof s && "boolean" != typeof s) {
                        if (!i.optional) throw new TypeError('Expected "' + i.name + '" to be ' + (i.repeat ? "an array" : "a string"));
                        i.partial && (a += i.prefix)
                    } else {
                        if (o = n(String(s), i), !c[r].test(o)) throw new TypeError('Expected "' + i.name + '" to match "' + i.pattern + '", but got "' + o + '"');
                        a += i.prefix + o
                    }
                } else a += i
            }
            return a
        }
    }

    function escapeString(e) { return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1") }

    function escapeGroup(e) { return e.replace(/([=!:$/()])/g, "\\$1") }

    function flags(e) { return e && e.sensitive ? "" : "i" }

    function regexpToRegexp(e, t) {
        if (!t) return e;
        var a = e.source.match(/\((?!\?)/g);
        if (a)
            for (var n = 0; n < a.length; n++) t.push({ name: n, prefix: null, delimiter: null, optional: !1, repeat: !1, partial: !1, pattern: null });
        return e
    }

    function arrayToRegexp(e, t, a) { for (var n = [], r = 0; r < e.length; r++) n.push(pathToRegexp(e[r], t, a).source); return new RegExp("(?:" + n.join("|") + ")", flags(a)) }

    function stringToRegexp(e, t, a) { return tokensToRegExp(parse(e, a), t, a) }

    function tokensToRegExp(e, t, a) {
        for (var n = (a = a || {}).strict, r = !1 !== a.start, i = !1 !== a.end, o = escapeString(a.delimiter || DEFAULT_DELIMITER), s = a.delimiters || DEFAULT_DELIMITERS, l = [].concat(a.endsWith || []).map(escapeString).concat("$").join("|"), p = r ? "^" : "", c = 0 === e.length, d = 0; d < e.length; d++) {
            var u = e[d];
            if ("string" == typeof u) p += escapeString(u), c = d === e.length - 1 && -1 < s.indexOf(u[u.length - 1]);
            else {
                var h = u.repeat ? "(?:" + u.pattern + ")(?:" + escapeString(u.delimiter) + "(?:" + u.pattern + "))*" : u.pattern;
                t && t.push(u), u.optional ? u.partial ? p += escapeString(u.prefix) + "(" + h + ")?" : p += "(?:" + escapeString(u.prefix) + "(" + h + "))?" : p += escapeString(u.prefix) + "(" + h + ")"
            }
        }
        return i ? (n || (p += "(?:" + o + ")?"), p += "$" === l ? "$" : "(?=" + l + ")") : (n || (p += "(?:" + o + "(?=" + l + "))?"), c || (p += "(?=" + o + "|" + l + ")")), new RegExp(p, flags(a))
    }

    function pathToRegexp(e, t, a) { return e instanceof RegExp ? regexpToRegexp(e, t) : Array.isArray(e) ? arrayToRegexp(e, t, a) : stringToRegexp(e, t, a) }
    pathToRegexp_1.parse = parse_1, pathToRegexp_1.compile = compile_1, pathToRegexp_1.tokensToFunction = tokensToFunction_1, pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;
    var History = {
        queue: [],
        clearQueue: function() { 0 !== History.queue.length && History.queue.shift()() },
        routerQueue: [],
        clearRouterQueue: function() {
            if (0 !== History.routerQueue.length) {
                var e = History.routerQueue.pop(),
                    t = e.router,
                    a = e.stateUrl,
                    n = e.action,
                    r = t.params.animate;
                !1 === t.params.pushStateAnimate && (r = !1), "back" === n && t.back({ animate: r, pushState: !1 }), "load" === n && t.navigate(a, { animate: r, pushState: !1 })
            }
        },
        handle: function(e) {
            if (!History.blockPopstate) {
                var i = e.state;
                History.previousState = History.state, History.state = i, History.allowChange = !0, History.clearQueue(), (i = History.state) || (i = {}), this.views.forEach(function(e) {
                    var t = e.router,
                        a = i[e.id];
                    if (!a && e.params.pushState && (a = { url: e.router.history[0] }), a) {
                        var n = a.url || void 0,
                            r = t.params.animate;
                        !1 === t.params.pushStateAnimate && (r = !1), n !== t.url && (0 <= t.history.indexOf(n) ? t.allowPageChange ? t.back({ animate: r, pushState: !1 }) : History.routerQueue.push({ action: "back", router: t }) : t.allowPageChange ? t.navigate(n, { animate: r, pushState: !1 }) : History.routerQueue.unshift({ action: "load", stateUrl: n, router: t }))
                    }
                })
            }
        },
        initViewState: function(e, t) {
            var a, n = Utils.extend({}, History.state || {}, ((a = {})[e] = t, a));
            History.state = n, win.history.replaceState(n, "")
        },
        push: function(e, t, a) {
            var n;
            if (History.allowChange) {
                History.previousState = History.state;
                var r = Utils.extend({}, History.previousState || {}, ((n = {})[e] = t, n));
                History.state = r, win.history.pushState(r, "", a)
            } else History.queue.push(function() { History.push(e, t, a) })
        },
        replace: function(e, t, a) {
            var n;
            if (History.allowChange) {
                History.previousState = History.state;
                var r = Utils.extend({}, History.previousState || {}, ((n = {})[e] = t, n));
                History.state = r, win.history.replaceState(r, "", a)
            } else History.queue.push(function() { History.replace(e, t, a) })
        },
        go: function(e) { History.allowChange = !1, win.history.go(e) },
        back: function() { History.allowChange = !1, win.history.back() },
        allowChange: !0,
        previousState: {},
        state: win.history.state,
        blockPopstate: !0,
        init: function(e) { $(win).on("load", function() { setTimeout(function() { History.blockPopstate = !1 }, 0) }), doc.readyState && "complete" === doc.readyState && (History.blockPopstate = !1), $(win).on("popstate", History.handle.bind(e)) }
    };

    function SwipeBack(e) {
        var d, u, h, a, f, m, v, g, b, y, w, C, x, E, t, k = e,
            S = k.$el,
            T = k.$navbarEl,
            M = k.app,
            P = k.params,
            O = !1,
            D = !1,
            I = {},
            A = [],
            B = [],
            n = !0,
            L = [],
            R = [],
            z = P[M.theme + "SwipeBackAnimateShadow"],
            H = P[M.theme + "SwipeBackAnimateOpacity"],
            U = P[M.theme + "SwipeBackActiveArea"],
            N = P[M.theme + "SwipeBackThreshold"];

        function r(e) { var t = P[M.theme + "SwipeBack"];!n || !t || O || M.swipeout && M.swipeout.el || !k.allowPageChange || 0 < $(e.target).closest(".range-slider, .calendar-months").length || (O = !(D = !1), d = void 0, I.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, I.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, a = Utils.now(), y = k.dynamicNavbar, w = k.separateNavbar) }

        function i(e) {
            if (O) {
                var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                    a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                if (void 0 === d && (d = !!(d || Math.abs(a - I.y) > Math.abs(t - I.x)) || t < I.x && !M.rtl || t > I.x && M.rtl), d || e.f7PreventSwipeBack || M.preventSwipeBack) O = !1;
                else {
                    if (!D) {
                        var n = !1,
                            r = $(e.target),
                            i = r.closest(".swipeout");
                        0 < i.length && (!M.rtl && 0 < i.find(".swipeout-actions-left").length && (n = !0), M.rtl && 0 < i.find(".swipeout-actions-right").length && (n = !0)), ((A = r.closest(".page")).hasClass("no-swipeback") || 0 < r.closest(".no-swipeback").length) && (n = !0), B = S.find(".page-previous:not(.stacked)");
                        I.x, S.offset().left;
                        if (u = S.width(), (M.rtl ? I.x < S.offset().left - S[0].scrollLeft + (u - U) : I.x - S.offset().left > U) && (n = !0), 0 !== B.length && 0 !== A.length || (n = !0), n) return void(O = !1);
                        z && 0 === (C = A.find(".page-shadow-effect")).length && (C = $('<div class="page-shadow-effect"></div>'), A.append(C)), H && 0 === (x = B.find(".page-opacity-effect")).length && (x = $('<div class="page-opacity-effect"></div>'), B.append(x)), y && (R = w ? (L = T.find(".navbar-current:not(.stacked)"), T.find(".navbar-previous:not(.stacked)")) : (L = A.children(".navbar").children(".navbar-inner"), B.children(".navbar").children(".navbar-inner")), E = T[0].offsetWidth, f = L.children(".left, .title, .right, .subnavbar, .fading"), m = R.children(".left, .title, .right, .subnavbar, .fading"), P.iosAnimateNavbarBackIcon && (g = L.hasClass("sliding") ? (v = L.children(".left").find(".back .icon"), L.children(".left").find(".back span").eq(0)) : (v = L.children(".left.sliding").find(".back .icon"), L.children(".left.sliding").find(".back span").eq(0)), b = R.hasClass("sliding") ? R.children(".left").find(".back .icon") : R.children(".left.sliding").find(".back .icon"))), 0 < $(".sheet.modal-in").length && M.sheet && M.sheet.close($(".sheet.modal-in"))
                    }
                    e.f7PreventPanelSwipe = !0, D = !0, M.preventSwipePanelBySwipeBack = !0, e.preventDefault();
                    var o = M.rtl ? -1 : 1;
                    (h = (t - I.x - N) * o) < 0 && (h = 0);
                    var s = h / u,
                        l = { percentage: s, currentPageEl: A[0], previousPageEl: B[0], currentNavbarEl: L[0], previousNavbarEl: R[0] };
                    S.trigger("swipeback:move", l), k.emit("swipebackMove", l);
                    var p = h * o,
                        c = (h / 5 - u / 5) * o;
                    1 === Device.pixelRatio && (p = Math.round(p), c = Math.round(c)), k.swipeBackActive = !0, $([A[0], B[0]]).addClass("page-swipeback-active"), A.transform("translate3d(" + p + "px,0,0)"), z && (C[0].style.opacity = 1 - 1 * s), "md" !== M.theme && B.transform("translate3d(" + c + "px,0,0)"), H && (x[0].style.opacity = 1 - 1 * s), y && (f.each(function(e, t) {
                        var a = $(t);
                        if (a.is(".subnavbar") || (a[0].style.opacity = 1 - Math.pow(s, .33)), 0 <= a[0].className.indexOf("sliding") || L.hasClass("sliding")) {
                            var n = s * a[0].f7NavbarRightOffset;
                            if (1 === Device.pixelRatio && (n = Math.round(n)), a.transform("translate3d(" + n + "px,0,0)"), P.iosAnimateNavbarBackIcon && 0 <= a[0].className.indexOf("left") && 0 < v.length) {
                                var r = -n;
                                w || (r -= E * s), v.transform("translate3d(" + r + "px,0,0)")
                            }
                        }
                    }), m.each(function(e, t) {
                        var a = $(t);
                        if (a.is(".subnavbar") || (a[0].style.opacity = Math.pow(s, 3)), 0 <= a[0].className.indexOf("sliding") || R.hasClass("sliding")) {
                            var n = a[0].f7NavbarLeftOffset * (1 - s);
                            if (n = 0 <= a[0].className.indexOf("title") && v && v.length && g.length ? (a[0].f7NavbarLeftOffset + g[0].offsetLeft) * (1 - s) : a[0].f7NavbarLeftOffset * (1 - s), 1 === Device.pixelRatio && (n = Math.round(n)), a.transform("translate3d(" + n + "px,0,0)"), P.iosAnimateNavbarBackIcon && 0 <= a[0].className.indexOf("left") && 0 < b.length) {
                                var r = -n;
                                w || (r += E / 5 * (1 - s)), b.transform("translate3d(" + r + "px,0,0)")
                            }
                        }
                    }))
                }
            }
        }

        function o() {
            if (M.preventSwipePanelBySwipeBack = !1, O && D) {
                if (D = O = !1, k.swipeBackActive = !1, $([A[0], B[0]]).removeClass("page-swipeback-active"), 0 === h) return $([A[0], B[0]]).transform(""), C && 0 < C.length && C.remove(), x && 0 < x.length && x.remove(), void(y && (f.transform("").css({ opacity: "" }), m.transform("").css({ opacity: "" }), v && 0 < v.length && v.transform(""), b && 0 < v.length && b.transform("")));
                var e = Utils.now() - a,
                    i = !1;
                (e < 300 && 10 < h || 300 <= e && u / 2 < h) && (A.removeClass("page-current").addClass("page-next" + ("md" === M.theme ? " page-next-on-right" : "")), B.removeClass("page-previous").addClass("page-current").removeAttr("aria-hidden"), C && (C[0].style.opacity = ""), x && (x[0].style.opacity = ""), y && (L.removeClass("navbar-current").addClass("navbar-next"), R.removeClass("navbar-previous").addClass("navbar-current").removeAttr("aria-hidden")), i = !0), $([A[0], B[0]]).addClass("page-transitioning page-transitioning-swipeback").transform(""), y && (f.css({ opacity: "" }).each(function(e, t) {
                    var a = i ? t.f7NavbarRightOffset : 0,
                        n = $(t),
                        r = i ? -a : 0;
                    !w && i && (r -= E), n.transform("translate3d(" + a + "px,0,0)"), P.iosAnimateNavbarBackIcon && n.hasClass("left") && 0 < v.length && v.addClass("navbar-transitioning").transform("translate3d(" + r + "px,0,0)")
                }).addClass("navbar-transitioning"), m.transform("").css({ opacity: "" }).each(function(e, t) {
                    var a = i ? 0 : t.f7NavbarLeftOffset,
                        n = $(t),
                        r = i ? 0 : -a;
                    w || i || (r += E / 5), n.transform("translate3d(" + a + "px,0,0)"), P.iosAnimateNavbarBackIcon && n.hasClass("left") && 0 < b.length && b.addClass("navbar-transitioning").transform("translate3d(" + r + "px,0,0)")
                }).addClass("navbar-transitioning")), n = !1, k.allowPageChange = !1;
                var t = { currentPageEl: A[0], previousPageEl: B[0], currentNavbarEl: L[0], previousNavbarEl: R[0] };
                i ? (k.currentRoute = B[0].f7Page.route, k.currentPage = B[0], k.pageCallback("beforeOut", A, L, "current", "next", { route: A[0].f7Page.route, swipeBack: !0 }), k.pageCallback("beforeIn", B, R, "previous", "current", { route: B[0].f7Page.route, swipeBack: !0 }), S.trigger("swipeback:beforechange", t), k.emit("swipebackBeforeChange", t)) : (S.trigger("swipeback:beforereset", t), k.emit("swipebackBeforeReset", t)), A.transitionEnd(function() { $([A[0], B[0]]).removeClass("page-transitioning page-transitioning-swipeback"), y && (f.removeClass("navbar-transitioning").css({ opacity: "" }).transform(""), m.removeClass("navbar-transitioning").css({ opacity: "" }).transform(""), v && 0 < v.length && v.removeClass("navbar-transitioning"), b && 0 < b.length && b.removeClass("navbar-transitioning")), n = !0, k.allowPageChange = !0, i ? (1 === k.history.length && k.history.unshift(k.url), k.history.pop(), k.saveHistory(), P.pushState && History.back(), k.pageCallback("afterOut", A, L, "current", "next", { route: A[0].f7Page.route, swipeBack: !0 }), k.pageCallback("afterIn", B, R, "previous", "current", { route: B[0].f7Page.route, swipeBack: !0 }), P.stackPages && 0 <= k.initialPages.indexOf(A[0]) ? (A.addClass("stacked"), w && L.addClass("stacked")) : (k.pageCallback("beforeRemove", A, L, "next", { swipeBack: !0 }), k.removePage(A), w && k.removeNavbar(L)), S.trigger("swipeback:afterchange", t), k.emit("swipebackAfterChange", t), k.emit("routeChanged", k.currentRoute, k.previousRoute, k), P.preloadPreviousPage && k.back(k.history[k.history.length - 2], { preload: !0 })) : (S.trigger("swipeback:afterreset", t), k.emit("swipebackAfterReset", t)), C && 0 < C.length && C.remove(), x && 0 < x.length && x.remove() })
            } else D = O = !1
        }
        t = !("touchstart" !== M.touchEvents.start || !Support.passiveListener) && { passive: !0, capture: !1 }, S.on(M.touchEvents.start, r, t), M.on("touchmove:active", i), M.on("touchend:passive", o), k.on("routerDestroy", function() {
            var e = !("touchstart" !== M.touchEvents.start || !Support.passiveListener) && { passive: !0, capture: !1 };
            S.off(M.touchEvents.start, r, e), M.off("touchmove:active", i), M.off("touchend:passive", o)
        })
    }

    function redirect(a, e, n) {
        var r = this,
            t = e.route.redirect;
        if (n.initial && r.params.pushState && (n.replaceState = !0, n.history = !0), "function" != typeof t) return r[a](t, n);
        r.allowPageChange = !1;
        var i = t.call(r, e, function(e, t) { void 0 === t && (t = {}), r.allowPageChange = !0, r[a](e, Utils.extend({}, n, t)) }, function() { r.allowPageChange = !0 });
        return i && "string" == typeof i ? (r.allowPageChange = !0, r[a](i, n)) : r
    }

    function processQueue(t, e, a, n, r, i, o) {
        var s = [];
        Array.isArray(a) ? s.push.apply(s, a) : a && "function" == typeof a && s.push(a), e && (Array.isArray(e) ? s.push.apply(s, e) : s.push(e)),
            function e() { 0 !== s.length ? s.shift().call(t, n, r, function() { e() }, function() { o() }) : i() }()
    }

    function processRouteQueue(e, t, a, n) {
        var r = this;

        function i() { e && e.route && (r.params.routesBeforeEnter || e.route.beforeEnter) ? (r.allowPageChange = !1, processQueue(r, r.params.routesBeforeEnter, e.route.beforeEnter, e, t, function() { r.allowPageChange = !0, a() }, function() { n() })) : a() }
        t && t.route && (r.params.routesBeforeLeave || t.route.beforeLeave) ? (r.allowPageChange = !1, processQueue(r, r.params.routesBeforeLeave, t.route.beforeLeave, e, t, function() { r.allowPageChange = !0, i() }, function() { n() })) : i()
    }

    function refreshPage() { return this.navigate(this.currentRoute.url, { ignoreCache: !0, reloadCurrent: !0 }) }

    function forward(e, t) {
        void 0 === t && (t = {});
        var a, r = this,
            i = r.app,
            n = r.view,
            o = Utils.extend(!1, { animate: r.params.animate, pushState: !0, replaceState: !1, history: !0, reloadCurrent: r.params.reloadPages, reloadPrevious: !1, reloadAll: !1, clearPreviousHistory: !1, on: {} }, t),
            s = r.currentRoute.modal;
        if (s || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach(function(e) { r.currentRoute && r.currentRoute.route && r.currentRoute.route[e] && (s = !0, a = e) }), s) {
            var l = r.currentRoute.modal || r.currentRoute.route.modalInstance || i[a].get(),
                p = r.history[r.history.length - 2],
                c = r.findMatchingRoute(p);
            !c && p && (c = { url: p, path: p.split("?")[0], query: Utils.parseUrlQuery(p), route: { path: p.split("?")[0], url: p } }), r.modalRemove(l)
        }
        var d, u, h, f, m = r.dynamicNavbar,
            v = r.separateNavbar,
            g = r.$el,
            b = $(e),
            y = o.reloadPrevious || o.reloadCurrent || o.reloadAll;
        if (b.length && r.removeThemeElements(b), m && (h = b.children(".navbar").children(".navbar-inner"), v && (u = r.$navbarEl, 0 < h.length && b.children(".navbar").remove(), 0 === h.length && b[0] && b[0].f7Page && (h = b[0].f7Page.$navbarEl))), r.allowPageChange = !1, 0 === b.length) return r.allowPageChange = !0, r;
        var w, C = g.children(".page:not(.stacked)").filter(function(e, t) { return t !== b[0] });
        if (v && (w = u.children(".navbar-inner:not(.stacked)").filter(function(e, t) { return t !== h[0] })), o.reloadPrevious && C.length < 2) return r.allowPageChange = !0, r;
        var x = "next";
        if (o.reloadCurrent || o.reloadAll ? x = "current" : o.reloadPrevious && (x = "previous"), b.addClass("page-" + x).removeClass("stacked").trigger("page:unstack").trigger("page:position", { position: x }), m && h.length && h.addClass("navbar-" + x).removeClass("stacked"), o.reloadCurrent) d = C.eq(C.length - 1), v && (f = $(i.navbar.getElByPage(d)));
        else if (o.reloadPrevious) d = C.eq(C.length - 2), v && (f = $(i.navbar.getElByPage(d)));
        else if (o.reloadAll) d = C.filter(function(e, t) { return t !== b[0] }), v && (f = w.filter(function(e, t) { return t !== h[0] }));
        else {
            if (1 < C.length) {
                var E = 0;
                for (E = 0; E < C.length - 1; E += 1) {
                    var k = i.navbar.getElByPage(C.eq(E));
                    r.params.stackPages ? (C.eq(E).addClass("stacked"), C.eq(E).trigger("page:stack"), v && $(k).addClass("stacked")) : (r.pageCallback("beforeRemove", C[E], w && w[E], "previous", void 0, o), r.removePage(C[E]), v && k && r.removeNavbar(k))
                }
            }
            d = g.children(".page:not(.stacked)").filter(function(e, t) { return t !== b[0] }), v && (f = u.children(".navbar-inner:not(.stacked)").filter(function(e, t) { return t !== h[0] }))
        }
        if (m && !v && (f = d.children(".navbar").children(".navbar-inner")), r.params.pushState && (o.pushState || o.replaceState) && !o.reloadPrevious) {
            var S = r.params.pushStateRoot || "";
            History[o.reloadCurrent || o.reloadAll || o.replaceState ? "replace" : "push"](n.id, { url: o.route.url }, S + r.params.pushStateSeparator + o.route.url)
        }
        o.reloadPrevious || (r.currentPageEl = b[0], m && h.length ? r.currentNavbarEl = h[0] : delete r.currentNavbarEl, r.currentRoute = o.route);
        var T = o.route.url;
        o.history && (0 < (o.reloadCurrent && r.history.length) || o.replaceState ? r.history[r.history.length - (o.reloadPrevious ? 2 : 1)] = T : o.reloadPrevious ? r.history[r.history.length - 2] = T : o.reloadAll ? r.history = [T] : r.history.push(T)), r.saveHistory();
        var M = 0 < b.parents(doc).length,
            P = b[0].f7Component;
        if (o.reloadPrevious ? (P && !M ? P.$mount(function(e) { $(e).insertBefore(d) }) : b.insertBefore(d), v && h.length && (f.length ? h.insertBefore(f) : (r.$navbarEl.parents(doc).length || r.$el.prepend(r.$navbarEl), u.append(h)))) : (d.next(".page")[0] !== b[0] && (P && !M ? P.$mount(function(e) { g.append(e) }) : g.append(b[0])), v && h.length && (r.$navbarEl.parents(doc).length || r.$el.prepend(r.$navbarEl), u.append(h[0]))), M || r.pageCallback("mounted", b, h, x, y ? x : "current", o, d), o.reloadCurrent && 0 < d.length ? r.params.stackPages && 0 <= r.initialPages.indexOf(d[0]) ? (d.addClass("stacked"), d.trigger("page:stack"), v && f.addClass("stacked")) : (r.pageCallback("beforeRemove", d, f, "previous", void 0, o), r.removePage(d), v && f && f.length && r.removeNavbar(f)) : o.reloadAll ? d.each(function(e, t) {
                var a = $(t),
                    n = $(i.navbar.getElByPage(a));
                r.params.stackPages && 0 <= r.initialPages.indexOf(a[0]) ? (a.addClass("stacked"), a.trigger("page:stack"), v && n.addClass("stacked")) : (r.pageCallback("beforeRemove", a, f && f.eq(e), "previous", void 0, o), r.removePage(a), v && n.length && r.removeNavbar(n))
            }) : o.reloadPrevious && (r.params.stackPages && 0 <= r.initialPages.indexOf(d[0]) ? (d.addClass("stacked"), d.trigger("page:stack"), v && f.addClass("stacked")) : (r.pageCallback("beforeRemove", d, f, "previous", void 0, o), r.removePage(d), v && f && f.length && r.removeNavbar(f))), o.route.route.tab && r.tabLoad(o.route.route.tab, Utils.extend({}, o, { history: !1, pushState: !1 })), r.pageCallback("init", b, h, x, y ? x : "current", o, d), o.reloadCurrent || o.reloadAll) return r.allowPageChange = !0, r.pageCallback("beforeIn", b, h, x, "current", o), r.pageCallback("afterIn", b, h, x, "current", o), o.reloadCurrent && o.clearPreviousHistory && r.clearPreviousHistory(), r;
        if (o.reloadPrevious) return r.allowPageChange = !0, r;

        function O() {
            var e = "page-previous page-current page-next",
                t = "navbar-previous navbar-current navbar-next";
            b.removeClass(e).addClass("page-current").removeAttr("aria-hidden"), d.removeClass(e).addClass("page-previous").attr("aria-hidden", "true"), m && (h.removeClass(t).addClass("navbar-current").removeAttr("aria-hidden"), f.removeClass(t).addClass("navbar-previous").attr("aria-hidden", "true")), r.allowPageChange = !0, r.pageCallback("afterIn", b, h, "next", "current", o), r.pageCallback("afterOut", d, f, "current", "previous", o);
            var a = "ios" === i.theme ? r.params.preloadPreviousPage || r.params.iosSwipeBack : r.params.preloadPreviousPage;
            a || (b.hasClass("smart-select-page") || b.hasClass("photo-browser-page") || b.hasClass("autocomplete-page")) && (a = !0), a || (r.params.stackPages ? (d.addClass("stacked"), d.trigger("page:stack"), v && f.addClass("stacked")) : b.attr("data-name") && "smart-select-page" === b.attr("data-name") || (r.pageCallback("beforeRemove", d, f, "previous", void 0, o), r.removePage(d), v && f.length && r.removeNavbar(f))), o.clearPreviousHistory && r.clearPreviousHistory(), r.emit("routeChanged", r.currentRoute, r.previousRoute, r), r.params.pushState && History.clearRouterQueue()
        }

        function D() {
            var e = "page-previous page-current page-next",
                t = "navbar-previous navbar-current navbar-next";
            d.removeClass(e).addClass("page-current").removeAttr("aria-hidden"), b.removeClass(e).addClass("page-next").removeAttr("aria-hidden"), m && (f.removeClass(t).addClass("navbar-current").removeAttr("aria-hidden"), h.removeClass(t).addClass("navbar-next").removeAttr("aria-hidden"))
        }
        if (r.pageCallback("beforeIn", b, h, "next", "current", o), r.pageCallback("beforeOut", d, f, "current", "previous", o), o.animate) {
            var I = "md" === r.app.theme ? r.params.materialPageLoadDelay : r.params.iosPageLoadDelay;
            I ? setTimeout(function() { D(), r.animate(d, b, f, h, "forward", function() { O() }) }, I) : (D(), r.animate(d, b, f, h, "forward", function() { O() }))
        } else O();
        return r
    }

    function load(e, t, a) {
        void 0 === e && (e = {}), void 0 === t && (t = {});
        var n = this;
        if (!n.allowPageChange && !a) return n;
        var r = e,
            i = t,
            o = r.url,
            s = r.content,
            l = r.el,
            p = r.pageName,
            c = r.template,
            d = r.templateUrl,
            u = r.component,
            h = r.componentUrl;
        if (!i.reloadCurrent && i.route && i.route.route && i.route.route.parentPath && n.currentRoute.route && n.currentRoute.route.parentPath === i.route.route.parentPath) { if (i.route.url === n.url) return !(n.allowPageChange = !0); var f = Object.keys(i.route.params).length === Object.keys(n.currentRoute.params).length; if (f && Object.keys(i.route.params).forEach(function(e) { e in n.currentRoute.params && n.currentRoute.params[e] === i.route.params[e] || (f = !1) }), f) return !!i.route.route.tab && n.tabLoad(i.route.route.tab, i) }
        if (i.route && i.route.url && n.url === i.route.url && !i.reloadCurrent && !i.reloadPrevious && !n.params.allowDuplicateUrls) return !(n.allowPageChange = !0);

        function m(e, t) { return n.forward(e, Utils.extend(i, t)) }

        function v() { return n.allowPageChange = !0, n }
        if (!i.route && o && (i.route = n.parseRouteUrl(o), Utils.extend(i.route, { route: { url: o, path: o } })), (o || d || h) && (n.allowPageChange = !1), s) n.forward(n.getPageEl(s), i);
        else if (c || d) try { n.pageTemplateLoader(c, d, i, m, v) } catch (e) { throw n.allowPageChange = !0, e } else if (l) n.forward(n.getPageEl(l), i);
            else if (p) n.forward(n.$el.children('.page[data-name="' + p + '"]').eq(0), i);
        else if (u || h) try { n.pageComponentLoader(n.el, u, h, i, m, v) } catch (e) { throw n.allowPageChange = !0, e } else o && (n.xhr && (n.xhr.abort(), n.xhr = !1), n.xhrRequest(o, i).then(function(e) { n.forward(n.getPageEl(e), i) }).catch(function() { n.allowPageChange = !0 }));
        return n
    }

    function navigate(e, t) {
        void 0 === t && (t = {});
        var a, n, r, i, o, s, l = this;
        if (l.swipeBackActive) return l;
        if ("string" == typeof e ? a = e : (a = e.url, n = e.route, r = e.name, i = e.query, o = e.params), r) { if (!(s = l.findRouteByKey("name", r))) throw new Error('Framework7: route with name "' + r + '" not found'); if (a = l.constructRouteUrl(s, { params: o, query: i })) return l.navigate(a, t); throw new Error("Framework7: can't construct URL for route with name \"" + r + '"') }
        var p = l.app;
        if (!l.view) return p.views.main && p.views.main.router.navigate(a, t), l;
        if ("#" === a || "" === a) return l;
        var c = a.replace("./", "");
        if ("/" !== c[0] && 0 !== c.indexOf("#")) {
            var d = l.currentRoute.parentPath || l.currentRoute.path;
            c = ((d ? d + "/" : "/") + c).replace("///", "/").replace("//", "/")
        }
        if (!(s = n ? Utils.extend(l.parseRouteUrl(c), { route: Utils.extend({}, n) }) : l.findMatchingRoute(c))) return l;
        if (s.route.redirect) return redirect.call(l, "navigate", s, t);
        var u = {};

        function h() {
            var a = !1;
            "popup popover sheet loginScreen actions customModal panel".split(" ").forEach(function(e) { s.route[e] && !a && (a = !0, l.modalLoad(e, s, u)) }), "url content component pageName el componentUrl template templateUrl".split(" ").forEach(function(e) {
                var t;
                s.route[e] && !a && (a = !0, l.load(((t = {})[e] = s.route[e], t), u))
            }), a || s.route.async && (l.allowPageChange = !1, s.route.async.call(l, u.route, l.currentRoute, function(a, n) {
                var r = l.allowPageChange = !1;
                n && n.context && (s.context ? s.context = Utils.extend({}, s.context, n.context) : s.context = n.context, u.route.context = s.context), "popup popover sheet loginScreen actions customModal panel".split(" ").forEach(function(e) {
                    if (a[e]) {
                        r = !0;
                        var t = Utils.extend({}, s, { route: a });
                        l.allowPageChange = !0, l.modalLoad(e, t, Utils.extend(u, n))
                    }
                }), r || l.load(a, Utils.extend(u, n), !0)
            }, function() { l.allowPageChange = !0 }))
        }

        function f() { l.allowPageChange = !0 }
        return s.route.options ? Utils.extend(u, s.route.options, t, { route: s }) : Utils.extend(u, t, { route: s }), u && u.context && (s.context = u.context, u.route.context = u.context), processRouteQueue.call(l, s, l.currentRoute, function() { s.route.modules ? p.loadModules(Array.isArray(s.route.modules) ? s.route.modules : [s.route.modules]).then(function() { h() }).catch(function() { f() }) : h() }, function() { f() }), l
    }

    function tabLoad(d, e) {
        void 0 === e && (e = {});
        var t, a, u = this,
            n = Utils.extend({ animate: u.params.animate, pushState: !0, history: !0, parentPageEl: null, preload: !1, on: {} }, e);
        n.route && (n.preload || n.route === u.currentRoute || (a = u.previousRoute, u.currentRoute = n.route), n.preload ? (t = n.route, a = u.currentRoute) : (t = u.currentRoute, a || (a = u.previousRoute)), u.params.pushState && n.pushState && !n.reloadPrevious && History.replace(u.view.id, { url: n.route.url }, (u.params.pushStateRoot || "") + u.params.pushStateSeparator + n.route.url), n.history && (u.history[Math.max(u.history.length - 1, 0)] = n.route.url, u.saveHistory()));
        var r, i = $(n.parentPageEl || u.currentPageEl);
        r = i.length && i.find("#" + d.id).length ? i.find("#" + d.id).eq(0) : u.view.selector ? u.view.selector + " #" + d.id : "#" + d.id;
        var o = u.app.tab.show({ tabEl: r, animate: n.animate, tabRoute: n.route }),
            h = o.$newTabEl,
            f = o.$oldTabEl,
            m = o.animated,
            v = o.onTabsChanged;
        if (h && 0 < h.parents(".page").length && n.route) {
            var s = h.parents(".page")[0].f7Page;
            s && n.route && (s.route = n.route)
        }
        if (h[0].f7RouterTabLoaded) return f && f.length && (m ? v(function() { u.emit("routeChanged", u.currentRoute, u.previousRoute, u) }) : u.emit("routeChanged", u.currentRoute, u.previousRoute, u)), u;

        function l(e, t) {
            var a = e.url,
                n = e.content,
                r = e.el,
                i = e.template,
                o = e.templateUrl,
                s = e.component,
                l = e.componentUrl;

            function p(e) { u.allowPageChange = !0, e && ("string" == typeof e ? h.html(e) : (h.html(""), e.f7Component ? e.f7Component.$mount(function(e) { h.append(e) }) : h.append(e)), h[0].f7RouterTabLoaded = !0, function(e) { u.removeThemeElements(h); var t = h; "string" != typeof e && (t = $(e)), t.trigger("tab:init tab:mounted", d), u.emit("tabInit tabMounted", h[0], d), f && f.length && (m ? v(function() { u.emit("routeChanged", u.currentRoute, u.previousRoute, u), u.params.unloadTabContent && u.tabRemove(f, h, d) }) : (u.emit("routeChanged", u.currentRoute, u.previousRoute, u), u.params.unloadTabContent && u.tabRemove(f, h, d))) }(e)) }

            function c() { return u.allowPageChange = !0, u }
            if (n) p(n);
            else if (i || o) try { u.tabTemplateLoader(i, o, t, p, c) } catch (e) { throw u.allowPageChange = !0, e } else if (r) p(r);
                else if (s || l) try { u.tabComponentLoader(h[0], s, l, t, p, c) } catch (e) { throw u.allowPageChange = !0, e } else a && (u.xhr && (u.xhr.abort(), u.xhr = !1), u.xhrRequest(a, t).then(function(e) { p(e) }).catch(function() { u.allowPageChange = !0 }))
        }
        return "url content component el componentUrl template templateUrl".split(" ").forEach(function(e) {
            var t;
            d[e] && l(((t = {})[e] = d[e], t), n)
        }), d.async && d.async.call(u, t, a, function(e, t) { l(e, Utils.extend(n, t)) }, function() { u.allowPageChange = !0 }), u
    }

    function tabRemove(e, t, a) {
        var n;
        e[0] && (e[0].f7RouterTabLoaded = !1, delete e[0].f7RouterTabLoaded), e.children().each(function(e, t) { t.f7Component && (n = !0, $(t).trigger("tab:beforeremove", a), t.f7Component.$destroy()) }), n || e.trigger("tab:beforeremove", a), this.emit("tabBeforeRemove", e[0], t[0], a), this.removeTabContent(e[0], a)
    }

    function modalLoad(n, r, e) {
        void 0 === e && (e = {});
        var a, c = this,
            d = c.app,
            i = "panel" === n,
            o = i ? "panel" : "modal",
            s = Utils.extend({ animate: c.params.animate, pushState: !0, history: !0, on: {} }, e),
            u = Utils.extend({}, r.route[n]),
            l = r.route;

        function h() {
            var t = d[n].create(u),
                e = (l.modalInstance = t).el;

            function a() { t.close() }
            t.on(o + "Open", function() { e || (c.removeThemeElements(t.el), t.$el.trigger(n.toLowerCase() + ":init " + n.toLowerCase() + ":mounted", r, t), c.emit((i ? "" : "modalInit") + " " + n + "Init " + n + "Mounted", t.el, r, t)), c.once("swipeBackMove", a) }), t.on(o + "Close", function() { c.off("swipeBackMove", a), t.closeByRouter || c.back() }), t.on(o + "Closed", function() {
                t.$el.trigger(n.toLowerCase() + ":beforeremove", r, t), t.emit((i ? "" : "modalBeforeRemove ") + n + "BeforeRemove", t.el, r, t);
                var e = t.el.f7Component;
                e && e.$destroy(), Utils.nextTick(function() {
                    (e || u.component) && c.removeModal(t.el), t.destroy(), delete t.route, delete l.modalInstance
                })
            }), s.route && (c.params.pushState && s.pushState && History.push(c.view.id, { url: s.route.url, modal: n }, (c.params.pushStateRoot || "") + c.params.pushStateSeparator + s.route.url), s.route !== c.currentRoute && (t.route = Utils.extend(s.route, { modal: t }), c.currentRoute = t.route), s.history && (c.history.push(s.route.url), c.saveHistory())), e && (c.removeThemeElements(t.el), t.$el.trigger(n.toLowerCase() + ":init " + n.toLowerCase() + ":mounted", r, t), c.emit(o + "Init " + n + "Init " + n + "Mounted", t.el, r, t)), t.open()
        }

        function p(e, t) {
            var a = e.url,
                n = e.content,
                r = e.template,
                i = e.templateUrl,
                o = e.component,
                s = e.componentUrl;

            function l(e) { e && ("string" == typeof e ? u.content = e : e.f7Component ? e.f7Component.$mount(function(e) { u.el = e, d.root.append(e) }) : u.el = e, h()) }

            function p() { return c.allowPageChange = !0, c }
            if (n) l(n);
            else if (r || i) try { c.modalTemplateLoader(r, i, t, l, p) } catch (e) { throw c.allowPageChange = !0, e } else if (o || s) try { c.modalComponentLoader(d.root[0], o, s, t, l, p) } catch (e) { throw c.allowPageChange = !0, e } else a ? (c.xhr && (c.xhr.abort(), c.xhr = !1), c.xhrRequest(a, t).then(function(e) { u.content = e, h() }).catch(function() { c.allowPageChange = !0 })) : h()
        }
        return "url content component el componentUrl template templateUrl".split(" ").forEach(function(e) {
            var t;
            u[e] && !a && (a = !0, p(((t = {})[e] = u[e], t), s))
        }), a || "actions" !== n || h(), u.async && u.async.call(c, s.route, c.currentRoute, function(e, t) { p(e, Utils.extend(s, t)) }, function() { c.allowPageChange = !0 }), c
    }

    function modalRemove(e) { Utils.extend(e, { closeByRouter: !0 }), e.close() }

    function backward(e, t) {
        var a, n, r, i, o = this,
            s = o.app,
            l = o.view,
            p = Utils.extend({ animate: o.params.animate, pushState: !0 }, t),
            c = o.dynamicNavbar,
            d = o.separateNavbar,
            u = $(e),
            h = o.$el.children(".page-current");
        if (u.length && o.removeThemeElements(u), c && (n = u.children(".navbar").children(".navbar-inner"), r = d ? (a = o.$navbarEl, 0 < n.length && u.children(".navbar").remove(), 0 === n.length && u[0] && u[0].f7Page && (n = u[0].f7Page.$navbarEl), a.find(".navbar-current")) : h.children(".navbar").children(".navbar-inner")), o.allowPageChange = !1, 0 === u.length || 0 === h.length) return o.allowPageChange = !0, o;
        if (o.removeThemeElements(u), u.addClass("page-previous").removeClass("stacked").removeAttr("aria-hidden").trigger("page:unstack").trigger("page:position", { position: "previous" }), c && 0 < n.length && n.addClass("navbar-previous").removeClass("stacked").removeAttr("aria-hidden"), p.force && (0 < h.prev(".page-previous:not(.stacked)").length || 0 === h.prev(".page-previous").length))
            if (0 <= o.history.indexOf(p.route.url) ? (i = o.history.length - o.history.indexOf(p.route.url) - 1, o.history = o.history.slice(0, o.history.indexOf(p.route.url) + 2), l.history = o.history) : o.history[[o.history.length - 2]] ? o.history[o.history.length - 2] = p.route.url : o.history.unshift(o.url), i && o.params.stackPages) h.prevAll(".page-previous").each(function(e, t) {
                var a, n = $(t);
                d && (a = $(s.navbar.getElByPage(n))), n[0] !== u[0] && n.index() > u.index() && (0 <= o.initialPages.indexOf(n[0]) ? (n.addClass("stacked"), n.trigger("page:stack"), d && a.addClass("stacked")) : (o.pageCallback("beforeRemove", n, a, "previous", void 0, p), o.removePage(n), d && 0 < a.length && o.removeNavbar(a)))
            });
            else {
                var f, m = h.prev(".page-previous:not(.stacked)");
                d && (f = $(s.navbar.getElByPage(m))), o.params.stackPages && 0 <= o.initialPages.indexOf(m[0]) ? (m.addClass("stacked"), m.trigger("page:stack"), f.addClass("stacked")) : 0 < m.length && (o.pageCallback("beforeRemove", m, f, "previous", void 0, p), o.removePage(m), d && f.length && o.removeNavbar(f))
            }
        var v, g, b = 0 < u.parents(doc).length,
            y = u[0].f7Component;

        function w() { 0 === u.next(h).length && (!b && y ? y.$mount(function(e) { $(e).insertBefore(h) }) : u.insertBefore(h)), d && n.length && (n.insertBefore(r), 0 < r.length ? n.insertBefore(r) : (o.$navbarEl.parents(doc).length || o.$el.prepend(o.$navbarEl), a.append(n))), b || o.pageCallback("mounted", u, n, "previous", "current", p, h) }
        if (p.preload) return w(), p.route.route.tab && o.tabLoad(p.route.route.tab, Utils.extend({}, p, { history: !1, pushState: !1, preload: !0 })), o.pageCallback("init", u, n, "previous", "current", p, h), 0 < u.prevAll(".page-previous:not(.stacked)").length && u.prevAll(".page-previous:not(.stacked)").each(function(e, t) {
            var a, n = $(t);
            d && (a = $(s.navbar.getElByPage(n))), o.params.stackPages && 0 <= o.initialPages.indexOf(t) ? (n.addClass("stacked"), n.trigger("page:stack"), d && a.addClass("stacked")) : (o.pageCallback("beforeRemove", n, a, "previous", void 0), o.removePage(n), d && a.length && o.removeNavbar(a))
        }), o.allowPageChange = !0, o;

        function C() {
            var e = "page-previous page-current page-next",
                t = "navbar-previous navbar-current navbar-next";
            u.removeClass(e).addClass("page-current").removeAttr("aria-hidden"), h.removeClass(e).addClass("page-next").attr("aria-hidden", "true"), c && (n.removeClass(t).addClass("navbar-current").removeAttr("aria-hidden"), r.removeClass(t).addClass("navbar-next").attr("aria-hidden", "true")), o.pageCallback("afterIn", u, n, "previous", "current", p), o.pageCallback("afterOut", h, r, "current", "next", p), o.params.stackPages && 0 <= o.initialPages.indexOf(h[0]) ? (h.addClass("stacked"), h.trigger("page:stack"), d && r.addClass("stacked")) : (o.pageCallback("beforeRemove", h, r, "next", void 0, p), o.removePage(h), d && r.length && o.removeNavbar(r)), o.allowPageChange = !0, o.emit("routeChanged", o.currentRoute, o.previousRoute, o), ("ios" === s.theme ? o.params.preloadPreviousPage || o.params.iosSwipeBack : o.params.preloadPreviousPage) && o.history[o.history.length - 2] && o.back(o.history[o.history.length - 2], { preload: !0 }), o.params.pushState && History.clearRouterQueue()
        }
        return Device.ie || Device.edge || Device.firefox && !Device.ios || o.params.pushState && p.pushState && (i ? History.go(-i) : History.back()), 1 === o.history.length && o.history.unshift(o.url), o.history.pop(), o.saveHistory(), o.currentPageEl = u[0], c && n.length ? o.currentNavbarEl = n[0] : delete o.currentNavbarEl, o.currentRoute = p.route, (Device.ie || Device.edge || Device.firefox && !Device.ios) && o.params.pushState && p.pushState && (i ? History.go(-i) : History.back()), w(), p.route.route.tab && o.tabLoad(p.route.route.tab, Utils.extend({}, p, { history: !1, pushState: !1 })), o.pageCallback("init", u, n, "previous", "current", p, h), o.pageCallback("beforeIn", u, n, "previous", "current", p), o.pageCallback("beforeOut", h, r, "current", "next", p), p.animate ? (v = "page-previous page-current page-next", g = "navbar-previous navbar-current navbar-next", h.removeClass(v).addClass("page-current"), u.removeClass(v).addClass("page-previous").removeAttr("aria-hidden"), c && (r.removeClass(g).addClass("navbar-current"), n.removeClass(g).addClass("navbar-previous").removeAttr("aria-hidden")), o.animate(h, u, r, n, "backward", function() { C() })) : C(), o
    }

    function loadBack(e, t, a) {
        var n = this;
        if (!n.allowPageChange && !a) return n;
        var r = e,
            i = t,
            o = r.url,
            s = r.content,
            l = r.el,
            p = r.pageName,
            c = r.template,
            d = r.templateUrl,
            u = r.component,
            h = r.componentUrl;
        if (i.route.url && n.url === i.route.url && !i.reloadCurrent && !i.reloadPrevious && !n.params.allowDuplicateUrls) return !1;

        function f(e, t) { return n.backward(e, Utils.extend(i, t)) }

        function m() { return n.allowPageChange = !0, n }
        if (!i.route && o && (i.route = n.parseRouteUrl(o)), (o || d || h) && (n.allowPageChange = !1), s) n.backward(n.getPageEl(s), i);
        else if (c || d) try { n.pageTemplateLoader(c, d, i, f, m) } catch (e) { throw n.allowPageChange = !0, e } else if (l) n.backward(n.getPageEl(l), i);
            else if (p) n.backward(n.$el.children('.page[data-name="' + p + '"]').eq(0), i);
        else if (u || h) try { n.pageComponentLoader(n.el, u, h, i, f, m) } catch (e) { throw n.allowPageChange = !0, e } else o && (n.xhr && (n.xhr.abort(), n.xhr = !1), n.xhrRequest(o, i).then(function(e) { n.backward(n.getPageEl(e), i) }).catch(function() { n.allowPageChange = !0 }));
        return n
    }

    function back() {
        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
        var n, r, i, o = this;
        if (o.swipeBackActive) return o;
        var s = (r = "object" == typeof t[0] ? t[0] || {} : (n = t[0], t[1] || {})).name,
            l = r.params,
            p = r.query;
        if (s) { if (!(i = o.findRouteByKey("name", s))) throw new Error('Framework7: route with name "' + s + '" not found'); if (n = o.constructRouteUrl(i, { params: l, query: p })) return o.back(n, Utils.extend({}, r, { name: null, params: null, query: null })); throw new Error("Framework7: can't construct URL for route with name \"" + s + '"') }
        var c = o.app;
        if (!o.view) return (e = c.views.main.router).back.apply(e, t), o;
        var d, u = o.currentRoute.modal;
        if (u || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach(function(e) { o.currentRoute.route[e] && (u = !0, d = e) }), u) {
            var h, f = o.currentRoute.modal || o.currentRoute.route.modalInstance || c[d].get(),
                m = o.history[o.history.length - 2];
            if (f && f.$el) {
                var v = f.$el.prevAll(".modal-in");
                v.length && v[0].f7Modal && (h = v[0].f7Modal.route)
            }
            return h || (h = o.findMatchingRoute(m)), !h && m && (h = { url: m, path: m.split("?")[0], query: Utils.parseUrlQuery(m), route: { path: m.split("?")[0], url: m } }), h && f ? (o.params.pushState && !1 !== r.pushState && History.back(), o.currentRoute = h, o.history.pop(), o.saveHistory(), o.modalRemove(f), o) : o
        }
        var g = o.$el.children(".page-current").prevAll(".page-previous").eq(0);
        if (!r.force && 0 < g.length) { if (o.params.pushState && g[0].f7Page && o.history[o.history.length - 2] !== g[0].f7Page.route.url) return o.back(o.history[o.history.length - 2], Utils.extend(r, { force: !0 })), o; var b = g[0].f7Page.route; return processRouteQueue.call(o, b, o.currentRoute, function() { o.loadBack({ el: g }, Utils.extend(r, { route: b })) }, function() {}), o }
        if ("#" === n && (n = void 0), n && "/" !== n[0] && 0 !== n.indexOf("#") && (n = ((o.path || "/") + n).replace("//", "/")), !n && 1 < o.history.length && (n = o.history[o.history.length - 2]), (i = o.findMatchingRoute(n)) || n && (i = { url: n, path: n.split("?")[0], query: Utils.parseUrlQuery(n), route: { path: n.split("?")[0], url: n } }), !i) return o;
        if (i.route.redirect) return redirect.call(o, "back", i, r);
        var y, w = {};
        if (i.route.options ? Utils.extend(w, i.route.options, r, { route: i }) : Utils.extend(w, r, { route: i }), w && w.context && (i.context = w.context, w.route.context = w.context), w.force && o.params.stackPages && (o.$el.children(".page-previous.stacked").each(function(e, t) { t.f7Page && t.f7Page.route && t.f7Page.route.url === i.url && (y = !0, o.loadBack({ el: t }, w)) }), y)) return o;

        function C() {
            var a = !1;
            "url content component pageName el componentUrl template templateUrl".split(" ").forEach(function(e) {
                var t;
                i.route[e] && !a && (a = !0, o.loadBack(((t = {})[e] = i.route[e], t), w))
            }), a || i.route.async && (o.allowPageChange = !1, i.route.async.call(o, i, o.currentRoute, function(e, t) { o.allowPageChange = !1, t && t.context && (i.context ? i.context = Utils.extend({}, i.context, t.context) : i.context = t.context, w.route.context = i.context), o.loadBack(e, Utils.extend(w, t), !0) }, function() { o.allowPageChange = !0 }))
        }

        function x() { o.allowPageChange = !0 }
        return w.preload ? C() : processRouteQueue.call(o, i, o.currentRoute, function() { i.route.modules ? c.loadModules(Array.isArray(i.route.modules) ? i.route.modules : [i.route.modules]).then(function() { C() }).catch(function() { x() }) : C() }, function() { x() }), o
    }

    function clearPreviousHistory() {
        var r = this,
            i = r.app,
            o = r.separateNavbar,
            e = r.history[r.history.length - 1],
            a = $(r.currentPageEl);
        r.$el.children(".page:not(.stacked)").filter(function(e, t) { return t !== a[0] }).each(function(e, t) {
            var a = $(t),
                n = $(i.navbar.getElByPage(a));
            r.params.stackPages && 0 <= r.initialPages.indexOf(a[0]) ? (a.addClass("stacked"), o && n.addClass("stacked")) : (r.pageCallback("beforeRemove", a, n, "previous", void 0, {}), r.removePage(a), o && n.length && r.removeNavbar(n))
        }), r.history = [e], r.view.history = [e], r.saveHistory()
    }
    var Router = function(i) {
        function e(e, t) {
            i.call(this, {}, [void 0 === t ? e : t]);
            var a = this;
            a.isAppRouter = void 0 === t, a.isAppRouter ? Utils.extend(!1, a, { app: e, params: e.params.view, routes: e.routes || [], cache: e.cache }) : Utils.extend(!1, a, { app: e, view: t, viewId: t.id, params: t.params, routes: t.routes, $el: t.$el, el: t.el, $navbarEl: t.$navbarEl, navbarEl: t.navbarEl, history: t.history, scrollHistory: t.scrollHistory, cache: e.cache, dynamicNavbar: "ios" === e.theme && t.params.iosDynamicNavbar, separateNavbar: "ios" === e.theme && t.params.iosDynamicNavbar && t.params.iosSeparateDynamicNavbar, initialPages: [], initialNavbars: [] }), a.useModules(), a.tempDom = doc.createElement("div"), a.allowPageChange = !0;
            var n = {},
                r = {};
            return Object.defineProperty(a, "currentRoute", { enumerable: !0, configurable: !0, set: function(e) { void 0 === e && (e = {}), r = Utils.extend({}, n), (n = e) && (a.url = n.url, a.emit("routeChange", e, r, a)) }, get: function() { return n } }), Object.defineProperty(a, "previousRoute", { enumerable: !0, configurable: !0, get: function() { return r }, set: function(e) { r = e } }), a
        }
        return i && (e.__proto__ = i), ((e.prototype = Object.create(i && i.prototype)).constructor = e).prototype.animatableNavElements = function(a, n) {
            var o, s, e = this.dynamicNavbar,
                l = this.params.iosAnimateNavbarBackIcon;

            function r(e, t) {
                var a, n = $(e),
                    r = n.hasClass("sliding") || t.hasClass("sliding"),
                    i = n.hasClass("subnavbar"),
                    o = !r || !i,
                    s = r && l && n.hasClass("left") && 0 < n.find(".back .icon").length;
                return s && (a = n.find(".back .icon")), { $el: n, $iconEl: a, hasIcon: s, leftOffset: n[0].f7NavbarLeftOffset, rightOffset: n[0].f7NavbarRightOffset, isSliding: r, isSubnavbar: i, needsOpacityTransition: o }
            }
            return e && (o = [], s = [], a.children(".left, .right, .title, .subnavbar").each(function(e, t) { o.push(r(t, a)) }), n.children(".left, .right, .title, .subnavbar").each(function(e, t) { s.push(r(t, n)) }), [s, o].forEach(function(i) {
                i.forEach(function(e) {
                    var a = e,
                        t = e.isSliding,
                        n = e.$el,
                        r = i === s ? o : s;
                    t && n.hasClass("title") && r && r.forEach(function(e) {
                        if (e.$el.hasClass("left") && e.hasIcon) {
                            var t = e.$el.find(".back span")[0];
                            a.leftOffset += t ? t.offsetLeft : 0
                        }
                    })
                })
            })), { newNavEls: o, oldNavEls: s }
        }, e.prototype.animateWithCSS = function(e, t, a, n, r, i) {
            var o, s, l = this,
                p = l.dynamicNavbar,
                c = l.separateNavbar,
                d = "ios" === l.app.theme,
                u = "router-transition-" + r + " router-transition-css-" + r,
                h = 0;
            if (d && p) {
                c || (h = n[0].offsetWidth);
                var f = l.animatableNavElements(n, a);
                o = f.newNavEls, s = f.oldNavEls
            }

            function m(n) {
                d && p && (o.forEach(function(e) {
                    var t = e.$el,
                        a = "forward" === r ? e.rightOffset : e.leftOffset;
                    e.isSliding && t.transform("translate3d(" + a * (1 - n) + "px,0,0)"), e.hasIcon && ("forward" === r ? e.$iconEl.transform("translate3d(" + (-a - h) * (1 - n) + "px,0,0)") : e.$iconEl.transform("translate3d(" + (h / 5 - a) * (1 - n) + "px,0,0)"))
                }), s.forEach(function(e) {
                    var t = e.$el,
                        a = "forward" === r ? e.leftOffset : e.rightOffset;
                    e.isSliding && t.transform("translate3d(" + a * n + "px,0,0)"), e.hasIcon && ("forward" === r ? e.$iconEl.transform("translate3d(" + (h / 5 - a) * n + "px,0,0)") : e.$iconEl.transform("translate3d(" + (-a - h) * n + "px,0,0)"))
                }))
            }("forward" === r ? t : e).animationEnd(function() { l.dynamicNavbar && (n.hasClass("sliding") ? n.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : n.find(".sliding").transform(""), a.hasClass("sliding") ? a.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : a.find(".sliding").transform("")), l.$el.removeClass(u), i && i() }), p ? (m(0), Utils.nextFrame(function() { m(1), l.$el.addClass(u) })) : l.$el.addClass(u)
        }, e.prototype.animateWithJS = function(i, o, e, t, s, l) {
            var p, c, d, u, h = this,
                f = h.dynamicNavbar,
                a = h.separateNavbar,
                m = "ios" === h.app.theme,
                v = m ? 400 : 250,
                g = "router-transition-" + s + " router-transition-js-" + s,
                b = null,
                y = !1,
                w = 0;
            if (m && f) {
                a || (w = t[0].offsetWidth);
                var n = h.animatableNavElements(t, e);
                p = n.newNavEls, c = n.oldNavEls
            }
            m && (d = $('<div class="page-shadow-effect"></div>'), u = $('<div class="page-opacity-effect"></div>'), "forward" === s ? (o.append(d), i.append(u)) : (o.append(u), i.append(d)));
            var C = Utils.bezier(.25, .1, .25, 1);
            h.$el.addClass(g), Utils.requestAnimationFrame(function e() {
                var t = Utils.now();
                b || (b = t);
                var a = Math.max(Math.min((t - b) / v, 1), 0),
                    n = C(a);
                1 <= a && (y = !0);
                var r = h.app.rtl ? -1 : 1;
                if (m ? (u[0].style.opacity = "forward" === s ? (o.transform("translate3d(" + 100 * (1 - n) * r + "%,0,0)"), i.transform("translate3d(" + 20 * -n * r + "%,0,0)"), d[0].style.opacity = n) : (o.transform("translate3d(" + 20 * -(1 - n) * r + "%,0,0)"), i.transform("translate3d(" + 100 * n * r + "%,0,0)"), d[0].style.opacity = 1 - n, 1 - n), f && (p.forEach(function(e) {
                        var t = e.$el,
                            a = "forward" === s ? e.rightOffset : e.leftOffset;
                        e.needsOpacityTransition && (t[0].style.opacity = n), e.isSliding && t.transform("translate3d(" + a * (1 - n) + "px,0,0)"), e.hasIcon && ("forward" === s ? e.$iconEl.transform("translate3d(" + (-a - w) * (1 - n) + "px,0,0)") : e.$iconEl.transform("translate3d(" + (w / 5 - a) * (1 - n) + "px,0,0)"))
                    }), c.forEach(function(e) {
                        var t = e.$el,
                            a = "forward" === s ? e.leftOffset : e.rightOffset;
                        e.needsOpacityTransition && (t[0].style.opacity = 1 - n), e.isSliding && t.transform("translate3d(" + a * n + "px,0,0)"), e.hasIcon && ("forward" === s ? e.$iconEl.transform("translate3d(" + (w / 5 - a) * n + "px,0,0)") : e.$iconEl.transform("translate3d(" + (-a - w) * n + "px,0,0)"))
                    }))) : "forward" === s ? (o.transform("translate3d(0, " + 56 * (1 - n) + "px,0)"), o.css("opacity", n)) : (i.transform("translate3d(0, " + 56 * n + "px,0)"), i.css("opacity", 1 - n)), y) return o.transform("").css("opacity", ""), i.transform("").css("opacity", ""), m && (d.remove(), u.remove(), f && (p.forEach(function(e) { e.$el.transform(""), e.$el.css("opacity", "") }), c.forEach(function(e) { e.$el.transform(""), e.$el.css("opacity", "") }), p = [], c = [])), h.$el.removeClass(g), void(l && l());
                Utils.requestAnimationFrame(e)
            })
        }, e.prototype.animate = function() {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            var a = this;
            a.params.animateCustom ? a.params.animateCustom.apply(a, e) : a.params.animateWithJS ? a.animateWithJS.apply(a, e) : a.animateWithCSS.apply(a, e)
        }, e.prototype.removeModal = function(e) { this.removeEl(e) }, e.prototype.removeTabContent = function(e) { $(e).html("") }, e.prototype.removeNavbar = function(e) { this.removeEl(e) }, e.prototype.removePage = function(e) { this.removeEl(e) }, e.prototype.removeEl = function(e) {
            if (e) {
                var t = $(e);
                0 !== t.length && (t.find(".tab").each(function(e, t) { $(t).children().each(function(e, t) { t.f7Component && ($(t).trigger("tab:beforeremove"), t.f7Component.$destroy()) }) }), t[0].f7Component && t[0].f7Component.$destroy && t[0].f7Component.$destroy(), this.params.removeElements && (this.params.removeElementsWithTimeout ? setTimeout(function() { t.remove() }, this.params.removeElementsTimeout) : t.remove()))
            }
        }, e.prototype.getPageEl = function(e) {
            var t = this;
            if ("string" == typeof e) t.tempDom.innerHTML = e;
            else {
                if ($(e).hasClass("page")) return e;
                t.tempDom.innerHTML = "", $(t.tempDom).append(e)
            }
            return t.findElement(".page", t.tempDom)
        }, e.prototype.findElement = function(e, t, a) {
            var n = this.view,
                r = this.app,
                i = $(t),
                o = e;
            a && (o += ":not(.stacked)");
            var s = i.find(o).filter(function(e, t) { return 0 === $(t).parents(".popup, .dialog, .popover, .actions-modal, .sheet-modal, .login-screen, .page").length });
            return 1 < s.length && ("string" == typeof n.selector && (s = i.find(n.selector + " " + o)), 1 < s.length && (s = i.find("." + r.params.viewMainClass + " " + o))), 1 === s.length ? s : (a || (s = this.findElement(o, i, !0)), s && 1 === s.length ? s : s && 1 < s.length ? $(s[0]) : void 0)
        }, e.prototype.flattenRoutes = function(e) {
            var r = this;
            void 0 === e && (e = this.routes);
            var i = [];
            return e.forEach(function(a) {
                var e = !1;
                if ("tabs" in a && a.tabs) {
                    var t = a.tabs.map(function(e) { var t = Utils.extend({}, a, { path: (a.path + "/" + e.path).replace("///", "/").replace("//", "/"), parentPath: a.path, tab: e }); return delete t.tabs, delete t.routes, t });
                    e = !0, i = i.concat(r.flattenRoutes(t))
                }
                if ("routes" in a) {
                    var n = a.routes.map(function(e) { var t = Utils.extend({}, e); return t.path = (a.path + "/" + t.path).replace("///", "/").replace("//", "/"), t });
                    i = e ? i.concat(r.flattenRoutes(n)) : i.concat(a, r.flattenRoutes(n))
                }
                "routes" in a || "tabs" in a && a.tabs || i.push(a)
            }), i
        }, e.prototype.parseRouteUrl = function(e) {
            if (!e) return {};
            var t = Utils.parseUrlQuery(e),
                a = e.split("#")[1],
                n = e.split("#")[0].split("?")[0];
            return { query: t, hash: a, params: {}, url: e, path: n }
        }, e.prototype.constructRouteUrl = function(e, t) {
            void 0 === t && (t = {});
            var a, n = t.params,
                r = t.query,
                i = e.path,
                o = pathToRegexp_1.compile(i);
            try { a = o(n || {}) } catch (e) { throw new Error("Framework7: error constructing route URL from passed params:\nRoute: " + i + "\n" + e.toString()) }
            return r && (a += "string" == typeof r ? "?" + r : "?" + Utils.serializeObject(r)), a
        }, e.prototype.findTabRoute = function(e) {
            var t, a = $(e),
                n = this.currentRoute.route.parentPath,
                r = a.attr("id");
            return this.flattenRoutes(this.routes).forEach(function(e) { e.parentPath === n && e.tab && e.tab.id === r && (t = e) }), t
        }, e.prototype.findRouteByKey = function(t, a) { var n, e = this.routes; return this.flattenRoutes(e).forEach(function(e) { n || e[t] === a && (n = e) }), n }, e.prototype.findMatchingRoute = function(i) {
            if (i) {
                var o, e = this.routes,
                    t = this.flattenRoutes(e),
                    a = this.parseRouteUrl(i),
                    s = a.path,
                    l = a.query,
                    p = a.hash,
                    c = a.params;
                return t.forEach(function(e) {
                    if (!o) {
                        var n, t, a = [],
                            r = [e.path];
                        if (e.alias && ("string" == typeof e.alias ? r.push(e.alias) : Array.isArray(e.alias) && e.alias.forEach(function(e) { r.push(e) })), r.forEach(function(e) { n || (n = pathToRegexp_1(e, a).exec(s)) }), n) a.forEach(function(e, t) {
                            if ("number" != typeof e.name) {
                                var a = n[t + 1];
                                c[e.name] = a
                            }
                        }), e.parentPath && (t = s.split("/").slice(0, e.parentPath.split("/").length - 1).join("/")), o = { query: l, hash: p, params: c, url: i, path: s, parentPath: t, route: e, name: e.name }
                    }
                }), o
            }
        }, e.prototype.replaceRequestUrlParams = function(e, a) {
            void 0 === e && (e = ""), void 0 === a && (a = {});
            var n = e;
            return "string" == typeof n && 0 <= n.indexOf("{{") && a && a.route && a.route.params && Object.keys(a.route.params).length && Object.keys(a.route.params).forEach(function(e) {
                var t = new RegExp("{{" + e + "}}", "g");
                n = n.replace(t, a.route.params[e] || "")
            }), n
        }, e.prototype.removeFromXhrCache = function(e) { for (var t = this.cache.xhr, a = !1, n = 0; n < t.length; n += 1) t[n].url === e && (a = n);!1 !== a && t.splice(a, 1) }, e.prototype.xhrRequest = function(e, r) {
            var i = this,
                o = i.params,
                s = r.ignoreCache,
                l = e,
                t = 0 <= l.indexOf("?");
            return o.passRouteQueryToRequest && r && r.route && r.route.query && Object.keys(r.route.query).length && (l += (t ? "&" : "?") + Utils.serializeObject(r.route.query), t = !0), o.passRouteParamsToRequest && r && r.route && r.route.params && Object.keys(r.route.params).length && (l += (t ? "&" : "?") + Utils.serializeObject(r.route.params), t = !0), 0 <= l.indexOf("{{") && (l = i.replaceRequestUrlParams(l, r)), o.xhrCacheIgnoreGetParameters && 0 <= l.indexOf("?") && (l = l.split("?")[0]), Utils.promise(function(a, n) {
                if (o.xhrCache && !s && l.indexOf("nocache") < 0 && o.xhrCacheIgnore.indexOf(l) < 0)
                    for (var e = 0; e < i.cache.xhr.length; e += 1) { var t = i.cache.xhr[e]; if (t.url === l && Utils.now() - t.time < o.xhrCacheDuration) return void a(t.content) }
                i.xhr = i.app.request({ url: l, method: "GET", beforeSend: function(e) { i.emit("routerAjaxStart", e, r) }, complete: function(e, t) { i.emit("routerAjaxComplete", e), "error" !== t && "timeout" !== t && 200 <= e.status && e.status < 300 || 0 === e.status ? (o.xhrCache && "" !== e.responseText && (i.removeFromXhrCache(l), i.cache.xhr.push({ url: l, time: Utils.now(), content: e.responseText })), i.emit("routerAjaxSuccess", e, r), a(e.responseText)) : (i.emit("routerAjaxError", e, r), n(e)) }, error: function(e) { i.emit("routerAjaxError", e, r), n(e) } })
            })
        }, e.prototype.removeThemeElements = function(e) {
            var t = this.app.theme;
            $(e).find("." + ("md" === t ? "ios" : "md") + "-only, .if-" + ("md" === t ? "ios" : "md")).remove()
        }, e.prototype.templateLoader = function(e, t, n, r, i) {
            var o = this;

            function a(e) {
                var t, a;
                try {
                    if ("function" == typeof(a = n.context || {})) a = a.call(o);
                    else if ("string" == typeof a) try { a = JSON.parse(a) } catch (e) { throw i(), e }
                    t = "function" == typeof e ? e(a) : Template7.compile(e)(Utils.extend({}, a || {}, { $app: o.app, $root: Utils.extend({}, o.app.data, o.app.methods), $route: n.route, $router: o, $theme: { ios: "ios" === o.app.theme, md: "md" === o.app.theme } }))
                } catch (e) { throw i(), e }
                r(t, { context: a })
            }
            t ? (o.xhr && (o.xhr.abort(), o.xhr = !1), o.xhrRequest(t, n).then(function(e) { a(e) }).catch(function() { i() })) : a(e)
        }, e.prototype.modalTemplateLoader = function(e, t, a, n, r) { return this.templateLoader(e, t, a, function(e) { n(e) }, r) }, e.prototype.tabTemplateLoader = function(e, t, a, n, r) { return this.templateLoader(e, t, a, function(e) { n(e) }, r) }, e.prototype.pageTemplateLoader = function(e, t, a, n, r) { var i = this; return i.templateLoader(e, t, a, function(e, t) { void 0 === t && (t = {}), n(i.getPageEl(e), t) }, r) }, e.prototype.componentLoader = function(e, t, r, i, o) {
            void 0 === r && (r = {});
            var a, s = this,
                l = s.app,
                n = "string" == typeof e ? e : t,
                p = s.replaceRequestUrlParams(n, r);

            function c(e) {
                var t = r.context || {};
                if ("function" == typeof t) t = t.call(s);
                else if ("string" == typeof t) try { t = JSON.parse(t) } catch (e) { throw o(), e }
                var a = Utils.merge({}, t, { $route: r.route, $router: s, $theme: { ios: "ios" === l.theme, md: "md" === l.theme } }),
                    n = l.component.create(e, a);
                i(n.el)
            }
            p && s.cache.components.forEach(function(e) { e.url === p && (a = e.component) }), p && a ? c(a) : p && !a ? (s.xhr && (s.xhr.abort(), s.xhr = !1), s.xhrRequest(n, r).then(function(e) {
                var t = l.component.parse(e);
                s.cache.components.push({ url: p, component: t }), c(t)
            }).catch(function(e) { throw o(), e })) : c(e)
        }, e.prototype.modalComponentLoader = function(e, t, a, n, r, i) { this.componentLoader(t, a, n, function(e) { r(e) }, i) }, e.prototype.tabComponentLoader = function(e, t, a, n, r, i) { this.componentLoader(t, a, n, function(e) { r(e) }, i) }, e.prototype.pageComponentLoader = function(e, t, a, n, r, i) { this.componentLoader(t, a, n, function(e, t) { void 0 === t && (t = {}), r(e, t) }, i) }, e.prototype.getPageData = function(e, t, a, n, r, i) {
            void 0 === r && (r = {});
            var o, s, l = $(e),
                p = $(t),
                c = l[0].f7Page || {};
            if (("next" === a && "current" === n || "current" === a && "previous" === n) && (o = "forward"), ("current" === a && "next" === n || "previous" === a && "current" === n) && (o = "backward"), c && !c.fromPage) {
                var d = $(i);
                d.length && (s = d[0].f7Page)
            }(s = c.pageFrom || s) && s.pageFrom && (s.pageFrom = null);
            var u = { app: this.app, view: this.view, router: this, $el: l, el: l[0], $pageEl: l, pageEl: l[0], $navbarEl: p, navbarEl: p[0], name: l.attr("data-name"), position: a, from: a, to: n, direction: o, route: c.route ? c.route : r, pageFrom: s };
            return p && p[0] && (p[0].f7Page = u), l[0].f7Page = u
        }, e.prototype.pageCallback = function(e, t, a, n, r, i, o) {
            if (void 0 === i && (i = {}), t) {
                var s = this,
                    l = $(t);
                if (l.length) {
                    var p = i.route,
                        c = s.params.restoreScrollTopOnBack,
                        d = "page" + (e[0].toUpperCase() + e.slice(1, e.length)),
                        u = "page:" + e.toLowerCase(),
                        h = {};
                    (h = "beforeRemove" === e && l[0].f7Page ? Utils.extend(l[0].f7Page, { from: n, to: r, position: n }) : s.getPageData(t, a, n, r, p, o)).swipeBack = !!i.swipeBack;
                    var f = i.route ? i.route.route : {},
                        m = f.on;
                    void 0 === m && (m = {});
                    var v = f.once;
                    if (void 0 === v && (v = {}), i.on && Utils.extend(m, i.on), i.once && Utils.extend(v, i.once), "mounted" === e && y(), "init" === e) {
                        if (c && ("previous" === n || !n) && "current" === r && s.scrollHistory[h.route.url] && !l.hasClass("no-restore-scroll")) {
                            var g = l.find(".page-content");
                            0 < g.length && (g = g.filter(function(e, t) { return 0 === $(t).parents(".tab:not(.tab-active)").length && !$(t).is(".tab:not(.tab-active)") })), g.scrollTop(s.scrollHistory[h.route.url])
                        }
                        if (y(), l[0].f7PageInitialized) return l.trigger("page:reinit", h), void s.emit("pageReinit", h);
                        l[0].f7PageInitialized = !0
                    }
                    if (c && "beforeOut" === e && "current" === n && "previous" === r) {
                        var b = l.find(".page-content");
                        0 < b.length && (b = b.filter(function(e, t) { return 0 === $(t).parents(".tab:not(.tab-active)").length && !$(t).is(".tab:not(.tab-active)") })), s.scrollHistory[h.route.url] = b.scrollTop()
                    }
                    c && "beforeOut" === e && "current" === n && "next" === r && delete s.scrollHistory[h.route.url], l.trigger(u, h), s.emit(d, h), "beforeRemove" === e && (l[0].f7RouteEventsAttached && (l[0].f7RouteEventsOn && Object.keys(l[0].f7RouteEventsOn).forEach(function(e) { l.off(Utils.eventNameToColonCase(e), l[0].f7RouteEventsOn[e]) }), l[0].f7RouteEventsOnce && Object.keys(l[0].f7RouteEventsOnce).forEach(function(e) { l.off(Utils.eventNameToColonCase(e), l[0].f7RouteEventsOnce[e]) }), l[0].f7RouteEventsAttached = null, l[0].f7RouteEventsOn = null, l[0].f7RouteEventsOnce = null, delete l[0].f7RouteEventsAttached, delete l[0].f7RouteEventsOn, delete l[0].f7RouteEventsOnce), l[0].f7Page && l[0].f7Page.navbarEl && delete l[0].f7Page.navbarEl.f7Page, l[0].f7Page = null)
                }
            }

            function y() { l[0].f7RouteEventsAttached || (l[0].f7RouteEventsAttached = !0, m && 0 < Object.keys(m).length && (l[0].f7RouteEventsOn = m, Object.keys(m).forEach(function(e) { m[e] = m[e].bind(s), l.on(Utils.eventNameToColonCase(e), m[e]) })), v && 0 < Object.keys(v).length && (l[0].f7RouteEventsOnce = v, Object.keys(v).forEach(function(e) { v[e] = v[e].bind(s), l.once(Utils.eventNameToColonCase(e), v[e]) }))) }
        }, e.prototype.saveHistory = function() {
            var e = this;
            e.view.history = e.history, e.params.pushState && (win.localStorage["f7router-" + e.view.id + "-history"] = JSON.stringify(e.history))
        }, e.prototype.restoreHistory = function() {
            var e = this;
            e.params.pushState && win.localStorage["f7router-" + e.view.id + "-history"] && (e.history = JSON.parse(win.localStorage["f7router-" + e.view.id + "-history"]), e.view.history = e.history)
        }, e.prototype.clearHistory = function() { this.history = [], this.view && (this.view.history = []), this.saveHistory() }, e.prototype.updateCurrentUrl = function(e) {
            var t = this;
            t.history.length ? t.history[t.history.length - 1] = e : t.history.push(e);
            var a = t.parseRouteUrl(e),
                n = a.query,
                r = a.hash,
                i = a.params,
                o = a.url,
                s = a.path;
            if (t.currentRoute && Utils.extend(t.currentRoute, { query: n, hash: r, params: i, url: o, path: s }), t.params.pushState) {
                var l = t.params.pushStateRoot || "";
                History.replace(t.view.id, { url: e }, l + t.params.pushStateSeparator + e)
            }
            t.saveHistory(), t.emit("routeUrlUpdate", t.currentRoute, t)
        }, e.prototype.init = function() {
            var i = this,
                e = i.app,
                t = i.view;
            (t && i.params.iosSwipeBack && "ios" === e.theme || t && i.params.mdSwipeBack && "md" === e.theme) && SwipeBack(i), i.dynamicNavbar && !i.separateNavbar && i.$el.addClass("router-dynamic-navbar-inside");
            var a, n, o, r = i.params.url,
                s = doc.location.href.split(doc.location.origin)[1],
                l = i.params,
                p = l.pushState,
                c = l.pushStateOnLoad,
                d = l.pushStateSeparator,
                u = l.pushStateAnimateOnLoad,
                h = i.params.pushStateRoot;
            (win.cordova && p && !d && !h && doc.location.pathname.indexOf("index.html") && (console.warn("Framework7: wrong or not complete pushState configuration, trying to guess pushStateRoot"), h = doc.location.pathname.split("index.html")[0]), p && c ? (h && 0 <= s.indexOf(h) && "" === (s = s.split(h)[1]) && (s = "/"), r = 0 < d.length && 0 <= s.indexOf(d) ? s.split(d)[1] : s, i.restoreHistory(), 0 <= i.history.indexOf(r) ? i.history = i.history.slice(0, i.history.indexOf(r) + 1) : i.params.url === r ? i.history = [r] : History.state && History.state[t.id] && History.state[t.id].url === i.history[i.history.length - 1] ? r = i.history[i.history.length - 1] : i.history = [s.split(d)[0] || "/", r], 1 < i.history.length ? a = !0 : i.history = [], i.saveHistory()) : (r || (r = s), doc.location.search && r.indexOf("?") < 0 && (r += doc.location.search), doc.location.hash && r.indexOf("#") < 0 && (r += doc.location.hash)), 1 < i.history.length ? (n = i.findMatchingRoute(i.history[0])) || (n = Utils.extend(i.parseRouteUrl(i.history[0]), { route: { url: i.history[0], path: i.history[0].split("?")[0] } })) : (n = i.findMatchingRoute(r)) || (n = Utils.extend(i.parseRouteUrl(r), { route: { url: r, path: r.split("?")[0] } })), i.params.stackPages && i.$el.children(".page").each(function(e, t) {
                var a = $(t);
                i.initialPages.push(a[0]), i.separateNavbar && 0 < a.children(".navbar").length && i.initialNavbars.push(a.children(".navbar").find(".navbar-inner")[0])
            }), 0 === i.$el.children(".page:not(.stacked)").length && r) ? i.navigate(r, { initial: !0, reloadCurrent: !0, pushState: !1 }): (i.currentRoute = n, i.$el.children(".page:not(.stacked)").each(function(e, t) {
                var a, n = $(t);
                n.addClass("page-current"), i.separateNavbar && (0 < (a = n.children(".navbar").children(".navbar-inner")).length ? (i.$navbarEl.parents(doc).length || i.$el.prepend(i.$navbarEl), i.$navbarEl.append(a), n.children(".navbar").remove()) : i.$navbarEl.addClass("navbar-hidden"));
                var r = { route: i.currentRoute };
                i.currentRoute && i.currentRoute.route && i.currentRoute.route.options && Utils.extend(r, i.currentRoute.route.options), i.currentPageEl = n[0], i.dynamicNavbar && a.length && (i.currentNavbarEl = a[0]), i.removeThemeElements(n), i.dynamicNavbar && a.length && i.removeThemeElements(a), r.route.route.tab && (o = !0, i.tabLoad(r.route.route.tab, Utils.extend({}, r))), i.pageCallback("init", n, a, "current", void 0, r)
            }), a && i.navigate(r, { initial: !0, pushState: !1, history: !1, animate: u, once: { pageAfterIn: function() { 2 < i.history.length && i.back({ preload: !0 }) } } }), a || o || (i.history.push(r), i.saveHistory()));
            !(r && p && c) || History.state && History.state[t.id] || History.initViewState(t.id, { url: r }), i.emit("local::init routerInit", i)
        }, e.prototype.destroy = function() {
            var t = this;
            t.emit("local::destroy routerDestroy", t), Object.keys(t).forEach(function(e) { t[e] = null, delete t[e] }), t = null
        }, e
    }(Framework7Class);
    Router.prototype.forward = forward, Router.prototype.load = load, Router.prototype.navigate = navigate, Router.prototype.refreshPage = refreshPage, Router.prototype.tabLoad = tabLoad, Router.prototype.tabRemove = tabRemove, Router.prototype.modalLoad = modalLoad, Router.prototype.modalRemove = modalRemove, Router.prototype.backward = backward, Router.prototype.loadBack = loadBack, Router.prototype.back = back, Router.prototype.clearPreviousHistory = clearPreviousHistory;
    var Router$1 = {
            name: "router",
            static: { Router: Router },
            instance: { cache: { xhr: [], templates: [], components: [] } },
            create: function() {
                var e = this;
                e.app ? e.params.router && (e.router = new Router(e.app, e)) : e.router = new Router(e)
            }
        },
        View = function(p) {
            function e(e, t, a) {
                void 0 === a && (a = {}), p.call(this, a, [e]);
                var n, r, i, o = e,
                    s = $(t),
                    l = this;
                return l.params = Utils.extend({ routes: [], routesAdd: [] }, o.params.view, a), 0 < l.params.routes.length ? l.routes = l.params.routes : l.routes = [].concat(o.routes, l.params.routesAdd), n = "string" == typeof t ? t : (s.attr("id") ? "#" + s.attr("id") : "") + (s.attr("class") ? "." + s.attr("class").replace(/ /g, ".").replace(".active", "") : ""), "ios" === o.theme && l.params.iosDynamicNavbar && l.params.iosSeparateDynamicNavbar && 0 === (r = s.children(".navbar").eq(0)).length && (r = $('<div class="navbar"></div>')), Utils.extend(!1, l, { app: o, $el: s, el: s[0], name: l.params.name, main: l.params.main || s.hasClass("view-main"), $navbarEl: r, navbarEl: r ? r[0] : void 0, selector: n, history: [], scrollHistory: {} }), (s[0].f7View = l).useModules(), o.views.push(l), l.main && (o.views.main = l), l.name && (o.views[l.name] = l), l.index = o.views.indexOf(l), i = l.name ? "view_" + l.name : l.main ? "view_main" : "view_" + l.index, l.id = i, o.initialized ? l.init() : o.on("init", function() { l.init() }), l
            }
            return p && (e.__proto__ = p), ((e.prototype = Object.create(p && p.prototype)).constructor = e).prototype.destroy = function() {
                var t = this,
                    e = t.app;
                t.$el.trigger("view:beforedestroy", t), t.emit("local::beforeDestroy viewBeforeDestroy", t), t.main ? (e.views.main = null, delete e.views.main) : t.name && (e.views[t.name] = null, delete e.views[t.name]), t.$el[0].f7View = null, delete t.$el[0].f7View, e.views.splice(e.views.indexOf(t), 1), t.params.router && t.router && t.router.destroy(), t.emit("local::destroy viewDestroy", t), Object.keys(t).forEach(function(e) { t[e] = null, delete t[e] }), t = null
            }, e.prototype.init = function() {
                var e = this;
                e.params.router && (e.router.init(), e.$el.trigger("view:init", e), e.emit("local::init viewInit", e))
            }, e
        }(Framework7Class);

    function initClicks(p) {
        if (p.on("click", function(e) {
                var n = $(e.target),
                    t = n.closest("a"),
                    a = 0 < t.length,
                    r = a && t.attr("href"),
                    i = a && t.hasClass("tab-link") && (t.attr("data-tab") || r && 0 === r.indexOf("#"));
                if (a && (t.is(p.params.clicks.externalLinks) || r && 0 <= r.indexOf("javascript:"))) {
                    var o = t.attr("target");
                    r && win.cordova && win.cordova.InAppBrowser && ("_system" === o || "_blank" === o) && (e.preventDefault(), win.cordova.InAppBrowser.open(r, o))
                } else {
                    Object.keys(p.modules).forEach(function(e) {
                        var a = p.modules[e].clicks;
                        a && Object.keys(a).forEach(function(e) {
                            var t = n.closest(e).eq(0);
                            0 < t.length && a[e].call(p, t, t.dataset())
                        })
                    });
                    var s = {};
                    if (a && (e.preventDefault(), s = t.dataset()), r && 0 < r.length && "#" !== r && !i || t.hasClass("back")) {
                        var l;
                        if (s.view ? l = $(s.view)[0].f7View : (l = n.parents(".view")[0] && n.parents(".view")[0].f7View, !t.hasClass("back") && l && l.params.linksView && ("string" == typeof l.params.linksView ? l = $(l.params.linksView)[0].f7View : l.params.linksView instanceof View && (l = l.params.linksView))), l || p.views.main && (l = p.views.main), !l || !l.router) return;
                        if (s.context && "string" == typeof s.context) try { s.context = JSON.parse(s.context) } catch (e) {}
                        t.hasClass("back") ? l.router.back(r, s) : l.router.navigate(r, s)
                    }
                }
            }), Support.touch && !Device.android) {
            var e = !!Support.passiveListener && { passive: !1, capture: !1 };
            $(doc).on(p.params.touch.fastClicks ? "touchstart" : "touchmove", ".panel-backdrop, .dialog-backdrop, .preloader-backdrop, .popup-backdrop, .searchbar-backdrop", function(e) { e.preventDefault() }, e)
        }
    }
    View.use(Router$1);
    var ClicksModule = { name: "clicks", params: { clicks: { externalLinks: ".external" } }, on: { init: function() { initClicks(this) } } },
        HistoryModule = { name: "history", static: { history: History }, on: { init: function() { History.init(this) } } },
        keyPrefix = "f7storage-",
        Storage = {
            get: function(a) { return Utils.promise(function(e, t) { try { e(JSON.parse(win.localStorage.getItem("" + keyPrefix + a))) } catch (e) { t(e) } }) },
            set: function(a, n) { return Utils.promise(function(e, t) { try { win.localStorage.setItem("" + keyPrefix + a, JSON.stringify(n)), e() } catch (e) { t(e) } }) },
            remove: function(a) { return Utils.promise(function(e, t) { try { win.localStorage.removeItem("" + keyPrefix + a), e() } catch (e) { t(e) } }) },
            clear: function() {},
            length: function() {},
            keys: function() { return Utils.promise(function(e, t) { try { e(Object.keys(win.localStorage).filter(function(e) { return 0 === e.indexOf(keyPrefix) }).map(function(e) { return e.replace(keyPrefix, "") })) } catch (e) { t(e) } }) },
            forEach: function(n) {
                return Utils.promise(function(e, t) {
                    try {
                        Object.keys(win.localStorage).filter(function(e) { return 0 === e.indexOf(keyPrefix) }).forEach(function(e, t) {
                            var a = e.replace(keyPrefix, "");
                            Storage.get(a).then(function(e) { n(a, e, t) })
                        }), e()
                    } catch (e) { t(e) }
                })
            }
        },
        StorageModule = { name: "storage", static: { Storage: Storage, storage: Storage } };

    function vnode(e, t, a, n, r) { return { sel: e, data: t, children: a, text: n, elm: r, key: void 0 === t ? void 0 : t.key } }
    var array = Array.isArray;

    function primitive(e) { return "string" == typeof e || "number" == typeof e }

    function addNS(e, t, a) {
        if (e.ns = "http://www.w3.org/2000/svg", "foreignObject" !== a && void 0 !== t)
            for (var n = 0; n < t.length; ++n) {
                var r = t[n].data;
                void 0 !== r && addNS(r, t[n].children, t[n].sel)
            }
    }

    function h(e, t, a) {
        var n, r, i, o = {};
        if (void 0 !== a ? (o = t, array(a) ? n = a : primitive(a) ? r = a : a && a.sel && (n = [a])) : void 0 !== t && (array(t) ? n = t : primitive(t) ? r = t : t && t.sel ? n = [t] : o = t), array(n))
            for (i = 0; i < n.length; ++i) primitive(n[i]) && (n[i] = vnode(void 0, void 0, void 0, n[i], void 0));
        return "s" !== e[0] || "v" !== e[1] || "g" !== e[2] || 3 !== e.length && "." !== e[3] && "#" !== e[3] || addNS(o, n, e), vnode(e, o, n, r, void 0)
    }
    var selfClosing = "area base br col command embed hr img input keygen link menuitem meta param source track wbr".split(" "),
        propsAttrs = "hidden checked disabled readonly selected autocomplete autofocus autoplay required multiple value".split(" "),
        booleanProps = "hidden checked disabled readonly selected autocomplete autofocus autoplay required multiple readOnly".split(" "),
        tempDom = doc.createElement("div");

    function getHooks(e, t, a, n) {
        var r = {};
        if (!e || !e.attrs || !e.attrs.class) return r;
        var i = e.attrs.class,
            o = [],
            s = [],
            l = [],
            p = [];
        return i.split(" ").forEach(function(e) { a || o.push.apply(o, t.getVnodeHooks("insert", e)), s.push.apply(s, t.getVnodeHooks("destroy", e)), l.push.apply(l, t.getVnodeHooks("update", e)), p.push.apply(p, t.getVnodeHooks("postpatch", e)) }), n && !a && p.push(function(e, t) {
            var a = t || e;
            a && a.data && a.data.context && a.data.context.$options.updated && a.data.context.$options.updated()
        }), 0 === o.length && 0 === s.length && 0 === l.length && 0 === p.length || (o.length && (r.insert = function(t) { o.forEach(function(e) { return e(t) }) }), s.length && (r.destroy = function(t) { s.forEach(function(e) { return e(t) }) }), l.length && (r.update = function(t, a) { l.forEach(function(e) { return e(t, a) }) }), p.length && (r.postpatch = function(t, a) { p.forEach(function(e) { return e(t, a) }) })), r
    }

    function getEventHandler(n, r, e) {
        void 0 === e && (e = {});
        var a, i, o = e.stop,
            s = e.prevent,
            l = e.once,
            p = !1,
            c = [],
            d = !0;
        if (0 <= (a = n.indexOf("(") < 0 ? n : n.split("(")[0]).indexOf(".")) a.split(".").forEach(function(e, t) {
            if (0 !== t || "this" !== e) {
                if (0 === t && "window" === e) return i = win, void(d = !1);
                if (i || (i = r), !i[e]) throw new Error("Framework7: Component doesn't have method \"" + a.split(".").slice(0, t + 1).join(".") + '"');
                i = i[e]
            }
        });
        else {
            if (!r[a]) throw new Error("Framework7: Component doesn't have method \"" + a + '"');
            i = r[a]
        }
        return d && (i = i.bind(r)),
            function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                var a = e[0];
                l && p || (o && a.stopPropagation(), s && a.preventDefault(), p = !0, n.indexOf("(") < 0 ? c = e : n.split("(")[1].split(")")[0].split(",").forEach(function(e) {
                    var t = e.trim();
                    if (isNaN(t))
                        if ("true" === t) t = !0;
                        else if ("false" === t) t = !1;
                    else if ("null" === t) t = null;
                    else if ("undefined" === t) t = void 0;
                    else if ('"' === t[0]) t = t.replace(/"/g, "");
                    else if ("'" === t[0]) t = t.replace(/'/g, "");
                    else if (0 < t.indexOf(".")) {
                        var a;
                        t.split(".").forEach(function(e) { a || (a = r), a = a[e] }), t = a
                    } else t = r[t];
                    else t = parseFloat(t);
                    c.push(t)
                }), i.apply(void 0, c))
            }
    }

    function getData(e, s, t, a, l) {
        var p = { context: s },
            n = e.attributes;
        Array.prototype.forEach.call(n, function(e) {
            var t = e.name,
                a = e.value;
            if (0 <= propsAttrs.indexOf(t)) p.props || (p.props = {}), "readonly" === t && (t = "readOnly"), 0 <= booleanProps.indexOf(t) ? p.props[t] = !1 !== a : p.props[t] = a;
            else if ("key" === t) p.key = a;
            else if (0 === t.indexOf("@")) {
                p.on || (p.on = {});
                var n = t.substr(1),
                    r = !1,
                    i = !1,
                    o = !1;
                0 <= n.indexOf(".") && n.split(".").forEach(function(e, t) { 0 === t ? n = e : ("stop" === e && (r = !0), "prevent" === e && (i = !0), "once" === e && (o = !0)) }), p.on[n] = getEventHandler(a, s, { stop: r, prevent: i, once: o })
            } else if ("style" === t)
                if (0 <= a.indexOf("{") && 0 <= a.indexOf("}")) try { p.style = JSON.parse(a) } catch (e) { p.attrs || (p.attrs = {}), p.attrs.style = a } else p.attrs || (p.attrs = {}), p.attrs.style = a;
                else p.attrs || (p.attrs = {}), p.attrs[t] = a, "id" !== t || p.key || l || (p.key = a)
        });
        var r = getHooks(p, t, a, l);
        return r.prepatch = function(t, a) { t && a && t && t.data && t.data.props && Object.keys(t.data.props).forEach(function(e) { booleanProps.indexOf(e) < 0 || (a.data || (a.data = {}), a.data.props || (a.data.props = {}), !0 !== t.data.props[e] || e in a.data.props || (a.data.props[e] = !1)) }) }, r && (p.hook = r), p
    }

    function getChildren(e, t, a, n) {
        for (var r = [], i = e.childNodes, o = 0; o < i.length; o += 1) {
            var s = elementToVNode(i[o], t, a, n);
            s && r.push(s)
        }
        return r
    }

    function elementToVNode(e, t, a, n, r) { if (1 !== e.nodeType) return 3 === e.nodeType ? e.textContent : null; var i = e.nodeName.toLowerCase(); return h(i, getData(e, t, a, n, r), 0 <= selfClosing.indexOf(i) ? [] : getChildren(e, t, a, n)) }

    function vdom(e, t, a, n) {
        var r;
        void 0 === e && (e = ""), tempDom.innerHTML = e.trim();
        for (var i = 0; i < tempDom.childNodes.length; i += 1) r || 1 !== tempDom.childNodes[i].nodeType || (r = tempDom.childNodes[i]);
        var o = elementToVNode(r, t, a, n, !0);
        return tempDom.innerHTML = "", o
    }

    function createElement(e) { return document.createElement(e) }

    function createElementNS(e, t) { return document.createElementNS(e, t) }

    function createTextNode(e) { return document.createTextNode(e) }

    function createComment(e) { return document.createComment(e) }

    function insertBefore$1(e, t, a) { e.insertBefore(t, a) }

    function removeChild(e, t) { e && e.removeChild(t) }

    function appendChild(e, t) { e.appendChild(t) }

    function parentNode(e) { return e.parentNode }

    function nextSibling(e) { return e.nextSibling }

    function tagName(e) { return e.tagName }

    function setTextContent(e, t) { e.textContent = t }

    function getTextContent(e) { return e.textContent }

    function isElement(e) { return 1 === e.nodeType }

    function isText(e) { return 3 === e.nodeType }

    function isComment(e) { return 8 === e.nodeType }
    var htmlDomApi = { createElement: createElement, createElementNS: createElementNS, createTextNode: createTextNode, createComment: createComment, insertBefore: insertBefore$1, removeChild: removeChild, appendChild: appendChild, parentNode: parentNode, nextSibling: nextSibling, tagName: tagName, setTextContent: setTextContent, getTextContent: getTextContent, isElement: isElement, isText: isText, isComment: isComment };

    function isUndef(e) { return void 0 === e }

    function isDef(e) { return void 0 !== e }
    var emptyNode = vnode("", {}, [], void 0, void 0);

    function sameVnode(e, t) { return e.key === t.key && e.sel === t.sel }

    function isVnode(e) { return void 0 !== e.sel }

    function createKeyToOldIdx(e, t, a) { var n, r, i, o = {}; for (n = t; n <= a; ++n) null != (i = e[n]) && void 0 !== (r = i.key) && (o[r] = n); return o }
    var hooks = ["create", "update", "remove", "destroy", "pre", "post"];

    function init$1(e, t) {
        var a, n, h = {},
            m = void 0 !== t ? t : htmlDomApi;
        for (a = 0; a < hooks.length; ++a)
            for (h[hooks[a]] = [], n = 0; n < e.length; ++n) {
                var r = e[n][hooks[a]];
                void 0 !== r && h[hooks[a]].push(r)
            }

        function l(t, a) {
            return function() {
                if (0 == --a) {
                    var e = m.parentNode(t);
                    m.removeChild(e, t)
                }
            }
        }

        function v(e, t) {
            var a, n = e.data;
            void 0 !== n && isDef(a = n.hook) && isDef(a = a.init) && (a(e), n = e.data);
            var r = e.children,
                i = e.sel;
            if ("!" === i) isUndef(e.text) && (e.text = ""), e.elm = m.createComment(e.text);
            else if (void 0 !== i) {
                var o = i.indexOf("#"),
                    s = i.indexOf(".", o),
                    l = 0 < o ? o : i.length,
                    p = 0 < s ? s : i.length,
                    c = -1 !== o || -1 !== s ? i.slice(0, Math.min(l, p)) : i,
                    d = e.elm = isDef(n) && isDef(a = n.ns) ? m.createElementNS(a, c) : m.createElement(c);
                for (l < p && d.setAttribute("id", i.slice(l + 1, p)), 0 < s && d.setAttribute("class", i.slice(p + 1).replace(/\./g, " ")), a = 0; a < h.create.length; ++a) h.create[a](emptyNode, e);
                if (array(r))
                    for (a = 0; a < r.length; ++a) {
                        var u = r[a];
                        null != u && m.appendChild(d, v(u, t))
                    } else primitive(e.text) && m.appendChild(d, m.createTextNode(e.text));
                isDef(a = e.data.hook) && (a.create && a.create(emptyNode, e), a.insert && t.push(e))
            } else e.elm = m.createTextNode(e.text);
            return e.elm
        }

        function g(e, t, a, n, r, i) {
            for (; n <= r; ++n) {
                var o = a[n];
                null != o && m.insertBefore(e, v(o, i), t)
            }
        }

        function p(e) {
            var t, a, n = e.data;
            if (void 0 !== n) {
                for (isDef(t = n.hook) && isDef(t = t.destroy) && t(e), t = 0; t < h.destroy.length; ++t) h.destroy[t](e);
                if (void 0 !== e.children)
                    for (a = 0; a < e.children.length; ++a) null != (t = e.children[a]) && "string" != typeof t && p(t)
            }
        }

        function b(e, t, a, n) {
            for (; a <= n; ++a) {
                var r = void 0,
                    i = void 0,
                    o = void 0,
                    s = t[a];
                if (null != s)
                    if (isDef(s.sel)) {
                        for (p(s), i = h.remove.length + 1, o = l(s.elm, i), r = 0; r < h.remove.length; ++r) h.remove[r](s, o);
                        isDef(r = s.data) && isDef(r = r.hook) && isDef(r = r.remove) ? r(s, o) : o()
                    } else m.removeChild(e, s.elm)
            }
        }

        function y(e, t, a) {
            var n, r;
            isDef(n = t.data) && isDef(r = n.hook) && isDef(n = r.prepatch) && n(e, t);
            var i = t.elm = e.elm,
                o = e.children,
                s = t.children;
            if (e !== t) {
                if (void 0 !== t.data) {
                    for (n = 0; n < h.update.length; ++n) h.update[n](e, t);
                    isDef(n = t.data.hook) && isDef(n = n.update) && n(e, t)
                }
                isUndef(t.text) ? isDef(o) && isDef(s) ? o !== s && function(e, t, a, n) {
                    for (var r, i, o, s = 0, l = 0, p = t.length - 1, c = t[0], d = t[p], u = a.length - 1, h = a[0], f = a[u]; s <= p && l <= u;) null == c ? c = t[++s] : null == d ? d = t[--p] : null == h ? h = a[++l] : null == f ? f = a[--u] : sameVnode(c, h) ? (y(c, h, n), c = t[++s], h = a[++l]) : sameVnode(d, f) ? (y(d, f, n), d = t[--p], f = a[--u]) : sameVnode(c, f) ? (y(c, f, n), m.insertBefore(e, c.elm, m.nextSibling(d.elm)), c = t[++s], f = a[--u]) : (sameVnode(d, h) ? (y(d, h, n), m.insertBefore(e, d.elm, c.elm), d = t[--p]) : (void 0 === r && (r = createKeyToOldIdx(t, s, p)), isUndef(i = r[h.key]) ? m.insertBefore(e, v(h, n), c.elm) : (o = t[i]).sel !== h.sel ? m.insertBefore(e, v(h, n), c.elm) : (y(o, h, n), t[i] = void 0, m.insertBefore(e, o.elm, c.elm))), h = a[++l]);
                    (s <= p || l <= u) && (p < s ? g(e, null == a[u + 1] ? null : a[u + 1].elm, a, l, u, n) : b(e, t, s, p))
                }(i, o, s, a) : isDef(s) ? (isDef(e.text) && m.setTextContent(i, ""), g(i, null, s, 0, s.length - 1, a)) : isDef(o) ? b(i, o, 0, o.length - 1) : isDef(e.text) && m.setTextContent(i, "") : e.text !== t.text && m.setTextContent(i, t.text), isDef(r) && isDef(n = r.postpatch) && n(e, t)
            }
        }
        return function(e, t) { var a, n, r, i, o, s, l = []; for (a = 0; a < h.pre.length; ++a) h.pre[a](); for (isVnode(e) || (o = (i = e).id ? "#" + i.id : "", s = i.className ? "." + i.className.split(" ").join(".") : "", e = vnode(m.tagName(i).toLowerCase() + o + s, {}, [], void 0, i)), sameVnode(e, t) ? y(e, t, l) : (n = e.elm, r = m.parentNode(n), v(t, l), null !== r && (m.insertBefore(r, t.elm, m.nextSibling(n)), b(r, [e], 0, 0))), a = 0; a < l.length; ++a) l[a].data.hook.insert(l[a]); for (a = 0; a < h.post.length; ++a) h.post[a](); return t }
    }
    var xlinkNS = "http://www.w3.org/1999/xlink",
        xmlNS = "http://www.w3.org/XML/1998/namespace",
        colonChar = 58,
        xChar = 120;

    function updateAttrs(e, t) {
        var a, n = t.elm,
            r = e.data.attrs,
            i = t.data.attrs;
        if ((r || i) && r !== i) {
            for (a in r = r || {}, i = i || {}) {
                var o = i[a];
                r[a] !== o && (!0 === o ? n.setAttribute(a, "") : !1 === o ? n.removeAttribute(a) : a.charCodeAt(0) !== xChar ? n.setAttribute(a, o) : a.charCodeAt(3) === colonChar ? n.setAttributeNS(xmlNS, a, o) : a.charCodeAt(5) === colonChar ? n.setAttributeNS(xlinkNS, a, o) : n.setAttribute(a, o))
            }
            for (a in r) a in i || n.removeAttribute(a)
        }
    }
    var attributesModule = { create: updateAttrs, update: updateAttrs };

    function updateProps(e, t) {
        var a, n, r = t.elm,
            i = e.data.props,
            o = t.data.props;
        if ((i || o) && i !== o) { for (a in o = o || {}, i = i || {}) o[a] || delete r[a]; for (a in o) n = o[a], i[a] === n || "value" === a && r[a] === n || (r[a] = n) }
    }
    var propsModule = { create: updateProps, update: updateProps },
        raf = "undefined" != typeof window && window.requestAnimationFrame || setTimeout,
        nextFrame = function(e) { raf(function() { raf(e) }) };

    function setNextFrame(e, t, a) { nextFrame(function() { e[t] = a }) }

    function updateStyle(e, t) {
        var a, n, r = t.elm,
            i = e.data.style,
            o = t.data.style;
        if ((i || o) && i !== o) {
            o = o || {};
            var s = "delayed" in (i = i || {});
            for (n in i) o[n] || ("-" === n[0] && "-" === n[1] ? r.style.removeProperty(n) : r.style[n] = "");
            for (n in o)
                if (a = o[n], "delayed" === n && o.delayed)
                    for (var l in o.delayed) a = o.delayed[l], s && a === i.delayed[l] || setNextFrame(r.style, l, a);
                else "remove" !== n && a !== i[n] && ("-" === n[0] && "-" === n[1] ? r.style.setProperty(n, a) : r.style[n] = a)
        }
    }

    function applyDestroyStyle(e) {
        var t, a, n = e.elm,
            r = e.data.style;
        if (r && (t = r.destroy))
            for (a in t) n.style[a] = t[a]
    }

    function applyRemoveStyle(e, t) {
        var a = e.data.style;
        if (a && a.remove) {
            var n, r = e.elm,
                i = 0,
                o = a.remove,
                s = 0,
                l = [];
            for (n in o) l.push(n), r.style[n] = o[n];
            for (var p = getComputedStyle(r)["transition-property"].split(", "); i < p.length; ++i) - 1 !== l.indexOf(p[i]) && s++;
            r.addEventListener("transitionend", function(e) { e.target === r && --s, 0 === s && t() })
        } else t()
    }
    var styleModule = { create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle };

    function invokeHandler(e, t, a) { "function" == typeof e && e.apply(void 0, [t].concat(a)) }

    function handleEvent(e, t, a) {
        var n = e.type,
            r = a.data.on;
        r && r[n] && invokeHandler(r[n], e, t, a)
    }

    function createListener() {
        return function e(t) {
            for (var a = [], n = arguments.length - 1; 0 < n--;) a[n] = arguments[n + 1];
            handleEvent(t, a, e.vnode)
        }
    }

    function updateEvents(e, t) {
        var a = e.data.on,
            n = e.listener,
            r = e.elm,
            i = t && t.data.on,
            o = t && t.elm;
        if (a !== i && (a && n && (i ? Object.keys(a).forEach(function(e) { i[e] || $(r).off(e, n) }) : Object.keys(a).forEach(function(e) { $(r).off(e, n) })), i)) {
            var s = e.listener || createListener();
            (t.listener = s).vnode = t, a ? Object.keys(i).forEach(function(e) { a[e] || $(o).on(e, s) }) : Object.keys(i).forEach(function(e) { $(o).on(e, s) })
        }
    }
    var eventListenersModule = { create: updateEvents, update: updateEvents, destroy: updateEvents },
        patch = init$1([attributesModule, propsModule, styleModule, eventListenersModule]),
        Framework7Component = function(n, e, t) {
            void 0 === t && (t = {});
            var a = Utils.id(),
                r = Utils.merge(this, t, { $: $, $$: $, $dom7: $, $app: n, $options: Utils.extend({ id: a }, e) }),
                i = r.$options;
            Object.defineProperty(r, "$root", { enumerable: !0, configurable: !0, get: function() { var e = Utils.merge({}, n.data, n.methods); return win && win.Proxy && (e = new win.Proxy(e, { set: function(e, t, a) { n.data[t] = a }, deleteProperty: function(e, t) { delete n.data[t], delete n.methods[t] }, has: function(e, t) { return t in n.data || t in n.methods } })), e }, set: function() {} }), "beforeCreate created beforeMount mounted beforeDestroy destroyed updated".split(" ").forEach(function(e) { i[e] && (i[e] = i[e].bind(r)) }), i.data && (i.data = i.data.bind(r), Utils.extend(r, i.data())), i.render && (i.render = i.render.bind(r)), i.methods && Object.keys(i.methods).forEach(function(e) { r[e] = i.methods[e].bind(r) }), i.on && Object.keys(i.on).forEach(function(e) { i.on[e] = i.on[e].bind(r) }), i.once && Object.keys(i.once).forEach(function(e) { i.once[e] = i.once[e].bind(r) }), i.beforeCreate && i.beforeCreate();
            var o = r.$render();
            return o && "string" == typeof o ? (o = o.trim(), r.$vnode = vdom(o, r, n, !0), r.el = doc.createElement("div"), patch(r.el, r.$vnode)) : o && (r.el = o), r.$el = $(r.el), i.style && (r.$styleEl = doc.createElement("style"), r.$styleEl.innerHTML = i.style, i.styleScoped && r.el.setAttribute("data-f7-" + i.id, "")), r.$attachEvents(), i.created && i.created(), r.el.f7Component = r
        };

    function parseComponent(e) {
        var t, a = Utils.id(),
            n = "f7_component_create_callback_" + a,
            r = "f7_component_render_callback_" + a,
            i = e.match(/<template([ ]?)([a-z0-9-]*)>/),
            o = i[2] || "t7";
        i && (t = e.split(/<template[ ]?[a-z0-9-]*>/).filter(function(e, t) { return 0 < t }).join("<template>").split("</template>").filter(function(e, t, a) { return t < a.length - 1 }).join("</template>").replace(/{{#raw}}([ \n]*)<template/g, "{{#raw}}<template").replace(/\/template>([ \n]*){{\/raw}}/g, "/template>{{/raw}}").replace(/([ \n])<template/g, "$1{{#raw}}<template").replace(/\/template>([ \n])/g, "/template>{{/raw}}$1"));
        var s, l, p = null,
            c = !1;
        if (0 <= e.indexOf("<style>") ? p = e.split("<style>")[1].split("</style>")[0] : 0 <= e.indexOf("<style scoped>") && (c = !0, p = (p = e.split("<style scoped>")[1].split("</style>")[0]).split("\n").map(function(e) { return 0 === e.trim().indexOf("@") ? e : 0 <= e.indexOf("{") ? 0 <= e.indexOf("{{this}}") ? e.replace("{{this}}", "[data-f7-" + a + "]") : "[data-f7-" + a + "] " + e.trim() : e }).join("\n")), 0 <= e.indexOf("<script>")) {
            var d = e.split("<script>");
            s = d[d.length - 1].split("<\/script>")[0].trim()
        } else s = "return {}";
        s && s.trim() || (s = "return {}"), s = "window." + n + " = function () {" + s + "}", (l = doc.createElement("script")).innerHTML = s, $("head").append(l);
        var u = win[n]();
        if ($(l).remove(), win[n] = null, delete win[n], u.template || u.render || (u.template = t, u.templateType = o), u.template && ("t7" === u.templateType && (u.template = Template7.compile(u.template)), "es" === u.templateType)) {
            var h = "window." + r + " = function () {\n        return function render() {\n          return `" + u.template + "`;\n        }\n      }";
            (l = doc.createElement("script")).innerHTML = h, $("head").append(l), u.render = win[r](), $(l).remove(), win[r] = null, delete win[r]
        }
        return p && (u.style = p, u.styleScoped = c), u.id = a, u
    }
    Framework7Component.prototype.$attachEvents = function() {
        var t = this.$options,
            a = this.$el;
        t.on && Object.keys(t.on).forEach(function(e) { a.on(Utils.eventNameToColonCase(e), t.on[e]) }), t.once && Object.keys(t.once).forEach(function(e) { a.once(Utils.eventNameToColonCase(e), t.once[e]) })
    }, Framework7Component.prototype.$detachEvents = function() {
        var t = this.$options,
            a = this.$el;
        t.on && Object.keys(t.on).forEach(function(e) { a.off(Utils.eventNameToColonCase(e), t.on[e]) }), t.once && Object.keys(t.once).forEach(function(e) { a.off(Utils.eventNameToColonCase(e), t.once[e]) })
    }, Framework7Component.prototype.$render = function() {
        var e = this.$options,
            t = "";
        if (e.render) t = e.render();
        else if (e.template)
            if ("string" == typeof e.template) try { t = Template7.compile(e.template)(this) } catch (e) { throw e } else t = e.template(this);
        return t
    }, Framework7Component.prototype.$forceUpdate = function() {
        var e = this,
            t = e.$render();
        if (t && "string" == typeof t) {
            var a = vdom(t = t.trim(), e, e.$app);
            e.$vnode = patch(e.$vnode, a)
        }
    }, Framework7Component.prototype.$setState = function(e) { Utils.merge(this, e), this.$forceUpdate() }, Framework7Component.prototype.$mount = function(e) {
        var t = this;
        t.$options.beforeMount && t.$options.beforeMount(), t.$styleEl && $("head").append(t.$styleEl), e && e(t.el), t.$options.mounted && t.$options.mounted()
    }, Framework7Component.prototype.$destroy = function() {
        var e = this;
        e.$options.beforeDestroy && e.$options.beforeDestroy(), e.$styleEl && $(e.$styleEl).remove(), e.$detachEvents(), e.$options.destroyed && e.$options.destroyed(), e.el && e.el.f7Component && (e.el.f7Component = null, delete e.el.f7Component), e.$vnode && (e.$vnode = patch(e.$vnode, { sel: e.$vnode.sel, data: {} })), Utils.deleteProps(e)
    };
    var ComponentModule = {
            name: "component",
            create: function() {
                var a = this;
                a.component = { parse: function(e) { return parseComponent(e) }, create: function(e, t) { return new Framework7Component(a, e, t) } }
            }
        },
        Statusbar = {
            hide: function() { $("html").removeClass("with-statusbar"), Device.cordova && win.StatusBar && win.StatusBar.hide() },
            show: function() {
                if (Device.cordova && win.StatusBar) return win.StatusBar.show(), void Utils.nextTick(function() { Device.needsStatusbarOverlay() && $("html").addClass("with-statusbar") });
                $("html").addClass("with-statusbar")
            },
            onClick: function() {
                var e;
                (e = 0 < $(".popup.modal-in").length ? $(".popup.modal-in").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : 0 < $(".panel.panel-active").length ? $(".panel.panel-active").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : 0 < $(".views > .view.tab-active").length ? $(".views > .view.tab-active").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : 0 < $(".views").length ? $(".views").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : this.root.children(".view").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content")) && 0 < e.length && (e.hasClass("tab") && (e = e.parent(".tabs").children(".page-content.tab-active")), 0 < e.length && e.scrollTop(0, 300))
            },
            setTextColor: function(e) { Device.cordova && win.StatusBar && ("white" === e ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault()) },
            setIosTextColor: function(e) { Device.ios && Statusbar.setTextColor(e) },
            setBackgroundColor: function(e) { $(".statusbar").css("background-color", e), Device.cordova && win.StatusBar && win.StatusBar.backgroundColorByHexString(e) },
            isVisible: function() { return !(!Device.cordova || !win.StatusBar) && win.StatusBar.isVisible },
            overlaysWebView: function(e) { void 0 === e && (e = !0), Device.cordova && win.StatusBar && (win.StatusBar.overlaysWebView(e), e ? $("html").addClass("with-statusbar") : $("html").removeClass("with-statusbar")) },
            iosOverlaysWebView: function(e) { Device.ios && Statusbar.overlaysWebView(e) },
            checkOverlay: function() { Device.needsStatusbarOverlay() ? $("html").addClass("with-statusbar") : $("html").removeClass("with-statusbar") },
            init: function() {
                var e = this.params.statusbar;
                e.enabled && ("auto" === e.overlay ? (Device.needsStatusbarOverlay() ? $("html").addClass("with-statusbar") : $("html").removeClass("with-statusbar"), Device.ios && (Device.cordova || Device.webView) && (0 === win.orientation && this.once("resize", function() { Statusbar.checkOverlay() }), $(doc).on("resume", function() { Statusbar.checkOverlay() }, !1), this.on(Device.ios ? "orientationchange" : "orientationchange resize", function() { Statusbar.checkOverlay() }))) : !0 === e.overlay ? $("html").addClass("with-statusbar") : !1 === e.overlay && $("html").removeClass("with-statusbar"), Device.cordova && win.StatusBar && (e.scrollTopOnClick && $(win).on("statusTap", Statusbar.onClick.bind(this)), Device.ios && (e.iosOverlaysWebView ? win.StatusBar.overlaysWebView(!0) : win.StatusBar.overlaysWebView(!1), "white" === e.iosTextColor ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault()), Device.android && (e.androidOverlaysWebView ? win.StatusBar.overlaysWebView(!0) : win.StatusBar.overlaysWebView(!1), "white" === e.androidTextColor ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault())), e.iosBackgroundColor && Device.ios && Statusbar.setBackgroundColor(e.iosBackgroundColor), (e.materialBackgroundColor || e.androidBackgroundColor) && Device.android && Statusbar.setBackgroundColor(e.materialBackgroundColor || e.androidBackgroundColor))
            }
        },
        Statusbar$1 = { name: "statusbar", params: { statusbar: { enabled: !0, overlay: "auto", scrollTopOnClick: !0, iosOverlaysWebView: !0, iosTextColor: "black", iosBackgroundColor: null, androidOverlaysWebView: !1, androidTextColor: "black", androidBackgroundColor: null } }, create: function() { Utils.extend(this, { statusbar: { checkOverlay: Statusbar.checkOverlay, hide: Statusbar.hide, show: Statusbar.show, overlaysWebView: Statusbar.overlaysWebView, setTextColor: Statusbar.setTextColor, setBackgroundColor: Statusbar.setBackgroundColor, isVisible: Statusbar.isVisible, init: Statusbar.init.bind(this), iosOverlaysWebView: Statusbar.iosOverlaysWebView, setIosTextColor: Statusbar.iosSetTextColor } }) }, on: { init: function() { Statusbar.init.call(this) } }, clicks: { ".statusbar": function() { this.params.statusbar.enabled && this.params.statusbar.scrollTopOnClick && Statusbar.onClick.call(this) } } };

    function getCurrentView(e) {
        var t = $(".popover.modal-in .view"),
            a = $(".popup.modal-in .view"),
            n = $(".panel.panel-active .view"),
            r = $(".views");
        0 === r.length && (r = e.root);
        var i = r.children(".view");
        if (1 < i.length && i.hasClass("tab") && (i = r.children(".view.tab-active")), 0 < t.length && t[0].f7View) return t[0].f7View;
        if (0 < a.length && a[0].f7View) return a[0].f7View;
        if (0 < n.length && n[0].f7View) return n[0].f7View;
        if (0 < i.length) { if (1 === i.length && i[0].f7View) return i[0].f7View; if (1 < i.length) return e.views.main }
    }
    var View$1 = {
            name: "view",
            params: { view: { name: void 0, main: !1, router: !0, linksView: null, stackPages: !1, xhrCache: !0, xhrCacheIgnore: [], xhrCacheIgnoreGetParameters: !1, xhrCacheDuration: 6e5, preloadPreviousPage: !0, allowDuplicateUrls: !1, reloadPages: !1, removeElements: !0, removeElementsWithTimeout: !1, removeElementsTimeout: 0, restoreScrollTopOnBack: !0, unloadTabContent: !0, passRouteQueryToRequest: !0, passRouteParamsToRequest: !1, iosSwipeBack: !0, iosSwipeBackAnimateShadow: !0, iosSwipeBackAnimateOpacity: !0, iosSwipeBackActiveArea: 30, iosSwipeBackThreshold: 0, mdSwipeBack: !1, mdSwipeBackAnimateShadow: !0, mdSwipeBackAnimateOpacity: !1, mdSwipeBackActiveArea: 30, mdSwipeBackThreshold: 0, pushState: !1, pushStateRoot: void 0, pushStateAnimate: !0, pushStateAnimateOnLoad: !1, pushStateSeparator: "#!", pushStateOnLoad: !0, animate: !0, animateWithJS: !1, iosDynamicNavbar: !0, iosSeparateDynamicNavbar: !0, iosAnimateNavbarBackIcon: !0, iosPageLoadDelay: 0, materialPageLoadDelay: 0, routesBeforeEnter: null, routesBeforeLeave: null } },
            static: { View: View },
            create: function() {
                var a = this;
                Utils.extend(a, { views: Utils.extend([], { create: function(e, t) { return new View(a, e, t) }, get: function(e) { var t = $(e); if (t.length && t[0].f7View) return t[0].f7View } }) }), Object.defineProperty(a.views, "current", { enumerable: !0, configurable: !0, get: function() { return getCurrentView(a) } }), a.view = a.views
            },
            on: {
                init: function() {
                    var n = this;
                    $(".view-init").each(function(e, t) {
                        if (!t.f7View) {
                            var a = $(t).dataset();
                            n.views.create(t, a)
                        }
                    })
                },
                modalOpen: function(e) {
                    var n = this;
                    e.$el.find(".view-init").each(function(e, t) {
                        if (!t.f7View) {
                            var a = $(t).dataset();
                            n.views.create(t, a)
                        }
                    })
                },
                modalBeforeDestroy: function(e) {
                    e && e.$el && e.$el.find(".view-init").each(function(e, t) {
                        var a = t.f7View;
                        a && a.destroy()
                    })
                }
            }
        },
        Navbar = {
            size: function(e) {
                var a = this;
                if ("ios" === a.theme) {
                    var t = $(e);
                    if (t.hasClass("navbar")) t = t.children(".navbar-inner").each(function(e, t) { a.navbar.size(t) });
                    else if (!(t.hasClass("stacked") || 0 < t.parents(".stacked").length || 0 < t.parents(".tab:not(.tab-active)").length || 0 < t.parents(".popup:not(.modal-in)").length)) {
                        var n, r, i, o, s = t.parents(".view").eq(0),
                            l = a.rtl ? t.children(".right") : t.children(".left"),
                            p = a.rtl ? t.children(".left") : t.children(".right"),
                            c = t.children(".title"),
                            d = t.children(".subnavbar"),
                            u = 0 === l.length,
                            h = 0 === p.length,
                            f = u ? 0 : l.outerWidth(!0),
                            m = h ? 0 : p.outerWidth(!0),
                            v = c.outerWidth(!0),
                            g = t.styles(),
                            b = t[0].offsetWidth,
                            y = b - parseInt(g.paddingLeft, 10) - parseInt(g.paddingRight, 10),
                            w = t.hasClass("navbar-previous"),
                            C = t.hasClass("sliding"),
                            x = 0,
                            E = 0;
                        0 < s.length && s[0].f7View && (r = (n = s[0].f7View.router) && n.dynamicNavbar, n && n.separateNavbar || (E = (x = b) / 5)), h && (i = y - v), u && (i = 0), u || h || (i = (y - m - v + f) / 2);
                        var k = (y - v) / 2;
                        o = v < y - f - m ? (k < f && (k = f), y - m < k + v && (k = y - m - v), k - i) : 0;
                        var S = a.rtl ? -1 : 1;
                        if (r) {
                            if (c.hasClass("sliding") || 0 < c.length && C) {
                                var T = -(i + o) * S + E,
                                    M = (y - i - o - v) * S - x;
                                if (w && n && n.params.iosAnimateNavbarBackIcon) {
                                    var P = t.parent().find(".navbar-current").children(".left.sliding").find(".back .icon ~ span");
                                    0 < P.length && (T += P[0].offsetLeft)
                                }
                                c[0].f7NavbarLeftOffset = T, c[0].f7NavbarRightOffset = M
                            }
                            u || !l.hasClass("sliding") && !C || (a.rtl ? (l[0].f7NavbarLeftOffset = -(y - l[0].offsetWidth) / 2 * S, l[0].f7NavbarRightOffset = f * S) : (l[0].f7NavbarLeftOffset = -f + E, l[0].f7NavbarRightOffset = (y - l[0].offsetWidth) / 2 - x, n && n.params.iosAnimateNavbarBackIcon && 0 < l.find(".back .icon").length && (l[0].f7NavbarRightOffset -= l.find(".back .icon")[0].offsetWidth))), h || !p.hasClass("sliding") && !C || (a.rtl ? (p[0].f7NavbarLeftOffset = -m * S, p[0].f7NavbarRightOffset = (y - p[0].offsetWidth) / 2 * S) : (p[0].f7NavbarLeftOffset = -(y - p[0].offsetWidth) / 2 + E, p[0].f7NavbarRightOffset = m - x)), d.length && (d.hasClass("sliding") || C) && (d[0].f7NavbarLeftOffset = a.rtl ? d[0].offsetWidth : -d[0].offsetWidth + E, d[0].f7NavbarRightOffset = -d[0].f7NavbarLeftOffset - x + E)
                        }
                        if (a.params.navbar.iosCenterTitle) {
                            var O = o;
                            a.rtl && u && h && 0 < c.length && (O = -O), c.css({ left: O + "px" })
                        }
                    }
                }
            },
            hide: function(e, t) {
                void 0 === t && (t = !0);
                var a = $(e);
                if (a.hasClass("navbar-inner") && (a = a.parents(".navbar")), a.length && !a.hasClass("navbar-hidden")) {
                    var n = "navbar-hidden" + (t ? " navbar-transitioning" : "");
                    a.transitionEnd(function() { a.removeClass("navbar-transitioning") }), a.addClass(n)
                }
            },
            show: function(e, t) {
                void 0 === e && (e = ".navbar-hidden"), void 0 === t && (t = !0);
                var a = $(e);
                a.hasClass("navbar-inner") && (a = a.parents(".navbar")), a.length && a.hasClass("navbar-hidden") && (t && (a.addClass("navbar-transitioning"), a.transitionEnd(function() { a.removeClass("navbar-transitioning") })), a.removeClass("navbar-hidden"))
            },
            getElByPage: function(e) { var t, a, n; if (e.$navbarEl || e.$el ? t = (n = e).$el : 0 < (t = $(e)).length && (n = t[0].f7Page), n && n.$navbarEl && 0 < n.$navbarEl.length ? a = n.$navbarEl : t && (a = t.children(".navbar").children(".navbar-inner")), a && (!a || 0 !== a.length)) return a[0] },
            getPageByEl: function(e) { var t = $(e); if (!(t.hasClass("navbar") && 1 < (t = t.find(".navbar-inner")).length)) return t[0].f7Page },
            initHideNavbarOnScroll: function(e, t) {
                var a, n, r, i, o, s, l, p = this,
                    c = $(e),
                    d = $(t || p.navbar.getElByPage(e)).closest(".navbar");

                function u() { c.hasClass("page-previous") || (n = this.scrollTop, r = this.scrollHeight, i = this.offsetHeight, o = r <= n + i, l = d.hasClass("navbar-hidden"), o ? p.params.navbar.showOnPageScrollEnd && (s = "show") : s = n < a ? p.params.navbar.showOnPageScrollTop || n <= 44 ? "show" : "hide" : 44 < n ? "hide" : "show", "show" === s && l ? (p.navbar.show(d), l = !1) : "hide" !== s || l || (p.navbar.hide(d), l = !0), a = n) }
                c.on("scroll", ".page-content", u, !0), c[0].f7ScrollNavbarHandler = u
            }
        },
        Navbar$1 = {
            name: "navbar",
            create: function() {
                var e = this;
                Utils.extend(e, { navbar: { size: Navbar.size.bind(e), hide: Navbar.hide.bind(e), show: Navbar.show.bind(e), getElByPage: Navbar.getElByPage.bind(e), initHideNavbarOnScroll: Navbar.initHideNavbarOnScroll.bind(e) } })
            },
            params: { navbar: { scrollTopOnTitleClick: !0, iosCenterTitle: !0, hideOnPageScroll: !1, showOnPageScrollEnd: !0, showOnPageScrollTop: !0 } },
            on: {
                "panelBreakpoint resize": function() { var a = this; "ios" === a.theme && $(".navbar").each(function(e, t) { a.navbar.size(t) }) },
                pageBeforeRemove: function(e) { e.$el[0].f7ScrollNavbarHandler && e.$el.off("scroll", ".page-content", e.$el[0].f7ScrollNavbarHandler, !0) },
                pageBeforeIn: function(e) {
                    if ("ios" === this.theme) {
                        var t, a = e.$el.parents(".view")[0].f7View,
                            n = this.navbar.getElByPage(e);
                        if (t = n ? $(n).parents(".navbar") : e.$el.parents(".view").children(".navbar"), e.$el.hasClass("no-navbar") || a.router.dynamicNavbar && !n) {
                            var r = !!(e.pageFrom && 0 < e.router.history.length);
                            this.navbar.hide(t, r)
                        } else this.navbar.show(t)
                    }
                },
                pageReinit: function(e) {
                    if ("ios" === this.theme) {
                        var t = $(this.navbar.getElByPage(e));
                        t && 0 !== t.length && this.navbar.size(t)
                    }
                },
                pageInit: function(e) {
                    var t = this,
                        a = $(t.navbar.getElByPage(e));
                    if (a && 0 !== a.length && ("ios" === t.theme && t.navbar.size(a), t.params.navbar.hideOnPageScroll || e.$el.find(".hide-navbar-on-scroll").length || e.$el.hasClass("hide-navbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll"))) {
                        if (e.$el.find(".keep-navbar-on-scroll").length || e.$el.hasClass("keep-navbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll")) return;
                        t.navbar.initHideNavbarOnScroll(e.el, a[0])
                    }
                },
                modalOpen: function(e) { var a = this; "ios" === a.theme && e.$el.find(".navbar:not(.navbar-previous):not(.stacked)").each(function(e, t) { a.navbar.size(t) }) },
                panelOpen: function(e) { var a = this; "ios" === a.theme && e.$el.find(".navbar:not(.navbar-previous):not(.stacked)").each(function(e, t) { a.navbar.size(t) }) },
                panelSwipeOpen: function(e) { var a = this; "ios" === a.theme && e.$el.find(".navbar:not(.navbar-previous):not(.stacked)").each(function(e, t) { a.navbar.size(t) }) },
                tabShow: function(e) {
                    var a = this;
                    $(e).find(".navbar:not(.navbar-previous):not(.stacked)").each(function(e, t) { a.navbar.size(t) })
                }
            },
            clicks: {
                ".navbar .title": function(e) {
                    if (this.params.navbar.scrollTopOnTitleClick && !(0 < e.closest("a").length)) {
                        var t, a = e.parents(".navbar");
                        0 === (t = a.parents(".page-content")).length && (0 < a.parents(".page").length && (t = a.parents(".page").find(".page-content")), 0 === t.length && 0 < a.nextAll(".page-current:not(.stacked)").length && (t = a.nextAll(".page-current:not(.stacked)").find(".page-content"))), t && 0 < t.length && (t.hasClass("tab") && (t = t.parent(".tabs").children(".page-content.tab-active")), 0 < t.length && t.scrollTop(0, 300))
                    }
                }
            },
            vnode: { "navbar-inner": { postpatch: function(e) { "ios" === this.theme && this.navbar.size(e.elm) } } }
        },
        Toolbar = {
            setHighlight: function(e) {
                if ("md" === this.theme) {
                    var t = $(e);
                    if (0 !== t.length && (t.hasClass("tabbar") || t.hasClass("tabbar-labels"))) {
                        var a = t.find(".tab-link-highlight"),
                            n = t.find(".tab-link").length;
                        if (0 !== n) {
                            0 === a.length ? (t.children(".toolbar-inner").append('<span class="tab-link-highlight"></span>'), a = t.find(".tab-link-highlight")) : a.next().length && t.children(".toolbar-inner").append(a);
                            var r, i, o = t.find(".tab-link-active");
                            if (t.hasClass("tabbar-scrollable") && o && o[0]) r = o[0].offsetWidth + "px", i = o[0].offsetLeft + "px";
                            else {
                                var s = o.index();
                                r = 100 / n + "%", i = 100 * (this.rtl ? -s : s) + "%"
                            }
                            Utils.nextFrame(function() { a.css("width", r).transform("translate3d(" + i + ",0,0)") })
                        } else a.remove()
                    }
                }
            },
            init: function(e) { this.toolbar.setHighlight(e) },
            hide: function(e, t) {
                void 0 === t && (t = !0);
                var a = $(e);
                if (!a.hasClass("toolbar-hidden")) {
                    var n = "toolbar-hidden" + (t ? " toolbar-transitioning" : "");
                    a.transitionEnd(function() { a.removeClass("toolbar-transitioning") }), a.addClass(n)
                }
            },
            show: function(e, t) {
                void 0 === t && (t = !0);
                var a = $(e);
                a.hasClass("toolbar-hidden") && (t && (a.addClass("toolbar-transitioning"), a.transitionEnd(function() { a.removeClass("toolbar-transitioning") })), a.removeClass("toolbar-hidden"))
            },
            initHideToolbarOnScroll: function(e) {
                var t, a, n, r, i, o, s, l = this,
                    p = $(e),
                    c = p.parents(".view").children(".toolbar");
                (0 === c.length && (c = p.find(".toolbar")), 0 === c.length && (c = p.parents(".views").children(".tabbar, .tabbar-labels")), 0 !== c.length) && (p.on("scroll", ".page-content", d, !0), p[0].f7ScrollToolbarHandler = d);

                function d() { p.hasClass("page-previous") || (a = this.scrollTop, n = this.scrollHeight, r = this.offsetHeight, i = n <= a + r, s = c.hasClass("toolbar-hidden"), i ? l.params.toolbar.showOnPageScrollEnd && (o = "show") : o = a < t ? l.params.toolbar.showOnPageScrollTop || a <= 44 ? "show" : "hide" : 44 < a ? "hide" : "show", "show" === o && s ? (l.toolbar.show(c), s = !1) : "hide" !== o || s || (l.toolbar.hide(c), s = !0), t = a) }
            }
        },
        Toolbar$1 = {
            name: "toolbar",
            create: function() {
                var e = this;
                Utils.extend(e, { toolbar: { hide: Toolbar.hide.bind(e), show: Toolbar.show.bind(e), setHighlight: Toolbar.setHighlight.bind(e), initHideToolbarOnScroll: Toolbar.initHideToolbarOnScroll.bind(e), init: Toolbar.init.bind(e) } })
            },
            params: { toolbar: { hideOnPageScroll: !1, showOnPageScrollEnd: !0, showOnPageScrollTop: !0 } },
            on: {
                pageBeforeRemove: function(e) { e.$el[0].f7ScrollToolbarHandler && e.$el.off("scroll", ".page-content", e.$el[0].f7ScrollToolbarHandler, !0) },
                pageBeforeIn: function(e) {
                    var t = e.$el.parents(".view").children(".toolbar");
                    0 === t.length && (t = e.$el.parents(".views").children(".tabbar, .tabbar-labels")), 0 === t.length && (t = e.$el.find(".toolbar")), 0 !== t.length && (e.$el.hasClass("no-toolbar") ? this.toolbar.hide(t) : this.toolbar.show(t))
                },
                pageInit: function(e) {
                    var a = this;
                    if (e.$el.find(".tabbar, .tabbar-labels").each(function(e, t) { a.toolbar.init(t) }), a.params.toolbar.hideOnPageScroll || e.$el.find(".hide-toolbar-on-scroll").length || e.$el.hasClass("hide-toolbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll")) {
                        if (e.$el.find(".keep-toolbar-on-scroll").length || e.$el.hasClass("keep-toolbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll")) return;
                        a.toolbar.initHideToolbarOnScroll(e.el)
                    }
                },
                init: function() {
                    var a = this;
                    a.root.find(".tabbar, .tabbar-labels").each(function(e, t) { a.toolbar.init(t) })
                }
            }
        },
        Subnavbar = { name: "subnavbar", on: { pageInit: function(e) { e.$navbarEl && e.$navbarEl.length && e.$navbarEl.find(".subnavbar").length && e.$el.addClass("page-with-subnavbar"), e.$el.find(".subnavbar").length && e.$el.addClass("page-with-subnavbar") } } },
        TouchRipple = function(e, t, a) {
            var n = this;
            if (e) {
                var r = e[0].getBoundingClientRect(),
                    i = t - r.left,
                    o = a - r.top,
                    s = r.width,
                    l = r.height,
                    p = Math.max(Math.pow(Math.pow(l, 2) + Math.pow(s, 2), .5), 48);
                return n.$rippleWaveEl = $('<div class="ripple-wave" style="width: ' + p + "px; height: " + p + "px; margin-top:-" + p / 2 + "px; margin-left:-" + p / 2 + "px; left:" + i + "px; top:" + o + 'px;"></div>'), e.prepend(n.$rippleWaveEl), n.rippleTransform = "translate3d(" + (s / 2 - i) + "px, " + (l / 2 - o) + "px, 0) scale(1)", Utils.nextFrame(function() { n && n.$rippleWaveEl && n.$rippleWaveEl.transform(n.rippleTransform) }), n
            }
        };
    TouchRipple.prototype.onRemove = function() {
        var t = this;
        t.$rippleWaveEl && t.$rippleWaveEl.remove(), Object.keys(t).forEach(function(e) { t[e] = null, delete t[e] }), t = null
    }, TouchRipple.prototype.remove = function() {
        var e = this;
        if (!e.removing) {
            var t = this.$rippleWaveEl,
                a = this.rippleTransform,
                n = Utils.nextTick(function() { e.onRemove() }, 400);
            e.removing = !0, t.addClass("ripple-wave-fill").transform(a.replace("scale(1)", "scale(1.01)")).transitionEnd(function() { clearTimeout(n), Utils.nextFrame(function() { t.addClass("ripple-wave-out").transform(a.replace("scale(1)", "scale(1.01)")), n = Utils.nextTick(function() { e.onRemove() }, 700), t.transitionEnd(function() { clearTimeout(n), e.onRemove() }) }) })
        }
    };
    var TouchRipple$1 = { name: "touch-ripple", static: { TouchRipple: TouchRipple }, create: function() { this.touchRipple = { create: function() { for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]; return new(Function.prototype.bind.apply(TouchRipple, [null].concat(e))) } } } },
        openedModals = [],
        dialogsQueue = [];

    function clearDialogsQueue() { 0 !== dialogsQueue.length && dialogsQueue.shift().open() }
    var Modal = function(n) {
            function e(e, t) { n.call(this, t, [e]); var a = {}; return this.useModulesParams(a), this.params = Utils.extend(a, t), this.opened = !1, this.useModules(), this }
            return n && (e.__proto__ = n), ((e.prototype = Object.create(n && n.prototype)).constructor = e).prototype.onOpen = function() {
                var e = this;
                e.opened = !0, openedModals.push(e), $("html").addClass("with-modal-" + e.type.toLowerCase()), e.$el.trigger("modal:open " + e.type.toLowerCase() + ":open", e), e.emit("local::open modalOpen " + e.type + "Open", e)
            }, e.prototype.onOpened = function() {
                var e = this;
                e.$el.trigger("modal:opened " + e.type.toLowerCase() + ":opened", e), e.emit("local::opened modalOpened " + e.type + "Opened", e)
            }, e.prototype.onClose = function() {
                var e = this;
                e.opened = !1, e.type && e.$el && (openedModals.splice(openedModals.indexOf(e), 1), $("html").removeClass("with-modal-" + e.type.toLowerCase()), e.$el.trigger("modal:close " + e.type.toLowerCase() + ":close", e), e.emit("local::close modalClose " + e.type + "Close", e))
            }, e.prototype.onClosed = function() {
                var e = this;
                e.type && e.$el && (e.$el.removeClass("modal-out"), e.$el.hide(), e.$el.trigger("modal:closed " + e.type.toLowerCase() + ":closed", e), e.emit("local::closed modalClosed " + e.type + "Closed", e))
            }, e.prototype.open = function(e) {
                var t, a = this,
                    n = a.app,
                    r = a.$el,
                    i = a.$backdropEl,
                    o = a.type,
                    s = !0;
                if (void 0 !== e ? s = e : void 0 !== a.params.animate && (s = a.params.animate), !r || r.hasClass("modal-in")) return a;
                if ("dialog" === o && n.params.modal.queueDialogs && (0 < $(".dialog.modal-in").length ? t = !0 : 0 < openedModals.length && openedModals.forEach(function(e) { "dialog" === e.type && (t = !0) }), t)) return dialogsQueue.push(a), a;
                var l = r.parent(),
                    p = 0 < r.parents(doc).length;

                function c() { r.hasClass("modal-out") ? a.onClosed() : r.hasClass("modal-in") && a.onOpened() }
                return n.params.modal.moveToRoot && !l.is(n.root) && (n.root.append(r), a.once(o + "Closed", function() { p ? l.append(r) : r.remove() })), r.show(), "dialog" === o && r.css({ marginTop: -Math.round(r.outerHeight() / 2) + "px" }), a._clientLeft = r[0].clientLeft, s ? (i && (i.removeClass("not-animated"), i.addClass("backdrop-in")), r.animationEnd(function() { c() }), r.transitionEnd(function() { c() }), r.removeClass("modal-out not-animated").addClass("modal-in"), a.onOpen()) : (i && i.addClass("backdrop-in not-animated"), r.removeClass("modal-out").addClass("modal-in not-animated"), a.onOpen(), a.onOpened()), a
            }, e.prototype.close = function(e) {
                var n = this,
                    t = n.$el,
                    a = n.$backdropEl,
                    r = !0;
                if (void 0 !== e ? r = e : void 0 !== n.params.animate && (r = n.params.animate), !t || !t.hasClass("modal-in")) return n;
                if (a) {
                    var i = !0;
                    "popup" === n.type && n.$el.prevAll(".popup.modal-in").each(function(e, t) {
                        var a = t.f7Modal;
                        a && a.params.closeByBackdropClick && a.params.backdrop && a.backdropEl === n.backdropEl && (i = !1)
                    }), i && (a[r ? "removeClass" : "addClass"]("not-animated"), a.removeClass("backdrop-in"))
                }

                function o() { t.hasClass("modal-out") ? n.onClosed() : t.hasClass("modal-in") && n.onOpened() }
                return t[r ? "removeClass" : "addClass"]("not-animated"), r ? (t.animationEnd(function() { o() }), t.transitionEnd(function() { o() }), t.removeClass("modal-in").addClass("modal-out"), n.onClose()) : (t.addClass("not-animated").removeClass("modal-in").addClass("modal-out"), n.onClose(), n.onClosed()), "dialog" === n.type && clearDialogsQueue(), n
            }, e.prototype.destroy = function() {
                var e = this;
                e.destroyed || (e.emit("local::beforeDestroy modalBeforeDestroy " + e.type + "BeforeDestroy", e), e.$el && (e.$el.trigger("modal:beforedestroy " + e.type.toLowerCase() + ":beforedestroy", e), e.$el.length && e.$el[0].f7Modal && delete e.$el[0].f7Modal), Utils.deleteProps(e), e.destroyed = !0)
            }, e
        }(Framework7Class),
        CustomModal = function(s) {
            function e(e, t) {
                var a = Utils.extend({ backdrop: !0, closeByBackdropClick: !0, on: {} }, t);
                s.call(this, e, a);
                var n, r, i = this;
                if (i.params = a, (n = i.params.el ? $(i.params.el) : $(i.params.content)) && 0 < n.length && n[0].f7Modal) return n[0].f7Modal;
                if (0 === n.length) return i.destroy();

                function o(e) { i && !i.destroyed && r && e.target === r[0] && i.close() }
                return i.params.backdrop && 0 === (r = e.root.children(".custom-modal-backdrop")).length && (r = $('<div class="custom-modal-backdrop"></div>'), e.root.append(r)), i.on("customModalOpened", function() { i.params.closeByBackdropClick && i.params.backdrop && e.on("click", o) }), i.on("customModalClose", function() { i.params.closeByBackdropClick && i.params.backdrop && e.off("click", o) }), Utils.extend(i, { app: e, $el: n, el: n[0], $backdropEl: r, backdropEl: r && r[0], type: "customModal" }), n[0].f7Modal = i
            }
            return s && (e.__proto__ = s), (e.prototype = Object.create(s && s.prototype)).constructor = e
        }(Modal),
        Modal$1 = {
            name: "modal",
            static: { Modal: Modal, CustomModal: CustomModal },
            create: function() {
                var t = this;
                t.customModal = { create: function(e) { return new CustomModal(t, e) } }
            },
            params: { modal: { moveToRoot: !0, queueDialogs: !0 } }
        },
        Dialog = function(y) {
            function e(a, e) {
                var t = Utils.extend({ title: a.params.dialog.title, text: void 0, content: "", buttons: [], verticalButtons: !1, onClick: void 0, cssClass: void 0, destroyOnClose: !1, on: {} }, e);
                void 0 === t.closeByBackdropClick && (t.closeByBackdropClick = a.params.dialog.closeByBackdropClick), y.call(this, a, t);
                var n, r = this,
                    i = t.title,
                    o = t.text,
                    s = t.content,
                    l = t.buttons,
                    p = t.verticalButtons,
                    c = t.cssClass;
                if (r.params = t, r.params.el) n = $(r.params.el);
                else {
                    var d = ["dialog"];
                    0 === l.length && d.push("dialog-no-buttons"), 0 < l.length && d.push("dialog-buttons-" + l.length), p && d.push("dialog-buttons-vertical"), c && d.push(c);
                    var u = "";
                    0 < l.length && (u = '\n          <div class="dialog-buttons">\n            ' + l.map(function(e) { return '\n              <span class="dialog-button' + (e.bold ? " dialog-button-bold" : "") + (e.color ? " color-" + e.color : "") + (e.cssClass ? " " + e.cssClass : "") + '">' + e.text + "</span>\n            " }).join("") + "\n          </div>\n        ");
                    var h = '\n        <div class="' + d.join(" ") + '">\n          <div class="dialog-inner">\n            ' + (i ? '<div class="dialog-title">' + i + "</div>" : "") + "\n            " + (o ? '<div class="dialog-text">' + o + "</div>" : "") + "\n            " + s + "\n          </div>\n          " + u + "\n        </div>\n      ";
                    n = $(h)
                }
                if (n && 0 < n.length && n[0].f7Modal) return n[0].f7Modal;
                if (0 === n.length) return r.destroy();
                var f, m = a.root.children(".dialog-backdrop");

                function v(e) {
                    var t = $(this).index(),
                        a = l[t];
                    a.onClick && a.onClick(r, e), r.params.onClick && r.params.onClick(r, t), !1 !== a.close && r.close()
                }

                function g(a) {
                    var n = a.keyCode;
                    l.forEach(function(e, t) { e.keyCodes && 0 <= e.keyCodes.indexOf(n) && (doc.activeElement && doc.activeElement.blur(), e.onClick && e.onClick(r, a), r.params.onClick && r.params.onClick(r, t), !1 !== e.close && r.close()) })
                }

                function b(e) {
                    var t = e.target;
                    0 === $(t).closest(r.el).length && r.params.closeByBackdropClick && r.backdropEl && r.backdropEl === t && r.close()
                }
                return 0 === m.length && (m = $('<div class="dialog-backdrop"></div>'), a.root.append(m)), l && 0 < l.length && (r.on("open", function() { n.find(".dialog-button").each(function(e, t) { l[e].keyCodes && (f = !0), $(t).on("click", v) }), !f || a.device.ios || a.device.android || a.device.cordova || $(doc).on("keydown", g) }), r.on("close", function() { n.find(".dialog-button").each(function(e, t) { $(t).off("click", v) }), !f || a.device.ios || a.device.android || a.device.cordova || $(doc).off("keydown", g), f = !1 })), Utils.extend(r, { app: a, $el: n, el: n[0], $backdropEl: m, backdropEl: m[0], type: "dialog", setProgress: function(e, t) { return a.progressbar.set(n.find(".progressbar"), e, t), r }, setText: function(e) { var t = n.find(".dialog-text"); return 0 === t.length && (t = $('<div class="dialog-text"></div>'), void 0 !== i ? t.insertAfter(n.find(".dialog-title")) : n.find(".dialog-inner").prepend(t)), t.html(e), r.params.text = e, r }, setTitle: function(e) { var t = n.find(".dialog-title"); return 0 === t.length && (t = $('<div class="dialog-title"></div>'), n.find(".dialog-inner").prepend(t)), t.html(e), r.params.title = e, r } }), r.on("opened", function() { r.params.closeByBackdropClick && a.on("click", b) }), r.on("close", function() { r.params.closeByBackdropClick && a.off("click", b) }), (n[0].f7Modal = r).params.destroyOnClose && r.once("closed", function() { setTimeout(function() { r.destroy() }, 0) }), r
            }
            return y && (e.__proto__ = y), (e.prototype = Object.create(y && y.prototype)).constructor = e
        }(Modal),
        Dialog$1 = {
            name: "dialog",
            params: { dialog: { title: void 0, buttonOk: "OK", buttonCancel: "Cancelar", usernamePlaceholder: "Username", passwordPlaceholder: "Password", preloaderTitle: "Loading... ", progressTitle: "Loading... ", closeByBackdropClick: !1, destroyPredefinedDialogs: !0, keyboardActions: !0 } },
            static: { Dialog: Dialog },
            create: function() {
                var c = this;

                function s() { return c.params.dialog.title || c.name }
                var d = c.params.dialog.destroyPredefinedDialogs,
                    l = c.params.dialog.keyboardActions;
                c.dialog = Utils.extend(ModalMethods({ app: c, constructor: Dialog, defaultSelector: ".dialog.modal-in" }), {
                    alert: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1],
                            i = t[2];
                        return 2 === t.length && "function" == typeof t[1] && (n = (e = t)[0], i = e[1], r = e[2]), new Dialog(c, { title: void 0 === r ? s() : r, text: n, buttons: [{ text: c.params.dialog.buttonOk, bold: !0, onClick: i, keyCodes: l ? [13, 27] : null }], destroyOnClose: d }).open()
                    },
                    prompt: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1],
                            i = t[2],
                            o = t[3];
                        return "function" == typeof t[1] && (n = (e = t)[0], i = e[1], o = e[2], r = e[3]), new Dialog(c, {
                            title: void 0 === r ? s() : r,
                            text: n,
                            content: '<div class="dialog-input-field item-input"><div class="item-input-wrap"><input type="text" class="dialog-input"></div></div>',
                            buttons: [{ text: c.params.dialog.buttonCancel, keyCodes: l ? [27] : null }, { text: c.params.dialog.buttonOk, bold: !0, keyCodes: l ? [13] : null }],
                            onClick: function(e, t) {
                                var a = e.$el.find(".dialog-input").val();
                                0 === t && o && o(a), 1 === t && i && i(a)
                            },
                            destroyOnClose: d
                        }).open()
                    },
                    confirm: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1],
                            i = t[2],
                            o = t[3];
                        return "function" == typeof t[1] && (n = (e = t)[0], i = e[1], o = e[2], r = e[3]), new Dialog(c, { title: void 0 === r ? s() : r, text: n, buttons: [{ text: c.params.dialog.buttonCancel, onClick: o, keyCodes: l ? [27] : null }, { text: c.params.dialog.buttonOk, bold: !0, onClick: i, keyCodes: l ? [13] : null }], destroyOnClose: d }).open()
                    },
                    login: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1],
                            i = t[2],
                            o = t[3];
                        return "function" == typeof t[1] && (n = (e = t)[0], i = e[1], o = e[2], r = e[3]), new Dialog(c, {
                            title: void 0 === r ? s() : r,
                            text: n,
                            content: '\n              <div class="dialog-input-field dialog-input-double item-input">\n                <div class="item-input-wrap">\n                  <input type="text" name="dialog-username" placeholder="' + c.params.dialog.usernamePlaceholder + '" class="dialog-input">\n                </div>\n              </div>\n              <div class="dialog-input-field dialog-input-double item-input">\n                <div class="item-input-wrap">\n                  <input type="password" name="dialog-password" placeholder="' + c.params.dialog.passwordPlaceholder + '" class="dialog-input">\n                </div>\n              </div>',
                            buttons: [{ text: c.params.dialog.buttonCancel, keyCodes: l ? [27] : null }, { text: c.params.dialog.buttonOk, bold: !0, keyCodes: l ? [13] : null }],
                            onClick: function(e, t) {
                                var a = e.$el.find('[name="dialog-username"]').val(),
                                    n = e.$el.find('[name="dialog-password"]').val();
                                0 === t && o && o(a, n), 1 === t && i && i(a, n)
                            },
                            destroyOnClose: d
                        }).open()
                    },
                    password: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1],
                            i = t[2],
                            o = t[3];
                        return "function" == typeof t[1] && (n = (e = t)[0], i = e[1], o = e[2], r = e[3]), new Dialog(c, {
                            title: void 0 === r ? s() : r,
                            text: n,
                            content: '\n              <div class="dialog-input-field item-input">\n                <div class="item-input-wrap">\n                  <input type="password" name="dialog-password" placeholder="' + c.params.dialog.passwordPlaceholder + '" class="dialog-input">\n                </div>\n              </div>',
                            buttons: [{ text: c.params.dialog.buttonCancel, keyCodes: l ? [27] : null }, { text: c.params.dialog.buttonOk, bold: !0, keyCodes: l ? [13] : null }],
                            onClick: function(e, t) {
                                var a = e.$el.find('[name="dialog-password"]').val();
                                0 === t && o && o(a), 1 === t && i && i(a)
                            },
                            destroyOnClose: d
                        }).open()
                    },
                    preloader: function(e, t) { var a = "md" !== c.theme ? "" : Utils.mdPreloaderContent; return new Dialog(c, { title: null == e ? c.params.dialog.preloaderTitle : e, content: '<div class="preloader' + (t ? " color-" + t : "") + '">' + a + "</div>", cssClass: "dialog-preloader", destroyOnClose: d }).open() },
                    progress: function() {
                        for (var e, t, a, n = [], r = arguments.length; r--;) n[r] = arguments[r];
                        var i = n[0],
                            o = n[1],
                            s = n[2];
                        2 === n.length ? "number" == typeof n[0] ? (o = (e = n)[0], s = e[1], i = e[2]) : "string" == typeof n[0] && "string" == typeof n[1] && (i = (t = n)[0], s = t[1], o = t[2]) : 1 === n.length && "number" == typeof n[0] && (o = (a = n)[0], i = a[1], s = a[2]);
                        var l = void 0 === o,
                            p = new Dialog(c, { title: void 0 === i ? c.params.dialog.progressTitle : i, cssClass: "dialog-progress", content: '\n              <div class="progressbar' + (l ? "-infinite" : "") + (s ? " color-" + s : "") + '">\n                ' + (l ? "" : "<span></span>") + "\n              </div>\n            ", destroyOnClose: d });
                        return l || p.setProgress(o), p.open()
                    }
                })
            }
        },
        Popup = function(s) {
            function e(e, t) {
                var a = Utils.extend({ on: {} }, e.params.popup, t);
                s.call(this, e, a);
                var n, r, i = this;
                if (i.params = a, (n = i.params.el ? $(i.params.el) : $(i.params.content)) && 0 < n.length && n[0].f7Modal) return n[0].f7Modal;
                if (0 === n.length) return i.destroy();

                function o(e) {
                    var t = e.target;
                    if (0 === $(t).closest(i.el).length && i.params && i.params.closeByBackdropClick && i.params.backdrop && i.backdropEl && i.backdropEl === t) {
                        var n = !0;
                        i.$el.nextAll(".popup.modal-in").each(function(e, t) {
                            var a = t.f7Modal;
                            a && a.params.closeByBackdropClick && a.params.backdrop && a.backdropEl === i.backdropEl && (n = !1)
                        }), n && i.close()
                    }
                }
                return i.params.backdrop && 0 === (r = e.root.children(".popup-backdrop")).length && (r = $('<div class="popup-backdrop"></div>'), e.root.append(r)), Utils.extend(i, { app: e, $el: n, el: n[0], $backdropEl: r, backdropEl: r && r[0], type: "popup" }), i.on("popupOpened", function() { i.params.closeByBackdropClick && e.on("click", o) }), i.on("popupClose", function() { i.params.closeByBackdropClick && e.off("click", o) }), n[0].f7Modal = i
            }
            return s && (e.__proto__ = s), (e.prototype = Object.create(s && s.prototype)).constructor = e
        }(Modal),
        Popup$1 = {
            name: "popup",
            params: { popup: { backdrop: !0, closeByBackdropClick: !0 } },
            static: { Popup: Popup },
            create: function() { this.popup = ModalMethods({ app: this, constructor: Popup, defaultSelector: ".popup.modal-in" }) },
            clicks: {
                ".popup-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.popup.open(t.popup, t.animate)
                },
                ".popup-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.popup.close(t.popup, t.animate)
                }
            }
        },
        LoginScreen = function(i) {
            function e(e, t) {
                var a = Utils.extend({ on: {} }, t);
                i.call(this, e, a);
                var n, r = this;
                return r.params = a, (n = r.params.el ? $(r.params.el) : $(r.params.content)) && 0 < n.length && n[0].f7Modal ? n[0].f7Modal : 0 === n.length ? r.destroy() : (Utils.extend(r, { app: e, $el: n, el: n[0], type: "loginScreen" }), n[0].f7Modal = r)
            }
            return i && (e.__proto__ = i), (e.prototype = Object.create(i && i.prototype)).constructor = e
        }(Modal),
        LoginScreen$1 = {
            name: "loginScreen",
            static: { LoginScreen: LoginScreen },
            create: function() { this.loginScreen = ModalMethods({ app: this, constructor: LoginScreen, defaultSelector: ".login-screen.modal-in" }) },
            clicks: {
                ".login-screen-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.loginScreen.open(t.loginScreen, t.animate)
                },
                ".login-screen-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.loginScreen.close(t.loginScreen, t.animate)
                }
            }
        },
        Popover = function(d) {
            function e(e, t) {
                var a = Utils.extend({ on: {} }, e.params.popover, t);
                d.call(this, e, a);
                var n, i = this;
                if (i.params = a, (n = i.params.el ? $(i.params.el) : $(i.params.content)) && 0 < n.length && n[0].f7Modal) return n[0].f7Modal;
                var r, o, s = $(i.params.targetEl).eq(0);
                if (0 === n.length) return i.destroy();
                i.params.backdrop && 0 === (r = e.root.children(".popover-backdrop")).length && (r = $('<div class="popover-backdrop"></div>'), e.root.append(r)), 0 === n.find(".popover-angle").length ? (o = $('<div class="popover-angle"></div>'), n.prepend(o)) : o = n.find(".popover-angle");
                var l = i.open;

                function p() { i.resize() }

                function c(e) {
                    var t = e.target;
                    0 === $(t).closest(i.el).length && (i.params.closeByBackdropClick && i.params.backdrop && i.backdropEl && i.backdropEl === t ? i.close() : i.params.closeByOutsideClick && i.close())
                }
                return Utils.extend(i, {
                    app: e,
                    $el: n,
                    el: n[0],
                    $targetEl: s,
                    targetEl: s[0],
                    $angleEl: o,
                    angleEl: o[0],
                    $backdropEl: r,
                    backdropEl: r && r[0],
                    type: "popover",
                    open: function() {
                        for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                        var n = t[0],
                            r = t[1];
                        return "boolean" == typeof t[0] && (r = (e = t)[0], n = e[1]), n && (i.$targetEl = $(n), i.targetEl = i.$targetEl[0]), l.call(i, r)
                    }
                }), i.on("popoverOpen", function() { i.resize(), e.on("resize", p), i.on("popoverClose popoverBeforeDestroy", function() { e.off("resize", p) }) }), i.on("popoverOpened", function() {
                    (i.params.closeByOutsideClick || i.params.closeByBackdropClick) && e.on("click", c)
                }), i.on("popoverClose", function() {
                    (i.params.closeByOutsideClick || i.params.closeByBackdropClick) && e.off("click", c)
                }), n[0].f7Modal = i
            }
            return d && (e.__proto__ = d), ((e.prototype = Object.create(d && d.prototype)).constructor = e).prototype.resize = function() {
                var e = this,
                    t = e.app,
                    a = e.$el,
                    n = e.$targetEl,
                    r = e.$angleEl,
                    i = e.params,
                    o = i.targetX,
                    s = i.targetY;
                a.css({ left: "", top: "" });
                var l, p, c, d, u, h, f = [a.width(), a.height()],
                    m = f[0],
                    v = f[1],
                    g = 0;
                if ("ios" === t.theme ? (r.removeClass("on-left on-right on-top on-bottom").css({ left: "", top: "" }), g = r.width() / 2) : a.removeClass("popover-on-left popover-on-right popover-on-top popover-on-bottom").css({ left: "", top: "" }), n && 0 < n.length) {
                    c = n.outerWidth(), d = n.outerHeight();
                    var b = n.offset();
                    u = b.left - t.left, h = b.top - t.top;
                    var y = n.parents(".page");
                    0 < y.length && (h -= y[0].scrollTop)
                } else void 0 !== o && "undefined" !== s && (u = o, h = s, c = e.params.targetWidth || 0, d = e.params.targetHeight || 0);
                var w = [0, 0, 0],
                    C = w[0],
                    x = w[1],
                    $ = w[2],
                    E = "md" === t.theme ? "bottom" : "top";
                "md" === t.theme ? (v < t.height - h - d ? (E = "bottom", x = h) : v < h ? (x = h - v + d, E = "top") : (E = "bottom", x = h), x <= 0 ? x = 8 : x + v >= t.height && (x = t.height - v - 8), (C = u + c - m - 8) + m >= t.width - 8 && (C = u + c - m - 8), C < 8 && (C = 8), "top" === E && a.addClass("popover-on-top"), "bottom" === E && a.addClass("popover-on-bottom")) : (v + g < h ? x = h - v - g : v + g < t.height - h - d ? (E = "bottom", x = h + d + g) : (E = "middle", ($ = x = d / 2 + h - v / 2) <= 0 ? x = 5 : x + v >= t.height && (x = t.height - v - 5), $ -= x), "top" === E || "bottom" === E ? (($ = C = c / 2 + u - m / 2) < 5 && (C = 5), C + m > t.width && (C = t.width - m - 5), C < 0 && (C = 0), "top" === E && r.addClass("on-bottom"), "bottom" === E && r.addClass("on-top"), l = m / 2 - g + ($ -= C), l = Math.max(Math.min(l, m - 2 * g - 13), 13), r.css({ left: l + "px" })) : "middle" === E && (C = u - m - g, r.addClass("on-right"), (C < 5 || C + m > t.width) && (C < 5 && (C = u + c + g), C + m > t.width && (C = t.width - m - 5), r.removeClass("on-right").addClass("on-left")), p = v / 2 - g + $, p = Math.max(Math.min(p, v - 2 * g - 13), 13), r.css({ top: p + "px" }))), a.css({ top: x + "px", left: C + "px" })
            }, e
        }(Modal),
        Popover$1 = {
            name: "popover",
            params: { popover: { closeByBackdropClick: !0, closeByOutsideClick: !1, backdrop: !0 } },
            static: { Popover: Popover },
            create: function() {
                var i = this;
                i.popover = Utils.extend(ModalMethods({ app: i, constructor: Popover, defaultSelector: ".popover.modal-in" }), {
                    open: function(e, t, a) {
                        var n = $(e),
                            r = n[0].f7Modal;
                        return r || (r = new Popover(i, { el: n, targetEl: t })), r.open(t, a)
                    }
                })
            },
            clicks: {
                ".popover-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.popover.open(t.popover, e, t.animate)
                },
                ".popover-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.popover.close(t.popover, t.animate)
                }
            }
        },
        Actions = function(s) {
            function e(l, e) {
                var t = Utils.extend({ on: {} }, l.params.actions, e);
                s.call(this, l, t);
                var i, a, n, p = this;
                if (p.params = t, p.params.buttons && (i = p.params.buttons, Array.isArray(i[0]) || (i = [i])), p.groups = i, p.params.el ? a = $(p.params.el) : p.params.content ? a = $(p.params.content) : p.params.buttons && (p.params.convertToPopover && (p.popoverHtml = p.renderPopover()), p.actionsHtml = p.render()), a && 0 < a.length && a[0].f7Modal) return a[0].f7Modal;
                if (a && 0 === a.length && !p.actionsHtml && !p.popoverHtml) return p.destroy();
                p.params.backdrop && 0 === (n = l.root.children(".actions-backdrop")).length && (n = $('<div class="actions-backdrop"></div>'), l.root.append(n));
                var c, d = p.open,
                    r = p.close;

                function u(e) {
                    var t, a, n = this;
                    if (a = $(n).hasClass("item-link") ? (t = $(n).parents("li").index(), $(n).parents(".list").index()) : (t = $(n).index(), $(n).parents(".actions-group").index()), void 0 !== i) {
                        var r = i[a][t];
                        r.onClick && r.onClick(p, e), p.params.onClick && p.params.onClick(p, e), !1 !== r.close && p.close()
                    }
                }

                function o(e) {
                    var t = e.target;
                    0 === $(t).closest(p.el).length && (p.params.closeByBackdropClick && p.params.backdrop && p.backdropEl && p.backdropEl === t ? p.close() : p.params.closeByOutsideClick && p.close())
                }
                return p.open = function(e) {
                    var t = !1,
                        a = p.params,
                        n = a.targetEl,
                        r = a.targetX,
                        i = a.targetY,
                        o = a.targetWidth,
                        s = a.targetHeight;
                    return p.params.convertToPopover && (n || void 0 !== r && void 0 !== i) && (p.params.forceToPopover || l.device.ios && l.device.ipad || 768 <= l.width) && (t = !0), t && p.popoverHtml ? ((c = l.popover.create({ content: p.popoverHtml, backdrop: p.params.backdrop, targetEl: n, targetX: r, targetY: i, targetWidth: o, targetHeight: s })).open(e), c.once("popoverOpened", function() { c.$el.find(".item-link").each(function(e, t) { $(t).on("click", u) }) }), c.once("popoverClosed", function() { c.$el.find(".item-link").each(function(e, t) { $(t).off("click", u) }), Utils.nextTick(function() { c.destroy(), c = void 0 }) })) : (p.$el = p.actionsHtml ? $(p.actionsHtml) : p.$el, (p.$el[0].f7Modal = p).groups && (p.$el.find(".actions-button").each(function(e, t) { $(t).on("click", u) }), p.once("actionsClosed", function() { p.$el.find(".actions-button").each(function(e, t) { $(t).off("click", u) }) })), p.el = p.$el[0], d.call(p, e)), p
                }, p.close = function(e) { return c ? c.close(e) : r.call(p, e), p }, Utils.extend(p, { app: l, $el: a, el: a ? a[0] : void 0, $backdropEl: n, backdropEl: n && n[0], type: "actions" }), p.on("opened", function() {
                    (p.params.closeByBackdropClick || p.params.closeByOutsideClick) && l.on("click", o)
                }), p.on("close", function() {
                    (p.params.closeByBackdropClick || p.params.closeByOutsideClick) && l.off("click", o)
                }), a && (a[0].f7Modal = p), p
            }
            return s && (e.__proto__ = s), ((e.prototype = Object.create(s && s.prototype)).constructor = e).prototype.render = function() {
                var e = this;
                if (e.params.render) return e.params.render.call(e, e);
                var t = e.groups;
                return ('\n      <div class="actions-modal' + (e.params.grid ? " actions-grid" : "") + '">\n        ' + t.map(function(e) {
                    return '<div class="actions-group">\n            ' + e.map(function(e) {
                        var t = ["actions-" + (e.label ? "label" : "button")],
                            a = e.color,
                            n = e.bg,
                            r = e.bold,
                            i = e.disabled,
                            o = e.label,
                            s = e.text,
                            l = e.icon;
                        return a && t.push("color-" + a), n && t.push("bg-color-" + n), r && t.push("actions-button-bold"), i && t.push("disabled"), o ? '<div class="' + t.join(" ") + '">' + s + "</div>" : ('\n                <div class="' + t.join(" ") + '">\n                  ' + (l ? '<div class="actions-button-media">' + l + "</div>" : "") + '\n                  <div class="actions-button-text">' + s + "</div>\n                </div>").trim()
                    }).join("") + "\n          </div>"
                }).join("") + "\n      </div>\n    ").trim()
            }, e.prototype.renderPopover = function() {
                var e = this;
                return e.params.renderPopover ? e.params.renderPopover.call(e, e) : ('\n      <div class="popover popover-from-actions">\n        <div class="popover-inner">\n          ' + e.groups.map(function(e) {
                    return '\n            <div class="list">\n              <ul>\n                ' + e.map(function(e) {
                        var t = [],
                            a = e.color,
                            n = e.bg,
                            r = e.bold,
                            i = e.disabled,
                            o = e.label,
                            s = e.text,
                            l = e.icon;
                        return a && t.push("color-" + a), n && t.push("bg-color-" + n), r && t.push("popover-from-actions-bold"), i && t.push("disabled"), o ? (t.push("popover-from-actions-label"), '<li class="' + t.join(" ") + '">' + s + "</li>") : (t.push("item-link"), l ? (t.push("item-content"), '\n                      <li>\n                        <a class="' + t.join(" ") + '">\n                          <div class="item-media">\n                            ' + l + '\n                          </div>\n                          <div class="item-inner">\n                            <div class="item-title">\n                              ' + s + "\n                            </div>\n                          </div>\n                        </a>\n                      </li>\n                    ") : (t.push("list-button"), '\n                    <li>\n                      <a href="#" class="list-button ' + t.join(" ") + '">' + s + "</a>\n                    </li>\n                  "))
                    }).join("") + "\n              </ul>\n            </div>\n          "
                }).join("") + "\n        </div>\n      </div>\n    ").trim()
            }, e
        }(Modal),
        Actions$1 = {
            name: "actions",
            params: { actions: { convertToPopover: !0, forceToPopover: !1, closeByBackdropClick: !0, render: null, renderPopover: null, backdrop: !0 } },
            static: { Actions: Actions },
            create: function() { this.actions = ModalMethods({ app: this, constructor: Actions, defaultSelector: ".actions-modal.modal-in" }) },
            clicks: {
                ".actions-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.actions.open(t.actions, t.animate)
                },
                ".actions-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.actions.close(t.actions, t.animate)
                }
            }
        },
        Sheet = function(i) {
            function e(e, t) {
                var a = Utils.extend({ on: {} }, e.params.sheet, t);
                i.call(this, e, a);
                var p, n, c, d = this;
                if (d.params = a, (p = d.params.el ? $(d.params.el) : $(d.params.content)) && 0 < p.length && p[0].f7Modal) return p[0].f7Modal;
                if (0 === p.length) return d.destroy();

                function r(e) {
                    var t = e.target;
                    0 === $(t).closest(d.el).length && (d.params.closeByBackdropClick && d.params.backdrop && d.backdropEl && d.backdropEl === t ? d.close() : d.params.closeByOutsideClick && d.close())
                }
                return d.params.backdrop && 0 === (n = e.root.children(".sheet-backdrop")).length && (n = $('<div class="sheet-backdrop"></div>'), e.root.append(n)), d.on("sheetOpen", function() {
                    d.params.scrollToEl && function() {
                        var e = $(d.params.scrollToEl).eq(0);
                        if (0 !== e.length && 0 !== (c = e.parents(".page-content")).length) {
                            var t, a = parseInt(c.css("padding-top"), 10),
                                n = parseInt(c.css("padding-bottom"), 10),
                                r = c[0].offsetHeight - a - p.height(),
                                i = c[0].scrollHeight - a - p.height(),
                                o = c.scrollTop(),
                                s = e.offset().top - a + e[0].offsetHeight;
                            if (r < s) {
                                var l = o + s - r;
                                i < l + r && (t = l + r - i + n, r === i && (t = p.height()), c.css({ "padding-bottom": t + "px" })), c.scrollTop(l, 300)
                            }
                        }
                    }()
                }), d.on("sheetOpened", function() {
                    (d.params.closeByOutsideClick || d.params.closeByBackdropClick) && e.on("click", r)
                }), d.on("sheetClose", function() { d.params.scrollToEl && c && 0 < c.length && c.css({ "padding-bottom": "" }), (d.params.closeByOutsideClick || d.params.closeByBackdropClick) && e.off("click", r) }), Utils.extend(d, { app: e, $el: p, el: p[0], $backdropEl: n, backdropEl: n && n[0], type: "sheet" }), p[0].f7Modal = d
            }
            return i && (e.__proto__ = i), (e.prototype = Object.create(i && i.prototype)).constructor = e
        }(Modal),
        Sheet$1 = {
            name: "sheet",
            params: { sheet: { closeByBackdropClick: !0, closeByOutsideClick: !1 } },
            static: { Sheet: Sheet },
            create: function() {
                var e = this;
                e.passedParams.sheet && void 0 !== e.passedParams.sheet.backdrop || (e.params.sheet.backdrop = "md" === e.theme), e.sheet = Utils.extend({}, ModalMethods({ app: e, constructor: Sheet, defaultSelector: ".sheet-modal.modal-in" }))
            },
            clicks: {
                ".sheet-open": function(e, t) {
                    void 0 === t && (t = {});
                    0 < $(".sheet-modal.modal-in").length && t.sheet && $(t.sheet)[0] !== $(".sheet-modal.modal-in")[0] && this.sheet.close(".sheet-modal.modal-in"), this.sheet.open(t.sheet, t.animate)
                },
                ".sheet-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.sheet.close(t.sheet, t.animate)
                }
            }
        },
        Toast = function(c) {
            function e(n, e) {
                var t = Utils.extend({ on: {} }, n.params.toast, e);
                c.call(this, n, t);
                var r = this;
                r.app = n, r.params = t;
                var a, i, o = r.params,
                    s = o.closeButton,
                    l = o.closeTimeout;
                if (r.params.el) a = $(r.params.el);
                else {
                    var p = r.render();
                    a = $(p)
                }
                return a && 0 < a.length && a[0].f7Modal ? a[0].f7Modal : 0 === a.length ? r.destroy() : (Utils.extend(r, { $el: a, el: a[0], type: "toast" }), a[0].f7Modal = r, s && (a.find(".toast-button").on("click", function() { r.emit("local::closeButtonClick toastCloseButtonClick", r), r.close() }), r.on("beforeDestroy", function() { a.find(".toast-button").off("click") })), r.on("open", function() {
                    $(".toast.modal-in").each(function(e, t) {
                        var a = n.toast.get(t);
                        t !== r.el && a && a.close()
                    }), l && (i = Utils.nextTick(function() { r.close() }, l))
                }), r.on("close", function() { win.clearTimeout(i) }), r.params.destroyOnClose && r.once("closed", function() { setTimeout(function() { r.destroy() }, 0) }), r)
            }
            return c && (e.__proto__ = c), ((e.prototype = Object.create(c && c.prototype)).constructor = e).prototype.render = function() {
                var e = this,
                    t = e.app;
                if (e.params.render) return e.params.render.call(e, e);
                var a = e.params,
                    n = a.position,
                    r = a.cssClass,
                    i = a.icon,
                    o = a.text,
                    s = a.closeButton,
                    l = a.closeButtonColor,
                    p = a.closeButtonText;
                return ('\n      <div class="toast toast-' + n + " " + (r || "") + " " + (i ? "toast-with-icon" : "") + '">\n        <div class="toast-content">\n          ' + (i ? '<div class="toast-icon">' + i + "</div>" : "") + '\n          <div class="toast-text">' + o + "</div>\n          " + (s && !i ? ('\n          <a class="toast-button ' + ("md" === t.theme ? "button" : "link") + " " + (l ? "color-" + l : "") + '">' + p + "</a>\n          ").trim() : "") + "\n        </div>\n      </div>\n    ").trim()
            }, e
        }(Modal),
        Toast$1 = {
            name: "toast",
            static: { Toast: Toast },
            create: function() {
                var t = this;
                t.toast = Utils.extend({}, ModalMethods({ app: t, constructor: Toast, defaultSelector: ".toast.modal-in" }), { show: function(e) { return Utils.extend(e, { destroyOnClose: !0 }), new Toast(t, e).open() } })
            },
            params: { toast: { icon: null, text: null, position: "bottom", closeButton: !1, closeButtonColor: null, closeButtonText: "Ok", closeTimeout: null, cssClass: null, render: null } }
        },
        Preloader = {
            init: function(e) {
                if ("md" === this.theme) {
                    var t = $(e);
                    0 === t.length || 0 < t.children(".preloader-inner").length || t.append(Utils.mdPreloaderContent)
                }
            },
            visible: !1,
            show: function(e) {
                void 0 === e && (e = "white");
                if (!Preloader.visible) {
                    var t = "md" !== this.theme ? "" : Utils.mdPreloaderContent;
                    $("html").addClass("with-modal-preloader"), this.root.append('\n      <div class="preloader-backdrop"></div>\n      <div class="preloader-modal">\n        <div class="preloader color-' + e + '">' + t + "</div>\n      </div>\n    "), Preloader.visible = !0
                }
            },
            hide: function() { Preloader.visible && ($("html").removeClass("with-modal-preloader"), this.root.find(".preloader-backdrop, .preloader-modal").remove(), Preloader.visible = !1) }
        },
        Preloader$1 = { name: "preloader", create: function() { Utils.extend(this, { preloader: { init: Preloader.init.bind(this), show: Preloader.show.bind(this), hide: Preloader.hide.bind(this) } }) }, on: { photoBrowserOpen: function(e) { var a = this; "md" === a.theme && e.$el.find(".preloader").each(function(e, t) { a.preloader.init(t) }) }, pageInit: function(e) { var a = this; "md" === a.theme && e.$el.find(".preloader").each(function(e, t) { a.preloader.init(t) }) } }, vnode: { preloader: { insert: function(e) { var t = e.elm; "md" === this.theme && this.preloader.init(t) } } } },
        Progressbar = {
            set: function() {
                for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                var n = t[0],
                    r = t[1],
                    i = t[2];
                if ("number" == typeof t[0] && (r = (e = t)[0], i = e[1], n = this.root), null == r) return n;
                r || (r = 0);
                var o = $(n || this.root);
                if (0 === o.length) return n;
                var s, l = Math.min(Math.max(r, 0), 100);
                if (0 === (s = o.hasClass("progressbar") ? o.eq(0) : o.children(".progressbar")).length || s.hasClass("progressbar-infinite")) return s;
                var p = s.children("span");
                return 0 === p.length && (p = $("<span></span>"), s.append(p)), p.transition(void 0 !== i ? i : "").transform("translate3d(" + (-100 + l) + "%,0,0)"), s[0]
            },
            show: function() {
                for (var e, t, a = [], n = arguments.length; n--;) a[n] = arguments[n];
                var r = this,
                    i = a[0],
                    o = a[1],
                    s = a[2],
                    l = "determined";
                2 === a.length ? "string" != typeof a[0] && "object" != typeof a[0] || "string" != typeof a[1] ? "number" == typeof a[0] && "string" == typeof a[1] && (o = (t = a)[0], s = t[1], i = r.root) : (i = (e = a)[0], s = e[1], o = e[2], l = "infinite") : 1 === a.length ? "number" == typeof a[0] ? (i = r.root, o = a[0]) : "string" == typeof a[0] && (l = "infinite", i = r.root, s = a[0]) : 0 === a.length && (l = "infinite", i = r.root);
                var p, c = $(i);
                if (0 !== c.length) return c.hasClass("progressbar") || c.hasClass("progressbar-infinite") ? p = c : 0 === (p = c.children(".progressbar:not(.progressbar-out), .progressbar-infinite:not(.progressbar-out)")).length && (p = $('\n          <span class="progressbar' + ("infinite" === l ? "-infinite" : "") + (s ? " color-" + s : "") + ' progressbar-in">\n            ' + ("infinite" === l ? "" : "<span></span>") + "\n          </span>"), c.append(p)), void 0 !== o && r.progressbar.set(p, o), p[0]
            },
            hide: function(e, t) { void 0 === t && (t = !0); var a, n = $(e || this.root); if (0 !== n.length) return 0 === (a = n.hasClass("progressbar") || n.hasClass("progressbar-infinite") ? n : n.children(".progressbar, .progressbar-infinite")).length || !a.hasClass("progressbar-in") || a.hasClass("progressbar-out") || a.removeClass("progressbar-in").addClass("progressbar-out").animationEnd(function() { t && a.remove() }), a }
        },
        Progressbar$1 = {
            name: "progressbar",
            create: function() { Utils.extend(this, { progressbar: { set: Progressbar.set.bind(this), show: Progressbar.show.bind(this), hide: Progressbar.hide.bind(this) } }) },
            on: {
                pageInit: function(e) {
                    var n = this;
                    e.$el.find(".progressbar").each(function(e, t) {
                        var a = $(t);
                        n.progressbar.set(a, a.attr("data-progress"))
                    })
                }
            }
        },
        Sortable = {
            init: function() {
                var l, p, c, d, u, h, f, m, v, g, b, y, a, w, C, x, E, k, S, T, n = this;
                var e = !!n.support.passiveListener && { passive: !1, capture: !1 };
                $(doc).on(n.touchEvents.start, ".list.sortable .sortable-handler", function(e) {
                    l = !(p = !1), c = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, u = $(this).parent("li"), a = u.index(), f = u.parents(".sortable");
                    var t = u.parents(".list-group");
                    t.length && t.parents(f).length && (f = t), h = f.children("ul").children("li"), n.panel && (n.panel.allowOpen = !1), n.swipeout && (n.swipeout.allow = !1)
                }, e), n.on("touchmove:active", function(e) {
                    if (l && u) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (!p) {
                            w = u.parents(".page"), C = u.parents(".page-content");
                            var a = parseInt(C.css("padding-top"), 10),
                                n = parseInt(C.css("padding-bottom"), 10);
                            T = C[0].scrollTop, E = w.offset().top + a, x = w.height() - a - n, u.addClass("sorting"), f.addClass("sortable-sorting"), k = u[0].offsetTop, v = u[0].offsetTop, g = u.parent().height() - k - u.height(), m = u[0].offsetHeight, S = u.offset().top
                        }
                        p = !0, e.preventDefault(), e.f7PreventSwipePanel = !0, d = t - c;
                        var r = C[0].scrollTop - T,
                            o = Math.min(Math.max(d + r, -v), g);
                        u.transform("translate3d(0," + o + "px,0)");
                        var i, s = !0;
                        d + r + 44 < -v && (s = !1), g < d + r - 44 && (s = !1), b = y = void 0, s && (E + x < S + d + m + 44 && (i = S + d + m + 44 - (E + x)), S + d < E + 44 && (i = S + d - E - 44), i && (C[0].scrollTop += i)), h.each(function(e, t) {
                            var a = $(t);
                            if (a[0] !== u[0]) {
                                var n = a[0].offsetTop,
                                    r = a.height(),
                                    i = k + o;
                                n - r / 2 <= i && u.index() < a.index() ? (a.transform("translate3d(0, " + -m + "px,0)"), b = a, y = void 0) : i <= n + r / 2 && u.index() > a.index() ? (a.transform("translate3d(0, " + m + "px,0)"), b = void 0, y || (y = a)) : a.transform("translate3d(0, 0%,0)")
                            }
                        })
                    }
                }), n.on("touchend:passive", function() {
                    if (!l || !p) return p = l = !1, void(l && !p && (n.panel && (n.panel.allowOpen = !0), n.swipeout && (n.swipeout.allow = !0)));
                    var e;
                    if (n.panel && (n.panel.allowOpen = !0), n.swipeout && (n.swipeout.allow = !0), h.transform(""), u.removeClass("sorting"), f.removeClass("sortable-sorting"), b ? e = b.index() : y && (e = y.index()), n.params.sortable.moveElements && (b && u.insertAfter(b), y && u.insertBefore(y)), (b || y) && f.hasClass("virtual-list")) {
                        a = u[0].f7VirtualListIndex, e = y ? y[0].f7VirtualListIndex : b[0].f7VirtualListIndex;
                        var t = f[0].f7VirtualList;
                        t && t.moveItem(a, e)
                    }
                    void 0 !== e && e !== a && (u.trigger("sortable:sort", { from: a, to: e }), n.emit("sortableSort", u[0], { from: a, to: e })), b = y = void 0, p = l = !1
                })
            },
            enable: function(e) {
                void 0 === e && (e = ".list.sortable");
                var t = $(e);
                0 !== t.length && (t.addClass("sortable-enabled"), t.trigger("sortable:enable"), this.emit("sortableEnable", t[0]))
            },
            disable: function(e) {
                void 0 === e && (e = ".list.sortable");
                var t = $(e);
                0 !== t.length && (t.removeClass("sortable-enabled"), t.trigger("sortable:disable"), this.emit("sortableDisable", t[0]))
            },
            toggle: function(e) {
                void 0 === e && (e = ".list.sortable");
                var t = $(e);
                0 !== t.length && (t.hasClass("sortable-enabled") ? this.sortable.disable(t) : this.sortable.enable(t))
            }
        },
        Sortable$1 = {
            name: "sortable",
            params: { sortable: { moveElements: !0 } },
            create: function() {
                var e = this;
                Utils.extend(e, { sortable: { init: Sortable.init.bind(e), enable: Sortable.enable.bind(e), disable: Sortable.disable.bind(e), toggle: Sortable.toggle.bind(e) } })
            },
            on: { init: function() { this.params.sortable && this.sortable.init() } },
            clicks: {
                ".sortable-enable": function(e, t) {
                    void 0 === t && (t = {});
                    this.sortable.enable(t.sortable)
                },
                ".sortable-disable": function(e, t) {
                    void 0 === t && (t = {});
                    this.sortable.disable(t.sortable)
                },
                ".sortable-toggle": function(e, t) {
                    void 0 === t && (t = {});
                    this.sortable.toggle(t.sortable)
                }
            }
        },
        Swipeout = {
            init: function() {
                var l, p, s, c, d, u, h, f, m, v, g, b, y, w, C, x, E, k, S, T, M, P = this,
                    O = {};
                var e = !!P.support.passiveListener && { passive: !0 };
                P.on("touchstart", function(e) {
                    if (Swipeout.el) {
                        var t = $(e.target);
                        $(Swipeout.el).is(t[0]) || t.parents(".swipeout").is(Swipeout.el) || t.hasClass("modal-in") || 0 < (t.attr("class") || "").indexOf("-backdrop") || t.hasClass("actions-modal") || 0 < t.parents(".actions-modal.modal-in, .dialog.modal-in").length || P.swipeout.close(Swipeout.el)
                    }
                }), $(doc).on(P.touchEvents.start, "li.swipeout", function(e) { Swipeout.allow && (l = !(p = !1), s = void 0, O.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, O.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, c = (new Date).getTime(), u = $(this)) }, e), P.on("touchmove:active", function(e) {
                    if (l) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (void 0 === s && (s = !!(s || Math.abs(a - O.y) > Math.abs(t - O.x))), s) l = !1;
                        else {
                            if (!p) {
                                if (0 < $(".list.sortable-opened").length) return;
                                h = u.find(".swipeout-content"), f = u.find(".swipeout-actions-right"), m = u.find(".swipeout-actions-left"), k = S = x = C = g = v = null, 0 < m.length && (v = m.outerWidth(), C = m.children("a"), k = m.find(".swipeout-overswipe")), 0 < f.length && (g = f.outerWidth(), x = f.children("a"), S = f.find(".swipeout-overswipe")), (y = u.hasClass("swipeout-opened")) && (w = 0 < u.find(".swipeout-actions-left.swipeout-actions-opened").length ? "left" : "right"), u.removeClass("swipeout-transitioning"), P.params.swipeout.noFollow || (u.find(".swipeout-actions-opened").removeClass("swipeout-actions-opened"), u.removeClass("swipeout-opened"))
                            }
                            if (p = !0, e.preventDefault(), d = t - O.x, b = d, y && ("right" === w ? b -= g : b += v), 0 < b && 0 === m.length || b < 0 && 0 === f.length) {
                                if (!y) return p = l = !1, h.transform(""), x && 0 < x.length && x.transform(""), void(C && 0 < C.length && C.transform(""));
                                b = 0
                            }
                            var n, r;
                            if (b < 0 ? E = "to-left" : 0 < b ? E = "to-right" : E || (E = "to-left"), e.f7PreventSwipePanel = !0, P.params.swipeout.noFollow) return y ? ("right" === w && 0 < d && P.swipeout.close(u), "left" === w && d < 0 && P.swipeout.close(u)) : (d < 0 && 0 < f.length && P.swipeout.open(u, "right"), 0 < d && 0 < m.length && P.swipeout.open(u, "left")), void(p = l = !1);
                            if (M = T = !1, 0 < f.length) {
                                var i = b;
                                r = i / g, i < -g && (i = -g - Math.pow(-i - g, .8), b = i, 0 < S.length && (M = !0)), "to-left" !== E && (i = r = 0), x.each(function(e, t) {
                                    var a = $(t);
                                    void 0 === t.f7SwipeoutButtonOffset && (a[0].f7SwipeoutButtonOffset = t.offsetLeft), n = t.f7SwipeoutButtonOffset, 0 < S.length && a.hasClass("swipeout-overswipe") && "to-left" === E && (a.css({ left: (M ? -n : 0) + "px" }), M ? (a.hasClass("swipeout-overswipe-active") || (u.trigger("swipeout:overswipeenter"), P.emit("swipeoutOverswipeEnter", u[0])), a.addClass("swipeout-overswipe-active")) : (a.hasClass("swipeout-overswipe-active") && (u.trigger("swipeout:overswipeexit"), P.emit("swipeoutOverswipeExit", u[0])), a.removeClass("swipeout-overswipe-active"))), a.transform("translate3d(" + (i - n * (1 + Math.max(r, -1))) + "px,0,0)")
                                })
                            }
                            if (0 < m.length) {
                                var o = b;
                                r = o / v, v < o && (o = v + Math.pow(o - v, .8), b = o, 0 < k.length && (T = !0)), "to-right" !== E && (r = o = 0), C.each(function(e, t) {
                                    var a = $(t);
                                    void 0 === t.f7SwipeoutButtonOffset && (a[0].f7SwipeoutButtonOffset = v - t.offsetLeft - t.offsetWidth), n = t.f7SwipeoutButtonOffset, 0 < k.length && a.hasClass("swipeout-overswipe") && "to-right" === E && (a.css({ left: (T ? n : 0) + "px" }), T ? (a.hasClass("swipeout-overswipe-active") || (u.trigger("swipeout:overswipeenter"), P.emit("swipeoutOverswipeEnter", u[0])), a.addClass("swipeout-overswipe-active")) : (a.hasClass("swipeout-overswipe-active") && (u.trigger("swipeout:overswipeexit"), P.emit("swipeoutOverswipeExit", u[0])), a.removeClass("swipeout-overswipe-active"))), 1 < C.length && a.css("z-index", C.length - e), a.transform("translate3d(" + (o + n * (1 - Math.min(r, 1))) + "px,0,0)")
                                })
                            }
                            u.trigger("swipeout", r), P.emit("swipeout", u[0], r), h.transform("translate3d(" + b + "px,0,0)")
                        }
                    }
                }), P.on("touchend:passive", function() {
                    if (l && p) {
                        p = l = !1;
                        var e, t, a, n, r = (new Date).getTime() - c,
                            i = "to-left" === E ? f : m,
                            o = "to-left" === E ? g : v;
                        if (e = r < 300 && (d < -10 && "to-left" === E || 10 < d && "to-right" === E) || 300 <= r && Math.abs(b) > o / 2 ? "open" : "close", r < 300 && (0 === Math.abs(b) && (e = "close"), Math.abs(b) === o && (e = "open")), "open" === e) {
                            Swipeout.el = u[0], u.trigger("swipeout:open"), P.emit("swipeoutOpen", u[0]), u.addClass("swipeout-opened swipeout-transitioning");
                            var s = "to-left" === E ? -o : o;
                            if (h.transform("translate3d(" + s + "px,0,0)"), i.addClass("swipeout-actions-opened"), t = "to-left" === E ? x : C)
                                for (a = 0; a < t.length; a += 1) $(t[a]).transform("translate3d(" + s + "px,0,0)");
                            M && f.find(".swipeout-overswipe")[0].click(), T && m.find(".swipeout-overswipe")[0].click()
                        } else u.trigger("swipeout:close"), P.emit("swipeoutClose", u[0]), Swipeout.el = void 0, u.addClass("swipeout-transitioning").removeClass("swipeout-opened"), h.transform(""), i.removeClass("swipeout-actions-opened");
                        C && 0 < C.length && C !== t && C.each(function(e, t) {
                            var a = $(t);
                            void 0 === (n = t.f7SwipeoutButtonOffset) && (a[0].f7SwipeoutButtonOffset = v - t.offsetLeft - t.offsetWidth), a.transform("translate3d(" + n + "px,0,0)")
                        }), x && 0 < x.length && x !== t && x.each(function(e, t) {
                            var a = $(t);
                            void 0 === (n = t.f7SwipeoutButtonOffset) && (a[0].f7SwipeoutButtonOffset = t.offsetLeft), a.transform("translate3d(" + -n + "px,0,0)")
                        }), h.transitionEnd(function() { y && "open" === e || !y && "close" === e || (u.trigger("open" === e ? "swipeout:opened" : "swipeout:closed"), P.emit("open" === e ? "swipeoutOpened" : "swipeoutClosed", u[0]), u.removeClass("swipeout-transitioning"), y && "close" === e && (0 < f.length && x.transform(""), 0 < m.length && C.transform(""))) })
                    } else p = l = !1
                })
            },
            allow: !0,
            el: void 0,
            open: function() {
                for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a];
                var n = this,
                    r = t[0],
                    i = t[1],
                    o = t[2];
                "function" == typeof t[1] && (r = (e = t)[0], o = e[1], i = e[2]);
                var s = $(r).eq(0);
                if (0 !== s.length && s.hasClass("swipeout") && !s.hasClass("swipeout-opened")) {
                    i || (i = 0 < s.find(".swipeout-actions-right").length ? "right" : "left");
                    var l = s.find(".swipeout-actions-" + i),
                        p = s.find(".swipeout-content");
                    if (0 !== l.length) {
                        s.trigger("swipeout:open").addClass("swipeout-opened").removeClass("swipeout-transitioning"), n.emit("swipeoutOpen", s[0]), l.addClass("swipeout-actions-opened");
                        var c = l.children("a"),
                            d = l.outerWidth(),
                            u = "right" === i ? -d : d;
                        1 < c.length && c.each(function(e, t) { var a = $(t); "right" === i ? a.transform("translate3d(" + -t.offsetLeft + "px,0,0)") : a.css("z-index", c.length - e).transform("translate3d(" + (d - t.offsetWidth - t.offsetLeft) + "px,0,0)") }), s.addClass("swipeout-transitioning"), p.transitionEnd(function() { s.trigger("swipeout:opened"), n.emit("swipeoutOpened", s[0]), o && o.call(s[0]) }), Utils.nextFrame(function() { c.transform("translate3d(" + u + "px,0,0)"), p.transform("translate3d(" + u + "px,0,0)") }), Swipeout.el = s[0]
                    }
                }
            },
            close: function(e, t) {
                var a = this,
                    n = $(e).eq(0);
                if (0 !== n.length && n.hasClass("swipeout-opened")) {
                    var r, i = n.find(".swipeout-actions-opened").hasClass("swipeout-actions-right") ? "right" : "left",
                        o = n.find(".swipeout-actions-opened").removeClass("swipeout-actions-opened"),
                        s = o.children("a"),
                        l = o.outerWidth();
                    Swipeout.allow = !1, n.trigger("swipeout:close"), a.emit("swipeoutClose", n[0]), n.removeClass("swipeout-opened").addClass("swipeout-transitioning"), n.find(".swipeout-content").transform("").transitionEnd(p), r = setTimeout(p, 500), s.each(function(e, t) { var a = $(t); "right" === i ? a.transform("translate3d(" + -t.offsetLeft + "px,0,0)") : a.transform("translate3d(" + (l - t.offsetWidth - t.offsetLeft) + "px,0,0)"), a.css({ left: "0px" }).removeClass("swipeout-overswipe-active") }), Swipeout.el && Swipeout.el === n[0] && (Swipeout.el = void 0)
                }

                function p() { Swipeout.allow = !0, n.hasClass("swipeout-opened") || (n.removeClass("swipeout-transitioning"), s.transform(""), n.trigger("swipeout:closed"), a.emit("swipeoutClosed", n[0]), t && t.call(n[0]), r && clearTimeout(r)) }
            },
            delete: function(e, a) {
                var n = this,
                    r = $(e).eq(0);
                0 !== r.length && (Swipeout.el = void 0, r.trigger("swipeout:delete"), n.emit("swipeoutDelete", r[0]), r.css({ height: r.outerHeight() + "px" }), r.transitionEnd(function() {
                    if (r.trigger("swipeout:deleted"), n.emit("swipeoutDeleted", r[0]), a && a.call(r[0]), 0 < r.parents(".virtual-list").length) {
                        var e = r.parents(".virtual-list")[0].f7VirtualList,
                            t = r[0].f7VirtualListIndex;
                        e && void 0 !== t && e.deleteItem(t)
                    } else n.params.swipeout.removeElements ? n.params.swipeout.removeElementsWithTimeout ? setTimeout(function() { r.remove() }, n.params.swipeout.removeElementsTimeout) : r.remove() : r.removeClass("swipeout-deleting swipeout-transitioning")
                }), Utils.nextFrame(function() { r.addClass("swipeout-deleting swipeout-transitioning").css({ height: "0px" }).find(".swipeout-content").transform("translate3d(-100%,0,0)") }))
            }
        },
        Swipeout$1 = {
            name: "swipeout",
            params: { swipeout: { actionsNoFold: !1, noFollow: !1, removeElements: !0, removeElementsWithTimeout: !1, removeElementsTimeout: 0 } },
            create: function() {
                var e = this;
                Utils.extend(e, { swipeout: { init: Swipeout.init.bind(e), open: Swipeout.open.bind(e), close: Swipeout.close.bind(e), delete: Swipeout.delete.bind(e) } }), Object.defineProperty(e.swipeout, "el", { enumerable: !0, configurable: !0, get: function() { return Swipeout.el }, set: function(e) { Swipeout.el = e } }), Object.defineProperty(e.swipeout, "allow", { enumerable: !0, configurable: !0, get: function() { return Swipeout.allow }, set: function(e) { Swipeout.allow = e } })
            },
            clicks: {
                ".swipeout-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.swipeout.open(t.swipeout, t.side)
                },
                ".swipeout-close": function(e) {
                    var t = e.closest(".swipeout");
                    0 !== t.length && this.swipeout.close(t)
                },
                ".swipeout-delete": function(e, t) {
                    void 0 === t && (t = {});
                    var a = this,
                        n = e.closest(".swipeout");
                    if (0 !== n.length) {
                        var r = t.confirm,
                            i = t.confirmTitle;
                        t.confirm ? a.dialog.confirm(r, i, function() { a.swipeout.delete(n) }) : a.swipeout.delete(n)
                    }
                }
            },
            on: { init: function() { this.params.swipeout && this.swipeout.init() } }
        },
        Accordion = {
            toggleClicked: function(e) {
                var t = e.closest(".accordion-item").eq(0);
                t.length || (t = e.parents("li").eq(0));
                var a = e.parents(".accordion-item-content").eq(0);
                a.length && a.parents(t).length || 1 < e.parents("li").length && e.parents("li")[0] !== t[0] || this.accordion.toggle(t)
            },
            open: function(e) {
                var t = this,
                    a = $(e),
                    n = a.parents(".accordion-list").eq(0),
                    r = a.children(".accordion-item-content");
                if (r.removeAttr("aria-hidden"), 0 === r.length && (r = a.find(".accordion-item-content")), 0 !== r.length) {
                    var i = 0 < n.length && a.parent().children(".accordion-item-opened");
                    0 < i.length && t.accordion.close(i), r.transitionEnd(function() { a.hasClass("accordion-item-opened") ? (r.transition(0), r.css("height", "auto"), Utils.nextFrame(function() { r.transition(""), a.trigger("accordion:opened"), t.emit("accordionOpened", a[0]) })) : (r.css("height", ""), a.trigger("accordion:closed"), t.emit("accordionClosed", a[0])) }), r.css("height", r[0].scrollHeight + "px"), a.trigger("accordion:open"), a.addClass("accordion-item-opened"), t.emit("accordionOpen", a[0])
                }
            },
            close: function(e) {
                var t = this,
                    a = $(e),
                    n = a.children(".accordion-item-content");
                0 === n.length && (n = a.find(".accordion-item-content")), a.removeClass("accordion-item-opened"), n.attr("aria-hidden", !0), n.transition(0), n.css("height", n[0].scrollHeight + "px"), n.transitionEnd(function() { a.hasClass("accordion-item-opened") ? (n.transition(0), n.css("height", "auto"), Utils.nextFrame(function() { n.transition(""), a.trigger("accordion:opened"), t.emit("accordionOpened", a[0]) })) : (n.css("height", ""), a.trigger("accordion:closed"), t.emit("accordionClosed", a[0])) }), Utils.nextFrame(function() { n.transition(""), n.css("height", ""), a.trigger("accordion:close"), t.emit("accordionClose", a[0]) })
            },
            toggle: function(e) {
                var t = $(e);
                0 !== t.length && (t.hasClass("accordion-item-opened") ? this.accordion.close(e) : this.accordion.open(e))
            }
        },
        Accordion$1 = { name: "accordion", create: function() { Utils.extend(this, { accordion: { open: Accordion.open.bind(this), close: Accordion.close.bind(this), toggle: Accordion.toggle.bind(this) } }) }, clicks: { ".accordion-item .item-link, .accordion-item-toggle, .links-list.accordion-list > ul > li > a": function(e) { Accordion.toggleClicked.call(this, e) } } },
        ContactsList = { name: "contactsList" },
        VirtualList = function(u) {
            function e(e, t) {
                void 0 === t && (t = {}), u.call(this, t, [e]);
                var a = this,
                    n = { cols: 1, height: "md" === e.theme ? 48 : 44, cache: !0, dynamicHeightBufferSize: 1, showFilteredItemsOnly: !1, renderExternal: void 0, setListHeight: !0, searchByItem: void 0, searchAll: void 0, itemTemplate: void 0, ul: null, createUl: !0, renderItem: function(e) { return ('\n          <li>\n            <div class="item-content">\n              <div class="item-inner">\n                <div class="item-title">' + e + "</div>\n              </div>\n            </div>\n          </li>\n        ").trim() }, on: {} };
                if (a.useModulesParams(n), a.params = Utils.extend(n, t), void 0 !== a.params.height && a.params.height || (a.params.height = "md" === e.theme ? 48 : 44), a.$el = $(t.el), a.el = a.$el[0], 0 !== a.$el.length) {
                    (a.$el[0].f7VirtualList = a).items = a.params.items, a.params.showFilteredItemsOnly && (a.filteredItems = []), a.params.itemTemplate ? "string" == typeof a.params.itemTemplate ? a.renderItem = Template7.compile(a.params.itemTemplate) : "function" == typeof a.params.itemTemplate && (a.renderItem = a.params.itemTemplate) : a.params.renderItem && (a.renderItem = a.params.renderItem), a.$pageContentEl = a.$el.parents(".page-content"), a.pageContentEl = a.$pageContentEl[0], void 0 !== a.params.updatableScroll ? a.updatableScroll = a.params.updatableScroll : (a.updatableScroll = !0, Device.ios && Device.osVersion.split(".")[0] < 8 && (a.updatableScroll = !1));
                    var r, i = a.params.ul;
                    a.$ul = i ? $(a.params.ul) : a.$el.children("ul"), 0 === a.$ul.length && a.params.createUl && (a.$el.append("<ul></ul>"), a.$ul = a.$el.children("ul")), a.ul = a.$ul[0], r = a.ul || a.params.createUl ? a.$ul : a.$el, Utils.extend(a, { $itemsWrapEl: r, itemsWrapEl: r[0], domCache: {}, displayDomCache: {}, tempDomElement: doc.createElement("ul"), lastRepaintY: null, fragment: doc.createDocumentFragment(), pageHeight: void 0, rowsPerScreen: void 0, rowsBefore: void 0, rowsAfter: void 0, rowsToRender: void 0, maxBufferHeight: 0, listHeight: void 0, dynamicHeight: "function" == typeof a.params.height }), a.useModules();
                    var o, s, l, p, c = a.handleScroll.bind(a),
                        d = a.handleResize.bind(a);
                    return a.attachEvents = function() { o = a.$el.parents(".page").eq(0), s = a.$el.parents(".tab").eq(0), l = a.$el.parents(".panel").eq(0), p = a.$el.parents(".popup").eq(0), a.$pageContentEl.on("scroll", c), o && o.on("page:reinit", d), s && s.on("tab:show", d), l && l.on("panel:open", d), p && p.on("popup:open", d), e.on("resize", d) }, a.detachEvents = function() { a.$pageContentEl.off("scroll", c), o && o.off("page:reinit", d), s && s.off("tab:show", d), l && l.off("panel:open", d), p && p.off("popup:open", d), e.off("resize", d) }, a.init(), a
                }
            }
            return u && (e.__proto__ = u), ((e.prototype = Object.create(u && u.prototype)).constructor = e).prototype.setListSize = function() {
                var e = this,
                    t = e.filteredItems || e.items;
                if (e.pageHeight = e.$pageContentEl[0].offsetHeight, e.dynamicHeight) {
                    e.listHeight = 0, e.heights = [];
                    for (var a = 0; a < t.length; a += 1) {
                        var n = e.params.height(t[a]);
                        e.listHeight += n, e.heights.push(n)
                    }
                } else e.listHeight = Math.ceil(t.length / e.params.cols) * e.params.height, e.rowsPerScreen = Math.ceil(e.pageHeight / e.params.height), e.rowsBefore = e.params.rowsBefore || 2 * e.rowsPerScreen, e.rowsAfter = e.params.rowsAfter || e.rowsPerScreen, e.rowsToRender = e.rowsPerScreen + e.rowsBefore + e.rowsAfter, e.maxBufferHeight = e.rowsBefore / 2 * e.params.height;
                (e.updatableScroll || e.params.setListHeight) && e.$itemsWrapEl.css({ height: e.listHeight + "px" })
            }, e.prototype.render = function(e, t) {
                var a = this;
                e && (a.lastRepaintY = null);
                var n = -(a.$el[0].getBoundingClientRect().top - a.$pageContentEl[0].getBoundingClientRect().top);
                if (void 0 !== t && (n = t), null === a.lastRepaintY || Math.abs(n - a.lastRepaintY) > a.maxBufferHeight || !a.updatableScroll && a.$pageContentEl[0].scrollTop + a.pageHeight >= a.$pageContentEl[0].scrollHeight) {
                    a.lastRepaintY = n;
                    var r, i, o, s = a.filteredItems || a.items,
                        l = 0,
                        p = 0;
                    if (a.dynamicHeight) {
                        var c, d = 0;
                        a.maxBufferHeight = a.pageHeight;
                        for (var u = 0; u < a.heights.length; u += 1) c = a.heights[u], void 0 === r && (d + c >= n - 2 * a.pageHeight * a.params.dynamicHeightBufferSize ? r = u : l += c), void 0 === i && ((d + c >= n + 2 * a.pageHeight * a.params.dynamicHeightBufferSize || u === a.heights.length - 1) && (i = u + 1), p += c), d += c;
                        i = Math.min(i, s.length)
                    } else(r = (parseInt(n / a.params.height, 10) - a.rowsBefore) * a.params.cols) < 0 && (r = 0), i = Math.min(r + a.rowsToRender * a.params.cols, s.length);
                    var h, f = [];
                    for (a.reachEnd = !1, h = r; h < i; h += 1) {
                        var m = void 0,
                            v = a.items.indexOf(s[h]);
                        h === r && (a.currentFromIndex = v), h === i - 1 && (a.currentToIndex = v), a.filteredItems ? a.items[v] === a.filteredItems[a.filteredItems.length - 1] && (a.reachEnd = !0) : v === a.items.length - 1 && (a.reachEnd = !0), a.params.renderExternal ? f.push(s[h]) : a.domCache[v] ? (m = a.domCache[v]).f7VirtualListIndex = v : (a.renderItem ? a.tempDomElement.innerHTML = a.renderItem(s[h], v).trim() : a.tempDomElement.innerHTML = s[h].toString().trim(), m = a.tempDomElement.childNodes[0], a.params.cache && (a.domCache[v] = m), m.f7VirtualListIndex = v), h === r && (o = a.dynamicHeight ? l : h * a.params.height / a.params.cols), a.params.renderExternal || (m.style.top = o + "px", a.emit("local::itemBeforeInsert vlItemBeforeInsert", a, m, s[h]), a.fragment.appendChild(m))
                    }
                    a.updatableScroll || (a.dynamicHeight ? a.itemsWrapEl.style.height = p + "px" : a.itemsWrapEl.style.height = h * a.params.height / a.params.cols + "px"), a.params.renderExternal ? s && 0 === s.length && (a.reachEnd = !0) : (a.emit("local::beforeClear vlBeforeClear", a, a.fragment), a.itemsWrapEl.innerHTML = "", a.emit("local::itemsBeforeInsert vlItemsBeforeInsert", a, a.fragment), s && 0 === s.length ? (a.reachEnd = !0, a.params.emptyTemplate && (a.itemsWrapEl.innerHTML = a.params.emptyTemplate)) : a.itemsWrapEl.appendChild(a.fragment), a.emit("local::itemsAfterInsert vlItemsAfterInsert", a, a.fragment)), void 0 !== t && e && a.$pageContentEl.scrollTop(t, 0), a.params.renderExternal && a.params.renderExternal(a, { fromIndex: r, toIndex: i, listHeight: a.listHeight, topPosition: o, items: f })
                }
            }, e.prototype.filterItems = function(e, t) {
                void 0 === t && (t = !0);
                this.filteredItems = [];
                for (var a = 0; a < e.length; a += 1) this.filteredItems.push(this.items[e[a]]);
                t && (this.$pageContentEl[0].scrollTop = 0), this.update()
            }, e.prototype.resetFilter = function() { this.params.showFilteredItemsOnly ? this.filteredItems = [] : (this.filteredItems = null, delete this.filteredItems), this.update() }, e.prototype.scrollToItem = function(e) {
                if (e > this.items.length) return !1;
                var t = 0;
                if (this.dynamicHeight)
                    for (var a = 0; a < e; a += 1) t += this.heights[a];
                else t = e * this.params.height;
                var n = this.$el[0].offsetTop;
                return this.render(!0, n + t - parseInt(this.$pageContentEl.css("padding-top"), 10)), !0
            }, e.prototype.handleScroll = function() { this.render() }, e.prototype.isVisible = function() { return !!(this.el.offsetWidth || this.el.offsetHeight || this.el.getClientRects().length) }, e.prototype.handleResize = function() { this.isVisible() && (this.setListSize(), this.render(!0)) }, e.prototype.appendItems = function(e) {
                for (var t = 0; t < e.length; t += 1) this.items.push(e[t]);
                this.update()
            }, e.prototype.appendItem = function(e) { this.appendItems([e]) }, e.prototype.replaceAllItems = function(e) { this.items = e, delete this.filteredItems, this.domCache = {}, this.update() }, e.prototype.replaceItem = function(e, t) { this.items[e] = t, this.params.cache && delete this.domCache[e], this.update() }, e.prototype.prependItems = function(t) {
                for (var a = this, e = t.length - 1; 0 <= e; e -= 1) a.items.unshift(t[e]);
                if (a.params.cache) {
                    var n = {};
                    Object.keys(a.domCache).forEach(function(e) { n[parseInt(e, 10) + t.length] = a.domCache[e] }), a.domCache = n
                }
                a.update()
            }, e.prototype.prependItem = function(e) { this.prependItems([e]) }, e.prototype.moveItem = function(e, t) {
                var i = this,
                    o = e,
                    s = t;
                if (o !== s) {
                    var a = i.items.splice(o, 1)[0];
                    if (s >= i.items.length ? (i.items.push(a), s = i.items.length - 1) : i.items.splice(s, 0, a), i.params.cache) {
                        var l = {};
                        Object.keys(i.domCache).forEach(function(e) {
                            var t = parseInt(e, 10),
                                a = o < s ? o : s,
                                n = o < s ? s : o,
                                r = o < s ? -1 : 1;
                            (t < a || n < t) && (l[t] = i.domCache[t]), t === a && (l[n] = i.domCache[t]), a < t && t <= n && (l[t + r] = i.domCache[t])
                        }), i.domCache = l
                    }
                    i.update()
                }
            }, e.prototype.insertItemBefore = function(a, e) {
                var n = this;
                if (0 !== a)
                    if (a >= n.items.length) n.appendItem(e);
                    else {
                        if (n.items.splice(a, 0, e), n.params.cache) {
                            var r = {};
                            Object.keys(n.domCache).forEach(function(e) {
                                var t = parseInt(e, 10);
                                a <= t && (r[t + 1] = n.domCache[t])
                            }), n.domCache = r
                        }
                        n.update()
                    }
                else n.prependItem(e)
            }, e.prototype.deleteItems = function(r) {
                for (var i, o = this, s = 0, e = function(e) {
                        var a = r[e];
                        void 0 !== i && i < a && (s = -e), a += s, i = r[e];
                        var t = o.items.splice(a, 1)[0];
                        if (o.filteredItems && 0 <= o.filteredItems.indexOf(t) && o.filteredItems.splice(o.filteredItems.indexOf(t), 1), o.params.cache) {
                            var n = {};
                            Object.keys(o.domCache).forEach(function(e) {
                                var t = parseInt(e, 10);
                                t === a ? delete o.domCache[a] : parseInt(e, 10) > a ? n[t - 1] = o.domCache[e] : n[t] = o.domCache[e]
                            }), o.domCache = n
                        }
                    }, t = 0; t < r.length; t += 1) e(t);
                o.update()
            }, e.prototype.deleteAllItems = function() { this.items = [], delete this.filteredItems, this.params.cache && (this.domCache = {}), this.update() }, e.prototype.deleteItem = function(e) { this.deleteItems([e]) }, e.prototype.clearCache = function() { this.domCache = {} }, e.prototype.update = function(e) { e && this.params.cache && (this.domCache = {}), this.setListSize(), this.render(!0) }, e.prototype.init = function() { this.attachEvents(), this.setListSize(), this.render() }, e.prototype.destroy = function() {
                var e = this;
                e.detachEvents(), e.$el[0].f7VirtualList = null, delete e.$el[0].f7VirtualList, Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        VirtualList$1 = { name: "virtualList", static: { VirtualList: VirtualList }, create: function() { this.virtualList = ConstructorMethods({ defaultSelector: ".virtual-list", constructor: VirtualList, app: this, domProp: "f7VirtualList" }) } },
        ListIndex = function(C) {
            function e(e, t) {
                void 0 === t && (t = {}), C.call(this, t, [e]);
                var s, a, n, r, l = this,
                    i = { el: null, listEl: null, indexes: "auto", iosItemHeight: 14, mdItemHeight: 14, scrollList: !0, label: !1, renderItem: function(e, t) { return ("\n          <li>" + e + "</li>\n        ").trim() }, renderSkipPlaceholder: function() { return '<li class="list-index-skip-placeholder"></li>' }, on: {} };
                if (l.useModulesParams(i), l.params = Utils.extend(i, t), !l.params.el) return l;
                if ((s = $(l.params.el))[0].f7ListIndex) return s[0].f7ListIndex;
                if (0 === (r = s.find("ul")).length && (r = $("<ul></ul>"), s.append(r)), l.params.listEl && (a = $(l.params.listEl)), "auto" === l.params.indexes && !a) return l;

                function o() {
                    var e = { index: l };
                    l.calcSize(), e !== l.height && l.render()
                }

                function p(e) {
                    var t = $(e.target).closest("li");
                    if (t.length) {
                        var a = t.index();
                        if (0 < l.skipRate) {
                            var n = a / (t.siblings("li").length - 1);
                            a = Math.round((l.indexes.length - 1) * n)
                        }
                        var r = l.indexes[a];
                        l.$el.trigger("listindex:click", r, a), l.emit("local::click listIndexClick", l, r, a), l.$el.trigger("listindex:select", r, a), l.emit("local::select listIndexSelect", l, r, a), l.$listEl && l.params.scrollList && l.scrollListToIndex(r, a)
                    }
                }
                a ? n = a.parents(".page-content").eq(0) : 0 === (n = s.siblings(".page-content").eq(0)).length && (n = s.parents(".page").eq(0).find(".page-content").eq(0)), s[0].f7ListIndex = l, Utils.extend(l, { app: e, $el: s, el: s && s[0], $ul: r, ul: r && r[0], $listEl: a, listEl: a && a[0], $pageContentEl: n, pageContentEl: n && n[0], indexes: t.indexes, height: 0, skipRate: 0 }), l.useModules();
                var c, d, u, h, f, m = {},
                    v = null;

                function g(e) {
                    var t = r.children();
                    t.length && (u = t[0].getBoundingClientRect().top, h = t[t.length - 1].getBoundingClientRect().top + t[0].offsetHeight, m.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, m.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, d = !(c = !0), v = null)
                }

                function b(e) {
                    if (c) {
                        !d && l.params.label && (f = $('<span class="list-index-label"></span>'), s.append(f)), d = !0;
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        e.preventDefault();
                        var a = (t - u) / (h - u);
                        a = Math.min(Math.max(a, 0), 1);
                        var n = Math.round((l.indexes.length - 1) * a),
                            r = l.indexes[n],
                            i = h - u,
                            o = (l.height - i) / 2 + (1 - a) * i;
                        n !== v && (l.params.label && f.html(r).transform("translateY(-" + o + "px)"), l.$listEl && l.params.scrollList && l.scrollListToIndex(r, n)), v = n, l.$el.trigger("listindex:select", l), l.emit("local::select listIndexSelect", l, r, n)
                    }
                }

                function y() { c && (d = c = !1, l.params.label && (f && f.remove(), f = void 0)) }
                var w = !!e.support.passiveListener && { passive: !0 };
                return l.attachEvents = function() { s.parents(".tab").on("tab:show", o), s.parents(".page").on("page:reinit", o), s.parents(".panel").on("panel:open", o), s.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").on("modal:open", o), e.on("resize", o), s.on("click", p), s.on(e.touchEvents.start, g, w), e.on("touchmove:active", b), e.on("touchend:passive", y) }, l.detachEvents = function() { s.parents(".tab").off("tab:show", o), s.parents(".page").off("page:reinit", o), s.parents(".panel").off("panel:open", o), s.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").off("modal:open", o), e.off("resize", o), s.off("click", p), s.off(e.touchEvents.start, g, w), e.off("touchmove:active", b), e.off("touchend:passive", y) }, l.init(), l
            }
            return C && (e.__proto__ = C), ((e.prototype = Object.create(C && C.prototype)).constructor = e).prototype.scrollListToIndex = function(n, e) {
                var r, t = this.$listEl,
                    a = this.$pageContentEl;
                if (!t || !a || 0 === a.length) return this;
                if (t.find(".list-group-title, .item-divider").each(function(e, t) {
                        if (!r) {
                            var a = $(t);
                            a.text() === n && (r = a)
                        }
                    }), !r || 0 === r.length) return this;
                var i = r.parent().offset().top,
                    o = parseInt(a.css("padding-top"), 10),
                    s = a[0].scrollTop,
                    l = r.offset().top;
                return i <= o ? a.scrollTop(i + s - o) : a.scrollTop(l + s - o), this
            }, e.prototype.renderSkipPlaceholder = function() { return this.params.renderSkipPlaceholder.call(this) }, e.prototype.renderItem = function(e, t) { return this.params.renderItem.call(this, e, t) }, e.prototype.render = function() {
                var n, r = this,
                    e = r.$ul,
                    t = r.indexes,
                    i = r.skipRate,
                    a = t.map(function(e, t) { if (t % i != 0 && 0 < i) return n = !0, ""; var a = r.renderItem(e, t); return n && (a = r.renderSkipPlaceholder() + a), n = !1, a }).join("");
                return e.html(a), r
            }, e.prototype.calcSize = function() {
                var e = this.app,
                    t = this.params,
                    a = this.el,
                    n = this.indexes,
                    r = a.offsetHeight,
                    i = "ios" === e.theme ? t.iosItemHeight : t.mdItemHeight,
                    o = Math.floor(r / i),
                    s = n.length,
                    l = 0;
                return o < s && (l = Math.ceil((2 * s - 1) / o)), this.height = r, this.skipRate = l, this
            }, e.prototype.calcIndexes = function() {
                var n = this;
                return "auto" === n.params.indexes ? (n.indexes = [], n.$listEl.find(".list-group-title, .item-divider").each(function(e, t) {
                    var a = $(t).text();
                    n.indexes.indexOf(a) < 0 && n.indexes.push(a)
                })) : n.indexes = n.params.indexes, n
            }, e.prototype.update = function() { return this.calcIndexes(), this.calcSize(), this.render(), this }, e.prototype.init = function() { this.calcIndexes(), this.calcSize(), this.render(), this.attachEvents() }, e.prototype.destroy = function() {
                var e = this;
                e.$el.trigger("listindex:beforedestroy", e), e.emit("local::beforeDestroy listIndexBeforeDestroy", e), e.detachEvents(), e.$el[0] && (e.$el[0].f7ListIndex = null, delete e.$el[0].f7ListIndex), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        ListIndex$1 = {
            name: "listIndex",
            static: { ListIndex: ListIndex },
            create: function() { this.listIndex = ConstructorMethods({ defaultSelector: ".list-index", constructor: ListIndex, app: this, domProp: "f7ListIndex" }) },
            on: {
                tabMounted: function(e) {
                    var n = this;
                    $(e).find(".list-index-init").each(function(e, t) {
                        var a = Utils.extend($(t).dataset(), { el: t });
                        n.listIndex.create(a)
                    })
                },
                tabBeforeRemove: function(e) { $(e).find(".list-index-init").each(function(e, t) { t.f7ListIndex && t.f7ListIndex.destroy() }) },
                pageInit: function(e) {
                    var n = this;
                    e.$el.find(".list-index-init").each(function(e, t) {
                        var a = Utils.extend($(t).dataset(), { el: t });
                        n.listIndex.create(a)
                    })
                },
                pageBeforeRemove: function(e) { e.$el.find(".list-index-init").each(function(e, t) { t.f7ListIndex && t.f7ListIndex.destroy() }) }
            },
            vnode: {
                "list-index-init": {
                    insert: function(e) {
                        var t = e.elm,
                            a = Utils.extend($(t).dataset(), { el: t });
                        this.listIndex.create(a)
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7ListIndex && t.f7ListIndex.destroy()
                    }
                }
            }
        },
        Timeline = { name: "timeline" },
        Tab = {
            show: function() {
                for (var e, t, a, n = [], r = arguments.length; r--;) n[r] = arguments[r];
                var i, o, s, l, p = this;
                1 === n.length && n[0].constructor === Object ? (i = n[0].tabEl, o = n[0].tabLinkEl, s = n[0].animate, l = n[0].tabRoute) : (i = (e = n)[0], o = e[1], s = e[2], l = e[3], "boolean" == typeof n[1] && (i = (t = n)[0], s = t[1], o = t[2], l = t[3], 2 < n.length && o.constructor === Object && (i = (a = n)[0], s = a[1], l = a[2], o = a[3]))), void 0 === s && (s = !0);
                var c, d = $(i);
                if (l && d[0] && (d[0].f7TabRoute = l), 0 === d.length || d.hasClass("tab-active")) return { $newTabEl: d, newTabEl: d[0] };
                o && (c = $(o));
                var u = d.parent(".tabs");
                if (0 === u.length) return { $newTabEl: d, newTabEl: d[0] };
                p.swipeout && (p.swipeout.allowOpen = !0);
                var h = [];

                function f() { h.forEach(function(e) { e() }) }
                var m, v = !1;
                if (u.parent().hasClass("tabs-animated-wrap")) {
                    u.parent()[s ? "removeClass" : "addClass"]("not-animated");
                    var g = parseFloat(u.css("transition-duration").replace(",", "."));
                    s && g && (u.transitionEnd(f), v = !0);
                    var b = 100 * (p.rtl ? d.index() : -d.index());
                    u.transform("translate3d(" + b + "%,0,0)")
                }
                u.parent().hasClass("tabs-swipeable-wrap") && p.swiper && ((m = u.parent()[0].swiper) && m.activeIndex !== d.index() ? (v = !0, m.once("slideChangeTransitionEnd", function() { f() }).slideTo(d.index(), s ? void 0 : 0)) : m && m.animating && (v = !0, m.once("slideChangeTransitionEnd", function() { f() })));
                var y = u.children(".tab-active");
                if (y.removeClass("tab-active"), (!m || m && !m.animating) && (y.trigger("tab:hide"), p.emit("tabHide", y[0])), d.addClass("tab-active"), (!m || m && !m.animating) && (d.trigger("tab:show"), p.emit("tabShow", d[0])), !c && ((!(c = $("string" == typeof i ? '.tab-link[href="' + i + '"]' : '.tab-link[href="#' + d.attr("id") + '"]')) || c && 0 === c.length) && $("[data-tab]").each(function(e, t) { d.is($(t).attr("data-tab")) && (c = $(t)) }), l && (!c || c && 0 === c.length) && 0 === (c = $('[data-route-tab-id="' + l.route.tab.id + '"]')).length && (c = $('.tab-link[href="' + l.url + '"]')), 1 < c.length && d.parents(".page").length && (c = c.filter(function(e, t) { return $(t).parents(".page")[0] === d.parents(".page")[0] }), "ios" === p.theme && 0 === c.length && l))) {
                    var w = d.parents(".page"),
                        C = $(p.navbar.getElByPage(w));
                    0 === (c = C.find('[data-route-tab-id="' + l.route.tab.id + '"]')).length && (c = C.find('.tab-link[href="' + l.url + '"]'))
                }
                if (0 < c.length) {
                    var x;
                    if (y && 0 < y.length) {
                        var E = y.attr("id");
                        E && (!(x = $('.tab-link[href="#' + E + '"]')) || x && 0 === x.length) && (x = $('.tab-link[data-route-tab-id="' + E + '"]')), (!x || x && 0 === x.length) && $("[data-tab]").each(function(e, t) { y.is($(t).attr("data-tab")) && (x = $(t)) }), (!x || x && 0 === x.length) && (x = c.siblings(".tab-link-active"))
                    } else l && (x = c.siblings(".tab-link-active"));
                    if (x && 1 < x.length && y && y.parents(".page").length && (x = x.filter(function(e, t) { return $(t).parents(".page")[0] === y.parents(".page")[0] })), x && 0 < x.length && x.removeClass("tab-link-active"), c && 0 < c.length && (c.addClass("tab-link-active"), "md" === p.theme && p.toolbar)) {
                        var k = c.parents(".tabbar, .tabbar-labels");
                        0 < k.length && p.toolbar.setHighlight(k)
                    }
                }
                return { $newTabEl: d, newTabEl: d[0], $oldTabEl: y, oldTabEl: y[0], onTabsChanged: function(e) { h.push(e) }, animated: v }
            }
        },
        Tabs = {
            name: "tabs",
            create: function() { Utils.extend(this, { tab: { show: Tab.show.bind(this) } }) },
            clicks: {
                ".tab-link": function(e, t) {
                    void 0 === t && (t = {});
                    (e.attr("href") && 0 === e.attr("href").indexOf("#") || e.attr("data-tab")) && this.tab.show({ tabEl: t.tab || e.attr("href"), tabLinkEl: e, animate: t.animate })
                }
            }
        };

    function swipePanel(s) {
        var l = s.app;
        Utils.extend(s, { swipeable: !0, swipeInitialized: !0 });
        var t, p, c, d, u, h, f, m, v, g, b, y = l.params.panel,
            w = s.$el,
            C = s.$backdropEl,
            x = s.side,
            E = s.effect,
            k = {},
            S = 0;

        function e(e) {
            if (s.swipeable && l.panel.allowOpen && (y.swipe || y.swipeOnlyClose) && !p && !(0 < $(".modal-in, .photo-browser-in").length) && (t = l.panel["left" === x ? "right" : "left"] || {}, (s.opened || !t.opened) && (y.swipeCloseOpposite || y.swipeOnlyClose || !t.opened) && (!e.target || "input" !== e.target.nodeName.toLowerCase() || "range" !== e.target.type) && !(0 < $(e.target).closest(".range-slider, .tabs-swipeable-wrap, .calendar-months, .no-swipe-panel").length) && (k.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, k.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, (!y.swipeOnlyClose || s.opened) && ("both" === y.swipe || !y.swipeCloseOpposite || y.swipe === x || s.opened)))) {
                if (y.swipeActiveArea && !s.opened) { if ("left" === x && k.x > y.swipeActiveArea) return; if ("right" === x && k.x < l.width - y.swipeActiveArea) return }
                if (y.swipeCloseActiveAreaSide && s.opened) { if ("left" === x && k.x < w[0].offsetWidth - y.swipeCloseActiveAreaSide) return; if ("right" === x && k.x > l.width - w[0].offsetWidth + y.swipeCloseActiveAreaSide) return }
                S = 0, b = $(s.getViewEl()), p = !(c = !1), d = void 0, u = Utils.now(), g = void 0
            }
        }

        function a(e) {
            if (p && !((S += 1) < 2))
                if (e.f7PreventSwipePanel || l.preventSwipePanelBySwipeBack || l.preventSwipePanel) p = !1;
                else {
                    var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                        a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                    if (void 0 === d && (d = !!(d || Math.abs(a - k.y) > Math.abs(t - k.x))), d) p = !1;
                    else {
                        if (!g) { if (g = t > k.x ? "to-right" : "to-left", "both" === y.swipe && 0 < y.swipeActiveArea && !s.opened) { if ("left" === x && k.x > y.swipeActiveArea) return void(p = !1); if ("right" === x && k.x < l.width - y.swipeActiveArea) return void(p = !1) } if (w.hasClass("panel-visible-by-breakpoint")) return void(p = !1); if ("left" === x && "to-left" === g && !w.hasClass("panel-active") || "right" === x && "to-right" === g && !w.hasClass("panel-active")) return void(p = !1) }
                        var n = s.opened ? 0 : -y.swipeThreshold;
                        if ("right" === x && (n = -n), y.swipeNoFollow) {
                            var r, i = t - k.x,
                                o = (new Date).getTime() - u;
                            return !s.opened && ("left" === x && -n < i || "right" === x && n < -i) && (r = !0), s.opened && ("left" === x && i < 0 || "right" === x && 0 < i) && (r = !0), void(r && (o < 300 && ("to-left" === g && ("right" === x && l.panel.open(x), "left" === x && w.hasClass("panel-active") && l.panel.close()), "to-right" === g && ("left" === x && l.panel.open(x), "right" === x && w.hasClass("panel-active") && l.panel.close())), c = p = !1))
                        }
                        c || (s.opened || (w.show(), C.show(), w.trigger("panel:swipeopen", s), s.emit("local::swipeOpen panelSwipeOpen", s)), v = w[0].offsetWidth, w.transition(0)), c = !0, e.preventDefault(), h = t - k.x + n, "right" === x ? "cover" === E ? ((f = h + (s.opened ? 0 : v)) < 0 && (f = 0), v < f && (f = v)) : (0 < (f = h - (s.opened ? v : 0)) && (f = 0), f < -v && (f = -v)) : ((f = h + (s.opened ? v : 0)) < 0 && (f = 0), v < f && (f = v)), "reveal" === E ? (b.transform("translate3d(" + f + "px,0,0)").transition(0), C.transform("translate3d(" + f + "px,0,0)").transition(0)) : ("left" === x && (f -= v), w.transform("translate3d(" + f + "px,0,0)").transition(0), C.transition(0), m = 1 - Math.abs(f / v), C.css({ opacity: m })), w.trigger("panel:swipe", s, Math.abs(f / v)), s.emit("local::swipe panelSwipe", s, Math.abs(f / v))
                    }
                }
        }

        function n() {
            if (p && c) {
                c = p = !1;
                var e, t = (new Date).getTime() - u,
                    a = 0 === f || Math.abs(f) === v,
                    n = y.swipeThreshold || 0;
                if ("swap" === (e = s.opened ? "cover" === E ? 0 === f ? "reset" : t < 300 && 0 < Math.abs(f) ? "swap" : 300 <= t && Math.abs(f) < v / 2 ? "reset" : "swap" : f === -v ? "reset" : t < 300 && 0 <= Math.abs(f) || 300 <= t && Math.abs(f) <= v / 2 ? "left" === x && f === v ? "reset" : "swap" : "reset" : Math.abs(h) < n ? "reset" : "cover" === E ? 0 === f ? "swap" : t < 300 && 0 < Math.abs(f) ? "swap" : 300 <= t && Math.abs(f) < v / 2 ? "swap" : "reset" : 0 === f ? "reset" : t < 300 && 0 < Math.abs(f) || 300 <= t && Math.abs(f) >= v / 2 ? "swap" : "reset") && (s.opened ? s.close(!a) : s.open(!a)), "reset" === e && !s.opened)
                    if (a) w.css({ display: "" });
                    else {
                        var r = "reveal" === E ? b : w;
                        $("html").addClass("with-panel-transitioning"), r.transitionEnd(function() { w.hasClass("panel-active") || (w.css({ display: "" }), $("html").removeClass("with-panel-transitioning")) })
                    }
                    "reveal" === E && Utils.nextFrame(function() { b.transition(""), b.transform("") }), w.transition("").transform(""), C.css({ display: "" }).transform("").transition("").css("opacity", "")
            } else c = p = !1
        }
        l.on("touchstart:passive", e), l.on("touchmove:active", a), l.on("touchend:passive", n), s.on("panelDestroy", function() { l.off("touchstart:passive", e), l.off("touchmove:active", a), l.off("touchend:passive", n) })
    }
    var Panel = function(p) {
            function e(e, t) {
                var a;
                void 0 === t && (t = {}), p.call(this, t, [e]);
                var n = t.el;
                !n && t.content && (n = t.content);
                var r = $(n);
                if (0 === r.length) return this;
                if (r[0].f7Panel) return r[0].f7Panel;
                r[0].f7Panel = this;
                var i = t.opened,
                    o = t.side,
                    s = t.effect;
                if (void 0 === i && (i = r.hasClass("panel-active")), void 0 === o && (o = r.hasClass("panel-left") ? "left" : "right"), void 0 === s && (s = r.hasClass("panel-cover") ? "cover" : "reveal"), e.panel[o]) throw new Error("Framework7: Can't create panel; app already has a " + o + " panel!");
                Utils.extend(e.panel, ((a = {})[o] = this, a));
                var l = $(".panel-backdrop");
                return 0 === l.length && (l = $('<div class="panel-backdrop"></div>')).insertBefore(r), Utils.extend(this, { app: e, side: o, effect: s, $el: r, el: r[0], opened: i, $backdropEl: l, backdropEl: l[0] }), this.useModules(), this.init(), this
            }
            return p && (e.__proto__ = p), ((e.prototype = Object.create(p && p.prototype)).constructor = e).prototype.init = function() {
                var e = this.app;
                e.params.panel[this.side + "Breakpoint"] && this.initBreakpoints(), (e.params.panel.swipe === this.side || "both" === e.params.panel.swipe || e.params.panel.swipe && e.params.panel.swipe !== this.side && e.params.panel.swipeCloseOpposite) && this.initSwipePanel()
            }, e.prototype.getViewEl = function() { var e = this.app; return 0 < e.root.children(".views").length ? e.root.children(".views")[0] : e.root.children(".view")[0] }, e.prototype.setBreakpoint = function() {
                var e, t, a = this,
                    n = a.app,
                    r = a.side,
                    i = a.$el,
                    o = $(a.getViewEl()),
                    s = n.params.panel[r + "Breakpoint"],
                    l = i.hasClass("panel-visible-by-breakpoint");
                n.width >= s ? l || ($("html").removeClass("with-panel-" + r + "-reveal with-panel-" + r + "-cover with-panel"), i.css("display", "").addClass("panel-visible-by-breakpoint").removeClass("panel-active"), a.onOpen(), a.onOpened(), o.css(((e = {})["margin-" + r] = i.width() + "px", e)), n.allowPanelOpen = !0, n.emit("local::breakpoint panelBreakpoint"), a.$el.trigger("panel:breakpoint", a)) : l && (i.css("display", "").removeClass("panel-visible-by-breakpoint panel-active"), a.onClose(), a.onClosed(), o.css(((t = {})["margin-" + r] = "", t)), n.emit("local::breakpoint panelBreakpoint"), a.$el.trigger("panel:breakpoint", a))
            }, e.prototype.initBreakpoints = function() {
                var e = this,
                    t = e.app;
                return e.resizeHandler = function() { e.setBreakpoint() }, t.params.panel[e.side + "Breakpoint"] && t.on("resize", e.resizeHandler), e.setBreakpoint(), e
            }, e.prototype.initSwipePanel = function() { swipePanel(this) }, e.prototype.destroy = function() {
                var e = this,
                    t = e.app;
                e.$el && (e.emit("local::beforeDestroy panelBeforeDestroy", e), e.$el.trigger("panel:beforedestroy", e), e.resizeHandler && t.off("resize", e.resizeHandler), e.$el.trigger("panel:destroy", e), e.emit("local::destroy panelDestroy"), delete t.panel[e.side], e.el && (e.el.f7Panel = null, delete e.el.f7Panel), Utils.deleteProps(e), e = null)
            }, e.prototype.open = function(e) {
                void 0 === e && (e = !0);
                var a = this,
                    t = a.app;
                if (!t.panel.allowOpen) return !1;
                var n = a.side,
                    r = a.effect,
                    i = a.$el,
                    o = a.$backdropEl,
                    s = a.opened,
                    l = i.parent(),
                    p = 0 < i.parents(document).length;
                if (!l.is(t.root)) {
                    var c = t.root.children(".panel, .views, .view").eq(0),
                        d = t.root.children(".statusbar").eq(0);
                    c.length ? i.insertBefore(c) : d.length ? i.insertAfter(c) : t.root.prepend(i), o && o.length && !o.parent().is(t.root) && 0 === o.nextAll(".panel").length && o.insertBefore(i), a.once("panelClosed", function() { p ? l.append(i) : i.remove() })
                }
                if (s || i.hasClass("panel-visible-by-breakpoint") || i.hasClass("panel-active")) return !1;
                t.panel.close("left" === n ? "right" : "left", e), t.panel.allowOpen = !1, i[e ? "removeClass" : "addClass"]("not-animated"), i.css({ display: "block" }).addClass("panel-active"), o[e ? "removeClass" : "addClass"]("not-animated"), o.show(), a._clientLeft = i[0].clientLeft, $("html").addClass("with-panel with-panel-" + n + "-" + r), a.onOpen();
                var u = "reveal" === r ? i.nextAll(".view, .views").eq(0) : i;
                return e ? function t() { u.transitionEnd(function(e) { $(e.target).is(u) ? (i.hasClass("panel-active") ? a.onOpened() : a.onClosed(), o.css({ display: "" })) : t() }) }() : (a.onOpened(), o.css({ display: "" })), !0
            }, e.prototype.close = function(e) {
                void 0 === e && (e = !0);
                var t = this,
                    a = t.app,
                    n = t.side,
                    r = t.effect,
                    i = t.$el,
                    o = t.$backdropEl;
                if (!t.opened || i.hasClass("panel-visible-by-breakpoint") || !i.hasClass("panel-active")) return !1;
                i[e ? "removeClass" : "addClass"]("not-animated"), i.removeClass("panel-active"), o[e ? "removeClass" : "addClass"]("not-animated");
                var s = "reveal" === r ? i.nextAll(".view, .views").eq(0) : i;
                return t.onClose(), a.panel.allowOpen = !1, e ? (s.transitionEnd(function() { i.hasClass("panel-active") || (i.css({ display: "" }), $("html").removeClass("with-panel-transitioning"), t.onClosed()) }), $("html").removeClass("with-panel with-panel-" + n + "-" + r).addClass("with-panel-transitioning")) : (i.css({ display: "" }), i.removeClass("not-animated"), $("html").removeClass("with-panel with-panel-transitioning with-panel-" + n + "-" + r), t.onClosed()), !0
            }, e.prototype.onOpen = function() { this.opened = !0, this.$el.trigger("panel:open", this), this.emit("local::open panelOpen", this) }, e.prototype.onOpened = function() { this.app.panel.allowOpen = !0, this.$el.trigger("panel:opened", this), this.emit("local::opened panelOpened", this) }, e.prototype.onClose = function() { this.opened = !1, this.$el.addClass("panel-closing"), this.$el.trigger("panel:close", this), this.emit("local::close panelClose", this) }, e.prototype.onClosed = function() { this.app.panel.allowOpen = !0, this.$el.removeClass("panel-closing"), this.$el.trigger("panel:closed", this), this.emit("local::closed panelClosed", this) }, e
        }(Framework7Class),
        Panel$1 = {
            name: "panel",
            params: { panel: { leftBreakpoint: 0, rightBreakpoint: 0, swipe: void 0, swipeActiveArea: 0, swipeCloseActiveAreaSide: 0, swipeCloseOpposite: !0, swipeOnlyClose: !1, swipeNoFollow: !1, swipeThreshold: 0, closeByBackdropClick: !0 } },
            static: { Panel: Panel },
            instance: { panel: { allowOpen: !0 } },
            create: function() {
                var r = this;
                Utils.extend(r.panel, {
                    disableSwipe: function(e) {
                        var t;
                        void 0 === e && (e = "both");
                        var a = [];
                        "string" == typeof e ? "both" === e ? (t = "both", a = [r.panel.left, r.panel.right]) : (t = e, a.push(r.panel[t])) : a = [e], a.forEach(function(e) { e && Utils.extend(e, { swipeable: !1 }) })
                    },
                    enableSwipe: function(e) { void 0 === e && (e = "both"); var t, a = []; "string" == typeof e ? (t = e, "left" === r.params.panel.swipe && "right" === t || "right" === r.params.panel.swipe && "left" === t || "both" === t ? (t = "both", r.params.panel.swipe = t, a = [r.panel.left, r.panel.right]) : (r.params.panel.swipe = t, a.push(r.panel[t]))) : e && a.push(e), a.length && a.forEach(function(e) { e && (e.swipeInitialized ? Utils.extend(e, { swipeable: !0 }) : e.initSwipePanel()) }) },
                    create: function(e) { return new Panel(r, e) },
                    open: function(e, t) {
                        var a = e;
                        if (!a) {
                            if (1 < $(".panel").length) return !1;
                            a = $(".panel").hasClass("panel-left") ? "left" : "right"
                        }
                        if (!a) return !1;
                        if (r.panel[a]) return r.panel[a].open(t);
                        var n = $(".panel-" + a);
                        return 0 < n.length && r.panel.create({ el: n }).open(t)
                    },
                    close: function(e, t) { var a, n; return n ? a = $(".panel-" + (n = e)) : n = (a = $(".panel.panel-active")).hasClass("panel-left") ? "left" : "right", !!n && (r.panel[n] ? r.panel[n].close(t) : 0 < a.length && r.panel.create({ el: a }).close(t)) },
                    get: function(e) {
                        var t = e;
                        if (!t) {
                            if (1 < $(".panel").length) return;
                            t = $(".panel").hasClass("panel-left") ? "left" : "right"
                        }
                        if (t) { if (r.panel[t]) return r.panel[t]; var a = $(".panel-" + t); return 0 < a.length ? r.panel.create({ el: a }) : void 0 }
                    }
                })
            },
            on: {
                init: function() {
                    var n = this;
                    $(".panel").each(function(e, t) {
                        var a = $(t).hasClass("panel-left") ? "left" : "right";
                        n.panel[a] = n.panel.create({ el: t, side: a })
                    })
                }
            },
            clicks: {
                ".panel-open": function(e, t) {
                    void 0 === t && (t = {});
                    var a = "left";
                    ("right" === t.panel || 1 === $(".panel").length && $(".panel").hasClass("panel-right")) && (a = "right"), this.panel.open(a, t.animate)
                },
                ".panel-close": function(e, t) {
                    void 0 === t && (t = {});
                    var a = t.panel;
                    this.panel.close(a, t.animate)
                },
                ".panel-backdrop": function() {
                    var e = $(".panel-active"),
                        t = e[0] && e[0].f7Panel;
                    e.trigger("panel:backdrop-click"), t && t.emit("backdropClick", t), this.emit("panelBackdropClick", t || e[0]), this.params.panel.closeByBackdropClick && this.panel.close()
                }
            }
        },
        Card = { name: "card" },
        Chip = { name: "chip" },
        FormData$1 = {
            store: function(e, t) {
                var a = e,
                    n = $(e);
                n.length && n.is("form") && n.attr("id") && (a = n.attr("id")), this.form.data["form-" + a] = t;
                try { win.localStorage["f7form-" + a] = JSON.stringify(t) } catch (e) { throw e }
            },
            get: function(e) {
                var t = e,
                    a = $(e);
                a.length && a.is("form") && a.attr("id") && (t = a.attr("id"));
                try { if (win.localStorage["f7form-" + t]) return JSON.parse(win.localStorage["f7form-" + t]) } catch (e) { throw e }
                if (this.form.data["form-" + t]) return this.form.data["form-" + t]
            },
            remove: function(e) {
                var t = e,
                    a = $(e);
                a.length && a.is("form") && a.attr("id") && (t = a.attr("id")), this.form.data["form-" + t] && (this.form.data["form-" + t] = "", delete this.form.data["form-" + t]);
                try { win.localStorage["f7form-" + t] && (win.localStorage["f7form-" + t] = "", win.localStorage.removeItem("f7form-" + t)) } catch (e) { throw e }
            }
        },
        FormStorage = {
            init: function(e) {
                var t = this,
                    a = $(e),
                    n = a.attr("id");
                if (n) {
                    var r = t.form.getFormData(n);
                    r && t.form.fillFromData(a, r), a.on("change submit", function() {
                        var e = t.form.convertToData(a);
                        e && (t.form.storeFormData(n, e), a.trigger("form:storedata", e), t.emit("formStoreData", a[0], e))
                    })
                }
            },
            destroy: function(e) { $(e).off("change submit") }
        };

    function formToData(e) {
        var o = $(e).eq(0);
        if (0 !== o.length) {
            var s = {},
                l = ["submit", "image", "button", "file"],
                p = [];
            return o.find("input, select, textarea").each(function(e, t) {
                var a = $(t);
                if (!a.hasClass("ignore-store-data") && !a.hasClass("no-store-data")) {
                    var n = a.attr("name"),
                        r = a.attr("type"),
                        i = t.nodeName.toLowerCase();
                    if (!(0 <= l.indexOf(r)) && !(0 <= p.indexOf(n)) && n)
                        if ("select" === i && a.prop("multiple")) p.push(n), s[n] = [], o.find('select[name="' + n + '"] option').each(function(e, t) { t.selected && s[n].push(t.value) });
                        else switch (r) {
                            case "checkbox":
                                p.push(n), s[n] = [], o.find('input[name="' + n + '"]').each(function(e, t) { t.checked && s[n].push(t.value) });
                                break;
                            case "radio":
                                p.push(n), o.find('input[name="' + n + '"]').each(function(e, t) { t.checked && (s[n] = t.value) });
                                break;
                            default:
                                s[n] = a.val()
                        }
                }
            }), o.trigger("form:todata", s), this.emit("formToData", o[0], s), s
        }
    }

    function formFromData(e, t) {
        var o = $(e).eq(0);
        if (o.length) {
            var s = t,
                a = o.attr("id");
            if (!s && a && (s = this.form.getFormData(a)), s) {
                var l = ["submit", "image", "button", "file"],
                    p = [];
                o.find("input, select, textarea").each(function(e, t) {
                    var a = $(t);
                    if (!a.hasClass("ignore-store-data") && !a.hasClass("no-store-data")) {
                        var n = a.attr("name"),
                            r = a.attr("type"),
                            i = t.nodeName.toLowerCase();
                        if (void 0 !== s[n] && null !== s[n] && !(0 <= l.indexOf(r)) && !(0 <= p.indexOf(n)) && n) {
                            if ("select" === i && a.prop("multiple")) p.push(n), o.find('select[name="' + n + '"] option').each(function(e, t) {
                                var a = t;
                                0 <= s[n].indexOf(t.value) ? a.selected = !0 : a.selected = !1
                            });
                            else switch (r) {
                                case "checkbox":
                                    p.push(n), o.find('input[name="' + n + '"]').each(function(e, t) {
                                        var a = t;
                                        0 <= s[n].indexOf(t.value) ? a.checked = !0 : a.checked = !1
                                    });
                                    break;
                                case "radio":
                                    p.push(n), o.find('input[name="' + n + '"]').each(function(e, t) {
                                        var a = t;
                                        s[n] === t.value ? a.checked = !0 : a.checked = !1
                                    });
                                    break;
                                default:
                                    a.val(s[n])
                            }
                            "select" !== i && "input" !== i && "textarea" !== i || a.trigger("change", "fromdata")
                        }
                    }
                }), o.trigger("form:fromdata", s), this.emit("formFromData", o[0], s)
            }
        }
    }

    function initAjaxForm() {
        var s = this;
        $(doc).on("submit change", "form.form-ajax-submit, form.form-ajax-submit-onchange", function(e, t) {
            var n = $(this);
            if (("change" !== e.type || n.hasClass("form-ajax-submit-onchange")) && ("submit" === e.type && e.preventDefault(), "change" !== e.type || "fromdata" !== t)) {
                var r, a = (n.attr("method") || "GET").toUpperCase(),
                    i = n.prop("enctype") || n.attr("enctype"),
                    o = n.attr("action");
                o && (r = "POST" === a ? "application/x-www-form-urlencoded" === i ? s.form.convertToData(n[0]) : new win.FormData(n[0]) : Utils.serializeObject(s.form.convertToData(n[0])), s.request({ method: a, url: o, contentType: i, data: r, beforeSend: function(e) { n.trigger("formajax:beforesend", r, e), s.emit("formAjaxBeforeSend", n[0], r, e) }, error: function(e) { n.trigger("formajax:error", r, e), s.emit("formAjaxError", n[0], r, e) }, complete: function(e) { n.trigger("formajax:complete", r, e), s.emit("formAjaxComplete", n[0], r, e) }, success: function(e, t, a) { n.trigger("formajax:success", r, a), s.emit("formAjaxSuccess", n[0], r, a) } }))
            }
        })
    }
    var Form = {
            name: "form",
            create: function() { Utils.extend(this, { form: { data: {}, storeFormData: FormData$1.store.bind(this), getFormData: FormData$1.get.bind(this), removeFormData: FormData$1.remove.bind(this), convertToData: formToData.bind(this), fillFromData: formFromData.bind(this), storage: { init: FormStorage.init.bind(this), destroy: FormStorage.destroy.bind(this) } } }) },
            on: {
                init: function() { initAjaxForm.call(this) },
                tabBeforeRemove: function(e) {
                    var a = this;
                    $(e).find(".form-store-data").each(function(e, t) { a.form.storage.destroy(t) })
                },
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".form-store-data").each(function(e, t) { a.form.storage.init(t) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".form-store-data").each(function(e, t) { a.form.storage.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".form-store-data").each(function(e, t) { a.form.storage.init(t) })
                }
            }
        },
        Input = {
            ignoreTypes: ["checkbox", "button", "submit", "range", "radio", "image"],
            createTextareaResizableShadow: function() {
                var e = $(doc.createElement("textarea"));
                e.addClass("textarea-resizable-shadow"), e.prop({ disabled: !0, readonly: !0 }), Input.textareaResizableShadow = e
            },
            textareaResizableShadow: void 0,
            resizeTextarea: function(e) {
                var t = $(e);
                Input.textareaResizableShadow || Input.createTextareaResizableShadow();
                var a = Input.textareaResizableShadow;
                if (t.length && t.hasClass("resizable")) {
                    0 === Input.textareaResizableShadow.parents().length && this.root.append(a);
                    var n = win.getComputedStyle(t[0]);
                    "padding-top padding-bottom padding-left padding-right margin-left margin-right margin-top margin-bottom width font-size font-family font-style font-weight line-height font-variant text-transform letter-spacing border box-sizing display".split(" ").forEach(function(e) {
                        var t = n[e];
                        0 <= "font-size line-height letter-spacing width".split(" ").indexOf(e) && (t = t.replace(",", ".")), a.css(e, t)
                    });
                    var r = t[0].clientHeight;
                    a.val("");
                    var i = a[0].scrollHeight;
                    a.val(t.val()), a.css("height", 0);
                    var o = a[0].scrollHeight;
                    r !== o && (i < o ? (t.css("height", o + "px"), t.trigger("textarea:resize", { initialHeight: i, currentHeight: r, scrollHeight: o })) : o < r && (t.css("height", ""), t.trigger("textarea:resize", { initialHeight: i, currentHeight: r, scrollHeight: o })))
                }
            },
            validate: function(e) {
                var t = $(e);
                if (t.length) {
                    var a = t.parents(".item-input"),
                        n = t.parents(".input"),
                        r = t[0].validity,
                        i = t.dataset().errorMessage || t[0].validationMessage || "";
                    if (r)
                        if (r.valid) a.removeClass("item-input-invalid item-input-with-error-message"), n.removeClass("input-invalid input-with-error-message"), t.removeClass("input-invalid");
                        else {
                            var o = t.nextAll(".item-input-error-message, .input-error-message");
                            i && (0 === o.length && (o = $('<div class="' + (n.length ? "input-error-message" : "item-input-error-message") + '"></div>')).insertAfter(t), o.text(i)), 0 < o.length && (a.addClass("item-input-with-error-message"), n.addClass("input-with-eror-message")), a.addClass("item-input-invalid"), n.addClass("input-invalid"), t.addClass("input-invalid")
                        }
                }
            },
            validateInputs: function(e) {
                var a = this;
                $(e).find("input, textarea, select").each(function(e, t) { a.input.validate(t) })
            },
            focus: function(e) {
                var t = $(e),
                    a = t.attr("type");
                0 <= Input.ignoreTypes.indexOf(a) || (t.parents(".item-input").addClass("item-input-focused"), t.parents(".input").addClass("input-focused"), t.addClass("input-focused"))
            },
            blur: function(e) {
                var t = $(e);
                t.parents(".item-input").removeClass("item-input-focused"), t.parents(".input").removeClass("input-focused"), t.removeClass("input-focused")
            },
            checkEmptyState: function(e) {
                var t = $(e);
                if (t.is("input, select, textarea") || (t = t.find("input, select, textarea").eq(0)), t.length) {
                    var a = t.val(),
                        n = t.parents(".item-input"),
                        r = t.parents(".input");
                    a && "string" == typeof a && "" !== a.trim() || Array.isArray(a) && 0 < a.length ? (n.addClass("item-input-with-value"), r.addClass("input-with-value"), t.addClass("input-with-value"), t.trigger("input:notempty")) : (n.removeClass("item-input-with-value"), r.removeClass("input-with-value"), t.removeClass("input-with-value"), t.trigger("input:empty"))
                }
            },
            scrollIntoView: function(e, t, a, n) {
                void 0 === t && (t = 0);
                var r = $(e),
                    i = r.parents(".page-content, .panel").eq(0);
                if (!i.length) return !1;
                var o = i[0].offsetHeight,
                    s = i[0].scrollTop,
                    l = parseInt(i.css("padding-top"), 10),
                    p = parseInt(i.css("padding-bottom"), 10),
                    c = i.offset().top - s,
                    d = r.offset().top - c,
                    u = d + s - l,
                    h = d + s - o + p + r[0].offsetHeight,
                    f = u + (h - u) / 2;
                return u < s ? (i.scrollTop(a ? f : u, t), !0) : s < h ? (i.scrollTop(a ? f : h, t), !0) : (n && i.scrollTop(a ? f : h, t), !1)
            },
            init: function() {
                var n = this;
                Input.createTextareaResizableShadow(), $(doc).on("click", ".input-clear-button", function() {
                    var e = $(this).siblings("input, textarea").eq(0),
                        t = e.val();
                    e.val("").trigger("input change").focus().trigger("input:clear", t)
                }), $(doc).on("change input", "input, textarea, select", function() {
                    var e = $(this),
                        t = e.attr("type"),
                        a = e[0].nodeName.toLowerCase();
                    0 <= Input.ignoreTypes.indexOf(t) || (n.input.checkEmptyState(e), (e.dataset().validate || null !== e.attr("validate")) && n.input.validate(e), "textarea" === a && e.hasClass("resizable") && n.input.resizeTextarea(e))
                }, !0), $(doc).on("focus", "input, textarea, select", function() {
                    var e = this;
                    n.params.input.scrollIntoViewOnFocus && (Device.android ? $(win).once("resize", function() { doc && doc.activeElement === e && n.input.scrollIntoView(e, n.params.input.scrollIntoViewDuration, n.params.input.scrollIntoViewCentered, n.params.input.scrollIntoViewAlways) }) : n.input.scrollIntoView(e, n.params.input.scrollIntoViewDuration, n.params.input.scrollIntoViewCentered, n.params.input.scrollIntoViewAlways)), n.input.focus(e)
                }, !0), $(doc).on("blur", "input, textarea, select", function() {
                    var e = $(this),
                        t = e[0].nodeName.toLowerCase();
                    n.input.blur(e), (e.dataset().validate || null !== e.attr("validate")) && n.input.validate(e), "textarea" === t && e.hasClass("resizable") && Input.textareaResizableShadow && Input.textareaResizableShadow.remove()
                }, !0), $(doc).on("invalid", "input, textarea, select", function(e) {
                    var t = $(this);
                    (t.dataset().validate || null !== t.attr("validate")) && (e.preventDefault(), n.input.validate(t))
                }, !0)
            }
        },
        Input$1 = {
            name: "input",
            params: { input: { scrollIntoViewOnFocus: Device.android, scrollIntoViewCentered: !1, scrollIntoViewDuration: 0, scrollIntoViewAlways: !1 } },
            create: function() { Utils.extend(this, { input: { scrollIntoView: Input.scrollIntoView.bind(this), focus: Input.focus.bind(this), blur: Input.blur.bind(this), validate: Input.validate.bind(this), validateInputs: Input.validateInputs.bind(this), checkEmptyState: Input.checkEmptyState.bind(this), resizeTextarea: Input.resizeTextarea.bind(this), init: Input.init.bind(this) } }) },
            on: {
                init: function() { this.input.init() },
                tabMounted: function(e) {
                    var n = this,
                        t = $(e);
                    t.find(".item-input, .input").each(function(e, t) {
                        $(t).find("input, select, textarea").each(function(e, t) {
                            var a = $(t);
                            0 <= Input.ignoreTypes.indexOf(a.attr("type")) || n.input.checkEmptyState(a)
                        })
                    }), t.find("textarea.resizable").each(function(e, t) { n.input.resizeTextarea(t) })
                },
                pageInit: function(e) {
                    var n = this,
                        t = e.$el;
                    t.find(".item-input, .input").each(function(e, t) {
                        $(t).find("input, select, textarea").each(function(e, t) {
                            var a = $(t);
                            0 <= Input.ignoreTypes.indexOf(a.attr("type")) || n.input.checkEmptyState(a)
                        })
                    }), t.find("textarea.resizable").each(function(e, t) { n.input.resizeTextarea(t) })
                }
            }
        },
        Checkbox = { name: "checkbox" },
        Radio = { name: "radio" },
        Toggle = function(b) {
            function e(i, e) {
                void 0 === e && (e = {}), b.call(this, e, [i]);
                var o = this,
                    t = {};
                o.useModulesParams(t), o.params = Utils.extend(t, e);
                var a = o.params.el;
                if (!a) return o;
                var n = $(a);
                if (0 === n.length) return o;
                if (n[0].f7Toggle) return n[0].f7Toggle;
                var s, r = n.children('input[type="checkbox"]');
                Utils.extend(o, { app: i, $el: n, el: n[0], $inputEl: r, inputEl: r[0], disabled: n.hasClass("disabled") || r.hasClass("disabled") || r.attr("disabled") || r[0].disabled }), Object.defineProperty(o, "checked", { enumerable: !0, configurable: !0, set: function(e) { o && void 0 !== o.$inputEl && o.checked !== e && (r[0].checked = e, o.$inputEl.trigger("change")) }, get: function() { return r[0].checked } }), n[0].f7Toggle = o;
                var l, p, c, d, u, h = {};

                function f(e) { s || o.disabled || (h.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, h.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, s = !(p = 0), l = void 0, d = Utils.now(), u = o.checked, c = n[0].offsetWidth, Utils.nextTick(function() { s && n.addClass("toggle-active-state") })) }

                function m(e) {
                    if (s && !o.disabled) {
                        var t, a = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            n = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY,
                            r = i.rtl ? -1 : 1;
                        if (void 0 === l && (l = !!(l || Math.abs(n - h.y) > Math.abs(a - h.x))), l) s = !1;
                        else e.preventDefault(), (p = a - h.x) * r < 0 && Math.abs(p) > c / 3 && u && (t = !0), 0 < p * r && Math.abs(p) > c / 3 && !u && (t = !0), t && (h.x = a, o.checked = !u, u = !u)
                    }
                }

                function v() {
                    if (!s || o.disabled) return l && n.removeClass("toggle-active-state"), void(s = !1);
                    var e, t = i.rtl ? -1 : 1;
                    s = !1, n.removeClass("toggle-active-state"), Utils.now() - d < 300 && (p * t < 0 && u && (e = !0), 0 < p * t && !u && (e = !0), e && (o.checked = !u))
                }

                function g() { o.$el.trigger("toggle:change", o), o.emit("local::change toggleChange", o) }
                o.attachEvents = function() {
                    if (Support.touch) {
                        var e = !!Support.passiveListener && { passive: !0 };
                        n.on(i.touchEvents.start, f, e), i.on("touchmove", m), i.on("touchend:passive", v)
                    }
                    o.$inputEl.on("change", g)
                }, o.detachEvents = function() {
                    if (Support.touch) {
                        var e = !!Support.passiveListener && { passive: !0 };
                        n.off(i.touchEvents.start, f, e), i.off("touchmove", m), i.off("touchend:passive", v)
                    }
                    o.$inputEl.off("change", g)
                }, o.useModules(), o.init()
            }
            return b && (e.__proto__ = b), ((e.prototype = Object.create(b && b.prototype)).constructor = e).prototype.toggle = function() { this.checked = !this.checked }, e.prototype.init = function() { this.attachEvents() }, e.prototype.destroy = function() {
                var e = this;
                e.$el.trigger("toggle:beforedestroy", e), e.emit("local::beforeDestroy toggleBeforeDestroy", e), delete e.$el[0].f7Toggle, e.detachEvents(), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        Toggle$1 = {
            name: "toggle",
            create: function() { this.toggle = ConstructorMethods({ defaultSelector: ".toggle", constructor: Toggle, app: this, domProp: "f7Toggle" }) },
            static: { Toggle: Toggle },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".toggle-init").each(function(e, t) { return a.toggle.create({ el: t }) })
                },
                tabBeforeRemove: function(e) { $(e).find(".toggle-init").each(function(e, t) { t.f7Toggle && t.f7Toggle.destroy() }) },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".toggle-init").each(function(e, t) { return a.toggle.create({ el: t }) })
                },
                pageBeforeRemove: function(e) { e.$el.find(".toggle-init").each(function(e, t) { t.f7Toggle && t.f7Toggle.destroy() }) }
            },
            vnode: {
                "toggle-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.toggle.create({ el: t })
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Toggle && t.f7Toggle.destroy()
                    }
                }
            }
        },
        Range = function(A) {
            function e(t, a) {
                A.call(this, a, [t]);
                var o = this,
                    e = { el: null, inputEl: null, dual: !1, step: 1, label: !1, min: 0, max: 100, value: 0, draggableBar: !0 };
                o.useModulesParams(e), o.params = Utils.extend(e, a);
                var n = o.params.el;
                if (!n) return o;
                var r = $(n);
                if (0 === r.length) return o;
                if (r[0].f7Range) return r[0].f7Range;
                var i, s = r.dataset();
                "step min max value".split(" ").forEach(function(e) { void 0 === a[e] && void 0 !== s[e] && (o.params[e] = parseFloat(s[e])) }), "dual label".split(" ").forEach(function(e) { void 0 === a[e] && void 0 !== s[e] && (o.params[e] = s[e]) }), o.params.value || (void 0 !== s.value && (o.params.value = s.value), void 0 !== s.valueLeft && void 0 !== s.valueRight && (o.params.value = [parseFloat(s.valueLeft), parseFloat(s.valueRight)])), o.params.dual || (o.params.inputEl ? i = $(o.params.inputEl) : r.find('input[type="range"]').length && (i = r.find('input[type="range"]').eq(0)));
                var l = o.params,
                    p = l.dual,
                    c = l.step,
                    d = l.label,
                    u = l.min,
                    h = l.max,
                    f = l.value;
                Utils.extend(o, { $el: r, el: r[0], $inputEl: i, inputEl: i ? i[0] : void 0, dual: p, step: c, label: d, min: u, max: h, value: f, previousValue: f }), i && ("step min max".split(" ").forEach(function(e) {!a[e] && i.attr(e) && (o.params[e] = parseFloat(i.attr(e)), o[e] = parseFloat(i.attr(e))) }), void 0 !== i.val() && (o.params.value = parseFloat(i.val()), o.value = parseFloat(i.val()))), o.dual && r.addClass("range-slider-dual"), o.label && r.addClass("range-slider-label");
                var m = $('<div class="range-bar"></div>'),
                    v = $('<div class="range-bar-active"></div>');
                m.append(v);
                var g, b = '\n      <div class="range-knob-wrap">\n        <div class="range-knob"></div>\n        ' + (o.label ? '<div class="range-knob-label"></div>' : "") + "\n      </div>\n    ",
                    y = [$(b)],
                    w = [];
                o.dual && y.push($(b)), r.append(m), y.forEach(function(e) { r.append(e) }), o.label && (w.push(y[0].find(".range-knob-label")), o.dual && w.push(y[1].find(".range-knob-label"))), Utils.extend(o, { app: t, knobs: y, labels: w, $barEl: m, $barActiveEl: v }), r[0].f7Range = o;
                var C, x, E, k, S, T = {};

                function M() { S = !0 }

                function P(e) {
                    if (!g && (o.params.draggableBar || 0 !== $(e.target).closest(".range-knob").length)) {
                        var t;
                        S = !1, T.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, T.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, g = !0, C = void 0, x = r.offset().left;
                        var a = (t = o.app.rtl ? (x + o.rangeWidth - T.x) / o.rangeWidth : (T.x - x) / o.rangeWidth) * (o.max - o.min) + o.min;
                        a = o.dual ? Math.abs(o.value[0] - a) < Math.abs(o.value[1] - a) ? (k = 0, E = o.knobs[0], [a, o.value[1]]) : (k = 1, E = o.knobs[1], [o.value[0], a]) : (E = o.knobs[0], t * (o.max - o.min) + o.min), Utils.nextTick(function() { g && E.addClass("range-knob-active-state") }, 70), o.on("change", M), o.setValue(a, !0)
                    }
                }

                function O(e) {
                    if (g) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (void 0 === C && (C = !!(C || Math.abs(a - T.y) > Math.abs(t - T.x))), C) g = !1;
                        else {
                            e.preventDefault();
                            var n, r, i = (o.app.rtl ? (x + o.rangeWidth - t) / o.rangeWidth : (t - x) / o.rangeWidth) * (o.max - o.min) + o.min;
                            if (o.dual) 0 === k ? (n = i, (r = o.value[1]) < n && (r = n)) : (r = i) < (n = o.value[0]) && (n = r), i = [n, r];
                            o.setValue(i, !0)
                        }
                    }
                }

                function D() {
                    if (!g) return C && E.removeClass("range-knob-active-state"), void(g = !1);
                    o.off("change", M), g = !1, E.removeClass("range-knob-active-state"), S && o.$inputEl && !o.dual && o.$inputEl.trigger("change"), S = !1, void 0 !== o.previousValue && (o.dual && (o.previousValue[0] !== o.value[0] || o.previousValue[1] !== o.value[1]) || !o.dual && o.previousValue !== o.value) && (o.$el.trigger("range:changed", o, o.value), o.emit("local::changed rangeChanged", o, o.value))
                }

                function I() { o.calcSize(), o.layout() }
                return o.attachEvents = function() {
                    var e = !!Support.passiveListener && { passive: !0 };
                    o.$el.on(t.touchEvents.start, P, e), t.on("touchmove", O), t.on("touchend:passive", D), t.on("tabShow", I), t.on("resize", I), o.$el.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").on("modal:open", I), o.$el.parents(".panel").on("panel:open", I)
                }, o.detachEvents = function() {
                    var e = !!Support.passiveListener && { passive: !0 };
                    o.$el.off(t.touchEvents.start, P, e), t.off("touchmove", O), t.off("touchend:passive", D), t.off("tabShow", I), t.off("resize", I), o.$el.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").off("modal:open", I), o.$el.parents(".panel").off("panel:open", I)
                }, o.useModules(), o.init(), o
            }
            return A && (e.__proto__ = A), ((e.prototype = Object.create(A && A.prototype)).constructor = e).prototype.calcSize = function() {
                var e = this.$el.outerWidth();
                0 !== e && (this.rangeWidth = e, this.knobWidth = this.knobs[0].outerWidth())
            }, e.prototype.layout = function() {
                var e, t = this,
                    a = t.app,
                    r = t.knobWidth,
                    i = t.rangeWidth,
                    n = t.min,
                    o = t.max,
                    s = t.knobs,
                    l = t.$barActiveEl,
                    p = t.value,
                    c = t.label,
                    d = t.labels,
                    u = a.rtl ? "right" : "left";
                if (t.dual) {
                    var h = [(p[0] - n) / (o - n), (p[1] - n) / (o - n)];
                    l.css(((e = {})[u] = 100 * h[0] + "%", e.width = 100 * (h[1] - h[0]) + "%", e)), s.forEach(function(e, t) {
                        var a = i * h[t],
                            n = i * h[t] - r / 2;
                        n < 0 && (a = r / 2), i < n + r && (a = i - r / 2), e.css(u, a + "px"), c && d[t].text(p[t])
                    })
                } else {
                    var f = (p - n) / (o - n);
                    l.css("width", 100 * f + "%");
                    var m = i * f,
                        v = i * f - r / 2;
                    v < 0 && (m = r / 2), i < v + r && (m = i - r / 2), s[0].css(u, m + "px"), c && d[0].text(p)
                }
                t.dual && 0 <= p.indexOf(n) || !t.dual && p === n ? t.$el.addClass("range-slider-min") : t.$el.removeClass("range-slider-min"), t.dual && 0 <= p.indexOf(o) || !t.dual && p === o ? t.$el.addClass("range-slider-max") : t.$el.removeClass("range-slider-max")
            }, e.prototype.setValue = function(e, t) {
                var a, n, r = this,
                    i = r.step,
                    o = r.min,
                    s = r.max;
                if (r.dual) {
                    n = [r.value[0], r.value[1]];
                    var l = e;
                    if (Array.isArray(l) || (l = [e, e]), e[0] > e[1] && (l = [l[0], l[0]]), (l = l.map(function(e) { return Math.max(Math.min(Math.round(e / i) * i, s), o) }))[0] === r.value[0] && l[1] === r.value[1]) return r;
                    l.forEach(function(e, t) { r.value[t] = e }), a = n[0] !== l[0] || n[1] !== l[1], r.layout()
                } else {
                    n = r.value;
                    var p = Math.max(Math.min(Math.round(e / i) * i, s), o);
                    r.value = p, r.layout(), a = n !== p
                }
                return a && (r.previousValue = n), a && (r.$el.trigger("range:change", r, r.value), r.$inputEl && !r.dual && (r.$inputEl.val(r.value), t ? r.$inputEl.trigger("input") : r.$inputEl.trigger("input change")), t || (r.$el.trigger("range:changed", r, r.value), r.emit("local::changed rangeChanged", r, r.value)), r.emit("local::change rangeChange", r, r.value)), r
            }, e.prototype.getValue = function() { return this.value }, e.prototype.init = function() { return this.calcSize(), this.layout(), this.attachEvents(), this }, e.prototype.destroy = function() {
                var e = this;
                e.$el.trigger("range:beforedestroy", e), e.emit("local::beforeDestroy rangeBeforeDestroy", e), delete e.$el[0].f7Range, e.detachEvents(), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        Range$1 = {
            name: "range",
            create: function() {
                var n = this;
                n.range = Utils.extend(ConstructorMethods({ defaultSelector: ".range-slider", constructor: Range, app: n, domProp: "f7Range" }), { getValue: function(e) { void 0 === e && (e = ".range-slider"); var t = n.range.get(e); if (t) return t.getValue() }, setValue: function(e, t) { void 0 === e && (e = ".range-slider"); var a = n.range.get(e); if (a) return a.setValue(t) } })
            },
            static: { Range: Range },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".range-slider-init").each(function(e, t) { return new Range(a, { el: t }) })
                },
                tabBeforeRemove: function(e) { $(e).find(".range-slider-init").each(function(e, t) { t.f7Range && t.f7Range.destroy() }) },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".range-slider-init").each(function(e, t) { return new Range(a, { el: t }) })
                },
                pageBeforeRemove: function(e) { e.$el.find(".range-slider-init").each(function(e, t) { t.f7Range && t.f7Range.destroy() }) }
            },
            vnode: {
                "range-slider-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.range.create({ el: t })
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Range && t.f7Range.destroy()
                    }
                }
            }
        },
        Stepper = function(z) {
            function e(e, t) {
                z.call(this, t, [e]);
                var a = this,
                    n = { el: null, inputEl: null, valueEl: null, value: 0, formatValue: null, step: 1, min: 0, max: 100, watchInput: !0, autorepeat: !1, autorepeatDynamic: !1, wraps: !1, manualInputMode: !1, decimalPoint: 4, buttonsEndInputMode: !0 };
                a.useModulesParams(n), a.params = Utils.extend(n, t), a.params.value < a.params.min && (a.params.value = a.params.min), a.params.value > a.params.max && (a.params.value = a.params.max);
                var r = a.params.el;
                if (!r) return a;
                var i, o, s = $(r);
                if (0 === s.length) return a;
                if (s[0].f7Stepper) return s[0].f7Stepper;
                if (a.params.inputEl ? i = $(a.params.inputEl) : s.find(".stepper-input-wrap").find("input, textarea").length && (i = s.find(".stepper-input-wrap").find("input, textarea").eq(0)), i && i.length) {
                    "step min max".split(" ").forEach(function(e) {!t[e] && i.attr(e) && (a.params[e] = parseFloat(i.attr(e))) });
                    var l = parseInt(a.params.decimalPoint, 10);
                    Number.isNaN(l) ? a.params.decimalPoint = 0 : a.params.decimalPoint = l;
                    var p = parseFloat(i.val());
                    void 0 !== t.value || Number.isNaN(p) || !p && 0 !== p || (a.params.value = p)
                }
                a.params.valueEl ? o = $(a.params.valueEl) : s.find(".stepper-value").length && (o = s.find(".stepper-value").eq(0));
                var c = s.find(".stepper-button-plus"),
                    d = s.find(".stepper-button-minus"),
                    u = a.params,
                    h = u.step,
                    f = u.min,
                    m = u.max,
                    v = u.value,
                    g = u.decimalPoint;
                Utils.extend(a, { app: e, $el: s, el: s[0], $buttonPlusEl: c, buttonPlusEl: c[0], $buttonMinusEl: d, buttonMinusEl: d[0], $inputEl: i, inputEl: i ? i[0] : void 0, $valueEl: o, valueEl: o ? o[0] : void 0, step: h, min: f, max: m, value: v, decimalPoint: g, typeModeChanged: !1 }), s[0].f7Stepper = a;
                var b, y, w, C, x, E = {},
                    k = null,
                    S = !1,
                    T = !1;

                function M(e) { b || (T || ($(e.target).closest(c).length ? k = "increment" : $(e.target).closest(d).length && (k = "decrement"), k && (E.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, E.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, b = !0, y = void 0, function e(t, a, n, r, i, o) { clearTimeout(x), x = setTimeout(function() { 1 === t && (S = w = !0), clearInterval(C), o(), C = setInterval(function() { o() }, i), t < a && e(t + 1, a, n, r, i / 2, o) }, 1 === t ? n : r) }(1, a.params.autorepeatDynamic ? 4 : 1, 500, 1e3, 300, function() { a[k]() })))) }

                function P(e) {
                    if (b && !T) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        void 0 !== y || S || (y = !!(y || Math.abs(a - E.y) > Math.abs(t - E.x)));
                        var n = Math.pow(Math.pow(t - E.x, 2) + Math.pow(a - E.y, 2), .5);
                        (y || 20 < n) && (b = !1, clearTimeout(x), clearInterval(C))
                    }
                }

                function O() { clearTimeout(x), clearInterval(C), k = null, b = S = !1 }

                function D() { T ? a.params.buttonsEndInputMode && (T = !1, a.endTypeMode(!0)) : w ? w = !1 : a.decrement(!0) }

                function I() { T ? a.params.buttonsEndInputMode && (T = !1, a.endTypeMode(!0)) : w ? w = !1 : a.increment(!0) }

                function A(e) {!e.target.readOnly && a.params.manualInputMode && (T = !0, "number" == typeof e.target.selectionStart && (e.target.selectionStart = e.target.value.length, e.target.selectionEnd = e.target.value.length)) }

                function B(e) { 13 !== e.keyCode && 13 !== e.which || (e.preventDefault(), T = !1, a.endTypeMode()) }

                function L() { T = !1, a.endTypeMode(!0) }

                function R(e) { T ? a.typeValue(e.target.value) : e.detail && e.detail.sentByF7Stepper || a.setValue(e.target.value, !0) }
                return a.attachEvents = function() { d.on("click", D), c.on("click", I), a.params.watchInput && i && i.length && (i.on("input", R), i.on("click", A), i.on("blur", L), i.on("keyup", B)), a.params.autorepeat && (e.on("touchstart:passive", M), e.on("touchmove:active", P), e.on("touchend:passive", O)) }, a.detachEvents = function() { d.off("click", D), c.off("click", I), a.params.watchInput && i && i.length && (i.off("input", R), i.off("click", A), i.off("blur", L), i.off("keyup", B)) }, a.useModules(), a.init(), a
            }
            return z && (e.__proto__ = z), ((e.prototype = Object.create(z && z.prototype)).constructor = e).prototype.minus = function() { return this.decrement() }, e.prototype.plus = function() { return this.increment() }, e.prototype.decrement = function() { return this.setValue(this.value - this.step, !1, !0) }, e.prototype.increment = function() { return this.setValue(this.value + this.step, !1, !0) }, e.prototype.setValue = function(e, t, a) {
                var n = this,
                    r = n.step,
                    i = n.min,
                    o = n.max,
                    s = n.value,
                    l = Math.round(e / r) * r;
                if (n.params.wraps && a ? (o < l && (l = i), l < i && (l = o)) : l = Math.max(Math.min(l, o), i), Number.isNaN(l) && (l = s), !(s !== (n.value = l)) && !t) return n;
                n.$el.trigger("stepper:change", n, n.value);
                var p = n.formatValue(n.value);
                return n.$inputEl && n.$inputEl.length && (n.$inputEl.val(p), n.$inputEl.trigger("input change", { sentByF7Stepper: !0 })), n.$valueEl && n.$valueEl.length && n.$valueEl.html(p), n.emit("local::change stepperChange", n, n.value), n
            }, e.prototype.endTypeMode = function(e) {
                var t = this,
                    a = t.min,
                    n = t.max,
                    r = parseFloat(t.value);
                if (Number.isNaN(r) && (r = 0), r = Math.max(Math.min(r, n), a), t.value = r, !t.typeModeChanged) return t.$inputEl && t.$inputEl.length && !e && t.$inputEl.blur(), t;
                t.typeModeChanged = !1, t.$el.trigger("stepper:change", t, t.value);
                var i = t.formatValue(t.value);
                return t.$inputEl && t.$inputEl.length && (t.$inputEl.val(i), t.$inputEl.trigger("input change", { sentByF7Stepper: !0 }), e || t.$inputEl.blur()), t.$valueEl && t.$valueEl.length && t.$valueEl.html(i), t.emit("local::change stepperChange", t, t.value), t
            }, e.prototype.typeValue = function(e) {
                var t = this;
                t.typeModeChanged = !0;
                var a = String(e);
                if (a.lastIndexOf(".") + 1 === a.length || a.lastIndexOf(",") + 1 === a.length) return a.lastIndexOf(".") !== a.indexOf(".") || a.lastIndexOf(",") !== a.indexOf(",") ? (a = a.slice(0, -1), t.value = a, t.$inputEl.val(t.value)) : (t.value = a, t.$inputEl.val(a)), t;
                var n = parseFloat(a.replace(",", "."));
                if (0 === n) return t.value = a.replace(",", "."), t.$inputEl.val(t.value), t;
                if (Number.isNaN(n)) return t.value = 0, t.$inputEl.val(t.value), t;
                var r = Math.pow(10, t.params.decimalPoint);
                return n = Math.round(n * r).toFixed(t.params.decimalPoint + 1) / r, t.value = parseFloat(String(n).replace(",", ".")), t.$inputEl.val(t.value), t
            }, e.prototype.getValue = function() { return this.value }, e.prototype.formatValue = function(e) { return this.params.formatValue ? this.params.formatValue.call(this, e) : e }, e.prototype.init = function() {
                if (this.attachEvents(), this.$valueEl && this.$valueEl.length) {
                    var e = this.formatValue(this.value);
                    this.$valueEl.html(e)
                }
                return this
            }, e.prototype.destroy = function() {
                var e = this;
                e.$el.trigger("stepper:beforedestroy", e), e.emit("local::beforeDestroy stepperBeforeDestroy", e), delete e.$el[0].f7Stepper, e.detachEvents(), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        Stepper$1 = {
            name: "stepper",
            create: function() {
                var n = this;
                n.stepper = Utils.extend(ConstructorMethods({ defaultSelector: ".stepper", constructor: Stepper, app: n, domProp: "f7Stepper" }), { getValue: function(e) { void 0 === e && (e = ".stepper"); var t = n.stepper.get(e); if (t) return t.getValue() }, setValue: function(e, t) { void 0 === e && (e = ".stepper"); var a = n.stepper.get(e); if (a) return a.setValue(t) } })
            },
            static: { Stepper: Stepper },
            on: {
                tabMounted: function(e) {
                    var n = this;
                    $(e).find(".stepper-init").each(function(e, t) {
                        var a = $(t).dataset();
                        n.stepper.create(Utils.extend({ el: t }, a || {}))
                    })
                },
                tabBeforeRemove: function(e) { $(e).find(".stepper-init").each(function(e, t) { t.f7Stepper && t.f7Stepper.destroy() }) },
                pageInit: function(e) {
                    var n = this;
                    e.$el.find(".stepper-init").each(function(e, t) {
                        var a = $(t).dataset();
                        n.stepper.create(Utils.extend({ el: t }, a || {}))
                    })
                },
                pageBeforeRemove: function(e) { e.$el.find(".stepper-init").each(function(e, t) { t.f7Stepper && t.f7Stepper.destroy() }) }
            },
            vnode: {
                "stepper-init": {
                    insert: function(e) {
                        var t = e.elm,
                            a = $(t).dataset();
                        this.stepper.create(Utils.extend({ el: t }, a || {}))
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Stepper && t.f7Stepper.destroy()
                    }
                }
            }
        },
        SmartSelect = function(f) {
            function e(e, t) {
                void 0 === t && (t = {}), f.call(this, t, [e]);
                var o = this,
                    a = Utils.extend({ on: {} }, e.params.smartSelect);
                o.useModulesParams(a), o.params = Utils.extend({}, a, t), o.app = e;
                var n = $(o.params.el).eq(0);
                if (0 === n.length) return o;
                if (n[0].f7SmartSelect) return n[0].f7SmartSelect;
                var r = n.find("select").eq(0);
                if (0 === r.length) return o;
                var i = $(o.params.valueEl);
                0 === i.length && (i = n.find(".item-after")), 0 === i.length && (i = $('<div class="item-after"></div>')).insertAfter(n.find(".item-title"));
                var s = t.url;
                s || (n.attr("href") && "#" !== n.attr("href") ? s = n.attr("href") : r.attr("name") && (s = r.attr("name").toLowerCase() + "-select/")), s || (s = o.params.url);
                var l = r[0].multiple,
                    p = l ? "checkbox" : "radio",
                    c = Utils.id();

                function d() { o.open() }

                function u() {
                    var e = o.$selectEl.val();
                    o.$el.trigger("smartselect:change", o, e), o.emit("local::change smartSelectChange", o, e), o.setValue()
                }

                function h() {
                    var e, t, a, n = this.value,
                        r = [];
                    if ("checkbox" === this.type) {
                        for (var i = 0; i < o.selectEl.options.length; i += 1)(e = o.selectEl.options[i]).value === n && (e.selected = this.checked), e.selected && (t = (a = e.dataset ? e.dataset.displayAs : $(e).data("display-value-as")) && void 0 !== a ? a : e.textContent, r.push(t.trim()));
                        o.maxLength && o.checkMaxLength()
                    } else r = [t = (a = (e = o.$selectEl.find('option[value="' + n + '"]')[0]).dataset ? e.dataset.displayAs : $(e).data("display-as")) && void 0 !== a ? a : e.textContent], o.selectEl.value = n;
                    o.$selectEl.trigger("change"), o.$valueEl.text(r.join(", ")), o.params.closeOnSelect && "radio" === o.inputType && o.close()
                }
                return Utils.extend(o, { $el: n, el: n[0], $selectEl: r, selectEl: r[0], $valueEl: i, valueEl: i[0], url: s, multiple: l, inputType: p, id: c, view: void 0, inputName: p + "-" + c, selectName: r.attr("name"), maxLength: r.attr("maxlength") || t.maxLength }), (n[0].f7SmartSelect = o).attachEvents = function() { n.on("click", d), n.on("change", "select", u) }, o.detachEvents = function() { n.off("click", d), n.off("change", "select", u) }, o.attachInputsEvents = function() { o.$containerEl.on("change", 'input[type="checkbox"], input[type="radio"]', h) }, o.detachInputsEvents = function() { o.$containerEl.off("change", 'input[type="checkbox"], input[type="radio"]', h) }, o.useModules(), o.init(), o
            }
            return f && (e.__proto__ = f), ((e.prototype = Object.create(f && f.prototype)).constructor = e).prototype.getView = function() { var e = this.view || this.params.view; if (e || (e = this.$el.parents(".view").length && this.$el.parents(".view")[0].f7View), !e) throw Error("Smart Select requires initialized View"); return this.view = e }, e.prototype.checkMaxLength = function() {
                var e = this.$containerEl;
                this.selectEl.selectedOptions.length >= this.maxLength ? e.find('input[type="checkbox"]').each(function(e, t) { t.checked ? $(t).parents("li").removeClass("disabled") : $(t).parents("li").addClass("disabled") }) : e.find(".disabled").removeClass("disabled")
            }, e.prototype.setValue = function(e) {
                var r = [];
                void 0 !== e ? r = Array.isArray(e) ? e : [e] : this.$selectEl.find("option").each(function(e, t) {
                    var a = $(t);
                    if (t.selected) {
                        var n = t.dataset ? t.dataset.displayAs : a.data("display-value-as");
                        n && void 0 !== n ? r.push(n) : r.push(t.textContent.trim())
                    }
                }), this.$valueEl.text(r.join(", "))
            }, e.prototype.getItemsData = function() {
                var u, h = this,
                    f = [];
                return h.$selectEl.find("option").each(function(e, t) {
                    var a = $(t),
                        n = a.dataset(),
                        r = n.optionImage || h.params.optionImage,
                        i = n.optionIcon || h.params.optionIcon,
                        o = r || i,
                        s = n.optionColor,
                        l = n.optionClass || "";
                    a[0].disabled && (l += " disabled");
                    var p = a.parent("optgroup")[0],
                        c = p && p.label,
                        d = !1;
                    p && p !== u && (d = !0, u = p, f.push({ groupLabel: c, isLabel: d })), f.push({ value: a[0].value, text: a[0].textContent.trim(), selected: a[0].selected, groupEl: p, groupLabel: c, image: r, icon: i, color: s, className: l, disabled: a[0].disabled, id: h.id, hasMedia: o, checkbox: "checkbox" === h.inputType, radio: "radio" === h.inputType, inputName: h.inputName, inputType: h.inputType })
                }), h.items = f
            }, e.prototype.renderSearchbar = function() { return this.params.renderSearchbar ? this.params.renderSearchbar.call(this) : '\n      <form class="searchbar">\n        <div class="searchbar-inner">\n          <div class="searchbar-input-wrap">\n            <input type="search" placeholder="' + this.params.searchbarPlaceholder + '"/>\n            <i class="searchbar-icon"></i>\n            <span class="input-clear-button"></span>\n          </div>\n          <span class="searchbar-disable-button">' + this.params.searchbarDisableText + "</span>\n        </div>\n      </form>\n    " }, e.prototype.renderItem = function(e, t) { return this.params.renderItem ? this.params.renderItem.call(this, e, t) : e.isLabel ? '<li class="item-divider">' + e.groupLabel + "</li>" : '\n        <li class="' + (e.className || "") + '">\n          <label class="item-' + e.inputType + ' item-content">\n            <input type="' + e.inputType + '" name="' + e.inputName + '" value="' + e.value + '" ' + (e.selected ? "checked" : "") + '/>\n            <i class="icon icon-' + e.inputType + '"></i>\n            ' + (e.hasMedia ? '\n              <div class="item-media">\n                ' + (e.icon ? '<i class="icon ' + e.icon + '"></i>' : "") + "\n                " + (e.image ? '<img src="' + e.image + '">' : "") + "\n              </div>\n            " : "") + '\n            <div class="item-inner">\n              <div class="item-title' + (e.color ? " color-" + e.color : "") + '">' + e.text + "</div>\n            </div>\n          </label>\n        </li>\n      " }, e.prototype.renderItems = function() { var a = this; return a.params.renderItems ? a.params.renderItems.call(a, a.items) : "\n      " + a.items.map(function(e, t) { return "" + a.renderItem(e, t) }).join("") + "\n    " }, e.prototype.renderPage = function() {
                var e = this;
                if (e.params.renderPage) return e.params.renderPage.call(e, e.items);
                var t = e.params.pageTitle;
                if (void 0 === t) {
                    var a = e.$el.find(".item-title");
                    t = a.length ? a.text().trim() : ""
                }
                return '\n      <div class="page smart-select-page ' + e.params.cssClass + '" data-name="smart-select-page" data-select-name="' + e.selectName + '">\n        <div class="navbar ' + (e.params.navbarColorTheme ? "color-theme-" + e.params.navbarColorTheme : "") + '">\n          <div class="navbar-inner sliding ' + (e.params.navbarColorTheme ? "color-theme-" + e.params.navbarColorTheme : "") + '">\n            <div class="left">\n              <a href="#" class="link back">\n                <i class="icon icon-back"></i>\n                <span class="ios-only">' + e.params.pageBackLinkText + "</span>\n              </a>\n            </div>\n            " + (t ? '<div class="title">' + t + "</div>" : "") + "\n            " + (e.params.searchbar ? '<div class="subnavbar">' + e.renderSearchbar() + "</div>" : "") + "\n          </div>\n        </div>\n        " + (e.params.searchbar ? '<div class="searchbar-backdrop"></div>' : "") + '\n        <div class="page-content">\n          <div class="list smart-select-list-' + e.id + " " + (e.params.virtualList ? " virtual-list" : "") + " " + (e.params.formColorTheme ? "color-theme-" + e.params.formColorTheme : "") + '">\n            <ul>' + (!e.params.virtualList && e.renderItems(e.items)) + "</ul>\n          </div>\n        </div>\n      </div>\n    "
            }, e.prototype.renderPopup = function() {
                var e = this;
                if (e.params.renderPopup) return e.params.renderPopup.call(e, e.items);
                var t = e.params.pageTitle;
                if (void 0 === t) {
                    var a = e.$el.find(".item-title");
                    t = a.length ? a.text().trim() : ""
                }
                return '\n      <div class="popup smart-select-popup ' + (e.params.cssClass || "") + " " + (e.params.popupTabletFullscreen ? "popup-tablet-fullscreen" : "") + '" data-select-name="' + e.selectName + '">\n        <div class="view">\n          <div class="page smart-select-page ' + (e.params.searchbar ? "page-with-subnavbar" : "") + '" data-name="smart-select-page">\n            <div class="navbar ' + (e.params.navbarColorTheme ? "color-theme-" + e.params.navbarColorTheme : "") + '">\n              <div class="navbar-inner sliding">\n                <div class="left">\n                  <a href="#" class="link popup-close" data-popup=".smart-select-popup[data-select-name=\'' + e.selectName + '\']">\n                    <i class="icon icon-back"></i>\n                    <span class="ios-only">' + e.params.popupCloseLinkText + "</span>\n                  </a>\n                </div>\n                " + (t ? '<div class="title">' + t + "</div>" : "") + "\n                " + (e.params.searchbar ? '<div class="subnavbar">' + e.renderSearchbar() + "</div>" : "") + "\n              </div>\n            </div>\n            " + (e.params.searchbar ? '<div class="searchbar-backdrop"></div>' : "") + '\n            <div class="page-content">\n              <div class="list smart-select-list-' + e.id + " " + (e.params.virtualList ? " virtual-list" : "") + " " + (e.params.formColorTheme ? "color-theme-" + e.params.formColorTheme : "") + '">\n                <ul>' + (!e.params.virtualList && e.renderItems(e.items)) + "</ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    "
            }, e.prototype.renderSheet = function() { var e = this; return e.params.renderSheet ? e.params.renderSheet.call(e, e.items) : '\n      <div class="sheet-modal smart-select-sheet ' + e.params.cssClass + '" data-select-name="' + e.selectName + '">\n        <div class="toolbar ' + (e.params.toolbarColorTheme ? "theme-" + e.params.toolbarColorTheme : "") + '">\n          <div class="toolbar-inner">\n            <div class="left"></div>\n            <div class="right">\n              <a class="link sheet-close">' + e.params.sheetCloseLinkText + '</a>\n            </div>\n          </div>\n        </div>\n        <div class="sheet-modal-inner">\n          <div class="page-content">\n            <div class="list smart-select-list-' + e.id + " " + (e.params.virtualList ? " virtual-list" : "") + " " + (e.params.formColorTheme ? "color-theme-" + e.params.formColorTheme : "") + '">\n              <ul>' + (!e.params.virtualList && e.renderItems(e.items)) + "</ul>\n            </div>\n          </div>\n        </div>\n      </div>\n    " }, e.prototype.renderPopover = function() { var e = this; return e.params.renderPopover ? e.params.renderPopover.call(e, e.items) : '\n      <div class="popover smart-select-popover ' + e.params.cssClass + '" data-select-name="' + e.selectName + '">\n        <div class="popover-inner">\n          <div class="list smart-select-list-' + e.id + " " + (e.params.virtualList ? " virtual-list" : "") + " " + (e.params.formColorTheme ? "color-theme-" + e.params.formColorTheme : "") + '">\n            <ul>' + (!e.params.virtualList && e.renderItems(e.items)) + "</ul>\n          </div>\n        </div>\n      </div>\n    " }, e.prototype.onOpen = function(e, t) {
                var a = this,
                    n = a.app,
                    r = $(t);
                if (a.$containerEl = r, a.openedIn = e, a.opened = !0, a.params.virtualList && (a.vl = n.virtualList.create({ el: r.find(".virtual-list"), items: a.items, renderItem: a.renderItem.bind(a), height: a.params.virtualListHeight, searchByItem: function(e, t) { return !!(t.text && 0 <= t.text.toLowerCase().indexOf(e.trim().toLowerCase())) } })), a.params.searchbar) {
                    var i = r.find(".searchbar");
                    if ("page" === e && "ios" === n.theme && (i = $(n.navbar.getElByPage(r)).find(".searchbar")), a.params.appendSearchbarNotFound && ("page" === e || "popup" === e)) {
                        var o = null;
                        (o = "string" == typeof a.params.appendSearchbarNotFound ? $('<div class="block searchbar-not-found">' + a.params.appendSearchbarNotFound + "</div>") : "boolean" == typeof a.params.appendSearchbarNotFound ? $('<div class="block searchbar-not-found">Nothing found</div>') : a.params.appendSearchbarNotFound) && r.find(".page-content").append(o[0])
                    }
                    var s = Utils.extend({ el: i, backdropEl: r.find(".searchbar-backdrop"), searchContainer: ".smart-select-list-" + a.id, searchIn: ".item-title" }, "object" == typeof a.params.searchbar ? a.params.searchbar : {});
                    a.searchbar = n.searchbar.create(s)
                }
                a.maxLength && a.checkMaxLength(), a.params.closeOnSelect && a.$containerEl.find('input[type="radio"][name="' + a.inputName + '"]:checked').parents("label").once("click", function() { a.close() }), a.attachInputsEvents(), a.$el.trigger("smartselect:open", a), a.emit("local::open smartSelectOpen", a)
            }, e.prototype.onOpened = function() { this.$el.trigger("smartselect:opened", this), this.emit("local::opened smartSelectOpened", this) }, e.prototype.onClose = function() {
                var e = this;
                e.destroyed || (e.vl && e.vl.destroy && (e.vl.destroy(), e.vl = null, delete e.vl), e.searchbar && e.searchbar.destroy && (e.searchbar.destroy(), e.searchbar = null, delete e.searchbar), e.detachInputsEvents(), e.$el.trigger("smartselect:close", e), e.emit("local::close smartSelectClose", e))
            }, e.prototype.onClosed = function() { this.destroyed || (this.opened = !1, this.$containerEl = null, delete this.$containerEl, this.$el.trigger("smartselect:closed", this), this.emit("local::closed smartSelectClosed", this)) }, e.prototype.openPage = function() {
                var a = this;
                if (a.opened) return a;
                a.getItemsData();
                var e = a.renderPage(a.items);
                return a.getView().router.navigate({ url: a.url, route: { content: e, path: a.url, on: { pageBeforeIn: function(e, t) { a.onOpen("page", t.el) }, pageAfterIn: function(e, t) { a.onOpened("page", t.el) }, pageBeforeOut: function(e, t) { a.onClose("page", t.el) }, pageAfterOut: function(e, t) { a.onClosed("page", t.el) } } } }), a
            }, e.prototype.openPopup = function() {
                var t = this;
                if (t.opened) return t;
                t.getItemsData();
                var e = { content: t.renderPopup(t.items), on: { popupOpen: function(e) { t.onOpen("popup", e.el) }, popupOpened: function(e) { t.onOpened("popup", e.el) }, popupClose: function(e) { t.onClose("popup", e.el) }, popupClosed: function(e) { t.onClosed("popup", e.el) } } };
                t.params.routableModals ? t.getView().router.navigate({ url: t.url, route: { path: t.url, popup: e } }) : t.modal = t.app.popup.create(e).open();
                return t
            }, e.prototype.openSheet = function() {
                var t = this;
                if (t.opened) return t;
                t.getItemsData();
                var e = { content: t.renderSheet(t.items), backdrop: !1, scrollToEl: t.$el, closeByOutsideClick: !0, on: { sheetOpen: function(e) { t.onOpen("sheet", e.el) }, sheetOpened: function(e) { t.onOpened("sheet", e.el) }, sheetClose: function(e) { t.onClose("sheet", e.el) }, sheetClosed: function(e) { t.onClosed("sheet", e.el) } } };
                t.params.routableModals ? t.getView().router.navigate({ url: t.url, route: { path: t.url, sheet: e } }) : t.modal = t.app.sheet.create(e).open();
                return t
            }, e.prototype.openPopover = function() {
                var t = this;
                if (t.opened) return t;
                t.getItemsData();
                var e = { content: t.renderPopover(t.items), targetEl: t.$el, on: { popoverOpen: function(e) { t.onOpen("popover", e.el) }, popoverOpened: function(e) { t.onOpened("popover", e.el) }, popoverClose: function(e) { t.onClose("popover", e.el) }, popoverClosed: function(e) { t.onClosed("popover", e.el) } } };
                t.params.routableModals ? t.getView().router.navigate({ url: t.url, route: { path: t.url, popover: e } }) : t.modal = t.app.popover.create(e).open();
                return t
            }, e.prototype.open = function(e) { return this.opened || this["open" + (e || this.params.openIn).split("").map(function(e, t) { return 0 === t ? e.toUpperCase() : e }).join("")](), this }, e.prototype.close = function() {
                var e = this;
                if (!e.opened) return e;
                e.params.routableModals || "page" === e.openedIn ? e.getView().router.back() : (e.modal.once("modalClosed", function() { Utils.nextTick(function() { e.modal.destroy(), delete e.modal }) }), e.modal.close());
                return e
            }, e.prototype.init = function() { this.attachEvents(), this.setValue() }, e.prototype.destroy = function() { this.emit("local::beforeDestroy smartSelectBeforeDestroy", this), this.$el.trigger("smartselect:beforedestroy", this), this.detachEvents(), delete this.$el[0].f7SmartSelect, Utils.deleteProps(this), this.destroyed = !0 }, e
        }(Framework7Class),
        SmartSelect$1 = {
            name: "smartSelect",
            params: { smartSelect: { el: void 0, valueEl: void 0, openIn: "page", pageTitle: void 0, pageBackLinkText: "Back", popupCloseLinkText: "Close", popupTabletFullscreen: !1, sheetCloseLinkText: "Done", searchbar: !1, searchbarPlaceholder: "Search", searchbarDisableText: "Cancel", closeOnSelect: !1, virtualList: !1, virtualListHeight: void 0, formColorTheme: void 0, navbarColorTheme: void 0, routableModals: !0, url: "select/", cssClass: "", renderPage: void 0, renderPopup: void 0, renderSheet: void 0, renderPopover: void 0, renderItems: void 0, renderItem: void 0, renderSearchbar: void 0 } },
            static: { SmartSelect: SmartSelect },
            create: function() {
                var a = this;
                a.smartSelect = Utils.extend(ConstructorMethods({ defaultSelector: ".smart-select", constructor: SmartSelect, app: a, domProp: "f7SmartSelect" }), { open: function(e) { var t = a.smartSelect.get(e); if (t && t.open) return t.open() }, close: function(e) { var t = a.smartSelect.get(e); if (t && t.close) return t.close() } })
            },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".smart-select-init").each(function(e, t) { a.smartSelect.create(Utils.extend({ el: t }, $(t).dataset())) })
                },
                tabBeforeRemove: function(e) { $(e).find(".smart-select-init").each(function(e, t) { t.f7SmartSelect && t.f7SmartSelect.destroy && t.f7SmartSelect.destroy() }) },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".smart-select-init").each(function(e, t) { a.smartSelect.create(Utils.extend({ el: t }, $(t).dataset())) })
                },
                pageBeforeRemove: function(e) { e.$el.find(".smart-select-init").each(function(e, t) { t.f7SmartSelect && t.f7SmartSelect.destroy && t.f7SmartSelect.destroy() }) }
            },
            clicks: { ".smart-select": function(e, t) { e[0].f7SmartSelect || this.smartSelect.create(Utils.extend({ el: e }, t)).open() } },
            vnode: {
                "smart-select-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.smartSelect.create(Utils.extend({ el: t }, $(t).dataset()))
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7SmartSelect && t.f7SmartSelect.destroy && t.f7SmartSelect.destroy()
                    }
                }
            }
        },
        Grid = { name: "grid" };

    function toJalaali(e, t, a) { return "[object Date]" === Object.prototype.toString.call(e) && (a = e.getDate(), t = e.getMonth() + 1, e = e.getFullYear()), d2j(g2d(e, t, a)) }

    function toGregorian(e, t, a) { return d2g(j2d(e, t, a)) }

    function isLeapJalaaliYear(e) { return 0 === jalCal(e).leap }

    function monthLength(e, t) { return t <= 6 ? 31 : t <= 11 ? 30 : isLeapJalaaliYear(e) ? 30 : 29 }

    function jalCal(e) {
        var t, a, n, r, i, o, s = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178],
            l = s.length,
            p = e + 621,
            c = -14,
            d = s[0];
        if (e < d || s[l - 1] <= e) throw new Error("Invalid Jalaali year " + e);
        for (o = 1; o < l && (a = (t = s[o]) - d, !(e < t)); o += 1) c = c + 8 * div(a, 33) + div(mod(a, 33), 4), d = t;
        return c = c + 8 * div(i = e - d, 33) + div(mod(i, 33) + 3, 4), 4 === mod(a, 33) && a - i == 4 && (c += 1), r = 20 + c - (div(p, 4) - div(3 * (div(p, 100) + 1), 4) - 150), a - i < 6 && (i = i - a + 33 * div(a + 4, 33)), -1 === (n = mod(mod(i + 1, 33) - 1, 4)) && (n = 4), { leap: n, gy: p, march: r }
    }

    function j2d(e, t, a) { var n = jalCal(e); return g2d(n.gy, 3, n.march) + 31 * (t - 1) - div(t, 7) * (t - 7) + a - 1 }

    function d2j(e) {
        var t, a = d2g(e).gy,
            n = a - 621,
            r = jalCal(n);
        if (0 <= (t = e - g2d(a, 3, r.march))) {
            if (t <= 185) return { jy: n, jm: 1 + div(t, 31), jd: mod(t, 31) + 1 };
            t -= 186
        } else n -= 1, t += 179, 1 === r.leap && (t += 1);
        return { jy: n, jm: 7 + div(t, 30), jd: mod(t, 30) + 1 }
    }

    function g2d(e, t, a) { var n = div(1461 * (e + div(t - 8, 6) + 100100), 4) + div(153 * mod(t + 9, 12) + 2, 5) + a - 34840408; return n = n - div(3 * div(e + 100100 + div(t - 8, 6), 100), 4) + 752 }

    function d2g(e) { var t, a, n, r; return n = div(mod(a = 5 * div(mod(t = (t = 4 * e + 139361631) + 4 * div(3 * div(4 * e + 183187720, 146097), 4) - 3908, 1461), 4) + 308, 153), 5) + 1, r = mod(div(a, 153), 12) + 1, { gy: div(t, 1461) - 100100 + div(8 - r, 6), gm: r, gd: n } }

    function div(e, t) { return ~~(e / t) }

    function mod(e, t) { return e - ~~(e / t) * t }

    function fixDate(e, t, a) { for (11 < t && (e += Math.floor(t / 12), t %= 12); t < 0;) e -= 1, t += 12; for (; a > monthLength(e, t + 1);) a -= monthLength(e = 0 === (t = 11 !== t ? t + 1 : 0) ? e + 1 : e, t + 1); for (; a <= 0;) a += monthLength(e = 11 === (t = 0 !== t ? t - 1 : 11) ? e - 1 : e, t + 1); return [e, t || 0, a || 1] }
    var methods = ["getHours", "getMilliseconds", "getMinutes", "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay", "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds", "now", "parse", "setHours", "setMilliseconds", "setMinutes", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "toDateString", "toISOString", "toJSON", "toLocaleDateString", "toLocaleTimeString", "toLocaleString", "toTimeString", "toUTCString", "UTC", "valueOf"],
        DAY_NAMES = ["Shanbe", "Yekshanbe", "Doshanbe", "Seshanbe", "Chaharshanbe", "Panjshanbe", "Jom'e"],
        PERSIAN_DAY_NAMES = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
        MONTH_NAMES = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"],
        PERSIAN_MONTH_NAMES = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
        PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        IDate = function(i) {
            function o() {
                var e;
                i.call(this);
                var t = Array.from(arguments);
                if (0 === t.length) e = i.now();
                else if (1 === t.length) e = t[0] instanceof i ? t[0].getTime() : t[0];
                else {
                    var a = fixDate(t[0], t[1] || 0, void 0 === t[2] ? 1 : t[2]),
                        n = toGregorian(a[0], a[1] + 1, a[2]);
                    e = [n.gy, n.gm - 1, n.gd].concat([t[3] || 0, t[4] || 0, t[5] || 0, t[6] || 0])
                }
                Array.isArray(e) ? this.gdate = new(Function.prototype.bind.apply(i, [null].concat(e))) : this.gdate = new i(e);
                var r = toJalaali(this.gdate.getFullYear(), this.gdate.getMonth() + 1, this.gdate.getDate());
                this.jdate = [r.jy, r.jm - 1, r.jd], methods.forEach(function(t) { o.prototype[t] = function() { var e; return (e = this.gdate)[t].apply(e, arguments) } })
            }
            return i && (o.__proto__ = i), ((o.prototype = Object.create(i && i.prototype)).constructor = o).prototype.getFullYear = function() { return this.jdate[0] }, o.prototype.setFullYear = function(e) { return this.jdate = fixDate(e, this.jdate[1], this.jdate[2]), this.syncDate(), this.gdate.getTime() }, o.prototype.getMonth = function() { return this.jdate[1] }, o.prototype.setMonth = function(e) { return this.jdate = fixDate(this.jdate[0], e, this.jdate[2]), this.syncDate(), this.gdate.getTime() }, o.prototype.getDate = function() { return this.jdate[2] }, o.prototype.setDate = function(e) { return this.jdate = fixDate(this.jdate[0], this.jdate[1], e), this.syncDate(), this.gdate.getTime() }, o.prototype.getDay = function() { return (this.gdate.getDay() + 1) % 7 }, o.prototype.syncDate = function() {
                var e = toGregorian(this.jdate[0], this.jdate[1] + 1, this.jdate[2]);
                this.gdate.setFullYear(e.gy), this.gdate.setMonth(e.gm - 1), this.gdate.setDate(e.gd)
            }, o.prototype.toString = function(e) {
                void 0 === e && (e = !0);
                var t = function(e) { return 1 === e.toString().length ? "0" + e : e.toString() },
                    a = t(this.getHours()) + ":" + t(this.getMinutes()) + ":" + t(this.getSeconds());
                return e ? (PERSIAN_DAY_NAMES[this.getDay()] + " " + this.getDate() + " " + PERSIAN_MONTH_NAMES[this.getMonth()] + " " + this.getFullYear() + " ساعت " + a).replace(/./g, function(e) { return PERSIAN_NUMBERS[e] || e }) : DAY_NAMES[this.getDay()] + " " + this.getDate() + " " + MONTH_NAMES[this.getMonth()] + " " + this.getFullYear() + " " + a
            }, o
        }(Date),
        Calendar = function(p) {
            function e(S, t) {
                void 0 === t && (t = {}), p.call(this, t, [S]);
                var e, a, n, T = this;
                if (T.params = Utils.extend({}, S.params.calendar, t), "jalali" === T.params.calendarType && Object.keys(T.params.jalali).forEach(function(e) { t[e] || (T.params[e] = T.params.jalali[e]) }), "jalali" === T.params.calendarType ? T.DateHandleClass = IDate : T.DateHandleClass = Date, T.params.containerEl && 0 === (e = $(T.params.containerEl)).length) return T;
                T.params.inputEl && (a = $(T.params.inputEl)), a && (n = a.parents(".view").length && a.parents(".view")[0].f7View), n || (n = S.views.main);
                var r = "horizontal" === T.params.direction,
                    i = 1;

                function o() { T.open() }

                function s(e) { e.preventDefault() }

                function l(e) {
                    var t = $(e.target);
                    T.isPopover() || T.opened && !T.closing && (t.closest('[class*="backdrop"]').length || (a && 0 < a.length ? t[0] !== a[0] && 0 === t.closest(".sheet-modal, .calendar-modal").length && T.close() : 0 === $(e.target).closest(".sheet-modal, .calendar-modal").length && T.close()))
                }
                return r && (i = S.rtl ? -1 : 1), Utils.extend(T, { app: S, $containerEl: e, containerEl: e && e[0], inline: e && 0 < e.length, $inputEl: a, inputEl: a && a[0], initialized: !1, opened: !1, url: T.params.url, isHorizontal: r, inverter: i, view: n, animating: !1 }), Utils.extend(T, { attachInputEvents: function() { T.$inputEl.on("click", o), T.params.inputReadOnly && T.$inputEl.on("focus mousedown", s) }, detachInputEvents: function() { T.$inputEl.off("click", o), T.params.inputReadOnly && T.$inputEl.off("focus mousedown", s) }, attachHtmlEvents: function() { S.on("click", l) }, detachHtmlEvents: function() { S.off("click", l) } }), T.attachCalendarEvents = function() {
                    var a, n, r, i, o, s, t, l, p, c, d, u, h, f = !0,
                        e = T.$el,
                        m = T.$wrapperEl;

                    function v(e) { n || a || (a = !0, r = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, o = r, i = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, s = i, t = (new T.DateHandleClass).getTime(), f = !(d = 0), h = void 0, l = T.monthsTranslate) }

                    function g(e) {
                        if (a) {
                            var t = T.isHorizontal;
                            o = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, s = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, void 0 === h && (h = !!(h || Math.abs(s - i) > Math.abs(o - r))), t && h ? a = !1 : (e.preventDefault(), T.animating ? a = !1 : (f = !1, n || (n = !0, p = m[0].offsetWidth, c = m[0].offsetHeight, m.transition(0)), d = (u = t ? o - r : s - i) / (t ? p : c), l = 100 * (T.monthsTranslate * T.inverter + d), m.transform("translate3d(" + (t ? l : 0) + "%, " + (t ? 0 : l) + "%, 0)")))
                        }
                    }

                    function b() { a && n ? (n = a = !1, (new T.DateHandleClass).getTime() - t < 300 ? Math.abs(u) < 10 ? T.resetMonth() : 10 <= u ? S.rtl ? T.nextMonth() : T.prevMonth() : S.rtl ? T.prevMonth() : T.nextMonth() : d <= -.5 ? S.rtl ? T.prevMonth() : T.nextMonth() : .5 <= d ? S.rtl ? T.nextMonth() : T.prevMonth() : T.resetMonth(), setTimeout(function() { f = !0 }, 100)) : n = a = !1 }

                    function y(e) {
                        if (f) {
                            var t = $(e.target).parents(".calendar-day");
                            if (0 === t.length && $(e.target).hasClass("calendar-day") && (t = $(e.target)), 0 !== t.length && !t.hasClass("calendar-day-disabled")) {
                                T.params.rangePicker || (t.hasClass("calendar-day-next") && T.nextMonth(), t.hasClass("calendar-day-prev") && T.prevMonth());
                                var a = parseInt(t.attr("data-year"), 10),
                                    n = parseInt(t.attr("data-month"), 10),
                                    r = parseInt(t.attr("data-day"), 10);
                                T.emit("local::dayClick calendarDayClick", T, t[0], a, n, r), (!t.hasClass("calendar-day-selected") || T.params.multiple || T.params.rangePicker) && T.addValue(new T.DateHandleClass(a, n, r, 0, 0, 0)), T.params.closeOnSelect && (T.params.rangePicker && 2 === T.value.length || !T.params.rangePicker) && T.close()
                            }
                        }
                    }

                    function w() { T.nextMonth() }

                    function C() { T.prevMonth() }

                    function x() { T.nextYear() }

                    function E() { T.prevYear() }
                    var k = !("touchstart" !== S.touchEvents.start || !S.support.passiveListener) && { passive: !0, capture: !1 };
                    e.find(".calendar-prev-month-button").on("click", C), e.find(".calendar-next-month-button").on("click", w), e.find(".calendar-prev-year-button").on("click", E), e.find(".calendar-next-year-button").on("click", x), m.on("click", y), T.params.touchMove && (m.on(S.touchEvents.start, v, k), S.on("touchmove:active", g), S.on("touchend:passive", b)), T.detachCalendarEvents = function() { e.find(".calendar-prev-month-button").off("click", C), e.find(".calendar-next-month-button").off("click", w), e.find(".calendar-prev-year-button").off("click", E), e.find(".calendar-next-year-button").off("click", x), m.off("click", y), T.params.touchMove && (m.off(S.touchEvents.start, v, k), S.off("touchmove:active", g), S.off("touchend:passive", b)) }
                }, T.init(), T
            }
            return p && (e.__proto__ = p), ((e.prototype = Object.create(p && p.prototype)).constructor = e).prototype.normalizeDate = function(e) { var t = new this.DateHandleClass(e); return new this.DateHandleClass(t.getFullYear(), t.getMonth(), t.getDate()) }, e.prototype.normalizeValues = function(e) {
                var t = this,
                    a = [];
                return e && Array.isArray(e) && (a = e.map(function(e) { return t.normalizeDate(e) })), a
            }, e.prototype.initInput = function() { this.$inputEl && this.params.inputReadOnly && this.$inputEl.prop("readOnly", !0) }, e.prototype.isPopover = function() {
                var e = this.app,
                    t = this.modal,
                    a = this.params;
                if ("sheet" === a.openIn) return !1;
                if (t && "popover" !== t.type) return !1;
                if (!this.inline && this.inputEl) { if ("popover" === a.openIn) return !0; if (e.device.ios) return !!e.device.ipad; if (768 <= e.width) return !0 }
                return !1
            }, e.prototype.formatDate = function(e) {
                var t = new this.DateHandleClass(e),
                    a = t.getFullYear(),
                    n = t.getMonth(),
                    r = n + 1,
                    i = t.getDate(),
                    o = t.getDay(),
                    s = this.params,
                    l = s.dateFormat,
                    p = s.monthNames,
                    c = s.monthNamesShort,
                    d = s.dayNames,
                    u = s.dayNamesShort;
                return l.replace(/yyyy/g, a).replace(/yy/g, String(a).substring(2)).replace(/mm/g, r < 10 ? "0" + r : r).replace(/m(\W+)/g, r + "$1").replace(/MM/g, p[n]).replace(/M(\W+)/g, c[n] + "$1").replace(/dd/g, i < 10 ? "0" + i : i).replace(/d(\W+)/g, i + "$1").replace(/DD/g, d[o]).replace(/D(\W+)/g, u[o] + "$1")
            }, e.prototype.formatValue = function() {
                var t = this,
                    e = t.value;
                return t.params.formatValue ? t.params.formatValue.call(t, e) : e.map(function(e) { return t.formatDate(e) }).join(t.params.rangePicker ? " - " : ", ")
            }, e.prototype.addValue = function(e) {
                var t = this,
                    a = t.params,
                    n = a.multiple,
                    r = a.rangePicker,
                    i = a.rangePickerMinDays,
                    o = a.rangePickerMaxDays;
                if (n) {
                    var s;
                    t.value || (t.value = []);
                    for (var l = 0; l < t.value.length; l += 1) new t.DateHandleClass(e).getTime() === new t.DateHandleClass(t.value[l]).getTime() && (s = l);
                    void 0 === s ? t.value.push(e) : t.value.splice(s, 1), t.updateValue()
                } else r ? (t.value || (t.value = []), 2 !== t.value.length && 0 !== t.value.length || (t.value = []), 0 === t.value.length || Math.abs(t.value[0].getTime() - e.getTime()) >= 60 * (i - 1) * 60 * 24 * 1e3 && (0 === o || Math.abs(t.value[0].getTime() - e.getTime()) <= 60 * (o - 1) * 60 * 24 * 1e3) ? t.value.push(e) : t.value = [], t.value.sort(function(e, t) { return e - t })) : t.value = [e], t.updateValue()
            }, e.prototype.setValue = function(e) { this.value = e, this.updateValue() }, e.prototype.getValue = function() { return this.value }, e.prototype.updateValue = function(e) {
                var t, a, n = this,
                    r = n.$el,
                    i = n.$wrapperEl,
                    o = n.$inputEl,
                    s = n.value,
                    l = n.params;
                if (r && 0 < r.length)
                    if (i.find(".calendar-day-selected").removeClass("calendar-day-selected"), l.rangePicker && 2 === s.length)
                        for (t = new n.DateHandleClass(s[0]).getTime(); t <= new n.DateHandleClass(s[1]).getTime(); t += 864e5) a = new n.DateHandleClass(t), i.find('.calendar-day[data-date="' + a.getFullYear() + "-" + a.getMonth() + "-" + a.getDate() + '"]').addClass("calendar-day-selected");
                    else
                        for (t = 0; t < n.value.length; t += 1) a = new n.DateHandleClass(s[t]), i.find('.calendar-day[data-date="' + a.getFullYear() + "-" + a.getMonth() + "-" + a.getDate() + '"]').addClass("calendar-day-selected");
                if (e || n.emit("local::change calendarChange", n, s), o && o.length || l.header) {
                    var p = n.formatValue(s);
                    l.header && r && r.length && r.find(".calendar-selected-date").text(p), o && o.length && !e && (o.val(p), o.trigger("change"))
                }
            }, e.prototype.updateCurrentMonthYear = function(e) {
                var t = this.$months,
                    a = this.$el,
                    n = this.params;
                this.currentYear = void 0 === e ? (this.currentMonth = parseInt(t.eq(1).attr("data-month"), 10), parseInt(t.eq(1).attr("data-year"), 10)) : (this.currentMonth = parseInt(t.eq("next" === e ? t.length - 1 : 0).attr("data-month"), 10), parseInt(t.eq("next" === e ? t.length - 1 : 0).attr("data-year"), 10)), a.find(".current-month-value").text(n.monthNames[this.currentMonth]), a.find(".current-year-value").text(this.currentYear)
            }, e.prototype.update = function() {
                var a = this,
                    e = a.currentYear,
                    t = a.currentMonth,
                    n = a.$wrapperEl,
                    r = new a.DateHandleClass(e, t),
                    i = a.renderMonth(r, "prev"),
                    o = a.renderMonth(r),
                    s = a.renderMonth(r, "next");
                n.transition(0).html("" + i + o + s).transform("translate3d(0,0,0)"), a.$months = n.find(".calendar-month"), a.monthsTranslate = 0, a.setMonthsTranslate(), a.$months.each(function(e, t) { a.emit("local::monthAdd calendarMonthAdd", t) })
            }, e.prototype.onMonthChangeStart = function(e) {
                var t = this.$months,
                    a = this.currentYear,
                    n = this.currentMonth;
                this.updateCurrentMonthYear(e), t.removeClass("calendar-month-current calendar-month-prev calendar-month-next");
                var r = "next" === e ? t.length - 1 : 0;
                t.eq(r).addClass("calendar-month-current"), t.eq("next" === e ? r - 1 : r + 1).addClass("next" === e ? "calendar-month-prev" : "calendar-month-next"), this.emit("local::monthYearChangeStart calendarMonthYearChangeStart", this, a, n)
            }, e.prototype.onMonthChangeEnd = function(e, t) {
                var a, n, r, i = this,
                    o = i.currentYear,
                    s = i.currentMonth,
                    l = i.$wrapperEl,
                    p = i.monthsTranslate;
                i.animating = !1, l.find(".calendar-month:not(.calendar-month-prev):not(.calendar-month-current):not(.calendar-month-next)").remove(), void 0 === e && (e = "next", t = !0), t ? (l.find(".calendar-month-next, .calendar-month-prev").remove(), n = i.renderMonth(new i.DateHandleClass(o, s), "prev"), a = i.renderMonth(new i.DateHandleClass(o, s), "next")) : r = i.renderMonth(new i.DateHandleClass(o, s), e), ("next" === e || t) && l.append(r || a), ("prev" === e || t) && l.prepend(r || n);
                var c = l.find(".calendar-month");
                i.$months = c, i.setMonthsTranslate(p), i.emit("local::monthAdd calendarMonthAdd", i, "next" === e ? c.eq(c.length - 1)[0] : c.eq(0)[0]), i.emit("local::monthYearChangeEnd calendarMonthYearChangeEnd", i, o, s)
            }, e.prototype.setMonthsTranslate = function(e) {
                var t = this.$months,
                    a = this.isHorizontal,
                    n = this.inverter;
                e = e || this.monthsTranslate || 0, void 0 === this.monthsTranslate && (this.monthsTranslate = e), t.removeClass("calendar-month-current calendar-month-prev calendar-month-next");
                var r = 100 * -(e + 1) * n,
                    i = 100 * -e * n,
                    o = 100 * -(e - 1) * n;
                t.eq(0).transform("translate3d(" + (a ? r : 0) + "%, " + (a ? 0 : r) + "%, 0)").addClass("calendar-month-prev"), t.eq(1).transform("translate3d(" + (a ? i : 0) + "%, " + (a ? 0 : i) + "%, 0)").addClass("calendar-month-current"), t.eq(2).transform("translate3d(" + (a ? o : 0) + "%, " + (a ? 0 : o) + "%, 0)").addClass("calendar-month-next")
            }, e.prototype.nextMonth = function(e) {
                var t = this,
                    a = t.params,
                    n = t.$wrapperEl,
                    r = t.inverter,
                    i = t.isHorizontal;
                void 0 !== e && "object" != typeof e || (e = "", a.animate || (e = 0));
                var o = parseInt(t.$months.eq(t.$months.length - 1).attr("data-month"), 10),
                    s = parseInt(t.$months.eq(t.$months.length - 1).attr("data-year"), 10),
                    l = new t.DateHandleClass(s, o).getTime(),
                    p = !t.animating;
                if (a.maxDate && l > new t.DateHandleClass(a.maxDate).getTime()) t.resetMonth();
                else {
                    if (t.monthsTranslate -= 1, o === t.currentMonth) {
                        var c = 100 * -t.monthsTranslate * r,
                            d = $(t.renderMonth(l, "next")).transform("translate3d(" + (i ? c : 0) + "%, " + (i ? 0 : c) + "%, 0)").addClass("calendar-month-next");
                        n.append(d[0]), t.$months = n.find(".calendar-month"), t.emit("local::monthAdd calendarMonthAdd", t.$months.eq(t.$months.length - 1)[0])
                    }
                    t.animating = !0, t.onMonthChangeStart("next");
                    var u = 100 * t.monthsTranslate * r;
                    n.transition(e).transform("translate3d(" + (i ? u : 0) + "%, " + (i ? 0 : u) + "%, 0)"), p && n.transitionEnd(function() { t.onMonthChangeEnd("next") }), a.animate || t.onMonthChangeEnd("next")
                }
            }, e.prototype.prevMonth = function(e) {
                var t = this,
                    a = t.params,
                    n = t.$wrapperEl,
                    r = t.inverter,
                    i = t.isHorizontal;
                void 0 !== e && "object" != typeof e || (e = "", a.animate || (e = 0));
                var o = parseInt(t.$months.eq(0).attr("data-month"), 10),
                    s = parseInt(t.$months.eq(0).attr("data-year"), 10),
                    l = new t.DateHandleClass(s, o + 1, -1).getTime(),
                    p = !t.animating;
                if (a.minDate) { var c = new t.DateHandleClass(a.minDate); if (l < (c = new t.DateHandleClass(c.getFullYear(), c.getMonth(), 1)).getTime()) return void t.resetMonth() }
                if (t.monthsTranslate += 1, o === t.currentMonth) {
                    var d = 100 * -t.monthsTranslate * r,
                        u = $(t.renderMonth(l, "prev")).transform("translate3d(" + (i ? d : 0) + "%, " + (i ? 0 : d) + "%, 0)").addClass("calendar-month-prev");
                    n.prepend(u[0]), t.$months = n.find(".calendar-month"), t.emit("local::monthAdd calendarMonthAdd", t.$months.eq(0)[0])
                }
                t.animating = !0, t.onMonthChangeStart("prev");
                var h = 100 * t.monthsTranslate * r;
                n.transition(e).transform("translate3d(" + (i ? h : 0) + "%, " + (i ? 0 : h) + "%, 0)"), p && n.transitionEnd(function() { t.onMonthChangeEnd("prev") }), a.animate || t.onMonthChangeEnd("prev")
            }, e.prototype.resetMonth = function(e) {
                void 0 === e && (e = "");
                var t = this.$wrapperEl,
                    a = this.inverter,
                    n = this.isHorizontal,
                    r = 100 * this.monthsTranslate * a;
                t.transition(e).transform("translate3d(" + (n ? r : 0) + "%, " + (n ? 0 : r) + "%, 0)")
            }, e.prototype.setYearMonth = function(e, t, a) {
                var n, r = this,
                    i = r.params,
                    o = r.isHorizontal,
                    s = r.$wrapperEl,
                    l = r.inverter;
                if (void 0 === e && (e = r.currentYear), void 0 === t && (t = r.currentMonth), void 0 !== a && "object" != typeof a || (a = "", i.animate || (a = 0)), n = e < r.currentYear ? new r.DateHandleClass(e, t + 1, -1).getTime() : new r.DateHandleClass(e, t).getTime(), i.maxDate && n > new r.DateHandleClass(i.maxDate).getTime()) return !1;
                if (i.minDate) { var p = new r.DateHandleClass(i.minDate); if (n < (p = new r.DateHandleClass(p.getFullYear(), p.getMonth(), 1)).getTime()) return !1 }
                var c = new r.DateHandleClass(r.currentYear, r.currentMonth).getTime(),
                    d = c < n ? "next" : "prev",
                    u = r.renderMonth(new r.DateHandleClass(e, t));
                r.monthsTranslate = r.monthsTranslate || 0;
                var h, f = r.monthsTranslate,
                    m = !r.animating;
                c < n ? (r.monthsTranslate -= 1, r.animating || r.$months.eq(r.$months.length - 1).remove(), s.append(u), r.$months = s.find(".calendar-month"), h = 100 * -(f - 1) * l, r.$months.eq(r.$months.length - 1).transform("translate3d(" + (o ? h : 0) + "%, " + (o ? 0 : h) + "%, 0)").addClass("calendar-month-next")) : (r.monthsTranslate += 1, r.animating || r.$months.eq(0).remove(), s.prepend(u), r.$months = s.find(".calendar-month"), h = 100 * -(f + 1) * l, r.$months.eq(0).transform("translate3d(" + (o ? h : 0) + "%, " + (o ? 0 : h) + "%, 0)").addClass("calendar-month-prev")), r.emit("local::monthAdd calendarMonthAdd", "next" === d ? r.$months.eq(r.$months.length - 1)[0] : r.$months.eq(0)[0]), r.animating = !0, r.onMonthChangeStart(d);
                var v = 100 * r.monthsTranslate * l;
                s.transition(a).transform("translate3d(" + (o ? v : 0) + "%, " + (o ? 0 : v) + "%, 0)"), m && s.transitionEnd(function() { r.onMonthChangeEnd(d, !0) }), i.animate || r.onMonthChangeEnd(d)
            }, e.prototype.nextYear = function() { this.setYearMonth(this.currentYear + 1) }, e.prototype.prevYear = function() { this.setYearMonth(this.currentYear - 1) }, e.prototype.dateInRange = function(e, t) {
                var a, n = this,
                    r = !1;
                if (!t) return !1;
                if (Array.isArray(t))
                    for (a = 0; a < t.length; a += 1) t[a].from || t[a].to ? t[a].from && t[a].to ? e <= new n.DateHandleClass(t[a].to).getTime() && e >= new n.DateHandleClass(t[a].from).getTime() && (r = !0) : t[a].from ? e >= new n.DateHandleClass(t[a].from).getTime() && (r = !0) : t[a].to && e <= new n.DateHandleClass(t[a].to).getTime() && (r = !0) : t[a].date ? e === new n.DateHandleClass(t[a].date).getTime() && (r = !0) : e === new n.DateHandleClass(t[a]).getTime() && (r = !0);
                else t.from || t.to ? t.from && t.to ? e <= new n.DateHandleClass(t.to).getTime() && e >= new n.DateHandleClass(t.from).getTime() && (r = !0) : t.from ? e >= new n.DateHandleClass(t.from).getTime() && (r = !0) : t.to && e <= new n.DateHandleClass(t.to).getTime() && (r = !0) : t.date ? r = e === new n.DateHandleClass(t.date).getTime() : "function" == typeof t && (r = t(new n.DateHandleClass(e)));
                return r
            }, e.prototype.daysInMonth = function(e) { var t = new this.DateHandleClass(e); return new this.DateHandleClass(t.getFullYear(), t.getMonth() + 1, 0).getDate() }, e.prototype.renderMonths = function(e) { return this.params.renderMonths ? this.params.renderMonths.call(this, e) : ('\n    <div class="calendar-months-wrapper">\n    ' + this.renderMonth(e, "prev") + "\n    " + this.renderMonth(e) + "\n    " + this.renderMonth(e, "next") + "\n    </div>\n  ").trim() }, e.prototype.renderMonth = function(e, t) {
                var c = this,
                    d = c.params,
                    a = c.value;
                if (d.renderMonth) return d.renderMonth.call(c, e, t);
                var n = new c.DateHandleClass(e),
                    u = n.getFullYear(),
                    h = n.getMonth();
                "next" === t && (n = 11 === h ? new c.DateHandleClass(u + 1, 0) : new c.DateHandleClass(u, h + 1, 1)), "prev" === t && (n = 0 === h ? new c.DateHandleClass(u - 1, 11) : new c.DateHandleClass(u, h - 1, 1)), "next" !== t && "prev" !== t || (h = n.getMonth(), u = n.getFullYear());
                var f, m, v = [],
                    g = (new c.DateHandleClass).setHours(0, 0, 0, 0),
                    b = d.minDate ? new c.DateHandleClass(d.minDate).getTime() : null,
                    y = d.maxDate ? new c.DateHandleClass(d.maxDate).getTime() : null,
                    w = c.daysInMonth(new c.DateHandleClass(n.getFullYear(), n.getMonth()).getTime() - 864e6),
                    C = c.daysInMonth(n),
                    x = 6 === d.firstDay ? 0 : 1,
                    r = "",
                    $ = d.firstDay - 1 + 0,
                    E = new c.DateHandleClass(n.getFullYear(), n.getMonth()).getDay();
                if (0 === E && (E = 7), a && a.length)
                    for (var i = 0; i < a.length; i += 1) v.push(new c.DateHandleClass(a[i]).setHours(0, 0, 0, 0));
                for (var k = 1; k <= 6; k += 1) {
                    for (var S = "", o = function(e) {
                            var a = void 0,
                                t = ($ += 1) - E,
                                n = "";
                            1 === k && 1 === e && x < t && 1 !== d.firstDay && (t = ($ -= 7) - E);
                            var r = 6 < e - 1 + d.firstDay ? e - 1 - 7 + d.firstDay : e - 1 + d.firstDay;
                            (a = t < 0 ? (t = w + t + 1, n += " calendar-day-prev", new c.DateHandleClass(h - 1 < 0 ? u - 1 : u, h - 1 < 0 ? 11 : h - 1, t).getTime()) : C < (t += 1) ? (t -= C, n += " calendar-day-next", new c.DateHandleClass(11 < h + 1 ? u + 1 : u, 11 < h + 1 ? 0 : h + 1, t).getTime()) : new c.DateHandleClass(u, h, t).getTime()) === g && (n += " calendar-day-today"), d.rangePicker && 2 === v.length ? a >= v[0] && a <= v[1] && (n += " calendar-day-selected") : 0 <= v.indexOf(a) && (n += " calendar-day-selected"), 0 <= d.weekendDays.indexOf(r) && (n += " calendar-day-weekend");
                            var i = "";
                            if (m = !1, d.events && c.dateInRange(a, d.events) && (m = !0), m && (n += " calendar-day-has-events", i = '\n            <span class="calendar-day-events">\n              <span class="calendar-day-event"></span>\n            </span>\n          ', Array.isArray(d.events))) {
                                var o = [];
                                d.events.forEach(function(e) {
                                    var t = e.color || "";
                                    o.indexOf(t) < 0 && c.dateInRange(a, e) && o.push(t)
                                }), i = '\n              <span class="calendar-day-events">\n                ' + o.map(function(e) { return ('\n                  <span class="calendar-day-event" style="' + (e ? "background-color: " + e : "") + '"></span>\n                ').trim() }).join("") + "\n              </span>\n            "
                            }
                            if (d.rangesClasses)
                                for (var s = 0; s < d.rangesClasses.length; s += 1) c.dateInRange(a, d.rangesClasses[s].range) && (n += " " + d.rangesClasses[s].cssClass);
                            f = !1, (b && a < b || y && y < a) && (f = !0), d.disabled && c.dateInRange(a, d.disabled) && (f = !0), f && (n += " calendar-day-disabled");
                            var l = (a = new c.DateHandleClass(a)).getFullYear(),
                                p = a.getMonth();
                            S += ('\n          <div data-year="' + l + '" data-month="' + p + '" data-day="' + t + '" class="calendar-day' + n + '" data-date="' + l + "-" + p + "-" + t + '">\n            <span class="calendar-day-number">' + t + i + "</span>\n          </div>").trim()
                        }, s = 1; s <= 7; s += 1) o(s);
                    r += '<div class="calendar-row">' + S + "</div>"
                }
                return r = '<div class="calendar-month" data-year="' + u + '" data-month="' + h + '">' + r + "</div>"
            }, e.prototype.renderWeekHeader = function() {
                if (this.params.renderWeekHeader) return this.params.renderWeekHeader.call(this);
                for (var e = this.params, t = "", a = 0; a < 7; a += 1) {
                    var n = 6 < a + e.firstDay ? a - 7 + e.firstDay : a + e.firstDay;
                    t += '<div class="calendar-week-day">' + e.dayNamesShort[n] + "</div>"
                }
                return ('\n    <div class="calendar-week-header">\n    ' + t + "\n    </div>\n  ").trim()
            }, e.prototype.renderMonthSelector = function() {
                var e, t = this.app;
                if (this.params.renderMonthSelector) return this.params.renderMonthSelector.call(this);
                this.inline && 0 === this.$containerEl.closest(".theme-dark").length ? e = !0 : 0 === t.root.closest(".theme-dark").length && (e = !0);
                var a = "md" === t.theme && e ? "color-black" : "";
                return ('\n    <div class="calendar-month-selector">\n    <a href="#" class="link icon-only calendar-prev-month-button">\n      <i class="icon icon-prev ' + a + '"></i>\n    </a>\n    <span class="current-month-value"></span>\n    <a href="#" class="link icon-only calendar-next-month-button">\n      <i class="icon icon-next ' + a + '"></i>\n    </a>\n    </div>\n  ').trim()
            }, e.prototype.renderYearSelector = function() {
                var e, t = this.app;
                if (this.params.renderYearSelector) return this.params.renderYearSelector.call(this);
                this.inline && 0 === this.$containerEl.closest(".theme-dark").length ? e = !0 : 0 === t.root.closest(".theme-dark").length && (e = !0);
                var a = "md" === t.theme && e ? "color-black" : "";
                return ('\n    <div class="calendar-year-selector">\n    <a href="#" class="link icon-only calendar-prev-year-button">\n      <i class="icon icon-prev ' + a + '"></i>\n    </a>\n    <span class="current-year-value"></span>\n    <a href="#" class="link icon-only calendar-next-year-button">\n      <i class="icon icon-next ' + a + '"></i>\n    </a>\n    </div>\n  ').trim()
            }, e.prototype.renderHeader = function() { return this.params.renderHeader ? this.params.renderHeader.call(this) : ('\n    <div class="calendar-header">\n    <div class="calendar-selected-date">' + this.params.headerPlaceholder + "</div>\n    </div>\n  ").trim() }, e.prototype.renderFooter = function() { var e = this.app; return this.params.renderFooter ? this.params.renderFooter.call(this) : ('\n    <div class="calendar-footer">\n    <a href="#" class="' + ("md" === e.theme ? "button" : "link") + ' calendar-close sheet-close popover-close">' + this.params.toolbarCloseText + "</a>\n    </div>\n  ").trim() }, e.prototype.renderToolbar = function() { return this.params.renderToolbar ? this.params.renderToolbar.call(this, this) : ('\n    <div class="toolbar no-shadow">\n    <div class="toolbar-inner">\n      ' + this.renderMonthSelector() + "\n      " + this.renderYearSelector() + "\n    </div>\n    </div>\n  ").trim() }, e.prototype.renderInline = function() {
                var e = this.params,
                    t = e.cssClass,
                    a = e.toolbar,
                    n = e.header,
                    r = e.footer,
                    i = e.rangePicker,
                    o = e.weekHeader,
                    s = this.value,
                    l = s && s.length ? s[0] : (new this.DateHandleClass).setHours(0, 0, 0);
                return ('\n    <div class="calendar calendar-inline ' + (i ? "calendar-range" : "") + " " + (t || "") + '">\n    ' + (n ? this.renderHeader() : "") + "\n    " + (a ? this.renderToolbar() : "") + "\n    " + (o ? this.renderWeekHeader() : "") + '\n    <div class="calendar-months">\n      ' + this.renderMonths(l) + "\n    </div>\n    " + (r ? this.renderFooter() : "") + "\n    </div>\n  ").trim()
            }, e.prototype.renderCustomModal = function() {
                var e = this.params,
                    t = e.cssClass,
                    a = e.toolbar,
                    n = e.header,
                    r = e.footer,
                    i = e.rangePicker,
                    o = e.weekHeader,
                    s = this.value,
                    l = s && s.length ? s[0] : (new this.DateHandleClass).setHours(0, 0, 0);
                return ('\n    <div class="calendar calendar-modal ' + (i ? "calendar-range" : "") + " " + (t || "") + '">\n    ' + (n ? this.renderHeader() : "") + "\n    " + (a ? this.renderToolbar() : "") + "\n    " + (o ? this.renderWeekHeader() : "") + '\n    <div class="calendar-months">\n      ' + this.renderMonths(l) + "\n    </div>\n    " + (r ? this.renderFooter() : "") + "\n    </div>\n  ").trim()
            }, e.prototype.renderSheet = function() {
                var e = this.params,
                    t = e.cssClass,
                    a = e.toolbar,
                    n = e.header,
                    r = e.footer,
                    i = e.rangePicker,
                    o = e.weekHeader,
                    s = this.value,
                    l = s && s.length ? s[0] : (new this.DateHandleClass).setHours(0, 0, 0);
                return ('\n    <div class="sheet-modal calendar calendar-sheet ' + (i ? "calendar-range" : "") + " " + (t || "") + '">\n    ' + (n ? this.renderHeader() : "") + "\n    " + (a ? this.renderToolbar() : "") + "\n    " + (o ? this.renderWeekHeader() : "") + '\n    <div class="sheet-modal-inner calendar-months">\n      ' + this.renderMonths(l) + "\n    </div>\n    " + (r ? this.renderFooter() : "") + "\n    </div>\n  ").trim()
            }, e.prototype.renderPopover = function() {
                var e = this.params,
                    t = e.cssClass,
                    a = e.toolbar,
                    n = e.header,
                    r = e.footer,
                    i = e.rangePicker,
                    o = e.weekHeader,
                    s = this.value,
                    l = s && s.length ? s[0] : (new this.DateHandleClass).setHours(0, 0, 0);
                return ('\n    <div class="popover calendar-popover">\n    <div class="popover-inner">\n      <div class="calendar ' + (i ? "calendar-range" : "") + " " + (t || "") + '">\n      ' + (n ? this.renderHeader() : "") + "\n      " + (a ? this.renderToolbar() : "") + "\n      " + (o ? this.renderWeekHeader() : "") + '\n      <div class="calendar-months">\n        ' + this.renderMonths(l) + "\n      </div>\n      " + (r ? this.renderFooter() : "") + "\n      </div>\n    </div>\n    </div>\n  ").trim()
            }, e.prototype.render = function() { var e = this.params; if (e.render) return e.render.call(this); if (this.inline) return this.renderInline(); var t = e.openIn; return "auto" === t && (t = this.isPopover() ? "popover" : "sheet"), "popover" === t ? this.renderPopover() : "sheet" === t ? this.renderSheet() : this.renderCustomModal() }, e.prototype.onOpen = function() {
                var a = this,
                    e = a.initialized,
                    t = a.$el,
                    n = a.app,
                    r = a.$inputEl,
                    i = a.inline,
                    o = a.value,
                    s = a.params;
                a.closing = !1, a.opened = !0, a.opening = !0, a.attachCalendarEvents();
                var l = !o && s.value;
                e ? o && a.setValue(o, 0) : o ? a.setValue(o, 0) : s.value && a.setValue(a.normalizeValues(s.value), 0), a.updateCurrentMonthYear(), a.monthsTranslate = 0, a.setMonthsTranslate(), l ? a.updateValue() : s.header && o && a.updateValue(!0), !i && r.length && "md" === n.theme && r.trigger("focus"), a.initialized = !0, a.$months.each(function(e, t) { a.emit("local::monthAdd calendarMonthAdd", t) }), t && t.trigger("calendar:open", a), r && r.trigger("calendar:open", a), a.emit("local::open calendarOpen", a)
            }, e.prototype.onOpened = function() { this.opening = !1, this.$el && this.$el.trigger("calendar:opened", this), this.$inputEl && this.$inputEl.trigger("calendar:opened", this), this.emit("local::opened calendarOpened", this) }, e.prototype.onClose = function() {
                var e = this,
                    t = e.app;
                e.opening = !1, e.closing = !0, e.$inputEl && "md" === t.theme && e.$inputEl.trigger("blur"), e.detachCalendarEvents && e.detachCalendarEvents(), e.$el && e.$el.trigger("calendar:close", e), e.$inputEl && e.$inputEl.trigger("calendar:close", e), e.emit("local::close calendarClose", e)
            }, e.prototype.onClosed = function() {
                var e = this;
                e.opened = !1, e.closing = !1, e.inline || Utils.nextTick(function() { e.modal && e.modal.el && e.modal.destroy && (e.params.routableModals || e.modal.destroy()), delete e.modal }), e.$el && e.$el.trigger("calendar:closed", e), e.$inputEl && e.$inputEl.trigger("calendar:closed", e), e.emit("local::closed calendarClosed", e)
            }, e.prototype.open = function() {
                var e, t = this,
                    a = t.app,
                    n = t.opened,
                    r = t.inline,
                    i = t.$inputEl,
                    o = t.params;
                if (!n) {
                    if (r) return t.$el = $(t.render()), (t.$el[0].f7Calendar = t).$wrapperEl = t.$el.find(".calendar-months-wrapper"), t.$months = t.$wrapperEl.find(".calendar-month"), t.$containerEl.append(t.$el), t.onOpen(), void t.onOpened();
                    var s = o.openIn;
                    "auto" === s && (s = t.isPopover() ? "popover" : "sheet");
                    var l = t.render(),
                        p = { targetEl: i, scrollToEl: t.params.scrollToInput ? i : void 0, content: l, backdrop: !0 === t.params.backdrop || "popover" === s && !1 !== a.params.popover.backdrop && !1 !== t.params.backdrop, closeByBackdropClick: t.params.closeByBackdropClick, on: { open: function() { t.modal = this, t.$el = "popover" === s ? this.$el.find(".calendar") : this.$el, t.$wrapperEl = t.$el.find(".calendar-months-wrapper"), t.$months = t.$wrapperEl.find(".calendar-month"), t.$el[0].f7Calendar = t, "customModal" === s && $(t.$el).find(".calendar-close").once("click", function() { t.close() }), t.onOpen() }, opened: function() { t.onOpened() }, close: function() { t.onClose() }, closed: function() { t.onClosed() } } };
                    t.params.routableModals ? t.view.router.navigate({ url: t.url, route: (e = { path: t.url }, e[s] = p, e) }) : (t.modal = a[s].create(p), t.modal.open())
                }
            }, e.prototype.close = function() {
                var e = this.opened,
                    t = this.inline;
                if (e) return t ? (this.onClose(), void this.onClosed()) : void(this.params.routableModals ? this.view.router.back() : this.modal.close())
            }, e.prototype.init = function() { var e = this; if (e.initInput(), e.inline) return e.open(), void e.emit("local::init calendarInit", e);!e.initialized && e.params.value && e.setValue(e.normalizeValues(e.params.value)), e.$inputEl && e.attachInputEvents(), e.params.closeByOutsideClick && e.attachHtmlEvents(), e.emit("local::init calendarInit", e) }, e.prototype.destroy = function() {
                var e = this;
                if (!e.destroyed) {
                    var t = e.$el;
                    e.emit("local::beforeDestroy calendarBeforeDestroy", e), t && t.trigger("calendar:beforedestroy", e), e.close(), e.$inputEl && e.detachInputEvents(), e.params.closeByOutsideClick && e.detachHtmlEvents(), t && t.length && delete e.$el[0].f7Calendar, Utils.deleteProps(e), e.destroyed = !0
                }
            }, e
        }(Framework7Class),
        Calendar$1 = { name: "calendar", static: { Calendar: Calendar }, create: function() { this.calendar = ConstructorMethods({ defaultSelector: ".calendar", constructor: Calendar, app: this, domProp: "f7Calendar" }), this.calendar.close = function(e) { void 0 === e && (e = ".calendar"); var t = $(e); if (0 !== t.length) { var a = t[0].f7Calendar;!a || a && !a.opened || a.close() } } }, params: { calendar: { calendarType: "gregorian", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], firstDay: 1, weekendDays: [0, 6], jalali: { monthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"], monthNamesShort: ["فَر", "اُر", "خُر", "تیر", "مُر", "شَه", "مهر", "آب", "آذر", "دی", "بَه", "اِس"], dayNames: ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"], dayNamesShort: ["1ش", "۲ش", "۳ش", "۴ش", "۵ش", "ج", "ش"], firstDay: 6, weekendDays: [5] }, multiple: !1, rangePicker: !1, rangePickerMinDays: 1, rangePickerMaxDays: 0, dateFormat: "yyyy-mm-dd", direction: "horizontal", minDate: null, maxDate: null, disabled: null, events: null, rangesClasses: null, touchMove: !0, animate: !0, closeOnSelect: !1, monthSelector: !0, yearSelector: !0, weekHeader: !0, value: null, containerEl: null, openIn: "auto", formatValue: null, inputEl: null, inputReadOnly: !0, closeByOutsideClick: !0, scrollToInput: !0, header: !1, headerPlaceholder: "Select date", footer: !1, toolbar: !0, toolbarCloseText: "Done", cssClass: null, routableModals: !0, view: null, url: "date/", backdrop: null, closeByBackdropClick: !0, renderWeekHeader: null, renderMonths: null, renderMonth: null, renderMonthSelector: null, renderYearSelector: null, renderHeader: null, renderFooter: null, renderToolbar: null, renderInline: null, renderPopover: null, renderSheet: null, render: null } } };

    function pickerColumn(e, t) {
        var s = this,
            a = s.app,
            n = $(e),
            r = n.index(),
            l = s.cols[r];
        if (!l.divider) {
            var p, i, o, c, d;
            l.$el = n, l.el = n[0], l.$itemsEl = l.$el.find(".picker-items"), l.items = l.$itemsEl.find(".picker-item"), l.replaceValues = function(e, t) { l.detachEvents(), l.values = e, l.displayValues = t, l.$itemsEl.html(s.renderColumn(l, !0)), l.items = l.$itemsEl.find(".picker-item"), l.calcSize(), l.setValue(l.values[0], 0, !0), l.attachEvents() }, l.calcSize = function() {
                s.params.rotateEffect && (l.$el.removeClass("picker-column-absolute"), l.width || l.$el.css({ width: "" }));
                var n = 0,
                    e = l.$el[0].offsetHeight;
                p = l.items[0].offsetHeight, i = p * l.items.length, o = e / 2 - i + p / 2, c = e / 2 - p / 2, l.width && (n = l.width, parseInt(n, 10) === n && (n += "px"), l.$el.css({ width: n })), s.params.rotateEffect && (l.width || (l.items.each(function(e, t) {
                    var a = $(t).children("span");
                    n = Math.max(n, a[0].offsetWidth)
                }), l.$el.css({ width: n + 2 + "px" })), l.$el.addClass("picker-column-absolute"))
            }, l.setValue = function(e, t, a) {
                void 0 === t && (t = "");
                var n = l.$itemsEl.find('.picker-item[data-picker-value="' + e + '"]').index();
                if (void 0 !== n && -1 !== n) {
                    var r = -n * p + c;
                    l.$itemsEl.transition(t), l.$itemsEl.transform("translate3d(0," + r + "px,0)"), s.params.updateValuesOnMomentum && l.activeIndex && l.activeIndex !== n && (Utils.cancelAnimationFrame(d), l.$itemsEl.transitionEnd(function() { Utils.cancelAnimationFrame(d) }), k()), l.updateItems(n, r, t, a)
                }
            }, l.updateItems = function(e, o, t, a) {
                void 0 === o && (o = Utils.getTranslate(l.$itemsEl[0], "y")), void 0 === e && (e = -Math.round((o - c) / p)), e < 0 && (e = 0), e >= l.items.length && (e = l.items.length - 1);
                var n = l.activeIndex;
                l.activeIndex = e, l.$itemsEl.find(".picker-item-selected").removeClass("picker-item-selected"), l.items.transition(t);
                var r = l.items.eq(e).addClass("picker-item-selected").transform("");
                s.params.rotateEffect && l.items.each(function(e, t) {
                    var a = $(t),
                        n = (a.index() * p - (c - o)) / p,
                        r = Math.ceil(l.height / p / 2) + 1,
                        i = -18 * n;
                    180 < i && (i = 180), i < -180 && (i = -180), Math.abs(n) > r ? a.addClass("picker-item-far") : a.removeClass("picker-item-far"), a.transform("translate3d(0, " + (-o + c) + "px, " + (s.needsOriginFix ? -110 : 0) + "px) rotateX(" + i + "deg)")
                }), (a || void 0 === a) && (l.value = r.attr("data-picker-value"), l.displayValue = l.displayValues ? l.displayValues[e] : l.value, n !== e && (l.onChange && l.onChange(s, l.value, l.displayValue), s.updateValue()))
            };
            var u, h, f, m, v, g, b, y, w, C, x = !0,
                E = !!a.support.passiveListener && { passive: !1, capture: !1 };
            l.attachEvents = function() { l.$el.on(a.touchEvents.start, S, E), a.on("touchmove:active", T), a.on("touchend:passive", M), l.items.on("click", P) }, l.detachEvents = function() { l.$el.off(a.touchEvents.start, S, E), a.off("touchmove:active", T), a.off("touchend:passive", M), l.items.off("click", P) }, l.init = function() { l.calcSize(), l.$itemsEl.transform("translate3d(0," + c + "px,0)").transition(0), 0 === r && l.$el.addClass("picker-column-first"), r === s.cols.length - 1 && l.$el.addClass("picker-column-last"), t && l.updateItems(0, c, 0), l.attachEvents() }, l.destroy = function() { l.detachEvents() }, l.init()
        }

        function k() { d = Utils.requestAnimationFrame(function() { l.updateItems(void 0, void 0, 0), k() }) }

        function S(e) { h || u || (e.preventDefault(), u = !0, f = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, m = f, v = (new Date).getTime(), x = !0, g = Utils.getTranslate(l.$itemsEl[0], "y"), y = g) }

        function T(e) { u && (e.preventDefault(), x = !1, m = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, h || (Utils.cancelAnimationFrame(d), h = !0, g = Utils.getTranslate(l.$itemsEl[0], "y"), y = g, l.$itemsEl.transition(0)), b = void 0, (y = g + (m - f)) < o && (y = o - Math.pow(o - y, .8), b = "min"), c < y && (y = c + Math.pow(y - c, .8), b = "max"), l.$itemsEl.transform("translate3d(0," + y + "px,0)"), l.updateItems(void 0, y, 0, s.params.updateValuesOnTouchmove), C = y - w || y, w = y) }

        function M() {
            if (u && h) {
                var e;
                h = u = !1, l.$itemsEl.transition(""), b && ("min" === b ? l.$itemsEl.transform("translate3d(0," + o + "px,0)") : l.$itemsEl.transform("translate3d(0," + c + "px,0)")), e = 300 < (new Date).getTime() - v ? y : y + C * s.params.momentumRatio, e = Math.max(Math.min(e, c), o);
                var t = -Math.floor((e - c) / p);
                s.params.freeMode || (e = -t * p + c), l.$itemsEl.transform("translate3d(0," + parseInt(e, 10) + "px,0)"), l.updateItems(t, e, "", !0), s.params.updateValuesOnMomentum && (k(), l.$itemsEl.transitionEnd(function() { Utils.cancelAnimationFrame(d) })), setTimeout(function() { x = !0 }, 100)
            } else h = u = !1
        }

        function P() {
            if (x) {
                Utils.cancelAnimationFrame(d);
                var e = $(this).attr("data-picker-value");
                l.setValue(e)
            }
        }
    }
    var Picker = function(c) {
            function e(e, t) {
                void 0 === t && (t = {}), c.call(this, t, [e]);
                var a, n, r, i = this;
                if (i.params = Utils.extend({}, e.params.picker, t), i.params.containerEl && 0 === (a = $(i.params.containerEl)).length) return i;

                function o() { i.resizeCols() }

                function s() { i.open() }

                function l(e) { e.preventDefault() }

                function p(e) {
                    var t = $(e.target);
                    i.isPopover() || i.opened && !i.closing && (t.closest('[class*="backdrop"]').length || (n && 0 < n.length ? t[0] !== n[0] && 0 === t.closest(".sheet-modal").length && i.close() : 0 === $(e.target).closest(".sheet-modal").length && i.close()))
                }
                return i.params.inputEl && (n = $(i.params.inputEl)), n && (r = n.parents(".view").length && n.parents(".view")[0].f7View), r || (r = e.views.main), Utils.extend(i, { app: e, $containerEl: a, containerEl: a && a[0], inline: a && 0 < a.length, needsOriginFix: e.device.ios || 0 <= win.navigator.userAgent.toLowerCase().indexOf("safari") && win.navigator.userAgent.toLowerCase().indexOf("chrome") < 0 && !e.device.android, cols: [], $inputEl: n, inputEl: n && n[0], initialized: !1, opened: !1, url: i.params.url, view: r }), Utils.extend(i, { attachResizeEvent: function() { e.on("resize", o) }, detachResizeEvent: function() { e.off("resize", o) }, attachInputEvents: function() { i.$inputEl.on("click", s), i.params.inputReadOnly && i.$inputEl.on("focus mousedown", l) }, detachInputEvents: function() { i.$inputEl.off("click", s), i.params.inputReadOnly && i.$inputEl.off("focus mousedown", l) }, attachHtmlEvents: function() { e.on("click", p) }, detachHtmlEvents: function() { e.off("click", p) } }), i.init(), i
            }
            return c && (e.__proto__ = c), ((e.prototype = Object.create(c && c.prototype)).constructor = e).prototype.initInput = function() { this.$inputEl && this.params.inputReadOnly && this.$inputEl.prop("readOnly", !0) }, e.prototype.resizeCols = function() {
                if (this.opened)
                    for (var e = 0; e < this.cols.length; e += 1) this.cols[e].divider || (this.cols[e].calcSize(), this.cols[e].setValue(this.cols[e].value, 0, !1))
            }, e.prototype.isPopover = function() {
                var e = this.app,
                    t = this.modal,
                    a = this.params;
                if ("sheet" === a.openIn) return !1;
                if (t && "popover" !== t.type) return !1;
                if (!this.inline && this.inputEl) { if ("popover" === a.openIn) return !0; if (e.device.ios) return !!e.device.ipad; if (768 <= e.width) return !0 }
                return !1
            }, e.prototype.formatValue = function() {
                var e = this.value,
                    t = this.displayValue;
                return this.params.formatValue ? this.params.formatValue.call(this, e, t) : e.join(" ")
            }, e.prototype.setValue = function(e, t) { var a = 0; if (0 === this.cols.length) return this.value = e, void this.updateValue(e); for (var n = 0; n < this.cols.length; n += 1) this.cols[n] && !this.cols[n].divider && (this.cols[n].setValue(e[a], t), a += 1) }, e.prototype.getValue = function() { return this.value }, e.prototype.updateValue = function(e) {
                var t, a = this,
                    n = e || [],
                    r = [];
                if (0 === a.cols.length)
                    for (var i = a.params.cols.filter(function(e) { return !e.divider }), o = 0; o < i.length; o += 1) void 0 !== (t = i[o]).displayValues && void 0 !== t.values && -1 !== t.values.indexOf(n[o]) ? r.push(t.displayValues[t.values.indexOf(n[o])]) : r.push(n[o]);
                else
                    for (var s = 0; s < a.cols.length; s += 1) a.cols[s].divider || (n.push(a.cols[s].value), r.push(a.cols[s].displayValue));
                0 <= n.indexOf(void 0) || (a.value = n, a.displayValue = r, a.emit("local::change pickerChange", a, a.value, a.displayValue), a.inputEl && (a.$inputEl.val(a.formatValue()), a.$inputEl.trigger("change")))
            }, e.prototype.initColumn = function(e, t) { pickerColumn.call(this, e, t) }, e.prototype.destroyColumn = function(e) {
                var t = $(e).index();
                this.cols[t] && this.cols[t].destroy && this.cols[t].destroy()
            }, e.prototype.renderToolbar = function() { return this.params.renderToolbar ? this.params.renderToolbar.call(this, this) : ('\n      <div class="toolbar no-shadow">\n        <div class="toolbar-inner">\n          <div class="left"></div>\n          <div class="right">\n            <a href="#" class="link sheet-close popover-close">' + this.params.toolbarCloseText + "</a>\n          </div>\n        </div>\n      </div>\n    ").trim() }, e.prototype.renderColumn = function(a, e) { var t, n, r = "picker-column " + (a.textAlign ? "picker-column-" + a.textAlign : "") + " " + (a.cssClass || ""); return t = a.divider ? '\n        <div class="' + r + ' picker-column-divider">' + a.content + "</div>\n      " : '\n        <div class="' + r + '">\n          <div class="picker-items">' + (n = a.values.map(function(e, t) { return '\n        <div class="picker-item" data-picker-value="' + e + '">\n          <span>' + (a.displayValues ? a.displayValues[t] : e) + "</span>\n        </div>\n      " }).join("")) + "</div>\n        </div>\n      ", e ? n.trim() : t.trim() }, e.prototype.renderInline = function() {
                var t = this,
                    e = t.params;
                return ('\n      <div class="picker picker-inline ' + (e.rotateEffect ? "picker-3d" : "") + " " + (e.cssClass || "") + '">\n        ' + (e.toolbar ? t.renderToolbar() : "") + '\n        <div class="picker-columns">\n          ' + t.cols.map(function(e) { return t.renderColumn(e) }).join("") + '\n          <div class="picker-center-highlight"></div>\n        </div>\n      </div>\n    ').trim()
            }, e.prototype.renderSheet = function() {
                var t = this,
                    e = t.params;
                return ('\n      <div class="sheet-modal picker picker-sheet ' + (e.rotateEffect ? "picker-3d" : "") + " " + (e.cssClass || "") + '">\n        ' + (e.toolbar ? t.renderToolbar() : "") + '\n        <div class="sheet-modal-inner picker-columns">\n          ' + t.cols.map(function(e) { return t.renderColumn(e) }).join("") + '\n          <div class="picker-center-highlight"></div>\n        </div>\n      </div>\n    ').trim()
            }, e.prototype.renderPopover = function() {
                var t = this,
                    e = t.params;
                return ('\n      <div class="popover picker-popover">\n        <div class="popover-inner">\n          <div class="picker ' + (e.rotateEffect ? "picker-3d" : "") + " " + (e.cssClass || "") + '">\n            ' + (e.toolbar ? t.renderToolbar() : "") + '\n            <div class="picker-columns">\n              ' + t.cols.map(function(e) { return t.renderColumn(e) }).join("") + '\n              <div class="picker-center-highlight"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ').trim()
            }, e.prototype.render = function() { return this.params.render ? this.params.render.call(this) : this.inline ? this.renderInline() : this.isPopover() ? this.renderPopover() : this.renderSheet() }, e.prototype.onOpen = function() {
                var n = this,
                    r = n.initialized,
                    e = n.$el,
                    t = n.app,
                    a = n.$inputEl,
                    i = n.inline,
                    o = n.value,
                    s = n.params;
                n.opened = !0, n.closing = !1, n.opening = !0, n.attachResizeEvent(), e.find(".picker-column").each(function(e, t) {
                    var a = !0;
                    (!r && s.value || r && o) && (a = !1), n.initColumn(t, a)
                }), r ? o && n.setValue(o, 0) : o ? n.setValue(o, 0) : s.value && n.setValue(s.value, 0), !i && a.length && "md" === t.theme && a.trigger("focus"), n.initialized = !0, e && e.trigger("picker:open", n), a && a.trigger("picker:open", n), n.emit("local::open pickerOpen", n)
            }, e.prototype.onOpened = function() { this.opening = !1, this.$el && this.$el.trigger("picker:opened", this), this.$inputEl && this.$inputEl.trigger("picker:opened", this), this.emit("local::opened pickerOpened", this) }, e.prototype.onClose = function() {
                var e = this,
                    t = e.app;
                e.opening = !1, e.closing = !0, e.detachResizeEvent(), e.cols.forEach(function(e) { e.destroy && e.destroy() }), e.$inputEl && "md" === t.theme && e.$inputEl.trigger("blur"), e.$el && e.$el.trigger("picker:close", e), e.$inputEl && e.$inputEl.trigger("picker:close", e), e.emit("local::close pickerClose", e)
            }, e.prototype.onClosed = function() {
                var e = this;
                e.opened = !1, e.closing = !1, e.inline || Utils.nextTick(function() { e.modal && e.modal.el && e.modal.destroy && (e.params.routableModals || e.modal.destroy()), delete e.modal }), e.$el && e.$el.trigger("picker:closed", e), e.$inputEl && e.$inputEl.trigger("picker:closed", e), e.emit("local::closed pickerClosed", e)
            }, e.prototype.open = function() {
                var e, t = this,
                    a = t.app,
                    n = t.opened,
                    r = t.inline,
                    i = t.$inputEl;
                if (!n) {
                    if (0 === t.cols.length && t.params.cols.length && t.params.cols.forEach(function(e) { t.cols.push(e) }), r) return t.$el = $(t.render()), (t.$el[0].f7Picker = t).$containerEl.append(t.$el), t.onOpen(), void t.onOpened();
                    var o = t.isPopover(),
                        s = o ? "popover" : "sheet",
                        l = { targetEl: i, scrollToEl: t.params.scrollToInput ? i : void 0, content: t.render(), backdrop: o, on: { open: function() { t.modal = this, t.$el = o ? this.$el.find(".picker") : this.$el, (t.$el[0].f7Picker = t).onOpen() }, opened: function() { t.onOpened() }, close: function() { t.onClose() }, closed: function() { t.onClosed() } } };
                    t.params.routableModals ? t.view.router.navigate({ url: t.url, route: (e = { path: t.url }, e[s] = l, e) }) : (t.modal = a[s].create(l), t.modal.open())
                }
            }, e.prototype.close = function() {
                var e = this.opened,
                    t = this.inline;
                if (e) return t ? (this.onClose(), void this.onClosed()) : void(this.params.routableModals ? this.view.router.back() : this.modal.close())
            }, e.prototype.init = function() { var e = this; if (e.initInput(), e.inline) return e.open(), void e.emit("local::init pickerInit", e);!e.initialized && e.params.value && e.setValue(e.params.value), e.$inputEl && e.attachInputEvents(), e.params.closeByOutsideClick && e.attachHtmlEvents(), e.emit("local::init pickerInit", e) }, e.prototype.destroy = function() {
                var e = this;
                if (!e.destroyed) {
                    var t = e.$el;
                    e.emit("local::beforeDestroy pickerBeforeDestroy", e), t && t.trigger("picker:beforedestroy", e), e.close(), e.$inputEl && e.detachInputEvents(), e.params.closeByOutsideClick && e.detachHtmlEvents(), t && t.length && delete e.$el[0].f7Picker, Utils.deleteProps(e), e.destroyed = !0
                }
            }, e
        }(Framework7Class),
        Picker$1 = { name: "picker", static: { Picker: Picker }, create: function() { this.picker = ConstructorMethods({ defaultSelector: ".picker", constructor: Picker, app: this, domProp: "f7Picker" }), this.picker.close = function(e) { void 0 === e && (e = ".picker"); var t = $(e); if (0 !== t.length) { var a = t[0].f7Picker;!a || a && !a.opened || a.close() } } }, params: { picker: { updateValuesOnMomentum: !1, updateValuesOnTouchmove: !0, rotateEffect: !1, momentumRatio: 7, freeMode: !1, cols: [], containerEl: null, openIn: "auto", formatValue: null, inputEl: null, inputReadOnly: !0, closeByOutsideClick: !0, scrollToInput: !0, toolbar: !0, toolbarCloseText: "Done", cssClass: null, routableModals: !0, view: null, url: "select/", renderToolbar: null, render: null } } },
        InfiniteScroll = {
            handleScroll: function(e, t) {
                var a, n = $(e),
                    r = n[0].scrollTop,
                    i = n[0].scrollHeight,
                    o = n[0].offsetHeight,
                    s = n[0].getAttribute("data-infinite-distance"),
                    l = n.find(".virtual-list"),
                    p = n.hasClass("infinite-scroll-top");
                if (s || (s = 50), "string" == typeof s && 0 <= s.indexOf("%") && (s = parseInt(s, 10) / 100 * o), o < s && (s = o), p) r < s && (n.trigger("infinite", t), this.emit("infinite", n[0], t));
                else if (i - s <= r + o) {
                    if (0 < l.length && (a = l.eq(-1)[0].f7VirtualList) && !a.reachEnd && !a.params.updatableScroll) return;
                    n.trigger("infinite", t), this.emit("infinite", n[0], t)
                }
            },
            create: function(e) {
                var t = $(e),
                    a = this;
                t.on("scroll", function(e) { a.infiniteScroll.handle(this, e) })
            },
            destroy: function(e) { $(e).off("scroll") }
        },
        InfiniteScroll$1 = {
            name: "infiniteScroll",
            create: function() { Utils.extend(this, { infiniteScroll: { handle: InfiniteScroll.handleScroll.bind(this), create: InfiniteScroll.create.bind(this), destroy: InfiniteScroll.destroy.bind(this) } }) },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".infinite-scroll-content").each(function(e, t) { a.infiniteScroll.create(t) })
                },
                tabBeforeRemove: function(e) {
                    var t = $(e),
                        a = this;
                    t.find(".infinite-scroll-content").each(function(e, t) { a.infiniteScroll.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".infinite-scroll-content").each(function(e, t) { a.infiniteScroll.create(t) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".infinite-scroll-content").each(function(e, t) { a.infiniteScroll.destroy(t) })
                }
            }
        },
        PullToRefresh = function(o) {
            function e(t, s) {
                o.call(this, {}, [t]);
                var l = this,
                    p = $(s),
                    c = p.find(".ptr-preloader");
                l.$el = p, l.el = p[0], l.app = t, l.useModulesParams({});
                var d, u, h, f = "md" === t.theme;
                l.done = function() { return (f ? c : p).transitionEnd(function() { p.removeClass("ptr-transitioning ptr-pull-up ptr-pull-down"), p.trigger("ptr:done"), l.emit("local::done ptrDone", p[0]) }), p.removeClass("ptr-refreshing").addClass("ptr-transitioning"), l }, l.refresh = function() { return p.hasClass("ptr-refreshing") || (p.addClass("ptr-transitioning ptr-refreshing"), p.trigger("ptr:refresh", l.done), l.emit("local::refresh ptrRefresh", p[0], l.done)), l };
                var m, v, g, b, y, w, C, x, E = {},
                    k = !1,
                    S = !1,
                    T = 0,
                    e = !1,
                    a = p.parents(".page");

                function n(e) {
                    if (u) { if ("android" !== Device.os) return; if ("targetTouches" in e && 1 < e.targetTouches.length) return }
                    p.hasClass("ptr-refreshing") || $(e.target).closest(".sortable-handler").length || (u = !(x = h = !1), y = m = void 0, "touchstart" === e.type && (d = e.targetTouches[0].identifier), E.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, E.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY)
                }

                function r(e) {
                    if (u) {
                        var t, a, n;
                        if ("touchmove" === e.type) {
                            if (d && e.touches)
                                for (var r = 0; r < e.touches.length; r += 1) e.touches[r].identifier === d && (n = e.touches[r]);
                            n || (n = e.targetTouches[0]), t = n.pageX, a = n.pageY
                        } else t = e.pageX, a = e.pageY;
                        if (t && a)
                            if (void 0 === m && (m = !!(m || Math.abs(a - E.y) > Math.abs(t - E.x))), m) {
                                if (b = p[0].scrollTop, void 0 === y && 0 !== b && (y = !0), !h) {
                                    var i, o;
                                    if (p.removeClass("ptr-transitioning"), $(e.target).parents().each(function(e, t) { t === s && (i = !0), i || t.scrollHeight > t.offsetHeight && (o = !0) }), o || b > p[0].offsetHeight) return void(u = !1);
                                    C && 0 <= (w = p.attr("data-ptr-distance")).indexOf("%") && (w = p[0].offsetHeight * parseInt(w, 10) / 100), T = p.hasClass("ptr-refreshing") ? w : 0, S = !(p[0].scrollHeight !== p[0].offsetHeight && "ios" === Device.os && !f)
                                }
                                h = !0, 0 < (v = a - E.y) && b <= 0 || b < 0 ? ("ios" === Device.os && 7 < parseInt(Device.osVersion.split(".")[0], 10) && 0 === b && !y && (S = !0), S && (e.preventDefault(), g = Math.pow(v, .85) + T, f ? c.transform("translate3d(0," + g + "px,0)").find(".ptr-arrow").transform("rotate(" + (v / 66 * 180 + 100) + "deg)") : p.transform("translate3d(0," + g + "px,0)")), S && Math.pow(v, .85) > w || !S && 2 * w <= v ? (k = !0, p.addClass("ptr-pull-up").removeClass("ptr-pull-down")) : (k = !1, p.removeClass("ptr-pull-up").addClass("ptr-pull-down")), x || (p.trigger("ptr:pullstart"), l.emit("local::pullStart ptrPullStart", p[0]), x = !0), p.trigger("ptr:pullmove", { event: e, scrollTop: b, translate: g, touchesDiff: v }), l.emit("local::pullMove ptrPullMove", p[0], { event: e, scrollTop: b, translate: g, touchesDiff: v })) : (x = !1, p.removeClass("ptr-pull-up ptr-pull-down"), k = !1)
                            } else u = !1
                    }
                }

                function i(e) {
                    if ("touchend" === e.type && e.changedTouches && 0 < e.changedTouches.length && d && e.changedTouches[0].identifier !== d) return h = m = u = !1, void(d = null);
                    u && h ? (g && (p.addClass("ptr-transitioning"), g = 0), f ? c.transform("").find(".ptr-arrow").transform("") : p.transform(""), k ? (p.addClass("ptr-refreshing"), p.trigger("ptr:refresh", l.done), l.emit("local::refresh ptrRefresh", p[0], l.done)) : p.removeClass("ptr-pull-down"), h = u = !1, x && (p.trigger("ptr:pullend"), l.emit("local::pullEnd ptrPullEnd", p[0]))) : h = u = !1
                }
                return (0 < a.find(".navbar").length || 0 < a.parents(".view").children(".navbar").length) && (e = !0), a.hasClass("no-navbar") && (e = !1), e || p.addClass("ptr-no-navbar"), p.attr("data-ptr-distance") ? C = !0 : w = f ? 66 : 44, a.length && p.length && ((p[0].f7PullToRefresh = l).attachEvents = function() {
                    var e = !!Support.passiveListener && { passive: !0 };
                    p.on(t.touchEvents.start, n, e), t.on("touchmove", r), t.on("touchend:passive", i)
                }, l.detachEvents = function() {
                    var e = !!Support.passiveListener && { passive: !0 };
                    p.off(t.touchEvents.start, n, e), t.off("touchmove", r), t.off("touchend:passive", i)
                }, l.useModules(), l.init()), l
            }
            return o && (e.__proto__ = o), ((e.prototype = Object.create(o && o.prototype)).constructor = e).prototype.init = function() { this.attachEvents() }, e.prototype.destroy = function() {
                var e = this;
                e.emit("local::beforeDestroy ptrBeforeDestroy", e), e.$el.trigger("ptr:beforedestroy", e), delete e.el.f7PullToRefresh, e.detachEvents(), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        PullToRefresh$1 = {
            name: "pullToRefresh",
            create: function() {
                var a = this;
                a.ptr = Utils.extend(ConstructorMethods({ defaultSelector: ".ptr-content", constructor: PullToRefresh, app: a, domProp: "f7PullToRefresh" }), { done: function(e) { var t = a.ptr.get(e); if (t) return t.done() }, refresh: function(e) { var t = a.ptr.get(e); if (t) return t.refresh() } })
            },
            static: { PullToRefresh: PullToRefresh },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".ptr-content").each(function(e, t) { a.ptr.create(t) })
                },
                tabBeforeRemove: function(e) {
                    var t = $(e),
                        a = this;
                    t.find(".ptr-content").each(function(e, t) { a.ptr.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".ptr-content").each(function(e, t) { a.ptr.create(t) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".ptr-content").each(function(e, t) { a.ptr.destroy(t) })
                }
            }
        },
        Lazy = {
            destroy: function(e) {
                var t = $(e).closest(".page");
                t.length && t[0].f7LazyDestroy && t[0].f7LazyDestroy()
            },
            create: function(e) {
                var t = this,
                    a = $(e).closest(".page").eq(0),
                    n = a.find(".lazy");
                if (0 !== n.length || a.hasClass("lazy")) {
                    var r = t.params.lazy.placeholder;
                    !1 !== r && n.each(function(e, t) { $(t).attr("data-src") && !$(t).attr("src") && $(t).attr("src", r) });
                    var i = [],
                        o = !1;
                    a[0].f7LazyDestroy || (a[0].f7LazyDestroy = function() { a[0].f7LazyAttached = !1, delete a[0].f7LazyAttached, a.off("lazy", l), a.off("scroll", l, !0), a.find(".tab").off("tab:mounted tab:show", l), t.off("resize", l) }), a[0].f7LazyAttached || (a[0].f7LazyAttached = !0, a.on("lazy", l), a.on("scroll", l, !0), a.find(".tab").on("tab:mounted tab:show", l), t.on("resize", l)), l()
                }

                function s(e) { 0 <= i.indexOf(e) && i.splice(i.indexOf(e), 1), o = !1, t.params.lazy.sequential && 0 < i.length && (o = !0, t.lazy.loadImage(i[0], s)) }

                function l() { t.lazy.load(a, function(e) { t.params.lazy.sequential && o ? i.indexOf(e) < 0 && i.push(e) : (o = !0, t.lazy.loadImage(e, s)) }) }
            },
            isInViewport: function(e) {
                var t = e.getBoundingClientRect(),
                    a = this.params.lazy.threshold || 0;
                return t.top >= 0 - a && t.left >= 0 - a && t.top <= this.height + a && t.left <= this.width + a
            },
            loadImage: function(e, t) {
                var a = this,
                    n = $(e),
                    r = n.attr("data-background"),
                    i = r || n.attr("data-src");
                if (i) {
                    var o = new win.Image;
                    o.onload = function() { n.removeClass("lazy").addClass("lazy-loaded"), r ? n.css("background-image", "url(" + i + ")") : n.attr("src", i), t && t(e), n.trigger("lazy:loaded"), a.emit("lazyLoaded", n[0]) }, o.onerror = function() { n.removeClass("lazy").addClass("lazy-loaded"), r ? n.css("background-image", "url(" + (a.params.lazy.placeholder || "") + ")") : n.attr("src", a.params.lazy.placeholder || ""), t && t(e), n.trigger("lazy:error"), a.emit("lazyError", n[0]) }, o.src = i, n.removeAttr("data-src").removeAttr("data-background"), n.trigger("lazy:load"), a.emit("lazyLoad", n[0])
                }
            },
            load: function(e, a) {
                var n = this,
                    t = $(e);
                t.hasClass("page") || (t = t.parents(".page").eq(0)), 0 !== t.length && t.find(".lazy").each(function(e, t) { 0 < $(t).parents(".tab:not(.tab-active)").length || n.lazy.isInViewport(t) && (a ? a(t) : n.lazy.loadImage(t)) })
            }
        },
        Lazy$1 = {
            name: "lazy",
            params: { lazy: { placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXCwsK592mkAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==", threshold: 0, sequential: !0 } },
            create: function() { Utils.extend(this, { lazy: { create: Lazy.create.bind(this), destroy: Lazy.destroy.bind(this), loadImage: Lazy.loadImage.bind(this), load: Lazy.load.bind(this), isInViewport: Lazy.isInViewport.bind(this) } }) },
            on: {
                pageInit: function(e) {
                    (0 < e.$el.find(".lazy").length || e.$el.hasClass("lazy")) && this.lazy.create(e.$el)
                },
                pageAfterIn: function(e) {
                    (0 < e.$el.find(".lazy").length || e.$el.hasClass("lazy")) && this.lazy.create(e.$el)
                },
                pageBeforeRemove: function(e) {
                    (0 < e.$el.find(".lazy").length || e.$el.hasClass("lazy")) && this.lazy.destroy(e.$el)
                },
                tabMounted: function(e) {
                    var t = $(e);
                    (0 < t.find(".lazy").length || t.hasClass("lazy")) && this.lazy.create(t)
                },
                tabBeforeRemove: function(e) {
                    var t = $(e);
                    (0 < t.find(".lazy").length || t.hasClass("lazy")) && this.lazy.destroy(t)
                }
            }
        },
        DataTable = function(l) {
            function e(e, t) {
                void 0 === t && (t = {}), l.call(this, t, [e]);
                var r = this,
                    a = {};
                r.useModulesParams(a), r.params = Utils.extend(a, t);
                var i = $(r.params.el);
                if (0 !== i.length) { if (r.$el = i, r.el = i[0], r.$el[0].f7DataTable) { var n = r.$el[0].f7DataTable; return r.destroy(), n } return r.$el[0].f7DataTable = r, Utils.extend(r, { collapsible: i.hasClass("data-table-collapsible"), $headerEl: i.find(".data-table-header"), $headerSelectedEl: i.find(".data-table-header-selected") }), r.attachEvents = function() { r.$el.on("change", '.checkbox-cell input[type="checkbox"]', o), r.$el.find("thead .sortable-cell").on("click", s) }, r.detachEvents = function() { r.$el.off("change", '.checkbox-cell input[type="checkbox"]', o), r.$el.find("thead .sortable-cell").off("click", s) }, r.useModules(), r.init(), r }

                function o(e) {
                    if (!e.detail || !e.detail.sentByF7DataTable) {
                        var t = $(this),
                            a = t[0].checked,
                            n = t.parents("td,th").index();
                        0 < t.parents("thead").length ? (0 === n && i.find("tbody tr")[a ? "addClass" : "removeClass"]("data-table-row-selected"), i.find("tbody tr td:nth-child(" + (n + 1) + ") input").prop("checked", a).trigger("change", { sentByF7DataTable: !0 })) : (0 === n && t.parents("tr")[a ? "addClass" : "removeClass"]("data-table-row-selected"), a ? i.find("tbody .checkbox-cell:nth-child(" + (n + 1) + ') input[type="checkbox"]:checked').length === i.find("tbody tr").length && i.find("thead .checkbox-cell:nth-child(" + (n + 1) + ') input[type="checkbox"]').prop("checked", !0).trigger("change", { sentByF7DataTable: !0 }) : i.find("thead .checkbox-cell:nth-child(" + (n + 1) + ') input[type="checkbox"]').prop("checked", !1)), r.checkSelectedHeader()
                    }
                }

                function s() {
                    var e, t = $(this),
                        a = t.hasClass("sortable-cell-active"),
                        n = t.hasClass("sortable-desc") ? "desc" : "asc";
                    a ? (e = "desc" === n ? "asc" : "desc", t.removeClass("sortable-desc sortable-asc").addClass("sortable-" + e)) : (i.find("thead .sortable-cell-active").removeClass("sortable-cell-active"), t.addClass("sortable-cell-active"), e = n), t.trigger("datatable:sort", e), r.emit("local::sort dataTableSort", r, e)
                }
            }
            return l && (e.__proto__ = l), ((e.prototype = Object.create(l && l.prototype)).constructor = e).prototype.setCollapsibleLabels = function() {
                var i = this;
                i.collapsible && i.$el.find("tbody td:not(.checkbox-cell)").each(function(e, t) {
                    var a = $(t),
                        n = a.index(),
                        r = a.attr("data-collapsible-title");
                    r || "" === r || a.attr("data-collapsible-title", i.$el.find("thead th").eq(n).text())
                })
            }, e.prototype.checkSelectedHeader = function() {
                if (0 < this.$headerEl.length && 0 < this.$headerSelectedEl.length) {
                    var e = this.$el.find("tbody .checkbox-cell input:checked").length;
                    this.$el[0 < e ? "addClass" : "removeClass"]("data-table-has-checked"), this.$headerSelectedEl.find(".data-table-selected-count").text(e)
                }
            }, e.prototype.init = function() { this.attachEvents(), this.setCollapsibleLabels(), this.checkSelectedHeader() }, e.prototype.destroy = function() {
                var e = this;
                e.$el.trigger("datatable:beforedestroy", e), e.emit("local::beforeDestroy dataTableBeforeDestroy", e), e.attachEvents(), e.$el[0] && (e.$el[0].f7DataTable = null, delete e.$el[0].f7DataTable), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        DataTable$1 = {
            name: "dataTable",
            static: { DataTable: DataTable },
            create: function() { this.dataTable = ConstructorMethods({ defaultSelector: ".data-table", constructor: DataTable, app: this, domProp: "f7DataTable" }) },
            on: {
                tabBeforeRemove: function(e) {
                    var a = this;
                    $(e).find(".data-table-init").each(function(e, t) { a.dataTable.destroy(t) })
                },
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".data-table-init").each(function(e, t) { a.dataTable.create({ el: t }) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".data-table-init").each(function(e, t) { a.dataTable.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".data-table-init").each(function(e, t) { a.dataTable.create({ el: t }) })
                }
            },
            vnode: {
                "data-table-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.dataTable.create({ el: t })
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        this.dataTable.destroy(t)
                    }
                }
            }
        },
        Fab = {
            morphOpen: function(e, t) {
                var a = this,
                    r = $(e),
                    i = $(t);
                if (0 !== i.length) {
                    i.transition(0).addClass("fab-morph-target-visible");
                    var o = { width: i[0].offsetWidth, height: i[0].offsetHeight, offset: i.offset(), borderRadius: i.css("border-radius"), zIndex: i.css("z-index") },
                        s = { width: r[0].offsetWidth, height: r[0].offsetHeight, offset: r.offset(), translateX: Utils.getTranslate(r[0], "x"), translateY: Utils.getTranslate(r[0], "y") };
                    r[0].f7FabMorphData = { $targetEl: i, target: o, fab: s };
                    var n = s.offset.left + s.width / 2 - (o.offset.left + o.width / 2) - s.translateX,
                        l = s.offset.top + s.height / 2 - (o.offset.top + o.height / 2) - s.translateY,
                        p = o.width / s.width,
                        c = o.height / s.height,
                        d = Math.ceil(parseInt(o.borderRadius, 10) / Math.max(p, c));
                    0 < d && (d += 2), r[0].f7FabMorphResizeHandler = function() {
                        r.transition(0).transform(""), i.transition(0), o.width = i[0].offsetWidth, o.height = i[0].offsetHeight, o.offset = i.offset(), s.offset = r.offset();
                        var e = s.offset.left + s.width / 2 - (o.offset.left + o.width / 2) - s.translateX,
                            t = s.offset.top + s.height / 2 - (o.offset.top + o.height / 2) - s.translateY,
                            a = o.width / s.width,
                            n = o.height / s.height;
                        r.transform("translate3d(" + -e + "px, " + -t + "px, 0) scale(" + a + ", " + n + ")")
                    }, i.css("opacity", 0).transform("scale(" + 1 / p + ", " + 1 / c + ")"), r.addClass("fab-opened").css("z-index", o.zIndex - 1).transform("translate3d(" + -n + "px, " + -l + "px, 0)"), r.transitionEnd(function() { i.transition(""), Utils.nextFrame(function() { i.css("opacity", 1).transform("scale(1,1)"), r.transform("translate3d(" + -n + "px, " + -l + "px, 0) scale(" + p + ", " + c + ")").css("border-radius", d + "px").css("box-shadow", "none") }), a.on("resize", r[0].f7FabMorphResizeHandler), 0 < i.parents(".page-content").length && i.parents(".page-content").on("scroll", r[0].f7FabMorphResizeHandler) })
                }
            },
            morphClose: function(e) {
                var t = $(e),
                    a = t[0].f7FabMorphData;
                if (a) {
                    var n = a.$targetEl,
                        r = a.target,
                        i = a.fab;
                    if (0 !== n.length) {
                        var o = i.offset.left + i.width / 2 - (r.offset.left + r.width / 2) - i.translateX,
                            s = i.offset.top + i.height / 2 - (r.offset.top + r.height / 2) - i.translateY,
                            l = r.width / i.width,
                            p = r.height / i.height;
                        this.off("resize", t[0].f7FabMorphResizeHandler), 0 < n.parents(".page-content").length && n.parents(".page-content").off("scroll", t[0].f7FabMorphResizeHandler), n.css("opacity", 0).transform("scale(" + 1 / l + ", " + 1 / p + ")"), t.transition("").css("box-shadow", "").css("border-radius", "").transform("translate3d(" + -o + "px, " + -s + "px, 0)"), t.transitionEnd(function() { t.css("z-index", "").removeClass("fab-opened").transform(""), Utils.nextFrame(function() { t.transitionEnd(function() { n.removeClass("fab-morph-target-visible").css("opacity", "").transform("").transition("") }) }) })
                    }
                }
            },
            open: function(e, t) {
                var a = $(e).eq(0),
                    n = a.find(".fab-buttons");
                if (a.length && !a.hasClass("fab-opened") && (n.length || a.hasClass("fab-morph"))) {
                    if (this.fab.openedEl) {
                        if (this.fab.openedEl === a[0]) return;
                        this.fab.close(this.fab.openedEl)
                    }
                    this.fab.openedEl = a[0], a.hasClass("fab-morph") ? this.fab.morphOpen(a, t || a.attr("data-morph-to")) : a.addClass("fab-opened"), a.trigger("fab:open")
                }
            },
            close: function(e) {
                void 0 === e && (e = ".fab-opened");
                var t = $(e).eq(0),
                    a = t.find(".fab-buttons");
                t.length && t.hasClass("fab-opened") && (a.length || t.hasClass("fab-morph")) && (this.fab.openedEl = null, t.hasClass("fab-morph") ? this.fab.morphClose(t) : t.removeClass("fab-opened"), t.trigger("fab:close"))
            },
            toggle: function(e) { $(e).hasClass("fab-opened") ? this.fab.close(e) : this.fab.open(e) }
        },
        Fab$1 = {
            name: "fab",
            create: function() { Utils.extend(this, { fab: { openedEl: null, morphOpen: Fab.morphOpen.bind(this), morphClose: Fab.morphClose.bind(this), open: Fab.open.bind(this), close: Fab.close.bind(this), toggle: Fab.toggle.bind(this) } }) },
            clicks: {
                ".fab > a": function(e) { this.fab.toggle(e.parents(".fab")) },
                ".fab-open": function(e, t) {
                    void 0 === t && (t = {});
                    this.fab.open(t.fab)
                },
                ".fab-close": function(e, t) {
                    void 0 === t && (t = {});
                    this.fab.close(t.fab)
                }
            }
        },
        Searchbar = function(k) {
            function e(e, t) {
                void 0 === t && (t = {}), k.call(this, t, [e]);
                var a = this,
                    n = { el: void 0, inputEl: void 0, inputEvents: "change input compositionend", disableButton: !0, disableButtonEl: void 0, backdropEl: void 0, searchContainer: void 0, searchItem: "li", searchIn: void 0, searchGroup: ".list-group", searchGroupTitle: ".item-divider, .list-group-title", ignore: ".searchbar-ignore", foundEl: ".searchbar-found", notFoundEl: ".searchbar-not-found", hideOnEnableEl: ".searchbar-hide-on-enable", hideOnSearchEl: ".searchbar-hide-on-search", backdrop: !0, removeDiacritics: !0, customSearch: !1, hideDividers: !0, hideGroups: !0, disableOnBackdropClick: !0, expandable: !1 };
                a.useModulesParams(n), a.params = Utils.extend(n, t);
                var r, i, o, s, l, p, c, d, u, h, f = $(a.params.el);
                if (0 === f.length) return a;
                if (f[0].f7Searchbar) return f[0].f7Searchbar;
                if (f[0].f7Searchbar = a, 0 < f.parents(".page").length) r = f.parents(".page");
                else if (0 < (i = f.parents(".navbar-inner")).length)
                    if (i[0].f7Page) r = i[0].f7Page.$el;
                    else {
                        var m = f.parents(".view").find(".page-current");
                        m[0] && m[0].f7Page && m[0].f7Page.navbarEl === i[0] && (r = m)
                    }

                function v(e) { e.preventDefault() }

                function g(e) { a.enable(e), a.$el.addClass("searchbar-focused") }

                function b() { a.$el.removeClass("searchbar-focused") }

                function y() {
                    var e = a.$inputEl.val().trim();
                    (a.$searchContainer && 0 < a.$searchContainer.length && (a.params.searchIn || a.isVirtualList || a.params.searchIn === a.params.searchItem) || a.params.customSearch) && a.search(e, !0)
                }

                function w(e, t) { a.$el.trigger("searchbar:clear", t), a.emit("local::clear searchbarClear", a, t) }

                function C(e) { a.disable(e) }

                function x() {!a || a && !a.$el || a.enabled && a.$el.removeClass("searchbar-enabled") }

                function E() {!a || a && !a.$el || a.enabled && a.$el.addClass("searchbar-enabled") }
                return t.foundEl ? o = $(t.foundEl) : "string" == typeof a.params.foundEl && r && (o = r.find(a.params.foundEl)), t.notFoundEl ? s = $(t.notFoundEl) : "string" == typeof a.params.notFoundEl && r && (s = r.find(a.params.notFoundEl)), t.hideOnEnableEl ? l = $(t.hideOnEnableEl) : "string" == typeof a.params.hideOnEnableEl && r && (l = r.find(a.params.hideOnEnableEl)), t.hideOnSearchEl ? p = $(t.hideOnSearchEl) : "string" == typeof a.params.hideOnSearchEl && r && (p = r.find(a.params.hideOnSearchEl)), a.params.backdrop && 0 === (c = a.params.backdropEl ? $(a.params.backdropEl) : r && 0 < r.length ? r.find(".searchbar-backdrop") : f.siblings(".searchbar-backdrop")).length && (c = $('<div class="searchbar-backdrop"></div>'), r && r.length ? 0 < f.parents(r).length && i && 0 === f.parents(i).length ? c.insertBefore(f) : c.insertBefore(r.find(".page-content").eq(0)) : c.insertBefore(f)), a.params.searchContainer && (d = $(a.params.searchContainer)), u = a.params.inputEl ? $(a.params.inputEl) : f.find('input[type="search"]').eq(0), a.params.disableButton && (h = a.params.disableButtonEl ? $(a.params.disableButtonEl) : f.find(".searchbar-disable-button")), Utils.extend(a, { app: e, view: e.views.get(f.parents(".view")), $el: f, el: f[0], $backdropEl: c, backdropEl: c && c[0], $searchContainer: d, searchContainer: d && d[0], $inputEl: u, inputEl: u[0], $disableButtonEl: h, disableButtonEl: h && h[0], disableButtonHasMargin: !1, $pageEl: r, pageEl: r && r[0], $navbarEl: i, navbarEl: i && i[0], $foundEl: o, foundEl: o && o[0], $notFoundEl: s, notFoundEl: s && s[0], $hideOnEnableEl: l, hideOnEnableEl: l && l[0], $hideOnSearchEl: p, hideOnSearchEl: p && p[0], previousQuery: "", query: "", isVirtualList: d && d.hasClass("virtual-list"), virtualList: void 0, enabled: !1, expandable: a.params.expandable || f.hasClass("searchbar-expandable") }), a.attachEvents = function() { f.on("submit", v), a.params.disableButton && a.$disableButtonEl.on("click", C), a.params.disableOnBackdropClick && a.$backdropEl && a.$backdropEl.on("click", C), a.expandable && "ios" === e.theme && a.view && i && a.$pageEl && (a.$pageEl.on("page:beforeout", x), a.$pageEl.on("page:beforein", E)), a.$inputEl.on("focus", g), a.$inputEl.on("blur", b), a.$inputEl.on(a.params.inputEvents, y), a.$inputEl.on("input:clear", w) }, a.detachEvents = function() { f.off("submit", v), a.params.disableButton && a.$disableButtonEl.off("click", C), a.params.disableOnBackdropClick && a.$backdropEl && a.$backdropEl.off("click", C), a.expandable && "ios" === e.theme && a.view && i && a.$pageEl && (a.$pageEl.off("page:beforeout", x), a.$pageEl.off("page:beforein", E)), a.$inputEl.off("focus", g), a.$inputEl.off("blur", b), a.$inputEl.off(a.params.inputEvents, y), a.$inputEl.off("input:clear", w) }, a.useModules(), a.init(), a
            }
            return k && (e.__proto__ = k), ((e.prototype = Object.create(k && k.prototype)).constructor = e).prototype.clear = function(e) { if (!this.query && e && $(e.target).hasClass("searchbar-clear")) return this.disable(), this; var t = this.value; return this.$inputEl.val("").trigger("change").focus(), this.$el.trigger("searchbar:clear", t), this.emit("local::clear searchbarClear", this, t), this }, e.prototype.setDisableButtonMargin = function() {
                if (!this.expandable) {
                    var e = this.app;
                    this.$disableButtonEl.transition(0).show(), this.$disableButtonEl.css("margin-" + (e.rtl ? "left" : "right"), -this.disableButtonEl.offsetWidth + "px"), this._clientLeft = this.$disableButtonEl[0].clientLeft, this.$disableButtonEl.transition(""), this.disableButtonHasMargin = !0
                }
            }, e.prototype.enable = function(e) {
                var t = this;
                if (t.enabled) return t;
                var a = t.app;

                function n() { t.$backdropEl && (t.$searchContainer && t.$searchContainer.length || t.params.customSearch) && !t.$el.hasClass("searchbar-enabled") && !t.query && t.backdropShow(), t.$el.addClass("searchbar-enabled"), (!t.$disableButtonEl || t.$disableButtonEl && 0 === t.$disableButtonEl.length) && t.$el.addClass("searchbar-enabled-no-disable-button"), !t.expandable && t.$disableButtonEl && 0 < t.$disableButtonEl.length && "ios" === a.theme && (t.disableButtonHasMargin || t.setDisableButtonMargin(), t.$disableButtonEl.css("margin-" + (a.rtl ? "left" : "right"), "0px")), t.$hideOnEnableEl && t.$hideOnEnableEl.addClass("hidden-by-searchbar"), t.$el.trigger("searchbar:enable"), t.emit("local::enable searchbarEnable", t) }
                var r = !(t.enabled = !0);
                return !0 === e && doc.activeElement !== t.inputEl && (r = !0), a.device.ios && "ios" === a.theme ? t.expandable ? (r && t.$inputEl.focus(), n()) : (r && t.$inputEl.focus(), !e || "focus" !== e.type && !0 !== e ? n() : Utils.nextTick(function() { n() }, 400)) : (r && t.$inputEl.focus(), "md" === a.theme && t.expandable && t.$el.parents(".page, .view, .navbar-inner").scrollLeft(0), n()), t
            }, e.prototype.disable = function() { var e = this; if (!e.enabled) return e; var t = e.app; return e.$inputEl.val("").trigger("change"), e.$el.removeClass("searchbar-enabled searchbar-focused searchbar-enabled-no-disable-button"), !e.expandable && e.$disableButtonEl && 0 < e.$disableButtonEl.length && "ios" === t.theme && e.$disableButtonEl.css("margin-" + (t.rtl ? "left" : "right"), -e.disableButtonEl.offsetWidth + "px"), e.$backdropEl && (e.$searchContainer && e.$searchContainer.length || e.params.customSearch) && e.backdropHide(), e.enabled = !1, e.$inputEl.blur(), e.$hideOnEnableEl && e.$hideOnEnableEl.removeClass("hidden-by-searchbar"), e.$el.trigger("searchbar:disable"), e.emit("local::disable searchbarDisable", e), e }, e.prototype.toggle = function() { return this.enabled ? this.disable() : this.enable(!0), this }, e.prototype.backdropShow = function() { return this.$backdropEl && this.$backdropEl.addClass("searchbar-backdrop-in"), this }, e.prototype.backdropHide = function() { return this.$backdropEl && this.$backdropEl.removeClass("searchbar-backdrop-in"), this }, e.prototype.search = function(e, t) {
                var l = this;
                if (l.previousQuery = l.query || "", e === l.previousQuery) return l;
                t || (l.enabled || l.enable(), l.$inputEl.val(e), l.$inputEl.trigger("input")), l.query = e, l.value = e;
                var a = l.$searchContainer,
                    n = l.$el,
                    r = l.$foundEl,
                    i = l.$notFoundEl,
                    o = l.$hideOnSearchEl,
                    s = l.isVirtualList;
                if (0 < e.length && o ? o.addClass("hidden-by-searchbar") : o && o.removeClass("hidden-by-searchbar"), (a && a.length && n.hasClass("searchbar-enabled") || l.params.customSearch && n.hasClass("searchbar-enabled")) && (0 === e.length ? l.backdropShow() : l.backdropHide()), l.params.customSearch) return n.trigger("searchbar:search", e, l.previousQuery), l.emit("local::search searchbarSearch", l, e, l.previousQuery), l;
                var p, c = [];
                if (s) {
                    if (l.virtualList = a[0].f7VirtualList, "" === e.trim()) return l.virtualList.resetFilter(), i && i.hide(), r && r.show(), n.trigger("searchbar:search", e, l.previousQuery), l.emit("local::search searchbarSearch", l, e, l.previousQuery), l;
                    if (p = l.params.removeDiacritics ? Utils.removeDiacritics(e) : e, l.virtualList.params.searchAll) c = l.virtualList.params.searchAll(p, l.virtualList.items) || [];
                    else if (l.virtualList.params.searchByItem)
                        for (var d = 0; d < l.virtualList.items.length; d += 1) l.virtualList.params.searchByItem(p, l.virtualList.params.items[d], d) && c.push(d)
                } else {
                    var u;
                    u = l.params.removeDiacritics ? Utils.removeDiacritics(e.trim().toLowerCase()).split(" ") : e.trim().toLowerCase().split(" "), a.find(l.params.searchItem).removeClass("hidden-by-searchbar").each(function(e, t) {
                        var a = $(t),
                            n = [],
                            r = l.params.searchIn ? a.find(l.params.searchIn) : a;
                        l.params.searchIn === l.params.searchItem && (r = a), r.each(function(e, t) {
                            var a = $(t).text().trim().toLowerCase();
                            l.params.removeDiacritics && (a = Utils.removeDiacritics(a)), n.push(a)
                        }), n = n.join(" ");
                        for (var i = 0, o = 0; o < u.length; o += 1) 0 <= n.indexOf(u[o]) && (i += 1);
                        i === u.length || l.params.ignore && a.is(l.params.ignore) ? c.push(a[0]) : a.addClass("hidden-by-searchbar")
                    }), l.params.hideDividers && a.find(l.params.searchGroupTitle).each(function(e, t) {
                        for (var a = $(t), n = a.nextAll(l.params.searchItem), r = !0, i = 0; i < n.length; i += 1) {
                            var o = n.eq(i);
                            if (o.is(l.params.searchGroupTitle)) break;
                            o.hasClass("hidden-by-searchbar") || (r = !1)
                        }
                        var s = l.params.ignore && a.is(l.params.ignore);
                        r && !s ? a.addClass("hidden-by-searchbar") : a.removeClass("hidden-by-searchbar")
                    }), l.params.hideGroups && a.find(l.params.searchGroup).each(function(e, t) {
                        var a = $(t),
                            n = l.params.ignore && a.is(l.params.ignore);
                        0 !== a.find(l.params.searchItem).filter(function(e, t) { return !$(t).hasClass("hidden-by-searchbar") }).length || n ? a.removeClass("hidden-by-searchbar") : a.addClass("hidden-by-searchbar")
                    })
                }
                return 0 === c.length ? (i && i.show(), r && r.hide()) : (i && i.hide(), r && r.show()), s && l.virtualList && l.virtualList.filterItems(c), n.trigger("searchbar:search", e, l.previousQuery, c), l.emit("local::search searchbarSearch", l, e, l.previousQuery, c), l
            }, e.prototype.init = function() { this.attachEvents() }, e.prototype.destroy = function() { this.emit("local::beforeDestroy searchbarBeforeDestroy", this), this.$el.trigger("searchbar:beforedestroy", this), this.detachEvents(), this.$el[0] && (this.$el[0].f7Searchbar = null, delete this.$el[0].f7Searchbar), Utils.deleteProps(this) }, e
        }(Framework7Class),
        Searchbar$1 = {
            name: "searchbar",
            static: { Searchbar: Searchbar },
            create: function() { this.searchbar = ConstructorMethods({ defaultSelector: ".searchbar", constructor: Searchbar, app: this, domProp: "f7Searchbar", addMethods: "clear enable disable toggle search".split(" ") }) },
            on: {
                tabMounted: function(e) {
                    var n = this;
                    $(e).find(".searchbar-init").each(function(e, t) {
                        var a = $(t);
                        n.searchbar.create(Utils.extend(a.dataset(), { el: t }))
                    })
                },
                tabBeforeRemove: function(e) { $(e).find(".searchbar-init").each(function(e, t) { t.f7Searchbar && t.f7Searchbar.destroy && t.f7Searchbar.destroy() }) },
                pageInit: function(e) {
                    var n = this;
                    e.$el.find(".searchbar-init").each(function(e, t) {
                        var a = $(t);
                        n.searchbar.create(Utils.extend(a.dataset(), { el: t }))
                    }), "ios" === n.theme && e.view && e.view.router.separateNavbar && e.$navbarEl && 0 < e.$navbarEl.length && e.$navbarEl.find(".searchbar-init").each(function(e, t) {
                        var a = $(t);
                        n.searchbar.create(Utils.extend(a.dataset(), { el: t }))
                    })
                },
                pageBeforeRemove: function(e) { e.$el.find(".searchbar-init").each(function(e, t) { t.f7Searchbar && t.f7Searchbar.destroy && t.f7Searchbar.destroy() }), "ios" === this.theme && e.view && e.view.router.separateNavbar && e.$navbarEl && 0 < e.$navbarEl.length && e.$navbarEl.find(".searchbar-init").each(function(e, t) { t.f7Searchbar && t.f7Searchbar.destroy && t.f7Searchbar.destroy() }) }
            },
            clicks: {
                ".searchbar-clear": function(e, t) {
                    void 0 === t && (t = {});
                    var a = this.searchbar.get(t.searchbar);
                    a && a.clear()
                },
                ".searchbar-enable": function(e, t) {
                    void 0 === t && (t = {});
                    var a = this.searchbar.get(t.searchbar);
                    a && a.enable(!0)
                },
                ".searchbar-disable": function(e, t) {
                    void 0 === t && (t = {});
                    var a = this.searchbar.get(t.searchbar);
                    a && a.disable()
                },
                ".searchbar-toggle": function(e, t) {
                    void 0 === t && (t = {});
                    var a = this.searchbar.get(t.searchbar);
                    a && a.toggle()
                }
            },
            vnode: {
                "searchbar-init": {
                    insert: function(e) {
                        var t = e.elm,
                            a = $(t);
                        this.searchbar.create(Utils.extend(a.dataset(), { el: t }))
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Searchbar && t.f7Searchbar.destroy && t.f7Searchbar.destroy()
                    }
                }
            }
        },
        Messages = function(i) {
            function e(e, t) {
                void 0 === t && (t = {}), i.call(this, t, [e]);
                var a = { autoLayout: !0, messages: [], newMessagesFirst: !1, scrollMessages: !0, scrollMessagesOnEdge: !0, firstMessageRule: void 0, lastMessageRule: void 0, tailMessageRule: void 0, sameNameMessageRule: void 0, sameHeaderMessageRule: void 0, sameFooterMessageRule: void 0, sameAvatarMessageRule: void 0, customClassMessageRule: void 0, renderMessage: void 0 };
                this.useModulesParams(a), this.params = Utils.extend(a, t);
                var n = $(t.el).eq(0);
                if (0 === n.length) return this;
                if (n[0].f7Messages) return n[0].f7Messages;
                n[0].f7Messages = this;
                var r = n.closest(".page-content").eq(0);
                return Utils.extend(this, { messages: this.params.messages, $el: n, el: n[0], $pageContentEl: r, pageContentEl: r[0] }), this.useModules(), this.init(), this
            }
            return i && (e.__proto__ = i), ((e.prototype = Object.create(i && i.prototype)).constructor = e).prototype.getMessageData = function(e) {
                var t = $(e),
                    a = { name: t.find(".message-name").html(), header: t.find(".message-header").html(), textHeader: t.find(".message-text-header").html(), textFooter: t.find(".message-text-footer").html(), footer: t.find(".message-footer").html(), isTitle: t.hasClass("messages-title"), type: t.hasClass("message-sent") ? "sent" : "received", text: t.find(".message-text").html(), image: t.find(".message-image").html(), imageSrc: t.find(".message-image img").attr("src"), typing: t.hasClass("message-typing") };
                a.isTitle && (a.text = t.html()), a.text && a.textHeader && (a.text = a.text.replace('<div class="message-text-header">' + a.textHeader + "</div>", "")), a.text && a.textFooter && (a.text = a.text.replace('<div class="message-text-footer">' + a.textFooter + "</div>", ""));
                var n = t.find(".message-avatar").css("background-image");
                return "none" !== n && "" !== n || (n = void 0), n = n && "string" == typeof n ? n.replace("url(", "").replace(")", "").replace(/"/g, "").replace(/'/g, "") : void 0, a.avatar = n, a
            }, e.prototype.getMessagesData = function() {
                var a = this,
                    n = [];
                return a.$el.find(".message, .messages-title").each(function(e, t) { n.push(a.getMessageData(t)) }), n
            }, e.prototype.renderMessage = function(e) { var t = Utils.extend({ type: "sent" }, e); return this.params.renderMessage ? this.params.renderMessage.call(this, t) : t.isTitle ? '<div class="messages-title">' + t.text + "</div>" : '\n      <div class="message message-' + t.type + " " + (t.isTyping ? "message-typing" : "") + '">\n        ' + (t.avatar ? '\n        <div class="message-avatar" style="background-image:url(' + t.avatar + ')"></div>\n        ' : "") + '\n        <div class="message-content">\n          ' + (t.name ? '<div class="message-name">' + t.name + "</div>" : "") + "\n          " + (t.header ? '<div class="message-header">' + t.header + "</div>" : "") + '\n          <div class="message-bubble">\n            ' + (t.textHeader ? '<div class="message-text-header">' + t.textHeader + "</div>" : "") + "\n            " + (t.image ? '<div class="message-image">' + t.image + "</div>" : "") + "\n            " + (t.imageSrc && !t.image ? '<div class="message-image"><img src="' + t.imageSrc + '"></div>' : "") + "\n            " + (t.text || t.isTyping ? '<div class="message-text">' + (t.text || "") + (t.isTyping ? '<div class="message-typing-indicator"><div></div><div></div><div></div></div>' : "") + "</div>" : "") + "\n            " + (t.textFooter ? '<div class="message-text-footer">' + t.textFooter + "</div>" : "") + "\n          </div>\n          " + (t.footer ? '<div class="message-footer">' + t.footer + "</div>" : "") + "\n        </div>\n      </div>\n    " }, e.prototype.renderMessages = function(e, t) {
                void 0 === e && (e = this.messages), void 0 === t && (t = this.params.newMessagesFirst ? "prepend" : "append");
                var a = this,
                    n = e.map(function(e) { return a.renderMessage(e) }).join("");
                a.$el[t](n)
            }, e.prototype.isFirstMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.firstMessageRule && (e = this.params).firstMessageRule.apply(e, t) }, e.prototype.isLastMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.lastMessageRule && (e = this.params).lastMessageRule.apply(e, t) }, e.prototype.isTailMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.tailMessageRule && (e = this.params).tailMessageRule.apply(e, t) }, e.prototype.isSameNameMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.sameNameMessageRule && (e = this.params).sameNameMessageRule.apply(e, t) }, e.prototype.isSameHeaderMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.sameHeaderMessageRule && (e = this.params).sameHeaderMessageRule.apply(e, t) }, e.prototype.isSameFooterMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.sameFooterMessageRule && (e = this.params).sameFooterMessageRule.apply(e, t) }, e.prototype.isSameAvatarMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; return !!this.params.sameAvatarMessageRule && (e = this.params).sameAvatarMessageRule.apply(e, t) }, e.prototype.isCustomClassMessage = function() { for (var e, t = [], a = arguments.length; a--;) t[a] = arguments[a]; if (this.params.customClassMessageRule) return (e = this.params).customClassMessageRule.apply(e, t) }, e.prototype.layout = function() {
                var l = this;
                l.$el.find(".message, .messages-title").each(function(e, t) {
                    var a = $(t);
                    l.messages || (l.messages = l.getMessagesData());
                    var n = [],
                        r = l.messages[e],
                        i = l.messages[e - 1],
                        o = l.messages[e + 1];
                    l.isFirstMessage(r, i, o) && n.push("message-first"), l.isLastMessage(r, i, o) && n.push("message-last"), l.isTailMessage(r, i, o) && n.push("message-tail"), l.isSameNameMessage(r, i, o) && n.push("message-same-name"), l.isSameHeaderMessage(r, i, o) && n.push("message-same-header"), l.isSameFooterMessage(r, i, o) && n.push("message-same-footer"), l.isSameAvatarMessage(r, i, o) && n.push("message-same-avatar");
                    var s = l.isCustomClassMessage(r, i, o);
                    s && s.length && ("string" == typeof s && (s = s.split(" ")), s.forEach(function(e) { n.push(e) })), a.removeClass("message-first message-last message-tail message-same-name message-same-header message-same-footer message-same-avatar"), n.forEach(function(e) { a.addClass(e) })
                })
            }, e.prototype.clear = function() { this.messages = [], this.$el.html("") }, e.prototype.removeMessage = function(e, t) { void 0 === t && (t = !0); var a, n, r = this; return "number" == typeof e ? (a = e, n = r.$el.find(".message, .messages-title").eq(a)) : r.messages && 0 <= r.messages.indexOf(e) ? (a = r.messages.indexOf(e), n = r.$el.children().eq(a)) : a = (n = $(e)).index(), 0 === n.length || (n.remove(), r.messages.splice(a, 1), r.params.autoLayout && t && r.layout()), r }, e.prototype.removeMessages = function(e, t) {
                void 0 === t && (t = !0);
                var a = this;
                if (Array.isArray(e)) {
                    var n = [];
                    e.forEach(function(e) { n.push(a.$el.find(".message, .messages-title").eq(e)) }), n.forEach(function(e) { a.removeMessage(e, !1) })
                } else $(e).each(function(e, t) { a.removeMessage(t, !1) });
                return a.params.autoLayout && t && a.layout(), a
            }, e.prototype.addMessage = function() { for (var e, t, a = [], n = arguments.length; n--;) a[n] = arguments[n]; var r, i, o; return "boolean" == typeof a[1] ? (r = (e = a)[0], i = e[1], o = e[2]) : (r = (t = a)[0], o = t[1], i = t[2]), void 0 === i && (i = !0), void 0 === o && (o = this.params.newMessagesFirst ? "prepend" : "append"), this.addMessages([r], i, o) }, e.prototype.addMessages = function() {
                for (var e, t, a = [], n = arguments.length; n--;) a[n] = arguments[n];
                var r, i, o, s = this;
                "boolean" == typeof a[1] ? (r = (e = a)[0], i = e[1], o = e[2]) : (r = (t = a)[0], o = t[1], i = t[2]), void 0 === i && (i = !0), void 0 === o && (o = s.params.newMessagesFirst ? "prepend" : "append");
                var l = s.pageContentEl.scrollHeight,
                    p = s.pageContentEl.offsetHeight,
                    c = s.pageContentEl.scrollTop,
                    d = "",
                    u = s.messages.filter(function(e) { return e.isTyping })[0];
                r.forEach(function(e) { u ? "append" === o ? s.messages.splice(s.messages.indexOf(u), 0, e) : s.messages.splice(s.messages.indexOf(u) + 1, 0, e) : s.messages["append" === o ? "push" : "unshift"](e), d += s.renderMessage(e) });
                var h = $(d);
                if (i && ("append" !== o || s.params.newMessagesFirst || h.addClass("message-appear-from-bottom"), "prepend" === o && s.params.newMessagesFirst && h.addClass("message-appear-from-top")), u ? "append" === o ? h.insertBefore(s.$el.find(".message-typing")) : h.insertAfter(s.$el.find(".message-typing")) : s.$el[o](h), s.params.autoLayout && s.layout(), "prepend" !== o || u || (s.pageContentEl.scrollTop = c + (s.pageContentEl.scrollHeight - l)), s.params.scrollMessages && ("append" === o && !s.params.newMessagesFirst || "prepend" === o && s.params.newMessagesFirst && !u))
                    if (s.params.scrollMessagesOnEdge) {
                        var f = !1;
                        s.params.newMessagesFirst && 0 === c && (f = !0), !s.params.newMessagesFirst && -10 <= c - (l - p) && (f = !0), f && s.scroll(i ? void 0 : 0)
                    } else s.scroll(i ? void 0 : 0);
                return s
            }, e.prototype.showTyping = function(e) { void 0 === e && (e = {}); var t = this.messages.filter(function(e) { return e.isTyping })[0]; return t && this.removeMessage(this.messages.indexOf(t)), this.addMessage(Utils.extend({ type: "received", isTyping: !0 }, e)), this }, e.prototype.hideTyping = function() {
                var a, e;
                if (this.messages.forEach(function(e, t) { e.isTyping && (a = t) }), void 0 !== a && this.$el.find(".message").eq(a).hasClass("message-typing") && (e = !0, this.removeMessage(a)), !e) {
                    var t = this.$el.find(".message-typing");
                    t.length && this.removeMessage(t)
                }
                return this
            }, e.prototype.scroll = function(e, t) {
                void 0 === e && (e = 300);
                var a, n = this.pageContentEl.scrollTop;
                if (void 0 !== t) a = t;
                else if ((a = this.params.newMessagesFirst ? 0 : this.pageContentEl.scrollHeight - this.pageContentEl.offsetHeight) === n) return this;
                return this.$pageContentEl.scrollTop(a, e), this
            }, e.prototype.init = function() {
                var e = this;
                e.messages && 0 !== e.messages.length || (e.messages = e.getMessagesData()), e.params.messages && e.params.messages.length && e.renderMessages(), e.params.autoLayout && e.layout(), e.params.scrollMessages && e.scroll(0)
            }, e.prototype.destroy = function() { this.emit("local::beforeDestroy messagesBeforeDestroy", this), this.$el.trigger("messages:beforedestroy", this), this.$el[0] && (this.$el[0].f7Messages = null, delete this.$el[0].f7Messages), Utils.deleteProps(this) }, e
        }(Framework7Class),
        Messages$1 = {
            name: "messages",
            static: { Messages: Messages },
            create: function() { this.messages = ConstructorMethods({ defaultSelector: ".messages", constructor: Messages, app: this, domProp: "f7Messages", addMethods: "renderMessages layout scroll clear removeMessage removeMessages addMessage addMessages".split(" ") }) },
            on: {
                tabBeforeRemove: function(e) {
                    var a = this;
                    $(e).find(".messages-init").each(function(e, t) { a.messages.destroy(t) })
                },
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".messages-init").each(function(e, t) { a.messages.create({ el: t }) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".messages-init").each(function(e, t) { a.messages.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".messages-init").each(function(e, t) { a.messages.create({ el: t }) })
                }
            },
            vnode: {
                "messages-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.messages.create({ el: t })
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        this.messages.destroy(t)
                    }
                }
            }
        },
        Messagebar = function(g) {
            function e(e, t) {
                void 0 === t && (t = {}), g.call(this, t, [e]);
                var a = this,
                    n = { top: !1, topOffset: 0, bottomOffset: 0, attachments: [], renderAttachments: void 0, renderAttachment: void 0, maxHeight: null, resizePage: !0 };
                a.useModulesParams(n), a.params = Utils.extend(n, t);
                var r = $(a.params.el);
                if (0 === r.length) return a;
                if (r[0].f7Messagebar) return r[0].f7Messagebar;
                r[0].f7Messagebar = a;
                var i, o = r.parents(".page").eq(0),
                    s = o.find(".page-content").eq(0),
                    l = r.find(".messagebar-area");
                i = a.params.textareaEl ? $(a.params.textareaEl) : r.find("textarea");
                var p = r.find(".messagebar-attachments"),
                    c = r.find(".messagebar-sheet");

                function d() { a.params.resizePage && a.resizePage() }

                function u(e) { e.preventDefault() }

                function h(e) {
                    var t = $(this).index();
                    $(e.target).closest(".messagebar-attachment-delete").length ? ($(this).trigger("messagebar:attachmentdelete", t), a.emit("local::attachmentDelete messagebarAttachmentDelete", a, this, t)) : ($(this).trigger("messagebar:attachmentclick", t), a.emit("local::attachmentClick messagebarAttachmentClick", a, this, t))
                }

                function f() { a.checkEmptyState(), a.$el.trigger("messagebar:change"), a.emit("local::change messagebarChange", a) }

                function m() { a.sheetHide(), a.$el.addClass("messagebar-focused"), a.$el.trigger("messagebar:focus"), a.emit("local::focus messagebarFocus", a) }

                function v() { a.$el.removeClass("messagebar-focused"), a.$el.trigger("messagebar:blur"), a.emit("local::blur messagebarBlur", a) }
                return a.params.top && r.addClass("messagebar-top"), Utils.extend(a, { $el: r, el: r[0], $areaEl: l, areaEl: l[0], $textareaEl: i, textareaEl: i[0], $attachmentsEl: p, attachmentsEl: p[0], attachmentsVisible: p.hasClass("messagebar-attachments-visible"), $sheetEl: c, sheetEl: c[0], sheetVisible: c.hasClass("messagebar-sheet-visible"), $pageEl: o, pageEl: o[0], $pageContentEl: s, pageContentEl: s, top: r.hasClass("messagebar-top") || a.params.top, attachments: [] }), a.attachEvents = function() { r.on("textarea:resize", d), r.on("submit", u), r.on("click", ".messagebar-attachment", h), i.on("change input", f), i.on("focus", m), i.on("blur", v), e.on("resize", d) }, a.detachEvents = function() { r.off("textarea:resize", d), r.off("submit", u), r.off("click", ".messagebar-attachment", h), i.off("change input", f), i.off("focus", m), i.off("blur", v), e.off("resize", d) }, a.useModules(), a.init(), a
            }
            return g && (e.__proto__ = g), ((e.prototype = Object.create(g && g.prototype)).constructor = e).prototype.focus = function() { return this.$textareaEl.focus(), this }, e.prototype.blur = function() { return this.$textareaEl.blur(), this }, e.prototype.clear = function() { return this.$textareaEl.val("").trigger("change"), this }, e.prototype.getValue = function() { return this.$textareaEl.val().trim() }, e.prototype.setValue = function(e) { return this.$textareaEl.val(e).trigger("change"), this }, e.prototype.setPlaceholder = function(e) { return this.$textareaEl.attr("placeholder", e), this }, e.prototype.resizePage = function() {
                var e = this,
                    t = e.params,
                    a = e.$el,
                    n = e.top,
                    r = e.$pageEl,
                    i = e.$pageContentEl,
                    o = e.$areaEl,
                    s = e.$textareaEl,
                    l = e.$sheetEl,
                    p = e.$attachmentsEl,
                    c = a[0].offsetHeight,
                    d = t.maxHeight;
                if (n);
                else {
                    var u = parseInt(i.css("padding-bottom"), 10),
                        h = c + t.bottomOffset;
                    if (h !== u && i.length) {
                        var f = parseInt(i.css("padding-top"), 10),
                            m = i[0].scrollHeight,
                            v = i[0].offsetHeight,
                            g = i[0].scrollTop === m - v;
                        d || (d = r[0].offsetHeight - f - l.outerHeight() - p.outerHeight() - parseInt(o.css("margin-top"), 10) - parseInt(o.css("margin-bottom"), 10)), s.css("max-height", d + "px"), i.css("padding-bottom", h + "px"), g && i.scrollTop(i[0].scrollHeight - v), a.trigger("messagebar:resizepage"), e.emit("local::resizePage messagebarResizePage", e)
                    }
                }
            }, e.prototype.checkEmptyState = function() {
                var e = this.$el,
                    t = this.$textareaEl.val().trim();
                t && t.length ? e.addClass("messagebar-with-value") : e.removeClass("messagebar-with-value")
            }, e.prototype.attachmentsCreate = function(e) { void 0 === e && (e = ""); var t = $('<div class="messagebar-attachments">' + e + "</div>"); return t.insertBefore(this.$textareaEl), Utils.extend(this, { $attachmentsEl: t, attachmentsEl: t[0] }), this }, e.prototype.attachmentsShow = function(e) { void 0 === e && (e = ""); return this.$attachmentsEl = this.$el.find(".messagebar-attachments"), 0 === this.$attachmentsEl.length && this.attachmentsCreate(e), this.$el.addClass("messagebar-attachments-visible"), this.attachmentsVisible = !0, this.params.resizePage && this.resizePage(), this }, e.prototype.attachmentsHide = function() { return this.$el.removeClass("messagebar-attachments-visible"), this.attachmentsVisible = !1, this.params.resizePage && this.resizePage(), this }, e.prototype.attachmentsToggle = function() { return this.attachmentsVisible ? this.attachmentsHide() : this.attachmentsShow(), this }, e.prototype.renderAttachment = function(e) { return this.params.renderAttachment ? this.params.renderAttachment.call(this, e) : '\n      <div class="messagebar-attachment">\n        <img src="' + e + '">\n        <span class="messagebar-attachment-delete"></span>\n      </div>\n    ' }, e.prototype.renderAttachments = function() {
                var e, t = this;
                e = t.params.renderAttachments ? t.params.renderAttachments.call(t, t.attachments) : "" + t.attachments.map(function(e) { return t.renderAttachment(e) }).join(""), 0 === t.$attachmentsEl.length ? t.attachmentsCreate(e) : t.$attachmentsEl.html(e)
            }, e.prototype.sheetCreate = function(e) { void 0 === e && (e = ""); var t = $('<div class="messagebar-sheet">' + e + "</div>"); return this.$el.append(t), Utils.extend(this, { $sheetEl: t, sheetEl: t[0] }), this }, e.prototype.sheetShow = function(e) { void 0 === e && (e = ""); return this.$sheetEl = this.$el.find(".messagebar-sheet"), 0 === this.$sheetEl.length && this.sheetCreate(e), this.$el.addClass("messagebar-sheet-visible"), this.sheetVisible = !0, this.params.resizePage && this.resizePage(), this }, e.prototype.sheetHide = function() { return this.$el.removeClass("messagebar-sheet-visible"), this.sheetVisible = !1, this.params.resizePage && this.resizePage(), this }, e.prototype.sheetToggle = function() { return this.sheetVisible ? this.sheetHide() : this.sheetShow(), this }, e.prototype.init = function() { return this.attachEvents(), this.checkEmptyState(), this }, e.prototype.destroy = function() { this.emit("local::beforeDestroy messagebarBeforeDestroy", this), this.$el.trigger("messagebar:beforedestroy", this), this.detachEvents(), this.$el[0] && (this.$el[0].f7Messagebar = null, delete this.$el[0].f7Messagebar), Utils.deleteProps(this) }, e
        }(Framework7Class),
        Messagebar$1 = {
            name: "messagebar",
            static: { Messagebar: Messagebar },
            create: function() { this.messagebar = ConstructorMethods({ defaultSelector: ".messagebar", constructor: Messagebar, app: this, domProp: "f7Messagebar", addMethods: "clear getValue setValue setPlaceholder resizePage focus blur attachmentsCreate attachmentsShow attachmentsHide attachmentsToggle renderAttachments sheetCreate sheetShow sheetHide sheetToggle".split(" ") }) },
            on: {
                tabBeforeRemove: function(e) {
                    var a = this;
                    $(e).find(".messagebar-init").each(function(e, t) { a.messagebar.destroy(t) })
                },
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".messagebar-init").each(function(e, t) { a.messagebar.create(Utils.extend({ el: t }, $(t).dataset())) })
                },
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".messagebar-init").each(function(e, t) { a.messagebar.destroy(t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".messagebar-init").each(function(e, t) { a.messagebar.create(Utils.extend({ el: t }, $(t).dataset())) })
                }
            },
            vnode: {
                "messagebar-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.messagebar.create(Utils.extend({ el: t }, $(t).dataset()))
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        this.messagebar.destroy(t)
                    }
                }
            }
        };

    function updateSize() {
        var e, t, a = this.$el;
        e = void 0 !== this.params.width ? this.params.width : a[0].clientWidth, t = void 0 !== this.params.height ? this.params.height : a[0].clientHeight, 0 === e && this.isHorizontal() || 0 === t && this.isVertical() || (e = e - parseInt(a.css("padding-left"), 10) - parseInt(a.css("padding-right"), 10), t = t - parseInt(a.css("padding-top"), 10) - parseInt(a.css("padding-bottom"), 10), Utils.extend(this, { width: e, height: t, size: this.isHorizontal() ? e : t }))
    }

    function updateSlides() {
        var e = this,
            t = e.params,
            a = e.$wrapperEl,
            n = e.size,
            r = e.rtlTranslate,
            i = e.wrongRTL,
            o = e.virtual && t.virtual.enabled,
            s = o ? e.virtual.slides.length : e.slides.length,
            l = a.children("." + e.params.slideClass),
            p = o ? e.virtual.slides.length : l.length,
            c = [],
            d = [],
            u = [],
            h = t.slidesOffsetBefore;
        "function" == typeof h && (h = t.slidesOffsetBefore.call(e));
        var f = t.slidesOffsetAfter;
        "function" == typeof f && (f = t.slidesOffsetAfter.call(e));
        var m = e.snapGrid.length,
            v = e.snapGrid.length,
            g = t.spaceBetween,
            b = -h,
            y = 0,
            w = 0;
        if (void 0 !== n) {
            var C, x;
            "string" == typeof g && 0 <= g.indexOf("%") && (g = parseFloat(g.replace("%", "")) / 100 * n), e.virtualSize = -g, r ? l.css({ marginLeft: "", marginTop: "" }) : l.css({ marginRight: "", marginBottom: "" }), 1 < t.slidesPerColumn && (C = Math.floor(p / t.slidesPerColumn) === p / e.params.slidesPerColumn ? p : Math.ceil(p / t.slidesPerColumn) * t.slidesPerColumn, "auto" !== t.slidesPerView && "row" === t.slidesPerColumnFill && (C = Math.max(C, t.slidesPerView * t.slidesPerColumn)));
            for (var $, E = t.slidesPerColumn, k = C / E, S = k - (t.slidesPerColumn * k - p), T = 0; T < p; T += 1) {
                x = 0;
                var M = l.eq(T);
                if (1 < t.slidesPerColumn) {
                    var P = void 0,
                        O = void 0,
                        D = void 0;
                    "column" === t.slidesPerColumnFill ? (D = T - (O = Math.floor(T / E)) * E, (S < O || O === S && D === E - 1) && E <= (D += 1) && (D = 0, O += 1), P = O + D * C / E, M.css({ "-webkit-box-ordinal-group": P, "-moz-box-ordinal-group": P, "-ms-flex-order": P, "-webkit-order": P, order: P })) : O = T - (D = Math.floor(T / k)) * k, M.css("margin-" + (e.isHorizontal() ? "top" : "left"), 0 !== D && t.spaceBetween && t.spaceBetween + "px").attr("data-swiper-column", O).attr("data-swiper-row", D)
                }
                if ("none" !== M.css("display")) {
                    if ("auto" === t.slidesPerView) {
                        var I = win.getComputedStyle(M[0], null),
                            A = M[0].style.transform,
                            B = M[0].style.webkitTransform;
                        A && (M[0].style.transform = "none"), B && (M[0].style.webkitTransform = "none"), x = t.roundLengths ? e.isHorizontal() ? M.outerWidth(!0) : M.outerHeight(!0) : e.isHorizontal() ? parseFloat(I.getPropertyValue("width")) + parseFloat(I.getPropertyValue("margin-left")) + parseFloat(I.getPropertyValue("margin-right")) : parseFloat(I.getPropertyValue("height")) + parseFloat(I.getPropertyValue("margin-top")) + parseFloat(I.getPropertyValue("margin-bottom")), A && (M[0].style.transform = A), B && (M[0].style.webkitTransform = B), t.roundLengths && (x = Math.floor(x))
                    } else x = (n - (t.slidesPerView - 1) * g) / t.slidesPerView, t.roundLengths && (x = Math.floor(x)), l[T] && (e.isHorizontal() ? l[T].style.width = x + "px" : l[T].style.height = x + "px");
                    l[T] && (l[T].swiperSlideSize = x), u.push(x), t.centeredSlides ? (b = b + x / 2 + y / 2 + g, 0 === y && 0 !== T && (b = b - n / 2 - g), 0 === T && (b = b - n / 2 - g), Math.abs(b) < .001 && (b = 0), t.roundLengths && (b = Math.floor(b)), w % t.slidesPerGroup == 0 && c.push(b), d.push(b)) : (t.roundLengths && (b = Math.floor(b)), w % t.slidesPerGroup == 0 && c.push(b), d.push(b), b = b + x + g), e.virtualSize += x + g, y = x, w += 1
                }
            }
            if (e.virtualSize = Math.max(e.virtualSize, n) + f, r && i && ("slide" === t.effect || "coverflow" === t.effect) && a.css({ width: e.virtualSize + t.spaceBetween + "px" }), Support.flexbox && !t.setWrapperSize || (e.isHorizontal() ? a.css({ width: e.virtualSize + t.spaceBetween + "px" }) : a.css({ height: e.virtualSize + t.spaceBetween + "px" })), 1 < t.slidesPerColumn && (e.virtualSize = (x + t.spaceBetween) * C, e.virtualSize = Math.ceil(e.virtualSize / t.slidesPerColumn) - t.spaceBetween, e.isHorizontal() ? a.css({ width: e.virtualSize + t.spaceBetween + "px" }) : a.css({ height: e.virtualSize + t.spaceBetween + "px" }), t.centeredSlides)) {
                $ = [];
                for (var L = 0; L < c.length; L += 1) {
                    var R = c[L];
                    t.roundLengths && (R = Math.floor(R)), c[L] < e.virtualSize + c[0] && $.push(R)
                }
                c = $
            }
            if (!t.centeredSlides) {
                $ = [];
                for (var z = 0; z < c.length; z += 1) {
                    var H = c[z];
                    t.roundLengths && (H = Math.floor(H)), c[z] <= e.virtualSize - n && $.push(H)
                }
                c = $, 1 < Math.floor(e.virtualSize - n) - Math.floor(c[c.length - 1]) && c.push(e.virtualSize - n)
            }
            if (0 === c.length && (c = [0]), 0 !== t.spaceBetween && (e.isHorizontal() ? r ? l.css({ marginLeft: g + "px" }) : l.css({ marginRight: g + "px" }) : l.css({ marginBottom: g + "px" })), t.centerInsufficientSlides) {
                var U = 0;
                if (u.forEach(function(e) { U += e + (t.spaceBetween ? t.spaceBetween : 0) }), (U -= t.spaceBetween) < n) {
                    var N = (n - U) / 2;
                    c.forEach(function(e, t) { c[t] = e - N }), d.forEach(function(e, t) { d[t] = e + N })
                }
            }
            Utils.extend(e, { slides: l, snapGrid: c, slidesGrid: d, slidesSizesGrid: u }), p !== s && e.emit("slidesLengthChange"), c.length !== m && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")), d.length !== v && e.emit("slidesGridLengthChange"), (t.watchSlidesProgress || t.watchSlidesVisibility) && e.updateSlidesOffset()
        }
    }

    function updateAutoHeight(e) {
        var t, a = this,
            n = [],
            r = 0;
        if ("number" == typeof e ? a.setTransition(e) : !0 === e && a.setTransition(a.params.speed), "auto" !== a.params.slidesPerView && 1 < a.params.slidesPerView)
            for (t = 0; t < Math.ceil(a.params.slidesPerView); t += 1) {
                var i = a.activeIndex + t;
                if (i > a.slides.length) break;
                n.push(a.slides.eq(i)[0])
            } else n.push(a.slides.eq(a.activeIndex)[0]);
        for (t = 0; t < n.length; t += 1)
            if (void 0 !== n[t]) {
                var o = n[t].offsetHeight;
                r = r < o ? o : r
            }
        r && a.$wrapperEl.css("height", r + "px")
    }

    function updateSlidesOffset() { for (var e = this.slides, t = 0; t < e.length; t += 1) e[t].swiperSlideOffset = this.isHorizontal() ? e[t].offsetLeft : e[t].offsetTop }

    function updateSlidesProgress(e) {
        void 0 === e && (e = this && this.translate || 0);
        var t = this,
            a = t.params,
            n = t.slides,
            r = t.rtlTranslate;
        if (0 !== n.length) {
            void 0 === n[0].swiperSlideOffset && t.updateSlidesOffset();
            var i = -e;
            r && (i = e), n.removeClass(a.slideVisibleClass), t.visibleSlidesIndexes = [], t.visibleSlides = [];
            for (var o = 0; o < n.length; o += 1) {
                var s = n[o],
                    l = (i + (a.centeredSlides ? t.minTranslate() : 0) - s.swiperSlideOffset) / (s.swiperSlideSize + a.spaceBetween);
                if (a.watchSlidesVisibility) {
                    var p = -(i - s.swiperSlideOffset),
                        c = p + t.slidesSizesGrid[o];
                    (0 <= p && p < t.size || 0 < c && c <= t.size || p <= 0 && c >= t.size) && (t.visibleSlides.push(s), t.visibleSlidesIndexes.push(o), n.eq(o).addClass(a.slideVisibleClass))
                }
                s.progress = r ? -l : l
            }
            t.visibleSlides = $(t.visibleSlides)
        }
    }

    function updateProgress(e) {
        void 0 === e && (e = this && this.translate || 0);
        var t = this,
            a = t.params,
            n = t.maxTranslate() - t.minTranslate(),
            r = t.progress,
            i = t.isBeginning,
            o = t.isEnd,
            s = i,
            l = o;
        o = 0 === n ? i = !(r = 0) : (i = (r = (e - t.minTranslate()) / n) <= 0, 1 <= r), Utils.extend(t, { progress: r, isBeginning: i, isEnd: o }), (a.watchSlidesProgress || a.watchSlidesVisibility) && t.updateSlidesProgress(e), i && !s && t.emit("reachBeginning toEdge"), o && !l && t.emit("reachEnd toEdge"), (s && !i || l && !o) && t.emit("fromEdge"), t.emit("progress", r)
    }

    function updateSlidesClasses() {
        var e, t = this.slides,
            a = this.params,
            n = this.$wrapperEl,
            r = this.activeIndex,
            i = this.realIndex,
            o = this.virtual && a.virtual.enabled;
        t.removeClass(a.slideActiveClass + " " + a.slideNextClass + " " + a.slidePrevClass + " " + a.slideDuplicateActiveClass + " " + a.slideDuplicateNextClass + " " + a.slideDuplicatePrevClass), (e = o ? this.$wrapperEl.find("." + a.slideClass + '[data-swiper-slide-index="' + r + '"]') : t.eq(r)).addClass(a.slideActiveClass), a.loop && (e.hasClass(a.slideDuplicateClass) ? n.children("." + a.slideClass + ":not(." + a.slideDuplicateClass + ')[data-swiper-slide-index="' + i + '"]').addClass(a.slideDuplicateActiveClass) : n.children("." + a.slideClass + "." + a.slideDuplicateClass + '[data-swiper-slide-index="' + i + '"]').addClass(a.slideDuplicateActiveClass));
        var s = e.nextAll("." + a.slideClass).eq(0).addClass(a.slideNextClass);
        a.loop && 0 === s.length && (s = t.eq(0)).addClass(a.slideNextClass);
        var l = e.prevAll("." + a.slideClass).eq(0).addClass(a.slidePrevClass);
        a.loop && 0 === l.length && (l = t.eq(-1)).addClass(a.slidePrevClass), a.loop && (s.hasClass(a.slideDuplicateClass) ? n.children("." + a.slideClass + ":not(." + a.slideDuplicateClass + ')[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(a.slideDuplicateNextClass) : n.children("." + a.slideClass + "." + a.slideDuplicateClass + '[data-swiper-slide-index="' + s.attr("data-swiper-slide-index") + '"]').addClass(a.slideDuplicateNextClass), l.hasClass(a.slideDuplicateClass) ? n.children("." + a.slideClass + ":not(." + a.slideDuplicateClass + ')[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(a.slideDuplicatePrevClass) : n.children("." + a.slideClass + "." + a.slideDuplicateClass + '[data-swiper-slide-index="' + l.attr("data-swiper-slide-index") + '"]').addClass(a.slideDuplicatePrevClass))
    }

    function updateActiveIndex(e) {
        var t, a = this,
            n = a.rtlTranslate ? a.translate : -a.translate,
            r = a.slidesGrid,
            i = a.snapGrid,
            o = a.params,
            s = a.activeIndex,
            l = a.realIndex,
            p = a.snapIndex,
            c = e;
        if (void 0 === c) {
            for (var d = 0; d < r.length; d += 1) void 0 !== r[d + 1] ? n >= r[d] && n < r[d + 1] - (r[d + 1] - r[d]) / 2 ? c = d : n >= r[d] && n < r[d + 1] && (c = d + 1) : n >= r[d] && (c = d);
            o.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0)
        }
        if ((t = 0 <= i.indexOf(n) ? i.indexOf(n) : Math.floor(c / o.slidesPerGroup)) >= i.length && (t = i.length - 1), c !== s) {
            var u = parseInt(a.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
            Utils.extend(a, { snapIndex: t, realIndex: u, previousIndex: s, activeIndex: c }), a.emit("activeIndexChange"), a.emit("snapIndexChange"), l !== u && a.emit("realIndexChange"), a.emit("slideChange")
        } else t !== p && (a.snapIndex = t, a.emit("snapIndexChange"))
    }

    function updateClickedSlide(e) {
        var t = this,
            a = t.params,
            n = $(e.target).closest("." + a.slideClass)[0],
            r = !1;
        if (n)
            for (var i = 0; i < t.slides.length; i += 1) t.slides[i] === n && (r = !0);
        if (!n || !r) return t.clickedSlide = void 0, void(t.clickedIndex = void 0);
        t.clickedSlide = n, t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt($(n).attr("data-swiper-slide-index"), 10) : t.clickedIndex = $(n).index(), a.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide()
    }
    var update = { updateSize: updateSize, updateSlides: updateSlides, updateAutoHeight: updateAutoHeight, updateSlidesOffset: updateSlidesOffset, updateSlidesProgress: updateSlidesProgress, updateProgress: updateProgress, updateSlidesClasses: updateSlidesClasses, updateActiveIndex: updateActiveIndex, updateClickedSlide: updateClickedSlide };

    function getTranslate(e) {
        void 0 === e && (e = this.isHorizontal() ? "x" : "y");
        var t = this.params,
            a = this.rtlTranslate,
            n = this.translate,
            r = this.$wrapperEl;
        if (t.virtualTranslate) return a ? -n : n;
        var i = Utils.getTranslate(r[0], e);
        return a && (i = -i), i || 0
    }

    function setTranslate(e, t) {
        var a = this,
            n = a.rtlTranslate,
            r = a.params,
            i = a.$wrapperEl,
            o = a.progress,
            s = 0,
            l = 0;
        a.isHorizontal() ? s = n ? -e : e : l = e, r.roundLengths && (s = Math.floor(s), l = Math.floor(l)), r.virtualTranslate || (Support.transforms3d ? i.transform("translate3d(" + s + "px, " + l + "px, 0px)") : i.transform("translate(" + s + "px, " + l + "px)")), a.previousTranslate = a.translate, a.translate = a.isHorizontal() ? s : l;
        var p = a.maxTranslate() - a.minTranslate();
        (0 === p ? 0 : (e - a.minTranslate()) / p) !== o && a.updateProgress(e), a.emit("setTranslate", a.translate, t)
    }

    function minTranslate() { return -this.snapGrid[0] }

    function maxTranslate() { return -this.snapGrid[this.snapGrid.length - 1] }
    var translate = { getTranslate: getTranslate, setTranslate: setTranslate, minTranslate: minTranslate, maxTranslate: maxTranslate };

    function setTransition(e, t) { this.$wrapperEl.transition(e), this.emit("setTransition", e, t) }

    function transitionStart(e, t) {
        void 0 === e && (e = !0);
        var a = this.activeIndex,
            n = this.params,
            r = this.previousIndex;
        n.autoHeight && this.updateAutoHeight();
        var i = t;
        if (i || (i = r < a ? "next" : a < r ? "prev" : "reset"), this.emit("transitionStart"), e && a !== r) {
            if ("reset" === i) return void this.emit("slideResetTransitionStart");
            this.emit("slideChangeTransitionStart"), "next" === i ? this.emit("slideNextTransitionStart") : this.emit("slidePrevTransitionStart")
        }
    }

    function transitionEnd$1(e, t) {
        void 0 === e && (e = !0);
        var a = this.activeIndex,
            n = this.previousIndex;
        this.animating = !1, this.setTransition(0);
        var r = t;
        if (r || (r = n < a ? "next" : a < n ? "prev" : "reset"), this.emit("transitionEnd"), e && a !== n) {
            if ("reset" === r) return void this.emit("slideResetTransitionEnd");
            this.emit("slideChangeTransitionEnd"), "next" === r ? this.emit("slideNextTransitionEnd") : this.emit("slidePrevTransitionEnd")
        }
    }
    var transition$1 = { setTransition: setTransition, transitionStart: transitionStart, transitionEnd: transitionEnd$1 };

    function slideTo(e, t, a, n) {
        void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === a && (a = !0);
        var r = this,
            i = e;
        i < 0 && (i = 0);
        var o = r.params,
            s = r.snapGrid,
            l = r.slidesGrid,
            p = r.previousIndex,
            c = r.activeIndex,
            d = r.rtlTranslate;
        if (r.animating && o.preventInteractionOnTransition) return !1;
        var u = Math.floor(i / o.slidesPerGroup);
        u >= s.length && (u = s.length - 1), (c || o.initialSlide || 0) === (p || 0) && a && r.emit("beforeSlideChangeStart");
        var h, f = -s[u];
        if (r.updateProgress(f), o.normalizeSlideIndex)
            for (var m = 0; m < l.length; m += 1) - Math.floor(100 * f) >= Math.floor(100 * l[m]) && (i = m);
        if (r.initialized && i !== c) { if (!r.allowSlideNext && f < r.translate && f < r.minTranslate()) return !1; if (!r.allowSlidePrev && f > r.translate && f > r.maxTranslate() && (c || 0) !== i) return !1 }
        return h = c < i ? "next" : i < c ? "prev" : "reset", d && -f === r.translate || !d && f === r.translate ? (r.updateActiveIndex(i), o.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== o.effect && r.setTranslate(f), "reset" !== h && (r.transitionStart(a, h), r.transitionEnd(a, h)), !1) : (0 !== t && Support.transition ? (r.setTransition(t), r.setTranslate(f), r.updateActiveIndex(i), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, n), r.transitionStart(a, h), r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(e) { r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(a, h)) }), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd))) : (r.setTransition(0), r.setTranslate(f), r.updateActiveIndex(i), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, n), r.transitionStart(a, h), r.transitionEnd(a, h)), !0)
    }

    function slideToLoop(e, t, a, n) { void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === a && (a = !0); var r = e; return this.params.loop && (r += this.loopedSlides), this.slideTo(r, t, a, n) }

    function slideNext(e, t, a) {
        void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
        var n = this.params,
            r = this.animating;
        return n.loop ? !r && (this.loopFix(), this._clientLeft = this.$wrapperEl[0].clientLeft, this.slideTo(this.activeIndex + n.slidesPerGroup, e, t, a)) : this.slideTo(this.activeIndex + n.slidesPerGroup, e, t, a)
    }

    function slidePrev(e, t, a) {
        void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
        var n = this,
            r = n.params,
            i = n.animating,
            o = n.snapGrid,
            s = n.slidesGrid,
            l = n.rtlTranslate;
        if (r.loop) {
            if (i) return !1;
            n.loopFix(), n._clientLeft = n.$wrapperEl[0].clientLeft
        }

        function p(e) { return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e) }
        var c, d = p(l ? n.translate : -n.translate),
            u = o.map(function(e) { return p(e) }),
            h = (s.map(function(e) { return p(e) }), o[u.indexOf(d)], o[u.indexOf(d) - 1]);
        return void 0 !== h && (c = s.indexOf(h)) < 0 && (c = n.activeIndex - 1), n.slideTo(c, e, t, a)
    }

    function slideReset(e, t, a) { void 0 === e && (e = this.params.speed), void 0 === t && (t = !0); return this.slideTo(this.activeIndex, e, t, a) }

    function slideToClosest(e, t, a) {
        void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
        var n = this,
            r = n.activeIndex,
            i = Math.floor(r / n.params.slidesPerGroup);
        if (i < n.snapGrid.length - 1) {
            var o = n.rtlTranslate ? n.translate : -n.translate,
                s = n.snapGrid[i];
            (n.snapGrid[i + 1] - s) / 2 < o - s && (r = n.params.slidesPerGroup)
        }
        return n.slideTo(r, e, t, a)
    }

    function slideToClickedSlide() {
        var e, t = this,
            a = t.params,
            n = t.$wrapperEl,
            r = "auto" === a.slidesPerView ? t.slidesPerViewDynamic() : a.slidesPerView,
            i = t.clickedIndex;
        if (a.loop) {
            if (t.animating) return;
            e = parseInt($(t.clickedSlide).attr("data-swiper-slide-index"), 10), a.centeredSlides ? i < t.loopedSlides - r / 2 || i > t.slides.length - t.loopedSlides + r / 2 ? (t.loopFix(), i = n.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + a.slideDuplicateClass + ")").eq(0).index(), Utils.nextTick(function() { t.slideTo(i) })) : t.slideTo(i) : i > t.slides.length - r ? (t.loopFix(), i = n.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]:not(.' + a.slideDuplicateClass + ")").eq(0).index(), Utils.nextTick(function() { t.slideTo(i) })) : t.slideTo(i)
        } else t.slideTo(i)
    }
    var slide = { slideTo: slideTo, slideToLoop: slideToLoop, slideNext: slideNext, slidePrev: slidePrev, slideReset: slideReset, slideToClosest: slideToClosest, slideToClickedSlide: slideToClickedSlide };

    function loopCreate() {
        var n = this,
            e = n.params,
            t = n.$wrapperEl;
        t.children("." + e.slideClass + "." + e.slideDuplicateClass).remove();
        var r = t.children("." + e.slideClass);
        if (e.loopFillGroupWithBlank) {
            var a = e.slidesPerGroup - r.length % e.slidesPerGroup;
            if (a !== e.slidesPerGroup) {
                for (var i = 0; i < a; i += 1) {
                    var o = $(doc.createElement("div")).addClass(e.slideClass + " " + e.slideBlankClass);
                    t.append(o)
                }
                r = t.children("." + e.slideClass)
            }
        }
        "auto" !== e.slidesPerView || e.loopedSlides || (e.loopedSlides = r.length), n.loopedSlides = parseInt(e.loopedSlides || e.slidesPerView, 10), n.loopedSlides += e.loopAdditionalSlides, n.loopedSlides > r.length && (n.loopedSlides = r.length);
        var s = [],
            l = [];
        r.each(function(e, t) {
            var a = $(t);
            e < n.loopedSlides && l.push(t), e < r.length && e >= r.length - n.loopedSlides && s.push(t), a.attr("data-swiper-slide-index", e)
        });
        for (var p = 0; p < l.length; p += 1) t.append($(l[p].cloneNode(!0)).addClass(e.slideDuplicateClass));
        for (var c = s.length - 1; 0 <= c; c -= 1) t.prepend($(s[c].cloneNode(!0)).addClass(e.slideDuplicateClass))
    }

    function loopFix() {
        var e, t = this,
            a = t.params,
            n = t.activeIndex,
            r = t.slides,
            i = t.loopedSlides,
            o = t.allowSlidePrev,
            s = t.allowSlideNext,
            l = t.snapGrid,
            p = t.rtlTranslate;
        t.allowSlidePrev = !0, t.allowSlideNext = !0;
        var c = -l[n] - t.getTranslate();
        if (n < i) e = r.length - 3 * i + n, e += i, t.slideTo(e, 0, !1, !0) && 0 !== c && t.setTranslate((p ? -t.translate : t.translate) - c);
        else if ("auto" === a.slidesPerView && 2 * i <= n || n >= r.length - i) { e = -r.length + n + i, e += i, t.slideTo(e, 0, !1, !0) && 0 !== c && t.setTranslate((p ? -t.translate : t.translate) - c) }
        t.allowSlidePrev = o, t.allowSlideNext = s
    }

    function loopDestroy() {
        var e = this.$wrapperEl,
            t = this.params,
            a = this.slides;
        e.children("." + t.slideClass + "." + t.slideDuplicateClass).remove(), a.removeAttr("data-swiper-slide-index")
    }
    var loop = { loopCreate: loopCreate, loopFix: loopFix, loopDestroy: loopDestroy };

    function setGrabCursor(e) {
        if (!(Support.touch || !this.params.simulateTouch || this.params.watchOverflow && this.isLocked)) {
            var t = this.el;
            t.style.cursor = "move", t.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab", t.style.cursor = e ? "-moz-grabbin" : "-moz-grab", t.style.cursor = e ? "grabbing" : "grab"
        }
    }

    function unsetGrabCursor() { Support.touch || this.params.watchOverflow && this.isLocked || (this.el.style.cursor = "") }
    var grabCursor = { setGrabCursor: setGrabCursor, unsetGrabCursor: unsetGrabCursor };

    function appendSlide(e) {
        var t = this.$wrapperEl,
            a = this.params;
        if (a.loop && this.loopDestroy(), "object" == typeof e && "length" in e)
            for (var n = 0; n < e.length; n += 1) e[n] && t.append(e[n]);
        else t.append(e);
        a.loop && this.loopCreate(), a.observer && Support.observer || this.update()
    }

    function prependSlide(e) {
        var t = this.params,
            a = this.$wrapperEl,
            n = this.activeIndex;
        t.loop && this.loopDestroy();
        var r = n + 1;
        if ("object" == typeof e && "length" in e) {
            for (var i = 0; i < e.length; i += 1) e[i] && a.prepend(e[i]);
            r = n + e.length
        } else a.prepend(e);
        t.loop && this.loopCreate(), t.observer && Support.observer || this.update(), this.slideTo(r, 0, !1)
    }

    function addSlide(e, t) {
        var a = this,
            n = a.$wrapperEl,
            r = a.params,
            i = a.activeIndex;
        r.loop && (i -= a.loopedSlides, a.loopDestroy(), a.slides = n.children("." + r.slideClass));
        var o = a.slides.length;
        if (e <= 0) a.prependSlide(t);
        else if (o <= e) a.appendSlide(t);
        else {
            for (var s = e < i ? i + 1 : i, l = [], p = o - 1; e <= p; p -= 1) {
                var c = a.slides.eq(p);
                c.remove(), l.unshift(c)
            }
            if ("object" == typeof t && "length" in t) {
                for (var d = 0; d < t.length; d += 1) t[d] && n.append(t[d]);
                s = e < i ? i + t.length : i
            } else n.append(t);
            for (var u = 0; u < l.length; u += 1) n.append(l[u]);
            r.loop && a.loopCreate(), r.observer && Support.observer || a.update(), r.loop ? a.slideTo(s + a.loopedSlides, 0, !1) : a.slideTo(s, 0, !1)
        }
    }

    function removeSlide(e) {
        var t = this,
            a = t.params,
            n = t.$wrapperEl,
            r = t.activeIndex;
        a.loop && (r -= t.loopedSlides, t.loopDestroy(), t.slides = n.children("." + a.slideClass));
        var i, o = r;
        if ("object" == typeof e && "length" in e) {
            for (var s = 0; s < e.length; s += 1) i = e[s], t.slides[i] && t.slides.eq(i).remove(), i < o && (o -= 1);
            o = Math.max(o, 0)
        } else i = e, t.slides[i] && t.slides.eq(i).remove(), i < o && (o -= 1), o = Math.max(o, 0);
        a.loop && t.loopCreate(), a.observer && Support.observer || t.update(), a.loop ? t.slideTo(o + t.loopedSlides, 0, !1) : t.slideTo(o, 0, !1)
    }

    function removeAllSlides() {
        for (var e = [], t = 0; t < this.slides.length; t += 1) e.push(t);
        this.removeSlide(e)
    }
    var manipulation = { appendSlide: appendSlide, prependSlide: prependSlide, addSlide: addSlide, removeSlide: removeSlide, removeAllSlides: removeAllSlides };

    function onTouchStart(e) {
        var t = this,
            a = t.touchEventsData,
            n = t.params,
            r = t.touches;
        if (!t.animating || !n.preventInteractionOnTransition) {
            var i = e;
            if (i.originalEvent && (i = i.originalEvent), a.isTouchEvent = "touchstart" === i.type, (a.isTouchEvent || !("which" in i) || 3 !== i.which) && !(!a.isTouchEvent && "button" in i && 0 < i.button || a.isTouched && a.isMoved))
                if (n.noSwiping && $(i.target).closest(n.noSwipingSelector ? n.noSwipingSelector : "." + n.noSwipingClass)[0]) t.allowClick = !0;
                else if (!n.swipeHandler || $(i).closest(n.swipeHandler)[0]) {
                r.currentX = "touchstart" === i.type ? i.targetTouches[0].pageX : i.pageX, r.currentY = "touchstart" === i.type ? i.targetTouches[0].pageY : i.pageY;
                var o = r.currentX,
                    s = r.currentY,
                    l = n.edgeSwipeDetection || n.iOSEdgeSwipeDetection,
                    p = n.edgeSwipeThreshold || n.iOSEdgeSwipeThreshold;
                if (!l || !(o <= p || o >= win.screen.width - p)) {
                    if (Utils.extend(a, { isTouched: !0, isMoved: !1, allowTouchCallbacks: !0, isScrolling: void 0, startMoving: void 0 }), r.startX = o, r.startY = s, a.touchStartTime = Utils.now(), t.allowClick = !0, t.updateSize(), t.swipeDirection = void 0, 0 < n.threshold && (a.allowThresholdMove = !1), "touchstart" !== i.type) {
                        var c = !0;
                        $(i.target).is(a.formElements) && (c = !1), doc.activeElement && $(doc.activeElement).is(a.formElements) && doc.activeElement !== i.target && doc.activeElement.blur();
                        var d = c && t.allowTouchMove && n.touchStartPreventDefault;
                        (n.touchStartForcePreventDefault || d) && i.preventDefault()
                    }
                    t.emit("touchStart", i)
                }
            }
        }
    }

    function onTouchMove(e) {
        var t = this,
            a = t.touchEventsData,
            n = t.params,
            r = t.touches,
            i = t.rtlTranslate,
            o = e;
        if (o.originalEvent && (o = o.originalEvent), a.isTouched) {
            if (!a.isTouchEvent || "mousemove" !== o.type) {
                var s = "touchmove" === o.type ? o.targetTouches[0].pageX : o.pageX,
                    l = "touchmove" === o.type ? o.targetTouches[0].pageY : o.pageY;
                if (o.preventedByNestedSwiper) return r.startX = s, void(r.startY = l);
                if (!t.allowTouchMove) return t.allowClick = !1, void(a.isTouched && (Utils.extend(r, { startX: s, startY: l, currentX: s, currentY: l }), a.touchStartTime = Utils.now()));
                if (a.isTouchEvent && n.touchReleaseOnEdges && !n.loop)
                    if (t.isVertical()) { if (l < r.startY && t.translate <= t.maxTranslate() || l > r.startY && t.translate >= t.minTranslate()) return a.isTouched = !1, void(a.isMoved = !1) } else if (s < r.startX && t.translate <= t.maxTranslate() || s > r.startX && t.translate >= t.minTranslate()) return;
                if (a.isTouchEvent && doc.activeElement && o.target === doc.activeElement && $(o.target).is(a.formElements)) return a.isMoved = !0, void(t.allowClick = !1);
                if (a.allowTouchCallbacks && t.emit("touchMove", o), !(o.targetTouches && 1 < o.targetTouches.length)) {
                    r.currentX = s, r.currentY = l;
                    var p = r.currentX - r.startX,
                        c = r.currentY - r.startY;
                    if (!(t.params.threshold && Math.sqrt(Math.pow(p, 2) + Math.pow(c, 2)) < t.params.threshold)) {
                        var d;
                        if (void 0 === a.isScrolling) t.isHorizontal() && r.currentY === r.startY || t.isVertical() && r.currentX === r.startX ? a.isScrolling = !1 : 25 <= p * p + c * c && (d = 180 * Math.atan2(Math.abs(c), Math.abs(p)) / Math.PI, a.isScrolling = t.isHorizontal() ? d > n.touchAngle : 90 - d > n.touchAngle);
                        if (a.isScrolling && t.emit("touchMoveOpposite", o), void 0 === a.startMoving && (r.currentX === r.startX && r.currentY === r.startY || (a.startMoving = !0)), a.isScrolling) a.isTouched = !1;
                        else if (a.startMoving) {
                            t.allowClick = !1, o.preventDefault(), n.touchMoveStopPropagation && !n.nested && o.stopPropagation(), a.isMoved || (n.loop && t.loopFix(), a.startTranslate = t.getTranslate(), t.setTransition(0), t.animating && t.$wrapperEl.trigger("webkitTransitionEnd transitionend"), a.allowMomentumBounce = !1, !n.grabCursor || !0 !== t.allowSlideNext && !0 !== t.allowSlidePrev || t.setGrabCursor(!0), t.emit("sliderFirstMove", o)), t.emit("sliderMove", o), a.isMoved = !0;
                            var u = t.isHorizontal() ? p : c;
                            r.diff = u, u *= n.touchRatio, i && (u = -u), t.swipeDirection = 0 < u ? "prev" : "next", a.currentTranslate = u + a.startTranslate;
                            var h = !0,
                                f = n.resistanceRatio;
                            if (n.touchReleaseOnEdges && (f = 0), 0 < u && a.currentTranslate > t.minTranslate() ? (h = !1, n.resistance && (a.currentTranslate = t.minTranslate() - 1 + Math.pow(-t.minTranslate() + a.startTranslate + u, f))) : u < 0 && a.currentTranslate < t.maxTranslate() && (h = !1, n.resistance && (a.currentTranslate = t.maxTranslate() + 1 - Math.pow(t.maxTranslate() - a.startTranslate - u, f))), h && (o.preventedByNestedSwiper = !0), !t.allowSlideNext && "next" === t.swipeDirection && a.currentTranslate < a.startTranslate && (a.currentTranslate = a.startTranslate), !t.allowSlidePrev && "prev" === t.swipeDirection && a.currentTranslate > a.startTranslate && (a.currentTranslate = a.startTranslate), 0 < n.threshold) { if (!(Math.abs(u) > n.threshold || a.allowThresholdMove)) return void(a.currentTranslate = a.startTranslate); if (!a.allowThresholdMove) return a.allowThresholdMove = !0, r.startX = r.currentX, r.startY = r.currentY, a.currentTranslate = a.startTranslate, void(r.diff = t.isHorizontal() ? r.currentX - r.startX : r.currentY - r.startY) }
                            n.followFinger && ((n.freeMode || n.watchSlidesProgress || n.watchSlidesVisibility) && (t.updateActiveIndex(), t.updateSlidesClasses()), n.freeMode && (0 === a.velocities.length && a.velocities.push({ position: r[t.isHorizontal() ? "startX" : "startY"], time: a.touchStartTime }), a.velocities.push({ position: r[t.isHorizontal() ? "currentX" : "currentY"], time: Utils.now() })), t.updateProgress(a.currentTranslate), t.setTranslate(a.currentTranslate))
                        }
                    }
                }
            }
        } else a.startMoving && a.isScrolling && t.emit("touchMoveOpposite", o)
    }

    function onTouchEnd(e) {
        var t = this,
            a = t.touchEventsData,
            n = t.params,
            r = t.touches,
            i = t.rtlTranslate,
            o = t.$wrapperEl,
            s = t.slidesGrid,
            l = t.snapGrid,
            p = e;
        if (p.originalEvent && (p = p.originalEvent), a.allowTouchCallbacks && t.emit("touchEnd", p), a.allowTouchCallbacks = !1, !a.isTouched) return a.isMoved && n.grabCursor && t.setGrabCursor(!1), a.isMoved = !1, void(a.startMoving = !1);
        n.grabCursor && a.isMoved && a.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
        var c, d = Utils.now(),
            u = d - a.touchStartTime;
        if (t.allowClick && (t.updateClickedSlide(p), t.emit("tap", p), u < 300 && 300 < d - a.lastClickTime && (a.clickTimeout && clearTimeout(a.clickTimeout), a.clickTimeout = Utils.nextTick(function() { t && !t.destroyed && t.emit("click", p) }, 300)), u < 300 && d - a.lastClickTime < 300 && (a.clickTimeout && clearTimeout(a.clickTimeout), t.emit("doubleTap", p))), a.lastClickTime = Utils.now(), Utils.nextTick(function() { t.destroyed || (t.allowClick = !0) }), !a.isTouched || !a.isMoved || !t.swipeDirection || 0 === r.diff || a.currentTranslate === a.startTranslate) return a.isTouched = !1, a.isMoved = !1, void(a.startMoving = !1);
        if (a.isTouched = !1, a.isMoved = !1, a.startMoving = !1, c = n.followFinger ? i ? t.translate : -t.translate : -a.currentTranslate, n.freeMode) {
            if (c < -t.minTranslate()) return void t.slideTo(t.activeIndex);
            if (c > -t.maxTranslate()) return void(t.slides.length < l.length ? t.slideTo(l.length - 1) : t.slideTo(t.slides.length - 1));
            if (n.freeModeMomentum) {
                if (1 < a.velocities.length) {
                    var h = a.velocities.pop(),
                        f = a.velocities.pop(),
                        m = h.position - f.position,
                        v = h.time - f.time;
                    t.velocity = m / v, t.velocity /= 2, Math.abs(t.velocity) < n.freeModeMinimumVelocity && (t.velocity = 0), (150 < v || 300 < Utils.now() - h.time) && (t.velocity = 0)
                } else t.velocity = 0;
                t.velocity *= n.freeModeMomentumVelocityRatio, a.velocities.length = 0;
                var g = 1e3 * n.freeModeMomentumRatio,
                    b = t.velocity * g,
                    y = t.translate + b;
                i && (y = -y);
                var w, C, x = !1,
                    $ = 20 * Math.abs(t.velocity) * n.freeModeMomentumBounceRatio;
                if (y < t.maxTranslate()) n.freeModeMomentumBounce ? (y + t.maxTranslate() < -$ && (y = t.maxTranslate() - $), w = t.maxTranslate(), x = !0, a.allowMomentumBounce = !0) : y = t.maxTranslate(), n.loop && n.centeredSlides && (C = !0);
                else if (y > t.minTranslate()) n.freeModeMomentumBounce ? (y - t.minTranslate() > $ && (y = t.minTranslate() + $), w = t.minTranslate(), x = !0, a.allowMomentumBounce = !0) : y = t.minTranslate(), n.loop && n.centeredSlides && (C = !0);
                else if (n.freeModeSticky) {
                    for (var E, k = 0; k < l.length; k += 1)
                        if (l[k] > -y) { E = k; break }
                    y = -(y = Math.abs(l[E] - y) < Math.abs(l[E - 1] - y) || "next" === t.swipeDirection ? l[E] : l[E - 1])
                }
                if (C && t.once("transitionEnd", function() { t.loopFix() }), 0 !== t.velocity) g = i ? Math.abs((-y - t.translate) / t.velocity) : Math.abs((y - t.translate) / t.velocity);
                else if (n.freeModeSticky) return void t.slideToClosest();
                n.freeModeMomentumBounce && x ? (t.updateProgress(w), t.setTransition(g), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating = !0, o.transitionEnd(function() { t && !t.destroyed && a.allowMomentumBounce && (t.emit("momentumBounce"), t.setTransition(n.speed), t.setTranslate(w), o.transitionEnd(function() { t && !t.destroyed && t.transitionEnd() })) })) : t.velocity ? (t.updateProgress(y), t.setTransition(g), t.setTranslate(y), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, o.transitionEnd(function() { t && !t.destroyed && t.transitionEnd() }))) : t.updateProgress(y), t.updateActiveIndex(), t.updateSlidesClasses()
            } else if (n.freeModeSticky) return void t.slideToClosest();
            (!n.freeModeMomentum || u >= n.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses())
        } else { for (var S = 0, T = t.slidesSizesGrid[0], M = 0; M < s.length; M += n.slidesPerGroup) void 0 !== s[M + n.slidesPerGroup] ? c >= s[M] && c < s[M + n.slidesPerGroup] && (T = s[(S = M) + n.slidesPerGroup] - s[M]) : c >= s[M] && (S = M, T = s[s.length - 1] - s[s.length - 2]); var P = (c - s[S]) / T; if (u > n.longSwipesMs) { if (!n.longSwipes) return void t.slideTo(t.activeIndex); "next" === t.swipeDirection && (P >= n.longSwipesRatio ? t.slideTo(S + n.slidesPerGroup) : t.slideTo(S)), "prev" === t.swipeDirection && (P > 1 - n.longSwipesRatio ? t.slideTo(S + n.slidesPerGroup) : t.slideTo(S)) } else { if (!n.shortSwipes) return void t.slideTo(t.activeIndex); "next" === t.swipeDirection && t.slideTo(S + n.slidesPerGroup), "prev" === t.swipeDirection && t.slideTo(S) } }
    }

    function onResize() {
        var e = this,
            t = e.params,
            a = e.el;
        if (!a || 0 !== a.offsetWidth) {
            t.breakpoints && e.setBreakpoint();
            var n = e.allowSlideNext,
                r = e.allowSlidePrev,
                i = e.snapGrid;
            if (e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), t.freeMode) {
                var o = Math.min(Math.max(e.translate, e.maxTranslate()), e.minTranslate());
                e.setTranslate(o), e.updateActiveIndex(), e.updateSlidesClasses(), t.autoHeight && e.updateAutoHeight()
            } else e.updateSlidesClasses(), ("auto" === t.slidesPerView || 1 < t.slidesPerView) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0);
            e.allowSlidePrev = r, e.allowSlideNext = n, e.params.watchOverflow && i !== e.snapGrid && e.checkOverflow()
        }
    }

    function onClick(e) { this.allowClick || (this.params.preventClicks && e.preventDefault(), this.params.preventClicksPropagation && this.animating && (e.stopPropagation(), e.stopImmediatePropagation())) }

    function attachEvents() {
        var e = this,
            t = e.params,
            a = e.touchEvents,
            n = e.el,
            r = e.wrapperEl;
        e.onTouchStart = onTouchStart.bind(e), e.onTouchMove = onTouchMove.bind(e), e.onTouchEnd = onTouchEnd.bind(e), e.onClick = onClick.bind(e);
        var i = "container" === t.touchEventsTarget ? n : r,
            o = !!t.nested;
        if (Support.touch || !Support.pointerEvents && !Support.prefixedPointerEvents) {
            if (Support.touch) {
                var s = !("touchstart" !== a.start || !Support.passiveListener || !t.passiveListeners) && { passive: !0, capture: !1 };
                i.addEventListener(a.start, e.onTouchStart, s), i.addEventListener(a.move, e.onTouchMove, Support.passiveListener ? { passive: !1, capture: o } : o), i.addEventListener(a.end, e.onTouchEnd, s)
            }(t.simulateTouch && !Device.ios && !Device.android || t.simulateTouch && !Support.touch && Device.ios) && (i.addEventListener("mousedown", e.onTouchStart, !1), doc.addEventListener("mousemove", e.onTouchMove, o), doc.addEventListener("mouseup", e.onTouchEnd, !1))
        } else i.addEventListener(a.start, e.onTouchStart, !1), doc.addEventListener(a.move, e.onTouchMove, o), doc.addEventListener(a.end, e.onTouchEnd, !1);
        (t.preventClicks || t.preventClicksPropagation) && i.addEventListener("click", e.onClick, !0), e.on(Device.ios || Device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, !0)
    }

    function detachEvents() {
        var e = this,
            t = e.params,
            a = e.touchEvents,
            n = e.el,
            r = e.wrapperEl,
            i = "container" === t.touchEventsTarget ? n : r,
            o = !!t.nested;
        if (Support.touch || !Support.pointerEvents && !Support.prefixedPointerEvents) {
            if (Support.touch) {
                var s = !("onTouchStart" !== a.start || !Support.passiveListener || !t.passiveListeners) && { passive: !0, capture: !1 };
                i.removeEventListener(a.start, e.onTouchStart, s), i.removeEventListener(a.move, e.onTouchMove, o), i.removeEventListener(a.end, e.onTouchEnd, s)
            }(t.simulateTouch && !Device.ios && !Device.android || t.simulateTouch && !Support.touch && Device.ios) && (i.removeEventListener("mousedown", e.onTouchStart, !1), doc.removeEventListener("mousemove", e.onTouchMove, o), doc.removeEventListener("mouseup", e.onTouchEnd, !1))
        } else i.removeEventListener(a.start, e.onTouchStart, !1), doc.removeEventListener(a.move, e.onTouchMove, o), doc.removeEventListener(a.end, e.onTouchEnd, !1);
        (t.preventClicks || t.preventClicksPropagation) && i.removeEventListener("click", e.onClick, !0), e.off(Device.ios || Device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize)
    }
    var events = { attachEvents: attachEvents, detachEvents: detachEvents };

    function setBreakpoint() {
        var e = this,
            t = e.activeIndex,
            a = e.initialized,
            n = e.loopedSlides;
        void 0 === n && (n = 0);
        var r = e.params,
            i = r.breakpoints;
        if (i && (!i || 0 !== Object.keys(i).length)) {
            var o = e.getBreakpoint(i);
            if (o && e.currentBreakpoint !== o) {
                var s = o in i ? i[o] : void 0;
                s && ["slidesPerView", "spaceBetween", "slidesPerGroup"].forEach(function(e) {
                    var t = s[e];
                    void 0 !== t && (s[e] = "slidesPerView" !== e || "AUTO" !== t && "auto" !== t ? "slidesPerView" === e ? parseFloat(t) : parseInt(t, 10) : "auto")
                });
                var l = s || e.originalParams,
                    p = r.loop && l.slidesPerView !== r.slidesPerView;
                Utils.extend(e.params, l), Utils.extend(e, { allowTouchMove: e.params.allowTouchMove, allowSlideNext: e.params.allowSlideNext, allowSlidePrev: e.params.allowSlidePrev }), e.currentBreakpoint = o, p && a && (e.loopDestroy(), e.loopCreate(), e.updateSlides(), e.slideTo(t - n + e.loopedSlides, 0, !1)), e.emit("breakpoint", l)
            }
        }
    }

    function getBreakpoint(e) {
        if (e) {
            var t = !1,
                a = [];
            Object.keys(e).forEach(function(e) { a.push(e) }), a.sort(function(e, t) { return parseInt(e, 10) - parseInt(t, 10) });
            for (var n = 0; n < a.length; n += 1) {
                var r = a[n];
                this.params.breakpointsInverse ? r <= win.innerWidth && (t = r) : r >= win.innerWidth && !t && (t = r)
            }
            return t || "max"
        }
    }
    var breakpoints = { setBreakpoint: setBreakpoint, getBreakpoint: getBreakpoint },
        Browser = { isIE: !!win.navigator.userAgent.match(/Trident/g) || !!win.navigator.userAgent.match(/MSIE/g), isSafari: (M2a = win.navigator.userAgent.toLowerCase(), 0 <= M2a.indexOf("safari") && M2a.indexOf("chrome") < 0 && M2a.indexOf("android") < 0), isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(win.navigator.userAgent) },
        M2a;

    function addClasses() {
        var t = this.classNames,
            a = this.params,
            e = this.rtl,
            n = this.$el,
            r = [];
        r.push(a.direction), a.freeMode && r.push("free-mode"), Support.flexbox || r.push("no-flexbox"), a.autoHeight && r.push("autoheight"), e && r.push("rtl"), 1 < a.slidesPerColumn && r.push("multirow"), Device.android && r.push("android"), Device.ios && r.push("ios"), (Browser.isIE || Browser.isEdge) && (Support.pointerEvents || Support.prefixedPointerEvents) && r.push("wp8-" + a.direction), r.forEach(function(e) { t.push(a.containerModifierClass + e) }), n.addClass(t.join(" "))
    }

    function removeClasses() {
        var e = this.$el,
            t = this.classNames;
        e.removeClass(t.join(" "))
    }
    var classes = { addClasses: addClasses, removeClasses: removeClasses };

    function loadImage(e, t, a, n, r, i) {
        var o;

        function s() { i && i() }
        e.complete && r ? s() : t ? ((o = new win.Image).onload = s, o.onerror = s, n && (o.sizes = n), a && (o.srcset = a), t && (o.src = t)) : s()
    }

    function preloadImages() {
        var e = this;

        function t() { null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1), e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(), e.emit("imagesReady"))) }
        e.imagesToLoad = e.$el.find("img");
        for (var a = 0; a < e.imagesToLoad.length; a += 1) {
            var n = e.imagesToLoad[a];
            e.loadImage(n, n.currentSrc || n.getAttribute("src"), n.srcset || n.getAttribute("srcset"), n.sizes || n.getAttribute("sizes"), !0, t)
        }
    }
    var images = { loadImage: loadImage, preloadImages: preloadImages };

    function checkOverflow() {
        var e = this,
            t = e.isLocked;
        e.isLocked = 1 === e.snapGrid.length, e.allowSlideNext = !e.isLocked, e.allowSlidePrev = !e.isLocked, t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock"), t && t !== e.isLocked && (e.isEnd = !1, e.navigation.update())
    }
    var checkOverflow$1 = { checkOverflow: checkOverflow },
        defaults = { init: !0, direction: "horizontal", touchEventsTarget: "container", initialSlide: 0, speed: 300, preventInteractionOnTransition: !1, edgeSwipeDetection: !1, edgeSwipeThreshold: 20, freeMode: !1, freeModeMomentum: !0, freeModeMomentumRatio: 1, freeModeMomentumBounce: !0, freeModeMomentumBounceRatio: 1, freeModeMomentumVelocityRatio: 1, freeModeSticky: !1, freeModeMinimumVelocity: .02, autoHeight: !1, setWrapperSize: !1, virtualTranslate: !1, effect: "slide", breakpoints: void 0, breakpointsInverse: !1, spaceBetween: 0, slidesPerView: 1, slidesPerColumn: 1, slidesPerColumnFill: "column", slidesPerGroup: 1, centeredSlides: !1, slidesOffsetBefore: 0, slidesOffsetAfter: 0, normalizeSlideIndex: !0, centerInsufficientSlides: !1, watchOverflow: !1, roundLengths: !1, touchRatio: 1, touchAngle: 45, simulateTouch: !0, shortSwipes: !0, longSwipes: !0, longSwipesRatio: .5, longSwipesMs: 300, followFinger: !0, allowTouchMove: !0, threshold: 0, touchMoveStopPropagation: !0, touchStartPreventDefault: !0, touchStartForcePreventDefault: !1, touchReleaseOnEdges: !1, uniqueNavElements: !0, resistance: !0, resistanceRatio: .85, watchSlidesProgress: !1, watchSlidesVisibility: !1, grabCursor: !1, preventClicks: !0, preventClicksPropagation: !0, slideToClickedSlide: !1, preloadImages: !0, updateOnImagesReady: !0, loop: !1, loopAdditionalSlides: 0, loopedSlides: null, loopFillGroupWithBlank: !1, allowSlidePrev: !0, allowSlideNext: !0, swipeHandler: null, noSwiping: !0, noSwipingClass: "swiper-no-swiping", noSwipingSelector: null, passiveListeners: !0, containerModifierClass: "swiper-container-", slideClass: "swiper-slide", slideBlankClass: "swiper-slide-invisible-blank", slideActiveClass: "swiper-slide-active", slideDuplicateActiveClass: "swiper-slide-duplicate-active", slideVisibleClass: "swiper-slide-visible", slideDuplicateClass: "swiper-slide-duplicate", slideNextClass: "swiper-slide-next", slideDuplicateNextClass: "swiper-slide-duplicate-next", slidePrevClass: "swiper-slide-prev", slideDuplicatePrevClass: "swiper-slide-duplicate-prev", wrapperClass: "swiper-wrapper", runCallbacksOnInit: !0 },
        prototypes = { update: update, translate: translate, transition: transition$1, slide: slide, loop: loop, grabCursor: grabCursor, manipulation: manipulation, events: events, breakpoints: breakpoints, checkOverflow: checkOverflow$1, classes: classes, images: images },
        extendedDefaults = {},
        Swiper = function(u) {
            function h() {
                for (var e, t, r, a = [], n = arguments.length; n--;) a[n] = arguments[n];
                (r = 1 === a.length && a[0].constructor && a[0].constructor === Object ? a[0] : (t = (e = a)[0], e[1])) || (r = {}), r = Utils.extend({}, r), t && !r.el && (r.el = t), u.call(this, r), Object.keys(prototypes).forEach(function(t) { Object.keys(prototypes[t]).forEach(function(e) { h.prototype[e] || (h.prototype[e] = prototypes[t][e]) }) });
                var i = this;
                void 0 === i.modules && (i.modules = {}), Object.keys(i.modules).forEach(function(e) {
                    var t = i.modules[e];
                    if (t.params) {
                        var a = Object.keys(t.params)[0],
                            n = t.params[a];
                        if ("object" != typeof n || null === n) return;
                        if (!(a in r && "enabled" in n)) return;
                        !0 === r[a] && (r[a] = { enabled: !0 }), "object" != typeof r[a] || "enabled" in r[a] || (r[a].enabled = !0), r[a] || (r[a] = { enabled: !1 })
                    }
                });
                var o = Utils.extend({}, defaults);
                i.useModulesParams(o), i.params = Utils.extend({}, o, extendedDefaults, r), i.originalParams = Utils.extend({}, i.params), i.passedParams = Utils.extend({}, r);
                var s = (i.$ = $)(i.params.el);
                if (t = s[0]) {
                    if (1 < s.length) {
                        var l = [];
                        return s.each(function(e, t) {
                            var a = Utils.extend({}, r, { el: t });
                            l.push(new h(a))
                        }), l
                    }
                    t.swiper = i, s.data("swiper", i);
                    var p, c, d = s.children("." + i.params.wrapperClass);
                    return Utils.extend(i, { $el: s, el: t, $wrapperEl: d, wrapperEl: d[0], classNames: [], slides: $(), slidesGrid: [], snapGrid: [], slidesSizesGrid: [], isHorizontal: function() { return "horizontal" === i.params.direction }, isVertical: function() { return "vertical" === i.params.direction }, rtl: "rtl" === t.dir.toLowerCase() || "rtl" === s.css("direction"), rtlTranslate: "horizontal" === i.params.direction && ("rtl" === t.dir.toLowerCase() || "rtl" === s.css("direction")), wrongRTL: "-webkit-box" === d.css("display"), activeIndex: 0, realIndex: 0, isBeginning: !0, isEnd: !1, translate: 0, previousTranslate: 0, progress: 0, velocity: 0, animating: !1, allowSlideNext: i.params.allowSlideNext, allowSlidePrev: i.params.allowSlidePrev, touchEvents: (p = ["touchstart", "touchmove", "touchend"], c = ["mousedown", "mousemove", "mouseup"], Support.pointerEvents ? c = ["pointerdown", "pointermove", "pointerup"] : Support.prefixedPointerEvents && (c = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), i.touchEventsTouch = { start: p[0], move: p[1], end: p[2] }, i.touchEventsDesktop = { start: c[0], move: c[1], end: c[2] }, Support.touch || !i.params.simulateTouch ? i.touchEventsTouch : i.touchEventsDesktop), touchEventsData: { isTouched: void 0, isMoved: void 0, allowTouchCallbacks: void 0, touchStartTime: void 0, isScrolling: void 0, currentTranslate: void 0, startTranslate: void 0, allowThresholdMove: void 0, formElements: "input, select, option, textarea, button, video", lastClickTime: Utils.now(), clickTimeout: void 0, velocities: [], allowMomentumBounce: void 0, isTouchEvent: void 0, startMoving: void 0 }, allowClick: !0, allowTouchMove: i.params.allowTouchMove, touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 }, imagesToLoad: [], imagesLoaded: 0 }), i.useModules(), i.params.init && i.init(), i
                }
            }
            u && (h.__proto__ = u);
            var e = { extendedDefaults: { configurable: !0 }, defaults: { configurable: !0 }, Class: { configurable: !0 }, $: { configurable: !0 } };
            return ((h.prototype = Object.create(u && u.prototype)).constructor = h).prototype.slidesPerViewDynamic = function() {
                var e = this.params,
                    t = this.slides,
                    a = this.slidesGrid,
                    n = this.size,
                    r = this.activeIndex,
                    i = 1;
                if (e.centeredSlides) { for (var o, s = t[r].swiperSlideSize, l = r + 1; l < t.length; l += 1) t[l] && !o && (i += 1, n < (s += t[l].swiperSlideSize) && (o = !0)); for (var p = r - 1; 0 <= p; p -= 1) t[p] && !o && (i += 1, n < (s += t[p].swiperSlideSize) && (o = !0)) } else
                    for (var c = r + 1; c < t.length; c += 1) a[c] - a[r] < n && (i += 1);
                return i
            }, h.prototype.update = function() {
                var a = this;
                if (a && !a.destroyed) {
                    var e = a.snapGrid,
                        t = a.params;
                    t.breakpoints && a.setBreakpoint(), a.updateSize(), a.updateSlides(), a.updateProgress(), a.updateSlidesClasses(), a.params.freeMode ? (n(), a.params.autoHeight && a.updateAutoHeight()) : (("auto" === a.params.slidesPerView || 1 < a.params.slidesPerView) && a.isEnd && !a.params.centeredSlides ? a.slideTo(a.slides.length - 1, 0, !1, !0) : a.slideTo(a.activeIndex, 0, !1, !0)) || n(), t.watchOverflow && e !== a.snapGrid && a.checkOverflow(), a.emit("update")
                }

                function n() {
                    var e = a.rtlTranslate ? -1 * a.translate : a.translate,
                        t = Math.min(Math.max(e, a.maxTranslate()), a.minTranslate());
                    a.setTranslate(t), a.updateActiveIndex(), a.updateSlidesClasses()
                }
            }, h.prototype.init = function() {
                var e = this;
                e.initialized || (e.emit("beforeInit"), e.params.breakpoints && e.setBreakpoint(), e.addClasses(), e.params.loop && e.loopCreate(), e.updateSize(), e.updateSlides(), e.params.watchOverflow && e.checkOverflow(), e.params.grabCursor && e.setGrabCursor(), e.params.preloadImages && e.preloadImages(), e.params.loop ? e.slideTo(e.params.initialSlide + e.loopedSlides, 0, e.params.runCallbacksOnInit) : e.slideTo(e.params.initialSlide, 0, e.params.runCallbacksOnInit), e.attachEvents(), e.initialized = !0, e.emit("init"))
            }, h.prototype.destroy = function(e, t) {
                void 0 === e && (e = !0), void 0 === t && (t = !0);
                var a = this,
                    n = a.params,
                    r = a.$el,
                    i = a.$wrapperEl,
                    o = a.slides;
                return void 0 === a.params || a.destroyed || (a.emit("beforeDestroy"), a.initialized = !1, a.detachEvents(), n.loop && a.loopDestroy(), t && (a.removeClasses(), r.removeAttr("style"), i.removeAttr("style"), o && o.length && o.removeClass([n.slideVisibleClass, n.slideActiveClass, n.slideNextClass, n.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index").removeAttr("data-swiper-column").removeAttr("data-swiper-row")), a.emit("destroy"), Object.keys(a.eventsListeners).forEach(function(e) { a.off(e) }), !1 !== e && (a.$el[0].swiper = null, a.$el.data("swiper", null), Utils.deleteProps(a)), a.destroyed = !0), null
            }, h.extendDefaults = function(e) { Utils.extend(extendedDefaults, e) }, e.extendedDefaults.get = function() { return extendedDefaults }, e.defaults.get = function() { return defaults }, e.Class.get = function() { return u }, e.$.get = function() { return $ }, Object.defineProperties(h, e), h
        }(Framework7Class),
        Device$1 = { name: "device", proto: { device: Device }, static: { device: Device } },
        Support$1 = { name: "support", proto: { support: Support }, static: { support: Support } },
        Browser$1 = { name: "browser", proto: { browser: Browser }, static: { browser: Browser } },
        Resize = {
            name: "resize",
            create: function() {
                var e = this;
                Utils.extend(e, { resize: { resizeHandler: function() { e && !e.destroyed && e.initialized && (e.emit("beforeResize"), e.emit("resize")) }, orientationChangeHandler: function() { e && !e.destroyed && e.initialized && e.emit("orientationchange") } } })
            },
            on: { init: function() { win.addEventListener("resize", this.resize.resizeHandler), win.addEventListener("orientationchange", this.resize.orientationChangeHandler) }, destroy: function() { win.removeEventListener("resize", this.resize.resizeHandler), win.removeEventListener("orientationchange", this.resize.orientationChangeHandler) } }
        },
        Observer = {
            func: win.MutationObserver || win.WebkitMutationObserver,
            attach: function(e, t) {
                void 0 === t && (t = {});
                var a = this,
                    n = new Observer.func(function(e) {
                        if (1 !== e.length) {
                            var t = function() { a.emit("observerUpdate", e[0]) };
                            win.requestAnimationFrame ? win.requestAnimationFrame(t) : win.setTimeout(t, 0)
                        } else a.emit("observerUpdate", e[0])
                    });
                n.observe(e, { attributes: void 0 === t.attributes || t.attributes, childList: void 0 === t.childList || t.childList, characterData: void 0 === t.characterData || t.characterData }), a.observer.observers.push(n)
            },
            init: function() {
                if (Support.observer && this.params.observer) {
                    if (this.params.observeParents)
                        for (var e = this.$el.parents(), t = 0; t < e.length; t += 1) this.observer.attach(e[t]);
                    this.observer.attach(this.$el[0], { childList: !1 }), this.observer.attach(this.$wrapperEl[0], { attributes: !1 })
                }
            },
            destroy: function() { this.observer.observers.forEach(function(e) { e.disconnect() }), this.observer.observers = [] }
        },
        Observer$1 = { name: "observer", params: { observer: !1, observeParents: !1 }, create: function() { Utils.extend(this, { observer: { init: Observer.init.bind(this), attach: Observer.attach.bind(this), destroy: Observer.destroy.bind(this), observers: [] } }) }, on: { init: function() { this.observer.init() }, destroy: function() { this.observer.destroy() } } },
        Virtual = {
            update: function(e) {
                var t = this,
                    a = t.params,
                    n = a.slidesPerView,
                    r = a.slidesPerGroup,
                    i = a.centeredSlides,
                    o = t.params.virtual,
                    s = o.addSlidesBefore,
                    l = o.addSlidesAfter,
                    p = t.virtual,
                    c = p.from,
                    d = p.to,
                    u = p.slides,
                    h = p.slidesGrid,
                    f = p.renderSlide,
                    m = p.offset;
                t.updateActiveIndex();
                var v, g, b, y = t.activeIndex || 0;
                v = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top", b = i ? (g = Math.floor(n / 2) + r + s, Math.floor(n / 2) + r + l) : (g = n + (r - 1) + s, r + l);
                var w = Math.max((y || 0) - b, 0),
                    C = Math.min((y || 0) + g, u.length - 1),
                    x = (t.slidesGrid[w] || 0) - (t.slidesGrid[0] || 0);

                function $() { t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), t.lazy && t.params.lazy.enabled && t.lazy.load() }
                if (Utils.extend(t.virtual, { from: w, to: C, offset: x, slidesGrid: t.slidesGrid }), c === w && d === C && !e) return t.slidesGrid !== h && x !== m && t.slides.css(v, x + "px"), void t.updateProgress();
                if (t.params.virtual.renderExternal) return t.params.virtual.renderExternal.call(t, { offset: x, from: w, to: C, slides: function() { for (var e = [], t = w; t <= C; t += 1) e.push(u[t]); return e }() }), void $();
                var E = [],
                    k = [];
                if (e) t.$wrapperEl.find("." + t.params.slideClass).remove();
                else
                    for (var S = c; S <= d; S += 1)(S < w || C < S) && t.$wrapperEl.find("." + t.params.slideClass + '[data-swiper-slide-index="' + S + '"]').remove();
                for (var T = 0; T < u.length; T += 1) w <= T && T <= C && (void 0 === d || e ? k.push(T) : (d < T && k.push(T), T < c && E.push(T)));
                k.forEach(function(e) { t.$wrapperEl.append(f(u[e], e)) }), E.sort(function(e, t) { return t - e }).forEach(function(e) { t.$wrapperEl.prepend(f(u[e], e)) }), t.$wrapperEl.children(".swiper-slide").css(v, x + "px"), $()
            },
            renderSlide: function(e, t) { var a = this.params.virtual; if (a.cache && this.virtual.cache[t]) return this.virtual.cache[t]; var n = a.renderSlide ? $(a.renderSlide.call(this, e, t)) : $('<div class="' + this.params.slideClass + '" data-swiper-slide-index="' + t + '">' + e + "</div>"); return n.attr("data-swiper-slide-index") || n.attr("data-swiper-slide-index", t), a.cache && (this.virtual.cache[t] = n), n },
            appendSlide: function(e) { this.virtual.slides.push(e), this.virtual.update(!0) },
            prependSlide: function(e) {
                if (this.virtual.slides.unshift(e), this.params.virtual.cache) {
                    var t = this.virtual.cache,
                        a = {};
                    Object.keys(t).forEach(function(e) { a[e + 1] = t[e] }), this.virtual.cache = a
                }
                this.virtual.update(!0), this.slideNext(0)
            }
        },
        Virtual$1 = {
            name: "virtual",
            params: { virtual: { enabled: !1, slides: [], cache: !0, renderSlide: null, renderExternal: null, addSlidesBefore: 0, addSlidesAfter: 0 } },
            create: function() { Utils.extend(this, { virtual: { update: Virtual.update.bind(this), appendSlide: Virtual.appendSlide.bind(this), prependSlide: Virtual.prependSlide.bind(this), renderSlide: Virtual.renderSlide.bind(this), slides: this.params.virtual.slides, cache: {} } }) },
            on: {
                beforeInit: function() {
                    if (this.params.virtual.enabled) {
                        this.classNames.push(this.params.containerModifierClass + "virtual");
                        var e = { watchSlidesProgress: !0 };
                        Utils.extend(this.params, e), Utils.extend(this.originalParams, e), this.params.initialSlide || this.virtual.update()
                    }
                },
                setTranslate: function() { this.params.virtual.enabled && this.virtual.update() }
            }
        },
        Navigation = {
            update: function() {
                var e = this.params.navigation;
                if (!this.params.loop) {
                    var t = this.navigation,
                        a = t.$nextEl,
                        n = t.$prevEl;
                    n && 0 < n.length && (this.isBeginning ? n.addClass(e.disabledClass) : n.removeClass(e.disabledClass), n[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](e.lockClass)), a && 0 < a.length && (this.isEnd ? a.addClass(e.disabledClass) : a.removeClass(e.disabledClass), a[this.params.watchOverflow && this.isLocked ? "addClass" : "removeClass"](e.lockClass))
                }
            },
            onPrevClick: function(e) { e.preventDefault(), this.isBeginning && !this.params.loop || this.slidePrev() },
            onNextClick: function(e) { e.preventDefault(), this.isEnd && !this.params.loop || this.slideNext() },
            init: function() {
                var e, t, a = this,
                    n = a.params.navigation;
                (n.nextEl || n.prevEl) && (n.nextEl && (e = $(n.nextEl), a.params.uniqueNavElements && "string" == typeof n.nextEl && 1 < e.length && 1 === a.$el.find(n.nextEl).length && (e = a.$el.find(n.nextEl))), n.prevEl && (t = $(n.prevEl), a.params.uniqueNavElements && "string" == typeof n.prevEl && 1 < t.length && 1 === a.$el.find(n.prevEl).length && (t = a.$el.find(n.prevEl))), e && 0 < e.length && e.on("click", a.navigation.onNextClick), t && 0 < t.length && t.on("click", a.navigation.onPrevClick), Utils.extend(a.navigation, { $nextEl: e, nextEl: e && e[0], $prevEl: t, prevEl: t && t[0] }))
            },
            destroy: function() {
                var e = this.navigation,
                    t = e.$nextEl,
                    a = e.$prevEl;
                t && t.length && (t.off("click", this.navigation.onNextClick), t.removeClass(this.params.navigation.disabledClass)), a && a.length && (a.off("click", this.navigation.onPrevClick), a.removeClass(this.params.navigation.disabledClass))
            }
        },
        Navigation$1 = {
            name: "navigation",
            params: { navigation: { nextEl: null, prevEl: null, hideOnClick: !1, disabledClass: "swiper-button-disabled", hiddenClass: "swiper-button-hidden", lockClass: "swiper-button-lock" } },
            create: function() { Utils.extend(this, { navigation: { init: Navigation.init.bind(this), update: Navigation.update.bind(this), destroy: Navigation.destroy.bind(this), onNextClick: Navigation.onNextClick.bind(this), onPrevClick: Navigation.onPrevClick.bind(this) } }) },
            on: {
                init: function() { this.navigation.init(), this.navigation.update() },
                toEdge: function() { this.navigation.update() },
                fromEdge: function() { this.navigation.update() },
                destroy: function() { this.navigation.destroy() },
                click: function(e) {
                    var t = this.navigation,
                        a = t.$nextEl,
                        n = t.$prevEl;
                    !this.params.navigation.hideOnClick || $(e.target).is(n) || $(e.target).is(a) || (a && a.toggleClass(this.params.navigation.hiddenClass), n && n.toggleClass(this.params.navigation.hiddenClass))
                }
            }
        },
        Pagination = {
            update: function() {
                var e = this,
                    t = e.rtl,
                    r = e.params.pagination;
                if (r.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) {
                    var i, a = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
                        n = e.pagination.$el,
                        o = e.params.loop ? Math.ceil((a - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length;
                    if (e.params.loop ? ((i = Math.ceil((e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup)) > a - 1 - 2 * e.loopedSlides && (i -= a - 2 * e.loopedSlides), o - 1 < i && (i -= o), i < 0 && "bullets" !== e.params.paginationType && (i = o + i)) : i = void 0 !== e.snapIndex ? e.snapIndex : e.activeIndex || 0, "bullets" === r.type && e.pagination.bullets && 0 < e.pagination.bullets.length) {
                        var s, l, p, c = e.pagination.bullets;
                        if (r.dynamicBullets && (e.pagination.bulletSize = c.eq(0)[e.isHorizontal() ? "outerWidth" : "outerHeight"](!0), n.css(e.isHorizontal() ? "width" : "height", e.pagination.bulletSize * (r.dynamicMainBullets + 4) + "px"), 1 < r.dynamicMainBullets && void 0 !== e.previousIndex && (e.pagination.dynamicBulletIndex += i - e.previousIndex, e.pagination.dynamicBulletIndex > r.dynamicMainBullets - 1 ? e.pagination.dynamicBulletIndex = r.dynamicMainBullets - 1 : e.pagination.dynamicBulletIndex < 0 && (e.pagination.dynamicBulletIndex = 0)), s = i - e.pagination.dynamicBulletIndex, p = ((l = s + (Math.min(c.length, r.dynamicMainBullets) - 1)) + s) / 2), c.removeClass(r.bulletActiveClass + " " + r.bulletActiveClass + "-next " + r.bulletActiveClass + "-next-next " + r.bulletActiveClass + "-prev " + r.bulletActiveClass + "-prev-prev " + r.bulletActiveClass + "-main"), 1 < n.length) c.each(function(e, t) {
                            var a = $(t),
                                n = a.index();
                            n === i && a.addClass(r.bulletActiveClass), r.dynamicBullets && (s <= n && n <= l && a.addClass(r.bulletActiveClass + "-main"), n === s && a.prev().addClass(r.bulletActiveClass + "-prev").prev().addClass(r.bulletActiveClass + "-prev-prev"), n === l && a.next().addClass(r.bulletActiveClass + "-next").next().addClass(r.bulletActiveClass + "-next-next"))
                        });
                        else if (c.eq(i).addClass(r.bulletActiveClass), r.dynamicBullets) {
                            for (var d = c.eq(s), u = c.eq(l), h = s; h <= l; h += 1) c.eq(h).addClass(r.bulletActiveClass + "-main");
                            d.prev().addClass(r.bulletActiveClass + "-prev").prev().addClass(r.bulletActiveClass + "-prev-prev"), u.next().addClass(r.bulletActiveClass + "-next").next().addClass(r.bulletActiveClass + "-next-next")
                        }
                        if (r.dynamicBullets) {
                            var f = Math.min(c.length, r.dynamicMainBullets + 4),
                                m = (e.pagination.bulletSize * f - e.pagination.bulletSize) / 2 - p * e.pagination.bulletSize,
                                v = t ? "right" : "left";
                            c.css(e.isHorizontal() ? v : "top", m + "px")
                        }
                    }
                    if ("fraction" === r.type && (n.find("." + r.currentClass).text(r.formatFractionCurrent(i + 1)), n.find("." + r.totalClass).text(r.formatFractionTotal(o))), "progressbar" === r.type) {
                        var g;
                        g = r.progressbarOpposite ? e.isHorizontal() ? "vertical" : "horizontal" : e.isHorizontal() ? "horizontal" : "vertical";
                        var b = (i + 1) / o,
                            y = 1,
                            w = 1;
                        "horizontal" === g ? y = b : w = b, n.find("." + r.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + y + ") scaleY(" + w + ")").transition(e.params.speed)
                    }
                    "custom" === r.type && r.renderCustom ? (n.html(r.renderCustom(e, i + 1, o)), e.emit("paginationRender", e, n[0])) : e.emit("paginationUpdate", e, n[0]), n[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](r.lockClass)
                }
            },
            render: function() {
                var e = this,
                    t = e.params.pagination;
                if (t.el && e.pagination.el && e.pagination.$el && 0 !== e.pagination.$el.length) {
                    var a = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
                        n = e.pagination.$el,
                        r = "";
                    if ("bullets" === t.type) {
                        for (var i = e.params.loop ? Math.ceil((a - 2 * e.loopedSlides) / e.params.slidesPerGroup) : e.snapGrid.length, o = 0; o < i; o += 1) t.renderBullet ? r += t.renderBullet.call(e, o, t.bulletClass) : r += "<" + t.bulletElement + ' class="' + t.bulletClass + '"></' + t.bulletElement + ">";
                        n.html(r), e.pagination.bullets = n.find("." + t.bulletClass)
                    }
                    "fraction" === t.type && (r = t.renderFraction ? t.renderFraction.call(e, t.currentClass, t.totalClass) : '<span class="' + t.currentClass + '"></span> / <span class="' + t.totalClass + '"></span>', n.html(r)), "progressbar" === t.type && (r = t.renderProgressbar ? t.renderProgressbar.call(e, t.progressbarFillClass) : '<span class="' + t.progressbarFillClass + '"></span>', n.html(r)), "custom" !== t.type && e.emit("paginationRender", e.pagination.$el[0])
                }
            },
            init: function() {
                var a = this,
                    e = a.params.pagination;
                if (e.el) {
                    var t = $(e.el);
                    0 !== t.length && (a.params.uniqueNavElements && "string" == typeof e.el && 1 < t.length && 1 === a.$el.find(e.el).length && (t = a.$el.find(e.el)), "bullets" === e.type && e.clickable && t.addClass(e.clickableClass), t.addClass(e.modifierClass + e.type), "bullets" === e.type && e.dynamicBullets && (t.addClass("" + e.modifierClass + e.type + "-dynamic"), a.pagination.dynamicBulletIndex = 0, e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)), "progressbar" === e.type && e.progressbarOpposite && t.addClass(e.progressbarOppositeClass), e.clickable && t.on("click", "." + e.bulletClass, function(e) {
                        e.preventDefault();
                        var t = $(this).index() * a.params.slidesPerGroup;
                        a.params.loop && (t += a.loopedSlides), a.slideTo(t)
                    }), Utils.extend(a.pagination, { $el: t, el: t[0] }))
                }
            },
            destroy: function() {
                var e = this.params.pagination;
                if (e.el && this.pagination.el && this.pagination.$el && 0 !== this.pagination.$el.length) {
                    var t = this.pagination.$el;
                    t.removeClass(e.hiddenClass), t.removeClass(e.modifierClass + e.type), this.pagination.bullets && this.pagination.bullets.removeClass(e.bulletActiveClass), e.clickable && t.off("click", "." + e.bulletClass)
                }
            }
        },
        Pagination$1 = { name: "pagination", params: { pagination: { el: null, bulletElement: "span", clickable: !1, hideOnClick: !1, renderBullet: null, renderProgressbar: null, renderFraction: null, renderCustom: null, progressbarOpposite: !1, type: "bullets", dynamicBullets: !1, dynamicMainBullets: 1, formatFractionCurrent: function(e) { return e }, formatFractionTotal: function(e) { return e }, bulletClass: "swiper-pagination-bullet", bulletActiveClass: "swiper-pagination-bullet-active", modifierClass: "swiper-pagination-", currentClass: "swiper-pagination-current", totalClass: "swiper-pagination-total", hiddenClass: "swiper-pagination-hidden", progressbarFillClass: "swiper-pagination-progressbar-fill", progressbarOppositeClass: "swiper-pagination-progressbar-opposite", clickableClass: "swiper-pagination-clickable", lockClass: "swiper-pagination-lock" } }, create: function() { Utils.extend(this, { pagination: { init: Pagination.init.bind(this), render: Pagination.render.bind(this), update: Pagination.update.bind(this), destroy: Pagination.destroy.bind(this), dynamicBulletIndex: 0 } }) }, on: { init: function() { this.pagination.init(), this.pagination.render(), this.pagination.update() }, activeIndexChange: function() { this.params.loop ? this.pagination.update() : void 0 === this.snapIndex && this.pagination.update() }, snapIndexChange: function() { this.params.loop || this.pagination.update() }, slidesLengthChange: function() { this.params.loop && (this.pagination.render(), this.pagination.update()) }, snapGridLengthChange: function() { this.params.loop || (this.pagination.render(), this.pagination.update()) }, destroy: function() { this.pagination.destroy() }, click: function(e) { this.params.pagination.el && this.params.pagination.hideOnClick && 0 < this.pagination.$el.length && !$(e.target).hasClass(this.params.pagination.bulletClass) && this.pagination.$el.toggleClass(this.params.pagination.hiddenClass) } } },
        Scrollbar = {
            setTranslate: function() {
                if (this.params.scrollbar.el && this.scrollbar.el) {
                    var e = this.scrollbar,
                        t = this.rtlTranslate,
                        a = this.progress,
                        n = e.dragSize,
                        r = e.trackSize,
                        i = e.$dragEl,
                        o = e.$el,
                        s = this.params.scrollbar,
                        l = n,
                        p = (r - n) * a;
                    t ? 0 < (p = -p) ? (l = n - p, p = 0) : r < -p + n && (l = r + p) : p < 0 ? (l = n + p, p = 0) : r < p + n && (l = r - p), this.isHorizontal() ? (Support.transforms3d ? i.transform("translate3d(" + p + "px, 0, 0)") : i.transform("translateX(" + p + "px)"), i[0].style.width = l + "px") : (Support.transforms3d ? i.transform("translate3d(0px, " + p + "px, 0)") : i.transform("translateY(" + p + "px)"), i[0].style.height = l + "px"), s.hide && (clearTimeout(this.scrollbar.timeout), o[0].style.opacity = 1, this.scrollbar.timeout = setTimeout(function() { o[0].style.opacity = 0, o.transition(400) }, 1e3))
                }
            },
            setTransition: function(e) { this.params.scrollbar.el && this.scrollbar.el && this.scrollbar.$dragEl.transition(e) },
            updateSize: function() {
                var e = this;
                if (e.params.scrollbar.el && e.scrollbar.el) {
                    var t = e.scrollbar,
                        a = t.$dragEl,
                        n = t.$el;
                    a[0].style.width = "", a[0].style.height = "";
                    var r, i = e.isHorizontal() ? n[0].offsetWidth : n[0].offsetHeight,
                        o = e.size / e.virtualSize,
                        s = o * (i / e.size);
                    r = "auto" === e.params.scrollbar.dragSize ? i * o : parseInt(e.params.scrollbar.dragSize, 10), e.isHorizontal() ? a[0].style.width = r + "px" : a[0].style.height = r + "px", n[0].style.display = 1 <= o ? "none" : "", e.params.scrollbarHide && (n[0].style.opacity = 0), Utils.extend(t, { trackSize: i, divider: o, moveDivider: s, dragSize: r }), t.$el[e.params.watchOverflow && e.isLocked ? "addClass" : "removeClass"](e.params.scrollbar.lockClass)
                }
            },
            setDragPosition: function(e) {
                var t, a = this,
                    n = a.scrollbar,
                    r = a.rtlTranslate,
                    i = n.$el,
                    o = n.dragSize,
                    s = n.trackSize;
                t = ((a.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY) - i.offset()[a.isHorizontal() ? "left" : "top"] - o / 2) / (s - o), t = Math.max(Math.min(t, 1), 0), r && (t = 1 - t);
                var l = a.minTranslate() + (a.maxTranslate() - a.minTranslate()) * t;
                a.updateProgress(l), a.setTranslate(l), a.updateActiveIndex(), a.updateSlidesClasses()
            },
            onDragStart: function(e) {
                var t = this.params.scrollbar,
                    a = this.scrollbar,
                    n = this.$wrapperEl,
                    r = a.$el,
                    i = a.$dragEl;
                this.scrollbar.isTouched = !0, e.preventDefault(), e.stopPropagation(), n.transition(100), i.transition(100), a.setDragPosition(e), clearTimeout(this.scrollbar.dragTimeout), r.transition(0), t.hide && r.css("opacity", 1), this.emit("scrollbarDragStart", e)
            },
            onDragMove: function(e) {
                var t = this.scrollbar,
                    a = this.$wrapperEl,
                    n = t.$el,
                    r = t.$dragEl;
                this.scrollbar.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.setDragPosition(e), a.transition(0), n.transition(0), r.transition(0), this.emit("scrollbarDragMove", e))
            },
            onDragEnd: function(e) {
                var t = this.params.scrollbar,
                    a = this.scrollbar.$el;
                this.scrollbar.isTouched && (this.scrollbar.isTouched = !1, t.hide && (clearTimeout(this.scrollbar.dragTimeout), this.scrollbar.dragTimeout = Utils.nextTick(function() { a.css("opacity", 0), a.transition(400) }, 1e3)), this.emit("scrollbarDragEnd", e), t.snapOnRelease && this.slideToClosest())
            },
            enableDraggable: function() {
                var e = this;
                if (e.params.scrollbar.el) {
                    var t = e.scrollbar,
                        a = e.touchEventsTouch,
                        n = e.touchEventsDesktop,
                        r = e.params,
                        i = t.$el[0],
                        o = !(!Support.passiveListener || !r.passiveListeners) && { passive: !1, capture: !1 },
                        s = !(!Support.passiveListener || !r.passiveListeners) && { passive: !0, capture: !1 };
                    Support.touch ? (i.addEventListener(a.start, e.scrollbar.onDragStart, o), i.addEventListener(a.move, e.scrollbar.onDragMove, o), i.addEventListener(a.end, e.scrollbar.onDragEnd, s)) : (i.addEventListener(n.start, e.scrollbar.onDragStart, o), doc.addEventListener(n.move, e.scrollbar.onDragMove, o), doc.addEventListener(n.end, e.scrollbar.onDragEnd, s))
                }
            },
            disableDraggable: function() {
                var e = this;
                if (e.params.scrollbar.el) {
                    var t = e.scrollbar,
                        a = e.touchEventsTouch,
                        n = e.touchEventsDesktop,
                        r = e.params,
                        i = t.$el[0],
                        o = !(!Support.passiveListener || !r.passiveListeners) && { passive: !1, capture: !1 },
                        s = !(!Support.passiveListener || !r.passiveListeners) && { passive: !0, capture: !1 };
                    Support.touch ? (i.removeEventListener(a.start, e.scrollbar.onDragStart, o), i.removeEventListener(a.move, e.scrollbar.onDragMove, o), i.removeEventListener(a.end, e.scrollbar.onDragEnd, s)) : (i.removeEventListener(n.start, e.scrollbar.onDragStart, o), doc.removeEventListener(n.move, e.scrollbar.onDragMove, o), doc.removeEventListener(n.end, e.scrollbar.onDragEnd, s))
                }
            },
            init: function() {
                if (this.params.scrollbar.el) {
                    var e = this.scrollbar,
                        t = this.$el,
                        a = this.params.scrollbar,
                        n = $(a.el);
                    this.params.uniqueNavElements && "string" == typeof a.el && 1 < n.length && 1 === t.find(a.el).length && (n = t.find(a.el));
                    var r = n.find("." + this.params.scrollbar.dragClass);
                    0 === r.length && (r = $('<div class="' + this.params.scrollbar.dragClass + '"></div>'), n.append(r)), Utils.extend(e, { $el: n, el: n[0], $dragEl: r, dragEl: r[0] }), a.draggable && e.enableDraggable()
                }
            },
            destroy: function() { this.scrollbar.disableDraggable() }
        },
        Scrollbar$1 = {
            name: "scrollbar",
            params: { scrollbar: { el: null, dragSize: "auto", hide: !1, draggable: !1, snapOnRelease: !0, lockClass: "swiper-scrollbar-lock", dragClass: "swiper-scrollbar-drag" } },
            create: function() {
                var e = this;
                Utils.extend(e, { scrollbar: { init: Scrollbar.init.bind(e), destroy: Scrollbar.destroy.bind(e), updateSize: Scrollbar.updateSize.bind(e), setTranslate: Scrollbar.setTranslate.bind(e), setTransition: Scrollbar.setTransition.bind(e), enableDraggable: Scrollbar.enableDraggable.bind(e), disableDraggable: Scrollbar.disableDraggable.bind(e), setDragPosition: Scrollbar.setDragPosition.bind(e), onDragStart: Scrollbar.onDragStart.bind(e), onDragMove: Scrollbar.onDragMove.bind(e), onDragEnd: Scrollbar.onDragEnd.bind(e), isTouched: !1, timeout: null, dragTimeout: null } })
            },
            on: { init: function() { this.scrollbar.init(), this.scrollbar.updateSize(), this.scrollbar.setTranslate() }, update: function() { this.scrollbar.updateSize() }, resize: function() { this.scrollbar.updateSize() }, observerUpdate: function() { this.scrollbar.updateSize() }, setTranslate: function() { this.scrollbar.setTranslate() }, setTransition: function(e) { this.scrollbar.setTransition(e) }, destroy: function() { this.scrollbar.destroy() } }
        },
        Parallax = {
            setTransform: function(e, t) {
                var a = this.rtl,
                    n = $(e),
                    r = a ? -1 : 1,
                    i = n.attr("data-swiper-parallax") || "0",
                    o = n.attr("data-swiper-parallax-x"),
                    s = n.attr("data-swiper-parallax-y"),
                    l = n.attr("data-swiper-parallax-scale"),
                    p = n.attr("data-swiper-parallax-opacity");
                if (o || s ? (o = o || "0", s = s || "0") : this.isHorizontal() ? (o = i, s = "0") : (s = i, o = "0"), o = 0 <= o.indexOf("%") ? parseInt(o, 10) * t * r + "%" : o * t * r + "px", s = 0 <= s.indexOf("%") ? parseInt(s, 10) * t + "%" : s * t + "px", null != p) {
                    var c = p - (p - 1) * (1 - Math.abs(t));
                    n[0].style.opacity = c
                }
                if (null == l) n.transform("translate3d(" + o + ", " + s + ", 0px)");
                else {
                    var d = l - (l - 1) * (1 - Math.abs(t));
                    n.transform("translate3d(" + o + ", " + s + ", 0px) scale(" + d + ")")
                }
            },
            setTranslate: function() {
                var n = this,
                    e = n.$el,
                    t = n.slides,
                    r = n.progress,
                    i = n.snapGrid;
                e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e, t) { n.parallax.setTransform(t, r) }), t.each(function(e, t) {
                    var a = t.progress;
                    1 < n.params.slidesPerGroup && "auto" !== n.params.slidesPerView && (a += Math.ceil(e / 2) - r * (i.length - 1)), a = Math.min(Math.max(a, -1), 1), $(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e, t) { n.parallax.setTransform(t, a) })
                })
            },
            setTransition: function(r) {
                void 0 === r && (r = this.params.speed);
                this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(e, t) {
                    var a = $(t),
                        n = parseInt(a.attr("data-swiper-parallax-duration"), 10) || r;
                    0 === r && (n = 0), a.transition(n)
                })
            }
        },
        Parallax$1 = { name: "parallax", params: { parallax: { enabled: !1 } }, create: function() { Utils.extend(this, { parallax: { setTransform: Parallax.setTransform.bind(this), setTranslate: Parallax.setTranslate.bind(this), setTransition: Parallax.setTransition.bind(this) } }) }, on: { beforeInit: function() { this.params.parallax.enabled && (this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0) }, init: function() { this.params.parallax && this.parallax.setTranslate() }, setTranslate: function() { this.params.parallax && this.parallax.setTranslate() }, setTransition: function(e) { this.params.parallax && this.parallax.setTransition(e) } } },
        Zoom = {
            getDistanceBetweenTouches: function(e) {
                if (e.targetTouches.length < 2) return 1;
                var t = e.targetTouches[0].pageX,
                    a = e.targetTouches[0].pageY,
                    n = e.targetTouches[1].pageX,
                    r = e.targetTouches[1].pageY;
                return Math.sqrt(Math.pow(n - t, 2) + Math.pow(r - a, 2))
            },
            onGestureStart: function(e) {
                var t = this.params.zoom,
                    a = this.zoom,
                    n = a.gesture;
                if (a.fakeGestureTouched = !1, a.fakeGestureMoved = !1, !Support.gestures) {
                    if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
                    a.fakeGestureTouched = !0, n.scaleStart = Zoom.getDistanceBetweenTouches(e)
                }
                n.$slideEl && n.$slideEl.length || (n.$slideEl = $(e.target).closest(".swiper-slide"), 0 === n.$slideEl.length && (n.$slideEl = this.slides.eq(this.activeIndex)), n.$imageEl = n.$slideEl.find("img, svg, canvas"), n.$imageWrapEl = n.$imageEl.parent("." + t.containerClass), n.maxRatio = n.$imageWrapEl.attr("data-swiper-zoom") || t.maxRatio, 0 !== n.$imageWrapEl.length) ? (n.$imageEl.transition(0), this.zoom.isScaling = !0) : n.$imageEl = void 0
            },
            onGestureChange: function(e) {
                var t = this.params.zoom,
                    a = this.zoom,
                    n = a.gesture;
                if (!Support.gestures) {
                    if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
                    a.fakeGestureMoved = !0, n.scaleMove = Zoom.getDistanceBetweenTouches(e)
                }
                n.$imageEl && 0 !== n.$imageEl.length && (Support.gestures ? this.zoom.scale = e.scale * a.currentScale : a.scale = n.scaleMove / n.scaleStart * a.currentScale, a.scale > n.maxRatio && (a.scale = n.maxRatio - 1 + Math.pow(a.scale - n.maxRatio + 1, .5)), a.scale < t.minRatio && (a.scale = t.minRatio + 1 - Math.pow(t.minRatio - a.scale + 1, .5)), n.$imageEl.transform("translate3d(0,0,0) scale(" + a.scale + ")"))
            },
            onGestureEnd: function(e) {
                var t = this.params.zoom,
                    a = this.zoom,
                    n = a.gesture;
                if (!Support.gestures) {
                    if (!a.fakeGestureTouched || !a.fakeGestureMoved) return;
                    if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !Device.android) return;
                    a.fakeGestureTouched = !1, a.fakeGestureMoved = !1
                }
                n.$imageEl && 0 !== n.$imageEl.length && (a.scale = Math.max(Math.min(a.scale, n.maxRatio), t.minRatio), n.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale(" + a.scale + ")"), a.currentScale = a.scale, a.isScaling = !1, 1 === a.scale && (n.$slideEl = void 0))
            },
            onTouchStart: function(e) {
                var t = this.zoom,
                    a = t.gesture,
                    n = t.image;
                a.$imageEl && 0 !== a.$imageEl.length && (n.isTouched || (Device.android && e.preventDefault(), n.isTouched = !0, n.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, n.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY))
            },
            onTouchMove: function(e) {
                var t = this.zoom,
                    a = t.gesture,
                    n = t.image,
                    r = t.velocity;
                if (a.$imageEl && 0 !== a.$imageEl.length && (this.allowClick = !1, n.isTouched && a.$slideEl)) {
                    n.isMoved || (n.width = a.$imageEl[0].offsetWidth, n.height = a.$imageEl[0].offsetHeight, n.startX = Utils.getTranslate(a.$imageWrapEl[0], "x") || 0, n.startY = Utils.getTranslate(a.$imageWrapEl[0], "y") || 0, a.slideWidth = a.$slideEl[0].offsetWidth, a.slideHeight = a.$slideEl[0].offsetHeight, a.$imageWrapEl.transition(0), this.rtl && (n.startX = -n.startX, n.startY = -n.startY));
                    var i = n.width * t.scale,
                        o = n.height * t.scale;
                    if (!(i < a.slideWidth && o < a.slideHeight)) {
                        if (n.minX = Math.min(a.slideWidth / 2 - i / 2, 0), n.maxX = -n.minX, n.minY = Math.min(a.slideHeight / 2 - o / 2, 0), n.maxY = -n.minY, n.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, n.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, !n.isMoved && !t.isScaling) { if (this.isHorizontal() && (Math.floor(n.minX) === Math.floor(n.startX) && n.touchesCurrent.x < n.touchesStart.x || Math.floor(n.maxX) === Math.floor(n.startX) && n.touchesCurrent.x > n.touchesStart.x)) return void(n.isTouched = !1); if (!this.isHorizontal() && (Math.floor(n.minY) === Math.floor(n.startY) && n.touchesCurrent.y < n.touchesStart.y || Math.floor(n.maxY) === Math.floor(n.startY) && n.touchesCurrent.y > n.touchesStart.y)) return void(n.isTouched = !1) }
                        e.preventDefault(), e.stopPropagation(), n.isMoved = !0, n.currentX = n.touchesCurrent.x - n.touchesStart.x + n.startX, n.currentY = n.touchesCurrent.y - n.touchesStart.y + n.startY, n.currentX < n.minX && (n.currentX = n.minX + 1 - Math.pow(n.minX - n.currentX + 1, .8)), n.currentX > n.maxX && (n.currentX = n.maxX - 1 + Math.pow(n.currentX - n.maxX + 1, .8)), n.currentY < n.minY && (n.currentY = n.minY + 1 - Math.pow(n.minY - n.currentY + 1, .8)), n.currentY > n.maxY && (n.currentY = n.maxY - 1 + Math.pow(n.currentY - n.maxY + 1, .8)), r.prevPositionX || (r.prevPositionX = n.touchesCurrent.x), r.prevPositionY || (r.prevPositionY = n.touchesCurrent.y), r.prevTime || (r.prevTime = Date.now()), r.x = (n.touchesCurrent.x - r.prevPositionX) / (Date.now() - r.prevTime) / 2, r.y = (n.touchesCurrent.y - r.prevPositionY) / (Date.now() - r.prevTime) / 2, Math.abs(n.touchesCurrent.x - r.prevPositionX) < 2 && (r.x = 0), Math.abs(n.touchesCurrent.y - r.prevPositionY) < 2 && (r.y = 0), r.prevPositionX = n.touchesCurrent.x, r.prevPositionY = n.touchesCurrent.y, r.prevTime = Date.now(), a.$imageWrapEl.transform("translate3d(" + n.currentX + "px, " + n.currentY + "px,0)")
                    }
                }
            },
            onTouchEnd: function() {
                var e = this.zoom,
                    t = e.gesture,
                    a = e.image,
                    n = e.velocity;
                if (t.$imageEl && 0 !== t.$imageEl.length) {
                    if (!a.isTouched || !a.isMoved) return a.isTouched = !1, void(a.isMoved = !1);
                    a.isTouched = !1, a.isMoved = !1;
                    var r = 300,
                        i = 300,
                        o = n.x * r,
                        s = a.currentX + o,
                        l = n.y * i,
                        p = a.currentY + l;
                    0 !== n.x && (r = Math.abs((s - a.currentX) / n.x)), 0 !== n.y && (i = Math.abs((p - a.currentY) / n.y));
                    var c = Math.max(r, i);
                    a.currentX = s, a.currentY = p;
                    var d = a.width * e.scale,
                        u = a.height * e.scale;
                    a.minX = Math.min(t.slideWidth / 2 - d / 2, 0), a.maxX = -a.minX, a.minY = Math.min(t.slideHeight / 2 - u / 2, 0), a.maxY = -a.minY, a.currentX = Math.max(Math.min(a.currentX, a.maxX), a.minX), a.currentY = Math.max(Math.min(a.currentY, a.maxY), a.minY), t.$imageWrapEl.transition(c).transform("translate3d(" + a.currentX + "px, " + a.currentY + "px,0)")
                }
            },
            onTransitionEnd: function() {
                var e = this.zoom,
                    t = e.gesture;
                t.$slideEl && this.previousIndex !== this.activeIndex && (t.$imageEl.transform("translate3d(0,0,0) scale(1)"), t.$imageWrapEl.transform("translate3d(0,0,0)"), t.$slideEl = void 0, t.$imageEl = void 0, t.$imageWrapEl = void 0, e.scale = 1, e.currentScale = 1)
            },
            toggle: function(e) {
                var t = this.zoom;
                t.scale && 1 !== t.scale ? t.out() : t.in(e)
            },
            in: function(e) {
                var t, a, n, r, i, o, s, l, p, c, d, u, h, f, m, v, g = this.zoom,
                    b = this.params.zoom,
                    y = g.gesture,
                    w = g.image;
                (y.$slideEl || (y.$slideEl = this.clickedSlide ? $(this.clickedSlide) : this.slides.eq(this.activeIndex), y.$imageEl = y.$slideEl.find("img, svg, canvas"), y.$imageWrapEl = y.$imageEl.parent("." + b.containerClass)), y.$imageEl && 0 !== y.$imageEl.length) && (y.$slideEl.addClass("" + b.zoomedSlideClass), a = void 0 === w.touchesStart.x && e ? (t = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX, "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (t = w.touchesStart.x, w.touchesStart.y), g.scale = y.$imageWrapEl.attr("data-swiper-zoom") || b.maxRatio, g.currentScale = y.$imageWrapEl.attr("data-swiper-zoom") || b.maxRatio, e ? (m = y.$slideEl[0].offsetWidth, v = y.$slideEl[0].offsetHeight, n = y.$slideEl.offset().left + m / 2 - t, r = y.$slideEl.offset().top + v / 2 - a, s = y.$imageEl[0].offsetWidth, l = y.$imageEl[0].offsetHeight, p = s * g.scale, c = l * g.scale, h = -(d = Math.min(m / 2 - p / 2, 0)), f = -(u = Math.min(v / 2 - c / 2, 0)), (i = n * g.scale) < d && (i = d), h < i && (i = h), (o = r * g.scale) < u && (o = u), f < o && (o = f)) : o = i = 0, y.$imageWrapEl.transition(300).transform("translate3d(" + i + "px, " + o + "px,0)"), y.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + g.scale + ")"))
            },
            out: function() {
                var e = this.zoom,
                    t = this.params.zoom,
                    a = e.gesture;
                a.$slideEl || (a.$slideEl = this.clickedSlide ? $(this.clickedSlide) : this.slides.eq(this.activeIndex), a.$imageEl = a.$slideEl.find("img, svg, canvas"), a.$imageWrapEl = a.$imageEl.parent("." + t.containerClass)), a.$imageEl && 0 !== a.$imageEl.length && (e.scale = 1, e.currentScale = 1, a.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"), a.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), a.$slideEl.removeClass("" + t.zoomedSlideClass), a.$slideEl = void 0)
            },
            enable: function() {
                var e = this,
                    t = e.zoom;
                if (!t.enabled) {
                    t.enabled = !0;
                    var a = !("touchstart" !== e.touchEvents.start || !Support.passiveListener || !e.params.passiveListeners) && { passive: !0, capture: !1 };
                    Support.gestures ? (e.$wrapperEl.on("gesturestart", ".swiper-slide", t.onGestureStart, a), e.$wrapperEl.on("gesturechange", ".swiper-slide", t.onGestureChange, a), e.$wrapperEl.on("gestureend", ".swiper-slide", t.onGestureEnd, a)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.on(e.touchEvents.start, ".swiper-slide", t.onGestureStart, a), e.$wrapperEl.on(e.touchEvents.move, ".swiper-slide", t.onGestureChange, a), e.$wrapperEl.on(e.touchEvents.end, ".swiper-slide", t.onGestureEnd, a)), e.$wrapperEl.on(e.touchEvents.move, "." + e.params.zoom.containerClass, t.onTouchMove)
                }
            },
            disable: function() {
                var e = this,
                    t = e.zoom;
                if (t.enabled) {
                    e.zoom.enabled = !1;
                    var a = !("touchstart" !== e.touchEvents.start || !Support.passiveListener || !e.params.passiveListeners) && { passive: !0, capture: !1 };
                    Support.gestures ? (e.$wrapperEl.off("gesturestart", ".swiper-slide", t.onGestureStart, a), e.$wrapperEl.off("gesturechange", ".swiper-slide", t.onGestureChange, a), e.$wrapperEl.off("gestureend", ".swiper-slide", t.onGestureEnd, a)) : "touchstart" === e.touchEvents.start && (e.$wrapperEl.off(e.touchEvents.start, ".swiper-slide", t.onGestureStart, a), e.$wrapperEl.off(e.touchEvents.move, ".swiper-slide", t.onGestureChange, a), e.$wrapperEl.off(e.touchEvents.end, ".swiper-slide", t.onGestureEnd, a)), e.$wrapperEl.off(e.touchEvents.move, "." + e.params.zoom.containerClass, t.onTouchMove)
                }
            }
        },
        Zoom$1 = {
            name: "zoom",
            params: { zoom: { enabled: !1, maxRatio: 3, minRatio: 1, toggle: !0, containerClass: "swiper-zoom-container", zoomedSlideClass: "swiper-slide-zoomed" } },
            create: function() {
                var t = this,
                    a = { enabled: !1, scale: 1, currentScale: 1, isScaling: !1, gesture: { $slideEl: void 0, slideWidth: void 0, slideHeight: void 0, $imageEl: void 0, $imageWrapEl: void 0, maxRatio: 3 }, image: { isTouched: void 0, isMoved: void 0, currentX: void 0, currentY: void 0, minX: void 0, minY: void 0, maxX: void 0, maxY: void 0, width: void 0, height: void 0, startX: void 0, startY: void 0, touchesStart: {}, touchesCurrent: {} }, velocity: { x: void 0, y: void 0, prevPositionX: void 0, prevPositionY: void 0, prevTime: void 0 } };
                "onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach(function(e) { a[e] = Zoom[e].bind(t) }), Utils.extend(t, { zoom: a })
            },
            on: { init: function() { this.params.zoom.enabled && this.zoom.enable() }, destroy: function() { this.zoom.disable() }, touchStart: function(e) { this.zoom.enabled && this.zoom.onTouchStart(e) }, touchEnd: function(e) { this.zoom.enabled && this.zoom.onTouchEnd(e) }, doubleTap: function(e) { this.params.zoom.enabled && this.zoom.enabled && this.params.zoom.toggle && this.zoom.toggle(e) }, transitionEnd: function() { this.zoom.enabled && this.params.zoom.enabled && this.zoom.onTransitionEnd() } }
        },
        Lazy$2 = {
            loadInSlide: function(e, l) {
                void 0 === l && (l = !0);
                var p = this,
                    c = p.params.lazy;
                if (void 0 !== e && 0 !== p.slides.length) {
                    var d = p.virtual && p.params.virtual.enabled ? p.$wrapperEl.children("." + p.params.slideClass + '[data-swiper-slide-index="' + e + '"]') : p.slides.eq(e),
                        t = d.find("." + c.elementClass + ":not(." + c.loadedClass + "):not(." + c.loadingClass + ")");
                    !d.hasClass(c.elementClass) || d.hasClass(c.loadedClass) || d.hasClass(c.loadingClass) || (t = t.add(d[0])), 0 !== t.length && t.each(function(e, t) {
                        var n = $(t);
                        n.addClass(c.loadingClass);
                        var r = n.attr("data-background"),
                            i = n.attr("data-src"),
                            o = n.attr("data-srcset"),
                            s = n.attr("data-sizes");
                        p.loadImage(n[0], i || r, o, s, !1, function() {
                            if (null != p && p && (!p || p.params) && !p.destroyed) {
                                if (r ? (n.css("background-image", 'url("' + r + '")'), n.removeAttr("data-background")) : (o && (n.attr("srcset", o), n.removeAttr("data-srcset")), s && (n.attr("sizes", s), n.removeAttr("data-sizes")), i && (n.attr("src", i), n.removeAttr("data-src"))), n.addClass(c.loadedClass).removeClass(c.loadingClass), d.find("." + c.preloaderClass).remove(), p.params.loop && l) {
                                    var e = d.attr("data-swiper-slide-index");
                                    if (d.hasClass(p.params.slideDuplicateClass)) {
                                        var t = p.$wrapperEl.children('[data-swiper-slide-index="' + e + '"]:not(.' + p.params.slideDuplicateClass + ")");
                                        p.lazy.loadInSlide(t.index(), !1)
                                    } else {
                                        var a = p.$wrapperEl.children("." + p.params.slideDuplicateClass + '[data-swiper-slide-index="' + e + '"]');
                                        p.lazy.loadInSlide(a.index(), !1)
                                    }
                                }
                                p.emit("lazyImageReady", d[0], n[0])
                            }
                        }), p.emit("lazyImageLoad", d[0], n[0])
                    })
                }
            },
            load: function() {
                var n = this,
                    t = n.$wrapperEl,
                    a = n.params,
                    r = n.slides,
                    e = n.activeIndex,
                    i = n.virtual && a.virtual.enabled,
                    o = a.lazy,
                    s = a.slidesPerView;

                function l(e) { if (i) { if (t.children("." + a.slideClass + '[data-swiper-slide-index="' + e + '"]').length) return !0 } else if (r[e]) return !0; return !1 }

                function p(e) { return i ? $(e).attr("data-swiper-slide-index") : $(e).index() }
                if ("auto" === s && (s = 0), n.lazy.initialImageLoaded || (n.lazy.initialImageLoaded = !0), n.params.watchSlidesVisibility) t.children("." + a.slideVisibleClass).each(function(e, t) {
                    var a = i ? $(t).attr("data-swiper-slide-index") : $(t).index();
                    n.lazy.loadInSlide(a)
                });
                else if (1 < s)
                    for (var c = e; c < e + s; c += 1) l(c) && n.lazy.loadInSlide(c);
                else n.lazy.loadInSlide(e);
                if (o.loadPrevNext)
                    if (1 < s || o.loadPrevNextAmount && 1 < o.loadPrevNextAmount) { for (var d = o.loadPrevNextAmount, u = s, h = Math.min(e + u + Math.max(d, u), r.length), f = Math.max(e - Math.max(u, d), 0), m = e + s; m < h; m += 1) l(m) && n.lazy.loadInSlide(m); for (var v = f; v < e; v += 1) l(v) && n.lazy.loadInSlide(v) } else {
                        var g = t.children("." + a.slideNextClass);
                        0 < g.length && n.lazy.loadInSlide(p(g));
                        var b = t.children("." + a.slidePrevClass);
                        0 < b.length && n.lazy.loadInSlide(p(b))
                    }
            }
        },
        Lazy$3 = { name: "lazy", params: { lazy: { enabled: !1, loadPrevNext: !1, loadPrevNextAmount: 1, loadOnTransitionStart: !1, elementClass: "swiper-lazy", loadingClass: "swiper-lazy-loading", loadedClass: "swiper-lazy-loaded", preloaderClass: "swiper-lazy-preloader" } }, create: function() { Utils.extend(this, { lazy: { initialImageLoaded: !1, load: Lazy$2.load.bind(this), loadInSlide: Lazy$2.loadInSlide.bind(this) } }) }, on: { beforeInit: function() { this.params.lazy.enabled && this.params.preloadImages && (this.params.preloadImages = !1) }, init: function() { this.params.lazy.enabled && !this.params.loop && 0 === this.params.initialSlide && this.lazy.load() }, scroll: function() { this.params.freeMode && !this.params.freeModeSticky && this.lazy.load() }, resize: function() { this.params.lazy.enabled && this.lazy.load() }, scrollbarDragMove: function() { this.params.lazy.enabled && this.lazy.load() }, transitionStart: function() { this.params.lazy.enabled && (this.params.lazy.loadOnTransitionStart || !this.params.lazy.loadOnTransitionStart && !this.lazy.initialImageLoaded) && this.lazy.load() }, transitionEnd: function() { this.params.lazy.enabled && !this.params.lazy.loadOnTransitionStart && this.lazy.load() } } },
        Controller = {
            LinearSpline: function(e, t) { var a, n, r, i, o, s = function(e, t) { for (n = -1, a = e.length; 1 < a - n;) e[r = a + n >> 1] <= t ? n = r : a = r; return a }; return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function(e) { return e ? (o = s(this.x, e), i = o - 1, (e - this.x[i]) * (this.y[o] - this.y[i]) / (this.x[o] - this.x[i]) + this.y[i]) : 0 }, this },
            getInterpolateFunction: function(e) { this.controller.spline || (this.controller.spline = this.params.loop ? new Controller.LinearSpline(this.slidesGrid, e.slidesGrid) : new Controller.LinearSpline(this.snapGrid, e.snapGrid)) },
            setTranslate: function(e, t) {
                var a, n, r = this,
                    i = r.controller.control;

                function o(e) { var t = r.rtlTranslate ? -r.translate : r.translate; "slide" === r.params.controller.by && (r.controller.getInterpolateFunction(e), n = -r.controller.spline.interpolate(-t)), n && "container" !== r.params.controller.by || (a = (e.maxTranslate() - e.minTranslate()) / (r.maxTranslate() - r.minTranslate()), n = (t - r.minTranslate()) * a + e.minTranslate()), r.params.controller.inverse && (n = e.maxTranslate() - n), e.updateProgress(n), e.setTranslate(n, r), e.updateActiveIndex(), e.updateSlidesClasses() }
                if (Array.isArray(i))
                    for (var s = 0; s < i.length; s += 1) i[s] !== t && i[s] instanceof Swiper && o(i[s]);
                else i instanceof Swiper && t !== i && o(i)
            },
            setTransition: function(t, e) {
                var a, n = this,
                    r = n.controller.control;

                function i(e) { e.setTransition(t, n), 0 !== t && (e.transitionStart(), e.params.autoHeight && Utils.nextTick(function() { e.updateAutoHeight() }), e.$wrapperEl.transitionEnd(function() { r && (e.params.loop && "slide" === n.params.controller.by && e.loopFix(), e.transitionEnd()) })) }
                if (Array.isArray(r))
                    for (a = 0; a < r.length; a += 1) r[a] !== e && r[a] instanceof Swiper && i(r[a]);
                else r instanceof Swiper && e !== r && i(r)
            }
        },
        Controller$1 = { name: "controller", params: { controller: { control: void 0, inverse: !1, by: "slide" } }, create: function() { Utils.extend(this, { controller: { control: this.params.controller.control, getInterpolateFunction: Controller.getInterpolateFunction.bind(this), setTranslate: Controller.setTranslate.bind(this), setTransition: Controller.setTransition.bind(this) } }) }, on: { update: function() { this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline) }, resize: function() { this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline) }, observerUpdate: function() { this.controller.control && this.controller.spline && (this.controller.spline = void 0, delete this.controller.spline) }, setTranslate: function(e, t) { this.controller.control && this.controller.setTranslate(e, t) }, setTransition: function(e, t) { this.controller.control && this.controller.setTransition(e, t) } } },
        a11y = {
            makeElFocusable: function(e) { return e.attr("tabIndex", "0"), e },
            addElRole: function(e, t) { return e.attr("role", t), e },
            addElLabel: function(e, t) { return e.attr("aria-label", t), e },
            disableEl: function(e) { return e.attr("aria-disabled", !0), e },
            enableEl: function(e) { return e.attr("aria-disabled", !1), e },
            onEnterKey: function(e) {
                var t = this,
                    a = t.params.a11y;
                if (13 === e.keyCode) {
                    var n = $(e.target);
                    t.navigation && t.navigation.$nextEl && n.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(), t.isEnd ? t.a11y.notify(a.lastSlideMessage) : t.a11y.notify(a.nextSlideMessage)), t.navigation && t.navigation.$prevEl && n.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(), t.isBeginning ? t.a11y.notify(a.firstSlideMessage) : t.a11y.notify(a.prevSlideMessage)), t.pagination && n.is("." + t.params.pagination.bulletClass) && n[0].click()
                }
            },
            notify: function(e) {
                var t = this.a11y.liveRegion;
                0 !== t.length && (t.html(""), t.html(e))
            },
            updateNavigation: function() {
                if (!this.params.loop) {
                    var e = this.navigation,
                        t = e.$nextEl,
                        a = e.$prevEl;
                    a && 0 < a.length && (this.isBeginning ? this.a11y.disableEl(a) : this.a11y.enableEl(a)), t && 0 < t.length && (this.isEnd ? this.a11y.disableEl(t) : this.a11y.enableEl(t))
                }
            },
            updatePagination: function() {
                var n = this,
                    r = n.params.a11y;
                n.pagination && n.params.pagination.clickable && n.pagination.bullets && n.pagination.bullets.length && n.pagination.bullets.each(function(e, t) {
                    var a = $(t);
                    n.a11y.makeElFocusable(a), n.a11y.addElRole(a, "button"), n.a11y.addElLabel(a, r.paginationBulletMessage.replace(/{{index}}/, a.index() + 1))
                })
            },
            init: function() {
                var e = this;
                e.$el.append(e.a11y.liveRegion);
                var t, a, n = e.params.a11y;
                e.navigation && e.navigation.$nextEl && (t = e.navigation.$nextEl), e.navigation && e.navigation.$prevEl && (a = e.navigation.$prevEl), t && (e.a11y.makeElFocusable(t), e.a11y.addElRole(t, "button"), e.a11y.addElLabel(t, n.nextSlideMessage), t.on("keydown", e.a11y.onEnterKey)), a && (e.a11y.makeElFocusable(a), e.a11y.addElRole(a, "button"), e.a11y.addElLabel(a, n.prevSlideMessage), a.on("keydown", e.a11y.onEnterKey)), e.pagination && e.params.pagination.clickable && e.pagination.bullets && e.pagination.bullets.length && e.pagination.$el.on("keydown", "." + e.params.pagination.bulletClass, e.a11y.onEnterKey)
            },
            destroy: function() {
                var e, t, a = this;
                a.a11y.liveRegion && 0 < a.a11y.liveRegion.length && a.a11y.liveRegion.remove(), a.navigation && a.navigation.$nextEl && (e = a.navigation.$nextEl), a.navigation && a.navigation.$prevEl && (t = a.navigation.$prevEl), e && e.off("keydown", a.a11y.onEnterKey), t && t.off("keydown", a.a11y.onEnterKey), a.pagination && a.params.pagination.clickable && a.pagination.bullets && a.pagination.bullets.length && a.pagination.$el.off("keydown", "." + a.params.pagination.bulletClass, a.a11y.onEnterKey)
            }
        },
        A11y = {
            name: "a11y",
            params: { a11y: { enabled: !0, notificationClass: "swiper-notification", prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide", firstSlideMessage: "This is the first slide", lastSlideMessage: "This is the last slide", paginationBulletMessage: "Go to slide {{index}}" } },
            create: function() {
                var t = this;
                Utils.extend(t, { a11y: { liveRegion: $('<span class="' + t.params.a11y.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>') } }), Object.keys(a11y).forEach(function(e) { t.a11y[e] = a11y[e].bind(t) })
            },
            on: { init: function() { this.params.a11y.enabled && (this.a11y.init(), this.a11y.updateNavigation()) }, toEdge: function() { this.params.a11y.enabled && this.a11y.updateNavigation() }, fromEdge: function() { this.params.a11y.enabled && this.a11y.updateNavigation() }, paginationUpdate: function() { this.params.a11y.enabled && this.a11y.updatePagination() }, destroy: function() { this.params.a11y.enabled && this.a11y.destroy() } }
        },
        Autoplay = {
            run: function() {
                var e = this,
                    t = e.slides.eq(e.activeIndex),
                    a = e.params.autoplay.delay;
                t.attr("data-swiper-autoplay") && (a = t.attr("data-swiper-autoplay") || e.params.autoplay.delay), e.autoplay.timeout = Utils.nextTick(function() { e.params.autoplay.reverseDirection ? e.params.loop ? (e.loopFix(), e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.isBeginning ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(e.slides.length - 1, e.params.speed, !0, !0), e.emit("autoplay")) : (e.slidePrev(e.params.speed, !0, !0), e.emit("autoplay")) : e.params.loop ? (e.loopFix(), e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")) : e.isEnd ? e.params.autoplay.stopOnLastSlide ? e.autoplay.stop() : (e.slideTo(0, e.params.speed, !0, !0), e.emit("autoplay")) : (e.slideNext(e.params.speed, !0, !0), e.emit("autoplay")) }, a)
            },
            start: function() { return void 0 === this.autoplay.timeout && (!this.autoplay.running && (this.autoplay.running = !0, this.emit("autoplayStart"), this.autoplay.run(), !0)) },
            stop: function() { return !!this.autoplay.running && (void 0 !== this.autoplay.timeout && (this.autoplay.timeout && (clearTimeout(this.autoplay.timeout), this.autoplay.timeout = void 0), this.autoplay.running = !1, this.emit("autoplayStop"), !0)) },
            pause: function(e) {
                var t = this;
                t.autoplay.running && (t.autoplay.paused || (t.autoplay.timeout && clearTimeout(t.autoplay.timeout), t.autoplay.paused = !0, 0 !== e && t.params.autoplay.waitForTransition ? (t.$wrapperEl[0].addEventListener("transitionend", t.autoplay.onTransitionEnd), t.$wrapperEl[0].addEventListener("webkitTransitionEnd", t.autoplay.onTransitionEnd)) : (t.autoplay.paused = !1, t.autoplay.run())))
            }
        },
        Autoplay$1 = {
            name: "autoplay",
            params: { autoplay: { enabled: !1, delay: 3e3, waitForTransition: !0, disableOnInteraction: !0, stopOnLastSlide: !1, reverseDirection: !1 } },
            create: function() {
                var t = this;
                Utils.extend(t, { autoplay: { running: !1, paused: !1, run: Autoplay.run.bind(t), start: Autoplay.start.bind(t), stop: Autoplay.stop.bind(t), pause: Autoplay.pause.bind(t), onTransitionEnd: function(e) { t && !t.destroyed && t.$wrapperEl && e.target === this && (t.$wrapperEl[0].removeEventListener("transitionend", t.autoplay.onTransitionEnd), t.$wrapperEl[0].removeEventListener("webkitTransitionEnd", t.autoplay.onTransitionEnd), t.autoplay.paused = !1, t.autoplay.running ? t.autoplay.run() : t.autoplay.stop()) } } })
            },
            on: { init: function() { this.params.autoplay.enabled && this.autoplay.start() }, beforeTransitionStart: function(e, t) { this.autoplay.running && (t || !this.params.autoplay.disableOnInteraction ? this.autoplay.pause(e) : this.autoplay.stop()) }, sliderFirstMove: function() { this.autoplay.running && (this.params.autoplay.disableOnInteraction ? this.autoplay.stop() : this.autoplay.pause()) }, destroy: function() { this.autoplay.running && this.autoplay.stop() } }
        },
        Fade = {
            setTranslate: function() {
                for (var e = this.slides, t = 0; t < e.length; t += 1) {
                    var a = this.slides.eq(t),
                        n = -a[0].swiperSlideOffset;
                    this.params.virtualTranslate || (n -= this.translate);
                    var r = 0;
                    this.isHorizontal() || (r = n, n = 0);
                    var i = this.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(a[0].progress), 0) : 1 + Math.min(Math.max(a[0].progress, -1), 0);
                    a.css({ opacity: i }).transform("translate3d(" + n + "px, " + r + "px, 0px)")
                }
            },
            setTransition: function(e) {
                var a = this,
                    t = a.slides,
                    n = a.$wrapperEl;
                if (t.transition(e), a.params.virtualTranslate && 0 !== e) {
                    var r = !1;
                    t.transitionEnd(function() { if (!r && a && !a.destroyed) { r = !0, a.animating = !1; for (var e = ["webkitTransitionEnd", "transitionend"], t = 0; t < e.length; t += 1) n.trigger(e[t]) } })
                }
            }
        },
        EffectFade = {
            name: "effect-fade",
            params: { fadeEffect: { crossFade: !1 } },
            create: function() { Utils.extend(this, { fadeEffect: { setTranslate: Fade.setTranslate.bind(this), setTransition: Fade.setTransition.bind(this) } }) },
            on: {
                beforeInit: function() {
                    if ("fade" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "fade");
                        var e = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !0 };
                        Utils.extend(this.params, e), Utils.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() { "fade" === this.params.effect && this.fadeEffect.setTranslate() },
                setTransition: function(e) { "fade" === this.params.effect && this.fadeEffect.setTransition(e) }
            }
        },
        Cube = {
            setTranslate: function() {
                var e, t = this,
                    a = t.$el,
                    n = t.$wrapperEl,
                    r = t.slides,
                    i = t.width,
                    o = t.height,
                    s = t.rtlTranslate,
                    l = t.size,
                    p = t.params.cubeEffect,
                    c = t.isHorizontal(),
                    d = t.virtual && t.params.virtual.enabled,
                    u = 0;
                p.shadow && (c ? (0 === (e = n.find(".swiper-cube-shadow")).length && (e = $('<div class="swiper-cube-shadow"></div>'), n.append(e)), e.css({ height: i + "px" })) : 0 === (e = a.find(".swiper-cube-shadow")).length && (e = $('<div class="swiper-cube-shadow"></div>'), a.append(e)));
                for (var h = 0; h < r.length; h += 1) {
                    var f = r.eq(h),
                        m = h;
                    d && (m = parseInt(f.attr("data-swiper-slide-index"), 10));
                    var v = 90 * m,
                        g = Math.floor(v / 360);
                    s && (v = -v, g = Math.floor(-v / 360));
                    var b = Math.max(Math.min(f[0].progress, 1), -1),
                        y = 0,
                        w = 0,
                        C = 0;
                    m % 4 == 0 ? (y = 4 * -g * l, C = 0) : (m - 1) % 4 == 0 ? (y = 0, C = 4 * -g * l) : (m - 2) % 4 == 0 ? (y = l + 4 * g * l, C = l) : (m - 3) % 4 == 0 && (y = -l, C = 3 * l + 4 * l * g), s && (y = -y), c || (w = y, y = 0);
                    var x = "rotateX(" + (c ? 0 : -v) + "deg) rotateY(" + (c ? v : 0) + "deg) translate3d(" + y + "px, " + w + "px, " + C + "px)";
                    if (b <= 1 && -1 < b && (u = 90 * m + 90 * b, s && (u = 90 * -m - 90 * b)), f.transform(x), p.slideShadows) {
                        var E = c ? f.find(".swiper-slide-shadow-left") : f.find(".swiper-slide-shadow-top"),
                            k = c ? f.find(".swiper-slide-shadow-right") : f.find(".swiper-slide-shadow-bottom");
                        0 === E.length && (E = $('<div class="swiper-slide-shadow-' + (c ? "left" : "top") + '"></div>'), f.append(E)), 0 === k.length && (k = $('<div class="swiper-slide-shadow-' + (c ? "right" : "bottom") + '"></div>'), f.append(k)), E.length && (E[0].style.opacity = Math.max(-b, 0)), k.length && (k[0].style.opacity = Math.max(b, 0))
                    }
                }
                if (n.css({ "-webkit-transform-origin": "50% 50% -" + l / 2 + "px", "-moz-transform-origin": "50% 50% -" + l / 2 + "px", "-ms-transform-origin": "50% 50% -" + l / 2 + "px", "transform-origin": "50% 50% -" + l / 2 + "px" }), p.shadow)
                    if (c) e.transform("translate3d(0px, " + (i / 2 + p.shadowOffset) + "px, " + -i / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + p.shadowScale + ")");
                    else {
                        var S = Math.abs(u) - 90 * Math.floor(Math.abs(u) / 90),
                            T = 1.5 - (Math.sin(2 * S * Math.PI / 360) / 2 + Math.cos(2 * S * Math.PI / 360) / 2),
                            M = p.shadowScale,
                            P = p.shadowScale / T,
                            O = p.shadowOffset;
                        e.transform("scale3d(" + M + ", 1, " + P + ") translate3d(0px, " + (o / 2 + O) + "px, " + -o / 2 / P + "px) rotateX(-90deg)")
                    }
                var D = Browser.isSafari || Browser.isUiWebView ? -l / 2 : 0;
                n.transform("translate3d(0px,0," + D + "px) rotateX(" + (t.isHorizontal() ? 0 : u) + "deg) rotateY(" + (t.isHorizontal() ? -u : 0) + "deg)")
            },
            setTransition: function(e) {
                var t = this.$el;
                this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), this.params.cubeEffect.shadow && !this.isHorizontal() && t.find(".swiper-cube-shadow").transition(e)
            }
        },
        EffectCube = {
            name: "effect-cube",
            params: { cubeEffect: { slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94 } },
            create: function() { Utils.extend(this, { cubeEffect: { setTranslate: Cube.setTranslate.bind(this), setTransition: Cube.setTransition.bind(this) } }) },
            on: {
                beforeInit: function() {
                    if ("cube" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "cube"), this.classNames.push(this.params.containerModifierClass + "3d");
                        var e = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, resistanceRatio: 0, spaceBetween: 0, centeredSlides: !1, virtualTranslate: !0 };
                        Utils.extend(this.params, e), Utils.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() { "cube" === this.params.effect && this.cubeEffect.setTranslate() },
                setTransition: function(e) { "cube" === this.params.effect && this.cubeEffect.setTransition(e) }
            }
        },
        Flip = {
            setTranslate: function() {
                for (var e = this.slides, t = this.rtlTranslate, a = 0; a < e.length; a += 1) {
                    var n = e.eq(a),
                        r = n[0].progress;
                    this.params.flipEffect.limitRotation && (r = Math.max(Math.min(n[0].progress, 1), -1));
                    var i = -180 * r,
                        o = 0,
                        s = -n[0].swiperSlideOffset,
                        l = 0;
                    if (this.isHorizontal() ? t && (i = -i) : (l = s, o = -i, i = s = 0), n[0].style.zIndex = -Math.abs(Math.round(r)) + e.length, this.params.flipEffect.slideShadows) {
                        var p = this.isHorizontal() ? n.find(".swiper-slide-shadow-left") : n.find(".swiper-slide-shadow-top"),
                            c = this.isHorizontal() ? n.find(".swiper-slide-shadow-right") : n.find(".swiper-slide-shadow-bottom");
                        0 === p.length && (p = $('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "left" : "top") + '"></div>'), n.append(p)), 0 === c.length && (c = $('<div class="swiper-slide-shadow-' + (this.isHorizontal() ? "right" : "bottom") + '"></div>'), n.append(c)), p.length && (p[0].style.opacity = Math.max(-r, 0)), c.length && (c[0].style.opacity = Math.max(r, 0))
                    }
                    n.transform("translate3d(" + s + "px, " + l + "px, 0px) rotateX(" + o + "deg) rotateY(" + i + "deg)")
                }
            },
            setTransition: function(e) {
                var a = this,
                    t = a.slides,
                    n = a.activeIndex,
                    r = a.$wrapperEl;
                if (t.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), a.params.virtualTranslate && 0 !== e) {
                    var i = !1;
                    t.eq(n).transitionEnd(function() { if (!i && a && !a.destroyed) { i = !0, a.animating = !1; for (var e = ["webkitTransitionEnd", "transitionend"], t = 0; t < e.length; t += 1) r.trigger(e[t]) } })
                }
            }
        },
        EffectFlip = {
            name: "effect-flip",
            params: { flipEffect: { slideShadows: !0, limitRotation: !0 } },
            create: function() { Utils.extend(this, { flipEffect: { setTranslate: Flip.setTranslate.bind(this), setTransition: Flip.setTransition.bind(this) } }) },
            on: {
                beforeInit: function() {
                    if ("flip" === this.params.effect) {
                        this.classNames.push(this.params.containerModifierClass + "flip"), this.classNames.push(this.params.containerModifierClass + "3d");
                        var e = { slidesPerView: 1, slidesPerColumn: 1, slidesPerGroup: 1, watchSlidesProgress: !0, spaceBetween: 0, virtualTranslate: !0 };
                        Utils.extend(this.params, e), Utils.extend(this.originalParams, e)
                    }
                },
                setTranslate: function() { "flip" === this.params.effect && this.flipEffect.setTranslate() },
                setTransition: function(e) { "flip" === this.params.effect && this.flipEffect.setTransition(e) }
            }
        },
        Coverflow = {
            setTranslate: function() {
                for (var e = this.width, t = this.height, a = this.slides, n = this.$wrapperEl, r = this.slidesSizesGrid, i = this.params.coverflowEffect, o = this.isHorizontal(), s = this.translate, l = o ? e / 2 - s : t / 2 - s, p = o ? i.rotate : -i.rotate, c = i.depth, d = 0, u = a.length; d < u; d += 1) {
                    var h = a.eq(d),
                        f = r[d],
                        m = (l - h[0].swiperSlideOffset - f / 2) / f * i.modifier,
                        v = o ? p * m : 0,
                        g = o ? 0 : p * m,
                        b = -c * Math.abs(m),
                        y = o ? 0 : i.stretch * m,
                        w = o ? i.stretch * m : 0;
                    Math.abs(w) < .001 && (w = 0), Math.abs(y) < .001 && (y = 0), Math.abs(b) < .001 && (b = 0), Math.abs(v) < .001 && (v = 0), Math.abs(g) < .001 && (g = 0);
                    var C = "translate3d(" + w + "px," + y + "px," + b + "px)  rotateX(" + g + "deg) rotateY(" + v + "deg)";
                    if (h.transform(C), h[0].style.zIndex = 1 - Math.abs(Math.round(m)), i.slideShadows) {
                        var x = o ? h.find(".swiper-slide-shadow-left") : h.find(".swiper-slide-shadow-top"),
                            E = o ? h.find(".swiper-slide-shadow-right") : h.find(".swiper-slide-shadow-bottom");
                        0 === x.length && (x = $('<div class="swiper-slide-shadow-' + (o ? "left" : "top") + '"></div>'), h.append(x)), 0 === E.length && (E = $('<div class="swiper-slide-shadow-' + (o ? "right" : "bottom") + '"></div>'), h.append(E)), x.length && (x[0].style.opacity = 0 < m ? m : 0), E.length && (E[0].style.opacity = 0 < -m ? -m : 0)
                    }
                }(Support.pointerEvents || Support.prefixedPointerEvents) && (n[0].style.perspectiveOrigin = l + "px 50%")
            },
            setTransition: function(e) { this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e) }
        },
        EffectCoverflow = { name: "effect-coverflow", params: { coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0 } }, create: function() { Utils.extend(this, { coverflowEffect: { setTranslate: Coverflow.setTranslate.bind(this), setTransition: Coverflow.setTransition.bind(this) } }) }, on: { beforeInit: function() { "coverflow" === this.params.effect && (this.classNames.push(this.params.containerModifierClass + "coverflow"), this.classNames.push(this.params.containerModifierClass + "3d"), this.params.watchSlidesProgress = !0, this.originalParams.watchSlidesProgress = !0) }, setTranslate: function() { "coverflow" === this.params.effect && this.coverflowEffect.setTranslate() }, setTransition: function(e) { "coverflow" === this.params.effect && this.coverflowEffect.setTransition(e) } } },
        Thumbs = {
            init: function() {
                var e = this,
                    t = e.params.thumbs,
                    a = e.constructor;
                t.swiper instanceof a ? (e.thumbs.swiper = t.swiper, Utils.extend(e.thumbs.swiper.originalParams, { watchSlidesProgress: !0, slideToClickedSlide: !1 }), Utils.extend(e.thumbs.swiper.params, { watchSlidesProgress: !0, slideToClickedSlide: !1 })) : Utils.isObject(t.swiper) && (e.thumbs.swiper = new a(Utils.extend({}, t.swiper, { watchSlidesVisibility: !0, watchSlidesProgress: !0, slideToClickedSlide: !1 })), e.thumbs.swiperCreated = !0), e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass), e.thumbs.swiper.on("tap", e.thumbs.onThumbClick)
            },
            onThumbClick: function() {
                var e = this,
                    t = e.thumbs.swiper;
                if (t) {
                    var a = t.clickedIndex,
                        n = t.clickedSlide;
                    if (!(n && $(n).hasClass(e.params.thumbs.slideThumbActiveClass) || null == a)) {
                        var r;
                        if (r = t.params.loop ? parseInt($(t.clickedSlide).attr("data-swiper-slide-index"), 10) : a, e.params.loop) {
                            var i = e.activeIndex;
                            e.slides.eq(i).hasClass(e.params.slideDuplicateClass) && (e.loopFix(), e._clientLeft = e.$wrapperEl[0].clientLeft, i = e.activeIndex);
                            var o = e.slides.eq(i).prevAll('[data-swiper-slide-index="' + r + '"]').eq(0).index(),
                                s = e.slides.eq(i).nextAll('[data-swiper-slide-index="' + r + '"]').eq(0).index();
                            r = void 0 === o ? s : void 0 === s ? o : s - i < i - o ? s : o
                        }
                        e.slideTo(r)
                    }
                }
            },
            update: function(e) {
                var t = this,
                    a = t.thumbs.swiper;
                if (a) {
                    var n = "auto" === a.params.slidesPerView ? a.slidesPerViewDynamic() : a.params.slidesPerView;
                    if (t.realIndex !== a.realIndex) {
                        var r, i = a.activeIndex;
                        if (a.params.loop) {
                            a.slides.eq(i).hasClass(a.params.slideDuplicateClass) && (a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft, i = a.activeIndex);
                            var o = a.slides.eq(i).prevAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index(),
                                s = a.slides.eq(i).nextAll('[data-swiper-slide-index="' + t.realIndex + '"]').eq(0).index();
                            r = void 0 === o ? s : void 0 === s ? o : s - i == i - o ? i : s - i < i - o ? s : o
                        } else r = t.realIndex;
                        a.visibleSlidesIndexes.indexOf(r) < 0 && (a.params.centeredSlides ? r = i < r ? r - Math.floor(n / 2) + 1 : r + Math.floor(n / 2) - 1 : i < r && (r = r - n + 1), a.slideTo(r, e ? 0 : void 0))
                    }
                    var l = 1,
                        p = t.params.thumbs.slideThumbActiveClass;
                    if (1 < t.params.slidesPerView && !t.params.centeredSlides && (l = t.params.slidesPerView), a.slides.removeClass(p), a.params.loop)
                        for (var c = 0; c < l; c += 1) a.$wrapperEl.children('[data-swiper-slide-index="' + (t.realIndex + c) + '"]').addClass(p);
                    else
                        for (var d = 0; d < l; d += 1) a.slides.eq(t.realIndex + d).addClass(p)
                }
            }
        },
        Thumbs$1 = {
            name: "thumbs",
            params: { thumbs: { swiper: null, slideThumbActiveClass: "swiper-slide-thumb-active", thumbsContainerClass: "swiper-container-thumbs" } },
            create: function() { Utils.extend(this, { thumbs: { swiper: null, init: Thumbs.init.bind(this), update: Thumbs.update.bind(this), onThumbClick: Thumbs.onThumbClick.bind(this) } }) },
            on: {
                beforeInit: function() {
                    var e = this.params.thumbs;
                    e && e.swiper && (this.thumbs.init(), this.thumbs.update(!0))
                },
                slideChange: function() { this.thumbs.swiper && this.thumbs.update() },
                update: function() { this.thumbs.swiper && this.thumbs.update() },
                resize: function() { this.thumbs.swiper && this.thumbs.update() },
                observerUpdate: function() { this.thumbs.swiper && this.thumbs.update() },
                setTransition: function(e) {
                    var t = this.thumbs.swiper;
                    t && t.setTransition(e)
                },
                beforeDestroy: function() {
                    var e = this.thumbs.swiper;
                    e && this.thumbs.swiperCreated && e && e.destroy()
                }
            }
        };

    function initSwiper(e) {
        var n = this,
            r = $(e);
        if (0 !== r.length && !r[0].swiper) {
            var t, a, i, o = {};
            r.hasClass("tabs-swipeable-wrap") && (r.addClass("swiper-container").children(".tabs").addClass("swiper-wrapper").children(".tab").addClass("swiper-slide"), t = r.children(".tabs").children(".tab-active").index(), a = !0, i = 0 < r.find(".tabs-routable").length), r.attr("data-swiper") ? o = JSON.parse(r.attr("data-swiper")) : (o = r.dataset(), Object.keys(o).forEach(function(e) { var t = o[e]; if ("string" == typeof t && 0 === t.indexOf("{") && 0 < t.indexOf("}")) try { o[e] = JSON.parse(t) } catch (e) {} })), void 0 === o.initialSlide && void 0 !== t && (o.initialSlide = t);
            var s = n.swiper.create(r[0], o);
            a && s.on("slideChange", function() {
                if (i) {
                    var e = n.views.get(r.parents(".view"));
                    e || (e = n.views.main);
                    var t = e.router,
                        a = t.findTabRoute(s.slides.eq(s.activeIndex)[0]);
                    a && setTimeout(function() { t.navigate(a.path) }, 0)
                } else n.tab.show({ tabEl: s.slides.eq(s.activeIndex) })
            })
        }
    }
    Swiper.use([Device$1, Browser$1, Support$1, Resize, Observer$1, Virtual$1, Navigation$1, Pagination$1, Scrollbar$1, Parallax$1, Zoom$1, Lazy$3, Controller$1, A11y, Autoplay$1, EffectFade, EffectCube, EffectFlip, EffectCoverflow, Thumbs$1]), window.Swiper || (window.Swiper = Swiper);
    var Swiper$1 = {
            name: "swiper",
            static: { Swiper: Swiper },
            create: function() { this.swiper = ConstructorMethods({ defaultSelector: ".swiper-container", constructor: Swiper, domProp: "swiper" }) },
            on: {
                pageBeforeRemove: function(e) {
                    var a = this;
                    e.$el.find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) { a.swiper.destroy(t) })
                },
                pageMounted: function(e) {
                    var a = this;
                    e.$el.find(".tabs-swipeable-wrap").each(function(e, t) { initSwiper.call(a, t) })
                },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) { initSwiper.call(a, t) })
                },
                pageReinit: function(e) {
                    var n = this;
                    e.$el.find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) {
                        var a = n.swiper.get(t);
                        a && a.update && a.update()
                    })
                },
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) { initSwiper.call(a, t) })
                },
                tabShow: function(e) {
                    var n = this;
                    $(e).find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) {
                        var a = n.swiper.get(t);
                        a && a.update && a.update()
                    })
                },
                tabBeforeRemove: function(e) {
                    var a = this;
                    $(e).find(".swiper-init, .tabs-swipeable-wrap").each(function(e, t) { a.swiper.destroy(t) })
                }
            },
            vnode: {
                "swiper-init": {
                    insert: function(e) {
                        var t = e.elm;
                        initSwiper.call(this, t)
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        this.swiper.destroy(t)
                    }
                },
                "tabs-swipeable-wrap": {
                    insert: function(e) {
                        var t = e.elm;
                        initSwiper.call(this, t)
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        this.swiper.destroy(t)
                    }
                }
            }
        },
        PhotoBrowser = function(n) {
            function e(e, t) {
                void 0 === t && (t = {}), n.call(this, t, [e]);
                this.app = e;
                var a = Utils.extend({ on: {} }, e.params.photoBrowser);
                this.useModulesParams(a), this.params = Utils.extend(a, t), Utils.extend(this, { exposed: !1, opened: !1, activeIndex: this.params.swiper.initialSlide, url: this.params.url, view: this.params.view || e.views.main, swipeToClose: { allow: !0, isTouched: !1, diff: void 0, start: void 0, current: void 0, started: !1, activeSlide: void 0, timeStart: void 0 } }), this.useModules(), this.init()
            }
            return n && (e.__proto__ = n), ((e.prototype = Object.create(n && n.prototype)).constructor = e).prototype.onSlideChange = function(e) {
                var t = this;
                t.activeIndex = e.activeIndex;
                var a = e.activeIndex + 1,
                    n = t.params.virtualSlides ? t.params.photos.length : e.slides.length;
                e.params.loop && (n -= 2, (a -= e.loopedSlides) < 1 && (a = n + a), n < a && (a -= n));
                var r = t.params.virtualSlides ? e.$wrapperEl.find('.swiper-slide[data-swiper-slide-index="' + e.activeIndex + '"]') : e.slides.eq(e.activeIndex),
                    i = t.params.virtualSlides ? e.$wrapperEl.find('.swiper-slide[data-swiper-slide-index="' + e.previousIndex + '"]') : e.slides.eq(e.previousIndex),
                    o = t.$el.find(".photo-browser-current"),
                    s = t.$el.find(".photo-browser-total");
                if ("page" === t.params.type && t.params.navbar && 0 === o.length && "ios" === t.app.theme) {
                    var l = t.app.navbar.getElByPage(t.$el);
                    l && (o = $(l).find(".photo-browser-current"), s = $(l).find(".photo-browser-total"))
                }
                if (o.text(a), s.text(n), 0 < t.captions.length) {
                    var p = e.params.loop ? r.attr("data-swiper-slide-index") : t.activeIndex;
                    t.$captionsContainerEl.find(".photo-browser-caption-active").removeClass("photo-browser-caption-active"), t.$captionsContainerEl.find('[data-caption-index="' + p + '"]').addClass("photo-browser-caption-active")
                }
                var c = i.find("video");
                0 < c.length && "pause" in c[0] && c[0].pause()
            }, e.prototype.onTouchStart = function() {
                var e = this.swipeToClose;
                e.allow && (e.isTouched = !0)
            }, e.prototype.onTouchMove = function(e) {
                var t = this.swipeToClose;
                if (t.isTouched) {
                    t.started || (t.started = !0, t.start = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, this.params.virtualSlides ? t.activeSlide = this.swiper.$wrapperEl.children(".swiper-slide-active") : t.activeSlide = this.swiper.slides.eq(this.swiper.activeIndex), t.timeStart = Utils.now()), e.preventDefault(), t.current = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, t.diff = t.start - t.current;
                    var a = 1 - Math.abs(t.diff) / 300,
                        n = this.exposed || "dark" === this.params.theme ? 0 : 255;
                    t.activeSlide.transform("translate3d(0," + -t.diff + "px,0)"), this.swiper.$el.css("background-color", "rgba(" + n + ", " + n + ", " + n + ", " + a + ")").transition(0)
                }
            }, e.prototype.onTouchEnd = function() {
                var e = this,
                    t = e.swipeToClose;
                if (t.isTouched = !1, t.started) {
                    t.started = !1, t.allow = !1;
                    var a = Math.abs(t.diff),
                        n = (new Date).getTime() - t.timeStart;
                    n < 300 && 20 < a || 300 <= n && 100 < a ? Utils.nextTick(function() { e.$el && (t.diff < 0 ? e.$el.addClass("swipe-close-to-bottom") : e.$el.addClass("swipe-close-to-top")), e.emit("local::swipeToClose", e), e.close(), t.allow = !0 }) : (0 !== a ? t.activeSlide.addClass("photo-browser-transitioning").transitionEnd(function() { t.allow = !0, t.activeSlide.removeClass("photo-browser-transitioning") }) : t.allow = !0, e.swiper.$el.transition("").css("background-color", ""), t.activeSlide.transform(""))
                } else t.started = !1
            }, e.prototype.renderNavbar = function() {
                var e = this;
                if (e.params.renderNavbar) return e.params.renderNavbar.call(e);
                var t = e.params.iconsColor;
                e.params.iconsColor || "dark" !== e.params.theme || (t = "white");
                var a = "ios" === e.app.theme && e.params.backLinkText ? e.params.backLinkText : "",
                    n = "page" !== e.params.type;
                return ('\n      <div class="navbar">\n        <div class="navbar-inner sliding">\n          <div class="left">\n            <a href="#" class="link ' + (n ? "popup-close" : "") + " " + (a ? "" : "icon-only") + " " + (n ? "" : "back") + '" ' + (n ? 'data-popup=".photo-browser-popup"' : "") + '>\n              <i class="icon icon-back ' + (t ? "color-" + t : "") + '"></i>\n              ' + (a ? "<span>" + a + "</span>" : "") + '\n            </a>\n          </div>\n          <div class="title">\n            <span class="photo-browser-current"></span>\n            <span class="photo-browser-of">' + e.params.navbarOfText + '</span>\n            <span class="photo-browser-total"></span>\n          </div>\n          <div class="right"></div>\n        </div>\n      </div>\n    ').trim()
            }, e.prototype.renderToolbar = function() { if (this.params.renderToolbar) return this.params.renderToolbar.call(this); var e = this.params.iconsColor; return this.params.iconsColor || "dark" !== this.params.theme || (e = "white"), ('\n      <div class="toolbar tabbar toolbar-bottom-md">\n        <div class="toolbar-inner">\n          <a href="#" class="link photo-browser-prev">\n            <i class="icon icon-back ' + (e ? "color-" + e : "") + '"></i>\n          </a>\n          <a href="#" class="link photo-browser-next">\n            <i class="icon icon-forward ' + (e ? "color-" + e : "") + '"></i>\n          </a>\n        </div>\n      </div>\n    ').trim() }, e.prototype.renderCaption = function(e, t) { return this.params.renderCaption ? this.params.renderCaption.call(this, e, t) : ('\n      <div class="photo-browser-caption" data-caption-index="' + t + '">\n        ' + e + "\n      </div>\n    ").trim() }, e.prototype.renderObject = function(e, t) { return this.params.renderObject ? this.params.renderObject.call(this, e, t) : '\n      <div class="photo-browser-slide photo-browser-object-slide swiper-slide" data-swiper-slide-index="' + t + '">' + (e.html ? e.html : e) + "</div>\n    " }, e.prototype.renderLazyPhoto = function(e, t) { return this.params.renderLazyPhoto ? this.params.renderLazyPhoto.call(this, e, t) : ('\n      <div class="photo-browser-slide photo-browser-slide-lazy swiper-slide" data-swiper-slide-index="' + t + '">\n          <div class="preloader swiper-lazy-preloader ' + ("dark" === this.params.theme ? "color-white" : "") + '">' + ("md" === this.app.theme ? Utils.mdPreloaderContent : "") + '</div>\n          <span class="swiper-zoom-container">\n              <img data-src="' + (e.url ? e.url : e) + '" class="swiper-lazy">\n          </span>\n      </div>\n    ').trim() }, e.prototype.renderPhoto = function(e, t) { return this.params.renderPhoto ? this.params.renderPhoto.call(this, e, t) : ('\n      <div class="photo-browser-slide swiper-slide" data-swiper-slide-index="' + t + '">\n        <span class="swiper-zoom-container">\n          <img src="' + (e.url ? e.url : e) + '">\n        </span>\n      </div>\n    ').trim() }, e.prototype.render = function() { var a = this; return a.params.render ? a.params.render.call(a, a.params) : ('\n      <div class="photo-browser photo-browser-' + a.params.theme + '">\n        <div class="view">\n          <div class="page photo-browser-page photo-browser-page-' + a.params.theme + " no-toolbar " + (a.params.navbar ? "" : "no-navbar") + '" data-name="photo-browser-page">\n            ' + (a.params.navbar ? a.renderNavbar() : "") + "\n            " + (a.params.toolbar ? a.renderToolbar() : "") + '\n            <div class="photo-browser-captions photo-browser-captions-' + (a.params.captionsTheme || a.params.theme) + '">\n              ' + a.params.photos.map(function(e, t) { return e.caption ? a.renderCaption(e.caption, t) : "" }).join(" ") + '\n            </div>\n            <div class="photo-browser-swiper-container swiper-container">\n              <div class="photo-browser-swiper-wrapper swiper-wrapper">\n                ' + (a.params.virtualSlides ? "" : a.params.photos.map(function(e, t) { return e.html || ("string" == typeof e || e instanceof String) && 0 <= e.indexOf("<") && 0 <= e.indexOf(">") ? a.renderObject(e, t) : !0 === a.params.swiper.lazy || a.params.swiper.lazy && a.params.swiper.lazy.enabled ? a.renderLazyPhoto(e, t) : a.renderPhoto(e, t) }).join(" ")) + "\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ").trim() }, e.prototype.renderStandalone = function() { return this.params.renderStandalone ? this.params.renderStandalone.call(this) : '<div class="popup photo-browser-popup photo-browser-standalone popup-tablet-fullscreen">' + this.render() + "</div>" }, e.prototype.renderPage = function() { return this.params.renderPage ? this.params.renderPage.call(this) : this.render() }, e.prototype.renderPopup = function() { return this.params.renderPopup ? this.params.renderPopup.call(this) : '<div class="popup photo-browser-popup">' + this.render() + "</div>" }, e.prototype.onOpen = function(e, t) {
                var a = this,
                    n = a.app,
                    r = $(t);
                (r[0].f7PhotoBrowser = a).$el = r, a.el = r[0], a.openedIn = e, a.opened = !0, a.$swiperContainerEl = a.$el.find(".photo-browser-swiper-container"), a.$swiperWrapperEl = a.$el.find(".photo-browser-swiper-wrapper"), a.slides = a.$el.find(".photo-browser-slide"), a.$captionsContainerEl = a.$el.find(".photo-browser-captions"), a.captions = a.$el.find(".photo-browser-caption");
                var i = Utils.extend({}, a.params.swiper, {
                    initialSlide: a.activeIndex,
                    on: {
                        tap: function(e) { a.emit("local::tap", e) },
                        click: function(e) { a.params.exposition && a.expositionToggle(), a.emit("local::click", e) },
                        doubleTap: function(e) { a.emit("local::doubleTap", e) },
                        slideChange: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.onSlideChange(this), a.emit.apply(a, ["local::slideChange"].concat(e))
                        },
                        transitionStart: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.emit.apply(a, ["local::transitionStart"].concat(e))
                        },
                        transitionEnd: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.emit.apply(a, ["local::transitionEnd"].concat(e))
                        },
                        slideChangeTransitionStart: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.emit.apply(a, ["local::slideChangeTransitionStart"].concat(e))
                        },
                        slideChangeTransitionEnd: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.emit.apply(a, ["local::slideChangeTransitionEnd"].concat(e))
                        },
                        lazyImageLoad: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            a.emit.apply(a, ["local::lazyImageLoad"].concat(e))
                        },
                        lazyImageReady: function() {
                            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                            $(e[0]).removeClass("photo-browser-slide-lazy"), a.emit.apply(a, ["local::lazyImageReady"].concat(e))
                        }
                    }
                });
                a.params.swipeToClose && "page" !== a.params.type && Utils.extend(i.on, { touchStart: function(e) { a.onTouchStart(e), a.emit("local::touchStart", e) }, touchMoveOpposite: function(e) { a.onTouchMove(e), a.emit("local::touchMoveOpposite", e) }, touchEnd: function(e) { a.onTouchEnd(e), a.emit("local::touchEnd", e) } }), a.params.virtualSlides && Utils.extend(i, { virtual: { slides: a.params.photos, renderSlide: function(e, t) { return e.html || ("string" == typeof e || e instanceof String) && 0 <= e.indexOf("<") && 0 <= e.indexOf(">") ? a.renderObject(e, t) : !0 === a.params.swiper.lazy || a.params.swiper.lazy && a.params.swiper.lazy.enabled ? a.renderLazyPhoto(e, t) : a.renderPhoto(e, t) } } }), a.swiper = n.swiper.create(a.$swiperContainerEl, i), 0 === a.activeIndex && a.onSlideChange(a.swiper), a.$el && a.$el.trigger("photobrowser:open"), a.emit("local::open photoBrowserOpen", a)
            }, e.prototype.onOpened = function() { this.$el && this.$el.trigger("photobrowser:opened"), this.emit("local::opened photoBrowserOpened", this) }, e.prototype.onClose = function() {
                var e = this;
                e.destroyed || (e.swiper && e.swiper.destroy && (e.swiper.destroy(!0, !1), e.swiper = null, delete e.swiper), e.$el && e.$el.trigger("photobrowser:close"), e.emit("local::close photoBrowserClose", e))
            }, e.prototype.onClosed = function() {
                var e = this;
                e.destroyed || (e.opened = !1, e.$el = null, e.el = null, delete e.$el, delete e.el, e.$el && e.$el.trigger("photobrowser:closed"), e.emit("local::closed photoBrowserClosed", e))
            }, e.prototype.openPage = function() { var a = this; if (a.opened) return a; var e = a.renderPage(); return a.view.router.navigate({ url: a.url, route: { content: e, path: a.url, on: { pageBeforeIn: function(e, t) { a.view.$el.addClass("with-photo-browser-page with-photo-browser-page-" + a.params.theme), a.onOpen("page", t.el) }, pageAfterIn: function(e, t) { a.onOpened("page", t.el) }, pageBeforeOut: function(e, t) { a.view.$el.removeClass("with-photo-browser-page with-photo-browser-page-exposed with-photo-browser-page-" + a.params.theme), a.onClose("page", t.el) }, pageAfterOut: function(e, t) { a.onClosed("page", t.el) } } } }), a }, e.prototype.openStandalone = function() { var t = this; if (t.opened) return t; var e = { backdrop: !1, content: t.renderStandalone(), on: { popupOpen: function(e) { t.onOpen("popup", e.el) }, popupOpened: function(e) { t.onOpened("popup", e.el) }, popupClose: function(e) { t.onClose("popup", e.el) }, popupClosed: function(e) { t.onClosed("popup", e.el) } } }; return t.params.routableModals ? t.view.router.navigate({ url: t.url, route: { path: t.url, popup: e } }) : t.modal = t.app.popup.create(e).open(), t }, e.prototype.openPopup = function() { var t = this; if (t.opened) return t; var e = { content: t.renderPopup(), on: { popupOpen: function(e) { t.onOpen("popup", e.el) }, popupOpened: function(e) { t.onOpened("popup", e.el) }, popupClose: function(e) { t.onClose("popup", e.el) }, popupClosed: function(e) { t.onClosed("popup", e.el) } } }; return t.params.routableModals ? t.view.router.navigate({ url: t.url, route: { path: t.url, popup: e } }) : t.modal = t.app.popup.create(e).open(), t }, e.prototype.expositionEnable = function() { return "page" === this.params.type && this.view.$el.addClass("with-photo-browser-page-exposed"), this.$el && this.$el.addClass("photo-browser-exposed"), this.params.expositionHideCaptions && this.$captionsContainerEl.addClass("photo-browser-captions-exposed"), this.exposed = !0, this }, e.prototype.expositionDisable = function() { return "page" === this.params.type && this.view.$el.removeClass("with-photo-browser-page-exposed"), this.$el && this.$el.removeClass("photo-browser-exposed"), this.params.expositionHideCaptions && this.$captionsContainerEl.removeClass("photo-browser-captions-exposed"), this.exposed = !1, this }, e.prototype.expositionToggle = function() { return "page" === this.params.type && this.view.$el.toggleClass("with-photo-browser-page-exposed"), this.$el && this.$el.toggleClass("photo-browser-exposed"), this.params.expositionHideCaptions && this.$captionsContainerEl.toggleClass("photo-browser-captions-exposed"), this.exposed = !this.exposed, this }, e.prototype.open = function(e) {
                var t = this,
                    a = t.params.type;
                return t.opened ? t.swiper && void 0 !== e && t.swiper.slideTo(parseInt(e, 10)) : (void 0 !== e && (t.activeIndex = e), "standalone" === a && t.openStandalone(), "page" === a && t.openPage(), "popup" === a && t.openPopup()), t
            }, e.prototype.close = function() { var e = this; return e.opened && (e.params.routableModals || "page" === e.openedIn ? e.view && e.view.router.back() : (e.modal.once("modalClosed", function() { Utils.nextTick(function() { e.modal.destroy(), delete e.modal }) }), e.modal.close())), e }, e.prototype.init = function() {}, e.prototype.destroy = function() {
                var e = this;
                e.emit("local::beforeDestroy photoBrowserBeforeDestroy", e), e.$el && (e.$el.trigger("photobrowser:beforedestroy"), e.$el[0].f7PhotoBrowser = null, delete e.$el[0].f7PhotoBrowser), Utils.deleteProps(e), e = null
            }, e
        }(Framework7Class),
        PhotoBrowser$1 = { name: "photoBrowser", params: { photoBrowser: { photos: [], exposition: !0, expositionHideCaptions: !1, type: "standalone", navbar: !0, toolbar: !0, theme: "light", captionsTheme: void 0, iconsColor: void 0, swipeToClose: !0, backLinkText: "Close", navbarOfText: "of", view: void 0, url: "photos/", routableModals: !0, virtualSlides: !0, renderNavbar: void 0, renderToolbar: void 0, renderCaption: void 0, renderObject: void 0, renderLazyPhoto: void 0, renderPhoto: void 0, renderPage: void 0, renderPopup: void 0, renderStandalone: void 0, swiper: { initialSlide: 0, spaceBetween: 20, speed: 300, loop: !1, preloadImages: !0, navigation: { nextEl: ".photo-browser-next", prevEl: ".photo-browser-prev" }, zoom: { enabled: !0, maxRatio: 3, minRatio: 1 }, lazy: { enabled: !0 } } } }, create: function() { this.photoBrowser = ConstructorMethods({ defaultSelector: ".photo-browser", constructor: PhotoBrowser, app: this, domProp: "f7PhotoBrowser" }) }, static: { PhotoBrowser: PhotoBrowser } },
        Notification = function(M) {
            function e(n, e) {
                var t = Utils.extend({ on: {} }, n.params.notification, e);
                M.call(this, n, t);
                var r = this;
                r.app = n, r.params = t;
                var a, i, o, s, l, p, c, d = r.params,
                    u = d.icon,
                    h = d.title,
                    f = d.titleRightText,
                    m = d.subtitle,
                    v = d.text,
                    g = d.closeButton,
                    b = d.closeTimeout,
                    y = d.cssClass,
                    w = d.closeOnClick;
                if (r.params.el) a = $(r.params.el);
                else {
                    var C = r.render({ icon: u, title: h, titleRightText: f, subtitle: m, text: v, closeButton: g, cssClass: y });
                    a = $(C)
                }
                if (a && 0 < a.length && a[0].f7Modal) return a[0].f7Modal;
                if (0 === a.length) return r.destroy();
                Utils.extend(r, { $el: a, el: a[0], type: "notification" }), a[0].f7Modal = r, g && a.find(".notification-close-button").on("click", function() { r.close() }), a.on("click", function(e) { g && $(e.target).closest(".notification-close-button").length || (r.emit("local::click notificationClick", r), w && r.close()) }), r.on("beforeDestroy", function() { a.off("click") });
                var x, E = {};

                function k(e) { i || (o = !(i = !0), s = void 0, p = Utils.now(), E.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, E.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY) }

                function S(e) {
                    if (i) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (void 0 === s && (s = !!(s || Math.abs(a - E.y) < Math.abs(t - E.x))), s) i = !1;
                        else {
                            e.preventDefault(), o || (r.$el.removeClass("notification-transitioning"), r.$el.transition(0), c = r.$el[0].offsetHeight / 2), o = !0;
                            var n = l = a - E.y;
                            0 < l && (n = Math.pow(l, .8)), r.$el.transform("translate3d(0, " + n + "px, 0)")
                        }
                    }
                }

                function T() {
                    if (i && o) {
                        if (o = i = !1, 0 !== l) {
                            var e = Utils.now() - p;
                            r.$el.transition(""), r.$el.addClass("notification-transitioning"), r.$el.transform(""), (l < -10 && e < 300 || c / 1 <= -l) && r.close()
                        }
                    } else o = i = !1
                }
                return r.on("open", function() {
                    r.params.swipeToClose && (r.$el.on(n.touchEvents.start, k, { passive: !0 }), n.on("touchmove:active", S), n.on("touchend:passive", T)), $(".notification.modal-in").each(function(e, t) {
                        var a = n.notification.get(t);
                        t !== r.el && a && a.close()
                    }), b && function e() { x = Utils.nextTick(function() { i && o ? e() : r.close() }, b) }()
                }), r.on("close beforeDestroy", function() { r.params.swipeToClose && (r.$el.off(n.touchEvents.start, k, { passive: !0 }), n.off("touchmove:active", S), n.off("touchend:passive", T)), win.clearTimeout(x) }), r
            }
            return M && (e.__proto__ = M), ((e.prototype = Object.create(M && M.prototype)).constructor = e).prototype.render = function() {
                if (this.params.render) return this.params.render.call(this, this);
                var e = this.params,
                    t = e.icon,
                    a = e.title,
                    n = e.titleRightText,
                    r = e.subtitle,
                    i = e.text,
                    o = e.closeButton;
                return ('\n      <div class="notification ' + (e.cssClass || "") + '">\n        <div class="notification-header">\n          ' + (t ? '<div class="notification-icon">' + t + "</div>" : "") + "\n          " + (a ? '<div class="notification-title">' + a + "</div>" : "") + "\n          " + (n ? '<div class="notification-title-right-text">' + n + "</div>" : "") + "\n          " + (o ? '<span class="notification-close-button"></span>' : "") + '\n        </div>\n        <div class="notification-content">\n          ' + (r ? '<div class="notification-subtitle">' + r + "</div>" : "") + "\n          " + (i ? '<div class="notification-text">' + i + "</div>" : "") + "\n        </div>\n      </div>\n    ").trim()
            }, e
        }(Modal),
        Notification$1 = { name: "notification", static: { Notification: Notification }, create: function() { this.notification = Utils.extend({}, ModalMethods({ app: this, constructor: Notification, defaultSelector: ".notification.modal-in" })) }, params: { notification: { icon: null, title: null, titleRightText: null, subtitle: null, text: null, closeButton: !1, closeTimeout: null, closeOnClick: !1, swipeToClose: !0, cssClass: null, render: null } } },
        Autocomplete = function(w) {
            function e(e, t) {
                void 0 === t && (t = {}), w.call(this, t, [e]);
                var d = this;
                d.app = e;
                var a, u, n, r = Utils.extend({ on: {} }, e.params.autocomplete);
                d.useModulesParams(r), d.params = Utils.extend(r, t), d.params.openerEl && (a = $(d.params.openerEl)).length && (a[0].f7Autocomplete = d), d.params.inputEl && (u = $(d.params.inputEl)).length && (u[0].f7Autocomplete = d), d.params.view ? n = d.params.view : (a || u) && (n = e.views.get(a || u)), n || (n = e.views.main);
                var i = Utils.id(),
                    o = t.url;
                !o && a && a.length && (a.attr("href") ? o = a.attr("href") : 0 < a.find("a").length && (o = a.find("a").attr("href"))), o && "#" !== o && "" !== o || (o = d.params.url);
                var s = d.params.multiple ? "checkbox" : "radio";
                Utils.extend(d, { $openerEl: a, openerEl: a && a[0], $inputEl: u, inputEl: u && u[0], id: i, view: n, url: o, value: d.params.value || [], inputType: s, inputName: s + "-" + i, $modalEl: void 0, $dropdownEl: void 0 });
                var h = "";

                function l() {
                    var c = d.$inputEl.val().trim();
                    d.params.source && d.params.source.call(d, c, function(e) {
                        var t, a, n, r = "",
                            i = d.params.limit ? Math.min(d.params.limit, e.length) : e.length;
                        d.items = e, d.params.highlightMatches && (c = c.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), t = new RegExp("(" + c + ")", "i"));
                        for (var o = 0; o < i; o += 1) {
                            var s = "object" == typeof e[o] ? e[o][d.params.valueProperty] : e[o],
                                l = "object" == typeof e[o] ? e[o][d.params.textProperty] : e[o];
                            0 === o && (a = s, n = d.items[o]), r += d.renderItem({ value: s, text: d.params.highlightMatches ? l.replace(t, "<b>$1</b>") : l }, o)
                        }
                        if ("" === r && "" === c && d.params.dropdownPlaceholderText && (r += d.renderItem({ placeholder: !0, text: d.params.dropdownPlaceholderText })), d.$dropdownEl.find("ul").html(r), d.params.typeahead) {
                            if (!a || !n) return;
                            if (0 !== a.toLowerCase().indexOf(c.toLowerCase())) return;
                            if (h.toLowerCase() === c.toLowerCase()) return void(d.value = []);
                            if (0 === h.toLowerCase().indexOf(c.toLowerCase())) return h = c, void(d.value = []);
                            u.val(a), u[0].setSelectionRange(c.length, a.length);
                            var p = "object" == typeof d.value[0] ? d.value[0][d.params.valueProperty] : d.value[0];
                            p && a.toLowerCase() === p.toLowerCase() || (d.value = [n], d.emit("local::change autocompleteChange", [n]))
                        }
                        h = c
                    })
                }

                function p() {
                    var e, t, a, n = this.value;
                    if (0 < $(this).parents(".autocomplete-values").length) {
                        if ("checkbox" === d.inputType && !this.checked) {
                            for (var r = 0; r < d.value.length; r += 1)(a = "string" == typeof d.value[r] ? d.value[r] : d.value[r][d.params.valueProperty]) !== n && 1 * a != 1 * n || d.value.splice(r, 1);
                            d.updateValues(), d.emit("local::change autocompleteChange", d.value)
                        }
                    } else {
                        for (var i = 0; i < d.items.length; i += 1)(t = "object" == typeof d.items[i] ? d.items[i][d.params.valueProperty] : d.items[i]) !== n && 1 * t != 1 * n || (e = d.items[i]);
                        if ("radio" === d.inputType) d.value = [e];
                        else if (this.checked) d.value.push(e);
                        else
                            for (var o = 0; o < d.value.length; o += 1)(a = "object" == typeof d.value[o] ? d.value[o][d.params.valueProperty] : d.value[o]) !== n && 1 * a != 1 * n || d.value.splice(o, 1);
                        d.updateValues(), ("radio" === d.inputType && this.checked || "checkbox" === d.inputType) && d.emit("local::change autocompleteChange", d.value)
                    }
                }

                function c(e) {
                    var t = $(e.target);
                    t.is(d.$inputEl[0]) || d.$dropdownEl && t.closest(d.$dropdownEl[0]).length || d.close()
                }

                function f() { d.open() }

                function m() { d.open() }

                function v() { 0 < d.$dropdownEl.find("label.active-state").length || d.close() }

                function g() { d.positionDropdown() }

                function b(e) { d.opened && 13 === e.keyCode && (e.preventDefault(), d.$inputEl.blur()) }

                function y() {
                    for (var e, t = $(this), a = 0; a < d.items.length; a += 1) {
                        var n = "object" == typeof d.items[a] ? d.items[a][d.params.valueProperty] : d.items[a],
                            r = t.attr("data-value");
                        n !== r && 1 * n != 1 * r || (e = d.items[a])
                    }
                    d.params.updateInputValueOnSelect && (d.$inputEl.val("object" == typeof e ? e[d.params.valueProperty] : e), d.$inputEl.trigger("input change")), d.value = [e], d.emit("local::change autocompleteChange", [e]), d.close()
                }
                return d.attachEvents = function() { "dropdown" !== d.params.openIn && d.$openerEl && d.$openerEl.on("click", f), "dropdown" === d.params.openIn && d.$inputEl && (d.$inputEl.on("focus", m), d.$inputEl.on(d.params.inputEvents, l), e.device.android ? $("html").on("click", c) : d.$inputEl.on("blur", v), d.params.typeahead && d.$inputEl.on("keydown", b)) }, d.detachEvents = function() { "dropdown" !== d.params.openIn && d.$openerEl && d.$openerEl.off("click", f), "dropdown" === d.params.openIn && d.$inputEl && (d.$inputEl.off("focus", m), d.$inputEl.off(d.params.inputEvents, l), e.device.android ? $("html").off("click", c) : d.$inputEl.off("blur", v), d.params.typeahead && d.$inputEl.off("keydown", b)) }, d.attachDropdownEvents = function() { d.$dropdownEl.on("click", "label", y), e.on("resize", g) }, d.detachDropdownEvents = function() { d.$dropdownEl.off("click", "label", y), e.off("resize", g) }, d.attachPageEvents = function() { d.$el.on("change", 'input[type="radio"], input[type="checkbox"]', p), d.params.closeOnSelect && !d.params.multiple && d.$el.once("click", ".list label", function() { Utils.nextTick(function() { d.close() }) }) }, d.detachPageEvents = function() { d.$el.off("change", 'input[type="radio"], input[type="checkbox"]', p) }, d.useModules(), d.init(), d
            }
            return w && (e.__proto__ = w), ((e.prototype = Object.create(w && w.prototype)).constructor = e).prototype.positionDropdown = function() {
                var e, t = this.$inputEl,
                    a = this.app,
                    n = this.$dropdownEl,
                    r = t.parents(".page-content");
                if (0 !== r.length) {
                    var i, o = t.offset(),
                        s = t[0].offsetWidth,
                        l = t[0].offsetHeight,
                        p = t.parents(".list");
                    p.parents().each(function(e, t) {
                        if (!i) {
                            var a = $(t);
                            a.parent(r).length && (i = a)
                        }
                    });
                    var c, d = p.offset(),
                        u = parseInt(r.css("padding-bottom"), 10),
                        h = 0 < p.length ? d.left - r.offset().left : 0,
                        f = o.left - (0 < p.length ? d.left : 0) - (a.rtl, 0),
                        m = o.top - (r.offset().top - r[0].scrollTop),
                        v = r[0].scrollHeight - u - (m + r[0].scrollTop) - t[0].offsetHeight,
                        g = a.rtl ? "padding-right" : "padding-left";
                    p.length && !this.params.expandInput && (c = (a.rtl ? p[0].offsetWidth - f - s : f) - ("md" === a.theme ? 16 : 15)), n.css({ left: (0 < p.length ? h : f) + "px", top: m + r[0].scrollTop + l + "px", width: (0 < p.length ? p[0].offsetWidth : s) + "px" }), n.children(".autocomplete-dropdown-inner").css(((e = { maxHeight: v + "px" })[g] = 0 < p.length && !this.params.expandInput ? c + "px" : "", e))
                }
            }, e.prototype.focus = function() { this.$el.find("input[type=search]").focus() }, e.prototype.source = function(l) {
                var p = this;
                if (p.params.source) {
                    var c = p.$el;
                    p.params.source.call(p, l, function(e) {
                        var t = "",
                            a = p.params.limit ? Math.min(p.params.limit, e.length) : e.length;
                        p.items = e;
                        for (var n = 0; n < a; n += 1) {
                            for (var r = !1, i = "object" == typeof e[n] ? e[n][p.params.valueProperty] : e[n], o = 0; o < p.value.length; o += 1) {
                                var s = "object" == typeof p.value[o] ? p.value[o][p.params.valueProperty] : p.value[o];
                                s !== i && 1 * s != 1 * i || (r = !0)
                            }
                            t += p.renderItem({ value: i, text: "object" == typeof e[n] ? e[n][p.params.textProperty] : e[n], inputType: p.inputType, id: p.id, inputName: p.inputName, selected: r }, n)
                        }
                        c.find(".autocomplete-found ul").html(t), 0 === e.length ? 0 !== l.length ? (c.find(".autocomplete-not-found").show(), c.find(".autocomplete-found, .autocomplete-values").hide()) : (c.find(".autocomplete-values").show(), c.find(".autocomplete-found, .autocomplete-not-found").hide()) : (c.find(".autocomplete-found").show(), c.find(".autocomplete-not-found, .autocomplete-values").hide())
                    })
                }
            }, e.prototype.updateValues = function() {
                for (var e = this, t = "", a = 0; a < e.value.length; a += 1) t += e.renderItem({ value: "object" == typeof e.value[a] ? e.value[a][e.params.valueProperty] : e.value[a], text: "object" == typeof e.value[a] ? e.value[a][e.params.textProperty] : e.value[a], inputType: e.inputType, id: e.id, inputName: e.inputName + "-checked}", selected: !0 }, a);
                e.$el.find(".autocomplete-values ul").html(t)
            }, e.prototype.preloaderHide = function() { "dropdown" === this.params.openIn && this.$dropdownEl ? this.$dropdownEl.find(".autocomplete-preloader").removeClass("autocomplete-preloader-visible") : $(".autocomplete-preloader").removeClass("autocomplete-preloader-visible") }, e.prototype.preloaderShow = function() { "dropdown" === this.params.openIn && this.$dropdownEl ? this.$dropdownEl.find(".autocomplete-preloader").addClass("autocomplete-preloader-visible") : $(".autocomplete-preloader").addClass("autocomplete-preloader-visible") }, e.prototype.renderPreloader = function() { return ('\n      <div class="autocomplete-preloader preloader ' + (this.params.preloaderColor ? "color-" + this.params.preloaderColor : "") + '">' + ("md" === this.app.theme ? Utils.mdPreloaderContent : "") + "</div>\n    ").trim() }, e.prototype.renderSearchbar = function() { return this.params.renderSearchbar ? this.params.renderSearchbar.call(this) : ('\n      <form class="searchbar">\n        <div class="searchbar-inner">\n          <div class="searchbar-input-wrap">\n            <input type="search" placeholder="' + this.params.searchbarPlaceholder + '"/>\n            <i class="searchbar-icon"></i>\n            <span class="input-clear-button"></span>\n          </div>\n          <span class="searchbar-disable-button">' + this.params.searchbarDisableText + "</span>\n        </div>\n      </form>\n    ").trim() }, e.prototype.renderItem = function(e, t) { if (this.params.renderItem) return this.params.renderItem.call(this, e, t); var a = e.value && "string" == typeof e.value ? e.value.replace(/"/g, "&quot;") : e.value; return ("dropdown" !== this.params.openIn ? '\n        <li>\n          <label class="item-' + e.inputType + ' item-content">\n            <input type="' + e.inputType + '" name="' + e.inputName + '" value="' + a + '" ' + (e.selected ? "checked" : "") + '>\n            <i class="icon icon-' + e.inputType + '"></i>\n            <div class="item-inner">\n              <div class="item-title">' + e.text + "</div>\n            </div>\n          </label>\n        </li>\n      " : e.placeholder ? '\n        <li class="autocomplete-dropdown-placeholder">\n          <label class="item-content">\n            <div class="item-inner">\n              <div class="item-title">' + e.text + "</div>\n            </div>\n          </label>\n        </li>\n      " : '\n        <li>\n          <label class="item-radio item-content" data-value="' + a + '">\n            <div class="item-inner">\n              <div class="item-title">' + e.text + "</div>\n            </div>\n          </label>\n        </li>\n      ").trim() }, e.prototype.renderNavbar = function() { var e = this; if (e.params.renderNavbar) return e.params.renderNavbar.call(e); var t = e.params.pageTitle; return void 0 === t && e.$openerEl && e.$openerEl.length && (t = e.$openerEl.find(".item-title").text().trim()), ('\n      <div class="navbar ' + (e.params.navbarColorTheme ? "color-theme-" + e.params.navbarColorTheme : "") + '">\n        <div class="navbar-inner ' + (e.params.navbarColorTheme ? "color-theme-" + e.params.navbarColorTheme : "") + '">\n          <div class="left sliding">\n            <a href="#" class="link ' + ("page" === e.params.openIn ? "back" : "popup-close") + '" ' + ("popup" === e.params.openIn ? 'data-popup=".autocomplete-popup"' : "") + '>\n              <i class="icon icon-back"></i>\n              <span class="ios-only">' + ("page" === e.params.openIn ? e.params.pageBackLinkText : e.params.popupCloseLinkText) + "</span>\n            </a>\n          </div>\n          " + (t ? '<div class="title sliding">' + t + "</div>" : "") + "\n          " + (e.params.preloader ? '\n          <div class="right">\n            ' + e.renderPreloader() + "\n          </div>\n          " : "") + '\n          <div class="subnavbar sliding">' + e.renderSearchbar() + "</div>\n        </div>\n      </div>\n    ").trim() }, e.prototype.renderDropdown = function() { return this.params.renderDropdown ? this.params.renderDropdown.call(this, this.items) : ('\n      <div class="autocomplete-dropdown">\n        <div class="autocomplete-dropdown-inner">\n          <div class="list ' + (this.params.expandInput ? "" : "no-ios-edge") + '">\n            <ul></ul>\n          </div>\n        </div>\n        ' + (this.params.preloader ? this.renderPreloader() : "") + "\n      </div>\n    ").trim() }, e.prototype.renderPage = function() { return this.params.renderPage ? this.params.renderPage.call(this, this.items) : ('\n      <div class="page page-with-subnavbar autocomplete-page" data-name="autocomplete-page">\n        ' + this.renderNavbar() + '\n        <div class="searchbar-backdrop"></div>\n        <div class="page-content">\n          <div class="list autocomplete-list autocomplete-found autocomplete-list-' + this.id + " " + (this.params.formColorTheme ? "color-theme-" + this.params.formColorTheme : "") + '">\n            <ul></ul>\n          </div>\n          <div class="list autocomplete-not-found">\n            <ul>\n              <li class="item-content"><div class="item-inner"><div class="item-title">' + this.params.notFoundText + '</div></div></li>\n            </ul>\n          </div>\n          <div class="list autocomplete-values">\n            <ul></ul>\n          </div>\n        </div>\n      </div>\n    ').trim() }, e.prototype.renderPopup = function() { return this.params.renderPopup ? this.params.renderPopup.call(this, this.items) : ('\n      <div class="popup autocomplete-popup">\n        <div class="view">\n          ' + this.renderPage() + ";\n        </div>\n      </div>\n    ").trim() }, e.prototype.onOpen = function(e, t) {
                var a = this,
                    n = a.app,
                    r = $(t);
                if (a.$el = r, a.el = r[0], a.openedIn = e, a.opened = !0, "dropdown" === a.params.openIn) a.attachDropdownEvents(), a.$dropdownEl.addClass("autocomplete-dropdown-in"), a.$inputEl.trigger("input");
                else { var i = r.find(".searchbar"); "page" === a.params.openIn && "ios" === n.theme && 0 === i.length && (i = $(n.navbar.getElByPage(r)).find(".searchbar")), a.searchbar = n.searchbar.create({ el: i, backdropEl: r.find(".searchbar-backdrop"), customSearch: !0, on: { search: function(e, t) { 0 === t.length && a.searchbar.enabled ? a.searchbar.backdropShow() : a.searchbar.backdropHide(), a.source(t) } } }), a.attachPageEvents(), a.updateValues(), a.params.requestSourceOnOpen && a.source("") }
                a.emit("local::open autocompleteOpen", a)
            }, e.prototype.autoFocus = function() { return this.searchbar && this.searchbar.$inputEl && this.searchbar.$inputEl.focus(), this }, e.prototype.onOpened = function() { "dropdown" !== this.params.openIn && this.params.autoFocus && this.autoFocus(), this.emit("local::opened autocompleteOpened", this) }, e.prototype.onClose = function() {
                var e = this;
                e.destroyed || (e.searchbar && e.searchbar.destroy && (e.searchbar.destroy(), e.searchbar = null, delete e.searchbar), "dropdown" === e.params.openIn ? (e.detachDropdownEvents(), e.$dropdownEl.removeClass("autocomplete-dropdown-in").remove(), e.$inputEl.parents(".item-content-dropdown-expanded").removeClass("item-content-dropdown-expanded")) : e.detachPageEvents(), e.emit("local::close autocompleteClose", e))
            }, e.prototype.onClosed = function() { this.destroyed || (this.opened = !1, this.$el = null, this.el = null, delete this.$el, delete this.el, this.emit("local::closed autocompleteClosed", this)) }, e.prototype.openPage = function() { var a = this; if (a.opened) return a; var e = a.renderPage(); return a.view.router.navigate({ url: a.url, route: { content: e, path: a.url, on: { pageBeforeIn: function(e, t) { a.onOpen("page", t.el) }, pageAfterIn: function(e, t) { a.onOpened("page", t.el) }, pageBeforeOut: function(e, t) { a.onClose("page", t.el) }, pageAfterOut: function(e, t) { a.onClosed("page", t.el) } }, options: { animate: a.params.animate } } }), a }, e.prototype.openPopup = function() { var t = this; if (t.opened) return t; var e = { content: t.renderPopup(), animate: t.params.animate, on: { popupOpen: function(e) { t.onOpen("popup", e.el) }, popupOpened: function(e) { t.onOpened("popup", e.el) }, popupClose: function(e) { t.onClose("popup", e.el) }, popupClosed: function(e) { t.onClosed("popup", e.el) } } }; return t.params.routableModals ? t.view.router.navigate({ url: t.url, route: { path: t.url, popup: e } }) : t.modal = t.app.popup.create(e).open(t.params.animate), t }, e.prototype.openDropdown = function() {
                var e = this;
                e.$dropdownEl || (e.$dropdownEl = $(e.renderDropdown())), e.$inputEl.parents(".list").length && 0 < e.$inputEl.parents(".item-content").length && e.params.expandInput && e.$inputEl.parents(".item-content").addClass("item-content-dropdown-expanded");
                var t = e.$inputEl.parents(".page-content");
                e.params.dropdownContainerEl ? $(e.params.dropdownContainerEl).append(e.$dropdownEl) : 0 === t.length ? e.$dropdownEl.insertAfter(e.$inputEl) : (e.positionDropdown(), t.append(e.$dropdownEl)), e.onOpen("dropdown", e.$dropdownEl), e.onOpened("dropdown", e.$dropdownEl)
            }, e.prototype.open = function() { return this.opened || this["open" + this.params.openIn.split("").map(function(e, t) { return 0 === t ? e.toUpperCase() : e }).join("")](), this }, e.prototype.close = function() { var e = this; return e.opened && ("dropdown" === e.params.openIn ? (e.onClose(), e.onClosed()) : e.params.routableModals || "page" === e.openedIn ? e.view.router.back({ animate: e.params.animate }) : (e.modal.once("modalClosed", function() { Utils.nextTick(function() { e.modal.destroy(), delete e.modal }) }), e.modal.close())), e }, e.prototype.init = function() { this.attachEvents() }, e.prototype.destroy = function() {
                var e = this;
                e.emit("local::beforeDestroy autocompleteBeforeDestroy", e), e.detachEvents(), e.$inputEl && e.$inputEl[0] && delete e.$inputEl[0].f7Autocomplete, e.$openerEl && e.$openerEl[0] && delete e.$openerEl[0].f7Autocomplete, Utils.deleteProps(e), e.destroyed = !0
            }, e
        }(Framework7Class),
        Autocomplete$1 = {
            name: "autocomplete",
            params: { autocomplete: { openerEl: void 0, inputEl: void 0, view: void 0, dropdownContainerEl: void 0, dropdownPlaceholderText: void 0, typeahead: !1, highlightMatches: !0, expandInput: !1, updateInputValueOnSelect: !0, inputEvents: "input", value: void 0, multiple: !1, source: void 0, limit: void 0, valueProperty: "id", textProperty: "text", openIn: "page", pageBackLinkText: "Back", popupCloseLinkText: "Close", pageTitle: void 0, searchbarPlaceholder: "Search...", searchbarDisableText: "Cancel", animate: !0, autoFocus: !1, closeOnSelect: !1, notFoundText: "Nothing found", requestSourceOnOpen: !1, preloaderColor: void 0, preloader: !1, formColorTheme: void 0, navbarColorTheme: void 0, routableModals: !0, url: "select/", renderDropdown: void 0, renderPage: void 0, renderPopup: void 0, renderItem: void 0, renderSearchbar: void 0, renderNavbar: void 0 } },
            static: { Autocomplete: Autocomplete },
            create: function() {
                var a = this;
                a.autocomplete = Utils.extend(ConstructorMethods({ defaultSelector: void 0, constructor: Autocomplete, app: a, domProp: "f7Autocomplete" }), { open: function(e) { var t = a.autocomplete.get(e); if (t && t.open) return t.open() }, close: function(e) { var t = a.autocomplete.get(e); if (t && t.close) return t.close() } })
            }
        },
        Tooltip = function(m) {
            function e(t, e) {
                void 0 === e && (e = {}), m.call(this, t, e);
                var n = this,
                    a = Utils.extend({}, t.params.tooltip);
                n.useModulesParams(a), n.params = Utils.extend(a, e);
                var r = n.params.targetEl;
                if (!r) return n;
                var i = $(r);
                if (0 === i.length) return n;
                if (i[0].f7Tooltip) return i[0].f7Tooltip;
                var o = $(n.render()).eq(0);
                Utils.extend(n, { app: t, $targetEl: i, targetEl: i && i[0], $el: o, el: o && o[0], text: n.params.text || "", visible: !1, opened: !1 }), i[0].f7Tooltip = n;
                var s, l = {};

                function p(e) { s || (s = !0, l.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, l.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, n.show(this)) }

                function c(e) {
                    if (s) {
                        var t = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                            a = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        50 < Math.pow(Math.pow(t - l.x, 2) + Math.pow(a - l.y, 2), .5) && (s = !1, n.hide())
                    }
                }

                function d() { s && (s = !1, n.hide()) }

                function u() { n.show(this) }

                function h() { n.hide() }

                function f() { o.hasClass("tooltip-in") || o.removeClass("tooltip-out").remove() }
                return n.attachEvents = function() {
                    if (o.on("transitionend webkitTransitionEnd", f), Support.touch) {
                        var e = !!Support.passiveListener && { passive: !0 };
                        i.on(t.touchEvents.start, p, e), t.on("touchmove", c), t.on("touchend:passive", d)
                    } else i.on("mouseenter", u), i.on("mouseleave", h)
                }, n.detachEvents = function() {
                    if (o.off("transitionend webkitTransitionEnd", f), Support.touch) {
                        var e = !!Support.passiveListener && { passive: !0 };
                        i.off(t.touchEvents.start, p, e), t.off("touchmove", c), t.off("touchend:passive", d)
                    } else i.off("mouseenter", u), i.off("mouseleave", h)
                }, n.useModules(), n.init(), n
            }
            return m && (e.__proto__ = m), ((e.prototype = Object.create(m && m.prototype)).constructor = e).prototype.position = function(e) {
                var t = this.$el,
                    a = this.app;
                t.css({ left: "", top: "" });
                var n, r, i, o, s = $(e || this.targetEl),
                    l = [t.width(), t.height()],
                    p = l[0],
                    c = l[1];
                if (t.css({ left: "", top: "" }), s && 0 < s.length) {
                    n = s.outerWidth(), r = s.outerHeight();
                    var d = s.offset();
                    i = d.left - a.left, o = d.top - a.top;
                    var u = s.parents(".page");
                    0 < u.length && (o -= u[0].scrollTop)
                }
                var h = [0, 0, 0],
                    f = h[0],
                    m = h[1],
                    v = "top";
                c < o ? m = o - c : c < a.height - o - r ? (v = "bottom", m = o + r) : (v = "middle", (m = r / 2 + o - c / 2) <= 0 ? m = 8 : m + c >= a.height && (m = a.height - c - 8)), "top" === v || "bottom" === v ? ((f = n / 2 + i - p / 2) < 8 && (f = 8), f + p > a.width && (f = a.width - p - 8), f < 0 && (f = 0)) : "middle" === v && ((f = i - p) < 8 || f + p > a.width) && (f < 8 && (f = i + n), f + p > a.width && (f = a.width - p - 8)), t.css({ top: m + "px", left: f + "px" })
            }, e.prototype.show = function(e) {
                var t = this,
                    a = t.app,
                    n = t.$el,
                    r = t.$targetEl;
                a.root.append(n), t.position(e);
                var i = $(e);
                return t.visible = !0, t.opened = !0, r.trigger("tooltip:show", t), n.trigger("tooltip:show", t), i.length && i[0] !== r[0] && i.trigger("tooltip:show", t), t.emit("local::show tooltipShow", t), n.removeClass("tooltip-out").addClass("tooltip-in"), t
            }, e.prototype.hide = function() {
                var e = this.$el,
                    t = this.$targetEl;
                return this.visible = !1, this.opened = !1, t.trigger("tooltip:hide", this), e.trigger("tooltip:hide", this), this.emit("local::hide tooltipHide", this), e.addClass("tooltip-out").removeClass("tooltip-in"), this
            }, e.prototype.render = function() { if (this.params.render) return this.params.render.call(this, this); var e = this.params; return ('\n      <div class="tooltip ' + (e.cssClass || "") + '">\n        <div class="tooltip-content">' + (e.text || "") + "</div>\n      </div>\n    ").trim() }, e.prototype.setText = function(e) { return void 0 === e || (this.params.text = e, this.text = e, this.$el && this.$el.children(".tooltip-content").html(e), this.opened && this.position()), this }, e.prototype.init = function() { this.attachEvents() }, e.prototype.destroy = function() {
                var e = this;
                e.$targetEl && !e.destroyed && (e.$targetEl.trigger("tooltip:beforedestroy", e), e.emit("local::beforeDestroy tooltipBeforeDestroy", e), e.$el.remove(), delete e.$targetEl[0].f7Tooltip, e.detachEvents(), Utils.deleteProps(e), e.destroyed = !0)
            }, e
        }(Framework7Class),
        Tooltip$1 = {
            name: "tooltip",
            static: { Tooltip: Tooltip },
            create: function() { this.tooltip = ConstructorMethods({ defaultSelector: ".tooltip", constructor: Tooltip, app: this, domProp: "f7Tooltip" }), this.tooltip.show = function(e) { var t = $(e); if (0 !== t.length) { var a = t[0].f7Tooltip; if (a) return a.show(t[0]), a } }, this.tooltip.hide = function(e) { var t = $(e); if (0 !== t.length) { var a = t[0].f7Tooltip; if (a) return a.hide(), a } }, this.tooltip.setText = function(e, t) { var a = $(e); if (0 !== a.length) { var n = a[0].f7Tooltip; if (n) return n.setText(t), n } } },
            params: { tooltip: { targetEl: null, text: null, cssClass: null, render: null } },
            on: {
                tabMounted: function(e) {
                    var n = this;
                    $(e).find(".tooltip-init").each(function(e, t) {
                        var a = $(t).attr("data-tooltip");
                        a && n.tooltip.create({ targetEl: t, text: a })
                    })
                },
                tabBeforeRemove: function(e) { $(e).find(".tooltip-init").each(function(e, t) { t.f7Tooltip && t.f7Tooltip.destroy() }) },
                pageInit: function(e) {
                    var n = this;
                    e.$el.find(".tooltip-init").each(function(e, t) {
                        var a = $(t).attr("data-tooltip");
                        a && n.tooltip.create({ targetEl: t, text: a })
                    })
                },
                pageBeforeRemove: function(e) { e.$el.find(".tooltip-init").each(function(e, t) { t.f7Tooltip && t.f7Tooltip.destroy() }) }
            },
            vnode: {
                "tooltip-init": {
                    insert: function(e) {
                        var t = e.elm,
                            a = $(t).attr("data-tooltip");
                        a && this.tooltip.create({ targetEl: t, text: a })
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Tooltip && t.f7Tooltip.destroy()
                    }
                }
            }
        },
        Gauge = function(o) {
            function e(e, t) {
                void 0 === t && (t = {}), o.call(this, e, t);
                var a = this,
                    n = Utils.extend({}, e.params.gauge);
                a.useModulesParams(n), a.params = Utils.extend(n, t);
                var r = a.params.el;
                if (!r) return a;
                var i = $(r);
                return 0 === i.length ? a : i[0].f7Gauge ? i[0].f7Gauge : (Utils.extend(a, { app: e, $el: i, el: i && i[0] }), (i[0].f7Gauge = a).useModules(), a.init(), a)
            }
            return o && (e.__proto__ = o), ((e.prototype = Object.create(o && o.prototype)).constructor = e).prototype.calcRadius = function() { var e = this.params; return e.size / 2 - e.borderWidth / 2 }, e.prototype.calcBorderLength = function() { var e = this.calcRadius(); return 2 * Math.PI * e }, e.prototype.render = function() {
                if (this.params.render) return this.params.render.call(this, this);
                var e = this.params,
                    t = e.type,
                    a = e.value,
                    n = e.size,
                    r = e.bgColor,
                    i = e.borderBgColor,
                    o = e.borderColor,
                    s = e.borderWidth,
                    l = e.valueText,
                    p = e.valueTextColor,
                    c = e.valueFontSize,
                    d = e.valueFontWeight,
                    u = e.labelText,
                    h = e.labelTextColor,
                    f = e.labelFontSize,
                    m = e.labelFontWeight,
                    v = "semicircle" === t,
                    g = this.calcRadius(),
                    b = this.calcBorderLength(),
                    y = Math.max(Math.min(a, 1), 0);
                return ('\n      <svg class="gauge-svg" width="' + n + 'px" height="' + (v ? n / 2 : n) + 'px" viewBox="0 0 ' + n + " " + (v ? n / 2 : n) + '">\n        ' + (v ? '\n          <path\n            class="gauge-back-semi"\n            d="M' + (n - s / 2) + "," + n / 2 + " a1,1 0 0,0 -" + (n - s) + ',0"\n            stroke="' + i + '"\n            stroke-width="' + s + '"\n            fill="' + (r || "none") + '"\n          />\n          <path\n            class="gauge-front-semi"\n            d="M' + (n - s / 2) + "," + n / 2 + " a1,1 0 0,0 -" + (n - s) + ',0"\n            stroke="' + o + '"\n            stroke-width="' + s + '"\n            stroke-dasharray="' + b / 2 + '"\n            stroke-dashoffset="' + b / 2 * (1 + y) + '"\n            fill="' + (i ? "none" : r || "none") + '"\n          />\n        ' : "\n          " + (i ? '\n            <circle\n              class="gauge-back-circle"\n              stroke="' + i + '"\n              stroke-width="' + s + '"\n              fill="' + (r || "none") + '"\n              cx="' + n / 2 + '"\n              cy="' + n / 2 + '"\n              r="' + g + '"\n            ></circle>\n          ' : "") + '\n          <circle\n            class="gauge-front-circle"\n            transform="rotate(-90 ' + n / 2 + " " + n / 2 + ')"\n            stroke="' + o + '"\n            stroke-width="' + s + '"\n            stroke-dasharray="' + b + '"\n            stroke-dashoffset="' + b * (1 - y) + '"\n            fill="' + (i ? "none" : r || "none") + '"\n            cx="' + n / 2 + '"\n            cy="' + n / 2 + '"\n            r="' + g + '"\n          ></circle>\n        ') + "\n        " + (l ? '\n          <text\n            class="gauge-value-text"\n            x="50%"\n            y="' + (v ? "100%" : "50%") + '"\n            font-weight="' + d + '"\n            font-size="' + c + '"\n            fill="' + p + '"\n            dy="' + (v ? u ? -f - 15 : -5 : 0) + '"\n            text-anchor="middle"\n            dominant-baseline="' + (!v && "middle") + '"\n          >' + l + "</text>\n        " : "") + "\n        " + (u ? '\n          <text\n            class="gauge-label-text"\n            x="50%"\n            y="' + (v ? "100%" : "50%") + '"\n            font-weight="' + m + '"\n            font-size="' + f + '"\n            fill="' + h + '"\n            dy="' + (v ? -5 : l ? c / 2 + 10 : 0) + '"\n            text-anchor="middle"\n            dominant-baseline="' + (!v && "middle") + '"\n          >' + u + "</text>\n        " : "") + "\n      </svg>\n    ").trim()
            }, e.prototype.update = function(t) {
                void 0 === t && (t = {});
                var a = this.params,
                    n = this.$gaugeSvgEl;
                if (Object.keys(t).forEach(function(e) { void 0 !== t[e] && (a[e] = t[e]) }), 0 === n.length) return this;
                var e = a.value,
                    r = a.size,
                    i = a.bgColor,
                    o = a.borderBgColor,
                    s = a.borderColor,
                    l = a.borderWidth,
                    p = a.valueText,
                    c = a.valueTextColor,
                    d = a.valueFontSize,
                    u = a.valueFontWeight,
                    h = a.labelText,
                    f = a.labelTextColor,
                    m = a.labelFontSize,
                    v = a.labelFontWeight,
                    g = this.calcBorderLength(),
                    b = Math.max(Math.min(e, 1), 0),
                    y = this.calcRadius(),
                    w = "semicircle" === a.type,
                    C = { width: r + "px", height: (w ? r / 2 : r) + "px", viewBox: "0 0 " + r + " " + (w ? r / 2 : r) };
                if (Object.keys(C).forEach(function(e) { n.attr(e, C[e]) }), w) {
                    var x = { d: "M" + (r - l / 2) + "," + r / 2 + " a1,1 0 0,0 -" + (r - l) + ",0", stroke: o, "stroke-width": l, fill: i || "none" },
                        $ = { d: "M" + (r - l / 2) + "," + r / 2 + " a1,1 0 0,0 -" + (r - l) + ",0", stroke: s, "stroke-width": l, "stroke-dasharray": g / 2, "stroke-dashoffset": g / 2 * (b - 1), fill: o ? "none" : i || "none" };
                    Object.keys(x).forEach(function(e) { n.find(".gauge-back-semi").attr(e, x[e]) }), Object.keys($).forEach(function(e) { n.find(".gauge-front-semi").attr(e, $[e]) })
                } else {
                    var E = { stroke: o, "stroke-width": l, fill: i || "none", cx: r / 2, cy: r / 2, r: y },
                        k = { transform: "rotate(-90 " + r / 2 + " " + r / 2 + ")", stroke: s, "stroke-width": l, "stroke-dasharray": g, "stroke-dashoffset": g * (1 - b), fill: o ? "none" : i || "none", cx: r / 2, cy: r / 2, r: y };
                    Object.keys(E).forEach(function(e) { n.find(".gauge-back-circle").attr(e, E[e]) }), Object.keys(k).forEach(function(e) { n.find(".gauge-front-circle").attr(e, k[e]) })
                }
                if (p) {
                    n.find(".gauge-value-text").length || n.append('<text class="gauge-value-text"></text>');
                    var S = { x: "50%", y: w ? "100%" : "50%", "font-weight": u, "font-size": d, fill: c, dy: w ? h ? -m - 15 : -5 : 0, "text-anchor": "middle", "dominant-baseline": !w && "middle" };
                    Object.keys(S).forEach(function(e) { n.find(".gauge-value-text").attr(e, S[e]) }), n.find(".gauge-value-text").text(p)
                } else n.find(".gauge-value-text").remove();
                if (h) {
                    n.find(".gauge-label-text").length || n.append('<text class="gauge-label-text"></text>');
                    var T = { x: "50%", y: w ? "100%" : "50%", "font-weight": v, "font-size": m, fill: f, dy: w ? -5 : p ? d / 2 + 10 : 0, "text-anchor": "middle", "dominant-baseline": !w && "middle" };
                    Object.keys(T).forEach(function(e) { n.find(".gauge-label-text").attr(e, T[e]) }), n.find(".gauge-label-text").text(h)
                } else n.find(".gauge-label-text").remove();
                return this
            }, e.prototype.init = function() { var e = $(this.render()).eq(0); return e.f7Gauge = this, Utils.extend(this, { $gaugeSvgEl: e, gaugeSvgEl: e && e[0] }), this.$el.append(e), this }, e.prototype.destroy = function() {
                var e = this;
                e.$el && !e.destroyed && (e.$el.trigger("gauge:beforedestroy", e), e.emit("local::beforeDestroy gaugeBeforeDestroy", e), e.$gaugeSvgEl.remove(), delete e.$el[0].f7Gauge, Utils.deleteProps(e), e.destroyed = !0)
            }, e
        }(Framework7Class),
        Gauge$1 = {
            name: "gauge",
            static: { Gauge: Gauge },
            create: function() {
                var n = this;
                n.gauge = ConstructorMethods({ defaultSelector: ".gauge", constructor: Gauge, app: n, domProp: "f7Gauge" }), n.gauge.update = function(e, t) { if (0 !== $(e).length) { var a = n.gauge.get(e); if (a) return a.update(t), a } }
            },
            params: { gauge: { el: null, type: "circle", value: 0, size: 200, bgColor: "transparent", borderBgColor: "#eeeeee", borderColor: "#000000", borderWidth: 10, valueText: null, valueTextColor: "#000000", valueFontSize: 31, valueFontWeight: 500, labelText: null, labelTextColor: "#888888", labelFontSize: 14, labelFontWeight: 400 } },
            on: {
                tabMounted: function(e) {
                    var a = this;
                    $(e).find(".gauge-init").each(function(e, t) { a.gauge.create(Utils.extend({ el: t }, $(t).dataset() || {})) })
                },
                tabBeforeRemove: function(e) { $(e).find(".gauge-init").each(function(e, t) { t.f7Gauge && t.f7Gauge.destroy() }) },
                pageInit: function(e) {
                    var a = this;
                    e.$el.find(".gauge-init").each(function(e, t) { a.gauge.create(Utils.extend({ el: t }, $(t).dataset() || {})) })
                },
                pageBeforeRemove: function(e) { e.$el.find(".gauge-init").each(function(e, t) { t.f7Gauge && t.f7Gauge.destroy() }) }
            },
            vnode: {
                "gauge-init": {
                    insert: function(e) {
                        var t = e.elm;
                        this.gauge.create(Utils.extend({ el: t }, $(t).dataset() || {}))
                    },
                    destroy: function(e) {
                        var t = e.elm;
                        t.f7Gauge && t.f7Gauge.destroy()
                    }
                }
            }
        },
        ViAd = function(p) {
            function e(r, e) {
                void 0 === e && (e = {}), p.call(this, e, [r]);
                var t, i = this;
                if (!win.vi) throw new Error("Framework7: vi SDK not found.");
                void 0 !== win.orientation && (t = -90 === win.orientation || 90 === win.orientation ? "horizontal" : "vertical");
                var a = Utils.extend({}, r.params.vi, { appId: r.id, appVer: r.version, language: r.language, width: r.width, height: r.height, os: Device.os, osVersion: Device.osVersion, orientation: t });
                i.useModulesParams(a), i.params = Utils.extend(a, e);
                var n = {},
                    o = "on autoplay fallbackOverlay fallbackOverlayText enabled".split(" ");
                if (Object.keys(i.params).forEach(function(e) {
                        if (!(0 <= o.indexOf(e))) {
                            var t = i.params[e];
                            0 <= [null, void 0].indexOf(t) || (n[e] = t)
                        }
                    }), !i.params.appId) throw new Error('Framework7: "app.id" is required to display an ad. Make sure you have specified it on app initialization.');
                if (!i.params.placementId) throw new Error('Framework7: "placementId" is required to display an ad.');

                function s() {
                    var e = $("iframe#viAd");
                    0 !== e.length && e.css({ width: r.width + "px", height: r.height + "px" })
                }

                function l() { i.$overlayEl && (i.$overlayEl.off("click touchstart"), i.$overlayEl.remove()) }
                i.ad = new win.vi.Ad(n), Utils.extend(i.ad, {
                    onAdReady: function() { r.on("resize", s), i.emit("local::ready"), i.params.autoplay && i.start() },
                    onAdStarted: function() { i.emit("local::started") },
                    onAdClick: function(e) { i.emit("local::click", e) },
                    onAdImpression: function() { i.emit("local::impression") },
                    onAdStopped: function(e) { r.off("resize", s), l(), i.emit("local::stopped", e), "complete" === e && (i.emit("local::complete"), i.emit("local::completed")), "userexit" === e && i.emit("local::userexit"), i.destroyed = !0 },
                    onAutoPlayFailed: function(e, t) {
                        var a, n;
                        i.emit("local::autoplayFailed", e, t), e && e.name && -1 !== e.name.indexOf("NotAllowedError") && i.params.fallbackOverlay && (a = t) && (i.$overlayEl = $(('\n        <div class="vi-overlay no-fastclick">\n          ' + (i.params.fallbackOverlayText ? '<div class="vi-overlay-text">' + i.params.fallbackOverlayText + "</div>" : "") + '\n          <div class="vi-overlay-play-button"></div>\n        </div>\n      ').trim()), i.$overlayEl.on("touchstart", function() { n = Utils.now() }), i.$overlayEl.on("click", function() {
                            if (!(300 < Utils.now() - n)) {
                                if (a) return a.play(), void l();
                                i.start(), l()
                            }
                        }), r.root.append(i.$overlayEl))
                    },
                    onAdError: function(e) { l(), r.off("resize", s), i.emit("local::error", e), i.destroyed = !0 }
                }), i.init(), Utils.extend(i, { app: r })
            }
            return p && (e.__proto__ = p), ((e.prototype = Object.create(p && p.prototype)).constructor = e).prototype.start = function() { this.destroyed || this.ad && this.ad.startAd() }, e.prototype.pause = function() { this.destroyed || this.ad && this.ad.pauseAd() }, e.prototype.resume = function() { this.destroyed || this.ad && this.ad.resumeAd() }, e.prototype.stop = function() { this.destroyed || this.ad && this.ad.stopAd() }, e.prototype.init = function() { this.destroyed || this.ad && this.ad.initAd() }, e.prototype.destroy = function() { this.destroyed = !0, this.emit("local::beforeDestroy"), Utils.deleteProps(this) }, e
        }(Framework7Class),
        Vi = {
            name: "vi",
            params: { vi: { enabled: !1, autoplay: !0, fallbackOverlay: !0, fallbackOverlayText: "Please watch this ad", showMute: !0, startMuted: (Device.ios || Device.android) && !Device.cordova, appId: null, appVer: null, language: null, width: null, height: null, placementId: "pltd4o7ibb9rc653x14", placementType: "interstitial", videoSlot: null, showProgress: !0, showBranding: !0, os: null, osVersion: null, orientation: null, age: null, gender: null, advertiserId: null, latitude: null, longitude: null, accuracy: null, storeId: null, ip: null, manufacturer: null, model: null, connectionType: null, connectionProvider: null } },
            create: function() {
                var t = this;
                t.vi = {
                    sdkReady: !1,
                    createAd: function(e) { return new ViAd(t, e) },
                    loadSdk: function() {
                        if (!t.vi.sdkReady) {
                            var e = doc.createElement("script");
                            e.onload = function() { t.emit("viSdkReady"), t.vi.sdkReady = !0 }, e.src = "https://c.vi-serve.com/viadshtml/vi.min.js", $("head").append(e)
                        }
                    }
                }
            },
            on: {
                init: function() {
                    (this.params.vi.enabled || this.passedParams.vi && !1 !== this.passedParams.vi.enabled) && this.vi.loadSdk()
                }
            }
        },
        Elevation = { name: "elevation" },
        Typography = { name: "typography" };
    return "undefined" != typeof window && (window.Template7 || (window.Template7 = Template7), window.Dom7 || (window.Dom7 = $)), Framework7.use([DeviceModule, SupportModule, UtilsModule, ResizeModule, RequestModule, TouchModule, ClicksModule, Router$1, HistoryModule, StorageModule, ComponentModule, Statusbar$1, View$1, Navbar$1, Toolbar$1, Subnavbar, TouchRipple$1, Modal$1, Dialog$1, Popup$1, LoginScreen$1, Popover$1, Actions$1, Sheet$1, Toast$1, Preloader$1, Progressbar$1, Sortable$1, Swipeout$1, Accordion$1, ContactsList, VirtualList$1, ListIndex$1, Timeline, Tabs, Panel$1, Card, Chip, Form, Input$1, Checkbox, Radio, Toggle$1, Range$1, Stepper$1, SmartSelect$1, Grid, Calendar$1, Picker$1, InfiniteScroll$1, PullToRefresh$1, Lazy$1, DataTable$1, Fab$1, Searchbar$1, Messages$1, Messagebar$1, Swiper$1, PhotoBrowser$1, Notification$1, Autocomplete$1, Tooltip$1, Gauge$1, Vi, Elevation, Typography]), Framework7
});
//# sourceMappingURL=framework7.min.js.map