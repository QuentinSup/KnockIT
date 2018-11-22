import {Query, IQueryOptions} from '@webkit/helper/query';
/**
 * Interface to all API resources
 */
export interface APIResourceInterface {
    id: number;
    fromJson(data: any): void;
    toJson(): any;
}

/**
 * Use this class to simplify REST request
 */
export abstract class API implements APIResourceInterface {

    /**
     * Common attribute id
     */
    public id: number;

    /**
     * API uri
     */
    private uri: string;

    constructor(uri: string) {
        this.uri = uri;
    }

    /**
     * Returne API uri
     */
    public getUri(): string {
        return this.uri;
    }

    /**
     * Execute a POST request
     */
    public create(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.POST(this.uri, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
    }

    /**
     * Execute a PUT request
     */
    public update(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.PUT(this.uri + "/" + this.id, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
    }
    
    /**
     * Execute a PATCH request
     */
    public patch(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.PATCH(this.uri + "/" + this.id, this.toJson(), { success: fnDone, fail: fnFail }, this, opts);
    }

    /**
     * Execute a DELETE request
     */
    public remove(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.DELETE(this.uri + "/" + this.id, { success: fnDone, fail: fnFail }, this, opts);
    }

    /**
     * Execute a GET request
     */
    public load(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.GET(this.uri + "/" + this.id, { success: fnDone, fail: fnFail }, this, opts);
    }
    
    /**
     * Execute a GET request and fill data
     * @see fromJson
     */
    public synchronize(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        this.load((data): void => {
            
            this.fromJson(data);
            
            if(typeof(fnDone) == "function") {
                fnDone.call(this, data);  
            }
            
        }, fnFail, opts);
    }

    /**
     * Execute a GET request
     */
    public list(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {
        Query.GET(this.uri, { success: fnDone, fail: fnFail }, this, opts);
    }

    /**
     * Save data depending on id
     * No id => create
     * id => update
     * id = -1 => remove
     */
    public save(fnDone?: Function, fnFail?: Function, opts?: IQueryOptions): void {

        if (!this.id) {
            // Create
            this.create(fnDone, fnFail, opts);
        } else if (this.id == -1) {
            // Delete
            this.remove(fnDone, fnFail, opts);
        } else {
            // Update
            this.update(fnDone, fnFail, opts);
        }
    }

    // Return waypoint data as Json
    public toJson(): string {
        return JSON.stringify(this.data());
    }

    // Abstract methods to implement
    abstract data(): any;
    abstract fromJson(data: any): void;

}