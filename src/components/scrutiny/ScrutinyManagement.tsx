import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, Send, ArrowLeft, Eye, ChevronDown } from 'lucide-react';
import { Survey, ScrutinyComment } from '../../types';
import { surveyBlocks } from '../../data/surveyBlocks';

const ScrutinyManagement: React.FC = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [comments, setComments] = useState<ScrutinyComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  const mockSurveys: Survey[] = [
    {
      id: '1',
      frameId: 'frame-1',
      enterpriseId: 'enterprise-1',
      status: 'scrutiny',
      lastModified: new Date().toISOString(),
      compiler: 'John Compiler', 
      blocks: surveyBlocks.map(block => ({
        ...block,
        completed: true,
        fields: block.fields.map(field => ({
          ...field,
          value: field.type === 'number' ? '1000' + Math.floor(Math.random() * 9000).toString() : 
                 field.type === 'text' ? 'Sample ' + field.label : 
                 field.type === 'textarea' ? 'Detailed information for ' + field.label : 
                 field.type === 'date' ? '2023-01-01' : 
                 field.type === 'select' ? 'Option 1' : ''
        }))
      }))
    }
  ];

  const mockComments: ScrutinyComment[] = [
    {
      id: '1',
      blockId: 'block-1',
      fieldId: 'address',
      comment: 'Please provide complete address with PIN code',
      scrutinizer: 'Jane Scrutinizer',
      timestamp: new Date().toISOString(),
      resolved: false
    },
    {
      id: '2',
      blockId: 'block-2',
      fieldId: 'revenue',
      comment: 'Revenue figure seems unusually high for this sector. Please verify.',
      scrutinizer: 'Mike Reviewer',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      resolved: false
    }
  ];

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedField || !selectedSurvey) return;

    const comment: ScrutinyComment = {
      id: Date.now().toString(),
      blockId: selectedSurvey.blocks[currentBlock].id,
      fieldId: selectedField,
      comment: newComment,
      scrutinizer: 'Current Scrutinizer',
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setSelectedField('');
    alert('Comment added successfully');
  };

  const handleApprove = () => {
    if (!selectedSurvey) return;
    console.log('Approving survey:', selectedSurvey.id);
    // Update survey status to approved
  };

  const handleReject = () => {
    if (!selectedSurvey) return;
    console.log('Rejecting survey:', selectedSurvey.id);
    // Update survey status to rejected and send back to compiler
  };

  const getBlockComments = (blockId: string) => {
    return [...mockComments, ...comments].filter(comment => comment.blockId === blockId);
  };

  const getFieldComments = (blockId: string, fieldId: string) => {
    return [...mockComments, ...comments].filter(
      comment => comment.blockId === blockId && comment.fieldId === fieldId
    );
  };

  const handleNavigateToBlock = (index: number) => {
    setCurrentBlock(index);
    setShowBlockDropdown(false);
  };
  
  const renderGridBlock = (block: any) => {
    const isDisabled = true; // Always disabled in scrutiny mode
    
    // Special handling for Block 4 - Working Capital calculations
    const isBlock4 = block.id === 'block-4';
    const isBlock4CalculatedRow = (rowIndex: number) => {
      if (!isBlock4) return false;
      // Rows 3, 6, 10, 14, 15 are calculated rows in Block 4
      return [2, 5, 9, 13, 14].includes(rowIndex); // 0-based index
    };
    
    // Helper function to check if a field should be hidden in Block 5
    const isBlock5HiddenField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-5') return false;
      // For Part B items (rows 13-16, 0-based index: 12-15), hide avg_days_worked and total_persons_worked
      if (rowIndex >= 12 && (columnId === 'avg_days_worked' || columnId === 'total_persons_worked')) {
        return true;
      }
      return false;
    };

    // Helper function to check if a row is calculated in Block 5
    const isBlock5CalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-5') return false;
      // Rows 9, 10, 16 are calculated rows in Block 5 (0-based index: 8, 9, 15)
      return [8, 9, 15].includes(rowIndex);
    };

    // Helper function to check if a row is calculated in Block 6A
    const isBlock6ACalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-6a') return false;
      // Row 8 is calculated row in Block 6A (0-based index: 7)
      return rowIndex === 7;
    };

    // Helper function to check if a field should be disabled in Block 6A
    const isBlock6ADisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-6a') return false;
      // For row 8 (index 7), disable imported and import_percentage columns
      if (rowIndex === 7 && (columnId === 'imported' || columnId === 'import_percentage')) {
        return true;
      }
      // For rows 7 and 8 (index 6 and 7), disable item_description and item_code as they are pre-filled
      if ((rowIndex === 6 || rowIndex === 7) && (columnId === 'item_description' || columnId === 'item_code')) {
        return true;
      }
      return false;
    };

    // Helper function to check if a row is calculated in Block 6B
    const isBlock6BCalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-6b') return false;
      // Row 11 is calculated row in Block 6B (0-based index: 10)
      return rowIndex === 10;
    };

    // Helper function to check if a field should be disabled in Block 6B
    const isBlock6BDisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-6b') return false;
      // For row 11 (index 10), disable imported and import_percentage columns
      if (rowIndex === 10 && (columnId === 'imported' || columnId === 'import_percentage')) {
        return true;
      }
      // For rows 10 and 11 (index 9 and 10), disable item_description and item_code as they are pre-filled
      if ((rowIndex === 9 || rowIndex === 10) && (columnId === 'item_description' || columnId === 'item_code')) {
        return true;
      }
      return false;
    };

    // Helper function to check if a row is calculated in Block 7A
    const isBlock7ACalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-7a') return false;
      // Row 8 is calculated row in Block 7A (0-based index: 7)
      return rowIndex === 7;
    };

    // Helper function to check if a field should be disabled in Block 7A
    const isBlock7ADisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-7a') return false;
      // For row 7 (index 6), disable item_description and item_code as they are pre-filled
      if (rowIndex === 6 && (columnId === 'item_description' || columnId === 'item_code')) {
        return true;
      }
      // For row 8 (index 7), disable item_description, item_code, exported, and export_percentage
      if (rowIndex === 7 && (columnId === 'item_description' || columnId === 'item_code' || columnId === 'exported' || columnId === 'export_percentage')) {
        return true;
      }
      // For row 8 (index 7), also disable receipt as it's calculated
      if (rowIndex === 7 && columnId === 'receipt') {
        return true;
      }
      // For row 9 (index 8), disable item_description, item_code, exported, and export_percentage
      if (rowIndex === 8 && (columnId === 'item_description' || columnId === 'item_code' || columnId === 'exported' || columnId === 'export_percentage')) {
        return true;
      }
      return false;
    };
    
    // Helper function to check if a row is calculated in Block 7B
    const isBlock7BCalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-7b') return false;
      // Row 11 is calculated row in Block 7B (0-based index: 10)
      return rowIndex === 10;
    };

    // Helper function to check if a field should be disabled in Block 7B
    const isBlock7BDisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-7b') return false;
      // For row 10 (index 9), disable service_description and item_code as they are pre-filled
      if (rowIndex === 9 && (columnId === 'service_description' || columnId === 'item_code')) {
        return true;
      }
      // For rows 11-15 (index 10-14), disable service_description and item_code as they are pre-filled
      if (rowIndex >= 10 && (columnId === 'service_description' || columnId === 'item_code')) {
        return true;
      }
      // For row 11 (index 10), also disable receipt as it's calculated
      if (rowIndex === 10 && columnId === 'receipt') {
        return true;
      }
      return false;
    };
    
    // Helper function to check if a row is calculated in Block 7C
    const isBlock7CCalculatedRow = (blockId: string, rowIndex: number) => {
      if (blockId !== 'block-7c') return false;
      // Rows 1, 2, 6 are calculated rows in Block 7C (0-based index: 0, 1, 5)
      return [0, 1, 5].includes(rowIndex);
    };

    // Helper function to check if a field should be disabled in Block 7C
    const isBlock7CDisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-7c') return false;
      // For all rows, disable sl_no and item_code as they are pre-filled
      if (columnId === 'sl_no' || columnId === 'item_code') {
        return true;
      }
      // For all rows, disable item_description as they are pre-filled
      if (columnId === 'item_description') {
        return true;
      }
      // For rows 1, 2, 6 (index 0, 1, 5), also disable receipt as it's calculated
      if ([0, 1, 5].includes(rowIndex) && columnId === 'receipt') {
        return true;
      }
      return false;
    };
    
    // Helper function to check if a field should be disabled in Block 8
    const isBlock8DisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-8') return false;
      // For all rows, disable sl_no, item_description, and item_code as they are pre-filled
      if (columnId === 'sl_no' || columnId === 'item_description' || columnId === 'item_code') {
        return true;
      }
      return false;
    };
    
    // Helper function to check if a field should be disabled in Block 9
    const isBlock9DisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-9') return false;
      // For all rows, disable sl_no and items as they are pre-filled
      if (columnId === 'sl_no' || columnId === 'items') {
        return true;
      }
      // Current period and percentage change are calculated/auto-filled, so disable them
      if (columnId === 'current_period' || columnId === 'percentage_change') {
        return true;
      }
      return false;
    };
    
    // Helper function to check if a field should be disabled in Block 10
    const isBlock10DisabledField = (blockId: string, rowIndex: number, columnId: string) => {
      if (blockId !== 'block-10') return false;
      // For all rows, disable sl_no and items as they are pre-filled
      if (columnId === 'sl_no' || columnId === 'items') {
        return true;
      }
      // Current period is calculated/auto-filled, so disable it
      if (columnId === 'current_period') {
        return true;
      }
      return false;
    };
    
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                {block.gridColumns?.map((column: any) => (
                  <th key={column.id} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Special heading for Block 11 */}
              {block.id === 'block-11' && (
                <tr>
                  <td colSpan={5} className="px-3 py-2 bg-blue-50 border border-gray-300">
                    <div className="text-sm font-medium text-blue-900">
                      ICT Usage Assessment - Information and Communication Technology usage during the accounting period
                    </div>
                  </td>
                </tr>
              )}
              
              {block.gridData?.map((row: any, rowIndex: number) => (
                <React.Fragment key={rowIndex}>
                  {/* Special sub-heading for Block 11 before row 3 */}
                  {block.id === 'block-11' && rowIndex === 2 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-2 bg-yellow-50 border border-gray-300">
                        <div className="text-sm font-medium text-gray-700">
                          For which of the following activities did the enterprise use the Internet for entrepreneurial purpose? (Rows 3-10)
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  <tr className={`hover:bg-gray-50 ${
                    block.id === 'block-11' && rowIndex === 2 ? 'border-t-2 border-yellow-300' : ''
                  }`}>
                    {block.gridColumns?.map((column: any) => (
                      <td key={column.id} className={`border border-gray-300 px-4 py-2 ${
                        isBlock5HiddenField(block.id, rowIndex, column.id) ? 'bg-gray-100' : ''
                      }`}>
                        {isBlock5HiddenField(block.id, rowIndex, column.id) ? (
                          <span className="text-gray-400">N/A</span>
                        ) : column.id === 'yes_no' && block.id === 'block-11' ? (
                          <span className="text-sm text-gray-900">
                            {row[column.id] === '1' ? 'Yes (1)' : row[column.id] === '2' ? 'No (2)' : 'Not selected'}
                          </span>
                        ) : (
                          <input
                            type={column.type}
                            value={row[column.id] || ''}
                            disabled={isDisabled || column.id === 'sl_no' || column.id === 'items' || column.id === 'category_of_staff' || 
                                     (isBlock4 && isBlock4CalculatedRow(rowIndex) && (column.id === 'closing' || column.id === 'opening')) ||
                                     (isBlock5CalculatedRow(block.id, rowIndex)) ||
                                     (isBlock6ACalculatedRow(block.id, rowIndex) && column.id === 'expenditure') ||
                                     (isBlock6ADisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock6BCalculatedRow(block.id, rowIndex) && column.id === 'expenditure') ||
                                     (isBlock6BDisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock7ACalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                     (isBlock7ADisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock7BCalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                     (isBlock7BDisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock7CCalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                     (isBlock7CDisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock8DisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock9DisabledField(block.id, rowIndex, column.id)) ||
                                     (isBlock10DisabledField(block.id, rowIndex, column.id))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {(isBlock4 || block.id === 'block-5') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">* Give reasons in the remarks for negative values and abnormal variation in opening and closing values for working capital.</p>
              <p>** If outstanding loans include interest, remarks may be given.</p>
              <p className="mt-2 text-xs"><strong>Note:</strong> Fields marked as "Calculated" are automatically computed based on other field values.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-6a' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• Users can add up to 6 custom rows for trading items</p>
              <p className="mb-1">• Row 7 is pre-filled with "other trading items" (CPC: 60001)</p>
              <p className="mb-1">• Row 8 automatically calculates total purchase value (items 1 to 7)</p>
              <p className="mb-1">• Import percentage (column 6) is only enabled when "Imported" is set to "yes" (1)</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Row 8 expenditure is automatically calculated and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-6b' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• Users can add up to 9 custom rows for input items (goods and services)</p>
              <p className="mb-1">• Row 10 is pre-filled with "others" (CPC: 70001)</p>
              <p className="mb-1">• Row 11 automatically calculates total of input items (items 1 to 10)</p>
              <p className="mb-1">• Import percentage (column 6) is only enabled when "Imported" is set to "yes" (1)</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Row 11 expenditure is automatically calculated and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-6c' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• All item descriptions and codes are pre-filled and cannot be edited</p>
              <p className="mb-1">• Only the expenditure column (column 4) is editable for rows 1-10 and 12-14</p>
              <p className="mb-1">• Row 11 automatically calculates: Sum of Block 6C items 1-10 + Block 6B row 11 total</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Row 11 expenditure is automatically calculated and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-7a' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• Users can add data for rows 1-6 (custom trading items)</p>
              <p className="mb-1">• Row 7 is pre-filled with "other trading items" (CPC: 80001)</p>
              <p className="mb-1">• Row 8 automatically calculates total receipt of goods traded (items 1 to 7)</p>
              <p className="mb-1">• Row 9 is for "Percentage of receipts through online, if any" (CPC: 80011)</p>
              <p className="mb-1">• Export percentage (column 6) is only enabled when "Exported" is set to "yes" (1)</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Row 8 receipt is automatically calculated and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-7b' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• Users can add data for rows 1-9 (custom service items)</p>
              <p className="mb-1">• Row 10 is pre-filled with "Others" (CPC: 90001)</p>
              <p className="mb-1">• Row 11 automatically calculates total receipts from services (items 1 to 10)</p>
              <p className="mb-1">• Rows 12-15 are for specific service categories with pre-filled descriptions</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Row 11 receipt is automatically calculated and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-7c' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• Row 1 automatically calculates: Block 4 item 4 (closing - opening)</p>
              <p className="mb-1">• Row 2 automatically calculates: Block 4 item 5 (closing - opening)</p>
              <p className="mb-1">• Rows 3, 4, 5, 7, 8 are editable for manual entry</p>
              <p className="mb-1">• Row 6 automatically calculates: (Row 1 + Row 3 + Row 4 + Row 5) + Block 7B Row 11 total</p>
              <p className="text-xs mt-2"><strong>Note:</strong> Calculated fields are automatically computed and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-8' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• All item descriptions and codes are pre-filled and cannot be edited</p>
              <p className="mb-1">• Only the receipt column (column 4) is editable for all rows</p>
              <p className="mb-1">• Enter amounts for taxes, subsidies, and distributive expenses as applicable</p>
              <p className="text-xs mt-2"><strong>Note:</strong> All receipt fields are manually editable for data entry.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-9' && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• This is a summary block for internal use only</p>
              <p className="mb-1">• Current accounting period values are automatically calculated from other blocks</p>
              <p className="mb-1">• Last accounting period values are manually entered for comparison</p>
              <p className="mb-1">• Percentage change is automatically calculated when both periods have values</p>
              <p className="mb-1">• Remarks column is available for additional notes and explanations</p>
              <p className="text-xs mt-2"><strong>Note:</strong> All calculated fields are automatically computed and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {block.id === 'block-10' && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="text-sm text-indigo-800">
              <p className="font-medium mb-2">Notes:</p>
              <p className="mb-1">• This is a summary block (ratios) for internal use only</p>
              <p className="mb-1">• Current accounting period ratios are automatically calculated from other blocks</p>
              <p className="mb-1">• Last accounting period values are manually entered for comparison</p>
              <p className="mb-1">• Remarks column is available for additional notes and explanations</p>
              <p className="mb-1">• Row 1: Working capital to total output ratio</p>
              <p className="mb-1">• Row 2: Total output to total input ratio</p>
              <p className="mb-1">• Row 3: Wage/salary per person directly associated with production</p>
              <p className="mb-1">• Row 4: Wage/salary per supervisor</p>
              <p className="text-xs mt-2"><strong>Note:</strong> All ratio calculations are automatically computed and cannot be manually edited.</p>
            </div>
          </div>
        )}
        
        {/* Additional notes for Block 11 */}
        {block.id === 'block-11' && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-800">
              <p className="font-medium mb-2">Review Notes:</p>
              <ul className="space-y-1">
                <li>• Verify responses align with enterprise's actual ICT usage</li>
                <li>• Check consistency between web presence and online activities</li>
                <li>• Ensure all mandatory fields are completed</li>
                <li>• Review responses for logical consistency</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderBlock5Fields = (block: any) => {
    const workingDaysField = block.fields.find((f: any) => f.id === 'working_days_enterprise');
    const partAFields = block.fields.filter((f: any) => f.partA);
    const partBFields = block.fields.filter((f: any) => f.partB);
    
    // Group Part A fields by category
    const partACategories = partAFields.reduce((acc: any, field: any) => {
      const category = field.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Group Part B fields by category
    const partBCategories = partBFields.reduce((acc: any, field: any) => {
      const category = field.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    }, {} as Record<string, any[]>);
    
    return (
      <div className="space-y-8">
        {/* Working Days Field */}
        {workingDaysField && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {workingDaysField.label}
              {workingDaysField.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={workingDaysField.value}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        )}
        
        {/* Part A: Details for each category of staff */}
        <div className="bg-white border border-gray-300 rounded-lg">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <h4 className="font-semibold text-gray-900">Part A: Details for each category of staff employed by the enterprise directly/through contractor (on the payroll)</h4>
          </div>
          
          <div className="p-4 space-y-6">
            {Object.entries(partACategories).map(([category, fields]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h5 className="font-medium text-gray-800">
                    <span className="text-blue-600">Sl. No. ({category.split('.')[0]})</span> | 
                    <span className="ml-2">Category of staff: {category.split('. ')[1]}</span>
                  </h5>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fields.map((field: any) => {
                    const fieldComments = getFieldComments(block.id, field.id);
                    const isCalculatedField = field.calculated;
                    
                    return (
                      <div key={field.id} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label.includes('[Calculated') ? (
                            <>
                              {field.label.split('[')[0].trim()}
                              <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Calculated
                              </span>
                            </>
                          ) : (
                            field.label
                          )}
                          {fieldComments.length > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {fieldComments.length} comment{fieldComments.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </label>
                        
                        <div className="relative">
                          <input
                            type="number"
                            value={field.value}
                            disabled
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isCalculatedField ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                          />
                          
                          <button
                            onClick={() => setSelectedField(field.id)}
                            className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>

                        {/* Field Comments */}
                        {fieldComments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {fieldComments.map((comment) => (
                              <div key={comment.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <p className="text-sm text-gray-800">{comment.comment}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-600">
                                    {comment.scrutinizer} • {new Date(comment.timestamp).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    comment.resolved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {comment.resolved ? 'Resolved' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Part B: Other details for all categories of staff combined */}
        <div className="bg-white border border-gray-300 rounded-lg">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <h4 className="font-semibold text-gray-900">Part B: Other details for all categories of staff combined (items 1 to 6 and 9)</h4>
          </div>
          
          <div className="p-4 space-y-6">
            {Object.entries(partBCategories).map(([category, fields]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h5 className="font-medium text-gray-800">
                    <span className="text-blue-600">Sl. No. ({category.split('.')[0]})</span> | 
                    <span className="ml-2">Category of staff: {category.split('. ')[1]}</span>
                  </h5>
                </div>
                
                <div className="p-4">
                  {fields.map((field: any) => {
                    const fieldComments = getFieldComments(block.id, field.id);
                    const isCalculatedField = field.calculated;
                    
                    return (
                      <div key={field.id} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label.includes('[Calculated') ? (
                            <>
                              {field.label.split('[')[0].trim()}
                              <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Calculated
                              </span>
                            </>
                          ) : (
                            field.label
                          )}
                          {fieldComments.length > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {fieldComments.length} comment{fieldComments.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </label>
                        
                        <div className="relative">
                          <input
                            type="number"
                            value={field.value}
                            disabled
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isCalculatedField ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                          />
                          
                          <button
                            onClick={() => setSelectedField(field.id)}
                            className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>

                        {/* Field Comments */}
                        {fieldComments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {fieldComments.map((comment) => (
                              <div key={comment.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <p className="text-sm text-gray-800">{comment.comment}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-gray-600">
                                    {comment.scrutinizer} • {new Date(comment.timestamp).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    comment.resolved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {comment.resolved ? 'Resolved' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!selectedSurvey) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Scrutiny Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Surveys for Scrutiny</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Survey ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DSL ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compiler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSurveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{survey.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{survey.frameId || 'DSL001'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Enterprise {survey.enterpriseId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{survey.compiler}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        survey.status === 'scrutiny' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(survey.lastModified).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedSurvey(survey)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const currentBlockData = selectedSurvey.blocks[currentBlock];
  const blockComments = getBlockComments(currentBlockData.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedSurvey(null)}
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            title="Back to Survey List"
          >
            <ArrowLeft size={16} />
            <span>Back to Survey List</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Scrutiny Review
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReject}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle size={16} />
            <span>Reject</span>
          </button>
          <button
            onClick={handleApprove}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={16} />
            <span>Approve</span>
          </button>
        </div>
      </div>

      {/* Block Navigation */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900 mr-3">Survey Blocks</h3>
            <div className="relative">
              <button 
                onClick={() => setShowBlockDropdown(!showBlockDropdown)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium flex items-center"
              >
                {selectedSurvey.blocks[currentBlock].name.split(':')[0]}
                <ChevronDown size={16} className="ml-2" />
              </button>
              
              {showBlockDropdown && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                  {selectedSurvey.blocks.map((block, index) => (
                    <button
                      key={block.id}
                      onClick={() => handleNavigateToBlock(index)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        index === currentBlock ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {block.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {selectedSurvey.blocks.map((block, index) => {
              const blockCommentCount = getBlockComments(block.id).length;
              return (
                <button
                  key={block.id}
                  onClick={() => setCurrentBlock(index)}
                  className={`relative px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    index === currentBlock
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                  {blockCommentCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {blockCommentCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Data */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentBlockData.name}</h3>
          {currentBlockData.description && (
            <p className="text-sm text-gray-600 mb-6">{currentBlockData.description}</p>
          )}
          
          <div className="space-y-6">
            {currentBlockData.isGrid ? (
              renderGridBlock(currentBlockData)
            ) : currentBlockData.id === 'block-5' ? (
              <div className="space-y-6">
                {/* Working Days Field */}
                {currentBlockData.fields.map((field: any) => (
                  <div key={field.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="number"
                      value={field.value}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                ))}
                
                {/* Grid for employment data */}
                {renderGridBlock(currentBlockData)}
              </div>
            ) : (
              <div className="space-y-6">
                {currentBlockData.fields.map((field: any) => {
                  const fieldComments = getFieldComments(currentBlockData.id, field.id);
                  const isCalculatedField = currentBlockData.id === 'block-5' && (
                    field.id === 'staff_9_avg_days' || field.id === 'staff_9_total_persons' || field.id === 'staff_9_wages' ||
                    field.id === 'staff_10_avg_days' || field.id === 'staff_10_total_persons' || field.id === 'staff_10_wages' ||
                    field.id === 'compensation_total'
                  );
                  
                  return (
                    <div key={field.id} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {isCalculatedField && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Calculated
                          </span>
                        )}
                        {fieldComments.length > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            {fieldComments.length} comment{fieldComments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </label>
                      
                      <div className="relative">
                        {field.type === 'textarea' ? (
                          <textarea
                            value={field.value}
                            disabled
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isCalculatedField ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                            rows={3}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={field.value}
                            disabled
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isCalculatedField ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                          />
                        )}
                        
                        <button
                          onClick={() => setSelectedField(field.id)}
                          className="absolute right-2 top-2 text-blue-600 hover:text-blue-800"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>

                      {/* Field Comments */}
                      {fieldComments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {fieldComments.map((comment) => (
                            <div key={comment.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <p className="text-sm text-gray-800">{comment.comment}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-600">
                                  {comment.scrutinizer} • {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  comment.resolved 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {comment.resolved ? 'Resolved' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Comments Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Field
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a field...</option>
                {currentBlockData.fields.map((field: any) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>

            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || !selectedField}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              <span>Add Comment</span>
            </button>
          </div>

          {/* All Comments for Current Block */}
          {blockComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Block Comments</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {blockComments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {currentBlockData.fields.find((f: any) => f.id === comment.fieldId)?.label}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {comment.scrutinizer} • {new Date(comment.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrutinyManagement;