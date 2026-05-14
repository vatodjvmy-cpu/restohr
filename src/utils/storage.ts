import { AppState, User, Message, Shift, LeaveRequest, Branch, BranchId, Role, MenuItem, Award, Birthday, HygieneRule } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const STORAGE_KEY = 'restohr_state_v1';

const initialUsers: User[] = [
  { id: 'u1', name: 'John', email: 'john@lifegrandcafe.com', role: 'owner', branchId: 'all' },
  { id: 'u2', name: 'Jeanel', email: 'jeanel@lifegrandcafe.com', role: 'owner', branchId: 'all' },
  { id: 'u3', name: 'Thandi', email: 'thandi@va.com', role: 'main_manager', branchId: 'va-waterfront' },
  { id: 'u4', name: 'Kyle', email: 'kyle@mos.com', role: 'main_manager', branchId: 'mall-south' },
  { id: 'u5', name: 'Sarah', email: 'sarah@va.com', role: 'manager', branchId: 'va-waterfront' },
  { id: 'u6', name: 'Mike', email: 'mike@mos.com', role: 'manager', branchId: 'mall-south' },
  { id: 'u7', name: 'Lisa', email: 'lisa@wf.com', role: 'staff', branchId: 'waterfall' },
  { id: 'u8', name: 'James', email: 'james@ck.com', role: 'staff', branchId: 'central-kitchen' },
];

const initialBranches: Branch[] = [
  { id: 'va-waterfront', name: 'V&A Waterfront', location: 'Cape Town', managerIds: ['u3', 'u5'], mainManagerIds: ['u3'] },
  { id: 'mall-south', name: 'Mall of the South', location: 'Johannesburg', managerIds: ['u4', 'u6'], mainManagerIds: ['u4'] },
  { id: 'waterfall', name: 'Waterfall', location: 'Midrand', managerIds: ['u3', 'u4'], mainManagerIds: ['u3'] },
  { id: 'central-kitchen', name: 'Central Kitchen', location: 'Gauteng', managerIds: ['u5', 'u6'], mainManagerIds: ['u5'] },
];

const generateMockShifts = (): Shift[] => {
  const shifts: Shift[] = [];
  const today = new Date();
  const days = eachDayOfInterval({ start: startOfWeek(today), end: endOfWeek(today) });
  const staffUsers = initialUsers.filter(u => u.role === 'staff' || u.role === 'manager');
  
  staffUsers.forEach(user => {
    days.forEach(day => {
      const shiftType = Math.random() > 0.6 ? 'breakfast' : Math.random() > 0.5 ? 'lunch' : 'dinner';
      const startTime = shiftType === 'breakfast' ? '06:00' : shiftType === 'lunch' ? '10:00' : '14:00';
      const endTime = shiftType === 'breakfast' ? '14:00' : shiftType === 'lunch' ? '18:00' : '22:00';
      
      shifts.push({
        id: uuidv4(),
        branchId: user.branchId as BranchId,
        userId: user.id,
        userName: user.name,
        date: format(day, 'yyyy-MM-dd'),
        startTime,
        endTime,
        type: shiftType as any,
      });
    });
  });
  return shifts;
};

const initialMessages: Message[] = [
  { id: uuidv4(), branchId: 'va-waterfront', groupId: 'staff', senderId: 'u5', senderName: 'Sarah', content: 'Team briefing at 2pm in the main dining area. Please arrive 15min early.', timestamp: new Date(Date.now() - 3600000).toISOString(), flagged: false },
  { id: uuidv4(), branchId: 'va-waterfront', groupId: 'staff', senderId: 'u7', senderName: 'Lisa', content: 'Noted, thanks! 👍', timestamp: new Date(Date.now() - 3500000).toISOString(), flagged: false },
  { id: uuidv4(), branchId: 'cross-branch', groupId: 'main-managers', senderId: 'u3', senderName: 'Thandi', content: 'All managers: Health inspection next Tuesday. Ensure all certificates are up to date.', timestamp: new Date(Date.now() - 7200000).toISOString(), flagged: false },
  { id: uuidv4(), branchId: 'mall-south', groupId: 'staff', senderId: 'u6', senderName: 'Mike', content: 'URGENT: Spill in section 3 needs immediate cleaning.', timestamp: new Date(Date.now() - 1800000).toISOString(), flagged: true, flaggedReason: 'Alert keyword detected' },
];

