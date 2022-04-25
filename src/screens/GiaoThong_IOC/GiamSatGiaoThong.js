import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import React, { Component, createRef, PureComponent, useCallback, useEffect, useRef, useState } from 'react';
import { colors } from '../../../styles';
import FontSize from '../../../styles/FontSize';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ButtonCom, HeaderCus, IsLoading, ListEmpty } from '../../../components';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { Images } from '../../images';
import { nstyles } from '../../../styles/styles';
import { TYPES } from '../user/dangky/Component';
import ThongTinChungRender from '../user/dangky/ThongTinChungRender';
import moment from 'moment';
import { GetToken_GSGT, GetListViPhamTheoThoiGianXuLy, GetListViPhamTheoThoiGianViPham, getThongTinLoiViPham } from '../../apis/apiGSGT';
import ImageCus from '../../../components/ImageCus';
import { stat } from 'react-native-fs';


const _DateFrom = [
    {
        id: 1,
        // moment(dateFrom).format('YYYY/MM/DD')
        name: 'Từ ngày : ',
        type: TYPES.DatePicker,
        check: true,
        key: "ngayBatDau",
        placehoder: "Từ ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        note: '*',
        value: '01/01/2021',
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16),
        },
        styleLabel: {
            fontSize: FontSize.reText(16), fontWeight: 'bold'
        }
    }
]
const _DateTo = [
    {
        id: 2,
        name: "Đến ngày : ",
        type: TYPES.DatePicker,
        check: true,
        key: "ngayKetThuc",
        placehoder: "Đến ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        note: '*',
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16),
        },
        styleLabel: {
            fontSize: FontSize.reText(16), fontWeight: 'bold'
        }
    }
]

const dataTab = [
    {
        id: 1,
        name: 'Theo thời gian xử lý',
    },
    {
        id: 2,
        name: 'Theo thời gian vi phạm',
    }
]

