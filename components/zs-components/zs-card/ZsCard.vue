<template>
    

	<view
	>
	
		<view class="zs-hlyt-between"
		>
			<h3 style="margin-left:2px;">{{title}}</h3>
			<button 
			v-if="showClose"
			style="margin:0px;"
			@click="onCloseBtnClicked"
			>x
			
			</button>
			
		</view>
		<view>
			<slot></slot>
		</view>
	</view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsCard",

    props:{
		title:{
			type:String,
			default:""
		},
		showClose:{
			type:Boolean,
			
		}
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){

    },

    methods:{
		onCloseBtnClicked(){
			this.$emit("hide")
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
</style>