import React, { Component } from "react";
import { FlatList, View, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "../utils/i18n";
import ButtonWithIcon from "../shared/components/ButtonWithIcon";
import Hr from "../shared/components/Hr";

export default class ListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title"),
      headerStyle: {
        backgroundColor: "#FFFFFF"
      },
      headerTintColor: "#000000"
    };
  };
  checkedIcon = require("../assets/img/2x/radio_checked.png");
  uncheckedIcon = require("../assets/img/2x/radio_unchecked.png");

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: this.props.navigation.getParam("selectedItem"),
      data: this.props.navigation.getParam("data"),
      key: this.props.navigation.getParam("persistingKey"),
      callback: this.props.navigation.getParam("callback")
    };

    this.select = this.select.bind(this);
  }
  render() {
    return (
      <FlatList
        data={this.state.data}
        extraData={this.state}
        style={{
          height: "100%",
          width: "100%",
          paddingLeft: 16,
          paddingRight: 16
        }}
        renderItem={({ item }) => {
          let icon = false;
          return (
            <View>
              <ButtonWithIcon
                icon={icon}
                title={item.name}
                onPress={() => {
                  this.select(item);
                }}
              />
              <Hr />
            </View>
          );
        }}
        keyExtractor={(item, index) => `${item.id}`}
      />
    );
  }
  async select(item) {
    try {
      await AsyncStorage.setItem(this.state.key, JSON.stringify(item));
      if (
        this.state.callback != null &&
        typeof this.state.callback === "function"
      ) {
        this.state.callback(this.state.key, item);
      }
    } catch (error) {
      if (__DEV__) {
        alert(error);
      }
    }

    this.props.navigation.goBack(null);
  }
}
