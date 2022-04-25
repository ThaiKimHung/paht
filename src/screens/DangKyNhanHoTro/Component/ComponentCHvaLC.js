import React, { Component } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { reText } from "../../../../styles/size";
import { nstyles } from "../../../../styles/styles";
import { Images } from "../../../images";

export class ComponentCHvaLC extends Component {
  constructor(props) {
    super(props);
  }
  Choose = (itemV) => {
    const { item, setData = () => {} } = this.props;
    console.log("Item Lua Chon Trong ComponentCHvaLC", itemV);
    console.log("Item trong props truyen vao tu ListCauHoi", item);
    item.val.map((it, id) => {
      if (it.Id == itemV.Id) {
        itemV.DaChon = !itemV.DaChon;
        console.log("Item lua chon trong componentCGvaLC : ", itemV);
        return { ...itemV };
      }
      return { ...it };
    });
    console.log("Set LuaChon Trong ComponentCHvaLC thanh cong  : ", item);
    // set dữ liệu của component con vào function cho component cha sử dụng dữ liệu 
    setData(item);
  };
  // đây render ra câu  khảo sát gồm những câu lựa chọn
  render() {
    const { item, index } = this.props;
    return (
      <View key={`${index}`}>
        <Text
          style={{
            textAlign: "justify",
            lineHeight: 20,
            fontWeight: Platform.OS == "android" ? "bold" : "500",
            fontSize: reText(14),
            marginTop: 10,
          }}
        >
          {index + 1 + "."} {item.Name}
        </Text>
        <View style={{ marginTop: 10 }}>
          {item.val.map((itemV, indexV) => {
            return (
              <TouchableOpacity
                key={`${indexV}`}
                onPress={() => this.Choose(itemV)}
                style={{ flexDirection: "row", padding: 10 }}   
              >
                <Image
                  source={
                    itemV.DaChon
                      ? Images.icCheckboxActive
                      : Images.icCheckboxUnActive
                  }
                  style={nstyles.nIcon18}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontWeight: Platform.OS == "android" ? "bold" : "500",
                    fontSize: reText(14),
                    marginLeft: 10,
                  }}
                >
                  {itemV.Name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

export default ComponentCHvaLC;
