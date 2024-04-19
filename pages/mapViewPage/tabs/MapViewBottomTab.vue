<template>

	<view class = "map-obj-list-item">
	
		<uni-section
		:type="rfSectType"
		:title="rfVecSectTitle"
		>
			<view  :class="rfSecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>

		</uni-section>
		<uni-section
		:type="rfSectType"
		:title="rfImgSectTitle"
		>
		
			<view :class="rfSecContainerClass">
				<MapObjListItem 
				v-for="it in rfItems"
				:key="it.key"
				v-bind="it"
				/>			
			</view>

		</uni-section>
		<!-- 	<MapObjListItem 
			v-for="it in rfItems"
			:key="it.key"
			v-bind="it"
			/> -->
	</view>
	
</template>

<script>


import { h, ref, computed, mounted, unMounted } from "vue" ;

// import ZsButtonGroup from "../../components/zs-components/zs-button-group/ZsButtonGroup.vue";
// import ZsIcon from "../../components/zs-components/zs-icon/ZsIcon.vue";
// import ZsIconVue from "../../components/zs-components/zs-icon/ZsIcon.vue";
import MapObjListItem from "../MapObjListItem.vue";

export default {
	
	name:"MapObjCtrlPanel",
	
	components:{
		MapObjListItem
	},
	
	props:{
		
		text:{
			type:String,
			// required:true
			default:"layer view"
		},
		
		dataSrcType:{
			type:String,
			default:"vector"
		},
		
		dataType:{
			type:String,
			default:"multipolygon"
		},
		
		iconColor:{
			type:String,
			default:"red"
		},
		
		status:{
			type:String,
			default:"normal"
		}
		
	},
	
	data(){
		return {
			rfSectType:"line",
			rfVecSectTitle:"vector info",
			rfImgSectTitle:"raster info",
			
			rfContainerClass:[],
			rfSecContainerClass:["uni-pl-5"],
			// rfBtnItems:[{"text":"eye"},{"text":"eye"}]
			rfItems:[
				{text:"forest", iconColor:"red"},
				{text:"city", iconColor:"green"},
				{text:"factory", iconColor:"orange"},
				{text:"3line", iconColor:"blue"},
				{text:"farm-land", iconColor:"yellow"}
			]
		}
	},
	
	created(){
		
		// var r = ref(2);
		// console.log(`debug vue version ${Vue.version}`)
	},
	
	methods:{
	
		
	},

}
	
</script>

<style>
	
	.map-obj-list-item{
		/* color:yellow */
	}
	

	
</style>