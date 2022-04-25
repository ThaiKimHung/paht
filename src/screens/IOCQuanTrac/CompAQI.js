import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import { Images } from '../../images';
import TypeQuanTrac from './TypeQuanTrac';

class CompAQI extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { AQI = 0, titleAQI = '' } = this.props
        let statusKPI = TypeQuanTrac.KPI.find(e => AQI >= e.from && AQI <= e.to)
        return (
            <View style={stCompAQI.cover}>
                <Text style={stCompAQI.txtAQI}>{titleAQI} {AQI}</Text>
                <View style={[stCompAQI.container, { backgroundColor: statusKPI ? statusKPI?.color : 'red', alignItems: 'center' }]}>
                    <Image source={Images[statusKPI?.icon]} style={[nstyles.nIcon30, { tintColor: statusKPI?.from == 51 ? colors.black_60 : colors.white, marginTop: 10 }]} resizeMode={'contain'} />
                    <Text style={[stCompAQI.statusAQI, { color: statusKPI?.from == 51 ? colors.black_60 : colors.white }]}>{statusKPI?.status}</Text>
                </View>
            </View>
        );
    }
}

const stCompAQI = StyleSheet.create({
    cover: {
        flex: 1,
        margin: 5,
        borderWidth: 0.5,
        borderColor: colors.black_50,
        borderRadius: 5,
        ...nstyles.shadown
    },
    container: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5
    },
    txtAQI: {
        textAlign: 'center',
        padding: 5,
        fontWeight: 'bold',
    },
    iconAQI: {

    },
    statusAQI: {
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center'
    }
})

export default CompAQI;
