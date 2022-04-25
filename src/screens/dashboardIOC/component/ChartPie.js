import React, { useEffect, useState, useRef } from 'react'
import { PieChart } from 'react-native-svg-charts'
import { colors } from '../../../../styles'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types'
import { IsLoading } from '../../../../components';
const listColor = ["#7890D1", "#9E415E", colors.greenyBlue, colors.blue]

const ChartPie = (props) => {
    const refLoading = useRef(null);
    const { isLoading, data, listGhichu = [] } = props;
    useEffect(() => {
        if (isLoading) {
            refLoading.current.show();
        } else {
            refLoading.current.hide();
        }
    }, [isLoading])
    const renderGhiChu = (itemGC, indexGC) => {
        return <View style={{
            flexDirection: 'row',
            paddingHorizontal: 10, alignItems: 'center',
            width: '50%', paddingVertical: 5
        }}>
            <View style={{
                width: 30, height: 30,
                backgroundColor: listColor[indexGC],
            }}>
            </View>
            <Text style={{ paddingHorizontal: 10 }}>{itemGC}</Text>
        </View>
    }

    const dataChart = [data.khongbenh, data.tongDaiThaoDuong, data.tongTangHuyetAp, data.tongBenhManTinh,]
    const pieData = dataChart
        .filter((value) => value > 0)
        .map((value, index) => ({
            value,
            svg: {
                fill: listColor[index],
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }))
    return <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {
                listGhichu && listGhichu.map(renderGhiChu)
            }
        </View>
        <PieChart style={{ height: 200 }} data={pieData} padAngle={0} />
        <IsLoading ref={refLoading} />
    </View>


}

ChartPie.propTypes = {

    data: PropTypes.object,

    isLoading: PropTypes.bool
};

ChartPie.defaultProps = {
    data: {},
    isLoading: true

};
export default ChartPie

const styles = StyleSheet.create({})






