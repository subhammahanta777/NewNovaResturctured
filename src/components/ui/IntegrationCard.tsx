import React from "react";
import { Integration } from "../NovaAdminConsole";

interface IntegrationCardProps {
  integration: Integration;
  onFieldMapping: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ 
  integration,
  onFieldMapping
}) => {
  const getIntegrationTypeColor = (type: string) => {
    switch (type) {
      case "DLP":
        return "text-purple-700";
      case "DSPM":
        return "text-emerald-700";
      case "CASB":
        return "text-orange-700";
      default:
        return "text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-slate-800">{integration.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 ${getIntegrationTypeColor(integration.type)}`}>
          {integration.type}
        </span>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Source:</span>
          <span className="text-slate-700 font-medium">{integration.source}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Last Sync:</span>
          <span className="text-slate-700 font-medium">{integration.lastSync}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-5">
        <button className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
          View Logs
        </button>
        <button 
          onClick={onFieldMapping}
          className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Field Mapping
        </button>
        <button className="text-xs px-3 py-1.5 rounded text-slate-500 hover:text-slate-700 transition-colors">
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default IntegrationCard;