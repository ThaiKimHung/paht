import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import Colors, { ButtonFit } from './Color';
import Font from './Font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fit from './Fit';

export const BaseButton = props => {
    return (
        props.isLoading ?
            <View style={styles.container(props)}>
                <ActivityIndicator size="small" color={Colors.white} />
            </View>
            :
            <TouchableOpacity
                style={styles.container(props)}
                disabled={props.disabled}
                onPress={props.onPress}
            >
                {props.leftIcon ?
                    <Icon name={props.leftIcon} style={styles.icon(props.disabled ? ButtonFit.smoothDisabled : props.color)} />
                    :
                    null
                }
                <Text style={styles.title(props.color)}>{props.title}</Text>
                {props.next ?
                    <Icon name={'arrow-right'} style={styles.nextIcon(props.disabled ? ButtonFit.smoothDisabled : props.color)} />
                    :
                    null
                }
            </TouchableOpacity>
    )
}

type IconButtonProps = {
    onPress?: any,
    iconName?: string,
    color?: string,
}

export const IconButton = (props: IconButtonProps) => {
    return (
        <TouchableOpacity
            style={styles.iconButton}
            onPress={props.onPress}
        >
            <Icon name={props.iconName} size={23} color={props.color || Colors.black} />
        </TouchableOpacity>
    )
}

export const IconSmallButton = props => {
    return (
        <TouchableOpacity
            style={{ ...styles.iconSmallButton, ...props.style }}
            disabled={props.disabled}
            onPress={props.onPress}
        >
            {props.disabled ?
                <Icon name={props.iconName} size={23} color={Colors.gray70} />
                :
                <Icon name={props.iconName} size={23} color={props.color || Colors.black} />
            }
        </TouchableOpacity>
    )
}

export const LargeFullButton = props => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.btnLargeFull(props.isLoading)}>
            {props.isLoading ?
                <View style={{ marginRight: 10 }}>
                    <ActivityIndicator size="small" color={Colors.white} />
                </View>
                :
                <Icon name={props.iconName} style={styles.iconBtnLargeFull} />
            }
            <Text style={styles.titleBtnLargeFull}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: ({ color, fullWidth, style, disabled }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 16,
        borderColor: disabled ? Colors.gray90 : color ? color.borderColor : Colors.transparent,
        backgroundColor: disabled ? Colors.gray90 : color ? color.backgroundColor : Colors.transparent,
        width: fullWidth ? '100%' : null,
        ...style
    }),
    title: color => ({
        fontFamily: Font.fontFamily,
        fontWeight: '600',
        color: color ? color.text : Colors.primary,
        fontSize: 14
    }),
    icon: color => ({
        fontSize: 18,
        marginRight: 10,
        color: color ? color.text : Colors.primary
    }),
    nextIcon: color => ({
        fontSize: 18,
        marginLeft: 10,
        color: color ? color.text : Colors.primary
    }),
    iconButton: {
        height: 47,
        width: 47,
        justifyContent: Fit.center,
        alignItems: Fit.center
    },
    iconSmallButton: {
        height: 32,
        width: 32,
        justifyContent: Fit.center,
        alignItems: Fit.center
    },
    btnLargeFull: isLoading => ({
        marginHorizontal: 16,
        marginVertical: 10,
        flexDirection: Fit.row,
        alignItems: Fit.center,
        backgroundColor: isLoading ? Colors.gray90 : Colors.orange,
        borderRadius: 3,
        justifyContent: Fit.center,
        paddingVertical: 12
    }),
    iconBtnLargeFull: {
        color: Colors.white,
        fontSize: Font.xLarge,
        marginRight: 10
    },
    titleBtnLargeFull: {
        color: Colors.white,
        fontSize: Font.medium,
        fontWeight: Font.bold
    }
})
