import { FlatList } from 'react-native';
import { CATEGORIES } from '../data/dummy-data';
import CategoryGridTile from '../components/CategoryGridTile';

function CategoriesScreen({ navigation }) {
	const renderCategoryItem = (itemData) => {
		function pressHander() {
			navigation.navigate('MealsOverview', { categoryId: itemData.item.id });
		}

		return <CategoryGridTile title={itemData.item.title} color={itemData.item.color} onPress={pressHander} />;
	};

	return <FlatList data={CATEGORIES} keyExtractor={(item) => item.id} renderItem={renderCategoryItem} numColumns={2} />;
}

export default CategoriesScreen;
