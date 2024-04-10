<template>
	<view class="container">
		<!-- compassangel用于当罗盘角度改变，逻辑层向视图层传递改变角度 -->
		<view :prop="compassangel" :change:prop="ol.oncompasschanges" :propgeojson="geojson_data"
			:change:propgeojson="ol.GetGeojson">
		</view>
		<!--监控手机用户的界面大小  -->
		<view id="olMap"
			:style="{height: nowMapIndex ? nintyPercentScreenHeight : seventyPercentScreenHeight,width:'750rpx'}" style="z-index: 9998;">

		</view>

	</view>
</template>
<!-- 逻辑层 -->
<script>
	import {
		getShpAll
	} from '../../utils/getData.js';

	import setting from '@/setting.js';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin', 'uerInfo']),

		data() {
			return {
				nowMapIndex: true,
				options: {
					// 这里存放准备传递给renderjs的数据
					longitudes: '',
					latitude: ''
				},
				phoneHeight: '', //屏幕高
				phoneWidth: '', //屏幕宽
				measure_value: null,
				// lineLayer: null, //线图层
				draw: null,
				lineSource: null,
				coordinate: [],
				currentDrawFeature: "1", //当前正在绘制的要素类型
				ope_types: '23',
				draw_polygon_area: null,
				compassangel: null, //罗盘角度
				geojson_data: null, //geojson数据
				gyroValueX: 0,
				gyroValueY: 0,
				gyroValueZ: 0,
				gyroValueRawX: 0,
				gyroValueRawY: 0,
				gyroValueRawZ: 0,
				gyroModule: null,
				OptionTimer: '', //定时器
				lon:'',
				lat:''
			}
		},
		// },
		created() {
			// 计算屏幕高度 ，宽度
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					_this.phoneWidth = res.windowWidth
				},
				fail(e) {
					console.log("高度获取失败：",e)
				}
			});
		},
		computed: { //计算
			nintyPercentScreenHeight() { //百分之九十的屏幕高
				if (this.phoneHeight !== '' && this.phoneWidth !== '') {
					return 750 / (this.phoneWidth) * (this.phoneHeight) * 0.95 + 'rpx'
				} else {
					
					return '2000rpx'
				}
			},
			seventyPercentScreenHeight() { //百分之七十的屏幕高
				if (this.phoneHeight !== '' && this.phoneWidth !== '') {
					return 750 / (this.phoneWidth) * (this.phoneHeight) * 0.7 + 'rpx'
				} else {
					return '1000rpx'
				}
			},
		},
		onHide() {
			
			uni.removeStorageSync('first');
			// //停止加速度监听
			// uni.stopAccelerometer();
			
			// 取消监听
			// uni.offCompassChange(this.excuteCompass)
			// uni.stopCompass();

		},
		beforeDestroy() {
			// uni.stopCompass();
			// uni.offCompassChange(this.excuteCompass)
			// uni.stopCompass();
			console.log("beforeDestroy")
						// clearInterval(this.gyroUpdateTimer);
						// //停止监听陀螺仪数据
						// this.gyroModule.stopGyro();
			// uni.stopAccelerometer();
			
		},
		methods: {
			...mapMutations(['logout']),
			logoutF() {
				this.logout()
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			},

			loginF() {
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			},

			login_onCompassChange() {
				 // uni.onCompassChange(this.excuteCompass);
				uni.onCompassChange((CompassRes) => {
					uni.onAccelerometerChange((res) => {
						// 根据加速度数据来判断设备方向
						const {
							x,
							y
						} = res;
						if (Math.abs(x) > Math.abs(y)) {
							this.compassangel = parseInt(CompassRes.direction) + 90
							// 横向
						} else { 
							// 竖向
							this.compassangel = parseInt(CompassRes.direction)
						}
					});	
				})
			},
			getShpDate() {
				// this.geojson_data = await getShpAll()	
				uni.getStorage({ //获得保存在本地的用户信息
					key: 'uerInfo',
					success: (res) => {
						uni.request({
							url: setting.url + '/userTask/getUnInvestigationTask?userId=' + res.data
								.data.user.user.user_id,
							method: 'GET',
							sslVerify: false, //真机运行受证书限制
							header: {
								'Content-Type': 'application/x-www-form-urlencoded',
								'X-Requested-With': 'xmlhttprequest',
								// 'Content-Type': 'application/json;charset:utf-8',
							},
							success: res => {
								this.geojson_data = res.data.data
								if (res.data.success == true) {
									this.taskList = res.data.data.TaskInfoList;
								} else {
									this.taskList = [];
								}
							},
							fail: (res) => {}
						})
					},
					fail() {
						console.log("失败了失败！！！！")
					}
				});
			},
			// },

		},
		mounted() {
			// this.getShpDate()
			 this.login_onCompassChange()
		},
		created(){
			this.getShpDate()
			
		},
	}
