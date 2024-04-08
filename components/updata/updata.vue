<template>
	<view>
		<getimagedatas @sendimagedata="getimagedata"></getimagedatas>
	</view>
	
</template>

<script>
	import getimagedatas from "./@/components/custom-tab-check/custom-tab-check-chooseimage.vue"
	export default {
		
		components: {
				getimagedatas
		},

		methods:{
			getimagedata(res){
				console.log("---++++----------------")
				console.log('子组件的内容',res)
			},
		},
	}
</script>

<style>

</style>