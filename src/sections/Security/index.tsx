import React, { useState } from "react";
import { Search, Filter, Plus, Calendar, Tag, X, ArrowLeft, Trash2 } from "lucide-react";
import { Rule } from "../../types";

interface TriggerCondition {
  field: string;
  operator: string;
  value: string;
  conjunction?: 'AND' | 'OR';
}

interface EditRuleForm {
  name: string;
  description: string;
  trigger: string;
  classification: string;
  conditions: TriggerCondition[];
}

const Security: React.FC = () => {
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
    conditions: []
  });

  const triggerTypes = [
    { value: "content_type", label: "Content Type" },
    { value: "location", label: "Location" },
    { value: "filename", label: "File Name Pattern" },
    { value: "extension", label: "File Extension" },
    { value: "folderpath", label: "Folder Path" },
    { value: "creator", label: "Created By" }
  ];

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" }
  ];

  const classificationLabels = [
    "Public",
    "Internal",
    "Confidential",
    "Restricted"
  ];

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" }
  ];

  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      name: "Network Folder Classification",
      trigger: "Content Type contains PII AND Location equals sharepoint",
      action: "Classification: Restricted",
      status: "live",
      lastModified: "2024-03-20",
      classification: "Restricted",
      description: "Network folder with the path \\\\seclore-fs1\\Seclore\\Shared\\Protected Files"
    },
    {
      id: "2",
      name: "SharePoint Document Classification",
      trigger: "File created in SharePoint",
      action: "Classification: Internal",
      status: "live",
      lastModified: "2024-03-19",
      classification: "Internal",
      description: "Set default classification for SharePoint documents"
    },
    {
      id: "3",
      name: "CAD Files Protection",
      trigger: "File extension is .dwg",
      action: "Classification: Confidential",
      status: "live",
      lastModified: "2024-03-18",
      classification: "Confidential",
      description: "Protect CAD drawings with Confidential classification"
    },
    {
      id: "4",
      name: "Default File Classification",
      trigger: "Any Office or PDF created by Seclore Users",
      action: "Classification: Internal",
      status: "live",
      lastModified: "2024-03-20",
      classification: "Internal",
      description: "Any Office or PDF created by Seclore Users"
    },
    {
      id: "5",
      name: "Default Email Classification",
      trigger: "All emails sent from @seclore.com",
      action: "Classification: Internal",
      status: "live",
      lastModified: "2024-03-20",
      classification: "Internal",
      description: "All emails sent from @seclore.com"
    }
  ]);

  const handleEditRule = (rule: Rule) => {
    setEditingRule({
      name: rule.name,
      description: rule.description || "",
      trigger: rule.trigger,
      classification: rule.classification || "Internal",
      conditions: []
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

  const handleSaveRule = () => {
    const triggerString = editingRule.conditions
      .map((condition, index) => {
        const fieldLabel = triggerTypes.find(t => t.value === condition.field)?.label;
        const operatorLabel = operators.find(o => o.value === condition.operator)?.label;
        const part = `${fieldLabel} ${operatorLabel?.toLowerCase()} ${condition.value}`;
        return index === 0 ? part : `${condition.conjunction} ${part}`;
      })
      .join(" ");

    if (isCreating) {
      const newRule: Rule = {
        id: `rule-${Date.now()}`,
        name: editingRule.name,
        description: editingRule.description,
        trigger: triggerString,
        action: `Classification: ${editingRule.classification}`,
        status: "live",
        lastModified: new Date().toLocaleDateString(),
        classification: editingRule.classification
      };
      setRules([...rules, newRule]);
    } else {
      setRules(rules.map(rule => 
        rule.name === editingRule.name
          ? {
              ...rule,
              name: editingRule.name,
              description: editingRule.description,
              trigger: triggerString,
              action: `Classification: ${editingRule.classification}`,
              classification: editingRule.classification,
              lastModified: new Date().toLocaleDateString()
            }
          : rule
      ));
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTrigger = !filterTrigger || rule.trigger.toLowerCase().includes(filterTrigger.toLowerCase());
    const matchesClassification = !filterClassification || rule.classification === filterClassification;
    
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

    return matchesSearch && matchesTrigger && matchesClassification && matchesDate;
  });

  const renderEditForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {isCreating ? "Create New Rule" : "Edit Rule"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Define classification rule based on metadata
              </p>
            </div>
            <button 
              onClick={() => {
                setIsEditing(false);
                setIsCreating(false);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Classification *
              </label>
              <select
                value={editingRule.classification}
                onChange={(e) => setEditingRule({ ...editingRule, classification: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
              >
                {classificationLabels.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
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
              onClick={handleSaveRule}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!editingRule.name || editingRule.conditions.length === 0}
            >
              {isCreating ? "Create Rule" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Security & Compliance Rules</h2>
          <p className="text-slate-500 mt-2">
            Define automated classification rules based on file metadata and system context.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRule({
              name: "",
              description: "",
              trigger: "",
              classification: "Internal",
              conditions: []
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
              <option value="">All Classifications</option>
              {classificationLabels.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
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
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Classification Label</th>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.classification === 'Public' ? 'bg-green-100 text-green-800' :
                    rule.classification === 'Internal' ? 'bg-blue-100 text-blue-800' :
                    rule.classification === 'Confidential' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rule.classification}
                  </span>
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

export default Security;