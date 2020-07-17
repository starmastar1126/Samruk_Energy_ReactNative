import React, { Component } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { i18n } from "../../utils/i18n";
import UsersScreen from "../UsersScreen";

export default class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }
  render() {
    return (
      <View
        style={{
          height: "100%",
          display: "flex"
        }}
      >
        <View
          style={{
            display: "flex",
            flexShrink: 1,
            flexGrow: 0,
            flexBasis: "auto"
          }}
        >
          <TouchableOpacity
            style={{
              flexBasis: 56,
              flexShrink: 0,
              flexGrow: 0,
              height: 56,
              width: 56,
              padding: 19,
              textAlgin: "center",
              zIndex: 100
            }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Icon size={18} name="arrow-back" color="#000" />
          </TouchableOpacity>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#000",
              borderRadius: 3
            }}
            placeholder={i18n.t("search")}
          />
        </View>
        <UsersScreen
          style={{
            flexBasis: "100%",
            flexGrow: 1,
            flexShrink: 1
          }}
          contentContainerStyle={{
            paddingTop: 11,
            paddingBottom: 11,
            paddingLeft: 20,
            paddingRight: 20
          }}
          navigation={this.props.navigation}
          nextNavigation="Employee"
          data={this.state.data}
        />
      </View>
    );
  }
}
