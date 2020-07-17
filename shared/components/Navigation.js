/**
 * @format
 */
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import LoginScreen from "../../screens/Login/LoginScreen";
import ListScreen from "../../screens/ListScreen";
import NewTaskScreen from "../../screens/Task/NewTaskScreen";
import SplashScreen from "../../screens/Splash/SplashScreen";
import EmployeesScreen from "../../screens/About/EmployeesScreen";
import UserScreen from "../../screens/About/UserScreen";
import StructureScreen from "../../screens/About/StructureScreen";
import DepartmentsScreen from "../../screens/About/DepartmentsScreen";
import DepartmentScreen from "../../screens/About/DepartmentScreen";
import NewsScreen from "../../screens/News/NewsScreen";
import NewsListScreen from "../../screens/News/NewsListScreen";
import styles from "../state/styles";
import SuccessScreen from "../../screens/Success/SuccessScreen";
import DrawerMenu from "../../screens/Menu/DrawerMenu";
import TasksTabsScreen from "../../screens/Task/TasksTabsScreen";
import TaskScreen from "../../screens/Task/TaskScreen";
import i18n from "../../utils/i18n";
import EducationalScreen from "../../screens/Compliance/EducationalScreen";
import VideoScreen from "../../screens/Compliance/VideosScreen";
import FaqScreen from "../../screens/Compliance/FaqScreen";
import FaqsScreen from "../../screens/Compliance/FaqsScreen";
import ProjectsScreen from "../../screens/Project/ProjectsScreen";
import ProjectScreen from "../../screens/Project/ProjectScreen";
import ProcessOwnersScreen from "../../screens/Project/ProcessOwnersScreen";
import CorporateGovernanceScreen from "../../screens/CorporateGovernance/CorporateGovernanceScreen";
import NewsTabScreen from "../../screens/News/NewsTabScreen";

const __navDefaultOptions = {
  headerStyle: styles.toolbar,
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold"
  }
};

const AuthStack = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    List: { screen: ListScreen },
    Splash: { screen: SplashScreen }
  },
  {
    defaultNavigationOptions: __navDefaultOptions
  }
);

const EmployeesStack = createStackNavigator(
  {
    Employees: {
      screen: EmployeesScreen
    },
    Employee: {
      screen: UserScreen
    }
  },
  {
    initialRouteName: "Employees",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const NewsStack = createStackNavigator(
  {
    NewsList: { screen: NewsTabScreen },
    News: { screen: NewsScreen }
  },
  {
    initialRouteName: "NewsList",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const FaqStack = createStackNavigator(
  {
    FaqList: {
      screen: FaqsScreen
    },
    Faq: {
      screen: FaqScreen
    }
  },
  {
    initialRouteName: "FaqList",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const TasksStack = createStackNavigator(
  {
    Success: {
      screen: SuccessScreen,
      navigationOptions: () => ({
        title: i18n.t("success_screen_title")
      })
    },
    Task: { screen: TaskScreen },
    NewTask: { screen: NewTaskScreen },
    List: { screen: ListScreen },
    TasksTab: { screen: TasksTabsScreen }
  },
  {
    initialRouteName: "TasksTab",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const ProjectsStack = createStackNavigator(
  {
    Projects: {
      screen: ProjectsScreen
    },
    Project: {
      screen: ProjectScreen
    }
  },
  {
    initialRouteName: "Projects",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const ProjectOwnersStack = createStackNavigator(
  {
    ProcessOwners: {
      screen: ProcessOwnersScreen
    },
    ProcessOwner: {
      screen: UserScreen
    }
  },
  {
    initialRouteName: "ProcessOwners",
    defaultNavigationOptions: __navDefaultOptions
  }
);
const CorporateStack = createStackNavigator(
  {
    CorporateGovernance: { screen: CorporateGovernanceScreen }
  },
  {
    initialRouteName: "CorporateGovernance",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const StructureStack = createStackNavigator(
  {
    Structure: {
      screen: StructureScreen
    }
  },
  {
    initialRouteName: "Structure",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const EducationalStack = createStackNavigator(
  {
    Educational: {
      screen: EducationalScreen
    }
  },
  {
    initialRouteName: "Educational",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const VideoStack = createStackNavigator(
  {
    Video: {
      screen: VideoScreen
    }
  },
  {
    initialRouteName: "Video",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const DepartmentsStack = createStackNavigator(
  {
    Departments: { screen: DepartmentsScreen },
    Department: { screen: DepartmentScreen },
    User: {
      screen: UserScreen
    }
  },
  {
    initialRouteName: "Departments",
    defaultNavigationOptions: __navDefaultOptions
  }
);

const MainStack = createDrawerNavigator(
  {
    Employees: {
      screen: EmployeesStack
    },
    Departments: {
      screen: DepartmentsStack
    },
    StructureStack: {
      screen: StructureStack
    },
    News: { screen: NewsStack },
    Tasks: { screen: TasksStack },
    Projects: {
      screen: ProjectsStack
    },
    ProcessOwners: {
      screen: ProjectOwnersStack
    },
    CorporateGovernance: { screen: CorporateStack },
    Educational: {
      screen: EducationalStack
    },
    Video: {
      screen: VideoStack
    },
    FAQ: {
      screen: FaqStack
    }
  },
  {
    contentComponent: DrawerMenu,
    initialRouteName: "Projects"
  }
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      Splash: SplashScreen,
      // Auth: AuthStack,
      Main: MainStack
    },
    {
      initialRouteName: "Splash"
    }
  )
);

export default App;
