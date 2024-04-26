<template>
    
    <view>
		<ZsGeoLocationSelectGroup
		@change = "onGeoLocationSelectFormChanged"
		/>
		
		<ZsNextTree
		uiMode="page"
		funcMode="display"
		:treeData = "rfGeoLocationData"
		:selectParent="rfSelectParent"
		>
			<template
			#item-end="slotProps"
			>
				
				<ZsButtonGroup
				v-if="slotProps.data.isDbClicked"
				:items = "rfTreeItemEndBtns"
				@click.stop = "handleTreeItemEndDbClicked"
				>
					
				</ZsButtonGroup>
				
			</template>
		</ZsNextTree>
		
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsGeoLocationSelectGroup from '../../../components/zs-components/zs-select/ZsGeoLocationSelectGroup.vue';
import ZsNextTree from '../../../components/zs-components/zs-tree/zs-next-tree/ZsNextTree.vue';
import ZsButtonGroup from '../../../components/zs-components/zs-button-group/ZsButtonGroup.vue';

const geo_loc_data = [
	
	{id:"1", label:"青秀区",
		
		children:[
			{id:"1-1", label:"a"}
		]
	},
	{id:"2", label:"江南区"},
	{id:"3", label:"兴宁区"},
	{id:"4", label:"衡州市"},
	{id:"5", label:"马山县"},
	{id:"6", label:"隆安县"},
	{id:"7", label:"上林县"},
	{id:"8", label:"宾阳县"},
	{id:"9", label:"良庆区"},
	{id:"10", label:"邕宁区"},
	{id:"11", label:"江南区"}
	
]

export default {
    
    name:"SpatialQueryPanel",

    props:{

    },

    components:{
		
		ZsGeoLocationSelectGroup,
		ZsNextTree,
		ZsButtonGroup
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			
			rfGeoLocationData : geo_loc_data,
			rfSelectParent: false,
			
			rfTreeItemEndBtns : [
				{"icon":"crosshair2", "color":"red"}, 
				// {"icon":"refresh", "color":"green"},
			]
        }
    },

    computed:{
		
		// cmptTreeItemEndBtn:{
		// 	get:fu
		// }
    },

    created(){

    },

    methods:{

		onGeoLocationSelectFormChanged(ev){
			
			console.log("debug-select ", ev)
		},
		
		changeGeoLocation(){
			
		},
		
		changeTreeItemEndStatus(data){
			
			var color = "black"
			// var btn_items = [
			// 		{"color":color, "icon":"crosshair2"}
			// 	]
			if(data.isClicked)
			{
				color = "red"
			}
			
			return [
					{"color":color, "icon":"crosshair2"}
				]
		},
		
		handleTreeItemEndDbClicked(){
			
			
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