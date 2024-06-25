<template>
	<view>
		<!-- <olMap  @func="chang_transition_top($event)"></olMap> -->
		<!-- 地图模块向空间分析传值 -->

<!-- 		<olmapoperation 
		:messageOlmap="messageolmap" 
		@olmapSend="messageAnaly($event)" 
		:tbbh="tbbh"
		@featureGeoJsonSend="getfeatureGeoJson($event)" 
		@compassangelSend="getcompassangel($event)"
		@jwdSend="getjwd($event)" 
		@get_graphphone_status="get_graphphone_status($event)"
		>
		</olmapoperation> -->
		
		<!-- :afterInit="importMapLayers"
		:ref="rfmapVmName" -->
		<OlMap
		hideMapImg
		usedMode = "view"
		drawTheme="base"
		:afterInit="importMapLayers"
		ref = "map"
		
		@changeGpsLocation="onLocationChanged"
		@changeCompass="onCompassChanged"
		>
			
		</OlMap>	

		<ZsFloatBall>
			<MapViewBasicCtrlPanel></MapViewBasicCtrlPanel>
			
		</ZsFloatBall>
		
		<ZsBottomPullup>
			
			<!-- <view>
				<custom-tabs type="c1" :value="value" >
					<one></one>
					<two :id="tbbh"></two>
					<three :id="tbbh"></three>
					<chooseimage :imageList="imagelist" :get_map_data="get_map_data"
						:set_graphphone_status="set_graphphone_status" :tbbh="tbbh"
						:investigationStatus="investigationStatus">
					</chooseimage>
					
					<analy :messageAnaly="messageanaly" @analySend="messageOlmap($event)"></analy>
				</custom-tabs>
				<button  class="submit_button" type="primary"
					@click="postMins()">
					<uni-icons class="submit_button_icon" type="cloud-upload-filled" size="28" color="white">
					</uni-icons>
					<span class="submit_button_text">点击提交</span>
				</button>
				
			</view> -->
			<!-- 分析模块向地图模块传值 -->
			<SpotSurveyBusinessOpPanel>
				
			</SpotSurveyBusinessOpPanel>
			
		</ZsBottomPullup>
		
		
	</view>
</template>
<script setup>
	// // #ifdef VUE3
	// import {
	// 	reactive,
	// 	ref,
	// 	watch
	// } from 'vue';
	// const value = ref(2);


	// // #endif
