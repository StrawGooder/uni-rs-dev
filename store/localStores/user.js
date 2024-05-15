import {LocalStore} from "./base.js"
import {SysAdminTypeEnum} from "../../utils/enums.js"


const _test_user_config_data = {
    "normal":{

        "username":"rsisadmin02",
        "admin_role":{
            "admin_type":1,
            "admin_title":"normal",
            "level":1
        },
        "authorization":{
            "scheme":"OAuth2",
            "options":{
                "OAuth2":{
                    "token":{
                        "code":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODIzMDM3MjQsInN1YiI6IjMifQ.0jalB4oPDuXFp1irYkmFcLgbcaWj8wU4lrfmcMpTE4I",
                        "type":"Bearer"
                    }
                }
            }
        },
        "token":{
            "code":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODIzMDM3MjQsInN1YiI6IjMifQ.0jalB4oPDuXFp1irYkmFcLgbcaWj8wU4lrfmcMpTE4I",
            "type":"Bearer"
        }
    },
    "admin":{

        "username":"rsisadmin03",
        "admin_role":{
            "admin_type":2,
            "admin_title":"admin",
            "level":998

        },
        "authorization":{
            "scheme":"OAuth2",
            "options":{
                "OAuth2":{
                    "token":{
                        "code":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODIzNTA3NzgsInN1YiI6IjQifQ.t0gX_0zBfY3E5NgXac-v41Zvb1s6bVz59igzjUOABZg",
                        "type":"Bearer"
                    }
                }
            }
        },
        "token":{
            "code":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODIzNTA3NzgsInN1YiI6IjQifQ.t0gX_0zBfY3E5NgXac-v41Zvb1s6bVz59igzjUOABZg",
            "type":"Bearer"
        }
    },

    "superAdmin":{

        "username":"rsisadmin",
        "admin_role":{
            "admin_type":3,
            "admin_title":"superAdmin",
            "level":999
        },
        "authorization":{
            "token":"",
        },
        "token":{
            "code":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODk4Njk1OTgsInN1YiI6IntcInVzZXJfaWRcIjogMSwgXCJjbGllbnRfaWRcIjogMiwgXCJzZXNzaW9uX2lkXCI6IFwiYWJmNjMwNzZjZTAyNTZlN1wifSIsImV4enMiOiJzaW1wbGUifQ.WQDhyg-4jIi1hIOVOn-9HbdYX2AyKWpiWeOhuKwm29Q",
            "type":"Bearer"
        }
    },

}


class UserLocalStore extends LocalStore {

    constructor(name, scoped){
        super(name || "user")
    }
}

function getTestUserByAdminRole(admin_type) {
    // body...
    // if(typeof admin_type == "number")
    // {
    //     admin_type = SysAdminTypeEnum.nameOf(admin_type)
    // }
    
    admin_type = admin_type || "normal"

    var data = _test_user_config_data[admin_type]

    data["token_type"] = data["token"]["type"]
    data["token"] = data["token"]["code"]

    return data
}

function getTestUserTokenByAdminRole(admin_type){

    var user = getTestUserByAdminRole(admin_type)

    return user["token"]
}



// const userLocSto = new UserLocalStore()

// function getUserLocalStore(){

//     return userLocSto

// } 

function createUserLocalStore(){
    return new UserLocalStore()
}

export {
    UserLocalStore, 
    getTestUserByAdminRole, 
    getTestUserTokenByAdminRole, 
    createUserLocalStore
    // getUserLocalStore
}