<script>
	export default {
		onLaunch: function() {

		},
		onShow: function() {

		},
		onHide: function() {
			console.log('App Hide')
		},

	}
</script>

<style lang="scss">
	// note : lang is scss
	/*每个页面公共css */
	
	// uni-app ui library
	@import '@/uni_modules/uni-scss/variables.scss';
	@import '@/uni_modules/uni-scss/index.scss';
	
	@import 'static/iconfont/iconfont.css';
	
	// zs custom style
	@import 'components/zs-components/zs-icon/zs-style.css';
	
</style>
