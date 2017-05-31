(function(window, undefined){
var rootJQuery,

	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, //匹配复杂Html代码或#id值
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
	contructor: jQuery,

	init: function(selector, context, rootJQuery){
		var match, elem;

		//处理情况: $(""),$(null),$(undefined),$(false)
		if(!selector){
			return this;
		}

		//处理html字符串
		if(typeof selector === "string"){
			if(selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >=3 ){
				match = [null, selector, null];
			}else{
				match = rquickExpr.exec(selector);
			}

			if(match && (match[1] || !context)){
				if(match[1]){//创建标签类型的选择器
					context = context instanceof jQuery ? context[0] : context;


				}
			}
		}
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