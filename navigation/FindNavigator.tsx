import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FindMusic, FindUser, Main } from "../screens/find";
import { View } from "react-native";
import { color } from "../theme.json";

export default function FindNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <View style={{ flex: 1, backgroundColor: color.extraDark }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: color.extraDark },
                    animation: "none",
                }}
                initialRouteName="Main"
            >
                <Stack.Screen name="Main" component={Main}></Stack.Screen>
                <Stack.Screen name="FindMusic" component={FindMusic}></Stack.Screen>
                <Stack.Screen name="FindPeople" component={FindUser}></Stack.Screen>
            </Stack.Navigator>
        </View>
    );
}
