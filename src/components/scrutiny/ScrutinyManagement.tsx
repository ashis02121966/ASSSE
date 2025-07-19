import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, CheckCircle, AlertCircle, Clock, FileText, Send } from 'lucide-react';

interface ScrutinySurvey {
  id: string;
  enterpriseName: string;
  gstn: string;
  dslNumber: string;
  sector: string;
  status: 'submitted' | 'scrutiny' | 'approved' | 'rejected';
  lastModified: string;
  compiler?: string;
  scrutinizer?: string;
  commentsCount: number;
}

interface SurveyField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  value: any;
  required: boolean;
  readOnly?: boolean;
}

interface SurveyBlock {
  id: string;
  name: string;
  description?: string;
  fields: SurveyField[];
  completed: boolean;
}

interface ScrutinyComment {
  id: string;
  blockId: string;
  fieldId: string;
  comment: string;
  scrutinizer: string;
  timestamp: string;
  resolved: boolean;
}

const ScrutinyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSurvey, setSelectedSurvey] = useState<ScrutinySurvey | null>(null);
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [showScrutinyForm, setShowScrutinyForm] = useState(false);
  const [comments, setComments] = useState<ScrutinyComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFieldForComment, setSelectedFieldForComment] = useState<string | null>(null);

  // Mock scrutiny surveys data with GSTN
  const scrutinySurveys: ScrutinySurvey[] = [
    {
      id: '1',
      enterpriseName: 'ABC Manufacturing Ltd.',
      gstn: '27AABCU9603R1ZX',
      dslNumber: 'DSL001',
      sector: 'Manufacturing',
      status: 'submitted',
      lastModified: '2024-01-15',
      compiler: 'John Compiler',
      commentsCount: 0
    },
    {
      id: '2',
      enterpriseName: 'XYZ Services Pvt. Ltd.',
      gstn: '29AABCU9603R1ZY',
      dslNumber: 'DSL002',
      sector: 'Services',
      status: 'scrutiny',
      lastModified: '2024-01-14',
      compiler: 'Jane Compiler',
      scrutinizer: 'Mike Scrutinizer',
      commentsCount: 3
    },
    {
      id: '3',
      enterpriseName: 'PQR Construction Co.',
      gstn: '07AABCU9603R1ZZ',
      dslNumber: 'DSL003',
      sector: 'Construction',
      status: 'approved',
      lastModified: '2024-01-13',
      compiler: 'Sarah Compiler',
      scrutinizer: 'David Scrutinizer',
      commentsCount: 1
    },
    {
      id: '4',
      enterpriseName: 'LMN Trading Corp.',
      gstn: '19AABCU9603R1ZA',
      dslNumber: 'DSL004',
      sector: 'Trade',
      status: 'rejected',
      lastModified: '2024-01-12',
      compiler: 'Tom Compiler',
      scrutinizer: 'Lisa Scrutinizer',
      commentsCount: 5
    }
  ];

  // Mock survey blocks with GSTIN and DSL fields for scrutiny
  const surveyBlocks: SurveyBlock[] = [
    {
      id: 'block-0',
      name: 'Block 0: Identification of the Enterprise',
      description: 'Enterprise identification details',
      completed: true,
      fields: [
        { id: 'gstin', label: 'GSTIN', type: 'text', value: selectedSurvey?.gstn || '', required: true, readOnly: true },
        { id: 'dsl_number', label: 'DSL Number', type: 'text', value: selectedSurvey?.dslNumber || '', required: true, readOnly: true },
        { id: 'enterprise_name', label: 'Name of the Enterprise', type: 'text', value: selectedSurvey?.enterpriseName || '', required: true },
        { id: 'enterprise_address', label: 'Address of the Enterprise', type: 'textarea', value: '123 Industrial Area, Manufacturing Zone, Mumbai - 400001', required: true },
        { id: 'contact_person', label: 'Contact Person Name', type: 'text', value: 'Rajesh Kumar', required: true },
        { id: 'contact_phone', label: 'Contact Phone', type: 'text', value: '+91-9876543210', required: true },
        { id: 'contact_email', label: 'Contact Email', type: 'text', value: 'rajesh@abcmfg.com', required: false }
      ]
    },
    {
      id: 'block-1',
      name: 'Block 1: Operational Particulars',
      description: 'Details about the operational particulars of the enterprise',
      completed: true,
      fields: [
        { id: 'gstin_ref', label: 'GSTIN (Reference)', type: 'text', value: selectedSurvey?.gstn || '', required: false, readOnly: true },
        { id: 'dsl_ref', label: 'DSL Number (Reference)', type: 'text', value: selectedSurvey?.dslNumber || '', required: false, readOnly: true },
        { id: 'sector', label: 'Sector', type: 'select', value: 'Manufacturing', required: true },
        { id: 'type_of_organization', label: 'Type of Organization', type: 'select', value: 'Private Limited Company', required: true },
        { id: 'registration_status', label: 'Registration Status', type: 'select', value: 'Registered', required: true },
        { id: 'major_activity', label: 'Major Activity Code (NIC 2008)', type: 'text', value: '25111', required: true },
        { id: 'accounting_period', label: 'Accounting Period', type: 'text', value: '04/2023 to 03/2024', required: true }
      ]
    },
    {
      id: 'block-2',
      name: 'Block 2: Employment and Labour Cost',
      description: 'Details of employment and labour cost during the accounting period',
      completed: false,
      fields: [
        { id: 'gstin_emp', label: 'GSTIN (Reference)', type: 'text', value: selectedSurvey?.gstn || '', required: false, readOnly: true },
        { id: 'dsl_emp', label: 'DSL Number (Reference)', type: 'text', value: selectedSurvey?.dslNumber || '', required: false, readOnly: true },
        { id: 'total_employees', label: 'Total Number of Employees', type: 'number', value: '150', required: true },
        { id: 'male_employees', label: 'Male Employees', type: 'number', value: '95', required: true },
        { id: 'female_employees', label: 'Female Employees', type: 'number', value: '55', required: true },
        { id: 'total_wages', label: 'Total Wages/Salaries (Rs.)', type: 'number', value: '12500000', required: true },
        { id: 'working_days', label: 'Number of Working Days', type: 'number', value: '300', required: true }
      ]
    }
  ];

  // Mock comments
  const mockComments: ScrutinyComment[] = [
    {
      id: '1',
      blockId: 'block-1',
      fieldId: 'major_activity',
      comment: 'Please verify the NIC code. It seems incorrect for the described activity.',
      scrutinizer: 'Mike Scrutinizer',
      timestamp: '2024-01-14 10:30:00',
      resolved: false
    },
    {
      id: '2',
      blockId: 'block-2',
      fieldId: 'total_wages',
      comment: 'The total wages amount seems unusually high. Please double-check the calculation.',
      scrutinizer: 'Mike Scrutinizer',
      timestamp: '2024-01-14 11:15:00',
      resolved: false
    }
  ];

  const filteredSurveys = scrutinySurveys.filter(survey => {
    const matchesSearch = survey.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.gstn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.dslNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || survey.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"><FileText size={12} className="mr-1" />Submitted</span>;
      case 'scrutiny':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center"><AlertCircle size={12} className="mr-1" />In Scrutiny</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"><CheckCircle size={12} className="mr-1" />Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center"><AlertCircle size={12} className="mr-1" />Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const handleStartScrutiny = (survey: ScrutinySurvey) => {
    setSelectedSurvey(survey);
    setCurrentBlock(0);
    setShowScrutinyForm(true);
    setComments(mockComments);
  };

  const handleAddComment = (fieldId: string) => {
    if (!newComment.trim()) return;
    
    const comment: ScrutinyComment = {
      id: Date.now().toString(),
      blockId: surveyBlocks[currentBlock].id,
      fieldId: fieldId,
      comment: newComment,
      scrutinizer: 'Current Scrutinizer',
      timestamp: new Date().toLocaleString(),
      resolved: false
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    setSelectedFieldForComment(null);
  };

  const handleApproveBlock = () => {
    alert('Block approved successfully!');
  };

  const handleRejectBlock = () => {
    alert('Block rejected. Comments have been added for the compiler to review.');
  };

  const handleNextBlock = () => {
    if (currentBlock < surveyBlocks.length - 1) {
      setCurrentBlock(currentBlock + 1);
    }
  };

  const handlePreviousBlock = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1);
    }
  };

  const handleFinalApproval = () => {
    alert('Survey approved and finalized!');
    setShowScrutinyForm(false);
    setSelectedSurvey(null);
  };

  const getFieldComments = (fieldId: string) => {
    return comments.filter(c => c.fieldId === fieldId && c.blockId === surveyBlocks[currentBlock].id);
  };

  const renderScrutinyForm = () => {
    const block = surveyBlocks[currentBlock];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{block.name}</h2>
            <p className="text-sm text-gray-600">{block.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Block {currentBlock + 1} of {surveyBlocks.length}
            </span>
            <button
              onClick={() => setShowScrutinyForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Enterprise Info Header */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Enterprise Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Enterprise:</span>
              <p className="text-blue-900">{selectedSurvey?.enterpriseName}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">GSTIN:</span>
              <p className="text-blue-900 font-mono">{selectedSurvey?.gstn}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">DSL Number:</span>
              <p className="text-blue-900 font-mono">{selectedSurvey?.dslNumber}</p>
            </div>
          </div>
        </div>

        {/* Scrutiny Form Fields */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {block.fields.map((field) => {
              const fieldComments = getFieldComments(field.id);
              return (
                <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {field.readOnly && <span className="text-blue-500 ml-1">(Read-only)</span>}
                    </label>
                    <button
                      onClick={() => setSelectedFieldForComment(field.id)}
                      className="text-orange-600 hover:text-orange-800 p-1 rounded"
                      title="Add Comment"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      readOnly
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 ${
                        fieldComments.length > 0 ? 'border-orange-300 bg-orange-50' : ''
                      }`}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={field.value}
                      disabled
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 ${
                        fieldComments.length > 0 ? 'border-orange-300 bg-orange-50' : ''
                      }`}
                    >
                      <option value={field.value}>{field.value}</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      readOnly
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 ${
                        fieldComments.length > 0 ? 'border-orange-300 bg-orange-50' : ''
                      }`}
                    />
                  )}
                  
                  {/* Field Comments */}
                  {fieldComments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {fieldComments.map((comment) => (
                        <div key={comment.id} className="bg-orange-50 border border-orange-200 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-orange-800">{comment.comment}</p>
                              <p className="text-xs text-orange-600 mt-1">
                                {comment.scrutinizer} • {comment.timestamp}
                              </p>
                            </div>
                            {!comment.resolved && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Comment Form */}
                  {selectedFieldForComment === field.id && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your scrutiny comment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => setSelectedFieldForComment(null)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddComment(field.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <Send size={14} />
                          <span>Add Comment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrutiny Actions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Block Scrutiny Actions</h4>
          <div className="flex space-x-3">
            <button
              onClick={handleApproveBlock}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Approve Block</span>
            </button>
            <button
              onClick={handleRejectBlock}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <AlertCircle size={16} />
              <span>Reject Block</span>
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousBlock}
            disabled={currentBlock === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Block
          </button>
          
          <div className="flex space-x-3">
            {currentBlock === surveyBlocks.length - 1 ? (
              <button
                onClick={handleFinalApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Final Approval
              </button>
            ) : (
              <button
                onClick={handleNextBlock}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Block
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (showScrutinyForm) {
    return (
      <div className="space-y-6">
        {renderScrutinyForm()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Scrutiny Management</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Search size={16} />
          <span>Survey Scrutiny</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by enterprise name, GSTN, or DSL..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="scrutiny">In Scrutiny</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Surveys for Scrutiny Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Surveys for Scrutiny</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enterprise Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSTN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DSL Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{survey.enterpriseName}</div>
                    {survey.compiler && (
                      <div className="text-sm text-gray-500">Compiler: {survey.compiler}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{survey.gstn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{survey.dslNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{survey.sector}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(survey.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{survey.commentsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{survey.lastModified}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => alert(`Viewing details for ${survey.enterpriseName}`)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleStartScrutiny(survey)}
                        className="text-orange-600 hover:text-orange-800 p-1 rounded"
                        title="Start Scrutiny"
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScrutinyManagement;