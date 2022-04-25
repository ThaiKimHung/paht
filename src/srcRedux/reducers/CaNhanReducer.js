import * as Types from '../actions/type'
import { produce } from 'immer';
const initialState = {
    datafilter: {

    },
    listlinhvuc: []
};

function CaNhanReducer(state = initialState, action) {
    return produce(state, draft => {
        switch (action.type) {
            case Types.SET_OBJECTFILTER: {
                draft.datafilter = action.data;
                break;
            }
            case Types.SET_LISTLINGVUC: {
                draft.listlinhvuc = action.data;
                break
            }
            default:
                return state;
        }
    })
}
export default CaNhanReducer