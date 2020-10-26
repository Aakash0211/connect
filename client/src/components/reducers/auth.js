import{REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERR, LOGIN_SUCCESS, LOGIN_FAIL,LOG_OUT, DELETE_ACCOUNT} from'../../actions/types'

const initialState={
    token:localStorage.getItem('token'),
    isAuthenticated:null,
    loading:true,
    user:null
}
export default function(state=initialState,action){
 const {type,payload}=action
 switch(type){
    case USER_LOADED:{
       return {
        ...state,
        isAuthenticated:true,
        loading:false,
        user:payload
       }
    }
    case REGISTER_SUCCESS:{
      localStorage.setItem('token', payload.token);
     return{
        ...state,
        ...payload,
        isAuthenticated:true,
        loading:false
     }
    }
    case LOGIN_SUCCESS:{
      localStorage.setItem('token', payload.token);
      return{
         ...state,
         ...payload,
         isAuthenticated:true,
         loading:false
      }
     }
    case REGISTER_FAIL:
    case AUTH_ERR:
    case LOGIN_FAIL:
    case LOG_OUT:{
      localStorage.removeItem('token')
      return{
        ...state,
        token:null,
        isAuthenticated:false,
        loading:false,
        user:null
     }
    }
    case DELETE_ACCOUNT:{
      localStorage.removeItem('token')
      return{
        ...state,
        token:null,
        isAuthenticated:false,
        loading:true,
        user:null
     }
    }
   
    default:{
      return state
    }
 }
}