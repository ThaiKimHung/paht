import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { HeaderCom, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import ChartBieuDo from './Component/ChartBieuDo'
import FilterLinhVuc from './Component/FilterLinhVuc'
import { Get_BieuDoPATongQuan, Get_BieuDo_DienBienXuLyPATrong6Thang, Get_BieuDo_Top5KhuVucPA, Get_List_LinhVuc } from '../../apis/apiDashboardPA'
import { Images } from '../../images'
import { store } from '../../../srcRedux/store'
import { SetShowModalNoti } from '../../../srcRedux/actions'




const TongQuan = ({ navigation }) => {

    const [dtThongKe, setDtThongKe] = useState({
        dataThongKe: [],
        isLoadingThongKe: true,
    })

    const [dtPhanAnh, setDtPhanAnh] = useState({
        dataPhanAnh: [],
        isLoadingPA: true,
    })

    const [dtPhanAnh6T, setPhanAnh6T] = useState({
        dataPhanAnh6T: [],
        isLoadingPA6T: true,
    })

    const [filter, setFilter] = useState({
        date: '',
        linhvuc: '',
    })
    const refDate = useRef(null)

    useEffect(() => {
        getLinhVuc();
        Load_FilterTotab1();
        const unsubscribe = navigation.addListener('didFocus', e => { // dùng didFocus cho v3
            Load_FilterTotab1();
        });
        return () => unsubscribe.remove();
    }, [])

    const getLinhVuc = async (thang = '', linhvuc = '') => {
        // nthisIsLoading.show();
        let res2 = await Get_List_LinhVuc();
        if (res2 && res2.status === 1 && 1) {
            res2.data.unshift({
                IdLinhVuc: 0,
                LinhVuc: "Tất cả"
            })
            Utils.setGlobal(nGlobalKeys.DataLinhVuc, res2.data)
        }
        else {
            console.log('Lỗi api')
        }

    }

    const getAllapi = async (thang = '', linhvuc = '') => {
        // nthisIsLoading.show();
        // let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
        let res = await Get_BieuDoPATongQuan(thang, linhvuc);
        setDtThongKe({
            dataThongKe: res && res.status === 1 ? res.data : [],
            isLoadingThongKe: false
        })
        let res2 = await Get_BieuDo_Top5KhuVucPA(thang, linhvuc);
        setDtPhanAnh({
            dataPhanAnh: res2 && res2.status === 1 ? res2.data : [],
            isLoadingPhanAnh: false
        })
        let res3 = await Get_BieuDo_DienBienXuLyPATrong6Thang(thang, linhvuc);
        setPhanAnh6T({
            dataPhanAnh6T: res3 && res3.status === 1 ? SortMonth(res3.data) : [],
            isLoadingPhanAnh6T: false
        })
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
    const _callback = (selectBuocXuLy) => { // lấy ra lĩnh vực
        let value = selectBuocXuLy['IdLinhVuc']
        let value2 = selectBuocXuLy['LinhVuc']
        let month = ConverDate(Utils.getGlobal(nGlobalKeys.Month));
        Utils.setGlobal(nGlobalKeys.TenLinhVuc, value2);
        Utils.setGlobal(nGlobalKeys.LinhVuc, value);
        setFilter({
            ...filter,
            linhvuc: value2
        })
        getAllapi(month, value)
    }

    const showFilter = () => {
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc)
        let datalinhvuc = Utils.getGlobal(nGlobalKeys.DataLinhVuc)
        Utils.goscreen(this, 'Modal_List_LinhVuc', {
            callback: _callback, item: linhvuc,
            AllLinhVuc: Utils.getGlobal(nGlobalKeys.DataLinhVuc), KeyValue: 'LinhVuc', KeyId: 'IdLinhVuc'
        })

    }
    const SortMonth = (data) => {
        if (data?.length >= 0) {
            return data.sort((a, b) =>
                a.Thang?.split("/")[1].substr(1, 1) - b.Thang.split("/")[1].substr(1, 1)
            )
        }
        else
            return data;
    }
    const ConverDate = (date) => {
        let month = date?.getMonth() < 9 ? '0' + (date?.getMonth() + 1) : (date?.getMonth() + 1);
        let datenew = month + '/' + date.getFullYear();
        return datenew;
    }
    const Load_FilterTotab1 = () => {
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
    Utils.nlog('gia tri state', dtPhanAnh)
    return (
        <View style={styles.container}>
            <HeaderCom
                nthis={{ navigation }} titleText={'Thống kê tổng quan'}
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
                    <ChartBieuDo keyLabelPieShow={'SLTrongHanDaXLTQ'} dataColorPie={[colors.blueColumn, colors.orange]}
                        colorsBackGround={colors.blackBackGroundChart}
                        keyLabelPie={['SLTrongHanDaXLTQ', 'SLQuaHanDaXLTQ']}
                        data={dtThongKe.dataThongKe} type={'BieuDoTron'} arayBackGroud={[colors.grayLight, colors.yellowLight]}
                        onPress={(item) => GoScreen(item, 'PATongQuan')} isLoading={dtThongKe.isLoadingThongKe}
                    />
                    <View style={styles.viewChart} >
                        <Text style={styles.txtTitleChart}>{'5 khu vực tập trung nhiều phản ánh'}</Text>
                        <ChartBieuDo data={dtPhanAnh.dataPhanAnh} type={'BieuDoNgang'} keylabel1='TenPhuongXa' keylabel2='SoLuongPA'
                            colorsLine1={colors.orangeHorizontal} colorsBackGround={colors.black}
                            onPress={(item) => GoScreen(item, 'Top5KhuVucPA')} isLoading={dtPhanAnh.isLoadingPA}
                        />
                    </View>
                    <View style={styles.viewChart}>
                        <Text style={styles.txtTitleChart}>{'Diễn biến xử lý phản ánh'}</Text>
                        <ChartBieuDo data={dtPhanAnh6T.dataPhanAnh6T} type={'BieuDoDienBienPA2'} keylabel1='SoLuong' keylabel2='SLTrongHanDaXL' keylabel3='SLQuaHanDaXL'
                            colorsLine1={colors.greenLine} colorsLine2={colors.redStar} onPress={(item) => GoScreen(item, 'DienBienXuLyPATrong6Thang')}
                            heightConTainer={300}
                            isLoading={dtPhanAnh6T.isLoadingPA6T}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default TongQuan

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.grayBackGroundChart,
    },
    viewChart: {
        paddingVertical: 5
    },
    txtTitleChart: {
        marginBottom: 5,
        fontSize: reText(20),
        fontWeight: 'bold'
    }
})
