import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, BackHandler, TextInput, Image } from 'react-native'
import { useSelector } from 'react-redux'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { SetCV, SetDataTinTuyenDung, Set_TinTuyenDung } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { initialStateDataSVL } from '../../../../../srcRedux/reducers/DataSVL'
import { store } from '../../../../../srcRedux/store'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import { nstyles, nwidth } from '../../../../../styles/styles'
import { GetAllListDMLoaiNganhNghe, GetAllList_DM_ChucVu } from '../../../apis/apiSVL'
import DropDownModal from '../../../components/DropDownModal'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import HeaderTitle from '../../HoSo/components/HeaderTitle'
import RadioButtons from '../../HoSo/components/RadioButtons'
import SwitchButtons from '../../HoSo/components/SwitchButtons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const dataTimeWork = [
    {
        title: 'Toàn thời gian'
    },
    {
        title: 'Bán thời gian'
    }
]


const index = (props) => {
    const DataTuyenDung = useSelector(state => state.dataSVL.Data_TinTuyenDung[0])
    Utils.nlog('gia tri item', DataTuyenDung)
    const [TypeDoanhNghiep, setTypeDoanhNghiep] = useState(DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.TypeDoanhNghiep ? DataTuyenDung.TypeDoanhNghiep : 'Doanh nghiệp, công ty')
    const [typeWork, setTypeWork] = useState(DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.TypeTinTuyenDung ? DataTuyenDung.TypeTinTuyenDung : 'Toàn thời gian')
    const [isShare, setIsShareCv] = useState(DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.isShare ? DataTuyenDung.isShare : false)
    const [IsFinish, setIsFinish] = useState(false)
    const [isShow, setIsShow] = useState(false)
    const [state, setstate] = useState([
        {
            label: 'Ngành nghề',
            title: '-- Chọn ngành nghề --',
            data: [],
            KeySearch: 'NganhNghe',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.career ? DataTuyenDung.career : { Id: 0, NganhNghe: '--Không chọn--' },
            KeyId: 'Id',
            KeyTitle: 'NganhNghe',
            Placeholdertxt: 'Nhập ngành nghề',
            TxtNganhNghe: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.NganhNgheKhac ? DataTuyenDung.NganhNgheKhac : '',
        },
        {
            label: 'Chức danh',
            title: '-- Chọn chức danh --',
            data: [],
            KeyId: 'Id',
            KeySearch: 'ChucVu',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.Chucvu ? DataTuyenDung.Chucvu : { Id: 0, ChucVu: '--Không chọn--' },
            KeyTitle: 'ChucVu',
            Placeholdertxt: 'Nhập chức danh',
            TxtNganhNghe: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.ChucVuKhac ? DataTuyenDung.ChucVuKhac : '',
        },
        {
            label: 'Loại hồ sơ',
            title: '-- Chọn loại hình--',
            data: [
                {
                    title: 'Học sinh,sinh viên',
                    value: 0,
                },
                {
                    title: 'Người lao động',
                    value: 1,
                },
            ],
            KeySearch: 'title',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.TypePerson ? DataTuyenDung.TypePerson : '',
            KeyTitle: 'title'
        },
    ]);
    const onChangeImage = (key) => {
        setTypeDoanhNghiep(key)
    }

    const getApi = async () => {
        let res = await GetAllListDMLoaiNganhNghe(); // get dach sách ngành nghề
        let res2 = await GetAllList_DM_ChucVu(); // get dach sách chức vụ
        Utils.nlog('gia tri res1', res)
        let item1 = [
            { Id: 0, LoaiNganhNghe: '--Không chọn--' },
        ]
        let item2 = [
            { Id: 0, ChucVu: '--Không chọn--' },
        ]
        setstate([
            {
                ...state[0],
                data: res.data && res.status === 1 ? item1.concat(res.data) : [],
            },
            {
                ...state[1],
                data: res2.data && res2.status === 1 ? item2.concat(res2.data) : [],
            },
            {
                ...state[2]
            },
        ])
    }
    useEffect(() => {
        getApi();
    }, [])

    useEffect(() => {
        if (CheckData(true)) {
            if (!IsFinish)
                setIsFinish(true);
        }
        else {
            if (IsFinish)
                setIsFinish(false);
        }
    }, [state])

    const Save_TinTuyenDung = (item, index) => {

        store.dispatch(SetDataTinTuyenDung(item, index))
    }

    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv1 = {
                Id: DataTuyenDung?.Id,
                TypeDoanhNghiep: TypeDoanhNghiep,
                TypePerson: state[2].value, // Doanh nghiệp công ty ||  Cá nhân
                TypeTinTuyenDung: typeWork, // hình thức làm việc
                career: state[0].value,
                Chucvu: state[1].value,
                isShare: isShare,
                NganhNgheKhac: state[0].value?.Id === 0 ? state[0].TxtNganhNghe : '',
                ChucVuKhac: state[1].value?.Id === 0 ? state[1].TxtNganhNghe : '',
            }
            if (IsFinish) {
                Utils.nlog('gia tri data cv', itemSeTepCv1)
                Save_TinTuyenDung(itemSeTepCv1, 0) // save dataaSVl store redux theo index
                Utils.navigate('Sc_ThongTinDaiDien')
            }
        }
    }


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
    }, []);

    const backAction = () => {
        Go_Back();
        return true;
    };

    const Go_Back = () => {
        const IsEdit = Utils.getGlobal('IsEditTinTuyenDung');
        const IsSaoLuu = Utils.getGlobal('SaoLuu');
        if (IsEdit)
            Utils.setGlobal('IsEditTinTuyenDung', false)
        if (IsSaoLuu)
            Utils.setGlobal('SaoLuu', false)
        store.dispatch(SetDataTinTuyenDung(initialStateDataSVL.Data_TinTuyenDung))
        Utils.goback(this)
    }

    const setDataChange = (item, index) => {
        let daaTempt = [...state]
        daaTempt[index].value = item;
        setstate(daaTempt)
    }

    const Get_ItemDrop = (item, index) => { // lấy item từ các dropdown
        setDataChange(item, index)
    }

    const Get_TypeWork = (item) => { // lấy item hình thức làm việc
        setTypeWork(item?.title);
    }

    const CheckData = (IsFinish = false) => {
        if (!state[0].value) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn ngành nghề", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (!state[1].value) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn chức danh", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (!state[2].value) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn loại hồ sơ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else {
            return true;
        }
    }

    Utils.nlog('gia tri state', state)
    return (
        <View style={stTaoTinTD.container}>
            <HeaderSVL
                title={"Đăng tin duyển dụng"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: !IsFinish ? colorsSVL.grayTextLight : colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />
            <KeyboardAwareScrollView style={{
                flex: 1, backgroundColor: colors.white, marginTop: 10,
                paddingHorizontal: 12, paddingTop: 15
            }}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={50}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <HeaderTitle text='1. Thông tin tổng quan'
                    titleSub='Giúp người lao động dễ dang tiếp cận thông tin tuyển dụng của  bạn'
                />
                <TextApp style={[stTaoTinTD.bold, { marginTop: 20, fontSize: reText(17) }]}>{'Người sử dụng lao động là?'}</TextApp>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingTop: 11 }}>
                    <TouchableOpacity onPress={() => onChangeImage('Doanh nghiệp, công ty')}
                        activeOpacity={0.5}
                    >
                        <Image source={ImagesSVL.icDoanhNghiep} style={{
                            width: nwidth() / 2.5, height: 150, borderRadius: 20,
                            borderWidth: 0.8, borderColor: TypeDoanhNghiep != 'Doanh nghiệp, công ty' ?
                                colorsSVL.grayLine : colorsSVL.blueMainSVL, marginRight: 11
                        }}
                            resizeMode='contain'
                        />
                        <TextApp style={{ textAlign: 'center', marginTop: 8 }} >{'Doanh nghiệp, công ty'}</TextApp>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeImage('Cá nhân')}>
                        <Image source={ImagesSVL.icCaNhan} style={{
                            width: nwidth() / 2.5, height: 150, borderRadius: 20,
                            borderWidth: 0.9, borderColor: TypeDoanhNghiep != 'Cá nhân' ? colorsSVL.grayLine : colorsSVL.blueMainSVL
                        }}
                            resizeMode='contain'
                            activeOpacity={0.5}
                        />
                        <TextApp style={{ textAlign: 'center', marginTop: 8 }} >{'Cá nhân'}</TextApp>
                    </TouchableOpacity>
                </View>
                <TextApp style={{ marginTop: 30, marginBottom: 14, fontSize: reText(16) }} >{'Hình thức làm việc'}</TextApp>
                <RadioButtons data={dataTimeWork} defaultValue={typeWork} keyValue='title' CallBack={Get_TypeWork} />
                {state.map((item, index) => {
                    return (
                        <View>
                            <DropDownModal
                                key={index}
                                styleContainer={{ marginTop: 20 }}
                                label={item.label}
                                valueSeleted={item.value}
                                text={state[index].value?.title ? state[index].value?.title : item.title}
                                styleText={{ fontSize: 13 }}
                                styleImg={nstyles.nIcon12}
                                data={item.data}
                                KeySearch={item.KeySearch}
                                isSearch={true}
                                KeyTitle={item.KeyTitle}
                                CallBack={(item) => Get_ItemDrop(item, index)}
                            />
                            {state[index].value?.Id === 0 &&
                                <TextInput
                                    style={{ height: 40, borderRadius: 4, backgroundColor: colors.whitegay, paddingHorizontal: 10, marginTop: 15 }}
                                    value={item.TxtNganhNghe}
                                    placeholder={item.Placeholdertxt}
                                    onChangeText={(text) => {
                                        let dataTempt = [...state]
                                        dataTempt[index]['TxtNganhNghe'] = text;
                                        setstate(dataTempt)
                                    }}
                                />
                            }
                        </View>
                    )
                })}
                {/* <SwitchButtons style={{ marginTop: 20 }}
                    style={{ marginTop: 20 }}
                    CallBack={Get_IsShareCv}
                    text={'Hiển thị bài đăng'}
                    defaultValue={isShare}
                /> */}
                <TextApp style={{ color: '#ADADAD', fontSize: reText(13) }} >
                    {'Giúp người sử dụng lao động có thể tìm bạn trong chức năng ‘người tìm việc’'}
                </TextApp>
            </KeyboardAwareScrollView>
        </View >
    )
}

export default index

const stTaoTinTD = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS === 'android' ? 'bold' : '600'
    }
})
