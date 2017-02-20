/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module kit.bindings {

	function openWithPostData(url: string, data_get: any, data_post: any, target: string) {
        app.postRedirect(url, data_post, target, data_get);
	}
	
	ko.bindingHandlers['post'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			var data = valueAccessor();
			
			if(data){
				$(element).off('click.kopost');
				$(element).on('click.kopost', function(){
					openWithPostData(ko.unwrap(data.url), ko.unwrap(data.params), ko.unwrap(data.data), ko.unwrap(data.target));
				});
			}
		},
		
	};
    
}