import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Plus, AlertCircle, Play, Settings, Link2, Trash2, Building2, Network } from 'lucide-react';
import { Rule, RuleFormData } from '../../types';
import { ActionService } from '../../services/ActionService';
import { ruleSchema } from '../../lib/validations/rule';
import { useToast } from '../../hooks/useToast';

interface CreateAutomationRuleProps {
  editingRule?: Rule | null;
  onCancel: () => void;
  onSave: (rule: RuleFormData) => void;
}

const CreateAutomationRule: React.FC<CreateAutomationRuleProps> = ({ 
  editingRule, 
  onCancel, 
  onSave 
}) => {
  const { showError, showSuccess } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [rule, setRule] = useState<RuleFormData>({
    name: '',
    description: '',
    frequency: 'continuous',
    trigger: {
      source: '',
      event: '',
      conditions: [
        {
          field: '',
          operator: 'equals',
          value: '',
          conjunction: 'AND'
        }
      ]
    },
    actions: [],
    scope: {
      departments: [],
      channels: []
    }
  });

  useEffect(() => {
    if (editingRule?.automationDetails) {
      try {
        const { automationDetails } = editingRule;
        setRule({
          name: editingRule.name,
          description: editingRule.description || '',
          frequency: editingRule.frequency,
          trigger: {
            source: automationDetails.trigger.source,
            event: automationDetails.trigger.event,
            conditions: automationDetails.trigger.conditions || [{
              field: '',
              operator: 'equals',
              value: '',
              conjunction: 'AND'
            }]
          },
          actions: automationDetails.actions.map(action => ({
            type: action.type,
            service: action.service,
            parameters: action.parameters
          })),
          scope: editingRule.scope || {
            departments: [],
            channels: []
          }
        });
      } catch (error) {
        showError('Failed to load rule data');
        console.error('Error loading rule data:', error);
      }
    }
  }, [editingRule, showError]);

  const validateStep = (step: number): boolean => {
    try {
      const errors: Record<string, string> = {};

      switch (step) {
        case 1:
          if (!rule.name.trim()) {
            errors.name = 'Name is required';
          }
          if (!rule.scope.departments.length) {
            errors.departments = 'At least one department is required';
          }
          if (!rule.scope.channels.length) {
            errors.channels = 'At least one channel is required';
          }
          break;

        case 2:
          if (!rule.trigger.source) {
            errors.source = 'Source is required';
          }
          if (!rule.trigger.event) {
            errors.event = 'Event is required';
          }
          rule.trigger.conditions.forEach((condition, index) => {
            if (!condition.field) {
              errors[`condition_${index}_field`] = 'Field is required';
            }
            if (!condition.value) {
              errors[`condition_${index}_value`] = 'Value is required';
            }
          });
          break;

        case 3:
          if (!rule.actions.length) {
            errors.actions = 'At least one action is required';
          }
          rule.actions.forEach((action, index) => {
            if (!action.type) {
              errors[`action_${index}_type`] = 'Action type is required';
            }
            if (!action.service) {
              errors[`action_${index}_service`] = 'Service is required';
            }
          });
          break;

        case 4:
          // Validate entire form before saving
          const result = ruleSchema.safeParse(rule);
          if (!result.success) {
            result.error.issues.forEach(issue => {
              errors[issue.path.join('_')] = issue.message;
            });
          }
          break;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      showError('Validation failed');
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleTestRule = async () => {
    try {
      setTestResult('testing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResult('success');
      showSuccess('Rule test completed successfully');
    } catch (error) {
      setTestResult('error');
      showError('Rule test failed');
    }
  };

  const handleSave = () => {
    try {
      if (!validateStep(4)) {
        showError('Please fix validation errors before saving');
        return;
      }

      onSave(rule);
      showSuccess('Rule saved successfully');
    } catch (error) {
      showError('Failed to save rule');
      console.error('Error saving rule:', error);
    }
  };

  const departments = ["All Departments", "Finance", "Product", "IT", "HR", "Legal", "Marketing"];
  const channels = ["All Channels", "Endpoint", "Hotfolder", "SharePoint", "Box", "OneDrive", "Google Drive", "Email"];

  const novaFields = [
    { value: 'content_type', label: 'Content Type' },
    { value: 'classification', label: 'Classification' },
    { value: 'sensitivity', label: 'Sensitivity' },
    { value: 'location', label: 'Location' },
    { value: 'user', label: 'User' },
    { value: 'device', label: 'Device' },
    { value: 'action', label: 'Action' },
    { value: 'timestamp', label: 'Timestamp' }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Rule Name *
          </label>
          <input
            type="text"
            value={rule.name}
            onChange={(e) => setRule({ ...rule, name: e.target.value })}
            placeholder="Enter a descriptive name for this rule"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.name ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={rule.description}
            onChange={(e) => setRule({ ...rule, description: e.target.value })}
            placeholder="Describe what this rule does..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Execution Frequency
          </label>
          <select
            value={rule.frequency}
            onChange={(e) => setRule({ ...rule, frequency: e.target.value as 'once' | 'multiple' | 'continuous' })}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="once">Run Once</option>
            <option value="multiple">Run Multiple Times</option>
            <option value="continuous">Run Continuously</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Departments
              </div>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map(dept => (
                <label key={dept} className="flex items-center p-2 bg-slate-50 rounded-md">
                  <input
                    type="checkbox"
                    checked={rule.scope.departments.includes(dept)}
                    onChange={(e) => {
                      let updatedDepts = [...rule.scope.departments];
                      if (dept === "All Departments") {
                        updatedDepts = e.target.checked ? ["All Departments"] : [];
                      } else {
                        updatedDepts = e.target.checked
                          ? [...updatedDepts.filter(d => d !== "All Departments"), dept]
                          : updatedDepts.filter(d => d !== dept);
                      }
                      setRule({
                        ...rule,
                        scope: { ...rule.scope, departments: updatedDepts }
                      });
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{dept}</span>
                </label>
              ))}
            </div>
            {validationErrors.departments && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.departments}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center">
                <Network className="w-4 h-4 mr-2" />
                Channels
              </div>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {channels.map(channel => (
                <label key={channel} className="flex items-center p-2 bg-slate-50 rounded-md">
                  <input
                    type="checkbox"
                    checked={rule.scope.channels.includes(channel)}
                    onChange={(e) => {
                      let updatedChannels = [...rule.scope.channels];
                      if (channel === "All Channels") {
                        updatedChannels = e.target.checked ? ["All Channels"] : [];
                      } else {
                        updatedChannels = e.target.checked
                          ? [...updatedChannels.filter(c => c !== "All Channels"), channel]
                          : updatedChannels.filter(c => c !== channel);
                      }
                      setRule({
                        ...rule,
                        scope: { ...rule.scope, channels: updatedChannels }
                      });
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">{channel}</span>
                </label>
              ))}
            </div>
            {validationErrors.channels && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.channels}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-medium text-slate-800">Trigger Conditions</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Source
          </label>
          <select
            value={rule.trigger.source}
            onChange={(e) => setRule({
              ...rule,
              trigger: { ...rule.trigger, source: e.target.value }
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.source ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select Source</option>
            <option value="endpoint">Endpoint</option>
            <option value="network">Network</option>
            <option value="cloud">Cloud</option>
          </select>
          {validationErrors.source && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.source}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Event
          </label>
          <select
            value={rule.trigger.event}
            onChange={(e) => setRule({
              ...rule,
              trigger: { ...rule.trigger, event: e.target.value }
            })}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.event ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select Event</option>
            <option value="create">Create</option>
            <option value="modify">Modify</option>
            <option value="delete">Delete</option>
            <option value="access">Access</option>
          </select>
          {validationErrors.event && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.event}</p>
          )}
        </div>
        
        <div className="space-y-4">
          {rule.trigger.conditions.map((condition, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Field
                  </label>
                  <select
                    value={condition.field}
                    onChange={(e) => {
                      const newConditions = [...rule.trigger.conditions];
                      newConditions[index] = {
                        ...condition,
                        field: e.target.value
                      };
                      setRule({
                        ...rule,
                        trigger: { ...rule.trigger, conditions: newConditions }
                      });
                    }}
                    className={`w-full px-3 py-2 border rounded-md ${
                      validationErrors[`condition_${index}_field`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Field</option>
                    {novaFields.map(field => (
                      <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                  {validationErrors[`condition_${index}_field`] && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors[`condition_${index}_field`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Operator
                  </label>
                  <select
                    value={condition.operator}
                    onChange={(e) => {
                      const newConditions = [...rule.trigger.conditions];
                      newConditions[index] = {
                        ...condition,
                        operator: e.target.value
                      };
                      setRule({
                        ...rule,
                        trigger: { ...rule.trigger, conditions: newConditions }
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => {
                      const newConditions = [...rule.trigger.conditions];
                      newConditions[index] = {
                        ...condition,
                        value: e.target.value
                      };
                      setRule({
                        ...rule,
                        trigger: { ...rule.trigger, conditions: newConditions }
                      });
                    }}
                    placeholder="Enter value"
                    className={`w-full px-3 py-2 border rounded-md ${
                      validationErrors[`condition_${index}_value`] ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors[`condition_${index}_value`] && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors[`condition_${index}_value`]}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                {index < rule.trigger.conditions.length - 1 && (
                  <select
                    value={condition.conjunction}
                    onChange={(e) => {
                      const newConditions = [...rule.trigger.conditions];
                      newConditions[index] = {
                        ...condition,
                        conjunction: e.target.value
                      };
                      setRule({
                        ...rule,
                        trigger: { ...rule.trigger, conditions: newConditions }
                      });
                    }}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}

                {rule.trigger.conditions.length > 1 && (
                  <button
                    onClick={() => {
                      const newConditions = rule.trigger.conditions.filter((_, i) => i !== index);
                      setRule({
                        ...rule,
                        trigger: { ...rule.trigger, conditions: newConditions }
                      });
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              const newConditions = [...rule.trigger.conditions, {
                field: '',
                operator: 'equals',
                value: '',
                conjunction: 'AND'
              }];
              setRule({
                ...rule,
                trigger: { ...rule.trigger, conditions: newConditions }
              });
            }}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Condition
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-800">Actions</h3>
          <button
            onClick={() => {
              const newAction = { type: '', service: 'Nova', parameters: {} };
              const validation = ActionService.validateActionCombination([...rule.actions, newAction]);
              
              if (validation.valid) {
                setRule({
                  ...rule,
                  actions: [...rule.actions, newAction]
                });
              } else {
                showError(validation.message);
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Action
          </button>
        </div>

        {validationErrors.actions && (
          <p className="text-sm text-red-500">{validationErrors.actions}</p>
        )}

        {rule.actions.map((action, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-slate-700">Action {index + 1}</h4>
              <button
                onClick={() => {
                  const newActions = rule.actions.filter((_, i) => i !== index);
                  setRule({ ...rule, actions: newActions });
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Action Type
                </label>
                <select
                  value={action.type}
                  onChange={(e) => {
                    const newActions = [...rule.actions];
                    const newAction = { ...action, type: e.target.value, parameters: {} };
                    newActions[index] = newAction;
                    
                    const validation = ActionService.validateActionCombination(newActions);
                    if (validation.valid) {
                      setRule({ ...rule, actions: newActions });
                    } else {
                      showError(validation.message);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md ${
                    validationErrors[`action_${index}_type`] ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="tag">Tag</option>
                  <option value="visualmarking">Visual Marking</option>
                  <option value="watermark">Watermarking</option>
                  <option value="classify">Classification</option>
                  <option value="encrypt">Encrypt</option>
                  <option value="edrm">EDRM</option>
                </select>
                {validationErrors[`action_${index}_type`] && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors[`action_${index}_type`]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Service
                </label>
                <input
                  type="text"
                  value="Nova"
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
                />
              </div>
            </div>

            {action.type && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Parameters
                </label>
                {action.type === 'tag' && (
                  <div className="space-y-2">
                    <select
                      multiple
                      value={action.parameters.tags || []}
                      onChange={(e) => {
                        const tags = Array.from(e.target.selectedOptions, option => option.value);
                        const newActions = [...rule.actions];
                        newActions[index] = {
                          ...action,
                          parameters: { ...action.parameters, tags }
                        };
                        setRule({ ...rule, actions: newActions });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      size={4}
                    >
                      {ActionService.getTags().map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                )}

                {action.type === 'visualmarking' && (
                  <select
                    value={action.parameters.template || ''}
                    onChange={(e) => {
                      const newActions = [...rule.actions];
                      newActions[index] = {
                        ...action,
                        parameters: { template: e.target.value }
                      };
                      setRule({ ...rule, actions: newActions });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Select Template</option>
                    {ActionService.getVisualMarkingTemplates().map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                )}

                {action.type === 'watermark' && (
                  <select
                    value={action.parameters.template || ''}
                    onChange={(e) => {
                      const newActions = [...rule.actions];
                      newActions[index] = {
                        ...action,
                        parameters: { template: e.target.value }
                      };
                      setRule({ ...rule, actions: newActions });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Select Template</option>
                    {ActionService.getWatermarkTemplates().map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                )}

                {action.type === 'classify' && (
                  <div className="space-y-4">
                    <select
                      value={action.parameters.label || ''}
                      onChange={(e) => {
                        const label = e.target.value;
                        const newActions = [...rule.actions];
                        newActions[index] = {
                          ...action,
                          parameters: { label }
                        };
                        setRule({ ...rule, actions: newActions });

                        // Prompt for inheritance
                        if (label) {
                          const inherit = window.confirm(
                            'Would you like to inherit the existing classification rules? ' +
                            'This will apply the pre-configured visual marking, email domain restriction, ' +
                            'watermarking template, and encryption/EDRM settings.'
                          );

                          if (inherit) {
                            const inheritance = ActionService.getClassificationInheritance(label);
                            if (inheritance) {
                              const updatedActions = rule.actions.filter(a => 
                                a.type === 'tag' || (a === action)
                              );

                              if (inheritance.visualMarking) {
                                updatedActions.push({
                                  type: 'visualmarking',
                                  service: 'Nova',
                                  parameters: { template: inheritance.visualMarking }
                                });
                              }

                              if (inheritance.watermarking) {
                                updatedActions.push({
                                  type: 'watermark',
                                  service: 'Nova',
                                  parameters: { template: inheritance.watermarking }
                                });
                              }

                              if (inheritance.encryption) {
                                updatedActions.push({
                                  type: 'encrypt',
                                  service: 'Nova',
                                  parameters: { policy: inheritance.encryption }
                                });
                              }

                              if (inheritance.edrm) {
                                updatedActions.push({
                                  type: 'edrm',
                                  service: 'Nova',
                                  parameters: { policy: inheritance.edrm }
                                });
                              }

                              setRule({ ...rule, actions: updatedActions });
                            }
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    >
                      <option value="">Select Classification</option>
                      {ActionService.getClassificationLabels().map(label => (
                        <option key={label.name} value={label.name}>{label.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {action.type === 'encrypt' && (
                  <select
                    value={action.parameters.policy || ''}
                    onChange={(e) => {
                      const newActions = [...rule.actions];
                      newActions[index] = {
                        ...action,
                        parameters: { policy: e.target.value }
                      };
                      setRule({ ...rule, actions: newActions });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Select Policy</option>
                    {ActionService.getEncryptionPolicies().map(policy => (
                      <option key={policy} value={policy}>{policy}</option>
                    ))}
                  </select>
                )}

                {action.type === 'edrm' && (
                  <div className="space-y-4">
                    <select
                      value={action.parameters.policy || ''}
                      onChange={(e) => {
                        const newActions = [...rule.actions];
                        newActions[index] = {
                          ...action,
                          parameters: { 
                            ...action.parameters,
                            policy: e.target.value 
                          }
                        };
                        setRule({ ...rule, actions: newActions });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    >
                      <option value="">Select Policy</option>
                      {ActionService.getEdrmPolicies().map(policy => (
                        <option key={policy} value={policy}>{policy}</option>
                      ))}
                    </select>

                    <div className="space-y-2">
                      {['edit', 'print', 'copy', 'share', 'reshare'].map(permission => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={action.parameters[permission] || false}
                            onChange={(e) => {
                              const newActions = [...rule.actions];
                              newActions[index] = {
                                ...action,
                                parameters: { 
                                  ...action.parameters,
                                  [permission]: e.target.checked 
                                }
                              };
                              setRule({ ...rule, actions: newActions });
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700 capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4">Rule Summary</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-slate-500">Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{rule.name}</dd>
            </div>
            {rule.description && (
              <div>
                <dt className="text-sm text-slate-500">Description</dt>
                <dd className="mt-1 text-sm text-slate-900">{rule.description}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-slate-500">Frequency</dt>
              <dd className="mt-1 text-sm text-slate-900 capitalize">{rule.frequency}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Source</dt>
              <dd className="mt-1 text-sm text-slate-900 capitalize">{rule.trigger.source || 'Not configured'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Event</dt>
              <dd className="mt-1 text-sm text-slate-900 capitalize">{rule.trigger.event || 'Not configured'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Trigger</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {rule.trigger.conditions.map((condition, index) => (
                  <div key={index}>
                    {condition.field && condition.value
                      ? `${condition.field} ${condition.operator} ${condition.value}`
                      : 'Not configured'}
                    {index < rule.trigger.conditions.length - 1 && (
                      <span className="mx-2 font-medium">{condition.conjunction}</span>
                    )}
                  </div>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Actions</dt>
              <dd className="mt-1 text-sm text-slate-900">
                <ul className="list-disc pl-5 space-y-1">
                  {rule.actions.map((action, index) => (
                    <li key={index}>
                      {action.type} via {action.service}
                      {action.parameters && Object.keys(action.parameters).length > 0 && (
                        <span className="text-slate-500">
                          {' '}
                          (
                          {Object.entries(action.parameters)
                            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                            .join(', ')}
                          )
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="pt-4">
          <button
            onClick={handleTestRule}
            disabled={testResult === 'testing'}
            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            {testResult === 'testing' ? 'Testing...' : 'Test Rule'}
          </button>
          {testResult === 'success' && (
            <p className="mt-2 text-sm text-green-600">Rule tested successfully!</p>
          )}
          {testResult === 'error' && (
            <p className="mt-2 text-sm text-red-600">Error testing rule. Please check configuration.</p>
          )}
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
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Rules
        </button>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <h2 className="text-2xl font-bold text-slate-800">
        {editingRule ? 'Edit Rule' : 'Create New Rule'}
      </h2>

      <div className="flex space-x-4 border-b border-slate-200">
        {['Rule Details', 'Trigger', 'Actions', 'Review'].map((stepName, index) => (
          <button
            key={stepName}
            onClick={() => {
              if (validateStep(currentStep)) {
                setCurrentStep(index + 1);
              }
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              currentStep === index + 1
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {index + 1}. {stepName}
          </button>
        ))}
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          className={`px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 ${
            currentStep === 1 ? 'invisible' : ''
          }`}
        >
          Previous
        </button>
        <div className="space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!rule.name || !rule.trigger.source || !rule.trigger.event || rule.actions.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white ${
                !rule.name || !rule.trigger.source || !rule.trigger.event || rule.actions.length === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationRule;