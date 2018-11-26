import { EventsBinder } from '@webkit/core/EventsBinder.class';

export let inherits: Function = (prototype, id: string, opts: any): any => {

	let OverloadClass = function(prototype, id, opts) {
		opts._id = id
		this.executionContext = opts
		this.__proto__ = prototype
	}

	OverloadClass.prototype = prototype

	return new OverloadClass(prototype, id, opts)
}

/**
 * A module.
 */
export class BaseManager extends EventsBinder {

	public executionContext: any

	private _domains = {}
	private _domainCounter: number = 0

    /**
	* A value that indicates whether this module is ready.
	* @type {ko.observable(boolean)}
	*/
    public isReady: KnockoutObservable<boolean> = ko.observable(false)
	
    constructor() {
    	super()
    	this.isReady.subscribeOnce((b: boolean) => {
            if(b) {
                this.emit('ready')
            }
        }, this)
    }

    public init(): void {}

	/**
	 * Executes the given callback when this module is ready.
	 * @param callback The function to execute when this module is ready.
	 * @param context The context for the given callback.
	 */
	public ready(callback: Function, context?: any): boolean {
		if(!callback) return;

		this.on('ready', callback, context)
        
		if(this.isReady()) {
            callback.call(context || this)
            return true
        }

        return false
	}

}