import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { nstyles } from '../../../styles/styles'
import { HeaderCom } from '../../../components'
import { Images } from '../../images'
import BDTKTheoTinhTrang from './BDTKTheoTinhTrang'
import BDXPTheoThoiHan from './BDXPTheoThoiHan'
import BDXPTheoNam from './BDXPTheoNam'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import DSTKTheoDonVi from './DSTKTheoDonVi'
import ThongKeTienXPHC from './ThongKeTienXPHC'
import BDTKMucPhat_TinhTrang from './BDTKMucPhat_TinhTrang'
const data = [
    {
        id: 1,
        name: 'Biểu đồ xử phạt theo tình trạng'
    },
    {
        id: 2,
        name: 'Biểu đồ xử phạt theo thời hạn'
    },
    {
        id: 3,
        name: 'Biểu đồ xử phạt theo tháng'
    },
    {
        id: 6,
        name: 'Biểu đồ mức phạt hành chính theo tình trạng'
    },
    {
        id: 4,
        name: 'Thống kê theo đơn vị'
    },
    {
        id: 5,
        name: 'Thống kê tiền XPHC'
    }

]

const ThongKeXPHC = (props) => {
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
                return <BDTKTheoTinhTrang nthis={{ props: props }} data={selectBD} />
                break;
            case 2:
                return <BDXPTheoThoiHan nthis={{ props: props }} data={selectBD} />
                break;
            case 3:
                return <BDXPTheoNam nthis={{ props: props }} data={selectBD} />
                break;
            case 6:
                return <BDTKMucPhat_TinhTrang nthis={{ props: props }}></BDTKMucPhat_TinhTrang>
                break;
            case 4:
                return <DSTKTheoDonVi nthis={{ props: props }}></DSTKTheoDonVi>
                break;
            case 5:
                return <ThongKeTienXPHC nthis={{ props: props }}></ThongKeTienXPHC>
                break;
            default:
                break;
        }
    }
    return (
        <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
            <HeaderCom nthis={{ props: props }} titleText={'Thống kê'}
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

export default ThongKeXPHC

const styles = StyleSheet.create({})
