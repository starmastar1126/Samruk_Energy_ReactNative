import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import colors from "../state/colors";
import styles from "../state/styles";

export default class InputErrorMessage extends Component {
  componentDidMount() {}
  render() {
    return (
      <View
        style={{
          width: "100%",
          position: "relative"
        }}
      >
        <Text
          style={{
            width: "100%",
            fontWeight: "300",
            backgroundColor: "#ffffff",
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 12,
            color: colors.red
          }}
        >
          {this.props.errorMessage}
        </Text>
        <Image
          style={styles.icon}
          source={require("../../assets/img/2x/warning.png")}
        />
      </View>
    );
  }
}
