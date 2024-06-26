<template>
    
    <view
	class="zs-hlyt"
	ref="v"
	>
	<!-- 	<checkbox-group
		>
			<label 
			v-for="(it,ind) in items"
			:key="ind"
			v-bind="it"
			>
				<checkbox 
				:value="it['checkedVal']"
				:checked="checked[ind]" 
				:ref="`cb${ind}`"
				@click="(v)=>change(v,ind)"
				v-model="rfck"
				/>
				{{it.label}}
				
			</label>
			
			
			v-bind="it"
		</checkbox-group> -->

		<ZsCheckbox
		v-for="(it,ind) in items"
		:key="ind"
		v-bind="it"
		:ref="`cb${ind}`"
		@click="(v)=>change(v,ind)"
		>
			
		</ZsCheckbox>
    </view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsCheckbox from './ZsCheckbox.vue';

export default {
    
    name:"ZsCheckboxGroupForm",

    props:{
		items:{
			type:Array,
			default:()=>{return []}
		},
		checked:{
			type:Array,
			default:()=>{return []}
		},
		// value:{
		// 	type:Number,
		// 	default:0
		// },
		multiChecked:{
			type:Boolean,
			// default:"single"
		},
		musteCheckOne:{
			type:Boolean,
			default:true
		}
    },

    components:{
		ZsCheckbox
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfcheckVals:[false, false],
			
			rfcheckVal:1,
			rfck:'1'
        }
    },

    computed:{

		computedCheckboxNum:{
			get:function(){
				return this.items.length
			}
		}
    },

    created(){
		// if(this.value==1){
		// 	this.rfcheckVals[0] = 1
		// }
		// else if(this.value==2){
		// 	this.rfcheckVals[1] = 1
		// }
		// this.rfcheckVals[this.value-1] = 1 
		this.rfcheckVals[this.value] = true
		console.log("debug-zs checkboxGroup ", this.items)
		this.urfcheckedValRecord = this.checked.slice()
    },

    methods:{
	
		change(checked,index){
			
			// const checked = !this.urfcheckedValRecord[index]
			this.urfcheckedValRecord[index] = checked
			
			const evtSentData = {"index":index, checked:checked, value:checked?this.items[index]["checkedVal"] : null}

			
			console.log("debug-zs checkbox group", this.$refs)
			if(!this.multiChecked)
			{
				var cbVm
				for(var i = 0 ;i < this.computedCheckboxNum;i++)
				{
					cbVm = this.$refs[`cb${i}`][0]
					if(i!=index)
					{
						
						 // this.$refs[`cb${i}`].setChecked(false)
						cbVm.setCheck(false)
						// console.log("debug-zs checkbox group", cbVm._uid, `cb${i}`)
					}
					
				}				
				// const cbVm = this.$refs[`cb${index}`]
				
			}
			else{
				
				evtSentData["checkedArray"] = this.urfcheckedValRecord
				// this.$emit("change", {"index":index, checked:checked, value:checked?this.items[index]["checkedVal"] : null})
			}

			console.log("debug-zs single check", evtSentData)
			this.$emit("change", evtSentData)
			// const cbVmName = `cb${index}`
			// console.log("debug-zs single check", value, index, this.$refs['cb1'])
			// this.$refs["cb2"].checkboxChecked = true
			
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