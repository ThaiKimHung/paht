import { nstyles } from "../styles";

let LATITUDE_DELTA = 200 / nstyles.nheight();
let LONGITUDE_DELTA = () => LATITUDE_DELTA * nstyles.nwidth() / nstyles.nheight();

export let appConfigCus = {
  live: {
    mode: 'live',
    // domain: 'https://bac-tra-my-admin-api.vts-paht.com/',
    // domain: 'https://lao-cai-admin-api.vts-paht.com/',
    // domain: 'https://son-la-admin-api.vts-paht.com/',
    // domain: 'https://hcm-binh-chanh-admin-api.vts-paht.com/',
    // domain: 'https://ba-ria-vung-tau-admin-api.vts-paht.com/',
    // domain: 'https://ha-noi-admin-api.vts-paht.com/',
    // domain: 'https://webapi-daklak.conveyor.cloud/',
    // domain: 'http://ninh-binh-admin-api.vts-paht.com/',
    // domain: 'https://hcm-mini-app-admin-api-test.vts-paht.com/', 
    // domain: 'https://1022-api.tayninh.gov.vn/', // LIVE TAY NINH - ĐỂ Ý
    // domain: 'https://webapi-tayninh.conveyor.cloud/',
    // domain: 'https://webapi-daklak.conveyor.cloud/',
    // domain: 'https://thai-nguyen-admin-api.vts-paht.com/',
    // domain: 'https://cao-bang-admin-api.vts-paht.com/',
    domain: 'https://thanh-hoa-admin-api.vts-paht.com/',
    // domain: 'https://webapi-tayninh.conveyor.cloud/',
    // domain: 'https://tay-ninh-admin-api.vts-paht.com/',
    // domain: 'http://api-paht.vungtau.baria-vungtau.gov.vn/',
    // domain: 'https://lai-chau-admin-api.vts-paht.com/',
    // domain: 'https://pleiku-admin-api.vts-paht.com/',
    // domain: 'https://quang-tri-admin-api.vts-paht.com/',
    // domain: 'https://dien-bien-admin-api.vts-paht.com/',
    // domain: 'https://dong-hoi-admin-api.vts-paht.com/', // domain có camera an ninh
    // domain: 'https://ca-ben-tre-admin-api.vts-paht.com/',
    // domain: 'https://tp-vinh-admin-api.vts-paht.com/',
    // domain: 'https://long-khanh-admin-api.vts-paht.com/',
    // domain: 'https://daklak-admin-api.vts-paht.com/',
    // domain: "https://proxy.vts-paht.com/all/",
    // domain: 'https://webapi-daklak.conveyor.cloud/',
    // domain:'https://ct-ninh-kieu-admin-api.vts-paht.com/',
    // domain: 'https://dt-hong-ngu-admin-api.vts-paht.com/',
    // domain: 'https://huyen-lac-duong-admin-api.vts-paht.com/',
    onesignalID: '8751b107-df47-49a5-b8e1-5924a78c6e0c', //Key Live của TayNinh - dùng CHUNG với domain tay-ninh.vts
    linkWeb: 'https://tay-ninh.vts-paht.com/',
    IdSource: 'UB',
    defaultRegion: {
      latitude: 10.379893,
      longitude: 105.439981,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA(),
    },
  },
  test: {
    mode: 'test',
    domain: 'https://tay-ninh-admin-api.vts-paht.com/',
    onesignalID: '53924707-5bee-4d04-b269-c721b1ba2ce8',
    linkWeb: 'https://tay-ninh.vts-paht.com/',
    IdSource: 'UB',
    defaultRegion: {
      latitude: 11.314580,
      longitude: 106.094250,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA(),
    },
  }
};

let deeplinkApp = 'gypa70';
//++Mô tả: IdSource dùng để phân biệt những API khác, code khác giữa 2 nhánh Source

export let configAll = {
  IdSource: 'UB', // 'CA' :quy trình Công An, 'UB' : quy trình Uỷ ban,
  version: '1.2.6',
  verIOS: 99,
  verAndroid: 99,
  IdTinhAI: 2021, //2021: là ID test của nhánh GỐC, merger quá Các Tỉnh phải đổi 1 ID riêng
  apiKeyGoogle: 'AIzaSyB5yWko5vB8FgRHXDXRSL2EKs4GM-r9SbU | AIzaSyD72q6FLVgnVJ-2QnwL6chbSV2I-LV51tU', //Key: 'ALL', 'Android | IOS' ya
  defaultLang: 'vi',
  defaultLangName: 'Việt Nam',
  CodeConfigCanBo: 'TNG', // dùng để kiểm tra code AppCanBo, chức năng G tùy theo từng tỉnh, khi đổi domain đổi app, phải thay đổi code này theo api
  CodeShowAppG: 'ShowAppG',
  CodeRedux: 3,//app có app cũ thì nâng lên +1 k có app cũ thì về 0
  IsQR: 0, //Nếu 1 là QR quét hồ sơ Tây Ninh, 0: QR quét bình thường
  isAppTN: false,//khỏi động view dành riẻng cho tây ninh
  isImage: false, //Gửi phản ánh, mặc định là false: k bắt buộc hình ảnh/ video/ file, true: bắt buộc (Quảng trị bật true)
  icFocusQR: 0,//Nếu 0 là không có hiển thị chức nang, 1: quét login bằng QR ---
  apiViettelMap: 'd95d9dd68a0ba39baaa79547d464c363',// Key Dịch vụ của Viettel
  useKeyMap: true, // true: Autocomplet của Viettel , false: Autocomplet là của Google,
  keySecret: 'vts@123', //key riêng để mã hoá QR Cá nhân
  domainAIPAHT: "http://115.79.43.243:9220/",
  tokenAIFace: 'LtPhlLWPgAqyzXHUkf3Vim8UMgtP6hOu',
  domainGiayThongHanh: 'https://long-khanh.vts-paht.com/'
};

