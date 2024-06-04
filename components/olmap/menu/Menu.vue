<!-- <template>
    
    <view
	:style="computedStyle"
	
	>
		<ul 
		v-if="visible"
		class="zs-ul"
		
		>
		
			<li
			v-for="it in items"
			@click="onItemClicked(it)"
			>
				{{it.text}}
			</li>
			
		</ul>
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"Menu",

    props:{

		items:{
			type:Array,
			required:true
		},
		visible:{
			type:Boolean,
			default:false
		},
		
		position:{
			type:Array,
			default:()=>{return [0,0]}
		}
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {


			rfstyle:{"position":"absolute", "top":"0rpx", "left":"0rpx"}
        }
    },

    computed:{

		computedStyle:{
			get:function(){
				
				return {
					"position":"absolute",
					// "top":"0px",
					 // "top":`${this.position[1]}rpx`,
					 // "left":`${this.position[0]}rpx`,
					 // using posisition unit 'rpx' cause a bug that display 
					 // position of the menu dosen't align 
					 // the mouse clicked position
					 "top":`${this.position[1]}px`,
					 "left":`${this.position[0]}px`,
					
					 "zindex":1000
				}
			}
		}
    },

    created(){

    },

    methods:{

		onItemClicked(item, evt){
			
			// console.log("debug-zsolmap menu ", item)
			var newItem =  Object.assign({}, item)
			newItem["key"] = newItem["name"]
			this.$emit("clickItem", newItem)
		}
    },

    render(h){

        // var retVn = h("div")
        // return retVn
		

		// console.log("debug-zsolmap-menu items ", this.items)
		if(this.visible){
			
			var liVnList = []
			// var item
			for(var i in this.items)
			{
				const item = this.items[i]
				liVnList.push(
					h('li', 
					{
						on:{
							click:(evt)=>{this.onItemClicked(item, evt)}
						}
					},
					[item.text]
					)
				)
			}
			// console.log("debug-zsolmap-menu items ", this.items, liVnList)
			var ulVn = h("ul", {class:["zs-ul"]}, liVnList)
			
			return h("view", {style:this.computedStyle}, [ulVn])
			// return h("view", {style:this.computedStyle}, ["nihao"])
		}
		
		return h("view", {style:this.computedStyle})
		
    },

    mounted(){

    },

    beforeDestroy(){

    }

};

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
.zs-ul {
	list-style-type: none;
	padding: 0.5em;
	width:128px;
	background-color: lightgrey;
}

/* .zs-li{
	width:100
} */
</style>