import { BottomTabBarButtonProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";
import { Home, Chat, Search, Profile } from "../screens/tabs";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { transform } from "@babel/core";
import FindNavigator from "./FindNavigator";
import { ProfileProvider } from "../context/ProfileContext";
import { AudioProvider } from "../context/AudioContext";

interface TabIconProps {
    name: keyof typeof Ionicons.glyphMap;
    focused: boolean;
    iconColor: string;
}

const CustomTabIcon = ({ name, focused, iconColor }: TabIconProps) => {
    return (
        <View>
            <Ionicons name={name} size={focused ? 26 : 24} color={iconColor} />
        </View>
    );
};

const AnimatedTabBarButton = ({ children, onPress, ...props }: BottomTabBarButtonProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.8);
        opacity.value = withSpring(0.6);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            {...(props as any)}
            android_ripple={{ color: "transparent" }}
        >
            <Animated.View style={[styles.tabBarIconStyle, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default function TabNavigator() {
    const Tab = createBottomTabNavigator();

    return (
        <View style={{ flex: 1 }}>
            <AudioProvider>
                <ProfileProvider>
                    <Tab.Navigator
                        screenOptions={{
                            headerShown: false,
                            tabBarStyle: styles.tabBar,
                            tabBarShowLabel: false,
                            tabBarIconStyle: styles.tabBarIconStyle,
                            tabBarActiveTintColor: color.light,
                            tabBarInactiveTintColor: color.regular,
                            tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
                        }}
                    >
                        <Tab.Screen
                            name="Home"
                            component={Home}
                            options={{
                                tabBarIcon: ({ color, focused }) => (
                                    <CustomTabIcon
                                        name={focused ? "home" : "home-outline"}
                                        focused={focused}
                                        iconColor={color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={Search}
                            options={{
                                tabBarIcon: ({ color, focused }) => (
                                    <CustomTabIcon
                                        name={focused ? "search" : "search-outline"}
                                        focused={focused}
                                        iconColor={color}
                                    />
                                ),
                            }}
                        />

                        <Tab.Screen
                            name="Discover"
                            component={FindNavigator}
                            options={{
                                tabBarIcon: ({ color, focused }) => (
                                    <CustomTabIcon
                                        name={focused ? "heart" : "heart-outline"}
                                        focused={focused}
                                        iconColor={color}
                                    />
                                ),
                            }}
                        />

                        <Tab.Screen
                            name="Chat"
                            component={Chat}
                            options={{
                                tabBarIcon: ({ color, focused }) => (
                                    <CustomTabIcon
                                        name={focused ? "chatbox" : "chatbox-outline"}
                                        focused={focused}
                                        iconColor={color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profile"
                            component={Profile}
                            options={{
                                tabBarIcon: ({ color, focused }) => (
                                    <CustomTabIcon
                                        name={focused ? "person" : "person-outline"}
                                        focused={focused}
                                        iconColor={color}
                                    />
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </ProfileProvider>
            </AudioProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: color.extraDark,
        borderTopWidth: 1,
        borderColor: color.dark,
        height: 120,
    },
    tabBarIconStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
