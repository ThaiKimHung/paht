
import moment from 'moment';
import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../chat/styles';
import { HeaderCus, IsLoading } from '../../../components';
import { reText } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import { Images } from '../../images';

class DetailsChartsKhongKhi extends Component {
    constructor(props) {
        super(props);
        this.dataChart = Utils.ngetParam(this, 'dataChart', '')
        this.dataSetting = Utils.ngetParam(this, 'dataSetting', '')
        this.keyViewTime = Utils.ngetParam(this, 'keyViewTime', '')
        this.item = Utils.ngetParam(this, 'item', '')
        this.state = {
            dataChart: this.dataChart && this.dataChart.length > 0 ? this.dataChart : [],
            dataTitle: [],
            dataSetting: this.dataSetting && this.dataSetting.length > 0 ? this.dataSetting : [],
            item: this.item ? this.item : ''
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this.handlerData()
    }

    handlerData = () => {
        var keyViewTime = this.keyViewTime
        const { dataChart = [], dataSetting = [], indexMore } = this.state
        if (dataChart && dataChart.length > 0) {
            let arrTitle = []
            Object.keys(dataChart[0].data).map(function (key, index) {
                if (key != keyViewTime && dataSetting.find(e => e.key == key && e.display)) {
                    arrTitle = [...arrTitle, key]
                }
            })
            this.setState({ dataTitle: arrTitle.length > 0 ? arrTitle : [] })
        }
    }

    render() {
        const { dataChart, dataTitle, dataSetting, item } = this.state
        return (
            <View style={stDetailsChartsKhongKhi.cover}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Chi tiết thông số`.toUpperCase()}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stDetailsChartsKhongKhi.container}>
                    <Text style={stDetailsChartsKhongKhi.txtTram}>{item?.station_name.toUpperCase()}</Text>
                    <ScrollView contentContainerStyle={stDetailsChartsKhongKhi.scrollVertical}>
                        <ScrollView horizontal>
                            {
                                dataTitle.length > 0 ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Row_Title data={dataTitle} dataSetting={dataSetting} keyViewTime={this.keyViewTime} />
                                        <Row_Table data={dataChart} dataSetting={dataSetting} keyViewTime={this.keyViewTime} />
                                    </View>
                                    : null
                            }
                        </ScrollView>
                    </ScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const Row_Table = (props) => {
    const { data = [], dataSetting = [], keyViewTime = '' } = props
    return (
        <View style={{ flexDirection: 'row' }}>
            {
                data.map((item, index) => {
                    return (
                        <View style={{}} key={index}>
                            <View style={{ borderWidth: 0.5, borderLeftWidth: 0, padding: 10, width: 80, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#7e0019' }}>{moment(keyViewTime != '' ? item[keyViewTime] : '').format('HH:mm')}</Text>
                            </View>
                            {
                                Object.keys(item.data).map(function (key, _i) {
                                    if (key != keyViewTime && dataSetting.find(e => e.key == key && e.display)) {
                                        return (
                                            <View style={{ borderWidth: 0.5, padding: 10, borderTopWidth: 0, borderLeftWidth: 0, width: 80, alignItems: 'center' }}>
                                                <Text style={{ fontSize: reText(12) }}>{item.data[key].toFixed(3)}</Text>
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                    )
                })
            }
        </View>
    )
}

const Row_Title = (props) => {
    const { data = [] } = props
    return (
        <View style={{}}>
            <View style={{ borderWidth: 0.5, padding: 10, width: 150 }}>
                <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#ff7e00' }}>{'Thông số'}</Text>
            </View>
            {
                data.map((item, index) => {
                    return (
                        <View key={index} style={{ borderWidth: 0.5, padding: 10, borderTopWidth: 0, width: 150, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#ff7e00', textAlign: 'left', flex: 1 }}>{item}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

const stDetailsChartsKhongKhi = StyleSheet.create({
    cover: {
        flex: 1,
        backgroundColor: colors.BackgroundHome
    },
    container: {
        flex: 1,
        padding: 10
    },
    rowtable: {

    },
    rowtitle: {

    },
    scrollVertical: {
        paddingBottom: 50
    },
    txtTram: {
        fontWeight: 'bold',
        textAlign: 'justify',
        marginBottom: 10,
        color: '#ff7e00',
        lineHeight: 20,
        fontSize: reText(16)
    },
})

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(DetailsChartsKhongKhi, mapStateToProps, true);
