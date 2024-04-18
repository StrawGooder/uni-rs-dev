<!--LjDraw-->
<template>
  <div :prop="options" :change:prop="ol.onChange">
    <el-button size="mini">
      <select
        v-model="currentDrawFeature"
        style="
          background-color: rgb(66, 66, 66);
          color: white;
          padding: 2px 7px;
          outline: none;
        "
        @change="drawFeature()"
      >
        <option value="">请选择</option>
        <option value="Point" label="画点"></option>
        <option value="LineString">画线</option>
        <option value="Polygon">画面</option>
        <option value="Circle">画圆</option>
      </select>
    </el-button>
 
    <el-button size="mini"
      ><el-checkbox v-model="enableFreeHand">手绘</el-checkbox></el-button
    >
    <el-button size="mini" @click="draw.removeLastPoint()">撤回</el-button>
    <el-button size="mini" @click="cancelDraw()">取消</el-button>
    <el-button size="mini" @click="clearDrawLayer()">清除</el-button>
  </div>
</template>

<script>
	export default {
	    data() {			
	      return {
			title: '调用相机',
			Imgs: '/static/logo.png',
			init_longtudes:'',
			init_latitude:'',
	        options: {
			// 这里存放准备传递给renderjs的数据
	          longitudes: "111",
	          latitude: "111"
	        },
			
			
	      }
	    },
	    methods: {
	      changeOptionFn() {
			  var that=this 
			  uni.getLocation({
			  	type: 'wgs84',
			  	success: function (res) {
					//修改初始值触发change后监听
					that.options.longitudes = res.longitude
					that.options.latitude = res.latitude					
			  	},
			  	fail:function(res) {
			  		console.log("fails")
			  	}
			  });
	      },
		  //调用摄像头
		    pictureClick () {
		        uni.chooseImage({
		            count: 1,
		            sizeType: ['original', 'compressed'],
		            sourceType: ['camera','album'], //这要注意，camera是拍照，album是打开手机相册
		            success: (res)=> {
		                // console.log(res);
		                const tempFilePaths = res.tempFilePaths;
		                this.Imgs = res.tempFilePaths[0]
		                // this.$forceUpdate();
		                console.log(JSON.stringify(res.tempFilePaths));
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePaths[0],
							success: function () {
								console.log('save success');
							}
						});
		            }
		        });
		    }	  
	    },
		mounted() {
			console.log("mounted1")
		    this.changeOptionFn();
		}
	  }
	
</script>



<script>
	import "ol/ol.css";
	import Map from "ol/Map";
	import View from "ol/View";
	import TileLayer from "ol/layer/Tile";
	import { Vector as VectorLayer } from "ol/layer";
	import { OSM, Vector as VectorSource } from "ol/source";
	import Draw from "ol/interaction/Draw";
	import { Fill, Stroke, Style, Text, Icon, Circle } from "ol/style";
 
export default {
  name: "LjDraw",
  props: {
    map: {
      default: {},
      required: true,
    },
  },
  data() {
    return {
      draw_source: new VectorSource(),
      draw_vector: {},
      draw: {},
      currentDrawFeature: "", //当前正在绘制的要素类型
      enableFreeHand: false, //是否允许手绘
	  author:''
    };
  },
  onShow() {
  			// 每次A.vue出现在屏幕上时，都会触发onShow，从而更新author值
  			this.author = getApp().globalData.userName;
			console.log("openlayer 测试",this.author)
  		}
  mounted() {
	  
    let pMountedTimer = {}; //定时器
    pMountedTimer = setInterval(() => {
      if (window.parentMounted) {
        //在这里执行初始化
        this.addDrawLayer();
 
        clearInterval(pMountedTimer); //清除定时器
      }
    }, 1000);
  },
  methods: {
    //添加绘制点线面图层
    addDrawLayer() {
      this.draw_vector = new VectorLayer({
        source: this.draw_source,
        //绘制好后，在地图上呈现的样式
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            //边界样式
            color: "#ffcc33",
            width: 3,
          }),
          //点样式继承image
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33",
            }),
          }),
        }),
        zIndex: 9999,
      });
      this.map.addLayer(this.draw_vector);
    },
    //取消绘制
    cancelDraw() {
      this.map.removeInteraction(this.draw); //移除交互
      this.currentDrawFeature = ""; //取消选中要素！！
    },
    //清空绘制图层
    clearDrawLayer() {
      this.map.removeInteraction(this.draw); //移除交互
      this.draw_vector.getSource().clear(); //清除图层上的所有要素
      this.currentDrawFeature = ""; //取消选中要素！！
    },
    //绘制点线面
    drawFeature() {
      this.map.removeInteraction(this.draw); //移除交互
 
      if (!this.currentDrawFeature) return; //这里一定要判断
 
      this.draw = new Draw({
        source: this.draw_source,
        type: this.currentDrawFeature,
        //绘制时，在地图上呈现的样式
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: "#ffcc33",
            }),
          }),
        }),
        freehand: this.enableFreeHand, //手绘
      });
      this.map.addInteraction(this.draw);
    },
    // 初始化地图
    // initMap() {
    //   this.map = new Map({
    //     target: "map",
    //     layers: [
    //       new TileLayer({
    //         source: new OSM(),
    //         visible: true,
    //         name: "OSM",
    //       }),
    //     ],
    //     view: new View({
    //       projection: "EPSG:4326",
    //       center: [115, 39],
    //       zoom: 4,
    //     }),
    //   });
    // },
	initAmap() {
		// var fullScreen = new fullScreen();
		
		      //线的图层
		this.lineSource = new sourcevector({ wrapX: false });
		this.lineLayer = new layerVector({
		    source: this.lineSource,
		});
	
		this.map = new Map({
			layers: [
				new TileLayer({
					source: new OSM()
				})
				
			],
			target: "olMap",
			view: new View({
				zoom: 16,
				center: [this.init_longtudes,this.init_latitude],
				projection: "EPSG:4326"
			}),
			 // controls: ol.control.defaults().extend([fullScreen]),
		});
		this.setPoint();
	},
	//   添加定位图标
	    setPoint() {
			
			let feature = new Feature({
				title: 'beijing',
				geometry: new Point([this.init_longtudes,this.init_latitude]),
			})
			feature.setStyle(
				new style({
				image: new circle({
				fill: new fill({
					color: 'blue',
				}),
					radius: 4,
				}),
				})
			);
			let source = new sourcevector() 
			source.addFeature(feature)
			let layer = new layerVector()
			layer.setSource(source)
			this.map.addLayer(layer)
	    }
  },
  watch: {
    enableFreeHand: {
      handler() {
        this.drawFeature();
      },
    },
  },
};
</script>