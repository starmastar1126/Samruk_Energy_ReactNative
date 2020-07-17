import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import colors from "../../shared/state/colors";
import urls from "../../shared/state/urls";
import Hr from "../../shared/components/Hr";

export default class ProcessOwnersScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("menu.business_process_owners"),
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
      let response = await instance.get(urls.process_owners);
      this.setState({
        data: response.process
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
        {i18n.t("project.no_process_owners")}
      </Text>
    );
  }
  businessProccess(processes) {
    if (!Array.isArray(processes)) return null;
    let view = [];
    for (let i = 0; i < processes.length; i++) {
      view.push(
        <View
          key={`processes_${i}`}
          style={{
            dislay: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: colors.blue,
              borderRadius: 2,
              marginRight: 6
            }}
          />
          <Text
            style={{
              lineHeight: 20,
              fontSize: 12,
              color: "#000"
            }}
          >
            {processes[i].name}
          </Text>
        </View>
      );
    }

    return view;
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <FlatList
          data={this.state.data}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.fetchData}
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
                  this.props.navigation.push("ProcessOwner", {
                    id: item.id
                  });
                }}
                style={{
                  marginBottom: 15,
                  borderRadius: 3,
                  borderWidth: 1,
                  padding: 16,
                  borderColor: "#c4c4c4"
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: 19,
                    alignItems: "center"
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
                    source={{ uri: item.user.avatar }}
                  />
                  <View
                    style={{
                      flexShrink: 1,
                      flexGrow: 1,
                      flexBasis: "auto"
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
                      {item.fullname}
                    </Text>
                    <Text
                      style={{
                        width: "100%",
                        fontSize: 12,
                        color: "#979797",
                        paddingRight: 14,
                        marginBottom: 5
                      }}
                    >
                      {item.workposition}
                    </Text>
                  </View>
                </View>
                <Hr
                  style={{
                    marginBottom: 14
                  }}
                />
                <Text
                  style={{
                    color: "#979797",
                    fontSize: 12,
                    lineHeight: 20,
                    marginBottom: 6
                  }}
                >
                  {i18n.t("project.business_process_owner")}
                </Text>
                {this.businessProccess(item.owner)}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
        />
      </View>
    );
  }
}
