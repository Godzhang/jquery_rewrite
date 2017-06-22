(function(window, undefined){
var rootJQuery,
	readyList,
	core_strundefined = typeof undefined,

	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	_jQuery = window.jQuery,
	_$ = window.$,

	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,//匹配未闭合标签$("<li>hello")或#id值
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,  //匹配独立标签<li><li> 或 <li />
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	class2type = {},  //存放检测类型
	core_deletedIds = [],
	core_version = "2.0.3",


	//一些常用方法
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	jQuery = function(selector, context){
		return new jQuery.fn.init(selector, context, rootJQuery);
	},

	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, //?#?
	core_rnotwhite = /\S+/g,
	completed = function(){
		document.removeEventListener("DOMContentLoaded", completed, false);
		window.removeEventListener("load", completed, false);
		jQuery.ready();
	};

var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

jQuery.fn = jQuery.prototype = {
	jquery: core_version,

	contructor: jQuery,

	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		//$("#div") $(".box") $("div") $("#div div.box") $("<li>") $("<li>1</li><li>2</li>")
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];
				//match = [null, '<li>', null]
			} else {
				match = rquickExpr.exec( selector );
				//匹配id时 => match = ['#div', null, 'div']
				//匹配未闭合标签时 => match = ['<li>hello','<li>',null]
				//其他 => match = null
			}

			// Match html or make sure no context is specified for #id
			//创建标签或者获取id  match !== null  进入if
			//match[1] 创建标签为真,match = [null, '<li>', null]
			//!context 没有上下文 => id
			if ( match && (match[1] || !context) ) {

				//创建标签类型的选择器
				if ( match[1] ) {
					//context = document ||　$(documet)
					context = context instanceof jQuery ? context[0] : context; //最终得到原生document

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					//$("<li>",{title: 'hi',html: 'zhangqi'});
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				//创建id类型的选择器
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			//$("ul",$(document))
			//jQuery(document).find()
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			//$("ul",document)
			//同上，结果相同
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		//$(this) $(document)  原生对象转jQuery对象
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function) == $(document).ready(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {//这里是为什么$(function(){})==$(document).ready(function() {})
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {//对应$($('#div'))的情况
			this.selector = selector.selector;
			this.context = selector.context;
		}
		
		return jQuery.makeArray( selector, this );//类数组转化为数组的方法
	},

	selector: "",

	length: 0,

	toArray: function (){
		return core_slice.call(this);
	},

	get: function(num){
		return num == null ? this.toArray() : (num < 0 ? this[this.length + num] : this[num]);
	},
	//将一个DOM元素集合加入到jQuery栈。
	pushStack: function(elems){
		//构建一个新的jQuery匹配元素集
		var ret = jQuery.merge(this.contructor(), elems);
		//将当前操作对象添加到堆栈上
		ret.prevObject = this;
		ret.context = this.context;

		return ret;
	},
	end: function(){
		return this.prevObject || this.contructor(null);
	},
	each: function(callback, args){
		return jQuery.each.call(this, callback, args);
	},
	slice: function(){
		return this.pushStack( core_slice.apply(this, arguments) );
	},
	first: function(){
		return this.eq(0)
	},
	last: function(){
		return this.eq(-1);
	},
	eq: function(i){
		var len = this.length,
			j = +i + (i < 0 ? len : 0);

		return this.pushStack( j > 0 && j < len ? [this[j]] : []);
	},
	map: function(callback){
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call(elem, i, elem);
		}) );
	},
	ready: function(fn){  //?#?
		//延迟对象
		jQuery.ready.promise().done( fn );

		return this;
	},
	//数组方法,内部使用
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

jQuery.fn.init.prototype = jQuery.prototype;

jQuery.extend = jQuery.fn.extend = function(){
　　//target被扩展的对象
　　//length参数的数量
　　//deep是否深度操作
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
　　// deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
　　// 然后把第二个参数赋值给target
	if(typeof target === "boolean"){
		deep = target;
		target = arguments[1] || {};
		i = 2; // 将i赋值为2，跳过前两个参数
	}

	// target既不是对象也不是函数则把target设置为空对象。
	// 处理奇怪的情况，比如 jQuery.extend( 'hello' , {nick: 'casper})~~
	if(typeof target !== 'object' && !jQuery.isFunction(target)){
		target = {};
	}

	if(length === i){ //如果只有一个参数，就是为jquery本身扩展
		target = this;
		--i;
	}

	for(; i<length; i++){ 
		// 处理第i个被扩展的对象，即除去deep和target之外的对象
		if((options = arguments[i]) != null){
			// 遍历第i个对象的所有可遍历的属性
			for(name in options){
				// 根据被扩展对象的键获得目标对象相应值，并赋值给src
				src = target[name];
				// 得到被扩展对象的值
				copy = options[name];
			
				if(target === copy){ // 防止自引用 ?#?
					continue;
				}

				// 当用户想要深度操作时，递归合并
	　　　　　　// copy是纯对象或者是数组
				if(deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ){
					if(copyIsArray){
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];
					}else{
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					target[name] = jQuery.extend(deep, clone, copy); //递归调用，对象中有对象的情况

				}else if(copy !== undefined){
					target[name] = copy;
				}
			}
		}
	}

	return target;
};

