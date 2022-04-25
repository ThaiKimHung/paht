import React, { Component, Fragment } from 'react'
import { Text, View, Image, SafeAreaView, StyleSheet, Linking, TouchableOpacity, TouchableHighlight } from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import { Images } from '../../../images'
import { Width, nstyles } from '../../../../styles/styles'
import Utils from '../../../../app/Utils'
import { sizes } from '../../../../styles/size'
import { colors } from '../../../../styles'
import Video from 'react-native-video';
import VideoCus from '../../../../components/Video/VideoCus'
import { ConfigScreenDH } from '../../../routers/screen'


export class ImageFileCus extends Component {
    _showArrImage = (arrImage = [], index = 0) => {
        // const imagesURL = [
        //     {
        //         url: 'https://img2.infonet.vn/w490/Uploaded/2020/pjauldz/2018_06_19/5.jpg',
        //     },
        // ];
        Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_ShowListImage, { ListImages: arrImage, index });
    }

    onPressLinkFile = (Link = '') => {
        if (Link) {
            const pathEnd = Link.split('.').pop()
            Utils.nlog('Duoi file', pathEnd)
            if (pathEnd == 'mp4' || pathEnd == 'mov') {
                Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_PlayMedia, { source: Link });
            } else {
                Linking.openURL(Link)
            }
        }
    }
    render() {
        var { dataMedia = [], dataFile = [], widthImg = '', heightImg = '', styleFile = {}, nthis = '', index = 0 } = this.props;
        // Utils.nlog("gia tri data image chi tiết",dataMedia);

        return (
            <View key={"file"} style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                {/* <View style={{justifyContent: 'space-around'}}> */}
                {/* {Image} */}
                {/* <View style={{ height: 10, marginRight: 5, }} /> */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    {dataMedia.length > 0 ? dataMedia.map((item, index) => {
                        // Utils.nlog("Video-----------------", item.url)
                        let isVideo = Utils.checkIsVideo(item.url);
                        return (<TouchableOpacity
                            key={index}
                            onPress={() => {
                                if (isVideo)
                                    Utils.goscreen(nthis, ConfigScreenDH.Modal_PlayMedia, { source: item.url });
                                else
                                    this._showArrImage(dataMedia, index);
                            }}
                            // underlayColor={colors.colorUnderlineLink}
                            style={{
                                width: widthImg ? widthImg : Width(20),
                                height: heightImg ? heightImg : Width(20),
                                marginRight: 5, marginHorizontal: 3
                            }}
                        >
                            {
                                isVideo ?
                                    <VideoCus
                                        source={{ uri: item.url }}
                                        style={{
                                            width: widthImg ? widthImg : Width(20),
                                            height: heightImg ? heightImg : Width(20)
                                        }}
                                        resizeMode='cover'
                                        paused={true}
                                    /> :
                                    <Image
                                        source={{ uri: item.url }}
                                        style={{
                                            width: widthImg ? widthImg : Width(20),
                                            height: heightImg ? heightImg : Width(20),
                                        }}
                                        resizeMode={'cover'}
                                    />
                            }
                            {
                                isVideo ?
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={Images.icVideoBlack} style={[nstyles.nIcon24, { backgroundColor: colors.black_50, padding: 5, borderRadius: 8 }]} />
                                    </View> : null
                            }
                        </TouchableOpacity>)
                    }) : null}
                </View>
                <View style={{}}>
                    {dataFile.length > 0 ? dataFile.map((item, index) => {
                        return (<View key={index} style={[{ paddingVertical: 5 }]}>
                            <TouchableOpacity
                                style={[nstyles.nrow, styles.containerFile, {}, styleFile]}
                                onPress={() => this.onPressLinkFile(item.Link)}
                            >
                                <Image source={Images.icAttached}
                                    style={{ width: Width(3), height: Width(5), tintColor: colors.colorHeaderApp }}
                                    resizeMode={'stretch'} />
                                <Text style={{ marginHorizontal: 5, color: colors.colorHeaderApp, fontSize: sizes.sText14 }} numberOfLines={2}>{item.FileName}</Text>
                            </TouchableOpacity>
                            {/* {dataFile.length > 1 ?
                                <TouchableOpacity
                                    style={[nstyles.nrow, styles.containerFile, { marginLeft: 5 }, styleFile]}
                                    onPress={() => Utils.goscreen(nthis, 'Modal_FileDH', { dataFile: dataFile })}
                                >
                                    <Image source={Images.icAttached}
                                        style={{ width: Width(3), height: Width(5), tintColor: colors.colorHeaderApp }}
                                        resizeMode={'stretch'} />
                                    <Text style={{ marginLeft: 5, color: colors.colorHeaderApp, fontSize: sizes.sText14 }}>+{dataFile.length - 1}</Text>
                                </TouchableOpacity>
                                : null} */}
                        </View>)
                    })
                        : null
                    }

                </View>
                {/* {File} */}

            </View >
        )
    }
}

export default ImageFileCus

const styles = StyleSheet.create({
    containerFile: {
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#EFEFEF',
        borderColor: '#B3B3B3',
        alignItems: 'center'
    }
})