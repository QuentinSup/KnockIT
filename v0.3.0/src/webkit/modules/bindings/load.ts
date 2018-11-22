import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class LoadBinding extends AbstractBinding {

    constructor() {
        super('load');    
    }

    init(element, valueAccessor, allBindings, viewModel, bindingContext) {}
    
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var url = valueAccessor();
		var $element = $(element);
        
        $element.load(url);

	}
   
}