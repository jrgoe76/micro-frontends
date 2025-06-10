// Types for our micro-frontend host application

export type AppId = 'app1' | 'app2';

export interface MicroFrontendApp {
  id: AppId;
  name: string;
  description: string;
  isActive: boolean;
}

export interface NavigationItem {
  id: AppId;
  label: string;
  path: string;
}

// Types for dynamic module loading
export interface DynamicModule {
  default: React.ComponentType;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  component: React.ComponentType | null;
}

export interface CachedComponent {
  component: React.ComponentType;
  isLoaded: boolean;
  error: string | null;
}

export interface ComponentCache {
  [key: string]: CachedComponent;
}

export type MicroFrontendLoader = () => Promise<DynamicModule>;
