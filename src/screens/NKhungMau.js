import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity, ScrollView
} from 'react-native';

import { nstyles } from '../../styles/styles';
import Utils from '../../app/Utils';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { Images } from '../images';
import { sizes } from '../../styles/size';


const stNKhungMau = StyleSheet.create({

});

export default class NKhungMau extends Component {
    constructor(props) {
        super(props);
        this.lang = Utils.getGlobal(nGlobalKeys.lang, {});
        this.state = {
            //data globle
            isLoading: false,
            //-data loca
        }
    }

    componentDidMount = async () => {

    }

    render() {
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainer}>
                {/* Header  */}
                <View style={nstyles.nhead}>
                    <View style={nstyles.nHcontent}>
                        <View style={nstyles.nHleft}>
                            <TouchableOpacity style={{ padding: 8 }} onPress={() => Utils.goback(this)}>
                                <Image source={Images.icCloseBlack} resizeMode='contain' style={[nstyles.nIcon20]} />
                            </TouchableOpacity>
                        </View>
                        <View style={nstyles.nHmid}>
                            <Text style={nstyles.ntitle}>Search for a city</Text>
                            {/* <Image source={Images.icTripU} resizeMode='contain' style={{ width: sizes.nImgSize58, height: sizes.nImgSize20 }} /> */}
                        </View>
                        <View style={nstyles.nHright}>
                            <TouchableOpacity style={{ padding: 8 }} onPress={() => { }}>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* BODY */}
                <View style={nstyles.nbody}>

                </View>
                {/* Foodter - có support iPhoneX */}

            </View>
        );
    }
}

