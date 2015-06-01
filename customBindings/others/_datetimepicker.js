/**
 * @fileOverview This file defines the datetimepicker custom binding.
 *     It requires jQuery and KnockOut libraries.
 */
(function(oneesp, $, ko) {

	// Code I found on the web to make JQuery DatePicker working with Knock Out
	// source : http://stackoverflow.com/questions/6612705/knockout-with-jquery-ui-datepicker
	app.manager.ready(['i18n'], function(_resourcesManager) {

        var H_MIN = 0;
        var H_MAX = 23;

        var M_MIN = 0;
        var M_MAX = 59;

        var S_MIN = 0;
        var S_MAX = 59;

		ko.bindingHandlers.datetimepicker = (function() {
            var initTimePicker = function($element, options) {

                var data = {
                    value: options.value
                };

                var spinnerChangeHandler = function(e, ui) { // key events
                    var $this = $(this);
                    var value = $this.val();
                    var seconds = Number(value);
                    var max = $this.spinner("option", "max");
                    var min = $this.spinner("option", "min");

                    if($this.attr('disabled')) {
                        e.stopImmediatePropagation();
                        return false;
                    }

                    if(isNaN(value)) {
                        e.stopImmediatePropagation();
                        $this.val(min);
                        return;
                    }
                    if(seconds > max) {
                        $this.val(max);
                        e.stopImmediatePropagation();
                        return;
                    }
                    if(seconds < min) { 
                       $this.val(min);
                        e.stopImmediatePropagation();
                        return;
                    }
                };

                var spinnerSpinHandler = function(e, ui) { // spin events
                    var $this = $(this);
                    if($this.attr('disabled')) {
                        e.stopImmediatePropagation();
                        return false;
                    }

                    defer(function() {
                        $(this).trigger('spinchange');
                    });
                };

                var $parent = $element.parents('tr:first');
                var $row = $('<tr></tr>').insertAfter($parent);

                $row.append('<td></td>');
                $row = $('<td></td>').appendTo($row);
                data.$hours = $('<input id="' + $element.attr('id') + '-hours" class="ui-timepicker-input" size="2" maxlength="2" value="" style="width:50%">').appendTo($row).spinner({
                    min : H_MIN,
                    max : H_MAX,
                    step : 1,
                    change : spinnerChangeHandler,
                    spin : spinnerSpinHandler
                });
                $row.append('&nbsp;:&nbsp;');
                data.$minutes = $('<input id="' + $element.attr('id') + '-minutes" class="ui-timepicker-input" size="2" maxlength="2" value="" style="width:50%">').appendTo($row).spinner({
                    min : M_MIN,
                    max : M_MAX,
                    step : 1,
                    change : spinnerChangeHandler,
                    spin : spinnerSpinHandler
                });
                $row.append('&nbsp;:&nbsp;');
                data.$seconds = $('<input id="' + $element.attr('id') + '-hours" class="ui-timepicker-input" size="2" maxlength="2" value="" style="width:50%">').appendTo($row).spinner({
                    min : S_MIN,
                    max : S_MAX,
                    step : 1,
                    change : spinnerChangeHandler,
                    spin : spinnerSpinHandler
                });

                var spinchange = function() {
                    defer(function() {
                        $element.trigger('datetimechange');
                    });
                };
                
                var blur = function() {
                    var $this = $(this);
                    $this.val(String(Number($this.val())).lPad('0', 2));
                };

                data.$hours.on('spinchange spin keyup', spinchange);
                data.$minutes.on('spinchange spin keyup', spinchange);
                data.$seconds.on('spinchange spin keyup', spinchange);
                
                data.$hours.on('blur', blur);
                data.$minutes.on('blur', blur);
                data.$seconds.on('blur', blur);

                $element.data('timepicker', data).bind('datetimechange.datetimepicker', function() {
                    var $this = $(this);
                    var dateValue = $this.datepicker("getDate");
                    var data = $this.data('timepicker');

                    var date = new Date(0);
                    date.setUTCFullYear(dateValue.getFullYear());
                    date.setUTCMonth(dateValue.getMonth());
                    date.setUTCDate(dateValue.getDate());

                    var h = Number(data.$hours.val());
                    var m = Number(data.$minutes.val());
                    var s = Number(data.$seconds.val());

                    if(h < H_MIN) { h = H_MIN }
                    if(h > H_MAX) { h = H_MAX }
                    if(m < M_MIN) { m = M_MIN }
                    if(m > M_MAX) { m = M_MAX }
                    if(s < S_MIN) { s = S_MIN }
                    if(s > S_MAX) { s = S_MAX }

                    date.setUTCHours(h);
                    date.setUTCMinutes(m);
                    date.setUTCSeconds(s);

                    data.value(date.getTime());
                    
                });

                $element.bind('mousedown.datetimepicker', function(e) {
                    var $this = $(this);
                    if($this.hasClass('dt-readonly')) {
                        e.stopImmediatePropagation();
                        return false;
                    }
                });

        };

        $.fn._datepicker = $.fn.datepicker;
        $.fn.datepicker = function(act, arg) {

            if(act == 'set' && arg == 'now') {
                $.each(this, function() {
                   var $this = $(this);
                   var data = $this.data('timepicker');
                   var d = new Date();
                   var now = new Date(0);

                   now.setUTCFullYear(d.getFullYear());
                   now.setUTCMonth(d.getMonth());
                   now.setUTCDate(d.getDate());

                   now.setUTCHours(d.getHours());
                   now.setUTCMinutes(d.getMinutes());
                   now.setUTCSeconds(d.getSeconds());

                   data.value(now.getTime());

                });
            } else {
                var r = $.fn._datepicker.apply(this, arguments);
                if(typeof(act) == 'object') {
                    $.each(this, function() {
                        initTimePicker($(this), act);
                    });
                }
                return r;
            }

        };
            
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
				time : _resourcesManager.getObservableString('time'),
				hour : _resourcesManager.getObservableString('hour'),
				minute : _resourcesManager.getObservableString('minute'),
				second : _resourcesManager.getObservableString('second'),
				previous : _resourcesManager.getObservableString('previous'),
				next : _resourcesManager.getObservableString('next'),
				close : _resourcesManager.getObservableString('close')
			};

			var getDateTimePickerOptions = function () {
			    var options = {
			        onClose: function () { },
			        dateFormat: getDateFormat(),
			        onSelect: null, // DO NOT USE THIS FUNCTION / USE ON CLOSE
			        timeText: _strings.time(),
			        hourText: _strings.hour(),
			        minuteText: _strings.minute(),
			        secondText: _strings.second(),
			        closeText: _strings.close(),
			        prevText: _strings.previous(),
			        nextText: _strings.next(),
			        currentText: _strings.today(),
			        showButtonPanel: true,
			        firstDay: getFirstDayOfTheWeek(),
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
			        ],
			        minDate: new Date(2014, 0, 1)
			    };
			    return options;
			};

			var getDateFormat = function() {
				//var dateFormat = _clockManager.getDateFormat();
				//return dateFormat.replace("yyyy", "yy");
			};

			var getFirstDayOfTheWeek = function() {
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

            var updateTime = function(element, valueAccessor) {
                var $element = $(element);
                var dateValue = ko.utils.unwrapObservable(valueAccessor());
                if(!dateValue) return;

                dateValue = new Date(dateValue);
                var date = new Date(0);
                date.setFullYear(dateValue.getUTCFullYear());
                date.setMonth(dateValue.getUTCMonth());
                date.setDate(dateValue.getUTCDate());

                var hours = dateValue.getUTCHours();
                var minutes = dateValue.getUTCMinutes();
                var seconds = dateValue.getUTCSeconds();

                $element.datepicker("setDate", date);
                var data = $element.data('timepicker');
                if(data) {
                    if(!data.$hours.is(':focus')) {
                        if(Number(data.$hours.val) != hours) {
                            data.$hours.val(String(hours).lPad('0', 2));
                        }
                    }
                    if(!data.$minutes.is(':focus')) {
                        if(Number(data.$minutes.val) != minutes) {
                            data.$minutes.val(String(minutes).lPad('0', 2));
                        }
                    }
                    if(!data.$seconds.is(':focus')) {
                        if(Number(data.$seconds.val) != seconds) {
                            data.$seconds.val(String(seconds).lPad('0', 2));
                        }
                    }
                }
            };

			return {
				init : function(element, valueAccessor, allBindingsAccessor) {
                    // handle disposal (if KO removes by the template binding)
                    var $element = $(element);
                    var o = $.extend({}, getDateTimePickerOptions());
                    o.value = valueAccessor();

                    defer(function() {

                       o.onClose = function() {
                           $element.trigger('datetimechange');
                       };
                       
                       $element.datepicker(o);
                       updateTime(element, valueAccessor);

                    });

                },
                update : function(element, valueAccessor) {
                    updateTime(element, valueAccessor);
                    defer(function() {
                        var $this = $(element);
                        var data = $this.data('timepicker');
                        if(data) {
                            if($this.hasClass('dt-readonly')) {
                                data.$hours.bind('')
                                data.$hours.attr('disabled', 'disabled');
                                data.$minutes.attr('disabled', 'disabled');
                                data.$seconds.attr('disabled', 'disabled');
                            } else {
                                data.$hours.removeAttr('disabled', 'disabled');
                                data.$minutes.removeAttr('disabled', 'disabled');
                                data.$seconds.removeAttr('disabled', 'disabled');
                            }
                        }
                    })
                }
			};
		}());
	});
})(window.oneesp, window.jQuery, window.ko);