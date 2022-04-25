import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { nstyles, colors, sizes } from '../../../../styles';
import styles from '../styles';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import moment from 'moment';
import { reText } from '../../../../styles/size';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import HtmlViewCom from '../../../../components/HtmlView';
import { ConfigScreenDH } from '../../../routers/screen';
import AppCodeConfig from '../../../../app/AppCodeConfig';
import { check } from 'react-native-permissions';
import { appConfig } from '../../../../app/Config';

class ItemDanhSach extends Component {
    constructor(props) {
        super(props);
        // this.nthisItemDanhSach = nthisApp;
        this.MangMau = Utils.getGlobal(nGlobalKeys.MangMau, '', AppCodeConfig.APP_ADMIN)
        this.IsTinhTrangXL = Utils.getGlobal(nGlobalKeys.IsTinhTrangXL, "", AppCodeConfig.APP_ADMIN)
        this.state = {
            // height: 40
        };
    }
    _onTuongTu = () => {
        this.props.goTuongTu();
    }
    _chiTietPhanAnh = () => {
        this.props.goscreen();
    }
    onClickFlag = (item) => {

        Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_TTDonViPhuTrach, { item: item })
    }

    _onShare = () => {
        this.props.goShare();
    }

    render() {
        const { nrow } = nstyles.nstyles;
        const { item, NameNGY, ThoiGian, type = 0, isNoCheck = false, onPressNoCheck = () => { }, IsDaXyLy, isCheckTinhTrang } = this.props;
        let isQuaHan = false;
        try {
            // isQuaHan = item.HanXuLy != '' && moment(new Date()).diff(moment(item.HanXuLy, 'DD/MM/YYYY'), 'days') > 0 ? true : false;
            isQuaHan = item.TreHen > 0 ? true : false;
        } catch (error) {

        }
        let textQuaHan = isQuaHan ? <Text style={{ color: 'red' }}> (Quá hạn)</Text> : null;
        var colorMucDo = colors.peacockBlue;
        if (item.MucDo) {
            if (item.MucDo == 3)
                colorMucDo = colors.redStar;
            if (item.MucDo == 2)
                colorMucDo = colors.orangeFive;
        }
        let MauMaPA = colors.peacockBlue
        if (this.MangMau) {
            if (item.TreHen > 0) {
                MauMaPA = this.MangMau.QuaHan
            } else {
                if (item.Status == 6) {
                    MauMaPA = this.MangMau.DangTai
                } else {
                    MauMaPA = this.MangMau.BinhThuong
                }
            }
        }

        return (
            <TouchableOpacity style={[{
                backgroundColor: colors.white, padding: 10, borderRadius: 5, elevation: 6,
                shadowOffset: {
                    width: 1,
                    height: 1
                },
                shadowRadius: 2,
                shadowOpacity: 0.4,
                shadowColor: colors.black_50
            }]} onPress={this._chiTietPhanAnh}>
                {(!item.IsSeen && type == 1) ? <View style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderWidth: 10,
                    borderColor: 'transparent',
                    borderTopColor: 'red',
                    alignSelf: 'flex-end',
                    transform: [{ rotate: '-135deg' }],
                    marginTop: -10,
                    right: -10,
                }} /> : null}
                <View style={[nrow, { justifyContent: 'space-between' }]}>
                    <Text style={[styles.txt14, { fontWeight: 'bold' }]}>{NameNGY ? item[`${NameNGY}`] : item.TenNguoiGopY}</Text>
                    <Text style={[styles.txt14, { fontWeight: 'bold' }]}>{item.PhoneNumber}</Text>
                </View>
                {item.DiaDiem ? <View style={[nrow, { alignItems: 'center', paddingTop: 2, paddingRight: 2 }]}>
                    <Image source={Images.icLocation} style={[nstyles.nstyles.nIcon14, { tintColor: colors.colorBlueLight }]} resizeMode="contain" />
                    <Text style={[styles.txt12, { color: colors.colorBlueLight, marginLeft: 3, flex: 1 }]}>{item.DiaDiem}</Text>
                </View> : null}
                <View style={{ height: Platform.OS == 'ios' ? 55 : 62 }}>
                    {/* <WebViewCus
                        style={{ marginLeft: -3 }}
                        scrollEnabled={false}
                        source={{ html: item.NoiDung }}
                        fontSize={Platform.isPad ? reText(13) : reText(28)}
                    /> */}
                    <HtmlViewCom
                        html={item.NoiDung}
                        style={{ height: '100%' }}
                    />
                </View>
                <View style={[nrow, { justifyContent: 'space-between', marginTop: 14 }]}>
                    {/* <Text style={[styles.txt12, { fontWeight: 'bold', color: colors.peacockBlue }]}>{item.MaPhanAnh}</Text> */}
                    <View style={[nrow, { alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={[styles.txt12, { fontWeight: 'bold', color: MauMaPA }]}>{item.MaPhanAnh}</Text>
                        {
                            appConfig.IdSource == "CA" ?
                                <View style={{ marginHorizontal: 5, marginLeft: 10 }}>
                                    {[0, 1, 3].includes(item.Flag) ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={[0, 3].includes(item.Flag) ? Images.icKey : Images.icHoTro} style={[nstyles.nstyles.nIcon16,
                                            [0, 3].includes(item.Flag) ? { tintColor: colors.waterBlue, marginTop: 8 } : {}]} resizeMode="contain" />
                                            <TouchableOpacity onPress={() => this.onClickFlag(item)} style={{ marginLeft: 6, padding: 10 }}>
                                                <Image source={Images.icQuestion} style={[nstyles.nstyles.nIcon14, { tintColor: colors.colorGrayLight }]} />
                                            </TouchableOpacity>
                                        </View>
                                        : null}
                                </View>
                                : null
                        }

                        {
                            item.Is3C == true ? <Text style={[styles.txt12, {
                                fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                backgroundColor: colors.orange, paddingHorizontal: 5, borderWidth: 1,
                            }]}>3C</Text> : null
                        }
                        {
                            item.IsZalo == true ? <View>
                                <Text style={[styles.txt12, {
                                    fontWeight: 'bold', color: colors.white, borderRadius: 5, borderColor: colors.white,
                                    backgroundColor: colors.blueZalo, paddingHorizontal: 5, borderWidth: 1,
                                }]}>{`Zalo`}</Text>
                            </View> : null
                        }
                        {
                            item.IsComeBackProcess && item.IsComeBackProcess == true ? <View style={{
                                borderRadius: 5, borderColor: colors.white,
                                backgroundColor: colors.blueZalo, paddingHorizontal: 5, borderWidth: 1,
                            }}>
                                <Image source={Images.icRepeat} style={[nstyles.nstyles.nIcon16,
                                { tintColor: colors.white }]} resizeMode="contain" />
                            </View> : null
                        }
                    </View>
                    {
                        item.TenTrangThai && this.IsTinhTrangXL == "true" || IsDaXyLy == true ?
                            <View style={{ borderRadius: 10, backgroundColor: colors.lightGreyBlue, padding: 5, justifyContent: 'center' }}>
                                <Text style={[styles.txt12, {
                                    textAlign: 'center',
                                }]}>{item.TenTrangThai}</Text>
                            </View>
                            : null
                    }
                </View>
                <View style={[nrow, { justifyContent: 'space-between', marginTop: 14 }]}>
                    <Text style={[styles.txt12, { fontStyle: 'italic' }]}>{ThoiGian ? item[`${ThoiGian}`] : item.CreatedDate}</Text>
                    {/* Bổ sung tên trạng thái */}
                    {isCheckTinhTrang == 0 ?
                        < View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: '#FE9A2E' }}>
                            <Text style={[styles.txt12, { fontWeight: 'bold', color: colors.white }]}>{item.TenTrangThai}</Text>
                        </View> : null}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        {
                            item.MucDo && !isNoCheck ? <View style={{
                                padding: 10, paddingVertical: 4, borderRadius: 10, marginTop: 3,
                                borderColor: colorMucDo, backgroundColor: colors.backgroundModal,
                            }}>
                                <Text numberOfLines={1} style={[styles.text13, { color: colorMucDo, fontStyle: 'italic', }]}>{item.TenMucDo}</Text>
                            </View> : null
                        }
                    </View>
                    <View>
                        {
                            item.TenTrangThai == "Mới" ?
                                <TouchableOpacity onPress={this._onTuongTu} style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Image source={Images.icSame} style={[nstyles.nstyles.nIcon18]} />
                                    <Text style={{ fontSize: reText(12), marginLeft: 5, marginTop: 1 }}>Phản ánh tương tự</Text>
                                </TouchableOpacity>
                                :
                                <Text style={[styles.txt12, { fontWeight: 'bold', color: colors.peacockBlue }]}>{textQuaHan}</Text>
                        }
                        {/*  Nút sharre facebook */}
                        {
                            item.Status == 6 && this.props.check == true ? <TouchableOpacity onPress={this._onShare} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: colors.blueFaceBook, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.share} style={[nstyles.nstyles.nIcon18, { marginRight: 5, tintColor: colors.white }]} />
                                <Text style={[styles.txt12, { fontWeight: 'bold', color: colors.white }]}>Chia sẻ</Text>
                            </TouchableOpacity> : null
                        }
                    </View>
                </View>
                {item.ChuyenTheoDoi == true ?
                    <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Images.icChuyenDeBiet} style={{ width: 18, height: 18 }} />
                        <Text style={{ fontStyle: 'italic', marginLeft: 5 }}>Phản ánh chuyển để biết</Text>
                    </View> : null}
            </TouchableOpacity >
        );
    }
}

ItemDanhSach.defaultProps = {
    item: {
        IdPA: 120220001,
        TenNguoiGopY: 'Nguyen Van Teo',
        sdt: '0987654432',
        NoiDung: 'Nội dung -Lorem ipsum dolor sit amet, consectetuer adipis cing elit, sed diam nonummy nibh euismod tincidunt ut laor… ',
        CreatedDate: '12/02/2020 10:01',
    },
    goscreen: () => { },
    goTuongTu: () => { },
    // nthis: this.nthisItemDanhSach,
    // NameNGY: ''
};

ItemDanhSach.propTypes = {
    item: PropTypes.object,
    goscreen: PropTypes.func,
    goTuongTu: PropTypes.func,
    nthis: PropTypes.any,
    NameNGY: PropTypes.string,
    ThoiGian: PropTypes.string
};

export { ItemDanhSach };