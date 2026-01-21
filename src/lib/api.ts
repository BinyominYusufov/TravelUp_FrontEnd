const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://student2.softclub.tj';

// Types based on OpenAPI schema
export interface User {
  id: number;
  username: string;
  theme: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Destination {
  id: string;
  title: string;
  description: string | null;
  country: string;
  city: string;
  cover_image: string | null;
  rating: number;
  created_at: string;
}

export interface DestinationCreate {
  title: string;
  description?: string | null;
  country: string;
  city: string;
  cover_image?: string | null;
  rating?: number;
}

export interface Booking {
  id: string;
  user_id: number;
  destination_id: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface BookingCreate {
  destination_id: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  total_price: number;
}

export interface Review {
  id: string;
  user_id: number;
  destination_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewCreate {
  destination_id: string;
  rating: number;
  comment?: string | null;
}

export interface Payment {
  id: string;
  booking_id: number;
  amount: number;
  currency: string;
  provider: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface PaymentCreate {
  booking_id: number;
  amount: number;
  currency?: string;
  provider: string;
}

export interface Role {
  name: string;
  permissions: { name: string; description: string }[];
}

// Auth helpers
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

// API fetch wrapper
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    
    // Handle 403 Forbidden specifically
    if (response.status === 403) {
      throw new Error(error.detail || error.message || 'Forbidden: You do not have permission to perform this action.');
    }
    
    // Handle validation errors (FastAPI format)
    if (Array.isArray(error.detail)) {
      const validationMessages = error.detail
        .map((err: { msg?: string; [key: string]: unknown }) => err.msg || JSON.stringify(err))
        .join(', ');
      throw new Error(validationMessages || `Validation error: ${response.status}`);
    }
    
    // Handle single error message
    throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (data: { username: string; password: string; confirm_password: string }) =>
    apiFetch<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { username: string; password: string }) =>
    apiFetch<TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  logout: (token: string) =>
    apiFetch<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ token }) }),
  
  refresh: (refreshToken: string) =>
    apiFetch<TokenResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
  
  me: () => apiFetch<User>('/auth/me'),
  
  getProfile: () => apiFetch<User>('/auth/profile'),
  
  updateProfile: (data: { theme?: 'light' | 'dark' | 'default' }) =>
    apiFetch<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  
  getRoles: () => apiFetch<Role[]>('/auth/roles'),
};

// Destinations API
export const destinationsApi = {
  list: () => apiFetch<Destination[]>('/destinations/destinations'),
  
  get: (id: string) => apiFetch<Destination>(`/destinations/destinations/${id}`),
  
  create: (data: DestinationCreate) =>
    apiFetch<Destination>('/destinations/destinations', { method: 'POST', body: JSON.stringify(data) }),
  
  update: (id: string, data: Partial<DestinationCreate>) =>
    apiFetch<Destination>(`/destinations/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiFetch<void>(`/destinations/destinations/${id}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  list: () => apiFetch<Booking[]>('/bookings/bookings'),
  
  getMyBookings: () => apiFetch<Booking[]>('/bookings/bookings/my'),
  
  create: (data: BookingCreate) =>
    apiFetch<Booking>('/bookings/bookings', { method: 'POST', body: JSON.stringify(data) }),
  
  cancel: (id: string) =>
    apiFetch<Booking>(`/bookings/bookings/${id}/cancel`, { method: 'PATCH' }),
  
  updateStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') =>
    apiFetch<Booking>(`/bookings/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// Reviews API
export const reviewsApi = {
  getForDestination: (destinationId: string) =>
    apiFetch<Review[]>(`/reviews/destinations/${destinationId}/reviews`),
  
  create: (data: ReviewCreate) =>
    apiFetch<Review>('/reviews/reviews', { method: 'POST', body: JSON.stringify(data) }),
  
  update: (id: string, data: { rating: number; comment?: string | null }) =>
    apiFetch<Review>(`/reviews/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  delete: (id: string) =>
    apiFetch<void>(`/reviews/reviews/${id}`, { method: 'DELETE' }),
};

// Payments API
export const paymentsApi = {
  list: () => apiFetch<Payment[]>('/payments/payments'),
  
  getMyPayments: () => apiFetch<Payment[]>('/payments/payments/my'),
  
  create: (data: PaymentCreate) =>
    apiFetch<Payment>('/payments/payments', { method: 'POST', body: JSON.stringify(data) }),
};

export { API_BASE_URL };
