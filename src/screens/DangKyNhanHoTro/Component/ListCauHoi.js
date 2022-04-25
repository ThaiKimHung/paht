import React, { Component, createRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  BackHandler,
} from "react-native";
import Utils from "../../../../app/Utils";
import { colors } from "../../../../styles";
import { reText } from "../../../../styles/size";
import { Height, nstyles, paddingBotX, Width } from "../../../../styles/styles";
import { Images } from "../../../images";
import { ButtonCom, IsLoading } from "../../../../components";

import { store } from "../../../../srcRedux/store";
import { GetDataUserCD } from "../../../../srcRedux/actions/auth/Auth";
import apis from "../../../apis";
import { data } from "jquery";
import ComponentCHvaLC from "./ComponentCHvaLC";

export class ListCauHoi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      dataCauHoi: [],
      dataLuaChon: [],
      dataBoth: [],
    };
    this.refLoading = createRef();
  }
  // Hàm Lấy Dữ Liệu Khảo Sát Và Lựa Chọn
  getDataCauHoiVaLuaChon = async () => {
    let res = await apis.ApiHCM.getCauHoi();
    console.log("res data trong ListCauHoi", res.data);

    //Data Khảo Sát
    console.log("res cau hoi trong ListCauHoi ", res.data.KhaoSat);
    this.setState({ dataCauHoi: res.data.KhaoSat });
    console.log("data KS la ", this.state.dataCauHoi);

    //Data Lựa Chọn
    console.log("res cau lua chon trong ListCauHoi LC ", res.data.LuaChon);
    let dataTemp = res.data.LuaChon.map((item, index) => {
      return { ...item, DaChon: false };
    });
    this.setState({ dataLuaChon: dataTemp });
    console.log("data LC la ", this.state.dataLuaChon);

    // Data Gọp Khảo Sát và Lựa Chọn
    // 1 câu khảo sát có 4 câu lựa chọn
    let dataTemp1 = res.data.KhaoSat.map((item, index) => {
      return {
        ...item,
        val: res.data.LuaChon.map((it, id) => {
          return { ...it, DaChon: false };
        }),
      };
    });
    this.setState({ dataBoth: dataTemp1 });
    console.log("data Both la ", this.state.dataBoth);
  };
  componentDidMount() {
    this.getDataCauHoiVaLuaChon();
  }

  getData = () => {
    return this.state.dataBoth;
  };

  setDataCH = (item) => {
    console.log("Item trong list cau hoi khi co su kien press ", item);
    const { dataBoth } = this.state;
    console.log("dataBoth trong list cau hoi : ", dataBoth);
    // let mangtemp = dataBoth;
    this.setState({
      dataBoth: dataBoth.map((it, id) => {
        if (it.Id == item.Id) {
          return { ...item };
        }
        return { ...it };
      }),
    });
  };
  renderCauHoi = ({ item, index }) => {
    return (
      // Component câu khảo sát và câu lựa chọn
      <ComponentCHvaLC item={item} index={index} setData={this.setDataCH} />
    );
  };

  render() {
    const { opacity, dataCauHoi, dataBoth } = this.state;
    return (
      <View style={{ backgroundColor: colors.white, paddingHorizontal: 10 }}>
        {/* {dataBoth && dataBoth.map(this.renderCauHoi1)} */}
        <FlatList
          data={dataBoth}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderCauHoi}
        />
        <IsLoading ref={this.refLoading} />
      </View>
    );
  }
}

export default ListCauHoi;
