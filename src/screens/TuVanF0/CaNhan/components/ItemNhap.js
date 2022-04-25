import React, { Component } from 'react';
import {
    View, Text, ImageBackground,
    Image, TouchableOpacity
} from 'react-native';
import { nstyles, colors, sizes } from '../../../../../styles';
import { Images } from '../../../../images';
import Utils from '../../../../../app/Utils';
import { Height, Width } from '../../../../../styles/styles';
import { reText } from '../../../../../styles/size';

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

        var { diaDiem = '',
            noiDungGui = '',
            ListHinhAnh = [],
            paKhan
        } = dataItem;

        let imageSource = null;
        let isVideo = null;
        if (Array.isArray(ListHinhAnh) && ListHinhAnh.length > 0) {
            imageSource = ListHinhAnh[0].uri;
            isVideo = ListHinhAnh[0].type
        }

        Utils.nlog('Gia tri data ====', paKhan)
        Utils.nlog('Gia tri imageSource~~~~~~~~~~', isVideo)
        return (
            <View>
                <TouchableOpacity
                    onPress={onPress}
                    style={[nstyles.nstyles.shadown, { borderRadius: 6, marginTop: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6 }]}>
                    {imageSource ?
                        <View style={{ height: sizes.reSize(180) }}>
                            <View
                                style={{ height: sizes.reSize(180) }}>
                                <Image
                                    source={{ uri: imageSource }}
                                    style={{
                                        width: '100%', height: '100%', borderTopRightRadius: 6,
                                        borderTopLeftRadius: 6, justifyContent: 'flex-end'
                                    }} resizeMode='cover'>
                                </Image>
                                {isVideo == 2 ? <Image source={Images.icVideoBlack} style={{ position: 'absolute', top: sizes.reSize(80), alignSelf: 'center', width: 35, height: 35, tintColor: colors.white }} /> : null}
                            </View>
                        </View>
                        :
                        null}

                    <View style={{ paddingHorizontal: 10, paddingVertical: 10, width: Width(95) }}>
                        <View>
                            <Text
                                numberOfLines={2}
                                style={{ fontSize: sizes.reText(12), lineHeight: sizes.reText(17), marginTop: 5, minHeight: Height(5) }} >
                                {noiDungGui}
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: colors.black_16, marginVertical: 10 }} />
                        {diaDiem ?
                            <View style={[nrow, { alignItems: 'center' }]}>
                                <Image source={Images.icLocation}
                                    style={{ width: 10, height: 16, tintColor: colors.colorBlueLight }}
                                    resizeMode='contain' />
                                <TouchableOpacity onPress={() => Utils.goscreen(nthis, "Modal_MapChiTietPA", { dataItem: dataItem })}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ fontSize: sizes.reText(13), color: colors.colorBlueLight, marginLeft: 5 }}>
                                        {diaDiem}
                                    </Text>
                                </TouchableOpacity>
                            </View> : null}
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
                {paKhan == true ?
                    <View style={{
                        position: 'absolute', top: 10, right: 0, margin: 10, elevation: 10,
                        zIndex: 1000, backgroundColor: colors.colorTextSelect, padding: 5, borderRadius: 5, paddingHorizontal: 10
                    }}>
                        <Text style={{ color: colors.white, fontSize: reText(10), fontWeight: 'bold' }}>Khẩn</Text>
                    </View>
                    : null}

            </View>


        );
    }
}