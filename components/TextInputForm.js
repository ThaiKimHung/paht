import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, ReactNode } from 'react'
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    Animated,
    Easing,
    ViewStyle,
    TouchableWithoutFeedback,
    StyleProp,
} from 'react-native'
import { useSelector } from 'react-redux'
import Utils from '../app/Utils'
import { store } from '../srcRedux/store'
import { colors } from '../styles'
import { reText } from '../styles/size'

type PropsInput = React.ComponentProps<typeof TextInput> & {
    label: string;
    // errorText?: string | null;
    styleInput?: StyleProp<ViewStyle> | undefined;
    error?: string;
    colorNormal: ColorValue | undefined;
    colorActive: ColorValue | undefined;
    heightInput: number | string | undefined;
    onAnmation: Boolean;
    onCheckError: (text) => void | undefined;
    // errorStatus: Boolean;
    styleContainer: StyleProp<ViewStyle> | undefined;
    valueInput: string | undefined;
    styleViewInput: StyleProp<ViewStyle> | undefined;
    viewLeft: ReactNode;
    styleError: StyleProp<ViewStyle> | undefined;
}

const TextInputForm: React.FC<PropsInput> = forwardRef((props, ref) => {
    const theme = useSelector(state => state.theme)
    const {
        label,
        styleInput,
        control,
        defaultValue,
        onBlur,
        onFocus,
        onChangeText,
        colorNormal,
        colorActive = theme.colorLinear.color[0],
        heightInput,
        onAnmation = false,
        onCheckError,
        // errorStatus,
        styleContainer,
        styleViewInput,
        viewLeft,
        value = '',
        styleError,
        ...restOfProps
    } = props
    const [isFocused, setIsFocused] = useState(false)
    const [zIndex, setZindex] = useState('')
    const [errorText, setErrorText] = useState('')
    const focusAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        if (onAnmation) {
            Animated.timing(focusAnim, {
                toValue: isFocused || !!value ? 1 : 0,
                duration: 150,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }).start()
            if (value && !isFocused) {
                setZindex(0);
            }
        }
    }, [focusAnim, isFocused, value])

    let color = isFocused ? colorActive : colorNormal
    if (errorText && errorText != '' && !isFocused) {
        color = '#B00020'
    }
    const _renderInput = () => {
        return (
            <View style={styleContainer} >
                <View style={[styleViewInput, {
                    borderColor: color
                }]} >
                    {viewLeft}
                    <TextInput
                        style={[
                            {
                                paddingVertical: heightInput,

                            },
                            styleInput,
                        ]}
                        ref={ref}
                        {...restOfProps}
                        value={value}
                        onBlur={(event) => {
                            setIsFocused(false)
                            if (onCheckError) {
                                let ErrorText = onCheckError(value);
                                setErrorText(ErrorText)
                            }
                            onBlur?.(event)
                        }}
                        onChangeText={(text) => {
                            // if (status) {
                            //     clearTimeout(status)
                            // }
                            // const status = setTimeout(() => {
                            //     if (onCheckError) {
                            //         let ErrorText = onCheckError(text);
                            //         setErrorText(ErrorText)
                            //     }
                            // }, 550);
                            onChangeText?.(text)
                        }
                        }
                        onFocus={(event) => {

                            setIsFocused(true)
                            onFocus?.(event)
                        }}
                    />
                    {onAnmation && <TouchableWithoutFeedback onPress={() => ref.current?.focus()}>
                        <Animated.View
                            style={[
                                styles.labelContainer,
                                {
                                    top: -12,
                                    zIndex: isFocused ? 0 : zIndex === 0 ? 0 : -1,
                                    transform: [
                                        {
                                            scale: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0.85],
                                            }),
                                        },
                                        {
                                            translateY: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [24, 0],
                                            }),
                                        },
                                        {
                                            translateX: focusAnim.interpolate({
                                                inputRange: [0, 5],
                                                outputRange: [16, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color,
                                    },
                                ]}
                            >
                                {label}
                                {errorText ? '*' : ''}
                            </Text>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                    }
                </View>
                {errorText && errorText != '' && !isFocused ? <Text style={[styles.error, styleError]}>{errorText}</Text> : null
                }
            </View >
        )
    }
    return (
        _renderInput()
    )
})

const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
        backgroundColor: colors.white,
    },
    label: {
        fontSize: reText(16),
    },
    error: {
        fontSize: 12,
        marginTop: 6,
        color: '#B00020',
        marginLeft: 2,
    },
})

export default React.memo(TextInputForm)