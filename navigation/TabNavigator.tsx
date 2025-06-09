import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";

import { Home, Chat, Search, Profile } from "../screens/tabs";
import { useNavigation } from "@react-navigation/native";

export default function TabNavigator() {
    const navigation = useNavigation<any>();
    const Tab = createBottomTabNavigator();

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarShowLabel: false,
                    tabBarIconStyle: { flex: 1 },
                    tabBarActiveTintColor: color.light,
                    tabBarInactiveTintColor: color.regular,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={Search}
                    options={{
                        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />,
                    }}
                />

                <Tab.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbox" : "chatbox-outline"} size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />,
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: color.extraDark,
        borderColor: color.dark,
        borderTopWidth: 2,
        paddingTop: 10,
        height: 110,
    },
});
