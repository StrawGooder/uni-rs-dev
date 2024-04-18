<!-- <template>
	<view class="">
		hello
	</view>
</template> -->

<script>

import {h} from "vue";
import MapObjListItem from '../mapViewPage/MapObjListItem.vue';
// import MapObjViewCtrlPanel from "../mapViewPage/MapObjViewCtrlPanel.vue";
import MapObjViewCtrlPanel from "../mapViewPage/bottom-tabs/MapObjViewCtrlPanel.vue";
import MapViewBottomPanel from "../mapViewPage/MapViewBottomPanel.vue";

import Vue from "vue";
// import MapObjListItem from '../mapViewPage/MapObjListItemSetup.vue';

function testMapObjCtrlPanel(h){
	return h("MapObjViewCtrlPanel", {}, [])
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

export default {
	name:"TestPage",
	
	components:{
		MapObjListItem,
		MapObjViewCtrlPanel,
		MapViewBottomPanel
	},
	
	render(h){
		
		// return testMapObjCtrlPanel(h)
		return testMapViewBottomPanel(h)
	}
}
	
</script>

<style>
</style>