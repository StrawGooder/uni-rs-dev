<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		name:"init_componets",
		data() {
			return {
				locaiton:{
					init_longitudes:"XZ",
					init_latitude:"zxc",
				}
			}
		},
		methods:{
			getLocation(){	
				uni.getLocation({
					type: 'wgs84',
					success: function (res) {
					//修改初始值触发change后监听
						this.locaiton.init_longitudes = res.longitude
						this.locaiton.init_latitude = res.latitude	
						return locaiton
					},
					fail:function(res) {
						console.log("fails")
					}
				});
				
			},
		},
	}
</script>

<style>

</style>