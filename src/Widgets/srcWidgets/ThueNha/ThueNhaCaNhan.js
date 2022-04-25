import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonWidget, HeaderWidget, EmptyWidgets } from '../../CompWidgets'
import { ImgWidget } from '../../Assets'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadListTinThueNhaCaNhan,
  setDataTaoSuaTinThueNha,
  setRefreshingTinThueNhaCaNhan,
  setPageTinThueNhaCaNhan,
  setDataTinThueNhaCaNhan,
  deleteTinRaoVatCaNhan,
  deleteTinThueNhaCaNhan,
  setTrangThaiTinThueNha
} from '../../../../srcRedux/actions/widgets'
import ItemThueNha from './ItemThueNha'
import { ActivityIndicator } from '../../../sourceIOC/Components/Kit'
import { ACTION_DANGTIN, ACTION_DANGTIN_THUENHA, KEY_ACTION_DANGTIN_THUENHA } from '../../CommonWidgets'
import { ApiThueNha } from '../../apis'

const ThueNhaCaNhan = (props) => {
  const {
    dataTaoSuaTinThueNha,
    LstTinThueNhaCaNhan = [],
    RefreshingTinThueNhaCaNhan = true,
    PageTinThueNhaCaNhan = { Page: 1, AllPage: 1 },
  } = useSelector(state => state.Widgets)
  const dispatch = useDispatch()

  useEffect(() => {
    onRefresh()
  }, [])

  const taoTinThueNhaCaNhan = () => {
    dispatch(setDataTaoSuaTinThueNha({ ...dataTaoSuaTinThueNha, isEdit: true })) // Cách gọi khi muốn edit 1 tin truyền data và isEdit : true vào redux
    Utils.goscreen({ props }, 'scDangTinThueNha')
  }

  const onPressOption = (item) => {
    let arrAction = ACTION_DANGTIN_THUENHA

    if (item?.IsDuyet != 0) {
      arrAction = arrAction.filter(e => e.key != KEY_ACTION_DANGTIN_THUENHA.SUA)
    }
    if (item?.IsHienThi) {
      arrAction = arrAction.filter(e => e.key != KEY_ACTION_DANGTIN_THUENHA.HIENTHI)
    } else {
      arrAction = arrAction.filter(e => e.key != KEY_ACTION_DANGTIN_THUENHA.ANTIN)
    }
    Utils.navigate('Modal_TuyChon', {
      DataMenu: arrAction,
      callback: (action) => callBackAction(action, item)
    })
  }

  const callBackAction = async (action, item) => {
    switch (action.key) {
      case KEY_ACTION_DANGTIN_THUENHA.XOA:
        Utils.showMsgBoxYesNo({ props }, 'Thông báo', 'Bạn có chắc muốn xoá tin này?', 'Xoá', 'Xem lại', async () => {
          let res = await ApiThueNha.Delete_TinThueNha(item?.Id)
          console.log('[LOG] xoa tin thue nha', res);
          if (res.status === 1) {
            Utils.showToastMsg('Thông báo', 'Xoá tin thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
            // set lại redux
            dispatch(deleteTinThueNhaCaNhan(item))
          } else {
            Utils.showToastMsg('Thông báo', 'Xoá tin thất bại. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info)
          }
        })
        break;
      case KEY_ACTION_DANGTIN_THUENHA.SUA:
        {
          Utils.setToggleLoading(true)
          let res = await ApiThueNha.GetTinThueNhaById(item?.Id)
          Utils.setToggleLoading(false)
          console.log('[LOG] info tin thue nha', res)
          if (res.status == 1 && res?.data) {
            const { data } = res
            const arrDiaChi = data?.DiaChi ? data?.DiaChi?.split('_') : ['']
            const DiaChi = arrDiaChi[0]
            const DiaDiemMap = arrDiaChi?.length == 2 ? arrDiaChi[1] : ''
            let dataEdit = {
              ...data,
              isEdit: true,
              PhoneNumber: data?.SDTLienHe || '',
              FullName: data?.NguoiLienHe || '',
              IdTinhThanh: data?.TinhThanh,
              IdPhuongXa: data?.PhuongXa,
              IdQuanHuyen: data?.QuanHuyen,
              TieuDe: data?.TieuDe,
              IdLoaiNha: data?.LoaiNha,
              LoaiNha: data?.TenLoai,
              Gia: data?.Gia || 0,
              IdThoiGianThue: data?.ThoiGianThue,
              ThoiGianThueNha: data?.TenThoiGianThue,
              DienTich: data?.DienTich,
              DiaChi: DiaChi,
              DiaDiemMap: DiaDiemMap,
              MoTaSanPham: data?.MoTa,
              Lat: data?.Lat,
              Lng: data?.Long
            }
            console.log('DATA EDIT', dataEdit)
            dispatch(setDataTaoSuaTinThueNha(dataEdit))
            Utils.goscreen({ props }, 'scDangTinThueNha')
          } else {
            Utils.showToastMsg('Thông báo', 'Không tải được dữ liệu chỉnh sửa. Thử lại sau!', icon_typeToast.info, 2000, icon_typeToast.info)
          }
        }
        break;
      case KEY_ACTION_DANGTIN_THUENHA.ANTIN:
        {
          AnHienTinThueNha(item, true)
        }
        break;
      case KEY_ACTION_DANGTIN_THUENHA.HIENTHI:
        {
          AnHienTinThueNha(item, false)
        }
        break;

      default:
        break;
    }
  }

  const AnHienTinThueNha = async (item, show = false) => {
    Utils.setToggleLoading(true)
    let res = await ApiThueNha.HienThi_TinThueNha(item?.Id, show)
    Utils.setToggleLoading(false)
    console.log('[LOG] an tin thue nha', res)
    if (res.status == 1) {
      Utils.showToastMsg('Thông báo', `${show ? 'Hiển thị' : 'Ẩn'} tin thành công.`, icon_typeToast.success, 2000, icon_typeToast.success)
      //call redux set lai trang thai
      dispatch(setTrangThaiTinThueNha(item, !show))
    } else {
      Utils.showToastMsg('Thông báo', `${show ? 'Hiển thị' : 'Ẩn'} tin thất bại.`, icon_typeToast.danger, 2000, icon_typeToast.danger)
    }
  }

  const onGoDetails = (item) => {
    Utils.navigate('scChiTietTinThueNha', { IdThueNha: item?.Id })
  }

  const renderItem = ({ item, index }) => {
    return (
      <ItemThueNha
        dataItem={item}
        onPress={() => onGoDetails(item)}
        onPressOption={() => onPressOption(item)}
        isPersonal
      />
    )
  }

  const onRefresh = () => {
    dispatch(setPageTinThueNhaCaNhan({ Page: 1, AllPage: 1 }))
    dispatch(setRefreshingTinThueNhaCaNhan(true))
    dispatch(setDataTinThueNhaCaNhan([]))
    dispatch(loadListTinThueNhaCaNhan())
  }

  const _ListFooterComponent = () => {
    return PageTinThueNhaCaNhan.Page < PageTinThueNhaCaNhan.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
  }

  const loadMore = async () => {
    if (PageTinThueNhaCaNhan.Page < PageTinThueNhaCaNhan.AllPage) {
      dispatch(loadListTinThueNhaCaNhan(true))
    }
  }

  const renderListPersonal = () => {
    return (
      <FlatList
        data={LstTinThueNhaCaNhan}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        extraData={index => `dangtinthuenhacanhan-${index}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshing={RefreshingTinThueNhaCaNhan}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_ListFooterComponent}
        ListEmptyComponent={<EmptyWidgets style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingTinThueNhaCaNhan ? 'Đang tải...' : 'Không có dữ liệu'} />}

      />
    )
  }

  return (
    <View style={stThueNhaCaNhan.container}>
      {/* {Danh sách bài đăng} */}
      <View style={{ flex: 1 }}>
        {renderListPersonal()}
      </View>
      {/* {Button dang tin} */}
      <View style={stThueNhaCaNhan.footer}>
        <ButtonWidget
          text='Tạo mới'
          onPress={taoTinThueNhaCaNhan}
        />
      </View>
    </View>
  )
}

const stThueNhaCaNhan = StyleSheet.create({
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

export default ThueNhaCaNhan