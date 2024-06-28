<template>
    
	<button
	class="zs-color-input"
	@click="onclicked"
	size="mini"
	>
	palette
	</button>
    
</template>

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsPaletteButton",

    props:{
		name:{
			type:String,
			default:"paletteButton"
		}
    },

    components:{},

    mixins:[],

    data(){

        var props = this.$props
        
        return {

        }
    },

    computed:{

    },

    created(){

    },

    methods:{
		onclicked(){
			this.$emit("click")
			uni.$emit("colorpicker:open", {"sender":this.name})
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

	.zs-color-input{
		
		/* width: 100%; */
		    /* height: 200px; */
		background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
		
	}
</style>