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
    getCalories() {
        //Display the Calories, Carbohydrates
    }
    getCarbohydrates(){

    }
    getProtein() {

    }
    getFat() {

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
                            <Text style={styles.dataStyle}>Total Calories: {pluralize('calorie', 90, true)}</Text>
                            <Text style={styles.dataStyle}>Total Carbohydrates: {pluralize('unit', 8, true)}</Text>
                            <Text style={styles.dataStyle}>Total Protein: {pluralize('unit', 10, true)}</Text>
                            <Text style={styles.dataStyle}>Total Fat: {pluralize('gram', 4, true)}</Text>
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