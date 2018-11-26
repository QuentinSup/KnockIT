import { AbstractBinding } from '@webkit/core/AbstractBinding.class';


let setInputType = function(element, valueAccessor): void {
    let inputType_: string = ko.unwrap(valueAccessor());
    
    if(inputType_) {
        try  {
            $(element).attr('type', inputType_);
        } catch(e) {}
    }    
}

export class InputTypeBinding extends AbstractBinding {

    constructor() {
        super('inputType');    
    }

	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        setInputType(element, valueAccessor);    
    }
    
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        setInputType(element, valueAccessor); 
	}
    
}