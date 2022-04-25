import React from 'react'
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Utils from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import { nstyles, nwidth, Width } from '../../../../../styles/styles'
import ButtonSVL from '../../../components/ButtonSVL'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import HeaderTitle from '../components/HeaderTitle'
import { CreateNewCV, UpdateCV } from '../../../apis/apiSVL'
import moment from 'moment'
import axios from 'axios'
import { store } from '../../../../../srcRedux/store'
import { LoadListCvUser, LoadListCvUserPublic, SetCV_Default, SetDataCvUser, SetRefreshingCvUser } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { initialStateDataSVL } from '../../../../../srcRedux/reducers/DataSVL'
import { StatusHinhThucLamViecId, StatusNguoiLaoDongId } from '../components/StatusCv'
import UploadCmndCus from '../components/UploadCmndCus'
import ImagePickerNew from '../../../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import { ImgComp } from '../../../../../components/ImagesComponent'

const dataMenu = [
    {
        id: 1,
        name: 'Photo',
        icon: ImgComp.icChoseImage
    },
    {
        id: 3,
        name: 'File',
        icon: ImgComp.icChoseFile
    }
]

const data = [
    {
        title: 'Tổng quan',
        dataItem: [
            {
                title: 'Loại hồ sơ'
            },
            {
                title: 'Hình thước làm việc'
            },
            {
                title: 'Ngành nghề'
            },
            {
                title: 'Kinh nghiệm'
            },
            {
                title: 'Vị trí mong muốn'
            },
            {
                title: 'Khu vực làm việc'
            },
            {
                title: 'Công khai hồ sơ xin việc'
            },
        ]
    },
    {
        title: 'Thông tin ứng viên',
        dataItem: [
            {
                title: 'Ngày sinh'
            },
            {
                title: 'Giới tính'
            },
            {
                title: 'Số điện thoại'
            },
            {
                title: 'Địa chỉ'
            },
            {
                title: 'Email'
            },
        ]
    },
    {
        title: 'Học vấn',
    },
    {
        title: 'Kinh nghiệm',
    },
    {
        title: 'Lương',
        dataItem: [
            {
                title: 'Mức lương'
            },
        ]
    },
    {
        title: 'Kỹ năng',
    },
    {
        title: 'Thời gian làm việc',
    },
    {
        title: 'Mong muốn khác',
    },
]

