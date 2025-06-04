import React, { useState } from 'react';
import { Shield, UserPlus, Search, Filter, AlertCircle, Settings, Users, Key, Database, HelpCircle, FileCheck, Network, BookOpen, UserCog } from 'lucide-react';
import Modal from '../ui/Modal';

interface AdminRole {
  id: string;
  name: string;
  type: string;
  description: string;
  modules: string[];
  responsibilities: string[];
  personas: string[];
  status: 'active' | 'inactive';
  lastActive?: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
  department?: string;
}

const Administration: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [customRoleName, setCustomRoleName] = useState('');

  const adminRoles = [
    {
      id: 'global_admin',
      name: 'Global Administrator',
      description: 'Oversee and access to all management capabilities of the NOVA platform',
      modules: ['All Modules'],
      personas: ['Infosec leader', 'Global Administrator']
    },
    {
      id: 'system_admin',
      name: 'System Administrator',
      description: 'Oversee initial system setup, role management, and integrations',
      modules: ['System Setup', 'Key Management', 'Identity and SSO', 'Role Management', 'OU Management', 'Installer Management', 'Application Integrations', 'Branding', 'Compliance', 'Audit Logs'],
      personas: ['Head of IT', 'Infosec leader', 'Platform Owner', 'Global Admin']
    },
    {
      id: 'security_admin',
      name: 'Security Administrator',
      description: 'Create, review and manage security policies and monitor threat landscape',
      modules: ['Policy Management', 'Activity Reports – File', 'Activity Reports – User'],
      personas: ['Security Architect', 'Security Administrator', 'Data Protection Officer']
    },
    {
      id: 'compliance_auditor',
      name: 'Compliance Auditor',
      description: 'Independent visibility into system actions for compliance verification',
      modules: ['Policy Management (Read Only)', 'Risk Dashboard', 'Usage Dashboard', 'Audit Logs', 'Activity Reports'],
      personas: ['Internal Auditors', 'Data Privacy Officers', 'Risk Compliance Teams']
    },
    {
      id: 'integration_admin',
      name: 'Integration Administrator',
      description: 'Create and manage application integration registrations and settings',
      modules: ['Integration Console', 'Connector Management'],
      personas: ['SecOps Engineers', 'IT Infrastructure Teams']
    },
    {
      id: 'license_admin',
      name: 'License Administrator',
      description: 'End user and component license management',
      modules: ['License Management', 'Usage Reports'],
      personas: ['IT Admin', 'Platform Owner', 'IT/Sec Ops']
    },
    {
      id: 'global_reader',
      name: 'Global Reader',
      description: 'View all administrator features and settings',
      modules: ['All Modules (Read Only)'],
      personas: ['CISO', 'Infosec Leader', 'CIO']
    },
    {
      id: 'security_reader',
      name: 'Security Admin Reader',
      description: 'View all security related administration functions',
      modules: ['Security Policies', 'Rules', 'Risk Dashboards'],
      personas: ['Director of Security', 'Head of Sec Ops']
    },
    {
      id: 'policy_approver',
      name: 'Policy Approver / Reviewer',
      description: 'Enforces governance over policy changes in high-compliance environments',
      modules: ['Policy Review', 'Approval Management'],
      personas: ['InfoSec Managers', 'Governance Boards', 'Chief Risk Officers']
    },
    {
      id: 'helpdesk_admin',
      name: 'Helpdesk Administrator',
      description: 'Supports operational troubleshooting and user assistance',
      modules: ['Activity Reports – File', 'Activity Reports - User', 'User Management'],
      personas: ['IT Support Desk', 'Enterprise IT Helpdesk', 'L1-L2 Tech Support']
    },
    {
      id: 'custom',
      name: 'Custom Role',
      description: 'Define a custom administrative role',
      modules: [],
      personas: []
    }
  ];

  const [admins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Global Administrator',
      status: 'active',
      lastActive: '2024-03-20 14:30:00',
      department: 'IT Security'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      role: 'System Administrator',
      status: 'active',
      lastActive: '2024-03-20 13:15:00',
      department: 'IT Operations'
    }
  ]);

  const renderCreateAdminForm = () => (
    <Modal
      isOpen={isCreating}
      onClose={() => setIsCreating(false)}
      title="Create New Administrator"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Administrative Role *
          </label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setCustomRoleName('');
              }
            }}
          >
            <option value="">Select Role</option>
            {adminRoles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        {customRoleName !== undefined && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Custom Role Name *
            </label>
            <input
              type="text"
              value={customRoleName}
              onChange={(e) => setCustomRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter custom role name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department
          </label>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
            <option value="">Select Department</option>
            <option value="it_security">IT Security</option>
            <option value="it_ops">IT Operations</option>
            <option value="compliance">Compliance</option>
            <option value="infosec">Information Security</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Access Duration
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="permanent"
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Permanent</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="temporary"
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Temporary</span>
            </label>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Important Notice</h4>
              <p className="text-sm text-amber-700 mt-1">
                Administrative access will be granted based on the principle of least privilege. 
                All actions will be logged and audited.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Administrator
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Administration</h2>
          <p className="text-slate-500 mt-2">
            Manage administrative roles and permissions across the platform
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Administrator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">Total Admins</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">{admins.length}</p>
          <p className="text-sm text-slate-500 mt-1">Across all roles</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-800">Active</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">
            {admins.filter(a => a.status === 'active').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Currently active admins</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-slate-800">Global Admins</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">
            {admins.filter(a => a.role === 'Global Administrator').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">With full access</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-800">System Admins</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800 mt-4">
            {admins.filter(a => a.role === 'System Administrator').length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Managing system config</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Administrator Accounts</h3>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search administrators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md w-64"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md"
              >
                <option value="">All Roles</option>
                {adminRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Department</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Active</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-slate-100">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-800">{admin.name}</p>
                      <p className="text-sm text-slate-500">{admin.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{admin.department}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{admin.lastActive}</td>
                  <td className="py-4 px-4 text-right space-x-3">
                    <button className="text-slate-600 hover:text-slate-900">Edit</button>
                    <button className="text-slate-600 hover:text-slate-900">Disable</button>
                    <button className="text-red-600 hover:text-red-800">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreating && renderCreateAdminForm()}
    </div>
  );
};

export default Administration;