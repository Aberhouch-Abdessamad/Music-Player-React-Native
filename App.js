import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

const trackList = [
    {
        title: "Cheb Larbi _Avec Le Temps Tibgheni",
        artist: "Cheb Larbi",
        cover: require('./assets/Albume/Track 5.jpg'),
        src: require('./assets/Albume/Cheb Larbi Avec Le Temps Tibgheni.mp3')
    },
    {
        title: "Houdini [Official Music Video]",
        artist: "Eminem",
        cover: require('./assets/FirtOne/track1.jpg'),
        src: require('./assets/FirtOne/Eminem - Houdini [Official Music Video].mp3')
    },
    {
        title: "IGHMAN ⵉⵖⵯⵎⴰⵏ (Intro Music Video)",
        artist: "Meteor Airlines",
        cover: require('./assets/SecondOne/Track 2.jpg'),
        src: require('./assets/SecondOne/Meteor Airlines - IGHMAN ⵉⵖⵯⵎⴰⵏ ( Intro Music Video ) (1).mp3')
    },
    {
        title: "ANZWUM ⴰⵏⵣⵡⵓⵎ (Official Music Video)",
        artist: "Meteor Airlines",
        cover: require('./assets/ThirdOne/Track 3.jpg'),
        src: require('./assets/ThirdOne/Meteor Airlines - ANZWUM ⴰⵏⵣⵡⵓⵎ (Official Music Video).mp3')
    },
    {
        title: "L'morphine - Dokhana (Official Lyric Video)",
        artist: "L'morphine",
        cover: require('./assets/Albume/Track 4.jpg'),
        src: require('./assets/Albume/L\'morphine - Dokhana (Official Lyric Video).mp3')
    },
    {
        title: "Younes (Intro)",
        artist: "Nessyou",
        cover: require('./assets/Albume/mqdefault.jpg'),
        src: require('./assets/Albume/Younes (Intro).mp3')
    },
];

export default function App() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        loadTrack(currentTrackIndex);

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [currentTrackIndex]);

    const loadTrack = async (index) => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(trackList[index].src);
        newSound.setOnPlaybackStatusUpdate(updateStatus);
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
    };

    const updateStatus = (status) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis);
            setPosition(status.positionMillis);
            if (status.didJustFinish) {
                nextTrack();
            }
        }
    };

    const playTrack = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const pauseTrack = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const nextTrack = () => {
        setCurrentTrackIndex((currentTrackIndex + 1) % trackList.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((currentTrackIndex - 1 + trackList.length) % trackList.length);
    };

    const shuffleTrack = () => {
        const randomIndex = Math.floor(Math.random() * trackList.length);
        setCurrentTrackIndex(randomIndex);
    };

    const onSeek = async (value) => {
        if (sound) {
            const status = await sound.setPositionAsync(value);
            setPosition(status.positionMillis);
        }
    };

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => setCurrentTrackIndex(index)}>
            <View style={[styles.playlistItem, currentTrackIndex === index && styles.activeItem]}>
                <Text style={styles.playlistText}>{item.title} - {item.artist}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.trackInfo}>
                <Image style={styles.cover} source={trackList[currentTrackIndex].cover} />
                <Text style={styles.title}>{trackList[currentTrackIndex].title}</Text>
                <Text style={styles.artist}>{trackList[currentTrackIndex].artist}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity onPress={prevTrack}>
                    <Text style={styles.controlText}>⏮</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? pauseTrack : playTrack}>
                    <Text style={styles.controlText}>{isPlaying ? '⏸' : '▶️'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextTrack}>
                    <Text style={styles.controlText}>⏭</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={shuffleTrack}>
                    <Text style={styles.controlText}>🔀</Text>
                </TouchableOpacity>
            </View>
            <Slider
                style={styles.progress}
                value={position}
                maximumValue={duration}
                onSlidingComplete={onSeek}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
            <FlatList
                data={trackList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.playlist}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1f27',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    trackInfo: {
        alignItems: 'center',
    },
    cover: {
        width: 200,
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    artist: {
        fontSize: 18,
        color: '#ccc',
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
    },
    controlText: {
        fontSize: 30,
        color: '#fff',
        marginHorizontal: 20,
    },
    progress: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    timeText: {
        color: '#ccc',
    },
    playlist: {
        marginTop: 20,
        width: '100%',
    },
    playlistItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    activeItem: {
        backgroundColor: '#444',
    },
    playlistText: {
        color: '#ccc',
    },
});
