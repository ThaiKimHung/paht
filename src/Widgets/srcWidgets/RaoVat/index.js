import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ButtonWidget, HeaderWidget } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import Utils from '../../../../app/Utils'
import { colorsWidget, colors } from '../../../../styles/color'
import TinRaoVat from './TinRaoVat'
import DangTinRaoVat from './DangTinRaoVat'
import DaLuuRaoVat from './DaLuuRaoVat'
import { TabView } from 'react-native-tab-view'
import * as Animatable from 'react-native-animatable'
import TextApp from '../../../../components/TextApp'
import { reText } from '../../../../styles/size'
import { nwidth } from '../../../../styles/styles'

const RaoVat = (props) => {
    const [stateTabView, setStateTabView] = useState({
        index: 0,
        routes: [
            { key: 1, title: 'Tin rao vặt', },
            { key: 2, title: 'Đăng tin', },
            { key: 3, title: 'Đã lưu', },
        ]
    })
    const [textSearch, setTextSearch] = useState('')

    const renderScene = (state) => {
        switch (state.route.key) {
            case 1:
                return <TinRaoVat route={state.route} textSearch={textSearch} reloadSearch={() => setTextSearch('')} />
            case 2:
                return <DangTinRaoVat route={state.route} />
            case 3:
                return <DaLuuRaoVat route={state.route} />
            default:
                break;
        }
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
                                    <TextApp style={index == stateTabView.index ? stRaoVat.tabActive : stRaoVat.tabUnActive}>{item.title}</TextApp>
                                </View>
                                {
                                    index == stateTabView.index ?
                                        <Animatable.View animation={'bounceIn'} style={{ height: 2, width: '100%' }}>
                                            <View style={{ height: 1, backgroundColor: index == stateTabView.index ? colorsWidget.main : colors.white, width: '100%', borderRadius: 10 }} />
                                        </Animatable.View>
                                        : null
                                }
                            </TouchableOpacity>)
                    })
                }
            </View>
        )
    }

    const onBack = () => {
        Utils.goscreen({ props }, 'ManHinh_Home')
    }

    const goSearch = () => {
        Utils.navigate('scSearchRaoVat', {
            callback: (textSearch) => {
                setTextSearch(textSearch);
                setStateTabView({ ...stateTabView, index: 0 })
            }
        })
    }

    return (
        <View style={stRaoVat.container}>
            <StatusBar barStyle={'dark-content'} />
            <HeaderWidget
                title={'Rao vặt'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={onBack}
                iconRight={ImgWidget.icSearch}
                onPressRight={goSearch}
            />
            {renderTabBar()}
            <View style={stRaoVat.body}>
                <TabView
                    navigationState={stateTabView}
                    renderScene={renderScene}
                    renderTabBar={() => { return null }}
                    onIndexChange={index => setStateTabView({ ...stateTabView, index })}
                    initialLayout={{ width: nwidth() }}
                    lazy
                />
            </View>
        </View>
    )
}

const stRaoVat = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1
    },
    tabActive: {
        color: colorsWidget.main,
        textAlign: 'center', paddingVertical: 6,
        flex: 1, fontWeight: 'bold',
        fontSize: reText(16),
        fontWeight: 'bold'
    },
    tabUnActive: {
        color: colors.grayLight,
        textAlign: 'center', paddingVertical: 6,
        flex: 1, fontWeight: 'bold',
        fontSize: reText(16),
        fontWeight: 'normal'
    }
})

export default RaoVat