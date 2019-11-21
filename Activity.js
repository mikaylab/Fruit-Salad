import React from 'react';
import {Text, View,StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import pluralize from 'pluralize';

export default class Activity extends React.Component {
    render() {
        return (
            <View>
                <ListItem
                key={this.props.id}
                title={this.props.name}
                titleStyle={styles.nameStyle}
                rightTitle={moment(this.props.date).format("h:mm a")}
                subtitle={<View>
                            <Text style={styles.dataStyle}>Duration: {pluralize('minute', this.props.duration, true)}</Text>
                            <Text style={styles.dataStyle}>Calories: {pluralize('calorie', this.props.calories, true)}</Text>
                        </View>}
                bottomDivider/>
            </View>);
    }
}
const styles = StyleSheet.create({
    dataStyle: {
        color: 'dimgray'
    },
    nameStyle: {
        fontWeight: '500',
        color: 'midnightblue'
    }
})
