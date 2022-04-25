import { StyleSheet } from "react-native"
import { store } from "../../../srcRedux/store"
import { colors } from "../../../styles"
import { reSize, reText } from "../../../styles/size"
import { Height, nstyles, paddingBotX, Width } from "../../../styles/styles"
import { Images } from "../../images"

const { colorLinear } = store.getState().theme

export const KeyTiem = {
    CHECKIN: 1,
    KQLAMSAN: 2,
    XACNHANTIEMCHUNG: 3,
    TRIEUCHUNG: 4
}

export const KeyComp = {
    HOTEN: {
        id: 1,
        label: 'Họ và tên',
        icon: Images.ic_hoten_hcm
    },
    SDT: {
        id: 2,
        label: 'Số điện thoại',
        icon: Images.ic_sdt_hcm
    },
    CMND: {
        id: 3,
        label: 'Số CMND/CCCD (nếu có)',
        icon: Images.ic_cmnd_hcm
    },
    NOITIEM: {
        id: 4,
        label: 'Nơi tiêm',
        icon: Images.icDiaDiemTiem
    },
    GHICHU: {
        id: 5,
        label: 'Ghi chú',
        icon: Images.ic_ghichu_hcm
    },
    TENVACCIN: {
        id: 6,
        label: 'Tên vaccine',
        icon: Images.ic_hcm_tenvaccin
    },
    LOVACCIN: {
        id: 7,
        label: 'Lô vaccine',
        icon: Images.ic_hcm_lovaccin
    },
    PHANUNGSAUTIEM: {
        id: 8,
        label: 'Phản ứng sau tiêm',
        icon: Images.ic_hcm_trieuchung
    },
    BUTTON_XACNHAN: {
        id: 9,
        label: 'Xác nhận',
        colorchange: [colors.colorHearder, colors.colorHearder]
    },
    BUTTON_KHONGDONGYTIEM: {
        id: 10,
        label: 'Không đồng ý tiêm',
        colorchange: ['#ffd35c', '#ffd35c'],
        action: 1  // Key bắn API
    },
    BUTTON_DUDIEUKIEN: {
        id: 11,
        label: 'Đủ điều kiện tiêm',
        colorchange: [colors.colorHearder, colors.colorHearder],
        action: 0  // Key bắn API
    },
    DROPDOWN_TENVACCIN: {
        id: 12,
        label: 'Tên - Lô Vaccine',
        icon: '',
        placeholder: 'Chọn tên - lô vacccine',
        keyView: 'Tenvaccine'
    },
    DROPDOWN_SOLOVACCIN: {
        id: 13,
        label: 'Số lô vaccine',
        icon: '',
        placeholder: 'Chọn số lô vaccine',
        keyView: ''
    },
    INPUT_GHICHU: {
        id: 14,
        label: 'Nội dung ghi chú',
        icon: '',
        placeholder: 'Nhập nội dung (nều có)',
        keyIndexSuggest: 'id',
        keyDisplaySuggest: 'ten'
    },
    INPUT_TRIEUCHUNG: {
        id: 15,
        label: 'Mô tả triệu chứng khác',
        icon: '',
        placeholder: 'Nhập mô tả (nều có)',
        keyIndexSuggest: 'id',
        keyDisplaySuggest: 'ten'
    },
    LIST_CHECK: {
        id: 16,
        label: 'Triệu chứng sau tiêm',
        keyIndex: 'Id',
        KeyDisplay: 'Title'
    },
    BUTTON_CHONGCHIDINH: {
        id: 17,
        label: 'Chóng chỉ định',
        colorchange: ['#F86363', '#F86363'],
        action: 2  // Key bắn API
    },
    BUTTON_HOANTIEM: {
        id: 18,
        label: 'Hoãn tiêm',
        colorchange: ['#F8A621', '#F8A621'],
        action: 3 // Key bắn API
    },
}

export const KeyUIDetailsHistory = {
    [KeyTiem.CHECKIN]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM],
    [KeyTiem.KQLAMSAN]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM, KeyComp.GHICHU],
    [KeyTiem.XACNHANTIEMCHUNG]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.TENVACCIN, KeyComp.LOVACCIN, KeyComp.NOITIEM],
    [KeyTiem.TRIEUCHUNG]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM, KeyComp.PHANUNGSAUTIEM],
}