const GiamSatGiaoThong = () => {
    const refDateFrom = useRef(null);
    const refDateTo = useRef(null);
    const dateStart = () => {
        let dateNow = new Date();
        let Year = dateNow.getMonth() === 11 ? dateNow.getFullYear() + 1 : dateNow.getFullYear();
        let Month = dateNow.getMonth() === 11 ? 1 : dateNow.getMonth() === 12 ? 2 : dateNow.getMonth() + 2;
        let dateTempt = ''
        if (Month < 10) {
            dateTempt = dateNow.getDate() + '/' + '0' + Month + '/' + Year;
        }
        else {
            dateTempt = dateNow.getDate() + '/' + Month + '/' + Year;
        }
        Utils.nlog('gia tri ', dateTempt)
        return {
            dateStart: moment(dateNow).format('DD/MM/YYYY'),
            dateEnd: dateTempt,
        }
    }
    const [DateViPham, setDateViPham] = useState(dateStart());
    const [state, setState] = useState({
        TabIndex: 1,
        token: '',
        ThongTinLoiViPham: {},
        Page: 0,
        AllPage: 0,
        dataViPham: [],
        plate: '',
    });

    const fn_DateCompare = (DateA, DateB) => {
        var a = new Date(DateA);
        var b = new Date(DateB);

        var msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
        var msDateB = Date.UTC(b.getFullYear(), b.getMonth() + 1, b.getDate());
        Utils.nlog('msDateA     :     ', msDateA)

        if (parseFloat(msDateA) > parseFloat(msDateB)) {
            return -1;  // greater than
        }
        else
            return 1;  // error
    }

    const onPressSubmid = async (page) => {
        let objectDayFrom = refDateFrom?.current.getData();
        let objectDateTo = refDateTo?.current.getData();
        let newdateFrom = objectDayFrom.ngayBatDau.split("/").reverse().join("/");
        let newdateTo = objectDateTo.ngayKetThuc.split("/").reverse().join("/");
        let kq = fn_DateCompare(newdateFrom, newdateTo);
        let PLATE = state.plate || state.plate.length != 0 ? state.plate : ''
        if (kq == -1) {
            Utils.showToastMsg('Thông báo', "Bạn nhập sai định dạng ngày từ và ngày đến ", icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        }

        setDateViPham(
            {
                dateStart: objectDayFrom.ngayBatDau,
                dateEnd: objectDateTo.ngayKetThuc,
            }
        )
        await On_Load(newdateFrom, newdateTo, page, PLATE);
    }

    useEffect(() => {
        Get_ApiDidmount();
    }, []);

    const Get_ApiDidmount = async () => {
        Utils.setToggleLoading(true);
        let token = await GetToken_GSGT();
        if (token) {
            let ThongTinVP = await getThongTinLoiViPham(token.id_token)
            setState({
                ...state,
                token: token.id_token,
                ThongTinLoiViPham: ThongTinVP ? ThongTinVP : {}
            })
            Utils.setToggleLoading(false);
        }
    }

    const On_Load = async (dataStart, dateEnd, page, plate) => {
        const { token, TabIndex } = state
        Utils.setToggleLoading(true);
        let res = TabIndex === 1 ? await GetListViPhamTheoThoiGianXuLy(token, dataStart, dateEnd, page, plate) :
            await GetListViPhamTheoThoiGianViPham(token, dataStart, dateEnd, page, plate)
        setState({
            ...state,
            AllPage: res ? res.totalPage : 0,
            Page: page != 0 ? page : 0,
            dataViPham: res ? page === 0 ? res.res : state.dataViPham?.concat(res.res) : [],
        })
        Utils.setToggleLoading(false);
    }

    const _renderItem = useCallback(({ item, index }) => {
        // let { ThongTinLoiViPham } = this.state
        let widthImage = (480 / 320) * FontSize.scale(100)
        const { ThongTinLoiViPham } = state
        return (
            <TouchableOpacity
                onPress={() => {
                    Utils.navigate('Modal_ChiTietGSGT', { Id: item.id })
                }}
                key={index}
                style={stGSGiaoThong._item}
            >

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <ImageCus
                            style={{ height: '100%', width: widthImage }}
                            resizeMode={'contain'}
                            source={{ uri: item?.imageLink4 }}
                            defaultSourceCus={Images.imgHeader2}
                        />
                    </View>
                    <View style={{ flex: 1, padding: 5 }}>
                        <Text style={[stGSGiaoThong.commonText, { fontWeight: 'bold' }]}><Text style={{ color: colors.blueFaceBook }}>{`Biển số xe`}</Text>: {item?.plate}</Text>
                        <Text numberOfLines={4} style={stGSGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Vi phạm`}</Text>: {item?.vinId == ThongTinLoiViPham?.id ? ThongTinLoiViPham?.vinName : ''}</Text>
                        <Text numberOfLines={1} style={stGSGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Ngày`}</Text>: {item?.vioTime}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }, [state.dataViPham]);

    const loadMore = async () => {
        const { Page, AllPage } = state
        if (Page < AllPage) {
            onPressSubmid(Page + 1)
        }
    }

    const onChangeTab = (item) => {
        setState({
            ...state,
            TabIndex: item,
            Page: 0,
            AllPage: 0,
            dataViPham: [],
        })
    }

    const onRefresh = () => {
        setState({
            ...state,
            refreshing: true,
            Page: 0,
            AllPage: 0,
            dataViPham: [],
        })
        onPressSubmid(0);
    }
    Utils.nlog('gia tri state', state)

    return (
        <View style={nstyles.ncontainer}>
            <HeaderCus
                Sleft={{ tintColor: "white" }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={`Vi phạm giao thông`}
                styleTitle={{ color: colors.white }}
            />
            <View style={{ ...stGSGiaoThong.containerBody }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginHorizontal: 10 }}>
                    {
                        dataTab.map((item) => {
                            const { TabIndex } = state
                            return <TouchableOpacity
                                onPress={() => {
                                    onChangeTab(item.id)
                                }}
                                style={{
                                    paddingVertical: 10, paddingHorizontal: 5,
                                    backgroundColor: item.id == TabIndex ? colors.grayLight : colors.white,
                                    borderRadius: 5, marginRight: 10
                                }}>
                                <Text style={{
                                    fontSize: FontSize.reText(16),
                                    fontWeight: item.id == TabIndex ? 'bold' : 'normal'
                                }}>{item.name}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <ThongTinChungRender ref={refDateFrom} listCom={_DateFrom} objectData={{ ngayBatDau: DateViPham.dateStart }} isEdit={true} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <ThongTinChungRender ref={refDateTo} listCom={_DateTo} objectData={{ ngayKetThuc: DateViPham.dateEnd }} isEdit={true} />
                    </View>
                </View>
                <View>
                    <TextInput
                        style={{ padding: 10, backgroundColor: 'white', marginTop: 10, marginHorizontal: 10, borderRadius: 5 }}
                        placeholder='Nhập biển số xe'
                        onChangeText={text => setState({ ...state, plate: text })}
                    />
                </View>
                <View style={{ padding: FontSize.scale(10), flexDirection: "row", height: FontSize.scale(55) }}  >
                    <ButtonCom
                        onPress={() => onRefresh()}
                        sizeIcon={30}
                        txtStyle={{ color: colors.white, alignItems: 'center' }}
                        style={{ ...stGSGiaoThong.buttonSubmit, alignItems: 'center', justifyContent: 'center', fontSize: FontSize.reText(19) }}
                        text={"Tìm Kiếm"}
                    />
                </View>
                <View style={{ flex: 1, paddingTop: 10 }}>
                    <FlatList
                        renderItem={_renderItem}
                        data={state.dataViPham}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={<ListEmpty textempty={'....'} />}
                    // scrollEventThrottle={10}
                    // removeClippedSubviews={true} // Unmount components when outside of window 
                    // initialNumToRender={5} // Reduce initial render amount
                    // maxToRenderPerBatch={5} // Reduce number in each render batch
                    // updateCellsBatchingPeriod={100} // Increase time between renders
                    // windowSize={7} // Reduce the window size
                    />

                </View>
            </View>
        </View>
    );
};

export default GiamSatGiaoThong;

const styles = StyleSheet.create({});




const stGSGiaoThong = StyleSheet.create({
    containerBody: {
        paddingHorizontal: FontSize.scale(10),
        backgroundColor: colors.colorPaleGrey,
        flex: 1,
        paddingBottom: getBottomSpace(),
    },
    commonTitle: {
        fontWeight: "bold",
        fontSize: FontSize.reText(16),
        color: colors.blueFaceBook,
        textAlign: "center",
        paddingVertical: FontSize.scale(10),
    },
    commonText: {
        fontSize: 14,
        color: colors.black,
        textAlign: "left",
        marginBottom: 4,
        width: '100%'
    },
    buttonSubmit: {
        borderRadius: FontSize.scale(5),
        alignSelf: "center",
        flex: 1,
        padding: FontSize.scale(15),
        width: "100%",
    },
    _item: {
        backgroundColor: colors.white,
        paddingVertical: 5,
        marginBottom: 20,
        height: FontSize.scale(100),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 6,
    }
});
// export default GiamSatGiaoThong;
