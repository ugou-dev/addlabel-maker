import { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { AddressData } from '../types';

interface ManualInputProps {
  onDataLoaded: (data: AddressData[]) => void;
  onBack: () => void;
}

interface FormData {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  companyName: string;
  title: string;
  recipientName: string;
  honorific: string;
  lineBreakAfterCompany: boolean;
  lineBreakAfterTitle: boolean;
}

const emptyAddress = (): FormData => ({
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  companyName: '',
  title: '',
  recipientName: '',
  honorific: '様',
  lineBreakAfterCompany: false,
  lineBreakAfterTitle: false,
});

export default function ManualInput({ onDataLoaded, onBack }: ManualInputProps) {
  const [addresses, setAddresses] = useState<FormData[]>([emptyAddress()]);

  const addAddress = () => {
    if (addresses.length >= 20) {
      alert('最大20件まで登録できます');
      return;
    }
    setAddresses([...addresses, emptyAddress()]);
  };

  const removeAddress = (index: number) => {
    if (addresses.length === 1) {
      alert('最低1件は必要です');
      return;
    }
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index: number, field: keyof FormData, value: string | boolean) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validAddresses = addresses.filter(addr => addr.recipientName.trim() !== '');
    if (validAddresses.length === 0) {
      alert('氏名を入力してください');
      return;
    }

    const formattedAddresses: AddressData[] = validAddresses.map(addr => {
      const recipientParts: string[] = [];
      const lineBreaks: boolean[] = [];

      if (addr.companyName) {
        recipientParts.push(addr.companyName);
        lineBreaks.push(addr.lineBreakAfterCompany);
      }
      if (addr.title) {
        recipientParts.push(addr.title);
        lineBreaks.push(addr.lineBreakAfterTitle);
      }
      recipientParts.push(addr.recipientName + addr.honorific);
      lineBreaks.push(false);

      const addressLines = [
        addr.postalCode,
        addr.prefecture + addr.city,
        addr.addressLine1,
        addr.addressLine2,
      ].filter(v => v);

      return {
        recipientLines: recipientParts,
        addressLines,
        recipientLineBreaks: lineBreaks,
      };
    });

    onDataLoaded(formattedAddresses);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex-1">宛先を入力</h2>
        <button
          type="button"
          onClick={addAddress}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          追加
        </button>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {addresses.map((address, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">宛先 {index + 1}</h3>
              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  郵便番号
                </label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                  placeholder="123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  都道府県
                </label>
                <input
                  type="text"
                  value={address.prefecture}
                  onChange={(e) => updateAddress(index, 'prefecture', e.target.value)}
                  placeholder="東京都"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  市区町村
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => updateAddress(index, 'city', e.target.value)}
                  placeholder="渋谷区"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  番地
                </label>
                <input
                  type="text"
                  value={address.addressLine1}
                  onChange={(e) => updateAddress(index, 'addressLine1', e.target.value)}
                  placeholder="道玄坂1-2-3"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  建物名・部屋番号（任意）
                </label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => updateAddress(index, 'addressLine2', e.target.value)}
                  placeholder="渋谷ビル 101号室"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  会社名（任意）
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={address.companyName}
                    onChange={(e) => updateAddress(index, 'companyName', e.target.value)}
                    placeholder="株式会社サンプル"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {address.companyName && (
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={address.lineBreakAfterCompany}
                        onChange={(e) => updateAddress(index, 'lineBreakAfterCompany', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">会社名の後で改行</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  役職（任意）
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={address.title}
                    onChange={(e) => updateAddress(index, 'title', e.target.value)}
                    placeholder="営業部長"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {address.title && (
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={address.lineBreakAfterTitle}
                        onChange={(e) => updateAddress(index, 'lineBreakAfterTitle', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">役職の後で改行</span>
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.recipientName}
                  onChange={(e) => updateAddress(index, 'recipientName', e.target.value)}
                  placeholder="山田太郎"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  敬称
                </label>
                <select
                  value={address.honorific}
                  onChange={(e) => updateAddress(index, 'honorific', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="様">様</option>
                  <option value="殿">殿</option>
                  <option value="御中">御中</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        次へ進む
      </button>
    </form>
  );
}
