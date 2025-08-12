import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FF8E53']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>��</Text>
          <Text style={styles.appName}>HeartMatch</Text>
          <Text style={styles.tagline}>Trova la tua anima gemella</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>��</Text>
            <Text style={styles.featureText}>Scopri persone nelle vicinanze</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>��</Text>
            <Text style={styles.featureText}>Chatta solo con i tuoi match</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>��</Text>
            <Text style={styles.featureText}>Sicuro e riservato</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Inizia</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 100,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  featureIcon: {
    fontSize: 30,
    marginRight: 20,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  buttonContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'white',
    textDecorationLine: 'underline',
  },
}); 