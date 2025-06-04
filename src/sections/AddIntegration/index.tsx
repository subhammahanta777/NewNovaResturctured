import React, { useState } from 'react';
import { X, Globe, Server, Webhook, Database, TestTube, ArrowLeft, Microscope as Microsoft, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { integrationSchema, type IntegrationFormData } from '../../lib/validations/integration';
import { useToast } from '../../hooks/useToast';
import Modal from '../ui/Modal';

interface AddIntegrationProps {
  onCancel: () => void;
  onSave: (integration: IntegrationFormData) => void;
}

const AddIntegration: React.FC<AddIntegrationProps> = ({ onCancel, onSave }) => {
  const { showSuccess, showError } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [consentStatus, setConsentStatus] = useState<'pending' | 'granted' | 'error'>('pending');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const [config, setConfig] = useState<IntegrationFormData>({
    name: '',
    type: '',
    source: '',
    connectionType: '',
    eventTypes: [],
    syncFrequency: 'realtime',
    fieldMapping: []
  });

  // Mock SharePoint sites for demo
  const mockSharePointSites = [
    { id: '1', name: 'Marketing', url: 'https://contoso.sharepoint.com/sites/marketing', type: 'Team Site', fileCount: 1234 },
    { id: '2', name: 'HR Portal', url: 'https://contoso.sharepoint.com/sites/hr', type: 'Communication Site', fileCount: 567 },
    { id: '3', name: 'Finance', url: 'https://contoso.sharepoint.com/sites/finance', type: 'Team Site', fileCount: 890 },
    { id: '4', name: 'Legal', url: 'https://contoso.sharepoint.com/sites/legal', type: 'Team Site', fileCount: 432 }
  ];

  const handleSiteSelection = (siteId: string) => {
    if (selectedSites.includes(siteId)) {
      setSelectedSites(selectedSites.filter(id => id !== siteId));
    } else {
      setSelectedSites([...selectedSites, siteId]);
    }
  };

  const handleConsentCheck = async () => {
    try {
      // Simulate API call to check consent
      setConsentStatus('pending');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConsentStatus('granted');
      showSuccess('Admin consent verified successfully');
      setStep(3);
    } catch (error) {
      setConsentStatus('error');
      showError('Failed to verify admin consent');
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Microsoft className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800">SharePoint Integration</h3>
              <p className="text-sm text-slate-500">Connect to SharePoint Online via Microsoft Graph API</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">Not Connected</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">Prerequisites</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Global Administrator or SharePoint Administrator role</li>
                <li>• Microsoft 365 tenant with SharePoint Online</li>
                <li>• Ability to grant admin consent for Graph API permissions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-slate-700">Required Graph API Permissions:</h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Sites.Read.All',
              'Files.Read.All',
              'User.Read.All',
              'Group.Read.All',
              'Directory.Read.All'
            ].map(permission => (
              <div key={permission} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-md">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-mono text-slate-700">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start Integration
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Grant Admin Consent</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-700">You must be a Global Administrator to complete this step.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">Step 1: Register Nova in Azure AD</h4>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>1. Go to Azure Portal &gt; Azure Active Directory</li>
                <li>2. Navigate to App Registrations &gt; New Registration</li>
                <li>3. Name the application "Nova Data Protection"</li>
                <li>4. Select "Accounts in this organizational directory only"</li>
                <li>5. Click Register</li>
              </ol>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">Step 2: Grant API Permissions</h4>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>1. Select API Permissions &gt; Add Permission</li>
                <li>2. Choose Microsoft Graph</li>
                <li>3. Select Application Permissions</li>
                <li>4. Add all required permissions listed above</li>
                <li>5. Click "Grant Admin Consent"</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                consentStatus === 'granted' ? 'bg-green-500' :
                consentStatus === 'error' ? 'bg-red-500' :
                'bg-amber-500'
              }`} />
              <span className="text-sm text-slate-700">
                {consentStatus === 'granted' ? 'Admin consent verified' :
                 consentStatus === 'error' ? 'Consent verification failed' :
                 'Waiting for admin consent'}
              </span>
            </div>
            <button
              onClick={handleConsentCheck}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Verify Consent
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setStep(3)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={consentStatus !== 'granted'}
          >
            Next: Configure Sites
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Configure Site Scope</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="siteScope"
                value="all"
                checked={selectedSites.length === mockSharePointSites.length}
                onChange={() => setSelectedSites(mockSharePointSites.map(site => site.id))}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">All sites in tenant</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="siteScope"
                value="selected"
                checked={selectedSites.length > 0 && selectedSites.length < mockSharePointSites.length}
                onChange={() => setSelectedSites([])}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Only selected sites</span>
            </label>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Select</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Site Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Files</th>
                </tr>
              </thead>
              <tbody>
                {mockSharePointSites.map(site => (
                  <tr key={site.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.id)}
                        onChange={() => handleSiteSelection(site.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">{site.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{site.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{site.url}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{site.fileCount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setStep(5)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={selectedSites.length === 0}
          >
            Next: Review
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800">Review Integration Settings</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">Admin Consent Status</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-slate-700">Verified and Granted</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">Site Scope</h4>
              <p className="text-slate-700">
                {selectedSites.length === mockSharePointSites.length
                  ? 'All SharePoint sites'
                  : `${selectedSites.length} selected sites`}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Estimated Scan Volume</h4>
            <p className="text-slate-700">
              {mockSharePointSites
                .filter(site => selectedSites.includes(site.id))
                .reduce((sum, site) => sum + site.fileCount, 0)
                .toLocaleString()} files across {selectedSites.length} sites
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">Important Notice</h4>
                <p className="mt-1 text-sm text-amber-700">
                  The first scan may take several hours depending on the volume of content.
                  Subsequent delta scans will be much faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                name: 'SharePoint Integration',
                type: 'Repository',
                source: 'Microsoft SharePoint',
                connectionType: 'api',
                eventTypes: ['file_create', 'file_modify', 'file_delete', 'share'],
                syncFrequency: 'realtime',
                fieldMapping: []
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Activate Integration
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Integrations
        </button>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber !== 5 ? 'space-x-4' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepNumber
                    ? 'bg-blue-600 text-white'
                    : step > stepNumber
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {step > stepNumber ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber !== 5 && (
                  <div className={`h-0.5 w-12 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 5 && renderStep5()}
    </div>
  );
};

export default AddIntegration;