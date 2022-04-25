import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Platform, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { appConfig } from '../../../../app/Config';
import Utils from '../../../../app/Utils';
import { HeaderCus } from '../../../../components';
import ImageCus from '../../../../components/ImageCus';
import { colors } from '../../../../styles';
import { reSize, reText } from '../../../../styles/size';
import { Width } from '../../../../styles/styles';
import { Images } from '../../../images';

class MenuChongDich extends Component {
    constructor(props) {
        super(props);
        this.keyMenuChild = Utils.ngetParam(this, "keyMenuChild", "_");
        this.title = Utils.ngetParam(this, "title", "");
        this.state = {
        };
    }

    _renderMenu = (item, index) => {
        const isUrlTrust = Utils.isUrlCus(item.linkicon) != "" || item.linkicon == "";
        return (
            <View key={index} style={{
                width: '25%', alignItems: 'center',
                justifyContent: 'center', marginTop: 10
            }}>
                <TouchableOpacity
                    disabled={false}
                    activeOpacity={0.5}
                    style={[{
                        marginBottom: 0,
                        opacity: 1, alignItems: 'center', justifyContent: 'center',
                        height: Width(22),// nwidth() / (Platform.isPad ? 7 : 4),
                    }]}
                    onPress={() => this._goScreenTab(item, { title: item.name })}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.nocolor, colors.nocolor]}
                        style={[{ flex: 1, alignItems: 'center' }]}>
                        <View style={{ height: Width(12), width: Width(25), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={item.linearColor}
                                style={{ height: Width(12), width: Width(12), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                            >
                                <View style={[{ width: '50%', height: '60%' }]}>
                                    <ImageCus defaultSourceCus={Images[item.icon]} source={{ uri: isUrlTrust ? item.linkicon : (appConfig.domain + item.linkicon) }}
                                        style={[{ width: '100%', height: '100%' }]} resizeMode='contain'
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                        <View style={{ height: Width(10), width: Width(25), alignItems: 'center' }}>
                            <Text style={[
                                {
                                    fontSize: reText(11), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold', textAlign: 'center',
                                    marginTop: 5
                                }]} >
                                {item.name}
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View >
        )
    }

    _goScreenTab = async (item, param = {}) => {
        if (item.linkAndroid && item.linkIOS) {
            if (Platform.OS == 'android')
                Linking.openURL(item.linkAndroid)
            else
                Linking.openURL(item.linkIOS)
            return
        }

        if (item.goscreen) {
            Utils.goscreen(this, item.goscreen)
        } else {
            if (item.linkWeb) {
                Utils.openWeb(this, item.linkWeb, { title: item.name })
            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Chức năng đang phát triển. Vui lòng sử dụng tại các phiên bản sau.')
            }
        }
    }

    render() {
        const { MenuChild } = this.props.auth
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={this.title}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ paddingTop: 15 }}
                        showsVerticalScrollIndicator={false}
                        extraData={MenuChild[this.keyMenuChild] || []}
                        numColumns={4}
                        data={MenuChild[this.keyMenuChild] || []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => this._renderMenu(item, index)}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(MenuChongDich, mapStateToProps, true);
