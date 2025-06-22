import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Alert, AlertIcon
} from '@chakra-ui/react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirm) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://todo-app-4-ff4h.onrender.com', {
        email: form.email,
        password: form.password
      });
      setMessage('Signup successful! Please login.');
      setForm({ email: '', password: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <Box p={6} rounded="md" shadow="md" bg="white" w="100%" maxW="400px" mx="auto" mb={6}>
      <Heading mb={4} size="lg" textAlign="center">Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
          </FormControl>
          <FormControl id="confirm" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
          </FormControl>
          {error && <Alert status="error"><AlertIcon />{error}</Alert>}
          {message && <Alert status="success"><AlertIcon />{message}</Alert>}
          <Button colorScheme="purple" type="submit" isLoading={loading} w="full">Sign Up</Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Signup;