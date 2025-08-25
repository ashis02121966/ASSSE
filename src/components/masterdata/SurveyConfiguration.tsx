import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Settings, Copy, Eye, Layers, ArrowUp, ArrowDown, FileTemplate, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { surveySchedules } from '../../data/surveyBlocks';
import { SurveySchedule, SurveyBlock, SurveyField } from '../../types';
import { SurveyBlockApi } from '../../api/surveyBlockApi';

interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  items: BlockItem[];
}

interface BlockItem {
  id: string;
  itemId: string;
  itemName: string;
  dataType: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'email' | 'tel' | 'url';
  maxLength: number;
  isRequired: boolean;
  validationRules: any;
  options: string[];
  orderIndex: number;
}

const SurveyConfiguration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<SurveySchedule | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<SurveyBlock | null>(null);
  const [schedules, setSchedules] = useState<SurveySchedule[]>(surveySchedules);
  const [activeTab, setActiveTab] = useState<'schedules' | 'blocks'>('schedules');
  const [blockCreationType, setBlockCreationType] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [blockTemplates, setBlockTemplates] = useState<BlockTemplate[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const [newSchedule, setNewSchedule] = useState<Omit<SurveySchedule, 'id' | 'blocks'>>({
    name: '',
    description: '',
    sector: '',
    year: '',
    isActive: true
  });

  const [newBlock, setNewBlock] = useState<Omit<SurveyBlock, 'id'>>({
    name: '',
    description: '',
    fields: [],
    completed: false,
    isGrid: false
  });

  const [newItem, setNewItem] = useState<Omit<BlockItem, 'id' | 'orderIndex'>>({
    itemId: '',
    itemName: '',
    dataType: 'text',
    maxLength: 255,
    isRequired: false,
    validationRules: {},
    options: []
  });

  const [customValidationRule, setCustomValidationRule] = useState('');
  const [optionInput, setOptionInput] = useState('');

  // Load block templates on component mount
  useEffect(() => {
    loadBlockTemplates();
  }, []);

  const loadBlockTemplates = async () => {
    try {
      // In a real app, this would fetch from the API
      const templates: BlockTemplate[] = [
        {
          id: 'basic-info',
          name: 'Basic Information Template',
          description: 'Standard enterprise identification fields',
          category: 'Basic',
          items: [
            {
              id: '1',
              itemId: 'enterprise_name',
              itemName: 'Enterprise Name',
              dataType: 'text',
              maxLength: 255,
              isRequired: true,
              validationRules: { minLength: 2 },
              options: [],
              orderIndex: 1
            },
            {
              id: '2',
              itemId: 'enterprise_address',
              itemName: 'Enterprise Address',
              dataType: 'textarea',
              maxLength: 500,
              isRequired: true,
              validationRules: {},
              options: [],
              orderIndex: 2
            },
            {
              id: '3',
              itemId: 'contact_person',
              itemName: 'Contact Person',
              dataType: 'text',
              maxLength: 100,
              isRequired: true,
              validationRules: {},
              options: [],
              orderIndex: 3
            },
            {
              id: '4',
              itemId: 'gstin',
              itemName: 'GSTIN',
              dataType: 'text',
              maxLength: 15,
              isRequired: true,
              validationRules: { pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$' },
              options: [],
              orderIndex: 4
            },
            {
              id: '5',
              itemId: 'sector',
              itemName: 'Sector',
              dataType: 'select',
              maxLength: 50,
              isRequired: true,
              validationRules: {},
              options: ['Manufacturing', 'Services', 'Construction', 'Trade', 'Transport'],
              orderIndex: 5
            }
          ]
        },
        {
          id: 'financial-info',
          name: 'Financial Information Template',
          description: 'Standard financial data collection fields',
          category: 'Financial',
          items: [
            {
              id: '1',
              itemId: 'total_revenue',
              itemName: 'Total Revenue (Rs.)',
              dataType: 'number',
              maxLength: 15,
              isRequired: true,
              validationRules: { min: 0 },
              options: [],
              orderIndex: 1
            },
            {
              id: '2',
              itemId: 'total_expenses',
              itemName: 'Total Expenses (Rs.)',
              dataType: 'number',
              maxLength: 15,
              isRequired: true,
              validationRules: { min: 0 },
              options: [],
              orderIndex: 2
            },
            {
              id: '3',
              itemId: 'net_profit',
              itemName: 'Net Profit (Rs.)',
              dataType: 'number',
              maxLength: 15,
              isRequired: false,
              validationRules: {},
              options: [],
              orderIndex: 3
            }
          ]
        },
        {
          id: 'employment-info',
          name: 'Employment Information Template',
          description: 'Standard employment and labor data fields',
          category: 'Employment',
          items: [
            {
              id: '1',
              itemId: 'total_employees',
              itemName: 'Total Number of Employees',
              dataType: 'number',
              maxLength: 10,
              isRequired: true,
              validationRules: { min: 0, max: 99999 },
              options: [],
              orderIndex: 1
            },
            {
              id: '2',
              itemId: 'male_employees',
              itemName: 'Male Employees',
              dataType: 'number',
              maxLength: 10,
              isRequired: true,
              validationRules: { min: 0 },
              options: [],
              orderIndex: 2
            },
            {
              id: '3',
              itemId: 'female_employees',
              itemName: 'Female Employees',
              dataType: 'number',
              maxLength: 10,
              isRequired: true,
              validationRules: { min: 0 },
              options: [],
              orderIndex: 3
            }
          ]
        }
      ];
      
      setBlockTemplates(templates);
    } catch (error) {
      console.error('Failed to load block templates:', error);
    }
  };

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.year) {
      alert('Please provide schedule name and year');
      return;
    }

    const scheduleId = `schedule-${Date.now()}`;
    const scheduleWithId: SurveySchedule = {
      ...newSchedule,
      id: scheduleId,
      blocks: []
    };

    setSchedules([...schedules, scheduleWithId]);
    setNewSchedule({
      name: '',
      description: '',
      sector: '',
      year: '',
      isActive: true
    });
    setShowAddModal(false);
  };

  const handleUpdateSchedule = () => {
    if (!selectedSchedule) return;

    const updatedSchedules = schedules.map(schedule =>
      schedule.id === selectedSchedule.id ? selectedSchedule : schedule
    );

    setSchedules(updatedSchedules);
    setSelectedSchedule(null);
    setShowEditModal(false);
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this survey schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const handleCloneSchedule = (schedule: SurveySchedule) => {
    const clonedSchedule: SurveySchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
      name: `${schedule.name} (Copy)`,
      isActive: false,
      blocks: schedule.blocks?.map(block => ({
        ...block,
        id: `block-${Date.now()}-${block.id}`
      })) || []
    };

    setSchedules([...schedules, clonedSchedule]);
    alert('Survey schedule cloned successfully!');
  };

  const handleAddBlock = () => {
    if (!selectedSchedule || !newBlock.name) {
      alert('Please provide block name');
      return;
    }

    let blockWithItems: SurveyBlock;

    if (blockCreationType === 'template' && selectedTemplate) {
      // Create block from template
      const template = blockTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        blockWithItems = {
          ...newBlock,
          id: `block-${Date.now()}`,
          fields: template.items.map(item => ({
            id: item.itemId,
            label: item.itemName,
            type: item.dataType as SurveyField['type'],
            value: '',
            required: item.isRequired,
            validation: JSON.stringify(item.validationRules)
          }))
        };
      } else {
        blockWithItems = {
          ...newBlock,
          id: `block-${Date.now()}`
        };
      }
    } else {
      // Create custom block
      blockWithItems = {
        ...newBlock,
        id: `block-${Date.now()}`
      };
    }

    const updatedSchedule = {
      ...selectedSchedule,
      blocks: [...(selectedSchedule.blocks || []), blockWithItems]
    };

    setSchedules(schedules.map(s => 
      s.id === selectedSchedule.id ? updatedSchedule : s
    ));

    setSelectedSchedule(updatedSchedule);
    resetBlockForm();
    setShowAddBlockModal(false);
  };

  const resetBlockForm = () => {
    setNewBlock({
      name: '',
      description: '',
      fields: [],
      completed: false,
      isGrid: false
    });
    setBlockCreationType('template');
    setSelectedTemplate('');
  };

  const handleEditBlock = (block: SurveyBlock) => {
    setSelectedBlock(block);
    setNewBlock({
      name: block.name,
      description: block.description || '',
      fields: block.fields,
      completed: block.completed,
      isGrid: block.isGrid || false
    });
    setBlockCreationType('custom');
    setShowAddBlockModal(true);
  };

  const handleUpdateBlock = () => {
    if (!selectedSchedule || !selectedBlock) return;

    const updatedBlocks = selectedSchedule.blocks?.map(block =>
      block.id === selectedBlock.id ? { ...newBlock, id: selectedBlock.id } : block
    ) || [];

    const updatedSchedule = {
      ...selectedSchedule,
      blocks: updatedBlocks
    };

    setSchedules(schedules.map(s => 
      s.id === selectedSchedule.id ? updatedSchedule : s
    ));

    setSelectedSchedule(updatedSchedule);
    setSelectedBlock(null);
    resetBlockForm();
    setShowAddBlockModal(false);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!selectedSchedule) return;

    if (confirm('Are you sure you want to delete this block?')) {
      const updatedBlocks = selectedSchedule.blocks?.filter(block => block.id !== blockId) || [];
      const updatedSchedule = {
        ...selectedSchedule,
        blocks: updatedBlocks
      };

      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id ? updatedSchedule : s
      ));

      setSelectedSchedule(updatedSchedule);
    }
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!selectedSchedule || !selectedSchedule.blocks) return;

    const blocks = [...selectedSchedule.blocks];
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= blocks.length) return;

    [blocks[currentIndex], blocks[newIndex]] = [blocks[newIndex], blocks[currentIndex]];

    const updatedSchedule = {
      ...selectedSchedule,
      blocks
    };

    setSchedules(schedules.map(s => 
      s.id === selectedSchedule.id ? updatedSchedule : s
    ));

    setSelectedSchedule(updatedSchedule);
  };

  const handleAddItem = () => {
    if (!newItem.itemId || !newItem.itemName) {
      alert('Please provide item ID and name');
      return;
    }

    // Check for duplicate item ID
    if (newBlock.fields.some(field => field.id === newItem.itemId)) {
      alert('Item ID already exists in this block');
      return;
    }

    const itemWithId: SurveyField = {
      id: newItem.itemId,
      label: newItem.itemName,
      type: newItem.dataType as SurveyField['type'],
      value: '',
      required: newItem.isRequired,
      validation: JSON.stringify(newItem.validationRules)
    };

    setNewBlock({
      ...newBlock,
      fields: [...newBlock.fields, itemWithId]
    });

    // Reset item form
    setNewItem({
      itemId: '',
      itemName: '',
      dataType: 'text',
      maxLength: 255,
      isRequired: false,
      validationRules: {},
      options: []
    });
    setCustomValidationRule('');
    setOptionInput('');
  };

  const handleRemoveItem = (itemId: string) => {
    setNewBlock({
      ...newBlock,
      fields: newBlock.fields.filter(field => field.id !== itemId)
    });
  };

  const handleAddValidationRule = () => {
    if (!customValidationRule.trim()) return;

    try {
      const rule = JSON.parse(customValidationRule);
      setNewItem({
        ...newItem,
        validationRules: { ...newItem.validationRules, ...rule }
      });
      setCustomValidationRule('');
    } catch (error) {
      alert('Invalid JSON format for validation rule');
    }
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) return;

    setNewItem({
      ...newItem,
      options: [...newItem.options, optionInput.trim()]
    });
    setOptionInput('');
  };

  const handleRemoveOption = (index: number) => {
    setNewItem({
      ...newItem,
      options: newItem.options.filter((_, i) => i !== index)
    });
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.sector?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'text': return '📝';
      case 'number': return '🔢';
      case 'date': return '📅';
      case 'select': return '📋';
      case 'textarea': return '📄';
      case 'checkbox': return '☑️';
      case 'radio': return '🔘';
      case 'email': return '📧';
      case 'tel': return '📞';
      case 'url': return '🔗';
      default: return '📝';
    }
  };

  const renderBlockManagement = () => {
    if (!selectedSchedule) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Manage Blocks: {selectedSchedule.name}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedSchedule.blocks?.length || 0} blocks configured
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddBlockModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Block</span>
            </button>
            <button
              onClick={() => {
                setShowBlockModal(false);
                setSelectedSchedule(null);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Schedules
            </button>
          </div>
        </div>

        {/* Blocks List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Survey Blocks</h3>
          </div>
          
          {selectedSchedule.blocks && selectedSchedule.blocks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {selectedSchedule.blocks.map((block, index) => (
                <div key={block.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{block.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{block.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Fields: {block.fields?.length || 0}</span>
                            <span>Type: {block.isGrid ? 'Grid' : 'Form'}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              block.completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {block.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Block Items Preview */}
                      {block.fields && block.fields.length > 0 && (
                        <div className="mt-4 ml-11">
                          <button
                            onClick={() => toggleItemExpansion(block.id)}
                            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {expandedItems.includes(block.id) ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                            <span>View {block.fields.length} items</span>
                          </button>
                          
                          {expandedItems.includes(block.id) && (
                            <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded border">
                              {block.fields.map((field, fieldIndex) => (
                                <div key={field.id} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{getDataTypeIcon(field.type)}</span>
                                    <span className="font-medium text-gray-900">{field.label}</span>
                                    {field.required && (
                                      <span className="text-red-500 text-xs">*</span>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      {field.type}
                                    </span>
                                    {field.validation && (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                        Rules
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(block.id, 'down')}
                        disabled={index === selectedSchedule.blocks!.length - 1}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => handleEditBlock(block)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit Block"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBlock(block);
                          setShowItemModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                        title="Manage Items"
                      >
                        <List size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete Block"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No blocks configured</p>
              <p className="text-sm">Add survey blocks to structure your data collection</p>
              <button
                onClick={() => setShowAddBlockModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus size={16} />
                <span>Add First Block</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Survey Configuration</h1>
        {!showBlockModal && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Survey Schedule</span>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      {!showBlockModal && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('schedules')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'schedules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings size={16} />
                <span>Survey Schedules</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Block Management View */}
      {showBlockModal ? (
        renderBlockManagement()
      ) : (
        <>
          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search survey schedules..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Survey Schedules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{schedule.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        schedule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Year: {schedule.year}</span>
                      <span>Sector: {schedule.sector || 'All'}</span>
                      <span>Blocks: {schedule.blocks?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      title="View Schedule"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-800 p-1 rounded"
                      title="Edit Schedule"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowBlockModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 p-1 rounded"
                      title="Manage Blocks"
                    >
                      <Layers size={16} />
                    </button>
                    <button
                      onClick={() => handleCloneSchedule(schedule)}
                      className="text-orange-600 hover:text-orange-800 p-1 rounded"
                      title="Clone Schedule"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                      title="Delete Schedule"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Survey Blocks Preview */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Survey Blocks</h4>
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowBlockModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <Layers size={14} />
                      <span>Manage</span>
                    </button>
                  </div>
                  {schedule.blocks && schedule.blocks.length > 0 ? (
                    <div className="space-y-2">
                      {schedule.blocks.slice(0, 3).map((block, index) => (
                        <div key={block.id} className="flex items-center space-x-2 text-sm">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 flex-1">{block.name}</span>
                          <span className="text-xs text-gray-500">
                            {block.isGrid ? 'Grid' : 'Form'}
                          </span>
                        </div>
                      ))}
                      {schedule.blocks.length > 3 && (
                        <div className="text-sm text-gray-500 pl-8">
                          +{schedule.blocks.length - 3} more blocks
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Settings className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No blocks configured</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Survey Schedule</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., ASSSE 2024-25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the survey schedule"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Year *
                </label>
                <input
                  type="text"
                  value={newSchedule.year}
                  onChange={(e) => setNewSchedule({...newSchedule, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2024-25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  value={newSchedule.sector}
                  onChange={(e) => setNewSchedule({...newSchedule, sector: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sectors</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Construction">Construction</option>
                  <option value="Trade">Trade</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="schedule-active"
                  checked={newSchedule.isActive}
                  onChange={(e) => setNewSchedule({...newSchedule, isActive: e.target.checked})}
                  className="mr-2 rounded"
                />
                <label htmlFor="schedule-active" className="text-sm text-gray-700">
                  Active Schedule
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSchedule}
                disabled={!newSchedule.name || !newSchedule.year}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Create Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Survey Schedule</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSchedule(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={selectedSchedule.name}
                  onChange={(e) => setSelectedSchedule({...selectedSchedule, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedSchedule.description}
                  onChange={(e) => setSelectedSchedule({...selectedSchedule, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Year *
                </label>
                <input
                  type="text"
                  value={selectedSchedule.year}
                  onChange={(e) => setSelectedSchedule({...selectedSchedule, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  value={selectedSchedule.sector}
                  onChange={(e) => setSelectedSchedule({...selectedSchedule, sector: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sectors</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Construction">Construction</option>
                  <option value="Trade">Trade</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-schedule-active"
                  checked={selectedSchedule.isActive}
                  onChange={(e) => setSelectedSchedule({...selectedSchedule, isActive: e.target.checked})}
                  className="mr-2 rounded"
                />
                <label htmlFor="edit-schedule-active" className="text-sm text-gray-700">
                  Active Schedule
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSchedule}
                disabled={!selectedSchedule.name || !selectedSchedule.year}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Update Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {showViewModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Survey Schedule Details</h3>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSchedule(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Schedule Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Name
                  </label>
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{selectedSchedule.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Survey Year
                  </label>
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{selectedSchedule.year}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sector
                  </label>
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{selectedSchedule.sector || 'All Sectors'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedSchedule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSchedule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{selectedSchedule.description || 'No description'}</p>
              </div>

              {/* Survey Blocks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Survey Blocks ({selectedSchedule.blocks?.length || 0})</h4>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setShowBlockModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Layers size={14} />
                    <span>Manage Blocks</span>
                  </button>
                </div>
                {selectedSchedule.blocks && selectedSchedule.blocks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSchedule.blocks.map((block, index) => (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{block.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{block.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Fields: {block.fields?.length || 0}</span>
                              <span>Type: {block.isGrid ? 'Grid' : 'Form'}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                block.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {block.completed ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No blocks configured for this schedule</p>
                    <p className="text-sm">Blocks can be added after creating the schedule</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Block Modal */}
      {showAddBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedBlock ? 'Edit Survey Block' : 'Add New Survey Block'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddBlockModal(false);
                  setSelectedBlock(null);
                  resetBlockForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Block Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Block Configuration</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Block Name *
                  </label>
                  <input
                    type="text"
                    value={newBlock.name}
                    onChange={(e) => setNewBlock({...newBlock, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Block 1: Enterprise Identification"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newBlock.description}
                    onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the purpose of this block"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Block Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="blockType"
                        checked={!newBlock.isGrid}
                        onChange={() => setNewBlock({...newBlock, isGrid: false})}
                        className="mr-2"
                      />
                      <div>
                        <span className="text-sm font-medium">Form Block</span>
                        <p className="text-xs text-gray-500">Individual fields for data entry</p>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="blockType"
                        checked={newBlock.isGrid}
                        onChange={() => setNewBlock({...newBlock, isGrid: true})}
                        className="mr-2"
                      />
                      <div>
                        <span className="text-sm font-medium">Grid Block</span>
                        <p className="text-xs text-gray-500">Tabular data with rows and columns</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Block Creation Method */}
                {!selectedBlock && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Block Creation Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="creationType"
                          checked={blockCreationType === 'template'}
                          onChange={() => setBlockCreationType('template')}
                          className="mr-2"
                        />
                        <div className="flex items-center space-x-2">
                          <FileTemplate size={16} className="text-blue-600" />
                          <div>
                            <span className="text-sm font-medium">Use Existing Template</span>
                            <p className="text-xs text-gray-500">Start with predefined block structure</p>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="creationType"
                          checked={blockCreationType === 'custom'}
                          onChange={() => setBlockCreationType('custom')}
                          className="mr-2"
                        />
                        <div className="flex items-center space-x-2">
                          <Plus size={16} className="text-green-600" />
                          <div>
                            <span className="text-sm font-medium">Create Custom Block</span>
                            <p className="text-xs text-gray-500">Build block from scratch with custom items</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Template Selection */}
                {blockCreationType === 'template' && !selectedBlock && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Template
                    </label>
                    <div className="space-y-2">
                      {blockTemplates.map((template) => (
                        <label key={template.id} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="mr-3 mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{template.name}</div>
                            <div className="text-sm text-gray-600">{template.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Category: {template.category} • {template.items.length} items
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="block-completed"
                    checked={newBlock.completed}
                    onChange={(e) => setNewBlock({...newBlock, completed: e.target.checked})}
                    className="mr-2 rounded"
                  />
                  <label htmlFor="block-completed" className="text-sm text-gray-700">
                    Mark as Completed
                  </label>
                </div>
              </div>

              {/* Block Items Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Block Items</h4>
                  {(blockCreationType === 'custom' || selectedBlock) && (
                    <button
                      onClick={() => setShowItemModal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>

                {/* Template Preview */}
                {blockCreationType === 'template' && selectedTemplate && !selectedBlock && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h5 className="font-medium text-blue-900 mb-3">Template Preview</h5>
                    <div className="space-y-2">
                      {blockTemplates.find(t => t.id === selectedTemplate)?.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getDataTypeIcon(item.dataType)}</span>
                            <div>
                              <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                              {item.isRequired && <span className="text-red-500 ml-1">*</span>}
                              <div className="text-xs text-gray-500">ID: {item.itemId}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {item.dataType}
                            </span>
                            {Object.keys(item.validationRules).length > 0 && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                Rules
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Block Items */}
                {(blockCreationType === 'custom' || selectedBlock) && (
                  <div className="border border-gray-200 rounded-lg">
                    {newBlock.fields.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {newBlock.fields.map((field, index) => (
                          <div key={field.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{getDataTypeIcon(field.type)}</span>
                                <div>
                                  <div className="font-medium text-gray-900">{field.label}</div>
                                  <div className="text-sm text-gray-500">
                                    ID: {field.id} • Type: {field.type}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </div>
                                  {field.validation && (
                                    <div className="text-xs text-purple-600 mt-1">
                                      Validation: {field.validation}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(field.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="Remove Item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <List className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No items added yet</p>
                        <p className="text-xs">Add items to define the block structure</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddBlockModal(false);
                  setSelectedBlock(null);
                  resetBlockForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={selectedBlock ? handleUpdateBlock : handleAddBlock}
                disabled={!newBlock.name || (blockCreationType === 'template' && !selectedTemplate && !selectedBlock)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{selectedBlock ? 'Update Block' : 'Create Block'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Block Item</h3>
              <button 
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item ID *
                  </label>
                  <input
                    type="text"
                    value={newItem.itemId}
                    onChange={(e) => setNewItem({...newItem, itemId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., enterprise_name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier for this item</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Enterprise Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Type *
                  </label>
                  <select
                    value={newItem.dataType}
                    onChange={(e) => setNewItem({...newItem, dataType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select/Dropdown</option>
                    <option value="textarea">Textarea</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio Button</option>
                    <option value="email">Email</option>
                    <option value="tel">Telephone</option>
                    <option value="url">URL</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={newItem.maxLength}
                    onChange={(e) => setNewItem({...newItem, maxLength: parseInt(e.target.value) || 255})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="item-required"
                  checked={newItem.isRequired}
                  onChange={(e) => setNewItem({...newItem, isRequired: e.target.checked})}
                  className="mr-2 rounded"
                />
                <label htmlFor="item-required" className="text-sm text-gray-700">
                  Required Field
                </label>
              </div>

              {/* Options for Select/Radio */}
              {(newItem.dataType === 'select' || newItem.dataType === 'radio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter option value"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                      />
                      <button
                        onClick={handleAddOption}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    {newItem.options.length > 0 && (
                      <div className="border border-gray-200 rounded-md p-2 max-h-32 overflow-y-auto">
                        {newItem.options.map((option, index) => (
                          <div key={index} className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-700">{option}</span>
                            <button
                              onClick={() => handleRemoveOption(index)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Validation Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Validation Rules (JSON)
                </label>
                <div className="space-y-2">
                  <textarea
                    value={customValidationRule}
                    onChange={(e) => setCustomValidationRule(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder='{"min": 0, "max": 100, "pattern": "^[A-Z0-9]+$"}'
                  />
                  <button
                    onClick={handleAddValidationRule}
                    disabled={!customValidationRule.trim()}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    Add Validation Rule
                  </button>
                </div>
                
                {/* Current Validation Rules */}
                {Object.keys(newItem.validationRules).length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded p-3">
                    <h6 className="text-sm font-medium text-purple-900 mb-2">Current Validation Rules:</h6>
                    <pre className="text-xs text-purple-800 whitespace-pre-wrap">
                      {JSON.stringify(newItem.validationRules, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Common Validation Examples */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <h6 className="text-sm font-medium text-gray-900 mb-2">Common Validation Examples:</h6>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div><code>{"min": 0, "max": 100}</code> - Number range</div>
                    <div><code>{"minLength": 2, "maxLength": 50}</code> - Text length</div>
                    <div><code>{"pattern": "^[A-Z0-9]+$"}</code> - Regex pattern</div>
                    <div><code>{"email": true}</code> - Email validation</div>
                    <div><code>{"required": true}</code> - Required field</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowItemModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddItem();
                  setShowItemModal(false);
                }}
                disabled={!newItem.itemId || !newItem.itemName}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyConfiguration;