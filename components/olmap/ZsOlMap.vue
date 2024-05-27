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
			<Menu
			:items = "rfmenuItems"
			:visible = "rfmenuVisible"
			:position = "rfmenuPos"
			@clickItem="onMenuItemClicked"
			>
				<!-- style="position:absolute;top:0px" -->
			</Menu>
			
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
	
	import Menu from './interactions/Menu.vue';
	
	export default {
		
		name:"ZsOlMap",
		computed: mapState(['hasLogin', 'uerInfo']),
		components:{
			Menu
		},
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
				
				rfMapContElem:"mapContainer",
				
				rfmenuItems:[{text:"copy", key:"copy"},{"text":"paste","key":"paste"}],
				rfmenuPos:[0,0],
				rfmenuVisible:false
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
			
			
			getViewScrollOffset(){
				
				// _this.$refs[_this.rfMapContElem].$el.scrollTo(scroll_left, scroll_top)
				
				var el = this.$refs[this.rfMapContElem].$el
				return [el.scrollLeft, el.scrollTop]
			},
			
			showMenuUni(evt){
				
				this.urfcurMapEvent = evt
				
				var pixPos = evt.pixel
				
				// this.rfmenuPos = [pixPos[0],pixPos[1]]
				// var scrollOffset = this.getViewScrollOffset()
				// this.rfmenuPos = [
				// 	pixPos[0] - scrollOffset[0],
				// 	pixPos[1] - scrollOffset[1]
				// ]
				this.setMenuPos(evt.pixel)
				
				this.rfmenuVisible=true
				
				console.log("debug-zsolmap menu show ", pixPos, this.rfmenuPos)
			},
			
			hideMenuUni(evt){
				this.rfmenuVisible=false
			},
			
			setMenuPos(pos){
				
				var scrollOffset = this.getViewScrollOffset()
				this.rfmenuPos = [
					pos[0] - scrollOffset[0],
					pos[1] - scrollOffset[1]
				]
			},
			
			onMenuItemClicked(evt){
				
				var key = evt["key"]
				
				if(key=="copy"){
					
				}
				else if(key=="paste"){
					
				}
				else if(key=="analy"){
					
				}
				
				// uni.$emit("map:operation:trigger", {opFunc:key, ctx:evt, origin:evt})
				uni.$emit("map:operation:trigger", {name:key, origin:evt, sender:"OperationMenu"})
			},
			
			onMousedown(){
				console.log("debug-zsolmap mouse down", )
			},
			onLongpress(){
				
				console.log("debug-zsolmap long press", )
			}
			
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
				
				var scroll_top = (_this.computedMapContViewHeight - _this.computedViewHeight) / 2
				var scroll_left = (_this.computedMapContViewWidth - _this.computedViewWidth ) / 2
				
				_this.$refs[_this.rfMapContElem].$el.scrollTo(scroll_left, scroll_top)
				
				// _this.urfviewPosOffset= [scroll_left, scroll_top]
				console.log("debug-zsolmap scroll ", scroll_left, scroll_top)
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
		
	
			this.getShpDate()
			
			// record the scroll offset
			this.urfviewScrollOffset = [0,0]
			this.urfcurMapEvent = null
			uni.$on("map:menu:show", this.showMenuUni)
			uni.$on("map:menu:hide", this.hideMenuUni)
			
			
		},
	};
	// import Draw from "ol/interaction/Draw.js";
	// new Draw()
	// import Text from "ol/format/TextFeature.js";
	// import CircleStyle from "ol/style/Circle.js"
	
	// import { openFeatureSelection, closeFeatureSelection } from './interactions/featureSelection.js';
	// import { createVectorLayerFromURL } from './helpers/layers.js';
	// import { openDrawInteraction, closeDrawInteraction } from './drawer';
	// import Projection from "ol/proj/Projection.js"
	// import * as olProj from "ol/proj"
	import {getPointResolution} from "ol/proj"
	import {getArea,getLength} from "ol/sphere.js"
	// import {intersects} from "ol/extent.js"
	// import { bufferExtent } from './helpers/geo.js';
	// import {Polygon} from "ol/geom"
	// import Units from "ol/proj/Units.js"
	
	// import default as ProjUnits from "ol/proj/Units.js"

