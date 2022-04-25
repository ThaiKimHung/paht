import React, { Component } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import { DanhSachTuongTuPA } from '../../apis/apiapp'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { Height, nstyles } from '../../../styles/styles'
import HeaderModal from './components/HeaderModal'
import HtmlViewCom from '../../../components/HtmlView'
import { reText } from '../../../styles/size'
import { ListEmpty } from '../../../components'

export class ModalTuongTu extends Component {
    constructor(props) {
        super(props)
        this.IdPA = Utils.ngetParam(this, 'IdPA'),
            this.NoiDung = Utils.ngetParam(this, 'NoiDung'),
            this.state = {
                dataTuongTu: []
            }
    }
    componentDidMount() {
        this._DanhSachTuongTuPA();
    }

    _DanhSachTuongTuPA = async () => {
        let res = await DanhSachTuongTuPA(this.IdPA, this.NoiDung)
        if (res.status == 1 && res.data) {
            this.setState({ dataTuongTu: res.data.result })
        }

    }
    _renderTuongTu = ({ item, index }) => {
        const { dataTuongTu } = this.state
        // Utils.nlog("Gia tri Daata ssssssssss====", item, dataAo.length)
        //backgroundColor: dataAo.length % 2 == 0 ? colors.greenFE : colors.white
        return (
            <View key={index} >
                <TouchableOpacity style={{ flexDirection: "row", justifyContent: 'space-between', }}
                    onPress={() => Utils.goscreen(this, "sc_ChiTietPhanAnh", { IdPA: item.id, callback: Utils.goback(this) })} >
                    <HtmlViewCom html={item.content} style={{ marginRight: 28 }} />
                    <Text style={{ color: colors.colorGrayText, fontSize: reText(14) }}>{item.similarity}</Text>
                </TouchableOpacity>
                <View style={{
                    height: 1, backgroundColor: index == dataTuongTu.length - 1 ? null : colors.black_16,
                    marginVertical: index == dataTuongTu.length - 1 ? 5 : 10,
                }} />
            </View>

        )
    }
    _keyExtracter = (item, index) => `${item.id}`;
    render() {
        return (
            <View style={nstyles.ncontainer}>
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, paddingTop: Height(3), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title={`Phản ánh tương tự`} />
                    <View style={{ height: 1, backgroundColor: colors.black_16 }} />
                    <View style={{
                        borderWidth: 0.5, marginTop: 10, marginHorizontal: 15,
                        flexDirection: 'row', justifyContent: 'space-between',
                        paddingHorizontal: 15, paddingVertical: 10
                    }}>

                        <View style={{}}>
                            <Text style={{ fontSize: reText(14) }}>Nội dung</Text>
                        </View>
                        <View style={{ paddingLeft: 15, justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14) }} >Độ tương đồng</Text>
                        </View>

                    </View>
                    <FlatList
                        contentContainerStyle={{ borderWidth: 0.5, marginHorizontal: 15, paddingHorizontal: 15, paddingTop: 10 }}
                        data={this.state.dataTuongTu}
                        renderItem={this._renderTuongTu}
                        keyExtractor={this._keyExtracter}
                        ListEmptyComponent={<ListEmpty textempty='Không có dữ liệu' isImage={false} />}
                    />
                </View>
            </View>
        )
    }
}

export default ModalTuongTu
