import { AbstractBinding } from '@webkit/core/AbstractBinding.class';
import { Locale } from '@webkit/core/Locale.class';

let format = function(content: any) {
    
    let locale: Locale = app.i18n.getCurrentLocale();
    let digits: number = isNaN(content.digit)?2:content.digit;
    if(content.name == "percent") {
        return "%s &#37;".format(utils.formatDecimal(content.value, digits, locale))
    }
    
    if(content.name == "currency") {
        return "%s %s".format(utils.formatDecimal(content.value, digits, locale), locale.currencySymbol)
    }
    
    if(content.name == "currencyPerMonth") {
        return "%s %s%s".format(utils.formatDecimal(content.value, digits, locale), locale.currencySymbol, app.i18n.getString('perMonth'))
    }
    
    if(content.name == "replace") {
        return utils.formatString(content.value, content.data);
    }
    
    if(content.name == "month") {
        return "%s %s".format(content.value, app.i18n.getString('month'));
    }
    
    if(content.name == "date") {
        return utils.formatDate(content.value, content.dateFormat || locale.dateFormat);
    }
    
    if(content.name == "datetime") {
        return utils.formatDate(content.value, content.dateFormat || locale.dateFormat, content.hourFormat || "hh:mm");
    }

};

let getValueAccessor = function(content: any, name: string) {
    if(typeof(content) == "object") {
        return () => { return {
            value: content.value,
            digit: content.digit,
            name: name,
            data: content.data
         }};
    }
    return () => { return {
            value: content,
            name: name
    }};
};

export class FormatBinding extends AbstractBinding {

    constructor(name: string = 'format') {
        super(name);    
    }
    
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $this: JQuery = $(element);
        $this.data("koformat", { value:  $this.html() });
    }
    
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let content: any = valueAccessor();
        let $this: JQuery = $(element);
        
        let oldContent: any = <any>$this.data("koformat");
        
        if(typeof(content) == "object") {
            content = {
                value: ko.unwrap(content.value),
                name: ko.unwrap(content.name),
                digit: ko.unwrap(content.digit),
                data: ko.unwrap(content.data || viewModel),
                dateFormat: ko.unwrap(content.dateFormat),
                hourFormat: ko.unwrap(content.dateFormat)
            };
        } else {
            content = {
                value: oldContent.value,
                name: ko.unwrap(content),
                data: ko.unwrap(viewModel)
            };
        }
        
        if (content != oldContent) {

            $this.data("koformat", content);
            $this.html(format(content));
            
        }
    }
}

export class AbstractFormat extends FormatBinding {

    private format: string;
    
    constructor(name: string, format: string) {
        super(name);
        this.format = format;    
    }
    
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let content: any = valueAccessor();
        let $this: JQuery = $(element);
        
        valueAccessor = getValueAccessor(content, this.format);

        super.update(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
}


export class FormatCurrencyBinding extends AbstractFormat {

    constructor() {
        super('formatCurrency', 'currency');    
    }
    
}

export class FormatCurrencyPerMonthBinding extends AbstractFormat {

    constructor() {
        super('formatCurrencyPerMonth', 'currencyPerMonth');    
    }

}

export class FormatPercentBinding extends AbstractFormat {

    constructor() {
        super('formatPercent', 'percent');    
    }

}

export class FormatDateBinding extends AbstractFormat {

    constructor() {
        super('formatDate', 'date');    
    }

}

export class FormatDateTimeBinding extends AbstractFormat {

    constructor() {
        super('formatDateTime', 'datetime');    
    }

}

export class FormatMonthBinding extends AbstractFormat {

    constructor() {
        super('formatMonth', 'month');    
    }

}