<!-- <template>
</template -->>

<script>

import { h, ref, computed, mounted, unMounted } from "vue" 

export default {
	
	name:"MapObjListItemSetup",
	
	components:{
		
	},
	
	props:{
		
		text:{
			type:String,
			required:true
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

	setup(props, slots){
			
		// return ()=>{
		// 	h("view", {}, "setup hello")
		// }
		
		return h("view", {}, "setup hello")
	}
	
}
	
</script>

<style>
</style>