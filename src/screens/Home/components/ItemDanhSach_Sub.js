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
import { reSize, reText } from '../../../../styles/size';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { linhvuc_color } from '../../../../styles/color';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';


export default class ItemDanhSach_Sub extends Component {
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
        Alert.alert('', 'Bạn có chắc chắn muốn hủy phản ánh này không?', [
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

                    let dataBoDy = new FormData();
                    dataBoDy.append("Temp", true);
                    dataBoDy.append("NoiDung", NoiDung)
                    dataBoDy.append("TieuDe", TieuDe)
                    dataBoDy.append("ToaDoX", ToaDoX)
                    dataBoDy.append("ToaDoY", ToaDoY)
                    dataBoDy.append("Notify", Notify)
                    dataBoDy.append('DiaDiem', DiaDiem)
                    dataBoDy.append('IdPA', IdPA)
                    dataBoDy.append("MucDo", paKhan ? 3 : 0);
                    dataBoDy.append("IdFileDel", '')
                    dataBoDy.append("IsDel", 1);

                    let res = await apis.ApiUpLoad.EditPA_FormData(dataBoDy);

                    // let res = await apis.ApiPhanAnh.UpdatePhanAnhApp(IdPA, NoiDung, TieuDe, Lonlat, DiaDiem, [], Notify, true);
                    if (res && res > 0 && res.status == 1) {
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
        const { dataItem, nthis, showEdit = false, styleItemSub } = this.props;
        // Utils.nlog('dataSub==', dataItem)
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
            <TouchableOpacity style={[{ backgroundColor: colors.white, padding: 10 }, styleItemSub]} onPress={this._chitietPhanAnh}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {uriTitle != '' ?
                        <View style={{ width: reSize(120), height: reSize(120) }}>
                            {//
                                <TouchableOpacity
                                    activeOpacity={1}
                                    disabled={isVideo}
                                    onPress={this._showImages}
                                    style={{ height: sizes.reSize(120), }}>
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
                                                // <Image
                                                //     source={{ uri: uriTitle }}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                                                //     style={{ width: '100%', height: '100%' }} resizeMode='stretch'
                                                // />
                                                <FastImage
                                                    source={{
                                                        uri: uriTitle,
                                                        // headers: { Authorization: 'someAuthToken' },
                                                        priority: FastImage.priority.high,
                                                    }}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                                                    // defaultSource={Images.image}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                />
                                        }

                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        : null}
                    <View style={{ flex: 1, height: '100%' }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}>
                            <View style={{ flex: 1, alignItems: 'flex-start', paddingRight: 5 }}>
                                <View style={{ backgroundColor: colors.white, padding: 4, alignItems: 'center', borderRadius: 5, borderWidth: 0.5, borderColor: ColorLV }}>
                                    <Text numberOfLines={1} style={[
                                        { color: ColorLV, fontWeight: 'bold', fontSize: reText(10) }]}>{dataItem.ChuyenMuc}</Text>
                                </View>
                            </View>
                            <View style={{
                                backgroundColor: colors.white, borderRadius: 5,
                                borderColor: MucDo != 3 && MucDo != null ? colors.organgeMucDo : colors.redStar, padding: 4,
                                borderWidth: 0.5, height: '100%',
                            }}>
                                <Text numberOfLines={1} style={[{ color: MucDo != 3 && MucDo != null ? colors.organgeMucDo : colors.redStar, fontWeight: 'bold', fontSize: reText(10), maxWidth: Width(30) }]}>{dataItem.TenMucDo}</Text>
                            </View>
                        </View>
                        {/* {Title} */}
                        <View style={{ paddingHorizontal: 5 }}>
                            <View style={[{ paddingVertical: 5 }]}>
                                <Text numberOfLines={1} style={[styles.text12,
                                { fontWeight: 'bold', color: colors.black, }]}>
                                    {dataItem.TieuDe != ' ' ? dataItem.TieuDe : '---'}
                                </Text>

                            </View>
                            <View style={{ paddingHorizontal: 5 }}>
                                <HtmlViewCom limitedLine={2} html={dataItem.NoiDung} style={{ height: 35 }} />
                            </View>
                            {dataItem.DiaDiem ? <View style={[nrow, { alignItems: 'center', paddingRight: 10 }]}>
                                <Image source={Images.icDiaDiem} style={{
                                    width: 16,
                                    height: 16,
                                }} resizeMode='contain' />
                                <TouchableOpacity onPress={() => Utils.goscreen(nthis, "Modal_MapChiTietPA", { dataItem: dataItem })}>
                                    <Text numberOfLines={1} style={[{ color: colors.colorBlueP, marginLeft: 5, fontSize: reText(11) }]}>{dataItem.DiaDiem}</Text>
                                </TouchableOpacity>
                            </View> : null}
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: 5 }}>
                            <Text style={[{ color: colors.black_50, fontSize: reText(10), paddingLeft: 5 }]}>{thoigian ? thoigian : null}</Text>
                            <TouchableOpacity style={{}} onPress={this.onSharePA(dataItem.IdPA)}>
                                <Image source={Images.icShare} style={[nstyles.nstyles.nIcon20, { tintColor: colors.brownGreyTwo }]} resizeMode='stretch' />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
ItemDanhSach_Sub.defaultProps = {
    type: 1, //1 có hình ảnh, 2 là có hình ảnh
    numberComent: 0, //số cmt khi có người tương tác
    DaXuLy: false,
    goscreen: () => { },
    showImages: () => { },
    dataItem: {},
    // nthis: this.nthisItemDanhSach
};

ItemDanhSach_Sub.propTypes = {
    type: PropTypes.number,
    numberComent: PropTypes.number,
    DaXuLy: PropTypes.bool,
    goscreen: PropTypes.func,
    showImages: PropTypes.func,
    dataItem: PropTypes.object,
    nthis: PropTypes.any

}