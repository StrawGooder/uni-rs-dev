<!-- <template>
	<view class="">
		hello
	</view>
</template> -->

<script>

import {h} from "vue";
import MapViewPage from "../mapViewPage/MapViewPage.vue";
import MapObjListItem from '../mapViewPage/MapObjListItem.vue';
// import MapObjLayerCtrlPanel from "../mapViewPage/MapObjLayerCtrlPanel.vue";
import MapObjLayerCtrlPanel from "../mapViewPage/panels/MapObjLayerCtrlPanel.vue";
import MapViewBottomPanel from "../mapViewPage/MapViewBottomPanel.vue";


import Vue from "vue";
// import MapObjListItem from '../mapViewPage/MapObjListItemSetup.vue';

function testMapObjCtrlPanel(h){
	return h("MapObjLayerCtrlPanel", {}, [])
}

function testMapViewBottomPanel(h){
	return h("MapViewBottomPanel", {}, [])
}

function testMapObjListItem(h){
	
	return h("view",
	{}, 
	[
		h("MapObjListItem", {props:{text:"forest", iconColor:"red"}}),
		h("MapObjListItem", {props:{text:"city", iconColor:"green"}}),
		h("MapObjListItem", {props:{text:"factory", iconColor:"orange"}}),
		h("MapObjListItem", {props:{text:"3line", iconColor:"blue"}})
	]
	)
}

function testMapViewPage(h){
	
	return h("MapViewPage")
}

export default {
	name:"TestPage",
	
	components:{
		MapObjListItem,
		MapObjLayerCtrlPanel,
		MapViewBottomPanel,
		MapViewPage
	},
	
	render(h){
		
		// return testMapObjCtrlPanel(h)
		return testMapViewBottomPanel(h)
		// return testMapViewPage(h)
	}
}
	
</script>

<style>
</style>