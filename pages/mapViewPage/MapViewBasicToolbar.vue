<!-- <template>
	<ZsButtonGroup
	layoutDir="v"
	:items = "rfBtnItems"
	:itemSize="32"
	>
		
	</ZsButtonGroup>
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import ZsButtonGroup from '../../components/zs-components/zs-button-group/ZsButtonGroup.vue';

// const items = 

function getDefaultProps(){
	
	return {
		
		items:{
			default:()=>[
				{"icon":"layersFill", "name":"layer", "color":"orange"},
				{"icon":"eyeFill", "name":"view", "color":"orange"},
			]
		},
		itemSize:{
			default:48
		},
		layoutDir:{
			default:"v"
		}
	}
}

export default {
    
    name:"MapViewBasicToolbar",

    props:getDefaultProps(),

    components:{
		
		// ZsButtonGroup
		
	},

    mixins:[ZsButtonGroup],

   //  data(){

   //      var props = this.$props
        
   //      return {
			// rfBtnItems:[
			// 	{"icon":"layersFill", "name":"layer", "color":"orange"},
			// 	{"icon":"eyeFill", "name":"view", "color":"orange"},
			// ]
   //      }
   //  },

    computed:{

    },

    created(){

		
    },

    methods:{

		handleClicked(ev){
			
			var key = ev.btnKey
			console.log("debug-button ",key)
			if(key=="layer")
			{
				
			}
			else if(key=="eye")
			{
				
			}
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