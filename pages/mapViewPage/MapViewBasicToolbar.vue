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
				// {"icon":"eyeFill", "name":"view", "color":"orange"},
				// {"icon":"b-question", "name":"view", "color":"orange"},
				{"icon":"b-plus", "name":"zoomIn", "color":"orange"},
				{"icon":"b-dash", "name":"zoomOut", "color":"orange"},
				{"icon":"b-question", "name":"viewGuideline", "color":"orange"},
			]
		},
		itemSize:{
			default:32
		},
		layoutDir:{
			default:"v"
		},
		gutter:{
			type:Number,
			default:2
		},
		borderWidth:{
			type:Number,
			default:2
		},
		borderColor:{
			type:String,
			default:"black"
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
			// console.log("debug-button ",key)
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