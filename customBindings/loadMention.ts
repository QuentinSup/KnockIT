/**
 * @fileOverview This file defines the loadMention custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module fr.fwk.knockit.bindings {

	ko.bindingHandlers['loadMention'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var options: any = ko.unwrap(valueAccessor());
			var mentions: any = options.mentions;
            var url: any = options.url;
			var $element = $(element);
            $element.html("");
            
            var results = [];
            function buildMentions(){
                for(var i: number = 0; i<results.length; i++){
                    if(results[i] != "" && results[i] != "&nbsp;"){
                        if(isFirst){
                            isFirst = false;
                        }else{
                            $element.append("<br/>");
                        }
                        $element.append("<div>"+results[i]+"</div>");
                    }
                }
            };
            
            function getMention(i: number){
                results[i] = null;
                $.get(url + "/" + mentions[i], function(result){
                    results[i] = result;
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