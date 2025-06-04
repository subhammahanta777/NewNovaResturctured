import React, { useState } from 'react';
import { Plus, AlertCircle, Eye, FileText, Settings, Type, Image as ImageIcon, Trash2, Copy, Layout, X, ArrowLeft } from 'lucide-react';
import Modal from "../../ui/Modal";

interface WatermarkTemplate {
  id: string;
  name: string;
  description: string;
  type: 'static' | 'dynamic' | 'invisible' | 'print' | 'screen';
  content: {
    text?: string;
    variables?: string[];
    image?: string;
  };
  style: {
    placement: 'header' | 'footer' | 'diagonal' | 'margin' | 'background';
    opacity: number;
    fontSize?: string;
    fontColor?: string;
    rotation?: number;
    padding?: string;
  };
  trigger: {
    events: string[];
    conditions: {
      type: string;
      value: string;
    }[];
  };
  scope: {
    fileTypes: string[];
    platforms: string[];
  };
  status: 'active' | 'inactive';
  lastModified: string;
  usageCount: number;
}

interface NewWatermarkTemplate {
  name: string;
  description: string;
  type: 'static' | 'dynamic' | 'invisible' | 'print' | 'screen';
  content: {
    text?: string;
    variables?: string[];
    image?: string;
    iconTooltip?: string;
  };
  style: {
    placement: 'header' | 'footer' | 'diagonal' | 'margin' | 'background';
    opacity: number;
    fontSize?: string;
    fontColor?: string;
    rotation?: number;
    padding?: string;
    backgroundColor?: string;
  };
  trigger: {
    events: string[];
    conditions: {
      type: string;
      value: string;
    }[];
  };
  scope: {
    fileTypes: string[];
    platforms: string[];
    onView: boolean;
    onEdit: boolean;
    onDownload: boolean;
    onPrint: boolean;
  };
}

