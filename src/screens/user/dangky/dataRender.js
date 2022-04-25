import { TYPES } from './Component'
const listGT = [
    {
        id: 0,
        name: "Nam"
    },
    {
        id: 1,
        name: "Nữ"
    }
]
const listType = [
    {
        id: 2,
        name: "Chủ hộ"
    },

    {
        id: 3,
        name: "Thành viên trong hộ"
    },
    {
        id: 4,
        name: "Tạm trú"
    },
]
const listLoai = [
    {
        id: 1,
        name: "Doanh nghiệp"
    },
    {
        id: 2,
        name: "Chủ hộ"
    },

    {
        id: 3,
        name: "Thành viên trong hộ"
    },
    {
        id: 4,
        name: "Tạm trú"
    },
    {
        id: 5,
        name: "Tài khoản ngắn hạn"
    },
]
const listComTTLoaiTK = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 8,
        name: 'Loại tài khoản',
        type: TYPES.DropDown,
        check: true,
        key: 'Loai',
        keyView: 'name',
        placehoder: '- Chọn quan hệ -',
        errorText: '',
        helpText: '',
        isRow: true,
    },

];
const dataQuanHe = [
    {
        id: 1,
        name: "Nhân viên"
    },
    {
        id: 2,
        name: "Thuê trọ"
    },
    {
        id: 3,
        name: "Thành viên trong gia đình"
    }
]
const listComTTCongDan = [
    {
        id: 1,
        name: 'Thông tin tài khoản',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 2,
        name: 'Họ và tên',
        type: TYPES.TextInput,
        check: true,
        key: 'hoten',
        placehoder: 'Nhập họ và tên',
        errorText: 'Vui lòng nhập họ tên',
        helpText: '',
        checkNull: true
    },
    {
        id: 2,
        name: 'Số định danh',
        type: TYPES.TextInput,
        check: true,
        key: 'sodinhdanh',
        placehoder: 'Nhập số định danh',
        errorText: '',
        helpText: '',
        checkNull: true
    },
    {
        id: 2,
        name: 'Số điện thoại',
        type: TYPES.TextInput,
        check: true,
        key: 'dienthoai',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        checkNull: true
    },
    {
        id: 8,
        name: 'Đơn vị',
        type: TYPES.DropDown,
        check: true,
        key: 'donviid',
        keyView: 'TenDonVi',
        placehoder: '- Chọn đơn vị -',
        errorText: '',
        helpText: '',
        isRow: false,
        checkNull: false
    },
    {
        id: 2,
        name: 'Chức danh',
        type: TYPES.TextInput,
        check: true,
        key: 'chucdanh',
        placehoder: 'Nhập chức danh',
        errorText: '',
        helpText: '',
        checkNull: false
    },
    // ComponentQuanHe
];
const listComTTCongDanView = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    // {
    //     id: 2,
    //     name: 'Hình ảnh 4*6',
    //     type: TYPES.ImagePicker,
    //     check: true,
    //     key: 'FileUploadAvata',
    //     placehoder: 'file',
    //     errorText: '',
    //     helpText: '',
    //     value: ''
    // },
    {
        id: 2,
        name: 'Họ và tên',
        type: TYPES.TextInputView,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_hovaten_hcm'
    },
    {
        id: 1,
        name: 'Giới tính',
        type: TYPES.TextInputView,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT,
        icon_prefix_label: 'ic_gioitinh_hcm'
    },

    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.TextInputView,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD',
        icon_prefix_label: 'ic_ngaysinh_hcm'
    },
    {
        id: 4,
        name: 'Số CMND',
        type: TYPES.TextInputView,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số cmnd',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_cmnd_hcm'
    },

    {
        id: 5,
        name: 'Loại',
        type: TYPES.TextInputView,
        check: true,
        key: 'Loai',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        value: listType[0],
        list: listType,
        checkNull: true
    },
    // {
    //     id: 6,
    //     name: 'Quan hệ',
    //     type: TYPES.TextInputView,
    //     check: true,
    //     key: 'Loai',
    //     placehoder: 'Nhập họ và tên',
    //     errorText: '',
    //     helpText: '',
    //     value: listType[0],
    //     list: listType
    // },
    // ComponentQuanHe
];
const listComTTDDDoanhNghiep = [
    {
        id: 1,
        name: 'Thông tin người đại diện',
        type: TYPES.Title,
        check: false,
        key: 'ttndd'
    },
    {
        id: 2,
        name: 'Hình ảnh 4*6',
        type: TYPES.ImagePicker,
        check: true,
        key: 'FileUploadAvata',
        placehoder: 'file',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Giới tính',
        type: TYPES.GioiTinh,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT
    },
    {
        id: 2,
        name: 'Họ và tên người đại diện',
        type: TYPES.TextInput,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.DatePicker,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: 'Vui lòng chọn ngày sinh',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 2,
        name: 'Số CMND/CCCD',
        type: TYPES.TextInput,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số CMND/CCCD',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.Children,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
];
const listComTTDoanhNghiep = [
    {
        id: 1,
        name: 'Thông tin doanh nghiệp',
        type: TYPES.Title,
        check: false,
        key: 'ttndd'
    },
    {
        id: 2,
        name: 'Tên doanh nghiệp',
        type: TYPES.TextInput,
        check: true,
        key: 'TenDoanhNghiep',
        placehoder: 'Nhập tên doanh nghiệp',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Số điện thoại doanh nghiệp',
        type: TYPES.TextInput,
        check: true,
        key: 'SDTDoanhNghiep',
        placehoder: 'Nhập số điện thoại doanh nghiệp',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Mã số thuế',
        type: TYPES.TextInput,
        check: true,
        key: 'MaSoThue',
        placehoder: 'Nhập mã số thuế',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Địa chỉ',
        type: TYPES.TextInput,
        check: true,
        key: 'DiaChiDoanhNghiep',
        placehoder: 'Nhập địa chỉ doanh nghiệp',
        errorText: '',
        helpText: ''
    },
];
// IdCongTy(pin):10005
// TenDoanhNghiep(pin):"bccd"
// DiaChiDoanhNghiep(pin):"222 le van sy"
// MaSoThue(pin):"123123"
// SDTDoanhNghiep(pin):"0967384119"
// MaCodeXacThuc(pin):null
const listComTTDoanhNghiepDangKyView = [
    {
        id: 1,
        name: 'Doanh nghiệp',
        type: TYPES.Title,
        check: false,
        key: 'ttndd'
    },
    {
        id: 2,
        name: 'Tên doanh nghiệp',
        type: TYPES.TextInputView,
        check: true,
        key: 'TenDoanhNghiep',
        placehoder: 'Nhập tên doanh nghiệp',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_company_hcm'
    },
    // {
    //     id: 2,
    //     name: 'Mã xác thực doanh nghiệp',
    //     type: TYPES.Children,
    //     check: true,
    //     key: 'MaCodeXacThuc',
    //     placehoder: '',
    //     errorText: '',
    //     helpText: '',
    //     icon_prefix_label: 'ic_maxacnhan_hcm'
    // },
    // {
    //     id: 2,
    //     name: 'Số điện thoại doanh nghiệp',
    //     type: TYPES.TextInputView,
    //     check: true,
    //     key: 'SDTDoanhNghiep',
    //     placehoder: '',
    //     errorText: '',
    //     helpText: '',
    //     icon_prefix_label: 'ic_sdt_hcm'
    // },
    // {
    //     id: 2,
    //     name: 'Mã số thuế',
    //     type: TYPES.TextInputView,
    //     check: true,
    //     key: 'MaSoThue',
    //     placehoder: 'Nhập mã số thuế',
    //     errorText: '',
    //     helpText: '',
    //     icon_prefix_label: 'ic_masothue_hcm'
    // },
    {
        id: 2,
        name: 'Địa chỉ',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChiDoanhNghiep',
        placehoder: 'Nhập địa chỉ doanh nghiệp',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm'
    },
];
const listComTTDoanhNghiepView = [
    {
        id: 1,
        name: 'Doanh nghiệp',
        type: TYPES.Title,
        check: false,
        key: 'ttndd'
    },
    {
        id: 2,
        name: 'Tên doanh nghiệp',
        type: TYPES.TextInputView,
        check: true,
        key: 'TenDoanhNghiep',
        placehoder: 'Nhập tên doanh nghiệp',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_company_hcm'
    },
    {
        id: 2,
        name: 'Mã xác thực doanh nghiệp',
        type: TYPES.Children,
        check: true,
        key: 'MaCodeXacThuc',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_maxacnhan_hcm'
    },
    {
        id: 2,
        name: 'Số điện thoại doanh nghiệp',
        type: TYPES.TextInputView,
        check: true,
        key: 'SDTDoanhNghiep',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_sdt_hcm'
    },
    {
        id: 2,
        name: 'Mã số thuế',
        type: TYPES.TextInputView,
        check: true,
        key: 'MaSoThue',
        placehoder: 'Nhập mã số thuế',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_masothue_hcm'
    },
    {
        id: 2,
        name: 'Địa chỉ',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChiDoanhNghiep',
        placehoder: 'Nhập địa chỉ doanh nghiệp',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm'
    },
];
// PhoneNumber
const listComTTCaNhanEdit = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn'
    },
    {
        id: 2,
        name: 'Hình ảnh 4*6',
        type: TYPES.ImagePicker,
        check: true,
        key: 'FileUploadAvata',
        placehoder: 'file',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Số điện thoại',
        type: TYPES.TextInput,
        check: true,
        key: 'PhoneNumber',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Giới tính',
        type: TYPES.GioiTinh,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT
    },
    {
        id: 2,
        name: 'Họ và tên',
        type: TYPES.TextInput,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.DatePicker,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: 'Vui lòng chọn ngày sinh',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 2,
        name: 'Số CMND',
        type: TYPES.TextInput,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số cmnd',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.Children,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },

];
const listComTTNhanVien = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn'
    },
    {
        id: 2,
        name: 'Hình ảnh 4*6',
        type: TYPES.ImagePicker,
        check: true,
        key: 'FileUploadAvata',
        placehoder: 'file',
        errorText: '',
        helpText: ''
    },
    {
        id: 2,
        name: 'Giới tính',
        type: TYPES.GioiTinh,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT
    },
    {
        id: 2,
        name: 'Họ và tên',
        type: TYPES.TextInput,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.DatePicker,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: 'Vui lòng chọn ngày sinh',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 2,
        name: 'Số CMND',
        type: TYPES.TextInput,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số cmnd',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Ngày sinh',
        type: TYPES.Children,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },

];
const listComTTTaiKhoan = [
    {
        id: 1,
        name: 'Thông tin tài khoản',
        type: TYPES.Title,
        check: false,
        key: 'tt'
    },
    {
        id: 2,
        name: 'Số điện thoại đăng nhập',
        type: TYPES.TextInput,
        check: true,
        key: 'UserName',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: ''
    },
    {
        id: 3,
        name: 'Mật khẩu',
        type: TYPES.TextInputPass,
        check: true,
        key: 'Password',
        placehoder: 'Nhập mật khẩu',
        errorText: 'Mật khẩu tối thiểu 6 ký tự',
        helpText: 'Mật khẩu tối thiểu 6 ký tự',
        minlength: 6
    },
    {
        id: 4,
        name: 'Nhập lại mật khẩu',
        type: TYPES.TextInputPass,
        check: true,
        key: 'RePassword',
        placehoder: 'Nhập lại mật khẩu',
        errorText: 'Mật khẩu nhập lại phải giống mật khẩu trên',
        helpText: 'Mật khẩu nhập lại phải giống mật khẩu trên',
        minlength: 6,
        keySam: 'Password',
    }
]

