import { Animated, Dimensions, Image, ImageBackground, ImageSourcePropType, PanResponder, StyleSheet, View } from "react-native";
import { color } from "../../theme.json";
import { Background, Span } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { getRandomMusic, Music } from "../../context/Music";
import { getRandomIndex } from "../../context/Utils";
import { User, getRandomUsers } from "../../context/User";
import SwipeCard from "./SwipeCard";

export default function FindPeople() {
    const [users, setUsers] = useState<Array<User>>(getRandomUsers(5));

    const [randomSong, setRandomSong] = useState<Music>();
    const [userIndex, setUserIndex] = useState(0);

    useEffect(() => {
        getRandomMusic().then(setRandomSong);
    }, []);

    const handleSwipe = (direction: "left" | "right", resetCard: () => void) => {
        getRandomMusic().then((song) => {
            setRandomSong(song);
            setUserIndex(getRandomIndex(users.length));

            setTimeout(() => {
                resetCard();
            }, 50);
        });
    };

    const UserCard = ({ ...user }: User) => {
        return (
            <ImageBackground source={user.profilePic} style={{ flex: 1 }}>
                <LinearGradient style={style.cardBackground} colors={["#00000000", color.extraDark + "BB"]}>
                    <View style={style.music}>
                        <Image source={{ uri: randomSong?.photo }} style={style.musicAlbum} />
                        <View style={style.musicInfo}>
                            <Span color="white" fontSize={11}>
                                {randomSong?.name}
                            </Span>
                            <Span light color="white" fontSize={11}>
                                {randomSong?.artist}
                            </Span>
                        </View>
                        <Image source={require("../../assets/playing.png")} style={style.equalizer} />
                    </View>
                    <View style={style.textOverlay}>
                        <View>
                            <Span color="white" bold fontSize={36}>
                                {user.name}
                            </Span>
                            <Span color="white" light style={{ maxWidth: 200 }}>
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
            <SwipeCard onSwipe={handleSwipe}>
                <UserCard {...users[userIndex]} />
            </SwipeCard>
        </Background>
    );
}

const style = StyleSheet.create({
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
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 15,
    },

    musicInfo: {
        gap: 2,
        maxWidth: 150,
    },

    musicAlbum: {
        height: 40,
        width: 40,
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

    ageInfo: {
        marginTop: 10,
    },
});
