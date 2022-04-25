import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import WebView from 'react-native-webview'
import Utils from '../../../app/Utils'
import { HeaderCus } from '../../../components'
import { colors } from '../../../styles'
import apis from '../../apis'
import { Images } from '../../images'

const DetailsTableau = (props) => {

    const [Data, setData] = useState({ isLoading: true })
    const [Item, setItem] = useState(Utils.ngetParam({ props: props }, 'item', {}))
    const [Source, setSource] = useState('')
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        GetDetails()
    }, [])

    const GetDetails = async () => {
        let res = await apis.ApiDashBoardIOC.GetDetailsTableau(Item?.id)
        console.log('[LOG] details', res)
        if (res.data) {
            setData(res.data)
        } else {
            setData({})
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <HeaderCus
                title={Item.title.toUpperCase()}
                styleTitle={{ color: colors.white }}
                iconLeft={Images.icBack}
                onPressLeft={() => { Utils.goback({ props: props }) }}
            />
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: 15 }}>
                {
                    Data.token && Data.token.length && Data.url && Data.url.length > 0 ?
                        <>
                            {Loading ? <Text style={{ padding: 10, backgroundColor: colors.white, width: '100%', textAlign: 'center' }}>{'Đang tải dữ liệu...'}</Text> : null}
                            <WebView
                                style={{ flex: 1 }}
                                onLoadEnd={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    setLoading(nativeEvent.loading);
                                }}
                                source={{
                                    uri: `${Data.url}/trusted/${Data.token}/views/${Item.viewName}?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link`,
                                }} />
                        </>
                        :
                        <Text style={{ padding: 10, backgroundColor: colors.white, width: '100%', textAlign: 'center' }}>{Data?.isLoading ? 'Đang tải, chờ cấu hình...' : 'Không có dữ liệu'}</Text>
                }

            </View>
        </View>
    )
}



export default DetailsTableau
