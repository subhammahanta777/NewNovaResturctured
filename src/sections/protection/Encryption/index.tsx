import React, { useState } from 'react';
import { Plus, AlertCircle, Key, Settings, FileText, Shield, Lock, X, ArrowLeft, Database, RefreshCw } from 'lucide-react';
import Modal from "../../ui/Modal";

interface EncryptionPolicy {
  id: string;
  name: string;
  description: string;
  algorithm: string;
  keySize: number;
  keyRotation: string;
  status: 'active' | 'inactive';
  lastModified: string;
  usageCount: number;
  scope: {
    departments: string[];
    fileTypes: string[];
  };
}

interface NewEncryptionPolicy {
  name: string;
  description: string;
  algorithm: string;
  keySize: number;
  keyRotation: string;
  scope: {
    departments: string[];
    fileTypes: string[];
  };
  options: {
    offlineAccess: boolean;
    keyEscrow: boolean;
    hardwareBackedKeys: boolean;
  };
}

const Encryption: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [policies] = useState<EncryptionPolicy[]>([
    {
      id: '1',
      name: 'Standard Encryption',
      description: 'Default encryption policy for sensitive data',
      algorithm: 'AES',
      keySize: 256,
      keyRotation: '90 days',
      status: 'active',
      lastModified: '2024-03-15',
      usageCount: 1234,
      scope: {
        departments: ['All Departments'],
        fileTypes: ['PDF', 'Office', 'Images']
      }
    },
    {
      id: '2',
      name: 'High Security',
      description: 'Enhanced encryption for highly sensitive data',
      algorithm: 'AES',
      keySize: 256,
      keyRotation: '30 days',
      status: 'active',
      lastModified: '2024-03-14',
      usageCount: 567,
      scope: {
        departments: ['Finance', 'Legal'],
        fileTypes: ['PDF', 'Office']
      }
    }
  ]);

  const [newPolicy, setNewPolicy] = useState<NewEncryptionPolicy>({
    name: '',
    description: '',
    algorithm: 'AES',
    keySize: 256,
    keyRotation: '90',
    scope: {
      departments: [],
      fileTypes: []
    },
    options: {
      offlineAccess: true,
      keyEscrow: true,
      hardwareBackedKeys: false
    }
  });

  const departments = [
    'All Departments',
    'Finance',
    'Legal',
    'HR',
    'IT',
    'Marketing',
    'Sales'
  ];

  const fileTypes = [
    'PDF',
    'Office Documents',
    'Images',
    'CAD Files',
    'Source Code',
    'Database Backups'
  ];

  const renderCreatePolicy = () => (
    <Modal
      isOpen={isCreating}
      onClose={() => setIsCreating(false)}
      title="Create Encryption Policy"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Policy Name *
          </label>
          <input
            type="text"
            value={newPolicy.name}
            onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
            placeholder="Enter policy name"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={newPolicy.description}
            onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
            placeholder="Describe the purpose and scope of this policy"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Encryption Algorithm
            </label>
            <select
              value={newPolicy.algorithm}
              onChange={(e) => setNewPolicy({ ...newPolicy, algorithm: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="AES">AES (Advanced Encryption Standard)</option>
              <option value="ChaCha20">ChaCha20-Poly1305</option>
              <option value="RSA">RSA (For Key Exchange)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Key Size (bits)
            </label>
            <select
              value={newPolicy.keySize}
              onChange={(e) => setNewPolicy({ ...newPolicy, keySize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="128">128-bit</option>
              <option value="192">192-bit</option>
              <option value="256">256-bit</option>
              <option value="512">512-bit (RSA)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Key Rotation Period
          </label>
          <select
            value={newPolicy.keyRotation}
            onChange={(e) => setNewPolicy({ ...newPolicy, keyRotation: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">365 days</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Advanced Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newPolicy.options.offlineAccess}
                onChange={(e) => setNewPolicy({
                  ...newPolicy,
                  options: { ...newPolicy.options, offlineAccess: e.target.checked }
                })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-slate-700">Allow Offline Access</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newPolicy.options.keyEscrow}
                onChange={(e) => setNewPolicy({
                  ...newPolicy,
                  options: { ...newPolicy.options, keyEscrow: e.target.checked }
                })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-slate-700">Enable Key Escrow</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newPolicy.options.hardwareBackedKeys}
                onChange={(e) => setNewPolicy({
                  ...newPolicy,
                  options: { ...newPolicy.options, hardwareBackedKeys: e.target.checked }
                })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-slate-700">Use Hardware-Backed Keys</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Policy Scope
          </label>
          
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Departments
            </label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(dept => (
                <label key={dept} className="flex items-center p-2 bg-slate-50 rounded-md">
                  <input
                    type="checkbox"
                    checked={newPolicy.scope.departments.includes(dept)}
                    onChange={(e) => {
                      let updatedDepts = [...newPolicy.scope.departments];
                      if (dept === "All Departments") {
                        updatedDepts = e.target.checked ? ["All Departments"] : [];
                      } else {
                        updatedDepts = e.target.checked
                          ? [...updatedDepts.filter(d => d !== "All Departments"), dept]
                          : updatedDepts.filter(d => d !== dept);
                      }
                      setNewPolicy({
                        ...newPolicy,
                        scope: { ...newPolicy.scope, departments: updatedDepts }
                      });
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              File Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fileTypes.map(type => (
                <label key={type} className="flex items-center p-2 bg-slate-50 rounded-md">
                  <input
                    type="checkbox"
                    checked={newPolicy.scope.fileTypes.includes(type)}
                    onChange={(e) => {
                      const updatedTypes = e.target.checked
                        ? [...newPolicy.scope.fileTypes, type]
                        : newPolicy.scope.fileTypes.filter(t => t !== type);
                      setNewPolicy({
                        ...newPolicy,
                        scope: { ...newPolicy.scope, fileTypes: updatedTypes }
                      });
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle save
              setIsCreating(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!newPolicy.name}
          >
            Create Policy
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Encryption Protection</h2>
          <p className="text-slate-500 mt-2">
            Define and manage encryption policies for secure data protection
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Policy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Encryption Policies</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Policy Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Algorithm</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Key Rotation</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Usage</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy) => (
                      <tr key={policy.id} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Key className="w-4 h-4 text-blue-600 mr-2" />
                            <div>
                              <p className="font-medium text-slate-800">{policy.name}</p>
                              <p className="text-xs text-slate-500">{policy.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                            {policy.algorithm}-{policy.keySize}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{policy.keyRotation}</td>
                        <td className="py-3 px-4 text-slate-600">{policy.usageCount} files</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button className="text-slate-600 hover:text-slate-900">Edit</button>
                          <button className="text-slate-600 hover:text-slate-900">Rotate Keys</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Management</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Active Keys</p>
                <p className="text-2xl font-bold text-slate-800">
                  {policies.length * 2} {/* Assuming 2 active keys per policy */}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Protected Files</p>
                <p className="text-2xl font-bold text-slate-800">
                  {policies.reduce((sum, p) => sum + p.usageCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Next Key Rotation</p>
                <p className="text-lg font-medium text-slate-800">In 15 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Key Storage Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Rotate All Keys
              </button>
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Export Key Report
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Key Security</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All encryption keys are stored in a hardware security module (HSM) and rotated automatically based on policy settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreating && renderCreatePolicy()}
    </div>
  );
};

export default Encryption;