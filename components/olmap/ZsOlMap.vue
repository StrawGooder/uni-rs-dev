<template>
	<view class="container">
		<!-- compassangel用于当罗盘角度改变，逻辑层向视图层传递改变角度 -->
		<view 
		:prop="compassangel" 
		:change:prop="ol.oncompasschanges" 
		:propgeojson="geojson_data"
		:change:propgeojson="ol.GetGeojson"
		>
		</view>
		<!--监控手机用户的界面大小  -->
	<!-- 	<view id="olMap"
			:style="{height: nowMapIndex ? nintyPercentScreenHeight : seventyPercentScreenHeight,width:'750rpx'}" 
			style="z-index: 9998;">
		</view> -->
		
		<!-- style="width:750rpx;height:750rpx" -->
		<view
		:style="computedViewportStyle"
		:ref = "rfMapContElem"
		style="overflow: scroll;"
		class="zs-noscrollbar"
		>
			
	<!-- 		<view id="olMap"
				:style="{height: nowMapIndex ? nintyPercentScreenHeight : seventyPercentScreenHeight,width:'750rpx'}" 
				style="z-index: 9998;">
			
			</view> -->
			
			<view id="olMap"
				:style="computedMapContViewStyle" 
				style="z-index: 9998;"
				
				>
			
			</view>
			
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
		
		name:"ZsOlMap",
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
				// phoneHeight: null, //屏幕高
				// phoneWidth: null, //屏幕宽
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
				lat:'',
				
				
			
				// rfViewBufSize:512,
				rfViewBufSize:256,
				// rfViewBufSize:128,
				// rfViewBufSize:0
				
				rfMapContElem:"mapContainer"
			}
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
			
			
			computedViewportStyle:{
				get:function(){
					return {
						// width:`${this.computedViewWidth}rpx`,
						// height:`${this.computedViewHeight}rpx`,
						width:`${this.computedViewWidth}px`,
						height:`${this.computedViewHeight}px`,
					}
				}
			},
			
			// computedMapContViewStyle(){
			
			// 	return {
			// 		width:`${this.computedMapContViewWidth}rpx`,
			// 		height:`${this.computedMapContViewHeight}rpx`,
			// 	}	
				
			// },
			computedMapContViewStyle:{
				get:function(){
					return {
						// width:`${this.computedMapContViewWidth}rpx`,
						// height:`${this.computedMapContViewHeight}rpx`,
						width:`${this.computedMapContViewWidth}px`,
						height:`${this.computedMapContViewHeight}px`,
					}
				}
			},
			
			computedMapContViewWidth:{
				get:function(){
					
					return this.computedViewWidth + this.rfViewBufSize
				}
			},
			
			computedMapContViewHeight:{
				get:function(){
					return this.computedViewHeight + this.rfViewBufSize
				}
			},
			
			computedViewWidth:{
				get:function(){
					return this.phoneWidth!=""? this.phoneWidth: 750
					// return 750
				}
			},
			
			computedViewHeight:{
				get:function(){

					return this.phoneHeight!=""? this.phoneHeight: this.computedViewWidth
					// return 750
				}
			}
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
			 
			 // console.log(`debug-olzsmap`, this.$refs[this.rfMapContElem])
			 
			 
			 // setTimeout(
			 // ()=>{
				 
			 // },
			 // 500
			 // )
			 

			 
			 
			 
			 let _this = this;
			 
			 function moveViewToCenter(){
				
				var scroll_top = (_this.computedMapContViewHeight- _this.computedViewHeight) / 2
				var scroll_left = (_this.computedMapContViewWidth - _this.computedViewWidth ) / 2
				
				_this.$refs[_this.rfMapContElem].$el.scrollTo(scroll_left, scroll_top)
				
				// console.log("debug-zsolmap ", _this.$refs[_this.rfMapContElem])
			 }
			 
			
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					_this.phoneWidth = res.windowWidth
					

					moveViewToCenter()
					console.log("debug-zsolmap ", `width:${res.windowWidth} , height: ${res.windowHeight}`)
				},
				fail(e) {
					console.log("高度获取失败：",e)
				}
			});
			
		},
		created(){
		
			// 计算屏幕高度 ，宽度
	
			
			this.getShpDate()
			
		},
	};
	// import Draw from "ol/interaction/Draw.js";
	// new Draw()
	// import Text from "ol/format/TextFeature.js";
	// import CircleStyle from "ol/style/Circle.js"
	
	// import { openFeatureSelection, closeFeatureSelection } from './interactions/featureSelection.js';
	// import { createVectorLayerFromURL } from './helpers/layers.js';
	// import { openDrawInteraction, closeDrawInteraction } from './drawer';
