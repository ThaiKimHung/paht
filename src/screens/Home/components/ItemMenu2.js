import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import { Height, isLandscape, isPhoneMini, nstyles, Width } from '../../../../styles/styles';
import ImageCus from '../../../../components/ImageCus';
import { reSize, reText } from '../../../../styles/size';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { appConfig } from '../../../../app/Config';
import Utils from '../../../../app/Utils';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import apiChat from '../../../../chat/api/apis';
import FontSize from '../../../../styles/FontSize';

const MarkView = () => {
    return (

        <Animatable.View animation={'bounceIn'}
            style={{
                position: 'absolute', top: -reSize(2), right: reSize(5),
                width: reSize(25), height: reSize(25),
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 10,
            }}>
            <LottieView
                source={require('../../../images/hot.json')}
                style={{ width: reSize(40), height: reSize(40), justifyContent: "center", alignSelf: 'center' }}
                loop={true}
                autoPlay={true}
            />
        </Animatable.View>

    )
}

class ItemMenu2 extends Component {
    constructor(props) {
        super(props);
        this.isItemChat = props.item?.code == appConfig.appCHAT;
        this.state = {
            data: 0
        }
    }

    componentDidMount() {
        if (this.isItemChat)
            this.getData();
    }

    getData = async () => {
        let res = await apiChat.DemSoTinNhanChuaXem();
        // Utils.nlog("[tin chưa đọc]", res)
        if (res.status == 1 && res.data) {
            this.setState({ data: res.data || 0 });
        } else {
            this.setState({ data: 0 });
        }
    }

    render() {
        const { item, index, isCD = false, _goScreenTab, isChild = false, numColumns = 3, renderMark = () => { } } = this.props;
        const { tokenCHAT } = this.props.auth;
        let tempCountNoti = !tokenCHAT ? 0 : this.state.data;
        const isUrlTrust = Utils.isUrlCus(item.linkicon) != "" || item.linkicon == "";

        let tyleItem = Platform.isPad ? Width(78 / numColumns) : Width(92 / numColumns); // Do margin 2 bên là 4x2 = 8 nên Max = 92;
        Utils.nlog('tyleItemMenu : ', tyleItem);
        const khoangCachItem = 8;
        return (
            <View key={index} style={{
                width: isLandscape() ? tyleItem / 2 : tyleItem, height: isLandscape() ? tyleItem / 2 : tyleItem, paddingRight: (index + 1) % numColumns == 0 ? 0 : khoangCachItem, paddingBottom: khoangCachItem,
            }}>
                <TouchableOpacity onPress={() => _goScreenTab(item, { title: item.name })}
                    style={[nstyles.shadow, { width: '100%', height: '100%', borderRadius: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }]}>
                    <View style={[{ width: '50%', height: '47%', marginTop: 4 }]}>
                        <ImageCus defaultSourceCus={Images[item.icon]} source={{ uri: isUrlTrust ? item.linkicon : (appConfig.domain + item.linkicon) }}
                            style={[{ width: '100%', height: '100%' }]} resizeMode='contain'
                        />
                    </View>
                    <View style={{ width: '100%', height: '46%', paddingHorizontal: 10 }}>
                        <Text style={[
                            {
                                fontSize: reText(numColumns == 3 ? 12 : 10), color: colors.black, width: '100%', textAlign: 'center', marginTop: 6, marginBottom: 2
                            }]} numberOfLines={2}>
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
                {//nếu la chat và số tin nhắn lớn hơn 0
                    this.isItemChat && tempCountNoti != 0 ? <View style={_styles.itemNum}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>
                            {tempCountNoti + ""}
                        </Text>
                    </View> : null
                }
                {
                    item.isMark ? <MarkView /> : null
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(ItemMenu2, mapStateToProps, true);
const _styles = StyleSheet.create({
    itemNum: {
        position: 'absolute',
        top: 0, right: 5, padding: FontSize.scale(5),
        backgroundColor: 'red', borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: FontSize.scale(7)
    }
})
