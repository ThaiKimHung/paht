import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import Utils from '../../../app/Utils';
import { IsLoading } from '../../../components';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { colors } from '../../../styles';
import { Height, Width } from '../../../styles/styles';
import apis from '../../apis';
import FileCom from '../PhanAnhHienTruong/components/FileCom';
import HeaderModal from '../PhanAnhHienTruong/components/HeaderModal';
import ItemNoiDung from '../PhanAnhHienTruong/components/ItemNoiDung';

const KeyButton = {
  ChuyenXuLy: 1,
  ThuHoi: 2,
  ChinhSua: 3,
  Xoa: 4,
  XuLy: 5,
  HoanThanh: 6
}

class ModalXuLyCBCV extends Component {
  constructor(props) {
    super(props);
    this.callback = Utils.ngetParam(this, 'callback');
    this.title = Utils.ngetParam(this, 'title', '');
    this.item = Utils.ngetParam(this, 'item')
    this.buttonHandle = Utils.ngetParam(this, 'buttonHandle')
    this.arrFile = this.item.FileDinhKem
    this.state = {
      noidung: '',
      arrImage: [],
      arrAplicaton: [],
      arrFileDelete: []
    };
  }

  onChangeNoiDung = (text) => {
    this.setState({ noidung: text })
  }

  _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
    //Utils.nlog("vao set File Upload", arrImage, arrAplicaton)
    this.setState({ arrImage, arrAplicaton, arrFileDelete });
  }

  _handleSOS = async () => {
    nthisIsLoading.show();
    let res = null;
    if (this.state.noidung == "") {
      nthisIsLoading.hide();
      Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập nội dung xử lý.", "Xác nhận");
      return;
    }
    let LstImg = [], arrVideo = [];
    var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image
    for (let index = 0; index < arrImage.length; index++) {
      let item = arrImage[index];

      if (item.IsNew == false) {
        continue;
      } else {
        let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
        //|| temp.includes("mov") || temp.includes("mp4")
        if (checkImage == true || item.isImage == true || item.timePlay == 0) {
          let downSize = 1;
          if (item.height >= 2000 || item.width >= 2000) {
            downSize = 0.3;
          };
          let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
          LstImg.push({
            "type": item.timePlay == 0 ? 1 : 2,
            "strBase64": strBase64,
            "filename": "hinh" + index + ".png",
            "extension": ".png",
            "isnew": true,
            isdelete: false,
          });
        } else {
          if (Platform.OS == 'android') {
            arrVideo.push(item);
          } else {
            let downSize = 1;
            if (item.height >= 2000 || item.width >= 2000) {
              downSize = 0.3;
            }
            let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
            LstImg.push({
              "type": 2,
              "strBase64": strBase64,
              "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,//("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
              "extension": Platform.OS == 'ios' ? ".mov" : ".mp4",
              "isnew": true,
              isdelete: false,
            });
          };
        };
      }
    };

    for (let index = 0; index < arrAplicaton.length; index++) {
      let item = arrAplicaton[index];
      if (item.IsNew == false) {
        continue;
      } {
        let strBase64;
        // strBase64 = await Utils.parseBase64(item.uri);
        if (item.uri) {
          var duoiFile = item?.TenFile.split('.')
          var fi = "." + duoiFile[duoiFile.length - 1]
          //Utils.nlog("gia trị duôi file", fi)
          LstImg.push({
            "type": 2,
            "strBase64": item.base64,
            "filename": item.name,
            "extension": fi,
            "isnew": true,
            isdelete: false,
          });
        };
      }

    };

    for (let index = 0; index < arrFileDelete.length; index++) {
      let item = arrFileDelete[index];
      LstImg.push({
        ...item,
        IsDel: true,
        Isnew: false
      });
    }

    let FileDinhKem = [...LstImg, ...arrVideo,]
    Utils.nlog("FileDinhKem", FileDinhKem)
    let body = {}
    switch (this.buttonHandle.Key) {
      case KeyButton.XuLy:
        // Gọi api Hoàn thành api/sos/TiepNhanSOS
        body = {
          "FileDinhKem": FileDinhKem,
          "NoiDungThaoTac": this.state.noidung,
          "IdSOS": this.item.Id,
          "Passed": true,
          "Status_SOS": 3
        }
        Utils.nlog("body", body)
        res = await apis.ApiCBCV.TiepNhanSOS(body)
        Utils.nlog("res tiep nhan", res)
        if (res.status == 1) {
          nthisIsLoading.hide()
          Utils.showMsgBoxOK(this, 'Thông báo', 'Tiếp nhận xử lý thành công !', 'Xác nhận', () => {
            ROOTGlobal.dataGlobal._reloadSOS(1, this.item.Id)
            try {
              this.callback();
            } catch (error) {
              Utils.goback(this);
            };
          })
        } else {
          nthisIsLoading.hide()
          Utils.showMsgBoxOK(this, 'Thông báo', 'Tiếp nhận xử lý thất bại !', 'Xác nhận')
        }
        break;
      case KeyButton.HoanThanh:
        //Gọi api api/sos/HoanThanhSOS
        body = {
          "FileDinhKem": FileDinhKem,
          "NoiDungThaoTac": this.state.noidung,
          "IdSOS": this.item.Id,
          "Passed": true,
          "Status_SOS": 4
        }
        res = await apis.ApiCBCV.HoanThanhSOS(body)
        Utils.nlog("res hoan thanh sos", res)
        if (res.status == 1) {
          nthisIsLoading.hide()
          Utils.showMsgBoxOK(this, 'Thông báo', 'Thao tác xử lý thành công !', 'Xác nhận', () => {
            ROOTGlobal.dataGlobal._reloadSOS(1, this.item.Id)
            try {
              this.callback();
            } catch (error) {
              Utils.goback(this);
            };
          })
        } else {
          nthisIsLoading.hide()
          Utils.showMsgBoxOK(this, 'Thông báo', 'Thao tác xử lý thất bại !', 'Xác nhận')
        }
        break;
      default:
        break;
    }



  }

  render() {
    return (
      <View style={[{ flex: 1, justifyContent: 'center' }]} >
        <View style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          right: 0, flex: 1, backgroundColor: colors.backgroundModal,
          alignItems: 'center',

        }} onTouchEnd={this.goback} />
        <View style={{
          backgroundColor: colors.white,
          flex: 1, marginTop: Height(10),
          borderTopLeftRadius: 30, borderTopRightRadius: 30,

        }}>
          <HeaderModal
            title={this.title}
            _onPress={() => Utils.goback(this)}
          />
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <ItemNoiDung
              textTieuDe={<Text>{'Nội dung'} <Text style={{ color: colors.redStar }}>{'*'}</Text></Text>}
              placeholder={`Nội dung`}
              multiline={true}
              value={this.state.noidung}
              stNoiDung={{ textAlignVertical: 'top' }}
              numberOfLines={2}
              stTitle={{ marginLeft: 15 }}
              stConaier={{ paddingVertical: 0 }}
              onChangeText={this.onChangeNoiDung}
              stContaierTT={{ backgroundColor: colors.veryLightPink, width: Width(90), height: Height(12), marginLeft: 15 }}
            />
            <View style={{ marginLeft: 15 }}>
              <FileCom arrFile={this.arrFile} nthis={this} setFileUpdate={this._UpdateFile} />
            </View>
            <ButtonCus
              textTitle={this.title}
              onPressB={this._handleSOS}
              stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1 }}
            />
          </KeyboardAwareScrollView>
        </View>
        <IsLoading />
      </View >
    );
  }
}

export default ModalXuLyCBCV;
