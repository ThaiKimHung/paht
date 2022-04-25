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
import { Height, heightHed, nColors, nstyles, nwidth, Width } from '../../../../styles/styles'
import { isIphoneX } from 'react-native-iphone-x-helper'
import VideoCus from '../../../../components/Video/VideoCus'
import { HeaderCus } from '../../../../components'
import UtilsApp from '../../../../app/UtilsApp'
import FontSize from '../../../../styles/FontSize'
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus'


class Policy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHuongDan: ''
        };
        this.callback = Utils.ngetParam(this, "callback", () => { })
    }

    componentDidMount() {
        this.GetTTHuongDan();
    }

    GetTTHuongDan = async () => {
        let res = await GetDeailTrangTinh(8);
        if (res && res.status == 1 && res.data) {
            this.setState({ dataHuongDan: res.data })
        }
        Utils.nlog('Gia tri data huong dan=====ssssss', this.state.dataHuongDan)
    }

    goback = () => {
        Utils.goback(this);
        if (this.callback && typeof (this.callback) == 'function') {
            this.callback()
        }
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
        Utils.nlog('Gia tri data huong dan=====NoiDung', NoiDung)
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, paddingVertical: FontSize.Height(5), paddingHorizontal: FontSize.Width(5) }]}>
                <View style={[{ justifyContent: 'center', flex: 1, paddingBottom: 100 }]}>
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        styleContainer={{ paddingTop: 0, height: Height(5), borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                        iconLeft={Images.icBack}
                        title={'Quyền và trách nhiệm'}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={() => { Utils.goback(this, null); }}
                    />
                    <View style={{
                        backgroundColor: colors.white, paddingVertical: 10, flex: 1,
                        paddingHorizontal: 15, paddingBottom: isIphoneX() ? 20 : 10,
                        maxHeight: Height(50), borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                    }}>
                        <AutoHeightWebViewCus source={{ html: NoiDung ? NoiDung : '<div></div>' }} scrollEnabled={true} textLoading={'Đang tải nội dung'} />
                        <View style={[{ paddingVertical: 10, width: '100%', }]}>
                            {
                                LinkFile ? <View>
                                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.colorGrayText }}>
                                        {'File đính kèm:'}
                                    </Text>
                                    {
                                        this._RenderFile(this.state.dataHuongDan, 1)
                                    }
                                </View> : null
                            }
                        </View>

                        <ButtonCom
                            onPress={() => this.goback(this)}
                            style={
                                {
                                    width: Width(30),
                                    borderRadius: 6,
                                    alignSelf: 'center'

                                }}
                            txtStyle={{ color: colors.white }}
                            text={'Tiếp tục'}
                        />
                    </View>

                </View>
            </View>

        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    menu: state.menu
});
export default Utils.connectRedux(Policy, mapStateToProps, true);
