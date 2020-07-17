/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./shared/components/Navigation";
import { name as appName } from "./app.json";
import { enableScreens } from "react-native-screens";

enableScreens();
AppRegistry.registerComponent(appName, () => App);
