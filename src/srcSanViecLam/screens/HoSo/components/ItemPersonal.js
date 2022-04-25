import moment from 'moment';
import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { appConfig } from '../../../../../app/Config';
import Utils from '../../../../../app/Utils';
import ImageCus from '../../../../../components/ImageCus';
import TextApp from '../../../../../components/TextApp';
import { colorsSVL } from '../../../../../styles/color';
import FontSize from '../../../../../styles/FontSize';
import { reText } from '../../../../../styles/size';
import { nstyles } from '../../../../../styles/styles';
import { ImagesSVL } from '../../../images';


export class ItemPersonal extends Component {
    constructor(props) {
        super(props);

    }

    TypeThoiGian = (key) => {
        switch (key) {
            case 0:
                return 'Toàn thời gian'
            case 1:
                return 'Bán thời gian'
            default:
                return 'Đang cập nhật'
        }
    }

    TypeCV = (key) => {
        switch (key) {
            case 0:
                return 'Sinh viên, học sinh'
            case 1:
                return 'Người lao động'
            default:
                return 'Đang cập nhật'
        }
    }

    TypeHoanChinh = (key) => {
        switch (key) {
            case true:
                return 'Hoàn chỉnh'
            case false:
                return 'Chưa hoàn chỉnh'
            default:
                break;
        }
    }

    Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }

    render() {
        // name,
        let { item, index = 0, isChoose, onPressSave, isNhaTuyenDung = false, isDetails = false, onChoose, isKiemDuyet } = this.props
        let thoiGian = this.TypeThoiGian(item?.TypeCV)
        let typeCV = this.TypeCV(item?.TypePerson)
        let hoanChinh = item?.IsFinish ? null : this.TypeHoanChinh(item?.IsFinish)
        let DiaChi = item?.TenQuanHuyen || item?.TenTinhThanh ? `${item?.TenQuanHuyen ? item?.TenQuanHuyen + ', ' : ''}${item?.TenTinhThanh}` : ''
        const thumbnailUrl = item?.Avata ? appConfig.domain + item?.Avata : ''
        const yearOld = item?.NgaySinh ? moment().diff(moment(item?.NgaySinh, 'DD/MM/YYYY'), 'years') : ''
        return (
            <TouchableOpacity
                disabled={!onChoose}
                key={index.toString()}
                onPress={() => {
                    onChoose(item)
                }}
                style={[stItemPersonal.stViewItem]}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        isChoose ? <View style={[stItemPersonal.stViewImageItemCheck]}>
                            <ImageCus
                                defaultSourceCus={item?.isChoose ? ImagesSVL.icCheck : ImagesSVL.icUnCheck}
                                style={[nstyles.nIcon20, { marginRight: 10 }]}
                                resizeMode='contain'
                            />
                        </View> : null
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <ImageCus
                            defaultSourceCus={ImagesSVL.icUser1}
                            // defaultSourceLoading={ImagesSVL.icUser1}
                            source={{ uri: thumbnailUrl }}
                            style={[isDetails ? nstyles.nAva120 : nstyles.nAva60]} // 1 là bình thường 2 là của chi tiết cv
                            resizeMode='cover'
                        />
                        <View style={{ ...stItemPersonal.stViewInfoItem, flex: 1, paddingRight: 10 }}>
                            <View style={stItemPersonal.rowContent}>
                                <TextApp style={[stItemPersonal.stTextSP]}>{item?.HoTen}</TextApp>
                                {isNhaTuyenDung && onPressSave && <TouchableOpacity activeOpacity={0.5} onPress={onPressSave} style={{ padding: 5 }}>
                                    <Image source={ImagesSVL.icStar} resizeMode='contain' style={{ ...nstyles.nIcon16, tintColor: item?.IsLike ? colorsSVL.organeMainSVL : undefined }} />
                                </TouchableOpacity>}
                            </View>
                            {
                                isNhaTuyenDung && <View style={stItemPersonal.rowContent}>
                                    <TextApp numberOfLines={2} style={[stItemPersonal.stTextBS, { flex: 1 }]}>Giới tính: {item?.GioiTinh == 0 ? 'Nam' : 'Nữ'}</TextApp>
                                    <TextApp numberOfLines={2} style={[stItemPersonal.stTextBS, { flex: 1.5 }]}>Tuổi: {yearOld || 'Đang cập nhật'} </TextApp>
                                </View>
                            }
                            <TextApp numberOfLines={2} style={[stItemPersonal.stTextBS]}>Nghành nghề: {item?.LoaiNganhNghe || item?.NganhNghe || item?.NganhNgheKhac || item?.NganhNgheShow}</TextApp>
                            {
                                item?.MucLuong != '' ?
                                    <><TextApp numberOfLines={2} style={[stItemPersonal.stTextSPC]}>{'Lương:'} {item?.MucLuong || this.Conver_MucLuong(item?.MucLuongMongMuonFrom ? item?.MucLuongMongMuonFrom : 0) + '-' + this.Conver_MucLuong(item?.MucLuongMongMuonTo ? item?.MucLuongMongMuonTo : 0) || 'Đang cập nhật'}</TextApp></> : null
                            }
                            <TextApp numberOfLines={2} style={[stItemPersonal.stTextBS]}>Khu vực: {DiaChi ? DiaChi : 'Đang cập nhật'}</TextApp>
                            <TextApp numberOfLines={2} style={[stItemPersonal.stTextBS]}>Loại hồ sơ: {typeCV}</TextApp>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                    <View
                                        style={[stItemPersonal.stViewBS1]}>
                                        <TextApp style={[stItemPersonal.stTextBS1]}>{thoiGian}</TextApp>
                                    </View>
                                    {
                                        !item?.IsPublic || isNhaTuyenDung ? null :
                                            <View
                                                style={[stItemPersonal.stViewBS2]}>
                                                <TextApp style={[stItemPersonal.stTextBS2]}>Hồ sơ công khai</TextApp>
                                            </View>
                                    }
                                </View>
                            </View>
                            {isDetails && <View>
                                <TextApp numberOfLines={2} style={[stItemPersonal.stTextSPC]}>{hoanChinh}</TextApp>
                            </View>}
                        </View>
                        <View style={{ justifyContent: 'space-between' }}>
                            {!isDetails && <View>
                                <TextApp numberOfLines={2} style={[stItemPersonal.stTextSPC]}>{hoanChinh || (isKiemDuyet && item?.StatusKD === 0 ? "Chưa kiểm duyệt" : "Đã kiểm duyệt")}</TextApp>
                            </View>}
                            {/* {isKiemDuyet ? <TextApp style={{ color: colorsSVL.blueMainSVL, fontSize: reText(12), fontWeight: 'bold' }} >{item?.StatusKD === 0 ? "Chưa kiểm duyệt" : "Đã kiểm duyệt"}</TextApp> : null} */}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const stItemPersonal = StyleSheet.create({
    stViewItem: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: colorsSVL.white,
        marginBottom: 5
    },
    stViewImageItemCheck: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 5
    },
    stViewImageItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    stViewInfoItem: {
        marginLeft: 10, justifyContent: 'flex-start', alignItems: 'flex-start'
    },
    stTextSP: {
        fontSize: reText(16), fontWeight: 'bold', flex: 1, alignSelf: 'flex-start'
    },
    stTextBS: {
        fontSize: reText(12), marginTop: 5,
    },
    stViewBS1: {
        paddingVertical: 3, paddingHorizontal: 10,
        backgroundColor: colorsSVL.grayBgrInput,
        borderRadius: 17, alignItems: 'center', justifyContent: 'center'
    },
    stTextBS1: {
        fontSize: reText(12), color: colorsSVL.grayTextLight
    },
    stViewBS2: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 17,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colorsSVL.organeMainSVL, borderWidth: 1

    },
    stTextBS2: {
        fontSize: reText(12), color: colorsSVL.organeMainSVL
    },
    stTextSPC: {
        fontSize: reText(12), marginTop: 5, color: colorsSVL.organeMainSVL, fontWeight: 'bold'
    },
    rowContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
})

export default ItemPersonal