const Watermark: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [templates] = useState<WatermarkTemplate[]>([
    {
      id: '1',
      name: 'Confidential Document Watermark',
      description: 'Standard confidential watermark for sensitive documents',
      type: 'static',
      content: {
        text: 'CONFIDENTIAL',
      },
      style: {
        placement: 'diagonal',
        opacity: 0.3,
        fontSize: '48px',
        fontColor: '#FF0000',
        rotation: 45,
        padding: '20px'
      },
      trigger: {
        events: ['view', 'print'],
        conditions: [
          { type: 'classification', value: 'confidential' }
        ]
      },
      scope: {
        fileTypes: ['pdf', 'docx', 'xlsx', 'pptx'],
        platforms: ['windows', 'macos', 'web']
      },
      status: 'active',
      lastModified: '2024-03-15',
      usageCount: 245
    },
    {
      id: '2',
      name: 'Dynamic User Watermark',
      description: 'Dynamic watermark showing user info and timestamp',
      type: 'dynamic',
      content: {
        variables: ['user.email', 'datetime', 'ip.address']
      },
      style: {
        placement: 'footer',
        opacity: 0.8,
        fontSize: '10px',
        fontColor: '#666666',
        padding: '10px'
      },
      trigger: {
        events: ['view', 'print', 'download'],
        conditions: [
          { type: 'sharing', value: 'external' }
        ]
      },
      scope: {
        fileTypes: ['pdf', 'docx'],
        platforms: ['web']
      },
      status: 'active',
      lastModified: '2024-03-14',
      usageCount: 1893
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<WatermarkTemplate | null>(null);
  const [previewType, setPreviewType] = useState<'pdf' | 'word' | 'excel'>('pdf');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const [newTemplate, setNewTemplate] = useState<NewWatermarkTemplate>({
    name: '',
    description: '',
    type: 'static',
    content: {},
    style: {
      placement: 'diagonal',
      opacity: 0.5,
      fontSize: 'medium',
      fontColor: '#000000',
      backgroundColor: '#ffffff',
      rotation: 0,
      padding: '20px'
    },
    trigger: {
      events: [],
      conditions: []
    },
    scope: {
      fileTypes: [],
      platforms: [],
      onView: true,
      onEdit: true,
      onDownload: false,
      onPrint: true
    }
  });

  const renderTemplateList = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Watermark Protection</h2>
          <p className="text-slate-500 mt-2">
            Define and manage watermarks for document protection and traceability
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Watermark Templates</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Template Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Usage</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template) => (
                      <tr key={template.id} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {template.type === 'static' && <Type className="w-4 h-4 text-blue-600 mr-2" />}
                            {template.type === 'dynamic' && <Layout className="w-4 h-4 text-purple-600 mr-2" />}
                            {template.type === 'invisible' && <Eye className="w-4 h-4 text-green-600 mr-2" />}
                            <span className="font-medium text-slate-800">{template.name}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs capitalize">
                            {template.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{template.usageCount} documents</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button 
                            onClick={() => setSelectedTemplate(template)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            Preview
                          </button>
                          <button className="text-slate-600 hover:text-slate-900">Edit</button>
                          <button className="text-slate-600 hover:text-slate-900">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Template Insights</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Active Templates</p>
                <p className="text-2xl font-bold text-slate-800">
                  {templates.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Protected Documents</p>
                <p className="text-2xl font-bold text-slate-800">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Watermark Types</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">Static (1)</span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">Dynamic (1)</span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">Invisible (0)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Default Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Logo
              </button>
              <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">Watermark Best Practices</h4>
                <p className="text-sm text-amber-700 mt-1">
                  For optimal protection, combine watermarks with other security controls like encryption and access policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-slate-800">Preview: {selectedTemplate.name}</h3>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <button
                      onClick={() => setPreviewType('pdf')}
                      className={`px-3 py-1.5 rounded ${
                        previewType === 'pdf'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => setPreviewType('word')}
                      className={`px-3 py-1.5 rounded ${
                        previewType === 'word'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Word
                    </button>
                    <button
                      onClick={() => setPreviewType('excel')}
                      className={`px-3 py-1.5 rounded ${
                        previewType === 'excel'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Excel
                    </button>
                  </div>

                  <button
                    onClick={() => setPreviewMode(mode => mode === 'light' ? 'dark' : 'light')}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className={`aspect-[4/3] rounded-lg border relative ${
                  previewMode === 'light' ? 'bg-white' : 'bg-slate-800'
                }`}>
                  {selectedTemplate.type === 'static' && selectedTemplate.content.text && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: selectedTemplate.style.opacity,
                        transform: `rotate(${selectedTemplate.style.rotation}deg)`,
                        color: selectedTemplate.style.fontColor,
                        fontSize: selectedTemplate.style.fontSize,
                        padding: selectedTemplate.style.padding
                      }}
                    >
                      {selectedTemplate.content.text}
                    </div>
                  )}

                  {selectedTemplate.type === 'dynamic' && selectedTemplate.content.variables && (
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4"
                      style={{
                        opacity: selectedTemplate.style.opacity,
                        color: selectedTemplate.style.fontColor,
                        fontSize: selectedTemplate.style.fontSize,
                        backgroundColor: previewMode === 'light' ? '#f8fafc' : '#1e293b'
                      }}
                    >
                      <p className="text-center">
                        Viewed by: john.doe@example.com | IP: 192.168.1.1 | 2024-03-20 14:30:00
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Template Details</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-slate-500">Type</dt>
                    <dd className="text-slate-900 capitalize">{selectedTemplate.type}</dd>
                    <dt className="text-slate-500">Placement</dt>
                    <dd className="text-slate-900 capitalize">{selectedTemplate.style.placement}</dd>
                    <dt className="text-slate-500">Opacity</dt>
                    <dd className="text-slate-900">{selectedTemplate.style.opacity * 100}%</dd>
                    <dt className="text-slate-500">Supported Platforms</dt>
                    <dd className="text-slate-900 capitalize">{selectedTemplate.scope.platforms.join(', ')}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCreateTemplate = () => (
    <Modal
      isOpen={isCreating}
      onClose={() => setIsCreating(false)}
      title="Create New Template"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Template Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              placeholder="Enter Template Name (e.g., Confidential Static Watermark)"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={newTemplate.description}
              onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              placeholder="Describe the purpose of this template..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Watermark Type *
            </label>
            <select
              value={newTemplate.type}
              onChange={(e) => setNewTemplate({ 
                ...newTemplate, 
                type: e.target.value as NewWatermarkTemplate['type']
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="static">Static Watermark</option>
              <option value="dynamic">Dynamic Watermark</option>
              <option value="invisible">Invisible Watermark</option>
              <option value="print">Print-Only Watermark</option>
              <option value="screen">On-Screen Watermark</option>
            </select>
          </div>
        </div>

        {/* Content Configuration */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Content Configuration</h3>
          
          {newTemplate.type === 'static' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Watermark Text *
                </label>
                <input
                  type="text"
                  value={newTemplate.content.text || ''}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    content: { ...newTemplate.content, text: e.target.value }
                  })}
                  placeholder="Enter watermark text (e.g., CONFIDENTIAL)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Logo/Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/png,image/svg+xml" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG or SVG up to 1MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {newTemplate.type === 'dynamic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dynamic Variables
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'username', label: 'Username' },
                    { id: 'email', label: 'Email ID' },
                    { id: 'timestamp', label: 'Timestamp' },
                    { id: 'device', label: 'Device Name' },
                    { id: 'ip', label: 'IP Address' },
                    { id: 'location', label: 'Geo-Location' },
                    { id: 'docid', label: 'Document ID' }
                  ].map((variable) => (
                    <label key={variable.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newTemplate.content.variables?.includes(variable.id)}
                        onChange={(e) => {
                          const variables = newTemplate.content.variables || [];
                          const updatedVariables = e.target.checked
                            ? [...variables, variable.id]
                            : variables.filter(v => v !== variable.id);
                          setNewTemplate({
                            ...newTemplate,
                            content: { ...newTemplate.content, variables: updatedVariables }
                          });
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">{variable.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Format String
                </label>
                <input
                  type="text"
                  value={newTemplate.content.text || ''}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    content: { ...newTemplate.content, text: e.target.value }
                  })}
                  placeholder="e.g., Accessed by {Username} on {Timestamp}"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Use {'{Variable}'} syntax to include dynamic values
                </p>
              </div>
            </div>
          )}

          {newTemplate.type === 'invisible' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Forensic Mark Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="metadata">Embedded Metadata</option>
                  <option value="pattern">Pixel-Level Pattern</option>
                  <option value="hash">Cryptographic Hash</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">Enable Tamper Detection</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Style Configuration */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Style Configuration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Placement
              </label>
              <select
                value={newTemplate.style.placement}
                onChange={(e) => setNewTemplate({
                  ...newTemplate,
                  style: {
                    ...newTemplate.style,
                    placement: e.target.value as NewWatermarkTemplate['style']['placement']
                  }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="diagonal">Diagonal (Center)</option>
                <option value="margin">Margin</option>
                <option value="background">Background</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Font Size
              </label>
              <select
                value={newTemplate.style.fontSize}
                onChange={(e) => setNewTemplate({
                  ...newTemplate,
                  style: { ...newTemplate.style, fontSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Font Color
              </label>
              <input
                type="color"
                value={newTemplate.style.fontColor}
                onChange={(e) => setNewTemplate({
                  ...newTemplate,
                  style: { ...newTemplate.style, fontColor: e.target.value }
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newTemplate.style.opacity * 100}
                onChange={(e) => setNewTemplate({
                  ...newTemplate,
                  style: { ...newTemplate.style, opacity: parseInt(e.target.value) / 100 }
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>{Math.round(newTemplate.style.opacity * 100)}%</span>
                <span>100%</span>
              </div>
            </div>

            {newTemplate.style.placement === 'diagonal' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rotation
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={newTemplate.style.rotation}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    style: { ...newTemplate.style, rotation: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0°</span>
                  <span>{newTemplate.style.rotation}°</span>
                  <span>90°</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trigger Conditions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Trigger Conditions</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Apply Template When:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'classification', label: 'Classification', options: ['Confidential',
                    'Restricted', 'Internal'] },
                  { id: 'tags', label: 'Tags', options: ['PII', 'Financial', 'GDPR'] }
                ].map((condition) => (
                  <div key={condition.id} className="flex items-center space-x-2">
                    <select
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                      onChange={(e) => {
                        const conditions = [...newTemplate.trigger.conditions];
                        const existingIndex = conditions.findIndex(c => c.type === condition.id);
                        if (existingIndex >= 0) {
                          conditions[existingIndex].value = e.target.value;
                        } else {
                          conditions.push({ type: condition.id, value: e.target.value });
                        }
                        setNewTemplate({
                          ...newTemplate,
                          trigger: { ...newTemplate.trigger, conditions }
                        });
                      }}
                    >
                      <option value="">Select {condition.label}</option>
                      {condition.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trigger Events:
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.scope.onView}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      scope: { ...newTemplate.scope, onView: e.target.checked }
                    })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">On View</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.scope.onEdit}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      scope: { ...newTemplate.scope, onEdit: e.target.checked }
                    })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">On Edit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.scope.onDownload}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      scope: { ...newTemplate.scope, onDownload: e.target.checked }
                    })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">On Download</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.scope.onPrint}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      scope: { ...newTemplate.scope, onPrint: e.target.checked }
                    })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">On Print</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Live Preview</h3>
          
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                <button
                  onClick={() => setPreviewType('pdf')}
                  className={`px-3 py-1.5 rounded ${
                    previewType === 'pdf'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => setPreviewType('word')}
                  className={`px-3 py-1.5 rounded ${
                    previewType === 'word'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  Word
                </button>
                <button
                  onClick={() => setPreviewType('excel')}
                  className={`px-3 py-1.5 rounded ${
                    previewType === 'excel'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  Excel
                </button>
              </div>

              <button
                onClick={() => setPreviewMode(mode => mode === 'light' ? 'dark' : 'light')}
                className="text-slate-600 hover:text-slate-800"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className={`aspect-[4/3] rounded-lg border relative ${
              previewMode === 'light' ? 'bg-white' : 'bg-slate-800'
            }`}>
              {newTemplate.type === 'static' && newTemplate.content.text && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: newTemplate.style.opacity,
                    transform: `rotate(${newTemplate.style.rotation}deg)`,
                    color: newTemplate.style.fontColor,
                    fontSize: newTemplate.style.fontSize === 'large' ? '48px' : 
                            newTemplate.style.fontSize === 'medium' ? '32px' : '24px',
                    padding: newTemplate.style.padding
                  }}
                >
                  {newTemplate.content.text}
                </div>
              )}

              {newTemplate.type === 'dynamic' && newTemplate.content.variables && (
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    opacity: newTemplate.style.opacity,
                    color: newTemplate.style.fontColor,
                    fontSize: newTemplate.style.fontSize === 'large' ? '16px' : 
                            newTemplate.style.fontSize === 'medium' ? '14px' : '12px',
                    backgroundColor: previewMode === 'light' ? '#f8fafc' : '#1e293b'
                  }}
                >
                  <p className="text-center">
                    {newTemplate.content.text || 'Preview of dynamic content with selected variables'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Handle save template
              setIsCreating(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!newTemplate.name}
          >
            Save Template
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      {isCreating ? renderCreateTemplate() : renderTemplateList()}
    </>
  );
};

export default Watermark;