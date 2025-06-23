import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Audio } from "expo-av";
import { useMusic } from "../api";

interface IAudioContext {
    playTrack: (trackId: string) => void;
    stopTrack: () => void;
    togglePlayback: () => void;
    isPlaying: boolean;
    isLoading: boolean;
    currentTrackId: string | null;

    playbackPosition: number;
    playbackDuration: number;
}

const AudioContext = createContext<IAudioContext | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(30000);
    const musicApi = useMusic();

    const handleStatusUpdate = (status: any) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Error during playback: ${status.error}`);
                stopTrack();
            }
            return;
        }
        setIsPlaying(status.isPlaying);
        setPlaybackPosition(status.positionMillis);

        if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
        }
    };

    const stopTrack = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }

        setSound(null);
        setIsPlaying(false);
        setCurrentTrackId(null);
        setPlaybackPosition(0);
    };

    const playTrack = async (trackId: string) => {
        if (isLoading) return;

        if (sound && currentTrackId === trackId) {
            togglePlayback();
            return;
        }

        if (sound) {
            await stopTrack();
        }

        try {
            setIsLoading(true);
            setCurrentTrackId(trackId);
            const previewUrl = await musicApi.getSongPreview(trackId);
            if (!previewUrl) {
                throw new Error("No preview URL");
            }

            const { sound: newSound, status } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                {
                    shouldPlay: true,
                    progressUpdateIntervalMillis: 250,
                }
            );

            if (status.isLoaded) {
                setPlaybackDuration(status.durationMillis || 30000);
            }

            setSound(newSound);
            newSound.setOnPlaybackStatusUpdate(handleStatusUpdate);
        } catch (error) {
            console.error("Error playing track:", error);
            setCurrentTrackId(null);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayback = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            const status = await sound.getStatusAsync();
            if (status.isLoaded && status.positionMillis >= (status.durationMillis || 0)) {
                await sound.replayAsync();
            } else {
                await sound.playAsync();
            }
        }
        // setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
        return () => {
            sound?.unloadAsync();
        };
    }, [sound]);

    return (
        <AudioContext.Provider
            value={{
                playTrack,
                stopTrack,
                togglePlayback,
                isPlaying,
                isLoading,
                currentTrackId,
                playbackPosition,
                playbackDuration,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};