export let appConfig = {
  ...configAll,
  TenAppHome: 'Root Tây Ninh',
  TieuDeApp: 'Phản ánh hiện trường',
  TenTinh: 'Tây Ninh',
  appToken: '',
  rootIOC: '/thainguyen', //tên root IOC
  deeplinkApp: deeplinkApp,
  //Điều hành
  deeplinkDieuHanh: deeplinkApp + '://app/root/main/home/stdieuhanh/main/homestack/ctpa/', // sẽ xử lý lại 2 chỗ này
  deeplinklist: deeplinkApp + '://app/root/main/home/stdieuhanh/main/homestack/danhsach', //vô danh sách phản ánh
  deeplinknoibo: deeplinkApp + '://app/root/main/home/stdieuhanh/main/homestackPANB/ctpanb/',
  deeplinkcorona: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stackCoVid/ct_tracking/',
  deeplinktuongtac: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stackcb/cttt/',
  deeplinkhome: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stacktrangchu/sctrangchu',
  deeplinkPAMR: deeplinkApp + '://app/root/main/home/stdieuhanh/main/homePAMR',
  deeplinkDSHuy: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stackDSHuy',
  deeplinkHomePAHT: deeplinkApp + '://app/root/main/home/stdieuhanh/main/homestack/danhsach/',
  deeplinkSOSCB: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stacksos/detailsos/',
  deeplinkSOSCB_Home: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stacksos/',
  deeplinkCBCV: deeplinkApp + `://app/root/main/stdieuhanh/main/stcbcovid/chitietcbcv/`,
  deeplinkHomeCBCV: deeplinkApp + `://app/root/main/stdieuhanh/main/stcbcovid/`,
  deeplinkDSTT: deeplinkApp + '://app/root/main/home/stdieuhanh/main/stacktt/dstuongtac/',

  //Chat
  deeplinkChat: deeplinkApp + `://app/root/main/home/chat/bottomchat/mainchat/group/`,
  deeplinkChatGroup: deeplinkApp + `://app/root/main/home/chat/bottomchat/chat/group/`,
  deeplinkChatDSKB: deeplinkApp + `://app/root/main/home/chat/bottomchat/danhba/dsketban`,

  //Cộng đồng
  deeplinkHome: deeplinkApp + '://app/root/home',
  deeplinkCongDan: deeplinkApp + '://app/root/main/home/stcongdan/tabbottom/canhan_t/chitiet_st/', //sẽ xử lý lại 2 chỗ này
  deeplinkxuphat: deeplinkApp + '://app/root/main/home/stcongdan/xuphat/chitietxuphat/', //deeplink vào chi tiết tra cứu xử phạt
  deeplinkCB: deeplinkApp + '://app/root/main/home/stcongdan/tabcb/st_qt/sc_cb/',
  deeplinkSOS: deeplinkApp + '://app/root/main/home/stcongdan/stacksos/chitietsos/',
  deeplinkCanhBaoCovid: deeplinkApp + '://app/root/main/home/stcbcovid/chitietcbcovid/',
  deeplinkTinKBYT: deeplinkApp + '://app/HomeKhaiBaoYteTaiNha/', //DONE
  deeplinkTuiAnSinh: deeplinkApp + '://app/root/main/home/stcongdan/slideansinhxahoi/tabansinhcanhan/chitiet_tuiansinh/',
  deeplinkHoiDapVTS: deeplinkApp + '://app/chitiethoidapvts/',
  deeplinkHoiDapVTS_Admin: deeplinkApp + '://app/hoidapadmin_chitiet/',
  deeplinkTuiVanF0: deeplinkApp + '://app/root/main/home/stcongdan/slidetuvanf0/tabcanhantuvanf0/chitiettuvanf0/',
  deeplinkSVL_TuyenDungCaNhan: deeplinkApp + '://app/cttuyendungcanhan/',
  deeplinkSVL_TuyenDungDoanhNghiep: deeplinkApp + '://app/cttuyendungdoanhnghiep/',

  //THông báo 
  deeplinkThongBaoChung: deeplinkApp + '://app/root/main/home/stcongdan/thongbao/tbchitiet/',

  //Linkking ở Tây Ninh
  deeplinkchitietHKG: deeplinkApp + '://app/root/main/home/sthkg/chitiethkg/', //Cần ID của cuộc họp
  deeplinkHoiDap: deeplinkApp + '://app/root/main/home/stcongdan/hoidap/chitietch/',  //Cần ID hỏi đáp
  deeplinkGuiHoSo: deeplinkApp + '://app/root/main/home/stcongdan/sthosodagui/lichsuhoso/', //Cần ID trạng thái
  deeplinkThanhToan: deeplinkApp + '://app/root/main/home/stcongdan/stThanhToan/ctthanhtoan/',//Id hồ sơ
  deeplinkTinTuc: deeplinkApp + '://app/root/main/home/stcongdan/tintuc/cttintuc/',
  //
  deeplinkGopYIOC: deeplinkApp + '://app/root/main/home/stdieuhanh/main/thongbaoioc',
  deeplinkGopYIOCCD: deeplinkApp + '://app/root/main/home/stcongdan/staskIOC/chitietIOC/',//Công dân
  defaultRegion: {
    latitude: 10.379893,
    longitude: 105.439981,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA(),
  },

  manHinhHKG: "HKGCT2",
  manHinhHoiDap: "HDCT",
  manHinhHoSo: "DVCDN",
  manHinhThanhToan: "TTLP",
  manHinhTinTuc: "TTCT",
  manHinhADmin: 'GADMIN',
  manhinhCongDan: 'GCONGDAN',
  manhinhKBYT: 'DIEMDANH',
  appHKG: 'HKG',
  appIOC: 'IOC',
  appILIS: 'ILIS',
  appCHAT: 'CHAT',
  ...appConfigCus.live
};
// daklakg://app/root/main/stackchat/bottomchat/chat/group/141
// apiKeyGoogle: 'AIzaSyA-uzx0QUjC9nOoh7hQwJts6Bbdhl48lDo'  - Key GG cũ của Tài
