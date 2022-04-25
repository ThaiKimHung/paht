import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar, Animated } from 'react-native';
import Utils from '../../../../../app/Utils';
import ImageCus from '../../../../../components/ImageCus';
import { colorsSVL, colors } from '../../../../../styles/color';
import { reSize, reText } from '../../../../../styles/size';
import { nstyles } from '../../../../../styles/styles';
import HeaderSVL from '../../../components/HeaderSVL';
import ButtonSVL from '../../../components/ButtonSVL';
import { ImagesSVL } from '../../../images';
import TextApp from '../../../../../components/TextApp';
import { CapNhapTinTuyenDung, TaoTinTuyenDung } from '../../../apis/apiSVL';
import { LoadListEmployment, SetDataEmployment, SetDataTinTuyenDung, SetPageEmployment, SetRefreshingEmployment } from '../../../../../srcRedux/actions/sanvieclam/DataSVL';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { store } from '../../../../../srcRedux/store';
import { StatusLoaiDoanhNghiepId } from '../../ViecTimNguoi/components/StatusDangTin';
import { StatusHinhThucLamViecId } from '../../HoSo/components/StatusCv';
import { initialStateDataSVL } from '../../../../../srcRedux/reducers/DataSVL';
import { Images } from '../../../../images';
import { Transition, Transitioning } from 'react-native-reanimated';
import GroupContent from '../../../components/GroupContent';
import TextLine from '../../../../../components/TextLine';
import { IsLoading } from '../../../../../components';
import ImagePickerNew from '../../../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import { ImgComp } from '../../../../../components/ImagesComponent';

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={150} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={150} />
    </Transition.Together>
)

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

