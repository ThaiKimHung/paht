import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView
} from 'react-native';

import { nstyles } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes } from '../../../styles/size';
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

export default class CardUpload extends Component {
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

    renderStatusBar = (index, text = '') => {
        return (
            <View style={{ flex: 1, marginHorizontal: 2, alignItems: 'center' }}>
                <View style={{ height: 30, width: '100%', backgroundColor: 'red' }}>

                </View>
                <Text>{text}</Text>
            </View>
        )
    }

    renderOption= (id, name = '') => {
        return (
            <View key={id.toString()} style={{ flex: 1, marginHorizontal: 2, alignItems: 'center' }}>
                <View style={{ height: 20, width: 20, backgroundColor: 'red' }}>
                </View>
                <Text style={{width: '100%', textAlign:'center', marginHorizontal: 3,marginTop: 5}}>{name}</Text>
            </View>
        )
    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom
                    titleText={'Chụp ảnh giấy tờ tuỳ thân'}
                    nthis={this} />
                {/* BODY */}
                <ScrollView>
                    <View style={[nstyles.nbody, { paddingTop: 20 }]}>
                        <View style={[nstyles.nrow, { marginHorizontal: 15 }]}>
                            {this.renderStatusBar(0, 'Bước 1')}
                            {this.renderStatusBar(1, 'Bước 2')}
                            {this.renderStatusBar(3, 'Bước 3')}
                        </View>
                        <Text style={{ textAlign: 'center', marginHorizontal: '15%', marginVertical: '8%' }}>
                            Vui lòng gửi hình ảnh giấy tờ còn hạn, hình gốc, không scan hay photocopy.
                        </Text>
                        <View style={[nstyles.nrow, { marginHorizontal: 15, marginBottom: '8%'}]}>
                            {this.renderOption(0, 'Chứng minh\nnhân dân')} 
                            {this.renderOption(1, 'Căn cước\ncông dân')}
                            {this.renderOption(3, 'Bằng lái xe')}
                        </View>
                        {/* Khung chon CMND */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={stCardCheck.imgContent}>
                                    {/* <Image source={Images.icImgAdd} style={{ width: '100%', height: '100%' }} /> */}
                                    <Image source={Images.icImgAdd} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Ảnh mặt trước</Text>
                            </View>
                            <View style={{ width: 10 }} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <TouchableOpacity style={stCardCheck.imgContent}>
                                    {/* <Image source={Images.icImgAdd} style={{width:'100%', height:'100%'}} /> */}
                                    <Image source={Images.icImgAdd} style={nstyles.nIcon65} resizeMode='cover' />
                                </TouchableOpacity>
                                <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Ảnh mặt sau</Text>
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
                    </View>
                </ScrollView>
            </View>
        );
    }
}

