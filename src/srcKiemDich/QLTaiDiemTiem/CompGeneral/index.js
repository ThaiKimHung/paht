import React, { Component, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput } from "react-native"
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles } from "../../../../styles/styles"
import { Images } from '../../../images';
import { stDropDownUI, stInputUI, stListCheck, styleComponentUI } from './styleComp';

export const ComponentUI = (props) => {
    const { item, value } = props
    return (
        <View style={styleComponentUI.coverComp}>
            <View style={nstyles.nIcon20}>
                <Image source={item.icon} style={nstyles.nIcon20} resizeMode='contain' />
            </View>
            <View style={styleComponentUI.viewContainComp}>
                <Text style={styleComponentUI.labelComp}>{item.label}</Text>
                <Text style={styleComponentUI.txtValueComp}>{value}</Text>
            </View>
        </View>
    )
}

export const DropDownUI = (props) => {
    const { item, value = '', onPressDrop = () => { }, placeholder = '' } = props
    return (
        <View style={stDropDownUI.coverComp}>
            <Text style={stDropDownUI.labelComp}>{item?.label}</Text>
            <TouchableOpacity onPress={onPressDrop} activeOpacity={0.5}>
                <View style={stDropDownUI.containerComp}>
                    <Text style={stDropDownUI.txtValueComp}>{value ? value : placeholder}</Text>
                    <Image source={Images.icDropDown} style={[nstyles.nIcon16, { tintColor: colors.black_50 }]} resizeMode='contain' />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export const InputUI = (props) => {
    const { item, placeholder = '', onTouchText = () => { }, listSuggest = [], keyIndexSuggest = '', keyDisplaySuggest = '' } = props

    const choseStatus = (item) => {
        onTouchText(` ${item[keyDisplaySuggest]}`)
    }

    return (
        <View style={stInputUI.coverComp}>
            <Text style={stInputUI.labelComp}>{item?.label}</Text>
            <TextInput
                {...props}
                placeholder={placeholder}
                style={stInputUI.inputComp}
                multiline={true}
            />
            <View style={stInputUI.containSuggest}>
                {listSuggest?.map((item, index) => {
                    return (
                        <TouchableOpacity key={item[keyIndexSuggest]} onPress={() => choseStatus(item)} style={stInputUI.touchSuggest}>
                            <Text style={stInputUI.txtSuggest}>{item[keyDisplaySuggest]}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

export const ListCheck = forwardRef((props, ref) => {
    const { item, data = [], keyIndex = '', keyDisplay = '' } = props
    const [listSelect, setlistSelect] = useState([])

    useImperativeHandle(ref, () => ({
        getData: () => {
            return listSelect;
        },
        setData: () => { } // set default
    }));

    const checkItem = (item) => {
        let temp = [...listSelect]
        const find = listSelect.findIndex(e => e[keyIndex] == item[keyIndex])
        if (find == -1) {
            temp = [...temp, item]
            setlistSelect(temp)
        } else {
            temp = temp.filter(e => e[keyIndex] != item[keyIndex])
            setlistSelect(temp)
        }
    }
    return (
        <View style={{ padding: 10 }}>
            <Text style={stDropDownUI.labelComp}>{item?.label}</Text>
            {data?.map((item, index) => {
                return (
                    <TouchableOpacity key={item[keyIndex]} onPress={() => checkItem(item)} style={{ padding: 10}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={listSelect.findIndex(e => e[keyIndex] == item[keyIndex]) == -1 ? Images.icUnCheck : Images.icCheck} style={nstyles.nIcon16} resizeMode='contain' />
                            <Text style={{ paddingLeft: 10, textAlign: 'justify', flex: 1 }} >{item[keyDisplay]}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
})
