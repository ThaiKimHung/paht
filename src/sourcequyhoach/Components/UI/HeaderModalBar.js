import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Utils from '../../../../app/Utils';
// import { useNavigation } from '@react-navigation/native';

const HeaderModalBar = ({ title, isLoading, menuRight, rightMenuPress, description, navigation, titleLeft = 'Huỷ bỏ' }) => {
    // const navigation = useNavigation();

    const onGoBack = () => {

        // BackStack
        Utils.BackStack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.btnView}
                    onPress={onGoBack}
                    disabled={isLoading}
                >
                    <Text style={styles.cancelTitle}>{titleLeft}</Text>
                </TouchableOpacity>
                <View style={styles.titleView}>
                    {description ?
                        <Text style={styles.description}>Chuyển đến khu vực</Text>
                        : null
                    }
                    <Text style={styles.title}>{title || ''}</Text>
                </View>
                <View style={{ width: 72 }} />
            </View>
            <View style={styles.underline} />
        </View>
    )
};

export default HeaderModalBar;


const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.white
    },
    btnView: {
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: 3
    },
    backIcon: {
        fontSize: 23
    },
    titleView: {
        flex: 1,
        justifyContent: POSITION.center,
        alignItems: POSITION.center
    },
    title: {
        fontSize: 16,
        fontWeight: FONT.Bold,
        color: COLOR.black,
        fontFamily: FONT.FontFamily
    },
    underline: {
        height: 1,
        backgroundColor: COLOR.border,
    },
    cancelTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        fontWeight: FONT.Bold,
        color: COLOR.blue
    },
    description: {
        fontFamily: FONT.FontFamily,
        fontSize: 13,
        textAlign: POSITION.center
    }
});
