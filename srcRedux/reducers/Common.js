import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import AppCodeConfig from '../../app/AppCodeConfig';
let listdesign = [
    {
        id: 1,
        name: "CD",

    },
    {
        id: 2,
        name: "DH",

    },
    {
        id: 3,
        name: "CD-DH",

    }
]
export const NameConfig = {
    NGUOIDAN: 'NGUOIDAN',
    DIEUHANH: "DIEUHANH",
    DICHVUCONG: "DICHVUCONG",
}
export const initialStateCommon = {
    // whitelist:[]
    listdesign: listdesign,
    currendesign: listdesign[2],
    [NameConfig.NGUOIDAN]: {},
    [NameConfig.DIEUHANH]: {},
    [NameConfig.DICHVUCONG]: {},
    dataCamera: [{ id: -1 }, { id: -1 }, { id: -1 }, { id: -1 }, { id: -1 }, { id: -1 }],
    keyCamera: 1,
    listCamChoose: [
        {
            id: -1
        },
        {
            id: -2
        },
        {
            id: -3
        },
        {
            id: -4
        },
        {
            id: -5
        },
        {
            id: -6
        }

    ],
};

function CommonReducer(state = initialStateCommon, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.TypeCommon.SET_DESIGN: {
                draft.currendesign = action.data;
                break;
            }
            case ActionTypes.TypeCommon.SET_CONFIG: {
                const { key = '', value = '' } = action.data
                switch (key) {
                    case NameConfig.DICHVUCONG:
                        draft[NameConfig.DICHVUCONG] = value;
                        break;
                    case NameConfig.NGUOIDAN:
                        draft[NameConfig.NGUOIDAN] = value;
                        break;
                    case NameConfig.DIEUHANH:
                        draft[NameConfig.DIEUHANH] = value;
                        break;
                    default:
                        break;
                }
                break;
            }
            case ActionTypes.TypeCommon.SET_CAMERA_ANNINH: {
                draft.dataCamera = action.data;
                break;
            }
            case ActionTypes.TypeCommon.SET_KEY_CAMERA: {
                draft.keyCamera = action.data;
                break;
            }
            case ActionTypes.TypeCommon.SET_LISTCAM: {
                draft.listCamChoose = action.data;
                break;
            }
            case ActionTypes.TypeCommon.SET_CHECK_LIST_CAM: {
                let num = action.data;
                if (state.listCamChoose && state.listCamChoose.length < num) {
                    let newlist = [...state.listCamChoose]
                    for (let j = 0; j < num - state.listCamChoose.length; j++) {
                        newlist = [...newlist, { id: j + state.listCamChoose.length + 1 }]
                    }
                    draft.listCamChoose = newlist;
                } else {
                    draft.listCamChoose = [...state.listCamChoose];
                }
                break;
            }

        }
    })
}



export default CommonReducer;
