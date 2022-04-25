import * as ActionTypes from '../actions/type';
import { produce } from 'immer';

//Sàn Việc Làm - SVL
export const initialStateDataSVL = {
  DS_ViecTimNguoi: [],
  DS_LSTimKiem: [],
  Data_CV: [
    {
      data: null,
    },
    {
      data: null,
    },
    {
      data: null,
    },
    {
      data: null,
    },
    {
      data: null,
    }
  ],
  Data_TinTuyenDung: [
    {
      data: null,
    },
    {
      data: null,
    },
    {
      data: null,
    },
    {
      data: null,
    },
  ],
  ItemTinTuyenDung: null,
  ItemCV: null, // hồ sơ item cv 
  DataFilter: {
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
  },
  // Danh sách tin tuyển dung kèm bộ lọc
  LstRecruitment: [],
  RefreshingRecruitment: true,
  PageRecruitment: { Page: 1, AllPage: 1 },
  //Tin tuyển dụng đã lưu
  LstRecruitmentSaved: [],
  RefreshingRecruitmentSaved: true,
  PageRecruitmentSaved: { Page: 1, AllPage: 1 },
  // Danh sách tin CV giành cho Doanh nghiệp
  LstProfileEnterprise: [],
  RefreshingProfileEnterprise: true,
  PageProfileEnterprise: { Page: 1, AllPage: 1 },
  //Lịch sử ứng tuyển người lao động
  LstDataApplied: [],
  RefreshingDataApplied: true,
  // Danh sách CV dành cho user
  LstCVOfUser: [],
  RefreshingDataListCVOfUser: true,
  //Danh sách hồ sơ CV đã lưu - doanh nghiệp
  LstCvSaved: [],
  RefreshingCvSaved: true,
  PageCvSaved: { Page: 1, AllPage: 1 },
  // Danh sách đăng tin dành cho doanh nghiệp
  LstRecruitmentPost: [],
  RefreshingDataListRecruitmentPost: true,
  SelectRecruitmentPostItem: {},
  //Lịch sử tuyển dụng doanh nghiệp
  LstDataProfileApplied: [],
  RefreshingDataProfileApplied: true,
  // Danh sách bài đăng - doanh nghiệp (đăng tin)
  LstEmployment: [],
  RefreshingEmployment: true,
  PageEmployment: { Page: 1, AllPage: 1 },
  //Danh sách thông báo - người lao dộng
  LstMailBox: [],
  RefreshingMailBox: true,
  PageMailBox: { Page: 1, AllPage: 1 },
  CountMailBox: 0,
  //Danh sách thông báo - doanh nghiệp
  LstMailBoxEnterprise: [],
  RefreshingMailBoxEnterprise: true,
  PageMailBoxEnterprise: { Page: 1, AllPage: 1 },
  CountMailBoxEnterprise: 0,
  //Danh sách CV user public
  LstCVOfUserPublic: []
};

