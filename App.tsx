import { useFonts } from "expo-font";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Register } from "./screens/auth";

export default function App() {
    SplashScreen.preventAutoHideAsync();

    const [loaded, error] = useFonts({
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
