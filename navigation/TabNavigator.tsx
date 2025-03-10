import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Modal, View, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";

import { Home, Chat, Search, Profile } from "../screens/tabs";
import { useState } from "react";
import Find from "./Find";

export default function Logged() {
    const [findVisible, setFindVisible] = useState(false);

    const FindButton = () => {
        const handlePress = () => {
            setFindVisible(true);
        };

        return (
            <Pressable style={styles.findButton} onPressIn={handlePress}>
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

            <Modal visible={findVisible} transparent>
                <Pressable style={{ flex: 1 }} onPress={() => setFindVisible(false)}>
                    <Find />
                </Pressable>
            </Modal>
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
