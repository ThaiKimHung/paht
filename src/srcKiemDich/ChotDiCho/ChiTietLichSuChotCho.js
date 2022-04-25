import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Images } from '../../images';
import { ButtonCom } from '../../../components';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { appConfig } from '../../../app/Config';
import ImageCus from '../../../components/ImageCus';

class ChiTietLichSuChotCho extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', '')
        this.state = {
            data: this.data
        };
    }

    componentDidMount() {
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

    render() {
        const { data } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={data?.TenCongDan ? data.TenCongDan.toUpperCase() : ''}
                    styleTitle={{ color: colors.white, fontSize: reText(20) }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} style={{ marginTop: 10 }}>
                        <View style={{ backgroundColor: colors.white, marginTop: 10, alignItems: 'center' }}>
                            <View style={{ width: Width(35), height: Width(40), marginRight: Width(5), borderRadius: 5, backgroundColor: '#F2F2F2' }}>
                                <ImageCus
                                    defaultSourceCus={Images.imgAvatar}
                                    source={data?.Avata ? { uri: appConfig.domain + data.Avata } : Images.imgAvatar}
                                    style={{ width: Width(35), height: Width(40), alignSelf: 'center', borderRadius: 5 }}
                                    resizeMode={'cover'} />
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <TextLine title={'Họ tên'} value={data?.TenCongDan ? data?.TenCongDan : ''} />
                            <TextLine title={'Nơi cư trú'} value={data?.DiaChiCongDan ? data?.DiaChiCongDan : ''} />
                            <TextLine title={'CMND'}
                                value={data?.CMND ? data?.CMND : ''}
                            />
                            <TextLine title={'Tên trạm'}
                                value={data?.TenTram ? data?.TenTram : ''}
                            />
                            <TextLine title={'Địa chỉ trạm'}
                                value={`${data?.DiaChi ? data.DiaChi + ', ' : ''}${data?.Phuong ? data.Phuong + ', ' : ''}${data?.Quan ? data.Quan : ''}${data?.ThanhPho ? ', ' + data.ThanhPho : ''}`}
                            />
                            <TextLine title={'Cán bộ quét'}
                                value={data?.TenCanBo ? data?.TenCanBo : ''}
                            />


                        </View>
                        <ButtonCom
                            onPress={() => {
                                Utils.goback(this)
                            }}
                            Linear={true}
                            colorChange={['#F2F2F2', '#F2F2F2']}
                            shadow={false}
                            txtStyle={{ color: colors.grayLight }}
                            style={
                                {
                                    marginTop: Height(2), borderRadius: 5,
                                    alignSelf: 'center', paddingHorizontal: 20,
                                    width: Width(35),
                                }}
                            text={'QUAY LẠI'}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const TextLineIcon = (props) => {
    let { title = '', value = '', styleValue, styleTitle, icon = undefined, styleIcon, styleComp, line = true } = props
    return (
        <View style={[{ marginTop: 10 }, styleComp]}>
            <View style={{ flexDirection: 'row', }}>
                <View style={{ width: Width(10), alignItems: 'center' }}>
                    <Image source={icon} style={[nstyles.nIcon16, styleIcon]} resizeMode={'contain'} />
                </View>
                <Text style={[{ fontSize: reText(14), color: colors.black_50 }, styleTitle]}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row', width: Width(90), }}>
                <View style={{ width: Width(10) }}></View>
                <Text style={[{ fontSize: reText(14), marginTop: 3 }, styleValue]}>{value}</Text>
            </View>
            <View style={{ height: 0.5, backgroundColor: colors.grayLight, width: Width(90), alignSelf: 'flex-end', marginTop: 10 }} />
        </View>
    )
}


const TextLine = (props) => {
    let { title = '', value = '', styleValue, styleTitle } = props
    return (
        <View {...props} style={{ backgroundColor: colors.white, alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }}>
            <Text style={[{ fontWeight: '300', fontSize: reText(14), color: '#8F9294' }, styleTitle]}>{title}</Text>
            <Text style={[{ flex: 1, fontSize: reText(14), fontWeight: '400', textAlign: 'justify',marginTop: 10}, styleValue]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(50),
        maxHeight: Height(95)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(ChiTietLichSuChotCho, mapStateToProps, true);
