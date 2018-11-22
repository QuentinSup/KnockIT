import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

var getValueAccessor = function(content: any, viewModel: any) {
    if(typeof(content) == "object") {
        if(content.sdata) {
            return () => { return app.i18n.getObservableString(content.prop)().format(content.sdata); };
        }
        return () => { return utils.formatString(app.i18n.getObservableString(content.prop)(), content.data || viewModel); };
    }
    
    return () => { return utils.formatString(app.i18n.getObservableString(content)(), viewModel); };

};

var setTitle = function(element, valueAccessor): void {
    var inputType_: string = valueAccessor();
    
    if(inputType_) {
        try  {
            $(element).attr('title', inputType_);
        } catch(e) {}
    }    
};
    
export class i18nBinding extends AbstractBinding {

    constructor() {
        super('i18n');    
    }

	init(element, valueAccessor, allBindings, viewModel, bindingContext) {
               
		var content = valueAccessor();
	    var $this = $(element);
        
        valueAccessor = getValueAccessor(content, viewModel);

	    ko.bindingHandlers['html'].init(element, valueAccessor, allBindings, viewModel, bindingContext);
	}
    
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
	    var content = valueAccessor();
	    var $this = $(element);
	    
        valueAccessor = getValueAccessor(content, viewModel);

        ko.bindingHandlers['html'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
       
	}
    
}

export class i18nTitleBinding extends AbstractBinding {
 
    constructor() {
        super('i18nTitle');    
    }
    
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        
        
        var content = valueAccessor();
        var $this = $(element);
        
        valueAccessor = getValueAccessor(content, viewModel);
        setTitle(element, valueAccessor); 
        
    }
    
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var content = valueAccessor();
        var $this = $(element);
        
        valueAccessor = getValueAccessor(content, viewModel);
        setTitle(element, valueAccessor);  
    }
}
    