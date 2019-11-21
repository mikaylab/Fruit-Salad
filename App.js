import React from 'react';
import Login from './Login';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Profile from './Profile';
import SummaryPage from './SummaryPage';
import ActivityLog from './ActivityLog';
import NewActivity from './NewActivity';
import HamburgerIcon from './HamburgerIcon';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';


const AuthSwitch = createSwitchNavigator(
  {
    Home: HomePage,
    Login: Login,
    SignUp: SignUp
  },
  {
    initialRouteName: 'Home'
  }
)
const ActivityStack = createStackNavigator(
  {
    "Activity Log": {
      screen: ActivityLog,
      navigationOptions: ({navigation}) => ({
        title: 'Activity Log'
      })
    },
    "New Activity": {
      screen: NewActivity,
      navigationOptions: ({navigation}) => ({
        title: 'Activity'
      })
      },
  },
  {
    initialRouteName: 'Activity Log',
    headerMode: 'none'
  }
)
const TopDrawerNavigator = createDrawerNavigator(
  {
    Dashboard: {
      screen: SummaryPage,
    },
    "Activity Log": ActivityStack,
    Profile: {
      screen: Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Profile'
      })
    }
  },
  {
    initialRouteName: 'Dashboard'
  }
);

const RootStack = createStackNavigator(
  {
    Auth: {
      screen: AuthSwitch,
      navigationOptions: ({navigation}) => ({
        headerStyle: {
          backgroundColor: 'purple'
        }
      })
    },
    App: {
      screen: TopDrawerNavigator,
      navigationOptions: ({navigation}) => ({
        title: 'Dashboard',
        headerLeft: <HamburgerIcon navigationProps={navigation}/>,
        headerStyle: {
          backgroundColor: 'purple'
        },
        headerTintColor: 'white'
      })
    }
  },
  {
    initialRouteName: "Auth",
  });
const AppContainer = createAppContainer(RootStack);

export default AppContainer;
