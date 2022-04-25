import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { reText } from '../../../../styles/size';
import { colors } from '../../../../styles'
import { Images } from '../../../images'
import { Width } from '../../../../styles/styles'
import Utils from '../../../../app/Utils'
import apiNamLong from '../../../apis/apiNamLong'
import { ListEmpty } from '../../../../components'
import moment from 'moment'
import { withNavigationFocus } from "react-navigation";
export class ThongBaoCD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoaiTB: [],
            selectThongBao: { "IdRow": -1, "LoaiThongBao": "Tất cả" },
            dataListThongBao: [],
            search: '',
            refreshing: true,
            page: 1,
            record: 10
        }
    }

    componentDidMount() {
        this._getLoaiThongBao()
        this._getListThongBaoCD(this.state.selectThongBao.IdRow, this.state.search)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            this._getListThongBaoCD(this.state.selectThongBao.IdRow, this.state.search)
        }
    }

    _getLoaiThongBao = async () => {
        const res = await apiNamLong.ApiThongBao.ListLoaiThongBao();

        if (res.status == 1) {
            this.setState({ dataLoaiTB: [{ "IdRow": -1, "LoaiThongBao": "Tất cả" }].concat(res.data) })
        }
        else {
            this.setState({ dataLoaiTB: [] })
        }
    }

    _getListThongBaoCD = async (id) => {
        Utils.nlog("Log id ra", id)
        const res = await apiNamLong.ApiThongBao.getListThongBaoCD(id, this.state.search, this.props.isCD);
        Utils.nlog("<.-----------------", res)
        if (res.status == 1) {
            // if (this.state.selectThongBao.IdRow != "-1")
            this.setState({ dataListThongBao: res.data ? res.data : [], refreshing: false })
            //             else {
            //                 if (res.data && res.data.length > 0) {
            //                     let dataNew = [];
            //                     for (let index = 0; index < res.data.length; index++) {
            //                         const element = res.data[index];
            //                         dataNew = [...dataNew, ...element.data]
            //                     }
            //                     dataNew.sort(function (a, b) {
            //                         var aa = a.CreatedDate.split('/').reverse().join(),
            //                             bb = b.CreatedDate.split('/').reverse().join();
            //                         return aa > bb ? -1 : (aa < bb ? 1 : 0);
            //                     });
            //                     this.setState({ dataListThongBao: dataNew, refreshing: false })
            //                 } else {
            //                     this.setState({ dataListThongBao: [], refreshing: false })
            //                 }
            // r
            //             }
        }
        else {
            this.setState({ dataListThongBao: [], refreshing: false })
        }
    }

    _callback = selectValue => {
        this.setState({
            selectThongBao: selectValue
        }, () => this._getListThongBaoCD(selectValue.IdRow));
    }
    _ViewItem = (item, index) => {
        return (
            <View
                key={index}
                style={[{ flex: 1, paddingHorizontal: 5 }]}>
                {
                    <Text allowFontScaling={false}
                        style={{
                            fontSize: 16, textAlign: 'center', fontWeight: item.IdRow == this.state.selectThongBao.IdRow ? 'bold' : '400',
                            color: item.IdRow == this.state.selectThongBao.IdRow ? colors.redStar : colors.black_80, marginVertical: 10
                        }}>{item.LoaiThongBao}</Text>
                }

            </View>
        )
    }
    _DropDown = () => {
        Utils.nlog("------------------------Cư dân:", this.state.dataLoaiTB)
        Utils.goscreen(this.props.nthis, 'Modal_ComponentSelectProps',
            {
                callback: this._callback,
                item: this.state.selectThongBao,
                AllThaoTac: this.state.dataLoaiTB,
                ViewItem: this._ViewItem,
                title: 'Chọn loại thông báo',
            })
    }
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.goscreen(this.props.nthis, 'Modal_ThongBaoChung', { IdRow: item.IdRow, isCD: this.props.isCD })}
                style={{ backgroundColor: !item.IsRead ? colors.turquoiseBlue_10 : colors.white, marginBottom: 5, borderRadius: 4, minHeight: 70 }}>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center', }} >

                        <Image source={Images.icUuDai} style={{ width: Width(8), height: Width(8), tintColor: item.IsRead ? colors.blueGrey : colors.colorButterscotch }} />

                    </View>
                    <View style={{ width: Width(77), }}>
                        <Text numberOfLines={2} style={{ fontSize: reText(12), color: colors.royal, fontWeight: 'bold' }} >{item.ThongBao}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{item.PublishBy}</Text>
                            <Text style={{ color: colors.black_50, fontSize: reText(12), fontStyle: 'italic' }}>{item.CreatedDate ? item.CreatedDate : '---'}</Text>
                        </View>
                        <View style={{ borderWidth: 0.5, alignSelf: 'flex-end', marginTop: 5, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4, borderColor: colors.colorRed }}>
                            <Text style={{ color: colors.colorRed, fontStyle: 'italic', fontSize: reText(12), }}>{item.LoaiThongBao}</Text>
                        </View>
                    </View>
                </View>
                {
                    !item.IsRead ? <Image source={Images.icNew} style={{
                        width: 20, height: 20, tintColor: colors.colorRed,
                        position: 'absolute', top: 0, right: 0
                    }} /> : null
                }

            </TouchableOpacity>
        )
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, () => this._getListThongBaoCD(this.state.selectThongBao.IdRow));
    }

    _Search = () => {
        Utils.nlog("<>this.state.search<>", this.state.search)
        this._getListThongBaoCD(this.state.selectThongBao.IdRow, this.state.search)
    }
    render() {
        const { selectThongBao, dataListThongBao } = this.state
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: reText(12), width: Width(25), color: colors.black_80, fontWeight: 'bold', alignSelf: 'center', }}>Loại thông báo: </Text>
                    <TouchableOpacity onPress={() => this._DropDown()} style={{
                        borderWidth: 0.5, flexDirection: 'row', width: Width(67), justifyContent: 'space-between', paddingHorizontal: 5,
                        paddingVertical: 7, borderRadius: 4, borderColor: colors.black_50, backgroundColor: colors.white
                    }}>
                        <Text style={{ color: colors.black_80 }}>{selectThongBao.LoaiThongBao ? selectThongBao.LoaiThongBao : 'Chọn loại thông báo'}</Text>
                        <Image source={Images.icDropDown} style={{ width: 10, height: 5, tintColor: colors.black_80, alignSelf: 'center', }} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 15, marginTop: 10, flexDirection: 'row' }}>
                    <TextInput placeholder={'Nhập nội dung thông báo để tìm kiếm'} onChangeText={(val) => this.setState({ search: val }, () => this._getListThongBaoCD(this.state.selectThongBao.IdRow, val))}
                        style={{
                            paddingHorizontal: 10, paddingVertical: 10, borderWidth: 0.5, borderRadius: 5, borderColor: colors.black_50, width: Width(71), backgroundColor: colors.white
                        }} />
                    <TouchableOpacity onPress={() => this._Search()} style={{ width: Width(20), backgroundColor: colors.colorChuyenMuc, borderRadius: 5, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: colors.white, fontSize: reText(13) }}>Tìm kiếm</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 1, backgroundColor: colors.black_16, marginVertical: 10 }} />
                <FlatList
                    style={{
                        marginHorizontal: 10, marginBottom: 25,
                        backgroundColor: colors.BackgroundHome,
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

export default withNavigationFocus(ThongBaoCD);
