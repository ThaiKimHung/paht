import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from './Font';
import Fit from './Fit';
import Color from './Color'

const RadioButton = ({title,checked,onValueChange,disabled})=>
{
    return (
        <TouchableOpacity disabled = {checked || disabled} onPress = {onValueChange} style={styles.container}>
            {checked ?
                <Icon name={'radio-button-on'} size={25} color={disabled ? Color.gray90: Color.primary}/>
                :
                <Icon name={'radio-button-off'} size={25} color={disabled ? Color.gray90: Color.black}/>
            }
            <Text style={styles.title(disabled)}>{title}</Text>
        </TouchableOpacity>
    )
}

export default RadioButton;

export const CheckButton = ({title,checked,onValueChange,disabled})=>
{
    return (
        <TouchableOpacity onPress = {onValueChange} style={styles.container}>
            {checked ?
                <Icon name={'checkbox'} size={25} color={disabled ? Color.gray90: Color.primary}/>
                :
                <Icon name={'square-outline'} size={25} color={disabled ? Color.gray90: Color.black}/>
            }
            <Text style={styles.title(disabled)}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = {
    container:{
        flexDirection:Fit.row,
        alignItems:Fit.center,
        marginVertical:5
    },
    title:disabled =>({
        flex:1,
        fontFamily:Font.fontFamily,
        fontSize:16,
        color:disabled ? Color.gray90 : Color.black,
        marginLeft:10
    })
}
