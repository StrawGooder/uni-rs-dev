<template>
    
	<view>
		<view
		style="display: inline-block;"
		@click="onClicked"
		>
		<!-- :class="['zs-checkbox-input', rfchecked==true?'zs-checkbox-input-checked':'']" -->
			<view
			:class="rfclass"
			>
				
				<view 
				
				:class="rfclass"
				style="color: rgb(0, 122, 255);"
				
				>
					<!-- :class="computedClass" -->
				</view>
			</view>
		</view>
		{{label}}
	</view>
	<!-- <view></view> -->
</template>

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsCheckbox",

    props:{

		value:{
			type:String
		},
		checked:{
			type:Boolean,
			default:false
		},
		label:{
			type:String,
			default:""
		}
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			
			rfchecked:this.checked,
			// rfchecked:true,
			rfclass:{
				"zs-checkbox-input":true, 
				"zs-checkbox-input-checked":this.rfchecked,
				// "zs-checkbox-input-checked":true,
			},
			
        }
    },

    computed:{

		// computedClass:{
		// 	get:function(){
		// 		if(this.rfchecked){
		// 			this.rfclass["zs-checkbox-input-checked"] = true
		// 		}
		// 		this.rfclass["zs-checkbox-input-checked"] = false
		// 		return this.rfclass
		// 	}
		// }
    },

    created(){

    },
	
	// expose:['setCheck'],

    methods:{

		onClicked(){
		
			this.setCheck(!this.rfchecked)
			this.$emit("click", this.rfchecked)
		},
		
		setCheck(val){
			this.rfchecked = val
			this.rfclass = Object.assign({}, this.rfclass)
			this.rfclass["zs-checkbox-input-checked"] = val
		},
		// uncheck(){
		// 	this.rfclass = Object.assign({}, this.rfclass)
		// 	this.rfclass["zs-checkbox-input-checked"] = this.rfchecked
		// }
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
.zs-checkbox-wrapper{
	display: -webkit-inline-flex;
	display: -webkit-inline-box;
	display: inline-flex;
	-webkit-align-items: center;
	-webkit-box-align: center;
	align-items: center;
	vertical-align: middle;
	
}
/* .zs-checkbox{
	display: -webkit-inline-flex;
	display: -webkit-inline-box;
	display: inline-flex;
	-webkit-align-items: center;
	-webkit-box-align: center;
	align-items: center;
	vertical-align: middle;
	}
} */

.zs-checkbox-input{
	    margin-right: 5px;
	    -webkit-appearance: none;
	    appearance: none;
	    outline: 0;
	    border: 1px solid #d1d1d1;
	    background-color: #fff;
	    border-radius: 3px;
	    width: 22px;
	    height: 22px;
		/* width: 22px;
		height: 20px; */
	    position: relative;
}

.zs-checkbox-input-checked{
	color:rgb(0,122,255);
}

.zs-checkbox-input-checked:before{
	    font: normal normal normal 14px / 1 uni;
	    content: "\EA08";
	    font-size: 22px;
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -48%) scale(.73);
	    -webkit-transform: translate(-50%, -48%) scale(.73);
}
</style>