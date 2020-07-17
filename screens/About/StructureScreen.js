import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, FlatList } from "react-native";
import Loading from "../../shared/components/Loading";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";

export default class StructureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPage: null,
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

      let response = await instance.get(urls.structure);
      console.log(response);

      this.setState({
        data: response.orgstruct,
        loading: false
      });
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
      </View>
    );
  }
}
