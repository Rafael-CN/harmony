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
}

export interface RecommendedUser {
    username: string;
    displayName: string;
    profilePictureUrl?: string;
    compatibilityScore: number;
    bio?: string;
}
