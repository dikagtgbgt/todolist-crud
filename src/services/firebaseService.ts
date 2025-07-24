import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import { db, auth, initializeFirebaseAuth } from '../config/firebase';
import { Task, Product } from '../types';

const TASKS_COLLECTION = 'tasks';
const PRODUCTS_COLLECTION = 'products';

export const firebaseService = {
  async initializeAuth() {
    try {
      await initializeFirebaseAuth();
      console.log('Firebase auth initialized for service');
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  async checkAuth() {
    if (!auth.currentUser) {
      console.warn('User not authenticated, trying to initialize...');
      await this.initializeAuth();
      if (!auth.currentUser) {
        console.warn('Still not authenticated, continuing without auth for development');
        return;
      }
    }
    console.log('User authenticated:', auth.currentUser.uid);
  },

  // Task operations
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating task with data:', task);
      await this.checkAuth();
      const taskData = {
        ...task,
        userId: auth.currentUser?.uid || 'anonymous',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Task data to be saved:', taskData);
      try {
        const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
        console.log('Task created successfully with ID:', docRef.id);
        return docRef.id;
      } catch (firebaseError: any) {
        console.error('Firebase error creating task:', firebaseError);
        if (firebaseError.code === 'permission-denied') {
          console.warn('Permission denied, trying without auth...');
          const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
            ...taskData,
            userId: 'anonymous'
          });
          return docRef.id;
        }
        throw firebaseError;
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error(`Gagal membuat tugas: ${error.message}`);
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      console.log('Fetching tasks...');
      await this.checkAuth();
      const userId = auth.currentUser?.uid || 'anonymous';
      console.log('User authenticated:', userId);
      
      const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const tasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          date: data.date,
          completed: data.completed || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      
      console.log('Retrieved tasks successfully:', tasks.length);
      return tasks;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new Error(`Gagal mengambil tugas: ${error.message}`);
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      console.log('Updating task:', taskId, 'with updates:', updates);
      await this.checkAuth();
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date(),
      });
      console.log('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw new Error(`Gagal memperbarui tugas: ${error.message}`);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log('Deleting task:', taskId);
      await this.checkAuth();
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      await deleteDoc(taskRef);
      console.log('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error(`Gagal menghapus tugas: ${error.message}`);
    }
  },

  // Product operations
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating product with data:', product);
      await this.checkAuth();
      const productData = {
        ...product,
        userId: auth.currentUser?.uid || 'anonymous',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Product data to be saved:', productData);
      try {
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
        console.log('Product created successfully with ID:', docRef.id);
        return docRef.id;
      } catch (firebaseError: any) {
        console.error('Firebase error creating product:', firebaseError);
        if (firebaseError.code === 'permission-denied') {
          console.warn('Permission denied, trying without auth...');
          const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
            ...productData,
            userId: 'anonymous'
          });
          return docRef.id;
        }
        throw firebaseError;
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(`Gagal membuat produk: ${error.message}`);
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      console.log('Fetching products...');
      await this.checkAuth();
      const userId = auth.currentUser?.uid || 'anonymous';
      console.log('User authenticated:', userId);
      
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      
      console.log('Retrieved products successfully:', products.length);
      return products;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw new Error(`Gagal mengambil produk: ${error.message}`);
    }
  },

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      console.log('Updating product:', productId, 'with updates:', updates);
      await this.checkAuth();
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date(),
      });
      console.log('Product updated successfully');
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw new Error(`Gagal memperbarui produk: ${error.message}`);
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      console.log('Deleting product:', productId);
      await this.checkAuth();
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);
      console.log('Product deleted successfully');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw new Error(`Gagal menghapus produk: ${error.message}`);
    }
  },
}; 