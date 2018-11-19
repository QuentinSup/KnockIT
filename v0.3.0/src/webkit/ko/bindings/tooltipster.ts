/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module fr.ca.cat.bindings {
    
	ko.bindingHandlers['tooltip'] = {
		init : function(element, valueAccessor) {
			// handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				var $this = $(element);
				if($this.tooltipster) {
					try {
						$this.tooltipster('destroy').off('.tooltipster');
					} catch(e) {}
				}
			});
		},
		update : function(element, valueAccessor) {
		    var content = ko.unwrap(valueAccessor());
		    var $this = $(element);
		    
		    if(content != null && typeof(content) == "object") {
		    	content = {
		    		text: ko.unwrap(content.text),
		    		animation: ko.unwrap(content.animation),
		    		position: ko.unwrap(content.position),
                    permanent: ko.unwrap(content.permanent)
		    	};
		    } else {
		    	content = {
		    		text: ko.unwrap(content)
		    	};
		    }
		    
		    var oldContent = $this.data("kotooltipster");
		    if (content != oldContent) {
                if(oldContent) {
                    
                    $this.attr("title", null);
                    
                    if($this.tooltipster) {
                        try {
                            $this.tooltipster('destroy');
                        } catch(e) {}
                    }
                }
                if (content && content.text) {
    				let position = content.position || $this.attr('data-ttposition') ;
    				let animation = content.animation || $this.attr('data-ttanimation');
    				let title: string = content.text.text().replaceAll("&nbsp;", " ");
                    let permanent = content.permanent || $this.attr('data-ttpermanent');
                    
                    let autoClose: boolean = !permanent;
                    let hideOnClick: boolean = true;
                    
    				$this.data("kotooltipster", content);
    				if($this.tooltipster) {
                        $this.attr("title", content.text);
    					$this.tooltipster({
    						animation: animation,
                            updateAnimation: false,
    						contentAsHTML: true,
    						delay: 100,
    						position: position,
                            hideOnClick: hideOnClick,
                            autoClose: autoClose,
                            onlyOne: true,
                            touchDevices: true,
                            trigger: (app.context.device == 'computer'?'hover':'click')
    					});
                            
                        if(permanent) {
                            $this.tooltipster('show');   
                        }
                            
    				} else {
                        $this.attr("title", title);
                    }
                } else {
                    $this.attr("title", null);
                }
		    }
		}
	};
    
}