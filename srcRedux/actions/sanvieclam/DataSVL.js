import * as ActionTypes from '../type';
import * as ApiSVL from '../../../src/srcSanViecLam/apis/apiSVL'
import Utils, { icon_typeToast } from '../../../app/Utils';
import { TYPE_LST_MAILBOX } from '../../../src/srcSanViecLam/common';

//Sàn Việc Làm - SVL
export const SetDSTuyenDung = val => ({
  type: ActionTypes.TypeDataSVL.SET_DS_TUYENDUNG,
  data: val
});

export const SetDSLSTimKiem = val => ({
  type: ActionTypes.TypeDataSVL.SET_DS_LSTIMKIEM,
  data: val
});

export const SetCV = (val, index) => ({
  type: ActionTypes.TypeDataSVL.SET_CV,
  data: val,
  index: index,
});

export const SetCV_Default = (val) => ({
  type: ActionTypes.TypeDataSVL.SET_CV_Default,
  data: val,
});

export const SetCV_Item = (val) => ({
  type: ActionTypes.TypeDataSVL.SET_CV_Item,
  data: val,
});

export const SetDataFilter = (objDatafilter) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_FILTER,
  data: objDatafilter
})

export const LoadInitDataFilter = () => {
  return async (dispatch, getState) => {
    const DataFilter = {
      LstNganhNghe: [{ Id: -1, LoaiNganhNghe: '-- Tất cả --' }], // 
      LstHinhThucLV: [
        {
          IdHinhThuc: -1,
          TenHinhThuc: '-- Tất cả --'
        },
        {
          IdHinhThuc: 0,
          TenHinhThuc: 'Toàn thời gian'
        },
        {
          IdHinhThuc: 1,
          TenHinhThuc: 'Bán thời gian'
        }
      ],
      LstMucLuong: [{ Id: -1, MucLuong: '-- Tất cả --' }], // 
      LstCapBac: [{ Id: -1, ChucVu: '-- Tất cả --' }], //
      LstDiaDiem: [{ IDTinhThanh: -1, TenTinhThanh: '-- Tất cả --' }], //
      LstKinhNghiem: [{ Id: -1, KinhNghiem: '-- Tất cả --' }], //
      LstGioiTinh: [
        {
          IdGioiTinh: -1,
          TenGioiTinh: '-- Tất cả --'
        },
        {
          IdGioiTinh: 0,
          TenGioiTinh: 'Nam'
        },
        {
          IdGioiTinh: 1,
          TenGioiTinh: 'Nữ'
        }
      ],
      LstTrinhDo: [{ Id: -1, TrinhDoVanHoa: '-- Tất cả --' }], //
      LstDoTuoi: [{ Id: -1, DoTuoi: '-- Tất cả --' }],
      LstTenLoaiHoSo: [
        {
          IdLoaiHoSo: -1,
          TenLoaiHoSo: '-- Tất cả --'
        },
        {
          IdLoaiHoSo: 0,
          TenLoaiHoSo: 'Sinh viên, học sinh'
        },
        {
          IdLoaiHoSo: 1,
          TenLoaiHoSo: 'Người lao động'
        }
      ],
    }
    let tempObject = { ...DataFilter }
    Utils.setToggleLoading(true)
    let resNganhNghe = await ApiSVL.GetAllListDMLoaiNganhNghe()
    // console.log('[LOG] nganh nghe', resNganhNghe)
    if (resNganhNghe?.status == 1 && resNganhNghe?.data) tempObject = { ...tempObject, LstNganhNghe: [...tempObject.LstNganhNghe, ...resNganhNghe?.data] }

    let resMucLuong = await ApiSVL.GetAllList_DM_MucLuong()
    // console.log('[LOG] muc luong', resMucLuong)
    if (resMucLuong?.status == 1 && resMucLuong?.data) tempObject = { ...tempObject, LstMucLuong: [...tempObject.LstMucLuong, ...resMucLuong?.data] }

    let resCapBac = await ApiSVL.GetAllList_DM_ChucVu()
    // console.log('[LOG] capbac/chucvu', resCapBac)
    if (resCapBac?.status == 1 && resCapBac?.data) tempObject = { ...tempObject, LstCapBac: [...tempObject.LstCapBac, ...resCapBac?.data] }

    let resDiaDiem = await ApiSVL.GetAllListDMTinhThanh()
    // console.log('[LOG] dia diem', resDiaDiem)
    if (resDiaDiem?.status == 1 && resDiaDiem?.data) tempObject = { ...tempObject, LstDiaDiem: [...tempObject.LstDiaDiem, ...resDiaDiem?.data] }

    let resKinhNghiem = await ApiSVL.GetAllList_DM_KinhNghiem()
    // console.log('[LOG] kinh nghiem', resKinhNghiem)
    if (resKinhNghiem?.status == 1 && resKinhNghiem?.data) tempObject = { ...tempObject, LstKinhNghiem: [...tempObject.LstKinhNghiem, ...resKinhNghiem?.data] }

    let resTrinhDo = await ApiSVL.GetAllListDMTrinhDoVanHoa()
    // console.log('[LOG] trinh do', resTrinhDo)
    if (resTrinhDo?.status == 1 && resTrinhDo?.data) tempObject = { ...tempObject, LstTrinhDo: [...tempObject.LstTrinhDo, ...resTrinhDo?.data] }

    let resDoTuoi = await ApiSVL.GetListDMDoTuoi()
    // console.log('[LOG] do tuoi', resTrinhDo)
    if (resDoTuoi?.status == 1 && resDoTuoi?.data) tempObject = { ...tempObject, LstDoTuoi: [...tempObject.LstDoTuoi, ...resDoTuoi?.data] }

    Utils.setToggleLoading(false)
    // console.log('[LOG] temp object filter', tempObject)
    dispatch(SetDataFilter(tempObject))
  }
}

