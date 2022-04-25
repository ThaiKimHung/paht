import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { nstyles, Width } from '../../../../styles/styles'
import { colorsWidget } from '../../../../styles/color'
import { ImgWidget } from '../../Assets'
import TextApp from '../../../../components/TextApp'
import { isPad } from '../../../../styles/size'

const ItemVertical = (props) => {
    const { item, showicRight = false, onPress = () => { }, showLine = true, style = {}, keyItem = [], showHoline = true, onPressRight = () => { } } = props
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}
            style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }, style]}
        >
            <Image source={ImgWidget.icApp} style={nstyles.nIcon50} />
            <View style={{ flex: 1, marginLeft: 10, }} >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }} >
                    <View style={{ flex: showicRight ? 0.75 : 1 }} >
                        <TextApp style={{}}>{item ? item?.[keyItem[0]] : null}</TextApp>
                        <TextApp style={{ marginTop: 5 }} >{(showHoline ? 'Holline: ' : '') + (item ? item?.[keyItem[1]] : null)}</TextApp>
                    </View>
                    {showicRight ?
                        <TouchableOpacity activeOpacity={0.5} onPress={onPressRight} style={{ flex: 0.25, alignItems: 'flex-end' }} >
                            <Image source={ImgWidget.icHotline} style={[nstyles.nIcon81]} resizeMode='contain' />
                        </TouchableOpacity  >
                        : <View style={{ height: Width(isPad ? 14 : 20) }} />
                    }
                </View>
                {showLine && <View style={{ borderBottomWidth: 1, borderBottomColor: colorsWidget.borderDropdown }} />}
            </View>
        </TouchableOpacity>
    )
}

export default ItemVertical

const styles = StyleSheet.create({

})