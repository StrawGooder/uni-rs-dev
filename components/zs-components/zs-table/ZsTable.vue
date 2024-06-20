<template>
    
	<uni-table>
		
		<uni-th>
			<uni-tr>
				<uni-td></uni-td>
			</uni-tr>
		</uni-th>
		<uni-tbody>
			<uni-tr
			v-for="r in rows"
			:key="r["key"]"
			v-bind="r"
			>
				<uni-td
				v-for="(dn,dv) in rows"
				>
					{{dv}}
				</uni-td>
			</uni-tr>
		</uni-tbody>

		
	</uni-table>
    
</template>

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsTable",

    props:{

		headers:{
			type:Array,
			default:()=>{return []}
		},
		rows:{
			type:Array,
			default:()=>{return []}
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