import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FindMusic, FindPeople, Main } from "../screens/find";
import { useNavigation } from "@react-navigation/native";

export default function FindNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" }, animation: "none" }} initialRouteName="Main">
            <Stack.Screen name="Main" component={Main}></Stack.Screen>
            <Stack.Screen name="FindMusic" component={FindMusic}></Stack.Screen>
            <Stack.Screen name="FindPeople" component={FindPeople}></Stack.Screen>
        </Stack.Navigator>
    );
}
