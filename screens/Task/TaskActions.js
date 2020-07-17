import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import i18n from "../../utils/i18n";
import colors from "../../shared/state/colors";
import styles from "../../shared/state/styles";
import Hr from "../../shared/components/Hr";

export default class NewTaskScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={this.props.style}>
        {this.props.status === 5 && this.props.isOwner && (
          <TouchableOpacity
            onPress={() => {
              this.props.onAction("solved");
            }}
            style={this.styles.actionButtons}
          >
            <Text style={this.styles.actionButtonText}>
              {i18n.t("task.approve_solution")}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.status === 5 && this.props.isOwner && (
          <TouchableOpacity
            onPress={() => {
              this.props.onAction("reject_solution");
            }}
            style={[
              this.styles.actionButtons,
              {
                borderColor: colors.red
              }
            ]}
          >
            <Text
              style={[
                this.styles.actionButtonText,
                {
                  color: colors.red
                }
              ]}
            >
              {i18n.t("task.reject_solution")}
            </Text>
          </TouchableOpacity>
        )}
        {(this.props.status === 3 || this.props.status === 4) &&
          this.props.assignedUser && (
            <TouchableOpacity
              onPress={() => {
                this.props.onAction("solution");
              }}
              style={this.styles.actionButtons}
            >
              <Text style={this.styles.actionButtonText}>
                {i18n.t("task.it_is_solution")}
              </Text>
            </TouchableOpacity>
          )}
        {(this.props.status === 3 || this.props.status === 4) &&
          this.props.assignedUser && (
            <TouchableOpacity
              style={this.styles.actionButtons}
              onPress={() => {
                this.props.onAction("reject_ticket");
              }}
            >
              <Text style={this.styles.actionButtonText}>
                {i18n.t("task.pass_on")}
              </Text>
            </TouchableOpacity>
          )}
        {this.props.status === 3 && this.props.assignedUser && (
          <TouchableOpacity
            onPress={() => {
              this.props.onAction("waiting_solution");
            }}
            style={[this.styles.actionButtons]}
          >
            <Text style={this.styles.actionButtonText}>
              {i18n.t("task.waiting_for_solution")}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.status === 3 && this.props.assignedUser && <Hr />}
      </View>
    );
  }

  styles = StyleSheet.create({
    actionButtons: {
      borderWidth: 1,
      borderColor: colors.blue,
      marginBottom: 10
    },
    actionButtonText: {
      color: colors.blue,
      fontSize: 16,
      lineHeight: 43,
      width: "100%",
      textAlign: "center"
    }
  });
}
