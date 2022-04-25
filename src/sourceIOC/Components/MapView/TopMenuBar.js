import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import POSITION from '../../Styles/Position';
import FONT from '../../Styles/Font';
import COLOR from '../../Styles/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { onMapMoveTo } from '../../Containers/MapView';
import Utils from '../../../../app/Utils';

const isIOS = Platform.OS === 'ios';

const TopMenuBar = () => {

    const userInfo = useSelector(state => state.userInfo);
    const { userCoordinate } = useSelector(state => state.mapView)
    const onLocationPress = () => Utils.navigate('Location');
    const onUserPress = () => {
        if (userInfo)
            Utils.navigate('ProfileMenu');
        else
            Utils.navigate('Login');
    }
    const onMenuLayerPress = () => Utils.navigate('MenuLayer');

    const onSearchPress = () => Utils.navigate("Search", {});

    const onUserLocationPress = () => {
        onMapMoveTo(userCoordinate);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.btnRow}
                onPress={onUserLocationPress}
            >
                <Icon2 name="my-location" style={styles.icon} color={COLOR.darkGray} />
            </TouchableOpacity>
            <View style={styles.acrossLine} />
            <TouchableOpacity style={styles.btnRow} onPress={onMenuLayerPress}>
                <Icon name="layers" style={styles.icon} color={COLOR.darkGray} />
            </TouchableOpacity>
            <View style={styles.acrossLine} />
            <TouchableOpacity
                style={styles.btnRow}
                onPress={onLocationPress}
            >
                <Icon name='home-map-marker' style={styles.icon} color={COLOR.darkGray} />
            </TouchableOpacity>
            <View style={styles.acrossLine} />
            <TouchableOpacity
                style={styles.btnRow}
                onPress={onUserPress}
            >
                <Icon name="account" style={styles.icon} color={userInfo ? COLOR.blue : COLOR.darkGray} />
            </TouchableOpacity>
            <View style={styles.acrossLine} />
            <TouchableOpacity
                style={styles.btnRow}
                onPress={onSearchPress}
            >
                <Icon2 name="search" style={styles.icon} color={COLOR.darkGray} />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        right: 16,
        flexDirection: POSITION.row,
        borderRadius: 5,
        backgroundColor: COLOR.white,
        shadowColor: '#212121',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        paddingHorizontal: 2,
    },
    btnRow: {
        height: 38,
        alignItems: POSITION.center,
        justifyContent: POSITION.center,
        paddingHorizontal: 12,
    },
    titleBtn: {
        fontFamily: FONT.FontFamily,
        fontSize: 13,
        color: COLOR.darkGray,
    },
    acrossLine: {
        height: 38,
        width: 1,
        backgroundColor: COLOR.border,
    },
    icon: {
        marginTop: isIOS ? 2 : 0,
        fontSize: 20,
    },
});

export default TopMenuBar;
