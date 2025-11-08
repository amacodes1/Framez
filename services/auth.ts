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

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    // Simulate API call - replace with actual authentication
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      avatar: null,
    };
    const mockToken = 'mock_token_' + Date.now();
    
    await this.saveToken(mockToken);
    await this.saveUser(mockUser);
    
    return { user: mockUser, token: mockToken };
  },

  async register(name: string, email: string, password: string): Promise<{ user: any; token: string }> {
    // Simulate API call - replace with actual registration
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: null,
    };
    const mockToken = 'mock_token_' + Date.now();
    
    await this.saveToken(mockToken);
    await this.saveUser(mockUser);
    
    return { user: mockUser, token: mockToken };
  },

  async logout(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
  },
};