import {
  Input,
  Box,
  Button,
  Stack,
  Heading,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  Avatar,
  Text
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, likeProduct } from '../api/products';
import { onLogout } from "../api/auth"
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import LoginModal from '../components/LoginModal';
import AddProductModal from '../components/AddProductModal';
import { ProductCard } from '../components/ProductCard';
import useDebounce from '../hooks/useDebounce';

export default function ProductPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch, page],
    queryFn: () => getProducts(search, page),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const products = data?.data?.rows || [];
  const currentPage = data?.data?.page || 1;
  const totalPages = data?.data?.totalPages || 1;

  const likeMutation = useMutation({
    mutationFn: (product) => likeProduct(product.id),
    onMutate: async (product) => {
      await queryClient.cancelQueries(['products', search, page]);
      const prev = queryClient.getQueryData(['products', search, page]);
      queryClient.setQueryData(['products', search, page], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            rows: old.data.rows.map((p) =>
              p.id === product.id ? { ...p, favorite_count: p.favorite_count + 1 } : p
            ),
          },
        };
      });
      return { prev };
    },
    onError: (_err, _v, ctx) => {
      queryClient.setQueryData(['products', search, page], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['products', search, page]);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: onLogout,
    onSettled: () => {
      logout();
      queryClient.invalidateQueries(['products', search, page]);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleLike = (product) => {
    if (!user) return openLogin();
    likeMutation.mutate(product);
  };

  const handleAddSuccess = () => {
    setPage(1);
    queryClient.invalidateQueries(['products', search, page]);
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const handleLoginSuccess = () => {
    queryClient.invalidateQueries(['products', search, page]);
  }

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <Box maxW="md" mx="auto" py="4" px={{ base: 4, md: 6, lg: 8 }}>
      <Flex align="center" mb={4}>
        <Heading size="lg">Product List</Heading>
        <Spacer />
        {user && (
          <Menu placement="left">
            <MenuButton
              as={IconButton}
              icon={<Avatar size="sm" name={user.name || 'User'} />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>

      <Stack mb="4" direction="row" spacing={2}>
        <Input placeholder="Search..." value={search} onChange={onSearchChange} />
        <Button colorScheme="green" onClick={user ? openAdd : openLogin}>
          + Add
        </Button>
      </Stack>

      {isLoading && <Text mb="4">Loading...</Text>}

      {products.length === 0 && !isLoading && <Text>No products found.</Text>}

      {products.map((p) => (
        <ProductCard
          key={p.id}
          user={user}
          product={{
            ...p,
            likes: p.favorite_count,
            category: p.category?.name,
            subcategory: p.subcategory?.name,
          }}
          onLike={handleLike}
        />
      ))}

      <Flex justify="center" mt="6" align="center" gap={4}>
        <Button onClick={goPrev} disabled={page === 1}>
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button onClick={goNext} disabled={page === totalPages}>
          Next
        </Button>
      </Flex>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} loginSuccess={() => handleLoginSuccess()} />
      <AddProductModal isOpen={isAddOpen} onClose={closeAdd} onAddSuccess={handleAddSuccess} />
    </Box>
  );
}
