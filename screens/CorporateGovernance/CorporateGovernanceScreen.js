import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DocumentListScreen from "../DocumentListScreen";
import i18n from "../../utils/i18n";

export default class CorporateGovernanceScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: i18n.t("corporate_governance"),
      headerLeft: (
        <TouchableOpacity
          onPress={navigation.toggleDrawer}
          style={{ marginLeft: 20 }}
        >
          <Icon name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          name: "Инструкций по подаче заявки в техническую поддержку",
          url: "https://www.dopdf.com/download/pdf/dopdf-eula.pdf",
          date_mod: "16-10-2018 14:47"
        },
        {
          name:
            "Годовой отчет как инструмент коммуникации с заинтересованными сторонами",
          url: "https://www.dopdf.com/download/pdf/dopdf-eula.pdf",
          date_mod: "16-10-2018 14:47"
        },
        {
          name:
            "Презентация/обучающий семинар на тему: «Внедрение системы устойчивого развития в Группе Компаний АО «Самрук-Энерго»",
          url: "https://www.dopdf.com/download/pdf/dopdf-eula.pdf",
          date_mod: "16-10-2018 14:47"
        }
      ]
    };
  }
  render() {
    return <DocumentListScreen data={this.state.data} />;
  }
}
