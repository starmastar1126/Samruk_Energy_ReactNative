import React, { Component } from "react";
import { Rating, AirbnbRating } from "react-native-ratings";
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity
} from "react-native";
import Toast from "react-native-root-toast";
import Modal from "react-native-modalbox";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../../shared/state/styles";
import i18n from "../../utils/i18n";
import statuses from "../../shared/state/task_statuses";
import urls from "../../shared/state/urls";
import axios from "../../plugins/axios";
import Hr from "../../shared/components/Hr";
import colors from "../../shared/state/colors";
import TaskActions from "./TaskActions";
import TaskComments from "./TaskComments";

export default class TaskScreen extends Component {
  _isMounted = false;
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerStyle: {
        backgroundColor: "#FFFFFF"
      },
      headerTintColor: "#000000"
    };
  };
  constructor(props) {
    super(props);
    let taskId = this.props.navigation.getParam("taskId", null);
    if (taskId == null) {
      alert("no ticket id provided");
    }
    this.state = {
      detailsOpen: true,
      refreshing: false,
      comment: null,
      id: taskId,
      data: {},
      loading: false,
      me: {}
    };

    this.fetchData = this.fetchData.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.take = this.take.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.changeTaskStatus = this.changeTaskStatus.bind(this);
    this.closeSuccess = this.closeSuccess.bind(this);
    this.updateState = this.updateState.bind(this);
  }
  ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }
  async fetchUserData() {
    let data = await AsyncStorage.getItem("me");
    data = JSON.parse(data);
    this._isMounted && this.setState({ me: data });
  }
  async fetchData() {
    this._isMounted && this.setState({ refreshing: true });
    try {
      let instance = await axios.instance();
      let response = await instance.get(urls.task + this.state.id);
      let __me = this.state.me;
      console.log(response.ticket.comments);
      // __me.id = response.ticket.assigned_user;
      this._isMounted && this.setState({ data: response.ticket });
    } catch (error) { }
    this._isMounted && this.setState({ refreshing: false });
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchUserData();
    this.fetchData();

    if (this.props.navigation.getParam("isNew")) {
      this.refs.success.open();
      setTimeout(this.closeSuccess, 3000);
    }
  }
  closeSuccess() {
    this.refs.success.close();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  updateState(obj) {
    if (obj instanceof Object) {
      this.setState(prevState => Object.assign({}, prevState, obj));
    }
  }
  async take() {
    this._isMounted && this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.post(urls.take_task + this.state.data.id, {
        id: this.state.data.id
      });
      this.changeTaskStatus("take");
    } catch (error) {
      console.log(error);
    }
    this._isMounted && this.setState({ loading: false });
  }
  toast(message) {
    return Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true
    });
  }
  async sendAction() {
    this.refs.alert.close();
    let toast = this.toast(i18n.t("task.status_saving"));
    try {
      let payload = {};
      let action = this.state.action;
      if (action) {
        payload[this.state.action] = 1;
      }
      payload.content = this.state.comment;
      let instance = await axios.instance();
      let response = await instance.post(
        `${urls.task_close}${this.state.data.id}`,
        payload
      );
      this.changeTaskStatus(action);
      this.setState({ action: null });
      toast.hide();
      toast = toast(i18n.t("task.status_saved"));
    } catch (error) {
      console.log(error);
    }
  }
  changeTaskStatus(action) {
    if (!action) return;
    let data = this.state.data;
    switch (action) {
      case "take":
        data.status = 3;
        break;
      case "reject_ticket":
        this.props.navigation.goBack();
        return;
      case "approve_ticket":
        break;
      case "waiting_solution":
        data.status = 4;
        break;
      case "solution":
        data.status = 5;
        break;
      case "reopen":
        data.status = 1;
        break;
      case "close":
        data.status = 6;
        break;
    }
    this.setState({ data: data });
  }
  async rate() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = axios.post();
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          background: "#e5e5e5"
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 20
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchData}
            />
          }
          style={{
            position: "relative"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "500",
              color: "#000"
            }}
          >
            {this.state.data.name}
          </Text>
          <TaskActions
            style={{
              marginTop: 23
            }}
            isOwner={this.state.me.glpi_id === this.state.data.iniciator}
            assignedUser={
              this.state.me.glpi_id === this.state.data.assigned_user
            }
            status={this.state.data.status}
            onAction={action => {
              if (action === "solved") {
                this.refs.rate.open();
                return;
              }
              this.setState({ action: action });
              this.refs.alert.open();
            }}
          />
          {((this.state.data.status === 5 &&
            this.state.data.iniciator === this.state.me.glpi_id) ||
            (this.state.data.status === 3 &&
              this.state.me.glpi_id === this.state.data.assigned_user)) && (
              <TouchableOpacity
                style={{
                  position: "relative",
                  paddingTop: 15,
                  paddingBottom: 15,
                  marginTop: 21,
                  borderTopWidth: 1,
                  borderTopColor: "#DADADA"
                }}
                onPress={() => {
                  this.setState({ detailsOpen: !this.state.detailsOpen });
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: "#000000"
                }}>{i18n.t("task.task_details_title")}</Text>
                <Icon
                  name={
                    this.state.detailsOpen
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="#979797"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%"
                  }}
                />
              </TouchableOpacity>
            )}
          {this.state.detailsOpen && (
            <View>
              <Text style={this.styles.itemTitle}>{i18n.t("task.status")}</Text>
              <Text
                style={[
                  {
                    color: statuses[this.state.data.status]
                      ? statuses[this.state.data.status].color
                      : "#000"
                  },
                  this.styles.itemText
                ]}
              >
                {statuses[this.state.data.status]
                  ? statuses[this.state.data.status].name
                  : ""}
              </Text>
              <Text style={this.styles.itemTitle}>{i18n.t("task.title")}</Text>
              <Text style={this.styles.itemText}>{this.state.data.title}</Text>
              <Text style={this.styles.itemTextTitle}>
                {i18n.t("task.description")}
              </Text>
              <Text style={this.styles.itemText}>
                {this.state.data.description}
              </Text>
              <Text style={this.styles.itemTitle}>{i18n.t("task.id")}</Text>
              <Text style={this.styles.itemText}>{this.state.data.id}</Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.category")}
              </Text>
              <Text style={this.styles.itemText}>
                {this.state.data.category_name}
              </Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.open_time")}
              </Text>
              <Text style={this.styles.itemText}>
                {this.state.data.date_mod}
              </Text>
              {this.state.data.time_to_own && (
                <Text style={this.styles.itemTitle}>
                  {i18n.t("task.action_time")}
                </Text>
              )}
              {this.state.data.time_to_own && (
                <Text style={this.styles.itemText}>
                  {this.state.data.time_to_own}
                </Text>
              )}
              {this.state.data.closedate && (
                <Text style={this.styles.itemTitle}>
                  {i18n.t("task.close_time")}
                </Text>
              )}
              {this.state.data.closedate && (
                <Text style={this.styles.itemText}>
                  {this.state.data.closedate}
                </Text>
              )}
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.creator")}
              </Text>
              <Text style={this.styles.itemText}>
                {`${
                  this.state.data.iniciator_realname
                    ? this.state.data.iniciator_realname
                    : ""
                  } ${
                  this.state.data.iniciator_firstname
                    ? this.state.data.iniciator_firstname
                    : ""
                  }`}
              </Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.department")}
              </Text>
              <Text style={this.styles.itemText}>
                {this.state.data.department_name}
              </Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.creator_position")}
              </Text>
              <Text style={this.styles.itemText}>
                {this.state.data.position}
              </Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.creator_phone")}
              </Text>
              <Text style={this.styles.itemText}>
                {`${
                  this.state.data.mobilephone ? this.state.data.mobilephone : ""
                  } ${
                  this.state.data.mobilephone && this.state.data.workphone
                    ? ", "
                    : ""
                  } ${
                  this.state.data.workphone ? this.state.data.workphone : ""
                  }`}
              </Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.creator_login")}
              </Text>
              <Text style={this.styles.itemText}>{this.state.data.login}</Text>
              <Text style={this.styles.itemTitle}>
                {i18n.t("task.assigned_worker")}
              </Text>
              <Text style={[{ marginBottom: 23 }, this.styles.itemText]}>
                {`${
                  this.state.data.assigned_user_realname
                    ? this.state.data.assigned_user_realname
                    : ""
                  } ${
                  this.state.data.assigned_user_firstname
                    ? this.state.data.assigned_user_firstname
                    : ""
                  }`}
              </Text>
            </View>
          )}
          {this.state.data.status === 3 &&
            this.state.me.glpi_id === this.state.data.assigned_user && <Hr />}
          {this.state.data.status === 2 &&
            this.state.me.glpi_id === this.state.data.assigned_user && (
              <Button
                onPress={this.take}
                style={[styles.button, {
                  color: "#fff",
                  backgroundColor: colors.blue
                }]}
                disabled={this.state.loading}
                title={i18n.t("task.take_it")}
              />
            )}
          {this.state.data.comments != null &&
            this.state.data.comments.length > 0 && (
              <TaskComments
                addNewComment={comment => {
                  let data = this.state.data;
                  data.comments.push(comment);
                  this.setState({ data: data });
                }}
                comments={this.state.data.comments}
                id={this.state.data.id}
              />
            )}
          {this.state.me.glpi_id === this.state.data.iniciator && (
            <View>
              <Hr
                style={{
                  marginBottom: 30
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ action: "reject_ticket" });
                  this.refs.alert.open();
                }}
                style={[styles.button, { backgroundColor: colors.red }]}
                disabled={this.state.loading}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    paddingTop: 15,
                    paddingBottom: 15,
                    fontSize: 16,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  {i18n.t("task.cancel_task")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <Modal
          style={styles.alert}
          coverScreen={true}
          position="center"
          backdropPressToClose={true}
          ref="alert"
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              marginBottom: 20
            }}
          >
            {i18n.t("task.action_comment_title")}
          </Text>
          <TextInput
            style={{
              borderRadius: 3,
              borderWidth: 1,
              borderColor: colors.grayC4,
              borderStyle: "solid",
              width: "100%",
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 18,
              textAlignVertical: "top",
              paddingRight: 18
            }}
            numberOfLines={3}
            multiline={true}
            onChangeText={text => this.setState({ comment: text })}
          />
          <View
            style={[styles.alertActions, { justifyContent: "space-between" }]}
          >
            <TouchableOpacity
              style={{
                marginRight: 8
              }}
              onPress={() => {
                this.setState({ action: null });
                this.refs.alert.close();
              }}
            >
              <Text
                style={[
                  styles.alertButton,
                  {
                    color: colors.gray97
                  }
                ]}
              >
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.sendAction}>
              <Text
                style={[
                  styles.alertButton,
                  {
                    color: colors.blue
                  }
                ]}
              >
                {i18n.t("task.action_comment_send")}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          ref="success"
          style={[styles.alert, { textAlign: "center", paddingBottom: 26 }]}
          coverScreen={true}
          position="center"
          backdropPressToClose={true}
        >
          <Image
            style={{
              height: 68,
              width: 71,
              marginBottom: 19
            }}
            source={require("../../assets/img/2x/success.png")}
            height={68}
            width={71}
          />
          <Text
            style={{ textAlign: "center", fontSize: 16, fontWeight: "300" }}
          >
            {i18n.t("task.created_successfully")}
          </Text>
        </Modal>
        <Modal
          ref="rate"
          style={[styles.alert, { textAlign: "center", paddingBottom: 26 }]}
          coverScreen={true}
          position="center"
          backdropPressToClose={true}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              marginBottom: 25,
              color: "#000000"
            }}
          >
            {i18n.t("task.rate_specialist")}
          </Text>
          <Rating
            onFinishRating={this.ratingCompleted}
            style={{
              marginBottom: 40
            }}
          />
          <View
            style={[styles.alertActions, { justifyContent: "space-between" }]}
          >
            <TouchableOpacity
              style={{
                marginRight: 8
              }}
              onPress={() => {
                this.setState({ action: null });
                this.refs.rate.close();
              }}
            >
              <Text
                style={[
                  styles.alertButton,
                  {
                    color: colors.gray97
                  }
                ]}
              >
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.rate}>
              <Text
                style={[
                  styles.alertButton,
                  {
                    color: colors.blue
                  }
                ]}
              >
                {i18n.t("send")}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  styles = StyleSheet.create({
    itemTitle: {
      fontSize: 12,
      color: "#979797",
      marginBottom: 5
    },
    itemText: {
      color: "#000",
      fontSize: 14,
      marginBottom: 13
    }
  });
}
