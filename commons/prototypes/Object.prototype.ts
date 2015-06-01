
interface Object {
    keysAt(o: Object, index: number): string
    _keys(o: Object, index?: number): any
    keys(o: Object): string[]   
    values(o: Object): any[]  
    findBy(o: Object, field: string, value: any): any
    findManyBy(o: Object, field: string, value: any): any[]
    hasKeys(o: Object): boolean
    toJson(o: Object): Object
}

Object.keysAt = function (o: Object, index: number): any {
    return Object._keys(o, index)
}

Object._keys = function (o: Object, index?: number): any {
    var keys: string[] = [], 
        key: string = null,
        currentKeyIndex: number = 0
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            if(isset(index) && currentKeyIndex == index) {
                return key
            }
            keys.push(key)
            currentKeyIndex++
        }
    }
    if(isset(index)) {
        return  null
    }
    return keys
}

Object.keys = function (o: Object): any {
    return Object._keys(o)
}

Object.hasKeys = function (o: Object): boolean {
    return Object._keys(o, 0) != null
}

Object.values = function (o: Object): any[] {
    var values: any[] = [], 
        key: string = null;
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            values.push(o[key])
        }
    }
    return values
}

Object.findManyBy = function (o: Object, field: string, value: any, maxCount?: number): any[] {
    var result: any[] = [],
        id: string = null
    
    for (id in o) {
        if (o.hasOwnProperty(id) && o[id][field] == value) {
            result.push(o[id])
            if(isset(maxCount) && maxCount >= result.length) {
                return result
            }
        }
    }
    return result
}

Object.findBy = function (o: Object, field: string, value: any): any {
    return this.findManyBy(o, field, value, 1)[0]
}

Object.toJson = function (o: Object): Object {
    
    if (typeof (o) != 'object' || o == null) {
        return o
    }

    var json: any = {}

    if ($.isArray(o)) {
        json = []
    }

    var type: string = ''
    var property: any = null
    var observable = ko.observable()
    var computed = ko.computed((): void => { })

    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            property = o[p]
            type = typeof (property)
            
            if (type == 'function') {
                if (property.prototype.constructor.name == observable.prototype.constructor.name ||
                    property.prototype.constructor.name == computed.prototype.constructor.name) {
                    json[p] = Object.toJson(property.call(o))
                }
            } else if (property != null && type == 'object') {
                json[p] = Object.toJson(property)
            } else {
                json[p] = property
            }
        }
    }
    return json
}