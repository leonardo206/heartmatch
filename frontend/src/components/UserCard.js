import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function UserCard({ user }) {
  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getDistance = (userLocation) => {
    // This would be calculated based on user's location
    // For now, return a placeholder
    return '2 km';
  };

  const primaryPhoto = user.profile.photos?.find(photo => photo.isPrimary) || 
                      user.profile.photos?.[0];

  return (
    <View style={styles.container}>
      {/* Photo */}
      <View style={styles.photoContainer}>
        {primaryPhoto ? (
          <Image
            source={{ uri: primaryPhoto.url }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderPhoto}>
            <Ionicons name="person" size={80} color="#ccc" />
          </View>
        )}
        
        {/* Gradient overlay for text readability */}
        <View style={styles.gradientOverlay} />
      </View>

      {/* User info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.name}>
            {user.profile.firstName}, {getAge(user.profile.dateOfBirth)}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{getDistance(user.profile.location)}</Text>
          </View>
        </View>

        {/* Bio */}
        {user.profile.bio && (
          <Text style={styles.bio} numberOfLines={3}>
            {user.profile.bio}
          </Text>
        )}

        {/* Interests */}
        {user.profile.interests && user.profile.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {user.profile.interests.slice(0, 5).map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Additional photos indicator */}
        {user.profile.photos && user.profile.photos.length > 1 && (
          <View style={styles.photosIndicator}>
            <Ionicons name="images-outline" size={20} color="white" />
            <Text style={styles.photosText}>
              +{user.profile.photos.length - 1}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    lineHeight: 22,
  },
  interestsContainer: {
    marginBottom: 10,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  interestText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  photosIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
}); 