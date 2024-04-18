<!-- <template>

</template -->>



<script>
	
import {getIconComponent, getAllIconComponents} from "./iconSet.js"
import EyeIcon from "./EyeIcon.vue"

export default {
	
	name:"ZsIcon",
	
	components:getAllIconComponents(),
	// components: {
	// 	"eye":getIconComponent("eye")
	// 	// "eye":EyeIcon
	// },
	
	props:{
		icon:{
			type:String,
			default:"normal"
		}
	},
	
	render(h){
		
		var props = this.$props
		
		var icon_name = props.icon
		
		var ret_vn = ""
		
		// ret_vn = h(getIconComponent(icon_name).name)
		var comp = getIconComponent(icon_name)
		// console.log("debug-icon", comp, comp.options)
		ret_vn = h(icon_name, {class:[]})
		
		return ret_vn
	}
}


</script>

<style>
	
/* 	.zs-icon{
		width:1em;
		height:1em;
	} */
/* 	.zs-icon{
		width:1em;
		height:1em;
		color:pink;
	} */
	
</style>