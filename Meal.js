import React from 'react';
import {Text, View,TouchableOpacity, Platform, AsyncStorage, LayoutAnimation, UIManager, StyleSheet, FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import _ from 'lodash';
import getMealFoods from './API/meals/foods/getMealFoods';
import round from './round';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default class Meal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            foods: []
        }
    }
    async getFoodList(mealId) {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let foods = await getMealFoods(token, mealId);
            if (foods !== null) {
                this.setState({foods: foods.foods});
            }
        }catch(e) {
            console.log(e);
        }
    }
    totalAmount(item) {
        if (_.isEmpty(this.state.foods)) {
            return 0;
        }
        let value = "";
        const list = Array.from(this.state.foods);
        switch (item) {
            case "calories": value = "calories"; break;
            case "carbohydrates": value = "carbohydrates"; break;
            case "fat": value = "fat"; break;
            case "protein": value = "protein"; break;
            default: console.log(`Item not recognized: ${item}`); break;
        }
        let total = 0.0;

        list.map(e => {
            total += e[value];
        });
        return round(total, 2);
    }
    componentDidMount() {
        this.getFoodList(this.props.id);
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({ expanded: !this.state.expanded });}}>
                    <ListItem
                    key={this.props.id}
                    title={this.props.name}
                    titleStyle={styles.nameStyle}
                    rightTitle={moment(this.props.date).format("h:mm a")}
                    subtitle={this.state.expanded ?
                        // <View>
                        //     <Text style={styles.dataStyle}>Total Calories: {pluralize('calorie', this.totalAmount("calories"), true)}</Text>
                        //     <Text style={styles.dataStyle}>Total Carbohydrates: {pluralize('unit', this.totalAmount("carbohydrates"), true)}</Text>
                        //     <Text style={styles.dataStyle}>Total Protein: {pluralize('unit', this.totalAmount("protein"), true)}</Text>
                        //     <Text style={styles.dataStyle}>Total Fat: {pluralize('gram', this.totalAmount("fat"), true)}</Text>
                        //     <Text>Foods:</Text>
                        //     <Divider style={{backgroundColor: 'black'}}/>
                        //     <FlatList
                        //         data={this.state.foods}
                        //         renderItem={({item}) => 
                        //             <Food id={item.id} name={item.name} carbohydrates={item.carbohydrates} fat={item.fat} protein={item.protein} calories={item.calories}/>
                        //         }
                        //         keyExtractor={(item, index) => `list-${item.name}-${index}`}
                        //     />
                        // </View>
                        <Text>Swipe left to see foods and stats.</Text>
                        :
                        <View/>     
                    }
                    bottomDivider/>
                    <Text style={{backgroundColor: 'white'}}>Press to {this.state.expanded ? "collapse" : "expand"}</Text>
            </TouchableOpacity>
            </View>);
    }
}
const styles = StyleSheet.create({
    dataStyle: {
        color: 'dimgray',
        fontSize: 15
    },
    nameStyle: {
        fontWeight: '500',
        fontSize: 20,
        color: 'black'
    }
})