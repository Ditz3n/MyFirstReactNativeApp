import React, { useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

const MusicPlayer = () => {
  useEffect(() => {
    let sound: Audio.Sound;

    const loadSound = async () => {
      try {
        sound = new Audio.Sound();
        await sound.loadAsync(require('../assets/music/rickroll.mp3'));
        await sound.setIsLoopingAsync(true);
        await sound.setVolumeAsync(1.0); // Ensure the volume is set to maximum

        if (Platform.OS === 'web') {
          // For web, we need to handle autoplay policies
          const playSound = async () => {
            try {
              await sound.playAsync();
            } catch (error) {
              console.error('Error playing sound on web:', error);
            }
          };

          // Attempt to play the sound
          playSound();

          // Add a click event listener to ensure the sound plays on user interaction
          const handleUserInteraction = () => {
            playSound();
            document.removeEventListener('click', handleUserInteraction);
          };

          document.addEventListener('click', handleUserInteraction);
        } else {
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error loading or playing sound:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return null;
};

export default MusicPlayer;