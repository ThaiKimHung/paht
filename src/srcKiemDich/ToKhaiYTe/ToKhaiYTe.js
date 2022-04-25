import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler } from 'react-native'
import { colors } from '../../../styles';
import ComponentItem, { TYPES } from '../../screens/user/dangky/Component';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { ButtonCom, HeaderCus } from '../../../components';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { Images } from '../../images';
import FontSize from '../../../styles/FontSize';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getCurrentPosition } from './hook';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ImgComp } from '../../../components/ImagesComponent';
import { reText } from '../../../styles/size';
import ThongTinChungRender from '../../screens/user/dangky/ThongTinChungRender';
import ThongTinDiaChi from '../../screens/user/dangky/ThongTinDiaChi';
import ListCauHoi from './component/ListCauHoi';
const listGT = [
  {
    id: 1,
    name: "Có"
  },
  {
    id: 0,
    name: "Không"
  }
]
const listCom = [
  {

    id: 2,
    name: 'Họ và tên',
    type: TYPES.TextInput,
    check: true,
    key: 'hoten',
    placehoder: 'Nhập họ và tên',
    errorText: '',
    helpText: '',
    checkNull: true,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(20)
    }
  },
  {

    id: 3,
    name: 'Số diện thoại',
    type: TYPES.TextInput,
    check: true,
    key: 'sodienthoai',
    placehoder: 'Nhập số điện thoại',
    errorText: '',
    helpText: '',
    keyboardType: 'phone-pad',
    checkNull: true,
    styleBodyInputCus: {
      borderColor: colors.grayLight,
      borderRadius: 7,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(20)
    }

  },
  {
    id: 1,
    name: 'Địa chỉ ',
    type: TYPES.Title,
    check: false,
    key: 'ttcn',
  },
  {
    id: 8,
    name: 'Huyện',
    type: TYPES.Children,
    check: false,
  },
]
const listComDiaChi = [
  {
    id: 1,
    name: 'Tỉnh/Thành phố',
    type: TYPES.DropDown,
    check: false,
    key: 'tinh',
    placehoder: '- Chọn tỉnh/thành -',
    errorText: '',
    helpText: '',
    isRow: false,
    isEnd: false,
    keyView: 'TenTinhThanh',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(20)
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true
  },
  {
    id: 5,
    name: 'Huyện',
    type: TYPES.DropDown,
    check: false,
    key: 'huyen',
    placehoder: '- Chọn quận/huyện -',
    errorText: '',
    helpText: '',
    isRow: false,
    isEnd: false,
    keyView: 'TenQuanHuyen',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(20)
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true
  },
  {
    id: 5,
    name: 'Xã',
    type: TYPES.DropDown,
    check: true,
    key: 'IdDonVi',
    placehoder: '- Chọn xã/phường -',
    errorText: '',
    helpText: '',
    isRow: false,
    isEnd: false,
    keyView: 'TenXaPhuong',
    styleBodyInputCus: {
      borderColor: colors.turquoiseBlue_10,
      borderRadius: 7,
      backgroundColor: colors.colorPaleGrey,
    },
    styleLabelCus: {
      fontSize: FontSize.reText(20)
    },
    prefixlabelCus: {
      tintColor: colors.cobaltBlue,
    },
    checkNull: true
  },
]
const itemGhiChu = {
  id: 2,
  name: 'Địa chỉ',
  type: TYPES.TextInput,
  check: true,
  key: 'DiaChi',
  placehoder: 'Nhập địa chỉ',
  errorText: '',
  helpText: '',
  multiline: true,
  numberOfLines: 3,
  styleBodyInputCus: {
    borderColor: colors.grayLight,
    borderRadius: 7,
  },
  styleLabelCus: {
    fontSize: FontSize.reText(15),
    fontWeight: '400'
  }
}
const ToKhaiYTe = (props) => {
  const [ID, setID] = useState(Utils.ngetParam({ props }, "ID", ''))
  const { userCD, tokenCD, userTNSmart = {} } = useSelector(state => state.auth);
  const { CachLy } = userCD || {}
  const refTTCaNhan = useRef(null);
  const refTTDiaChi = useRef(null);
  const refTTCauHoi = useRef(null);
  const [IsKhaiHo, setIsKhaiHo] = useState(false);
  const [Location, setLocation] = useState('');
  const [dataImage, setdataImage] = useState('');
  const [GhiChu, setGhiChu] = useState('');
  const [DiaChi, setDiaChi] = useState(userCD?.DiaChi || '')
  const refImagePicker = useRef(null);
  const [CurrentLocationText, setCurrentLocationText] = useState('')

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => {
      try {
        BackHandler.removeEventListener('hardwareBackPress', backAction)
      } catch (error) {

      }
    }
  }, [backAction])

  const backAction = () => {
    Utils.goback({ props: props })
    return true
  }

  const onPressSubmid = async () => {
    let objectTTCN = refTTCaNhan.current.getData();
    let objectTTDC = refTTDiaChi.current.getData();
    let objectTTCH = refTTCauHoi.current.getData();
    Utils.nlog("data câu hoi-----", objectTTCN, objectTTDC, objectTTCH)
    if (!tokenCD) {
      Utils.showToastMsg("Thông báo", "Vui lòng đăng nhập ", icon_typeToast.warning);
      return;
    }
    Utils.nlog("res data-------[TH2]", objectTTCN, objectTTDC, Location, userCD);
    for (const element of listCom) {
      if (element["checkNull"] == true && !objectTTCN[element['key']]) {
        Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin cá nhân", icon_typeToast.warning);
        return;
      }
    }
    for (const element of listComDiaChi) {
      if (element["checkNull"] == true && !objectTTDC[element['key']]) {
        Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin địa chỉ", icon_typeToast.warning);
        return;
      }
    }
    if (!Location) {
      Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra và bật vị trí để thực hiện khai báo", icon_typeToast.warning);
      return;
    }
    const body = {
      "LstTraLoi": objectTTCH,
      "IsKhaiBaoHo": IsKhaiHo ? true : false,
      "HoTen": objectTTCN.hoten || '',
      "PhoneNumber": objectTTCN.sodienthoai || '',
      "DiaChi": DiaChi || '',
      "IdThanhPho": objectTTDC?.tinh?.IDTinhThanh || '',
      "IdQuanHuyen": objectTTDC?.huyen?.IDQuanHuyen || '',
      "IdPhuongXa": objectTTDC?.IdDonVi?.IdPhuongXa || '',
      "Lat": Location?.latitude || '',
      "Long": Location?.longitude || '',
      "LoaiKhaiBao": 1
    }

    Utils.nlog("body", body)
    Utils.setToggleLoading(true);
    let res = await apis.ApiHCM.Confirm_KhaiBaoYTe(body)
    Utils.nlog("res", res)
    Utils.setToggleLoading(false);
    if (res.status == 1) {
      Utils.showToastMsg("Thông báo", "Thực hiện thành công", icon_typeToast.success);
    } else {
      Utils.showToastMsg("Thông báo", res?.data?.message || "Thực hiện thất bại", icon_typeToast.warning);
    }


  }
  const getLocation = async () => {
    const { latitude = '', longitude = '' } = Location
    let res = await apis.ApiApp.getAddressGG(latitude, longitude);
    Utils.nlog("[res dia chỉ]", res)
    if (res && res.full_address) {
      setCurrentLocationText(res.full_address)
    } else {
      setCurrentLocationText(res.latitude + ', ' + res.longitude)
    }
  }
  useEffect(() => {
    if (Location) {
      getLocation()
    }

  }, [Location])
  useEffect(() => {
    getCurrentPosition({ props }, setLocation)
  }, [])
  const onResponse = (item) => {
    Utils.nlog("item", item);
    setdataImage(item);
  }
  const prevMedia = (suri) => {
    Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: dataImage.uri }], index: 0 });
  }
  const renderChossImage = () => {
    return <View style={{
      paddingHorizontal: FontSize.scale(10)
    }}>
      <TouchableOpacity underlayColor={colors.backgroundModal}
        onPress={
          () => {
            Utils.goscreen(this, 'ModalCamVideoCus', { onResponse: onResponse, showLeft: false, OptionsCam: 1, "typeCamera": 2 })
          }
        } style={{
          minHeight: 40,
          alignItems: 'center',
          justifyContent: 'center', flex: 1,
          backgroundColor: 'rgba(239,235,224,1)',
          borderRadius: 5, paddingVertical: 0, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.colorBlueLight,
          marginTop: 20

        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingHorizontal: 10 }}>
            <Image resizeMode='contain'
              source={ImgComp.icChoseImage}
              style={{ width: 25, height: 25, }}></Image>
          </View>

          <Text style={{ color: colors.coral, fontSize: reText(12), alignSelf: 'center', fontWeight: 'bold', flex: 1, paddingLeft: 10 }} > {`Ảnh chân dung tự chụp. (Ảnh phải rõ ràng, không ngược sáng, không quá tối...)`}</Text>
        </View>
      </TouchableOpacity>
      {dataImage ? <TouchableOpacity onPress={prevMedia}>
        <Image resizeMode='contain'
          source={{ uri: dataImage.uri || '' }}
          style={{ width: 100, height: 100, marginTop: 10 }}></Image>
      </TouchableOpacity> : null}
    </View>
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <HeaderCus
        Sleft={{ tintColor: 'white' }}
        onPressLeft={() => Utils.goback({ props })}
        iconLeft={Images.icBack}
        title={`Khai báo y tế`}
        styleTitle={{ color: colors.white }}
      />
      <View style={customStyles.containerBody}>
        <KeyboardAwareScrollView style={{ backgroundColor: colors.white }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingVertical: FontSize.reText(10), }}>
            <Text style={customStyles.title}>{'khai báo y tế'.toLocaleUpperCase()}</Text>
          </View>
          {/* <View style={{ paddingHorizontal: FontSize.scale(10) }}>
            <Text style={{
              paddingRight: FontSize.scale(10),
              fontSize: FontSize.reText(18), fontWeight: 'bold', paddingVertical: 10, color: colors.redStar,
              textAlign: 'center'
            }}>
              {`Khuyến cáo: phần dành riêng cho người tự cách ly y tế tại nhà, những người không có trách nhiệm hoặc khai báo thông tin sai là vi phạm pháp luật Việt Nam và có thể xử lý hình sự`}
            </Text>
          </View> */}
          <TouchableOpacity onPress={() => {
            setIsKhaiHo(!IsKhaiHo)
          }} style={customStyles.contentKhaiHo}>
            <Image
              source={IsKhaiHo ? Images.icCheck : Images.icUnCheck}
              resizeMode="contain"
              style={customStyles.icKhaiHo}
            />
            <Text style={customStyles.textKH}>{`Khai hộ`}</Text>

          </TouchableOpacity>
          <View pointerEvents={IsKhaiHo ? 'auto' : 'none'}>
            <ThongTinChungRender objectData={{ "sodienthoai": IsKhaiHo ? '' : userCD?.PhoneNumber || userCD?.SDT || '', "hoten": IsKhaiHo ? '' : userCD?.FullName || '' }} ref={refTTCaNhan} listCom={listCom} isEdit={true} >
            </ThongTinChungRender>
          </View>
          <ThongTinDiaChi tinh={CachLy?.IDTinhThanh || ''} huyen={CachLy?.IDQuanHuyen || ''} IdDonVi={CachLy?.IDXaPhuong} ref={refTTDiaChi} isEdit={true} listCom={listComDiaChi} />

          <View>
            <ComponentItem.ComponentInput   {...itemGhiChu} value={GhiChu}
              onPress={() => { }}
              onChangTextIndex={val => setDiaChi(val)}
              isEdit={true}
              value={DiaChi}
              placeholder={itemGhiChu.placehoder}
              title={itemGhiChu.name}
            // keyboardType="numeric"
            />
          </View>
          <Text style={customStyles.location}>{`Vị trí hiện tại: ${CurrentLocationText}`}</Text>
          <ListCauHoi ref={refTTCauHoi} />
          {/* {renderChossImage()} */}

          <View style={{
            padding: FontSize.scale(10),
            flexDirection: 'row',
          }}>
            <ButtonCom
              onPress={onPressSubmid}
              sizeIcon={30}
              txtStyle={{ color: colors.white }}
              style={customStyles.buttonSubmit}
              text={'Gửi thông tin'}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View >
  )
}
export default ToKhaiYTe
const customStyles = StyleSheet.create({
  title: {
    fontWeight: 'bold', fontSize: FontSize.reText(20), color: colors.blueFaceBook, textAlign: 'center', paddingVertical: FontSize.scale(10)
  },
  icKhaiHo: {
    width: FontSize.reSize(20),
    height: FontSize.reSize(20),
    tintColor: colors.colorSalmon,
    borderWidth: 0.5, borderColor: colors.colorSalmon
  },
  textKH: {
    fontWeight: 'bold', fontSize: FontSize.reText(18), color: colors.black_60, paddingHorizontal: FontSize.scale(10)
  },
  contentKhaiHo: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: FontSize.scale(15)
  },
  buttonSubmit: {
    borderRadius: FontSize.scale(5),
    alignSelf: 'center',
    flex: 1, padding: FontSize.scale(15),
    width: '100%'
  },
  containerBody: {
    paddingHorizontal: FontSize.scale(15), backgroundColor: colors.colorPaleGrey, flex: 1,
    paddingBottom: getBottomSpace()
  },
  location: {
    fontWeight: 'bold',
    color: colors.blueFaceBook,
    padding: 10
  }
})

