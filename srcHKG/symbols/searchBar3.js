import React, { Component } from "react";
import Icon from "@builderx/icons";
import { View, TextInput, StyleSheet } from "react-native";

export default class searchBar3 extends Component {
  // Only for displaying symbol in BuilderX.
  static containerStyle = {
    height: 44,
    width: 375,
    defaultHeight: "fixed",
    defaultWidth: "fixed"
  };
  render() {
    return (
      <View style={[styles.root, this.props.style]}>
        <View style={styles.inputBox}>
          <Icon
            style={styles.inputLeftIcon}
            name="magnify"
            type="MaterialCommunityIcons"
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Tra cứu thủ tục hành chính"
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "#CECED2",
    padding: 8
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFF4",
    borderRadius: 64,
    borderWidth: 0,
  },
  inputLeftIcon: {
    alignSelf: "center",
    paddingRight: 5,
    paddingLeft: 5,
    color: "#000",
    fontSize: 20
  },
  inputStyle: {
    height: 32,
    flex: 1,
    alignSelf: "flex-start",
    fontSize: 15,
    fontFamily: "Roboto",
    lineHeight: 15,
    color: "#000"
  }
});