</script>



<script module="ol" lang="renderjs"> 

	import 'ol/ol.css';
	
	
	import Map from 'ol/Map';
	import View from 'ol/View';
	import {
		ImageWMS,
		OSM,
		Vector as VectorSource,
		TileWMS,
		XYZ,
	} from 'ol/source';
	import {
		Tile as TileLayer,
		Vector as VectorLayer,
		Image as ImageLayer
	} from 'ol/layer';
	import {
		Style as style,
		Circle as circle,
		Fill as fill,
		Stroke,
		Icon,
		Text,
		Shape
	} from 'ol/style';
	import CircleStyle from "ol/style/Circle.js";
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
	// import Text from "ol/format/TextFeature.js";
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
	import { createDrawer } from "./drawer/Drawer.js"
	import { openFeatureSelection, closeFeatureSelection } from './interactions/featureSelection.js';
	import {makePolygonDrawStyleFunc} from "./drawer/style.js"
	import { importAdminLayer } from './locations/index.js';
	
	import { computeCenter,computeResolutionByExtent,computeResolution } from './helpers/geo.js';
	import { createVectorLayerFromURL } from './helpers/layers.js';
	import { openDrawInteraction, closeDrawInteraction } from './drawer';
	// import videoconference from "@/components/video_conference/video_conference.vue";

	var measureTooltipElement = null;
	var measureTooltip = null;
	var helpTooltipElement = null
	var helpTooltip = null;
	var mapMouseMove = null;
	var feature = null;
	
	
	// zs features
	// var gDrawInta = null;
	// var gDrawPointInta = null;
	
	// function addDrawInteraction(map){
	
	// 	// if(gDrawInta!=null)return 
	// 	// gDrawInta = new Draw(
		
	// 	var draw_init_options = {}
		
		
	// 	gDrawInta = createDrawer(
	// 		"base",
	// 		{
	// 			source:recvDrawVecSrc,
	// 			style:makePolygonDrawStyleFunc(),
	// 			// style:new style(
	// 			// 	{
	// 			// 		fill: new fill({color:"#aa000022"}),
	// 			// 		stroke: new Stroke({color:"blue", width:2}),
	// 			// 		image: new CircleStyle(
	// 			// 			{
	// 			// 				radius:5,
	// 			// 				stroke:new Stroke({color:"red"})
	// 			// 			}
	// 			// 		)
	// 			// 		// "fill-color":"red",
	// 			// 		// "stroke-color":"blue",
	// 			// 		// "stroke-width":2,
	// 			// 		// shape : new Shape(
	// 			// 		// 	{
	// 			// 		// 		stroke: new Stroke({color:"yellow"})
	// 			// 		// 	}
	// 			// 		// )
	// 			// 	}
	// 			// ),

	// 			type:"Polygon"
				
	// 		}
	// 	)	
		
	// 	gDrawInta.on("drawstart", (evt)=>{console.log("debug-ol-draw ", "draw start", evt)})
	// 	gDrawInta.on("drawend", 
	// 		(evt)=>{
	// 			console.log("debug-ol-draw ", "draw end")
	// 		} 
	// 	)
	// 	gDrawInta.on("drawabort", (evt)=>{console.log("debug-ol-draw ", "draw abort")})
	// 	gDrawInta.on("change:active", (evt)=>{console.log("debug-ol-draw ", "draw change")})
		

	// 	// gDrawPointInta = new Draw(
	// 	// {
	// 	// 	source:source,
	// 	// 	style:new style(
	// 	// 		{
	// 	// 			image: new CircleStyle(
	// 	// 				{
	// 	// 					radius:1,
	// 	// 					stroke:new Stroke({color:"#ffffffa"})
	// 	// 				}
	// 	// 			)
	// 	// 		}	
	// 	// 	),
	// 	// 	type:"Point"
	// 	// })
		
		
	// 	map.addInteraction(gDrawInta)
	// 	// map.addInteraction(gDrawPointInta)
	// 	// console.log("debug-ol ", "boot draw inta")
	// }
	
	// function removeDrawInteraction(map) {
	// 	map.removeInteraction(gDrawInta)
	// 	// map.removeInteraction(gDrawPointInta)
	// }
	
	export default {
		// components:{videoconference},
		props:{
			hideMapImg:{
				type:Boolean
			},
			afterInit:{
				type:Function
			}
		},
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
				// draw_source: new VectorSource(),
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
				watchPositionTime: 1000, //动态改变定位间隔时间,
				
				
				rfScreenSize:null
			}
		},
		
		created(){
			
				let _this = this
				
				uni.getSystemInfo({
					success(res) {
						// _this.phoneHeight = res.windowHeight;
						// _this.phoneWidth = res.windowWidth
						_this.rfScreenSize = [res.windowWidth, res.windowHeight]
						// _this.testViewZoom()
					},
					fail(e) {
						console.log("设备屏幕尺寸获取失败：",e)
					}
				}
				)
				
			
			this.urfMapLayers = []
			this.urfLayerSeqCount=0
			
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
				// script.src = 'https://cdn.bootcdn.net/ajax/libs/openlayers/4.6.5/ol.js'
				script.src = '/static/ol.js'
				script.onload = this.initAmap.bind(this)
				document.head.appendChild(script)
			}
			


		},
		destroyed(){
			console.log("destroyed")
		},
		beforeDestroy() {

			closeFeatureSelection()
			closeDrawInteraction()
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
			 // qj token
			 // var token ="da4af7d03246cb5e7a32655e023f54aa";
			  // zs token
			 var token = "5552493db63e98f85ae582b3429040c0"
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
				
				//地图源的瓦片图层
				// 设置显示地图的视图
				var layer_array = [
						tileLayer, 
						tileMark
						]
				// zs-add
				if(this.hideMapImg)
				{
					
					layer_array = []				
				}

				this.map = new Map({
					// 设置地图图层
					target: "olMap", // DOM容器
					//越往左，图层越在底层
					layers: layer_array, 
					
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
			
				// zs add draw layer temp
				this.map.addLayer(recvDrawVecLyr)
				
				// this.loadGeoserverMap()
				this.setPoint()

				
				try{
					this.initGPSLocation()
				}catch(e){
					//TODO handle the exception
					console.log("debug-olmap error", e)
				}


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
				this.VectorSource = new VectorSource({
					features: [] // 值是一个feature数组   source:features  1:N
				});
				// 创建layer对象
				this.VectorLayer = new VectorLayer({
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
				
				this.initEvent()
				this.initViewCenterCoord()
				
				this.initInteraction()
				
				
				// zs-adding
				if(this.afterInit)
				{
					this.afterInit()
				}
				
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
				console.log("debug-olmap setStyle")
				this.feature.setStyle(this.stylepoint)
				let source = new VectorSource()
				source.addFeature(this.feature)
				let layer = new VectorLayer()
				layer.setSource(source)
				this.map.addLayer(layer)
			},
			
			
			initInteraction(){
				
				// addDrawInteraction(this.map)
				var _this = this
				var sel = openFeatureSelection(this.map, 
								// ()=>{
									
								// },
								"hover",
								// "altclick",
								// "singleclick"
								// "click",
								{
									layers:(lyr)=>{
										return true
									}
								}
								)
					
					sel.on("select", 
						function(evt){
							
							var features = evt.target.getFeatures().getArray()
							// console.log("debug-zsolmap select interation", features)
							// var geom = features[0].getGeometry()
							// var extent = geom.getExtent()
							
							// _this.locateViewportTo(
							// 	computeCenter(extent),
							// 	{
							// 		extent:extent
							// 	}
							// )
							
							// geom.
						}
					)
					
				// console.log("debug-zsolmap add select")
					
					
				const recvDrawVecSrc = new VectorSource({
					wrapX: false
				});
				
				const recvDrawVecLyr = new VectorLayer({
					source: recvDrawVecSrc,
					style:new style(
						{
							file: new fill({color:"#ffffffa"}),
							stroke: new Stroke({color:"pink", width:2}),
							image:new CircleStyle(
										{
											radius:5,
											stroke:new Stroke({color:"yellow"})
										}
							),
						}
					)
				});
				var drawInteraction = openDrawInteraction(
										this.map, 
										"default", 
										recvDrawVecLyr,
										{"type":"base", "vectorType":"Polygon"}
										)
				
			},
			
			initGPSLocation(){
				
				
				var that = this
				// has an effect on app side 
				// if not , happen an error
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
				
			}
			,
			
			initEvent(){
				
				var _this = this
				var total = 5
							
				var center_coord = [107.324739,24.033756999999998]
				var mpview = _this.map.getView()
				// this.map.on("dblclick", 
				// 	(evt)=>{
				// 		// console.log("debug-zsolmap ", evt)
				// 		// console.log("debug-zsolmap ", mpview.getCenter(), evt["coordinate"])
				// 	}
				// )
				this.map.on("click", 
					(evt)=>{
						// console.log("debug-zsolmap ", evt)
						// console.log(`debug-zsolmap map clicked \n`,
						// `screen center coord ${mpview.getCenter()}\n`,
						// `click coord ${evt["coordinate"]}\n`, 
						// `cur zoom ${mpview.getZoom()}\n`,
						// `cur resol ${mpview.getResolution()}\n`,
						// '======================================='
						// )
					}
				)
				
				uni.$on(
					"locateMapViewportTo",
					(evData)=>{
						_this.locateViewportTo(evData["geoCoord"], {extent:evData["geoExtent"]})
					}
				)
				
				uni.$on(
					"showMapLayer",
					(evData)=>{
						_this.setLayerVisibleById(evData["id"],evData["enabled"])
						// _this.setLayerVisibleById(evData["seqid"],evData["enabled"])
					}
				)
			},
			
			initViewCenterCoord(){
				
				// var mpview = this.map.getView()
				// var center_coord = [107.324739,24.033756999999998]
				// mpview.centerOn(
				// 	[107.324739,24.033756999999998],
				// 	[512,512],
				// 	[256,256]
				// )
				
				// mpview.adjustZoom(0.5, center_coord)
				
				this.testViewZoom()
				
				
				// this.testImportGeoLocation()
			},
			
			testImportGeoLocation(){
				
				let _this = this
				// setTimeout(()=>{
				// 	this.testViewZoom()}, 
				// 	1000
				// )
				
				
				
				// uni.getSystemInfo({
				// 	success(res) {
				// 		// _this.phoneHeight = res.windowHeight;
				// 		// _this.phoneWidth = res.windowWidth
				// 		_this.rfScreenSize = [res.windowWidth, res.windowHeight]
				// 		_this.testViewZoom()
				// 	},
				// 	fail(e) {
				// 		console.log("设备屏幕尺寸获取失败：",e)
				// 	}
				// }
				// )
				
				// this.testViewZoom()
				
				
				var import_prom = importAdminLayer("city")
				
				import_prom.then(
				(result)=>{
					// console.log("debug-zsolmap import layer", result)
					// _this.map.addLayer(result)
					_this.addLayer(result, "city", "default")
					// _this.map.render()
				})
				
				// var lyr_item = {
				// 	"name":"city", "url":"/static/city.json", "borderColor":"red",
				// 	"dataSourceType":"vector"
				// }
				// _this.emitEvent("createMapLayer", 
				// 				lyr_item,
				// 			)
				
				// _this.$mapStore.commit("addLayer", lyr_item)
				
				import_prom = importAdminLayer("county")
				
				import_prom.then(
				(result)=>{
					// _this.map.addLayer(result)
					// _this.addLayer(result, "county", "default")
					// _this.map.render()
					_this.addLayer(result, "county", "default")
				})
				
				// import by url
				// lyr_item = {
				// 	"name":"county", "url":"/static/county.json", "borderColor":"blue",
				// 	"dataSourceType":"vector"
				// }
				// // _this.emitEvent("createMapLayer", 
				// // 				lyr_item
				// // 			)
				// _this.$mapStore.commit("addLayer", lyr_item)
				// const root_url = "/static/map/locations/nations/china"
				// var lyr = createVectorLayerFromURL(
				// 	root_url + "/广西壮族自治区-县-test.json", 
				// 	{"geomStyle":{"color":"cyan", "width":"1px"}}
				// )
				// _this.map.addLayer(lyr)
				// _this.map.render()
				
			},
			
			locateViewportTo(coord, opts){
				
				opts = opts || {}
				var mode = opts["mode"] || "full_extent" 
				// geo extent
				var extent = opts["extent"] || null
				if(mode=="full_extent")
				{
					if(!extent)
					{
						var msg = `attemp to nav location to coordinate ${coord} on mode '${mode}', but 'extent' param not given`
						throw new Error(msg)
						// console.log(msg)
					}
				}
			
				// var extent = geo_extent
				
				var _this = this
							
				// var center_coord = computeCenter(extent)
				var center_coord = coord
				
				var zoom_lv = 9
				var mpview = _this.map.getView()
				// mpview.setZoom(9.2)
				
				// var bottom_height_mp = mpview.getResolution()*100
				// center_coord[1] = center_coord[1] - bottom_height_mp
				
				var view_size = [1100,1000]
				if(this.rfScreenSize){
					view_size = this.rfScreenSize
				}
				view_size = [0,0]
				var resol;
				
				
				// resol = computeResolution(this.rfScreenSize[0], Math.abs(extent[2]- extent[0]) )
				resol = computeResolutionByExtent(extent, this.rfScreenSize, "longer")
				
				// var resol_scale = resol*1.5
				var resol_scale = resol*2.4
				// var lat_offset = 500 * resol
				// var lat_offset = (this.rfScreenSize[1]/2)  * resol 
				// 
				// to display the feature geometry on user visible area 
				// so popuping bottom panel height was considered, 
				// map viewport center posistion was moved down 
				 // according distance of the feature geometry
				 // half geographical height
				
				var lat_offset = Math.abs( (extent[1] - extent[3]) )*0.6
				
				// extent[1] = extent[1] - lat_offset
				// extent[3] = extent[3] - lat_offset
				center_coord[1] = center_coord[1] - lat_offset
				// var resol_delta = resol / mpview.getResolution()
				// mpview.setResolution(resol + resol*0.2)
				mpview.setResolution(resol_scale)
				// mpview.adjustResolution(resol_delta)
				
				console.log("debug-zsolmap ", 
				`extent ${extent}\n`,
				`coord ${center_coord}`
				)
				// var center_view_pos_pix = [view_size[0]/2, view_size[1]/2]
				// mpview.centerOn(
				// 	center_coord,
				// 	// [512,512],
				// 	view_size,
				// 	center_view_pos_pix
				// )
				mpview.centerOn(
					center_coord,
					// [512,512],
					[0,0],
					[0,0]
				)
					
			},
			
			testViewZoom(){
				
				// 河池
				// coord 107.89729588504589,24.663186754658177
				// zoom 9
				// 河池 extent
				// var extent = [106.568412,25.613664999999997,109.153964,23.557816]
				var extent = [108,25.613664999999997,109.153964,23.557816]
				var _this = this
				var total = 5
			
				var center_coord = computeCenter(extent)
				
				this.locateViewportTo(center_coord, {extent: extent})
				
				var mpview= this.map.getView()
				function _loop() {
					
					mpview.adjustZoom(0.5, center_coord)
					console.log("debug-zsolmap",` \
					zoom: ${mpview.getZoom()}, \
					resol: ${mpview.getResolution()}\
					center: ${mpview.getCenter()}`
					)
					if(total>0){
						total--
						setTimeout(()=>{_loop()}, 2000);
					}
				}
				
				// setTimeout(()=>{_loop()}, 4000);
				// _loop()
				
			},
			
			addLayer(lyr, name, group = "default", scope = "default"){
				
				// this.urfMapLayers.push(lyr)
				// var existedLyrCount = this.map.getAllLayers().length
				var lyrSeqid = this.urfLayerSeqCount
				this.urfLayerSeqCount++
				var mpSrc = lyr.getSource()
	
				var mpLyrStyle = null
				
				var dataUrl = ""
				
				// var lyrKls = lyr.prototype.constructor
				var lyrKlsName = lyr.__proto__.constructor["name"]
				var dataSrcType = "image"
				
				if(lyrKlsName=="VectorLayer" ||　lyrKlsName=="VectorTiledLayer")
				{
					dataSrcType = "vector"
				}

				// console.log("debug-zsolmap addlayer ", lyrKls, lyrKls["name"])
				try{
					dataUrl = mpSrc.getUrl()
				}catch(e){
					//TODO handle the exception
				}
				
				try{
					mpLyrStyle = lyr.getStyle()
				}catch(e){
					//TODO handle the exception
				}
				
				// var geomStyle = null
				// var geomStrokeStyle = null
				// var geomColor = "pink"
				
				// if(mpLyrStyle)
				// {
				// 	// console.log("debug-zsolmap mpLyrStyle", mpLyrStyle)
				// 	geomStrokeStyle = mpLyrStyle.getStroke()
				// 	// if( geomStrokeStyle ){
						
				// 	// }
				// 	geomColor = geomStrokeStyle.getColor() || geomColor
				// }
				
				// var defaultColor = "pink"
				
				// only interface createVectorLayer function was used to
				// create a layer, leading to the 'baseStyleEx' variable 
				// initialized
				var lyrBaseStyle = lyr.get("baseStyleEx") || {}
				var lyrItemExt = {
					"name":name, 
					"scope":scope, 
					"group":group,
					"url":dataUrl,
					"borderColor": lyrBaseStyle["strokeColor"]?lyrBaseStyle["strokeColor"]:"black",
					"fillColor": lyrBaseStyle["fillColor"]?lyrBaseStyle["fillColor"]:"black",
					"dataSourceType":dataSrcType,
					"seqid":lyrSeqid,
					"visible":true,
					}
				
				lyr.set("seqidEx", lyrSeqid)
				// var targetLyrGroup = existedLyrGroupArr.filter((x)=>{return x.get("name")==group })
				
				// var exitedLyrsInGroup = []
				// if(targetLyrGroup.length<1)
				// {
				// 	targetLyrGroup = new LayerGroup({properties:{"name":group}})
				// 	this.map.addLayerGroup(targetLyrGroup)
				// 	exitedLyrsInGroup = targetLyrGroup.getLayers()
				// }
				
				// targetLyrGroup.setLayers(exitedLyrsInGroup.concat([lyr]))
				// targetLyrGroup.addLayer(lyr)
				this.map.addLayer(lyr)
				
				// this.map.render()
				
				// this.$mapStore.commit(
				
				// this.$store.state.map.commit(
				this.$store.commit(
				"addLayer", 
				lyrItemExt
				)
				
			},
			
			setLayerVisibleById(id, enabled = true){
				
				// console.log("debug-zsolmap setLayerVisibleById ", id, enabled)
				var lyrs = this.map.getAllLayers()
				
				var lyrs_fil = lyrs.filter((x)=>{console.log("debug-zsolmap setLayerVisibleById ", x.get("seqidEx")); return x.get("seqidEx")==id})
				
				// console.log("debug-zsolmap setLayerVisible ", lyrs_fil)
				
				if(lyrs_fil.length>0)
				{
					
					lyrs_fil[0].setVisible(enabled)
					
					// this.$mapStore.commit(
					// this.$store.state.map.commit(
					this.$store.commit(
						"setLayerPropsById",
						// id,
						{"id":id, 
						"props":{"visible": enabled}
						}
					)
					// this.map.render()
				}
				// lyr.setVisible(enabled)
			},
			
			emitEvent(name, data){
				
				if(name=="createMapLayer")
				{
					
					uni.$emit(name, data)
				}
			}
		},
	}
</script>

