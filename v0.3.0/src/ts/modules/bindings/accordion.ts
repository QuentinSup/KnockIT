import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class AccordionBinding extends AbstractBinding {

    constructor() {
        super('accordion');    
    }

	init(element, valueAccessor) {
		// handle disposal (if KO removes by the template binding)
		ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
			$(element).accordion("destroy");
		});
	}
    
    update(element, valueAccessor) {
		let options = valueAccessor() || {};
		let $element: any = $(element);
        
        if(options.openState) {
            
            let state: KnockoutObservable<string> = options.openState;
            delete(options.openState);
            
            options.beforeActivate = function(event, ui) {
                state(ui.newPanel && ui.newPanel.length > 0?"opening":"closing");       
            }
            
            options.activate = function(event, ui) {
                state(ui.newPanel && ui.newPanel.length > 0?"opened":"closed");       
            }
            
            state.subscribe((b: any): void => {
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
}