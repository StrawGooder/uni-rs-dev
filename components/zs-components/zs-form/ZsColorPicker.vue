<template>
    
	<view>
		<ZsPaletteButton
		v-if="showCtrlBtn"
		@click ="open"
		>
		</ZsPaletteButton>
		
	<!-- 	<view
		style="position: absolute;top:0rpx;left:0px;z-index: 99999;"
		>
			<view>
					<ZsColorPickerPanel
					ref="colorPicker"
					>
						
					</ZsColorPickerPanel>
			</view>
			
		</view> -->
		<ZsColorPickerModal
		ref="colorPicker"
		@confirm="onConfirm"
		@close="onClose"
		>
			
		</ZsColorPickerModal>
	<!-- 	<uni-popup
		ref="popup"
		>
			<ZsColorPickerPanel
			ref="colorPicker"
			@confirm="onConfirm"
			
			>
				
			</ZsColorPickerPanel>
			
		</uni-popup> -->

	</view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsPaletteButton from './ZsPaletteButton.vue';
// import ZsColorPickerPanel from './ZsColorPickerPanel.vue';
import ZsColorPickerModal from "./ZsColorPickerModal.vue";
export default {
    
    name:"ZsColorPicker",

    props:{
		showCtrlBtn:{
			type:Boolean,
			default:false
		}
    },

    components:{
		
		ZsPaletteButton,
		ZsColorPickerModal
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){
		
		
		// uni.$on("colorpicker:open", this.openUni_)
		// uni.$on("colorpicker:close", this.closeUni_)
		
		// this.urfspanCompCaller = null
    },

    methods:{
		onclicked(){
			this.$emit("click")
		},
		open(){
			
			// this.$refs["popup"].open()
			setTimeout(
			()=>{
					this.$refs["colorPicker"].open()
					this.$emit("shown")
			}, 1000)
			
		},
		close(){
			
			this.$refs["colorPicker"].close()
			// this.$refs["popup"].close()
			this.$emit("hidden")
			
		},
		// openUni_(callArgs){
		// 	callArgs = callArgs || {sender:"unset", caller:"unset"}
		// 	this.urfspanCompCaller = callArgs["caller"]
		// 	this.open()
		// },
		// closeUni_(callArgs){
		// 	callArgs = callArgs || {sender:"unset", caller:"unset"}
		// 	this.urfspanCompCaller = callArgs["caller"]
		// 	this.close()
		// },
		onConfirm(evt){
			evt["caller"] = this.urfspanCompCaller
			this.$emit("confirm", evt)
			uni.$emit("colorpicker:confirm", evt)
		}
    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){

    },

    beforeDestroy(){
		uni.$off("colorpicker:open", this.openUni_)
		uni.$off("colorpicker:close", this.closeUni_)
    }

};

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/

	.zs-color-input{
		
		/* width: 100%; */
		    /* height: 200px; */
		background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
		
	}
</style>