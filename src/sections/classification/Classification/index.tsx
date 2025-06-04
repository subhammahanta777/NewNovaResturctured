import React, { useState } from 'react';
import { Plus, AlertCircle, Eye, FileText, Settings, Type, Image as ImageIcon, Trash2, Copy, Layout, X, ArrowLeft, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import Modal from "../../ui/Modal";

interface ClassificationLabel {
  id: string;
  name: string;
  description: string;
  sensitivityLevel: number;
  color: string;
  lastModified: string;
  tooltip?: string;
  sublabels?: ClassificationLabel[];
  isExpanded?: boolean;
}

interface Protection {
  id: string;
  type: string;
  template: string;
}

interface EditingLabel extends ClassificationLabel {
  visualMarking?: string;
  protections: Protection[];
}

const Classification: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<EditingLabel | null>(null);
  const [currentStep, setCurrentStep] = useState<'name' | 'visual' | 'protection' | 'email'>('name');
  const [labels, setLabels] = useState<ClassificationLabel[]>([
    {
      id: '1',
      name: 'Public',
      description: 'Business data that poses no risk to the organization',
      tooltip: 'This label applies to information approved for public release',
      sensitivityLevel: 1,
      color: '#22C55E',
      lastModified: '23 Apr 2025, 04:03 PM',
      sublabels: [],
      isExpanded: false
    },
    {
      id: '2',
      name: 'Internal',
      description: 'Internal use only documents',
      tooltip: 'For internal company use only',
      sensitivityLevel: 2,
      color: '#3B82F6',
      lastModified: '23 Apr 2025, 04:03 PM',
      sublabels: [
        {
          id: '2-1',
          name: 'Internal - HR',
          description: 'HR-specific internal documents',
          tooltip: 'For HR department internal use',
          sensitivityLevel: 2,
          color: '#3B82F6',
          lastModified: '23 Apr 2025, 04:03 PM'
        }
      ],
      isExpanded: false
    },
    {
      id: '3',
      name: 'Confidential',
      description: 'Sensitive business information',
      tooltip: 'Contains sensitive business data',
      sensitivityLevel: 3,
      color: '#F97316',
      lastModified: '11 May 2025, 01:47 PM',
      sublabels: [],
      isExpanded: false
    },
    {
      id: '4',
      name: 'Restricted',
      description: 'Highly sensitive information',
      tooltip: 'Highly restricted access',
      sensitivityLevel: 4,
      color: '#EF4444',
      lastModified: '23 Apr 2025, 03:54 PM',
      sublabels: [],
      isExpanded: false
    }
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingSensitivity, setEditingSensitivity] = useState<string | null>(null);

  const visualMarkingTemplates = [
    'Company Confidential Banner',
    'External Use Warning',
    'Draft Watermark',
    'No Template'
  ];

  const protectionTypes = ['Watermark', 'Encryption', 'EDRM'];

  const protectionTemplates = {
    Watermark: ['Dynamic User Info', 'Static Company Logo', 'Confidential Diagonal'],
    Encryption: ['AES-256', 'RSA-2048', 'Standard Encryption'],
    EDRM: ['Full Control', 'View Only', 'Print Only']
  };

  const handleDragStart = (labelId: string) => {
    setDraggedItem(labelId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const reorderLabels = (items: ClassificationLabel[]): ClassificationLabel[] => {
      const draggedIndex = items.findIndex(item => item.id === draggedItem);
      const targetIndex = items.findIndex(item => item.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return items;

      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      
      return newItems;
    };

    setLabels(reorderLabels(labels));
    setDraggedItem(null);
  };

  const toggleExpand = (labelId: string) => {
    setLabels(labels.map(label => 
      label.id === labelId 
        ? { ...label, isExpanded: !label.isExpanded }
        : label
    ));
  };

  const addSublabel = (parentId: string) => {
    const newSublabel: ClassificationLabel = {
      id: `${parentId}-${Date.now()}`,
      name: 'New Sublabel',
      description: '',
      tooltip: '',
      sensitivityLevel: labels.find(l => l.id === parentId)?.sensitivityLevel || 1,
      color: labels.find(l => l.id === parentId)?.color || '#22C55E',
      lastModified: new Date().toLocaleString()
    };

    setLabels(labels.map(label =>
      label.id === parentId
        ? {
            ...label,
            sublabels: [...(label.sublabels || []), newSublabel],
            isExpanded: true
          }
        : label
    ));
  };

  const updateSensitivityLevel = (labelId: string, newLevel: number) => {
    setLabels(labels.map(label => {
      if (label.id === labelId) {
        return { ...label, sensitivityLevel: newLevel };
      }
      if (label.sublabels?.length) {
        return {
          ...label,
          sublabels: label.sublabels.map(sublabel =>
            sublabel.id === labelId
              ? { ...sublabel, sensitivityLevel: newLevel }
              : sublabel
          )
        };
      }
      return label;
    }));
    setEditingSensitivity(null);
  };

  const handleEditLabel = (label: ClassificationLabel) => {
    setEditingLabel({
      ...label,
      visualMarking: 'No Template',
      protections: []
    });
    setCurrentStep('name');
  };

  const addProtection = () => {
    if (!editingLabel) return;

    const newProtection: Protection = {
      id: `protection-${Date.now()}`,
      type: protectionTypes[0],
      template: protectionTemplates[protectionTypes[0] as keyof typeof protectionTemplates][0]
    };

    setEditingLabel({
      ...editingLabel,
      protections: [...editingLabel.protections, newProtection]
    });
  };

  const removeProtection = (protectionId: string) => {
    if (!editingLabel) return;

    setEditingLabel({
      ...editingLabel,
      protections: editingLabel.protections.filter(p => p.id !== protectionId)
    });
  };

  const updateProtection = (protectionId: string, updates: Partial<Protection>) => {
    if (!editingLabel) return;

    setEditingLabel({
      ...editingLabel,
      protections: editingLabel.protections.map(p => 
        p.id === protectionId
          ? { 
              ...p, 
              ...updates,
              template: updates.type 
                ? protectionTemplates[updates.type as keyof typeof protectionTemplates][0]
                : updates.template || p.template
            }
          : p
      )
    });
  };

  const renderLabelRow = (label: ClassificationLabel, isSubLabel = false) => (
    <>
      <tr 
        key={label.id}
        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
          draggedItem === label.id ? 'opacity-50' : ''
        }`}
        draggable
        onDragStart={() => handleDragStart(label.id)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(label.id)}
      >
        <td className="py-3 px-4">
          <div className={`flex items-center ${isSubLabel ? 'ml-8' : ''}`}>
            <GripVertical className="w-4 h-4 mr-2 text-slate-400 cursor-move" />
            {!isSubLabel && label.sublabels && label.sublabels.length > 0 && (
              <button 
                onClick={() => toggleExpand(label.id)}
                className="mr-2"
              >
                {label.isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}
            <span className="text-slate-800">{label.name}</span>
            {!isSubLabel && (
              <button
                onClick={() => addSublabel(label.id)}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
        <td className="py-3 px-4">
          {editingSensitivity === label.id ? (
            <input
              type="number"
              min="1"
              max="10"
              value={label.sensitivityLevel}
              onChange={(e) => updateSensitivityLevel(label.id, parseInt(e.target.value))}
              onBlur={() => setEditingSensitivity(null)}
              className="w-16 px-2 py-1 border rounded"
              autoFocus
            />
          ) : (
            <button 
              onClick={() => setEditingSensitivity(label.id)}
              className="flex items-center space-x-1"
            >
              <span>{label.sensitivityLevel}</span>
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: label.color }}
            />
            <span className="text-slate-600">
              {label.color === '#22C55E' ? 'Green' :
               label.color === '#3B82F6' ? 'Blue' :
               label.color === '#F97316' ? 'Orange' :
               label.color === '#EF4444' ? 'Red' : 'Custom'}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 text-slate-600">{label.lastModified}</td>
        <td className="py-3 px-4 text-right space-x-2">
          <button 
            onClick={() => handleEditLabel(label)}
            className="text-slate-600 hover:text-slate-900"
          >
            Edit
          </button>
          <button className="text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
      {label.isExpanded && label.sublabels?.map(sublabel => 
        renderLabelRow(sublabel, true)
      )}
    </>
  );

  const renderEditModal = () => {
    if (!editingLabel) return null;

    return (
      <Modal
        isOpen={!!editingLabel}
        onClose={() => setEditingLabel(null)}
        title="Edit Label"
        maxWidth="max-w-4xl"
      >
        <div className="flex">
          <div className="w-64 border-r border-slate-200 pr-6">
            <div className="space-y-4">
              <div 
                className={`p-3 rounded-lg ${
                  currentStep === 'name' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                Label Name
              </div>
              <div 
                className={`p-3 rounded-lg ${
                  currentStep === 'visual' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                Visual Marking
              </div>
              <div 
                className={`p-3 rounded-lg ${
                  currentStep === 'protection' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                Protection
              </div>
              <div 
                className={`p-3 rounded-lg ${
                  currentStep === 'email' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                Email Domain Restriction
              </div>
            </div>
          </div>

          <div className="flex-1 pl-8">
            {currentStep === 'name' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editingLabel.name}
                    onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingLabel.description}
                    onChange={(e) => setEditingLabel({ ...editingLabel, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tooltip *
                  </label>
                  <textarea
                    value={editingLabel.tooltip}
                    onChange={(e) => setEditingLabel({ ...editingLabel, tooltip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Color
                  </label>
                  <div className="flex space-x-4">
                    {['#22C55E', '#3B82F6', '#F97316', '#EF4444'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingLabel({ ...editingLabel, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingLabel.color === color ? 'border-blue-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'visual' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Visual Marking Template
                  </label>
                  <select
                    value={editingLabel.visualMarking}
                    onChange={(e) => setEditingLabel({ ...editingLabel, visualMarking: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    {visualMarkingTemplates.map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'protection' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-slate-800">Protection Layers</h4>
                  <button
                    onClick={addProtection}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Protection
                  </button>
                </div>

                {editingLabel.protections.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No protection layers added. Click "Add Protection" to start.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingLabel.protections.map((protection) => (
                      <div key={protection.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4 flex-1">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Protection Type
                              </label>
                              <select
                                value={protection.type}
                                onChange={(e) => updateProtection(protection.id, { type: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                              >
                                {protectionTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Template
                              </label>
                              <select
                                value={protection.template}
                                onChange={(e) => updateProtection(protection.id, { template: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                              >
                                {protectionTemplates[protection.type as keyof typeof protectionTemplates].map(template => (
                                  <option key={template} value={template}>{template}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={() => removeProtection(protection.id)}
                            className="ml-4 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 'email' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-600">
                    Email domain restriction settings will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t mt-6 pt-6 flex justify-between">
          <button
            onClick={() => {
              if (currentStep === 'visual') setCurrentStep('name');
              if (currentStep === 'protection') setCurrentStep('visual');
              if (currentStep === 'email') setCurrentStep('protection');
            }}
            className={`px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 ${
              currentStep === 'name' ? 'invisible' : ''
            }`}
          >
            Previous
          </button>
          <div className="space-x-3">
            <button
              onClick={() => setEditingLabel(null)}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (currentStep === 'name') setCurrentStep('visual');
                else if (currentStep === 'visual') setCurrentStep('protection');
                else if (currentStep === 'protection') setCurrentStep('email');
                else {
                  // Save changes
                  setLabels(labels.map(label =>
                    label.id === editingLabel.id ? {
                      ...label,
                      name: editingLabel.name,
                      description: editingLabel.description,
                      tooltip: editingLabel.tooltip,
                      color: editingLabel.color,
                      lastModified: new Date().toLocaleString()
                    } : label
                  ));
                  setEditingLabel(null);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentStep === 'email' ? 'Save Changes' : 'Next'}
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Classification Labels</h2>
        <p className="text-slate-500 mt-2">
          Define and manage classification labels for documents and data.
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-slate-600">
            Classification labels are used to classify email messages and documents. 
            When a label is applied, the content will be protected based on the configured settings.
          </p>
          <button className="text-blue-600 hover:text-blue-800 text-sm mt-2">
            Learn more
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={() => {
            setEditingLabel({
              id: `label-${Date.now()}`,
              name: '',
              description: '',
              tooltip: '',
              sensitivityLevel: 1,
              color: '#22C55E',
              lastModified: new Date().toLocaleString(),
              visualMarking: 'No Template',
              protections: []
            });
            setCurrentStep('name');
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Label
        </button>
        <button className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Label Settings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                Sensitivity level
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Color</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                Last modified on
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labels.map(label => renderLabelRow(label))}
          </tbody>
        </table>
      </div>

      {editingLabel && renderEditModal()}
    </div>
  );
};

export default Classification;