export const KeyUIResultQR = {
    [KeyTiem.CHECKIN]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM, KeyComp.BUTTON_XACNHAN],
    [KeyTiem.KQLAMSAN]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM, KeyComp.INPUT_GHICHU, KeyComp.BUTTON_KHONGDONGYTIEM, KeyComp.BUTTON_CHONGCHIDINH, KeyComp.BUTTON_HOANTIEM, KeyComp.BUTTON_DUDIEUKIEN],
    [KeyTiem.XACNHANTIEMCHUNG]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.NOITIEM, KeyComp.DROPDOWN_TENVACCIN, KeyComp.BUTTON_XACNHAN],
    [KeyTiem.TRIEUCHUNG]: [KeyComp.HOTEN, KeyComp.SDT, KeyComp.CMND, KeyComp.TENVACCIN, KeyComp.LOVACCIN, KeyComp.NOITIEM, KeyComp.LIST_CHECK, KeyComp.INPUT_TRIEUCHUNG, KeyComp.BUTTON_XACNHAN],
}

export const stQuetMaTiem = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
    titleHeader: {
        color: colors.white, fontSize: reText(20)
    },
    Body: {
        flex: 1, backgroundColor: colors.black
    },
    Camera: {
        flex: 1
    },
    handleCamera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.nocolor
    },
    containerHandlerCamera: {
        marginTop: Height(20),
        alignSelf: 'center',
        backgroundColor: colorLinear.color[0],
        padding: 10,
        flexDirection: 'row', borderRadius: 3
    },
    textHandleCamera: {
        color: colors.white, fontSize: reText(14), paddingLeft: 5
    },
    FrameFocus: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.nocolor
    },
    titleFrameCamera: {
        backgroundColor: 'rgba(0,0,0,0.7)', marginBottom: Height(4), padding: Height(1)
    },
    txtFrameCamera_1: {
        color: colors.white, fontWeight: 'bold', fontSize: reText(16), textAlign: 'center'
    },
    txtFrameCamera_2: {
        color: colors.white, fontSize: reText(12), textAlign: 'justify', lineHeight: 18
    },
    handlingCamera: {
        width: reSize(200), height: reSize(200)
    },
    btnFlash: {
        marginTop: Height(4), marginBottom: Height(1),
        flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center'
    },
    containFlash: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    iconFlash: {
        ...nstyles.nIcon20,
        tintColor: 'white'
    },
    titleFlash: {
        fontSize: reText(16), color: colors.white
    },
    viewBottom: {
        borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'rgba(0,0,0,0.7)', flex: 1
    },
    btnExpand: {
        paddingTop: 10, alignSelf: 'center', paddingHorizontal: 50
    },
    iconExpand: {
        ...nstyles.nIcon20,
        tintColor: 'white'
    },
    headerViewBottom: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10
    },
    txtDoiKhuVuc: {
        fontSize: reText(14), fontWeight: 'bold', color: colorLinear.color[0]
    },
    txtTatCa: {
        fontSize: reText(14), textAlign: 'right', fontWeight: 'bold', color: colorLinear.color[0]
    },
    headerListHistory: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10
    },
    iconHistory: {
        ...nstyles.nIcon14,
        tintColor: 'white'
    },
    txtHistory: {
        color: colors.white, textAlign: 'center', fontStyle: 'italic', paddingLeft: 5, fontSize: reText(12)
    },
    inputCode: {
        backgroundColor: colorLinear.color[0], padding: 5, borderRadius: 5, paddingHorizontal: 10
    }
})

export const stChiTietLichSuTiem = StyleSheet.create({
    cover: { flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' },
    animated: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)' },
    viewgrow: { flexGrow: 1 },
    viewTranparent: { flex: 1, backgroundColor: colors.nocolor },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    btnBack: { padding: 10, alignSelf: 'flex-start' },
    txtHeader: { color: colors.colorHearder, fontSize: reText(16), fontWeight: 'bold', alignSelf: 'center', textAlign: 'center' },
    btnClose: {
        marginTop: Height(1), borderRadius: 5,
        alignSelf: 'center', paddingHorizontal: 20,
        width: Width(40),
    },
    coverComp: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, marginTop: 20 },
    viewContainComp: { flex: 1, paddingLeft: 10, borderBottomWidth: 0.5, borderBottomColor: colors.black_30 },
    labelComp: { color: colors.black_30, paddingRight: 10 },
    txtValueComp: { color: colors.black_50, textAlign: 'justify', marginVertical: 10, paddingRight: 10 },
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: paddingBotX,
        minHeight: Height(90),
        maxHeight: Height(95)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})