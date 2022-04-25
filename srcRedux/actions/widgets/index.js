import * as ActionTypes from '../type';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { ApiRaoVat, ApiThueNha } from '../../../src/Widgets/apis';

export const setDataTaoSuaTinRaoVat = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TAO_SUA_TINRAOVAT,
  data: val
});

export const setDataRaoVatCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_RAOVATCANHAN,
  data: val
});

export const setRefreshingRaoVatCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_REFRESHING_RAOVATCANHAN,
  data: val
});

export const setPageRaoVatCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_PAGE_RAOVATCANHAN,
  data: val
});

export const loadListRaoVatCaNhan = (isNext = false, keysFilter = '', keyVals = '') => {
  return async (dispatch, getState) => {
    const { LstRaoVatCaNhan = [], RefreshingRaoVatCaNhan, PageRaoVatCaNhan = { Page: 1, AllPage: 1 } } = getState().Widgets
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "",
      "query.sortOrder": "asc",
      "query.filter.keys": `CaNhan|${keysFilter}`,
      "query.filter.vals": `1|${keyVals}`,
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageRaoVatCaNhan?.Page + 1 : 1
    }
    if (keysFilter && keyVals) {
      paramsAPI = {
        ...paramsAPI,
        "query.filter.keys": `CaNhan|${keysFilter}`,
        "query.filter.vals": `1|${keyVals}`,
      }
    }
    let res = await ApiRaoVat.GetList_TinRaoVat(paramsAPI)
    Utils.nlog('res list tin rao vat ca nhan', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(setDataRaoVatCaNhan(isNext ? [...LstRaoVatCaNhan, ...data] : data))
      dispatch(setPageRaoVatCaNhan(res?.page))
      dispatch(setRefreshingRaoVatCaNhan(false))
    } else {
      dispatch(setDataRaoVatCaNhan([]))
      dispatch(setPageRaoVatCaNhan({ Page: 1, AllPage: 1 }))
      dispatch(setRefreshingRaoVatCaNhan(false))
    }
  }
}

export const deleteTinRaoVatCaNhan = val => ({
  type: ActionTypes.TypeWidget.DELETE_TINRAOVAT_CANHAN,
  data: val
});

export const setDataTinRaoVat = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TINRAOVAT,
  data: val
});

export const setRefreshingTinRaoVat = val => ({
  type: ActionTypes.TypeWidget.SET_REFRESHING_TINRAOVAT,
  data: val
});

export const setPageTinRaoVat = val => ({
  type: ActionTypes.TypeWidget.SET_PAGE_TINRAOVAT,
  data: val
});

export const setLikeUnlikeTinRaoVat = val => ({
  type: ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINRAOVAT,
  data: val
});


export const loadListTinRaoVat = (isNext = false, keysFilter = '', keyVals = '') => {
  return async (dispatch, getState) => {
    const { LstTinRaoVat = [], PageTinRaoVat = { Page: 1, AllPage: 1 } } = getState().Widgets
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "",
      "query.sortOrder": "asc",
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageTinRaoVat?.Page + 1 : 1
    }
    if (keysFilter && keyVals) {
      paramsAPI = {
        ...paramsAPI,
        "query.filter.keys": `${keysFilter}`,
        "query.filter.vals": `${keyVals}`,
      }
    }
    let res = await ApiRaoVat.GetList_TinRaoVat(paramsAPI)
    Utils.nlog('res list tin rao vat chung', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(setDataTinRaoVat(isNext ? [...LstTinRaoVat, ...data] : data))
      dispatch(setPageTinRaoVat(res?.page))
      dispatch(setRefreshingTinRaoVat(false))
    } else {
      dispatch(setDataTinRaoVat([]))
      dispatch(setPageTinRaoVat({ Page: 1, AllPage: 1 }))
      dispatch(setRefreshingTinRaoVat(false))
    }
  }
}

