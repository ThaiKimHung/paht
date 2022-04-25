import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { HeaderCom, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height } from '../../../styles/styles'
import ChartBieuDo, { useStateCallback } from './Component/ChartBieuDo'
import FilterLinhVuc from './Component/FilterLinhVuc'
import {
    Get_BieuDo_Top5DonViPhanHoiTeNhat,
    Get_BieuDo_Top5DonViPhanHoiTotNhat,
    Get_BieuDo_Top5DonViXuLyChamNhat,
    Get_BieuDo_Top5DonViXuLyTotNhat
} from '../../apis/apiDashboardPA'
import { Images } from '../../images'
import { store } from '../../../srcRedux/store'
import { SetShowModalNoti } from '../../../srcRedux/actions/theme/Theme'


const DonVi = ({ navigation }) => {

    const [state, setState] = useState({
        dataDonVi: [],
        isLoadingDonVi: true,
        dataDonVi2: [],
        isLoadingDonVi2: true,
        dataPhanHoi: [],
        isLoadingPhanHoi: true,
        dataPhanHoi2: [],
        isLoadingPhanHoi2: true,
        dataLinhVuc: [],
    });

    const [filter, setFilter] = useState({
        date: '',
        linhvuc: '',
    })

    const refDate = useRef(null)

    useEffect(() => {  // dùng cho v5
        Load_FilterTotab1();
        const unsubscribe = navigation.addListener('didFocus', e => { // dùng didFocus cho v3
            Load_FilterTotab1();
        });
        return () => unsubscribe.remove();
    }, []);

    const getAllapi = async (thang = '', linhvuc = '') => {
        let res = await Get_BieuDo_Top5DonViXuLyChamNhat(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataDonVi: res && res.status === 1 ? res.data : [],
            isLoadingDonVi: false,
        }));
        let res2 = await Get_BieuDo_Top5DonViPhanHoiTotNhat(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataPhanHoi: res2 && res2.status === 1 ? res2.data : [],
            isLoadingPhanHoi: false,
        }));
        let res3 = await Get_BieuDo_Top5DonViPhanHoiTeNhat(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataPhanHoi2: res3 && res3.status === 1 ? res3.data : [],
            isLoadingPhanHoi2: false,
        }));
        let res4 = await Get_BieuDo_Top5DonViXuLyTotNhat(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataDonVi2: res4 && res4.status === 1 ? res4.data : [],
            isLoadingDonVi2: false,
            dataLinhVuc: Utils.getGlobal(nGlobalKeys.DataLinhVuc)
        }));
    }

    const callbackTuThang = (date) => { // lấy date
        Utils.setGlobal(nGlobalKeys.Month, date);
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? 0 : Utils.getGlobal(nGlobalKeys.LinhVuc);
        let datenew = ConverDate(date);
        setFilter({
            ...filter,
            date: datenew
        })
        getAllapi(datenew, linhvuc);
    }

    const onPress = () => {
        let value = Utils.getGlobal(nGlobalKeys.Month)
        Utils.goscreen(this, 'Modal_MonthYear',
            {
                callback: callbackTuThang,
                DateInput: value,
            })
    }

    const _callback = (selectBuocXuLy) => { // lấy lĩnh vực
        let value = selectBuocXuLy['IdLinhVuc']
        let month = ConverDate(Utils.getGlobal(nGlobalKeys.Month));
        let value2 = selectBuocXuLy['LinhVuc']
        Utils.setGlobal(nGlobalKeys.LinhVuc, value);
        Utils.setGlobal(nGlobalKeys.TenLinhVuc, value2);
        setFilter({
            ...filter,
            linhvuc: value2
        })
        getAllapi(month, value)
    }

    const showFilter = () => {
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc)
        Utils.goscreen(this, 'Modal_List_LinhVuc', {
            callback: _callback, item: linhvuc,
            AllLinhVuc: state.dataLinhVuc, KeyValue: 'LinhVuc', KeyId: 'IdLinhVuc'
        })
    }

    const ConverDate = (date = '') => {
        let month = date?.getMonth() < 9 ? '0' + (date?.getMonth() + 1) : (date?.getMonth() + 1);
        let datenew = month + '/' + date.getFullYear();
        return datenew;
    }

    const Load_FilterTotab1 = () => {
        console.log('vao fouces')
        let month = Utils.getGlobal(nGlobalKeys.Month) === undefined ? '' : Utils.getGlobal(nGlobalKeys.Month);
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? 0 : Utils.getGlobal(nGlobalKeys.LinhVuc);
        let tenlinhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? '' : Utils.getGlobal(nGlobalKeys.TenLinhVuc);
        if (month === '') {
            let dateNow = new Date();
            let month = dateNow.getMonth() < 9 ? '0' + (dateNow.getMonth() + 1) : (dateNow.getMonth() + 1);
            let date = month + '/' + dateNow.getFullYear();
            Utils.setGlobal(nGlobalKeys.Month, dateNow);
            setFilter({
                ...filter,
                date: date,
            })
            getAllapi(date, linhvuc)
            return;
        }
        setFilter({
            ...filter,
            date: ConverDate(month),
            linhvuc: tenlinhvuc,
        })
        getAllapi(ConverDate(month), linhvuc)
    }
    const GoScreen = (item, key) => {
        let dateNow = Utils.getGlobal(nGlobalKeys.Month, '');
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? 0 : Utils.getGlobal(nGlobalKeys.LinhVuc);
        const data = { ...item, keyApi: key, date: dateNow, linhvuc: linhvuc }
        Utils.goscreen({ navigation }, 'Modal_DetailsChart', { item: data })
    }
    return (
        <View style={styles.container}>
            <HeaderCom
                nthis={{ navigation }} titleText={'Tình hình xử lý theo đơn vị'}
                iconLeft={Images.icSlideMenu}
                onPressLeft={() => navigation.openDrawer()}
                iconRight={Images.icHome}
                onPressRight={() => {
                    store.dispatch(SetShowModalNoti(false));
                    Utils.goscreen({ navigation }, 'ManHinh_Home');
                }}
            />
            <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 5, paddingVertical: 10 }}>
                    <FilterLinhVuc ref={refDate} onPress={onPress} showFilter={showFilter} date={filter.date} linhvuc={filter.linhvuc} />
                </View>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={{
                    }}>
                        <Text style={styles.txtTitleChart}>{'5 Đơn vị xử lý chậm nhất'}</Text>
                        <ChartBieuDo data={state.dataDonVi} type={'BieuDoDonViXulyChamNhat'} keylabel1='SoLuong' keylabel2='SLQuaHanDaXL' keylabel3='TenPhuongXa' heightConTainer={200}
                            colorsLine1={colors.orange} colorsLine2={colors.redStar} arrayTxtTile={['Tổng số phản ánh', 'Quá hạn']}
                            onPress={(item) => GoScreen(item, 'Top5DonViXuLyTheoHen')} isLoading={state.isLoadingDonVi}
                        />
                    </View>
                    <View style={styles.viewChart}>
                        <Text style={styles.txtTitleChart}>{'5 Đơn vị xử lý tốt nhất'}</Text>
                        <ChartBieuDo data={state.dataDonVi2} type={'BieuDoDonViXulyChamNhat'} keylabel1='SoLuong' keylabel2='SLTrongHanDaXL' keylabel3='TenPhuongXa' heightConTainer={200}
                            colorsLine1={colors.blueColumn} colorsLine2={colors.greenLine} arrayTxtTile={['Tổng số phản ánh', 'Đúng hạn']}
                            onPress={(item) => GoScreen(item, 'Top5DonViXuLyTheoHenTot')} isLoading={state.isLoadingDonVi2}
                        />
                    </View>
                    <View style={styles.viewChart}>
                        <Text style={styles.txtTitleChart}>{'5 Đơn vị phản hồi tốt nhất'}</Text>
                        <ChartBieuDo heightConTainer={Height(25)} data={state.dataPhanHoi} type={'DonViPhanHoi'} keylabel1='SoLuong' keylabel2='HaiLong' keylabel3='KhongHaiLong'
                            keylabel4='TenPhuongXa' arrayTxtTile={['Hài lòng', 'Không hài lòng']}
                            colorsLine1={colors.blueColumn} colorsLine2={colors.orange}
                            onPress={(item) => GoScreen(item, 'Top5DonViPhanHoiDanhGia')} isLoading={state.isLoadingPhanHoi}
                        />
                    </View>
                    <View style={styles.viewChart}>
                        <Text style={styles.txtTitleChart}>{'5 Đơn vị  có phản hồi tệ nhất'}</Text>
                        <ChartBieuDo heightConTainer={Height(25)} data={state.dataPhanHoi2} type={'DonViPhanHoi'}
                            keylabel1='SoLuong' keylabel2='KhongHaiLong' keylabel3='HaiLong'
                            keylabel4='TenPhuongXa' arrayTxtTile={['Không hài lòng', 'Hài lòng']} colorsLine1={colors.orange}
                            colorsLine2={colors.blueColumn} onPress={(item) => GoScreen(item, 'Top5DonViPhanHoiDanhGiaTot')}
                            isLoading={state.isLoadingPhanHoi2}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default DonVi

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayBackGroundChart
    },
    viewChart: {
        paddingVertical: 5,
    },
    txtTitleChart: {
        marginBottom: 5,
        fontSize: reText(20),
        fontWeight: 'bold'
    }
})
