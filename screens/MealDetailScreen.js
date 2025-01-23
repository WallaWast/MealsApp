import { View, Image, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useEffect, useLayoutEffect } from 'react';
import { MEALS } from '../data/dummy-data';
import MealDetails from '../components/MealDetails';
import Subtitle from '../components/Subtitle';
import List from '../components/List';
import IconButton from '../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
// import { FavoritesContext } from '../store/context/favorites-context';
import { addFavorite, removeFavorite } from '../store/redux/favorites';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const MealDetailScreen = ({ route, navigation }) => {
	// const favoriteMealsCtx = useContext(FavoritesContext);
	const favoriteMealIds = useSelector((state) => state.favoriteMeals.ids);
	const dispatch = useDispatch();

	const mealId = route.params.mealId;
	const selectedMeal = MEALS.find((meal) => meal.id === mealId);

	const mealIsFavorite = favoriteMealIds.includes(mealId);

	function sendPushNotification() {
		fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				to: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]', // Change with the corrent push token
				title: `Reminder of ${selectedMeal.title}`,
				body: `Don't forget to prepare your ${selectedMeal.title} meal!`,
				data: { mealId: mealId },
			}),
		});
	}

	function scheduleNotificationHandler() {
		//console.log('Schedule');
		Notifications.scheduleNotificationAsync({
			content: {
				title: `Reminder of ${selectedMeal.title}`,
				body: `Don't forget to prepare your ${selectedMeal.title} meal!`,
				data: { mealId: mealId },
			},
			trigger: {
				seconds: 5,
			},
		});
	}

	function changeFavoriteStatusHandler() {
		if (mealIsFavorite) {
			// favoriteMealsCtx.removeFavorite(mealId);
			dispatch(removeFavorite({ id: mealId }));
		} else {
			// favoriteMealsCtx.addFavorite(mealId);
			dispatch(addFavorite({ id: mealId }));
		}
	}

	useEffect(() => {
		(async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission to show notifications has not been granted.');
			}
		})();
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<IconButton
						onPress={changeFavoriteStatusHandler}
						icon={mealIsFavorite ? 'star' : 'star-outline'}
						color='white'
						size={24}
					/>
				);
			},
		});
	}, [navigation, changeFavoriteStatusHandler]);

	return (
		<ScrollView style={styles.rootContainer}>
			<Button title='Schedule Notification' onPress={scheduleNotificationHandler} />
			<Button title='Send Push Notification' onPress={sendPushNotification} />
			<Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
			<Text style={styles.title}>{selectedMeal.title}</Text>
			<MealDetails
				duration={selectedMeal.duration}
				complexity={selectedMeal.complexity}
				affordability={selectedMeal.affordability}
				textStyle={styles.detailText}
			/>
			<View style={styles.listOuterContainer}>
				<View style={styles.listContainer}>
					<Subtitle>Ingredients</Subtitle>
					<List data={selectedMeal.ingredients} />
					<Subtitle>Steps</Subtitle>
					<List data={selectedMeal.steps} />
				</View>
			</View>
		</ScrollView>
	);
};

export default MealDetailScreen;

const styles = StyleSheet.create({
	rootContainer: {
		marginBottom: 32,
	},
	image: {
		width: '100%',
		height: 350,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 24,
		margin: 8,
		textAlign: 'center',
		color: 'white',
	},
	detailText: {
		color: 'white',
	},
	listOuterContainer: {
		alignItems: 'center',
	},
	listContainer: {
		width: '80%',
	},
});
