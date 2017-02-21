interface Object {
    keysAt(o: Object, index: number): string;
    _keys(o: Object, index?: number): any;
    keys(o: Object): string[];
    values(o: Object): any[];
    findBy(o: Object, field: string, value: any): any;
    findManyBy(o: Object, field: string, value: any): any[];
    hasKeys(o: Object): boolean;
    toJson(o: Object): Object;
}
interface String {
    lPad(pchar: string, length: number): any;
    rPad(pchar: string, length: number): any;
    toHex(): string;
    startsWith(str: string): boolean;
    endsWith(str: string): boolean;
    replaceAll(strToReplace: string, str: string): string;
    left(len: number): string;
    right(len: number): string;
    RTrim(value?: string): string;
    LTrim(value?: string): string;
    format(...args: any[]): string;
    random(n?: number): string;
    shake(): string;
    text(allowed?: string): string;
    toProperCase(): string;
    contains(str: string): boolean;
}
interface StringConstructor {
    generate(n?: number): string;
    format(str: string, ...args: any[]): string;
}
declare function sprintf(str: string, ...args: any[]): string;
interface Date {
    getUTCTime(): number;
    getTimeAge(d?: Date, i?: string, o?: any): number;
    getYearAge(d?: Date): number;
    getMonthAge(d?: Date): number;
    add(i: string, n: number): void;
    addMonth(n: number): void;
    addYear(n: number): void;
    addDate(n: number): void;
    isPast(d?: Date): boolean;
    isFuture(d?: Date): boolean;
    isToday(): boolean;
    getAge(d?: Date): any;
    isNow(): boolean;
    isSameDate(d?: Date): boolean;
}
interface Array<T> {
    indexOfStr(elt: T, from?: number): number;
    remove(o: T): T;
    removeAt(index: number): T;
    removeAll(l?: T[]): T[];
    clear(): T[];
    pushOnce(elt: T, caseSensitive?: boolean): boolean;
    findBy(field: string, value: any, from?: number): T;
    findManyBy(field: string, value: any, from?: number): T[];
    union(o: any[]): any[];
    fusion(o: any): any[];
    get(ind: number): T;
    contains(o: T): boolean;
    contains(o: T[]): boolean;
    union(o: T[]): T[];
    first(): T;
    last(): T;
    equals(ary: T[]): boolean;
    shake(): T[];
}
interface Number {
    round(decimal?: number): number;
}
declare module kit.utils {
    /**
     * Clones the given instance.
     * @param {*} srcInstance An instance.
     * @return {*} The clone of the given instance.
     */
    function clone(srcInstance: any): any;
    function getElementText(element: any): string;
    function formatEmail(email: string): string;
    /**
     * Format a string by replacing argument expressed inside curly brackets with given arguments
     * Search occurences of a pattern of the form ${XXXX} or $XXX with the dolar sign not escaped
     * @return a formatted string
     */
    function formatString(str: string, parameters: any): string;
    function flattenObject(object: any): any;
    /**
     * Parse a given log message
     * log message MUST respect the following format
     *
     * 			var log_message = "log_id {param1:value1}{param2:value2}{param3:value3}"
     *
     * @param a log message as described above
     *
     * @return an object containing the log id and another object for the parameters
     * that contains for each param id, its associated value.
     */
    function parseLogMessage(logMessage: any): any;
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
    function getInternationalizedLogMessage(logMessage: any): string;
    function getParamValue(param: string, url?: string): string;
    function formatMonthToYear(PE_nbMonth: number, strict?: boolean): string;
    /**
     * format dates
     * @param dateFormat the date format defines in local index
     * @return a formatted string date in the "dateFormat" format
     */
    function formatDate(d: Date, dateFormat: string, hourFormat?: string, utc?: boolean): string;
    /**
    * Traite et converti une chaine. La valeur peut être modifiée pour correspondre à une valeur date.
    * Renvoi un objet Calendar contenant la chaine traitée.
    *
    * @param string	La chaine
    * @param locale 	La locale utilisée
    */
    function parseLiteralDate(str: string, locale: Locale): Date;
    function formatDecimal(str: any, digits?: number, locale?: Locale): string;
    function genId(l?: number): string;
}
declare module kit.regexp {
    var CdPost: RegExp;
    var Email: RegExp;
    var AlphaNumerique: RegExp;
    var Alpha: RegExp;
    var Adresse: RegExp;
    var Mots: RegExp;
    var Integer: RegExp;
    var PositiveInteger: RegExp;
    var Double: RegExp;
    var PositiveDouble: RegExp;
    var NumTel: RegExp;
    var NumTelEtendu: RegExp;
    var NumTelPermissif: RegExp;
    var NumDossier: RegExp;
}
interface JQuery {
    ajaxForm: Function;
    crypt: Function;
    tooltipster: Function;
    appear: Function;
    nanoScroller: Function;
}
interface JQueryStatic {
    address: any;
    url: Function;
    cookie: Function;
    cookieBar: Function;
}
interface KnockoutStatic {
    linkObservableToUrl: any;
}
interface KnockoutUtils {
    isObservableArray(obj: any): boolean;
    dispose(obj: any): void;
}
interface KnockoutObservableArrayFunctions<T> {
    filterByProperty(propName: string, matchValue: string): KnockoutObservableArray<T>;
    clear(): T[];
}
interface KnockoutSubscribable<T> {
    (value?: any): any;
    subscribeOnce(callback: Function, context?: any, eventName?: string): KnockoutSubscription;
    immediateSubscribe(callback: Function, context?: any, eventName?: string): KnockoutSubscription;
    dependsOn(observable: KnockoutSubscribable<any>, fn?: Function, ope?: number): KnockoutSubscription;
    makeTrueIfNot(observable: KnockoutSubscribable<any>, ope?: number): KnockoutSubscription;
}
interface IDisposable {
    dispose(): void;
}
interface IApplicationContext {
    device: string;
    page: string;
}
interface IEventsBinder {
    on(eventId: any, callback: Function, context?: any): void;
    emit(...args: any[]): void;
}
interface IApplication extends IEventsBinder {
    title: KnockoutObservable<string>;
    i18n: kit.manager.I18n;
    browser: kit.helpers.Browser;
    manager: kit.AppManager;
    userData: any;
    webkitPath: string;
    webkitLogUri: string;
    basePath: string;
    servicesPath: string;
    useDialog: boolean;
    version: string;
    logLevel: number;
    logConsole: boolean;
    onAjaxSend: Function;
    getFinalFileName(fileName: string): string;
    navigateTo(href: string): void;
    context: IApplicationContext;
    isReady: KnockoutObservable<boolean>;
    ready(fn: Function, context?: any): void;
    init(userData?: any): void;
    mailto(data: any): void;
    postRedirect(url: string, data_post: any, target?: string, data_get?: any): void;
}
interface Window {
    app: IApplication;
    vm: any;
}
declare function isNaN(o: any): boolean;
declare var app: IApplication;
declare var browserLocaleInfos: any;
declare function isset(value: any): boolean;
declare function defer(fn: Function, delay?: number, context?: any): number;
declare function fire(fn: any, args?: any): void;
/**
*
* @param value
* @param nbdec
* @return
*/
declare function round(value: any, nbdec?: number): number;
/**
*
*/
declare function CString(obj: any): string;
/**
*
*/
declare function CFloat(obj: any, rnd?: number): number;
declare function CNumber(obj: any, rnd?: number): number;
/**
*
*/
declare function CInt(obj: any): number;
/**
*
* @param obj
* @return
*/
declare function is_string(obj: any): boolean;
/**
*
* @param obj
* @return
*/
declare function is_numeric(obj: any): boolean;
declare function dispose(obj: Object): void;
declare module kit {
    function alert(text: string, callbackAlert?: any, opts?: ui.IMessageBoxOptions): ui.MessageBox;
    function confirm(text: string, callbackOk?: Function, callbackCancel?: any, opts?: ui.IMessageBoxOptions): ui.MessageBox;
}
/**
 * @fileOverview This file defines the errors module.
 * @example var _errorsHelper = oneesp.module('commons.helper.errors');
 */
