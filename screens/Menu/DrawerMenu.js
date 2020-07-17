import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modalbox";
import colors from "../../shared/state/colors";
import MenuItem from "./MenuItem";
import ChildMenuItem from "./ChildMenuItem";
import i18n from "../../utils/i18n";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../../shared/state/styles";

export default class DrawerMenu extends Component {
  _isMounted = false;
  static navigationOptions = {
    header: null
  };

  menuChildViews = {};

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      items: [
        {
          name: i18n.t("menu.about_us"),
          id: "about_us",
          icon: require("../../assets/img/menu/about.png"),
          children: [
            {
              name: i18n.t("menu.employees"),
              id: "employees",
              target: "employees"
            },
            {
              name: i18n.t("menu.structural_divisions"),
              id: "structural_divisions",
              target: "structural_divisions"
            },
            {
              name: i18n.t("menu.organizational_structure_kc"),
              id: "orgstructure",
              target: "orgstructure"
            }
          ],
          childrenVisible: false
        },
        {
          name: i18n.t("menu.news"),
          icon: require("../../assets/img/menu/news.png"),
          id: "news",
          target: "news",
          childrenVisible: false,
          children: []
        },
        {
          name: i18n.t("menu.compliance_service"),
          icon: require("../../assets/img/menu/compliance.png"),
          id: "compliance_service",
          childrenVisible: false,
          children: [
            {
              name: i18n.t("menu.training_materials"),
              id: "training",
              target: "training"
            },
            {
              name: i18n.t("menu.videos"),
              id: "videos",
              target: "videos"
            },
            {
              name: i18n.t("menu.faq"),
              id: "faq",
              target: "faq"
            }
          ]
        },
        {
          name: i18n.t("menu.transformations"),
          id: "transformations",
          icon: require("../../assets/img/menu/transform.png"),
          childrenVisible: false,
          children: [
            {
              name: i18n.t("menu.projects"),
              id: "projects",
              target: "projects"
            },
            {
              name: i18n.t("menu.business_process_owners"),
              id: "business_process_owners",
              target: "business_project_owners"
            }
          ]
        },
        {
          name: i18n.t("menu.corporate_governance"),
          id: "corporate_governance",
          icon: require("../../assets/img/menu/corp.png"),
          childrenVisible: false,
          target: "governance",
          children: []
        },
        {
          name: i18n.t("menu.technical_support"),
          id: "technical_support",
          icon: require("../../assets/img/menu/support.png"),
          childrenVisible: false,
          target: "support",
          children: []
        },
        {
          name: i18n.t("menu.exit"),
          id: "exit",
          icon: require("../../assets/img/menu/exit.png"),
          childrenVisible: false,
          target: "exit",
          children: []
        }
      ]
    };

    this.logout = this.logout.bind(this);
    this.goto = this.goto.bind(this);
    this.setData = this.setData.bind(this);
  }

  async setData() {
    let data = await AsyncStorage.getItem("me");

    this.setState({ data: JSON.parse(data) });
  }

  componentDidMount() {
    this._isMounted = true;
    this.setData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.blue
        }}
      >
        <ScrollView
          onPress={() => {
            console.log("drawer clicked");
          }}
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#fff"
          }}
        >
          <View
            style={{
              backgroundColor: colors.blue,
              backgroundImage: require("../../assets/img/logo-conture.png"),
              backgroundSize: "182px 132px",
              backgroundPosition: "122px 16px",
              paddingTop: 13,
              paddingBottom: 15
            }}
          >
            <Image
              source={
                this.state.data.avatar
                  ? { uri: this.state.data.avatar }
                  : require("../../assets/img/avatar-placeholder.png")
              }
              style={{
                borderRadius: 35,
                width: 70,
                height: 70,
                marginLeft: 20,
                marginBottom: 11
              }}
            />
            <TouchableOpacity
              style={{
                position: "relative",
                paddingLeft: 20
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 7
                }}
              >
                {this.state.data.fullname}
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: 14,
                  color: "#fff"
                }}
              >
                {i18n.t("menu.settings")}
              </Text>
              <Icon
                size={20}
                color="#fff"
                name="keyboard-arrow-right"
                style={{
                  position: "absolute",
                  right: 23,
                  top: "50%",
                  marginTop: -10
                }}
              />
            </TouchableOpacity>
          </View>
          {this.renderMenuItems()}
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
        </ScrollView>
      </SafeAreaView>
    );
  }

  async logout() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("me");
    this.props.navigation.navigate("Auth");
  }

  goto(target) {
    let route = null;
    switch (target) {
      case "employees":
        route = "Employees";
        break;
      case "structural_divisions":
        route = "Departments";
        break;
      case "orgstructure":
        route = "StructureStack";
        break;
      case "news":
        route = "News";
        break;
      case "training":
        route = "Educational";
        break;
      case "videos":
        route = "Video";
        break;
      case "faq":
        route = "FAQ";
        break;
      case "projects":
        route = "Projects";
        break;
      case "business_project_owners":
        route = "ProcessOwners";
        break;
      case "governance":
        route = "CorporateGovernance";
        break;
      case "support":
        route = "Tasks";
        break;
      case "exit":
        this.refs.alert.open();
        return;
    }

    const navigateAction = NavigationActions.navigate({
      index: 0,
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderMenuItems() {
    let menuItems = [];
    for (let i = 0; i < this.state.items.length; i++) {
      let item = this.state.items[i];
      menuItems.push(
        <MenuItem
          style={{
            width: "100%"
          }}
          icon={item.icon}
          title={item.name}
          key={item.name}
          hasChildren={item.children.length > 0}
          childrenVisible={item.childrenVisible}
          onPress={() => {
            if (item.children.length > 0) {
              item.childrenVisible = !item.childrenVisible;
            } else {
              this.goto(item.target);
            }

            this.setState({ items: this.state.items });
          }}
        />
      );
      if (item.childrenVisible && item.children.length > 0) {
        menuItems.push(
          <View
            key={"children_" + item.id}
            style={{
              borderBottom: "1px solid #c4c4c4"
            }}
          >
            {this.renderChildMenuItems(item.name, item.children)}
          </View>
        );
      }
    }

    return menuItems;
  }
  renderChildMenuItems(parentName, items) {
    if (!this.menuChildViews[parentName]) {
      let children = [];
      for (let i = 0; i < items.length; i++) {
        children.push(
          <ChildMenuItem
            title={items[i].name}
            key={items[i].name}
            onPress={() => {
              this.goto(items[i].target);
            }}
          />
        );
      }
      this.menuChildViews[parentName] = children;
    }
    return this.menuChildViews[parentName];
  }
}
