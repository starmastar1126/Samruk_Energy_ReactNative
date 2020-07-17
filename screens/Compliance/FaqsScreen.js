import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Loading from "../../shared/components/Loading";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";

export default class FaqsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.faq"),
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
    this.state = {
      loading: false,
      data: [],
      page: 1
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    if (this.state.page == null) return;
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(
        `${urls.compliance_faq}${this.state.page}`
      );
      let data = response.faqs.data;
      if (this.state.page > 1) {
        data = data.concat(this.state.data);
      }
      let page =
        this.state.page > response.faqs.last_page ? this.state.page + 1 : null;
      this.setState({
        data: data,
        page: page
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <View
        style={{
          position: "relative"
        }}
      >
        {this.state.loading && <Loading />}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {
                this.setState({ page: 1 });
                this.getData();
              }}
            />
          }
          data={this.state.data}
          extraData={this.state}
          style={{
            width: "100%",
            height: "100%"
          }}
          onEndReached={() => {
            this.state.page && this.fetchData();
          }}
          onEndReachedThreshold={400}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("Faq", {
                    title: item.title,
                    text: item.answer
                  });
                }}
                style={{
                  position: "relative",
                  borderBottomWidth: 1,
                  borderBottomColor: "#E0E0E0",
                  borderBottomStyle: "solid"
                }}
              >
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 16,
                    paddingTop: 13,
                    paddingBottom: 11,
                    lineHeight: 24,
                    paddingLeft: 20,
                    paddingRight: 55
                  }}
                >
                  {item.questions}
                </Text>
                <Icon
                  name="keyboard-arrow-right"
                  color="#DADADA"
                  size={24}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    marginTop: -12
                  }}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
        />
      </View>
    );
  }
}
