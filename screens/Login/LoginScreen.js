import React, { Component } from "react";
import { Image, View, Text, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "../../plugins/axios";
import i18n from "../../utils/i18n";
import ButtonWithIcon from "../../shared/components/ButtonWithIcon";
import Hr from "../../shared/components/Hr";
import Loading from "../../shared/components/Loading";
import Button from "../../shared/components/Button";
import styles from "../../shared/state/styles";
import urls from "../../shared/state/urls";

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loginable: false
    };

    this.login = this.login.bind(this);
    this.getOrganization = this.getOrganization.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.calculateLoginable = this.calculateLoginable.bind(this);
    this.loginEntered = this.loginEntered.bind(this);
    this.passwordEntered = this.passwordEntered.bind(this);

    this.props.navigation.addListener("didFocus", payload => {
      this.getOrganization();
      this.calculateLoginable();
    });
  }

  async getOrganization() {
    let organization = await AsyncStorage.getItem("organization");
    if (organization != null) {
      this.setState({ organization: JSON.parse(organization), loading: false });
    } else {
      this.setState({ loading: false });
    }
  }
  render() {
    return (
      <View height="100%">
        {this.state.loading && <Loading />}
        <ScrollView
          style={{ height: "100%", backgroundColor: "#ffffff" }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            style={{
              width: "100%",
              minHeight: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 21
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
                style={{ height: 66, width: 211, marginBottom: 18 }}
                source={require("../../assets/img/logo.png")}
              />
              <Text
                style={{
                  width: "100%",
                  paddingLeft: 32,
                  paddingRight: 32,
                  marginBottom: 56,
                  fontSize: 14,
                  textAlign: "center"
                }}
              >
                {i18n.t("login_title")}
              </Text>
              <Hr />
              <ButtonWithIcon
                title={
                  this.state.organization == null
                    ? i18n.t("login_organization")
                    : this.state.organization.name
                }
                onPress={this.selectOrganization}
              />
              <Hr style={{ marginBottom: 17 }} />
              <View style={{ width: "100%", marginBottom: 17 }}>
                <TextInput
                  onChangeText={this.loginEntered}
                  style={styles.input}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onSubmitEditing={() => {
                    this.passwordInput.focus();
                  }}
                  blurOnSubmit={false}
                  placeholder={i18n.t("login")}
                  editable={!this.state.loading}
                />
              </View>
              <TextInput
                secureTextEntry={true}
                ref={input => {
                  this.passwordInput = input;
                }}
                onChangeText={this.passwordEntered}
                style={[styles.input, { marginBottom: 17 }]}
                placeholder={i18n.t("password")}
                editable={!this.state.loading}
              />
            </View>

            <Button
              disabled={!this.state.loginable}
              onPress={this.login}
              style={styles.button}
              title={i18n.t("login_enter")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  async selectOrganization() {
    if (!this.state.organizations) {
      this.setState({ loading: true });
      try {
        let instance = await axios.instance();
        let content = await instance.get(urls.organizations);
        console.log(content);
        this.setState({ organizations: content });
      } catch (error) {
        alert(JSON.stringify(error));
        this.setState({ loading: false });
        return;
      }
    }
    this.props.navigation.push("List", {
      title: i18n.t("organizations"),
      data: this.state.organizations,
      persistingKey: "organization",
      selectedItem: this.state.organization
    });
    this.setState({ loading: false });
  }

  calculateLoginable() {
    let state = this.state;

    let loginable =
      !state.loading &&
      this.state.organization &&
      this.state.organization.id &&
      state.login != null &&
      state.login != "" &&
      state.password != null &&
      state.password != "";
    this.setState({ loginable });
  }

  async loginEntered(login) {
    await this.setState({ login });
    this.calculateLoginable();
  }

  async passwordEntered(password) {
    await this.setState({ password });
    this.calculateLoginable();
  }
  async login() {
    try {
      this.setState({ loading: true });
      let data = {
        username: this.state.login,
        password: this.state.password,
        organization: this.state.organization.id
      };
      let instance = await axios.instance();
      let response = await instance.post(urls.login, data);
      let userData = response;
      userData.glpi_id = userData.user_glpi.id;
      delete userData.user_glpi;
      await AsyncStorage.setItem("me", JSON.stringify(userData));

      this.setState({ loading: false });
      this.props.navigation.navigate("Main");
    } catch (error) {
      this.setState({ loading: false });
      if (error.response && error.response.data && error.response.data.message)
        alert(error.response.data.message);
      else {
        if (
          error.request &&
          error.request._hasError &&
          error.request &&
          error.request._response
        )
          alert(error.request._response);
        else {
          console.log(`Login error`);
          console.log(error);
        }
      }
    }
  }
}
