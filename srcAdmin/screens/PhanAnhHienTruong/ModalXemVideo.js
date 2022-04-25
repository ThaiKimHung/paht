import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { nstyles, sizes, colors } from '../../../styles';
import { Images } from '../../images';
import Utils from '../../../app/Utils';
import Video from 'react-native-video';
import { PlayMedia } from '../../../components';

class ModalXemVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: Utils.ngetParam(this, "item", {})
        };

    }
    _goback = () => {
        Utils.goback(this);
    };
    render() {
        var { item } = this.state
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: 'transparent' }]}>

                <View style={{ backgroundColor: colors.white, flex: 1 }}>
                    {/* <Video
                        source={{ uri: item.uri }}
                        paused={true}                                  // Store reference
                        style={{ width: '100%', height: '50%', borderRadius: 6 }}
                        resizeMode='cover'
                    /> */}
                    <PlayMedia />
                </View>
                <View
                    style={{
                        width: nstyles.Width(100),
                        backgroundColor: 'black',
                        paddingBottom: 10,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        zIndex: 10
                    }}
                >
                    <View style={[nstyles.nstyles.nrow, { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: nstyles.khoangcach, marginTop: nstyles.paddingTopMul() + 8 }]}>
                        <TouchableOpacity onPress={this._goback}>
                            <Image
                                source={Images.icBack}
                                resizeMode="contain"
                                style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]}
                            />
                        </TouchableOpacity>
                        <View style={nstyles.nstyles.nIcon20} />
                    </View>


                </View>

            </View>
        );
    }
}

export default ModalXemVideo;