function DataSVLReducer(state = initialStateDataSVL, action) {
  return produce(state, draft => {
    //-------

    switch (action.type) {
      //***Example về lưu thêm biến vào 1 data có sẵn */
      // case ActionTypes.SAVE_INFO: { 
      //   draft.infoUser = action.data;
      //   draft.userDH = { ...state.userDH, ...action.data };
      //   break;
      // }
      case ActionTypes.TypeDataSVL.SET_DS_TUYENDUNG: {
        draft.DS_ViecTimNguoi = action.data;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_DS_LSTIMKIEM: {
        draft.DS_LSTimKiem = action.data;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_CV_Default: {
        draft.Data_CV = action.data;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_CV: {
        let daTempt = [...state.Data_CV];
        daTempt[action.index] = action.data;
        draft.Data_CV = daTempt;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_CV_Item: {
        draft.ItemCV = action.data;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_DATA_FILTER: {
        draft.DataFilter = action.data;
        break;
      }
      //Danh sách tin tuyển dụng========================================================================
      case ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENT: {
        draft.LstRecruitment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENT: {
        draft.RefreshingRecruitment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_RECRUITMENT: {
        draft.PageRecruitment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.LIKE_RECRUITMENT: {
        draft.LstRecruitment = state.LstRecruitment.map(item => {
          if (item?.Id == action.data?.Id) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.UNLIKE_RECRUITMENT: {
        draft.LstRecruitment = state.LstRecruitment.map(item => {
          if (item?.Id == action.data?.Id) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      //================================================================================================

      //Danh sách tin tuyển dụng đã lưu=================================================================
      case ActionTypes.TypeDataSVL.SET_DATA_TINTuyenDung: {
        let daTempt = [];
        if (action.index >= 0) {
          daTempt = [...state.Data_TinTuyenDung];
          daTempt[action.index] = action.data;
        }
        else {
          daTempt = action.data;
        }
        draft.Data_TinTuyenDung = daTempt;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENTSAVED: {
        draft.LstRecruitmentSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENTSAVED: {
        draft.RefreshingRecruitmentSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_RECRUITMENTSAVED: {
        draft.PageRecruitmentSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.UNLIKE_RECRUITMENTSAVED: {
        draft.LstRecruitmentSaved = state.LstRecruitmentSaved.filter(item => item?.Id != action.data?.Id)
        break;
      }
      //================================================================================================
      //Danh sách CV giành cho Doanh nghiệp============================================================
      case ActionTypes.TypeDataSVL.SET_DATA_PROFILE_ENTERPRISE: {
        draft.LstProfileEnterprise = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_PROFILE_ENTERPRISE: {
        draft.RefreshingProfileEnterprise = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_PROFILE_ENTERPRISE: {
        draft.PageProfileEnterprise = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.LIKE_PROFILE_ENTERPRISE: {
        draft.LstProfileEnterprise = state.LstProfileEnterprise.map(item => {
          if (item?.IdCV == action.data?.IdCV) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.UNLIKE_PROFILE_ENTERPRISE: {
        draft.LstProfileEnterprise = state.LstProfileEnterprise.map(item => {
          if (item?.IdCV == action.data?.IdCV) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      //================================================================================================
      //Lịch sử ứng tuyển người lao động ===============================================================
      case ActionTypes.TypeDataSVL.SET_DATA_APPLIED: {
        draft.LstDataApplied = action.data
        break;
      }

      case ActionTypes.TypeDataSVL.SET_REFRESHING_APPLIED: {
        draft.RefreshingDataApplied = action.data
        break;
      }

      case ActionTypes.TypeDataSVL.LIKE_UNLIKE_APPLIED: {
        draft.LstDataApplied = state.LstDataApplied.map(item => {
          if (item?.Id == action.data?.Id) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      //================================================================================================
      //Danh sách hồ sơ của user ===============================================================
      case ActionTypes.TypeDataSVL.SET_DATA_CV_USER: {
        draft.LstCVOfUser = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_CV_USER: {
        draft.RefreshingDataListCVOfUser = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.DELETE_CV_USER: {
        draft.LstCVOfUser = state.LstCVOfUser.filter(e => e?.IdCV != action.data?.IdCV)
        break;
      }
      case ActionTypes.TypeDataSVL.CHECKED_DELETE_CV_USER: {
        //Map lại dữ liệu đổi trạng thái item cần xoá (đang chọn)
        draft.LstCVOfUser = state.LstCVOfUser.map(e => {
          if (e?.IdCV == action.data?.IdCV) {
            return { ...e, isChoose: true }
          } else {
            return { ...e, isChoose: false }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.CHANGE_ISPUBLIC_CV_USER: {
        //Map lại dữ liệu đổi trạng thái item cần xoá (đang chọn)
        draft.LstCVOfUser = state.LstCVOfUser.map(e => {
          if (e?.IdCV == action.data?.IdCV) {
            return { ...e, IsPublic: action.data.IsPublic }
          } else {
            return { ...e }
          }
        })
        break;
      }
      //================================================================================================
      //Danh sách hồ sơ CV đã lưu ======================================================================
      case ActionTypes.TypeDataSVL.SET_DATA_CV_SAVED: {
        draft.LstCvSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_CV_SAVED: {
        draft.RefreshingCvSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_CV_SAVED: {
        draft.PageCvSaved = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.UNLIKE_CV_SAVED: {
        draft.LstCvSaved = state.LstCvSaved.filter(item => item?.IdCV != action.data?.IdCV)
        break;
      }
      //================================================================================================
      //Danh sách bài đăng của doanh nghiệp ===============================================================
      case ActionTypes.TypeDataSVL.SET_TinTuyenDung: {
        draft.ItemTinTuyenDung = action.data;
        break;
      }
      case ActionTypes.TypeDataSVL.SET_DATA_RECRUITMENT_POST: {
        draft.LstRecruitmentPost = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_RECRUITMENT_POST: {
        draft.RefreshingDataListRecruitmentPost = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.DELETE_RECRUITMENT_POST: {
        draft.LstRecruitmentPost = state.LstRecruitmentPost.filter(e => e?.Id != action.data?.Id)
        break;
      }
      case ActionTypes.TypeDataSVL.CHECKED_RECRUITMENT_POST: {
        //Map lại dữ liệu đổi trạng thái item cần xoá (đang chọn)
        draft.LstRecruitmentPost = state.LstRecruitmentPost.map(e => {
          if (e?.Id == action.data?.Id) {
            return { ...e, isChoose: true }
          } else {
            return { ...e, isChoose: false }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.SELECT_RECRUITMENT_POST: {
        let findSelected = state.LstRecruitmentPost.find(e => e.isChoose === true)
        draft.SelectRecruitmentPostItem = findSelected ? findSelected : {}
        break;
      }
      //================================================================================================
      //Lịch sử ứng tuyển người lao động ===============================================================
      case ActionTypes.TypeDataSVL.SET_DATA_PROFILEAPPLIED: {
        draft.LstDataProfileApplied = action.data
        break;
      }

      case ActionTypes.TypeDataSVL.SET_REFRESHING_PROFILEAPPLIED: {
        draft.RefreshingDataProfileApplied = action.data
        break;
      }

      case ActionTypes.TypeDataSVL.LIKE_UNLIKE_PROFILEAPPLIED: {
        draft.LstDataProfileApplied = state.LstDataProfileApplied.map(item => {
          if (item?.IdCV == action.data?.IdCV) {
            return { ...item, IsLike: action.data?.IsLike }
          } else {
            return { ...item }
          }
        })
        break;
      }
      //================================================================================================
      //Danh sách bài đăng của doanh nghiệp ===============================================================
      case ActionTypes.TypeDataSVL.SET_DATA_EMPLOYMENT: {
        draft.LstEmployment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_EMPLOYMENT: {
        draft.RefreshingEmployment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.DELETE_EMPLOYMENT: {
        draft.LstEmployment = state.LstEmployment.filter(e => e?.Id != action.data?.Id)
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_EMPLOYMENT: {
        draft.PageEmployment = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.CHECKED_DELETE_EMPLOYMENT: {
        //Map lại dữ liệu đổi trạng thái item cần xoá (đang chọn)
        draft.LstEmployment = state.LstEmployment.map(e => {
          if (e?.Id == action.data?.Id) {
            return { ...e, isChoose: true }
          } else {
            return { ...e, isChoose: false }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.CHANGE_HIDESHOW_EMPLOYMENT: {
        //Map lại dữ liệu đổi trạng thái item cần xoá (đang chọn)
        draft.LstEmployment = state.LstEmployment.map(e => {
          if (e?.Id == action.data?.Id) {
            return { ...e, IsHienThi: action.data.IsHienThi }
          } else {
            return { ...e }
          }
        })
        break;
      }
      //================================================================================================
      //Danh sách thông báo - người lao động ===========================================================
      case ActionTypes.TypeDataSVL.SET_DATA_MAILBOX: {
        draft.LstMailBox = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_MAILBOX: {
        draft.RefreshingMailBox = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_MAILBOX: {
        draft.PageMailBox = action.data
      }
      case ActionTypes.TypeDataSVL.READ_MAILBOX: {
        draft.LstMailBox = state.LstMailBox.map(item => {
          if (action.data?.IdRow == item?.IdRow) {
            return { ...item, IsSeen: true }
          } else {
            return { ...item }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.READ_ALL_MAILBOX: {
        draft.LstMailBox = state.LstMailBox.map(item => {
          return { ...item, IsSeen: true }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.SET_COUNT_MAILBOX: {
        draft.CountMailBox = action.data
        break;
      }
      //================================================================================================
      //Danh sách thông báo - doanh nghiệp ===========================================================
      case ActionTypes.TypeDataSVL.SET_DATA_MAILBOX_ENTERPRISE: {
        draft.LstMailBoxEnterprise = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_REFRESHING_MAILBOX_ENTERPRISE: {
        draft.RefreshingMailBoxEnterprise = action.data
        break;
      }
      case ActionTypes.TypeDataSVL.SET_PAGE_MAILBOX_ENTERPRISE: {
        draft.PageMailBoxEnterprise = action.data
      }
      case ActionTypes.TypeDataSVL.READ_MAILBOX_ENTERPRISE: {
        draft.LstMailBoxEnterprise = state.LstMailBoxEnterprise.map(item => {
          if (action.data?.IdRow == item?.IdRow) {
            return { ...item, IsSeen: true }
          } else {
            return { ...item }
          }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.READ_ALL_MAILBOX_ENTERPRISE: {
        draft.LstMailBoxEnterprise = state.LstMailBoxEnterprise.map(item => {
          return { ...item, IsSeen: true }
        })
        break;
      }
      case ActionTypes.TypeDataSVL.SET_COUNT_MAILBOX_ENTERPRISE: {
        draft.CountMailBoxEnterprise = action.data
        break;
      }
      //================================================================================================
      //Danh sách CV user public
      case ActionTypes.TypeDataSVL.SET_DATA_CV_USER_PUBLIC: {
        draft.LstCVOfUserPublic = action.data
        break;
      }
    }
  })
}

export default DataSVLReducer;


