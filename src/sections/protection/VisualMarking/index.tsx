import React, { useState } from 'react';
import { Eye, Plus, FileText, AlertCircle, Layout, Type, X } from 'lucide-react';
import Modal from "../../ui/Modal";

interface MarkingTemplate {
  id: string;
  name: string;
  description?: string;
  types: ('header' | 'footer' | 'overlay' | 'icon')[];
  content: {
    header?: string;
    footer?: string;
    overlay?: string;
  };
  style: {
    fontSize: string;
    fontColor: string;
    backgroundColor: string;
    placement: string;
    transparency?: number;
  };
  classification: string;
  status: 'active' | 'inactive';
}

interface NewTemplate {
  name: string;
  description: string;
  selectedTypes: ('header' | 'footer' | 'overlay' | 'icon')[];
  content: {
    header?: string;
    footer?: string;
    overlay?: string;
    iconTooltip?: string;
  };
  style: {
    header?: {
      fontSize: string;
      fontColor: string;
      backgroundColor: string;
      alignment: string;
    };
    footer?: {
      fontSize: string;
      fontColor: string;
      backgroundColor: string;
      alignment: string;
    };
    overlay?: {
      fontSize: string;
      fontColor: string;
      backgroundColor: string;
      placement: string;
      transparency: number;
    };
    icon?: {
      style: string;
    };
  };
  classifications: string[];
  tags: string[];
  scope: {
    onView: boolean;
    onEdit: boolean;
    onDownload: boolean;
  };
}

