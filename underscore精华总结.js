//好的方法
_.invoke


//处理集合的函数
function handleFall(obj, fn, context){
	if(obj == null) return [];

	var keys = obj.length !== +obj.length && Object.keys(obj), //数组为false,对象为true
		length = (keys || obj).length,
		index,
		currentKey;

	for(index=0;index < length;index++){
		currentKey = keys ? keys[index] : index;
		fn.call(context, obj[currentKey], currentKey, obj);
	}
}

//判断对象
function isObject(obj){
	var type = typeof obj;
	return type === 'function' || type === 'object' && !!obj;
}

function isHas(obj, key){
	                      //检测是不是自身属性，继承的属性会返回false
	return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

//返回object对象所有的属性
//暂不考虑IE9以下
function getObjKeys(obj){
	if(!isObject(obj)) return [];
	if(Object.keys) return Object.keys(obj);
	var keys = [];
	for(var key in obj){
		if(isHas(obj, key)){
			keys.push(key);
		}
	}
	return keys;
}

//返回object对象所有的属性值
function getObjValues(obj){
	var keys = getObjKeys(obj),
		length = keys.length,
		values = Array(length);

	for(var i=0;i < length;i++){
		values[i] = obj[keys[i]];
	}
	return values;
}






