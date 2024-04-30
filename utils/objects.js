

function isNullOrUndefined(obj){
	
	return obj==null || obj==undefined
}

function objectArrayToKeyObject(array, key, sorted_key, reversed){

    if(!Array.isArray(obj) && !key)
	{
        return obj
    }

    reversed = reversed || false

    var ret_obj = {}
    // var arr;
    var obj;
    var attr_val;

    for(var i in array)
	{

        obj = array[i]
        attr_val = obj[key]

        ret_obj[attr_val] = obj
        // if(isString(val)){
        //     if(!ret_obj[val]){
        //         ret_obj[val] = []
        //     }
        //     ret_obj[val].push(obj)
        // }
        // else if(isNumber(val))
        // {

        //     var msg =("objectArrayToKeyObjectArray wasn't used to convert number to key now")
        //     throw new Error(msg)
        // }
    }
    return ret_obj
}


export {
	isNullOrUndefined,
	objectArrayToKeyObject
}