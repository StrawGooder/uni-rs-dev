<template>
	<view>
		<ol-map
		hideMapImg
		:ref="rfmapVmName"
		:afterInit="importMapLayers"
		usedMode = "edit"
		>
		</ol-map>

		<view
		style="position: absolute; z-index: 999; top: 20vh; right:1vw"
		>
			<MapViewBasicToolbar
			@click="onRightToolbarClicked"
			>
				
			</MapViewBasicToolbar>
			
		</view>
		
	<!-- 	<view
		style="position: absolute;top:0px;height:500px"
		>	
			
		</view> -->
		<!-- 	<next-tree
			
			uiMode="page"
			:treeData = "rfTreeData"
			>
				
			</next-tree> -->	
			
		<!-- bottom panel -->
		<view 
		class="index" 
		style="height: 60vh;position:absolute;"
		>
			<uni-transition  
			v-bind:custom-class="{'menu_warp': isActive, 'menu_warp1': hasError }" 
			:show="show"
			ref="menuWarp"
			>
				
				<view class="warp">
					<button 
					class="bar" 
					@touchmove.stop="touchMove" 
					@touchend.stop="touchEnd"
					@touchstart.stop="touchStart" 
					@mousedown="onBottomBtnPressed"
					@mouseup="onBottomBtnReleased"
					
					>
					</button> 

					<MapViewBottomPanel
					:ref="rfBottomPanelRefName"
					>
						
					</MapViewBottomPanel>
				</view>
			
			</uni-transition>
		</view>
	
	<!-- 	<custom-tabs type="c1" :value="value" >
			<one></one>
			<two :id="tbbh"></two>
			<three :id="tbbh"></three>
			<chooseimage 
			:imageList="imagelist" 
			:get_map_data="get_map_data"
			:set_graphphone_status="set_graphphone_status" 
			:tbbh="tbbh"
			:investigationStatus="investigationStatus"
			>
			</chooseimage>
		</custom-tabs> -->
	</view>

</template>


