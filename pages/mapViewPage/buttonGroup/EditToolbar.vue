<template>
	<view>
	
		<scroll-view scroll-y style="height: 530rpx;">


			<view
			class="zs-hlyt"
			>
				<ZsButtonGroup
				:items = "rfitems"
				@click="onBtnGroupClick"
				>
					
				</ZsButtonGroup>
			<!-- 	<ZsButtonSta2
				name="edit"
				text="stop edit"
				textDisabled="edit"
				color="black"
				bgColor="orange"
				bgColorDisabled="white"
				:status="0"
				@click="onBtnGroupClick"
				>
					
				</ZsButtonSta2>	 -->
				<view>绘制样式：</view>
				<xfl-select 
				:list="rfdrawStyleList" 
				:clearable="false" 
				:showItemNum="10" 
				:listShow="false" 
				:isCanInput="false"
				:style_Container="'height: 30px; font-size: 16px;width:100px'" 
				:placeholder="'placeholder'"
				:initValue="'base'" 
				:selectHideType="'hideAll'" 
				v-model="list[0]" 
				@change="changeEditStyle"
				>
				<!-- style="width:100px" -->
				</xfl-select>
				
			</view>
		</scroll-view>
	
	</view>
</template>

<script>
	import {
		getShpOne
	} from '@/utils/getData.js';
	import xflSelect from '@/components/xfl-select/xfl-select.vue'; //导入
	import ZsButtonSta2 from "@/components/zs-components/zs-button-group/ZsButtonSta2.vue"
	import ZsButtonGroup from "@/components/zs-components/zs-button-group/ZsButtonGroup.vue"
	import {mapMutations} from "vuex"
	export default {
		props: ['id'],
		data() {
			return {
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				device: '',
				list: [], //要展示的数据	,
				
				rfitems:[
							{name:"select",icon:"pointerFill", iconDisabled:"pointer", color:"orange",colorDisabled:"black",status:0},
							// {name:"draw",icon:"pencilFill", iconDisabled:"pencil", color:"orange",colorDisabled:"black",status:0},
							
							{name:"draw", icon:"drawPolygon", status:1},
							{name:"doodle", icon:"drawDoodle", status:1},{name:"edit", icon:"stopBtn",iconDisabled:"pencilSquare", color:"orange",colorDisabled:"black",status:0},
							{name:"polygon", icon:"polygonGraph", status:1},
							{name:"circle", icon:"circleGraph", status:1},
							{name:"point", icon:"crosshair2", status:1},
						],
				rfdrawStyleList:["normal", "metric"]
			}
		},
		components: {
			xflSelect,
			ZsButtonSta2,
			ZsButtonGroup
		}, //注册为子组件
		methods: {
			
			// ...mapMutations(
			// 	"modules/map",
			// 	{"setMapUseMode":"setUseMode"}
			// ),
			
			//获取选中的的值
			change(e) {
				console.log("----------------------", e.newVal);
			},
			get_value() {
				this.list = [ //要展示的数据
					'耕地',
					'林地',
					'草地',
					'建筑物'
				]
			},
			
			onBtnGroupClick(ev){
				
				var btnKey = ev["btnKey"]
				var evData = ev["data"]
				
				if(btnKey=="edit")
				{
					var enabled = evData["enabled"]
					// uni.$emit("map::openDrawInteraction", )
					// this.$store.setUseMode("")
					// this.$store.setUseMode("")
					// this.setMapUseMode(enabled?"edit":"view")
					// uni.$emit("map:setProps", {"usedMode":enabled})
					uni.$emit("map:setProps", {"usedMode":enabled})
				}
				else
				{
					var enabled = evData["enabled"]
					uni.$emit("map:setProps", 
					// {"interactionType":enabled==true?btnKey:"$back", "pluginName":btnKey},
					{
						"interaction":{
						"type":enabled==true?btnKey:"$back",
						"pluginName":btnKey
						},
					}
					)
				}
				
				console.log("debug-zsolmap ", ev)
				
			},
			
			changeEditStyle(event){
				
				var val = event["newVal"]
				uni.$emit("map:setProps", {"drawTheme":val})
				// console.log("debug-spaanal ", val)
			}
		},
		mounted() {
			this.get_value()
		}
	}
</script>

<style lang="scss">
	
</style>
