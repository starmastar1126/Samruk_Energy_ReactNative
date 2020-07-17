import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import VideoListScreen from "../VideoListScreen";
import i18n from "../../utils/i18n";
import urls from "../../shared/state/urls";

export default class VideosScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.videos"),
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
  render() {
    return (
      <VideoListScreen dataKey="videos" requestUrl={urls.compliance_videos} />
    );
  }
}
