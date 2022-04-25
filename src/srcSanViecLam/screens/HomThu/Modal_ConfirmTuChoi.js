import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, Alert, TextInput, Animated, KeyboardAvoidingView, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import ImageCus from '../../../../components/ImageCus'
import TextApp from '../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../styles/color'
import FontSize from '../../../../styles/FontSize'
import { reText } from '../../../../styles/size'
import { Height, nstyles, Width } from '../../../../styles/styles'
import { UpdateStatusTuyenDung } from '../../apis/apiSVL'
import common from '../../common'
import ButtonSVL from '../../components/ButtonSVL'

const ViewKeyBoard = Platform.select({
    ios: () => KeyboardAvoidingView,
    android: () => View
})();

class Modal_ConfirmTuChoi extends Component {
    constructor(props) {
        super(props)
        this.item = Utils.ngetParam(this, 'item', '')
        this.title = Utils.ngetParam(this, 'title', '')
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.state = {
            opacity: new Animated.Value(0),
            note: ''
        }
    }

    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 320);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    rejectInterView = async () => {
        if (!this.state.note) {
            return Utils.showToastMsg('Thông báo', 'Vui lòng nhập lý do từ chối phỏng vấn!', icon_typeToast.warning, 2000)
        }
        Utils.showMsgBoxYesNo(this, 'Thônng báo', 'Bạn có chắc muốn từ chối phỏng vấn ?', 'Từ chối', 'Xem lại', async () => {
            let body = {
                "Status": common.DEFINE_STATUS.TUCHOIPHONGVAN,
                "IdRow": this.item?.IdUngTuyen
            }
            Utils.setToggleLoading(true)
            let res = await UpdateStatusTuyenDung(body)
            Utils.setToggleLoading(false)
            Utils.nlog('LOG REJECT INTERVIEW', res)
            if (res?.status == 1) {
                Utils.showToastMsg('Thông báo', 'Từ chối phỏng vấn thành công!')
                this.props.LoadListApplied()
                this.callback(common.DEFINE_STATUS.TUCHOIPHONGVAN)
                Utils.goback(this)
            } else {
                Utils.showToastMsg('Thông báo', res?.message?.error || 'Từ chối phỏng vấn thành công!')
            }
        })
    }

    render() {
        return (
            <ViewKeyBoard style={[{ flex: 1, justifyContent: 'flex-end' }]} behavior='padding'>
                <Animated.View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, backgroundColor: colors.black, opacity: this.state.opacity
                }} />
                <View style={{
                    backgroundColor: colors.white,
                    borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'flex-end'
                }} >
                    <View style={{ paddingVertical: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ height: 5, backgroundColor: 'grey', width: Width(30), borderRadius: 25 }} />
                    </View>
                    {/* <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ paddingHorizontal: 15, flex: 1 }}
                    > */}
                    <View style={{ ...stModal_ConfirmTuChoi.stView, marginTop: 33 }}>
                        <TextApp style={[stModal_ConfirmTuChoi.stTextBold]}>{'Xác Nhận'}</TextApp>
                    </View>

                    <View style={{ ...stModal_ConfirmTuChoi.stView, marginHorizontal: 15 }}>
                        <TextApp numberOfLines={2} style={{ fontSize: reText(14), textAlign: 'center' }}>
                            {'Bạn có chắc từ chối phỏng vấn từ doanh nghiệp/ cá nhân này?'}
                        </TextApp>
                    </View>
                    <View style={{ marginVertical: 30, marginHorizontal: 15 }}>
                        <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{'Lý do'}</Text>

                        <TextInput
                            multiline={true}
                            style={{ height: 80, borderRadius: 4, backgroundColor: colorsSVL.grayBgrInput, paddingHorizontal: 10, textAlignVertical: 'top' }}
                            placeholder={'-- Nhập nội dung từ chối phỏng vẫn --'}
                            onChangeText={text => this.setState({ note: text })}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                            }}
                        />

                    </View>
                    <View style={[stModal_ConfirmTuChoi.stViewButton, { marginVertical: 12 }]}>
                        <ButtonSVL
                            onPress={this._goback}
                            style={{ backgroundColor: colorsSVL.grayBgrInput, paddingVertical: 10, paddingHorizontal: 70, }}
                            styleText={[stModal_ConfirmTuChoi.stTextNameBold]}
                            text='Huỷ'
                            colorText={"black"}
                        />
                        <View style={{ width: FontSize.scale(11) }} />
                        <ButtonSVL
                            onPress={this.rejectInterView}
                            style={{ backgroundColor: colorsSVL.organeMainSVL, paddingVertical: 10, paddingHorizontal: 50, }}
                            styleText={[stModal_ConfirmTuChoi.stTextNameBold]}
                            text='Từ chối PV'
                            colorText={colorsSVL.white}
                        />
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>
            </ViewKeyBoard>
        )
    }
}

export default Utils.connectRedux(Modal_ConfirmTuChoi, null, true)

const stModal_ConfirmTuChoi = StyleSheet.create({
    stContainer: {
        flex: 1, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: colorsSVL.white, height: Platform.OS == 'ios' ? Height(55) : Height(64), position: 'absolute', bottom: 0, left: 0, right: 0
    },
    stView: {
        alignItems: 'center', justifyContent: 'center', marginTop: 23
    },
    stViewNormal: {
        alignItems: 'center', justifyContent: 'center', marginTop: 8
    },
    stTextBold: {
        fontWeight: 'bold', fontSize: reText(18)
    },
    stTextNormal: {
        fontSize: reText(12),
    },
    stTextNameBold: {
        fontSize: reText(14), fontWeight: 'bold'
    },
    stViewBS: {
        marginTop: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
    },
    stViewBS1: {
        paddingVertical: 2,
        backgroundColor: colorsSVL.grayBgrInput,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stTextBS1: {
        fontSize: reText(12), color: colorsSVL.grayTextLight
    },
    stViewBS2: {
        paddingVertical: 2,
        backgroundColor: colorsSVL.white,
        borderColor: colorsSVL.organeMainSVL,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stTextBS2: {
        fontSize: reText(12),
        color: colorsSVL.organeMainSVL
    },
    stViewButton: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
