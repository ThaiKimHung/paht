import React from 'react';
import {StyleSheet,Text } from 'react-native';
import Colors from './Color';
import Font from './Font';

type TextProps = {
    color?:string,
    size?:number,
    children: React.ReactNode,
    bold?:boolean,
    textAlign?:string,
    style?:any,
    onLayout?:any,
    numberOfLines?:number,
    onPress?:any
}

export const TextKit = (props:TextProps) =>
{
    return (
        <Text onPress = {props.onPress} onLayout = {props.onLayout} numberOfLines={props.numberOfLines} style = {styles.container(props)}>{props.children}</Text>
    )
}

export const Label = props =>
{
    return (
        <TextKit
            bold
            color = {props.disabled ? Colors.gray90 : Colors.black}
            style = {props.style}
        >
            {props.children}
            {props.required ? <Text numberOfLines={props.numberOfLines} style = {{color:Colors.red}}> *</Text> : null}
        </TextKit>
    )
}

export default TextKit;

const styles = StyleSheet.create({
    container:props=>({
        fontFamily:Font.fontFamily,
        color:props.color || Colors.black,
        fontSize:props.size || Font.medium,
        fontWeight:props.bold ? 'bold' : 'normal',
        textAlign:props.textAlign || 'left',
        ...props.style
    })
})
