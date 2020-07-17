import React, { Component } from "react";
import { Image, View, Text } from "react-native";
import { StackActions } from "react-navigation";
import i18n from "../../utils/i18n";
import Button from "../../shared/components/Button";
import styles from "../../shared/state/styles";

export default class SuccessScreen extends Component {
  static navigationOptions = {
    title: i18n.t("ticket_sent"),
    headerTitleStyle: {
      textAlign: "center",
      width: "100%",
      paddingRight: 86
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.navigation.getParam("message")
    };
    this.closeMe = this.closeMe.bind(this);
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          padding: 20,
          position: "relative"
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              height: 92,
              width: 96
            }}
            source={require("../../assets/img/2x/success.png")}
            height={92}
            width={96}
          />
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: "#000000",
              fontWeight: "300",
              marginTop: 18
            }}
          >
            {this.state.message}
          </Text>
        </View>
        <Button
          onPress={this.closeMe}
          style={styles.button}
          title={i18n.t("close")}
        />
      </View>
    );
  }

  closeMe() {
    this.props.navigation.goBack(null);
  }
}
