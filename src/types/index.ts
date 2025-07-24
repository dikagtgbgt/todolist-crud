export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  uid: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Tasks: undefined;
  AddTask: undefined;
  EditTask: { task: Task };
  TaskDetail: { task: Task };
  Info: undefined;
  Products: undefined;
  AddProduct: undefined;
  EditProduct: { product: Product };
  ProductDetail: { productId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Products: undefined;
  Info: undefined;
}; 