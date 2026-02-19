import { useState, useCallback } from 'react';
import { Upload, FileText, ArrowLeft, GripVertical, X, Eye, Plus } from 'lucide-react';
import { AddressData, FieldMapping } from '../types';

interface CsvUploadProps {
  onDataLoaded: (data: AddressData[]) => void;
  onBack: () => void;
}

interface CsvColumn {
  index: number;
  name: string;
  sample: string;
}

type AreaType = 'recipient' | 'address';

export default function CsvUpload({ onDataLoaded, onBack }: CsvUploadProps) {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columns, setColumns] = useState<CsvColumn[]>([]);
  const [recipientFields, setRecipientFields] = useState<FieldMapping[]>([]);
  const [addressFields, setAddressFields] = useState<FieldMapping[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const [draggedField, setDraggedField] = useState<{ area: AreaType; index: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const parsed = lines.map(line => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      });

      if (parsed.length > 0) {
        const hasHeader = parsed[0].some(cell =>
          /[ぁ-んァ-ヶー一-龠]/.test(cell) || /name|address|postal/i.test(cell)
        );

        const dataRows = hasHeader ? parsed.slice(1) : parsed;
        const headerRow = hasHeader ? parsed[0] : parsed[0].map((_, i) => `列${i + 1}`);

        setCsvData(dataRows);
        setColumns(
          headerRow.map((name, index) => ({
            index,
            name,
            sample: dataRows[0]?.[index] || '',
          }))
        );
        setShowMapping(true);
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      handleFileUpload({ target: input } as any);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleColumnDragStart = (columnIndex: number) => {
    setDraggedColumn(columnIndex);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
  };

  const handleFieldDragStart = (area: AreaType, index: number) => {
    setDraggedField({ area, index });
  };

  const handleFieldDragEnd = () => {
    setDraggedField(null);
  };

  const handleAreaDrop = (area: AreaType, e: React.DragEvent) => {
    e.preventDefault();

    if (draggedColumn !== null) {
      const col = columns[draggedColumn];
      const fields = area === 'recipient' ? recipientFields : addressFields;
      const setFields = area === 'recipient' ? setRecipientFields : setAddressFields;

      setFields([
        ...fields,
        {
          columnIndex: draggedColumn,
          columnName: col.name,
          order: fields.length,
          defaultValue: '',
          lineBreakAfter: false,
        },
      ]);
    } else if (draggedField !== null) {
      const sourceFields = draggedField.area === 'recipient' ? recipientFields : addressFields;
      const targetFields = area === 'recipient' ? recipientFields : addressFields;
      const setSourceFields = draggedField.area === 'recipient' ? setRecipientFields : setAddressFields;
      const setTargetFields = area === 'recipient' ? setRecipientFields : setAddressFields;

      if (draggedField.area === area) {
        return;
      }

      const field = sourceFields[draggedField.index];
      const newSourceFields = sourceFields.filter((_, i) => i !== draggedField.index);
      const newTargetFields = [...targetFields, { ...field, order: targetFields.length }];

      setSourceFields(newSourceFields);
      setTargetFields(newTargetFields);
    }

    setDraggedColumn(null);
    setDraggedField(null);
  };

  const handleFieldOrderDrop = (area: AreaType, targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedField && draggedField.area === area) {
      const fields = area === 'recipient' ? recipientFields : addressFields;
      const setFields = area === 'recipient' ? setRecipientFields : setAddressFields;

      const newFields = [...fields];
      const [removed] = newFields.splice(draggedField.index, 1);
      newFields.splice(targetIndex, 0, removed);

      setFields(newFields.map((f, i) => ({ ...f, order: i })));
    }

    setDraggedField(null);
  };

  const handleRemoveField = (area: AreaType, index: number) => {
    if (area === 'recipient') {
      setRecipientFields(recipientFields.filter((_, i) => i !== index));
    } else {
      setAddressFields(addressFields.filter((_, i) => i !== index));
    }
  };

  const handleDefaultValueChange = (area: AreaType, index: number, value: string) => {
    if (area === 'recipient') {
      const newFields = [...recipientFields];
      newFields[index] = { ...newFields[index], defaultValue: value };
      setRecipientFields(newFields);
    } else {
      const newFields = [...addressFields];
      newFields[index] = { ...newFields[index], defaultValue: value };
      setAddressFields(newFields);
    }
  };

  const handleLineBreakChange = (area: AreaType, index: number, checked: boolean) => {
    if (area === 'recipient') {
      const newFields = [...recipientFields];
      newFields[index] = { ...newFields[index], lineBreakAfter: checked };
      setRecipientFields(newFields);
    } else {
      const newFields = [...addressFields];
      newFields[index] = { ...newFields[index], lineBreakAfter: checked };
      setAddressFields(newFields);
    }
  };

  const generateAddresses = (): AddressData[] => {
    return csvData.map(row => {
      const recipientLines = recipientFields.map(field => {
        const value = row[field.columnIndex] || field.defaultValue || '';
        return value;
      }).filter(v => v);

      const recipientLineBreaks = recipientFields
        .filter(field => {
          const value = row[field.columnIndex] || field.defaultValue || '';
          return value;
        })
        .map(field => field.lineBreakAfter || false);

      const addressLines = addressFields.map(field => {
        const value = row[field.columnIndex] || field.defaultValue || '';
        return value;
      }).filter(v => v);

      return {
        recipientLines,
        addressLines,
        recipientLineBreaks,
      };
    });
  };

  const handleMappingComplete = () => {
    const addresses = generateAddresses();
    onDataLoaded(addresses);
  };

  if (showMapping) {
    if (showPreview) {
      const previewData = generateAddresses().slice(0, 5);
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">プレビュー</h2>
            </div>
            <span className="text-sm text-gray-600">全{csvData.length}件中 最初の5件を表示</span>
          </div>

          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {previewData.map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">宛名</h4>
                    <div className="space-y-1">
                      {data.recipientLines.length > 0 ? (
                        data.recipientLines.map((line, i) => (
                          <div key={i} className="text-sm text-gray-800">{line}</div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 italic">(未設定)</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">住所</h4>
                    <div className="space-y-1">
                      {data.addressLines.length > 0 ? (
                        data.addressLines.map((line, i) => (
                          <div key={i} className="text-sm text-gray-800">{line}</div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400 italic">(未設定)</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMappingComplete}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              この内容で確定（{csvData.length}件）
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              マッピングに戻る
            </button>
          </div>
        </div>
      );
    }

    const renderArea = (area: AreaType, fields: FieldMapping[], title: string) => {
      const isDragActive = draggedColumn !== null || (draggedField && draggedField.area !== area);

      return (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-1">
            {title}
          </h4>
          <div
            onDrop={(e) => handleAreaDrop(area, e)}
            onDragOver={handleDragOver}
            className={`min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-all ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 border-[3px] shadow-lg'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {fields.length === 0 ? (
              <div className="flex items-center justify-center h-full py-12">
                <div className="text-center">
                  <Plus className="mx-auto mb-3 text-gray-400" size={32} />
                  <div className={`text-sm font-medium transition-colors ${
                    isDragActive ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    CSV列をここにドロップ
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={index}
                    onDrop={(e) => handleFieldOrderDrop(area, index, e)}
                    onDragOver={handleDragOver}
                    className={`p-3 bg-white border-2 rounded-lg transition-colors ${
                      draggedField?.area === area && draggedField?.index === index
                        ? 'border-blue-500 opacity-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleFieldDragStart(area, index);
                        }}
                        onDragEnd={handleFieldDragEnd}
                        className="cursor-move flex-shrink-0"
                      >
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{field.columnName}</div>
                        <div className="text-xs text-gray-500 truncate">
                          例: {csvData[0]?.[field.columnIndex] || '(なし)'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveField(area, index)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="ml-6 space-y-2">
                      <label className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">デフォルト値:</span>
                        <input
                          type="text"
                          value={field.defaultValue}
                          onChange={(e) => handleDefaultValueChange(area, index, e.target.value)}
                          placeholder="空欄時の値"
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </label>
                      {area === 'recipient' && (
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.lineBreakAfter || false}
                            onChange={(e) => handleLineBreakChange(area, index, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-600">この項目の後で改行</span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
                {isDragActive && (
                  <div className="flex items-center justify-center py-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
                    <Plus className="text-blue-500 mr-2" size={20} />
                    <span className="text-sm text-blue-600 font-medium">ここにドロップして追加</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">列のマッピング</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          左側のCSV列を右側の宛名エリアまたは住所エリアにドラッグ&ドロップしてください。同じ列を複数回使用したり、エリア内での順序を変更することもできます。
        </p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">CSV列</h3>
            <div className="space-y-2">
              {columns.map((col) => {
                return (
                  <div
                    key={col.index}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      draggedColumn === col.index
                        ? 'border-blue-500 opacity-50 bg-gray-50'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleColumnDragStart(col.index);
                        }}
                        onDragEnd={handleColumnDragEnd}
                        className="cursor-move flex-shrink-0"
                      >
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">{col.name}</div>
                        <div className="text-xs text-gray-500 truncate">例: {col.sample}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-700">配置エリア</h3>
            {renderArea('recipient', recipientFields, '宛名エリア')}
            {renderArea('address', addressFields, '住所エリア')}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            disabled={recipientFields.length === 0 && addressFields.length === 0}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            <Eye size={20} />
            プレビューを確認（{csvData.length}件）
          </button>
          <button
            onClick={() => {
              setShowMapping(false);
              setCsvData([]);
              setColumns([]);
              setRecipientFields([]);
              setAddressFields([]);
            }}
            className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">CSVファイルをアップロード</h2>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          CSVファイルをドラッグ＆ドロップ
        </h3>
        <p className="text-sm text-gray-600 mb-4">または</p>
        <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium">
          <FileText size={20} />
          ファイルを選択
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <div className="mt-6 text-xs text-gray-500">
          <p className="font-semibold mb-2">プライバシーについて</p>
          <p>アップロードされた個人情報はサーバーに保存されません。</p>
          <p>すべてブラウザ内で処理され、PDF生成後は即座に削除されます。</p>
        </div>
      </div>
    </div>
  );
}
