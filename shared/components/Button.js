import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../state/colors';


export default class Button extends Component {
  constructor(props) {
    super(props)

    let state = {
      color: "#FFFFFF",
      backgroundColor: colors.blue
    }

    if (props.disabled) {
      state.backgroundColor = "#dadada"
    }

    if (props.style) {
      let positionStyles = {}
      let positionalStylesList = ['position', 'top', 'left', 'bottom', 'right', 'height', 'width', 'overflow', 'float', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight']
      for (let i = 0; i < positionalStylesList.length; i++) {
        if (props.style.hasOwnProperty(positionalStylesList[i])) {
          positionStyles[positionalStylesList[i]] = props.style[positionalStylesList[i]]
        }
      }

      state.positionStyles = positionStyles

      let presentationStyles = {}
      let presentationsStylesList = ['font-size', 'fontSize', 'color', 'background-color', 'backgroundColor', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'border', 'borderColor', 'borderWidth', 'borderRadius', 'borderTopWidth', 'borderTopColor', 'borderBottomWidth', 'borderBottomColor', 'borderLeftWidth', 'borderLeftColor', , 'borderRightWidth', 'borderRightColor']
      for (let i = 0; i < presentationsStylesList.length; i++) {
        if (props.style.hasOwnProperty(presentationsStylesList[i])) {
          presentationStyles[presentationsStylesList[i]] = props.style[presentationsStylesList[i]]
        }
      }

      state.presentationStyles = presentationStyles
    }

    this.state = state;
    this.pressedIn = this.pressedIn.bind(this)

    this.pressedOut = this.pressedOut.bind(this)

  }
  componentDidUpdate(nextProps, nextState) {
    if (this.state.backgroundColor != colors.blue && nextProps.disabled === false) {
      this.setState({ backgroundColor: colors.blue })
    } else if (this.state.backgroundColor != "#dadada" && nextProps.disabled === true) {
      this.setState({ backgroundColor: '#dadada' })
    }
  }
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled === true}
        onPress={this.props.onPress}
        onPressIn={this.pressedIn}
        onPressOut={this.pressedOut}
        style={[{
          width: '100%',
          position: 'relative',
          textAlign: 'center'
        }, this.state.positionStyles]}>
        <Text style={[this.style.button, { color: this.state.color, backgroundColor: this.state.backgroundColor }, this.state.presentationStyles]}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
  pressedIn() {
    this.setState({ color: colors.blue })
  }
  pressedOut() {
    this.setState({ color: "#ffffff" })
  }

  style = StyleSheet.create({
    button: {
      backgroundColor: colors.blue,
      width: '100%',
      lineHeight: 24,
      paddingTop: 13,
      paddingBottom: 13,
      textAlign: 'center',
      color: '#ffffff',
      fontSize: 16
    }
  })
}
