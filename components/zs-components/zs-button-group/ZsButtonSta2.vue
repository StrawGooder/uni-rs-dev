<template>
	
<!-- 	<view
	:style="renderStyle()"
	:class="rfImgClass"
	@click="onClicked"
	>
	</view> -->
	<view v-if="computedContentMode=='icon'">
	<!-- 	<image
		:src = "loadSVG(icon)"
		:style="renderStyle()"
		:class="rfImgClass"
		>
		</image> -->
		<!-- <ZsIcon :icon="computedIcon"></ZsIcon> -->
		
		<view
		:style="renderStyle()"
		:class="rfImgClass"
		@click="onClicked"
		>
			<ZsIcon :icon="computedIcon"></ZsIcon>
		</view>
		<!-- <ZsIcon :icon="icon"></ZsIcon> -->
	</view>
	<view v-else-if="computedContentMode=='text'">
		<button
		:style="renderStyle()"
		:class="rfImgClass"
		@click="onClicked"
		>
			{{computedText}}
		</button>
	</view>
	<view v-else
	>
		<button
		:style="renderStyle()"
		:class="rfImgClass"
		@click="onClicked"
		>
			<image
			:src = "loadSVG(computedIcon)"
			>
			<!-- :style="renderStyle()" -->
			</image>	
			{{computedText}}
		</button>
	</view>		
		



</template>

<script>
	
// import { defineComponent, h, render } from "vue" ;
// import {getSVG} from "../zs-icon/iconSet.js";
// import ZsIcon from "../zs-icon/ZsIcon.vue";
// import ZsButtonBase from "./ZsButtonBase.vue";
import ZsButtonBase from "./ZsButton.vue";


export default {
	
	// as switcher button
	// 2 status: 1 is on, 0 is off
	name:"ZsButtonSta2",
	
	mixins:[ZsButtonBase],
	
	props:{
		
		textDisabled:{
			
			type:String,
			// default:""
		},
		
		iconDisabled:{
			type:String,
			// default:null
		},
		
		colorDisabled:{
			type:String,
			// default:"blue"
		},
		
		bgColorDisabled:{
			type:String
		},
		// bgColor:{
		// 	type:String,
		// 	default:"cyan"
		// },
		// status:{
		// 	type:String,
		// 	default:"on"
		// },
		status:{
			type:Number,
			default:1
		},
		
		borderWidth:{
			type:[String,Number],
		},
		borderColor:{
			type:String,
			default:"black"
		},
		
		reflection:{
			type:String,
			default:""
		}
	},
	
	data(){
		return {
			
			// rfstatus: this.status=="on"? 1 : 0 ,
			rfstatus: this.status>0?true:false,
			// rfstatus: 0,
			
			rfClass:["hlyt"],
			rfImgClass:["svg-img"],
			// rfImgSrc: getSVG("eye")
			rfStyle:{},
			
			// rfcontainerBaseStyle:{},
			rfcontainerBaseStyle:{},
		}
	},
	
	computed:{
		
		
		computedText:{
			
			get:function(){
				
				if(!this.isOff())
				{
					return this.text
				}
				
				return this.textDisabled || this.text + "&nbsp"
			}		
			
		},
		
		computedIcon:{
			
			get:function(){
				
				if(!this.isOff())
				{
					return this.icon
				}
				
				return this.iconDisabled || this.icon
			}
		},
		
		
		// computedColor:{
			
		// 	get:function(){
				
		// 		if(!this.isOff())
		// 		{
		// 			return this.color
		// 		}
				
		// 		return this.colorDisabled || this.color
					
		// 	}
		// },
		
		computedColorStyle:{
			get:function(){
				
				if(this.isOff())
				{
					return {
						"color":this.colorDisabled || this.color,
						"backgroundColor":this.bgColorDisabled || this.bgColor
					} 
				}
				
				return {
					"color":this.color,
					"backgroundColor":this.bgColor
				} 
			}
			
		},
		
		computedContentMode:{
			
			get:function(){
				
				var props = this
				// console.log("debug-zsbtn ", this.$props)
				var mode = "icon"
				
				if(props.icon==null || props.icon==undefined)
				{
					mode = "text"
				}
				else if( props.text!="")
				{
					mode = "text&icon"
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
			this.rfcontainerBaseStyle = {}
			var contentMode = this.computedContentMode
			if(contentMode=="text" || contentMode=="icon&text")
			{
				
				this.rfcontainerBaseStyle = {
					// color: this.computedColor,
					height: `${this.size}px`,
					// width: `${this.size}px`,
					// fontSize-2 temp process, let the icon(svg) size
					// large than the font size
					fontSize:`${this.size-2}px`,
					// adapting the content(text)
					display:"inline",
					// padding:"2px",
					padding:"0.25em"
				}	
			}
			else if(contentMode=="icon")
			{
				
				this.rfcontainerBaseStyle = {
					// color: this.computedColor,
					height: `${this.size}px`,
					width: `${this.size}px`,
					// fontSize-2 temp process, let the icon(svg) size 
					// large than the font size
					fontSize:`${this.size-2}px`,
					
				}	

			}
			// var borderWidth = this.borderWidth
			// if(borderWidth)
			// {
			// 	// this.rfcontainerBaseStyle["borderColor"] = this.borderColor
			// 	// if(typeof borderWidth == 'Number')borderWidth = `${borderWidth}px`
			// 	// if(borderWidth instanceof Number)borderWidth = `${borderWidth}px`
			// 	// this.rfcontainerBaseStyle["borderSize"] = borderWidth
			// 	this.rfcontainerBaseStyle["border"] = `${this.borderColor} ${borderWidth}px solid`
			// }
			
			// console.log("debug-zsbtnsta2 ", this.rfcontainerBaseStyle)
			
			if(this.reflection=="x"){
				this.rfcontainerBaseStyle["transform"] = 'scaleX(-1)'
			}

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
			

			var style = {}
			Object.assign(this.rfcontainerBaseStyle, this.computedColorStyle)
			// Object.assign(style, this.rfcontainerBaseStyle)
			
			// notes: if the object holding the style 
			// isn't reactive variable( option api's data scope)
			 // and the color value was changed , need to 
			// return new object, because vue can't react the changes
			// passing same object,
			// but if the object is reactive variable
			
			// console.log("debug-zsbtn ", this.rfcontainerBaseStyle)
			return this.rfcontainerBaseStyle
			// return style
			
		},
		
		// loadSVG(icon){
			
		// 	return getSVG(icon)
		// },
		
		isOff(){
			// return this.rfstatus<1?true:false
			return !this.rfstatus
		},
		
		// onClicked(ev){
		// 	// this.rfstatus = !this.rfstatus
		// },
		
		onClicked(ev){
			
			this.rfstatus = !this.rfstatus
			// console.log("debug-zsbtn ", this.rfstatus)
			var evPro = {
				
				naiveEvent:ev,
				btnKey:this.name,
				name:this.name,
				data:{
					enabled:this.rfstatus
				}
			}
			this.$emit("click", evPro)

		},
		setCheck(val){
			this.rfstatus = val
		}
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
	/* what about the code useing meanings */
	.svg-img::before{
		background-color: green;
	}
	.svg-img{
		/* background-color: green; */
	}
	
</style>