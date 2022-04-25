import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import POSITION from '../../Styles/Position';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';

const RadioButton = ({title,checked,onValueChange,disabled})=>
{
    return (
        <TouchableOpacity disabled = {checked || disabled} onPress = {onValueChange} style={styles.container}>
            {checked ?
                <Icon name={'radio-button-on'} size={25} color={disabled ? COLOR.grey: COLOR.blue}/>
                :
                <Icon name={'radio-button-off'} size={25} color={disabled ? COLOR.grey: COLOR.black}/>
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
                <Icon name={'checkbox'} size={25} color={disabled ? COLOR.grey: COLOR.blue}/>
                :
                <Icon name={'square-outline'} size={25} color={disabled ? COLOR.grey: COLOR.black}/>
            }
            <Text style={styles.title(disabled)}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = {
    container:{
        flexDirection:POSITION.row,
        alignItems:POSITION.center,
        marginVertical:3
    },
    title:disabled =>({
        flex:1,
        fontFamily:FONT.FontFamily,
        fontSize:16,
        color:disabled ? COLOR.grey : COLOR.black,
        marginLeft:10
    })
}
