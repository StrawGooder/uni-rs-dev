<template>
    
    <view 
	:style = "computedStyle"
	>
  
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsGutter",

    props:{
		direction:{
			type:String,
			default:"v"
		},
		size:{
			type:Array,
			default:()=>{return [1,16]}
		},
		color:{
			type:String,
			default:"black"
		}
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfstyle:{}
        }
    },

    computed:{

		computedStyle:{
			get:function(){
				const size = this.size
				if(this.direction=="h"){
					const temp = size[0]
					size[0] = size[1]
					size[1] = temp
				}
				return {
					width:`${size[0]}px`,
					height:`${size[1]}px`,
					backgroundColor:this.color
				}
			}
		}
    },

    created(){

    },

    methods:{

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
</style>