import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { nstyles } from '../../../styles/styles'
import { HeaderCom } from '../../../components'
import { Images } from '../../images'
import BDXPTheoThoiHan from './BDXPTheoThoiHan'
import BDXPTheoNam from './BDXPTheoNam'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import DSTKTheoDonVi from './DSTKTheoDonVi'
import TK_TinhTrangXL from './TK_TinhTrangXL'
const data = [
    {
        id: 1,
        name: 'Thống kê theo tình trạng xử lý'
    },
    {
        id: 2,
        name: 'Biểu đồ xử phạt quá hạn'
    },
    {
        id: 3,
        name: 'Biểu đồ trực ban theo tháng'
    },
    {
        id: 4,
        name: 'Thống kê theo đơn vị'
    },
    // {
    //     id: 5,
    //     name: 'Thống kê tiền XPHC'
    // }

]

const ThongKeTrucBanTH = (props) => {
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
                return <TK_TinhTrangXL nthis={{ props: props }} data={selectBD} />
                break;
            case 2:
                return <BDXPTheoThoiHan nthis={{ props: props }} data={selectBD} />
                break;
            case 3:
                return <BDXPTheoNam nthis={{ props: props }} data={selectBD} />
                break;
            case 4:
                return <DSTKTheoDonVi nthis={{ props: props }}></DSTKTheoDonVi>
                break;
            default:
                break;
        }
    }
    return (
        <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
            <HeaderCom nthis={{ props: props }} titleText={'Thống kê trực ban'}
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

export default ThongKeTrucBanTH

const styles = StyleSheet.create({})
