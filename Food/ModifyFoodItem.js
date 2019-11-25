import React from 'react';
import {Text, AsyncStorage, StyleSheet} from 'react-native';
import {ListItem, Input, Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import updateFood from '../API/meals/foods/updateFood';
import _ from 'lodash';

export default class ModifyFoodItem extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
        title: "Edit Food Item",
        headerRight: () => (
            <Button title="Done" titleStyle={[styles.linkText, {right: 10}]} type="clear" onPress={navigation.getParam('updateFood')}/>
        ),
        headerLeft: () => (
            <Button title="Cancel" titleStyle={[styles.linkText, {left: 10}]} type="clear" onPress={() => navigation.goBack()}/>
        )
        }; 
    };
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            calories: 0.0,
            protein: 0.0,
            carbohydrates: 0.0,
            fat: 0.0,
            mealId: "",
            foodId: ""
        }
    }
    setName(event) {
        this.setState({name: event.nativeEvent.text});
    }
    setCalories(event) {
        this.setState({calories: event.nativeEvent.text});
    }
    setProtein(event) {
        this.setState({protein: event.nativeEvent.text});
    }
    setCarbohydrates(event) {
        this.setState({carbohydrates: event.nativeEvent.text});
    }
    setFat(event) {
        this.setState({fat: event.nativeEvent.text});
    }
    async updateFood() {
        let item = {
            name: this.state.name,
            calories: this.state.calories,
            carbohydrates: this.state.carbohydrates,
            protein: this.state.protein,
            fat: this.state.fat
        }
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = await updateFood(item, token, this.state.mealId, this.state.foodId);
            if (response !== null) {
                console.log(response.message)
                this.props.navigation.goBack();
            }
        } catch (e) {
            console.log(e);
        }
    }
    componentDidMount() {
        this.setState({name: this.props.navigation.getParam("name", "")});
        this.setState({calories: this.props.navigation.getParam("calories", 0.0)});
        this.setState({carbohydrates: this.props.navigation.getParam("carbohydrates", 0.0)});
        this.setState({protein: this.props.navigation.getParam("protein", 0.0)});
        this.setState({fat: this.props.navigation.getParam("fat", 0.0)});
        this.setState({mealId: this.props.navigation.getParam("mealId")});
        this.setState({foodId: this.props.navigation.getParam("foodId")});
        this.props.navigation.setParams({updateFood: () => this.updateFood()});
    }
    render() {
        return (
            <ScrollView>
                <ListItem
                    leftElement={
                        <Input
                            placeholder={this.state.name}
                            maxLength={100}
                            returnKeyType='done'
                            label="Name"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setName.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.calories)}
                            maxLength={100}
                            keyboardType='decimal-pad'
                            returnKeyType='done'
                            label="Calories"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setCalories.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.protein)}
                            maxLength={100}
                            returnKeyType='done'
                            keyboardType='decimal-pad'
                            label="Protein"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setProtein.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.carbohydrates)}
                            maxLength={100}
                            returnKeyType='done'
                            keyboardType='decimal-pad'
                            label="Carbohydrates"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setCarbohydrates.bind(this)}
                        />
                    }
                />
                <ListItem
                    leftElement={
                        <Input
                            placeholder={JSON.stringify(this.state.fat)}
                            maxLength={100}
                            returnKeyType='done'
                            keyboardType='decimal-pad'
                            label="Fat"
                            labelStyle={styles.titleStyle}
                            inputStyle={styles.textInputStyle}
                            onChange={this.setFat.bind(this)}
                        />
                    }
                />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    textInputStyle: {
        fontSize: 20,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
        marginTop: 10,
        borderBottomColor: 'transparent'
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black'
    },
    linkText: {
        color: '#46a2c7',
        fontSize: 20,
        fontWeight: '500'
    },
    textStyle: {
        fontSize: 15
    }
})