module kit {
    
    import Logger = helpers.Logger;
    
    var oLogger: Logger = Logger.getLogger('kit.MVVM');
    
    export class ViewModel implements IDisposable {

        private _bindings: any[] = []
        public strings: any = {}

        constructor(stringsToRegister: string[]) {
            app.i18n.ready((): void => {
                if (stringsToRegister != null) {
                    this.addStringsToModel(stringsToRegister)
                }
            })
        }

        public addStringToModel(id: string): void {
            this.strings[id] = app.i18n.getObservableString(id)
        }

        public addStringsToModel(ids: string[]): void {
            for (var i: number = 0, length: number = ids.length; i < length; i++) {
                this.addStringToModel(ids[i])
            }
        }

        public dispose(): void {
            //N/A
        }

        public applyBindings(element: string, bindings: string)
        public applyBindings(element: JQuery, bindings?: string)
        public applyBindings(element: string, bindings?: any)
        public applyBindings(element: JQuery, bindings?: any)
        public applyBindings(element: any, bindings?: any): JQuery {
            var $element = $(element)
            if(isset(bindings)) {
                $element.attr('data-bind', bindings)
            }
            ko.applyBindings(this, $element[0])
            this._bindings.push($element[0])
            return $element
        }

        public removeBindings(element: string)
        public removeBindings(element: JQuery)
        public removeBindings(element: any): void {
            var $element = $(element)
            ko.removeNode($element[0])
        }

        public clearBindings(): void {
            $.each(this._bindings, (i: number, element: any): void => {
                this.removeBindings(element)
            })
            this._bindings.removeAll()
        }

    }
    
    export class ResponsiveViewModel extends ViewModel {
    
        public normalWidth: number = 1200
        public tabletWidth: number = 768
        
        public isMobile: KnockoutObservable<boolean> = ko.observable(false)
        public isTablet: KnockoutObservable<boolean> = ko.observable(false)
        public isNormal: KnockoutObservable<boolean> = ko.observable(true)
        
        constructor(stringsToRegister: string[]) {

            super(stringsToRegister)
            
            $(document).ready((): void => {
            
                var resizeFn_ = (): void => {
                
                    
                    var innerWidth: number = window.innerWidth
                    
                    if(!innerWidth) {
                        if (document.body && document.body.offsetWidth) {
                            innerWidth = document.body.offsetWidth;
                        }
                        if (document.compatMode=='CSS1Compat' &&
                            document.documentElement &&
                            document.documentElement.offsetWidth ) {
                            innerWidth = document.documentElement.offsetWidth;
                        }
                    }
                    
                    if(innerWidth >= this.normalWidth) {
                        this.isTablet(false)
                        this.isMobile(false)
                        this.isNormal(true)
                    } else if(innerWidth < this.normalWidth && innerWidth >= this.tabletWidth) {
                        this.isMobile(false)
                        this.isNormal(false)
                        this.isTablet(true)
                    } else if(innerWidth < this.tabletWidth) {
                        this.isTablet(false)
                        this.isNormal(false)
                        this.isMobile(true)
                    }
                };
                
                resizeFn_()
                
                $(window).bind('resize', (e): void => {
                    resizeFn_()
                 })
            })
            
        }
    }

    export class MVVM extends ViewModel {

        /**
         * The content encapsulated in this view.
         * @type {jQuery.Object}
         */
        private content: JQuery = null
        private view: string = null
        public loadingState: KnockoutObservable<boolean> = ko.observable(false)
        public isLoaded : KnockoutObservable<boolean> = ko.observable(false)
        public isLoading : KnockoutObservable<boolean> = ko.observable(false)

        constructor(view: string, stringsToRegister: string[]) {
            super(stringsToRegister);
            this.view = view
        }

        private _load(htmlContent: string, callback?: Function): void {
            this._unload()
            this.content = $(htmlContent)
            this.isLoaded(true)
            this.beforePrepare()
            this.prepare()
            this.afterPrepare()
            if (callback) {
                callback.call(this, htmlContent)
            }
        }

        public load(callback?: Function, htmlContent?: string): void {
            if (this.view && !isset(htmlContent)) {
                this.isLoading(true)
                helpers.loadResource(this.view, (htmlContent: string): void => {
                    this._load(htmlContent, callback)
                    this.isLoading(false)
                })
            } else {
                this._load(htmlContent, callback)
            }
        }

        public beforePrepare(): void {}
        public afterPrepare(): void {}

        public prepare(): void {
            if (this.content) {
            
                if(oLogger.isTraceEnabled()) {
                    oLogger.trace('prepare content ', this.content);
                }
                
                // Add to body 
                this.content = $(this.content).appendTo($('body'));

                // Apply bindings
                super.applyBindings(this.content)
            }
        }
        
        public unload(): void {
            if(this.isLoading()) {
                this.isLoading.subscribeOnce((b: boolean): void => {
                    this._unload()
                })
                return;
            }
            this._unload();
        }

        public _unload(): void {
            
            this.clearBindings()
                
            if (this.content) {
                if(oLogger.isTraceEnabled()) {
                    oLogger.trace('unload content ', this.content);
                }
                this.content.remove()
                this.content = null
            }
            this.isLoaded(false)
        }

        public dispose(): void {
        
            if(oLogger.isTraceEnabled()) {
                oLogger.trace('dispose');
            }
            
            this.unload()
            super.dispose()
        }

        public getContent(): JQuery {
            return this.content
        }

        public getView(): string {
            return this.view
        }

    }

    export class MVVMDialog extends MVVM {

        private _show(fn?: Function): void {
            fn = fn || function() {}
            this.getContent().dialog('open')
            fn.call(this)    
        }

        public show(fn?: Function): void {
            
            if(this.isLoaded()) {
                this._show(fn)
            } else {
                this.load((): void => {
                    this._show(fn)
                })    
            }
        }

        public hide(): void {
            this.getContent().dialog('close')
        }

        public prepare(dialogOptions?: any): void {
            super.prepare()

            var defaultOptions: any = {
                autoOpen : true,
                modal : false,
                resizable : true,
                draggable: true,
                closeOnEscape: true,
                close: (e, ui): void => {
                    if(e.originalEvent) {
                        this.hide()
                    }
                }
            }

            $.extend(defaultOptions, dialogOptions || {})
            this.getContent().dialog(defaultOptions)
        }

    }

}