const listComKhaiBaoHo = [
    {
        id: 0,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 1,
        name: 'Hình ảnh 4*6',
        type: TYPES.ImagePicker,
        check: true,
        key: 'FileUploadAvata',
        placehoder: 'file',
        errorText: 'Vui lòng không để trống',
        helpText: ''
    },
    {
        id: 2,
        name: 'Họ và tên',
        type: TYPES.TextInput,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: 'Vui lòng nhập họ tên',
        helpText: ''
    },
    {
        id: 3,
        name: 'Giới tính',
        type: TYPES.GioiTinh,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: 'Vui lòng không để trống',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT
    },
    {
        id: 4,
        name: 'Số điện thoại (Nếu có)',
        type: TYPES.TextInput,
        check: true,
        key: 'SDT',
        placehoder: 'Nhập số điện thoại',
        errorText: 'Vui lòng nhập số điện thoại',
        helpText: '',
    },
    {
        id: 5,
        name: 'Số CMND/ CCCD (nếu có)',
        type: TYPES.TextInput,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số CMND/ CCCD',
        errorText: 'Vui lòng nhập số cmnd',
        helpText: ''
    },
    {
        id: 6,
        name: 'Ngày sinh',
        type: TYPES.DatePicker,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: 'Vui lòng chọn ngày sinh',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 7,
        name: 'Ngày sinh',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 8,
        name: 'Quan hệ',
        type: TYPES.DropDown,
        check: true,
        key: 'QuanHeVoiNguoiXacNhan',
        keyView: 'name',
        placehoder: '- Chọn quan hệ -',
        errorText: '',
        helpText: '',
        isRow: true,
    },
    // ComponentQuanHe
];
const listComDiaChi = [
    {
        id: 4,
        name: 'Tỉnh',
        type: TYPES.DropDown,
        check: false,
        key: 'tinh',
        placehoder: '- Chọn tỉnh -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: false,
        keyView: 'TenPhuongXa'
    },
    {
        id: 5,
        name: 'Huyện',
        type: TYPES.DropDown,
        check: false,
        key: 'huyen',
        placehoder: '- Chọn quận/huyện -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: true,
        keyView: 'TenPhuongXa'
    },
    {
        id: 5,
        name: 'Xã',
        type: TYPES.DropDown,
        check: true,
        key: 'IdDonVi',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenPhuongXa'
    },
    {
        id: 2,
        name: 'Địa chỉ',
        type: TYPES.TextInput,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập số nhà ngõ đường phố',
        errorText: '',
        helpText: ''
    },
]
const listComTTKhaiBaoHo = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 2,
        name: '',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 3,
        name: 'Họ và tên',
        type: TYPES.TextInputView,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_hovaten_hcm'
    },
    {
        id: 4,
        name: 'Giới tính',
        type: TYPES.TextInputView,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT,
        icon_prefix_label: 'ic_gioitinh_hcm'
    },
    {
        id: 5,
        name: 'Số điện thoại (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'PhoneNumber',
        placehoder: 'Chưa khai báo số điện thoại',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_sdt_hcm'
    },
    {
        id: 6,
        name: 'Số CMND/ CCCD (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'CMND',
        placehoder: 'Chưa khai báo số CMND/ CCCD',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_cmnd_hcm'
    },
    {
        id: 7,
        name: 'Ngày sinh',
        type: TYPES.TextInputView,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD',
        icon_prefix_label: 'ic_ngaysinh_hcm'
    },
    {
        id: 8,
        name: 'Nơi cư trú',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập nơi cư trú',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm',
        numberOfLines: 2,
        multiline: true
    },
    {
        id: 9,
        name: 'Quan hệ',
        type: TYPES.TextInputView,
        check: true,
        key: 'QuanHeVoiNguoiKhaiBaoStr',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'icChuTro'
    },

];

