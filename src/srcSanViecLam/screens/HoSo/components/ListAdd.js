import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import Utils from '../../../../../app/Utils'
import MultiBulletInput from '../../../../../components/MultiBulletInput'
import TextApp from '../../../../../components/TextApp'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'


const ListAdd = forwardRef((props, ref) => {
    const { title = '', valueDefault = '', Call_Back = () => { }, symbolText = '' } = props

    const textFrist = symbolText + ' ';
    const [valueInput, setValueInput] = useState({
        valueArr: [],
        value: valueDefault ? valueDefault : textFrist,
    })

    const refInput = useRef(null)

    useEffect(() => {
        Call_Back(valueInput.value);
    }, [valueInput])

    useImperativeHandle(ref, () => ({
        getData: () => {
            return valueInput.value;
        },
    }));

    const xulyTextMota = (val = '', refInputNow) => {
        try {
            if (val.length >= 1 && val[0] != symbolText) {
                val = textFrist + val;
            }
            if (val.length > 2 && val.substring(val.length - 2, val.length) === '\n●') {
                val = val.slice(0, -2);
            }
            let tempVal = '';
            let tempArr = val.split("\n");
            if (tempArr.length >= 2) {
                for (let index = 0; index < tempArr.length; index++) {
                    var strLine = tempArr[index];
                    if (strLine == '' && index != 0) {
                        strLine = textFrist;
                    }
                    if (strLine == symbolText) {
                        strLine = '';
                    }
                    if (index == tempArr.length - 1)
                        tempVal += strLine;
                    else {
                        if (tempArr[index + 1] === symbolText)
                            tempVal += strLine;
                        else {
                            if (!(index === 0 && strLine === ''))
                                tempVal += strLine + '\n';
                        }
                    }
                }
                val = tempVal;
            }
            return val;
        } catch (error) {
            return val;
        }

    }
    Utils.nlog('gia tri state', valueInput)
    return (
        <View style={{ flex: 1, backgroundColor: colors.white, marginTop: 10, paddingTop: 15 }}
        >
            <TextApp style={[stListAdd.bold, {
                marginBottom: 15, color: colorsSVL.blueMainSVL,
                fontSize: reText(16)
            }]} >{title}</TextApp>

            <View style={{ borderBottomWidth: 0.8, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    ref={refInput}
                    value={valueInput.value}
                    style={{ flex: 1, lineHeight: 20, paddingVertical: 10 }}
                    multiline
                    onChangeText={(text) => {
                        setValueInput({
                            value: xulyTextMota(text, refInput?.current)
                        })
                    }}
                />
            </View>
        </View>
    )
})

export default ListAdd

const stListAdd = StyleSheet.create({
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
})
