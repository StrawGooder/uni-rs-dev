

<script>
	
// import { defineComponent, h, render } from "vue" 
import ZsButton from "./ZsButton.vue"
import ZsButtonSta2 from "./ZsButtonSta2.vue"
import ZsGutter from "./ZsGutter.vue"
import {getSVG} from "../zs-icon/iconSet.js"
// import UniRow from "@/uni_modules/uni-row/components/uni-col/uni-col.vue"
// import UniCol from "@/uni_modules/uni-row/components/uni-col/uni-col.vue"

export default {
	
	name:"ZsButtonGroup",
	
	components:{
		ZsButton,
		ZsButtonSta2,
		ZsGutter
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
		itemStyle:{
			type:Object,
			default:()=>{return {}}
		},
		// featMode:{
		// 	type:String,
		// 	default:""
		// },
		
		layoutDir:{
			type:String,
			default:"h"
		},
		
		layoutMode:{
			type:String,
			default:"center"
		},
		
		index:{
			type:Number,
		},
		
		enableMutex:{
			type:Boolean
		},
		
		borderColor:{
			type:String,
			default:"gray"
		},
		borderWidth:{
			type:Number,
			default:0
		},
		
		gutter:{
			type:Number,
			default:0
		},
		gutterColor:{
			type:String,
			default:"black"
		}
		
	},
	
	data(){
		return {
			
			rfcontClass:{"zs-hlyt": this.layoutDir=="h"?true:false},
			
			// rfImgSrc: getSVG("eye")
			rfstyle:{},
			
			rfitemCol:2,
			rfcolTotal:24,
		}
	},
	
	computed:{
			
		computedItemCol:{
			get:function(){
				return this.rfcolTotal / this.items.length
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
					// class_name = ""
					class_name = "zs-vlyt"
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
			
			this.rfstyle = {
				"width":item_w,
				"height":item_h
			}
			
			
		},
		
		renderItemStyle(item){
			
			var style = Object.assign({"color": item["color"]}, this.rfstyle)
			return style
			
		},
		
		mergeItemProps(item){
			
			item["size"] = this.itemSize
			
			// var color = item["color"]
			// var colorDisabled = item["colorDisabled"]
			
			const tempItemStyle = {}
			// overlap common style
			// by item self style 
			Object.assign(tempItemStyle, this.itemStyle)
			Object.assign(tempItemStyle, item)
			Object.assign(item, tempItemStyle)
			
			// if(this.layoutDir=="v"){
			// 	item[""]
			// }
			
			return item
		},
		
		// mergeItemStyle(item){
		
		// 	var color = item["color"]
		// 	var colorDisabled = item["colorDisabled"]
				
		// },
		
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
		
		onBtnClicked(evt){
			
			// ev["index"] = this.index;  
			// ev["item"] = item
			this.handleClicked(evt)
			this.$emit("click", evt)
			// this.handleClicked(item)
			// this.$emit("click", item)
			
			var index = evt["index"]
			// var evtData = evt["data"]
			if(this.enableMutex)
			{
				var evtData = evt["data"]
				
				if(evtData["enabled"]!=false){
					this.checkMutex(index)
				}
				
			}
		},
		
		checkMutex(index){
			var checked
			for(var i =0,num=this.items.length; i<num; i++)
			{
				
				if(i!=index){
					// this.$refs[`btn${i}`].setCheck(0)
					checked = 0
				}
				else{
					checked = 1
				}
				this.$refs[`btn${i}`].setCheck(checked)
				// console.log("debug-zsbtnsta2 ", index)
			}
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
			var gutter = this.gutter
			if(gutter>0)
			{
				const itemNum = this.items.length
				
				for(var i =0,ii=itemNum*2-1; i<ii; i++){
					
					if(i%2){
						ret_vns.push( h("ZsGutter", 
							{
								props:{direction:this.layoutDir=="v"?"h":"v", size:[gutter,this.itemSize], color:this.gutterColor}},
							) 
							)
					}
					else{
						const index = i/2
						ret_vns.push( 
						this.renderBtn(h, 
							this.mergeItemProps(this.items[index]),
							index
							) 
						)
					}
					
				}
				
			}
			else{
				
				items.forEach(
					(it,i)=>{
						ret_vns.push( this.renderBtn(h, this.mergeItemProps(it), i) )
					}
				)
			}
			// items.forEach(
			// 	(it,i)=>{
			// 		ret_vns.push( this.renderBtn(h, this.mergeItemProps(it)) )
			// 	}
			// )
			
			return ret_vns
		},
		
		renderBtn(h, item, index){
			
			return h("ZsButtonSta2", 
				{
					props:item, 
					ref:`btn${index}`,
					on:
					{
						// evt is button item
						click:(evt)=>{
							evt["index"]=index;
							this.onBtnClicked(evt)
						},
					},
				}
			)
			
		},
		
		// onBtnClicked(){
			
		// 	ev["index"] = this.index;  this.onClicked(ev)
		// }
		
	},
	
	
	render(h){

		var btn_vns = []
		
		btn_vns = this.renderBtns(h, this.items)
		
		var contStyle = {border:`${this.borderColor} ${this.borderWidth}px solid`}
		
		return h("view", {
			class:this.computedContClass, 
			style:contStyle,
			}, 
			btn_vns
			)
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