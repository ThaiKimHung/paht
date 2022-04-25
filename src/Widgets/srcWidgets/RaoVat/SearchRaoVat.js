import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { EmptyWidgets, InputWidget } from '../../CompWidgets'
import { heightHed, heightStatusBar, nstyles, paddingTopMul } from '../../../../styles/styles'
import { ImgWidget } from '../../Assets'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { deleteKeyTimKiem, saveKeyTimKiem } from '../../../../srcRedux/actions/widgets'
import TextApp from '../../../../components/TextApp'
import { Images } from '../../../images'
import { colorsWidget, colors } from '../../../../styles/color'

const SearchRaoVat = (props) => {
  const dispatch = useDispatch();
  const { LstTimKiemGanDay = [] } = useSelector(state => state.Widgets)
  const [textSearch, setTextSearch] = useState('')
  const callback = Utils.ngetParam({ props }, 'callback', () => { })
  const refSearch = useRef()

  useEffect(() => {
    refSearch?.current?.focus();
  }, [])

  const onSearch = () => {
    if (textSearch) {
      Utils.goback({ props })
      dispatch(saveKeyTimKiem(textSearch))
      callback(textSearch)
    } else {
      Utils.showToastMsg('Thông báo', 'Từ khoá không được phép rỗng!', icon_typeToast.info, 1000, icon_typeToast.info)
    }
  }

  const onSearchBack = (text) => {
    Utils.goback({ props })
    callback(text)
  }

  const onDeleteSearch = (item) => {
    dispatch(deleteKeyTimKiem(item))
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => onSearchBack(item)} style={{
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', padding: 12, backgroundColor: colorsWidget.grayDropdown
      }}>
        <TextApp style={{ flex: 1, fontStyle: 'italic' }} numberOfLines={1}>{item}</TextApp>
        <TouchableOpacity onPress={() => onDeleteSearch(item)} style={{ paddingLeft: 10 }}>
          <Image source={Images.icCloseBlack} style={[nstyles.nIcon16, {}]} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <View style={stSearchRaoVat.container}>
      <View style={stSearchRaoVat.viewSearch}>
        <TouchableOpacity onPress={() => { Utils.goback({ props }) }} style={{ paddingRight: 15 }}>
          <Image source={ImgWidget.icBack} style={[nstyles.nIcon20, {}]} resizeMode='contain' />
        </TouchableOpacity>
        <InputWidget
          refInput={refSearch}
          label=''
          placeholder={'Nhập từ khoá tìm kiếm...'}
          returnKeyType='search'
          onSubmitEditing={onSearch}
          onChangeText={val => setTextSearch(val)}
          style={{ flex: 1 }}
          styleInput={{ flex: 1, paddingVertical: 10 }}
        />
        <TouchableOpacity onPress={onSearch} style={{ paddingHorizontal: 10 }}>
          <Image source={ImgWidget.icSearch} resizeMode='contain' style={nstyles.nIcon22} />
        </TouchableOpacity>
      </View>
      <View style={stSearchRaoVat.body}>
        <TextApp style={{ padding: 13, color: colorsWidget.placeholderInput, fontStyle: 'italic' }}>{`Từ khoá tìm kiếm gần đây`}</TextApp>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{}}
          data={LstTimKiemGanDay}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyWidgets
            style={{ flex: 1, marginTop: 50 }}
            textEmpty={'Không có từ khoá nào tìm kiếm gần đây. Hãy nhập từ khoá để tìm kiếm!'}
          />}
          ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 13 }} />}
        />
      </View>

    </View>
  )
}

const stSearchRaoVat = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    flex: 1
  },
  viewSearch: {
    height: (Platform.OS == 'android' ? heightHed() + heightStatusBar() : heightHed()),
    paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(),
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export default SearchRaoVat