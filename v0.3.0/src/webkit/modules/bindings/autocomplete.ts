import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class AutoCompleteBinding extends AbstractBinding {

	constructor() {
        super('autocomplete');    
    }
    
	init(element, valueAccessor, allBindingsAccessor) {
        var $element: JQuery = $(element);
        var value = allBindingsAccessor().value;
        $element.autocomplete(valueAccessor());
        if (value) {
            $element.autocomplete("option", "select", function(event, ui): boolean {
                value(ui.item.value);
                return false;
            });
        }
        $element.focus(function() {
            $element.autocomplete("search");
        });
	}
    
	update(element, valueAccessor) {
        var $element: JQuery = $(element);
        var src: any = valueAccessor();
        $element.autocomplete("option", "source", src);
	}

}