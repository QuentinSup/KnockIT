module kit {
    
    import Logger = helpers.Logger;
    
    var oLogger: Logger = Logger.getLogger('kit.MVVM');

    export class MVVM extends ViewModel {

        /**
         * The content encapsulated in this view.
         * @type {jQuery.Object}
         */
        private htmlContent: string = null
        private content: JQuery = null
        private owner: string = 'body'
        private view: string = null
        public loadingState: KnockoutObservable<boolean> = ko.observable(false)
        public isLoaded : KnockoutObservable<boolean> = ko.observable(false)
        public isLoading : KnockoutObservable<boolean> = ko.observable(false)

        constructor(view: string, stringsToRegister: string[] = []) {
            super(stringsToRegister);
            this.view = view
        }

        private _load(htmlContent: string, callback?: Function): void {
            this._unload()
            this.htmlContent = htmlContent;
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
                if(this.view.startsWith('http')) {
                    helpers.loadResource(this.view, (htmlContent: string): void => {
                        this._load(htmlContent, callback)
                        this.isLoading(false)
                    })
                } else {
                    var $view = $(this.view);
                    if($view.length == 0) {
                        this._load('<div>' + this.view + '</div>', callback)    
                    } else {
                        this._load('<div>' + $view.html() + '</div>', callback)
                    }
                    this.isLoading(false)
                }
            } else {
                this._load(htmlContent, callback)
            }
        }
        
        public loadTo(owner: string, callback?: Function): void {
            this.owner = owner;
            this.load(callback);
        }

        public beforePrepare(): void {}
        public afterPrepare(): void {}

        public prepare(): void {
            
            if(this.htmlContent) {

                if(oLogger.isTraceEnabled()) {
                    oLogger.trace('prepare content ', this.htmlContent);
                }
                
                // Add to DOM 
                this.content = $(this.htmlContent).appendTo($(this.owner));
                // Apply bindings
                super.applyBindings(this.content);

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

}