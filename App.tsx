import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Register, Spotify } from "./screens/auth";
import TabNavigator from "./navigation/TabNavigator";
import { View } from "react-native";
import { color } from "./theme.json";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { userToken, isLinkedSpotify } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
            {userToken && isLinkedSpotify ? (
                <Stack.Screen name="TabNavigator" component={TabNavigator}></Stack.Screen>
            ) : userToken ? (
                <Stack.Screen name="Spotify" component={Spotify}></Stack.Screen>
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login}></Stack.Screen>
                    <Stack.Screen name="Register" component={Register}></Stack.Screen>
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    const [loaded, error] = useFonts({
        "Nexa-Bold": require("./assets/fonts/Nexa-Bold.otf"),
        "Nexa-Regular": require("./assets/fonts/Nexa-Regular.otf"),
        "Nexa-Light": require("./assets/fonts/Nexa-Light.otf"),
        "Nexa-Heavy": require("./assets/fonts/Nexa-Heavy.ttf"),
        "Nexa-ExtraLight": require("./assets/fonts/Nexa-ExtraLight.ttf"),
    });

    if (!loaded && !error) {
        return null;
    }

    return (
        <NavigationContainer>
            <View style={{ flex: 1, backgroundColor: color.extraDark }}>
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </View>
        </NavigationContainer>
    );
}
