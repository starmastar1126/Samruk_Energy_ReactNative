import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Loading from "../../shared/components/Loading";
import i18n from "../../utils/i18n";
import axios from "../../plugins/axios";
import colors from "../../shared/state/colors";

const Header_Maximum_Height = 231;

const Header_Minimum_Height = 56;
export default class UserScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);

    let userId = this.props.navigation.getParam("id", null);
    if (userId == null) {
      alert("no user id provided");
    }

    this.state = {
      userId: userId,
      data: {},
      loading: false
    };

    this.fetchUserData = this.fetchUserData.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }

  async fetchUserData() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(`/api/user/${this.state.userId}`);
      console.log("-----------------------USER--------------------------");
      console.log(response);
      console.log("-----------------------------------------------------");
      this.setState({
        data: response.user
      });
    } catch (error) {
      alert(error);
    }
    this.setState({ loading: false });
  }
  addressBlock() {
    let views = [];
    if (
      this.state.data.floor_id == null &&
      this.state.data.cabinet_id == null &&
      this.state.data.workplace_id == null
    ) {
      return null;
    }
    let address = "";
    if (this.state.data.floor_id != null) {
      address += `${this.state.data.floor_id}, `;
    }
    if (this.state.data.cabinet_id != null) {
      address += `${this.state.data.cabinet_id}, `;
    }
    if (this.state.data.workplace_id != null) {
      address += `${this.state.data.workplace_id}, `;
    }
    address = address.substr(0, address.length - 2);
    views.push(
      <Text style={this.styles.title}>{i18n.t("employee.location")}</Text>
    );
    views.push(<Text style={this.styles.text}>{address}</Text>);

    return views;
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
      <View
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
            paddingTop: Header_Maximum_Height
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
              marginBottom: 26,
              backgroundColor: "#fff",
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#EBEBEB",
              borderTopWidth: 0
            }}
          >
            <Text
              style={{
                marginBottom: 7,
                fontSize: 14,
                textAlign: "center",
                color: "#979797"
              }}
            >
              {this.state.data.company ? this.state.data.company.name : ""}
            </Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                color: "#979797"
              }}
            >
              {this.state.data.description}
            </Text>
          </View>
          <Text style={this.styles.title}>{i18n.t("employee.department")}</Text>
          <Text style={this.styles.text}>
            {this.state.data.department ? this.state.data.department.name : ""}
          </Text>
          {this.addressBlock()}
          <Text style={this.styles.title}>
            {i18n.t("employee.internal_phone")}
          </Text>
          <Text style={this.styles.text}>10325</Text>
          {this.state.data.workphone && (
            <Text style={this.styles.title}>
              {i18n.t("employee.external_phone")}
            </Text>
          )}
          {this.state.data.workphone && (
            <Text style={this.styles.text}>{this.state.data.workphone}</Text>
          )}
          {this.state.data.mobilephone && (
            <Text style={this.styles.title}>
              {i18n.t("employee.mobile_phone")}
            </Text>
          )}
          {this.state.data.mobilephone && (
            <Text style={this.styles.text}>{this.state.data.mobilephone}</Text>
          )}
          <Text style={this.styles.title}>{i18n.t("employee.email")}</Text>
          <Text style={this.styles.text}>{this.state.data.email} </Text>
          {this.state.data.issues && (
            <Text style={this.styles.title}>
              {i18n.t("employee.responsibilities")}
            </Text>
          )}
          {this.state.data.issues && (
            <Text style={[this.styles.text, { paddingBottom: 23 }]}>
              {this.state.data.issues}
            </Text>
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
            source={
              this.state.data.avatar
                ? { uri: this.state.data.avatar }
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
            {`${this.state.data.lastname ? this.state.data.lastname : ""} ${
              this.state.data.givenname ? this.state.data.givenname : ""
            } ${this.state.data.fathername ? this.state.data.fathername : ""}`}
          </Animated.Text>
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
