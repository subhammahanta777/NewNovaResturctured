import React, { useState } from "react";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";

interface FieldMapping {
  externalField: string;
  novaField: string;
}

interface FieldMappingProps {
  onCancel: () => void;
}

const FieldMapping: React.FC<FieldMappingProps> = ({ onCancel }) => {
  const [mappings, setMappings] = useState<FieldMapping[]>([
    { externalField: "event_type", novaField: "event_type" },
    { externalField: "username", novaField: "user" },
    { externalField: "file_name", novaField: "file_name" },
  ]);

  const externalFields = [
    "event_type",
    "username",
    "file_name",
    "classification",
    "action_taken",
    "destination",
    "timestamp",
  ];

  const novaFields = [
    "event_type",
    "user",
    "file_name",
    "sensitivity_tag",
    "action",
    "destination",
    "time",
  ];

  const addMapping = () => {
    const availableExternalFields = externalFields.filter(
      field => !mappings.some(mapping => mapping.externalField === field)
    );
    
    const availableNovaFields = novaFields.filter(
      field => !mappings.some(mapping => mapping.novaField === field)
    );
    
    if (availableExternalFields.length && availableNovaFields.length) {
      setMappings([
        ...mappings,
        {
          externalField: availableExternalFields[0],
          novaField: availableNovaFields[0]
        }
      ]);
    }
  };

  const updateMapping = (index: number, field: keyof FieldMapping, value: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index][field] = value;
    setMappings(updatedMappings);
  };

  const removeMapping = (index: number) => {
    const updatedMappings = [...mappings];
    updatedMappings.splice(index, 1);
    setMappings(updatedMappings);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      <button 
        onClick={onCancel}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Integrations
      </button>
      
      <h2 className="text-3xl font-bold text-slate-800">Field Mapping – Symantec DLP</h2>
      <p className="text-slate-500 text-sm">
        Map fields from the external DLP system to Nova's internal schema. This ensures data is interpreted correctly.
      </p>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="space-y-4">
          {mappings.map((mapping, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">
              <div className="col-span-2">
                <label className="text-xs text-slate-500 block mb-1">External Field</label>
                <select
                  value={mapping.externalField}
                  onChange={(e) => updateMapping(index, "externalField", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {externalFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-center items-center">
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="col-span-2">
                <label className="text-xs text-slate-500 block mb-1">Nova Field</label>
                <select
                  value={mapping.novaField}
                  onChange={(e) => updateMapping(index, "novaField", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {novaFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => removeMapping(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={addMapping}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add Field Mapping
          </button>
        </div>
        
        <div className="pt-6 mt-6 border-t border-slate-200 flex space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Save Mapping
          </button>
          <button
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Test with Sample Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldMapping;