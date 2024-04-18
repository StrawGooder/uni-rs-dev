<template>
	<ZsButtonGroup
	:layoutDir="v"
	:items = "rfBtnItems"
	>
		
	</ZsButtonGroup>
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsButtonGroup from '../../components/zs-components/zs-button-group/ZsButtonGroup.vue';

export default {
    
    name:"MapViewBasicToolbar",

    props:{
		
    },

    components:{
		
		ZsButtonGroup
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfBtnItems:[
				{"icon":"layersFill", "color":"orange"},
				{"icon":"eyeFill", "color":"orange"},
			]
        }
    },

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