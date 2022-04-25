import {
    SETLOGIN
} from '../actions/type';

const initialStateb = {
    isLogin: false
}
function setLogin(state = initialStateb, action) {
    switch (action.type) {
        case SETLOGIN:
            return { isLogin: action.data };
        default:
            return state;
    }
}
export {
    setLogin
}