// import { View, Text } from 'react-native'
// import React from 'react'

// const ThueNha = (props) => {
//   return (
//     <View>
//       <Text>ThueNha</Text>
//     </View>
//   )
// }

// export default ThueNha

import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ButtonWidget, HeaderWidget } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import Utils from '../../../../app/Utils'
import { colorsWidget, colors } from '../../../../styles/color'
import TinThueNha from './TinThueNha'
import ThueNhaCaNhan from './ThueNhaCaNhan'
import { TabView } from 'react-native-tab-view'
import * as Animatable from 'react-native-animatable'
import TextApp from '../../../../components/TextApp'
import { reText } from '../../../../styles/size'
import { nwidth } from '../../../../styles/styles'
import DaLuuThueNha from './DaLuuThueNha'

const ThueNha = (props) => {
  const [stateTabView, setStateTabView] = useState({
    index: 0,
    routes: [
      { key: 1, title: 'Tin thuê nhà', },
      { key: 2, title: 'Đăng tin', },
      { key: 3, title: 'Đã lưu', },
    ]
  })
  const [textSearch, setTextSearch] = useState('')

  const renderScene = (state) => {
    switch (state.route.key) {
      case 1:
        return <TinThueNha route={state.route} textSearch={textSearch} reloadSearch={() => setTextSearch('')} />
      case 2:
        return <ThueNhaCaNhan route={state.route} />
      case 3:
        return <DaLuuThueNha route={state.route} />
      default:
        break;
    }
  }

  const goSearch = () => {
    Utils.navigate('scSearchThueNha', {
      callback: (textSearch) => {
        setTextSearch(textSearch);
        setStateTabView({ ...stateTabView, index: 0 })
      }
    })
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

  return (
    <View style={stRaoVat.container}>
      <StatusBar barStyle={'dark-content'} />
      <HeaderWidget
        title={'Thuê nhà'}
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

export default ThueNha