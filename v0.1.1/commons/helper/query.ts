/**
 * @fileOverview This file defines the query module.
 * @example var _queryHelper = oneesp.module('commons.helper.query');
 * @example var _queryHelper = oneesp.module('commons.helper.query').helper({ domain: APPLICATION_ID });
 */
module kit.helpers {

    var log: Logger = Logger.getLogger('kit.helpers')
    
	export interface IQueryOptions {
		silent?: boolean
        delay?: number
        dataType?: string
        contentType?: string
        async?: boolean
        timeout?: number
        domain?: string
        cache?: boolean
        upToDate?: boolean
	}

	export interface IQueryRequest {
		ID: number
        method: string
        url: string
        data: any
        callbacks: any
        context: any
        options: IQueryOptions
        startedAt: number
	}

	export interface IQueryCallbacks {
		success?: Function;
		fail?: Function;
		complete?: Function;
	}

    /**
     * @private
     * @type handler
     * @memberOf oneesp.module.commons.helper.query
     */
    var _timer: number = null
    var _hInstances = {}
    var _hInstanceCounter: number = 0
    var _currentStackRequests: { [key: string]: IQueryRequest } = {}
    var _requestCount: number = 0
    
    export class Query {

        static defaultOptions: IQueryOptions = {}
        static DEFAULT_DELAY: number = 500

        /** The number of current queries processed
         * @name nbQueries
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static nbQueries: KnockoutObservable<number> = ko.observable(0)
        /** Return if a query is running
         * @name isBusy
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static isBusy: KnockoutObservable<boolean> = ko.observable(false)
        /** Return if the socket is disconnected
         * @name isDisconnected
         * @readonly
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         */
        static isDisconnected: KnockoutObservable<boolean> = ko.observable(false)
        /** Return if the module is locked. When it is locked, no query will be sent.
         * @name isLocked
         * @type observable
         * @memberOf oneesp.module.commons.helper.query#
         * @example _queryHelper.isLocked(true); //Do lock
         * @example _queryHelper.isLocked(true); //Unlock
         */
        static isLocked: KnockoutObservable<boolean> = ko.observable(false)

        /** Return the current stack of requests
         * @memberOf oneesp.module.commons.helper.query#
         * @returns {array}
         */
        static getCurrentStackRequests(): { [key: string]: IQueryRequest } {
            return _currentStackRequests
        }

        /** The status codes
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static Status = {
            SUCCESS: 'success',
            ERROR: 'error',
            ABORT: 'abort',
            NOCONTENT: 'nocontent',
            TIMEOUT: 'timeout'
        }

        /** The methods
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static Methods = {
            PUT: 'PUT',
            GET: 'GET',
            POST: 'POST',
            DELETE: 'DELETE'
        }

        /** The states
         * @readonly
         * @enum {string}
         * @memberOf oneesp.module.commons.helper.query#
         */
        static States = {
            REJECTED: 'rejected'
        }

        public id: string
        public opts: IQueryOptions

        constructor(id: string, opts?: IQueryOptions) {
            this.id = id
            this.opts = opts
        }

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
        public PUT(url: string, data, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.PUT(url, data, callbacks, context, this.mergeOptions(opts))
        }

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
        public GET(url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.GET(url, callbacks, context, this.mergeOptions(opts))
        }

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
        public GETasJson = function (url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.GETasJson(url, callbacks, context, this.mergeOptions(opts))
        }

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
        public POST(url: string, data, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.POST(url, data, callbacks, context, this.mergeOptions(opts))
        }

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
        public DELETE(url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.DELETE(url, callbacks, context, this.mergeOptions(opts))
        }

        private mergeOptions(opts: IQueryOptions): IQueryOptions {
            var tmp = $.extend({}, this.opts)
            return <IQueryOptions>$.extend(tmp, opts || {})
        }

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
        static create(id?: string, opts?: IQueryOptions): Query {

            if (typeof (id) == 'object' && opts == undefined) {
                opts = id;
                id = 'helper' + ++_hInstanceCounter;
            }

            if (opts == undefined) {
                return _hInstances[id];
            } else {
                _hInstances[id] = new Query(id, opts);
                return _hInstances[id];
            }
        }

