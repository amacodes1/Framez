import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export const AuthService = {
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async saveUser(user: any): Promise<void> {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async removeUser(): Promise<void> {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const usersData = await SecureStore.getItemAsync('registered_users');
    const users = usersData ? JSON.parse(usersData) : [];
    return users.some((u: any) => u.email === email);
  },

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const usersData = await SecureStore.getItemAsync('registered_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = 'token_' + Date.now();
    await this.saveToken(token);
    await this.saveUser(user);
    
    return { user, token };
  },

  async register(name: string, email: string, password: string): Promise<{ user: any; token: string }> {
    const usersData = await SecureStore.getItemAsync('registered_users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const clerkId = Math.random().toString(36).substr(2, 9);
    const newUser = {
      id: clerkId,
      email,
      name,
      password,
      avatar: null,
      clerkId,
    };
    
    users.push(newUser);
    await SecureStore.setItemAsync('registered_users', JSON.stringify(users));
    
    const token = 'token_' + Date.now();
    return { user: newUser, token };
  },

  async logout(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
  },
};