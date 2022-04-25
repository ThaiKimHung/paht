import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'

const HeaderTitle = (props) => {
    const { text = '', titleSub = '' } = props
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 4, height: 18, backgroundColor: colorsSVL.blueMainSVL, marginRight: 8 }} />
                <TextApp style={[stHeaderTitle.bold, { fontSize: reText(17) }]} > {text}</TextApp>
            </View>
            {titleSub ? <TextApp style={{ color: '#ADADAD', marginTop: 8, fontSize: reText(13) }}>{titleSub}</TextApp> : null}
        </View>
    )
}

export default HeaderTitle

const stHeaderTitle = StyleSheet.create({
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    }
})