const listComTTNguoiXacNhan = [
    {
        id: 1,
        name: 'Thông tin cá nhân',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 2,
        name: '',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 3,
        name: 'Họ và tên',
        type: TYPES.TextInputView,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_hovaten_hcm'
    },
    {
        id: 4,
        name: 'Giới tính',
        type: TYPES.TextInputView,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT,
        icon_prefix_label: 'ic_gioitinh_hcm'
    },
    {
        id: 5,
        name: 'Số điện thoại (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'PhoneNumber',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_sdt_hcm'
    },
    {
        id: 6,
        name: 'Số CMND/ CCCD (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số CMND/ CCCD ',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_cmnd_hcm'
    },
    {
        id: 7,
        name: 'Ngày sinh',
        type: TYPES.TextInputView,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD',
        icon_prefix_label: 'ic_ngaysinh_hcm'
    },
    {
        id: 8,
        name: 'Nơi cư trú',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập nơi cư trú',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm',
        numberOfLines: 2,
        multiline: true
    },
    {
        id: 9,
        name: 'Quan hệ',
        type: TYPES.TextInputView,
        check: true,
        key: 'QuanHeVoiNguoiKhaiBaoStr',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'icChuTro'
    },

];

const listComTTNguoiPT = [
    {
        id: 1,
        name: 'Thông tin người phụ thuộc',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 2,
        name: '',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 3,
        name: 'Họ và tên',
        type: TYPES.TextInputView,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_hovaten_hcm'
    },
    {
        id: 4,
        name: 'Giới tính',
        type: TYPES.TextInputView,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT,
        icon_prefix_label: 'ic_gioitinh_hcm'
    },
    {
        id: 5,
        name: 'Số điện thoại (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'PhoneNumber',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_sdt_hcm'
    },
    {
        id: 6,
        name: 'Số CMND/ CCCD (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số CMND/ CCCD ',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_cmnd_hcm'
    },
    {
        id: 7,
        name: 'Ngày sinh',
        type: TYPES.TextInputView,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD',
        icon_prefix_label: 'ic_ngaysinh_hcm'
    },
    {
        id: 8,
        name: 'Nơi cư trú',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập nơi cư trú',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm',
        numberOfLines: 2,
        multiline: true
    },
    {
        id: 9,
        name: 'Quan hệ',
        type: TYPES.TextInputView,
        check: true,
        key: 'QuanHeVoiNguoiKhaiBaoStr',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'icChuTro'
    },

];

