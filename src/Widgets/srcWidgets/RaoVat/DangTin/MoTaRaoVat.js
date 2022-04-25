import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AddressWidget, ButtonWidget, DropWidget, HeaderWidget, InputWidget, PickerWidget } from '../../../CompWidgets'
import { ImgWidget } from '../../../Assets'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colorsWidget } from '../../../../../styles/color'
import TextApp from '../../../../../components/TextApp'
import { reText } from '../../../../../styles/size'
import { nstyles } from '../../../../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { onChangeDropdown, getListDanhMuc, formatFirstLastName, regexPhoneNumber, isValidPhone, handlerListInput } from './HandlerDangTin'
import { setDataTaoSuaTinRaoVat } from '../../../../../srcRedux/actions/widgets'

const MoTaRaoVat = (props) => {
    const { dataTaoSuaTinRaoVat } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()
    const [MoTa, setMoTa] = useState(dataTaoSuaTinRaoVat?.isEdit ? dataTaoSuaTinRaoVat?.MoTaSanPham || '• ' : '• ')
    const refFile = useRef()
    const [trackingFile, setTrackingFile] = useState('')
    const [trackingNext, setTrackingNext] = useState(false)

    useEffect(() => {
        if (trackingFile.length > 0 && MoTa.length > 5)
            setTrackingNext(true)
        else
            setTrackingNext(false)

    }, [trackingFile, MoTa])

    const onCancel = () => {
        Utils.showMsgBoxYesNoTop('Thông báo', 'Bạn có chắc muốn huỷ tạo tin rao vặt?', 'Huỷ', 'Xem lại', () => {
            dispatch(setDataTaoSuaTinRaoVat({}))
            Utils.navigate('scHomeRaoVat')
        })
    }

    const onBack = () => {
        Utils.goback({ props })
    }

    const onNext = () => {
        let objectData = {
            ...dataTaoSuaTinRaoVat,
            MoTaSanPham: MoTa,
            ListFileDinhKem: trackingFile,
        }
        console.log('[LOG] data object', objectData);
        dispatch(setDataTaoSuaTinRaoVat(objectData))
        Utils.navigate('scXemTruocTinRaoVat')
    }

    return (
        <View style={stMoTaRaoVat.container}>
            <HeaderWidget
                title={'Chi tiết sản phẩm'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                titleRight={'Huỷ'}
                Sright={{ color: colorsWidget.labelInput }}
                onPressRight={onCancel}
            />
            <View style={stMoTaRaoVat.body}>
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    <PickerWidget
                        ref={refFile}
                        trackingFile={val => setTrackingFile(val)}
                        dataFile={dataTaoSuaTinRaoVat?.ListFileDinhKem || []}
                    />
                    {useMemo(() => <InputWidget
                        label={'Mô tả sản phẩm'}
                        required
                        placeholder={'Nội dung mô tả sản phẩm'}
                        value={MoTa}
                        onChangeText={val => setMoTa(handlerListInput(val, '•'))}
                        multiline
                        styleInput={{ maxHeight: 350, minHeight: 100, lineHeight: 25, textAlignVertical: 'top' }}
                        styleLabel={{ color: colorsWidget.main }}
                        styleValueRequired={{ color: colorsWidget.main }}
                    />, [MoTa])}
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
const stMoTaRaoVat = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        padding: 10
    }
})
export default MoTaRaoVat