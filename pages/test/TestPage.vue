<!-- <template>
	<view class="">
		hello
	</view>
</template> -->

<script>

import {h} from "vue";
import MapObjListItem from '../mapViewPage/MapObjListItem.vue';
import MapObjCtrlPanel from "../mapViewPage/MapObjCtrlPanel.vue";

import Vue from "vue";
// import MapObjListItem from '../mapViewPage/MapObjListItemSetup.vue';

function testMapObjCtrlPanel(h){
	return h(MapObjCtrlPanel, {}, [])
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
		MapObjCtrlPanel
	},
	
	render(h){
		
		return testMapObjCtrlPanel(h)
	}
}
	
</script>

<style>
</style>