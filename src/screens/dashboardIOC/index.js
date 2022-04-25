import React, { Component } from 'react'
import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { HeaderCus, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import { Images } from '../../images'
// import DashboardIOC from './DashBoardIOC'

let arrayMenu = [
    {
        id: 1, // ID rules, ko dc đổi
        name: 'Dịch vụ công',
        img: Images.iconTOAAN,
        colorImg: colors.blueFaceBook,
        goscreen: 'scDashBoardIOC'
    },
    {
        id: 2, // ID rules, ko dc đổi
        name: 'Hồ sơ sức khoẻ',
        img: Images.iconYTE,
        colorImg: colors.redStar,
        goscreen: 'scHoSoSucKhoe'
    },
    {
        id: 3, // ID rules, ko dc đổi
        name: 'Tableau',
        img: Images.iconTABLEAU,
        colorImg: colors.orange,
        goscreen: 'scTableau'
    }
]
export class index extends Component {
    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Utils.goscreen(this, item.goscreen)} style={{
                width: Width(46), height: Width(20), backgroundColor: colors.white, marginTop: 10, alignSelf: 'center',
                marginRight: Width(2), borderRadius: 10, paddingHorizontal: 15, paddingVertical: 15,
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 7,
                shadowOpacity: 0.2,
                shadowColor: colors.black_50,
            }}>
                <Image source={item.img} style={{ width: 20, height: 20, marginBottom: 10, tintColor: item.colorImg }} />
                <Text style={{ fontSize: reText(15), fontWeight: '300' }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        let menuIOC = Utils.getGlobal(nGlobalKeys.menuIOC, []);
        arrayMenu = arrayMenu.filter(item => menuIOC.includes(item.id))
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={"THÔNG TIN TỔNG HỢP IOC"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                />
                {/* <DashboardIOC nthis={this} /> */}
                <FlatList
                    numColumns={2}
                    style={{ paddingHorizontal: Width(3) }}
                    data={arrayMenu}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                />
            </View>
        )
    }
}

export default index
