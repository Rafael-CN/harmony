import { useEffect, useRef, useState } from "react";
import { useAnimatedValue, Animated, StyleSheet, View, PanResponder } from "react-native";
import { Span, IconButton } from "../../components";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Main() {
    const musicButtonRef = useRef<View>(null);
    const peopleButtonRef = useRef<View>(null);
    const [buttonPositions, setButtonPositions] = useState({
        music: { x: 0, y: 0 },
        people: { x: 0, y: 0 },
    });

    const doActiveButton = (x: number, y: number) => {
        const musicDistance = Math.sqrt(Math.pow(x - buttonPositions.music.x, 2) + Math.pow(y - buttonPositions.music.y, 2));
        const peopleDistance = Math.sqrt(Math.pow(x - buttonPositions.people.x, 2) + Math.pow(y - buttonPositions.people.y, 2));

        if (musicDistance < peopleDistance) {
            handleActive("music");
        } else {
            handleActive("person");
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const { moveX, moveY } = gestureState;
            doActiveButton(moveX, moveY);
        },
        onPanResponderRelease: () => {
            if (active.music) {
                handleActive("none");
                navigation.navigate("FindMusic" as never);
            } else if (active.person) {
                handleActive("none");
                navigation.navigate("FindPeople" as never);
            }
        },
    });

    const buttonAnim = {
        gap: useAnimatedValue(0),
        margin: useAnimatedValue(45),
    };

    const doButtonAnim = (reverse = false) => {
        return new Promise((resolve) => {
            Animated.parallel([
                Animated.timing(buttonAnim.gap, {
                    toValue: reverse ? 0 : 75,
                    duration: 150,
                    useNativeDriver: false,
                }),
                Animated.timing(buttonAnim.margin, {
                    toValue: reverse ? 45 : 125,
                    duration: 150,
                    useNativeDriver: false,
                }),
            ]).start(resolve);
        });
    };

    const route = useRoute();

    useEffect(() => {
        buttonAnim.gap.setValue(0);
        buttonAnim.margin.setValue(45);

        doButtonAnim();

        const getButtonPositions = () => {
            musicButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
                setButtonPositions((prev) => ({
                    ...prev,
                    music: { x: pageX + width / 2, y: pageY + height / 2 },
                }));
            });

            peopleButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
                setButtonPositions((prev) => ({
                    ...prev,
                    people: { x: pageX + width / 2, y: pageY + height / 2 },
                }));
            });
        };

        setTimeout(getButtonPositions, 100);
    }, []);

    const descriptionAnim = {
        opacity: useAnimatedValue(0),
    };

    const [active, setActive] = useState({ music: false, person: false });

    const handleActive = (type: "music" | "person" | "none") => {
        setActive({ music: false, person: false, [type]: true });

        if (type !== "none") {
            Animated.timing(descriptionAnim.opacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    };

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
            e.preventDefault();
            await doButtonAnim(true);
            navigation.dispatch(e.data.action);
        });

        return () => unsubscribe();
    }, [navigation]);

    return (
        <Animated.View style={style.container} {...panResponder.panHandlers}>
            <Animated.View style={[style.description, { opacity: descriptionAnim.opacity }]}>
                <Span fontSize={28}>
                    Encontre novas{" "}
                    <Span fontSize={28} bold>
                        {active.music ? "músicas." : "pessoas."}
                    </Span>
                </Span>
                <Span>{active.music ? "que combinem com seu gosto musical" : "que escutam estilos parecidos com seus"}</Span>
            </Animated.View>

            <Animated.View style={[style.buttonGroup, { gap: buttonAnim.gap, marginBottom: buttonAnim.margin }]}>
                <View ref={musicButtonRef}>
                    <IconButton size={30} name="musical-notes" active={active.music} />
                </View>
                <View ref={peopleButtonRef}>
                    <IconButton size={30} name="person" active={active.person} />
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000aa",
        alignItems: "center",
    },

    description: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 75,
    },

    buttonGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
