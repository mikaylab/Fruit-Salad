import React from 'react';
import Login from './Login';
import HomePage from './HomePage';
import SignUp from './SignUp';
import Profile from './Profile';
import SummaryPage from './SummaryPage';
import ActivityLog from './Activity/ActivityLog';
import NewActivity from './Activity/ActivityItem';
import HamburgerIcon from './HamburgerIcon';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import MealLog from './MealsLog';
import MealItem from './MealItem';
import AddFood from './Food/AddFood';
import AddFoodItem from './Food/AddFoodItem';
import ModifyFoodItem from './Food/ModifyFoodItem';


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
const FoodStack = createStackNavigator({
  "AddFood": {
    screen: AddFood
  },
  "AddFoodItem": {
    screen: AddFoodItem
  },
})
const MealStack = createStackNavigator(
  {
    "Meal Log": {
      screen: MealLog,
      navigationOptions: ({navigation}) => ({
        title: 'Meal Log',
        headerLeft: null
      })
    },
    "MealItem": {
      screen: MealItem,
      navigationOptions: ({navigation}) => ({
        title: 'Meal'
      })
    },
    "Foods": {
      screen: FoodStack,
      navigationOptions: ({navigation}) => ({
        headerLeft: null
      })
    },
    "Modify Food": ModifyFoodItem
  },
  {
    initialRouteName: "Meal Log",
    headerMode: 'float'
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
    "Activity Log": {
      screen: ActivityStack,
      navigationOptions: ({navigation}) => ({
        title: 'Activity Log'
      })
    },
    Profile: {
      screen: Profile,
      navigationOptions: ({navigation}) => ({
        title: 'Profile'
      })
    },
    "Meal Log": MealStack
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