const listComTTChiTietNhanVien = [
    {
        id: 1,
        name: 'Thông tin nhân viên',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 2,
        name: '',
        type: TYPES.Children,
        check: false,
        key: 'children',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD'
    },
    {
        id: 3,
        name: 'Họ và tên',
        type: TYPES.TextInputView,
        check: true,
        key: 'FullName',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_hovaten_hcm'
    },
    {
        id: 4,
        name: 'Giới tính',
        type: TYPES.TextInputView,
        check: true,
        key: 'GioiTinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là nam
        list: listGT,
        icon_prefix_label: 'ic_gioitinh_hcm'
    },
    {
        id: 5,
        name: 'Số điện thoại (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'PhoneNumber',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_sdt_hcm'
    },
    {
        id: 6,
        name: 'Số CMND/ CCCD (nếu có)',
        type: TYPES.TextInputView,
        check: true,
        key: 'CMND',
        placehoder: 'Nhập số CMND/ CCCD ',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_cmnd_hcm'
    },
    {
        id: 7,
        name: 'Ngày sinh',
        type: TYPES.TextInputView,
        check: true,
        key: 'NgaySinh',
        placehoder: 'DD/MM/YYYY',
        errorText: '',
        helpText: '',
        format: 'YYYY-MM-DD',
        icon_prefix_label: 'ic_ngaysinh_hcm'
    },
    {
        id: 8,
        name: 'Nơi cư trú',
        type: TYPES.TextInputView,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập nơi cư trú',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'ic_address_hcm',
        numberOfLines: 2,
        multiline: true
    },
    {
        id: 9,
        name: 'Quan hệ',
        type: TYPES.TextInputView,
        check: true,
        key: 'QuanHeVoiNguoiKhaiBaoStr',
        placehoder: '',
        errorText: '',
        helpText: '',
        icon_prefix_label: 'icChuTro'
    },

];
const dataHCM = {
    dataCongDan: listComTTCongDan,
    dataTaiKhoan: listComTTTaiKhoan,
    dataGT: listGT,
}
export default dataHCM