jQuery.extend({
	//合并数组，json对象
	merge: function(first, second){
		var l = second.length,
			i = first.length,
			j = 0;

		if(typeof l === 'number'){
			for(;j<l;j++){
				first[i++] = second[j];
			}
		}else{
			while (second[j] !== undefined){
				first[i++] = second[j++];
			}
		}

		first.length = i;//这个地方是关键,手动改变长度

		return first;//返回的是一个新数组,也是第一个数组
	},
	isFunction: function(obj){
		return jQuery.type(obj) === "function";
	},
	isArray: Array.isArray,//原生方法

	type: function(obj){ //判断类型
		if(obj == null){ //判断null和undefined
			return String(obj);
		}
		return typeof obj === "object" || typeof obj === "function" ? class2type[ core_toString.call(obj) ] || "object" : typeof obj;
	},
	each: function(obj, callback, args){
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike(obj);//判断是否是数组,类数组和this,this是带下标的对象

		if(args){
			if(isArray){
				for( ; i<length;i++){
					value = callback.apply(obj[i],args);

					if(value === false){
						break;
					}
				}
			}else{
				for( i in obj){
					value = callback.apply(obj[i],args);

					if(value === false){
						break;
					}
				}
			}
		}else{
			if(isArray){
				// for( ; i<length;i++){
				// 	value = callback.call( obj[i], i, obj[i] );

				// 	if(value === false){
				// 		break;
				// 	}
				// }

				//forEach实现方法
				obj.forEach(function(val, eq){
					callback.call(val, eq, val);
				});
			}else{
				for( i in obj){
					value = callback.call(obj[i],i,obj[i]);

					if(value === false){
						break;
					}
				}
			}
		}
	},
	isWindow: function(obj){
		//obj.window  全局对象下的浏览器窗口
		return obj != null && obj === obj.window; 
	},
	isNumeric: function(obj){
		//typeof NaN => number
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	},
	//把类数组,json,数字,字符串转为数组
	makeArray: function(arr, results){
		var ret = results || [];

		if(arr != null){
			if(isArraylike( Object(arr) )){
				jQuery.merge(ret,
					typeof arr === 'string' ? [ arr ] : arr
				);
			}else{
				[].push.call(ret, arr);
			}
		}

		return ret;
	},
	//通过规则得到一个新数组
	map: function(elems, callback, arg){
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike(elems),
			ret = [];

		if(isArray){
			for( ; i<length;i++){
				value = callback( elems[i], i, arg );

				if(value != null){
					ret[ret.length] = value;
				}

			}
		}else{
			for(i in elems){
				value = callback( elems[i], i, arg );

				if(value != null){
					ret[ret.length] = value;
				}
			}
		}
		//避免复合数组[[],[],[]……]
		//apply的第二个参数是数组形式，所以可以把复合数组里的数组当作参数
		return core_concat.apply([], ret);
	},
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g , ""),
	noConflict: function(deep){
		if(window.$ === jQuery){
			window.$ = _$;
		}

		if(deep && window.jQuery === jQuery){
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	//DOM是否加载完毕
	isReady: false,
 	//等待多少文件的计数器
 	readyWait: 1,
 	//推迟dom触发,参数为布尔值
 	holdReady: function(hold){
 		if(hold){
 			jQuery.readyWait++;
 		}else{
 			jQuery.ready(true);
 		}
 	},
 	//准备DOM触发
 	ready: function(wait){
 		if(wait === true ? --jQuery.readyWait : jQuery.isReady){
 			return;
 		}
 		//让DOM准备完毕
 		isReady = true;

 		if(wait !== true && --jQuery.readyWait > 0){
 			return;
 		}

 		//立即触发延迟函数,reaolvewith()可以进行传参
 		readyList.resolveWith( document, [jQuery] );

 		//主动触发事件,用于$(document).on('ready', function () {})
 		if(jQuery.fn.trigger){
 			jQuery(document).trigger("ready").off("ready");
 		}
 	},
 	isPlainObject: function(obj){ //判断是否为素对象
 		//排除非Object类型，DOM对象 和 window对象
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}	
		//旧版本火狐浏览器有问题
		//判断这个对象的直接原型对象是否拥有isPortotypeOf方法，没有则被排除
		try {
			if (obj.constructor && 
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")){
				return false;
			}
		}catch(e){
			return false;
		}

		return true;
	},
	isEmptyObject: function( obj ){//是否为空对象,没有自身下的属性和方法,就返回true
		for(var name in obj){//for in 循环非系统自带的属性
			return false;
		}
		return true;
	},
	error: function( msg ){
		throw new Error( msg );
	},
	//将字符串解析成节点数组
	parseHTML: function(data, context, keepScripts){  
		//data为空或不是字符串，返回null
		if( !data || typeof data !== 'string'){
			return null;
		}
		//第二个参数为boolean的处理
		if(typeof context === "boolean"){
			keepScripts = context;
			context = false;
		}
		 
		context = context || document;

		var parsed = rsingleTag.exec(data),
			scripts = !keepScripts && [];

		//单标签
		if(parsed){
			//如果是单个标签就调用相应的createElement方法，默认上下文是document!
			return [ context.createElement( parsed[1] ) ];
		}
		//多标签<li></li><script></script>或其他字符串
		//如果不是单个标签就调用buildFragment方法，把html字符串传入，同时上下文也传入，第三个参数就是scripts!  
    	//如果paseHTML的第三个参数是false，那么这里的scripts就是一个数组，传递到buildFragment中会把所有的script标签放在里面  
    	//所以就要收到移除!
		parsed = jQuery.buildFragment( [data], context, scripts);//节点碎片,创建DOM

		if(scripts){//释放内存
			jQuery(scripts).remove();
		}
		//buildFragment返回的是文档碎片，所以要变成数组，调用merge方法!  
		return jQuery.merge([], parsed.childNodes);
	},
	buildFragment: function(elems, context, scripts, selection){   //?#? 还需继续研究
		var elem, tmp, tag, wrap, contains, j,
		i = 0,
		l = elems.length,
		fragment = context.createDocumentFragment(),
		nodes = [];

		for(; i<l; i++){
			elem = elems[i];
			
			//直接添加节点
			if(elem || elem === 0){
				//如果是object那么直接放入nodes对象里面,以后直接添加到documentFragment中!
				if(jQuery.type(elem) === "object"){
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
				//把非html的内容转化为文本节点，也就是不是html标签，html标签要么开头是<要么开头是"&",构建文本节点!  
				}else if( !rhtml.test(elem) ){ //rhtml正则没看懂 ?#?
					nodes.push(context.createTextNode(elem));
				//把HTML变成DOM节点
				}else{
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					//获取标签元素
					tag = ( rtagName.exec(elem) || ["",""])[1].toLowerCase();
					//
					wrap = wrapMap[tag] || wrapMap._default;
					//添加到tmp
					tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1><$2>") + wrap[2];

					//取得elem的父节点
					j = wrap[0];
					while(j--){
						tmp = tmp.lastChild;
					}

					jQuery.merge(nodes, tmp.childNodes);

					tmp = fragment.firstChild;
					//清空tmp
					tmp.textContent = "";

				}
			}
		}
		//清空fragment
		fragment.textContent = "";

		i = 0;
		while((elem = nodes[i++])){

			if(selection && jQuery.inArray(elem, selection) !== -1){
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			tmp = getAll(fragment.appendChild(elem), "script");

			if(contains){
				setGlobalEval(tmp);
			}

			if(scripts){
				j = 0;
				while((elem = tmp[j++])){
					if(rscriptType.test(elem.type || "")){
						scripts.push(elem);
					}
				}
			}
		}
		return fragment;
	},
	inArray: function(elem, arr, i){//i代表查找起始位置
		return arr == null ? -1 : core_indexOf.call(arr, elem, i);
	},
	parseJSON: JSON.parse,  //JSON字符串解析为对象

	noop: function(){},  //容错函数

	parseXML: function(data){  //该版本方法已放弃对IE的操作
		var xml,tmp;
		if( !data || typeof data !== "string"){
			return null;
		}
		//DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。要使用 DOMParser，
		//使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
		try{
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		}catch(e){
			xml = undefined;
		}
					//在 IE 以外的浏览器中，如果解析失败，方法 parseFromString() 不会抛出任何异常，只会返回一个包含了错误信息的文档对象
		if( !xml || xml.getElementsByTagName("parsererror").length){
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	},

	globalEval: function(code){
		var script,
			indirect = eval,  //把eval赋给一个变量，eval作为window下的属性赋给变量，window.eval()，所以成为全局执行
			code = jQuery.trim(code);

		if(code){
			if(code.indexOf("use strict") === 1){//严格模式下不支持eval()解析
				script = document.createElement("script");  
				script.text = code;
				document.head.appendChild(script).parentNode.removeChild(script);
			}else{
				indirect(code);
			}
		}
	},
	//驼峰命名转化
	camelCase: function(string){
		return string.replace( rmsPrefix, "ms-").replace( rdashAlpha, fcamelCase );
	},
	//是否为指定节点名,返回布尔值
	nodeName: function(elem, name){
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},
	trim: function(text){
		return text == null ? "" : core_trim.call(text);
	},
	grep: function(elems, callback, inv){
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
			inv = !!inv;

		for(; i<length; i++){
			retVal = !!callback(elems[i], i);
			if(inv !== retVal){
				ret.push( elems[i] );
			}
		}

		return ret;
	},
	//为jquery对象产生一个唯一的标识符
	guid: 1,
	//修改函数的this指向
	proxy: function(fn, context){
		var tmp, args, proxy;

		//var obj = {
		//	show: function(){
		//		console.log(this);
		//	}
		//}
		//$(document).click( $.proxy(obj,'show'));
		//obj.show指向obj
		if(typeof context === "string"){
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		if(!jQuery.isFunction( fn )){
			return undefined;
		}

		args = core_slice.call(arguments, 2);
		proxy = function(){
			return fn.apply(context || this, args.concat(core_slice.call(arguments)));
		};

		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},
	//多功能值的操作
	//元素集合，回调函数，key，value，chainable为true -> 设置，为假 -> 获取
	access: function(elems, fn, key, value, chainable, emptyGet, raw){
		var i = 0,
			length = elems.length,
			bulk = key == null;	//没有key值,bulk为true

		//.css({width: 100px,height: 100px}) 设置多个属性	
		if(jQuery.type(key) === 'object'){
			chainable = true;
			for(i in key){
				jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
			}
		}else if(value !== undefined){ //设置单个属性
			chainable = true;

			if(!jQuery.isFunction(value)){ //value不是函数
				raw = true
			}

			//没有key值的情况
			//针对value是函数的情况
			if(bulk){
				//如果value不是函数
				if(raw){
					fn.call(elems,value);
					fn = null;
				}else{ //如果value是函数
					bulk = fn;
					fn = function(elem, key, value){
						return bulk.call(jQuery(elem), value);
					}
				}
			}

			if(fn){
				for(; i < length; i++){
					fn( elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key) ) );
				}
			}
		}
		//如果是设置，返回对象    //如果设置，返回第一个值的属性值
		return chainable ? elems :  bulk ? fn.call(elems) :  length ? fn(elems[0], key) : emptyGet;
	},
	now: Date.now,
	//css交换方法
	//获取隐藏元素宽高属性时，把display:none转换成display:block;visibilty:hidden;position:absolutely,再转换回去
	swap: function(elem, options, callback, args){
		var ret, name, old = {};

		for(name in options){
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		for(name in options){
			elem.style[name] = old[name];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ){//检测dom异步操作
	if( !readyList ){  //只走一次
		readyList = jQuery.Deferred();
	}
	//"comlpete"状态 => 代表DOM已加载完毕
	if(document.readyState === "comlpete"){
		setTimeout( jQuery.ready );//加定时器原因:为了在IE下表现没有问题,IE可能会提前触发
	}else{
		//这里触发两个状态原因
        //两个事件触发先不确定
        //正常情况load在DOMContentLoad之后
        //但是有缓存的情况下,load在DOMContentLoad之前
        //最终的目的是触发最先触发的回调(为了最快触发事件)
        document.addEventListener("DOMContentLoaded", completed, false);

        window.addEventListener("load", completed, false);
	}
	return readyList.promise( obj );
}

var typeArray = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
jQuery.each(typeArray,function(i, name){
	class2type["[object " + name + "]"] = name.toLowerCase();
});

function isArraylike(obj){//判断数组,类数组,或者jq对象特殊json
	var length = obj.length,
		type = jQuery.type(obj);

	if(jQuery.isWindow(obj)){ //测试对象是否是window对象
		return false;
	}

	 //如果是dom元素，则为if(length)；若length为true；则返回true
	if(obj.nodeType === 1 && length){ //元素节点
		return true;
	}
													  //空arguments	  //[{}] => length = 1
	//如果obj的类型是"array",//obj不能是function类型  //length为0,    //length的属性是number为true //length大于0；//length-1在obj里面是否存在
	return type === 'array' || type !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj );
}

rootjQuery = jQuery(document);
//sizzle选择器，暂时不写
(function(window, undefined){
})(window);

































var optionsCache = {};  //?#?这个缓存对象好像没有存值啊
//把字符串转换为对象存储在缓存中
function createOptions(options){
	//多个变量指向同一对象(或数组)引用时，其中一个变量修改了被引用对象的内部结构，其他引用变量也会表现出来
	var object = optionsCache[options] = {};
	jQuery.each(options.match( core_rnotwhite) || [], function(_, flag){
		object[ flag ] = true;
	});
	return object;
}

//回调对象，对函数统一管理
jQuery.Callbacks = function(options){
	//如果需要，将字符串格式的选项转换为格式化的对象
	//现在缓存中查找
	options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : jQuery.extend({},options);

	var memory,  //最后触发的函数（非遗忘列表）
		fired,  //
		firing,  //
		firingStart,  //起始值
		firingLength,  //
		firingIndex,  //当前触发事件的索引值
		list = [],  //回调函数列表
		stack = !options.once && [],  //有once时，为false
		fire = function(data){
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true; //触发进行时
			for(; list && firingIndex < firingLength; firingIndex++){
				// 正在执行的回调返回值为false 且 options.stopOnFalse为true，则终止回调队列的执行
				if(list[firingIndex].apply(data[0],data[1]) === false && options.stopOnFalse){
					memory = false;
					break;
				}
			}
			firing = false; //触发结束
			if(list){
				// 处理正在执行的回调中执行fireWith的操作;
				if(stack){
					if(stack.length){
						fire(stack.shift());
					}
				//当有once时才会走下面
				//有once时，memory为真时，清空列表,再执行fire时，执行的是空数组
				}else if(memory){
					list = [];
				}else{
					self.disable();
				}
			}
		},
		//实际回调方法
		self = {
			//添加回调函数到list数组中
			add: function(){
				if(list){
					//先保存当前list的长度
					var start = list.length;
					(function add( args ){
						jQuery.each(args, function(_, arg){//可以一下传多个回调
							var type = jQuery.type( arg );
							if(type === "function"){
								if( !options.unique || !self.has(arg) ){
									list.push(arg);
								}
							}else if( arg && arg.length && type !== 'string' ){
								//如果是数组，递归调用
								add(arg);
							}
						});
					})(arguments);
					// 正在执行的回调执行了add操作，则更新firingLength
					if(firing){
						firingLength = list.length;
					}else if (memory){ //第一次为undefined，第二次才开始真正判断
						firingStart = start;
						fire( memory );//当callbacks()中有memory时,add()会自动触发fire
					}
				}
				return this;
			},
			//从列表中移除回调函数
			remove: function(){
				if(list){
					jQuery.each(arguments, function(_, arg){
						var index;
						while( (index = jQuery.inArray(arg, list, index) ) > -1){
							list.splice(index, 1);

							if(firing){
								if(index <= firingLength){
									firingLength--;
								}
								if(index <= firingIndex){
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			//检查给定的回调函数是否在列表中。
			//如果没有给出参数，列表中是否有值。
			has: function(fn){
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			empty: function(){//清空整个数组
				list = [];
				firingLength = 0;
				return this;
			},
			disable: function(){ //全部锁定
				list = stack = memory = undefined;
				return this;
			},
			disabled: function(){  
				return !list;
			},
			lock: function(){
				stack = undefined;
				if(!memory){ //如果没有memory，禁止所有后续执行，如果有memory，只禁止后续fire触发事件
					self.disable();
				}
				return this;
			},
			locked: function(){
				return !stack;
			},
			fireWith: function(context, args){
				//第一次执行时，fired为undefined,所以能执行
				//第二次执行时，fired为true,要判断stack，若有once，stack为false，不执行
				if(list && (!fired || stack)){
					args = args || [];
					args = [ context, args.slice ? args.slice() : args];
					if(firing){ //如果在触发进行中
						stack.push(args); //就把事件放入堆里
					}else{
						firs(args);
					}
				}
			},
			fire: function(){
				self.fireWith(this, arguments);
				return this;
			},
			fired: function(){
				return !!fired;
			}
		};
	return self;
}

// jQuery.extend({  //?#? 异步到底是什么鬼
// 	Deferred: function( func ){
// 		//一个映射数组
// 		var tuples = [
// 				// action, add listener, listener list, final state
//                 //resolve,reject,notify用于相应状态的触发(fire),done,fail,progress用于添加相应的回调(add)
// 				//行为    //回调函数  //回调对象                     //状态
// 				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
// 				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
// 				[ "notify", "progress", jQuery.Callbacks("memory") ]
// 			],




// 	},
// 	when: function(subordinate /* , ...,subordinateN */){

// 	}
// });

jQuery.support = (function(support){
	var input = document.createElement("input"),
		fragment = doucment.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild(document.createElement("option"));

	if( !input.type ){
		return support;
	}

	input.type = "checkbox";

	support.checkOn = input.value !== "";//只有老版webkit为false

	support.optSelected = opt.selected;

	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	input.checked = true;
	support.noCloneChecked = input.cloneNode(true).checked;

	select.disable = true;
	support.optDisabled = !opt.disabled;

	input = document.createElement("input");
	//顺序不能变
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "t");
	input.setAttribute("name", "t");

	fragment.appendChild(input);

	support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	//onfocusin可以冒泡，focus等事件不能冒泡,只有IE支持
	support.focusinBubbles = "onfocusin" in window;
	//只在IE下为flase
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {//node中没有这个属性
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})({});

var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data(){
	Object.defineProperty( this.cache = {}, 0, { 
		get: function(){
			return {};
		}
	});//等于this.cache = {0: {}}没有set方法，不能设置，只能获取

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ){
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	//元素节点和document节点和其他任何（对象）
	return owner.nodeType ? owner.nodeType === 1 || owner.nodeType === 9 : true;
}

Data.prototype = {
	//分配映射
	key: function(owner){
		//不能被分配标识的就返回0
		if( !Data.accepts(owner)){
			return 0;
		}

		var descriptor = {},
			unlock = owner[ this.expando ];
		//如果对同一个元素多次操作，只走第一次
		if( !unlock ){
			unlock = Data.uid++;// 1

			try {
				//这个方法防止属性被修改，以防万一
				descriptor[this.expando] = {value: unlock};
				Object.defineProperties(owner, descriptor);
			}catch(e){
				descriptor[this.expando] = unlock;
				jQuery.extend(owner, descriptor);
			}
		}
		//如果对同一个元素多次操作，只走第一次,第一次时分配空间
		if( !this.cache[unlock]){
			this.cache[unlock] = {};
		}

		return unlock;		
	},
	set: function(owner, data, value){
		var prop,
			unlock = this.key(owner),
			cache = this.cache[ unlock ];

		if(typeof data === "string"){
			cache[ data ] = value;
		}else{
			if(jQuery.isEmptyObject(cache)){
				jQuery.extend{this.cache[unlock], data};
			}else{
				for(prop in data){
					cache[ prop ] = data[ prop ];
				}
			}
		}

		return cache;
	},
	get: function(owner, key){
		var cache = this.cache[ this.key(owner) ];

		return key === undefined ? cache : cache[key];
	},
	//整合set和get方法
	access: function(owner, key, value){
		var stored;

		if(key === undefined || ( (key && typeof key === "string") && value === undefined ) ){
			stored = this.get(owner, key);

			return stored !== undefined ? stored : this.get( owner, jQuery.camelCase(key) );
		}

		this.set(owner, key, value);

		return value !== undefined ? value : key;
	},
	remove: function(owner, key){
		var i, name, camel,
			unlock = this.key(owner),
			cache = this.cache[ unlock ];

		if(key === undefined){
			this.cache[unlock] = {};
		}else{

			if(jQuery.isArray(key)){

				name = key.concat(key.map(jQuery.camelCase));

			}else{
				camel = jQuery.camelCase(key);

				if(key in cache){
					name = [key, camel];
				}else{
					name = camel;
					name = name in cache ? [name] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while(i--){
				delete cache[ name[i] ];
			}
		}		
	},
	hasData: function(owner){
		return !jQuery.isEmptyObject( this.cache[ owner[this.expando] ] );
	},
	discard: function(owner){
		if( owner[this.expando] ){
			delete this.cache[ owner[this.expando] ];
		}
	}
}

data_user = new Data(); 
data_priv = new Data();

jQuery.extend({
	acceptData: Data.accepts,

	hasData: function(elem){
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},
	data: function(elem, name, data){
		return data_user.access(elem, name, data);
	},
	removeData: function(elem, data){
		data_user.remove(elem, data);
	},
	_data: function(elem, name, data){
		return data_priv.access(elem, name, data);
	},
	_removeData: function(elem, name){
		data_priv.remove(elem, name);
	}
});

jQuery.fn.extend({
	data: function(key, value){
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;
		//获取所有值
		if(key === undefined){
			if(this.length){
				data = data_user.get(elem);

				if(elem.nodeType === 1 && !data_priv.get(elem, "hasDataAttrs")){
					attrs = elem.attributes;
					//循环，查看有没有data-自定义属性
					for(; i < attrs.length; i++){
						name = attrs[i].name;

						if(name.indexOf( "data-" ) == 0){
							name = jQuery.camelCase(name.slice(5));
							dataAttr( elem, name, data[name]);
						}
					}
					data_priv.set(elem, "hasDataAttrs", true);
				}
			}

			return data;
		}		

		if(typeof key === "object"){
			return this.each(function(){
				data_user.set(this, key);
			});
		}

		return jQuery.access(this, function( value ){
			var data, camelKey = jQuery.camelCase( key );

			if(elem && value === undefined){
				data = data_user.get(elem, key);
				if(data !=== undefined){
					return data;
				}

				data = data_user.get(elem, camelKey);
				if(data !== undefined){
					return data;
				}

				data = dataAttr(elem, camelKey, undefined);
				if(data !== undefined){
					return data;
				}

				return;
			}

			this.each(function(){
				var data = data_user.get(this, camelKey);

				data_user.set(this, camelKey, value);

				if(key.indexOf("-") !== -1 && data !== undefined){
					data_user.set(this, key, value);
				}
			});
		},null, value, arguments.length > 1, null, true);
	},
	removeData: function(key){
		return this.each(function(){
			data_user.remove(this, key);
		})
	}
})

function dataAttr(elem, key, data){
	var name;

	if(data === undefined && elem.nodeType === 1){
		name = "data-" + key.replace( rmultiDash, "-$1").toLowerCase();
		data = elem.getAttribute(name);

		if(typeof data === "string"){
			try {
				data = data === "true" ? true : 
					data === "false" ? false : 
					data === "null" ? null :
					+data + "" === data ? +data : 
					rbrace.test(data) ? JSON.parse(data) : data;
			}catch(e){}

			data_user.set(elem, key, data);
		}else{
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({  //?#?
	queue: function(elem, type, data){
		var queue;

		if(elem){
			type = ( type || "fx" ) +  "queue";
			//jQuery的队列是以Data为基础的。它是以缓存的形式添加在DOM元素或者Object上的。
			//第一次进来queue为undefined
			queue = data_priv.get(elem, type);

			if(data){
				//如果队列不存在，或者data为数组时
				if(!queue || jQuery.isArray(data)){
					queue = data_priv.access(elem, type, jQuery.makeArray(data));
				}else{
					queue.push(data);
				}
			}
			return queue || [];
		}
	},
	dequeue: function(elem, type){
		type = type || "fx";

		var queue = jQuery.queue(elem, type),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks(elem, type),
			next = function(){
				jQuery.dequeue(elem, type);
			};

		if(fn === "inprogress"){
			fn = queue.shift();
			startLength--;
		}

		if(fn){
			//与第一次animate自动执行有关
			if(type === "fx"){
				queue.unshift("inprogress");
			}

			delete hooks.stop;
			fn.call(elem, next, hooks);
		}

		if(!startLength && hooks){
			hooks.empty.fire();
		}
	},
	_queueHooks: function(elem, type){
		var key = type + "queueHooks";
		 //如果data_priv中已经为elem存储了标识为key缓存，则返回它。或者为elem的标识key，设置缓存。
		return data_priv.get(elem, key) || data_priv.access(elem, key, {
			//该缓存为一个对象字面量，里面属性empty为Callbacks对象,该延迟对象有被添加了一个方法，
            // 用来删除elem的type缓存，和key缓存
			empty: jQuery.Callbacks("once memory").add(function(){
				data_priv.remove(elem, [type + "queue", key]);
			});
		})
	}
});

jQuery.fn.extend({
	queue: function(type, data){
		var setter = 2;

		if(typeof type !== "string"){
			data = type;
			type = "fx";
			setter--;
		}		

		if(arguments.length < setter){
			return jQuery.queue(this[0], type);
		}

		return data === undefined ? 
			this : 
			this.each(function(){
				var queue = jQuery.queue(this, type, data);

				jQuery._queueHooks(this, type);

				if(type === "fx" && queue[0] != "inprogress"){
					jQuery.dequeue(this, type);
				}
			});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue(this, type);
		})
	},
	dalay: function(time, type){

	},
	clearQueue: function(type){

	},
	promise: function(type, obj){

	}
});

var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function(name, value){
		return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
	},
	removeAttr: function(name){
		return this.each(function(){
			jQuery.removeAttr(this, name);
		});
	},
	prop: function(name, value){//?#?  实现原理
		return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
	},
	removeProp: function(name){//?#?  实现原理
		return this.each(function(){
			delete this[jQuery.propFix[name] || name];
		})
	},
	addClass: function(value){
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === 'string' && value;

		//处理函数
		if(jQuery.isFunction(value)){
			return this.each(function(j){
				jQuery(this).addClass(value.call(this, j, this.className));
			});
		}

		//处理字符串
		if(proceed){
			classes = ( value || "").match( core_rnotwhite ) || [];

			for(; i < len; i++){
				elem = this[i];
				cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");

				if(cur){
					j = 0;
					while( (clazz = classes[j++]) ){
						if(cur.indexOf(" " + clazz + " ") < 0){
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim(cur);
				}
			}
		}
		return this;
	},
	removeClass: function(value){
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if(jQuery.isFunction(value)){
			return this.each(function(j){
				jQuery(this).removeClass(value.call(this, j, this.className));
			});
		}

		if(proceed){
			classes = (value || "").match(core_rnotwhite) || [];

			for(; i < len; i++){
				elem = this[i];

				cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");

				if(cur){
					j = 0;
					while( (clazz = classes[j++]) ){
						while( cur.indexOf(" " + clazz + " ") >= 0 ){
							cur = cur.replace(" " + clazz + " ", " ");
						}
					}
					elem.className = value ? jQuery.trim(cur) : "";
				}
			}
		}

		return this;
	},
	toggleClass: function(value, stateVal){
		var type = typeof value;

		if(typeof stateVal === "boolean" && type === "string"){
			return stateVal ? this.addClass(value) : this.removeClass(value);
		}

		if(jQuery.isFunction(value)){
			return this.each(function(i){
				jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
			});
		}

		return this.each(function(){
			if(type === "string"){
				var className,
					i = 0,
					self = jQuery(this),
					classNames = value.match(core_rnotwhite) || [];

				while( (className = classNames[i++]) ){
					if(self.hasClass(className)){
						self.removeClass(className);
					}else{
						self.addClass(className);
					}
				}
			//如果不写参数，切换所有类
			}else if(type === core_strundefined || type === "boolean"){
				if(this.className){
					data_priv.set(this, "__className__", this.className); //?#?
				}

				this.className = this.className || value === false ? "" : data_priv.get(this, "__className__") || "";
			}
		});
	},
	hasClass: function(selector){
		var className = " " + selector + " ",
			i = 0,
			l = this.length;

		for(; i < l; i++){
			if(this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ){
				return true;
			}
		}
		return false;
	},
	val: function(value){
		var hooks, ret, isFunction, elem = this[0];

		if(!arguments.length){ //获取value值
			if(elem){
				//elem.type: radio checkbox textarea select-one
				hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

				if(hooks && 'get' in hooks && (ret = hooks.get(elem, "value")) !== undefined){
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ? 
					ret.replace(rreturn, "") :
					ret == null ? "" : ret;
			}
			return;
		}

		//设置值
		isFunction = jQuery.isFunction(value);

		return this.each(function(i){
			var val;

			if(this.nodeType !== 1){
				return;
			}

			if(isFunction){
				val = value.call( this, i, jQuery(this).val() );
			}else{
				val = value;
			}

			if(val == null){
				val = "";
			}else if(typeof val === 'number'){
				val += "";  //转换成字符串
			}else if(jQuery.isArray(val)){
				val = jQuery.map(val, function(value){
					return val == null ? "" : value + "";
				});
			};

			hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
			//如果set返回未定义，则正常设置。
			if(!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined){
				this.value = val;
			}
		});
	}
});


jQuery.extend({
	valHooks: {
		option: {
			get: function(elem){
				var val = elem.attributes.value; //获取属性集合中的value值
				//如果已规定某个属性,specified 属性返回 true。
				//如果已创建该属性但尚未添加到元素中，也会返回 true。
				//否则返回 false。
				return !val || val.specified ? elem.value : elem.text; //option分为value和text两个值
			}
		},
		select: {
			get: function(elem){
				var value, option,
					options = elem.options, //option集合
					index = elem.selectedIndex,
					//单选：select-one 多选：select-multiple
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max : 
						one ? index : 0;

					for( ; i < max; i++){
						option = options[i];

						if( (option.selected || i === index) &&
							(jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							(!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))){

							value = jQuery(option).val();

							if(one){
								return value;
							}

							values.push(value);
						}
					}
				return values;
			},
			set: function(elem, value){
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while(i--){
					option = options[i];
					if( (option.selected = jQuery.inArray(jQuery(option).val(),values) >= 0) ){
						optionSet = true;
					}
				}

				if(!optionSet){
					elem.selectedIndex = -1;
				}

				return values;
			}
		}
	},
	attr: function(elem, name, value){
		var hooks, ret,
			nType = elem.nodeType;

		//不能设置 文本、注释、属性 节点
		if( !elem || nType === 3 || nType === 8 || nType === 2){
			return;
		}

		if( typeof elem.getAttribute === core_strundefined ){
			return jQuery.prop(elem, name, value);
		}

		if(nType !== 1 || !jQuery.isXMLDoc(elem)){
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || 
				(jQuery.exper.match.bool.test(name) ? boolHook : nodeHook);
		}

		if(value !== undefined){
			if(value == null){
				jQuery.removeAttr(elem, name);
			
			}else if(hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ){
				return ret;
			
			}else{
				elem.setAttribute(name, value + '');
				return value;
			}
		}else if(hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null){
			return ret;

		}else{
			ret = jQuery.find.attr(elem, name);

			return ret == null ? undefined : ret;
		}
	},
	removeAttr: function(elem, value){
		var name, propName,
			i = 0,
			attrNames = value && value.match(core_rnotwhite);

		if(attrNames && elem.nodeType === 1){

			while( (name = attrNames[i++]) ){
				propName = jQuery.propFix[ name ] || name;

				if(jQuery.expr.match.bool.test(name)){
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}	
	},
	attrHooks: {//把input设置为type="radio"
		type: {
			set: function(elem, value){
				if(!jQuery.support.radioValue && value === 'radio' && jQuery.nodeName(elem, 'input')){
					//IE9-浏览器中，将input标签更改类型（type）为radio类型以后，value属性可能出现异常
					//IE6-9设置完type后恢复value属性（attr）
					var val = elem.value;
					elem.setAttribute('type', value);
					if(val){
						elem.value = val;
					}
					return value;
				}
			}
		}
	},
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},
	prop: function(elem, name, value){
		var ret, hooks, notxml,
			nType = elem.nodeType;

		if( !elem || nType === 3 || nType === 8 || nType === 2){
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

		if(notxml){
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if(value !== undefined){
			return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
				ret : 
				(elem[name] = value);
		}else{
			return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ?
				ret : 
				elem[name];
		}
	},
	propHooks: {
		tabIndex: {//一个焦点顺序的属性
			get: function(elem){
				return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) || elem.href ?
					elem.tabIndex : -1;
			}
		}
	}
});

boolHook = {
	set: function(elem, value, name){
		if(value === false){
			jQuery.removeAttr(elem, name);
		}else{
			jQuery.setAttribute(name, name);
		}
		return name;
	}
};

// Support: IE9+
//selectedIndex 属性可设置或返回下拉列表中被选选项的索引号
//经测试，只在IE下起作用
if( !jQuery.support.optSelected ){
	jQuery.propHooks.selected = {
		get: function(elem){
			var parent = elem.parentNode;
			if(parent && parent.parentNode){
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	}
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
],function(){
	jQuery.propFix[this.toLowerCase()] = this;
})

jQuery.each(['radio','checkbox'],function(){
	jQuery.valHooks[this] = {
		set: function(elem, value){
			if(jQuery.isArray(value)){
				return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
			}
		}
	};
	if(!jQuery.support.checkOn){
		jQuery.valHooks[this].get = function(elem){
			// Support: Webkit
			return elem.getAttribute("value") === null ? "on" : elem.value;
		}
	}
});

var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue(){
	return true;
}

function returnFalse(){
	return false;
}

function safeActiveElement(){
	try{
		return document.activeElement;
	}catch(err){}
}

jQuery.event = {
	global: {},

	add: function(elem, types, handler, data, selector){
		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespace, origType,
			elemData = data_priv.get(elem);

		if(!elemData){
			return;
		}

		if(handler.handler){
			handleObjIn = handler;
			
		}





	}
}

jQuery.removeEvent = function(elem, type, handle){
	if(elem.removeEventListener){
		elem.removeEventListener(type, handle, false);
	}
}

jQuery.Event = function(src, props){

}




jQuery.fn.extend({
	on: function(types, selector, data, fn, one){

	},
	one: function(types, selector, data, fn){

	},
	off: function(types, selector, fn){

	},
	trigger: function(type, data){

	},
	triggerHandler : function(type, data){

	}
});







// function setGlobalEval( elems, refElements ) {
// 	var l = elems.length,
// 		i = 0;

// 	for ( ; i < l; i++ ) {
// 		data_priv.set(
// 			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
// 		);
// 	}
// }

// function getAll( context, tag ) {
// 	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
// 			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
// 			[];

// 	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
// 		jQuery.merge( [ context ], ret ) :
// 		ret;
// }

var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({ //?#?
	find: function(selector){

	},
	has: function(target){
		var targets = jQuery(target, this),
			l = targets.length;

		return this.filter(function(){
			var i = 0;
			for(; i < l;i++){
				if(jQuery.contains(this, targets[i])){
					return true;
				}
			}			
		});
	},
	not: function(selector){
		return this.pushStack( winnow(this, selector || [], true) );
	},
	filter: function(selector){
		return this.pushStack( winnow(this, selector || [], false) );
	},
	is: function(selector){
		return !!winnow(this,
			typeof selector === 'string' && rneedsContext.test(selector) ? 
				jQuery(selector) : selector || [],
			false
		).length;
	},
	closest: function(selectors, context){

	},
	index: function(elem){

	},
	add: function(selector, context){

	},
	addBack: function(selector){

	}
});























//过滤器函数
function winnow( elements, qualifier, not){
	//如果qualifer是函数，则判断函数对每一项的执行结果与not的比较
	if(jQuery.isFunction(qualifier)){
		return jQuery.grep( elements, function(elem, i){
			return !!qualifier.call(elem, i, elem) !== not;
		});
	}	

	if(qualifier.nodeType){
		return jQuery.grep(elements, function(elem){
			return (elem === qualifier) !== not;
		});
	}

	if(typeof qualifier === 'string'){
		if(isSimple.test(qualifier)){//匹配.box div  #div :odd ul li等,不匹配div:odd ul #li ui[title='hello']
			return jQuery.filter( qualifier, elements, not);
		}

		qualifier = jQuery.filter(qualifier, elements);
	}

	return jQuery.grep(elements, function(elem){
		return ( core_indexOf.call(qualifier, elem) >= 0 ) !== not;
	});
}

var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
//判断css属性是否存在style中
function vendorPropName( style, name){
	if(name in style){
		return name;
	}

	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while( i-- ){
		name = cssPrefixes[i] + capName;
		if(name in style){
			return name;
		}
	}

	return origName;
}

function isHidden(elem, el){ 
	elem = el || elem;

	return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
}
//获取当前元素所有最终使用的CSS属性值
function getStyles(elem){
	return window.getComputedStyle(elem, null);
}

function showHide(elements, show){ // ?#?
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for( ; index < length; index++){
		elem = elements[ index ];
		if( !elem.style ){
			continue;
		}



	}











}

jQuery.fn.extend({
	css: function(name, value){
		return jQuery.access(this, function(elem, name, value){

		}, name, value, arguments.length > 1);
	},
	show: function(){
		return 
	},
	hide: function(){

	},
	toggle: function(state){

	}
});

jQuery.fn.extend({
	wrapAll: function(html){
		var wrap;

		if(jQuery.isFunction(html)){
			return this.each(function(i){
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if(this[0]){

			wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

			if(this[0].parentNode){
				wrap.insertBefore( this[0] );
			}

			wrap.map(function(){
				var elem = this;

				while(elem.firstElementChild){
					elem = elem.firstElementChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},
	wrapInner: function(html){
		if(jQuery.isFunction(html)){
			return this.each(function(i){
				jQuery(this).wrapInner(html.call(this, i));
			});
		}

		return this.each(function(){
			var self = jQuery(this),
				contents = self.contents();

			if(self.length){
				contents.wrapAll( html );
			}else{
				self.append( html );
			}
		});
	},
	wrap: function(html){
		var isFunction = jQuery.isFunction(html);

		return this.each(function(i){
			jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
		});
	},
	unwrap: function(){
		return this.parent().each(function(){
			if( !jQuery.nodeName( this, "body" )){
				jQuery(this).replaceWith(this.childNodes);
			}
		}).end();
	}
});


































if(typeof window === 'object' && typeof window.document === 'object'){
	window.jQuery = window.$ = jQuery;
}

})(window);