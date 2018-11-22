import { Option } from './classes/Option.class';
import { InputUIField } from '@webkit/form/InputUIField';

export class SelectUIField extends InputUIField {

    public static useNativeDialogSelect: KnockoutObservable<boolean> = ko.observable<boolean>(true);

    private choices: any[] = []
    private outputValue: KnockoutSubscribable<any>
    private valuableValue: KnockoutComputed<string>
    private _valueToSet: string = null
    private _valueToForce: string = null
    public options: KnockoutObservableArray<any> = ko.observableArray()
    public view: KnockoutObservable<string> = ko.observable('default')
    public inline: KnockoutObservable<boolean> = ko.observable<boolean>(false)
    public selectedOptionText: KnockoutObservable<string> = ko.observable<string>()
    public selectedOption: KnockoutObservable<Option> = ko.observable<Option>()
    public useNativeDialogSelect: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    public autoSort: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    public autoSortFunction = null;
    public size: KnockoutComputed<number>;

    private __optionsThrottle: number;
    private _oldChoicesStringified: string;
    private _onChangeEventDefer: number;

    constructor(id: string, choices: any, value: any, required?: boolean, readOnly?: boolean) {

        super(id, value, required, readOnly)
        this.inputTemplate = "ui-field-select-template"
        
        
        SelectUIField.useNativeDialogSelect.immediateSubscribe((b: boolean): void => {
            this.useNativeDialogSelect(b);
        });

        this.size = ko.computed<number>((): number => {
            return this.options().length;
        }).extend({ throttle: 0 });
        
        this.options.subscribe((): void => {

            this.updateListOfChoices();
            
            clearTimeout(this.__optionsThrottle);
            this.__optionsThrottle = defer((): void => {
                var options_: any = this.options(); // Le computed s'enregistre sur l'observable
                if (this._valueToForce != null) {
                    this.forceValue(this._valueToForce);
                }
                if (this._valueToSet != null) {
                    if (this.isValidateValue(this._valueToSet)) {
                        var v_: string = this._valueToSet;
                        this._valueToSet = null;
                        this.outputValue(v_);
                    }
                }

                this.value.notifySubscribers(this.value());
                
            });

        }); //.extend({ throttle: 0 }); // Utilisation du throttle pour laisser le temps à l'IHM de rafraichir la liste des options du select

        this.updateChoices(choices)
        
        this.autoSort.immediateSubscribe((b: boolean): void => {
           if(b) {
               this.sort(this.autoSortFunction);
           }
        });
        
        this.value.immediateSubscribe((v: string): void => {
            var options_ = this.options();
            var option_ = options_[this.choices.indexOf(CString(v))];
            this.selectedOption(option_ || null);
            this.selectedOptionText(option_ ? option_.text() : '');
            if (this.choices.length == 1 && this.choices[0] == v) {
                this.hasBeenVisited(true);
            }
        });

    }

    public onChangeEventHandler(e: Event): boolean {
        if (this.isFocused() == true) {
            this._onChangeEventDefer = defer((): void => {
                this.isFocused(false);
                this.hasBeenVisited(true);
            }, 100);
        }
        return true;
    }
    public onChangeWithoutFocusEventHandler(e: Event): boolean {

        this._onChangeEventDefer = defer((): void => {
            this.isFocused(false);
            this.hasBeenVisited(true);
        }, 100);

        return true;
    }
   public onChangeCustomSelectEventHandler(e: Event): boolean {
       
        this._onChangeEventDefer = defer((): void => {
            this.isFocused(false);
            this.hasBeenVisited(true);
            var id = '#'+this.uid;
            if (this.inputTemplate == "ui-table-field-select-template" && $(id).hasClass('selectpicker')){
            	$(id).parents('tr').addClass('ui-group-visited');
            }
            
        }, 100);
        
        return true;
   }

