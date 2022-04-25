import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet
} from 'react-native';
import { nstyles, colors, sizes } from '../../../../styles';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import { Height } from '../../../../styles/styles';
import ButtonCom from '../../../../components/Button/ButtonCom';
import apis from '../../../apis';
import { nkey } from '../../../../app/keys/keyStore';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { IsLoading } from '../../../../components';
import { appConfig } from '../../../../app/Config';
// import Heartbeat from '../../../../Heartbeat';
const Paddingst = Platform.OS == 'ios' ? 10 : 5;
class ThongTinNguoiNhiem extends Component {
  constructor(props) {
    super(props);
    this.datatrack = Utils.ngetParam(this, 'data', {});
    this.setToken = Utils.ngetParam(this, 'setToken', () => { });
    this.state = {
      data: {},
      isShow: Utils.ngetParam(this, 'isShow', false)
    };
  }
  _getThongtinNguoiNhiem = async () => {
    nthisIsLoading.show();
    const { Token = '' } = this.datatrack;
    const res = await apis.ApiTracking.GetDetail_TTAcc(Token);
    Utils.nlog('gia tri của res lấy thông tin người đk:', res);
    if (res.status == 1) {
      nthisIsLoading.hide();
      this.setState({ data: res.data });
    } else {
      nthisIsLoading.hide();
      Utils.nlog(
        this,
        'Thông báo',
        res.error ? res.error.message : 'Lấy thông tin người đăng ký thất bại',
        'Xác nhận',
        () => {
          Utils.goback(this);
        }
      );
    }
  };
  _XacNhan = async () => {
    const { Token = '' } = this.datatrack;
    await Utils.nsetStore(nkey.Tokentracking, Token);
    if (Platform.OS == 'android') {
      var url = appConfig.domain + 'api/trackingapp/TrackingPosition';
      this.setToken(Token);
      // Heartbeat.startService(Token, url);
      // api/trackingapp/TrackingPosition
    } else {
      // ROOTGlobal.dataGlobal._onTracking();
    }
    Utils.showMsgBoxOK(
      this,
      'Thông báo',
      'Bạn đã xác thực thành công mã số',
      'Xác nhận',
      () => {
        Utils.goback(this);
      }
    );
  };
  goback = () => {
    Utils.goback(this);
  };
  componentDidMount() {
    this._getThongtinNguoiNhiem();
  }
  // "Id": 2,
  // "HoTen": "Nguyen Van A",
  // "SttLayNhiem": 3,
  // "DoiLayNhiem": 1,
  // "MotaDoiLayNhiem": "Ca mới",
  // "PhoneNumber": "",
  // "TrangThai": "Âm tính lần 1",
  // "IdTrangThai": 3,
  // "DiaDiem": "12 Trường Chinh, Phường 12, Tân Bình, Hồ Chí Minh, Việt Nam",
  // "CoDinhX": 10.7959960000,
  // "CoDinhY": 106.6483949000,
  // "ToaDoX": 10.7962559000,
  // "ToaDoY": 106.6287860000,
  // "Active": true,
  // "Color": "#FF33CC\t",
  // "Icon": "http://maps.google.com/mapfiles/kml/paddle/pink-blank.png",
  // "Time": "25/03/2020 13:58"
  render() {
    const { Token = '' } = this.datatrack;
    const { data, isShow } = this.state;
    return (
      <View style={[nstyles.nstyles.ncontainer, nstyles.paddingTopMul()]}>
        <View
          style={{
            width: '100%',
            backgroundColor: colors.yellowLight,
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: nstyles.paddingTopMul()
          }}
        >
          <TouchableOpacity
            onPress={() => Utils.goback(this)}
            style={{
              padding: 7,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              source={Images.icBack}
              style={[
                nstyles.nstyles.nIcon18,
                { tintColor: colors.colorGrayIcon }
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              paddingRight: sizes.sText18
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: sizes.sText16
              }}
            >
              Thông tin người đăng ký
            </Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <TextInput
            editable={false}
            style={{
              paddingVertical: Paddingst,
              marginVertical: 5,
              paddingHorizontal: 10,
              borderColor: colors.white,
              marginHorizontal: 10,
              backgroundColor: colors.colorGrayBgr,
              borderWidth: 1,
              textAlign: 'center',
              color: colors.black_80
            }}
            placeholder="Mã Token"
            value={`Mã token:${Token}`}
          // onChangeText={(text) => this.setState({ txtToken: text })}
          ></TextInput>

          <View
            style={{
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 10
            }}
          >
            <View
              style={[
                styler.viewcontai,
                nstyles.nstyles.shadown,
                {
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center'
                }
              ]}
            >
              <View style={[styler.viewcontai, { flex: 1 }]}>
                <Text style={styler.tieude}>{`Họ và tên :`}</Text>
                <Text
                  style={[styler.noidung, { flex: 1 }]}
                >{`${data.HoTen}`}</Text>
              </View>

              {/* <Text style={[{ color: colors.redStar, fontSize: sizes.reSize(16), fontWeight: 'bold', textAlign: 'center' }]}>{`${data.Id}`}</Text> */}
            </View>
            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginVertical: 1,
                    flex: 1
                  }
                ]}
              >
                <Text style={styler.tieude}>{`Đời lấy nhiễm :`}</Text>
                <Text style={styler.noidung}>{`${data.DoiLayNhiem}`}</Text>
              </View>
              <View style={styler.viewcontai}>
                <Text style={styler.tieude}>{`Số thứ tự :`}</Text>
                <Text style={styler.noidung}>{`${data.SttLayNhiem}`}</Text>
              </View>
            </View>
            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <Text style={styler.tieude}>{`Mô tả đời lấy nhiễm :`}</Text>
              <Text style={styler.noidung}>{`${data.MotaDoiLayNhiem}`}</Text>
            </View>
            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <Text style={styler.tieude}>{`Địa điểm :`}</Text>
              <Text style={[styler.noidung]}>{`${data.DiaDiem}`}</Text>
            </View>
            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <Text style={styler.tieude}>{`Thời gian :`}</Text>
              <Text style={styler.noidung}>{`${data.Time}`}</Text>
            </View>
            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <Text style={styler.tieude}>{`Trạng thái :`}</Text>
              <Text
                style={[styler.noidung, { color: data.Color }]}
              >{`${data.TrangThai}`}</Text>
            </View>

            <View style={[styler.viewcontai, nstyles.nstyles.shadown]}>
              <View
                style={[
                  {
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginVertical: 1,
                    flex: 1
                  }
                ]}
              >
                <Text style={styler.tieude}>{`Toạ độ X :`}</Text>
                <Text style={styler.noidung}>{`${data.ToaDoX}`}</Text>
              </View>
              <View
                style={[
                  {
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginVertical: 1,
                    flex: 1
                  }
                ]}
              >
                <Text style={styler.tieude}>{`Toạ độ Y  :`}</Text>
                <Text style={styler.noidung}>{`${data.ToaDoY}`}</Text>
              </View>
            </View>
          </View>
          {/*  */}
        </ScrollView>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            flexDirection: 'row',
            paddingBottom: 60
          }}
        >
          <View style={{ flex: 1 }}>
            {/* <TouchableOpacity
                            onPress={this.goback}
                            style={{ flex: 1, backgroundColor: colors.colorGrayBgr, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, }}>
                            <Text>{'Trở lại'}</Text>
                        </TouchableOpacity> */}
            <ButtonCom
              onPress={this.goback}
              Linear={true}
              icon={Images.icFE}
              sizeIcon={30}
              style={{
                borderRadius: 0,
                marginHorizontal: 10,
                paddingHorizontal: 20,
                backgroundColor: colors.colorGrayBgr
              }}
              txtStyle={{ color: colors.black_80 }}
              text={'Quay lại'}
            />
            {/* </View> */}
          </View>
          {isShow == false ? (
            <View style={{ flex: 1 }}>
              <ButtonCom
                onPress={this._XacNhan}
                Linear={true}
                icon={Images.icFE}
                sizeIcon={30}
                style={{
                  borderRadius: 0,
                  marginHorizontal: 10,
                  paddingHorizontal: 20,
                  backgroundColor: colors.colorBlue
                }}
                text={'Xác nhận'}
              />
            </View>
          ) : null}
        </View>
        <IsLoading />
      </View>
    );
  }
}
const styler = StyleSheet.create({
  tieude: { fontSize: sizes.reSize(14), color: colors.colorBrownGrey },
  noidung: {
    fontSize: sizes.reSize(16),
    fontWeight: 'bold',
    paddingHorizontal: 5,
    flex: 1,
    color: colors.black_80
  },
  viewcontai: {
    flexDirection: 'row',
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 1,
    backgroundColor: colors.white
  }
});
export default ThongTinNguoiNhiem;
