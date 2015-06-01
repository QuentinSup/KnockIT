module fr.fwk.knockit.ui {

	// Count of box generated
	var _boxCount: number = 0

    /** Predefined buttons to show
     * @alias Button
     * @enum {string}
     * @memberOf oneesp.module.commons.messageBox#
     * @see oneesp.module.commons.messageBox#show
     * @example _messageBox.Button.OkCancel;
     */
	export var TMessageBoxButtons = {
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
     * @see oneesp.module.commons.messageBox#show
     * @memberOf oneesp.module.commons.messageBox#
     * @example _messageBox.Result.Ok;
     */
	export var TMessageBoxResults = {
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

	export interface IMessageBoxOptions {
        icon?: string
        id?: string
        zIndex?: number
    }

    export interface IMessageBoxReturn {
        id: string
        opts: IMessageBoxOptions
        view: any
        dialog: any  
    }

	export class MessageBox {

	    // The box template
		private _stringTemplate: string = '<div data-bind="attr:{id: id}" class="se-ui-messagebox-content"><span class="se-ico-status x-large" data-bind="visible: icon, attr: { \'data-icon\': icon}">&nbsp;</span><pre class="se-ui-text" data-bind="text: content"></pre></div>'
	    // The popin template
		private _popinTemplate: string = '<div class="se-ui-popin" data-type=""><span class="se-ico-status small" data-icon=""></span><span class="text"></span></div>'
	    // The strings used
		private strings: any = {}

		public Buttons =TMessageBoxButtons
		public Results = TMessageBoxResults

	    constructor() {
			this.strings.ok      = app.i18n.getObservableString("ok")
			this.strings.cancel  = app.i18n.getObservableString("cancel")
			this.strings.yes     = app.i18n.getObservableString("yes")
			this.strings.no      = app.i18n.getObservableString("no")
	    }

	    /** Show an alert dialog box with button 'OK'
	     * @memberOf oneesp.module.commons.messageBox#
	     * @param {string} title - The box title
	     * @param {string} text - The box content text
	     * @param {function} callback - The function to call when the user push the 'OK' button
	     * @param {object} [context=] - Context to use with the callback
	     * @param {object} [options={icon:'warn'}] - dialog box options
	     * @returns dialog object
	     * @see oneesp.module.commons.messageBox#show
	     * @example _messageBox.alert('Hello', 'Hello world !', function() { //do action });
	     */
		public alert(title: string, text: string, callback?: Function, context?: any, options?: IMessageBoxOptions): IMessageBoxReturn {

			options = options || {}
			options.icon = options.icon || 'warn'

			return this.show(text, title || 'alert', TMessageBoxButtons.Ok, callback, context, options)
		}

	    /** Show a confirm dialog box with buttons 'OK' and 'Cancel'
	     * @memberOf oneesp.module.commons.messageBox#
	     * @param {string} title - The box title
	     * @param {string} text - The box content text
	     * @param {function} okCallback - The function to call when the user push the 'OK' button
	     * @param {function} cancelCallback - The function to call when the user push the 'Cancel' button
	     * @param {object} [context=] - Context to use with the callback
	     * @param {object} [options={icon: 'help'}] - dialog box options
	     * @returns dialog object
	     * @see oneesp.module.commons.messageBox#show
	     * @example _messageBox.confirm('Hello', 'Hello world !', function() { //do action }, function() { //do action });
	     * @example _messageBox.confirm('Hello', 'Hello world!', function(result) {
	     *      if(result == _messageBox.Result.Ok) {
	     *          // do Ok
	     *      } else {
	     *          // do Cancel
	     *      }
	     * };
	     */
		public confirm(title: string, text: string, okCallback: Function, cancelCallback: Function, context?: any, options?: IMessageBoxOptions): IMessageBoxReturn {

			options = options || {}
			options.icon = options.icon || 'help'
	        
			return this.show(text, title || 'confirm', TMessageBoxButtons.YesNo, function(result) {
				if (result == TMessageBoxResults.Yes) {
					if (typeof (okCallback) == 'function') {
						okCallback.call(context || this)
					}
					return
				}
				if (result == TMessageBoxResults.No || result == TMessageBoxResults.None) {
					if (typeof (cancelCallback) == 'function') {
						cancelCallback.call(context || this)
					}
					return
				}
			}, context, options)
		}

	    /** Show a custom dialog box
	     * @memberOf oneesp.module.commons.messageBox#
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
	     * _messageBox.show('Hello world !', 'Hello', buttons, function(result) {
	     *      if(result == 'confirm') {
	     *          // do Confirm
	     *      } else {
	     *          // do Unconfirm
	     *      }
	     * });
	     */
		public show(text: string, title: string, button: any, callback?: Function, context?: any, opts?: IMessageBoxOptions): IMessageBoxReturn {

	        var genId = function(counter) {
			    return 'dialogBox-' + counter
		    }

			var options: IMessageBoxOptions = {}

			opts = <IMessageBoxOptions>$.extend(options, opts || {});
	        
			title = app.i18n.getString(title)
			text = app.i18n.getString(text)

			var messageBox = null
			var id: string = ''

			if (opts.id) {
				id = opts.id
				messageBox = $('#' + opts.id)
			} else {
				_boxCount++;
				id = genId(_boxCount)
			}

			if (!messageBox || messageBox.length == 0) {
				messageBox = $(this._stringTemplate)
			}

			var viewModel: any = {
				id : id,
				icon : ko.observable(opts.icon),
				content : ko.observable(text)
			}

			var _element = messageBox[0]
			ko.applyBindings(viewModel, _element)

			var result = TMessageBoxResults.None

			button = button || TMessageBoxButtons.Ok
			var buttons = []

			switch (button) {
				case TMessageBoxButtons.Ok:
					buttons = [ {
						id : "okButton",
						text : this.strings.ok(),
						click : function() {
							result = TMessageBoxResults.Ok
							$(this).dialog('close')
						}
					} ]
					break;
				case TMessageBoxButtons.OkCancel:
					buttons = [ {
						id : "okButton",
						text : this.strings.ok(),
						click : function() {
							result = TMessageBoxResults.Ok
							$(this).dialog('close')
						}
					}, {
						id : "cancelButton",
						text : this.strings.cancel(),
						click : function() {
							result = TMessageBoxResults.Cancel
							$(this).dialog('close')
						}
					} ]
					break;
				case TMessageBoxButtons.YesNo:
					buttons = [ {
						id : "yesButton",
						text : this.strings.yes(),
						click : function() {
							result = TMessageBoxResults.Yes
							$(this).dialog('close')
						}
					}, {
						id : "noButton",
						text : this.strings.no(),
						click : function() {
							result = TMessageBoxResults.No
							$(this).dialog('close')
						}
					} ]
					break;
				case TMessageBoxButtons.YesNoCancel:
					buttons = [ {
						id : "yesButton",
						text : this.strings.yes(),
						click : function() {
							result = TMessageBoxResults.Yes
							$(this).dialog('close')
						}
					}, {
						id : "noButton",
						text : this.strings.no(),
						click : function() {
							result = TMessageBoxResults.No
							$(this).dialog('close')
						}
					}, {
						id : "cancelButton",
						text : this.strings.cancel(),
						click : function() {
							result = TMessageBoxResults.Cancel
							$(this).dialog('close')
						}
					} ]
					break;
				default:
					if ($.isPlainObject(button)) {
						$.each(button, function(k) {
							buttons.push({
								id : k + 'Button',
								text : this.text || app.i18n.getString(k),
								click : function() {
									result = k, $(this).dialog('close');
								}
							})
						})
					}

					if ($.isArray(button)) {
						$.each(button, function(k, v) {
							buttons.push({
								id : v + 'Button',
								text : app.i18n.getString(v),
								click : function() {
									result = v, $(this).dialog('close')
								}
							})
						})
					}
					break;
			}

			var dialog = messageBox.dialog({
				title : title,
				height : "auto",
				width : "auto",
				modal : true,
				draggable : true,
				resizable : false,
				buttons : buttons,
				closeOnEscape : false,
				close : function() {
					if (callback) {
						if (context) {
							callback.call(context, result)
						} else {
							callback(result)
						}
					}
					messageBox.dialog("destroy").remove()
					ko.cleanNode(_element)
				}
			}).dialog('moveToTop')
	            
	        if(opts.zIndex) {
	            $('#' + id).parents(':first').css('z-index', opts.zIndex)
	        }
	            
	        return {
	            id: id,
	            opts: opts,
	            view: viewModel,
	            dialog: dialog  
	        }
		}

	    /** Destroy an explicit dialogbox
	     * @memberOf oneesp.module.commons.messageBox#
	     * @param {string} id - The dialog box id
	     * @example var hinst = _messageBox.show('Hello world !', 'Hello', function(button) { //do action }, this, { id:'mydialogbox'});
	     * _messageBox.destroy(hinst.id); // equals to _messageBox.destroy('mydialogbox');
	     */
	    public destroy(id: string): void {
	        $('#' + id).dialog('close')
	    }

	    /**
	     * Close all messageboxes and popins, and remove them from DOM
	     */
	    public clear(): void {
	    	// clear all dialogboxes
	    	$('.se-ui-messagebox-content').each(function() {
	    		$(this).dialog('close')
    		})

    		// clear all popins
    		$('.se-ui-popin').each(function() {
	    		$(this).remove()
    		})
	    }


	    /** Show a popin box
	     * @memberOf oneesp.module.commons.messageBox#
	     * @param {string} text - The box content text
	     * @param {string} [messageType='info'] - The message type ('info', 'error', 'warn')
	     * @param {int} [timeout=2000] - The visibility delay before auto hide the popin in milliseconds (set to <code>0</code> to disable auto hide delay).
	     * If not timeout is clearly specified, the popin will not be hidden when the <code>messageType</code> is equals to 'error'.
	     * @example _messageBox.iMessage('Hello world !'); // Show an info popin during 2 seconds
	     * @example _messageBox.iMessage('Hello world !', 'info', 0); // Show an info popin. Auto hide is disabled
	     * @example _messageBox.iMessage('Hello world !', 'error'); // Show an error popin. Auto hide is disabled
	     * @example _messageBox.iMessage('Hello world !', 'error', 1000); // Show an error popin during only 1 second
	     */
		public popin(text: string, messageType?: string, timeout?: number): void {

			var localeText: string = app.i18n.getString(text)

			timeout = !isNaN(timeout) ? timeout : (messageType == 'error' ? 0 : 2000)
			messageType = messageType || 'info'

			var $template = $(this._popinTemplate)
			var close = function() {
				$template.fadeOut('fast', function() {
					// Remove from body
					$template.remove()
				})
			}

			// Push text
			$template.attr('data-type', messageType)
			$template.find('.se-ico-status').attr('data-icon', messageType)
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