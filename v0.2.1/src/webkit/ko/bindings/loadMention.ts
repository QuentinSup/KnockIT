/**
 * @fileOverview This file defines the loadMention custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	ko.bindingHandlers['loadMention'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options: any = ko.unwrap(valueAccessor());
			var mentions: any = options.mentions;
            var url: any = options.url;
            var afterRender: any = options.afterRender;
			var $element = $(element);
            $element.html("");
            
            var results = [];
            function buildMentions(){
                for(var i: number = 0; i<results.length; i++){
                    if(results[i].result != "" && results[i].result != "&nbsp;"){
                        if(isFirst){
                            isFirst = false;
                        }else{
                            $element.append("<br/>");
                        }
                        $element.append("<div>" + (results[i].formater ? results[i].formater(results[i].result) : results[i].result) + "</div>");
                    }
                }
                if(afterRender){
                    afterRender();
                }
            };
            
            function getMention(i: number){
                var hasOptions: boolean = typeof mentions[i] === 'object';
                results[i] = {formater: hasOptions ? mentions[i].formater || null : null};
                $.get(url + "/" + (hasOptions ? mentions[i].id : mentions[i]), function(result){
                    results[i].result = result;
                    counter++;
                    if(counter == mentions.length){
                        buildMentions();
                    }
                });
            };
            
            var counter: number = 0;
            var isFirst: boolean = true;
            for(var i: number = 0; i<mentions.length; i++){
                getMention(i);
            }

		},
		
	};
    
}