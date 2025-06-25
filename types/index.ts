export interface Music {
    id: string;
    name: string;
    artist: string;
    linkUrl: string;
    smallImageUrl: string;
    mediumImageUrl: string;
    largeImageUrl: string;

    artistImageUrl?: string;
    releaseYear?: number;
}

export interface Artist {
    id: string;
    name: string;
    imageUrl: string;
    linkUrl: string;
}

export interface ProfileData {
    userId: string;
    displayName: string;
    username: string;
    profilePictureUrl: string;
    bio: string;
    status: {
        topArtists: string[];
        topSongs: string[];
        topGenres: string[];
        likedCount: number;
    };
    followersCount: number;
    followingCount: number;
    nowMusicId: string;
}

export interface RecommendedUser {
    username: string;
    displayName: string;
    profilePictureUrl?: string;
    compatibilityScore: number;
    bio?: string;
    nowMusicId: string;
}

export interface Chat {
    chatId: string;

    otherParticipant: {
        username: string;
        displayName: string;
        profilePictureUrl: string;
    };

    lastMessage: string;
    lastMessageAt: string;
}

export interface ChatMessage {
    id: string;

    content: string;

    senderId: string;

    isMe: boolean;

    createdAt: string;
}
