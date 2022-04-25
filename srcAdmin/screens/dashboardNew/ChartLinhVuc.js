import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCom, HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import ChartBieuDo from './Component/ChartBieuDo'
import FilterLinhVuc from './Component/FilterLinhVuc'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { Get_BieuDo_Top5LinhVucBiPANhieuNhat, Get_BieuDo_Top5LinhVucTonNhieuPA, Get_BieuDo_Top5LinhVucXuLyNhieuPA } from '../../apis/apiDashboardPA'
import { Images } from '../../images'
import { store } from '../../../srcRedux/store'
import { SetShowModalNoti } from '../../../srcRedux/actions'

const LinhVuc = ({ navigation }) => {

    const [state, setState] = useState({
        dataLinhVucPAMax: [],
        isLoaidingLinhVucPAMax: true,
        dataLinhVucPAMax2: [],
        isLoaidingLinhVucPAMax2: true,
        dataLinhVucPAMax3: [],
        isLoaidingLinhVucPAMax3: true,
        dataLinhVuc: [],
    })
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


    const getLinhVucMax = async (thang = '', linhvuc = '') => {
        // nthisIsLoading.show();
        // let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
        let res = await Get_BieuDo_Top5LinhVucBiPANhieuNhat(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataLinhVucPAMax: res && res.status === 1 ? res.data : [],
            isLoaidingLinhVucPAMax: false,
        }));
        let res2 = await Get_BieuDo_Top5LinhVucTonNhieuPA(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataLinhVucPAMax2: res2 && res.status === 1 ? res2.data : [],
            isLoaidingLinhVucPAMax2: false,
        }));
        let res3 = await Get_BieuDo_Top5LinhVucXuLyNhieuPA(thang, linhvuc);
        setState(prevState => ({
            ...prevState,
            dataLinhVucPAMax3: res3 && res3.status === 1 ? res3.data : [],
            isLoaidingLinhVucPAMax3: false,
            dataLinhVuc: Utils.getGlobal(nGlobalKeys.DataLinhVuc)
        }));
        // nthisIsLoading.hide();
        // setState({
        //     ...state,
        //     dataLinhVucPAMax: res && res.status === 1 ? res.data : [],
        //     dataLinhVucPAMax2: res2 && res2.status === 1 ? res2.data : [],
        //     dataLinhVucPAMax3: res3 && res3.status === 1 ? res3.data : [],
        //     dataLinhVuc: Utils.getGlobal(nGlobalKeys.DataLinhVuc)
        // });
    }

    const callbackTuThang = (date) => { // lấy date
        Utils.setGlobal(nGlobalKeys.Month, date);
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? 0 : Utils.getGlobal(nGlobalKeys.LinhVuc);
        let datenew = ConverDate(date);
        setFilter({
            ...filter,
            date: datenew
        })
        getLinhVucMax(datenew, linhvuc);
    }

    const onPress = () => {
        let value = Utils.getGlobal(nGlobalKeys.Month)
        Utils.goscreen(this, 'Modal_MonthYear',
            {
                callback: callbackTuThang,
                DateInput: value,
            })
    }

    const _callback = (selectBuocXuLy) => {
        let value = selectBuocXuLy['IdLinhVuc']
        let value2 = selectBuocXuLy['LinhVuc']
        let month = ConverDate(Utils.getGlobal(nGlobalKeys.Month));
        Utils.setGlobal(nGlobalKeys.LinhVuc, value);
        Utils.setGlobal(nGlobalKeys.TenLinhVuc, value2);
        setFilter({
            ...filter,
            linhvuc: value2
        })
        getLinhVucMax(month, value)
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
            getLinhVucMax(date, linhvuc)
            return;
        }
        setFilter({
            ...filter,
            date: ConverDate(month),
            linhvuc: tenlinhvuc,
        })
        getLinhVucMax(ConverDate(month), linhvuc)
    }
    const GoScreen = (item, key) => {
        let dateNow = Utils.getGlobal(nGlobalKeys.Month, '');
        let linhvuc = Utils.getGlobal(nGlobalKeys.LinhVuc) === undefined ? 0 : Utils.getGlobal(nGlobalKeys.LinhVuc);
        const data = { ...item, keyApi: key, date: dateNow, linhvuc: linhvuc }
        Utils.goscreen({ navigation }, 'Modal_DetailsChart', { item: data })
    }
    Utils.nlog('gia tri state linh vuc', state)
    return (
        <View style={styles.container}>
            <HeaderCom
                nthis={{ navigation }} titleText={'Tình hình xử lý theo lĩnh vực'}
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
                    <View style={styles.viewChart} >
                        <Text style={styles.txtTitleChart}>{'Lĩnh vực bị phản ánh nhiều nhất'}</Text>
                        <ChartBieuDo data={state.dataLinhVucPAMax} type={'BieuDoLinhVuc'}
                            keylabel1='SoLuong' keylabel2='SLTChuaXuLy'
                            keylabel3='SLDaXuLy' heightConTainer={270}
                            colorsLine1={colors.redStar} colorsLine2={colors.greenLine} colorsLine3={colors.blueColumn}
                            colorsBackGround={colors.blackBackGroundChart} onPress={(item) => GoScreen(item, 'Top5LinhVucBiPANhieuNhat')}
                            isLoading={state.isLoaidingLinhVucPAMax}
                        />
                    </View>
                    <View style={styles.viewChart} >
                        <Text style={styles.txtTitleChart}>{'Lĩnh vực tồn nhiều  phản ánh nhất'}</Text>
                        <ChartBieuDo data={state.dataLinhVucPAMax2} type={'BieuDoNgang'} keylabel1='TenLinhVuc' colorsBackGround={colors.black}
                            keylabel2='SoLuongPA' colorsLine1={colors.redStar}
                            onPress={(item) => GoScreen(item, 'Top5LinhVucTonNhieuPA')} isLoading={state.isLoaidingLinhVucPAMax2}
                        />

                    </View>
                    <View style={styles.viewChart} >
                        <Text style={styles.txtTitleChart}>{'Lĩnh vực đã xử lý nhiều nhất'}</Text>
                        <ChartBieuDo data={state.dataLinhVucPAMax3} type={'BieuDoNgang'} keylabel1='TenLinhVuc' colorsBackGround={colors.black}
                            keylabel2='SoLuongPA' colorsLine1={colors.greenHorizontal}
                            onPress={(item) => GoScreen(item, 'Top5LinhVucXuLyNhieuPA')} isLoading={state.isLoaidingLinhVucPAMax3}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default LinhVuc

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayBackGroundChart
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
