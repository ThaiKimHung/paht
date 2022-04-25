import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { Images } from '../../../images'
import ImageZoom from '../../../../chat/Component/ImageZoom';
import FontSize from '../../../../styles/FontSize'
const PhotoPickerView = (props) => {
    const { name, data, setData } = props
    const onResponse = (item) => {
        Utils.nlog("item", item);
        if (item?.uri) {
            setData(item);
        } else {
        }
    }
    const prevMedia = () => {
        Utils.navigate('Modal_ShowListImage', { ListImages: [{ url: data.uri }], index: 0 });
    }
    const onPressPicker = () => {
        Utils.navigate('ModalCamVideoCus', { onResponse: onResponse, showLeft: false, OptionsCam: 1, "typeCamera": 1 })
    }
    Utils.nlog("item---1111", data);
    return (
        <View style={{ width: '100%', paddingHorizontal: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: FontSize.reText(18), color: colors.black_80, paddingVertical: FontSize.scale(10) }}>{name || 'CMND/CCCD mặt trước'}</Text>
            <TouchableOpacity onPress={onPressPicker} style={{
                width: '100%', height: 200, backgroundColor: colors.greyLight,
                alignItems: 'center', justifyContent: 'center', borderRadius: FontSize.scale(7)
            }}>
                <Image resizeMode='cover' source={data ? { uri: data.uri } : Images.icCamera} style={{ width: data ? '100%' : 40, height: data ? 200 : 40, borderRadius: FontSize.scale(7) }}>
                </Image>
                {
                    data ? <TouchableOpacity onPress={prevMedia} style={{ position: 'absolute', top: FontSize.scale(7), left: FontSize.scale(7), zIndex: 10, padding: FontSize.scale(10), backgroundColor: colors.lightGreyBlue_50, borderRadius: FontSize.scale(7) }}>
                        <Image resizeMode='contain' source={Images.icShowPass} style={{
                            width: 25, height: 25,
                            borderRadius: FontSize.scale(7), tintColor: 'white'
                        }}>
                        </Image>
                    </TouchableOpacity> : null
                }
            </TouchableOpacity>

        </View>
    )
}

export default PhotoPickerView

const styles = StyleSheet.create({})
