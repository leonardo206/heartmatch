import { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';
import { currentConfig } from '../config/config';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?._id) {
      const newSocket = io(currentConfig.socketUrl, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', userData._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userData?._id]);

  return { socket };
}; 