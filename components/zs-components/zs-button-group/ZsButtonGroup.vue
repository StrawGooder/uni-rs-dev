<template>
	
<!-- 	<view>
		
			<view v-for="(it,ind) in items" :key="ind">
				<image 
				:src = "loadSVG(it.icon)"
				:style="rfStyle">
				</image>
			</view>	
	
	</view> -->
	
	<uni-row v-if="layoutDir=='h'">
		<uni-col 
		v-for="(it,ind) in items" 
		:key="ind"
		:span="computedItemCol"
		>
		<!-- 	<view>
				<image 
				:src = "loadSVG(it)"
				:style="renderItemStyle(it)">
				</image>
			</view>	 -->	
			
		<!-- 	<ZsButton
			v-if="it.compType=='base'"
			v-bind="mergeItemProps(it)"
			>
				
			</ZsButton> -->
			<ZsButtonSta2
			v-bind="mergeItemProps(it)"
			>
				
			</ZsButtonSta2>
		</uni-col>
	
	</uni-row>
	<uni-row
	v-else
	>
		<view
		v-for="(it,ind) in items" 
		:key="ind"
		:span="computedItemCol"
		>
		<!-- 	<view>
				<image 
				:src = "loadSVG(it)"
				:style="renderItemStyle(it)">
				</image>
			</view>	 -->	
			
		<!-- 	<ZsButton
			v-if="it.compType=='base'"
			v-bind="mergeItemProps(it)"
			>
				
			</ZsButton> -->
			<ZsButtonSta2
			v-bind="mergeItemProps(it)"
			>
				
			</ZsButtonSta2>
		</view>	
	</uni-row>
	
	

</template>

<script>
	
import { defineComponent, h, render } from "vue" 
import ZsButton from "./ZsButton.vue"
import ZsButtonSta2 from "./ZsButtonSta2.vue"
import {getSVG} from "../zs-icon/iconSet.js"


export default {
	
	name:"ZsButtonGroup",
	
	components:{
		ZsButton,
		ZsButtonSta2
	},
	
	props:{
		
		items:{
			type:Array,
			required:true
		},
		
		itemSize:{
			type:[Number, String, Array],
			default:24
		},
		
		featMode:{
			type:String,
			default:""
		},
		
		layoutDir:{
			type:String,
			default:"h"
		}
		
	},
	
	data(){
		return {
			
			rfClass:["hlyt"],
			
			// rfImgSrc: getSVG("eye")
			rfStyle:{},
			
			rfItemCol:2,
			rfColTotal:24,
		}
	},
	
	computed:{
			
		computedItemCol:{
			get:function(){
				return this.rfColTotal / this.items.length
			}
		}
		
	},

	
	created(){
		
		this._initRenderStyle()
		
	},
	
	methods:{
		
		_initRenderStyle(){
			
			var props = this.$props
			
			var pitem_size = props.itemSize || 16
			
			// if(isArray(pitem_size))
			// {
				
			// }
			
			var item_w = `${pitem_size}px`,
			item_h = `${pitem_size}px`;
			
			this.rfStyle = {
				"width":item_w,
				"height":item_h
			}
			
			
		},
		
		renderItemStyle(item){
			
			var style = Object.assign({"color": item["color"]}, this.rfStyle)
			return style
			
		},
		
		mergeItemProps(item){
			
			item["size"] = this.itemSize
			
			return item
		},
		
		loadSVG(item){
			
			return getSVG(item.icon)
		}
		// renderStart(){
		// 	var props = this.$props
			
		// 	var dataIcon = h("view");
		// 	var text = h("view", {}, [props.text]);
			
		// 	return h("view", {class:this.refClass}, [dataIcon, text])
		// },
		
		// renderMiddle(){
			
		// },
		
		// renderEnd(){
			
		// }
		
	},
	
	
	// render(h){
		
	// 	var props = this.$props
		
	// 	var vn_childs = []
		
	// 	var pitems = props.items
		
	// 	var iter_item
		
	// 	var new_btn
		
	// 	for (let i in pitems) {
			
	// 		iter_item = pitems[i]
			
	// 		// new_btn = h("image", {props:{src:getSVG(iter_item["icon"])}})
			
	// 		new_btn = h("uni-image", 
	// 		{
	// 			props:
	// 			{
	// 				src:"../zs-icon/resources/imgs/svg/house2.svg",
	// 			},
	// 			// src:"static/imgs/svg/house.svg",
	// 			// src:"../zs-icon/resources/imgs/svg/house2.svg",
	// 		}
	// 		)
			
	// 		vn_childs.push(new_btn)
			
	// 		// vn_childs.push(
	// 		// 	h("button", 
	// 		// 	{}, 
	// 		// 	[iter_item["text"]],
	// 		// 	)
	// 		// )
	// 	}
		
	// 	vn_childs.push(h("uni-view",{}, ["aa"]))
		
	// 	return h("uni-view", {}, vn_childs)
		
	// }
	
}
	
</script>

<style>
</style>