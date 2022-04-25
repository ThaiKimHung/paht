import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Utils, { icon_typeToast } from "../../../app/Utils";
import { ButtonCom, HeaderCus } from "../../../components";
import { colors } from "../../../styles";
import FontSize from "../../../styles/FontSize";
import { Images } from "../../images";
import { getBottomSpace, } from "react-native-iphone-x-helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TYPES } from "../user/dangky/Component";
import ThongTinChungRender from "../user/dangky/ThongTinChungRender";
import apis from "../../apis";
import ComponentThongTinDiaChi from "./Component/ComponentThongTinDiaChi";
import moment from "moment";
import { reText } from "../../../styles/size";

// ---------------------- List Component In View ----------------------
const listGT = [
  {
    id: 0,
    name: "Nam",
    checkGT: true,
  },
  {
    id: 1,
    name: "Nữ",
    checkGT: false,
  },
];
const listLoai = [
  {
    id: 1,
    name: 'Thường trú'
  },
  {
    id: 2,
    name: 'Tạm trú'
  }
]
const listThuocDien = [
  {
    id: 2,
    name: 'Hộ nghèo ',
  },
  {
    id: 3,
    name: 'Hộ cận nghèo',
  },
  {
    id: 4,
    name: 'Hộ khó khăn',
  }
]
const lstCaNhan = [
  {
    id: 1,
    name: 'Cá nhân',
  }
]
const lstPhuongThuc = [
  {
    id: 1,
    TenPhuongThuc: 'Chuyển khoản',
  },
  {
    id: 2,
    TenPhuongThuc: 'Nhận từ tổ trưởng',
  },
  {
    id: 3,
    TenPhuongThuc: 'Nhận từ uỷ ban phường xã',
  }
]
const listComTTCN = [
  {
    id: 0,
    name: "Thông Tin Cá Nhân",
    type: TYPES.Title,
    check: false,
    key: "ttcn",
  },
  {
    id: 2,
    name: "Họ và tên",
    type: TYPES.TextInput,
    check: true,
    key: "hoten",
    placehoder: "Nhập họ và tên",
    errorText: "",
    helpText: "",
    note: ' *',
    checkNull: true,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 3,
    name: "Số điện thoại",
    type: TYPES.TextInput,
    check: true,
    key: "sodienthoai",
    placehoder: "Nhập số điện thoại",
    errorText: "",
    helpText: "",
    keyboardType: "phone-pad",
    checkNull: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  // {
  //   id: 14,
  //   name: "Số nhân khẩu",
  //   type: TYPES.TextInput,
  //   check: true,
  //   key: "sonhankhau",
  //   placehoder: "Nhập số nhân khẩu",
  //   errorText: "",
  //   helpText: "",
  //   keyboardType: "numeric",
  //   checkNull: true,
  //   note: ' *',
  //   styleBodyInputCus: {
  //     borderColor: colors.grayLight,
  //     borderRadius: 7,
  //   },
  //   styleLabelCus: {
  //     fontSize: FontSize.reText(16),
  //   },
  // },
  // {
  //   id: 4,
  //   name: "Địa chỉ ở quê",
  //   type: TYPES.Title,
  //   check: false,
  //   key: "ttcn",
  // },
  {
    id: 8,
    name: "Huyện",
    type: TYPES.Children,
    check: false,
  },
  {
    id: 7,
    name: "Số nhà và tên đường",
    type: TYPES.TextInput,
    check: true,
    key: "soNhaTenDuong",
    placehoder: "Nhập số nhà và tên đường",
    errorText: "",
    helpText: "",
    note: ' *',
    checkNull: true,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 10,
    name: "Loại :  ",
    type: TYPES.CauHoi,
    check: false,
    key: "Loai",
    placehoder: "",
    errorText: "",
    helpText: "",
    value: listLoai[0],
    list: listLoai,
    checkNull: true,
    // note: ' '
  },
];
const listComDiaChi = [
  {
    id: 4,
    name: "Địa chỉ ở quê",
    type: TYPES.Title,
    check: false,
    key: "ttcn",
  },
  {
    id: 1,
    name: "Tỉnh/Thành phố",
    type: TYPES.DropDown,
    check: false,
    key: "tinh",
    placehoder: "- Chọn tỉnh/thành -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    keyView: "TenTinhThanh",
    isEdit: false,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },
  {
    id: 5,
    name: "Quận/ Huyện",
    type: TYPES.DropDown,
    check: false,
    key: "huyen",
    placehoder: "- Chọn quận/huyện -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    isEdit: false,
    keyView: "TenQuanHuyen",
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },
  {
    id: 5,
    name: "Xã/ Phường",
    type: TYPES.DropDown,
    check: true,
    key: "IdDonVi",
    placehoder: "- Chọn xã/phường -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    keyView: "TenXaPhuong",
    isEdit: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },
  {
    id: 5,
    name: "Khu phố/Ấp : ",
    type: TYPES.DropDown,
    check: true,
    key: "khuPho",
    placehoder: "- Chọn khu phố/Ấp -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    isEdit: true,
    keyView: "Name",
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },

  {
    id: 5,
    name: "Tổ: ",
    type: TYPES.DropDown,
    check: true,
    key: "to",
    placehoder: "- Chọn tổ -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    isEdit: true,
    keyView: "Name",
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },

];
const listComChung = [
  {
    id: 6,
    name: "Giới tính ",
    type: TYPES.CauHoi,
    check: true,
    key: "GioiTinh",
    placehoder: "",
    errorText: "",
    helpText: "",
    value: listGT[0], //mặc định là nam
    list: listGT,
    checkNull: true,
    // note: ' '
  },
  {
    id: 9,
    name: "Năm sinh ",
    type: TYPES.DropDown,
    check: true,
    key: "idNamSinh",
    keyView: "namSinh",
    placehoder: "- Chọn năm sinh -",
    errorText: "",
    helpText: "",
    isRow: false,
    checkNull: true,
    note: ' *',
    styleLabel: {
      fontSize: FontSize.reText(16), fontWeight: 'bold'
    }
  },
  {
    id: 5,
    name: "CMND/Căn Cước/Hộ Chiếu",
    type: TYPES.TextInput,
    check: true,
    key: "CMND",
    placehoder: "Nhập CMND/Căn Cước/Hộ Chiếu",
    errorText: "",
    helpText: "",
    keyboardType: "numeric",
    checkNull: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 13,
    name: "Ngày cấp ",
    type: TYPES.DatePicker,
    check: true,
    key: "ngayCap",
    placehoder: "Ngày cấp",
    errorText: "",
    helpText: "",
    checkNull: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    styleLabel: {
      fontSize: FontSize.reText(16), fontWeight: 'bold'
    }
  },
  {
    id: 7,
    name: "Bạn làm tại doanh nghiệp",
    type: TYPES.TextInput,
    check: true,
    key: "doanhnghiep",
    placehoder: "Vui lòng nhập doanh nghiệp",
    errorText: "",
    helpText: "",
    note: " ",
    checkNull: false,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 8,
    name: "Phương thức nhận hỗ Trợ",
    type: TYPES.DropDown,
    check: true,
    key: "phuongthucnhan",
    keyView: "TenPhuongThuc",
    placehoder: "- Chọn phương thức nhận -",
    errorText: "",
    helpText: "",
    isRow: false,
    checkNull: true,
    note: ' *',
    styleLabel: {
      fontSize: FontSize.reText(16), fontWeight: 'bold'
    }
  },
  {
    id: 5,
    name: "STK - Chủ tài khoản - Tên ngân hàng",
    type: TYPES.TextInput,
    check: true,
    key: "stk",
    placehoder: "Vui lòng nhập STK - Chủ tài khoản - Tên ngân hàng",
    errorText: "",
    helpText: "*Nếu chưa có TK Ngân hàng ấn vào đây để đăng ký",
    isHelpTouchText: true,
    onPressHelpTouch: () => Utils.openWeb(this, 'https://vtphcm.tk/ubndbinhchanh', { title: 'Đăng ký mở tài khoản ViettelPay' }),
    note: " ",
    checkNull: false,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    styleHelp: {
      color: colors.redDark,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fontSize: FontSize.reText(14)
    }
  },
  // {
  //   id: 10,
  //   name: "Thuộc diện ",
  //   type: TYPES.CauHoi,
  //   check: true,
  //   key: "ThuocDien",
  //   placehoder: "",
  //   errorText: "",
  //   helpText: "",
  //   value: listThuocDien[0], //mặc định là nam
  //   list: listThuocDien,
  //   checkNull: true,
  //   // note: ' '
  // },
  // {
  //   id: 11,
  //   name: "Đối tượng hỗ trợ",
  //   type: TYPES.DropDown,
  //   check: true,
  //   key: "IdDoiTuongHoTro",
  //   keyView: "Name",
  //   placehoder: "- Chọn Đối Tượng Hỗ Trợ -",
  //   errorText: "",
  //   helpText: "",
  //   isRow: false,
  //   checkNull: true,
  //   note: ' *',
  //   styleLabel: {
  //     fontSize: FontSize.reText(16), fontWeight: 'bold'
  //   }
  // },
  {
    id: 7,
    name: "Khó khăn khác",
    type: TYPES.TextInput,
    check: true,
    key: "khokhankhac",
    placehoder: "Nhập khó khăn vào đây",
    errorText: "",
    helpText: "",
    note: " ",
    checkNull: false,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(17),
    },
  },
];

