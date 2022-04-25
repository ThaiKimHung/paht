import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonWidget, HeaderWidget, EmptyWidgets } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadListRaoVatCaNhan,
  setDataTaoSuaTinRaoVat,
  setRefreshingRaoVatCaNhan,
  setPageRaoVatCaNhan,
  setDataRaoVatCaNhan,
  deleteTinRaoVatCaNhan,
  setTrangThaiHienThiItem,
  setTrangThaiTinItem
} from '../../../../srcRedux/actions/widgets'
import ItemRaoVat from './ItemRaoVat'
import { ApiRaoVat } from '../../apis'
import { ACTION_DANGTIN, KEY_ACTION_DANGTIN } from '../../CommonWidgets'


const DangTinRaoVat = (props) => {
  const {
    dataTaoSuaTinRaoVat,
    LstRaoVatCaNhan = [],
    RefreshingRaoVatCaNhan = true,
    PageRaoVatCaNhan = { Page: 1, AllPage: 1 },
  } = useSelector(state => state.Widgets)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadListRaoVatCaNhan())
  }, [])

  const taoTinRaoVat = () => {
    dispatch(setDataTaoSuaTinRaoVat({}))
    Utils.goscreen({ props }, 'scDangTin')
  }

  const onPressOption = (item) => {
    let arrAction = []
    for (let i = 0; i < ACTION_DANGTIN.length; i++) {
      const e = ACTION_DANGTIN[i];
      if (e?.valueAPI != item?.TrangThaiHienThi) {
        arrAction.push(e)
      }
    }
    if (item?.TrangThaiTin == true) {
      arrAction = arrAction.filter(e => e.key != KEY_ACTION_DANGTIN.DANGTIN)
    }
    if (item?.TrangThaiDuyet == 2) {
      arrAction = arrAction.filter(e => e.key != KEY_ACTION_DANGTIN.SUA)
    }
    Utils.navigate('Modal_TuyChon', {
      DataMenu: arrAction,
      callback: (action) => callBackAction(action, item)
    })
  }

  const callBackAction = async (action, item) => {
    switch (action.key) {
      case KEY_ACTION_DANGTIN.XOA:
        Utils.showMsgBoxYesNo({ props }, 'Thông báo', 'Bạn có chắc muốn xoá tin này?', 'Xoá', 'Xem lại', async () => {
          let res = await ApiRaoVat.Delete_TinRaoVat(item?.IdTinRaoVat)
          if (res.status === 1) {
            Utils.showToastMsg('Thông báo', 'Xoá tin thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
            // set lại redux
            dispatch(deleteTinRaoVatCaNhan(item))
          } else {
            Utils.showToastMsg('Thông báo', 'Xoá tin thất bại. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info)
          }
        })
        break;
      case KEY_ACTION_DANGTIN.SUA: {
        Utils.setToggleLoading(true)
        let res = await ApiRaoVat.Info_TinRaoVat(item?.IdTinRaoVat, false)
        Utils.setToggleLoading(false)
        if (res.status === 1) {
          // Cách gọi khi muốn edit 1 tin truyền data và isEdit : true vào redux
          let dataEdit = {
            ...res?.data,
            isEdit: true,
            PhoneNumber: res?.data?.SDTLienHe || res?.data?.InfoUser?.PhoneNumber || '',
            FullName: res?.data?.NguoiLienHe || res?.data?.InfoUser?.FullName || '',
          }
          dispatch(setDataTaoSuaTinRaoVat(dataEdit))
          Utils.goscreen({ props }, 'scDangTin')
        } else {
          Utils.showToastMsg('Thông báo', 'Không tải được dữ liệu chỉnh sửa. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info)
        }
      }
        break;
      case KEY_ACTION_DANGTIN.ANTIN:
        onHandlerTrangThaiHienThi(KEY_ACTION_DANGTIN.ANTIN, item)
        break;
      case KEY_ACTION_DANGTIN.HIENTHI:
        onHandlerTrangThaiHienThi(KEY_ACTION_DANGTIN.HIENTHI, item)
        break;
      case KEY_ACTION_DANGTIN.HETHANG:
        onHandlerTrangThaiHienThi(KEY_ACTION_DANGTIN.HETHANG, item)
        break;
      case KEY_ACTION_DANGTIN.DANGTIN: {
        let res = await ApiRaoVat.DangTinTinRaoVat(item?.IdTinRaoVat)
        console.log('[LOG] res dang tin', res)
        if (res.status === 1) {
          //call redux
          dispatch(setTrangThaiTinItem(item))
          Utils.showToastMsg('Thông báo', 'Đăng tin thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
        } else {
          Utils.showToastMsg('Thông báo', 'Không tải được dữ liệu chỉnh sửa. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info)
        }
      }
        break;
      default:
        break;
    }
  }

  const onHandlerTrangThaiHienThi = async (key, data) => {
    var formdata = new FormData();
    formdata.append("IdTinRaoVat", data?.IdTinRaoVat);
    let findAction = ACTION_DANGTIN.find(e => e.key == key)
    switch (key) {
      case KEY_ACTION_DANGTIN.ANTIN:
        formdata.append("TrangThaiHienThi", findAction.valueAPI);
        break;
      case KEY_ACTION_DANGTIN.HIENTHI:
        formdata.append("TrangThaiHienThi", findAction.valueAPI);
        break;
      case KEY_ACTION_DANGTIN.HETHANG:
        formdata.append("TrangThaiHienThi", findAction.valueAPI);
        break;
    }
    console.log('[LOG] form data action button', formdata)
    let res = await ApiRaoVat.CapNhatTrangThaiHienThi(formdata)
    console.log('[LOG]res form data action button', res)
    if (res.status == 1) {
      //Call redux
      dispatch(setTrangThaiHienThiItem(data, key))
      Utils.showToastMsg('Thông báo',
        `Đã cập nhật trạng thái hiện thị tin thành: ${findAction.name.toLowerCase()} `,
        icon_typeToast.success, 2000, icon_typeToast.success)
    } else {
      Utils.showToastMsg('Thông báo', 'Đã xảy ra lỗi. Thử lại sau!', icon_typeToast.warning, 2000)
    }
  }

  const onGoDetails = (item) => {
    Utils.navigate('scChiTietTinRaoVat', { IdTinRaoVat: item?.IdTinRaoVat })
  }

  const renderItem = ({ item, index }) => {
    return (
      <ItemRaoVat
        dataItem={item}
        onPress={() => onGoDetails(item)}
        onPressOption={() => onPressOption(item)}
        isPersonal
        showTrangThaiDuyet
        showTrangThaiTin
        showTrangThaiHienThi
      />
    )
  }

  const onRefresh = () => {
    dispatch(setPageRaoVatCaNhan({ Page: 1, AllPage: 1 }))
    dispatch(setRefreshingRaoVatCaNhan(true))
    dispatch(setDataRaoVatCaNhan([]))
    dispatch(loadListRaoVatCaNhan())
  }

  const _ListFooterComponent = () => {
    return PageRaoVatCaNhan.Page < PageRaoVatCaNhan.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
  }

  const loadMore = async () => {
    if (PageRaoVatCaNhan.Page < PageRaoVatCaNhan.AllPage) {
      dispatch(loadListRaoVatCaNhan(true))
    }
  }

  const renderListPersonal = () => {
    return (
      <FlatList
        data={LstRaoVatCaNhan}
        contentContainerStyle={{ paddingHorizontal: 15, flex: LstRaoVatCaNhan.length == 0 ? 1 : null }}
        extraData={index => `dangtincanha-${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshing={RefreshingRaoVatCaNhan}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_ListFooterComponent}
        ListEmptyComponent={<EmptyWidgets style={{ flex: 1 }} textEmpty={RefreshingRaoVatCaNhan ? 'Đang tải...' : 'Không có dữ liệu'} />}

      />
    )
  }

  return (
    <View style={stDangTinRaoVat.container}>
      {/* {Danh sách bài đăng} */}
      <View style={{ flex: 1 }}>
        {renderListPersonal()}
      </View>
      {/* {Button dang tin} */}
      <View style={stDangTinRaoVat.footer}>
        <ButtonWidget
          text='Tạo tin rao vặt'
          onPress={taoTinRaoVat}
        />
      </View>
    </View>
  )
}

const stDangTinRaoVat = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10
  },
  body: {
    flex: 1
  },
  footer: {
    paddingBottom: 24, paddingHorizontal: 15, paddingTop: 10
  }
})

export default DangTinRaoVat