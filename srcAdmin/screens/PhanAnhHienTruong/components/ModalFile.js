import React, { Component } from 'react'
import {
    Text,
    View,
    KeyboardAwareScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
    ScrollView,
    FlatList
} from 'react-native'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { Width, khoangcach, nstyles, Height, paddingTopMul } from '../../../../styles/styles'
import { sizes } from '../../../../styles/size'
import { Images } from '../../../images'
import HeaderModal from './HeaderModal'
import { ConfigScreenDH } from '../../../routers/screen'
// import {  } from 'react-native-keyboard-aware-scroll-view'

export class ModalFile extends Component {
    constructor(props) {
        super(props)
        this.dataFile = Utils.ngetParam(this, 'dataFile', {})
        this.state = {

        }
    }

    _renderLink = ({ item, index }) => {
        var { FileName, Link } = item
        return (
            <TouchableOpacity
                style={[nstyles.nrow, styles.containerFile, { width: Width(90), paddingTop: 15 }]}
                onPress={() => this.onPressLinkFile(Link)}
            >
                <Image source={Images.icAttached}
                    style={{ width: Width(3), height: Width(6), tintColor: colors.colorHeaderApp }}
                    resizeMode={'stretch'} />
                <Text style={{ marginLeft: 10, fontSize: sizes.sText16 }} numberOfLines={1}>{FileName}</Text>
            </TouchableOpacity>
        )
    }
    onPressLinkFile = (Link = '') => {
        if (Link) {
            const pathEnd = Link.split('.').pop()
            Utils.nlog('Duoi file', pathEnd)
            if (pathEnd == 'mp4' || pathEnd == 'mov') {
                Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: Link });
            } else {
                Linking.openURL(Link)
            }
        }
    }

    onPressLinkFile = (Link = '') => {
        if (Link) {
            const pathEnd = Link.split('.').pop()
            Utils.nlog('Duoi file', pathEnd)
            if (pathEnd == 'mp4' || pathEnd == 'mov') {
                Utils.goscreen(this, ConfigScreenDH.Modal_PlayMedia, { source: Link });
            } else {
                Linking.openURL(Link)
            }
        }
    }

    render() {
        var dataFile = this.dataFile
        return (
            <View style={{ flexGrow: 1 }}
            // contentContainerStyle={{ flexGrow: 1 }}
            // showsVerticalScrollIndicator={false}
            >
                <View style={{
                    left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.black_60,
                    // alignItems: 'center',
                }} onTouchEnd={() => Utils.goback(this)} />
                <View style={{ backgroundColor: colors.black_60 }}>
                    <View style={{
                        // alignSelf: 'center',
                        justifyContent: 'flex-end',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingBottom: Width(50),
                    }}>
                        <HeaderModal
                            _onPress={() => Utils.goback(this)}
                            multiline={true}
                            title={`Danh sách tệp đính kèm`} />
                        <FlatList
                            contentContainerStyle={{}}
                            data={dataFile}
                            renderItem={this._renderLink}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export default ModalFile

const styles = StyleSheet.create({
    containerFile: {
        borderRadius: 10,
        paddingHorizontal: khoangcach,
        paddingVertical: 5,
        borderColor: colors.colorHeaderApp,
        alignItems: 'center'
    }
})