</script>
<script>
	// import olmapoperation from "./@/components/olmap/olmap_operation.vue";
	import setting from '@/setting.js';
	// import one from "./@/components/custom-tab-check/custom-tab-check-one.vue";
	// import two from "./@/components/custom-tab-check/custom-tab-check-two.vue";
	// import three from "./@/components/custom-tab-check/custom-tab-check-three.vue";
	// import analy from "./@/components/custom-tab-check/custom-tab-check-analy.vue";
	// import chooseimage from "./@/components/custom-tab-check/custom-tab-check-chooseimage.vue";
	// import coordtransform from 'coordtransform';
	
	import OlMap from "@/components/olmap/ZsOlMap.vue";
	import ZsFloatBall from "@/components/zs-components/zs-floatball/ZsFloatBall.vue";
	import MapViewBasicCtrlPanel from "@/pages/mapViewPage/MapViewBasicCtrlPanel.vue";
	import ZsBottomPullup from "@/components/zs-components/zs-bottom-pullup/ZsBottomPullup.vue";
	
	import SpotSurveyBusinessOpPanel from "./SpotSurveyBusinessOpPanel.vue";
	
	import { importLayer } from "@/components/olmap/layers";
	
	export default {
		components: {
			// olmapoperation,
			// one,
			// two,
			// three,
			// analy,
			// chooseimage,
			OlMap,
			ZsFloatBall,
			MapViewBasicCtrlPanel,
			ZsBottomPullup,
			SpotSurveyBusinessOpPanel
		},
		data() {
			return {
				show: true,
				windowHeight: 0,
				start: 0,
				end: 0,
				value: 3,
				top_value: null,
				isActive: true,
				hasError: false,
				olmapmessages: null,
				analymessages: null,
				messagedaughter: '',
				messageson: '',
				messageolmap: '',
				set_graphphone_status: {
					distance_status: {
						status: false,
						value: null
					},
					angle_status: {
						status: false,
						value: null
					}
				},
				// set_graphphone_status:null,//能否拍照的权限，用来传给custom-tab-check-chooseimage
				messageanaly: [], //空间分析信息，用于提交
				spotNumber: 0, //图斑编号，用于提交（已作废，由tbbh替代）
				tbbh: 0, //图片编号，用于提交
				user_id: 0, //用户id，用于提交
				imagelist: [], //待上传图片的路径,用于提交
				imageTime: null, //时间
				longitude: null, //经度
				latitude: null, //纬度
				gyroscope: [], //陀螺仪数据
				featureGeoJsonData: [], //存放所有绘制的点线面数据
				get_map_data: [], //获取地图相关数据
				get_compassangel: null, //获取偏角坐标
				// get_location:null,
				get_location: {
					longitudes: "108",
					latitude: "22"
				}, //获取经纬度信息
				image_error: null, //错误图片的集合
				investigationStatus: null, //调查状态
				// a:1,
			};
		},
		onLoad(options) {
			this.tbbh = options.tbbh;
			this.investigationStatus = options.investigationStatus
			this.user_id = options.user_id;
			// this.id = options.id
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			
			
			this.urfGpsLocCoordsHistory = []
		},
		methods: {

			//修改transition的top值,获取空间分析的值
			messageAnaly(message) {
				//控制下拉框是否自动弹出
				// this.isActive = false
				// this.hasError = true
				if (message != 1) {
					this.messageanaly = message
					
				}
			},
			//根据角度、位置获取能否拍照的权限
			get_graphphone_status(message) {
				
				this.set_graphphone_status.angle_status.status = message.angle_status.status
				this.set_graphphone_status.angle_status.value = message.angle_status.value
				this.set_graphphone_status.distance_status.status = message.distance_status.status
				this.set_graphphone_status.distance_status.value = message.distance_status.value
			},
			messageOlmap(message) {
				this.messageolmap = message
			},
			//获取陀螺仪数据,可以优化
			getcompassangel(message) {
				this.get_compassangel = message
				this.get_map_data = this.get_location.longitudes + "||" + this.get_location.latitude + "||" + this
					.get_compassangel
			},
			getjwd(message) {
				this.get_location.latitude = message.latitude
				this.get_location.longitudes = message.longtude
				var that = this
				
				if(message.type=='tb'){
					setTimeout(() => {
						uni.showModal({
							title: '提示',
							content: '是否需要打开高德地图？',
							success: function(res) {
								if (res.confirm) {
									// 执行确认后的操作
									that.openmap(that.get_location.longitudes,that.get_location.latitude,message.init_longtudes,message.init_latitude)
								} else {
									// 执行取消后的操作
								}
							}
						})
						// 方法区
					}, 1000);
				}
				// this.get_location = message//获取经纬度信息
			},
			// use autonavi service to 
			// implement the route navigation
			// mechnism: using Native.js call the android java api
			openmap(dlons,dlats,slons,slats) {
				//坐标转换
				var dlons_dlats = coordtransform.wgs84togcj02(dlons,dlats)
				var dlon = dlons_dlats[0]
				var dlat = dlons_dlats[1]
				var slons_slats = coordtransform.wgs84togcj02(slons,slats)
				var slon = slons_slats[0]
				var slat = slons_slats[1]
				var packageName = 'com.autonavi.minimap';
				var main = plus.android.runtimeMainActivity();
				var packageManager = main.getPackageManager();
				var PackageManager = plus.android.importClass(packageManager)
				var packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
				if (packageInfo) {
					var Uri = plus.android.importClass("android.net.Uri");
					//t=0 为驾车，=1 为公交，=2 为步行
					var url = "amapuri://route/plan?sourceApplication=maxuslife" +
						"&sid=A&slat="+slat+"&slon="+slon+"&sname=起始地点" +
						"&did=B&dlat="+dlat+"&dlon="+dlon+"&dname=结束地点&dev=0&t=2";
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent();
					intent.setAction(Intent.ACTION_VIEW);
					intent.addCategory(Intent.CATEGORY_DEFAULT);
					var uri = Uri.parse(url);
					//将功能Scheme以URI的方式传入data  
					intent.setData(uri);
					intent.setPackage("com.autonavi.minimap");
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				} else {
					// alert('未安装' + packageName + '')
					uni.showToast({
						title: `目前导航暂只支持${packageName}`
					})
				}
			},
			//获取绘制内容的值
			getfeatureGeoJson(message) {
				this.featureGeoJsonData.push(message.geometry)
			},

		
			postMins() {
				var _this = this

				try {

					//同步接口
					this.image_error = uni.getStorageSync(this.tbbh + 'imageerror');
					this.imagelist = uni.getStorageSync(this.tbbh);
				} catch (e) {
					// error
				}

				if ((this.imagelist != '') && this.image_error.length == 0) {
					 uni.showModal({
					    title: '提示',
					    content: '是否提交？',
					    success: (res) => {
					        if (res.confirm) {
								
								uni.request({
									url: setting.url + '/userTask/uploadImageAndData',
									method: 'POST',
									sslVerify: false, //真机运行受证书限制
									data: {
									spotNumber: this.tbbh, //图斑编号
									user_id: this.user_id, //用户id
									image_data: this.imagelist, //照片列表
									feature: this.featureGeoJsonData, //绘制内容
									messageanaly: this.messageanaly
						},
						success: res => {
							if (res.data.code === 200) {
								uni.hideLoading();
								uni.showToast({
									title: '提交成功!',
									duration: 2000
								})
								this.investigationStatus = '已核查'
								var that =this
								uni.removeStorage({
									key: that.tbbh,
									success: function (res) {
										
									}
								});
								uni.removeStorage({
									key: that.tbbh + 'imagelist',
									success: function (res) {
										
									}
								});
								uni.navigateBack({ delta: 1 })
								
							} else {
								uni.showToast({
									icon: "none",
									title: res.data,
									duration: 2000
								})
							}
						},
						header: {
							// 'Content-Type': 'application/x-www-form-urlencoded',
							'X-Requested-With': 'xmlhttprequest',
							'Content-Type': 'application/json;charset:utf-8'
						},
						fail: (res) => {
							console.log("上传失败", res)
						}
					})

							uni.showLoading({
									title: '正在提交数据'
								});
					        } else if (res.cancel) {
					                       
					        }
					    }
				});
					


				} else if (this.image_error.length > 0) {
					uni.showToast({
						icon: 'error',
						title: '请删除不合格照片',
						duration: 1000,
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: '请先调查在提交',
						duration: 1000,
					})
				}
			},
			uploadImageAndData(image_path) {
				return new Promise((resolve, reject) => {
					let token = uni.getStorageSync('DriverAuthorization')
					uni.uploadFile({
						url: setting.url + "/userTask/uploadImageAndData",
						filePath: image_path,
						sslVerify: false, //真机运行受证书限制
						name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
						header: {
							'Authorization': token,
							'Content-Type': 'application/x-www-form-urlencoded',
							'X-Requested-With': 'xmlhttprequest'
						},
						formData: {
							// imageTime:null,//时间
							// longitude:null,//经度
							// latitude:null,//纬度
							// gyroscope:[],//陀螺仪数据
							tbbh: this.tbbh, //图斑编号
							userId: this.user_id, //用户id
						},
						success: (res) => {
							// if (res.data.code === 200) {
							// 		// uni.showToast({
							// 		// 	title:'提交图片成功!',
							// 		// 	// duration:2000
							// 		// })
							// } else {
							// 	uni.showToast({
							// 		icon:"none",
							// 		title:res.data,
							// 		duration:2000
							// 	})
							// }
						},
						fail: (res) => {
							console.log(res.data)
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'X-Requested-With': 'xmlhttprequest'
							// 'Content-Type': 'application/json;charset:utf-8',
						}
					})
				})
			},
			
			
			importMapLayers(){
				
				var _this = this
				this.rfmapVm = this.$refs["map"]
				// console.log("debug-mapviepage ", this.$refs, mapVm)
				
				// var import_prom = importAdminLayer("city")
				
				// var $store = this.$store
				
				// $store.dispatch("findLayer", {"name":"city"})
				// .then(
				// 	(lyr)=>{
				// 		return importAdminLayer("city")
				// 	}
				// )
				// .then( 
				// 	(lyrObj)=>{
				// 		_this.$refs["map"].addLayer(lyrObj,  "city", "default")
				// 	} 
				
				// )
				
				// $store.dispatch("findLayers", 
				// // {"name":"city"},
				// {"field":"name","value":"city"}
				// )
				// .then(
				// 	(lyrs)=>{
				// 		console.log(`debug-mapviewpage `, lyrs)
				// 		return lyrs[0]
				// 	}
				// )
				
				let import_prom;
				
				importLayer({"name":"city", "layerRepresentType":"location"})
				.then(
					(lyrObj)=>{
						

						_this.$refs["map"].addLayer(lyrObj,  "city", "default")	
				
						_this.rfmapVm.setDrawLayer("city")
						// $store.dispatch("findLayers",
						// // {"name":"city"},
						// {"field":"name","value":"city"}
						// )
						// .then(
						// 	(lyrs)=>{
						// 		console.log(`debug-mapviewpage `, lyrs)
						// 		// return lyrs[0]
						// 		if(lyrs[0] && !lyrs[0]["visible"])
						// 		{
						// 			lyrObj.setVisible(false)
						// 		}
						// 	}
						// )
						// _this.$refs["map"].setDrawLayer("city")	
						
					}
				
				)
				
		
				importLayer({"name":"county", "layerRepresentType":"location"})
				.then(
					(result)=>{
						
						_this.rfmapVm.addLayer(result, "county", "default")
					}	
				)
				
				
				importLayer({name:"OutdoorPhotograph"})
				.then(
					(result)=>{
						
						// console.log("debug-mapviewpage ", result)
						
						_this.rfmapVm.addLayer(result, "outdoorCamera", "default")
					
					}	
				)
				
				importLayer({name:"TraceMemoryLocationRed"})
				.then(
					(result)=>{
						
						console.log("debug-mapviewpage red flag ", result)
						
						_this.rfmapVm.addLayer(result, "red flag", "default")
						
					}	
				)
				
				importLayer({name:"GPSLocation"})
				.then(
					(result)=>{
						
						result.getSource().on("featuresloadend", ()=>{_this.testSyncGPS()})
						_this.rfmapVm.addLayer(result, "user_self_location", "default")
					
					}	
				)
				// importLayer({name:"TraceMemoryLocationYellow"})
				// .then(
				// 	(result)=>{
						
				// 		// console.log("debug-mapviewpage ", result)
						
				// 		_this.rfmapVm.addLayer(result, "yellow flag", "default")
				// 		// _this.rfmapVm.setDrawLayer("outdoorCamera")
				// 		// for test
				// 		// _this.rfmapVm.setUsedMode("edit")
				// 		// _this.rfmapVm.setupInteraction({"type":"draw"})
				// 		// _this.rfmapVm.setInteractionType("draw")
				// 	}	
				// )
				
				// _this.rfmapVm.setInteractionType("select")
				// _this.rfmapVm.createDoodleLayer("default", "red", 4)
				// _this.rfmapVm.startDoodle("default")
				
				
				
				
			},
			
			testSyncGPS(){
				
				var this_ = this
				var lyr = this_.rfmapVm.getLayer("user_self_location")[0]
				// console.log("debug-spot survey ", lyr)
				var feat = lyr.getSource().getFeatures()[0]
				// var feat = lyr.getSource().forEachFeature((feat)=>{console.log("debug-spot survey ", feat)})
				// console.log("debug-spot survey ", feat)
				var geom = feat.getGeometry()
				var originCoord = geom.getCoordinates()
				
				var vx = 0.005
				
				var loopNum = 5
				
				const loop_ = function(){
					
					
					const lastCoord = originCoord.slice()
					originCoord[0] = originCoord[0] + vx
					// geom.setCoordinates(originCoord)
					
					this_.rfmapVm.updateSelfLocation({
						longitude:originCoord[0], 
						latitude:originCoord[1],
						compassOrientation:Math.random()*180,
						}, 
						{"viewportFollow":true,
						"viewportFollowTolerance":0.01,
						"oldVal":{
							longitude:lastCoord[0],
							latitude:lastCoord[1]
						}
						},
						)
					// loopNum--
					if(loopNum-->0){
						setTimeout(loop_, 2000)
					}
				}
				
				// lyr.on("featuresloadend", loop_)
				
				loop_()
				
			},
			
			updateGpsLocationToMap(data){
				
				
				
				const evt = data
				
				// var speed = evt.speed
				
				var lyr = this.rfmapVm.getLayer("gps_user_self")[0]
				// console.log("debug-spot survey ", lyr)
				var feat = lyr.getSource().getFeatures()[0]
				// var feat = lyr.getSource().forEachFeature((feat)=>{console.log("debug-spot survey ", feat)})
				// console.log("debug-spot survey ", feat)
				
				if(evt.longitude){
					
					// const lon = evt.longitude
					// const lat = evt.latitude
					// const geom = feat.getGeometry()
					// const coord = [ evt.longitude, evt.latitude]
					// // var originCoord = geom.getCoordinates()
					// geom.setCoordinates(coord)
					// if(this.urfGpsLocCoordsHistory.length>50){
					// 	// push to server then save them
					// 	// uni.request()
					// 	const temp =  this.urfGpsLocCoordsHistory.slice()
					// 	this.urfGpsLocCoordsHistory.clear()
					// }
					// this.urfGpsLocCoordsHistory.push(coord)
					
					// this.rfmapVn.updateSelfLocation({coord:coord}, {"viewportFollow":true})
				}
				
				if(evt.compassOrientation){
					feat.setProperties({orientation: evt.compassOrientation})
				}
				
			},
			
			onLocationChanged(evt){
				
				const lon = evt.longitude
				const lat = evt.latitude
				const speed = evt.speed
				// console.log("debug-spot_survey_work_page gps location ", evt)
				// this.updateGpsLocationToMap(evt)
				
				
			},
			
			onCompassChanged(evt){
				
				// this.updateGpsLocationToMap({"compassOrientation":evt})
				console.log("debug-spot_survey_work_page compass", evt)
			}
		},
	};
