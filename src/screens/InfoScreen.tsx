import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type InfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Info'>;

const InfoScreen: React.FC = () => {
  const navigation = useNavigation<InfoScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informasi Aplikasi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informasi Aplikasi</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Aplikasi:</Text>
            <Text style={styles.infoValue}>To-Do List – Manajer Tugas Harian</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versi:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dibuat Oleh:</Text>
            <Text style={styles.infoValue}>I WAYAN DIKA DARMA PUTRA</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>
            Aplikasi ini dirancang untuk membantu pengguna dalam mencatat, mengatur, dan mengelola daftar tugas harian secara lebih terstruktur dan efisien. Dengan antarmuka yang sederhana dan ramah pengguna, aplikasi ini memungkinkan pengguna untuk menambahkan tugas, melihat daftar tugas yang telah dibuat, serta mengedit atau hapus tugas sesuai kebutuhan.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Fitur Utama</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>1</Text>
              <Text style={styles.featureText}>Splash screen pembuka aplikasi</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>2</Text>
              <Text style={styles.featureText}>Halaman login pengguna</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>3</Text>
              <Text style={styles.featureText}>Tambah tugas baru</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>4</Text>
              <Text style={styles.featureText}>Lihat daftar tugas</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>5</Text>
              <Text style={styles.featureText}>Edit dan hapus tugas</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>6</Text>
              <Text style={styles.featureText}>Lihat detail tugas</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureNumber}>7</Text>
              <Text style={styles.featureText}>Halaman informasi aplikasi</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Tentang Pengembangan</Text>
          <Text style={styles.description}>
            Aplikasi ini dikembangkan sebagai bagian dari Uji Kompetensi Junior Mobile Programmer tahun 2025, dengan fokus pada penerapan fitur dasar aplikasi mobile berbasis operasi CRUD (Create, Read, Update, Delete). Pengembangan aplikasi ini juga mencerminkan pemahaman dalam navigasi antar halaman, pengelolaan data lokal, serta penerapan struktur UI/UX yang terorganisir.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Ucapan Terima Kasih</Text>
          <Text style={styles.description}>
            Terima kasih telah menggunakan aplikasi ini. Semoga aplikasi ini dapat membantu Anda dalam meningkatkan produktivitas dan pengelolaan aktivitas harian secara lebih baik.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e6d3', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#e8d5c4', 
    borderBottomWidth: 1,
    borderBottomColor: '#d4c4b3',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8b4513', 
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b4513', 
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#faf0e6', 
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#8b4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e8d5c4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b4513', 
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8d5c4',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0522d', 
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#8b4513', 
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#a0522d',
    lineHeight: 22,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cd853f', 
    marginRight: 12,
    minWidth: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#a0522d', 
    lineHeight: 20,
    flex: 1,
  },
});

export default InfoScreen; 