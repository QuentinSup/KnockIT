import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

export class NanoScrollBinding extends AbstractBinding {

    constructor() {
        super('nanoScroll');    
    }
    
    init(element, valueAccessor) {}
    
    update(element, valueAccessor) {
        
        let nanoClassName: string = 'nano-field-select';
        
        let value: any = ko.unwrap(valueAccessor);
        let $this: JQuery = $(element);
        
        let isInitialized: any = $this.data('nanoScrollInitialized');
        
        if(value === false) {

            $this.nanoScroller({ destroy: true });
            
            if(isInitialized === true) {
                $this.removeClass(nanoClassName);  
                $($this.children()[0]).removeClass('nano-content'); 
                $this.unbind('.nanoScrollerBinding');
            }
            
        } else {
            
            if(!isInitialized) {
            
                $this.data('nanoScrollInitialized', true);
                $this.addClass(nanoClassName);
                $($this.children()[0]).addClass('nano-content');
                $this.on('mouseenter.nanoScrollerBinding', function() {
                    let $this = $(this);
                    $this.nanoScroller();    
                });
                
            }
            
            $this.nanoScroller();
            
        }
    }
 
}