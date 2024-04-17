<template>
	
	<view
	:style="renderStyle()"
	:class="rfImgClass"
	>
		<view v-if="computedContentMode=='icon'">
		<!-- 	<image
			:src = "loadSVG(icon)"
			:style="renderStyle()"
			:class="rfImgClass"
			>
			</image> -->
			<ZsIcon :icon="icon"></ZsIcon>
			
		</view>
		<view v-else-if="computedContentMode=='text'">
			<button>
				{{text}}
			</button>
		</view>
		<view v-else>
			<button>
				<image
				:src = "loadSVG(icon)"
				:style="renderStyle()">
				</image>	
				{{text}}
			</button>
		</view>		
		
		
	</view>


</template>

<script>
	
import { defineComponent, h, render } from "vue" ;
import {getSVG} from "../zs-icon/iconSet.js";
import ZsIcon from "../zs-icon/ZsIcon.vue";


export default {
	
	name:"ZsButton",
	
	components:{
		ZsIcon
	},
	
	props:{
		
		text:{
			
			type:String,
			default:""
		},
		
		icon:{
			type:String,
			default:null
		},
		
		color:{
			type:String,
			default:"blue"
		},
		
		size:{
			type:Number,
			default:16
		}
		
	},
	
	data(){
		return {
			
			rfClass:["hlyt"],
			rfImgClass:["svg-img"],
			// rfImgSrc: getSVG("eye")
			rfStyle:{}
		}
	},
	
	computed:{
		
		computedContentMode:{
			
			get:function(){
				
				var props = this
				// console.log("debug-zsbtn ", this.$props)
				var mode = "icon"
				
				if( props.text!="" && props.icon!="")
				{
					mode = "text&icon"
				}
				else if(props.icon==null || props.icon==undefined)
				{
					mode = "text"
				}
				return mode
				// return "text"
				// return "icon"
			}
		},
	// 	computedContentMode(){
	
	// 		// var props = this
	// 		console.log("debug-zsbtn ", this)
	// 		// var mode = "icon"
			
	// 		// if( props.text!="" && props.icon!="")
	// 		// {
	// 		// 	mode = "text&icon"
	// 		// }
	// 		// else if(props.icon==null || props.icon==undefined)
	// 		// {
	// 		// 	mode = "text"
	// 		// }
			
	// 		// return mode
	// 		// return "text"
	// 		return "icon"		
	// 	}
		
		
	
	},
	
	created(){
		
		this._initRenderStyle()
		
	},
	
	methods:{
		
		_initRenderStyle(){
			
			// var props = this.$props
			
			// var pitem_size = props.itemSize || 16
			
			// // if(isArray(pitem_size))
			// // {
				
			// // }
			
			// var item_w = `${pitem_size}px`,
			// item_h = `${pitem_size}px`;
			
			// this.rfStyle = {
			// 	"width":item_w,
			// 	"height":item_h
			// }
			
			
		},
		
		// getContentMode(){
			
		// 	var props = this.$props
		// 	var mode = "text"
			
		// 	if(props.icon!="" && props.text!="")
		// 	{
		// 		mode = "text&icon"
		// 	}
		// 	else if(props.text=="")
		// 	{
		// 		mode = "icon"
		// 	}
			
		// 	return mode
		
		// },
		
		renderStyle(item){
			
			var style = {
				color:this.color,
				height: `${this.size}px`,
				width: `${this.size}px`,
			}
			return style
			
		},
		
		loadSVG(icon){
			
			return getSVG(icon)
		},
		// loadSVG2(icon){
			
		// 	return getSVG(icon)
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
	
	.svg-img::before{
		background-color: green;
	}
	.svg-img{
		/* background-color: green; */
	}
	
</style>