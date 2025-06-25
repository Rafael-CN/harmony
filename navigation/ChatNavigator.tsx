import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FindMusic, FindUser, Main } from "../screens/find";
import { View } from "react-native";
import { color } from "../theme.json";
import ChatList from "../screens/chat/ChatList";
import ChatMessages from "../screens/chat/ChatMessages";

export default function ChatNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <View style={{ flex: 1, backgroundColor: color.extraDark }}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: color.extraDark },
                    animation: "none",
                }}
                initialRouteName="ChatList"
            >
                <Stack.Screen name="ChatList" component={ChatList}></Stack.Screen>
                <Stack.Screen name="ChatMessages" component={ChatMessages}></Stack.Screen>
            </Stack.Navigator>
        </View>
    );
}
