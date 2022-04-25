import moment from 'moment';
import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../chat/styles';
import { HeaderCus, IsLoading } from '../../../components';
import { reText } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import { Images } from '../../images';

class DetailsChartsNuoc extends Component {
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
            indexMore: 20,
            isEnd: false,
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
            Object.keys(dataChart[0]).map(function (key, index) {
                if (key != keyViewTime && dataSetting.find(e => e.key == key && e.display)) {
                    arrTitle = [...arrTitle, key]
                }
            })
            this.setState({ dataTitle: arrTitle.length > 0 ? arrTitle : [] })
        }
        if (indexMore < dataChart.length) {
            this.setState({ isEnd: false })
        } else {
            this.setState({ isEnd: true })
        }
    }


    loadMore = () => {
        if (this.state.indexMore < this.state.dataChart.length) {
            this.setState({ indexMore: this.state.indexMore + 20 }, () => {
                if (this.state.indexMore < this.state.dataChart.length) {
                    this.setState({ isEnd: false })
                } else {
                    this.setState({ isEnd: true })
                }
            })
        }
    }


    render() {
        const { dataChart, dataTitle, dataSetting, indexMore, isEnd, item } = this.state
        return (
            <View style={stDetailsChart.cover}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Chi tiết thông số`.toUpperCase()}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stDetailsChart.container}>
                    <Text style={stDetailsChart.txtTram}>{item?.station_name.toUpperCase()}</Text>
                    <ScrollView contentContainerStyle={stDetailsChart.scrollVertical}>
                        <ScrollView horizontal>
                            {
                                dataTitle.length > 0 ?
                                    <View>
                                        <Row_Title data={dataTitle} indexMore={indexMore} dataSetting={dataSetting} keyViewTime={this.keyViewTime} />
                                        <Row_Table data={dataChart} indexMore={indexMore} dataSetting={dataSetting} keyViewTime={this.keyViewTime} />
                                    </View>
                                    : null
                            }
                        </ScrollView>
                        {
                            !isEnd ?
                                <TouchableOpacity style={stDetailsChart.btnMore} onPress={this.loadMore}>
                                    <Text style={stDetailsChart.txtMore}>{'Xem thêm'}</Text>
                                </TouchableOpacity>
                                : null
                        }
                    </ScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const Row_Table = (props) => {
    const { data = [], dataSetting = [], keyViewTime = '', indexMore = 10 } = props
    return (
        <View>
            {
                data.map((item, index) => {
                    if (index < indexMore) {
                        return (
                            <View style={{ flexDirection: 'row' }} key={index}>
                                <View style={{ borderWidth: 0.5, padding: 10, width: 80, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#7e0019' }}>{moment(keyViewTime != '' ? item[keyViewTime] : '').format('HH:mm')}</Text>
                                </View>
                                {
                                    Object.keys(item).map(function (key, _i) {
                                        if (key != keyViewTime && dataSetting.find(e => e.key == key && e.display)) {
                                            return (
                                                <View style={{ borderWidth: 0.5, padding: 10, borderLeftWidth: 0, width: 80, alignItems: 'center' }}>
                                                    <Text style={{ fontSize: reText(12) }}>{item[key].toFixed(3)}</Text>
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </View>
                        )
                    }
                })
            }
        </View>
    )
}

const Row_Title = (props) => {
    const { data = [] } = props
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ borderWidth: 0.5, padding: 10, width: 80, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#7e0019' }}>{'Thời gian'}</Text>
            </View>
            {
                data.map((item, index) => {
                    return (
                        <View key={index} style={{ borderWidth: 0.5, padding: 10, borderLeftWidth: index > 0 ? 0 : 0.5, width: 80, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(12), color: '#ff7e00' }}>{item}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

const stDetailsChart = StyleSheet.create({
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
    btnMore: {
        padding: 10, backgroundColor: '#ff7e00', alignSelf: 'center', borderRadius: 5, paddingHorizontal: 15, marginTop: 10
    },
    txtMore: {
        color: colors.white, fontWeight: 'bold'
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
export default Utils.connectRedux(DetailsChartsNuoc, mapStateToProps, true);
