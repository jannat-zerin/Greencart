import bcrypt from 'bcryptjs';

type MemoryUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  phone: string;
  address: string;
  status?: 'active' | 'blocked';
  resetToken?: string;
  resetTokenExpires?: Date;
  createdAt: Date;
};

const memoryUsers = new Map<string, MemoryUser>();

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function isMemoryAuthEnabled() {
  return !process.env.MONGODB_URI;
}

export async function createMemoryUser(input: {
  email: string;
  password: string;
  name?: string;
  role?: 'user' | 'admin';
}) {
  const email = normalizeEmail(input.email);
  if (memoryUsers.has(email)) return null;

  const hashedPassword = await bcrypt.hash(input.password, 12);
  const user: MemoryUser = {
    id: `${Date.now()}-${memoryUsers.size + 1}`,
    email,
    name: input.name || '',
    password: hashedPassword,
    role: input.role || 'user',
    phone: '',
    address: '',
    status: 'active',
    createdAt: new Date(),
  };

  memoryUsers.set(email, user);
  return user;
}

export async function findMemoryUserByEmail(email: string) {
  return memoryUsers.get(normalizeEmail(email)) ?? null;
}

export async function findMemoryUserById(id: string) {
  return Array.from(memoryUsers.values()).find((user) => user.id === id) ?? null;
}

export function listMemoryUsers() {
  return Array.from(memoryUsers.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function verifyMemoryPassword(user: MemoryUser, password: string) {
  return bcrypt.compare(password, user.password);
}

export async function setMemoryResetToken(email: string, token: string, expiresAt: Date) {
  const user = await findMemoryUserByEmail(email);
  if (!user) return null;
  user.resetToken = token;
  user.resetTokenExpires = expiresAt;
  return user;
}

export async function findMemoryUserByResetToken(token: string) {
  for (const user of memoryUsers.values()) {
    if (user.resetToken && user.resetToken === token && user.resetTokenExpires && user.resetTokenExpires > new Date()) {
      return user;
    }
  }
  return null;
}

export async function clearMemoryResetToken(email: string) {
  const user = await findMemoryUserByEmail(email);
  if (!user) return null;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  return user;
}

export async function updateMemoryPassword(email: string, newPassword: string) {
  const user = await findMemoryUserByEmail(email);
  if (!user) return null;
  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  return user;
}

export function toMemoryUserPayload(user: MemoryUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    address: user.address,
    status: user.status || 'active',
  };
}
