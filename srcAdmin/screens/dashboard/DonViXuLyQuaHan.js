import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, nwidth } from '../../../styles/styles'

const widthColumn = () => (nwidth() - 10) / 3

export class DonViXuLyQuaHan extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataHetHan: []
        }
    }

    _GetXuLyQuaHen = async () => {
        let res = await apis.BieuDo.GetList_DanhSachDonViPhanAnhQuaHan();
        // Utils.nlog("Danh sách các đơn vị đã quá hạn xử lý:", res)
        if (res.status == 1) {
            this.setState({ dataHetHan: res.data })
        }
    }

    componentDidMount() {
        this._GetXuLyQuaHen()
    }

    render() {
        const { dataHetHan } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18) }} numberOfLines={2}>{'Danh sách các đơn vị xử lý quá hạn'}</Text>
                    {/* <TouchableOpacity onPress={this.handleFilter} style={{ padding: 5, flexDirection: 'row' }}>
                        <Image source={Images.icFilter} style={[nstyles.nIcon16, { tintColor: colors.brownGreyThree }]} resizeMode='cover' />
                    </TouchableOpacity> */}
                </View>
                {/* <Text style={{ fontWeight: 'bold', color: colors.redStar, paddingVertical: 10, fontSize: reText(18) }}>{'Danh sách các đơn vị xử lý quá hạn'}</Text> */}
                {/* {Header Table} */}
                <View style={{ flexDirection: 'row', width: widthColumn() * 3 }}>
                    <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                        <Text style={[styles.title, { fontWeight: 'bold' }]}>STT</Text>
                    </View>
                    <View style={{ width: widthColumn() + widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
                        <Text style={[styles.title, { fontWeight: 'bold' }]}>Tên đơn vị</Text>
                    </View>
                    <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0 }}>
                        <Text style={[styles.title, { fontWeight: 'bold' }]}>Số lượng</Text>
                    </View>
                </View>

                {
                    dataHetHan && dataHetHan.length > 0 ?
                        dataHetHan && dataHetHan.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', width: widthColumn() * 3 }}>
                                    <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: index == dataHetHan.length - 1 ? 0.5 : 0 }}>
                                        <Text style={styles.title}>{index + 1}</Text>
                                    </View>
                                    <View style={{ width: widthColumn() + widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: index == dataHetHan.length - 1 ? 0.5 : 0 }}>
                                        <Text style={styles.title}>{item.TenPhuongXa}</Text>
                                    </View>
                                    <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: index == dataHetHan.length - 1 ? 0.5 : 0 }}>
                                        <Text style={styles.title}>{item.SoLuong}</Text>
                                    </View>
                                </View>
                            )
                        }) :
                        <>
                            <View style={{ flexDirection: 'row', width: widthColumn() * 3, borderBottomWidth: 0.5 }} />
                            <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
                        </>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title: {
        fontSize: reText(12),
        textAlign: 'center',
        padding: 5
    }
})

export default DonViXuLyQuaHan
