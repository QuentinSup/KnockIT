module fr.ca.cat.ui {

	// Count of box generated
	var _boxCount: number = 0

	export interface IMessageBoxOptions extends IDialogOptions {
        icon?: string
        id?: string
    }

    export interface IMessageBoxReturn {
        id: string
        opts: IMessageBoxOptions
        view: any
        dialog: any  
    }

	export class MessageBox extends MVVMDialog {

	    // The box template
		private static _stringTemplate: string = '<div data-bind="attr:{id: id}" class="ui-messagebox-content"><span class="ui-ico-status x-large" data-bind="visible: icon, attr: { \'data-icon\': icon}">&nbsp;</span><pre class="ui-text" data-bind="text: text"></pre></div>'
	    // The popin template
		private static _popinTemplate: string = '<div class="ui-popin" data-type=""><span class="ui-ico-status small" data-icon=""></span><span class="text"></span></div>'
     
        private id: string;
        private dialog: any;
        public text: KnockoutObservable<string> = ko.observable<string>();
        private icon: string; 
        
	    constructor(title: string, text: string, buttons?: any, callback?: any, opts?: IMessageBoxOptions) {
            super(title, MessageBox._stringTemplate, buttons, callback);
            opts = $.extend({ resizable: false, modal: true }, opts);
            this.addOptions(opts);
            this.text(text);
            this.init(opts);
	    }
        
        public init(opts?: IMessageBoxOptions): void {
            
            var genId = function(counter) {
                return 'dialogBox-' + counter
            }
  
            if (opts.id) {
                this.id = opts.id
            } else {
                _boxCount++;
                this.id = genId(_boxCount)
            }

            this.icon = opts.icon;
            
        }

        public getId(): string {
            return this.id;
        }
        
        /**
         * hide() alias
         */
        public close(): void {
            this.hide();
        }
        
        /**
         * @Override
         */
        public hide(): void {
            super.hide();    
            this.destroy();
        }
        
	    /** Show an alert dialog box with button 'OK'
	     * @param {string} title - The box title
	     * @param {string} text - The box content text
	     * @param {function} callback - The function to call when the user push the 'OK' button
	     * @param {object} [context=] - Context to use with the callback
	     * @param {object} [options={icon:'warn'}] - dialog box options
	     * @returns dialog object
	     * @example MessageBox.alert('Hello', 'Hello world !', function() { //do action });
	     */
		public static alert(title: string, text: string, callback?: any, options?: IMessageBoxOptions): MessageBox {

			options = options || {}
			options.icon = options.icon || 'warn'

			return this.create(title || 'alert', text, TDialogButtons.Ok, callback, options)
		}

	    /** Show a confirm dialog box with buttons 'OK' and 'Cancel'
	     * @param {string} title - The box title
	     * @param {string} text - The box content text
	     * @param {function} okCallback - The function to call when the user push the 'OK' button
	     * @param {function} cancelCallback - The function to call when the user push the 'Cancel' button
	     * @param {object} [context=] - Context to use with the callback
	     * @param {object} [options={icon: 'help'}] - dialog box options
	     * @returns dialog object
	     * @example MessageBox.confirm('Hello', 'Hello world !', function() { //do action }, function() { //do action });
	     * @example MessageBox.confirm('Hello', 'Hello world!', function(result) {
	     *      if(result == _messageBox.Result.Ok) {
	     *          // do Ok
	     *      } else {
	     *          // do Cancel
	     *      }
	     * };
	     */
		public static confirm(title: string, text: string, okCallback: any, cancelCallback?: any, options?: IMessageBoxOptions): MessageBox {

			options = options || {}
			options.icon = options.icon || 'help'
	        
			return this.create(title || 'confirm', text, TDialogButtons.YesNo, function(result) {
				if (result == TDialogResults.Yes) {
                    fire(okCallback);
					return
				}
				if (result == TDialogResults.No || result == TDialogResults.None) {
                    fire(cancelCallback);
					return
				}
			}, options)
		}

	    /** Show a custom dialog box
	     * @param {string} text - The box content text
	     * @param {string} title - The box title
	     * @param {array|Object|Enum=} [button=Button.Ok] - Button(s) to show
	     * @param {function} callback - The function to call when the user push a button
	     * @param {object} [context=] - Context to use with the callback
	     * @param {object} [opts=] - dialog box options
	     * @returns dialog object
	     * @see oneesp.module.commons.messageBox#Alert
	     * @see oneesp.module.commons.messageBox#Confirm
	     * @example 
	     * /// Show an OkCancel message box
	     * _messageBox.show('Hello world !', 'Hello', _messageBox.Button.OkCancel, function(result) {
	     *      if(result == _messageBox.Result.Ok) {
	     *          // do Ok
	     *      } else {
	     *          // do Cancel
	     *      }
	     * });
	     * @example  
	     * // Show a message box with custom 'confirm' and 'unconfirm' buttons (labels will be autotrad based on the _i18n)
	     * _messageBox.show('Hello world !', 'Hello',['confirm','unconfirm'], function(result) {
	     *      if(result == 'confirm') {
	     *          // do Confirm
	     *      } else {
	     *          // do Unconfirm
	     *      }
	     * });
	     * @example  
	     * // Show a message box with custom 'confirm' and 'unconfirm' buttons (labels will be autotrad based on the _i18n)
	     * var buttons = {'confirm':'Yes, I confirm', 'unconfirm':'No, I do not confirm'];
	     * MessageBox.create('Hello world !', 'Hello', buttons, function(result) {
	     *      if(result == 'confirm') {
	     *          // do Confirm
	     *      } else {
	     *          // do Unconfirm
	     *      }
	     * });
	     */
		public static create(title: string, text: string, buttons: any, callback?: any, opts?: IMessageBoxOptions): MessageBox {    
	        var oMessageBox_: MessageBox = new MessageBox(title, text, buttons, callback, opts);
            oMessageBox_.show();
            return oMessageBox_;
		}

	    /** Show a popin box
	     * @param {string} text - The box content text
	     * @param {string} [messageType='info'] - The message type ('info', 'error', 'warn')
	     * @param {int} [timeout=2000] - The visibility delay before auto hide the popin in milliseconds (set to <code>0</code> to disable auto hide delay).
	     * If not timeout is clearly specified, the popin will not be hidden when the <code>messageType</code> is equals to 'error'.
	     * @example MessageBox.popin('Hello world !'); // Show an info popin during 2 seconds
	     * @example MessageBox.popin('Hello world !', 'info', 0); // Show an info popin. Auto hide is disabled
	     * @example MessageBox.popin('Hello world !', 'error'); // Show an error popin. Auto hide is disabled
	     * @example MessageBox.popin('Hello world !', 'error', 1000); // Show an error popin during only 1 second
	     */
		public static popin(text: string, messageType?: string, timeout?: number): void {

			var localeText: string = app.i18n.getString(text)

			timeout = !isNaN(timeout) ? timeout : (messageType == 'error' ? 0 : 2000)
			messageType = messageType || 'info'

			var $template = $(MessageBox._popinTemplate)
			var close = function() {
				$template.fadeOut('fast', function() {
					// Remove from body
					$template.remove()
				})
			}

			// Push text
			$template.attr('data-type', messageType)
			$template.find('.ui-ico-status').attr('data-icon', messageType)
			$template.find('.text').html(localeText)

			// Append to body
			$template.appendTo($('body')).on('click.popin', function() {
				close()
			})

			if (timeout > 0) {
				setTimeout(function() {
					close()
				}, timeout)
			}
		}
	}

}