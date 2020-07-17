import React, { Component } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  RefreshControl
} from "react-native";
import colors from "../../shared/state/colors";
import statuses from "../../shared/state/task_statuses";
import axios from "../../plugins/axios";
import Loading from "../../shared/components/Loading";
import i18n from "../../utils/i18n";

export default class TasksScreen extends Component {
  _isMounted = false;
  // static navigationOptions = ({ navigation, navigationOptions }) => {
  //   return {
  //     title: i18n.t("technical_support"),
  //     headerLeft: (
  //       <TouchableOpacity
  //         onPress={navigation.getParam("exit")}
  //         style={{ marginRight: 20 }}
  //       >
  //         <Image
  //           style={{ width: 24, height: 24, alignContent: "center" }}
  //           source={require("../../assets/img/2x/exit.png")}
  //         />
  //       </TouchableOpacity>
  //     )
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      data: []
    };

    this.getData = this.getData.bind(this);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.getData();
  }
  async getData() {
    this._isMounted && this.setState({ refreshing: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(this.props.url);
      console.log(response.tickets);
      this._isMounted && this.setState({ data: response.tickets });
    } catch (error) {
      console.log(error);
    }

    this._isMounted && this.setState({ refreshing: false });
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
        {i18n.t("tasks.no_owned_tasks")}
      </Text>
    );
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
        <FlatList
          data={this.state.data}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getData}
            />
          }
          ListEmptyComponent={this.listEmpty}
          style={{
            width: "100%",
            paddingTop: 16,
            paddingLeft: 16,
            paddingRight: 16
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push("Task", {
                    taskId: item.id
                  });
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "#C4C4C4",
                  borderRadius: 3,
                  marginBottom: 10,
                  paddingTop: 16,
                  paddingBottom: 16,
                  paddingRight: 20,
                  paddingLeft: 20
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 9
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#979797",
                    marginBottom: 8
                  }}
                >
                  {item.date_creation}
                </Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
                  <Text
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      color: "#ffffff",
                      height: 24,
                      display: "flex",
                      lineHeight: 20,
                      borderRadius: 12,
                      backgroundColor: statuses[item.status].color
                    }}
                  >
                    {statuses[item.status].name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
        />
        {this.props.canCreateNewTask && (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push("NewTask");
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.blue,
              padding: 16,
              position: "absolute",
              right: 20,
              bottom: 23,
              boxShadow: "6px 0 6px rgba(0,0,0,.24)"
            }}
          >
            <Image
              source={require("../../assets/img/plus.png")}
              style={{
                width: 24,
                height: 24
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
