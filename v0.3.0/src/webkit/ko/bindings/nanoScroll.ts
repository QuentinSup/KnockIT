/**
 * @fileOverview This file defines the nanoScroll custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
    
    ko.bindingHandlers['nanoScroll'] = {
        init : function(element, valueAccessor) {
            // handle disposal (if KO removes by the template binding)
        },
        update : function(element, valueAccessor) {
            
            let nanoClassName = 'nano-field-select';
            
            let value: any = ko.unwrap(valueAccessor);
            let $this = $(element);
            
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
    };
    
}