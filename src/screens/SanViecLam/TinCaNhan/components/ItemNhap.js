import React, { Component } from 'react';
import {
    View, Text, ImageBackground,
    Image, TouchableOpacity, Platform
} from 'react-native';
import { nstyles, colors, sizes } from '../../../../../styles';
import { Images } from '../../../../images';
import Utils from '../../../../../app/Utils';
import { Height, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';
import HtmlViewCom from '../../../../../components/HtmlView';

export default class ItemNhap extends Component {
    constructor(props) {
        super(props);
    };

    static defaultProps = {
        numberComent: null, //số cmt khi có người tương tác
        DaXuLy: false,
        goscreen: () => { },
        showImages: () => { },
        data: {

        }
    };

    _chitietPhanAnh = () => {
        this.props.goscreen();
    }

    _showImages = () => {
        this.props.showImages();
    }

    render() {
        const {
            nrow,
        } = nstyles.nstyles;
        const {
            dataItem = {},
            nthis = this,
            removeDraft,
            onPress = () => { }
        } = this.props;

        var { DiaDiem = '',
            NoiDung = '',
            ListHinhAnh = [],
            TieuDe
        } = dataItem;

        let imageSource = undefined;
        let isVideo = null;
        if (Array.isArray(ListHinhAnh) && ListHinhAnh.length > 0) {
            imageSource = ListHinhAnh[0].uri;
            isVideo = ListHinhAnh[0].type
        }
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[nstyles.nstyles.shadown, { padding: 5, borderRadius: 6, marginTop: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: colors.white }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ height: sizes.reSize(100), width: sizes.reSize(100) }}>
                        <View
                            style={{ height: sizes.reSize(100) }}>
                            <Image
                                source={imageSource ? { uri: imageSource } : Images.imgViettelTuyenDung}
                                style={{
                                    width: '100%', height: '100%', borderRadius: 5, justifyContent: 'flex-end'
                                }} resizeMode='cover'>
                            </Image>
                            {isVideo == 2 ? <Image source={Images.icVideoBlack} style={{ position: 'absolute', top: sizes.reSize(80), alignSelf: 'center', width: 35, height: 35, tintColor: colors.white }} /> : null}
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 10, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{TieuDe}</Text>
                        {/* <Text
                            numberOfLines={2}
                            style={{ fontSize: sizes.reText(12), lineHeight: sizes.reText(17), marginTop: 5, minHeight: Height(5) }} >
                            {NoiDung}
                        </Text> */}
                        <View style={{ paddingBottom: 5}}>
                            <HtmlViewCom limitedLine={3} html={NoiDung} style={{ height: Platform.OS == 'ios' ? 30 : 27 }} />
                        </View>
                        <View style={{ height: 1, backgroundColor: colors.black_16, marginVertical: 10 }} />
                        {DiaDiem ?
                            <View style={[nrow, { alignItems: 'center' }]}>
                                <Image source={Images.icLocation}
                                    style={{ width: 10, height: 16, tintColor: colors.colorBlueLight }}
                                    resizeMode='contain' />
                                <TouchableOpacity onPress={() => Utils.goscreen(nthis, "Modal_MapChiTietPA", { dataItem: dataItem })}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ fontSize: sizes.reText(13), color: colors.colorBlueLight, marginLeft: 5 }}>
                                        {DiaDiem}
                                    </Text>
                                </TouchableOpacity>
                            </View> : null}
                    </View>
                </View>



                <TouchableOpacity
                    style={{
                        backgroundColor: colors.colorTextSelect, borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
                        padding: 4, paddingHorizontal: 6, paddingVertical: 10
                    }}
                    onPress={() => removeDraft()}>
                    <Text style={{ color: colors.white, textAlign: 'center' }}>{'XÓA'}</Text>
                </TouchableOpacity>
            </TouchableOpacity>


        );
    }
}