const XemTruoc = (props) => {
    const ItemTinTuyenDung = useSelector(state => state.dataSVL.ItemTinTuyenDung)
    const animation = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    Utils.nlog('gia tri item', ItemTinTuyenDung)
    const IsEdit = Utils.getGlobal('IsEditTinTuyenDung');
    const IsSaoLuu = Utils.getGlobal('SaoLuu');
    const [showMoTa, setShowMoTa] = useState(true);
    const [showYeuCau, setShowYeuCau] = useState(true);
    const [showThongTin, setShowThongTinw] = useState(true);
    const isNhaTuyenDung = Utils.ngetParam({ props }, 'isNhaTuyenDung', false);
    // đã nộp hồ sơ hay chưa
    const isSubmittHS = Utils.ngetParam({ props }, 'isSubmittHS', false);
    const [submitt, setSubmitt] = useState(!isSubmittHS);
    // tuyển dụng
    const isSubmittTD = Utils.ngetParam({ props }, 'isSubmittTD', false);
    const [submittTD, setSubmittTD] = useState(!isSubmittTD);
    // xem trước hay chi tiết
    const type = Utils.ngetParam({ props }, 'type', 1)
    //data và id được truyền vào
    const [Data, setData] = useState(type === 2 ? {} : {})
    const dataTuyenDung = useSelector(state => state.dataSVL.Data_TinTuyenDung)
    Utils.nlog('gia tri data tuyen dung', dataTuyenDung)
    const refView = useRef(null)

    const nopHoSo = () => {
        Utils.goscreen({ props }, 'Modal_ChonHoSo');
    }



    const onRefresh = () => {
        dispatch(SetPageEmployment({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingEmployment(true))
        dispatch(SetDataEmployment([]))
        dispatch(LoadListEmployment())
    }

    const GetId = (index = '') => {
        let date = new Date();
        let id = moment(date).format(`hh_mm_ss_dd_mm_yyyy_Ava${index}.png`);
        return id;
    }

    const onPressGroup = () => {
        refView?.current.animateNextTransition();
    }

    const LoadFileDichKem = async (data, loaifile = 1, formdata = new FormData()) => { // 1 giấy phép kinh doanh
        for (let index = 0; index < data?.length; index++) {
            const item = data[index];
            Utils.nlog('gia tri item', item)
            let file = `File${loaifile != 1 ? 'DinhKem' : ''}${index == 0 ? '' : index}`; // file đích kèm dạng FileDichKem1,FileDichKem2
            if (item.type == 3) {//loại file
                item?.uriPath ? (loaifile === 1 ? formdata.append("GiayPhepKinhDoanh", item?.uriPath) : null) : formdata.append(loaifile === 1 ? 'GiayPhepKinhDoanh' : file,
                    {
                        name: item?.name ? item?.name.replace(/ /g, '') : Utils.replaceAll(item?.filename, "/", "").replace(/ /g, ''),
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        uri: item.fileCopyUri ? item.fileCopyUri : item.uri,
                    });
            }
            else {
                item?.uriPath ? (loaifile === 1 ? formdata.append("GiayPhepKinhDoanh", item?.uriPath) : null) : formdata.append(loaifile === 1 ? 'GiayPhepKinhDoanh' : file, {
                    name: GetId(index),
                    type: "image/png",
                    uri: item.uri
                })
            }
        }
    }

    const XulyFileDinhKem = (formdata = new FormData()) => {
        let strFile = "";
        for (let index = 0; index < dataTuyenDung[1]?.FileDinhKem.length; index++) {
            const item = dataTuyenDung[1].FileDinhKem[index];
            strFile += (item?.uriPath ? (strFile.length != 0 ? ";" : "") + item?.uriPath : "");
        }
        strFile.length === 0 ? null : formdata.append("StrListFileDinhKems", strFile)
    }

    const On_Save = async (IsShare = false) => {
        Utils.setToggleLoading(true)
        let address1 = dataTuyenDung[1].addWork?.IDQuanHuyen ? dataTuyenDung[1].addWork?.IDQuanHuyen : 0;
        let address2 = dataTuyenDung[1].addWork?.IdTinh ? dataTuyenDung[1].addWork?.IdTinh : 0
        var formdata = new FormData()
        formdata.append("TieuDe", dataTuyenDung[2].NoiDung);
        formdata.append("DiaChi", dataTuyenDung[1].DiaChi);
        formdata.append("NoiDung", '');
        formdata.append("IdChucVu", dataTuyenDung[0].Chucvu ? dataTuyenDung[0].Chucvu?.Id : 0);
        formdata.append("GioiTinh", 1);
        formdata.append("IdMucLuong", dataTuyenDung[2].Luong ? dataTuyenDung[2].Luong?.Id : 0);
        formdata.append("IdPhuongXa", -1);
        formdata.append("IdQuanHuyen", address1);
        formdata.append("IdTinhThanh", address2);
        formdata.append("IdNganhNghe", dataTuyenDung[0].career?.Id ? dataTuyenDung[0].career?.Id : 0);
        formdata.append("IdKinhNghiem", 0);
        formdata.append("YeuCauCongViec", dataTuyenDung[3].YeuCauCongViec);
        formdata.append("IdTrinhDoTinHoc", 0);
        formdata.append("IdTrinhDoVanHoa", 0);
        formdata.append("TypeTinTuyenDung", StatusHinhThucLamViecId(dataTuyenDung[0]?.TypeTinTuyenDung));
        formdata.append("IdNgoaiNguChiTiet", 0);
        formdata.append("IsHienThi", IsShare);
        formdata.append("HanNopHoSo", dataTuyenDung[2]?.HanNopHoSo);
        formdata.append("TypePerson", dataTuyenDung[0]?.TypePerson ? dataTuyenDung[0]?.TypePerson.value : -1);
        formdata.append("IdDoTuoi", 0);
        Utils.nlog('gia tri avtar', dataTuyenDung[1].Avata)
        !dataTuyenDung[1].Avata?.checkFrist || IsSaoLuu ? formdata.append("Avata", { // IsSaoLuu bắt cho trường hợp đã kiểm duyệt
            name: GetId(),
            type: "image/png",
            uri: dataTuyenDung[1].Avata.img[0].uri || dataTuyenDung[1].Avata.img,
        }) : null;
        formdata.append("MoTaCongViec", dataTuyenDung[3]?.MoTaCongViec);
        formdata.append("TenNguoiLH", dataTuyenDung[1]?.TenNguoiLH);
        formdata.append("PhoneNumberLH", dataTuyenDung[1]?.PhoneNumberLH);
        formdata.append("SoLuongTuyenDung", dataTuyenDung[2].SoLuongTuyenDung ? dataTuyenDung[2].SoLuongTuyenDung : 0);
        formdata.append("TypeDoanhNghiep", StatusLoaiDoanhNghiepId(dataTuyenDung[0].TypeDoanhNghiep));
        formdata.append("TenDoanhNghiepLH", dataTuyenDung[1].TenDoanhNghiepLH)
        formdata.append("EmailLH", dataTuyenDung[1].EmailLH)
        formdata.append("ChucVuKhac", dataTuyenDung[0]?.ChucVuKhac ? dataTuyenDung[0]?.ChucVuKhac : '')
        formdata.append("NganhNgheKhac", dataTuyenDung[0]?.NganhNgheKhac ? dataTuyenDung[0]?.NganhNgheKhac : '')
        formdata.append("MucLuongFrom", dataTuyenDung[2].MucLuongFrom ? parseInt(Utils.replaceAll(dataTuyenDung[2].MucLuongFrom + '', '.', '')) : 0)
        formdata.append("MucLuongTo", dataTuyenDung[2].MucLuongTo ? parseInt(Utils.replaceAll(dataTuyenDung[2].MucLuongTo + '', '.', '')) : 0)
        IsEdit ? formdata.append("Id", dataTuyenDung[0].Id) : null
        IsEdit || IsSaoLuu ? XulyFileDinhKem(formdata) : null
        LoadFileDichKem(dataTuyenDung[1].GiayPhepKinhDoanh, 1, formdata) // giấy phép kinh doanh
        LoadFileDichKem(dataTuyenDung[1].FileDinhKem, 2, formdata) // file dính kèm
        Utils.nlog('form data', formdata)
        let res = IsEdit ? await CapNhapTinTuyenDung(formdata) : await TaoTinTuyenDung(formdata)
        if (res.status === 1) {
            Utils.setToggleLoading(false);
            if (IsEdit)
                Utils.setGlobal('IsEditTinTuyenDung', false)
            Utils.goscreen({ props }, 'Modal_ThongBao',
                {
                    title: ItemTinTuyenDung ? "Chúc mừng bạn sửa tin tuyển dụng thành công" : "Chúc mừng bạn đã tạo thông tin tuyển dụng thành công!",
                    titleButton: 'Tiếp theo',
                    onThaoTac: () => {
                        store.dispatch(SetDataTinTuyenDung(initialStateDataSVL.Data_TinTuyenDung));
                        Utils.goscreen({ props }, 'scHomeDangTin');
                    }
                })
            onRefresh();
        }
        else {
            Utils.nlog('gia tri res fail', res)
            Utils.setToggleLoading(false);
            Utils.showMsgBoxOK({ props: props }, 'Thông báo', ItemTinTuyenDung ? 'Sửa tin thất bại' : 'Đăng tin thất bại')
        }
    }

    const OnNext = async () => {
        Utils.goscreen({ props }, 'Modal_Save', {
            txtTitle: 'Tạo tin tuyển dụng',
            txtQuestion: 'Bạn có muốn tạo tin tuyển dụng ?',
            btnTextLeft: 'Đóng',
            btnTextCenter: 'Lưu tạm',
            btnTextRight: 'Đăng tin',
            type: !IsEdit ? 1 : 0,
            onPressCenter: () => {
                On_Save()
            },
            onPressRight: () => {
                On_Save(true)
            }
        })
    }

    let address1 = dataTuyenDung[1].addWork?.TenQuanHuyen ? dataTuyenDung[1].addWork?.TenQuanHuyen != '-- Tất cả --' ? dataTuyenDung[1].addWork?.TenQuanHuyen : '' : '';
    let address2 = dataTuyenDung[1].addWork?.TenTinhThanh ? dataTuyenDung[1].addWork?.TenTinhThanh != '-- Tất cả --' ? dataTuyenDung[1].addWork?.TenTinhThanh : '' : ''

    return (
        <View style={[nstyles.ncontainer, { paddingBottom: getBottomSpace() / 2 }]}>
            <StatusBar barStyle={'dark-content'} />
            <HeaderSVL
                title={`    ${type == 2 ? "Xem trước" : "Chi tiết"}`}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={() => Utils.goback({ props: props })}
                titleRight={ItemTinTuyenDung ? 'Sửa tin' : 'Tạo tin'}
                Sleft={{ width: reSize(75) }}
                iconRight={isNhaTuyenDung || type == 2 ? undefined : ImagesSVL.icStar}
                styleTitleRight={{ width: reSize(75) }}
                onPressRight={OnNext}
                Sright={{
                    tintColor: Data?.IsLike ? colorsSVL.organeMainSVL : undefined,
                    color: Data?.IsLike && type == 1 ? colorsSVL.organeMainSVL : undefined, fontSize: reText(14), width: reSize(75)
                }}
                SrightIcon={[nstyles.nIcon16, { marginRight: 5 }]}
            />
            <Transitioning.View
                ref={refView}
                transition={transition}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                    <View style={stCTTuyenDung.containerView}>
                        {/* logo và vị trí và tên công ty ứng tuyển */}
                        <View style={{ flexDirection: 'row' }}>
                            <ImageCus source={{ uri: dataTuyenDung[1].Avata?.checkFrist ? dataTuyenDung[1].Avata?.img : dataTuyenDung[1].Avata?.img[0].uri }}
                                defaultSourceCus={Images.imgViettelTuyenDung}
                                style={stCTTuyenDung.contLeft}
                                resizeMode='cover'
                                borderRadius={5}
                            />
                            <View style={stCTTuyenDung.contRight}>
                                <TextApp style={stCTTuyenDung.txtTitle}>
                                    {type === 1 ? Data?.TieuDe : dataTuyenDung[2]?.NoiDung}
                                </TextApp>
                                <TextApp style={stCTTuyenDung.txtCompany}>
                                    {type === 1 ? Data?.TenDoanhNghiep : dataTuyenDung[1]?.TenDoanhNghiepLH}
                                </TextApp>
                            </View>
                        </View>
                        {/* Đia điểm */}
                        <View style={{ paddingVertical: 15, flexDirection: 'row' }}>
                            <ImageCus source={ImagesSVL.icLocation} style={[nstyles.nIcon18, { marginRight: 5 }]} resizeMode='contain' />
                            <TouchableOpacity style={{ paddingRight: 12 }}>
                                <TextApp style={stCTTuyenDung.txtLocal}>{type === 1 ? Data?.DiaChi : dataTuyenDung[1]?.DiaChi + ', ' +
                                    address1 + ', ' + address2}</TextApp>
                            </TouchableOpacity>
                        </View>
                        {/* Thời hạn và lượt xem */}
                        {
                            submitt ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ImageCus source={ImagesSVL.icCalendar} style={[nstyles.nIcon18, { marginRight: 5 }]} resizeMode='contain' />
                                        {/* Hạn nộp hồ sơ */}
                                        <TextApp style={stCTTuyenDung.txtView}>
                                            {'Hạn nộp hồ sơ:'}   {type === 1 ? Data?.HanNopHoSo : moment(dataTuyenDung[2].HanNopHoSo).format('DD/MM/YYYY')}
                                        </TextApp>
                                    </View>
                                    {
                                        type == 2 ? null :
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <ImageCus source={ImagesSVL.icEye} style={[nstyles.nIcon18, { marginRight: 5 }]} resizeMode='contain' />
                                                {/* lượt xem */}
                                                <TextApp style={stCTTuyenDung.txtView}>
                                                    {'Lượt xem:'} {Data?.LuotXem}
                                                </TextApp>
                                            </View>
                                    }
                                </View> :
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <View style={stCTTuyenDung.contTypeWork}>
                                        <TextApp numberOfLines={1} style={stCTTuyenDung.txtDateInterview}>
                                            Phỏng vấn: {Data?.dateInterview || '09:00 ngày 12/1/2022'}
                                        </TextApp>
                                    </View>
                                </View>
                        }
                    </View>
                    <View style={{ padding: 10, backgroundColor: colorsSVL.white, marginVertical: 5 }} >
                        {/* giấy phép kinh doanh */}
                        <Text style={{ color: colors.orange }} >Giấy phép kinh doanh :{dataTuyenDung[1].GiayPhepKinhDoanh?.length > 0 ? '' : ' Đang cập nhật'}</Text>
                        <ImagePickerNew
                            datamenuCus={dataMenu}
                            styleContainer={{ padding: 0 }}
                            data={dataTuyenDung[1].GiayPhepKinhDoanh ? dataTuyenDung[1].GiayPhepKinhDoanh : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            NumberMax={1}
                            isEdit={false}
                        />
                    </View>
                    <View style={{ padding: 10, backgroundColor: colorsSVL.white }} >
                        {/* file đính kèm */}
                        <Text style={{ color: colors.orange }} >File đính kèm :{dataTuyenDung[1].FileDinhKem?.length > 0 ? '' : ' Đang cập nhật'}</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            datamenuCus={dataMenu}
                            data={dataTuyenDung[1].FileDinhKem ? dataTuyenDung[1].FileDinhKem : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            NumberMax={1}
                            isEdit={false}
                        />
                    </View>
                    {
                        submitt ? null :
                            <View style={stCTTuyenDung.containerSubmit}>
                                <TextApp style={stCTTuyenDung.txtSubmit}>{'Đã nộp hồ sơ'}</TextApp>
                            </View>
                    }

                    {/* Lương */}
                    <View>
                        <View style={[stCTTuyenDung.containerView, stCTTuyenDung.contRow]}>
                            <View style={stCTTuyenDung.lineTab}>
                                <TextApp style={stCTTuyenDung.txtTab}>{'Lương'}</TextApp>
                            </View>
                            <TextApp style={stCTTuyenDung.txtSalary}>
                                {dataTuyenDung[2].Luong?.MucLuong != '--Không chọn--' ? dataTuyenDung[2].Luong?.MucLuong : (dataTuyenDung[2]?.MucLuongFrom + '-' + dataTuyenDung[2]?.MucLuongTo)}
                            </TextApp>
                        </View>
                    </View>
                    <View style={[stCTTuyenDung.containerView]}>
                        {type === 2 && <Text style={{ marginBottom: 10 }} >Loại hình: {dataTuyenDung[0].TypeDoanhNghiep}</Text>}
                        {type === 2 && <Text style={{ marginBottom: 10 }}>Số lao động: {dataTuyenDung[2].SoLuongTuyenDung}</Text>}
                        {type === 2 && <Text style={{ marginBottom: 10 }}>Ngành nghề: {dataTuyenDung[0].career?.LoaiNganhNghe && dataTuyenDung[0].career?.LoaiNganhNghe != '--Không chọn--' ? dataTuyenDung[0].career?.LoaiNganhNghe : (dataTuyenDung[0]?.NganhNgheKhac ? dataTuyenDung[0]?.NganhNgheKhac : 'Đang cập nhật')}</Text>}
                        {type === 2 && <Text style={{ marginBottom: 10 }}>Chức danh: {dataTuyenDung[0].Chucvu?.ChucVu && dataTuyenDung[0].Chucvu?.ChucVu != '--Không chọn--' ? dataTuyenDung[0].Chucvu?.ChucVu : (dataTuyenDung[0]?.ChucVuKhac ? dataTuyenDung[0].ChucVuKhac : 'Đang cập nhật')}</Text>}
                        {type === 2 && <Text style={{ marginBottom: 10 }}>Loại hình lao động: {dataTuyenDung[0].TypePerson ? dataTuyenDung[0].TypePerson.title : 'Đang cập nhật'}</Text>}
                    </View>
                    {/* Mô tả công việc */}
                    <GroupContent
                        title={'Mô tả công việc'}
                        style={{ marginTop: 2, backgroundColor: colorsSVL.white }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            {dataTuyenDung[3].MoTaCongViec ? dataTuyenDung[3].MoTaCongViec?.split('\n').map((item, index) => {
                                return (
                                    <View key={index} style={{ marginTop: 10 }} >
                                        <Text>{item}</Text>
                                    </View>
                                )
                            }) : <Text style={{ marginHorizontal: 10, marginVertical: 5 }} >- Đang cập nhật</Text>}
                        </View>
                    </GroupContent>
                    {/* Yêu cầu công việc */}
                    <GroupContent
                        title={'Yêu cầu công việc'}
                        style={{ marginTop: 2, backgroundColor: colorsSVL.white }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            {dataTuyenDung[3].YeuCauCongViec ? dataTuyenDung[3].YeuCauCongViec?.split('\n').map((item, index) => {
                                return (
                                    <View key={index} style={{ marginTop: 10 }} >
                                        <Text>{item}</Text>
                                    </View>
                                )
                            })
                                : <Text style={{ marginHorizontal: 10, marginVertical: 5 }} >- Đang cập nhật</Text>}
                        </View>
                    </GroupContent>
                    {/* Thông tin liên hệ */}
                    <GroupContent
                        title={'Thông tin liên hệ'}
                        style={{ marginTop: 2, backgroundColor: colorsSVL.white }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'Họ và tên'}
                                value={dataTuyenDung[1]?.TenNguoiLH || 'Đang cập nhật'}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'Số điện thoại'}
                                value={dataTuyenDung[1]?.PhoneNumberLH || "Đang cập nhật"}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'Địa chỉ'}
                                value={dataTuyenDung[1]?.DiaChi || "Đang cập nhật"}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                        </View>
                    </GroupContent>
                </ScrollView>
            </Transitioning.View>
            {/* button nộp hồ sơ */}
            {
                submittTD && !isNhaTuyenDung &&
                <ButtonSVL
                    onPress={nopHoSo}
                    text={'Nộp hồ sơ'}
                    colorText={colorsSVL.white}
                    style={{ marginHorizontal: 12, marginVertical: 10, borderRadius: 18 }}
                />
            }
            <IsLoading />
        </View >
    )
}

const stCTTuyenDung = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colorsSVL.white,
    },
    viewGroup: { paddingHorizontal: 13, backgroundColor: colorsSVL.white, marginBottom: 15 },
    textInfo: { fontWeight: 'normal', color: colorsSVL.grayText, paddingVertical: 5 },
    containerView: {
        padding: 12,
        backgroundColor: colorsSVL.white,
        marginTop: 5
    },
    containerSubmit: {
        backgroundColor: colorsSVL.organeMainSVL,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 12,
        marginVertical: 8
    },
    contLeft: {
        ...nstyles.nIcon65
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    txtTitle: {
        fontSize: reText(15), textAlign: 'justify', fontWeight: 'bold', color: '#333333'
    },
    txtCompany: {
        fontSize: reText(13), color: colorsSVL.grayText, paddingVertical: 5
    },
    txtLocal: {
        fontSize: reText(13), color: colorsSVL.blueMainSVL
    },
    lineTab: {
        paddingLeft: 8, borderLeftWidth: 3, borderColor: colorsSVL.blueMainSVL
    },
    txtTab: {
        fontSize: reText(18), fontWeight: 'bold', color: '#333333'
    },
    txtSalary: {
        fontSize: reText(18), fontWeight: 'bold', color: colorsSVL.organeMainSVL
    },
    txtShare: {
        fontSize: reText(16), fontWeight: 'bold', color: colorsSVL.blueMainSVL
    },
    txtDescription: {
        fontSize: reText(16), textAlign: 'justify', paddingTop: 10
    },
    txtView: {
        fontSize: reText(14), color: colorsSVL.grayText
    },
    txtLeft: {
        textAlign: 'left', fontSize: reText(14), color: colorsSVL.grayText
    },
    txtRight: {
        flex: 1, textAlign: 'right', fontSize: reText(14), fontWeight: 'bold', color: '#333333'
    },
    txtDateInterview: {
        fontSize: reText(11), color: colorsSVL.blueMainSVL,
    },
    txtSubmit: {
        fontSize: reText(16), color: colorsSVL.white, fontWeight: 'bold',
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    contTypeWork: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0', borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' }
})

export default XemTruoc