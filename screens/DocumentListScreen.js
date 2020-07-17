import React, { Component } from "react";
import { Image, FlatList, TouchableOpacity, Text, View } from "react-native";
import axios from "../plugins/axios";
import Loading from "../shared/components/Loading";

export default class DocumentListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: []
    };

    this.fetchDocuments = this.fetchDocuments.bind(this);
  }
  componentDidMount() {
    this.fetchDocuments();
  }
  async fetchDocuments() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(this.props.fetchUrl);
      this.setState({ data: response.posts });
    } catch (error) {
      console.log(error);
    }

    this.setState({ loading: false });
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
        <FlatList
          data={this.state.data}
          extraData={this.state}
          style={{
            width: "100%",
            paddingTop: 15,
            paddingLeft: 20
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#EBEBEB",
                  position: "relative",
                  marginBottom: 15,
                  paddingBottom: 13,
                  paddingLeft: 37,
                  paddingRight: 20
                }}
              >
                <Image
                  source={require("../assets/img/document-icon.png")}
                  width={24}
                  height="auto"
                  style={{
                    position: "absolute",
                    top: 17,
                    left: 0
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    marginBottom: 5
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#979797",
                    marginBottom: 8
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