</script>



<script module="ol" lang="renderjs"> 

	import 'ol/ol.css';
	
	import "./extends";
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
	// import {get} from "ol/proj/projections.js";
	import Projection from "ol/proj/Projection.js"
	import * as olProj from "ol/proj"
	import Units from "ol/proj/Units.js";
	
	import setting from '@/setting.js';
	import { createDrawer } from "./drawer/Drawer.js"
	import { openFeatureSelection, closeFeatureSelection } from './interactions/featureSelection.js';
	import {makePolygonDrawStyleFunc} from "./drawer/style.js"
	import { importAdminLayer } from './locations/index.js';
	
	import { computeCenter,computeResolutionByExtent,computeResolution } from './helpers/geo.js';
	import { createVectorLayerFromURL, addCoordsToLayer, addFeatures } from './helpers/layers.js';
	import { openDrawInteraction, closeDrawInteraction } from './drawer';
	import { bufferExtent , extentToContour} from './helpers/geo.js';
	import {intersects} from "ol/extent.js"
	import {mapState} from "vuex";
	import {VERSION} from "ol"
	import {createActionTrigger} from "@/utils/actions.js"
	console.log("debug-zsolmap openlayer version ", VERSION)
	// import videoconference from "@/components/video_conference/video_conference.vue";

	var measureTooltipElement = null;
	var measureTooltip = null;
	var helpTooltipElement = null
	var helpTooltip = null;
	var mapMouseMove = null;
	var feature = null;

	
	export default {
		// components:{videoconference},
		props:{
			hideMapImg:{
				type:Boolean
			},
			afterInit:{
				type:Function
			},
			
			usedMode:{
				type:String,
				default:"view"
			},
			featureSelectionOn:{
				type:Boolean
			},
			
			drawTheme:{
				type:String,
				default:"base"
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
				
				
				rfscreenSize:null,
				rfusedMode:this.usedMode,
				rfDrawTheme:this.drawTheme,
				rffeatSelOn:this.featureSelectionOn,
				
				// ...mapState(
				// 	"modules/map", 
				// 	{rfusedmode:"usedMode"},
				// )
			}
		},
		
		created(){
			
				let _this = this
				
				uni.getSystemInfo({
					success(res) {
						// _this.phoneHeight = res.windowHeight;
						// _this.phoneWidth = res.windowWidth
						_this.rfscreenSize = [res.windowWidth, res.windowHeight]
						// _this.testViewZoom()
					},
					fail(e) {
						console.log("设备屏幕尺寸获取失败：",e)
					}
				}
				)
				
			
			this.urfMapLayers = []
			this.urfLayerSeqCount=0
			this.urfclickDown = false
			this.urfclickStartTime = -1
			this.urfclickPos = null
			
			this.featSelector = null
			// this.urflongPressMonitor = createActionTrigger("LongTimeMonitor", this.onLongPressed, 3000)
			// this.urflongPressMonitor.addListener("rejected", ()=>{console.log("debug-zsolmap long time monitor")})
			
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

			closeFeatureSelection(this.map)
			closeDrawInteraction(this.map)
		},
		methods: {
			
			// onLongPressed(args){
				
			// 	if(!this.urfclickdown){
			// 		console.log("debug-zsolmap long press ", args)
					
			// 		uni.$emit("map:menu:show", {pixel:args, "subject":"" } )
			// 	}
				
			// },
			onTouchEnd(evt){
				
				this.handleLongPress(evt)
				
			},
			
			handleLongPress(evt){
				
				const delta = Date.now() - this.urfclickStartTime
				const timeMin = 1500
				const timeMax = 3000
				console.log("debug-zsolmap touchend ", delta)
				if(
				delta>=timeMin 
				&& delta<=timeMax
				){
					uni.$emit("map:menu:show", {pixel:evt.pixel || [evt.pageX, evt.pageY], "subject":"" } )
				}
			},
			
			handleMenuPopup(evt){
				
				
				var feat = this.featSelector.getFeatures()[0]
				var subject = "map"
				if( feat ){
					subject = "feature"
				}
				var pixPos = evt.pixel || [evt.pageX, evt.pageY]
				
				uni.$emit("map:menu:show", 
				{
					pixel:pixPos, 
					posistion:pixPos, 
					"subject":subject ,
				} ,
				)
			},
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
				
				// temp add a test vector layer for test
				const tempVector = new VectorLayer({
					source: new VectorSource({
						wrapX:true
					}),
					style:new style(
						{
							stroke:new Stroke({
								color:"red",
								width:"1px"
							})
						}
					)
				})
				this.map.addLayer(tempVector)
				
				// zs-adding
				this.initEvent()
				this.initViewCenterCoord()
				
				// zs-adding
				if(this.afterInit)
				{
					this.afterInit()
				}
				
				
				this.initInteraction()
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
				// console.log("debug-olmap setStyle")
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
				if(this.rffeatSelOn || true){
				
					var sel = openFeatureSelection(this.map,
								
									// "hover",
									// "altclick",
									"singleclick",
									// "click",
									{
										// layers:(lyr)=>{
										// 	return true
										// }
									}
									)
						
						sel.on("select", 
							function(evt){
								
								var features = evt.target.getFeatures().getArray()
								// console.log("debug-zsolmap select interation",
								// '\n Select Event',
								// evt)
								
								var feat = features[0]
								// var feat = evt.selected
								// if(!feat)return
								
								var featName = feat.getProperties()["name"]
								
								// var style = sel.getLayer(feat).getStyle()
								// if(typeof style =='function'){
								// 	style = style(feat)
								// }
								// var textStyle = style.getText()
								
								// var selStyle = sel.getStyle()
								// // textStyle.setText("nihao")
								// selStyle.setText(textStyle)
								
								console.log("debug-zsolmap select interation coliided", featName, evt)
								// var geom = features[0].getGeometry()
								// var extent = geom.getExtent()
								
								// _this.locateViewportTo(
								// 	computeCenter(extent),
								// 	{
								// 		extent:extent
								// 	}
								// )
							}
						)	
						
					this.featSelector = sel
					
				}
				
				

					
				// console.log("debug-zsolmap add select")
					
				// const recvDrawVecSrc = new VectorSource({
				// 	wrapX: false
				// });
				
				// const recvDrawVecLyr = new VectorLayer({
				// 	source: recvDrawVecSrc,
				// 	style:new style(
				// 		{
				// 			file: new fill({color:"#ffffffa"}),
				// 			stroke: new Stroke({color:"pink", width:2}),
				// 			image:new CircleStyle(
				// 						{
				// 							radius:5,
				// 							stroke:new Stroke({color:"yellow"})
				// 						}
				// 			),
				// 		}
				// 	)
				// });
				// var drawInteraction = openDrawInteraction(
				// 						this.map, 
				// 						"default", 
				// 						recvDrawVecLyr,
				// 						{"type":"base", "vectorType":"Polygon"}
				// 						)
				// zs add draw layer temp
				// this.map.addLayer(recvDrawVecLyr)
				this.setUsedMode(this.rfusedMode)
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
				
			},
			
			initEventTemp(){
				// this.map.on("click",
							// 	(evt)=>{
							// 		this.map.xforEachFeatureAtPixel(evt.pixel, 
							// 			function(feat,layer){
											
							// 				// console.log("debug-zsolmap xforEachFeatureAtPixel",)
											
							// 				var featName = feat.getProperties()["name"]
							// 				console.log("debug-zsolmap xforEachFeatureAtPixel coliided", featName)
							// 				// if(collided){
							// 				// 	console.log("debug-zsolmap forEachFeatureAtPixel coliided", featName)
							// 				// }
							// 				// else
							// 				// {
							// 				// 	console.log("debug-zsolmap forEachFeatureAtPixel no collided", featName)
							// 				// }
							// 			}
							// 		)
							// 	}
							// )
							
				// 			this.map.on("click", 
				// 				(evt)=>{
									
				// 					var feats = this.map.getFeaturesAtPixel(evt.pixel)
									
				// 					var pixelPos = evt.pixel
				// 					var geomPos = evt.coordinate
				// 					const pixOffset = 0
				// 					// var feats = this.map.getFeaturesAtPixel(
									
				// 					// [pixelPos[0] + pixOffset, pixelPos[1] + pixOffset ]
				// 					// )
									
				// 					var geomPosInter = this.map.getCoordinateFromPixelInternal(pixelPos)
				// 					var diffGeomPos = [geomPosInter[0] - geomPos[0], geomPosInter[1] - geomPos[1]]
				// 					// console.log("debug-zsolmap forEachFeatureAtPixel filter", geomPosInter, geomPos, diffGeomPos, pixelPos, feats)
				// 					// try to use geometry coordinate
				// 					var layers = this.map.getAllLayers()
				// 					var lyrTotal = layers.length
				// 					var lastLyr = layers[lyrTotal-2]
				// 					var lastLyrSrc = lastLyr.getSource()
				// 					var extentSize = 0.01
				// 					const curResol = this.map.getView().getResolution()
				// 					const distBuf = curResol * 5
				// 					var extentBuf = [geomPos[0],geomPos[1],geomPos[0],geomPos[1]]
				// 					extentBuf = bufferExtent(extentBuf, distBuf)
									
				// 					var tempVecLayer = layers[lyrTotal-3]
				// 					addCoordsToLayer(extentToContour(extentBuf), tempVecLayer, "Polygon")
				// 					// this.map.render()
				// 					// lastLyr.setVisible(!lastLyr.getVisible())
				// 					lastLyrSrc.forEachFeatureIntersectingExtent(
				// 						extentBuf,
				// 						(ev)=>{
				// 							const geom = ev.getGeometry()
				// 							// console.log("debug-zsolmap forEachFeatureAtPixel filter", ev)
				// 							var  collided = true 
				// 							collided = intersects(extentBuf, geom.getExtent())
											
				// 							var geom_sim = geom.getSimplifiedGeometryInternal(curResol*20)
				// 							// addCoordsToLayer(geom_sim.getCoordinates()[0], tempVecLayer, "Polygon")
											
				// 							// geom_sim.getCoordinates()[0][0]
				// 							var geom_sim_extent = geom_sim.getExtent()
				// 							var geom_extent = geom.getExtent()
				// 							// console.log("debug-zsolmap ", geom_extent, geom_sim_extent,
				// 							// [geom_sim_extent[0]-geom_extent[0],geom_sim_extent[1]-geom_extent[1],
				// 							// geom_sim_extent[2]-geom_extent[2],geom_sim_extent[3]-geom_extent[3],]
				// 							// )
				// 							// addCoordsToLayer(extentToContour(geom_sim_extent), tempVecLayer, "Polygon")
				// 							// var new_feat = new Feature()
				// 							// new_feat.setGeometry(feat)
				// 							// feat = new_feat
				// 							// addFeatures(geom_sim,  tempVecLayer)
											
				// 							// addCoordsToLayer(extentToContour(lastLyr.getExtent()), tempVecLayer, "Polygon")
											
											
				// 							// collided = intersects(extentBuf, geom_sim.getExtent())
				// 							var featName = ev.getProperties()["name"]
				// 							if(collided){
				// 								console.log("debug-zsolmap forEachFeatureAtPixel coliided", featName)
				// 							}
				// 							else
				// 							{
				// 								console.log("debug-zsolmap forEachFeatureAtPixel no collided", featName)
				// 							}
				// 						}
				// 						)
									
									
				// 					// var feat = lastLyrSrc.getFeaturesAtCoordinate(geomPos)
									
				// 					// if(feat){
				// 					// 	console.log("debug-zsolmap forEachFeatureAtPixel filter", feat)
				// 					// }
									
				// 					// user internal implementation
				// 					var layerRenderer = lastLyr.getRenderer()
				// 					var matchedResult = layerRenderer.forEachFeatureAtCoordinate(
				// 					  geomPos,
				// 					  this.map.frameState_,
				// 					  1,
				// 					  (holder, managed, feature, a, b, c)=>{ console.log("debug-zsolmap layer internal renderer forEachFeatureAtCoordinate", feature) },
				// 					  []
				// 					);
				// 				}
				// 			)
			},
			initEvent(){
				
				var _this = this
				var total = 5
							
				var center_coord = [107.324739,24.033756999999998]
				var mpview = _this.map.getView()
				

				
				this.map.on(
					// "CONTEXTMENU",
					"contextmenu",
					// "dblclick", 
					// "click", 
					(evt)=>{
						// console.log("debug-zsolmap onClicked", evt)
						console.log(`debug-zsolmap map clicked \n`,
						`screen center coord ${mpview.getCenter()}\n`,
						`click coord ${evt["coordinate"]}\n`, 
						`click pix ${evt["pixel"]}\n`,
						`cur zoom ${mpview.getZoom()}\n`,
						`cur resol ${mpview.getResolution()}\n`,
						evt,
						
						'======================================='
						)
						evt.originalEvent.preventDefault()
						
						uni.$emit("map:menu:show", evt)
					}
				)
				
				this.map.on(
					"singleclick",
					(evt)=>{
						
						// uni.$emit("map:menu:hide", evt)
						
						// this.urfclickStartTime = Date.now()
						// this.urfclickdown = true
						
						this.onTouchEnd(evt)
				
					}
				)
				
				this.map.on("click", (evt)=>{uni.$emit("map:menu:hide", evt)})
				
				// app
				this.map.getTargetElement().addEventListener(
				"touchstart",
					(evt)=>{
						console.log("debug-zsolmap touchstart ", evt)
						this.urfclickStartTime = Date.now()
						// this.urfclickdown = true
						// this.urflongPressMonitor.update(evt.pixel)
					}
					
				)
				
				// this.map.getTargetElement().addEventListener(
				// "touchend",
				// 	// (evt)=>{
				// 	// 	console.log("debug-zsolmap touchend ")
				// 	// 	// this.urfclickdown = false
				// 	// 	// this.urflongPressMonitor.update(evt.pixel)
				// 	// },
				// 	this.onTouchEnd,
				// )
				
				this.map.getTargetElement().addEventListener(
				"mousedown",
					(evt)=>{
						console.log("debug-zsolmap touchstart ", evt)
						this.urfclickStartTime = Date.now()
						// this.urflongPressMonitor.update([evt.pageX,evt.pageY])
						// this.urfclickdown = true
					}
				)
				
				this.map.getTargetElement().addEventListener(
				"mouseup",
					// (evt)=>{
					// 	console.log("debug-zsolmap touchend ")
					// 	// this.urfclickdown = false
					// 	// this.urflongPressMonitor.update([evt.pageX,evt.pageY])
					// },
					this.onTouchEnd,
				)
				
				// this.map.on("pointdrag", 
				// (evt)=>{
				// 	console.log("debug-zsolmap drag")
				// 	this.urflongPressMonitor.update(evt.pixel)
				// }
				// )
				
				// this.map.getTargetElement().addEventListener(
				// "mouseup",
				// 	(evt)=>{
						
				// 		console.log("debug-zsolmap mouseup ")
						
				// 		this.urflongPressMonitor.update(evt.pixel)
						
				// 	}
				// )
				
				// this.map.getTargetElement().addEventListener(
				// "mousedown",
				// 	(evt)=>{
						
				// 		console.log("debug-zsolmap mousedown ")
						
				// 		this.urflongPressMonitor.update(evt.pixel)
						
				// 	}
				// )
				
				
				// this.map.on(
				// 	"mouseup",
				// 	(evt)=>{
				// 		console.log("debug-zsolmap mouseup ")
				// 	}
				// )
				
				// this.map.getCanvas()
				
				uni.$on(
					"locateMapViewportTo",
					(evData)=>{
						_this.locateViewportTo(evData["geoCoord"], {extent:evData["geoExtent"]})
					}
				)
				
				uni.$on(
					"map:view:locateViewportTo",
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
				
				uni.$on(
					"map:layer:setVisible",
					(evData)=>{
						_this.setLayerVisibleById(evData["id"],evData["enabled"])
						// _this.setLayerVisibleById(evData["seqid"],evData["enabled"])
					}
				)
				
				uni.$on("map::setProps",
					(evData)=>{
						this.onSetProps(evData)
					}
				)
				uni.$on("map:operation:trigger", this.onOperationTriggered)
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
			
			// noused
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
				// 		_this.rfscreenSize = [res.windowWidth, res.windowHeight]
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
				if(this.rfscreenSize){
					view_size = this.rfscreenSize
				}
				view_size = [0,0]
				var resol;
				
				
				// resol = computeResolution(this.rfscreenSize[0], Math.abs(extent[2]- extent[0]) )
				resol = computeResolutionByExtent(extent, this.rfscreenSize, "longer")
				
				// var resol_scale = resol*1.5
				var resol_scale = resol*2.4
				// var lat_offset = 500 * resol
				// var lat_offset = (this.rfscreenSize[1]/2)  * resol 
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
				
				// console.log("debug-zsolmap ", 
				// `extent ${extent}\n`,
				// `coord ${center_coord}`
				// )
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
				this.map.render()
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
			
			
			setUsedMode(val){
				
				// var projObj = new Projection({"code":"EPSG:4236", "units":Units.METERS})
				// olProj.addProjection(projObj)
				// // var pj = olProj.get("EPSG:4508")
				// var firstPt =[104,23]
				// var points = [[firstPt,[105,23],[105,24],[104,24],[104,23] ]]
				// var geom = new Polygon(points)
				// geom.setCoordinates(points)
				// console.log("debug-zsolmap test geom area ",
				// 	// pj,
				// 	geom.getArea(), 
				// 	getArea(geom),
				// 	// projObj.getCode(),
				// 	// projObj,
				// 	// olProj.getPointResolution("EPSG:4508", null , firstPt)
				// 	// olProj.getPointResolution(projObj, 1 , firstPt)
				// 	)
				
				if(val=="edit" || val==true){
					
					var drawIntr = openDrawInteraction(this.map, "default", null, 
									{type:"base",
									drawTheme:this.rfDrawTheme
									},
									)
					
					drawIntr.on("drawend", 
					(evt)=>{
						var feat = evt.feature
						var geom = feat.getGeometry()
						// var geom_cp = geom.clone()
						// geom_cp.transform(
						//  // "EPSG:4236", 
						//  // "EPSG:4508",
						//  new Projection({code:"EPSG:4236", units: Units.DEGREES}),
						//  new Projection({code:"EPSG:4508", units: Units.METERS}),
						//  )
						
						// console.log("debug-zsolmap draw event ", evt, 
						// geom.getArea(), 
						// // geom_cp.getArea(),
						// // getArea(geom, {radius:6731000}),
						// // getArea(geom, {radius:6731000})*1e4,
						// getArea(geom, {radius:1}),
						// // 1e10
						// geom.getCoordinates()[0][0],
						// // geom_cp.getCoordinates(),
						// )
						this.$emit("finishDrawingGeometry")}
					)
					val = "edit"
				}
				else if(val=="view" || val==false){
					
					closeDrawInteraction(this.map, "default")
					
					val = "view"
				}
				
				this.rfusedMode = val
				
			},
			
			setDrawTheme(val){
				
				this.rfDrawTheme = val
				if(this.rfUseMode=="edit"){
					this.setUseMode("view")
					this.setUseMode("edit")
				}
			},
			
			onSetProps(evData){
				
				evData = evData || {}
				var pName,pVal;
				for(pName in evData)
				{
					pVal = evData[pName]

					if(pName=="usedMode")
					{
						this.setUsedMode(pVal)
					}
					if(pName=="drawTheme"){
						this.setDrawTheme(pVal)
					}
				}
				// var pName = evData["name"]
				// var pVal = evData["value"]
				// if(pName=="usedMode")
				// {
				// 	this.setUsedMode(pVal)
				// }
			},
			
			onOperationTriggered(evt){
				
				// var evtName = evt["opFunc"]
				var evtName = evt["name"]
				
				if(evtName=="copy"){
					
				}
				else if(evtName=="paste"){
					
				}
				else if(evtName=="analy"){
					
				}
			},
			
			emitEvent(name, data){
				
				var evtNamePrefix = "map:layer:"
				
				if(name=="createMapLayer")
				{
					
					uni.$emit(name, data)
				}
			}
		},
	}
</script>

