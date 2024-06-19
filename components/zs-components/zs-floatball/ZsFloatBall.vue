<template>
    
		<view
		style="position: absolute; z-index: 999; top: 30vh; left:0rpx;"
		>
			<view
			>	
				<ZsButtonSta2
				v-if = "!rfctrlPanelVisible"
				icon="b-ring-fill"
				color="bisque"
				:size="32"
				:status="0"
				@click="onFloatBallClicked"
				>	
				</ZsButtonSta2>
				<view
				v-if="rfctrlPanelVisible"
				>
					<view>
						<ZsButtonSta2
						text="^"
						color="black"
						bgColor="bisque"
						:size="[32,16]"
						:status="0"
						noWrapContent
						@click="onRecycleBallClicked"
						>	
						</ZsButtonSta2>
					</view>
				
					</ZsButtonSta2>
					<!-- <MapViewBasicCtrlPanel>
						
					</MapViewBasicCtrlPanel>	 -->
					<!-- <slot name="panel">
						
					</slot> -->
					<slot>
						<view></view>
					</slot>
				</view>
			</view>
		</view>
    
</template>

<script type="text/javascript">

import Vue from 'vue';
import ZsButtonSta2 from "@/components/zs-components/zs-button-group/ZsButtonSta2.vue";

export default {
    
    name:"ZsFloatBall",

    props:{

    },

    components:{
		ZsButtonSta2
		
	},

    mixins:[],

    data(){

        var props = this.$props
        
        return {
			rfctrlPanelVisible:false
        }
    },

    computed:{

    },

    created(){

    },

    methods:{


		onFloatBallClicked(evt){
			
			var evtData = evt['data']
			// if(evtData["en"])
			this.rfctrlPanelVisible = evtData["enabled"]
		},
		
		onRecycleBallClicked(evt){
			
			this.rfctrlPanelVisible = false
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