import { Logger } from '@webkit/helper/logger';  
import { ViewModel } from '@webkit/core/ViewModel.class'; 
import * as file from '@webkit/helper/files';
    
let logger: Logger = Logger.getLogger('MVVM');

export class MVVM extends ViewModel {

    /**
     * The content encapsulated in this view.
     * @type {jQuery.Object}
     */
    private _htmlContent: string = null
    private _content: JQuery = null
    private _owner: string = 'body'
    private _view: string = null

    public loadingCounter: KnockoutObservable<number> = ko.observable(0)
    public isLoaded : KnockoutObservable<boolean> = ko.observable(false)
    public isLoading : KnockoutComputed<boolean>

    constructor(view: string, stringsToRegister: string[] = []) {
        super(stringsToRegister);
        this._view = view
        
        this.isLoading = ko.computed<boolean>((): boolean => {
            return this.loadingCounter() > 0;
        }).extend({ throttle: 0 });
        
    }

    private _load(htmlContent: string, callback?: Function): void {
        this._unload()
        this._htmlContent = htmlContent;
        this.isLoaded(true)
        this.beforePrepare()
        this.prepare()
        this.afterPrepare()
        if (callback) {
            callback.call(this, htmlContent)
        }
    }
    
    public load(callback?: Function, htmlContent?: string): void {
        if (this._view && !isset(htmlContent)) {
            this.loadingCounter(this.loadingCounter() + 1);
            if(this._view.startsWith('http')) {
                file.loadResource(this._view, (htmlContent: string): void => {
                    this._load(htmlContent, callback)
                    this.loadingCounter(Math.max(0, this.loadingCounter() - 1));
                })
            } else {
                let $view = $(this._view);
                if($view.length == 0) {
                    this._load('<div>' + this._view + '</div>', callback)    
                } else {
                    this._load('<div>' + $view.html() + '</div>', callback)
                }
                this.loadingCounter(Math.max(0, this.loadingCounter() - 1));
            }
        } else {
            this._load(htmlContent, callback)
        }
    }
    
    public loadTo(owner: string, callback?: Function): void {
        this._owner = owner;
        this.load(callback);
    }

    public beforePrepare(): void {}
    public afterPrepare(): void {}

    public prepare(): void {
        
        if(this._htmlContent) {

            if(logger.isTraceEnabled()) {
                logger.trace('prepare content ', this._htmlContent);
            }
            
            // Add to DOM 
            this._content = $(this._htmlContent).appendTo($(this._owner));
            // Apply bindings
            super.applyBindings(this._content);

        }

    }
    
    public unload(): void {
        if(this.isLoading()) {

            this.isLoading.subscribeOnce((b: boolean): void => {
                if(!b) {
                    this._unload()
                }
            })
            
            return;
        }
        this._unload();
    }

    public _unload(): void {
        
        this.clearBindings()
            
        if (this._content) {
            
            if(logger.isTraceEnabled()) {
                logger.trace('unload content ', this._content);
            }
            
            this._content.remove()
            this._content = null
        }
        this.isLoaded(false)
    }

    public dispose(): void {
    
        if(logger.isTraceEnabled()) {
            logger.trace('dispose');
        }
        
        this.unload()
        super.dispose()
    }

    public getContent(): JQuery {
        return this._content
    }

    public getView(): string {
        return this._view
    }

}