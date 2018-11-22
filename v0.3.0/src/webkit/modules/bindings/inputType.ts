import { AbstractBinding } from '@webkit/core/AbstractBinding.class';


var setInputType = function(element, valueAccessor): void {
    var inputType_: string = ko.unwrap(valueAccessor());
    
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