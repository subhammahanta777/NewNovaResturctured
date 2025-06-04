import React, { useState } from 'react';
import { Plus, Info, ChevronDown, ChevronRight, Settings2, Trash2, GripVertical, X } from 'lucide-react';

interface ClassificationLabel {
  id: string;
  name: string;
  sensitivityLevel: number;
  color: string;
  lastModified: string;
  description?: string;
  tooltip?: string;
  sublabels?: ClassificationLabel[];
  isExpanded?: boolean;
}

interface LabelFormData {
  name: string;
  description: string;
  tooltip: string;
  color: string;
  visualMarking: boolean;
  protection: boolean;
  emailRestriction: boolean;
}

const Classification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('labels');
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LabelFormData>({
    name: '',
    description: '',
    tooltip: '',
    color: '#22C55E',
    visualMarking: false,
    protection: false,
    emailRestriction: false
  });

  const [labels, setLabels] = useState<ClassificationLabel[]>([
    {
      id: '1',
      name: 'Public',
      sensitivityLevel: 1,
      color: '#22C55E',
      lastModified: '23 Apr 2025, 04:03 PM',
      description: 'Business data that poses no risk to the organization',
      tooltip: 'This label applies to information approved for public release',
      sublabels: [],
      isExpanded: false
    },
    {
      id: '2',
      name: 'Internal',
      sensitivityLevel: 2,
      color: '#3B82F6',
      lastModified: '23 Apr 2025, 04:03 PM',
      sublabels: [
        {
          id: '2-1',
          name: 'Internal - HR',
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
      sensitivityLevel: 3,
      color: '#F97316',
      lastModified: '11 May 2025, 01:47 PM',
      sublabels: [],
      isExpanded: false
    },
    {
      id: '4',
      name: 'Restricted',
      sensitivityLevel: 4,
      color: '#EF4444',
      lastModified: '23 Apr 2025, 03:54 PM',
      sublabels: [],
      isExpanded: false
    }
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingSensitivity, setEditingSensitivity] = useState<string | null>(null);

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
      sensitivityLevel: labels.find(l => l.id === parentId)?.sensitivityLevel || 1,
      color: labels.find(l => l.id === parentId)?.color || '#22C55E',
      lastModified: new Date().toLocaleString(),
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
              <Settings2 className="w-4 h-4 text-slate-400" />
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
        <td className="py-3 px-4 text-right">
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

  const renderLabelCreationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Create New Label</h3>
              <p className="text-sm text-slate-500 mt-1">
                Set up your classification label properties
              </p>
            </div>
            <button 
              onClick={() => setIsCreatingLabel(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex mb-8">
            <div className="w-64 border-r border-slate-200 pr-6">
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${currentStep === 1 ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                  Label Name
                </div>
                <div className={`p-3 rounded-lg ${currentStep === 2 ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                  Visual Marking
                </div>
                <div className={`p-3 rounded-lg ${currentStep === 3 ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                  Protection
                </div>
                <div className={`p-3 rounded-lg ${currentStep === 4 ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                  Email Domain Restriction
                </div>
                <div className={`p-3 rounded-lg ${currentStep === 5 ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                  Review and Save
                </div>
              </div>
            </div>

            <div className="flex-1 pl-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      placeholder="Enter label name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      rows={3}
                      placeholder="Business data that poses no risk to the organization..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tooltip *
                    </label>
                    <textarea
                      value={formData.tooltip}
                      onChange={(e) => setFormData({ ...formData, tooltip: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      rows={2}
                      placeholder="This label applies to information which has been explicitly approved..."
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
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-blue-500' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add other steps here */}
            </div>
          </div>

          <div className="border-t pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className={`px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              Previous
            </button>
            <div className="space-x-3">
              <button
                onClick={() => setIsCreatingLabel(false)}
                className="px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!formData.name || !formData.tooltip}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Handle save
                    setIsCreatingLabel(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Label
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Classification Policies</h2>
        <p className="text-slate-500 mt-2">
          Define and manage classification labels for documents and data.
        </p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {['Overview', 'Labels', 'Content Policies', 'Publishing Policies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`py-4 px-1 relative ${
                activeTab === tab.toLowerCase()
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg flex items-start space-x-3">
        <Info className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-slate-600">
            Seclore classification labels are used to classify email messages and documents. 
            When a label is applied by the user, the email message or the document will get 
            classified and protected based on the settings you choose. For example, you can create 
            labels that add visual markings, protection policies, email domain restrictions, or 
            create exception policies for specific users.
          </p>
          <button className="text-blue-600 hover:text-blue-800 text-sm mt-2">
            Learn more
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={() => setIsCreatingLabel(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Label
        </button>
        <button className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
          <Settings2 className="w-4 h-4 mr-2" />
          Label Exceptions
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
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Delete</th>
            </tr>
          </thead>
          <tbody>
            {labels.map(label => renderLabelRow(label))}
          </tbody>
        </table>
      </div>

      {isCreatingLabel && renderLabelCreationModal()}
    </div>
  );
};

export default Classification;