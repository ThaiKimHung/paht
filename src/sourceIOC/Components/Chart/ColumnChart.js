import React, {useEffect} from 'react';
import {Stack, Color, Text, Fit, IconButton, Divider, Font} from '../Kit';
import {StyleSheet,View} from 'react-native';
import {IRowChart} from '../../Interface/Chart';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const ColumnChart = ({navigation,route})=>
{
    return (
        <View style={styles.container}>
            <Text size={Font.mediumPlus}>Sở lao đông thương binh xã hội</Text>
            <Stack horizontal paddingVertical={10} >
                <Stack flexFluid>
                    <Stack paddingVertical={5}>
                        <Stack horizontal verticalAlign={Fit.center}>
                            <Icon name = 'record' color={Color.primary} style={{marginRight:5}}/>
                            <Text numberOfLines={1} color={Color.gray100}>Tổng HS đã giải quyết</Text>
                        </Stack>
                        <Text bold style={styles.value}>36,000</Text>
                    </Stack>
                    <Stack paddingVertical={5}>
                        <Stack horizontal verticalAlign={Fit.center}>
                            <Icon name = 'record' color={Color.green} style={{marginRight:5}}/>
                            <Text numberOfLines={1} color={Color.gray100}>Trước hạn</Text>
                        </Stack>
                        <Text bold style={styles.value}>36,000</Text>
                    </Stack>
                    <Stack paddingVertical={5}>
                        <Stack horizontal verticalAlign={Fit.center}>
                            <Icon name = 'record' color={Color.secondary} style={{marginRight:5}}/>
                            <Text numberOfLines={1} color={Color.gray100}>Quá hạn</Text>
                        </Stack>
                        <Text bold style={styles.value}>36,000</Text>
                    </Stack>
                </Stack>
                <Stack style={{marginBottom:-10}} flexFluid horizontal verticalAlign={Fit.flexEnd} horizontalAlign={Fit.center}>
                    <View style={styles.colChart(Color.primary,80)}/>
                    <View style={styles.colChart(Color.green,60)}/>
                    <View style={styles.colChart(Color.secondary,20)}/>
                </Stack>
            </Stack>
            <Divider.Horizontal/>
        </View>
    )
}

export default ColumnChart;

const styles = StyleSheet.create({
    container:{
        marginVertical:16
    },
    value:{
        marginTop:3
    },
    colChart:(color,height)=>({
        width:30,
        height:`${height}%`,
        backgroundColor:color || Color.green,
        marginLeft:2,
        borderTopLeftRadius:3,
        borderTopRightRadius:3
    })
})
