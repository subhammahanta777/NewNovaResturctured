import React, { useState } from 'react';
import { Plus, AlertCircle, Search, Filter, History, Archive, Settings, Tag, X, ChevronDown, ChevronUp, Trash2, Copy, Layout } from 'lucide-react';
import Modal from "../../ui/Modal";

interface TagDefinition {
  id: string;
  name: string;
  description: string;
  category?: string;
  color?: string;
  createdBy: string;
  lastUpdated: string;
  usageCount: number;
  status: 'active' | 'deprecated';
  history?: {
    timestamp: string;
    action: string;
    user: string;
    changes: Record<string, any>;
  }[];
  autoApply?: {
    enabled: boolean;
    conditions: {
      type: string;
      value: string;
    }[];
  };
}

interface NewTag {
  name: string;
  description: string;
  category?: string;
  color?: string;
  autoApply: {
    enabled: boolean;
    conditions: {
      type: string;
      value: string;
    }[];
  };
}

const Tagging: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deprecated'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TagDefinition;
    direction: 'asc' | 'desc';
  }>({ key: 'lastUpdated', direction: 'desc' });

  const [tags, setTags] = useState<TagDefinition[]>([
    {
      id: '1',
      name: 'GDPR',
      description: 'Documents containing GDPR-protected information',
      createdBy: 'Admin',
      lastUpdated: '2024-03-15',
      usageCount: 156,
      status: 'active',
      history: [
        {
          timestamp: '2024-03-15 14:30:00',
          action: 'Created',
          user: 'Admin',
          changes: { name: 'GDPR', description: 'Documents containing GDPR-protected information' }
        }
      ]
    },
    {
      id: '2',
      name: 'Confidential',
      description: 'Internal confidential documents',
      createdBy: 'Admin',
      lastUpdated: '2024-03-14',
      usageCount: 89,
      status: 'active',
      history: [
        {
          timestamp: '2024-03-14 10:15:00',
          action: 'Created',
          user: 'Admin',
          changes: { name: 'Confidential', description: 'Internal confidential documents' }
        }
      ]
    },
    {
      id: '3',
      name: 'PII',
      description: 'Contains personally identifiable information',
      createdBy: 'Admin',
      lastUpdated: '2024-03-13',
      usageCount: 234,
      status: 'active',
      history: [
        {
          timestamp: '2024-03-13 09:45:00',
          action: 'Created',
          user: 'Admin',
          changes: { name: 'PII', description: 'Contains personally identifiable information' }
        }
      ]
    }
  ]);

  const [editingTag, setEditingTag] = useState<TagDefinition | null>(null);
  const [newTag, setNewTag] = useState<NewTag>({
    name: '',
    description: '',
    category: 'Compliance',
    color: '#3B82F6',
    autoApply: {
      enabled: false,
      conditions: []
    }
  });

  const handleSort = (key: keyof TagDefinition) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEditTag = (tag: TagDefinition) => {
    setEditingTag(tag);
    setIsEditing(true);
  };

  const handleSaveTag = () => {
    if (editingTag) {
      setTags(currentTags => 
        currentTags.map(tag => 
          tag.id === editingTag.id ? {
            ...editingTag,
            lastUpdated: new Date().toISOString(),
            history: [
              ...(editingTag.history || []),
              {
                timestamp: new Date().toISOString(),
                action: 'Updated',
                user: 'Admin',
                changes: {
                  name: editingTag.name,
                  description: editingTag.description
                }
              }
            ]
          } : tag
        )
      );
    } else if (isCreating) {
      const newTagEntry: TagDefinition = {
        id: `tag-${Date.now()}`,
        name: newTag.name,
        description: newTag.description,
        createdBy: 'Admin',
        lastUpdated: new Date().toISOString(),
        usageCount: 0,
        status: 'active',
        history: [{
          timestamp: new Date().toISOString(),
          action: 'Created',
          user: 'Admin',
          changes: {
            name: newTag.name,
            description: newTag.description
          }
        }]
      };
      setTags(currentTags => [...currentTags, newTagEntry]);
    }
    setIsEditing(false);
    setIsCreating(false);
    setEditingTag(null);
  };

  const handleDeprecateTag = (tagId: string) => {
    setTags(currentTags =>
      currentTags.map(tag =>
        tag.id === tagId ? {
          ...tag,
          status: 'deprecated',
          lastUpdated: new Date().toISOString(),
          history: [
            ...(tag.history || []),
            {
              timestamp: new Date().toISOString(),
              action: 'Deprecated',
              user: 'Admin',
              changes: { status: 'deprecated' }
            }
          ]
        } : tag
      )
    );
  };

  const filteredAndSortedTags = tags
    .filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tag.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tag.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

  const renderTagHistory = () => {
    const tag = tags.find(t => t.id === selectedTagId);
    if (!tag || !tag.history) return null;

    return (
      <Modal
        isOpen={isViewingHistory}
        onClose={() => {
          setIsViewingHistory(false);
          setSelectedTagId(null);
        }}
        title={`Tag History - ${tag.name}`}
      >
        <div className="space-y-4">
          <div className="border rounded-lg divide-y">
            {tag.history.map((event, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-800">{event.action}</span>
                    <span className="text-slate-500 text-sm ml-2">by {event.user}</span>
                  </div>
                  <span className="text-sm text-slate-500">{event.timestamp}</span>
                </div>
                <div className="mt-2 text-sm">
                  {Object.entries(event.changes).map(([key, value]) => (
                    <div key={key} className="text-slate-600">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  };

  const renderEditModal = () => (
    <Modal
      isOpen={isEditing || isCreating}
      onClose={() => {
        setIsEditing(false);
        setIsCreating(false);
        setEditingTag(null);
      }}
      title={isCreating ? "Create New Tag" : "Edit Tag"}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tag Name *
          </label>
          <input
            type="text"
            value={editingTag?.name || newTag.name}
            onChange={(e) => {
              if (editingTag) {
                setEditingTag({ ...editingTag, name: e.target.value });
              } else {
                setNewTag({ ...newTag, name: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="Enter tag name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={editingTag?.description || newTag.description}
            onChange={(e) => {
              if (editingTag) {
                setEditingTag({ ...editingTag, description: e.target.value });
              } else {
                setNewTag({ ...newTag, description: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            rows={3}
            placeholder="Enter tag description"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
              setEditingTag(null);
            }}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!(editingTag?.name || newTag.name)}
          >
            {isCreating ? "Create Tag" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Tag Management</h2>
          <p className="text-slate-500 mt-2">
            Define and manage metadata tags for document classification and protection.
          </p>
        </div>
        <button
          onClick={() => {
            setNewTag({
              name: '',
              description: '',
              category: 'Compliance',
              color: '#3B82F6',
              autoApply: {
                enabled: false,
                conditions: []
              }
            });
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Tag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1 flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'deprecated')}
                    className="px-3 py-2 border border-slate-300 rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1"
                      >
                        <span>Name</span>
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center space-x-1"
                      >
                        <span>Status</span>
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      <button
                        onClick={() => handleSort('usageCount')}
                        className="flex items-center space-x-1"
                      >
                        <span>Usage</span>
                        {sortConfig.key === 'usageCount' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      <button
                        onClick={() => handleSort('lastUpdated')}
                        className="flex items-center space-x-1"
                      >
                        <span>Last Updated</span>
                        {sortConfig.key === 'lastUpdated' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTags.map((tag) => (
                    <tr key={tag.id} className="border-b border-slate-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="font-medium text-slate-800">{tag.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tag.description}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tag.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {tag.status.charAt(0).toUpperCase() + tag.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tag.usageCount}</td>
                      <td className="py-3 px-4 text-slate-600">{tag.lastUpdated}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedTagId(tag.id);
                            setIsViewingHistory(true);
                          }}
                          className="text-slate-600 hover:text-slate-900"
                          title="View History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditTag(tag)}
                          className="text-slate-600 hover:text-slate-900"
                          title="Edit Tag"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        {tag.status === 'active' && (
                          <button 
                            onClick={() => handleDeprecateTag(tag.id)}
                            className="text-slate-600 hover:text-slate-900"
                            title="Deprecate Tag"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tag Insights</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Total Tags</p>
                <p className="text-2xl font-bold text-slate-800">{tags.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Tags</p>
                <p className="text-2xl font-bold text-slate-800">
                  {tags.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Tagged Files</p>
                <p className="text-2xl font-bold text-slate-800">
                  {tags.reduce((sum, tag) => sum + tag.usageCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">Tag Policy Notice</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Changes to tag definitions will affect all files currently using these tags. Review carefully before modifying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isViewingHistory && renderTagHistory()}
      {(isEditing || isCreating) && renderEditModal()}
    </div>
  );
};

export default Tagging;