const InfoResult = (props) => {
    const dataCV = useSelector(state => state.dataSVL.Data_CV)
    Utils.nlog('gia tri data cv', dataCV)
    const IsEditCv = Utils.getGlobal('IsEditCv');
    const IsSaoLuu = Utils.getGlobal('SaoLuu');
    let addressWork1 = dataCV[0].addressWork ? dataCV[0].addressWork['TenQuanHuyen'] != '-- Tất cả --' ? dataCV[0].addressWork['TenQuanHuyen'] : 'Đang cập nhật' : 'Đang cập nhật';
    let addressWork2 = dataCV[0].addressWork ? dataCV[0].addressWork['TenTinhThanh'] != '-- Tất cả --' ? dataCV[0].addressWork['TenTinhThanh'] : 'Đang cập nhật' : 'Đang cập nhật';
    const Get_Value = (item) => {
        switch (item) {
            case 'Loại hồ sơ':
                return dataCV[0].TypePerson;
            case 'Hình thước làm việc':
                return dataCV[0].TypeCV;
            case 'Ngành nghề':
                return dataCV[0].career ? (dataCV[0].career['LoaiNganhNghe'] == '--Không chọn--' ? dataCV[0]?.NganhNgheKhac : dataCV[0].career['LoaiNganhNghe']) : 'Đang cập nhật';
            case 'Kinh nghiệm':
                return dataCV[0].experience ? dataCV[0].experience['KinhNghiem'] : 'Đang cập nhật';
            case 'Vị trí mong muốn':
                return dataCV[0]?.position ? (dataCV[0].position['ChucVu'] == '--Không chọn--' ? dataCV[0].ChucVuKhac : dataCV[0].position['ChucVu']) : 'Đang cập nhật';
            case 'Khu vực làm việc':
                return addressWork1 + ' - ' + addressWork2
            // thông tin ứng viên
            case 'Ngày sinh':
                return dataCV[1].Birthday ? moment(dataCV[1].Birthday).format('DD/MM/YYYY') : 'Đang cập nhật';
            case 'Giới tính':
                return dataCV[1].Gender;
            case 'Số điện thoại':
                return dataCV[1].Phone ? dataCV[1].Phone : 'Đang cập nhật';
            case 'Địa chỉ':
                return dataCV[1].Address ? dataCV[1].Address : 'Đang cập nhật';
            case 'Email':
                return dataCV[1].Email ? dataCV[1]?.Email : 'Đang cập nhật';
            // lương
            case 'Mức lương':
                return dataCV[4].Wage ? dataCV[4]?.Wage['MucLuong'] === '--Không chọn--' ? (dataCV[4]?.MucLuongFrom + '-' + dataCV[4]?.MucLuongTo) : dataCV[4]?.Wage['MucLuong'] : 'Đang cập nhật';
            default:
                break;
        }
    }

    const onRefresh = () => {
        store.dispatch(SetRefreshingCvUser(true));
        store.dispatch(SetDataCvUser([]));
        store.dispatch(LoadListCvUser());
    }

    const GetId = (strFile = 'Avatar') => {
        let date = new Date();
        let id = moment(date).format(`hh_mm_ss_dd_mm_yyyy_${strFile}.png`);
        return id;
    }

    const LoadFileDichKem = async (data, loaifile = 1, formdata = new FormData()) => { // 1 giấy gioi thiệu
        for (let index = 0; index < data?.length; index++) {
            const item = data[index];
            Utils.nlog('gia tri item', item)
            let file = `File${loaifile != 1 ? 'DinhKem' : ''}${index == 0 ? '' : index}`; // file đích kèm dạng FileDichKem1,FileDichKem2
            if (item.type == 3) {//loại file
                item?.uriPath ? null : formdata.append(loaifile === 1 ? 'GiayGioiThieuFile' : file,
                    {
                        name: item?.name ? item?.name : Utils.replaceAll(item?.filename, "/", ""),
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        uri: item.fileCopyUri ? item.fileCopyUri : item.uri,
                    });
            }
            else {
                item?.uriPath ? null : formdata.append(loaifile === 1 ? 'GiayGioiThieuFile' : file, {
                    name: GetId(index),
                    type: "image/png",
                    uri: item.uri,
                })
            }
        }
    }

    const LoadGiayGioiThieuEdit = async (data, formdata = new FormData()) => { // 1 giấy gioi thiệu
        for (let index = 0; index < data?.length; index++) {
            const item = data[index];
            Utils.nlog('gia tri item', item)
            if (item.type == 3) {//loại file
                formdata.append(item?.uriPath ? "GiayGioiThieu" : 'GiayGioiThieuFile', item?.uriPath ? item?.uriPath :
                    {
                        name: item?.name ? item?.name.replace(/ /g, '') : Utils.replaceAll(item?.filename, "/", "").replace(/ /g, ''),
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        uri: item.fileCopyUri ? item.fileCopyUri : item.uri,
                    });
            }
            else {
                formdata.append(item?.uriPath ? "GiayGioiThieu" : 'GiayGioiThieuFile', item?.uriPath ? item?.uriPath : {
                    name: GetId(index),
                    type: "image/png",
                    uri: item.uri,
                })
            }
        }
    }

    const XulyFileDinhKem = (formdata = new FormData()) => {
        let strFile = "";
        for (let index = 0; index < dataCV[1]?.FileDinhKem.length; index++) {
            const item = dataCV[1].FileDinhKem[index];
            strFile += (item?.uriPath ? (strFile.length != 0 ? ";" : "") + item?.uriPath : "");
        }
        strFile.length === 0 ? null : formdata.append("StrListFileDinhKems", strFile)
    }
    const crreateCvLoading = async (isHoSo = false, isEdit = false) => {
        try {
            Utils.setToggleLoading(true)
            let addressWork1 = dataCV[0].addressWork ? dataCV[0].addressWork['IDQuanHuyen'] : 0;
            let addressWork2 = dataCV[0].addressWork ? dataCV[0].addressWork['IdTinh'] : 0;
            let dataChiTietHocVan = []
            for (let index = 0; index < dataCV[2].dataEducation?.length; index++) {
                const element = dataCV[2].dataEducation[index];
                dataChiTietHocVan.push({
                    IsHienTaiDangHoc: element.check,
                    LoaiTotNghiep: element.item[5].value,
                    NganhHoc: element.item[4].value,
                    TenTruongHoc: element.item[2].value,
                    TuNam: element.item[0].value,
                    DenNam: element.item[1].value,
                    IdTrinhDoDaoTao: element.item[3].value ? element.item[3].value['Id'] : '',
                })
            }
            Utils.nlog('gia tri data chi tiet hoc van', dataChiTietHocVan)
            var formdata = new FormData()
            IsEditCv ? formdata.append("IdCV", dataCV[0]?.IdCV ? dataCV[0]?.IdCV : 0) : null
            formdata.append("HoTen", dataCV[1]?.Name)
            formdata.append("NgaySinh", dataCV[1]?.Birthday ? dataCV[1].Birthday : moment(new Date).format('YYYY/MM/DD'))
            formdata.append("GioiTinh", dataCV[1]?.Gender === 'Nam' ? 0 : 1)
            formdata.append("DiaChi", dataCV[1]?.Address ? dataCV[1].Address : '')
            formdata.append("IdTinhThanh", addressWork2)
            formdata.append("IdQuanHuyen", addressWork1)
            formdata.append("IdPhuongXa", 0)
            formdata.append("IdNganhNghe", dataCV[0]?.career ? dataCV[0].career['Id'] : 0)
            formdata.append("IdNgoaiNguChiTiet", 0)
            formdata.append("IdTrinhDoTinHoc", 0)
            formdata.append("IdTrinhDoVanHoa", dataCV[2].AcademicLevel ? dataCV[2].AcademicLevel['Id'] : 0)
            formdata.append("IdTonGiao", 0)
            formdata.append("IdDanToc", 0)
            formdata.append("IdChucVu", dataCV[0]?.position ? dataCV[0].position['Id'] : 0)
            formdata.append("IdMucLuong", dataCV[4]?.Wage ? dataCV[4]?.Wage['Id'] : 0)
            dataCV[4].WorkTStatus ? formdata.append("IsDiLamNgay", dataCV[4].WorkTStatus) : null
            formdata.append("MoTaKinhNghiem", dataCV[3].Experience)
            formdata.append("MoTaKyNang", dataCV[3].Skill)
            dataCV[4].WorkTime ? formdata.append("NgayBatDauLamViec", dataCV[4].WorkTime) : null
            formdata.append("Email", dataCV[1].Email)
            formdata.append("PhoneNumber", dataCV[1].Phone)
            formdata.append("GhiChu", dataCV[4].Desire)
            formdata.append("TypeCV", StatusHinhThucLamViecId(dataCV[0].TypeCV))
            formdata.append("TypePerson", StatusNguoiLaoDongId(dataCV[0].TypePerson))
            formdata.append("IsPublic", isHoSo)
            formdata.append("IsFinish", isHoSo)
            formdata.append("IdKinhNghiem", dataCV[0].experience ? dataCV[0].experience['Id'] : 0)
            formdata.append("ChiTietHocVanJson", JSON.stringify(dataChiTietHocVan))
            dataCV[0]?.ChucVuKhac ? formdata.append("ChucVuKhac", dataCV[0].ChucVuKhac) : null
            formdata.append("NganhNgheKhac", dataCV[0]?.NganhNgheKhac ? dataCV[0].NganhNgheKhac : '')
            formdata.append("MucLuongMongMuonFrom", dataCV[4].MucLuongFrom ? parseInt(Utils.replaceAll(dataCV[4].MucLuongFrom + '', '.', '')) : 0)
            formdata.append("MucLuongMongMuonTo", dataCV[4].MucLuongTo ? parseInt(Utils.replaceAll(dataCV[4].MucLuongTo + '', '.', '')) : 0)
            !dataCV[1]?.Avatar?.uriPath || IsSaoLuu ? formdata.append("Avata", {
                name: GetId(),
                type: "image/png",
                uri: dataCV[1]?.Avatar?.img[0].uri || dataCV[1]?.Avatar?.img,
            }) : null
            dataCV[1]?.CMND_MatTruoc?.uriPath && !IsSaoLuu ? null : formdata.append("CMND_MatTruoc", {
                name: GetId("CMND_MatTruoc"),
                type: "image/png",
                uri: dataCV[1]?.CMND_MatTruoc?.uri,
            })
            dataCV[1]?.CMND_MatSau?.uriPath && !IsSaoLuu ? null : formdata.append("CMND_MatSau", { // trường hợp có rồi k gọi tiếp
                name: GetId("CMND_MatSau"),
                type: "image/png",
                uri: dataCV[1]?.CMND_MatSau?.uri,
            })
            !IsEditCv ? LoadFileDichKem(dataCV[1].GiayGioiThieu, 1, formdata) : LoadGiayGioiThieuEdit(dataCV[1].GiayGioiThieu, formdata); // giấy giới thiệu
            IsEditCv ? XulyFileDinhKem(formdata) : null;
            LoadFileDichKem(dataCV[1].FileDinhKem, 2, formdata)   // file đích kèm
            let res = IsEditCv ? await UpdateCV(formdata) : await CreateNewCV(formdata);
            Utils.setToggleLoading(false)
            Utils.nlog('gia tri data form', formdata)
            Utils.nlog('gia tri res', res)
            // Utils.nlog('gia tri edit', IsEditCv)
            if (res.status === 1 && IsEditCv) { // khi api succes thì tắt update
                Utils.setGlobal('IsEditCv', false)
            }
            if (res.status != 1) {
                Utils.setToggleLoading(false)
                Utils.showMsgBoxOK({ props: props }, 'Thông báo', IsEditCv ? 'Sửa hồ sơ không thành công' :
                    'Tạo cv không thành công', 'OK', () => {
                        store.dispatch(LoadListCvUserPublic())
                        Utils.navigate('Sc_InfoResult');
                    })
                return;
            }
            Utils.goscreen({ props: props }, 'Modal_ThongBao',
                {
                    title: IsEditCv ? "Chúc mừng bạn sửa hồ sơ thành công" : "Chúc mừng bạn đã tạo hồ sơ thành công!!!.",
                    titleButton: 'Tiếp theo',
                    onThaoTac: () => {
                        Utils.goscreen({ props }, 'scHoSoCaNhan');
                        onRefresh();
                        store.dispatch(SetCV_Default(initialStateDataSVL.Data_CV)) // xóa item hồ sơ được sửa
                        store.dispatch(LoadListCvUserPublic())
                    }
                })
        } catch (error) {
            Utils.setToggleLoading(false)
        }
    }

    const CreatCVSuccess = async (isHoSo = false, isEdit = false) => {
        crreateCvLoading(isHoSo, isEdit);
    }

    const on_IsHoSo = async (type) => { // khi không chọn công khai 
        Utils.nlog('gia tri edit', IsEditCv)
        if (type === 1) {
            IsEditCv ? await CreatCVSuccess(false, true) : await CreatCVSuccess(false)
        }
        else {
            IsEditCv ? await CreatCVSuccess(true, true) : await CreatCVSuccess(true)
        }
    }

    const on_Next = async () => {
        if (dataCV[0].isShareCv) { // khi chọn công khai  -> thành hoàn chỉnh hồ sơ
            IsEditCv ? await CreatCVSuccess(true, true) : await CreatCVSuccess(true)
            return;
        }
        Utils.goscreen({ props }, 'Modal_Save', {
            txtTitle: 'Tạo hồ sơ cv',
            txtQuestion: 'Bạn có muốn tạo cv tuyển dụng ?',
            btnTextLeft: 'Đóng',
            btnTextCenter: 'Lưu tạm',
            btnTextRight: 'Đăng hồ sơ cv',
            type: !IsEditCv ? 1 : 0,
            onPressCenter: async () => {
                IsEditCv ? await CreatCVSuccess(false, true) : await CreatCVSuccess(false)
            },
            onPressRight: async () => {
                IsEditCv ? await CreatCVSuccess(true, true) : await CreatCVSuccess(true)
            }
        })
    }

    const getDataCmnd = () => {
        let dataCmnd = [];
        dataCmnd.push(
            {
                ...dataCV[1].CMND_MatTruoc
            },
            {
                ...dataCV[1].CMND_MatSau
            },
        )
        Utils.nlog('gia tri data cmnd', dataCmnd)
        return dataCmnd;
    }
    return (
        <View style={stInfoResult.container}>
            <HeaderSVL
                title={"Xem trước hồ sơ"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={() => Utils.goback({ props: props })}
                titleRight={IsEditCv ? 'Sửa hồ sơ' : 'Tạo hồ sơ'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: colorsSVL.grayTextLight, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={on_Next}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor: colors.whitegay, marginTop: 10, flex: 1
                }}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: colorsSVL.white,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    alignItems: 'center'
                }}>
                    <View >
                        <ImageCus
                            source={{ uri: dataCV[1].Avatar?.checkFrist ? dataCV[1].Avatar?.img : dataCV[1].Avatar?.img[0].uri }}
                            defaultSourceCus={ImagesSVL.icUser1}
                            defaultSourceLoading={ImagesSVL.icUser1}
                            style={[nstyles.nAva120]}
                            resizeMode='cover' />
                    </View>
                    <View style={{ paddingTop: 2, flex: 1, paddingLeft: 10 }}>
                        <TextApp style={[stInfoResult.titleInfo, stInfoResult.bold, { fontSize: reText(15) }]}>{dataCV[1]?.Name}</TextApp>
                        <TextApp style={stInfoResult.titleInfo} >{'Ngành nghề: '}
                            <TextApp>
                                {dataCV[0].career ? dataCV[0].career['LoaiNganhNghe'] : 'Đang cập nhật'}
                            </TextApp>
                        </TextApp>
                        <TextApp style={[stInfoResult.titleInfo, stInfoResult.bold, { color: colorsSVL.organeMainSVL }]}>
                            {'Lương: '}
                            <TextApp>
                                {dataCV[4].Wage ? dataCV[4].Wage['MucLuong'] === '--Không chọn--' ? (dataCV[4]?.MucLuongFrom + '-' + dataCV[4]?.MucLuongTo) : dataCV[4].Wage['MucLuong'] : 'Đang cập nhật'}
                            </TextApp>
                        </TextApp>
                        <TextApp style={stInfoResult.titleInfo} >{'Vị trí: '}<TextApp>{dataCV[0].position ? dataCV[0].position['ChucVu'] : 'Đang cập nhật'}</TextApp></TextApp>
                        <TextApp style={stInfoResult.titleInfo} >{'Loại hồ sơ: '}<TextApp>{dataCV[0].TypePerson}</TextApp></TextApp>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={stInfoResult.vWorkTime}>
                                <TextApp style={[stInfoResult.bold, { fontSize: reText(14), color: colors.colorGrayText }]} >
                                    {dataCV[0]?.TypeCV}</TextApp>
                            </View>
                            <View style={{ paddingHorizontal: 10 }} />
                            {dataCV[0]?.isShareCv &&
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: colorsSVL.organeMainSVL,
                                    borderRadius: 17, paddingVertical: 3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1
                                }} >
                                    <TextApp style={{ fontSize: reText(14), color: colorsSVL.organeMainSVL }} >
                                        {'Hồ sơ công khai'}</TextApp>
                                </View>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'white' }}>
                    <Text>Chứng minh nhân dân :</Text>
                    <ImagePickerNew
                        styleContainer={{ padding: 0 }}
                        data={getDataCmnd()}
                        dataNew={[]}
                        nthis={{ props: props }}
                        keyname={"TenFile"} uniqueKey={'uri'}
                        isEdit={false}
                    />
                </View>
                <View style={{ height: 5, backgroundColor: colors.whitegay }} />
                <View style={{ backgroundColor: colorsSVL.white, padding: 10 }}>
                    <Text  >Giấy phép kinh doanh :{dataCV[1].GiayGioiThieu?.length > 0 ? '' : ' Đang cập nhật'}</Text>
                    <ImagePickerNew
                        styleContainer={{ padding: 0 }}
                        datamenuCus={dataMenu}
                        data={dataCV[1].GiayGioiThieu ? dataCV[1].GiayGioiThieu : []}
                        dataNew={[]}
                        nthis={{ props: props }}
                        keyname={"TenFile"} uniqueKey={'uri'}
                        NumberMax={1}
                        isEdit={false}
                    />
                </View>
                <View style={{ height: 5, backgroundColor: colors.whitegay }} />
                <View style={{ backgroundColor: colorsSVL.white, padding: 10 }}>
                    <Text style={{ marginTop: 10 }} >File đính kèm :{dataCV[1].FileDinhKem?.length > 0 ? '' : ' Đang cập nhật'}</Text>
                    <ImagePickerNew
                        styleContainer={{ padding: 0 }}
                        datamenuCus={dataMenu}
                        data={dataCV[1].FileDinhKem ? dataCV[1].FileDinhKem : []}
                        dataNew={[]}
                        nthis={{ props: props }}
                        keyname={"TenFile"} uniqueKey={'uri'}
                        NumberMax={1}
                        isEdit={false}
                    />
                </View>
                {/* info hồ sơ cv */}
                <View style={{
                    backgroundColor: colors.whitegay, marginTop: 5, flex: 1,
                }} >
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={{
                                marginBottom: 5, backgroundColor: colorsSVL.white,
                                paddingTop: 10, paddingHorizontal: 15,
                            }} >
                                <HeaderTitle text={item.title} />
                                {item?.dataItem &&
                                    <View style={{ marginTop: 15, paddingHorizontal: 10 }} >
                                        {item?.dataItem?.map((item, indexsub) => {
                                            return (
                                                <View key={indexsub} style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                    marginBottom: indexsub === 6 ? 0 : 13
                                                }}>
                                                    {index === 0 && indexsub === 6 ?
                                                        <ImageCus source={dataCV[0].isShareCv ? ImagesSVL.icSwtichOn :
                                                            ImagesSVL.icSwitchOff}
                                                            style={[nstyles.nIcon38, { marginRight: 10 }]}
                                                            resizeMode='contain'
                                                        />
                                                        : <Text>{'• '}</Text>
                                                    }
                                                    <TextApp style={stInfoResult.titleSub} >{item.title + ': '}
                                                        <TextApp>{Get_Value(item.title)}</TextApp></TextApp>
                                                </View>
                                            )
                                        })}
                                    </View>
                                }
                                {
                                    item.title === 'Học vấn' &&
                                    <View>
                                        <View style={{ paddingHorizontal: 10, marginTop: 5 }} >
                                            {dataCV[2].AcademicLevel ?
                                                <View key={index} style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                    marginBottom: 10
                                                }} >
                                                    <View style={stInfoResult.circle} />
                                                    <TextApp style={stInfoResult.titleSub} >Trình độ học vấn: {dataCV[2].AcademicLevel ? dataCV[2].AcademicLevel['TrinhDoVanHoa'] : ''}</TextApp>
                                                </View> : <Text style={[stInfoResult.titleSub, { marginVertical: 10 }]}>Tìrnh độ học vấn: Đang cập nhật</Text>
                                            }
                                            {dataCV[2].dataEducation && dataCV[2].dataEducation.map((i, index) => {
                                                return (
                                                    <View key={index} style={{ borderLeftWidth: 4, borderLeftColor: colorsSVL.grayTextLight, paddingHorizontal: 10, marginBottom: 10 }}  >
                                                        {i.item[0].value || i.item[1].value ?
                                                            <View style={{ flexDirection: 'row', marginBottom: 5 }} >
                                                                <TextApp>Từ Năm: {i.item[0].value ? i.item[0].value === 0 ? 'Đang cập nhật' : i.item[0].value : 'Đang cập nhật'}<TextApp> - </TextApp></TextApp>
                                                                <TextApp>Đến Năm: {i.item[1].value ? i.item[1].value === 0 ? 'Đang cập nhật' : i.item[0].value : 'Đang cập nhật'}</TextApp>
                                                            </View> : <View>
                                                                <Text style={[stInfoResult.titleSub, { marginBottom: 5 }]} >Năm học: Đang cập nhật</Text>
                                                            </View>
                                                        }
                                                        {i.item[2].value ?
                                                            <TextApp style={{ marginBottom: 5 }} >Trường lớp: {i.item[2].value}</TextApp> : <Text style={[stInfoResult.titleSub, { marginBottom: 5 }]}  >Trường lớp: Đang cập nhật</Text>
                                                        }
                                                        {i.item[3].value ?
                                                            <TextApp style={{ marginBottom: 5 }} >Trình độ đào tạo: {i.item[3].value['TrinhDoVanHoa']}</TextApp> : <Text style={[stInfoResult.titleSub, { marginBottom: 5 }]}>Trình độ đào tạo: Đang cập nhật</Text>
                                                        }
                                                        {i.item[4].value ?
                                                            <TextApp style={{ marginBottom: 5 }} >Ngành học: {i.item[4].value}</TextApp> : <Text style={[stInfoResult.titleSub, { marginBottom: 5 }]}>Ngành học:  Đang cập nhật</Text>
                                                        }
                                                        {i.item[5].value ?
                                                            <TextApp style={{ marginBottom: 5 }} >Loại tốt nghiệp: {i.item[5].value}</TextApp> : <Text style={[stInfoResult.titleSub, { marginBottom: 5 }]}>Loại tốt nghiệp: Đang cập nhật</Text>
                                                        }
                                                    </View>
                                                )
                                            })
                                            }
                                        </View>
                                    </View>
                                }
                                {
                                    item.title === 'Kinh nghiệm' &&
                                    <View style={{ paddingTop: 5 }} >
                                        {dataCV[3]?.Experience ? dataCV[3]?.Experience?.split('\n')?.map((item, index) => {
                                            return (
                                                <View key={index} style={stInfoResult.wAddTitle} >
                                                    <TextApp style={[stInfoResult.titleSub, { textAlign: 'justify' }]} >{item}</TextApp>
                                                </View>
                                            )
                                        }) : <Text style={[stInfoResult.titleSub, { marginHorizontal: 15, marginVertical: 10 }]} >Đang cập nhật</Text>}
                                    </View>
                                }
                                {
                                    item.title === 'Kỹ năng' &&
                                    <View style={{ paddingTop: 5 }} >
                                        {dataCV[3]?.Skill ? dataCV[3]?.Skill?.split('\n')?.map((item, index) => {
                                            return (
                                                <View key={index} style={stInfoResult.wAddTitle} >
                                                    <TextApp style={[stInfoResult.titleSub, { textAlign: 'justify' }]}   >{item}</TextApp>
                                                </View>
                                            )
                                        }) : <Text style={[stInfoResult.titleSub, { marginHorizontal: 15, marginVertical: 10 }]} >Đang cập nhật</Text>}
                                    </View>
                                }
                                {
                                    item.title === 'Thời gian làm việc' &&
                                    <View style={{ paddingVertical: 10, paddingHorizontal: 10 }} >
                                        {dataCV[4].WorkTStatus === true ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} >
                                                <Text>{'• '}</Text>
                                                <TextApp style={stInfoResult.titleSub}  >{'Có thể làm việc ngay'}</TextApp>
                                            </View>
                                            :
                                            dataCV[4].WorkTime ? <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }} >
                                                <View style={stInfoResult.circle} />
                                                <TextApp style={stInfoResult.titleSub} >{'Ngày bắt đầu: '}
                                                    <TextApp>
                                                        {dataCV[4].WorkTime ? moment(dataCV[4].WorkTime).format('DD/MM/YYYY') : 'Đang cập nhật'}
                                                    </TextApp>
                                                </TextApp>
                                            </View> : <Text style={[stInfoResult.titleSub, { marginHorizontal: 5 }]}  >Đang cập nhật</Text>
                                        }
                                    </View>
                                }
                                {item.title === 'Mong muốn khác' &&
                                    <View style={{ paddingTop: 5, paddingHorizontal: 5 }} >
                                        {dataCV[4]?.Desire ? dataCV[4]?.Desire?.split('\n')?.map((item, index) => {
                                            return (
                                                <View key={index} style={stInfoResult.wAddTitle} >
                                                    <TextApp style={[stInfoResult.titleSub]}  >{item}</TextApp>
                                                </View>
                                            )
                                        }) : <Text style={[stInfoResult.titleSub, { marginHorizontal: 5, marginVertical: 10 }]} >Đang cập nhật</Text>}
                                    </View>
                                }
                            </View>
                        )
                    })}
                </View>
            </ScrollView >
        </View >
    )
}

export default InfoResult

const stInfoResult = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    titleSub2: {
        fontSize: reText(14),
        marginBottom: 10,
    },
    titleSub: {
        fontSize: reText(14),
    },
    vWorkTime: {
        // marginRight: 5,
        backgroundColor: '#F1F1F1',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2, flex: 1
    },
    wAddTitle: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    titleInfo: {
        marginBottom: 8,
        fontSize: reText(14),
        // fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    circle: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: colors.black,
        marginRight: 8
    }
})
