var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.keysAt = function (o, index) {
    return Object._keys(o, index);
};
Object._keys = function (o, index) {
    var keys = [], key = null, currentKeyIndex = 0;
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            if (isset(index) && currentKeyIndex == index) {
                return key;
            }
            keys.push(key);
            currentKeyIndex++;
        }
    }
    if (isset(index)) {
        return null;
    }
    return keys;
};
Object.keys = function (o) {
    return Object._keys(o);
};
Object.hasKeys = function (o) {
    return Object._keys(o, 0) != null;
};
Object.values = function (o) {
    var values = [], key = null;
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            values.push(o[key]);
        }
    }
    return values;
};
Object.findManyBy = function (o, field, value, maxCount) {
    var result = [], id = null;
    for (id in o) {
        if (o.hasOwnProperty(id)) {
            var prop = o[id][field];
            var propValue = void 0;
            if (typeof (prop) == 'function') {
                propValue = o[id][field]();
            }
            else {
                propValue = prop;
            }
            if (propValue == value) {
                result.push(o[id]);
                if (isset(maxCount) && maxCount >= result.length) {
                    return result;
                }
            }
        }
    }
    return result;
};
Object.findBy = function (o, field, value) {
    return this.findManyBy(o, field, value, 1)[0];
};
Object.toJson = function (o) {
    if (typeof (o) != 'object' || o == null) {
        return o;
    }
    var json = {};
    if ($.isArray(o)) {
        json = [];
    }
    var type = '';
    var property = null;
    var observable = ko.observable();
    var computed = ko.computed(function () { });
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            property = o[p];
            type = typeof (property);
            if (type == 'function') {
                if (property.prototype.constructor.name == observable.prototype.constructor.name ||
                    property.prototype.constructor.name == computed.prototype.constructor.name) {
                    json[p] = Object.toJson(property.call(o));
                }
            }
            else if (property != null && type == 'object') {
                json[p] = Object.toJson(property);
            }
            else {
                json[p] = property;
            }
        }
    }
    return json;
};
String.generate = function (length) {
    if (length === void 0) { length = 10; }
    return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".random(length);
};
String.prototype.contains = function (str) {
    return this.indexOf(str) != -1;
};
String.format = function (str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return str.format.apply(str, args);
};
String.prototype.toProperCase = function () {
    return this.replace(/([A-ZÀÂÉÈÊËÏÎÔÖÛÙÜÇ])+/ig, function (mot) {
        return mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase();
    });
};
String.prototype.random = function (length) {
    if (length === void 0) { length = 10; }
    var text = "";
    for (var i = 0; i < length; i++) {
        text += this.charAt(Math.floor(Math.random() * this.length));
    }
    return text;
};
String.prototype.shake = function () {
    return this.split("").shake().join("");
};
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length == 1 && $.isArray(args[0])) {
        args = args[0];
    }
    return this == '' ? this : sprintf.apply(this, [this].concat(args));
};
String.prototype.lPad = function (pchar, length) {
    if (length === void 0) { length = 1; }
    var s = this;
    while (s.length < length) {
        s = pchar + s;
    }
    return CString(s);
};
String.prototype.rPad = function (pchar, length) {
    if (length === void 0) { length = 1; }
    var s = this;
    while (s.length < length) {
        s = s + pchar;
    }
    return CString(s);
};
String.prototype.replaceAll = function (strToReplace, str) {
    return this.replace(new RegExp(strToReplace, 'g'), str);
};
String.prototype.left = function (len) {
    return this.substring(0, len);
};
String.prototype.right = function (len) {
    return this.substring(this.length - len);
};
String.prototype.RTrim = function (value) {
    if (isset(value)) {
        return this.replace(new RegExp(value + "+$"), "");
    }
    return this.replace(/ +$/, "");
};
String.prototype.LTrim = function (value) {
    if (isset(value)) {
        return this.replace(new RegExp('^' + value + "+"), "");
    }
    return this.replace(/^ +/, "");
};
String.prototype.equalsIgnoreCase = function (str) {
    if (typeof (str) != "string") {
        return false;
    }
    return this.toUpperCase() == str.toUpperCase();
};
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
String.prototype.text = function (allowed) {
    //  discuss at: http://phpjs.org/functions/strip_tags/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Luke Godfrey
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Pul
    //    input by: Alex
    //    input by: Marc Palau
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Bobby Drake
    //    input by: Evertjan Garretsen
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Eric Nagel
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Tomasz Wesolowski
    //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    //   returns 2: '<p>Kevin van Zonneveld</p>'
    //   example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    //   returns 3: "<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>"
    //   example 4: strip_tags('1 < 5 5 > 1');
    //   returns 4: '1 < 5 5 > 1'
    //   example 5: strip_tags('1 <br/> 1');
    //   returns 5: '1  1'
    //   example 6: strip_tags('1 <br/> 1', '<br>');
    //   returns 6: '1 <br/> 1'
    //   example 7: strip_tags('1 <br/> 1', '<br><br/>');
    //   returns 7: '1 <br/> 1'
    if (allowed === void 0) { allowed = ''; }
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsTags = /<!--[\s\S]*?-->/gi;
    return this
        .replace(commentsTags, '')
        .replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
};
/**
 * get UTC Time
 * @return a utc time of the current date
 */
Date.prototype.getUTCTime = function () {
    var now = new Date(0);
    now.setUTCFullYear(this.getUTCFullYear());
    now.setUTCMonth(this.getUTCMonth());
    now.setUTCDate(this.getUTCDate());
    now.setUTCHours(this.getUTCHours());
    now.setUTCMinutes(this.getUTCMinutes());
    now.setUTCSeconds(this.getUTCSeconds());
    now.setUTCMilliseconds(this.getUTCMilliseconds());
    return now.getTime();
};
Date.prototype.getTimeAge = function (d, i, o) {
    if (i === void 0) { i = 't'; }
    d = d || new Date();
    i = i || 't';
    o = o || { abs: false };
    var diff = d.getTime() - this.getTime();
    if (o.abs) {
        diff = Math.abs(diff);
    }
    switch (i) {
        case 'd': return diff / 1000 / 3600 / 24;
        case 'h': return diff / 1000 / 3600;
        case 'n': return diff / 1000 / 60;
        case 's': return diff / 1000;
        case 't':
        default: return diff;
    }
};
Date.prototype.getYearAge = function (d) {
    var dDiff = new Date(this.getTimeAge(d));
    return dDiff.getFullYear() - 1970;
};
Date.prototype.getMonthAge = function (d) {
    var dDiff = new Date(this.getTimeAge(d));
    return (dDiff.getFullYear() - 1970) * 12 + (dDiff.getMonth() + 1);
};
Date.prototype.add = function (i, n) {
    switch (i) {
        case 'y':
            this.addYear(n);
            break;
        case 'm':
            this.addMonth(n);
            break;
        case 'd':
            this.addDate(n);
            break;
        case 'h':
            this.setHours(this.getHours() + n);
            break;
        case 'n':
            this.setMinutes(this.getMinutes() + n);
            break;
        case 's':
            this.setSeconds(this.getSeconds() + n);
            break;
        case 't':
        default: this.setTime(this.getTime() + n);
    }
};
Date.prototype.addDate = function (n) {
    this.setDate(this.getDate() + n);
};
Date.prototype.addMonth = function (n) {
    this.setMonth(this.getMonth() + n);
};
Date.prototype.addYear = function (n) {
    this.setFullYear(this.getFullYear() + n);
};
Date.prototype.isPast = function (d) {
    d = d || new Date();
    return this.getTime() < d.getTime();
};
Date.prototype.isFuture = function (d) {
    d = d || new Date();
    return this.getTime() > d.getTime();
};
Date.prototype.isToday = function () {
    return this.isSameDate();
};
Date.prototype.isSameDate = function (d) {
    var dNow_ = d || new Date();
    return this.getFullYear() == dNow_.getFullYear() && this.getMonth() == dNow_.getMonth() && this.getDate() == dNow_.getDate();
};
Date.prototype.getAge = function (d) {
    var dDiff = new Date(this.getTimeAge(d));
    return {
        Date: dDiff,
        Year: dDiff.getFullYear() - 1970,
        Month: dDiff.getMonth() + 1,
        Day: dDiff.getDate(),
        Hours: dDiff.getHours(),
        Minutes: dDiff.getMinutes(),
        Seconds: dDiff.getSeconds(),
        Time: dDiff.getTime()
    };
};
Date.prototype.isNow = function () {
    var now = new Date();
    return this.isToday() && this.getHours() == now.getHours() && this.getMinutes() == now.getMinutes();
};
Array.prototype.each = function (fn) {
    $.each(this, function (k, v) {
        fn.call(this, v, k);
    });
};
Array.prototype.equals = function (ary) {
    if (!ary)
        return false;
    if (this === ary)
        return true;
    if (this.length != ary.length)
        return false;
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    for (var i = 0; i < ary.length; ++i) {
        if (this[i] !== ary[i])
            return false;
    }
    return true;
};
Array.prototype.first = function () {
    return this.length > 0 ? this[0] : null;
};
Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
};
Array.prototype.contains = function (o) {
    if (!$.isArray(o)) {
        return this.indexOf(o) != -1;
    }
    for (var i = 0, len = o.length; i < len; i++) {
        if (this.indexOf(o[i]) == -1) {
            return false;
        }
    }
    return true;
};
Array.prototype.union = function (o) {
    var ary = [];
    var tab1 = this.length > o.length ? o : this;
    var tab2 = this.length > o.length ? this : o;
    for (var i = 0, len = tab1.length; i < len; i++) {
        if (tab2.indexOf(tab1[i]) > -1) {
            ary.push(tab1[i]);
        }
    }
    return ary;
};
Array.prototype.fusion = function (o) {
    var r = [].concat(this);
    if (!$.isArray(o)) {
        o = [o];
    }
    for (var i = 0, len = o.length; i < len; i++) {
        if (!r.contains(o[i])) {
            r.push(o[i]);
        }
    }
    return r;
};
Array.prototype.unique = function () {
    var r = [];
    for (var i = 0, len = this.length; i < len; i++) {
        if (!r.contains(this[i])) {
            r.push(this[i]);
        }
    }
    return r;
};
Array.prototype.indexOfStr = function (elt, from) {
    if (from === void 0) { from = 0; }
    // confirm array is populated
    var len = this.length;
    var i = from < 0 ? Math.max(0, len + from) : from;
    var str = elt.toLowerCase();
    for (; i < len; i++) {
        if ((typeof (this[i]) == 'string') && this[i].toLowerCase() == str) {
            return i;
        }
    }
    // stick with inArray/indexOf and return -1 on no match
    return -1;
};
Array.prototype.pushOnce = function (elt, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = false; }
    var eltUCase = (caseSensitive && typeof (elt) == "string") ? elt.toUpperCase() : elt;
    var m = caseSensitive ? this.map(function (v) { return typeof (v) == "string" ? v.toUpperCase() : v; }) : this;
    if (m.indexOf(eltUCase) == -1) {
        this.push(elt);
        return true;
    }
    return false;
};
Array.prototype.removeAt = function (index) {
    if (index != -1) {
        return this.splice(index, 1);
    }
    return null;
};
Array.prototype.remove = function (o) {
    var index = this.indexOf(o);
    return this.removeAt(index);
};
Array.prototype.removeAll = function (l) {
    if (isset(l)) {
        var a = [];
        for (var i = 0; i < l.length; i++) {
            a.push(this.remove(l[i]));
        }
        return a;
    }
    else {
        return this.splice(0, this.length);
    }
};
Array.prototype.clear = function () {
    return this.removeAll();
};
Array.prototype.findManyBy = function (field, value, from, maxCount) {
    if (from === void 0) { from = 0; }
    var len = this.length;
    var result = [];
    from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
        from += len;
    }
    for (; from < len; from++) {
        if (from in this) {
            var sValue = null;
            if (typeof (this[from][field]) == 'function') {
                sValue = this[from][field]();
            }
            else {
                sValue = this[from][field];
            }
            if (sValue == value) {
                result.push(this[from]);
                if (isset(maxCount) && result.length >= maxCount) {
                    break;
                }
            }
        }
    }
    return result;
};
Array.prototype.findBy = function (field, value, from) {
    if (from === void 0) { from = 0; }
    return this.findManyBy(field, value, from, 1)[0];
};
Array.prototype.get = function (ind) {
    return this[ind];
};
Array.prototype.shake = function () {
    var t_ = [].concat(this);
    var r_ = [];
    while (t_.length > 0) {
        var index_ = Math.floor(Math.random() * this.length);
        r_.push(t_.splice(index_, 1));
    }
    return r_;
};
if (![].fill) {
    Array.prototype.fill = function (value) {
        var O = Object(this);
        var len = parseInt(O.length, 10);
        var start = arguments[1];
        var relativeStart = parseInt(start, 10) || 0;
        var k = relativeStart < 0
            ? Math.max(len + relativeStart, 0)
            : Math.min(relativeStart, len);
        var end = arguments[2];
        var relativeEnd = end === undefined
            ? len
            : (parseInt(end) || 0);
        var final = relativeEnd < 0
            ? Math.max(len + relativeEnd, 0)
            : Math.min(relativeEnd, len);
        for (; k < final; k++) {
            O[k] = value;
        }
        return O;
    };
}
Number.prototype.round = function (decimal) {
    if (decimal === void 0) { decimal = 2; }
    return Number(Number(this).toFixed(decimal));
};
/// <reference path="./prototypes/Object.prototype.ts"/>
/// <reference path="./prototypes/String.prototype.ts"/>
/// <reference path="./prototypes/Date.prototype.ts"/>
/// <reference path="./prototypes/Array.prototype.ts"/>
/// <reference path="./prototypes/Number.prototype.ts"/>
function isset(value) {
    return value != null && typeof (value) != "undefined";
}
function defer(fn, delay, context) {
    return setTimeout(function () {
        fn.call(context || this);
    }, delay);
}
function fire(fn, args) {
    if (!fn)
        return;
    if (isset(args) && !Array.isArray(args)) {
        args = [args];
    }
    if (typeof (fn) == "function") {
        fn.apply(this, args);
    }
    else {
        fn.fn.apply(fn.context || this, args);
    }
}
/**
*
* @param value
* @param nbdec
* @return
*/
function round(value, nbdec) {
    if (nbdec === void 0) { nbdec = 0; }
    return CNumber(value, nbdec);
}
/**
*
*/
function CString(obj) {
    return isset(obj) ? String(obj).toString() : "";
}
/**
*
*/
function CFloat(obj, rnd) {
    var f = parseFloat(obj);
    return isNaN(f) ? 0 : (rnd ? round(f, rnd) : f);
}
function CNumber(obj, rnd) {
    var n = Number(obj);
    return isNaN(n) ? 0 : (rnd ? n.round(rnd) : n);
}
/**
*
*/
function CInt(obj) {
    var i = parseInt(obj);
    return isNaN(i) ? 0 : i;
}
/**
*
* @param obj
* @return
*/
function is_string(obj) {
    return typeof (obj) == "string";
}
/**
*
* @param obj
* @return
*/
function is_numeric(obj) {
    if (is_string(obj)) {
        if (obj.trim() == '') {
            return false;
        }
    }
    return !isNaN(Number(obj));
}
function dispose(obj) {
    ko.utils.dispose(obj);
}
function count(start, end, fn, step, delay) {
    if (step === void 0) { step = 1; }
    if (delay === void 0) { delay = 1000; }
    var nextValue = start + step;
    if ((start - end) < (nextValue - end)) {
        nextValue = start - step;
        end = -end;
    }
    fn.call(this, start);
    if (start >= end) {
        defer(function () {
            count(nextValue, end, fn, step, delay);
        }, delay);
    }
}
function count_down(start, fn, delay) {
    if (delay === void 0) { delay = 1000; }
    count(start, 0, fn);
}
(function (ko) {
    // Check if an object is an observable array
    ko.utils.isObservableArray = function (obj) {
        return ko.isObservable(obj) && obj['destroyAll'] !== undefined;
    },
        ko.utils.dispose = function (obj) {
            if (obj != null) {
                if (ko.isObservable(obj)) {
                    if (ko.isComputed(obj)) {
                        obj.dispose();
                    }
                    ko.utils.dispose(obj());
                }
                else if ($.isArray(obj)) {
                    for (var i = 0, length_1 = obj.length; i < length_1; i++) {
                        ko.utils.dispose(obj[i]);
                    }
                    obj.length = 0;
                }
                else if (typeof (obj) == 'object') {
                    if (typeof (obj.dispose) == 'function') {
                        obj.dispose();
                    }
                }
            }
        },
        ko.observableArray.fn.filterByProperty = function (propName, matchValue) {
            var allItems, matchingItems;
            allItems = this();
            matchingItems = ko.observableArray([]);
            for (var i = 0; i < allItems.length; i++) {
                var current = allItems[i];
                if (ko.utils.unwrapObservable(current[propName]) === matchValue)
                    matchingItems.push(current);
            }
            return matchingItems;
        };
    var subscribeOnce = function (observable, callback, context, eventName) {
        var subscription = observable.subscribe(function (v) {
            callback.call(context || this, v);
            subscription.dispose();
        }, observable, eventName);
        return subscription;
    };
    ko.observable.fn.subscribeOnce = ko.computed.fn.subscribeOnce = function (callback, context) {
        return subscribeOnce(this, callback, context);
    };
    ko.observable.fn.immediateSubscribe = ko.computed.fn.immediateSubscribe = function (callback, context, eventName) {
        var subscription = this.subscribe(callback, context || this, eventName);
        callback.call(context || this, this());
        return subscription;
    };
    ko.observable.fn.makeTrueIfNot = function (observable, ope) {
        return this.dependsOn(observable, function (b) { return !b; }, ope);
    };
    ko.observable.fn.dependsOn = function (observable, fn, ope) {
        if (!this.__dependencies) {
            this.__dependencies = {
                _computed: null,
                all: ko.observableArray([])
            };
            this.__dependencies._computed = ko.computed(function () {
                var dependenciesArray = this.__dependencies.all();
                var r = null;
                for (var i = 0, len = dependenciesArray.length; i < len; i++) {
                    var dependencyObservable = dependenciesArray[i];
                    var rt = dependencyObservable.fn(dependencyObservable.obs());
                    if (r == null) {
                        r = rt;
                    }
                    else {
                        if (dependencyObservable.ope == 0) {
                            r = r || rt;
                        }
                        else {
                            r = r && rt;
                        }
                    }
                }
                return r;
            }, this);
            this.__dependencies._computed.subscribe(function (b) {
                if (isset(b)) {
                    this(b);
                }
            }, this);
        }
        if (typeof (fn) != 'function') {
            fn = function (v) { return v; };
        }
        this.__dependencies.all.push({
            obs: observable,
            fn: fn,
            ope: ope || 0
        });
        return;
    };
})(ko);
var utils;
(function (utils) {
    var _flattenObject = function (result, object, prefix) {
        for (var prop in object) {
            var key = prop;
            var value = object[key];
            if (typeof value == "object") {
                // Continue with sub object
                _flattenObject(result, value, key + ".");
            }
            else if ((typeof value == "string") && value.indexOf("{") == 0) {
                // Try to parse the string as an JSON string
                try {
                    value = JSON.parse(value);
                    // Continue with sub object
                    _flattenObject(result, value, key + ".");
                }
                catch (e) {
                    // Can not parse object, add the value as it
                    result[prefix + key] = value;
                }
            }
            else {
                // Add the value
                result[prefix + key] = value;
            }
        }
    };
    /**
     * Clones the given instance.
     * @param {*} srcInstance An instance.
     * @return {*} The clone of the given instance.
     */
    function clone(srcInstance) {
        if (typeof (srcInstance) != 'object' || srcInstance == null) {
            return srcInstance;
        }
        var newInstance = new srcInstance.constructor();
        for (var i in srcInstance) {
            newInstance[i] = clone(srcInstance[i]);
        }
        return newInstance;
    }
    utils.clone = clone;
    function getElementText(element) {
        if (!element)
            return null;
        var text = element.text;
        if (text !== undefined) {
            return text;
        }
        text = element.textContent;
        if (text !== undefined) {
            return text;
        }
        return element.nodeValue;
    }
    utils.getElementText = getElementText;
    function formatEmail(email) {
        var t = email.split('@');
        return t[0].substr(0, 64).replace(/[^.a-zA-Z0-9!#$%&'*_+-/=?^`{|}~]/g, '_') + (t[1] ? '@' + t[1] : '');
    }
    utils.formatEmail = formatEmail;
    /**
     * Format a string by replacing argument expressed inside curly brackets with given arguments
     * Search occurences of a pattern of the form ${XXXX} or $XXX with the dolar sign not escaped
     * @return a formatted string
     */
    function formatString(str, parameters) {
        var formatted, match, re, remaining, needToTraduce;
        formatted = str;
        needToTraduce = false;
        remaining = str;
        re = new RegExp("\\$(?:\\{(\\!{0,1}(\\w|\\.)+)\\}|(\\!{0,1}(\\w|\\.)+))", "");
        match = re.exec(remaining);
        while (match) {
            // Append the beginning of the match
            var param = match[1];
            if (param && param.startsWith('!')) {
                param = param.substring(1);
                needToTraduce = true;
            }
            // Search param the parameters
            var value = ko.unwrap(parameters[param]);
            if (isset(value)) {
                if (needToTraduce) {
                    value = app.i18n.getString(value, value);
                }
                // Substitute parameter
                formatted = formatted.replace(match[0], value);
            }
            // 
            remaining = remaining.substring(match[0].length);
            // find next match
            match = re.exec(remaining);
        }
        return formatted;
    }
    utils.formatString = formatString;
    // Flatten an object. e.g. {"a" :"1", "b": {"c" : "2"} becomes {"a": "1", "b.c" : "2"}
    function flattenObject(object) {
        var result = {};
        _flattenObject(result, object, "");
        return result;
    }
    utils.flattenObject = flattenObject;
    /**
     * Parse a given log message
     * log message MUST respect the following format
     *
     * 			let log_message = "log_id {param1:value1}{param2:value2}{param3:value3}"
     *
     * @param a log message as described above
     *
     * @return an object containing the log id and another object for the parameters
     * that contains for each param id, its associated value.
     */
    function parseLogMessage(logMessage) {
        var obj = {
            id: null,
            parameters: {}
        };
        var parameters = {};
        var indexFirstBraket;
        var indexSecondBraket;
        // Get the position of the first parameters if it exists
        indexFirstBraket = logMessage.indexOf("{");
        indexSecondBraket = logMessage.indexOf("}");
        if (indexFirstBraket > 0 && indexSecondBraket > 0 && indexFirstBraket < indexSecondBraket) {
            // Get the log id
            obj.id = logMessage.substr(0, indexFirstBraket).trim();
            // Then, retrieve the parameters
            var current = logMessage;
            while ((indexFirstBraket >= 0) && (indexSecondBraket > 0) && (indexFirstBraket < indexSecondBraket)) {
                // Is there any parameters between curly brackets ?
                if (indexSecondBraket - indexFirstBraket > 1) {
                    // Yes, there is a parameter.... extract it !
                    var parameter = current.substr(indexFirstBraket + 1, (indexSecondBraket - indexFirstBraket - 1)).trim();
                    var temp = parameter.split(":", 2);
                    parameters[temp[0]] = temp[1];
                }
                // Test if we are at the end of the string
                if (indexSecondBraket == current.length) {
                    break;
                }
                else {
                    // We are not at the end of the string, so we can continue !
                    current = current.substr(indexSecondBraket + 1);
                    indexFirstBraket = current.indexOf("{");
                    indexSecondBraket = current.indexOf("}");
                }
            }
        }
        else {
            obj.id = logMessage.trim();
        }
        obj.parameters = parameters;
        return obj;
    }
    utils.parseLogMessage = parseLogMessage;
    /**
     * Parse a given log message which has the following syntax :
     * {"errorCode":0,"errorMessage":"<ID><{P}>*"}
     * <ID> should be a valid message id present in the internationalization excel file.
     * <{P}>* is the paramters which are not translated.
     *
     * example : {"errorCode":0,"errorMessage":"blabla{parameter1}{parameter2}"}
     *
     * @param a log message
     * @return the internationalized string constructed from the id and the parameters contained
     * in the logMessage string.
     */
    function getInternationalizedLogMessage(logMessage) {
        var message;
        var jsonObject;
        try {
            jsonObject = JSON.parse(logMessage);
            var log = parseLogMessage(jsonObject.errorMessage);
            var translated_message = app.i18n.getString(log.id);
            if (translated_message) {
                message = formatString(translated_message, log.parameters);
            }
            else {
                message = log.id;
            }
        }
        catch (e) {
            message = e.message;
        }
        return message;
    }
    utils.getInternationalizedLogMessage = getInternationalizedLogMessage;
    function getParamValue(param, url) {
        var u = url == undefined ? document.location.href : url;
        var reg = new RegExp('(\\?|&|^)' + param + '=(.*?)(&|$)');
        var matches = u.match(reg);
        if (matches) {
            return matches[2] != undefined ? decodeURIComponent(matches[2]).replace(/\+/g, ' ') : '';
        }
        return '';
    }
    utils.getParamValue = getParamValue;
    function formatMonthToYear(month, strict) {
        if (strict === void 0) { strict = true; }
        var sRetour_ = "";
        var iNbMois12_ = parseInt("" + (month / 12));
        if (iNbMois12_ <= 1) {
            sRetour_ = iNbMois12_ + " " + app.i18n.getString('year');
        }
        else {
            sRetour_ = iNbMois12_ + " " + app.i18n.getString('years');
        }
        if (!strict && month % 12 != 0) {
            sRetour_ += " " + app.i18n.getString('and') + " " + (month % 12) + " " + app.i18n.getString('month');
        }
        return sRetour_;
    }
    utils.formatMonthToYear = formatMonthToYear;
    /**
     * format dates
     * @param dateFormat the date format defines in local index
     * @return a formatted string date in the "dateFormat" format
     */
    function formatDate(d, dateFormat, hourFormat, utc) {
        if (hourFormat === void 0) { hourFormat = ""; }
        if (utc === void 0) { utc = false; }
        if (!d)
            return null;
        if (typeof (d) != "object") {
            d = new Date(d);
        }
        var get2digits = function (num) {
            return num.toString().lPad('0', 2);
        };
        var getLiteralMonth = function (monthNumber) {
            var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
            return app.i18n.getString(months[monthNumber]);
        };
        var getLiteralDay = function (dayNumber) {
            var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            return app.i18n.getString(days[dayNumber]);
        };
        var iFullYear_;
        var iMonth_;
        var iDay_;
        var iDate_;
        var iHours_;
        var iMinutes_;
        var iSeconds_;
        var iMilliseconds_;
        if (utc) {
            iFullYear_ = d.getUTCFullYear();
            iMonth_ = d.getUTCMonth();
            iDate_ = d.getUTCDate();
            iDay_ = d.getUTCDay();
            iHours_ = d.getUTCHours();
            iMinutes_ = d.getUTCMinutes();
            iSeconds_ = d.getUTCSeconds();
            iMilliseconds_ = d.getUTCMilliseconds();
        }
        else {
            iFullYear_ = d.getFullYear();
            iMonth_ = d.getMonth();
            iDate_ = d.getDate();
            iDay_ = d.getDay();
            iHours_ = d.getHours();
            iMinutes_ = d.getMinutes();
            iSeconds_ = d.getSeconds();
            iMilliseconds_ = d.getMilliseconds();
        }
        dateFormat = dateFormat.toLowerCase();
        dateFormat = dateFormat.replace('yyyy', iFullYear_.toString());
        var monthType = null, dayType = null;
        if (dateFormat.indexOf('month') != -1) {
            monthType = 'month';
            dateFormat = dateFormat.replace('month', '{0}');
        }
        else if (dateFormat.indexOf('mm') != -1) {
            monthType = 'mm';
            dateFormat = dateFormat.replace('mm', '{0}');
        }
        else if (dateFormat.indexOf('m') != -1) {
            monthType = 'm';
            dateFormat = dateFormat.replace('m', '{0}');
        }
        if (dateFormat.indexOf('day') != -1) {
            dayType = 'day';
            dateFormat = dateFormat.replace('day', '{1}');
        }
        else if (dateFormat.indexOf('dd') != -1) {
            dayType = 'dd';
            dateFormat = dateFormat.replace('dd', '{1}');
        }
        else if (dateFormat.indexOf('d') != -1) {
            dayType = 'd';
            dateFormat = dateFormat.replace('d', '{1}');
        }
        if (monthType == 'month') {
            dateFormat = dateFormat.replace('{0}', getLiteralMonth(iMonth_));
        }
        else if (monthType == 'mm') {
            dateFormat = dateFormat.replace('{0}', get2digits(iMonth_ + 1));
        }
        else if (monthType == 'm') {
            dateFormat = dateFormat.replace('{0}', String(iMonth_ + 1));
        }
        if (dayType == 'day') {
            dateFormat = dateFormat.replace('{1}', getLiteralDay(iDay_) + ' ' + iDate_.toString());
        }
        else if (dayType == 'dd') {
            dateFormat = dateFormat.replace('{1}', get2digits(iDate_));
        }
        else if (dayType == 'd') {
            dateFormat = dateFormat.replace('{1}', String(iDate_));
        }
        var hours = '';
        if (hourFormat.toLowerCase() == 'h12') {
            var suffix = ' AM';
            hours = get2digits(iHours_);
            if (iHours_ >= 12) {
                suffix = ' PM';
                if (iHours_ != 12) {
                    hours = get2digits(iHours_ - 12);
                }
            }
            else {
                if (hours == '00') {
                    hours = '12';
                }
            }
            hours += ':' + get2digits(iMinutes_) + ':' + get2digits(iSeconds_) + suffix;
        }
        else if (hourFormat.toLowerCase() == 'h24') {
            hours = get2digits(iHours_) + ':' + get2digits(iMinutes_) + ':' + get2digits(iSeconds_);
        }
        else {
            if (hourFormat.indexOf('hh') > -1) {
                hourFormat = hourFormat.replace('hh', get2digits(iHours_));
            }
            if (hourFormat.indexOf('mm') > -1) {
                hourFormat = hourFormat.replace('mm', get2digits(iMinutes_));
            }
            if (hourFormat.indexOf('ss') > -1) {
                hourFormat = hourFormat.replace('ss', get2digits(iSeconds_));
            }
            if (hourFormat.indexOf('t') > -1) {
                hourFormat = hourFormat.replace('t', String(iMilliseconds_));
            }
            hours = hourFormat;
        }
        if (hours) {
            return dateFormat + ' ' + hours;
        }
        return dateFormat;
    }
    utils.formatDate = formatDate;
    /**
    * Traite et converti une chaine. La valeur peut être modifiée pour correspondre à une valeur date.
    * Renvoi un objet Calendar contenant la chaine traitée.
    *
    * @param string	La chaine
    * @param locale 	La locale utilisée
    */
    function parseLiteralDate(str, locale) {
        if (!str)
            return null;
        var sValue_ = str;
        var iJour_ = 0;
        var iMois_ = 1;
        var iAnnee_ = 2;
        var iMarge_ = 50;
        var tsDate_ = sValue_.split(locale.dateSeparator);
        if (tsDate_.length == 1) {
            if ([4, 6, 8].contains(sValue_.length)) {
                tsDate_ = [, ,];
                var sPosDay_ = locale.dateLiteralFormat.indexOf('D');
                var sPosMonth_ = locale.dateLiteralFormat.indexOf('M');
                var sPosYear_ = locale.dateLiteralFormat.indexOf('Y');
                var sLengthYear_ = Math.abs(8 - sValue_.length - 4);
                if (sLengthYear_ > 0) {
                    if (sPosYear_ == 0) {
                        tsDate_[iAnnee_] = sValue_.substr(0, sLengthYear_);
                    }
                    else if (sPosYear_ == 1) {
                        tsDate_[iAnnee_] = sValue_.substr(2, sLengthYear_);
                    }
                    else {
                        tsDate_[iAnnee_] = sValue_.substr(4, sLengthYear_);
                    }
                }
                if (sPosDay_ == 0) {
                    tsDate_[iJour_] = sValue_.substr(0, 2);
                }
                else if (sPosDay_ == 1) {
                    if (sPosYear_ == 0) {
                        tsDate_[iJour_] = sValue_.substr(sLengthYear_, 2);
                    }
                    else {
                        tsDate_[iJour_] = sValue_.substr(2, 2);
                    }
                }
                else {
                    tsDate_[iJour_] = sValue_.substr(2 + sLengthYear_, 2);
                }
                if (sPosMonth_ == 0) {
                    tsDate_[iMois_] = sValue_.substr(0, 2);
                }
                else if (sPosMonth_ == 1) {
                    if (sPosYear_ == 0) {
                        tsDate_[iMois_] = sValue_.substr(sLengthYear_, 2);
                    }
                    else {
                        tsDate_[iMois_] = sValue_.substr(2, 2);
                    }
                }
                else {
                    tsDate_[iMois_] = sValue_.substr(2 + sLengthYear_, 2);
                }
            }
        }
        else if (tsDate_.length == 2) {
            return null;
        }
        var sJour_;
        var sMois_;
        var sAnnee_;
        switch (tsDate_.length) {
            case 3:
                sJour_ = tsDate_[iJour_];
                sMois_ = tsDate_[iMois_];
                sAnnee_ = tsDate_[iAnnee_];
                break;
            case 2:
                sJour_ = tsDate_[iJour_];
                sMois_ = tsDate_[iMois_];
                sAnnee_ = CString(new Date().getFullYear());
                break;
            default:
                return null;
        }
        if (isNaN(sJour_) || isNaN(sMois_) || isNaN(sAnnee_)) {
            return null;
        }
        iMois_ = parseInt(sMois_, 10);
        if (iMois_ == 0) {
            iMois_ = 1;
            sMois_ = "1";
        }
        if (iMois_ > 0 && iMois_ < 13) {
            var iJourMax_ = 31;
            switch (iMois_) {
                case 2:
                    iJourMax_ = 29;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    iJourMax_ = 30;
                    break;
            }
            if (parseInt(sJour_, 10) > iJourMax_) {
                return null;
            }
        }
        else {
            return null;
        }
        sAnnee_ = sAnnee_.lPad("0", 2);
        var iAnCour_ = new Date().getFullYear();
        var iAnTemp_ = iAnCour_ - iMarge_;
        var sAnTemp_ = sAnnee_.lPad(CString(iAnTemp_).substr(0, 2), 4);
        if (parseInt(sAnTemp_, 10) < (iAnCour_ - iMarge_)) {
            sAnnee_ = sAnnee_.lPad(CString(iAnCour_).substr(0, 2), 4);
        }
        else {
            sAnnee_ = sAnTemp_;
        }
        if (parseInt(sAnnee_, 10) < 1900 || parseInt(sAnnee_, 10) > 9999) {
            return null;
        }
        return new Date(parseInt(sAnnee_, 10), parseInt(sMois_, 10) - 1, parseInt(sJour_, 10));
    }
    utils.parseLiteralDate = parseLiteralDate;
    ;
    function formatDecimal(str, digits, locale) {
        if (is_numeric(str)) {
            if (!isset(locale)) {
                locale = app.i18n.getCurrentLocale();
            }
            var sign = "";
            if (Number(str) < 0) {
                sign = "-";
            }
            var fvalue_ = Math.abs(Number(str));
            if (isset(digits)) {
                fvalue_ = fvalue_.round(digits);
            }
            var sVal_ = String(fvalue_);
            var sGroupSeparator_ = locale.decimalGroupSeparator;
            var sSeparator_ = locale.decimalSeparator;
            var iGroupDigits_ = locale.decimalGroupDigits;
            sVal_ = sVal_.replace(".", sSeparator_);
            var tsVal_ = sVal_.split(sSeparator_);
            var sEnt_ = tsVal_[0];
            var sDec_ = tsVal_[1] || '';
            if (sEnt_.length > iGroupDigits_) {
                var iNbPart_ = Math.round(sEnt_.length / iGroupDigits_);
                if (iNbPart_ < sEnt_.length / iGroupDigits_)
                    iNbPart_++;
                var tsPart_ = [];
                for (var i_ = 0; i_ < iNbPart_; i_++) {
                    tsPart_[iNbPart_ - i_ - 1] = String(sEnt_).substring(sEnt_.length - iGroupDigits_ * (i_ + 1), sEnt_.length - iGroupDigits_ * i_);
                }
                sEnt_ = tsPart_.join(sGroupSeparator_);
            }
            if (isset(digits)) {
                sDec_ = sDec_.rPad('0', digits);
            }
            return sign + (sDec_.length != 0 ? sEnt_.concat(sSeparator_).concat(sDec_) : sEnt_);
        }
        return str;
    }
    utils.formatDecimal = formatDecimal;
    function genId(l) {
        if (l === void 0) { l = 10; }
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random(l);
    }
    utils.genId = genId;
})(utils || (utils = {}));
var regexp;
(function (regexp) {
    regexp.CdPost = /^(([0-8][1-9]|9[0-5]|[1-9]0)[0-9]{3})|(97[1-6][0-9]{2})$/;
    regexp.Email = /^[a-zA-Z0-9!#$%&*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    regexp.AlphaNumerique = /^[a-z0-9 ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-_']*$/i;
    regexp.Alpha = /^[a-z ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-_']*$/i;
    regexp.Adresse = /^[a-z0-9 ÀÂÉÈÊËÏÎÔÖÛÙÜÇ\-',/]*$/i;
    regexp.Mots = /([A-ZÀÂÉÈÊËÏÎÔÖÛÙÜÇ])+/ig;
    regexp.Integer = /^(\-)?\d+$/;
    regexp.PositiveInteger = /^[0-9]+[0-9]*$/;
    regexp.Double = /^(\-)?((\d+(\.\d+)?))([eE]{1}([\-\+]{1})?(\d+))?$/;
    regexp.PositiveDouble = /^((\d+(\.\d+)?))([eE]{1}([\-\+]{1})?(\d+))?$/;
    regexp.NumTel = /^(0033|0|\+33)([1-7]|[9])[0-9]{8}$/;
    regexp.NumTelEtendu = /^(\(0033\)|\(\+33\)|0|0033|\+33)([ .-]?[1-7]|[9])([ .-]?[0-9]{2}){4}$/;
    regexp.NumTelPermissif = /^([0-9 \(\)\+\.]{0,17})$/; // Numéro de téléphone valide selon INTERNAUTE (17car max) : Seuls les caractères numériques, l'espace, les parenthèses, le + et le . doivent composer le numéro. 
    regexp.NumTelReduit = /^(0)([0-9]{9})$/; //10 caractères numériques ( commençant par 0 )
    regexp.NumDossier = /^[0-9]{5}_[A-Z0-9]{10,}$/; // Numéro de dossier valide et extensible à droite du '_'
})(regexp || (regexp = {}));
/// <reference path="./definitions/httpstatus.d.ts"/>
/// <reference path="./utils.ts"/>
/// <reference path="./knockout.ext.ts"/>
/// <reference path="./namespaces/utils.ts"/>
/// <reference path="./namespaces/regexp.ts"/>
/// <reference path="./core.ts"/>
/// <reference path="./core/index.ts"/>
define("modules/classes/AbstractBinding.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AbstractBinding = /** @class */ (function () {
        function AbstractBinding(name) {
            this.options = {};
            this._name = name;
        }
        AbstractBinding.prototype.getName = function () {
            return this._name;
        };
        return AbstractBinding;
    }());
    exports.AbstractBinding = AbstractBinding;
});
define("modules/bindings/accordion", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_1) {
    "use strict";
    exports.__esModule = true;
    var AccordionBinding = /** @class */ (function (_super) {
        __extends(AccordionBinding, _super);
        function AccordionBinding() {
            return _super.call(this, 'accordion') || this;
        }
        AccordionBinding.prototype.init = function (element, valueAccessor) {
            // handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).accordion("destroy");
            });
        };
        AccordionBinding.prototype.update = function (element, valueAccessor) {
            var options = valueAccessor() || {};
            var $element = $(element);
            if (options.openState) {
                var state_1 = options.openState;
                delete (options.openState);
                options.beforeActivate = function (event, ui) {
                    state_1(ui.newPanel && ui.newPanel.length > 0 ? "opening" : "closing");
                };
                options.activate = function (event, ui) {
                    state_1(ui.newPanel && ui.newPanel.length > 0 ? "opened" : "closed");
                };
                state_1.subscribe(function (b) {
                    if (b === true || b === false) {
                        $element.accordion("option", "active", b ? 0 : false);
                    }
                });
            }
            $element.accordion(options).accordion("option", "icons", {
                "header": "ui-icon-expand",
                "activeHeader": "ui-icon-collapse"
            });
        };
        return AccordionBinding;
    }(AbstractBinding_class_1.AbstractBinding));
    exports.AccordionBinding = AccordionBinding;
});
define("modules/bindings/animate", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_2) {
    "use strict";
    exports.__esModule = true;
    function css_time_to_milliseconds(time_string) {
        var num = CFloat(time_string);
        var unit = (time_string + "").match(/m?s/);
        var milliseconds;
        if (unit) {
            unit = unit[0];
        }
        switch (unit) {
            case "s": // seconds
                milliseconds = num * 1000;
                break;
            case "ms": // milliseconds
                milliseconds = num;
                break;
            default:
                milliseconds = num;
                break;
        }
        return milliseconds;
    }
    var AnimateBinding = /** @class */ (function (_super) {
        __extends(AnimateBinding, _super);
        function AnimateBinding() {
            return _super.call(this, 'animate') || this;
        }
        AnimateBinding.prototype.init = function (element, valueAccessor) {
            var $this = $(element);
        };
        AnimateBinding.prototype.update = function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            if (!value)
                return;
            var $this = $(element);
            $this.addClass('animated');
            if (typeof (value) == "string") {
                value = { 'animation': value };
            }
            var animationValue = isset(value.animation) ? ko.unwrap(value.animation) : null;
            if (animationValue) {
                $this.data('animation', animationValue);
            }
            var delay = value.delay ? ko.unwrap(value.delay) : null;
            if (delay) {
                $this.data('delay', delay);
            }
            var duration = isset(value.duration) ? ko.unwrap(value.duration) : null;
            if (duration) {
                $this.data('duration', duration);
            }
            var currentAnimation = $this.data('current-animation');
            var currentAnimationId = $this.data('current-animationId');
            if (currentAnimationId) {
                clearTimeout(currentAnimationId);
            }
            if (currentAnimation) {
                $this.removeClass(currentAnimation).removeClass('animate-start-' + currentAnimation).removeClass('animate-end-' + currentAnimation);
            }
            // Set first animation start class
            var dataAnimation = $this.data('animation') || 'fadeIn';
            var animations = dataAnimation.split(',');
            var animation = animations.shift();
            $this.addClass('animate-start-' + animation);
            var fnAppear = function () {
                var $element = $(this);
                var dataAnimation = $element.data('animation') || 'fadeIn';
                var animations = dataAnimation.split(',');
                var dataDelay = $element.data('delay') || 0;
                var dataDuration = $element.data('duration') || '.3s';
                //  set animation duration value
                $element.css('-webkit-animation-duration', dataDuration);
                $element.css('animation-duration', dataDuration);
                $element.data('current-animationId', setTimeout(function () {
                    var fn = function (animations, duration) {
                        if (animations.length == 0)
                            return;
                        var currentAnimation = $element.data('current-animation');
                        if (currentAnimation) {
                            $element.removeClass(currentAnimation);
                            $element.removeClass('animate-end-' + currentAnimation);
                        }
                        var animation = animations.shift();
                        $element.removeClass('animate-start-' + animation);
                        $element.data('current-animation', animation).addClass(animation);
                        if (animations.length > 0) {
                            // Set next animation start class
                            $element.addClass('animate-start-' + animations[0]);
                        }
                        $element.data('current-animationId', setTimeout(function () { $element.addClass('animate-end-' + animation); fn(animations, duration); }, duration));
                    };
                    fn(animations, css_time_to_milliseconds(dataDuration));
                }, css_time_to_milliseconds(dataDelay)));
            };
            var whenAppear = isset(value.whenAppear) ? ko.unwrap(value.whenAppear) : true;
            whenAppear = whenAppear && isset($this.appear);
            if (whenAppear) {
                $this.appear(fnAppear);
            }
            else {
                fnAppear.call(element);
            }
        };
        return AnimateBinding;
    }(AbstractBinding_class_2.AbstractBinding));
    exports.AnimateBinding = AnimateBinding;
});
define("modules/bindings/autocomplete", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_3) {
    "use strict";
    exports.__esModule = true;
    var AutoCompleteBinding = /** @class */ (function (_super) {
        __extends(AutoCompleteBinding, _super);
        function AutoCompleteBinding() {
            return _super.call(this, 'autocomplete') || this;
        }
        AutoCompleteBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element);
            var value = allBindingsAccessor().value;
            $element.autocomplete(valueAccessor());
            if (value) {
                $element.autocomplete("option", "select", function (event, ui) {
                    value(ui.item.value);
                    return false;
                });
            }
            $element.focus(function () {
                $element.autocomplete("search");
            });
        };
        AutoCompleteBinding.prototype.update = function (element, valueAccessor) {
            var $element = $(element);
            var src = valueAccessor();
            $element.autocomplete("option", "source", src);
        };
        return AutoCompleteBinding;
    }(AbstractBinding_class_3.AbstractBinding));
    exports.AutoCompleteBinding = AutoCompleteBinding;
});
define("modules/helpers/query", ["require", "exports", "modules/helpers/logger"], function (require, exports, logger_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * @private
     */
    var _timer = null;
    var _hInstances = {};
    var _hInstanceCounter = 0;
    var _currentStackRequests = {};
    var _requestCount = 0;
    var Query = /** @class */ (function () {
        function Query(id, opts) {
            /**
            * GETasJson
            * @method GETasJson
            * @param {string} url
            * @param {function} callbacks
            * @param {object} context
            * @param {object} opts
            * @returns {object} jQuery handler
            * @memberOf oneesp.module.commons.helper.query.Helper
            */
            this.GETasJson = function (url, callbacks, context, opts) {
                return Query.GETasJson(url, callbacks, context, this.mergeOptions(opts));
            };
            this.id = id;
            this.opts = opts;
        }
        Query.log = function () {
            return logger_1.Logger.getLogger('Query');
        };
        /** Return the current stack of requests
         * @memberOf oneesp.module.commons.helper.query#
         * @returns {array}
         */
        Query.getCurrentStackRequests = function () {
            return _currentStackRequests;
        };
        /**
         * Send a PUT request
         * @method PUT
         * @param {string} url
         * @param {string} data
         * @param {function} callbacks
         * @param {object} context
         * @param {IQueryOptions} opts
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query.Helper
         */
        Query.prototype.PUT = function (url, data, callbacks, context, opts) {
            return Query.PUT(url, data, callbacks, context, this.mergeOptions(opts));
        };
        /**
        * GET
        * @method GET
        * @param {string} url
        * @param {function} callbacks
        * @param {object} context
        * @param {object} opts
        * @returns {object} jQuery handler
        * @memberOf oneesp.module.commons.helper.query.Helper
        */
        Query.prototype.GET = function (url, callbacks, context, opts) {
            return Query.GET(url, callbacks, context, this.mergeOptions(opts));
        };
        /**
        * POST
        * @method POST
        * @param {string} url
        * @param {string} data
        * @param {function} callbacks
        * @param {object} context
        * @param {object} opts
        * @returns {object} jQuery handler
        * @memberOf oneesp.module.commons.helper.query.Helper
        */
        Query.prototype.POST = function (url, data, callbacks, context, opts) {
            return Query.POST(url, data, callbacks, context, this.mergeOptions(opts));
        };
        /**
        * DELETE
        * @method DELETE
        * @param {string} url
        * @param {function} callbacks
        * @param {object} context
        * @param {object} opts
        * @returns {object} jQuery handler
        * @memberOf oneesp.module.commons.helper.query.Helper
        */
        Query.prototype.DELETE = function (url, callbacks, context, opts) {
            return Query.DELETE(url, callbacks, context, this.mergeOptions(opts));
        };
        Query.prototype.mergeOptions = function (opts) {
            var tmp = $.extend({}, this.opts);
            return $.extend(tmp, opts || {});
        };
        Query.create = function (id, opts) {
            if (typeof (id) == 'object' && opts == undefined) {
                opts = id;
                id = 'helper' + ++_hInstanceCounter;
            }
            if (opts == undefined) {
                return _hInstances[id];
            }
            else {
                _hInstances[id] = new Query(id, opts);
                return _hInstances[id];
            }
        };
        /**
         * Send a query request from HTML form
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         */
        Query.queryFormData = function (form, callbacks, context, opts) {
            if (callbacks === void 0) { callbacks = {}; }
            if (opts === void 0) { opts = {}; }
            opts = opts || {};
            opts.contentType = false;
            return Query.query(form.method || 'POST', form.action, new FormData(form), callbacks, context, opts);
        };
        /** Send a query request
         * @param {Methods} method - The http method
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         */
        Query.query = function (method, url, data, callbacks, context, opts) {
            if (callbacks === void 0) { callbacks = {}; }
            if (opts === void 0) { opts = {}; }
            if (Query.isLocked()) {
                if (Query.log().isWarnEnabled()) {
                    Query.log().warn("Query is locked: request '%s %s' has not been sent".format(method, url));
                }
                return;
            }
            method = (method || 'GET').toUpperCase();
            var options = {
                silent: false,
                async: true,
                delay: Query.DEFAULT_DELAY,
                contentType: 'application/json; charset=utf-8'
            };
            options = $.extend(options, Query.defaultOptions);
            opts = $.extend(options, opts);
            if (!opts.silent) {
                if (Query.nbQueries() == 0) {
                    _timer = setTimeout(function () {
                        if (Query.nbQueries() > 0) {
                            if (Query.log().isTraceEnabled()) {
                                Query.log().trace('Inform that Query processes are busy (delay: %s)'.format(opts.delay));
                            }
                            Query.isBusy(true);
                        }
                    }, opts.delay);
                }
                var nb = Query.nbQueries() + 1;
                Query.nbQueries(nb);
                if (Query.log().isTraceEnabled()) {
                    Query.log().trace('Current query processes is now'.format(nb));
                }
            }
            if (typeof (callbacks) == 'function') {
                callbacks = {
                    complete: callbacks
                };
            }
            callbacks = $.extend({
                success: function () { },
                fail: function () { },
                complete: function () { }
            }, callbacks);
            data = data || {};
            //@obsolete Use cache option instead
            data._timestamp = opts.upToDate ? "" + new Date().getTime() : undefined;
            if (opts.domain) {
                if (url.indexOf('?') <= 0) {
                    url = url + "?";
                }
                else {
                    url = url + "&";
                }
                url = url + "_domain=" + opts.domain;
            }
            _requestCount++;
            var currentRequest = {
                ID: _requestCount,
                method: method,
                url: url,
                data: data,
                callbacks: callbacks,
                context: context,
                options: opts,
                startedAt: new Date().getTime()
            };
            _currentStackRequests[currentRequest.ID] = currentRequest;
            var processData = true;
            if (method == Query.Methods.POST || method == Query.Methods.PUT || method == Query.Methods.PATCH) {
                if ((opts.contentType || '').toLowerCase().contains('application/json')) {
                    if (typeof (data) != "string") {
                        data = (data && data != {}) ? JSON.stringify(data) : null;
                    }
                }
                processData = false;
            }
            var params = {
                type: method,
                url: url,
                data: data,
                processData: processData,
                async: opts.async,
                dataType: opts.dataType,
                contentType: opts.contentType,
                context: currentRequest,
                headers: opts.headers,
                cache: null,
                timeout: null
            };
            if (opts.cache != undefined && opts.cache != null) {
                params.cache = opts.cache;
            }
            if (opts.timeout != undefined && !isNaN(opts.timeout)) {
                params.timeout = opts.timeout;
            }
            if (Query.log().isTraceEnabled()) {
                Query.log().trace("Send request '%s %s'".format(method, url), params);
            }
            var jqXHR = $.ajax(params);
            jqXHR.always(function (data, textStatus, jqXHR) {
                delete _currentStackRequests[this.ID];
                if (!this.options.silent) {
                    var nb = Query.nbQueries() - 1;
                    Query.nbQueries(nb);
                    if (Query.log().isTraceEnabled()) {
                        Query.log().trace('Current query processes is now %s'.format(nb));
                    }
                    if (Query.nbQueries() == 0) {
                        clearTimeout(_timer);
                        _timer = null;
                        Query.isBusy(false);
                        if (Query.log().isTraceEnabled()) {
                            Query.log().trace('Query processes are no longer busy');
                        }
                    }
                }
                if (textStatus == Query.Status.NOCONTENT) {
                    textStatus = Query.Status.SUCCESS;
                }
                if (textStatus == Query.Status.ERROR) {
                    if ($.inArray(data.status, [0, 12029, 12007]) != -1) {
                        Query.isDisconnected(true);
                    }
                }
                if (textStatus == Query.Status.SUCCESS && Query.isDisconnected()) {
                    Query.isDisconnected(false);
                }
                if (textStatus == Query.Status.SUCCESS) {
                    if (typeof (this.callbacks.success) == "function") {
                        this.callbacks.success.call(this.context, data, textStatus, jqXHR);
                    }
                }
                else {
                    if (typeof (this.callbacks.fail) == "function") {
                        this.callbacks.fail.call(this.context, data, textStatus, jqXHR);
                    }
                }
                if (typeof (this.callbacks.complete) == "function") {
                    this.callbacks.complete.call(this.context, data, textStatus, jqXHR);
                }
            });
            return jqXHR;
        };
        /** Send a PUT request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.PUT = function (url, data, callbacks, context, opts) {
            return Query.query(Query.Methods.PUT, url, data, callbacks, context, opts);
        };
        /** Send a PATCH request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.PATCH = function (url, data, callbacks, context, opts) {
            return Query.query(Query.Methods.PATCH, url, data, callbacks, context, opts);
        };
        /** Send a GET request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.GET = function (url, callbacks, context, opts) {
            return Query.query(Query.Methods.GET, url, null, callbacks, context, opts);
        };
        /** Send a GET request and get a json object as result
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.GETasJson = function (url, callbacks, context, opts) {
            opts = opts || {};
            opts.dataType = 'json';
            return Query.GET(url, callbacks, context, opts);
        };
        /** Send a POST request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.POST = function (url, data, callbacks, context, opts) {
            return Query.query(Query.Methods.POST, url, data, callbacks, context, opts);
        };
        /** Send a DELETE request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.DELETE = function (url, callbacks, context, opts) {
            return Query.query(Query.Methods.DELETE, url, null, callbacks, context, opts);
        };
        Query.defaultOptions = {
            headers: {}
        };
        Query.DEFAULT_DELAY = 500;
        /** The number of current queries processed
         * @name nbQueries
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.nbQueries = ko.observable(0);
        /** Return if a query is running
         * @name isBusy
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.isBusy = ko.observable(false);
        /** Return if the socket is disconnected
         * @name isDisconnected
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.isDisconnected = ko.observable(false);
        /** Return if the module is locked. When it is locked, no query will be sent.
         * @name isLocked
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         * @example _queryHelper.isLocked(true); //Do lock
         * @example _queryHelper.isLocked(true); //Unlock
         */
        Query.isLocked = ko.observable(false);
        /** The status codes
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.Status = {
            SUCCESS: 'success',
            ERROR: 'error',
            ABORT: 'abort',
            NOCONTENT: 'nocontent',
            TIMEOUT: 'timeout'
        };
        /** The methods
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.Methods = {
            PUT: 'PUT',
            PATCH: 'PATCH',
            GET: 'GET',
            POST: 'POST',
            DELETE: 'DELETE'
        };
        /** The states
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        Query.States = {
            REJECTED: 'rejected'
        };
        return Query;
    }());
    exports.Query = Query;
});
define("modules/helpers/logger", ["require", "exports", "modules/helpers/query"], function (require, exports, query_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * MODES
     * @enum {int}
     * @memberOf oneesp.module.commons.helper.errors#
     */
    var TLogLevel;
    (function (TLogLevel) {
        TLogLevel[TLogLevel["TRACE"] = 0] = "TRACE";
        TLogLevel[TLogLevel["DEBUG"] = 1] = "DEBUG";
        TLogLevel[TLogLevel["INFO"] = 2] = "INFO";
        TLogLevel[TLogLevel["WARN"] = 3] = "WARN";
        TLogLevel[TLogLevel["ERROR"] = 4] = "ERROR";
        TLogLevel[TLogLevel["FATAL"] = 5] = "FATAL";
    })(TLogLevel = exports.TLogLevel || (exports.TLogLevel = {}));
    var Appender = /** @class */ (function () {
        function Appender(level) {
            if (level === void 0) { level = TLogLevel.TRACE; }
            this.level = level;
        }
        return Appender;
    }());
    exports.Appender = Appender;
    var ConsoleAppender = /** @class */ (function (_super) {
        __extends(ConsoleAppender, _super);
        function ConsoleAppender() {
            return _super.call(this) || this;
        }
        ConsoleAppender.prototype.formatMessage = function (level, date, message) {
            return TLogLevel[level].rPad(' ', 5) + ' - ' + utils.formatDate(date, "dd/mm/yyyy", "hh:mm:ss.t") + ': ' + message;
        };
        ConsoleAppender.prototype.log = function (className, level, message, exception, date) {
            if (date === void 0) { date = new Date(); }
            if (this.level > level) {
                return;
            }
            var e = exception || '';
            var console = isset(window.console) ? window.console : null;
            if (isset(console)) {
                var fn = void 0;
                if (level == TLogLevel.DEBUG && typeof (console.debug) != 'undefined') {
                    fn = console.debug;
                }
                if (level == TLogLevel.INFO && typeof (console.info) != 'undefined') {
                    fn = console.info;
                }
                if (level == TLogLevel.WARN && typeof (console.warn) != 'undefined') {
                    fn = console.warn;
                }
                if (level == TLogLevel.ERROR && typeof (console.error) != 'undefined') {
                    fn = console.error;
                }
                if (level == TLogLevel.FATAL && typeof (console.error) != 'undefined') {
                    fn = console.error;
                }
                if (!fn && typeof (console.log) != 'undefined') {
                    fn = console.log;
                }
                if (!fn) {
                    return;
                }
                var text = this.formatMessage(level, date, message);
                if (ConsoleAppender.useFormat) {
                    fn("%c" + className, ConsoleAppender.formatCSS, text, e);
                }
                else {
                    fn(className, text, e);
                }
            }
        };
        ConsoleAppender.useFormat = true;
        ConsoleAppender.formatCSS = "padding: .1em .5em; color: #000; border: 1px solid #ddd; background-color: #93e458; border-radius: 3px";
        return ConsoleAppender;
    }(Appender));
    exports.ConsoleAppender = ConsoleAppender;
    var RemoteAppender = /** @class */ (function (_super) {
        __extends(RemoteAppender, _super);
        function RemoteAppender(url) {
            var _this = _super.call(this) || this;
            _this.url = url;
            return _this;
        }
        RemoteAppender.prototype.formatMessage = function (className, date, level, message) {
            return TLogLevel[level] + ' - ' + className + ' - ' + date.toString() + ': ' + message;
        };
        RemoteAppender.prototype.log = function (className, level, message, exception, date) {
            if (date === void 0) { date = new Date(); }
            if (this.level <= level) {
                var e = exception || '';
                var text = this.formatMessage(className, date, level, message);
                query_1.Query.PUT(this.url, { date: date.getUTCTime(), className: className, level: level, message: text, originalMessage: message, exception: e }, null, this, { silent: true });
            }
        };
        return RemoteAppender;
    }(Appender));
    exports.RemoteAppender = RemoteAppender;
    var Logger = /** @class */ (function () {
        function Logger(id, level) {
            if (level === void 0) { level = TLogLevel.INFO; }
            this.appenders = [];
            /**
             * The current mode
             * @name mode
             * @type observable
             * @defaultValue Modes.DEVELOPMENT
             * @memberOf oneesp.module.commons.helper.errors#
             */
            this.level = ko.observable(TLogLevel.INFO);
            this.id = null;
            this.level(level);
            this.id = id;
        }
        Logger.prototype.isTraceEnabled = function () {
            return this.level() >= TLogLevel.TRACE;
        };
        Logger.prototype.isInfoEnabled = function () {
            return this.level() >= TLogLevel.INFO;
        };
        Logger.prototype.isDebugEnabled = function () {
            return this.level() >= TLogLevel.DEBUG;
        };
        Logger.prototype.isWarnEnabled = function () {
            return this.level() >= TLogLevel.WARN;
        };
        Logger.prototype.info = function (text, e) {
            this.log(this.id, TLogLevel.INFO, text, e);
        };
        Logger.prototype.warn = function (text, e) {
            this.log(this.id, TLogLevel.WARN, text, e);
        };
        Logger.prototype.trace = function (text, e) {
            this.log(this.id, TLogLevel.TRACE, text, e);
        };
        Logger.prototype.debug = function (text, e) {
            this.log(this.id, TLogLevel.DEBUG, text, e);
        };
        Logger.prototype.error = function (text, e) {
            this.log(this.id, TLogLevel.ERROR, text, e);
        };
        Logger.prototype.fatal = function (text, e) {
            this.log(this.id, TLogLevel.FATAL, text, e);
        };
        Logger.prototype.log = function (className, level, message, exception, date) {
            if (date === void 0) { date = new Date(); }
            if ((this.level() <= level) && this.appenders) {
                for (var i = 0, len = this.appenders.length; i < len; i++) {
                    if (this.appenders[i].level <= level) {
                        this.appenders[i].log(className, level, message, exception, date);
                    }
                }
            }
        };
        Logger.prototype.addAppender = function (appender) {
            this.appenders.pushOnce(appender);
        };
        /** return logger
         * @param {string} className
         */
        Logger.getLogger = function (className) {
            if (!Logger.loggers[className]) {
                var log = new Logger(className);
                if (className != 'default') {
                    log.log = function (className, level, text, e) {
                        var logger = Logger.getDefaultLogger();
                        if (logger) {
                            logger.log(className, level, text, e);
                        }
                    };
                }
                Logger.loggers[className] = log;
            }
            return Logger.loggers[className];
        };
        Logger.getDefaultLogger = function () {
            return Logger.getLogger('default');
        };
        Logger.getConsoleAppender = function () {
            return new ConsoleAppender();
        };
        Logger.loggers = {};
        return Logger;
    }());
    exports.Logger = Logger;
});
define("modules/helpers/storage", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var checkLocalStorage = function () {
        if (window.localStorage) {
            return true;
        }
        if (console && console.warn) {
            console.warn('LocaleStorage is not defined. Update your browser to fix this issue');
        }
        return false;
    };
    var Storage = /** @class */ (function () {
        function Storage() {
        }
        Storage.put = function (name, value, opts) {
            if (!checkLocalStorage()) {
                return false;
            }
            if (value == null) {
                Storage.remove(name);
                return false;
            }
            opts = $.extend({}, opts);
            if (opts.crypt) {
                value = $().crypt({
                    method: 'b64enc',
                    source: value
                });
            }
            localStorage[name] = String(value);
            return true;
        };
        Storage.putObject = function (name, json, opts) {
            return Storage.put(name, JSON.stringify(Object.toJson(json)), opts);
        };
        Storage.read = function (name, opts) {
            if (!checkLocalStorage()) {
                return;
            }
            opts = $.extend({}, opts);
            var value = localStorage[name];
            if (value && opts.crypt) {
                value = $().crypt({
                    method: 'b64dec',
                    source: value
                });
            }
            return value;
        };
        Storage.remove = function (name) {
            if (!checkLocalStorage()) {
                return false;
            }
            if ($.isArray(name)) {
                $.each(name, function (index, id) {
                    localStorage.removeItem(id);
                });
            }
            else {
                localStorage.removeItem(name);
            }
            return true;
        };
        Storage.readAsObject = function (name, opts) {
            var json = Storage.read(name, opts);
            try {
                return JSON.parse(json);
            }
            catch (e) {
                return {};
            }
        };
        Storage.readAsNumber = function (name, opts) {
            var num = Storage.read(name, opts);
            return Number(num);
        };
        return Storage;
    }());
    exports.Storage = Storage;
});
define("modules/classes/EventsBinder.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var EventsBinder = /** @class */ (function () {
        function EventsBinder() {
            this.__event__ = ko.observable();
            this.__subscriptions__ = [];
        }
        EventsBinder.prototype.on = function (eventId, callback, context) {
            var _this = this;
            if (typeof (callback) != 'function') {
                throw "No callback specified or callback is not a valid function : " + callback;
                return;
            }
            if ($.isArray(eventId)) {
                $.each(eventId, function (k, eventId) {
                    _this.on(eventId, callback, context);
                });
                return;
            }
            this.__subscriptions__.push(this.__event__.subscribe(function (event) {
                if (event.id == this.eventId) {
                    this.callback.apply(this.context || this.owner, event.arguments);
                }
            }, { eventId: eventId, callback: callback, context: context, owner: this }));
        };
        EventsBinder.prototype.emit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.__event__({
                id: args[0],
                arguments: args.slice(1)
            });
        };
        EventsBinder.prototype.clearSubscriptions = function () {
            dispose(this.__subscriptions__);
        };
        EventsBinder.prototype.dispose = function () {
            this.clearSubscriptions();
        };
        return EventsBinder;
    }());
    exports.EventsBinder = EventsBinder;
});
define("modules/classes/Manager.class", ["require", "exports", "modules/classes/EventsBinder.class"], function (require, exports, EventsBinder_class_1) {
    "use strict";
    exports.__esModule = true;
    exports.inherits = function (prototype, id, opts) {
        var OverloadClass = function (prototype, id, opts) {
            opts._id = id;
            this.executionContext = opts;
            this.__proto__ = prototype;
        };
        OverloadClass.prototype = prototype;
        return new OverloadClass(prototype, id, opts);
    };
    /**
     * A module.
     */
    var BaseManager = /** @class */ (function (_super) {
        __extends(BaseManager, _super);
        function BaseManager() {
            var _this = _super.call(this) || this;
            _this._domains = {};
            _this._domainCounter = 0;
            /**
            * A value that indicates whether this module is ready.
            * @type {ko.observable(boolean)}
            */
            _this.isReady = ko.observable(false);
            _this.isReady.subscribeOnce(function (b) {
                if (b) {
                    _this.emit('ready');
                }
            }, _this);
            return _this;
        }
        BaseManager.prototype.init = function () { };
        /**
         * Executes the given callback when this module is ready.
         * @param callback The function to execute when this module is ready.
         * @param context The context for the given callback.
         */
        BaseManager.prototype.ready = function (callback, context) {
            if (!callback)
                return;
            this.on('ready', callback, context);
            if (this.isReady()) {
                callback.call(context || this);
                return true;
            }
            return false;
        };
        return BaseManager;
    }(EventsBinder_class_1.EventsBinder));
    exports.BaseManager = BaseManager;
});
define("modules/classes/Locale.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Locale = /** @class */ (function () {
        function Locale(language, isoCode) {
            this._language = language;
            this._isoCode = isoCode;
        }
        Locale.prototype.getLang = function () {
            return this._language;
        };
        Locale.prototype.getIsoCode = function () {
            return this._isoCode;
        };
        Locale.autoLoadClass = true;
        Locale.autoloadedLocales = [];
        return Locale;
    }());
    exports.Locale = Locale;
});
define("modules/classes/locale/en", ["require", "exports", "modules/classes/Locale.class"], function (require, exports, Locale_class_1) {
    "use strict";
    exports.__esModule = true;
    var Locale_en = /** @class */ (function (_super) {
        __extends(Locale_en, _super);
        function Locale_en() {
            var _this = _super.call(this, 'en', 'en_US') || this;
            _this.displayName = "English";
            _this.decimalSeparator = ".";
            _this.decimalGroupSeparator = ",";
            _this.decimalGroupDigits = 3;
            _this.dateFormat = "yyyy-mm-dd";
            _this.dateSeparator = "-";
            _this.dateLiteralFormat = "YMD";
            _this.currencySymbol = "€";
            return _this;
        }
        return Locale_en;
    }(Locale_class_1.Locale));
    exports.Locale_en = Locale_en;
});
define("modules/managers/i18n", ["require", "exports", "modules/helpers/logger", "modules/helpers/query", "modules/classes/Manager.class", "modules/classes/Locale.class", "modules/classes/locale/en"], function (require, exports, logger_2, query_2, Manager_class_1, Locale_class_2, en_1) {
    "use strict";
    exports.__esModule = true;
    exports.SUPPORTED_LANGUAGES = {};
    var logger = logger_2.Logger.getLogger('i18n');
    var I18n = /** @class */ (function (_super) {
        __extends(I18n, _super);
        function I18n(defaultLanguage) {
            if (defaultLanguage === void 0) { defaultLanguage = "en"; }
            var _this = _super.call(this) || this;
            _this.uri = "/i18n/";
            _this.useRemoteUrl = false;
            _this.isStringsReady = ko.observable(false);
            _this.localizedStrings = {};
            _this.localizedObservableStrings = {};
            _this.locales = {};
            /**
             * The current resources language.
             * @type {ko.observable(string)}
             */
            _this.language = ko.observable();
            exports.DEFAULT_LANGUAGE = defaultLanguage;
            window['i18n'] = _this;
            return _this;
        }
        I18n.prototype.initLocales = function () {
            var _this = this;
            // Default locale
            this.addLocale(new en_1.Locale_en());
            // Load from autoloaded locales instances
            $.each(Locale_class_2.Locale.autoloadedLocales, function (i, locale) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Add locale from autoloader", locale);
                }
                _this.addLocale(locale);
            });
            // Load from configuration locales global var
            $.each(window['locales_def'] || {}, function (id, localeConf) {
                var locale = new Locale_class_2.Locale(id, localeConf.isoCode);
                locale.displayName = localeConf.localeName;
                locale.decimalGroupSeparator = localeConf.format.decimal.groupSeparator;
                locale.decimalGroupDigits = localeConf.format.decimal.groupDigits;
                locale.decimalSeparator = localeConf.format.decimal.separator;
                locale.currencySymbol = localeConf.format.currency.symbol;
                locale.dateFormat = localeConf.format.date.format;
                locale.dateSeparator = localeConf.format.date.separator;
                locale.dateLiteralFormat = localeConf.format.date.literalFormat;
                if (logger.isDebugEnabled()) {
                    logger.debug("Add locale from global configuration", locale);
                }
                _this.addLocale(locale);
            });
        };
        I18n.prototype.initLanguage = function (defaultLanguage) {
            var locale;
            if (defaultLanguage) {
                locale = this.getLocaleByLang(defaultLanguage);
            }
            if (!locale) {
                locale = this.getLocaleByLang(this.getBrowserLanguage());
            }
            if (locale) {
                this.language(locale.getLang());
                return;
            }
            logger.error("Error loading language '%s'".format(defaultLanguage));
            this.emit('initError', defaultLanguage);
        };
        I18n.prototype.getCurrentLocale = function () {
            return this.getLocale(this.language());
        };
        I18n.prototype.getLocale = function (isoCode) {
            return this.locales[isoCode];
        };
        I18n.prototype.getLocaleByLang = function (lang) {
            return Object.findBy(this.locales, 'getLang', lang);
        };
        I18n.prototype.getSupportedLanguages = function () {
            return exports.SUPPORTED_LANGUAGES;
        };
        I18n.prototype.addLocale = function (locale) {
            exports.SUPPORTED_LANGUAGES[locale.getIsoCode()] = locale.getLang();
            this.locales[locale.getIsoCode()] = locale;
        };
        I18n.prototype.loadJsonStrings = function (json) {
            var _this = this;
            // Update the cache for each
            $.each(json, function (k, v) {
                _this.localizedStrings[k] = v;
            });
            // Update the observables strings
            this.updateObservableStrings();
            this.isStringsReady(true);
        };
        I18n.prototype.loadLanguageAsJson = function (lang, json) {
            this.loadJsonStrings(json);
            // Update the current resources language
            this.language(lang);
        };
        I18n.prototype.loadLanguage = function (lang) {
            var _this = this;
            // Load i18n from js global var i18n
            var globalI18n = window['i18n_def'];
            if (globalI18n && globalI18n[lang]) {
                this.loadLanguageAsJson(lang, globalI18n[lang]);
                return;
            }
            if (this.useRemoteUrl) {
                // Get the url
                var url_1 = this.getRemoteUrl(lang);
                // Load the strings
                query_2.Query.GETasJson(url_1, function (json, status) {
                    if (lang != _this.language()) {
                        // The user changed the language between the request and the response
                        return;
                    }
                    if (status == query_2.Query.Status.SUCCESS) {
                        // Update the current language
                        _this.loadLanguageAsJson(lang, json);
                    }
                    else {
                        logger.fatal('Erreur lors du chargement des libellés %s: %s'.format(url_1, status));
                        _this.emit('initError', lang);
                        throw 'Erreur lors du chargement des libellés %s: %s'.format(url_1, status);
                    }
                }, null, { upToDate: false });
                return;
            }
            logger.warn('No internationalized message found (lang: %s)'.format(lang));
        };
        I18n.prototype.updateObservableStrings = function () {
            var _this = this;
            $.each(this.localizedStrings, function (k, v) {
                var observableString = _this.getObservableString(k);
                observableString(v);
            });
        };
        I18n.prototype.getObservableString = function (key, defaultValue) {
            // Get the observable string with the given id
            var observableString = this.localizedObservableStrings[key];
            if (!observableString) {
                if (isset(defaultValue)) {
                    observableString = this.localizedObservableStrings[defaultValue];
                    if (!observableString) {
                        observableString = ko.observable(defaultValue);
                    }
                }
                else {
                    // Create a new observable string with the localized string
                    observableString = this.localizedObservableStrings[key] = ko.observable();
                    observableString(this.getString(key, key));
                }
            }
            return observableString;
        };
        /**
         * Gets the localized string for the given key.
         * @param {string} key The key of the desired label.
         * @return {string} The localized string.
         */
        I18n.prototype.getString = function (key, defaultValue) {
            return I18n.getStringOrKey(this.localizedStrings[key], isset(defaultValue) ? defaultValue : key);
        };
        /**
         * Gets the localized string for the given key.
         * @param {string} key The key of the desired label.
         * @return {string} The localized string.
         * @see getString
         */
        I18n.prototype._ = function (key, defaultValue) {
            return this.getString(key, defaultValue);
        };
        I18n.prototype.getCurrentLanguage = function () {
            var lang = this.language();
            if (exports.SUPPORTED_LANGUAGES[lang]) {
                return lang;
            }
            return null;
        };
        // return the browser language if this language is one of the supported ones
        // else it returns the default language set in the browserLanguageInfos.js file 
        I18n.prototype.getBrowserLanguage = function () {
            return app.browser.getCurrentBrowserInfos().countryCode;
        };
        I18n.getStringOrKey = function (str, key) {
            return (str === null || str === undefined) ? key : str;
        };
        I18n.prototype.getRemoteUrl = function (language) {
            return app.servicesPath + this.uri + app.context.page + "/" + language;
        };
        I18n.prototype.init = function () {
            var _this = this;
            this.initLocales();
            this.language.subscribe(function (lang) {
                _this.loadLanguage(lang);
                _this.emit('change', lang);
            });
            this.isStringsReady.subscribe(function () {
                _this.isReady(true);
            });
            this.initLanguage(exports.DEFAULT_LANGUAGE);
        };
        return I18n;
    }(Manager_class_1.BaseManager));
    exports.I18n = I18n;
});
define("modules/bindings/datepicker", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_4) {
    "use strict";
    exports.__esModule = true;
    var getDateTimePickerOptions = function (i18n) {
        var _strings = {
            // JQuery date and time picker labels
            january: i18n.getObservableString('january'),
            february: i18n.getObservableString('february'),
            march: i18n.getObservableString('march'),
            april: i18n.getObservableString('april'),
            may: i18n.getObservableString('may'),
            june: i18n.getObservableString('june'),
            july: i18n.getObservableString('july'),
            august: i18n.getObservableString('august'),
            september: i18n.getObservableString('september'),
            october: i18n.getObservableString('october'),
            november: i18n.getObservableString('november'),
            december: i18n.getObservableString('december'),
            januaryAbbr: i18n.getObservableString('januaryAbbr'),
            februaryAbbr: i18n.getObservableString('februaryAbbr'),
            marchAbbr: i18n.getObservableString('marchAbbr'),
            aprilAbbr: i18n.getObservableString('aprilAbbr'),
            mayAbbr: i18n.getObservableString('mayAbbr'),
            juneAbbr: i18n.getObservableString('juneAbbr'),
            julyAbbr: i18n.getObservableString('julyAbbr'),
            augustAbbr: i18n.getObservableString('augustAbbr'),
            septemberAbbr: i18n.getObservableString('septemberAbbr'),
            octoberAbbr: i18n.getObservableString('octoberAbbr'),
            novemberAbbr: i18n.getObservableString('novemberAbbr'),
            decemberAbbr: i18n.getObservableString('decemberAbbr'),
            monday: i18n.getObservableString('monday'),
            tuesday: i18n.getObservableString('tuesday'),
            wednesday: i18n.getObservableString('wednesday'),
            thursday: i18n.getObservableString('thursday'),
            friday: i18n.getObservableString('friday'),
            saturday: i18n.getObservableString('saturday'),
            sunday: i18n.getObservableString('sunday'),
            mondayAbbr: i18n.getObservableString('mondayAbbr'),
            tuesdayAbbr: i18n.getObservableString('tuesdayAbbr'),
            wednesdayAbbr: i18n.getObservableString('wednesdayAbbr'),
            thursdayAbbr: i18n.getObservableString('thursdayAbbr'),
            fridayAbbr: i18n.getObservableString('fridayAbbr'),
            saturdayAbbr: i18n.getObservableString('saturdayAbbr'),
            sundayAbbr: i18n.getObservableString('sundayAbbr'),
            firstDayOfTheWeek: i18n.getObservableString('firstDayOfTheWeek'),
            today: i18n.getObservableString('today'),
            previous: i18n.getObservableString('previous'),
            next: i18n.getObservableString('next'),
            close: i18n.getObservableString('close')
        };
        var options = {
            onClose: function () { },
            dateFormat: getDateFormat(i18n),
            onSelect: null,
            closeText: _strings.close(),
            prevText: _strings.previous(),
            changeYear: true,
            showOn: "none",
            nextText: _strings.next(),
            currentText: _strings.today(),
            showButtonPanel: false,
            firstDay: getFirstDayOfTheWeek(_strings),
            monthNames: [
                _strings.january(), _strings.february(), _strings.march(), _strings.april(), _strings.may(), _strings.june(),
                _strings.july(), _strings.august(), _strings.september(), _strings.october(), _strings.november(), _strings.december()
            ],
            monthNamesShort: [
                _strings.januaryAbbr(), _strings.februaryAbbr(), _strings.marchAbbr(), _strings.aprilAbbr(), _strings.mayAbbr(), _strings.juneAbbr(),
                _strings.julyAbbr(), _strings.augustAbbr(), _strings.septemberAbbr(), _strings.octoberAbbr(), _strings.novemberAbbr(), _strings.decemberAbbr()
            ],
            dayNames: [
                _strings.sunday(), _strings.monday(), _strings.tuesday(), _strings.wednesday(), _strings.thursday(), _strings.friday(), _strings.saturday()
            ],
            dayNamesMin: [
                _strings.sundayAbbr(), _strings.mondayAbbr(), _strings.tuesdayAbbr(), _strings.wednesdayAbbr(), _strings.thursdayAbbr(), _strings.fridayAbbr(), _strings.saturdayAbbr()
            ]
            //minDate: new Date(1970, 0, 1)
        };
        return options;
    };
    var getDateFormat = function (i18n) {
        var dateFormat = i18n.getCurrentLocale().dateFormat;
        return dateFormat.replace("yyyy", "yy");
    };
    var getFirstDayOfTheWeek = function (_strings) {
        var firstDayOfTheWeek = _strings.firstDayOfTheWeek();
        switch (firstDayOfTheWeek) {
            case _strings.monday():
                return 1;
            case _strings.tuesday():
                return 2;
            case _strings.wednesday():
                return 3;
            case _strings.thursday():
                return 4;
            case _strings.friday():
                return 5;
            case _strings.saturday():
                return 6;
            default: // i.e. (firstDayOfTheWeek == _strings.sunday())
                return 0;
        }
        return firstDayOfTheWeek;
    };
    var getFirstVisibleInput = function (id) {
        var $elements = $('[id=' + id + ']');
        for (var i = 0; i < $elements.length; i++) {
            var $this = $($elements[i]);
            if ($this.is(':visible')) {
                return $this;
            }
        }
        return $('#' + id);
    };
    var DatePickerBinding = /** @class */ (function (_super) {
        __extends(DatePickerBinding, _super);
        function DatePickerBinding() {
            return _super.call(this, 'datepicker') || this;
        }
        DatePickerBinding.prototype.init = function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor();
            app.manager.ready(['i18n'], function (i18n) {
                var o = $.extend(value.options || {}, getDateTimePickerOptions(i18n));
                o['yearRange'] = (o.minDate ? o.minDate.getFullYear() : "c-100") + ":" + (o.maxDate ? o.maxDate.getFullYear() : "c+100");
                $(element).bind('click.datepicker', function () {
                    getFirstVisibleInput(value.id).datepicker('show');
                });
                defer(function () {
                    getFirstVisibleInput(value.id).datepicker(o);
                });
            });
        };
        DatePickerBinding.prototype.update = function (element, valueAccessor) {
            var value = valueAccessor();
            app.manager.ready(['i18n'], function (i18n) {
                var o = $.extend(value.options || {}, getDateTimePickerOptions(i18n));
                o['yearRange'] = (o.minDate ? o.minDate.getFullYear() : "c-100") + ":" + (o.maxDate ? o.maxDate.getFullYear() : "c+100");
                getFirstVisibleInput(value.id).datepicker('destroy');
                getFirstVisibleInput(value.id).datepicker(o);
            });
        };
        return DatePickerBinding;
    }(AbstractBinding_class_4.AbstractBinding));
    exports.DatePickerBinding = DatePickerBinding;
});
define("modules/bindings/format", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_5) {
    "use strict";
    exports.__esModule = true;
    var format = function (content) {
        var locale = app.i18n.getCurrentLocale();
        var digits = isNaN(content.digit) ? 2 : content.digit;
        if (content.name == "percent") {
            return "%s &#37;".format(utils.formatDecimal(content.value, digits, locale));
        }
        if (content.name == "currency") {
            return "%s %s".format(utils.formatDecimal(content.value, digits, locale), locale.currencySymbol);
        }
        if (content.name == "currencyPerMonth") {
            return "%s %s%s".format(utils.formatDecimal(content.value, digits, locale), locale.currencySymbol, app.i18n.getString('perMonth'));
        }
        if (content.name == "replace") {
            return utils.formatString(content.value, content.data);
        }
        if (content.name == "month") {
            return "%s %s".format(content.value, app.i18n.getString('month'));
        }
        if (content.name == "date") {
            return utils.formatDate(content.value, content.dateFormat || locale.dateFormat);
        }
        if (content.name == "datetime") {
            return utils.formatDate(content.value, content.dateFormat || locale.dateFormat, content.hourFormat || "hh:mm");
        }
    };
    var getValueAccessor = function (content, name) {
        if (typeof (content) == "object") {
            return function () {
                return {
                    value: content.value,
                    digit: content.digit,
                    name: name,
                    data: content.data
                };
            };
        }
        return function () {
            return {
                value: content,
                name: name
            };
        };
    };
    var FormatBinding = /** @class */ (function (_super) {
        __extends(FormatBinding, _super);
        function FormatBinding(name) {
            if (name === void 0) { name = 'format'; }
            return _super.call(this, name) || this;
        }
        FormatBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $this = $(element);
            $this.data("koformat", { value: $this.html() });
        };
        FormatBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            var oldContent = $this.data("koformat");
            if (typeof (content) == "object") {
                content = {
                    value: ko.unwrap(content.value),
                    name: ko.unwrap(content.name),
                    digit: ko.unwrap(content.digit),
                    data: ko.unwrap(content.data || viewModel),
                    dateFormat: ko.unwrap(content.dateFormat),
                    hourFormat: ko.unwrap(content.dateFormat)
                };
            }
            else {
                content = {
                    value: oldContent.value,
                    name: ko.unwrap(content),
                    data: ko.unwrap(viewModel)
                };
            }
            if (content != oldContent) {
                $this.data("koformat", content);
                $this.html(format(content));
            }
        };
        return FormatBinding;
    }(AbstractBinding_class_5.AbstractBinding));
    exports.FormatBinding = FormatBinding;
    var AbstractFormat = /** @class */ (function (_super) {
        __extends(AbstractFormat, _super);
        function AbstractFormat(name, format) {
            var _this = _super.call(this, name) || this;
            _this.format = format;
            return _this;
        }
        AbstractFormat.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            valueAccessor = getValueAccessor(content, this.format);
            _super.prototype.update.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
        };
        return AbstractFormat;
    }(FormatBinding));
    exports.AbstractFormat = AbstractFormat;
    var FormatCurrencyBinding = /** @class */ (function (_super) {
        __extends(FormatCurrencyBinding, _super);
        function FormatCurrencyBinding() {
            return _super.call(this, 'formatCurrency', 'currency') || this;
        }
        return FormatCurrencyBinding;
    }(AbstractFormat));
    exports.FormatCurrencyBinding = FormatCurrencyBinding;
    var FormatCurrencyPerMonthBinding = /** @class */ (function (_super) {
        __extends(FormatCurrencyPerMonthBinding, _super);
        function FormatCurrencyPerMonthBinding() {
            return _super.call(this, 'formatCurrencyPerMonth', 'currencyPerMonth') || this;
        }
        return FormatCurrencyPerMonthBinding;
    }(AbstractFormat));
    exports.FormatCurrencyPerMonthBinding = FormatCurrencyPerMonthBinding;
    var FormatPercentBinding = /** @class */ (function (_super) {
        __extends(FormatPercentBinding, _super);
        function FormatPercentBinding() {
            return _super.call(this, 'formatPercent', 'percent') || this;
        }
        return FormatPercentBinding;
    }(AbstractFormat));
    exports.FormatPercentBinding = FormatPercentBinding;
    var FormatDateBinding = /** @class */ (function (_super) {
        __extends(FormatDateBinding, _super);
        function FormatDateBinding() {
            return _super.call(this, 'formatDate', 'date') || this;
        }
        return FormatDateBinding;
    }(AbstractFormat));
    exports.FormatDateBinding = FormatDateBinding;
    var FormatDateTimeBinding = /** @class */ (function (_super) {
        __extends(FormatDateTimeBinding, _super);
        function FormatDateTimeBinding() {
            return _super.call(this, 'formatDateTime', 'datetime') || this;
        }
        return FormatDateTimeBinding;
    }(AbstractFormat));
    exports.FormatDateTimeBinding = FormatDateTimeBinding;
    var FormatMonthBinding = /** @class */ (function (_super) {
        __extends(FormatMonthBinding, _super);
        function FormatMonthBinding() {
            return _super.call(this, 'formatMonth', 'month') || this;
        }
        return FormatMonthBinding;
    }(AbstractFormat));
    exports.FormatMonthBinding = FormatMonthBinding;
});
define("modules/bindings/i18n", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_6) {
    "use strict";
    exports.__esModule = true;
    var getValueAccessor = function (content, viewModel) {
        if (typeof (content) == "object") {
            if (content.sdata) {
                return function () { return app.i18n.getObservableString(content.prop)().format(content.sdata); };
            }
            return function () { return utils.formatString(app.i18n.getObservableString(content.prop)(), content.data || viewModel); };
        }
        return function () { return utils.formatString(app.i18n.getObservableString(content)(), viewModel); };
    };
    var setTitle = function (element, valueAccessor) {
        var inputType = valueAccessor();
        if (inputType) {
            try {
                $(element).attr('title', inputType);
            }
            catch (e) { }
        }
    };
    var i18nBinding = /** @class */ (function (_super) {
        __extends(i18nBinding, _super);
        function i18nBinding() {
            return _super.call(this, 'i18n') || this;
        }
        i18nBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            valueAccessor = getValueAccessor(content, viewModel);
            ko.bindingHandlers['html'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        };
        i18nBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            valueAccessor = getValueAccessor(content, viewModel);
            ko.bindingHandlers['html'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
        };
        return i18nBinding;
    }(AbstractBinding_class_6.AbstractBinding));
    exports.i18nBinding = i18nBinding;
    var i18nTitleBinding = /** @class */ (function (_super) {
        __extends(i18nTitleBinding, _super);
        function i18nTitleBinding() {
            return _super.call(this, 'i18nTitle') || this;
        }
        i18nTitleBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            valueAccessor = getValueAccessor(content, viewModel);
            setTitle(element, valueAccessor);
        };
        i18nTitleBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            valueAccessor = getValueAccessor(content, viewModel);
            setTitle(element, valueAccessor);
        };
        return i18nTitleBinding;
    }(AbstractBinding_class_6.AbstractBinding));
    exports.i18nTitleBinding = i18nTitleBinding;
});
define("modules/bindings/inputType", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_7) {
    "use strict";
    exports.__esModule = true;
    var setInputType = function (element, valueAccessor) {
        var inputType_ = ko.unwrap(valueAccessor());
        if (inputType_) {
            try {
                $(element).attr('type', inputType_);
            }
            catch (e) { }
        }
    };
    var InputTypeBinding = /** @class */ (function (_super) {
        __extends(InputTypeBinding, _super);
        function InputTypeBinding() {
            return _super.call(this, 'inputType') || this;
        }
        InputTypeBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            setInputType(element, valueAccessor);
        };
        InputTypeBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            setInputType(element, valueAccessor);
        };
        return InputTypeBinding;
    }(AbstractBinding_class_7.AbstractBinding));
    exports.InputTypeBinding = InputTypeBinding;
});
define("modules/bindings/load", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_8) {
    "use strict";
    exports.__esModule = true;
    var LoadBinding = /** @class */ (function (_super) {
        __extends(LoadBinding, _super);
        function LoadBinding() {
            return _super.call(this, 'load') || this;
        }
        LoadBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) { };
        LoadBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var url = valueAccessor();
            var $element = $(element);
            $element.load(url);
        };
        return LoadBinding;
    }(AbstractBinding_class_8.AbstractBinding));
    exports.LoadBinding = LoadBinding;
});
define("modules/bindings/nanoScroll", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_9) {
    "use strict";
    exports.__esModule = true;
    var NanoScrollBinding = /** @class */ (function (_super) {
        __extends(NanoScrollBinding, _super);
        function NanoScrollBinding() {
            return _super.call(this, 'nanoScroll') || this;
        }
        NanoScrollBinding.prototype.init = function (element, valueAccessor) { };
        NanoScrollBinding.prototype.update = function (element, valueAccessor) {
            var nanoClassName = 'nano-field-select';
            var value = ko.unwrap(valueAccessor);
            var $this = $(element);
            var isInitialized = $this.data('nanoScrollInitialized');
            if (value === false) {
                $this.nanoScroller({ destroy: true });
                if (isInitialized === true) {
                    $this.removeClass(nanoClassName);
                    $($this.children()[0]).removeClass('nano-content');
                    $this.unbind('.nanoScrollerBinding');
                }
            }
            else {
                if (!isInitialized) {
                    $this.data('nanoScrollInitialized', true);
                    $this.addClass(nanoClassName);
                    $($this.children()[0]).addClass('nano-content');
                    $this.on('mouseenter.nanoScrollerBinding', function () {
                        var $this = $(this);
                        $this.nanoScroller();
                    });
                }
                $this.nanoScroller();
            }
        };
        return NanoScrollBinding;
    }(AbstractBinding_class_9.AbstractBinding));
    exports.NanoScrollBinding = NanoScrollBinding;
});
define("modules/bindings/post", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_10) {
    "use strict";
    exports.__esModule = true;
    var openWithPostData = function (url, data_get, data_post, target) {
        app.postRedirect(url, data_post, target, data_get);
    };
    var PostBinding = /** @class */ (function (_super) {
        __extends(PostBinding, _super);
        function PostBinding() {
            return _super.call(this, 'post') || this;
        }
        PostBinding.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) { };
        PostBinding.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = valueAccessor();
            if (data) {
                $(element).off('click.kopost');
                $(element).on('click.kopost', function () {
                    openWithPostData(ko.unwrap(data.url), ko.unwrap(data.params), ko.unwrap(data.data), ko.unwrap(data.target));
                });
            }
        };
        return PostBinding;
    }(AbstractBinding_class_10.AbstractBinding));
    exports.PostBinding = PostBinding;
});
define("modules/bindings/readonly", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_11) {
    "use strict";
    exports.__esModule = true;
    var doReadOnly = function (element, valueAccessor) {
        var readonly = ko.utils.unwrapObservable(valueAccessor());
        var $element = $(element);
        if (element.type == "checkbox" || element.tagName == "SELECT" || element.tagName == "BUTTON" || element.tagName == "DIV" || element.tagName == "A") {
            if (readonly) {
                $element.attr('disabled', 'disabled');
            }
            else {
                $element.removeAttr('disabled');
            }
        }
        else {
            if (readonly) {
                $element.attr('readonly', 'readonly');
            }
            else {
                $element.removeAttr('readonly');
            }
        }
        if (readonly) {
            $element.bind('mousedown.readOnlyBinding', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            });
        }
        else {
            $element.unbind('mousedown.readOnlyBinding');
        }
    };
    var ReadOnlyBinding = /** @class */ (function (_super) {
        __extends(ReadOnlyBinding, _super);
        function ReadOnlyBinding() {
            return _super.call(this, 'readonly') || this;
        }
        ReadOnlyBinding.prototype.init = function (element, valueAccessor) {
            doReadOnly(element, valueAccessor);
        };
        ReadOnlyBinding.prototype.update = function (element, valueAccessor) {
            doReadOnly(element, valueAccessor);
        };
        return ReadOnlyBinding;
    }(AbstractBinding_class_11.AbstractBinding));
    exports.ReadOnlyBinding = ReadOnlyBinding;
});
define("modules/bindings/tooltipster", ["require", "exports", "modules/classes/AbstractBinding.class"], function (require, exports, AbstractBinding_class_12) {
    "use strict";
    exports.__esModule = true;
    var TooltipterBinding = /** @class */ (function (_super) {
        __extends(TooltipterBinding, _super);
        function TooltipterBinding() {
            return _super.call(this, 'tooltip') || this;
        }
        TooltipterBinding.prototype.init = function (element, valueAccessor) {
            // handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var $this = $(element);
                if ($this.tooltipster) {
                    try {
                        $this.tooltipster('destroy').off('.tooltipster');
                    }
                    catch (e) { }
                }
            });
        };
        TooltipterBinding.prototype.update = function (element, valueAccessor) {
            var content = ko.unwrap(valueAccessor());
            var $this = $(element);
            if (content != null && typeof (content) == "object") {
                content = {
                    text: ko.unwrap(content.text),
                    animation: ko.unwrap(content.animation),
                    position: ko.unwrap(content.position),
                    permanent: ko.unwrap(content.permanent)
                };
            }
            else {
                content = {
                    text: ko.unwrap(content)
                };
            }
            var oldContent = $this.data("kotooltipster");
            if (content != oldContent) {
                if (oldContent) {
                    $this.attr("title", null);
                    if ($this.tooltipster) {
                        try {
                            $this.tooltipster('destroy');
                        }
                        catch (e) { }
                    }
                }
                if (content && content.text) {
                    var position = content.position || $this.attr('data-ttposition');
                    var animation = content.animation || $this.attr('data-ttanimation');
                    var title = content.text.text().replaceAll("&nbsp;", " ");
                    var permanent = content.permanent || $this.attr('data-ttpermanent');
                    var autoClose = !permanent;
                    var hideOnClick = true;
                    $this.data("kotooltipster", content);
                    if ($this.tooltipster) {
                        $this.attr("title", content.text);
                        $this.tooltipster({
                            animation: animation,
                            updateAnimation: false,
                            contentAsHTML: true,
                            delay: 100,
                            position: position,
                            hideOnClick: hideOnClick,
                            autoClose: autoClose,
                            onlyOne: true,
                            touchDevices: true,
                            trigger: (app.context.device == 'computer' ? 'hover' : 'click')
                        });
                        if (permanent) {
                            $this.tooltipster('show');
                        }
                    }
                    else {
                        $this.attr("title", title);
                    }
                }
                else {
                    $this.attr("title", null);
                }
            }
        };
        return TooltipterBinding;
    }(AbstractBinding_class_12.AbstractBinding));
    exports.TooltipterBinding = TooltipterBinding;
});
define("modules/classes/API.class", ["require", "exports", "modules/helpers/query"], function (require, exports, query_3) {
    "use strict";
    exports.__esModule = true;
    /**
     * Use this class to simplify REST request
     */
    var API = /** @class */ (function () {
        function API(uri) {
            this.uri = uri;
        }
        /**
         * Returne API uri
         */
        API.prototype.getUri = function () {
            return this.uri;
        };
        /**
         * Execute a POST request
         */
        API.prototype.create = function (fnDone, fnFail, opts) {
            query_3.Query.POST(this.uri, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Execute a PUT request
         */
        API.prototype.update = function (fnDone, fnFail, opts) {
            query_3.Query.PUT(this.uri + "/" + this.id, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Execute a PATCH request
         */
        API.prototype.patch = function (fnDone, fnFail, opts) {
            query_3.Query.PATCH(this.uri + "/" + this.id, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Execute a DELETE request
         */
        API.prototype.remove = function (fnDone, fnFail, opts) {
            query_3.Query.DELETE(this.uri + "/" + this.id, { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Execute a GET request
         */
        API.prototype.load = function (fnDone, fnFail, opts) {
            query_3.Query.GET(this.uri + "/" + this.id, { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Execute a GET request and fill data
         * @see fromJson
         */
        API.prototype.synchronize = function (fnDone, fnFail, opts) {
            var _this = this;
            this.load(function (data) {
                _this.fromJson(data);
                if (typeof (fnDone) == "function") {
                    fnDone.call(_this, data);
                }
            }, fnFail, opts);
        };
        /**
         * Execute a GET request
         */
        API.prototype.list = function (fnDone, fnFail, opts) {
            query_3.Query.GET(this.uri, { success: fnDone, fail: fnFail }, this, opts);
        };
        /**
         * Save data depending on id
         * No id => create
         * id => update
         * id = -1 => remove
         */
        API.prototype.save = function (fnDone, fnFail, opts) {
            if (!this.id) {
                // Create
                this.create(fnDone, fnFail, opts);
            }
            else if (this.id == -1) {
                // Delete
                this.remove(fnDone, fnFail, opts);
            }
            else {
                // Update
                this.update(fnDone, fnFail, opts);
            }
        };
        // Return waypoint data as Json
        API.prototype.toJson = function () {
            return JSON.stringify(this.data());
        };
        return API;
    }());
    exports.API = API;
});
define("modules/classes/AppManager.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var AppManager = /** @class */ (function () {
        function AppManager() {
            this._managers = {};
            this._binders = [];
            this._isRunningLock = false;
            this._unsynchronized = false;
        }
        AppManager.prototype.checkBinders = function () {
            var _this = this;
            if (this._isRunningLock) {
                this._unsynchronized = true;
                return;
            }
            this._unsynchronized = false;
            this._isRunningLock = true;
            var i = 0;
            do {
                var binder = this._binders[i];
                if (binder) {
                    var j = 0;
                    do {
                        var manager = this.exists(binder.managers[j]);
                        if (manager && (!binder.ifReady || manager.isReady())) {
                            binder.arguments[binder.indexes.indexOf(binder.managers[j])] = manager;
                            binder.managers.remove(binder.managers[j]);
                        }
                        else {
                            j++;
                        }
                    } while (j < binder.managers.length);
                    if (binder.managers.length == 0) {
                        binder.fn.apply(binder.context, binder.arguments);
                        this._binders.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
            } while (i < this._binders.length);
            this._isRunningLock = false;
            if (this._unsynchronized) {
                defer(function () { _this.checkBinders(); });
            }
        };
        AppManager.prototype.register = function (managerId, manager) {
            var _this = this;
            this._managers[managerId] = manager;
            manager.on('ready', function () {
                _this.checkBinders();
            }, manager);
            this.checkBinders();
            return manager;
        };
        AppManager.prototype.exists = function (managerId) {
            var m = this._managers[managerId];
            return m;
        };
        AppManager.prototype.get = function (managerId) {
            var m = this.exists(managerId);
            if (!m) {
                throw 'Manager not found : ' + managerId;
            }
            return m;
        };
        AppManager.prototype.getManagers = function () {
            return this._managers;
        };
        AppManager.prototype.addBinder = function (managerId, fn, context, ifReady) {
            if (!$.isArray(managerId)) {
                managerId = [managerId];
            }
            this._binders.push({
                managers: [].concat(managerId),
                indexes: managerId,
                arguments: [],
                fn: fn,
                context: context,
                ifReady: ifReady
            });
            this.checkBinders();
        };
        AppManager.prototype.ready = function (managerId, fn, context) {
            this.addBinder(managerId, fn, context, true);
        };
        AppManager.prototype.require = function (managerId, fn, context) {
            this.addBinder(managerId, fn, context, false);
        };
        return AppManager;
    }());
    exports.AppManager = AppManager;
});
define("modules/helpers/classes/BrowserInfo.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var UNKNOWN = "Unknown";
    var dataOS = [{
            pattern: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            pattern: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            pattern: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            pattern: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }];
    var dataBrowser = [{
            pattern: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            pattern: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            pattern: navigator['vendor'],
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window['opera'],
            identity: "Opera",
            versionSearch: "Version"
        }, {
            pattern: navigator['vendor'],
            subString: "iCab",
            identity: "iCab"
        }, {
            pattern: navigator['vendor'],
            subString: "KDE",
            identity: "Konqueror"
        }, {
            pattern: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            pattern: navigator['vendor'],
            subString: "Camino",
            identity: "Camino"
        }, {
            pattern: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            pattern: navigator.userAgent,
            subString: "IEMobile",
            identity: "IEMobile",
            versionSearch: "rv"
        }, {
            pattern: navigator.userAgent,
            subString: "Trident/",
            identity: "Explorer",
            versionSearch: "rv"
        }, {
            pattern: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, {
            pattern: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            pattern: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }];
    exports.getBrowserLanguage = function () {
        var browserLanguage = navigator['language'];
        if (!browserLanguage) {
            browserLanguage = navigator['userLanguage'];
        }
        return browserLanguage;
    };
    var BrowserInfo = /** @class */ (function () {
        function BrowserInfo() {
            this.browser = this.searchString(dataBrowser) || UNKNOWN;
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || -1;
            this.OS = this.searchString(dataOS) || UNKNOWN;
            this.language = exports.getBrowserLanguage();
            this.countryCode = this.language.substr(0, this.language.indexOf('-')) || this.language;
            //window.alert(navigator.userAgent + "> " + this.browser + " " + this.version);
        }
        /** Détermine si on est PROBABLEMENT sur la version ModernUI (on ne peut pas en être sûr, merci Microsoft) */
        BrowserInfo.prototype.isProbablyModernUI = function () {
            /* URL : http://stackoverflow.com/questions/10964966/detect-ie-version-in-javascript */
            var isIE = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0);
            /* URL : http://stackoverflow.com/questions/8751479/javascript-detect-metro-ui-version-of-ie */
            /** Metro doesn't allow any activex content, but desktop IE can have it set to disabled as well */
            function isActiveXEnabled() {
                var supported = null;
                try {
                    supported = !!new ActiveXObject("htmlfile");
                }
                catch (e) {
                    supported = false;
                }
                return supported;
            }
            /** Metro will always be in full screen mode, however Desktop IE can also run in full screen mode, but this could be used as supporting evidence of Metro mode */
            function isFullScreen() {
                return (window.innerWidth == screen.width && window.innerHeight == screen.height);
            }
            return isIE && !isActiveXEnabled() && isFullScreen();
        };
        BrowserInfo.prototype.searchString = function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].pattern;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) {
                        return data[i].identity;
                    }
                }
                else if (dataProp) {
                    return data[i].identity;
                }
            }
        };
        BrowserInfo.prototype.searchVersion = function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1)
                return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        };
        return BrowserInfo;
    }());
    exports.BrowserInfo = BrowserInfo;
});
define("modules/helpers/browser", ["require", "exports", "modules/helpers/classes/BrowserInfo.class"], function (require, exports, BrowserInfo_class_1) {
    "use strict";
    exports.__esModule = true;
    var Browser = /** @class */ (function () {
        function Browser(supportedVersions) {
            if (supportedVersions === void 0) { supportedVersions = []; }
            this.currentBrowserInfos = new BrowserInfo_class_1.BrowserInfo();
            this.supportedVersions = [];
            this.setSupportedVersions(supportedVersions);
        }
        Browser.prototype.setSupportedVersions = function (supportedVersions) {
            this.supportedVersions = supportedVersions;
        };
        /**
         * Retourne les informations issues du browser
         */
        Browser.prototype.getCurrentBrowserInfos = function () {
            return this.currentBrowserInfos;
        };
        /**
         * Contrôle le navigateur et la version min par rapport aux informations du browser
         */
        Browser.prototype.check = function (fn) {
            var currentBrowserInfos = this.getCurrentBrowserInfos();
            var currentBrowser = currentBrowserInfos.browser;
            var currentBrowserVersion = currentBrowserInfos.version;
            return this.checkForBrowser(currentBrowser, currentBrowserVersion, fn);
        };
        /**
         * Contrôle le navigateur et la version min par rapport aux informations passées en parametres
         */
        Browser.prototype.checkForBrowser = function (browserName, version, fn) {
            var supportedBrowsersInfo = this.supportedVersions;
            var browserInfo = null;
            var len = supportedBrowsersInfo.length;
            var result = true;
            for (var i = 0; i < len; i++) {
                if (supportedBrowsersInfo[i] && supportedBrowsersInfo[i].name == browserName) {
                    browserInfo = supportedBrowsersInfo[i];
                    break;
                }
            }
            if (result && browserInfo != null) {
                // now let's check if the version is supported
                var browserSupportedMinVersion = browserInfo.minVersion;
                if (browserSupportedMinVersion && version < browserSupportedMinVersion) {
                    result = false;
                }
            }
            if (typeof (fn) == "function") {
                fn.call(this, result, browserInfo);
            }
            return result;
        };
        return Browser;
    }());
    exports.Browser = Browser;
});
define("modules/forms/classes/Tooltip.class", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Tooltip = /** @class */ (function () {
        function Tooltip(uid) {
            /**
             * The text.
             * @type {string}
             */
            this.text = ko.observable('');
            this.show = ko.observable(true);
            this.animation = "grow";
            this.position = "bottom";
            this.type = ko.observable('');
            if (!uid) {
                uid = utils.genId();
            }
            this.uid = uid;
        }
        Tooltip.prototype.setText = function (resourceId, defaultId) {
            if (defaultId === void 0) { defaultId = ''; }
            this.text = app.i18n.getObservableString(resourceId, defaultId);
        };
        return Tooltip;
    }());
    exports.Tooltip = Tooltip;
});
define("modules/forms/classes/Option.class", ["require", "exports", "modules/forms/classes/Tooltip.class"], function (require, exports, Tooltip_class_1) {
    "use strict";
    exports.__esModule = true;
    var Option = /** @class */ (function () {
        function Option(value, resourceId, resourceTextId) {
            /**
             * The value.
             * @type {string}
             */
            this.value = null;
            this.data = {};
            this.tooltip = new Tooltip_class_1.Tooltip();
            this.disabled = ko.observable(false);
            /**
             * The text.
             * @type {string}
             */
            this.text = ko.observable();
            this.value = value;
            this.resourceId = resourceId || value;
            this.resourceTextId = resourceTextId || this.resourceId;
            this.text = app.i18n.getObservableString(this.resourceTextId + '.label', this.resourceId);
            this.tooltip.setText(this.resourceTextId + '.tooltip');
        }
        Option.afterRenderFunction = function (option, item) {
            if (item) {
                ko.applyBindingsToNode(option, { disable: item.disabled }, item);
            }
        };
        return Option;
    }());
    exports.Option = Option;
});
define("modules/forms/index", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var RegExpValidationRule = /** @class */ (function () {
        function RegExpValidationRule(regExp) {
            this.regExp = regExp;
        }
        RegExpValidationRule.prototype.test = function (value) {
            if (value && value != "") {
                if (this.regExp.test(value)) {
                    // the value is valid
                    return true;
                }
                else {
                    // the value is not valid
                    return false;
                }
            }
            return true;
        };
        return RegExpValidationRule;
    }());
    exports.RegExpValidationRule = RegExpValidationRule;
});
define("modules/forms/InputField", ["require", "exports", "modules/forms/classes/Tooltip.class", "modules/classes/EventsBinder.class", "modules/forms/index"], function (require, exports, Tooltip_class_2, EventsBinder_class_2, index_1) {
    "use strict";
    exports.__esModule = true;
    var uids = [];
    function getId(name, ind) {
        if (ind === void 0) { ind = null; }
        return (name + (ind != null ? '-' + ind : '')).replace(/[' \.]/gi, '_');
    }
    exports.getId = getId;
    function getUID(name, ind) {
        if (ind === void 0) { ind = null; }
        var id = getId(name, ind);
        var num = 0;
        var uid = id;
        while (uids.indexOf(uid) != -1) {
            uid = id + '_' + (++num);
        }
        uids.push(uid);
        return uid;
    }
    exports.getUID = getUID;
    var BaseField = /** @class */ (function (_super) {
        __extends(BaseField, _super);
        function BaseField(id, bShowLabel) {
            if (bShowLabel === void 0) { bShowLabel = true; }
            var _this = _super.call(this) || this;
            _this.labelArgs = ko.observable();
            _this.showLabel = ko.observable(true);
            /* affiche un tag indiquant qu'un champ est obligatoire*/
            _this.showRequiredTag = ko.observable(true);
            /* Libellé complémentaire pour un champ obligatoire*/
            _this.requiredTagLabel = ko.observable("*");
            _this.unvalidatedConstraints = ko.observableArray();
            _this.validationConstraintsInfos = ko.observable();
            _this.messages = ko.observableArray([]);
            _this.showMessages = ko.observable(BaseField.defaultShowMessages);
            _this.uid = getUID(id);
            _this.id = id;
            _this.label = app.i18n.getObservableString(id + '.label', '');
            _this.sub = app.i18n.getObservableString(id + '.sub', '');
            _this.tooltip = new Tooltip_class_2.Tooltip(_this.uid + '-tooltip');
            _this.tooltip.setText(_this.id + '.tooltip');
            _this.showLabel(bShowLabel);
            _this.formattedLabel = ko.computed(function () {
                return _this.formatLabel(_this.label());
            }, _this);
            _this.validationConstraints = ko.observableArray();
            _this.isConstraintsValid = ko.computed(_this.validateConstraints, _this);
            return _this;
        }
        BaseField.prototype.formatLabel = function (label) {
            var labelArgs_ = this.labelArgs();
            if (labelArgs_) {
                return utils.formatString(label, labelArgs_);
            }
            return label;
        };
        /**
         * Add a warn constraint validation rule
         */
        BaseField.prototype.addWarnConstraint = function (name, fn, messageFn) {
            return this.addConstraint(name, fn, messageFn, true);
        };
        /**
         * Add a constraint validation rule
         */
        BaseField.prototype.addConstraint = function (name, fn, messageFn, isWarn) {
            if (isWarn === void 0) { isWarn = false; }
            var o = new InputFieldValidationConstraint(name, fn, messageFn, isWarn);
            o.isValid = ko.computed(fn, this).extend({ throttle: 1 });
            this.validationConstraints.push(o);
            return o;
        };
        /**
         *
         */
        BaseField.prototype.validateConstraints = function (checkAlls) {
            if (checkAlls === void 0) { checkAlls = true; }
            var isValidated_ = true;
            var unvalidatedConstraints = [];
            var infos = new ValidationConstraintInfos();
            var constraintsList = this.validationConstraints();
            for (var i = 0, len = constraintsList.length; i < len; i++) {
                var constraint = constraintsList[i];
                if (!constraint.isValid()) {
                    unvalidatedConstraints.push(constraint);
                    if (!constraint.isWarn) {
                        isValidated_ = false;
                    }
                    else {
                        infos.hasWarns = true;
                    }
                    if (!checkAlls && !isValidated_) {
                        break;
                    }
                }
            }
            this.unvalidatedConstraints(unvalidatedConstraints);
            this.validationConstraintsInfos(infos);
            return isValidated_;
        };
        BaseField.prototype.dispose = function () {
            dispose(this.formattedLabel);
        };
        BaseField.defaultShowMessages = true;
        return BaseField;
    }(EventsBinder_class_2.EventsBinder));
    exports.BaseField = BaseField;
    /**
     * Constraint class for input validation rules
     */
    var InputFieldValidationConstraint = /** @class */ (function () {
        function InputFieldValidationConstraint(name, fn, messageFn, isWarn) {
            if (isWarn === void 0) { isWarn = false; }
            this.name = name;
            this.fn = fn;
            this.isWarn = isWarn;
            this.messageFn = messageFn;
        }
        InputFieldValidationConstraint.prototype.dispose = function () {
            dispose(this.isValid);
        };
        return InputFieldValidationConstraint;
    }());
    exports.InputFieldValidationConstraint = InputFieldValidationConstraint;
    var ValidationConstraintInfos = /** @class */ (function () {
        function ValidationConstraintInfos() {
            this.hasWarns = false;
        }
        return ValidationConstraintInfos;
    }());
    exports.ValidationConstraintInfos = ValidationConstraintInfos;
    /**
     * Constraint class for input validation rules
     */
    var InputFieldMessage = /** @class */ (function () {
        function InputFieldMessage(text, isWarn) {
            if (isWarn === void 0) { isWarn = false; }
            this.text = text;
            this.isWarn = isWarn;
        }
        return InputFieldMessage;
    }());
    exports.InputFieldMessage = InputFieldMessage;
    /**
     * A value for a property.
     * @param {Property} property The property.
     * @param {?(number|string)} value The value for this property.
     * @constructor
     */
    var InputField = /** @class */ (function (_super) {
        __extends(InputField, _super);
        function InputField(id, value, required, readOnly) {
            if (required === void 0) { required = true; }
            if (readOnly === void 0) { readOnly = false; }
            var _this = _super.call(this, id) || this;
            /**
             * A value that indicates whether this field is read-only or read-write.
             * @type {boolean}
             */
            _this.isReadOnly = ko.observable(false);
            _this.isDisabled = ko.observable(false);
            _this.isRequired = ko.observable(true);
            _this.isVisible = ko.observable(true);
            _this.isEditable = ko.observable(true);
            _this.autoValidate = ko.observable(true);
            _this.isEmpty = ko.observable(true);
            /**
            * The value that indicates whether the field is focused
            * @type {ko.observable(boolean)}
            */
            _this.isFocused = ko.observable(false);
            /**
             * The name attribute
             */
            _this.name = ko.observable();
            /**
             * The validated value for this property.
             * @type {ko.observable(?(number|string))}
             */
            _this.oldValue = ko.observable(null);
            /**
             * The validated value for this property.
             * @type {ko.observable(?(number|string))}
             */
            _this.value = null;
            /**
             * The value that indicates whether the last input is valid.
             * @type {ko.observable(boolean)}
             */
            _this.isLastInputValid = ko.observable(true);
            /**
             * The boolean value result controlled by an external process
             */
            _this.externalValidationValue = ko.observable(true);
            /**
             * The value that indicates is the field has warning messages
             * @type {ko.observable(boolean)}
             */
            _this.hasWarns = ko.observable(false);
            /**
            * The value that indicates whether the field has been visited by user.
            * @type {ko.observable(boolean)}
            */
            _this.hasBeenVisited = ko.observable(false);
            _this.template = InputField.defaultTemplate;
            _this.labelTemplate = InputField.defaultLabelTemplate;
            _this.inputTemplate = InputField.defaultInputTemplate;
            _this.validationRule = ko.observable();
            _this.value = _this.getValuable();
            _this.dataValue = ko.computed(_this.getDataValue, _this);
            _this.isReadOnly(readOnly);
            _this.isRequired(required);
            _this.oldValue(value);
            _this.value(value);
            _this.placeholder = app.i18n.getObservableString(id + '.placeholder', '');
            _this.name = app.i18n.getObservableString(id + '.name', '');
            _this.dataName = id.right(id.length - id.lastIndexOf(".") - 1);
            _this.autoValidate.subscribe(function (b) {
                if (b) {
                    this.validateValue();
                }
            }, _this);
            _this.validationRule.subscribe(function (rule) {
                this.setValidationRule(rule);
                if (this.autoValidate()) {
                    this.validateValue();
                }
            }, _this);
            _this.isRequired.subscribe(function (b) {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            }, _this);
            _this.isDisabled.subscribe(function (b) {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            }, _this);
            _this.dataValue.immediateSubscribe(function (value) {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
                _this.isEmpty(_this.valueIsEmpty(value));
            }, _this);
            _this.validationConstraints.subscribe(function () {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            }, _this);
            _this.externalValidationValue.subscribe(function () {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            }, _this);
            _this.isConstraintsValid.subscribe(function () {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            }, _this);
            // Do not add throttle here !!
            _this.hasChanged = ko.computed(_this.computeHasChanged, _this);
            _this.isFormValid = ko.computed(_this.computeIsFormValid, _this);
            return _this;
        }
        InputField.prototype.getValuable = function () {
            return ko.observable(null);
        };
        InputField.prototype.setValidationRegExp = function (regExp) {
            return this._validationRule = regExp ? new index_1.RegExpValidationRule(regExp) : null;
        };
        InputField.prototype.valueIsEmpty = function (value) {
            return (typeof (value) == "undefined") || value == null || (CString(value).trim() == "");
        };
        InputField.prototype.isValidateValue = function (value) {
            var isRequired = !this.isDisabled() && this.isRequired();
            var hasValue = !this.valueIsEmpty(value);
            var b = (!isRequired) || (isRequired && hasValue);
            if (b && hasValue) {
                if (this._validationRule) {
                    b = this._validationRule.test(CString(value));
                }
            }
            return b;
        };
        /**
        * Validation function to trigger
        * @type {function()}
        */
        InputField.prototype.validateValue = function () {
            var value = this.value();
            var unvalidatedConstraints = [];
            var bV_ = this.isValidateValue(value);
            var bC_ = false;
            var infos_ = new ValidationConstraintInfos();
            if (bV_) {
                bC_ = this.isConstraintsValid();
            }
            this.hasWarns(this.validationConstraintsInfos().hasWarns);
            this.isLastInputValid(bV_ && bC_ && this.externalValidationValue());
        };
        /**
         * Computes the value that indicates whether the value has changed.
         * @type {function():boolean}
         * @return boolean
         */
        InputField.prototype.computeHasChanged = function () {
            return (this.oldValue() != this.value());
        };
        InputField.prototype.computeIsFormValid = function () {
            var isDisabled_ = this.isDisabled();
            var isLastInputValid_ = this.isLastInputValid();
            return isDisabled_ || isLastInputValid_;
        };
        InputField.prototype.getDataValue = function () {
            var isDisabled_ = this.isDisabled();
            if (!isDisabled_) {
                return this.value();
            }
            return null;
        };
        /**
         * Set value and apply changes in one call
         */
        InputField.prototype.forceValue = function (value) {
            this.value(value);
            this.applyChanges();
        };
        InputField.prototype.applyChanges = function () {
            this.oldValue(this.value());
        };
        InputField.prototype.cancelChanges = function () {
            this.hasBeenVisited(false);
            this.forceValue(this.oldValue());
        };
        InputField.prototype.onBlurEventHandler = function (e) {
            var _this = this;
            this._onBlurEventDefer = defer(function () {
                _this.isFocused(false);
                _this.hasBeenVisited(true);
            }, 100);
            return true;
        };
        InputField.prototype.onFocusEventHandler = function (e) {
            clearTimeout(this._onBlurEventDefer);
            this.isFocused(true);
            return true;
        };
        InputField.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            dispose(this.isEmpty);
            dispose(this.validationConstraints);
            dispose(this.formattedLabel);
            clearTimeout(this._onBlurEventDefer);
        };
        /**Label template utilisé par défault*/
        InputField.defaultLabelTemplate = "ui-field-label-template";
        /**template utilisé par défault*/
        InputField.defaultTemplate = "ui-field-template";
        /**Input template utilisé par défaut*/
        InputField.defaultInputTemplate = "ui-field-input-template";
        return InputField;
    }(BaseField));
    exports.InputField = InputField;
});
define("modules/forms/SelectField", ["require", "exports", "modules/forms/classes/Option.class", "modules/forms/InputField"], function (require, exports, Option_class_1, InputField_1) {
    "use strict";
    exports.__esModule = true;
    var SelectField = /** @class */ (function (_super) {
        __extends(SelectField, _super);
        function SelectField(id, choices, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.choices = [];
            _this._valueToSet = null;
            _this._valueToForce = null;
            _this.options = ko.observableArray();
            _this.view = ko.observable('default');
            _this.inline = ko.observable(false);
            _this.selectedOptionText = ko.observable();
            _this.selectedOption = ko.observable();
            _this.useNativeDialogSelect = ko.observable(true);
            _this.autoSort = ko.observable(false);
            _this.autoSortFunction = null;
            _this.inputTemplate = "ui-field-select-template";
            SelectField.useNativeDialogSelect.immediateSubscribe(function (b) {
                _this.useNativeDialogSelect(b);
            });
            _this.size = ko.computed(function () {
                return _this.options().length;
            }).extend({ throttle: 0 });
            _this.options.subscribe(function () {
                _this.updateListOfChoices();
                clearTimeout(_this.__optionsThrottle);
                _this.__optionsThrottle = defer(function () {
                    var options_ = _this.options(); // Le computed s'enregistre sur l'observable
                    if (_this._valueToForce != null) {
                        _this.forceValue(_this._valueToForce);
                    }
                    if (_this._valueToSet != null) {
                        if (_this.isValidateValue(_this._valueToSet)) {
                            var v_ = _this._valueToSet;
                            _this._valueToSet = null;
                            _this.outputValue(v_);
                        }
                    }
                    _this.value.notifySubscribers(_this.value());
                });
            }); //.extend({ throttle: 0 }); // Utilisation du throttle pour laisser le temps à l'IHM de rafraichir la liste des options du select
            _this.updateChoices(choices);
            _this.autoSort.immediateSubscribe(function (b) {
                if (b) {
                    _this.sort(_this.autoSortFunction);
                }
            });
            _this.value.immediateSubscribe(function (v) {
                var options_ = _this.options();
                var option_ = options_[_this.choices.indexOf(CString(v))];
                _this.selectedOption(option_ || null);
                _this.selectedOptionText(option_ ? option_.text() : '');
                if (_this.choices.length == 1 && _this.choices[0] == v) {
                    _this.hasBeenVisited(true);
                }
            });
            return _this;
        }
        SelectField.prototype.onChangeEventHandler = function (e) {
            var _this = this;
            if (this.isFocused() == true) {
                this._onChangeEventDefer = defer(function () {
                    _this.isFocused(false);
                    _this.hasBeenVisited(true);
                }, 100);
            }
            return true;
        };
        SelectField.prototype.onChangeWithoutFocusEventHandler = function (e) {
            var _this = this;
            this._onChangeEventDefer = defer(function () {
                _this.isFocused(false);
                _this.hasBeenVisited(true);
            }, 100);
            return true;
        };
        SelectField.prototype.onChangeCustomSelectEventHandler = function (e) {
            var _this = this;
            this._onChangeEventDefer = defer(function () {
                _this.isFocused(false);
                _this.hasBeenVisited(true);
                var id = '#' + _this.uid;
                if (_this.inputTemplate == "ui-table-field-select-template" && $(id).hasClass('selectpicker')) {
                    $(id).parents('tr').addClass('ui-group-visited');
                }
            }, 100);
            return true;
        };
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        SelectField.prototype.isValidateValue = function (value) {
            var isValid = _super.prototype.isValidateValue.call(this, value);
            if (isValid && !this.valueIsEmpty(value)) {
                var choices = this.choices;
                if (choices) {
                    isValid = (choices.indexOf(String(value)) > -1);
                }
            }
            return isValid;
        };
        SelectField.prototype.getValuable = function () {
            this.outputValue = _super.prototype.getValuable.call(this);
            this.valuableValue = ko.computed({
                read: function () {
                    var value = this.outputValue();
                    if (this.isValidateValue(value)) {
                        return value;
                    }
                    return null;
                },
                write: function (value) {
                    if (value != null && !this.isValidateValue(value)) {
                        this._valueToSet = value;
                        value = this.choices ? this.choices[0] || null : null;
                    }
                    if (this.outputValue() != value) {
                        this.outputValue(value);
                    }
                    this.outputValue.notifySubscribers();
                },
                owner: this
            });
            return this.valuableValue;
        };
        /**
         * Set value and apply changes in one call
         */
        SelectField.prototype.forceValue = function (value) {
            if (this.isValidateValue(value)) {
                _super.prototype.forceValue.call(this, value);
                this._valueToForce = null;
            }
            else {
                this.oldValue(value);
                this.value(value);
                this._valueToForce = value;
            }
        };
        /**
         * Construit une liste d'éléments Option
         */
        SelectField.prototype.getListOfOptions = function (newChoices) {
            var options;
            options = [];
            if (newChoices) {
                if (!$.isArray(newChoices)) {
                    $.each(newChoices, function (v, k) {
                        options.push(new Option_class_1.Option(CString(v).trim(), CString(k).trim()));
                    });
                }
                else {
                    var choicesCount = newChoices.length;
                    for (var choiceIndex = 0; choiceIndex < choicesCount; choiceIndex++) {
                        var objChoice = newChoices[choiceIndex];
                        if (objChoice instanceof Option_class_1.Option) {
                            options.push(objChoice);
                        }
                        else {
                            if (typeof (objChoice) == "object") {
                                var optionValue = isset(objChoice.value) ? objChoice.value : objChoice.id;
                                var option = new Option_class_1.Option(optionValue, objChoice.label, objChoice.label || (this.id + '.list[' + optionValue + ']'));
                                option.data = objChoice;
                                options.push(option);
                            }
                            else {
                                var choice = CString(objChoice).trim();
                                options.push(new Option_class_1.Option(choice, choice, this.id + '.list[' + choice + ']'));
                            }
                        }
                    }
                }
            }
            return options;
        };
        SelectField.prototype.addChoices = function (newChoices) {
            var options = this.getListOfOptions(newChoices);
            var options_ = this.options().concat(options);
            if (this.autoSort()) {
                options_ = this.__sort(options_, this.autoSortFunction);
            }
            this.options.valueWillMutate();
            this.options(options_);
        };
        SelectField.prototype.removeChoices = function (oldchoices) {
            var options, optionsList;
            options = [];
            optionsList = this.options();
            if (oldchoices) {
                if (!$.isArray(oldchoices)) {
                    $.each(oldchoices, function (v, k) {
                        var opt = optionsList.findBy('value', v);
                        if (opt) {
                            options.push(opt);
                        }
                    });
                }
                else {
                    var choicesCount = oldchoices.length;
                    for (var choiceIndex = 0; choiceIndex < choicesCount; choiceIndex++) {
                        var choice = oldchoices[choiceIndex];
                        var opt = optionsList.findBy('value', choice);
                        if (opt) {
                            options.push(opt);
                        }
                    }
                }
            }
            this.options().removeAll(options);
            this.options.valueHasMutated();
        };
        /**
         * Update this select with the given choices.
         */
        SelectField.prototype.updateChoices = function (newChoices) {
            var strNewChoices = JSON.stringify(newChoices);
            if (this._oldChoicesStringified == strNewChoices) {
                return;
            }
            this._oldChoicesStringified = strNewChoices;
            var value_ = null;
            if (this._valueToSet == null && this._valueToForce == null) {
                value_ = this.outputValue();
            }
            this.options().removeAll();
            this.addChoices(newChoices);
            if (value_ != null) {
                this.outputValue(value_);
            }
            var id = '#' + this.uid;
            if ($(id).hasClass('selectpicker')) {
                $(id).selectpicker('refresh');
            }
        };
        SelectField.prototype.viewRadiosOptionClickFunction = function (option, e) {
            this.value(option.value);
            this.hasBeenVisited(true);
        };
        SelectField.prototype.hasChoice = function (choice) {
            return this.choices.contains(choice);
        };
        SelectField.prototype.sort = function (compareFn) {
            this.__sort(this.options(), compareFn);
            this.options.valueHasMutated();
            return this.options();
        };
        SelectField.prototype.__sort = function (options, compareFn) {
            if (!compareFn) {
                compareFn = function (a, b) {
                    return a.text().toLowerCase() > b.text().toLowerCase() ? 1 : -1;
                };
            }
            return options.sort(compareFn);
        };
        SelectField.prototype.updateListOfChoices = function (options) {
            if (options === void 0) { options = this.options(); }
            this.choices = [];
            for (var i = 0, len = options.length; i < len; i++) {
                var option_ = options[i];
                this.choices.push(CString(option_.value));
            }
        };
        SelectField.prototype.listCount = function () {
            return this.choices.length;
        };
        /**
         * @Override
         */
        SelectField.prototype.getDataValue = function () {
            var s_ = _super.prototype.getDataValue.call(this);
            var option_ = this.selectedOption ? this.selectedOption() : null;
            if (s_ && option_ && option_.disabled()) {
                return null;
            }
            return s_;
        };
        /**
         * Sélectionne la première page.
         */
        SelectField.prototype.selectFirst = function () {
            if (this.listCount() > 0) {
                this.value(this.options()[0].value);
            }
        };
        /**
         * @Override
         */
        SelectField.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            dispose(this.valuableValue);
        };
        SelectField.useNativeDialogSelect = ko.observable(true);
        return SelectField;
    }(InputField_1.InputField));
    exports.SelectField = SelectField;
    SelectField.useNativeDialogSelect.subscribe(function (b) {
        $(document).unbind('.disableNativeDialogSelect');
        if (!b) {
            var attachToParent_1 = function () {
                var $this = $(this);
                var relId = $this.attr('data-rel');
                var $relParent = $('#' + relId).parent();
                if ($this.parent() != $relParent) {
                    var relId_1 = $this.attr('data-rel');
                    $this.detach().appendTo($relParent);
                }
            };
            var hideOptionsList_1 = function (e) {
                var $this = $(this);
                var relId = $this.attr('id');
                $('.ui-field-select-options-list[data-rel=' + relId + ']').each(function () {
                    attachToParent_1.call(this);
                });
            };
            var hideAllOptionsList_1 = function () {
                var $list = $('.ui-field-select-options-list');
                $list.each(function () {
                    attachToParent_1.call(this);
                });
            };
            var showOptionList_1 = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                hideAllOptionsList_1();
                var $this = $(this);
                $this.focus();
                $this.parent().find('.ui-field-select-options-list').each(function () {
                    var $this = $(this);
                    var $window = $(window);
                    var relId = $this.attr('data-rel');
                    var $rel = $('#' + relId);
                    $this.detach().appendTo($('body'));
                    var relPos = $rel.offset();
                    var relHeight = $rel.outerHeight(true);
                    var espaceRestantBottom = $window.innerHeight() - relPos.top - relHeight + $window.scrollTop();
                    var espaceRestantTop = relPos.top - $window.scrollTop();
                    var thisPos = $this.offset();
                    var thisHeight = $this.height();
                    //hauteur +padding+margin
                    var thisOuterHeight = $this.outerHeight(true);
                    var thisOuterWidth = $this.outerWidth(true);
                    var positionLeft = $rel.offset().left;
                    if (positionLeft + thisOuterWidth > $window.innerWidth()) {
                        // Si la largeur de la zone dépasser la bordure droite
                        positionLeft = $window.innerWidth() - thisOuterWidth;
                    }
                    //largeur du select                    
                    var minWidth = $rel[0].offsetWidth;
                    if (positionLeft < 0) {
                        // Si la taille de la zone est supérieure à la taille de la fenêtre
                        positionLeft = 0;
                        $this.width($window.innerWidth());
                        if (minWidth > $window.innerWidth()) {
                            $this.css('min-width', $window.innerWidth() + "px");
                        }
                    }
                    else {
                        $this.css('min-width', minWidth + "px");
                        $this.width('auto');
                    }
                    //positionnement de la fleche
                    var pseudoElementBefore = window.getComputedStyle($this[0], ':before');
                    var pseudoElementAfter = window.getComputedStyle($this[0], ':after');
                    var pseudoElementBeforeLeftInitial = pseudoElementBefore.left;
                    if (pseudoElementBeforeLeftInitial.indexOf("px") !== -1) {
                        //le style est en pixel, il faut donc mettre à jour pour que la flèche soit bien positionnée
                        var relPosLeft = relPos.left;
                        //si la liste s'ouvre plus à gauche que le select, on calcul de combien il faut décaler la flèche pour qu'elle semble à la même place que sur les autres listes
                        if (positionLeft < relPosLeft) {
                            var pseudoElementBeforeLeftNew = relPosLeft - positionLeft;
                            $this[0].style.setProperty("--leftbefore", pseudoElementBeforeLeftNew + "px");
                            $this[0].style.setProperty("--leftafter", pseudoElementBeforeLeftNew + "px");
                        }
                    }
                    //on ajoute la classe dropup si l'espace disponible au dessus est supérieur à l'espace dispo en dessous et si l'espace en dessous n'est pas suffisant
                    $this.toggleClass('dropup', espaceRestantTop > espaceRestantBottom && espaceRestantBottom < thisOuterHeight);
                    //TODO : réduire max-height à l'espace dispo - marge - padding si l'espace disponible est plus petit que la hauteur déjà définie -> sur le ul
                    if ($this.hasClass('dropup')) {
                        $this.css({
                            left: positionLeft,
                            top: $rel.offset().top - thisOuterHeight
                        });
                    }
                    else {
                        $this.css({
                            left: positionLeft,
                            top: $rel.offset().top + $rel.outerHeight()
                        });
                    }
                });
            };
            $(document).on('click.disableNativeDialogSelect mousedown.disableNativeDialogSelect', '.ui-field-select-dialog > select', function (e) {
                showOptionList_1.call(this, e);
            });
            $(document).on('blur.disableNativeDialogSelect', '.ui-field-select-dialog > select', function (e) {
                var t = this;
                defer(function () {
                    hideOptionsList_1.call(t, e);
                });
            });
            $(document).on('keydown.disableNativeDialogSelect', '.ui-field-select-dialog > select', function (e) {
                switch (e.key) {
                    case " ":
                    case "Enter":
                        showOptionList_1.call(this, e);
                        break;
                    case "Escape":
                        hideOptionsList_1.call(this, e);
                        break;
                }
            });
            $(document).on('click.disableNativeDialogSelect', function () {
                //hideAllOptionsList();
            });
            $(document).on('mousedown.disableNativeDialogSelect', '.ui-field-select-options-list a', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('click.disableNativeDialogSelect', '.ui-field-select-options-list a', function (e) {
                var t = this;
                var $this = $('#' + $(t).parents('.ui-field-select-options-list:first').attr('data-rel'));
                defer(function () {
                    hideOptionsList_1.call($this[0], e);
                    $this.focus();
                });
            });
        }
    });
});
define("modules/classes/ViewModel.class", ["require", "exports", "modules/classes/EventsBinder.class"], function (require, exports, EventsBinder_class_3) {
    "use strict";
    exports.__esModule = true;
    var ViewModel = /** @class */ (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(stringsToRegister) {
            var _this = _super.call(this) || this;
            _this._bindings = [];
            _this.strings = {};
            app.i18n.ready(function () {
                if (stringsToRegister != null) {
                    _this.addStringsToModel(stringsToRegister);
                }
            });
            return _this;
        }
        ViewModel.prototype.addStringToModel = function (id) {
            this.strings[id] = app.i18n.getObservableString(id);
        };
        ViewModel.prototype.addStringsToModel = function (ids) {
            for (var i = 0, length_2 = ids.length; i < length_2; i++) {
                this.addStringToModel(ids[i]);
            }
        };
        ViewModel.prototype.dispose = function () {
            this.clearBindings();
        };
        ViewModel.prototype.applyBindings = function (element, bindings) {
            var $element = $(element);
            if (isset(bindings)) {
                $element.attr('data-bind', bindings);
            }
            ko.applyBindings(this, $element[0]);
            this._bindings.push($element[0]);
            return $element;
        };
        ViewModel.prototype.removeBindings = function (element) {
            var $element = $(element);
            ko.removeNode($element[0]);
        };
        ViewModel.prototype.clearBindings = function () {
            var _this = this;
            $.each(this._bindings, function (i, element) {
                _this.removeBindings(element);
            });
            this._bindings.removeAll();
        };
        return ViewModel;
    }(EventsBinder_class_3.EventsBinder));
    exports.ViewModel = ViewModel;
});
define("modules/helpers/files", ["require", "exports", "modules/helpers/logger", "modules/helpers/query"], function (require, exports, logger_3, query_4) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_3.Logger.getLogger('files');
    function loadResource(resource, callback, context) {
        if (logger.isTraceEnabled()) {
            logger.trace("Chargement de la ressource %s".format(resource));
        }
        var callbackHandler = function (text, status) {
            if (status == "success") {
                if (logger.isDebugEnabled()) {
                    logger.debug("Chargement réussi de la ressource %s".format(resource));
                }
                if (callback) {
                    callback.call(context || this, text);
                }
            }
            else {
                logger.error("Erreur lors du chargement de la ressource %s".format(resource));
            }
        };
        if (!((resource || "").toLowerCase().startsWith('http'))) {
            resource = app.servicesPath + resource;
        }
        query_4.Query.GET(resource, callback, context, { silent: true, upToDate: false });
    }
    exports.loadResource = loadResource;
});
define("modules/classes/MVVM.class", ["require", "exports", "modules/helpers/logger", "modules/classes/ViewModel.class", "modules/helpers/files"], function (require, exports, logger_4, ViewModel_class_1, file) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_4.Logger.getLogger('MVVM');
    var MVVM = /** @class */ (function (_super) {
        __extends(MVVM, _super);
        function MVVM(view, stringsToRegister) {
            if (stringsToRegister === void 0) { stringsToRegister = []; }
            var _this = _super.call(this, stringsToRegister) || this;
            /**
             * The content encapsulated in this view.
             * @type {jQuery.Object}
             */
            _this._htmlContent = null;
            _this._content = null;
            _this._owner = 'body';
            _this._view = null;
            _this.loadingCounter = ko.observable(0);
            _this.isLoaded = ko.observable(false);
            _this._view = view;
            _this.isLoading = ko.computed(function () {
                return _this.loadingCounter() > 0;
            }).extend({ throttle: 0 });
            return _this;
        }
        MVVM.prototype._load = function (htmlContent, callback) {
            this._unload();
            this._htmlContent = htmlContent;
            this.isLoaded(true);
            this.beforePrepare();
            this.prepare();
            this.afterPrepare();
            if (callback) {
                callback.call(this, htmlContent);
            }
        };
        MVVM.prototype.load = function (callback, htmlContent) {
            var _this = this;
            if (this._view && !isset(htmlContent)) {
                this.loadingCounter(this.loadingCounter() + 1);
                if (this._view.startsWith('http')) {
                    file.loadResource(this._view, function (htmlContent) {
                        _this._load(htmlContent, callback);
                        _this.loadingCounter(Math.max(0, _this.loadingCounter() - 1));
                    });
                }
                else {
                    var $view = $(this._view);
                    if ($view.length == 0) {
                        this._load('<div>' + this._view + '</div>', callback);
                    }
                    else {
                        this._load('<div>' + $view.html() + '</div>', callback);
                    }
                    this.loadingCounter(Math.max(0, this.loadingCounter() - 1));
                }
            }
            else {
                this._load(htmlContent, callback);
            }
        };
        MVVM.prototype.loadTo = function (owner, callback) {
            this._owner = owner;
            this.load(callback);
        };
        MVVM.prototype.beforePrepare = function () { };
        MVVM.prototype.afterPrepare = function () { };
        MVVM.prototype.prepare = function () {
            if (this._htmlContent) {
                if (logger.isTraceEnabled()) {
                    logger.trace('prepare content ', this._htmlContent);
                }
                // Add to DOM 
                this._content = $(this._htmlContent).appendTo($(this._owner));
                // Apply bindings
                _super.prototype.applyBindings.call(this, this._content);
            }
        };
        MVVM.prototype.unload = function () {
            var _this = this;
            if (this.isLoading()) {
                this.isLoading.subscribeOnce(function (b) {
                    if (!b) {
                        _this._unload();
                    }
                });
                return;
            }
            this._unload();
        };
        MVVM.prototype._unload = function () {
            this.clearBindings();
            if (this._content) {
                if (logger.isTraceEnabled()) {
                    logger.trace('unload content ', this._content);
                }
                this._content.remove();
                this._content = null;
            }
            this.isLoaded(false);
        };
        MVVM.prototype.dispose = function () {
            if (logger.isTraceEnabled()) {
                logger.trace('dispose');
            }
            this.unload();
            _super.prototype.dispose.call(this);
        };
        MVVM.prototype.getContent = function () {
            return this._content;
        };
        MVVM.prototype.getView = function () {
            return this._view;
        };
        return MVVM;
    }(ViewModel_class_1.ViewModel));
    exports.MVVM = MVVM;
});
define("modules/classes/MVVMDialog.class", ["require", "exports", "modules/helpers/logger", "modules/classes/MVVM.class"], function (require, exports, logger_5, MVVM_class_1) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_5.Logger.getLogger('fr.ca.cat.MVVM');
    /** Predefined buttons to show
     * @alias Button
     * @enum {string}
     * @example _messageBox.Button.OkCancel;
     */
    exports.TDialogButtons = {
        /** The message box displays an OK button. */
        Ok: 'Ok',
        /** The message box displays OK and Cancel buttons. */
        OkCancel: 'OkCancel',
        /** The message box displays Yes, No, and Cancel buttons. */
        YesNoCancel: 'YesNoCancel',
        /** The message box displays Yes and No buttons. */
        YesNo: 'YesNo'
    };
    /** Result of a callback (using predefined buttons)
     * @alias Button
     * @enum {string}
     * @example _messageBox.Result.Ok;
     */
    exports.TDialogResults = {
        /** The message box returns no result. */
        None: 'None',
        /** The result value of the message box is OK. */
        Ok: 'Ok',
        /* The result value of the message box is Cancel. */
        Cancel: 'Cancel',
        /** The result value of the message box is Yes. */
        Yes: 'Yes',
        /** The result value of the message box is No. */
        No: 'No'
    };
    var MVVMDialog = /** @class */ (function (_super) {
        __extends(MVVMDialog, _super);
        function MVVMDialog(title, view, buttons, callback, opts) {
            if (opts === void 0) { opts = {}; }
            var _this = _super.call(this, view) || this;
            _this.title = ko.observable();
            _this.dialogOptions = {};
            _this.title(title);
            _this.callback = callback;
            _this.buttons = buttons;
            _this.dialogOptions = {
                autoOpen: true,
                modal: true,
                resizable: true,
                draggable: true,
                closeOnEscape: true,
                close: function (e, ui) {
                    if (e.originalEvent) {
                        _this.hide();
                    }
                }
            };
            _this.addOptions(opts);
            _this.title.subscribe(function (s) {
                if (_this.isAlive()) {
                    _this.getContent().dialog().parents(':first').find('.ui-dialog-title').html(s);
                }
            });
            return _this;
        }
        MVVMDialog.prototype.addOptions = function (opts) {
            if (opts === void 0) { opts = {}; }
            this.dialogOptions = $.extend(this.dialogOptions, opts || {});
        };
        MVVMDialog.prototype._show = function (fn) {
            this.result = null;
            fn = fn || function () { };
            this.getContent().dialog('open');
            fn.call(this);
        };
        MVVMDialog.prototype.getResult = function () {
            return this.result;
        };
        MVVMDialog.prototype.show = function (fn) {
            var _this = this;
            if (this.isLoaded()) {
                this._show(fn);
            }
            else {
                this.load(function () {
                    _this._show(fn);
                });
            }
            if (this.dialogOptions.zIndex) {
                this.getContent().parents(':first').css('z-index', this.dialogOptions.zIndex);
            }
            this.emit('show');
        };
        MVVMDialog.prototype.hide = function () {
            this.getContent().dialog('close');
            this.emit('close');
        };
        MVVMDialog.prototype.buildButtons = function (button) {
            var _this = this;
            var buttons = [];
            if (!button)
                return buttons;
            var strings = {};
            strings.ok = app.i18n.getObservableString("ok");
            strings.cancel = app.i18n.getObservableString("cancel");
            strings.yes = app.i18n.getObservableString("yes");
            strings.no = app.i18n.getObservableString("no");
            switch (button) {
                case exports.TDialogButtons.Ok:
                    buttons = [{
                            id: "okButton",
                            text: strings.ok(),
                            click: function () {
                                _this.result = exports.TDialogResults.Ok;
                                _this.hide();
                            }
                        }];
                    break;
                case exports.TDialogButtons.OkCancel:
                    buttons = [{
                            id: "okButton",
                            text: strings.ok(),
                            click: function () {
                                _this.result = exports.TDialogResults.Ok;
                                _this.hide();
                            }
                        }, {
                            id: "cancelButton",
                            text: strings.cancel(),
                            click: function () {
                                _this.result = exports.TDialogResults.Cancel;
                                _this.hide();
                            }
                        }];
                    break;
                case exports.TDialogButtons.YesNo:
                    buttons = [{
                            id: "yesButton",
                            text: strings.yes(),
                            click: function () {
                                _this.result = exports.TDialogResults.Yes;
                                _this.hide();
                            }
                        }, {
                            id: "noButton",
                            text: strings.no(),
                            click: function () {
                                _this.result = exports.TDialogResults.No;
                                _this.hide();
                            }
                        }];
                    break;
                case exports.TDialogButtons.YesNoCancel:
                    buttons = [{
                            id: "yesButton",
                            text: strings.yes(),
                            click: function () {
                                _this.result = exports.TDialogResults.Yes;
                                _this.hide();
                            }
                        }, {
                            id: "noButton",
                            text: strings.no(),
                            click: function () {
                                _this.result = exports.TDialogResults.No;
                                _this.hide();
                            }
                        }, {
                            id: "cancelButton",
                            text: strings.cancel(),
                            click: function () {
                                _this.result = exports.TDialogResults.Cancel;
                                _this.hide();
                            }
                        }];
                    break;
                default:
                    if ($.isPlainObject(button)) {
                        $.each(button, function (k, v) {
                            buttons.push({
                                id: k + 'Button',
                                text: app.i18n.getString(v),
                                click: function () {
                                    _this.result = k, _this.hide();
                                }
                            });
                        });
                    }
                    if ($.isArray(button)) {
                        $.each(button, function (k, v) {
                            var id = v;
                            var text = v;
                            var fn = null;
                            if ($.isPlainObject(v)) {
                                id = v.id;
                                text = v.text;
                                fn = v.fn;
                            }
                            buttons.push({
                                id: id + 'Button',
                                text: app.i18n.getString(text),
                                click: function () {
                                    if (typeof (fn) == "function") {
                                        if (!fn.call(_this)) {
                                            return;
                                        }
                                    }
                                    _this.result = id, _this.hide();
                                }
                            });
                        });
                    }
                    break;
            }
            return buttons;
        };
        MVVMDialog.prototype.centerize = function () {
            if (!this.isAlive())
                return;
            this.getContent().dialog({
                position: { my: "center", at: "center", of: window }
            });
        };
        MVVMDialog.prototype.isAlive = function () {
            var oContent_ = this.getContent();
            if (oContent_ == null) {
                return false;
            }
            return !!oContent_.dialog("instance");
        };
        MVVMDialog.prototype.isOpen = function () {
            return this.isAlive() && this.getContent().dialog("isOpen");
        };
        MVVMDialog.prototype.isVisible = function () {
            return this.isOpen();
        };
        MVVMDialog.prototype.destroy = function () {
            try {
                this.getContent().dialog("destroy");
            }
            catch (e) { }
            this.getContent().remove();
            this.clearBindings();
        };
        MVVMDialog.prototype.prepare = function () {
            var _this = this;
            _super.prototype.prepare.call(this);
            var options = this.dialogOptions;
            var buttonsList = this.buildButtons(this.buttons);
            this.getContent().dialog({
                title: this.title(),
                height: options.height || "auto",
                width: options.width || "auto",
                modal: isset(options.modal) ? options.modal : true,
                draggable: isset(options.draggable) ? options.draggable : true,
                resizable: isset(options.resizable) ? options.resizable : false,
                dialogClass: isset(options.dialogClass) ? options.dialogClass : null,
                buttons: buttonsList,
                closeOnEscape: false,
                close: function () {
                    fire(_this.callback, _this.result);
                    _this.hide();
                }
            }).dialog('moveToTop').parents(':first').find('.ui-dialog-title').html(this.title());
        };
        return MVVMDialog;
    }(MVVM_class_1.MVVM));
    exports.MVVMDialog = MVVMDialog;
});
define("modules/ui/messageBox", ["require", "exports", "modules/classes/MVVMDialog.class"], function (require, exports, MVVMDialog_class_1) {
    "use strict";
    exports.__esModule = true;
    // Count of box generated
    var _boxCount = 0;
    var MessageBox = /** @class */ (function (_super) {
        __extends(MessageBox, _super);
        function MessageBox(title, text, buttons, callback, opts) {
            var _this = _super.call(this, title, MessageBox._stringTemplate, buttons, callback) || this;
            _this.text = ko.observable();
            opts = $.extend({ resizable: false, modal: true }, opts);
            _this.addOptions(opts);
            _this.text(text);
            _this.init(opts);
            return _this;
        }
        MessageBox.prototype.init = function (opts) {
            var genId = function (counter) {
                return 'dialogBox-' + counter;
            };
            if (opts.id) {
                this.id = opts.id;
            }
            else {
                _boxCount++;
                this.id = genId(_boxCount);
            }
            this.icon = opts.icon;
        };
        MessageBox.prototype.getId = function () {
            return this.id;
        };
        /**
         * hide() alias
         */
        MessageBox.prototype.close = function () {
            this.hide();
        };
        /**
         * @Override
         */
        MessageBox.prototype.hide = function () {
            _super.prototype.hide.call(this);
            this.destroy();
        };
        /** Show an alert dialog box with button 'OK'
         * @param {string} title - The box title
         * @param {string} text - The box content text
         * @param {function} callback - The function to call when the user push the 'OK' button
         * @param {object} [context=] - Context to use with the callback
         * @param {object} [options={icon:'warn'}] - dialog box options
         * @returns dialog object
         * @example MessageBox.alert('Hello', 'Hello world !', function() { //do action });
         */
        MessageBox.alert = function (title, text, callback, options) {
            options = options || {};
            options.icon = options.icon || 'warn';
            return this.create(title || 'alert', text, MVVMDialog_class_1.TDialogButtons.Ok, callback, options);
        };
        /** Show a confirm dialog box with buttons 'OK' and 'Cancel'
         * @param {string} title - The box title
         * @param {string} text - The box content text
         * @param {function} okCallback - The function to call when the user push the 'OK' button
         * @param {function} cancelCallback - The function to call when the user push the 'Cancel' button
         * @param {object} [context=] - Context to use with the callback
         * @param {object} [options={icon: 'help'}] - dialog box options
         * @returns dialog object
         * @example MessageBox.confirm('Hello', 'Hello world !', function() { //do action }, function() { //do action });
         * @example MessageBox.confirm('Hello', 'Hello world!', function(result) {
         *      if(result == _messageBox.Result.Ok) {
         *          // do Ok
         *      } else {
         *          // do Cancel
         *      }
         * };
         */
        MessageBox.confirm = function (title, text, okCallback, cancelCallback, options) {
            options = options || {};
            options.icon = options.icon || 'help';
            return this.create(title || 'confirm', text, MVVMDialog_class_1.TDialogButtons.YesNo, function (result) {
                if (result == MVVMDialog_class_1.TDialogResults.Yes) {
                    fire(okCallback);
                    return;
                }
                if (result == MVVMDialog_class_1.TDialogResults.No || result == MVVMDialog_class_1.TDialogResults.None) {
                    fire(cancelCallback);
                    return;
                }
            }, options);
        };
        /** Show a custom dialog box
         * @param {string} text - The box content text
         * @param {string} title - The box title
         * @param {array|Object|Enum=} [button=Button.Ok] - Button(s) to show
         * @param {function} callback - The function to call when the user push a button
         * @param {object} [context=] - Context to use with the callback
         * @param {object} [opts=] - dialog box options
         * @returns dialog object
         * @see oneesp.module.commons.messageBox#Alert
         * @see oneesp.module.commons.messageBox#Confirm
         * @example
         * /// Show an OkCancel message box
         * _messageBox.show('Hello world !', 'Hello', _messageBox.Button.OkCancel, function(result) {
         *      if(result == _messageBox.Result.Ok) {
         *          // do Ok
         *      } else {
         *          // do Cancel
         *      }
         * });
         * @example
         * // Show a message box with custom 'confirm' and 'unconfirm' buttons (labels will be autotrad based on the _i18n)
         * _messageBox.show('Hello world !', 'Hello',['confirm','unconfirm'], function(result) {
         *      if(result == 'confirm') {
         *          // do Confirm
         *      } else {
         *          // do Unconfirm
         *      }
         * });
         * @example
         * // Show a message box with custom 'confirm' and 'unconfirm' buttons (labels will be autotrad based on the _i18n)
         * let buttons = {'confirm':'Yes, I confirm', 'unconfirm':'No, I do not confirm'];
         * MessageBox.create('Hello world !', 'Hello', buttons, function(result) {
         *      if(result == 'confirm') {
         *          // do Confirm
         *      } else {
         *          // do Unconfirm
         *      }
         * });
         */
        MessageBox.create = function (title, text, buttons, callback, opts) {
            var oMessageBox_ = new MessageBox(title, text, buttons, callback, opts);
            oMessageBox_.show();
            return oMessageBox_;
        };
        /** Show a popin box
         * @param {string} text - The box content text
         * @param {string} [messageType='info'] - The message type ('info', 'error', 'warn')
         * @param {int} [timeout=2000] - The visibility delay before auto hide the popin in milliseconds (set to <code>0</code> to disable auto hide delay).
         * If not timeout is clearly specified, the popin will not be hidden when the <code>messageType</code> is equals to 'error'.
         * @example MessageBox.popin('Hello world !'); // Show an info popin during 2 seconds
         * @example MessageBox.popin('Hello world !', 'info', 0); // Show an info popin. Auto hide is disabled
         * @example MessageBox.popin('Hello world !', 'error'); // Show an error popin. Auto hide is disabled
         * @example MessageBox.popin('Hello world !', 'error', 1000); // Show an error popin during only 1 second
         */
        MessageBox.popin = function (text, messageType, timeout) {
            var localeText = app.i18n.getString(text);
            timeout = !isNaN(timeout) ? timeout : (messageType == 'error' ? 0 : 2000);
            messageType = messageType || 'info';
            var $template = $(MessageBox._popinTemplate);
            var close = function () {
                $template.fadeOut('fast', function () {
                    // Remove from body
                    $template.remove();
                });
            };
            // Push text
            $template.attr('data-type', messageType);
            $template.find('.ui-ico-status').attr('data-icon', messageType);
            $template.find('.text').html(localeText);
            // Append to body
            $template.appendTo($('body')).on('click.popin', function () {
                close();
            });
            if (timeout > 0) {
                setTimeout(function () {
                    close();
                }, timeout);
            }
        };
        // The box template
        MessageBox._stringTemplate = '<div data-bind="attr:{id: id}" class="ui-messagebox-content"><span class="ui-ico-status x-large" data-bind="visible: icon, attr: { \'data-icon\': icon}">&nbsp;</span><pre class="ui-text" data-bind="text: text"></pre></div>';
        // The popin template
        MessageBox._popinTemplate = '<div class="ui-popin" data-type=""><span class="ui-ico-status small" data-icon=""></span><span class="text"></span></div>';
        return MessageBox;
    }(MVVMDialog_class_1.MVVMDialog));
    exports.MessageBox = MessageBox;
});
define("modules/classes/Application.class", ["require", "exports", "modules/helpers/logger", "modules/helpers/browser", "modules/managers/i18n", "modules/forms/SelectField", "modules/classes/EventsBinder.class", "modules/classes/AppManager.class", "modules/ui/messageBox", "modules/classes/MVVMDialog.class", "modules/helpers/query"], function (require, exports, logger_6, browser_1, i18n_1, SelectField_1, EventsBinder_class_4, AppManager_class_1, messageBox_1, MVVMDialog_class_2, query_5) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_6.Logger.getLogger('Application');
    var Application = /** @class */ (function (_super) {
        __extends(Application, _super);
        function Application(lang) {
            if (lang === void 0) { lang = "en"; }
            var _this = _super.call(this) || this;
            _this.title = ko.observable();
            _this.isReady = ko.observable(false);
            _this.manager = new AppManager_class_1.AppManager();
            _this.useDialog = false;
            _this.servicesPath = "";
            _this.configuration = null;
            _this.onAjaxSend = null;
            window.app = _this;
            var location = window.location;
            _this.servicesPath = location.protocol + "//" + location.host + "/";
            _this.browser = new browser_1.Browser();
            _this.i18n = _this.manager.register('i18n', new i18n_1.I18n(lang));
            return _this;
        }
        Application.prototype.getVersion = function () {
            return this.configuration.version;
        };
        Application.prototype.getFinalFileName = function (fileName) {
            if (this.getVersion()) {
                fileName += (fileName.indexOf('?') == -1 ? '?' : '&') + '_v=' + encodeURIComponent(this.getVersion());
            }
            return fileName;
        };
        Application.prototype.goto = function (uri) {
            this.navigateTo(app.servicesPath + uri);
        };
        Application.prototype.navigateTo = function (href) {
            this.emit('navigate', href);
            window.location.assign(href);
        };
        /* Redirige l'internaute vers une url en méthode POST */
        Application.prototype.postRedirect = function (url, data_post, target, data_get) {
            if (target === void 0) { target = "_blank"; }
            if (data_get === void 0) { data_get = null; }
            var idForm = "kopostform";
            var urlDataPrefix = "";
            if (!url)
                return;
            if (url.indexOf("?") == -1) {
                urlDataPrefix = "?";
            }
            $.each(data_get || {}, function (k, v) {
                url += urlDataPrefix + encodeURIComponent(k) + "=" + encodeURIComponent(v);
                urlDataPrefix = "&";
            });
            var sDataForm = "";
            $.each(data_post || {}, function (k, v) {
                sDataForm += "<input type='hidden' name='" + k + "' value='" + v + "'>";
            });
            var $form = $("#" + idForm);
            if ($form.length > 0) {
                $form.attr("action", url);
                $form.html(sDataForm);
            }
            else {
                $("body").append("<form id='" + idForm + "' action='" + url + "' method='POST' target='" + target + "'>" + sDataForm + "</form>");
            }
            $("#" + idForm).submit();
        };
        Application.prototype.ready = function (fn, context) {
            if (this.isReady()) {
                fn.call(context, fn);
            }
            else {
                this.isReady.subscribe(function (b) {
                    if (b) {
                        fn.call(context, fn);
                    }
                });
            }
        };
        /**
         * Boîte de dialogue neutre
         */
        Application.prototype.dialog = function (title, text, buttons, callback, opts) {
            if (buttons === void 0) { buttons = MVVMDialog_class_2.TDialogButtons.Ok; }
            return messageBox_1.MessageBox.create(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), buttons, callback, opts);
        };
        /**
         * Boîte de message d'alerte
         */
        Application.prototype.alert = function (title, text, callbackAlert, opts) {
            return messageBox_1.MessageBox.alert(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), callbackAlert, opts);
        };
        /**
         * Boîte de message de confirmation
         */
        Application.prototype.confirm = function (title, text, callbackOk, callbackCancel, opts) {
            return messageBox_1.MessageBox.confirm(app.i18n.getString(title, app.title()), app.i18n.getString(text, text), callbackOk, callbackCancel, opts);
        };
        /**
         * Affiche la bar pour acceptation des cookies
         */
        Application.prototype.showCookieBar = function (options) {
            var opts = {
                message: this.i18n.getString('app.plugins.cookieBar.message'),
                acceptText: this.i18n.getString('app.plugins.cookieBar.acceptText'),
                declineText: this.i18n.getString('app.plugins.cookieBar.declineText'),
                acceptButton: true,
                zindex: 9999999,
                fixed: true,
                bottom: true,
                domain: this.servicesPath,
                forceShow: true
            };
            if (this.configuration && this.configuration.plugins && typeof (this.configuration.plugins.cookieBar.options) == 'object') {
                opts = $.extend(opts, this.configuration.plugins.cookieBar.options);
            }
            if (typeof (options) == 'object') {
                opts = $.extend(opts, options);
            }
            $.cookieBar(opts);
        };
        /**
         * Envoi d'un email
         */
        Application.prototype.mailto = function (data) {
            var to;
            var cc;
            var bcc;
            var subject;
            var body;
            if (typeof (data) == "string") {
                to = data;
            }
            else {
                to = data['to'];
                cc = data['cc'];
                subject = data['subject'];
                bcc = data['bcc'];
                body = data['body'];
            }
            app.navigateTo("mailto:" + to + "?"
                + (cc ? "cc=" + cc + "&" : "")
                + (subject ? "subject=" + subject + "&" : "")
                + (bcc ? "bcc=" + bcc + "&" : "")
                + (body ? "body=" + body : ""));
        };
        Application.prototype.initEvents = function () {
            /**
             * jquery events
             */
            // push event keydown when user do a drag&drop
            $(document).on('dragend drop', 'input', function () {
                $(this).trigger('keydown');
            });
            // Fix bug on Firefox : ESC close web socket...
            $(window).keydown(function (event) {
                // check for escape key
                if (event.which == 27) {
                    // the following seems to fix the symptom but
                    // only in case the document has the focus
                    event.preventDefault();
                }
            });
        };
        Application.prototype.initManagers = function () {
            var _this = this;
            logger.info("Initialize app managers");
            var managersId = [];
            $.each(this.manager.getManagers(), function (id, manager) {
                if (logger.isDebugEnabled()) {
                    logger.debug("Initialize manager '" + id + "'");
                }
                managersId.push(id);
                manager.init();
                manager.on('initError', function () {
                    _this.emit('initManagerError', manager);
                });
            });
            app.manager.ready(managersId, function () {
                _this.isReady(true);
            });
        };
        Application.prototype.init = function (conf) {
            var _this = this;
            this.configuration = $.extend({
                logConsole: true
            }, conf || {});
            // First, set loggers
            var logLevel = isset(this.configuration.logLevel) ? this.configuration.logLevel : logger_6.TLogLevel.DEBUG;
            logger_6.Logger.getDefaultLogger().level(logLevel);
            if (this.configuration.logConsole === true) {
                logger_6.Logger.getDefaultLogger().addAppender(new logger_6.ConsoleAppender());
            }
            if (this.configuration.remoteLogUri) {
                var remoteAppender = new logger_6.RemoteAppender(this.servicesPath + this.configuration.remoteLogUri + this.configuration.context.page);
                remoteAppender.level = logger_6.TLogLevel.ERROR;
                logger_6.Logger.getDefaultLogger().addAppender(remoteAppender);
            }
            this.emit('init');
            logger.info("Initialize app");
            query_5.Query.defaultOptions.upToDate = true;
            if (!window.location.origin) {
                var location_1 = window.location;
                location_1.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
            }
            // Filter url queries
            $(document).ajaxSend(function (event, jqxhr, settings) {
                if (typeof (_this.onAjaxSend) == "function") {
                    _this.onAjaxSend(settings, jqxhr);
                }
                settings.url = _this.getFinalFileName(settings.url);
            });
            this.initEvents();
            if (this.configuration.httpSafeMethods === true) {
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    if (options.type != 'GET' && options.type != 'POST') {
                        logger.debug("Replace HTTP method '" + options.type + "' by 'POST' into header X-HTTP-Method-Override");
                        jqXHR.setRequestHeader('X-HTTP-Method-Override', options.type);
                        options.type = 'POST';
                    }
                });
            }
            if (this.configuration.jetonCSRF) {
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    logger.debug("Add CSRF token into header X-CSRF");
                    jqXHR.setRequestHeader('X-CSRF', _this.configuration.jetonCSRF);
                });
            }
            if (this.configuration.browsers) {
                this.browser.setSupportedVersions(this.configuration.browsers);
                this.browser.check(function (result, browserInfo) {
                    _this.emit('initBrowserVerification', result, browserInfo);
                });
            }
            if (this.configuration.plugins && this.configuration.plugins.cookieBar) {
                var enableCookieBar = this.configuration.plugins.cookieBar === true || this.configuration.plugins.cookieBar.enabled === true;
                if (enableCookieBar) {
                    this.ready(function () {
                        _this.showCookieBar({ forceShow: false });
                    });
                }
            }
            if (this.configuration.useNativeDialogSelect === false) {
                this.disabledNativeDialogSelect();
            }
            if (this.configuration.scrollDetection) {
                if (this.configuration.scrollDetection.enabled === true || !isset(this.configuration.scrollDetection.enabled)) {
                    this.enableScrollDetection(this.configuration.scrollDetection);
                }
            }
            this.initManagers();
        };
        Application.prototype.disabledNativeDialogSelect = function () {
            logger.debug('Disable native dialog');
            SelectField_1.SelectField.useNativeDialogSelect(false);
        };
        Application.prototype.enableScrollDetection = function (params) {
            logger.debug('Scroll detection active');
            var owner = params.owner || 'body';
            var timeout = params.timeout || 200;
            var scrollTempo_;
            var self = this;
            var friseScrollFunction = function (e) {
                var $document = $(document);
                var $app = $(owner);
                if (!$app.hasClass('scrolling')) {
                    self.emit('scrollstart');
                    $app.addClass('scrolling');
                }
                if ($document.scrollTop() > 0) {
                    $app.addClass('scrolled');
                }
                else {
                    $app.removeClass('scrolled');
                }
                if (scrollTempo_) {
                    clearTimeout(scrollTempo_);
                }
                scrollTempo_ = defer(function () {
                    $document.trigger('scrollstop');
                    self.emit('scrollstop');
                }, timeout);
            };
            $(window).on('scroll.scrollDetection', friseScrollFunction); // IE8 OK (et le reste du monde)
            $(window).on('resize.scrollDetection', friseScrollFunction);
            $(document).on('ready.scrollDetection scrollstop.scrollDetection', function () {
                var $document = $(document);
                $(owner).removeClass('scrolling');
            });
        };
        return Application;
    }(EventsBinder_class_4.EventsBinder));
    exports.Application = Application;
    function alert(text, callbackAlert, opts) {
        if (app.useDialog) {
            return messageBox_1.MessageBox.alert(app.title(), text, callbackAlert, opts);
        }
        var r = window.alert(text);
        fire(callbackAlert, r);
        return r;
    }
    exports.alert = alert;
    function confirm(text, callbackOk, callbackCancel, opts) {
        if (app.useDialog) {
            return messageBox_1.MessageBox.confirm(app.title(), text, callbackOk, callbackCancel, opts);
        }
        var r = window.confirm(text);
        if (r && callbackOk) {
            fire(callbackOk, r);
        }
        if (!r && callbackCancel) {
            fire(callbackCancel, r);
        }
        return r;
    }
    exports.confirm = confirm;
});
define("modules/classes/GroupFields.class", ["require", "exports", "modules/forms/InputField"], function (require, exports, InputField_2) {
    "use strict";
    exports.__esModule = true;
    var GroupFields = /** @class */ (function (_super) {
        __extends(GroupFields, _super);
        function GroupFields(id, fields, showLabel) {
            if (fields === void 0) { fields = []; }
            if (showLabel === void 0) { showLabel = true; }
            var _this = _super.call(this, id, showLabel) || this;
            _this.fields = ko.observableArray();
            _this.hasBeenVisited = ko.observable(false);
            _this.hasBeenVisitedTrigger = false;
            _this.isRequired = _this.createComputedBoolean('isRequired', true);
            _this.isReadOnly = _this.createComputedBoolean('isReadOnly', true, true);
            _this.isDisabled = _this.createComputedBoolean('isDisabled', true, true);
            _this.isVisible = _this.createComputedBoolean('isVisible', true);
            _this.isEditable = _this.createComputedBoolean('isEditable', true);
            _this.isFocused = _this.createComputedBoolean('isFocused', true, false, 50);
            _this.hasChanged = _this.createComputedBoolean('hasChanged', true);
            _this.hasWarns = _this.createComputedBoolean('hasWarns', true);
            //this.hasBeenVisited = this.createComputedBoolean('hasBeenVisited', true);
            _this.computedMessages = _this.createComputedMessages();
            _this.isLastInputValid = ko.computed(function () {
                return _this.readBoolean('isLastInputValid', true, true);
            });
            _this.isFormValid = ko.computed(function () {
                return _this.readBoolean('isFormValid', true, true) && _this.isConstraintsValid();
            });
            _this.isEmpty = ko.computed(function () {
                return _this.readBoolean('isEmpty', true, true);
            });
            _this.isFocused.subscribe(function (v) {
                if (!v) {
                    defer(function () {
                        _this.hasBeenVisited(true);
                    });
                }
            });
            _this.fields(fields || []);
            _this.enableNVisibleFields = ko.computed(function () {
                return _this.fields().filter(function (val) {
                    return val.isVisible();
                });
            });
            _this.lengthOfEnableNVisibleFields = ko.computed(function () {
                return _this.enableNVisibleFields().length;
            });
            return _this;
        }
        GroupFields.prototype.addField = function (PE_oField) {
            this.fields.push(PE_oField);
        };
        GroupFields.prototype.removeAll = function () {
            this.fields.removeAll();
        };
        GroupFields.prototype.createComputedBoolean = function (subscribableName, testValue, allCombined, throttle) {
            var _this = this;
            if (allCombined === void 0) { allCombined = false; }
            if (throttle === void 0) { throttle = null; }
            return ko.computed({
                read: function () {
                    return _this.readBoolean(subscribableName, testValue, allCombined);
                },
                write: function (b) {
                    _this.writeBoolean(subscribableName, b);
                }
            }).extend({ throttle: throttle });
        };
        GroupFields.prototype.createComputedMessages = function () {
            var _this = this;
            return ko.computed(function () {
                var fields = _this.fields();
                var len = fields.length;
                var ary = [];
                for (var i = 0; i < len; i++) {
                    var field = fields[i];
                    ary = ary.concat(field.messages());
                }
                ary = ary.concat(_this.messages());
                return ary;
            }, this);
        };
        GroupFields.prototype.readBoolean = function (subscribableName, testValue, allCombined) {
            if (testValue === void 0) { testValue = false; }
            if (allCombined === void 0) { allCombined = false; }
            var fields = this.fields();
            var len = fields.length;
            var isValid = !testValue;
            for (var i = 0; i < len; i++) {
                var field = fields[i];
                if (field[subscribableName].call(field) == testValue) {
                    isValid = true;
                    if (!allCombined) {
                        break;
                    }
                }
                else {
                    if (allCombined) {
                        isValid = false;
                        break;
                    }
                }
            }
            return isValid;
        };
        GroupFields.prototype.writeBoolean = function (subscribableName, v) {
            this.runFunction(subscribableName, v);
        };
        GroupFields.prototype.runFunction = function (functionName, args) {
            if (args === void 0) { args = null; }
            var fields = this.fields();
            var len = fields.length;
            for (var i = 0; i < len; i++) {
                var field = fields[i];
                field[functionName].call(field, args);
            }
        };
        GroupFields.prototype.applyChanges = function () {
            this.runFunction('applyChanges');
        };
        GroupFields.prototype.cancelChanges = function () {
            this.runFunction('cancelChanges');
        };
        /**
         * Libère correctement la mémoire
         */
        GroupFields.prototype.dispose = function () {
            dispose(this.isLastInputValid);
            dispose(this.isRequired);
            dispose(this.isReadOnly);
            dispose(this.hasChanged);
            dispose(this.isVisible);
            dispose(this.isDisabled);
            dispose(this.isEditable);
            dispose(this.isEmpty);
            dispose(this.isFormValid);
            dispose(this.isFocused);
            dispose(this.computedMessages);
        };
        return GroupFields;
    }(InputField_2.BaseField));
    exports.GroupFields = GroupFields;
});
define("modules/classes/FieldsValidatorDigest.class", ["require", "exports", "modules/forms/InputField", "modules/classes/GroupFields.class"], function (require, exports, InputField_3, GroupFields_class_1) {
    "use strict";
    exports.__esModule = true;
    var FieldsValidatorDigest = /** @class */ (function (_super) {
        __extends(FieldsValidatorDigest, _super);
        function FieldsValidatorDigest(fields, messagesArgs, inspectChilds) {
            if (fields === void 0) { fields = []; }
            if (messagesArgs === void 0) { messagesArgs = {}; }
            if (inspectChilds === void 0) { inspectChilds = true; }
            var _this = _super.call(this, null, fields) || this;
            _this.messagesArgs = ko.observable();
            _this.inspectChilds = ko.observable(true);
            _this.messagesArgs(messagesArgs);
            _this.inspectChilds(inspectChilds);
            _this._computed = ko.computed(function () {
                var fields = _this.fields();
                var messagesArgs = _this.messagesArgs();
                var isRecursive = _this.inspectChilds();
                _this.treatListOfFields(fields, messagesArgs, isRecursive);
            }).extend({ throttle: 0 });
            return _this;
        }
        /**
         * Ajoute un champ au validateur
         */
        FieldsValidatorDigest.prototype.addField = function (field) {
            this.fields.push(field);
        };
        FieldsValidatorDigest.prototype.addFields = function (fields) {
            if (fields === void 0) { fields = []; }
            var oListOfIFieldArray_ = this.fields() || [];
            this.fields(oListOfIFieldArray_.concat(fields));
        };
        FieldsValidatorDigest.prototype.treatListOfFields = function (oListOfIFieldArray, messagesArgs, bRecursive) {
            var len = oListOfIFieldArray.length;
            for (var i = 0; i < len; i++) {
                var field = oListOfIFieldArray[i];
                var observable = null;
                field.messages.removeAll();
                var input = field;
                var isContraintsTriggered = false;
                if (input.unvalidatedConstraints) {
                    var oUnvalidatedConstraintsList_ = input.unvalidatedConstraints();
                    for (var j = 0, len2 = oUnvalidatedConstraintsList_.length; j < len2; j++) {
                        var validationConstraint = oUnvalidatedConstraintsList_[j];
                        if (!validationConstraint.isWarn) {
                            isContraintsTriggered = true;
                        }
                        if (validationConstraint.name) {
                            var str = "";
                            var strId = field.id + '.constraints.' + validationConstraint.name;
                            if (typeof (validationConstraint.messageFn) == 'function') {
                                str = validationConstraint.messageFn.call(input, strId);
                            }
                            else {
                                observable = app.i18n.getObservableString(strId);
                                str = observable();
                            }
                            var message = utils.formatString(str, messagesArgs);
                            field.messages.push(new InputField_3.InputFieldMessage(message, validationConstraint.isWarn));
                        }
                    }
                }
                if (!field.isFormValid() && !isContraintsTriggered) {
                    if (field.isEmpty() && field.isRequired()) {
                        observable = app.i18n.getObservableString(field.id + '.required', 'form.field.required');
                    }
                    else {
                        observable = app.i18n.getObservableString(field.id + '.invalid', 'form.field.invalid');
                    }
                    var message = utils.formatString(observable(), messagesArgs);
                    field.messages.push(new InputField_3.InputFieldMessage(message));
                }
                if (field.oListOfField && bRecursive) {
                    // Traitement récursifs des enfants
                    this.treatListOfFields(field.oListOfField(), messagesArgs, bRecursive);
                }
            }
        };
        FieldsValidatorDigest.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            dispose(this.messagesArgs);
            dispose(this._computed);
        };
        return FieldsValidatorDigest;
    }(GroupFields_class_1.GroupFields));
    exports.FieldsValidatorDigest = FieldsValidatorDigest;
});
define("modules/classes/ResponsiveViewModel.class", ["require", "exports", "modules/helpers/logger", "modules/classes/ViewModel.class"], function (require, exports, logger_7, ViewModel_class_2) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_7.Logger.getLogger('MVVM');
    var ResponsiveViewModel = /** @class */ (function (_super) {
        __extends(ResponsiveViewModel, _super);
        function ResponsiveViewModel(stringsToRegister) {
            var _this = _super.call(this, stringsToRegister) || this;
            _this.normalWidth = 1200;
            _this.tabletWidth = 768;
            _this.bigTabletWidth = 992;
            _this.isMobile = ko.observable(false);
            _this.isTablet = ko.observable(false);
            _this.isNormal = ko.observable(true);
            _this.isBigTablet = ko.observable(false);
            $(document).ready(function () {
                var resizeFn_ = function () {
                    var innerWidth = window.innerWidth;
                    if (!innerWidth) {
                        if (document.body && document.body.offsetWidth) {
                            innerWidth = document.body.offsetWidth;
                        }
                        if (document.compatMode == 'CSS1Compat' &&
                            document.documentElement &&
                            document.documentElement.offsetWidth) {
                            innerWidth = document.documentElement.offsetWidth;
                        }
                    }
                    if (innerWidth >= _this.normalWidth) {
                        _this.isTablet(false);
                        _this.isMobile(false);
                        _this.isNormal(true);
                        _this.isBigTablet(false);
                    }
                    else if (innerWidth < _this.normalWidth && innerWidth >= _this.bigTabletWidth) {
                        _this.isMobile(false);
                        _this.isNormal(false);
                        _this.isTablet(true);
                        _this.isBigTablet(true);
                    }
                    else if (innerWidth < _this.normalWidth && innerWidth >= _this.tabletWidth) {
                        _this.isMobile(false);
                        _this.isNormal(false);
                        _this.isTablet(true);
                        _this.isBigTablet(false);
                    }
                    else if (innerWidth < _this.tabletWidth) {
                        _this.isTablet(false);
                        _this.isNormal(false);
                        _this.isMobile(true);
                        _this.isBigTablet(false);
                    }
                };
                resizeFn_();
                $(window).bind('resize', function (e) {
                    resizeFn_();
                    _this.emit('resize');
                });
            });
            return _this;
        }
        return ResponsiveViewModel;
    }(ViewModel_class_2.ViewModel));
    exports.ResponsiveViewModel = ResponsiveViewModel;
});
define("modules/classes/ScreenSequence.class", ["require", "exports", "modules/classes/GroupFields.class"], function (require, exports, GroupFields_class_2) {
    "use strict";
    exports.__esModule = true;
    var ScreenSequence = /** @class */ (function (_super) {
        __extends(ScreenSequence, _super);
        function ScreenSequence(id, templateName, fields, data, animationIn, animationOut, animationError) {
            if (data === void 0) { data = {}; }
            if (animationIn === void 0) { animationIn = ScreenSequence.defaultAnimationIn; }
            if (animationOut === void 0) { animationOut = ScreenSequence.defaultAnimationOut; }
            if (animationError === void 0) { animationError = ScreenSequence.defaultAnimationError; }
            var _this = _super.call(this, null, fields) || this;
            _this.templateName = ko.observable();
            _this.isSubmited = ko.observable(false);
            _this.id = id;
            _this.data = data;
            _this.animationIn = animationIn;
            _this.animationOut = animationOut;
            _this.animationError = animationError;
            _this.templateName(templateName);
            return _this;
        }
        ScreenSequence.prototype.show = function () {
            this.emit('show');
            return true;
        };
        ScreenSequence.prototype.hide = function () {
            this.emit('hide');
            return true;
        };
        ScreenSequence.prototype.beforeSubmit = function () {
            return true;
        };
        ScreenSequence.prototype.submit = function () {
            this.isSubmited(true);
            this.emit('validate');
            if (this.isFormValid()) {
                this.emit('submit');
                return true;
            }
            return false;
        };
        ScreenSequence.prototype.afterRender = function () {
            this.emit('afterRender');
        };
        ScreenSequence.defaultAnimationIn = 'appear';
        ScreenSequence.defaultAnimationOut = 'disappear';
        ScreenSequence.defaultAnimationError = { animation: 'shake', whenAppear: false };
        return ScreenSequence;
    }(GroupFields_class_2.GroupFields));
    exports.ScreenSequence = ScreenSequence;
    var ScreenSequenceView = /** @class */ (function (_super) {
        __extends(ScreenSequenceView, _super);
        function ScreenSequenceView(id, templateName, data, animationIn, animationOut, animationError) {
            if (data === void 0) { data = {}; }
            if (animationIn === void 0) { animationIn = ScreenSequence.defaultAnimationIn; }
            if (animationOut === void 0) { animationOut = ScreenSequence.defaultAnimationOut; }
            if (animationError === void 0) { animationError = ScreenSequence.defaultAnimationError; }
            var _this = _super.call(this, id, templateName, null, data, animationIn, animationOut, animationError) || this;
            // @Override
            _this.isVisible = ko.observable(true);
            return _this;
        }
        return ScreenSequenceView;
    }(ScreenSequence));
    exports.ScreenSequenceView = ScreenSequenceView;
});
define("modules/classes/Sequence.class", ["require", "exports", "modules/classes/EventsBinder.class"], function (require, exports, EventsBinder_class_5) {
    "use strict";
    exports.__esModule = true;
    var Sequence = /** @class */ (function (_super) {
        __extends(Sequence, _super);
        function Sequence(screens, transitionDelay) {
            if (transitionDelay === void 0) { transitionDelay = 0; }
            var _this = _super.call(this) || this;
            _this.hashScreen = ko.observable();
            _this.screens = ko.observableArray();
            _this.transitionDelay = 0;
            _this.currentScreen = ko.observable();
            _this.currentAnimation = ko.observable();
            _this.hasNext = ko.observable();
            _this.hasPrevious = ko.observable();
            _this.nextScreen = ko.observable();
            _this.previousScreen = ko.observable();
            _this.transitionDelay = transitionDelay;
            _this.schema = ko.computed(function () {
                var tScreens = _this.screens();
                var rScreens = [];
                for (var i = 0; i < tScreens.length; i++) {
                    var oScreen_ = tScreens[i];
                    if (oScreen_.isVisible()) {
                        rScreens.push(oScreen_);
                    }
                }
                return rScreens;
            });
            _this.currentScreenId = ko.computed(function () {
                return _this.currentScreen() ? _this.currentScreen().id : null;
            });
            _this.currentScreen.immediateSubscribe(function (screen) {
                _this.updateDependencies(screen);
                if (screen) {
                    screen.show();
                    _this.emit('show', screen);
                }
            });
            _this.schema.subscribe(function (v) {
                _this.updateDependencies();
            });
            _this.hashScreen.subscribe(function (screenId) {
                if (screenId) {
                    var tScreens = _this.schema();
                    var screen_1;
                    if (screenId == "first") {
                        screen_1 = tScreens.first();
                    }
                    else if (screenId == "last") {
                        screen_1 = tScreens.last();
                    }
                    else {
                        screen_1 = tScreens.findBy('id', screenId);
                    }
                    if (!screen_1) {
                        screen_1 = _this.getFirstScreenToComplete();
                    }
                    var oCurrentScreen_ = _this.currentScreen();
                    if (oCurrentScreen_) {
                        _this.hide();
                    }
                    if (screen_1) {
                        defer(function () {
                            _this.currentAnimation(screen_1.animationIn);
                            _this.currentAnimation.valueHasMutated();
                            _this.currentScreen(screen_1);
                        }, oCurrentScreen_ ? _this.transitionDelay : 0);
                    }
                    else {
                        _this.emit('404', screenId);
                    }
                }
            });
            if (screens) {
                _this.screens(screens);
            }
            return _this;
        }
        /**
         * Hide current screen
         */
        Sequence.prototype.hide = function () {
            var currentScreen = this.currentScreen();
            if (currentScreen) {
                if (currentScreen.hide()) {
                    this.currentAnimation(currentScreen.animationOut);
                    this.currentAnimation.valueHasMutated();
                    this.emit('hide', currentScreen);
                    return true;
                }
            }
            return false;
        };
        Sequence.prototype.end = function () {
            this.hide();
            this.hashScreen('');
            this.currentScreen(null);
        };
        Sequence.prototype.getScreenById = function (id) {
            return this.screens().findBy('id', id);
        };
        Sequence.prototype.updateDependencies = function (screen) {
            var indexOfScreen = this.getCurrentIndexOfScreen(screen);
            var tScreens = this.schema();
            this.hasPrevious(indexOfScreen > 0);
            this.hasNext(indexOfScreen < tScreens.length - 1);
            if (this.hasPrevious()) {
                this.previousScreen(tScreens[indexOfScreen - 1]);
            }
            else {
                this.previousScreen(null);
            }
            if (this.hasNext()) {
                this.nextScreen(tScreens[indexOfScreen + 1]);
            }
            else {
                this.nextScreen(null);
            }
        };
        Sequence.prototype.getFirstScreenToComplete = function () {
            var tScreens = this.schema();
            return this.getFirstDependentScreenTo(tScreens.last());
        };
        Sequence.prototype.link = function (pname, updateUri, defaultScreenId) {
            if (updateUri === void 0) { updateUri = true; }
            ko.linkObservableToUrl(this.hashScreen, pname);
            if (updateUri) {
                $.address.update();
            }
            if (!this.hashScreen() && defaultScreenId !== false) {
                return this.show(defaultScreenId);
            }
            return this.hashScreen();
        };
        /**
         * Start sequence
         */
        Sequence.prototype.start = function () {
            var tScreens = this.schema();
            if (tScreens.length > 0) {
                this.show(tScreens[0]);
                return true;
            }
            return false;
        };
        Sequence.prototype.refresh = function () {
            this.hashScreen.valueHasMutated();
        };
        Sequence.prototype.getFirstDependentScreenTo = function (screen) {
            var tScreens = this.schema();
            var indexOfScreen = -1;
            if (screen) {
                indexOfScreen = tScreens.indexOf(screen);
            }
            for (var i = 0; i < indexOfScreen; i++) {
                var screenRel = tScreens[i];
                if (!screenRel.isFormValid()) {
                    return screenRel;
                }
            }
            return screen;
        };
        Sequence.prototype.getCurrentIndexOfScreen = function (screen) {
            if (screen === void 0) { screen = this.currentScreen(); }
            var tScreens = this.schema();
            var indexOfScreen = -1;
            if (screen) {
                indexOfScreen = tScreens.indexOf(screen);
            }
            return indexOfScreen;
        };
        Sequence.prototype.afterRender = function () {
            var screen = this.currentScreen();
            if (screen) {
                screen.afterRender();
                this.emit('afterRender', screen);
            }
        };
        Sequence.prototype.submit = function () {
            var screen = this.currentScreen();
            if (!screen) {
                return false;
            }
            if (screen && !screen.beforeSubmit()) {
                return false;
            }
            if (screen.submit()) {
                this.emit('submit', screen);
                return true;
            }
            else {
                this.emit('submitFailed', screen);
                if (screen.animationError) {
                    this.currentAnimation(screen.animationError);
                    this.currentAnimation.valueHasMutated();
                }
                return false;
            }
        };
        Sequence.prototype.beforeNext = function (screen, next) {
            return true;
        };
        Sequence.prototype.next = function () {
            var screen = this.currentScreen();
            var nextScreen = this.nextScreen();
            if (screen && !this.beforeNext(screen, nextScreen)) {
                return false;
            }
            if (nextScreen) {
                this.emit('next', nextScreen);
                this.show(nextScreen);
                return true;
            }
            else {
                this.emit('end');
            }
            return false;
        };
        Sequence.prototype.beforePrevious = function (screen, prev) {
            return true;
        };
        Sequence.prototype.previous = function () {
            var screen = this.currentScreen();
            var previousScreen = this.previousScreen();
            if (screen && !this.beforePrevious(screen, previousScreen)) {
                return false;
            }
            if (previousScreen) {
                this.emit('previous', previousScreen);
                this.show(previousScreen);
                return true;
            }
            return false;
        };
        Sequence.prototype.findById = function (id) {
            var tScreens = this.schema();
            return tScreens.findBy('id', id);
        };
        Sequence.prototype.show = function (screen) {
            if (!screen) {
                this.start();
                return;
            }
            if (typeof (screen) == "string") {
                screen = this.findById(screen);
            }
            if (this.hashScreen.peek() == screen.id) {
                this.hashScreen.valueHasMutated();
            }
            else {
                this.hashScreen(screen.id);
            }
            return this.hashScreen();
        };
        return Sequence;
    }(EventsBinder_class_5.EventsBinder));
    exports.Sequence = Sequence;
});
define("modules/classes/Template.class", ["require", "exports", "modules/classes/EventsBinder.class"], function (require, exports, EventsBinder_class_6) {
    "use strict";
    exports.__esModule = true;
    var Template = /** @class */ (function (_super) {
        __extends(Template, _super);
        function Template(templateName) {
            var _this = _super.call(this) || this;
            _this.templateName = ko.observable();
            _this.templateName(templateName);
            return _this;
        }
        Template.prototype.dispose = function () {
            dispose(this.templateName);
        };
        return Template;
    }(EventsBinder_class_6.EventsBinder));
    exports.Template = Template;
});
define("modules/classes/_QueryPolling.class", ["require", "exports", "modules/helpers/query", "modules/classes/EventsBinder.class"], function (require, exports, query_6, EventsBinder_class_7) {
    "use strict";
    exports.__esModule = true;
    var QueryPolling = /** @class */ (function (_super) {
        __extends(QueryPolling, _super);
        function QueryPolling(interval, retryInterval) {
            if (interval === void 0) { interval = QueryPolling.DEFAULT_INTERVAL; }
            if (retryInterval === void 0) { retryInterval = QueryPolling.DEFAULT_INTERVAL; }
            var _this = _super.call(this) || this;
            _this.dataType = "json";
            _this.interval = QueryPolling.DEFAULT_INTERVAL;
            _this.retryInterval = QueryPolling.DEFAULT_INTERVAL;
            _this.__jqxhr = null;
            _this.__interrupt = false;
            _this.__hdlTimeout = null;
            _this.interval = interval;
            _this.retryInterval = retryInterval;
            return _this;
        }
        QueryPolling.prototype.run = function (query, domain, callback, context) {
            this._query = query;
            this._domain = domain;
            this._callback = callback;
            this._context = context;
            this.reload();
        };
        QueryPolling.prototype.poll = function (interval) {
            var _this = this;
            this.__hdlTimeout = setTimeout(function () {
                _this.__hdlTimeout = null;
                _this.execute();
            }, isset(interval) ? interval : this.interval);
        };
        QueryPolling.prototype.stop = function () {
            this.__interrupt = true;
            this.abort();
        };
        QueryPolling.prototype.reload = function () {
            this.stop();
            this.__interrupt = false;
            this.execute();
        };
        QueryPolling.prototype.abort = function () {
            if (this.__jqxhr) {
                this.__jqxhr.abort();
            }
            if (this.__hdlTimeout) {
                clearTimeout(this.__hdlTimeout);
                this.__hdlTimeout = null;
                if (!this.__interrupt) {
                    this.reload();
                }
            }
        };
        QueryPolling.prototype.execute = function () {
            var _this = this;
            var request = {
                query: this._query,
                callback: this._callback,
                context: this._context,
                domain: this._domain,
                timeout: this.interval,
                silent: true,
                cache: false,
                dataType: this.dataType
            };
            this.emit('query', request);
            this.__jqxhr = query_6.Query.GET(request.query, request.callback, request.context, { dataType: request.dataType, silent: request.silent, cache: request.cache, domain: request.domain, timeout: request.timeout });
            if (this.__jqxhr) {
                this.__jqxhr.always(function (result, status) {
                    _this.__jqxhr = null;
                    if (!_this.__interrupt) {
                        if ((status != query_6.Query.Status.SUCCESS) && (status != query_6.Query.Status.NOCONTENT)) {
                            if (status == query_6.Query.Status.TIMEOUT || status == query_6.Query.Status.ABORT) {
                                _this.execute();
                            }
                            else {
                                _this.poll(_this.retryInterval);
                            }
                        }
                        else {
                            _this.poll();
                        }
                    }
                });
            }
        };
        QueryPolling.prototype.dispose = function () {
            this.stop();
            _super.prototype.dispose.call(this);
        };
        QueryPolling.DEFAULT_INTERVAL = 100;
        return QueryPolling;
    }(EventsBinder_class_7.EventsBinder));
    exports.QueryPolling = QueryPolling;
});
define("modules/classes/locale/fr", ["require", "exports", "modules/classes/Locale.class"], function (require, exports, Locale_class_3) {
    "use strict";
    exports.__esModule = true;
    var Locale_fr = /** @class */ (function (_super) {
        __extends(Locale_fr, _super);
        function Locale_fr() {
            var _this = _super.call(this, 'fr', 'fr_FR') || this;
            _this.displayName = "Français";
            _this.decimalSeparator = ",";
            _this.decimalGroupSeparator = " ";
            _this.decimalGroupDigits = 3;
            _this.dateFormat = "dd/mm/yyyy";
            _this.dateSeparator = "/";
            _this.dateLiteralFormat = "DMY";
            _this.currencySymbol = "€";
            return _this;
        }
        return Locale_fr;
    }(Locale_class_3.Locale));
    exports.Locale_fr = Locale_fr;
});
define("modules/forms/TextField", ["require", "exports", "modules/forms/InputField"], function (require, exports, InputField_4) {
    "use strict";
    exports.__esModule = true;
    var TTextCase;
    (function (TTextCase) {
        TTextCase[TTextCase["none"] = 0] = "none";
        TTextCase[TTextCase["upper"] = 1] = "upper";
        TTextCase[TTextCase["lower"] = 2] = "lower";
        TTextCase[TTextCase["proper"] = 3] = "proper";
    })(TTextCase = exports.TTextCase || (exports.TTextCase = {}));
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.maxLength = 1000;
            _this.minLength = 0;
            _this.pattern = ko.observable();
            _this.useFormat = ko.observable(true);
            _this.formatFunction = null;
            _this.unformatFunction = null;
            _this.defaultAutoValidationDelay = 2000;
            _this._autoValidationCoeff = 1.50;
            _this.autoTrim = ko.observable(true);
            _this.textCase = ko.observable(TTextCase.none);
            _this.inputType = ko.observable('text'); //=> Disabled because of bug on IE8 when settings 'type' attribute
            _this.valueUpdateOn = ko.observable('change');
            _this.autoValidationDelay = "auto";
            _this.inputTemplate = "ui-field-text-template";
            _this.hasTextChanged = ko.computed(_this.computeHasTextChanged, _this);
            _this.formattedValue = ko.computed({
                read: function () {
                    if (_this.isFocused()) {
                        return _this.value();
                    }
                    return _this.useFormat() ? _this.formatValue(_this.dataValue()) : _this.dataValue();
                },
                write: function (v) {
                    _this.value(v);
                }
            }, _this);
            _this.value.subscribe(function (v) {
                _this._updateValue(v);
                if (!_this.hasBeenVisited() && _this.isFocused()) {
                    defer(function () {
                        _this.hasBeenVisited(true);
                    });
                }
            });
            _this.isFocused.subscribe(function (v) {
                if (!v) {
                    _this.validateValue();
                }
            });
            _this.textCase.immediateSubscribe(function (v) {
                _this._updateValue();
            });
            _this.autoTrim.subscribe(function (b) {
                _this._updateValue();
            });
            return _this;
        }
        TextField.prototype._updateValue = function (v) {
            var sCurrentValue_ = v || this.value();
            var sNewValue_ = this.transform(sCurrentValue_);
            if (sNewValue_ != sCurrentValue_) {
                this.value(sNewValue_);
            }
        };
        TextField.prototype.transform = function (value) {
            if (!value || typeof (value) != "string") {
                return value;
            }
            if (this.autoTrim()) {
                value = value.trim();
            }
            switch (this.textCase()) {
                case TTextCase.upper:
                case TTextCase[TTextCase.upper]: return value.toUpperCase();
                case TTextCase.lower:
                case TTextCase[TTextCase.lower]: return value.toLowerCase();
                case TTextCase.proper:
                case TTextCase[TTextCase.proper]: return value.toProperCase();
            }
            return value;
        };
        TextField.prototype.formatValue = function (value) {
            return typeof (this.formatFunction) == "function" ? this.formatFunction.call(this, value) : value;
        };
        TextField.prototype.cleanFormatValue = function (value) {
            return typeof (this.unformatFunction) == "function" ? this.unformatFunction.call(this, value) : value;
        };
        TextField.prototype.getDataValue = function () {
            var v = _super.prototype.getDataValue.call(this);
            if (isset(v)) {
                return CString(this.cleanFormatValue(v));
            }
            return null;
        };
        TextField.prototype.isValidateValue = function (value) {
            var b = _super.prototype.isValidateValue.call(this, value);
            if (b && !this.valueIsEmpty(value)) {
                value = CString(value);
                if ((this.minLength && value.length < this.minLength) || (this.maxLength && value.length > this.maxLength)) {
                    b = false;
                }
            }
            return b;
        };
        TextField.prototype.computeHasTextChanged = function () {
            var oldValue = '' + (this.oldValue() == null || this.oldValue() == undefined ? '' : this.oldValue());
            var value = '' + (this.value() == null || this.value() == undefined ? '' : this.value());
            return (oldValue != value);
        };
        /**
         * Override
         */
        TextField.prototype.onFocusEventHandler = function (e) {
            var autoValidationDelay = isNaN(this.autoValidationDelay) ? this.defaultAutoValidationDelay : this.autoValidationDelay;
            this._autoValidationCountset = 1;
            this._autoValidationTimecount = autoValidationDelay;
            this._autoValidationDelay = autoValidationDelay;
            return _super.prototype.onFocusEventHandler.call(this, e);
        };
        TextField.prototype.onBlurEventHandler = function (e) {
            clearTimeout(this._autoValidationDelayTimeout);
            return _super.prototype.onBlurEventHandler.call(this, e);
        };
        TextField.prototype.onKeyDownEventHandler = function (e) {
            clearTimeout(this._autoValidationDelayTimeout);
            var t_ = new Date().getTime();
            if (this.autoValidationDelay == "auto" || this.autoValidationDelay == true) {
                if (this._previousAutoValidationTimeset > 0) {
                    var lDiff_ = t_ - this._previousAutoValidationTimeset;
                    if (lDiff_ > 50 && lDiff_ <= this._autoValidationDelay * 2) {
                        this._autoValidationCountset++;
                        this._autoValidationTimecount += lDiff_;
                        this._autoValidationDelay = this._autoValidationTimecount / this._autoValidationCountset * this._autoValidationCoeff;
                    }
                }
            }
            this._previousAutoValidationTimeset = t_;
            return true;
        };
        TextField.prototype.onKeyUpEventHandler = function (e) {
            var _this = this;
            clearTimeout(this._autoValidationDelayTimeout);
            if (this.autoValidationDelay != "none" && this.autoValidationDelay != false) {
                this._autoValidationDelayTimeout = defer(function () {
                    defer(function () {
                        if (_this.isValidateValue($(e.target).val())) {
                            $(e.target).triggerHandler('change');
                        }
                        else {
                            _this._autoValidationDelayTimeout = defer(function () {
                                $(e.target).triggerHandler('change');
                            }, _this.defaultAutoValidationDelay);
                        }
                    });
                }, this._autoValidationDelay);
            }
            return true;
        };
        TextField.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            dispose(this.formattedValue);
        };
        return TextField;
    }(InputField_4.InputField));
    exports.TextField = TextField;
});
define("modules/forms/CodePostalField", ["require", "exports", "modules/forms/InputField", "modules/forms/SelectField", "modules/forms/TextField"], function (require, exports, InputField_5, SelectField_2, TextField_1) {
    "use strict";
    exports.__esModule = true;
    var CodePostalField = /** @class */ (function (_super) {
        __extends(CodePostalField, _super);
        function CodePostalField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.isLoadingValues = ko.observable(false);
            _this.oSelectField = new SelectField_2.SelectField(id + ".select", [], null, required, readOnly);
            _this.oTextField = new TextField_1.TextField(id + ".text", null, false, readOnly);
            _this.oTextField.inputType('tel');
            _this.oTextField.setValidationRegExp(regexp.CdPost);
            _this.oTextField.maxLength = 5;
            _this.oSelectField.isEditable.dependsOn(_this.isEditable);
            _this.oTextField.isEditable.dependsOn(_this.isEditable);
            _this.inputTemplate = "ui-field-codepostal-template";
            _this.oSelectField.isRequired.dependsOn(_this.isRequired);
            _this.oTextField.isRequired.dependsOn(_this.isRequired);
            _this.oSelectField.isReadOnly.dependsOn(_this.isReadOnly);
            _this.oTextField.isReadOnly.dependsOn(_this.isReadOnly);
            _this.oSelectField.isDisabled.dependsOn(_this.isDisabled);
            _this.oTextField.isDisabled.dependsOn(_this.isDisabled);
            _this.value.immediateSubscribe(function (v) {
                if (_this.autoValidate()) {
                    _this.oTextField.value(v);
                }
            });
            _this.isFocused = ko.computed(function () {
                return _this.oTextField.isFocused() || _this.oSelectField.isFocused();
            });
            _this.oTextField.isFocused.immediateSubscribe(function (b) {
                if (_this.oTextField.value()) {
                    _this.oTextField.value(_this.oTextField.value().rPad('0', 5));
                }
            });
            _this.oSelectField.value.subscribe(function (v) {
                if (_this.autoValidate()) {
                    _this.autoValidate(false);
                    _this.value(v);
                    _this.autoValidate(true);
                }
            });
            _this.oTextField.hasBeenVisited.subscribe(function (b) {
                if (b && !_this.oTextField.hasChanged()) {
                    _this.hasBeenVisited(true);
                }
            });
            _this.isLoadingValues.subscribe(function (b) {
                if (!b && _this.oTextField.hasBeenVisited()) {
                    _this.hasBeenVisited(true);
                }
            });
            _this.oSelectField.hasBeenVisited.subscribe(function (b) {
                if (b) {
                    _this.hasBeenVisited(true);
                }
            });
            _this.oTextField.value.immediateSubscribe(function (v) {
                if (_this.autoValidate()) {
                    if (v && v.length == 5) {
                        if (typeof (CodePostalField.onSearchFn) == "function") {
                            _this.isLoadingValues(true);
                            CodePostalField.onSearchFn.call(_this, v, function (choices) {
                                this.oSelectField.updateChoices(choices);
                                this.isLoadingValues(false);
                            });
                        }
                    }
                    else if (!v) {
                        _this.oSelectField.updateChoices([]);
                    }
                }
            });
            return _this;
        }
        CodePostalField.prototype.forceValue = function (value) {
            _super.prototype.forceValue.call(this, value);
            this.oTextField.applyChanges();
        };
        /**
         * Override cancelChanges
         */
        CodePostalField.prototype.cancelChanges = function () {
            this.oTextField.cancelChanges();
            this.hasBeenVisited(false);
        };
        /**
         * Override forceValue
         */
        CodePostalField.prototype.forceValues = function (textValue, listValue) {
            var _this = this;
            this.autoValidate(false);
            _super.prototype.forceValue.call(this, listValue);
            this.autoValidate(true);
            if ((textValue != this.oTextField.value()) || !this.oSelectField.hasChoice(listValue)) {
                this.autoValidate(false);
                this.oTextField.forceValue(null);
                this.autoValidate(true);
                this.oTextField.forceValue(textValue);
                this.isLoadingValues.subscribeOnce(function (b) {
                    if (!b) {
                        _this.oSelectField.forceValue(listValue);
                    }
                });
            }
            else {
                this.oSelectField.forceValue(listValue);
            }
        };
        CodePostalField.prototype.getTextDataValue = function () {
            return this.oTextField.dataValue();
        };
        CodePostalField.prototype.getSelectedOptionLabel = function () {
            return this.isDisabled() ? null : this.oSelectField.selectedOptionText();
        };
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        CodePostalField.prototype.isValidateValue = function (value) {
            var isValid = _super.prototype.isValidateValue.call(this, value);
            return isValid;
        };
        return CodePostalField;
    }(InputField_5.InputField));
    exports.CodePostalField = CodePostalField;
});
define("modules/forms/NumericField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_2) {
    "use strict";
    exports.__esModule = true;
    var TNumericTypes;
    (function (TNumericTypes) {
        TNumericTypes[TNumericTypes["Integer"] = 0] = "Integer";
        TNumericTypes[TNumericTypes["PositiveInteger"] = 1] = "PositiveInteger";
        TNumericTypes[TNumericTypes["Double"] = 2] = "Double";
        TNumericTypes[TNumericTypes["PositiveDouble"] = 3] = "PositiveDouble";
    })(TNumericTypes = exports.TNumericTypes || (exports.TNumericTypes = {}));
    var NumericField = /** @class */ (function (_super) {
        __extends(NumericField, _super);
        /**
         * Constructor
         */
        function NumericField(id, value, formatType, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.locale = ko.observable();
            _this.minimum = null;
            _this.maximum = null;
            _this.isMinimumExcluded = false;
            _this.isMaximumExcluded = false;
            _this.unit = ko.observable();
            _this.digits = 2;
            _this.setValidationRegExp(NumericField.getNumericRegExp(formatType));
            _this.inputTemplate = NumericField.defaultInputTemplate;
            _this.inputType('tel');
            _this.pattern('[0-9]*'); // Permit to show numeric virtual keyboard
            _this.text = ko.computed(function () {
                return _this.formattedValue() + "&nbsp;" + _this.unit();
            }).extend({ throttle: 100 });
            return _this;
        }
        /**
         * Get the reg expression from a format type
         * @param the format type
         * @return the RegExp or undefined
         */
        NumericField.getNumericRegExp = function (formatType) {
            switch (formatType) {
                case TNumericTypes.Integer: return regexp.Integer;
                case TNumericTypes.PositiveInteger: return regexp.PositiveInteger;
                case TNumericTypes.Double: return regexp.Double;
                case TNumericTypes.PositiveDouble: return regexp.PositiveDouble;
            }
        };
        /**
         * Check if the value is validated, included commons controls
         * @param value the value to check
         * @return true or false
         * @override
         */
        NumericField.prototype.isValidateValue = function (value) {
            if (!_super.prototype.isValidateValue.call(this, value)) {
                return false;
            }
            var isValid = true;
            if (!this.valueIsEmpty(value)) {
                if (!is_numeric(value)) {
                    isValid = false;
                }
                if (isValid) {
                    var numbr = Number(value);
                    var maxLimit = this.maximum;
                    if (maxLimit || maxLimit === 0) {
                        if (this.isMaximumExcluded) {
                            isValid = numbr < maxLimit;
                        }
                        else {
                            isValid = numbr <= maxLimit;
                        }
                    }
                }
            }
            return isValid;
        };
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        NumericField.prototype.formatValue = function (value) {
            if (isNaN(value)) {
                return value;
            }
            if (this.locale && !this.valueIsEmpty(value)) {
                return utils.formatDecimal(value, this.digits, this.locale());
            }
            return value;
        };
        /**
         * Unformat a value seized by the user
         * @param value the value seized
         * @return the unformatted value
         * @override
         */
        NumericField.prototype.cleanFormatValue = function (value) {
            if (this.valueIsEmpty(value)) {
                return value;
            }
            else if (CString(value).trim() == "") {
                return "";
            }
            var n = Number(CString(value).replaceAll(" ", "").replaceAll(",", "."));
            return isNaN(n) ? value : CString(n.round(this.digits));
        };
        /**
         * Surcharge spécifique pour exclure les blancs de toute longueur.
         */
        NumericField.prototype.valueIsEmpty = function (value) {
            return (typeof (value) == "undefined") || value == null || (CString(value) /*.trim()*/ == "");
        };
        /**
         * Surcharge la fonction pour retourner une valeur numérique
         */
        NumericField.prototype.getDataValue = function () {
            var v = _super.prototype.getDataValue.call(this);
            if (isset(v) && !this.valueIsEmpty(v) && !isNaN(v)) {
                return CFloat(v);
            }
            return null;
        };
        NumericField.defaultInputTemplate = "ui-field-numeric-template";
        return NumericField;
    }(TextField_2.TextField));
    exports.NumericField = NumericField;
});
define("modules/forms/CurrencyField", ["require", "exports", "modules/forms/NumericField"], function (require, exports, NumericField_1) {
    "use strict";
    exports.__esModule = true;
    var CurrencyField = /** @class */ (function (_super) {
        __extends(CurrencyField, _super);
        function CurrencyField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, NumericField_1.TNumericTypes.PositiveDouble, required, readOnly) || this;
            _this.minimum = 0;
            _this.digits = 2;
            return _this;
        }
        return CurrencyField;
    }(NumericField_1.NumericField));
    exports.CurrencyField = CurrencyField;
});
define("modules/forms/DateField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_3) {
    "use strict";
    exports.__esModule = true;
    var DateField = /** @class */ (function (_super) {
        __extends(DateField, _super);
        function DateField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.minDate = ko.observable();
            _this.maxDate = ko.observable();
            _this.date = null;
            _this.inputTemplate = "ui-field-date-template";
            _this.minDate.subscribe(function (d) {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            });
            _this.maxDate.subscribe(function (d) {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            });
            _this.date = ko.computed(function () {
                return _this.parseDate(_this.value());
            });
            return _this;
        }
        DateField.prototype.parseDate = function (value) {
            return utils.parseLiteralDate(value, app.i18n.getCurrentLocale());
        };
        DateField.prototype.formatValue = function (value) {
            var oDate_ = utils.parseLiteralDate(value, app.i18n.getCurrentLocale());
            if (oDate_) {
                return utils.formatDate(oDate_, app.i18n.getCurrentLocale().dateFormat);
            }
            return value;
        };
        DateField.prototype.cleanFormatValue = function (value) {
            var oDate_ = utils.parseLiteralDate(value, app.i18n.getCurrentLocale());
            if (oDate_) {
                return utils.formatDate(oDate_, "ddmmyyyy");
            }
            return value;
        };
        DateField.prototype.isValidateValue = function (value) {
            var bValid_ = _super.prototype.isValidateValue.call(this, value);
            if (bValid_ && !this.valueIsEmpty(value)) {
                var oDate_ = this.parseDate(value);
                bValid_ = oDate_ != null;
                if (bValid_) {
                    var oMinDate_ = this.minDate();
                    var oMaxDate_ = this.maxDate();
                    bValid_ = oDate_ != null;
                    bValid_ = bValid_ && (!oMinDate_ || (oMinDate_.isPast(oDate_) || oMinDate_.isSameDate(oDate_)));
                    bValid_ = bValid_ && (!oMaxDate_ || (oMaxDate_.isFuture(oDate_) || oMaxDate_.isSameDate(oDate_)));
                }
            }
            return bValid_;
        };
        return DateField;
    }(TextField_3.TextField));
    exports.DateField = DateField;
});
define("modules/forms/DateTextField", ["require", "exports", "modules/forms/NumericField", "modules/forms/DateField"], function (require, exports, NumericField_2, DateField_1) {
    "use strict";
    exports.__esModule = true;
    var DateTextFieldTypes = /** @class */ (function () {
        function DateTextFieldTypes(id, placeHolder, minLength, maxLength, minimum, maximum) {
            if (minimum === void 0) { minimum = null; }
            if (maximum === void 0) { maximum = null; }
            this.id = id;
            this.minLength = minLength;
            this.maxLength = maxLength;
            this.minimum = minimum;
            this.maximum = maximum;
            this.placeHolder = placeHolder;
        }
        DateTextFieldTypes.day = new DateTextFieldTypes("day", "dd", 1, 2, 1, 31);
        DateTextFieldTypes.month = new DateTextFieldTypes("month", "mm", 1, 2, 1, 12);
        DateTextFieldTypes.year = new DateTextFieldTypes("year", "yyyy", 4, 4);
        return DateTextFieldTypes;
    }());
    exports.DateTextFieldTypes = DateTextFieldTypes;
    var DateTextField = /** @class */ (function (_super) {
        __extends(DateTextField, _super);
        function DateTextField(id, dateType, oNextField) {
            var _this = _super.call(this, id + '.' + dateType.id, null, NumericField_2.TNumericTypes.PositiveInteger, false, false) || this;
            _this.oNextField = null;
            _this.minLength = dateType.minLength;
            _this.maxLength = dateType.maxLength;
            _this.minimum = dateType.minimum;
            _this.maximum = dateType.maximum;
            _this.dateType = dateType;
            _this.oNextField = oNextField;
            _this.placeholder = app.i18n.getObservableString(dateType.placeHolder);
            _this.isFocused.subscribe(function (b) {
                if (b) {
                    try {
                        $('#' + _this.uid).select();
                    }
                    catch (e) { }
                }
            });
            return _this;
        }
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        DateTextField.prototype.formatValue = function (value) {
            if (!this.valueIsEmpty(value) && !isNaN(value)) {
                return CString(value).lPad("0", 2);
            }
            return _super.prototype.formatValue.call(this, value);
        };
        /**
         * Unformat a value seized by the user
         * @param value the value seized
         * @return the unformatted value
         * @override
         */
        DateTextField.prototype.cleanFormatValue = function (value) {
            value = _super.prototype.cleanFormatValue.call(this, value);
            if (this.valueIsEmpty(value)) {
                return "";
            }
            return isNaN(value) ? value : CString(Number(value));
        };
        DateTextField.prototype.onKeyUpEventHandler = function (e) {
            if (!!this.oNextField) {
                var val = $('#' + this.uid).val();
                if (this.isValidateValue(val) && (this.value() != val) && (CString(val).length >= this.maxLength)) {
                    $("#" + this.oNextField.uid).focus();
                }
            }
            return _super.prototype.onKeyUpEventHandler.call(this, e);
        };
        return DateTextField;
    }(NumericField_2.NumericField));
    exports.DateTextField = DateTextField;
    var DateMultiFieldField = /** @class */ (function (_super) {
        __extends(DateMultiFieldField, _super);
        function DateMultiFieldField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.separator = ko.observable();
            _this.inputTemplate = "ui-field-date-multifield-template";
            var locale = app.i18n.getCurrentLocale();
            _this.separator(locale.dateSeparator);
            _this.value.immediateSubscribe(function (v) {
                var date = utils.parseLiteralDate(v, app.i18n.getCurrentLocale());
                if (date) {
                    _this.oTextFieldDay.value(date.getDate());
                    _this.oTextFieldMonth.value(date.getMonth() + 1);
                    _this.oTextFieldYear.value(date.getFullYear());
                }
            });
            _this.oTextFieldYear = new DateTextField(id, DateTextFieldTypes.year);
            _this.oTextFieldMonth = new DateTextField(id, DateTextFieldTypes.month, _this.oTextFieldYear);
            _this.oTextFieldDay = new DateTextField(id, DateTextFieldTypes.day, _this.oTextFieldMonth);
            _this._koComputeIsLastInputValid = ko.pureComputed(function () {
                var sYear_ = _this.oTextFieldYear.dataValue();
                var bIsValidYear_ = _this.oTextFieldYear.isValidateValue(sYear_);
                var sMonth_ = _this.oTextFieldMonth.dataValue();
                var bIsValidMonth_ = _this.oTextFieldMonth.isValidateValue(sMonth_);
                var sDay_ = _this.oTextFieldDay.dataValue();
                var bIsValidDay_ = _this.oTextFieldDay.isValidateValue(sDay_);
                return bIsValidYear_ && bIsValidMonth_ && bIsValidDay_;
            }).extend({ throttle: 0 });
            _this.broadcastEvents(_this.oTextFieldYear);
            _this.broadcastEvents(_this.oTextFieldMonth);
            _this.broadcastEvents(_this.oTextFieldDay);
            _this.hasBeenVisited.subscribe(function (b) {
                if (!b) {
                    _this.oTextFieldDay.hasBeenVisited(false);
                    _this.oTextFieldMonth.hasBeenVisited(false);
                    _this.oTextFieldYear.hasBeenVisited(false);
                }
            });
            _this._koIsFocusedMainField = ko.computed(function () {
                if (_this.oTextFieldDay.isFocused() || _this.oTextFieldMonth.isFocused() || _this.oTextFieldYear.isFocused()) {
                    _this.isFocused(true);
                }
                else {
                    _this.isFocused(false);
                }
            });
            _this._koUpdateValue = ko.computed(function () {
                var locale = app.i18n.getCurrentLocale();
                var bIsValid_ = _this._koComputeIsLastInputValid();
                var oDayValue_ = _this.oTextFieldDay.dataValue();
                var oMonthValue_ = _this.oTextFieldMonth.dataValue();
                var oYearValue_ = _this.oTextFieldYear.dataValue();
                if (!bIsValid_) {
                    if (_this.oTextFieldDay.isEmpty() || _this.oTextFieldMonth.isEmpty() || _this.oTextFieldYear.isEmpty()) {
                        _this.value("");
                    }
                    else {
                        _this.value("-");
                    }
                }
                else {
                    _this.value(CString(oDayValue_).lPad('0', 2) + _this.separator() + CString(oMonthValue_).lPad('0', 2) + _this.separator() + oYearValue_);
                }
            });
            return _this;
        }
        DateMultiFieldField.prototype.broadcastEvents = function (Field) {
            Field.isEditable.dependsOn(this.isEditable);
            Field.isRequired.dependsOn(this.isRequired);
            Field.isReadOnly.dependsOn(this.isReadOnly);
            Field.isDisabled.dependsOn(this.isDisabled);
        };
        /**
         * @Override cancelChanges
         */
        DateMultiFieldField.prototype.applyChanges = function () {
            this.autoValidate(false);
            this.oTextFieldDay.applyChanges();
            this.oTextFieldMonth.applyChanges();
            this.oTextFieldYear.applyChanges();
            _super.prototype.applyChanges.call(this);
            this.autoValidate(true);
        };
        /**
         * @Override cancelChanges
         */
        DateMultiFieldField.prototype.cancelChanges = function () {
            this.autoValidate(false);
            this.oTextFieldDay.cancelChanges();
            this.oTextFieldMonth.cancelChanges();
            this.oTextFieldYear.cancelChanges();
            _super.prototype.cancelChanges.call(this);
            this.autoValidate(true);
        };
        DateMultiFieldField.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            dispose(this._koUpdateValue);
            dispose(this._koIsFocusedMainField);
            dispose(this._koComputeIsLastInputValid);
            dispose(this._koComputeYearIsValid);
            dispose(this._koComputeMonthIsValid);
            dispose(this._koComputeDayIsValid);
        };
        return DateMultiFieldField;
    }(DateField_1.DateField));
    exports.DateMultiFieldField = DateMultiFieldField;
});
define("modules/forms/EmailField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_4) {
    "use strict";
    exports.__esModule = true;
    var EmailField = /** @class */ (function (_super) {
        __extends(EmailField, _super);
        function EmailField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.allowMultiple = ko.observable(false);
            //this.inputType('email');
            _this.allowMultiple.subscribe(function () {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            });
            return _this;
        }
        EmailField.prototype.isValidateValue = function (value) {
            var b = _super.prototype.isValidateValue.call(this, value);
            if (b && value) {
                value = value.replace(",", EmailField.EMAIL_LIST_DELIMITER);
                var emailsAsArray = value.split(EmailField.EMAIL_LIST_DELIMITER);
                var i, anEmail;
                var emailsCount = emailsAsArray.length;
                var isListValid = true;
                var reg = regexp.Email;
                if (!this.allowMultiple() && emailsCount > 1) {
                    isListValid = false;
                }
                else {
                    for (i = 0; i < emailsCount; i++) {
                        anEmail = emailsAsArray[i];
                        if (anEmail.trim() !== '' && !reg.test(anEmail.trim())) {
                            isListValid = false;
                            break;
                        }
                    }
                }
                return isListValid;
            }
            return b;
        };
        EmailField.prototype.getDataValue = function () {
            var v = _super.prototype.getDataValue.call(this);
            if (typeof (v) == "string") {
                return v.trim();
            }
            return v;
        };
        EmailField.EMAIL_LIST_DELIMITER = ";";
        return EmailField;
    }(TextField_4.TextField));
    exports.EmailField = EmailField;
});
define("modules/forms/GridPasswordField", ["require", "exports", "modules/forms/InputField"], function (require, exports, InputField_6) {
    "use strict";
    exports.__esModule = true;
    var GridPasswordField = /** @class */ (function (_super) {
        __extends(GridPasswordField, _super);
        /**
         * Constructeur
         */
        function GridPasswordField(id, required, gridSize) {
            if (required === void 0) { required = false; }
            if (gridSize === void 0) { gridSize = 16; }
            var _this = _super.call(this, id, null, required, false) || this;
            _this.oTabChars = ko.observable("0123456789");
            _this.oGridSize = ko.observable();
            _this.oMaxLength = ko.observable(0);
            _this.sObfuscatedChar = "*";
            _this.inputTemplate = "ui-field-gridpassword-template";
            _this.oGridSize(gridSize);
            _this.oObfuscatedPassword = ko.computed(function () {
                var sValue_ = _this.value() || "";
                return "".rPad(_this.sObfuscatedChar, sValue_.length);
            });
            _this.oRandomChars = ko.computed(function () {
                return _this.oTabChars().rPad(" ", _this.oGridSize()).shake().split("");
            });
            _this.oMaxLength.subscribe(function () {
                if (_this.autoValidate()) {
                    _this.validateValue();
                }
            });
            return _this;
        }
        /**
         * Evenement lors du clique sur un bouton
         */
        GridPasswordField.prototype.onClickChar = function (char) {
            var sValue_ = this.value() || "";
            var n_ = this.oMaxLength();
            if ((n_ <= 0) || (sValue_.length < n_)) {
                this.value(sValue_ + char);
            }
        };
        /**
         * @Override
         */
        GridPasswordField.prototype.isValidateValue = function (value) {
            var b_ = _super.prototype.isValidateValue.call(this, value);
            var s_ = value || "";
            var n_ = this.oMaxLength ? this.oMaxLength() : 0;
            return b_ && ((n_ <= 0) || (s_.length <= n_));
        };
        /**
         * Efface la saisie
         */
        GridPasswordField.prototype.clear = function () {
            this.value(null);
        };
        /**
         * Annuler la dernière entrée
         */
        GridPasswordField.prototype.cancel = function () {
            var s_ = this.value() || "";
            this.value(s_.left(s_.length - 1));
        };
        return GridPasswordField;
    }(InputField_6.InputField));
    exports.GridPasswordField = GridPasswordField;
});
define("modules/forms/LabelField", ["require", "exports", "modules/forms/InputField"], function (require, exports, InputField_7) {
    "use strict";
    exports.__esModule = true;
    var LabelField = /** @class */ (function (_super) {
        __extends(LabelField, _super);
        function LabelField(id, value, required) {
            if (required === void 0) { required = false; }
            var _this = _super.call(this, id, value, required, true) || this;
            _this.className = ko.observable(null);
            _this.inputTemplate = "labelInputTemplate";
            return _this;
        }
        return LabelField;
    }(InputField_7.InputField));
    exports.LabelField = LabelField;
});
define("modules/forms/PasswordField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_5) {
    "use strict";
    exports.__esModule = true;
    var PasswordField = /** @class */ (function (_super) {
        __extends(PasswordField, _super);
        function PasswordField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.inputType('password');
            return _this;
        }
        return PasswordField;
    }(TextField_5.TextField));
    exports.PasswordField = PasswordField;
});
define("modules/forms/RateField", ["require", "exports", "modules/forms/NumericField"], function (require, exports, NumericField_3) {
    "use strict";
    exports.__esModule = true;
    var RateField = /** @class */ (function (_super) {
        __extends(RateField, _super);
        function RateField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, NumericField_3.TNumericTypes.PositiveDouble, required, readOnly) || this;
            _this.minimum = 0;
            _this.digits = 2;
            _this.unit('%');
            return _this;
        }
        return RateField;
    }(NumericField_3.NumericField));
    exports.RateField = RateField;
});
define("modules/forms/TextAreaField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_6) {
    "use strict";
    exports.__esModule = true;
    var TextAreaField = /** @class */ (function (_super) {
        __extends(TextAreaField, _super);
        function TextAreaField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.rows = ko.observable(5);
            _this.scrollGlue = ko.observable(true);
            _this.keyLock = ko.observable(false);
            _this.inputTemplate = "ui-field-textarea-template";
            _this.keyLock.subscribe(function (b) {
                if (b) {
                    $(document).on('keypress.locker', 'textarea#' + _this.uid, function (e) {
                        e.stopImmediatePropagation();
                        return false;
                    });
                }
                else {
                    $(document).off('keypress.locker', 'textarea#' + _this.uid);
                }
            });
            return _this;
        }
        TextAreaField.prototype.append = function (s) {
            if (isset(s)) {
                var toBottom = false;
                if (this.scrollGlue()) {
                    toBottom = this.isScrollToBottom();
                }
                var value = this.value() || '';
                this.value(value + s);
                if (toBottom) {
                    this.scrollToBottom();
                }
            }
        };
        TextAreaField.prototype.clear = function () {
            this.flush();
        };
        TextAreaField.prototype.flush = function () {
            var value = this.value();
            this.value('');
            return value;
        };
        TextAreaField.prototype.scrollToBottom = function () {
            var $element = $('#' + this.uid);
            $element.scrollTop($element[0].scrollHeight);
        };
        TextAreaField.prototype.isScrollToBottom = function () {
            var $element = $('#' + this.uid);
            return ($element[0].scrollHeight - $element[0].scrollTop) == $element.innerHeight();
        };
        return TextAreaField;
    }(TextField_6.TextField));
    exports.TextAreaField = TextAreaField;
});
define("modules/forms/TextSearchField", ["require", "exports", "modules/forms/TextField"], function (require, exports, TextField_7) {
    "use strict";
    exports.__esModule = true;
    var TextSearchField = /** @class */ (function (_super) {
        __extends(TextSearchField, _super);
        function TextSearchField(id, value, required, readOnly) {
            var _this = _super.call(this, id, value, required, readOnly) || this;
            _this.inputTemplate = "ui-field-textsearch-template";
            return _this;
        }
        TextSearchField.prototype.onKeyDownEventHandler = function (e) {
            var _this = this;
            if ((e.which || e.keyCode) == 13) {
                defer(function () {
                    _this.onSearch();
                }, 100);
            }
            return _super.prototype.onKeyDownEventHandler.call(this, e);
        };
        TextSearchField.prototype.onSearch = function () {
            if (this.isValidateValue(this.dataValue())) {
                this.emit('search', this.dataValue());
            }
            else {
                this.emit('searchError', this.dataValue());
            }
        };
        return TextSearchField;
    }(TextField_7.TextField));
    exports.TextSearchField = TextSearchField;
});
define("modules/forms/ToggleField", ["require", "exports", "modules/forms/InputField"], function (require, exports, InputField_8) {
    "use strict";
    exports.__esModule = true;
    var ToggleField = /** @class */ (function (_super) {
        __extends(ToggleField, _super);
        function ToggleField(id, valueForTrue, valueForFalse, required, readOnly) {
            var _this = _super.call(this, id, null, required, readOnly) || this;
            _this.valueForTrue = null;
            _this.valueForFalse = null;
            // Resources Manager
            _this.valueForTrue = valueForTrue;
            _this.valueForFalse = valueForFalse;
            _this.textForTrue = app.i18n.getObservableString(id + '.on', id + '.label');
            _this.textForFalse = app.i18n.getObservableString(id + '.off', id + '.label');
            _this.inputTemplate = "ui-field-text-toggle";
            _this.isChecked = ko.computed({
                read: function () {
                    return _this.value() == _this.valueForTrue;
                },
                write: function (b) {
                    _this.value(b ? _this.valueForTrue : _this.valueForFalse);
                }
            });
            _this.forceValue(_this.valueForFalse);
            return _this;
        }
        ToggleField.prototype.isValidateValue = function (value) {
            var isValid = false;
            if ((value == this.valueForTrue) || (value == this.valueForFalse)) {
                isValid = true;
            }
            return isValid;
        };
        return ToggleField;
    }(InputField_8.InputField));
    exports.ToggleField = ToggleField;
});
define("modules/helpers/xml", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * @fileOverview This file defines a simple xml to json converter.
     */
    var XmlConverter = /** @class */ (function () {
        function XmlConverter() {
        }
        /**
         * Converts XML to JSON.
         */
        XmlConverter.toJson = function (xml) {
            var attributes, childNodes, json;
            json = {};
            // Get the attributes
            switch (xml.nodeType) {
                case 1: // element
                    if (xml.attributes.length > 0) {
                        attributes = json[XmlConverter.ATTRIBUTES_KEY] = {};
                        $.each(xml.attributes, function (index, nodeAttribute) {
                            attributes[nodeAttribute.nodeName] = nodeAttribute.nodeValue;
                        });
                    }
                    else if (xml.childNodes.length == 1 && xml.childNodes.item(0).nodeType == 3) {
                        // Return directly the text
                        return xml.childNodes.item(0).nodeValue;
                    }
                    break;
                case 3: // text
                    json = xml.nodeValue;
                    break;
            }
            // Get the child nodes
            if (xml.hasChildNodes()) {
                childNodes = json /*["childNodes"] = {}*/;
                $.each(xml.childNodes, function (index, childNode) {
                    var nodeName = childNode.nodeName;
                    if (nodeName == "#text") {
                        // Ignore empty nodes (spaces, new lines, etc)
                        return;
                    }
                    if (typeof (childNodes[nodeName]) == "undefined") {
                        childNodes[nodeName] = XmlConverter.toJson(childNode);
                    }
                    else {
                        if (typeof (childNodes[nodeName].push) == "undefined") {
                            var old = childNodes[nodeName];
                            childNodes[nodeName] = [];
                            childNodes[nodeName].push(old);
                        }
                        childNodes[nodeName].push(XmlConverter.toJson(childNode));
                    }
                });
            }
            return json;
        };
        XmlConverter.ATTRIBUTES_KEY = "_attributes_";
        return XmlConverter;
    }());
    exports.XmlConverter = XmlConverter;
});
define("modules/managers/bindings", ["require", "exports", "modules/classes/EventsBinder.class"], function (require, exports, EventsBinder_class_8) {
    "use strict";
    exports.__esModule = true;
    var RegisterBindingsManager = /** @class */ (function (_super) {
        __extends(RegisterBindingsManager, _super);
        function RegisterBindingsManager() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RegisterBindingsManager.prototype.register = function (binding) {
            ko.bindingHandlers[binding.getName()] = binding;
            this.emit('register', binding);
        };
        return RegisterBindingsManager;
    }(EventsBinder_class_8.EventsBinder));
    exports.RegisterBindingsManager = RegisterBindingsManager;
});
define("modules/ui/glassPanel", ["require", "exports", "modules/helpers/logger", "modules/classes/MVVM.class"], function (require, exports, logger_8, MVVM_class_2) {
    "use strict";
    exports.__esModule = true;
    var logger = logger_8.Logger.getLogger('GlassPanel');
    var _contentString = null;
    // Current stack of glass panels
    var _currentStack = {};
    var GlassPanel = /** @class */ (function (_super) {
        __extends(GlassPanel, _super);
        function GlassPanel(id, properties) {
            var _this = _super.call(this, app.webkitPath + "templates/GlassPanel.html", []) || this;
            _this.progression = ko.observable();
            _this.steps = ko.observable('');
            _this.animationDuration = 500;
            _this.id = null;
            _this.pid = null;
            _this.lockKeyBoard = false;
            _this.isVisible = ko.observable(true);
            _this.text = ko.observable('');
            _this.progressionText = ko.observable('');
            _this.currentStep = ko.observable();
            _this.totalSteps = ko.observable();
            _this.animation = ko.observable();
            _this.id = id;
            _this.pid = String.generate(20);
            _this.currentStep.subscribe(function (value) {
                _this._update();
            }, _this);
            _this.totalSteps.subscribe(function (value) {
                _this._update();
            }, _this);
            _this.update(properties);
            _currentStack[_this.pid] = _this;
            return _this;
        }
        GlassPanel.prototype._update = function () {
            var currentStep = Number(this.currentStep());
            var totalSteps = Number(this.totalSteps());
            if (!isNaN(currentStep) && !isNaN(totalSteps)) {
                this.steps(Math.round(currentStep / totalSteps * 100) + '%');
                this.progression(currentStep / totalSteps);
            }
            else {
                this.steps('');
                this.progression(0);
            }
        };
        GlassPanel.prototype.update = function (properties) {
            if (!isset(properties)) {
                return;
            }
            if (isset(properties.text)) {
                this.text(properties.text);
            }
            if (isset(properties.currentStep)) {
                this.currentStep(Number(properties.currentStep));
            }
            if (isset(properties.totalSteps)) {
                this.totalSteps(Number(properties.totalSteps));
            }
            if (isset(properties.progressionText)) {
                this.progressionText(properties.progressionText);
            }
        };
        GlassPanel.prototype.load = function (fn) {
            var _this = this;
            _super.prototype.load.call(this, function (htmlContent) {
                _contentString = htmlContent;
                if (typeof (fn) == "function") {
                    fn.call(_this);
                }
            }, _contentString);
            // Disable keyboard
            if (this.lockKeyBoard) {
                $(document).on('keydown.glassPannel', function (e) {
                    e.stopImmediatePropagation();
                    return false;
                });
            }
        };
        GlassPanel.prototype.animate = function (animation, fn) {
            var _this = this;
            var animation_ = typeof (animation) == 'string' ? { animation: animation } : animation;
            if (!animation_.duration) {
                animation_.duration = this.animationDuration;
            }
            this.animation(animation_);
            if (typeof (fn) == "function") {
                defer(function () {
                    fn.apply(_this);
                }, animation_.duration);
            }
        };
        GlassPanel.prototype.show = function (fn) {
            var _this = this;
            if (!this.isLoaded()) {
                this.load(function () {
                    _this.show(fn);
                });
                return;
            }
            this.isVisible(true);
            this.animate('fadeIn', fn);
        };
        GlassPanel.prototype.hide = function (fn) {
            var _this = this;
            this.animate('fadeOut', function () {
                _this.isVisible(false);
                if (fn) {
                    fn.apply(_this);
                }
            });
        };
        GlassPanel.prototype.destroy = function () {
            var _this = this;
            delete _currentStack[this.pid];
            if (!Object.hasKeys(_currentStack)) {
                // Enable keyboard
                $(document).off('keydown.glassPannel');
            }
            this.hide(function () {
                _this.dispose();
            });
        };
        /** Show an explicit glasspanel (using his ID)
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} ID - The ID specified
         * @returns {undefined}
         */
        GlassPanel.show = function (id) {
            var panels = GlassPanel.getPanelsById(id);
            if (panels && panels.length > 0) {
                $.each(panels, function (k, panel) {
                    panel.show();
                });
            }
            else {
                if (logger.isWarnEnabled()) {
                    logger.warn("No glass panel found. id: " + id);
                }
            }
        };
        /** Hide an explicit glasspanel (using his ID)
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} ID - The ID specified
         * @returns {undefined}
         */
        GlassPanel.hide = function (id) {
            var panels = GlassPanel.getPanelsById(id);
            if (panels && panels.length > 0) {
                $.each(panels, function (k, panel) {
                    panel.hide();
                });
            }
            else {
                if (logger.isWarnEnabled()) {
                    logger.warn("No glass panel found. id: " + id);
                }
            }
        };
        /** Create a new glassPanel
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} text - The main text to show with the glassPanel
         * @param {object} [opts={ ID:'main' }] - The options of the glassPanel
         * @returns {undefined}
         * @example
         * // Show a glassPanel (will use the 'main' ID)
         * _glassPanel.create('Loading...'); // -> one glassPanel is showed
         * // Update the main glassPanel
         * _glassPanel.create('Loading again...'); // -> one glassPanel is showed
         * // Create a new glassPanel
         * _glassPanel.create('Wait...',{ ID: 'waitpanel' }); -> two glassPanel are showed
         * // Update the 'waitpanel' glassPanel
         * _glassPanel.create('Wait again...',{ ID: 'waitpanel' }); -> two glassPanel are showed
         * // Destroy the 'waitpanel' glassPanel
         * _glassPanel.destroy('waitpanel'); -> one glassPanel is showed (the main)
         * // Destroy the main glassPanel
         * _glassPanel.destroy(); -> no glassPanel is showed (equals to _glassPanel.destroy('main');)
         */
        GlassPanel.create = function (id, opts) {
            if (id === void 0) { id = 'main'; }
            var panel = new GlassPanel(id, opts);
            // show
            panel.show();
            return panel;
        };
        /** Destroy a glassPanel
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} [ID='main'] - The ID of the glassPanel to destroy (destroy the main by default)
         * @returns {undefined}
         */
        GlassPanel.destroy = function (id) {
            var panels = GlassPanel.getPanelsById(id);
            if (panels && panels.length > 0) {
                $.each(panels, function (k, panel) {
                    panel.destroy();
                });
            }
            else {
                if (logger.isWarnEnabled()) {
                    logger.warn("No glass panel found. id: " + id);
                }
            }
        };
        GlassPanel.update = function (opts, id) {
            var panels = GlassPanel.getPanelsById(id);
            if (panels && panels.length > 0) {
                $.each(panels, function (k, panel) {
                    panel.update(opts);
                });
            }
            else {
                if (logger.isWarnEnabled()) {
                    logger.warn("No glass panel found. id: " + id);
                }
            }
        };
        /** Get an explicit glassPanel using his ID
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
         * @returns {undefined}
         */
        GlassPanel.getPanel = function (id) {
            if (id === void 0) { id = 'main'; }
            return _currentStack[id] || Object.findBy(_currentStack, 'id', id);
        };
        /** Get an explicit glassPanel using his ID
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
         * @returns {undefined}
         */
        GlassPanel.getPanelsById = function (id) {
            if (id === void 0) { id = 'main'; }
            return Object.findManyBy(_currentStack, 'id', id);
        };
        return GlassPanel;
    }(MVVM_class_2.MVVM));
    exports.GlassPanel = GlassPanel;
});
