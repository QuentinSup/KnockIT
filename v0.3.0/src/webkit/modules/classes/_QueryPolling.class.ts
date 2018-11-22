import { Query } from '@webkit/helper/query';
import { EventsBinder } from '@webkit/core/EventsBinder.class';
    
export class QueryPolling extends EventsBinder {
    static DEFAULT_INTERVAL: number = 100;

    public dataType: string = "json"

    private interval: number = QueryPolling.DEFAULT_INTERVAL
    private retryInterval: number = QueryPolling.DEFAULT_INTERVAL

    private __jqxhr: JQueryXHR = null
    private __interrupt: boolean = false
    private __hdlTimeout: number = null

    private _query: string
    private _domain: string
    private _callback: Function
    private _context: any

    constructor(interval: number = QueryPolling.DEFAULT_INTERVAL, retryInterval: number = QueryPolling.DEFAULT_INTERVAL) {
        super()
        this.interval = interval
        this.retryInterval = retryInterval
    }

    public run(query: string, domain: string, callback: Function, context?: any): void {
        this._query = query
        this._domain = domain
        this._callback = callback
        this._context = context
        this.reload()
    }

    private poll(interval?: number): void {
        this.__hdlTimeout = setTimeout((): void => {
            this.__hdlTimeout = null
            this.execute()    
        }, isset(interval)?interval:this.interval)
    }

    public stop(): void {
        this.__interrupt = true
        this.abort()
    }

    public reload(): void {
        this.stop()
        this.__interrupt = false
        this.execute()
    }

    public abort(): void {
        if(this.__jqxhr) {
            this.__jqxhr.abort() 
        }
        if(this.__hdlTimeout) {
            clearTimeout(this.__hdlTimeout)
            this.__hdlTimeout = null
            if(!this.__interrupt) {
                this.reload()
            }
        }
    }

    private execute(): void {

        var request = {
            query: this._query,
            callback: this._callback,
            context: this._context,
            domain: this._domain,
            timeout: this.interval,
            silent: true,
            cache: false,
            dataType: this.dataType
        }

        this.emit('query', request)
        
        this.__jqxhr = Query.GET(request.query, request.callback, request.context, { dataType: request.dataType, silent: request.silent, cache: request.cache, domain: request.domain, timeout: request.timeout })
        if(this.__jqxhr) {
            this.__jqxhr.always((result: any, status: string): void => {
                this.__jqxhr = null
                if(!this.__interrupt) {
                    if((status != Query.Status.SUCCESS) && (status != Query.Status.NOCONTENT)) {
                        if(status == Query.Status.TIMEOUT || status == Query.Status.ABORT) {
                            this.execute()
                        } else {
                            this.poll(this.retryInterval)
                        }
                    } else {
                        this.poll()
                    }
                }

            })
        }

    }

    public dispose(): void {
        this.stop()
        super.dispose()
    }

}