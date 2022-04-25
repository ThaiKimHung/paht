import React, { Component } from 'react';
import { View, Text, Platform, Image, TouchableOpacity, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { ScrollView } from 'react-native-gesture-handler';
import { isIphoneX } from 'react-native-iphone-x-helper';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import { HeaderCus, IsLoading } from '../../../../components';
import WebViewCus from '../../../../components/WebViewCus';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { Height, nstyles, paddingTopMul } from '../../../../styles/styles';

class ChiTietTinTuc extends Component {
    constructor(props) {
        super(props);
        this.itemTinTuc = Utils.ngetParam(this, 'itemTinTuc', '')
        this.IdTinTuc = Utils.ngetParam(this, 'IdTinTuc')
        this.state = {
            dataCT: '',
            loading: true
        };
    }

    componentDidMount() {
        this.GET_ChiTietTinTuc()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    GET_ChiTietTinTuc = async () => {
        nthisIsLoading.show()
        let dataBody = {
            'id': this.IdTinTuc ? this.IdTinTuc : this.itemTinTuc.ID
        }
        let res = await apis.ApiDVC.ChiTietBaiViet(dataBody)
        Utils.nlog('chi tiet bai viet', res)
        nthisIsLoading.hide()
        if (res.status == 1 && res.data) {
            this.setState({ dataCT: res.data })
        }
    }

    render() {
        let { dataCT } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'scHomeTT')}
                    iconLeft={Images.icBack}
                    title={'Nội dung chi tiết'}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white, }}>
                    {/* {/ <ScrollView> /} */}
                    {
                        dataCT.length > 0 ? dataCT.map((item, index) => {
                            return (
                                <View key={index.toString()} style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', padding: 10, textAlign: 'justify', fontSize: reText(16) }}>{item.TieuDe}</Text>
                                    {
                                        this.state.loading ?
                                            <>
                                                <ActivityIndicator size={'small'} />
                                                <Text style={{ textAlign: 'center', color: colors.grayLight, paddingVertical: 10, fontSize: reText(12) }}>{'Đang tải nội dung trang'}</Text>
                                            </>
                                            : null
                                    }
                                    <WebViewCus
                                        onLoadEnd={(syntheticEvent) => {
                                            // update component to be aware of loading status
                                            const { nativeEvent } = syntheticEvent;
                                            Utils.nlog('data load', nativeEvent.loading)
                                            this.setState({ loading: nativeEvent.loading })
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        source={{ html: item.NoiDung ? item.NoiDung : '<div></div>' }}
                                        style={{ height: Height(100), marginHorizontal: 10 }} />

                                </View>
                            )
                        }) : null
                    }
                    {/* </ScrollView> */}
                </View>
                <IsLoading />
            </View >
        );
    }
}

export default ChiTietTinTuc;
