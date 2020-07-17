import React, { Component } from "react";
import { View, Image, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
// import GlobalState from "../../shared/state/GlobalState";

export default class SplashScreen extends Component {
  constructor() {
    super();
    this._bootstrapAsync = this._bootstrapAsync.bind(this);
    setTimeout(this._bootstrapAsync, 1000);
  }
  _bootstrapAsync = async () => {
    // await AsyncStorage.removeItem("me");
    // await AsyncStorage.removeItem("token");
    let user = await AsyncStorage.getItem("me");
    user = JSON.parse(user);
    if (user && !user.glpi_id) {
      console.log("---------------------------SPLASH--- REMOVING USER DATA");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("me");
    }
    // console.log(userToken);
    // GlobalState.token = userToken;
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    this.props.navigation.navigate(user && user.glpi_id ? "Main" : "Auth");
  };
  render() {
    return (
      <View
        height="100%"
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200
        }}
      >
        <Image
          source={require("../../assets/img/logo-icon.png")}
          style={{
            height: 67,
            width: 84,
            marginBottom: 32
          }}
        />
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
