import { Animated, Dimensions, Image, ImageBackground, ImageSourcePropType, PanResponder, StyleSheet, Text, View } from "react-native";
import { color } from "../../theme.json";
import { Background, Span } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";

const { width, height } = Dimensions.get("window");

interface User {
    name: string;
    bio: string;
    age: number;
    profilePic: ImageSourcePropType;
}

export default function FindPeople() {
    const swipe = useRef(new Animated.ValueXY()).current;
    const tilt = useRef(new Animated.Value(1)).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx, dy, y0 }) => {
            swipe.setValue({ x: dx, y: dy });
            tilt.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
        },
        onPanResponderRelease: (_, { dx, dy }) => {
            const direction = Math.sign(dx);
            const isActionActive = Math.abs(dx) > 100; // width * 0.3;

            if (isActionActive) {
                // Swipe off
                Animated.timing(swipe, {
                    toValue: {
                        x: direction * 500, //width,
                        y: dy,
                    },
                    duration: 100,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    if (userIndex >= users.length - 1) {
                        setUserIndex(0);
                    } else {
                        setUserIndex(userIndex + 1);
                    }

                    setTimeout(() => {
                        swipe.setValue({ x: 0, y: 0 });
                    }, 150);
                }, 250);
            } else {
                // Return to orignal position
                Animated.spring(swipe, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    friction: 5,
                }).start();
            }
        },
    });

    const rotate = Animated.multiply(swipe.x, tilt).interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ["-8deg", "0deg", "8deg"],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }],
    };

    const [users, setUsers] = useState<Array<User>>([
        {
            name: "Rafael",
            bio: "Rap na veia",
            age: 23,
            profilePic: require("../../assets/users/1.png"),
        },
        {
            name: "Gabriel",
            bio: "Alguém ai",
            age: 18,
            profilePic: require("../../assets/users/2.png"),
        },
        {
            name: "Leonardo",
            bio: "O cara que não fala",
            age: 25,
            profilePic: require("../../assets/users/3.png"),
        },
    ]);

    const [userIndex, setUserIndex] = useState(0);

    const UserCard = ({ ...user }: User) => {
        return (
            <ImageBackground source={user.profilePic} style={{ flex: 1 }}>
                <LinearGradient style={style.cardBackground} colors={["#00000000", color.extraDark + "BB"]}>
                    <View style={style.music}>
                        <Image source={require("../../assets/song-cover.png")} style={style.musicAlbum} />
                        <View style={style.musicInfo}>
                            <Span color="white" fontSize={10}>
                                505
                            </Span>
                            <Span light color="white" fontSize={10}>
                                Arctic Monkeys
                            </Span>
                        </View>
                        <Image source={require("../../assets/playing.png")} style={style.equalizer} />
                    </View>
                    <View style={style.textOverlay}>
                        <View style={style.profileInfo}>
                            <Span color="white" bold fontSize={36}>
                                {user.name}
                            </Span>
                            <Span color="white" light>
                                {user.bio}
                            </Span>
                        </View>
                        <View style={style.ageInfo}>
                            <Span color="white" light>
                                Idade
                            </Span>
                            <Span bold color="white" fontSize={36}>
                                {user.age}
                            </Span>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        );
    };

    return (
        <Background>
            <View style={style.container}>
                <View style={style.cardBefore}></View>
                <Animated.View style={[style.card, animatedCardStyle]} {...panResponder.panHandlers}>
                    <UserCard {...users[userIndex]} />
                </Animated.View>
            </View>
        </Background>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },

    cardBefore: {
        backgroundColor: color.regular,
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        elevation: 20,
        boxShadow: "0px 0px 15px 1px " + color.extraDark,
    },

    card: {
        backgroundColor: color.light,
        overflow: "hidden",
        width: "80%",
        height: "65%",
        borderRadius: 20,
        elevation: 10,
        zIndex: 10,
    },

    cardBackground: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },

    music: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.extraDark,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        gap: 15,
    },

    musicInfo: {
        gap: 2,
    },

    musicAlbum: {
        height: 30,
        width: 30,
        borderRadius: 5,
    },

    equalizer: {
        height: 12,
        width: 20,
    },

    textOverlay: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    profileInfo: {},
    ageInfo: {
        marginTop: 10,
    },
});
