import { Text, View, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { HeaderWidget } from '../../../CompWidgets'
import { ImgWidget } from '../../../Assets'
import Utils from '../../../../../app/Utils';
import ButtonWidget from '../../../CompWidgets/ButtonWidget'
import { colorsWidget } from '../../../../../styles/color';
import { reText } from '../../../../../styles/size';
import { nstyles } from '../../../../../styles/styles';
import TextApp from '../../../../../components/TextApp';
import ImageCus from '../../../../../components/ImageCus';

const ModalThongBaoTaoTin = (props) => {
    const titleHeader = Utils.ngetParam({ props }, 'titleHeader', 'Tạo tin thành công')
    const title = Utils.ngetParam({ props }, 'title', 'Tạo thành công thông tin rao vặt')
    const callback = Utils.ngetParam({ props }, 'callback')

    const onConfirm = () => {
        if (callback) {
            callback()
        } else {
            Utils.goback({ props });
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderWidget
                title={titleHeader}
            />

            <View style={{ marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                    <ImageCus
                        source={ImgWidget.imgTB_TaoTinThanhCong}
                        style={[stModalTBTaoTin.stImage]}
                        resizeMode={'contain'}
                    />
                    <TextApp style={[stModalTBTaoTin.stTitle]}>{title}</TextApp>
                </View>
                <ButtonWidget
                    onPress={() => onConfirm()}
                    style={[stModalTBTaoTin.stButton]}
                    styleText={[stModalTBTaoTin.stTextButton]}
                    text={'Xác nhận'}

                />
            </View>
        </View>
    )
}

const stModalTBTaoTin = StyleSheet.create({
    stImage: { width: 180, height: 200 },
    stTitle: { fontSize: reText(14), marginVertical: 10 },
    stButton: { backgroundColor: 'white', borderWidth: 1, borderColor: colorsWidget.main, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 30, marginTop: 50 },
    stTextButton: { color: colorsWidget.main, }
})

export default ModalThongBaoTaoTin