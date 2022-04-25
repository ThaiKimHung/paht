import {
  SETLANGUAGE,
  GETLIST_LINHVUC,
  GETLIST_CHUYENMUC,
  GETLIST_MUCDOALL,
  GETLIST_NGUONPHANANH,
  GETLIST_DONVIAPP,
  GETLIST_MESSAGE,
  SET_MESSAGE,
  CHANGE_TYPE_MESSAGE,
  SET_INFOCHAT,
  SET_LISTGROUPCHAT,
  REMOVEMESSAGE,
  DELETEALLMESSAGE,
  LIST_SENDFILE,
  UPDATE_MESSAGEFILE,
  SETEMPTYMESSAGE,
  SETISCHAT,
  SETICONCHAT,
  GETLIST_MUCDOALL_NB,
  GETLIST_DONVIAPP_NB,
  STATUS_CONNECT,
  CHANGE_ID_MESSAGE,
  STATUS_NOTIFY,
  REMOVEMESSAGE_SENKEY,
  ASYNCDDATA,
  STATUS_CONNECT_RUN
} from '../actions/type';
import Utils from '../../app/Utils';
export const initialStateLag = {};

function setLanguage(state = initialStateLag, action) {
  switch (action.type) {
    case SETLANGUAGE:
      return action.data;
    default:
      return state;
  }
}

function GetList_LinhVuc(
  state = [{ IdLinhVuc: 100, LinhVuc: '[ Chọn lĩnh vực ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_LINHVUC:
      return [{ IdLinhVuc: 100, LinhVuc: '[ Chọn lĩnh vực ]' }, ...action.data];
    default:
      return state;
  }
}

function GetList_ChuyenMuc(
  state = [{ IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_CHUYENMUC:
      return [
        { IdChuyenMuc: 100, TenChuyenMuc: '[ Chọn chuyên mục ]' },
        ...action.data
      ];
    default:
      return state;
  }
}

function GetList_MucDoAll(
  state = [{ IdMucDo: 100, TenMucDo: '[ Chọn mức độ ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_MUCDOALL:
      return [{ IdMucDo: 100, TenMucDo: '[ Chọn mức độ ]' }, ...action.data];
    default:
      return state;
  }
}

function GetList_NguonPhanAnh(
  state = [{ IdNguon: 100, TenNguon: '[ Chọn nguồn ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_NGUONPHANANH:
      return [{ IdNguon: 100, TenNguon: '[ Chọn nguồn ]' }, ...action.data];
    default:
      return state;
  }
}
function GetList_DonVi(
  state = [{ MaPX: -1, TenPhuongXa: '[ Chọn đơn vị ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_DONVIAPP:
      return [{ MaPX: -1, TenPhuongXa: '[ Chọn đơn vị ]' }, ...action.data];
    default:
      return state;
  }
}

//
function GetList_MucDoAll_NB(
  state = [{ IdMucDo: 100, TenMucDo: '[ Chọn mức độ ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_MUCDOALL_NB:
      return [{ IdMucDo: 100, TenMucDo: '[ Chọn mức độ ]' }, ...action.data];
    default:
      return state;
  }
}

function GetList_DonVi_NB(
  state = [{ MaPX: -1, TenPhuongXa: '[ Chọn đơn vị ]' }],
  action
) {
  switch (action.type) {
    case GETLIST_DONVIAPP_NB:
      return [{ MaPX: -1, TenPhuongXa: '[ Chọn đơn vị ]' }, ...action.data];
    default:
      return state;
  }
}

function DataNotify(state = initStateNotify, action) {
  switch (action.type) {
    case STATUS_NOTIFY: {
      return {
        status: action.data
      };
    }
    default:
      return state;
  }
}

export {
  setLanguage,
  GetList_LinhVuc,
  GetList_ChuyenMuc,
  GetList_MucDoAll,
  GetList_NguonPhanAnh,
  GetList_DonVi,
  GetList_MucDoAll_NB,
  GetList_DonVi_NB,

};
