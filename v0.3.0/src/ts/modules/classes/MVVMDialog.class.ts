import { Logger } from '@webkit/helper/logger'; 
import { MVVM } from '@webkit/core/MVVM.class';

let logger: Logger = Logger.getLogger('fr.ca.cat.MVVM');
    
export interface IDialogOptions {
    zIndex?: number
    height?: string
    width?: string
    resizable?: boolean
    draggable?: boolean
    modal?: boolean
    dialogClass?: string
}

/** Predefined buttons to show
 * @alias Button
 * @enum {string}
 * @example _messageBox.Button.OkCancel;
 */
export var TDialogButtons = {
    /** The message box displays an OK button. */
    Ok: 'Ok',
    /** The message box displays OK and Cancel buttons. */
    OkCancel: 'OkCancel',
    /** The message box displays Yes, No, and Cancel buttons. */
    YesNoCancel: 'YesNoCancel',
    /** The message box displays Yes and No buttons. */
    YesNo: 'YesNo'
}

/** Result of a callback (using predefined buttons)
 * @alias Button
 * @enum {string}
 * @example _messageBox.Result.Ok;
 */
export var TDialogResults = {
    /** The message box returns no result. */
    None: 'None',
    /** The result value of the message box is OK. */
    Ok: 'Ok',
    /* The result value of the message box is Cancel. */
    Cancel: 'Cancel',
    /** The result value of the message box is Yes. */
    Yes: 'Yes',
    /** The result value of the message box is No. */
    No: 'No'
}
    
export class MVVMDialog extends MVVM {

    private title: KnockoutObservable<string> = ko.observable<string>();
    private dialogOptions: any = {};
    private buttons: any;
    private result: any;
    private callback: any;
        
    constructor(title: string, view: string, buttons: any, callback: any, opts: IDialogOptions = {}) {
        
        super(view);
        
        this.title(title);
        this.callback = callback;
        this.buttons = buttons;
        
        this.dialogOptions = {
            autoOpen : true,
            modal : true,
            resizable : true,
            draggable: true,
            closeOnEscape: true,
            close: (e, ui): void => {
                if(e.originalEvent) {
                    this.hide()
                }
            }
        };
        
        this.addOptions(opts);
        
        this.title.subscribe((s: string): void => {
            if(this.isAlive()) {
                this.getContent().dialog().parents(':first').find('.ui-dialog-title').html(s); 
            }
        });
        
        
    }
        
    public addOptions(opts: IDialogOptions = {}): void {
        this.dialogOptions = $.extend(this.dialogOptions, opts || {}); 
    }
 
    private _show(fn?: Function): void {
        this.result = null;
        fn = fn || function() {}
        this.getContent().dialog('open')
        fn.call(this)    
    }

    public getResult(): any {
        return this.result;   
    }
        
    public show(fn?: Function): void {
        
        if(this.isLoaded()) {
            this._show(fn)
        } else {
            this.load((): void => {
                this._show(fn)
            })    
        }
        
        if(this.dialogOptions.zIndex) {
            this.getContent().parents(':first').css('z-index', this.dialogOptions.zIndex)
        }  
        
        this.emit('show');
        
    }

    public hide(): void {
        this.getContent().dialog('close')
        
        this.emit('close');
        
    }
        
