
import store from "./user.js"
import mapStore from "./map.js"

// function initStorePlugin(app){
	
// 	app.prototype.$store = store
// 	app.prototype.$mapStore = mapStore
// }

function setupStorePlugin(app){
	
	app.use(store)
	app.use(mapStore)
	
}


// export {
// 	initStorePlugin
// }