<!-- <template>
    
    <view>
		
  
    </view>
    
</template> -->

<script type="text/javascript">

import Vue from 'vue';


export default {
    
    name:"ZsFormItem",

    props:{

		label:{
			type:String,
			
		},
		colon:{
			type:Boolean,
			default: false
		},
		name:{
			type:String,
			
		},
		layoutMode:{
			type:String,
			default:"inline"
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

		
		makeDefaultInputSlot(h, vm_param){
			return h("input", 
			{
				props: this.$props, 
				on:{
					input:(ev)=>{this.$emit("input", ev)}
				},
			}, 
			[],
			)
		},
		
		makeDefaultLabelSlot(h, vm_param){
			var label = this.colon?this.lable+":":this.label
			return h("view", 
				{
					style:{
						"width":"4em",
						"text-align":"center"
					}
				}, 
				[label],
			)
		}
    },

    render(h){

        // var retVn = h("div")
        // return retVn
		var _this = this
		var slots = this.$scopedSlots
		
		// var default_input_slot = function(){
		// 	return h("input")
		// }
		// var default_label_slot = function(){
		// 	return h("label")
		// }
		
		var input_vn = slots["input"] || this.makeDefaultInputSlot(h)
		var label_vn = slots["label"] || this.makeDefaultLabelSlot(h)
		var child_vns = [label_vn, input_vn]
		var render_class = {"zs-hlyt":true}
		
		if(this.layoutMode=="block")
		{
			render_class = {}
		}
		
		return h("view", {class:render_class}, child_vns )
    },

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