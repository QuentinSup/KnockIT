import { AbstractBinding } from '@webkit/core/AbstractBinding.class';
    
function css_time_to_milliseconds(time_string) {
   let num: number = CFloat(time_string);
   let unit: any = (time_string + "").match(/m?s/);
   let milliseconds;

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
        let $this = $(element);            
	}
    
    update(element, valueAccessor) {
	    let value = ko.unwrap(valueAccessor());
        
        if(!value) return;
        
	    let $this = $(element);

        $this.addClass('animated');
        
        if(typeof(value) == "string") {
            value = { 'animation': value };
        }
            
        let animationValue: string = isset(value.animation)?ko.unwrap(value.animation):null;
        if(animationValue) {
            $this.data('animation', animationValue);
        }
        
        let delay: string = value.delay?ko.unwrap(value.delay):null;
        if(delay) {
            $this.data('delay', delay);
        }
        
        let duration: string = isset(value.duration)?ko.unwrap(value.duration):null;
        if(duration) {
            $this.data('duration', duration);
        }
        
        let currentAnimation: string = <any>$this.data('current-animation');
        let currentAnimationId: number = <any>$this.data('current-animationId');
        if(currentAnimationId) {
            clearTimeout(currentAnimationId);
        }
        if(currentAnimation) {
            $this.removeClass(currentAnimation).removeClass('animate-start-' + currentAnimation).removeClass('animate-end-' + currentAnimation);
        }
        
        // Set first animation start class
        let dataAnimation: string = <any>$this.data('animation') || 'fadeIn';
        let animations: string[] = dataAnimation.split(',');
        let animation: string = animations.shift();
        $this.addClass('animate-start-' + animation);
  
        let fnAppear:Function = function() {
            let $element = $(this);
            let dataAnimation: string = <any>$element.data('animation') || 'fadeIn';
            let animations: string[] = dataAnimation.split(',');
            let dataDelay = <any>$element.data('delay') || 0;
            let dataDuration: string = <any>$element.data('duration') || '.3s';
            
            //  set animation duration value
            $element.css('-webkit-animation-duration', dataDuration);
            $element.css('animation-duration', dataDuration);
                
            $element.data('current-animationId', setTimeout(function() {
 
                let fn: Function = function(animations: string[], duration: number) {

                    if(animations.length == 0) return;
                    
                    let currentAnimation: string = <any>$element.data('current-animation');
                    if(currentAnimation) {
                        $element.removeClass(currentAnimation);
                        $element.removeClass('animate-end-' + currentAnimation);
                    }

                    let animation: string = animations.shift();
                    
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
            
        let whenAppear: boolean = isset(value.whenAppear)?ko.unwrap(value.whenAppear):true;
        whenAppear = whenAppear && isset($this.appear);
        if(whenAppear) {
            $this.appear(fnAppear);
        } else {
            fnAppear.call(element);
        }
            
	}
}