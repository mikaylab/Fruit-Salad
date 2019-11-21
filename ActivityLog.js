import React from 'react';
import {Animated, Text, View, AsyncStorage, StyleSheet, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Activity from './Activity';
import { Icon, ListItem, Tooltip } from 'react-native-elements';
import getActivity from './API/getActivity';
import deleteActivity from './API/deleteActivity';

class ActivityLog extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            activities: []
        }
    }
    async getActivityList() {
        try {
            let token = await AsyncStorage.getItem('@CurrentToken');
            let activityList = await getActivity(token);
            if (activityList !== null) {
                this.setState({activities: activityList.activities});
            }
        } catch (e) {
            console.log(e);
        }
    }
    LeftActions({item, dragX, onPress}) {
        const scale = dragX.interpolate({
            inputRange: [40, 100],
            outputRange: [1,1],
            extrapolate: 'clamp' //locks the text to the output value
        })
        return (
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.leftAction}>
                    <Animated.Text style={[styles.actionText, {transform: [{scale}]}] }>Delete</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    }
    RightActions({item, dragX, onPress}) {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1,1],
            extrapolate: 'clamp' //locks the text to the output value
        })
        return (
            <TouchableOpacity onPress={() => onPress(item)}>
                <View style={styles.rightAction}>
                    <Animated.Text style={[styles.actionText, {transform: [{scale}]}] }>Edit</Animated.Text>
                </View>
            </TouchableOpacity>
        )
    }
    async removeItem(item) {
        try {
            let id = item.id;
            let token = await AsyncStorage.getItem('@CurrentToken');
            let response = await deleteActivity(token, id);
            if (response !== null) {
                console.log(response.message);
            }
            this.getActivityList();
            console.log(this.props.navigation.state.params);
        } catch (e) {
            console.log(e);
        }
    }
    modifyActivity(item) {
        console.log(this.props.navigation.state.params);
        let params = {
            id: item.id,
            name: item.name || undefined,
            duration: item.duration || undefined,
            date: item.date || undefined,
            calories: item.calories || undefined,
            updateLog: this.handleOnNavigatedBack.bind(this)
        };
        this.props.navigation.navigate("New Activity", params);
    }
    addActivity() {
        this.props.navigation.navigate("New Activity",
         {
            updateLog: this.handleOnNavigatedBack.bind(this)
        });
    }
    componentDidMount() {
        this.getActivityList();
    }
    
    handleOnNavigatedBack() {
        this.getActivityList();
    }
    render() {
        return (
            <ScrollView>
                <ListItem title="Add new activity" titleStyle={{fontWeight: 'bold'}}
                subtitle={<Tooltip height={100} width={200} backgroundColor="lavender" popover={<Text>Swipe left on an item to delete it. Swipe right to edit an item.</Text>}>
                    <Text>Want to edit or delete an item?</Text>
                </Tooltip>}
                rightElement={
                    <TouchableOpacity
                        style={styles.addButton} 
                        onPress={() => this.addActivity()}>
                        <Icon color='white' type='font-awesome' size={30} name='plus'/>
                    </TouchableOpacity>}
                />
                <FlatList
                    data={this.state.activities.reverse()}
                    renderItem={({item}) => 
                    <Swipeable
                    renderLeftActions={(dragX) => <this.LeftActions item={item} dragX={dragX} onPress={this.removeItem.bind(this)}/>}
                    renderRightActions={(dragX) => <this.RightActions item={item} dragX={dragX} onPress={this.modifyActivity.bind(this)}/>}>
                        <Activity date={item.date} id={item.id} name={item.name} duration={item.duration} calories={item.calories}/>
                    </Swipeable>}
                    keyExtractor={(item, index) => `list-${item}-${index}`}
                />
            </ScrollView>
    );
    }
}
export default ActivityLog;
const styles = StyleSheet.create({
    leftAction: {
        backgroundColor: 'indigo',
        justifyContent: 'center',
        flex: 1
    },
    rightAction: {
        backgroundColor: 'mediumpurple',
        justifyContent: 'center',
        flex: 1,
        alignItems: 'flex-end'
    },
    actionText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        padding: 20
    },
    addButton: {
        padding: 1,
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: '#7637ad',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 5,
        right: 10
    }
})