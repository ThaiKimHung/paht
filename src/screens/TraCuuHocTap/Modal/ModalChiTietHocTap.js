import { StyleSheet, Text, View, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeaderCus, IsLoading, ListEmpty } from '../../../../components';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { Images } from '../../../images';
import { GetTraCuu_KetQua_HocTap } from '../apiHocTap/apiHocTap'
import moment from 'moment';


const dataTest =
{
    message: "OK",
    code: 200,
    statusResponse: 0,
    total: 1,
    rows: [
        {
            namHoc: 2020,
            hocKy: 1,
            maLopHoc: "LH_64628509_2020_1000748290",
            maHocSinh: "HS1010056016",
            diemTongKet: 6.9,
            maHocLuc: "K",
            maHanhKiem: "T",
            hash: "SFMxMDEwMDU2MDE2LTY0NjI4NTA5LTIwMjAtMQ==",
            syncVersion: 920069,
            maTruongHoc: "64628509",
            tongKetHsId: 39411564,
            isKhamSkDky: false,
            isTheoDoiBdoCnang: false,
            isTheoDoiBdoCcao: false,
            isSuyDduongTheTcoi: false,
            isPhoiIchayHhap: false,
            isBeoPhi: false,
            isLamQuenThoc: false,
            maDanhHieu: "TT",
            isKthuongCnam: false,
            isKthuongDxuat: false,
            isHthanhCtrinhLhoc: false,
            isLenLop: false,
            isRenLuyenLai: false,
            isGuiHtruongChoLenLop: false,
            isDuXetTotNghiep: false,
            isTotNghiep: false,
            syncNgayCapNhat: 1625733794993,
            syncMaPhongGd: "628",
            syncMaSoGd: "64",
            syncMaDoiTac: "SMAS",
            capHoc: 2,
            khoiHoc: 7,
            isHoanThanhChuongTrinhMamMon: false,
            isHoanThanhChuongTrinhTieuHoc: false,
            isDanhGiaBoSung: false,
            isThiLai: false,
            listDiemTongKetMon: [
                {
                    diemTongKetMonId: 131252756,
                    maMonHoc: "TOC2",
                    tenMonHoc: "Toán",
                    loaiDanhGia: 0,
                    diemSo: 6.7,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252691,
                    maMonHoc: "VLY2",
                    tenMonHoc: "Vật lí",
                    loaiDanhGia: 0,
                    diemSo: 5.0,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252757,
                    maMonHoc: "SHC2",
                    tenMonHoc: "Sinh học",
                    loaiDanhGia: 0,
                    diemSo: 8.3,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252689,
                    maMonHoc: "NVN2",
                    tenMonHoc: "Ngữ văn",
                    loaiDanhGia: 0,
                    diemSo: 6.4,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252758,
                    maMonHoc: "LSU2",
                    tenMonHoc: "Lịch sử",
                    loaiDanhGia: 0,
                    diemSo: 7.0,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252690,
                    maMonHoc: "DLY2",
                    tenMonHoc: "Địa lí",
                    loaiDanhGia: 0,
                    diemSo: 5.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252760,
                    maMonHoc: "TAH2",
                    tenMonHoc: "Tiếng Anh",
                    loaiDanhGia: 0,
                    diemSo: 6.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252759,
                    maMonHoc: "GCD2",
                    tenMonHoc: "GDCD",
                    loaiDanhGia: 0,
                    diemSo: 7.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252761,
                    maMonHoc: "CNE2",
                    tenMonHoc: "Công nghệ",
                    loaiDanhGia: 0,
                    diemSo: 6.1,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252692,
                    maMonHoc: "TDC2",
                    tenMonHoc: "Thể dục",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252762,
                    maMonHoc: "ANC2",
                    tenMonHoc: "Âm nhạc",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252764,
                    maMonHoc: "MTT2",
                    tenMonHoc: "Mỹ thuật",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252763,
                    maMonHoc: "THC2",
                    tenMonHoc: "Tin học",
                    loaiDanhGia: 0,
                    diemSo: 8.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                }
            ]
        }
    ]
}

