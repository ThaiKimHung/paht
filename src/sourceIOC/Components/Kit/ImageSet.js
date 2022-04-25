import React from 'react';
import {StyleSheet, View,Image} from 'react-native';
import {Color, Fit, Font, Text,Button,ButtonColor} from './index';

type PropsType = {
    title?:string,
    description?:string,
    error?:boolean,
    onTryPress?:any
}

export const EmptyImage = (props:PropsType) =>
{
    const [size,setSize] = React.useState(0);
    const setLayout = ({nativeEvent:{layout:{width,height}}})=>
    {
        let content = (props.title ? 32.5 : 0) + (props.description ? 44.5 : 0);
        if (height < width)
            setSize(height - content);
        else
            setSize(width - content);
    }

    return (
        <View onLayout = {setLayout} style = {styles.emptyImage}>
            {props.error ?
                <Image
                    style = {styles.imageError(size)}
                    source={require('../../Assets/error.png')}
                />
                :
                <Image
                    style = {styles.imageEmpty(size)}
                    source={require('../../Assets/notfound.png')}
                />
            }
            {props.title ?
                <Text  style={styles.titleEmpty}>{props.title}</Text>
                : null
            }
            {
                props.description ?
                    <Text style = {styles.descriptionEmpty}>{props.description}</Text>
                    : null
            }
            {props.error ?
                <Button color={ButtonColor.outlineDanger} onPress = {props.onTryPress} title ='Thử lại'/>
                : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    emptyImage:{
        alignItems:Fit.center,
        overflow:'hidden',
        height:'100%',
        width:'100%'
    },
    imageEmpty:imageSize=>({
        width:imageSize,
        height:imageSize,
        resizeMode:'cover',
    }),
    imageError:imageSize=>({
        width:imageSize - 60,
        height:imageSize - 60,
        resizeMode:'cover',
        marginBottom: 10,
        marginTop:20
    }),
    titleEmpty:{
        fontSize:Font.large,
        color:Color.warning,
        marginBottom:10
    },
    descriptionEmpty:{
        fontSize: Font.medium,
        color:Color.gray100,
        textAlign:Fit.center,
        marginHorizontal:20,
        marginBottom: 10
    }
})
