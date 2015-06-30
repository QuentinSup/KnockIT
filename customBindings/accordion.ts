/**
 * @fileOverview This file defines the accordion custom binding
 *		It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	ko.bindingHandlers['accordion'] = {
		init : function(element, valueAccessor) {
			// handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$(element).accordion("destroy");
			});
		},
		update : function(element, valueAccessor) {
			var options = valueAccessor() || {};
			var $element: any = $(element);
			$element.accordion(options).accordion("option", "icons", {
				"header" : "ui-icon-expand",
				"activeHeader" : "ui-icon-collapse"
			});
		}
	};
}