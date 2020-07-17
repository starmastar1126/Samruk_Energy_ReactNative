import axios from "axios";
import * as AxiosLogger from "axios-logger";
import AsyncStorage from "@react-native-community/async-storage";

let base = "http://testportal.samruk-energy.kz";
if (__DEV__) base = "http://testportal.samruk-energy.kz";

export default {
  instance: async function() {
    const headers = {};
    const token = await AsyncStorage.getItem("token");
    if (token) {
      headers["api-token"] = token;
    }
    let inst = axios.create({
      baseURL: base,
      headers: headers
    });
    inst.interceptors.request.use(
      AxiosLogger.requestLogger,
      AxiosLogger.errorLogger
    );
    inst.interceptors.response.use(
      async function(response) {
        console.log(
          "======================================================================================================"
        );
        console.log(response);
        console.log(
          "======================================================================================================"
        );
        if (response.data.status) {
          if (response.data.content && response.data.content.api_token) {
            await AsyncStorage.setItem(
              "token",
              response.data.content.api_token
            );
          }
          return response.data.content;
        } else {
          return Promise.reject(response);
        }
      },
      async function(error) {
        return Promise.reject({ ...error });
      }
    );

    return inst;
  }
};
