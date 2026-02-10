import { StyleSheet, View, Animated, Dimensions, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import SwipeCard, { SwipeCardRef } from "../../components/find/SwipeCard";
import { useEffect, useRef, useState } from "react";
import { Music } from "../../types";
import { useDiscoveryApi } from "../../api";
import SwipeControls, { SwipeControlsRef } from "../../components/find/SwipeControls";
import FindMusicCard from "../../components/find/FindMusicCard";
import { EmptyState } from "../../components/common";

const { width } = Dimensions.get("window");

export default function FindMusic() {
    const discoveryApi = useDiscoveryApi();

    const [hasMoreMusics, setHasMoreMusics] = useState(true);
    const [musicQueue, setMusicQueue] = useState<Music[]>([]);

    const renderedQueue = musicQueue.slice(0, 3);
    const renderedMusic = renderedQueue[0];

    const swipeControlsRef = useRef<SwipeControlsRef>(null);
    const [trackId, setTrackId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    const fetchMusic = async () => {
        setIsLoading(true);
        setFetchError(false);

        try {
            const recommendedMusics = await discoveryApi.getRecommendedMusics(9);
            setMusicQueue((prev) => [...prev, ...recommendedMusics]);

            if (recommendedMusics.length < 9) setHasMoreMusics(false);
        } catch {
            setFetchError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (musicQueue.length <= 3 && hasMoreMusics) {
            fetchMusic();
        }
    }, [musicQueue]);

    const swipeCardRef = useRef<SwipeCardRef>(null);

    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        translateX.setValue(0);

        if (renderedMusic?.id) setTrackId(renderedMusic.id);
    }, [renderedMusic]);

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

    const handleSwipe = () => {
        setMusicQueue((currentQueue) => {
            const newQueue = currentQueue.slice(1);
            swipeControlsRef.current?.playTrack(newQueue[0].id);

            return newQueue;
        });
    };

    const handleDislike = () => {
        swipeCardRef.current?.swipe("left");
    };

    const handleLike = () => {
        swipeCardRef.current?.swipe("right");
    };

    return (
        <LinearGradient colors={["#000000", `${color.extraDark}99`]} style={style.container}>
            <View style={style.cardContainer}>
                {isLoading && <ActivityIndicator size="large" color={color.light} />}

                {fetchError && (
                    <EmptyState
                        icon="alert-circle-outline"
                        title="Erro ao carregar musicas"
                    />
                )}

                {!fetchError && !isLoading && musicQueue.length === 0 && (
                    <EmptyState
                        icon="musical-notes-outline"
                        title="Nenhuma musica disponivel"
                        subtitle="Volte mais tarde"
                    />
                )}

                {renderedQueue.map((music, index) => {
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
                            key={music.id}
                            style={[
                                style.cardWrapper,
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
                                <FindMusicCard music={music} />
                            </SwipeCard>
                        </Animated.View>
                    );
                })}

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

const style = StyleSheet.create({
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
