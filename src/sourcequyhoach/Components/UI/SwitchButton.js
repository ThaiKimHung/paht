import React from 'react';
import {
    View,
    Text,
    Switch
} from 'react-native';
import FONT from '../../Styles/Font';
import COLOR from '../../Styles/Colors';
import POSITION from '../../Styles/Position';

const SwitchButton = ({title,checked,onValueChange,trackColor})=>
{

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.switchView}>
                <Text style={styles.status}>{checked ? 'On' :'Off'}</Text>
                <Switch
                    onValueChange={onValueChange}
                    value={checked}
                    trackColor={trackColor}
                />
            </View>
        </View>
    )
}

export default SwitchButton;

const styles = {
    container:{
        marginVertical:10
    },
    title:{
        fontFamily:FONT.FontFamily,
        fontSize:15,
        color:COLOR.black,
        marginBottom:5
    },
    switchView:{
        flexDirection:POSITION.row,
        alignItems:POSITION.center
    },
    status:{
        fontFamily:FONT.FontFamily,
        fontSize:16,
        color: COLOR.darkGray,
        width:30
    }
}
