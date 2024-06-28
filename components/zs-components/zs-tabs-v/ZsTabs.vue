<template>
<!-- 	<view :class="['tab',{'tab-fixed':fixed}]"
	> -->
	<view :class="['tab','zs-tabs-hlyt']"
	style="align-items: flex-start;"
	>
		<!-- scroll-with-animation -->
		<scroll-view 
		:class="['tab-bar',{'tab-bar-center':tabCenter}]" 
		scroll-y="true" 
		:scroll-into-view="scrollId" 
		:style="{backgroundColor:tabBarBgColor}"
		scroll-with-animation
		>
			<slot name="tab-bar"
			v-bind:data = "tabList"
			>
				<view
				v-for="(item,index) in tabList" 
				class="tab-bar-item" 
				:class="{'active':tabIndex==index}" 
				:id="`tab_${index}`" 
				:style="[{'padding':`0 ${tabSpacing}rpx`},tabIndex==index?activeTextStyle:defaultTextStyle]" 
				:key="index" 
				@click="switchTab(index)">
					<!-- <text class="txt">{{item.label}}</text>
					<text class="active-line" v-if="tabIndex==index" :style="[activeLineStyle]"></text> -->
					<slot 
					name="tab-bar-item" 
					v-bind:data="makeTabItemSlotData(item,index)"
					>
						<text class="txt">{{item.label}}</text>
						<text class="active-line" v-if="tabIndex==index" :style="[activeLineStyle]"></text>
					</slot>
				</view>
			</slot>
			
		</scroll-view>
		<!-- <scroll-view
		scroll-x="true" 
		scroll-y="true" 
		
		:style="{backgroundColor:tabPanelBgColor}"
		>
			<view 
			class="tab-cont" 
			>
				<slot></slot>
			</view>			
		</scroll-view> -->
		

<!-- :style="{'backgroundColor':tabPanelBgColor,'transform':`translateY(${translateX}%)`,'transition':`transform ${d/1000}s ease-in-out`}" -->
		<view
		class="tab-cont" 
		:style="rftabPanelStyle"
		
		>
			<slot></slot>
		</view>	
		
	</view>
</template>
<script>
	export default {
		// reference the custom-tab-check
		name: "ZsTabs",
		
		props: {
			type: {
				type: [String],
				default: ''
			},
			value: { // 默认选中项
				type: [Number, String],
				default: 0
			},
			tabSpacing: { // tabbar的间距
				type: [Number, String],
				default: 20
			},
			animation: { // 切换动画
				type: Boolean,
				default: true
			},
			duration: { // 滑动动画时长 单位毫秒
				type: [Number, String],
				default: 200
			},
			tabCenter: { // tabbar是否居中
				type: Boolean,
				default: false
			},
			fixed: { // 该组件是否固定位置
				type: Boolean,
				default: false
			},
			defaultTextStyle: { // 未选中文字的样式
				type: [Object]
			},
			activeTextStyle: { // 选中后文字的样式
				type: [Object]
			},
			activeLineStyle: { // 选中下划线的样式
				type: [Object]
			},
			tabItemLyrDirection:{
				type:String,
				default:"v"
			},
			tabBarPlacement:{
				type:String,
				default:"right"
			},
			tabBarBgColor:{
				type:String,
				default:"gray"
			},
			tabPanelBgColor:{
				type:String,
				default:"gray"
			},
			tabPanelStyle:{
				type:[Object],
			}
		},
		data() {
			return {
				tabList: [],
				tabIndex: 0,
				d: this.duration,
				// animationDuraction:this.duration,
				translateX: 0,
				scrollId: 'tab_0',
				top: 0,
				timer: 0,
				timer2: 0,
				watchTabValueKey: `watchTabValue_${this.type}`,
				putChangeKey: `putChange_${this.type}`,
				
				rfvisible:true,
				// rftabPanelFixStyle:{
				// 	'backgroundColor':this.tabPanelBgColor,
				// 	'transform':`translateY(${this.translateX}%)`,
				// 	'transition':`transform ${this.d/1000}s ease-in-out`
				// },
				rftabPanelFixStyle:{},
				rftabPanelStyle:{}
			}
		},
		created() {
			uni.$off(this.watchTabValueKey);
			uni.$on(this.watchTabValueKey, o => {
				if (o.name.split('_')[0] != this.type) return false;
				if (typeof o.oldValue == 'undefined') {
					this.tabList.push({
						label: o.newValue,
						name: o.name
					});
					if (this.timer) clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						if (this.tabList[this.value]) this.putChange(this.tabList[this.value].name);
					}, 5)
				} else this.tabList.forEach(item => {
					if (item.label == o.oldValue && item.name == o.name) item.label = o.newValue;
				})
			})
			
			this.initRenderStyle_()
		},
		watch: {
			value: {
				handler(val) {
					this.tabChange(val);
				},
				immediate: true
			},
			animation: {
				handler(val) {
					if (!val) this.d = 0;
				},
				immediate: true
			}
		},
		methods: {
			tabChange(index) {
				
				// console.log("debug-tab tabchange", index)
				
				if (this.tabIndex == index) return false;
				this.tabIndex = index;
				// animation
				// this.translateX = -100 * index;
				// this.translateX = -0 * index;
				// this.translateX = 100 * index;
				this.$nextTick(() => {
					this.scrollId = `tab_${index-1}`;
				})
				
				if (this.timer2) clearTimeout(this.timer2);
				this.timer2 = setTimeout(() => {
					if (this.tabList[index]) {
							this.$emit('change', {
								value: index,
								...this.tabList[index]
							});
						
					}
					
				}, 20)
				
				// setTimeout(()=>{
				// 	this.translateX = 0;
				// }, 128)
				this.translateX = -0 * index;
				
			},
			putChange(name, index) {
				if (this.tabIndex == index) return false;
				uni.$emit(this.putChangeKey, {
					name: name,
					duration: this.d,
					type: index > this.tabIndex ? 1 : 2
				});
			},
			switchTab(target){
				
				var tab_key;
				var index;
				var tabItem;
				
				if(typeof target == "number"){
					index = target
					tabItem= this.tabList[index]
					// tab_key = tabItem["name"]
				}
				else if(typeof target=="string"){
					
					index = -1
					for(var i in this.tabList)
					{
						if(this.tabList[i]["name"]==target){
							index = i
							tabItem = this.tabList[i]
							break
						}
					}
				}
				
				if(!tabItem){
					console.log(`debug-zstabs attemp to switch tab to '${target}', but not found it`)
					return
				}
				tab_key = tabItem["name"]
				this.putChange(tab_key, index)
				this.tabChange(index)
				
			},
			
			setPanelVisible(target){
				
				// if(target=="all")
				this.rfvisible = false
			},
			
			
			
			makeTabItemSlotData(item, index){
				return {
					item:item,
					index: this.tabIndex==index,
					name:item.name,
				}
			},
			
			initRenderStyle_(){
				
				this.rftabPanelFixStyle = {
					'backgroundColor':this.tabPanelBgColor,
					'transform':`translateY(${this.translateX}%)`,
					'transition':`transform ${this.d/1000}s ease-in-out`
				}
				if(this.tabPanelStyle){
					Object.assign(this.rftabPanelStyle, this.rftabPanelFixStyle)
					Object.assign(this.rftabPanelStyle, this.tabPanelStyle)
				}
				// if(this.tabPanelBgColor){
				// 	this.rftabPanelStyle["backgroundColor"] = this.tabPanelBgColor
				// }
			}
		}
	}
