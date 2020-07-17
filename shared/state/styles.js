import { StyleSheet } from "react-native";
import colors from "./colors";

module.exports = StyleSheet.create({
  whiteBotton: {
    width: "100%",
    paddingTop: 13,
    fontWeight: "300",
    lineHeight: 24,
    fontSize: 16,
    paddingBottom: 13,
    backgroundColor: "#ffffff"
  },
  icon: {
    height: 16,
    width: 16,
    position: "absolute",
    right: 0,
    top: "50%",
    marginTop: -8
  },
  screenTitles: {
    fontSize: 18,
    fontWeight: "500"
  },
  alert: {
    justifyContent: "center",
    alignItems: "center",
    width: 280,
    paddingTop: 21,
    paddingLeft: 24,
    height: "auto",
    paddingRight: 21,
    paddingBottom: 52,
    position: "relative"
  },
  alertActions: {
    position: "absolute",
    bottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    right: 8
  },
  alertTitle: {
    width: "100%",
    alignSelf: "flex-start",
    fontWeight: "500",
    fontSize: 20,
    marginBottom: 12,
    color: "#000000",
    opacity: 0.87
  },
  alertDescription: {
    fontSize: 16,
    color: "#000000",
    opacity: 0.54
  },
  alertButton: {
    lineHeight: 36,
    textTransform: "uppercase",
    paddingLeft: 11,
    paddingRight: 11,
    fontSize: 14,
    fontWeight: "500"
  },
  input: {
    width: "100%",
    fontSize: 16,
    fontWeight: "400",
    paddingTop: 13,
    paddingBottom: 11,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1
  },
  toolbar: {
    backgroundColor: colors.blue,
    color: "#ffffff"
  }
});

const text_sizes = {
  sm: 14,
  normal: 16
};

const spaces = {};
