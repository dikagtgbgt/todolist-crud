import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { firebaseService } from '../services/firebaseService';
import { checkNetworkConnection } from '../utils/networkUtils';
import { Product } from '../types';

type EditProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProduct'>;
type EditProductScreenRouteProp = RouteProp<RootStackParamList, 'EditProduct'>;

const EditProductScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<EditProductScreenNavigationProp>();
  const route = useRoute<EditProductScreenRouteProp>();
  const { product } = route.params;

  useEffect(() => {
    // Convert string dates back to Date objects if needed
    const serializableProduct = {
      ...product,
      createdAt: typeof product.createdAt === 'string' ? new Date(product.createdAt) : product.createdAt,
      updatedAt: typeof product.updatedAt === 'string' ? new Date(product.updatedAt) : product.updatedAt,
    };
    
    setName(serializableProduct.name);
    setDescription(serializableProduct.description);
    setPrice(serializableProduct.price.toString());
    setCategory(serializableProduct.category);
  }, [product]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !price.trim() || !category.trim()) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Error', 'Harga harus berupa angka positif');
      return;
    }

    setIsLoading(true);
    try {
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        Alert.alert('Tidak Ada Koneksi', 'Pastikan Anda terhubung ke internet untuk memperbarui produk.');
        return;
      }

      console.log('Updating product with data:', {
        name: name.trim(),
        description: description.trim(),
        price: priceNumber,
        category: category.trim(),
      });

      await firebaseService.initializeAuth();

      await firebaseService.updateProduct(product.id, {
        name: name.trim(),
        description: description.trim(),
        price: priceNumber,
        category: category.trim(),
      });
      
      console.log('Product updated successfully');
      
      Alert.alert('Sukses', 'Produk berhasil diperbarui', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            setTimeout(() => {
              navigation.navigate('Products');
            }, 100);
          },
        },
      ]);
    } catch (error: unknown) {
      console.error('EditProduct error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui produk. Silakan coba lagi.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Produk</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.label}>Nama Produk</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama produk"
            value={name}
            onChangeText={setName}
            maxLength={100}
          />

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Masukkan deskripsi produk"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <Text style={styles.label}>Harga (IDR)</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan harga produk"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            maxLength={15}
          />

          <Text style={styles.label}>Kategori</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan kategori produk"
            value={category}
            onChangeText={setCategory}
            maxLength={50}
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#34495e',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProductScreen; 