        /** Send a query request
         * @param {Methods} method - The http method
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static query(method: string, url: string, data: any, callbacks: any = {}, context?, opts: IQueryOptions = {}): JQueryXHR {
            
            if (Query.isLocked()) {
                if(log.isWarnEnabled()) {
                    log.warn("Query is locked: request '%s %s' has not been sent".format(method, url));
                }
                return;
            }
            
            method = (method || 'GET').toUpperCase()

            var options: IQueryOptions = {
                silent: false,
                async: true,
                delay: Query.DEFAULT_DELAY,
                contentType: 'application/json;charset=utf-8'
            }

            options = $.extend(options, Query.defaultOptions)
            opts = $.extend(options, opts)

            if (!opts.silent) {
                if (Query.nbQueries() == 0) {
                    _timer = setTimeout(function () {
                        if(Query.nbQueries() > 0) {
                            if(log.isInfoEnabled()) {
                                log.info('Inform that Query processes are busy (delay: %s)'.format(opts.delay));
                            }
                            Query.isBusy(true)
                        }
                    }, opts.delay)
                }
                var nb: number = Query.nbQueries() + 1
                Query.nbQueries(nb)
                if(log.isTraceEnabled()) {
                    log.trace('Current query processes is now'.format(nb));
                }
            }

            if (typeof (callbacks) == 'function') {
                callbacks = {
                    complete: callbacks
                }
            }
            
            callbacks = $.extend({
                success: function () { },
                fail: function () { },
                complete: function () { }
            }, callbacks)

            data = data || {}
            //@obsolete Use cache option instead
            data._timestamp = opts.upToDate ? "" + new Date().getTime() : undefined

            if (opts.domain) {
                if (url.indexOf('?') <= 0) {
                    url = url + "?"
                } else {
                    url = url + "&"
                }
                
                url = url + "_domain=" + opts.domain
            }

            _requestCount++;

            var currentRequest: IQueryRequest = {
                ID: _requestCount,
                method: method,
                url: url,
                data: data,
                callbacks: callbacks,
                context: context,
                options: opts,
                startedAt: new Date().getTime()
            }

            _currentStackRequests[currentRequest.ID] = currentRequest

            if (method == Query.Methods.POST || method == Query.Methods.PUT) {
                data = (data && data != {}) ? JSON.stringify(data) : null
            }

            var params = {
                type: method,
                url: url,
                data: data,
                async: opts.async,
                dataType: opts.dataType,
                contentType: opts.contentType,
                context: currentRequest,
                cache: null,
                timeout: null
            }

            if (opts.cache != undefined && opts.cache != null) {
                params.cache = opts.cache
            }

            if (opts.timeout != undefined && !isNaN(opts.timeout)) {
                params.timeout = opts.timeout
            }

            if(log.isTraceEnabled()) {
                log.trace("Send request '%s %s'".format(method, url), params);
            }
            
            var jqXHR: JQueryXHR = $.ajax(params)

            jqXHR.done(function (data, textStatus, jqXHR) {
                if (this.callbacks.success) {
                    this.callbacks.success.call(this.context, data, textStatus, jqXHR)
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                    if (this.callbacks.fail) {
                        this.callbacks.fail.call(this.context, data, textStatus, jqXHR)
                }
            }).always(function (data, textStatus, jqXHR) {
                
                delete _currentStackRequests[this.ID]

                if (!this.options.silent) {
                    var nb: number = Query.nbQueries() - 1
                    Query.nbQueries(nb)
                    if(log.isTraceEnabled()) {
                        log.trace('Current query processes is now %s'.format(nb));
                    }
                    if (Query.nbQueries() == 0) {
                        clearTimeout(_timer)
                        _timer = null
                        Query.isBusy(false)
                        if(log.isInfoEnabled()) {
                            log.info('Query processes are no longer busy');
                        }
                    }
                }
                
                if (textStatus == Query.Status.NOCONTENT) {
                    textStatus = Query.Status.SUCCESS
                }

                if (textStatus == Query.Status.ERROR) {
                    if ($.inArray(data.status, [0, 12029, 12007]) != -1) {
                        Query.isDisconnected(true)
                    }
                }
                
                if (textStatus == Query.Status.SUCCESS && Query.isDisconnected()) {
                    Query.isDisconnected(false)
                }
                                                
                if (this.callbacks.complete) {
                    this.callbacks.complete.call(this.context, data, textStatus, jqXHR)
                }
                
            })

            return jqXHR
        }

        /** Send a PUT request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static PUT(url: string, data, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.query(Query.Methods.PUT, url, data, callbacks, context, opts)
        }

        /** Send a GET request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static GET(url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.query(Query.Methods.GET, url, null, callbacks, context, opts)
        }

        /** Send a GET request and get a json object as result
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static GETasJson(url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            opts = opts || {}
            opts.dataType = 'json'
            return Query.GET(url, callbacks, context, opts)
        }

        /** Send a POST request
         * @param {string} url - The url to call
         * @param {string} data - The data to send
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static POST(url: string, data, callbacks, context?, opts?: IQueryOptions): JQueryXHR  {
            return Query.query(Query.Methods.POST, url, data, callbacks, context, opts)
        }

        /** Send a DELETE request
         * @param {string} url - The url to call
         * @param {function} callbacks - The callback function
         * @param {object} context - The context
         * @param {object} opts - The options
         * @returns {object} jQuery handler
         * @memberOf oneesp.module.commons.helper.query#
         */
        static DELETE(url: string, callbacks, context?, opts?: IQueryOptions): JQueryXHR {
            return Query.query(Query.Methods.DELETE, url, null, callbacks, context, opts)
        }
    }
}