import axios from "axios";
import { getRandomItem } from "./Utils";
global.Buffer = require("buffer").Buffer;

// HARDCODED
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export interface Music {
    name: string;
    artist: string;
    photo: string;
    album?: string;
    url?: string;
    popularity?: number;
    preview_url?: string;
}

const genres = ["rock", "pop", "electronic", "hip-hop", "jazz", "classical", "metal", "indie", "blues", "reggae", "country", "folk", "r&b", "soul", "punk"];

// Get Spotify access token
async function getSpotifyToken(): Promise<string> {
    try {
        const response = await axios({
            method: "post",
            url: SPOTIFY_TOKEN_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(process.env.EXPO_PUBLIC_SPOTIFY_ID + ":" + process.env.EXPO_PUBLIC_SPOTIFY_SECRET).toString("base64"),
            },
            data: "grant_type=client_credentials",
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error getting Spotify token:", error);
        throw error;
    }
}

async function fetchTracksByGenre(genre: string, token: string): Promise<any[]> {
    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
            params: {
                q: `genre:${genre}`,
                type: "track",
                limit: 50,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.tracks.items;
    } catch (error) {
        console.error("Error fetching tracks:", error);
        return [];
    }
}

export async function getRandomMusic(): Promise<Music> {
    try {
        const token = await getSpotifyToken();
        const randomGenre = getRandomItem(genres);

        const tracks = await fetchTracksByGenre(randomGenre, token);
        if (!tracks || tracks.length === 0) {
            throw new Error("No tracks found");
        }

        const randomTrack = getRandomItem(tracks);
        const artists = randomTrack.artists.map((artist: any) => artist.name).join(", ");

        return {
            name: randomTrack.name,
            artist: artists,
            photo: randomTrack.album.images[0]?.url || "https://via.placeholder.com/300", // Get largest image or use placeholder
            album: randomTrack.album.name,
            url: randomTrack.external_urls.spotify,
            popularity: randomTrack.popularity,
            preview_url: randomTrack.preview_url,
        };
    } catch (error) {
        console.error("Error getting random music:", error);

        return {
            name: "Unknown Track",
            artist: "Unknown Artist",
            photo: "https://via.placeholder.com/300",
            album: "Unknown Album",
        };
    }
}

export async function getRandomMusicList(count: number = 5): Promise<Music[]> {
    try {
        // Get token once for all requests
        const token = await getSpotifyToken();
        const randomGenre = getRandomItem(genres);

        // Fetch tracks for one genre to avoid rate limiting
        const tracks = await fetchTracksByGenre(randomGenre, token);
        if (!tracks || tracks.length < count) {
            throw new Error("Not enough tracks found");
        }

        // Select random tracks from the results
        const selectedTracks: Music[] = [];
        const usedIndexes = new Set<number>();

        while (selectedTracks.length < count && usedIndexes.size < tracks.length) {
            const randomIndex = Math.floor(Math.random() * tracks.length);

            if (!usedIndexes.has(randomIndex)) {
                usedIndexes.add(randomIndex);
                const track = tracks[randomIndex];
                const artists = track.artists.map((artist: any) => artist.name).join(", ");

                selectedTracks.push({
                    name: track.name,
                    artist: artists,
                    photo: track.album.images[0]?.url || "https://via.placeholder.com/300",
                    album: track.album.name,
                    url: track.external_urls.spotify,
                    popularity: track.popularity,
                    preview_url: track.preview_url,
                });
            }
        }

        return selectedTracks;
    } catch (error) {
        console.error("Error getting random music list:", error);

        // Return fallback list
        return Array(count).fill({
            name: "Unknown Track",
            artist: "Unknown Artist",
            photo: "https://via.placeholder.com/300",
            album: "Unknown Album",
        });
    }
}
