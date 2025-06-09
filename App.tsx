import { useFonts } from "expo-font";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Register, Spotify } from "./screens/auth";
import TabNavigator from "./navigation/TabNavigator";
import FindNavigator from "./navigation/FindNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loaded, error] = useFonts({
        "Nexa-Bold": require("./assets/fonts/Nexa-Bold.otf"),
        "Nexa-Regular": require("./assets/fonts/Nexa-Regular.otf"),
        "Nexa-Light": require("./assets/fonts/Nexa-Light.otf"),
        "Nexa-Heavy": require("./assets/fonts/Nexa-Heavy.ttf"),
        "Nexa-ExtraLight": require("./assets/fonts/Nexa-ExtraLight.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
                <Stack.Screen name="Login" component={Login}></Stack.Screen>
                <Stack.Screen name="Register" component={Register}></Stack.Screen>
                <Stack.Screen name="Spotify" component={Spotify}></Stack.Screen>
                <Stack.Screen name="TabNavigator" component={TabNavigator}></Stack.Screen>
                <Stack.Screen name="FindNavigator" component={FindNavigator} options={{ presentation: "transparentModal", animation: "none" }}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
