import React, { useEffect } from 'react';
import { Color, Font, Stack } from '../Kit';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import PanelGeneral from '../DichVuCong/PanelGeneral';
import {
    getTongSoLieu, getBieuDoHoSoTon, getBieuHoSoQuaHan, getBieuHoSoChuaGiaiQuyet, getTongHoSoTiepNhanMucDo34, getBieuDoHoSo34TrucTuyen,
    getBieuHoSoDaGiaiQuyet, getBieuHoSoDaTra, getDonVi, compareOption, getBieuTuongQuanDaGQChuaGQ, getTongHoSoTiepNhan
} from '../../Containers/DichVuCong';
import { useSelector } from 'react-redux';
import { IReducerType } from '../../Interface/Reducer';
import { OptionState, LastOption } from '../../Interface/Option';
import type { IState } from '../../Interface/DichVuCong';
import Chart, { TYPE } from '../Chart';
import Type from '../../Redux/Type';
import HeaderBar from '../DichVuCong/Header';
import { NavigationEvents } from 'react-navigation';
import { store } from '../../../../srcRedux/store';

const Home = ({ navigation }) => {

    // React.useEffect(() => {
    //     return navigation.addListener('focus', () => {
    //         onScreenFocus();
    //     });
    // }, [navigation]);

    useEffect(() => {
        onScreenFocus()
    })

    const hoSoTon: IState = useSelector((state: IReducerType) => state.HoSoTon);
    const hoSoQuaHan: IState = useSelector((state: IReducerType) => state.HoSoQuaHan);
    const hoSoChuaGiaiQuyet: IState = useSelector((state: IReducerType) => state.ChuaGiaiQuyet);
    const hoSoDaGiaiQuyet: IState = useSelector((state: IReducerType) => state.DaGiaiQuyet);
    const daTra: IState = useSelector((state: IReducerType) => state.DaTra);
    const tuongQuanDaGQChuaGQ: IState = useSelector((state: IReducerType) => state.TuongQuanDaGQChuaGQ);
    const tongHoSoTiepNhan: IState = useSelector((state: IReducerType) => state.TongHoSoTiepNhan);
    const tiepNhanTheoMucDo: IState = useSelector((state: IReducerType) => state.TiepNhanTheoMucDo);
    const mucDo34TrucTuyen: IState = useSelector((state: IReducerType) => state.MucDo34TrucTuyen);

    const option = useSelector((state: IReducerType) => state.Option.TypeOption); // 0 -> 4

    const Scroll = React.useRef();

    const onScreenFocus = () => {
        let option: OptionState = store.getState().Option,
            currentOption: LastOption = {
                Thang: option.Thang.Chon,
                Nam: option.Nam.Chon,
                DonVi: option.DonVi.Chon,
                Option: option.TypeOption,
            };
        if (!compareOption()) {
            if (currentOption.Option !== option.LastOption.Option) {
                store.dispatch({ type: Type.OPTION.RESET });
                onRefresh();
                getDonVi();
            }
            else
                onRefresh();
        }
        store.dispatch({ type: Type.OPTION.LAST_OPTION, value: currentOption });
    };

    const onRefresh = () => {
        getTongSoLieu();
        getBieuDoHoSoTon();
        getBieuHoSoQuaHan();
        getBieuHoSoChuaGiaiQuyet();
        getBieuHoSoDaGiaiQuyet();
        getBieuHoSoDaTra();
        getBieuTuongQuanDaGQChuaGQ();
        getTongHoSoTiepNhan();
        getTongHoSoTiepNhanMucDo34();
        getBieuDoHoSo34TrucTuyen();
        // Scroll.current.scrollTo({y:0})
    };

    const _renderHoSoTon = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.LEFT_ROW}
                        title={'Th???ng k?? h??? s?? t???n'}
                        color={[Color.secondary]}
                        data={hoSoTon.data}
                        isEmpty={hoSoTon.isEmpty}
                        isError={hoSoTon.isError}
                        isLoading={hoSoTon.isLoading}
                        onLoadData={getBieuDoHoSoTon}
                        fullData={hoSoTon.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderTongHoSoTiepNhan = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.LEFT_ROW}
                        title={'Th???ng k?? h??? s?? ti???p nh???n'}
                        color={[Color.primary]}
                        data={tongHoSoTiepNhan.data}
                        isEmpty={tongHoSoTiepNhan.isEmpty}
                        isError={tongHoSoTiepNhan.isError}
                        isLoading={tongHoSoTiepNhan.isLoading}
                        onLoadData={getBieuDoHoSoTon}
                        fullData={tongHoSoTiepNhan.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderHoSoQuaHan = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.FULL_ROW}
                        title={'Th???ng k?? h??? s?? qu?? h???n'}
                        color={[Color.primary, Color.red]}
                        data={hoSoQuaHan.data}
                        isEmpty={hoSoQuaHan.isEmpty}
                        isError={hoSoQuaHan.isError}
                        isLoading={hoSoQuaHan.isLoading}
                        onLoadData={getBieuHoSoQuaHan}
                        minHeight={320}
                        leftTitle={'???? gi???i quy???t'}
                        rightTitle={'Ch??a gi???i quy???t'}
                        fullData={hoSoQuaHan.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderHoSoChuaGiaiQuyetTong = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.DOUBLE_CONTENT_ROW}
                        title={'T??nh h??nh h??? s?? ch??a gi???i quy???t'}
                        color={[Color.yellow10, Color.red]}
                        data={hoSoChuaGiaiQuyet.data[0]}
                        isEmpty={hoSoChuaGiaiQuyet.isEmpty}
                        isError={hoSoChuaGiaiQuyet.isError}
                        isLoading={hoSoChuaGiaiQuyet.isLoading}
                        onLoadData={getBieuHoSoChuaGiaiQuyet}
                        minHeight={320}
                        leftTitle={'T???ng'}
                        rightTitle={'Qu?? h???n'}
                        fullData={hoSoChuaGiaiQuyet.dataDetail[0]}
                    />
                </Stack>
            </View>
        );
    };

    const _renderHoSoChuaGiaiQuyet = () => {
        let titleChart = 'Th???ng k?? h??? s?? ch??a gi???i quy???t';
        let leftTitle = 'Trong h???n';
        let rightTitle = 'Qu?? h???n';
        let color = [Color.orange, Color.red];
        if (option) {
            color = [Color.cyan, Color.red];
        }
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.DOUBLE_CONTENT_ROW}
                        title={titleChart}
                        color={color}
                        data={option ? (hoSoChuaGiaiQuyet.data[1]) : (hoSoChuaGiaiQuyet.data)}
                        isEmpty={hoSoChuaGiaiQuyet.isEmpty}
                        isError={hoSoChuaGiaiQuyet.isError}
                        isLoading={hoSoChuaGiaiQuyet.isLoading}
                        onLoadData={getBieuHoSoChuaGiaiQuyet}
                        minHeight={320}
                        leftTitle={leftTitle}
                        rightTitle={rightTitle}
                        fullData={option ? hoSoChuaGiaiQuyet.dataDetail[1] : hoSoChuaGiaiQuyet.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderHoSoDaGiaiQuyet = () => {
        let titleChart = 'Th???ng k?? h??? s?? ???? gi???i quy???t';
        let leftTitle = 'Tr?????c h???n';
        let middleTitle = 'Trong h???n';
        let rightTitle = 'Qu?? h???n';
        let color = [Color.green, Color.yellow10, Color.cyan]
        if (option) {
            titleChart = 'T??nh h??nh h??? s?? ???? gi???i quy???t';
        }
        if (option === 4) {
            titleChart = 'T??nh h??nh h??? s?? m???c ????? 3,4 ???? gi???i quy???t ';
            leftTitle = 'Ti???p nh???n';
            middleTitle = '';
            rightTitle = '???? gi???i quy???t';
            color = [Color.cyan, Color.primary]
        }
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.DOUBLE_CONTENT_ROW}
                        title={titleChart}
                        color={color}
                        data={hoSoDaGiaiQuyet.data}
                        isEmpty={hoSoDaGiaiQuyet.isEmpty}
                        isError={hoSoDaGiaiQuyet.isError}
                        isLoading={hoSoDaGiaiQuyet.isLoading}
                        onLoadData={getBieuHoSoDaGiaiQuyet}
                        leftTitle={leftTitle}
                        rightTitle={rightTitle}
                        middleTitle={middleTitle}
                        fullData={hoSoDaGiaiQuyet.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderTraHoSo = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.FULL_ROW}
                        title={'Th???ng k?? t??nh h??nh tr??? h??? s??'}
                        color={[Color.primary, Color.yellow10]}
                        data={daTra.data}
                        isEmpty={daTra.isEmpty}
                        isError={daTra.isError}
                        isLoading={daTra.isLoading}
                        onLoadData={getBieuHoSoDaTra}
                        minHeight={320}
                        leftTitle={'???? tr??? h??? s??'}
                        rightTitle={'Ch??a tr??? h??? s??'}
                        fullData={daTra.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderTuongQuanDaGQChuaGQ = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.FULL_ROW}
                        title={'T????ng quan ???? GQ / ch??a GQ'}
                        color={[Color.purple, Color.orange]}
                        data={tuongQuanDaGQChuaGQ.data}
                        isEmpty={tuongQuanDaGQChuaGQ.isEmpty}
                        isError={tuongQuanDaGQChuaGQ.isError}
                        isLoading={tuongQuanDaGQChuaGQ.isLoading}
                        onLoadData={getBieuTuongQuanDaGQChuaGQ}
                        minHeight={320}
                        leftTitle={'???? gi???i quy???t'}
                        rightTitle={'Ch??a gi???i quy???t'}
                        fullData={tuongQuanDaGQChuaGQ.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderTiepNhanTheoMucDo34 = () => {
        let titleChart = 'Th???ng k?? h??? s?? ti???p nh???n theo m???c ?????';
        let leftTitle = 'Ti???p nh???n m???c ????? 3';
        let rightTitle = 'Ti???p nh???n m???c ????? 4';
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.DOUBLE_CONTENT_ROW}
                        title={titleChart}
                        color={[Color.yellow10, Color.orange]}
                        data={tiepNhanTheoMucDo.data}
                        isEmpty={tiepNhanTheoMucDo.isEmpty}
                        isError={tiepNhanTheoMucDo.isError}
                        isLoading={tiepNhanTheoMucDo.isLoading}
                        onLoadData={getTongHoSoTiepNhanMucDo34}
                        minHeight={320}
                        leftTitle={leftTitle}
                        rightTitle={rightTitle}
                        fullData={tiepNhanTheoMucDo.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _renderMucDo34TrucTuyen = () => {
        return (
            <View>
                <View style={styles.divider} />
                <Stack padding={16}>
                    <Chart
                        chartType={TYPE.LEFT_ROW}
                        title={'Th???ng k?? h??? s?? m???c ????? 3,4 tr???c tuy???n'}
                        color={[Color.green]}
                        data={mucDo34TrucTuyen.data}
                        isEmpty={mucDo34TrucTuyen.isEmpty}
                        isError={mucDo34TrucTuyen.isError}
                        isLoading={mucDo34TrucTuyen.isLoading}
                        onLoadData={getBieuDoHoSo34TrucTuyen}
                        fullData={mucDo34TrucTuyen.dataDetail}
                    />
                </Stack>
            </View>
        );
    };

    const _render = () => {
        if (option === 0) {
            return (
                <View>
                    {_renderHoSoTon()}
                    {_renderHoSoQuaHan()}
                    {_renderHoSoChuaGiaiQuyet()}
                    {_renderHoSoDaGiaiQuyet()}
                    {_renderTraHoSo()}
                </View>
            );
        }
        else if (option === 1 || option === 2) {
            return (
                <View>
                    {_renderHoSoDaGiaiQuyet()}
                    {_renderHoSoChuaGiaiQuyetTong()}
                    {_renderHoSoTon()}
                    {_renderTraHoSo()}
                    {_renderTuongQuanDaGQChuaGQ()}
                    {_renderHoSoQuaHan()}
                    {_renderHoSoChuaGiaiQuyet()}
                    {_renderTongHoSoTiepNhan()}
                </View>
            );
        }
        else if (option === 3) {
            return (
                <View>
                    {_renderTraHoSo()}
                    {_renderTuongQuanDaGQChuaGQ()}
                    {_renderHoSoQuaHan()}
                    {_renderHoSoChuaGiaiQuyet()}
                    {_renderHoSoTon()}
                </View>
            );
        }
        else {
            return (
                <View>
                    {_renderTiepNhanTheoMucDo34()}
                    {_renderMucDo34TrucTuyen()}
                    {_renderHoSoDaGiaiQuyet()}
                </View>
            );
        }
    };

    const _onNavigationEvent = (e) => {
        onScreenFocus();
    }

    return (
        <Stack flexFluid backgroundColor={Color.white}>
            <HeaderBar {...navigation} />
            <ScrollView
                ref={Scroll}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={false}
                        colors={[Color.primary]}
                        tintColor={Color.primary}
                    />
                }
            >
                <Stack padding={16}>
                    <PanelGeneral />
                </Stack>
                {_render()}
            </ScrollView>
            <NavigationEvents
                onWillFocus={_onNavigationEvent}
            />
        </Stack>
    );
};

export default Home;


const styles = StyleSheet.create({
    totalNumber: {
        marginTop: 10,
        fontSize: Font.xxxLarge,
        fontWeight: Font.bold,
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
        backgroundColor: Color.gray50
    }
})
