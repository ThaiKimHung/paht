import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';

import PropTypes from 'prop-types';
import { nstyles, colors, sizes } from '../../../../styles';
import { Images } from '../../../images';
import styles from '../styles';
import Utils from '../../../../app/Utils';
import { appConfig } from '../../../../app/Config';
import { Width } from '../../../../styles/styles';
import moment from 'moment';
import apis from '../../../apis';
import Video from 'react-native-video';
import HtmlViewCom from '../../../../components/HtmlView';
import { reText } from '../../../../styles/size';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { linhvuc_color } from '../../../../styles/color';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image'


export default class ItemDanhSach extends Component {
    constructor(props) {
        super(props);
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '')
        // this.nthisItemDanhSach = nthisApp;
        this.state = {
            height: Platform.OS == 'ios' ? 67 : 80
        }
    };

    _chitietPhanAnh = () => {
        this.props.goscreen();
    }

    _showImages = () => {
        this.props.showImages();
    }
    _onEdit = (item) => {
        let {
            onEdit = () => { }
        } = this.props;
        onEdit(item);
    }

    onDelete = (item) => {
        Alert.alert('', 'Bạn có chắc chắn muốn hủy không?', [
            { text: 'Đóng' },
            {
                text: 'Hủy',
                onPress: async () => {
                    let {
                        IdPA, NoiDung, TieuDe,
                        ToaDoX, ToaDoY, DiaDiem, Notify = false,
                    } = item;

                    let Lonlat = {
                        latitude: ToaDoX,
                        longitude: ToaDoY,
                    }

                    let res = await apis.ApiPhanAnh.UpdatePhanAnhApp(IdPA, NoiDung, TieuDe, Lonlat, DiaDiem, [], Notify, true);
                    if (res.status == 1) {
                        Toast.show('Xóa thành công', Toast.LONG);
                    } else {
                        let { error = {} } = res;
                        let { message = '' } = error;
                        Toast.show(`Xóa thất bại. ${message}`, Toast.LONG);
                    }

                    refresh = this.props._onRefresh;
                    refresh();
                }
            }
        ])
    }

    onSharePA = (idPA = 0, title = Utils.getGlobal(nGlobalKeys.TieuDe) + ' ' + Utils.getGlobal(nGlobalKeys.TenApp)) => () => {
        Utils.onShare(title, appConfig.linkWeb + 'vi/chi-tiet-phan-anh?id=' + idPA.toString());
    }

    render() {
        const { nrow, nmiddle } = nstyles.nstyles;
        const { numberComent, dataItem, nthis, showEdit = false, styleContent = {}, showDel = true, isShare = true, isAnSinhXaHoi = false } = this.props;
        const { height } = this.state;
        var { ListHinhAnh = [] } = dataItem;
        let uriTitle = '';
        let urlAPITitle = '';
        var arrImg = [];
        if (ListHinhAnh.length > 0) {
            ListHinhAnh.forEach(item => {
                const url = item.Path;
                let checkImage = Utils.checkIsImage(item.Path);
                let checkVideo = Utils.checkIsVideo(item.Path);
                if (checkImage) {
                    arrImg.push({
                        url: appConfig.domain + url
                    })
                }
                if (uriTitle == '' && (checkVideo || arrImg.length != 0)) {
                    urlAPITitle = item.GetThumbnail;
                    uriTitle = appConfig.domain + url
                }
            });
            if (arrImg.length > 0) {

            }
        }
        const MucDo = dataItem.MucDo ? dataItem.MucDo : null
        const ngay = moment(dataItem.NgayGui, "DD/MM/YYYY hh:mm").format("DD");
        const thang = moment(dataItem.NgayGui, "DD/MM/YYYY hh:mm").format("MM");
        const gio = moment(dataItem.NgayGui, "DD/MM/YYYY hh:mm").format("HH:mm");
        const nam = moment(dataItem.NgayGui, "DD/MM/YYYY hh:mm").format("YYYY");;
        const thoigian = ngay + " tháng " + thang + " lúc " + gio + ", " + nam
        let colorMucDo = colors.cobaltBlue;
        if (dataItem.MucDo == 3)
            colorMucDo = colors.redStar;
        if (dataItem.MucDo == 2)
            colorMucDo = colors.orangeFive;
        let isVideo = Utils.checkIsVideo(uriTitle);
        if (!isVideo && urlAPITitle)
            uriTitle = appConfig.domain + urlAPITitle;
        //--Get color LV
        let ColorLV = colors.colorBlueLight;
        if (this.IdSource == 'CA') {
            let indexColor = linhvuc_color.findIndex((item) => item.IdLV == dataItem.IdLinhVuc);
            indexColor = this.props.colorLinhVuc == undefined ? (indexColor == -1 ? linhvuc_color.length - 1 : indexColor)
                : (this.props.colorLinhVuc >= linhvuc_color.length ? linhvuc_color.length - 1 : this.props.colorLinhVuc);
            // Utils.nlog('XXXX:', indexColor, dataItem.IdLinhVuc, linhvuc_color);
            ColorLV = linhvuc_color[indexColor].color;
        }

        //--
        return (
            <TouchableOpacity style={[{ backgroundColor: colors.white, padding: 5, borderRadius: 10, marginBottom: 3 }, styleContent]} onPress={this._chitietPhanAnh}>
                <View>
                    {//
                        uriTitle != '' ? <TouchableOpacity
                            activeOpacity={1}
                            disabled={isVideo}
                            onPress={this._showImages}
                            style={{ height: sizes.reSize(160), }}>
                            <View
                                style={{ width: '100%', height: '100%', justifyContent: 'flex-end' }}
                            >
                                {
                                    isVideo ?
                                        <View
                                            style={{
                                                width: '100%', height: '100%',
                                                justifyContent: 'center', alignItems: 'center',
                                                borderRadius: 10
                                            }}
                                        >
                                            <Video source={{ uri: uriTitle }}   // Can be a URL or a local file.
                                                style={{ width: '100%', height: '100%', backgroundColor: colors.black }}
                                                resizeMode='cover'
                                                paused={true} />
                                            <TouchableOpacity style={{ position: 'absolute' }}
                                                onPress={() => Utils.goscreen(nthis, 'Modal_PlayMedia', { source: uriTitle })}>
                                                <Image style={{ tintColor: colors.white, width: 60, height: 60 }}
                                                    source={Images.icVideoBlack} />
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <FastImage
                                            source={{
                                                uri: uriTitle,
                                                // headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.high,
                                            }}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                                            // defaultSource={Images.image}
                                            style={{ width: '100%', height: '100%', borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                }

                            </View>
                        </TouchableOpacity>
                            :
                            // <Text numberOfLines={2} style={[styles.text14, { fontWeight: 'bold', marginHorizontal: 10, marginTop: 30 }]}>{dataItem.TieuDe}</Text>
                            null
                    }
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', position: 'absolute', top: 0, left: 0, right: 0, padding: 5, alignItems: 'center', }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <View style={{ backgroundColor: ColorLV, padding: 4, alignItems: 'center', borderRadius: 5 }}>
                                <Text numberOfLines={1} style={[
                                    { color: colors.white, fontWeight: 'bold', fontSize: reText(10) }]}>
                                    {isAnSinhXaHoi ? dataItem?.FullName ? dataItem?.FullName : '-' : dataItem.ChuyenMuc || dataItem.LinhVuc}
                                </Text>
                            </View>
                        </View>
                        {
                            isAnSinhXaHoi ?
                                <View style={{
                                    backgroundColor: colors.redStar, borderRadius: 5,
                                    borderColor: colors.redStar, padding: 4, height: '100%'
                                }}>
                                    <Text numberOfLines={1} style={[{ color: colors.white, fontWeight: 'bold', fontSize: reText(10) }]}>{dataItem?.TenNguon ? dataItem?.TenNguon : '-'}</Text>
                                </View> :
                                <View style={{
                                    backgroundColor: MucDo != 3 && MucDo != null ? colors.organgeMucDo : colors.redStar, borderRadius: 5,
                                    borderColor: MucDo != 3 && MucDo != null ? colors.organgeMucDo : colors.redStar, padding: 4, height: '100%'
                                }}>
                                    <Text numberOfLines={1} style={[{ color: colors.white, fontWeight: 'bold', fontSize: reText(10) }]}>{dataItem.TenMucDo || dataItem.TinhTrang}</Text>
                                </View>
                        }
                    </View>
                </View>
                {/* {Content} */}
                <View style={{ padding: 5, marginTop: uriTitle != '' ? 0 : 25 }}>
                    <View style={[{ paddingVertical: 3 }]}>
                        <Text numberOfLines={isAnSinhXaHoi ? 999 : 1} style={[styles.text14,
                        { fontWeight: 'bold', color: colors.black, textAlign: 'justify' }]}>
                            {dataItem.TieuDe != ' ' ? dataItem.TieuDe.trim() : '---'}
                        </Text>
                        <Text style={[{ color: colors.black_50, fontSize: reText(12), marginBottom: 5 }]}>{dataItem?.TenPhuongXa ? dataItem?.TenPhuongXa + ' - ' : ''}{thoigian ? thoigian : null}</Text>
                    </View>
                    <View style={{ paddingBottom: 5, paddingRight: 20 }}>
                        <HtmlViewCom limitedLine={3} html={dataItem.NoiDung} style={{ height: Platform.OS == 'ios' ? 55 : 52 }} />
                    </View>
                    <View style={{ height: 1, backgroundColor: colors.BackgroundHome, }} />
                    {/* </View> */}
                </View>
                <View style={[nrow, {
                    alignItems: 'center',
                    // borderTopWidth: 0.5,
                    // borderTopColor: colors.grey,
                    paddingHorizontal: 10,
                    // justifyContent: 'space-between'
                }]}>
                    {/* <Text style={[styles.text12, { color: colors.black_50, }]}>{thoigian ? thoigian : null}</Text> */}
                    {dataItem.DiaDiem ? <View style={[nrow, { alignItems: 'center', flex: 1 }]}>
                        <Image source={Images.icDiaDiem} style={{
                            width: 16,
                            height: 16,
                        }} resizeMode='contain' />
                        <TouchableOpacity onPress={() => Utils.goscreen(nthis, "Modal_MapChiTietPA", { dataItem: dataItem })}>
                            <Text numberOfLines={1} style={[styles.text13, { color: colors.colorBlueP, marginLeft: 5 }]}>{dataItem.DiaDiem}</Text>
                        </TouchableOpacity>
                    </View> : null}


                    <View style={[nrow, { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }]}>
                        {/* <Text style={[styles.text12, { marginRight: 10, fontWeight: '700', }]}>{DaXuLy ? 'Đã xử lý' : 'Đang xử lý'}</Text> */}
                        {/* <Text style={[styles.text12, { marginRight: 10, fontWeight: '700', }]}
                            numberOfLines={1}
                        >{dataItem.TinhTrang}</Text> */}
                        {
                            numberComent != 0 ? <ImageBackground source={Images.icTinNhan} style={[nmiddle, { width: sizes.reSize(28), height: sizes.reSize(23), marginLeft: 10 }]} resizeMode='contain'>
                                <Text style={{ fontSize: sizes.reText(10), paddingBottom: nstyles.Height(0.5) }}>{numberComent}</Text>
                            </ImageBackground> : null
                        }
                        {
                            isShare == true ? <TouchableOpacity style={{}} onPress={this.onSharePA(dataItem.IdPA)}>
                                <Image source={Images.icShare} style={[nstyles.nstyles.nIcon20, { tintColor: colors.brownGreyTwo }]} resizeMode='stretch' />
                            </TouchableOpacity> : null
                        }

                        {showEdit ?
                            <View style={nstyles.nstyles.nrow}>
                                {
                                    !showDel ? null :
                                        <TouchableOpacity
                                            style={{ padding: 4, paddingHorizontal: 5 }}
                                            onPress={() => this.onDelete(dataItem)}>
                                            <Image
                                                source={Images.icDelete}
                                                style={[nstyles.nstyles.nIcon20, { tintColor: colors.colorRed }]}
                                                resizeMode='contain' />
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity
                                    style={{ padding: 4, paddingHorizontal: 6 }}
                                    onPress={() => this._onEdit(dataItem)}>
                                    <Image
                                        source={Images.icButChi}
                                        style={[nstyles.nstyles.nIcon20, { tintColor: colors.softBlue }]}
                                        resizeMode='contain' />
                                </TouchableOpacity>
                            </View>
                            : (dataItem.Status != 99 ? null :
                                <View style={{ borderColor: colors.redStar, borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ color: colors.redStar, fontSize: reText(13), fontWeight: 'bold' }}>{dataItem.TinhTrang}</Text>
                                </View>)
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
ItemDanhSach.defaultProps = {
    type: 1, //1 có hình ảnh, 2 là có hình ảnh
    numberComent: 0, //số cmt khi có người tương tác
    DaXuLy: false,
    goscreen: () => { },
    showImages: () => { },
    dataItem: {},
    // nthis: this.nthisItemDanhSach
};

ItemDanhSach.propTypes = {
    type: PropTypes.number,
    numberComent: PropTypes.number,
    DaXuLy: PropTypes.bool,
    goscreen: PropTypes.func,
    showImages: PropTypes.func,
    dataItem: PropTypes.object,
    nthis: PropTypes.any

}