(function(window){






var z = function(){

};
z.prototype = {
	constructor: z
}
z.getClass = function(className){
	var results = [],
		reg = new RegExp('(^|\\s)'+ className +'(\\s|$)'),
		elems = document.getElementsByTagName("*");
	for(var i=0,j=elems.length; i < j; i++){
		var elem = elems[i];
		if(reg.test(elem.className)){
			results.push(elem);
		}
	}
	return results;
}
z.getId = function(id){
	return document.getElementById(id);
}

















	window.z = z;
})(window);





















































































