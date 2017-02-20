module kit.main {

    import Logger = helpers.Logger;
    import Query = helpers.Query;
    import RegisterElementManager = components.RegisterElementManager;
    import RegisterBindingsManager = components.RegisterBindingsManager;
    import WebKitFieldElement = components.WebKitFieldElement;
    import FieldBinding = components.FieldBinding;
    
    import InputUIField = fields.InputUIField;
    import TextUIField = fields.TextUIField;
    import NumericUIField = fields.NumericUIField;
    import CurrencyUIField = fields.CurrencyUIField;
    import TNumericTypes = fields.TNumericTypes;
    
    Query.defaultOptions.upToDate = true;
    
    var oLogger: Logger = Logger.getLogger('webkit.main');
    oLogger.info("Démarrage de l'application");
    
    // Custom tags
    //var registerElementMan: RegisterElementManager = new RegisterElementManager();
    //registerElementMan.register(new WebKitFieldElement());
    
    // Custom Bindings
    FieldBinding.setConstructor('text', (name: string, defaultValue: string, required: boolean): InputUIField => {
        return new TextUIField(name, defaultValue, required);
    });
    
    FieldBinding.setConstructor('numeric', (name: string, defaultValue: string, required: boolean): InputUIField => {
        return new NumericUIField(name, defaultValue, TNumericTypes.Integer, required);
    });
    
    FieldBinding.setConstructor('currency', (name: string, defaultValue: string, required: boolean): InputUIField => {
        var field: CurrencyUIField = new CurrencyUIField(name, defaultValue, required);
        field.digits = 0;
        field.unit(app.i18n.getCurrentLocale().currencySymbol);
        return field;
    });
    
    FieldBinding.setConstructor('default', FieldBinding.getConstructor('text'));
    
    var registerBindingsMan: RegisterBindingsManager = new RegisterBindingsManager();
    registerBindingsMan.register(new FieldBinding());
    
    // Filter url queries
    $(document).ajaxSend(function(event, jqxhr, settings) {
        
        if(typeof(app.onAjaxSend) == "function") {
            app.onAjaxSend(settings, jqxhr);
        }
        
        settings.url = app.getFinalFileName(settings.url)
    })

	/**
	 * The application entry point.
	 */
	$(document).ready(function() {

		/**
		 * jquery events
		 */
		// push event keydown when user do a drag&drop
        $(document).on('dragend drop', 'input', function() {
			$(this).trigger('keydown');
		})
	
        // Fix bug on Firefox : ESC close web socket...
        $(window).keydown(function(event) {
            // check for escape key
            if (event.which == 27)
            {
                // the following seems to fix the symptom but
                // only in case the document has the focus
                event.preventDefault()
            }
        })
	})

}