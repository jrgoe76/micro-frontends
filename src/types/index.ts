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
