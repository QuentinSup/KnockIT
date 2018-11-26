import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class LoadBinding extends AbstractBinding {

    constructor() {
        super('load');    
    }

    init(element, valueAccessor, allBindings, viewModel, bindingContext) {}
    
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
		let url: any = valueAccessor();
		let $element: JQuery = $(element);
        
        $element.load(url);

	}
   
}