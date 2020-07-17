import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Text
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Modal from "react-native-modalbox";
import axios from "../../plugins/axios";
import i18n from "../../utils/i18n";
import ButtonWithIcon from "../../shared/components/ButtonWithIcon";
import StatedInput from "../../shared/components/StatedInput";
import InputErrorMessage from "../../shared/components/InputErrorMessage";
import Loading from "../../shared/components/Loading";
import Button from "../../shared/components/Button";
import Hr from "../../shared/components/Hr";
import styles from "../../shared/state/styles";
import colors from "../../shared/state/colors";
import urls from "../../shared/state/urls";

export default class NewTaskScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("ticket_screen_title")
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loadingCategory: false,
      loadingSubcategory: false,
      category: null,
      subcategory: null,
      sendable: false,
      loading: false,
      title: null,
      description: null,
      errors: {}
    };

    let methods = [
      "selectCategory",
      "selectSubcategory",
      "select",
      "getCategory",
      "getSubcategory",
      "send",
      "selected",
      "exit",
      "logout"
    ];

    for (let i = 0; i < methods.length; i++) {
      this[methods[i]] = this[methods[i]].bind(this);
    }

    this.props.navigation.addListener("didFocus", async payload => {
      await this.getCategory();
      await this.getSubcategory();
    });
  }

  async logout() {
    await AsyncStorage.removeItem("token");
    this.props.navigation.navigate("Auth");
  }

  async exit() {
    this.refs.alert.open();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    this.props.navigation.setParams({ exit: this.exit });
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  renderLoading() {
    if (
      this.state.loadingCategory ||
      this.state.loadingSubcategory ||
      this.state.loading
    )
      return <Loading />;

    return null;
  }
  _keyboardDidShow() {}

  _keyboardDidHide() {}
  render() {
    return (
      <SafeAreaView height="100%">
        {this.renderLoading()}
        <View height="100%">
          <ScrollView
            style={{ height: "100%", backgroundColor: "#ffffff" }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{
                position: "relative",
                width: "100%",
                minHeight: "100%",
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 21
              }}
            >
              <View
                style={{
                  flexBasis: "auto",
                  flexGrow: 1,
                  flexShrink: 1
                }}
              >
                <ButtonWithIcon
                  title={
                    this.state.category == null
                      ? i18n.t("ticket_category")
                      : this.state.category.name
                  }
                  onPress={this.selectCategory}
                />
                <Hr
                  style={[
                    (() => {
                      return this.state.errors.category === true
                        ? { borderBottomColor: colors.red }
                        : null;
                    })()
                  ]}
                />
                {(() => {
                  return this.state.errors.category === true ? (
                    <InputErrorMessage
                      errorMessage={i18n.t("ticket_select_category_warning")}
                    />
                  ) : null;
                })()}
                <ButtonWithIcon
                  disabled={this.state.category === null}
                  title={
                    this.state.subcategory == null
                      ? i18n.t("ticket_subcategory")
                      : this.state.subcategory.name
                  }
                  onPress={this.selectSubcategory}
                />
                <Hr
                  style={[
                    (() => {
                      return this.state.errors.subcategory === true
                        ? { borderBottomColor: colors.red }
                        : null;
                    })()
                  ]}
                />
                {(() => {
                  return this.state.errors.subcategory === true ? (
                    <InputErrorMessage
                      errorMessage={i18n.t("ticket_select_subcategory_warning")}
                    />
                  ) : null;
                })()}

                <StatedInput
                  returnKeyType="next"
                  onChangeText={value => {
                    let errors = this.state.errors;
                    if (value == null || value.trim() == "") {
                      errors.title = true;
                    } else {
                      errors.title = false;
                    }
                    this.setState({ title: value, errors: errors });
                  }}
                  onSubmitEditing={() => {
                    this.descriptionInput.focus();
                  }}
                  placeholder={i18n.t("ticket_title")}
                  editable={!this.state.loading}
                  errorMessage={i18n.t("ticket_enter_title_warning")}
                  value={this.state.title}
                  error={this.state.errors.title}
                />
                <StatedInput
                  refProp={input => {
                    this.descriptionInput = input;
                  }}
                  onChangeText={value => {
                    let errors = this.state.errors;
                    if (value == null || value.trim() == "") {
                      errors.description = true;
                    } else {
                      errors.description = false;
                    }
                    this.setState({ description: value, errors: errors });
                  }}
                  style={{
                    height: 120
                  }}
                  placeholder={i18n.t("ticket_description")}
                  editable={!this.state.loading}
                  errorMessage={i18n.t("ticket_enter_description_warning")}
                  multiline={true}
                  value={this.state.description}
                  numberOfLines={4}
                  error={this.state.errors.description}
                />
              </View>

              <Button
                disabled={this.state.sendable}
                onPress={this.send}
                style={[
                  styles.button,
                  {
                    position: "absolute",
                    bottom: 0
                  }
                ]}
                title={i18n.t("ticket_send")}
              />
              <KeyboardSpacer />
            </View>
          </ScrollView>
          <Modal
            style={styles.alert}
            coverScreen={true}
            position="center"
            backdropPressToClose={true}
            ref="alert"
          >
            <Text style={styles.alertTitle}>{i18n.t("exit_alert_title")}</Text>
            <Text style={styles.alertDescription}>
              {i18n.t("exit_alert_description")}
            </Text>
            <View style={styles.alertActions}>
              <TouchableOpacity
                style={{
                  marginRight: 8
                }}
                onPress={() => this.refs.alert.close()}
              >
                <Text
                  style={[
                    styles.alertButton,
                    {
                      color: colors.blue
                    }
                  ]}
                >
                  {i18n.t("cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.logout}>
                <Text
                  style={[
                    styles.alertButton,
                    {
                      color: colors.red
                    }
                  ]}
                >
                  {i18n.t("exit")}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }

  async send() {
    this.setState({ loading: true });
    let errors = this.state.errors;
    let hasErrors = false;
    if (this.state.category == null) {
      errors.category = true;
      hasErrors = true;
    } else {
      errors.category = false;
    }
    if (this.state.subcategory == null) {
      errors.subcategory = true;
      hasErrors = true;
    } else {
      errors.subcategory = false;
    }
    if (this.state.title == null || this.state.title.trim() == "") {
      errors.title = true;
      hasErrors = true;
    } else {
      errors.title = false;
    }
    if (this.state.description == null || this.state.description.trim() == "") {
      errors.description = true;
      hasErrors = true;
    } else {
      errors.description = false;
    }

    if (hasErrors) {
      this.setState({
        errors: errors,
        loading: false
      });
      return;
    }
    this.setState({ errors: errors });
    try {
      let instance = await axios.instance();
      let response = await instance.post(urls.new_ticket, {
        title: this.state.title,
        text: this.state.description,
        category_id: this.state.category.id,
        subcategory_id: this.state.subcategory.id
      });
      this.setState({
        loading: false,
        title: "",
        description: "",
        category: null,
        subcategory: null
      });

      await AsyncStorage.removeItem("category");
      await AsyncStorage.removeItem("subcategory");

      if (this.props.navigation.replace) {
        console.log("SUCCESS");
      } else {
        console.log("ERRORRRRRR");
      }

      this.props.navigation.replace("Task", {
        isNew: true,
        taskId: response.ticket.id
      });
    } catch (error) {
      this.setState({ loading: false });
      if (error.response) {
        if (error.response.status === 403) {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("me");
          this.props.navigation.navigate("Auth");
        }

        if (error.response.data && error.response.data.message)
          alert(error.response.data.message);
      }

      if (__DEV__) {
        console.log(error);
      }
    }
  }

  async getCategory() {
    let category = await this.getItem("category");
    if (category != null && category.id != null) {
      let errors = this.state.errors;
      errors.category = false;
      this.setState({ errors: errors });
    }
  }
  async getSubcategory() {
    let subcategory = await this.getItem("subcategory");

    if (subcategory != null && subcategory.id != null) {
      let errors = this.state.errors;
      errors.subcategory = false;
      this.setState({ errors: errors });
    }
  }

  async getItem(key) {
    let data = null;
    let item = await AsyncStorage.getItem(key);
    if (item != null) {
      data = JSON.parse(item);
      let state = {};
      state[key] = data;
      this.setState(state);
    }
    return data;
  }

  async select(keySingular, keyPlural, url) {
    let loadingData = {};
    let capitalize = string => {
      return string.substr(0, 1).toUpperCase() + string.substr(1);
    };
    let loadingDataKey = "loading" + capitalize(keySingular);
    loadingData[loadingDataKey] = true;

    if (this.state[keyPlural] == null || !this.state[keyPlural]) {
      this.setState(loadingData);
      try {
        let instance = await axios.instance();
        let response = await instance.get(url);
        let data = {};
        data[keyPlural] = response;
        this.setState(data);
      } catch (error) {
        loadingData[loadingDataKey] = false;
        this.setState(loadingData);

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        )
          alert(error.response.data.message);
        if (__DEV__) {
          alert(JSON.stringify(error));
        }
        return;
      }
    }
    loadingData[loadingDataKey] = false;
    this.setState(loadingData);

    this.props.navigation.push("List", {
      title: i18n.t("ticket_list_screen_title_" + keyPlural),
      data: this.state[keyPlural],
      persistingKey: keySingular,
      selectedItem: this.state[keySingular],
      callback: this.selected
    });
  }

  async selected(key, value) {
    if (
      key === "category" &&
      this.state.category != null &&
      value.id !== this.state.category.id
    ) {
      await AsyncStorage.removeItem("subcategory");
      await this.setState({ subcategories: null });
      await this.setState({ subcategory: null });
      await this.setState({ sendable: false });
    }
  }

  async selectCategory() {
    await this.select("category", "categories", urls.categories);
  }

  async selectSubcategory() {
    if (this.state.category === null) {
      alert(i18n.t("ticket_select_category_first"));
      return;
    }

    let url = urls.subcategories.replace("{:id}", this.state.category.id);
    await this.select("subcategory", "subcategories", url);
  }
}
