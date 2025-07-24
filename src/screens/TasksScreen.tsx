import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { firebaseService } from '../services/firebaseService';
import { Task } from '../types';
import { checkNetworkConnection } from '../utils/networkUtils';

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<TasksScreenNavigationProp>();

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // Check network connection first
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        Alert.alert('Tidak Ada Koneksi', 'Pastikan Anda terhubung ke internet untuk memuat data tugas.');
        setTasks([]);
        return;
      }

      const tasksData = await firebaseService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat daftar tugas. Pastikan koneksi internet stabil.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Load tasks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      'Pilih aksi yang ingin dilakukan',
      [
        {
          text: 'Lihat Detail',
          onPress: () => navigation.navigate('TaskDetail', { task }),
        },
        {
          text: 'Edit',
          onPress: () => navigation.navigate('EditTask', { task }),
        },
        {
          text: 'Tandai Selesai',
          onPress: () => handleMarkAsCompleted(task),
        },
        {
          text: 'Hapus',
          onPress: () => handleDeleteTask(task),
          style: 'destructive',
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const handleMarkAsCompleted = async (task: Task) => {
    try {
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        Alert.alert('Tidak Ada Koneksi', 'Pastikan Anda terhubung ke internet untuk menandai tugas sebagai selesai.');
        return;
      }

      const updatedDescription = task.description + ' [SELESAI]';
      await firebaseService.updateTask(task.id, {
        description: updatedDescription
      });
      
      await loadTasks();
      Alert.alert('Sukses', 'Tugas berhasil ditandai sebagai selesai!');
    } catch (error) {
      Alert.alert('Error', 'Gagal menandai tugas sebagai selesai. Pastikan koneksi internet stabil.');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus tugas "${task.title}"?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              // Check network connection first
              const isConnected = await checkNetworkConnection();
              if (!isConnected) {
                Alert.alert('Tidak Ada Koneksi', 'Pastikan Anda terhubung ke internet untuk menghapus tugas.');
                return;
              }

              await firebaseService.deleteTask(task.id);
              await loadTasks();
              Alert.alert('Sukses', 'Tugas berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus tugas. Pastikan koneksi internet stabil.');
            }
          },
        },
      ]
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const isCompleted = item.description?.toLowerCase().includes('selesai') || 
                       item.title?.toLowerCase().includes('selesai') ||
                       item.description?.toLowerCase().includes('done') ||
                       item.title?.toLowerCase().includes('done') ||
                       item.description?.toLowerCase().includes('complete') ||
                       item.title?.toLowerCase().includes('complete');

    return (
      <TouchableOpacity
        style={[styles.taskItem, isCompleted && styles.completedTaskItem]}
        onPress={() => handleTaskPress(item)}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, isCompleted && styles.completedTaskTitle]}>
            {item.title}
          </Text>
          <Text style={styles.taskDate}>{item.date}</Text>
        </View>
        <Text style={[styles.taskDescription, isCompleted && styles.completedTaskDescription]} numberOfLines={2}>
          {item.description}
        </Text>
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>✅ Selesai</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Belum ada tugas</Text>
      <Text style={styles.emptyDescription}>
        Mulai dengan menambahkan tugas baru
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>Tambah Tugas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Tugas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  completedTaskItem: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  completedTaskDescription: {
    color: '#6c757d',
  },
  completedBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default TasksScreen; 