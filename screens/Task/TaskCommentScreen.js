import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import i18n from "../../utils/i18n";
import ImageUploader from "../../shared/components/ImageUploader";
import styles from "../../shared/state/styles";

export default class TaskCommentScreen extends Component {
  constructor(props) {}
  render() {
    return (
      <ScrollView>
        <Text
          style={[
            {
              marginBottom: 20
            },
            styles.screenTitle
          ]}
        >
          {i18n.t("task.comment")}
        </Text>
        <TextInput
          style={{ marginBottom: 20 }}
          placeholder={i18n.t("description")}
        />
        <ImageUploader style={{ marginBottom: 20 }} />
        <Text
          style={{
            marginBottom: 18,
            fontSize: 16
          }}
        >
          {i18n.t("action")}
        </Text>
      </ScrollView>
    );
  }
}
