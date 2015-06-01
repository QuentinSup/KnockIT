/**
 * @fileOverview This file defines the localeText custom binding.
 * 		It requires jQuery and KnockOut libraries.
 */
(function(oneesp, $, ko) {

	app.manager.ready('i18n', function(_resourcesManager) {
		ko.bindingHandlers.localeText = {
			init : function(element, valueAccessor) {
				var options = valueAccessor() || {};
				var s = _resourcesManager.getString(options.id); //, options.defaultText);
				$(element).text(s);
			},
			update : function(element, valueAccessor) {
				var options = valueAccessor() || {};
				var s = _resourcesManager.getString(options.id); //, options.defaultText);
				$(element).text(s);
			}
		};
	});

})(window.oneesp, window.jQuery, window.ko);