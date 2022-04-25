import * as Auth from './auth/Auth';
import * as Common from './common/Common';
import * as Types from './type';
import * as Theme from './theme/Theme';
import * as Menu from './menu/Menu'
import * as ThongBao from './notification/Notification'
import * as DataSVL from './sanvieclam/DataSVL';
import * as Widgets from './widgets';
import ActionChat from '../../chat/redux/action';
import ActionNguoiDan from '../../src/srcRedux/actions';
import Utils from '../../app/Utils';

//action cũ
export const setLanguage = val => ({
  type: Types.SETLANGUAGE, data: val
});
export const GetList_LinhVuc = val => ({
  type: Types.GETLIST_LINHVUC, data: val
});
export const GetList_ChuyenMuc = val => ({
  type: Types.GETLIST_CHUYENMUC,
  data: val
});
export const GetList_NguonPhanAnh = val => ({
  type: Types.GETLIST_NGUONPHANANH,
  data: val
});
export const GetList_MucDoAll = val => ({
  type: Types.GETLIST_MUCDOALL, data: val
});
export const GetList_DonVi = val => ({
  type: Types.GETLIST_DONVIAPP, data: val
});
export const GetList_MucDoAll_NB = val => ({
  type: Types.GETLIST_MUCDOALL_NB,
  data: val
});
export const GetList_DonVi_NB = val => ({
  type: Types.GETLIST_DONVIAPP_NB,
  data: val
});
export const resetStore = () => {
  return {
    type: Types.RESET_STORE
  }
}
//new
export const ChangeIdMessageGroup = ActionChat.ChangeIdMessageGroup
export const ChangeIDMessageOfGroup = ActionChat.ChangeIDMessageOfGroup
export const SetList_GroupOfChat = ActionChat.SetList_GroupOfChat
export const ChangeCurentGroup = ActionChat.ChangeCurentGroup
export const AddMessageOfGroup = ActionChat.AddMessageOfGroup
export const SetListMessageOfGroup = ActionChat.SetListMessageOfGroup
export const ApiGetCheckData = ActionChat.ApiGetCheckData
export const ApiCheckData = ActionChat.ApiCheckData
export const RemoveMessageByIDOfGroup = ActionChat.RemoveMessageByIDOfGroup
export const RemoveMessageBySenKeyOfGroup = ActionChat.RemoveMessageBySenKeyOfGroup
export const DeleteAllMessageOfGroup = ActionChat.DeleteAllMessageOfGroup
export const SendFileOfGroup = ActionChat.SendFileOfGroup
//old



export const SetISCHAT = ActionChat.SetISCHAT
export const ApiGetInfoChat = ActionChat.ApiGetInfoChat
export const ApiGet_ListGroupChat = ActionChat.ApiGet_ListGroupChat
export const Set_ListIconChat = ActionChat.Set_ListIconChat
export const Get_Api_ListIcon = ActionChat.Get_Api_ListIcon
export const setListFile = ActionChat.setListFile
export const UpdateMessageFile = ActionChat.UpdateMessageFile
export const SendListFile = ActionChat.SendListFile
export const DeleteAllMessege = ActionChat.DeleteAllMessege
export const SetEmptyAllMessege = ActionChat.SetEmptyAllMessege
export const SetStatusConnect = ActionChat.SetStatusConnect
export const SetStatusConnectRun = ActionChat.SetStatusConnectRun
export const SetStatus_Notify = ActionChat.SetStatus_Notify
export const AsyncDataChat = ActionChat.AsyncDataChat
export const AcSave_InfoAuth = Auth.AcSave_Info;
export const SetItemFileLoad = ActionChat.SetItemFileLoad;
export const checkAppAdmin = Auth.checkAppAdmin

//ngươi dân
export const setListLVFilter = ActionNguoiDan.setListLVFilter
// auth
export const SetTokenApp = Auth.SetTokenApp;
export const SetUserApp = Auth.SetUserApp
export const SetConfigApp = Auth.SetConfigApp
export const LogoutApp = Auth.LogoutApp
export const CheckLienKet = Auth.CheckLienKet
export const CheckConnectChat = Auth.CheckConnectChat
export const GetDataUserDH = Auth.GetDataUserDH
export const DangKyOneSignal = Auth.DangKyOneSignal
export const SetRuleAppCanBo = Auth.SetRuleAppCanBo
export const SetMenuChild = Auth.SetMenuChild
export const SetListUserApp = Auth.SetListUserApp
export const SetTokenListApp = Auth.SetTokenListApp
export const loadMenuApp = Auth.loadMenuApp;
export const logoutAppCheckInterNet = Auth.logoutAppCheckInterNet;
// theme
export const Set_Color_Linear = Theme.Set_Color_Linear
export const Set_Background_Home = Theme.Set_Background_Home
export const Set_Blur_Background = Theme.Set_Blur_Background
export const Set_Background_Online = Theme.Set_Background_Online
export const Set_Background_Full = Theme.Set_Background_Full
export const Set_Image_Header_Menu = Theme.Set_Image_Header_Menu
export const Set_Type_Menu = Theme.Set_Type_Menu
export const Set_Transparent_Area_Menu = Theme.Set_Transparent_Area_Menu
export const SetShowModalNoti = Theme.SetShowModalNoti
export const SetLandsCape = Theme.SetLandsCape
export const SetIMGHome = Theme.SetIMGHome
// menu
export const Set_Menu_CanBo = Menu.Set_Menu_Canbo
export const Set_Menu_CongDong = Menu.Set_Menu_CongDong
export const Set_Object_Menu = Menu.Set_Object_Menu

//common
export const SetConfig_App = Common.SetConfig_App;
export const SetCameraAnNinh = Common.SetCameraAnNinh
export const SetKeyCamera = Common.SetKeyCamera

//Thong bao
export const GetThongBaoCongDong = ThongBao.GetThongBaoCongDong
export const LoadMoreThongBaoCongDong = ThongBao.LoadMoreThongBaoCongDong
export const DeleteThongBaoCongDong = ThongBao.DeleteThongBaoCongDong
export const SeenThongBaoCongDong = ThongBao.SeenThongBaoCongDong
export const GetThongBaoCanBo = ThongBao.GetThongBaoCanBo
export const GetDataChuyenMuc = ThongBao.GetDataChuyenMuc
export const LoadMoreChuyenMuc = ThongBao.LoadMoreChuyenMuc
export const UpdateNotification = ThongBao.UpdateNotification
export const GetThongBaoDichVuCong = ThongBao.GetThongBaoDichVuCong
export const LoadMoreThongBaoDichVuCong = ThongBao.LoadMoreThongBaoDichVuCong
export const GetAllThongBaoCongDong = ThongBao.GetAllThongBaoCongDong
export const GetCountNotification = ThongBao.GetCountNotification

