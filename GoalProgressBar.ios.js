import React from 'react';
import {ProgressViewIOS, View } from 'react-native';

class GoalProgressBar extends React.Component {
    render() {
        return (
            <View style={this.props.barStyle}>
            <ProgressViewIOS style={{marginTop: 10}} progress={this.props.progress} progressTintColor={this.props.color}/>
        </View>
        )
    }
}
export default GoalProgressBar;