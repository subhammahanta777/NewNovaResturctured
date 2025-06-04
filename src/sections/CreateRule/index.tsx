import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { createRuleSchema, type CreateRuleFormData } from "../../lib/validations/createRule";
import { useToast } from "../../hooks/useToast";

interface CreateRuleProps {
  onSave: (rule: { name: string; trigger: string; action: string }) => void;
  onCancel: () => void;
}

const CreateRule: React.FC<CreateRuleProps> = ({ onSave, onCancel }) => {
  const { showSuccess, showError } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateRuleFormData>({
    name: "",
    triggerType: "",
    actionType: ""
  });

  const validateForm = (): boolean => {
    try {
      const result = createRuleSchema.safeParse(formData);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          errors[issue.path[0]] = issue.message;
        });
        setValidationErrors(errors);
        return false;
      }
      setValidationErrors({});
      return true;
    } catch (error) {
      showError('Validation failed');
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleSave = () => {
    try {
      if (!validateForm()) {
        showError('Please fix validation errors before saving');
        return;
      }

      onSave({
        name: formData.name,
        trigger: getTriggerDescription(formData.triggerType),
        action: getActionDescription(formData.actionType)
      });

      showSuccess('Rule created successfully');
    } catch (error) {
      showError('Failed to create rule');
      console.error('Error creating rule:', error);
    }
  };

  const getTriggerDescription = (trigger: string) => {
    switch (trigger) {
      case "file_shared":
        return "Event = File Shared";
      case "file_modified":
        return "Event = File Modified";
      case "classification_change":
        return "Event = Classification Changed";
      default:
        return trigger;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case "encrypt":
        return "Apply Encryption";
      case "tag":
        return "Add Tag";
      case "watermark":
        return "Add Watermark";
      default:
        return action;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      <button 
        onClick={onCancel}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Rules
      </button>
      
      <h2 className="text-3xl font-bold text-slate-800">Create New Orchestration Rule</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="rule-name" className="block text-sm font-medium text-slate-700">
            Rule Name
          </label>
          <input
            id="rule-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter a descriptive name for this rule"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.name ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="trigger-event" className="block text-sm font-medium text-slate-700">
            Trigger Event
          </label>
          <select
            id="trigger-event"
            value={formData.triggerType}
            onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.triggerType ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select a trigger event</option>
            <option value="file_shared">File Shared</option>
            <option value="file_modified">File Modified</option>
            <option value="classification_change">Classification Changed</option>
          </select>
          {validationErrors.triggerType && (
            <p className="text-sm text-red-500">{validationErrors.triggerType}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="protection-action" className="block text-sm font-medium text-slate-700">
            Protection Action
          </label>
          <select
            id="protection-action"
            value={formData.actionType}
            onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.actionType ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select a protection action</option>
            <option value="encrypt">Encrypt</option>
            <option value="tag">Add Tag</option>
            <option value="watermark">Add Watermark</option>
          </select>
          {validationErrors.actionType && (
            <p className="text-sm text-red-500">{validationErrors.actionType}</p>
          )}
        </div>
        
        <div className="pt-4 flex space-x-3">
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.triggerType || !formData.actionType}
            className={`px-4 py-2 rounded-md text-white bg-blue-600 transition-colors ${
              !formData.name || !formData.triggerType || !formData.actionType
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            Save Rule
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRule;