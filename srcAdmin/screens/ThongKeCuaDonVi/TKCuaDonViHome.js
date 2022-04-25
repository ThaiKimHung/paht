import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import Utils from '../../../app/Utils';
import { reText } from '../../../styles/size';
import HtmlViewCom from '../../../components/HtmlView';
import { nstyles } from '../../../styles/styles';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import TKTheoDonVi from './TKTheoDonVi'
import TKTheoDanhGia from './TKTheoDanhGia'
import TKTheoTaiKhoan from './TKTheoTaiKhoan'
import TKTheoLinhVuc from './TKTheoLinhVuc'
import TKTheoNguonPA from './TKTheoNguonPA'
import TKTheoChuyenMuc from './TKTheoChuyenMuc'
import { HeaderCom } from '../../../components';
import { Images } from '../../images';
const data = [
    {
        id: 1,
        name: 'Thống kê theo đơn vị'
    },
    {
        id: 2,
        name: 'Thống kê theo đánh giá'
    },
    {
        id: 3,
        name: 'Thống kê theo tài khoản'
    },
    {
        id: 4,
        name: 'Thống kê theo lĩnh vực'
    },
    {
        id: 5,
        name: 'Thống kê theo nguồn phản ánh'
    },
    {
        id: 6,
        name: 'Thống kê theo chuyên mục'
    }

]

const TKCuaDonViHome = (props) => {
    const [selectBD, setSelectBD] = useState(data[0])
    const renderItem = (item, index) => {
        return (<TouchableOpacity
            onPress={() => setSelectBD(item)}
            key={index.toString()} style={{
                paddingHorizontal: 5, marginLeft: 5,
                paddingVertical: 10, backgroundColor: item.id == selectBD.id ? colors.colorBlueLight : colors.black_20,
                borderRadius: 3,
            }}>
            <Text style={{ color: colors.white }}>{item.name}</Text>
        </TouchableOpacity>)
    }
    const renderBieuDo = () => {
        switch (selectBD.id) {
            case 1:
                return <TKTheoDonVi nthis={{ props: props }} data={selectBD} />
                break;
            case 2:
                return <TKTheoDanhGia nthis={{ props: props }} data={selectBD} />
                break;
            case 3:
                return <TKTheoTaiKhoan nthis={{ props: props }} data={selectBD} />
                break;
            case 4:
                return <TKTheoLinhVuc nthis={{ props: props }}></TKTheoLinhVuc>
                break;
            case 5:
                return <TKTheoNguonPA nthis={{ props: props }}></TKTheoNguonPA>
                break;
            case 6:
                return <TKTheoChuyenMuc nthis={{ props: props }}></TKTheoChuyenMuc>
                break;
            default:
                break;
        }
    }
    return (
        <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
            <HeaderCom nthis={{ props: props }} titleText={'Thống kê của đơn vị'}
                iconLeft={Images.icSlideMenu}
                onPressLeft={() => props.navigation.openDrawer()}
                iconRight={null}
            />
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 10, paddingVertical: 5
            }}>
                <View style={{
                    paddingVertical: 10,
                    backgroundColor: colors.white,
                    borderRadius: 5, borderWidth: 0.5,
                    borderColor: colors.orangeFive, paddingHorizontal: 10,
                    marginRight: 5
                }}>
                    <Text style={{ color: colors.orangeFive, fontSize: reText(15) }}>{'Biểu đồ :'}</Text>
                </View>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}>
                    {data.map(renderItem)}
                </ScrollView>
            </View>

            <View style={{ flex: 1, }}>
                <Text style={{
                    paddingVertical: 10, fontSize: reText(20),
                    color: colors.colorBlueLight, textAlign: 'center'
                }}>{selectBD.name}</Text>
                {
                    renderBieuDo()
                }

            </View>
        </View >
    )
}

export default TKCuaDonViHome

const styles = StyleSheet.create({})
