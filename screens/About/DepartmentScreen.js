import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import UsersScreen from "../UsersScreen";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";
import Loading from "../../shared/components/Loading";

export default class DepartmentScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: navigation.getParam("title")
    };
  };
  constructor(props) {
    super(props);
    console.log("Current screen: DepartmentsScreen");

    this.state = {
      data: [],
      id: this.props.navigation.getParam("id"),
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
      let response = await instance.get(`${urls.department}${this.state.id}`);
      console.log(
        "====================departments================================"
      );
      console.log(response);
      console.log(
        "==============================================================="
      );
      // if (response.users.current_page === 1) {
      //   this.setState({
      //     nextPage: response.users.next_page_url,
      //     data: response.users.data,
      //     loading: false
      //   });
      // } else {
      let data = this.state.data.concat(response.department.users);
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
        <UsersScreen
          style={{
            width: "100%",
            height: "100%"
          }}
          nextPage={this.state.nextPage && this.fetchData}
          navigation={this.props.navigation}
          data={this.state.data}
          nextNavigation="Employee"
        />
      </View>
    );
  }
}
