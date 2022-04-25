import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { stat } from 'react-native-fs'
import Utils from '../../../../../app/Utils'
import { IsLoading } from '../../../../../components'
import TextApp from '../../../../../components/TextApp'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'
import { Height, nwidth, Width } from '../../../../../styles/styles'
import apis from '../../../../apis'
import { GetTinhThanh } from '../../../../apis/apiapp'
import ButtonSVL from '../../../components/ButtonSVL'
import DropDownModal from '../../../components/DropDownModal'
import { GetAllListDMTinhThanh, GetListDMQuanHuyenById } from '../../../apis/apiSVL'
import { useSelector } from 'react-redux'

const Modal_Address = (props) => {
    const { DataFilter = [] } = useSelector(state => state.dataSVL)
    const opacity = useRef(new Animated.Value(0)).current
    const Get_Item = Utils.ngetParam({ props: props }, 'CallBack', () => { })
    const DataSeleted = Utils.ngetParam({ props: props }, 'DataSeleted', '')
    console.log('DataSeleted', DataSeleted)
    const [selectedTinh, setSelectedTinh] = useState(DataSeleted?.IdTinh ?
        { IDTinhThanh: DataSeleted?.IdTinh, TenTinhThanh: DataSeleted?.TenTinhThanh }
        : { IDTinhThanh: 0, TenTinhThanh: '-- Tất cả --' })
    const [selectedQuan, setSelectedQuan] = useState(DataSeleted?.IDQuanHuyen ?
        { ...DataSeleted, IDQuanHuyen: DataSeleted?.IDQuanHuyen, TenQuanHuyen: DataSeleted?.TenQuanHuyen }
        : { IDQuanHuyen: 0, TenQuanHuyen: '-- Tất cả --' })
    const [dataQuan, setDataQuan] = useState([{ IDQuanHuyen: 0, TenQuanHuyen: '-- Tất cả --' }])

    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 350);
    };

    useEffect(() => {
        startAnimation(0.5);
    }, [])

    useEffect(() => {
        if (DataSeleted?.IdTinh && DataSeleted?.IdTinh != -1) {
            CallBackTinh({ IDTinhThanh: DataSeleted?.IdTinh, TenTinhThanh: DataSeleted?.TenTinhThanh })
        }
    }, [DataSeleted])

    const backAction = () => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback({ props: props });
            });
        }, 50);

    }

    const CallBackTinh = async (item) => {
        Utils.nlog('[LOG] item tinh', item)
        setSelectedTinh(item)
        Utils.setToggleLoading(true)
        let res = await GetListDMQuanHuyenById(item?.IDTinhThanh)
        Utils.setToggleLoading(false)
        Utils.nlog('[LOG] res quan huyen', res)
        if (res.status == 1 && res?.data) {
            let arrQuan = [{ IDQuanHuyen: -1, TenQuanHuyen: '-- Tất cả --' }, ...res.data]
            setDataQuan(arrQuan)
            if (item?.IDTinhThanh != DataSeleted?.IdTinh) {
                setSelectedQuan(arrQuan[0])
            }
        }
    }

    const CallBackHuyen = (item) => {
        setSelectedQuan(item)
    }

    return (
        <View style={stModal_Address.container}>
            <Animated.View onTouchEnd={backAction} style={[stModal_Address.modal, { opacity }]} />
            <View style={stModal_Address.viewContainer} >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        width: nwidth() / 3, height: 5,
                        backgroundColor: '#C4C4C4', borderRadius: 10
                    }} />
                    <TextApp style={stModal_Address.txtTitle} >{'Khu vực làm việc'}</TextApp>
                </View>
                <View style={{ paddingTop: 33, flex: 1 }}>
                    <DropDownModal
                        label='Tỉnh / Thành phố'
                        CallBack={CallBackTinh}
                        isSearch={true}
                        KeySearch={'TenTinhThanh'}
                        valueSeleted={selectedTinh}
                        KeyTitle={'TenTinhThanh'}
                        data={DataFilter?.LstDiaDiem}
                        KeyId={'IDTinhThanh'}
                    />
                    <DropDownModal
                        label='Quận / Huyện'
                        CallBack={CallBackHuyen}
                        isSearch={true}
                        KeySearch={'TenQuanHuyen'}
                        valueSeleted={selectedQuan}
                        KeyTitle={'TenQuanHuyen'}
                        data={dataQuan}
                        KeyId={'IDQuanHuyen'}
                    />
                    <View style={{
                        paddingVertical: 20, flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1
                    }} >
                        <ButtonSVL
                            style={{ flex: 1, marginRight: 11, backgroundColor: colorsSVL.grayBgrInput, height: Width(10) }}
                            colorText={colors.black}
                            text='Đóng'
                            onPress={backAction}
                        />
                        <ButtonSVL
                            style={{ flex: 1, backgroundColor: colorsSVL.blueMainSVL, height: Width(10) }}
                            text='Xác Nhận'
                            onPress={() => {
                                backAction()
                                if (selectedQuan?.IDQuanHuyen != -1) {
                                    Get_Item(selectedQuan)
                                } else {
                                    console.log('selectedTinh', selectedTinh)
                                    let temp = {
                                        IdTinh: selectedTinh?.IDTinhThanh,
                                        TenTinhThanh: selectedTinh?.TenTinhThanh,
                                        ...selectedQuan
                                    }
                                    Get_Item(temp)
                                }
                            }}
                        />
                    </View>
                </View>
                <IsLoading />
            </View>
        </View >
    )
}

export default Modal_Address

const stModal_Address = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    txtTitle: {
        marginTop: 33,
        fontSize: reText(16),
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    viewContainer: {
        height: Height(45),
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.white,
        paddingTop: 13,
        paddingHorizontal: 13,
    },
    modal: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    }

})
