import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@chakra-ui/modal';
import {
  Button,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import { addProduct, getCategories, getSubcategories } from '../api/products';

export const AddProductModal = ({ isOpen, onClose, onAddSuccess }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const toast = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPrice('');
      setCategory('');
      setSubcategory('');
      setSubcategories([]);
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data?.rows ?? []);
    } catch {
      toast({ status: 'error', description: 'Failed to load categories' });
    }
  };

  const handleCategoryChange = async (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setSubcategory('');
    try {
      console.log(selected)
      const res = await getSubcategories(selected);
      setSubcategories(res?.data?.rows ?? []);
    } catch {
      toast({ status: 'error', description: 'Failed to load subcategories' });
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !category || !subcategory) {
      toast({ status: 'warning', description: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      const newProduct = await addProduct({
        name: name,
        price: Number(price),
        category_id: category,
        subcategory_id: subcategory
      });
      toast({ status: 'success', description: 'Product added successfully' });
      onAddSuccess?.(newProduct);
      onClose();
    } catch {
      toast({ status: 'error', description: 'Failed to add product' });
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Product</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Name"
            mb={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Price"
            mb={3}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Select
            placeholder="Select category"
            mb={3}
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <Select
            placeholder="Select subcategory"
            mb={3}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            isDisabled={!subcategories.length}
          >
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleAdd} isLoading={loading}>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
