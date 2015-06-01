/**
 * @fileOverview This file defines the format custom binding
 *		It requires jQuery and KnockOut libraries.
 */
module fr.fwk.knockit.bindings {

    import Locale = manager.Locale;
    
    var getValueAccessor = function(content: any, viewModel: any) {
        if(typeof(content) == "object") {
            if(content.sdata) {
                return () => { return app.i18n.getObservableString(content.prop)().format(content.sdata); };
            }
            return () => { return utils.formatString(app.i18n.getObservableString(content.prop)(), content.data || viewModel); };
        }
        
        return () => { return utils.formatString(app.i18n.getObservableString(content)(), viewModel); };

    };
    
    
	ko.bindingHandlers['i18n'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                   
			var content = valueAccessor();
		    var $this = $(element);
            
            valueAccessor = getValueAccessor(content, viewModel);

		    ko.bindingHandlers['html'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
		},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    var content = valueAccessor();
		    var $this = $(element);
		    
            valueAccessor = getValueAccessor(content, viewModel);

            ko.bindingHandlers['html'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
           
		}
	};
    
}