declare module kit.helpers {
    /**
     * MODES
     * @enum {int}
     * @memberOf oneesp.module.commons.helper.errors#
     */
    enum TLogLevel {
        TRACE = 0,
        DEBUG = 1,
        INFO = 2,
        WARN = 3,
        ERROR = 4,
        FATAL = 5,
    }
    interface ILogAppender {
        level: TLogLevel;
        log(className: string, level: TLogLevel, text: string, e?: any, date?: Date): void;
    }
    class Appender {
        level: TLogLevel;
        formatMessage(className: string, date: Date, level: TLogLevel, message: string): string;
        constructor(level?: TLogLevel);
    }
    class ConsoleAppender extends Appender implements ILogAppender {
        constructor();
        log(className: string, level: TLogLevel, message: string, exception?: any, date?: Date): void;
    }
    class RemoteAppender extends Appender implements ILogAppender {
        url: string;
        constructor(url: string);
        log(className: string, level: TLogLevel, message: string, exception?: any, date?: Date): void;
    }
    class Logger {
        static loggers: any;
        appenders: ILogAppender[];
        /**
         * The current mode
         * @name mode
         * @type observable
         * @defaultValue Modes.DEVELOPMENT
         * @memberOf oneesp.module.commons.helper.errors#
         */
        level: KnockoutObservable<TLogLevel>;
        id: string;
        constructor(id: string, level?: TLogLevel);
        isTraceEnabled(): boolean;
        isInfoEnabled(): boolean;
        isDebugEnabled(): boolean;
        isWarnEnabled(): boolean;
        info(text: string, e?: any): void;
        warn(text: string, e?: any): void;
        trace(text: string, e?: any): void;
        debug(text: string, e?: any): void;
        error(text: string, e?: any): void;
        fatal(text: string, e?: any): void;
        log(className: string, level: TLogLevel, message: string, exception?: any, date?: Date): void;
        addAppender(appender: ILogAppender): void;
        /** return logger
         * @param {string} className
         */
        static getLogger(className: string): Logger;
        static getDefaultLogger(): Logger;
        static getConsoleAppender(): ILogAppender;
    }
}
/**
 * @fileOverview This file defines the query module.
 * @example var _queryHelper = oneesp.module('commons.helper.query');
 * @example var _queryHelper = oneesp.module('commons.helper.query').helper({ domain: APPLICATION_ID });
 */
