import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import { colors } from '../../../styles'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { BarChart, Grid, PieChart } from 'react-native-svg-charts'
import { reSize, reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { Images } from '../../images'
import { IsLoading } from '../../../components'
import { ConfigScreenDH } from '../../routers/screen'

const KeyTK = {
  tong: 0,
  tronghan_dxl: 1,
  quahan_dxl: 2,
  tronghan_dangxl: 3,
  quahan_dangxl: 4

}

const ComponentChonNgay = (props) => {
  const ref = useRef();
  const onPress = () => {
    ref.current.onPressDate();
  };
  return (
    <TouchableOpacity
      onPress={props.isEdit ? onPress : () => { }}
      style={{ width: "50%" }}
    >
      <View pointerEvents="none" style={{ width: "100%" }}>
        <InputRNCom
          styleContainer={{ paddingHorizontal: 5, width: "100%" }}
          styleBodyInput={{
            borderColor: colors.colorGrayIcon,
            borderRadius: 3,
            borderWidth: 0.5,
            minHeight: 40,
            alignItems: "center",
            paddingVertical: 0,
            width: "100%",
          }}
          labelText={props.title}
          styleLabel={{
            color: colors.colorGrayText,
            fontWeight: "bold",
            fontSize: reText(14),
          }}
          sufix={
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <View
                style={{
                  height: 30,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  // defaultSource={Images.icCalendar}
                  source={Images.icCalendar}
                  style={{ width: 15, height: 15 }}
                  resizeMode="contain"
                />
              </View>
              <DatePicker
                style={{ borderWidth: 0, width: "0%" }}
                date={props.value}
                mode="date"
                disabled={false}
                placeholder={props.placeholder}
                format="DD/MM/YYYY"
                confirmBtnText="Xác nhận"
                cancelBtnText="Huỷ"
                showIcon={false}
                androidMode="spinner"
                hideText={true}
                locale="vi"
                ref={ref}
                customStyles={{
                  datePicker: {
                    backgroundColor: "#d1d3d8",
                    justifyContent: "center",
                  },
                  dateInput: {
                    paddingHorizontal: 5,
                    borderWidth: 0,
                    alignItems: "flex-start",
                  },
                }}
                // hideText={true}

                onDateChange={props.onChangTextIndex}
              />
            </View>
          }
          placeholder={props.placeholder}
          styleInput={{}}
          styleError={{ backgroundColor: "white" }}
          styleHelp={{ backgroundColor: "white" }}
          placeholderTextColor={colors.black_16}
          // errorText={'Ngày sinh  không hợp lệ'}
          // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
          valid={true}
          value={props.value}
          onChangeText={props.onChangTextIndex}
        />
      </View>
    </TouchableOpacity>
  );
};
//
const ComponentLinhVuc = (props) => {
  return (
    <TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
      <View pointerEvents={"none"}>
        <InputRNCom
          styleContainer={{ paddingHorizontal: 15, marginTop: 5 }}
          styleBodyInput={{
            borderColor: colors.colorGrayIcon,
            borderRadius: 3,
            borderWidth: 0.5,
            minHeight: 40,
            alignItems: "center",
            paddingVertical: 0,
          }}
          labelText={props.title}
          styleLabel={{
            color: colors.colorGrayText,
            fontWeight: "bold",
            fontSize: reText(14),
          }}
          // sufixlabel={<View>
          //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
          // </View>}
          placeholder={props.placeholder}
          styleInput={{}}
          styleError={{ backgroundColor: "white" }}
          styleHelp={{ backgroundColor: "white" }}
          placeholderTextColor={colors.black_20}
          // errorText={'Tôn giáo không hợp lệ'}
          // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
          editable={false}
          valid={true}
          prefix={null}
          value={props.value}
          onChangeText={props.onChangTextIndex}
          sufix={
            <View
              style={{
                height: 30,
                width: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                // defaultSource={Images.icDropDown}
                source={Images.icDropDown}
                style={{ width: 15, height: 15 }}
                resizeMode="contain"
              />
            </View>
          }
        />
      </View>
    </TouchableOpacity>
  );
};

const dataLoaiDV = [
  // {
  //   id: 0,
  //   Name: 'Tất cả'
  // },

  {
    id: 1,
    Name: "Đơn vị thi hành",
  },
  {
    id: 2,
    Name: "Đơn vị quyết định xử phạt",
  },
];
const objectFilter = {
  more: false,
  sortOrder: "asc",
  sortField: "",
  page: 1,
  record: 10,
  OrderBy: "",
};
const DSTKTheoDonVi = (props) => {
  const [dataThongKe, setdataThongKe] = useState([]);
  const [tungay, setTungay] = useState(
    moment(new Date())
      .add(-30, "days")
      .format("DD/MM/YYYY")
  );
  const refLoading = useRef(null);
  const [denngay, setdenngay] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );

  const [dataLinhVuc, setdataLinhVuc] = useState([]);
  const [dataDonVi, setdataDonVi] = useState([]);
  const [dataNhomDV, setdataNhomDV] = useState([]);
  const [dataCapXP, setdataCapXP] = useState([])

  const [selectLv, setselectLv] = useState({ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" });
  const [selectLoaiDV, setselectLoaiDV] = useState({ IdNhom: 0, TenNhom: "Tất cả" });
  const [selectDv, setselectDv] = useState({ MaPX: 0, TenPhuongXa: "Tất cả" });
  // const [selectCapXP, setselectCapXP] = useState('')
  // const [selectNhomDV, setselectNhomDV] = useState("");

  const getLinhVuc = async () => {
    let res = await apis.ApiTKTrucBan.GetList_ChuyenMuc();
    // Utils.nlog("gía trị linh vuc---------nhe", res);
    if (res.status == 1) {
      setdataLinhVuc([{ IdChuyenMuc: 0, TenChuyenMuc: "Tất cả" }].concat(res.data));
    }
  };
  const GetListNhomDonVi = async () => {

    let res = await apis.ApiTKTrucBan.GetAllCapDonVi_NhomDonVi();
    // Utils.nlog("res loại đơn vị", res);
    if (res.status == 1) {
      setdataNhomDV([{ IdNhom: 0, TenNhom: "Tất cả" }].concat(res.data));
    }
  };
  const GetList_DonVi = async () => {
    let body = {
      sortOrder: "asc",
      sortField: "",
      page: 1,
      record: 10,
      OrderBy: "",
      more: true,
      "filter.keys": "IdNhomDonVi",
      "filter.vals": selectLoaiDV.IdNhom,
    };
    let res = await apis.ApiTKTrucBan.GetList_DonVi(body);
    // Utils.nlog("gía trị don vị----", res);
    if (res.status == 1) {
      setdataDonVi([{ MaPX: 0, TenPhuongXa: "Tất cả" }].concat(res.data));
    }
  };

  const GetCapCoThamQuyenXuPhat = async () => {
    let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
    Utils.nlog('Cấp có thẩm quyền quyết định xử phạt,Cơ quan thi hành', res)
    if (res.status == 1 && res.data) {
      setdataCapXP(res.data)
    }
  }


  useEffect(() => {
    getData();
  }, [tungay, denngay, selectLv, selectLoaiDV, selectDv]);
  const getData = async () => {
    refLoading.current.show();
    let body = {
      ...objectFilter,
      "filter.keys": `tungay|denngay|idnhomdonvi|idchuyenmuc|iddonvi`,
      "filter.vals": `${moment(tungay, "DD/MM/YYYY").format(
        "DD-MM-YYYY"
      )}|${moment(denngay, "DD/MM/YYYY").format("DD-MM-YYYY")}|${selectLoaiDV.IdNhom}|${selectLv.IdChuyenMuc}|${selectDv ? selectDv.MaPX : 0}`
    }

    let res = await apis.ApiTKTrucBan.GetList_ThongKePA_TheoDonVi(body);
    refLoading.current.hide();
    if (res.status == 1) {
      setdataThongKe(res.data);
    }
    else {
      setdataThongKe([]);
    }
  };

  useEffect(() => {
    GetList_DonVi();
  }, [selectLoaiDV]);

  useEffect(() => {
    getData();
    getLinhVuc();
    GetListNhomDonVi();

  }, []);

  const onChangeTextIndex = (val, index) => {
    switch (index) {
      case 1:
        {
          setselectLv(val);
        }
        break;
      case 2:
        {
          setselectDv(val);
        }
        break;
      case 3: {
        setselectCapXP(val)
      } break;
      case 4:
        {
          if (denngay != "") {
            let check = moment(denngay, "DD/MM/YYYY").isAfter(
              moment(val, "DD/MM/YYYY")
            );
            if (check == true) {
              setTungay(val);
            } else {
              Utils.showMsgBoxOK(
                props.nthis,
                "Thông báo",
                "Từ ngày phải nhỏ hơn đến ngày",
                "Xác nhận"
              );
              return;
            }
          } else {
            setTungay(val);
          }
        }
        break;
      case 5:
        {
          if (tungay != "") {
            let check = moment(tungay, "DD/MM/YYYY").isBefore(
              moment(val, "DD/MM/YYYY")
            );
            if (check == true) {
              setdenngay(val);
            } else {
              Utils.showMsgBoxOK(
                props.nthis,
                "Thông báo",
                "Đến ngày phải lớn hơn từ ngày",
                "Xác nhận"
              );
              return;
            }
          } else {
            setdenngay(val);
          }
        }
        break;
      case 6:
        {
          setselectLoaiDV(val);
        }
        break;

      default:
        break;
    }
  };
  const _viewItem = (item, key) => {

    return (
      <View
        // key={item}
        style={{
          flex: 1,
          paddingHorizontal: 10,
          margin: 2,
        }}
      >
        <Text style={{ textAlign: "center", paddingVertical: 10 }}>
          {item[key]}
        </Text>
      </View>
    );
  };
  //
  const _dropDown = (index) => {
    switch (index) {
      case 1:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 1),
            item: selectLv,
            title: "Danh sách lĩnh vực",
            AllThaoTac: dataLinhVuc,
            ViewItem: (item) => _viewItem(item, "TenChuyenMuc"),
            Search: true,
            key: "TenChuyenMuc",
          });
        }
        break;
      case 2:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 6),
            item: selectLoaiDV,
            title: "Danh sách loại đơn vị",
            AllThaoTac: dataNhomDV,
            ViewItem: (item) => _viewItem(item, "TenNhom"),
            Search: true,
            key: "TenNhom",
          });
        }
        break;
      case 3:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 2),
            item: selectDv,
            title: "Danh sách đơn vị",
            AllThaoTac: dataDonVi ? dataDonVi : [],
            ViewItem: (item) => _viewItem(item, "TenPhuongXa"),
            Search: true,
            key: "TenPhuongXa",
          });
        }
        break;
      default:
        break;
    }
  };

  const XemDanhSach = (key, IdDV) => {
    // Utils.nlog('Gia tri-------sss', IdDonVi)
    switch (key) {
      case KeyTK.tong:
        Utils.goscreen(props.nthis, 'scChiTietThongKeDonViTrucBan', {
          IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '0'
        })
        break;
      case KeyTK.tronghan_dxl:
        Utils.goscreen(props.nthis, 'scChiTietThongKeDonViTrucBan', {
          IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '2'
        })
        break;
      case KeyTK.quahan_dxl:
        Utils.goscreen(props.nthis, 'scChiTietThongKeDonViTrucBan', {
          IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '3'
        })
        break;
      case KeyTK.tronghan_dangxl:
        Utils.goscreen(props.nthis, 'scChiTietThongKeDonViTrucBan', {
          IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom,
          loaidanhgia: '5'
        })
        break;
      case KeyTK.quahan_dangxl:
        Utils.goscreen(props.nthis, 'scChiTietThongKeDonViTrucBan', {
          IdDonVi: IdDV, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdChuyenMuc, Values: selectLoaiDV.IdNhom, loaidanhgia: '6'
        })
        break;

      default:
        break;
    }
  }
  const renderItem = ({ item, index }) => {
    const { TenMuc,
      IdMuc,
      IdMucParent,
      SoLuong,
      SLTrongHanDaXL,
      SLQuaHanDaXL,
      SLTrongHanDangXL,
      SLQuaHanDangXL,
      TongDaXL,
      TongDangXL,
      TyLeTongDaXL,
      TyLeTrongHanDaXL,
      // "TyLeQuaHanDaXL": 11.1,
      // "TyLeTongDangXL": 40.0,
      // "TyLeTrongHanDangXL": 0.0,
      // "TyLeQuaHanDangXL": 100.0 
    } = item
    return (
      <View style={{
        minHeight: 40, marginVertical: 1, backgroundColor: 'white',
        width: '100%', flexDirection: 'row', paddingHorizontal: 10
      }}>
        <View style={styles.row}>
          <Text>{index}</Text>
        </View>
        <View style={[styles.row, { flex: 3, }]}>
          <Text style={{
            fontSize: reText(10),
            color: colors.redStar, paddingHorizontal: 5
          }}>{TenMuc}</Text>
        </View>
        <TouchableOpacity onPress={() => XemDanhSach(KeyTK.tong, IdMuc)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{SoLuong + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(KeyTK.tronghan_dxl, IdMuc)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{SLTrongHanDaXL + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(KeyTK.quahan_dxl, IdMuc)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{SLQuaHanDaXL + ""}</Text></TouchableOpacity>
        <TouchableOpacity
          onPress={() => XemDanhSach(KeyTK.tronghan_dangxl, IdMuc)}
          style={styles.row}
        >
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{SLTrongHanDangXL + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => XemDanhSach(KeyTK.quahan_dangxl, IdMuc)}
          style={styles.row}
        >
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{SLQuaHanDangXL + ""}</Text>
        </TouchableOpacity>
      </View >
    )
  }
  const renderHeader = () => {
    let DonVi = "Đơn vị",
      DungHan_ChuaThiHanh = "Trong hạn",
      DungHan_DaThiHanh = "Trong hạn",
      SapHetHan = "Sắp hết hạn",
      Tong = "Tổng số xử phạt",
      TreHan_ChuaThiHanh = "Quá hạn",
      TreHan_DaThiHanh = "Quá hạn",
      DungHan_ThiHanhMotPhan = "Trong hạn",
      TreHan_ThiHanhMotPhan = "Quá hạn";
    return (
      <View>
        <View
          style={{
            paddingBottom: 10,
            borderWidth: 0.5,
            marginHorizontal: 10,
            borderRadius: 10,
            marginBottom: 5,
            borderColor: colors.colorBlueLight,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              width: "100%",
            }}
          >
            <ComponentChonNgay
              value={tungay}
              title={`Từ ngày`}
              placeholder={"Chọn từ ngày"}
              onChangTextIndex={(val) => onChangeTextIndex(val, 4)}
              isEdit={true}
            />
            <ComponentChonNgay
              value={denngay}
              title={`Đến ngày`}
              placeholder={"Chọn đến ngày"}
              onChangTextIndex={(val) => onChangeTextIndex(val, 5)}
              isEdit={true}
            />
          </View>
          <ComponentLinhVuc
            title={"Lĩnh vực"}
            placeholder={"Chọn lĩnh vực"}
            value={selectLv.TenChuyenMuc}
            onPress={() => _dropDown(1)}
            isEdit={true}
          />
          <ComponentLinhVuc
            title={"Loại đơn vị thống kê"}
            placeholder={"Chọn loại đơn vị"}
            value={selectLoaiDV?.TenNhom}
            onPress={() => _dropDown(2)}
            isEdit={true}
          />


          {selectLoaiDV.IdNhom == 0 ? null :
            <ComponentLinhVuc title={'Tên đơn vị'} placeholder={'Chọn đơn vị'} value={selectDv?.TenPhuongXa} onPress={() => _dropDown(3)} isEdit={true} />
          }
          {/* ) : null} */}
        </View>
        <View
          style={{
            minHeight: 40,
            marginVertical: 1,
            backgroundColor: "white",
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <View style={styles.row}>
            <Text
              style={{
                fontSize: reText(10),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {"Stt"}
            </Text>
          </View>
          <View style={[styles.row, { flex: 3 }]}>
            <Text
              style={{
                fontSize: reText(10),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {DonVi}
            </Text>
          </View>

          <View style={styles.row}>
            <Text
              style={{
                fontSize: reText(10),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {Tong + ""}
            </Text>
          </View>

          <View style={[styles.row, { flex: 2 }]}>
            <View style={{ height: 30 }}>
              <Text
                style={{
                  fontSize: reText(10),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {"Đã xử lý"}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ ...styles.row, borderWidth: 0 }}>
                <Text
                  style={{
                    fontSize: reText(10),
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 5,
                  }}
                >
                  {DungHan_DaThiHanh + ""}
                </Text>
              </View>
              <View style={{ ...styles.row, borderWidth: 0 }}>
                <Text
                  style={{
                    fontSize: reText(10),
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 5,
                  }}
                >
                  {TreHan_DaThiHanh + ""}
                </Text>
              </View>
            </View>

          </View>
          <View style={[styles.row, { flex: 2 }]}>
            <View style={{ height: 30 }}>
              <Text
                style={{
                  fontSize: reText(10),
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {"Đang xử lý"}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ ...styles.row, borderWidth: 0 }}>
                <Text
                  style={{
                    fontSize: reText(10),
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 5,
                  }}
                >
                  {DungHan_ThiHanhMotPhan + ""}
                </Text>
              </View>
              <View style={{ ...styles.row, borderWidth: 0 }}>
                <Text
                  style={{
                    fontSize: reText(10),
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingVertical: 5,
                  }}
                >
                  {TreHan_ThiHanhMotPhan + ""}
                </Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* {
                renderHeader()
            } */}
      <FlatList
        data={dataThongKe}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      />
      <IsLoading ref={refLoading}></IsLoading>
    </View>
  );
};

export default DSTKTheoDonVi;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.peacockBlue,
    alignItems: "center",
    justifyContent: "center",
  },
});
