<!-- <template>
    
    <view>
		
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import Menu from './Menu.vue';
import FeaturePolygonEditMenu from './FeaturePolygonEditMenu.vue';
import FeaturePolygonVertexEditMenu from './FeaturePolygonVertexEditMenu.vue';
import MapBackdropMenu from './MapBackdropMenu.vue';

export default {
    
    name:"MenuView",

    props:{

		visible:{
			type:Boolean,
			
		},
		
		menuName:{
			type:String,
			default:"Menu"
		},
		
		position:{
			type:Array,
			
		},
		
		items:{
			type:Array,
			
		}
    },

    components:{
		Menu,
		MapBackdropMenu,
		FeaturePolygonEditMenu,
		FeaturePolygonVertexEditMenu
	},

    mixins:[],

    // data(){

    //     var props = this.$props
        
    //     return {

    //     }
    // },

    computed:{

    },

    created(){

    },

    methods:{

    },

    render(h){

		var retVn
		
		
		if(this.visible){
			
			var menuName = this.menuName
			var compName = menuName
			var menuContVn;
			var menuParam = {
				
				props:{
					visible:this.visible,
					position:this.position,
				},
				on:{
					clickItem:(evt)=>{this.$emit("clickItem", evt)}
				}
			}
			

			if(Array.isArray(this.items)){
				menuName = "Menu"
				menuParam["props"]["items"] = this.items
			}
			// else if(menuName=="FeaturePolygonEditMenu"){
				
			// }
			// else if(menuName=="FeaturePolygonVertexEditMenu"){
				
			// }
			// else if(menuName=="MapBackdropMenu"){
				
			// }
			
			menuContVn = h(menuName, menuParam)
			
			return menuContVn
			
			// retVn = h("view", 
			// {},
			// [menuContVn],
			// )
			// console.log("debug-zsolmap-menu ", retVn)
			
		}
		else{
			retVn = h("view")
		}
		
        
        return retVn
    },

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