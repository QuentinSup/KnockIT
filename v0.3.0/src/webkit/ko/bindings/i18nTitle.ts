/**
 * @fileOverview This file defines the inputType
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
	
    var setTitle = function(element, valueAccessor): void {
        var inputType_: string = valueAccessor();
        
        if(inputType_) {
            try  {
                $(element).attr('title', inputType_);
            } catch(e) {}
        }    
    };
    
     var getValueAccessor = function(content: any, viewModel: any) {
        if(typeof(content) == "object") {
            if(content.sdata) {
                return () => { return app.i18n.getObservableString(content.prop)().format(content.sdata); };
            }
            return () => { return utils.formatString(app.i18n.getObservableString(content.prop)(), content.data || viewModel); };
        }
        
        return () => { return utils.formatString(app.i18n.getObservableString(content)(), viewModel); };

    };
    
	ko.bindingHandlers['i18nTitle'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            
            
            var content = valueAccessor();
            var $this = $(element);
            
           valueAccessor = getValueAccessor(content, viewModel);
            setTitle(element, valueAccessor); 
            
        },
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            
            valueAccessor = getValueAccessor(content, viewModel);
            setTitle(element, valueAccessor);  
		},
		
	};
    
}