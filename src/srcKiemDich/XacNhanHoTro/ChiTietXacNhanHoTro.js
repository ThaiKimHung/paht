import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import apis from '../../apis'
import { Images } from '../../images'

const ChiTietXacNhanHoTro = (props) => {
    const data = Utils.ngetParam({ props: props }, 'data', '')
    const callback = Utils.ngetParam({ props: props }, 'callback', () => { })

    const refLoading = useRef(null)

    const onConfirm = async () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn xác nhận hỗ trợ khó khăn.', 'Đồng ý', 'Xem lại', async () => {
            // refLoading.current.show()
            let listDot = []
            data?.DotTroCap.forEach(e => {
                if (e?.TinhTrang == 0) {
                    listDot.push(e?.IdDot)
                }
            });
            const body = {//thông tin Id, họ tên, sđt lấy từ thông tin tra cứu
                "Id": data?.Id || '',
                "FullName": data?.HoTen || '',
                "PhoneNumber": data?.SDT || '',
                "LstIdDotTroCap": listDot // lấy các Id có TinhTrang (lấy từ list DotTroCap khi tra cứu ra 1 hồ sơ) = 0
            }
            Utils.nlog('[LOG] body xac nhan', JSON.stringify(body))
            let res = await apis.ApiHCM.QuetQRCode_NhanHoTro(body)
            refLoading.current.hide()
            Utils.nlog('[LOG] res xac nhan ho tro', res)
            if (res.status == 1) {
                Utils.showMsgBoxOKTop('Thông báo', res?.error?.message ? res?.error?.message : `Xác nhận hỗ trợ ${data.HoTen} thành công`, 'Xác nhận', () => {
                    callback()
                    Utils.goback(this)
                })
            } else {
                Utils.showMsgBoxOKTop('Thông báo', res?.error?.message ? res?.error?.message : `Xác nhận hỗ trợ ${data.HoTen} thất bại`, 'Xác nhận')
            }
        })
    }

    const onClose = () => {
        callback()
        Utils.goback(this)
    }

    return (
        <View style={stChiTietXacNhanHoTro.cover}>
            <HeaderCus
                onPressLeft={() => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={`Xác nhận hỗ trợ khó khăn`}
                styleTitle={stChiTietXacNhanHoTro.titleHeader}
            />
            <View style={stChiTietXacNhanHoTro.body}>
                <KeyboardAwareScrollView style={{}} contentContainerStyle={{ paddingBottom: getBottomSpace() }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <TextLine title={'Họ và tên'} value={data?.HoTen ? data.HoTen : '-'} styleContainer={{ backgroundColor: colors.BackgroundHome }} />
                        <TextLine title={'CMND/CCCD/Hộ chiếu'} value={data?.CMND ? data?.CMND : '-'} styleContainer={{ backgroundColor: colors.BackgroundHome }} />
                        <TextLine title={'Địa chỉ'} value={data?.DiaChi ? data?.DiaChi : '-'} styleContainer={{ backgroundColor: colors.BackgroundHome }} />
                    </View>
                    <ThongTinCoBan data={data} stContainer={{ marginVertical: 10 }} />
                    <ThongTinKhoKhan data={data} />
                    <ThongTinXacNhan data={data?.DotTroCap || []} onPressDong={onClose} onPressXacNhan={onConfirm} stContainer={{ marginTop: 10, flex: 1 }} />
                </KeyboardAwareScrollView>
                <IsLoading ref={refLoading} />
            </View>
        </View>
    )
}

const ThongTinCoBan = (props) => {
    const { data, stContainer } = props
    const [toggle, setToggle] = useState(false)

    return (
        <View style={stContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => { setToggle(!toggle) }} style={{}}>
                <View style={{ flexDirection: 'row', paddingVertical: 13, paddingHorizontal: 10, backgroundColor: colors.white }}>
                    <Text style={{
                        alignSelf: 'center', flex: 1, fontSize: reText(14), fontWeight: '600', color: colors.black,
                    }}>{'Thông tin cơ bản'}</Text>
                    <Image source={Images.icOpenDetail} style={{ alignSelf: 'center', transform: [{ rotate: toggle ? '90deg' : '0deg' }] }} />
                </View>
            </TouchableOpacity>
            {
                toggle ?
                    <View style={{ paddingHorizontal: 10, backgroundColor: colors.white }}>
                        <TextLine title={'Họ và tên'} value={data?.HoTen ? data.HoTen : '-'} />
                        <TextLine title={'Giới tính'} value={data?.GioiTinh ? data?.GioiTinh : ''} />
                        <TextLine title={'CMND/CCCD/Hộ chiếu'} value={data?.CMND ? data?.CMND : '-'} />
                        <TextLine title={'Ngày cấp'} value={data?.NgayCapCMND ? data?.NgayCapCMND : '-'} />
                        <TextLine title={'Năm sinh'} value={data?.NamSinh ? data?.NamSinh : '-'} />
                        <TextLine title={'Số điện thoại'} value={data?.SDT ? data?.SDT : '-'} />
                        <TextLine title={'Bạn làm tại doanh nghiệp'} value={data?.DoanhNghiep ? data?.DoanhNghiep : '-'} />
                        <TextLine title={'STK - Chủ tài khoản - Tên ngân hàng'} value={data?.STK ? data?.STK : '-'} />
                        <TextLine title={'Số nhân khẩu'} value={data?.SoNhanKhau ? data?.SoNhanKhau : ''} />
                        <TextLine title={'Thuộc diện'} value={data?.ThuocDien ? data?.ThuocDien : '-'} />
                    </View>
                    : null
            }

        </View>
    )
}

const ThongTinKhoKhan = (props) => {
    const { data, stContainer } = props
    const [toggle, setToggle] = useState(false)

    return (
        <View style={stContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => { setToggle(!toggle) }} style={{}}>
                <View style={{ flexDirection: 'row', paddingVertical: 13, paddingHorizontal: 10, backgroundColor: colors.white }}>
                    <Text style={{
                        alignSelf: 'center', flex: 1, fontSize: reText(14), fontWeight: '600', color: colors.black,
                    }}>{'Bạn đang gặp khó khăn nào ?'}</Text>
                    <Image source={Images.icOpenDetail} style={{ alignSelf: 'center', transform: [{ rotate: toggle ? '90deg' : '0deg' }] }} />
                </View>
            </TouchableOpacity>
            {
                toggle ?
                    <View style={{ paddingHorizontal: 10, backgroundColor: colors.white }}>
                        <TextLine title={'Đối tượng hỗ trợ'} value={data?.DoiTuong ? data?.DoiTuong : '-'} />
                        <TextLine title={'Khó khăn'} value={data?.KhoKhanKhac ? data?.KhoKhanKhac : '-'} />
                    </View>
                    : null
            }
        </View>
    )
}

const ThongTinXacNhan = (props) => {
    const { data = [], stContainer, onPressXacNhan = () => { }, onPressDong = () => { } } = props
    const [toggle, setToggle] = useState(true)
    const [close, setClose] = useState(false)
    useEffect(() => {
        if (data && data.length > 0) {
            let check = data.find(e => e.TinhTrang == 0)
            if (check) {
                setClose(true)
            } else {
                setClose(false)
            }
        }
    }, [data])

    return (
        <View style={stContainer}>
            <TouchableOpacity disabled={true} activeOpacity={0.5} onPress={() => { setToggle(!toggle) }} style={{}}>
                <View style={{ flexDirection: 'row', paddingVertical: 13, paddingHorizontal: 10, backgroundColor: colors.white }}>
                    <Text style={{
                        alignSelf: 'center', flex: 1, fontSize: reText(14), fontWeight: '600', color: colors.black,
                    }}>{'Thông tin xác nhận hỗ trợ'}</Text>
                    {/* <Image source={Images.icOpenDetail} style={{ alignSelf: 'center', transform: [{ rotate: toggle ? '90deg' : '0deg' }] }} /> */}
                </View>
            </TouchableOpacity>
            <View style={{ backgroundColor: colors.white }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0081B21A' }}>
                    <Text style={{ padding: 10, width: '30%' }}>{'Công văn'}</Text>
                    <Text style={{ padding: 10, width: '15%', textAlign: 'center' }}>{'Đợt'}</Text>
                    <Text style={{ padding: 10, width: '30%' }}>{'Số tiền'}</Text>
                    <Text style={{ padding: 10, width: '25%' }}>{'Tình trạng'}</Text>
                </View>
                {data.map((item, index) => {
                    return (
                        <View key={`row` + index} style={{ paddingTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                                <Text style={{ padding: 10, width: '30%' }}>{item?.SoCongVan ? item?.SoCongVan : '-'}</Text>
                                <Text style={{ padding: 10, width: '15%', textAlign: 'center' }}>{item?.SoDot ? item?.SoDot : '-'}</Text>
                                <Text style={{ padding: 10, width: '30%', fontWeight: 'bold' }}>{item?.HoTro ? item?.HoTro : '-'}</Text>
                                <Text style={{ padding: 10, width: '25%', fontWeight: 'bold', color: item?.TinhTrang == 1 ? '#0081B2' : '#FFC519' }}>{item?.TinhTrang == 1 ? 'Đã nhận' : 'Chưa nhận'}</Text>
                            </View>
                            {/* {
                                index % 2 != 0 ?
                                    <TouchableOpacity onPress={() => onPressXacNhan(item)} style={{ backgroundColor: '#0081B2', paddingVertical: 7, paddingHorizontal: 15, alignSelf: 'center', borderRadius: 5, borderTopRightRadius: 0 }}>
                                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Xác nhận'}</Text>
                                    </TouchableOpacity>
                                    : null
                            } */}
                            <View style={{ marginHorizontal: 10, backgroundColor: index == 2 ? colors.nocolor : colors.grayLight, height: 1, marginTop: 10 }} />
                        </View>
                    )
                })}
                {close ?
                    <TouchableOpacity onPress={() => onPressXacNhan()} style={{ backgroundColor: '#0081B2', marginVertical: 10, paddingVertical: 7, paddingHorizontal: 15, alignSelf: 'center', borderRadius: 5, borderTopRightRadius: 0 }}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Xác nhận'}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => onPressDong()} style={{ backgroundColor: colors.grayLight, marginVertical: 10, paddingVertical: 7, paddingHorizontal: 25, alignSelf: 'center', borderRadius: 5, borderTopRightRadius: 0 }}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Đóng'}</Text>
                    </TouchableOpacity>
                }

            </View>
        </View>
    )
}

const TextLine = (props) => {
    let { title = '', value = '', styleValue, styleTitle, styleContainer } = props
    return (
        <View {...props} style={[{ backgroundColor: colors.white, alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }, styleContainer]}>
            <Text style={[{ fontWeight: '300', fontSize: reText(14), color: '#8F9294' }, styleTitle]}>{title} </Text>
            <Text style={[{ flex: 1, fontSize: reText(14), fontWeight: '400', textAlign: 'justify', marginTop: 5 }, styleValue]}>{value}</Text>
        </View>
    )
}

const stChiTietXacNhanHoTro = StyleSheet.create({
    cover: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    titleHeader: {
        color: colors.white, fontSize: reText(16)
    },
    body: { flex: 1, backgroundColor: colors.BackgroundHome }
})

export default ChiTietXacNhanHoTro
