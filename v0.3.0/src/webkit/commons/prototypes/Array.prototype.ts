
interface Array<T> {
    indexOfStr(elt: T, from?: number): number
    remove(o: T): T
    removeAt(index: number): T
    removeAll(l?: T[]): T[]
    clear(): T[]
    pushOnce(elt: T, caseSensitive?: boolean): boolean
    findBy(field: string, value: any, from?: number): T
    findManyBy(field: string, value: any, from?: number): T[]
    union(o: any[]): any[]
    fusion(o: any): any[]
    unique(): any[]
    get(ind: number): T
    contains(o: T): boolean
    contains(o: T[]): boolean
    union(o: T[]): T[]
    first(): T
    last(): T
    equals(ary: T[]): boolean
    shake(): T[]
    each(fn: (T, ind?: number) => void): void
    fill(value: T, start?: number, end?: number): T[]
}


Array.prototype.each = function(fn: (any, ind?: number) => void): void {
    $.each(this, function(k: number, v: any) {
        fn.call(this, v, k);    
    });    
}

Array.prototype.equals = function(ary: any[]): boolean {
    if (!ary) return false;
    if (this === ary) return true;
    if (this.length != ary.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i: number = 0; i < ary.length; ++i) {
        if (this[i] !== ary[i]) return false;
    }
    
    return true;
}

Array.prototype.first = function(): any {
    return this.length > 0?this[0]:null;
}

Array.prototype.last = function(): any {
    return this.length > 0?this[this.length - 1]:null;
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

Array.prototype.unique = function(): any[] {
    var r: any[] = [];
    for(var i: number = 0, len = this.length; i < len; i++) {
        if(!r.contains(this[i])) {
            r.push(this[i]);
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

Array.prototype.removeAt = function(index: number): any {
    if(index != -1) {
        return this.splice(index, 1)
    }
    return null
}

Array.prototype.remove = function(o: any): any {
    var index: number = this.indexOf(o)
    return this.removeAt(index)
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

Array.prototype.shake = function(): any[] {
    
    var t_: any[] = [].concat(this);
    var r_: any[] = [];
    
    while(t_.length > 0) {
        var index_:number = Math.floor(Math.random() * this.length);
        r_.push(t_.splice(index_, 1));    
    }
    
    return r_;
}

if (![].fill)  {
  Array.prototype.fill = function( value ) {

    var O = Object( this );
    var len = parseInt( O.length, 10 );
    var start = arguments[1];
    var relativeStart = parseInt( start, 10 ) || 0;
    var k = relativeStart < 0
            ? Math.max( len + relativeStart, 0) 
            : Math.min( relativeStart, len );
    var end = arguments[2];
    var relativeEnd = end === undefined
                      ? len 
                      : ( parseInt( end)  || 0) ;
    var final = relativeEnd < 0
                ? Math.max( len + relativeEnd, 0 )
                : Math.min( relativeEnd, len );

    for (; k < final; k++) {
        O[k] = value;
    }

    return O;
  };
}