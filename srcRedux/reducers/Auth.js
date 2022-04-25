import * as ActionTypes from '../actions/type';
import { produce } from 'immer';
import AppCodeConfig from '../../app/AppCodeConfig';
import { appConfig } from '../../app/Config';
import { objectMenuGlobal, menuDichBenh, menuThongTinCQ } from '../../app/data/dataGlobal';
import Utils from '../../app/Utils';

export const ListAccount = [
  { key: 0, title: 'Cán bộ', config: AppCodeConfig.APP_ADMIN, prior: 1, },
  { key: 1, title: 'Cộng đồng', config: AppCodeConfig.APP_CONGDAN, prior: 0 },
  { key: 2, title: 'Dịch vụ công', config: AppCodeConfig.APP_DVC, prior: 2 },
]
export const TypeUserChat = {
  USER_DVC: '1',
  USER_DH: '0',
  USER_CD: '-1'
}
export const initialStateAuth = {
  isLogin: false,
  infoUser: {},
  //cd
  userCD: {
  },
  tokenCD: '',
  configCD: {},
  //dh
  userDH: {
  },
  tokenDH: '',
  configDH: {},
  //Thông tin tài khoản dịch vụ công
  userDVC: '',
  RuleAppCanBo: [],
  userTNSmart: {},
  //chat
  tokenCHAT: '',
  userCHAT: {},
  TypeUserChat: TypeUserChat.USER_DVC,
  // Menu
  objectMenu: objectMenuGlobal,
  MenuCanBo: [],
  MenuCongDong: objectMenuGlobal.MenuCongDong,
  //menu tâm làm
  listMenuShowDH: [],
  listObjectDH: [],
  listObjectRuleDH: [],
  listObjectSpecialDH: [],
  listObjectRuleCD: objectMenuGlobal.MenuCongDong,
  ShowAppG: 0, // 1 hiển thị 0 ẩn=> check theo quyền AppCanBo,
  listInfoShow: [ListAccount[1]],
  indexInfoShow: 0,
  multiTypeUserChat: false,
  MenuChild: { menuDichBenh, menuThongTinCQ },
  listObjectRuleDichBenh: objectMenuGlobal.PhongDich,
  listObjectRulePhoBien: objectMenuGlobal.PhoBien,
  noiCachLy: ''
};

