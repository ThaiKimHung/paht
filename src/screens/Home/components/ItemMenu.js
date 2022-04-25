import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import { Height, isLandscape, isPhoneMini, Width } from '../../../../styles/styles';
import LinearGradient from 'react-native-linear-gradient';
import ImageCus from '../../../../components/ImageCus';
import { isPad, reSize, reText } from '../../../../styles/size';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { appConfig } from '../../../../app/Config';
import Utils from '../../../../app/Utils';
import FontSize from '../../../../styles/FontSize';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import apiChat from '../../../../chat/api/apis';
const MarkView = () => {
    return (

        <Animatable.View animation={'bounceIn'}
            style={{
                position: 'absolute', top: -reSize(10), right: reSize(5),
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

class ItemMenu extends Component {
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
        const { item, index, isCD = false, _goScreenTab, isChild = false, renderMark = () => { }, theme } = this.props;
        const { tokenCHAT } = this.props.auth;
        let tempCountNoti = !tokenCHAT ? 0 : this.state.data;
        const isUrlTrust = Utils.isUrlCus(item.linkicon) != "" || item.linkicon == "";

        let tyleNum10 = Width(10);
        let tyleNum12 = Width(12);
        let tyleNum22 = Width(22);
        let heightText = reText(isPhoneMini ? 10 : 12);

        if (isLandscape()) {
            tyleNum10 = tyleNum10 / 1.8;
            tyleNum12 = tyleNum12 / 1.8;
            tyleNum22 = tyleNum22 / 1.8;

        } else {
            if (isPad) {
                tyleNum10 = tyleNum10 / 1.4;
                tyleNum12 = tyleNum12 / 1.4;
                tyleNum22 = tyleNum22 / 1.4;

            }
        }

        // return <View />
        if (theme && theme.typeMenu == 2) {
            return (
                <View key={index} style={{
                    width: isChild ? '100%' : '25%', alignItems: 'center', marginTop: 5
                }}>
                    <TouchableOpacity
                        disabled={false}
                        activeOpacity={0.7}
                        style={[{
                            width: '100%'
                        }]}
                        onPress={() => _goScreenTab(item, { title: item.name })}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.nocolor, colors.nocolor]}
                            style={[{ alignItems: 'center', justifyContent: 'center', width: '100%' }]}>
                            <View style={{ height: tyleNum12, width: "100%", justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={item.linearColor}
                                    style={{ width: tyleNum12, justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: '100%' }}
                                >
                                    <View style={[{ width: '50%', height: '60%' }]}>
                                        <ImageCus defaultSourceCus={Images[item.icon]} source={{ uri: isUrlTrust ? item.linkicon : (appConfig.domain + item.linkicon) }}
                                            style={[{ width: '100%', height: '100%' }]} resizeMode='contain'
                                        />
                                    </View>
                                </LinearGradient>
                            </View>
                            <View style={{ width: "100%", alignItems: 'center', height: (heightText * 2 + 18) }}>
                                <Text style={[
                                    {
                                        fontSize: heightText, color: colors.black,
                                        width: '90%', textAlign: 'center',
                                        marginTop: 5,
                                    }]} numberOfLines={2}>
                                    {item.name}
                                </Text>
                            </View>
                        </LinearGradient>
                        {
                            item.isMark ? <MarkView /> : null
                        }
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View key={index} style={{
                    width: isChild ? '100%' : '25%', alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderWidth: 1, borderColor: colors.white,

                }}>
                    <TouchableOpacity
                        disabled={false}
                        activeOpacity={0.5}
                        style={[{
                            marginBottom: 0,
                            opacity: 1, alignItems: 'center', justifyContent: 'center',
                            height: tyleNum22,// nwidth() / (Platform.isPad ? 7 : 4),
                        }]}
                        onPress={() => _goScreenTab(item, { title: item.name || '' })}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.nocolor, colors.nocolor]}
                            style={[{ flex: 1, }]}>
                            <View style={{ height: tyleNum12, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={[{ width: '50%', height: '60%' }]}>
                                    <ImageCus defaultSourceCus={Images[item.icon]} source={{ uri: isUrlTrust ? item.linkicon : (appConfig.domain + item.linkicon) }}
                                        style={[{ width: '100%', height: '100%' }]} resizeMode='contain'
                                    />
                                </View>
                            </View>
                            <View style={{ width: "100%", alignItems: 'center', height: (heightText * 2 + 18) }}>
                                <Text style={[
                                    {
                                        fontSize: reText(isPhoneMini ? 10 : 12), color: colors.black,
                                        width: reSize(80), textAlign: 'center',
                                        marginTop: 5, marginBottom: 5
                                    }]} numberOfLines={2}>
                                    {item.name}
                                </Text>
                            </View>
                        </LinearGradient>

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
                </View >
            )
        }
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth
});
export default Utils.connectRedux(ItemMenu, mapStateToProps, true);
const _styles = StyleSheet.create({
    itemNum: {
        position: 'absolute',
        top: 0, right: 0, padding: FontSize.scale(5),
        backgroundColor: 'red', borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: FontSize.scale(7)
    }
})
