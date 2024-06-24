<template>
    
    <view>
  
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsUserLocation from './ZsUserLocation.vue';


function onSuccess(){
	
}

function onFail(){
	
}

function onComplete(){
	
}



export default {
    
    name:"ZsUserLocationAndOrientation",

    props:{
		
		compassLazy:{
			type:Boolean
		}
		
    },

    components:{},

    mixins:[ZsUserLocation],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){
		// this.$emit("changeCompass")
		console.log("debug-zs compass emit")
    },

    methods:{

		// onLocationChanged(result){
			
		// 	this.$emit("change",  result)
		// },
		
		// onLocationChangedError(result){
		// 	this.$emit("changeError",  result)
		// }
		onCompassChanged(){
			this.$emit("changeCompass")
		},
		
		listenCompassChanged_(){
			try{
				uni.onCompassChange(this.onCompassChanged)
			}catch(e){
				//TODO handle the exception
				console.log("debug-zsUserLocation on compass ")
			}
			
		},
		
		unlistenCompassChanged_(){
			
			try{
				uni.offCompassChange(this.onCompassChange)
			}catch(e){
				//TODO handle the exception
				console.log("debug-zsUserLocation off compass")
			}
			
		}
		
    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){
		
		if(!this.compassLazy){
			this.listenCompassChanged_()
		}
		
    },

    beforeDestroy(){
		
		this.unlistenCompassChanged_()
		
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