import { AbstractBinding } from '@webkit/core/AbstractBinding.class';
import { I18n } from '@webkit/manager/i18n';

let getDateTimePickerOptions = function (i18n: I18n) {
            
    let _strings: any = {
        // JQuery date and time picker labels
        january : i18n.getObservableString('january'),
        february : i18n.getObservableString('february'),
        march : i18n.getObservableString('march'),
        april : i18n.getObservableString('april'),
        may : i18n.getObservableString('may'),
        june : i18n.getObservableString('june'),
        july : i18n.getObservableString('july'),
        august : i18n.getObservableString('august'),
        september : i18n.getObservableString('september'),
        october : i18n.getObservableString('october'),
        november : i18n.getObservableString('november'),
        december : i18n.getObservableString('december'),
        januaryAbbr : i18n.getObservableString('januaryAbbr'),
        februaryAbbr : i18n.getObservableString('februaryAbbr'),
        marchAbbr : i18n.getObservableString('marchAbbr'),
        aprilAbbr : i18n.getObservableString('aprilAbbr'),
        mayAbbr : i18n.getObservableString('mayAbbr'),
        juneAbbr : i18n.getObservableString('juneAbbr'),
        julyAbbr : i18n.getObservableString('julyAbbr'),
        augustAbbr : i18n.getObservableString('augustAbbr'),
        septemberAbbr : i18n.getObservableString('septemberAbbr'),
        octoberAbbr : i18n.getObservableString('octoberAbbr'),
        novemberAbbr : i18n.getObservableString('novemberAbbr'),
        decemberAbbr : i18n.getObservableString('decemberAbbr'),
        monday : i18n.getObservableString('monday'),
        tuesday : i18n.getObservableString('tuesday'),
        wednesday : i18n.getObservableString('wednesday'),
        thursday : i18n.getObservableString('thursday'),
        friday : i18n.getObservableString('friday'),
        saturday : i18n.getObservableString('saturday'),
        sunday : i18n.getObservableString('sunday'),
        mondayAbbr : i18n.getObservableString('mondayAbbr'),
        tuesdayAbbr : i18n.getObservableString('tuesdayAbbr'),
        wednesdayAbbr : i18n.getObservableString('wednesdayAbbr'),
        thursdayAbbr : i18n.getObservableString('thursdayAbbr'),
        fridayAbbr : i18n.getObservableString('fridayAbbr'),
        saturdayAbbr : i18n.getObservableString('saturdayAbbr'),
        sundayAbbr : i18n.getObservableString('sundayAbbr'),
        firstDayOfTheWeek : i18n.getObservableString('firstDayOfTheWeek'),
        today : i18n.getObservableString('today'),
        previous : i18n.getObservableString('previous'),
        next : i18n.getObservableString('next'),
        close : i18n.getObservableString('close')
    };

    let options = {
        onClose: function () { },
        dateFormat: getDateFormat(i18n),
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

let getDateFormat = function(i18n) {
    let dateFormat = i18n.getCurrentLocale().dateFormat;
    return dateFormat.replace("yyyy", "yy");
};

let getFirstDayOfTheWeek = function(_strings): any {
    let firstDayOfTheWeek: string = _strings.firstDayOfTheWeek();
    switch (firstDayOfTheWeek) {
        case _strings.monday():
            return 1;
        case _strings.tuesday():
            return 2;
        case _strings.wednesday():
            return 3;
        case _strings.thursday():
            return 4;
        case _strings.friday():
            return 5;
        case _strings.saturday():
            return 6;
        default: // i.e. (firstDayOfTheWeek == _strings.sunday())
            return 0;
    }
    return firstDayOfTheWeek;
};

let getFirstVisibleInput = function(id): JQuery {
    let $elements: JQuery = $('[id=' + id + ']');
    for(let i = 0; i < $elements.length; i++) {
        let $this = $($elements[i]);
        if($this.is(':visible')) {
            return $this;
        }
    }
    return $('#' + id);
};

export class DatePickerBinding extends AbstractBinding {

    constructor() {
        super('datepicker');    
    }

	init(element, valueAccessor, allBindingsAccessor) {
		let value: any = valueAccessor();

		app.manager.ready(['i18n'], function(i18n: I18n) {
			
            let o = $.extend(value.options || {}, getDateTimePickerOptions(i18n));
            
            o['yearRange'] = (o.minDate?o.minDate.getFullYear():"c-100") + ":" + (o.maxDate?o.maxDate.getFullYear():"c+100"); 
            
            $(element).bind('click.datepicker', function() {
            	getFirstVisibleInput(value.id).datepicker('show');
            });

            defer(function() {
            	getFirstVisibleInput(value.id).datepicker(o);
            });
		});

    }
    
    update(element, valueAccessor) {
    	let value: any = valueAccessor();
    	app.manager.ready(['i18n'], function(i18n: I18n) {
    		let o = $.extend(value.options || {}, getDateTimePickerOptions(i18n));
    		o['yearRange'] = (o.minDate?o.minDate.getFullYear():"c-100") + ":" + (o.maxDate?o.maxDate.getFullYear():"c+100");
    		
    		getFirstVisibleInput(value.id).datepicker('destroy');
    		getFirstVisibleInput(value.id).datepicker(o);
    	});
    }

}