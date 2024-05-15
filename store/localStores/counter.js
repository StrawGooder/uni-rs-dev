import {LocalStore} from "./base.js"

class CounterLocalStore extends LocalStore{

    constructor(name, scoped){
        super(name ||"counter", scoped)
    }
}

export {CounterLocalStore}