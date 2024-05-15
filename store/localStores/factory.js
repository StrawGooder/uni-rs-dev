// import {UserLocalStore} from "./user.js"
// import {CounterLocalStore} from "./counter.js"
import {LocalStore} from "./base.js"

function createLocalStore(name, scoped) {
    // body...
    name = name || "global"

    // if(name=="user")
    // {
    //     return new UserLocalStore(name)
    // }
    // else if(name=="counter")
    // {
    //     return new CounterLocalStore(name)
    // }
    // else
    // {
    //     return new LocalStore(name)
    // }

	return new LocalStore(name, scoped)
}


export {createLocalStore}