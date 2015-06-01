/**
 * @fileOverview This file defines the autocomplete custom binding.
 *     It requires jQuery and KnockOut libraries.
 */
(function(oneesp, $, ko) {

	ko.bindingHandlers.autocomplete = {
		init : function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var autocomplete = $(element);
			var value = allBindingsAccessor().value;
			autocomplete.autocomplete(valueAccessor());
			if (value) {
				autocomplete.autocomplete("option", "select", function(event, ui) {
					value(ui.item.value);
				});
			}
			autocomplete.focus(function() {
				autocomplete.autocomplete("search");
			});
		},
		update : function(element, valueAccessor) {
			$(element).autocomplete("option", "source", valueAccessor().source);
		}
	};
})(window.oneesp, window.jQuery, window.ko);