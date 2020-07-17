import React, { Component } from "react";
import { View, TextInput, Text, Image } from "react-native";
import InputErrorMessage from "./InputErrorMessage";
import colors from "../state/colors";
import styles from "../state/styles";

export default class StatedInput extends Component {
  componentDidMount() {}
  render() {
    return (
      <View>
        <TextInput
          style={[
            styles.input,
            this.props.style,
            (() => {
              return this.props.error === true
                ? { borderBottomColor: colors.red }
                : null;
            })(),
            (() => {
              return this.props.multiline === true
                ? { textAlignVertical: "top" }
                : null;
            })()
          ]}
          autoCompleteType={this.props.autoCompleteType}
          autoCorrect={false}
          ref={this.props.refProp}
          returnKeyType={this.props.returnKeyType}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          blurOnSubmit={false}
          multiline={this.props.multiline}
          placeholder={this.props.placeholder}
          editable={this.props.editable}
          value={this.props.value}
          numberOfLines={this.props.numberOfLines}
        />
        {(() => {
          return this.props.error === true ? (
            <InputErrorMessage errorMessage={this.props.errorMessage} />
          ) : null;
        })()}
      </View>
    );
  }
}
