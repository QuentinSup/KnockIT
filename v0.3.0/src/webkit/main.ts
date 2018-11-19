module fr.ca.cat.agilitedigitale.main {

    import Logger = helpers.Logger;
    import Query = helpers.Query;
    import RegisterBindingsManager = components.RegisterBindingsManager;

    import InputUIField = fields.InputUIField;
    import TextUIField = fields.TextUIField;
    import NumericUIField = fields.NumericUIField;
    import CurrencyUIField = fields.CurrencyUIField;
    import TNumericTypes = fields.TNumericTypes;
    
    Query.defaultOptions.upToDate = true;
    
    var oLogger: Logger = Logger.getLogger('webkit.main');
    oLogger.info("Démarrage de l'application");

    //var registerBindingsMan: RegisterBindingsManager = new RegisterBindingsManager();
    
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