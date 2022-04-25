// Định nghĩa biến Status API trả về trong data
//  0: Nộp hồ sơ ứng tuyển
// 	1: Mời phỏng vấn (Đã cập nhật lịch phỏng vấn)
// 	2: Hoàn tất phỏng vấn
// 	3: Kết quả phỏng vấn đậu
// 	4: Kết quả phỏng vấn rớt
// 	99: Từ chối
const DEFINE_STATUS = {
    'NOPHOSOUNGTUYEN': 0,
    'MOIPHONGVAN': 1,
    'HOANTATPHONGVAN': 2,
    'PHONGVANDAU': 3,
    'PHONGVANKHONGDAU': 4,
    'TUCHOIPHONGVAN': 99
}

const ARRAY_VALUE_STATUS = [
    // DEFINE_STATUS.NOPHOSOUNGTUYEN,
    // DEFINE_STATUS.MOIPHONGVAN,
    DEFINE_STATUS.HOANTATPHONGVAN,
    DEFINE_STATUS.PHONGVANDAU,
    DEFINE_STATUS.PHONGVANKHONGDAU,
    DEFINE_STATUS.TUCHOIPHONGVAN
]

// Định nghĩa nhóm dữ liệu ở màn hình lịch sử ứng tuyển của cá nhân người lao động
const STATUS_PERSONAL = {
    'UNGTUYEN': [
        DEFINE_STATUS.NOPHOSOUNGTUYEN, DEFINE_STATUS.MOIPHONGVAN
    ],
    'DANHANVIEC': [DEFINE_STATUS.PHONGVANDAU],
    'TRUOCDO': [
        DEFINE_STATUS.PHONGVANKHONGDAU,
        DEFINE_STATUS.TUCHOIPHONGVAN
    ]
}

// Định nghĩa nhóm dữ liệu ở màn hình lịch sử tuyển dụng của doanh nghiệp
const STATUS_ENTERPRISE = {
    'HOSODANHAN': [DEFINE_STATUS.NOPHOSOUNGTUYEN],
    'MOIPHONGVAN': [
        DEFINE_STATUS.MOIPHONGVAN
    ],
    'HOANTATPHONGVAN': [DEFINE_STATUS.HOANTATPHONGVAN],
    'DATUCHOI': [
        DEFINE_STATUS.PHONGVANKHONGDAU,
        DEFINE_STATUS.TUCHOIPHONGVAN
    ],
    'TRUNGTUYEN': [DEFINE_STATUS.PHONGVANDAU]
}

// Định nghĩa Type API trả về trong data
// 1: là người lao động nộp hồ sơ đến doanh nghiệp
// 0: là doanh nghiệp chọn hồ sơ của người lao động
const DEFINE_TYPE = {
    'UNGVIENNOP_CV': 1,
    'NHATUYENDUNG_CHONCV': 0
}

//Điều kiện hiển thị ngày phỏng vấn
const CONDITION_SHOWDATE_INTERVIEW = [
    DEFINE_STATUS.MOIPHONGVAN,
    DEFINE_STATUS.HOANTATPHONGVAN,
    DEFINE_STATUS.PHONGVANDAU,
    DEFINE_STATUS.PHONGVANKHONGDAU
]

//Định nghĩa button xử lý
//Cá nhân:
// 	IsDaNopHoSo: 0 chưa nộp -> Hiện button nộp CV , 1 đã nộp -> ẩn nút nộp CV
// 	status=1 -> hiển thị nút từ chối phỏng vấn -> click vào cập nhật status=99
//Người lao động nộp CV
const BUTTON_PERSONAL = {
    'TUCHOIPHONGVAN': 1, // so sánh với Status
    'CHUANOPHOSO': 0, // so sánh IsDaNopHoSo
    'DANOPHOSO': 1 // so sánh IsDaNopHoSo
}

// Doanh nghiệp:
// 	status=0 -> hiển thị nút từ chối hồ sơ	-> click vào cập nhật status=99
// 		 -> nhập thông tin lịch phỏng vấn -> cập nhật status=1 và thông tin lịch phỏng vấn
// 	status=1 -> hiển thị nút hoàn tất phỏng vấn -> click vào cập nhật status=2
// 	status=2 -> hiển thị nút đậu phỏng vấn (cập nhật status=3) hoặc nút không đậu phỏng vấn (cập nhật status=4)
const BUTTON_ENTERPRISE = {
    'TUCHOIHOSO': 0, // so sánh với Status
    'NHAPLICHPHONGVAN': 0, // so sánh với Status
    'HOANTATPHONGVAN': 1, // so sánh với Status
    'DAUPHONGVAN': 2 // so sánh với Status
}

//Type danh sách thông báo
export const TYPE_LST_MAILBOX = {
    'VIECTIMNGUOI': 0, // người lao động
    'NGUOITIMVIEC': 1 // doanh nghiệp
}


//Định nghĩa màn hình chi tiết
export const DEFINE_SCREEN_DETAILS = {
    'TuyenDung_CaNhan': {
        'KeyScreen': 'TuyenDung_CaNhan', //Type: 0
        'IdScreen': 1,
        'Type': TYPE_LST_MAILBOX.VIECTIMNGUOI
    },
    'TuyenDung_DoanhNghiep': {
        'KeyScreen': 'TuyenDung_DoanhNghiep', //Type: 1
        'IdScreen': 2,
        'Type': TYPE_LST_MAILBOX.NGUOITIMVIEC
    },
    'DanhSach_TinTuyenDung': {
        'KeyScreen': 'DanhSach_TinTuyenDung', //Type: 0
        'IdScreen': 3,
        'Type': TYPE_LST_MAILBOX.VIECTIMNGUOI
    },
    'DanhSach_BaiDangDoanhNghiep': {
        'KeyScreen': 'DanhSach_BaiDangDoanhNghiep', //Type: 1
        'IdScreen': 4,
        'Type': TYPE_LST_MAILBOX.NGUOITIMVIEC
    },
    'DanhSach_CVDoanhNghiep': {
        'KeyScreen': 'DanhSach_CVDoanhNghiep', //Type: 1
        'IdScreen': 5,
        'Type': TYPE_LST_MAILBOX.NGUOITIMVIEC
    },
    'DanhSach_CVNguoiLaoDong': {
        'KeyScreen': 'DanhSach_CVNguoiLaoDong', //Type: 0
        'IdScreen': 6,
        'Type': TYPE_LST_MAILBOX.VIECTIMNGUOI
    }
}

//Kiểm tra key màn hình
export const CHECKED_SCREEN_DETAILS = (keyscreen = '') => {
    let flag = false
    for (const property in DEFINE_SCREEN_DETAILS) {
        if (DEFINE_SCREEN_DETAILS[property].KeyScreen == keyscreen)
            flag = true
    }
    return flag ? true : false
}

export default {
    STATUS_PERSONAL,
    STATUS_ENTERPRISE,
    DEFINE_TYPE, DEFINE_STATUS,
    CONDITION_SHOWDATE_INTERVIEW,
    BUTTON_PERSONAL,
    BUTTON_ENTERPRISE,
    ARRAY_VALUE_STATUS
}