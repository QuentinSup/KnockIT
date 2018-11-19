var stca = (function() {
	
	var scoobidoo = function(PE_sString, i) {
	    return PE_sString.replaceAll((app.context.id || "").charAt(i), 'o');
	};
	
	return function() {
		this.scoobidoo = scoobidoo;
	};
	
})();