import { StyleSheet, SafeAreaView, Text, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';

import CategoriesScreen from './screens/CategoriesScreen';
import MealsOverviewScreen from './screens/MealsOverviewScreen';
import MealDetailScreen from './screens/MealDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { store } from './store/redux/store';
import { useEffect } from 'react';

import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
	return (
		<Drawer.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: '#351401' },
				headerTintColor: '#fff',
				contentStyle: { backgroundColor: '#24180f' },
				drawerContentStyle: {
					backgroundColor: '#351401',
				},
				drawerInactiveTintColor: 'white',
				drawerActiveTintColor: '#351401',
				drawerActiveBackgroundColor: '#e4baa1',
			}}
		>
			<Drawer.Screen
				name='Categories'
				component={CategoriesScreen}
				options={{
					title: 'All Categories',
					drawerIcon: ({ color, size }) => {
						return <Ionicons name='list' color={color} size={size} />;
					},
				}}
			/>
			<Drawer.Screen
				name='Favorites'
				component={FavoritesScreen}
				options={{
					drawerIcon: ({ color, size }) => {
						return <Ionicons name='star' color={color} size={size} />;
					},
				}}
			/>
		</Drawer.Navigator>
	);
}

export default function App() {
	useEffect(() => {
		const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
			console.log(notification);
			console.log(notification.request.content.data);
		});
		const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log('Notification Response: ', response);
			console.log(response.notification.request.content.data);
		});
		return () => {
			subscription1.remove();
			subscription2.remove();
		};
	}, []);

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<StatusBar style='light' />
				<Provider store={store}>
					<NavigationContainer>
						<Stack.Navigator
							initialRouteName='MealsCategories'
							screenOptions={{
								headerStyle: { backgroundColor: '#351401' },
								headerTintColor: '#fff',
								contentStyle: { backgroundColor: '#24180f' },
							}}
						>
							<Stack.Screen
								name='MealsCategories'
								component={DrawerNavigator}
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen name='MealsOverview' component={MealsOverviewScreen} />
							<Stack.Screen
								name='MealDetail'
								component={MealDetailScreen}
								options={{
									title: 'About the meal',
								}}
							/>
						</Stack.Navigator>
					</NavigationContainer>
				</Provider>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {},
	safeArea: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
	},
});
