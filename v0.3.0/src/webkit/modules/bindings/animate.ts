import { AbstractBinding } from '@webkit/core/AbstractBinding.class';
    
function css_time_to_milliseconds(time_string) {
   var num: number = CFloat(time_string);
   var unit: any = (time_string + "").match(/m?s/);
   var milliseconds;

   if (unit) {
       unit = unit[0];
   }

   switch (unit) {
       case "s": // seconds
           milliseconds = num * 1000;
           break;
       case "ms": // milliseconds
           milliseconds = num;
           break;
       default:
           milliseconds = num;
           break;
   }

   return milliseconds;
}
    
export class AnimateBinding extends AbstractBinding {
    
    constructor() {
        super('animate');   
    }
    
	init(element, valueAccessor) {
        var $this = $(element);            
	}
    
    update(element, valueAccessor) {
	    var value = ko.unwrap(valueAccessor());
        
        if(!value) return;
        
	    var $this = $(element);

        $this.addClass('animated');
        
        if(typeof(value) == "string") {
            value = { animation: value };
        }
            
        var animation: string = isset(value.animation)?ko.unwrap(value.animation):null;
        if(animation) {
            $this.data('animation', animation);
        }
        
        var delay: string = value.delay?ko.unwrap(value.delay):null;
        if(delay) {
            $this.data('delay', delay);
        }
        
        var duration: string = isset(value.duration)?ko.unwrap(value.duration):null;
        if(duration) {
            $this.data('duration', duration);
        }
        
        var currentAnimation: string = <any>$this.data('current-animation');
        var currentAnimationId: number = <any>$this.data('current-animationId');
        if(currentAnimationId) {
            clearTimeout(currentAnimationId);
        }
        if(currentAnimation) {
            $this.removeClass(currentAnimation).removeClass('animate-start-' + currentAnimation).removeClass('animate-end-' + currentAnimation);
        }
        
        // Set first animation start class
        var dataAnimation: string = <any>$this.data('animation') || 'fadeIn';
        var animations: string[] = dataAnimation.split(',');
        var animation: string = animations.shift();
        $this.addClass('animate-start-' + animation);
  
        var fnAppear:Function = function() {
            var $element = $(this);
            var dataAnimation: string = <any>$element.data('animation') || 'fadeIn';
            var animations: string[] = dataAnimation.split(',');
            var dataDelay = <any>$element.data('delay') || 0;
            var dataDuration: string = <any>$element.data('duration') || '.3s';
            
            //  set animation duration value
            $element.css('-webkit-animation-duration', dataDuration);
            $element.css('animation-duration', dataDuration);
                
            $element.data('current-animationId', setTimeout(function() {
 
                var fn: Function = function(animations: string[], duration: number) {

                    if(animations.length == 0) return;
                    
                    var currentAnimation: string = <any>$element.data('current-animation');
                    if(currentAnimation) {
                        $element.removeClass(currentAnimation);
                        $element.removeClass('animate-end-' + currentAnimation);
                    }

                    var animation: string = animations.shift();
                    
                    $element.removeClass('animate-start-' + animation);
                    $element.data('current-animation', animation).addClass(animation);
                    
                    if(animations.length > 0) {
                        // Set next animation start class
                        $element.addClass('animate-start-' + animations[0]);
                    }
                    
                    $element.data('current-animationId', setTimeout(function() { $element.addClass('animate-end-' + animation); fn(animations, duration); }, duration));
                    
                }
                       
                fn(animations, css_time_to_milliseconds(dataDuration));
                    
                  
            }, css_time_to_milliseconds(dataDelay)));
        };
            
        var whenAppear: boolean = isset(value.whenAppear)?ko.unwrap(value.whenAppear):true;
        whenAppear = whenAppear && isset($this.appear);
        if(whenAppear) {
            $this.appear(fnAppear);
        } else {
            fnAppear.call(element);
        }
            
	}
}