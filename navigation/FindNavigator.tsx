import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FindMusic, FindUser, Main } from "../screens/find";
import { View } from "react-native";
import { color } from "../theme.json";
import { useAudio } from "../context/AudioContext";

export default function FindNavigator() {
    const Stack = createNativeStackNavigator();

    const { stopTrack } = useAudio();

    return (
        <View style={{ flex: 1, backgroundColor: color.extraDark }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: color.extraDark },
                    animation: "none",
                }}
                screenListeners={{
                    beforeRemove: () => {
                        stopTrack();
                    },
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
