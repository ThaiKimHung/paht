import React from 'react';
import {ButtonColor, Color, Text} from '../Kit';
import {StyleSheet,View,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


type PropType = {
    isActive?:string,
    iconName?:string,
    onPress?:any,
    title?:string
}

interface SubItemItf {
    ID:string,
    Name:boolean,
}

export interface DrawerItemItf {
    ID:string,
    Name:string,
    IconName:string,
    SubMenu:SubItemItf[]
}

const DrawerItem = (props:PropType) =>
{
    return (
        <TouchableOpacity onPress = {props.onPress} style={styles.rootView(props.isActive)}>
            <View style={styles.iconView}>
                <Icon name={props.iconName} style={styles.icon(props.isActive)}/>
            </View>
            <Text numberOfLines={1} color={props.color} style={{flex:1}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default DrawerItem;

const styles = StyleSheet.create({
    container:{
        paddingRight:8,
        paddingVertical:5
    },
    rootView:(isActive)=>({
        flexDirection:'row',
        alignItems: 'center',
        marginHorizontal:8,
        height:38,
        justifyContent: 'center',
        backgroundColor:isActive ? ButtonColor.smoothPrimary.backgroundColor : null,
        borderRadius:5
    }),
    icon:(isActive)=>({
        fontSize:21,
        color:isActive ? Color.primary : Color.gray90
    }),
    iconView:{
        height:42,
        width:42,
        justifyContent:'center',
        alignItems:'center',
        marginRight:8
    },
    subView:(isActive)=>({
        height:38,
        marginLeft:50,
        paddingHorizontal: 8,
        justifyContent: 'center',
        backgroundColor:isActive ? ButtonColor.smoothPrimary.backgroundColor : null,
        borderRadius:5
    })
})
