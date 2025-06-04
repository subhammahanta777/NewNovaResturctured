import React from "react";
import { Rule } from "../../types";
import { Edit, Copy, Power, Building2, Network } from "lucide-react";

interface RuleCardProps {
  rule: Rule;
  index: number;
  onEdit: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, index, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-green-600 bg-green-50";
      case "draft":
        return "text-amber-600 bg-amber-50";
      case "disabled":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{rule.name}</h3>
          {rule.description && (
            <p className="text-sm text-slate-500 mt-1">{rule.description}</p>
          )}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(rule.status)}`}>
          {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Trigger</p>
          <p className="text-sm text-slate-700">{rule.trigger}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Action</p>
          <p className="text-sm text-slate-700">{rule.action}</p>
        </div>
      </div>

      {rule.source && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Source</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700">{rule.source.name}</span>
            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
              {rule.source.type}
            </span>
          </div>
        </div>
      )}

      {rule.scope && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {rule.scope.departments.map(dept => (
                <span key={dept} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                  {dept}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {rule.scope.channels.map(channel => (
                <span key={channel} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
        <div className="text-sm text-slate-600">
          Frequency: <span className="font-medium capitalize">{rule.frequency}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Rule"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
            title="Duplicate Rule"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
            title="Toggle Rule Status"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;