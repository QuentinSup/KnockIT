/**
 * @fileOverview This file defines the loadingState custom binding.
 *     It requires jQuery and KnockOut libraries.
 */
(function(oneesp, $, ko) {

	ko.bindingHandlers.loadingState = {
		init : function(element, valueAccessor) {
			valueAccessor().subscribe(function(b) {
				if (b) {
					$(element).loading();
				} else {
					$(element).loading('off');
				}
			});
		},
		update : function(element, valueAccessor) {
			var loadingState = valueAccessor();
			if (loadingState() == true) {
				$(element).loading();
			} else {
				$(element).loading('off');
			}
		}
	};
})(window.oneesp, window.jQuery, window.ko);