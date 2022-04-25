import React, { Component } from 'react';
import { Text, Image, View, Dimensions, Platform } from 'react-native';
import { colors } from '../styles/color';
// import { View } from 'native-base';
import { nstyles, Height, Width, nwidth, nheight } from '../styles/styles';
import { ImgComp } from './ImagesComponent';
import LottieView from 'lottie-react-native';



export default class ListEmpty extends Component {
    render() {
        const { srcImg, isImage = true
            , textempty, style = {}, isrotate = false, styleContainer } = this.props;
        return (
            <View style={[{
                flex: 1, alignItems: 'center',
                marginTop: isImage == false ? 0 : Height(15),
                justifyContent: 'center',
            }, styleContainer]}>
                {isImage ?
                    // <Image
                    //     resizeMode='contain'
                    //     source={srcImg ? srcImg : ImgComp.ArrayEmpty}
                    //     style={{ width: Width(40), height: Width(25), transform: [{ rotate: isrotate == true ? '180deg' : '0deg' }] }} />
                    <>
                        <LottieView
                            source={require('../src/images/emptyBox.json')}
                            style={{ width: nwidth(), height: nheight() / 5, justifyContent: "center", alignSelf: 'center', transform: [{ rotate: isrotate == true ? '90deg' : '0deg' }] }}
                            loop={true}
                            autoPlay={true}
                        />
                        <Text style={[{
                            textAlign: 'center', marginVertical: 20, color: colors.colorGrayText,
                            width: '100%', fontWeight: 'bold', opacity: 0.7
                        }, style]}>{textempty}</Text>
                    </>
                    : null}
                {isImage == false ? <Text style={[{
                    textAlign: 'center', marginVertical: 20, color: colors.colorGrayText,
                    width: '100%', fontWeight: 'bold', opacity: 0.7, marginTop: Platform.OS == 'android' ? 80 : 0
                }, style]}>{textempty}</Text> : null}
            </View>
        );
    }
}
