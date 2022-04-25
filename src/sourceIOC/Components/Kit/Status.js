import React from 'react';
import { View, StatusBar, Platform, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fit from './Fit';
import Font from './Font';
import Color from './Color';
import Utils from '../../../../app/Utils';

const Bar = props => {
    return (
        <View>
            <StatusBar backgroundColor={props.color || '#fff'} barStyle={'dark-content'} />
            {Platform.OS === 'ios' ? <View style={styles.container(props.color)} /> : null}
        </View>
    )
}

export const HeaderBar = props => {
    const onBack = () => Utils.BackStack();
    return (
        <View>
            <Bar />
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    {
                        props.stack ?
                            <Icon name={'chevron-left'} size={28} color={Color.black} />
                            :
                            <Icon name={'close'} size={20} color={Color.black} />
                    }
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.headerTitle}>{props.title}</Text>
                {props.isLoading ?
                    <View style={styles.backButton}>
                        <ActivityIndicator size="small" color={Color.gray100} />
                    </View>
                    :
                    props.rightIconName ?
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={props.onRightMenuPress}
                        >
                            <Icon name={props.rightIconName} size={26} color={Color.secondary} />
                        </TouchableOpacity>
                        :
                        <View style={styles.backButton} />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: color => ({
        height: 20,
        backgroundColor: color || '#ffffff'
    }),
    headerView: {
        flexDirection: 'row',
        alignItems: Fit.center,
        height: 47,
        backgroundColor: Color.white,
        paddingHorizontal: 5
    },
    backButton: {
        height: 47,
        width: 47,
        justifyContent: Fit.center,
        alignItems: Fit.center
    },
    headerTitle: {
        fontFamily: Font.fontFamily,
        color: Color.black,
        fontSize: Font.mediumPlus,
        fontWeight: 'bold',
        flex: 1,
        textAlign: Fit.center
    }
})

export default Bar;
