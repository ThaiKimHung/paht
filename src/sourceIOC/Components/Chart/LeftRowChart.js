import React from 'react';
import {Stack, Color, Text, Fit} from '../Kit';
import {StyleSheet,View} from 'react-native';
import {IRowChart} from '../../Interface/Chart';

const LeftRowChart = (props:IRowChart)=>
{
    return (
        <Stack marginVertical={5}>
            <Stack
                horizontal
                horizontalAlign={Fit.spaceBetween}
                verticalAlign={Fit.center}
                marginVertical={8}
            >
                <Text color={Color.gray100}>{props.title}</Text>
                <Text>{props.value}</Text>
            </Stack>
            <View style={styles.rowChartBackground}>
                <View style={styles.rowChart(props.percent,props.color)}/>
            </View>
        </Stack>
    )
}

export default LeftRowChart

const styles = StyleSheet.create({
    rowChartBackground:{
        height:10,
        borderRadius:3,
        overflow:'hidden',
        backgroundColor:Color.gray30
    },
    rowChart:(width,color)=>({
        width:`${width}%`,
        backgroundColor: color,
        height: '100%',
        borderRadius:3,
    })
})


