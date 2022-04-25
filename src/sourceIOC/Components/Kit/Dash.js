import React from 'react';
import {View} from 'react-native';
import COLOR from './Color';
import Fit from './Fit';

const Dash = ()=>
{
    return (
        <View style={styles.container}>
            <View style={styles.dashView}/>
        </View>
    )
}

export default Dash;

const styles = {
    container:{
        justifyContent:Fit.center,
        alignItems:Fit.center,
        marginTop: 30,
    },
    dashView:{
        height:5,
        width:40,
        backgroundColor:COLOR.gray30,
        borderRadius:3,
    }
}
