import { BackHandler, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Utils from '../../../app/Utils'
import { ButtonCom, HeaderCus, IsLoading, ListEmpty } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { nstyles, Width } from '../../../styles/styles';
import { GetDs_LopHoc } from './apiHocTap/apiHocTap'
import ItemShowDrop from './ItemShowDrop'
import { Transition, Transitioning } from 'react-native-reanimated'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { store } from '../../../srcRedux/store'
import LinearGradient from 'react-native-linear-gradient'
import { reText } from '../../../styles/size'

const maCapHoc = [
    { maCapHoc: 1, tenCapHoc: 'TH', value: ['1', '2', '3', '4', '5'] },
    { maCapHoc: 2, tenCapHoc: 'THCS', value: ['6', '7', '8', '9'] },
    { maCapHoc: 3, tenCapHoc: 'THPT', value: ['10', '11', '12'] },
    { maCapHoc: 4, tenCapHoc: 'Nhà trẻ', value: ['Nhóm trẻ'] },
    { maCapHoc: 5, tenCapHoc: 'Mẫu giáo', value: ['Lớp mẫu giáo'] },
]





const ThongTinLopHoc = (props) => {
    const [state, setState] = useState({
        ListClass: [],
    })
    const dsGiaoVienBoMon = Utils.ngetParam({ props: props }, 'dsBoMon', [])

    // useEffect(() => {
    //     Get_Api();
    // }, [maTruongHoc])

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


    const Get_CapHoc = (khoiHoc = "") => {
        let objectTempt = {}
        for (let index = 0; index < maCapHoc.length; index++) {
            const item = maCapHoc[index];
            let isValue = item.value.includes(khoiHoc);
            if (isValue) {
                objectTempt = { 'maCapHoc': item.maCapHoc, 'tenCapHoc': item.tenCapHoc };
                return objectTempt;
            }
        }
        return objectTempt;
    }

    const Get_YearCurrent = () => {
        let DateCurrent = new Date()
        if (DateCurrent.getMonth() <= 9)
            return DateCurrent.getFullYear() - 1;
        else {
            return DateCurrent.getFullYear()
        }
    }
    const Get_Api = async () => {
        // Utils.setToggleLoading(true);
        let YearCurrent = Get_YearCurrent();
        Utils.nlog('gia tri thang hien tai', YearCurrent)
        let res = await GetDs_LopHoc({
            maTruongHoc: maTruongHoc,
            namHoc: YearCurrent
        })
        Utils.nlog('gia tri data lop hoc', res)
        if (res.data && res.status === 1) {
            let temptGroup = [];
            let temptData = [...res.data]; // clone data từ api
            temptData = temptData.sort((a, b) => { // sort khối học
                return b.khoiHoc - a.khoiHoc
            })
            let vt = -1;
            let indexGroup = 0;
            for (let index = 0; index < temptData.length; index++) {
                const itemLopHocCurrent = temptData[index];
                if (index > vt) {
                    temptGroup?.push({
                        ['Khoi']: [{ 'Group': { 'GroupKhoi': itemLopHocCurrent, 'CapHoc': Get_CapHoc(itemLopHocCurrent.khoiHoc), maTruongHoc: maTruongHoc } }]
                    })
                    vt = index; // lưu index 
                    for (let index = vt + 1; index < temptData.length - 1; index++) {
                        const itemLopHoc = temptData[index];
                        if (itemLopHocCurrent?.khoiHoc == itemLopHoc?.khoiHoc) {
                            temptGroup[indexGroup]['Khoi']?.push({
                                ['Group']: { 'GroupKhoi': itemLopHoc, 'CapHoc': Get_CapHoc(itemLopHocCurrent.khoiHoc), maTruongHoc: maTruongHoc }
                            });
                            vt = index; // update lại index ở for ngoài 
                        }
                        else {
                            indexGroup++; // tăng index group cho group
                            break;
                        }
                    }
                }
            }
            setState({
                ...state,
                ListClass: temptGroup
            })
        }
        // Utils.setToggleLoading(false);
    }

    const renderItemClass = ({ item, index }) => {
        return (
            <View style={styles.item}
                onPress={() => { }}>
                <Image source={Images.icteacherNew} style={nstyles.nIcon50} resizeMode={'contain'} />
                <View style={{ marginLeft: 10, flex: 1 }} >
                    <Text style={{ fontSize: reText(15), textAlign: 'justify', marginBottom: 8 }} >Môn học: {item?.tenMonHoc ? item?.tenMonHoc : ''}</Text>
                    <Text style={{ fontSize: reText(15), textAlign: 'justify' }} >Tên giáo viên: {item?.tenGiaoVien ? item?.tenGiaoVien : ''}</Text>
                </View>
            </View>
        )
    }
    const Call_BackYear = (year) => {
        setYear(year)
    }

    const Call_Back = (item) => {
        setHocKy(item)
    }
    // Utils.nlog('gia tri state', state.ListßClass)
    let theme = store.getState().theme;
    Utils.nlog('gia tri dach sach bo mon', dsGiaoVienBoMon)
    return (
        <View style={styles.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback({ props: props })}
                iconLeft={Images.icBack}
                title={`Danh sách giáo viên`}
                styleTitle={{ color: colors.white }}
            />
            <FlatList
                contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 15 }}
                data={dsGiaoVienBoMon}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItemClass}
                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu ....'} />}
            />
            <IsLoading />
        </View >
    )
}

export default ThongTinLopHoc

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorGrayBgr
    },
    item: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginBottom: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    }
})