//Danh sách tin tuyển dụng + bộ lọc================================
export const SetDataRecruitment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENT,
  data: data
})

export const SetRefreshingRecruitment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENT,
  data: data
})

export const SetPageRecruitment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_RECRUITMENT,
  data: data
})

export const LoadListRecruitment = (ObjFillter, search, isNext = false) => {
  return async (dispatch, getState) => {
    const { PageRecruitment = { Page: 1, AllPage: 1 }, LstRecruitment = [] } = getState().dataSVL
    let objKeyValueFilter = {
      'IdNganhNghe': ObjFillter?.selectNganhNghe?.Id == -1 ? '' : ObjFillter?.selectNganhNghe?.Id,
      'TypeTinTuyenDung': ObjFillter?.selectHinhThucLV?.IdHinhThuc == -1 ? '' : ObjFillter?.selectHinhThucLV?.IdHinhThuc,//lọc theo loại tin tuyển dụng, partime hay fulltime
      'IdMucLuong': ObjFillter?.selectMucLuong?.Id == -1 ? '' : ObjFillter?.selectMucLuong?.Id,
      'IdChucVu': ObjFillter?.selectCapBac?.Id == -1 ? '' : ObjFillter?.selectCapBac?.Id,
      'IdTinhThanh': ObjFillter?.selectDiaDiem?.IDTinhThanh == -1 ? '' : ObjFillter?.selectDiaDiem?.IDTinhThanh,
      'IdKinhNghiem': ObjFillter?.selectKinhNghiem?.Id == -1 ? '' : ObjFillter?.selectKinhNghiem?.Id,
      'GioiTinh': ObjFillter?.selectGioiTinh?.IdGioiTinh == -1 ? '' : ObjFillter?.selectGioiTinh?.IdGioiTinh,
      'IdTrinhDoVanHoa': ObjFillter?.selectTrinhDo?.Id == -1 ? '' : ObjFillter?.selectTrinhDo?.Id,
      'keyword': search ? search : '',
    }
    let queryKey = '', queryValue = '', index = 1
    for (const property in objKeyValueFilter) {
      queryKey = queryKey + `${property}${index == Object.keys(objKeyValueFilter).length ? '' : '|'}`
      queryValue = queryValue + `${objKeyValueFilter[property]}${index == Object.keys(objKeyValueFilter).length ? '' : '|'}`
      index++
    }
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": ''
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.filter.keys": queryKey,
      "query.filter.vals": queryValue,
      "query.page": isNext ? PageRecruitment?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListViecLam(paramsAPI)
    Utils.nlog('[LOG_RECRUIMENT] res viec lam', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataRecruitment(isNext ? [...LstRecruitment, ...res.data] : res.data))
      dispatch(SetPageRecruitment(res.page))
      dispatch(SetRefreshingRecruitment(false))
    } else {
      dispatch(SetDataRecruitment([]))
      dispatch(SetPageRecruitment({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingRecruitment(false))
    }
  }
}

export const LikeRecruitment = (itemRecruitment) => ({
  type: ActionTypes.TypeDataSVL.LIKE_RECRUITMENT,
  data: itemRecruitment
})

export const UnLikeRecruitment = (itemRecruitment) => ({
  type: ActionTypes.TypeDataSVL.UNLIKE_RECRUITMENT,
  data: itemRecruitment
})
//================================================================

//Danh sách tin tuyển dụng đã lưu =================================================================
export const SetDataRecruitmentsaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENTSAVED,
  data: data
})

export const SetRefreshingRecruitmentSaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENTSAVED,
  data: data
})

export const SetPageRecruitmentSaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_RECRUITMENTSAVED,
  data: data
})

export const LoadListRecruitmentSaved = (isNext = false) => {
  return async (dispatch, getState) => {
    const { PageRecruitmentSaved = { Page: 1, AllPage: 1 }, LstRecruitmentSaved = [] } = getState().dataSVL
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": ''
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.filter.keys": 'UserLike',
      "query.filter.vals": '1',
      "query.page": isNext ? PageRecruitmentSaved?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListViecLam(paramsAPI)
    Utils.nlog('[LOG res viec lam da luu', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataRecruitmentsaved(isNext ? [...LstRecruitmentSaved, ...res.data] : res.data))
      dispatch(SetPageRecruitmentSaved(res.page))
      dispatch(SetRefreshingRecruitmentSaved(false))
    } else {
      dispatch(SetDataRecruitmentsaved([]))
      dispatch(SetPageRecruitmentSaved({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingRecruitmentSaved(false))
    }
  }
}

export const UnLikeRecruitmentSaved = (itemRecruitment) => ({
  type: ActionTypes.TypeDataSVL.UNLIKE_RECRUITMENTSAVED,
  data: itemRecruitment
})

//=========================================================================================
//Danh sách tin tuyển dụng + bộ lọc================================

export const Set_TinTuyenDung = (val) => ({
  type: ActionTypes.TypeDataSVL.SET_TinTuyenDung,
  data: val,
});

export const SetDataTinTuyenDung = (data, index) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_TINTuyenDung,
  data: data,
  index: index,
})

export const SetDataProfileEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_PROFILE_ENTERPRISE,
  data: data
})

export const SetRefreshingProfileEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_PROFILE_ENTERPRISE,
  data: data
})

export const SetPageProfileEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_PROFILE_ENTERPRISE,
  data: data
})

