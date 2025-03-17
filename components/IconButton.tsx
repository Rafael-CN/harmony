import { Pressable, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";

interface IconButtonProps {
    name: keyof typeof Ionicons.glyphMap;
    active?: boolean;
    size: number;
}

export default function IconButton({ ...props }: IconButtonProps & PressableProps) {
    return (
        <Pressable
            style={{
                width: props.size * 2,
                height: props.size * 2,
                borderRadius: props.size * 2,
                backgroundColor: props.active ? color.light : color.dark,
                justifyContent: "center",
                alignItems: "center",
            }}
            {...props}
        >
            <Ionicons name={props.name} size={props.size} color={props.active ? color.dark : color.light}></Ionicons>
        </Pressable>
    );
}
