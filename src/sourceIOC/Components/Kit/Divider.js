import React from 'react';
import Color from './Color';
import {StyleSheet, View} from 'react-native';

const Horizontal = props =>
{
    return (
        <View style = {{...styles.horizontal,...props.style}}/>
    )
}

const Vertical = props =>
{
    return (
        <View style = {{...styles.vertical,...props.style}}/>
    )
}

export default {
    Horizontal,
    Vertical
};

const styles = StyleSheet.create({
    horizontal:{
        height:1,
        backgroundColor:Color.gray30
    },
    vertical:{
        width:1,
        height:'100%',
        backgroundColor:Color.gray30
    }
})

