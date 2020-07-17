import React, { Component } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import styles from "../state/styles";

export default class ButtonWithIcon extends Component {
  constructor(props) {
    super(props);

    let state = {
      backgroundColor: "transparent",
      iconHidden: props.icon === false,
      icon: props.icon || require("../../assets/img/2x/arrow_right.png")
    };

    if (props.style) {
      let positionStyles = {};
      let positionalStylesList = [
        "position",
        "top",
        "left",
        "bottom",
        "right",
        "height",
        "width",
        "overflow",
        "float",
        "margin",
        "marginTop",
        "marginBottom",
        "marginLeft",
        "marginRight"
      ];
      for (let i = 0; i < positionalStylesList.length; i++) {
        if (props.style.hasOwnProperty(positionalStylesList[i])) {
          positionStyles[positionalStylesList[i]] =
            props.style[positionalStylesList[i]];
        }
      }

      state.positionStyles = positionStyles;

      let presentationStyles = {};
      let presentationsStylesList = [
        "font-size",
        "fontSize",
        "color",
        "background-color",
        "backgroundColor",
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "border",
        "borderColor",
        "borderWidth",
        "borderRadius",
        "borderTopWidth",
        "borderTopColor",
        "borderBottomWidth",
        "borderBottomColor",
        "borderLeftWidth",
        "borderLeftColor",
        ,
        "borderRightWidth",
        "borderRightColor"
      ];
      for (let i = 0; i < presentationsStylesList.length; i++) {
        if (props.style.hasOwnProperty(presentationsStylesList[i])) {
          presentationStyles[presentationsStylesList[i]] =
            props.style[presentationsStylesList[i]];
        }
      }

      state.presentationStyles = presentationStyles;
    }

    this.state = state;
  }
  shown = false;
  render() {
    let icon = (() => {
      if (this.state.iconHidden) return null;
      return (
        <Image
          hide={!this.state.iconHidden}
          style={styles.icon}
          source={this.state.icon}
        />
      );
    })();
    return (
      <TouchableOpacity
        disabled={this.props.disabled === true}
        onPress={this.props.onPress}
        style={[
          {
            width: "100%",
            position: "relative"
          },
          this.state.positionStyles
        ]}
      >
        <Text
          style={[
            styles.whiteBotton,
            { backgroundColor: this.state.backgroundColor },
            this.state.presentationStyles
          ]}
        >
          {this.props.title}
        </Text>
        {icon}
      </TouchableOpacity>
    );
  }
}
