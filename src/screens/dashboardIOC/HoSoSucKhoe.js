import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import ChartCotChong from './component/ChartCotChong'
import ObjectDataYTe from './component/ObjectDataYTe'
import ChartPie from './component/ChartPie'
import { reSize } from '../../../chat/styles/size'
import { PieChart } from 'react-native-svg-charts'

const datatest = [
    {
        name: "name cot 1 tam teo tam",
        num1: 15,
        num2: 20,
        num3: 20
    },
    {
        name: "name1 cot 32",
        num1: 10,
        num2: 23,
        num3: 20
    },
    {
        name: "name1",
        num1: 30,
        num2: 23,
        num3: 20
    },
    {
        name: "name1",
        num1: 36,
        num2: 23,
        num3: 20
    }
]
const CHART_WIDTH_HEIGHT = {
    WIDTH: reSize(15),
    HEIGHT: reSize(250)
}
const HoSoSucKhoe = (props) => {

    const [data, setData] = useState([])
    const [value, setValue] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [dataTong, setdataTong] = useState({
        tongDaiThaoDuong: 0,
        tongTangHuyetAp: 0,
        tongBenhManTinh: 0,
        khongbenh: 0
    })

    const getDataYTe = async () => {
        let res = await apis.ApiDashBoardIOC.home();
        setisLoading(false)
        console.log("RESYTE:============", res)
        if (res) {
            setData(res)
            setValue(res.ttCapDuoi)
        }
        else {
            // setData([])
            // setValue([])
        }
    }
    useEffect(() => {
        getDataYTe()
    }, [])
    console.log("RESYTE2222:", value);
    const dataNhanKhau = () => {
        if (!value) {
            return []
        } else {
            return value.map((item, index) => {
                return { ...item, [ObjectDataYTe.keynew]: item[ObjectDataYTe.numNhanKhau] - item[ObjectDataYTe.numPhuNu] }
            })
        }
    }
    const dataLapHoSo = () => {
        if (!value) {
            return []
        } else {
            return value.map((item, index) => {
                return { ...item, [ObjectDataYTe.keynew]: item[ObjectDataYTe.numDaLapHS] - item[ObjectDataYTe.numDaKhoiTaoHS] }
            })
        }
    }
    useEffect(() => {
        if (data && value) {
            dataTongFC();
        }
    }, [data, value])
    const dataTongFC = () => {
        let objectData = {
            tongDaiThaoDuong: 0,
            tongTangHuyetAp: 0,
            tongBenhManTinh: 0
        }
        value.forEach(element => {
            objectData = {
                tongDaiThaoDuong: objectData.tongDaiThaoDuong + element[ObjectDataYTe.namDaiThaoDuong] + element[ObjectDataYTe.nuDaiThaoDuong],
                tongTangHuyetAp: objectData.tongTangHuyetAp + element[ObjectDataYTe.namTangHuyetAp] + element[ObjectDataYTe.nuTangHuyetAp],
                tongBenhManTinh: objectData.tongBenhManTinh + element[ObjectDataYTe.namBenhManTinh] + element[ObjectDataYTe.nuBenhManTinh],
            }
        });
        objectData = {
            ...objectData,
            khongbenh: data.numDaLapHS - objectData.tongDaiThaoDuong - objectData.tongTangHuyetAp - objectData.tongBenhManTinh,
        }
        setdataTong(objectData)
        Utils.nlog("data dataTong-----", objectData)
        return null;

    }
    Utils.nlog("--------------DULIEUNE:", dataNhanKhau());
    Utils.nlog("--------------DULIEUNE2222:", ObjectDataYTe);

    console.log("RESYTE2222:", data)
    const renderItemSucKhoe = (HinhAnh, Title, Value, color, isRight = false, isTong = false) => {
        return (
            <View style={[{ flexDirection: 'row', backgroundColor: color, flex: 1, paddingVertical: 5, marginRight: isRight ? 5 : 0, borderRadius: 5 }]}>
                <View style={{
                    backgroundColor: '#F0F0F03a', padding: 10, height: Height(2), width: Height(2), paddingBottom: 35,
                    alignItems: 'center', paddingHorizontal: 25, marginBottom: 10, marginLeft: 5, borderRadius: 5
                }}>
                    <Image source={HinhAnh} style={[nstyles.nIcon26, { alignSelf: 'center', }]} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                    <Text style={[styles.txtText, { fontSize: reText(18), fontWeight: 'bold' }]}>{Value}</Text>
                    <Text style={[styles.txtText, { marginTop: 5, fontWeight: 'bold' }]}>{Title}</Text>
                    <View style={{ height: 5, borderRadius: 5, backgroundColor: colors.white, paddingHorizontal: 10, marginTop: 5, marginBottom: 15 }} />
                    {
                        isTong ? <Text style={[styles.txtText, { fontSize: reText(10) }]} > T???NG: {Utils.formatMoney(data?.numNhanKhau)} NG?????I</Text> :
                            <Text style={[styles.txtText, { fontSize: reText(10) }]} >{Value}/{Utils.formatMoney(data?.numNhanKhau)} NG?????I</Text>
                    }
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                title={'TH??NG TIN Y T??? T???NG H???P'}
                styleTitle={{ color: colors.white }}
                iconLeft={Images.icBack}
                onPressLeft={() => { Utils.goscreen({ props: props }, 'ManHinh_Home') }}
            />
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, width: '100%', paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingHorizontal: 5 }}>
                        {renderItemSucKhoe(Images.icTreCon, `Tr??? em`.toUpperCase(), Utils.formatMoney(data?.numTreEm), '#20C1ED', true)}
                        {renderItemSucKhoe(Images.icPhuNu, `Ph??? n???`.toUpperCase(), Utils.formatMoney(data?.numPhuNu), '#18A55D')}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, paddingHorizontal: 5, marginTop: 5 }}>
                        {renderItemSucKhoe(Images.icNguoiGia, `Ng?????i cao tu???i`.toUpperCase(), Utils.formatMoney(data?.numNguoiCaoTuoi), '#F19B2C', true)}
                        {renderItemSucKhoe(Images.icHomeSK, `T???ng s??? h??? kh???u`.toUpperCase(), Utils.formatMoney(data?.numNhanKhau), '#DB4D3F', false, true)}
                    </View>
                </View>
                <ChartCotChong
                    // data={datatest}
                    data={dataNhanKhau()}
                    nameBD={'Th???ng k?? nh??n kh???u'}
                    listKey={[ObjectDataYTe.numPhuNu, ObjectDataYTe.keynew]}
                    listGhichu={["Ph??? n???a", "Nam gi???i"]}
                    listColor={["#7890D1", "#9E415E"]}
                    keylabel={ObjectDataYTe.cosoTen}
                    isLoading={isLoading}
                    width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT} />

                <ChartCotChong
                    nameBD={'Ti???n ????? l???p h??? s??'}
                    data={dataLapHoSo()}
                    listKey={[ObjectDataYTe.numDaLapHS, ObjectDataYTe.keynew, ObjectDataYTe.numDaKhoiTaoHS]}
                    listGhichu={["???? l???p", "ch??a kh???i", "???? kh???i"]}
                    listColor={["#7890D1", "#9E415E", colors.greenyBlue]}
                    keylabel={ObjectDataYTe.cosoTen}
                    isLoading={isLoading}
                    width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT} />

                <ChartCotChong
                    nameBD={'S??? ng?????i m???c ????i th??o ???????ng'}
                    data={value}
                    listKey={[ObjectDataYTe.nuDaiThaoDuong, ObjectDataYTe.namDaiThaoDuong]}
                    listGhichu={["Ph??? n???a", "Nam gi???i"]}
                    listColor={["#F7bc18", "#55b45c"]}
                    keylabel={ObjectDataYTe.cosoTen}
                    isLoading={isLoading}
                    width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT} />
                <ChartCotChong
                    nameBD={'S??? ng?????i m???c t??ng huy???t ??p'}
                    data={value}
                    listKey={[ObjectDataYTe.namTangHuyetAp, ObjectDataYTe.nuTangHuyetAp]}
                    listGhichu={["Ph??? n???a", "Nam gi???i"]}
                    listColor={["#F7bc18", "#55b45c"]}
                    keylabel={ObjectDataYTe.cosoTen}
                    isLoading={isLoading}
                    width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT} />
                <ChartCotChong
                    nameBD={'S??? ng?????i m???c b???nh m??n t??nh'}
                    data={value}
                    listKey={[ObjectDataYTe.namBenhManTinh, ObjectDataYTe.nuBenhManTinh]}
                    listGhichu={["Ph??? n???a", "Nam gi???i"]}
                    listColor={["#F7bc18", "#55b45c"]}
                    keylabel={ObjectDataYTe.cosoTen}
                    isLoading={isLoading}
                    width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT} />
                <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingVertical: 10 }}>{`Bi???u ????? t???ng th???`.toUpperCase()}</Text>
                <ChartPie
                    data={dataTong}
                    isLoading={isLoading}
                    listGhichu={["Kh??ng b???nh", "????i th??o ???????ng", "T??ng huy???t ??p", "B???nh m??n t??nh"]}
                />
            </ScrollView>

        </View>
    )
}

export default HoSoSucKhoe

const styles = StyleSheet.create({
    txtText: {
        fontSize: reText(13),
        color: colors.white,
    }
})
