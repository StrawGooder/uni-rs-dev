<template>

	<view class = "map-obj-list-item">
	
		<!-- <image src="../../static/house.svg"></image>	 -->
		
	<!-- 	<view style="color:yellow">
			<ZsIcon icon="eyeFill">
				
			</ZsIcon>
			
		</view>
		<view style="color:yellow">
			<ZsIcon icon="airplaneFill">
				
			</ZsIcon>
			
		</view> -->
		
	<!-- 	<view>
			
			<ZsButtonGroup
			:items = "rfopBtnItems"
			>
				
			</ZsButtonGroup>
			
		</view> -->
		
		<!-- <uni-row>
			<uni-col :span='2'>
				<ZsButtonGroup
				:items = "rfgeoFeatitems"
				>
					
				</ZsButtonGroup>	
			</uni-col>
			<uni-col :span="rfColNum">
				<view>
					{{text}}
				</view>
			</uni-col>
			<uni-col :span="rfColNum">
				<ZsButtonGroup
				:items = "rfopBtnItems"
				>	
				</ZsButtonGroup>
			</uni-col>
		</uni-row> -->
		
		<view class="zs-hlyt"
		@click="onItemClicked"
		>
			
			<view class="zs-hlyt" style="width:50%">
				<view>
					
					<!-- <ZsIcon
					icon="rectangle"
					:color="iconColor"
					>
					</ZsIcon>	 -->				
					<ZsButtonGroup
					:items = "rfgeoFeatitems"
					>
						
					</ZsButtonGroup>		
				</view>
				
				<view>
					{{text}}
				</view>
				
			</view>
			<view 
			v-if="!hideOpBtn"
			style="width:50%; display: flex;justify-content: end;"
			>
				<ZsButtonGroup
				:items = "rfopBtnItems"
				:index="seqid"
				@click="onButtonGroupClicked"
				
				>	
				</ZsButtonGroup>				
				
			</view>
		</view>
		
	</view>
	
	
</template>

<script>


import { h, ref, computed, mounted, unMounted } from "vue" ;

import ZsButtonGroup from "../../components/zs-components/zs-button-group/ZsButtonGroup.vue";
import ZsIcon from "../../components/zs-components/zs-icon/ZsIcon.vue";
// import ZsIconVue from "../../components/zs-components/zs-icon/ZsIcon.vue";
export default {
	
	name:"MapObjListItem",
	
	components:{
		ZsButtonGroup,
		ZsIcon
	},
	
	props:{
		
		text:{
			type:String,
			required:true
		},
		
		dataSrcType:{
			type:String,
			default:"vector"
		},
		
		dataType:{
			type:String,
			default:"multipolygon"
		},
		
		iconColor:{
			type:String,
			default:"red"
		},
		
		status:{
			type:String,
			default:"normal"
		},
		
		seqid:{
			type:Number
		},
		xprops:{
			type:Object,
			default:()=>{return {}}
		},
		
		hideOpBtn:{
			type:Boolean
		}
		
	},
	
	data(){
		return {
			
			rfColNum : 8,
			rfClass:["hlyt"],
			
			rfgeoFeatitems:[{"icon": "b-rectangle", "color":this.iconColor}],
			rfopBtnItems:
			[
				{"icon":"eyeFill", "name":"shown", "colorDisabled":"black", "iconDisabled":"eyeSlash",
					"status":this.xprops["visible"]==false?0:1
				},
				{"icon":"refresh", "name":"refresh", "color":"green"},
			],
			// rfopBtnItems:[{"text":"eye"},{"text":"eye"}]
		}
	},
	
	created(){
		
		// var r = ref(2);
		// console.log(`debug vue version ${Vue.version}`)
		
	},
	
	methods:{
		
		
		onButtonGroupClicked(ev){
			
			ev["item"] = this.getFormData()
			
			this.$emit("clickButton", ev)
	
		},
		
		onItemClicked(ev){
		
			ev["item"] = this.getFormData()
			
			this.$emit("clickItem", ev)	
		},
		
		// assembleEventData(ev){
			
		// 	var formData = this.getFormData()
		// 	ev["item"] = formData
		// 	// ev["seqid"] = formData["seqid"]
		// },
		
		getFormData(){
			
			return {
				text:this.text,
				seqid:this.seqid
			}
		}
		// renderStart:function(h){
			
		// 	var props = this.$props
			
		// 	var dataIcon = h("uni-view");
		// 	var text = h("uni-view", {}, [props.text]);
			
		// 	return h("uni-view", {class:this.refClass}, [dataIcon, text])
		// },
		
		// renderMiddle:function(h){
			
		// },
		
		// renderEnd:function(h){
			
		// 	var items = [
		// 		{
		// 			icon:"eye"
		// 		},
		// 		{
		// 			icon:"eye"
		// 		}
		// 	]
			
		// 	return h("ZsButtonGroup", {props:{items:items}})
		// }
		
	},
	
	
	// render(h){
		
	// 	var ret_vn;
	// 	// var props = this.$props
		
	// 	// var dataIcon = h("view");
	// 	// var text = h("view", {}, [props.text]);
		
	// 	// return h("view", {class:this.refClass}, [dataIcon, text])
	// 	// var ret_vn = this.renderStart(createElem)
	
	// 	var start_vn = this.renderStart(h)
	// 	var end_vn = this.renderEnd(h)
		
	// 	ret_vn = h("uni-view", {}, [start_vn, end_vn])
		
	// 	return ret_vn
		
	// },

	
	// onLoad(){
		
	// 	var r = ref(2);
	// }
	
}
	
</script>

<style>
	
	.map-obj-list-item{
		/* color:yellow */
	}
	

	
</style>