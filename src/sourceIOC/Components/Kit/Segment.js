import React, { useState, useRef } from 'react';
import { Color, Fit, Text } from '../Kit';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import Utils from '../../../../app/Utils';

type Props = {
    data: any[],
    active?: string,
    onChange(key: string): void
}

const Segment = (props: Props) => {

    const animatedValue = useRef(new Animated.Value(0)).current;

    const [size, setSize] = useState(0);


    const onLayout = ({ nativeEvent }) => setSize(nativeEvent.layout.width / props.data.length - 2);

    const onButtonPress = (index, item) => () => {
        Animated.timing(animatedValue, {
            toValue: size * index,
            duration: 100,
            useNativeDriver: true
        }).start();
        props.onChange(item.id)
    }
    Utils.nlog('sefgment ', props)

    return (
        <View onLayout={onLayout} style={styles.container}>
            <Animated.View style={styles.active(animatedValue)} />
            <View style={{ flex: 1 }} />
            <View style={styles.buttonView}>
                {props.data.map((item, index: number) => (
                    <Button
                        key={item.id}
                        title={item.title}
                        onPress={onButtonPress(index, item)}
                        active={props.active.index === item.key}
                    />
                ))}
            </View>
        </View>
    );
};

export default Segment;


type ButtonProps = {
    title?: string,
    active?: boolean,
    onPress(): void
}

const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.button}>
            {props.active ?
                <Text color={Color.primary} >{props.title}</Text>
                :
                <Text>{props.title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 32,
        borderRadius: 5,
        backgroundColor: Color.gray30,
        flexDirection: Fit.row,
        padding: 2,

    },
    button: {
        flex: 1,
        justifyContent: Fit.center,
        alignItems: Fit.center
    },
    buttonView: {
        position: Fit.absolute,
        top: 2,
        left: 2,
        bottom: 2,
        right: 2,
        flexDirection: Fit.row,

    },
    active: translateX => ({
        backgroundColor: Color.white,
        flex: 1,
        borderRadius: 5,
        transform: [{ translateX }]
    })
});
