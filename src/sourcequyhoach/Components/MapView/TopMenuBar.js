import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import POSITION from '../../Styles/Position';
import FONT from '../../Styles/Font';
import COLOR from '../../Styles/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { onMapMoveTo } from '../../Containers/MapView';

import Utils from '../../../../app/Utils';
import { nstyles } from '../../../../chat/styles';

const isIOS = Platform.OS === 'ios';

const TopMenuBar = (props) => {

    // const navigation = useNavigation();
    const userInfo = useSelector(state => state.userInfo);
    const { userCoordinate } = useSelector(state => state.mapView)
    const onLocationPress = () => props.navigation.navigate('Location');
    const onUserPress = () => {
        if (userInfo) {
            props.navigation.navigate('ProfileMenu');
        }
        else {
            props.navigation.navigate('LoginQH');
        }

    }
    const onMenuLayerPress = () => props.navigation.navigate('MenuLayer');

    const onSearchPress = () => props.navigation.navigate("Search", {});

    const onUserLocationPress = () => {
        onMapMoveTo(userCoordinate);
    };
    const onGoBack = () => {
        Utils.BackStack();
    }

    return (
        <View style={styles.container}>
            <View style={{
                flex: 1, backgroundColor: 'transparent',
                justifyContent: 'flex-start', alignItems: 'flex-start'
            }}>
                <TouchableOpacity
                    style={{ ...styles.btnRow, backgroundColor: COLOR.white, flexDirection: POSITION.row, }}
                    onPress={onGoBack}
                >
                    <Icon name="backburger" style={styles.icon} color={COLOR.blue} />
                    <Text style={{
                        fontFamily: FONT.FontFamily,
                        fontSize: 16,
                        fontWeight: FONT.Bold,
                        color: COLOR.blue
                    }}>{'Thoát'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.acrossLine} />
            <View style={{ flexDirection: POSITION.row, backgroundColor: COLOR.white, }}>
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

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: nstyles.paddingTopMul() + 10,
        right: 16,
        left: 16,
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
