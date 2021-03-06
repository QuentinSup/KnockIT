/**
 * @fileOverview This file defines the accordion custom binding
 *		It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	ko.bindingHandlers['accordion'] = {
		init : function(element, valueAccessor) {
			// handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$(element).accordion("destroy");
			});
		},
		update : function(element, valueAccessor) {
			var options = valueAccessor() || {};
			var $element: any = $(element);
            
            if(options.openState) {
                
                var oState_: KnockoutObservable<string> = options.openState;
                delete(options.openState);
                
                options.beforeActivate = function(event, ui) {
                    oState_(ui.newPanel && ui.newPanel.length > 0?"opening":"closing");       
                }
                
                options.activate = function(event, ui) {
                    oState_(ui.newPanel && ui.newPanel.length > 0?"opened":"closed");       
                }
                
                oState_.subscribe((b: any): void => {
                    if(b === true || b === false) {
                        $element.accordion("option", "active", b?0:false)
                    }        
                });
            }
            
			$element.accordion(options).accordion("option", "icons", {
				"header" : "ui-icon-expand",
				"activeHeader" : "ui-icon-collapse"
			});
		}
	};
}