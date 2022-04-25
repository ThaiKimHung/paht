import {
    StyleSheet, Text, View, FlatList,
    Image, TouchableOpacity, BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Utils from '../../../app/Utils'
import { api_TraCuuHocTap } from './apiHocTap/apiHocTap'
import { ListEmpty, IsLoading, HeaderCus, ButtonCom } from '../../../components'
import { Images } from '../../images';
import { colors } from '../../../styles';
import { nstyles, Width } from '../../../styles/styles';
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { reText } from '../../../styles/size'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import TextApp from '../../../components/TextApp'
import TextInputApp from '../../../components/TextInputApp'

const dataHocKy = [
    { id: 3, title: 'Cả năm' },
    { id: 1, title: 'Học kỳ 1' },
    { id: 2, title: 'Học kỳ 2' },
]


const TraCuuHocTap = (props) => {
    //Loại tra cứu KQHT false: tra cứu theo sđt phụ huynh (sđt login), true: tra cứu theo mã học sinh
    const Type_TraCuuKQHT = Utils.getGlobal(nGlobalKeys.Type_TraCuuKQHT, false)

    const [state, setState] = useState({
        ListSchool: [],
        DataSreach: [],
    })
    const PhoneAuth = useSelector(state => state.auth.userCD)
    const theme = useSelector(state => state.theme)
    let YearCurrent = new Date().getFullYear()
    const [Year, setYear] = useState(YearCurrent + '-' + (YearCurrent + 1))
    const [HocKy, setHocKy] = useState(
        { id: 1, title: 'Học kỳ 1' },
    )
    const [IDStudent, setIDStudent] = useState('')

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Get_Api();
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    }, [])

    const handleBackButton = () => {
        Utils.goscreen({ props }, 'ManHinh_Home');
        return true
    }

    const Get_Api = async () => {
        Utils.setToggleLoading(true);
        let YearNews = Year.split('-')[0]; // get year
        Utils.nlog('gia tri year', YearNews)
        let body = {
            namHoc: YearNews,
            hocKy: HocKy.id
        }
        if (Type_TraCuuKQHT) {
            body = {
                ...body,
                "maHocSinh": IDStudent,
            }
        } else {
            body = {
                ...body,
                soDienThoai: PhoneAuth?.PhoneNumber ? PhoneAuth.PhoneNumber : '',
                maSo: "64"
            }
        }
        Utils.nlog('gia tri body', body)
        let res = await api_TraCuuHocTap(body)
        Utils.setToggleLoading(false);
        Utils.nlog('gia tri res api hoc tap', res)
        setState({
            ...state,
            ListSchool: res?.data && res?.status === 1 ? res.data?.rows : []
        })
        if (res?.data?.message && res?.data?.code != 200) {
            Utils.showMsgBoxOK({ props }, 'Cảnh báo', res.data.message, 'Đóng')
        }
    }

    const { ListSchool, DataSreach } = state
    Utils.nlog('gia tri them', theme)
    const renderItemSchool = ({ item, index }) => {
        return (
            <View
                style={{
                    elevation: 3,
                    padding: 10,
                    marginBottom: 10, backgroundColor: colors.colorGrayBgr,
                    alignItems: 'center',
                    borderRadius: 10,
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={Images.icSchool} resizeMode={'contain'} style={nstyles.nIcon65} />
                    <View style={{ paddingLeft: 15, flex: 1 }} >
                        <Text style={styles.txtItemSchool}>Họ tên: {item?.hoTen ? item?.hoTen : ''}</Text>
                        <Text style={styles.txtItemSchool}>{item?.tenTruongHoc ? item.tenTruongHoc : ''}</Text>
                        <Text style={styles.txtItemSchool}>Lớp học: {item?.tenLopHoc ? item.tenLopHoc : ''}</Text>
                        <Text style={styles.txtItemSchool}>Giáo viên chủ nhiệm: {item?.tenGvcn ? item.tenGvcn : ''}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => Utils.navigate('sc_ThongTinLopHoc', { dsBoMon: ListSchool[index]?.listGiaoVienBoMon ? ListSchool[index]?.listGiaoVienBoMon : [] })}
                        style={{ flex: 1, backgroundColor: colors.blueZalo, padding: 10, marginRight: 10, borderRadius: 8 }}>
                        <Text style={{ color: colors.white, textAlign: 'center' }}>Danh sách giáo viên</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            Utils.navigate('sc_KetQuaHocTap', { ItemTraCuu: ListSchool[index] })
                        }}
                        style={{ flex: 1, backgroundColor: colors.blueZalo, borderRadius: 8, padding: 10 }}>
                        <Text style={{ color: colors.white, textAlign: 'center' }}>Kết quả học tập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const Call_BackYear = (date) => {
        setYear(date)
    }

    const Call_Back = (item) => {
        setHocKy(item)
    }
    Utils.nlog('gia tri state', ListSchool)
    return (
        <View style={styles.container} >
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => {
                    Utils.goscreen({ props }, 'ManHinh_Home');
                }}
                iconLeft={Images.icBack}
                title={`Tra cứu kết quả học tập`}
                styleTitle={{ color: colors.white }}
            />
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[colors.blueyGreyTwo, colors.colorGrayIcon]}
                style={{
                    marginVertical: 20,
                    paddingVertical: 15,
                    marginHorizontal: 10,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                }}
            >
                {
                    Type_TraCuuKQHT ?
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <TextApp style={{ color: colors.white, marginRight: 10, fontSize: reText(15) }}>
                                Mã học sinh:
                            </TextApp>
                            <TextInputApp
                                style={{
                                    padding: Platform.OS == 'android' ? 5 : 10,
                                    backgroundColor: colors.white,
                                    marginVertical: 10,
                                    borderRadius: 10,
                                    flex: 1
                                }}
                                placeholder={'Nhập mã học sinh'}
                                onChangeText={text => setIDStudent(text)}
                                maxLength={20}
                            />
                        </View> :
                        <Text style={{ color: colors.white, marginBottom: 8, fontSize: reText(15) }}>SĐT phụ huynh: <Text style={{ fontWeight: 'bold', fontSize: reText(15) }} >{PhoneAuth?.PhoneNumber ? PhoneAuth.PhoneNumber : ''}</Text></Text>
                }
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ color: colors.white, marginRight: 10, fontSize: reText(15) }} >Năm học</Text>
                    <TouchableOpacity style={styles.btn}
                        onPress={() => Utils.goscreen({ props }, 'Modal_YearPickerNew',
                            {
                                year: Year,
                                callback: Call_BackYear
                            }
                        )}>
                        <Text>{Year}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 5 }} />
                    <TouchableOpacity style={styles.btn}
                        onPress={() => {
                            Utils.navigate('Modal_Button', {
                                Data: dataHocKy,
                                KeyTitle: 'title',
                                CallBack: Call_Back,
                                ItemSelected: HocKy,
                                Search: true,
                                KeySearch: 'title',
                                KeyId: 'id'
                            })
                        }}>
                        <Text>{HocKy.title}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 5,
                }} >
                    <ButtonCom
                        colorChange={[colors.blueZalo, colors.colorButtomright]}
                        Linear
                        onPress={Get_Api}
                        shadow={false}
                        txtStyle={{ color: colors.white }}
                        style={
                            {
                                borderRadius: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                                height: 40,
                                paddingHorizontal: 10,

                            }}
                        text={'Tra cứu thông tin học sinh'}
                    />
                </View>
            </LinearGradient>
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 10 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={DataSreach.length > 0 ? DataSreach : ListSchool}
                    renderItem={renderItemSchool}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu ....'} />}
                />
            </View>
            <IsLoading />
        </View>
    )
}

export default TraCuuHocTap

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    txtItemSchool: {
        flexShrink: 1,
        textAlign: 'justify',
        paddingBottom: 8,
    },
    btn: {
        backgroundColor: colors.white,
        flex: 1,
        padding: 10,
        borderRadius: 8,
        // marginHorizontal: 3,
    },
    wsreach: {
        backgroundColor: '#F5F5F5',
        marginTop: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        paddingHorizontal: 10,
        marginBottom: 10,
    }
})