</script>
<style lang="scss">
	.submit_button {
		margin-top: -8%;
		// bottom: -8%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 7%;

		.submit_button_icon {
			vertical-align: middle;
		}

		.submit_button_text {
			vertical-align: middle;
			font-size: 25rpx;
			margin-left: 10rpx;
		}
	}

	.mainImg {
		width: 100%;
	}

	//要给u-transition设置fixed定位
	.menu_warp {
		width: 100vw;
		z-index: 9999999;
		position: fixed;
		top: 90vh;
		left: 0;

		.warp {
			background: lightblue;
			border-radius: 40rpx 40rpx 0 0;
			padding-bottom: 300rpx;

			.bar {
				position: relative;
				width: 100%;
				height: 40rpx;

				&::after {
					content: "";
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 200rpx;
					height: 10rpx;
					border-radius: 10rpx;
					background: #111111;
				}
			}

			.text {
				font: 100rpx "Ravie";
				margin-top: 160rpx;
				text-align: center;
				color: #ffffff;
			}
		}
	}

	.menu_warp1 {
		width: 100vw;
		position: fixed;
		top: 45vh;
		z-index: 9999999;
		left: 0;

		.warp {
			background: lightblue;
			border-radius: 40rpx 40rpx 0 0;
			padding-bottom: 300rpx;

			.bar {
				position: relative;
				width: 100%;
				height: 40rpx;

				&::after {
					content: "";
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 200rpx;
					height: 10rpx;
					border-radius: 10rpx;
					background: #111111;
				}
			}

			.text {
				font: 100rpx "Ravie";
				margin-top: 160rpx;
				text-align: center;
				color: #ffffff;
			}
		}
	}
</style>
