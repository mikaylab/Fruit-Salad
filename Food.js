import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import pluralize from 'pluralize';

export default class Food extends React.Component {
    render() {
        return (
            <View>
                <ListItem
                    key={this.props.id}
                    title={this.props.name}
                    titleStyle={styles.nameStyle}
                    subtitle={<View>
                                <Text style={styles.dataStyle}>Calories: {pluralize('calorie', this.props.calories, true)}</Text>
                                <Text style={styles.dataStyle}>Carbohydrates: {pluralize('unit', this.props.carbohydrates, true)}</Text>
                                <Text style={styles.dataStyle}>Protein: {pluralize('unit', this.props.protein, true)}</Text>
                                <Text style={styles.dataStyle}>Fat: {pluralize('gram', this.props.fat, true)}</Text>
                            </View>}
                    rightTitle={this.props.onPress}
                    bottomDivider
                />
            </View>);
    }
}
const styles = StyleSheet.create({
    dataStyle: {
        fontSize: 15,
        fontWeight: '400',
        color: 'dimgray'
    },
    nameStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'midnightblue'
    }
})
