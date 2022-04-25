import {UserInfo} from '../../Interface/User';

export const Type = {
    "USER_INFO":"@USER_USER_INFO",
    "TOKEN":"@USER_TOKEN",
    "SIGN_IN_STATE":"@USER_SIGN_IN_STATE"
}

export type UserReducerProps =  {
    UserInfo?:UserInfo,
    Token?:string,
    SignInState?:boolean
}

const UserReducer = (state:UserReducerProps = {},{type,value})=>
{
    switch (type)
    {
        case Type.SIGN_IN_STATE: {
            state.SignInState = value;
            return state;
        }
        case Type.USER_INFO : {
            state.UserInfo = value;
            return state;
        }
        case Type.TOKEN:{
            state.Token = value
            return state;
        }
        default:return state;
    }
}

export default UserReducer;
