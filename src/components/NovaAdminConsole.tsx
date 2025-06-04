import React, { useState, Suspense, lazy } from "react";
import Sidebar from "./layout/Sidebar";
import { ErrorBoundary } from "./layout/ErrorBoundary";

const Orchestration = lazy(() => import("./sections/Orchestration"));
const Integrations = lazy(() => import("./sections/Integrations"));
const CreateRule = lazy(() => import("./sections/CreateRule"));
const FieldMapping = lazy(() => import("./sections/FieldMapping"));
const Tagging = lazy(() => import("./sections/protection/Tagging"));
const VisualMarking = lazy(() => import("./sections/protection/VisualMarking"));
const Watermark = lazy(() => import("./sections/protection/Watermark"));
const Classification = lazy(() => import("./sections/classification/Classification"));
const ContentPolicies = lazy(() => import("./sections/classification/ContentPolicies"));
const PublishingPolicies = lazy(() => import("./sections/classification/PublishingPolicies"));
const CreateAutomationRule = lazy(() => import("./sections/CreateAutomationRule"));
const Security = lazy(() => import("./sections/Security"));
const Administration = lazy(() => import("./sections/Administration"));

const NovaAdminConsole: React.FC = () => {
  const [section, setSection] = useState<Section>("orchestration");
  const { data: rules = [] } = RuleService.getRules();
  const { data: editingRule } = RuleService.getEditingRule();

  const handleEditRule = (rule: Rule) => {
    const response = RuleService.setEditingRule(rule);
    if (response.success) {
      setSection("createautomation");
    } else {
      console.error("Failed to set editing rule:", response.error);
    }
  };

  const handleSaveAutomationRule = (automationRule: AutomationRule) => {
    if (editingRule) {
      const response = RuleService.updateRule({
        ...editingRule,
        name: automationRule.name,
        description: automationRule.description,
        trigger: `${automationRule.trigger.source} - ${automationRule.trigger.event}`,
        action: automationRule.actions.map((a) => a.type).join(", "),
        automationDetails: {
          trigger: automationRule.trigger,
          actions: automationRule.actions
        },
        scope: automationRule.scope
      });

      if (!response.success) {
        console.error("Failed to update rule:", response.error);
        return;
      }
    } else {
      const response = RuleService.addRule({
        name: automationRule.name,
        description: automationRule.description,
        trigger: `${automationRule.trigger.source} - ${automationRule.trigger.event}`,
        action: automationRule.actions.map((a) => a.type).join(", "),
        frequency: automationRule.frequency,
        automationDetails: {
          trigger: automationRule.trigger,
          actions: automationRule.actions
        },
        scope: automationRule.scope
      });

      if (!response.success) {
        console.error("Failed to add rule:", response.error);
        return;
      }
    }

    RuleService.setEditingRule(null);
    setSection("orchestration");
  };

  const renderContent = () => {
    switch (section) {
      case "orchestration":
        return (
          <Orchestration
            rules={rules}
            onCreateRule={() => setSection("createautomation")}
            onEditRule={handleEditRule}
          />
        );

      case "integrations":
        return <Integrations onFieldMapping={() => setSection("fieldmapping")} />;

      case "createrule":
        return (
          <CreateRule
            onSave={(rule) => {
              const response = RuleService.addRule(rule);
              if (response.success) {
                setSection("orchestration");
              }
            }}
            onCancel={() => setSection("orchestration")}
          />
        );

      case "createautomation":
        return (
          <CreateAutomationRule
            editingRule={editingRule}
            onSave={handleSaveAutomationRule}
            onCancel={() => {
              RuleService.setEditingRule(null);
              setSection("orchestration");
            }}
          />
        );

      case "fieldmapping":
        return <FieldMapping onCancel={() => setSection("integrations")} />;

      case "tagging":
        return <Tagging />;

      case "visualmarking":
        return <VisualMarking />;

      case "watermark":
        return <Watermark />;

      case "labels":
        return <Classification />;

      case "security":
        return <Security />;

      case "contentpolicies":
        return <ContentPolicies />;

      case "publishingpolicies":
        return <PublishingPolicies />;

      case "administration":
        return <Administration />;

      case "encryption":
      case "edrm":
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-slate-800">
              {section.charAt(0).toUpperCase() + section.slice(1)} Protection
            </h2>
            <p className="text-slate-500">
              This section is under development. Check back soon for updates.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentSection={section} setSection={setSection} />
      <div className="flex-1 p-8 md:p-10 transition-all">
        <ErrorBoundary>{renderContent()}</ErrorBoundary>
      </div>
    </div>
  );
};

export default NovaAdminConsole;