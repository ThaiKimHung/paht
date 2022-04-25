import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import TypeQuanTrac from './TypeQuanTrac';

class RecomendAQI extends Component {

    render() {
        const { AQI = 0 } = this.props
        let statusRecomend = TypeQuanTrac.RECOMMEND.find(e => AQI >= e.from && AQI <= e.to)
        let statusKPI = TypeQuanTrac.KPI.find(e => AQI >= e.from && AQI <= e.to)
        return (
            <View style={stRecomendAQI.cover}>
                <Text style={[stRecomendAQI.txtTitle]}>{'Khuyến cáo: '}</Text>
                <Text style={[stRecomendAQI.txtRecomend]}>{' - '}{statusRecomend?.recommend}</Text>
                <Text style={[stRecomendAQI.txtRecomend]}>{' - '}{statusKPI?.note}</Text>
            </View>
        );
    }
}

const stRecomendAQI = StyleSheet.create({
    cover: {

    },
    txtRecomend: {
        textAlign: 'justify',
        padding: 5,
    },
    txtTitle: {
        textAlign: 'justify',
        padding: 5,
        fontWeight: 'bold'
    }
})

export default RecomendAQI;
