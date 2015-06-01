/**
 * @fileOverview This file defines the post custom binding
 *      It requires jQuery and KnockOut libraries.
 */
module fr.fwk.knockit.bindings {

	function openWithPostData(url: string, data_get: any, data_post: any){
		var idForm_: string = "kopostform";
		var urlDataPrefix_ : string = "";
        
        if(!url) return;
        
		if (url.indexOf("?") == -1 ) {
			urlDataPrefix_ = "?";
		}
        
        $.each(data_get || {}, function(k: string, v: string) {
            url += urlDataPrefix_ + encodeURIComponent(k) + "=" + encodeURIComponent(v);
            urlDataPrefix_ = "&";
        });
        
        var sDataForm_ = "";
        
        $.each(data_post || {}, function(k: string, v: string) {
            sDataForm_ += "<input type='hidden' name='"+k+"' value='"+v+"'>";
        });
	   
	    var $form: JQuery = $("#"+idForm_);
	    
	    if($form.length > 0){
	    	$form.attr("action", url);
	    	$form.html(sDataForm_);
	    } else {
	    	$("body").append("<form id='"+idForm_+"' action='"+url+"' method='POST' target='_blank'>"+sDataForm_+"</form>");
	    }
	    
	    $("#"+idForm_).submit();
        
	}
	
	ko.bindingHandlers['post'] = {
		init : function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
		update : function(element, valueAccessor, allBindings, viewModel, bindingContext) {
			var data = valueAccessor();
			
			if(data){
				$(element).off('click.kopost');
				$(element).on('click.kopost', function(){
					openWithPostData(ko.unwrap(data.url), ko.unwrap(data.params), ko.unwrap(data.data));
				});
			}
		},
		
	};
    
}