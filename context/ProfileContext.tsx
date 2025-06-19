import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ProfileData } from "../types";
import { useUser } from "../api/profile";

interface IProfileContext {
    profile: ProfileData | null;
    isLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfileData: (newData: Partial<ProfileData>) => void;
}

export const ProfileContext = createContext<IProfileContext | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const profileApi = useUser();

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await profileApi.getProfile();
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfileData = (newData: Partial<ProfileData>) => {
        if (profile) {
            setProfile({ ...profile, ...newData });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, isLoading, fetchProfile, updateProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};
