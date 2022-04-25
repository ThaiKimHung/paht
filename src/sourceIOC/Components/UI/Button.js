import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import POSITION from '../../Styles/Position';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';

export const BaseButton = props =>
{
    return (
        <TouchableOpacity
            style = {styles.btnBaseContainer(props.disabled)}
            onPress = {props.onPress}
        >
            <Text style={styles.btnBaseTitle(props.disabled)}>{props.title}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    btnBaseContainer:(disabled)=>({
        marginTop:5,
        height:POSITION.buttonHeight,
        backgroundColor:disabled ? COLOR.whiteGray : COLOR.blue,
        justifyContent:POSITION.center,
        alignItems:POSITION.center
    }),
    btnBaseTitle:(disabled)=>({
        fontFamily:FONT.FontFamily,
        fontSize:16,
        color:disabled ? COLOR.gray : COLOR.white,
        fontWeight: FONT.Bold
    })
});

