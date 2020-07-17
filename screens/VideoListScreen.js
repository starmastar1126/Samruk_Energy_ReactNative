import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Linking,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../utils/i18n";
import axios from "../plugins/axios";

export default class VideoListScreen extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  async fetchData() {
    this._isMounted && this.setState({ refreshing: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(this.props.requestUrl);
      if (this.props.dataKey) {
        this._isMounted &&
          this.setState({ data: response[this.props.dataKey] });
      } else {
        this._isMounted && this.setState({ data: response });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    this._isMounted && this.setState({ refreshing: false });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  listEmpty() {
    return (
      <Text
        style={{
          fontSize: 18,
          color: "#000000",
          fontWeight: "300",
          paddingTop: 8
        }}
      >
        {i18n.t("tasks.no_videos")}
      </Text>
    );
  }
  render() {
    return (
      <FlatList
        data={this.state.data}
        extraData={this.state}
        style={{
          width: "100%",
          paddingTop: 15,
          paddingLeft: 20
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.fetchData}
          />
        }
        ListEmptyComponent={this.listEmpty}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Linking.canOpenURL(item.link).then(supported => {
                  if (supported) {
                    Linking.openURL(item.link);
                  } else {
                    console.log("Don't know how to open URI: " + item.link);
                  }
                });
              }}
              style={{
                borderBottomWidth: 1,
                borderColor: "#EBEBEB",
                position: "relative",
                marginBottom: 15,
                paddingBottom: 13,
                paddingLeft: 20,
                paddingRight: 20
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  marginBottom: 5
                }}
              >
                {item.name}
              </Text>
              {item.created_at && <Text style={{
                fontSize: 12,
                color: "#979797"
              }}>
                {item.created_at}
              </Text>}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
    );
  }
}
