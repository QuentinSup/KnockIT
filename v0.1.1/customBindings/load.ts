/**
 * @fileOverview This file defines the load custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	ko.bindingHandlers['load'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			var url = valueAccessor();
			var $element = $(element);
            
            $element.load(url);

		},
		
	};
    
}