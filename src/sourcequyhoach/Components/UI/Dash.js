import React from 'react';
import {View} from 'react-native';
import COLOR from '../../Styles/Colors';
import POSITION from '../../Styles/Position';

const Dash = () =>
{
    return (
        <View style = {styles.dashView}>
            <View style={styles.dash}/>
        </View>
    )
}

export default Dash;

const styles = {
    dashView: {
        justifyContent: POSITION.center,
        alignItems: POSITION.center,
    },
    dash: {
        height: 4,
        width: 35,
        backgroundColor: COLOR.grey,
        borderRadius: 3,
        marginVertical:8
    }
};
