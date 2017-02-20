(function(ko) {
    
	// Check if an object is an observable array
	ko.utils.isObservableArray = function(obj) {
		return ko.isObservable(obj) && obj.destroyAll !== undefined;
	},

    ko.utils.dispose = function(obj) {
        if(obj != null) {
            if(ko.isObservable(obj)) {
                if(ko.isComputed(obj)) {
                    obj.dispose()
                }
                ko.utils.dispose(obj())
            } else if($.isArray(obj)) {
                for(var i = 0, length = obj.length; i < length; i++) {
                    ko.utils.dispose(obj[i])
                }
                obj.length = 0
            } else if(typeof(obj) == 'object') {
                if(typeof(obj.dispose) == 'function') {
                    obj.dispose()
                }
            }
        }
    },
	
	ko.observableArray.fn.filterByProperty = function(propName, matchValue) {
    	var allItems, matchingItems;
    	allItems = this();
    	matchingItems = ko.observableArray([]);
        for (var i = 0; i < allItems.length; i++) {
            var current = allItems[i];
            if (ko.utils.unwrapObservable(current[propName]) === matchValue)
                matchingItems.push(current);
        }
        return matchingItems;
	};

    var subscribeOnce = function(observable, callback, context, eventName?) {
        var subscription = observable.subscribe(function(v) {
            callback.call(context || this, v);
            subscription.dispose();
        }, observable, eventName);
        return subscription;
    };

    ko.observable.fn.subscribeOnce = function(callback, context) {
        return subscribeOnce(this, callback, context);
    };

    ko.observable.fn.immediateSubscribe = ko.computed.fn.immediateSubscribe = function(callback, context, eventName) {
        var subscription = this.subscribe(callback, context || this, eventName);
        callback.call(context || this, this());
        return subscription;
    };

    ko.observable.fn.makeTrueIfNot = function(observable, ope) {
    	this.dependsOn(observable, function(b) { return !b; }, ope);
    };
    
    ko.observable.fn.dependsOn = function(observable, fn, ope) {
    	
    	if(!this.__dependencies) {
	    	this.__dependencies = {
	    		_computed: null,
	    		all: ko.observableArray([])
	    	};
	    	
	    	this.__dependencies._computed = ko.computed(function() {
	    		var dependenciesArray = this.__dependencies.all();
	    		var r = null;
	    		for(var i = 0, len = dependenciesArray.length; i < len; i++) {
	    			var dependencyObservable = dependenciesArray[i];
	    			var rt = dependencyObservable.fn(dependencyObservable.obs());
                    if(r == null) {
                        r = rt;    
                    } else {
    	    			if(dependencyObservable.ope == 0) {
    	    				r = r || rt;
    	    			} else {
    	    				r = r && rt;
    	    			}
                    }
	    		}
	    		return r;
	    	}, this);
	    	
	    	this.__dependencies._computed.subscribe(function(b) {
	    		if(isset(b)) {
	    			this(b);
	    		}
	    	}, this);
	    	
    	}
    	
    	if(typeof(fn) != 'function') {
    		fn = function(v) { return v; };
    	}
    	
    	this.__dependencies.all.push({
    		obs: observable,
    		fn :fn,
    		ope: ope || 0
    	});

        return;
    };
    
})(ko);