/**
 * @fileOverview This file defines the autocomplete custom binding
 *		It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	ko.bindingHandlers['autocomplete'] = {
		init : function(element, valueAccessor, allBindingsAccessor) {
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
		},
		update : function(element, valueAccessor) {
            var $element: JQuery = $(element);
            var src: any = valueAccessor();
            $element.autocomplete("option", "source", src);
		}
	};
}