export const saveTinRaoVat = (item, isSave = true) => {
  return async (dispatch, getState) => {
    var formdata = new FormData();
    formdata.append("DaLuu", isSave == true ? 1 : 0);
    formdata.append("IdTinRaoVat", item?.IdTinRaoVat);
    // console.log('formdata save', formdata)
    let res = await ApiRaoVat.LuuTinRaoVat(formdata)
    // console.log('[LOG] res formdata save', res)
    if (res.status == 1) {
      //Gọi redux các action có list chứa icStar
      // tab tin rao vật chung
      dispatch(setLikeUnlikeTinRaoVat(item))

      // tab đã lưu
      if (item?.DaLuu) {
        dispatch(setLikeUnlikeTinRaoVatDaLuu(item))
      } else {
        dispatch(loadListTinRaoVatDaLuu())
      }

    } else {
      Utils.showToastMsg('Thông báo', 'Đã xảy ra lỗi, vui lòng thử lại!', icon_typeToast.warning, 2000)
    }
  }
}

export const setDataTinRaoVatDaLuu = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TINRAOVAT_DALUU,
  data: val
});

export const setRefreshingTinRaoVatDaLuu = val => ({
  type: ActionTypes.TypeWidget.SET_REFRESHING_TINRAOVAT_DALUU,
  data: val
});

export const setPageTinRaoVatDaLuu = val => ({
  type: ActionTypes.TypeWidget.SET_PAGE_TINRAOVAT_DALUU,
  data: val
});

export const setLikeUnlikeTinRaoVatDaLuu = val => ({
  type: ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINRAOVAT_DALUU,
  data: val
});

export const loadListTinRaoVatDaLuu = (isNext = false, keysFilter = '', keyVals = '') => {
  return async (dispatch, getState) => {
    const { LstTinRaoVatDaLuu = [], PageTinRaoVatDaLuu = { Page: 1, AllPage: 1 } } = getState().Widgets
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "",
      "query.sortOrder": "asc",
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageTinRaoVatDaLuu?.Page + 1 : 1
    }
    if (keysFilter && keyVals) {
      paramsAPI = {
        ...paramsAPI,
        "query.filter.keys": `${keysFilter}`,
        "query.filter.vals": `${keyVals}`,
      }
    }
    let res = await ApiRaoVat.GetList_TinRaoVat_DaLuu(paramsAPI)
    Utils.nlog('res list tin rao vat da luu', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(setDataTinRaoVatDaLuu(isNext ? [...LstTinRaoVatDaLuu, ...data] : data))
      dispatch(setPageTinRaoVatDaLuu(res?.page))
      dispatch(setRefreshingTinRaoVatDaLuu(false))
    } else {
      dispatch(setDataTinRaoVatDaLuu([]))
      dispatch(setPageTinRaoVatDaLuu({ Page: 1, AllPage: 1 }))
      dispatch(setRefreshingTinRaoVatDaLuu(false))
    }
  }
}

export const setTrangThaiHienThiItem = (item, key) => ({
  type: ActionTypes.TypeWidget.SET_TRANGTHAIHIENTHI_ITEM,
  data: { item, keyAction: key }
});

export const setTrangThaiTinItem = (item) => ({
  type: ActionTypes.TypeWidget.SET_TRANGTHAITIN_ITEM,
  data: item
});

export const saveKeyTimKiem = (item) => ({
  type: ActionTypes.TypeWidget.SAVE_KEY_TIMKIEM,
  data: item
});

export const deleteKeyTimKiem = (item) => ({
  type: ActionTypes.TypeWidget.DELETE_KEY_TIMKIEM,
  data: item
});


//Tin thue nha ca nhan
export const setDataTaoSuaTinThueNha = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TAO_SUA_TINTHUENHA,
  data: val
});

export const setDataTinThueNhaCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TINTHUENHACANHAN,
  data: val
});

export const setRefreshingTinThueNhaCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_REFRESHING_TINTHUENHACANHAN,
  data: val
});

export const setPageTinThueNhaCaNhan = val => ({
  type: ActionTypes.TypeWidget.SET_PAGE_TINTHUENHACANHAN,
  data: val
});

