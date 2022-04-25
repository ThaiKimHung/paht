import { ScrollView, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { colorsWidget } from '../../../styles/color'
import { InputWidget, DropWidget, ButtonWidget, AddressWidget } from '../CompWidgets';

const ExampleCompWidget = () => {
    const [text, setText] = useState('')
    const refAddress = useRef()

    const send = () => {
        let dataAddress = refAddress?.current?.getData()
        console.log('data address', dataAddress)
    }
    return (
        <View style={{ padding: 10 }}>
            <ScrollView >
                <Text>EXAMPLE</Text>
                <ButtonWidget
                    text='Button'
                />
                <View style={{ height: 20 }} />
                <ButtonWidget
                    text='Button'
                    style={{ backgroundColor: colorsWidget.mainOpacity }}
                    styleText={{ color: colorsWidget.main }}
                    onPress={send}
                />
                <View style={{ height: 20 }} />
                <DropWidget
                    placeholder={'Dropdown'}
                    value={'Giá từ 2 triệu'}
                    onPress={() => { alert(1) }}
                    hideLabel
                />
                <View style={{ height: 20 }} />
                <DropWidget
                    placeholder={'Dropdown'}
                    value={'Giá từ 2 triệu'}
                    onPress={() => { alert(1) }}
                    style={{
                        backgroundColor: colorsWidget.grayDropdown,
                        borderRadius: 6,
                        borderWidth: 0
                    }}
                    label={'Danh mục'}
                // required
                // valueRequired='(vnđ)*'
                // styleValueRequired={{color:'red'}}
                />
                <View style={{ height: 20 }} />

                <InputWidget
                    onChangeText={text => setText(text)}
                    label={'Danh mục'}
                    required
                    valueRequired='(vnđ)*'
                    placeholder={'Nhập danh mục'}
                // styleValueRequired={{ color: 'red' }}
                // value={''} 
                />
                <View style={{ height: 20 }} />
                <AddressWidget
                    ref={refAddress}
                    IDTinhThanh={79}
                    IDQuanHuyen={767}
                    IdXaPhuong={20625}
                    DiaChi={'66 Tran Tan'}
                />
            </ScrollView>
        </View>
    )
}

export default ExampleCompWidget