module kit {
    
    import Logger = helpers.Logger;
    
    var oLogger: Logger = Logger.getLogger('kit.MVVM');
    
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

        private title: string;
        private dialogOptions: IDialogOptions = {};
        private buttons: any;
        private result: any;
        private callback: any;
        
        constructor(title: string, view: string, buttons: any, callback: any, opts: IDialogOptions = {}) {
            
            super(view);
            
            this.title = title;
            this.callback = callback;
            this.buttons = buttons;
            
            var defaultOptions: any = {
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
            }
            
            this.dialogOptions = $.extend(defaultOptions, opts || {})
            
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
                        $.each(button, (k, v): void => {
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
                            buttons.push({
                                id : v + 'Button',
                                text : app.i18n.getString(v),
                                click : (): void => {
                                    this.result = v, this.hide();
                                }
                            })
                        })
                    }
                    break;
            }
            
            return buttons;
            
        }
        
        public centerize() {
            this.getContent().dialog({
                position: { my: "center", at: "center", of: window }
            });
        }
        
        public isVisible(): boolean {
            var oContent_ = this.getContent();
            
            if (oContent_ == null) {
                return false;
            } else {
                return oContent_.dialog( "isOpen" );
            }
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
            
            var options = $.extend(this.dialogOptions, { title: app.i18n.getString(this.title) })
            var buttonsList: any[] = this.buildButtons(this.buttons);

            this.getContent().dialog({
                title       : this.title,
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
            }).dialog('moveToTop')
  
        }

    }

}