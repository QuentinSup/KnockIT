interface JQuery {
	ajaxForm: Function
	crypt: Function    
    tooltipster: Function
    appear: Function
    nanoScroller: Function
}

interface JQueryStatic {
    address: any
    url: Function
    cookie: Function
    cookieBar: Function
}

interface KnockoutStatic {
    linkObservableToUrl: any
}

interface KnockoutUtils {
    isObservableArray(obj: any): boolean
    dispose(obj: any): void
}

interface KnockoutObservableArrayFunctions<T> {
    filterByProperty(propName: string, matchValue: string): KnockoutObservableArray<T>
    clear(): T[]
}

interface KnockoutSubscribable<T> {
    (value?: any): any
    subscribeOnce(callback: Function, context?: any, eventName?: string): KnockoutSubscription
    immediateSubscribe(callback: Function, context?: any, eventName?: string): KnockoutSubscription
    dependsOn(observable: KnockoutSubscribable<any>, fn?: Function, ope?: number): KnockoutSubscription
    makeTrueIfNot(observable: KnockoutSubscribable<any>, ope?: number): KnockoutSubscription
}

interface IDisposable {
    dispose(): void
}

interface IApplicationContext {
    device: string
    page: string
}

interface IEventsBinder {
    on(eventId: any, callback: Function, context?: any): void
    emit(...args: any[]): void
}

interface IApplication extends IEventsBinder {
    title: KnockoutObservable<string>
    i18n: kit.manager.I18n
    browser: kit.helpers.Browser
    manager: kit.AppManager
	userData: any
    webkitPath: string
    webkitLogUri: string
    basePath: string
    servicesPath: string
    useDialog: boolean
    version: string
    logLevel: number
    logConsole: boolean
    onAjaxSend: Function
    getFinalFileName(fileName: string): string
    navigateTo(href: string): void
    context: IApplicationContext
    isReady: KnockoutObservable<boolean>
    ready(fn: Function, context?: any): void
    init(userData?: any): void
    mailto(data: any): void
    postRedirect(url: string, data_post: any, target?: string, data_get?: any): void
}

interface Window {
    app: IApplication
    vm: any
}

declare function isNaN(o: any): boolean
declare var app: IApplication
declare var browserLocaleInfos: any

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


if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
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

module kit {
    
    export function alert(text: string, callbackAlert?: any, opts?: ui.IMessageBoxOptions): ui.MessageBox {
        if(app.useDialog) {
            return ui.MessageBox.alert(app.title(), text, callbackAlert, opts)
        }
        var r = window.alert(text)
        fire(callbackAlert, r)
        return <any>r;
    }

    export function confirm(text: string, callbackOk?: Function, callbackCancel?: any, opts?: ui.IMessageBoxOptions): ui.MessageBox {
        if(app.useDialog) {
            return ui.MessageBox.confirm(app.title(), text, callbackOk, callbackCancel, opts)
        }
        var r = window.confirm(text)
        if(r && callbackOk) {
            fire(callbackOk, r)
        }
        if(!r && callbackCancel) {
            fire(callbackCancel, r)
        }
        return <any>r;
    }
}