    /**
     * Validates the value for the property.
     * @param {?(number|string)} value The value for this property.
     * @type {function({?(number|string)})}
     */
    public isValidateValue(value): boolean {
        var isValid: boolean = super.isValidateValue(value);
        if (isValid && !this.valueIsEmpty(value)) {
            var choices = this.choices
            if (choices) {
                isValid = (choices.indexOf(String(value)) > -1);
            }
        }

        return isValid
    }


    public getValuable(): KnockoutSubscribable<any> {
        this.outputValue = super.getValuable();
        this.valuableValue = ko.computed<string>({
            read: function() {
                var value: string = this.outputValue();
                if (this.isValidateValue(value)) {
                    return value;
                }
                return null;
            },
            write: function(value: string) {

                if (value != null && !this.isValidateValue(value)) {
                    this._valueToSet = value;
                    value = this.choices ? this.choices[0] || null : null;
                }
                if (this.outputValue() != value) {
                    this.outputValue(value);
                }
                this.outputValue.notifySubscribers();
            },
            owner: this
        });
        return this.valuableValue;
    }

    /**
     * Set value and apply changes in one call
     */
    public forceValue(value): void {
        if (this.isValidateValue(value)) {
            super.forceValue(value);
            this._valueToForce = null;
        } else {
            this.oldValue(value);
            this.value(value);
            this._valueToForce = value;
        }
    }

    /**
     * Construit une liste d'éléments Option
     */
    public getListOfOptions(newChoices: any): Option[] {
        var options: any[]
        options = []

        if (newChoices) {
            if (!$.isArray(newChoices)) {

                $.each(newChoices, (v, k): void => {
                    options.push(new Option(CString(v).trim(), CString(k).trim()))
                });

            } else {
                var choicesCount = newChoices.length
                for (var choiceIndex: number = 0; choiceIndex < choicesCount; choiceIndex++) {
                    var objChoice: any = newChoices[choiceIndex];
                    if (objChoice instanceof Option) {
                        options.push(objChoice);
                    } else {
                        if (typeof (objChoice) == "object") {
                            var optionValue = isset(objChoice.value) ? objChoice.value : objChoice.id;
                            var option: Option = new Option(optionValue, objChoice.label, objChoice.label || (this.id + '.list[' + optionValue + ']'));
                            option.data = objChoice;
                            options.push(option);
                        } else {
                            var choice = CString(objChoice).trim();
                            options.push(new Option(choice, choice, this.id + '.list[' + choice + ']'));    
                        }
                    }
                }
            }
        }

        return options;
    }

    public addChoices(newChoices: any): void {
        var options: Option[] = this.getListOfOptions(newChoices);
        var options_: Option[] = this.options().concat(options);
                  
        if(this.autoSort()) {
            options_ = this.__sort(options_, this.autoSortFunction);   
        }

        this.options.valueWillMutate();
        this.options(options_);

    }

    public removeChoices(oldchoices: any): void {

        var options: any[], optionsList: Option[]
        options = []
        optionsList = this.options()

        if (oldchoices) {
            if (!$.isArray(oldchoices)) {

                $.each(oldchoices, (v, k): void => {
                    var opt: Option = optionsList.findBy('value', v);
                    if (opt) {
                        options.push(opt)
                    }
                });

            } else {
                var choicesCount = oldchoices.length
                for (var choiceIndex = 0; choiceIndex < choicesCount; choiceIndex++) {
                    var choice = oldchoices[choiceIndex]
                    var opt: Option = optionsList.findBy('value', choice);
                    if (opt) {
                        options.push(opt)
                    }
                }
            }
        }

        this.options().removeAll(options)
        this.options.valueHasMutated()

    }

