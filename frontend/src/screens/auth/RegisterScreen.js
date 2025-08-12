import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../../contexts/AuthContext';
import { registerUser } from '../../services/authService';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: '',
    interestedIn: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    console.log('handleRegister called');
    console.log('Form data:', formData);
    
    // Validation
    if (!formData.email || !formData.password || !formData.firstName || 
        !formData.lastName || !formData.gender || !formData.interestedIn) {
      console.log('Validation failed - missing fields');
      Alert.alert('Errore', 'Compila tutti i campi obbligatori');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Errore', 'Le password non coincidono');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
      return;
    }

    setIsLoading(true);
    try {
      // Calcola l'età dalla data di nascita
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      // Prepara i dati nel formato che il backend si aspetta
      const userData = {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        age: actualAge,
        gender: formData.gender,
        interestedIn: [formData.interestedIn],
        bio: '',
        photos: ['https://via.placeholder.com/300x400'],
        location: {
          coordinates: [0, 0]
        }
      };

      console.log('Sending registration data:', userData);
      const response = await registerUser(userData);
      await signIn(response.token, response.user);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Errore', error.message || 'Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData('dateOfBirth', selectedDate);
    }
  };

  return (
    <LinearGradient
      colors={['#FF6B9D', '#FF8E53']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Registrati</Text>
            <Text style={styles.subtitle}>Crea il tuo profilo HeartMatch</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  placeholderTextColor="#666"
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData('firstName', text)}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Cognome"
                  placeholderTextColor="#666"
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData('lastName', text)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Conferma Password"
                placeholderTextColor="#666"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.dateOfBirth.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Genere:</Text>
                <View style={styles.pickerOptions}>
                  {['male', 'female', 'other'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.pickerOption,
                        formData.gender === option && styles.pickerOptionSelected
                      ]}
                      onPress={() => updateFormData('gender', option)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.gender === option && styles.pickerOptionTextSelected
                      ]}>
                        {option === 'male' ? 'Maschio' : option === 'female' ? 'Femmina' : 'Altro'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="heart-outline" size={20} color="#666" style={styles.inputIcon} />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Interessato a:</Text>
                <View style={styles.pickerOptions}>
                  {['male', 'female', 'other'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.pickerOption,
                        formData.interestedIn === option && styles.pickerOptionSelected
                      ]}
                      onPress={() => updateFormData('interestedIn', option)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.interestedIn === option && styles.pickerOptionTextSelected
                      ]}>
                        {option === 'male' ? 'Maschi' : option === 'female' ? 'Femmine' : 'Altri'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Registrazione in corso...' : 'Registrati'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Hai già un account? <Text style={styles.loginTextBold}>Accedi</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
  },
  inputIcon: {
    marginRight: 10,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pickerOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  pickerOptionSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginTextBold: {
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
}); 