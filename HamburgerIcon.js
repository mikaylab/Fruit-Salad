import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class HamburgerIcon extends React.Component {
    toggleDrawer = () => {
      this.props.navigationProps.toggleDrawer();
    };

    render() {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                <Ionicons style={{ width: 25, height: 45, marginLeft: 15, color: 'white' }} size={45} name="ios-menu"></Ionicons>
          </TouchableOpacity>
        </View>
      );
    }
  }
  export default HamburgerIcon;