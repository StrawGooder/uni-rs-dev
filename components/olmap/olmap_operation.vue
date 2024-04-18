<template>
	<view class="container">
		<!-- compassangel用于当罗盘角度改变，逻辑层向视图层传递改变角度 -->
		<view 
		    :prop="compassangels" :change:prop="ol.oncompasschanges" 
			:propgeojson="geojson_data" :change:propgeojson="ol.GetGeojson"
			:drawGeojson="drawgeojson_data" :change:drawGeojson="ol.getDrawGeojson" >
		</view>
		<!--监控手机用户的界面大小  -->
		<view id="olMap"
			:style="{height: nowMapIndex ? nintyPercentScreenHeight : seventyPercentScreenHeight,width:'750rpx'}"
			:props="ope_types" :change:props="ol.oper_type_change">
			<view style="position:fixed;z-index: 9998;">
				<button class = "operation-button" @click="show_operation()">
					<i class="iconfont operation-icon icon-gengduo5">	
					</i>
						
				<span class = "operation-text" style = "top: 40%;">
				{{operation_tile}}
				</span>																																																																																																																																										   
				</button>
				<view style="position: fixed;z-index: 9998;" v-if="operation_icon_show">
					<button class = "operation-button" @click='drawFeature("LineString")'>
						<i class="iconfont operation-icon icon-quxianlujing">		
						</i>
						<span class = "operation-text">
						线
						</span>	
					</button>
					<button class = "operation-button" @click='drawFeature("Polygon")'>
						<i class="iconfont operation-icon icon-mianji ">
						</i>
						<span class = "operation-text">
						面
						</span>	
					</button>
					<button class = "operation-button" @click='recordInfor()'>
						<i class="iconfont operation-icon icon-bianji ">
						</i>
						<span class = "operation-text">
						备注
						</span>	
					</button>
					<button class = "operation-button"  @click='drawFeature("Drawclearn")'>
						<i class="iconfont operation-icon icon-quxiao1 ">
						</i>
						<span class = "operation-text">
						取消
						</span>	
					</button>
				</view>
			</view>


		</view>
	</view>
