import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type TaskDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation<TaskDetailScreenNavigationProp>();
  const route = useRoute<TaskDetailScreenRouteProp>();
  const { task } = route.params;

  // Function to safely convert Firebase timestamp to Date
  const convertToDate = (dateInput: any): Date | null => {
    try {
      // If it's already a Date object
      if (dateInput instanceof Date) {
        return dateInput;
      }

      // If it's a Firebase timestamp object
      if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
        return dateInput.toDate();
      }

      // If it's a timestamp number
      if (typeof dateInput === 'number') {
        return new Date(dateInput);
      }

      // If it's a string
      if (typeof dateInput === 'string') {
        return new Date(dateInput);
      }

      // If it's null or undefined
      if (!dateInput) {
        return null;
      }

      // Try to create Date from the input
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch (error) {
      console.error('Error converting to date:', error);
      return null;
    }
  };

  // Function to format date to Indonesian format
  const formatDate = (dateInput: any) => {
    try {
      const date = convertToDate(dateInput);
      
      if (!date) {
        return 'Tanggal tidak tersedia';
      }

      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      // Indonesian month names
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const monthName = monthNames[month];
      
      return `${day} ${monthName} ${year} pukul ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  // Function to format task date (DD/MM/YYYY format)
  const formatTaskDate = (dateString: string) => {
    try {
      // If date is already in DD/MM/YYYY format, return as is
      if (dateString && dateString.includes('/')) {
        return dateString;
      }

      // Try to parse and format the date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString || 'Tanggal tidak tersedia'; // Return original if can't parse
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting task date:', error);
      return dateString || 'Tanggal tidak tersedia';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Tugas</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Tanggal:</Text>
            <Text style={styles.infoValue}>{formatTaskDate(task.date)}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Deskripsi:</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Dibuat pada:</Text>
            <Text style={styles.infoValue}>
              {formatDate(task.createdAt)}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Terakhir diperbarui:</Text>
            <Text style={styles.infoValue}>
              {formatDate(task.updatedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditTask', { task })}
          >
            <Text style={styles.editButtonText}>Edit Tugas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 16,
    color: '#667eea',
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
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionButtons: {
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#667eea',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskDetailScreen; 