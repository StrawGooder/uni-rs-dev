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
		
	<!-- 	<ZsCheckbox
		v-if="selectAll"
		v-for="(it,ind) in items"
		:key="ind"
		v-bind="it"
		:ref="`cb${ind}`"
		@click="(v)=>change(v,ind)"
		>
		</ZsCheckbox> -->
		<button
		v-if="selectAllOn"
		@click="selectAllItem"
		type="primary"
		size="mini"
		>
			全选
		</button>
		<button
		v-if="selectNoOn"
		@click="selectNoItem"
		type="warn"
		size="mini"
		>
			清除
		</button>
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
		multiChecked:{
			type:Boolean,
			// default:"single"
		},
		mustCheckOne:{
			type:Number,
			default:-1
		},
		selectAllOn:{
			type:Boolean,
			default:false,
		},
		selectNoOn:{
			type:Boolean,
			default:false,
		}
		// checked:{
		// 	type:Array,
		// 	default:()=>{return []}
		// },
		// value:{
		// 	type:Number,
		// 	default:0
		// },
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
		// this.rfcheckVals[this.value] = true
		// console.log("debug-zs checkboxGroup ", this.items)
		// this.urfcheckedValRecord = this.checked.slice()
		
		const items = this.items
		
		
		const mustCheckInd = this.mustCheckOne
		if(mustCheckInd>-1)
		{
			
			var hasChecked = false
			
			for(var i in items){
				
				if(items[i]["checked"] == true){
					hasChecked = true
					break
				}
			}
			if(!hasChecked){
				items[mustCheckInd]["checked"] = true
			}
		}
		
		this.urfcheckedValRecord = items.map((x)=>{return x["checked"]})
		this.urfcheckedArray = []
    },

    methods:{
	
		change(checked,index){
			
			// const checked = !this.urfcheckedValRecord[index]
			this.urfcheckedValRecord[index] = checked
			
			const evtSentData = {"index":index, checked:checked, value:checked?this.items[index]["checkedVal"] : null}

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
				
				// evtSentData["checkedArray"] = this.urfcheckedValRecord
				evtSentData["checkedArray"] = this.getChecked()
				// this.$emit("change", {"index":index, checked:checked, value:checked?this.items[index]["checkedVal"] : null})
			}

			// console.log("debug-zs checkbox group change emit ", evtSentData)
			this.$emit("change", evtSentData)
			// const cbVmName = `cb${index}`
			// console.log("debug-zs single check", value, index, this.$refs['cb1'])
			// this.$refs["cb2"].checkboxChecked = true
			
		},
		
		getChecked(){
			
			const checkedArray = []
			
			this.urfcheckedValRecord.forEach(
				(x,i)=>{
					if(x){
						checkedArray.push({"index":i, "checkedVal":this.items[i]["checkedVal"]})
					}
				}
			)
			
			return checkedArray
			
		},
		
		selectNoItem(){
			this.$emit("selectNo")
		},
		
		selectAllItem(){
			this.$emit("selectAll")
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