
interface Array<T> {
    indexOfStr(elt: T, from?: number): number
    remove(o: T): T
    removeAll(l?: T[]): T[]
    clear(): T[]
    pushOnce(elt: T, caseSensitive?: boolean): boolean
    findBy(field: string, value: any, from?: number): T
    findManyBy(field: string, value: any, from?: number): T[]
    union(o: any[]): any[]
    fusion(o: any): any[]
    get(ind: number): T
    contains(o: T): boolean
    contains(o: T[]): boolean
    union(o: T[]): T[]
}

Array.prototype.contains = function(o: any): boolean {
	if(!$.isArray(o)) {
		return this.indexOf(o) != -1;
	}
	for(var i: number = 0, len = o.length; i < len; i++) {
		if(this.indexOf(o[i]) == -1) {
			return false;
		}
	}
	return true;
}


Array.prototype.union = function(o: any[]): any[] {
    var ary: any[] = [];
    var tab1: any[] = this.length > o.length?o:this;
    var tab2: any[] = this.length > o.length?this:o;
    for(var i: number = 0, len = tab1.length; i < len; i++) {
        if(tab2.indexOf(tab1[i]) > -1) {
            ary.push(tab1[i]);
        }
    }
    return ary;
}

Array.prototype.fusion = function(o: any): any[] {
    var r: any[] = [].concat(this);
    if(!$.isArray(o)) {
        o = [o];
    }
    for(var i: number = 0, len = o.length; i < len; i++) {
        if(!r.contains(o[i])) {
            r.push(o[i]);
        }
    }
    return r;
}

Array.prototype.indexOfStr = function (elt: any, from: number = 0): number {
    // confirm array is populated
    var len: number = this.length
    var i: number = from < 0 ? Math.max(0, len + from) : from
    var str = elt.toLowerCase()
    for (; i < len; i++) {
        if ((typeof(this[i]) == 'string') && this[i].toLowerCase() == str) {
            return i
        }
    }
    // stick with inArray/indexOf and return -1 on no match
    return -1
}

Array.prototype.pushOnce = function(elt: any, caseSensitive: boolean = false): boolean {
    var eltUCase = (caseSensitive && typeof(elt) == "string")?elt.toUpperCase():elt
    var m: any = caseSensitive?this.map(function(v) { return typeof(v) == "string"?v.toUpperCase():v }):this
    if(m.indexOf(eltUCase) == -1) {
        this.push(elt)
        return true
    }
    return false
}

Array.prototype.remove = function(o: any): any {
    var index: number = this.indexOf(o)
    if(index != -1) {
        return this.splice(index, 1)
    }
    return null
}

Array.prototype.removeAll = function(l?: any[]): any[] {
    if(isset(l)) {
        var a = []
        for(var i: number = 0; i < l.length; i++) {
            a.push(this.remove(l[i]))
        }
        return a
    } else {
       return this.splice(0, this.length)
    }
}

Array.prototype.clear = function(): any[] {
    return this.removeAll()
}

Array.prototype.findManyBy = function(field: string, value: any, from: number = 0, maxCount?: number): any[] {
    var len: number = this.length
    var result: any[] = []

    from = from < 0 ? Math.ceil(from) : Math.floor(from)
    if (from < 0) {
        from += len
    }

    for (; from < len; from++) {
        if (from in this) {
            var sValue: any = null
            if(typeof(this[from][field]) == 'function') {
                sValue = this[from][field]()
            } else {
                sValue = this[from][field]
            }
                
             if(sValue == value) {
                result.push(this[from])
                if (isset(maxCount) && result.length >= maxCount) {
                    break
                }
            }
       }
    }
    return result
}

Array.prototype.findBy = function (field: string, value: any, from: number = 0): any {
    return this.findManyBy(field, value, from, 1)[0]
}
    
Array.prototype.get = function(ind: number): any {
    return this[ind];
};