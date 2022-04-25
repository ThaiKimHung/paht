import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Color,ActivityIndicator} from './index';

const Loading = () =>
{

    return (
        <View style={styles.container}>
            <ActivityIndicator color = {Color.secondary}/>
        </View>
    )
}

export default Loading;

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    }
})
