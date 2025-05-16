import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@chakra-ui/modal';
import { Button, Input, useToast } from '@chakra-ui/react';

import { onLogin } from '../api/auth';
import { useAuthStore } from '../store/auth';

export const LoginModal = ({ isOpen, onClose, loginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await onLogin({ username, password });
      if (res.code == 200) {
        login(res.data.user, res.data.token);
        toast({ status: 'success', description: 'Login successful!' });
        onClose();
        loginSuccess();
      } else {
        throw new Error("Something went wrong!")
      }
    } catch (error) {
      toast({ status: 'error', description: 'Login failed. Please check your credentials.' });
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          <Input
            type='text'
            placeholder="Username"
            mb={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">Cancel</Button>
          <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>Login</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