export const LoadListProfileEnterprise = (ObjFillter, search, isNext = false) => {
  return async (dispatch, getState) => {
    const { PageProfileEnterprise = { Page: 1, AllPage: 1 }, LstProfileEnterprise = [] } = getState().dataSVL
    let objKeyValueFilter = {
      'IdNganhNghe': ObjFillter?.selectNganhNghe?.Id == -1 ? '' : ObjFillter?.selectNganhNghe?.Id,
      'TypeTinTuyenDung': ObjFillter?.selectHinhThucLV?.IdHinhThuc == -1 ? '' : ObjFillter?.selectHinhThucLV?.IdHinhThuc,//lọc theo loại tin tuyển dụng, partime hay fulltime
      'IdMucLuong': ObjFillter?.selectMucLuong?.Id == -1 ? '' : ObjFillter?.selectMucLuong?.Id,
      'IdTinhThanh': ObjFillter?.selectKhuVucLamViec?.IdTinh == -1 && ObjFillter?.selectKhuVucLamViec?.IdTinh ? '' : ObjFillter?.selectKhuVucLamViec?.IdTinh,
      'GioiTinh': ObjFillter?.selectGioiTinh?.IdGioiTinh == -1 ? '' : ObjFillter?.selectGioiTinh?.IdGioiTinh,
      'keyword': search ? search : '',
      'IdDoTuoi': ObjFillter?.selectDoTuoi?.Id == -1 ? '' : ObjFillter?.selectDoTuoi?.Id,
      'TypePerson': ObjFillter?.selectLoaiHoSo?.IdLoaiHoSo == -1 ? '' : ObjFillter?.selectLoaiHoSo?.IdLoaiHoSo,
      'IdQuanHuyen': ObjFillter?.selectKhuVucLamViec?.IDQuanHuyen == -1 && ObjFillter?.selectKhuVucLamViec?.IDQuanHuyen ? '' : ObjFillter?.selectKhuVucLamViec?.IDQuanHuyen,
    }
    let queryKey = '', queryValue = '', index = 1
    for (const property in objKeyValueFilter) {
      queryKey = queryKey + `${property}${index == Object.keys(objKeyValueFilter).length ? '' : '|'}`
      queryValue = queryValue + `${objKeyValueFilter[property]}${index == Object.keys(objKeyValueFilter).length ? '' : '|'}`
      index++
    }
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": ''
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.filter.keys": queryKey,
      "query.filter.vals": queryValue,
      "query.page": isNext ? PageProfileEnterprise?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListCV(paramsAPI)
    Utils.nlog('[LOG_RECRUIMENT] res list CV', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataProfileEnterprise(isNext ? [...LstProfileEnterprise, ...res.data] : res.data))
      dispatch(SetPageProfileEnterprise(res.page))
      dispatch(SetRefreshingProfileEnterprise(false))
    } else {
      dispatch(SetDataProfileEnterprise([]))
      dispatch(SetPageProfileEnterprise({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingProfileEnterprise(false))
    }
  }
}

export const LikeProfileEnterprise = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.LIKE_PROFILE_ENTERPRISE,
  data: itemProfile
})

export const UnLikeProfileEnterprise = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.UNLIKE_PROFILE_ENTERPRISE,
  data: itemProfile
})
//================================================================

//Lịch sử ứng tuyển người lao động ===============================

export const SetDataApplied = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_APPLIED,
  data: data
})

export const SetRefreshingApplied = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_APPLIED,
  data: data
})

export const LoadListApplied = () => {
  return async (dispatch, getState) => {
    let res = await ApiSVL.GetListTuyenDungCaNhan()
    Utils.nlog('[LOG_LIST_APLLIED] res list applied', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataApplied(res?.data))
      dispatch(SetRefreshingApplied(false))
    } else {
      dispatch(SetDataApplied([]))
      dispatch(SetRefreshingApplied(false))
    }
  }
}

export const LikeUnlikeApplied = (itemRecruitment) => ({
  type: ActionTypes.TypeDataSVL.LIKE_UNLIKE_APPLIED,
  data: itemRecruitment
})
//================================================================

//Danh sách Cv dành cho user ===============================

export const SetDataCvUser = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_CV_USER,
  data: data
})

export const SetRefreshingCvUser = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_CV_USER,
  data: data
})

export const LoadListCvUser = () => {
  return async (dispatch, getState) => {
    let res = await ApiSVL.GetListCVByUserId()
    Utils.nlog('[LOG_LIST_APLLIED] res list CvByUserID', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      let arrNewCV = data.map(e => {
        return { ...e, isChoose: false }
      })
      dispatch(SetDataCvUser(arrNewCV))
      dispatch(SetRefreshingCvUser(false))
    } else {
      dispatch(SetDataCvUser([]))
      dispatch(SetRefreshingCvUser(false))
    }
  }
}

export const DeleteCvUser = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.DELETE_CV_USER,
  data: itemProfile
})

export const CheckedDeleteCvUser = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.CHECKED_DELETE_CV_USER,
  data: itemProfile
})

export const ChangeIspublicCvUser = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.CHANGE_ISPUBLIC_CV_USER,
  data: itemProfile
})

//================================================================

//Danh sách hồ sơ CV đã lưu =================================================================
export const SetDataCvSaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_CV_SAVED,
  data: data
})

export const SetRefreshingCvSaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_CV_SAVED,
  data: data
})