    public buildButtons(button): any[] {

        var buttons: any[] = []
        if(!button) return buttons;
        
        var strings: any = {};
        strings.ok      = app.i18n.getObservableString("ok")
        strings.cancel  = app.i18n.getObservableString("cancel")
        strings.yes     = app.i18n.getObservableString("yes")
        strings.no      = app.i18n.getObservableString("no")
        
        switch (button) {
            case TDialogButtons.Ok:
                buttons = [ {
                    id : "okButton",
                    text : strings.ok(),
                    click : (): void => {
                        this.result = TDialogResults.Ok
                        this.hide()
                    }
                } ]
                break;
            case TDialogButtons.OkCancel:
                buttons = [ {
                    id : "okButton",
                    text : strings.ok(),
                    click : (): void => {
                        this.result = TDialogResults.Ok
                        this.hide()
                    }
                }, {
                    id : "cancelButton",
                    text : strings.cancel(),
                    click : (): void => {
                        this.result = TDialogResults.Cancel
                        this.hide()
                    }
                } ]
                break;
            case TDialogButtons.YesNo:
                buttons = [ {
                    id : "yesButton",
                    text : strings.yes(),
                    click : (): void => {
                        this.result = TDialogResults.Yes
                        this.hide()
                    }
                }, {
                    id : "noButton",
                    text : strings.no(),
                    click : (): void => {
                        this.result = TDialogResults.No
                        this.hide()
                    }
                } ]
                break;
            case TDialogButtons.YesNoCancel:
                buttons = [ {
                    id : "yesButton",
                    text : strings.yes(),
                    click : (): void => {
                        this.result = TDialogResults.Yes
                        this.hide()
                    }
                }, {
                    id : "noButton",
                    text : strings.no(),
                    click : (): void => {
                        this.result = TDialogResults.No
                        this.hide()
                    }
                }, {
                    id : "cancelButton",
                    text : strings.cancel(),
                    click : (): void => {
                        this.result = TDialogResults.Cancel
                        this.hide()
                    }
                } ]
                break;
            default:
                if ($.isPlainObject(button)) {
                    $.each(button, (k: string, v): void => {
                        buttons.push({
                            id : k + 'Button',
                            text : app.i18n.getString(v),
                            click : (): void => {
                                this.result = k, this.hide();
                            }
                        })
                    })
                }

                if ($.isArray(button)) {
                    $.each(button, (k, v): void => {
                        
                        let id: string = v;
                        let text: string = v;
                        let fn: Function = null;
                        
                        if($.isPlainObject(v)) {
                            id = v.id;
                            text = v.text;
                            fn = v.fn;
                        }
                        
                        buttons.push({
                            id : id + 'Button',
                            text : app.i18n.getString(text),
                            click : (): void => {
                                if(typeof(fn) == "function") {
                                    if(!fn.call(this)) {
                                        return;
                                    }    
                                }
                                this.result = id, this.hide();
                            }
                        })
                    })
                }
                break;
        }
        
        return buttons;
        
    }
        
    public centerize() {
        if(!this.isAlive()) return;
        this.getContent().dialog({
            position: { my: "center", at: "center", of: window }
        });
    }
        
    public isAlive(): boolean {
        var oContent_ = this.getContent();
        
        if (oContent_ == null) {
            return false;
        }
        
        return !!oContent_.dialog("instance");
 
    }
        
    public isOpen(): boolean {
        return this.isAlive() && this.getContent().dialog("isOpen");   
    }
    
    public isVisible(): boolean {
        return this.isOpen();
    }

    public destroy() {
        try {
            this.getContent().dialog("destroy");
        } catch(e) {}
        this.getContent().remove();
        this.clearBindings();
    }

    public prepare(): void {
        super.prepare()
        
        var options = this.dialogOptions;
        var buttonsList: any[] = this.buildButtons(this.buttons);

        this.getContent().dialog({
            title       : this.title(),
            height      : options.height || "auto",
            width       : options.width || "auto",
            modal       : isset(options.modal)?options.modal:true,
            draggable   : isset(options.draggable)?options.draggable:true,
            resizable   : isset(options.resizable)?options.resizable:false,
            dialogClass : isset(options.dialogClass)?options.dialogClass:null,
            buttons     : buttonsList,
            closeOnEscape : false,
            close : (): void => {
                fire(this.callback, this.result);
                this.hide();
            }
        }).dialog('moveToTop').parents(':first').find('.ui-dialog-title').html(this.title());
  
    }

}