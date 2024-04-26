

<script>
	
// import { defineComponent, h, render } from "vue" 
import ZsButton from "./ZsButton.vue"
import ZsButtonSta2 from "./ZsButtonSta2.vue"
import {getSVG} from "../zs-icon/iconSet.js"
// import UniRow from "@/uni_modules/uni-row/components/uni-col/uni-col.vue"
// import UniCol from "@/uni_modules/uni-row/components/uni-col/uni-col.vue"

export default {
	
	name:"ZsButtonGroup",
	
	components:{
		ZsButton,
		ZsButtonSta2,
		// UniRow,
		// UniCol
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
		},
		
		layoutMode:{
			type:String,
			default:"center"
		}
		
	},
	
	data(){
		return {
			
			rfContClass:{"zs-hlyt": this.layoutDir=="h"?true:false},
			
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
		},
		
		computedContClass:{
			get:function(){
				
				// {"zs-hlyt": this.layoutDir=="h"?true:false}
				
				var class_name = "zs-hlyt"
				
				if(this.layoutDir=="h")
				{
					if(this.layoutMode=="start")
					{
						
						class_name = class_name + ""
					}
					else if(this.layoutMode=="end")
					{
						class_name = class_name + "-end"
					}
					else if(this.layoutMode=="between")
					{
						class_name = class_name + "-between"
					}
				}
				else
				{
					class_name = ""
				}
				
				return [class_name]
				
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
		
		// loadSVG(item){
			
		// 	return getSVG(item.icon)
		// },
		// renderStart(){
		// 	var props = this.$props
			
		// 	var dataIcon = h("view");
		// 	var text = h("view", {}, [props.text]);
			
		// 	return h("view", {class:this.refClass}, [dataIcon, text])
		// },
		
		// renderMiddle(){
			
		// },
		
		// renderEnd(){
			
		// },
		
		onClicked(ev){
			
			this.handleClicked(ev)
			this.$emit("click", ev)
			
		},
		
		handleClicked(ev){
				
		},
		
		// wrapElem(){
			
			
		// },
		
		
		renderBtns(h, items, wrap_elem){
			
			// if(wrap_elem!=null){
				
			// }
			var ret_vns = []
			
			// for(var i in items)
			// {
			// 	ret_vns.push( this.renderBtn(h, this.mergeItemProps(items[i])) )
			// }
			items.forEach(
				(it,i)=>{
					ret_vns.push( this.renderBtn(h, this.mergeItemProps(it)) )
				}
			)
			
			return ret_vns
		},
		
		renderBtn(h, item){
			
			return h("ZsButtonSta2", 
			{
				props:item, 
				on:
				{
					click:(ev)=>{this.onClicked(ev)},
				},
			}
			)
			
		},
		
	},
	
	
	render(h){

		var btn_vns = []
		
		btn_vns = this.renderBtns(h, this.items)
		
		return h("view", {class:this.computedContClass}, btn_vns)
		// var col_vns = []
		// var iter_col_vn;
		// for(var i in this.items)
		// {
		// 	iter_col_vn = h(
		// 	// "uni-col", 
		// 	"UniCol",
		// 	{props:{span:this.computedItemCol}}, 
		// 	[h("ZsButtonSta2", {props:this.items[i]})],
		// 	)
		// 	col_vns.push(iter_col_vn)
			
		// }
		
		// // return h("uni-row", {}, col_vns)
		// return h("UniRow", {}, col_vns)
		
		
	}
	
}
	
</script>

<style>
</style>