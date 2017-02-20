/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module kit.bindings {
    
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
		    
		    if(typeof(content) == "object") {
		    	content = {
		    		text: ko.unwrap(content.text),
		    		animation: ko.unwrap(content.animation),
		    		position: ko.unwrap(content.position)
		    	};
		    } else {
		    	content = {
		    		text: ko.unwrap(content)
		    	};
		    }
		    
		    var oldContent = $this.data("kotooltipster");
		    if (content != oldContent) {
                if(oldContent) {
                    if($this.tooltipster) {
                        try {
                            $this.tooltipster('destroy');
                        } catch(e) {}
                    }
                }
                if (content.text) {
    				var position = content.position || $this.attr('data-ttposition') ;
    				var animation = content.animation || $this.attr('data-ttanimation');
    				
    				$this.data("kotooltipster", content);
    				if($this.tooltipster) {
                        $this.attr("title", content.text);
    					$this.tooltipster({
    						animation: animation,
                            updateAnimation: false,
    						contentAsHTML: true,
    						delay: 100,
    						position: position,
                            hideOnClick: true,
                            autoClose: true,
                            onlyOne: true,
                            touchDevices: true,
                            trigger: (app.context.device == 'computer'?'hover':'click')
    					});
    				} else {
                        $this.attr("title", content.text.text().replaceAll("&nbsp;", " "));
                    }
                } else if (content.text === "") {
                    $this.attr("title", content.text);
                }
		    }
		}
	};
    
}