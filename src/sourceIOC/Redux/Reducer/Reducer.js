import { combineReducers } from "redux";
import DVCReducer from './DichVuCongReducer';
import UserReducer from './UserReducer';
import OptionReducer from './OptionReducer';
import { IReducerType } from '../../Interface/Reducer';

// const Reducer:IReducerType = {
//     User:UserReducer,
//     DichVuCong:DVCReducer,
//     Option:OptionReducer
// }

const ReducerIOC = {
    User: UserReducer,
    Option: OptionReducer,
    ...DVCReducer
}
export default ReducerIOC


// export default combineReducers(Reducer);
