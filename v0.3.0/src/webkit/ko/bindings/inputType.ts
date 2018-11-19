/**
 * @fileOverview This file defines the inputType
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
	
    var setInputType = function(element, valueAccessor): void {
        var inputType_: string = ko.unwrap(valueAccessor());
        
        if(inputType_) {
            try  {
                $(element).attr('type', inputType_);
            } catch(e) {}
        }    
    };
    
	ko.bindingHandlers['inputType'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            setInputType(element, valueAccessor);    
        },
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            setInputType(element, valueAccessor); 
		},
		
	};
    
}