import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import { AuthService } from '../services/auth';
import { ConvexClientProvider } from './ConvexClientProvider';
import { UserSync } from './UserSync';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await AuthService.getUser();
        const token = await AuthService.getToken();
        
        if (user && token) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        dispatch(clearUser());
      }
    };

    checkAuthState();
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ConvexClientProvider>
      <Provider store={store}>
        <AuthProvider>
          <UserSync />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthProvider>
      </Provider>
    </ConvexClientProvider>
  );
}