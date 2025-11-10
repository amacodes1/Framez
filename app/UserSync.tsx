import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCreateUser } from '../services/convex';

export function UserSync() {
  const { user } = useSelector((state: RootState) => state.auth);
  const createUser = useCreateUser();

  useEffect(() => {
    const syncUser = async () => {
      if (user?.clerkId) {
        try {
          await createUser({
            email: user.email,
            name: user.name,
            clerkId: user.clerkId,
            ...(user.avatar && { avatar: user.avatar }),
          });
        } catch (error) {
          console.log('User sync:', error);
        }
      }
    };

    syncUser();
  }, [user, createUser]);

  return null;
}

export default UserSync;