import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { HeaderCus, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'

const Tableau = (props) => {

    const [DataList, setDataList] = useState([])
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        GetListTableau()
    }, [])

    const GetListTableau = async () => {
        let res = await apis.ApiDashBoardIOC.GetListTableau()
        console.log('[LOG]', res)
        if (res.data && res.data.length > 0) {
            setDataList(res.data)
            setLoading(false)
        } else {
            setDataList([])
            setLoading(false)
        }
    }

    const goDetail = (item) => {
        Utils.goscreen({ props: props }, 'DetailsTableau', { item: item })
    }

    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => goDetail(item)} style={{
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
                <Image source={item?.linkIcon ? { uri: item.linkIcon } : Images.icTableau} style={{ width: 30, height: 30, marginBottom: 10 }} resizeMode={'contain'} />
                <Text style={{ fontSize: reText(15), fontWeight: '300' }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    const Reload = () => {
        GetListTableau()
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                title={'TABLEAU'}
                styleTitle={{ color: colors.white }}
                iconLeft={Images.icBack}
                onPressLeft={() => { Utils.goscreen({ props: props }, 'ManHinh_Home') }}
            />
            <View style={styles.container}>
                <FlatList
                    numColumns={2}
                    style={{ paddingHorizontal: Width(3) }}
                    data={DataList}
                    refreshing={Loading}
                    onRefresh={Reload}
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<ListEmpty textempty={Loading ? 'Đang tải' : 'Không có dữ liệu'} isImage={!Loading} />}
                />
            </View>
        </View>
    )
}

export default Tableau

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackgroundHome,
    },
})