const dataTest2 =
{
    message: "OK",
    code: 200,
    statusResponse: 0,
    total: 1,
    rows: [
        {
            namHoc: 2020,
            hocKy: 1,
            maLopHoc: "LH_64628509_2020_1000748290",
            maHocSinh: "HS1010056016",
            diemTongKet: 6.9,
            nhanXet: "- Ngoan hiền,lễ phép, tham gia đầy đủ trong phong trào. - Nghiêm túc và chuyên cần trong học tập.",
            maHocLuc: "K",
            maHanhKiem: "T",
            hash: "SFMxMDEwMDU2MDE2LTY0NjI4NTA5LTIwMjAtMQ==",
            syncVersion: 920069,
            maTruongHoc: "64628509",
            tongKetHsId: 39411564,
            isKhamSkDky: false,
            isTheoDoiBdoCnang: false,
            isTheoDoiBdoCcao: false,
            isSuyDduongTheTcoi: false,
            isPhoiIchayHhap: false,
            isBeoPhi: false,
            isLamQuenThoc: false,
            maDanhHieu: "TT",
            isKthuongCnam: false,
            isKthuongDxuat: false,
            isHthanhCtrinhLhoc: false,
            isLenLop: false,
            isRenLuyenLai: false,
            isGuiHtruongChoLenLop: false,
            isDuXetTotNghiep: false,
            isTotNghiep: false,
            syncNgayCapNhat: 1625733794993,
            syncMaPhongGd: "628",
            syncMaSoGd: "64",
            syncMaDoiTac: "SMAS",
            capHoc: 2,
            khoiHoc: 7,
            isHoanThanhChuongTrinhMamMon: false,
            isHoanThanhChuongTrinhTieuHoc: false,
            isDanhGiaBoSung: false,
            isThiLai: false,
            listDiemTongKetMon: [
                {
                    diemTongKetMonId: 131252756,
                    maMonHoc: "TOC2",
                    tenMonHoc: "Toán",
                    loaiDanhGia: 0,
                    diemSo: 6.7,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252691,
                    maMonHoc: "VLY2",
                    tenMonHoc: "Vật lí",
                    loaiDanhGia: 0,
                    diemSo: 5.0,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252757,
                    maMonHoc: "SHC2",
                    tenMonHoc: "Sinh học",
                    loaiDanhGia: 0,
                    diemSo: 8.3,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252689,
                    maMonHoc: "NVN2",
                    tenMonHoc: "Ngữ văn",
                    loaiDanhGia: 0,
                    diemSo: 6.4,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252758,
                    maMonHoc: "LSU2",
                    tenMonHoc: "Lịch sử",
                    loaiDanhGia: 0,
                    diemSo: 7.0,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252690,
                    maMonHoc: "DLY2",
                    tenMonHoc: "Địa lí",
                    loaiDanhGia: 0,
                    diemSo: 5.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252760,
                    maMonHoc: "TAH2",
                    tenMonHoc: "Tiếng Anh",
                    loaiDanhGia: 0,
                    diemSo: 6.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252759,
                    maMonHoc: "GCD2",
                    tenMonHoc: "GDCD",
                    loaiDanhGia: 0,
                    diemSo: 7.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252761,
                    maMonHoc: "CNE2",
                    tenMonHoc: "Công nghệ",
                    loaiDanhGia: 0,
                    diemSo: 6.1,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252692,
                    maMonHoc: "TDC2",
                    tenMonHoc: "Thể dục",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252762,
                    maMonHoc: "ANC2",
                    tenMonHoc: "Âm nhạc",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252764,
                    maMonHoc: "MTT2",
                    tenMonHoc: "Mỹ thuật",
                    loaiDanhGia: 1,
                    diemDanhGia: "Đ",
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                },
                {
                    diemTongKetMonId: 131252763,
                    maMonHoc: "THC2",
                    tenMonHoc: "Tin học",
                    loaiDanhGia: 0,
                    diemSo: 8.9,
                    syncNgayCapNhat: 1625733795017,
                    syncMaPhongGd: "628",
                    syncMaSoGd: "64",
                    syncMaTruongHoc: "64628509",
                    syncMaDoiTac: "SMAS"
                }
            ]
        }
    ]
}

