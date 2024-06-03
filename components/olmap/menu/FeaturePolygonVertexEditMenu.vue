<!-- <template>
    
    <view>
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import Menu from './Menu.vue';

export default {
    
    name:"FeaturePolygonVertexEditMenu",

    props:{
		items:{
			type:Array,
			default:()=>{
				return [
					{name:"createVertex",text:"插入顶点"},
					{name:"deleteVertex",text:"删除顶点"},
					{name:"setVertexInsertedMode",text:"快速插入顶点", contentType:"checker"},
					// {name:"normalyInsert",text:"普通插入模式"},
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