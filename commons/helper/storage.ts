/**
 * @fileOverview This file defines the storage module
 */
module fr.fwk.knockit.helpers {

    export interface IStorageOptions {
        crypt?: boolean
    }

    var checkLocalStorage = function(): boolean {
        if(window.localStorage) {
            return true
        }
        if(console && console.warn) {
            console.warn('LocaleStorage is not defined. Update your browser to fix this issue')
        }
        return false
    }

    export class Storage {

        static put(name: string, value: any, opts?: IStorageOptions): boolean {

            if(!checkLocalStorage()) { return false }

            opts = $.extend({}, opts)

            if (opts.crypt) {
                value = $().crypt({
                    method: 'b64enc',
                    source: value
                })
            }
            
            localStorage[name] = String(value)

            return true

        }

        static putObject(name: string, json: any, opts?: IStorageOptions): boolean {
            return Storage.put(name, JSON.stringify(Object.toJson(json)), opts)
        }

        static read(name: string, opts?: IStorageOptions): string {

            if(!checkLocalStorage()) { return; }

            opts = $.extend({}, opts)

            var value: string = localStorage[name]

            if (value && opts.crypt) {
                value = $().crypt({
                    method: 'b64dec',
                    source: value
                })
            }

            return value
        }

        static remove(name: any): boolean {

            if(!checkLocalStorage()) { return false }
            
            if ($.isArray(name)) {
                $.each(name, (index: number, id: string): void => {
                    localStorage.removeItem(id)
                })
            } else {
                localStorage.removeItem(name)
            }
            return true
        }

        static readAsObject(name: string, opts?: IStorageOptions): Object {
            var json: string = Storage.read(name, opts)
            try {
                return JSON.parse(json)
            } catch(e) {
                return {}
            }
        }

        static readAsNumber(name: string, opts?: IStorageOptions): number {
            var num = Storage.read(name, opts)
            return Number(num)
        }

    }

}