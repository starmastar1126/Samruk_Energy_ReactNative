import React, { Component } from "react";
import { Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={this.styles.button} onPress={this.props.onPress}>
        <Image style={this.styles.leftIcon} source={this.props.icon} />
        <Text style={this.styles.text}>{this.props.title}</Text>
        {this.props.hasChildren && (
          <Icon
            size={20}
            color="#c4c4c4"
            name={
              this.props.childrenVisible
                ? "keyboard-arrow-up"
                : "keyboard-arrow-down"
            }
            style={this.styles.rightIcon}
          />
        )}
      </TouchableOpacity>
    );
  }

  styles = StyleSheet.create({
    leftIcon: {
      width: 20,
      marginRight: 11,
      flexBasis: 20,
      flexShrink: 0,
      flexGrow: 0
      // flex: "0 0 auto"
    },
    rightIcon: {
      marginLeft: 23,
      marginRight: 23,
      flexBasis: 20,
      flexShrink: 0,
      // position: "absolute",
      // right: 23,
      flexGrow: 0
      // flex: "0 0 auto"
    },
    text: {
      fontSize: 14,
      color: "#232323",
      flexGrow: 1
      // flex: "1 0 auto"
    },
    button: {
      paddingRight: 0,
      paddingLeft: 20,
      width: "100%",
      display: "flex",
      alignItems: "center",
      position: "relative",
      flexDirection: "row",
      justifyContent: "space-between",
      height: 48,
      backgroundColor: "#ffffff",
      borderBottomWidth: 1,
      borderBottomColor: "#c4c4c4"
    }
  });
}
