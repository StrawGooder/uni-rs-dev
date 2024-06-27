<template>
    
    <view
	style="background-color: papayawhip;"
	>
	<!-- 	<t-color-picker
		ref="color-picker"
		>
			
		</t-color-picker> -->
	

<!-- style="top:0rpx;left:0rpx;position: fixed;" -->
		<view
		style="position: fixed;top:0rpx;z-index: 999;"
		>
			<ZsColorPicker
			ref="color-picker"
			>
				
			</ZsColorPicker>
		</view>
		
		<view style="display: flex;justify-content: space-between;">
			<h3>新建图层</h3>
		</view>
		<scroll-view>
			<uni-forms>
				<uni-forms-item
				labelPosition="left"
				label="名称"
				type="text"
				>
			
					<uni-easyinput
					class="zs-form-input"
					>
						
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item
				label="几何类型"
				>
				
						<ZsButtonGroup
						:gutter="1"
						gutterColor="black"
						
						:item-style="rfgeomTypeStyle"
						:items="rfgeomTypeItems"
						>
							
						</ZsButtonGroup>
				
				</uni-forms-item>
				<uni-forms-item
				label="颜色"
				>
					<ZsColorPickerButton
					@click="openColorPickerPanel"
					>
						
					</ZsColorPickerButton>
				</uni-forms-item>
				<uni-forms-item
				label="分组"
				>
					<uni-easyinput
					class="zs-form-input"
					>
						
					</uni-easyinput>
				</uni-forms-item>
				
			</uni-forms>
			
		</scroll-view>
		<view style="display: flex;justify-content: end;">
			<view>
				<button
				@click="onConfirm"
				type="primary"
				size="mini"
				>
					确定
				</button>
				<button
				
				@click="onCancel"
				type="warn"
				size="mini"
				>
					取消
				</button>
			</view>
		</view>
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsButtonGroup from '@/components/zs-components/zs-button-group/ZsButtonGroup.vue';
// import ZsButtonGroup from '../../../components/zs-components/zs-button-group/ZsButtonGroup.vue';
import ZsColorPicker from '@/components/zs-components/zs-form/ZsColorPicker.vue';
import ZsColorPickerButton from '@/components/zs-components/zs-form/ZsColorPickerButton.vue';
export default {
    
    name:"MapVectorLayerCreatePanel",

    props:{
		
    },

    components:{
		
		ZsButtonGroup,
		ZsColorPicker,
		ZsColorPickerButton
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

			rfgeomTypeStyle:{"bgColor":"orange"},
			rfgeomTypeItems:[
				
				// {name:"edit", icon:"stopBtn",status:0},
				{name:"rectangle", icon:"b-rectangle", status:0,bgColorDisabled:"white",borderWidth:2, borderColor:"red"},
				{name:"polygon", icon:"b-polygon", status:0,  bgColorDisabled:"white"},
				{name:"circle", icon:"b-circle", status:0,  bgColorDisabled:"white"},
				{name:"point", icon:"crosshair2", status:0,bgColorDisabled:"white"},
				{name:"doodle", icon:"aspose-doodle", status:0,bgColorDisabled:"white"},
			],
        }
    },

    computed:{

    },

    created(){

    },

    methods:{

		openColorPickerPanel(){
			
			this.$refs["color-picker"].open()
		},
		onConfirm(){
			
		},
		onCancel(){
			
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
	.zs-form-input{
			background-color: white;
			border: 1px black solid;
			text-align: center;
	}
	
	.zs-color-input{
		
		width: 100%;
		    /* height: 200px; */
		background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
		
	}
</style>