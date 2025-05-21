import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load current user
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log('Loaded user from localStorage:', storedUser);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
    }
    // Ensure at least one admin account exists
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      if (!accounts.length) {
        const defaultAdmin = { id: Date.now(), email: 'admin@example.com', password: 'admin', role: 'ADMIN', state: 'activé', createdAt: new Date().toISOString() };
        localStorage.setItem('accounts', JSON.stringify([defaultAdmin]));
      }
    } catch (err) {
      console.error('Error initializing default admin:', err);
    }
  }, []);

  const login = (arg1, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
          console.log('Accounts:', accounts);
          let account;

          // Support login(account) or login(email, password)
          if (typeof arg1 === 'object' && arg1.email && arg1.password) {
            account = arg1; // From RegisterForm
          } else {
            account = accounts.find(
              (acc) => acc.email === arg1 && acc.password === password
            );
          }

          if (!account) {
            console.log('Login failed: No matching account');
            reject(new Error('Email ou mot de passe incorrect.'));
          } else if (account.state !== 'activé') {
            console.log('Login failed: Account is disabled');
            reject(new Error('Ce compte est désactivé.'));
          } else {
            // Force ADMIN role for all logged users
            const adminAccount = { ...account, role: 'ADMIN' };
            setUser(adminAccount);
            localStorage.setItem('user', JSON.stringify(adminAccount));
            console.log('Login successful:', adminAccount);
            resolve(true);
          }
        } catch (err) {
          console.error('Login error:', err);
          reject(new Error('Erreur lors de la connexion. Veuillez réessayer.'));
        }
      }, 1000);
    });
  };

  const register = (email, password, role = 'USER') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
          if (accounts.find((acc) => acc.email === email)) {
            console.log('Register failed: Email already exists');
            reject(new Error('Cet email est déjà utilisé.'));
          } else {
            const newUser = {
              id: Date.now(),
              email,
              password,
              role,
              state: 'activé',
              createdAt: new Date().toISOString(),
            };
            accounts.push(newUser);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            // Force ADMIN role on register
            const adminNewUser = { ...newUser, role: 'ADMIN' };
            setUser(adminNewUser);
            localStorage.setItem('user', JSON.stringify(adminNewUser));
            console.log('Register successful:', adminNewUser);
            resolve(true);
          }
        } catch (err) {
          console.error('Register error:', err);
          reject(new Error('Erreur lors de l’inscription. Veuillez réessayer.'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    console.log('Logout called');
    setUser(null);
    localStorage.removeItem('user');
  };

  const updatePassword = (newPassword) => {
    if (!user) return false;
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const updatedAccounts = accounts.map((acc) =>
        acc.id === user.id ? { ...acc, password: newPassword } : acc
      );
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Password updated:', updatedUser);
      return true;
    } catch (err) {
      console.error('Update password error:', err);
      return false;
    }
  };

  const deleteAccount = (accountId) => {
    if (!user || (user.role !== 'ADMIN' && user.id !== accountId)) {
      console.log('Delete account failed: Unauthorized');
      return false;
    }
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      if (user.id === accountId) {
        logout();
      }
      console.log('Account deleted:', accountId);
      return true;
    } catch (err) {
      console.error('Delete account error:', err);
      return false;
    }
  };

  const getAccounts = () => {
    if (user?.role !== 'ADMIN') {
      console.log('Get accounts failed: Unauthorized');
      return [];
    }
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      console.log('Fetched accounts:', accounts);
      return accounts;
    } catch (err) {
      console.error('Get accounts error:', err);
      return [];
    }
  };

  const updateAccountRole = (accountId, newRole) => {
    if (user?.role !== 'ADMIN') {
      console.log('Update account role failed: Unauthorized');
      return false;
    }
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const updatedAccounts = accounts.map((acc) =>
        acc.id === accountId ? { ...acc, role: newRole } : acc
      );
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      if (user.id === accountId) {
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      console.log('Account role updated:', { accountId, newRole });
      return true;
    } catch (err) {
      console.error('Update account role error:', err);
      return false;
    }
  };

  const toggleAccountState = (accountId) => {
    if (user?.role !== 'ADMIN') {
      console.log('Toggle account state failed: Unauthorized');
      return false;
    }
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const updatedAccounts = accounts.map((acc) =>
        acc.id === accountId ? { ...acc, state: acc.state === 'activé' ? 'désactivé' : 'activé' } : acc
      );
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      if (user.id === accountId && updatedAccounts.find((acc) => acc.id === accountId).state === 'désactivé') {
        logout();
      }
      console.log('Account state toggled:', accountId);
      return true;
    } catch (err) {
      console.error('Toggle account state error:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updatePassword, deleteAccount, getAccounts, updateAccountRole, toggleAccountState }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}