export const SetPageCvSaved = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_CV_SAVED,
  data: data
})

export const LoadListCvSaved = (isNext = false) => {
  return async (dispatch, getState) => {
    const { PageCvSaved = { Page: 1, AllPage: 1 }, LstCvSaved = [] } = getState().dataSVL
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": ''
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.filter.keys": 'UserLike',
      "query.filter.vals": '1',
      "query.page": isNext ? PageCvSaved?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListCV(paramsAPI)
    Utils.nlog('[LOG res cv da luu', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataCvSaved(isNext ? [...LstCvSaved, ...res.data] : res.data))
      dispatch(SetPageCvSaved(res.page))
      dispatch(SetRefreshingCvSaved(false))
    } else {
      dispatch(SetDataCvSaved([]))
      dispatch(SetPageCvSaved({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingCvSaved(false))
    }
  }
}

export const UnLikeCvSaved = (itemRecruitment) => ({
  type: ActionTypes.TypeDataSVL.UNLIKE_CV_SAVED,
  data: itemRecruitment
})

//=========================================================================================

//Danh sách đăng tin cho Doanh nghiệp ===============================

export const SetDataRecruitmentPost = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENT_POST,
  data: data
})

export const SetRefreshingRecruitmentPost = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENT_POST,
  data: data
})

export const DeleteRecruitmentPost = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.DELETE_RECRUITMENT_POST,
  data: itemProfile
})

export const CheckedRecruitmentPost = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.CHECKED_RECRUITMENT_POST,
  data: itemProfile
})

export const SelectRecruitmentPost = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.SELECT_RECRUITMENT_POST,
  data: itemProfile
})

export const LoadListRecruitmentPost = (keys = '', vals = '') => {
  return async (dispatch, getState) => {
    const paramsFilter = {
      "query.more": true,
      "query.page": "",
      "query.record": "",
      "query.sortField": "",
      "query.sortOrder": "",
      "query.filter.keys": keys,
      "query.filter.vals": vals,
    }
    let res = await ApiSVL.GetListTinTuyenDung(paramsFilter)
    Utils.nlog('[LOG_LIST_APLLIED] res list GetListTinTuyenDung', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      let arrRecruitmentPost = data.map(e => {
        return { ...e, isChoose: false }
      })
      if (arrRecruitmentPost.length > 0) {
        arrRecruitmentPost[0] = { ...arrRecruitmentPost[0], isChoose: true }
      }
      dispatch(SetDataRecruitmentPost(arrRecruitmentPost))
      dispatch(SetRefreshingRecruitmentPost(false))
      dispatch(SelectRecruitmentPost())
    } else {
      dispatch(SetDataRecruitmentPost([]))
      dispatch(SetRefreshingRecruitmentPost(false))
      dispatch(SelectRecruitmentPost())
    }
  }
}

//================================================================
//Lịch sử tuyển dụng doanh nghiệp ===============================
export const SetDataProfileApplied = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_PROFILEAPPLIED,
  data: data
})

export const SetRefreshingProfileApplied = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_PROFILEAPPLIED,
  data: data
})

export const LoadListProfileApplied = (IdTinTuyenDung) => {
  return async (dispatch, getState) => {
    const paramsFilter = {
      "query.more": true,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": ''
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.filter.keys": 'IdTinTuyenDung',
      "query.filter.vals": IdTinTuyenDung
    }
    let res = await ApiSVL.GetListTuyenDungDoanhNghiep(paramsAPI)
    Utils.nlog('[LOG_LIST_PROFILEAPLLIED] res list tuyen dung doanh nghiep', res)
    if (res?.status == 1 && res?.data) {
      dispatch(SetDataProfileApplied(res?.data))
      dispatch(SetRefreshingProfileApplied(false))
    } else {
      dispatch(SetDataProfileApplied([]))
      dispatch(SetRefreshingProfileApplied(false))
    }
  }
}

export const LikeUnlikeProfileApplied = (itemProfle) => ({
  type: ActionTypes.TypeDataSVL.LIKE_UNLIKE_PROFILEAPPLIED,
  data: itemProfle
})
//================================================================
//Danh sách bài đăng - doanh nghiệp (đăng tin) ===============================
export const SetDataEmployment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_EMPLOYMENT,
  data: data
})

