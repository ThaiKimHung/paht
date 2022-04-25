import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, Platform, StyleSheet, Text, View, BackHandler, TouchableOpacity, ScrollView, Image, FlatList, ColorPropType } from 'react-native'
import { colors } from '../../../../styles';
import { Width, Height, nwidth, nstyles } from '../../../../styles/styles';
import Utils from '../../../../app/Utils'
import { TabView, SceneMap } from 'react-native-tab-view';
import { data } from 'jquery';
import { color } from 'react-native-reanimated';
import { Images } from '../../../images';
import { GetDs_HocSinh } from '../apiHocTap/apiHocTap'
import moment from 'moment';
import { flowRight } from 'lodash';
import { reText } from '../../../../styles/size';
import { IsLoading, HeaderCus } from '../../../../components';
import LinearGradient from 'react-native-linear-gradient'
import { store } from '../../../../srcRedux/store';


const dataTab = [
    {
        key: 0,
        name: 'Thông tin giáo viên',
    },
    {
        key: 1,
        name: 'Thông tin học sinh',
    }
]

const ModaGiaoVien = (props) => {
    const data = Utils.ngetParam({ props: props }, 'Data', [])
    const keyObject = 'GroupKhoi'
    Utils.nlog('gia tri data GV', data)
    const [state, setState] = useState({
        indexTab: 0,
    })

    const [stateHocSinh, setStateDsHocSinh] = useState({
        ListHocSinh: [],
        isLoading: true,
        page: 1,
    })
    const opacity = useRef(new Animated.Value(0)).current
    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 300);
    };

    useEffect(() => {
        startAnimation(0.4);
        Utils.nlog('gia tri data', data)
        _onRefesh();
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const handleBackButton = () => {
        Utils.goback();
        return true
    }


    const _onRefesh = () => {
        setStateDsHocSinh({
            isLoading: true,
            page: 1,
        })
        Get_Api();
    }

    const Get_Api = async (page = 1, record = 10) => {
        Utils.setToggleLoading(true)
        const body = {
            "namHoc": '2021', // lấy năm hiện tại
            "maCapHoc": data?.CapHoc.maCapHoc,
            "maLopHoc": data?.[keyObject].maLopHoc,
            "trangThai": 1,
            "maTruongHoc": data?.maTruongHoc,
            "maTinhThanh": "64",
            "maQuanHuyen": "622",
            "khoiHoc": data?.[keyObject].khoiHoc,
            "limit": record,
            "offset": page
        }
        Utils.nlog('gia tri body', body)
        let res = await GetDs_HocSinh(body);
        Utils.nlog('gia tri data', res.data)
        const { ListHocSinh } = stateHocSinh
        setStateDsHocSinh({
            ListHocSinh: res ? page === 1 ? res.data?.listDanhSachHocSinh :
                ListHocSinh.concat(res.data?.listDanhSachHocSinh) : [],
            page: page,
            isLoading: false,
        })
        Utils.setToggleLoading(false)
    }

    const onLoadMore = () => {
        const { page } = stateHocSinh
        Get_Api(page + 1)
    }
    const backAction = () => {
        Utils.nlog('vao back')
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props: props });
            });
        }, 50);

    }

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 0:
                return renderGiaoVien();
            case 1:
                return renderHocSinh();
            default:
                break;
        }
    }

    const renderItemHS = ({ item, index }) => {
        const { ListHocSinh } = stateHocSinh
        return (
            <View style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: colors.whiteTwo,
                borderRadius: 10,
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 15,
                alignItems: 'center',
                marginBottom: index === ListHocSinh?.length - 1 ? 0 : 12,
            }}
            // onPress={() => Utils.navigate('Modal_ChitietHocTap', { itemHs: item })}
            >
                <Image source={Images.icStudent} resizeMode={'contain'} style={nstyles.nAva40} />
                <View style={{ flex: 1, marginLeft: 10 }} >
                    <Text style={{ marginBottom: 5 }} >Họ tên: {item?.ten}</Text>
                    <Text style={{ marginBottom: 5 }} >Giới tính: {item?.gioiTinh === 1 ? 'Nam' : 'Nữ'}</Text>
                    <Text style={{ marginBottom: 5 }} >Ngày Sinh: {moment(item.ngaySinh).format('DD/MM/YYYY')}</Text>
                </View>
            </View>
        )
    }

    const renderHocSinh = () => {
        const { ListHocSinh, isLoading } = stateHocSinh
        return (
            <FlatList
                contentContainerStyle={{ paddingHorizontal: 12 }}
                style={{ marginVertical: 20 }}
                data={ListHocSinh}
                onRefresh={_onRefesh}
                refreshing={isLoading}
                renderItem={renderItemHS}
                keyExtractor={(item, index) => `${index}`}
                onEndReachedThreshold={0.5}
                onEndReached={onLoadMore}
            />
        )
    }

    const renderGiaoVien = () => {
        return (
            <ScrollView
                style={{ marginTop: 12 }}
                contentContainerStyle={{ paddingHorizontal: 12 }}
            >
                {data?.GroupKhoi?.monHocs.map((item, index) => {
                    return (
                        <View key={index} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15,
                            backgroundColor: colors.whiteTwo,
                            borderRadius: 10,
                            paddingVertical: 5,
                        }}>
                            <Image source={Images.icteacherNew} style={nstyles.nAva40} resizeMode={'contain'} />
                            <Text>{item?.tenGiaoVien}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
    let theme = store.getState().theme;
    const renderTabBar = (props) => {
        return (
            <View
                // start={{ x: 0, y: 0 }}
                // end={{ x: 1, y: 0 }}
                // colors={theme.colorLinear.color}
                style={[stModaGiaoVien.tabContainer, {
                    paddingVertical: 12,
                }]}
            >
                <View style={{
                    marginHorizontal: 10,
                    flexDirection: 'row',
                }}>
                    {dataTab.map((item, index) => {
                        return (
                            <TouchableOpacity style={{
                                marginLeft: 15, flex: 1,
                                alignItems: 'center',
                                backgroundColor: index === state.indexTab ? colors.greenFE : colors.white,
                                padding: 10,
                            }}
                                onPress={() => setState({
                                    indexTab: index
                                })}
                            >
                                <Text style={{
                                    color: index === state.indexTab ? colors.white : colors.black,
                                    fontWeight: index === state.indexTab ? 'bold' : null,
                                    fontSize: reText(15)
                                }} > {item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

        )
    }

    const renderFooter = () => {
        return (
            <View View style={{ paddingVertical: 20, alignItems: 'center' }
            }>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center', backgroundColor: colors.redFresh, width: '40%',
                        borderRadius: 8,
                        height: 45,
                        justifyContent: 'center'

                    }}
                    onPress={backAction}
                >
                    <Text style={{ fontSize: reText(15), color: 'white', }} >Đóng</Text>
                </TouchableOpacity>
            </View>
        )
    }

    Utils.nlog('gia tri state', stateHocSinh)
    return (
        <View style={stModaGiaoVien.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => {
                    Utils.goback();
                }}
                iconLeft={Images.icBack}
                title={`Kết quả học tập`}
                styleTitle={{ color: colors.white }}
            />
            {/* <Animated.View onTouchEnd={backAction} style={[stModaGiaoVien.modal, { opacity }]} /> */}
            <View style={{ flex: 1, backgroundColor: colors.white, marginTop: 15 }}>
                <TabView
                    navigationState={{ index: state.indexTab, routes: dataTab }}
                    renderScene={renderScene}
                    onIndexChange={(index) => { // dùng swipeEnbaled
                        setState({
                            indexTab: index
                        })
                    }}
                    renderTabBar={renderTabBar}
                    initialLayout={{ width: nwidth() }}
                    style={stModaGiaoVien.container}
                    lazy
                />
                {renderFooter()}
            </View>
            <IsLoading />
        </View >
    )
}

export default ModaGiaoVien

const stModaGiaoVien = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    tabContainer: {
        backgroundColor: colors.white
    },
    modal: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
    },
})