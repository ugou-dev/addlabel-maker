import { useState } from 'react';
import { Settings, Download, ArrowLeft } from 'lucide-react';
import { AddressData, LabelTemplate, SenderData } from '../types';
import { LABEL_TEMPLATES } from '../lib/labelTemplates';
import AdSense from './AdSense';

interface PrintSettingsProps {
  addresses: AddressData[];
  onGeneratePdf: (
    template: LabelTemplate,
    startPosition: number,
    offsetX: number,
    offsetY: number,
    includeSender: boolean,
    senderData: SenderData | null,
    fontFamily: 'mincho' | 'gothic'
  ) => void;
  onBack: () => void;
}

export default function PrintSettings({ addresses, onGeneratePdf, onBack }: PrintSettingsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate>(LABEL_TEMPLATES[0]);
  const [startPosition, setStartPosition] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [includeSender, setIncludeSender] = useState(false);
  const [fontFamily, setFontFamily] = useState<'mincho' | 'gothic'>('gothic');
  const [senderData, setSenderData] = useState<SenderData>({
    postalCode: '',
    address: '',
    name: '',
  });
  const handleGenerate = () => {
    const sender = includeSender && senderData.name ? senderData : null;
    onGeneratePdf(
      selectedTemplate,
      startPosition,
      offsetX,
      offsetY,
      includeSender,
      sender,
      fontFamily
    );
  };

  return (
    <>
      <AdSense
        adSlot="1111111111"
        adFormat="horizontal"
        className="mb-6"
      />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">印刷設定</h2>
        </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用紙の種類
            </label>
            <select
              value={selectedTemplate.code}
              onChange={(e) => {
                const template = LABEL_TEMPLATES.find(t => t.code === e.target.value);
                if (template) setSelectedTemplate(template);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LABEL_TEMPLATES.map((template) => (
                <option key={template.code} value={template.code}>
                  {template.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTemplate.rows}行 × {selectedTemplate.cols}列（全{selectedTemplate.totalLabels}面）
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              印刷開始位置
            </label>
            <div className="grid grid-cols-6 gap-2 mb-2">
              {Array.from({ length: selectedTemplate.totalLabels }).map((_, index) => {
                const position = index + 1;
                return (
                  <button
                    key={position}
                    type="button"
                    onClick={() => setStartPosition(position)}
                    className={`aspect-square rounded border-2 text-sm font-medium transition-colors ${
                      startPosition === position
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {position}
                  </button>
                );
              })}
            </div>
            <input
              type="number"
              min="1"
              max={selectedTemplate.totalLabels}
              value={startPosition}
              onChange={(e) => setStartPosition(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {startPosition}枚目から印刷開始
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ズレ補正
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">右に (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">下に (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              マイナス値で左・上に移動
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              フォント
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as 'mincho' | 'gothic')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="gothic">ゴシック体</option>
              <option value="mincho">明朝体</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={includeSender}
                onChange={(e) => setIncludeSender(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">差出人を印刷する</span>
            </label>

            {includeSender && (
              <div className="space-y-3 pl-6 border-l-2 border-blue-500">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">郵便番号</label>
                  <input
                    type="text"
                    value={senderData.postalCode}
                    onChange={(e) => setSenderData({ ...senderData, postalCode: e.target.value })}
                    placeholder="123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">住所</label>
                  <input
                    type="text"
                    value={senderData.address}
                    onChange={(e) => setSenderData({ ...senderData, address: e.target.value })}
                    placeholder="東京都渋谷区道玄坂1-2-3"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">氏名</label>
                  <input
                    type="text"
                    value={senderData.name}
                    onChange={(e) => setSenderData({ ...senderData, name: e.target.value })}
                    placeholder="山田太郎"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Settings className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">登録件数</h3>
                <p className="text-blue-800 text-sm">{addresses.length}件</p>
                <p className="text-xs text-blue-700 mt-2">
                  {Math.ceil((addresses.length + startPosition - 1) / selectedTemplate.totalLabels)}枚のシートが必要です
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <button
          onClick={handleGenerate}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Download size={20} />
          PDFを生成してダウンロード
        </button>
      </div>

      <AdSense
        adSlot="2222222222"
        adFormat="horizontal"
        className="mt-6"
      />

    </>
  );
}
