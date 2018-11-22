interface JQuery {
	ajaxForm: Function
	crypt: Function    
    tooltipster: Function
    appear: Function
    nanoScroller: Function
    selectpicker:Function
}

interface JQueryStatic {
    address: any
    url: Function
    cookie: Function
    cookieBar: Function
}

interface KnockoutStatic {
    linkObservableToUrl: any
}

interface IDisposable {
    dispose(): void
}


declare function isNaN(o: any): boolean