const defaultState: AppState = {
  currentUser: null,
  users: initialUsers,
  branches: initialBranches,
  messages: initialMessages,
  shifts: generateMockShifts(),
  leaveRequests: [],
  menu: [
    { category: 'Breakfast', items: [{ name: 'Grand Cafe Special', description: 'Eggs, bacon, sourdough, avocado', price: 'R95', dietary: 'GF option' }, { name: 'French Toast', description: 'Brioche, berry compote, maple syrup', price: 'R85' }] },
    { category: 'Lunch', items: [{ name: 'Cape Malay Curry', description: 'Chicken, rice, sambals', price: 'R120' }, { name: 'Grilled Calamari', description: 'Lemon butter, fries, salad', price: 'R145' }] },
    { category: 'Dinner', items: [{ name: 'Oxtail Potjie', description: 'Slow-cooked, polenta, seasonal veg', price: 'R165' }, { name: 'Hake & Chips', description: 'Beer batter, tartare, peas', price: 'R135' }] },
  ],
  awards: [
    { id: 'a1', branchId: 'company', title: 'Best Restaurant Group 2025', recipient: 'Life Grand Cafe', date: '2025-11-15', description: 'Awarded by SA Hospitality Excellence Awards' },
    { id: 'a2', branchId: 'va-waterfront', title: 'Employee of the Month', recipient: 'Thandi Mokoena', date: '2026-04-30', description: 'Outstanding leadership & guest satisfaction scores' },
    { id: 'a3', branchId: 'mall-south', title: 'Employee of the Month', recipient: 'Kyle Naidoo', date: '2026-04-30', description: 'Perfect attendance & team mentoring' },
  ],
  birthdays: [
    { id: 'b1', name: 'Lisa van der Merwe', branchId: 'waterfall', date: '05-22' },
    { id: 'b2', name: 'James Sibanda', branchId: 'central-kitchen', date: '05-28' },
    { id: 'b3', name: 'Sarah Chen', branchId: 'va-waterfront', date: '06-03' },
  ],
  hygiene: [
    { category: 'Personal Hygiene', rules: [{ title: 'Hand Washing', description: 'Wash hands with soap for 20s before handling food, after restroom, and after touching face/hair.' }, { title: 'Uniform Standards', description: 'Clean apron, closed non-slip shoes, hair nets for kitchen staff. No jewelry except wedding bands.' }] },
    { category: 'Restaurant Etiquette', rules: [{ title: 'Guest Interaction', description: 'Greet within 30 seconds. Use positive language. Never argue with guests. Escalate complaints to manager immediately.' }, { title: 'Service Flow', description: 'Clear tables within 2 minutes of guest departure. Reset to standard layout. Check allergen tags before serving.' }] },
  ],
  auditLog: [],
};

export const storage = {
  get: (): AppState => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultState;
    } catch {
      return defaultState;
    }
  },
  set: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  login: (email: string): User | null => {
    const state = storage.get();
    const user = state.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      state.currentUser = user;
      state.auditLog.push({
        action: 'USER_LOGIN',
        details: `${user.name} (${user.email}) logged in`,
        timestamp: new Date().toISOString(),
        userId: user.id,
      });
      storage.set(state);
      return user;
    }
    return null;
  },
  logout: () => {
    const state = storage.get();
    if (state.currentUser) {
      state.auditLog.push({
        action: 'USER_LOGOUT',
        details: `${state.currentUser.name} logged out`,
        timestamp: new Date().toISOString(),
        userId: state.currentUser.id,
      });
    }
    state.currentUser = null;
    storage.set(state);
  },
  addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'flagged'>) => {
    const state = storage.get();
    const lowerContent = msg.content.toLowerCase();
    const alertKeywords = ['urgent', 'emergency', 'help', 'accident', 'injury', 'spill', 'broken', 'missing'];
    const blockedWords = ['fuck', 'shit', 'damn', 'bastard', 'idiot', 'stupid'];
    
    let flagged = false;
    let flaggedReason = '';
    
    if (alertKeywords.some(kw => lowerContent.includes(kw))) {
      flagged = true;
      flaggedReason = 'Alert keyword detected';
    }
    if (blockedWords.some(w => lowerContent.includes(w))) {
      flagged = true;
      flaggedReason = flaggedReason ? `${flaggedReason} + Swearing` : 'Swearing detected';
    }
    
    const newMsg: Message = {
      ...msg,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      flagged,
      flaggedReason: flagged ? flaggedReason : undefined,
    };
    
    state.messages.push(newMsg);
    state.auditLog.push({
      action: 'MESSAGE_SENT',
      details: `${msg.senderName} posted in ${msg.groupId} (${msg.branchId}): "${msg.content.slice(0, 50)}${msg.content.length > 50 ? '...' : ''}"`,
      timestamp: new Date().toISOString(),
      userId: msg.senderId,
    });
    
    if (flagged) {
      state.auditLog.push({
        action: 'MESSAGE_FLAGGED',
        details: `Message by ${msg.senderName} flagged: ${flaggedReason}`,
        timestamp: new Date().toISOString(),
        userId: msg.senderId,
      });
    }
    
    storage.set(state);
    return newMsg;
  },
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'timestamp'>) => {
    const state = storage.get();
    const newReq: LeaveRequest = { ...req, id: uuidv4(), status: 'pending', timestamp: new Date().toISOString() };
    state.leaveRequests.push(newReq);
    state.auditLog.push({
      action: 'LEAVE_REQUEST',
      details: `${req.userName} requested ${req.type} leave (${req.startDate} to ${req.endDate})`,
      timestamp: new Date().toISOString(),
      userId: req.userId,
    });
    storage.set(state);
    return newReq;
  },
  approveLeave: (id: string) => {
    const state = storage.get();
    const req = state.leaveRequests.find(r => r.id === id);
    if (req) {
      req.status = 'approved';
      state.auditLog.push({
        action: 'LEAVE_APPROVED',
        details: `Leave approved for ${req.userName}`,
        timestamp: new Date().toISOString(),
        userId: req.userId,
      });
      storage.set(state);
    }
  },
  getShiftsForBranch: (branchId: BranchId, weekStart: Date, weekEnd: Date): Shift[] => {
    const state = storage.get();
    return state.shifts.filter(s => {
      const shiftDate = new Date(s.date);
      return s.branchId === branchId && shiftDate >= weekStart && shiftDate <= weekEnd;
    });
  },
  getCurrentUser: (): User | null => storage.get().currentUser,
  getState: (): AppState => storage.get(),
};