</template>
<!-- 逻辑层 -->
<script>
	import {
		getShpOne,
		get_shooting_point,
		get_all_layerimage,
		getDrawGeojsonDatas
	} from '../../utils/getData.js';
	import setting from '@/setting.js';
	import {
		sourcesFromTileGrid
	} from 'ol/source';
	// import videoconference from '@/components/v'

	export default {
		props: {
			//点击的图斑编号ID
			tbbh: {
				type: String,
				default: 'hello'
			}
		},
		data() {
			return {
				nowMapIndex: true,
				init_longtudes: '',
				init_latitude: '',
				options: {
					// 这里存放准备传递给renderjs的数据
					longitudes: "",
					latitude: ""
				},
				phoneHeight: '', //屏幕高
				phoneWidth: '', //屏幕宽
				measure_value: null,
				draw: null,
				ope_types: '23',
				draw_polygon_area: null,
				compassangel: null, //罗盘角度
				compassangels: null, //罗盘角度
				operation_icon_show: true, //是否显示操作图标
				operation_tile:'收起',
				geojson_data: 23232, //geojson数据
				drawgeojson_data: 23232, //绘制的geojson数据
				lineAngle: -1000, //线段的角度，-1000表示没有选择线段，无法得到角度
				isSame: false, //方向是否相同
				isTurn: 0, //0:不转 1:左转 2:右转 -1：不需要做限定
				distance_value: -1, //定位点和起点的距离 -1初始值 -2 不需要做限定
				deviceOrientation:'y',//设备方向
				photograph_status: {
					distance_status: {
						status: false,
						value: -1
					},
					angle_status: {
						status: false,
						value: -1
					}
				},
				l_featureGeoJson: null, //逻辑层的绘制内容
				l_area: null, //绘制的面积大小
			}
		},
		watch: {

		},
		components: {

		},
		created() {
			// 计算屏幕高度 ，宽度
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					_this.phoneWidth = res.windowWidth
				}
			});
			//获取图斑编号信息
			this.getShpOnes()
			//获取用户绘制的信息
			this.getDrawGeojsonData()
		},

		beforeDestroy(){
			uni.stopCompass();
			uni.stopAccelerometer();

		},
		destroyed(){
			uni.stopCompass();
			uni.stopAccelerometer();
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
		methods: {
			//获取数据库数据
			async getShpOnes() {
				var index = await getShpOne(this.tbbh)
				this.geojson_data = index.data.data
			},

			async getDrawGeojsonData() {
				var data = {
					'tbbh': this.tbbh
				}
				var layerimages = await getDrawGeojsonDatas(data)
				this.drawgeojson_data = layerimages.data.data

			},
			//记录信息
			recordInfor() {
				var recordInforValue = '' //记录的信息
				var drawPolygon = '' //绘制的信息
				var area = ''
				var that = this
				uni.showModal({
					title: '填写备注信息',
					content: '',
					editable: true, //是否显示输入框
					placeholderText: '请输入SN号', //输入框提示内容
					confirmText: '信息上传',
				 cancelText: '取消',

					success: (res) => {
						if (res.confirm) {
							recordInforValue = res.content
							that.postTbInfor(that.tbbh, recordInforValue, that.l_area, that.l_featureGeoJson)

						}
					}
				});

			},
			postTbInfor(tbbh, recordInforValue, area, featureGeoJson) {
				uni.request({
					url: setting.url + '/userTask/postTbInfor',
					method: 'POST',
					sslVerify: false, //真机运行受证书限制
					data: {
						tbbh: tbbh, //图斑编号
						recordInforValue: recordInforValue, //记录的信息
						area: area, //面积
						featureGeoJson: featureGeoJson ? featureGeoJson.geometry : null //geojson
					},
					success: res => {
						if (res.data.code === 200) {
							uni.hideLoading();
							uni.showToast({
								title: '提交成功!',
								duration: 2000
							})

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
						
					}
				})

			},
			get_shooting_point(tbbh) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: setting.url + '/userTask/getTaskLines',
						method: "GET",
						sslVerify: false, //真机运行受证书限制
						data: {
							tbbh: tbbh //所传的图斑编号
						},
						success: (res) => {
							if (res.data.code === 200) {
								resolve(res.data.data);
							} else {}
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'X-Requested-With': 'xmlhttprequest'
							// 'Content-Type': 'application/json;charset:utf-8',
						},
						fail: (res) => {},
						complete: (complete) => {}
					})
				})
			},

			show_operation() {
				this.operation_icon_show = !this.operation_icon_show 
				if (this.operation_icon_show) {
					this.operation_tile = '收起'
				} else {
					this.operation_tile = '展开'
				}
			},
			// },
			//获取绘制的面积
			getArea(val) {
				this.l_area = val
			},
			drawFeature(val) {
				this.ope_types = val
				// this.showData = true
				// this.measure_value = null;
			},
			clearDraw() {
				this.ope_types = ""
			},
			//获取测量值
			// get_measure_value(val) {
			// 	this.measure_value = val
			// },
			//将空间分析的值传到task_infos_check
			pop_task_infos_check(val) {
				// this.showData = false
				this.$emit('olmapSend', val)
			},
			//将绘制的点线面传到task_infos_check
			get_featureGeoJson_value(val) {
				this.l_featureGeoJson = val
				this.$emit('featureGeoJsonSend', val)
			},
			// 接收renderjs发回的数据
			receiveRenderData(val) {
				this.lineAngle = val.data
			},
			get_distance_value(val) {
				this.distance_value = val
			},
			gets_location(val) {
				this.$emit('jwdSend', val)
			},
			login_onCompassChange() {
				 uni.startCompass();
				 uni.startAccelerometer();
				 
				 uni.onAccelerometerChange((accelerometerValue) => {
				 	// 根据加速度数据来判断设备方向
				 	const {
				 		x,
				 		y
				 	} = accelerometerValue;
				 	if (Math.abs(x) > Math.abs(y)) {
				 		this.deviceOrientation = "x"
				 	} else { 
						this.deviceOrientation = "y"
				 	}
				 });

				uni.onCompassChange((res) => {
					//横拍 +90
					if(this.deviceOrientation=='x'){
						this.compassangel = Math.abs(parseInt(res.direction) + 90)
						this.compassangels = res.direction + 90
					}else{
						this.compassangel = Math.abs(parseInt(res.direction) )
						this.compassangels = res.direction 
					}
					this.$emit('compassangelSend', this.lineAngle) //传值
				})
			}
		},
		mounted() {

			//开启陀螺仪
			this.login_onCompassChange()
		}
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
		XYZ
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
	import fullScreen from 'ol/control/FullScreen';
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
	import WKB from 'ol/format/WKB';
	import {
		singleClick,
		doubleClick
	} from "ol/events/condition";

	import WMTSTileGrid from 'ol/tilegrid/WMTS'
	import WMTS from "ol/source/WMTS";
	// import { get as getProjection } from 'ol/proj';
	// import { getTopLeft, getWidth } from 'ol/extent';


	import gcoord from 'gcoord';
	import setting from '@/setting.js';
	const source = new sourcevector({

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
	var _that = this;


	export default {
		// components:{videoconference},
		data() {
			return {
				map: null, //地图
				geoData: {}, //定位数据
				vectorLayer: null, //创建图层
				vectorSource: null, //图 层数据容器
				layer: null, //地图图层
				draw: null,
				bzInfor: [], //备注信息
				draw_source: new sourcevector(),
				draw_vector: {},
				draw: {},
				point: null,
				overlay: null,
				drawLayers: [],
				drawElements: [],
				json_analy: [],
				stylepoint: null, //用于定位角度方向
				feature: null,
				//用来做双向判断，判断地图是否初始化好
				init_map_complete: 0,
				PolygonData: "222",
				drawPolygonData: "222",
				poly: null, //用于进行空间分析的矢量数据
				pt_num: [], //空间分析矢量数据集合
				get_map_data: [], //获取地图相关数据
				get_compassangel: null, //获取偏角坐标
				get_location: null, //获取经纬度信息
				//起始点和经纬度点的
				test_longtudes: 108.39059,
				test_latitude: 22.745129,
				old_wid: '',
				lineAngle: 0, //回执线段的角度
				start_longtudes: '', //开始经度
				start_latitude: '', //开始纬度
				distance_computer: '', //计算距离
				select_start_poiont: '', //选择的开始点
				select_end_poiont: '', //选择的结束点
				set_center_status: 1, //是否需要重新设置重新点，0：不重置，1：重置
				watchPositionTime: 1000, //动态改变定位间隔时间
				get_line_data: [], //获取到逻辑层传回来的线段数据，绘制到地图上
				operation_type: 0, //操作类型，用来判断是否是点线面，默认值是0
				timer: null, //定时器
				images_layer_names: [], //影像图层名称
				tb_jwd: null, //图斑的经纬度
				pMountedTimers: null, //定时器
				clickType: null, //选择的类型
				featureGeoJson: null, //绘制的geojson数据
				area: null,
				selected: null, //被选择的图形
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
						// this.initAmap()
						// // this.getlocation()
						// this.getlocation()
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
		methods: {
			oper_type_change(newValue, oldValue, ownerInstance, instance) {
				if (newValue != '23') {
					this.operation_type = newValue
					this.drawFeatures(newValue)
				}
			},
			//获取接口返回的数据
			GetGeojson(newValue, oldValue, ownerInstance, instance) {
				this.PolygonData = newValue
			},

			//获取绘制的信息
			getDrawGeojson(newValue, oldValue, ownerInstance, instance) {
				this.drawPolygonData = newValue
			},

			//修改角度
			oncompasschanges(newValue, oldValue, ownerInstance, instance) {
				if (this.init_map_complete == 1) {
					// var get_compassangel = {"name",newValue}
					this.get_compassangel = {
						compassangel: newValue
					}
					var nn = Math.PI / 180 * newValue
					this.stylepoint.getImage().setRotation(nn)
					this.feature.changed()
				}
			},
			// //添加绘制点线面图层
			addDrawLayer() {
				this.draw_source.addFeature(new Feature({
					name: 'setPoint'
				}))
				this.draw_vector = new layerVector({
					source: this.draw_source,
					//绘制好后，在地图上呈现的样式
					style: new style({
						fill: new fill({
							color: "rgba(255, 255, 255, 0.2)",
						}),
						stroke: new Stroke({
							//边界样式
							color: "#ffcc33",
							width: 3,
						}),
						//点样式继承image
						image: new circle({
							radius: 7,
							fill: new fill({
								color: "#ffcc33",
							}),
						}),
					}),
					zIndex: 9999,
				});
				this.map.addLayer(this.draw_vector);
			},
			//清除绘制图层
			clearDrawLayer() {
				this.draw_vector.getSource().clear(); //清除图层上的所有要素
				this.map.removeInteraction(this.draw); //移除交互
				for (let i = 0; i < this.drawLayers.length; i++) {
					this.map.removeLayer(this.drawLayers[i])
				}
				for (let i = 0; i < this.drawElements.length; i++) {
					this.map.removeOverlay(this.drawElements[i])
				}
				this.drawLayers = []
				this.drawElements = []
				unByKey(mapMouseMove)
			},
			//绘制点线面
			drawFeatures(val) {
				// 
				if (val == 23) {
					return
				}
				const select = new Select({
					multi: false //单选
				});
				this.map.removeInteraction(this.draw); //移除交互
				this.selected = select.getFeatures();
				const modify = new Modify({
					features: this.selected
				});
				modify.setActive(true);
				select.setActive(true);
				this.map.addInteraction(select);
				this.map.addInteraction(modify);
				modify.on('modifyend', this.ModifyIconEnd);
				// let snap;
				if (val == "Drawclearn") {
					this.clearDrawLayer()
					// this.cross_analysis()
					this.operation_type = 0
					return; //这里一定要判断
				}
				this.draw = new Draw({
					source: this.draw_source,
					type: val,
					// freehand: true,
					//绘制时，在地图上呈现的样式
					geometryName: '12332',
					style: new style({
						fill: new fill({
							color: "rgba(255, 255, 255, 0.2)",
						}),
						stroke: new Stroke({
							color: "#ffcc33",
							width: 2,
						}),
						image: new circle({
							radius: 7,
							fill: new fill({
								color: "#ffcc33",
							}),
						}),
					}),
					freehand: this.enableFreeHand, //手绘
					// finishCondition:(e)=>{return false},//添加这行
				});
				this.map.addInteraction(this.draw);
				this.draw.on('drawstart', this.drawStart)
				this.draw.on('drawend', this.drawFinish)
			},

			//画图形开始处理事件
			drawStart(e) {
				this.createHelpTooltip()
				this.createMeasureTooltip()
				this.sketch = e.feature
				let tooltipCoord = e.coordinate
				let a = null
				var that = this
				// 监听正在画的图形，动态计算长度或面积
				this.listener = this.sketch.getGeometry().on('change', (evt) => {
					const geom = evt.target
					let output
					// 获取图形数据和坐标
					// 多边形获取内部点坐标，线段获取最后落点坐标
					if (geom instanceof Polygon) {
						// this.map.removeEventListener('singleclick');
						// this.map.removeEventListener('dblclick');
						output = this.formatArea(geom)
						tooltipCoord = geom.getInteriorPoint().getCoordinates()
						measureTooltipElement.innerHTML = output;

						measureTooltip.setPosition(tooltipCoord);
						that.area = output

					} else if (geom instanceof LineString) {
						output = this.formatLength(geom)
						a = output
						tooltipCoord = geom.getLastCoordinate()
						measureTooltipElement.innerHTML = output;
						measureTooltip.setPosition(tooltipCoord);
					}

				})
			},
			// 画图形结束处理事件
			drawFinish(e) {
				this.sketch = null
				this.featureGeoJson = JSON.parse(new GeoJSON().writeFeature(e.feature));
				measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
				measureTooltip.setOffset([0, -7]);
				// feature = null;
				measureTooltipElement = null;
				this.createMeasureTooltip();
				unByKey(this.listener)
				// this.map.removeEventListener('singleclick');
				//将渲染层的数据传到逻辑层
				this.$ownerInstance.callMethod('get_featureGeoJson_value', this.featureGeoJson)
				this.cross_analysis(this.featureGeoJson)
				this.operation_type = 0
				this.$ownerInstance.callMethod('clearDraw')
				this.$ownerInstance.callMethod('getArea', this.area)
			},
			ModifyIconEnd(e) {
				let modifyFeatureGeoJson = JSON.parse(new GeoJSON().writeFeature(e.features.array_[0]))
				const modifyArea = (turf.area(modifyFeatureGeoJson) / 666.67).toFixed(5) + "亩";
				// measureTooltipElement.innerHTML = modifyArea;
				this.area = modifyArea

				this.$ownerInstance.callMethod('getArea', this.area)
				this.$ownerInstance.callMethod('get_featureGeoJson_value', modifyFeatureGeoJson)
				measureTooltipElement.innerHTML = modifyArea;
				measureTooltip.setPosition(modifyFeatureGeoJson['geometry']['coordinates'][0][0]);
				// measureTooltipElement.innerHTML = "1233"
				// measureTooltipElement.parentNode.removeChild(measureTooltipElement);
				// this.createMeasureTooltip();
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
			createHelpTooltip() {
				if (helpTooltipElement) {
					helpTooltipElement.parentNode.removeChild(helpTooltipElement);
				}
				helpTooltipElement = document.createElement('div');
				helpTooltipElement.className = 'ol-tooltip hidden';
				helpTooltip = new Overlay({
					element: helpTooltipElement,
					offset: [15, 0],
					positioning: 'center-left',
				});
				this.map.addOverlay(helpTooltip);
			},

			// 计算图形面积
			formatArea(polygon) {
				// 这里一定要给坐标，和地图坐标保持一致，否则面积不准
				const area = getArea(polygon, {
					projection: 'EPSG:4326'
				})
				let output
				if (area > 10000) {
					output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
				} else {
					output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
				}
				return output
			},
			// 计算线段长度
			formatLength(line) {
				// 这里一定要给坐标，和地图坐标保持一致，否则长度不准
				const length = getLength(line, {
					projection: 'EPSG:4326'
				})
				let output
				if (length > 100) {
					output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
				} else {
					output = Math.round(length * 100) / 100 + ' ' + 'm'
				}
				this.$ownerInstance.callMethod('get_measure_value', output)
				return output
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
			//调用定位功能
			getlocation() {
				var that = this
				plus.geolocation.watchPosition( //不停的获取和更新用户的地理位置信息，自定义执行间隔时间；当设备地理位置发生改变时，自动调用；
					function(p) {
						// p为获取成功的定位数据
						var result = gcoord.transform(
							[p.coords.longitude, p.coords.latitude], // 经纬度坐标
							gcoord.WGS84, // 当前坐标系
							gcoord.EPSG4326 // 目标坐标系
						);
						that.init_longtudes = p.coords.longitude
						that.init_latitude = p.coords.latitude

						that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
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
						maximumAge: 1000,
					});
			},

			initAmap() {
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
					source: sourceMark,
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
					layers: [tileLayer,tileMark], //地图源的瓦片图层
					// 设置显示地图的视图
					view: new View({
						center: [108, 22], //地图中心点 经纬度
						zoom: 16, // 缩放级别-显示层级
						minZoom: 0, // 最小缩放级别
						maxZoom: 30, // 最大缩放级别
						projection: getProjection("EPSG:4326"),
						enableRotation: false
					}),
					controls:defaults({
						attribution: false,
						zoom: false,
						rotate: false
					})
				});

				// this.map.addLayers(tileMark);
				this.setPoint();
				this.addDrawLayer();
				this.old_wid = plus.geolocation.watchPosition( //不停的获取和更新用户的地理位置信息，自定义执行间隔时间；当设备地理位置发生改变时，自动调用；
					function(p) {
						that.init_longtudes = p.coords.longitude
						that.init_latitude = p.coords.latitude
						try {
							that.feature.setGeometry(new Point([that.init_longtudes, that.init_latitude]))
						} catch (e) {
							that.setPoint();
							//TODO handle the exception
						}
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
						//coordsType:坐标系 system：
					});
				// this.map.addLayer(this.draw_vector)
				this.getfeature()
				this.init_map_complete = 1
				// 创建source对象
				this.VectorSource = new sourcevector({
					features: [] // 值是一个feature数组   source:features  1:N
				});
				// 创建layer对象
				this.VectorLayer = new layerVector({
					source: this.VectorSource, // layer-source  1:1
					opacity: 0.5 //修改面的透明度
				});
				this.VectorLayer.setZIndex(2)
				if (this.get_line_data != 999) {
					var that = this
					this.get_line_data.forEach(element => {
						this.map.once('postrender', function(event) {
							that.addLine(element.startLongitude, element.startLatitude, element
								.endLongitude, element.endLatitude);
						});
					})
				}
				this.map.addLayer(this.VectorLayer);
				// this.map.once('postrender', (event) => {
				// 	this.createShePolygon();
				// 	this.createUseShePolygon();
				// });
				this.createShePolygon();
				this.createUseShePolygon();
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
			loadGeoserverMap(images_layer_name) {
				var geoservermap = ["3333"]
				images_layer_name.forEach(element => {
					const geoserverLayer = new TileLayer({
						name: element,
						source: new TileWMS({
							// url: 'http://47.113.205.26:1002/geoserver/dc_image/wms', // 请求地址
							url: setting.geoserverUrl + '/geoserver/' + element[1] +
							'/wms', // 请求地址
							params: { // 请求的参数设置，其余参数可以不设置，使用默认的参数
								//'FORMAT': 'image/jpeg',   //如果加了这行，地图底图将会被遮住
								LAYERS: element[1] + ':' + element[0], // 请求的图层名
								VERSION: '1.1.0', // wms请求的版本，也可用1.3.0
								'STYLES': '',
								tiled: true,
								projection: "EPSG:4326",
							},
						}),
						visible: true
					});
					geoserverLayer.setZIndex(1)
					this.map.addLayer(geoserverLayer); // 加载图层到地图上
				})
			},
			setLayerVisible(layer_name, status) {
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
			//添加任务图斑
			createShePolygon() {
				const data_length = this.PolygonData.length
				for (var i = 0; i < data_length; i++) {
					const format = new WKB();
					const wkb = this.PolygonData[i].theGeom
					//图斑名称
					this.PolygonName = this.bzInfor
					//图斑坐标
					this.PolygonCoordinate = this.pages(format.readGeometry(wkb, {
						dataProjection: 'EPSG:4326',
					}).flatCoordinates)
					try {
						this.poly = turf.polygon(
							[
								this.PolygonCoordinate[0]
							], {
								name: this.PolygonName,
							}, );
						this.pt_num.push(this.poly)
					} catch (e) {
						//TODO handle the exception
					}
					this.createTbPolygon(this.PolygonCoordinate, wkb, this.PolygonName)
				}
			},

			// 添加用户画的图形
			createUseShePolygon() {
				const data_length = this.drawPolygonData.length
				for (var i = 0; i < data_length; i++) {
					const format = new WKB();
					const wkb = this.drawPolygonData[i].drawpolygon
					if (wkb == null) {
						continue;
					}
					//图斑名称
					const PolygonName = "面积：" + this.drawPolygonData[i].area + " 备注：" + this.drawPolygonData[i].bz
					//图斑坐标
					const localtion = null
					localtion = this.pages(format.readGeometry(wkb, {
						dataProjection: 'EPSG:4326',
					}).flatCoordinates)
					try {
						this.poly = turf.polygon(
							[
								localtion[0]
							], {
								name: PolygonName,
							}, );
						this.pt_num.push(this.poly)
					} catch (e) {
						//TODO handle the exception
					}

					this.createUserPolygon(localtion, PolygonName)
				}
			},
			/**
			 * 创建TB多边形到地图
			 */
			createTbPolygon(ptArr, wkbData, val) {
				// 将WKB数据解析为几何对象
				const wkbFormat = new WKB();
				const geometry = wkbFormat.readGeometry(wkbData, {
					dataProjection: 'EPSG:4326', // 指定WKB数据的投影坐标系

				});
				// 获取几何对象的范围的中心点
				const extent = geometry.getExtent();
				this.tb_jwd = ol.extent.getCenter(extent);

				// 创建一个矢量图层来显示几何对象
				const vectorLayers = new layerVector({
					source: new sourcevector({
						features: [new Feature({
							geometry: geometry,
							name: 'taskTB'
						})],
					}),
				});

				// 将矢量图层添加到地图中
				this.map.addLayer(vectorLayers);


				var feature = new Feature({
					geometry: new Polygon(ptArr),
					name: 'taskTB'
				});


				// this.tb_jwd = feature.getGeometry().getInteriorPoint().getCoordinates()

				// 创建一个具有坐标的ol.Feature
				var that = this
				var features = new Feature({
					geometry: new Point([this.tb_jwd[0], this.tb_jwd[1]])
				});
				var text = null
				if (this.drawPolygonData.length != 0) {
					text = this.drawPolygonData[0].bz
				}
				var textStyle = new Text({
					text: text, // 设置要显示的文字featureGeoJson? featureGeoJson.geometry : null
					fill: new fill({
						color: '#ff0000'
					}),
					font: '30px sans-serif', // 文字样式
					offsetY: -15, // 文字垂直偏移量
					textAlign: 'center' // 文字水平对齐方式
				})
				features.setStyle(new style({
					text: textStyle
				}))

				this.set_center_point(this.tb_jwd[0], this.tb_jwd[1])
				// this.VectorSource.addFeature(feature);
				this.VectorSource.addFeature(features);
				this.createMeasureTooltip()
				measureTooltipElement.innerHTML = val;
				measureTooltip.setPosition(this.tb_jwd);
				measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
				measureTooltip.setOffset([0, -7]);
				// feature = null;
				measureTooltipElement = null;
				this.createMeasureTooltip();
			},

			/**
			 * 创建用户绘制的地图
			 */
			createUserPolygon(ptArr, val) {
				var feature = new Feature({
					geometry: new Polygon(ptArr),
					name: 'userPolygon',
					geometryName: 'createUserPolygon'
				});
				// feature.setGeometryName('labelPoint');
				this.tb_jwd = feature.getGeometry().getInteriorPoint().getCoordinates()

				// 创建一个具有坐标的ol.Feature
				var that = this
				var features = new Feature({
					geometry: new Point([this.tb_jwd[0], this.tb_jwd[1]])
				});
				var text = null
				if (this.drawPolygonData.length != 0) {
					text = this.drawPolygonData[0].bz
				}
				var textStyle = new Text({
					text: text, // 设置要显示的文字featureGeoJson? featureGeoJson.geometry : null
					fill: new fill({
						color: '#ff0000'
					}),
					font: '30px sans-serif', // 文字样式
					offsetY: -15, // 文字垂直偏移量
					textAlign: 'center' // 文字水平对齐方式
				})
				features.setStyle(new style({
					text: textStyle
				}))

				this.set_center_point(this.tb_jwd[0], this.tb_jwd[1])
				this.VectorSource.addFeature(feature);
				// this.VectorSource.addFeature(features);
				this.createMeasureTooltip()
				measureTooltipElement.innerHTML = val;
				measureTooltip.setPosition(this.tb_jwd);
				measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
				measureTooltip.setOffset([0, -7]);
				// feature = null;
				measureTooltipElement = null;
				this.createMeasureTooltip();
			},

			// //对图形进行相交空间分析
			cross_analysis(featureGeoJson) {
				// var pt_num = [this.poly]
				this.draw_polygon_area = turf.area(featureGeoJson)
				var intersection = 0
				//自己画的矢量图与其他矢量图空间分析
				for (var i = 0; i < this.pt_num.length; i++) {
					intersection = turf.intersect(this.pt_num[i], featureGeoJson)
					//判断是否相交
					if (typeof intersection != 'undefined') {
						this.json_analy.push({
							item_name: this.pt_num[i].properties.name,
							area: parseFloat(turf.area(intersection)).toFixed(4),
							area_percentage: ((turf.area(intersection)) / this.draw_polygon_area) * 100
						})
					}
					this.$ownerInstance.callMethod('pop_task_infos_check', this.json_analy)
				}
			},
			getfeature() {
				var div_popup;

				function createPopupDiv() {
					div_popup = document.createElement('div');
					div_popup.id = "popup";
					div_popup.className = "popup";
					div_popup.style.cssText = "display:block;background:black;color:white;border:solid 1px;"
					document.body.appendChild(div_popup);
				}
				createPopupDiv();
				// 创建一个overlay层
				var popup = new Overlay({
					element: document.getElementById('popup'),
					autoPan: true,
					autoPanMargin: 100,
					positioning: 'center-left',
					offset: [10, -5]
				});
				var selectClick = new Select({
					// 事件类型
					condition: singleClick,
					// 点击后的样式
					style: new style({
						//边框样式
						stroke: new Stroke({
							color: '#ff5500',
							width: 2,
						}),
					}),
					hitTolerance: 5, //允许的点击误差
				});
				this.map.addInteraction(selectClick);
				var that = this
				selectClick.on('select', function(e) {
					if (that.operation_type == 0) {
						let features = e.target.getFeatures().getArray();
						let pMountedTimerss = {}
						if (features.length > 0) {
							let feature = features[0]
							if (feature.values_.name != 'setPoint') {
								try {
									that.select_start_poiont = feature.getGeometry().getCoordinates()[0]
									that.select_end_poiont = feature.getGeometry().getCoordinates()[1]
									that.lineAngle = parseInt(that.getAngle(that.select_start_poiont, that
										.select_end_poiont))
									that.emitData(that.lineAngle)
									that.distance_computer = that.getDistance(that.select_start_poiont[1], that
										.select_start_poiont[0], that.init_latitude, that.init_longtudes)
									that.$ownerInstance.callMethod('get_distance_value', that.distance_computer)
									// clearInterval(that.pMountedTimers)
									that.pMountedTimers = window.setInterval(() => {
										that.distance_computer = that.getDistance(that.select_start_poiont[
												1], that
											.select_start_poiont[0], that.init_latitude, that
											.init_longtudes)
										that.$ownerInstance.callMethod('get_distance_value', that
											.distance_computer)
									}, 5000)

									let start_longtudes = feature.getGeometry().getCoordinateAt(0)[0];
									let start_latitude = feature.getGeometry().getCoordinateAt(0)[1];
									// that.init_longtudes = p.coords.longitude
									// that.init_latitude = p.coords.latitude
									that.get_location = {
										longtude: start_longtudes,
										latitude: start_latitude,
										init_longtudes: that.init_longtudes,
										init_latitude: that.init_latitude,
										type: "line",
									}
									if (feature.values_.name == 'taskTB') {
										that.$ownerInstance.callMethod('gets_location', that.get_location)
									}

									// that.$ownerInstance.callMethod('gets_location', that.get_location)
									let end_longtudes = feature.getGeometry().getCoordinateAt(1)[0];
									let end_latitude = feature.getGeometry().getCoordinateAt(1)[1];
									let dx = end_longtudes - start_longtudes;
									let dy = end_latitude - start_latitude;
									let rotation = Math.atan2(dy, dx);
									// arrows
									let styles = [feature.getStyle()]
									styles.push(new style({
										geometry: new Point([end_longtudes, end_latitude]),
										image: new Icon({
											src: 'https://openlayers.org/en/v4.6.5/examples/data/arrow.png',
											anchor: [0.75, 0.5],
											rotateWithView: true,
											rotation: -rotation,
											color: '#ff5500',
										}),
									}));
									feature.setStyle(styles)
								} catch (e) {
									//TODO handle the exception 选择图斑

									that.get_location = {
										longtude: that.tb_jwd[0],
										latitude: that.tb_jwd[1],
										init_longtudes: that.init_longtudes,
										init_latitude: that.init_latitude,
										type: "tb",
									}

									if (feature.values_.name == 'taskTB') {
										that.$ownerInstance.callMethod('gets_location', that.get_location)
									}
								}

							}
						} else {
							window.clearInterval(that.pMountedTimers)
							that.emitData(this.lineAngle)
						}
					}
				})
				// 监听地图层级变化
				// this.map.getView().on('change:resolution', function(){
				//     var style = that.feature.getStyle();
				//     // 重新设置图标的缩放率，基于层级20来做缩放
				//     // style.getImage().setScale(that.map.getView().getZoom / 20);
				//     // that.feature.setStyle(style);
				// })
			},
			addLine(start_longtudes, start_latitude, end_longtudes, end_latitude) {
				let featureLine = new Feature({
					geometry: new LineString([
						[start_longtudes, start_latitude],
						[end_longtudes, end_latitude],
					]),
				});
				const styles = [
					// linestring
					new style({
						stroke: new Stroke({
							color: '#ffcc33',
							width: 2,
						}),
					}),
				];
				const dx = end_longtudes - start_longtudes;
				const dy = end_latitude - start_latitude;
				const rotation = Math.atan2(dy, dx);
				// arrows
				styles.push(new style({
					geometry: new Point([end_longtudes, end_latitude]),
					image: new Icon({
						src: 'https://openlayers.org/en/v4.6.5/examples/data/arrow.png',
						anchor: [0.75, 0.5],
						rotateWithView: true,
						rotation: -rotation,
					}),
				}));
				let lngLat_a = featureLine.getGeometry().getCoordinateAt(0)
				let lngLat_b = featureLine.getGeometry().getCoordinateAt(1)
				let source = new sourcevector()
				source.addFeature(featureLine)
				let layer = new layerVector()
				layer.setZIndex(2)
				layer.setSource(source)
				layer.setStyle(styles)
				this.map.addLayer(layer)
			},
			emitData(e, ownerInstance) {
				this.$ownerInstance.callMethod('receiveRenderData', {
					data: e
				})
			},
			//根据经纬度获取与正北方向的夹角（0~359）
			getAngle(lngLat_a, lngLat_b) {
				var lng_a = lngLat_a[0];
				var lat_a = lngLat_a[1];
				var lng_b = lngLat_b[0];
				var lat_b = lngLat_b[1];
				var a = (90 - lat_b) * Math.PI / 180;
				var b = (90 - lat_a) * Math.PI / 180;
				var AOC_BOC = (lng_b - lng_a) * Math.PI / 180;
				var cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
				var sinc = Math.sqrt(1 - cosc * cosc);
				var sinA = Math.sin(a) * Math.sin(AOC_BOC) / sinc;
				var A = Math.asin(sinA) * 180 / Math.PI;
				var res = 0;
				if (lng_b > lng_a && lat_b > lat_a) res = A;
				else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
				else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
				else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
				else if (lng_b > lng_a && lat_b == lat_a) res = 90;
				else if (lng_b < lng_a && lat_b == lat_a) res = 270;
				else if (lng_b == lng_a && lat_b > lat_a) res = 0;
				else if (lng_b == lng_a && lat_b < lat_a) res = 180;
				return res;
			},
			//计算两点间的距离（纬度，经度）
			getDistance(lat1, lng1, lat2, lng2) {
				const PI = Math.PI
				const EARTH_RADIUS = 6378137.0

				function getRad(d) {
					return d * PI / 180.0
				}
				let f = getRad((lat1 + lat2) / 2)
				let g = getRad((lat1 - lat2) / 2)
				let l = getRad((lng1 - lng2) / 2)
				let sg = Math.sin(g)
				let sl = Math.sin(l)
				let sf = Math.sin(f)
				let s, c, w, r, d, h1, h2
				let a = EARTH_RADIUS
				let fl = 1 / 298.257
				sg = sg * sg
				sl = sl * sl
				sf = sf * sf
				s = sg * (1 - sl) + (1 - sf) * sl
				c = (1 - sg) * (1 - sl) + sf * sl
				w = Math.atan(Math.sqrt(s / c))
				r = Math.sqrt(s * c) / w
				d = 2 * w * a
				h1 = (3 * r - 1) / 2 / c
				h2 = (3 * r + 1) / 2 / s
				var distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
				return distance
			},
			//   添加定位图标
			setPoint() {
				this.feature = new Feature({
					title: 'beijing',
					name: 'setPoint',
					geometry: new Point([this.init_longtudes, this.init_latitude]),
				})
				const iconStyle = new Icon({
					src: setting.url + '/static/location.png',
					// src:'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
				});
				iconStyle.load();
				this.stylepoint = new style({
					image: iconStyle
				})
				this.feature.setStyle(this.stylepoint)
				let source = new sourcevector()
				source.addFeature(this.feature)
				let layer = new layerVector()
				layer.setZIndex(2)
				layer.setSource(source)
				this.map.addLayer(layer)
			},
			//img:自定义颜色
			createStyle(src, img) {
				return new style({
					image: new Icon({
						anchor: [0.5, 0.96],
						crossOrigin: 'anonymous',
						src: src,
						img: img,
						imgSize: img ? [img.width, img.height] : undefined,
					}),
				});
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
