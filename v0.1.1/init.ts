interface JQuery {
	ajaxForm: Function
	crypt: Function    
    tooltipster: Function
}

interface JQueryStatic {
    address: any
    url: Function
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
    app: string
    page: string
}

interface IApplication {
    title: KnockoutObservable<string>
    i18n: kit.manager.I18n
    messageBox: kit.ui.MessageBox
    servicesPath: string
    basePath: string
    appPath: string
    version: string
    logLevel: number
    logConsole: boolean
    getFinalFileName(fileName: string): string
    navigateTo(href: string): void
    doTrtQueryError(response: any): void
    context: IApplicationContext
    isReady: KnockoutObservable<boolean>
    ready(fn: Function, context?: any): void
    init(): void
    manager: kit.AppManager
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
	return is_string(obj)?obj.toString():(String(obj).toString());
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
    
    export function alert(text: string, callbackAlert?: Function, context?: any, opts?: ui.IMessageBoxOptions): ui.IMessageBoxReturn {
        if(app.messageBox) {
            return app.messageBox.alert(app.title(), text, callbackAlert, context, opts)
        }
        var r = window.alert(text)
        if(callbackAlert) {
            callbackAlert.call(context, r)
        }
        return <any>r;
    }

    export function confirm(text: string, callbackOk?: Function, callbackCancel?: Function, context?: any, opts?: ui.IMessageBoxOptions): ui.IMessageBoxReturn {
        if(app.messageBox) {
            return app.messageBox.confirm(app.title(), text, callbackOk, callbackCancel, context, opts)
        }
        var r = window.confirm(text)
        if(r && callbackOk) {
            callbackOk.call(context, r)
        }
        if(!r && callbackCancel) {
            callbackCancel.call(context, r)
        }
        return <any>r;
    }
}