const listComCongVan = [
  {
    id: 1,
    name: "Công văn",
    type: TYPES.Title,
    check: false,
    key: "ttcn",
  },
  {
    id: 2,
    name: "Công văn",
    type: TYPES.DropDown,
    check: false,
    key: "congvan",
    placehoder: "- Chọn công văn -",
    errorText: "",
    helpText: "",
    isRow: false,
    isEnd: false,
    keyView: "SoCongVan",
    isEdit: false,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true,
  },
  {
    id: 3,
    name: 'Tên công văn',
    type: TYPES.TextInput,
    check: true,
    key: 'tencongvan',
    placehoder: 'Tên công văn',
    errorText: '',
    helpText: '',
    checkNull: false,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
      backgroundColor: colors.black_10
    },
    styleLabelCus: {
      fontSize: FontSize.reText(18)
    },
    isEdit: false
  },
  {
    id: 4,
    name: 'Ghi chú',
    type: TYPES.TextInput,
    check: true,
    key: 'ghichu',
    placehoder: 'Ghi chú',
    errorText: '',
    helpText: '',
    checkNull: false,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
      backgroundColor: colors.black_10
    },
    styleLabelCus: {
      fontSize: FontSize.reText(18)
    },
    isEdit: false
  },
]

const listComDoiTuongCaNhan = [
  {
    id: 14,
    name: "Số nhân khẩu",
    type: TYPES.TextInput,
    check: true,
    key: "sonhankhau",
    placehoder: "Nhập số nhân khẩu",
    value: "1",
    errorText: "",
    helpText: "",
    keyboardType: "numeric",
    checkNull: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 10,
    name: "Thuộc diện ",
    type: TYPES.CauHoi,
    check: true,
    key: "ThuocDien",
    placehoder: "",
    errorText: "",
    helpText: "",
    value: lstCaNhan[0], //mặc định là nam
    list: lstCaNhan,
    checkNull: true,
    // note: ' '
  },
  {
    id: 11,
    name: "Đối tượng hỗ trợ",
    type: TYPES.DropDown,
    check: true,
    key: "IdDoiTuongHoTro",
    keyView: "Name",
    placehoder: "- Chọn Đối Tượng Hỗ Trợ -",
    errorText: "",
    helpText: "",
    isRow: false,
    checkNull: true,
    note: ' *',
    styleLabel: {
      fontSize: FontSize.reText(16), fontWeight: 'bold'
    }
  },
]

