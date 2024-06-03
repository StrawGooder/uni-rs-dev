<!-- <template>
    
    <view>
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import Menu from './Menu.vue';

export default {
    
    name:"FeaturePolygonEditMenu",

    props:{
		items:{
			type:Array,
			default:()=>{
				return [
					{name:"createFeature",text:"复制要素"},
					{name:"deleteFeature",text:"删除要素"},
					{name:"dragFeature",text:"移动要素"}
				]
			}
		}
    },
	
    components:{},

    mixins:[Menu],

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