

<script type="text/javascript">

import Vue from 'vue';
import ZsCheckboxGroupForm from './ZsCheckboxGroup.vue';

// const items = 
	// return [
	// 					{"label":"单选", "checkedVal":1},
	// 					{"label":"多选", "checkedVal":1}
	// 				]
// export default Vue.extend(
// 	ZsCheckboxGroupForm,
// 	{
// 		name:"ZsSingleMultiCheckForm",
// 		props:{
// 			items:{
// 				type:Array,
// 				default:[
// 						{"label":"单选", "checkedVal":1},
// 						{"label":"多选", "checkedVal":1}
// 					]
// 				// default:()=>{
// 				// 	return [
// 				// 		{"label":"单选", "checkedVal":1},
// 				// 		{"label":"多选", "checkedVal":1}
// 				// 	]
// 				// }
// 			},
// 			checkedVal:{
// 				type:Array,
// 				default:()=>{
// 					return [true,false]
// 				}
// 			}
// 		}
// 	}
// );

export default (
	{
		name:"ZsSingleMultiCheckForm",
		mixins:[ZsCheckboxGroupForm],
		props:{
			items:{
				type:Array,
				// default:[
				// 		{"label":"单选", "checkedVal":"0"},
				// 		{"label":"多选", "checkedVal":"1"}
				// 	]
				default:()=>{
					return [
						{"label":"单选", "checkedVal":"0", "disabled":false},
						{"label":"多选", "checkedVal":"1"}
					]
				}
			},
			// checked:{
			// 	type:Array,
			// 	default:()=>{
			// 		return [true,false]
			// 	}
			// },
			multiChecked:{
				type:Boolean,
				default:false
			},
			selectAllOn:{
				type:Boolean,
				default:true,
			},
			selectNoOn:{
				type:Boolean,
				default:true,
			}
		}
	}
);

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
</style>