//Sàn Việc Làm - SVL
export const SetDSTuyenDung = DataSVL.SetDSTuyenDung;
export const SetDSLSTimKiem = DataSVL.SetDSLSTimKiem
export const SetCV = DataSVL.SetCV
export const LoadInitDataFilter = DataSVL.LoadInitDataFilter
//Danh sách tin tuyển dụng đã lưu
export const LoadListRecruitmentSaved = DataSVL.LoadListRecruitmentSaved
export const SetDataRecruitmentsaved = DataSVL.SetDataRecruitmentsaved
export const SetRefreshingRecruitmentSaved = DataSVL.SetRefreshingRecruitmentSaved
export const SetPageRecruitmentSaved = DataSVL.SetPageRecruitmentSaved
export const UnLikeRecruitmentSaved = DataSVL.UnLikeRecruitmentSaved
//Danh sách tin tuyển dung + bộ lọc
export const LoadListRecruitment = DataSVL.LoadListRecruitment
export const SetDataRecruitment = DataSVL.SetDataRecruitment
export const SetRefreshingRecruitment = DataSVL.SetRefreshingRecruitment
export const SetPageRecruitment = DataSVL.SetPageRecruitment
export const LikeRecruitment = DataSVL.LikeRecruitment
export const UnLikeRecruitment = DataSVL.UnLikeRecruitment
//Danh sách tin CV giành cho Doanh nghiệp
export const LoadListProfileEnterprise = DataSVL.LoadListProfileEnterprise
export const SetDataProfileEnterprise = DataSVL.SetDataProfileEnterprise
export const SetRefreshingProfileEnterprise = DataSVL.SetRefreshingProfileEnterprise
export const SetPageProfileEnterprise = DataSVL.SetPageProfileEnterprise
export const LikeProfileEnterprise = DataSVL.LikeProfileEnterprise
export const UnLikeProfileEnterprise = DataSVL.UnLikeProfileEnterprise
//Danh sách lịch sử ứng tuyển cá nhân người lao động
export const SetDataApplied = DataSVL.SetDataApplied
export const LoadListApplied = DataSVL.LoadListApplied
export const SetRefreshingApplied = DataSVL.SetRefreshingApplied
export const LikeUnlikeApplied = DataSVL.LikeUnlikeApplied
//Danh sách CV - người lao động
export const SetDataCvUser = DataSVL.SetDataCvUser
export const SetRefreshingCvUser = DataSVL.SetRefreshingCvUser
export const LoadListCvUser = DataSVL.LoadListCvUser
export const DeleteCvUser = DataSVL.DeleteCvUser
export const CheckedDeleteCvUser = DataSVL.CheckedDeleteCvUser
export const ChangeIspublicCvUser = DataSVL.ChangeIspublicCvUser
//Danh sách CV đã lưu - doanh nghiệp
export const LoadListCvSaved = DataSVL.LoadListCvSaved
export const SetDataCvSaved = DataSVL.SetDataCvSaved
export const SetRefreshingCvSaved = DataSVL.SetRefreshingCvSaved
export const SetPageCvSaved = DataSVL.SetPageCvSaved
export const UnLikeCvSaved = DataSVL.UnLikeCvSaved
//Danh sách CV người lao động
export const SetDataRecruitmentPost = DataSVL.SetDataRecruitmentPost
export const SetRefreshingRecruitmentPost = DataSVL.SetRefreshingRecruitmentPost
export const LoadListRecruitmentPost = DataSVL.LoadListRecruitmentPost
export const DeleteRecruitmentPost = DataSVL.DeleteRecruitmentPost
export const CheckedRecruitmentPost = DataSVL.CheckedRecruitmentPost
export const SelectRecruitmentPost = DataSVL.SelectRecruitmentPost
//Lịch sử tuyển dụng doanh nghiệp
export const SetDataProfileApplied = DataSVL.SetDataProfileApplied
export const LoadListProfileApplied = DataSVL.LoadListProfileApplied
export const SetRefreshingProfileApplied = DataSVL.SetRefreshingProfileApplied
export const LikeUnlikeProfileApplied = DataSVL.LikeUnlikeProfileApplied
// Danh sách bài đăng - doanh nghiệp (đăng tin)
export const SetDataEmployment = DataSVL.SetDataEmployment
export const SetRefreshingEmployment = DataSVL.SetRefreshingEmployment
export const LoadListEmployment = DataSVL.LoadListEmployment
export const SetPageEmployment = DataSVL.SetPageEmployment
export const DeleteEmployment = DataSVL.DeleteEmployment
export const CheckedDeleteEmployment = DataSVL.CheckedDeleteEmployment
export const ChangeIsHideShowEmployment = DataSVL.ChangeIsHideShowEmployment
//Danh sách thông báo - người lao động
export const SetDataMailBox = DataSVL.SetDataMailBox
export const SetRefreshingMailBox = DataSVL.SetRefreshingMailBox
export const SetPageMailBox = DataSVL.SetPageMailBox
export const ReadMailBox = DataSVL.ReadMailBox
export const ReadAllMailBox = DataSVL.ReadAllMailBox
export const LoadListMailBox = DataSVL.LoadListMailBox
export const SeenMailBox = DataSVL.SeenMailBox
//Danh sách thông báo - doanh nghiep
export const SetDataMailBoxEnterprise = DataSVL.SetDataMailBoxEnterprise
export const SetRefreshingMailBoxEnterprise = DataSVL.SetRefreshingMailBoxEnterprise
export const SetPageMailBoxEnterprise = DataSVL.SetPageMailBoxEnterprise
export const ReadMailBoxEnterprise = DataSVL.ReadMailBoxEnterprise
export const ReadAllMailBoxEnterprise = DataSVL.ReadAllMailBoxEnterprise
export const LoadListMailBoxEnterprise = DataSVL.LoadListMailBoxEnterprise
export const SeenMailBoxEnterprise = DataSVL.SeenMailBoxEnterprise
//Widgets
export const setDataTaoSuaTinRaoVat = Widgets.setDataTaoSuaTinRaoVat
// Rao vat ca nhan
export const loadListRaoVatCaNhan = Widgets.loadListRaoVatCaNhan
export const setRefreshingRaoVatCaNhan = Widgets.setRefreshingRaoVatCaNhan
export const setPageRaoVatCaNhan = Widgets.setPageRaoVatCaNhan



