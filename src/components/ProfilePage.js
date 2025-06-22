import React from 'react';
import { Box, Avatar, Heading, Text, Button, VStack, useColorMode } from '@chakra-ui/react';

function ProfilePage({ userEmail, onClose, onLogout }) {
  const { colorMode } = useColorMode();
  return (
    <Box
      p={6} // Reduced padding
      mt={2} // Reduced top margin
      bg={colorMode === 'light' ? 'white' : 'gray.900'}
      borderRadius="2xl"
      boxShadow="2xl"
      maxW="350px"
      mx="auto"
      color={colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'}
      border="2px solid"
      borderColor={colorMode === 'light' ? 'purple.200' : 'purple.600'}
      position="relative"
      zIndex={10}
    >
      <VStack spacing={6}>
        <Avatar
          name={userEmail}
          size="2xl"
          bg="purple.400"
          color="white"
          border="4px solid"
          borderColor={colorMode === 'light' ? 'purple.300' : 'purple.500'}
          boxShadow="lg"
        />
        <Heading
          size="lg"
          fontFamily="'Poppins', 'Segoe UI', sans-serif"
          color="purple.500"
          letterSpacing="wide"
        >
          User Profile
        </Heading>
        <Text
          fontWeight="bold"
          fontSize="lg"
          color={colorMode === 'light' ? 'purple.700' : 'purple.200'}
          fontFamily="'Fira Mono', 'Menlo', monospace"
        >
          {userEmail}
        </Text>
        <Button
          colorScheme="purple"
          w="full"
          onClick={onClose}
          fontWeight="bold"
          fontSize="md"
          variant="solid"
          boxShadow="md"
        >
          Back to Todos
        </Button>
        <Button
          colorScheme="red"
          variant="outline"
          w="full"
          onClick={onLogout}
          fontWeight="bold"
          fontSize="md"
          _hover={{ bg: colorMode === 'light' ? 'red.50' : 'red.700', color: 'white' }}
          mt={2}
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
}

export default ProfilePage;