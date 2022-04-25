import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { colors } from '../../../../styles'
import { heightStatusBar, nstyles, nwidth } from '../../../../styles/styles'
import ProfileApplied from './ProfileApplied'
import ProfileSaved from './ProfileSaved'
import * as Animatable from 'react-native-animatable'
import { reText } from '../../../../styles/size'
import ImageCus from '../../../../components/ImageCus'
import { ImagesSVL } from '../../images'
import HeaderSVL from '../../components/HeaderSVL'
import Utils from '../../../../app/Utils'



const index = () => {
    const [stateTabView, setStateTabView] = useState({
        index: 0,
        routes: [
            { key: 1, title: 'Đã lưu', },
            { key: 2, title: 'Hồ sơ tuyển dụng', },
        ]
    })

    const renderScene = (state) => {
        switch (state.route.key) {
            case 1:
                return <ProfileSaved route={state.route} />
            case 2:
                return <ProfileApplied route={state.route} />
            default:
                break;
        }
    }

    const onGoHome = () => {

    }

    const renderTabBar = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <TouchableOpacity onPress={onGoHome} style={{ padding: 10 }}>
                    <ImageCus source={ImagesSVL.icHome} style={nstyles.nIcon20} />
                </TouchableOpacity> */}
                {
                    stateTabView.routes.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index.toString()}
                                onPress={() => { setStateTabView({ ...stateTabView, index: index }) }}
                                style={{
                                    backgroundColor: colors.white,
                                    paddingVertical: 5, paddingHorizontal: 5, flex: 1
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{
                                        color: index == stateTabView.index ? colors.colorsSVL : colors.grayLight,
                                        textAlign: 'center', paddingVertical: 6,
                                        flex: 1, fontWeight: 'bold',
                                        fontSize: reText(16),
                                        fontWeight: index == stateTabView.index ? 'bold' : 'normal'
                                    }}>{item.title}</Text>
                                </View>
                                {
                                    index == stateTabView.index ?
                                        <Animatable.View animation={'bounceIn'} style={{ height: 2, width: '100%' }}>
                                            <View style={{ height: 1, backgroundColor: index == stateTabView.index ? colors.colorsSVL : colors.white, width: '100%', borderRadius: 10 }} />
                                        </Animatable.View>
                                        : null
                                }
                            </TouchableOpacity>)
                    })
                }
            </View>
        )
    }

    return (
        <View style={[stUngTuyen.container]}>
            <StatusBar barStyle='dark-content' />
            <HeaderSVL
                iconLeft={ImagesSVL.icHome}
                componentTitle={renderTabBar()}
                styleTitleRight={{ maxWidth: 0 }}
                onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
            />
            {/* {renderTabBar()} */}
            <View style={{ flex: 1 }}>
                <TabView
                    navigationState={stateTabView}
                    renderScene={renderScene}
                    renderTabBar={() => { return null }}
                    onIndexChange={index => setStateTabView({ ...stateTabView, index })}
                    initialLayout={{ width: nwidth() }}
                />
            </View>
        </View>
    )
}

const stUngTuyen = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white }
})

export default index
