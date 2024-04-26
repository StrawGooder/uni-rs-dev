<!-- <template>
    
    <view>
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';
import ZsFormItem from './ZsFormItem.vue';
import xflSelect from '../../xfl-select/xfl-select.vue';

export default {
    
    name:"ZsSelectForm",

    props:{
	
    },

    components:{
		
		xflSelect
	},

    mixins:[xflSelect, ZsFormItem],

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

		makeDefaultInputSlot(h, vm_param){
			
			return h("xflSelect", 
			{
				props: this.$props, 
				on:{
					change:(ev)=>{this.$emit("change", ev)}
				},
			}, 
			[],
			)
		},

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