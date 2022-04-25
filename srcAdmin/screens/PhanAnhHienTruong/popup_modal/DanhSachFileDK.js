import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, Linking } from 'react-native';
import Utils from '../../../../app/Utils';
import { nstyles, colors, sizes } from '../../../../styles';
import { Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import styles from '../styles';
import { appConfig } from '../../../../app/Config';
import { ConfigScreenDH } from '../../../routers/screen';
class DanhSachFileDK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Utils.ngetParam(this, 'data', [])
        };
    }
    goback = () => {
        Utils.goback(this)
    }

    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: uri });
        else
            Linking.openURL(uri);
    }

    render() {
        const { data } = this.state
        Utils.nlog('datafile', data)
        return (
            <View style={[{ backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    margin: 15, backgroundColor: colors.white,
                    padding: 15, width: Width(85), alignSelf: 'center', borderRadius: 3
                }}>
                    <Text style={[styles.text16, { fontWeight: "600" }]}>Danh sách tập tin đính kèm</Text>
                    {data.map((item, index) =>
                        <TouchableHighlight
                            key={index}
                            onPress={this.onOpenFile(appConfig.domain + item.url)}
                            underlayColor={colors.greyLight}
                            style={{ marginTop: Width(2), width: Width(78), paddingVertical: Width(3) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={Images.icAttached} style={{ width: Width(2), height: nstyles.Height(2), alignSelf: 'center' }} resizeMode='stretch' />
                                <Text style={{ width: Width(55), marginLeft: Width(3) }} numberOfLines={2}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    <TouchableOpacity onPress={this.goback}>
                        <Text style={{ color: colors.softBlue, fontWeight: '600', paddingTop: Width(4) }}>ĐÓNG</Text>
                    </TouchableOpacity>
                </View>
            </View >

        );
    }
}

export default DanhSachFileDK;
