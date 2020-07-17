import React, { Component } from "react";
import { Text, TouchableOpacity } from "react-native";

export default class ChildMenuItem extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingRight: 20,
          paddingLeft: 20,
          backgroundColor: "#eeeeee"
        }}
        onPress={this.props.onPress}
      >
        <Text
          style={{
            fontSize: 14
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
