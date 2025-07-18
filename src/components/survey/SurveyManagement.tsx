import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, ArrowRight, Send, Eye, Edit, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Survey, SurveyBlock, SurveyField } from '../../types';
import { surveyBlocks } from '../../data/surveyBlocks';

const SurveyManagement: React.FC = () => {
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);

  const mockSurveys: Survey[] = [
    {
      id: '1',
      frameId: 'frame-1',
      enterpriseId: 'enterprise-1',
      status: 'draft',
      lastModified: new Date().toISOString(), 
      blocks: surveyBlocks
    }
  ];

  const handleFieldChange = (blockId: string, fieldId: string, value: any) => {
    if (!currentSurvey) return;
    
    setAutoSaveStatus('saving');
    
    const updatedSurvey = {
      ...currentSurvey,
      blocks: currentSurvey.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              fields: block.fields.map(field =>
                field.id === fieldId ? { ...field, value } : field
              )
            }
          : block
      )
    };
    
    // Handle Block 5 calculations
    if (blockId === 'block-5') {
      // Block 5 calculations will be handled in handleGridDataChange
    }
    
    setCurrentSurvey(updatedSurvey);
    
    // Simulate auto-save
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 800);
  };

  const handleGridDataChange = (blockId: string, rowIndex: number, columnId: string, value: any) => {
    if (!currentSurvey) return;
    
    setAutoSaveStatus('saving');
    
    const updatedSurvey = {
      ...currentSurvey,
      blocks: currentSurvey.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              gridData: block.gridData?.map((row, index) =>
                index === rowIndex ? { ...row, [columnId]: value } : row
              ) || []
            }
          : block
      )
    };
    
    // Handle Block 5 calculations
    if (blockId === 'block-5') {
      const block5 = updatedSurvey.blocks.find(b => b.id === 'block-5');
      if (block5 && block5.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block5.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Calculate row 9 (sum of rows 7 + 8) - index 8 (sum of index 6 + 7)
        const row7AvgDays = getRowValue(6, 'avg_days_worked');
        const row8AvgDays = getRowValue(7, 'avg_days_worked');
        const row7TotalPersons = getRowValue(6, 'total_persons_worked');
        const row8TotalPersons = getRowValue(7, 'total_persons_worked');
        const row7Wages = getRowValue(6, 'total_wages_salaries');
        const row8Wages = getRowValue(7, 'total_wages_salaries');
        
        // Calculate row 10 (sum of rows 1-6 and 9) - index 9 (sum of index 0-5 and 8)
        const totalAvgDays = [0,1,2,3,4,5].reduce((sum, i) => sum + getRowValue(i, 'avg_days_worked'), 0) + (row7AvgDays + row8AvgDays);
        const totalPersons = [0,1,2,3,4,5].reduce((sum, i) => sum + getRowValue(i, 'total_persons_worked'), 0) + (row7TotalPersons + row8TotalPersons);
        const totalWages = [0,1,2,3,4,5].reduce((sum, i) => sum + getRowValue(i, 'total_wages_salaries'), 0) + (row7Wages + row8Wages);
        
        // Calculate row 16 (sum of row 10 + 13 + 14 + 15) - index 15 (sum of index 9 + 12 + 13 + 14)
        const bonus = getRowValue(12, 'total_wages_salaries');
        const providentFund = getRowValue(13, 'total_wages_salaries');
        const staffWelfare = getRowValue(14, 'total_wages_salaries');
        const compensationTotal = totalWages + bonus + providentFund + staffWelfare;
        
        // Update calculated rows
        block5.gridData = block5.gridData.map((row, index) => {
          switch (index) {
            case 8: // Row 9
              return {
                ...row,
                avg_days_worked: (row7AvgDays + row8AvgDays).toString(),
                total_persons_worked: (row7TotalPersons + row8TotalPersons).toString(),
                total_wages_salaries: (row7Wages + row8Wages).toString()
              };
            case 9: // Row 10
              return {
                ...row,
                avg_days_worked: totalAvgDays.toString(),
                total_persons_worked: totalPersons.toString(),
                total_wages_salaries: totalWages.toString()
              };
            case 15: // Row 16
              return {
                ...row,
                avg_days_worked: '',
                total_persons_worked: '',
                total_wages_salaries: compensationTotal.toString()
              };
            default:
              return row;
          }
        });
      }
    }
    
    // Handle Block 6A calculations
    if (blockId === 'block-6a') {
      const block6a = updatedSurvey.blocks.find(b => b.id === 'block-6a');
      if (block6a && block6a.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block6a.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Calculate row 8 (sum of rows 1-7) - index 7 (sum of index 0-6)
        const totalExpenditure = [0,1,2,3,4,5,6].reduce((sum, i) => sum + getRowValue(i, 'expenditure'), 0);
        
        // Update calculated row 8
        block6a.gridData = block6a.gridData.map((row, index) => {
          if (index === 7) { // Row 8
            return {
              ...row,
              expenditure: totalExpenditure.toString(),
              imported: '', // Not entry enabled
              import_percentage: '' // Not entry enabled
            };
          }
          return row;
        });
      }
    }
    
    // Handle Block 6B calculations
    if (blockId === 'block-6b') {
      const block6b = updatedSurvey.blocks.find(b => b.id === 'block-6b');
      if (block6b && block6b.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block6b.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Calculate row 11 (sum of rows 1-10) - index 10
        const totalExpenditure = [0,1,2,3,4,5,6,7,8,9].reduce((sum, i) => sum + getRowValue(i, 'expenditure'), 0);
        
        // Update calculated row 11
        block6b.gridData = block6b.gridData.map((row, index) => {
          if (index === 10) { // Row 11
            return {
              ...row,
              expenditure: totalExpenditure.toString(),
              imported: '', // Not entry enabled
              import_percentage: '' // Not entry enabled
            };
          }
          return row;
        });
      }
    }
    
    // Handle Block 6C calculations
    if (blockId === 'block-6c') {
      const block6c = updatedSurvey.blocks.find(b => b.id === 'block-6c');
      const block6b = updatedSurvey.blocks.find(b => b.id === 'block-6b');
      if (block6c && block6c.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block6c.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Get Block 6B row 11 total (index 10)
        const block6bTotal = block6b && block6b.gridData ? 
          parseFloat(block6b.gridData[10]?.expenditure || '0') || 0 : 0;
        
        // Calculate row 11 (sum of rows 1-10) - index 10
        const totalExpenditure = [0,1,2,3,4,5,6,7,8,9].reduce((sum, i) => sum + getRowValue(i, 'expenditure'), 0) + block6bTotal;
        
        // Update calculated row 11
        block6c.gridData = block6c.gridData.map((row, index) => {
          if (index === 10) { // Row 11
            return {
              ...row,
              expenditure: totalExpenditure.toString()
            };
          }
          return row;
        });
      }
    }
    
    // Handle Block 7A calculations
    if (blockId === 'block-7a') {
      const block7a = updatedSurvey.blocks.find(b => b.id === 'block-7a');
      if (block7a && block7a.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block7a.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Calculate row 8 (sum of rows 1-7) - index 7 (sum of index 0-6)
        const totalReceipt = [0,1,2,3,4,5,6].reduce((sum, i) => sum + getRowValue(i, 'receipt'), 0);
        
        // Update calculated row 8
        block7a.gridData = block7a.gridData.map((row, index) => {
          if (index === 7) { // Row 8
            return {
              ...row,
              receipt: totalReceipt.toString(),
              exported: '', // Not entry enabled
              export_percentage: '' // Not entry enabled
            };
          }
          return row;
        });
      }
    }
    
    // Handle Block 7B calculations
    if (blockId === 'block-7b') {
      const block7b = updatedSurvey.blocks.find(b => b.id === 'block-7b');
      if (block7b && block7b.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block7b.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Calculate row 11 (sum of rows 1-10) - index 10 (sum of index 0-9)
        const totalReceipt = [0,1,2,3,4,5,6,7,8,9].reduce((sum, i) => sum + getRowValue(i, 'receipt'), 0);
        
        // Update calculated row 11
        block7b.gridData = block7b.gridData.map((row, index) => {
          if (index === 10) { // Row 11
            return {
              ...row,
              receipt: totalReceipt.toString()
            };
          }
          return row;
        });
      }
    }
    
    // Handle Block 7C calculations
    if (blockId === 'block-7c') {
      const block7c = updatedSurvey.blocks.find(b => b.id === 'block-7c');
      const block4 = updatedSurvey.blocks.find(b => b.id === 'block-4');
      const block7b = updatedSurvey.blocks.find(b => b.id === 'block-7b');
      
      if (block7c && block7c.gridData) {
        const getRowValue = (rowIndex: number, columnId: string) => {
          return parseFloat(block7c.gridData![rowIndex][columnId] || '0') || 0;
        };
        
        // Get Block 4 values for calculations
        const block4Row4Closing = block4 && block4.gridData ? parseFloat(block4.gridData[3]?.closing || '0') || 0 : 0;
        const block4Row4Opening = block4 && block4.gridData ? parseFloat(block4.gridData[3]?.opening || '0') || 0 : 0;
        const block4Row5Closing = block4 && block4.gridData ? parseFloat(block4.gridData[4]?.closing || '0') || 0 : 0;
        const block4Row5Opening = block4 && block4.gridData ? parseFloat(block4.gridData[4]?.opening || '0') || 0 : 0;
        
        // Get Block 7B row 11 total (index 10)
        const block7bTotal = block7b && block7b.gridData ? 
          parseFloat(block7b.gridData[10]?.receipt || '0') || 0 : 0;
        
        // Calculate row 1: Block 4 item 4 (col 3 - col 4)
        const row1Value = block4Row4Closing - block4Row4Opening;
        
        // Calculate row 2: Block 4 item 5 (col 3 - col 4)
        const row2Value = block4Row5Closing - block4Row5Opening;
        
        // Calculate row 6: (item 1 + item 3 + item 4 + item 5) plus Block 7B row 11
        const row6Value = row1Value + getRowValue(2, 'receipt') + getRowValue(3, 'receipt') + getRowValue(4, 'receipt') + block7bTotal;
        
        // Update calculated rows
        block7c.gridData = block7c.gridData.map((row, index) => {
          switch (index) {
            case 0: // Row 1
              return {
                ...row,
                receipt: row1Value.toString()
              };
            case 1: // Row 2
              return {
                ...row,
                receipt: row2Value.toString()
              };
            case 5: // Row 6
              return {
                ...row,
                receipt: row6Value.toString()
              };
            default:
              return row;
          }
        });
      }
    }
    
    setCurrentSurvey(updatedSurvey);
    
    // Simulate auto-save
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 800);
  };

  const handleAddGridRow = (blockId: string) => {
    if (!currentSurvey) return;
    
    const updatedSurvey = {
      ...currentSurvey,
      blocks: currentSurvey.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              gridData: [
                ...(block.gridData || []),
                { sl_no: (block.gridData?.length || 0) + 1, district_name: '', district_code: '', frame_count: '', actual_count: '' }
              ]
            }
          : block
      )
    };
    
    setCurrentSurvey(updatedSurvey);
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

  // Helper function to check if a row is calculated in Block 6C
  const isBlock6CCalculatedRow = (blockId: string, rowIndex: number) => {
    if (blockId !== 'block-6c') return false;
    // Row 11 is calculated row in Block 6C (0-based index: 10)
    return rowIndex === 10;
  };

  // Helper function to check if a field should be disabled in Block 6C
  const isBlock6CDisabledField = (blockId: string, rowIndex: number, columnId: string) => {
    if (blockId !== 'block-6c') return false;
    // For all rows, disable sl_no, item_description, and item_code as they are pre-filled
    if (columnId === 'sl_no' || columnId === 'item_description' || columnId === 'item_code') {
      return true;
    }
    // For row 11 (index 10), also disable expenditure as it's calculated
    if (rowIndex === 10 && columnId === 'expenditure') {
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

  // Helper function to check if a field should be hidden in Block 5
  const isBlock5HiddenField = (blockId: string, rowIndex: number, columnId: string) => {
    if (blockId !== 'block-5') return false;
    // For Part B items (rows 13-16, 0-based index: 12-15), hide avg_days_worked and total_persons_worked
    if (rowIndex >= 12 && (columnId === 'avg_days_worked' || columnId === 'total_persons_worked')) {
      return true;
    }
    return false;
  };

  const isFieldDisabled = (blockId: string, rowIndex: number, columnId: string): boolean => {
    // Sl. No. is always disabled
    if (columnId === 'sl_no') return true;
    
    // Block 11: Main items and item code are disabled
    if (blockId === 'block-11') {
      return columnId === 'main_items' || columnId === 'item_code';
    }
    
    // Block 10: Items and current period are disabled
    if (blockId === 'block-10') {
      return columnId === 'items' || columnId === 'current_period';
    }

    return false;
  };

  const handleRemoveGridRow = (blockId: string, rowIndex: number) => {
    if (!currentSurvey) return;
    
    const updatedSurvey = {
      ...currentSurvey,
      blocks: currentSurvey.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              gridData: block.gridData?.filter((_, index) => index !== rowIndex).map((row, index) => ({
                ...row,
                sl_no: index + 1
              })) || []
            }
          : block
      )
    };
    
    setCurrentSurvey(updatedSurvey);
  };
  
  const handleSaveDraft = () => {
    // Save as draft logic
    console.log('Saving as draft...');
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      alert('Survey saved as draft successfully');
    }, 800);
  };

  const handleSubmitForScrutiny = () => {
    if (!currentSurvey) return;
    
    const updatedSurvey = {
      ...currentSurvey,
      status: 'scrutiny' as const
    };
    
    setCurrentSurvey(updatedSurvey);
    setIsEditing(false);
    console.log('Submitted for scrutiny');
  };

  const handleSave = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      alert('Survey block saved successfully');
    }, 800);
  };

  const renderField = (field: any, blockId: string) => {
    const isCalculatedField = blockId === 'block-5' && field.calculated;
    const isDisabled = currentSurvey?.status === 'scrutiny' || !isEditing || isCalculatedField;
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={field.value}
            onChange={(e) => handleFieldChange(blockId, field.id, e.target.value)}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? 'bg-gray-100' : ''} ${isCalculatedField ? 'bg-blue-50 border-blue-200' : ''}`}
            rows={3}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={field.value}
            onChange={(e) => handleFieldChange(blockId, field.id, e.target.value)}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? 'bg-gray-100' : ''} ${isCalculatedField ? 'bg-blue-50 border-blue-200' : ''}`}
          />
        );
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={field.value}
            onChange={(e) => handleFieldChange(blockId, field.id, e.target.value)}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? 'bg-gray-100' : ''} ${isCalculatedField ? 'bg-blue-50 border-blue-200' : ''}`}
          />
        );
    }
  };

  const renderBlock5Fields = (block: SurveyBlock) => {
    const workingDaysField = block.fields.find(f => f.id === 'working_days_enterprise');
    const partAFields = block.fields.filter(f => f.partA);
    const partBFields = block.fields.filter(f => f.partB);
    
    // Group Part A fields by category
    const partACategories = partAFields.reduce((acc, field) => {
      const category = field.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(field);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Group Part B fields by category
    const partBCategories = partBFields.reduce((acc, field) => {
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
            {renderField(workingDaysField, block.id)}
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
                  {fields.map((field) => (
                    <div key={field.id}>
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
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field, block.id)}
                    </div>
                  ))}
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
                  {fields.map((field) => (
                    <div key={field.id}>
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
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field, block.id)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGridBlock = (block: SurveyBlock) => {
    const isDisabled = currentSurvey?.status === 'scrutiny' || !isEditing;
    
    // Special handling for Block 4 - Working Capital calculations
    const isBlock4 = block.id === 'block-4';
    const isBlock4CalculatedRow = (rowIndex: number) => {
      if (!isBlock4) return false;
      // Rows 3, 6, 10, 14, 15 are calculated rows in Block 4
      return [2, 5, 9, 13, 14].includes(rowIndex); // 0-based index
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
    
    // Helper function to calculate Block 9 current period values
    const getBlock9CurrentPeriodValue = (rowIndex: number) => {
      // This would normally pull from other blocks, but for now return placeholder
      // In a real implementation, this would calculate based on the formulas specified
      switch (rowIndex) {
        case 0: return '1000000'; // Block 3, row 11, col 13
        case 1: return '500000';  // Block 4, row 15, col 3
        case 2: return '150';     // Block 5, row 10, col 4
        case 3: return '2000000'; // Block 5, row 16, col 5
        case 4: return '3000000'; // Block 6C, row 11, col 4
        case 5: return '5000000'; // Block 7C, row 6, col 4
        case 6: return '100000';  // Block 8 calculation
        case 7: return '4500000'; // Complex calculation
        case 8: return '1500000'; // Row 8 minus Row 5
        case 9: return '200000';  // Block 3, row 11, col 9
        case 10: return '1300000'; // Row 9 minus Row 10
        case 11: return '50000';   // Block 6C calculation
        case 12: return '75000';   // Block 6C calculation
        case 13: return '1175000'; // Row 11 minus calculations
        default: return '';
      }
    };
    
    // Helper function to calculate percentage change
    const calculatePercentageChange = (current: string, last: string) => {
      const currentVal = parseFloat(current) || 0;
      const lastVal = parseFloat(last) || 0;
      if (lastVal === 0) return '';
      const change = ((currentVal - lastVal) / lastVal) * 100;
      return change.toFixed(2);
    };
    
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                {block.gridColumns?.map((column) => (
                  <th key={column.id} className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
                {isEditing && (
                  <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {block.gridData?.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {block.gridColumns?.map((column) => (
                    <td key={column.id} className={`border border-gray-300 px-4 py-2 ${
                      isBlock5HiddenField(block.id, rowIndex, column.id) ? 'bg-gray-100' : ''
                    }`}>
                      {isBlock5HiddenField(block.id, rowIndex, column.id) ? (
                        <span className="text-gray-400">N/A</span>
                      ) : (
                      <input
                        type={column.type}
                        value={row[column.id] || ''}
                        onChange={(e) => {
                          if (block.id === 'block-6a' && rowIndex === 7 && column.id === 'expenditure') {
                            // Auto-calculate total for Block 6A row 8
                            const total = block.gridData?.slice(0, 7).reduce((sum: number, row: any) => {
                              return sum + (parseFloat(row.expenditure) || 0);
                            }, 0) || 0;
                            e.target.value = total.toString();
                          } else if (block.id === 'block-6b' && rowIndex === 10 && column.id === 'expenditure') {
                            // Auto-calculate total for Block 6B row 11
                            const total = block.gridData?.slice(0, 10).reduce((sum: number, row: any) => {
                              return sum + (parseFloat(row.expenditure) || 0);
                            }, 0) || 0;
                            e.target.value = total.toString();
                          } else if (block.id === 'block-7a' && rowIndex === 7 && column.id === 'receipt') {
                            // Auto-calculate total for Block 7A row 8
                            const total = block.gridData?.slice(0, 7).reduce((sum: number, row: any) => {
                              return sum + (parseFloat(row.receipt) || 0);
                            }, 0) || 0;
                            e.target.value = total.toString();
                          } else if (block.id === 'block-7b' && rowIndex === 10 && column.id === 'receipt') {
                            // Auto-calculate total for Block 7B row 11
                            const total = block.gridData?.slice(0, 10).reduce((sum: number, row: any) => {
                              return sum + (parseFloat(row.receipt) || 0);
                            }, 0) || 0;
                            e.target.value = total.toString();
                          } else if (block.id === 'block-7c' && rowIndex === 5 && column.id === 'receipt') {
                            // Auto-calculate total for Block 7C row 6
                            const row1 = parseFloat(block.gridData?.[0]?.receipt) || 0;
                            const row3 = parseFloat(block.gridData?.[2]?.receipt) || 0;
                            const row4 = parseFloat(block.gridData?.[3]?.receipt) || 0;
                            const row5 = parseFloat(block.gridData?.[4]?.receipt) || 0;
                            // Add Block 7B row 11 total (placeholder for now)
                            const block7BTotal = 1000000; // This would come from Block 7B
                            const total = row1 + row3 + row4 + row5 + block7BTotal;
                            e.target.value = total.toString();
                          } else if (block.id === 'block-9') {
                            // Handle Block 9 calculations
                            if (column.id === 'current_period') {
                              e.target.value = getBlock9CurrentPeriodValue(rowIndex);
                            } else if (column.id === 'percentage_change') {
                              const current = row.current_period || getBlock9CurrentPeriodValue(rowIndex);
                              const last = row.last_period || '';
                              e.target.value = calculatePercentageChange(current, last);
                            } else if (column.id === 'last_period') {
                              // When last period changes, recalculate percentage
                              const current = row.current_period || getBlock9CurrentPeriodValue(rowIndex);
                              const percentageChange = calculatePercentageChange(current, e.target.value);
                              // Update the percentage change field (this would need state management in real implementation)
                            }
                          }
                          
                          handleGridDataChange(block.id, rowIndex, column.id, e.target.value);
                        }}
                        disabled={isDisabled || column.id === 'sl_no' || column.id === 'items' || column.id === 'category_of_staff' || 
                                 (isBlock4 && isBlock4CalculatedRow(rowIndex) && (column.id === 'closing' || column.id === 'opening')) ||
                                 (isBlock5CalculatedRow(block.id, rowIndex)) ||
                                 (isBlock6ACalculatedRow(block.id, rowIndex) && column.id === 'expenditure') ||
                                 (isBlock6ADisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock6BCalculatedRow(block.id, rowIndex) && column.id === 'expenditure') ||
                                 (isBlock6BDisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock6CCalculatedRow(block.id, rowIndex) && column.id === 'expenditure') ||
                                 (isBlock6CDisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock7ACalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                 (isBlock7ADisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock7BCalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                 (isBlock7BDisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock7CCalculatedRow(block.id, rowIndex) && column.id === 'receipt') ||
                                 (isBlock7CDisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock8DisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock9DisabledField(block.id, rowIndex, column.id)) ||
                                 (isBlock10DisabledField(block.id, rowIndex, column.id)) ||
                                 (isFieldDisabled(block.id, rowIndex, column.id))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      />
                      )}
                    </td>
                  ))}
                  {isEditing && (
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemoveGridRow(block.id, rowIndex)}
                        disabled={block.gridData?.length === 1}
                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Remove Row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(isBlock4 || block.id === 'block-5') && (
          <div className="flex justify-start">
            <button
              onClick={() => handleAddGridRow(block.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Row</span>
            </button>
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
      </div>
    );
  };
  
  if (!currentSurvey) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Survey Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Allocated Surveys</h3>
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
                    Status
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
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        survey.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                        survey.status === 'submitted' ? 'bg-green-100 text-green-800' :
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
                        onClick={() => setCurrentSurvey(survey)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>Start Survey</span>
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

  const handleNavigateToBlock = (index: number) => {
    setCurrentBlock(index);
    setShowBlockDropdown(false);
  };

  const currentBlockData = currentSurvey.blocks[currentBlock];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentSurvey(null)}
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            title="Back to Survey List"
          >
            <ArrowLeft size={16} />
            <span>Back to Survey List</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Survey Management
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${
            autoSaveStatus === 'saved' ? 'text-green-600' :
            autoSaveStatus === 'saving' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {autoSaveStatus === 'saved' ? 'All changes saved' :
             autoSaveStatus === 'saving' ? 'Saving...' :
             'Save failed'}
          </span>
          {currentSurvey.status === 'draft' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEditing 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? 'View Mode' : 'Edit Mode'}
            </button>
          )}
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
                {currentSurvey.blocks[currentBlock].name.split(':')[0]}
                <ChevronDown size={16} className="ml-2" />
              </button>
              
              {showBlockDropdown && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                  {currentSurvey.blocks.map((block, index) => (
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
            {currentSurvey.blocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => setCurrentBlock(index)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  index === currentBlock
                    ? 'bg-blue-600 text-white'
                    : block.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentBlock + 1) / currentSurvey.blocks.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Survey Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentBlockData.name}</h3>
        {currentBlockData.description && (
          <p className="text-sm text-gray-600 mb-6">{currentBlockData.description}</p>
        )}
        
        {currentBlockData.isGrid ? (
          renderGridBlock(currentBlockData)
        ) : currentBlockData.id === 'block-5' ? (
          <div className="space-y-6">
            {/* Working Days Field */}
            {currentBlockData.fields.map((field) => (
              <div key={field.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field, currentBlockData.id)}
              </div>
            ))}
            
            {/* Grid for employment data */}
            {renderGridBlock(currentBlockData)}
          </div>
        ) : (
          <div className="space-y-6">
            {currentBlockData.fields.map((field) => (
              <div key={field.id}>
                <label 
                  htmlFor={field.id} 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field, currentBlockData.id)}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              if (currentBlock > 0) {
                setCurrentBlock(currentBlock - 1);
              }
            }}
            disabled={currentBlock === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex space-x-3">
            {isEditing && (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            )}
            
            {isEditing && (
              <button
                onClick={handleSaveDraft}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Save size={16} />
                <span>Save Draft</span>
              </button>
            )}
            
            {currentBlock === currentSurvey.blocks.length - 1 && isEditing && (
              <button
                onClick={handleSubmitForScrutiny}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send size={16} />
                <span>Submit for Scrutiny</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (currentBlock < currentSurvey.blocks.length - 1) {
                setCurrentBlock(currentBlock + 1);
              }
            }}
            disabled={currentBlock === currentSurvey.blocks.length - 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyManagement;