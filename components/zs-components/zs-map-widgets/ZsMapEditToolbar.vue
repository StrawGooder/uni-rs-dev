<template>
	<view>
	
		<scroll-view scroll-y style="height: 530rpx;">


			<view
			class="zs-hlyt"
			>
				<ZsButtonGroup
				:items = "rfitems"
				:itemStyle="rfitemStyle"
				@click="onBtnGroupClick"
				:gutter="3"
				gutterColor="gray"
				borderColor="gray"
				:borderWidth="2"
				enableMutex
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
		name:"ZsMapEditToolbar",
		props: ['id'],
		data() {
			return {
				// listColumns:['图斑编号','图斑类型','图斑面积'],
				device: '',
				list: [], //要展示的数据	,
				rfitemStyle:{
					"color":"blue",
					"bgColor":"orange",
					"bgColorDisabled":"white"
				},
				rfitems:[
							// {name:"select",icon:"b-pointerFill", iconDisabled:"b-pointer", color:"orange",colorDisabled:"black",status:0},
							{name:"select",icon:"b-pointerFill",status:0},
							// {name:"draw",icon:"pencilFill", iconDisabled:"pencil", color:"orange",colorDisabled:"black",status:0},
							
							{name:"draw", icon:"aspose-polygon", status:0},
							{name:"doodle", icon:"aspose-doodle", status:0},
							{name:"edit", icon:"stopBtn",iconDisabled:"pencilSquare", color:"blue",colorDisabled:"blue",status:0},
							// {name:"edit", icon:"stopBtn",status:0},
							{name:"rectangle", icon:"b-rectangle", status:0, borderWidth:2, borderColor:"red"},
							{name:"polygon", icon:"b-polygon", status:0, bgColor:"red", bgColorDisabled:"white"},
							{name:"circle", icon:"b-circle", status:0, bgColor:"green", bgColorDisabled:"white"},
							{name:"point", icon:"crosshair2", status:0, bgColor:"yellow",bgColorDisabled:"white"},
							{name:"point", icon:"aspose-forward", reflection:"x", status:0, color:"cyan"},
							{name:"point", icon:"aspose-forward", status:0, color:"green"},
						],
				rfdrawStyleList:["normal", "metric"],
				
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
