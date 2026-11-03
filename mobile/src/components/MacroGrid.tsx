import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/storage/meals';
import { StyleSheet, View } from 'react-native';
import MacroCard from './MacroCard';

type MacroGridProps = {
    meals: Meal[];
};

export default function MacroGrid({ meals }: MacroGridProps) {
    const { user } = useAuth();

    const totals = meals.reduce(
        (acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const calorieGoal = user?.dailyCalorieGoal
        ? user.dailyCalorieGoal.toLocaleString()
        : '2,000';
    const proteinGoal = user?.dailyProteinGoal
        ? `${user.dailyProteinGoal}g`
        : '150g';
    const carbsGoal = user?.dailyCarbsGoal
        ? `${user.dailyCarbsGoal}g`
        : '250g';
    const fatGoal = user?.dailyFatGoal
        ? `${user.dailyFatGoal}g`
        : '65g';

    return (
        <View style={styles.grid}>
            <MacroCard
                label='Calories'
                value={`${totals.calories}`}
                goal={calorieGoal}
                color='#ff6b6b'
            />
            <MacroCard
                label='Protein'
                value={`${totals.protein}g`}
                goal={proteinGoal}
                color='#4ecdc4'
            />
            <MacroCard
                label='Carbs'
                value={`${totals.carbs}g`}
                goal={carbsGoal}
                color='#ffd93d'
            />
            <MacroCard
                label='Fat'
                value={`${totals.fat}g`}
                goal={fatGoal}
                color='#6bcb77'
            />
        </View>
    );
}


const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});