const VisualMarking: React.FC = () => {
  const [templates] = useState<MarkingTemplate[]>([
    {
      id: '1',
      name: 'Confidential Document Set',
      types: ['header', 'overlay', 'icon'],
      content: {
        header: 'CONFIDENTIAL - Internal Use Only',
        overlay: 'Confidential Information'
      },
      style: {
        fontSize: '14px',
        fontColor: '#991B1B',
        backgroundColor: '#FEE2E2',
        placement: 'top'
      },
      classification: 'Confidential',
      status: 'active'
    },
    {
      id: '2',
      name: 'Legal Document Marking',
      types: ['header', 'footer', 'icon'],
      content: {
        header: 'LEGAL - Privileged Communication',
        footer: '© 2024 Company Name - All Rights Reserved'
      },
      style: {
        fontSize: '12px',
        fontColor: '#1E40AF',
        backgroundColor: '#DBEAFE',
        placement: 'top'
      },
      classification: 'Legal',
      status: 'active'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    name: '',
    description: '',
    selectedTypes: [],
    content: {},
    style: {},
    classifications: [],
    tags: [],
    scope: {
      onView: true,
      onEdit: true,
      onDownload: false
    }
  });

  const handleTypeSelection = (type: 'header' | 'footer' | 'overlay' | 'icon') => {
    const updatedTypes = newTemplate.selectedTypes.includes(type)
      ? newTemplate.selectedTypes.filter(t => t !== type)
      : [...newTemplate.selectedTypes, type];
    
    setNewTemplate({
      ...newTemplate,
      selectedTypes: updatedTypes
    });
  };

  const renderCreateTemplate = () => (
    <Modal
      isOpen={isCreating}
      onClose={() => setIsCreating(false)}
      title="Create New Template"
      maxWidth="max-w-4xl"
    >
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
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
              placeholder="Enter Template Name (e.g., Confidential Notice)"
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
        </div>

        {/* Marker Types Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Marker Types *
          </label>
          <div className="flex flex-wrap gap-3">
            {(['header', 'footer', 'overlay', 'icon'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`px-4 py-2 rounded-md border ${
                  newTemplate.selectedTypes.includes(type)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Panels */}
        {newTemplate.selectedTypes.includes('header') && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Header Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Header Text *
                </label>
                <input
                  type="text"
                  value={newTemplate.content.header || ''}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    content: { ...newTemplate.content, header: e.target.value }
                  })}
                  placeholder="Enter Header Text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  maxLength={100}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={newTemplate.style.header?.fontSize || 'medium'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        header: {
                          ...newTemplate.style.header,
                          fontSize: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Alignment
                  </label>
                  <select
                    value={newTemplate.style.header?.alignment || 'center'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        header: {
                          ...newTemplate.style.header,
                          alignment: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Font Color
                  </label>
                  <input
                    type="color"
                    value={newTemplate.style.header?.fontColor || '#000000'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        header: {
                          ...newTemplate.style.header,
                          fontColor: e.target.value
                        }
                      }
                    })}
                    className="w-full h-10 p-1 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={newTemplate.style.header?.backgroundColor || '#ffffff'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        header: {
                          ...newTemplate.style.header,
                          backgroundColor: e.target.value
                        }
                      }
                    })}
                    className="w-full h-10 p-1 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {newTemplate.selectedTypes.includes('footer') && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Footer Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Footer Text *
                </label>
                <input
                  type="text"
                  value={newTemplate.content.footer || ''}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    content: { ...newTemplate.content, footer: e.target.value }
                  })}
                  placeholder="Enter Footer Text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  maxLength={100}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={newTemplate.style.footer?.fontSize || 'medium'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        footer: {
                          ...newTemplate.style.footer,
                          fontSize: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Alignment
                  </label>
                  <select
                    value={newTemplate.style.footer?.alignment || 'center'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        footer: {
                          ...newTemplate.style.footer,
                          alignment: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Font Color
                  </label>
                  <input
                    type="color"
                    value={newTemplate.style.footer?.fontColor || '#000000'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        footer: {
                          ...newTemplate.style.footer,
                          fontColor: e.target.value
                        }
                      }
                    })}
                    className="w-full h-10 p-1 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={newTemplate.style.footer?.backgroundColor || '#ffffff'}
                    onChange={(e) => setNewTemplate({
                      ...newTemplate,
                      style: {
                        ...newTemplate.style,
                        footer: {
                          ...newTemplate.style.footer,
                          backgroundColor: e.target.value
                        }
                      }
                    })}
                    className="w-full h-10 p-1 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {newTemplate.selectedTypes.includes('icon') && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Icon Overlay Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Icon Style *
                </label>
                <select
                  value={newTemplate.style.icon?.style || 'red-shield'}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    style: {
                      ...newTemplate.style,
                      icon: {
                        ...newTemplate.style.icon,
                        style: e.target.value
                      }
                    }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value="red-shield">Red Shield</option>
                  <option value="yellow-exclamation">Yellow Exclamation</option>
                  <option value="blue-info">Blue Info</option>
                  <option value="custom">Custom Icon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tooltip Text *
                </label>
                <input
                  type="text"
                  value={newTemplate.content.iconTooltip || ''}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    content: { ...newTemplate.content, iconTooltip: e.target.value }
                  })}
                  placeholder="Enter tooltip message (e.g., Confidential File)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  maxLength={50}
                />
              </div>

              {newTemplate.style.icon?.style === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Custom Icon Upload
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-slate-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept=".svg" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">SVG up to 1MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Preview Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Live Preview</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">Preview Document Type:</span>
              <select className="border rounded px-2 py-1">
                <option>Word Document</option>
                <option>PDF Document</option>
                <option>Excel Spreadsheet</option>
              </select>
            </div>
            
            {/* Preview content based on selected types and configurations */}
            <div className="bg-white border border-slate-300 rounded p-4 relative min-h-[200px]">
              {newTemplate.selectedTypes.includes('header') && newTemplate.content.header && (
                <div
                  className="text-center p-2 mb-4"
                  style={{
                    backgroundColor: newTemplate.style.header?.backgroundColor || '#ffffff',
                    color: newTemplate.style.header?.fontColor || '#000000',
                    textAlign: (newTemplate.style.header?.alignment || 'center') as 'left' | 'center' | 'right'
                  }}
                >
                  {newTemplate.content.header}
                </div>
              )}
              
              {/* Add other preview elements based on selected types */}
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
            disabled={!newTemplate.name || newTemplate.selectedTypes.length === 0}
          >
            Save Template
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {isCreating ? (
        renderCreateTemplate()
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Visual Marking Management</h2>
              <p className="text-slate-500 mt-2">
                Define and manage visual indicators that appear in the application layer without modifying document content.
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
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Marking Templates</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Template Name</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Marker Types</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Classification</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template) => (
                          <tr key={template.id} className="border-b border-slate-100">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Layout className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="font-medium text-slate-800">{template.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                {template.types.map((type) => (
                                  <span key={type} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs capitalize">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{template.classification}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                template.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-slate-600 hover:text-slate-900 mr-3">Edit</button>
                              <button className="text-slate-600 hover:text-slate-900 mr-3">Preview</button>
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
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Template Insights</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Active Templates</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {templates.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Marker Types Used</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">Header (2)</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">Footer (1)</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">Overlay (1)</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">Icon (2)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Font Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview All Active Markings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-md transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Template Report
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Non-Persistent Markings</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Visual markings are applied at the application layer and do not modify the original document content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualMarking;