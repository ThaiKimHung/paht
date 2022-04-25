import { StyleSheet, Text, View, BackHandler, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { HeaderCus, IsLoading, ListEmpty } from '../../../components';
import { Images } from '../../images';
import { colors } from '../../../styles';
import Utils from '../../../app/Utils';
import moment from 'moment';

const KetQuaHocTap = (props) => {
    // const ListDiemMh = Utils.ngetParam(props, 'ListDiem', [])
    const ItemTraCuu = Utils.ngetParam({ props: props }, 'ItemTraCuu', null)
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const handleBackButton = () => {
        Utils.goback();
        return true
    }

    const Rank_Text = (text = '') => {
        switch (text) {
            case 'G':
                return 'Giỏi';
            case 'T':
                return 'Tốt';
            case 'K':
                return 'Khá';
            case 'TB':
                return 'Trung Bình';
            case 'Y':
                return 'Yếu';
            default:
                break;
        }
    }
    Utils.nlog('gia tri list diem mon hoc', ItemTraCuu)
    return (
        <View style={styles.container}
            contentContainerStyle={{ paddingBottom: 20, }}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => {
                    Utils.goback();
                }}
                iconLeft={Images.icBack}
                title={`Kết quả học tập`}
                styleTitle={{ color: colors.white }}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} >
                <View style={{ paddingHorizontal: 12 }}>
                    {/* {ListDiemMh.length > 0 ? ListDiemMh.map((item, index) => {
                        return ( */}
                    {ItemTraCuu ?
                        <View style={{ borderWidth: 1, marginTop: 15 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{
                                    padding: 5, flex: 1, textAlign: 'center',
                                    backgroundColor: colors.grayLight, fontWeight: 'bold'
                                }}
                                >Bảng  điểm học kỳ {ItemTraCuu?.hocKy ? ItemTraCuu.hocKy === 3 ? 'cả năm' : ItemTraCuu.hocKy : ''} </Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                                <Text style={[styles.vRightRows, { fontWeight: 'bold' }]}>Môn học</Text>
                                <View style={styles.lineHeight} />
                                <Text style={[styles.vRightRows, { fontWeight: 'bold' }]} >Điểm môn học</Text>
                                {/* <View style={styles.lineHeight} />
                                <Text style={[styles.vRightRows, { fontWeight: 'bold', flex: 1.2 }]} >Ngày cập nhật</Text> */}
                            </View>
                            {ItemTraCuu?.listDiemTongKetMon?.map((i, index) => {
                                let ngaycapnhat = moment(new Date(i?.syncNgayCapNhat)).format('DD/MM/YYYY');
                                return (
                                    <View key={index} style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                                        <Text style={[styles.vRightRows, { textAlign: 'left' }]} >{i.tenMonHoc}</Text>
                                        <View style={styles.lineHeight} />
                                        <Text style={styles.vRightRows} >{i.loaiDanhGia === 1 ? i.diemDanhGia ? (i.diemDanhGia === 'Đ' ? 'Đạt' : 'Chưa đạt')
                                            : 'Chưa cập nhật' : i.diemSo ? i.diemSo.toFixed(1) : 'Chưa cập nhật'}</Text>
                                        {/* <View style={styles.lineHeight} />
                                        <Text style={[styles.vRightRows, { flex: 1.2 }]} >{ngaycapnhat}</Text> */}
                                    </View>
                                )
                            })}
                            <View style={{ backgroundColor: colors.black, height: 3 }} />
                            <View style={styles.vTable}>
                                <Text style={styles.labelTongKet}>Điểm tổng kết</Text>
                                <View style={styles.lineHeight} />
                                <Text style={styles.txtItemLast} >{ItemTraCuu?.diemTongKet ? ItemTraCuu.diemTongKet.toFixed(1) : 'Chưa cập nhật'}</Text>
                            </View>
                            <View style={styles.vTable}>
                                <Text style={styles.labelTongKet}>Hạnh kiểm</Text>
                                <View style={styles.lineHeight} />
                                <Text style={styles.txtItemLast} >{ItemTraCuu?.maHanhKiem ? Rank_Text(ItemTraCuu.maHanhKiem) : 'Chưa cập nhật'}</Text>
                            </View>
                            <View style={styles.vTable} >
                                <Text style={styles.labelTongKet}>Mã danh hiệu</Text>
                                <View style={styles.lineHeight} />
                                <Text style={styles.txtItemLast} >{ItemTraCuu?.maHocLuc ? Rank_Text(ItemTraCuu.maHocLuc) : 'Chưa cập nhật'}</Text>
                            </View>
                            <View style={styles.vTable}>
                                <Text style={styles.labelTongKet}>Nhận xét</Text>
                                <View style={styles.lineHeight} />
                                <Text style={[styles.txtItemLast, { textAlign: 'left' }]} >{ItemTraCuu?.nhanXet ? ItemTraCuu.nhanXet : 'Chưa cập nhật'}</Text>
                            </View>
                        </View>
                        : <ListEmpty textempty={'Không có dữ liệu ....'} />}
                </View>
            </ScrollView>
        </View>
    )
}

export default KetQuaHocTap

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    vTable: {
        flexDirection: 'row',
        borderTopWidth: 1,
        // borderRightWidth: 1
    },
    vRightRows: {
        padding: 5,
        flex: 1,
        textAlign: 'center'
    },
    labelTongKet: {
        padding: 5,
        flex: 1,
        fontWeight: 'bold'
    },
    lineHeight: {
        backgroundColor: colors.black,
        width: 1
    },
    txtItemLast: {
        padding: 5,
        flex: 1.6,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})