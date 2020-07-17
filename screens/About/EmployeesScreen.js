import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UsersScreen from "../UsersScreen";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";
import Loading from "../../shared/components/Loading";

export default class EmployeesScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.employees"),
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
    console.log("Current screen: EmployeesScreen");

    this.state = {
      nextPage: null,
      data: [],
      refreshing: false
    };

    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    this.setState({ loading: true });
    if (this.state.nextPage === urls.employees) {
      this.setState({
        refreshing: true
      });
    }
    try {
      let instance = await axios.instance();
      let url = this.state.nextPage;
      if (!url && this.state.data.length > 0) {
        console.log(url);
        console.log(this.state.data);
        return;
      }
      if (!url) {
        url = urls.employees;
      }
      let response = await instance.get(url);
      console.log(response);

      // if (response.users.current_page === 1) {
      //   this.setState({
      //     nextPage: response.users.next_page_url,
      //     data: response.users.data,
      //     loading: false
      //   });
      // } else {
      let data = this.state.data.concat(response.users.data);
      this.setState({
        nextPage: response.users.next_page_url,
        data: data
      });
      // }
    } catch (error) {
      console.log(error);
    }
    this.setState({
      refreshing: false
    });
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
        <UsersScreen
          style={{
            width: "100%",
            height: "100%"
          }}
          nextPage={this.state.nextPage && this.fetchData}
          navigation={this.props.navigation}
          data={this.state.data}
          nextNavigation="Employee"
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({ nextPage: urls.employees });
            this.fetchData();
          }}
        />
      </View>
    );
  }
}