const listComDoiTuongHoGiaDinh = [
  {
    id: 14,
    name: "Số nhân khẩu",
    type: TYPES.TextInput,
    check: true,
    key: "sonhankhau",
    placehoder: "Nhập số nhân khẩu",
    errorText: "",
    helpText: "",
    keyboardType: "numeric",
    checkNull: true,
    note: ' *',
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(16),
    },
  },
  {
    id: 10,
    name: "Thuộc diện ",
    type: TYPES.CauHoi,
    check: true,
    key: "ThuocDien",
    placehoder: "",
    errorText: "",
    helpText: "",
    value: listThuocDien[0], //mặc định là nam
    list: listThuocDien,
    checkNull: true,
    // note: ' '
  },
  {
    id: 11,
    name: "Đối tượng hỗ trợ",
    type: TYPES.DropDown,
    check: true,
    key: "IdDoiTuongHoTro",
    keyView: "Name",
    placehoder: "- Chọn Đối Tượng Hỗ Trợ -",
    errorText: "",
    helpText: "",
    isRow: false,
    checkNull: true,
    note: ' *',
    styleLabel: {
      fontSize: FontSize.reText(16), fontWeight: 'bold'
    }
  },
]

// ---------------------------------------------------------------------

const DangKyNhanHoTro = (props) => {
  const [isKhaiHo, setisKhaiHo] = useState(true);
  const refTTCaNhan = useRef(null);
  const refTTDiaChi = useRef(null);
  const refTTChung = useRef(null);
  const refTTCongVan = useRef(null);
  const refTTDoiTuong = useRef(null);
  const [dataDoiTuongHoTro, setDataDoiTuongHoTro] = useState([])
  const [dataNamSinh, setDataNamSinh] = useState([])
  const [dataCongVan, setDataCongVan] = useState([])
  const [CongVanSelect, setCongVanSelect] = useState('')

  useEffect(() => {
    if (dataNamSinh) {
      refTTChung?.current?.setDataDropDown("idNamSinh", dataNamSinh);
    }
  }, [dataNamSinh])

  useEffect(() => {
    if (dataDoiTuongHoTro) {
      refTTDoiTuong?.current?.setDataDropDown("IdDoiTuongHoTro", dataDoiTuongHoTro);
    }
  }, [dataDoiTuongHoTro])

  useEffect(() => {
    if (dataCongVan) {
      refTTCongVan?.current?.setDataDropDown("congvan", dataCongVan);
    }
  }, [dataCongVan])

  useEffect(() => {
    // Lấy tất cả năm sinh
    createDataYearOfBorn();
    // Lấy tất cả đối tượng
    getDoiTuong();
    //get cong van
    GetAllCongVan_DotTroCap()
    refTTChung?.current?.setDataDropDown("phuongthucnhan", lstPhuongThuc);
  }, []);

  // tạo dữ liệu năm sinh
  const createDataYearOfBorn = () => {
    let currentYear = parseInt(moment(new Date()).format('YYYY').toString());
    let lstYear = [];
    for (let index = currentYear - 120; index <= currentYear; index++) {
      const element = { idNamSinh: index, namSinh: index + "" };
      lstYear.push(element);
    }
    if (lstYear && lstYear.length > 0) {
      setDataNamSinh(lstYear)
    }
  };
  // hàm get đối tượng trên api
  const getDoiTuong = async () => {
    // getDoiTuongHoTro
    let resDTHoTro = await apis.ApiHCM.getDoiTuongHoTro();
    console.log("array doi tuong ho tro", resDTHoTro);
    if (resDTHoTro.status == 1) {
      setDataDoiTuongHoTro(resDTHoTro.data)
    } else {
      setDataDoiTuongHoTro([])
    }
  };

  //get công Văn GetAllCongVan_DotTroCap
  const GetAllCongVan_DotTroCap = async () => {
    // getDoiTuongHoTro
    let resCongVan = await apis.ApiHCM.GetAllCongVan_DotTroCap();
    console.log("array cong van", resCongVan);
    if (resCongVan.status == 1 && resCongVan.data) {
      setDataCongVan(resCongVan.data)
    } else {
      setDataCongVan([])
    }
  };
  // sự kiện nút đăng ký
  const onPressSubmid = async () => {
    let objectTTCN = refTTCaNhan.current.getData();
    let objectTTDC = refTTDiaChi.current.getData();
    let objectTTC = refTTChung.current.getData();
    let objectTTCongVan = refTTCongVan.current.getData();
    let objectTTDoiTuong = refTTDoiTuong.current.getData();
    console.log("Thong Ca Nhan : ", objectTTCN);
    console.log("Thong dia chi : ", objectTTDC);
    console.log("Thong Tin Chung : ", objectTTC);
    console.log("Thong Cong Van : ", objectTTCongVan);
    console.log("Thong Tin Doi Tuong : ", objectTTDoiTuong);
    // Check Thông tin cá nhân

    for (const element of listComCongVan) {
      if (element["checkNull"] == true && !objectTTCongVan[element["key"]]) {
        Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
        return;
      }
    }
    // Họ và tên, số điện thoại, số nhà và tên đường địa chị ở phường bạn
    for (const element of listComTTCN) {
      if (element["checkNull"] == true && !objectTTCN[element["key"]]) {
        Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
        return;
      }
    }

    //Check thông tin đối tượng
    if (CongVanSelect && CongVanSelect?.CaNhanHoGiaDinh) {
      //Hộ gia đình
      for (const element of listComDoiTuongHoGiaDinh) {
        if (element["checkNull"] == true && !objectTTDoiTuong[element["key"]]) {
          Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
          return;
        }
      }
    } else {
      //Cá nhaan
      for (const element of listComDoiTuongCaNhan) {
        if (element["checkNull"] == true && !objectTTDoiTuong[element["key"]]) {
          Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
          return;
        }
      }
    }

    // check địa chỉ 
    for (const element of listComDiaChi) {
      if (element["checkNull"] == true && !objectTTDC[element["key"]]) {
        Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
        return;
      }
    }
    // check thông tin chung
    // CMND, Năm Sinh, Đối Tượng, Số Tài Khoản Ngân Hàng, Số nhà và tên đường tạm trú và địa chỉ tạm trú
    for (const element of listComChung) {
      if (element["checkNull"] == true && !objectTTC[element["key"]]) {
        Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`, icon_typeToast.warning, 3000, icon_typeToast.warning)
        return;
      }
    }


    const body = {
      CMND: objectTTC.CMND,
      DiaChiVe: objectTTCN.soNhaTenDuong,
      DoanhNghiep: objectTTC.doanhnghiep || "",
      DoiTuong: objectTTDoiTuong.IdDoiTuongHoTro.Id,
      GioiTinh: objectTTC.GioiTinh.checkGT,// true nam, false nữ
      HoTen: objectTTCN.hoten,
      IDPhuongXaVe: Number(objectTTDC?.IdDonVi?.IdPhuongXa) || "",
      IDQuanHuyenVe: objectTTDC?.huyen?.IDQuanHuyen || "",
      IdKhuPhoVe: objectTTDC?.khuPho?.Id || "",
      IdToVe: objectTTDC?.to?.Id || "",
      KhoKhanKhac: objectTTC.khokhankhac || "",
      LoaiDiaChi: objectTTCN.Loai.id, //1 thường trú, 2 tạm trú
      NamSinh: objectTTC.idNamSinh.idNamSinh,
      SDT: objectTTCN.sodienthoai,
      STK: objectTTC.stk || "",
      ThuocDien: objectTTDoiTuong.ThuocDien.id,// 1 cá nhân, 2 hộ nghèo, 3 hộ cận nghèo 
      NgayCapCMND: objectTTC.ngayCap,
      SoNhanKhau: objectTTDoiTuong.sonhankhau,
      //Phuong thức hỗ trợ, Công văn
      IdCongVan: objectTTCongVan?.congvan?.IdCongVan || '',
      PhuongThucHoTro: objectTTC?.phuongthucnhan?.id || ''
    };
    Utils.nlog("[LOG] Data body để post lên", body);
    Utils.setToggleLoading(true);
    let res = await apis.ApiHCM.DangKy_HoTroKhoKhan(body);
    Utils.nlog("[LOG] res dang ki nhan ho tro", res);
    Utils.setToggleLoading(false);
    if (res.status == 1) {
      Utils.showToastMsg('Thông báo', 'Thực hiện thành công', icon_typeToast.success, 3000, icon_typeToast.success)
      Utils.goback({ props: props })
    } else {
      Utils.showToastMsg('Thông báo', res?.error?.message || "Thực hiện thất bại", icon_typeToast.danger, 3000, icon_typeToast.danger)
    };
  }

  const onChangeState = async (state) => {
    console.log('[LOG] state =========', state)
    setCongVanSelect(state?.congvan)

    let dataDoiTuongCaNhan = [], dataDoiTuongHoGiaDinh = []
    dataDoiTuongHoTro.forEach(e => {
      if (e.Type == 0) {
        dataDoiTuongCaNhan.push(e)
      } else {
        dataDoiTuongHoGiaDinh.push(e)
      }
    })
    refTTDoiTuong?.current?.setDataDropDown("IdDoiTuongHoTro", state?.congvan?.CaNhanHoGiaDinh ? dataDoiTuongHoGiaDinh : dataDoiTuongCaNhan);
    // setDoiTuong()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
      <HeaderCus
        Sleft={{ tintColor: "white" }}
        onPressLeft={() => Utils.goback({ props })}
        iconLeft={Images.icBack}
        title={`Đăng ký nhận hỗ trợ`}
        styleTitle={{ color: colors.white }}
      />
      <View style={{ ...styles.containerBody }}>
        <KeyboardAwareScrollView style={{ backgroundColor: colors.white }} showsVerticalScrollIndicator={false} >
          <View style={{ alignItems: "center", flexDirection: 'row', paddingTop: FontSize.scale(10) }} >
            <Text style={{ fontSize: reText(16), }}>  {"Các thông tin có dấu"}  </Text>
            <Text style={{ fontSize: reText(16), color: colors.redStar }}>{"*"}</Text>
            <Text style={{ fontSize: reText(16) }}>  {"bắt buộc"}  </Text>
          </View>
          {/*---------- View hiển thị userName số điện thoại và địa chỉ thường trú của user----------*/}
          <View >
            <ThongTinChungRender
              objectData={{ congvan: CongVanSelect, tencongvan: CongVanSelect?.TenCongVan || '', ghichu: CongVanSelect?.GhiChu || '' }} ref={refTTCongVan}
              listCom={listComCongVan}
              isEdit={true}
              listenState={state => onChangeState(state)}
            />
          </View>
          {
            React.useMemo(() => <View pointerEvents={isKhaiHo ? "auto" : "none"}>
              <ThongTinChungRender objectData={{ sodienthoai: "", hoten: "", soNhaTenDuong: "", Loai: listLoai[0] }} ref={refTTCaNhan} listCom={listComTTCN} isEdit={true} >
              </ThongTinChungRender>
            </View>, [])
          }
          {
            CongVanSelect && !CongVanSelect?.CaNhanHoGiaDinh ?
              <ThongTinChungRender
                ref={refTTDoiTuong}
                objectData={{ sonhankhau: "1" }}
                listCom={listComDoiTuongCaNhan}
                isEdit={true}
              /> : <ThongTinChungRender
                objectData={{ ThuocDien: listThuocDien[0] }}
                ref={refTTDoiTuong}
                listCom={listComDoiTuongHoGiaDinh}
                isEdit={true}
              />
          }
          {
            React.useMemo(() => <View pointerEvents={isKhaiHo ? "auto" : "none"}>
              <ComponentThongTinDiaChi tinh={79} huyen={785} IdDonVi={""} khuPho={""} to={""} ref={refTTDiaChi} listCom={listComDiaChi} />
            </View>, [])
          }
          {/*---------- View thông tin chung bao gồm giới tính, CMND, năm sinh, doanh nghiệp, STK, đối tượng, địa chỉ tạm trú và những khó khăn khác ----------*/}
          {
            React.useMemo(() => <View>
              <ThongTinChungRender ref={refTTChung} listCom={listComChung} isEdit={true} />
            </View>
              , [])
          }
          <View style={{ padding: FontSize.scale(10), flexDirection: "row" }}  >
            <ButtonCom
              onPress={onPressSubmid}
              sizeIcon={30}
              txtStyle={{ color: colors.white }}
              style={styles.buttonSubmit}
              text={"Đăng Ký"}
            />
          </View>
        </KeyboardAwareScrollView>
      </View >
    </View >
  );
};

export default DangKyNhanHoTro;

const styles = StyleSheet.create({
  containerBody: {
    paddingHorizontal: FontSize.scale(10),
    backgroundColor: colors.colorPaleGrey,
    flex: 1,
    paddingBottom: getBottomSpace(),
  },
  commonTitle: {
    fontWeight: "bold",
    fontSize: FontSize.reText(16),
    color: colors.blueFaceBook,
    textAlign: "center",
    paddingVertical: FontSize.scale(10),
  },
  commonText: {
    fontWeight: "bold",
    fontSize: FontSize.reText(16),
    color: colors.black,
    textAlign: "left",
    // paddingVertical: FontSize.scale(10),
  },
  //  Styles Khai hộ nếu không cần login
  contentKhaiHo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: FontSize.scale(15),
  },
  icKhaiHo: {
    width: FontSize.reSize(20),
    height: FontSize.reSize(20),
    tintColor: colors.colorSalmon,
    borderWidth: 0.5,
    borderColor: colors.colorSalmon,
  },
  textKhaiHo: {
    fontWeight: "bold",
    fontSize: FontSize.reText(16),
    color: colors.black_60,
    paddingHorizontal: FontSize.scale(10),
  },
  buttonSubmit: {
    borderRadius: FontSize.scale(5),
    alignSelf: "center",
    flex: 1,
    padding: FontSize.scale(15),
    width: "100%",
  },
});

