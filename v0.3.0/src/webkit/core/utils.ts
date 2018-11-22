/// <reference path="./prototypes/Object.prototype.ts"/>
/// <reference path="./prototypes/String.prototype.ts"/>
/// <reference path="./prototypes/Date.prototype.ts"/>
/// <reference path="./prototypes/Array.prototype.ts"/>
/// <reference path="./prototypes/Number.prototype.ts"/>

function isset(value: any): boolean {
    return value != null && typeof(value) != "undefined"
}

function defer(fn: Function, delay?: number, context?: any): number {
    return setTimeout(function () {
        fn.call(context || this);
    }, delay)
}

function fire(fn: any, args?: any) {
    if(!fn) return;
    if(isset(args) && !Array.isArray(args)) {
        args = [args];
    }
    if(typeof(fn) == "function") {
        fn.apply(this, args);    
    } else {
        fn.fn.apply(fn.context || this, args);    
    }
    
}

/**
* 
* @param value
* @param nbdec
* @return
*/
function round(value: any, nbdec: number = 0)
{
    return CNumber(value, nbdec);
}

/**
* 
*/
function CString(obj): string
{
    return isset(obj)?String(obj).toString():"";
}
/**
* 
*/
function CFloat(obj, rnd?: number): number
{
    var float_ = parseFloat(obj);
    return isNaN(float_)?0:(rnd?round(float_, rnd):float_);
}

function CNumber(obj, rnd?: number): number
{
    var n: number = Number(obj);
    return isNaN(n)?0:(rnd?n.round(rnd):n);
}

/**
* 
*/
function CInt(obj): number
{
    var int_ = parseInt(obj);
    return isNaN(int_)?0:int_;
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

function dispose(obj: Object): void {
    ko.utils.dispose(obj)
}

function count(start: number, end: number, fn: (counter: number) => void, step: number = 1, delay = 1000): void {
    
    var nextValue: number = start + step;
    
    if((start - end) < (nextValue - end)) {
        nextValue = start - step;
        end = -end;
    }
    
    fn.call(this, start);
    
    if(start >= end) {
        defer((): void => {
            count(nextValue, end, fn, step, delay);
        }, delay);   
    }
}

function count_down(start: number, fn: (counter: number) => void, delay = 1000): void {
    count(start, 0, fn);
}
