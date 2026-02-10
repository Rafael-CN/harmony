import { StyleSheet, View, Animated, Dimensions, ActivityIndicator, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import SwipeCard, { SwipeCardRef } from "../../components/find/SwipeCard";
import { useEffect, useRef, useState } from "react";
import { useDiscoveryApi, useUserApi } from "../../api";
import SwipeControls, { SwipeControlsRef } from "../../components/find/SwipeControls";
import { RecommendedUser } from "../../types";
import FindUserCard from "../../components/find/FindUserCard";
import { EmptyState } from "../../components/common";
import MatchModal from "../../components/find/MatchModal";

const { width } = Dimensions.get("window");

export default function FindProfile() {
    const discoveryApi = useDiscoveryApi();
    const userApi = useUserApi();

    const [userPage, setUserPage] = useState(1);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);

    const [userQueue, setUserQueue] = useState<RecommendedUser[]>([]);

    const renderedQueue = userQueue.slice(0, 3);
    const renderedUser = renderedQueue[0];

    const swipeControlsRef = useRef<SwipeControlsRef>(null);
    const [trackId, setTrackId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const isFetchingRef = useRef(false);

    const [matchModalVisible, setMatchModalVisible] = useState(false);
    const [matchUsername, setMatchUsername] = useState("");

    const fetchUsers = async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setIsLoading(true);
        setFetchError(false);

        try {
            const recommendedUsers = await discoveryApi.getRecommendedUsers(userPage, 9);

            setUserQueue((prev) => [...prev, ...recommendedUsers]);
            setUserPage((prev) => prev + 1);

            if (recommendedUsers.length < 9) setHasMoreUsers(false);
        } catch {
            setFetchError(true);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    };

    useEffect(() => {
        if (userQueue.length <= 3 && hasMoreUsers) {
            fetchUsers();
        }
    }, [userQueue]);

    const swipeCardRef = useRef<SwipeCardRef>(null);

    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        translateX.setValue(0);

        if (renderedUser?.nowMusicId) setTrackId(renderedUser.nowMusicId);
    }, [renderedUser]);

    const nextCardScale = translateX.interpolate({
        inputRange: [0, width * 0.4],
        outputRange: [0.9, 1],
        extrapolate: "clamp",
    });

    const nextCardY = translateX.interpolate({
        inputRange: [0, width * 0.4],
        outputRange: [35, 0],
        extrapolate: "clamp",
    });

    const lastCardScale = translateX.interpolate({
        inputRange: [0, width * 0.4],
        outputRange: [0.8, 0.9],
        extrapolate: "clamp",
    });

    const lastCardY = translateX.interpolate({
        inputRange: [0, width * 0.4],
        outputRange: [80, 40],
        extrapolate: "clamp",
    });

    const handleSwiping = (dx: number) => {
        translateX.setValue(Math.abs(dx));
    };

    const handleSwipeCancel = () => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const handleSwipe = (direction: "left" | "right") => {
        setUserQueue((currentQueue) => {
            const swipedUser = currentQueue[0];

            if (direction === "right") {
                handleFollow(swipedUser.username);
            }

            // swipeControlsRef.current?.playTrack(newQueue[0].id);

            const newQueue = currentQueue.slice(1);
            return newQueue;
        });
    };

    const handleFollow = async (username: string) => {
        const response = await userApi.followUser(username);
        if (response.succeeded && response.isMatch) {
            setMatchUsername(username);
            setMatchModalVisible(true);
        }
    };

    const handleDislike = () => {
        swipeCardRef.current?.swipe("left");
    };

    const handleLike = () => {
        swipeCardRef.current?.swipe("right");
    };

    return (
        <LinearGradient colors={["#000000", `${color.extraDark}99`]} style={styles.container}>
            <MatchModal
                visible={matchModalVisible}
                onClose={() => setMatchModalVisible(false)}
                username={matchUsername}
            />
            <View style={styles.cardContainer}>
                {isLoading && <ActivityIndicator size="large" color={color.light} />}

                {renderedQueue.map((user, index) => {
                    const isTopCard = index === 0;
                    const isNextCard = index === 1;
                    const isLastCard = index === 2;

                    const cardStyle = {
                        transform: [
                            {
                                scale: isNextCard ? nextCardScale : isLastCard ? lastCardScale : 1,
                            },
                            { translateY: isNextCard ? nextCardY : isLastCard ? lastCardY : 0 },
                        ],
                    };

                    return (
                        <Animated.View
                            key={user.username}
                            style={[
                                styles.cardWrapper,
                                {
                                    zIndex: renderedQueue.length - index,
                                },
                                cardStyle,
                            ]}
                        >
                            <SwipeCard
                                ref={isTopCard ? swipeCardRef : undefined}
                                onSwipeEnd={isTopCard ? handleSwipe : () => {}}
                                onSwiping={isTopCard ? handleSwiping : () => {}}
                                onSwipeCancel={isTopCard ? handleSwipeCancel : () => {}}
                            >
                                <FindUserCard user={user} />
                            </SwipeCard>
                        </Animated.View>
                    );
                })}

                {fetchError && (
                    <EmptyState
                        icon="alert-circle-outline"
                        title="Erro ao carregar usuarios"
                    />
                )}

                {!fetchError && !hasMoreUsers && userQueue.length === 0 && (
                    <EmptyState
                        icon="people-outline"
                        title="Ninguem novo por aqui"
                        subtitle="Volte mais tarde para descobrir novas pessoas"
                    />
                )}

                <SwipeControls
                    ref={swipeControlsRef}
                    trackId={trackId}
                    onDislikePress={handleDislike}
                    onLikePress={handleLike}
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    cardWrapper: {
        position: "absolute",
        top: -20,
        width: "100%",
        height: "100%",
    },
});
