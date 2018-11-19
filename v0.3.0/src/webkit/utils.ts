/// <reference path="./commons/prototypes/Object.prototype.ts"/>
/// <reference path="./commons/prototypes/String.prototype.ts"/>
/// <reference path="./commons/prototypes/Date.prototype.ts"/>
/// <reference path="./commons/prototypes/Array.prototype.ts"/>
/// <reference path="./commons/prototypes/Number.prototype.ts"/>

function isset(value: any): boolean {
    return value != null && typeof(value) != "undefined"
}

function defer(fn: Function, delay?: number, context?: any): number {
    return setTimeout(function () {
        fn.call(context || this);
    }, delay)
}

function fire(fn: any, args?: any): any {
    if(!fn) return;
    if(isset(args) && !Array.isArray(args)) {
        args = [args];
    }
    if(typeof(fn) == "function") {
        return fn.apply(this, args);    
    } else {
        return fn.fn.apply(fn.context || this, args);    
    }
    
}

/**
* 
*/
function CString(obj): string
{
	return isset(obj)?String(obj).toString():"";
}

if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

/**
* 
* @param obj
* @return
*/
function is_string(obj)
{
	return typeof(obj) == "string";
}

/**
* 
* @param obj
* @return
*/
function is_numeric(obj)
{
	if(is_string(obj)) {
		if(obj.trim() == '') {
			return false;
		}
	}
	return !isNaN(Number(obj));
}