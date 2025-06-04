import React, { useState } from 'react';
import { Plus, Info, ChevronUp, ChevronDown, Trash2, ArrowUp } from 'lucide-react';
import Modal from "../../ui/Modal";

interface ContentPolicy {
  id: string;
  name: string;
  description?: string;
  lastModified: string;
  conditions: PolicyCondition[];
  suggestedClassification: string;
}

interface PolicyCondition {
  id: string;
  name: string;
  type: 'Any of these' | 'All of these' | 'None of these';
  values: string;
}

const ContentPolicies: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'conditions' | 'review'>('name');
  const [policies] = useState<ContentPolicy[]>([
    {
      id: '1',
      name: 'Test CC',
      lastModified: '09 May 2025, 06:14 PM',
      conditions: [
        {
          id: '1',
          name: 'Regex 1',
          type: 'Any of these',
          values: '(^|\\s)\\d{3})[(-]?)(\\d{4})[(-]?)(\\d{4})($|\\s)'
        }
      ],
      suggestedClassification: 'Confidential'
    },
    // Add more sample policies here
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Content Policies</h2>
          <p className="text-slate-500 mt-2">
            Set up content policies to scan documents and emails for specific keywords and patterns, and propose classification labels based on the identified content.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Policy
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last modified on</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Delete</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="border-t border-slate-100">
                <td className="py-3 px-4">
                  <span className="font-medium text-slate-800">{policy.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-600">{policy.lastModified}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Edit Policy"
        maxWidth="max-w-4xl"
      >
        <div className="flex">
          <div className="w-64 border-r border-slate-200 pr-6">
            <div className="space-y-4">
              <div 
                className={`p-3 rounded-lg flex items-center space-x-2 ${
                  currentStep === 'name' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  {currentStep === 'name' ? '✓' : '1'}
                </div>
                <span>Policy Name</span>
              </div>
              <div 
                className={`p-3 rounded-lg flex items-center space-x-2 ${
                  currentStep === 'conditions' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  {currentStep === 'conditions' ? '✓' : '2'}
                </div>
                <span>Content Conditions</span>
              </div>
              <div 
                className={`p-3 rounded-lg flex items-center space-x-2 ${
                  currentStep === 'review' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  {currentStep === 'review' ? '✓' : '3'}
                </div>
                <span>Review and Save</span>
              </div>
            </div>
          </div>

          <div className="flex-1 pl-8">
            {/* Add form content for each step */}
            {/* This will be expanded based on the screenshots */}
          </div>
        </div>

        <div className="border-t mt-6 pt-6 flex justify-between">
          <button
            onClick={() => {
              if (currentStep === 'conditions') setCurrentStep('name');
              if (currentStep === 'review') setCurrentStep('conditions');
            }}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (currentStep === 'name') setCurrentStep('conditions');
              if (currentStep === 'conditions') setCurrentStep('review');
              if (currentStep === 'review') setIsCreating(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {currentStep === 'review' ? 'Save Policy' : 'Next'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ContentPolicies;