const ModalChiTietHocTap = (props) => {
    const ItemHs = Utils.ngetParam({ props: props }, 'itemHs', null)
    const ItemTraCuu = Utils.ngetParam({ props: props }, 'itemHocTap', null) // params tra cứu học tập
    Utils.nlog('gia tri param tra cứu ', ItemTraCuu)
    const [itemHocTap, setItemHocTap] = useState({
        ItemHs: '',
        ListKetQuaHocTap: [],
    })
    useEffect(() => {
        // if (ItemHs) {
        //     Get_Api(ItemHs?.ma, 2020, -1);
        // }
        if (ItemTraCuu) {
            Get_Api(ItemTraCuu?.maHs, ItemTraCuu.namHoc, ItemTraCuu.hocKy);
        }
    }, [ItemTraCuu])

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


    const Get_Api = async (mahs = "", namhoc = new Date().getFullYear, hocKy = -1) => {
        Utils.setToggleLoading(true);
        const body1 = {
            maHocSinh: mahs,
            namHoc: namhoc,
        }
        let res = await GetTraCuu_KetQua_HocTap(hocKy === -1 ? body1 : {
            ...body1,
            hocKy: hocKy,
        });
        Utils.nlog('gia tri res ket qua hoc tap', res)
        // let dataTempt = res && res.status === 1 ? res.data?.rows.sort((a, b) => {
        //     return b?.hocKy - a?.hocKy
        // }) : null
        // Utils.nlog('gia tri data sau khi sap xep', dataTempt)
        setItemHocTap({
            ...itemHocTap,
            ListKetQuaHocTap: res && res.status === 1 ? res?.data?.rows : []
        })
        Utils.setToggleLoading(false);
    }

    Utils.nlog('gia tri state', itemHocTap)
    const renderRow = (label = '', keyValue = '', itemTile = ItemHs) => {
        // Utils.nlog('gia  tri item row', itemTile)
        return (
            <View style={{ flexDirection: 'row', borderWidth: 1, borderTopWidth: 0 }}>
                <Text style={{ borderRightWidth: 1, padding: 5, width: '25%' }} >{label}</Text>
                <Text style={{ flex: 1, padding: 5, fontWeight: 'bold', textAlign: 'justify' }} >
                    {itemTile?.[keyValue] ? itemTile[keyValue] : ''}</Text>
            </View>
        )
    }

    Utils.nlog('gia tri', itemHocTap)
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
                    {itemHocTap?.ListKetQuaHocTap?.length > 0 ? itemHocTap.ListKetQuaHocTap?.map((item, index) => {
                        return (
                            <View key={index} style={{ borderWidth: 1, marginTop: 15 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        padding: 5, flex: 1, textAlign: 'center',
                                        backgroundColor: colors.grayLight, fontWeight: 'bold'
                                    }}
                                    >Bảng  điểm học kì {index + 1}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                                    <Text style={[styles.vRightRows, { fontWeight: 'bold' }]}>Môn học</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={[styles.vRightRows, { fontWeight: 'bold' }]} >Điểm môn học</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={[styles.vRightRows, { fontWeight: 'bold', flex: 1.2 }]} >Ngày cập nhật</Text>
                                </View>
                                {item?.listDiemTongKetMon?.map((i, index) => {
                                    let ngaycapnhat = moment(new Date(i?.syncNgayCapNhat)).format('DD/MM/YYYY');
                                    return (
                                        <View key={index} style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                                            <Text style={[styles.vRightRows, { textAlign: 'left' }]} >{i.tenMonHoc}</Text>
                                            <View style={styles.lineHeight} />
                                            <Text style={styles.vRightRows} >{i.diemSo ? i.diemSo.toFixed(1) : 'Đang cập nhật'}</Text>
                                            <View style={styles.lineHeight} />
                                            <Text style={[styles.vRightRows, { flex: 1.2 }]} >{ngaycapnhat}</Text>
                                        </View>
                                    )
                                })}
                                <View style={{ backgroundColor: colors.black, height: 3 }} />
                                <View style={styles.vTable}>
                                    <Text style={styles.labelTongKet}>Điểm tổng kết</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={styles.txtItemLast} >{item.diemTongKet ? item.diemTongKet : 'Đang cập nhật'}</Text>
                                </View>
                                <View style={styles.vTable}>
                                    <Text style={styles.labelTongKet}>Hạnh kiểm</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={styles.txtItemLast} >{item.maHanhKiem ? item.maHanhKiem : 'Đang cập nhật'}</Text>
                                </View>
                                <View style={styles.vTable} >
                                    <Text style={styles.labelTongKet}>Mã danh hiệu</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={styles.txtItemLast} >{item.maDanhHieu ? item.maDanhHieu : 'Đang cập nhật'}</Text>
                                </View>
                                <View style={styles.vTable}>
                                    <Text style={styles.labelTongKet}>Nhận xét</Text>
                                    <View style={styles.lineHeight} />
                                    <Text style={[styles.txtItemLast, { textAlign: 'left' }]} >{item.nhanXet ? item.nhanXet : 'Đang cập nhật'}</Text>
                                </View>
                            </View>
                        )
                    }) : <ListEmpty textempty={'Không có dữ liệu ....'} />}
                </View>
            </ScrollView>
            <IsLoading />
        </View>
    )
}

export default ModalChiTietHocTap

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