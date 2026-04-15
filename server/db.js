// In-memory data store seeded with QUALIX data
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const HASH = (pw) => bcrypt.hashSync(pw, 10);

const db = {
  users: [
    { id: 'u1', name: 'Alice Manager',   email: 'alice@qualix.com',   password: HASH('password'), role: 'Manager',        active: true },
    { id: 'u2', name: 'Bob Tester',      email: 'bob@qualix.com',     password: HASH('password'), role: 'Tester',         active: true },
    { id: 'u3', name: 'Carol Auditor',   email: 'carol@qualix.com',   password: HASH('password'), role: 'Quality Auditor', active: true },
    { id: 'u4', name: 'Dave Tester',     email: 'dave@qualix.com',    password: HASH('password'), role: 'Tester',         active: true },
    { id: 'u5', name: 'Eve Auditor',     email: 'eve@qualix.com',     password: HASH('password'), role: 'Quality Auditor', active: true },
  ],

  cases: [
    { id: 'C-1001', status: 'Pending Review', assignedTo: 'Bob Tester',   type: 'Pass',            priority: 'High',   createdAt: '2024-01-10', score: null },
    { id: 'C-1002', status: 'Completed',      assignedTo: 'Dave Tester',  type: 'Fail',            priority: 'Medium', createdAt: '2024-01-11', score: 78 },
    { id: 'C-1003', status: 'In Progress',    assignedTo: 'Bob Tester',   type: 'Execution & Bug', priority: 'High',   createdAt: '2024-01-12', score: null },
    { id: 'C-1004', status: 'Pending Review', assignedTo: 'Dave Tester',  type: 'Exploratory',     priority: 'Low',    createdAt: '2024-01-13', score: null },
    { id: 'C-1005', status: 'Completed',      assignedTo: 'Bob Tester',   type: 'Pass',            priority: 'Medium', createdAt: '2024-01-14', score: 92 },
    { id: 'C-1006', status: 'Disputed',       assignedTo: 'Dave Tester',  type: 'Fail',            priority: 'High',   createdAt: '2024-01-15', score: 55 },
    { id: 'C-1007', status: 'In Progress',    assignedTo: 'Bob Tester',   type: 'Pass',            priority: 'Low',    createdAt: '2024-01-16', score: null },
    { id: 'C-1008', status: 'Pending Review', assignedTo: 'Dave Tester',  type: 'Execution & Bug', priority: 'Medium', createdAt: '2024-01-17', score: null },
    { id: 'C-1009', status: 'Completed',      assignedTo: 'Bob Tester',   type: 'Exploratory',     priority: 'High',   createdAt: '2024-01-18', score: 88 },
  ],

  disputes: [
    { id: 'D-001', caseId: 'C-1006', raisedBy: 'Bob Tester',  auditor: 'Carol Auditor', reason: 'Score mismatch on criteria Q45', status: 'Open',     ageDays: 5,  createdAt: '2024-01-20' },
    { id: 'D-002', caseId: 'C-1002', raisedBy: 'Dave Tester', auditor: 'Eve Auditor',   reason: 'Missing context in evaluation',  status: 'Pending',  ageDays: 3,  createdAt: '2024-01-22' },
    { id: 'D-003', caseId: 'C-1009', raisedBy: 'Bob Tester',  auditor: 'Carol Auditor', reason: 'Incorrect audit type applied',    status: 'Resolved', ageDays: 12, createdAt: '2024-01-15' },
    { id: 'D-004', caseId: 'C-1005', raisedBy: 'Dave Tester', auditor: 'Eve Auditor',   reason: 'Evidence not considered',         status: 'Open',     ageDays: 7,  createdAt: '2024-01-18' },
    { id: 'D-005', caseId: 'C-1003', raisedBy: 'Bob Tester',  auditor: 'Carol Auditor', reason: 'Criteria applied incorrectly',    status: 'Pending',  ageDays: 2,  createdAt: '2024-01-23' },
    { id: 'D-006', caseId: 'C-1007', raisedBy: 'Dave Tester', auditor: 'Eve Auditor',   reason: 'Score does not reflect comments', status: 'Open',     ageDays: 9,  createdAt: '2024-01-16' },
  ],

  agents: [
    { id: 'ag1', name: 'Raj Kumar',     site: 'India',  casesHandled: 42, avgScore: 91, disputes: 1 },
    { id: 'ag2', name: 'Priya Sharma',  site: 'India',  casesHandled: 38, avgScore: 87, disputes: 2 },
    { id: 'ag3', name: 'Arjun Singh',   site: 'India',  casesHandled: 45, avgScore: 94, disputes: 0 },
    { id: 'ag4', name: 'Sneha Patel',   site: 'India',  casesHandled: 31, avgScore: 83, disputes: 3 },
    { id: 'ag5', name: 'Vikram Das',    site: 'India',  casesHandled: 29, avgScore: 79, disputes: 1 },
    { id: 'ag6', name: 'Maria Santos',  site: 'Manila', casesHandled: 40, avgScore: 89, disputes: 2 },
    { id: 'ag7', name: 'Juan Dela Cruz',site: 'Manila', casesHandled: 36, avgScore: 85, disputes: 1 },
    { id: 'ag8', name: 'Ana Reyes',     site: 'Manila', casesHandled: 44, avgScore: 93, disputes: 0 },
    { id: 'ag9', name: 'Carlo Bautista',site: 'Manila', casesHandled: 27, avgScore: 76, disputes: 4 },
    { id: 'ag10',name: 'Luz Fernandez', site: 'Manila', casesHandled: 33, avgScore: 81, disputes: 2 },
  ],

  auditors: [
    { id: 'aud1', name: 'Carol Auditor', casesAudited: 78, avgTurnaround: 2.1, openDisputes: 3 },
    { id: 'aud2', name: 'Eve Auditor',   casesAudited: 65, avgTurnaround: 2.8, openDisputes: 5 },
    { id: 'aud3', name: 'Frank Chen',    casesAudited: 82, avgTurnaround: 1.9, openDisputes: 1 },
    { id: 'aud4', name: 'Grace Kim',     casesAudited: 71, avgTurnaround: 2.4, openDisputes: 2 },
  ],

  auditForms: [],

  binCases: [
    { id: 'B-301', type: 'Pass',        agent: 'Raj Kumar',    site: 'India',  status: 'Pending' },
    { id: 'B-302', type: 'Fail',        agent: 'Maria Santos', site: 'Manila', status: 'Pending' },
    { id: 'B-303', type: 'Exploratory', agent: 'Ana Reyes',    site: 'Manila', status: 'Pending' },
  ],

  workflowCases: [
    { id: 'W-401', caseId: 'C-1001', stage: 'Assigned',  assignedTo: 'Carol Auditor', dueDate: '2024-02-01' },
    { id: 'W-402', caseId: 'C-1003', stage: 'In Review', assignedTo: 'Eve Auditor',   dueDate: '2024-02-03' },
    { id: 'W-403', caseId: 'C-1004', stage: 'Pending',   assignedTo: 'Frank Chen',    dueDate: '2024-02-05' },
    { id: 'W-404', caseId: 'C-1008', stage: 'Completed', assignedTo: 'Grace Kim',     dueDate: '2024-01-30' },
  ],

  associates: [
    { id: 'as1', name: 'Leo Rivera',    feedbackSent: true,  coachingDone: false, atRisk: false },
    { id: 'as2', name: 'Nina Gomez',    feedbackSent: false, coachingDone: false, atRisk: true  },
    { id: 'as3', name: 'Omar Khalil',   feedbackSent: true,  coachingDone: true,  atRisk: false },
    { id: 'as4', name: 'Petra Novak',   feedbackSent: false, coachingDone: false, atRisk: false },
  ],
};

module.exports = db;
