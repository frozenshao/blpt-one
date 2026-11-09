import { User } from '../types/user';

const USERS_STORAGE_KEY = 'pathology_users_db_v1';
const CURRENT_USER_KEY = 'pathology_current_user_v1';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    creator: '系统内置',
    createdAt: '2026-01-01 09:00:00',
    password: 'admin123456'
  },
  {
    id: 'user-wang',
    username: 'doctor_wang',
    name: '王海川 主任医师',
    role: 'user',
    creator: 'admin',
    createdAt: '2026-02-15 14:20:00',
    password: '123456'
  },
  {
    id: 'user-li',
    username: 'researcher_li',
    name: '李研 毒理病理研究员',
    role: 'user',
    creator: 'admin',
    createdAt: '2026-03-01 10:30:00',
    password: '123456'
  }
];

export const getUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsers = (users: User[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to admin for seamless first load if needed, or null if logged out
      return INITIAL_USERS[0];
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS[0];
  }
};

export const setCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user:', err);
  }
};

export const addUser = (newUser: Omit<User, 'id' | 'createdAt'>): { success: boolean; message?: string } => {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
    return { success: false, message: `用户名 “${newUser.username}” 已存在，请更换` };
  }
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const createdUser: User = {
    ...newUser,
    id: `user-${Date.now()}`,
    createdAt: dateStr
  };
  const updated = [createdUser, ...users];
  saveUsers(updated);
  return { success: true };
};

export const updateUser = (updatedUser: User): { success: boolean; message?: string } => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index === -1) {
    return { success: false, message: '用户不存在' };
  }
  // Check username collision with others
  if (users.some((u, idx) => idx !== index && u.username.toLowerCase() === updatedUser.username.toLowerCase())) {
    return { success: false, message: `用户名 “${updatedUser.username}” 已被占用` };
  }
  users[index] = { ...users[index], ...updatedUser };
  saveUsers(users);

  // If currently logged-in user is updated, sync session
  const current = getCurrentUser();
  if (current && current.id === updatedUser.id) {
    setCurrentUser(users[index]);
  }
  return { success: true };
};

export const deleteUser = (userId: string): { success: boolean; message?: string } => {
  const users = getUsers();
  const target = users.find(u => u.id === userId);
  if (!target) {
    return { success: false, message: '用户不存在' };
  }
  if (target.username === 'admin') {
    return { success: false, message: '系统内置管理员账户 admin 不可删除' };
  }
  const updated = users.filter(u => u.id !== userId);
  saveUsers(updated);
  return { success: true };
};

export const changeUserPassword = (
  userId: string, 
  oldPassword: string, 
  newPassword: string
): { success: boolean; message?: string } => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    return { success: false, message: '未找到指定用户' };
  }
  if (user.password && user.password !== oldPassword) {
    return { success: false, message: '原密码输入不正确' };
  }
  user.password = newPassword;
  saveUsers(users);

  // Sync session
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(user);
  }
  return { success: true };
};
