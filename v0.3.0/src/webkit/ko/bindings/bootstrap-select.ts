/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
    
    ko.bindingHandlers['bootstrap-select'] = {
        init : function(element, valueAccessor) {
            // handle disposal (if KO removes by the template binding)
           
                var $this = $(element);
                    try {
                        
                        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
//                                $this.selectpicker('mobile');
                        }else{
                                $this.addClass("selectpicker show-menu-arrow-custo");
                                $this.selectpicker({ language: 'FR' });
                        }
                    } catch(e) {}
                
            
        },
        update : function(element, valueAccessor) {
            
        }
    };
    
}