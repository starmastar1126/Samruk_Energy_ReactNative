import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import urls from "../../shared/state/urls";
import DocumentListScreen from "../DocumentListScreen";

export default class EducationalScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.training_materials"),
      headerLeft: (
        <TouchableOpacity
          onPress={navigation.toggleDrawer}
          style={{ marginLeft: 20 }}
        >
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
  }
  render() {
    return <DocumentListScreen fetchUrl={urls.educational_materials} />;
  }
}
