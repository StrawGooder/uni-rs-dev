<template>
	<view 
	v-show="show" 
	class="t-wrapper" 
	@touchmove.stop.prevent="moveHandle">
		<!-- click mask (backdrop) close the panel -->
		 <!-- @click.stop="close" -->

		<template
		v-if="show"
		>
			<view class="t-mask"
			:class="{active:show}"
			></view>
			<ZsColorPickerPanel 
			v-bind="$props"
			style="position:absolution;translate:(0px,0px)"
			@confirm="onConfirm"
			@cancel="onClose"
			>
			</ZsColorPickerPanel>
		</template>
	</view>
</template>

<script>
	// development base the t-color-picker of uni-plugin market
	import ZsColorPickerPanel from './ZsColorPickerPanel.vue';
	export default {
		name:"ZsColorPickerModal",
		components:{
			ZsColorPickerPanel
		},
		props: {
			color: {
				type: Object,
				default () {
					return {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					}
				}
			},
			spareColor: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				show: false,
				
			};
		},
		
		created(){
			
			uni.$on("colorpicker:open", this.openUni_)
			uni.$on("colorpicker:close", this.closeUni_)
			
			this.urfspanCompCaller = null
		},
	
		methods: {
			moveHandle() {},
			open() {
				this.show = true;
				// this.$nextTick(() => {
				// 	this.init();
				// 	setTimeout(() => {
				// 		this.active = true;
				// 		setTimeout(() => {
				// 			this.getSelectorQuery();
				// 		}, 350)
				// 	}, 50)
				// })

			},
			close() {
				this.active = false;
				this.$nextTick(() => {
					setTimeout(() => {
						this.show = false;
					}, 500)
				})
			},
			onClose(){
				this.close()
				this.$emit("close")
			},
			onConfirm() {
				this.close();
				
				
				const evt = 
					{
						rgba: this.rgba,
						hex: this.hex
					}
				evt["caller"] = this.urfspanCompCaller
				
				this.$emit('confirm', 
					evt
					)
				
				uni.$emit("colorpicker:confirm", evt)
			},
			
			// onConfirm(evt){
			// 	evt["caller"] = this.urfspanCompCaller
			// 	this.$emit("confirm", evt)
			// 	uni.$emit("colorpicker:confirm", evt)
			// }
			
			openUni_(callArgs){
				callArgs = callArgs || {sender:"unset", caller:"unset"}
				this.urfspanCompCaller = callArgs["caller"]
				this.open()
			},
			closeUni_(callArgs){
				callArgs = callArgs || {sender:"unset", caller:"unset"}
				this.urfspanCompCaller = callArgs["caller"]
				this.close()
			},
		}
	};
</script>

<style>
	
	.t-wrapper {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 9999;
		
	
	}

	.t-mask {
		position: absolute;
		top: 0;
		left: 0;
	/* 	right: 0;
		bottom: 0; */
		background: rgba(0, 0, 0, 0.25);
		z-index: -1;
		transition: all 0.3s;
		opacity: 0;
		width:100%;
		height: 100%;
	}

	.t-mask.active {
		opacity: 1;
	}

	.t-background {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
	}

</style>