    /**
     * Update this select with the given choices.
     */
    public updateChoices(newChoices: any): void {

        var strNewChoices = JSON.stringify(newChoices)

        if (this._oldChoicesStringified == strNewChoices) {
            return;
        }

        this._oldChoicesStringified = strNewChoices;

        var value_: string = null;
        if (this._valueToSet == null && this._valueToForce == null) {
            value_ = this.outputValue();
        }

        this.options().removeAll()

        this.addChoices(newChoices)

        if (value_ != null) {
            this.outputValue(value_);
        }
        var id = '#' + this.uid;
        if ($(id).hasClass('selectpicker')) {
            $(id).selectpicker('refresh');
        }
    }

    public viewRadiosOptionClickFunction(option: Option, e: any): void {
        this.value(option.value)
        this.hasBeenVisited(true)
    }


    /**
     * Retourne si la liste contient la valeur
     */
    public hasChoice(choice: string[]): boolean
    public hasChoice(choice: string): boolean
    public hasChoice(choice: any): boolean {
        return this.choices.contains(choice);
    }

    public sort(compareFn?: (a: Option, b: Option) => number): Option[] {

        this.__sort(this.options(), compareFn);            
        this.options.valueHasMutated()

        return this.options()
    }
    
    private __sort(options: Option[], compareFn?: (a: Option, b: Option) => number): Option[] {

        if (!compareFn) {
            compareFn = function(a: Option, b: Option): number {
                return a.text().toLowerCase() > b.text().toLowerCase() ? 1 : -1
            }
        }

        return options.sort(compareFn)
    }

    private updateListOfChoices(options: Option[] = this.options()): void {
        this.choices = [];

        for (var i: number = 0, len: number = options.length; i < len; i++) {
            var option_: Option = options[i];
            this.choices.push(CString(option_.value));
        }
        
    }

    public listCount(): number {
        return this.choices.length;
    }

    /**
     * @Override
     */
    public getDataValue(): string {
        var s_: string = super.getDataValue();
        var option_: Option = this.selectedOption ? this.selectedOption() : null;
        if (s_ && option_ && option_.disabled()) {
            return null;
        }
        return s_;
    }

    /**
     * Sélectionne la première page.
     */
    public selectFirst(): void {
        if (this.listCount() > 0) {
            this.value(this.options()[0].value);
        }
    }

    /**
     * @Override
     */
    public dispose(): void {
        super.dispose();
        dispose(this.valuableValue);
    }

}

