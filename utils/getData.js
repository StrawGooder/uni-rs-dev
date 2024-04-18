import { request } from './api.js'; //导入封装好的js文件

//每一个请求的接口都返回一个函数，便于直接调用

//请求登录的接口
export const login = (data)=>{
	return request({
		url:'', //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'',//请求的方式，get,post等
		data:data //请求所带的参数
	})
}

//请求注册的接口
export const register = (data)=>{
    return axios.request({
        url:"", 
        method:'post', 
        data:data, 
    })
}

//获取所有矢量数据接口
export const getShpAll = (data)=>{
	console.log("获取所有矢量数据")
	return request({
		url:'/user/getUnInvestigationTask', //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'get',//请求的方式，get,post等
		data:'' //请求所带的参数
	})
}

//获取所有矢量数据接口
export const getShpOne = (data)=>{
	
	return request({
		url:'/userTask/getBuilding?tbbh='+data, //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'get',//请求的方式，get,post等
		data:'' //请求所带的参数
	})
}

//获取图斑对应的拍照位置和角度
export const get_shooting_point = (data)=>{
	
	return request({
		url:'/userTask/getTaskLines', //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'get',//请求的方式，get,post等
		data:data //请求所带的参数
	})
}


//获取所有影像地图信息
export const get_all_layerimage = (data)=>{
	return request({
		url:'/userTask/getLayerNames?tbbh='+data, //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'get',//请求的方式，get,post等
		data:'' //请求所带的参数
	})
}


//查询绘制数据接口
export const getDrawGeojsonDatas = (data)=>{
	return request({
		url:'/userTask/getTbInfor', //后端对应的接口,如果前端配置了跨域，这里直接写http://xx:xx后面的内容
		method:'post',//请求的方式，get,post等
		data: data//请求所带的参数
	})
}