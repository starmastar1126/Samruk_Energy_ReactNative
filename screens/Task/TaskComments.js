import React, { Component } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "../../plugins/axios";
import i18n from "../../utils/i18n";
import colors from "../../shared/state/colors";
import styles from "../../shared/state/styles";
import Loading from "../../shared/components/Loading";
import Hr from "../../shared/components/Hr";
import urls from "../../shared/state/urls";

export default class TaskComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      form: {
        comment: null
      },
      commentsOpen: true,
      loading: false
    };

    this.sendComment = this.sendComment.bind(this);
    this.renderComments = this.renderComments.bind(this);
  }
  async sendComment() {
    this.setState({ loading: true });
    try {
      let instance = await axios.instance();
      let response = await instance.post(`${urls.task_comment}${this.props.id}`, {
        content: this.state.form.comment
      });
      console.log("-----------------new comment------------------------");
      console.log(response);
      this.props.addNewComment(response.comment);
      this.setState({ form: { comment: null } })
    } catch (error) {
      console.log(error);
    }
    this.setState({
      loading: false
    })
  }
  renderComments() {
    let comments = [];
    for (let i = 0; i < this.props.comments.length; i++) {
      let item = this.props.comments[i];
      comments.push(<View
        key={item.id}
        style={{
          borderWidth: 1,
          borderColor: "#C4C4C4",
          borderRadius: 3,
          marginBottom: 23,
          paddingTop: 13,
          paddingBottom: 13,
          paddingRight: 16,

          paddingLeft: 16
        }}
      >
        <View
          style={{
            position: "relative",
            minHeight: 60,
            marginBottom: 6
          }}
        >
          <Image
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 60,
              height: 60,
              borderRadius: 30,
              borderColor: colors.blue,
              borderWidth: 1,
              marginRight: 17
            }}
            source={
              item.avatar
                ? { uri: item.user_avatar }
                : require("../../assets/img/avatar-placeholder.png")
            }
          />
          <View style={{
            paddingLeft: 77
          }}>
            <Text style={{
              fontSize: 14,
              marginBottom: 6,
              color: "#000000"
            }}>{`${item.realname} ${item.firstname}`}</Text>
            <Text style={{
              fontSize: 12,
              color: "#979797"
            }}>{item.date_creation}</Text>
          </View>
        </View>
        <Text style={{
          fontSize: 14,
          color: "#000000"
        }}>{item.content}</Text>
      </View>)
    }

    return comments;
  }
  render() {
    return (
      <View style={{
        paddingBottom: 20
      }}>
        <Hr />
        <TouchableOpacity
          style={{
            position: "relative",
            paddingTop: 15,
            paddingBottom: 15
          }}
          onPress={() => {
            this.setState({ commentsOpen: !this.state.commentsOpen });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#000000"
            }}
          >
            {i18n.t("task.comments")}
          </Text>
          <Icon
            name={
              this.state.commentsOpen
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
        {this.state.commentsOpen && (
          <View
            style={{
              paddingTop: 10
            }}
          >
            {this.renderComments()}
            <Text
              style={{
                fontSize: 14,
                color: "#000000",
                marginBottom: 16
              }}
            >
              {i18n.t("task.new_comment")}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  textAlignVertical: "top",
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#C4C4C4",
                  borderRadius: 3
                }
              ]}
              value={this.state.form.comment}
              onChangeText={(text) => { this.setState({ form: { comment: text } }) }}
              blurOnSubmit={false}
              multiline={true}
              placeholder={i18n.t("task.comment_placeholder")}
              editable={!this.state.loading}
              value={this.state.form.comment}
              numberOfLines={4}
            />
            <TouchableOpacity
              onPress={this.sendComment}
              style={{
                marginLeft: "auto",
                position: "relative",
                height: 32,
                minWidth: 80,
                backgroundColor: "#ffffff"
              }}
              disabled={this.state.loading}
            >
              {this.state.loading && <Loading />}
              {!this.state.loading && <Text
                style={{
                  color: colors.blue,
                  textTransform: "uppercase",
                  fontWeight: "500",
                  paddingTop: 8,
                  lineHeight: 16,
                  paddingBottom: 8,
                  fontSize: 14
                }}
              >
                {i18n.t("send")}
              </Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
