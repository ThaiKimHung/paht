import React, { Component } from 'react'
import { Linking } from 'react-native'
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import Video from 'react-native-video'
import { GetDeailTrangTinh } from '../../../apis/apiapp'
import Utils from '../../../../app/Utils'
import ButtonCom from '../../../../components/Button/ButtonCom'
import WebViewCus from '../../../../components/WebViewCus'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { Height, nColors, nstyles, nwidth, Width } from '../../../../styles/styles'
import { isIphoneX } from 'react-native-iphone-x-helper'
import VideoCus from '../../../../components/Video/VideoCus'
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus'
import { HeaderCus } from '../../../../components'
import UtilsApp from '../../../../app/UtilsApp'


export class ModalHuongDanVT extends Component {
    constructor(props) {
        super(props)
        this.dataHD = Utils.ngetParam(this, 'dataHD', '');
        this.state = {
            dataHuongDan: this.dataHD
        };
    }

    componentDidMount() {
        if (this.dataHD == '') {
            this.GetTTHuongDan();
        }
    }

    GetTTHuongDan = async () => {
        let res = await GetDeailTrangTinh(1);
        if (res && res.status == 1 && res.data) {
            this.setState({ dataHuongDan: res.data })
        }
        Utils.nlog('Gia tri data huong dan=====ssssss', this.state.dataHuongDan)
    }

    goback = () => {
        Utils.goback(this);
    }
    _RenderFile = (item, index) => {
        const { LinkFile } = item;
        if (LinkFile == null) {

        } else {
            var isImage = Utils.checkIsImage(LinkFile)
            var isVideo = Utils.checkIsVideo(LinkFile)
        }
        return (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(LinkFile)}
                style={[{
                    backgroundColor: colors.colorGrayBGCB, marginVertical: 2.5,
                    alignItems: 'center', paddingVertical: 3,
                }]}>
                {
                    isImage == true ? <View>
                        <Image source={{ uri: LinkFile }} style={{ width: 200, height: 200 }} resizeMode='contain' />
                    </View> : null
                }
                {
                    isVideo == true ? <View>
                        <VideoCus
                            ref={(ref: Video) => { this.video = ref }}
                            /* For ExoPlayer */
                            source={{ uri: LinkFile }}
                            // source={require('./videos/tom_and_jerry_31.mp4')}
                            style={{ width: nwidth(), height: nwidth() * 0.5, }}
                            // rate={this.state.rate}
                            paused={true}

                        />
                    </View> : null
                }

                {!isImage && !isVideo ? <View style={{ flexDirection: 'row' }}>
                    <Image source={Images.icAttached} style={nstyles.nIcon20} resizeMode='contain' />
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text
                            numberOfLines={2}
                            style={{ fontSize: reText(14), paddingRight: 10, }}>
                            {item.FileName}
                        </Text>
                    </View>
                </View> : null}


            </TouchableOpacity>
        )
    }

    render() {
        const { LinkFile, NoiDung } = this.state.dataHuongDan;

        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, }]}>
                <View style={[nstyles.nbody, {}]}>
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        iconLeft={Images.icBack}
                        title={UtilsApp.getScreenTitle("Modal_HuongDanVT", 'Giới thiệu & hướng dẫn')}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={() => { Utils.goback(this, null); }}
                    />
                    <View style={{ backgroundColor: colors.white, flex: 1, paddingVertical: 10, paddingHorizontal: 15, paddingBottom: isIphoneX() ? 20 : 10 }}>
                        <AutoHeightWebViewCus source={{ html: NoiDung ? NoiDung : '<div></div>' }} scrollEnabled={true} textLoading={'Đang tải nội dung'} />
                        <View style={[{ paddingVertical: 10, width: '100%', }]}>
                            <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.colorGrayText }}>
                                {'File đính kèm:'}
                            </Text>
                            {
                                LinkFile ? <View>
                                    {
                                        this._RenderFile(this.state.dataHuongDan, 1)
                                    }
                                </View> : null
                            }
                        </View>

                        <ButtonCom
                            onPress={() => this.goback()}
                            style={
                                {
                                    width: Width(30),
                                    borderRadius: 6,
                                    alignSelf: 'center'

                                }}
                            txtStyle={{ color: colors.white }}
                            text={'Quay lại'}
                        />
                    </View>

                </View>
            </View>

        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(ModalHuongDanVT, mapStateToProps, true);
