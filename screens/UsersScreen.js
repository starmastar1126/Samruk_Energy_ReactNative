import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import colors from "../shared/state/colors";

export default class UsersScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.props}
        style={{
          width: "100%",
          height: "100%",
          paddingLeft: 20,
          paddingRight: 20
        }}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
        onEndReached={this.props.nextPage && this.props.nextPage}
        onEndReachedThreshold={400}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push(this.props.nextNavigation, {
                  id: item.id,
                  title: item.name
                });
              }}
              style={{
                display: "flex",
                borderWidth: 1,
                flexDirection: "row",
                borderColor: "#c4c4c4",
                marginTop: 10,
                borderRadius: 3,
                padding: 16
              }}
            >

              <Image
                style={{
                  borderRadius: 30,
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: colors.blue,
                  marginRight: 17
                }}
                source={(() => {
                  if (item.avatar)
                    return {
                      uri: item.avatar
                    };
                  return require("../assets/img/male-avatar.png");
                })()}
              />
              <View
                style={{
                  flexBasis: "auto",
                  flexGrow: 1,
                  flexShrink: 1
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    marginBottom: 7
                  }}
                >
                  {item.fullname}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#979797",
                    marginBottom: 9
                  }}
                >
                  {item.title}
                </Text>
                {item.company_name && <Text
                  style={{
                    fontSize: 12,
                    color: "#979797",
                    marginBottom: 9
                  }}
                >
                  {item.company_name}
                </Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${item.id}`}
      />
    );
  }
}
