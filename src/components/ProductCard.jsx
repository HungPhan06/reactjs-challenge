import {
  Box,
  Text,
  Flex,
  Badge,
  Tooltip,
  IconButton,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

export const ProductCard = ({ user, product, onLike }) => {
  const gradientBg = useColorModeValue('linear(to-br, #fdfbfb,rgba(180, 213, 229, 0.6))');

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      bgGradient={gradientBg}
      transition="all 0.2s ease-in-out"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
      mb="4"
    >
      <Box p="4">
        <Flex justify="space-between" align="center" mb="2">
          <Text fontSize="xl" fontWeight="bold" noOfLines={2}>
            {product.name}
          </Text>
          <Badge colorScheme="green" fontSize="0.9em">
            ${product.price}
          </Badge>
        </Flex>

        <Flex gap={2} mb={3} flexWrap="wrap">
          {product.category && (
            <Badge colorScheme="purple" variant="subtle" fontSize="0.8em">
              {product.category}
            </Badge>
          )}
          {product.subcategory && (
            <Badge colorScheme="teal" variant="subtle" fontSize="0.8em">
              {product.subcategory}
            </Badge>
          )}
        </Flex>

        <Flex justify="space-between" align="center" mt="4">
          <Tooltip label={user && product.liked_by_me ? 'Unlike' : 'Like'} fontSize="sm">
            <Flex align="center" gap="1" cursor="pointer">
              <IconButton
                icon={<FaHeart />}
                aria-label={user && product.liked_by_me ? 'Unlike product' : 'Like product'}
                onClick={() => onLike(product)}
                color={user && product.liked_by_me ? 'red.400' : 'gray.400'}
                fontSize="1.5rem"
                variant="ghost"
                _hover={{ color: user && product.liked_by_me ? 'red.600' : 'gray.600' }}
              />
              <Text fontWeight="bold" userSelect="none">{product.favorite_count}</Text>
            </Flex>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductCard;
