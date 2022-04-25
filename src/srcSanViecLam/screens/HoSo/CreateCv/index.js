import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, BackHandler, TextInput, Image } from 'react-native'
import Utils from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import TextApp from '../../../../../components/TextApp'
import { SetCV, SetCV_Item, SetCV_Default } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { store } from '../../../../../srcRedux/store'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import { nstyles, nwidth } from '../../../../../styles/styles'
import DropDownModal from '../../../components/DropDownModal'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import RadioButtons from '../../../screens/HoSo/components/RadioButtons'
import HeaderTitle from '../components/HeaderTitle'
import SwitchButtons from '../components/SwitchButtons'
import { GetAllListDMLoaiNganhNghe, GetAllList_DM_KinhNghiem, GetAllList_DM_ChucVu } from '../../../apis/apiSVL'
import { useSelector } from 'react-redux'
import { initialStateDataSVL } from '../../../../../srcRedux/reducers/DataSVL'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const dataTimeWork = [
    {
        title: 'Toàn thời gian',
    },
    {
        title: 'Bán thời gian',
    }
]


const index = (props) => {
    const IsAdd = Utils.ngetParam({ props: props }, 'IsAdd', false)
    const Item_CVTempt = useSelector(state => state.dataSVL.Data_CV[0])
    const [TypePerson, setTypePerson] = useState(Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.TypePerson ? Item_CVTempt.TypePerson : 'Học sinh, sinh viên')
    const [TypeCV, setTypeCV] = useState(Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.TypeCV ? Item_CVTempt.TypeCV : 'Toàn thời gian')
    const [isShareCv, setIsShareCv] = useState(false)
    const InfoUser = useSelector(state => state.auth.userCD);
    const [state, setstate] = useState([
        {
            label: 'Ngành nghề',
            title: '-- Chọn ngành nghề --',
            data: [],
            KeySearch: 'NganhNghe',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.career ? Item_CVTempt.career : { Id: 0, NganhNghe: '--Không chọn--' },
            KeyId: 'Id',
            KeyTitle: 'NganhNghe',
            Placeholdertxt: 'Nhập ngành nghề',
            TxtNganhNghe: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.NganhNgheKhac ? Item_CVTempt.NganhNgheKhac : '',
        },
        {
            label: 'Kinh nghiệm',
            title: '-- Chọn năm kinh nghiệm --',
            data: [],
            KeyId: 'Id',
            KeySearch: 'KinhNghiem',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.experience ? Item_CVTempt.experience : '',
            KeyTitle: 'KinhNghiem'
        },
        {
            label: 'Vị trí mong muốn',
            title: '-- Chọn vị trí--',
            data: [],
            KeyId: 'Id',
            KeySearch: 'ChucVu',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.position ? Item_CVTempt.position : { Id: 0, ChucVu: '--Không chọn--' },
            KeyTitle: 'ChucVu',
            Placeholdertxt: 'Nhập vị trí mong muốn',
            TxtNganhNghe: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.ChucVuKhac ? Item_CVTempt.ChucVuKhac : '',
        },
        {
            label: 'Khu vực làm việc',
            title: '-- Chọn khu vực--',
            data: [],
            KeyId: '',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.addressWork ? Item_CVTempt.addressWork : '',
            KeySearch: 'title',
            KeyTitle: 'title'
        },
    ]);

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

    const onChangeImage = (key) => {
        setTypePerson(key)
    }

    const GoModal_Address = () => {
        Utils.navigate('Modal_Address', { CallBack: Get_ItemAdrees, DataSeleted: state[3].value })
    }

    const Get_ItemAdrees = (item) => {
        Utils.nlog('gia tri dia chi', item)
        setDataChange(item, 3)
    }

    const Save_CV = (item, index) => {
        store.dispatch(SetCV(item, index))
    }

    const OnNext = () => {
        let itemSeTepCv1 = {
            IdCV: Item_CVTempt.IdCV,
            TypePerson: TypePerson, // loại cv  học sinh ||  người lao động
            TypeCV: TypeCV, // hình thức làm việc
            career: state[0].value,
            experience: state[1].value,
            position: state[2].value,
            addressWork: state[3].value,
            isShareCv: isShareCv,
            NganhNgheKhac: state[0].value?.Id === 0 ? state[0].TxtNganhNghe : '',
            ChucVuKhac: state[2].value?.Id === 0 ? state[2].TxtNganhNghe : '',
        }
        Utils.nlog('gia tri data cv', itemSeTepCv1)
        Save_CV(itemSeTepCv1, 0) // save dataaSVl store redux theo index
        // Utils.navigate('Sc_InfoResult')
        Utils.navigate('Sc_InfoRecruitment')
    }

    const Go_Back = () => {
        const IsEdit = Utils.getGlobal('IsEditCv');
        if (IsEdit)
            Utils.setGlobal('IsEditCv', false)
        store.dispatch(SetCV_Default(initialStateDataSVL.Data_CV)) // xóa item hồ sơ được sửa
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
        setTypeCV(item?.title);
    }

    const Get_IsShareCv = (item) => { // lấy share profile cv
        setIsShareCv(item);
    }
    const getApi = async () => {
        let res = await GetAllListDMLoaiNganhNghe(); // get dach sách ngành nghề
        let res2 = await GetAllList_DM_KinhNghiem(); // get dach sách kinh nghiệm
        let res3 = await GetAllList_DM_ChucVu(); // get dach sách chức vụ
        let item1 = [
            { Id: 0, LoaiNganhNghe: '--Không chọn--' },
        ]
        let item2 = [
            { Id: 0, ChucVu: '--Không chọn--' },
        ]
        setstate([
            {
                ...state[0],
                data: res.status === 1 && res.data ? item1.concat(res.data) : [],
            },
            {
                ...state[1],
                data: res2.status === 1 && res2.data ? res2.data : [],
            },
            {
                ...state[2],
                data: res3.status === 1 && res3.data ? item2.concat(res3.data) : [],
            },
            {
                ...state[3]
            },
        ])
    }

    useEffect(() => {
        getApi();
        if (InfoUser && IsAdd) {
            let itemSeTepCv2 = {
                Avatar: {
                    img: undefined,
                    checkFrist: true,
                },
                Name: InfoUser?.FullName ? InfoUser.FullName : '',
                Birthday: InfoUser?.NgaySinh ? moment(moment(InfoUser?.NgaySinh, 'DD/MM/YYYY')).format('YYYY/MM/DD') : '',
                Gender: InfoUser?.GioiTinh ? InfoUser?.GioiTinh === 0 ? 'Nam' : 'Nữ' : '',
                Address: InfoUser?.DiaChi ? InfoUser?.DiaChi : '',
                Phone: InfoUser?.PhoneNumber ? InfoUser?.PhoneNumber : '',
                Email: InfoUser?.Email ? InfoUser?.Email : '',
            }
            Save_CV(itemSeTepCv2, 1) // save dataaSVl store redux theo index
        }
    }, [])

    Utils.nlog('gia tri state', state)
    return (
        <View style={stCreateCv.container}>
            <HeaderSVL
                title={"Tạo hồ sơ xin việc"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
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
                    titleSub='Thông tin giúp người sử dụng lao động dễ tìm thông tin bạn hơn'
                />
                <TextApp style={[{ marginTop: 20, fontSize: reText(17) }, stCreateCv.bold]}>{'Bạn là ?'}</TextApp>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingTop: 11 }}>
                    <TouchableOpacity onPress={() => onChangeImage('Học sinh, sinh viên')}
                        activeOpacity={0.5}
                    >
                        <Image source={ImagesSVL.icStudent} style={{
                            width: nwidth() / 2.5, height: 150, borderRadius: 20,
                            borderWidth: 0.8, borderColor: TypePerson != 'Học sinh, sinh viên' ? colorsSVL.grayLine : colorsSVL.blueMainSVL, marginRight: 11
                        }}
                            resizeMode='contain'
                        />
                        <TextApp style={{ textAlign: 'center', marginTop: 8 }} >{'Học sinh, sinh viên'}</TextApp>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onChangeImage('Người lao động')}>
                        <Image source={ImagesSVL.icWorkers} style={{
                            width: nwidth() / 2.5, height: 150, borderRadius: 20,
                            borderWidth: 0.9, borderColor: TypePerson != 'Người lao động' ? colorsSVL.grayLine : colorsSVL.blueMainSVL
                        }}
                            resizeMode='contain'
                            activeOpacity={0.5}
                        />
                        <TextApp style={{ textAlign: 'center', marginTop: 8 }} >{'Người lao động'}</TextApp>
                    </TouchableOpacity>
                </View>
                <TextApp style={{ marginTop: 30, marginBottom: 14, fontSize: reText(16) }} >{'Hình thức làm việc'}</TextApp>
                <RadioButtons
                    defaultValue={TypeCV}
                    data={dataTimeWork} keyValue='title' CallBack={Get_TypeWork} />
                {state.map((item, index) => {
                    return (
                        <View>
                            <DropDownModal
                                key={index}
                                valueSeleted={item.value}
                                KeyId={item.KeyId}
                                styleContainer={{ marginTop: 20 }}
                                styleTextTitle={index === state.length - 1 ? { color: index === state.length - 1 && item.value ? colors.blackt : colorsSVL.grayTextLight } : null}
                                label={item.label}
                                text={index === state.length - 1 && item.value ? item.value.TenQuanHuyen + '- ' + item.value.TenTinhThanh : item.title}
                                styleText={{ fontSize: 13 }} styleImg={nstyles.nIcon12}
                                data={item.data}
                                KeySearch={item.KeySearch}
                                isValue={index === state.length - 1 ? false : true}
                                isSearch={true}
                                onPress={index === state.length - 1 ?
                                    GoModal_Address
                                    : null}
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
                    defaultValue={Item_CVTempt ? Item_CVTempt.IsPublic : false}
                    text={'Công khai hồ sơ công việc'}
                /> */}
                <TextApp style={{ color: '#ADADAD', fontSize: reText(13) }} >
                    {'Giúp người sử dụng lao động có thể tìm bạn trong chức năng ‘người tìm việc’'}
                </TextApp>
            </KeyboardAwareScrollView>
        </View >
    )
}

export default index

const stCreateCv = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    }
})
