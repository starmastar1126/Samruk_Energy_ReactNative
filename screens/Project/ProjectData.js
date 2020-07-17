import React, { PureComponent } from "react";
import { View } from "react-native";
import HTMLView from "react-native-htmlview";

export default class ProjectData extends PureComponent {
  render() {
    return <HTMLView value={this.props.data.publication} />;
  }
}
