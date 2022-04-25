import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AddressWidget, ButtonWidget, DropWidget, HeaderWidget, InputWidget } from '../../../CompWidgets'
import { ImgWidget } from '../../../Assets'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colorsWidget } from '../../../../../styles/color'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import { nstyles } from '../../../../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { onChangeDropdown, getListDanhMuc, formatFirstLastName, regexPhoneNumber, isValidPhone } from './HandlerDangTin'
import { setDataTaoSuaTinRaoVat } from '../../../../../srcRedux/actions/widgets'

const LienHe = (props) => {
    const { dataTaoSuaTinRaoVat } = useSelector(state => state.Widgets)
    const userCD = useSelector(state => state.auth.userCD)
    const dispatch = useDispatch()
    const [NguoiLienHe, setNguoiLienHe] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.FullName || '' : userCD?.FullName || '')
    const [SoDienThoai, setSoDienThoai] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.PhoneNumber || '' : userCD?.PhoneNumber || '')
    const [trackingNext, setTrackingNext] = useState(false)

    useEffect(() => {
        trackingButtonNext()
    }, [NguoiLienHe, SoDienThoai])

    const trackingButtonNext = () => {
        if (NguoiLienHe && SoDienThoai) {
            setTrackingNext(true)
        } else {
            setTrackingNext(false)
        }
    }

    const onBack = () => {
        Utils.goback({ props })
    }

    const onNext = () => {
        if (isValidPhone(SoDienThoai)) {
            let objectData = {
                ...dataTaoSuaTinRaoVat,
                FullName: NguoiLienHe,
                PhoneNumber: SoDienThoai
            }
            console.log('[LOG] data object', objectData);
            dispatch(setDataTaoSuaTinRaoVat(objectData))
            Utils.navigate('scMoTaRaoVat')

        } else {
            return Utils.showToastMsg('Thông báo', 'Số điện thoại không đúng dịnh dạng', icon_typeToast.warning, 2000)
        }
    }

    const onPhoneNumberChange = (text) => {
        var cleaned = ('' + text).replace(/\D/g, '')
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            var intlCode = (match[1] ? '+1 ' : ''), number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
            return number;
        }
        return text;
    }

    const onCancel = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn huỷ tạo tin rao vặt?', 'Huỷ', 'Xem lại', () => {
            dispatch(setDataTaoSuaTinRaoVat({}))
            Utils.navigate('scHomeRaoVat')
        })
    }

    return (
        <View style={stLienHe.container}>
            <HeaderWidget
                title={'Liên hệ'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                titleRight={'Huỷ'}
                Sright={{ color: colorsWidget.labelInput }}
                onPressRight={onCancel}
            />
            <View style={stLienHe.body} >
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    {useMemo(() => <InputWidget
                        label={'Người liên hệ'}
                        required
                        placeholder={'Nhập họ tên người liên hệ'}
                        value={formatFirstLastName(NguoiLienHe)}
                        onChangeText={val => setNguoiLienHe(val)}
                    />, [NguoiLienHe])}

                    {useMemo(() => <InputWidget
                        label={'Số điện thoại'}
                        required
                        placeholder={'Nhập số điện thoại'}
                        styleLabel={{ marginTop: 10 }}
                        value={onPhoneNumberChange(SoDienThoai)}
                        onChangeText={val => setSoDienThoai(val)}
                        textContentType='telephoneNumber'
                        dataDetectorTypes='phoneNumber'
                        keyboardType='phone-pad'
                        maxLength={14}
                    />, [SoDienThoai])}
                </KeyboardAwareScrollView>
                <View style={{ paddingBottom: 24 }}>
                    <TextApp style={{ color: colorsWidget.main, marginVertical: 10, fontSize: reText(12) }}>
                        {'Lưu ý: Những mục có dấu (*) là bắt buộc nhập'}
                    </TextApp>
                    <ButtonWidget
                        text='Tiếp theo'
                        style={{ backgroundColor: trackingNext ? colorsWidget.mainOpacity : colorsWidget.grayDropdown }}
                        styleText={{ color: trackingNext ? colorsWidget.main : colorsWidget.placeholderInput }}
                        disabled={!trackingNext}
                        onPress={onNext}
                    />
                </View>
            </View>
        </View>
    )
}
const stLienHe = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        padding: 10
    }
})
export default LienHe