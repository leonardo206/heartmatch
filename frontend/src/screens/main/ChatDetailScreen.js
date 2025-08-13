import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getMessages, sendMessage, markMessagesAsRead } from '../../services/messageService';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

export default function ChatDetailScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId, user } = route.params;
  const { socket } = useSocket();
  const { userData } = useAuth();
  const flatListRef = useRef();

  // Debug per verificare i dati dell'utente
  console.log('🔍 ChatDetailScreen - User data:', {
    userData: userData,
    userDataId: userData?._id,
    routeParams: route.params,
    routeCurrentUserId: route.params.currentUserId
  });

  useEffect(() => {
    loadMessages();
    markMessagesAsRead(matchId);
    
    // Listen for new messages
    if (socket) {
      socket.on('newMessage', handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [matchId, socket]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const messagesData = await getMessages(matchId);
      setMessages(messagesData);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile caricare i messaggi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (data) => {
    if (data.matchId === matchId) {
      setMessages(prev => [...prev, data.message]);
      markMessagesAsRead(matchId);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const message = await sendMessage(matchId, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Errore', 'Impossibile inviare il messaggio');
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    // Funzione robusta per identificare i messaggi dell'utente corrente
    const getCurrentUserId = () => {
      // Prima prova dai parametri della route
      if (route.params.currentUserId) {
        return route.params.currentUserId;
      }
      // Poi prova da userData
      if (userData?._id) {
        return userData._id;
      }
      // Infine prova dal token JWT (se disponibile)
      return null;
    };

    const currentUserId = getCurrentUserId();
    const isMyMessage = currentUserId && item.sender._id.toString() === currentUserId.toString();
    
    // Debug per capire il problema di allineamento
    console.log('🔍 Message alignment debug:', {
      messageId: item._id,
      senderId: item.sender._id.toString(),
      senderName: item.sender.name,
      currentUserId: currentUserId?.toString(),
      isMyMessage: isMyMessage,
      messageContent: item.content.substring(0, 20) + '...',
      userDataAvailable: !!userData,
      routeParamsAvailable: !!route.params.currentUserId
    });
    
    const showDate = index === 0 || 
      new Date(item.createdAt).toDateString() !== 
      new Date(messages[index - 1]?.createdAt).toDateString();

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString('it-IT')}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {new Date(item.createdAt).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>Caricamento messaggi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#FF8E53']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{user.name}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || isSending) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerStatus: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  moreButton: {
    padding: 5,
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 18,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B9D',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 5,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#999',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#FF6B9D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
}); 