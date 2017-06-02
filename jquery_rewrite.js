(function(window, undefined){
var rootJQuery,

	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	//匹配未闭合标签$("<li>hello")或#id值
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,  //匹配独立标签<li><li> 或 <li />
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
			//match[1] 创建标签为真match = [null, '<li>', null]
			//!context 没有上下文 => id
			if ( match && (match[1] || !context) ) {

				//创建标签类型的选择器
				if ( match[1] ) {
					//context = document ||　$(documet)
					context = context instanceof jQuery ? context[0] : context; //最终得到原生document

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(//?#?
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
	}


}

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
			
				if(target === copy){ 
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
	isPlainObject: function(obj){ //判断是否为对象

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
		return obj != null && obj === obj.window;
	},
	//将字符串解析成节点数组
	parseHTML: function(data, context, keepScripts){
		//data为空或不是字符串，返回null
		if( !data || typeof data !== 'string'){
			return null;
		}

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
		//多标签<li></li><script></script>
		//如果不是单个标签就调用buildFragment方法，把html字符串传入，同时上下文也传入，第三个参数就是scripts!  
    	//如果paseHTML的第三个参数是false，那么这里的scripts就是一个数组，传递到buildFragment中会把所有的script标签放在里面  
    	//所以就要收到移除!
		parsed = jQuery.buildFragment( [data], context, scripts);//节点碎片,创建DOM

		if(scripts){
			jQuery(scripts).remove();
		}
		//buildFragment返回的是文档碎片，所以要变成数组，调用merge方法!  
		return jQuery.merge([], parsed.childNodes);
	},
	buildFragment: function(){

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
	}
});

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




















if(typeof window === 'object' && typeof window.document === 'object'){
	window.jQuery = window.$ = jQuery;
}

})(window);