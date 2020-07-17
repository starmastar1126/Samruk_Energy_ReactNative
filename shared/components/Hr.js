import React, { Component } from "react";
import { View } from "react-native";
import colors from "../state/colors";

export default class Hr extends Component {
  componentDidMount() {}
  render() {
    return <View style={[this.styles, this.props.style]} />;
  }

  styles = {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray
  };
}
