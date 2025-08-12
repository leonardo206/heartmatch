import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getPotentialMatches, likeUser, passUser } from '../../services/userService';

const { width, height } = Dimensions.get('window');

export default function SwipeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width, height });
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    loadProfiles();
  }, []);

  // Responsive dimensions
  const cardWidth = Math.min(dimensions.width - 40, 400); // Max width of 400px
  const cardHeight = dimensions.height * 0.75; // 75% of screen height
  const imageHeight = cardHeight * 0.7; // 70% of card height
  const infoHeight = cardHeight * 0.3; // 30% of card height

  const handleImageError = (profileId) => {
    setImageErrors(prev => ({ ...prev, [profileId]: true }));
  };

  const loadProfiles = async () => {
    try {
      console.log('Loading profiles...');
      setIsLoading(true);
      const data = await getPotentialMatches();
      console.log('Profiles loaded:', data);
      console.log('Number of profiles:', data.length);
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= profiles.length) return;
    
    try {
      const profile = profiles[currentIndex];
      await likeUser(profile._id);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handlePass = async () => {
    if (currentIndex >= profiles.length) return;
    
    try {
      const profile = profiles[currentIndex];
      await passUser(profile._id);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error passing user:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <LinearGradient
        colors={['#FF6B9D', '#FF8E53']}
        style={styles.container}
      >
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={100} color="white" />
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new matches!
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FF8E53']}
      style={styles.container}
    >
      <View style={styles.cardWrapper}>
        <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
          {imageErrors[currentProfile._id] ? (
            <View style={[styles.profileImage, { height: imageHeight, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={80} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10, fontSize: 16 }}>Immagine non disponibile</Text>
            </View>
          ) : (
            <Image
              source={{ 
                uri: currentProfile.photos?.[0] || 'https://picsum.photos/300/400?random=' + currentProfile._id 
              }}
              style={[styles.profileImage, { height: imageHeight }]}
              defaultSource={require('../../../assets/icon.png')}
              onError={() => handleImageError(currentProfile._id)}
            />
          )}
          <View style={[styles.profileInfo, { height: infoHeight }]}>
            <Text style={[styles.name, { 
              fontSize: Math.max(18, Math.min(24, dimensions.width * 0.06)),
              marginBottom: Math.min(10, dimensions.height * 0.015)
            }]}>{currentProfile.name}, {currentProfile.age}</Text>
            <Text style={[styles.bio, { 
              fontSize: Math.max(14, Math.min(16, dimensions.width * 0.04)),
              lineHeight: Math.max(18, Math.min(22, dimensions.width * 0.055))
            }]}>{currentProfile.bio}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.passButton, { 
          width: Math.max(60, Math.min(70, dimensions.width * 0.15)),
          height: Math.max(60, Math.min(70, dimensions.width * 0.15)),
          borderRadius: Math.max(30, Math.min(35, dimensions.width * 0.075))
        }]} onPress={handlePass}>
          <Ionicons name="close" size={Math.max(30, Math.min(40, dimensions.width * 0.1))} color="#FF6B9D" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.likeButton, { 
          width: Math.max(60, Math.min(70, dimensions.width * 0.15)),
          height: Math.max(60, Math.min(70, dimensions.width * 0.15)),
          borderRadius: Math.max(30, Math.min(35, dimensions.width * 0.075))
        }]} onPress={handleLike}>
          <Ionicons name="heart" size={Math.max(30, Math.min(40, dimensions.width * 0.1))} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  profileImage: {
    width: '100%',
  },
  profileInfo: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  passButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
});
