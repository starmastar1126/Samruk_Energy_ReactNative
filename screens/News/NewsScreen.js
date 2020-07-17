import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import HTMLView from "react-native-htmlview";
import i18n from "../../utils/i18n";
import Loading from "../../shared/components/Loading";
import colors from "../../shared/state/colors";
import axios from "../../plugins/axios";
import urls from "../../shared/state/urls";

const Header_Maximum_Height = 231;

const Header_Minimum_Height = 56;
export default class NewsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      data: {}
    };
    this.getNews = this.getNews.bind(this);
  }
  componentDidMount() {
    this.getNews();
  }
  async getNews() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(
        `${urls.news}${this.props.navigation.getParam("id")}`
      );
      console.log(response.news.publication);
      this.setState({ data: response.news });
    } catch (error) {
      console.log(error);
    }
    this.setState({ loading: false });
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
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {this.state.loading && <Loading />}
        <ScrollView
          contentContainerStyle={{
            paddingTop: Header_Maximum_Height,
            paddingBottom: 20
          }}
          style={{
            paddingLeft: 20,
            paddingRight: 20
          }}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }
          ])}
        >
          <Text
            style={{
              paddingTop: 20,
              fontSize: 14,
              color: "#979797",
              marginBottom: 10
            }}
          >
            {this.state.data.publish_date}
          </Text>
          <Text
            style={{
              color: "#000000",
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 10
            }}
          >
            {this.state.data.title}
          </Text>
          <HTMLView value={this.state.data.publication} />
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
            source={
              this.state.data.mainimg
                ? { uri: this.state.data.mainimg }
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
        </Animated.View>
      </View>
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
      borderBottomColor: "#EBEBEB",
      textAlign: "center"
    }
  });
}
