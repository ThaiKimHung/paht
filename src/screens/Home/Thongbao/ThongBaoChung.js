import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import { reText } from '../../../../styles/size'
import { colors } from '../../../../styles'
import { Images } from '../../../images'
import { Width } from '../../../../styles'
import Utils from '../../../../app/Utils'
import apiNamLong from '../../../apis/apiNamLong'
// import { ListEmpty } from '../../../components'
import moment from 'moment'

export class ThongBaoChung extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataListThongBao: [],
            refreshing: true,
            page: 1,
            record: 10,
            dataLoaiTB: [],
            selectThongBao: { "IdRow": -1, "LoaiThongBao": "Tất cả" },

        }
    }

    componentDidMount() {
        // this._getListThongBaoUuDai()
        this._getLoaiThongBao()
        this._getListThongBaoUuDai(this.state.selectThongBao.IdRow)

    }
    _getLoaiThongBao = async () => {
        const res = await apiNamLong.ApiThongBao.ListLoaiThongBao();
        Utils.nlog("giá trị res-----------aaaa", res)
        if (res.status == 1) {
            this.setState({ dataLoaiTB: [{ "IdRow": -1, "LoaiThongBao": "Tất cả" }].concat(res.data) })
        }
        else {
            this.setState({
                dataLoaiTB:
                    [
                        {
                            "IdRow": -1,
                            "LoaiThongBao": "Tất cả"
                        },
                        {
                            "IdRow": 6,
                            "LoaiThongBao": "Diễn biến dịch bệnh ncovi",
                            "IsSystem": "False"
                        },
                        {
                            "IdRow": 3,
                            "LoaiThongBao": "Thông báo họp cư dân",
                            "IsSystem": "True"
                        },
                        {
                            "IdRow": 2,
                            "LoaiThongBao": "Thông báo phí",
                            "IsSystem": "True"
                        },
                        {
                            "IdRow": 4,
                            "LoaiThongBao": "Thông báo ưu đãi",
                            "IsSystem": "True"
                        }
                    ],
            })
        }
    }

    _getListThongBaoUuDai = async (id) => {
        Utils.nlog("Log id ra", id)
        const res = await apiNamLong.ApiThongBao.getListThongBaoUuDai(id);
        Utils.nlog("<.", res)
        if (res.status == 1) {
            this.setState({ dataListThongBao: res.data, refreshing: false })
        }
        else {
            this.setState({ dataListThongBao: [], refreshing: false })
        }

    }
    _callback = selectValue => {
        this.setState({
            selectThongBao: selectValue
        }, () => this._getListThongBaoUuDai(selectValue.IdRow));
    }
    _ViewItem = (item, index) => {
        return (
            <View
                key={index}
                style={[{ flex: 1, paddingHorizontal: 5 }]}>
                {
                    <Text allowFontScaling={false} style={{
                        fontSize: reText(14),
                        textAlign: 'center', color: item.IdRow == this.state.selectThongBao.IdRow ? colors.colorRedLeft : colors.black_80, fontWeight: item.IdRow == this.state.selectThongBao.IdRow ? 'bold' : '400'
                    }}>{item.LoaiThongBao}</Text>
                }

            </View>
        )
    }
    _DropDown = () => {
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelect',
            {
                callback: this._callback,
                item: this.state.selectThongBao,
                AllThaoTac: this.state.dataLoaiTB,
                ViewItem: this._ViewItem,
            })
    }


    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.goscreen(this.props.nthis, 'Modal_ChiTietTB', { IdRow: item.IdRow })}
                style={{ backgroundColor: item.IsRead ? colors.black_11 : colors.white, marginBottom: 5, borderRadius: 4 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 5, minHeight: 70 }}>
                    <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center', }} >
                        <Image source={Images.icUuDai} style={{ width: Width(8), height: Width(8), tintColor: colors.colorTextSelect }} />
                    </View>
                    <View style={{ width: Width(77), }}>
                        <Text numberOfLines={2} style={{ fontSize: reText(12), color: colors.royal, fontWeight: 'bold' }} >{item.ThongBao}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, }}>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{item.PublishBy}</Text>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{moment(item.CreatedDate).format('DD/MM/YYYY HH:mm')}</Text>
                        </View>
                        <View style={{ borderWidth: 0.5, alignSelf: 'flex-end', marginTop: 5, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4, borderColor: colors.colorRedLeft }}>
                            <Text style={{ color: colors.colorRedLeft, fontStyle: 'italic', fontSize: reText(12), }}>{item.LoaiThongBao}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getListThongBaoUuDai(this.state.selectThongBao.IdRow));

    }


    render() {
        const { dataListThongBao, selectThongBao } = this.state
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: reText(12), width: Width(25), color: colors.black_80, fontWeight: 'bold', alignSelf: 'center', }}>Loại thông báo: </Text>
                    <TouchableOpacity onPress={() => this._DropDown()} style={{
                        borderWidth: 0.5, flexDirection: 'row', width: Width(67), justifyContent: 'space-between', paddingHorizontal: 5,
                        paddingVertical: 7, borderRadius: 4, borderColor: colors.black_50, backgroundColor: colors.white
                    }}>
                        <Text style={{ color: colors.black_80 }}>{selectThongBao.LoaiThongBao}</Text>
                        <Image source={Images.icDropDown} style={{ width: 10, height: 5, tintColor: colors.black_80, alignSelf: 'center', }} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={{
                        marginHorizontal: 10, paddingVertical: 5,
                        backgroundColor: colors.BackgroundHome,
                    }}
                    data={dataListThongBao}
                    renderItem={this._renderItem}
                    // ListEmptyComponent={<ListEmpty textempty='Không có dữ liệu' />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            </View>
        )
    }
}



export default ThongBaoChung;
