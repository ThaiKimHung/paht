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
import styles from '../../Home/styles';
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


export default class ItemTinTuyenDung extends Component {
    constructor(props) {
        super(props);
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
        var { ListFile = [] } = dataItem;
        let uriTitle = '';
        let urlAPITitle = '';
        var arrImg = [];
        if (ListFile.length > 0) {
            ListFile.forEach(item => {
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
        console.log('uriTitle', uriTitle);

        //--
        return (
            <TouchableOpacity style={[{ backgroundColor: colors.white, padding: 5, borderRadius: 10, marginBottom: 3 }, styleContent]} onPress={this._chitietPhanAnh}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {uriTitle != '' ? <View style={{ height: sizes.reSize(100), width: sizes.reSize(100) }} >
                        <TouchableOpacity
                            activeOpacity={1}
                            disabled={isVideo}
                            onPress={this._showImages}
                            style={{ height: sizes.reSize(100), }}>
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
                                            style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                }

                            </View>
                        </TouchableOpacity>
                    </View> :
                        <Image
                            source={Images.imgViettelTuyenDung}//do đã kiểm tra ở ngoài trước khi render nên k cần kt lại
                            style={{ height: sizes.reSize(100), width: sizes.reSize(100), borderRadius: 10 }}
                        />
                    }
                    <View style={{ flex: 1 }}>
                        {/* {Content} */}
                        <View style={{ padding: 5 }}>
                            <View style={[{ paddingVertical: 3 }]}>
                                <Text numberOfLines={2} style={[styles.text14,
                                { fontWeight: 'bold', color: colors.black, textAlign: 'justify' }]}>
                                    {dataItem.TieuDe != ' ' ? dataItem.TieuDe.trim() : '---'}
                                </Text>
                                <Text style={[{ color: colors.black_50, fontSize: reText(12), marginVertical: 5 }]}>Hết hạn: {dataItem?.DenNgay ? dataItem?.DenNgay : null}</Text>
                            </View>
                            <View style={{ paddingBottom: 5, paddingRight: 20 }}>
                                <HtmlViewCom limitedLine={3} html={dataItem.NoiDung} style={{ height: Platform.OS == 'ios' ? 30 : 27 }} />
                            </View>
                            <View style={{ height: 1, backgroundColor: colors.BackgroundHome, }} />
                        </View>
                        <View style={[nrow, { alignItems: 'center', paddingHorizontal: 10 }]}>
                            {dataItem.DiaDiem ? <View style={[nrow, { alignItems: 'center', flex: 1, paddingRight: dataItem?.IsHetHan ? 20 : 10 }]}>
                                <Image source={Images.icDiaDiem} style={{
                                    width: 16,
                                    height: 16,
                                }} resizeMode='contain' />
                                <TouchableOpacity onPress={() => Utils.goscreen(nthis, "Modal_MapChiTietPA", { dataItem: dataItem })}>
                                    <Text numberOfLines={1} style={[styles.text13, { color: colors.colorBlueP, marginLeft: 5 }]}>{dataItem.DiaDiem}Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
                                </TouchableOpacity>
                            </View> : null}
                            <View style={[nrow, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                                {
                                    dataItem?.IsHetHan || dataItem.IsDuyet == 1 ? <View style={{
                                        backgroundColor: '#F7E0E0', borderRadius: 5,
                                        borderColor: '#F7E0E0', padding: 4, height: '100%'
                                    }}>
                                        <Text numberOfLines={1} style={[{ color: '#F51C1C', fontWeight: 'bold', fontSize: reText(10) }]}>{dataItem?.IsHetHan ? 'Hết hạn' : dataItem.IsDuyet == 1 ? 'Không duyệt' : 'Hết hạn'}</Text>
                                    </View> : [0, 1, 2].includes(dataItem?.IsDuyet || 0) &&
                                    < View style={{
                                        backgroundColor: '#E6FAE5', borderRadius: 5,
                                        borderColor: '#E6FAE5', padding: 4, height: '100%'
                                    }}>
                                        <Text numberOfLines={1} style={[{ color: '#10CC00', fontWeight: 'bold', fontSize: reText(10) }]}>
                                            {dataItem?.IsDuyet == 1 ? 'Không duyệt' : dataItem?.IsDuyet == 2 ? 'Đã duyệt' : 'Chưa duyệt'}
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }
}
ItemTinTuyenDung.defaultProps = {
    type: 1, //1 có hình ảnh, 2 là có hình ảnh
    numberComent: 0, //số cmt khi có người tương tác
    DaXuLy: false,
    goscreen: () => { },
    showImages: () => { },
    dataItem: {},
    // nthis: this.nthisItemTinTuyenDung
};

ItemTinTuyenDung.propTypes = {
    type: PropTypes.number,
    numberComent: PropTypes.number,
    DaXuLy: PropTypes.bool,
    goscreen: PropTypes.func,
    showImages: PropTypes.func,
    dataItem: PropTypes.object,
    nthis: PropTypes.any

}