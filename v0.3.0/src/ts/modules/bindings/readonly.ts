import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

let doReadOnly = function(element, valueAccessor) {
    let readonly = ko.utils.unwrapObservable(valueAccessor());
    let $element: JQuery = $(element);
    if (element.type == "checkbox" || element.tagName == "SELECT" || element.tagName == "BUTTON" || element.tagName == "DIV" || element.tagName == "A") {
        if (readonly) {
            $element.attr('disabled', 'disabled');
        } else {
            $element.removeAttr('disabled');
        }
    } else {
        if (readonly) {
            $element.attr('readonly', 'readonly');
        } else {
            $element.removeAttr('readonly');
        }
    }
    if(readonly) {
        $element.bind('mousedown.readOnlyBinding', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        });
    } else {
        $element.unbind('mousedown.readOnlyBinding');
    }
}

export class ReadOnlyBinding extends AbstractBinding {

    constructor() {
        super('readonly');    
    }

	init(element, valueAccessor) {
		doReadOnly(element, valueAccessor)
	}
    
	update(element, valueAccessor) {
		doReadOnly(element, valueAccessor)
	}
	
}