<template>
	<view>
		<olMap></olMap>
	</view>

</template>


<!-- ```javascript -->
<script>
	import olMap from "@/components/olmap/olmap.vue";
	export default {
		components: {
			olMap
		},
		data() {
			return {

			}
		},
		//切换tab时触发
		// onTabItemTap(e) {


		// },
	}
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
