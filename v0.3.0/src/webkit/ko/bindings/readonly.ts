/**
 * @fileOverview This file defines the readonly custom binding.
 * 		It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {

	var doReadOnly = function(element, valueAccessor) {
		var readonly = ko.utils.unwrapObservable(valueAccessor());
		if (element.type == "checkbox" || element.tagName == "SELECT" || element.tagName == "BUTTON" || element.tagName == "DIV" || element.tagName == "A") {
			if (readonly) {
				$(element).attr('disabled', 'disabled');
			} else {
				$(element).removeAttr('disabled');
			}
		} else {
			if (readonly) {
				$(element).attr('readonly', 'readonly');
			} else {
				$(element).removeAttr('readonly');
			}
		}
		if(readonly) {
			$(element).bind('mousedown.readOnlyBinding', function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				return false;
			});
		} else {
			$(element).unbind('mousedown.readOnlyBinding');
		}
	}

	ko.bindingHandlers['readonly'] = {
		init : function(element, valueAccessor) {
			doReadOnly(element, valueAccessor)
		},
		update : function(element, valueAccessor) {
			doReadOnly(element, valueAccessor)
		}
	};
	
}