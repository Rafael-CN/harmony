import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Modal, View, PressableProps, GestureResponderEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";

import { Home, Chat, Search, Profile } from "../screens/tabs";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function TabNavigator() {
    const navigation = useNavigation<any>();

    const FindButton = () => {
        const [fingerPosition, setFingerPosition] = useState({ x: 0, y: 0 });

        const handlePressIn = (event: GestureResponderEvent) => {
            const { pageX, pageY } = event.nativeEvent;
            setFingerPosition({ x: pageX, y: pageY });

            navigation.navigate("FindNavigator", {
                screen: "Main",
                params: {
                    initialFingerPosition: { x: fingerPosition.x, y: fingerPosition.y },
                    fromTabPress: true,
                },
            });
        };

        return (
            <Pressable style={styles.findButton} onPressIn={handlePressIn}>
                <Ionicons name={"heart"} size={34} color={color.dark} />
            </Pressable>
        );
    };

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
                    name="Favorite"
                    component={Home}
                    options={{
                        tabBarButton: () => <FindButton />,
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
        backgroundColor: color.dark,
        borderTopWidth: 0,
        height: 70,
    },
    findButton: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: color.light,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -40,
        borderWidth: 10,
        borderColor: color.dark,
    },

    iconButton: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: color.light,
        justifyContent: "center",
        alignItems: "center",
    },
});
