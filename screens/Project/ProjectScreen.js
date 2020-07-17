import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../utils/i18n";
import colors from "../../shared/state/colors";
import urls from "../../shared/state/urls";
import Loading from "../../shared/components/Loading";
import axios from "../../plugins/axios";
import ProjectData from "./ProjectData";

const Header_Maximum_Height = 231;

const Header_Minimum_Height = 56;
export default class ProjectScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      project: {},
      routes: [],
      index: 0
    };

    this.fetchProject = this.fetchProject.bind(this);
  }

  async fetchProject() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(
        `${urls.project}${this.props.navigation.getParam("id")}`
      );
      console.log("response of projects");
      console.log(response);
      let routes = [];

      for (let i = 0; i < response.posts.length; i++) {
        routes.push({
          key: response.posts[i].id,
          title: response.posts[i].title,
          data: response.posts[i]
        });
      }
      this.setState({ project: response.project, routes: routes });
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.fetchProject();
  }

  render() {
    let range = Header_Maximum_Height - Header_Minimum_Height;

    const AnimateHeaderBackgroundOpacity = this.AnimatedHeaderValue.interpolate(
      {
        inputRange: [0, range],

        outputRange: [1.0, 0.0],

        extrapolate: "clamp"
      }
    );
    const TextColorAnimate = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, range],
      outputRange: ["#000", "#fff"],
      extrapolate: "clamp"
    });
    const BackgroundAnimation = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, range],
      outputRange: ["rgba(255,255,255,1)", "rgba(255,255,255,0)"],

      extrapolate: "clamp"
    });
    const AnimateHeaderHeight = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, range],

      outputRange: [Header_Maximum_Height, Header_Minimum_Height],

      extrapolate: "clamp"
    });
    return (
      <SafeAreaView
        style={[
          {
            width: "100%",
            height: "100%",
            position: "relative"
          },
          this.styles.MainContainer
        ]}
      >
        {this.state.loading && <Loading />}
        <ScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: Header_Maximum_Height - (Platform.OS == "ios" ? 24 : 0)
          }}
          style={{
            paddingLeft: 20,
            paddingRight: 20
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }
          ])}
        >
          <View
            style={{
              paddingTop: 7,
              paddingBottom: 14,
              paddingLeft: 22,
              paddingRight: 22,
              backgroundColor: "#fff",
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#EBEBEB"
            }}
          >
            <Text
              style={{
                marginBottom: 7,
                fontSize: 14,
                color: "#979797"
              }}
            >
              {this.state.project.number ? this.state.project.number : ""}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#979797"
              }}
            >
              {this.state.project.title}
            </Text>
          </View>
          {this.state.routes.length > 0 && (
            <TabView
              navigationState={this.state}
              scrollEnabled={true}
              renderScene={({ route }) => {
                return (
                  <ProjectData
                    navigation={this.props.navigation}
                    data={route.data}
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
                  indicatorStyle={{ backgroundColor: colors.blue, height: 2 }}
                />
              )}
              onIndexChange={index => this.setState({ index })}
            />
          )}
        </ScrollView>
        <Animated.View
          style={[
            this.styles.HeaderStyle,
            {
              height: AnimateHeaderHeight,
              backgroundColor: colors.blue
            }
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: 231,
              opacity: AnimateHeaderBackgroundOpacity
            }}
            resizeMode="cover"
            source={
              this.state.project.user && this.state.project.user.avatar
                ? { uri: this.state.project.user.avatar }
                : require("../../assets/img/male-avatar-big.png")
            }
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 56,
              width: 56,
              padding: 19,
              textAlgin: "center",
              zIndex: 100
            }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Icon size={18} name="arrow-back" color="#fff" />
          </TouchableOpacity>
          <Animated.Text
            style={[
              this.styles.HeaderInsideTextStyle,
              { backgroundColor: BackgroundAnimation, color: TextColorAnimate }
            ]}
          >
            {`${
              this.state.project.user && this.state.project.user.fullname
                ? this.state.project.user.fullname
                : ""
            }`}
          </Animated.Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  styles = StyleSheet.create({
    title: {
      fontSize: 12,
      color: "#979797",
      marginBottom: 5
    },
    text: {
      fontSize: 14,
      color: "#000000",
      marginBottom: 19
    },
    MainContainer: {
      flex: 1,
      paddingTop: Platform.OS == "ios" ? 20 : 0
    },

    HeaderStyle: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      overflow: "hidden",
      left: 0,
      right: 0,
      top: Platform.OS == "ios" ? 20 : 0
    },

    HeaderInsideTextStyle: {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 20,
      position: "absolute",
      bottom: 0,
      left: 20,
      right: 20,
      paddingTop: 18,
      paddingBottom: 18,
      paddingLeft: 22,
      paddingRight: 22,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      overflow: "hidden",
      borderBottomWidth: 2,
      borderBottomColor: "#EBEBEB"
    }
  });
}
