import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView
} from 'react-native';

import { nstyles } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import HeaderCom from '../../../components/HeaderCom';
import { colors } from '../../../styles';
import ButtonCom from '../../../components/Button/ButtonCom';
import AppCodeConfig from '../../../app/AppCodeConfig';


const stCardCheck = StyleSheet.create({
    imgContent: {
        width: '100%', height: 100, alignItems: 'center', justifyContent: 'center',
        borderColor: colors.colorGrayIcon, borderWidth: 1, borderRadius: 6
    }
});

export default class ResultCheck extends Component {
    constructor(props) {
        super(props);
        this.lang = Utils.getGlobal(nGlobalKeys.lang, {}, AppCodeConfig.APP_ADMIN);
        this.state = {
            //data globle
            isLoading: false,
            //-data local


        }
    }

    componentDidMount = async () => {

    }

    onUserClick = () => {
        // alert('Thông tin user')
    }

    render() {

        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={'Card check'}
                    nthis={this} />
                {/* BODY */}
                <ScrollView>
                    <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                        {/* Khung chon CMND */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={stCardCheck.imgContent}>
                                    {/* <Image source={Images.icImgAdd} style={{ width: '100%', height: '100%' }} /> */}
                                    <Image source={Images.icImgAdd} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Chọn mặt trước CMND</Text>
                            </View>
                            <View style={{ width: 10 }} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={stCardCheck.imgContent}>
                                    {/* <Image source={Images.icImgAdd} style={{width:'100%', height:'100%'}} /> */}
                                    <Image source={Images.icImgAdd} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Chọn mặt trước CMND</Text>
                            </View>
                        </View>

                        {/* Khung chon Avatar + Fingerprint */}
                        <View style={{
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                            marginHorizontal: 15, marginTop: 20
                        }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={[stCardCheck.imgContent, { height: 120 }]}>
                                    {/* <Image source={Images.icImgAdd} style={{ width: '100%', height: '100%' }} /> */}
                                    <Image source={Images.icUser} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Chọn hình khuôn mặt</Text>
                            </View>
                            {/* <View style={{ width: 10 }} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={[stCardCheck.imgContent, { height: 120 }]}>
                                    <Image source={Images.icFinger} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Quét vân tay</Text>
                            </View> */}
                        </View>

                        {/* Nut gui */}
                        <ButtonCom
                            onPress={this.onLogin}
                            Linear={true}
                            sizeIcon={30}
                            style={{ marginHorizontal: '15%', marginTop: 10 }}
                            text={"GỬI THÔNG TIN"}
                        />

                        {/* Thong tin Ket qua */}
                        <View style={{
                            borderRadius: 4, borderWidth: 0.5, borderColor: colors.colorGrayIcon,
                            margin: 10, height: 500
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'red' }}>
                                <Text>Thông tin CMND</Text>
                                <Text>90%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Số CMND:</Text>
                                <Text>0987654321</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Họ tên:</Text>
                                <Text>NGUYỄN VĂN TÈO</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Ngày sinh:</Text>
                                <Text>28-09-1993</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Nguyên quán:</Text>
                                <Text>Hưng Yên</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Nơi ĐKHK thường trú: <Text>59 đường 4, Linh Xuân, Thủ Đức, TPHCM</Text></Text>
                                {/* <Text>90%</Text> */}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'red' }}>
                                <Text>Thông tin CMND</Text>
                                <Text>90%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Số CMND:</Text>
                                <Text>0987654321</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'red' }}>
                                <Text>Thông tin CMND</Text>
                                <Text>90%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Số CMND:</Text>
                                <Text>0987654321</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: 'red' }}>
                                <Text>Thông tin CMND</Text>
                                <Text>90%</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>Số CMND:</Text>
                                <Text>0987654321</Text>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

