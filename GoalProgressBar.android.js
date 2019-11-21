import React from 'react';
import {ProgressBarAndroid, View } from 'react-native';

class GoalProgressBar extends React.Component {
    render() {
        return (
            <View style={this.props.barStyle}>
            <ProgressBarAndroid styleAttr='Horizontal' indeterminate={false} progress={this.props.progress} color={this.props.progressColor}/>
        </View>
        )
    }
}
export default GoalProgressBar;