declare module kit.helpers {
    interface IQueryOptions {
        silent?: boolean;
        delay?: number;
        dataType?: string;
        contentType?: any;
        async?: boolean;
        timeout?: number;
        domain?: string;
        cache?: boolean;
        upToDate?: boolean;
        headers?: any;
    }
    interface IQueryRequest {
        ID: number;
        method: string;
        url: string;
        data: any;
        callbacks: any;
        context: any;
        options: IQueryOptions;
        startedAt: number;
    }
    interface IQueryCallbacks {
        success?: Function;
        fail?: Function;
        complete?: Function;
    }
    class Query {
        static defaultOptions: IQueryOptions;
        static DEFAULT_DELAY: number;
        /** The number of current queries processed
         * @name nbQueries
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static nbQueries: KnockoutObservable<number>;
        /** Return if a query is running
         * @name isBusy
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static isBusy: KnockoutObservable<boolean>;
        /** Return if the socket is disconnected
         * @name isDisconnected
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static isDisconnected: KnockoutObservable<boolean>;
        /** Return if the module is locked. When it is locked, no query will be sent.
         * @name isLocked
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         * @example _queryHelper.isLocked(true); //Do lock
         * @example _queryHelper.isLocked(true); //Unlock
         */
        static isLocked: KnockoutObservable<boolean>;
        /** Return the current stack of requests
         * @memberOf oneesp.module.commons.helper.query#
         * @returns {array}
         */
        static getCurrentStackRequests(): {
            [key: string]: IQueryRequest;
        };
        /** The status codes
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static Status: {
            SUCCESS: string;
            ERROR: string;
            ABORT: string;
            NOCONTENT: string;
            TIMEOUT: string;
        };
        /** The methods
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static Methods: {
            PUT: string;
            PATCH: string;
            GET: string;
            POST: string;
            DELETE: string;
        };
        /** The states
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static States: {
            REJECTED: string;
        };
        id: string;
        opts: IQueryOptions;
        constructor(id: string, opts?: IQueryOptions);
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
        PUT(url: string, data: any, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
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
        GET(url: string, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
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
        GETasJson: (url: string, callbacks: any, context?: any, opts?: IQueryOptions) => JQueryXHR;
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
        POST(url: string, data: any, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
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
        DELETE(url: string, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        private mergeOptions(opts);
        /**
         * Return an helper
         * @param {string} id - The id  (optional)
         * @param {IQueryOptions} opts - The options
         * @returns {Query}
         * @memberOf oneesp.module.commons.helper.query#
         * @example queryHelper.helper('MyHelper', { domain true});
         * @example queryHelper.helper({ domain true});
         */
        static create(opts?: IQueryOptions): Query;
        /**
         * Send a query request from HTML form
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         */
        static queryFormData(form: HTMLFormElement, callbacks?: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a query request
         * @param {Methods} method - The http method
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         */
        static query(method: string, url: string, data: any, callbacks?: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a PUT request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static PUT(url: string, data: any, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a PATCH request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static PATCH(url: string, data: any, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a GET request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static GET(url: string, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a GET request and get a json object as result
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static GETasJson(url: string, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a POST request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static POST(url: string, data: any, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
        /** Send a DELETE request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static DELETE(url: string, callbacks: any, context?: any, opts?: IQueryOptions): JQueryXHR;
    }
}
/**
 * @fileOverview This file defines the storage module
 */
declare module kit.helpers {
    interface IStorageOptions {
        crypt?: boolean;
    }
    class Storage {
        static put(name: string, value: any, opts?: IStorageOptions): boolean;
        static putObject(name: string, json: any, opts?: IStorageOptions): boolean;
        static read(name: string, opts?: IStorageOptions): string;
        static remove(name: any): boolean;
        static readAsObject(name: string, opts?: IStorageOptions): Object;
        static readAsNumber(name: string, opts?: IStorageOptions): number;
    }
}
/**
 * @fileOverview This file defines the browser support
 */
declare module kit.helpers {
    var getBrowserLanguage: () => string;
    class BrowserInfo {
        browser: string;
        version: number;
        OS: string;
        language: string;
        countryCode: string;
        private versionSearchString;
        constructor();
        /** Détermine si on est PROBABLEMENT sur la version ModernUI (on ne peut pas en être sûr, merci Microsoft) */
        isProbablyModernUI(): boolean;
        private searchString(data);
        private searchVersion(dataString);
    }
}
/**
 * @fileOverview This file defines the browser support
 */
declare module kit.helpers {
    interface ISupportedBrowserInfo {
        name: string;
        minVersion: number;
    }
    class Browser {
        currentBrowserInfos: BrowserInfo;
        private supportedVersions;
        constructor(supportedVersions?: ISupportedBrowserInfo[]);
        setSupportedVersions(supportedVersions: ISupportedBrowserInfo[]): void;
        /**
         * Retourne les informations issues du browser
         */
        getCurrentBrowserInfos(): BrowserInfo;
        /**
         * Contrôle le navigateur et la version min par rapport aux informations du browser
         */
        check(fn?: Function): boolean;
        /**
         * Contrôle le navigateur et la version min par rapport aux informations passées en parametres
         */
        checkForBrowser(browserName: string, version: number, fn?: Function): boolean;
    }
}
/**
 * @fileOverview This file defines the files manager.
 */
declare module kit.helpers {
    function loadResource(resource: string, callback: Function, context?: any): void;
}
/**
 * @fileOverview This file defines a simple xml to json converter.
 */
declare module kit.helpers {
    class XmlConverter {
        static ATTRIBUTES_KEY: string;
        /**
         * Converts XML to JSON.
         */
        static toJson(xml: Node): any;
    }
}
declare module kit {
    class Locale {
        decimalGroupSeparator: string;
        decimalGroupDigits: number;
        decimalSeparator: string;
        dateFormat: string;
        dateSeparator: string;
        dateLiteralFormat: string;
        currencySymbol: string;
        displayName: string;
        private language;
        private isoCode;
        constructor(language: string, isoCode: string);
        getLang(): string;
        getIsoCode(): string;
    }
}
declare module kit {
    class AppManager {
        private _managers;
        private _binders;
        private _isRunningLock;
        private _unsynchronized;
        private checkBinders();
        register(managerId: string, manager: BaseManager): BaseManager;
        exists(managerId: string): BaseManager;
        get(managerId: string): BaseManager;
        getManagers(): any;
        private addBinder(managerId, fn, context, ifReady);
        ready(managerId: any, fn: Function, context?: any): void;
        require(managerId: any, fn: Function, context?: any): void;
    }
}
declare module kit {
    interface IEvent {
        id: string;
        arguments: any;
    }
    class EventsBinder implements IEventsBinder, IDisposable {
        private __event__;
        private __subscriptions__;
        on(eventId: any, callback: Function, context?: any): void;
        emit(...args: any[]): void;
        clearSubscriptions(): void;
        dispose(): void;
    }
}
declare module kit {
    var inherits: Function;
    /**
     * A module.
     */
    class BaseManager extends EventsBinder {
        executionContext: any;
        private _domains;
        private _domainCounter;
        /**
        * A value that indicates whether this module is ready.
        * @type {ko.observable(boolean)}
        */
        isReady: KnockoutObservable<boolean>;
        constructor();
        init(): void;
        /**
         * Executes the given callback when this module is ready.
         * @param callback The function to execute when this module is ready.
         * @param context The context for the given callback.
         */
        ready(callback: Function, context?: any): boolean;
    }
}
declare module kit {
    class ViewModel extends EventsBinder implements IDisposable {
        private _bindings;
        strings: any;
        constructor(stringsToRegister: string[]);
        addStringToModel(id: string): void;
        addStringsToModel(ids: string[]): void;
        dispose(): void;
        applyBindings(element: string, bindings: string): any;
        applyBindings(element: JQuery, bindings?: string): any;
        applyBindings(element: string, bindings?: any): any;
        applyBindings(element: JQuery, bindings?: any): any;
        removeBindings(element: string): any;
        removeBindings(element: JQuery): any;
        clearBindings(): void;
    }
}
declare module kit {
    class ResponsiveViewModel extends ViewModel {
        normalWidth: number;
        tabletWidth: number;
        isMobile: KnockoutObservable<boolean>;
        isTablet: KnockoutObservable<boolean>;
        isNormal: KnockoutObservable<boolean>;
        constructor(stringsToRegister: string[]);
    }
}
declare module kit {
    class MVVM extends ViewModel {
        /**
         * The content encapsulated in this view.
         * @type {jQuery.Object}
         */
        private htmlContent;
        private content;
        private owner;
        private view;
        loadingState: KnockoutObservable<boolean>;
        isLoaded: KnockoutObservable<boolean>;
        isLoading: KnockoutObservable<boolean>;
        constructor(view: string, stringsToRegister?: string[]);
        private _load(htmlContent, callback?);
        load(callback?: Function, htmlContent?: string): void;
        loadTo(owner: string, callback?: Function): void;
        beforePrepare(): void;
        afterPrepare(): void;
        prepare(): void;
        unload(): void;
        _unload(): void;
        dispose(): void;
        getContent(): JQuery;
        getView(): string;
    }
}
declare module kit {
    interface IDialogOptions {
        zIndex?: number;
        height?: string;
        width?: string;
        resizable?: boolean;
        draggable?: boolean;
        modal?: boolean;
        dialogClass?: string;
    }
    /** Predefined buttons to show
     * @alias Button
     * @enum {string}
     * @example _messageBox.Button.OkCancel;
     */
    var TDialogButtons: {
        Ok: string;
        OkCancel: string;
        YesNoCancel: string;
        YesNo: string;
    };
    /** Result of a callback (using predefined buttons)
     * @alias Button
     * @enum {string}
     * @example _messageBox.Result.Ok;
     */
    var TDialogResults: {
        None: string;
        Ok: string;
        Cancel: string;
        Yes: string;
        No: string;
    };
    class MVVMDialog extends MVVM {
        private title;
        private dialogOptions;
        private buttons;
        private result;
        private callback;
        constructor(title: string, view: string, buttons: any, callback: any, opts?: IDialogOptions);
        private _show(fn?);
        getResult(): any;
        show(fn?: Function): void;
        hide(): void;
        buildButtons(button: any): any[];
        centerize(): void;
        isVisible(): boolean;
        destroy(): void;
        prepare(): void;
    }
}
declare module kit.manager {
    enum TSupportedLanguages {
        fr_FR = 0,
    }
    var SUPPORTED_LANGUAGES: {
        [key: string]: string;
    };
    class I18n extends BaseManager {
        uri: string;
        oListLocales: any;
        isStringsReady: KnockoutObservable<boolean>;
        localizedStrings: {
            [key: string]: string;
        };
        localizedObservableStrings: {
            [key: string]: KnockoutObservable<string>;
        };
        private static oLogger;
        /**
         * The current resources language.
         * @type {ko.observable(string)}
         */
        language: KnockoutObservable<string>;
        constructor(browserLanguageInfos: any);
        getCurrentLocale(): Locale;
        getLocale(isoCode: string): Locale;
        getSupportedLanguages(): any;
        loadStrings(lang?: string): void;
        private updateObservableStrings();
        getObservableString(key: string, defaultValue?: string): KnockoutObservable<string>;
        /**
         * Gets the localized string for the given key.
         * @param {string} key The key of the desired label.
         * @return {string} The localized string.
         */
        getString(key: string, defaultValue?: string): string;
        getCurrentLanguage(): string;
        getLanguageFromBrowser(): string;
        static getStringOrKey(str: string, key: string): string;
        getStringsUrl(language: string): string;
        init(): void;
    }
}
declare module kit {
    import Browser = helpers.Browser;
    import I18n = manager.I18n;
    class Application extends EventsBinder {
        title: KnockoutObservable<string>;
        isReady: KnockoutObservable<boolean>;
        version: string;
        manager: AppManager;
        logLevel: number;
        logConsole: boolean;
        useDialog: boolean;
        servicesPath: string;
        basePath: string;
        webkitPath: string;
        webkitLogUri: string;
        i18n: I18n;
        browser: Browser;
        context: IApplicationContext;
        userData: any;
        onAjaxSend: Function;
        constructor();
        getFinalFileName(fileName: string): string;
        navigateTo(href: string): void;
        postRedirect(url: string, data_post: any, target?: string, data_get?: any): void;
        ready(fn: Function, context?: any): void;
        /**
         * Affiche la bar pour acceptation des cookies
         */
        showCookieBar(options?: any): void;
        /**
         * Envoi d'un email
         */
        mailto(data: any): void;
        init(userData?: any): void;
    }
}
declare module kit.ui {
    interface IMessageBoxOptions extends IDialogOptions {
        icon?: string;
        id?: string;
    }
    interface IMessageBoxReturn {
        id: string;
        opts: IMessageBoxOptions;
        view: any;
        dialog: any;
    }
    class MessageBox extends MVVMDialog {
        private static _stringTemplate;
        private static _popinTemplate;
        private id;
        private dialog;
        private text;
        private icon;
        constructor(title: string, text: string, buttons?: any, callback?: any, opts?: IMessageBoxOptions);
        init(opts?: IMessageBoxOptions): void;
        getId(): string;
        /**
         * @Override
         */
        hide(): void;
        /** Show an alert dialog box with button 'OK'
         * @param {string} title - The box title
         * @param {string} text - The box content text
         * @param {function} callback - The function to call when the user push the 'OK' button
         * @param {object} [context=] - Context to use with the callback
         * @param {object} [options={icon:'warn'}] - dialog box options
         * @returns dialog object
         * @example MessageBox.alert('Hello', 'Hello world !', function() { //do action });
         */
        static alert(title: string, text: string, callback?: any, options?: IMessageBoxOptions): MessageBox;
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
        static confirm(title: string, text: string, okCallback: any, cancelCallback?: any, options?: IMessageBoxOptions): MessageBox;
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
         * var buttons = {'confirm':'Yes, I confirm', 'unconfirm':'No, I do not confirm'];
         * MessageBox.create('Hello world !', 'Hello', buttons, function(result) {
         *      if(result == 'confirm') {
         *          // do Confirm
         *      } else {
         *          // do Unconfirm
         *      }
         * });
         */
        static create(title: string, text: string, buttons: any, callback?: any, opts?: IMessageBoxOptions): MessageBox;
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
        static popin(text: string, messageType?: string, timeout?: number): void;
    }
}
declare module kit.ui {
    interface IGlassPanelOptions {
        text?: string;
        progressionText?: string;
        currentStep?: number;
        totalSteps?: number;
    }
    class GlassPanel extends MVVM {
        private static oLogger;
        id: string;
        lockKeyBoard: boolean;
        isVisible: KnockoutObservable<boolean>;
        text: KnockoutObservable<string>;
        progressionText: KnockoutObservable<string>;
        currentStep: KnockoutObservable<number>;
        totalSteps: KnockoutObservable<number>;
        private progression;
        private steps;
        private animationDuration;
        animation: KnockoutObservable<any>;
        constructor(id: string, properties?: IGlassPanelOptions);
        private _update();
        update(properties: IGlassPanelOptions): void;
        load(): void;
        animate(animation: any, fn?: Function): void;
        show(fn?: Function): void;
        hide(fn?: Function): void;
        destroy(): void;
        /** Show an explicit glasspanel (using his ID)
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} ID - The ID specified
         * @returns {undefined}
         */
        static show(id?: string): void;
        /** Hide an explicit glasspanel (using his ID)
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} ID - The ID specified
         * @returns {undefined}
         */
        static hide(id?: string): void;
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
        static create(id?: string, opts?: IGlassPanelOptions): GlassPanel;
        /** Destroy a glassPanel
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} [ID='main'] - The ID of the glassPanel to destroy (destroy the main by default)
         * @returns {undefined}
         */
        static destroy(id?: string): void;
        static update(properties: IGlassPanelOptions, id?: string): void;
        /** Get an explicit glassPanel using his ID
         * @memberOf oneesp.manager.commons.glassPanel#
         * @param {string} [ID='main'] - The ID of the glassPanel to return (The main by default)
         * @returns {undefined}
         */
        static getPanel(id?: string): GlassPanel;
    }
}
declare module kit.fields {
    class Tooltip {
        uid: string;
        /**
         * The text.
         * @type {string}
         */
        text: KnockoutObservable<string>;
        show: KnockoutObservable<boolean>;
        animation: string;
        position: string;
        type: KnockoutObservable<string>;
        constructor(uid?: string);
        setText(resourceId: string, defaultId?: string): void;
    }
}
declare module kit.fields {
    interface IUIField {
        isReadOnly: KnockoutSubscribable<boolean>;
        isDisabled: KnockoutSubscribable<boolean>;
        isRequired: KnockoutSubscribable<boolean>;
        isVisible: KnockoutSubscribable<boolean>;
        isEditable: KnockoutSubscribable<boolean>;
        isLastInputValid: KnockoutSubscribable<boolean>;
        hasChanged: KnockoutSubscribable<boolean>;
        isFormValid: KnockoutSubscribable<boolean>;
        isFocused: KnockoutSubscribable<boolean>;
        hasBeenVisited: KnockoutSubscribable<boolean>;
        hasWarns: KnockoutSubscribable<boolean>;
        messages: KnockoutObservableArray<InputUIFieldMessage>;
        showMessages: KnockoutSubscribable<boolean>;
        applyChanges(): void;
        cancelChanges(): void;
        id: string;
        isEmpty(): KnockoutSubscribable<boolean>;
    }
    class BaseUIField extends EventsBinder implements IDisposable {
        /**
          * The parameter identifier.
          * @type {string}
          */
        id: string;
        /**
          * The parameter unique identifier.
          * @type {string}
          */
        uid: string;
        tooltip: Tooltip;
        /**
        * The label for this property.
        * @type {ko.observable<string>}
        */
        label: KnockoutObservable<string>;
        sub: KnockoutObservable<string>;
        formattedLabel: KnockoutComputed<string>;
        labelArgs: KnockoutObservable<any>;
        showLabel: KnockoutObservable<boolean>;
        constructor(id: string, bShowLabel?: boolean);
        formatLabel(label: string): string;
        dispose(): void;
    }
    /**
     * Constraint class for input validation rules
     */
    class InputUIFieldValidationConstraint implements IDisposable {
        name: string;
        fn: Function;
        isWarn: boolean;
        messageFn: Function;
        isValid: KnockoutComputed<boolean>;
        constructor(name: string, fn: Function, messageFn?: Function, isWarn?: boolean);
        dispose(): void;
    }
    class ValidationConstraintInfos {
        hasWarns: boolean;
        constructor();
    }
    /**
     * Constraint class for input validation rules
     */
    class InputUIFieldMessage {
        text: string;
        isWarn: boolean;
        constructor(text: string, isWarn?: boolean);
    }
    /**
     * A value for a property.
     * @param {Property} property The property.
     * @param {?(number|string)} value The value for this property.
     * @constructor
     */
    class InputUIField extends BaseUIField implements IUIField, IDisposable {
        static defaultShowMessages: boolean;
        /**
         * A value to not be equals to
         * @type string | array
         */
        wrongValue: any;
        /**
         * A value that indicates whether this field is read-only or read-write.
         * @type {boolean}
         */
        isReadOnly: KnockoutObservable<boolean>;
        isDisabled: KnockoutObservable<boolean>;
        isRequired: KnockoutObservable<boolean>;
        isVisible: KnockoutObservable<boolean>;
        isEditable: KnockoutObservable<boolean>;
        autoValidate: KnockoutObservable<boolean>;
        isEmpty: KnockoutObservable<boolean>;
        messages: KnockoutObservableArray<InputUIFieldMessage>;
        showMessages: KnockoutObservable<boolean>;
        /**
        * The value that indicates whether the field is focused
        * @type {ko.observable(boolean)}
        */
        isFocused: KnockoutObservable<boolean>;
        /**
         * The name attribute
         */
        name: KnockoutObservable<string>;
        /**
         * The validated value for this property.
         * @type {ko.observable(?(number|string))}
         */
        oldValue: KnockoutObservable<any>;
        /**
         * The validated value for this property.
         * @type {ko.observable(?(number|string))}
         */
        value: KnockoutSubscribable<any>;
        /**
         * The value that indicates whether the last input is valid.
         * @type {ko.observable(boolean)}
         */
        isLastInputValid: KnockoutObservable<boolean>;
        /**
         * The boolean value result controlled by an external process
         */
        externalValidationValue: KnockoutObservable<boolean>;
        /**
        * The value that indicates whether the value has changed.
        * @type {ko.observable(boolean)}
        */
        hasChanged: KnockoutComputed<boolean>;
        dataValue: KnockoutComputed<any>;
        /**
         * The value that indicates whether the field is valid.
         * @type {ko.observable(boolean)}
         */
        isFormValid: KnockoutComputed<boolean>;
        /**
         * The value that indicates is the field has warning messages
         * @type {ko.observable(boolean)}
         */
        hasWarns: KnockoutObservable<boolean>;
        /**
        * The value that indicates whether the field has been visited by user.
        * @type {ko.observable(boolean)}
        */
        hasBeenVisited: KnockoutObservable<boolean>;
        template: string;
        labelTemplate: string;
        inputTemplate: string;
        validationRule: KnockoutObservable<string>;
        validationConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint>;
        unvalidatedConstraints: KnockoutObservableArray<InputUIFieldValidationConstraint>;
        dataName: string;
        private _onBlurEventDefer;
        private _validationRule;
        placeholder: KnockoutObservable<string>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        getValuable(): KnockoutSubscribable<any>;
        setValidationRegExp(regExp: RegExp): IValidationRule;
        valueIsEmpty(value: any): boolean;
        isValidateValue(value: any): boolean;
        /**
        * Validation function to trigger
        * @type {function()}
        */
        validateValue(): void;
        /**
         * Computes the value that indicates whether the value has changed.
         * @type {function():boolean}
         * @return boolean
         */
        private computeHasChanged();
        private computeIsFormValid();
        /**
         *
         */
        isValidateConstraintsValue(value: any, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos?: ValidationConstraintInfos): boolean;
        /**
         * Add a warn constraint validation rule
         */
        addWarnConstraint(name: string, fn: Function, messageFn?: Function): InputUIFieldValidationConstraint;
        /**
         * Add a constraint validation rule
         */
        addConstraint(name: string, fn: Function, messageFn?: Function, isWarn?: boolean): InputUIFieldValidationConstraint;
        getDataValue(): string;
        /**
         * Set value and apply changes in one call
         */
        forceValue(value: any): void;
        applyChanges(): void;
        cancelChanges(): void;
        onBlurEventHandler(e: Event): boolean;
        onFocusEventHandler(e: Event): boolean;
        dispose(): void;
    }
}
declare module kit.fields {
    enum TTextCase {
        none = 0,
        upper = 1,
        lower = 2,
        proper = 3,
    }
    class TextUIField extends InputUIField {
        maxLength: number;
        minLength: number;
        /**
         * The formatted Value
         */
        formattedValue: KnockoutComputed<string>;
        hasTextChanged: KnockoutComputed<boolean>;
        pattern: KnockoutObservable<string>;
        useFormat: KnockoutObservable<boolean>;
        defaultAutoValidationDelay: number;
        private _autoValidationDelay;
        private _previousAutoValidationTimeset;
        private _autoValidationTimecount;
        private _autoValidationCountset;
        private _autoValidationDelayTimeout;
        private _autoValidationCoeff;
        autoTrim: KnockoutObservable<boolean>;
        textCase: KnockoutObservable<TTextCase>;
        inputType: KnockoutObservable<string>;
        valueUpdateOn: KnockoutObservable<string>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        private _updateValue(v?);
        transform(value: string): string;
        formatValue(value: string): string;
        cleanFormatValue(value: string): string;
        getDataValue(): string;
        isValidateValue(value: any): boolean;
        private computeHasTextChanged();
        /**
         * Override
         */
        onFocusEventHandler(e: Event): boolean;
        onBlurEventHandler(e: Event): boolean;
        onKeyDownEventHandler(e: Event): boolean;
        onKeyUpEventHandler(e: Event): boolean;
        dispose(): void;
    }
}
declare module kit.fields {
    class TextSearchUIField extends TextUIField {
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        onSearch(): void;
    }
}
declare module kit.fields {
    class PasswordUIField extends TextUIField {
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
    }
}
declare module kit.fields {
    class TextAreaUIField extends TextUIField {
        rows: KnockoutObservable<number>;
        scrollGlue: KnockoutObservable<boolean>;
        keyLock: KnockoutObservable<boolean>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        append(s: string): void;
        clear(): void;
        flush(): string;
        scrollToBottom(): void;
        isScrollToBottom(): boolean;
    }
}
declare module kit.fields {
    class ToggleUIField extends InputUIField {
        textForTrue: KnockoutObservable<string>;
        textForFalse: KnockoutObservable<string>;
        valueForTrue: string;
        valueForFalse: string;
        isChecked: KnockoutComputed<boolean>;
        constructor(id: string, valueForTrue: any, valueForFalse: any, required?: boolean, readOnly?: boolean);
        isValidateValue(value: any): boolean;
    }
}
declare module kit.fields {
    class LabelUIField extends InputUIField {
        className: KnockoutObservable<string>;
        constructor(id: string, value: any, required?: boolean);
    }
}
declare module kit.fields {
    enum TNumericTypes {
        Integer = 0,
        PositiveInteger = 1,
        Double = 2,
        PositiveDouble = 3,
    }
    class NumericUIField extends TextUIField {
        locale: KnockoutObservable<Locale>;
        minimum: number;
        maximum: number;
        isMinimumExcluded: boolean;
        isMaximumExcluded: boolean;
        unit: KnockoutObservable<string>;
        digits: number;
        text: KnockoutComputed<string>;
        /**
         * Constructor
         */
        constructor(id: string, value: any, formatType: TNumericTypes, required?: boolean, readOnly?: boolean);
        /**
         * Get the reg expression from a format type
         * @param the format type
         * @return the RegExp or undefined
         */
        private static getNumericRegExp(formatType);
        /**
         * Check if the value is validated, included commons controls
         * @param value the value to check
         * @return true or false
         * @override
         */
        isValidateValue(value: any): boolean;
        /**
         * Check constraints
         */
        isValidateConstraintsValue(value: any, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos?: ValidationConstraintInfos): boolean;
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        formatValue(value: string): string;
        /**
         * Unformat a value seized by the user
         * @param value the value seized
         * @return the unformatted value
         * @override
         */
        cleanFormatValue(value: string): string;
        /**
         * Surcharge spécifique pour exclure les blancs de toute longueur.
         */
        valueIsEmpty(value: any): boolean;
    }
}
declare module kit.fields {
    class CurrencyUIField extends NumericUIField {
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
    }
}
/**
 * @fileOverview This file defines the Option class.
 *     It requires jQuery and KnockOut libraries.
 */
declare module kit.fields {
    /**
     * An option in a select input.
     * @param {string} value The value.
     * @param {string} text The text.
     * @constructor
     */
    class Option {
        /**
         * The value.
         * @type {string}
         */
        value: string;
        resourceId: string;
        resourceTextId: string;
        data: any;
        tooltip: Tooltip;
        disabled: KnockoutObservable<boolean>;
        /**
         * The text.
         * @type {string}
         */
        text: KnockoutObservable<string>;
        constructor(value: string, resourceId?: string, resourceTextId?: string);
        static afterRenderFunction(option: any, item: Option): void;
    }
}
declare module kit.fields {
    class SelectUIField extends InputUIField {
        private choices;
        private outputValue;
        private valuableValue;
        private _valueToSet;
        private _valueToForce;
        options: KnockoutObservableArray<any>;
        view: KnockoutObservable<string>;
        inline: KnockoutObservable<boolean>;
        selectedOptionText: KnockoutObservable<string>;
        selectedOption: KnockoutObservable<Option>;
        private __optionsThrottle;
        private _oldChoicesStringified;
        constructor(id: string, choices: any, value: any, required?: boolean, readOnly?: boolean);
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        isValidateValue(value: any): boolean;
        getValuable(): KnockoutSubscribable<any>;
        /**
         * Set value and apply changes in one call
         */
        forceValue(value: any): void;
        /**
         * Construit une liste d'éléments Option
         */
        getListOfOptions(newChoices: any): Option[];
        addChoices(newChoices: any): void;
        removeChoices(oldchoices: any): void;
        /**
         * Update this select with the given choices.
         */
        updateChoices(newChoices: any): void;
        viewRadiosOptionClickFunction(option: Option, e: any): void;
        /**
         * Retourne si la liste contient la valeur
         */
        hasChoice(choice: string[]): boolean;
        hasChoice(choice: string): boolean;
        sort(compareFn?: (a: Option, b: Option) => number): Option[];
        private updateListOfChoices(options?);
        listCount(): number;
        /**
         * @Override
         */
        getDataValue(): string;
        /**
         * Sélectionne la première page.
         */
        selectFirst(): void;
        /**
         * @Override
         */
        dispose(): void;
    }
}
declare module kit.fields {
    class EmailUIField extends TextUIField {
        static EMAIL_LIST_DELIMITER: string;
        allowMultiple: KnockoutObservable<boolean>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        isValidateValue(value: any): boolean;
        getDataValue(): string;
    }
}
declare module kit.fields {
    class DateUIField extends TextUIField {
        minDate: KnockoutObservable<Date>;
        maxDate: KnockoutObservable<Date>;
        date: KnockoutComputed<Date>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        parseDate(value: string): Date;
        formatValue(value: string): string;
        cleanFormatValue(value: string): string;
        isValidateValue(value: string): boolean;
        isValidateConstraintsValue(value: string, unvalidatedConstraints?: InputUIFieldValidationConstraint[], infos?: ValidationConstraintInfos): boolean;
    }
}
declare module kit.fields.datemultifield {
    class DateTextFieldTypes {
        static day: DateTextFieldTypes;
        static month: DateTextFieldTypes;
        static year: DateTextFieldTypes;
        id: string;
        minLength: number;
        maxLength: number;
        minimum: number;
        maximum: number;
        placeHolder: string;
        constructor(id: string, placeHolder: string, minLength: number, maxLength: number, minimum?: number, maximum?: number);
    }
    class DateTextUIField extends NumericUIField {
        oNextUIField: TextUIField;
        private dateType;
        constructor(id: string, dateType: DateTextFieldTypes, oNextUIField?: TextUIField);
        /**
         * Format a value to display it
         * @param value the value to display
         * @return the formatted value
         * @override
         */
        formatValue(value: string): string;
        /**
         * Unformat a value seized by the user
         * @param value the value seized
         * @return the unformatted value
         * @override
         */
        cleanFormatValue(value: string): string;
        onKeyUpEventHandler(e: Event): boolean;
    }
}
declare module kit.fields {
    class DateMultiFieldUIField extends DateUIField {
        oTextUIFieldDay: datemultifield.DateTextUIField;
        oTextUIFieldMonth: datemultifield.DateTextUIField;
        oTextUIFieldYear: datemultifield.DateTextUIField;
        separator: KnockoutObservable<string>;
        private _koUpdateValue;
        private _koIsFocusedMainField;
        private _koComputeIsLastInputValid;
        private _koComputeYearIsValid;
        private _koComputeMonthIsValid;
        private _koComputeDayIsValid;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        private broadcastEvents(uiField);
        /**
         * @Override cancelChanges
         */
        applyChanges(): void;
        /**
         * @Override cancelChanges
         */
        cancelChanges(): void;
        dispose(): void;
    }
}
declare module kit.fields {
    class CodePostalUIField extends InputUIField {
        oSelectUIField: SelectUIField;
        oTextUIField: TextUIField;
        isLoadingValues: KnockoutObservable<boolean>;
        sourceValueName: string;
        static onSearchFn: Function;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
        forceValue(value: string): void;
        /**
         * Override cancelChanges
         */
        cancelChanges(): void;
        /**
         * Override forceValue
         */
        forceValues(textValue: string, listValue: string): void;
        getTextDataValue(): string;
        getSelectedOptionLabel(): string;
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        isValidateValue(value: any): boolean;
    }
}
declare module kit.fields {
    class GridPasswordUIField extends InputUIField {
        oRandomChars: KnockoutComputed<string[]>;
        oObfuscatedPassword: KnockoutComputed<string>;
        oTabChars: KnockoutObservable<string>;
        oGridSize: KnockoutObservable<number>;
        oMaxLength: KnockoutObservable<number>;
        private sObfuscatedChar;
        /**
         * Constructeur
         */
        constructor(id: string, required?: boolean, gridSize?: number);
        /**
         * Evenement lors du clique sur un bouton
         */
        onClickChar(char: string): void;
        /**
         * @Override
         */
        isValidateValue(value: any): boolean;
        /**
         * Efface la saisie
         */
        clear(): void;
        /**
         * Annuler la dernière entrée
         */
        cancel(): void;
    }
}
/**
 * @fileOverview This file defines the UIField class.
 *     It requires jQuery and KnockOut libraries.
 */
declare module kit.fields {
    function getId(name: string, ind?: number): string;
    interface IValidationRule {
        test(value: any): boolean;
    }
    class RegExpValidationRule implements IValidationRule {
        private regExp;
        constructor(regExp: RegExp);
        test(value: any): boolean;
    }
    class ProgressBarUIField extends InputUIField {
        constructor(id: string, value: any);
        refresh(): void;
    }
    class StatusUIField extends LabelUIField {
        isRunning: KnockoutObservable<boolean>;
        constructor(id: string, value: any);
    }
    class CustomSelectUIField extends InputUIField {
        static CUSTOM_CHOICE: string;
        options: KnockoutObservableArray<any>;
        isCustomChoiceSelected: KnockoutObservable<boolean>;
        selectUIField: KnockoutObservable<SelectUIField>;
        customUIField: KnockoutObservable<InputUIField>;
        constructor(id: string, choices: any, value: any, required?: boolean, readOnly?: boolean, customUIField?: InputUIField);
        isCustomValue(v: string): boolean;
        cleanCustomValue(v: string): string;
        getCustomOption(): Option;
        hasCustomOption(): boolean;
        private addRemoveCustomChoice(bAdd);
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        isValidateValue(value: any): boolean;
        /**
         * Update this select with the given choices.
         */
        updateChoices(newChoices: any): void;
    }
    class AutoCompleteUIField extends TextUIField {
        valuesList: KnockoutObservableArray<any>;
        constructor(id: string, value: any, required?: boolean, readOnly?: boolean);
    }
    class SelectCondUIField extends SelectUIField {
        condUIField: InputUIField;
        condValue: string;
        constructor(id: string, condUIField: InputUIField, condValue: string, choices: any, value: any, required?: boolean, readOnly?: boolean);
        /**
         * Validates the value for the property.
         * @param {?(number|string)} value The value for this property.
         * @type {function({?(number|string)})}
         */
        isValidateValue(value: any): boolean;
    }
    class ActionUIField extends InputUIField {
        action: Function;
        constructor(id: string, label: string, action: Function, context?: any, readOnly?: boolean);
    }
}
declare module kit {
    import IUIField = fields.IUIField;
    import BaseUIField = fields.BaseUIField;
    import InputUIFieldMessage = fields.InputUIFieldMessage;
    class GroupUIField extends BaseUIField implements IUIField, IDisposable {
        oListOfUIField: KnockoutObservableArray<IUIField>;
        oListOfEnableNVisibleUIField: KnockoutComputed<IUIField[]>;
        oLengthOfListOfEnableNVisibleUIField: KnockoutComputed<number>;
        isLastInputValid: KnockoutSubscribable<boolean>;
        isDisabled: KnockoutSubscribable<boolean>;
        isReadOnly: KnockoutSubscribable<boolean>;
        isRequired: KnockoutSubscribable<boolean>;
        isEditable: KnockoutSubscribable<boolean>;
        isVisible: KnockoutSubscribable<boolean>;
        isFormValid: KnockoutSubscribable<boolean>;
        hasChanged: KnockoutSubscribable<boolean>;
        hasWarns: KnockoutSubscribable<boolean>;
        isEmpty: KnockoutSubscribable<boolean>;
        isFocused: KnockoutSubscribable<boolean>;
        messages: KnockoutObservableArray<InputUIFieldMessage>;
        showMessages: KnockoutSubscribable<boolean>;
        private oComputedMessages;
        private hasBeenVisitedTrigger;
        hasBeenVisited: KnockoutObservable<boolean>;
        constructor(id: string, PE_oListOfUIField?: IUIField[], bShowLabel?: boolean);
        addUIField(PE_oUIField: IUIField): void;
        private createComputedBoolean(subscribableName, testValue, allCombined?, throttle?);
        private createComputedMessages();
        private readBoolean(subscribableName, testValue?, allCombined?);
        private writeBoolean(subscribableName, v);
        private runFunction(functionName, args?);
        applyChanges(): void;
        cancelChanges(): void;
        /**
         * Libère correctement la mémoire
         */
        dispose(): void;
    }
}
declare module kit {
    import IUIField = fields.IUIField;
    class FieldsValidatorDigest extends GroupUIField implements IDisposable {
        private oComputed;
        messagesArgs: KnockoutObservable<any>;
        inspectChilds: KnockoutObservable<boolean>;
        constructor(PE_oListOfIUIField?: IUIField[], messagesArgs?: any, inspectChilds?: boolean);
        /**
         * Ajoute un champ au validateur
         */
        addField(field: IUIField): void;
        addUIFields(PE_oListOfIUIField?: IUIField[]): void;
        treatListOfFields(oListOfIUIFieldArray: IUIField[], messagesArgs: any, bRecursive: boolean): void;
        dispose(): void;
    }
}
declare module kit {
    import InputUIField = fields.InputUIField;
    class ScreenSequence extends GroupUIField {
        static defaultAnimationIn: any;
        static defaultAnimationOut: any;
        static defaultAnimationError: any;
        id: string;
        templateName: KnockoutObservable<string>;
        isSubmited: KnockoutObservable<boolean>;
        animationIn: any;
        animationOut: any;
        animationError: any;
        data: any;
        constructor(id: string, templateName: string, fields: InputUIField[], data?: any, animationIn?: any, animationOut?: any, animationError?: any);
        show(): boolean;
        hide(): boolean;
        beforeSubmit(): boolean;
        submit(): boolean;
        afterRender(): void;
    }
    class ScreenSequenceView extends ScreenSequence {
        isVisible: KnockoutObservable<boolean>;
        constructor(id: string, templateName: string, data?: any, animationIn?: any, animationOut?: any, animationError?: any);
    }
}
declare module kit {
    class Sequence extends EventsBinder {
        hashScreen: KnockoutObservable<string>;
        screens: KnockoutObservableArray<ScreenSequence>;
        transitionDelay: number;
        currentScreen: KnockoutObservable<ScreenSequence>;
        currentAnimation: KnockoutObservable<any>;
        schema: KnockoutComputed<ScreenSequence[]>;
        hasNext: KnockoutObservable<boolean>;
        hasPrevious: KnockoutObservable<boolean>;
        nextScreen: KnockoutObservable<ScreenSequence>;
        previousScreen: KnockoutObservable<ScreenSequence>;
        constructor(screens: ScreenSequence[], transitionDelay?: number);
        getScreenById(id: string): ScreenSequence;
        private updateDependencies(screen?);
        getFirstScreenToComplete(): ScreenSequence;
        link(pname: string, updateUri?: boolean, defaultScreenId?: any): string;
        /**
         * Start sequence
         */
        start(): boolean;
        refresh(): void;
        getFirstDependentScreenTo(screen: ScreenSequence): ScreenSequence;
        getCurrentIndexOfScreen(screen?: ScreenSequence): number;
        afterRender(): void;
        submit(): boolean;
        beforeNext(screen: ScreenSequence, next: ScreenSequence): boolean;
        next(): boolean;
        beforePrevious(screen: ScreenSequence, prev: ScreenSequence): boolean;
        previous(): boolean;
        findById(id: string): ScreenSequence;
        show(screen?: any): string;
    }
}
declare module kit {
    import InputUIField = fields.InputUIField;
    interface IDOMField {
        fields: InputUIField[];
        onDOMField(fieldType: string, name: string, field: InputUIField): any;
    }
}
declare module kit.components {
    abstract class DefaultBinding implements KnockoutBindingHandler {
        private name;
        options: any;
        constructor(name: string);
        getName(): string;
    }
}
declare module kit.components {
    import InputUIField = fields.InputUIField;
    class FieldBinding extends DefaultBinding {
        private static constructorList;
        constructor();
        static setConstructor(typeName: string, construct: Function): void;
        static getConstructor(typeName: string): Function;
        static construct(typeName: string, name: string, defaultValue: string, required: boolean): InputUIField;
        init(element: any, valueAccessor: any): void;
    }
}
declare module kit.components {
    class RegisterBindingsManager extends EventsBinder {
        register(binding: DefaultBinding): void;
    }
}
declare module kit.components {
    interface RegisterCallbacksInterface {
        create(domElement: HTMLElement): any;
        attach(domElement: HTMLElement): any;
        detach(domElement: HTMLElement): any;
        addAttribute(domElement: HTMLElement): any;
        removeAttribute(domElement: HTMLElement): any;
        modifyAttribute(domElement: HTMLElement): any;
    }
    abstract class DefaultElement implements RegisterCallbacksInterface {
        private tagName;
        constructor(tagName: string);
        getTagName(): string;
        abstract create(domElement: HTMLElement): any;
        attach(domElement: HTMLElement): void;
        detach(domElement: HTMLElement): void;
        addAttribute(domElement: HTMLElement): void;
        removeAttribute(domElement: HTMLElement): void;
        modifyAttribute(domElement: HTMLElement): void;
    }
}
declare module kit.components {
    class WebKitFieldElement extends DefaultElement {
        constructor();
        private createFieldFromHTMLElement(domElement);
        create(domElement: HTMLElement): void;
    }
}
interface Document {
    registerElement: Function;
}
declare module kit.components {
    class RegisterElementManager extends EventsBinder {
        register(def: DefaultElement): void;
    }
}
declare module kit.main {
}
/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the readonly custom binding.
 * 		It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the datetimepicker custom binding.
 *     It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the accordion custom binding
 *		It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the format custom binding
 *		It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
    var format: (content: any) => string;
}
/**
 * @fileOverview This file defines the format custom binding
 *		It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the load custom binding
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the loadMention custom binding
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
/**
 * @fileOverview This file defines the inputType
 *      It requires jQuery and KnockOut libraries.
 */
declare module kit.bindings {
}
