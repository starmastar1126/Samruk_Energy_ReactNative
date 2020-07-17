import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";

export default class Loading extends Component {
  render() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,.2)"
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
