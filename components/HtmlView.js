import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { reText } from '../styles/size';
interface Props {
    style: Object;
    html: String
}
const HtmlViewCom = (props: Props) => {
    return (
        <View style={[{ flex: 1 }, props.style]}>
            <HTMLView
                value={`<div>${props.html}</div>`}
                style={{ flex: 1 }}
                stylesheet={htmlContentStylesheet}
            />
        </View>
    )
}
const htmlContentStylesheet = StyleSheet.create({
    div: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        flexShrink: 1,
        flexGrow: 1,

        fontSize: Platform.isPad ? reText(16) : reText(14),
    },

});
export default HtmlViewCom
