
// import {getTestUserByAdminRole} from "./user.js"

import {createLocalStore} from "./factory.js"

// import {genRandomStrings} from "../../utils/keygen.js"
// const userLocSto = new UserLocalStore()

const _localStoreTable = {
    "user": createLocalStore("user"),
    "counter": createLocalStore("counter"),
	"map": createLocalStore("map"),
    "global":createLocalStore("global")
}


function getLocalStore(key){
    key = key || "global"
    return _localStoreTable[key]

}


function initLocalStore(){

    var lsto = getLocalStore("global")

    // var clientSessionId = lsto.getItem("clientSessionId")
    // if(!clientSessionId)
    // {
    //     var sessionId = genRandomStrings(8)
    //     lsto.setItem("clientSessionId", genRandomStrings(8))
    // }

}

// initLocalStore()

export {
    // getTestUserByAdminRole, 
    getLocalStore, 
    initLocalStore
}