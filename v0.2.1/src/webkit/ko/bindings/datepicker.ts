/**
 * @fileOverview This file defines the datetimepicker custom binding.
 *     It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	// Code I found on the web to make JQuery DatePicker working with Knock Out
	// source : http://stackoverflow.com/questions/6612705/knockout-with-jquery-ui-datepicker

	ko.bindingHandlers['datepicker'] = (function() {

		var getDateTimePickerOptions = function (_resourcesManager) {
			
			var _strings = {
				// JQuery date and time picker labels
				january : _resourcesManager.getObservableString('january'),
				february : _resourcesManager.getObservableString('february'),
				march : _resourcesManager.getObservableString('march'),
				april : _resourcesManager.getObservableString('april'),
				may : _resourcesManager.getObservableString('may'),
				june : _resourcesManager.getObservableString('june'),
				july : _resourcesManager.getObservableString('july'),
				august : _resourcesManager.getObservableString('august'),
				september : _resourcesManager.getObservableString('september'),
				october : _resourcesManager.getObservableString('october'),
				november : _resourcesManager.getObservableString('november'),
				december : _resourcesManager.getObservableString('december'),
				januaryAbbr : _resourcesManager.getObservableString('januaryAbbr'),
				februaryAbbr : _resourcesManager.getObservableString('februaryAbbr'),
				marchAbbr : _resourcesManager.getObservableString('marchAbbr'),
				aprilAbbr : _resourcesManager.getObservableString('aprilAbbr'),
				mayAbbr : _resourcesManager.getObservableString('mayAbbr'),
				juneAbbr : _resourcesManager.getObservableString('juneAbbr'),
				julyAbbr : _resourcesManager.getObservableString('julyAbbr'),
				augustAbbr : _resourcesManager.getObservableString('augustAbbr'),
				septemberAbbr : _resourcesManager.getObservableString('septemberAbbr'),
				octoberAbbr : _resourcesManager.getObservableString('octoberAbbr'),
				novemberAbbr : _resourcesManager.getObservableString('novemberAbbr'),
				decemberAbbr : _resourcesManager.getObservableString('decemberAbbr'),
				monday : _resourcesManager.getObservableString('monday'),
				tuesday : _resourcesManager.getObservableString('tuesday'),
				wednesday : _resourcesManager.getObservableString('wednesday'),
				thursday : _resourcesManager.getObservableString('thursday'),
				friday : _resourcesManager.getObservableString('friday'),
				saturday : _resourcesManager.getObservableString('saturday'),
				sunday : _resourcesManager.getObservableString('sunday'),
				mondayAbbr : _resourcesManager.getObservableString('mondayAbbr'),
				tuesdayAbbr : _resourcesManager.getObservableString('tuesdayAbbr'),
				wednesdayAbbr : _resourcesManager.getObservableString('wednesdayAbbr'),
				thursdayAbbr : _resourcesManager.getObservableString('thursdayAbbr'),
				fridayAbbr : _resourcesManager.getObservableString('fridayAbbr'),
				saturdayAbbr : _resourcesManager.getObservableString('saturdayAbbr'),
				sundayAbbr : _resourcesManager.getObservableString('sundayAbbr'),
				firstDayOfTheWeek : _resourcesManager.getObservableString('firstDayOfTheWeek'),
				today : _resourcesManager.getObservableString('today'),
				previous : _resourcesManager.getObservableString('previous'),
				next : _resourcesManager.getObservableString('next'),
				close : _resourcesManager.getObservableString('close')
			};
			
		    var options = {
		        onClose: function () { },
		        dateFormat: getDateFormat(_resourcesManager),
		        onSelect: null, // DO NOT USE THIS FUNCTION / USE ON CLOSE
		        closeText: _strings.close(),
		        prevText: _strings.previous(),
		        changeYear: true,
		        showOn: "none",
		        nextText: _strings.next(),
		        currentText: _strings.today(),
		        showButtonPanel: false,
		        firstDay: getFirstDayOfTheWeek(_strings),
		        monthNames: [
                    _strings.january(), _strings.february(), _strings.march(), _strings.april(), _strings.may(), _strings.june(),
                    _strings.july(), _strings.august(), _strings.september(), _strings.october(), _strings.november(), _strings.december()
		        ],
		        monthNamesShort: [
                    _strings.januaryAbbr(), _strings.februaryAbbr(), _strings.marchAbbr(), _strings.aprilAbbr(), _strings.mayAbbr(), _strings.juneAbbr(),
                    _strings.julyAbbr(), _strings.augustAbbr(), _strings.septemberAbbr(), _strings.octoberAbbr(), _strings.novemberAbbr(), _strings.decemberAbbr()
		        ],
		        dayNames: [
                    _strings.sunday(), _strings.monday(), _strings.tuesday(), _strings.wednesday(), _strings.thursday(), _strings.friday(), _strings.saturday()
		        ],
		        dayNamesMin: [
                    _strings.sundayAbbr(), _strings.mondayAbbr(), _strings.tuesdayAbbr(), _strings.wednesdayAbbr(), _strings.thursdayAbbr(), _strings.fridayAbbr(), _strings.saturdayAbbr()
		        ]
		        //minDate: new Date(1970, 0, 1)
		    };
		    return options;
		};

		var getDateFormat = function(_resourcesManager) {
			var dateFormat = _resourcesManager.getCurrentLocale().dateFormat;
			return dateFormat.replace("yyyy", "yy");
		};

		var getFirstDayOfTheWeek = function(_strings) {
			var firstDayOfTheWeek = _strings.firstDayOfTheWeek();
			switch (firstDayOfTheWeek) {
				case _strings.monday():
					firstDayOfTheWeek = 1;
					break;
				case _strings.tuesday():
					firstDayOfTheWeek = 2;
					break;
				case _strings.wednesday():
					firstDayOfTheWeek = 3;
					break;
				case _strings.thursday():
					firstDayOfTheWeek = 4;
					break;
				case _strings.friday():
					firstDayOfTheWeek = 5;
					break;
				case _strings.saturday():
					firstDayOfTheWeek = 6;
					break;
				default: // i.e. (firstDayOfTheWeek == _strings.sunday())
					firstDayOfTheWeek = 0;
					break;
			}
			return firstDayOfTheWeek;
		};

		var getFirstVisibleInput = function(id) {
			var $elements = $('[id=' + id + ']');
        	for(var i = 0; i < $elements.length; i++) {
        		var $this = $($elements[i]);
        		if($this.is(':visible')) {
        			return $this;
        		}
        	}
        	return $('#' + id);
		};

		return {
			init : function(element, valueAccessor, allBindingsAccessor) {
				var value_ = valueAccessor();
				app.manager.ready(['i18n'], function(_resourcesManager) {
					
	                var o = $.extend(value_.options || {}, getDateTimePickerOptions(_resourcesManager));
	                
	                o['yearRange'] = (o.minDate?o.minDate.getFullYear():"c-100") + ":" + (o.maxDate?o.maxDate.getFullYear():"c+100"); 
	                
	                $(element).bind('click.datepicker', function() {
	                	getFirstVisibleInput(value_.id).datepicker('show');
	                });

	                defer(function() {
	                	getFirstVisibleInput(value_.id).datepicker(o);
	                });
				});

            },
            update : function(element, valueAccessor) {
            	var value_ = valueAccessor();
            	app.manager.ready(['i18n'], function(_resourcesManager) {
            		var o = $.extend(value_.options || {}, getDateTimePickerOptions(_resourcesManager));
            		o['yearRange'] = (o.minDate?o.minDate.getFullYear():"c-100") + ":" + (o.maxDate?o.maxDate.getFullYear():"c+100");
            		
            		getFirstVisibleInput(value_.id).datepicker('destroy');
            		getFirstVisibleInput(value_.id).datepicker(o);
            	});
            }
		};
	}());

}