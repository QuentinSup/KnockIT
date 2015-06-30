module kit {

	export class AppManager {
	
	    private _managers: any = {}
	    private _binders: any[] = []
	    private _isRunningLock: boolean = false;
	    private _unsynchronized: boolean = false;
	
	    private checkBinders(): void {
	        if(this._isRunningLock) {
	            this._unsynchronized = true
	            return
	        }
	        this._unsynchronized = false
	        this._isRunningLock = true
	        var i: number = 0
	        do {
	            var binder = this._binders[i]
	            if(binder) {
	                var j: number = 0
	                do {
	                    var manager = this.exists(binder.managers[j])
	                    if(manager && (!binder.ifReady || manager.isReady())) {
	                        binder.arguments[binder.indexes.indexOf(binder.managers[j])] = manager
	                        binder.managers.remove(binder.managers[j])
	                    } else {
	                        j++
	                    }
	                } while(j < binder.managers.length)
	
	                if(binder.managers.length == 0) {
	                    binder.fn.apply(binder.context, binder.arguments)
	                    this._binders.splice(i, 1)
	                } else {
	                    i++
	                }
	            }
	        } while(i < this._binders.length)
	        this._isRunningLock = false
	        if(this._unsynchronized) {             
	            defer((): void => { this.checkBinders() })
	        }
	    }
	
	    public register(managerId: string, manager: BaseManager): BaseManager {
	        this._managers[managerId] = manager
	        manager.on('ready', (): void => {
	            this.checkBinders()
	        }, manager)
	        this.checkBinders()
	        return manager
	    }
	    
	    public exists(managerId: string): BaseManager {
	        var m: BaseManager = this._managers[managerId]
	        return m
	    }
	    
	    public get(managerId: string): BaseManager {
	        var m = this.exists(managerId)
	        if(!m) {
	            throw 'Manager not found : ' + managerId
	        }
	        return m
	    }
	    
	    private addBinder(managerId: any, fn: Function, context: any, ifReady: boolean): void {
	        if(!$.isArray(managerId)) {
	            managerId = [managerId]
	        }
	        this._binders.push({
	            managers: [].concat(managerId),
	            indexes: managerId,
	            arguments: [],
	            fn: fn,
	            context: context,
	            ifReady: ifReady
	        })
	        this.checkBinders()
	    }
	    
	    public ready(managerId: any, fn: Function, context?: any): void {
	        this.addBinder(managerId, fn, context, true)
	    }
	    public require(managerId: any, fn: Function, context?: any): void {
	        this.addBinder(managerId, fn, context, false)
	    }
	
	}

}