export type Role = 'owner' | 'main_manager' | 'manager' | 'staff';
export type BranchId = 'va-waterfront' | 'mall-south' | 'waterfall' | 'central-kitchen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  branchId: BranchId | 'all';
  avatar?: string;
}

export interface Branch {
  id: BranchId;
  name: string;
  location: string;
  managerIds: string[];
  mainManagerIds: string[];
}

export interface Message {
  id: string;
  branchId: BranchId | 'cross-branch';
  groupId: 'owners' | 'main-managers' | 'managers' | 'staff';
  senderId: string;
  senderName: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  flagged: boolean;
  flaggedReason?: string;
}

export interface Shift {
  id: string;
  branchId: BranchId;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'closing';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  branchId: BranchId;
  type: 'annual' | 'sick' | 'family' | 'unpaid';
  startDate: string;
  endDate: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface MenuItem {
  category: string;
  items: { name: string; description: string; price: string; dietary?: string }[];
}

export interface Award {
  id: string;
  branchId: BranchId | 'company';
  title: string;
  recipient?: string;
  date: string;
  description: string;
}

export interface Birthday {
  id: string;
  name: string;
  branchId: BranchId;
  date: string; // MM-DD
}

export interface HygieneRule {
  category: string;
  rules: { title: string; description: string }[];
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  branches: Branch[];
  messages: Message[];
  shifts: Shift[];
  leaveRequests: LeaveRequest[];
  menu: MenuItem[];
  awards: Award[];
  birthdays: Birthday[];
  hygiene: HygieneRule[];
  auditLog: { action: string; details: string; timestamp: string; userId: string }[];
}