</script>
<style>
	/* #ifndef APP-PLUS-NVUE */
	>>> ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */
	.tab-bar.tab-bar-center {
		text-align: center;
	}
</style>
<style scoped lang="scss">
	.zs-tabs-vlyt {
		display: block;
	// 	flex-direction: row;
	// 	align-items: center;
	
	// 	justify-content: end;
	}
	
	.zs-tabs-hlyt {
		// display: flex;
		// flex-direction: row;
		// align-items: center;
		// justify-content: end;
		
	}
	
	.tab {
		// #ifndef APP-PLUS-NVUE
		display: flex;
		// origin version
		// flex-direction: column;
		flex-direction: row;
		overflow-x: hidden;

		// #endif
		// width:40%;
		
		// background-color: darkgray;
		// zs version
		.tab-bar {
			position: relative;
			// height: 90rpx;
			// height: 512rpx;
			width:auto;
			// #ifndef APP-PLUS-NVUE
			white-space: nowrap;
			// #endif
			background-color: #fff;

			// #ifndef APP-PLUS-NVUE
			&::after {
				content: '';
				width: 100%;
				height: 2rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				background: #ccc;
			}

			// #endif
			&-item {
				// #ifndef APP-PLUS-NVUE
				// display: inline-block;
				display: block;
				// #endif
				height: 32rpx;
				line-height: 32rpx;
				font-size: 16rpx;
				
				color: #222;
				text-align: center;

				&.active {
					position: relative;
					color: #007AFF;
				}

				
				// #ifndef APP-PLUS-NVUE
				// vertical
				// .active-line {
				// 	position: absolute;
				// 	bottom: 2rpx;
				// 	left: 50%;
				// 	transform: translateX(-50%);
				// 	width: 80rpx;
				// 	height: 2rpx;
				// 	background: #007AFF;
				// }
				// horizontal
				.active-line {
					position: absolute;
					top: 50%;
					right: 1px;
					transform: translateY(-50%);
					width: 2rpx;
					height: 80rpx;
					background: #007AFF;
				}
				// #endif
			}
		}
		
		// origin version
		// .tab-bar {
		// 	position: relative;
		// 	height: 90rpx;
		// 	// #ifndef APP-PLUS-NVUE
		// 	white-space: nowrap;
		// 	// #endif
		// 	background-color: #fff;

		// 	// #ifndef APP-PLUS-NVUE
		// 	&::after {
		// 		content: '';
		// 		width: 100%;
		// 		height: 2rpx;
		// 		position: absolute;
		// 		bottom: 0;
		// 		left: 0;
		// 		background: #ccc;
		// 	}

		// 	// #endif
		// 	&-item {
		// 		// #ifndef APP-PLUS-NVUE
		// 		display: inline-block;
		// 		// #endif
		// 		height: 90rpx;
		// 		line-height: 90rpx;
		// 		font-size: 30rpx;
		// 		color: #222;
		// 		text-align: center;

		// 		&.active {
		// 			position: relative;
		// 			color: #007AFF;
		// 		}

		// 		// #ifndef APP-PLUS-NVUE
		// 		.active-line {
		// 			position: absolute;
		// 			bottom: 2rpx;
		// 			left: 50%;
		// 			transform: translateX(-50%);
		// 			width: 80rpx;
		// 			height: 2rpx;
		// 			background: #007AFF;
		// 		}

		// 		// #endif
		// 	}
		// }

		&-fixed {
			height: 100vh;

			.tab-bar {
				position: sticky;
				top: 0px;
				z-index: 2022;
			}
		}

		.tab-cont {
			// origin version
			
			// #ifndef APP-PLUS-NVUE
			display: flex;
			// #endif
			flex-direction: row;
			// padding: 20rpx 0;
			// padding: 2rpx 0;
			
			border-radius: 0rem 0.5rem 0.5rem 0.5rem;
			// border-top-right-radius: 0.5rem;
			// border-bottom-right-radius: 0.5rem;
			// display: block;
		}
	}
</style>
