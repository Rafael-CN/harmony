import { Text, TextProps } from "react-native";
import { color as colors } from "../theme.json";

interface SpanProps {
    children: any;
    bold?: boolean;
    light?: boolean;
    fontSize?: number;
    color?: string;
    noTruncate?: boolean;
}

export default function Span({ ...props }: SpanProps & TextProps) {
    return (
        <Text
            {...props}
            numberOfLines={props.noTruncate ? undefined : 1}
            style={[
                {
                    fontWeight: props.bold ? "800" : props.light ? "200" : "400",
                    fontSize: props.fontSize ? props.fontSize : 16,
                    color: props.color ? props.color : colors.light,
                },
                props.style,
            ]}
        >
            {props.children}
        </Text>
    );
}