SelectUIField.useNativeDialogSelect.subscribe(function(b: boolean) {

    $(document).unbind('.disableNativeDialogSelect');

    if (!b) {

        let attachToParent = function() {
            let $this = $(this);
            let relId: string = $this.attr('data-rel');
            let $relParent: any = $('#' + relId).parent();
            if ($this.parent() != $relParent) {
                let relId: string = $this.attr('data-rel');
                $this.detach().appendTo($relParent);
            }
        };

        let hideOptionsList = function(e) {
            let $this = $(this);
            let relId: string = $this.attr('id');
            $('.ui-field-select-options-list[data-rel=' + relId + ']').each(function() {
                attachToParent.call(this);
            });
        };

        let hideAllOptionsList = function() {
            let $list = $('.ui-field-select-options-list');
            $list.each(function() {
                attachToParent.call(this);
            });
        };

        let showOptionList = function(e) {

            e.preventDefault();
            e.stopImmediatePropagation();

            hideAllOptionsList();

            let $this = $(this);

            $this.focus();

            $this.parent().find('.ui-field-select-options-list').each(function() {
                let $this = $(this);
                let $window = $(window);
                let relId: string = $this.attr('data-rel');
                let $rel = $('#' + relId);
                $this.detach().appendTo($('body'));

            	let relPos= $rel.offset();
            	let relHeight = $rel.outerHeight(true);
            	let espaceRestantBottom = $window.innerHeight() - relPos.top - relHeight + $window.scrollTop();
            	let espaceRestantTop = relPos.top - $window.scrollTop();
            	
            	let thisPos = $this.offset();
            	let thisHeight = $this.height();
            	//hauteur +padding+margin
            	let thisOuterHeight = $this.outerHeight(true);
                let thisOuterWidth = $this.outerWidth(true);
            	
                let positionLeft = $rel.offset().left;
                if(positionLeft + thisOuterWidth > $window.innerWidth()) {
                    // Si la largeur de la zone dépasser la bordure droite
                    positionLeft = $window.innerWidth() - thisOuterWidth; 
                }
                //largeur du select                    
                let minWidth = $rel[0].offsetWidth;
                if(positionLeft < 0) {
                    // Si la taille de la zone est supérieure à la taille de la fenêtre
                    positionLeft = 0;
                    $this.width($window.innerWidth());
                    if (minWidth > $window.innerWidth()){
                    	$this.css('min-width', $window.innerWidth()+"px");
                    }
                } else {
                	$this.css('min-width',minWidth+"px");
                    $this.width('auto');    
                }
                
                
                //positionnement de la fleche
                var pseudoElementBefore = window.getComputedStyle($this[0], ':before');
                var pseudoElementAfter = window.getComputedStyle($this[0], ':after');
                let pseudoElementBeforeLeftInitial = pseudoElementBefore.left;
                if (pseudoElementBeforeLeftInitial.indexOf("px")!==-1){
                	//le style est en pixel, il faut donc mettre à jour pour que la flèche soit bien positionnée
                	let relPosLeft = relPos.left;
                	//si la liste s'ouvre plus à gauche que le select, on calcul de combien il faut décaler la flèche pour qu'elle semble à la même place que sur les autres listes
                	if (positionLeft<relPosLeft){
                		var pseudoElementBeforeLeftNew = relPosLeft-positionLeft;
                		$this[0].style.setProperty("--leftbefore", pseudoElementBeforeLeftNew+"px");
                		$this[0].style.setProperty("--leftafter", pseudoElementBeforeLeftNew+"px");
                	}
                }
                
            	//on ajoute la classe dropup si l'espace disponible au dessus est supérieur à l'espace dispo en dessous et si l'espace en dessous n'est pas suffisant
            	$this.toggleClass('dropup', espaceRestantTop > espaceRestantBottom && espaceRestantBottom < thisOuterHeight);
            	//TODO : réduire max-height à l'espace dispo - marge - padding si l'espace disponible est plus petit que la hauteur déjà définie -> sur le ul
            	if ($this.hasClass('dropup')) {
                	$this.css({
	                        left: positionLeft,
	                        top: $rel.offset().top - thisOuterHeight
	                    });
            	}else{
            		$this.css({
                        left: positionLeft,
                        top: $rel.offset().top + $rel.outerHeight()
                    });
            	}

            });
        };

        $(document).on('click.disableNativeDialogSelect mousedown.disableNativeDialogSelect', '.ui-field-select-dialog > select', function(e) {
            showOptionList.call(this, e);
        });

        $(document).on('blur.disableNativeDialogSelect', '.ui-field-select-dialog > select', function(e) {
            let t = this;
            defer((): void => {
                hideOptionsList.call(t, e);
            });
        });

        $(document).on('keydown.disableNativeDialogSelect', '.ui-field-select-dialog > select', function(e) {

            switch (e.key) {
                case " ":
                case "Enter":
                    showOptionList.call(this, e);
                    break;
                case "Escape":
                    hideOptionsList.call(this, e);
                    break;
            }

        });

        $(document).on('click.disableNativeDialogSelect', function() {
            //hideAllOptionsList();
        });

        $(document).on('mousedown.disableNativeDialogSelect', '.ui-field-select-options-list a', function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        });
        
        $(document).on('click.disableNativeDialogSelect', '.ui-field-select-options-list a', function(e) {
            let t = this;
            let $this = $('#' + $(t).parents('.ui-field-select-options-list:first').attr('data-rel'));
            defer((): void => {
                hideOptionsList.call($this[0], e);
                $this.focus();
            });
        });
    }
});