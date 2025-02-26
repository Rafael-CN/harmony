import { Text, TextProps } from "react-native";
import { color as colors } from "../theme.json";

interface SpanProps {
    children: any;
    bold?: boolean;
    fontSize?: number;
    color?: string;
}

export default function Span({ ...props }: SpanProps & TextProps) {
    return (
        <Text
            style={[
                {
                    fontWeight: props.bold ? "800" : "400",
                    fontSize: props.fontSize ? props.fontSize : 16,
                    color: props.color ? props.color : colors.light,
                },
            ]}
            {...props}
        >
            {props.children}
        </Text>
    );
}