</script>
<script module="ol" lang="renderjs">
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import {
		ImageWMS,
		OSM,
		Vector as sourcevector,
		TileWMS,
		XYZ,
	} from 'ol/source';
	import {
		Tile as TileLayer,
		Vector as layerVector,
		Image as ImageLayer
	} from 'ol/layer';
	import {
		Style as style,
		Circle as circle,
		Fill as fill,
		Stroke,
		Icon,
		Text
	} from 'ol/style';
	// import fullScreen from 'ol/control/FullScreen';
	import Feature from 'ol/Feature';
	import {
		Select,
		Draw,
		Modify,
		Snap
	} from 'ol/interaction';
	import {
		boundingExtent,
		getCenter,
		getTopLeft,
		getWidth
	} from 'ol/extent';
	import Overlay from 'ol/Overlay';
	import {
		getArea,
		getLength
	} from 'ol/sphere';
	import {
		unByKey
	} from 'ol/Observable';
	import {
		MousePosition,
		ScaleLine,
		defaults,
	} from 'ol/control';
	import {
		createStringXY
	} from 'ol/coordinate';
	import Cluster from 'ol/source/Cluster';
	import {
		Point,
		Circle as CircleGeo,
		LineString,
		Polygon
	} from 'ol/geom';
	import GeoJSON from "ol/format/GeoJSON";
	import turf from "turf";
	import {
		get as getProjection
	} from "ol/proj.js";
	// import {bbox} from 'ol/loadingstrategy';
	// import {fromLonLat, toLonLat,transformExtent, transform } from 'ol/proj'
	import WKB from 'ol/format/WKB';
	import WMTSTileGrid from 'ol/tilegrid/WMTS'
	import WMTS from "ol/source/WMTS";
	import setting from '@/setting.js';
	// import videoconference from "@/components/video_conference/video_conference.vue";
	const source = new sourcevector({
		wrapX: false
	});
	const vector = new layerVector({
		source: source,
	});
	var measureTooltipElement = null;
	var measureTooltip = null;
	var helpTooltipElement = null
	var helpTooltip = null;
	var mapMouseMove = null;
	var feature = null;
	export default {
		// components:{videoconference},
		data() {
			return {
				map: null, //地图
				// geoData: {}, //定位数据
				vectorLayer: null, //创建图层
				vectorSource: null, //图层数据容器
				layer: null, //地图图层
				// lineLayer: null, //线图层
				draw: null,
				init_center:true,
				// lineSource: null,
				coordinate: [],
				// draw_source: new sourcevector(),
				draw_vector: {},
				draw: {},
				point: null,
				overlay: null,
				drawLayers: [],
				drawElements: [],
				json_analy: [],
				stylepoint: null, //用于定位角度方向
				feature: null,
				init_longtudes: null,
				init_latitude: null,
				// geoserverLayer:null,
				//图斑名称
				PolygonName: null,
				//图斑坐标
				PolygonCoordinate: null,
				//图斑数据
				PolygonData: "222",
				// wkbs:null,
				//用来做双向判断，判断地图是否初始化好
				init_map_complete: 0,
				set_center_status: 1, //是否需要重新设置重新点，0：不重置，1：重置
				watchPositionTime: 1000, //动态改变定位间隔时间
			}
		},
		mounted() {
			if (typeof window.ol === 'function') {
				this.initAmap()
			} else {
				let pMountedTimer = {}; //定时器
				pMountedTimer = setInterval(() => {
					if (this._isMounted) {
						//在这里执行初始化
						// this.addDrawLayer();
						clearInterval(pMountedTimer); //清除定时器
					}
				}, 1000);
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				script.src = 'https://cdn.bootcdn.net/ajax/libs/openlayers/4.6.5/ol.js'
				script.onload = this.initAmap.bind(this)
				document.head.appendChild(script)
			}


		},
		destroyed(){
			console.log("destroyed")
		},
		beforeDestroy() {

			
		},
		methods: {
			// },
			//修改定位点角度
			oncompasschanges(newValue, oldValue, ownerInstance, instance) {
				if (this.init_map_complete == 1) {
						var nn =Math.PI/180 * newValue
						this.stylepoint.getImage().setRotation(nn)						
						this.feature.changed()
				}
			},
			//将接口的一维数组转成二维数组
			pages(list) {
				const pages = []
				list.forEach((item, index) => {
					const page = Math.floor(index / 2)
					if (!pages[page]) {
						pages[page] = []
					}
					pages[page].push(item)
				});
				return [pages]
			},
			//获取矢量图接口返回的数据，这里可以优化选择调用geoserver发布的图层，
			GetGeojson(newValue, oldValue, ownerInstance, instance) {
				this.PolygonData = newValue
			},
			createMeasureTooltip() {
				if (measureTooltipElement) {
					measureTooltipElement.parentNode.removeChild(measureTooltipElement);
				}
				measureTooltipElement = document.createElement('div');
				measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
				measureTooltip = new Overlay({
					element: measureTooltipElement,
					offset: [0, -15],
					positioning: 'bottom-center',
					stopEvent: false,
					insertFirst: false,
				});
				this.drawElements.push(measureTooltip)
				this.map.addOverlay(measureTooltip);
			},
		 async	initAmap() {
			 var that = this
			 var wkid = 4326;
			 const projection = getProjection('EPSG:3857');
			 const projectionExtent = projection.getExtent();
			 const size = getWidth(projectionExtent) / 256;
			 const resolutions = new Array(19);
			 const matrixIds = new Array(19);
			 var wmtsUrl = 'http://t{0-7}.tianditu.gov.cn/img_w/wmts?tk='; //影像底图
			 var token ="da4af7d03246cb5e7a32655e023f54aa"; 
			 for (let z = 0; z < 19; ++z) {
			 	// generate resolutions and matrixIds arrays for this WMTS
			 	resolutions[z] = size / Math.pow(2, z);
			 	matrixIds[z] = z;
			 }
			 
			 var sourceMark = new WMTS({
			 	url: wmtsUrl + token,
			 	layer: 'img',
			 	matrixSet: 'w',
			 	format: 'tiles',
			 	style: 'default',
			 	projection: projection,
			 	tileGrid: new WMTSTileGrid({
			 		origin: getTopLeft(projectionExtent),
			 		resolutions: resolutions,
			 		matrixIds: matrixIds,
			 	}),
			 	// visible: true,
			 })

				const tileLayer = new TileLayer({
					source: sourceMark
				})
				var titleMarkUrl = new XYZ({
					url: 'http://t2.tianditu.com/DataServer?T=cva_w&tk='+token+'&x={x}&y={y}&l={z}'
				})
				var tileMark = new TileLayer({
					title: '标注图层',
					source: titleMarkUrl

				})
				this.map = new Map({
					// 设置地图图层
					target: "olMap", // DOM容器
					//越往左，图层越在底层
					layers: [tileLayer, tileMark], //地图源的瓦片图层
					// 设置显示地图的视图
					view: new View({
						center: [108, 22], //地图中心点 经纬度
						zoom: 16, // 缩放级别-显示层级
						minZoom: 0, // 最小缩放级别
						maxZoom: 30, // 最大缩放级别
						projection: getProjection("EPSG:4326")
					}),
					controls:defaults({
						attribution: false,
						zoom: false,
						rotate: false
					})
				});
				// this.loadGeoserverMap()
				this.setPoint()
				var that = this
				plus.geolocation.watchPosition( //不停的获取和更新用户的地理位置信息，自定义执行间隔时间；当设备地理位置发生改变时，自动调用；
					function(p) {
						// p为获取成功的定位数据
						// that.init_longtudes = result[0]
						// that.init_latitude = result[1]
						
						that.init_longtudes = p.coords.longitude
						that.init_latitude = p.coords.latitude
						try {
							that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
							// that.stylepoint.getText().setText(''+p.coords.longitude+"\n"+p.coords.latitude+'')
							if(that.init_center){
								that.set_center_point(that.init_longtudes, that.init_latitude)
								that.init_center =false
							}
							
						} catch (e) {
							that.setPoint();
							//TODO handle the exception
						}
					 //    that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
					 //    that.set_center_point(that.init_longtudes, that.init_latitude)
						// that.stylepoint.getText().setText(''+p.coords.longitude+"\n"+p.coords.latitude+'')
					},
				
					function(err) {
						//失败回调
					}, {
						provider: 'system',
						//是否使用高精度设备，如GPS。默认是true  
						enableHighAccuracy: true,
						//超时时间，单位毫秒，默认为0  
						//使用设置时间内的缓存数据，单位毫秒  
						//默认为0，即始终请求新数据  
						//如设为Infinity，则始终使用缓存数据  
						maximumAge: 500,
					});
				//调用openlayer自带的底图
				// this.map = new Map({
				// 	// 设置地图图层
				// 	target: "olMap", // DOM容器
				// 	layers: [new TileLayer({
				// 		source: new OSM()
				// 	})], //地图源的瓦片图层
				// 	// 设置显示地图的视图
				// 	view: new View({
				// 		center: [this.init_longtudes, this.init_latitude], //地图中心点 经纬度
				// 		zoom: 16, // 缩放级别-显示层级
				// 		minZoom: 0, // 最小缩放级别
				// 		maxZoom: 18, // 最大缩放级别
				// 		projection: getProjection("EPSG:4326")
				// 	}),
				// });
				this.setPoint();
				this.init_map_complete = 1
				// 创建source对象
				this.VectorSource = new sourcevector({
					features: [] // 值是一个feature数组   source:features  1:N
				});
				// 创建layer对象
				this.VectorLayer = new layerVector({
					source: this.VectorSource // layer-source  1:1
				});
				this.map.addLayer(this.VectorLayer);			
				await this.createShePolygon();
				//监听图层变化
				this.map.getView().on('change:resolution', () => {
					let layers = this.map.getLayers().getArray()
					for (const layer of layers) {
						const ln = layer.get("name")
						if (typeof ln != 'undefined') {
							if (this.map.getView().getZoom() >= 17) {
								this.setLayerVisible(ln, true)
							} else {
								this.setLayerVisible(ln, false)
							}
						}
					}
				})
			},
			//添加图层
			loadGeoserverMap() {
				var geoservermap = ["3333"]
				geoservermap.forEach(element=>{
					const geoserverLayer = new TileLayer({
						name: element,
						source: new TileWMS({
							url: 'http://6.19.22.60:8080/geoserver/test/wms', // 请求地址
						//	url: 'http://6.19.22.60:8080/geoserver/test/wms', // 请求地址
							params: { // 请求的参数设置，其余参数可以不设置，使用默认的参数
								//'FORMAT': 'image/jpeg',   //如果加了这行，地图底图将会被遮住
								LAYERS: 'test:' + element, // 请求的图层名
								VERSION: '1.1.0', // wms请求的版本，也可用1.3.0
								'STYLES': '',
								tiled:true,
								projection:"EPSG:4326",
							},
					
						}),
						visible:false
					});
					this.map.addLayer(geoserverLayer); // 加载图层到地图上
				})
				// let layers = this.map.getLayers().getArray()
 			// 	for (const layer of layers) {
				// 	console.log("layer:",layer.get("name"))
				// }
				// var element = "0.8米分辨率"
				// // var geoservermap = ["building","1"]
				// this.geoserverLayer = new TileLayer({
				// 	name: element,
				// 	source: new TileWMS({
				// 		url: 'http://6.19.22.60:8080/geoserver/test/wms', // 请求地址
				// 		params: { // 请求的参数设置，其余参数可以不设置，使用默认的参数
				// 			//'FORMAT': 'image/jpeg',   //如果加了这行，地图底图将会被遮住
				// 			LAYERS: 'test:3333', // 请求的图层名
				// 			VERSION: '1.1.0', // wms请求的版本，也可用1.3.0
				// 			'STYLES': '',
				// 			tiled:true,
				// 			projection:"EPSG:4326",
							
				// 		},
				// 	}),
				// 	visible:false
				// });

				// this.map.addLayer(this.geoserverLayer); // 加载图层到地图上
			},
			setLayerVisible(layer_name,status){
				this.map.getLayers().getArray().forEach((items) => {
				 	if (layer_name.includes(items.get("name"))) {
				 			items.setVisible(status);
				 			return;
				 	}
				 	
				});
				
			},
			//重置中心点
			set_center_point(longtudes, latitude) {
				this.map.getView().setCenter([longtudes, latitude])
				this.set_center_status = 0
			},
			createShePolygon() {
				const format = new WKB();
				// 任务数量
				const task_num = this.PolygonData ?.length??0
				//遍历任务数量
				for (var i = 0; i < task_num; i++) {
					//获取一个任务数据
					var task_data = this.PolygonData[i]
					for (let j = 0; j < task_data.length; j++) {
						const wkb = task_data[j].theGeom
						// //图斑名称
						this.PolygonName = task_data[j].tbbh
						//图斑坐标
						this.PolygonCoordinate = this.pages(format.readGeometry(wkb, {
							dataProjection: 'EPSG:4326',
						}).flatCoordinates)
						this.createPolygon(this.PolygonCoordinate, this.PolygonName)
					}
				}
			},
			/**
			 * 创建多边形到地图
			 */
			createPolygon(ptArr, val) {
				var feature = new Feature({
					geometry: new Polygon(ptArr)
				});
				this.VectorSource.addFeature(feature);
				this.createMeasureTooltip()
				measureTooltipElement.innerHTML = val;
				measureTooltip.setPosition(feature.getGeometry().getInteriorPoint().getCoordinates());
				measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
				measureTooltip.setOffset([0, -7]);
				// feature = null;
				measureTooltipElement = null;
				this.createMeasureTooltip();
			},
			//   添加定位图标
			setPoint() {
				// this.globalData.init_longtudes
				this.feature = new Feature({
					title: 'beijing',
					name: 'setPoint',
					geometry: new Point([this.init_longtudes, this.init_latitude]),
				
				})

				
				// const iconStyle= new Icon({
				//   src: 'https://raw.githubusercontent.com/google/material-design-icons/master/png/maps/add_business/materialiconsoutlined/24dp/2x/outline_add_business_black_24dp.png',
				// });
				const iconStyle = new Icon({
					// src:'http://192.168.137.1:8991/static/location.png' ,
					src: setting.url + '/static/location.png'
				});
				iconStyle.load();
				var that = this
				//that.stylepoint.getText().setText(p.coords.longitude+"\n"+p.coords.latitude)
				this.stylepoint = new style({
					image: iconStyle,
					text: new Text({
					      font: '30px Microsoft YaHei',
					      fill: new fill({
					            color: '#ff0000'
					      })
					 })
				})
				console.log("olmap setStyle")
				this.feature.setStyle(this.stylepoint)
				let source = new sourcevector()
				source.addFeature(this.feature)
				let layer = new layerVector()
				layer.setSource(source)
				this.map.addLayer(layer)
			},
		},
	}
