import { ImageSourcePropType } from "react-native";
import { getRandomIndex, getRandomItem } from "./Utils";

export interface User {
    name: string;
    bio: string;
    age: number;
    profilePic: ImageSourcePropType;
}

// Collection of mock users
const mockUsers: User[] = [
    {
        name: "Rafael",
        bio: "Rap na veia",
        age: 23,
        profilePic: require("../assets/users/1.png"),
    },
    {
        name: "Gabriel",
        bio: "Alguém ai",
        age: 18,
        profilePic: require("../assets/users/2.png"),
    },
    {
        name: "Leonardo",
        bio: "O cara que não fala",
        age: 25,
        profilePic: require("../assets/users/3.png"),
    },
    {
        name: "Julia",
        bio: "Música é vida",
        age: 21,
        profilePic: require("../assets/users/1.png"),
    },
    {
        name: "Mariana",
        bio: "Rock and roll",
        age: 24,
        profilePic: require("../assets/users/2.png"),
    },
    {
        name: "Pedro",
        bio: "Buscando novas conexões",
        age: 27,
        profilePic: require("../assets/users/3.png"),
    },
    {
        name: "Carla",
        bio: "Amante de jazz",
        age: 22,
        profilePic: require("../assets/users/1.png"),
    },
    {
        name: "Bruno",
        bio: "Sempre na estrada",
        age: 26,
        profilePic: require("../assets/users/2.png"),
    },
    {
        name: "Amanda",
        bio: "Vamos conversar sobre música?",
        age: 20,
        profilePic: require("../assets/users/3.png"),
    },
    {
        name: "Thiago",
        bio: "Baterista nas horas vagas",
        age: 28,
        profilePic: require("../assets/users/1.png"),
    },
];

// Get a random user from the mock users list
export function getRandomUser(): User {
    return getRandomItem(mockUsers);
}

// Get multiple random users
export function getRandomUsers(count: number = 3): User[] {
    const selectedUsers: User[] = [];
    const usedIndexes = new Set<number>();

    while (selectedUsers.length < count && usedIndexes.size < mockUsers.length) {
        const randomIndex = getRandomIndex(mockUsers.length);

        if (!usedIndexes.has(randomIndex)) {
            usedIndexes.add(randomIndex);
            selectedUsers.push(mockUsers[randomIndex]);
        }
    }

    return selectedUsers;
}
