import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UsersScreen from "../UsersScreen";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";
import colors from "../../shared/state/colors";
import Loading from "../../shared/components/Loading";

export default class DepartmentsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.structural_divisions"),
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
      data: [],
      loading: false
    };

    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    this.setState({ loading: true });

    try {
      let instance = await axios.instance();
      let response = await instance.get(urls.departments);
      console.log(response);

      // if (response.users.current_page === 1) {
      //   this.setState({
      //     nextPage: response.users.next_page_url,
      //     data: response.users.data,
      //     loading: false
      //   });
      // } else {
      let data = this.state.data.concat(response.departments);
      this.setState({
        data: data,
        loading: false
      });
      // }
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false
      });
    }
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        {this.state.loading && <Loading />}
        <FlatList
          data={this.state.data}
          extraData={this.state}
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 20,
            paddingRight: 20
          }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 10
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.state.onRefresh}
            />
          }
          onEndReached={this.state.nextPage && this.state.nextPage}
          onEndReachedThreshold={400}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("Department", {
                    id: item.id,
                    title: item.name
                  });
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderWidth: 1,
                  marginBottom: 10,
                  borderColor: "#c4c4c4",
                  borderRadius: 3,
                  padding: 16,
                }}
              >
                <Image
                  style={{
                    borderRadius: 30,
                    width: 60,
                    borderWidth: 1,
                    borderColor: colors.blue,
                    height: 60,
                    marginRight: 17,
                    alignSelf: "center",
                  }}
                  source={(() => {
                    if (item.avatar)
                      return {
                        uri: item.avatar
                      };
                    return require("../../assets/img/male-avatar.png");
                  })()}
                />
                <View
                  style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    flexBasis: "auto"
                  }}
                >
                  <Text style={{
                    fontWeight: "500",
                    maxWidth: "100%",
                    fontSize: 12,
                    color: colors.blue,
                    marginBottom: 7
                  }}>{item.name}</Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginBottom: 8,
                      color: "#000000"
                    }}
                  >
                    {item.fullname}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#979797"
                    }}
                  >
                    {item.title}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      color: "#979797",
                      marginBottom: 9
                    }}
                  >
                    {item.company_name}
                  </Text> */}
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
        />
      </View>
    );
  }
}