</script>
<!-- ```javascript -->
<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
<style lang="scss">
	#map_box {
		height: 100%;

		#map {
			width: 100%;
			height: 100%;
			z-index: 990;
			position: fixed;
		}

		.btn_box {
			position: fixed;
			top: .5em;
			right: .5em;
		}

		.ol-zoom {
			top: auto;
			left: auto;
			right: .5em;
			bottom: .5em;
		}

		.ol-attribution {
			display: none;
		}

		.clearBtn {
			position: fixed;
			top: 5.5rem;
			right: .5rem;
		}
	}

	.ol-tooltip {
		position: relative;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		color: white;
		padding: 4px 8px;
		opacity: 0.7;
		white-space: nowrap;
		font-size: 12px;
		cursor: default;
		user-select: none;
	}

	.ol-tooltip-measure {
		opacity: 1;
		font-weight: bold;
	}

	.ol-tooltip-static {
		background-color: #ffcc33;
		color: black;
		border: 1px solid white;
	}

	.ol-tooltip-measure:before,
	.ol-tooltip-static:before {
		border-top: 6px solid rgba(0, 0, 0, 0.5);
		border-right: 6px solid transparent;
		border-left: 6px solid transparent;
		content: "";
		position: absolute;
		bottom: -6px;
		margin-left: -7px;
		left: 50%;
	}

	.ol-tooltip-static:before {
		border-top-color: #ffcc33;
	}
	.operation-button{	
		// display: inline-block;
		width: 60rpx;
		height: 60rpx;				
		border: none;
		border-radius: 50%;	
		margin-top: 20rpx;
		left:20rpx
	}
	.operation-text{
		font-size: 15rpx;
		top: 50%;
		transform: translateX(-50%);
		position: absolute;
		display: inline-block;
	}
	.operation-icon {
		font-size:45rpx;
		// position: fixed;
		display: inline-block;
		position: absolute;
		top: -56%; /* 调整位置 */
		left: 50%;
		transform: translateX(-50%)
	}

	button::after {
		border: none;
		background-color: none;
	}
</style>
