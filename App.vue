<script>
	import { getLocalStore } from './store/localStores'
	export default {
		onLaunch: function() {
			// getLocalStore("global").clear()
		},
		onShow: function() {
			// getLocalStore("global").removeItem("app")
		},
		onHide: function() {
			console.log('debug-app App Hide')
			// getLocalStore("global").saveItem("app", {"exit":true})
		},
		onExit(){
			console.log('debug-app App exit')
			getLocalStore("global").saveItem("app", {"exit":true})
		},
		beforeDestroy(){
			console.log('debug-app App Hide')
			getLocalStore("global").saveItem("app", {"exit":true})
		}
		
	}
</script>

<style lang="scss">
	// note : 'lang' attribute is scss
	/*每个页面公共css */
	
	// uni-app ui library
	@import '@/uni_modules/uni-scss/variables.scss';
	@import '@/uni_modules/uni-scss/index.scss';
	
	@import 'static/iconfont/iconfont.css';
	
	// zs custom style css file
	@import 'components/zs-components/zs-style.css';
	// @import 'components/zs-components/zs-icon/zs-style.css';
	
</style>
