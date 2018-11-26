import { AbstractBinding } from '@webkit/core/AbstractBinding.class';

let openWithPostData = function(url: string, data_get: any, data_post: any, target: string) {
    app.postRedirect(url, data_post, target, data_get);
}

export class PostBinding extends AbstractBinding {

    constructor() {
        super('post');    
    }

	init(element, valueAccessor, allBindings, viewModel, bindingContext) {}
    
	update(element, valueAccessor, allBindings, viewModel, bindingContext) {
		let data: any = valueAccessor();
		
		if(data) {
			$(element).off('click.kopost');
			$(element).on('click.kopost', function(){
				openWithPostData(ko.unwrap(data.url), ko.unwrap(data.params), ko.unwrap(data.data), ko.unwrap(data.target));
			});
		}
	}

}