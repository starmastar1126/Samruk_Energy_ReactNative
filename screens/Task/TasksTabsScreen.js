import React, { Component } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import TasksScreen from "./TasksScreen";
import VideoListScreen from "../VideoListScreen";
import colors from "../../shared/state/colors";
import urls from "../../shared/state/urls";

export default class TasksTabsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("technical_support"),
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
      index: 0,
      routes: [
        { key: "own_tasks", title: i18n.t("own_tasks") },
        { key: "working_tasks", title: i18n.t("working_tasks") },
        { key: "video_tutorials", title: i18n.t("video_tutorials") }
      ]
    };
  }

  render() {
    return (
      <TabView
        navigationState={this.state}
        scrollEnabled={true}
        renderScene={({ route }) => {
          switch (route.key) {
            case "own_tasks":
              return (
                <TasksScreen
                  navigation={this.props.navigation}
                  url={urls.my_tasks}
                  canCreateNewTask={true}
                />
              );
            case "working_tasks":
              return (
                <TasksScreen
                  navigation={this.props.navigation}
                  url={urls.assigned_tasks}
                  canCreateNewTask={false}
                />
              );
            case "video_tutorials":
              return <VideoListScreen requestUrl={urls.task_help_video} />;
          }
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
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
    );
  }
}
