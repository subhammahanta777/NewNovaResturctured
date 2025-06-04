import React, { useState } from "react";
import IntegrationCard from "../ui/IntegrationCard";
import AddIntegration from "./AddIntegration";
import { useIntegrationStore } from "../../store/useIntegrationStore";
import { IntegrationService } from "../../services/IntegrationService";

interface IntegrationsProps {
  onFieldMapping: () => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ onFieldMapping }) => {
  const [isAdding, setIsAdding] = useState(false);
  const integrations = useIntegrationStore(state => state.integrations);

  const handleSaveIntegration = (integration: any) => {
    IntegrationService.addIntegration({
      name: integration.name,
      type: integration.type.toUpperCase(),
      source: integration.source,
      lastSync: 'Just now'
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {isAdding ? (
        <AddIntegration
          onCancel={() => setIsAdding(false)}
          onSave={handleSaveIntegration}
        />
      ) : (
        <>
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-slate-800">Connected Integrations ({integrations.length})</h2>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                + Add Integration
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              Manage connections to external security tools, DLP solutions, and data sources.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onFieldMapping={onFieldMapping}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Integrations;