<!-- ```javascript -->
<script>
	// import olMap from "@/components/olmap/olmap.vue";
	import olMap from "@/components/olmap/ZsOlMap.vue";
	
	import MapViewBottomPanel from "./MapViewBottomPanel.vue";
	import MapViewBasicToolbar from "./MapViewBasicToolbar.vue";
	
	// import one from "@/components/custom-tab-check/custom-tab-check-one.vue";
	// import two from "@/components/custom-tab-check/custom-tab-check-two.vue";
	// import three from "@/components/custom-tab-check/custom-tab-check-three.vue";
	// import analy from "@/components/custom-tab-check/custom-tab-check-analy.vue";
	// import chooseimage from "@/components/custom-tab-check/custom-tab-check-chooseimage.vue";
	
	import { importAdminLayer } from "../../components/olmap/locations";
	
	export default {
		components: {
			olMap,
			MapViewBottomPanel,
			MapViewBasicToolbar,
			
			// one,
			// two,
			// three,
			// analy,
			// chooseimage,
		},
		data() {
			return {
				show: true,
				
				isActive: true,
				hasError: false,
				start: 0,
				end: 0,
				windowHeight: 0,
				maxtop:"90vh",
				mintop:"45vh",
				
				
				rfBottomPanelRefName:"bottom_panel",
				
				rfBaseToolbarStyle:{
					
				},
				
				rfmapVmName:"map",
				rfmapVm:null
			}
		},
		onLoad(options) {
			
			this.windowHeight = uni.getSystemInfoSync().windowHeight;
			
		},
		created(){
			
			
			// var event_name = `$change_tab_${this.rfTabName}`
			// uni.$off(event_name)
			// uni.$on(
			// 	event_name, 
			// 	(ev)=>{
			// 		this.slideBottomPanelTo()
			// 	}
			// )
			
			this.urfcurBottomPanelPos = this.maxtop
			
		},
		mounted(){

			// this.importMapLayers()
			// temp for debug
			// popup the bottom panel
			setTimeout(()=>{this.popupBottomPanel()}, 256)
		},
		methods:{
			//开始触摸
			touchStart(e) {
				//记录手指触摸到屏幕的那一个的位置，计算小黑条的top值
				this.start = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2);
				console.log("debug-mvp touch start", this.start )
			},
			
			touchMove(e) {			
	
				this.$u.throttle((e)=>{
					//step 和 run 方法 查看uniapp官方文档："https://uniapp.dcloud.io/component/uniui/uni-transition?id=基本用法";
					// 其实文档上写需要先初始化init，但是不init也可以使用，不知道为什么
					let top = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100 + "vh";
					if (parseInt(top) >= 80) {
						top = this.maxtop;
						this.isActive = true,
						this.hasError = false
					} else if (parseInt(top) <= 60) {
						top = this.mintop;
						this.isActive = true,
						this.hasError = false
					} else {
						top = top;
						this.isActive = true,
						this.hasError = false
					}
	
					this.slideBottomPanelTo(top)
					
				}, 60, true)
				//节流函数：60ms内，只触发一次，感知不大，这里用的是uview封装好的节流函数，官方文档：https://v1.uviewui.com/js/debounce.html
			},
			//手指离开手机
			touchEnd(e) {
				const start = this.start * 100;
				const end = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100;
				var pos = this.maxtop
				
				if (start > end) {
					// pos = "45%"
					pos = this.mintop
					
				}
				// console.log("debug-mvp touch end", this.end )
				this.slideBottomPanelTo(pos)
			},
			
			// just for web client,
			// maybe some fixup
			onBottomBtnPressed(ev){
				// console.log("debug-mvp ", ev)
				ev["changedTouches"].push({pageX:ev.pageX, pageY:ev.pageY})
				this.touchStart(ev)
			},
			
			onBottomBtnReleased(ev){
				// ev["changedTouches"].push({pageX:ev.pageX, pageY:ev.pageY})
				
				if(this.isBottomPanelPopped())
				{
					this.hideBottomPanel()
				}
				else
				{
					this.popupBottomPanel()
				}
				// this.touchEnd(ev)
			},
			
			//输入框获焦
			focus() {

				// this.slideBottomPanelTo(this.mintop)
				this.popupBottomPanel()
			},
			//输入框失焦
			blur() {

				// this.slideBottomPanelTo(this.maxtop)
				this.hideBottomPanel()
			},
			
			// pos : suggest relative unit
			slideBottomPanelTo(pos, duration){
				
				if(pos==this.urfcurBottomPanelPos){
					return
				}
				// console.log("debug-bottomTab", pos)
				this.urfcurBottomPanelPos = pos
				//step 和 run 方法 查看uniapp官方文档："https://uniapp.dcloud.io/component/uniui/uni-transition?id=基本用法";
				// 其实文档上写需要先初始化init，但是不init也可以使用，不知道为什么
				this.$refs.menuWarp.step({
					top: pos  //面板高度  数值越高，则越低
				}, {
					duration: duration || 180
				});
				this.$refs.menuWarp.run(() => {});
				
			},
			
			hideBottomPanel(){
				
				this.slideBottomPanelTo(this.maxtop)
				
			},
			
			popupBottomPanel(){
				
				this.slideBottomPanelTo(this.mintop)
			},
			
			onRightToolbarClicked(ev){
				
				var btn_key = ev["btnKey"]
				
				if(btn_key=="layer")
				{
					if(this.isBottomPanelPopped())
					{
						this.hideBottomPanel()
					}
					else
					{
						this.popupBottomPanel()
						this.$refs[this.rfBottomPanelRefName].switchTabTo("layer")	
					}
				}
				
			},
			
			isBottomPanelPopped(){
				
				return this.urfcurBottomPanelPos==this.maxtop?false:true
			},
			
			importMapLayers(){
				
				var _this = this
				this.rfmapVm = this.$refs["map"]
				// console.log("debug-mapviepage ", this.$refs, mapVm)
				
				var import_prom = importAdminLayer("city")
				
				var $store = this.$store
				
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
				
				
				importAdminLayer("city")
				.then(
					(lyrObj)=>{
						
						// if(!lyrModel[0]["visible"])
						// {
						// 	lyrObj.setVisible(false)
						// }
						_this.$refs["map"].addLayer(lyrObj,  "city", "default")	
				
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
						
					}
				
				)
				
				// _this.$refs["map"].addLayer(lyrObj,  "city", "default")
				// import_prom.then(
				// 	(result)=>{
				// 		// console.log("debug-zsolmap import layer", _this.rfmapVm)
				// 		// _this.map.addLayer(result)
				// 		// _this.addLayer(result, "city", "default")
				// 		// _this.rfmapVm.addLayer(result,  "city", "default")
				// 		_this.$refs["map"].addLayer(result,  "city", "default")
				// 		// _this.map.render()
						
				// 	}
				// )
				
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
						// _this.addLayer(result, "county", "default")
						
						_this.rfmapVm.addLayer(result, "county", "default")
					}	
				)
				
			}
			
		},
		

	}
</script>

<style lang="scss">
	// #app {
	// 	font-family: Avenir, Helvetica, Arial, sans-serif;
	// 	-webkit-font-smoothing: antialiased;
	// 	-moz-osx-font-smoothing: grayscale;
	// 	text-align: center;
	// 	color: #2c3e50;
	// 	margin-top: 60px;
	// }
	.submit_button {
		
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
	//要给u-transition设置fixed定位
		.menu_warp {
			width: 100vw;
			position: fixed;
			top: 90vh;
			height: 60vh;
			left: 0;
			.warp {
				background: #ffffff;
				border-radius: 40rpx 40rpx 0 0;
				padding-bottom: 600rpx;
				height: 60vh;
				.bar {
					position: relative;
					width: 100%;
					height: 30rpx;
	
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
					// margin-top: 160rpx;
					text-align: center;
					color: #ffffff;
				}
			}
		}
	
		.menu_warp1 {
			width: 100vw;
			position: fixed;
			top: 45vh;
		
			left: 0;
			padding-bottom: 0rpx;
			height: 60vh;
			.warp {
				background: lightblue;
				border-radius: 40rpx 40rpx 0 0;
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
				
					text-align: center;
					color: #ffffff;
				}
			}
		}
	

</style>
