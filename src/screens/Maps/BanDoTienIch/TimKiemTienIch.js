import React, { useState, useRef, useEffect, Fragment } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Image, Platform, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading, ListEmpty } from '../../../../components'
import { colors } from '../../../../styles'
import apis from '../../../apis'
import { Images } from '../../../images'
import { heightStatusBar, nstyles, paddingTopMul } from '../../../../styles/styles'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import MapExtentions from './MapExtentions'
import ItemExtentionLocation from './ItemExtentionLocation'

const TimKiemTienIch = (props) => {
    const { colorLinear } = useSelector(state => state.theme)
    const refInput = useRef(null)
    const [data, setData] = useState([])
    const [keyWork, setKeyWork] = useState('')
    const [selectBar, setSelectBar] = useState(true)
    const refLoading = useRef(null)
    useEffect(() => {
        refInput.current.focus()
    }, [refInput])


    const renderItem = (item, index) => {
        return (
            <Fragment key={index}>
                <ItemExtentionLocation data={item} keyComp={index} onPress={() => { Utils.goscreen({ props }, 'DetailsLocations', { data: item }) }} />
            </Fragment>
        )
    }

    const onSearch = async () => {
        refInput.current.blur()
        if (keyWork.length > 0) {
            refLoading.current.show()
            let res = await apis.ApiApp.GetDichVu(keyWork)
            Utils.nlog('[LOG] res search ', res)
            if (res.status == 1 && res.data) {
                let dataMark = []
                dataMark = res.data.map(item => {
                    return {
                        ...item,
                        location: {
                            latitude: item.Lat,
                            longitude: item.Long
                        },
                    }
                })
                setData(dataMark)
                refLoading.current.hide()
            } else {
                setData([])
                refLoading.current.hide()
            }
        } else {
            setData([])
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={colorLinear.color}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(),
                    padding: 10
                }}
            >
                <TouchableOpacity activeOpacity={0.5} style={{ padding: 5, paddingHorizontal: 10 }} onPress={() => { Utils.goback({ props }) }}>
                    <Image source={Images.icBack} style={nstyles.nIcon22} resizeMode='contain' />
                </TouchableOpacity>
                <TextInput
                    ref={refInput}
                    placeholder="Nhập tên địa điểm cần tìm..."
                    style={{
                        padding: Platform.OS == 'android' ? 5 : 10,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        flex: 1, marginLeft: 5
                    }}
                    onChangeText={(text) => setKeyWork(text)}
                    onSubmitEditing={() => onSearch()}
                />
                <TouchableOpacity activeOpacity={0.5} onPress={() => onSearch()} style={{ padding: 5, paddingHorizontal: 10 }}>
                    <Image source={Images.icSearch} style={[nstyles.nIcon22, { tintColor: colors.white }]} resizeMode='contain' />
                </TouchableOpacity>
            </LinearGradient>
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                {
                    selectBar ?
                        <View style={{ paddingTop: 50, flex: 1 }}>
                            {
                                keyWork.length > 0 && !refInput.current.isFocused() ?
                                    <Text style={{ padding: 10 }}>Kết quả tìm kiếm: <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{keyWork}</Text></Text>
                                    : null
                            }
                            {
                                data.length > 0 ? <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={{ paddingHorizontal: 10 }}>
                                    {data.map(renderItem)}
                                </ScrollView>
                                    : <ListEmpty textempty={'Không có dữ liệu'} styleContainer={{ justifyContent: 'flex-start' }} />
                            }
                        </View> :
                        <MapExtentions dataMap={data} AnhDaiDien={undefined} keyIdMarker={'Id'} />
                }

                <View style={stTimKiemTienIch.topBar}>
                    <TouchableOpacity onPress={() => setSelectBar(true)} style={stTimKiemTienIch.itemTopbar}>
                        <Image source={Images.icListExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: selectBar ? 'bold' : 'normal', marginLeft: 5, color: selectBar ? colorLinear.color[0] : null }}>Danh sách</Text>
                    </TouchableOpacity>
                    <View style={stTimKiemTienIch.rowBar} />
                    <TouchableOpacity onPress={() => setSelectBar(false)} style={stTimKiemTienIch.itemTopbar}>
                        <Image source={Images.icLocationExtention} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: !selectBar ? colorLinear.color[0] : null }]} />
                        <Text style={{ fontWeight: !selectBar ? 'bold' : 'normal', marginLeft: 5, color: !selectBar ? colorLinear.color[0] : null }}>Bản đồ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

const stTimKiemTienIch = StyleSheet.create({
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0,
        margin: 10, backgroundColor: colors.white,
        ...nstyles.shadow, borderRadius: 5
    },
    itemTopbar: {
        flex: 1, alignItems: 'flex-end',
        padding: 10, flexDirection: 'row', justifyContent: "center"
    },
    rowBar: {
        width: 0.5, backgroundColor: colors.grayLight,
        height: '70%'
    },
})

export default TimKiemTienIch
