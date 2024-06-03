<!-- <template>
    
    <view>
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import Menu from './Menu.vue';

export default {
    
    name:"MapBackdropMenu",

    props:{
		items:{
			type:Array,
			default:()=>{
				return [
					{name:"setupLocation",text:"定位到"},
					{name:"getImageInfo",text:"底图信息"},
					// {name:"dragFeature",text:"移动要素"}
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