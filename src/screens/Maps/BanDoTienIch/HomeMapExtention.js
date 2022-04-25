import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native'
import { useSelector } from 'react-redux'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../../components'
import ImageCus from '../../../../components/ImageCus'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import apis from '../../../apis'
import { Images } from '../../../images'

const HomeMapExtention = (props) => {
    const { isLandscape } = useSelector(state => state.theme)
    const [dataNhomTienIch, setDataNhomTienIch] = useState([])
    const refLoading = React.useRef(null)
    const rate = 94 / 110
    const widthItem = Dimensions.get('window').width * rate / 3
    const paddingCover = (Dimensions.get('window').width - widthItem * 3)
    const paddingItem = paddingCover / 4
    useEffect(() => {
        GetNhomDoiTuongLoaiTienIch()
    }, [])

    const GetNhomDoiTuongLoaiTienIch = async () => {
        refLoading.current.show()
        let res = await apis.ApiApp.GetNhomDoiTuongLoaiTienIch()
        Utils.nlog('[LOG] data res', res)
        refLoading.current.hide()
        if (res.status == 1 && res.data) {
            setDataNhomTienIch(res.data)
        } else {
            setDataNhomTienIch([])
        }
    }

    const onPressExtention = (item) => {
        Utils.goscreen({ props }, 'DetailsExtensionMap', { Extention: item })
    }

    return (
        <View style={stHomeMapExtention.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={'Danh sách tiện ích'}
                styleTitle={{ color: colors.white }}
                iconRight={Images.icSearch}
                onPressRight={() => { Utils.goscreen(this, 'TimKiemTienIch') }}
                Sright={{ tintColor: 'white' }}
            />
            <View style={stHomeMapExtention.body}>
                <ScrollView style={{}}>
                    <View style={{ alignSelf: 'center', width: widthItem * 3 + paddingCover, backgroundColor: 'transparent', flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 }}>
                        <TouchableOpacity onPress={() => { Utils.goscreen({ props }, 'Modal_MapHome') }} style={[nstyles.shadow, { width: widthItem, backgroundColor: 'white', height: widthItem, marginLeft: paddingItem, marginTop: paddingItem, borderRadius: 10 }]}>
                            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={Images.MapPAHT} style={nstyles.nIcon50} resizeMode={'contain'} />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ flex: 1, textAlign: 'center', fontSize: reText(12), color: '#505050' }}>{'Bản đồ phản ánh'}</Text>
                            </View>
                        </TouchableOpacity>
                        {dataNhomTienIch && dataNhomTienIch.length > 0 &&
                            dataNhomTienIch.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => onPressExtention(item)} style={[nstyles.shadow, { width: widthItem, backgroundColor: 'white', height: widthItem, marginLeft: paddingItem, marginTop: paddingItem, borderRadius: 10 }]}>
                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageCus defaultSourceCus={Images.icExtension} source={{ uri: item?.AnhDaiDien }} style={nstyles.nIcon50} resizeMode={'contain'} />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ flex: 1, textAlign: 'center', fontSize: reText(12), color: '#505050' }}>{item?.TenNhom}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                    </View>
                </ScrollView>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

export default HomeMapExtention

const stHomeMapExtention = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    body: { flex: 1 }
})
