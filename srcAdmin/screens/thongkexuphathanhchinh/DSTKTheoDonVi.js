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
import { ConfigScreenDH } from '../../routers/screen'

const KeyTK = {
  SapHetHan: 0,
  TongXuPhat: 1,
  TrongHan_ChuaThiHanh: 2,
  QuaHan_ChuaThiHanh: 3,
  TrongHan_DaThiHanh: 4,
  QuaHan_DaThiHanh: 5,
  DungHan_ThiHanhMotPhan: 6,
  TreHan_ThiHanhMotPhan: 7,
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
          placeholderTextColor={colors.black_30}
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
  const [denngay, setdenngay] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );

  const [dataLinhVuc, setdataLinhVuc] = useState([]);
  const [dataDonVi, setdataDonVi] = useState([]);
  // const [dataNhomDV, setdataNhomDV] = useState([]);
  const [dataCapXP, setdataCapXP] = useState([])

  const [selectLv, setselectLv] = useState({ IdLinhVuc: 0, LinhVuc: "Tất cả" });
  const [selectLoaiDV, setselectLoaiDV] = useState(dataLoaiDV[0]);
  const [selectDv, setselectDv] = useState("");
  const [selectCapXP, setselectCapXP] = useState("")
  // const [selectNhomDV, setselectNhomDV] = useState("");

  const getLinhVuc = async () => {
    // let res = await apis.LinhVuc.GetList_LinhVuc();
    let res = await apis.ApiXuLyHanhChinh.GetList_LinhVuc_New()
    Utils.nlog("gía trị linh vuc", res);
    if (res.status == 1) {
      setdataLinhVuc([{ IdLinhVuc: 0, LinhVuc: "Tất cả" }].concat(res.data ? res.data : []));
    }
  };
  const GetList_DonVi = async () => {
    // let body = {
    //   sortOrder: "asc",
    //   sortField: "",
    //   page: 1,
    //   record: 10,
    //   OrderBy: "",
    //   more: true,
    //   "filter.keys": "IdNhomDonVi",
    //   "filter.vals": selectNhomDV.IdNhom,
    // };
    // Utils.nlog("Body----", body);
    let res = await apis.ApiTKXPHC.GetList_DonVi();
    Utils.nlog("gía trị don vị----", res);
    if (res.status == 1) {
      setdataDonVi([{ MaPX: 0, TenPhuongXa: "Tất cả" }].concat(res.data ? res.data : []));
    }
  };

  const GetCapCoThamQuyenXuPhat = async () => {
    let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
    Utils.nlog('Cấp có thẩm quyền quyết định xử phạt,Cơ quan thi hành', res)
    if (res.status == 1 && res.data) {
      setdataCapXP(res.data ? res.data : [])
    }
  }

  // const GetListNhom_DonVi = async () => {
  //   let res = await apis.ApiTKXPHC.GetAllCapDonVi_NhomDonVi();
  //   if (res.status == 1) {
  //     setdataNhomDV([{ IdNhom: 0, TenNhom: "Tất cả" }].concat(res.data));
  //   }
  // };

  useEffect(() => {
    getData();
  }, [tungay, denngay, selectLv, selectLoaiDV, selectLoaiDV.id == 1 ? selectDv : selectCapXP]);
  const getData = async () => {
    let body = {
      ...objectFilter,
      "filter.keys": `tungay|denngay${selectLv && selectLv.Id != 0 ? "|linhvuc" : ""}${selectDv == "" && selectCapXP == "" ? "" : "|iddonvi"
        }${selectLoaiDV ? "|loaithongke" : ""}`,
      "filter.vals": `${moment(tungay, "DD/MM/YYYY").format(
        "DD-MM-YYYY"
      )}|${moment(denngay, "DD/MM/YYYY").format("DD-MM-YYYY")}${selectLv && selectLv.Id != 0 ? `|${selectLv.IdLinhVuc}` : ""
        }${selectLoaiDV.id == 1 ? `${selectDv.MaPX ? "|" + selectDv.MaPX : ""}` : `${selectCapXP.IdThamQuyen ? "|" + selectCapXP.IdThamQuyen : ""}`}${selectLoaiDV ? `|${selectLoaiDV.id}` : ""
        }`,
    };
    // Utils.nlog("giá trị body-----=======----selectDv", selectDv)
    // Utils.nlog("giá trị body-----=======----selectCapXP", selectCapXP)
    // Utils.nlog("giá trị body-----=======----", body);
    let res = await apis.ApiTKXPHC.GetList_ThongKeXPHC(body);
    // Utils.nlog("giá trị dâta-----=======----11", res);
    if (res.status == 1) {
      setdataThongKe(res.data);
    }
    else {
      setdataThongKe([]);
    }
  };

  useEffect(() => {
    setselectDv("");
    setselectCapXP("");
    GetList_DonVi();
    GetCapCoThamQuyenXuPhat();
  }, [selectLoaiDV]);

  useEffect(() => {
    getData();
    getLinhVuc();
    // GetListNhom_DonVi();
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
      // case 7:
      //   {
      //     setselectNhomDV(val);
      //   }
      //   break;
      default:
        break;
    }
  };
  const _viewItem = (item, key) => {
    // Utils.nlog("giá tị item", item)
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
            ViewItem: (item) => _viewItem(item, "LinhVuc"),
            Search: true,
            key: "LinhVuc",
          });
        }
        break;
      case 2:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 6),
            item: selectLoaiDV,
            title: "Danh sách loại đơn vị",
            AllThaoTac: dataLoaiDV,
            ViewItem: (item) => _viewItem(item, "Name"),
            Search: true,
            key: "Name",
          });

        }
        break;
      case 3:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 2),
            item: selectDv,
            title: "Danh sách đơn vị",
            AllThaoTac: dataDonVi,
            ViewItem: (item) => _viewItem(item, "TenPhuongXa"),
            Search: true,
            key: "TenPhuongXa",
          });
        }
        break;
      case 4:
        {
          Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 3), item: selectCapXP,
            title: 'Danh sách cấp có thẩm quyền',
            AllThaoTac: dataCapXP,
            ViewItem: (item) => _viewItem(item, "TenCap"), Search: true, key: 'TenCap'
          })
        }
        break;
      // case 4:
      //   {
      //     Utils.goscreen(props.nthis, "Modal_ComponentSelectPropsDH", {
      //       callback: (val) => onChangeTextIndex(val, 7),
      //       item: selectNhomDV,
      //       title: "Danh sách đơn vị",
      //       AllThaoTac: dataNhomDV,
      //       ViewItem: (item) => _viewItem(item, "TenNhom"),
      //       Search: true,
      //       key: "TenNhom",
      //     });
      //   }
      //   break;
      default:
        break;
    }
  };

  const XemDanhSach = (IdDonVi, key) => {
    Utils.nlog('Gia tri-------sss', IdDonVi)
    switch (key) {
      case KeyTK.SapHetHan:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|0|0|1' })
        break;
      case KeyTK.TongXuPhat:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|0|0|2' })
        break;
      case KeyTK.TrongHan_ChuaThiHanh:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|1|1|3' })
        break;
      case KeyTK.QuaHan_ChuaThiHanh:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|2|1|3' })
        break;
      case KeyTK.TrongHan_DaThiHanh:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|1|2|3' })
        break;
      case KeyTK.QuaHan_DaThiHanh:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|2|2|3' })
        break;
      case KeyTK.DungHan_ThiHanhMotPhan:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|1|3|3' })
        break;
      case KeyTK.TreHan_ThiHanhMotPhan:
        Utils.goscreen(props.nthis, 'sc_ChiTietThongKeDonVi', { IdDonVi: IdDonVi, TuNgay: tungay, DenNgay: denngay, LinhVuc: selectLv.IdLinhVuc, Values: selectLoaiDV.id + '|2|3|3' })
        break;
      default:
        break;
    }
  }
  const renderItem = ({ item, index }) => {
    const { DonVi,
      DungHan_ChuaThiHanh,
      DungHan_DaThiHanh,
      IdDonVi,
      SapHetHan,
      Tong,
      TreHan_ChuaThiHanh,
      TreHan_DaThiHanh, DungHan_ThiHanhMotPhan, TreHan_ThiHanhMotPhan } = item
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
          }}>{DonVi}</Text>
        </View>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.SapHetHan)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}> {SapHetHan + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.TongXuPhat)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{Tong + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.TrongHan_ChuaThiHanh)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{DungHan_ChuaThiHanh + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.QuaHan_ChuaThiHanh)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{TreHan_ChuaThiHanh + ""}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.TrongHan_DaThiHanh)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{DungHan_DaThiHanh + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => XemDanhSach(IdDonVi, KeyTK.QuaHan_DaThiHanh)} style={styles.row}>
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{TreHan_DaThiHanh + ""}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => XemDanhSach(IdDonVi, KeyTK.DungHan_ThiHanhMotPhan)}
          style={styles.row}
        >
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{DungHan_ThiHanhMotPhan + ""}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => XemDanhSach(IdDonVi, KeyTK.TreHan_ThiHanhMotPhan)}
          style={styles.row}
        >
          <Text style={{
            fontSize: reText(10),
            color: colors.peacockBlue, paddingHorizontal: 5,
          }}>{TreHan_ThiHanhMotPhan + ""}</Text>
        </TouchableOpacity>
      </View>
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
            value={selectLv.LinhVuc}
            onPress={() => _dropDown(1)}
            isEdit={true}
          />
          <ComponentLinhVuc
            title={"Loại đơn vị thống kê"}
            placeholder={"Chọn loại đơn vị"}
            value={selectLoaiDV?.Name}
            onPress={() => _dropDown(2)}
            isEdit={true}
          />

          {/* <ComponentLinhVuc
            title={"Nhóm đơn vị thống kê"}
            placeholder={"Chọn nhóm đơn vị"}
            value={selectNhomDV?.TenNhom}
            onPress={() => _dropDown(4)}
            isEdit={true}
          /> */}
          {/* {selectNhomDV ? ( */}
          {/* <ComponentLinhVuc
            title={"Tên đơn vị"}
            placeholder={"Chọn đơn vị"}
            value={selectDv?.TenPhuongXa}
            onPress={() => _dropDown(3)}
            isEdit={true}
          /> */}
          {selectLoaiDV.id == 0 ? null :
            selectLoaiDV.id == 1 ?
              <ComponentLinhVuc title={'Tên đơn vị'} placeholder={'Chọn đơn vị'} value={selectDv?.TenPhuongXa} onPress={() => _dropDown(3)} isEdit={true} />
              :
              <ComponentLinhVuc title={'Tên cấp có thẩm quyền'} placeholder={'Chọn cấp có thẩm quyền'} value={selectCapXP?.TenCap} onPress={() => _dropDown(4)} isEdit={true} />
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
              {SapHetHan + ""}
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
                {"Chưa thi hành"}
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
                {"Đã thi hành"}
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
                {"Thi hành 1 phần"}
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
