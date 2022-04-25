import React, { Component, createRef } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Images } from '../../images'
import apiQuanTrac from './apiQuanTrac'
import ChartKhongKhi from './ChartKhongKhi'
import ChartNuoc from './ChartNuoc'
import CompAQI from './CompAQI'
import RecomendAQI from './RecomendAQI'
import TypeQuanTrac from './TypeQuanTrac'

export class BieuDoQuanTrac extends Component {
    constructor(props) {
        super(props)
        this.item = Utils.ngetParam(this, 'item', '')
        this.state = {
            dataAQI: '',
            dataChartKK: [],
            dataChartNuoc: []
        };
        this.refLoading = createRef()
    };

    componentDidMount() {
        this.getAQI()
        this.getDataCharst()
    }

    getAQI = async () => {
        if (this.item.TYPESTRAM == TypeQuanTrac.TYPESTRAM.KHONGKHI) {
            let res = await apiQuanTrac.GetAQI_TramQuanTrac(this.item.id)
            Utils.nlog('[LOG] AQI TRAM', res)
            if (res && res.data) {
                this.setState({ dataAQI: res.data })
            } else {
                this.setState({ dataAQI: '' })
            }
        }
    }

    getDataCharst = async (dataSetting = []) => {
        switch (this.item.TYPESTRAM) {
            case TypeQuanTrac.TYPESTRAM.KHONGKHI:
                {
                    const body = {
                        "stationId": this?.item?.id.toString(),
                        "time": (new Date()).toISOString()
                    }
                    this.refLoading.current.show()
                    let res = await apiQuanTrac.ChiTietChiSoTramKhongKhi(body)
                    this.refLoading.current.hide()
                    Utils.nlog('[LOG] DATA CHART KK', JSON.parse(res?.data))
                    if (res && res.data) {
                        this.setState({ dataChartKK: JSON.parse(res.data) })
                    } else {
                        this.setState({ dataChartKK: [] })
                    }
                }
                break;
            case TypeQuanTrac.TYPESTRAM.NUOC:
                {
                    //Get mặc định lần đầu
                    let arrIndicate = []
                    TypeQuanTrac.KEY_CHART_NUOC.forEach(e => {
                        if (e.display) {
                            arrIndicate = [...arrIndicate, e.key]
                        }
                    })

                    //If này xử lý call api load data của biểu đồ trạm nước
                    if (dataSetting.length > 0) {
                        dataSetting.forEach(e => {
                            if (e.display) {
                                arrIndicate = [...arrIndicate, e.key]
                            }
                        })
                    }
                    const body = {
                        "stationId": this?.item?.id.toString(),
                        "indicators": arrIndicate
                    }
                    Utils.nlog('[LOG] BODY CHART NUOC', JSON.stringify(body))
                    this.refLoading.current.show()
                    let res = await apiQuanTrac.ChiTietChiSoTramNuoc(body)
                    this.refLoading.current.hide()
                    Utils.nlog('[LOG] DATA CHART NUOC', JSON.parse(res?.data))
                    if (res && res.data) {
                        this.setState({ dataChartNuoc: JSON.parse(res.data) })
                    } else {
                        this.setState({ dataChartNuoc: [] })
                    }
                }
                break;

            default:
                break;
        }
    }

    render() {
        const { dataAQI, dataChartKK, dataChartNuoc } = this.state
        return (
            <View style={stBieuDoQuanTrac.cover}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Chi tiết`.toUpperCase()}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stBieuDoQuanTrac.container}>
                    <ScrollView contentContainerStyle={stBieuDoQuanTrac.containerScroll}>
                        <Text style={stBieuDoQuanTrac.txtTram}>{this.item?.station_name.toUpperCase()}</Text>
                        {
                            this.item.TYPESTRAM == TypeQuanTrac.TYPESTRAM.KHONGKHI ?
                                <>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            dataAQI ?
                                                <>
                                                    <CompAQI titleAQI={'AQI NGÀY'} AQI={dataAQI?.data_1d?.aqi.toFixed(2)} />
                                                    <CompAQI titleAQI={'AQI 1 GIỜ'} AQI={dataAQI?.aqi_hour?.aqi.toFixed(2)} />
                                                </>
                                                : null
                                        }
                                    </View>
                                    {
                                        dataAQI ?
                                            <RecomendAQI AQI={dataAQI?.data_1d?.aqi.toFixed(2)} />
                                            : null
                                    }
                                    <ChartKhongKhi itemTram={this.item} dataChart={dataChartKK} dataSetting={TypeQuanTrac.KEY_CHART_KK} keyViewAxisX={'get_time'} />
                                </>
                                :
                                <ChartNuoc itemTram={this.item} stationId={this.item.id} onLoadProps={(dataSetting) => { this.getDataCharst(dataSetting) }} dataChart={dataChartNuoc} dataSetting={TypeQuanTrac.KEY_CHART_NUOC} keyViewAxisX={'time'} />
                        }
                    </ScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        )
    }
}

const stBieuDoQuanTrac = StyleSheet.create({
    cover: {
        flex: 1,
        backgroundColor: colors.BackgroundHome
    },
    container: {
        flex: 1
    },
    txtTram: {
        fontWeight: 'bold',
        textAlign: 'justify',
        marginBottom: 10,
        color: '#ff7e00',
        lineHeight: 20,
        fontSize: reText(16)
    },
    containerScroll: {
        padding: 10,
        paddingBottom: 50,
    },
})

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(BieuDoQuanTrac, mapStateToProps, true);
