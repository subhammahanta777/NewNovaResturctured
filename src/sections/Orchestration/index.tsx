import React, { useState } from "react";
import { Search, Filter, Plus, Calendar, Tag, X, ArrowLeft, Trash2 } from "lucide-react";
import { Rule } from "../../types";
import Modal from "../ui/Modal";

interface TriggerCondition {
  field: string;
  operator: string;
  value: string;
  conjunction?: 'AND' | 'OR';
}

interface ProtectionAction {
  type: string;
  template: string;
}

interface EditRuleForm {
  name: string;
  description: string;
  trigger: string;
  classification: string;
  conditions: TriggerCondition[];
  protectionActions: ProtectionAction[];
}

const Orchestration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrigger, setFilterTrigger] = useState<string>("");
  const [filterClassification, setFilterClassification] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<EditRuleForm>({
    name: "",
    description: "",
    trigger: "",
    classification: "Internal",
    conditions: [],
    protectionActions: []
  });

  const triggerTypes = [
    { value: "filename", label: "File Name" },
    { value: "extension", label: "File Extension" },
    { value: "modified_date", label: "Modified Date" },
    { value: "created_by", label: "Created By" },
    { value: "folder_path", label: "Folder Path" }
  ];

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "older_than", label: "Older Than" },
    { value: "in", label: "In" },
    { value: "is", label: "Is" }
  ];

  const protectionTypes = [
    "Persistent Encryption",
    "Visual Marking",
    "Watermark",
    "EDRM Protection",
    "Tagging",
    "Classify"
  ];

  const protectionTemplates = {
    "Persistent Encryption": [
      "AES-256 Encryption",
      "Standard Encryption",
      "High Security Encryption"
    ],
    "Visual Marking": [
      "Company Confidential Banner",
      "External Use Warning",
      "Draft Watermark"
    ],
    "Watermark": [
      "Dynamic User Info",
      "Static Company Logo",
      "Confidential Diagonal"
    ],
    "EDRM Protection": [
      "Full DRM Policy",
      "View Only",
      "Print Only"
    ],
    "Tagging": [
      "PII Tag",
      "Financial Tag",
      "Legal Tag"
    ],
    "Classify": [
      "Public",
      "Internal",
      "Confidential",
      "Restricted"
    ]
  };

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" }
  ];

  const [rules] = useState<Rule[]>([
    {
      id: "1",
      name: "Contract Files",
      description: "File name contains *contract* OR File name contains *nda*",
      trigger: "File Name contains *contract* OR File Name contains *nda*",
      action: "Persistent Encryption, Visual Marking, Watermark",
      status: "live",
      lastModified: "2024-03-20",
      location: "Endpoint, Email, Sharepoint"
    },
    {
      id: "2",
      name: "PDF Files in SharePoint HR",
      description: "File extension is .pdf AND Folder Path is /SharePoint/HR/",
      trigger: "File Extension is .pdf AND Folder Path is /SharePoint/HR/",
      action: "EDRM Protection, Tagging",
      status: "live",
      lastModified: "2024-03-19",
      location: "Sharepoint"
    },
    {
      id: "3",
      name: "CAD Files",
      description: "File Extension is .pdf AND File Extension in .dwg, .dxf, .dwt, .s",
      trigger: "File Extension is .pdf AND File Extension in .dwg, .dxf, .dwt, .s",
      action: "EDRM Protection, Watermark, Visual Marking, Tagging",
      status: "live",
      lastModified: "2024-03-18",
      location: "Sharepoint, Email"
    },
    {
      id: "4",
      name: "Old Files",
      description: "Modified date older than 5 Years",
      trigger: "Modified date older than 5 Years",
      action: "Tagging",
      status: "live",
      lastModified: "2024-03-20",
      location: "Sharepoint, Endpc"
    },
    {
      id: "5",
      name: "PMG Group Files",
      description: "Created by in pmg@seclore.com",
      trigger: "Created by in pmg@seclore.com",
      action: "Classify",
      status: "live",
      lastModified: "2024-03-20",
      location: "Sharepoint"
    }
  ]);

  const handleEditRule = (rule: Rule) => {
    setEditingRule({
      name: rule.name,
      description: rule.description || "",
      trigger: rule.trigger,
      classification: "Internal",
      conditions: [],
      protectionActions: []
    });
    setIsEditing(true);
  };

  const handleAddCondition = () => {
    setEditingRule({
      ...editingRule,
      conditions: [
        ...editingRule.conditions,
        {
          field: triggerTypes[0].value,
          operator: operators[0].value,
          value: "",
          conjunction: editingRule.conditions.length > 0 ? 'AND' : undefined
        }
      ]
    });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...editingRule.conditions];
    newConditions.splice(index, 1);
    setEditingRule({
      ...editingRule,
      conditions: newConditions
    });
  };

  const handleUpdateCondition = (index: number, updates: Partial<TriggerCondition>) => {
    const newConditions = [...editingRule.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setEditingRule({
      ...editingRule,
      conditions: newConditions
    });
  };

  const handleAddProtection = () => {
    const firstType = protectionTypes[0];
    setEditingRule({
      ...editingRule,
      protectionActions: [
        ...editingRule.protectionActions,
        {
          type: firstType,
          template: protectionTemplates[firstType as keyof typeof protectionTemplates][0]
        }
      ]
    });
  };

  const handleRemoveProtection = (index: number) => {
    const newProtections = [...editingRule.protectionActions];
    newProtections.splice(index, 1);
    setEditingRule({
      ...editingRule,
      protectionActions: newProtections
    });
  };

  const handleUpdateProtection = (index: number, updates: Partial<ProtectionAction>) => {
    const newProtections = [...editingRule.protectionActions];
    newProtections[index] = { 
      ...newProtections[index], 
      ...updates,
      template: updates.type 
        ? protectionTemplates[updates.type as keyof typeof protectionTemplates][0]
        : updates.template || newProtections[index].template
    };
    setEditingRule({
      ...editingRule,
      protectionActions: newProtections
    });
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrigger = !filterTrigger || rule.trigger.toLowerCase().includes(filterTrigger.toLowerCase());
    const matchesLocation = !filterClassification || rule.location?.includes(filterClassification);
    
    let matchesDate = true;
    if (filterDate) {
      const ruleDate = new Date(rule.lastModified);
      const now = new Date();
      
      switch (filterDate) {
        case 'today':
          matchesDate = ruleDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = ruleDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesDate = ruleDate >= monthAgo;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
          matchesDate = ruleDate >= quarterAgo;
          break;
      }
    }

    return matchesSearch && matchesTrigger && matchesLocation && matchesDate;
  });

  const renderEditForm = () => (
    <Modal
      isOpen={isEditing}
      onClose={() => {
        setIsEditing(false);
        setIsCreating(false);
      }}
      title={isCreating ? "Create New Rule" : "Edit Rule"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Rule Name *
          </label>
          <input
            type="text"
            value={editingRule.name}
            onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={editingRule.description}
            onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Trigger Conditions *
            </label>
            <button
              onClick={handleAddCondition}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Condition
            </button>
          </div>
          
          <div className="space-y-4">
            {editingRule.conditions.map((condition, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={condition.field}
                    onChange={(e) => handleUpdateCondition(index, { field: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-md"
                  >
                    {triggerTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => handleUpdateCondition(index, { operator: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-md"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => handleUpdateCondition(index, { value: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md"
                      placeholder="Enter value..."
                    />
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {index < editingRule.conditions.length - 1 && (
                  <select
                    value={condition.conjunction}
                    onChange={(e) => handleUpdateCondition(index, { 
                      conjunction: e.target.value as 'AND' | 'OR' 
                    })}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
              </div>
            ))}
            
            {editingRule.conditions.length === 0 && (
              <div className="text-center py-4 text-slate-500 bg-slate-50 rounded-md">
                No conditions added. Click "Add Condition" to start.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Protection Actions *
            </label>
            <button
              onClick={handleAddProtection}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Protection
            </button>
          </div>
          
          <div className="space-y-4">
            {editingRule.protectionActions.map((protection, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Protection Type
                      </label>
                      <select
                        value={protection.type}
                        onChange={(e) => handleUpdateProtection(index, { type: e.target.value })}
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
                        onChange={(e) => handleUpdateProtection(index, { template: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      >
                        {protectionTemplates[protection.type as keyof typeof protectionTemplates].map(template => (
                          <option key={template} value={template}>{template}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProtection(index)}
                    className="ml-4 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {editingRule.protectionActions.length === 0 && (
              <div className="text-center py-4 text-slate-500 bg-slate-50 rounded-md">
                No protection actions added. Click "Add Protection" to start.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!editingRule.name || editingRule.conditions.length === 0}
          >
            {isCreating ? "Create Rule" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Business Rules</h2>
          <p className="text-slate-500 mt-2">
            Define automated business rules based on file metadata and system context.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRule({
              name: "",
              description: "",
              trigger: "",
              classification: "Internal",
              conditions: [],
              protectionActions: []
            });
            setIsCreating(true);
            setIsEditing(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="space-y-4 mb-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md"
              />
            </div>
            
            <select
              value={filterTrigger}
              onChange={(e) => setFilterTrigger(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">All Triggers</option>
              {triggerTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">All Locations</option>
              <option value="Endpoint">Endpoint</option>
              <option value="Email">Email</option>
              <option value="Sharepoint">SharePoint</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="">All Dates</option>
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rules Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Trigger Condition</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Protection Actions</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Modified</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => (
              <tr key={rule.id} className="border-b border-slate-100">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-slate-800">{rule.name}</p>
                    <p className="text-sm text-slate-500">{rule.description}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-2">
                    {rule.action.split(", ").map((action, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {action}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  {new Date(rule.lastModified).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <button 
                    onClick={() => handleEditRule(rule)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && renderEditForm()}
    </div>
  );
};

export default Orchestration;