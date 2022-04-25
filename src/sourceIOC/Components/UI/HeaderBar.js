import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    StatusBar,
    Platform,
    ActivityIndicator
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Utils from '../../../../app/Utils';


const HeaderBar = props => {

    const onGoBack = () => Utils.BackStack();


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
            {(Platform.OS === 'ios') ? <View style={{ height: 20, backgroundColor: '#FFF' }} /> : null}
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.btnView}
                    onPress={onGoBack}
                    disabled={props.isLoading}
                >
                    <Icon name='arrow-left' style={styles.backIcon} color={COLOR.black} />
                </TouchableOpacity>
                <Text style={styles.title}>{props.title}</Text>
                {props.isLoading ?
                    <View style={styles.btnView}>
                        <ActivityIndicator size="small" color={COLOR.darkGray} />
                    </View>
                    :
                    props.menuRight ?
                        <TouchableOpacity
                            style={styles.btnView}
                            onPress={props.rightMenuPress}
                        >
                            <Icon name='square-edit-outline' style={styles.backIcon} color={COLOR.blue} />
                        </TouchableOpacity>
                        :
                        <View style={styles.btnView} />
                }
            </View>
            <View style={styles.underline} />
        </View>
    )
};

export default HeaderBar;


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.white
    },
    btnView: {
        height: 47,
        width: 47,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    backIcon: {
        fontSize: 23
    },
    title: {
        fontSize: 15,
        fontWeight: FONT.Bold,
        color: COLOR.black,
        textAlign: POSITION.center,
        flex: 1,
        fontFamily: FONT.FontFamily
    },
    underline: {
        height: 1,
        backgroundColor: COLOR.whiteGray,
    }
});
