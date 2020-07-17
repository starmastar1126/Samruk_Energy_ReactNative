import React, { Component } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";

export default class FaqScreen extends Component {
  // static navigationOptions = ({ navigation, navigationOptions }) => {
  //   return {
  //     title: i18n.t("menu.faq"),
  //     headerLeft: (
  //       <TouchableOpacity
  //         onPress={navigation.toggleDrawer}
  //         style={{ marginLeft: 20 }}
  //       >
  //         <Icon name="arrow-back" size={24} color="#fff" />
  //       </TouchableOpacity>
  //     )
  //   };
  // };
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerStyle: {
        backgroundColor: "#FFFFFF"
      },
      headerTintColor: "#000000"
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.getParam("title"),
      text: this.props.navigation.getParam("text")
    };
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 14
          }}
        >
          {this.state.title}
        </Text>
        <Text
          style={{
            fontWeight: "300",
            fontSize: 14,
            lineHeight: 24
          }}
        >
          {this.state.text}
        </Text>
      </ScrollView>
    );
  }
}
