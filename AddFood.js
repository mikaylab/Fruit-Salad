import React from 'react';
import {Text, AsyncStorage, FlatList, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ListItem, Input, Button} from 'react-native-elements';
import getFoodLibrary from './API/foods/getFoodLibrary';
import Food from './Food';
import _ from 'lodash'

export default class AddFood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodLib:[]
        }
    }
    async getExistingFoods() {
        let _foodLib = await getFoodLibrary();
        this.setState({foodLib: _foodLib.foods});
    }
    componentDidMount() {
       this.getExistingFoods();
    }
    render() {
        return (
            <ScrollView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("AddFoodItem")}>
                    <ListItem topDivider bottomDivider title="Add new item..." titleStyle={styles.titleStyle}/>
                </TouchableOpacity>
                <FlatList
                    data={this.state.foodLib}
                    renderItem={({item}) => 
                        <Food 
                            id={item.id}
                            name={_.startCase(item.name)}
                            calories={item.calories}
                            protein={item.protein}
                            carbohydrates={item.carbohydrates}
                            fat={item.fat}
                            onPress={<Text style={styles.linkText} onPress={() => console.log(`Food from library pressed ${item.name}`)}>Add</Text>}
                        />
                    }
                    keyExtractor={(item, index) => `list-${item.name}-${index}`}
                />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    titleStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black'
    },
    textStyle: {
        fontSize: 15
    },
    buttonStyle: {
        paddingTop: 10,
        borderRadius: 10,
        width: 100,
        top: 10
    },
    linkText: {
        color: '#46a2c7',
        fontSize: 20,
        fontWeight: '500'
    },
    addButton: {
        padding: 1,
        height: 30,
        width: 30,
        borderRadius: 60,
        backgroundColor: 'indigo',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 0,
        right: 10
    }
})