function AuthReducer(state = initialStateAuth, action) {
  return produce(state, draft => {


    switch (action.type) {
      case ActionTypes.SAVE_INFO: {
        draft.infoUser = action.data;
        draft.userDH = { ...state.userDH, ...action.data };
        break;
      }
      case ActionTypes.TypeActionAuth.SET_USER_APP: {
        const { app = AppCodeConfig.APP_CONGDAN, val = {} } = action.data;
        switch (app) {
          case AppCodeConfig.APP_CONGDAN:
            draft.userCD = val;
            draft.multiTypeUserChat = false
            break;
          case AppCodeConfig.APP_ADMIN:
            draft.userDH = { UserID: val.UserID || val.Id, Id: val.UserID || val.Id, ...state.userDH, ...val }
            draft.userCHAT = { UserID: val.UserID || val.Id, Id: val.UserID || val.Id, ...state.userDH, ...val }
            draft.TypeUserChat = TypeUserChat.USER_DH
            draft.multiTypeUserChat = false
            break;
          case AppCodeConfig.APP_DVC:
            draft.userDVC = val
            draft.listInfoShow = [...new Set([...state.listInfoShow, ListAccount.find(e => e.config == AppCodeConfig.APP_DVC)].map(JSON.stringify))].map(JSON.parse).sort(function (a, b) {
              return a["prior"] - b["prior"];
            })
            draft.multiTypeUserChat = false
            break;
          case AppCodeConfig.APP_CHAT:
            draft.userCHAT = val;
            draft.multiTypeUserChat = false
            break;
          // APP_CHAT
          default:
            break;
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_LIST_USER_APP: {
        // const {  } = action.data;
        let object = action.data;

        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key];
            let val = object[key]
            switch (key) {
              case AppCodeConfig.APP_CONGDAN:
                draft.userCD = val;
                break;
              case AppCodeConfig.APP_ADMIN:
                draft.userDH = { UserID: val.UserID || val.Id, Id: val.UserID || val.Id, ...state.userDH, ...val }
                draft.userCHAT = { UserID: val.UserID || val.Id, Id: val.UserID || val.Id, ...state.userDH, ...val }
                draft.TypeUserChat = TypeUserChat.USER_DH;
                draft.multiTypeUserChat = false;
                break;
              case AppCodeConfig.APP_DVC:
                draft.userDVC = val
                draft.listInfoShow = [...new Set([...state.listInfoShow, ListAccount.find(e => e.config == AppCodeConfig.APP_DVC)].map(JSON.stringify))].map(JSON.parse).sort(function (a, b) {
                  return a["prior"] - b["prior"];
                })
                draft.multiTypeUserChat = false;
                break;
              case AppCodeConfig.APP_CHAT:
                draft.userCHAT = val
                draft.multiTypeUserChat = false
                break;
              case AppCodeConfig.TAYNINHSMART:
                draft.userTNSmart = val
                break;
              // APP_CHAT
              default:
                break;
            }
          }
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_TOKEN_APP: {
        //data
        const { app = AppCodeConfig.APP_CONGDAN, val = '' } = action.data;
        switch (app) {
          case AppCodeConfig.APP_CONGDAN:
            if (val.length > 0) {
              draft.tokenCD = val;
            }
            break;
          case AppCodeConfig.APP_ADMIN:
            if (val.length > 0) {
              draft.tokenDH = val
              draft.tokenCHAT = val;
              draft.TypeUserChat = TypeUserChat.USER_DH;
              draft.multiTypeUserChat = true;
              draft.listInfoShow = [...new Set([...state.listInfoShow, ListAccount.find(e => e.config == AppCodeConfig.APP_ADMIN)].map(JSON.stringify))].map(JSON.parse).sort(function (a, b) {
                return a["prior"] - b["prior"];
              })
            }
            break;
          case AppCodeConfig.APP_CHAT:
            if (val.length > 0) {
              draft.tokenCHAT = val;
              draft.multiTypeUserChat = false;
            }
            break;
          default:
            break;
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_TOKEN_LIST_APP: {
        //data
        let object = action.data
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            let val = object[key]
            const element = object[key];
            switch (key) {
              case AppCodeConfig.APP_CONGDAN:
                if (val.length > 0) {
                  draft.tokenCD = val;
                }
                break;
              case AppCodeConfig.APP_ADMIN:
                if (val.length > 0) {
                  draft.tokenDH = val
                  draft.tokenCHAT = val;
                  draft.TypeUserChat = TypeUserChat.USER_DH
                  draft.listInfoShow = [...new Set([...state.listInfoShow, ListAccount.find(e => e.config == AppCodeConfig.APP_ADMIN)].map(JSON.stringify))].map(JSON.parse).sort(function (a, b) {
                    return a["prior"] - b["prior"];
                  })
                }
                break;
              case AppCodeConfig.APP_CHAT:
                if (val.length > 0) {
                  draft.tokenCHAT = val;
                  draft.multiTypeUserChat = false;
                }
                break;
              default:
                break;
            }
          }
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_CONFIG_APP: {
        const { app = AppCodeConfig.APP_CONGDAN, val = {} } = action.data;
        switch (app) {
          case AppCodeConfig.APP_CONGDAN:
            draft.configCD = val
            break;
          case AppCodeConfig.APP_ADMIN:
            draft.configDH = val
            break;
          default:
            break;
        }
        break;
      }
      case ActionTypes.TypeActionAuth.LOGOUT_APP: {
        const app = action.data;
        switch (app) {
          case AppCodeConfig.APP_CONGDAN:
            draft.configCD = {};
            draft.tokenCD = '';
            draft.userCD = {};
            if (state.TypeUserChat == TypeUserChat.USER_DVC) {
              draft.tokenCHAT = '';
              draft.userCHAT = {};
            }
            // draft.listInfoShow = state.listInfoShow.filter(item => item.config != AppCodeConfig.APP_CONGDAN)
            break;
          case AppCodeConfig.APP_ADMIN:
            draft.configDH = {}

            draft.tokenDH = '';
            draft.userDH = {};

            draft.tokenCHAT = '';
            draft.userCHAT = {};
            draft.listInfoShow = state.listInfoShow.filter(item => item.config != AppCodeConfig.APP_ADMIN)
            break;
          case AppCodeConfig.APP_DVC:
            draft.userDVC = '';
            draft.TypeUserChat = TypeUserChat.USER_DVC
            draft.listInfoShow = state.listInfoShow.filter(item => item.config != AppCodeConfig.APP_DVC)
            break;
          default:
            break;
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_DATA_LIENKET: {
        const { user, token, tokenG, user1022G } = action.data;
        if (user && token) {
          draft.tokenCD = token
          draft.userCD = { ...state.userCD, Id: user }
        }
        if (user1022G && tokenG) {
          draft.tokenDH = tokenG
          draft.userDH = { ...state.userDH, UserID: user1022G, Id: user1022G }
          draft.infoUser = { ...state.infoUser, UserID: user1022G, Id: user1022G }
        }
        break;
      }
      case ActionTypes.TypeActionAuth.SET_RULE_APPCANBO: {
        draft.RuleAppCanBo = action.data
        break;
      }
      //Menu
      case ActionTypes.TypeMenu.SET_OBJECT_MENU: {
        const {
          objectMenu = objectMenuGlobal,
          MenuCanBo = [],
          MenuCongDong = objectMenuGlobal.MenuCongDong,
          listMenuShowDH = [],
          listObjectDH = [],
          listObjectRuleDH = [],
          listObjectSpecialDH = [],
          listObjectRuleCD = objectMenuGlobal.MenuCongDong,
          listObjectRuleDichBenh = objectMenuGlobal.PhongDich,
          listObjectRulePhoBien = objectMenuGlobal.PhoBien,
          ShowAppG = 0,
          listInfoShow = []
        } = state;

        // Utils.nlog('data object menu', action.data)
        if (action.data) {
          draft.objectMenu = action.data;
          //đồn bộ menu hiện tại với menu online;
          // listObjectDH: [],
          const { MenuAppDH = [], MenuAppRuleDH = [], MenuAppSpecialDH = [], MenuCongDong = [], PhongDich = [], PhoBien = [] } = action.data;

          if (MenuAppDH && MenuAppDH.length > 0) {
            let newlist = []
            for (let index = 0; index < MenuAppDH.length; index++) {
              const element = MenuAppDH[index];
              let check = listObjectDH?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectDH = newlist;
          }
          // listObjectRuleDH: [],
          if (MenuAppRuleDH && MenuAppRuleDH.length > 0) {
            let newlist = []
            for (let index = 0; index < MenuAppRuleDH.length; index++) {
              const element = MenuAppRuleDH[index];

              let check = listObjectRuleDH?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectRuleDH = newlist;
          }
          // listObjectSpecialDH: [],
          if (MenuAppSpecialDH && MenuAppSpecialDH.length > 0) {
            let newlist = []
            for (let index = 0; index < MenuAppSpecialDH.length; index++) {
              const element = MenuAppSpecialDH[index];

              let check = listObjectSpecialDH?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectSpecialDH = newlist;
          }
          // MenuCongDong
          // listObjectRuleCD: objectMenu.MenuCongDong,
          if (MenuCongDong && MenuCongDong.length > 0) {
            let newlist = []
            for (let index = 0; index < MenuCongDong.length; index++) {
              const element = MenuCongDong[index];
              let check = listObjectRuleCD?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectRuleCD = newlist;
          }
          // Menu phong dich
          // listObjectRuleDichBenh: objectMenuGlobal.PhongDich,
          if (PhongDich && PhongDich.length > 0) {
            let newlist = []
            for (let index = 0; index < PhongDich.length; index++) {
              const element = PhongDich[index];
              let check = listObjectRuleDichBenh?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectRuleDichBenh = newlist;
          } else
            draft.listObjectRuleDichBenh = [];
          // Menu pho bien
          // listObjectRulePhoBien: objectMenuGlobal.PhoBien,
          if (PhoBien && PhoBien.length > 0) {
            let newlist = []
            for (let index = 0; index < PhoBien.length; index++) {
              const element = PhoBien[index];
              let check = listObjectRulePhoBien?.find(item => item.id == element.id)
              if (check) {
                if (check.isShow != -1) {
                  newlist = [...newlist, element];
                }
              } else {
                if (element.isShow == 1) {
                  newlist = [...newlist, element];
                } else {
                  //k làm gì hết;
                }
              }
            }
            draft.listObjectRulePhoBien = newlist;
          } else
            draft.listObjectRulePhoBien = [];
        }
        break;
      }
      case ActionTypes.TypeMenu.SET_MENU_CANBO: {
        let { dataRule = [], tokenCB = '' } = action.data;
        let dataMenu = []
        // Utils.nlog('redux menu can bo', dataMenu)
        draft.MenuCanBo = dataMenu;
        break;
      }
      case ActionTypes.TypeMenu.SET_MENU_CONGDONG: {
        let dataRule = action.data // Hiện tại menu cộng đồng luôn hiện full chức năng nên chưa check rule
        draft.MenuCongDong = state.objectMenu.MenuCongDong
        break;
      }
      case ActionTypes.TypeMenu.SET_SHOWAPP_G: {
        draft.ShowAppG = action.data
        break;
      }
      //LOAD MNENU
      case ActionTypes.TypeMenu.LOAD_MENU: {

        const {
          objectMenu = objectMenuGlobal,
          MenuCanBo = [],
          MenuCongDong = objectMenuGlobal.MenuCongDong,
          listMenuShowDH = [],
          listObjectDH = [],
          listObjectRuleDH = [],
          listObjectSpecialDH = [],
          listObjectRuleCD = objectMenuGlobal.MenuCongDong,
          listInfoShow = [],
          tokenDH
        } = state;

        const { ShowAppG = -1, listRuleDH = [], listObjectMenuDVC = [], isLogouDH = false, isLogoutDVC = false } = action.data;

        //check biến showAppG;
        let VarCheckShowAppG = ShowAppG == 1 ? ShowAppG : state.ShowAppG;
        let dataMenu = []

        if (VarCheckShowAppG == 1) {
          draft.ShowAppG = 1;

        }

        if (VarCheckShowAppG == 1 && objectMenu.MenuAppDH) {
          Utils.nlog("menu---------->1")
          draft.listObjectDH = objectMenu.MenuAppDH.filter(item => item.isShow != -1);
          dataMenu = [...dataMenu, ...objectMenu.MenuAppDH.filter(item => item.isShow != -1)];

        } else {
          // Utils.nlog("menu---------->2")
          //lay list hienj tai
          if (VarCheckShowAppG == 1) {
            // Utils.nlog("menu---------->2.1")
            dataMenu = [...dataMenu, ...state.listObjectDH]
          } else {

            // Utils.nlog("menu---------->2.2")
            dataMenu = [...dataMenu, ...state.listObjectDH.filter(item => item.code != appConfig.CodeConfigCanBo)]
            draft.listObjectDH = state.listObjectDH.filter(item => item.code != appConfig.CodeConfigCanBo);
          }
          // dataMenu = [...dataMenu,]
          //check rule diều hành.
        }
        // ----------------------------------------------------------------
        // //load list menu thoeo rule new
        if (isLogouDH) { //logout
          Utils.nlog("menu---------->3")
          draft.listObjectRuleDH = [];
        } else if (listRuleDH && listRuleDH.length > 0 || tokenDH) {
          // Utils.nlog("menu---------->4", listRuleDH)
          // xử lý app G
          let newlist = []
          if (objectMenu.MenuAppRuleDH && objectMenu.MenuAppRuleDH) {
            let objecjMenuRule = objectMenu.MenuAppRuleDH.filter(item => item.isShow != -1);
            for (let index = 0; index < objecjMenuRule.length; index++) {
              const element = objecjMenuRule[index];
              if (listRuleDH.includes(element.rule) || element.rule == -2) {
                newlist = [...newlist, element]
              }
            }
          }
          dataMenu = [...dataMenu, ...newlist]
          draft.listObjectRuleDH = newlist;
          //xử lý app theo rule
        } else {
          Utils.nlog("menu---------->5")
          dataMenu = [...dataMenu, ...listObjectRuleDH]

        }
        // ----------------------------------------------------------------

        if (isLogoutDVC) { //logout dịch vụ công
          Utils.nlog("menu---------->6")
          draft.listObjectSpecialDH = [];
        } else if (listObjectMenuDVC && listObjectMenuDVC.length > 0) {
          Utils.nlog("menu---------->7")
          let newlist = []
          if (objectMenu.MenuAppSpecialDH && objectMenu.MenuAppSpecialDH.length > 0) {
            let MenuAppSpecialDH = objectMenu.MenuAppSpecialDH.filter(item => item.isShow != -1);
            for (let index = 0; index < MenuAppSpecialDH.length; index++) {
              const element = MenuAppSpecialDH[index];
              if (listObjectMenuDVC.find(item => item.Ma == element.code)) {
                newlist = [...newlist, element]
              }
            }
            // //nếu mún bắt quyền ShowAppG cao nhất thì mở ra
            if (VarCheckShowAppG != 1 && newlist?.length > 0) {
              newlist = newlist.filter(item => item.code != appConfig.CodeConfigCanBo)
            }

          }
          dataMenu = [...dataMenu, ...newlist]
          draft.listObjectSpecialDH = newlist;
        } else {
          Utils.nlog("menu---------->8")

          //lấy menu từ bộ nhớ hiện tại
          // dataMenu = [...dataMenu, ...state.listObjectSpecialDH]
          // draft.listObjectSpecialDH = state.listObjectSpecialDH;


          //nếu mún bắt quyền ShowAppG cao nhất thì mở ra và đóng ở trên
          if (VarCheckShowAppG == 1) {
            dataMenu = [...dataMenu, ...state.listObjectSpecialDH]
            draft.listObjectSpecialDH = state.listObjectSpecialDH;
          } else {
            dataMenu = [...dataMenu, ...state.listObjectSpecialDH.filter(item => item.code != appConfig.CodeConfigCanBo)];
            draft.listObjectSpecialDH = state.listObjectSpecialDH.filter(item => item.code != appConfig.CodeConfigCanBo);
          }
          //------------end

        }

        if (dataMenu && dataMenu.length > 0) {
          Utils.nlog("menu---------->9")
          draft.listMenuShowDH = [...new Set(dataMenu.map(JSON.stringify))].map(JSON.parse).sort(function (a, b) {
            return a["prior"] - b["prior"];
          })

        } else {
          Utils.nlog("menu---------->10")
          draft.listMenuShowDH = [];
        }
        break;
      }
      case ActionTypes.TypeMenu.SET_LIST_OBJECT_RULE_DH: {
        draft.listObjectRuleDH = action.data;
        break;
      }
      case ActionTypes.TypeMenu.SET_LIST_OBJECT_SPECIAL_DH: {
        draft.listObjectSpecialDH = action.data;
        break;
      }
      case ActionTypes.TypeActionAuth.SET_TYPE_USERCHAT: {
        draft.TypeUserChat = action.data;
        break;
      }
      case ActionTypes.TypeActionAuth.SET_MENU_DICHBENH: {
        draft.MenuChild = { ...state.MenuChild, [action.key]: action.data };
        break;
      }
      case ActionTypes.TypeActionAuth.SAVE_NOICACHLY: {
        draft.noiCachLy = action.data;
        break;
      }
    }
  })
}

export default AuthReducer;


