<template>
    
    <view
	:style="computedStyle"
	
	>
		<ul 
		v-if="visible"
		class="zs-ul"
		
		>
		<!-- style="rfstyle" -->
			<li
			v-for="it in items"
			@click="onItemClicked(it)"
			>
				{{it.text}}
			</li>
			
		</ul>
  
    </view>
    
</template>

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


			rfstyle:{"position":"absolute", "top":"0rpx"}
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

		onItemClicked(item){
			
			console.log("debug-zsolmap menu ", item)
			
			this.$emit("clickItem", item)
		}
    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

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