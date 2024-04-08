// let baseUrl = 'http://113.12.72.253:1000'; //域名或选取所有接口不变的那一部分
let baseUrl = 'http://124.71.105.15:1000'; //域名或选取所有接口不变的那一部分

// let baseUrl = "https://d586v28098.goho.co"
export const request = (options = {}) => {
	//异步封装接口，使用Promise处理异步请求
	return new Promise((resolve, reject) => {
		// 发送请求
		uni.request({
			url: baseUrl + options.url || '', //接收请求的API
			method: options.method || 'GET', //接收请求的方式,如果不传默认为GET
			data:options.data || {}, //接收请求的data,不传默认为空
		}).then(data => {
			//options.data
			
			let [err, res] = data;
			
			resolve(res);
		}).catch(error => {
			console.log("error:",error)
			reject(error);
		})
	})
}