export const SetRefreshingEmployment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_EMPLOYMENT,
  data: data
})

export const SetPageEmployment = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_EMPLOYMENT,
  data: data
})

export const LoadListEmployment = (isNext = false) => {
  return async (dispatch, getState) => {
    const { PageEmployment = { Page: 1, AllPage: 1 }, LstEmployment = [] } = getState().dataSVL
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      "query.sortField": "CreatedDate",
      "query.sortOrder": "desc",
      "query.filter.keys": '',
      "query.filter.vals": '',
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageEmployment?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListTinTuyenDung(paramsAPI)
    Utils.nlog('[LOG_LIST_APLLIED] res list GetListTinTuyenDung', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      let arrEmployment = data.map(e => {
        return { ...e, isChoose: false }
      })
      dispatch(SetDataEmployment(isNext ? [...LstEmployment, ...arrEmployment] : arrEmployment))
      dispatch(SetPageEmployment(res.page))
      dispatch(SetRefreshingEmployment(false))
    } else {
      dispatch(SetDataEmployment([]))
      dispatch(SetPageEmployment({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingEmployment(false))

    }
  }
}

export const DeleteEmployment = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.DELETE_EMPLOYMENT,
  data: itemProfile
})

export const CheckedDeleteEmployment = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.CHECKED_DELETE_EMPLOYMENT,
  data: itemProfile
})

export const ChangeIsHideShowEmployment = (itemProfile) => ({
  type: ActionTypes.TypeDataSVL.CHANGE_HIDESHOW_EMPLOYMENT,
  data: itemProfile
})

//================================================================
// Danh sách thông người lao động=================================
export const SetDataMailBox = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_MAILBOX,
  data: data
})

export const SetRefreshingMailBox = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_MAILBOX,
  data: data
})

export const SetPageMailBox = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_MAILBOX,
  data: data
})

export const SetCountMailBox = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_COUNT_MAILBOX,
  data: data
})

export const ReadMailBox = (mail) => ({
  type: ActionTypes.TypeDataSVL.READ_MAILBOX,
  data: mail
})

export const ReadAllMailBox = () => ({
  type: ActionTypes.TypeDataSVL.READ_ALL_MAILBOX
})

export const LoadListMailBox = (isNext = false) => {
  return async (dispatch, getState) => {
    const { PageMailBox = { Page: 1, AllPage: 1 }, LstMailBox = [] } = getState().dataSVL
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      // "query.sortField": "CreatedDate",
      // "query.sortOrder": "desc",
      "query.filter.keys": 'Type',
      "query.filter.vals": TYPE_LST_MAILBOX.VIECTIMNGUOI, // Type: - 0: người lao động, 1: là doanh nghiệp
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageMailBox?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListNotifyByUserId(paramsAPI)
    Utils.nlog('[LOG_LIST_NOTI] res list GetListNotifyByUserId - nguoi lao dong', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(SetDataMailBox(isNext ? [...LstMailBox, ...data] : data))
      dispatch(SetPageMailBox(res?.page))
      dispatch(SetRefreshingMailBox(false))
      if (data?.length > 0) {
        dispatch(SetCountMailBox(data[0].SLTBChuaDoc || 0))
      }
    } else {
      dispatch(SetDataMailBox([]))
      dispatch(SetPageMailBox({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingMailBox(false))
      dispatch(SetCountMailBox(0))
    }
  }
}

export const SeenMailBox = (mail, readAll = false) => {
  return async (dispatch, getState) => {
    const { CountMailBox = 0 } = getState().dataSVL
    if (readAll) {
      let res = await ApiSVL.UpdateIsSeen(0)
      Utils.nlog('[LOG] Seen All Mailbox', res)
      dispatch(ReadAllMailBox())
      dispatch(SetCountMailBox(0))
    } else {
      let res = await ApiSVL.UpdateIsSeen(mail?.IdRow)
      Utils.nlog('[LOG] Seen Mailbox', mail + res)
      dispatch(ReadMailBox(mail))
      dispatch(SetCountMailBox(CountMailBox - 1))
    }
  }
}

//================================================================
//Danh sách thông báo doanh nghiệp=================================
export const SetDataMailBoxEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_MAILBOX_ENTERPRISE,
  data: data
})

export const SetRefreshingMailBoxEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_REFRESHING_MAILBOX_ENTERPRISE,
  data: data
})

export const SetPageMailBoxEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_PAGE_MAILBOX_ENTERPRISE,
  data: data
})

export const SetCountMailBoxEnterprise = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_COUNT_MAILBOX_ENTERPRISE,
  data: data
})

export const ReadMailBoxEnterprise = (mail) => ({
  type: ActionTypes.TypeDataSVL.READ_MAILBOX_ENTERPRISE,
  data: mail
})

export const ReadAllMailBoxEnterprise = () => ({
  type: ActionTypes.TypeDataSVL.READ_ALL_MAILBOX_ENTERPRISE
})

export const LoadListMailBoxEnterprise = (isNext = false) => {
  return async (dispatch, getState) => {
    const { PageMailBoxEnterprise = { Page: 1, AllPage: 1 }, LstMailBoxEnterprise = [] } = getState().dataSVL
    const paramsFilter = {
      "query.more": false,
      "query.page": 1,
      "query.record": 10,
      // "query.sortField": "CreatedDate",
      // "query.sortOrder": "desc",
      "query.filter.keys": 'Type',
      "query.filter.vals": TYPE_LST_MAILBOX.NGUOITIMVIEC, // Type: - 0: người lao động, 1: là doanh nghiệp
    }
    let paramsAPI = {
      ...paramsFilter,
      "query.page": isNext ? PageMailBoxEnterprise?.Page + 1 : 1
    }
    let res = await ApiSVL.GetListNotifyByUserId(paramsAPI)
    Utils.nlog('[LOG_LIST_NOTI_DOANHNGHIEP] res list GetListNotifyByUserId - doanh nghiep', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(SetDataMailBoxEnterprise(isNext ? [...LstMailBoxEnterprise, ...data] : data))
      dispatch(SetPageMailBoxEnterprise(res?.page))
      dispatch(SetRefreshingMailBoxEnterprise(false))
      if (data?.length > 0) {
        dispatch(SetCountMailBoxEnterprise(data[0].SLTBChuaDoc || 0))
      }
    } else {
      dispatch(SetDataMailBoxEnterprise([]))
      dispatch(SetPageMailBoxEnterprise({ Page: 1, AllPage: 1 }))
      dispatch(SetRefreshingMailBoxEnterprise(false))
      dispatch(SetCountMailBoxEnterprise(0))
    }
  }
}

export const SeenMailBoxEnterprise = (mail, readAll = false) => {
  return async (dispatch, getState) => {
    const { CountMailBoxEnterprise = 0 } = getState().dataSVL
    if (readAll) {
      let res = await ApiSVL.UpdateIsSeen(0)
      Utils.nlog('[LOG] Seen All Mailbox - Doanh nghiep', res)
      dispatch(ReadAllMailBoxEnterprise())
      dispatch(SetCountMailBoxEnterprise(0))
    } else {
      let res = await ApiSVL.UpdateIsSeen(mail?.IdRow)
      Utils.nlog('[LOG] Seen Mailbox - Doanh nghiep', mail + res)
      dispatch(ReadMailBoxEnterprise(mail))
      dispatch(SetCountMailBoxEnterprise(CountMailBoxEnterprise - 1))
    }
  }
}

//================================================================
//Danh sách Cv user public========================================
export const SetDataCvUserPublic = (data) => ({
  type: ActionTypes.TypeDataSVL.SET_DATA_CV_USER_PUBLIC,
  data: data
})

export const LoadListCvUserPublic = () => {
  return async (dispatch, getState) => {
    let res = await ApiSVL.GetListCVByUserId('IsPublic', 1)
    Utils.nlog('[LoadListCvUserPublic] res', res)
    if (res?.status == 1 && res?.data) {
      const { data = [] } = res
      dispatch(SetDataCvUserPublic(data))
    } else {
      dispatch(SetDataCvUserPublic([]))
    }
  }
}
//================================================================