/**
 * @fileOverview This file defines the format custom binding
 *		It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

    export var format = function(content: any) {
        
        var oLocale_: Locale = app.i18n.getCurrentLocale();
        
        if(content.name == "percent") {
            return "%s &#37;".format(utils.formatDecimal(content.value, content.digit || 2, oLocale_))
        }
        
        if(content.name == "currency") {
            return "%s %s".format(utils.formatDecimal(content.value, content.digit || 2, oLocale_), oLocale_.currencySymbol)
        }
        
        if(content.name == "currencyPerMonth") {
            return "%s %s%s".format(utils.formatDecimal(content.value, content.digit || 2, oLocale_), oLocale_.currencySymbol, app.i18n.getString('perMonth'))
        }
        
        if(content.name == "replace") {
            return utils.formatString(content.value, content.data);
        }
        
        if(content.name == "month") {
            return "%s %s".format(content.value, app.i18n.getString('month'));
        }
        
        
    };
    
    var getValueAccessor = function(content: any, name: string) {
        if(typeof(content) == "object") {
            return () => { return {
                value: content.value,
                name: name,
                data: content.data
             }};
        }
        return () => { return {
                value: content,
                name: name
        }};
    };
    
    
    ko.bindingHandlers['formatCurrency'] = {
            init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $this = $(element);
            ko.bindingHandlers['format'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            
            valueAccessor = getValueAccessor(content, 'currency');

            ko.bindingHandlers['format'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }
    };
    
    ko.bindingHandlers['formatCurrencyPerMonth'] = {
            init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $this = $(element);
            ko.bindingHandlers['format'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            
            valueAccessor = getValueAccessor(content, 'currencyPerMonth');

            ko.bindingHandlers['format'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }
    };
    
    ko.bindingHandlers['formatPercent'] = {
            init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $this = $(element);
            ko.bindingHandlers['format'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            
            valueAccessor = getValueAccessor(content, 'percent');

            ko.bindingHandlers['format'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers['formatMonth'] = {
            init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $this = $(element);
                
            ko.bindingHandlers['tooltip'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
            ko.bindingHandlers['format'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
        },
        update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var content = valueAccessor();
            var $this = $(element);
            
            valueAccessor = getValueAccessor(content, 'month');

            var iNbMois_: number = Number(ko.unwrap(valueAccessor().value));
            var sRetour_: string = utils.formatMonthToYear(iNbMois_, false);          
            
            $this.addClass('infotip');   
            
            var tooltipAccessor: any = <any>$this.data("koformatMonthTooltipster");
            if(!tooltipAccessor){
                var tooltip = new fields.Tooltip()
                tooltipAccessor = function(){ return tooltip;};
            }
            tooltipAccessor().text(sRetour_);
            $this.data("koformatMonthTooltipster", tooltipAccessor);
            
            ko.bindingHandlers['tooltip'].update(element, tooltipAccessor, allBindings, viewModel, bindingContext);
            ko.bindingHandlers['format'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }
    };
        
    
	ko.bindingHandlers['format'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    var $this = $(element);
		    $this.data("koformat", { value:  $this.html() });
		},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		    var content = valueAccessor();
		    var $this = $(element);
		    
		    var oldContent = <any>$this.data("koformat");
            
		    if(typeof(content) == "object") {
		    	content = {
		    		value: ko.unwrap(content.value),
		    		name: ko.unwrap(content.name),
                    digit: ko.unwrap(content.digit),
                    data: ko.unwrap(content.data || viewModel)
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
	};
    
}