import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import { reText } from '../../../../styles/size'
import { colors } from '../../../../styles'
import { Images } from '../../../images'
import { Width } from '../../../../styles/styles'
import Utils from '../../../../app/Utils'
import apiNamLong from '../../../apis/apiNamLong'
import { ListEmpty } from '../../../../components'
import moment from 'moment'

export class ThongBaoUuDai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataListThongBao: [],
            refreshing: true,
            page: 1,
            record: 10
        }
    }

    componentDidMount() {
        this._getListThongBaoUuDai()
    }

    _getListThongBaoUuDai = async () => {
        const res = await apiNamLong.ApiThongBao.getListThongBaoUuDai();
        Utils.nlog("<.---------------Uuu ", res)
        if (res.status == 1) {
            this.setState({ dataListThongBao: res.data, refreshing: false })
        }
        else {
            this.setState({ dataListThongBao: [], refreshing: false })
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.goscreen(this.props.nthis, 'Modal_ThongBaoChung', { IdRow: item.IdRow })}
                style={{ backgroundColor: item.IsRead ? colors.black_11 : colors.white, marginBottom: 5, borderRadius: 4 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 5, minHeight: 70 }}>
                    <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center', }} >
                        <Image source={Images.icUuDai} style={{ width: Width(8), height: Width(8), tintColor: colors.colorButterscotch }} />
                    </View>
                    <View style={{ width: Width(77), }}>
                        <Text numberOfLines={2} style={{ fontSize: reText(12), color: colors.royal, fontWeight: 'bold' }} >{item.ThongBao}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, }}>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{item.PublishBy}</Text>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{item.CreatedDate ? item.CreatedDate : '---'}</Text>
                        </View>
                        <View style={{ borderWidth: 0.5, alignSelf: 'flex-end', marginTop: 5, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4, borderColor: colors.colorRed }}>
                            <Text style={{ color: colors.colorRed, fontStyle: 'italic', fontSize: reText(12), }}>{item.LoaiThongBao}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getListThongBaoUuDai());
    }


    render() {
        const { dataListThongBao } = this.state
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{
                        marginHorizontal: 10, paddingVertical: 5,
                        backgroundColor: colors.BackgroundHome, marginBottom: 20
                    }}
                    data={dataListThongBao}
                    renderItem={this._renderItem}
                    ListEmptyComponent={<ListEmpty textempty='Không có dữ liệu' />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            </View>
        )
    }
}


export default ThongBaoUuDai