export const loadListTinThueNhaCaNhan = (isNext = false, keysFilter = '', keyVals = '') => {
  return async (dispatch, getState) => {
    const { LstTinThueNhaCaNhan = [], RefreshingTinThueNhaCaNhan, PageTinThueNhaCaNhan = { Page: 1, AllPage: 1 } } = getState().Widgets
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "TieuDe|NgayTao",
      "query.sortOrder": "asc|desc",
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageTinThueNhaCaNhan?.Page + 1 : 1
    }
    if (keysFilter && keyVals) {
      paramsAPI = {
        ...paramsAPI,
        "query.filter.keys": `${keysFilter}`,
        "query.filter.vals": `${keyVals}`,
      }
    }
    let res = await ApiThueNha.List_TinThueNha_TheoNguoiDang(paramsAPI)
    Utils.nlog('res list tin thue nha ca nhan', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(setDataTinThueNhaCaNhan(isNext ? [...LstTinThueNhaCaNhan, ...data] : data))
      dispatch(setPageTinThueNhaCaNhan(res?.page))
      dispatch(setRefreshingTinThueNhaCaNhan(false))
    } else {
      dispatch(setDataTinThueNhaCaNhan([]))
      dispatch(setPageTinThueNhaCaNhan({ Page: 1, AllPage: 1 }))
      dispatch(setRefreshingTinThueNhaCaNhan(false))
    }
  }
}

export const deleteTinThueNhaCaNhan = val => ({
  type: ActionTypes.TypeWidget.DELETE_TINTHUENHACANHAN,
  data: val
});

export const setTrangThaiTinThueNha = (item, show) => ({
  type: ActionTypes.TypeWidget.SET_TRANGTHAITINTHUENHA,
  data: { item, show: show }
});


//Tin thuê nhà
export const setDataTinThueNha = val => ({
  type: ActionTypes.TypeWidget.SET_DATA_TINTHUENHA,
  data: val
});

export const setRefreshingTinThueNha = val => ({
  type: ActionTypes.TypeWidget.SET_REFRESHING_TINTHUENHA,
  data: val
});

export const setPageTinThueNha = val => ({
  type: ActionTypes.TypeWidget.SET_PAGE_TINTHUENHA,
  data: val
});

export const setLikeUnlikeTinThueNha = val => ({
  type: ActionTypes.TypeWidget.SET_LIKE_UNLIKE_TINTHUENHA,
  data: val
});


export const loadListTinThueNha = (isNext = false, keysFilter = '', keyVals = '') => {
  return async (dispatch, getState) => {
    const { LstTinThueNha = [], PageTinThueNha = { Page: 1, AllPage: 1 } } = getState().Widgets
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "TieuDe|NgayTao",
      "query.sortOrder": "asc|desc",
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageTinThueNha?.Page + 1 : 1
    }
    if (keysFilter && keyVals) {
      paramsAPI = {
        ...paramsAPI,
        "query.filter.keys": `${keysFilter}`,
        "query.filter.vals": `${keyVals}`,
      }
    }
    let res = await ApiThueNha.List_TinThueNha_App(paramsAPI)
    Utils.nlog('res list tin thue nha', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(setDataTinThueNha(isNext ? [...LstTinThueNha, ...data] : data))
      dispatch(setPageTinThueNha(res?.page))
      dispatch(setRefreshingTinThueNha(false))
    } else {
      dispatch(setDataTinThueNha([]))
      dispatch(setPageTinThueNha({ Page: 1, AllPage: 1 }))
      dispatch(setRefreshingTinThueNha(false))
    }
  }
}

export const saveKeyTimKiemThueNha = (item) => ({
  type: ActionTypes.TypeWidget.SAVE_KEY_TIMKIEM_THUENHA,
  data: item
});

export const deleteKeyTimKiemThueNha = (item) => ({
  type: ActionTypes.TypeWidget.DELETE_KEY_TIMKIEM_THUENHA,
  data: item
});
