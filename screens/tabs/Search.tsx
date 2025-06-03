import { StyleSheet, TextInput } from "react-native";
import { Background, Input } from "../../components";
import { useEffect, useRef } from "react";

export default function Search() {
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    return (
        <Background>
            <Input ref={inputRef} autoFocus style={styles.search} placeholder="Pesquisar..." />
        </Background>
    );
}

const styles = StyleSheet.create({
    search: {
        marginTop: 35,
        width: "90%",
        height: "10%",
    },
});
