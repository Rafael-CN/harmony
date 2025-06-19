import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Audio } from "expo-av";
import { Music } from "../types";
import { useMusic } from "../api";

interface IAudioContext {
    playTrack: (track: Music) => void;
    stopTrack: () => void;
    togglePlayback: () => void;
    isPlaying: boolean;
    isLoading: boolean;
    currentTrackId: string | null;
}

const AudioContext = createContext<IAudioContext | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const musicApi = useMusic();

    const stopTrack = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
            setCurrentTrackId(null);
        }
    };

    const playTrack = async (track: Music) => {
        if (isLoading) return;
        // Se a mesma música já estiver carregada, apenas alterna o play/pause
        if (sound && currentTrackId === track.id) {
            togglePlayback();
            return;
        }

        // Se uma música diferente estiver tocando, pare-a primeiro
        if (sound) {
            await stopTrack();
        }

        try {
            setIsLoading(true);
            setCurrentTrackId(track.id);
            const previewUrl = await musicApi.getTrackPreview(track.id);

            if (!previewUrl) {
                alert("Prévia de áudio não disponível para esta música.");
                throw new Error("No preview URL");
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: previewUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);

            // Listener para quando a música termina de tocar sozinha
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    stopTrack();
                }
            });
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
            setIsPlaying(false);
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    // Efeito de limpeza para descarregar o som ao desmontar o componente
    useEffect(() => {
        return () => {
            sound?.unloadAsync();
        };
    }, [sound]);

    return (
        <AudioContext.Provider
            value={{ playTrack, stopTrack, togglePlayback, isPlaying, isLoading, currentTrackId }}
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
