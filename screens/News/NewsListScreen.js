import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  RefreshControl
} from "react-native";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";
import i18n from "../../utils/i18n";

export default class NewsListScreen extends Component {
  constructor(props) {
    super(props);
    this.fetchNews = this.fetchNews.bind(this);
    this.listEmpty = this.listEmpty.bind(this);
    this.state = {
      loading: false,
      data: [],
      page: 1
    };
  }
  componentDidMount() {
    this.fetchNews();
  }
  async fetchNews() {
    if (!this.state.page) return;
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(
        `${urls.category_news}${this.props.categoryId}?page=${this.state.page}`
      );
      let page = this.state.page + 1;
      this.setState({
        data: response.news.data,
        page: page >= response.news.last_page ? null : page
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
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
        {i18n.t("news.no_news")}
      </Text>
    );
  }
  render() {
    return (
      <View
        style={{
          position: "relative"
        }}
      >
        <FlatList
          data={this.state.data}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {
                this.setState({ page: 1 });
                this.fetchNews();
              }}
            />
          }
          ListEmptyComponent={this.listEmpty}
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 20,
            paddingRight: 20
          }}
          onEndReached={() => {
            this.state.page && this.fetchNews();
          }}
          onEndReachedThreshold={400}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("News", {
                    id: item.id,
                    title: item.name
                  });
                }}
                style={{
                  marginTop: 20,
                  borderColor: "#C4C4C4",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderRadius: 3,
                  overflow: "hidden",
                  paddingBottom: 19
                }}
              >
                <Image
                  source={{ uri: item.mainimg }}
                  style={{
                    width: "100%",
                    height: 180,
                    marginBottom: 13
                  }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    paddingLeft: 29,
                    paddingRight: 29,
                    fontWeight: "500",
                    fontSize: 14,
                    marginBottom: 8
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    paddingLeft: 29,
                    paddingRight: 29,
                    fontSize: 14,
                    color: "#979797"
                  }}
                >
                  {item.publish_date}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
        />
      </View>
    );
  }
}
