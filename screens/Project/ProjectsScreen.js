import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import Loading from "../../shared/components/Loading";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";

export default class ProjectScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.projects"),
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
      page: 1,
      loading: false
    };
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    this.setState({
      loading: true
    });
    try {
      let instance = await axios.instance();
      let response = await instance.get(urls.projects);
      this.setState({
        data: response.projects
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
        {i18n.t("project.no_projects")}
      </Text>
    );
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {this.state.loading && <Loading />}
        <FlatList
          data={this.state.data}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.getData}
            />
          }
          ListEmptyComponent={this.listEmpty}
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 15
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("Project", {
                    id: item.id
                  });
                }}
                style={{
                  marginBottom: 15,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: "#c4c4c4",
                  borderStyle: "solid",
                  padding: 16,
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    flexShrink: 0,
                    flexBasis: 60,
                    marginRight: 17,
                    borderWidth: 1,
                    borderColor: "#0065ae"
                  }}
                  source={
                    item.user
                      ? { uri: item.user.avatar }
                      : require("../../assets/img/male-avatar.png")
                  }
                />
                <View
                  style={{
                    flexShrink: 1,
                    flexGrow: 1,
                    flexBasis: "100%"
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 14,
                      marginBottom: 5,
                      color: "#000000"
                    }}
                  >
                    {item.number}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#979797",
                      marginBottom: 5
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#979797"
                    }}
                  >
                    {item.user ? item.user.fullname : ""}
                  </Text>
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
