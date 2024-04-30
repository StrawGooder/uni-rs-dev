<template>
    
	<!-- <xfl-select
	:list="rfNationData"
	@input="(ev)=>onSelectChanged(evt, 1)"
	>
	</xfl-select>
	<xfl-select
	:list="rfProvinceData"
	@input="(ev)=>onSelectChanged(evt, 2)"
	>
		
	</xfl-select>
	<xfl-select
	:list="rfCityData"
	@input="(ev)=>onSelectChanged(evt, 3)"
	>
		
	</xfl-select> -->
   <!-- <view
	class="zs-hlyt-between"
	>

		<ZsSelectForm
		:list="rfNationData"
		
		label="国家"
		@input="(ev)=>onSelectChanged(evt, 3)"
		>
			
		</ZsSelectForm>
		<ZsSelectForm
		label="省份"
		:list="rfProvinceData"
		@input="(ev)=>onSelectChanged(evt, 2)"
		>
			
		</ZsSelectForm>
		<ZsSelectForm
		label="城市"
		:list="rfCityData"
		@input="(ev)=>onSelectChanged(evt, 3)"
		>
			
		</ZsSelectForm>
		
    </view> -->
	<uni-row>
		<uni-col
		:span="8"
		>
			<ZsSelectForm
			:list="rfNationData"
			
			label="国家"
			initValue="中国"
			@change="(ev)=>onSelectChanged(ev, 1)"
			>
				
			</ZsSelectForm>

		</uni-col>
		
		<uni-col
		:span="8"
		>
		<ZsSelectForm
		label="省份"
		:list="rfProvinceData"
		initValue="广西壮族自治区"
		@change="(ev)=>onSelectChanged(ev, 2)"
		>
			
		</ZsSelectForm>

		</uni-col>
		<uni-col
		:span="8"
		>
		
		<ZsSelectForm
		label="城市"
		:list="rfCityData"
		initValue="南宁市"
		@change="(ev)=>onSelectChanged(ev, 3)"
		>
			
		</ZsSelectForm>

		</uni-col>
		
	</uni-row>
	
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsSelectForm from './ZsSelectForm.vue';

const city_data = [
	{value:"河池市"},
	{value:"南宁市"}, 
	{value:"桂林市"},
	{value:"柳州市"}, 
	{value:"百色市"},
	{value:"北海市"}
	]
const province_data = [{value:"广西壮族自治区"}, {value:"广东省"},{value:"湖南省"}]
const nation_data = [{value:"中国"}]

export default {
    
    name:"ZsGeoLocationSelectGroup",

    props:{
		
    },

    components:{
		ZsSelectForm
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfColSpan:8,
			rfNationData: nation_data,
			rfProvinceData: province_data,
			rfCityData: city_data,
        }
    },

    computed:{

    },

    created(){

    },

    methods:{

		onSelectChanged(ev, level){
			
			var ev_data = {
				level:level,
				origin_event:ev,
				// value: ev["newVal"]
				data:{
					level:level,
					value:ev["newVal"]
				}
			}
			this.$emit("change", ev_data)
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