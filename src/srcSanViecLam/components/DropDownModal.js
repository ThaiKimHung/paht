import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, TextStyle, StyleProp, ViewStyle, ImageStyle } from 'react-native'
import Utils from '../../../app/Utils';
import { colorsSVL } from '../../../styles/color';
import ImageCus from '../../../components/ImageCus';
import { ImagesSVL } from '../images';
import { nstyles, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';
import TextApp from '../../../components/TextApp';

type PropsDropDown = React.ComponentProps<typeof TouchableOpacity> & {
    styleContainer: StyleProp<ViewStyle>;
    label: String | undefined;
    stylelabel: StyleProp<TextStyle>;
    KeyTitle: String;
    KeySearch: String;
    isSearch: Boolean;
    styleDrop: StyleProp<ViewStyle>;
    styleImage: StyleProp<ImageStyle>;
    data: Array;
    text: String;
    styleTextTitle: StyleProp<TextStyle>;
    CallBack: (item: any) => void;
    imgIcon: any;
    colorSelect: ColorValue | undefined;
    isValue: Boolean; // dùng cho trường hợp cần thay đổi title khi action 1 sự kiện gì đó
    valueSeleted: Object; // lấy item đang đang được select
    KeyId: String; // lấy key id item đang được select
}

const DropDownModal: React.FC<PropsDropDown> = (props) => {
    const {
        styleContainer,
        label = '', stylelabel,
        text = '', styleTextTitle, styleImage, data = [],
        KeyTitle = '', isSearch = false, KeySearch = '', imgIcon,
        CallBack, styleDrop, onPress, colorSelect = 'black',
        isValue = true, KeyId = '', valueSeleted
    } = props;
    const [value, setValue] = useState(props.valueSeleted);
    const GetItem = (item) => {
        CallBack ? CallBack(item) : null;
        setValue(item)
    }
    useEffect(() => {
        if (!isValue) { // gán giá trị value về rỗng 
            setValue(null);
        }
    }, [isValue])

    useEffect(() => {
        if (props.valueSeleted) { // gán giá trị value về rỗng 
            setValue(props.valueSeleted);
        }
    }, [props.valueSeleted])

    return (
        <View style={[{ marginTop: 10 }, styleContainer]}>
            {label ? <TextApp style={[{ marginBottom: 8, fontSize: reText(16) }, stylelabel]} >{label}</TextApp> : null}
            <TouchableOpacity
                style={[stDropDown.container, styleDrop]}
                onPress={() => {
                    onPress ? onPress() :
                        Utils.navigate('Modal_Button', {
                            Data: data,
                            KeyTitle: KeyTitle,
                            Search: isSearch,
                            KeySearch: KeySearch,
                            CallBack: GetItem,
                            ItemSelected: value,
                            KeyId: KeyId
                        })
                }}>
                <Text style={[{ flex: 1, color: value ? colorSelect : colorsSVL.grayTextLight, fontSize: reText(14) },
                    styleTextTitle]} >
                    {value && isValue ? value[KeyTitle] : text}</Text>
                <View>

                    <ImageCus source={imgIcon ? imgIcon : ImagesSVL.icDrop} resizeMode='contain'
                        style={[nstyles.nIcon10, styleImage]} />
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default DropDownModal

const stDropDown = StyleSheet.create({
    container: {
        height: 45,
        backgroundColor: colorsSVL.grayBgrInput,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 4,
    }

})
