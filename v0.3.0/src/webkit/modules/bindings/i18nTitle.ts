/**
 * @fileOverview This file defines the inputType
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
	

    
     var getValueAccessor = function(content: any, viewModel: any) {
        if(typeof(content) == "object") {
            if(content.sdata) {
                return () => { return app.i18n.getObservableString(content.prop)().format(content.sdata); };
            }
            return () => { return utils.formatString(app.i18n.getObservableString(content.prop)(), content.data || viewModel); };
        }
        
        return () => { return utils.formatString(app.i18n.getObservableString(content)(), viewModel); };

    };
   
}