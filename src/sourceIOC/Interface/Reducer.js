import type {UserReducerProps} from '../Redux/Reducer/UserReducer';
import type {IDvcReducer} from './DichVuCong';
import type {OptionState} from './Option';


export type IReducerType = {
    User:UserReducerProps,
    DichVuCong:IDvcReducer,
    Option:OptionState
}
