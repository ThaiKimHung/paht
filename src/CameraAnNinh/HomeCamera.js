import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, BackHandler, Platform } from 'react-native';
import { HeaderCus } from '../../components';
import { Images } from '../images';
import { heightStatusBar, nstyles, nwidth, Width } from '../../styles/styles';
import { colors } from '../../styles';
import Utils from '../../app/Utils';
import { reText } from '../../styles/size';
import apis from '../apis';

import { store } from '../../srcRedux/store';
import { SetListCam } from '../../srcRedux/actions/common/Common';
import ItemCamera from './ItemCamera';
import UtilsApp from '../../app/UtilsApp';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { CheckListCam } from '../../srcRedux/actions/auth/Auth';

const keyCamera = [
    {
        key: 1,
        name: '1 Camera'
    },
    {
        key: 2,
        name: '2 Camera'
    },
    {
        key: 4,
        name: '4 Camera'
    },
    {
        key: 6,
        name: '6 Camera'
    }
]

class HomeCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCamera: []
        };
        this.devMode = 0; //Nhấn >10 lần để chuyển nhanh chế độ uu tien WSS, và VLC 
    }

    componentDidMount() {
        this.GetList_Camera()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home');
        return true
    }

    componentWillUnmount = async () => {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    GetList_Camera = async () => {
        let res = await apis.ApiApp.GetList_Camera()
        // Utils.nlog('res cam--------aaa', res)
        if (res.status == 1 && res.data) {
            // Utils.nlog("data----------item", JSON.stringify(res.data[0].Rtsp))
            this.setState({ dataCamera: res.data })
            // let listcam = [];
            // for (let index = 0; index < this.props.common.keyCamera; index++) {
            //     if (res.data[index]) {
            //         const element = res.data[index];
            //         listcam.push(element);
            //     } else {
            //         listcam.push({});
            //     }
            // }
            // store.dispatch(SetListCam(listcam))
        }
    }

    _renderItem = ({ item, index }) => {
        Utils.nlog("item-------", item)
        return <ItemCamera {...this.props} callBack={this._callbackAddCam} item={item} index={index} addCam={this.addCam} />
    }

    addCam = (index = 0) => {
        Utils.goscreen(this, 'scListCamera', { callback: (val) => this._callbackAddCam(val, index), indexNow: index })
    }

    _callbackAddCam = async (val, index) => {
        let listcam = [...this.props.listCamChoose];
        listcam[index] = val
        store.dispatch(SetListCam(listcam))
    }

    changeNumberCam = (number) => {
        store.dispatch(CheckListCam(number));
        this.props.SetKeyCamera(number)

    }

    footerComponent = () => {
        return (
            <View style={{ padding: 10, backgroundColor: colors.white, marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{'Chú thích'}</Text>
                <TouchableOpacity activeOpacity={0.98}
                    onPress={() => {
                        this.devMode++;
                        if (this.devMode >= 10)
                            Utils.setGlobal(nGlobalKeys.topWSS, this.devMode % 2 == 0) // Chẵn là WSS, lẻ là VLC
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <Image source={Images.icAddBT} style={nstyles.nIcon20} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ paddingLeft: 10 }}>{'Dùng để thêm 1 camera vào một ô màn hình'}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <Image source={Images.icChangeCamera} style={nstyles.nIcon20} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ paddingLeft: 10 }}>{'Dùng để đổi camera đang xem thành camera khác'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <Image source={Images.icExpand} style={nstyles.nIcon20} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ paddingLeft: 10 }}>{'Dùng để xem toàn màn hình một camera'}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <HeaderCus
                    title={UtilsApp.getScreenTitle("CameraAnNinh", 'Camera')}
                    styleTitle={{ color: 'white' }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                />
                <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            extraData={this.props.common.keyCamera}
                            numColumns={this.props.common.keyCamera > 2 ? 2 : 1}
                            data={this.props.listCamChoose?.filter((item, index) => index < this.props.common.keyCamera)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this._renderItem}
                            key={this.props.common.keyCamera}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{ height: 3 }} />
                                )
                            }}
                            ListFooterComponent={this.footerComponent}
                            ListEmptyComponent={() => {
                                return <TouchableOpacity
                                    onPress={() => this.addCam()}
                                    activeOpacity={0.5}
                                    style={{
                                        width: this.props.common.keyCamera == 1 || this.props.common.keyCamera == 2 ? nwidth() : nwidth() / 2,
                                        height: this.props.common.keyCamera == 1 || this.props.common.keyCamera == 2 ? nwidth() : nwidth() / 2,
                                        backgroundColor: colors.backgroundModal,
                                        alignItems: 'center', justifyContent: 'center',
                                        borderLeftWidth: 0, borderLeftColor: colors.white
                                    }}>
                                    <Image source={Images.icAddBT} style={[nstyles.nIcon30, { tintColor: colors.white }]} />
                                </TouchableOpacity>
                            }}
                        />
                    </View>
                    <View style={{ paddingBottom: heightStatusBar() / 2, flexDirection: 'row', justifyContent: 'space-evenly', padding: 10, backgroundColor: colors.white, borderTopWidth: 1 }}>
                        {keyCamera.map(item => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.changeNumberCam(item.key)} key={item.key}
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5, borderWidth: 1,
                                        borderColor: this.props.common.keyCamera == item.key ? 'red' : colors.brownGreyThree,
                                        flexDirection: 'row', alignItems: 'center'
                                    }}>
                                    <Image style={nstyles.nIcon24} source={Images.icMenuCamera} resizeMode='contain' />
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: reText(16),
                                            color: this.props.common.keyCamera == item.key ? 'red' : 'black',
                                            paddingLeft: 10
                                        }}
                                    >
                                        {item.key}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    common: state.common,
    listCamChoose: state.common.listCamChoose
});

export default Utils.connectRedux(HomeCamera, mapStateToProps, true)

