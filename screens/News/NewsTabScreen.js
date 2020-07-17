import React, { Component } from "react";
import { TouchableOpacity, Dimensions, View, Text } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import colors from "../../shared/state/colors";
import urls from "../../shared/state/urls";
import axios from "../../plugins/axios";
import Loading from "../../shared/components/Loading";
import NewsListScreen from "./NewsListScreen";
const Header_Maximum_Height = 231;

const Header_Minimum_Height = 56;
export default class NewsTabScreen extends Component {
  _isMounted = false;
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("news.title"),
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
  componentWillUnmount() {
    this._isMounted = false;
  }
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: false,
      index: 0,
      routes: []
    };

    this.fetchCategories = this.fetchCategories.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchCategories();
  }
  async fetchCategories() {
    this._isMounted && this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(urls.news_categories);
      // this._isMounted &&
      //   this.setState({
      //     categories: response.categories
      //   });
      let routes = [];
      for (let i = 0; i < response.categories.length; i++) {
        if (response.categories[i].active !== "1") continue;
        routes.push({
          key: response.categories[i].id,
          title: response.categories[i].name
        });
      }
      this._isMounted && this.setState({ routes: routes });
    } catch (error) {
      console.log(error);
    }
    this._isMounted && this.setState({ loading: false });
  }

  render() {
    return (
      <View
        style={{
          position: "relative",
          width: "100%",
          height: "100%"
        }}
      >
        {this.state.loading && <Loading />}
        {this.state.routes.length > 0 && (
          <TabView
            navigationState={this.state}
            scrollEnabled={true}
            renderScene={({ route }) => {
              return (
                <NewsListScreen
                  navigation={this.props.navigation}
                  categoryId={route.key}
                />
              );
            }}
            renderTabBar={props => (
              <TabBar
                {...props}
                scrollEnabled={true}
                inactiveColor="#000000"
                activeColor={colors.blue}
                bounces={true}
                tabStyle={{
                  width: "auto",
                  backgroundColor: "#ffffff"
                }}
                style={{
                  backgroundColor: "#ffffff"
                }}
                indicatorStyle={{ backgroundColor: colors.blue }}
              />
            )}
            onIndexChange={index => this._isMounted && this.setState({ index })}
            initialLayout={{ width: Dimensions.get("window").width }}
          />
        )}
      </View>
    );
  }
}
