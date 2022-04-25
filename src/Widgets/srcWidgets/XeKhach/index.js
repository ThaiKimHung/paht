import { View, Text, ImageBackground, StyleSheet, FlatList, Image, TouchableOpacity, Platform, TextInput, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ButtonWidget, HeaderWidget } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import { heightStatusBar, nstyles, Width, } from '../../../../styles/styles';
import { colors, nstyles as nstyle } from '../../../../styles';
import { isPad, reText } from '../../../../styles/size';
import { colorsWidget } from '../../../../styles/color';
import ItemVertical from './ItemVertical';
import Utils from '../../../../app/Utils';
import TextApp from '../../../../components/TextApp';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ApiRaoVat, ApiXeKhanh } from '../../apis';
import { IsLoading, ListEmpty } from '../../../../components';





const XeKhach = ({ props }) => {
  const [dataXeKhach, setDataXeKhach] = useState({
    data: [],
    page: 1,
    AllPage: 1,
    refreshing: true,
    isLoading: false,
  })
  const [dataTinhThanh, setDataTinhThanh] = useState([])
  const [selectedTinhThanhDi, setSelectedTinhThanhDi] = useState('')
  const [selectedTinhThanhDen, setSelectedTinhThanhDen] = useState('')

  useEffect(() => {
    Get_Api();
    Get_TinhThanh();
  }, [])

  const Get_TinhThanh = async () => {
    let resTinh = await ApiRaoVat.GetAllListDMTinhThanh()
    if (resTinh?.status === 1 && resTinh.data)
      setDataTinhThanh(resTinh.data)
  }

  const Get_Api = async (page = 1) => {
    let res = await ApiXeKhanh.Get_ApiXeKhach({
      "query.more": false,
      "query.sortOrder": "asc",
      "query.sortField": "",
      "query.OrderBy": "",
      "query.page": page,
      "query.record": 10,
    })
    Utils.nlog('gia tri res', res)
    if (res?.status === 1 && res?.data) {
      setDataXeKhach({
        AllPage: res?.page?.AllPage,
        refreshing: false,
        isLoading: false,
        page: page,
        data: page === 1 ? res.data : dataXeKhach.data.concat(res.data)
      })
    }
    else {
      setDataXeKhach({
        page: 1,
        AllPage: 1,
        data: [],
        isLoading: false,
        refreshing: false,
      })
    }
  }
  const onRefresh = async () => {
    Utils.nlog('vao onresh')
    setDataXeKhach({
      ...dataXeKhach,
      refreshing: true,
    })
    await Get_Api();
  }

  const onLoad_More = async () => {
    const { page, AllPage, isLoading } = dataXeKhach
    Utils.nlog('vao load more')
    if (isLoading)
      return;
    if (page < AllPage && !isLoading) {
      setDataXeKhach({
        ...dataXeKhach,
        isLoading: true,
      })
      await Get_Api(page + 1)
    }
  }

  const Go_DSNhaXe = () => {
    Utils.navigate('scDsNhaXe', {
      dataFilter: {
        IDTinhThanhDi: selectedTinhThanhDi?.IDTinhThanh,
        IDTinhThanhDen: selectedTinhThanhDen?.IDTinhThanh,
      }
    })
  }
  const GoThongTinNhaXe = (Id = 0) => {
    Utils.nlog('gia tri id truyen  xuyen', Id)
    Utils.navigate('scThongTinNhaXe', { IdXe: Id })
  }
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ItemVertical item={item} keyItem={['TenNhaXe', 'SDT']} onPress={() => GoThongTinNhaXe(item?.IdNhaXe)} />
      )
    },
    [dataXeKhach.data],
  )

  const Go_Back = () => {
    Utils.navigate('ManHinh_Home');
  }
  const renderHeader = () => {
    return (
      <View style={stXeKhach.vHeader}
      >
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={Go_Back}
        >
          <Image source={ImgWidget.icBack} resizeMode={'contain'} style={[nstyles.nIcon20, { tintColor: colors.white }]} />
        </TouchableOpacity>
        <TextApp style={{ paddingRight: 20, fontSize: reText(18), fontWeight: 'bold', color: colors.white }} >Xe khách</TextApp>
        <View />
      </View>

    )
  }

  const viewItemList = (item, value, keyId, currentSelected) => {
    // Utils.nlog('Log [item]', item, value, keyId, currentSelected)
    return (
      <View key={item.id} style={{
        flex: 1,
        paddingVertical: 12,
        borderBottomColor: colors.black_50,
        backgroundColor: item[keyId] == currentSelected[keyId] ? colorsWidget.mainOpacity : 'white',
        paddingHorizontal: 10
      }}>
        <Text style={{ textAlign: 'left', color: item[keyId] == currentSelected[keyId] ? colorsWidget.main : colorsWidget.textDropdown, }} >{item[value] || ''}</Text>
      </View>
    )
  }

  const onPressChoose = (keyView = '', keyID, currentSelected, setState) => {
    Utils.navigate('Modal_ComponentSelectBottom', {
      callback: (val) => { setState(val) },
      "item": currentSelected || {},
      "title": '',
      "AllThaoTac": dataTinhThanh || [],
      "ViewItem": (item, currentSelected) => viewItemList(item, keyView, keyID, currentSelected),
      "Search": true,
      "key": keyView,
      "isWhiteHeader": true
    })
  }

  const renderContentHeader = () => {
    return (
      <View style={stXeKhach.vContentHeader} >
        <View style={{ alignItems: 'center', padding: 15 }} >
          <Image source={ImgWidget.icCrile} resizeMode={'contain'} style={nstyles.nIcon28} />
          <Image source={ImgWidget.icLine} resizeMode={'contain'} style={[nstyles.nIcon32, { marginVertical: 5 }]} />
          <Image source={ImgWidget.icArrow} resizeMode={'contain'} style={nstyles.nIcon28} />
        </View>
        <View style={{ flex: 1 }}  >
          <TouchableOpacity activeOpacity={0.5}
            style={[stXeKhach.vArrowDown, { marginBottom: 19 }]}
            onPress={() => {
              onPressChoose('TenTinhThanh', 'IDTinhThanh', selectedTinhThanhDi, setSelectedTinhThanhDi);
            }}
          >
            <Text style={{ flex: 1, color: colors.grayText }} >{selectedTinhThanhDi?.TenTinhThanh || 'Bạn đi từ'}</Text>
            <Image source={ImgWidget.icArrowDown} resizeMode='center' style={nstyles.nIcon20} />
          </TouchableOpacity>
          <View style={{
            borderBottomWidth: 0.8,
            borderBottomColor: colorsWidget.lineGray,
          }} />
          <TouchableOpacity activeOpacity={0.5}
            onPress={() => {
              onPressChoose('TenTinhThanh', 'IDTinhThanh', selectedTinhThanhDen, setSelectedTinhThanhDen);
            }}
            style={[stXeKhach.vArrowDown, { marginTop: 19 }]} >
            <Text style={{ flex: 1, color: colors.grayText }} >{selectedTinhThanhDen?.TenTinhThanh || 'Nơi bạn đến'}</Text>
            <Image source={ImgWidget.icArrowDown} resizeMode='center' style={nstyles.nIcon20} />
          </TouchableOpacity>
        </View>
        <IsLoading />
      </View>
    )
  }
  const Go_ScreenTimXe = () => {
    if (selectedTinhThanhDi && selectedTinhThanhDen) {
      Utils.navigate('scTimXe', {
        dataFilter: {
          TinhThanhDi: selectedTinhThanhDi,
          TinhThanhDen: selectedTinhThanhDen,
          dataTinhThanh: dataTinhThanh
        }
      })
    }
    else {
      Utils.showMsgBoxOK({ props }, 'Thông báo', 'Bạn chưa nhập đủ địa điểm đi và đến')
      return;
    }
  }
  Utils.nlog('gia tri data state', dataXeKhach)
  return (
    <View style={stXeKhach.container} >
      <ImageBackground source={ImgWidget.imgbackGroudXeKhach} style={stXeKhach.imgBackGround} resizeMode='stretch' >
        {/* {render header } */}
        {renderHeader()}
        {/* {render contentheader } */}
        {renderContentHeader()}
        <ButtonWidget
          text='Tìm xe'
          style={{ margin: 15, marginTop: 0, borderRadius: 10 }}
          onPress={Go_ScreenTimXe}
        />
        <View style={{ height: 5, backgroundColor: colors.BackgroundHome }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20 }} >
          <TextApp style={{ fontWeight: 'bold' }} >Danh sách nhà xe</TextApp>
          <TouchableOpacity activeOpacity={0.5} onPress={Go_DSNhaXe} >
            <TextApp style={{ color: colorsWidget.main }} >Tất cả >></TextApp>
          </TouchableOpacity>
        </View>
        <FlatList
          onRefresh={onRefresh}
          refreshing={dataXeKhach.refreshing}
          data={dataXeKhach.data}
          contentContainerStyle={{ paddingBottom: getBottomSpace() + 30 }}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          initialNumToRender={5} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoad_More}
          ListFooterComponent={() => dataXeKhach.isLoading ? <ActivityIndicator color={colorsWidget.main} size={'small'} /> : null}
          ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
        />
      </ImageBackground >
    </View >
  )
}



const stXeKhach = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackGround: {

    width: '100%',
    height: '100%',
  },
  vHeader: {
    justifyContent: 'space-between',
    paddingTop: Platform.OS == 'android' ? nstyle.paddingTopMul() + heightStatusBar() : nstyle.paddingTopMul(),
    flexDirection: 'row',
    alignItems: 'center'
  },
  vArrowDown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  vContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6, backgroundColor: colors.white,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  }
})

export default XeKhach