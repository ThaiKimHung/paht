import React from 'react';
import {StyleSheet,View} from 'react-native';

type StackProps = {
    onLayout?:any,
    children:React.ReactNode,
    horizontal?:boolean,
    verticalAlign?:string,
    horizontalAlign?:string,
    padding?:number,
    backgroundColor?:string,
    style?:any,
    flexFluid?:boolean,
    marginVertical?:number,
    marginHorizontal?:number,
    paddingHorizontal?:number,
    paddingVertical?:number
}

export const Stack = (props:StackProps) =>
{
    return (
        <View onLayout = {props.onLayout} style={styles.container(props)}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container:props=>({
        flexDirection:props.horizontal ? 'row' : 'column',
        alignItems:props.horizontal ? props.verticalAlign : props.horizontalAlign,
        justifyContent:props.horizontal ? props.horizontalAlign : props.verticalAlign,
        padding:props.padding || 0,
        flex:props.flexFluid ? 1 : null,
        backgroundColor:props.backgroundColor,
        marginHorizontal:props.marginHorizontal || null,
        marginVertical:props.marginVertical || null,
        paddingHorizontal:props.paddingHorizontal || null,
        paddingVertical:props.paddingVertical || null,
        ...props.style,

    })
})
