<template>

	<view>
	<!-- 	<custom-tabs type="c1" :value="value" >
			<one></one>
			<two :id="tbbh"></two>
			<three :id="tbbh"></three>
			<chooseimage :imageList="imagelist" :get_map_data="get_map_data"
				:set_graphphone_status="set_graphphone_status" :tbbh="tbbh"
				:investigationStatus="investigationStatus">
			</chooseimage>
			
			<analy :messageAnaly="messageanaly" @analySend="messageOlmap($event)"></analy>
		</custom-tabs> -->

		<ZsTabs
		:type="rftabId"
		:value="1"
		>
			
			<ZsTab
				label="影像截取"
				:name="makeupTabKey('mapImageSnapshot')"
				>
					<view style="width:100%;">
						<!-- <image src='../../static/a18101f2e6ea4b1eb06fed87454421f1.jpeg'> -->
							<image src='/static/a18101f2e6ea4b1eb06fed87454421f1.jpeg'>
						</image>
					</view>
				</ZsTab>
				<ZsTab
				label="图斑信息"
				:name="makeupTabKey('spotInfo')"
				>
					
					<SpotItemsViewPanel>
						
					</SpotItemsViewPanel>
					
				</ZsTab>
				<ZsTab
				label="分析"
				:name="makeupTabKey('analy')"
				>
					<!-- <SpatialAnalyPanel>
						
					</SpatialAnalyPanel> -->
				</ZsTab>
				<ZsTab
				label="拍照取证"
				:name="makeupTabKey('dataCollection')"
				>
	
					<OutdoorPhotoPanel
					:imageList="imagelist" 
					:get_map_data="get_map_data"
					:set_graphphone_status="set_graphphone_status" 
					:tbbh="tbbh"
					:investigationStatus="investigationStatus"
					>
						
					</OutdoorPhotoPanel>
					
				</ZsTab>	
				<ZsTab
				label="绘制编辑"
				:name="makeupTabKey('drawAndEdit')"
				>
						<MapEditCtrlPanel>
							
						</MapEditCtrlPanel>
				
				</ZsTab>
			
		</ZsTabs>
		<button  
		class="submit_button" 
		type="primary"
		@click="postMins()"
		>
			<uni-icons class="submit_button_icon" type="cloud-upload-filled" size="28" color="white">
			</uni-icons>
			<span class="submit_button_text">点击提交</span>
		</button>
	</view>

</template>

<script type="text/javascript">

import Vue from 'vue';

import ZsTabs from '@/components/zs-components/zs-tabs/ZsTabs.vue';
import ZsTab from '@/components/zs-components/zs-tabs/ZsTab.vue';


import SpatialQueryPanel from '@/pages/mapViewPage/panels/SpatialQueryPanel.vue';
// import DataAnalyPanel from './panels/DataAnalyPanel.vue';
import SpotItemsViewPanel from './SpotItemsViewPanel.vue';
import OutdoorPhotoPanel from './OutdoorPhotoPanel.vue';
import MapEditCtrlPanel from "./MapEditCtrlPanel.vue"
// import OutdoorDataCollectionPanel from '@/components/custom-tab-check/custom-tab-check-chooseimage.vue';
// import DataAnalyPanel from "@/components/custom-tab-check/custom-tab-check-analy.vue";

	import setting from '@/setting.js';
	// import one from "@/components/custom-tab-check/custom-tab-check-one.vue";
	// import two from "@/components/custom-tab-check/custom-tab-check-two.vue";
	// import three from "@/components/custom-tab-check/custom-tab-check-three.vue";
	// import analy from "@/components/custom-tab-check/custom-tab-check-analy.vue";
	// import chooseimage from "@/components/custom-tab-check/custom-tab-check-chooseimage.vue";
	// import coordtransform from 'coordtransform';

export default {
		name:"SpotSurveyBusinessOpPanel",
		components: {
			ZsTabs,
			ZsTab,
			// olmapoperation,
			// one,
			// two,
			// three,
			// analy,
			// chooseimage,
			// OlMap,
			// ZsFloatBall,
			// MapViewBasicCtrlPanel,
			// ZsBottomPullup,
			
			SpotItemsViewPanel,
			OutdoorPhotoPanel,
			MapEditCtrlPanel,
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
				
				
				rftabId:"ssptb",
				rfcurTabInd:1,
				// rfcurTabInd:2,
				rftabRefName:"tabs"
			};
		},
		created(){
			
			this.urftabKeyToInde = {
				"layer":0,
				"spatialAnaly":1,
				"dataCollection":2
			}
		},
		onLoad(options) {
			this.tbbh = options.tbbh;
			this.investigationStatus = options.investigationStatus
			this.user_id = options.user_id;
			// this.id = options.id
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
		},
		methods: {

			//开始触摸
			touchStart(e) {
				//记录手指触摸到屏幕的那一个的位置，计算小黑条的top值
				this.start = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2);
			},
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

			//触摸开始并且移动
			touchMove(e) {			
				// 
				this.$u.throttle(function(e) {
					//step 和 run 方法 查看uniapp官方文档："https://uniapp.dcloud.io/component/uniui/uni-transition?id=基本用法";其实文档上写需要先初始化init，但是不init也可以使用，不知道为什么
					let top = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100 + "vh";
					if (parseInt(top) >= 80) {
						top = "90vh";
						this.isActive = true,
							this.hasError = false
					} else if (parseInt(top) <= 60) {
						top = "45vh";
						this.isActive = true,
							this.hasError = false
					} else {
						top = top;
						this.isActive = true,
							this.hasError = false
					}
					this.$refs.menuWarp.step({
						top: top
					}, {
						duration: 180
					});
					this.$refs.menuWarp.run(() => {});
				}, 60, true)
				//节流函数：60ms内，只触发一次，感知不大，这里用的是uview封装好的节流函数，官方文档：https://v1.uviewui.com/js/debounce.html
			},
			//手指离开手机
			touchEnd(e) {
				const start = this.start * 100;
				const end = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100;
				if (start > end) {
					this.$refs.menuWarp.step({
						top: "35%"
					}, {
						duration: 180
					});
					this.$refs.menuWarp.run(() => {});
				} else if (start < end) {
					this.$refs.menuWarp.step({
						top: "90vh"
					}, {
						duration: 180
					});
					this.$refs.menuWarp.run(() => {});
				}
			},
			//输入框获焦
			focus() {
				this.$refs.menuWarp.step({
					top: "45vh"
				}, {
					duration: 180
				});
				this.$refs.menuWarp.run(() => {});
			},
			//输入框失焦
			blur() {
				this.$refs.menuWarp.step({
					top: "90vh"
				}, {
					duration: 180
				});
				this.$refs.menuWarp.run(() => {});
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
			
			makeupTabKey(name){
				
				return `${this.rftabId}_${name}`
			},
			
			switchTabTo(name){
				
				// this.rfcurTabInd = this.urftabKeyToInde[name]
				var ind = this.urftabKeyToInde[name]
				// console.log("debug-mvbp tab", this.rfcurTabInd)
				// this.$forceUpdate()
				
				this.$refs[this.rftabRefName].switchTab(ind)
			}
		},
	};


</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
</style>