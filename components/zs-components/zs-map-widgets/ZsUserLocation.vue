<template>
    
    <view>
  
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';


function onSuccess(){
	
}

function onFail(){
	
}

function onComplete(){
	
}

export default {
    
    name:"ZsUserLocation",

    props:{
		
		locType:{
			type:String,
			default:"wgs"
		},
		locAccuracy:{
			type:String,
			default:"higth"
		},
		locSuccess:{
			type:Function,
			default:onSuccess
		},
		locFail:{
			type:Function,
			default:onFail
		},
		locComplete:{
			type:Function,
			default:onComplete
		},
		locLazy:{
			type:Boolean,
			
		}
		
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){
		// this.$emit("changeGpsLocation")
		console.log("debug-zs location emit")
    },

    methods:{

		onLocationChanged(result){
			
			this.$emit("changeGpsLocation",  result)
		},
		
		onLocationChangedError(result){
			this.$emit("changeGpsLocationError",  result)
		},
		
		// startLocation_(){
		
		// 	try{
		// 		uni.startLocationUpdate({type:this.locType,accuracy:this.locAccuracy})
		// 		uni.onLocationChange(this.onLocationChanged)
		// 		uni.onLocationChangeError(this.onLocationChangedError)
		// 	}catch(e){
		// 		//TODO handle the exception
		// 		console.log("debug-zsUserLocation on gps location ")
		// 	}	
		// },
		
		// stopLocation_(){
		// 	try{
		// 		uni.stopLocationUpdate()
		// 		uni.offLocationChange(this.onLocationChanged)
		// 		uni.offLocationChangeError(this.onLocationChangedError)
		// 	}catch(e){
		// 		//TODO handle the exception
		// 		//TODO handle the exception
		// 		console.log("debug-zsUserLocation off gps location ")
		// 	}
			
		// },
		
		// use plus.geolocation (H5 plus api)
		startLocation_(){
			
			try{
				// plus.geolocation.clearWatch()
				this.urfgpsLocWatcher = plus.geolocation.watchPosition(
				//不停的获取和更新用户的地理位置信息，自定义执行间隔时间；当设备地理位置发生改变时，自动调用；
					(result)=>{this.onLocationChanged(result)},
					(err)=>{},
					{
						provider: 'system',
						//是否使用高精度设备，如GPS。默认是true  
						enableHighAccuracy: true,
						//超时时间，单位毫秒，默认为0  
						//使用设置时间内的缓存数据，单位毫秒  
						//默认为0，即始终请求新数据  
						//如设为Infinity，则始终使用缓存数据  
						maximumAge: 500,
					},
				// 	function(p) {
				// 		// p为获取成功的定位数据
				// 		// that.init_longtudes = result[0]
				// 		// that.init_latitude = result[1]
						
				// 		that.init_longtudes = p.coords.longitude
				// 		that.init_latitude = p.coords.latitude
				// 		try {
				// 			that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
				// 			// that.stylepoint.getText().setText(''+p.coords.longitude+"\n"+p.coords.latitude+'')
				// 			if(that.init_center){
				// 				that.set_center_point(that.init_longtudes, that.init_latitude)
				// 				that.init_center =false
				// 			}
							
				// 		} catch (e) {
				// 			that.setPoint();
				// 			//TODO handle the exception
				// 		}
				// 	 //    that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
				// 	 //    that.set_center_point(that.init_longtudes, that.init_latitude)
				// 		// that.stylepoint.getText().setText(''+p.coords.longitude+"\n"+p.coords.latitude+'')
				// 	},
				
				// 	function(err) {
				// 		//失败回调
				// 	},
					)	
			}catch(e){
				//TODO handle the exception
				console.log("debug-userlocation native.js use plus.geolocation ", e)
			}
		
		},
		
		stopLocation_(){
			try{
				plus.geolocation.clearWatch(this.urfgpsLocWatcher)
			}catch(e){
				//TODO handle the exception
			}
		}

    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){
		// uni.getLocation({
		// 	success:this.onSuccess,
		// 	fail:this.onFail,
		// 	complete:this.onComplete
		// })
		if(!this.locLazy){
			this.startLocation_()
		}
		
		
    },

    beforeDestroy(){

		this.stopLocation_()
    }

};

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
</style>