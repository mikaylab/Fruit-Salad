import React from 'react';
import {Text, View,TouchableOpacity, Platform, LayoutAnimation, UIManager,StyleSheet} from 'react-native';
import {ListItem, Divider} from 'react-native-elements';
import Food from './Food';
import moment from 'moment';
import pluralize from 'pluralize';
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
export default class Meal extends React.Component {
    state = {expanded: false}
    totalAmount(list, item) {
        let value = "";
        switch (item) {
            case "calories": value = "calories"; break;
            case "carbohydrates": value = "carbohydrates"; break;
            case "fat": value = "fat"; break;
            case "protein": value = "protein"; break;
            default: console.log(`item not recognized: ${item}`); break;
        }
        let total = 0.0;
        list.forEach(e => {
            total += e[value];
        });
        return total;
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); this.setState({ expanded: !this.state.expanded });}}>
                    <ListItem
                    key={this.props.id}
                    title={this.props.name}
                    titleStyle={styles.nameStyle}
                    rightTitle={moment(this.props.date).format("h:mm a")}
                    subtitle={this.state.expanded ? <View/> :
                        <View>
                            <Text style={styles.dataStyle}>Total Calories: {pluralize('calorie', this.totalAmount(this.props.foods, "calories"), true)}</Text>
                            <Text style={styles.dataStyle}>Total Carbohydrates: {pluralize('unit', this.totalAmount(this.props.foods, "carbohydrates" ), true)}</Text>
                            <Text style={styles.dataStyle}>Total Protein: {pluralize('unit', this.totalAmount(this.props.foods, "protein" ), true)}</Text>
                            <Text style={styles.dataStyle}>Total Fat: {pluralize('gram', this.totalAmount(this.props.foods, "fat"), true)}</Text>
                            <Text>Foods:</Text>
                            <Divider style={{backgroundColor: 'black'}}/>
                            <FlatList
                                data={this.props.foods.reverse()}
                                renderItem={({item}) => 
                                {
                                    <Food id={item.id} name={item.name} carbohydrates={item.carbohydrates} fat={item.fat} protein={item.protein} calories={item.calories}/>
                                }}
                                keyExtractor={(item, index) => `list-${item}-${index}`}
                            />
                        </View>        
                    }
                    bottomDivider/>
                    <Text>Press to {this.state.expanded ? "collapse" : "expand"}</Text>
            </TouchableOpacity>
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